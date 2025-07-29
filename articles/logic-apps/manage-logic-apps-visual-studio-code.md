---
title: Edit and manage logic apps in Visual Studio Code
description: Edit, enable, disable, or delete logic app resources and their workflows with Visual Studio Code.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 03/17/2025
ms.custom: devx-track-dotnet
# Customer intent: As a logic apps developer, I want to edit and manage my logic apps and workflows using Visual Studio Code.
---

# Edit and manage logic apps in Visual Studio Code

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

This guide shows how to work with deployed logic apps in Visual Studio Code and how to perform tasks such as edit, disable, enable, and delete. If you have both extensions for **Azure Logic Apps (Consumption)** and **Azure Logic Apps (Standard)** installed in Visual Studio Code, you can view all the deployed logic apps in your Azure subscription and perform management tasks with some that vary based on the logic app type.

## Prerequisites

- An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Access to the internet so that you can download the required extension if necessary, connect from Visual Studio Code to your Azure account, and publish any changes that you make to your project.

- [**Visual Studio Code**](https://code.visualstudio.com/) with the following extensions, based on the logic app type that you want to manage. You can also have both extensions installed at the same time.

  - **Azure Logic Apps (Standard) extension for Visual Studio Code**
  - **Azure Logic Apps (Consumption) extension for Visual Studio Code**

- For Standard logic app workflows, you need the Standard logic app project that you want to edit or manage in Visual Studio Code.

<a name="connect-azure-account"></a>

## Connect to your Azure account

If you aren't already connected to your Azure account, follow these steps to connect:

### [Consumption](#tab/consumption)

1. In Visual Studio Code, on the Activity Bar, select the Azure icon to open the **Azure** pane.

   :::image type="content" source="media/manage-logic-apps-visual-studio-code/visual-studio-code-azure-icon.png" alt-text="Screenshot shows the Visual Studio Code Activity Bar and selected Azure icon.":::

1. In the **Azure** pane, in the **Logic Apps (Consumption)** section, select **Sign in to Azure**.

1. When the Visual Studio Code authentication page appears, sign in with your Azure account.

   After you sign in, the **Logic Apps (Consumption)** section shows the Azure subscriptions for your Azure account. If the expected subscriptions don't appear, or you want the pane to show only specific subscriptions, follow these steps:

   1. In the **Logic Apps (Consumption)** section, move your pointer over the section title until the **Select Subscriptions** button (filter icon) appears. Select the filter icon.

   1. When the subscriptions list appears, select the subscriptions that you want, and make sure that you select **OK**.

### [Standard](#tab/standard)

1. In Visual Studio Code, on the Activity Bar, select the Azure icon to open the **Azure** pane.

   :::image type="content" source="media/manage-logic-apps-visual-studio-code/visual-studio-code-azure-icon.png" alt-text="Screenshot shows Visual Studio Code Activity Bar and selected Azure icon.":::

1. In the **Azure** pane, in the **Resources** section, select **Sign in to Azure**.

1. When the Visual Studio Code authentication page appears, sign in with your Azure account.

   After you sign in, the **Resources** section shows the Azure subscriptions for your Azure account. If the expected subscriptions don't appear, or you want the pane to show only specific subscriptions, follow these steps:

   1. In the **Resources** section, move your pointer over the first subscription until the **Select Subscriptions** button (filter icon) appears. Select the filter icon.

   1. When the subscriptions list appears, select the subscriptions that you want, and make sure that you select **OK**.

---

## View deployed logic apps in Visual Studio Code

### [Consumption](#tab/consumption)

1. In Visual Studio Code, [connect to your Azure account](#connect-azure-account), if you haven't already.

1. On the Activity Bar, select the Azure icon to open the **Azure** pane.

1. In the **Logic Apps (Consumption)** section, expand your Azure subscription.

   You can now view all the deployed Consumption logic apps in the selected subscription, for example:

   :::image type="content" source="media/manage-logic-apps-visual-studio-code/find-deployed-logic-app-consumption.png" alt-text="Screenshot shows Visual Studio Code with Resources section and deployed Consumption logic app resource.":::

1. Find and expand the node for the deployed Consumption logic app that you want.

   At the logic app resource level, you can select the following tasks from the logic app node shortcut menu:

   | Task | Select |
   |------|--------|
   | Open workflow in the designer | **Open in Designer**, which opens the workflow in read-only mode. |
   | Open workflow in the code view editor | **Open in Editor**, which opens the workflow for editing. See [Edit a workflow](#edit-workflow). |

1. Expand the node for the items described in the following table where you want to view more information, if any exists:

   | Node | Description |
   |------|-------------|
   | **Runs** | Workflow run history |
   | **Triggers** | Workflow trigger information. <br><br>- To open in the code view editor, open the shortcut menu for the trigger, and select **Open in Editor**. <br><br>- To run the trigger, open the shortcut menu for the trigger, and select **Run**. |
   | **Versions** | Logic app versions. <br><br>- To open in the designer, open the shortcut menu for a specific version, and select **Open in Designer**, which opens in read-only mode. <br><br>- To open in the code view editor, open the shortcut menu for a specific version, and select **Open in Editor**, which opens in read-only mode. |

### [Standard](#tab/standard)

1. In Visual Studio Code, [connect to your Azure account](#connect-azure-account), if you haven't already.

1. On the Activity Bar, select the Azure icon to open the **Azure** pane.

1. In the **Resources** section, expand your subscription, and then expand **Logic App**.

   You can now view all the deployed Standard logic apps in the selected subscription, for example:

   :::image type="content" source="media/manage-logic-apps-visual-studio-code/find-deployed-logic-app-standard.png" alt-text="Screenshot shows Visual Studio Code with Resources section and deployed Standard logic app resource.":::

1. Find and expand the node for the deployed Standard logic app that you want.

1. Expand the node for the items described in the following table where you want to view more information, if any exists:

   | Node | Description |
   |------|-------------|
   | **Workflows** | Workflows in this logic app. <br><br>To view an individual workflow in the designer, which opens in read-only mode, choose from the following options: <br><br>- **Open in Visual Studio Code**: Open the shortcut menu for the workflow, and select **Open Designer**. <br><br>- **Open in Azure portal**: Open the shortcut menu for the workflow, and select **Open in Portal**. <br><br>To edit the workflow, see [Edit a workflow](#edit-workflow). |
   | **Configurations** | View the following configuration elements: <br><br>- **Application Settings** <br><br>- **Connections** <br><br>- **Parameters** |
   | **Files** | Project files and any other files in your logic app resource, for example:  <br><br>- **Artifacts** <br><br>- **workflow.json** file for each workflow in your logic app resource <br><br>- **connections.json** file that contains information about connections created by managed connectors <br><br>- **host.json** file |
   | **Logs** | Log files that contain any diagnostic logging information |
   | **Deployments** | |
   | **Slots** | Any existing deployment slots |
   | **Artifacts** | Files such as map (.xslt) files, schemas (.xsd), or assemblies (.dll or .jar) <br><br>**Note**: This node and subnodes appear only if any actual files exist. |

 ---

<a name="add-workflow-existing-project"></a>

## Add blank workflow to project (Standard logic app only)

While a Consumption logic app can have only one workflow, a Standard logic app can have multiple workflows. To add a new empty workflow to your project, follow these steps:

1. In Visual Studio Code, open your Standard logic app project, if not already open.

1. On the Activity Bar, select the files icon, which opens the **Explorer** window to show your project.

1. On your project folder shortcut menu, and select **Create workflow**.

1. Select the workflow template **Stateful** or **Stateless**

1. Provide a name for your workflow.

A new workflow folder now appears in your project. This folder contains a **workflow.json** file for the workflow's underlying JSON definition.

<a name="edit-workflow"></a>

## Edit a workflow

In Visual Studio Code, you can edit a deployed Consumption workflow using only the code view editor. If you open a deployed Consumption workflow using the designer, the workflow opens in read-only mode. By comparison, you can edit a Standard workflow using the designer or code view editor only within the context of your Standard logic app project in the **Explorer** pane. If you open a *deployed* Standard workflow using the designer or code view editor from the **Resources** section in the **Azure** pane, the workflow opens in read-only mode.

To edit a deployed Consumption or Standard workflow using the designer, make those changes in the Azure portal instead.

> [!IMPORTANT]
>
> Before you change your workflow, you might want to stop or disable your workflow. Make sure 
> that you understand how your changes affect your workflow's operation. When you're done, 
> remember to restart or reenable your workflow. For considerations around stopping, disabling, 
> restarting, or re-enabling workflows, see the following documentation:
>
> - [Considerations for stopping Consumption logic apps](/azure/logic-apps/manage-logic-apps-with-azure-portal?tabs=consumption#considerations-stop-consumption-logic-apps)
> - [Considerations for stopping Standard logic apps](/azure/logic-apps/manage-logic-apps-with-azure-portal?tabs=standard#considerations-stop-standard-logic-apps)

### [Consumption](#tab/consumption)

1. In Visual Studio Code, on the Activity Bar, select the Azure icon to open the **Azure** pane.

1. In the **Logic Apps (Consumption)** section, expand your Azure subscription, and find your logic app.

1. Open the logic app shortcut menu, and select **Open in Editor**.

   Visual Studio Code opens the code view editor for the workflow's underlying JSON definition file named **<*logic-app-name*>.logicapp.json** file. You can now edit the workflow's underlying JSON definition.

1. After you make changes and try to save your workflow, a message appears to confirm that you want to upload your changes to the deployed workflow.

1. To continue saving and publishing your changes, select **Upload**.

   Azure saves the original workflow as a previous version. Your updated workflow becomes the current workflow.

1. If your workflow is disabled, remember to reenable your workflow.

### [Standard](#tab/standard)

#### Edit workflow in project

1. In Visual Studio Code, open your Standard logic app project, if not already open.

1. On the Activity Bar, select the files icon to open the **Explorer** pane, which shows your project.

1. In your project, expand the workflow folder that you want.

1. Choose from the following options:

   - Open the **workflow.json** shortcut menu, select **Open Designer**, and make your changes in the designer.

   - Open the **workflow.json** file, and make your changes in the underlying JSON definition.

1. When you're done, [publish your updated Standard logic app](create-standard-workflows-visual-studio-code.md#publish-new-logic-app).

1. If your workflow is disabled, remember to reenable your workflow.

---

<a name="disable-enable-logic-apps"></a>

## Disable or enable a deployed logic app

Deployed Consumption and Standard logic apps have different ways to disable and enable their activity. For considerations around how these tasks affect each logic app resource type, see the following documentation:

- [Considerations for stopping Consumption logic apps](/azure/logic-apps/manage-logic-apps-with-azure-portal?tabs=consumption#considerations-stop-consumption-logic-apps)
- [Considerations for stopping Standard logic apps](/azure/logic-apps/manage-logic-apps-with-azure-portal?tabs=standard#considerations-stop-standard-logic-apps)
- [Considerations for disabling Standard workflows](/azure/logic-apps/manage-logic-apps-with-azure-portal?tabs=standard#considerations-disable-enable-standard-workflows)

### [Consumption](#tab/consumption)

1. In Visual Studio Code, on the Activity Bar, select the Azure icon to open the **Azure** pane.

1. In the **Logic Apps (Consumption)** section, expand your Azure subscription, and find your logic app.

1. Open the logic app shortcut menu. Based on the current activity state, select **Disable** or **Enable**.

### [Standard](#tab/standard)

In Visual Studio Code, you can stop, start, or restart a Standard logic app, which affects all workflow instances. You can also restart a Standard logic app without first stopping its activity. However, to disable and reenable individual workflows, [you must use the Azure portal](/azure/logic-apps/manage-logic-apps-with-azure-portal#stop-start-standard-workflows).

Stopping the resource versus disabling a workflow have different effects, so review the considerations before you continue.

1. In Visual Studio Code, on the Activity Bar, select the Azure icon to open the **Azure** pane.

1. In the **Resources** section, expand your Azure subscription, and find your logic app.

1. Open the logic app shortcut menu. Based on the current activity state, select **Stop** or **Start**. Or, you can select **Restart**.

---

## Post logic app stoppage

After you stop a logic app, workflow triggers won't fire the next time that their conditions are met. However, trigger states remember the points at where you stopped the logic app. When you restart a logic app, the trigger fires for all unprocessed items since the last workflow run.

To stop a trigger from firing on unprocessed items since the last workflow run, you must clear the trigger state before you restart a logic app by following these steps:

### [Consumption](#tab/consumption)

1. In Visual Studio Code, [open your Consumption logic app workflow](#edit-workflow), and edit any part of the workflow trigger.

1. Save your changes. This step resets your trigger's current state.

1. [Restart your logic app](manage-logic-apps-visual-studio-code.md?tabs=consumption#disable-enable-logic-apps).

### [Standard](#tab/standard)

1. In Visual Studio Code, [open your Standard logic app workflow](#edit-workflow), and edit any part of the workflow trigger.

1. Save your changes. This step resets the trigger's current state.

1. Repeat for each existing workflow.

1. [Restart your logic app](manage-logic-apps-visual-studio-code.md?tabs=standard#disable-enable-logic-apps).

---

<a name="delete-logic-apps"></a>

## Delete logic apps

Deployed Consumption and Standard logic apps have different ways to delete their resources. For considerations around how deleting affects each logic app resource type, see the following documentation:

- [Considerations for deleting Consumption logic apps](/azure/logic-apps/manage-logic-apps-with-azure-portal?tabs=consumption#considerations-delete-consumption-logic-apps)
- [Considerations for deleting Standard logic apps](/azure/logic-apps/manage-logic-apps-with-azure-portal?tabs=standard#considerations-delete-standard-logic-apps)
- [Considerations for deleting Standard workflows](/azure/logic-apps/manage-logic-apps-with-azure-portal?tabs=standard#considerations-delete-standard-workflows)

### [Consumption](#tab/consumption)

1. In Visual Studio Code, on the Activity Bar, select the Azure icon to open the **Azure** pane.

1. In the **Logic Apps (Consumption)** section, expand your Azure subscription, and find your logic app.

1. Open the logic app shortcut menu, and select **Delete**.

### [Standard](#tab/standard)

In Visual Studio Code, you can only delete an entire Standard logic app. To delete individual workflows, [use the Azure portal](/azure/logic-apps/manage-logic-apps-with-azure-portal?tabs=standard#delete-standard-workflows).

1. In Visual Studio Code, on the Activity Bar, select the Azure icon to open the **Azure** pane.

1. In the **Resources** section, expand your Azure subscription, expand **Logic App**, and find your logic app.

1. Open the logic app shortcut menu, and select **Delete logic app**.

---

<a name="promote-previous-versions"></a>

## Promote previous versions (Consumption only)

To publish an earlier Consumption logic app version, you can promote that version over the current version. Your logic app must have at least two versions to make the promote option available.

1. In Visual Studio Code, on the Activity Bar, select the Azure icon to open the **Azure** pane.

1. In the **Logic Apps (Consumption)** section, expand your Azure subscription, and find your logic app.

1. Expand your logic app, expand **Versions**, and find the earlier version to promote.

1. On the version shortcut menu, select **Promote**.

## Related content

- [Create Standard logic app workflows in Visual Studio Code](/azure/logic-apps/create-standard-workflows-visual-studio-code)
