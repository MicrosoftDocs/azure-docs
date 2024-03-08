---
title: Use managed Identities to capture Azure Event Hubs events
description: This article explains how to use managed identities to capture events to a destination such as Azure Blob Storage and Azure Data Lake Storage. 
ms.topic: article
ms.date: 05/23/2023
---


# Authenticate modes for capturing events to destinations in Azure Event Hubs
Azure Event Hubs allows you to select different authentication modes when capturing events to a destination such as [Azure Blob storage](https://azure.microsoft.com/services/storage/blobs/) or [Azure Data Lake Storage Gen 1 or Gen 2](https://azure.microsoft.com/services/data-lake-store/) account of your choice. The authentication mode determines how the capture agent running in Event Hubs authenticate with the capture destination. 

## SAS based authentication 
The default authentication method is to use Shared Access Signature(SAS) to access the capture destination from Event Hubs service. 

:::image type="content" source="./media/event-hubs-capture-overview/event-hubs-capture-default.png" alt-text="Image showing capturing of Event Hubs data into Azure Storage or Azure Data Lake Storage using default SAS authentication mode":::

With this approach, you can capture data to destinations resources that are in the same subscription only. 

## Use Managed Identity 
With [managed identity](../active-directory/managed-identities-azure-resources/overview.md), users can seamlessly capture data to a preferred destination by using Microsoft Entra ID based authentication and authorization. 

:::image type="content" source="./media/event-hubs-capture-overview/event-hubs-capture-msi.png" alt-text="Image showing capturing of Event Hubs data into Azure Storage or Azure Data Lake Storage using Managed Identity":::

You can use system-assigned or user-assigned managed identities with Event Hubs Capture destinations.

### Use a system-assigned managed identity to capture events
System-assigned Managed Identity is automatically created and associated with an Azure resource, which is an Event Hubs namespace in this case. 

To use system assigned identity, the capture destination must have the required role assignment enabled for the corresponding system assigned identity. 
Then you can select `System Assigned` managed identity option when enabling the capture feature in an event hub.

:::image type="content" source="./media/event-hubs-capture-overview/event-hubs-captute-system-assigned.png" alt-text="Image showing capturing of Event Hubs data into Azure Storage or Azure Data Lake Storage using System Assigned managed identity.":::

 Then capture agent would use the identity of the namespace for authentication and authorization with the capture destination. 


### Use a user-assigned managed identity to capture events
You can create a user-assigned managed identity and use it for authenticate and authorize with the capture destination of Event hubs. Once the managed identity is created, you can assign it to the Event Hubs namespace and make sure that the capture destination has the required role assignment enabled for the corresponding user assigned identity. 

Then you can select `User Assigned` managed identity option when enabling the capture feature in an event hub and assign the required user assigned identity when enabling the capture feature. 


:::image type="content" source="./media/event-hubs-capture-overview/event-hubs-capture-user-assigned.png" alt-text="Image showing capturing of Event Hubs data into Azure Storage or Azure Data Lake Storage":::
 Then capture agent would use the configured user assigned identity for authentication and authorization with the capture destination. 


### Capturing events to a capture destination in a different subscription 
The Event Hubs Capture feature also support capturing data to a capture destination in a different subscription with the use of managed identity. 

> [!IMPORTANT]
> Selecting a capture destination from a different subscription is not  supported by the Azure Portal. You need to use ARM templates for that purpose. 

For that you can use the same ARM templates given in [enabling capture with ARM template guide](./event-hubs-resource-manager-namespace-event-hub-enable-capture.md) with corresponding managed identity. 

For example, following ARM template can be used to create an event hub with capture enabled. Azure Storage or Azure Data Lake Storage Gen 2 can be used as the capture destination and user assigned identity is used as the authentication method. The resource ID of the destination can point to a resource in a different subscription. 

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
                },
               "identity": {
                 "type": "UserAssigned",
                 "userAssignedIdentities": {
                   "xxxxxxxx": {}
                  }
          						}
              }
            }
          }
        }
      ]
    }
  ]
```
