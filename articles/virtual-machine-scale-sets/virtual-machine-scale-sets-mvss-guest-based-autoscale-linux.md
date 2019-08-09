---
title: 'Use Azure autoscale with guest metrics in a Linux scale set template | Microsoft Docs'
description: Learn how to autoscale using guest metrics in a Linux Virtual Machine Scale Set template
services: virtual-machine-scale-sets
documentationcenter: ''
author: mayanknayar
manager: drewm
editor: ''
tags: azure-resource-manager

ms.assetid: na
ms.service: virtual-machine-scale-sets
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/26/2019
ms.author: manayar
---

# Autoscale using guest metrics in a Linux scale set template

There are two broad types of metrics in Azure that are gathered from VMs and scale sets: Host metrics and Guest metrics. At a high level, if you would like to use standard CPU, disk, and network metrics, then host metrics are a good fit. If, however, you need a larger selection of metrics, then guest metrics should be looked into.

Host metrics do not require additional setup because they are collected by the host VM, whereas guest metrics require you to install the [Windows Azure Diagnostics extension](../virtual-machines/windows/extensions-diagnostics-template.md) or the [Linux Azure Diagnostics extension](../virtual-machines/linux/diagnostic-extension.md) in the guest VM. One common reason to use guest metrics instead of host metrics is that guest metrics provide a larger selection of metrics than host metrics. One such example is memory-consumption metrics, which are only available via guest metrics. The supported host metrics are listed [here](../azure-monitor/platform/metrics-supported.md), and commonly used guest metrics are listed [here](../azure-monitor/platform/autoscale-common-metrics.md). This article shows how to modify the [basic viable scale set template](virtual-machine-scale-sets-mvss-start.md) to use autoscale rules based on guest metrics for Linux scale sets.

## Change the template definition

In a [previous article](virtual-machine-scale-sets-mvss-start.md) we had created a basic scale set template. We will now use that earlier template and modify it to create a template that deploys a Linux scale set with guest metric based autoscale.

First, add parameters for `storageAccountName` and `storageAccountSasToken`. The diagnostics agent stores metric data in a [table](../cosmos-db/table-storage-how-to-use-dotnet.md) in this storage account. As of the Linux Diagnostics Agent version 3.0, using a storage access key is no longer supported. Instead, use a [SAS Token](../storage/common/storage-dotnet-shared-access-signature-part-1.md).

```diff
     },
     "adminPassword": {
       "type": "securestring"
+    },
+    "storageAccountName": {
+      "type": "string"
+    },
+    "storageAccountSasToken": {
+      "type": "securestring"
     }
   },
```

Next, modify the scale set `extensionProfile` to include the diagnostics extension. In this configuration, specify the resource ID of the scale set to collect metrics from, as well as the storage account and SAS token to use to store the metrics. Specify how frequently the metrics are aggregated (in this case, every minute) and which metrics to track (in this case, percent used memory). For more detailed information on this configuration and metrics other than percent used memory, see [this documentation](../virtual-machines/linux/diagnostic-extension.md).

```diff
                 }
               }
             ]
+          },
+          "extensionProfile": {
+            "extensions": [
+              {
+                "name": "LinuxDiagnosticExtension",
+                "properties": {
+                  "publisher": "Microsoft.Azure.Diagnostics",
+                  "type": "LinuxDiagnostic",
+                  "typeHandlerVersion": "3.0",
+                  "settings": {
+                    "StorageAccount": "[parameters('storageAccountName')]",
+                    "ladCfg": {
+                      "diagnosticMonitorConfiguration": {
+                        "performanceCounters": {
+                          "sinks": "WADMetricJsonBlob",
+                          "performanceCounterConfiguration": [
+                            {
+                              "unit": "percent",
+                              "type": "builtin",
+                              "class": "memory",
+                              "counter": "percentUsedMemory",
+                              "counterSpecifier": "/builtin/memory/percentUsedMemory",
+                              "condition": "IsAggregate=TRUE"
+                            }
+                          ]
+                        },
+                        "metrics": {
+                          "metricAggregation": [
+                            {
+                              "scheduledTransferPeriod": "PT1M"
+                            }
+                          ],
+                          "resourceId": "[resourceId('Microsoft.Compute/virtualMachineScaleSets', 'myScaleSet')]"
+                        }
+                      }
+                    }
+                  },
+                  "protectedSettings": {
+                    "storageAccountName": "[parameters('storageAccountName')]",
+                    "storageAccountSasToken": "[parameters('storageAccountSasToken')]",
+                    "sinksConfig": {
+                      "sink": [
+                        {
+                          "name": "WADMetricJsonBlob",
+                          "type": "JsonBlob"
+                        }
+                      ]
+                    }
+                  }
+                }
+              }
+            ]
           }
         }
       }
```

Finally, add an `autoscaleSettings` resource to configure autoscale based on these metrics. This resource has a `dependsOn` clause that references the scale set to ensure that the scale set exists before attempting to autoscale it. If you choose a different metric to autoscale on, you would use the `counterSpecifier` from the diagnostics extension configuration as the `metricName` in the autoscale configuration. For more information on autoscale configuration, see the [autoscale best practices](../azure-monitor/platform/autoscale-best-practices.md) and the [Azure Monitor REST API reference documentation](/rest/api/monitor/autoscalesettings).

```diff
+    },
+    {
+      "type": "Microsoft.Insights/autoscaleSettings",
+      "apiVersion": "2015-04-01",
+      "name": "guestMetricsAutoscale",
+      "location": "[resourceGroup().location]",
+      "dependsOn": [
+        "Microsoft.Compute/virtualMachineScaleSets/myScaleSet"
+      ],
+      "properties": {
+        "name": "guestMetricsAutoscale",
+        "targetResourceUri": "[resourceId('Microsoft.Compute/virtualMachineScaleSets', 'myScaleSet')]",
+        "enabled": true,
+        "profiles": [
+          {
+            "name": "Profile1",
+            "capacity": {
+              "minimum": "1",
+              "maximum": "10",
+              "default": "3"
+            },
+            "rules": [
+              {
+                "metricTrigger": {
+                  "metricName": "/builtin/memory/percentUsedMemory",
+                  "metricNamespace": "",
+                  "metricResourceUri": "[resourceId('Microsoft.Compute/virtualMachineScaleSets', 'myScaleSet')]",
+                  "timeGrain": "PT1M",
+                  "statistic": "Average",
+                  "timeWindow": "PT5M",
+                  "timeAggregation": "Average",
+                  "operator": "GreaterThan",
+                  "threshold": 60
+                },
+                "scaleAction": {
+                  "direction": "Increase",
+                  "type": "ChangeCount",
+                  "value": "1",
+                  "cooldown": "PT1M"
+                }
+              },
+              {
+                "metricTrigger": {
+                  "metricName": "/builtin/memory/percentUsedMemory",
+                  "metricNamespace": "",
+                  "metricResourceUri": "[resourceId('Microsoft.Compute/virtualMachineScaleSets', 'myScaleSet')]",
+                  "timeGrain": "PT1M",
+                  "statistic": "Average",
+                  "timeWindow": "PT5M",
+                  "timeAggregation": "Average",
+                  "operator": "LessThan",
+                  "threshold": 30
+                },
+                "scaleAction": {
+                  "direction": "Decrease",
+                  "type": "ChangeCount",
+                  "value": "1",
+                  "cooldown": "PT1M"
+                }
+              }
+            ]
+          }
+        ]
+      }
     }
   ]
 }
```





## Next steps

[!INCLUDE [mvss-next-steps-include](../../includes/mvss-next-steps.md)]
