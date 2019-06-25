---
title: Monitor Azure Media Services events with Event Grid using CLI  | Microsoft Docs
description: This article shows how to subscribe to Event Grid in order to monitor Azure Media Services events.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 11/09/2018
ms.author: juliako
---

# Create and monitor Media Services events with Event Grid using the Azure CLI

Azure Event Grid is an eventing service for the cloud. This service uses [event subscriptions](../../event-grid/concepts.md#event-subscriptions) to route event messages to subscribers. Media Services events contain all the information you need to respond to changes in your data. You can identify a  Media Services event because the eventType property starts with "Microsoft.Media.". For more information, see [Media Services event schemas](media-services-event-schemas.md).

In this article, you use the Azure CLI to subscribe to events for your Azure Media Services account. Then, you trigger events to view the result. Typically, you send events to an endpoint that processes the event data and takes actions. In this article, you send the events to a web app that collects and displays the messages.

## Prerequisites

- An active Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.
- Install and use the CLI locally, this article requires the Azure CLI version 2.0 or later. Run `az --version` to find the version you have. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli). 

    Currently, not all [Media Services v3 CLI](https://aka.ms/ams-v3-cli-ref) commands work in the Azure Cloud Shell. It is recommended to use the CLI locally.

- [Create a Media Services account](create-account-cli-how-to.md).

    Make sure to remember the values that you used for the resource group name and Media Services account name.

## Create a message endpoint

Before subscribing to the events for the Media Services account, let's create the endpoint for the event message. Typically, the endpoint takes actions based on the event data. In this article, you deploy a [pre-built web app](https://github.com/Azure-Samples/azure-event-grid-viewer) that displays the event messages. The deployed solution includes an App Service plan, an App Service web app, and source code from GitHub.

1. Select **Deploy to Azure** to deploy the solution to your subscription. In the Azure portal, provide values for the parameters.

   <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fazure-event-grid-viewer%2Fmaster%2Fazuredeploy.json" target="_blank"><img src="https://azuredeploy.net/deploybutton.png"/></a>

1. The deployment may take a few minutes to complete. After the deployment has succeeded, view your web app to make sure it's running. In a web browser, navigate to: 
`https://<your-site-name>.azurewebsites.net`

If you switch to the "Azure Event Grid Viewer" site, you see it has no events yet.
   
[!INCLUDE [event-grid-register-provider-portal.md](../../../includes/event-grid-register-provider-portal.md)]

## Set the Azure subscription

In the following command, provide the Azure subscription ID that you want to use for the Media Services account. You can see a list of subscriptions that you have access to by navigating to [Subscriptions](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade).

```azurecli
az account set --subscription mySubscriptionId
```

## Subscribe to Media Services events

You subscribe to an article to tell Event Grid which events you want to track. The following example subscribes to the Media Services account you created, and passes the URL from the website you created as the endpoint for event notification. 

Replace `<event_subscription_name>` with a unique name for your event subscription. For `<resource_group_name>` and `<ams_account_name>`, use the values you used when creating the Media Services account. For the `<endpoint_URL>`, provide the URL of your web app and add `api/updates` to the home page URL. By specifying the endpoint when subscribing, Event Grid handles the routing of events to that endpoint. 

1. Get the resource id

    ```azurecli
    amsResourceId=$(az ams account show --name <ams_account_name> --resource-group <resource_group_name> --query id --output tsv)
    ```

    For example:

    ```
    amsResourceId=$(az ams account show --name amsaccount --resource-group amsResourceGroup --query id --output tsv)
    ```

2. Subscribe to the events

    ```azurecli
    az eventgrid event-subscription create \
    --resource-id $amsResourceId \
    --name <event_subscription_name> \
    --endpoint <endpoint_URL>
    ```

    For example:

    ```
    az eventgrid event-subscription create --resource-id $amsResourceId --name amsTestEventSubscription --endpoint https://amstesteventgrid.azurewebsites.net/api/updates/
    ```    

    > [!TIP]
    > You might get validation handshake warning. Give it a few minutes and the handshake should validate.

Now, let's trigger events to see how Event Grid distributes the message to your endpoint.

## Send an event to your endpoint

You can trigger events for the Media Services account by running an encoding job. You can follow [this quickstart](stream-files-dotnet-quickstart.md) to encode a file and start sending events. 

View your web app again, and notice that a subscription validation event has been sent to it. Event Grid sends the validation event so the endpoint can verify that it wants to receive event data. The endpoint has to set `validationResponse` to `validationCode`. For more information, see [Event Grid security and authentication](../../event-grid/security-authentication.md). You can view the web app code to see how it validates the subscription.

> [!TIP]
> Select the eye icon to expand the event data. Do not refresh the page, if you want to view all the events.

![View subscription event](./media/monitor-events-portal/view-subscription-event.png)

## Next steps

[Upload, encode, and stream](stream-files-tutorial-with-api.md)

