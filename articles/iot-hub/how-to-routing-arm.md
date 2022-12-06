---
title: Create and delete routes and endpoints by using Azure Resource Manager
description: Learn how to create and delete routes and endpoints in Azure IoT Hub by using Azure Resource Manager.
author: kgremban
ms.service: iot-hub
services: iot-hub
ms.topic: how-to
ms.date: 11/11/2022
ms.author: kgremban
---

# Create and delete routes and endpoints by using Azure Resource Manager

This article shows you how to export your Azure IoT Hub template, add a route to your IoT hub, and then deploy the template back to your IoT hub by using the Azure CLI or Azure PowerShell. We use an Azure Resource Manager template to create routes and endpoints to Event Hubs, an Azure Service Bus queue, a Service Bus topic, and Azure Storage.

[Azure Resource Manager templates](../azure-resource-manager/templates/overview.md) are useful when you need to define resources in a JSON file. Each resource in Azure has a template to export that defines the components used in that resource.

> [!IMPORTANT]
> The Resource Manager template will replace the existing resource, if there is one, when deployed. If you're creating a new IoT hub, this is not a concern and you can use a [basic template](/azure/azure-resource-manager/templates/syntax#template-format) with the required properties instead of exporting an existing template from your IoT hub.
>
> However, adding a route to an existing IoT hub Resource Manager template, exported from your IoT hub, ensures all other resources and properties connected will remain after deployment (they won't be replaced). For example, an exported Resource Manager template might contain storage information for your IoT hub, if you've connected it to storage.

To learn more about how routing works in IoT Hub, see [Use IoT Hub message routing to send device-to-cloud messages to different endpoints](iot-hub-devguide-messages-d2c.md). To walk through setting up a route that sends messages to storage, testing on a simulated device, see [Tutorial: Send device data to Azure Storage using IoT Hub message routing](/azure/iot-hub/tutorial-routing?tabs=portal).

## Prerequisites

The procedures that are described in the article use the following prerequisites:

* Azure Resource Manager
* An IoT hub
* An endpoint service

## Azure Resource Manager

This article uses a template from Resource Manager. To understand more about Resource Manager, see [What are Azure Resource Manager templates?](../azure-resource-manager/templates/overview.md)

## An IoT hub and an endpoint service**

You need an IoT hub and at least one other service to serve as an endpoint to an IoT hub route. You can choose which Azure service (Event Hubs, Service Bus queue or topic, or Azure Storage) endpoint that you'd like to connect with your IoT Hub route.

* An IoT hub in your [Azure subscription](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). If you don't have a hub yet, you can follow the steps in [Create an IoT hub by using an Azure Resource Manager template (PowerShell)](iot-hub-rm-template-powershell.md).

* (Optional) An Event Hubs resource (with container). If you need to create a new Event Hubs resource, see [Quickstart: Create an event hub by using a Resource Manager template](../event-hubs/event-hubs-resource-manager-namespace-event-hub.md).

* (Optional) A Service Bus queue resource. If you need to create a new Service Bus queue, see [Quickstart: Create a Service Bus namespace and a queue by using a Resource Manager template](../service-bus-messaging/service-bus-resource-manager-namespace-queue.md).

* (Optional) A Service Bus topic resource. If you need to create a new Service Bus topic, see [Quickstart: Create a Service Bus namespace with topic and subscription by using a Resource Manager template](../service-bus-messaging/service-bus-resource-manager-namespace-topic.md).

* (Optional) An Azure Storage resource. If you need to create a new Azure Storage, see [Create a storage account](/azure/storage/common/storage-account-create?tabs=template).

## Create a route

In IoT Hub, you can create a route to send messages or capture events. Each route has a data source and an endpoint. The data source is where messages or events originate. The endpoint is where the messages or events end up. You choose locations for the data source and endpoint when you create a new route in your IoT hub. Then, you use routing queries to filter messages or events before they go to the endpoint.

You can use an event hub, a Service Bus queue or topic, or an Azure storage account to be the endpoint for your IoT hub route. The service that you use for your endpoint must first exist in your Azure account.

### Export the Resource Manager template from your IoT hub

First, export a Resource Manager template from your IoT hub, and then add a route to it.

1. In the Azure portal, go to your IoT hub. In the left menu under **Automation**, select **Export template**.

   :::image type="content" source="media/how-to-routing-arm/export-menu-option.png" alt-text="Screenshot that shows the location of the Export template option in the menu of an IoT Hub resource.":::

1. In **Export template**, on the **Template** tab, complete these steps:

   1. View the JSON file that's generated for your IoT hub.

   1. Clear the **Include parameters** checkbox.

   1. In the command bar, select **Download** to download a local copy of the JSON file.

   :::image type="content" source="media/how-to-routing-arm/download-template.png" alt-text="Screenshot that shows the location of the Download button on the Export template pane.":::

   The template has several placeholders you can use to add features or services to your IoT hub. For this article, add values only to properties that are in or nested under `routing`.

### Add a new endpoint to your Resource Manager template

In the JSON file, find the `"endpoints": []` property that's nested under `"routing"`. Complete the steps to add a new endpoint based on the Azure service you choose for the endpoint: Event Hubs, Service Bus queue, Service Bus topic, or Azure Storage.

The Azure service adds a value for `id`, so leave the `id` property as a blank string for now.

# [Event Hubs](#tab/eventhubs)

To learn how to create an Event Hubs resource (with container), see [Quickstart: Create an event hub by using a Resource Manager template](../event-hubs/event-hubs-resource-manager-namespace-event-hub.md).

In the [Azure portal](https://portal.azure.com/#home), get your primary connection string from your Event Hubs resource. On the resource **Shared access policies** pane, select one of your policies to see the key and connection string information. Add your event hub name to the entity path at the end of the connection string. For example, use `;EntityPath=my-event-hubs`. This name is your event hub name, not your namespace name.

For `name`, use a unique value for your Event Hubs endpoint. Leave the `id` parameter as an empty string. The Azure service provides an `id` value when you deploy the endpoint.

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

To learn how to create a Service Bus queue resource (a namespace and queue), see [Quickstart: Create a Service Bus namespace and a queue by using a Resource Manager template](../service-bus-messaging/service-bus-resource-manager-namespace-queue.md).

In the [Azure portal](https://portal.azure.com/#home), get your primary connection string from your Service Bus resource. On the resource **Shared access policies** pane, select one of your policies to see the key and connection string information. Add your event hub name to the entity path at the end of the connection string. For example, use `;EntityPath=my-service-bus-queue`. This name is your queue name, not your namespace name.

For `name`, use a unique value for your Service Bus queue endpoint. Leave the `id` parameter as an empty string. The Azure service provides an `id` value when you deploy the endpoint.

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

If you need to create a Service Bus topic resource (a namespace, topic, and subscription), see [Quickstart: Create a Service Bus namespace and a topic by using a Resource Manager template](../service-bus-messaging/service-bus-resource-manager-namespace-topic.md).

In the [Azure portal](https://portal.azure.com/#home), get your primary connection string from your Service Bus resource. On the resource **Shared access policies** pane, select one of your policies to see the key and connection string information. Add your event hub name to the entity path at the end of the connection string. For example, use `;EntityPath=my-service-bus-topic`. This name is your topic name, not your namespace name.

For `name`, enter a unique name for your endpoint. Leave the `id` parameter as an empty string. The Azure service provides an `id` value when you deploy the endpoint.

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

To learn how to create an Azure Storage resource (a namespace, topic, and subscription), see [Create a storage account](/azure/storage/common/storage-account-create?tabs=template).

In the [Azure portal](https://portal.azure.com/#home), get your primary connection string for your Azure Storage resource on the resource **Access keys** pane.

For `name`, enter a unique name for your endpoint. Leave the `id` parameter as an empty string. The Azure service provides an `id` value when you deploy the endpoint.

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
  
The default fallback route collects messages from `DeviceMessages`. Choose a different option, like `DeviceConnectionStateEvents`. For more information about source options, see [az iot hub route](/cli/azure/iot/hub/route#az-iot-hub-route-create-required-parameters).

> [!CAUTION]
> If you replace your existing value for `"routes"` with the following route, the existing routes are removed when you deploy. To preserve existing routes, *add* the route object to the `"routes"` list.

For more information about the template, see [Azure Resource Manager template resource definition](/azure/templates/microsoft.devices/iothubs?pivots=deployment-language-arm-template#routeproperties-1).

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

Because [Azure Cloud Shell](https://portal.azure.com/#cloudshell/) runs in a web browser, you can [upload](/azure/cloud-shell/using-the-shell-window#upload-and-download-files) the template file before you run the deployment command. With the file uploaded, you need only the template file name (instead of the entire file path) to use in the `template-file` parameter.

:::image type="content" source="media/how-to-routing-arm/upload-cloud-shell.png" alt-text="Screenshot that shows the location of the button in Azure Cloud Shell to upload a file.":::

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

To view your new route in the [Azure portal](https://portal.azure.com/), go to your IoT Hub resource. On the **Message routing** pane, go to the **Routes** tab and check to see your route listed.

> [!NOTE]
> If the deployment fails, use the `-verbose` switch to get information about the resources you're creating. Use the `-debug` switch to get more information for debugging.

## Confirm deployment

To confirm that your template deployed successfully to Azure, in the Azure portal, go to your resource group resource. In the left menu under **Settings**, select **Deployments** to see the template in a list of your deployments.

:::image type="content" source="media/how-to-routing-arm/confirm-template-deployment.png" alt-text="Screenshot that shows a list of deployments for a resource in the Azure portal, with a test template highlighted.":::

## Next steps

In this how-to article, you learned how to create a route and endpoint for Event Hubs, a Service Bus queue and topic, and Azure Storage.

To learn more about message routing, see [Tutorial: Send device data to Azure Storage by using IoT Hub message routing](/azure/iot-hub/tutorial-routing?tabs=portal). In the tutorial, you create a storage route and test it with a device in your IoT hub.
