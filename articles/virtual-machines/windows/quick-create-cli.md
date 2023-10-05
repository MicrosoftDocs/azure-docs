---
title: Quickstart - Create a Windows VM using the Azure CLI
description: In this quickstart, you learn how to use the Azure CLI to create a Windows virtual machine
author: cynthn
ms.service: virtual-machines
ms.collection: windows
ms.topic: quickstart
ms.date: 02/23/2023
ms.author: cynthn
ms.custom: mvc, devx-track-azurecli, mode-api
---

# Quickstart: Create a Windows virtual machine with the Azure CLI

**Applies to:** :heavy_check_mark: Windows VMs

The Azure CLI is used to create and manage Azure resources from the command line or in scripts. This quickstart shows you how to use the Azure CLI to deploy a virtual machine (VM) in Azure that runs Windows Server 2019. To see your VM in action, you then RDP to the VM and install the IIS web server.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Launch Azure Cloud Shell

The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account. 

To open the Cloud Shell, just select **Try it** from the upper right corner of a code block. You can also launch Cloud Shell in a separate browser tab by going to [https://shell.azure.com/bash](https://shell.azure.com/bash). Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and press **Enter** to run it.

## Create a resource group

Create a resource group with the [az group create](/cli/azure/group) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. The following example creates a resource group named *myResourceGroup* in the *West US 3* location. Replace the value of the variables as needed.

```azurecli-interactive
resourcegroup="myResourceGroupCLI"
location="westus3"
az group create --name $resourcegroup --location $location
```

## Create virtual machine

Create a VM with [az vm create](/cli/azure/vm). The following example creates a VM named *myVM*. This example uses *azureuser* for an administrative user name. Replace the values of the variables as needed.

You'll be prompted to supply a password that meets the [password requirements for Azure VMs](./faq.yml#what-are-the-password-requirements-when-creating-a-vm-).

Using the example below, you'll be prompted to enter a password at the command line. You could also add the `--admin-password` parameter with a value for your password. The user name and password will be used when you connect to the VM.

```azurecli-interactive
vmname="myVM"
username="azureuser"
az vm create \
    --resource-group $resourcegroup \
    --name $vmname \
    --image Win2022AzureEditionCore \
    --public-ip-sku Standard \
    --admin-username $username 
```

It takes a few minutes to create the VM and supporting resources. The following example output shows the VM create operation was successful.


```output
{
  "fqdns": "",
  "id": "/subscriptions/<guid>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM",
  "location": "westus3",
  "macAddress": "00-0D-3A-23-9A-49",
  "powerState": "VM running",
  "privateIpAddress": "10.0.0.4",
  "publicIpAddress": "52.174.34.95",
  "resourceGroup": "myResourceGroupCLI"
  "zones": ""
}
```

Take a note your own `publicIpAddress` in the output when you create your VM. This IP address is used to access the VM later in this article.

## Install web server

To see your VM in action, install the IIS web server.

```azurecli-interactive
az vm run-command invoke -g $resourcegroup \
   -n $vmname \
   --command-id RunPowerShellScript \
   --scripts "Install-WindowsFeature -name Web-Server -IncludeManagementTools"
```

## Open port 80 for web traffic

By default, only RDP connections are opened when you create a Windows VM in Azure. Use [az vm open-port](/cli/azure/vm) to open TCP port 80 for use with the IIS web server:

```azurecli-interactive
az vm open-port --port 80 --resource-group $resourcegroup --name $vmname
```

## View the web server in action

With IIS installed and port 80 now open on your VM from the Internet, use a web browser of your choice to view the default IIS welcome page. Use the public IP address of your VM obtained in a previous step. The following example shows the default IIS web site:

![IIS default site](./media/quick-create-powershell/default-iis-website.png)

## Clean up resources

When no longer needed, you can use the [az group delete](/cli/azure/group) command to remove the resource group, VM, and all related resources:

```azurecli-interactive
az group delete --name $resourcegroup
```

## Next steps

In this quickstart, you deployed a simple virtual machine, open a network port for web traffic, and installed a basic web server. To learn more about Azure virtual machines, continue to the tutorial for Windows VMs.

> [!div class="nextstepaction"]
> [Azure Windows virtual machine tutorials](./tutorial-manage-vm.md)
