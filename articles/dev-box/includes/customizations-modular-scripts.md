---

author: RoseHJM
ms.author: rosemalcolm
ms.reviewer: rosemalcolm
ms.date: 10/08/2025
ms.topic: include
---


## Use modular scripts and files in Dev Box customizations

Modular scripts and files like PowerShell scripts, Desired State Configuration (DSC) files, configuration files, text files, or images can be stored in a shared catalog so you can reuse and standardize Dev Box customizations across multiple images.

They're designed to:

- Promote reuse across multiple Dev Box setups
- Reduce duplication and maintenance overhead
- Enable consistent configuration practices

### Catalog structure

Files in the same folder as the imagedefinition.yaml, or in its subfolders, are copied to the dev box on creation. You can use these files when you run customization tasks.

The following diagram shows a catalog structure for modular scripts and files in Dev Box customizations.

:::image type="content" source="../media/customizations-modular-scripts/customizations-modular-scripts-catalog-structure.png" alt-text="Diagram that shows a catalog structure with an image definitions folder, Frontend-imagedef and backend-imagedef subfolders, and subfolders for scripts and files.":::

At the top level, there's an *image definitions* folder. Inside, you find image definition subfolders like *frontend-imagedef* and *backend-imagedef.* The frontend-imagedef folder has a PowerShell script file. The backend-imagedef folder includes a subfolder that contains DSC files. You can use either structure to store scripts and other files.

### Reference modular scripts or files

Image Definition file sets a list of *tasks* that run in system context and *userTasks* that run after the first sign-in on the new dev box, in user context. Use display names for tasks to clarify the purpose of each task. In your image definition file, reference the modular scripts you want to run, or files you want to include.

```yaml

$schema: "1.0"
name: "modular-script"
image: microsoftvisualstudio_visualstudioplustools_vs-2022-ent-general-win11-m365-gen2
description: "This definition shows examples of referencing PowerShell scripts and DSC configuration files."

tasks:
  - name: ~/powershell
    displayName: "Modular Script"
    parameters:
      script: C:\ProgramData\Microsoft\DevBoxAgent\ImageDefinitions\catalog-name\modular-script\contoso.ps1
  - name: ~/winget
    displayName: "Install VS Code"
    parameters:
      configurationFile: C:\ProgramData\Microsoft\DevBoxAgent\ImageDefinitions\catalog-name\modular-script\contoso.dsc.yaml

userTasks:
  - name: ~/winget
    displayName: "Install Insomnia"
    parameters:
      configurationFile: C:\ProgramData\Microsoft\DevBoxAgent\ImageDefinitions\catalog-name\modular-script\contoso-user.dsc.yaml
```

Dev Box validates that all tasks reference either intrinsic (like PowerShell or WinGet) or one that is available at the devcenter level. It downloads all Image Definition files to a set directory on the new dev box, along with the relevant task files. It then executes each task in its downloaded task directory and uploads task status upon completion.