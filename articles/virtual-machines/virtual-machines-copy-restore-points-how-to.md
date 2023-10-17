---
title: Using Cross region copy of Virtual Machine Restore Points
description: Using Cross region copy of Virtual Machine Restore Points
author: aarthiv
ms.author: aarthiv
ms.service: virtual-machines
ms.subservice: recovery
ms.topic: tutorial
ms.date: 10/17/2023
ms.custom: template-tutorial
---

# Cross-region copy of VM Restore Points

## Prerequisites

For copying a RestorePoint across region, you need to pre-create a RestorePoint in the target region.
Learn more about [cross region copy and its limitation](virtual-machines-copy-restore-points-copy.md) before copying a restore points.

### Create Restore Point Collection in target region

First step in copying an existing VM Restore point from one region to another is to create a RestorePointCollection in the target region by referencing the RestorePointCollection from the source region.

#### URI Request

```
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/restorePointCollections/{restorePointCollectionName}&api-version={api-version}
```

#### Request Body

```
{
    "name": "name of the copy of restorePointCollection resource",
    "location": "location of the copy of the restorePointCollection resource",    
    "tags": {
        "department": "finance"
    },
    "properties": {
         "source": {
               "id": "/subscriptions/{subid}/resourceGroups/{resourceGroupName}/providers/microsoft.compute/restorePointCollections/{restorePointCollectionName}"
         }
    }
}
```

#### Response
The request response will include a status code and set of response headers.

##### Status code
The operation returns a 201 during create and 200 during Update.

##### Response body

```
{
    "name": "name of the copied restorePointCollection resource",
    "id": "CSM Id of copied restorePointCollection resource",
    "type": "Microsoft.Compute/restorePointCollections",
    "location": "location of the copied restorePointCollection resource",
    "tags": {
        "department": "finance"
    },
    "properties": {
        "source": {
            "id": "/subscriptions/{subid}/resourceGroups/{resourceGroupName}/providers/microsoft.compute/restorePointCollections/{restorePointCollectionName}",
            "location": "location of source RPC"
        }
    }
}
```

### Create VM Restore Point in Target Region
Next step is to trigger creation of a RestorePoint in the target RestorePointCollection referencing the RestorePoint in the source region that needs to be copied.

#### URI request

```
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/restorePointCollections/{restorePointCollectionName}/restorePoints/{restorePointName}&api-version={api-version}
```

#### Request body

```
{
    "name": "name of the restore point resource",
    "properties": {
        "sourceRestorePoint": {
            "id": "/subscriptions/{subid}/resourceGroups/{resourceGroupName}/providers/microsoft.compute/restorePointCollections/{restorePointCollectionName}/restorePoints/{restorePointName}"
        }
    }
}
```

**NOTE:** Location of the sourceRestorePoint would be inferred from that of the source RestorePointCollection

#### Response
The request response will include a status code and set of response headers. 

##### Status Code
This is a long running operation; hence the operation returns a 201 during create. The client is expected to poll for the status using the operation. (Both the Location and Azure-AsyncOperation headers are provided for this purpose.) 

During restore point creation, the ProvisioningState would appear as Creating in GET restore point API response. If creation fails, its ProvisioningState will be Failed. ProvisioningState would be set to Succeeded when the data copy across regions is initiated. 

**NOTE:** You can track the copy status by calling GET instance View (?$expand=instanceView) on the target VM Restore Point. Please check the "Get VM Restore Points Copy/Replication Status" section below on how to do this. VM Restore Point is considered usable (can be used to restore a VM) only when copy of all the disk restore points are successful.

##### Response body

```
{
    "id": "CSM Id of the restore point",
    "name": "name of the restore point",
    "properties": {
        "optionalProperties": "opaque bag of properties to be passed to extension",
        "sourceRestorePoint": {
            "id": "/subscriptions/{subid}/resourceGroups/{resourceGroupName}/providers/microsoft.compute/restorePointCollections/{restorePointCollectionName}/restorePoints/{restorePointName}"
        },
        "consistencyMode": "CrashConsistent | FileSystemConsistent | ApplicationConsistent",
        "sourceMetadata": {
            "vmId": "Unique Guid of the VM from which the restore point was created",
            "location": "source VM location",
            "hardwareProfile": {
                "vmSize": "Standard_A1"
            },
            "osProfile": {
                "computername": "",
                "adminUsername": "",
                "secrets": [
                    {
                        "sourceVault": {
                            "id": "/subscriptions/<subId>/resourceGroups/<rgName>/providers/Microsoft.KeyVault/vaults/<keyvault-name>"
                        },
                        "vaultCertificates": [
                            {
                                "certificateUrl": "https://<keyvault-name>.vault.azure.net/secrets/<secret-name>/<secret-version>",
                                "certificateStore": "certificateStoreName on Windows"
                            }
                        ]
                    }
                ],
                "customData": "",
                "windowsConfiguration": {
                    "provisionVMAgent": "true|false",
                    "winRM": {
                        "listeners": [
                            {
                                "protocol": "http"
                            },
                            {
                                "protocol": "https",
                                "certificateUrl": ""
                            }
                        ]
                    },
                    "additionalUnattendContent": [
                        {
                            "pass": "oobesystem",
                            "component": "Microsoft-Windows-Shell-Setup",
                            "settingName": "FirstLogonCommands|AutoLogon",
                            "content": "<XML unattend content>"
                        }
                    ],
                    "enableAutomaticUpdates": "true|false"
                },
                "linuxConfiguration": {
                    "disablePasswordAuthentication": "true|false",
                    "ssh": {
                        "publicKeys": [
                            {
                                "path": "Path-Where-To-Place-Public-Key-On-VM",
                                "keyData": "PEM-Encoded-public-key-file"
                            }
                        ]
                    }
                }
            },
            "storageProfile": {
                "osDisk": {
                    "osType": "Windows|Linux",
                    "name": "OSDiskName",
                    "diskSizeGB": "10",
                    "caching": "ReadWrite",
                    "managedDisk": {
                        "id": "CSM Id of the managed disk",
                        "storageAccountType": "Standard_LRS"
                    },
                    "diskRestorePoint": {
                        "id": "/subscriptions/<subId>/resourceGroups/<rgName>/restorePointCollections/<rpcName>/restorePoints/<rpName>/diskRestorePoints/<diskRestorePointName>"
                    }
                },
                "dataDisks": [
                    {
                        "lun": "0",
                        "name": "datadisk0",
                        "diskSizeGB": "10",
                        "caching": "ReadWrite",
                        "managedDisk": {
                            "id": "CSM Id of the managed disk",
                            "storageAccountType": "Standard_LRS"
                        },
                        "diskRestorePoint": {
                            "id": "/subscriptions/<subId>/resourceGroups/<rgName>/restorePointCollections/<rpcName>/restorePoints/<rpName>/diskRestorePoints/<diskRestorePointName>"
                        }
                    }
                ]
            },
            "diagnosticsProfile": {
                "bootDiagnostics": {
                    "enabled": true,
                    "storageUri": " http://storageaccount.blob.core.windows.net/"
                }
            }
        },
        "provisioningState": "Succeeded | Failed | Creating | Deleting",
        "provisioningDetails": {
            "creationTime": "Creation Time of Restore point in UTC"
        }
    }
}
```

### Get VM Restore Points Copy/Replication Status
Once copy of VM Restore Points is initiated, you can track the copy status by calling GET instance View (?$expand=instanceView) on the target VM Restore Point.

#### URI Request

```
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/restorePointCollections/{restorePointCollectionName}/restorePoints/{restorePointName}?$expand=instanceView&api-version={api-version}
```

#### Response

```
{
    "id": "CSM Id of the restore point",
    "name": "name of the restore point",
    "properties": {
        "optionalProperties": "opaque bag of properties to be passed to extension",
        "sourceRestorePoint": {
            "id": "/subscriptions/{subid}/resourceGroups/{resourceGroupName}/providers/microsoft.compute/restorePointCollections/{restorePointCollectionName}/restorePoints/{restorePointName}"
        },
        "consistencyMode": "CrashConsistent | FileSystemConsistent | ApplicationConsistent",
        "sourceMetadata": {
            "vmId": "Unique Guid of the VM from which the restore point was created",
            "location": "source VM location",
            "hardwareProfile": {
                "vmSize": "Standard_A1"
            },
            "osProfile": {
                "computername": "",
                "adminUsername": "",
                "secrets": [
                    {
                        "sourceVault": {
                            "id": "/subscriptions/<subId>/resourceGroups/<rgName>/providers/Microsoft.KeyVault/vaults/<keyvault-name>"
                        },
                        "vaultCertificates": [
                            {
                                "certificateUrl": "https://<keyvault-name>.vault.azure.net/secrets/<secret-name>/<secret-version>",
                                "certificateStore": "certificateStoreName on Windows"
                            }
                        ]
                    }
                ],
                "customData": "",
                "windowsConfiguration": {
                    "provisionVMAgent": "true|false",
                    "winRM": {
                        "listeners": [
                            {
                                "protocol": "http"
                            },
                            {
                                "protocol": "https",
                                "certificateUrl": ""
                            }
                        ]
                    },
                    "additionalUnattendContent": [
                        {
                            "pass": "oobesystem",
                            "component": "Microsoft-Windows-Shell-Setup",
                            "settingName": "FirstLogonCommands|AutoLogon",
                            "content": "<XML unattend content>"
                        }
                    ],
                    "enableAutomaticUpdates": "true|false"
                },
                "linuxConfiguration": {
                    "disablePasswordAuthentication": "true|false",
                    "ssh": {
                        "publicKeys": [
                            {
                                "path": "Path-Where-To-Place-Public-Key-On-VM",
                                "keyData": "PEM-Encoded-public-key-file"
                            }
                        ]
                    }
                }
            },
            "storageProfile": {
                "osDisk": {
                    "osType": "Windows|Linux",
                    "name": "OSDiskName",
                    "diskSizeGB": "10",
                    "caching": "ReadWrite",
                    "managedDisk": {
                        "id": "CSM Id of the managed disk",
                        "storageAccountType": "Standard_LRS"
                    },
                    "diskRestorePoint": {
                        "id": "/subscriptions/<subId>/resourceGroups/<rgName>/restorePointCollections/<rpcName>/restorePoints/<rpName>/diskRestorePoints/<diskRestorePointName>"
                    }
                },
                "dataDisks": [
                    {
                        "lun": "0",
                        "name": "datadisk0",
                        "diskSizeGB": "10",
                        "caching": "ReadWrite",
                        "managedDisk": {
                            "id": "CSM Id of the managed disk",
                            "storageAccountType": "Standard_LRS"
                        },
                        "diskRestorePoint": {
                            "id": "/subscriptions/<subId>/resourceGroups/<rgName>/restorePointCollections/<rpcName>/restorePoints/<rpName>/diskRestorePoints/<diskRestorePointName>"
                        }
                    }
                ]
            },
            "diagnosticsProfile": {
                "bootDiagnostics": {
                    "enabled": true,
                    "storageUri": " http://storageaccount.blob.core.windows.net/"
                }
            }
        },
        "provisioningState": "Succeeded | Failed | Creating | Deleting",
        "provisioningDetails": {
            "creationTime": "Creation Time of Restore point in UTC"
        },
        "instanceView": {
            "statuses": [
                {
                    "code": "ReplicationState/succeeded",
                    "level": "Info",
                    "displayStatus": "Replication succeeded"
                }
            ],
            "diskRestorePoints": [
                {
                    "id": "<diskRestorePoint Arm Id>",
                    "replicationStatus": {
                        "status": {
                            "code": "ReplicationState/succeeded",
                            "level": "Info",
                            "displayStatus": "Replication succeeded"
                        },
                        "completionPercent": "<completion percentage of the replication>"
                    }
                }
            ]
        }
    }
}
```

## Next steps

- [Create a VM restore point](create-restore-points.md).
- [Learn more](backup-recovery.md) about Backup and restore options for virtual machines in Azure.
