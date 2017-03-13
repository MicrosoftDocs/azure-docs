---
title: 'Virtual machine scale sets: Minimum viable scale set | Microsoft Docs'
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

# Create and modify a minimum viable scale set template

[Azure Resource Manager templates](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview#template-deployment) are a great way to deploy groups of related resources. This tutorial shows how to create a minimum viable scale set template and modify it to suit various scenarios. All examples come from this [github repo](https://github.com/gatneil/mvss). Each diff shown in this walkthrough is the result of doing a `git diff` between branches in this repo. These templates and diffs are not full-fledged examples. For more complete examples of scale set templates, see the [Azure Quickstart Templates github repo](https://github.com/Azure/azure-quickstart-templates) and search for folders that contain the string `vmss`.

## Create a template

Use GitHub to see the minimum viable scale set template used in this tutorial,  [azuredeploy.json](https://raw.githubusercontent.com/gatneil/mvss/minimum-viable-scale-set/azuredeploy.json). If you are already familiar with templates, you can skip to the "Next Steps" section to see how to modify this template for other scenarios. If you are less familiar with templates, this step-by-step description might be helpful. To start, examine the diff to create this template (`git diff master minimum-viable-scale-set`) piece by piece:

First, we define the `$schema` and `contentVersion` of the template. `$schema` defines the version of the template language and is used for Visual Studio syntax highlighting and similar validation features. `contentVersion` is actually not used by Azure at all. Instead, it helps you keep track of which version of the template this is.

```diff
+{
+  "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json",
+  "contentVersion": "1.0.0.0",
```

Next, we define two parameters, `adminUsername` and `adminPassword`. Parameters are values specified by the user at the time of deployment. The `adminUsername` parameter is simply a `string` type, but because `adminPassword` is a secret, we give it type `securestring`. Later, these parameters are passed into the scale set configuration.

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

Resource Manager templates also allow you to define variables to be used later on in the template. In this example we don't use any variables, so we have left the JSON object empty.

```diff
+  "variables": {},
```

Next we have the resources of the template, where we define what we actually want to deploy. Unlike `parameters` and `variables` (which are JSON objects), `resources` is a JSON list of JSON objects.

```diff
+  "resources": [
```

All resources require `type`, `name`, `apiVersion`, and `location` properties. Our first resource is of type `Microsft.Network/virtualNetwork` with name `myVnet` and apiVersion `2016-03-30`. To figure out the latest API version for a resource type, refer to the [Azure REST API documentation](https://docs.microsoft.com/rest/api/).

```diff
+    {
+      "type": "Microsoft.Network/virtualNetworks",
+      "name": "myVnet",
+      "apiVersion": "2016-12-01",
```

To specify the location for the virtual network, we are using a [Resource Manager template function](../azure-resource-manager/resource-group-template-functions.md), which must be enclosed with quotes and square brackets like this: `"[<template-function>]"`. In this case, we use the resourceGroup function, which takes in no arguments and returns a JSON object with metadata about the resource group this deployment is being deployed to. The resource group is set by the user at the time of deployment. We then index into this JSON object with `.location` to get the location from the JSON object.

```diff
+      "location": "[resourceGroup().location]",
```


Each Resource Manager resource has its own `properties` section for configurations specific to the resource. In this case, we specify that the virtual network should have one subnet using the private IP address range `10.0.0.0/16`. A scale set is always contained within one subnet. It cannot span subnets.

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

In addition to the required `type`, `name`, `apiVersion`, and `location` properties, each resource can have an optional `dependsOn` list of strings. This list specifies which other resources from this deployment must finish before deploying this resource. In this case, there is only one element in this list, the virtual network from the previous example. We specify this dependency because the scale set needs the network to exist before creating any VMs. This way, the scale set can give these VMs private IP addresses from the IP address range previously specified in the network properties. The format of each string in the dependsOn list is `<type>/<name>`. This is the same `type` and `name` used previously in the virtual network resource definition.

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

The scale set needs to know what size of VM to create (the "sku name") and how many such VMs to create (the "sku capacity"). To see which VM sizes are available, refer to the [VM Sizes documentation](https://docs.microsoft.com/azure/virtual-machines/virtual-machines-windows-sizes).

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

The scale set also needs to know what operating system to put on the VMs. Here we create the VMs with a fully patched Ubuntu 16.04-LTS image.

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

Since the scale set is deploying multiple VMs, instead of specifying each VM name, we specify a `computerNamePrefix`. The scale set appends an index to this prefix for each VM, so the VM names are of the form `<computerNamePrefix>_<auto-generated-index>`. In this snippet, we also see that we are using the parameters from before to set the administrator username and password for all VMs in the scale set. We do this with the `parameters` template function, which takes in a string specifying which parameter we wish to refer to and outputs the value for that parameter.

```diff
+          "osProfile": {
+            "computerNamePrefix": "vm",
+            "adminUsername": "[parameters('adminUsername')]",
+            "adminPassword": "[parameters('adminPassword')]"
+          },
```

Finally, we need specify the network configuration for the VMs in the scale set. In this case, we only need to specify the id of the subnet we created earlier so the scale set knows to put the network interfaces in this subnet. We can get the id of the virtual network containing the subnet using the `resourceId` template function. This function takes in the type and name of a resource and returns the fully qualified identifier of that resource (this id is of the form: `/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/<resourceProviderNamespace>/<resourceType>/<resourceName>`). However, the identifier of the virtual network is not enough. We must specify the specific subnet the scale set VMs should be in, so we concatenate `/subnets/mySubnet` to the id of the virtual network. The result is the fully qualified id of the subnet. We do this concatenation with the `concat` function, which takes in a series of strings and returns their concatenation.

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

## Next steps

[!INCLUDE [mvss-next-steps-include](../../includes/mvss-next-steps.md)]
