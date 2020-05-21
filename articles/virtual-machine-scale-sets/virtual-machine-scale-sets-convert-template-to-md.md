---
title: Convert a scale set template to use managed disk
description: Convert an Azure Resource Manager virtual machine scale set template to a managed disk scale set template.
keywords: virtual machine scale sets
author: ju-shim
ms.author: jushiman
ms.topic: how-to
ms.service: virtual-machine-scale-sets
ms.subservice: disks
ms.date: 5/18/2017
ms.reviewer: mimckitt
ms.custom: mimckitt

---


# Convert a scale set template to a managed disk scale set template

Customers with a Resource Manager template for creating a scale set not using managed disk may wish to modify it to use managed disk. This article shows how to use managed disks, using as an example a pull request from the [Azure Quickstart Templates](https://github.com/Azure/azure-quickstart-templates), a community-driven repo for sample Resource Manager templates. The full pull request can be seen here: [https://github.com/Azure/azure-quickstart-templates/pull/2998](https://github.com/Azure/azure-quickstart-templates/pull/2998), and the relevant parts of the diff are below, along with explanations:

## Making the OS disks managed

In the following diff, several variables related to storage account and disk properties are removed. Storage account type is no longer necessary (Standard_LRS is the default), but you could specify it if desired. Only Standard_LRS and Premium_LRS are supported with managed disk. New storage account suffix, unique string array, and sa count were used in the old template to generate storage account names. These variables are no longer necessary in the new template because managed disk automatically creates storage accounts on the customer's behalf. Similarly, vhd container name and OS disk name are no longer necessary because managed disk automatically names the underlying storage blob containers and disks.

```diff
   "variables": {
-    "storageAccountType": "Standard_LRS",
     "namingInfix": "[toLower(substring(concat(parameters('vmssName'), uniqueString(resourceGroup().id)), 0, 9))]",
     "longNamingInfix": "[toLower(parameters('vmssName'))]",
-    "newStorageAccountSuffix": "[concat(variables('namingInfix'), 'sa')]",
-    "uniqueStringArray": [
-      "[concat(uniqueString(concat(resourceGroup().id, variables('newStorageAccountSuffix'), '0')))]",
-      "[concat(uniqueString(concat(resourceGroup().id, variables('newStorageAccountSuffix'), '1')))]",
-      "[concat(uniqueString(concat(resourceGroup().id, variables('newStorageAccountSuffix'), '2')))]",
-      "[concat(uniqueString(concat(resourceGroup().id, variables('newStorageAccountSuffix'), '3')))]",
-      "[concat(uniqueString(concat(resourceGroup().id, variables('newStorageAccountSuffix'), '4')))]"
-    ],
-    "saCount": "[length(variables('uniqueStringArray'))]",
-    "vhdContainerName": "[concat(variables('namingInfix'), 'vhd')]",
-    "osDiskName": "[concat(variables('namingInfix'), 'osdisk')]",
     "addressPrefix": "10.0.0.0/16",
     "subnetPrefix": "10.0.0.0/24",
     "virtualNetworkName": "[concat(variables('namingInfix'), 'vnet')]",
```


In the following diff, you compute API is updated to version 2016-04-30-preview, which is the earliest required version for managed disk support with scale sets. You could use unmanaged disks in the new API version with the old syntax if desired. If you only update the compute API version and don't change anything else, the template should continue to work as before.

```diff
@@ -86,7 +74,7 @@
       "version": "latest"
     },
     "imageReference": "[variables('osType')]",
-    "computeApiVersion": "2016-03-30",
+    "computeApiVersion": "2016-04-30-preview",
     "networkApiVersion": "2016-03-30",
     "storageApiVersion": "2015-06-15"
   },
```

In the following diff, the storage account resource is removed from the resources array completely. The resource is no longer needed as managed disk creates them automatically.

```diff
@@ -113,19 +101,6 @@
       }
     },
-    {
-      "type": "Microsoft.Storage/storageAccounts",
-      "name": "[concat(variables('uniqueStringArray')[copyIndex()], variables('newStorageAccountSuffix'))]",
-      "location": "[resourceGroup().location]",
-      "apiVersion": "[variables('storageApiVersion')]",
-      "copy": {
-        "name": "storageLoop",
-        "count": "[variables('saCount')]"
-      },
-      "properties": {
-        "accountType": "[variables('storageAccountType')]"
-      }
-    },
     {
       "type": "Microsoft.Network/publicIPAddresses",
       "name": "[variables('publicIPAddressName')]",
       "location": "[resourceGroup().location]",
```

In the following diff, we can see that we are removing the depends on clause referring from the scale set to the loop that was creating storage accounts. In the old template, this was ensuring that the storage accounts were created before the scale set began creation, but this clause is no longer necessary with managed disk. The vhd containers property is also removed, along with the OS disk name property as these properties are automatically handled under the hood by managed disk. You could add `"managedDisk": { "storageAccountType": "Premium_LRS" }` in the "osDisk" configuration if you wanted premium OS disks. Only VMs with an uppercase or lowercase 's' in the VM sku can use premium disks.

```diff
@@ -183,7 +158,6 @@
       "location": "[resourceGroup().location]",
       "apiVersion": "[variables('computeApiVersion')]",
       "dependsOn": [
-        "storageLoop",
         "[concat('Microsoft.Network/loadBalancers/', variables('loadBalancerName'))]",
         "[concat('Microsoft.Network/virtualNetworks/', variables('virtualNetworkName'))]"
       ],
@@ -200,16 +174,8 @@
         "virtualMachineProfile": {
           "storageProfile": {
             "osDisk": {
-              "vhdContainers": [
-                "[concat('https://', variables('uniqueStringArray')[0], variables('newStorageAccountSuffix'), '.blob.core.windows.net/', variables('vhdContainerName'))]",
-                "[concat('https://', variables('uniqueStringArray')[1], variables('newStorageAccountSuffix'), '.blob.core.windows.net/', variables('vhdContainerName'))]",
-                "[concat('https://', variables('uniqueStringArray')[2], variables('newStorageAccountSuffix'), '.blob.core.windows.net/', variables('vhdContainerName'))]",
-                "[concat('https://', variables('uniqueStringArray')[3], variables('newStorageAccountSuffix'), '.blob.core.windows.net/', variables('vhdContainerName'))]",
-                "[concat('https://', variables('uniqueStringArray')[4], variables('newStorageAccountSuffix'), '.blob.core.windows.net/', variables('vhdContainerName'))]"
-              ],
-              "name": "[variables('osDiskName')]",
             },
             "imageReference": "[variables('imageReference')]"
           },

```

There is no explicit property in the scale set configuration for whether to use managed or unmanaged disk. The scale set knows which to use based on the properties that are present in the storage profile. Thus, it is important when modifying the template to ensure that the right properties are in the storage profile of the scale set.


## Data disks

With the changes above, the scale set uses managed disks for the OS disk, but what about data disks? To add data disks, add the "dataDisks" property under "storageProfile" at the same level as "osDisk". The value of the property is a JSON list of objects, each of which has properties "lun" (which must be unique per data disk on a VM), "createOption" ("empty" is currently the only supported option), and "diskSizeGB" (the size of the disk in gigabytes; must be greater than 0 and less than 1024) as in the following example:

```
"dataDisks": [
  {
    "lun": "1",
    "createOption": "empty",
    "diskSizeGB": "1023"
  }
]
```

If you specify `n` disks in this array, each VM in the scale set gets `n` data disks. Do note, however, that these data disks are raw devices. They are not formatted. It is up to the customer to attach, partition, and format the disks before using them. Optionally, you could also specify `"managedDisk": { "storageAccountType": "Premium_LRS" }` in each data disk object to specify that it should be a premium data disk. Only VMs with an uppercase or lowercase 's' in the VM sku can use premium disks.

To learn more about using data disks with scale sets, see [this article](./virtual-machine-scale-sets-attached-disks.md).


## Next steps
For example Resource Manager templates using scale sets, search for "vmss" in the [Azure Quickstart Templates GitHub repo](https://github.com/Azure/azure-quickstart-templates).

For general information, check out the [main landing page for scale sets](https://azure.microsoft.com/services/virtual-machine-scale-sets/).

