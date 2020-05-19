---
title: How to send events from Auth0 to Azure 
description: How to end events from Auth0 to Azure services with Azure Event Grid.
services: event-grid
author: banisadr

ms.service: event-grid
ms.date: 05/18/2020
ms.author: babanisa
---

Integrate Azure Event Grid with Auth0
In this article
Azure’s Event Grid is a serverless event bus that acts as an intermediary allowing you to send data from Auth0 into the Azure ecosystem.
You can create an event-driven workflow using Event Grid to send your Auth0 tenant logs to the targets of your choice (e.g., Azure Functions, Event Hubs, Sentinel and Logic Apps).
See the Auth0 event type codes for a full list of the events that Auth0 supports
Send events from Auth0 to Azure Event Grid
To send Auth0 events to Azure, you will need:
Enable Event Grid resource provider
Set up an event source (in this case, this is Auth0).
Set up an event handler, the app or service where the event will be sent.
For more information about these concepts, see Concepts in Azure Event Grid
Enable Event Grid resource provider
If you haven’t previously used Event Grid, you will need to register the Event Grid resource provider. If you’ve used Event Grid before, skip to the next section.

In your Azure portal:
Select Subscriptions on the left menu
Select the subscription you’re using for Event Grid
On the left menu, under Settings, select Resource providers
Find Microsoft.EventGrid
Select Register
Refresh to make sure the status changes to Registered
Set up an Auth0 event source
Part of the integration process is to set Auth0 up for use as an event source (this step happens on your Dashboard).
Log in to the Auth0 Dashboard.
Navigate to Logs > Streams.
Click + Create Stream.
Select Azure Event Grid and enter a unique name for your new stream.
Create the event source by providing your Azure Subscription ID, Azure Region and a Resource Group name. 
Click Save.
Go to the Azure Portal to complete the final steps of the integration.
Set up an event handler
Go to your Azure subscription and spin up a service that is supported as an event handler (for a full list of all supported event handlers go to this article).
Activate your Auth0 Partner Topic in Azure
Activating the Auth0 topic in Azure allows events to flow from Auth0 to Azure.
Log in to the Azure Portal.
Search `Partner Topics` at the top and click `Event Grid Partner Topics` under services.
Click on the topic that matches the stream you created in your Auth0 Dashboard.
Confirm the `Source` field matches your Auth0 account.
Click Activate.

Subscribe to your Auth0 Partner Topic
You subscribe to an event grid topic to tell Event Grid which events to send to which event handler.
On the Event Grid topic page, select + Event Subscription on the toolbar
On the Create Event Subscription page:
Enter a name for the event subscription.
Select your desired Azure service or WebHook for the Endpoint type.
Follow the instructions for the particular service.
Back on the Create Event Subscription page, select Create.
To send events to your topic, please follow the instructions on this article.
Testing
At this point, your Event Grid workflow should be complete. 
Verify the integration
To verify that the integration is working as expected:
Log in to the Auth0 Dashboard.
Navigate to Logs > Streams.
Click on your Event Grid stream.
Once on the stream, click on the Health tab. The stream should be active and as long as you don't see any errors, the stream is working.
Delivery attempts and retries
Auth0 events are delivered to AWS via a streaming mechanism that sends each event as it is triggered in our system. If EventBridge is unable to receive the event, we will retry up to three times to deliver the event; otherwise, we will log the failure to deliver in our system.

