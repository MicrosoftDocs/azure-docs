---
title: Log Azure Communication Services events
titleSuffix: An Azure Communication Services how-to document
description: "In this how-to, you'll learn how to log Azure Communication Services events to Azure Table Storage"
author: ddematheu2
manager: shahen
services: azure-communication-services
ms.author: dademath
ms.date: 02/09/2022
ms.topic: how-to
ms.service: azure-communication-services
---

# Logging SMS and Email delivery / engagement events into Azure Storage

Logging events can provide visibility to customers on events being fired across their resource. Many of these events are also logged to Azure Monitor, but having a path to log directly through Event Grid can help developers during testing and validation.

Pre-Reqs
-	Create an Azure Table Storage resource. You will need a storage account in Azure. As part of this step you will create a table 
-	You will need the following values to configure the Azure Table Storage connector:
o	Connection name: Any string
o	Storage account resource name
o	Access key for the storage account
Pro-Code
[WIP]
No-Code
1.	Use the event grid connector to receive events. Connector automatically sets up the connection with the ACS resources. Creates an event subscription and configures the events it wants to receive.
 

Can select which events you want to log. If you want to log events separately, can create multiple tables. Trivial to add other events across other primitives using this approach.

2.	Add the connector for insert entity for Azure Table Storage. Configure the connector using the authentication values from the pre-reqs. 
3.	Once configured, select the table to which you want to write events. Design the entity that will be added to the table. You will need a Partition Key and Row Key for each event. Row Key is the primary key for the table. Partition Key dictates how items are stored. (Should be the same for groups of events)

 

4.	Test the flow by sending an SMS to one of the phone numbers owned by your resource. See the section below for visualizing the event.
