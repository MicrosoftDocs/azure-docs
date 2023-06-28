---
title: Call logic apps from Power Automate and Power Apps
description: Call logic apps from Microsoft Power Automate flows by exporting logic apps as connectors.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 08/20/2022
---

# Call logic apps from Power Automate and Power Apps

[!INCLUDE [logic-apps-sku-consumption](../../includes/logic-apps-sku-consumption.md)]

To call your logic apps from Microsoft Power Automate and Microsoft Power Apps, you can export your logic apps as connectors. When you expose a logic app as a custom connector in a Power Automate or Power Apps environment, you can then call your logic app from flows there.

If you want to migrate your flow from Power Automate or Power to Logic Apps instead, see [Export flows from Power Automate and deploy to Azure Logic Apps](export-from-microsoft-flow-logic-app-template.md).

> [!NOTE]
> Not all Power Automate connectors are available in Azure Logic Apps. You can migrate only Power Automate flows 
> that have the equivalent connectors in Azure Logic Apps. For example, the Button trigger, the Approval connector, 
> and Notification connector are specific to Power Automate. Currently, OpenAPI-based flows in Power Automate aren't 
> supported for export and deployment as logic app templates.
>
> * To find which Power Automate connectors don't have Logic Apps equivalents, see 
> [Power Automate connectors](/connectors/connector-reference/connector-reference-powerautomate-connectors).
>
> * To find which Logic Apps connectors don't have Power Automate equivalents, see 
> [Logic Apps connectors](/connectors/connector-reference/connector-reference-logicapps-connectors).

## Prerequisites

* An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* A Power Automate or Power Apps license.

* A Consumption logic app workflow with a request trigger to export.

  > [!NOTE]
  >
  > The Export capability is available only for Consumption logic app workflows in multi-tenant Azure Logic Apps.

* A flow in Power Automate or Power Apps from which you want to call your logic app.

## Export your logic app as a custom connector

Before you can call your logic app from Power Automate or Power Apps, you must first export your logic app as a custom connector.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the Azure portal search box, enter `Logic Apps`. In the results, under **Services**, select **Logic Apps**.

1. Select the logic app that you want to export.

1. From your logic app's menu, select **Export**.

    :::image type="content" source="./media/call-logic-apps-from-power-automate-power-apps/export-logic-app.png" alt-text="Screenshot of logic app's page in Azure portal, showing menu with 'Export' button selected.":::

1. On the **Export** pane, for **Name**, enter a name for the custom connector to your logic app. From the **Environment** list, select the Power Automate or Power Apps environment from which you want to call your logic app. When you're done, select **OK**.

    :::image type="content" source="./media/call-logic-apps-from-power-automate-power-apps/export-logic-app2.png" alt-text="Screenshot of export pane for logic app, showing required fields for custom connector name and environment.":::

1. To confirm that your logic app was successfully exported, check the notifications pane.

### Exporting errors

Here are errors that might happen when you export your logic app as a custom connector and their suggested solutions:

* **Failed to get environments. Make sure your account is configured for Power Automate, then try again.**: Check that your Azure account has a Power Automate plan.

* **The current Logic App cannot be exported. To export, select a Logic App that has a request trigger.**: Check that your logic app begins with a [request trigger](./logic-apps-workflow-actions-triggers.md#request-trigger).

## Connect to your logic app from Power Automate

To connect to the logic app that you exported with your Power Automate flow:

1. Sign in to [Power Automate](https://make.powerautomate.com).

1. From the **Power Automate** home page menu, select **My flows**.

1. On the **Flows** page, select the flow that you want to connect to your logic app.

1. From your flow page's menu, select **Edit**.

1. In the flow editor, select **&#43; New step**.

1. Under **Choose an action**, in the search box, enter the name of your logic app connector. Optionally, to show only the custom connectors in your environment, filter the results by selecting the **Custom** tab.

    :::image type="content" source="./media/call-logic-apps-from-power-automate-power-apps/power-automate-custom-connector-action.png" alt-text="Screenshot of Power Automate flow editor, showing a new step being added for the custom connector and available actions.":::

1. Select the action that you want to take with your logic app connector. 

1. Provide the information that the action passes to the logic app connector.

1. To save your changes, from the Power Automate editor menu, select **Save**.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the Logic Apps service, find the logic app that you exported.

1. Confirm that your logic app works the way that you expect in your Power Automate flow.

## Delete logic app connector from Power Automate

1. Sign in to [Power Automate](https://make.powerautomate.com).

1. On the **Power Automate** home page, select **Data** &gt; **Custom connectors** in the menu.

1. In the list, find your custom connector, and select the ellipses (**...**) button &gt; **Delete**.

    :::image type="content" source="./media/call-logic-apps-from-power-automate-power-apps/delete-custom-connector.png" alt-text="Screenshot of Power Automate 'Custom connectors' page, showing logic app's custom connector management buttons.":::

1. To confirm the deletion, select **OK**.

## Connect to your logic app from Power Apps

To connect to the logic app that you exported with your Power Apps flow:

1. Sign in to [Power Apps](https://powerapps.microsoft.com/).

1. On the **Power Apps** home page, select **Flows** in the menu.

1. On the **Flows** page, select the flow that you want to connect to your logic app.

1. On your flow's page, select **Edit** in the flow's menu.

1. In the flow editor, select the **&#43; New step** button.

1. Under **Choose an action** in the new step, enter the name of your logic app connector in the search box. Optionally, filter the results by the **Custom** tab to see only custom connectors in your environment.

    :::image type="content" source="./media/call-logic-apps-from-power-automate-power-apps/power-apps-custom-connector-action.png" alt-text="Screenshot of Power Apps flow editor, showing a new step being added for the custom connector and available actions.":::

1. Select the action that you want to take with the connector. 

1. Configure what information your action passes to the logic app connector.

1. In the Power Apps editor menu, select **Save** to save your changes. 

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the Logic Apps service, find the logic app that you exported.

1. Confirm that your logic app is functioning as intended with your Power Apps flow.

## Delete logic app connector from Power Apps

1. Sign in to [Power Apps](https://powerapps.microsoft.com).

1. On the **Power Apps** home page, select **Data** &gt; **Custom Connectors** in the menu.

1. In the list, find your custom connector, and select the ellipses (**...**) button &gt; **Delete**.

    :::image type="content" source="./media/call-logic-apps-from-power-automate-power-apps/delete-custom-connector.png" alt-text="Screenshot of Power Apps 'Custom connectors' page, showing logic app's custom connector management buttons.":::

1. To confirm the deletion, select **OK**.

## Next steps

* [Managed connectors for Azure Logic Apps](/connectors/connector-reference/connector-reference-logicapps-connectors)
* [Built-in connectors for Azure Logic Apps](../connectors/built-in.md)