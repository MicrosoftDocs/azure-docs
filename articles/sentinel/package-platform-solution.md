---
title: Package and publish a Microsoft Sentinel platform solution
description: Learn how to package the components of a Microsoft Sentinel platform solution and publish the package in the Microsoft Security Store.
ms.topic: how-to
author: mberdugo
ms.author: monaberdugo
ms.reviewer: angodavarthy
ms.date: 09/19/2025
---

# Package and publish a Microsoft Sentinel platform solution

A Microsoft Sentinel platform solution is a deployable package for the Microsoft Sentinel data lake. It includes code and configuration that help you analyze and respond to security data.

This article shows how to package and publish your completed platform solution in the Microsoft Security Store. 

## Prerequisites

Before you begin, please review the [Microsoft Sentinel platform solution prerequisites](solution-setup-essentials.md#platform-solutions-prerequisites).

## Prepare your solution components

Before you create the package manifest, check that all your solution components adhere to the required structure and naming formats.

> [!IMPORTANT]
> Each platform solution must include one `AgentManifest.yaml` file.

- **One** `AgentManifest.yaml` file.
- You can include Copilot plugin specifications:
  - API plugin specs named `openapispec_<number>.yaml` or `openapispec_<number>.json`.
  - GPT or KQL plugin specs named `template_<number>.txt`.
- You can include Sentinel data lake notebook jobs:
  - Each job must include a `.job.yaml` file and the corresponding notebook.
- You can include `mainTemplate.json` if your solution deploys Azure resources.

> [!NOTE]
> The ARM template doesn't support user input.

## Create the package manifest

Create a package manifest to list the solution components. It includes the solution name, description, and contents to package.

1. In Visual Studio Code, open the **File Explorer** view.
1. Right-click an empty area and select **Microsoft Sentinel > Create Package Manifest**.
1. Enter a name in the **Save As** dialog and save the manifest in your solution folder. VS Code creates a `.package.yaml` file and opens it in the package manifest editor.
1. Fill in the package details in the editor:
   - **Package name:** The name that appears in the Microsoft Security Store.
   - **Description:** A short explanation of what the package does.
   - **Include paths:** The folders that contain the agent manifest, job YAML files, notebooks, and other required files.

        :::image type="content" source="media/package-platform-solution/package-demo-ui-small.png" alt-text="Screenshot of the Create Package     Definition dialog in Visual Studio Code showing fields for package name, description, and include paths." lightbox="media/package-platform-solution/package-demo-ui-big.png":::

1. (Optional) Select **View YAML** to edit the YAML file.

### Example manifest

```yaml
packageName: ContosoPlatformSolution
description: Provides advanced hunting notebooks and Copilot plugins for Contoso firewall logs.
includePaths:
  - ./AgentManifest.yaml
  - ./jobs/
  - ./notebooks/
```
  
## Create the deployable ZIP file

After you define the package manifest, create the ZIP file required by the Microsoft Security Store.

1. Open the `.package.yaml` manifest in Visual Studio Code.
1. In the manifest editor, select **Create Package ZIP file**.
1. The tool creates a ZIP file and saves it locally.

## Publish to the Microsoft Security Store

After you create the ZIP file, publish it in the Microsoft Security Store.

1. Open the [Microsoft Security Store publisher portal](https://securitystore.microsoft.com/).
1. Create a new **platform solution** offer and upload the ZIP package.
1. Complete the required offer details and submit for validation. 

> [!TIP]
> Publish first as a private offer to validate it in your environment.

## Related content

For an introduction to Microsoft Sentinel SIEM solutions, see:

- [Publish solutions to Microsoft Sentinel](publish-sentinel-solutions.md).
- [Create a codeless connector for Microsoft Sentinel](create-codeless-connector.md).