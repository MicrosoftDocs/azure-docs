---
title: "Azure Operator Nexus: How to deploy a data disk"
description: Learn how to use BICEP to deploy a data disk on Azure Operator Nexus.
author: pjw711
ms.author: peterwhiting
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 01/06/2025
ms.custom: template-how-to, devx-track-bicep
---

# Deploy a data disk on Azure Operator Nexus

In this document, you'll learn how to use BICEP to deploy a data disk on Azure Operator Nexus. Data disks are a form of persistent storage for virtual machines (VMs). A Nexus virtual machine (VM) with data disks can store application data that persists if the bare metal machine (BMM) hosting the VM suffers a hardware failure.

## Review the BICEP file

Use Visual Studio Code or your favorite editor to create a file with the following content and name it **data-disk-bicep-template.bicep**:

:::code language="bicep" source="includes/virtual-machine/data-disk-bicep-template.bicep":::

Once you have reviewed and saved the template file named ```data-disk-bicep-template.bicep```, proceed to the next section to deploy the template.

## Deploy the template

1. Create a file named ```data-disk-parameters.json``` and add the required parameters in JSON format. You can use the following example as a starting point. Replace the values with your own.

:::code language="json" source="includes/virtual-machine/data-disk-params.json":::

2. Deploy the template.

```azurecli
    az deployment group create --resource-group myResourceGroup --template-file data-disk-bicep-template.bicep --parameters @data-disk-parameters.json
```

## Review the deployed resources

After the deployment finishes, you can view the resources using the CLI.

To view the details of the ```myDataDisk``` volume in the ```myResourceGroup``` resource group, execute the following

```azurecli-interactive
az networkcloud volume show --name myDataDisk --resource-group myResourceGroup
```

## Delete the deployed resources

You can delete the data disk using the Azure CLI.

> [!IMPORTANT]
> Deleting a data disk removes the backing volume from the storage appliance. Any data stored on that volume is lost unless you have a backup. You can't delete a data disk which is attached to a VM. If your disk has previously been attached to a VM, don't delete it unless you're certain you don't need the data!

```azurecli-interactive
az networkcloud volume delete --name myDataDisk --resource-group myResourceGroup
```
