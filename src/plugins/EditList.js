// @flow
import EditList from "@tommoor/slate-edit-list";

export default EditList({
  types: ["ordered-list", "bulleted-list"],
  typeItem: "list-item",
  typeDefault: "paragraph",
});
