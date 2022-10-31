import { FloatingWrapper, useMentionAtom } from "@remirror/react";
import { useState, useEffect } from "react";
import { cx } from "remirror";
export const MentionSuggestor = () => {
  const CLIENTS = [
    { id: "joe", label: "Joe" },
    { id: "sue", label: "Sue", variant: "successFill" },
    { id: "pat", label: "Pat" },
    { id: "tom", label: "Tom" },
    { id: "jim", label: "Jim" },
  ];
  const DEALS = [
    { id: "a", label: "Loan", variant: "dangerFill" },
    { id: "b", label: "HomeLoan", variant: "successFill" },
    { id: "c", label: "WebQ", variant: "warningBorder" },
  ];
  const TASKS = [
    { id: "f", label: "Create Deal" },
    { id: "h", label: "Delete Deal" },
    { id: "k", label: "Call Client" },
  ];

  const [options, setOptions] = useState([]);
  const { state, getMenuProps, getItemProps, indexIsHovered, indexIsSelected } =
    useMentionAtom({
      items: options,
    });

  useEffect(() => {
    if (!state) {
      return;
    }
    let filteredOptions;
    const searchTerm = state.query.full.toLowerCase();

    if (state.name === "client") {
      filteredOptions = CLIENTS.filter((user) =>
        user.label.toLowerCase().includes(searchTerm)
      )
        .sort()
        .slice(0, 5);
    } else if (state.name === "deal") {
      filteredOptions = DEALS.filter((user) =>
        user.label.toLowerCase().includes(searchTerm)
      )
        .sort()
        .slice(0, 5);
    } else if (state.name === "task") {
      filteredOptions = TASKS.filter((user) =>
        user.label.toLowerCase().includes(searchTerm)
      )
        .sort()
        .slice(0, 5);
    }

    setOptions(filteredOptions);
  }, [state]);

  const enabled = Boolean(state);

  return (
    <FloatingWrapper
      positioner="cursor"
      enabled={enabled}
      placement="bottom-start"
      containerClass="bg-white rounded text-black w-32 text-sm overflow-hidden"
    >
      <div {...getMenuProps()} className="suggestions">
        {enabled &&
          options.map((user, index) => {
            const isHighlighted = indexIsSelected(index);
            const isHovered = indexIsHovered(index);

            return (
              <div
                key={user.id}
                className={cx(
                  "suggestion odd:border-y pl0-4",
                  isHighlighted && "bg-blue-700 text-white",
                  isHovered && "bg-blue-700 text-white"
                )}
                {...getItemProps({
                  item: user,
                  index,
                })}
              >
                {user.label}
              </div>
            );
          })}
      </div>
    </FloatingWrapper>
  );
};
