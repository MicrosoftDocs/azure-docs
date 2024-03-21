---
title: 'Quickstart: Use the Azure CLI to create a Linux Virtual Machine'
description: In this quickstart, you learn how to use the Azure CLI to create a Linux virtual machine
author: chasecrum
ms.service: virtual-machines
ms.collection: linux
ms.topic: quickstart
ms.date: 03/11/2024
ms.author: jushiman
ms.custom: mvc, devx-track-azurecli, mode-api, innovation-engine, linux-related-content
---

# Quickstart: Create a Linux virtual machine with the Azure CLI on Azure

**Applies to:** :heavy_check_mark: Linux VMs

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://go.microsoft.com/fwlink/?linkid=2263115)

This quickstart shows you how to use the Azure CLI to deploy a Linux virtual machine (VM) in Azure. The Azure CLI is used to create and manage Azure resources via either the command line or scripts.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Launch Azure Cloud Shell

The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account. 

To open the Cloud Shell, just select **Try it** from the upper right corner of a code block. You can also open Cloud Shell in a separate browser tab by going to [https://shell.azure.com/bash](https://shell.azure.com/bash). Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and select **Enter** to run it.

If you prefer to install and use the CLI locally, this quickstart requires Azure CLI version 2.0.30 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli).

## Define environment variables

The first step is to define the environment variables. Environment variables are commonly used in Linux to centralize configuration data to improve consistency and maintainability of the system. Create the following environment variables to specify the names of resources that you create later in this tutorial:

```bash
export RANDOM_ID="$(openssl rand -hex 3)"
export MY_RESOURCE_GROUP_NAME="myVMResourceGroup$RANDOM_ID"
export REGION=EastUS
export MY_VM_NAME="myVM$RANDOM_ID"
export MY_USERNAME=azureuser
export MY_VM_IMAGE="Canonical:0001-com-ubuntu-minimal-jammy:minimal-22_04-lts-gen2:latest"
```

## Log in to Azure using the CLI

In order to run commands in Azure using the CLI, you need to log in first. Log in using the `az login` command.

## Create a resource group

A resource group is a container for related resources. All resources must be placed in a resource group. The [az group create](/cli/azure/group) command creates a resource group with the previously defined $MY_RESOURCE_GROUP_NAME and $REGION parameters.

```bash
az group create --name $MY_RESOURCE_GROUP_NAME --location $REGION
```

Results:

<!-- expected_similarity=0.3 -->
```json
{
  "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myVMResourceGroup",
  "location": "eastus",
  "managedBy": null,
  "name": "myVMResourceGroup",
  "properties": {
    "provisioningState": "Succeeded"
  },
  "tags": null,
  "type": "Microsoft.Resources/resourceGroups"
}
```

## Create the virtual machine

To create a VM in this resource group, use the `vm create` command. 

The following example creates a VM and adds a user account. The `--generate-ssh-keys` parameter causes the CLI to look for an available ssh key in `~/.ssh`. If one is found, that key is used. If not, one is generated and stored in `~/.ssh`. The `--public-ip-sku Standard` parameter ensures that the machine is accessible via a public IP address. Finally, we deploy the latest `Ubuntu 22.04` image.

All other values are configured using environment variables.

```bash
az vm create \
    --resource-group $MY_RESOURCE_GROUP_NAME \
    --name $MY_VM_NAME \
    --image $MY_VM_IMAGE \
    --admin-username $MY_USERNAME \
    --assign-identity \
    --generate-ssh-keys \
    --public-ip-sku Standard
```

It takes a few minutes to create the VM and supporting resources. The following example output shows the VM create operation was successful.

<!-- expected_similarity=0.3 -->
```json
{
  "fqdns": "",
  "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myVMResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM",
  "location": "eastus",
  "macAddress": "00-0D-3A-10-4F-70",
  "powerState": "VM running",
  "privateIpAddress": "10.0.0.4",
  "publicIpAddress": "52.147.208.85",
  "resourceGroup": "myVMResourceGroup",
  "zones": ""
}
```

## Enable Azure AD Login for a Linux virtual machine in Azure

The following code example deploys a Linux VM and then installs the extension to enable an Azure AD Login for a Linux VM. VM extensions are small applications that provide post-deployment configuration and automation tasks on Azure virtual machines.

```bash
az vm extension set \
    --publisher Microsoft.Azure.ActiveDirectory \
    --name AADSSHLoginForLinux \
    --resource-group $MY_RESOURCE_GROUP_NAME \
    --vm-name $MY_VM_NAME
```

## Store IP address of VM in order to SSH

Run the following command to store the IP address of the VM as an environment variable:

```bash
export IP_ADDRESS=$(az vm show --show-details --resource-group $MY_RESOURCE_GROUP_NAME --name $MY_VM_NAME --query publicIps --output tsv)
```

## SSH into the VM

<!--## Export the SSH configuration for use with SSH clients that support OpenSSH & SSH into the VM.
Log in to Azure Linux VMs with Azure AD supports exporting the OpenSSH certificate and configuration. That means you can use any SSH clients that support OpenSSH-based certificates to sign in through Azure AD. The following example exports the configuration for all IP addresses assigned to the VM:-->

<!--
```bash
yes | az ssh config --file ~/.ssh/config --name $MY_VM_NAME --resource-group $MY_RESOURCE_GROUP_NAME
```
-->

You can now SSH into the VM by running the output of the following command in your ssh client of choice:

```bash
ssh -o StrictHostKeyChecking=no $MY_USERNAME@$IP_ADDRESS
```

## Next Steps

* [Use Cloud-Init to initialize a Linux VM on first boot](tutorial-automate-vm-deployment.md)
* [Create custom VM images](tutorial-custom-images.md)
* [Load Balance VMs](../../load-balancer/quickstart-load-balancer-standard-public-cli.md)
