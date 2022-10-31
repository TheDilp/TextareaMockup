import "./App.css";
import {
  BoldExtension,
  BulletListExtension,
  ItalicExtension,
  LinkExtension,
  MentionAtomExtension,
  OrderedListExtension,
  ParagraphExtension,
} from "remirror/extensions";
import {
  useRemirror,
  useCommands,
  useActive,
  Remirror,
  EditorComponent,
} from "@remirror/react";
import { MentionSuggestor } from "./component/MentionSuggestor";
import { useMemo } from "react";

const Mention = ({ node }) => {
  const {
    attrs: { label, name, variant },
  } = node;
  let classes = "rounded  w-fit text-white px-4 py-1 mx-1 inline";
  if (variant === "dangerFill") classes += " bg-red-600";
  else if (variant === "successFill") classes += " bg-green-600";
  else if (variant === "primaryFill") classes += " bg-slate-600";
  else if (variant === "warningBorder") classes += " border-orange-500 border";
  else classes += " bg-blue-400";
  return (
    <div className={classes}>
      {label} ({name})
    </div>
  );
};
export const Menu = () => {
  const { toggleBold, toggleItalic, focus } = useCommands();
  const active = useActive();
  return (
    <div className="flex">
      <button
        className="bg-white rounded w-8"
        onClick={() => {
          toggleBold();
          focus();
        }}
        style={{ fontWeight: active.bold() ? "bold" : "normal" }}
      >
        B
      </button>
      <button
        className="bg-white rounded w-8"
        onClick={() => {
          toggleItalic();
          focus();
        }}
      >
        <i>I</i>
      </button>
    </div>
  );
};
function App() {
  const CustomMentionExtension = new MentionAtomExtension({
    matchers: [
      {
        name: "client",
        char: "@",
      },
      {
        name: "deal",
        char: "$",
      },
      {
        name: "task",
        char: "#",
      },
    ],
    extraAttributes: {
      icon: {
        default: () => null,
        toDom: (node) => node.attrs.icon,
      },
      variant: {
        default: () => "primaryFill",
        toDom: (node) => node.attrs.variant,
      },
    },
  });
  CustomMentionExtension.ReactComponent = useMemo(() => Mention, []);
  const { manager, state } = useRemirror({
    extensions: () => [
      new BoldExtension(),
      new ItalicExtension(),
      new OrderedListExtension(),
      new BulletListExtension(),
      new LinkExtension({
        autoLink: true,
      }),
      new ParagraphExtension(),
      CustomMentionExtension,
    ],
  });
  return (
    <main className="bg-slate-800 w-screen h-screen">
      <div className="remirror-theme">
        {/* the className is used to define css variables necessary for the editor */}
        <Remirror
          classNames={[
            "w-full",
            "h-56",
            "p-4",
            "text-white",
            "border-white",
            "border-2",
            "focus:outline-none",
          ]}
          manager={manager}
          initialContent={state}
        >
          <Menu />
          <EditorComponent />
          <MentionSuggestor />
        </Remirror>

        <div className="text-white">
          Try: "@J", "$L" or "#D" and press enter
        </div>
      </div>
    </main>
  );
}

export default App;
