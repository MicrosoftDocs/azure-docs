---
title: Send data to Event Hubs and Storage (Preview)
description: This article describes how to use Azure Monitor Agent to upload data to Azure Storage and Event Hubs.
ms.topic: conceptual
author: guywi-ms
ms.author: guywild
ms.date: 10/09/2023
ms.reviewer: luki
---

# Send data to Event Hubs and Storage (Preview)

This article provides all required information for using the new Azure Monitor Agent (AMA) feature to upload data to Azure Storage and Event Hubs. This feature is in preview.

The Azure Monitor Agent is the new, consolidated telemetry agent for collecting data from IaaS resources like virtual machines. This preview brings us closer to retiring the Diagnostics Extensions for Windows and Linux (WAD/LAD). By using the new upload capability in this preview, you can now upload the logs<sup>[1](#FN1)</sup> you send to Log Analytics workspaces to Event Hubs and Storage. Both new data destinations use data collection rules to configure collection setup for the agents.

**Footnotes**

<a name="FN1">1</a>: Not all data types are supported; refer to [Preview scope](#preview-scope) for specifics.

## Preview scope

This section describes what's [supported](#whats-supported) and [not supported](#whats-not-supported) in this preview. 

### What's supported

#### Data types

- Windows:
   - Windows Event Logs – to eventhub and storage
   - Perf counters – eventhub and storage
   - IIS logs – to storage blob
   - Custom logs – to storage blob

- Linux:
   - Syslog – to eventhub and storage
   - Perf counters – to eventhub and storage
   - Custom Logs / Log files – to eventhub and storage

#### Operating systems

- Environments that are supported by the Azure Monitoring Agent on Windows and Linux
- This feature is only supported and planned to be supported for Azure VMs

#### Cloud regions

- Canary early access, which includes EAST US2 EUAP and Central US EUAP

### What's not supported

#### Data types

- Windows:
   - ETW Logs
   - Windows Crash Dumps
   - Application Logs
   - .NET event source logs

## Create a user-assigned managed identity

### [Azure portal](#tab/portal)

1. [Create a user-assigned managed identity](../../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md#create-a-user-assigned-managed-identity).

### [Azure Resource Manager template](#tab/azure-resource-manager-template)

  Azure Resource Manager template definition:

  ```json
  {
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
      "location": {
        "type": "string",
        "defaultValue": "[resourceGroup().location]",
        "metadata": {
          "description": "Location for all resources."
        }
      },
      "identityName": {
        "type": "string",
        "defaultValue": "[concat(resourceGroup().name, 'UAI')]",
        "metadata": {
          "description": "Managed identity Name."
        }
      }
    },
    "resources": [
      {
        "type": "Microsoft.ManagedIdentity/userAssignedIdentities",
        "apiVersion": "2022-01-31-preview",
        "name": "[parameters('identityName')]",
        "location": "[parameters('location')]"
      }
    ]
  }
  ```

  ---

## Set up a storage account

### [Azure portal](#tab/portal)

1. [Create a new storage account](../../storage/common/storage-account-create.md). If you already have a storage account, you can skip this step.
1. Set up access to the storage account:
   - If you want to upload data to blob storage, assign the built-in role `Storage Blob Data Contributor` to the managed identity on your storage account via the [Access Control (IAM) page](../../role-based-access-control/role-assignments-portal.md) in your storage account.
   - If you want to upload data to table storage, assign the built-in role `Storage Table Data Contributor` to the managed identity on your storage account via the [Access Control (IAM) page](../../role-based-access-control/role-assignments-portal.md) in your storage account.

### [Azure Resource Manager template](#tab/azure-resource-manager-template)

Azure Resource Manager template definition for setting up a storage account:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": {
        "description": "Location for all resources."
      }
    },
	"storageAccountName": {
      "type": "string",
      "defaultValue": "[concat(resourceGroup().name, 'sa')]",
      "metadata": {
        "description": "Storage account for logs upload"
      }
    },
	"identityName": {
      "type": "string",
      "defaultValue": "[concat(resourceGroup().name, 'uai')]",
      "metadata": {
        "description": "Managed identity"
      }
    }
  },
  "variables": {
    "apiVersion": "2020-06-01",
    "StorageBlobDataContributor": "[guid(concat(resourceGroup().id, 'StorageBlobDataContributor'))]",
    "StorageTableDataContributor": "[guid(concat(resourceGroup().id, 'StorageTableDataContributor'))]"
  },
  "resources": [
    {
      "type": "Microsoft.ManagedIdentity/userAssignedIdentities",
      "apiVersion": "2022-01-31-preview",
      "name": "[parameters('identityName')]",
      "location": "[parameters('location')]"
    },
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2022-05-01",
      "name": "[parameters('storageAccountName')]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "Standard_LRS"
      },
      "kind": "Storage",
      "properties": {}
    },
    {
      "type": "Microsoft.Authorization/roleAssignments",
      "apiVersion": "2022-04-01",
      "name": "[variables('StorageBlobDataContributor')]",
      "scope": "[concat('Microsoft.Storage/storageAccounts', '/', parameters('storageAccountName'))]",
      "dependsOn": [
        "[parameters('storageAccountName')]",
        "[resourceId('Microsoft.ManagedIdentity/userAssignedIdentities', parameters('identityName'))]"
      ],
      "properties": {
        "roleDefinitionId": "[concat(subscription().Id, '/providers/Microsoft.Authorization/roleDefinitions/ba92f5b4-2d11-453d-a403-e96b0029c9fe')]",
        "principalId": "[reference(resourceId('Microsoft.ManagedIdentity/userAssignedIdentities', parameters('identityName')), '2018-11-30').principalId]",
        "principalType": "ServicePrincipal"
      }
    },
    {
      "type": "Microsoft.Authorization/roleAssignments",
      "apiVersion": "2022-04-01",
      "name": "[variables('StorageTableDataContributor')]",
      "scope": "[concat('Microsoft.Storage/storageAccounts', '/', parameters('storageAccountName'))]",
      "dependsOn": [
        "[parameters('storageAccountName')]",
        "[resourceId('Microsoft.ManagedIdentity/userAssignedIdentities', parameters('identityName'))]"
      ],
      "properties": {
        "roleDefinitionId": "[concat(subscription().Id, '/providers/Microsoft.Authorization/roleDefinitions/0a9a7e1f-b9d0-4cc4-a60d-0319b160aaa3')]",
        "principalId": "[reference(resourceId('Microsoft.ManagedIdentity/userAssignedIdentities', parameters('identityName')), '2018-11-30').principalId]",
        "principalType": "ServicePrincipal"
      }
    }
  ]
}
```

---

## Set up an Event Hubs namespace and event hub

### [Azure portal](#tab/portal)

1. [Create an Event Hubs namespace and event hub](../../event-hubs/event-hubs-resource-manager-namespace-event-hub.md) where you want data to be sent. If you already have an Event Hubs namespace and event hub, you can skip this step.
1. If you want to upload data to an event hub, assign the built-in role `Azure Event Hubs Data Sender` to the managed identity on your event hub via the [Access Control (IAM) page](../../role-based-access-control/role-assignments-portal.md) in your event hub.

### [Azure Resource Manager template](#tab/azure-resource-manager-template)

Azure Resource Manager template definition for setting up an Event Hubs namespace and event hub:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": {
        "description": "Location for all resources."
      }
    },
  "identityName": {
      "type": "string",
      "defaultValue": "[concat(resourceGroup().name, 'UAI')]",
      "metadata": {
        "description": "Managed identity"
      }
    },
  "eventHubNamespaceName": {
      "type": "string",
      "defaultValue": "[concat(resourceGroup().name, 'eh')]",
      "metadata": {
        "description": "Event Hub Namespace"
      }
    },
  "eventHubInstanceName": {
      "type": "string",
      "defaultValue": "[concat(resourceGroup().name, 'ehins')]",
      "metadata": {
        "description": "Event Hub Instance"
      }
    }
  },
  "variables": {
    "EventHubsDataSender": "[guid(concat(resourceGroup().id, 'EventHubsDataSender'))]"
  },
  "resources": [
    {
      "type": "Microsoft.ManagedIdentity/userAssignedIdentities",
      "apiVersion": "2022-01-31-preview",
      "name": "[parameters('identityName')]",
      "location": "[parameters('location')]"
    },
    {
      "type": "Microsoft.EventHub/namespaces",
      "apiVersion": "2022-01-01-preview",
      "name": "[parameters('eventHubNamespaceName')]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "Standard",
        "tier": "Standard",
        "capacity": 1
      }
    },
    {
      "type": "Microsoft.EventHub/namespaces/eventhubs",
      "apiVersion": "2022-01-01-preview",
      "name": "[concat(parameters('eventHubNamespaceName'), '/', parameters('eventHubInstanceName'))]",
      "location": "[parameters('location')]",
      "dependsOn": [
        "[resourceId('Microsoft.EventHub/namespaces', parameters('eventHubNamespaceName'))]"
      ],
      "properties": {
        "messageRetentionInDays": 1,
        "partitionCount": 1,
        "status": "Active"
      }
    },
    {
      "type": "Microsoft.Authorization/roleAssignments",
      "apiVersion": "2022-04-01",
      "name": "[variables('EventHubsDataSender')]",
      "scope": "[concat('Microsoft.EventHub/namespaces', '/', parameters('eventHubNamespaceName'))]",
      "dependsOn": [
        "[parameters('eventHubNamespaceName')]",
        "[resourceId('Microsoft.ManagedIdentity/userAssignedIdentities', parameters('identityName'))]"
      ],
      "properties": {
        "roleDefinitionId": "[concat(subscription().Id, '/providers/Microsoft.Authorization/roleDefinitions/2b629674-e913-4c01-ae53-ef4638d8f975')]",
        "principalId": "[reference(resourceId('Microsoft.ManagedIdentity/userAssignedIdentities', parameters('identityName')), '2018-11-30').principalId]",
        "principalType": "ServicePrincipal"
      }
    }
  ]
}
```

---

## Create a data collection rule

Create a data collection rule for collecting events and sending to storage and event hub.

1. In the Azure portal's search box, type in *template* and then select **Deploy a custom template**.

    :::image type="content" source="../logs/media/tutorial-workspace-transformations-api/deploy-custom-template.png" lightbox="../logs/media/tutorial-workspace-transformations-api/deploy-custom-template.png" alt-text="Screenshot that shows the Azure portal with template entered in the search box and Deploy a custom template highlighted in the search results.":::

1. Select **Build your own template in the editor**.

    :::image type="content" source="../logs/media/tutorial-workspace-transformations-api/build-custom-template.png" lightbox="../logs/media/tutorial-workspace-transformations-api/build-custom-template.png" alt-text="Screenshot that shows portal screen to build template in the editor.":::

1. Paste this Azure Resource Manager template into the editor:

    ### [Windows](#tab/windows)

    ```json
    {
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "location": {
        "type": "string",
        "defaultValue": "[resourceGroup().location]",
        "metadata": {
            "description": "Location for all resources."
        }
        },
        "dataCollectionRulesName": {
        "defaultValue": "[concat(resourceGroup().name, 'DCR')]",
        "type": "String"
        },
        "storageAccountName": {
        "defaultValue": "[concat(resourceGroup().name, 'sa')]",
        "type": "String"
        },
        "eventHubNamespaceName": {
        "defaultValue": "[concat(resourceGroup().name, 'eh')]",
        "type": "String"
        },
        "eventHubInstanceName": {
        "defaultValue": "[concat(resourceGroup().name, 'ehins')]",
        "type": "String"
        }
    },
    "resources": [
        {
        "type": "Microsoft.Insights/dataCollectionRules",
        "apiVersion": "2022-06-01",
        "name": "[parameters('dataCollectionRulesName')]",
        "location": "[parameters('location')]",
        "kind": "AgentDirectToStore",
        "properties": {
            "dataSources": {
            "performanceCounters": [
                {
                "streams": [
                    "Microsoft-Perf"
                ],
                "samplingFrequencyInSeconds": 10,
                "counterSpecifiers": [
                    "\\Process(_Total)\\Working Set - Private",
                    "\\Memory\\% Committed Bytes In Use",
                    "\\LogicalDisk(_Total)\\% Free Space",
                    "\\Network Interface(*)\\Bytes Total/sec"
                ],
                "name": "perfCounterDataSource10"
                }
            ],
            "windowsEventLogs": [
                {
                "streams": [
                    "Microsoft-Event"
                ],
                "xPathQueries": [
                    "Application!*[System[(Level=2)]]",
                    "System!*[System[(Level=2)]]"
                ],
                "name": "eventLogsDataSource"
                }
            ],
            "iisLogs": [
                {
                "streams": [
                    "Microsoft-W3CIISLog"
                ],
                "logDirectories": [
                    "C:\\inetpub\\logs\\LogFiles\\W3SVC1\\"
                ],
                "name": "myIisLogsDataSource"
                }
            ],
            "logFiles": [
                {
                "streams": [
                    "Custom-Text-logs"
                ],
                "filePatterns": [
                    "C:\\JavaLogs\\*.log"
                ],
                "format": "text",
                "settings": {
                    "text": {
                    "recordStartTimestampFormat": "ISO 8601"
                    }
                },
                "name": "myTextLogs"
                }
            ]
            },
            "destinations": {
            "eventHubsDirect": [
                {
                "eventHubResourceId": "[resourceId('Microsoft.EventHub/namespaces/eventhubs', parameters('eventHubNamespaceName'), parameters('eventHubInstanceName'))]",
                "name": "myEh1"
                }
            ],
            "storageBlobsDirect": [
                {
                "storageAccountResourceId": "[resourceId('Microsoft.Storage/storageAccounts/', parameters('storageAccountName'))]",
                "name": "blobNamedPerf",
                "containerName": "PerfBlob"
                },
                {
                "storageAccountResourceId": "[resourceId('Microsoft.Storage/storageAccounts/', parameters('storageAccountName'))]",
                "name": "blobNamedWin",
                "containerName": "WinEventBlob"
                },
                {
                "storageAccountResourceId": "[resourceId('Microsoft.Storage/storageAccounts/', parameters('storageAccountName'))]",
                "name": "blobNamedIIS",
                "containerName": "IISBlob"
                },
                {
                "storageAccountResourceId": "[resourceId('Microsoft.Storage/storageAccounts/', parameters('storageAccountName'))]",
                "name": "blobNamedTextLogs",
                "containerName": "TxtLogBlob"
                }
            ],
            "storageTablesDirect": [
                {
                "storageAccountResourceId": "[resourceId('Microsoft.Storage/storageAccounts/', parameters('storageAccountName'))]",
                "name": "tableNamedPerf",
                "tableName": "PerfTable"
                },
                {
                "storageAccountResourceId": "[resourceId('Microsoft.Storage/storageAccounts/', parameters('storageAccountName'))]",
                "name": "tableNamedWin",
                "tableName": "WinTable"
                },
                {
                "storageAccountResourceId": "[resourceId('Microsoft.Storage/storageAccounts/', parameters('storageAccountName'))]",
                "name": "tableUnnamed"
                }
            ]
            },
            "dataFlows": [
            {
                "streams": [
                "Microsoft-Perf"
                ],
                "destinations": [
                "myEh1",
                "blobNamedPerf",
                "tableNamedPerf",
                "tableUnnamed"
                ]
            },
            {
                "streams": [
                "Microsoft-WindowsEvent"
                ],
                "destinations": [
                "myEh1",
                "blobNamedWin",
                "tableNamedWin",
                "tableUnnamed"
                ]
            },
            {
                "streams": [
                "Microsoft-W3CIISLog"
                ],
                "destinations": [
                "blobNamedIIS"
                ]
            },
            {
                "streams": [
                "Custom-Text-logs"
                ],
                "destinations": [
                "blobNamedTextLogs"
                ]
            }
            ]
        }
        }
    ]
    }
    ```

    ### [Linux](#tab/linux)

    ```json
    { 
    
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#", 
    
    "contentVersion": "1.0.0.0", 
    
    "parameters": { 
    
        "location": { 
    
        "type": "string", 
    
        "defaultValue": "[resourceGroup().location]", 
    
        "metadata": { 
    
            "description": "Location for all resources." 
    
        } 
    
        }, 
    
        "dataCollectionRulesName": { 
    
        "defaultValue": "[concat(resourceGroup().name, 'DCR')]", 
    
        "type": "String" 
    
        }, 
    
        "storageAccountName": { 
    
        "defaultValue": "[concat(resourceGroup().name, 'sa')]", 
    
        "type": "String" 
    
        }, 
    
        "eventHubNamespaceName": { 
    
        "defaultValue": "[concat(resourceGroup().name, 'eh')]", 
    
        "type": "String" 
    
        }, 
    
        "eventHubInstanceName": { 
    
        "defaultValue": "[concat(resourceGroup().name, 'ehins')]", 
    
        "type": "String" 
    
        } 
    
    }, 
    
    "resources": [ 
    
        { 
    
        "type": "Microsoft.Insights/dataCollectionRules", 
    
        "apiVersion": "2022-06-01", 
    
        "name": "[parameters('dataCollectionRulesName')]", 
    
        "location": "[parameters('location')]", 
    
        "kind": "AgentDirectToStore", 
    
        "properties": { 
    
            "dataSources": { 
    
            "performanceCounters": [ 
    
                { 
    
                "streams": [ 
    
                    "Microsoft-Perf" 
    
                ], 
    
                "samplingFrequencyInSeconds": 10, 
    
                "counterSpecifiers": [ 
    
                    "Processor(*)\\% Processor Time",
    "Processor(*)\\% Idle Time",
    "Processor(*)\\% User Time",
    "Processor(*)\\% Nice Time",
    "Processor(*)\\% Privileged Time",
    "Processor(*)\\% IO Wait Time",
    "Processor(*)\\% Interrupt Time",
    "Processor(*)\\% DPC Time",
    "Memory(*)\\Available MBytes Memory",
    "Memory(*)\\% Available Memory",
    "Memory(*)\\Used Memory MBytes",
    "Memory(*)\\% Used Memory",
    "Memory(*)\\Pages/sec",
    "Memory(*)\\Page Reads/sec",
    "Memory(*)\\Page Writes/sec",
    "Memory(*)\\Available MBytes Swap",
    "Memory(*)\\% Available Swap Space",
    "Memory(*)\\Used MBytes Swap Space",
    "Memory(*)\\% Used Swap Space",
    "Logical Disk(*)\\% Free Inodes",
    "Logical Disk(*)\\% Used Inodes",
    "Logical Disk(*)\\Free Megabytes",
    "Logical Disk(*)\\% Free Space",
    "Logical Disk(*)\\% Used Space",
    "Logical Disk(*)\\Logical Disk Bytes/sec",
    "Logical Disk(*)\\Disk Read Bytes/sec",
    "Logical Disk(*)\\Disk Write Bytes/sec",
    "Logical Disk(*)\\Disk Transfers/sec",
    "Logical Disk(*)\\Disk Reads/sec",
    "Logical Disk(*)\\Disk Writes/sec",
    "Network(*)\\Total Bytes Transmitted",
    "Network(*)\\Total Bytes Received",
    "Network(*)\\Total Bytes",
    "Network(*)\\Total Packets Transmitted",
    "Network(*)\\Total Packets Received",
    "Network(*)\\Total Rx Errors",
    "Network(*)\\Total Tx Errors",
    "Network(*)\\Total Collisions"
    
    
                ], 
    
                "name": "perfCounterDataSource10" 
    
                } 
    
            ], 
    
            "syslog": [ 
    
                { 
    
                "streams": [ 
    
                    "Microsoft-Syslog" 
    
                ], 
    
                "facilityNames": [
                                    "auth",
                                    "authpriv",
                                    "cron",
                                    "daemon",
                                    "mark",
                                    "kern",
                                    "local0",
                                    "local1",
                                    "local2",
                                    "local3",
                                    "local4",
                                    "local5",
                                    "local6",
                                    "local7",
                                    "lpr",
                                    "mail",
                                    "news",
                                    "syslog",
                                    "user",
                                    "UUCP"
                                ],
                "logLevels": [
                                    "Debug",
                                    "Info",
                                    "Notice",
                                    "Warning",
                                    "Error",
                                    "Critical",
                                    "Alert",
                                    "Emergency"
                                ], 
    
                "name": "syslogDataSource" 
    
                } 
    
            ], 
    
            
    
            "logFiles": [ 
    
                { 
    
                "streams": [ 
    
                    "Custom-Text-logs" 
    
                ], 
    
                "filePatterns": [ 
    
                    "/var/log/messages" 
    
                ], 
    
                "format": "text", 
    
                "settings": { 
    
                    "text": { 
    
                    "recordStartTimestampFormat": "ISO 8601" 
    
                    } 
    
                }, 
    
                "name": "myTextLogs" 
    
                } 
    
            ] 
    
            }, 
    
            "destinations": { 
    
            "eventHubsDirect": [ 
    
                { 
    
                "eventHubResourceId": "[resourceId('Microsoft.EventHub/namespaces/eventhubs', parameters('eventHubNamespaceName'), parameters('eventHubInstanceName'))]", 
    
                "name": "myEh1" 
    
                } 
    
            ], 
    
            "storageBlobsDirect": [ 
    
                { 
    
                "storageAccountResourceId": "[resourceId('Microsoft.Storage/storageAccounts/', parameters('storageAccountName'))]", 
    
                "name": "blobNamedPerf", 
    
                "containerName": "PerfBlob" 
    
                }, 
    
                { 
    
                "storageAccountResourceId": "[resourceId('Microsoft.Storage/storageAccounts/', parameters('storageAccountName'))]", 
    
                "name": "blobNamedLinux", 
    
                "containerName": "SyslogBlob" 
    
                }, 
    
                { 
    
                "storageAccountResourceId": "[resourceId('Microsoft.Storage/storageAccounts/', parameters('storageAccountName'))]", 
    
                "name": "blobNamedTextLogs", 
    
                "containerName": "TxtLogBlob" 
    
                } 
    
            ], 
    
            "storageTablesDirect": [ 
    
                { 
    
                "storageAccountResourceId": "[resourceId('Microsoft.Storage/storageAccounts/', parameters('storageAccountName'))]", 
    
                "name": "tableNamedPerf", 
    
                "tableName": "PerfTable" 
    
                }, 
    
                { 
    
                "storageAccountResourceId": "[resourceId('Microsoft.Storage/storageAccounts/', parameters('storageAccountName'))]", 
    
                "name": "tableNamedLinux", 
    
                "tableName": "LinuxTable" 
    
                }, 
    
                { 
    
                "storageAccountResourceId": "[resourceId('Microsoft.Storage/storageAccounts/', parameters('storageAccountName'))]", 
    
                "name": "tableUnnamed" 
    
                } 
    
            ] 
    
            }, 
    
            "dataFlows": [ 
    
            { 
    
                "streams": [ 
    
                "Microsoft-Perf" 
    
                ], 
    
                "destinations": [ 
    
                "myEh1", 
    
                "blobNamedPerf", 
    
                "tableNamedPerf", 
    
                "tableUnnamed" 
    
                ] 
    
            }, 
    
            { 
    
                "streams": [ 
    
                "Microsoft-Syslog" 
    
                ], 
    
                "destinations": [ 
    
                "myEh1", 
    
                "blobNamedLinux", 
    
                "tableNamedLinux", 
    
                "tableUnnamed" 
    
                ] 
    
            }, 
    
            { 
    
                "streams": [ 
    
                "Custom-Text-logs" 
    
                ], 
    
                "destinations": [ 
    
                "blobNamedTextLogs" 
    
                ] 
    
            } 
    
            ] 
    
        } 
    
        } 
    
    ] 
    
    }
    ```

    ---

1. Update the following values in the Azure Resource Manager template:

    ### [Event hub](#tab/event-hub)

    - Define `dataSources` as per your requirements. The supported types for direct upload to EventHub for Windows are `performanceCounters` and `windowsEventLogs` and for Linux, they are `performanceCounters` and `syslog`. 
    - Use `destinations` as `eventHubsDirect` for direct upload to event hub. `eventHubResourceId` is resource ID of the event hub instance.

      > [!NOTE]
      > It isn't the event hub namespace resource ID.

    - under `dataFlows`, include destination name.

    See the example Azure Resource Manager template for a sample.

    ### [Storage table](#tab/storage-table)

    - Define `“dataSources”` as per your requirements. The supported types for direct upload to storage Table for Windows are `performanceCounters`, `windowsEventLogs` and for Linux, they are `performanceCounters` and `syslog`.
    - Use `destinations` as `storageTablesDirect` for direct upload to table storage. `storageAccountResourceId` is the resource ID of the storage account. 
    - `tableName` is the name of the Table where JSON blob with event data is uploaded to.
    - Under `dataFlows`, include destination name.

    See the example Azure Resource Manager template for a sample. Table is created if it doesn’t already exists.

    ### [Storage blob](#tab/storage-blob)

    - Define `dataSources` as per your requirements. The supported types for direct upload to storage blob for Windows are `performanceCounters`, `windowsEventLogs`, `iisLogs`, `logFiles` and for Linux, they are `performanceCounters`, `syslog` and `logFiles`.
    - Use `destinations` as `storageBlobsDirect` for direct upload to blob storage. 
    - `storageAccountResourceId` is the resource ID of the storage account. 
    - `containerName` is the name of the container where JSON blob with event data is uploaded to. 
    - Under `dataFlows`, include destination name. 

    See the example Azure Resource Manager template for a sample. Container is created if it doesn’t already exist.

    ---

1. Select **Save**.

## Create an Azure VM

[Create the Azure VM](../../virtual-machines/overview.md). If you already have a VM, make sure that the same managed identity is assigned to it that was used to configure Storage account and Event Hub. Then move to the next step.

## Create DCR association and deploy AzureMonitorAgent

Use custom template deployment to create the DCR association and AMA deployment.

1. In the Azure portal's search box, type in *template* and then select **Deploy a custom template**.

    :::image type="content" source="../logs/media/tutorial-workspace-transformations-api/deploy-custom-template.png" lightbox="../logs/media/tutorial-workspace-transformations-api/deploy-custom-template.png" alt-text="Screenshot that shows the Azure portal with template entered in the search box and Deploy a custom template highlighted in the search results.":::

1. Select **Build your own template in the editor**.

    :::image type="content" source="../logs/media/tutorial-workspace-transformations-api/build-custom-template.png" lightbox="../logs/media/tutorial-workspace-transformations-api/build-custom-template.png" alt-text="Screenshot that shows portal screen to build template in the editor.":::

1. Paste this Azure Resource Manager template into the editor:

    ```json
    {
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "vmName": {
        "defaultValue": "[concat(resourceGroup().name, 'vm')]",
        "type": "String"
        },
        "location": {
        "type": "string",
        "defaultValue": "[resourceGroup().location]",
        "metadata": {
            "description": "Location for all resources."
        }
        },
        "dataCollectionRulesName": {
        "defaultValue": "[concat(resourceGroup().name, 'DCR')]",
        "type": "String",
        "metadata": {
            "description": "Data Collection Rule Name"
        }
        },
        "dcraName": {
        "type": "string",
        "defaultValue": "[concat(uniquestring(resourceGroup().id), 'DCRLink')]",
        "metadata": {
            "description": "Name of the association."
        }
        },
        "identityName": {
        "type": "string",
        "defaultValue": "[concat(resourceGroup().name, 'UAI')]",
        "metadata": {
            "description": "Managed Identity"
        }
        }
    },
    "resources": [
        {
        "type": "Microsoft.Compute/virtualMachines/providers/dataCollectionRuleAssociations",
        "name": "[concat(parameters('vmName'),'/microsoft.insights/', parameters('dcraName'))]",
        "apiVersion": "2021-04-01",
        "properties": {
            "description": "Association of data collection rule. Deleting this association will break the data collection for this virtual machine.",
            "dataCollectionRuleId": "[resourceID('Microsoft.Insights/dataCollectionRules',parameters('dataCollectionRulesName'))]"
        }
        },
        {
        "type": "Microsoft.Compute/virtualMachines/extensions",
        "name": "[concat(parameters('vmName'), '/AMAExtension')]",
        "apiVersion": "2020-06-01",
        "location": "[parameters('location')]",
        "dependsOn": [
            "[resourceId('Microsoft.Compute/virtualMachines/providers/dataCollectionRuleAssociations', parameters('vmName'), 'Microsoft.Insights', parameters('dcraName'))]"
        ],
        "properties": {
            "publisher": "Microsoft.Azure.Monitor",
            "type": "AzureMonitorWindowsAgent",
            "typeHandlerVersion": "1.0",
            "autoUpgradeMinorVersion": true,
            "settings": {
            "authentication": {
                "managedIdentity": {
                "identifier-type": "mi_res_id",
                "identifier-value": "[resourceID('Microsoft.ManagedIdentity/userAssignedIdentities/',parameters('identityName'))]"
                }
            }
            }
        }
        }
    ]
    }
    ```

1. Select **Save**.

## Troubleshooting

Use the following section to troubleshoot sending data to Event Hubs and Storage.

### Data not found in storage account blob storage

- Check that the built-in role `Storage Blob Data Contributor` is assigned with managed identity on the storage account.
- Check that the managed identity is assigned to the VM.
- Check that the AMA settings have managed identity parameter.

### Data not found in storage account table storage

- Check that the built-in role `Storage Table Data Contributor` is assigned with managed identity on storage account.
- Check that the managed identity is assigned to the VM.
- Check that the AMA settings have managed identity parameter.

### Data not flowing to event hub

- Check that the built-in role `Azure Event Hubs Data Sender` is assigned with managed identity on storage account.
- Check that the managed identity is assigned to the VM.
- Check that the AMA settings have managed identity parameter.

## Questions and Feedback

Participation and early access to this feature requires a quick survey. Please take a couple minutes to input any feedback so that we can make the Azure Monitoring Agent even better for your needs.

## Frequently asked questions 

This section provides answers to common questions.

### Will the Azure Monitoring Agent support data upload to Application Insights?

No, this support isn't a part of the roadmap. Application Insights are now powered by Log Analytics Workspaces.

### Will the Azure Monitoring Agent support Windows Crash Dumps as a data type to upload?

No, this support isn't a part of the roadmap. The Azure Monitoring Agent is meant for telemetry logs and not large file types. The Windows Crash Dump Team (Watson) is making plans for an AMA extension for this capability. If you’d like visibility into this development work, indicate so in the [feedback form](#questions-and-feedback).

### Does this mean the Linux (LAD) and Windows (WAD) Diagnostic Extensions are no longer supported/retired?

No, not until Azure formally announces the deprecation of these agents, which would start a three-year clock until they're no longer supported. Currently we're planning to announce retirement for LAD and WAD in September of 2023 (subject to change) which would mean end of life in September 2026.

### Will there be a similar configuration experience as the WAD and LAD for AMA?

TBD - The configuration and control plane experience will be Data Collection Rules for AMA. The end UX is still being researched. Product group would appreciate any input on this in the [feedback form](#questions-and-feedback).

### Will you still be actively developing on WAD and LAD?

WAD and LAD will only be getting security/patches going forward. Most engineering funding has gone to the Azure Monitoring Agent. We highly recommend migrating to the Azure Monitoring Agent to benefit from all its awesome capabilities.

## See also

- For more information on creating a data collection rule, see [Collect events and performance counters from virtual machines with Azure Monitor Agent](./data-collection-rule-azure-monitor-agent.md).