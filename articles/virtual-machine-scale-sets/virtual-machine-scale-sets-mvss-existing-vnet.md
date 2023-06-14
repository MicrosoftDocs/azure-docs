---
title: 'Reference an existing virtual network in an Azure scale set template'
description: Learn how to add a virtual network to an existing Azure Virtual Machine Scale Set template
author: ju-shim
ms.author: jushiman
ms.topic: how-to
ms.service: virtual-machine-scale-sets
ms.subservice: networking
ms.date: 11/22/2022
ms.reviewer: mimckitt
ms.custom: mimckitt

---

# Reference an existing virtual network in an Azure scale set template

This article shows how to modify the [basic scale set template](virtual-machine-scale-sets-mvss-start.md) to deploy into an existing virtual network instead of creating a new one.

## Prerequisites

In a previous article we had created a [basic scale set template](virtual-machine-scale-sets-mvss-start.md). You will need that earlier template so that you can modify it to create a template that deploys a scale set into an existing virtual network.

## Identify subnet

First, add a `subnetId` parameter. This string is passed into the scale set configuration, allowing the scale set to identify the pre-created subnet to deploy virtual machines into. This string must be of the form:

`/subscriptions/<subscription-id>resourceGroups/<resource-group-name>/providers/Microsoft.Network/virtualNetworks/<virtual-network-name>/subnets/<subnet-name>`


For instance, to deploy the scale set into an existing virtual network with name `myvnet`, subnet `mysubnet`, resource group `myrg`, and subscription `00000000-0000-0000-0000-000000000000`, the subnetId would be: 

`/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myrg/providers/Microsoft.Network/virtualNetworks/myvnet/subnets/mysubnet`.

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

## Delete extra virtual network resource

Next, delete the virtual network resource from the `resources` array, as you use an existing virtual network and don't need to deploy a new one.

```diff
    "variables": {},
    "resources": [
-    {
-      "type": "Microsoft.Network/virtualNetworks",
-      "name": "myVnet",
-      "location": "[resourceGroup().location]",
-      "apiVersion": "2018-11-01",
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
## Remove dependency clause

The virtual network already exists before the template is deployed, so there is no need to specify a `dependsOn` clause from the scale set to the virtual network. Delete the following lines:

```diff
      {
        "type": "Microsoft.Compute/virtualMachineScaleSets",
        "name": "myScaleSet",
        "location": "[resourceGroup().location]",
        "apiVersion": "2019-03-01",
-      "dependsOn": [
-        "Microsoft.Network/virtualNetworks/myVnet"
-      ],
        "sku": {
          "name": "Standard_A1",
          "capacity": 2
```

## Pass subnet parameter

Finally, pass in the `subnetId` parameter set by the user (instead of using `resourceId` to get the ID of a vnet in the same deployment, which is what the basic viable scale set template does).

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
