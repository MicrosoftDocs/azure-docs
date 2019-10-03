---
title: include file
description: include file
author: robinsh
ms.service: iot-hub
services: iot-hub
ms.topic: include
ms.date: 03/05/2019
ms.author: robinsh
ms.custom: include file
---
<!-- description of message routing used in the Azure CLI, PowerShell, and RM routing articles.-->

You are going to route messages to different resources based on properties attached to the message by the simulated device. Messages that are not custom routed are sent to the default endpoint (messages/events). In the next tutorial, you send messages to the IoT Hub and see them routed to the different destinations.

|value |Result|
|------|------|
|level="storage" |Write to Azure Storage.|
|level="critical" |Write to a Service Bus queue. A Logic App retrieves the message from the queue and uses Office 365 to e-mail the message.|
|default |Display this data using Power BI.|

The first step is to set up the endpoint to which the data will be routed. The second step is to set up the message route that uses that endpoint. After setting up the routing, you can view the endpoints and message routes in the portal.