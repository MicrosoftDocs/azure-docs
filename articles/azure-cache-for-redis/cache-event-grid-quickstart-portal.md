---
title: 'Quickstart: Route Azure Cache for Redis events to web endpoint with the Azure portal'
description: Use Azure Event Grid to subscribe to Azure Cache for Redis events, send the events to a Webhook, and handle the events in a web application
author: flang-msft
ms.author: franlanglois
ms.date: 1/5/2021
ms.topic: quickstart
ms.service: cache
ms.custom: mode-ui
---

# Quickstart: Route Azure Cache for Redis events to web endpoint with the Azure portal

Azure Event Grid is an eventing service for the cloud. In this quickstart, you'll use the Azure portal to create an Azure Cache for Redis instance, subscribe to events for that instance, trigger an event, and view the results. Typically, you send events to an endpoint that processes the event data and takes actions. However, to simplify this quickstart, you'll send events to a web app that will collect and display the messages.

[!INCLUDE [quickstarts-free-trial-note.md](../../includes/quickstarts-free-trial-note.md)]

When you're finished, you'll see that the event data has been sent to the web app.

:::image type="content" source="media/cache-event-grid-portal/event-grid-scaling.png" alt-text="Azure Event Grid Viewer scaling in JSON format.":::

## Create an Azure Cache for Redis cache instance

[!INCLUDE [redis-cache-create](includes/redis-cache-create.md)]

## Create a message endpoint

Before subscribing to the events for the cache instance, let's create the endpoint for the event message. Typically, the endpoint takes actions based on the event data. To simplify this quickstart, you'll deploy a [pre-built web app](https://github.com/Azure-Samples/azure-event-grid-viewer) that displays the event messages. The deployed solution includes an App Service plan, an App Service web app, and source code from GitHub.

1. Select **Deploy to Azure** in GitHub README to deploy the solution to your subscription.

    :::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" border="false" alt-text="Deploy to Azure button.":::

1. On the **Custom deployment** page, do the following steps:
    1. For **Resource group**, select the resource group that you created when creating the cache instance. It will be easier for you to clean up after you're done with the tutorial by deleting the resource group.  
    2. For **Site Name**, enter a name for the web app.
    3. For **Hosting plan name**, enter a name for the App Service plan to use for hosting the web app.
    4. Select the check box for **I agree to the terms and conditions stated above**.
    5. Select **Purchase**.

    | Setting      | Suggested value  | Description |
    | ------------ |  ------- | -------------------------------------------------- |
    | **Subscription** | Drop down and select your subscription. | The subscription in which you want to create this web app. |
    | **Resource group** | Drop down and select a resource group, or select **Create new** and enter a new resource group name. | By putting all your app resources in one resource group, you can easily manage or delete them together. |
    | **Site Name** | Enter a name for your web app. | This value can't be empty. |
    | **Hosting plan name** | Enter a name for the App Service plan to use for hosting the web app. | This value can't be empty. |

1. Select Alerts (bell icon) in the portal, and then select **Go to resource group**.

    :::image type="content" source="media/cache-event-grid-portal/deployment-notification.png" alt-text="Azure portal deployment notification.":::

1. On the **Resource group** page, in the list of resources, select the web app that you created. You'll also see the App Service plan and the cache instance in this list.

1. On the **App Service** page for your web app, select the URL to navigate to the web site. The URL should be in this format: `https://<your-site-name>.azurewebsites.net`.

1. Confirm that you see the site but no events have been posted to it yet.

    :::image type="content" source="media/cache-event-grid-portal/blank-event-grid-viewer.png" alt-text="Empty Event Grid Viewer site.":::

[!INCLUDE [register-provider.md](../../articles/event-grid/includes/register-provider.md)]


## Subscribe to the Azure Cache for Redis instance

In this step, you'll subscribe to a topic to tell Event Grid which events you want to track, and where to send the events.

1. In the portal, navigate to your cache instance that you created earlier.
1. On the **Azure Cache for Redis** page, select **Events** on the left menu.
1. Select **Web Hook**. You're sending events to your viewer app using a web hook for the endpoint.

     :::image type="content" source="media/cache-event-grid-portal/event-grid-web-hook.png" alt-text="Azure portal Events page.":::

1. On the **Create Event Subscription** page, enter the following:

    | Setting      | Suggested value  | Description |
    | ------------ |  ------- | -------------------------------------------------- |
    | **Name** | Enter a name for the event subscription. | The value must be between 3 and 64 characters long. It can only contain letters, numbers, and dashes. |
    | **Event Types** | Drop down and select which event type(s) you want to get pushed to your destination. For this quickstart, we'll be scaling our cache instance. | Patching, scaling, import and export are the available options. |
    | **Endpoint Type** | Select **Web Hook**. | Event handler to receive your events. |
    | **Endpoint** | Select **Select an endpoint**, and enter the URL of your web app and add `api/updates` to the home page URL (for example: `https://cache.azurewebsites.net/api/updates`), and then select **Confirm Selection**. | This is the URL of your web app that you created earlier. |

1. Now, on the **Create Event Subscription** page, select **Create** to create the event subscription.

1. View your web app again, and notice that a subscription validation event has been sent to it. Select the eye icon to expand the event data. Event Grid sends the validation event so the endpoint can verify that it wants to receive event data. The web app includes code to validate the subscription.

    :::image type="content" source="media/cache-event-grid-portal/subscription-event.png" alt-text="Azure Event Grid Viewer.":::

## Send an event to your endpoint

Now, let's trigger an event to see how Event Grid distributes the message to your endpoint. We'll be scaling your Azure Cache for Redis instance.

1. In the Azure portal, navigate to your Azure Cache for Redis instance and select **Scale** on the left menu.

1. Select the desired pricing tier from the **Scale** page and select **Select**.

    You can scale to a different pricing tier with the following restrictions:

    * You can't scale from a higher pricing tier to a lower pricing tier.
      * You can't scale from a **Premium** cache down to a **Standard** or a **Basic** cache.
      * You can't scale from a **Standard** cache down to a **Basic** cache.
    * You can scale from a **Basic** cache to a **Standard** cache but you can't change the size at the same time. If you need a different size, you can do a subsequent scaling operation to the desired size.
    * You can't scale from a **Basic** cache directly to a **Premium** cache. First, scale from **Basic** to **Standard** in one scaling operation, and then from **Standard** to **Premium** in a subsequent scaling operation.
    * You can't scale from a larger size down to the **C0 (250 MB)** size.

    While the cache is scaling to the new pricing tier, a **Scaling** status is displayed using **Azure Cache for Redis** on the left. When scaling is complete, the status changes from **Scaling** to **Running**.

1. You've triggered the event, and Event Grid sent the message to the endpoint you configured when subscribing. The message is in the JSON format and it contains an array with one or more events. In the following example, the JSON message contains an array with one event. View your web app and notice that a **ScalingCompleted** event was received.

    :::image type="content" source="media/cache-event-grid-portal/event-grid-scaling.png" alt-text="Azure Event Grid Viewer scaling in JSON format.":::

## Clean up resources

If you plan to continue working with this event, don't clean up the resources created in this quickstart. Otherwise, delete the resources you created in this quickstart.

Select the resource group, and select **Delete resource group**.

## Next steps

Now that you know how to create custom topics and event subscriptions, learn more about what Event Grid can help you do:

* [Reacting to Azure Cache for Redis events](cache-event-grid.md)
* [About Event Grid](../event-grid/overview.md)
