---
title: Log in to a Linux VM with Azure Active Directory credentials 
description: Learn how to create and configure a Linux VM to sign in using Azure Active Directory authentication.
author: SanDeo-MSFT
ms.service: virtual-machines
ms.topic: how-to
ms.workload: infrastructure
ms.date: 11/17/2020
ms.author: sandeo
---

# Preview: Log in to a Linux virtual machine in Azure using Azure Active Directory authentication

To improve the security of Linux virtual machines (VMs) in Azure, you can integrate with Azure Active Directory (AD) authentication. When you use Azure AD authentication for Linux VMs, you centrally control and enforce policies that allow or deny access to the VMs. This article shows you how to create and configure a Linux VM to use Azure AD authentication.


> [!IMPORTANT]
> Azure Active Directory authentication is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
> Use this feature on a test virtual machine that you expect to discard after testing.


There are many benefits of using Azure AD authentication to log in to Linux VMs in Azure, including:

- **Improved security:**
  - You can use your corporate AD credentials to log in to Azure Linux VMs. There is no need to create local administrator accounts and manage credential lifetime.
  - By reducing your reliance on local administrator accounts, you do not need to worry about credential loss/theft, users configuring weak credentials etc.
  - The password complexity and password lifetime policies configured for your Azure AD directory help secure Linux VMs as well.
  - To further secure login to Azure virtual machines, you can configure multi-factor authentication, device-based controls, and passwordless credentials.
  - The ability to log in to Linux VMs with Azure Active Directory also works for customers that use [Federation Services](../../active-directory/hybrid/how-to-connect-fed-whatis.md).

- **Seamless collaboration:** With Azure role-based access control (Azure RBAC), you can specify who can sign in to a given VM as a regular user or with administrator privileges. When users join or leave your team, you can update the Azure RBAC policy for the VM to grant access as appropriate. This experience is much simpler than having to scrub VMs to remove unnecessary SSH public keys. When employees leave your organization and their user account is disabled or removed from Azure AD, they no longer have access to your resources.

## Supported Azure regions and Linux distributions

The following Linux distributions are currently supported during the preview of this feature:

| Distribution | Version |
| --- | --- |
| CentOS | CentOS 7, CentOS 8.3 |
| Debian | Debian 8, Debian 9 |
| openSUSE | openSUSE Leap 42.3 |
| RedHat Enterprise Linux | RHEL 7, RHEL 8.3 | 
| SUSE Linux Enterprise Server | SLES 12 |
| Ubuntu Server | Ubuntu Server 14.04 to Ubuntu Server 20.04 |


The following Azure regions are currently supported during the preview of this feature:

- All global Azure regions
- Azure Government

>[!IMPORTANT]
> To use this preview feature, only deploy a supported Linux distro and in a supported Azure region. The feature is not supported in all sovereign clouds.
>
> It's not supported to use this extension on Azure Kubernetes Service (AKS) clusters. For more information, see [Support policies for AKS](../../aks/support-policies.md).


If you choose to install and use the CLI locally, this tutorial requires that you are running the Azure CLI version 2.21.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli).

## Network requirements

To enable Azure AD authentication for your Linux VMs in Azure, you need to ensure your VMs network configuration permits outbound access to the following endpoints over TCP:

* https:\//packages.microsoft.com
* http:\//169.254.169.254\/metadata

## Sign in to Azure CLI and install the SSH extension

Run the following command to log into Azure CLI. This will open your system's default browser.

```azurecli-interactive
az login
```

Next, run the following command to install the SSH exentsion for Azure CLI. The minimum version required for the extension is 0.1.4

```azurecli-interactive
az extension add --name ssh
```

Optionally, check the installed SSH extension version with the following command.

```azurecli-interactive
az extension show --name ssh
```

## Create a Linux virtual machine

Create a resource group with [az group create](/cli/azure/group#az-group-create), then create a VM with [az vm create](/cli/azure/vm#az-vm-create) using a supported distro and in a supported region. The following example deploys a VM named *myVM* that uses *Ubuntu 18.04 LTS* into a resource group named *myResourceGroup* in the *southcentralus* region. In the following examples, you can provide your own resource group and VM names as needed.

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

## Assign the VM a system assigned managed identity

The following example deploys a system assigned managed identity to the VM named *myVM* that uses *Ubuntu 18.04 LTS* into a resource group named *myResourceGroup* in the *southcentralus* region. In the following examples, you can provide your own resource group and VM names as needed.

```azurecli-interactive
az vm identity assign --resource-group myResourceGroup --name myVM
```

## Install the Azure AD login VM extension

> [!NOTE]
> If deploying this extension to a previously created VM ensure the machine has at least 1GB of memory allocated else the extension will fail to install

To log in to a Linux VM with Azure AD credentials, install the Azure Active Directory login VM extension. VM extensions are small applications that provide post-deployment configuration and automation tasks on Azure virtual machines. Use [az vm extension set](/cli/azure/vm/extension#az-vm-extension-set) to install the *AADLoginForLinux* extension on the VM named *myVM* in the *myResourceGroup* resource group:

```azurecli-interactive
az vm extension set \
    --publisher Microsoft.Azure.ActiveDirectory.LinuxSSH \
    --name AADLoginForLinux \
    --resource-group myResourceGroup \
    --vm-name myVM
```

The *provisioningState* of *Succeeded* is shown once the extension is successfully installed on the VM. The VM needs a running VM agent to install the extension. For more information, see [VM Agent Overview](../extensions/agent-windows.md).

## Configure role assignments for the VM

Azure role-based access control (Azure RBAC) policy determines who can log in to the VM. Two Azure roles are used to authorize VM login:

- **Virtual Machine Administrator Login**: Users with this role assigned can log in to an Azure virtual machine with Windows Administrator or Linux root user privileges.
- **Virtual Machine User Login**: Users with this role assigned can log in to an Azure virtual machine with regular user privileges.

> [!NOTE]
> To allow a user to log in to the VM over SSH, you must assign either the *Virtual Machine Administrator Login* or *Virtual Machine User Login* role. The Virtual Machine Administrator Login and Virtual Machine User Login roles use dataActions and thus cannot be assigned at management group scope. Currently these roles can only be assigned at the subscription, resource group or resource scope. An Azure user with the *Owner* or *Contributor* roles assigned for a VM do not automatically have privileges to log in to the VM over SSH. It is recommended that the roles be assigned at the subscription or resource group level, not at the individual VM level.

The following example uses [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) to assign the *Virtual Machine Administrator Login* role to the VM for your current Azure user. The username of your active Azure account is obtained with [az account show](/cli/azure/account#az-account-show), and the *scope* is set to the VM created in a previous step with [az vm show](/cli/azure/vm#az-vm-show). The scope could also be assigned at a resource group or subscription level, and normal Azure RBAC inheritance permissions apply. For more information, see [Azure RBAC](../../role-based-access-control/overview.md)

```azurecli-interactive
username=$(az account show --query user.name --output tsv)

az role assignment create \
    --role "Virtual Machine Administrator Login" \
    --assignee $username \
    --scope myResourceGroup
```

> [!NOTE]
> If your AAD domain and logon username domain do not match, you must specify the object ID of your user account with the *--assignee-object-id*, not just the username for *--assignee*. You can obtain the object ID for your user account with [az ad user list](/cli/azure/ad/user#az-ad-user-list).

For more information on how to use Azure RBAC to manage access to your Azure subscription resources, see using the [Azure CLI](../../role-based-access-control/role-assignments-cli.md), [Azure portal](../../role-based-access-control/role-assignments-portal.md), or [Azure PowerShell](../../role-based-access-control/role-assignments-powershell.md).

## Using Conditional Access

You can enforce Conditional Access policies such as multi-factor authentication, Hybrid Azure AD Join, Intune compliance, or user sign-in risk check before authorizing access to Linux VMs in Azure that are enabled with Azure AD sign in. To apply Conditional Access policy, you must select the "Azure Linux VM Sign-In" app from the cloud apps or actions assignment option and then use Sign-in risk as a condition and/or require multi-factor authentication, Hybrid Azure AD Join, and/or Device Compliance as grant access controls.

> [!WARNING]
> Per-user Enabled/Enforced Azure AD Multi-Factor Authentication is not supported for VM sign-in.

## Log in to the Linux virtual machine

### Log in with Azure CLI

Log in to the Azure Linux virtual machine using your Azure AD credentials. The following example automatically resolves the appropriate IP address for the VM.

```azurecli-interactive
az ssh vm --vm-name myVM --resource-group myResourceGroup
```

The following example shows how to manually specify the VM's IP address. Replace the example IP address with the private or public IP of your VM.

```azurecli-interactive
az ssh vm --ip 10.11.123.456
```

If prompted, enter your Azure AD login credentials at the login page, perform an MFA, and/or satisfy device checks. You will only be prompted if your az cli session does not already meet any required Conditional Access criteria. 

Close the browser window, return to the SSH prompt, and you will be automatically connected to the VM. 

You are now signed in to the Azure Linux virtual machine with the role permissions as assigned, such as *VM User* or *VM Administrator*. If your user account is assigned the *Virtual Machine Administrator Login* role, you can use `sudo` to run commands that require root privileges.

### Log in with Azure Cloud Shell

You can use Azure Cloud Shell to connect to VMs without needing to install anything lcoally to your client machine. Start Cloud Shell by clicking the shell icon in the upper right corner of the [Azure Portal](https://portal.azure.com).

<img width="477" alt="2021-03-23_22-33-23" src="https://user-images.githubusercontent.com/19227815/112260975-2a3aa900-8c28-11eb-9e61-128a379640aa.png">

Azure Cloud Shell will automatically connect to a session in the context of the signed in user. During the Azure AD Login for Linux Public Preview you must run ```az login``` again and go through an interactive sign in flow.

```azurecli-interactive
az login
```

<img width="402" alt="2021-03-23_22-36-33" src="https://user-images.githubusercontent.com/19227815/112261043-48a0a480-8c28-11eb-8ec8-c22afe35b1c9.png">

Then you can use the normal ```az ssh vm``` commands to connect.

```azurecli-interactive
az ssh vm --vm-name myVM --resource-group myResourceGroup
```

### Log in with a Service Principal

Azure CLI supports authenticating with a service principal instead of a user account. Service principals can also be used to SSH to a VM. The service principal must have *VM Administrator* or *VM User* rights assigned. It is recommended to assign them at the subscription or resource group level. [Follow the instructions to connect to Azure CLI with a service principal](https://docs.microsoft.com/en-us/cli/azure/authenticate-azure-cli#sign-in-with-a-service-principal).

The following example will assign *VM Administrator* rights to the service principal at the resource group level. Replace the service principal object ID, subscription ID, and resource group name fields.

```azurecli-interactive
az role assignment create \
    --role "Virtual Machine Administrator Login" \
    --assignee-object-id <service-principal-objectid> \
    --assignee-principal-type ServicePrincipal \
    --scope "/subscriptions/<subscription-id>/resourceGroups/<resourcegroup-name>"
```

Use the following example to authenticate to Azure CLI using the service principal.

```azurecli-interactive
az login --service-principal -u <app-url> -p <password-or-cert> --tenant <tenant>
```

Once authentication with a service principal is complete you can use the normal Azure CLI SSH commands to connect to the VM.

```azurecli-interactive
az ssh vm --vm-name myVM --resource-group myResourceGroup
```

### Exporting SSH Configuration for use with generic OpenSSH clients

Login to Azure Linux VMs with Azure AD supports exporting the OpenSSH certificate and configuration to files, allowing you to use any generic OpenSSH-based tool to sign in Azure AD. The following example exports the configuration for all IP addresses assigned to the VM.

```azurecli-interactive
az ssh config --file ~/.ssh/config --vm-name myVM -g myResourceGroup
```

Alternatively, you can export the config by specifying just the IP address. Replace the IP address in the example with the public or private IP address for your VM.

```azurecli-interactive
az ssh config --file ~/.ssh/config --ip 10.11.123.456
```

You can then connect to the VM through normal OpenSSH usage. This can be done through any client that leverages OpenSSH.

```
ssh 10.11.123.456
```

## Sudo and AAD login

Users assigned the *VM Administrator* role will be able to run `sudo` with no additional interaction required. Users assigned the *VM User* role will not be able to run `sudo`.

## VM Scale Set Support

VM Scale Sets are supported, but the steps are slightly different for enabling and connecting to VMSS VMs.

Enable a system assigned managed identity for your existing VM Scale Set.

```azurecli-interactive
az vmss identity assign --resource-group myResourceGroup --name myVMSS
```

Install the Azure AD extension on your VMSS VMs.

```azurecli-interactive
az vmss extension set --publisher Microsoft.Azure.ActiveDirectory.LinuxSSH --name AADLoginForLinux --resource-group myResourceGroup --vmss-name myVMSS
```

VMSS VMs usually do not have public IP addresses, so you must have connectivity to them from another machine that can reach their Azure Virtual Network. This example shows how to use the private IP of a VMSS VM to connect. You cannot auto-determine the VMSS VM's IP addresses using the --resource-group and --name switches.

```azurecli-interactive
az ssh vm --ip 10.11.123.456
```

## Troubleshoot sign-in issues

Some common errors when you try to SSH with Azure AD credentials include no Azure roles assigned, and repeated prompts to sign in. Use the following sections to correct these issues.

### Access denied: Azure role not assigned

If you see the following error on your SSH prompt, verify that you have configured Azure RBAC policies for the VM that grants the user either the *Virtual Machine Administrator Login* or *Virtual Machine User Login* role:

```output
login as: azureuser@contoso.onmicrosoft.com
Using keyboard-interactive authentication.
To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code FJX327AXD to authenticate. Press ENTER when ready.
Using keyboard-interactive authentication.
Access denied:  to sign-in you be assigned a role with action 'Microsoft.Compute/virtualMachines/login/action', for example 'Virtual Machine User Login'
Access denied
```
> [!NOTE]
> If you are running into issues with Azure role assignments, see [Troubleshoot Azure RBAC](../../role-based-access-control/troubleshooting.md#azure-role-assignments-limit).

### System assigned managed identity missing

### VMSS connection issues

VMSS VM connections may fail if the VMSS instances are running an old model. Upgrading VMSS instances to the latest model may resolve issues, especially if this has not been done since the AAD Login extension was installed. Upgrading an instance applies a standard VMSS configuration to the individual instance.

<img width="1300" alt="2021-03-23_23-49-25" src="https://user-images.githubusercontent.com/19227815/112267348-8d313d80-8c32-11eb-941e-a260d884e865.png">

### Other limitations

Users that inherit access rights through nested groups or role assignments aren't currently supported. The user or group must be directly assigned the [required role assignments](#configure-role-assignments-for-the-vm). For example, the use of management groups or nested group role assignments won't grant the correct permissions to allow the user to sign in.

## Preview feedback

Share your feedback about this preview feature or report issues using it on the [Azure AD feedback forum](https://feedback.azure.com/forums/169401-azure-active-directory?category_id=166032)

## Next steps

For more information on Azure Active Directory, see [What is Azure Active Directory](../../active-directory/fundamentals/active-directory-whatis.md)
