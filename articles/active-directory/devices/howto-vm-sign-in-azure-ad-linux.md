---
title: Log in to a Linux virtual machine in Azure by using Azure AD and OpenSSH
description: Learn how to log in to an Azure VM that's running Linux by using Azure Active Directory and OpenSSH certificate-based authentication.

services: active-directory
ms.service: active-directory
ms.subservice: devices
ms.topic: how-to
ms.date: 06/20/2022

ms.author: joflore
author: MicrosoftGuyJFlo
manager: karenhoran
ms.reviewer: sandeo
ms.custom: references_regions, devx-track-azurecli, subject-rbac-steps
ms.collection: M365-identity-device-management
---
# Log in to a Linux virtual machine in Azure by using Azure AD and OpenSSH

To improve the security of Linux virtual machines (VMs) in Azure, you can integrate with Azure Active Directory (Azure AD) authentication. You can now use Azure AD as a core authentication platform and a certificate authority to SSH into a Linux VM by using Azure AD and openSSH certificate-based authentication. 

This functionality allows organizations to manage access to VMs with Azure role-based access control (RBAC) and Conditional Access policies. This article shows you how to create and configure a Linux VM and log in with Azure AD by using openSSH certificate-based authentication.

> [!IMPORTANT]
> This capability is now generally available. The previous version that made use of device code flow was [deprecated on August 15, 2021](../../virtual-machines/linux/login-using-aad.md). To migrate from the old version to this version, see the section [Migration from previous preview](#migration-from-previous-preview).

There are many security benefits of using Azure AD with openSSH certificate-based authentication to log in to Linux VMs in Azure. They include:

- Use your Azure AD credentials to log in to Azure Linux VMs.
- Get SSH key-based authentication without needing to distribute SSH keys to users or provision SSH public keys on any Azure Linux VMs that you deploy. This experience is much simpler than having to worry about sprawl of stale SSH public keys that could cause unauthorized access.
- Reduce reliance on local administrator accounts, credential theft, and weak credentials.
- Help secure Linux VMs by configuring password complexity and password lifetime policies for Azure AD.
- With RBAC, specify who can log in to a VM as a regular user or with administrator privileges. When users join your team, you can update the Azure RBAC policy for the VM to grant access as appropriate. When employees leave your organization and their user account is disabled or removed from Azure AD, they no longer have access to your resources.
- With Conditional Access, configure policies to require multifactor authentication or to require that your client device is managed (for example, compliant or hybrid Azure AD joined) before you can use it SSH into Linux VMs. 
- Use Azure deploy and audit policies to require Azure AD login for Linux VMs and flag unapproved local accounts.

Login to Linux VMs with Azure Active Directory works for customers who use Active Directory Federation Services.

## Supported Linux distributions and Azure regions

The following Linux distributions are currently supported for deployments in a supported region:

| Distribution | Version |
| --- | --- |
| Common Base Linux Mariner (CBL-Mariner) | CBL-Mariner 1, CBL-Mariner 2 |
| CentOS | CentOS 7, CentOS 8 |
| Debian | Debian 9, Debian 10, Debian 11 |
| openSUSE | openSUSE Leap 42.3, openSUSE Leap 15.1+ |
| RedHat Enterprise Linux (RHEL) | RHEL 7.4 to RHEL 7.10, RHEL 8.3+ |
| SUSE Linux Enterprise Server (SLES) | SLES 12, SLES 15.1+ |
| Ubuntu Server | Ubuntu Server 16.04 to Ubuntu Server 22.04 |

The following Azure regions are currently supported for this feature:

- Azure Global
- Azure Government
- Azure China 21Vianet

Use of the SSH extension for Azure CLI on Azure Kubernetes Service (AKS) clusters is not supported. For more information, see [Support policies for AKS](../../aks/support-policies.md).

If you choose to install and use the Azure CLI locally, it must be version 2.22.1 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli).

> [!NOTE]
> This functionality is also available for [Azure Arc-enabled servers](../../azure-arc/servers/ssh-arc-overview.md).

## Requirements for login with Azure AD using openSSH certificate-based authentication

To enable Azure AD login through SSH certificate-based authentication for Linux VMs in Azure, be sure to meet the the following network, virtual machine, and client (SSH client) requirements.

### Network

VM network configuration must permit outbound access to the following endpoints over TCP port 443.

For Azure Global:

- `https://packages.microsoft.com`: For package installation and upgrades.
- `http://169.254.169.254`: Azure Instance Metadata Service endpoint.
- `https://login.microsoftonline.com`: For PAM-based (pluggable authentication modules) authentication flows.
- `https://pas.windows.net`: For Azure RBAC flows.

For Azure Government:

- `https://packages.microsoft.com`: For package installation and upgrades.
- `http://169.254.169.254`: Azure Instance Metadata Service endpoint.
- `https://login.microsoftonline.us`: For PAM-based authentication flows.
- `https://pasff.usgovcloudapi.net`: For Azure RBAC flows.

For Azure China 21Vianet:

- `https://packages.microsoft.com`: For package installation and upgrades.
- `http://169.254.169.254`: Azure Instance Metadata Service endpoint.
- `https://login.chinacloudapi.cn`: For PAM-based authentication flows.
- `https://pas.chinacloudapi.cn`: For Azure RBAC flows.

### Virtual machine

Ensure that your VM is configured with the following functionality:

- System-assigned managed identity. This option is automatically selected when you use the Azure portal to create VMs and select the Azure AD login option. You can also enable system-assigned managed identity on a new or existing VM by using the Azure CLI.
- `aadsshlogin` and `aadsshlogin-selinux` (as appropriate). These packages are installed with the AADSSHLoginForLinux VM extension. The extension is installed when you use the Azure portal or the Azure CLI to create VMs and enable Azure AD login (**Management** tab).

### Client

Ensure that your client meets the following requirements:

- SSH client support for OpenSSH-based certificates for authentication. You can use Azure CLI (2.21.1 or later) with OpenSSH (included in Windows 10 version 1803 or later) or Azure Cloud Shell to meet this requirement. 
- SSH extension for Azure CLI. You can install this extension by using `az extension add --name ssh`. You don't need to install this extension when you're using Azure Cloud Shell, because it comes preinstalled.

  If you're using any SSH client other than Azure CLI or Azure Cloud Shell that supports OpenSSH certificates, you'll still need to use the Azure CLI with the SSH extension to retrieve ephemeral SSH certificates and optionally a configuration file. You can then use the configuration file with your SSH client.
- TCP connectivity from the client to either the public or private IP address of the VM. (ProxyCommand or SSH forwarding to a machine with connectivity also works.)

> [!IMPORTANT]
> SSH clients based on PuTTy don't support openSSH certificates and can't be used to log in with Azure AD openSSH certificate-based authentication.

## Enable Azure AD login for a Linux VM in Azure

To use Azure AD login for Linux VM in Azure, you need to first enable the Azure AD login option for your Linux VM. You then configure Azure role assignments for users who are authorized to log in to the VM. Finally, you use the SSH client that supports OpenSSH, such as the Azure CLI or Azure Cloud Shell, to SSH into your Linux VM. 

There are multiple ways to enable Azure AD login for your Linux VM. For example, you can use:

- The Azure portal experience when creating a Linux VM.
- The Azure Cloud Shell experience when creating a Windows VM or for an existing Linux VM.

### Use the Azure portal to create an VM experience to enable Azure AD login

You can enable Azure AD login for any of the [supported Linux distributions](#supported-linux-distributions-and-azure-regions) by using the Azure portal.

FOr example, to create an Ubuntu Server 18.04 Long Term Support (LTS) VM in Azure with Azure AD login:

1. Sign in to the Azure portal by using an account that has access to create VMs, and then select **+ Create a resource**.
1. Select **Create** under **Ubuntu Server 18.04 LTS** in the **Popular** view.
1. On the **Management** tab: 
   1. Select the **Login with Azure Active Directory (Preview)** checkbox.
   1. Ensure that the **System assigned managed identity** checkbox is selected.
1. Go through the rest of the experience of creating a virtual machine. During this preview, you'll have to create an administrator account with username and password or SSH public key.

### Use the Azure Cloud Shell experience to enable Azure AD login

Azure Cloud Shell is a free, interactive shell that you can use to run the steps in this article. Common Azure tools are preinstalled and configured in Cloud Shell for you to use with your account. Just select the **Copy** button to copy the code, paste it in Cloud Shell, and then select the Enter key to run it. 

There are a few ways to open Cloud Shell:

- Select **Try It** in the upper-right corner of a code block.
- Open Cloud Shell in your browser.
- Select the Cloud Shell button on the menu in the upper-right corner of the Azure portal.

If you choose to install and use the Azure CLI locally, this article requires that you run version 2.22.1 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli).

1. Create a resource group by running [az group create](/cli/azure/group#az-group-create).
1. Create a VM by running [az vm create](/cli/azure/vm#az-vm-create&preserve-view=true). Use a supported distribution in a supported region.
1. Install the Azure AD login VM extension by using [az vm extension set](/cli/azure/vm/extension#az-vm-extension-set).

The following example deploys a VM and then installs the extension to enable Azure AD login for a Linux VM. VM extensions are small applications that provide post-deployment configuration and automation tasks on Azure virtual machines. Customize the example as needed to support your testing requirements.

```azurecli-interactive
az group create --name AzureADLinuxVM --location southcentralus
az vm create \
    --resource-group AzureADLinuxVM \
    --name myVM \	
    --image UbuntuLTS \
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

The AADSSHLoginForLinux extension can be installed on an existing (supported distribution) Linux VM with a running VM agent to enable Azure AD authentication. If you're deploying this extension to a previously created VM, the VM must have at least 1 GB of memory allocated or the installation will fail.

The `provisioningState` value of `Succeeded` appears when the extension is successfully installed on the VM. The VM must have a running [VM agent](../../virtual-machines/extensions/agent-linux.md) to install the extension.

## Configure role assignments for the VM

Now that you've created the VM, you need to configure an Azure RBAC policy to determine who can log in to the VM. Two Azure roles are used to authorize VM login:

- **Virtual Machine Administrator Login**: Users who have this role assigned can log in to an Azure virtual machine with administrator privileges.
- **Virtual Machine User Login**: Users who have this role assigned can log in to an Azure virtual machine with regular user privileges.
 
To log in to a VM over SSH, you must have the Virtual Machine Administrator Login or Virtual Machine User Login role on the resource group that contains the VM and its associated virtual network, network interface, public IP address, or load balancer resources. 

An Azure user who has the Owner or Contributor roles assigned for a VM doesn't automatically have privileges to Azure AD login to the VM over SSH. This separation is to provide audited separation between the set of people who control virtual machines and the set of people who can access virtual machines. 

There are multiple ways to configure role assignments for a VM. For example, you can use:

- The Azure AD portal experience.
- The Azure Cloud Shell experience.

> [!NOTE]
> The Virtual Machine Administrator Login and Virtual Machine User Login roles use `dataActions` and can be assigned at the management group, subscription, resource group, or resource scope. We recommend that you assign the roles at the management group, subscription, or resource level and not at the individual VM level. This practice avoids the risk of reaching the [Azure role assignments limit](../../role-based-access-control/troubleshooting.md#azure-role-assignments-limit) per subscription.

### Use Azure AD Portal experience

To configure role assignments for your Azure AD-enabled Linux VMs:

1. For **Resource Group**, select the resource group that contains the VM and its associated virtual network, network interface, public IP address, or load balancer resource.

1. Select **Access control (IAM)**.

1. Select **Add** > **Add role assignment** to open the **Add role assignment** page.

1. Assign the following role. For detailed steps, see [Assign Azure roles by using the Azure portal](../../role-based-access-control/role-assignments-portal.md).

    | Setting | Value |
    | --- | --- |
    | Role | **Virtual Machine Administrator Login** or **Virtual Machine User Login** |
    | Assign access to | User, group, service principal, or managed identity |

    ![Screenshot that shows the page for adding a role assignment in the Azure portal.](../../../includes/role-based-access-control/media/add-role-assignment-page.png)

After a few moments, the security principal is assigned the role at the selected scope.

### Use the Azure Cloud Shell experience

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
> If your Azure AD domain and logon username domain don't match, you must specify the object ID of your user account by using `--assignee-object-id`, not just the username for `--assignee`. You can obtain the object ID for your user account by using [az ad user list](/cli/azure/ad/user#az-ad-user-list).
>
> For more information on how to use Azure RBAC to manage access to your Azure subscription resources, see [Steps to assign an Azure role](../../role-based-access-control/role-assignments-steps.md).

## Install the SSH extension for Azure CLI

If you're using Azure Cloud Shell, no other setup is needed because both the minimum required version of the Azure CLI and the SSH extension for Azure CLI are already included in the Cloud Shell environment.

Run the following command to add the SSH extension for Azure CLI:

```azurecli
az extension add --name ssh
```

The minimum version required for the extension is 0.1.4. Check the installed SSH extension version by using the following command:

```azurecli
az extension show --name ssh
```

## Using Conditional Access

You can enforce Conditional Access policies that are enabled with Azure AD login, such as requiring multifactor authentication, requiring a compliant or hybrid Azure AD-joined device for the device running the SSH client, and checking for risks before authorizing access to Linux VMs in Azure. The application that appears in the Conditional Access policy is called *Azure Linux VM Sign-In*.

> [!NOTE]
> Conditional Access policy enforcement that requires device compliance or hybrid Azure AD join on the client device running SSH client only works with Azure CLI running on Windows and macOS. It's not supported when you're using the Azure CLI on Linux or Azure Cloud Shell.

### Missing application

If the Azure Linux VM Sign-In application is missing from Conditional Access, use the following steps to remediate the issue:

1. Check to make sure the application isn't in the tenant:
   1. Sign in to the **Azure portal**.
   1. Browse to **Azure Active Directory** > **Enterprise applications**.
   1. Remove the filters to see all applications, and search for **VM**. If you don't see Azure Linux VM Sign-In as a result, the service principal is missing from the tenant.

Another way to verify it is via Graph PowerShell:

1. [Install the Graph PowerShell SDK](/powershell/microsoftgraph/installation) if you haven't already done so. 
1. `Connect-MgGraph -Scopes "ServicePrincipalEndpoint.ReadWrite.All","Application.ReadWrite.All"`
1. Sign-in with a Global Admin account
1. Consent to permission prompt
1. `Get-MgServicePrincipal -ConsistencyLevel eventual -Search '"DisplayName:Azure Linux VM Sign-In"'`
   1. If this command results in no output and returns you to the PowerShell prompt, you can create the Service Principal with the following Graph PowerShell command:
   1. `New-MgServicePrincipal -AppId ce6ff14a-7fdc-4685-bbe0-f6afdfcfa8e0`
   1. Successful output will show that the AppID and the Application Name Azure Linux VM Sign-In was created.
1. Sign out of Graph PowerShell when complete with the following command: `Disconnect-MgGraph`

## Login using Azure AD user account to SSH into the Linux VM

### Using Azure CLI

Enter `az login`, and then enter `az ssh vm`.

```azurecli
az login 
```

The `az login` command will open a browser window, where users can sign in by using their Azure AD account. 

The following example automatically resolves the appropriate IP address for the VM.

```azurecli
az ssh vm -n myVM -g AzureADLinuxVM
```

If prompted, enter your Azure AD login credentials at the login page, perform an MFA, and/or satisfy device checks. You'll only be prompted if your Azure CLI session doesn't already meet any required Conditional Access criteria. Close the browser window, return to the SSH prompt, and you'll be automatically connected to the VM.

You're now signed in to the Azure Linux virtual machine with the role permissions as assigned, such as VM User or VM Administrator. If your user account is assigned the Virtual Machine Administrator Login role, you can use sudo to run commands that require root privileges.

### Using Azure Cloud Shell

You can use Azure Cloud Shell to connect to VMs without needing to install anything locally to your client machine. Start Cloud Shell by clicking the shell icon in the upper right corner of the Azure portal.

Azure Cloud Shell will automatically connect to a session in the context of the signed in user. During the Azure AD Login for Linux Preview, **you must run az login again and go through an interactive sign in flow**.

```azurecli
az login
```

Then you can use the normal `az ssh vm` commands to connect using name and resource group or IP address of the VM.

```azurecli
az ssh vm -n myVM -g AzureADLinuxVM
```

> [!NOTE]
> Conditional Access policy enforcement requiring device compliance or Hybrid Azure AD join is not supported when using Azure Cloud Shell.

### Login using Azure AD service principal to SSH into the Linux VM

Azure CLI supports authenticating with a service principal instead of a user account. Since service principals are account not tied to any particular user, customers can use them to SSH to a VM to support any automation scenarios they may have. The service principal must have VM Administrator or VM User rights assigned. Assign permissions at the subscription or resource group level. 

The following example will assign VM Administrator rights to the service principal at the resource group level. Replace the service principal object ID, subscription ID, and resource group name fields.

```azurecli
az role assignment create \
    --role "Virtual Machine Administrator Login" \
    --assignee-object-id <service-principal-objectid> \
    --assignee-principal-type ServicePrincipal \
    --scope “/subscriptions/<subscription-id>/resourceGroups/<resourcegroup-name>"
```

Use the following example to authenticate to Azure CLI using the service principal. To learn more about signing in using a service principal, see the article [Sign in to Azure CLI with a service principal](/cli/azure/authenticate-azure-cli#sign-in-with-a-service-principal).

```azurecli
az login --service-principal -u <sp-app-id> -p <password-or-cert> --tenant <tenant-id>
```

Once authentication with a service principal is complete, use the normal Azure CLI SSH commands to connect to the VM.

```azurecli
az ssh vm -n myVM -g AzureADLinuxVM
```

### Exporting SSH Configuration for use with SSH clients that support OpenSSH

Login to Azure Linux VMs with Azure AD supports exporting the OpenSSH certificate and configuration, allowing you to use any SSH clients that support OpenSSH based certificates to sign in Azure AD. The following example exports the configuration for all IP addresses assigned to the VM.

```azurecli
az ssh config --file ~/.ssh/config -n myVM -g AzureADLinuxVM
```

Alternatively, you can export the config by specifying just the IP address. Replace the IP address in the example with the public or private IP address (you must bring your own connectivity for private IPs) for your VM. Type `az ssh config -h` for help on this command.

```azurecli
az ssh config --file ~/.ssh/config --ip 10.11.123.456
```

You can then connect to the VM through normal OpenSSH usage. Connection can be done through any SSH client that uses OpenSSH.

## Sudo and Azure AD login

Once, users assigned the VM Administrator role successfully SSH into a Linux VM, they'll be able to run sudo with no other interaction or authentication requirement. Users assigned the VM User role won't be able to run sudo.

## Virtual machine scale set support

Virtual machine scale sets are supported, but the steps are slightly different for enabling and connecting to virtual machine scale set VMs.

1. Create a virtual machine scale set or choose one that already exists. Enable a system assigned managed identity for your virtual machine scale set.

```azurecli
az vmss identity assign --name myVMSS --resource-group AzureADLinuxVM
```

2. Install the Azure AD extension on your virtual machine scale set.

```azurecli
az vmss extension set --publisher Microsoft.Azure.ActiveDirectory --name AADSSHLoginForLinux --resource-group AzureADLinuxVM --vmss-name myVMSS
```

Virtual machine scale sets usually don't have public IP addresses. You must have connectivity to them from another machine that can reach their Azure virtual network. This example shows how to use the private IP of a virtual machine scale set VM to connect from a machine in the same virtual network. 

```azurecli
az ssh vm --ip 10.11.123.456
```

> [!NOTE]
> You cannot automatically determine the virtual machine scale set VM's IP addresses using the `--resource-group` and `--name` switches.

## Migration from previous preview

For customers who are using previous version of Azure AD login for Linux that was based on device code flow, complete the following steps using Azure CLI.

1. Uninstall the AADLoginForLinux extension on the VM.

   ```azurecli
   az vm extension delete -g MyResourceGroup --vm-name MyVm -n AADLoginForLinux
   ```
    > [!NOTE]
    > The extension uninstall can fail if there are any Azure AD users currently logged in on the VM. Make sure all users are logged off first.
1. Enable system-assigned managed identity on your VM.

   ```azurecli
   az vm identity assign -g myResourceGroup -n myVm
   ```

1. Install the AADSSHLoginForLinux extension on the VM.

    ```azurecli
    az vm extension set \
        --publisher Microsoft.Azure.ActiveDirectory \
        --name AADSSHLoginForLinux \
        --resource-group myResourceGroup \
        --vm-name myVM
    ```

## Using Azure Policy to ensure standards and assess compliance

Use Azure Policy to ensure Azure AD login is enabled for your new and existing Linux virtual machines and assess compliance of your environment at scale on your Azure Policy compliance dashboard. With this capability, you can use many levels of enforcement: you can flag new and existing Linux VMs within your environment that don't have Azure AD login enabled. You can also use Azure Policy to deploy the Azure AD extension on new Linux VMs that don't have Azure AD login enabled, as well as remediate existing Linux VMs to the same standard. In addition to these capabilities, you can also use Azure Policy to detect and flag Linux VMs that have non-approved local accounts created on their machines. To learn more, review [Azure Policy](../../governance/policy/overview.md).

## Troubleshoot sign-in issues

Some common errors when you try to SSH with Azure AD credentials include no Azure roles assigned, and repeated prompts to sign-in. Use the following sections to correct these issues.

### Couldn't retrieve token from local cache

You must run `az login` again and go through an interactive sign-in flow. Review the section [Using Azure Cloud Shell](#using-azure-cloud-shell).

### Access denied: Azure role not assigned

If you see the following error on your SSH prompt, verify that you have configured Azure RBAC policies for the VM that grants the user either the Virtual Machine Administrator Login or Virtual Machine User Login role. If you're running into issues with Azure role assignments, see the article [Troubleshoot Azure RBAC](../../role-based-access-control/troubleshooting.md#azure-role-assignments-limit).

### Problems deleting the old (AADLoginForLinux) extension

If the uninstall scripts fail, the extension may get stuck in a transitioning state. When this happens, it can leave packages that it's supposed to uninstall during its removal. In such cases, it's better to manually uninstall the old packages and then try to run az vm extension delete command.

1.	Log in as a local user with admin privileges.
1.	Make sure there are no logged in Azure AD users. Call `who -u` command to see who is logged in; then `sudo kill <pid>` for all session processes reported by the previous command.
1.	Run `sudo apt remove --purge aadlogin` (Ubuntu/Debian), `sudo yum erase aadlogin` (RHEL or CentOS), or `sudo zypper remove aadlogin` (OpenSuse or SLES).
1.	If the command fails, try the low-level tools with scripts disabled:
   1. For Ubuntu/Deian run `sudo dpkg --purge aadlogin`. If it's still failing because of the script, delete `/var/lib/dpkg/info/aadlogin.prerm` file and try again.
   1. For everything else run `rpm -e –noscripts aadogin`.
1.	Repeat steps 3-4 for package `aadlogin-selinux`.

### Extension Install Errors

Installation of the AADSSHLoginForLinux VM extension to existing computers fails with one of the following known error codes:

#### Non-zero exit code: 22

The Status of the AADSSHLoginForLinux VM extension shows as Transitioning in the portal.

Cause 1: This failure is due to a system-assigned managed identity being required.

Solution 1: Perform these actions:

1. Uninstall the failed extension.
1. Enable a system-assigned managed identity on the Azure VM.
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

After the user has successfully signed in using az login, connection to the VM using `az ssh vm -ip <addres>` or `az ssh vm --name <vm_name> -g <resource_group>` fails with *Connection closed by <ip_address> port 22*.

Cause 1: The user isn't assigned to either of the Virtual Machine Administrator/User Login Azure RBAC roles within the scope of this VM.

Solution 1: Add the user to the either of the Virtual Machine Administrator/User Login Azure RBAC roles within the scope of this VM.

Cause 2: The user is in a required Azure RBAC role but the system-assigned managed identity has been disabled on the VM.

Solution 2: Perform these actions:

1. Enable the system-assigned managed identity on the VM.
1. Allow several minutes to pass before trying to connect using `az ssh vm --ip <ip_address>`.

### Virtual machine scale set Connection Issues

Virtual machine scale set VM connections may fail if the virtual machine scale set instances are running an old model. Upgrading virtual machine scale set instances to the latest model may resolve issues, especially if an upgrade hasn't been done since the Azure AD Login extension was installed. Upgrading an instance applies a standard virtual machine scale set configuration to the individual instance.

### AllowGroups / DenyGroups statements in sshd_config cause first login to fail for Azure AD users

Cause 1: If sshd_config contains either AllowGroups or DenyGroups statements, the very first login fails for Azure AD users. If the statement was added after a user already has a successful login, they can log in.

Solution 1: Remove AllowGroups and DenyGroups statements from sshd_config.

Solution 2: Move AllowGroups and DenyGroups to a "match user" section in sshd_config. Make sure the match template excludes Azure AD users.

## Next steps

[What is a device identity?](overview.md)
[Common Conditional Access policies](../conditional-access/concept-conditional-access-policy-common.md)
