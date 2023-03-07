---
title: Send Auth0 events Azure Monitor Application Insights
description: This article shows how to send Auth0 events received by Azure Event Grid to Azure Monitor Application Insights.
ms.topic: how-to
ms.date: 10/12/2022
---

# Send Auth0 events to Azure Monitor Application Insights
This article shows how to send Auth0 events received by Azure Event Grid to Azure Monitor Application Insights.

## Prerequisites

[Create an Azure Event Grid stream on Auth0](https://marketplace.auth0.com/integrations/azure-log-streaming).

## Create an Azure function

1. Create an Azure function by following instructions from the **Create a local project** section of [Quickstart: Create a JavaScript function in Azure using Visual Studio Code](../azure-functions/create-first-function-vs-code-node.md).
    1. Select **Azure Event Grid trigger** for the function template instead of **HTTP trigger** as mentioned in the quickstart. 
    1. Continue to follow the steps, but use the following **index.js**. 

        > [!IMPORTANT]
        > Update the **package.json** to include `applicationinsights` as a dependency.
    
        **index.js**
    
        ```javascript
        const appInsights = require("applicationinsights");
        appInsights.setup();
        const appInsightsClient = appInsights.defaultClient;

        // Event Grid always sends an array of data and may send more
        // than one event in the array. The runtime invokes this function
        // once for each array element, so we are always dealing with one.
        // See: https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-event-grid-trigger?tabs=
        module.exports = async function (context, eventGridEvent) {
            context.log(typeof eventGridEvent);
            context.log(eventGridEvent);

            // As written, the Application Insights custom event will not be
            // correlated to any other context or span. If the custom event
            // should be correlated to the parent function invocation, use
            // the tagOverrides property. For example:
            // var operationIdOverride = {
                // "ai.operation.id": context.traceContext.traceparent
            // };
            // client.trackEvent({
                // name: "correlated to function invocation",
                // tagOverrides: operationIdOverride,
                // properties: {}
            // });

            context.log(`Sending to App Insights...`);

            appInsightsClient.trackEvent({
                name: "Event Grid Event",
                properties: {
                    eventGridEvent: eventGridEvent
                }
            });

            context.log(`Sent to App Insights successfully`);
        };
        ```    
1. Create an Azure function app using instructions from [Quick function app create](../azure-functions/functions-develop-vs-code.md?tabs=csharp#quick-function-app-create).
1. Deploy your function to the function app on Azure using instructions from [Deploy project files](../azure-functions/functions-develop-vs-code.md?tabs=csharp#republish-project-files).

     
## Create event subscription for partner topic using function

1. In the Azure portal, navigate to the Event Grid **partner topic** created by your **Auth0 log stream**.

    :::image type="content" source="./media/auth0-log-stream-blob-storage/add-event-subscription-menu.png" alt-text="Screenshot showing the Event Grid Partner Topics page with Add Event Subscription button selected.":::
1. On the **Create Event Subscription** page, follow these steps:
    1. Enter a **name** for the event subscription.
    1. For **Endpoint type**, select **Azure Function**.
    
        :::image type="content" source="./media/auth0-log-stream-blob-storage/select-endpoint-type.png" alt-text="Screenshot showing the Create Event Subscription page with Azure Functions selected as the endpoint type.":::
    1. Click **Select an endpoint** to specify details about the function. 
1. On the **Select Azure Function** page, follow these steps.
    1. Select the **Azure subscription** that contains the function.
    1. Select the **resource group** that contains the function.
    1. Select your **function app**.
    1. Select your **Azure function**.
    1. Then, select **Confirm Selection**. 
1. Now, back on the **Create Event Subscription** page, select **Create** to create the event subscription. 
1. After the event subscription is created successfully, you see the event subscription in the bottom pane of the **Event Grid Partner Topic - Overview** page.
1. Select the link to your Azure function at the bottom of the page. 
1. On the **Azure Function** page, select **Application Insights** under **Settings** on the left menu. 
1. Select **Application Insights** link and then select **View Application Insights data**. 
1. Once your Auth0 logs are generated, your data should now be visible in Application Insights 

    > [!NOTE]
    > You can use steps in the article to handle events from other event sources too. For a generic example of sending Event Grid events to Azure Blob Storage or Azure Monitor Application Insights, see [this example on GitHub](https://github.com/awkwardindustries/azure-monitor-handler).

## Next steps

- [Auth0 Partner Topic](auth0-overview.md)
- [Subscribe to Auth0 events](auth0-how-to.md)
- [Send Auth0 events to Azure Monitor Application Insights](auth0-log-stream-app-insights.md)
