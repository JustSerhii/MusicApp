from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
from typing import List, Dict
from dotenv import load_dotenv
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
LASTFM_API_KEY = os.getenv("LASTFM_API_KEY")

# Valid country codes (from frontend's countryCodeMap)
VALID_COUNTRY_CODES = {
    "US", "UA", "DE", "FR", "PL", "JP",
    "AU", "IT", "ES", "CA", "NL", "SE"
}


async def fetch_youtube_browse_charts(country_code: str) -> List[Dict]:
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"https://content.googleapis.com/youtubei/v1/browse?alt=json&key={YOUTUBE_API_KEY}",
                headers={
                    "x-referer": "https://artists.youtube.com",
                    "Content-Type": "application/json",
                },
                json={
                    "context": {
                        "client": {
                            "clientName": "WEB_MUSIC_ANALYTICS",
                            "clientVersion": "0.2",
                            "theme": "MUSIC",
                            "hl": "en",
                            "gl": country_code.upper(),
                            "experimentIds": []
                        },
                        "capabilities": {},
                        "request": {
                            "internalExperimentFlags": []
                        }
                    },
                    "browseId": "FEmusic_analytics",
                    "query": "chart_params_type=WEEK&perspective=CHART&selected_chart=TRACKS"
                }
            )
            data = response.json()
            print(f"YouTube Browse Response for {country_code}:", data)  # Debug

            if "error" in data:
                print(f"YouTube Browse Error: {data['error']}")
                return []

            tracks = []
            # Adjusted parsing based on typical YouTube Music chart structure
            contents = (
                data.get("contents", {})
                .get("singleColumnBrowseResultsRenderer", {})
                .get("tabs", [{}])[0]
                .get("tabRenderer", {})
                .get("content", {})
                .get("sectionListRenderer", {})
                .get("contents", [])
            )

            for section in contents:
                chart_items = section.get("musicAnalyticsChartItemRenderer", {}).get("items", [])
                for item in chart_items:
                    title = item.get("title", {}).get("text", "")
                    artist = item.get("subtitle", [{}])[0].get("text", "") if item.get("subtitle") else ""
                    video_id = item.get("videoId", "")
                    thumbnail = item.get("thumbnail", {}).get("thumbnails", [{}])[0].get("url", "")
                    views = item.get("viewCount", "N/A")

                    # Clean up title and artist
                    if " - " in title and not artist:
                        artist, title = title.split(" - ", 1)
                        artist = artist.strip()
                        title = title.strip()

                    if title and artist:
                        tracks.append({
                            "title": title,
                            "artist": artist,
                            "videoId": video_id,
                            "thumbnail": thumbnail,
                            "views": views
                        })

            return tracks[:30]
    except Exception as e:
        print(f"Error in YouTube Browse for {country_code}: {str(e)}")
        return []

async def fetch_youtube_videos_charts(country_code: str) -> List[Dict]:
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://www.googleapis.com/youtube/v3/videos",
                params={
                    "part": "snippet,statistics",
                    "chart": "mostPopular",
                    "videoCategoryId": "10",
                    "maxResults": 30,
                    "regionCode": country_code.upper(),
                    "key": YOUTUBE_API_KEY,
                },
                headers={
                    "x-referer": "https://artists.youtube.com",
                },
            )
            data = response.json()

            if "error" in data:
                print(f"YouTube Videos Error for {country_code}: {data['error']}")
                return []

            tracks = []
            for item in data.get("items", []):
                title = item["snippet"]["title"]
                artist = item["snippet"]["channelTitle"]
                if " - " in title:
                    artist, title = title.split(" - ", 1)
                    artist = artist.strip()
                    title = title.strip()

                tracks.append({
                    "title": title,
                    "artist": artist,
                    "videoId": item["id"],
                    "thumbnail": item["snippet"]["thumbnails"]["medium"]["url"],
                    "views": item.get("statistics", {}).get("viewCount", "N/A"),
                })

            return tracks[:30]
    except Exception as e:
        print(f"Error in YouTube Videos for {country_code}: {str(e)}")
        return []

async def fetch_lastfm_top_tracks(country: str) -> List[Dict]:
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://ws.audioscrobbler.com/2.0/?method=geo.gettoptracks&country={country}&api_key={LASTFM_API_KEY}&format=json&limit=30"
            )
            data = response.json()

            if "error" in data:
                print(f"Last.fm Error for {country}: {data['error']}")
                return []

            tracks = []
            for item in data.get("tracks", {}).get("track", []):
                title = item["name"]
                artist = item["artist"]["name"]
                # Optional: Search YouTube for videoId
                yt_response = await client.get(
                    f"https://www.googleapis.com/youtube/v3/search",
                    params={
                        "part": "id",
                        "q": f"{artist} {title}",
                        "type": "video",
                        "videoCategoryId": "10",
                        "maxResults": 1,
                        "key": YOUTUBE_API_KEY,
                    },
                    headers={
                        "x-referer": "https://artists.youtube.com",
                    },
                )
                yt_data = yt_response.json()
                video_id = yt_data.get("items", [{}])[0].get("id", {}).get("videoId", "")

                tracks.append({
                    "title": title,
                    "artist": artist,
                    "videoId": video_id,
                    "thumbnail": item.get("image", [{}])[-1].get("#text", ""),
                    "views": "N/A",
                })

            return tracks[:30]
    except Exception as e:
        print(f"Error in Last.fm for {country}: {str(e)}")
        return []

@app.get("/charts/{country_code}")
async def get_charts(country_code: str):
    # Validate country code
    country_code = country_code.upper()
    if country_code not in VALID_COUNTRY_CODES:
        raise HTTPException(status_code=400, detail=f"Invalid country code: {country_code}. Supported: {', '.join(VALID_COUNTRY_CODES)}")

    try:
        # Try youtubei/v1/browse
        tracks = await fetch_youtube_browse_charts(country_code)
        if tracks:
            return {"tracks": tracks}

        # Fallback to /videos
        tracks = await fetch_youtube_videos_charts(country_code)
        if tracks:
            return {"tracks": tracks}

        # Fallback to Last.fm
        country_name = next((k for k, v in {
            "United States": "US",
            "Ukraine": "UA",
            "Germany": "DE",
            "France": "FR",
            "Poland": "PL",
            "Japan": "JP"
        }.items() if v == country_code), "United States")
        tracks = await fetch_lastfm_top_tracks(country_name)
        return {"tracks": tracks}

    except Exception as e:
        print(f"Error fetching charts for {country_code}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching charts: {str(e)}")