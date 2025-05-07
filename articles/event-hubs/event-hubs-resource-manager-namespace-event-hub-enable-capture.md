---
title: Create an event hub with capture enabled - Azure Event Hubs | Microsoft Docs
description: Create an Azure Event Hubs namespace with one event hub and enable Capture using Azure Resource Manager template.
ms.topic: quickstart
ms.date: 08/26/2022
ms.custom: mode-other, devx-track-azurecli, devx-track-arm-template
ms.devlang: azurecli
---

# Create a namespace with event hub and enable Capture using a template

This article shows how to use an Azure Resource Manager template that creates an [Event Hubs](./event-hubs-about.md) namespace, with one event hub instance, and also enables the [Capture feature](event-hubs-capture-overview.md) on the event hub. The article describes how to define which resources are deployed, and how to define parameters that are specified when the deployment is executed. You can use this template for your own deployments, or customize it to meet your requirements.

This article also shows how to specify that events are captured into either Azure Storage Blobs or an Azure Data Lake Store, based on the destination you choose.

For more information about creating templates, see [Authoring Azure Resource Manager templates][Authoring Azure Resource Manager templates]. For the JSON syntax and properties to use in a template, see [Microsoft.EventHub resource types](/azure/templates/microsoft.eventhub/allversions).

For more information about patterns and practices for Azure Resources naming conventions, see [Azure Resources naming conventions][Azure Resources naming conventions].

For the complete templates, select the following GitHub links:

- [Create an event hub and enable Capture to Storage template][Event Hub and enable Capture to Storage template]
- [Create an event hub and enable Capture to Azure Data Lake Store template][Event Hub and enable Capture to Azure Data Lake Store template]

> [!NOTE]
> To check for the latest templates, visit the [Azure Quickstart Templates][Azure Quickstart Templates] gallery and search for Event Hubs.

> [!IMPORTANT]
> Azure Data Lake Storage Gen1 is retired, so don't use it for capturing event data. For more information, see the [official announcement](https://azure.microsoft.com/updates/action-required-switch-to-azure-data-lake-storage-gen2-by-29-february-2024/). If you are using Azure Data Lake Storage Gen1, migrate to Azure Data Lake Storage Gen2. For more information, see [Azure Data Lake Storage migration guidelines and patterns](../storage/blobs/data-lake-storage-migrate-gen1-to-gen2.md).

## What will you deploy?

With this template, you deploy an Event Hubs namespace with an event hub, and also enable [Event Hubs Capture](event-hubs-capture-overview.md). Event Hubs Capture enables you to automatically deliver the streaming data in Event Hubs to Azure Blob storage or Azure Data Lake Store, within a specified time or size interval of your choosing. Select the following button to enable Event Hubs Capture into Azure Storage:

[![Deploy to Azure](./media/event-hubs-resource-manager-namespace-event-hub/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.eventhub%2Feventhubs-create-namespace-and-enable-capture%2Fazuredeploy.json)

Select the following button to enable Event Hubs Capture into Azure Data Lake Store:

[![Deploy to Azure](./media/event-hubs-resource-manager-namespace-event-hub/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.eventhub%2Feventhubs-create-namespace-and-enable-capture%2Fazuredeploy.json)

## Parameters

With Azure Resource Manager, you define parameters for values you want to specify when the template is deployed. The template includes a section called `Parameters` that contains all the parameter values. You should define a parameter for those values that vary based on the project you're deploying or based on the environment you're deploying to. Don't define parameters for values that always stay the same. Each parameter value is used in the template to define the resources that are deployed.

The template defines the following parameters.

### eventHubNamespaceName

The name of the Event Hubs namespace to create.

```json
"eventHubNamespaceName":{
     "type":"string",
     "metadata":{
         "description":"Name of the EventHub namespace"
      }
}
```

### eventHubName

The name of the event hub created in the Event Hubs namespace.

```json
"eventHubName":{
    "type":"string",
    "metadata":{
        "description":"Name of the event hub"
    }
}
```

### messageRetentionInDays

The number of days to retain the messages in the event hub.

```json
"messageRetentionInDays":{
    "type":"int",
    "defaultValue": 1,
    "minValue":"1",
    "maxValue":"7",
    "metadata":{
       "description":"How long to retain the data in event hub"
     }
 }
```

### partitionCount

The number of partitions to create in the event hub.

```json
"partitionCount":{
    "type":"int",
    "defaultValue":2,
    "minValue":2,
    "maxValue":32,
    "metadata":{
        "description":"Number of partitions chosen"
    }
 }
```

### captureEnabled

Enable Capture on the event hub.

```json
"captureEnabled":{
    "type":"string",
    "defaultValue":"true",
    "allowedValues": [
    "false",
    "true"],
    "metadata":{
        "description":"Enable or disable the Capture for your event hub"
    }
 }
```
### captureEncodingFormat

The encoding format you specify to serialize the event data.

```json
"captureEncodingFormat":{
    "type":"string",
    "defaultValue":"Avro",
    "allowedValues":[
    "Avro"],
    "metadata":{
        "description":"The encoding format in which Capture serializes the EventData"
    }
}
```

### captureTime

The time interval in which Event Hubs Capture starts capturing the data.

```json
"captureTime":{
    "type":"int",
    "defaultValue":300,
    "minValue":60,
    "maxValue":900,
    "metadata":{
         "description":"The time window in seconds for the capture"
    }
}
```

### captureSize
The size interval at which Capture starts capturing the data.

```json
"captureSize":{
    "type":"int",
    "defaultValue":314572800,
    "minValue":10485760,
    "maxValue":524288000,
    "metadata":{
        "description":"The size window in bytes for capture"
    }
}
```

### captureNameFormat

The name format used by Event Hubs Capture to write the Avro files. The capture name format must contain `{Namespace}`, `{EventHub}`, `{PartitionId}`, `{Year}`, `{Month}`, `{Day}`, `{Hour}`, `{Minute}`, and `{Second}` fields. These fields can be arranged in any order, with or without delimiters.

```json
"captureNameFormat": {
      "type": "string",
      "defaultValue": "{Namespace}/{EventHub}/{PartitionId}/{Year}/{Month}/{Day}/{Hour}/{Minute}/{Second}",
      "metadata": {
        "description": "A Capture Name Format must contain {Namespace}, {EventHub}, {PartitionId}, {Year}, {Month}, {Day}, {Hour}, {Minute} and {Second} fields. These can be arranged in any order with or without delimiters. E.g.  Prod_{EventHub}/{Namespace}\\{PartitionId}_{Year}_{Month}/{Day}/{Hour}/{Minute}/{Second}"
      }
    }

```

### apiVersion

The API version of the template.

```json
 "apiVersion":{
    "type":"string",
    "defaultValue":"2017-04-01",
    "metadata":{
        "description":"ApiVersion used by the template"
    }
 }
```

Use the following parameters if you choose Azure Storage as your destination.

### destinationStorageAccountResourceId

Capture requires an Azure Storage account resource ID to enable capturing to your desired Storage account.

```json
 "destinationStorageAccountResourceId":{
    "type":"string",
    "metadata":{
        "description":"Your existing Storage account resource ID where you want the blobs be captured"
    }
 }
```

### blobContainerName

The blob container in which to capture your event data.

```json
 "blobContainerName":{
    "type":"string",
    "metadata":{
        "description":"Your existing storage container in which you want the blobs captured"
    }
}
```

### subscriptionId

Subscription ID for the Event Hubs namespace and Azure Data Lake Store. Both these resources must be under the same subscription ID.

```json
"subscriptionId": {
    "type": "string",
    "metadata": {
        "description": "Subscription ID of both Azure Data Lake Store and Event Hubs namespace"
     }
 }
```

### dataLakeAccountName

The Azure Data Lake Store name for the captured events.

```json
"dataLakeAccountName": {
    "type": "string",
    "metadata": {
        "description": "Azure Data Lake Store name"
    }
}
```

### dataLakeFolderPath

The destination folder path for the captured events. This path is the folder in your Data Lake Store to which the events are pushed during the capture operation. To set permissions on this folder, see [Use Azure Data Lake Store to capture data from Event Hubs](../data-lake-store/data-lake-store-archive-eventhub-capture.md).

```json
"dataLakeFolderPath": {
    "type": "string",
    "metadata": {
        "description": "Destination capture folder path"
    }
}
```

## Azure Storage or Azure Data Lake Storage Gen 2 as destination

Creates a namespace of type `Microsoft.EventHub/Namespaces`, with one event hub, and also enables Capture to Azure Blob Storage or Azure Data Lake Storage Gen2. 

```json
"resources":[
      {
         "apiVersion":"[variables('ehVersion')]",
         "name":"[parameters('eventHubNamespaceName')]",
         "type":"Microsoft.EventHub/Namespaces",
         "location":"[variables('location')]",
         "sku":{
            "name":"Standard",
            "tier":"Standard"
         },
         "resources": [
    {
      "apiVersion": "2017-04-01",
      "name": "[parameters('eventHubNamespaceName')]",
      "type": "Microsoft.EventHub/Namespaces",
      "location": "[resourceGroup().location]",
      "sku": {
        "name": "Standard"
      },
      "properties": {
        "isAutoInflateEnabled": "true",
        "maximumThroughputUnits": "7"
      },
      "resources": [
        {
          "apiVersion": "2017-04-01",
          "name": "[parameters('eventHubName')]",
          "type": "EventHubs",
          "dependsOn": [
            "[concat('Microsoft.EventHub/namespaces/', parameters('eventHubNamespaceName'))]"
          ],
          "properties": {
            "messageRetentionInDays": "[parameters('messageRetentionInDays')]",
            "partitionCount": "[parameters('partitionCount')]",
            "captureDescription": {
              "enabled": "true",
              "skipEmptyArchives": false,
              "encoding": "[parameters('captureEncodingFormat')]",
              "intervalInSeconds": "[parameters('captureTime')]",
              "sizeLimitInBytes": "[parameters('captureSize')]",
              "destination": {
                "name": "EventHubArchive.AzureBlockBlob",
                "properties": {
                  "storageAccountResourceId": "[parameters('destinationStorageAccountResourceId')]",
                  "blobContainer": "[parameters('blobContainerName')]",
                  "archiveNameFormat": "[parameters('captureNameFormat')]"
                }
              }
            }
          }

        }
      ]
    }
  ]
```

## Commands to run deployment

[!INCLUDE [app-service-deploy-commands](../../includes/app-service-deploy-commands.md)]

## PowerShell

[!INCLUDE [updated-for-az](~/reusable-content/ce-skilling/azure/includes/updated-for-az.md)]

Deploy your template to enable Event Hubs Capture into Azure Storage:

```powershell
New-AzResourceGroupDeployment -ResourceGroupName \<resource-group-name\> -TemplateFile https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.eventhub/eventhubs-create-namespace-and-enable-capture/azuredeploy.json
```

Deploy your template to enable Event Hubs Capture into Azure Data Lake Store:

```powershell
New-AzResourceGroupDeployment -ResourceGroupName \<resource-group-name\> -TemplateFile https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/quickstarts/microsoft.eventhub/eventhubs-create-namespace-and-enable-capture-for-adls/azuredeploy.json
```

## Azure CLI

Azure Blob Storage as destination:

```azurecli
az deployment group create \<my-resource-group\> \<my-deployment-name\> --template-uri [https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.eventhub/eventhubs-create-namespace-and-enable-capture/azuredeploy.json][]
```

Azure Data Lake Store as destination:

```azurecli
az deployment group create \<my-resource-group\> \<my-deployment-name\> --template-uri [https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/quickstarts/microsoft.eventhub/eventhubs-create-namespace-and-enable-capture-for-adls/azuredeploy.json][]
```

## Next steps

You can also configure Event Hubs Capture via the [Azure portal](https://portal.azure.com). For more information, see [Enable Event Hubs Capture using the Azure portal](event-hubs-capture-enable-through-portal.md).

You can learn more about Event Hubs by visiting the following links:

* [Event Hubs overview](./event-hubs-about.md)
* [Create an event hub](event-hubs-create.md)
* [Event Hubs FAQ](event-hubs-faq.yml)

[Authoring Azure Resource Manager templates]: ../azure-resource-manager/templates/syntax.md
[Azure Quickstart Templates]:  https://azure.microsoft.com/resources/templates/?term=event+hubs
[Azure Resources naming conventions]: /azure/cloud-adoption-framework/ready/azure-best-practices/naming-and-tagging
[Event hub and enable Capture to Storage template]: https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.eventhub/eventhubs-create-namespace-and-enable-capture
[Event hub and enable Capture to Azure Data Lake Store template]: https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.eventhub/eventhubs-create-namespace-and-enable-capture-for-adls
