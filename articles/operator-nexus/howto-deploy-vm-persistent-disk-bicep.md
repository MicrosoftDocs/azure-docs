---
title: "Azure Operator Nexus: How to deploy a VM with a persistent OS disk"
description: Learn how to use BICEP to deploy a Nexus VM with a persistent OS disk
author: pjw711
ms.author: peterwhiting
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 01/06/2025
ms.custom: template-how-to, devx-track-bicep
---

# Deploy a Nexus virtual machine with a persistent OS disk

In this document, you learn how to use BICEP to deploy a Nexus virtual machine (VM) with a persistent OS disk. VMs with persistent OS disks support migration to a different host when their host is stopped. The data stored on a persistent OS disk is resilient to host failure.

## Review the BICEP file

Use Visual Studio Code or your favorite editor to create a file with the following content and name it **virtual-machine-bicep-template.bicep**:

:::code language="bicep" source="includes/virtual-machine/virtual-machine-bicep-template.bicep":::

Once you have reviewed and saved the template file named ```virtual-machine-bicep-template.bicep```, proceed to the next section to deploy the template.

## Deploy the template

1. Create a file named ```virtual-machine-parameters.json``` and add the required parameters in JSON format. You can use the following example as a starting point. Replace the values with your own.

:::code language="json" source="includes/virtual-machine/virtual-machine-persistent-os-params.json":::

2. Deploy the template.

```azurecli
    az deployment group create --resource-group myResourceGroup --template-file virtual-machine-bicep-template.bicep --parameters @virtual-machine-parameters.json
```

## Review the deployed resources

After the deployment finishes, you can view the resources using the CLI or the Azure portal.

To view the details of the ```myNexusVirtualMachine``` VM in the ```myResourceGroup``` resource group, execute the following

### [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az networkcloud virtualmachine show --name myNexusVirtualMachine --resource-group myResourceGroup
```

## Delete the deployed resources

You can delete the VM using the Azure CLI. This command also deletes the persistent OS disk.

### [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az networkcloud virtualmachine delete --name myNexusVirtualMachine --resource-group myResourceGroup
```
