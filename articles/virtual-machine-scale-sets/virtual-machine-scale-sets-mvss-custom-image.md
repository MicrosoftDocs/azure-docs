---
title: 'Reference a custom image in an Azure scale set template'
description: Learn how to add a custom image to an existing Azure Virtual Machine Scale Set template
author: cynthn
ms.author: cynthn
ms.topic: how-to
ms.service: virtual-machine-scale-sets
ms.subservice: shared-image-gallery
ms.date: 11/22/2022
ms.reviewer: mimckitt

---

# Add a custom image to an Azure scale set template

> [!NOTE]
> This document covers Virtual Machine Scale Sets running in Uniform Orchestration mode. We recommend using Flexible Orchestration for new workloads. For more information, see [Orchesration modes for Virtual Machine Scale Sets in Azure](virtual-machine-scale-sets-orchestration-modes.md).

This article shows how to modify the [basic scale set template](virtual-machine-scale-sets-mvss-start.md) to deploy from custom image.

## Change the template definition
In a [previous article](virtual-machine-scale-sets-mvss-start.md) we had created a basic scale set template. We will now use that earlier template and modify it to create a template that deploys a scale set from a custom image.  

### Creating a managed disk image

If you already have a custom managed disk image (a resource of type `Microsoft.Compute/images`), then you can skip this section.

First, add a `sourceImageVhdUri` parameter, which is the URI to the generalized blob in Azure Storage that contains the custom image to deploy from.


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

Next, add a resource of type `Microsoft.Compute/images`, which is the managed disk image based on the generalized blob located at URI `sourceImageVhdUri`. This image must be in the same region as the scale set that uses it. In the properties of the image, specify the OS type, the location of the blob (from the `sourceImageVhdUri` parameter), and the storage account type:

```diff
   "resources": [
     {
+      "type": "Microsoft.Compute/images",
+      "apiVersion": "2019-03-01",
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

In the scale set resource, add a `dependsOn` clause referring to the custom image to make sure the image gets created before the scale set tries to deploy from that image:

```diff
       "location": "[resourceGroup().location]",
       "apiVersion": "2019-03-01-preview",
       "dependsOn": [
-        "Microsoft.Network/virtualNetworks/myVnet"
+        "Microsoft.Network/virtualNetworks/myVnet",
+        "Microsoft.Compute/images/myCustomImage"
       ],
       "sku": {
         "name": "Standard_A1",

```

### Changing scale set properties to use the managed disk image

In the `imageReference` of the scale set `storageProfile`, instead of specifying the publisher, offer, sku, and version of a platform image, specify the `id` of the `Microsoft.Compute/images` resource:

```json
  "virtualMachineProfile": {
    "storageProfile": {
      "imageReference": {
        "id": "[resourceId('Microsoft.Compute/images', omImage')]"
      }
    },
    "osProfile": {
      ...
    }
  }
```

In this example, use the `resourceId` function to get the resource ID of the image created in the same template. If you have created the managed disk image beforehand, you should provide the ID of that image instead. This ID must be of the form: `/subscriptions/<subscription-id>resourceGroups/<resource-group-name>/providers/Microsoft.Compute/images/<image-name>`.


## Next Steps

[!INCLUDE [mvss-next-steps-include](../../includes/mvss-next-steps.md)]
