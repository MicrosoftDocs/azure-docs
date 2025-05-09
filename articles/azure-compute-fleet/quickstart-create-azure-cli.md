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
---

# Create an Azure Compute Fleet using Azure CLI

The Azure CLI is used to create and manage Azure resources from the command line or in scripts. This quickstart shows you how to use the Azure CLI to deploy a Compute Fleet resource.


## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Before using Compute Fleet, complete the feature registration and configure role-based access controls (RBAC). 


### Feature registration

Register the Azure Compute Fleet resource provider with your subscription using Azure CLI. Registration can take up to 30 minutes to successfully show as registered.

```bash
az provider register --namespace 'Microsoft.AzureFleet'
```
### Set Environment variables

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

### Create a resource group

```bash
az group create --name $MY_RESOURCE_GROUP_NAME --location $REGION
```

### Create virtual network and subnet

```bash
az network vnet create  --name $MY_VNET_NAME  --resource-group $MY_RESOURCE_GROUP_NAME --location $REGION  --address-prefix $MY_VNET_PREFIX  --subnet-name $MY_VM_SN_NAME --subnet-prefix $MY_VM_SN_PREFIX
```

Get the subnet ARM ID

```bash
export MY_SUBNET_ID="$(az network vnet subnet show \
  --resource-group $MY_RESOURCE_GROUP_NAME \
  --vnet-name $MY_VNET_NAME \
  --name $MY_VM_SN_NAME \
  --query id --output tsv)"
```

### Set up the admin password

Set up a password that meets the [password requirements for Azure VMs](https://learn.microsoft.com/en-us/azure/virtual-machines/windows/faq#what-are-the-password-requirements-when-creating-a-vm-).

export ADMIN_PASSWORD="Azure compliant password"


### Create Compute Fleet

Set up the compute profile which is applied to the underlying VMs.

```bash
export COMPUTE_PROFILE="{ 'baseVirtualMachineProfile': { 'storageProfile': { 'imageReference': { 'publisher':'canonical', 'offer':'0001-com-ubuntu-server-focal', 'sku': '20_04-lts-gen2', 'version': 'latest' } }, 'osProfile': { 'computerNamePrefix': 'vm', 'adminUsername': '$MY_USERNAME', 'adminPassword': '$ADMIN_PASSWORD'}, 'networkProfile': { 'networkInterfaceConfigurations': [{ 'name': 'nic', 'primary': 'true', 'enableIPForwarding': 'true', 'ipConfigurations': [{ 'name': 'ipc', 'subnet': { 'id': '$MY_SUBNET_ID' } }] }], 'networkApiVersion': '2020-11-01'} } }"
```
 
```bash
az compute-fleet create --name $MY_FLEET_NAME --resource-group $MY_RESOURCE_GROUP_NAME --location $REGION \
    --spot-priority-profile "{ 'capacity': 5 }" \
    --regular-priority-profile "{ 'capacity': 5 }" \
    --compute-profile "$COMPUTE_PROFILE" \
    --vm-sizes-profile "[{ 'name': 'Standard_F1s' }]"
```
