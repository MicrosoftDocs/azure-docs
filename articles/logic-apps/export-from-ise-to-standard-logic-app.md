---
title: Export workflows from ISE to Standard
description: Export logic app workflows from an integration service environment (ISE) to a Standard logic app using Visual Studio Code.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, wsilveira
ms.topic: how-to
ms.date: 07/21/2023
ms.custom: engagement-fy23
#Customer intent: As a developer, I want to export one or more ISE workflows to a Standard workflow.
---

# Export ISE workflows to a Standard logic app

Standard logic app workflows, which run in single-tenant Azure Logic Apps, offer many new and improved capabilities. For example, you get compute isolation, virtual network integration, and private endpoints along with App Services Environment hosting, local development and debugging using Visual Studio Code, low latency with stateless workflows, and more.

If you want the benefits from Standard workflows, but your workflows run in an integration service environment (ISE), you can now replace your ISE with single-tenant Azure Logic Apps. This switch makes sense for most scenarios that require some ISE capabilities such as isolation and network integration, and can help lower operation costs.

You can now export logic app workflows from an ISE to a Standard logic app. Using Visual Studio Code and the latest Azure Logic Apps (Standard) extension, you export your logic apps as stateful workflows to a Standard logic app project. You can then locally update, test, and debug your workflows to get them ready for redeployment. When you're ready, you can deploy either directly from Visual Studio Code or through your own DevOps process.

> [!NOTE]
>
> The export capability doesn't migrate your workflows. Instead, this tool replicates artifacts, 
> such as workflow definitions, connections, integration account artifacts, and others. Your source 
> logic app resources, workflows, trigger history, run history, and other data stay intact.
>
> You control the export process and your migration journey. You can test and validate your 
> exported workflows to your satisfaction with the destination environment. You choose when 
> to disable or delete your source logic apps. 

This article provides information about the export process and shows how to export your logic app workflows from an ISE to a local Standard logic app project in Visual Studio Code.

## Known issues and limitations

- The export tool doesn't export any infrastructure information, such as integration account settings.

- The export tool can export logic app workflows with triggers that have concurrency settings. However, single-tenant Azure Logic Apps ignores these settings.

- Logic apps must exist in the same region if you want to export them within the same Standard logic app project.

- By default, connection credentials aren't cloned from source logic app workflows. Before your logic app workflows can run, you'll have to reauthenticate these connections after export.

- By default, if an Azure connector has a built-in connector version, the export tool automatically converts the Azure connector to the built-in connector. No option exists to opt out from this behavior.

## Exportable operation types

| Operation | JSON type |
|-----------|-----------|
| Trigger | **Built-in**: `Http`, `HttpWebhook`, `Recurrence`, `manual` (Request) <br><br>**Managed**: `ApiConnection` `ApiConnectionNotification`, `ApiConnectionWebhook` |
| Action | **Built-in**: `AppendToArrayVariable`, `AppendToStringVariable`, `Compose`, `DecrementVariable`, `Foreach`, `Http`, `HttpWebhook`, `If`, `IncrementVariable`, `InitializeVariable`, `JavaScriptCode`, `Join`, `ParseJson`, `Response`, `Scope`, `Select`, `SetVariable`, `Switch`, `Table`, `Terminate`, `Until`, `Wait` <br><br>- **Managed**: `ApiConnection`, `ApiConnectionWebhook` |

## Prerequisites

- One or more logic apps to deploy to the same subscription and Azure region, for example, East US 2.

- Azure reader subscription-level access to the subscription where the logic apps are currently deployed.

- Azure contributor resource group-level access, if Deploy managed connectors option is selected.

- Review and meet the requirements for [how to set up Visual Studio Code with the Azure Logic Apps (Standard) extension](create-single-tenant-workflows-visual-studio-code.md#prerequisites). 

> [!NOTE]
> 
  > Make sure to install version 2.0.16 or higher for the Azure Logic Apps (Standard) extension for Visual Studio Code. 
  > Some conversion scenarios require the latest workflow designer, which is available starting with this version.

## Group logic apps for export

With the Azure Logic Apps (Standard) extension, you can combine multiple ISE-hosted logic app workflows into a single Standard logic app project. In single-tenant Azure Logic Apps, one Standard logic app resource can have multiple workflows. With this approach, you can pre-validate your workflows so that you don't miss any dependencies when you select logic apps for export.

Consider the following recommendations when you select logic apps for export:

- Group logic apps where workflows share the same resources, such as integration account artifacts, maps, and schemas, or use resources through a chain of processes.

- For the organization and number of workflows per logic app, review [Best practices and recommendations](create-single-tenant-workflows-azure-portal.md#best-practices-and-recommendations).

## Export ISE workflows to a local project

### Select logic apps for export

1. In Visual Studio Code, sign in to Azure, if you haven't already.

1. On the Visual Studio Code Activity Bar, select **Azure** to open the **Azure** window (Shift + Alt + A).

   ![Screenshot showing Visual Studio Code Activity Bar with Azure icon selected.](media/export-from-ise-to-standard-logic-app/select-azure-view.png)

1. On the **Workspace** section toolbar, from the **Azure Logic Apps** menu, select **Export Logic App**.

   ![Screenshot showing Azure window, Workspace section toolbar, and Export Logic App selected.](media/export-from-ise-to-standard-logic-app/select-export-logic-app.png)

1. After the **Export** tab opens, select your Azure subscription and ISE instance, and then select **Next**.

   ![Screenshot showing Export tab with Azure subscription and ISE instance selected.](media/export-from-ise-to-standard-logic-app/select-subscription-ise.png)

1. Select the logic apps to export. Each selected logic app appears on the **Selected logic apps** list to the side. When you're done, select **Next**.

   > [!TIP]
   >
   > You can also search for logic apps and filter on resource group.

   ![Screenshot showing 'Select logic apps to export' section with logic apps selected for export.](media/export-from-ise-to-standard-logic-app/select-logic-apps.png)

   The export tool starts to validate whether your selected logic apps are eligible for export.

### Review export validation results

1. After export validation completes, review the results by expanding the entry for each logic app.

   - Logic apps that have errors are ineligible for export. You must remove these logic apps from the export list until you fix them at the source. To remove a logic app from the list, select **Back**.

     For example, **SourceLogicApp2** has an error and can't be exported until fixed:

     ![Screenshot showing 'Review export status' section and validation status for logic app workflow with error.](media/export-from-ise-to-standard-logic-app/select-back-button-remove-app.png)

   - Logic apps that pass validation with or without warnings are still eligible for export. To continue, select **Export** if all apps validate successfully, or select **Export with warnings** if apps have warnings.

     For example, **SourceLogicApp3** has a warning, but you can still continue to export:

     ![Screenshot showing 'Review export status' section and validation status for logic app workflow with warning.](media/export-from-ise-to-standard-logic-app/select-export-with-warnings.png)

   The following table provides more information about each validation icon and status:

   | Validation icon | Validation status |
   |-----------------|-------------------|
   | ![Success icon](media/export-from-ise-to-standard-logic-app/success-icon.png) | Item passed validation, so export can continue without problems to resolve. |
   | ![Failed icon](media/export-from-ise-to-standard-logic-app/failed-icon.png) | Item failed validation, so export can't continue. <br><br>The validation entry for the failed item automatically appears expanded and provides information about the validation failure. |
   | ![Warning icon](media/export-from-ise-to-standard-logic-app/warning-icon.png) | Item passed validation with a warning, but export can continue with required post-export resolution. <br><br>The validation entry for the item with a warning automatically appears expanded and provides information about the warning and required post-export remediation. |

1. After the **Finish export** section appears, for **Export location**, browse and select a local folder for your new Standard logic app project.

   ![Screenshot showing 'Finish export' section and 'Export location' property with selected local export project folder.](media/export-from-ise-to-standard-logic-app/select-local-folder.png)

1. If your workflow has *managed* connections that you want to deploy, which is only recommended for non-production environments, select **Deploy managed connections**, which shows existing resource groups in your Azure subscription. Select the resource group where you want to deploy the managed connections.

   ![Screenshot showing 'Finish export' section with selected local export folder, 'Deploy managed connections' selected, and target resource group selected.](media/export-from-ise-to-standard-logic-app/select-deploy-managed-connections-resource-group.png)

1. Under **After export steps**, review any required post-export steps, for example:

   ![Screenshot showing 'After export steps' section and required post-export steps, if any.](media/export-from-ise-to-standard-logic-app/review-post-export-steps.png)

1. Based on your scenario, select **Export and finish** or **Export with warnings and finish**.

   The export tool downloads your project to your selected folder location, expands the project in Visual Studio Code, and deploys any managed connections, if you selected that option.

   ![Screenshot showing the 'Export status' section with export progress.](media/export-from-ise-to-standard-logic-app/export-status.png)

1. After this process completes, Visual Studio Code opens a new workspace. You can now safely close the export window.

1. From your Standard logic app project, open and review the README.md file for the required post-export steps.

   ![Screenshot showing a new Standard logic app project with README.md file opened.](media/export-from-ise-to-standard-logic-app/open-readme.png)

## Post-export steps

### Remediation steps

Some exported logic app workflows require post-export remediation steps to run on the Standard platform. 

1. From your Standard logic app project, open the README.md file, and review the remediation steps for your exported workflows. The export tool generates the README.md file, which contains all the required post-export steps.

1. Before you make any changes to your source logic app workflow, make sure to test your new Standard logic app resource and workflows.

### Integration account actions and settings

If you export actions that depend on an integration account, you have to manually set up your Standard logic app with a reference link to the integration account that contains the required artifacts. For more information, review [Link integration account to a Standard logic app](logic-apps-enterprise-integration-create-integration-account.md#link-account).

### Batch actions and settings

If you export actions that use Batch actions with multiple configurations stored in an integration account, you have to manually configure your Batch actions with the correct values after export. For more information, review [Send, receive, and batch process messages in Azure Logic Apps](logic-apps-batch-process-send-receive-messages.md#create-batch-receiver).

## Project folder structure

After the export process finishes, your Standard logic app project contains new folders and files alongside most others in a [typical Standard logic app project](create-single-tenant-workflows-visual-studio-code.md).

The following table describes these new folders and files added by the export process:

| Folder | File | Description |
|--------|------|-------------|
| .development\\deployment | LogicAppStandardConnections.parameters.json | Azure Resource Manager template parameters file for deploying managed connectors |
| | LogicAppStandardConnections.template.json | Azure Resource Manager template definition for deploying managed connectors |
| | LogicAppStandardInfrastructure.parameters.json | Azure Resource Manager template parameters file for deploying Standard logic app resource |
| | LogicAppStandardInfrastructure.template.json | Azure Resource Manager template definition for deploying Standard logic app resource |
| .logs\\export | exportReport.json | Export report summary raw file, which includes all the steps required for post-export remediation |
| | exportValidation.json | Validation report raw file, which includes the validation results for each exported logic app. |
| | README.md | Markdown file with export results summary, including the created logic apps and all the required next steps. |

## Next steps

- [Run, test, and debug locally](create-single-tenant-workflows-visual-studio-code.md#run-test-and-debug-locally)
