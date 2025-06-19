---
ms.service: azure-logic-apps
ms.topic: include
author: ecfan
ms.author: estfan
ms.date: 03/14/2025
---

In Visual Studio Code, your logic app project has either of the following types:

* Extension bundle-based (Node.js), which is the default type
* NuGet package-based (.NET), which you can convert from the default type

Based on these types, your project might include slightly different folders or files. For example, a Nuget package-based project has a **.bin** folder that contains packages and other library files. An extension bundle-based project doesn't include this **.bin** folder.

Some scenarios require a NuGet package-based project for your app to run, for example, when you want to develop and run custom built-in operations. For more information about converting your project to use NuGet, review [Enable built-connector authoring](/azure/logic-apps/create-single-tenant-workflows-visual-studio-code#enable-built-in-connector-authoring).

The default extension bundle-based project has a folder and file structure that is similar to the following example:

```text
MyWorkspaceName
| MyBundleBasedLogicAppProjectName
  || .vscode
  || Artifacts
     ||| Maps 
         |||| MapName1
         |||| ...
     ||| Rules
     ||| Schemas
         |||| SchemaName1
         |||| ...
  || lib
     ||| builtinOperationSdks
         |||| JAR
         |||| net472
     ||| custom
  || WorkflowName1
     ||| workflow.json
     ||| ...
  || WorkflowName2
     ||| workflow.json
     ||| ...
  || workflow-designtime
     ||| host.json
     ||| local.settings.json
  || .funcignore
  || connections.json
  || host.json
  || local.settings.json
```

At your project's root level, you can find the following folders and files along with other items:

| Name | Folder or file | Description |
|------|----------------|-------------|
| **.vscode** | Folder | Contains Visual Studio Code-related settings files, such as **extensions.json**, **launch.json**, **settings.json**, and **tasks.json** files. |
| **Artifacts** | Folder | Contains integration account artifacts that you define and use in workflows that support business-to-business (B2B) scenarios. <br><br>For example, the sample structure includes the following folders: <br><br>- **Maps**: Contains [maps](/azure/logic-apps/logic-apps-enterprise-integration-maps) to use for XML transformation operations. <br><br>- **Schemas**: Contains [schemas](/azure/logic-apps/logic-apps-enterprise-integration-schemas) to use for XML validation operations. <br><br>- **Rules**: Artifacts for [business rules in rules-based engine projects](/azure/logic-apps/rules-engine/rules-engine-overview). |
| **lib** | Folder | Contains supported assemblies that your logic app can use or reference. You can upload these assemblies to your project in Visual Studio Code, but you must add them to specific folders in your project. <br><br>For example, this folder includes the following folders: <br><br>- **builtinOperationSdks**: Contains the **JAR** and **net472** folders for Java and .NET Framework assemblies, respectively. <br><br>- **custom**: Contains .NET Framework custom assemblies. <br><br>For more information about supported assembly types and where to put them in your project, see [Add assemblies to your project](/azure/logic-apps/create-single-tenant-workflows-visual-studio-code#add-assembly). |
| **<*WorkflowName*>** | Folder | For each workflow, the <*WorkflowName*> folder includes a **workflow.json** file, which contains that workflow's underlying JSON definition. |
| **workflow-designtime** | Folder | Contains development environment-related settings files. |
| **.funcignore** | File | Contains information related to your installed [Azure Functions Core Tools](/azure/azure-functions/functions-run-local). |
| **connections.json** | File | Contains the metadata, endpoints, and keys for any managed connections and Azure functions that your workflows use. <br><br>**Important**: To use different connections and functions for each environment, make sure that you parameterize this **connections.json** file and update the endpoints. |
| **host.json** | File | Contains runtime-specific configuration settings and values, for example, the default limits for the single-tenant Azure Logic Apps platform, logic apps, workflows, triggers, and actions. At your logic app project's root level, the **host.json** metadata file contains the configuration settings and default values that *all workflows* in the same logic app use while running, whether locally or in Azure. For reference information, see [Edit app settings and host settings](/azure/logic-apps/edit-app-settings-host-settings#reference-host-json). <br><br>**Note**: When you create your logic app, Visual Studio Code creates a backup **host.snapshot.*.json** file in your storage container. If you delete your logic app, this backup file isn't deleted. If you create another logic app with the same name, another snapshot file is created. You can have only up to 10 snapshots for the same logic app. If you exceed this limit, you get the following error: <br><br>**`Microsoft.Azure.WebJobs.Script.WebHost: Repository has more than 10 non-decryptable secrets backups (host))`** <br><br>To resolve this error, delete the extra snapshot files from your storage container. |
| **local.settings.json** | File | Contains app settings, connection strings, and other settings that your workflows use while running locally. These settings and values apply *only* when you run your projects in your local development environment. During deployment to Azure, the file and settings are ignored and aren't included with your deployment. <br><br>This file stores settings and values as *local environment variables* that your local development tools use for the **`appSettings`** values. You can call and reference these environment variables both at runtime and deployment time by using *app settings* and *parameters*. <br><br>**Important**: The **local.settings.json** file can contain secrets, so make sure that you also exclude this file from your project source control. This file also contains app settings that your logic app needs to work correctly. For reference information, see [Edit app settings and host settings](/azure/logic-apps/edit-app-settings-host-settings#reference-local-settings-json). |
