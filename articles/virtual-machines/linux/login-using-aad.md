---
title: Log in to a Linux VM with Azure Active Directory credentials | Microsoft Docs
description: In this howto, you learn how to create and configure a Linux VM to use Azure Active Directory authentication for user logins
services: virtual-machines-linux
documentationcenter: ''
author: mahesh-unnikrishnan
manager: jeconnoc
editor:

ms.assetid:
ms.service: virtual-machines-linux
ms.devlang: azurecli
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 03/30/2018
ms.author: maheshu
---

# Log in to a Linux virtual machine in Azure using Azure Active Directory authentication *Preview*
To improve the security of Linux virtual machines (VMs) in Azure, you can integrate with Azure Active Directory (AD) authentication. When you use Azure AD authentication for Linux VMs, you centrally control and enforce policies that allow or deny access to the VMs. This article shows you how to create and configure a Linux VM to use Azure AD authentication.

## Benefits of using Azure AD authentication
There are many benefits of using Azure AD authentication to log in to Linux VMs in Azure, including:

- **Improved security:**
  - You can use your corporate AD credentials to log in to Azure Linux VMs. There is no need to create local administrator accounts and manage credential lifetime.
  - By reducing your reliance on local administrator accounts, you do not need to worry about credential loss/theft, users configuring weak credentials etc.
  - The password complexity and password lifetime policies configured for your Azure AD directory help secure Linux VMs as well.
  - The VM is not susceptible to password brute force attacks on local administrator accounts.
  - You can configure multiple factor authentication or conditional access control policies to further secure login to Azure virtual machines.

- **Seamless collaboration:** Using RBAC roles you can specify who has access to a given VM, as a regular user or with administrator privileges. When users join or leave your team, you can update the RBAC policy for the VM to grant or deny access as appropriate. This experience is much simpler than having to scrub VMs to remove unnecessary SSH public keys. When employees leave your organization, they no longer have access to your resources.

## Supported Azure regions and Linux distributions

The following Linux distributions are currently supported during the preview of this feature:

| Distribution | Version |
| --- | --- |
| Ubuntu Server | Ubuntu 16.04 LTS and Ubuntu Server 17.10 |

The following Azure regions are currently supported during the preview of this feature:

- South Central US

>[!IMPORTANT]
> To use this preview feature, only deploy a supported Linux distro and in a supported Azure region.

## Create a Linux virtual machine

Create a resource group with [az group create](/cli/azure/group#az-group-create), then create a VM with [az vm create](/cli/azure/vm#az-vm-create) using a supported distro and in a supported region. The following example deploys an *Ubuntu 16.04 LTS* VM into the *southcentralus* region:

```azurecli-interactive
az group create --name myResourceGroup --location southcentralus

az vm create \
    --resource-group myResourceGroup \
    --name myVM \
    --image UbuntuLTS \
    --generate-ssh-keys
```

It takes a few minutes to create the VM and supporting resources.

## Install the Azure AD login VM extension

To log in to a Linux VM with Azure AD credentials, install the Azure Active Directory log in VM extension. VM extensions are small applications that provide post-deployment configuration and automation tasks on Azure virtual machines. Use [az vm extension set](/cli/azure/vm/extension#az-vm-extension-set) to install the *AADLoginForLinux* extension on the VM named *myVM* in the *myResourceGroup* resource group:

```azurecli-interactive
az vm extension set \
    --publisher Microsoft.Azure.ActiveDirectory.LinuxSSH.Edp \
    --name AADLoginForLinux \
    --resource-group myResourceGroup \
    --vm-name myVM
```

The *provisioningState* of *Succeeded* is shown once the extension is installed on the VM.

## Configure RBAC policy for the virtual machine

Azure Role-Based Access Control (RBAC) policy determines who can log in to the VM. Two RBAC roles are used to authorize VM login:

- **Virtual Machine Administrator Login**: Users with this role assigned can log in to an Azure virtual machine with Windows Administrator or Linux root user privileges.
- **Virtual Machine User Login**: Users with this role assigned can log in to an Azure virtual machine with regular user privileges.

The following example uses [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) to assign the *Virtual Machine Administrator Login* role to the VM for your current Azure user. The username of your active Azure account is obtained with [az account show](/cli/azure/account#az-account-show), and the *scope* is set to the VM created in a previous step with [az vm show](/cli/azure/vm#az-vm-show):

```azurecli-interactive
username=$(az account show --query user.name --output tsv)
vm=$(az vm show --resource-group myResourceGroup --name myVM --query id -o tsv)

az role assignment create \
    --role "Virtual Machine Administrator Login" \
    --assignee $username \
    --scope $vm
```

For more information on how to use Role-Based Access Control to manage access to your Azure subscription resources, see using the [Azure CLI 2.0](../../role-based-access-control/role-assignments-cli.md), [Azure portal](../../role-based-access-control/role-assignments-portal.md), or [Azure PowerShell](../../role-based-access-control/role-assignments-powershell.md).

You can also configure Azure AD to require multi-factor authentication for a specific user to sign in to the Linux virtual machine. For more information, see [Getting started with Azure Multi-Factor Authentication in the cloud](../../multi-factor-authentication/multi-factor-authentication-get-started-cloud).

## Log in to the Linux virtual machine

First, view the public IP address of your VM with [az vm show](/cli/azure/vm#az-vm-show):

```azurecli-interactive
az vm show --resource-group myResourceGroup --name myVM -d --query publicIps -o tsv
```

Log in to the Azure Linux virtual machine using your Azure AD credentials. The *-l* parameter lets you specify your own Azure AD account address. Specify the public IP address of your VM as output in the previous command:

```azurecli-interactive
ssh -l azureuser@contoso.onmicrosoft.com publicIps
```

You are prompted to sign in to Azure AD with a one-time use code at [https://microsoft.com/devicelogin](https://microsoft.com/devicelogin). Copy and paste the one-time use code into the device login page, as shown in the following example:

```bash
~$ ssh -l azureuser@contoso.onmicrosoft.com 13.65.237.247
To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code FJS3K6X4D to authenticate. Press ENTER when ready.
```

When prompted, enter your Azure AD login credentials. The following message is shown in the web browser when you have successfully authenticated:

    You have signed in to the Microsoft Azure Linux Virtual Machine Sign-In application on your device.

At the SSH prompt, press the **Enter** key. You are now signed in to the Azure Linux virtual machine with the role permissions as assigned, such as *VM User* or *VM Administrator*.

## Troubleshoot sign-in issues

If you see the following error on your SSH prompt, verify that you have [configured RBAC policies](#configure-rbac-policy-for-the-virtual-machine) for the VM that grants the user either the *Virtual Machine Administrator Login* or *Virtual Machine User Login* role:

```bash
login as: azureuser@contoso.onmicrosoft.com
Using keyboard-interactive authentication.
To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code FJX327AXD to authenticate. Press ENTER when ready.
Using keyboard-interactive authentication.
Access denied:  to sign-in you be assigned a role with action 'Microsoft.Compute/virtualMachines/login/action', for example 'Virtual Machine User Login'
Access denied
```

## Next steps

For more information on Azure Active Directory, see [What is Azure Active Directory](../../active-directory/active-directory-whatis.md) and [How to get started with Azure Active Directory](../../active-directory/get-started-azure-ad.md)