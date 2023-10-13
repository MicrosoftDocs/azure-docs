---
title: Log in to a Linux virtual machine in Azure by using Microsoft Entra ID and OpenSSH
description: Learn how to log in to an Azure VM that's running Linux by using Microsoft Entra ID and OpenSSH certificate-based authentication.

services: active-directory
ms.service: active-directory
ms.subservice: devices
ms.topic: how-to
ms.date: 06/20/2022

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: sandeo
ms.custom: references_regions, devx-track-azurecli, subject-rbac-steps, devx-track-linux
ms.collection: M365-identity-device-management
---
# Log in to a Linux virtual machine in Azure by using Microsoft Entra ID and OpenSSH

To improve the security of Linux virtual machines (VMs) in Azure, you can integrate with Microsoft Entra authentication. You can now use Microsoft Entra ID as a core authentication platform and a certificate authority to SSH into a Linux VM by using Microsoft Entra ID and OpenSSH certificate-based authentication. This functionality allows organizations to manage access to VMs with Azure role-based access control (RBAC) and Conditional Access policies. 

This article shows you how to create and configure a Linux VM and log in with Microsoft Entra ID by using OpenSSH certificate-based authentication.

There are many security benefits of using Microsoft Entra ID with OpenSSH certificate-based authentication to log in to Linux VMs in Azure. They include:

- Use your Microsoft Entra credentials to log in to Azure Linux VMs.
- Get SSH key-based authentication without needing to distribute SSH keys to users or provision SSH public keys on any Azure Linux VMs that you deploy. This experience is much simpler than having to worry about sprawl of stale SSH public keys that could cause unauthorized access.
- Reduce reliance on local administrator accounts, credential theft, and weak credentials.
- Help secure Linux VMs by configuring password complexity and password lifetime policies for Microsoft Entra ID.
- With RBAC, specify who can log in to a VM as a regular user or with administrator privileges. When users join your team, you can update the Azure RBAC policy for the VM to grant access as appropriate. When employees leave your organization and their user accounts are disabled or removed from Microsoft Entra ID, they no longer have access to your resources.
- With Conditional Access, configure policies to require multifactor authentication or to require that your client device is managed (for example, compliant or Microsoft Entra hybrid joined) before you can use it SSH into Linux VMs. 
- Use Azure deploy and audit policies to require Microsoft Entra login for Linux VMs and flag unapproved local accounts.

Login to Linux VMs with Microsoft Entra ID works for customers who use Active Directory Federation Services.

## Supported Linux distributions and Azure regions

The following Linux distributions are currently supported for deployments in a supported region:

| Distribution | Version |
| --- | --- |
| Common Base Linux Mariner (CBL-Mariner) | CBL-Mariner 1, CBL-Mariner 2 |
| CentOS | CentOS 7, CentOS 8 |
| Debian | Debian 9, Debian 10, Debian 11 |
| openSUSE | openSUSE Leap 42.3, openSUSE Leap 15.1+ |
| RedHat Enterprise Linux (RHEL) | RHEL 7.4 to RHEL 7.9, RHEL 8.3+ |
| SUSE Linux Enterprise Server (SLES) | SLES 12, SLES 15.1+ |
| Ubuntu Server | Ubuntu Server 16.04 to Ubuntu Server 22.04 |

The following Azure regions are currently supported for this feature:

- Azure Global
- Azure Government
- Microsoft Azure operated by 21Vianet

Use of the SSH extension for Azure CLI on Azure Kubernetes Service (AKS) clusters is not supported. For more information, see [Support policies for AKS](/azure/aks/support-policies).

If you choose to install and use the Azure CLI locally, it must be version 2.22.1 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli).

> [!NOTE]
> This functionality is also available for [Azure Arc-enabled servers](/azure/azure-arc/servers/ssh-arc-overview).

<a name='meet-requirements-for-login-with-azure-ad-using-openssh-certificate-based-authentication'></a>

## Meet requirements for login with Microsoft Entra ID using OpenSSH certificate-based authentication

To enable Microsoft Entra login through SSH certificate-based authentication for Linux VMs in Azure, be sure to meet the following network, virtual machine, and client (SSH client) requirements.

### Network

VM network configuration must permit outbound access to the following endpoints over TCP port 443.

Azure Global:

- `https://packages.microsoft.com`: For package installation and upgrades.
- `http://169.254.169.254`: Azure Instance Metadata Service endpoint.
- `https://login.microsoftonline.com`: For PAM-based (pluggable authentication modules) authentication flows.
- `https://pas.windows.net`: For Azure RBAC flows.

Azure Government:

- `https://packages.microsoft.com`: For package installation and upgrades.
- `http://169.254.169.254`: Azure Instance Metadata Service endpoint.
- `https://login.microsoftonline.us`: For PAM-based authentication flows.
- `https://pasff.usgovcloudapi.net`: For Azure RBAC flows.

Microsoft Azure operated by 21Vianet:

- `https://packages.microsoft.com`: For package installation and upgrades.
- `http://169.254.169.254`: Azure Instance Metadata Service endpoint.
- `https://login.chinacloudapi.cn`: For PAM-based authentication flows.
- `https://pas.chinacloudapi.cn`: For Azure RBAC flows.

### Virtual machine

Ensure that your VM is configured with the following functionality:

- System-assigned managed identity. This option is automatically selected when you use the Azure portal to create VMs and select the Microsoft Entra login option. You can also enable system-assigned managed identity on a new or existing VM by using the Azure CLI.
- `aadsshlogin` and `aadsshlogin-selinux` (as appropriate). These packages are installed with the AADSSHLoginForLinux VM extension. The extension is installed when you use the Azure portal or the Azure CLI to create VMs and enable Microsoft Entra login (**Management** tab).

### Client

Ensure that your client meets the following requirements:

- SSH client support for OpenSSH-based certificates for authentication. You can use Azure CLI (2.21.1 or later) with OpenSSH (included in Windows 10 version 1803 or later) or Azure Cloud Shell to meet this requirement. 
- SSH extension for Azure CLI. You can install this extension by using `az extension add --name ssh`. You don't need to install this extension when you're using Azure Cloud Shell, because it comes preinstalled.

  If you're using any SSH client other than the Azure CLI or Azure Cloud Shell that supports OpenSSH certificates, you'll still need to use the Azure CLI with the SSH extension to retrieve ephemeral SSH certificates and optionally a configuration file. You can then use the configuration file with your SSH client.
- TCP connectivity from the client to either the public or private IP address of the VM. (ProxyCommand or SSH forwarding to a machine with connectivity also works.)

> [!IMPORTANT]
> SSH clients based on PuTTY now supports OpenSSH certificates and can be used to log in with Microsoft Entra OpenSSH certificate-based authentication.

<a name='enable-azure-ad-login-for-a-linux-vm-in-azure'></a>

## Enable Microsoft Entra login for a Linux VM in Azure

To use Microsoft Entra login for a Linux VM in Azure, you need to first enable the Microsoft Entra login option for your Linux VM. You then configure Azure role assignments for users who are authorized to log in to the VM. Finally, you use the SSH client that supports OpenSSH, such as the Azure CLI or Azure Cloud Shell, to SSH into your Linux VM. 

There are two ways to enable Microsoft Entra login for your Linux VM:

- The Azure portal experience when you're creating a Linux VM
- The Azure Cloud Shell experience when you're creating a Linux VM or using an existing one

### Azure portal

You can enable Microsoft Entra login for any of the [supported Linux distributions](#supported-linux-distributions-and-azure-regions) by using the Azure portal.

For example, to create an Ubuntu Server 18.04 Long Term Support (LTS) VM in Azure with Microsoft Entra login:

1. Sign in to the [Azure portal](https://portal.azure.com) by using an account that has access to create VMs, and then select **+ Create a resource**.
1. Select **Create** under **Ubuntu Server 18.04 LTS** in the **Popular** view.
1. On the **Management** tab: 
   1. Select the **Login with Microsoft Entra ID** checkbox.
   1. Ensure that the **System assigned managed identity** checkbox is selected.
1. Go through the rest of the experience of creating a virtual machine. You'll have to create an administrator account with username and password or SSH public key.

### Azure Cloud Shell

Azure Cloud Shell is a free, interactive shell that you can use to run the steps in this article. Common Azure tools are preinstalled and configured in Cloud Shell for you to use with your account. Just select the **Copy** button to copy the code, paste it in Cloud Shell, and then select the Enter key to run it. 

There are a few ways to open Cloud Shell:

- Select **Try It** in the upper-right corner of a code block.
- Open Cloud Shell in your browser.
- Select the Cloud Shell button on the menu in the upper-right corner of the Azure portal.

If you choose to install and use the Azure CLI locally, this article requires you to use version 2.22.1 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli).

1. Create a resource group by running [az group create](/cli/azure/group#az-group-create).
1. Create a VM by running [az vm create](/cli/azure/vm?preserve-view=true#az-vm-create&preserve-view=true). Use a supported distribution in a supported region.
1. Install the Microsoft Entra login VM extension by using [az vm extension set](/cli/azure/vm/extension#az-vm-extension-set).

The following example deploys a VM and then installs the extension to enable Microsoft Entra login for a Linux VM. VM extensions are small applications that provide post-deployment configuration and automation tasks on Azure virtual machines. Customize the example as needed to support your testing requirements.

```azurecli-interactive
az group create --name AzureADLinuxVM --location southcentralus
az vm create \
    --resource-group AzureADLinuxVM \
    --name myVM \	
    --image Ubuntu2204 \
    --assign-identity \
    --admin-username azureuser \
    --generate-ssh-keys
az vm extension set \
    --publisher Microsoft.Azure.ActiveDirectory \
    --name AADSSHLoginForLinux \
    --resource-group AzureADLinuxVM \
    --vm-name myVM
```

It takes a few minutes to create the VM and supporting resources.

The AADSSHLoginForLinux extension can be installed on an existing (supported distribution) Linux VM with a running VM agent to enable Microsoft Entra authentication. If you're deploying this extension to a previously created VM, the VM must have at least 1 GB of memory allocated or the installation will fail.

The `provisioningState` value of `Succeeded` appears when the extension is successfully installed on the VM. The VM must have a running [VM agent](/azure/virtual-machines/extensions/agent-linux) to install the extension.

## Configure role assignments for the VM

Now that you've created the VM, you need to configure an Azure RBAC policy to determine who can log in to the VM. Two Azure roles are used to authorize VM login:

- **Virtual Machine Administrator Login**: Users who have this role assigned can log in to an Azure virtual machine with administrator privileges.
- **Virtual Machine User Login**: Users who have this role assigned can log in to an Azure virtual machine with regular user privileges.
 
To allow a user to log in to a VM over SSH, you must assign the Virtual Machine Administrator Login or Virtual Machine User Login role on the resource group that contains the VM and its associated virtual network, network interface, public IP address, or load balancer resources. 

An Azure user who has the Owner or Contributor role assigned for a VM doesn't automatically have privileges to Microsoft Entra login to the VM over SSH. There's an intentional (and audited) separation between the set of people who control virtual machines and the set of people who can access virtual machines. 

There are two ways to configure role assignments for a VM:

- Azure portal experience
- Azure Cloud Shell experience

> [!NOTE]
> The Virtual Machine Administrator Login and Virtual Machine User Login roles use `dataActions` and can be assigned at the management group, subscription, resource group, or resource scope. We recommend that you assign the roles at the management group, subscription, or resource group level and not at the individual VM level. This practice avoids the risk of reaching the [Azure role assignments limit](/azure/role-based-access-control/troubleshoot-limits) per subscription.

<a name='azure-ad-portal'></a>

### Azure portal

To configure role assignments for your Microsoft Entra ID-enabled Linux VMs:

1. For **Resource Group**, select the resource group that contains the VM and its associated virtual network, network interface, public IP address, or load balancer resource.

1. Select **Access control (IAM)**.

1. Select **Add** > **Add role assignment** to open the **Add role assignment** page.

1. Assign the following role. For detailed steps, see [Assign Azure roles by using the Azure portal](/azure/role-based-access-control/role-assignments-portal).

    | Setting | Value |
    | --- | --- |
    | Role | **Virtual Machine Administrator Login** or **Virtual Machine User Login** |
    | Assign access to | User, group, service principal, or managed identity |

    ![Screenshot that shows the page for adding a role assignment.](../../../includes/role-based-access-control/media/add-role-assignment-page.png)

After a few moments, the security principal is assigned the role at the selected scope.

### Azure Cloud Shell

The following example uses [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) to assign the Virtual Machine Administrator Login role to the VM for your current Azure user. You obtain the username of your current Azure account by using [az account show](/cli/azure/account#az-account-show), and you set the scope to the VM created in a previous step by using [az vm show](/cli/azure/vm#az-vm-show). 

You can also assign the scope at a resource group or subscription level. Normal Azure RBAC inheritance permissions apply.

```azurecli-interactive
username=$(az account show --query user.name --output tsv)
rg=$(az group show --resource-group myResourceGroup --query id -o tsv)

az role assignment create \
    --role "Virtual Machine Administrator Login" \
    --assignee $username \
    --scope $rg
```

> [!NOTE]
> If your Microsoft Entra domain and login username domain don't match, you must specify the object ID of your user account by using `--assignee-object-id`, not just the username for `--assignee`. You can obtain the object ID for your user account by using [az ad user list](/cli/azure/ad/user#az-ad-user-list).

For more information on how to use Azure RBAC to manage access to your Azure subscription resources, see [Steps to assign an Azure role](/azure/role-based-access-control/role-assignments-steps).

## Install the SSH extension for Azure CLI

If you're using Azure Cloud Shell, no other setup is needed because both the minimum required version of the Azure CLI and the SSH extension for Azure CLI are already included in the Cloud Shell environment.

Run the following command to add the SSH extension for Azure CLI:

```azurecli
az extension add --name ssh
```

The minimum version required for the extension is 0.1.4. Check the installed version by using the following command:

```azurecli
az extension show --name ssh
```

## Enforce Conditional Access policies

You can enforce Conditional Access policies that are enabled with Microsoft Entra login, such as:

- Requiring multifactor authentication.
- Requiring a compliant or Microsoft Entra hybrid joined device for the device running the SSH client.
- Checking for risks before authorizing access to Linux VMs in Azure. 

The application that appears in the Conditional Access policy is called *Azure Linux VM Sign-In*.

> [!NOTE]
> Conditional Access policy enforcement that requires device compliance or Microsoft Entra hybrid join on the device that's running the SSH client works only with the Azure CLI that's running on Windows and macOS. It's not supported when you're using the Azure CLI on Linux or Azure Cloud Shell.

### Missing application

If the Azure Linux VM Sign-In application is missing from Conditional Access, make sure the application isn't in the tenant:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**.
1. Remove the filters to see all applications, and search for **Virtual Machine**. If you don't see Microsoft Azure Linux Virtual Machine Sign-In as a result, the service principal is missing from the tenant.

Another way to verify it is via Graph PowerShell:

1. [Install the Graph PowerShell SDK](/powershell/microsoftgraph/installation) if you haven't already done so. 
1. Enter the command `Connect-MgGraph -Scopes "ServicePrincipalEndpoint.ReadWrite.All","Application.ReadWrite.All"`.
1. Sign in with a Global Administrator account.
1. Consent to the prompt that asks for your permission.
1. Enter the command `Get-MgServicePrincipal -ConsistencyLevel eventual -Search '"DisplayName:Microsoft Azure Linux Virtual Machine Sign-In"'`.
   
   If this command results in no output and returns you to the PowerShell prompt, you can create the service principal by using the following Graph PowerShell command: `New-MgServicePrincipal -AppId ce6ff14a-7fdc-4685-bbe0-f6afdfcfa8e0`.
   
   Successful output will show that the app ID and the application name Azure Linux VM Sign-In were created.
1. Sign out of Graph PowerShell by using the following command: `Disconnect-MgGraph`.

<a name='log-in-by-using-an-azure-ad-user-account-to-ssh-into-the-linux-vm'></a>

## Log in by using a Microsoft Entra user account to SSH into the Linux VM

### Log in by using the Azure CLI

Enter `az login`. This command opens a browser window, where you can sign in by using your Microsoft Entra account.

```azurecli
az login 
```

Then enter `az ssh vm`. The following example automatically resolves the appropriate IP address for the VM.

```azurecli
az ssh vm -n myVM -g AzureADLinuxVM
```

If you're prompted, enter your Microsoft Entra login credentials at the login page, perform multifactor authentication, and/or satisfy device checks. You'll be prompted only if your Azure CLI session doesn't already meet any required Conditional Access criteria. Close the browser window, return to the SSH prompt, and you'll be automatically connected to the VM.

You're now signed in to the Linux virtual machine with the role permissions as assigned, such as VM User or VM Administrator. If your user account is assigned the Virtual Machine Administrator Login role, you can use sudo to run commands that require root privileges.

### Log in by using Azure Cloud Shell

You can use Azure Cloud Shell to connect to VMs without needing to install anything locally to your client machine. Start Cloud Shell by selecting the shell icon in the upper-right corner of the Azure portal.

Cloud Shell automatically connects to a session in the context of the signed-in user. Now run `az login` again and go through the interactive sign-in flow:

```azurecli
az login
```

Then you can use the normal `az ssh vm` commands to connect by using the name and resource group or IP address of the VM:

```azurecli
az ssh vm -n myVM -g AzureADLinuxVM
```

> [!NOTE]
> Conditional Access policy enforcement that requires device compliance or Microsoft Entra hybrid join is not supported when you're using Azure Cloud Shell.

<a name='log-in-by-using-the-azure-ad-service-principal-to-ssh-into-the-linux-vm'></a>

## Log in by using the Microsoft Entra service principal to SSH into the Linux VM

The Azure CLI supports authenticating with a service principal instead of a user account. Because service principals aren't tied to any particular user, customers can use them to SSH into a VM to support any automation scenarios they might have. The service principal must have VM Administrator or VM User rights assigned. Assign permissions at the subscription or resource group level. 

The following example will assign VM Administrator rights to the service principal at the resource group level. Replace the placeholders for service principal object ID, subscription ID, and resource group name.

```azurecli
az role assignment create \
    --role "Virtual Machine Administrator Login" \
    --assignee-object-id <service-principal-objectid> \
    --assignee-principal-type ServicePrincipal \
    --scope “/subscriptions/<subscription-id>/resourceGroups/<resourcegroup-name>"
```

Use the following example to authenticate to the Azure CLI by using the service principal. For more information, see the article [Sign in to the Azure CLI with a service principal](/cli/azure/authenticate-azure-cli#sign-in-with-a-service-principal).

```azurecli
az login --service-principal -u <sp-app-id> -p <password-or-cert> --tenant <tenant-id>
```

When authentication with a service principal is complete, use the normal Azure CLI SSH commands to connect to the VM:

```azurecli
az ssh vm -n myVM -g AzureADLinuxVM
```

## Export the SSH configuration for use with SSH clients that support OpenSSH

Login to Azure Linux VMs with Microsoft Entra ID supports exporting the OpenSSH certificate and configuration. That means you can use any SSH clients that support OpenSSH-based certificates to sign in through Microsoft Entra ID. The following example exports the configuration for all IP addresses assigned to the VM:

```azurecli
az ssh config --file ~/.ssh/config -n myVM -g AzureADLinuxVM
```

Alternatively, you can export the configuration by specifying just the IP address. Replace the IP address in the following example with the public or private IP address for your VM. (You must bring your own connectivity for private IPs.) Enter `az ssh config -h` for help with this command.

```azurecli
az ssh config --file ~/.ssh/config --ip 10.11.123.456
```

You can then connect to the VM through normal OpenSSH usage. Connection can be done through any SSH client that uses OpenSSH.

<a name='run-sudo-with-azure-ad-login'></a>

## Run sudo with Microsoft Entra login

After users who are assigned the VM Administrator role successfully SSH into a Linux VM, they'll be able to run sudo with no other interaction or authentication requirement. Users who are assigned the VM User role won't be able to run sudo.

## Connect to VMs in virtual machine scale sets

Virtual machine scale sets are supported, but the steps are slightly different for enabling and connecting to VMs in a virtual machine scale set:

1. Create a virtual machine scale set or choose one that already exists. Enable a system-assigned managed identity for your virtual machine scale set:

   ```azurecli
   az vmss identity assign --name myVMSS --resource-group AzureADLinuxVM
   ```

2. Install the Microsoft Entra extension on your virtual machine scale set:

   ```azurecli
   az vmss extension set --publisher Microsoft.Azure.ActiveDirectory --name AADSSHLoginForLinux --resource-group AzureADLinuxVM --vmss-name myVMSS
   ```

Virtual machine scale sets usually don't have public IP addresses. You must have connectivity to them from another machine that can reach their Azure virtual network. This example shows how to use the private IP of a VM in a virtual machine scale set to connect from a machine in the same virtual network: 

```azurecli
az ssh vm --ip 10.11.123.456
```

> [!NOTE]
> You can't automatically determine the virtual machine scale set VM's IP addresses by using the `--resource-group` and `--name` switches.

## Migrate from the previous (preview) version

If you're using the previous version of Microsoft Entra login for Linux that was based on device code flow, complete the following steps by using the Azure CLI:

1. Uninstall the AADLoginForLinux extension on the VM:

   ```azurecli
   az vm extension delete -g MyResourceGroup --vm-name MyVm -n AADLoginForLinux
   ```
    > [!NOTE]
    > Uninstallation of the extension can fail if there are any Microsoft Entra users currently logged in on the VM. Make sure all users are logged out first.
1. Enable system-assigned managed identity on your VM:

   ```azurecli
   az vm identity assign -g myResourceGroup -n myVm
   ```

1. Install the AADSSHLoginForLinux extension on the VM:

    ```azurecli
    az vm extension set \
        --publisher Microsoft.Azure.ActiveDirectory \
        --name AADSSHLoginForLinux \
        --resource-group myResourceGroup \
        --vm-name myVM
    ```

## Use Azure Policy to meet standards and assess compliance

Use Azure Policy to:

- Ensure that Microsoft Entra login is enabled for your new and existing Linux virtual machines. 
- Assess compliance of your environment at scale on a compliance dashboard. 

With this capability, you can use many levels of enforcement. You can flag new and existing Linux VMs within your environment that don't have Microsoft Entra login enabled. You can also use Azure Policy to deploy the Microsoft Entra extension on new Linux VMs that don't have Microsoft Entra login enabled, as well as remediate existing Linux VMs to the same standard. 

In addition to these capabilities, you can use Azure Policy to detect and flag Linux VMs that have unapproved local accounts created on their machines. To learn more, review [Azure Policy](/azure/governance/policy/overview).

## Troubleshoot sign-in issues

Use the following sections to correct common errors that can happen when you try to SSH with Microsoft Entra credentials.

### Couldn't retrieve token from local cache

If you get a message that says the token couldn't be retrieved from the local cache, you must run `az login` again and go through an interactive sign-in flow. Review the section about [logging in by using Azure Cloud Shell](#log-in-by-using-azure-cloud-shell).

### Access denied: Azure role not assigned

If you see an "Azure role not assigned" error on your SSH prompt, verify that you've configured Azure RBAC policies for the VM that grants the user either the Virtual Machine Administrator Login role or the Virtual Machine User Login role. If you're having problems with Azure role assignments, see the article [Troubleshoot Azure RBAC](/azure/role-based-access-control/troubleshooting).

### Problems deleting the old (AADLoginForLinux) extension

If the uninstallation scripts fail, the extension might get stuck in a transitioning state. When this happens, the extension can leave packages that it's supposed to uninstall during its removal. In such cases, it's better to manually uninstall the old packages and then try to run the `az vm extension delete` command. 

To uninstall old packages:

1. Log in as a local user with admin privileges.
1. Make sure there are no logged-in Microsoft Entra users. Call the `who -u` command to see who is logged in. Then use `sudo kill <pid>` for all session processes that the previous command reported.
1. Run `sudo apt remove --purge aadlogin` (Ubuntu/Debian), `sudo yum remove aadlogin` (RHEL or CentOS), or `sudo zypper remove aadlogin` (openSUSE or SLES).
1. If the command fails, try the low-level tools with scripts disabled:
   1. For Ubuntu/Debian, run `sudo dpkg --purge aadlogin`. If it's still failing because of the script, delete the `/var/lib/dpkg/info/aadlogin.prerm` file and try again.
   1. For everything else, run `rpm -e --noscripts aadogin`.
1. Repeat steps 3-4 for package `aadlogin-selinux`.

### Extension installation errors

Installation of the AADSSHLoginForLinux VM extension to existing computers might fail with one of the following known error codes.

#### Non-zero exit code 22

If you get exit code 22, the status of the AADSSHLoginForLinux VM extension shows as **Transitioning** in the portal.

This failure happens because a system-assigned managed identity is required.

The solution is to:

1. Uninstall the failed extension.
1. Enable a system-assigned managed identity on the Azure VM.
1. Run the extension installation command again.

#### Non-zero exit code 23

If you get exit code 23, the status of the AADSSHLoginForLinux VM extension shows as **Transitioning** in the portal.

This failure happens when the older AADLoginForLinux VM extension is still installed.

The solution is to uninstall the older AADLoginForLinux VM extension from the VM. The status of the new AADSSHLoginForLinux VM extension will then change to **Provisioning succeeded** in the portal.

#### The az ssh vm command fails with KeyError access_token

If the `az ssh vm` command fails, you're using an outdated version of the Azure CLI client.

The solution is to upgrade the Azure CLI client to version 2.21.0 or later.

#### SSH connection is closed

After a user successfully signs in by using `az login`, connection to the VM through `az ssh vm -ip <address>` or `az ssh vm --name <vm_name> -g <resource_group>` might fail with "Connection closed by <ip_address> port 22."

One cause for this error is that the user isn't assigned to the Virtual Machine Administrator Login or Virtual Machine User Login role within the scope of this VM. In that case, the solution is to add the user to one of those Azure RBAC roles within the scope of this VM.

This error can also happen if the user is in a required Azure RBAC role, but the system-assigned managed identity has been disabled on the VM. In that case, perform these actions:

1. Enable the system-assigned managed identity on the VM.
1. Allow several minutes to pass before the user tries to connect by using `az ssh vm --ip <ip_address>`.

### Connection problems with virtual machine scale sets

VM connections with virtual machine scale sets can fail if the scale set instances are running an old model. 

Upgrading scale set instances to the latest model might resolve the problem, especially if an upgrade hasn't been done since the Microsoft Entra Login extension was installed. Upgrading an instance applies a standard scale set configuration to the individual instance.

<a name='allowgroups-or-denygroups-statements-in-sshd_config-cause-the-first-login-to-fail-for-azure-ad-users'></a>

### AllowGroups or DenyGroups statements in sshd_config cause the first login to fail for Microsoft Entra users

If *sshd_config* contains either `AllowGroups` or `DenyGroups` statements, the first login fails for Microsoft Entra users. If the statement was added after users have already had a successful login, they can log in.

One solution is to remove `AllowGroups` and `DenyGroups` statements from *sshd_config*.

Another solution is to move `AllowGroups` and `DenyGroups` to a `match user` section in *sshd_config*. Make sure the match template excludes Microsoft Entra users.

### Getting Permission Denied when trying to connect from Azure Shell to Linux Red Hat/Oracle/Centos 7.X VM.

The OpenSSH server version in the target VM 7.4 is too old. Version incompatible with OpenSSH client version 8.8. Refer to [RSA SHA256 certificates no longer work](https://bugzilla.mindrot.org/show_bug.cgi?id=3351) for more information.

Workaround:  

- Adding option `"PubkeyAcceptedKeyTypes= +ssh-rsa-cert-v01@openssh.com"` in the `az ssh vm ` command.

```azurecli-interactive
az ssh vm -n myVM -g MyResourceGroup -- -A -o "PubkeyAcceptedKeyTypes= +ssh-rsa-cert-v01@openssh.com"
```
- Adding the option `"PubkeyAcceptedKeyTypes= +ssh-rsa-cert-v01@openssh.com"` in the `/home/<user>/.ssh/config file`.


Add the `"PubkeyAcceptedKeyTypes +ssh-rsa-cert-v01@openssh.com"` into the client config file.

```config
Host *
PubkeyAcceptedKeyTypes +ssh-rsa-cert-v01@openssh.com
```

## Next steps

- [What is a device identity?](overview.md)
- [Common Conditional Access policies](../conditional-access/concept-conditional-access-policy-common.md)
