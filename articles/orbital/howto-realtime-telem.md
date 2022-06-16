---
title: Receive real-time telemetry
description: Learn how to receive real-time telemetry during contacts.
author: hrshelar
ms.service: orbital
ms.topic: how-to
ms.custom: ga
ms.date: 06/13/2022
ms.author: mikailasmith
---

# Receive real-time telemetry

An Azure Orbital Ground station emits telemetry events can be used to analyze the ground station operation during a contact. You can configure your contact profile to send such telemetry events to Azure Event Hubs. The steps below describe how to create an Event Hubs and grant Azure Orbital access to send events to it.

## Configure Event Hubs

1. In your subscription, go to Resource Provider settings and register Microsoft.Orbital as a provider
1. Create an Azure Event Hubs  in your subscription.
1. From the left menu, select Access Control (IAM). Under Grant Access to this Resource, select Add Role Assignment
1. Select Azure Event Hubs Data Sender.
1. Assign access to 'User, group, or service principal'
1. Click '+ Select members'
1. Search for 'Azure Orbital Resource Provider' and press Select
1. Press Review + Assign. This action will grant Azure Orbital the rights to send telemetry into your event hub.
1. To confirm the newly added role assignment, go back to the Access Control (IAM) page and select View access to this resource.
Congrats! Orbital can now communicate with your hub.

## Enable telemetry for a contact profile in the Azure portal

Ensure the contact profile is configured as follows:

1. Choose a namespace using the Event Hubs Namespace dropdown.
1. Choose an instance using the Event Hubs Instance dropdown that appears after namespace selection.

## Schedule a contact

Schedule a contact using the Contact Profile that you previously configured for Telemetry.

Once the contact begins, you should begin seeing data in your Event Hubs soon after.

## Verifying telemetry data
You can verify both the presence and content of incoming telemetry data multiple ways.

*Portal: Event Hubs Capture*.
Confirm data flow.
To verify that events are being received in your Event Hubs, you can check the graphs present on the Event Hubs namespace Overview page. This view shows data across all Event Hubs instances within a namespace. You can navigate to the Overview page of a specific instance to see the graphs for that instance.

*Verify content of telemetry data*.
You can enable Event Hub’s Capture feature that will automatically deliver the telemetry data to an Azure Blob storage account of your choosing.
Follow the instructions [here](/azure/event-hubs/event-hubs-capture-enable-through-portal) to enable Capture.
Once enabled, you can check your container and view/download the data.


## Event Hubs consumer

Code: Event Hubs Consumer. 
Event Hubs documentation provides guidance on how to write simple consumer apps to receive events from your Event Hubs:
- [Python](/azure/event-hubs/event-hubs-python-get-started-send)
- [.NET](/azure/event-hubs/event-hubs-dotnet-standard-getstarted-send)
- [Java](/azure/event-hubs/event-hubs-java-get-started-send)
- [JavaScript](/azure/event-hubs/event-hubs-node-get-started-send)

We have provided sample code (to add) based on the Python guide that includes code specific to have to access the expected metadata that Azure Orbital will send with each event and the format of our messages. See the Orbital Telemetry Schema section that documents the format of our event messages.

## Understanding telemetry points

The ground station provides telemetry using Avro as a schema. The file is located here (to add): 


## Next steps

- [Event Hubs using Python Getting Started](/azure/event-hubs/event-hubs-python-get-started-send)
- [Azure Event Hubs client library for Python code samples](/azure-sdk-for-python/tree/main/sdk/eventhub/azure-eventhub/samples/async_samples)

