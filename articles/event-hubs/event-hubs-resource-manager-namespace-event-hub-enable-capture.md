---
title: Create an Azure Event Hubs namespace and enable Capture using a template | Microsoft Docs
description: Create an Azure Event Hubs namespace with one event hub and enable Capture using Azure Resource Manager template
services: event-hubs
documentationcenter: .net
author: ShubhaVijayasarathy
manager: timlt
editor: ''

ms.assetid: 8bdda6a2-5ff1-45e3-b696-c553768f1090
ms.service: event-hubs
ms.devlang: tbd
ms.topic: get-started-article
ms.tgt_pltfrm: dotnet
ms.workload: na
ms.date: 08/16/2018
ms.author: shvija

---

# Create a namespace with event hub and enable Capture using a template

This article shows how to use an Azure Resource Manager template that creates an [Event Hubs](event-hubs-what-is-event-hubs.md) namespace, with one event hub instance, and also enables the [Capture feature](event-hubs-capture-overview.md) on the event hub. The article describes how to define which resources are deployed, and how to define parameters that are specified when the deployment is executed. You can use this template for your own deployments, or customize it to meet your requirements.

This article also shows how to specify that events are captured into either Azure Storage Blobs or an Azure Data Lake Store, based on the destination you choose.

For more information about creating templates, see [Authoring Azure Resource Manager templates][Authoring Azure Resource Manager templates].

For more information about patterns and practices for Azure Resources naming conventions, see [Azure Resources naming conventions][Azure Resources naming conventions].

For the complete templates, click the following GitHub links:

- [Event hub and enable Capture to Storage template][Event Hub and enable Capture to Storage template] 
- [Event hub and enable Capture to Azure Data Lake Store template][Event Hub and enable Capture to Azure Data Lake Store template]

> [!NOTE]
> To check for the latest templates, visit the [Azure Quickstart Templates][Azure Quickstart Templates] gallery and search for Event Hubs.
> 
> 

## What will you deploy?

With this template, you deploy an Event Hubs namespace with an event hub, and also enable [Event Hubs Capture](event-hubs-capture-overview.md). Event Hubs Capture enables you to automatically deliver the streaming data in Event Hubs to Azure Blob storage or Azure Data Lake Store, within a specified time or size interval of your choosing. Click the following button to enable Event Hubs Capture into Azure Storage:

[![Deploy to Azure](./media/event-hubs-resource-manager-namespace-event-hub/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F201-eventhubs-create-namespace-and-enable-capture%2Fazuredeploy.json)

Click the following button to enable Event Hubs Capture into Azure Data Lake Store:

[![Deploy to Azure](./media/event-hubs-resource-manager-namespace-event-hub/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F201-eventhubs-create-namespace-and-enable-capture-for-adls%2Fazuredeploy.json)

## Parameters

With Azure Resource Manager, you define parameters for values you want to specify when the template is deployed. The template includes a section called `Parameters` that contains all the parameter values. You should define a parameter for those values that vary based on the project you are deploying or based on the environment you are deploying to. Do not define parameters for values that always stay the same. Each parameter value is used in the template to define the resources that are deployed.

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

The name format used by Event Hubs Capture to write the Avro files. Note that a Capture name format must contain `{Namespace}`, `{EventHub}`, `{PartitionId}`, `{Year}`, `{Month}`, `{Day}`, `{Hour}`, `{Minute}`, and `{Second}` fields. These can be arranged in any order, with or without delimiters.
 
```json
"captureNameFormat": {
      "type": "string",
	  "defaultValue": "{Namespace}/{EventHub}/{PartitionId}/{Year}/{Month}/{Day}/{Hour}/{Minute}/{Second}",
      "metadata": {
        "description": "A Capture Name Format must contain {Namespace}, {EventHub}, {PartitionId}, {Year}, {Month}, {Day}, {Hour}, {Minute} and {Second} fields. These can be arranged in any order with or without delimeters. E.g.  Prod_{EventHub}/{Namespace}\\{PartitionId}_{Year}_{Month}/{Day}/{Hour}/{Minute}/{Second}"
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

Use the following parameters if you choose Azure Data Lake Store as your destination. You must set permissions on your Data Lake Store path, in which you want to Capture the event. To set permissions, see [this article](event-hubs-capture-enable-through-portal.md#capture-data-to-an-azure-data-lake-store-account).

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

The destination folder path for the captured events. This is the folder in your Data Lake Store to which the events will be pushed during the capture operation. To set permissions on this folder, see [Use Azure Data Lake Store to capture data from Event Hubs](../data-lake-store/data-lake-store-archive-eventhub-capture.md).

```json
"dataLakeFolderPath": {
    "type": "string",
    "metadata": {
        "description": "Destination capture folder path"
    }
}
```

## Resources to deploy for Azure Storage as destination to captured events

Creates a namespace of type **EventHub**, with one event hub, and also enables Capture to Azure Blob Storage.

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

## Resources to deploy for Azure Data Lake Store as destination

Creates a namespace of type **EventHub**, with one event hub, and also enables Capture to Azure Data Lake Store.

```json
 "resources": [
        {
            "apiVersion": "2017-04-01",
            "name": "[parameters('namespaceName')]",
            "type": "Microsoft.EventHub/Namespaces",
            "location": "[variables('location')]",
            "sku": {
                "name": "Standard",
                "tier": "Standard"
            },
            "resources": [
                {
                    "apiVersion": "2017-04-01",
                    "name": "[parameters('eventHubName')]",
                    "type": "EventHubs",
                    "dependsOn": [
                        "[concat('Microsoft.EventHub/namespaces/', parameters('namespaceName'))]"
                    ],
                    "properties": {
                        "path": "[parameters('eventHubName')]",
                        "captureDescription": {
                            "enabled": "true",
                            "encoding": "[parameters('archiveEncodingFormat')]",
                            "intervalInSeconds": "[parameters('captureTime')]",
                            "sizeLimitInBytes": "[parameters('captureSize')]",
                            "destination": {
                                "name": "EventHubArchive.AzureDataLake",
                                "properties": {
                                    "DataLakeSubscriptionId": "[parameters('subscriptionId')]",
                                    "DataLakeAccountName": "[parameters('dataLakeAccountName')]",
                                    "DataLakeFolderPath": "[parameters('dataLakeFolderPath')]",
                                    "ArchiveNameFormat": "[parameters('captureNameFormat')]"
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

Deploy your template to enable Event Hubs Capture into Azure Storage:
 
```powershell
New-AzureRmResourceGroupDeployment -ResourceGroupName \<resource-group-name\> -TemplateFile https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/201-eventhubs-create-namespace-and-enable-capture/azuredeploy.json
```

Deploy your template to enable Event Hubs Capture into Azure Data Lake Store:

```powershell
New-AzureRmResourceGroupDeployment -ResourceGroupName \<resource-group-name\> -TemplateFile https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/201-eventhubs-create-namespace-and-enable-capture-for-adls/azuredeploy.json
```

## Azure CLI

Azure Blob Storage as destination:

```azurecli
azure config mode arm

azure group deployment create \<my-resource-group\> \<my-deployment-name\> --template-uri [https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/201-eventhubs-create-namespace-and-enable-capture/azuredeploy.json][]
```

Azure Data Lake Store as destination:

```azurecli
azure config mode arm

azure group deployment create \<my-resource-group\> \<my-deployment-name\> --template-uri [https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/201-eventhubs-create-namespace-and-enable-capture-for-adls/azuredeploy.json][]
```

## Next steps

You can also configure Event Hubs Capture via the [Azure portal](https://portal.azure.com). For more information, see [Enable Event Hubs Capture using the Azure portal](event-hubs-capture-enable-through-portal.md).

You can learn more about Event Hubs by visiting the following links:

* [Event Hubs overview](event-hubs-what-is-event-hubs.md)
* [Create an event hub](event-hubs-create.md)
* [Event Hubs FAQ](event-hubs-faq.md)

[Authoring Azure Resource Manager templates]: ../azure-resource-manager/resource-group-authoring-templates.md
[Azure Quickstart Templates]:  https://azure.microsoft.com/documentation/templates/?term=event+hubs
[Azure Resources naming conventions]: https://azure.microsoft.com/documentation/articles/guidance-naming-conventions/
[Event hub and enable Capture to Storage template]: https://github.com/Azure/azure-quickstart-templates/tree/master/201-eventhubs-create-namespace-and-enable-capture
[Event hub and enable Capture to Azure Data Lake Store template]: https://github.com/Azure/azure-quickstart-templates/tree/master/201-eventhubs-create-namespace-and-enable-capture-for-adls