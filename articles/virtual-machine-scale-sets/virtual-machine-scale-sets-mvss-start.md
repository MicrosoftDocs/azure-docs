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

Our minimum viable scale set template can be seen [here](https://raw.githubusercontent.com/gatneil/mvss/minimum-viable-scale-set/azuredeploy.json). Those already familiar with templates can safely skip to the "Next Steps" section to see how to modify this template for other scenarios. However, those less familiar with templates might find this piece by piece description helpful. To start, let's examine the diff to create this template (`git diff master minimum-viable-scale-set`) piece by piece:

First, we define the `$schema` and `contentVersion` of the template. `$schema` defines the version of the template language and is used for Visual Studio syntax highlighting and similar validation features. `contentVersion` is actually not used by Azure at all. Instead, it is to help you keep track of which version of the template this is.

```diff
+{
+  "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json",
+  "contentVersion": "1.0.0.0",
```

Next, we define two parameters, `adminUsername` and `adminPassword`. Parameters are values specified by the user at the time of deployment. `adminUsername` is simply a `string`, but because `adminPassword` is a secret, we give it type `securestring`. We will see later on that these parameters are passed into the scale set configuration.

```diff
+  "parameters": {
+    "adminUsername": {
+      "type": "string"
+    },
+    "adminPassword": {
+      "type": "securestring"
+    }
+  },
```

ARM templates also allow you to define variables to be used later on in the template. In this example we don't use any variables, so we have left the JSON object empty.

```diff
+  "variables": {},
```

Next we have the resources of the template. This is where we define what we actually want to deploy. Unlike the `parameters` and `variables` (which are JSON objects), `resources` is a JSON list of JSON objects.

```diff
+  "resources": [
```

All resources require a `type`, `name`, `apiVersion`, and `location`. Our first resource is a `virtualNetwork` with name `myVnet` and apiVersion `2016-03-30`. To figure out the latest api versions for a resource, refer to the [https://docs.microsoft.com/rest/api/](Azure REST API documentation).

```diff
+    {
+      "type": "Microsoft.Network/virtualNetworks",
+      "name": "myVnet",
+      "apiVersion": "2016-03-30",
```

To specify the location for the virtual network, we are using a [Resource Manager template function](../azure-resource-manager/resource-group-template-functions.md). In order to use such a function, we need to use square brackets. The resourceGroup function takes in no arguments and returns a JSON object with metadata about the resource group this deployment is being deployed to. The resource group is set by the user at the time of deployment. We then index into this JSON object with `.location` to get the location from the JSON object.

```diff
+      "location": "[resourceGroup().location]",
```


Each Resource Manager resources has its own `properties` section for configurations specific to the resource. In this case, we are specifying that the virtual network have one subnet using the non-routable IP address range `10.0.0.0/16`. A scale set is always contained within one subnet. It cannot span subnets.

```diff
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

In addition to the required `type`, `name`, `apiVersion`, and `location` properties, each resource can have a `dependsOn` JSON list that specifies what other resources from this deployment need to finish deploying before deploying this resource. In this case there is only one element in this list, the virtual network from above. This must finish provisioning before the scale set because the scale set needs the network to exist before creating VMs in order to give those VMs private IP addresses from the network (from the ranges specified previously). The format of the dependsOn is `<type>/<name>` (the same `type` and `name` we used previously in the virtual network resource definition).

```diff
+    {
+      "type": "Microsoft.Compute/virtualMachineScaleSets",
+      "name": "myScaleSet",
+      "apiVersion": "2016-04-30-preview",
+      "location": "[resourceGroup().location]",
+      "dependsOn": [
+        "Microsoft.Network/virtualNetworks/myVnet"
+      ],
```

The scale set needs to know what size of vm to create (the "sku name"), as well as how many such VMs to create (the "sku capacity"). To see which VM sizes are available, refer to the [VM Sizes documentation](../virtual-machines/virtual-machines-windows-sizes).

```diff
+      "sku": {
+        "name": "Standard_A1",
+        "capacity": 2
+      },
```

The scale set also needs to know how to handle updates on the scale set. Currently there are two options, `Manual` and `Automatic`. For more information on the differences between the two, see the documentation on [how to upgrade a scale set](./virtual-machine-scale-sets-upgrade-scale-set.md).

```diff
+      "properties": {
+        "upgradePolicy": {
+          "mode": "Manual"
+        },
```

Of course, the scale set also needs to know what operating system to put on the VMs. Here we create the VMs with a fully patched Ubuntu 16.04-LTS image.

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

Since the scale set is deploying multiple scale sets, we need to specify a `computerNamePrefix`. The scale set will append an index on this prefix, so the VM names will be of the form `<computerNamePrefix>/<auto-generated-index>`. In this snippet, we also see that we are using the parameters from before to set the administrator username and password for all VMs in the scale set. This is done using the `parameters` template function, which takes in a string specifying which parameter and outputs the value for that parameter specified by the user at deploy time.

```diff
+          "osProfile": {
+            "computerNamePrefix": "vm",
+            "adminUsername": "[parameters('adminUsername')]",
+            "adminPassword": "[parameters('adminPassword')]"
+          },
```

Finally, we specify the network configuration for the VMs in the scale set. In this case, each VM gets one network interface (currently scale sets only support one network interface per VM), each of which gets its private IP address from the subnet specified earlier. The `resourceId` template function takes in the type and name of a resource and returns the fully qualified identifier of that resource (this includes your subscription ID and resource group name). However, the identifier of the virtual network is not enough. We must specify the specific subnet the scale set VMs should be in, so we use the `concat` template function. This function takes in a series of strings and returns their concatenation, giving us the fully qualified identifier of the subnet for the scale set.

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