---
title: Call Consumption Workflows from Power Apps
description: Call Consumption logic app workflows from Microsoft Power Apps by exporting logic apps as custom connectors.
services: azure-logic-apps
ms.suite: integration
ms.reviewers: estfan, azla
ms.topic: how-to
ms.update-cycle: 1095-days
ms.date: 03/31/2026
# Customer intent: As an integration developer who works with Azure Logic Apps and Microsoft Power Apps, I want to call a logic app workflow from Power Apps by exporting my logic app resource as a custom connector.
---

# Call Consumption logic app workflows from Power Apps

[!INCLUDE [logic-apps-sku-consumption](includes/logic-apps-sku-consumption.md)]

When you need to run your logic app workflow from a Power Apps environment, export your logic app resource and workflow as a custom connector from the Azure portal. You can then use that connector in Power Apps to call your workflow.

## Prerequisites

- An Azure account and subscription. [Get a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- A Power Apps license.

- A Consumption logic app workflow that starts with the **Request** trigger.

  The Export capability is available only for Consumption logic app workflows in multitenant Azure Logic Apps.

- A Power Apps flow from where to call your logic app workflow.

## 1: Export your logic app as a custom connector

Before you can call your workflow from Power Apps, first export your logic app resource as a custom connector by following these steps:

1. In the [Azure portal](https://portal.azure.com) search box, enter `logic apps`. From the results, select **Logic apps**.

1. From the **Logic apps** page, select the Consumption logic app resource to export.

1. On the logic app sidebar, select **Overview**. On the **Overview** page toolbar, select **Export** > **Export to Power Apps**.

   :::image type="content" source="./media/call-from-power-apps/export-logic-app.png" alt-text="Screenshot shows Azure portal and Overview toolbar with Export to Power Apps selected.":::

1. On the **Export to Power Apps** pane, provide the following information:

   | Property | Description |
   |----------|-------------|
   | **Name** | Enter a name for the custom connector to create from your logic app. |
   | **Environment** | Select the Power Apps environment from where to call your logic app workflow. |

   > [!NOTE]
   >
   > If you get the following error, make sure that your logic app workflow starts with the [**Request** trigger](../connectors/connectors-native-reqres.md#add-a-request-trigger):
   >
   >  **The current Logic App cannot be exported. To export, select a Logic App that has a request trigger.**

1. When you finish, select **OK**. To confirm that the portal successfully exported the logic app, on the Azure title bar, open the notifications pane.

## 2: Call your logic app workflow from Power Apps

1. In [Power Apps](https://powerapps.microsoft.com/), on the sidebar, select **Flows**.

1. On the **Flows** page, select the flow from where you want to call your logic app workflow.

1. On the flow information page toolbar, select **Edit**.

1. In the flow designer, under the operation where you want to call the logic app workflow, select **&#43; New step**.

1. In the **Choose an operation** search box, enter the name for your custom connector.

   To show only custom connectors in your environment, select the **Custom** tab, for example:

   :::image type="content" source="./media/call-from-power-apps/power-apps-custom-connector-action.png" alt-text="Screenshot shows Power Apps flow designer with exported custom connector and available operations.":::

1. Select the operation to call from your flow.

1. Provide the necessary information to run the selected operation.

1. Save your changes. On the flow designer toolbar, select **Save**.

## 3: Test your workflow

1. In Power Apps, run the flow to call and run the logic app workflow.

1. In the [Azure portal](https://portal.azure.com), on the exported logic app resource sidebar, under **Development Tools**, select **Run history**. From the runs list, select the run triggered by your flow in Power Apps.

1. Confirm that your workflow ran as expected from your Power Apps flow.

For more information, see [Review workflow run history](view-workflow-status-run-history.md?tabs=consumption#review-workflow-run-history).

## Delete custom connector from Power Apps

When you don't need your custom connector anymore, delete the connector from your flow.

1. In [Power Apps](https://powerapps.microsoft.com), on the sidebar, select **Custom connectors**. If **Custom connectors** doesn't exist on the sidebar, select **More**, and then select **Discover all**.

1. From the list, find your custom connector, select the ellipses (**...**) button, and then select **Delete**.

   :::image type="content" source="./media/call-from-power-apps/delete-custom-connector.png" alt-text="Screenshot shows a custom connector with the ellipses button selected.":::

1. To finish, select **Delete**.

## Troubleshoot problems

### Environment not found

This error usually occurs when the connection to a logic app workflow is unavailable or incorrect. To help you troubleshoot this problem, try the following options:

| Option | Details |
| ------ | ------- |
| Check the environment name | Make sure that the environment name in the connection matches the deployment environment for your logic app resource. |
| Check environment availability | Make sure that the logic app resource environment is available and not disabled or deleted. To check the environment status, go to the Power Platform admin center. |
| Check connection settings | In Power Apps, check that the connection to the logic app is correctly set up and points to the correct environment. |
| Check permissions | Make sure you have the required permissions to access the logic app workflow and environment. You might need specific roles assigned to you. <br>For more information, see: <br>- [Secure data and access to workflows](/azure/logic-apps/logic-apps-securing-a-logic-app?tabs=azure-portal#access-to-logic-app-operations) <br>- [Access for inbound calls to request-based triggers](/azure/logic-apps/logic-apps-securing-a-logic-app?tabs=azure-portal#access-for-inbound-calls-to-request-based-triggers) |
| Update the logic app | Check whether the logic app workflow has recent changes. For example, if the resource moved to a different environment, update the connection in Power Apps to reflect these changes. |
| Review logs | Check the logs in Power Apps and Azure Logic Apps for any other error messages or information that might help identify the problem. |

## Related content

- [Managed connectors for Azure Logic Apps](/connectors/connector-reference/connector-reference-logicapps-connectors)
- [Built-in connectors for Azure Logic Apps](../connectors/built-in.md)
