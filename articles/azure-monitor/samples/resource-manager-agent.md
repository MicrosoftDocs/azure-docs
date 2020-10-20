---
title: Resource Manager template samples for agents
description: Sample Azure Resource Manager templates to deploy and configure Log Analytics agent and diagnostic extension in Azure Monitor.
ms.subservice: logs
ms.topic: sample
author: bwren
ms.author: bwren
ms.date: 05/18/2020

---

# Resource Manager template samples for agents in Azure Monitor
This article includes sample [Azure Resource Manager templates](../../azure-resource-manager/templates/template-syntax.md) to deploy and configure the [Log Analytics agent](../platform/log-analytics-agent.md) and [diagnostic extension](../platform/diagnostics-extension-overview.md) for virtual machines in Azure Monitor. Each sample includes a template file and a parameters file with sample values to provide to the template.

[!INCLUDE [azure-monitor-samples](../../../includes/azure-monitor-resource-manager-samples.md)]


## Windows Log Analytics agent
The following sample installs the Log Analytics agent on a Windows Azure virtual machine. This is done by enabling the [Log Analytics virtual machine extension for Windows](../../virtual-machines/extensions/oms-windows.md).

### Template file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "vmName": {
      "type": "string",
      "metadata": {
        "description": "Name of the virtual machine."
      }
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": {
        "description": "Location of the virtual machine"
      }
    },
    "workspaceId": {
      "type": "string",
      "metadata": {
        "description": "Id of the workspace."
      }
    },
    "workspaceKey": {
      "type": "string",
      "metadata": {
        "description": "Primary or secondary workspace key."
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.Compute/virtualMachines",
      "apiVersion": "2018-10-01",
      "name": "[parameters('vmName')]",
      "location": "[parameters('location')]",
      "resources": [
        {
            "type": "Microsoft.Compute/virtualMachines/extensions",
            "name": "[concat(parameters('vmName'), '/Microsoft.Insights.LogAnalyticsAgent')]",
            "apiVersion": "2015-06-15",
            "location": "[parameters('location')]",
            "dependsOn": [
                "[concat('Microsoft.Compute/virtualMachines/', parameters('vmName'))]"
            ],
            "properties": {
                "publisher": "Microsoft.EnterpriseCloud.Monitoring",
                "type": "MicrosoftMonitoringAgent",
                "typeHandlerVersion": "1.0",
                "autoUpgradeMinorVersion": true,
                "settings": {
                    "workspaceId": "[parameters('workspaceId')]"
                },
                "protectedSettings": {
                    "workspaceKey": "[parameters('workspaceKey')]"
                }
            }
        }
      ]
    }
  ]
}

```

### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
      "vmName": {
        "value": "my-windows-vm"
      },
      "location": {
        "value": "westus"
      },
      "workspaceId": {
        "value": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
      },
      "workspaceKey": {
        "value": "Tse-gj9CemT6A80urYa2hwtjvA5axv1xobXgKR17kbVdtacU6cEf+SNo2TdHGVKTsZHZd1W9QKRXfh+$fVY9dA=="
      }
  }
}
```


## Linux Log Analytics agent
The following sample installs the Log Analytics agent on a Linux Azure virtual machine. This is done by enabling the [Log Analytics virtual machine extension for Windows](../../virtual-machines/extensions/oms-linux.md).

### Template file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "vmName": {
      "type": "string",
      "metadata": {
        "description": "Name of the virtual machine."
      }
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": {
        "description": "Location of the virtual machine"
      }
    },
    "workspaceId": {
      "type": "string",
      "metadata": {
        "description": "Id of the workspace."
      }
    },
    "workspaceKey": {
      "type": "string",
      "metadata": {
        "description": "Primary or secondary workspace key."
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.Compute/virtualMachines",
      "apiVersion": "2018-10-01",
      "name": "[parameters('vmName')]",
      "location": "[parameters('location')]",
      "resources": [
        {
            "type": "Microsoft.Compute/virtualMachines/extensions",
            "name": "[concat(parameters('vmName'), '/Microsoft.Insights.LogAnalyticsAgent')]",
            "apiVersion": "2015-06-15",
            "location": "[parameters('location')]",
            "dependsOn": [
                "[concat('Microsoft.Compute/virtualMachines/', parameters('vmName'))]"
            ],
            "properties": {
                "publisher": "Microsoft.EnterpriseCloud.Monitoring",
                "type": "OmsAgentForLinux",
                "typeHandlerVersion": "1.7",
                "autoUpgradeMinorVersion": true,
                "settings": {
                    "workspaceId": "[parameters('workspaceId')]"
                },
                "protectedSettings": {
                    "workspaceKey": "[parameters('workspaceKey')]"
                }
            }
        }
      ]
    }
  ]
}
```

### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
      "vmName": {
        "value": "my-linux-vm"
      },
      "location": {
        "value": "westus"
      },
      "workspaceId": {
        "value": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
      },
      "workspaceKey": {
        "value": "Tse-gj9CemT6A80urYa2hwtjvA5axv1xobXgKR17kbVdtacU6cEf+SNo2TdHGVKTsZHZd1W9QKRXfh+$fVY9dA=="
      }
  }
}
```



## Windows diagnostic extension
The following sample enables and configures the diagnostic extension on a Windows Azure virtual machine. For details on the configuration, see [Windows diagnostics extension schema](../platform/diagnostics-extension-schema-windows.md).

### Template file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "vmName": {
      "type": "string",
      "metadata": {
        "description": "Name of the virtual machine."
      }
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": {
        "description": "Location for the virtual machine."
      }
    },
    "storageAccountName": {
      "type": "string",
      "metadata": {
        "description": "Name of the storage account."
      }
    },
    "storageAccountId": {
      "type": "string",
      "metadata": {
        "description": "Resource ID of the storage account."
      }
    },
    "workspaceResourceId": {
      "type": "string",
      "metadata": {
        "description": "Resource ID of the workspace."
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.Compute/virtualMachines",
      "apiVersion": "2018-10-01",
      "name": "[parameters('vmName')]",
      "location": "[parameters('location')]",
      "resources": [
            {
                "type": "Microsoft.Compute/virtualMachines/extensions",
                "name": "[concat(parameters('vmName'), '/Microsoft.Insights.VMDiagnosticsSettings')]",
                "apiVersion": "2015-06-15",
                "location": "[parameters('location')]",
                "dependsOn": [
                    "[concat('Microsoft.Compute/virtualMachines/', parameters('vmName'))]"
                ],
                "properties": {
                    "publisher": "Microsoft.Azure.Diagnostics",
                    "type": "IaaSDiagnostics",
                    "typeHandlerVersion": "1.5",
                    "autoUpgradeMinorVersion": true,
                    "settings": {
                        "WadCfg": {
                            "DiagnosticMonitorConfiguration": {
                                "overallQuotaInMB": 10000,
                                "DiagnosticInfrastructureLogs": {
                                    "scheduledTransferLogLevelFilter": "Error"
                                },
                                "PerformanceCounters": {
                                    "scheduledTransferPeriod": "PT1M",
                                    "sinks": "AzureMonitorSink",
                                    "PerformanceCounterConfiguration": [
                                        {
                                            "counterSpecifier": "\\Processor(_Total)\\% Processor Time",
                                            "sampleRate": "PT1M",
                                            "unit": "percent"
                                        }
                                    ]
                                },
                                "WindowsEventLog": {
                                    "scheduledTransferPeriod": "PT5M",
                                    "DataSource": [
                                        {
                                            "name": "System!*[System[Provider[@Name='Microsoft Antimalware']]]"
                                        },
                                        {
                                            "name": "System!*[System[Provider[@Name='NTFS'] and (EventID=55)]]"
                                        },
                                        {
                                            "name": "System!*[System[Provider[@Name='disk'] and (EventID=7 or EventID=52 or EventID=55)]]"
                                        }
                                    ]
                                }
                            },
                            "SinksConfig": {
                                "Sink": [
                                    {
                                        "name": "AzureMonitorSink",
                                        "AzureMonitor":
                                        {
                                            "ResourceId": "[parameters('workspaceResourceId')]"
                                        }
                                    }
                                ]
                            }
                        },
                        "storageAccount": "[parameters('storageAccountName')]"
                    },
                    "protectedSettings": {
                        "storageAccountName": "[parameters('storageAccountName')]",
                        "storageAccountKey": "[listkeys(parameters('storageAccountId'), '2015-05-01-preview').key1]",
                        "storageAccountEndPoint": "https://core.windows.net"            }
                }
            }
        ]
    },
    {
        "type": "Microsoft.Compute/virtualMachines/extensions",
        "name": "[concat(parameters('vmName'),'/ManagedIdentityExtensionForWindows')]",
        "apiVersion": "2018-06-01",
        "location": "[parameters('location')]",
        "properties": {
            "publisher": "Microsoft.ManagedIdentity",
            "type": "ManagedIdentityExtensionForWindows",
            "typeHandlerVersion": "1.0",
            "autoUpgradeMinorVersion": true,
            "settings": {
                "port": 50342
            }
        }
    }
  ]
}
```

### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
      "vmName": {
        "value": "my-windows-vm"
      },
      "location": {
        "value": "westus"
      },
      "storageAccountName": {
        "value": "mystorageaccount"
      },
      "storageAccountId": {
        "value": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/my-resource-group/providers/Microsoft.Storage/storageAccounts/my-windows-vm"
      },
      "workspaceResourceId": {
        "value": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/my-resource-group/providers/microsoft.operationalinsights/workspaces/my-workspace"
      },
      "workspaceKey": {
        "value": "Npl#3y4SmqG4R30ukKo3oxfixZ5axv1xocXgKR17kgVdtacU4cEf+SNr2TdHGVKTsZHZv3R8QKRXfh+ToVR9dA-="
      }
  }
}
```

## Linux diagnostic setting
The following sample enables and configures the diagnostic extension on a Linux Azure virtual machine. For details on the configuration, see [Windows diagnostics extension schema](../../virtual-machines/extensions/diagnostics-linux.md).

### Template file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "vmName": {
      "type": "string",
      "metadata": {
        "description": "Name of the virtual machine."
      }
    },
    "vmId": {
      "type": "string",
      "metadata": {
        "description": "Resource ID of the virtual machine."
      }
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": {
        "description": "Location for the virtual machine."
      }
    },
    "storageAccountName": {
      "type": "string",
      "metadata": {
        "description": "Name of the storage account."
      }
    },
    "storageSasToken": {
      "type": "string",
      "metadata": {
        "description": "Resource ID of the storage account."
      }
    },
    "eventHubUrl": {
      "type": "string",
      "metadata": {
        "description": "URL of the event hub."
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.Compute/virtualMachines",
      "apiVersion": "2018-10-01",
      "name": "[parameters('vmName')]",
      "location": "[parameters('location')]",
      "resources": [
          {
              "type": "Microsoft.Compute/virtualMachines/extensions",
              "name": "[concat(parameters('vmName'), '/Microsoft.Insights.VMDiagnosticsSettings')]",
              "apiVersion": "2015-06-15",
              "location": "[parameters('location')]",
              "dependsOn": [
                  "[concat('Microsoft.Compute/virtualMachines/', parameters('vmName'))]"
              ],
              "properties": {
                  "publisher": "Microsoft.Azure.Diagnostics",
                  "type": "LinuxDiagnostic",
                  "typeHandlerVersion": "3.0",
                  "autoUpgradeMinorVersion": true,
                  "settings": {
                    "StorageAccount": "[parameters('storageAccountName')]",
                    "ladCfg": {
                      "sampleRateInSeconds": 15,
                      "diagnosticMonitorConfiguration": 
                      {
                        "performanceCounters": 
                        {
                          "sinks": "MyMetricEventHub,MyJsonMetricsBlob",
                          "performanceCounterConfiguration": [
                            {
                              "unit": "Percent",
                              "type": "builtin",
                              "counter": "PercentProcessorTime",
                              "counterSpecifier": "/builtin/Processor/PercentProcessorTime",
                              "annotation": [
                                {
                                  "locale": "en-us",
                                  "displayName": "Aggregate CPU %utilization"
                                }
                              ],
                              "condition": "IsAggregate=TRUE",
                              "class": "Processor"
                            },
                            {
                              "unit": "Bytes",
                              "type": "builtin",
                              "counter": "UsedSpace",
                              "counterSpecifier": "/builtin/FileSystem/UsedSpace",
                              "annotation": [
                                {
                                  "locale": "en-us",
                                  "displayName": "Used disk space on /"
                                }
                              ],
                              "condition": "Name=\"/\"",
                              "class": "Filesystem"
                            }
                          ]
                        },
                        "metrics": {
                          "metricAggregation": [
                            {
                              "scheduledTransferPeriod": "PT1H"
                            },
                            {
                              "scheduledTransferPeriod": "PT1M"
                            }
                          ],
                          "resourceId": "[parameters('vmId')]"
                        },
                        "eventVolume": "Large",
                        "syslogEvents": {
                          "sinks": "MySyslogJsonBlob,MyLoggingEventHub",
                          "syslogEventConfiguration": {
                            "LOG_USER": "LOG_INFO"
                          }
                        }
                      }
                    },
                    "perfCfg": [
                      {
                        "query": "SELECT PercentProcessorTime, PercentIdleTime FROM SCX_ProcessorStatisticalInformation WHERE Name='_TOTAL'",
                        "table": "LinuxCpu",
                        "frequency": 60,
                        "sinks": "MyLinuxCpuJsonBlob,MyLinuxCpuEventHub"
                      }
                    ],
                    "fileLogs": [
                      {
                        "file": "/var/log/myladtestlog",
                        "table": "MyLadTestLog",
                        "sinks": "MyFilelogJsonBlob,MyLoggingEventHub"
                      }
                    ]
                  },
                  "protectedSettings": {
                    "storageAccountName": "yourdiagstgacct",
                    "storageAccountSasToken": "[parameters('storageSasToken')]",
                    "sinksConfig": {
                      "sink": [
                        {
                          "name": "MySyslogJsonBlob",
                          "type": "JsonBlob"
                        },
                        {
                          "name": "MyFilelogJsonBlob",
                          "type": "JsonBlob"
                        },
                        {
                          "name": "MyLinuxCpuJsonBlob",
                          "type": "JsonBlob"
                        },
                        {
                          "name": "MyJsonMetricsBlob",
                          "type": "JsonBlob"
                        },
                        {
                          "name": "MyLinuxCpuEventHub",
                          "type": "EventHub",
                          "sasURL": "[parameters('eventHubUrl')]"
                        },
                        {
                          "name": "MyMetricEventHub",
                          "type": "EventHub",
                          "sasURL": "[parameters('eventHubUrl')]"
                        },
                        {
                          "name": "MyLoggingEventHub",
                          "type": "EventHub",
                          "sasURL": "[parameters('eventHubUrl')]"
                        }
                      ]
                    }
                  }
              }
          }
        ]
    }
  ]
}
```

### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
      "vmName": {
        "value": "my-linux-vm"
      },
      "vmId": {
        "value": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/my-resource-group/providers/Microsoft.Compute/virtualMachines/my-linux-vm"
      },
      "location": {
        "value": "westus"
      },
      "storageAccountName": {
        "value": "mystorageaccount"
      },
      "storageSasToken": {
        "value": "?sv=2019-10-10&ss=bfqt&srt=sco&sp=rwdlacupx&se=2020-04-26T23:06:44Z&st=2020-04-26T15:06:44Z&spr=https&sig=1QpoTvrrEW6VN2taweUq1BsaGkhDMnFGTfWakucZl4%3D"
      },
      "eventHubUrl": {
        "value": "https://my-eventhub-namespace.servicebus.windows.net/my-eventhub?sr=my-eventhub-namespace.servicebus.windows.net%2fmy-eventhub&sig=4VEGPTg8jxUAbTcyeF2kwOr8XZdfgTdMWEQWnVaMSqw=&skn=manage"
      }
  }
}
```

## Next steps

* [Get other sample templates for Azure Monitor](resource-manager-samples.md).
* [Learn more about Log Analytics agent](../platform/log-analytics-agent.md).
* [Learn more about diagnostic extension](../platform/diagnostics-extension-overview.md).
