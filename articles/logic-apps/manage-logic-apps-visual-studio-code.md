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

This guide shows how to manage deployed logic apps that you create using Visual Studio Code and how to perform tasks such as edit, disable, enable, and delete workflows. If you have both extensions for **Azure Logic Apps (Consumption)** and **Azure Logic Apps (Standard)** installed in Visual Studio Code, you can view all the deployed logic apps in your Azure subscription and perform management tasks with some that vary based on the logic app type.

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

1. In the Azure pane, in the **Logic Apps (Consumption)** section, select **Sign in to Azure**.

1. When the Visual Studio Code authentication page appears, sign in with your Azure account.

   After you sign in, the **Logic Apps (Consumption)** section shows the Azure subscriptions for your Azure account. If the expected subscriptions don't appear, or you want the pane to show only specific subscriptions, follow these steps:

   1. In the **Logic Apps (Consumption)** section, move your pointer over the section title until the **Select Subscriptions** button (filter icon) appears. Select the filter icon.

   1. When the subscriptions list appears, select the subscriptions that you want, and make sure that you select **OK**.

### [Standard](#tab/standard)

1. In Visual Studio Code, on the Activity Bar, select the Azure icon to open the **Azure** pane.

   :::image type="content" source="media/manage-logic-apps-visual-studio-code/visual-studio-code-azure-icon.png" alt-text="Screenshot shows Visual Studio Code Activity Bar and selected Azure icon.":::

1. In the Azure pane, in the **Resources** section, select **Sign in to Azure**.

1. When the Visual Studio Code authentication page appears, sign in with your Azure account.

   After you sign in, the **Resources** section shows the Azure subscriptions for your Azure account. If the expected subscriptions don't appear, or you want the pane to show only specific subscriptions, follow these steps:

   1. In the **Resources** section, move your pointer over the first subscription until the **Select Subscriptions** button (filter icon) appears. Select the filter icon.

   1. When the subscriptions list appears, select the subscriptions that you want, and make sure that you select **OK**.

---

## View deployed logic apps in Visual Studio Code

### [Consumption](#tab/consumption)

1. In Visual Studio Code, [connect to your Azure account](#connect-azure-account), if you haven't already.

1. On the Visual Studio Code Activity Bar, select the Azure icon to open the Azure pane.

1. In the **Logic Apps (Consumption)** section, expand your subscription node.

   You can now view all the deployed Consumption logic apps in the selected subscription.

1. Find and expand the node for the deployed Consumption logic app that you want.

   At the logic app resource level, you can select the following tasks from the logic app node shortcut menu:

   | Task | Select |
   |------|--------|
   | Open workflow in the designer | **Open in Designer** |
   | Open workflow in the code view editor | **Open in Editor** |

1. Expand the node for the items described in the following table where you want to view more information, if any exists:

   | Node | Description |
   |------|-------------|
   | **Runs** | Workflow run history |
   | **Triggers** | Workflow trigger information. <br><br>- To open in the code view editor, open the shortcut menu for the trigger, and select **Open in Editor**. <br><br>- To run the trigger, open the shortcut menu for the trigger, and select **Run**. |
   | **Versions** | Logic app versions. <br><br>- To open in the designer, open the shortcut menu for a specific version, and select **Open in Designer**. <br><br>- To open in the code view editor, open the shortcut menu for a specific version, and select **Open in Editor**. |

### [Standard](#tab/standard)

1. In Visual Studio Code, [connect to your Azure account](#connect-azure-account), if you haven't already.

1. On the Visual Studio Code Activity Bar, select the Azure icon to open the Azure pane.

1. In the **Resources** section, expand your subscription node, and then expand the **Logic App** node.

   You can now view all the deployed Standard logic apps in the selected subscription.

1. Find and expand the node for the deployed Standard logic app that you want.

1. Expand the node for the items described in the following table where you want to view more information, if any exists:

   | Node | Description |
   |------|-------------|
   | **Workflows** | Workflows in this logic app. <br><br>To view an individual workflow in the designer, which opens in read-only mode, choose from the following options: <br><br>- **Open in Visual Studio Code**: Open the shortcut menu for the workflow, and select **Open Designer**. <br><br>- **Open in Azure portal**: Open the shortcut menu for the workflow, and select **Open in Portal**. <br><br>To edit the workflow, see [Edit a workflow](#edit-workflow). |
   | **Configurations** | View the following configuration elements: <br><br>- **Application Settings** <br><br>- **Connections** <br><br>- **Parameters** |
   | **Files** | Project files and any other files in your logic app resource, for example:  <br><br>- **Artifacts** <br><br>- **workflow.json** file for each workflow in your logic app resource <br><br>- **connections.json** file that contains information about connections created by managed connectors <br><br>- **host.json** file |
   | **Logs** | Log files that contain any diagnostic logging information |
   | **Deployments** ||
   | **Slots** | Deployment slots |
   | **Artifacts** | Files such as map (.xslt) files, schemas (.xsd), or assemblies (.dll or .jar) <br><br>**Note**: This node and subnodes appear only if any actual files exist. |

 ---

   To edit the workflow, you have these options:

   * In Visual Studio Code, open your project's **workflow.json** file in the workflow designer, make your edits, and redeploy your logic app to Azure.

   * In the Azure portal, [open your logic app](#manage-deployed-apps-portal). You can then open, edit, and save your workflow.

   You can also sign in separately to the Azure portal, use the portal search box to find your logic app, and then select your logic app from the results list.


1. lect the logic app that you want and  to manage. From the logic app's shortcut menu, select the task that you want to perform.

   For example, you can select tasks such as stopping, starting, restarting, or deleting your deployed logic app. You can [disable or enable a workflow by using the Azure portal](manage-logic-apps-with-azure-portal.md#disable-enable-standard-workflows).

   > [!NOTE]
   >
   > The stop logic app and delete logic app operations affect workflow instances in different ways. 
   > For more information, see [Considerations for stopping logic apps](#considerations-stop-logic-apps) and 
   > [Considerations for deleting logic apps](#considerations-delete-logic-apps).

   ![Screenshot shows Visual Studio Code with Resources section and deployed logic app resource.](./media/manage-logic-apps-visual-studio-code/find-deployed-workflow-visual-studio-code.png)



<a name="add-workflow-existing-project"></a>

## Add blank workflow to project (Standard logic app only)

You can have multiple workflows in your logic app project. To add a blank workflow to your project, follow these steps:

1. In Visual Studio Code, on the Activity Bar, select the files icon, which opens the **Explorer** window to show your project.

1. In your project, open the project folder shortcut window, and select **Create workflow**.

1. Select the template for the workflow: **Stateful** or **Stateless**

1. Provide a name for your new workflow.

When you finish, a new workflow folder appears in your project. This folder contains a **workflow.json** file for the workflow definition.

<a name="considerations-stop-logic-apps"></a>

### Considerations for stopping logic apps

Stopping a logic app affects workflow instances in the following ways:

* Azure Logic Apps cancels all in-progress and pending runs immediately.

* Azure Logic Apps doesn't create or run new workflow instances.

* Triggers won't fire the next time that their conditions are met. However, trigger states remember the points where the logic app was stopped. So, if you restart the logic app, the triggers fire for all unprocessed items since the last run.

  To stop a trigger from firing on unprocessed items since the last run, clear the trigger state before you restart the logic app:

  1. On the Visual Studio Code Activity Bar, select the Azure icon, which opens the Azure window.

  1. In the **Resources** section, expand your subscription, which shows all the deployed logic apps for that subscription.

  1. Expand your logic app, and then expand the **Workflows** node.

  1. Open a workflow, and edit any part of that workflow's trigger.

  1. Save your changes. This step resets the trigger's current state.

  1. Repeat for each workflow.

  1. When you're done, restart your logic app.

<a name="considerations-delete-logic-apps"></a>

### Considerations for deleting logic apps

Deleting a logic app affects workflow instances in the following ways:

* Azure Logic Apps cancels in-progress and pending runs immediately, but doesn't run cleanup tasks on the storage used by the app.

* Azure Logic Apps doesn't create or run new workflow instances.

* If you delete a workflow and then recreate the same workflow, the recreated workflow doesn't have the same metadata as the deleted workflow. To refresh the metadata, you have to resave any workflow that called the deleted workflow. That way, the caller gets the correct information for the recreated workflow. Otherwise, calls to the recreated workflow fail with an `Unauthorized` error. This behavior also applies to workflows that use artifacts in integration accounts and workflows that call Azure functions.

<a name="add-workflow-portal"></a>

## Add another workflow in the portal

Through the Azure portal, you can add blank workflows to a Standard logic app resource that you deployed from Visual Studio Code and build those workflows in the Azure portal.

1. In the [Azure portal](https://portal.azure.com), select your deployed Standard logic app resource.

1. On the logic app resource menu, select **Workflows**. On the **Workflows** pane, select **Add**.

   ![Screenshot shows selected logic app's Workflows pane and toolbar with Add command selected.](./media/manage-logic-apps-visual-studio-code/add-new-workflow.png)

1. In the **New workflow** pane, provide name for the workflow. Select either **Stateful** or **Stateless** **>** **Create**.

   After Azure deploys your new workflow, which appears on the **Workflows** pane, select that workflow so that you can manage and perform other tasks, such as opening the designer or code view.

   ![Screenshot shows selected workflow with management and review options.](./media/manage-logic-apps-visual-studio-code/view-new-workflow.png)

   For example, opening the designer for a new workflow shows a blank canvas. You can now build this workflow in the Azure portal.

   ![Screenshot shows workflow designer and blank workflow.](./media/manage-logic-apps-visual-studio-code/opened-blank-workflow-designer.png)

<a name="delete-from-designer"></a>

## Delete items from the designer

To delete an item in your workflow from the designer, follow any of these steps:

* Select the item, open the item's shortcut menu (Shift+F10), and select **Delete**. To confirm, select **OK**.

* Select the item, and press the delete key. To confirm, select **OK**.

* Select the item so that details pane opens for that item. In the pane's upper right corner, open the ellipses (**...**) menu, and select **Delete**. To confirm, select **OK**.

  ![Screenshot shows a selected item on designer with opened information pane plus selected ellipses button and "Delete" command.](./media/manage-logic-apps-visual-studio-code/delete-item-from-designer.png)

  > [!TIP]
  > If the ellipses menu isn't visible, expand Visual Studio Code window wide enough so that 
  > the details pane shows the ellipses (**...**) button in the upper right corner.

## Related content

- [Create a Standard logic app workflow ]
