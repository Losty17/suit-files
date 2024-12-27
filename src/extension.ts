import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "suit-files.createComponent",
    async () => {
      const componentName = await vscode.window.showInputBox({
        prompt: "Enter component name",
      });
      if (!componentName) {
        vscode.window.showErrorMessage("Component name is required.");
        return;
      }

      const componentPath = await vscode.window.showInputBox({
        prompt: "Enter path for the component",
      });
      if (!componentPath) {
        vscode.window.showErrorMessage("Component path is required.");
        return;
      }

      const folderPath = path.join(componentPath, componentName);
      fs.mkdirSync(folderPath);

      const fileExtensions = ["styles.ts", "types.ts", "stories.tsx", "tsx"];

      fileExtensions.forEach((ext) => {
        const filePath = path.join(folderPath, `${componentName}.${ext}`);
        const defaultCode = getDefaultCode(componentName, ext);

        fs.writeFileSync(filePath, defaultCode, "utf-8");
      });

      vscode.window.showInformationMessage(
        `Component ${componentName} created at ${componentPath}`
      );
    }
  );

  context.subscriptions.push(disposable);
}

function getDefaultCode(componentName: string, extension: string): string {
  switch (extension) {
    case "styles.ts":
      return `import { makeStyles } from "@material-ui/core";\n\nconst useStyles = makeStyles((theme) => ({}));\n\nexport default useStyles;\n`;
    case "types.ts":
      return `export default interface ${componentName}Props {}\n`;
    case "stories.tsx":
      return `import { ComponentMeta, ComponentStory } from "@storybook/react";\nimport ${componentName} from "./${componentName}";\n\nexport default {\n\ttitle: "Example/${componentName}",\n\tcomponent: ${componentName},\n} as ComponentMeta<typeof ${componentName}>;\n\nconst Template: ComponentStory<typeof ${componentName}> = (args) => (\n\t<${componentName} {...args} />\n);\n\nexport const Primary = Template.bind({});\nPrimary.args = {};\n`;
    case "tsx":
      return `import ${componentName}Props from "./${componentName}.types";\nimport useStyles from "./${componentName}.styles";\n\nconst ${componentName} = ({}: ${componentName}Props) => {\n\tconst classes = useStyles();\n\n\treturn <></>;\n};\n\nexport default ${componentName};\n`;
    default:
      return "";
  }
}

export function deactivate() {}
