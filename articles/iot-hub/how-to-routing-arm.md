---
title: Message routing with IoT Hub — Azure Resource Manager | Microsoft Docs
description: A how-to article that creates and deletes routes and endpoints in IoT Hub, using Azure Resource Manager.
author: kgremban
ms.service: iot-hub
services: iot-hub
ms.topic: how-to
ms.date: 11/11/2022
ms.author: kgremban
---

# Message routing with IoT Hub — Azure Resource Manager

This article shows you how to export your IoT hub template, add a route to it, then deploy the template back to your IoT hub using Azure CLI or PowerShell. We use a Resource Manager template to create routes and endpoints to Event Hubs, Service Bus queue, Service Bus topic, and Azure Storage.

[Azure Resource Manager templates](../azure-resource-manager/templates/overview.md) are useful when you need to define resources in a JSON file. Each resource in Azure has a template to export that defines the components used in that resource.

> [!IMPORTANT]
> The Resource Manager template will replace the existing resource, if there is one, when deployed. If you're creating a new IoT hub, this is not a concern and you can use a [basic template](/azure/azure-resource-manager/templates/syntax#template-format) with the required properties instead of exporting an existing template from your IoT hub. 
>
> However, adding a route to an existing IoT hub Resource Manager template, exported from your IoT hub, ensures all other resources and properties connected will remain after deployment (they won't be replaced). For example, an exported Resource Manager template might contain storage information for your IoT hub, if you've connected it to storage.

To learn more about how routing works in IoT Hub, see [Use IoT Hub message routing to send device-to-cloud messages to different endpoints](iot-hub-devguide-messages-d2c.md). To walk through setting up a route that sends messages to storage, testing on a simulated device, see [Tutorial: Send device data to Azure Storage using IoT Hub message routing](/azure/iot-hub/tutorial-routing?tabs=portal).

## Prerequisites

**Azure Resource Manager**

This article uses a template from Resource Manager. To understand more about Resource Manager, see [What are ARM templates?](../azure-resource-manager/templates/overview.md)

**IoT Hub and an endpoint service**

You need an IoT hub and at least one other service to serve as an endpoint to an IoT hub route. You can choose which Azure service (Event Hubs, Service Bus queue or topic, or Azure Storage) endpoint that you'd like to connect with your IoT Hub route.

* An IoT hub in your [Azure subscription](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). If you don't have a hub yet, you can follow the steps in [Create an IoT hub using Azure Resource Manager template (PowerShell)](iot-hub-rm-template-powershell.md).

* (Optional) An Event Hubs resource (with container). If you need to create a new Event Hubs resource, see [Quickstart: Create an event hub by using an ARM template](../event-hubs/event-hubs-resource-manager-namespace-event-hub.md).

* (Optional) A Service Bus queue resource. If you need to create a new Service Bus queue, see [Quickstart: Create a Service Bus namespace and a queue using an ARM template](../service-bus-messaging/service-bus-resource-manager-namespace-queue.md).

* (Optional) A Service Bus topic resource. If you need to create a new Service Bus topic, see [Quickstart: Create a Service Bus namespace with topic and subscription using an Azure Resource Manager template](../service-bus-messaging/service-bus-resource-manager-namespace-topic.md).

* (Optional) An Azure Storage resource. If you need to create a new Azure Storage, see [Create a storage account](/azure/storage/common/storage-account-create?tabs=template).

## Create a route

In IoT Hub, you can create a route to send messages or capture events. Each route has an endpoint, where the messages or events end up, and a data source, where the messages or events originate. You choose these locations when creating a new route in the IoT Hub. Routing queries are then used to filter messages or events before they go to the endpoint.

You can use Events Hubs, a Service Bus queue or topic, or an Azure storage as an endpoint in your IoT hub route. A resource for the service must first be created in your Azure account.

### Export the Resource Manager template from your IoT hub

Let's export a Resource Manager template from your IoT hub, then we'll add a route to it.

1. Go to your IoT hub in the Azure portal and select **Export template** at the bottom of the menu under **Automation**.
 
   :::image type="content" source="media/how-to-routing-arm/export-menu-option.jpg" alt-text="Screenshot that shows location of the export template option in the menu of the IoT Hub.":::

1. You see a JSON file generated for your IoT hub. Uncheck the **Include parameters** box. 

   Select **Download** to download a local copy of this file.

   :::image type="content" source="media/how-to-routing-arm/download-template.jpg" alt-text="Screenshot that shows location of the download button on the Export template page.":::

   There are several placeholders for information in this template in case you want to add features or services to your IoT hub in the future. But for this article, we only need to add something to the `routes` property.

### Add a new endpoint to your Resource Manager template

In the JSON file, find the `"endpoints": []` property, nested under `"routing"`, and add the following new endpoint, according to the endpoint service (Event Hubs, Service Bus queue or topic, or Azure Storage) you choose. 

* The **id** will be added for you, so leave it as a blank string for now.

# [Event Hubs](#tab/eventhubs)

If you need to create an Event Hubs resource (with container), see [Quickstart: Create an event hub by using an ARM template](../event-hubs/event-hubs-resource-manager-namespace-event-hub.md). 

Grab your primary connection string from your Event Hubs resource in the [Azure portal](https://portal.azure.com/#home) from its **Shared access policies** page. Select one of your policies to see the key and connection string information. Add your Event Hubs name to the entity path at the end of the connection string, for example `;EntityPath=my-event-hubs`. This name is your event hub name, not your namespace name.

Use a unique name for your endpoint `name`. Leave the `id` parameter as an empty string. Azure will provide an `id` when you deploy this endpoint.

```json
"routing": {
   "endpoints": {
      "serviceBusQueues": [],
      "serviceBusTopics": [],
      "eventHubs": [
            {
               "connectionString": "my Event Hubs connection string + entity path",
               "authenticationType": "keyBased",
               "name": "my-event-hubs-endpoint",
               "id": "",
               "subscriptionId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
               "resourceGroup": "my-resource-group"
            }
      ],
      "storageContainers": [],
      "cosmosDBSqlCollections": []
   },
```

# [Service Bus queue](#tab/servicebusqueue)

If you need to create a Service Bus queue resource (a namespace and queue), see [Quickstart: Create a Service Bus namespace and a queue using an ARM template](../service-bus-messaging/service-bus-resource-manager-namespace-queue.md). 

Grab your primary connection string from your Service Bus resource in the [Azure portal](https://portal.azure.com/#home) from its **Shared access policies** page. Select one of your policies to see the key and connection string information. Add your Service Bus queue name to the entity path at the end of the connection string, for example `;EntityPath=my-service-bus-queue`. This name is your queue name, not your namespace name.

Use a unique name for your endpoint `name`. Leave the `id` parameter as an empty string. Azure will provide an `id` when you deploy this endpoint.

```json
"routing": {
   "endpoints": {
      "serviceBusQueues": [
            {
               "connectionString": "my Service Bus connection string + entity path",
               "authenticationType": "keyBased",
               "name": "my-service-bus-queue-endpoint",
               "id": "",
               "subscriptionId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
               "resourceGroup": "my-resource-group"
            }
      ],
      "serviceBusTopics": [],
      "eventHubs": [],
      "storageContainers": [],
      "cosmosDBSqlCollections": []
   },
```

# [Service Bus topic](#tab/servicebustopic)

If you need to create a Service Bus topic resource (a namespace, topic, and subscription), see [Quickstart: Create a Service Bus namespace and a queue using an ARM template](../service-bus-messaging/service-bus-resource-manager-namespace-topic.md). 

Grab your primary connection string from your Service Bus resource in the [Azure portal](https://portal.azure.com/#home) from its **Shared access policies** page. Select one of your policies to see the key and connection string information. Add your Service Bus topic name to the entity path at the end of the connection string, for example `;EntityPath=my-service-bus-topic`. This name is your topic name, not your namespace name.

Use a unique name for your endpoint `name`. Leave the `id` parameter as an empty string. Azure will provide an `id` when you deploy this endpoint.

```json
"routing": {
   "endpoints": {
      "serviceBusQueues": [],
      "serviceBusTopics": [
         {
            "connectionString": "my Service Bus connection string + entity path",
            "authenticationType": "keyBased",
            "name": "my-service-bus-topic-endpoint",
            "id": "",
            "subscriptionId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
            "resourceGroup": "my-resource-group"
         }
      ],
      "eventHubs": [],
      "storageContainers": [],
      "cosmosDBSqlCollections": []
   },
```

# [Azure Storage](#tab/azurestorage)

If you need to create an Azure Storage resource (a namespace, topic, and subscription), see [Create a storage account](/azure/storage/common/storage-account-create?tabs=template). 

Grab your primary connection string from your Azure Storage resource in the [Azure portal](https://portal.azure.com/#home) from its **Access keys** page.

Use a unique name for your endpoint `name`. Leave the `id` parameter as an empty string. Azure will provide an `id` when you deploy this endpoint.

```json
"routing": {
   "endpoints": {
      "serviceBusQueues": [],
      "serviceBusTopics": [],
      "eventHubs": [],
      "storageContainers": [
         {
            "connectionString": "my Azure storage connection string",
            "containerName": "my-container",
            "fileNameFormat": "{iothub}/{partition}/{YYYY}/{MM}/{DD}/{HH}/{mm}.avro",
            "batchFrequencyInSeconds": 100,
            "maxChunkSizeInBytes": 104857600,
            "encoding": "avro",
            "authenticationType": "keyBased",
            "name": "my-storage-endpoint",
            "id": "",
            "subscriptionId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
            "resourceGroup": "my-resource-group"
         }
      ],
      "cosmosDBSqlCollections": []
   },
```
---

### Add a new route to your Resource Manager template

In the JSON file, find the `"routes": []` property, nested under `"routing"`, and add the following new route, according to the endpoint service (Event Hubs, Service Bus queue or topic, or Azure Storage) you choose. 
   
Our default fallback route collects messages from `DeviceMessages`, let's choose another option such as `DeviceConnectionStateEvents`. For more information on source options, see [az iot hub route](/cli/azure/iot/hub/route#az-iot-hub-route-create-required-parameters).

> [!CAUTION]
> If you replace your existing `"routes"` with the following route, the old ones will be removed upon deployment. To preserve existing routes, *add* the route object to the `"routes"` list.

For more information about the template, see [ARM template resource definition](/azure/templates/microsoft.devices/iothubs?pivots=deployment-language-arm-template#routeproperties-1).

# [Event Hubs](#tab/eventhubs)

```json
"routes": [
    {
        "name": "MyIotHubRoute",
        "source": "DeviceConnectionStateEvents",
        "condition": "true",
        "endpointNames": [
        "my-event-hubs-endpoint"
        ],
        "isEnabled": true
    }
],
```

Save your JSON file.

# [Service Bus queue](#tab/servicebusqueue)

```json
"routes": [
    {
        "name": "MyIotHubRoute",
        "source": "DeviceConnectionStateEvents",
        "condition": "true",
        "endpointNames": [
        "my-service-bus-queue-endpoint"
        ],
        "isEnabled": true
    }
],
```

Save your JSON file.

# [Service Bus topic](#tab/servicebustopic)

```json
"routes": [
    {
        "name": "MyIotHubRoute",
        "source": "DeviceConnectionStateEvents",
        "condition": "true",
        "endpointNames": [
        "my-service-bus-topic-endpoint"
        ],
        "isEnabled": true
    }
],
```

Save your JSON file.

# [Azure Storage](#tab/azurestorage)

```json
"routes": [
    {
        "name": "MyIotHubRoute",
        "source": "DeviceConnectionStateEvents",
        "condition": "true",
        "endpointNames": [
        "my-storage-endpoint"
        ],
        "isEnabled": true
    }
],
```

Save your JSON file.

---

## Deploy the Resource Manager template

With your new endpoint and route added to the Resource Manager template, you can now deploy the JSON file back to your IoT hub. 

### Local deployment

# [Azure CLI](#tab/cli)

```azurecli
az deployment group create \
  --name my-iot-hub-template \
  --resource-group my-resource-group \
  --template-file "my\path\to\template.json"

```

# [PowerShell](#tab/powershell)

```powershell
New-AzResourceGroupDeployment `
  -Name MyTemplate `
  -ResourceGroupName MyResourceGroup `
  -TemplateFile "my\path\to\template.json"
```
---

### Azure Cloud Shell deployment

Since [Azure Cloud Shell](https://portal.azure.com/#cloudshell/) is run from a browser, you can [upload](/azure/cloud-shell/using-the-shell-window#upload-and-download-files) the template file before running the deployment command. With the file uploaded, you only need the template file name (instead of the entire filepath) for the `template-file` parameter.

:::image type="content" source="media/how-to-routing-arm/upload-cloud-shell.jpg" alt-text="Screenshot that shows location of the button in the Azure Cloud Shell that uploads a file.":::

# [Azure CLI](#tab/cli)

```azurecli
az deployment group create \
  --name my-iot-hub-template \
  --resource-group my-resource-group \
  --template-file "template.json"

```

# [PowerShell](#tab/powershell)

```powershell
New-AzResourceGroupDeployment `
  -Name MyIoTHubTemplate `
  -ResourceGroupName MyResourceGroup `
  -TemplateFile "template.json"
```
---

To view your new route in the [Azure portal](https://portal.azure.com/), go to your IoT Hub resource and look on the **Message routing** page to see your route listed under the **Routes** tab.

> [!NOTE]
> If the deployment fails, use the verbose switch to get information about the resources you're creating. Use the debug switch to get more information for debugging.

## Confirm deployment

To confirm your template deployed successfully to Azure, check in your resource group resource on the **Deployments** page of the **Settings** menu in the Azure portal.

:::image type="content" source="media/how-to-routing-arm/confirm-template-deployment.jpg" alt-text="Screenshot that shows location of a deployment log in a resource group on the Deployments page of the Azure portal.":::