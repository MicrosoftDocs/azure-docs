---
title: Script sample - Create a data collection rule in change tracking.
description: Learn about how to create a data collection rule
ms.topic: sample
ms.date: 06/28/2023
author: SnehaSudhirG
ms.author: sudhirsneha
---


# JSON script to create a data collection rule

This script helps you to create a data collection rule in Change tracking and inventory.

## Sample script

```json
{
    "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "dataCollectionRuleName": {
            "type": "string",
            "metadata": {
                "description": "Specifies the name of the data collection rule to create."
            },
            "defaultValue": "Microsoft-CT-DCR"
        },
        "workspaceResourceId": {
            "type": "string",
            "metadata": {
                "description": "Specifies the Azure resource ID of the Log Analytics workspace to use to store change tracking data."
            }
        }
    },
    "variables": {
        "subscriptionId": "[substring(parameters('workspaceResourceId'), 15, sub(indexOf(parameters('workspaceResourceId'), '/resourceGroups/'), 15))]",
        "resourceGroupName": "[substring(parameters('workspaceResourceId'), add(indexOf(parameters('workspaceResourceId'), '/resourceGroups/'), 16), sub(sub(indexOf(parameters('workspaceResourceId'), '/providers/'), indexOf(parameters('workspaceResourceId'), '/resourceGroups/')),16))]",
        "workspaceName": "[substring(parameters('workspaceResourceId'), add(lastIndexOf(parameters('workspaceResourceId'), '/'), 1), sub(length(parameters('workspaceResourceId')), add(lastIndexOf(parameters('workspaceResourceId'), '/'), 1)))]"
    },
    "resources": [
        {
            "type": "microsoft.resources/deployments",
            "name": "get-workspace-region",
            "apiVersion": "2020-08-01",
            "properties": {
                "mode": "Incremental",
                "template": {
                    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
                    "contentVersion": "1.0.0.0",
                    "resources": [],
                    "outputs": {
                        "workspaceLocation": {
                            "type": "string",
                            "value": "[reference(parameters('workspaceResourceId'), '2020-08-01', 'Full').location]"
                        }
                    }
                }
            }
        },
        {
            "type": "microsoft.resources/deployments",
            "name": "CtDcr-Deployment",
            "apiVersion": "2020-08-01",
            "properties": {
                "mode": "Incremental",
                "parameters": {
                    "workspaceRegion": {
                        "value": "[reference('get-workspace-region').outputs.workspaceLocation.value]"
                    }
                },
                "template": {
                    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
                    "contentVersion": "1.0.0.0",
                    "parameters": {
                        "workspaceRegion": {
                            "type": "string"
                        }
                    },
                    "resources": [
                        {
                            "type": "Microsoft.Insights/dataCollectionRules",
                            "apiVersion": "2021-04-01",
                            "name": "[parameters('dataCollectionRuleName')]",
                            "location": "[[parameters('workspaceRegion')]",
                            "properties": {
                                "description": "Data collection rule for CT.",
                                "dataSources": {
                                    "extensions": [
                                        {
                                            "streams": [
                                                "Microsoft-ConfigurationChange",
                                                "Microsoft-ConfigurationChangeV2",
                                                "Microsoft-ConfigurationData"
                                            ],
                                            "extensionName": "ChangeTracking-Windows",
                                            "extensionSettings": {
                                                "enableFiles": true,
                                                "enableSoftware": true,
                                                "enableRegistry": true,
                                                "enableServices": true,
                                                "enableInventory": true,
                                                "registrySettings": {
                                                    "registryCollectionFrequency": 3000,
                                                    "registryInfo": [
                                                        {
                                                            "name": "Registry_1",
                                                            "groupTag": "Recommended",
                                                            "enabled": false,
                                                            "recurse": true,
                                                            "description": "",
                                                            "keyName": "HKEY_LOCAL_MACHINE\\Software\\Microsoft\\Windows\\CurrentVersion\\Group Policy\\Scripts\\Startup",
                                                            "valueName": ""
                                                        },
                                                        {
                                                            "name": "Registry_2",
                                                            "groupTag": "Recommended",
                                                            "enabled": false,
                                                            "recurse": true,
                                                            "description": "",
                                                            "keyName": "HKEY_LOCAL_MACHINE\\Software\\Microsoft\\Windows\\CurrentVersion\\Group Policy\\Scripts\\Shutdown",
                                                            "valueName": ""
                                                        },
                                                        {
                                                            "name": "Registry_3",
                                                            "groupTag": "Recommended",
                                                            "enabled": false,
                                                            "recurse": true,
                                                            "description": "",
                                                            "keyName": "HKEY_LOCAL_MACHINE\\SOFTWARE\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Run",
                                                            "valueName": ""
                                                        },
                                                        {
                                                            "name": "Registry_4",
                                                            "groupTag": "Recommended",
                                                            "enabled": false,
                                                            "recurse": true,
                                                            "description": "",
                                                            "keyName": "HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Active Setup\\Installed Components",
                                                            "valueName": ""
                                                        },
                                                        {
                                                            "name": "Registry_5",
                                                            "groupTag": "Recommended",
                                                            "enabled": false,
                                                            "recurse": true,
                                                            "description": "",
                                                            "keyName": "HKEY_LOCAL_MACHINE\\Software\\Classes\\Directory\\ShellEx\\ContextMenuHandlers",
                                                            "valueName": ""
                                                        },
                                                        {
                                                            "name": "Registry_6",
                                                            "groupTag": "Recommended",
                                                            "enabled": false,
                                                            "recurse": true,
                                                            "description": "",
                                                            "keyName": "HKEY_LOCAL_MACHINE\\Software\\Classes\\Directory\\Background\\ShellEx\\ContextMenuHandlers",
                                                            "valueName": ""
                                                        },
                                                        {
                                                            "name": "Registry_7",
                                                            "groupTag": "Recommended",
                                                            "enabled": false,
                                                            "recurse": true,
                                                            "description": "",
                                                            "keyName": "HKEY_LOCAL_MACHINE\\Software\\Classes\\Directory\\Shellex\\CopyHookHandlers",
                                                            "valueName": ""
                                                        },
                                                        {
                                                            "name": "Registry_8",
                                                            "groupTag": "Recommended",
                                                            "enabled": false,
                                                            "recurse": true,
                                                            "description": "",
                                                            "keyName": "HKEY_LOCAL_MACHINE\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\ShellIconOverlayIdentifiers",
                                                            "valueName": ""
                                                        },
                                                        {
                                                            "name": "Registry_9",
                                                            "groupTag": "Recommended",
                                                            "enabled": false,
                                                            "recurse": true,
                                                            "description": "",
                                                            "keyName": "HKEY_LOCAL_MACHINE\\Software\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Explorer\\ShellIconOverlayIdentifiers",
                                                            "valueName": ""
                                                        },
                                                        {
                                                            "name": "Registry_10",
                                                            "groupTag": "Recommended",
                                                            "enabled": false,
                                                            "recurse": true,
                                                            "description": "",
                                                            "keyName": "HKEY_LOCAL_MACHINE\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Browser Helper Objects",
                                                            "valueName": ""
                                                        },
                                                        {
                                                            "name": "Registry_11",
                                                            "groupTag": "Recommended",
                                                            "enabled": false,
                                                            "recurse": true,
                                                            "description": "",
                                                            "keyName": "HKEY_LOCAL_MACHINE\\Software\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Browser Helper Objects",
                                                            "valueName": ""
                                                        },
                                                        {
                                                            "name": "Registry_12",
                                                            "groupTag": "Recommended",
                                                            "enabled": false,
                                                            "recurse": true,
                                                            "description": "",
                                                            "keyName": "HKEY_LOCAL_MACHINE\\Software\\Microsoft\\Internet Explorer\\Extensions",
                                                            "valueName": ""
                                                        },
                                                        {
                                                            "name": "Registry_13",
                                                            "groupTag": "Recommended",
                                                            "enabled": false,
                                                            "recurse": true,
                                                            "description": "",
                                                            "keyName": "HKEY_LOCAL_MACHINE\\Software\\Wow6432Node\\Microsoft\\Internet Explorer\\Extensions",
                                                            "valueName": ""
                                                        },
                                                        {
                                                            "name": "Registry_14",
                                                            "groupTag": "Recommended",
                                                            "enabled": false,
                                                            "recurse": true,
                                                            "description": "",
                                                            "keyName": "HKEY_LOCAL_MACHINE\\Software\\Microsoft\\Windows NT\\CurrentVersion\\Drivers32",
                                                            "valueName": ""
                                                        },
                                                        {
                                                            "name": "Registry_15",
                                                            "groupTag": "Recommended",
                                                            "enabled": false,
                                                            "recurse": true,
                                                            "description": "",
                                                            "keyName": "HKEY_LOCAL_MACHINE\\Software\\Wow6432Node\\Microsoft\\Windows NT\\CurrentVersion\\Drivers32",
                                                            "valueName": ""
                                                        },
                                                        {
                                                            "name": "Registry_16",
                                                            "groupTag": "Recommended",
                                                            "enabled": false,
                                                            "recurse": true,
                                                            "description": "",
                                                            "keyName": "HKEY_LOCAL_MACHINE\\System\\CurrentControlSet\\Control\\Session Manager\\KnownDlls",
                                                            "valueName": ""
                                                        },
                                                        {
                                                            "name": "Registry_17",
                                                            "groupTag": "Recommended",
                                                            "enabled": false,
                                                            "recurse": true,
                                                            "description": "",
                                                            "keyName": "HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon\\Notify",
                                                            "valueName": ""
                                                        }
                                                    ]
                                                },
                                                "fileSettings": {
                                                    "fileCollectionFrequency": 2700
                                                },
                                                "softwareSettings": {
                                                    "softwareCollectionFrequency": 1800
                                                },
                                                "inventorySettings": {
                                                    "inventoryCollectionFrequency": 36000
                                                },
                                                "servicesSettings": {
                                                    "serviceCollectionFrequency": 1800
                                                }
                                            },
                                            "name": "CTDataSource-Windows"
                                        },
                                        {
                                            "streams": [
                                                "Microsoft-ConfigurationChange",
                                                "Microsoft-ConfigurationChangeV2",
                                                "Microsoft-ConfigurationData"
                                            ],
                                            "extensionName": "ChangeTracking-Linux",
                                            "extensionSettings": {
                                                "enableFiles": true,
                                                "enableSoftware": true,
                                                "enableRegistry": false,
                                                "enableServices": true,
                                                "enableInventory": true,
                                                "fileSettings": {
                                                    "fileCollectionFrequency": 900,
                                                    "fileInfo": [
                                                        {
                                                            "name": "ChangeTrackingLinuxPath_default",
                                                            "enabled": true,
                                                            "destinationPath": "/etc/.*.conf",
                                                            "useSudo": true,
                                                            "recurse": true,
                                                            "maxContentsReturnable": 5000000,
                                                            "pathType": "File",
                                                            "type": "File",
                                                            "links": "Follow",
                                                            "maxOutputSize": 500000,
                                                            "groupTag": "Recommended"
                                                        }
                                                    ]
                                                },
                                                "softwareSettings": {
                                                    "softwareCollectionFrequency": 300
                                                },
                                                "inventorySettings": {
                                                    "inventoryCollectionFrequency": 36000
                                                },
                                                "servicesSettings": {
                                                    "serviceCollectionFrequency": 300
                                                }
                                            },
                                            "name": "CTDataSource-Linux"
                                        }
                                    ]
                                },
                                "destinations": {
                                    "logAnalytics": [
                                        {
                                            "workspaceResourceId": "[parameters('workspaceResourceId')]",
                                            "name": "Microsoft-CT-Dest"
                                        }
                                    ]
                                },
                                "dataFlows": [
                                    {
                                        "streams": [
                                            "Microsoft-ConfigurationChange",
                                            "Microsoft-ConfigurationChangeV2",
                                            "Microsoft-ConfigurationData"
                                        ],
                                        "destinations": [
                                            "Microsoft-CT-Dest"
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            "type": "Microsoft.OperationsManagement/solutions",
                            "name": "[Concat('ChangeTracking', '(', variables('workspaceName'), ')')]",
                            "location": "[[parameters('workspaceRegion')]",
                            "apiVersion": "2015-11-01-preview",
                            "id": "[Concat('/subscriptions/', variables('subscriptionId'), '/resourceGroups/', variables('resourceGroupName'), '/providers/Microsoft.OperationsManagement/solutions/ChangeTracking', '(', variables('workspaceName'), ')')]",
                            "properties": {
                                "workspaceResourceId": "[parameters('workspaceResourceId')]"
                            },
                            "plan": {
                                "name": "[Concat('ChangeTracking', '(', variables('workspaceName'), ')')]",
                                "product": "OMSGallery/ChangeTracking",
                                "promotionCode": "",
                                "publisher": "Microsoft"
                            }
                        }
                    ]
                }
            }
        }
    ]
}
```

## Execute the script

Save the above script on your machine with a name as *CtDcrCreation.json*. For more information, see [Enable Change Tracking and Inventory using Azure Monitoring Agent (Preview)](enable-vms-monitoring-agent.md#enable-change-tracking-at-scale-using-azure-monitoring-agent).

> [!NOTE]
> A reference JSON script to configure windows file settings:
> ```json
> "fileSettings": {
>        "fileCollectionFrequency": 2700,
>        "fileinfo": [
>            {
>               "name": "ChangeTrackingCustomPath_witems1",
>               "enabled": true,
>                "description": "",
>              "path": "D:\\testing\\*",
>               "recurse": true,
>               "maxContentsReturnable": 5000000,
>               "maxOutputSize": 500000,
>               "checksum": "sha256",
>               "pathType": "File",
>              "groupTag": "Custom"
>            },
>            {
>              "name": "ChangeTrackingCustomPath_witems2",
>               "enabled": true,
>             "description": "",
>               "path": "E:\\test1",
>              "recurse": false,
>              "maxContentsReturnable": 5000000,
>               "maxOutputSize": 500000,
>              "checksum": "sha256",
>               "pathType": "File",
>              "groupTag": "Custom"
>           }
>       ]
>   }
>```

## Next steps

[Learn more](manage-change-tracking-monitoring-agent.md) on Manage change tracking and inventory using Azure Monitoring Agent (Preview).
 