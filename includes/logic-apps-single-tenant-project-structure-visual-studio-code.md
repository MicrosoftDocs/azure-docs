---
ms.service: logic-apps
ms.topic: include
author: ecfan
ms.author: estfan
ms.date: 05/25/2021
---

In Visual Studio Code, your logic app project has either of the following types:

* Extension bundle-based (Node.js), which is the default type
* NuGet package-based (.NET), which you can convert from the default type

Based on these types, your project includes slightly different folders and files. A NuGet-based project includes a .bin folder that contains packages and other library files. A bundle-based project doesn't include the .bin folder and other files. Some scenarios require a NuGet-based project for your app to run, for example, when you want to develop and run custom built-in operations. For more information about converting your project to use NuGet, review [Enable built-connector authoring](../articles/logic-apps/create-single-tenant-workflows-visual-studio-code.md#enable-built-in-connector-authoring).

For the default bundle-based project, your project has a folder and file structure that is similar to the following example:

```text
MyBundleBasedLogicAppProjectName
| .vscode
| Artifacts
  || Maps 
     ||| MapName1
     ||| ...
  || Schemas
     ||| SchemaName1
     ||| ...
| WorkflowName1
  || workflow.json
  || ...
| WorkflowName2
  || workflow.json
  || ...
| workflow-designtime
| .funcignore
| connections.json
| host.json
| local.settings.json
```

At your project's root level, you can find the following files and folders with other items:

| Name | Folder or file | Description |
|------|----------------|-------------|
| **.vscode** | Folder | Contains Visual Studio Code-related settings files, such as extensions.json, launch.json, settings.json, and tasks.json files. |
| **Artifacts** | Folder | Contains integration account artifacts that you define and use in workflows that support business-to-business (B2B) scenarios. For example, the example structure includes maps and schemas for XML transform and validation operations. |
| **<WorkflowName>** | Folder | For each workflow, the <WorkflowName> folder includes a workflow.json file, which contains that workflow's underlying JSON definition. |
| **workflow-designtime** | Folder | Contains development environment-related settings files. |
| **.funcignore** | File | Contains information related to your installed [Azure Functions Core Tools](../articles/azure-functions/functions-run-local.md). |
| **connections.json** | File | Contains the metadata, endpoints, and keys for any managed connections and Azure functions that your workflows use. <p><p>**Important**: To use different connections and functions for each environment, make sure that you parameterize this **connections.json** file and update the endpoints. |
| **host.json** | File | Contains runtime-specific configuration settings and values, for example, the default limits for the single-tenant Azure Logic Apps platform, logic apps, workflows, triggers, and actions. At your logic app project's root level, the **host.json** metadata file contains the configuration settings and default values that *all workflows* in the same logic app use while running, whether locally or in Azure. |
| **local.settings.json** | File | Contains app settings, connection strings, and other settings that your workflows use while running locally. In other words, these settings and values apply *only* when you run your projects in your local development environment. During deployment to Azure, the file and settings are ignored and aren't included with your deployment. <p><p>This file stores settings and values as *local environment variables* that are used by your local development tools as the `appSettings` values. You can call and reference these environment variables both at runtime and deployment time by using *app settings* and *parameters*. <p><p>**Important**: The **local.settings.json** file can contain secrets, so make sure that you also exclude this file from your project source control. |
||||