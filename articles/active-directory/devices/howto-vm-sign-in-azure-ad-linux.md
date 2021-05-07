---
title: Sign in to Linux virtual machine in Azure using Azure Active Directory (Preview)
description: Azure AD sign in to an Azure VM running Linux

services: active-directory
ms.service: active-directory
ms.subservice: devices
ms.topic: how-to
ms.date: 05/06/2021

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: sandeo
ms.custom: references_regions, devx-track-azurecli
ms.collection: M365-identity-device-management
---
# Preview: Login to a Linux virtual machine in Azure with Azure Active Directory using SSH certificate-based authentication

To improve the security of Linux virtual machines (VMs) in Azure, you can integrate with Azure Active Directory (AD) authentication. You can now use Azure AD as a core authentication platform and a certificate authority to SSH into a Linux VM with AD and SSH certificate-based authentication. Additionally, you will be able to centrally control and enforce Azure RBAC and Conditional Access policies that allow or deny access to the VMs. This article shows you how to create and configure a Linux VM and login with Azure AD using SSH certificate-based authentication.

> [!IMPORTANT]
> This capability is currently in public preview. The previous version that made use of device code flow will be deprecated August 15, 2021. If you are still using that version and need to refer to the documentation, visit [Deprecated] Login to Linux VM in Azure with Azure AD authentication using device code flow. If you wish to migrate from the old version to this refresh version, visit migrating Azure AD login from device code flow to SSH certificate-based authentication. 
> This feature is being replaced with the ability to use Azure AD and SSH via certificate-based authentication. For more information, see the article, [](../active-directory/devices/.md).

There are many security benefits of using Azure AD with SSH certificate-based authentication to log in to Linux VMs in Azure, including:

- Use your corporate AD credentials to log in to Azure Linux VMs. There is no need to create local administrator accounts and manage credential lifetime.
- Get SSH key based authentication without needing to distribute SSH keys to users or provision SSH public keys on any Azure Linux VMs you deploy. This experience is much simpler than having to worry about sprawl of stale SSH public keys that need to be scrub on the VMs to prevent unauthorized access.
- Reduce your reliance on local administrator accounts, you do not need to worry about credential loss/theft, users configuring weak credentials etc.
- Password complexity and password lifetime policies configured for your Azure AD directory help secure Linux VMs as well.
- With Azure role-based access control (Azure RBAC), specify who can login to a VM as a regular user or with administrator privileges. When users join or leave your team, you can update the Azure RBAC policy for the VM to grant access as appropriate. When employees leave your organization and their user account is disabled or removed from Azure AD, they no longer have access to your resources.
- With Conditional Access, configure policies to require multi-factor authentication and/or require client device you are using to SSH be a managed device (for example: compliant device or hybrid Azure AD joined) before you can SSH to Linux VMs. 
- Use Azure deploy and audit policies to require Azure AD login for Linux VMs and to flag use of no approved local account on the VMs.
- Login to Linux VMs with Azure Active Directory also works for customers that use Federation Services.

## Supported Linux distributions and Azure regions

The following Linux distributions are currently supported during the preview of this feature:

| Distribution | Version |
| --- | --- |
| CentOS | CentOS 7, CentOS 8.3 |
| Debian | Debian 9, Debian 10 |
| openSUSE | openSUSE Leap 42.3 |
| RedHat Enterprise Linux | RHEL 7.4 to RHEL 7.10, RHEL 8.3 |
| SUSE Linux Enterprise Server | SLES 12 |
| Ubuntu Server | Ubuntu Server 16.04 to Ubuntu Server 20.04 |

The following Azure regions are currently supported during the preview of this feature:

- Azure Global
- Azure Government
- Azure China
 
Important
To use this preview feature, only deploy a supported Linux distro and in a supported Azure region.
It's not supported to use this extension on Azure Kubernetes Service (AKS) clusters. For more information, see Support policies for AKS.

If you choose to install and use the CLI locally, this tutorial requires that you are running the Azure CLI version 2.22.1 or later. Run az --version to find the version. If you need to install or upgrade, see Install Azure CLI.

## Requirements for login with Azure AD using SSH certificate-based authentication

To enable Azure AD login using SSH certificate-based authentication for your Linux VMs in Azure, you need to ensure the following network, virtual machine, and client (ssh client) requirements are met.

### Network

VM network configuration must permit outbound access to the following endpoints over TCP port 443:

For Azure Global
- https://packages.microsoft.com – For package installation and upgrades.
- http://169.254.169.254 – Azure Instance Metadata Service endpoint.
- https://login.microsoftonline.com – For PAM (pluggable authentication modules) based authentication flows.
- https://pas.windows.net – For Azure RBAC flows.

For Azure Government

- https://packages.microsoft.com – For package installation and upgrades.
- http://169.254.169.254 – Azure Instance Metadata Service endpoint.
- https://login.microsoftonline.us – For PAM (pluggable authentication modules) based authentication flows.
- https://pasff.usgovcloudapi.net – For Azure RBAC flows.

For Azure China

- https://packages.microsoft.com – For package installation and upgrades.
- http://169.254.169.254 – Azure Instance Metadata Service endpoint.
- https://login.chinacloudapi.cn – For PAM (pluggable authentication modules) based authentication flows.
- https://pas.chinacloudapi.cn – For Azure RBAC flows.

### Virtual machine

Ensure your VM is enabled with the following:

- System assigned managed identity. This option gets automatically selected when you use Azure portal to create VM and select Azure AD login option. You can also enable System assigned managed identity on a new or an existing VM using Az.
- aadsshlogin and aadsshlogin-selinux (as appropriate). These packages get installed with AADSSHLoginForLinux VM extension. The extension is installed when you use Azure portal to create VM and enable Azure AD login (Management tab). You can also install the extension on an existing VM using Az.

### Client

Ensure your client meets the following requirements:

- SSH client must support OpenSSH based certificates for authentication. You can use Az CLI (2.21.1 or higher) or Azure Cloud Shell to meet this requirement. 
- SSH extension for Az CLI. You can install this using az. You do not need to install this extension when using Azure Cloud Shell as it comes pre-installed.
- If you are using any other SSH client other than Az CLI or Azure Cloud Shell that supports OpenSSH, you will still need to use Az CLI with SSH extension to retrieve ephemeral SSH cert in a config file and then use the config file with your SSH client.

## Enabling Azure AD login in for Linux VM in Azure

To use Azure AD login in for Linux VM in Azure, you need to first enable Azure AD login option for your Linux VM, configure Azure role assignments for users who are authorized to login in to the VM and then use SSH client that supports OpensSSH such as Az CLI or Az Cloud Shell to SSH to your Linux VM. There are multiple ways you can enable Azure AD login for your Linux VM, as an example you can use:

- Azure portal experience when creating a Linux VM
- Azure Cloud Shell experience when creating a Windows VM or for an existing Linux VM

### Using Azure portal create VM experience to enable Azure AD login

You can enable Azure AD login for any of the supported Linux distributions mentioned above.

As an example, to create an Ubuntu Server 18.04 LTS VM in Azure with Azure AD logon:

1. Sign in to the Azure portal, with an account that has access to create VMs, and select **+ Create a resource**.
1. Click on Create under Ubuntu Server 18.04 LTS Popular view
1. On the "Management" tab, enable the option to Login with Azure Active Directory (Preview) under the Azure Active Directory section from Off to On.
1. Make sure System assigned managed identity under the Identity section is set to On. This action should happen automatically once you enable Login with Azure Active Directory.
1. Go through the rest of the experience of creating a virtual machine. During this preview, you will have to create an administrator account with username and password/SSH public key.
 
### Using the Azure Cloud Shell experience to enable Azure AD login

Azure Cloud Shell is a free, interactive shell that you can use to run the steps in this article. Common Azure tools are preinstalled and configured in Cloud Shell for you to use with your account. Just select the Copy button to copy the code, paste it in Cloud Shell, and then press Enter to run it. There are a few ways to open Cloud Shell:

- Select Try It in the upper-right corner of a code block.
- Open Cloud Shell in your browser.
- Select the Cloud Shell button on the menu in the upper-right corner of the Azure portal.

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.22.1 or later. Run az --version to find the version. If you need to install or upgrade, see the article Install Azure CLI.

1. Create a resource group with az group create.
1. Create a VM with az vm create using a supported distribution in a supported region.
1. Install the Azure AD login VM extension.

The following example deploys a VM named myVM that uses Ubuntu 18.04 LTS into a resource group named myResourceGroup in the southcentralus region. In the following examples, you can provide your own resource group and VM names as needed.

```azurecli-interactive
az group create --name myResourceGroup --location southcentralus

az vm create \
    --resource-group myResourceGroup \
    --name myVM \	
    --image UbuntuLTS \
    --assign-identity \
    --admin-username azureuser \
    --generate-ssh-keys
```

> [!CAUTION]
> You must enable System assigned managed identity on your virtual machine before you install the Azure AD login VM extension.

It takes a few minutes to create the VM and supporting resources.

Finally, install the Azure AD login VM extension to enable Azure AD login for Linux VM. VM extensions are small applications that provide post-deployment configuration and automation tasks on Azure virtual machines. Use az vm extension set to install the AADSSHLoginForLinux extension on the VM named myVM in the myResourceGroup resource group:

Note
You can install AADSSHLoginForLinux extension on an existing (supported distribution) Linux VM to enable it for Azure AD authentication. If deploying this extension to a previously created VM ensure the machine has at least 1 GB of memory allocated else the extension will fail to install.
An example of AZ CLI is shown below. 

```azurecli-interactive
az vm extension set \
    --publisher Microsoft.Azure.ActiveDirectory \
    --name AADSSHLoginForLinux \
    --resource-group myResourceGroup \
    --vm-name myVM
```

The provisioningState of Succeeded is shown once the extension is successfully installed on the VM. The VM needs a running VM agent to install the extension. For more information, see VM Agent Overview.

## Configure role assignments for the VM

Now that you have created the VM, you need to configure Azure RBAC policy to determine who can log in to the VM. Two Azure roles are used to authorize VM login:

- Virtual Machine Administrator Login: Users with this role assigned can log in to an Azure virtual machine with administrator privileges.
- Virtual Machine User Login: Users with this role assigned can log in to an Azure virtual machine with regular user privileges.
 
Note
To allow a user to log in to the VM over SSH, you must assign either the Virtual Machine Administrator Login or Virtual Machine User Login role. An Azure user with the Owner or Contributor roles assigned for a VM do not automatically have privileges to Azure AD login to the VM over SSH. This separation is to provide audited separation between the set of people who control virtual machines versus the set of people who can access virtual machines. 

There are multiple ways you can configure role assignments for VM, as an example you can use:

- Azure AD Portal experience
- Azure Cloud Shell experience

Note
The Virtual Machine Administrator Login and Virtual Machine User Login roles use dataActions and thus cannot be assigned at management group scope. Currently these roles can only be assigned at the subscription, resource group or resource scope. It is recommended that the roles be assigned at the subscription or resource level and not at the individual VM level to avoid risk of running out of Azure role assignments limit per subscription.

### Using Azure AD Portal experience

To configure role assignments for your Azure AD enabled Linux VMs:

1. Navigate to the specific virtual machine overview page
1. Select Access control (IAM) from the menu options
1. Select Add, Add role assignment to open the Add role assignment pane.
1. In the Role drop-down list, select a role such as Virtual Machine Administrator Login or Virtual Machine User Login.
1. In the Select field, select a user, group, service principal, or managed identity. If you do not see the security principal in the list, you can type in the Select box to search the directory for display names, email addresses, and object identifiers.
1. Select Save, to assign the role.

After a few moments, the security principal is assigned the role at the selected scope.
 
### Using the Azure Cloud Shell experience

The following example uses az role assignment create to assign the Virtual Machine Administrator Login role to the VM for your current Azure user. The username of your active Azure account is obtained with az account show, and the scope is set to the VM created in a previous step with az vm show. The scope could also be assigned at a resource group or subscription level, and normal Azure RBAC inheritance permissions apply.

```azurecli-interactive
username=$(az account show --query user.name --output tsv)
vm=$(az vm show --resource-group myResourceGroup --name myVM --query id -o tsv)

az role assignment create \
    --role "Virtual Machine Administrator Login" \
    --assignee $username \
    --scope $vm
```

Note
If your Azure AD domain and logon username domain do not match, you must specify the object ID of your user account with the --assignee-object-id, not just the username for --assignee. You can obtain the object ID for your user account with az ad user list.

For more information on how to use Azure RBAC to manage access to your Azure subscription resources, see the following articles:

- Assign Azure roles using Azure CLI
- Assign Azure roles using the Azure portal
- Assign Azure roles using Azure PowerShell.

## Install SSH extension for Az CLI

Run the following command to add SSH extension for Az CLI

```azurecli-interactive
az extension add --name ssh
```

The minimum version required for the extension is 0.1.4. Optionally, check the installed SSH extension version with the following command.

```azurecli-interactive
az extension show --name ssh
```

Note
If you are using Azure Cloud Shell, then no other setup is needed as both the minimum required version of Az CLI and SSH extension for Az CLI are already included in the Cloud Shell environment.

## Using Conditional Access

You can enforce Conditional Access policies such as require MFA for the user, require compliant/Hybrid Azure AD joined device for the device running SSH client, check for low user and sign-in risk before authorizing access to Linux VMs in Azure that are enabled with Azure AD login in. 

To apply Conditional Access policy, you must select the "Azure Linux VM Sign-In" app from the cloud apps or actions assignment option and then use user and /or sign-in risk as a condition and Access controls as Grant access after satisfying require multi-factor authentication and/or require compliant/Hybrid Azure AD joined device.

Note
Conditional Access policy enforcement of requiring compliant/Hybrid Azure AD joined device on the client device running SSH client only works with Az CLI running on Windows and macOS. It is not supported when using Az CLI on Linux or Azure Cloud Shell.

## Login using Azure AD user account to SSH into the Linux VM

### Using Az CLI

First do az login and then az ssh vm. 

```azurecli-interactive
az login 
```

This command will launch a browser window and a user can sign in using their Azure AD account. 

The following example automatically resolves the appropriate IP address for the VM.

```azurecli-interactive
az ssh vm -n myVM -g myResourceGroup
```

The following example shows how to manually specify the VM's IP address. Replace the example IP address with the private or public IP of your VM.

```azurecli-interactive
az ssh vm --ip 10.11.123.456
```

If prompted, enter your Azure AD login credentials at the login page, perform an MFA, and/or satisfy device checks. You will only be prompted if your az CLI session does not already meet any required Conditional Access criteria. Close the browser window, return to the SSH prompt, and you will be automatically connected to the VM.

You are now signed in to the Azure Linux virtual machine with the role permissions as assigned, such as VM User or VM Administrator. If your user account is assigned the Virtual Machine Administrator Login role, you can use sudo to run commands that require root privileges.

### Using Az Cloud Shell

You can use Az Cloud Shell to connect to VMs without needing to install anything locally to your client machine. Start Cloud Shell by clicking the shell icon in the upper right corner of the Azure portal.
 
Az Cloud Shell will automatically connect to a session in the context of the signed in user. During the Azure AD Login for Linux Preview, you must run az login again and go through an interactive sign in flow.

```azurecli-interactive
az login
```

Then you can use the normal az ssh vm commands to connect using name and resource group or IP address of the VM.

```azurecli-interactive
az ssh vm -n myVM -g myResourceGroup
```

```azurecli-interactive
az ssh vm --ip 10.11.123.456
```

Note
During Azure AD Login for Linux Preview, Conditional Access policy enforcement of requiring compliant/Hybrid Azure AD joined device is not supported when using Az Cloud Shell.

### Login using Azure AD service principal to SSH into the Linux VM

Azure CLI supports authenticating with a service principal instead of a user account. Since service principals are account not tied to any particular user, customers can use them to SSH to a VM to support any automation scenarios they may have. The service principal must have VM Administrator or VM User rights assigned. Assign permissions at the subscription or resource group level. 

The following example will assign VM Administrator rights to the service principal at the resource group level. Replace the service principal object ID, subscription ID, and resource group name fields.

```azurecli-interactive
az role assignment create \
    --role "Virtual Machine Administrator Login" \
    --assignee-object-id <service-principal-objectid> \
    --assignee-principal-type ServicePrincipal \
    --scope “/subscriptions/<subscription-id>/resourceGroups/<resourcegroup-name>"
```

Use the following example to authenticate to Azure CLI using the service principal. To learn more about how to sign in using a service principal, see sign in to Azure CLI with a service principal.

```azurecli-interactive
az login --service-principal -u <sp-app-id> -p <password-or-cert> --tenant <tenant-id>
```

Once authentication with a service principal is complete, use the normal Az CLI SSH commands to connect to the VM.

```azurecli-interactive
az ssh vm -n myVM -g myResourceGroup
```

### Exporting SSH Configuration for use with SSH clients that support OpenSSH

Login to Azure Linux VMs with Azure AD supports exporting the OpenSSH certificate and configuration to files, allowing you to use any SSH clients that support OpenSSH based certificates to sign in Azure AD. The following example exports the configuration for all IP addresses assigned to the VM.

```azurecli-interactive
az ssh config --file ~/.ssh/config -n myVM -g myResourceGroup
```

Alternatively, you can export the config by specifying just the IP address. Replace the IP address in the example with the public or private IP address for your VM. Type az ssh config -h for help on this command.

```azurecli-interactive
az ssh config --file ~/.ssh/config --ip 10.11.123.456
```

You can then connect to the VM through normal OpenSSH usage. Connection can be done through any SSH client that uses OpenSSH.

## Sudo and Azure AD login

Once, users assigned the VM Administrator role successfully SSH into a Linux VM, they will be able to run sudo with no other interaction or authentication requirement. Users assigned the VM User role will not be able to run sudo.

## Virtual machine scale set support

Virtual machine scale sets are supported, but the steps are slightly different for enabling and connecting to virtual machine scale set VMs.
First, create a virtual machine scale set or choose one that already exists. Enable a system assigned managed identity for your virtual machine scale set.

```azurecli-interactive
az vmss identity assign --vmss-name myVMSS --resource-group myResourceGroup
```

Install the Azure AD extension on your virtual machine scale set.

```azurecli-interactive
az vmss extension set --publisher Microsoft.Azure.ActiveDirectory --name Azure ADSSHLoginForLinux --resource-group myResourceGroup --vmss-name myVMSS
```

Virtual machine scale set usually do not have public IP addresses, so you must have connectivity to them from another machine that can reach their Azure Virtual Network. This example shows how to use the private IP of a virtual machine scale set VM to connect. 

```azurecli-interactive
az ssh vm --ip 10.11.123.456
```

Note

You cannot automatically determine the virtual machine scale set VM's IP addresses using the --resource-group and --name switches.

## Troubleshoot sign-in issues

Some common errors when you try to SSH with Azure AD credentials include no Azure roles assigned, and repeated prompts to sign in. Use the following sections to correct these issues.

### Access denied: Azure role not assigned

If you see the following error on your SSH prompt, verify that you have configured Azure RBAC policies for the VM that grants the user either the Virtual Machine Administrator Login or Virtual Machine User Login role:

Note
If you are running into issues with Azure role assignments, see Troubleshoot Azure RBAC.

### Extension Install Errors

Installation of the AADSSHLoginForLinux VM extension to existing computers fails with one of the following known error codes:

#### Non-zero exit code: 22

The Status of the AADSSHLoginForLinux VM extension shows as Transitioning in the portal.

Cause 1: This failure is due to a System Assigned Managed Identity is required for Azure AD based SSH login to work.

Solution 1: Perform these actions:

1. Uninstall the failed extension.
1. Enable a System Assigned Managed Identity on the Azure VM.
1. Run the extension install command again.

#### Non-zero exit code: 23

The Status of the AADSSHLoginForLinux VM extension shows as Transitioning in the portal.

Cause 1: This failure is due to the older AADLoginForLinux VM extension is still installed.

Solution 1: Perform these actions:

1. Uninstall the older AADLoginForLinux VM extension from the VM. The Status of the new AADSSHLoginForLinux VM extension will change to Provisioning succeeded in the portal.

#### Az ssh vm fails with KeyError: 'access_token'.

Cause 1: An outdated version of the Azure CLI client is being used.

Solution 1: Upgrade the Azure CLI client to version 2.21.0 or higher.

#### SSH Connection closed

After the user has successfully signed in using az login, connection to the VM using az ssh vm -ip <addres> or as ssh vm --name <vm_name> -g <resource_group> fails with Connection closed by <ip_address> port 22.

Cause 1: The user is not assigned to the either the Virtual Machine Administrator/User Login Azure RBAC roles within the scope of this VM.

Solution 1: Add the user to the either of the Virtual Machine Administrator/User Login Azure RBAC roles within the scope of this VM.

Cause 2: The user is in a required Azure RBAC role but the System Assigned managed identity has been disabled on the VM.

Solution 2: Perform these actions:

1. Enable the System Assigned managed identity on the VM.
1. Allow several minutes to pass before trying to connect using az ssh vm --ip <ip_address>.

### Virtual machine scale set Connection Issues

Virtual machine scale set VM connections may fail if the virtual machine scale set instances are running an old model. Upgrading virtual machine scale set instances to the latest model may resolve issues, especially if an upgrade has not been done since the Azure AD Login extension was installed. Upgrading an instance applies a standard virtual machine scale set configuration to the individual instance.

### Other limitations

Users that inherit access rights through nested groups or role assignments aren't currently supported. The user or group must be directly assigned the required role assignments. For example, the use of management groups or nested group role assignments won't grant the correct permissions to allow the user to sign in.

## Feedback

Share your feedback about this preview feature or report issues using it on the [Azure AD feedback forum](https://feedback.azure.com/forums/169401-azure-active-directory?category_id=166032).

## Next steps
