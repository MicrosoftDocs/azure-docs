---
title: Quickstart - Create a Linux VM with Azure PowerShell
description: In this quickstart, you learn how to use Azure PowerShell to create a Linux virtual machine
author: cynthn
ms.service: virtual-machines
ms.collection: linux
ms.topic: quickstart
ms.workload: infrastructure
ms.date: 01/14/2022
ms.author: cynthn
ms.custom: mvc, devx-track-azurepowershell,
---

# Quickstart: Create a Linux virtual machine in Azure with PowerShell

**Applies to:** :heavy_check_mark: Linux VMs 

The Azure PowerShell module is used to create and manage Azure resources from the PowerShell command line or in scripts. This quickstart shows you how to use the Azure PowerShell module to deploy a Linux virtual machine (VM) in Azure. This quickstart uses the Ubuntu 18.04 LTS marketplace image from Canonical. To see your VM in action, you'll also SSH to the VM and install the NGINX web server.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Launch Azure Cloud Shell

The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account. 

To open the Cloud Shell, just select **Try it** from the upper right corner of a code block. Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and press enter to run it.


## Create a resource group

Create an Azure resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup). A resource group is a logical container into which Azure resources are deployed and managed:

```azurepowershell-interactive
New-AzResourceGroup -Name "myResourceGroup" -Location "EastUS"
```


## Create a virtual machine

We will be automatically generating an SSH key pair to use for connecting to the VM. The public key that is created using `-GenerateSshKey` will be stored in Azure as a resource, using the name you provide as `SshKeyName`. The SSH key resource can be reused for creating additional VMs. Both the public and private keys will also downloaded for you. When you create your SSH key pair using the Cloud Shell, the keys are stored in a [storage account that is automatically created by Cloud Shell](../../cloud-shell/persisting-shell-storage.md). Don't delete the storage account, or the file share in it, until after you have retrieved your keys or you will lose access to the VM.

You will be prompted for a user name that will be used when you connect to the VM. You will also be asked for a password, which you can leave blank. Password login for the VM is disabled when using an SSH key.

In this example, you create a VM named *myVM*, in *East US*, using the *Standard_B2s* VM size.

```azurepowershell-interactive
New-AzVm `
    -ResourceGroupName "myResourceGroup" `
    -Name "myVM" `
    -Location "East US" `
    -Image UbuntuLTS `
    -size Standard_B2s `
    -PublicIpAddressName myPubIP `
    -OpenPorts 80,22 `
    -GenerateSshKey `
    -SshKeyName mySSHKey
```

The output will give you the location of the local copy of the SSH key. For example:

```output
Private key is saved to /home/user/.ssh/1234567891
Public key is saved to /home/user/.ssh/1234567891.pub
```

Make a note of the path to your private key to use later.

It will take a few minutes for your VM to be deployed. When the deployment is finished, move on to the next section.


## Connect to the VM

You need to change the permission on the SSH key using `chmod`. Replace *~/.ssh/1234567891* in the following example with the private key name and path from the earlier output.

```azurepowershell-interactive
chmod 600 ~/.ssh/1234567891
```

Create an SSH connection with the VM using the public IP address. To see the public IP address of the VM, use the [Get-AzPublicIpAddress](/powershell/module/az.network/get-azpublicipaddress) cmdlet:

```azurepowershell-interactive
Get-AzPublicIpAddress -ResourceGroupName "myResourceGroup" | Select "IpAddress"
```

Using the same shell you used to create your SSH key pair, paste the the following command into the shell to create an SSH session. Replace *~/.ssh/1234567891* in the following example with the private key name and path from the earlier output. Replace *10.111.12.123* with the IP address of your VM and *azureuser* with the name you provided when you created the VM.

```bash
ssh -i ~/.ssh/1234567891 azureuser@10.111.12.123
```

## Install NGINX

To see your VM in action, install the NGINX web server. From your SSH session, update your package sources and then install the latest NGINX package.

```bash
sudo apt-get -y update
sudo apt-get -y install nginx
```

When done, type `exit` to leave the SSH session.


## View the web server in action

Use a web browser of your choice to view the default NGINX welcome page. Enter the public IP address of the VM as the web address. The public IP address can be found on the VM overview page or as part of the SSH connection string you used earlier.

![NGINX default Welcome page](./media/quick-create-cli/nginix-welcome-page.png)

## Clean up resources

When no longer needed, you can use the [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) cmdlet to remove the resource group, VM, and all related resources:

```azurepowershell-interactive
Remove-AzResourceGroup -Name "myResourceGroup"
```

## Next steps

In this quickstart, you deployed a simple virtual machine, created a Network Security Group and rule, and installed a basic web server. To learn more about Azure virtual machines, continue to the tutorial for Linux VMs.

> [!div class="nextstepaction"]
> [Azure Linux virtual machine tutorials](./tutorial-manage-vm.md)
