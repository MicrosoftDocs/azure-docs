---
title: How to send events from Auth0 to Azure using Azure Event Grid
description: How to end events from Auth0 to Azure services with Azure Event Grid.
ms.topic: conceptual
ms.date: 07/22/2021
---

# Integrate Azure Event Grid with Auth0

This article describes how to connect your Auth0 and Azure accounts by creating an Event Grid partner topic.

See the [Auth0 event type codes](https://auth0.com/docs/logs/references/log-event-type-codes) for a full list of the events that Auth0 supports

## Send events from Auth0 to Azure Event Grid
To send Auth0 events to Azure:

1. [Enable Event Grid resource provider](subscribe-to-partner-events.md#register-the-event-grid-resource-provider)
1. [Set up an Auth0 partner topic](#set-up-an-auth0-partner-topic) in the Auth0 Dashboard
1. [Activate the partner topic](subscribe-to-partner-events.md#activate-partner-topic) in Azure. The topic name matches the stream name you created in your Auth0 dashboard. Confirm the `Source` field matches your Auth0 account.
1. [Subscribe to events from the partner topic](subscribe-to-partner-events.md#subscribe-to-events)

For more information about these concepts, see Event Grid [concepts](concepts.md).

## Set up an Auth0 Partner Topic
Part of the integration process is to set up Auth0 for use as an event source (this step happens in your [Auth0 Dashboard](https://manage.auth0.com/)).

1. Log in to the [Auth0 Dashboard](https://manage.auth0.com/).
1. Navigate to Logs > Streams.
1. Click + Create Stream.
1. Select Azure Event Grid and enter a unique name for your new stream.
1. Create the event source by providing your Azure Subscription ID, Azure Region, and a Resource Group name. 
1. Click Save.

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
- [Partner topics overview](partner-events-overview.md)
- [Become an Event Grid partner](partner-onboarding-overview.md)