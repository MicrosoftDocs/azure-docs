---
title: 'Reference a custom image in an Azure scale set template | Microsoft Docs'
description: Learn how to add a custom image to an existing Azure Virtual Machine Scale Set template
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
ms.date: 5/10/2017
ms.author: negat
---

# Add a custom image to an Azure scale set template

This article shows how to modify the [minimum viable scale set template](./virtual-machine-scale-sets-mvss-start.md) to deploy from custom image.

## Change the template definition

Our minimum viable scale set template can be seen [here](https://raw.githubusercontent.com/gatneil/mvss/minimum-viable-scale-set/azuredeploy.json), and our template for deploying the scale set from a custom image can be seen [here](https://raw.githubusercontent.com/gatneil/mvss/custom-image/azuredeploy.json). Let's examine the diff used to create this template (`git diff minimum-viable-scale-set custom-image`) piece by piece:

### Creating a managed disk image

If you already have a custom managed disk image (a resource of type `Microsoft.Compute/images`), then you can skip this section.

First, we add a `sourceImageVhdUri` parameter, which is the URI to the generalized blob in Azure Storage that contains the custom image to deploy from.


```diff
     },
     "adminPassword": {
       "type": "securestring"
+    },
+    "sourceImageVhdUri": {
+      "type": "string",
+      "metadata": {
+        "description": "The source of the generalized blob containing the custom image"
+      }
     }
   },
   "variables": {},
```

Next, we add a resource of type `Microsoft.Compute/images`, which is the managed disk image based on the generalized blob located at URI `sourceImageVhdUri`. This image must be in the same region as the scale set that uses it. In the properties of the image, we specify the OS type, the location of the blob (from the `sourceImageVhdUri` parameter), and the storage account type:

```diff
   "resources": [
     {
+      "type": "Microsoft.Compute/images",
+      "apiVersion": "2016-04-30-preview",
+      "name": "myCustomImage",
+      "location": "[resourceGroup().location]",
+      "properties": {
+        "storageProfile": {
+          "osDisk": {
+            "osType": "Linux",
+            "osState": "Generalized",
+            "blobUri": "[parameters('sourceImageVhdUri')]",
+            "storageAccountType": "Standard_LRS"
+          }
+        }
+      }
+    },
+    {
       "type": "Microsoft.Network/virtualNetworks",
       "name": "myVnet",
       "location": "[resourceGroup().location]",

```

In the scale set resource, we add a `dependsOn` clause referring to the custom image to make sure the image gets created before the scale set tries to deploy from that image:

```diff
       "location": "[resourceGroup().location]",
       "apiVersion": "2016-04-30-preview",
       "dependsOn": [
-        "Microsoft.Network/virtualNetworks/myVnet"
+        "Microsoft.Network/virtualNetworks/myVnet",
+        "Microsoft.Compute/images/myCustomImage"
       ],
       "sku": {
         "name": "Standard_A1",

```

### Changing scale set properties to use the managed disk image

In the `imageReference` of the scale set `storageProfile`, instead of specifying the publisher, offer, sku, and version of a platform image, we specify the `id` of the `Microsoft.Compute/images` resource:

```diff
         "virtualMachineProfile": {
           "storageProfile": {
             "imageReference": {
-              "publisher": "Canonical",
-              "offer": "UbuntuServer",
-              "sku": "16.04-LTS",
-              "version": "latest"
+              "id": "[resourceId('Microsoft.Compute/images', 'myCustomImage')]"
             }
           },
           "osProfile": {
```

In this example, we use the `resourceId` function to get the resource ID of the image created in the same template. If you have created the managed disk image beforehand, you should provide the id of that image instead. This id must be of the form: `/subscriptions/<subscription-id>resourceGroups/<resource-group-name>/providers/Microsoft.Compute/images/<image-name>`.


## Next Steps

[!INCLUDE [mvss-next-steps-include](../../includes/mvss-next-steps.md)]
