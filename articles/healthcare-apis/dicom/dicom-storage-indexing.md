---
title: Automatically index Azure Data Lake Storage Changes for DICOM Files
description: Learn how to configure the DICOM service to react to Data Lake Storage events
author: wsugarman
ms.service: azure-health-data-services
ms.subservice: dicom-service
ms.topic: how-to
ms.date: 05/31/2025
ms.author: wsugarman
---

# Azure Data Lake Storage Indexing (Preview)

The [DICOM&reg; service](overview.md) automatically uploads DICOM files to Azure Data Lake Storage (ADLS) when using [STOW-RS](dicom-services-conformance-statement-v2.md#store-stow-rs). That way, users can query their data either using [DICOMweb&trade; APIs](dicomweb-standard-apis-with-dicom-services.md), like [WADO-RS](dicom-services-conformance-statement-v2.md#retrieve-wado-rs), or [Azure Blob/Data Lake APIs](../../storage/blobs/storage-blob-upload.md). However, with storage indexing, the DICOM service automatically indexes DICOM files after they're uploaded directly to the ADLS Gen 2 file system. Whether the files were uploaded using STOW-RS, an Azure Blob SDK, or even [AzCopy](../../storage/common/storage-use-azcopy-v10.md), they can be accessed using DICOMweb&trade; or ADLS Gen 2 APIs.

## Prerequisites

* An Azure Storage account configured with [Hierarchical Namespaces (HNS) enabled](../../storage/blobs/data-lake-storage-introduction.md)
* An optional DICOM Service [connected to the Azure Data Lake Storage file system](deploy-dicom-services-in-azure-data-lake.md)

## Configuring Storage Indexing

The DICOM service indexes an ADLS Gen 2 file system by reacting to [Blob or Data Lake storage events](../../event-grid/event-schema-blob-storage.md). These events must be read from an [Azure Storage Queue](../../storage/queues/storage-queues-introduction.md) in the Azure Storage Account that contains the file system. Once in the queue, the DICOM service asynchronously processes each event and update the index accordingly.

### Create the Destination for Storage Events

First, create a storage queue in the same Azure Storage Account connected to the DICOM service. The DICOM service also needs access to the queue; it needs to be able to both dequeue and enqueue messages, including messages for errors and broken-down complex tasks. So, make sure the same managed identity used by the DICOM service, either user-assigned or system-assigned, has the [**Storage Queue Data Contributor**](../../role-based-access-control/built-in-roles.md#storage) role assigned.

### Publish Storage Events to the Queue

With the Storage Queue in place, events must be published from the Storage Account to an [Azure Event Grid System Topic](../../event-grid/system-topics.md) and routed to queue using an [Azure Event Grid Subscription](../../event-grid/create-view-manage-event-subscriptions.md). Before creating the event subscription, be sure to grant the role [**Storage Queue Data Message Sender**](../../role-based-access-control/built-in-roles.md#storage) to the event subscription; the event subscription needs permissions to enqueue messages. The event subscription can either use a [user-assigned or system-assigned managed identity from the system topic](../../event-grid/enable-identity-system-topics.md) to authenticate its operations.

> [!NOTE]
> By default, event subscriptions send all of the subscribed event types to their designated output. However, while the DICOM service gracefully handles any message, it can only successfully process ones that meet the following criteria:
>- The message must be a Base64 [CloudEvent](../../event-grid/event-schema-subscriptions.md)
>- The event type must be one of the following event types:
  >- `Microsoft.Storage.BlobCreated`
  >- `Microsoft.Storage.BlobDeleted`
>- The file system must be the same one configured for the DICOM service
>- The file path must be within `AHDS/{workspace-name}/dicom/{dicom-service-name}[/{partition-name}]`
>- The file must be a DICOM file as defined in Part 10 of the DICOM standard
>- The operation can't be performed the DICOM service itself

The event subscription can be configured to filter out irrelevant data to avoid unnecessary processing and billing. Make sure to configure filter such that:
- The *subject* must begin with `/blobServices/default/containers/{file-system-name}/blobs/AHDS/{workspace-name}/dicom/{dicom-service-name}/`
- Optionally, the *subject* ends with `.dcm`
- Under *advanced filters*, the key `data.clientRequestId` doesn't begin with `tag:{workspace-name}-{dicom-service-name}.dicom.azurehealthcareapis.com,`

### Enable Storage Indexing

Once the Event Grid subscription is configured, the DICOM service must know from where to read the storage events. While in preview, storage indexing may only be configured using an [Azure Resource Manager (ARM) template](../../azure-resource-manager/templates/overview.md) using version `2025-04-01-preview` which introduced a new property called `storageConfiguration.storageIndexingConfiguration.storageEventQueueName`. It's currently unavailable to configure via the Azure portal.

The following example ARM template may be deployed using the [Azure CLI](../../azure-resource-manager/templates/deploy-cli.md). It includes all of the necessary resources for a DICOM service:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "workspaceName": {
      "type": "String"
    },
    "dicomServiceName": {
      "type": "String"
    },
    "enableDataPartitions": {
      "defaultValue": false,
      "type": "bool"
    },
    "storageAccountName": {
      "type": "String"
    },
    "storageAccountSku": {
      "defaultValue": "Standard_LRS",
      "type": "String"
    },
    "fileSystemName": {
      "type": "String"
    },
    "storageEventQueueName": {
      "defaultValue": "storage-events",
      "type": "String"
    },
    "systemTopicName": {
      "type": "String"
    },
    "eventSubscriptionName": {
      "defaultValue": "dicom-storage-events",
      "type": "String"
    }
  },
  "variables": {
    "storageBlobDataContributor": "[subscriptionResourceId('Microsoft.Authorization/roleDefinitions', 'ba92f5b4-2d11-453d-a403-e96b0029c9fe')]",
    "storageQueueDataContributor": "[subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '974c5e8b-45b9-4653-ba55-5f855dd0fb88')]",
    "storageQueueDataMessageSender": "[subscriptionResourceId('Microsoft.Authorization/roleDefinitions', 'c6a89b2d-59bc-44d0-9896-0f6e12d7b80a')]",
    "dicomIdentityName": "[concat(parameters('storageAccountName'), '-', parameters('storageEventQueueName'))]"
  },
  "resources": [
    {
      "type": "Microsoft.ManagedIdentity/userAssignedIdentities",
      "apiVersion": "2023-01-31",
      "name": "[variables('dicomIdentityName')]",
      "location": "[resourceGroup().location]"
    },
    {
      "type": "Microsoft.ManagedIdentity/userAssignedIdentities",
      "apiVersion": "2023-01-31",
      "name": "[parameters('systemTopicName')]",
      "location": "[resourceGroup().location]"
    },
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2022-05-01",
      "name": "[parameters('storageAccountName')]",
      "location": "[resourceGroup().location]",
      "sku": {
        "name": "[parameters('storageAccountSku')]"
      },
      "kind": "StorageV2",
      "properties": {
        "isHnsEnabled": true,
        "accessTier": "Hot",
        "supportsHttpsTrafficOnly": true,
        "minimumTlsVersion": "TLS1_2",
        "defaultToOAuthAuthentication": true,
        "allowBlobPublicAccess": false,
        "allowSharedKeyAccess": false,
        "encryption": {
          "keySource": "Microsoft.Storage",
          "requireInfrastructureEncryption": true,
          "services": {
            "blob": {
              "enabled": true
            },
            "queue": {
              "enabled": true
            }
          }
        }
      }
    },
    {
      "type": "Microsoft.Storage/storageAccounts/blobServices/containers",
      "apiVersion": "2022-05-01",
      "name": "[format('{0}/default/{1}', parameters('storageAccountName'), parameters('fileSystemName'))]",
      "dependsOn": [
        "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName'))]"
      ]
    },
    {
      "type": "Microsoft.Storage/storageAccounts/queueServices/queues",
      "apiVersion": "2024-01-01",
      "name": "[format('{0}/default/{1}', parameters('storageAccountName'), parameters('storageEventQueueName'))]",
      "dependsOn": [
          "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName'))]"
      ]
    },
    {
      "type": "Microsoft.Storage/storageAccounts/queueServices/queues",
      "apiVersion": "2024-01-01",
      "name": "[format('{0}/default/{1}-poison', parameters('storageAccountName'), parameters('storageEventQueueName'))]",
      "dependsOn": [
          "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName'))]"
      ]
    },
    {
      "type": "Microsoft.Authorization/roleAssignments",
      "apiVersion": "2021-04-01-preview",
      "name": "[guid(resourceGroup().id, parameters('workspaceName'), parameters('dicomServiceName'))]",
      "location": "[resourceGroup().location]",
      "dependsOn": [
        "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName'))]",
        "[resourceId('Microsoft.ManagedIdentity/userAssignedIdentities', variables('dicomIdentityName'))]"
      ],
      "properties": {
        "roleDefinitionId": "[variables('storageBlobDataContributor')]",
        "principalId": "[reference(resourceId('Microsoft.ManagedIdentity/userAssignedIdentities', variables('dicomIdentityName'))).principalId]",
        "principalType": "ServicePrincipal"
      },
      "scope": "[concat('Microsoft.Storage/storageAccounts', '/', parameters('storageAccountName'))]"
    },
    {
      "type": "Microsoft.Authorization/roleAssignments",
      "apiVersion": "2021-04-01-preview",
      "name": "[guid(resourceGroup().id, parameters('workspaceName'), parameters('dicomServiceName'), parameters('storageEventQueueName'))]",
      "location": "[resourceGroup().location]",
      "dependsOn": [
        "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName'))]",
        "[resourceId('Microsoft.ManagedIdentity/userAssignedIdentities', variables('dicomIdentityName'))]"
      ],
      "properties": {
        "roleDefinitionId": "[variables('storageQueueDataContributor')]",
        "principalId": "[reference(resourceId('Microsoft.ManagedIdentity/userAssignedIdentities', variables('dicomIdentityName'))).principalId]",
        "principalType": "ServicePrincipal"
      },
      "scope": "[concat('Microsoft.Storage/storageAccounts', '/', parameters('storageAccountName'))]"
    },
    {
      "type": "Microsoft.Authorization/roleAssignments",
      "apiVersion": "2021-04-01-preview",
      "name": "[guid(resourceGroup().id, parameters('systemTopicName'), parameters('storageEventQueueName'))]",
      "location": "[resourceGroup().location]",
      "dependsOn": [
        "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName'))]",
        "[resourceId('Microsoft.ManagedIdentity/userAssignedIdentities', parameters('systemTopicName'))]"
      ],
      "properties": {
        "roleDefinitionId": "[variables('storageQueueDataMessageSender')]",
        "principalId": "[reference(resourceId('Microsoft.ManagedIdentity/userAssignedIdentities', parameters('systemTopicName'))).principalId]",
        "principalType": "ServicePrincipal"
      },
      "scope": "[concat('Microsoft.Storage/storageAccounts', '/', parameters('storageAccountName'))]"
    },
    {
      "type": "Microsoft.EventGrid/systemTopics",
      "apiVersion": "2025-02-15",
      "name": "[parameters('systemTopicName')]",
      "location": "[resourceGroup().location]",
      "identity": {
        "type": "userAssigned",
        "userAssignedIdentities": {
          "[resourceId('Microsoft.ManagedIdentity/userAssignedIdentities/', parameters('systemTopicName'))]": {}
        }
      },
      "dependsOn": [
        "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName'))]",
        "[resourceId('Microsoft.ManagedIdentity/userAssignedIdentities', parameters('systemTopicName'))]"
      ],
      "properties": {
          "source": "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName'))]",
          "topicType": "Microsoft.Storage.StorageAccounts"
      }
    },
    {
        "type": "Microsoft.EventGrid/systemTopics/eventSubscriptions",
        "apiVersion": "2025-02-15",
        "name": "[concat(parameters('systemTopicName'), '/', parameters('eventSubscriptionName'))]",
        "dependsOn": [
            "[resourceId('Microsoft.EventGrid/systemTopics', parameters('systemTopicName'))]"
        ],
        "properties": {
            "deliveryWithResourceIdentity": {
                "identity": {
                    "type": "UserAssigned",
                    "userAssignedIdentity": "[resourceId('Microsoft.ManagedIdentity/userAssignedIdentities', parameters('systemTopicName'))]"
                },
                "destination": {
                    "properties": {
                        "resourceId": "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName'))]",
                        "queueName": "[parameters('storageEventQueueName')]",
                        "queueMessageTimeToLiveInSeconds": 604800
                    },
                    "endpointType": "StorageQueue"
                }
            },
            "filter": {
                "subjectBeginsWith": "[format('/blobServices/default/containers/{0}/blobs/AHDS/{1}/dicom/{2}/', parameters('fileSystemName'), parameters('workspaceName'), parameters('dicomServiceName'))]",
                "subjectEndsWith": ".dcm",
                "includedEventTypes": [
                    "Microsoft.Storage.BlobCreated",
                    "Microsoft.Storage.BlobDeleted"
                ],
                "isSubjectCaseSensitive": true,
                "enableAdvancedFilteringOnArrays": true,
                "advancedFilters": [
                    {
                        "values": [
                          "[format('tag:{0}-{1}.dicom.azurehealthcareapis.com,', parameters('workspaceName'), parameters('dicomServiceName'))]"
                        ],
                        "operatorType": "StringNotBeginsWith",
                        "key": "data.clientRequestId"
                    }
                ]
            },
            "labels": [],
            "eventDeliverySchema": "CloudEventSchemaV1_0",
            "retryPolicy": {
                "maxDeliveryAttempts": 30,
                "eventTimeToLiveInMinutes": 1440
            }
        }
    },
    {
      "type": "Microsoft.HealthcareApis/workspaces",
      "name": "[parameters('workspaceName')]",
      "apiVersion": "2025-04-01-preview",
      "location": "[resourceGroup().location]"
    },
    {
      "type": "Microsoft.HealthcareApis/workspaces/dicomservices",
      "apiVersion": "2025-04-01-preview",
      "name": "[concat(parameters('workspaceName'), '/', parameters('dicomServiceName'))]",
      "location": "[resourceGroup().location]",
      "dependsOn": [
        "[resourceId('Microsoft.HealthcareApis/workspaces', parameters('workspaceName'))]",
        "[resourceId('Microsoft.ManagedIdentity/userAssignedIdentities', variables('dicomIdentityName'))]",
        "[resourceId('Microsoft.EventGrid/systemTopics/eventSubscriptions', parameters('systemTopicName'), parameters('eventSubscriptionName'))]"
      ],
      "identity": {
        "type": "userAssigned",
        "userAssignedIdentities": {
          "[resourceId('Microsoft.ManagedIdentity/userAssignedIdentities/', variables('dicomIdentityName'))]": {}
        }
      },
      "properties": {
        "storageConfiguration": {
          "storageResourceId": "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName'))]",
          "fileSystemName": "[parameters('fileSystemName')]",
          "storageIndexingConfiguration": {
            "storageEventQueueName": "[parameters('storageEventQueueName')]"
          }
        },
        "enableDataPartitions": "[parameters('enableDataPartitions')]"
      }
    }
  ]
}
```

## Diagnosing Issues

:::image type="content" source="media/storage-indexing/diagnostic-logs.png" alt-text="A screenshot of the Azure portal showing a Kusto Query Language (KQL) query for the AHDSDicomAuditLogs table. The example query is filtering for all logs where OperationName is the string index-storage. A table of the query results is underneath." lightbox="media/storage-indexing/diagnostic-logs.png":::

If there's an error when processing an event, the problematic event is enqueued in a "poison queue" called `{queue-name}-poison` in the same storage account. Details about every processed event can be found in the `AHDSDicomAuditLogs` and `AHDSDicomDiagnosticLogs` tables by filtering for all logs where `OperationName = 'index-storage'`. The audit logs only record when the operation started and completed whereas the diagnostic table provides details about each operation including any errors, if any. Operations may be correlated across the tables using `CorrelationId`.

Failures are divided into two types: `User` and `Server`. User errors include any problem connecting to the storage account or with the DICOM file itself, while server errors include any unexpected error that prevents processing. Unlike server errors, the DICOM service doesn't retry user errors.

## Next Steps
* [Interact with SOP instances using DICOMweb&trade;](dicomweb-standard-apis-with-dicom-services.md)