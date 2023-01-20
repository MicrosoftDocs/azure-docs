---
# Mandatory fields.
title: Integrate with Power Platform
titleSuffix: Azure Digital Twins
description: Learn how to connect Power Platform apps to Azure Digital Twins using the connector
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 01/13/2023
ms.topic: how-to
ms.service: digital-twins

---

# Integrate with Power Platform using the Azure Digital Twins connector

You can integrate Azure Digital Twins into a [Microsoft Power Platform](/power-platform) flow, using the *Azure Digital Twins Power Platform connector*. 

The connector is a wrapper around the Azure Digital Twins [data plane APIs](concepts-apis-sdks.md#data-plane-apis) for twin, model and query operations, which allows the underlying service to talk to [Microsoft Power Automate](/power-automate/getting-started), [Microsoft Power Apps](/power-apps/powerapps-overview), and [Azure Logic Apps](../logic-apps/logic-apps-overview.md). The connector provides a way for users to connect their accounts and leverage a set of prebuilt actions to build their apps and workflows.

For more information about the Azure Digital Twins Power Platform connector, including a complete list of the connector's actions and their parameters, see the [Azure Digital Twins connector reference documentation]().

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
Sign in to the [Azure portal](https://portal.azure.com) with your account. 

[!INCLUDE [digital-twins-prereq-instance.md](../../includes/digital-twins-prereq-instance.md)]

Lastly, you'll need to set up any [Power Platform](/power-platform) services where you want to use the connector.

## Set up the connector

Follow these steps to add the connection in Power Automate and Power Apps:

1. Select **Connections** from the left navigation menu (in Power Automate, it's under the **Data** heading). On the Connections page, select **+ New connection**.
1. Search for *Azure Digital Twins*, and select the **Azure Digital Twins** connector.
1. Where the connector asks for **ADT Instance Name**, enter the [host name of your instance](how-to-set-up-instance-portal.md#verify-success-and-collect-important-values).
1. Enter your login details when requested to finish setting up the connection.
1. To verify that the connection has been created, look for it on the Connections page.
    :::image type="content" source="media/how-to-use-power-platform-connector/power-connection.png" alt-text="Screenshot of Power Automate, showing the Azure Digital Twins connection on the Connections page." lightbox="media/how-to-use-power-platform-connector/power-connection.png":::

For Logic Apps, there's no need to set up the connector before creating your flow. You can move straight to the next section.

## Create a flow

Follow these steps to create a sample flow with the connector in Power Automate:
1. In Power Automate, select **My flows** from the left navigation menu. Select **+ New flow** and **Instant cloud flow**.
1. Enter a **Flow name** and select **Manually trigger a flow** from the list of triggers. **Create** the flow.
1. Add a step to the flow, and search for *Azure Digital Twins* to find the connection. Select the Azure Digital Twins connection.
    :::image type="content" source="media/how-to-use-power-platform-connector/power-automate-action-1.png" alt-text="Screenshot of Power Automate, showing the Azure Digital Twins connector in a new flow." lightbox="media/how-to-use-power-platform-connector/power-automate-action-1-big.png":::
1. You'll see a list of all the [actions]() that are available with the connector. Pick one of them to interact with the [Azure Digital Twins APIs](/rest/api/azure-digitaltwins/).
    :::image type="content" source="media/how-to-use-power-platform-connector/power-automate-action-2.png" alt-text="Screenshot of Power Automate, showing all the actions for the Azure Digital Twins connector." lightbox="media/how-to-use-power-platform-connector/power-automate-action-2-big.png":::
1. You can continue to edit or add more steps to your workflow to build out your integration scenario.
    :::image type="content" source="media/how-to-use-power-platform-connector/power-automate-action-3.png" alt-text="Screenshot of Power Automate, showing a Get twin by ID action from the Azure Digital Twins connector in a flow." lightbox="media/how-to-use-power-platform-connector/power-automate-action-3.png":::

Follow these steps to create a sample flow with the connector in Power Apps:
1. In Power Apps, select **+ Create** from the left navigation menu. Select **Blank app** and follow the prompts to create a new app.
1. In the app builder, select **Data** from the left navigation menu. Select **Add data** and search for *Azure Digital Twins* to find the data connection. Select the Azure Digital Twins connection.
    :::image type="content" source="media/how-to-use-power-platform-connector/power-apps-action-1.png" alt-text="Screenshot of Power Apps, showing the Azure Digital Twins connector as a data source." lightbox="media/how-to-use-power-platform-connector/power-apps-action-1.png":::
1. Now, the [actions]() from the Azure Digital Twins connector will be available as functions to use in your app.
    :::image type="content" source="media/how-to-use-power-platform-connector/power-apps-action-2.png" alt-text="Screenshot of Power Apps, showing the Get twin by ID action being used in a function." lightbox="media/how-to-use-power-platform-connector/power-apps-action-2.png":::
1. You can continue to build out your application with access to Azure Digital Twins data. For more information about building Power Apps, see [Overview of creating apps in Power Apps](/power-apps/maker/).

Follow these steps to create a sample flow with the connector in Logic Apps:
1. Navigate to Logic Apps in the [Azure portal](https://portal.azure.com). Select **Workflows** from the left navigation menu, and **+ Add**. Follow the prompts to create a new workflow.
1. Select your new flow and enter into the **Designer**.
1. Select **Choose an operation** to add a trigger. Search for *Azure Digital Twins* to find the data connection. Select the Azure Digital Twins connection.
    :::image type="content" source="media/how-to-use-power-platform-connector/logic-apps-action.png" alt-text="Screenshot of Logic Apps, showing the Azure Digital Twins connector." lightbox="media/how-to-use-power-platform-connector/logic-apps-action.png":::
1. You'll see a list of all the [actions]() that are available with the connector. Pick one of them to interact with the [Azure Digital Twins APIs](/rest/api/azure-digitaltwins/).
1. You can continue to edit or add more steps to your workflow to build out your integration scenario.

## See example flows

For examples of using the connector in Power Platform flows, see [Azure Digital Twins getting started samples](https://github.com/Azure-Samples/azure-digital-twins-getting-started).

## Next steps

For more information about Power Platform connectors, including how to use them in workflows across multiple products, see the [Power Platform and Azure Logic Apps connectors documentation](/connectors/connectors).