---
title: Create message routing and endpoints — Azure Resource Manager | Microsoft Docs
description: A how-to article that creates and deletes routes and endpoints in IoT Hub, using Azure Resource Manager.
author: kgremban
ms.service: iot-hub
services: iot-hub
ms.topic: how-to
ms.date: 10/28/2022
ms.author: kgremban
---

# Message routing with IoT Hub — Azure Resource Manager

[Azure Resource Manager (ARM)](/azure/azure-resource-manager/templates/) is useful when you need to define resources in a JSON file using a template. Each resource in Azure has a template to export that defines the components used in that resource.

This article shows you how to export your IoT hub template, add a route to it, then deploy the template back to your IoT hub using Azure CLI or PowerShell. We use an ARM template to create routes and endpoints to Event Hubs, Service Bus queue, Service Bus topic, and Azure Storage.

> [!IMPORTANT]
> The ARM template will replace the existing resource, if there is one, when deployed. If you're creating a new IoT hub, this is not a concern and you can use a [basic template](/azure/azure-resource-manager/templates/syntax#template-format) with the required properties. 
>
> However, adding a route to an existing IoT hub ARM template, exported from your IoT hub, ensures all other resources and properties connected will remain after deployment (they will not be replaced). For example, an exported ARM template might contain storage information for your IoT hub, if you've connected it to storage.

To learn more about how routing works in IoT Hub, see [Use IoT Hub message routing to send device-to-cloud messages to different endpoints](/azure/iot-hub/iot-hub-devguide-messages-d2c). To walk through setting up a route that sends messages to storage, testing on a simulated device, see [Tutorial: Send device data to Azure Storage using IoT Hub message routing](/azure/iot-hub/tutorial-routing?tabs=portal).

## Prerequisites

**Azure Resource Manager (ARM)**

This article uses templates from ARM. To understand more about ARM, see [What are ARM templates?](/azure/azure-resource-manager/templates/overview)

**IoT Hub and an endpoint service**

You need an IoT hub and at least one other service to serve as an endpoint to an IoT hub route. You can choose which Azure service (Event Hubs, Service Bus queue or topic, or Azure Storage) endpoint that you'd like to connect with your IoT Hub route.

* An IoT hub in your [Azure subscription](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). If you don't have a hub yet, you can follow the steps in [Create an IoT hub using Azure Resource Manager template (PowerShell)](/azure/iot-hub/iot-hub-rm-template-powershell).

* (Optional) An Event Hubs resource (with container). If you need to create a new Event Hubs resource, see [Quickstart: Create an event hub by using an ARM template](/azure/event-hubs/event-hubs-resource-manager-namespace-event-hub).

* (Optional) A Service Bus queue resource. If you need to create a new Service Bus queue, see [Quickstart: Create a Service Bus namespace and a queue using an ARM template](/azure/service-bus-messaging/service-bus-resource-manager-namespace-queue).

* (Optional) A Service Bus topic resource. If you need to create a new Service Bus topic, see [Quickstart: Create a Service Bus namespace with topic and subscription using an Azure Resource Manager template](/azure/service-bus-messaging/service-bus-resource-manager-namespace-topic).

* (Optional) An Azure Storage resource. If you need to create a new Azure Storage, see [Create a storage account](/azure/storage/common/storage-account-create?tabs=template).

## Create a route

In IoT Hub, you can create a route to send messages or capture events. Each route has an endpoint, where the messages or events end up, and a data source, where the messages or events originate. You choose these locations when creating a new route in the IoT Hub. Routing queries are then used to filter messages or events before they go to the endpoint.

You can use Events Hubs, a Service Bus queue or topic, or an Azure storage as an endpoint in your IoT hub route. A resource for the service must first be created in your Azure account.

Let's export an ARM template from your IoT hub, then we'll add a route to it.

1. Go to your IoT hub in the Azure portal and select **Export template** at the bottom of the menu under **Automation**.
 
   :::image type="content" source="media/iot-hub-how-to-routing-arm/export-menu-option.jpg" alt-text="Screenshot that shows location of the export template option in the menu of the IoT Hub.":::

1. You see a JSON file generated for your IoT hub. Uncheck the **Include parameters** box. 

   Select **Download** to download a local copy of this file.

   :::image type="content" source="media/iot-hub-how-to-routing-arm/download-template.jpg" alt-text="Screenshot that shows location of the download button on the Export template page.":::

   There are a lot of placeholders for information in this template in case you want to add features or services to your IoT hub in the future. But for this article, we only need to add something to the **routes** property.

1. Open the JSON file in a text editor and find the **"routes": []** property, nested under **"routing"**, and add the following new route, according to the endpoint service (Event Hubs, Service Bus queue or topic, or Azure Storage) you choose. 
   
   Our default fallback route collects messages from `DeviceMessages`, let's choose another option such as `DeviceConnectionStateEvents`. For more information on source options, see [az iot hub route](/cli/azure/iot/hub/route#az-iot-hub-route-create-required-parameters).

   > [!CAUTION]
   > If you replace your existing **"routes"** with the following route, the old ones will be removed upon deployment. To preserve existing routes, *add* this route (the code in the `"routes"[],` brackets) to the **"routes"** list.

# [Event Hubs](#tab/eventhubs)

If you need to create an Event Hubs resource (with container), see [Quickstart: Create an event hub by using an ARM template](/azure/event-hubs/event-hubs-resource-manager-namespace-event-hub). 

```json
"routes": [
    {
        "name": "MyIotHubRoute",
        "source": "DeviceConnectionStateEvents",
        "condition": "true",
        "endpointNames": [
        "eventhubs"
        ],
        "isEnabled": true
    }
],
```

# [Service Bus queue](#tab/servicebusqueue)



# [Service Bus topic](#tab/servicebustopic)



# [Azure Storage](#tab/azurestorage)
