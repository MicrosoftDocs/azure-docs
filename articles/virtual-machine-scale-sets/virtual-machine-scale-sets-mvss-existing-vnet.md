---
title: 'Reference an existing virtual network in an Azure scale set template | Microsoft Docs'
description: Learn how to add a virtual network to an existing Azure Virtual Machine Scale Set template
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
ms.date: 3/06/2017
ms.author: negat
---

# Add reference to an existing virtual network in an Azure scale set template

This article shows how to modify the [minimum viable scale set template](./virtual-machine-scale-sets-mvss-start.md) to deploy into an existing virtual network instead of creating a new one.

## Change the template definition

Our minimum viable scale set template can be seen [here](https://raw.githubusercontent.com/gatneil/mvss/minimum-viable-scale-set/azuredeploy.json), and our template for deploying the scale set into an existing virtual network can be seen [here](https://raw.githubusercontent.com/gatneil/mvss/existing-vnet/azuredeploy.json). Let's examine the diff used to create this template (`git diff minimum-viable-scale-set existing-vnet`) piece by piece:

First, we add a `subnetId` parameter. This string will be passed into the scale set configuration, allowing the scale set to identify the pre-created subnet to deploy virtual machines into. This string must be of the form: `/subscriptions/<subscription-id>resourceGroups/<resource-group-name>/providers/Microsoft.Network/virtualNetworks/<virtual-network-name>/subnets/<subnet-name>`. For instance, to deploy the scale set into an existing virtual network with name `myvnet`, subnet `mysubnet`, resource group `myrg`, and subscription `00000000-0000-0000-0000-000000000000`, the subnetId would be: `/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myrg/providers/Microsoft.Network/virtualNetworks/myvnet/subnets/mysubnet`.

```diff
     },
     "adminPassword": {
       "type": "securestring"
+    },
+    "subnetId": {
+      "type": "string"
     }
   },
```

Next, we can delete the virtual network resource from the `resources` array, since we are using an existing virtual network and don't need to deploy a new one.

```diff
   "variables": {},
   "resources": [
-    {
-      "type": "Microsoft.Network/virtualNetworks",
-      "name": "myVnet",
-      "location": "[resourceGroup().location]",
-      "apiVersion": "2016-12-01",
-      "properties": {
-        "addressSpace": {
-          "addressPrefixes": [
-            "10.0.0.0/16"
-          ]
-        },
-        "subnets": [
-          {
-            "name": "mySubnet",
-            "properties": {
-              "addressPrefix": "10.0.0.0/16"
-            }
-          }
-        ]
-      }
-    },
```

The virtual network already exists before the template is deployed, so there is no need to specify a dependsOn clause from the scale set to the virtual network. Thus, we delete these lines:

```diff
     {
       "type": "Microsoft.Compute/virtualMachineScaleSets",
       "name": "myScaleSet",
       "location": "[resourceGroup().location]",
       "apiVersion": "2016-04-30-preview",
-      "dependsOn": [
-        "Microsoft.Network/virtualNetworks/myVnet"
-      ],
       "sku": {
         "name": "Standard_A1",
         "capacity": 2
```

Finally, we pass in the `subnetId` parameter set by the user (instead of using `resourceId` to get the id of a vnet in the same deployment, which is what the minimum viable scale set template does).

```diff
                       "name": "myIpConfig",
                       "properties": {
                         "subnet": {
-                          "id": "[concat(resourceId('Microsoft.Network/virtualNetworks', 'myVnet'), '/subnets/mySubnet')]"
+                          "id": "[parameters('subnetId')]"
                         }
                       }
                     }
```




## Next steps

[!INCLUDE [mvss-next-steps-include](../../includes/mvss-next-steps.md)]
