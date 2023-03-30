---
title: Create and delete routes and endpoints by using Azure Resource Manager
description: Learn how to create and delete routes and endpoints in Azure IoT Hub by using an Azure Resource Manager template in the Azure portal.
author: kgremban
ms.service: iot-hub
ms.custom: devx-track-arm-template
services: iot-hub
ms.topic: how-to
ms.date: 12/15/2022
ms.author: kgremban
---

# Create and delete routes and endpoints by using Azure Resource Manager

This article shows you how to export your Azure IoT Hub template, add a route to your IoT hub, and then redeploy the template to your IoT hub by using the Azure CLI or Azure PowerShell. Use an Azure Resource Manager template to create routes and endpoints for Azure Event Hubs, Azure Service Bus queues and topics, and Azure Storage.

[Azure Resource Manager templates](../azure-resource-manager/templates/overview.md) are useful when you want to define resources by using a JSON file. Every Azure resource has a template that defines the components that are used in that resource. You can export all Azure resource templates.

> [!IMPORTANT]
> When you use a Resource Manager template to deploy a resource, the template replaces any existing resource of the type you're deploying.
>
> When you create a new IoT hub, overwriting an existing deployed resource isn't a concern. To create a new IoT hub, you can use a [basic template](../azure-resource-manager/templates/syntax.md#template-format) that has the required properties instead of exporting an existing template from an IoT hub that's already deployed.
>
> However, if you add a route to an existing IoT hub Resource Manager template, use a template that you export from your IoT hub to ensure that all existing resources and properties remain connected after you deploy the updated template. Resources that are already deployed won't be replaced. For example, an exported Resource Manager template that you previously deployed might contain storage information for your IoT hub if you've connected it to storage.

To learn more about how routing works in IoT Hub, see [Use IoT Hub message routing to send device-to-cloud messages to different endpoints](iot-hub-devguide-messages-d2c.md). To walk through the steps to set up a route that sends messages to storage and then test on a simulated device, see [Tutorial: Send device data to Azure Storage by using IoT Hub message routing](./tutorial-routing.md?tabs=portal).

## Prerequisites

The procedures that are described in the article use the following resources:

* An Azure Resource Manager template
* An IoT hub
* An endpoint service in Azure

### Azure Resource Manager template

This article uses an Azure Resource Manager template in the Azure portal to work with IoT Hub and other Azure services. To learn more about how to use Resource Manager templates, see [What are Azure Resource Manager templates?](../azure-resource-manager/templates/overview.md)

### IoT hub

To create an IoT hub route, you need an IoT hub that you created by using Azure IoT Hub. Device messages and event logs originate in your IoT hub.

Be sure to have the following hub resource to use when you create your IoT hub route:

* An IoT hub in your [Azure subscription](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). If you don't have a hub yet, you can follow the steps to [create an IoT hub by using an Azure Resource Manager template (PowerShell)](iot-hub-rm-template-powershell.md).

### Endpoint service

To create an IoT hub route, you need at least one other Azure service to use as an endpoint to the route. The endpoint receives device messages and event logs. You can choose which Azure service you use for an endpoint to connect with your IoT hub route: Event Hubs, Service Bus queues or topics, or Azure Storage.

Be sure to have *one* of the following resources to use when you create an endpoint your IoT hub route:

* An Event Hubs resource (with container). If you need to create a new Event Hubs resource, see [Quickstart: Create an event hub by using a Resource Manager template](../event-hubs/event-hubs-resource-manager-namespace-event-hub.md).

* A Service Bus queue resource. If you need to create a new Service Bus queue, see [Quickstart: Create a Service Bus namespace and a queue by using a Resource Manager template](../service-bus-messaging/service-bus-resource-manager-namespace-queue.md).

* A Service Bus topic resource. If you need to create a new Service Bus topic, see [Quickstart: Create a Service Bus namespace with topic and subscription by using a Resource Manager template](../service-bus-messaging/service-bus-resource-manager-namespace-topic.md).

* An Azure Storage resource. If you need to create a new Azure Storage, see [Create a storage account](../storage/common/storage-account-create.md?tabs=template).

## Create a route

In IoT Hub, you can create a route to send messages or capture events. Each route has a data source and an endpoint. The data source is where messages or event logs originate. The endpoint is where the messages or event logs end up. You choose locations for the data source and endpoint when you create a new route in your IoT hub. Then, you use routing queries to filter messages or events before they go to the endpoint.

You can use an event hub, a Service Bus queue or topic, or an Azure storage account to be the endpoint for your IoT hub route. The service that you use to create your endpoint must first exist in your Azure account.

### Export the Resource Manager template from your IoT hub

First, export a Resource Manager template from your IoT hub, and then add a route to it.

1. In the Azure portal, go to your IoT hub. In the resource menu under **Automation**, select **Export template**.

   :::image type="content" source="media/how-to-routing-arm/export-menu-option.png" alt-text="Screenshot that shows the location of the Export template option in the menu of an IoT Hub resource.":::

1. In **Export template**, on the **Template** tab, complete these steps:

   1. View the JSON file that's generated for your IoT hub.

   1. Clear the **Include parameters** checkbox.

   1. Select **Download** to download a local copy of the JSON file.

   :::image type="content" source="media/how-to-routing-arm/download-template.png" alt-text="Screenshot that shows the location of the Download button on the Export template pane.":::

   The template has several placeholders you can use to add features or services to your IoT hub. For this article, add values only to properties that are in or nested under `routing`.

### Add a new endpoint to your Resource Manager template

In the JSON file, find the `"endpoints": []` property that's nested under `"routing"`. Complete the steps to add a new endpoint based on the Azure service you choose for the endpoint: Event Hubs, Service Bus queues or topics, or Azure Storage.

# [Event Hubs](#tab/eventhubs)

To learn how to create an Event Hubs resource (with container), see [Quickstart: Create an event hub by using a Resource Manager template](../event-hubs/event-hubs-resource-manager-namespace-event-hub.md).

In the [Azure portal](https://portal.azure.com/#home), get your primary connection string from your Event Hubs resource. On the resource's **Shared access policies** pane, select one of your policies to see the key and connection string information. Add your event hub name to the entity path at the end of the connection string. For example, use `;EntityPath=my-event-hubs`. This name is your event hub name, not your namespace name.

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
},
```

# [Service Bus queue](#tab/servicebusqueue)

To learn how to create a Service Bus queue resource (a namespace and queue), see [Quickstart: Create a Service Bus namespace and a queue by using a Resource Manager template](../service-bus-messaging/service-bus-resource-manager-namespace-queue.md).

In the [Azure portal](https://portal.azure.com/#home), get your primary connection string from your Service Bus resource. On the resource's **Shared access policies** pane, select one of your policies to see the key and connection string information. Add your event hub name to the entity path at the end of the connection string. For example, use `;EntityPath=my-service-bus-queue`. This name is your queue name, not your namespace name.

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
},
```

# [Service Bus topic](#tab/servicebustopic)

If you need to create a Service Bus topic resource (a namespace, topic, and subscription), see [Quickstart: Create a Service Bus namespace and a topic by using a Resource Manager template](../service-bus-messaging/service-bus-resource-manager-namespace-topic.md).

In the [Azure portal](https://portal.azure.com/#home), get your primary connection string from your Service Bus resource. On the resource's **Shared access policies** pane, select one of your policies to see the key and connection string information. Add your event hub name to the entity path at the end of the connection string. For example, use `;EntityPath=my-service-bus-topic`. This name is your topic name, not your namespace name.

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
},
```

# [Azure Storage](#tab/azurestorage)

To learn how to create an Azure Storage resource (a namespace, topic, and subscription), see [Create a storage account](../storage/common/storage-account-create.md?tabs=template).

In the [Azure portal](https://portal.azure.com/#home), get your primary connection string for your Azure Storage resource on the resource's **Access keys** pane.

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
},
```

---

### Add a new route to your Resource Manager template

In the JSON file, find the `"routes": []` property, nested under `"routing"`, and add the following new route, according to the endpoint service you chose: Event Hubs, Service Bus queues or topics, or Azure Storage.
  
The default fallback route collects messages from `DeviceMessages`. Choose a different option, like `DeviceConnectionStateEvents`. For more information about source options, see [az iot hub route](/cli/azure/iot/hub/route#az-iot-hub-route-create-required-parameters).

> [!CAUTION]
> If you replace any existing values for `"routes"` with the route values that are used in the following code examples, the existing routes are removed when you deploy. To preserve existing routes, *add* the new route object to the `"routes"` list.

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

Because [Azure Cloud Shell](https://portal.azure.com/#cloudshell/) runs in a web browser, you can [upload](../cloud-shell/using-the-shell-window.md#upload-and-download-files) the template file before you run the deployment command. With the file uploaded, you need only the template file name (instead of the entire file path) to use in the `template-file` parameter.

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

> [!NOTE]
> If the deployment fails, use the `-verbose` switch to get information about the resources you're creating. Use the `-debug` switch to get more information for debugging.

## Confirm deployment

To confirm that your template deployed successfully to Azure, in the [Azure portal](https://portal.azure.com/), go to your resource group resource. In the resource menu under **Settings**, select **Deployments** to see the template in a list of your deployments.

:::image type="content" source="media/how-to-routing-arm/confirm-template-deployment.png" alt-text="Screenshot that shows a list of deployments for a resource in the Azure portal, with a test template highlighted.":::

To view your new route in the Azure portal, go to your IoT Hub resource. On the **Message routing** pane, on the **Routes** tab, confirm that your route is listed.

## Next steps

In this how-to article, you learned how to create a route and endpoint for Event Hubs, Service Bus queues and topics, and Azure Storage.

To learn more about message routing, see [Tutorial: Send device data to Azure Storage by using IoT Hub message routing](./tutorial-routing.md?tabs=portal). In the tutorial, you create a storage route and test it with a device in your IoT hub.
