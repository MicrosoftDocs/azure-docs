---
title: Automatically index Azure Data Lake Storage Changes for DICOM Files
description: Learn how to configure the DICOM service to react to Data Lake Storage events
author: wisuga
ms.service: azure-health-data-services
ms.subservice: dicom-service
ms.topic: how-to
ms.date: 05/31/2025
ms.author: wisuga
---

# Azure Data Lake Storage Indexing

The [DICOM&reg; service](overview.md) automatically uploads DICOM files to Azure Data Lake Storage when using STOW-RS. This way, users can query their data either using DICOMweb&trade; APIs, like WADO-RS, or Azure Blob/Data Lake APIs. However, with storage indexing DICOM files will be automatically indexed by the DICOM service after uploading the data directly to the ADLS Gen 2 file system. Whether the files were uploaded using STOW-RS, an Azure Blob SDK, or even `AzCopy`, they can be accessed using either DICOMweb&trade; APIs or directly through the ADLS Gen 2 file system.

## Prerequisites

* An Azure Storage account configured with Hierarchical Namespaces (HNS) enabled
* Optionally, a DICOM Service [connected to the Azure Data Lake Storage file system](deploy-dicom-services-in-azure-data-lake.md)

## Configuring Storage Indexing

The DICOM service indexes an ADLS Gen 2 file system by reacting to Blob or Data Lake storage events. These events must be read from an Azure Storage Queue in the Azure Storage Account that contains the file system. Once in the queue, the DICOM service will asynchronously process each event and update the index accordingly.

### Create the Destination for Storage Events

First, create an [Azure Storage Queue](../../storage/queues/storage-queues-introduction.md) in the same Azure Storage Account connected to the DICOM service The DICOM service will also need access to the queue; it will need to be able to dequeue messages as well as enqueue its own messages for errors and complex tasks. So, make sure the same managed identity used by the DICOM service, either user-assigned or system-assigned, has the [**Storage Queue Data Contributor**](../../storage/queues/assign-azure-role-data-access.md) role assigned.

#### [Azure Portal](#tab/queue-portal)

#### [ARM](#tab/queue-arm)

### Publish Storage Events to the Queue

With the Storage Queue in place, events must be published from the Storage Account to an Azure Event Grid System Topic and routed to queue using an Azure Event Grid Subscription. Before creating the event subscription, be sure to grant the role **Storage Queue Data Message Sender** to the event subscription so that it is authorized to send messages. The event subscription can either use a user-assigned or system-assigned managed identity from the system topic to authenticate its operations.

By default, event subscriptions send all of the subscribed event types to their designated output. However, while the DICOM service will gracefully handle any message, it will only process ones that meet the following criteria:
- The message must be a Base64 `CloudEvent`
- The event type must be `Microsoft.Storage.BlobCreated` or `Microsoft.Storage.BlobDeleted`
- The file system must be the same one configured for the DICOM service
- The file path must be within `AHDS/<workspace-name>/dicom/<dicom-service-name>`
- The file must be a DICOM file as defined in Part 10 of the DICOM standard
- The operation must not have been performed by the DICOM service itself

Thankfully, the event subscription can be configured to filter out irrelevant data to avoid unnecessary processing and billing. Make sure to configure filter such that:
- The subject must begin with `/blobServices/default/containers/<file-system-name>/blobs/AHDS/<workspace-name>/dicom/<dicom-service-name>/`
- Optionally, the subject ends with `.dcm`
- Under advanced filters, the key `data.clientRequestId` does not begin with `tag:<workspace-name>-<dicom-service-name>.dicom.azurehealthcareapis.com,`

#### [Azure Portal](#tab/events-portal)

#### [ARM](#tab/events-arm)

1. Use the Azure CLI command [`az deployment group create`](../../azure-resource-manager/bicep/deploy-cli.md) to deploy a system topic and event subscription like below:

### Enable Storage Indexing

Once the event grid subscription has been successfully configured, it's time to let the DICOM service know from where to read the storage events.

#### [ARM](#tab/dicom-arm)

Storage indexing is available starting in the preview ARM version `2025-04-01-preview` which introduced a new property within `storageConfiguration` called `storageIndexingConfiguration.storageEventQueueName`. Deploy, or redeploy, a DICOM service using this new property with the Azure CLI command [`az deployment group create`](../../azure-resource-manager/bicep/deploy-cli.md):

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "workspaceName": {
            "type": "String"
        },
        "dicomServiceName": {
            "type": "String"
        },
        "storageAccountResourceId": {
            "type": "String"
        },
        "fileSystemName": {
            "type": "String"
        },
        "queueName": {
            "type": "String"
        }
    },
    "resources": [
        {
            "type": "Microsoft.HealthcareApis/workspaces/dicomservices",
            "apiVersion": "2024-03-31",
            "name": "[concat(parameters('workspaceName'), '/', parameters('dicomServiceName'))]",
            "location": "[resourceGroup().location]",
            "identity": {
                "type": "SystemAssigned"
            },
            "properties": {
                "storageConfiguration": {
                    "fileSystemName": "[parameters('fileSystemName')]",
                    "storageResourceId": "[parameters('storageAccountResourceId')]",
                    "storageIndexingConfiguration": {
                        "storageEventQueueName": "[parameters('queueName')]"
                    }
                }
            }
        }
    ]
}
```

## Diagnosing Issues

:::image type="content" source="media/storage-indexing/diagnostic-logs.png" alt-text="A screenshot of the Azure Portal showing a KQL query of the AHDSDicomAuditLogs table. The example query is filtering for all logs where OperationName is the string 'index-storage'. Undernearth the KQL query is a table of results." lightbox="media/storage-indexing/diagnostic-logs.png":::

If there is an error when processing an event, the problematic event will be enqueued in a "poison queue" called `<queue-name>-poison` in the same Storage Account. Details about every processed event can be found in the `AHDSDicomAuditLogs` and `AHDSDicomDiagnosticLogs` tables by filtering for all logs where `OperationName = 'index-storage'`. The audit logs will only record when the operation started and completed whereas the diagnostic table will provide details about each operation including any errors, if any. Operations may be correlated across the tables using `CorrelationId`.

Failures are divided into two types: `User` and `Server`. User errors include

## Next Steps
* [Interact with data using DICOMweb&trade;](dicomweb-standard-apis-with-dicom-services.md)