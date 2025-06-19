import { check, todo, home, book, musicNote, heart, headphones, guitar, mysongs} from "./Icons";

const menu = [
  {
    id: 1,
    title: "All songs",
    icon: home,
    link: "/",
  },
  {
    id: 2,
    title: "Got it!",
    icon: check,
    link: "/completed",
  },
  {
    id: 3,
    title: "To learn",
    icon: todo,
    link: "/incomplete",
  },

  {
    id: 4,
    title: "Chords",
    icon: book,
    link: "/chords",
  },

  {
    id: 5,
    title: "Fretboard",
    icon: guitar,
    link: "/notes",
  },

  {
    id: 6,
    title: "Playlists",
    icon: headphones,
    link: "/playlist",
  },
  {
    id: 7,
    title: "Explore",
    icon: musicNote,
    link: "/recs",
  },
  {
    id: 8,
    title: "Favourite",
    icon: heart,
    link: "/likedsongs",
  },
  {
    id: 9,
    title: "My songs",
    icon: mysongs,
    link: "/mysongs",
  },

];

export default menu;