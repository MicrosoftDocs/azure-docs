---
# Mandatory fields.
title: Integrate with Power Platform and Logic Apps
titleSuffix: Azure Digital Twins
description: Learn how to connect Power Platform and Logic Apps to Azure Digital Twins using the connector
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 03/22/2023
ms.topic: how-to
ms.service: digital-twins

---

# Integrate with Power Platform and Logic Apps using the Azure Digital Twins connector

You can integrate Azure Digital Twins into a [Microsoft Power Platform](/power-platform) or [Azure Logic Apps](../logic-apps/logic-apps-overview.md) flow, using the *Azure Digital Twins Power Platform connector*. 

The connector is a wrapper around the Azure Digital Twins [data plane APIs](concepts-apis-sdks.md#data-plane-apis) for twin, model and query operations, which allows the underlying service to talk to [Microsoft Power Automate](/power-automate/getting-started), [Microsoft Power Apps](/power-apps/powerapps-overview), and [Azure Logic Apps](../logic-apps/logic-apps-overview.md). The connector provides a way for users to connect their accounts and leverage a set of prebuilt actions to build their apps and workflows.

For an introduction to the connector, including a quick demo, watch the following IoT show video:

> [!VIDEO https://aka.ms/docs/player?id=d6c200c2-f622-4254-b61f-d5db613bbd11]

You can also complete a basic walkthrough in the blog post [Simplify building automated workflows and apps powered by Azure Digital Twins](https://techcommunity.microsoft.com/t5/internet-of-things-blog/simplify-building-automated-workflows-and-apps-powered-by-azure/ba-p/3763051). For more information about the connector, including a complete list of the connector's actions and their parameters, see the [Azure Digital Twins connector reference documentation](/connectors/azuredigitaltwins).

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
Sign in to the [Azure portal](https://portal.azure.com) with your account. 

[!INCLUDE [digital-twins-prereq-instance.md](../../includes/digital-twins-prereq-instance.md)]

Lastly, you'll need to set up any [Power Platform](/power-platform) services where you want to use the connector.

## Set up the connector

For Power Automate and Power Apps, set up the connection first before creating a flow. Follow the steps below to add the connection in Power Automate and Power Apps.
1. Select **Connections** from the left navigation menu (in Power Automate, it's under the **Data** heading). On the Connections page, select **+ New connection**.
1. Search for *Azure Digital Twins*, and select the **Azure Digital Twins (preview)** connector.
1. Where the connector asks for **ADT Instance Name**, enter the [host name of your instance](how-to-set-up-instance-portal.md#verify-success-and-collect-important-values).
1. Enter your authentication details when requested to finish setting up the connection.
1. To verify that the connection has been created, look for it on the Connections page.
    :::image type="content" source="media/how-to-use-power-platform-logic-apps-connector/power-connection.png" alt-text="Screenshot of Power Automate, showing the Azure Digital Twins connection on the Connections page." lightbox="media/how-to-use-power-platform-logic-apps-connector/power-connection.png":::

For Logic Apps, you can use the Azure Digital Twins built-in connection when you [create a flow](#create-a-flow) in the next section. For more information on built-in connectors, see [Built-in connectors in Azure Logic Apps](../connectors/built-in.md).

## Create a flow

You can incorporate Azure Digital Twins into Power Automate flows, Logic Apps flows, or Power Apps applications. Using the Azure Digital Twins connector and over 700 other Power Platform connectors, you can ingest data from other systems into your twins, or respond to system events.

Follow the steps below to create a sample flow with the connector in Power Automate.
1. In Power Automate, select **My flows** from the left navigation menu. Select **+ New flow** and **Instant cloud flow**.
1. Enter a **Flow name** and select **Manually trigger a flow** from the list of triggers. **Create** the flow.
1. Add a step to the flow, and search for *Azure Digital Twins* to find the connection. Select the Azure Digital Twins connection.
    :::image type="content" source="media/how-to-use-power-platform-logic-apps-connector/power-automate-action-1.png" alt-text="Screenshot of Power Automate, showing the Azure Digital Twins connector in a new flow." lightbox="media/how-to-use-power-platform-logic-apps-connector/power-automate-action-1-big.png":::
1. You'll see a list of all the [actions](/connectors/azuredigitaltwins) that are available with the connector. Pick one of them to interact with the [Azure Digital Twins APIs](/rest/api/azure-digitaltwins/).
    :::image type="content" source="media/how-to-use-power-platform-logic-apps-connector/power-automate-action-2.png" alt-text="Screenshot of Power Automate, showing all the actions for the Azure Digital Twins connector." lightbox="media/how-to-use-power-platform-logic-apps-connector/power-automate-action-2-big.png":::
1. You can continue to edit or add more steps to your workflow, using other connectors to build out your integration scenario.
    :::image type="content" source="media/how-to-use-power-platform-logic-apps-connector/power-automate-action-3.png" alt-text="Screenshot of Power Automate, showing a Get twin by ID action from the Azure Digital Twins connector in a flow." lightbox="media/how-to-use-power-platform-logic-apps-connector/power-automate-action-3.png":::

Follow the steps below to create a sample flow with the connector in Power Apps.
1. In Power Apps, select **+ Create** from the left navigation menu. Select **Blank app** and follow the prompts to create a new app.
1. In the app builder, select **Data** from the left navigation menu. Select **Add data** and search for *Azure Digital Twins* to find the data connection. Select the Azure Digital Twins connection.
    :::image type="content" source="media/how-to-use-power-platform-logic-apps-connector/power-apps-action-1.png" alt-text="Screenshot of Power Apps, showing the Azure Digital Twins connector as a data source." lightbox="media/how-to-use-power-platform-logic-apps-connector/power-apps-action-1.png":::
1. Now, the [actions](/connectors/azuredigitaltwins) from the Azure Digital Twins connector will be available as functions to use in your app.
    :::image type="content" source="media/how-to-use-power-platform-logic-apps-connector/power-apps-action-2.png" alt-text="Screenshot of Power Apps, showing the Get twin by ID action being used in a function." lightbox="media/how-to-use-power-platform-logic-apps-connector/power-apps-action-2.png":::
1. You can continue to build out your application with access to Azure Digital Twins data. For more information about building Power Apps, see [Overview of creating apps in Power Apps](/power-apps/maker/).

Follow the steps below to create a sample flow with the connector in Logic Apps.
1. Navigate to your logic app in the [Azure portal](https://portal.azure.com). Select **Workflows** from the left navigation menu, and **+ Add**. Follow the prompts to create a new workflow.
1. Select your new flow and enter into the **Designer**.
1. Add a trigger to your app.
1. Select **Choose an operation** to add an action from the Azure Digital Twins connector. Search for *Azure Digital Twins* on the **Azure** tab to find the data connection. Select the Azure Digital Twins connection.
    :::image type="content" source="media/how-to-use-power-platform-logic-apps-connector/logic-apps-action.png" alt-text="Screenshot of Logic Apps, showing the Azure Digital Twins connector." lightbox="media/how-to-use-power-platform-logic-apps-connector/logic-apps-action.png":::
1. You'll see a list of all the [actions](/connectors/azuredigitaltwins) that are available with the connector. Pick one of them to interact with the [Azure Digital Twins APIs](/rest/api/azure-digitaltwins/).
1. After selecting an action from the Azure Digital Twins connector, you'll be asked to enter authentication details to create the connection.
1. You can continue to edit or add more steps to your workflow, using other connectors to build out your integration scenario.

## Limitations and suggestions

Here are some limitations of the connector and suggestions for working with them.

* Some connector actions (such as Add Model) require input in the form of a literal string that starts with *@*. In these cases, escape the *@* character by using *@@* instead. This will keep the literal value from being interpreted as a JSON expression.
* Since Azure Digital Twins deals with dynamic schema responses, you should parse the JSON received from the APIs before consuming it in your application. For example, here's a set of calls that parse the data before extracting the `dtId` value: `Set(jsonVal, AzureDigitalTwins.GetTwinById("your_twin_id").result); Set(parsedResp, ParseJSON(jsonVal)); Set( DtId, Text(parsedResp.'$dtId'));`.

## Next steps

For more information about Power Platform connectors, including how to use them in workflows across multiple products, see the [Power Platform and Azure Logic Apps connectors documentation](/connectors/connectors).