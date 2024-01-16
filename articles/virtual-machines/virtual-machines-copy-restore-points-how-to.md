---
title: Copy VM restore points to another region
description: Learn how to copy virtual machine (VM) restore points to another region.
author: aarthiv
ms.author: aarthiv
ms.service: virtual-machines
ms.subservice: recovery
ms.topic: tutorial
ms.date: 10/31/2023
ms.custom: template-tutorial
---

# Cross-region copy of VM restore points

In this article, you learn how to copy virtual machine (VM) restore points to another region.

## Prerequisites

To copy a restore point across a region, you need to precreate a `restorePointCollection` resource in the target region.

Learn more about [cross-region copy and its limitation](virtual-machines-restore-points-copy.md) before you copy restore points.

### Create a restore point collection in a target region

The first step in copying an existing VM restore point from one region to another is to create a `restorePointCollection` resource in the target region by referencing `restorePointCollection` from the source region.

#### URI request

```
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/restorePointCollections/{restorePointCollectionName}&api-version={api-version}
```

#### Request body

```
{
    "name": "name of target restorePointCollection resource",
    "location": "location of target restorePointCollection resource",    
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

The request response includes a status code and a set of response headers.

##### Status code

The operation returns 201 during creation and 200 during the update.

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

### Create a VM restore point in a target region

The next step is to trigger the copy of a restore point in the target `RestorePointCollection` resource by referencing the restore point in the source region that needs to be copied.

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

> [!NOTE]
> The location of `sourceRestorePoint` is inferred from that of the source `RestorePointCollection`.

#### Response

The request response includes a status code and a set of response headers.

##### Status code

This operation is long running, so the operation returns 201 during creation. The client is expected to poll for the status by using the operation. Both the `location` and `Azure-AsyncOperation` headers are provided for this purpose.

During restore point creation, `ProvisioningState` appears as `Creating` in the GET restore point API response. If creation fails, `ProvisioningState` appears as `Failed`. `ProvisioningState` is set to `Succeeded` when the data copy across regions is initiated.

> [!NOTE]
> You can track the copy status by calling GET instance view (`?$expand=instanceView`) on the target VM restore point. For steps on how to do this, see the section "Get the VM restore points Copy/Replication status." The VM restore point is considered usable (can be used to restore a VM) only when a copy of all the disk restore points are successful.

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

### Get the VM restore points Copy/Replication status

After the copy of VM restore points is initiated, you can track the copy status by calling the GET instance view (`?$expand=instanceView`) on the target VM restore point.

#### URI request

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
- [Learn more](backup-recovery.md) about backup and restore options for VMs in Azure.
