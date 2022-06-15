---
title: Receive realtime telemetry
description: Learn how to receive realtime telemetry during contacts.
author: hrshelar
ms.service: orbital
ms.topic: how-to
ms.custom: ga
ms.date: 06/13/2022
ms.author: mikailasmith
---

# Receive realtime telemetry

An Azure Orbital Ground station emits telemetry events can be used to analyze the ground station operation for the duration of the contact. You can configure your contact profile to send such telemetry events to Azure Event Hubs. The steps below describe how to create an event hub and grant Azure Orbital access to send events to it.

## Configure event hubs

1. In your subscription, go to Resource Provider settings and register Microsoft.Orbital as a provider
1. Create an Azure Event Hub  in your subscription.
1. From the left menu, select Access Control (IAM). Under Grant Access to this Resource, select Add Role Assignment
1. Select Azure Event Hubs Data Sender.
1. Assign access to 'User, group, or service principal'
1. Click '+ Select members'
1. Search for 'Azure Orbital Resource Provider' and press Select
1. Press Review + Assign. This will grant Azure Orbital the rights to send telemetry into your event hub.
1. To confirm the newly added role assignment, go back to the Access Control (IAM) page and select View access to this resource.
Congrats! Orbital can now communicate with your hub.

## Enable telemetry for a contact profile in the Azure Portal

Ensure the contact profile is configured as follows:

Choose a namespace using the Event Hub Namespace dropdown
Choose an instance using the Event Hub Instance dropdown that appears after namespace selection.

## Schedule a contact

Schedule a contact using the Contact Profile that you previously configured for Telemetry.

Once the contact begins, you should begin seeing data in your Event Hub soon after.

## Verifying telemetry data
You can verify both the presence and content of incoming telemetry data multiple ways.

*Portal: Event Hub Capture*
Confirm data flow
To verify that events are being received in your Event Hub, you can check the graphs present on the Event Hub namespace Overview page. This shows data across all event hub instances within a namespace. You can navigate to the Overview page of a specific instance to see the graphs for that instance.

*Verify content of telemetry data*
You can enable Event Hub’s Capture feature that will automatically deliver the telemetry data to an Azure Blob storage account of your choosing.
Follow the instructions here to enable Capture: https://docs.microsoft.com/en-us/azure/event-hubs/event-hubs-capture-enable-through-portal
Once enabled, you can check your container and view/download the data.


## Event Hub consumer

Code: Event Hub Consumer 
Event Hub documentation provides lots of guidance on how to write simple consumer apps to receive events from your Event Hubs:
- [Python](/azure/event-hubs/event-hubs-python-get-started-send)
- [.NET](/azure/event-hubs/event-hubs-dotnet-standard-getstarted-send)
- [Java](/azure/event-hubs/event-hubs-java-get-started-send)
- [JavaScript](https://docs.microsoft.com/en-us/azure/event-hubs/event-hubs-node-get-started-send)

We have provided [sample code](consume-telemetry.py) based on the Python guide that includes code specific to have to access the expected metadata that Azure Orbital will send with each event and the format of our messages. Please see the Orbital Telemetry Schema section that documents the format of our event messages.

## Understanding telemetry points

The groundstation provides telemetry using Avro as a schema. The file is located here (to add): 


## Next steps

- [Event Hubs using Python Getting Started](/azure/event-hubs/event-hubs-python-get-started-send)
- [Azure Event Hubs client library for Python code samples](/azure-sdk-for-python/tree/main/sdk/eventhub/azure-eventhub/samples/async_samples)

