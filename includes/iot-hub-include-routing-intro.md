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

[Message routing](../articles/iot-hub/iot-hub-devguide-messages-d2c.md) enables sending telemetry data from your IoT devices to built-in Event Hub-compatible endpoints or custom endpoints such as blob storage, Service Bus Queues, Service Bus Topics, and Event Hubs. To configure custom message routing, you create [routing queries](../articles/iot-hub/iot-hub-devguide-routing-query-syntax.md) to customize the route that matches a certain condition. Once set up, the incoming data is automatically routed to the endpoints by the IoT Hub. If a message doesn't match any of the defined routing queries, it is routed to  the default endpoint.

In this 2-part tutorial, you learn how to set up and use these custom routing queries with IoT Hub. You route messages from an IoT device to one of multiple endpoints, including blob storage and a Service Bus queue. Messages to the Service Bus queue are picked up by a Logic App and sent via e-mail. Messages that do not have custom message routing defined are sent to the default endpoint, then picked up by Azure Stream Analytics and viewed in a Power BI visualization.

To complete parts 1 and 2 of this tutorial, you performed the following tasks:

**Part I: Create resources, set up message routing**
> [!div class="checklist"]
> * Create the resources -- an IoT hub, a storage account, a Service Bus queue, and a simulated device. This can be done using the portal, the Azure CLI, Azure PowerShell, or an Azure Resource Manager template.
> * Configure the endpoints and message routes in IoT Hub for the storage account and Service Bus queue.

**Part II: Send messages to the hub, view routed results**
> [!div class="checklist"]
> * Create a Logic App that is triggered and sends e-mail when a message is added to the Service Bus queue.
> * Download and run an app that simulates an IoT Device sending messages to the hub for the different routing options.
> * Create a Power BI visualization for data sent to the default endpoint.
> * View the results ...
> * ...in the Service Bus queue and e-mails.
> * ...in the storage account.
> * ...in the Power BI visualization.

## Prerequisites

* For part 1 of this tutorial:
  - You must have an Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* For part 2 of this tutorial:
  - You must have completed Part 1 of this tutorial, and have the resources still available.
  - Install [Visual Studio](https://www.visualstudio.com/).
  - A Power BI account to analyze the default endpoint's stream analytics. ([Try Power BI for free](https://app.powerbi.com/signupredirect?pbi_source=web).)
  - An Office 365 account to send notification e-mails.

[!INCLUDE [cloud-shell-try-it.md](cloud-shell-try-it.md)]
