---
title: Manage Standard workflows with Visual Studio Code
description: Manage Standard workflows that run in single-tenant Azure Logic Apps with Visual Studio Code.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 03/12/2025
ms.custom: devx-track-dotnet
# Customer intent: As a logic apps developer, I want to manage my Standard logic app workflow using Visual Studio Code.
---

# Manage Standard logic app workflows with Visual Studio Code

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

This guide shows how to manage Standard logic apps and workflows that you create using Visual Studio Code with the **Azure Logic Apps (Standard)** extension.

<a name="manage-deployed-apps-vs-code"></a>

## Manage deployed logic apps in Visual Studio Code

In Visual Studio Code, you can view all the deployed logic apps in your Azure subscription, whether they're Consumption or Standard logic app resources, and select tasks that help you manage those logic apps. However, to access both resource types, you need both the **Azure Logic Apps (Consumption)** and the **Azure Logic Apps (Standard)** extensions for Visual Studio Code.

1. On the Visual Studio Code Activity Bar, select the Azure icon. In the **Resources**, expand your subscription, and then expand **Logic App**, which shows all the logic apps deployed in Azure for that subscription.

1. Open the logic app that you want to manage. From the logic app's shortcut menu, select the task that you want to perform.

   For example, you can select tasks such as stopping, starting, restarting, or deleting your deployed logic app. You can [disable or enable a workflow by using the Azure portal](manage-logic-apps-with-azure-portal.md#disable-enable-standard-workflows).

   > [!NOTE]
   > The stop logic app and delete logic app operations affect workflow instances in different ways. 
   > For more information, see [Considerations for stopping logic apps](#considerations-stop-logic-apps) and 
   > [Considerations for deleting logic apps](#considerations-delete-logic-apps).

   ![Screenshot shows Visual Studio Code with Resources section and deployed logic app resource.](./media/create-single-tenant-workflows-visual-studio-code/find-deployed-workflow-visual-studio-code.png)

1. To view all the workflows in the logic app, expand your logic app, and then expand the **Workflows** node.

1. To view a specific workflow, open the workflow's shortcut menu, and select **Open in Designer**, which opens the workflow in read-only mode.

   To edit the workflow, you have these options:

   * In Visual Studio Code, open your project's **workflow.json** file in the workflow designer, make your edits, and redeploy your logic app to Azure.

   * In the Azure portal, [open your logic app](#manage-deployed-apps-portal). You can then open, edit, and save your workflow.

1. To open the deployed logic app in the Azure portal, open the logic app's shortcut menu, and select **Open in Portal**.

   The Azure portal opens in your browser, signs you in to the portal automatically if you're signed in to Visual Studio Code, and shows your logic app.

   ![Screenshot shows Azure portal page for your logic app in Visual Studio Code.](./media/create-single-tenant-workflows-visual-studio-code/deployed-workflow-azure-portal.png)

   You can also sign in separately to the Azure portal, use the portal search box to find your logic app, and then select your logic app from the results list.

   ![Screenshot shows Azure portal and search bar with search results for deployed logic app, which appears selected.](./media/create-single-tenant-workflows-visual-studio-code/find-deployed-workflow-azure-portal.png)

<a name="considerations-stop-logic-apps"></a>

### Considerations for stopping logic apps

Stopping a logic app affects workflow instances in the following ways:

* Azure Logic Apps cancels all in-progress and pending runs immediately.

* Azure Logic Apps doesn't create or run new workflow instances.

* Triggers won't fire the next time that their conditions are met. However, trigger states remember the points where the logic app was stopped. So, if you restart the logic app, the triggers fire for all unprocessed items since the last run.

  To stop a trigger from firing on unprocessed items since the last run, clear the trigger state before you restart the logic app:

  1. On the Visual Studio Code Activity Bar, select the Azure icon to open the Azure window.

  1. In the **Resources** section, expand your subscription, which shows all the deployed logic apps for that subscription.

  1. Expand your logic app, and then expand the node that's named **Workflows**.

  1. Open a workflow, and edit any part of that workflow's trigger.

  1. Save your changes. This step resets the trigger's current state.

  1. Repeat for each workflow.

  1. When you're done, restart your logic app.

<a name="considerations-delete-logic-apps"></a>

### Considerations for deleting logic apps

Deleting a logic app affects workflow instances in the following ways:

* Azure Logic Apps cancels in-progress and pending runs immediately, but doesn't run cleanup tasks on the storage used by the app.

* Azure Logic Apps doesn't create or run new workflow instances.

* If you delete a workflow and then recreate the same workflow, the recreated workflow won't have the same metadata as the deleted workflow. To refresh the metadata, you have to resave any workflow that called the deleted workflow. That way, the caller gets the correct information for the recreated workflow. Otherwise, calls to the recreated workflow fail with an `Unauthorized` error. This behavior also applies to workflows that use artifacts in integration accounts and workflows that call Azure functions.

<a name="manage-deployed-apps-portal"></a>

## Manage deployed logic apps in the portal

After you deploy a logic app to the Azure portal from Visual Studio Code, you can view all the deployed logic apps that are in your Azure subscription, whether they're Consumption or Standard logic app resources. Currently, each resource type is organized and managed as separate categories in Azure. To find Standard logic apps, follow these steps:

1. In the Azure portal search box, enter **logic apps**. When the results list appears, under **Services**, select **Logic apps**.

   ![Screenshot shows Azure portal search box with logic apps as search text.](./media/create-single-tenant-workflows-visual-studio-code/portal-find-logic-app-resource.png)

1. On the **Logic apps** pane, select the logic app that you deployed from Visual Studio Code.

   ![Screenshot shows Azure portal and Standard logic app resources deployed in Azure.](./media/create-single-tenant-workflows-visual-studio-code/logic-app-resources-pane.png)

   The Azure portal opens the individual resource page for the selected logic app.

   ![Screenshot shows Azure portal and your logic app resource page.](./media/create-single-tenant-workflows-visual-studio-code/deployed-workflow-azure-portal.png)

1. To view the workflows in this logic app, on the logic app's menu, select **Workflows**.

   The **Workflows** pane shows all the workflows in the current logic app. This example shows the workflow that you created in Visual Studio Code.

   ![Screenshot shows your logic app resource page with opened Workflows pane and workflows.](./media/create-single-tenant-workflows-visual-studio-code/deployed-logic-app-workflows-pane.png)

1. To view a workflow, on the **Workflows** pane, select that workflow.

   The workflow pane opens and shows more information and tasks that you can perform on that workflow.

   For example, to view the steps in the workflow, select **Designer**.

   ![Screenshot shows selected workflow's Overview pane, while the workflow menu shows the selected "Designer" command.](./media/create-single-tenant-workflows-visual-studio-code/workflow-overview-pane-select-designer.png)

   The workflow designer opens and shows the workflow that you built in Visual Studio Code. You can now make changes to this workflow in the Azure portal.

   ![Screenshot shows workflow designer and workflow deployed from Visual Studio Code.](./media/create-single-tenant-workflows-visual-studio-code/opened-workflow-designer.png)

<a name="add-workflow-portal"></a>

## Add another workflow in the portal

Through the Azure portal, you can add blank workflows to a Standard logic app resource that you deployed from Visual Studio Code and build those workflows in the Azure portal.

1. In the [Azure portal](https://portal.azure.com), select your deployed Standard logic app resource.

1. On the logic app resource menu, select **Workflows**. On the **Workflows** pane, select **Add**.

   ![Screenshot shows selected logic app's Workflows pane and toolbar with Add command selected.](./media/create-single-tenant-workflows-visual-studio-code/add-new-workflow.png)

1. In the **New workflow** pane, provide name for the workflow. Select either **Stateful** or **Stateless** **>** **Create**.

   After Azure deploys your new workflow, which appears on the **Workflows** pane, select that workflow so that you can manage and perform other tasks, such as opening the designer or code view.

   ![Screenshot shows selected workflow with management and review options.](./media/create-single-tenant-workflows-visual-studio-code/view-new-workflow.png)

   For example, opening the designer for a new workflow shows a blank canvas. You can now build this workflow in the Azure portal.

   ![Screenshot shows workflow designer and blank workflow.](./media/create-single-tenant-workflows-visual-studio-code/opened-blank-workflow-designer.png)

<a name="delete-from-designer"></a>

## Delete items from the designer

To delete an item in your workflow from the designer, follow any of these steps:

* Select the item, open the item's shortcut menu (Shift+F10), and select **Delete**. To confirm, select **OK**.

* Select the item, and press the delete key. To confirm, select **OK**.

* Select the item so that details pane opens for that item. In the pane's upper right corner, open the ellipses (**...**) menu, and select **Delete**. To confirm, select **OK**.

  ![Screenshot shows a selected item on designer with opened information pane plus selected ellipses button and "Delete" command.](./media/create-single-tenant-workflows-visual-studio-code/delete-item-from-designer.png)

  > [!TIP]
  > If the ellipses menu isn't visible, expand Visual Studio Code window wide enough so that 
  > the details pane shows the ellipses (**...**) button in the upper right corner.

## Related content

- [Create a Standard logic app workflow ]
