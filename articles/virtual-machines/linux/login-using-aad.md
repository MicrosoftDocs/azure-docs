---
title: Log in to a Linux VM with Azure Active Directory credentials | Microsoft Docs
description: In this howto, you learn how to create and configure a Linux VM to use Azure Active Directory authentication for user logins
services: virtual-machines-linux
documentationcenter: ''
author: cynthn
manager: jeconnoc
editor:

ms.assetid:
ms.service: virtual-machines-linux
ms.devlang: azurecli
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 06/17/2018
ms.author: cynthn
---

# Log in to a Linux virtual machine in Azure using Azure Active Directory authentication (Preview)

To improve the security of Linux virtual machines (VMs) in Azure, you can integrate with Azure Active Directory (AD) authentication. When you use Azure AD authentication for Linux VMs, you centrally control and enforce policies that allow or deny access to the VMs. This article shows you how to create and configure a Linux VM to use Azure AD authentication.

> [!NOTE]
> This feature is in preview and is not recommended for use with production virtual machines or workloads. Use this feature on a test virtual machine that you expect to discard after testing.

There are many benefits of using Azure AD authentication to log in to Linux VMs in Azure, including:

- **Improved security:**
  - You can use your corporate AD credentials to log in to Azure Linux VMs. There is no need to create local administrator accounts and manage credential lifetime.
  - By reducing your reliance on local administrator accounts, you do not need to worry about credential loss/theft, users configuring weak credentials etc.
  - The password complexity and password lifetime policies configured for your Azure AD directory help secure Linux VMs as well.
  - To further secure login to Azure virtual machines, you can configure multi-factor authentication.
  - The ability to log in to Linux VMs with Azure Active Directory also works for customers that use [Federation Services](../../active-directory/hybrid/how-to-connect-fed-whatis.md).

- **Seamless collaboration:** With Role-Based Access Control (RBAC), you can specify who can sign in to a given VM as a regular user or with administrator privileges. When users join or leave your team, you can update the RBAC policy for the VM to grant access as appropriate. This experience is much simpler than having to scrub VMs to remove unnecessary SSH public keys. When employees leave your organization and their user account is disabled or removed from Azure AD, they no longer have access to your resources.

### Supported Azure regions and Linux distributions

The following Linux distributions are currently supported during the preview of this feature:

| Distribution | Version |
| --- | --- |
| CentOS | CentOS 6.9, and CentOS 7.4 |
| Debian | Debian 9 |
| RedHat Enterprise Linux | RHEL 6, RHEL 7 | 
| Ubuntu Server | Ubuntu 14.04 LTS, Ubuntu Server 16.04, Ubuntu Server 17.10, and Ubuntu Server 18.04 |

The following Azure regions are currently supported during the preview of this feature:

- All global Azure regions

>[!IMPORTANT]
> To use this preview feature, only deploy a supported Linux distro and in a supported Azure region. The feature is not supported in Azure Government or sovereign clouds.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this tutorial requires that you are running the Azure CLI version 2.0.31 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli).

## Create a Linux virtual machine

Create a resource group with [az group create](/cli/azure/group#az-group-create), then create a VM with [az vm create](/cli/azure/vm#az-vm-create) using a supported distro and in a supported region. The following example deploys a VM named *myVM* that uses *Ubuntu 16.04 LTS* into a resource group named *myResourceGroup* in the *southcentralus* region. In the following examples, you can provide your own resource group and VM names as needed.

```azurecli-interactive
az group create --name myResourceGroup --location southcentralus

az vm create \
    --resource-group myResourceGroup \
    --name myVM \
    --image UbuntuLTS \
    --admin-username azureuser \
    --generate-ssh-keys
```

It takes a few minutes to create the VM and supporting resources.

## Install the Azure AD login VM extension

To log in to a Linux VM with Azure AD credentials, install the Azure Active Directory log in VM extension. VM extensions are small applications that provide post-deployment configuration and automation tasks on Azure virtual machines. Use [az vm extension set](/cli/azure/vm/extension#az-vm-extension-set) to install the *AADLoginForLinux* extension on the VM named *myVM* in the *myResourceGroup* resource group:

```azurecli-interactive
az vm extension set \
    --publisher Microsoft.Azure.ActiveDirectory.LinuxSSH \
    --name AADLoginForLinux \
    --resource-group myResourceGroup \
    --vm-name myVM
```

The *provisioningState* of *Succeeded* is shown once the extension is installed on the VM.

## Configure role assignments for the VM

Azure Role-Based Access Control (RBAC) policy determines who can log in to the VM. Two RBAC roles are used to authorize VM login:

- **Virtual Machine Administrator Login**: Users with this role assigned can log in to an Azure virtual machine with Windows Administrator or Linux root user privileges.
- **Virtual Machine User Login**: Users with this role assigned can log in to an Azure virtual machine with regular user privileges.

> [!NOTE]
> To allow a user to log in to the VM over SSH, you must assign either the *Virtual Machine Administrator Login* or *Virtual Machine User Login* role. An Azure user with the *Owner* or *Contributor* roles assigned for a VM do not automatically have privileges to log in to the VM over SSH.

The following example uses [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) to assign the *Virtual Machine Administrator Login* role to the VM for your current Azure user. The username of your active Azure account is obtained with [az account show](/cli/azure/account#az-account-show), and the *scope* is set to the VM created in a previous step with [az vm show](/cli/azure/vm#az-vm-show). The scope could also be assigned at a resource group or subscription level, and normal RBAC inheritance permissions apply. For more information, see [Role-Based Access Controls](../../azure-resource-manager/resource-group-overview.md#access-control)

```azurecli-interactive
username=$(az account show --query user.name --output tsv)
vm=$(az vm show --resource-group myResourceGroup --name myVM --query id -o tsv)

az role assignment create \
    --role "Virtual Machine Administrator Login" \
    --assignee $username \
    --scope $vm
```

> [!NOTE]
> If your AAD domain and logon username domain do not match, you must specify the object ID of your user account with the *--assignee-object-id*, not just the username for *--assignee*. You can obtain the object ID for your user account with [az ad user list](/cli/azure/ad/user#az-ad-user-list).

For more information on how to use RBAC to manage access to your Azure subscription resources, see using the [Azure CLI](../../role-based-access-control/role-assignments-cli.md), [Azure portal](../../role-based-access-control/role-assignments-portal.md), or [Azure PowerShell](../../role-based-access-control/role-assignments-powershell.md).

You can also configure Azure AD to require multi-factor authentication for a specific user to sign in to the Linux virtual machine. For more information, see [Get started with Azure Multi-Factor Authentication in the cloud](../../multi-factor-authentication/multi-factor-authentication-get-started-cloud.md).

## Log in to the Linux virtual machine

First, view the public IP address of your VM with [az vm show](/cli/azure/vm#az-vm-show):

```azurecli-interactive
az vm show --resource-group myResourceGroup --name myVM -d --query publicIps -o tsv
```

Log in to the Azure Linux virtual machine using your Azure AD credentials. The `-l` parameter lets you specify your own Azure AD account address. Specify the public IP address of your VM as output in the previous command:

```azurecli-interactive
ssh -l azureuser@contoso.onmicrosoft.com publicIps
```

You are prompted to sign in to Azure AD with a one-time use code at [https://microsoft.com/devicelogin](https://microsoft.com/devicelogin). Copy and paste the one-time use code into the device login page, as shown in the following example:

```bash
~$ ssh -l azureuser@contoso.onmicrosoft.com 13.65.237.247
To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code FJS3K6X4D to authenticate. Press ENTER when ready.
```

When prompted, enter your Azure AD login credentials at the login page. The following message is shown in the web browser when you have successfully authenticated:

    You have signed in to the Microsoft Azure Linux Virtual Machine Sign-In application on your device.

Close the browser window, return to the SSH prompt, and press the **Enter** key. You are now signed in to the Azure Linux virtual machine with the role permissions as assigned, such as *VM User* or *VM Administrator*. If your user account is assigned the *Virtual Machine Administrator Login* role, you can use the `sudo` to run commands that require root privileges.

## Troubleshoot sign-in issues

Some common errors when you try to SSH with Azure AD credentials include no RBAC roles assigned, and repeated prompts to sign in. Use the following sections to correct these issues.

### Access denied: RBAC role not assigned

If you see the following error on your SSH prompt, verify that you have [configured RBAC policies](#configure-rbac-policy-for-the-virtual-machine) for the VM that grants the user either the *Virtual Machine Administrator Login* or *Virtual Machine User Login* role:

```bash
login as: azureuser@contoso.onmicrosoft.com
Using keyboard-interactive authentication.
To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code FJX327AXD to authenticate. Press ENTER when ready.
Using keyboard-interactive authentication.
Access denied:  to sign-in you be assigned a role with action 'Microsoft.Compute/virtualMachines/login/action', for example 'Virtual Machine User Login'
Access denied
```

### Continued SSH sign-in prompts

If you successfully complete the authentication step in a web browser, you may be immediately prompted to sign in again with a fresh code. This error is typically caused by a mismatch between the sign-in name you specified at the SSH prompt and the account you signed in to Azure AD with. To correct this issue:

- Verify that the sign-in name you specified at the SSH prompt is correct. A typo in the sign-in name could cause a mismatch between the sign-in name you specified at the SSH prompt and the account you signed in to Azure AD with. For example, you typed *azuresuer@contoso.onmicrosoft.com* instead of *azureuser@contoso.onmicrosoft.com*.
- If you have multiple user accounts, make sure you don't provide a different user account in the browser window when signing in to Azure AD.
- Linux is a case-sensitive operating system. There is a difference between 'Azureuser@contoso.onmicrosoft.com' and 'azureuser@contoso.onmicrosoft.com', which can cause a mismatch. Make sure that you specify the UPN with the correct case-sensitivity at the SSH prompt.

## Preview feedback

Share your feedback about this preview feature or report issues using it on the [Azure AD feedback forum](https://feedback.azure.com/forums/169401-azure-active-directory?category_id=166032)

## Next steps

For more information on Azure Active Directory, see [What is Azure Active Directory](../../active-directory/fundamentals/active-directory-whatis.md)
