---
title: Virtual Machine Scale Sets: Minimum Viable Scale Set | Microsoft Docs
description: Learn to create a minimum viable scale set template
services: virtual-machine-scale-sets
documentationcenter: ''
author: gatneil
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 76ac7fd7-2e05-4762-88ca-3b499e87906e
ms.service: virtual-machine-scale-sets
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 2/14/2017
ms.author: negat

---

# About This Tutorial

[Azure Resource Manager templates](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview#template-deployment) are a great way to deploy groups of related resources. This tutorial series will walk through how to create a minimum viable scale set template as well as how to modify this template to suit a variety of scenarios. All of the examples come from this [github repo](https://github.com/gatneil/mvss). Each diff shown in this walkthrough is the result of doing a `git diff` between branches in this repo. These templates and diffs are intended to be simple, not full-fledged examples. For more complete examples of scale set templates, see the [Azure Quickstart Templates github repo](github.com/Azure/azure-quickstart-templates) and search for folders that contain the string `vmss`.

## A Minimum Viable Scale Set

Our minimum viable scale set template can be seen [here](https://raw.githubusercontent.com/gatneil/mvss/minimum-viable-scale-set/azuredeploy.json). To start, let's examine the diff to create this template (`git diff master minimum-viable-scale-set`) piece by piece:

```diff
+{
+  "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json",
+  "contentVersion": "1.0.0.0",
```

```diff
+  "parameters": {
+    "adminUsername": {
+      "type": "string"
+    },
+    "adminPassword": {
+      "type": "securestring"
+    }
+  },
+  "variables": {},
```

```diff
+  "resources": [
+    {
+      "type": "Microsoft.Network/virtualNetworks",
+      "name": "myVnet",
+      "location": "[resourceGroup().location]",
+      "apiVersion": "2016-03-30",
+      "properties": {
+        "addressSpace": {
+          "addressPrefixes": [
+            "10.0.0.0/16"
+          ]
+        },
+        "subnets": [
+          {
+            "name": "mySubnet",
+            "properties": {
+              "addressPrefix": "10.0.0.0/16"
+            }
+          }
+        ]
+      }
+    },
```

```diff
+    {
+      "type": "Microsoft.Compute/virtualMachineScaleSets",
+      "name": "myScaleSet",
+      "location": "[resourceGroup().location]",
+      "apiVersion": "2016-04-30-preview",
+      "dependsOn": [
+        "Microsoft.Network/virtualNetworks/myVnet"
+      ],
```

```diff
+      "sku": {
+        "name": "Standard_A1",
+        "capacity": 2
+      },
```

```diff
+      "properties": {
+        "upgradePolicy": {
+          "mode": "Manual"
+        },
```

```diff
+        "virtualMachineProfile": {
+          "storageProfile": {
+            "imageReference": {
+              "publisher": "Canonical",
+              "offer": "UbuntuServer",
+              "sku": "16.04-LTS",
+              "version": "latest"
+            }
+          },
```

```diff
+          "osProfile": {
+            "computerNamePrefix": "vm",
+            "adminUsername": "[parameters('adminUsername')]",
+            "adminPassword": "[parameters('adminPassword')]"
+          },
```

```diff
+          "networkProfile": {
+            "networkInterfaceConfigurations": [
+              {
+                "name": "myNic",
+                "properties": {
+                  "primary": "true",
+                  "ipConfigurations": [
+                    {
+                      "name": "myIpConfig",
+                      "properties": {
+                        "subnet": {
+                          "id": "[concat(resourceId('Microsoft.Network/virtualNetworks', 'myVnet'), '/subnets/mySubnet')]"
+                        }
+                      }
+                    }
+                  ]
+                }
+              }
+            ]
+          }
+        }
+      }
+    }
+  ]
+}

```