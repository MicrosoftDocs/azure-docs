---
title: Azure Monitor edge pipeline configuration file
description: Azure Monitor edge pipeline configuration file
ms.topic: conceptual
ms.date: 11/14/2023
ms.author: bwren
author: bwren
---

# Azure Monitor edge pipeline configuration files


## DCR





```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "location": {
            "type": "string"
        },
        "clusterId": {
            "type": "string"
        },
        "clusterExtensionIds": {
            "type": "array"
        },
        "customLocationName": {
            "type": "string"
        },
        "pipelineExtensionName": {
            "type": "string"
        },
        "pipelineGroupName": {
            "type": "string"
        },
        "tagsByResource": {
            "type": "object",
            "defaultValue": {}
        },
        "tableInfo": {
            "type": "array",
            "defaultValue": []
        }
    },
    "resources": [
        {
            "apiVersion": "2017-03-15-preview",
            "name": "DefaultWorkspace-westus2",
            "location": "[parameters('location')]",
            "tags": "[ if(contains(parameters('tagsByResource'), 'Microsoft.OperationalInsights/workspaces'), parameters('tagsByResource')['Microsoft.OperationalInsights/workspaces'], json('{}')) ]",
            "type": "Microsoft.OperationalInsights/workspaces",
            "properties": {
                "sku": {
                    "name": "pergb2018"
                }
            }
        },
        {
            "location": "[parameters('location')]",
            "tags": "[ if(contains(parameters('tagsByResource'), 'Microsoft.Insights/dataCollectionEndpoints'), parameters('tagsByResource')['Microsoft.Insights/dataCollectionEndpoints'], json('{}')) ]",
            "name": "Aep-mytestpl-ZZPXiU05tJ",
            "type": "Microsoft.Insights/dataCollectionEndpoints",
            "apiVersion": "2021-04-01",
            "properties": {
                "configurationAccess": {},
                "logsIngestion": {},
                "networkAcls": {
                    "publicNetworkAccess": "Enabled"
                }
            }
        },
        {
            "type": "Microsoft.Insights/dataCollectionRules",
            "apiVersion": "2021-09-01-preview",
            "name": "Aep-mytestpl-ZZPXiU05tJ",
            "location": "[parameters('location')]",
            "dependsOn": [
                "[resourceId('Microsoft.OperationalInsights/workspaces', 'DefaultWorkspace-westus2')]",
                "[resourceId('Microsoft.Insights/dataCollectionEndpoints', 'Aep-mytestpl-ZZPXiU05tJ')]"
            ],
            "tags": "[ if(contains(parameters('tagsByResource'), 'Microsoft.Insights/dataCollectionRules'), parameters('tagsByResource')['Microsoft.Insights/dataCollectionRules'], json('{}')) ]",
            "properties": {
                "dataCollectionEndpointId": "[resourceId('Microsoft.Insights/dataCollectionEndpoints', 'Aep-mytestpl-ZZPXiU05tJ')]",
                "streamDeclarations": {
                    "Custom-DefaultAEPOTelLogs_CL-FqXSu6GfRF": {
                        "columns": [
                            {
                                "name": "Body",
                                "type": "string"
                            },
                            {
                                "name": "TimeGenerated",
                                "type": "datetime"
                            },
                            {
                                "name": "SeverityText",
                                "type": "string"
                            }
                        ]
                    }
                },
                "dataSources": {},
                "destinations": {
                    "logAnalytics": [
                        {
                            "workspaceResourceId": "[resourceId('Microsoft.OperationalInsights/workspaces', 'DefaultWorkspace-westus2')]",
                            "workspaceId": "[reference(resourceId('Microsoft.OperationalInsights/workspaces', 'DefaultWorkspace-westus2'))].customerId",
                            "name": "localDest-DefaultWorkspace-westus2"
                        }
                    ]
                },
                "dataFlows": [
                    {
                        "streams": [
                            "Custom-DefaultAEPOTelLogs_CL-FqXSu6GfRF"
                        ],
                        "destinations": [
                            "localDest-DefaultWorkspace-westus2"
                        ],
                        "transformKql": "source",
                        "outputStream": "Custom-DefaultAEPOTelLogs_CL"
                    }
                ]
            }
        },
        {
            "type": "Microsoft.KubernetesConfiguration/extensions",
            "apiVersion": "2022-11-01",
            "name": "[parameters('pipelineExtensionName')]",
            "scope": "[parameters('clusterId')]",
            "tags": "[ if(contains(parameters('tagsByResource'), 'Microsoft.KubernetesConfiguration/extensions'), parameters('tagsByResource')['Microsoft.KubernetesConfiguration/extensions'], json('{}')) ]",
            "identity": {
                "type": "SystemAssigned"
            },
            "properties": {
                "aksAssignedIdentity": {
                    "type": "SystemAssigned"
                },
                "autoUpgradeMinorVersion": false,
                "extensionType": "microsoft.monitor.pipelinecontroller",
                "releaseTrain": "preview",
                "scope": {
                    "cluster": {
                        "releaseNamespace": "my-strato-ns"
                    }
                },
                "version": "0.37.3-privatepreview"
            }
        },
        {
            "type": "Microsoft.ExtendedLocation/customLocations",
            "apiVersion": "2021-08-15",
            "name": "[parameters('customLocationName')]",
            "location": "[parameters('location')]",
            "tags": "[ if(contains(parameters('tagsByResource'), 'Microsoft.ExtendedLocation/customLocations'), parameters('tagsByResource')['Microsoft.ExtendedLocation/customLocations'], json('{}')) ]",
            "dependsOn": [
                "[parameters('pipelineExtensionName')]"
            ],
            "properties": {
                "hostResourceId": "[parameters('clusterId')]",
                "namespace": "[toLower(parameters('customLocationName'))]",
                "clusterExtensionIds": "[parameters('clusterExtensionIds')]",
                "hostType": "Kubernetes"
            }
        },
        {
            "type": "Microsoft.monitor/pipelineGroups",
            "location": "[parameters('location')]",
            "apiVersion": "2023-10-01-preview",
            "name": "[parameters('pipelineGroupName')]",
            "tags": "[ if(contains(parameters('tagsByResource'), 'Microsoft.monitor/pipelineGroups'), parameters('tagsByResource')['Microsoft.monitor/pipelineGroups'], json('{}')) ]",
            "dependsOn": [
                "[parameters('customLocationName')]",
                "[resourceId('Microsoft.Insights/dataCollectionRules','Aep-mytestpl-ZZPXiU05tJ')]"
            ],
            "extendedLocation": {
                "name": "[resourceId('Microsoft.ExtendedLocation/customLocations', parameters('customLocationName'))]",
                "type": "CustomLocation"
            },
            "properties": {
                "receivers": [
                    {
                        "type": "OTLP",
                        "name": "receiver-OTLP-4317",
                        "otlp": {
                            "endpoint": "0.0.0.0:4317"
                        }
                    },
                    {
                        "type": "Syslog",
                        "name": "receiver-Syslog-514",
                        "syslog": {
                            "endpoint": "0.0.0.0:514"
                        }
                    }
                ],
                "processors": [],
                "exporters": [
                    {
                        "type": "AzureMonitorWorkspaceLogs",
                        "name": "exporter-lu7mbr90",
                        "azureMonitorWorkspaceLogs": {
                            "api": {
                                "dataCollectionEndpointUrl": "[reference(resourceId('Microsoft.Insights/dataCollectionEndpoints','Aep-mytestpl-ZZPXiU05tJ')).logsIngestion.endpoint]",
                                "stream": "Custom-DefaultAEPOTelLogs_CL-FqXSu6GfRF",
                                "dataCollectionRule": "[reference(resourceId('Microsoft.Insights/dataCollectionRules', 'Aep-mytestpl-ZZPXiU05tJ')).immutableId]",
                                "schema": {
                                    "recordMap": [
                                        {
                                            "from": "body",
                                            "to": "Body"
                                        },
                                        {
                                            "from": "severity_text",
                                            "to": "SeverityText"
                                        },
                                        {
                                            "from": "time_unix_nano",
                                            "to": "TimeGenerated"
                                        }
                                    ]
                                }
                            }
                        }
                    }
                ],
                "service": {
                    "pipelines": [
                        {
                            "name": "DefaultOTLPLogs",
                            "receivers": [
                                "receiver-OTLP-4317"
                            ],
                            "processors": [],
                            "exporters": [
                                "exporter-lu7mbr90"
                            ]
                        }
                    ]
                }
            }
        }
    ],
    "outputs": {}
}

```
