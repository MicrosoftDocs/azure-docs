---
title: "Azure Operator Nexus: How to deploy a Nexus virtual machine with a persistent OS disk and a data disk"
description: Learn how to use BICEP to deploy a Nexus virtual machine (VM) with persistent disks
author: pjw711
ms.author: peterwhiting
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 01/06/2025
ms.custom: template-how-to, devx-track-bicep
---

# Deploy a Nexus virtual machine with a persistent OS disk and a persistent data disk

In this document, you learn how to use BICEP to deploy a Nexus virtual machine (VM) with a persistent OS disk and a persistent data disk. A Nexus virtual machine (VM) with persistent OS and data disks stores data on volumes provided by a remote storage appliance. This means application data persists if the bare metal machine (BMM) hosting the VM suffers a hardware failure.

## Prerequisites

You must create a Volume (Operator Nexus) resource with enough storage capacity for your VM use case. You can follow [How to Deploy a Data Disk](./howto-deploy-data-disk-bicep.md) to create the necessary Volume (Operator Nexus) resource.

## Review the BICEP file

Use Visual Studio Code or your favorite editor to create a file with the following content and name it **virtual-machine-bicep-template.bicep**:

:::code language="bicep" source="includes/virtual-machine/virtual-machine-bicep-template.bicep":::

Once you have reviewed and saved the template file named ```virtual-machine-bicep-template.bicep```, proceed to the next section to deploy the template.

## Deploy the template

1. Create a file named ```virtual-machine-parameters.json``` and add the required parameters in JSON format. You can use the following example as a starting point. Replace the values with your own.

:::code language="json" source="includes/virtual-machine/virtual-machine-persistent-params.json":::

2. Deploy the template.

```azurecli
    az deployment group create --resource-group myResourceGroup --template-file virtual-machine-bicep-template.bicep --parameters @virtual-machine-parameters.json
```

## Review the deployed resources

After the deployment finishes, you can view the resources using the CLI.

To view the details of the ```myNexusVirtualMachine``` VM in the ```myResourceGroup``` resource group, execute the following

```azurecli-interactive
az networkcloud virtualmachine show --name myNexusVirtualMachine --resource-group myResourceGroup
```

## Delete the deployed resources

You can delete the virtual machine using the Azure CLI.

> [!IMPORTANT]
> The OS disk is deleted when you delete the VM. Data disks aren't deleted when you delete a VM. You can delete the data disks using the Azure CLI to delete the Volume (Operator Nexus) resource. Deleting a data disk removes the backing volume from the storage appliance. Any data stored on that volume will be lost unless you have a backup. You can't delete a data disk which is attached to a VM. If your disk was attached to a VM, don't delete it unless you're certain you don't need the data!

```azurecli-interactive
az networkcloud virtualmachine delete --name myNexusVirtualMachine --resource-group myResourceGroup
```
