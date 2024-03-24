---
title: Send events from Azure API Management to Event Grid
description: In this quickstart, you enable Event Grid events for your Azure API Management instance, then send  events to a sample application.
author: dlepow
ms.topic: how-to
ms.service: api-management
ms.author: danlep
ms.date: 11/2/2021
ms.custom: devx-track-azurecli
---

# Send events from API Management to Event Grid

API Management integrates with [Azure Event Grid](../event-grid/overview.md) so that you can send event notifications to other services and trigger downstream processes. Event Grid is a fully managed event routing service that uses a publish-subscribe model. Event Grid has built-in support for Azure services like [Azure Functions](../azure-functions/functions-overview.md) and [Azure Logic Apps](../logic-apps/logic-apps-overview.md), and can deliver event alerts to non-Azure services using webhooks.

For example, using integration with Event Grid, you can build an application that updates a database, creates a billing account, and sends an email notification each time a user is added to your API Management instance.

In this article, you subscribe to Event Grid events in your API Management instance, trigger events, and send the events to an endpoint that processes the data. To keep it simple, you send events to a sample web app that collects and displays the messages:

:::image type="content" source="media/how-to-event-grid/event-grid-viewer-intro.png" alt-text="API Management events in Event Grid viewer":::

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]
- If you don't already have an API Management service, complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md)
- Enable a [system-assigned managed identity](api-management-howto-use-managed-service-identity.md#create-a-system-assigned-managed-identity) in your API Management instance.
- Create a [resource group](../azure-resource-manager/management/manage-resource-groups-portal.md#create-resource-groups) if you don't have one in which to deploy the sample endpoint.

## Create an event endpoint

In this section, you use a Resource Manager template to deploy a pre-built sample web application to Azure App Service. Later, you subscribe to your API Management instance's Event Grid events and specify this app as the endpoint to which the events are sent.

To deploy the sample app, you can use the Azure CLI, Azure PowerShell, or the Azure portal. The following example uses the [az deployment group create](/cli/azure/deployment/group#az-deployment-group-create) command in the Azure CLI.

* Set `RESOURCE_GROUP_NAME` to the name of an existing resource group
* Set `SITE_NAME` to a unique name for your web app

  The site name must be unique within Azure because it forms part of the fully qualified domain name (FQDN) of the web app. In a later section, you navigate to the app's FQDN in a web browser to view the events.

```azurecli-interactive
RESOURCE_GROUP_NAME=<your-resource-group-name>
SITE_NAME=<your-site-name>

az deployment group create \
    --resource-group $RESOURCE_GROUP_NAME \
    --template-uri "https://raw.githubusercontent.com/Azure-Samples/azure-event-grid-viewer/master/azuredeploy.json" \
    --parameters siteName=$SITE_NAME hostingPlanName=$SITE_NAME-plan
```

Once the deployment has succeeded (it might take a few minutes), open a browser and navigate to your web app to make sure it's running:

`https://<your-site-name>.azurewebsites.net`

You should see the sample app rendered with no event messages displayed.

[!INCLUDE [event-grid-register-provider-portal.md](../../articles/event-grid/includes/register-provider.md)]

## Subscribe to API Management events

In Event Grid, you subscribe to a *topic* to tell it which events you want to track, and where to send them. Here, you create a subscription to events in your API Management instance.

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. Select **Events > + Event Subscription**. 
1. On the **Basic** tab:
    * Enter a descriptive **Name** for the event subscription.
    * In **Event Types**, select one or more API Management event types to send to Event Grid. For the example in this article, select at least **Microsoft.APIManagement.ProductCreated** 
    * In **Endpoint Details**, select the **Web Hook** event type, click **Select an endpoint**, and enter your web app URL followed by `api/updates`. Example: `https://myapp.azurewebsites.net/api/updates`.
    * Select **Confirm selection**.
1. Leave the settings on the remaining tabs at their default values, and then select **Create**.

    :::image type="content" source="media/how-to-event-grid/create-event-subscription.png" alt-text="Create an event subscription in Azure portal":::

## Trigger and view events

Now that the sample app is up and running and you've subscribed to your API Management instance with Event Grid, you're ready to generate events.

As an example, [create a product](./api-management-howto-add-products.md) in your API Management instance. If your event subscription includes the **Microsoft.APIManagement.ProductCreated** event, creating the product triggers an event that is pushed to your web app endpoint. 

Navigate to your Event Grid Viewer web app, and you should see the `ProductCreated` event. Select the button next to the event to show the details. 

:::image type="content" source="media/how-to-event-grid/event-grid-viewer-product-created.png" alt-text="Product created event in Event Grid viewer":::

## Event Grid event schema

API Management event data includes the `resourceUri`, which identifies the API Management resource that triggered the event. For details about the API Management event message schema, see the Event Grid documentation:

[Azure Event Grid event schema for API Management](../event-grid/event-schema-api-management.md)

## Next steps

* Learn more about [subscribing to events](../event-grid/subscribe-through-portal.md).
