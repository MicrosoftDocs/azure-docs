---
title: Use managed Identities to capture Azure Event Hubs events
description: This article explains how to use managed identities to capture events to a destination such as Azure Blob Storage and Azure Data Lake Storage. 
ms.topic: article
ms.date: 03/20/2024
---


# Authenticate modes for capturing events to destinations in Azure Event Hubs
Azure Event Hubs allows you to select different authentication modes when capturing events to a destination such as [Azure Blob storage](https://azure.microsoft.com/services/storage/blobs/) or [Azure Data Lake Storage Gen 1 or Gen 2](https://azure.microsoft.com/services/data-lake-store/) account of your choice. The authentication mode determines how the capture agent running in Event Hubs authenticate with the capture destination. 

## SAS based authentication 
The default authentication method is to use Shared Access Signature(SAS) to access the capture destination from Event Hubs service. 

:::image type="content" source="./media/event-hubs-capture-overview/event-hubs-capture-default.png" alt-text="Image showing capturing of Event Hubs data into Azure Storage or Azure Data Lake Storage using default SAS authentication mode":::

With this approach, you can capture data to destinations resources that are in the **same subscription** only. 

## Use managed identity 
With [managed identity](../active-directory/managed-identities-azure-resources/overview.md), users can seamlessly capture data to a preferred destination by using Microsoft Entra ID based authentication and authorization. 

:::image type="content" source="./media/event-hubs-capture-overview/event-hubs-capture-msi.png" alt-text="Image showing capturing of Event Hubs data into Azure Storage or Azure Data Lake Storage using Managed Identity":::

You can use system-assigned or user-assigned managed identities with Event Hubs Capture destinations.

## Use a system-assigned managed identity to capture events
System-assigned Managed Identity is automatically created and associated with an Azure resource, which is an Event Hubs namespace in this case. 

To use system assigned identity, the capture destination must have the required role assignment enabled for the corresponding system assigned identity. 
Then you can select `System Assigned` managed identity option when enabling the capture feature in an event hub.

:::image type="content" source="./media/event-hubs-capture-overview/event-hubs-captute-system-assigned.png" alt-text="Image showing capturing of Event Hubs data into Azure Storage or Azure Data Lake Storage using System Assigned managed identity.":::

 Then capture agent would use the identity of the namespace for authentication and authorization with the capture destination. 

### Azure Resource Manager template
Here's an example Azure Resource Manager template to configure capturing of data using a system-assigned managed identity. 

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "namespaces_eventhubcapture_name": {
            "defaultValue": "eventhubcapturens",
            "type": "String"
        },
        "captureEnabled": {
            "defaultValue": true,
            "type": "Bool",
            "metadata": {
                "description": "Enable or disable the Capture feature for your event hub."
            }
        },
        "captureEncodingFormat": {
            "defaultValue": "Avro",
            "allowedValues": [
                "Avro"
            ],
            "type": "String",
            "metadata": {
                "description": "The encoding format that Event Hubs Capture uses to serialize the event data when archiving to your storage."
            }
        },
        "captureTime": {
            "defaultValue": 300,
            "minValue": 60,
            "maxValue": 900,
            "type": "Int",
            "metadata": {
                "description": "the time window in seconds for the archival."
            }
        },
        "captureSize": {
            "defaultValue": 314572800,
            "minValue": 10485760,
            "maxValue": 524288000,
            "type": "Int",
            "metadata": {
                "description": "the size window in bytes for the capture."
            }
        },
        "blobContainerName": {
            "type": "String",
            "metadata": {
                "description": "Your existing storage container that you want the blobs archived in."
            }
        },
        "captureNameFormat": {
            "defaultValue": "{Namespace}/{EventHub}/{PartitionId}/{Year}/{Month}/{Day}/{Hour}/{Minute}/{Second}",
            "type": "String",
            "metadata": {
                "description": "A Capture Name Format must contain {Namespace}, {EventHub}, {PartitionId}, {Year}, {Month}, {Day}, {Hour}, {Minute} and {Second} fields. These can be arranged in any order with or without delimiters. E.g.  Prod_{EventHub}/{Namespace}\\{PartitionId}_{Year}_{Month}/{Day}/{Hour}/{Minute}/{Second}"
            }
        },
		"existingStgSubId": {
            "type": "String",
            "metadata": {
                "description": "The ID of the Azure subscription that has your existing storage account."
            }
        },
		"existingStgAccRG": {
            "type": "String",
            "metadata": {
                "description": "The resource group that has the storage account."
            }
        },
        "existingStgAcctName": {
            "type": "String",
            "metadata": {
                "description": "The name of the storage account."
            }
        }
    },
    "variables": 
	{
		"roleAssignmentId": "[guid(resourceId('Microsoft.EventHub/namespaces/',parameters('namespaces_eventhubcapture_name')))]",
		"storageBlobDataOwnerId": "[concat(subscription().Id, '/providers/Microsoft.Authorization/roleDefinitions/', 'b7e6dc6d-f1e8-4753-8033-0f276bb0955b')]",
		"ehId": "[concat('/subscriptions/', subscription().subscriptionId, '/resourceGroups/', resourceGroup().name, '/providers/', 'Microsoft.EventHub/namespaces/',parameters('namespaces_eventhubcapture_name')) ]",
		"existingStorageAcctResourceId" : "[concat('/subscriptions/', parameters('existingStgSubId'), '/resourceGroups/', parameters('existingStgAccRG'), '/providers/', 'Microsoft.Storage/storageAccounts/',parameters('existingStgAcctName')) ]"
	},
    "resources": [
        {
            "type": "Microsoft.EventHub/namespaces",
            "apiVersion": "2023-01-01-preview",
            "name": "[parameters('namespaces_eventhubcapture_name')]",
            "location": "eastus",
            "sku": {
                "name": "Standard",
                "tier": "Standard",
                "capacity": 1
            },
            "identity": {
                "type": "SystemAssigned"
            },
            "properties": {
                "minimumTlsVersion": "1.2",
                "publicNetworkAccess": "Enabled",
                "disableLocalAuth": false,
                "zoneRedundant": true,
                "isAutoInflateEnabled": false,
                "maximumThroughputUnits": 0,
                "kafkaEnabled": true
            }
        },
        {
            "type": "Microsoft.EventHub/namespaces/authorizationrules",
            "apiVersion": "2023-01-01-preview",
            "name": "[concat(parameters('namespaces_eventhubcapture_name'), '/RootManageSharedAccessKey')]",
            "location": "eastus",
            "dependsOn": [
                "[resourceId('Microsoft.EventHub/namespaces', parameters('namespaces_eventhubcapture_name'))]"
            ],
            "properties": {
                "rights": [
                    "Listen",
                    "Manage",
                    "Send"
                ]
            }
        },
		{
			"type": "Microsoft.Resources/deployments",
			"apiVersion": "2022-09-01",
			"name": "nestedStgTemplate",
			"subscriptionId": "[parameters('existingStgSubId')]",
			"resourceGroup": "[parameters('existingStgAccRG')]",
			"properties": {
				"expressionEvaluationOptions": {
					"scope": "outer"
				},
				"mode": "Incremental",
				"template": {
					"$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
					"contentVersion": "1.0.0.0",
					"resources": [
						{
							"type": "Microsoft.Authorization/roleAssignments",
							"name": "C0F7F914-0FF9-47B2-9960-1D64D97FF594",
							"apiVersion": "2018-01-01-preview",
							"scope": "[variables('existingStorageAcctResourceId')]",
							"properties": {
								"roleDefinitionId": "[variables('storageBlobDataOwnerId')]",
								"principalId": "[reference(variables('ehId'), '2021-11-01', 'Full').identity.principalId]"
							}
						}
					]
				}
			}
		},
        {
            "type": "Microsoft.EventHub/namespaces/eventhubs",
            "apiVersion": "2023-01-01-preview",
            "name": "[concat(parameters('namespaces_eventhubcapture_name'), '/capture')]",
            "location": "eastus",
            "dependsOn": [
                "[resourceId('Microsoft.EventHub/namespaces', parameters('namespaces_eventhubcapture_name'))]",
				"nestedStgTemplate"
            ],
            "properties": {
                "retentionDescription": {
                    "cleanupPolicy": "Delete",
                    "retentionTimeInHours": 24
                },
                "messageRetentionInDays": 1,
                "partitionCount": 1,
                "status": "Active",
                "captureDescription": {
                    "enabled": "[parameters('captureEnabled')]",
                    "skipEmptyArchives": false,
                    "encoding": "[parameters('captureEncodingFormat')]",
                    "intervalInSeconds": "[parameters('captureTime')]",
                    "sizeLimitInBytes": "[parameters('captureSize')]",
                    "destination": {
                        "name": "EventHubArchive.AzureBlockBlob",
                        "properties": {
                            "storageAccountResourceId": "[variables('existingStorageAcctResourceId')]",
                            "blobContainer": "[parameters('blobContainerName')]",
                            "archiveNameFormat": "[parameters('captureNameFormat')]"
                        },
						"identity": {
							"type": "SystemAssigned"
						}
                    }
                }
            }
        },
        {
            "type": "Microsoft.EventHub/namespaces/networkRuleSets",
            "apiVersion": "2023-01-01-preview",
            "name": "[concat(parameters('namespaces_eventhubcapture_name'), '/default')]",
            "location": "eastus",
            "dependsOn": [
                "[resourceId('Microsoft.EventHub/namespaces', parameters('namespaces_eventhubcapture_name'))]"
            ],
            "properties": {
                "publicNetworkAccess": "Enabled",
                "defaultAction": "Allow",
                "virtualNetworkRules": [],
                "ipRules": []
            }
        },
        {
            "type": "Microsoft.EventHub/namespaces/eventhubs/consumergroups",
            "apiVersion": "2023-01-01-preview",
            "name": "[concat(parameters('namespaces_eventhubcapture_name'), '/capture/$Default')]",
            "location": "eastus",
            "dependsOn": [
                "[resourceId('Microsoft.EventHub/namespaces/eventhubs', parameters('namespaces_eventhubcapture_name'), 'capture')]",
                "[resourceId('Microsoft.EventHub/namespaces', parameters('namespaces_eventhubcapture_name'))]"
            ],
            "properties": {}
        }
    ]
}
```

**Parameters.json**:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "namespaces_eventhubcapture_name": {
            "value": "NAMESPACENAME"
        },
        "captureEnabled": {
            "value": true
        },
        "captureEncodingFormat": {
            "value": "Avro"
        },
        "captureTime": {
            "value": 300
        },
        "captureSize": {
            "value": 314572800
        },
        "blobContainerName": {
            "value": "BLOBCONTAINERNAME"
        },
        "captureNameFormat": {
            "value": "{Namespace}/{EventHub}/{PartitionId}/{Year}/{Month}/{Day}/{Hour}/{Minute}/{Second}"
        },
		"existingStgSubId": {
            "value": "00000000-0000-0000-0000-00000000000000"
        },
		"existingStgAccRG": {
            "value": "STORAGERESOURCEGROUPNAME"
        },
		"existingStgAcctName": {
            "value": "STORAGEACCOUNTNAME"
        }
    }
}
```

## Use a user-assigned managed identity to capture events
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
