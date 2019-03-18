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

[Message routing](../articles/iot-hub/iot-hub-devguide-messages-d2c.md) enables sending telemetry data from your IoT devices to built-in Event Hub-compatible endpoints or custom endpoints such as blob storage, Service Bus Queues, Service Bus Topics, and Event Hubs. To configure message routing, you create [routing queries](../articles/iot-hub/iot-hub-devguide-routing-query-syntax.md) to customize the route that matches a certain condition. Once set up, the incoming data is automatically routed to the endpoints by the IoT Hub. 

In this 2-part tutorial, you learn how to set up and use these routing queries with IoT Hub. You route messages from an IoT device to one of multiple endpoints, including blob storage and a Service Bus queue. Messages to the Service Bus queue are picked up by a Logic App and sent via e-mail. Messages that do not have custom message routing defined are sent to the default endpoint, then picked up by Azure Stream Analytics and viewed in a Power BI visualization.

 To complete parts 1 and 2 of this tutorial, you perform the following tasks:

**Part I: Create resources, set up message routing**
> [!div class="checklist"]
> * Create the resources -- an IoT hub, a storage account, a Service Bus queue, and a simulated device.
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

- An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- Install [Visual Studio](https://www.visualstudio.com/). 

- A Power BI account to analyze the default endpoint's stream analytics. ([Try Power BI for free](https://app.powerbi.com/signupredirect?pbi_source=web).)

- An Office 365 account to send notification e-mails. 

[!INCLUDE [cloud-shell-try-it.md](cloud-shell-try-it.md)]
## Create resources

For this tutorial, you need an IoT hub, a storage account, and a Service Bus queue. These resources can be created using Azure CLI, Azure PowerShell, the Azure portal, or an Azure Resource Manager template. Use the same resource group and location for all of the resources. Then at the end, you can remove all of the resources in one step by deleting the resource group.

The following sections describe these steps.

1. Create a [resource group](../articles/azure-resource-manager/resource-group-overview.md). 

2. Create an IoT hub in the S1 tier. Add a consumer group to your IoT hub. The consumer group is used by the Azure Stream Analytics when retrieving data.

   > [!NOTE]
   > You must use an Iot hub in a paid tier to complete this tutorial. The free tier only allows you to set up one endpoint, and this tutorial requires multiple endpoints.
   > 

3. Create a standard V1 storage account with Standard_LRS replication.

4. Create a Service Bus namespace and queue. 

5. Create a device identity for the simulated device that sends messages to your hub. Save the key for the testing phase.
