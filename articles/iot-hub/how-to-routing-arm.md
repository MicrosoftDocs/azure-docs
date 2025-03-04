---
title: Create and delete routes and endpoints by using Azure Resource Manager
description: Learn how to create and delete routes and endpoints in Azure IoT Hub by using an Azure Resource Manager template in the Azure portal.
author: kgremban
ms.service: azure-iot-hub
ms.custom: devx-track-arm-template
services: iot-hub
ms.topic: how-to
ms.date: 12/05/2024
ms.author: kgremban
---

# Create and delete routes and endpoints by using Azure Resource Manager

This article shows you how to export your Azure IoT Hub template, add a route to your IoT hub, and then redeploy the template to your IoT hub by using the Azure CLI or Azure PowerShell. Use an Azure Resource Manager template to create routes and endpoints. IoT Hub supports the following Azure services as endpoints:

  * Storage containers
  * Event Hubs
  * Service Bus queues
  * Service Bus topics
  * Cosmos DB

[Azure Resource Manager templates](../azure-resource-manager/templates/overview.md) are useful when you want to define resources by using a JSON file. Every Azure resource has a template that defines the components that are used in that resource. You can export all Azure resource templates.

> [!IMPORTANT]
> When you use a Resource Manager template to deploy a resource, the template replaces any existing resource of the type you're deploying.
>
> When you create a new IoT hub, overwriting an existing deployed resource isn't a concern. To create a new IoT hub, you can use a [basic template](../azure-resource-manager/templates/syntax.md#template-format) that has the required properties instead of exporting an existing template from an IoT hub that's already deployed.
>
> However, if you add a route to an existing IoT hub, use a template that you export from your IoT hub to ensure that all existing resources and properties remain connected after you deploy the updated template. Resources that are already deployed won't be replaced. For example, an exported Resource Manager template that you previously deployed might contain storage information for your IoT hub if you've connected it to storage.

To learn more about how routing works in IoT Hub, see [Use IoT Hub message routing to send device-to-cloud messages to different endpoints](iot-hub-devguide-messages-d2c.md). To walk through the steps to set up a route that sends messages to storage and then test on a simulated device, see [Tutorial: Send device data to Azure Storage by using IoT Hub message routing](./tutorial-routing.md?tabs=portal).

## Prerequisites

Review the prerequisites for this article based on the type of endpoint you want to route the messages to.

### [Event Hubs](#tab/eventhubs)

* An Azure subscription. If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

* An IoT hub. If you don't have a hub, you can follow the steps to [create an IoT hub](create-hub.md).

* An Event Hubs resource (with container). If you need to create a new Event Hubs resource, see [Quickstart: Create an event hub by using a Resource Manager template](../event-hubs/event-hubs-resource-manager-namespace-event-hub.md).

* (Recommended) A managed identity with role-based access control permissions for the Event Hubs namespace. For more information, see [Authenticate a managed identity with Microsoft Entra ID to access Event Hubs resources](../event-hubs/authenticate-managed-identity.md).

### [Service Bus queue](#tab/servicebusqueue)

* An Azure subscription. If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

* An IoT hub. If you don't have a hub, you can follow the steps to [create an IoT hub](create-hub.md).

* A Service Bus queue resource. If you need to create a new Service Bus queue, see [Quickstart: Create a Service Bus namespace and a queue by using a Resource Manager template](../service-bus-messaging/service-bus-resource-manager-namespace-queue.md).

* (Recommended) A managed identity with role-based access control permissions for the Service Bus namespace or queue. For more information, see [Authenticate a managed identity with Microsoft Entra ID to access Azure Service Bus resources](../service-bus-messaging/service-bus-managed-service-identity.md)

### [Service Bus topic](#tab/servicebustopic)

* An Azure subscription. If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

* An IoT hub. If you don't have a hub, you can follow the steps to [create an IoT hub](create-hub.md).

* A Service Bus topic resource. If you need to create a new Service Bus topic, see [Quickstart: Create a Service Bus namespace with topic and subscription by using a Resource Manager template](../service-bus-messaging/service-bus-resource-manager-namespace-topic.md).

* (Recommended) A managed identity with role-based access control permissions for the Service Bus namespace or topic. For more information, see [Authenticate a managed identity with Microsoft Entra ID to access Azure Service Bus resources](../service-bus-messaging/service-bus-managed-service-identity.md)

### [Azure Storage](#tab/azurestorage)

* An Azure subscription. If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

* An IoT hub. If you don't have a hub, you can follow the steps to [create an IoT hub](create-hub.md).

* An Azure Storage resource. If you need to create a new Azure Storage account, see [Create a storage account](../storage/common/storage-account-create.md?tabs=template).

* (Recommended) A managed identity with role-based access control permissions for the Storage account. For more information, see [Assign an Azure role for access to blob data](../storage/blobs/assign-azure-role-data-access.md).

### [Cosmos DB](#tab/cosmosdb)

* An Azure subscription. If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

* An IoT hub. If you don't have a hub, you can follow the steps to [create an IoT hub](create-hub.md).

* An Azure Cosmos DB resource. If you need to create a new Cosmos DB database and container, see [Quickstart: Create an Azure Cosmos DB and a container](/azure/cosmos-db/nosql/quickstart-template-json).

* (Recommended) A managed identity with role-based access control permissions for the Cosmos DB account. For more information, see [Use data plane role-based access control with Azure Cosmos DB for NoSQL](/azure/cosmos-db/nosql/security/how-to-grant-data-plane-role-based-access).

---

### Azure Resource Manager template

This article uses an Azure Resource Manager template in the Azure portal to work with IoT Hub and other Azure services. To learn more about how to use Resource Manager templates, see [What are Azure Resource Manager templates?](../azure-resource-manager/templates/overview.md)

## Create a route

In IoT Hub, you can create a route to send messages or capture events. Each route has a data source and an endpoint. The data source is where messages or event logs originate. The endpoint is where the messages or event logs end up. You choose locations for the data source and endpoint when you create a new route in your IoT hub. Then, you use routing queries to filter messages or events before they go to the endpoint.

You can use an event hub, a Service Bus queue or topic, or an Azure storage account to be the endpoint for your IoT hub route. The service that you use to create your endpoint must first exist in your Azure account.

## Export your IoT hub's Resource Manager template

First, export a Resource Manager template from your IoT hub. By exporting the template from your IoT hub, you can add endpoint and route resources and redeploy without losing existing setting.

1. In the Azure portal, go to your IoT hub. In the resource menu under **Automation**, select **Export template**.

   :::image type="content" source="media/how-to-routing-arm/export-menu-option.png" alt-text="Screenshot that shows the location of the Export template option in the menu of an IoT Hub resource.":::

1. In **Export template**, on the **Template** tab, complete these steps:

   1. View the JSON file that's generated for your IoT hub.

   1. Clear the **Include parameters** checkbox.

   1. Select **Download** to download a local copy of the JSON file.

   :::image type="content" source="media/how-to-routing-arm/download-template.png" alt-text="Screenshot that shows the location of the Download button on the Export template pane.":::

   The template has several placeholders you can use to add features or services to your IoT hub. For this article, add values only to properties that are in or nested under `routing`.

## Add an endpoint to the template

Each route points to an endpoint, which is where the messages or event logs end up. Create an endpoint in your IoT hub that the route can refer to. You can use an event hub, a Service Bus queue or topic, an Azure storage account, or a Cosmos DB container to be the endpoint for your IoT hub route. The service that you use to create your endpoint must first exist in your Azure account.

Your IoT hub needs access permissions for any endpoint resource that it sends messages or logs to. You can provide access by using managed identities and Microsoft Entra ID or by using connection strings. Microsoft recommends authenticating with Entra ID as the more secure option.

### [Event Hubs](#tab/eventhubs)

Add an Event Hubs endpoint to your Resource Manager template. For more information, see [Azure Resource Manager template RoutingEventHubProperties](/azure/templates/microsoft.devices/iothubs?pivots=deployment-language-arm-template#routingeventhubproperties-1).

1. In the JSON file, find the `"endpoints": []` property that's nested under `"routing"`.

1. Replace the `"endpoints": []` line with the following JSON:

   ```json
   "endpoints": {
       "serviceBusQueues": [],
       "serviceBusTopics": [],
       "eventHubs": [
           {
               "endpointUri": "",
               "entityPath": "",
               "authenticationType": "identityBased",
               "identity": {
                   "userAssignedIdentity": ""
               },
               "name": "",
               "id": "",
               "subscriptionId": "",
               "resourceGroup": ""
           }
       ],
       "storageContainers": [],
       "cosmosDBSqlContainers": []
   },
   ```

1. Update the JSON with the following information about your Event Hubs resource:

   | Property | Value |
   | -------- | ----- |
   | endpointUri | (If authentication type is `identityBased`; otherwise, delete.) The host name of your Event Hubs namespace in the format `sb://<eventhubs_namespace_name>.servicebus.windows.net` |
   | entityPath | (If authentication type is `identityBased`; otherwise, delete.) The name of your event hub. |
   | authenticationType | `identityBased` or `keyBased`. Microsoft recommends identity based authentication as the more secure option. |
   | identity | (If authentication type is `identityBased`.) You can use a user-assigned managed identity or a system-assigned managed identity if your IoT Hub has system-assigned managed identity enabled.<br><br>**For user-assigned**: The external ID of the managed identity with access permissions to your event hub in the format `/subscriptions/<subscription_id>/resourceGroups/<resource_group_name>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<identity_name>`.<br><br>**For system-assigned**: Leave the identity parameter as an empty list. For example, `"identity": {},` |
   | connectionString | (If authentication type is `keyBased`.) The primary connection string from one of your event hub's shared access policies in the format `<connection_string>;EntityPath=<event_hub_name>.` You can retrieve the connection string value from the Azure portal, then append the entity path. |
   | name | Provide a unique value to name your endpoint. |
   | id | Leave as an empty string. The Azure service provides a value when you create the endpoint. |
   | subscriptionId | The ID of the subscription that contains your event hub. |
   | resourceGroup | The name of the resource group that contains your event hub. |

   >[!TIP]
   >For secrets management, you can [Create a parameter file](../azure-resource-manager/templates/parameter-files.md) or [Use Azure Key Vault to pass secure parameter values during deployment](../azure-resource-manager/templates/key-vault-parameter.md).

### [Service Bus queue](#tab/servicebusqueue)

Add a Service Bus queue endpoint to your Resource Manager template. For more information, see [Azure Resource Manager template RoutingServiceBusQueueEndpointProperties](/azure/templates/microsoft.devices/iothubs?pivots=deployment-language-arm-template#routingservicebusqueueendpointproperties-1).


1. In the JSON file, find the `"endpoints": []` property that's nested under `"routing"`.

1. Replace the `"endpoints": []` line with the following JSON:

   ```json
   "endpoints": {
       "serviceBusQueues": [
           {
               "endpointUri": "",
               "entityPath": "",
               "authenticationType": "identityBased",
               "identity": {
                   "userAssignedIdentity": ""
               },
               "name": "",
               "id": "",
               "subscriptionId": "",
               "resourceGroup": ""
           }
       ],
       "serviceBusTopics": [],
       "eventHubs": [],
       "storageContainers": [],
       "cosmosDBSqlContainers": []
   },
   ```

1. Update the JSON with the following information about your Service Bus resource:

   | Property | Value |
   | -------- | ----- |
   | endpointUri | (If authentication type is `identityBased`; otherwise, delete.) The host name of your Service Bus namespace in the format `sb://<service_bus_namespace_name>.servicebus.windows.net` |
   | entityPath | (If authentication type is `identityBased`; otherwise, delete.) The name of your Service Bus queue. |
   | authenticationType | `identityBased` or `keyBased`. Microsoft recommends identity based authentication as the more secure option. |
   | identity | (If authentication type is `identityBased`.) You can use a user-assigned managed identity or a system-assigned managed identity if your IoT Hub has system-assigned managed identity enabled.<br><br>**For user-assigned**: The external ID of the managed identity with access permissions to your Service Bus in the format `/subscriptions/<subscription_id>/resourceGroups/<resource_group_name>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<identity_name>`.<br><br>**For system-assigned**: Leave the identity parameter as an empty list. For example, `"identity": {},` |
   | connectionString | (If authentication type is `keyBased`.) The primary connection string from one of your Service Bus's shared access policies in the format `<connection_string>;EntityPath=<service_bus_queue_name>.` You can retrieve the connection string value from the Azure portal, then append the entity path. |
   | name | Provide a unique value to name your endpoint. |
   | id | Leave as an empty string. The Azure service provides a value when you create the endpoint. |
   | subscriptionId | The ID of the subscription that contains your Service Bus. |
   | resourceGroup | The name of the resource group that contains your Service Bus. |

   >[!TIP]
   >For secret management, you can [Create a parameter file](../azure-resource-manager/templates/parameter-files.md) or [Use Azure Key Vault to pass secure parameter values during deployment](../azure-resource-manager/templates/key-vault-parameter.md).

### [Service Bus topic](#tab/servicebustopic)

Add a Service Bus topic endpoint to your Resource Manager template. For more information, see [Azure Resource Manager template RoutingServiceBusTopicEndpointProperties](/azure/templates/microsoft.devices/iothubs?pivots=deployment-language-arm-template#routingservicebustopicendpointproperties-1).

1. In the JSON file, find the `"endpoints": []` property that's nested under `"routing"`.

1. Replace the `"endpoints": []` line with the following JSON:

   ```json
   "endpoints": {
       "serviceBusQueues": []],
       "serviceBusTopics": [
           {
               "endpointUri": "",
               "entityPath": "",
               "authenticationType": "identityBased",
               "identity": {
                   "userAssignedIdentity": ""
               },
               "name": "",
               "id": "",
               "subscriptionId": "",
               "resourceGroup": ""
           }
       ],
       "eventHubs": [],
       "storageContainers": [],
       "cosmosDBSqlContainers": []
   },
   ```

1. Update the JSON with the following information about your Service Bus resource:

   | Property | Value |
   | -------- | ----- |
   | endpointUri | (If authentication type is `identityBased`; otherwise, delete.) The host name of your Service Bus namespace in the format `sb://<service_bus_namespace_name>.servicebus.windows.net` |
   | entityPath | (If authentication type is `identityBased`; otherwise, delete.) The name of your Service Bus topic. |
   | authenticationType | `identityBased` or `keyBased`. Microsoft recommends identity based authentication as the more secure option. |
   | identity | (If authentication type is `identityBased`.) You can use a user-assigned managed identity or a system-assigned managed identity if your IoT Hub has system-assigned managed identity enabled.<br><br>**For user-assigned**: The external ID of the managed identity with access permissions to your Service Bus in the format `/subscriptions/<subscription_id>/resourceGroups/<resource_group_name>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<identity_name>`.<br><br>**For system-assigned**: Leave the identity parameter as an empty list. For example, `"identity": {},` |
   | connectionString | (If authentication type is `keyBased`.) The primary connection string from one of your Service Bus's shared access policies in the format `<connection_string>;EntityPath=<service_bus_topic_name>.` You can retrieve the connection string value from the Azure portal, then append the entity path. |
   | name | Provide a unique value to name your endpoint. |
   | id | Leave as an empty string. The Azure service provides a value when you create the endpoint. |
   | subscriptionId | The ID of the subscription that contains your Service Bus. |
   | resourceGroup | The name of the resource group that contains your Service Bus. |

   >[!TIP]
   >For secret management, you can [Create a parameter file](../azure-resource-manager/templates/parameter-files.md) or [Use Azure Key Vault to pass secure parameter values during deployment](../azure-resource-manager/templates/key-vault-parameter.md).

### [Azure Storage](#tab/azurestorage)

Add a Storage container endpoint to your Resource Manager template. For more information, see [Azure Resource Manager template RoutingStorageContainerProperties](/azure/templates/microsoft.devices/iothubs?pivots=deployment-language-arm-template#routingstoragecontainerproperties-1).

1. In the JSON file, find the `"endpoints": []` property that's nested under `"routing"`.

1. Replace the `"endpoints": []` line with the following JSON:

   ```json
   "routing": {
       "endpoints": {
           "serviceBusQueues": [],
           "serviceBusTopics": [],
           "eventHubs": [],
           "storageContainers": [
               {
                   "containerName": "",
                   "fileNameFormat": "{iothub}/{partition}/{YYYY}/{MM}/{DD}/{HH}/{mm}.avro",
                   "batchFrequencyInSeconds": 100,
                   "maxChunkSizeInBytes": 104857600,
                   "encoding": "Avro",
                   "endpointUri": "",
                   "authenticationType": "identityBased",
                   "identity": {
                       "userAssignedIdentity": ""
                   },
                   "name": "",
                   "id": "",
                   "subscriptionId": "",
                   "resourceGroup": ""
               }
           ],
           "cosmosDBSqlCollections": []
       },
   },
   ```

1. Update the JSON with the following information about your Storage resource:

   | Property | Value |
   | -------- | ----- |
   | containerName | The name of an existing container in your Storage account where the data will be written. |
   | fileNameFormat | How filenames are written in the container. You can rearrange the default format, but must keep all the elements. The default file type is `.avro`. Change the file type to `.json` if you select JSON encoding. |
   | batchFrequencyInSeconds |  |
   | maxChunkSizeInBytes |  |
   | encoding | `Avro` or `JSON` |
   | endpointUri | (If authentication type is `identityBased`; otherwise, delete.) The host name of your Storage account in the format `https://<storage_account_name>.blob.core.windows.net/` |
   | authenticationType | `identityBased` or `keyBased`. Microsoft recommends identity based authentication as the more secure option. |
   | identity | (If authentication type is `identityBased`.) You can use a user-assigned managed identity or a system-assigned managed identity if your IoT Hub has system-assigned managed identity enabled.<br><br>**For user-assigned**: The external ID of the managed identity with access permissions to your Service Bus in the format `/subscriptions/<subscription_id>/resourceGroups/<resource_group_name>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<identity_name>`.<br><br>**For system-assigned**: Leave the identity parameter as an empty list. For example, `"identity": {},` |
   | connectionString | (If authentication type is `keyBased`.) The primary connection string from one of your Storage account's shared access policies. You can retrieve the connection string value from the Azure portal. |
   | name | Provide a unique value to name your endpoint. |
   | id | Leave as an empty string. The Azure service provides a value when you create the endpoint. |
   | subscriptionId | The ID of the subscription that contains your Service Bus. |
   | resourceGroup | The name of the resource group that contains your Service Bus. |

   >[!TIP]
   >For secret management, you can [Create a parameter file](../azure-resource-manager/templates/parameter-files.md) or [Use Azure Key Vault to pass secure parameter values during deployment](../azure-resource-manager/templates/key-vault-parameter.md).

### [Cosmos DB](#tab/cosmosdb)

Add a Cosmos DB container endpoint to your Resource Manager template. For more information, see [Azure Resource Manager template RoutingCosmosDBSqlApiProperties](/azure/templates/microsoft.devices/iothubs?pivots=deployment-language-arm-template#routingcosmosdbsqlapiproperties-1).

1. In the JSON file, find the `"endpoints": []` property that's nested under `"routing"`.

1. Replace the `"endpoints": []` line with the following JSON:

   ```json
   "routing": {
       "endpoints": {
           "serviceBusQueues": [],
           "serviceBusTopics": [],
           "eventHubs": [],
           "storageContainers": [],
           "cosmosDBSqlCollections": [
               {
                   "endpointUri": "",
                   "databaseName": "",
                   "containerName": "",
                   "authenticationType": "identityBased",
                   "identity": {
                       "userAssignedIdentity": ""
                   },
                   "partitionKeyName": "partitionKey",
                   "partitionKeyTemplate": "{deviceid}-{YYYY}-{MM}",
                   "name": "",
                   "subscriptionId": "",
                   "resourceGroup": ""
               }
           ]
       },
   },
   ```

1. Update the JSON with the following information about your Cosmos DB resource:

   | Property | Value |
   | -------- | ----- |
   | endpointUri | The host name of your Cosmos DB account in the format `https://<cosmos_db_account_name>.documents.azure.com` |
   | databaseName | The name of an existing database in your Cosmos DB account. |
   | containerName | The name of an existing container in your Cosmos DB database where the data will be written. |
   | authenticationType | `identityBased` or `keyBased`. Microsoft recommends identity based authentication as the more secure option. |
   | identity | (If authentication type is `identityBased`.) You can use a user-assigned managed identity or a system-assigned managed identity if your IoT Hub has system-assigned managed identity enabled.<br><br>**For user-assigned**: The external ID of the managed identity with access permissions to your Service Bus in the format `/subscriptions/<subscription_id>/resourceGroups/<resource_group_name>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<identity_name>`.<br><br>**For system-assigned**: Leave the identity parameter as an empty list. For example, `"identity": {},` |
   | primaryKey | (If authentication type is `keyBased`.) The primary key from your Cosmos DB account. You can retrieve the key value from the Azure portal. |
   | secondaryKey | (If authentication type is `keyBased`.) The primary connection string from your Cosmos DB account. You can retrieve the key value from the Azure portal. |
   | partitionKeyName | A name for the synthetic partition key that will be added to every Cosmos DB document. |
   | partitionKeyTemplate | The partition key template must contain at least one of the following elements: {iothub}, {deviceid}, {YYYY}, {MM}, {DD}. |
   | name | Provide a unique value to name your endpoint. |
   | subscriptionId | The ID of the subscription that contains your Service Bus. |
   | resourceGroup | The name of the resource group that contains your Service Bus. |

   >[!TIP]
   >For secret management, you can [Create a parameter file](../azure-resource-manager/templates/parameter-files.md) or [Use Azure Key Vault to pass secure parameter values during deployment](../azure-resource-manager/templates/key-vault-parameter.md).

---

### Add a route to the template

Add a route definition to your Resource Manager template. For more information, see [Azure Resource Manager template RouteProperties](/azure/templates/microsoft.devices/iothubs?pivots=deployment-language-arm-template#routeproperties-1).

1. In the JSON file, find the `"routes": []` property, nested under `"routing"`, and add a new route.

   > [!CAUTION]
   > If you replace any existing values for `"routes"` with the route values that are used in the following code examples, the existing routes are removed when you deploy. To preserve existing routes, *add* the new route object to the `"routes"` list.

   ```json
   "routes": [
       {
           "name": "",
           "source": "DeviceConnectionStateEvents",
           "condition": "true",
           "endpointNames": [
               ""
           ],
           "isEnabled": true
       }
   ],
   ```

1. Update the JSON with the following information about your Cosmos DB resource:

   | Property | Value |
   | -------- | ----- |
   | name | Provide a unique value to name your route. |
   | source | Select the message or event logs source to route to the endpoint. For a list of source options, see [az iot hub route](/cli/azure/iot/hub/route#az-iot-hub-route-create-required-parameters). |
   | condition | A query to filter the source data. If no condition is required, say `true`. For more information, see [IoT Hub message routing query syntax](./iot-hub-devguide-routing-query-syntax.md). |
   | endpointNames | The name of the existing endpoint where this data will be routed. Currently only one endpoint is allowed. |
   | isEnabled | Set to `true` to enable the route, or `false` to disable the route. |

1. Save your JSON file.

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
