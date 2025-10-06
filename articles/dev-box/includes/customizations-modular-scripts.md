---

author: RoseHJM
ms.author: rosemalcolm
ms.reviewer: rosemalcolm
ms.date: 10/06/2025
ms.topic: include
---


## Modular scripts in Dev Box customizations

Modular scripts are reusable components that simplify and standardize Dev Box customizations. These scripts are typically PowerShell or Desired State Configuration (DSC), and are stored in a catalog structure that lets you reference them across multiple Dev Box configurations.

Modular scripts are shared scripts that you run from a Dev Box image definition. They're designed to:

- Promote reuse across multiple Dev Box setups
- Reduce duplication and maintenance overhead
- Enable consistent configuration practices

### Catalog structure

PowerShell or DSC script files in the same folder as the imagedefinition.yaml, or in its subfolders, are copied to the dev box when it's created. You can use these files when you run customization tasks.

The following diagram shows a catalog structure for modular scripts in Dev Box customizations.

At the top level, there's an "image definitions" folder. Inside, you'll find image definition subfolders like "Frontend-imagedef" and "backend-imagedef." The Frontend-imagedef folder has a PowerShell script file. The Backend-imagedef folder includes a subfolder for scripts. You can use either structure to store script files.

:::image type="content" source="../media/customizations-modular-scripts/customizations-modular-scripts-catalog-structure.png" alt-text="Diagram that shows a catalog structure with an image definitions folder, Frontend-imagedef and backend-imagedef subfolders, and subfolders for scripts.":::

### Reference modular scripts

In your imagedefinition.yaml file, reference modular scripts with the `script` keyword:

```yaml

tasks:
  - name: ~/winget
    parameters:
      script: './modular-script.ps1'

```

Dev Box scans the catalog recursively to find and run the tasks you reference.

### Best practices

- Use descriptive names for tasks to clarify their purpose.
- Document each task with comments and metadata in task.yaml.
- Test tasks independently before you add them to image definitions.
- Use version control for your catalog to track changes, and ensure consistency.
