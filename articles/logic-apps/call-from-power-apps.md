---
title: Call logic apps from Power Apps
description: Call logic apps from Microsoft Power Apps by exporting logic apps as custom connectors.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 01/10/2024
---

# Call logic app workflows from Power Apps

[!INCLUDE [logic-apps-sku-consumption](../../includes/logic-apps-sku-consumption.md)]

To call your logic app workflow from a Power Apps flow, you can export your logic app resource and workflow as a custom connector. You can then call your workflow from a flow in a Power Apps environment.

## Prerequisites

* An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* A Power Apps license.

* A Consumption logic app workflow with a request trigger to export.

  > [!NOTE]
  >
  > The Export capability is available only for Consumption logic app workflows in multitenant Azure Logic Apps.

* A Power Apps flow from where to call your logic app workflow.

## Export your logic app as a custom connector

Before you can call your workflow from Power Apps, you must first export your logic app resource as a custom connector.

1. In the [Azure portal](https://portal.azure.com) search box, enter **logic apps**. From the results, select **Logic apps**.

1. Select the logic app resource that you want to export.

1. On your logic app menu, select **Overview**. On the **Overview** page toolbar, select **Export** > **Export to Power Apps**.

   :::image type="content" source="./media/call-from-power-apps/export-logic-app.png" alt-text="Screenshot shows Azure portal and Overview toolbar with Export button selected.":::

1. On the **Export to Power Apps** pane, provide the following information:

   | Property | Description |
   |----------|-------------|
   | **Name** | Provide a name for the custom connector to create from your logic app. 
   | **Environment** | Select the Power Apps environment from which you want to call your logic app. 

1. When you're done, select **OK**. To confirm that your logic app was successfully exported, check the notifications pane.

### Export errors

Here are errors that might happen when you export your logic app as a custom connector and suggested solutions:

* **The current Logic App cannot be exported. To export, select a Logic App that has a request trigger.**: Check that your logic app workflow begins with a [Request trigger](../connectors/connectors-native-reqres.md).

## Connect to your logic app workflow from Power Apps

1. In [Power Apps](https://powerapps.microsoft.com/), on the **Power Apps** home page menu, select **Flows**.

1. On the **Flows** page, select the flow from where you want to call your logic app workflow.

1. On your flow page toolbar, select **Edit**.

1. In the flow editor, select **&#43; New step**.

1. In the **Choose an operation** search box, enter the name for your logic app custom connector.

   Optionally, to see only custom connectors in your environment, filter the results using the **Custom** tab, for example:

   :::image type="content" source="./media/call-from-power-apps/power-apps-custom-connector-action.png" alt-text="Screenshot shows Power Apps flow editor with a new operation added for custom connector and available actions.":::

1. Select the custom connector operation that you want to call from your flow.

1. Provide the necessary operation information to pass to the custom connector.

1. On the Power Apps editor toolbar, select **Save** to save your changes. 

1. In the [Azure portal](https://portal.azure.com), find and open the logic app resource that you exported.

1. Confirm that your logic app workflow works as expected with your Power Apps flow.

## Delete logic app custom connector from Power Apps

1. In [Power Apps](https://powerapps.microsoft.com), on the **Power Apps** home page menu, select **Discover**. On the **Discover** page, find the **Data** tile, and select **Custom connectors**.

1. In the list, find your custom connector, and select the ellipses (**...**) button, and then select **Delete**.

   :::image type="content" source="./media/call-from-power-apps/delete-custom-connector.png" alt-text="Screenshot shows Custom connectors page with custom connector management options.":::

1. To confirm deletion, select **OK**.

## Next steps

* [Managed connectors for Azure Logic Apps](/connectors/connector-reference/connector-reference-logicapps-connectors)
* [Built-in connectors for Azure Logic Apps](../connectors/built-in.md)
