---
title: How to send events from Auth0 to Azure using Azure Event Grid
description: How to end events from Auth0 to Azure services with Azure Event Grid.
services: event-grid
author: femila

ms.service: event-grid
ms.topic: conceptual
ms.date: 05/18/2020
ms.author: femila
---

# Integrate Azure Event Grid with Auth0

This article describes how to connect your Auth0 and Azure accounts by creating an Event Grid partner topic.

See the [Auth0 event type codes](https://auth0.com/docs/logs/references/log-event-type-codes) for a full list of the events that Auth0 supports

## Send events from Auth0 to Azure Event Grid
To send Auth0 events to Azure:

1. Enable Event Grid resource provider
1. Set up an Auth0 Partner Topic in the Auth0 Dashboard
1. Activate the Partner Topic in Azure
1. Subscribe to events from Auth0

For more information about these concepts, see Event Grid [concepts](concepts.md).

### Enable Event Grid resource provider
Unless you've used Event Grid before, you'll need to register the Event Grid resource provider. If you’ve used Event Grid before, skip to the next section.

In the Azure portal:
1. Select Subscriptions on the left menu
1. Select the subscription you’re using for Event Grid
1. On the left menu, under Settings, select Resource providers
1. Find Microsoft.EventGrid
1. Select Register
1. Refresh to make sure the status changes to Registered

### Set up an Auth0 Partner Topic
Part of the integration process is to set up Auth0 for use as an event source (this step happens in your [Auth0 Dashboard](https://manage.auth0.com/)).

1. Log in to the [Auth0 Dashboard](https://manage.auth0.com/).
1. Navigate to Logs > Streams.
1. Click + Create Stream.
1. Select Azure Event Grid and enter a unique name for your new stream.
1. Create the event source by providing your Azure Subscription ID, Azure Region, and a Resource Group name. 
1. Click Save.

### Activate your Auth0 Partner Topic in Azure
Activating the Auth0 topic in Azure allows events to flow from Auth0 to Azure.

1. Log in to the Azure portal.
1. Search `Partner Topics` at the top and click `Event Grid Partner Topics` under services.
1. Click on the topic that matches the stream you created in your Auth0 Dashboard.
1. Confirm the `Source` field matches your Auth0 account.
1. Click Activate.

### Subscribe to Auth0 events

#### Create an event handler
To test your Partner Topic, you'll need an event handler. Go to your Azure subscription and spin up a service that is supported as an [event handler](event-handlers.md) such as an [Azure Function](custom-event-to-function.md).

#### Subscribe to your Auth0 Partner Topic
Subscribing to your Auth0 Partner Topic allows you to tell Event Grid where you want your Auth0 events to go.

1. On the Partner Topic blade for your Auth0 integration, select + Event Subscription at the top.
1. On the Create Event Subscription page:
    1. Enter a name for the event subscription.
    1. Select the Azure service or WebHook you created for the Endpoint type.
    1. Follow the instructions for the particular service.
    1. Click Create.

## Testing
Your Auth0 Partner Topic integration with Azure should be ready to use.

### Verify the integration
To verify that the integration is working as expected:

1. Log in to the Auth0 Dashboard.
1. Navigate to Logs > Streams.
1. Click on your Event Grid stream.
1. Once on the stream, click on the Health tab. The stream should be active and as long as you don't see any errors, the stream is working.

Try [invoking any of the Auth0 actions that trigger an event to be published](https://auth0.com/docs/logs/references/log-event-type-codes) to see events flow.

## Delivery attempts and retries
Auth0 events are delivered to Azure via a streaming mechanism. Each event is sent as it is triggered in Auth0. If Event Grid is unable to receive the event, Auth0 will retry up to three times to deliver the event. Otherwise, Auth0 will log the failure to deliver in its system.

## Next steps

- [Auth0 Partner Topic](auth0-overview.md)
- [Partner topics overview](partner-topics-overview.md)
- [Become an Event Grid partner](partner-onboarding-overview.md)