---
title: Create an Azure Compute Fleet using Azure CLI
description: Learn how to create an Azure Compute Fleet using Azure CLI.
author: ykh015
ms.author: yakhande
ms.topic: how-to
ms.service: azure-compute-fleet
ms.date: 05/09/2025
ms.reviewer: jushiman
ms.custom: devx-track-azurecli
# Customer intent: As a cloud administrator, I want to create and deploy a Compute Fleet using Azure CLI, so that I can efficiently manage my virtual machine resources and optimize workloads.
---

# Create an Azure Compute Fleet using Azure CLI

This article steps through using the Azure CLI to create and deploy a Compute Fleet resource

Make sure that you've installed the latest [Azure CLI](/cli/azure/install-az-cli2) and are logged in to an Azure account with [az login](/cli/azure/reference-index).

## Launch Azure Cloud Shell

The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account.

To open the Cloud Shell, select **Open Cloud Shell** from the upper right corner of a code block. You can also launch Cloud Shell in a separate browser tab by going to [https://shell.azure.com/cli](https://shell.azure.com/cli). Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and press enter to run it.

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Before using Compute Fleet, complete the feature registration and configure role-based access controls (RBAC). 

## Feature registration

Register the Azure Compute Fleet resource provider with your subscription using Azure CLI. Registration can take up to 30 minutes to successfully show as registered.

```azurecli-interactive
az provider register --namespace 'Microsoft.AzureFleet'
```

## Define environment variables

Define environment variables as follows.

```bash
export RANDOM_ID="$(openssl rand -hex 3)"
export MY_RESOURCE_GROUP_NAME="myFleetResourceGroup$RANDOM_ID"
export REGION=EastUS
export MY_FLEET_NAME="myFleet$RANDOM_ID"
export MY_USERNAME=azureuser
export MY_VNET_NAME="myVNet$RANDOM_ID"
export NETWORK_PREFIX="$(($RANDOM % 254 + 1))"
export MY_VNET_PREFIX="10.$NETWORK_PREFIX.0.0/16"
export MY_VM_SN_NAME="myVMSN$RANDOM_ID"
export MY_VM_SN_PREFIX="10.$NETWORK_PREFIX.0.0/24"
```

## Create a resource group

A resource group is a logical container into which Azure resources are deployed and managed. All resources must be placed in a resource group. The following command creates a resource group with the previously defined `$MY_RESOURCE_GROUP_NAME` and `$REGION` parameters.

```azurecli-interactive
az group create --name $MY_RESOURCE_GROUP_NAME --location $REGION
```

## Create virtual network and subnet

Now you'll create a virtual network using the previously defined `$MY_VNET_PREFIX`, `$MY_VM_SN_NAME`, and `$MY_VM_SN_PREFIX` parameters.

```azurecli-interactive
az network vnet create  --name $MY_VNET_NAME  --resource-group $MY_RESOURCE_GROUP_NAME --location $REGION  --address-prefix $MY_VNET_PREFIX  --subnet-name $MY_VM_SN_NAME --subnet-prefix $MY_VM_SN_PREFIX
```

The following command gets the subnet ARM ID.

```azurecli-interactive
export MY_SUBNET_ID="$(az network vnet subnet show \
  --resource-group $MY_RESOURCE_GROUP_NAME \
  --vnet-name $MY_VNET_NAME \
  --name $MY_VM_SN_NAME \
  --query id --output tsv)"
```

## Set up the admin password

Set up a password that meets the [password requirements for Azure VMs](/azure/virtual-machines/windows/faq#what-are-the-password-requirements-when-creating-a-vm-).

```bash
export ADMIN_PASSWORD="Azure compliant password"
```

## Create a Compute Fleet

Set up the compute profile which is applied to the underlying VMs.

```bash
export COMPUTE_PROFILE="{ 'baseVirtualMachineProfile': { 'storageProfile': { 'imageReference': { 'publisher':'canonical', 'offer':'0001-com-ubuntu-server-focal', 'sku': '20_04-lts-gen2', 'version': 'latest' } }, 'osProfile': { 'computerNamePrefix': 'vm', 'adminUsername': '$MY_USERNAME', 'adminPassword': '$ADMIN_PASSWORD'}, 'networkProfile': { 'networkInterfaceConfigurations': [{ 'name': 'nic', 'primary': 'true', 'enableIPForwarding': 'true', 'ipConfigurations': [{ 'name': 'ipc', 'subnet': { 'id': '$MY_SUBNET_ID' } }] }], 'networkApiVersion': '2020-11-01'} } }"
```
 
```azurecli-interactive
az compute-fleet create --name $MY_FLEET_NAME --resource-group $MY_RESOURCE_GROUP_NAME --location $REGION \
    --spot-priority-profile "{ 'capacity': 5 }" \
    --regular-priority-profile "{ 'capacity': 5 }" \
    --compute-profile "$COMPUTE_PROFILE" \
    --vm-sizes-profile "[{ 'name': 'Standard_F1s' }]"
```

## Clean up resources (optional)

To avoid Azure charges, you should clean up unneeded resources. When you no longer need your Compute Fleet and other resources, delete the resource group and all its resources with [az group delete](/cli/azure/group). The `--no-wait` parameter returns control to the prompt without waiting for the operation to complete. The `--yes` parameter confirms that you wish to delete the resources without another prompt to do so.

## Next steps
> [!div class="nextstepaction"]
> [Learn how to modify a Compute Fleet.](modify-fleet.md)
