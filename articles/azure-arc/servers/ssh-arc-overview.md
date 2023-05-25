---
title: (Preview) SSH access to Azure Arc-enabled servers
description: Leverage SSH remoting to access and manage Azure Arc-enabled servers.
ms.date: 04/12/2023
ms.topic: conceptual
ms.custom: references_regions
---

# SSH access to Azure Arc-enabled servers
SSH for Arc-enabled servers enables SSH based connections to Arc-enabled servers without requiring a public IP address or additional open ports.
This functionality can be used interactively, automated, or with existing SSH based tooling,
allowing existing management tools to have a greater impact on Azure Arc-enabled servers.

> [!IMPORTANT]
> SSH for Arc-enabled servers is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Key benefits
SSH access to Arc-enabled servers provides the following key benefits:
 - No public IP address or open SSH ports required
 - Access to Windows and Linux machines
 - Ability to log in as a local user or an [Azure user (Linux only)](../../active-directory/devices/howto-vm-sign-in-azure-ad-linux.md)
 - Support for other OpenSSH based tooling with config file support

## Prerequisites
To leverage this functionality, please ensure the following: 
 - Ensure the Arc-enabled server has a hybrid agent version of "1.13.21320.014" or higher.
 - Run: ```azcmagent show``` on your Arc-enabled Server.
 - [Ensure the Arc-enabled server has the "sshd" service enabled](/windows-server/administration/openssh/openssh_install_firstuse).
 - Ensure you have the Virtual Machine Local User Login role assigned (role ID: 602da2baa5c241dab01d5360126ab525)

Authenticating with Azure AD credentials has additional requirements:
 - `aadsshlogin` and `aadsshlogin-selinux` (as appropriate) must be installed on the Arc-enabled server. These packages are installed with the AADSSHLoginForLinux VM extension. 
 - Configure role assignments for the VM.  Two Azure roles are used to authorize VM login:
   - **Virtual Machine Administrator Login**: Users who have this role assigned can log in to an Azure virtual machine with administrator privileges.
   - **Virtual Machine User Login**: Users who have this role assigned can log in to an Azure virtual machine with regular user privileges.
 
    An Azure user who has the Owner or Contributor role assigned for a VM doesn't automatically have privileges to Azure AD login to the VM over SSH. There's an intentional (and audited) separation between the set of people who control virtual machines and the set of people who can access virtual machines. 

    > [!NOTE]
    > The Virtual Machine Administrator Login and Virtual Machine User Login roles use `dataActions` and can be assigned at the management group, subscription, resource group, or resource scope. We recommend that you assign the roles at the management group, subscription, or resource level and not at the individual VM level. This practice avoids the risk of reaching the [Azure role assignments limit](../../role-based-access-control/troubleshooting.md#limits) per subscription.

### Availability
SSH access to Arc-enabled servers is currently supported in all regions supported by Arc-Enabled Servers with the following exceptions:
 - Germany West Central

## Getting started

### Install local command line tool
This functionality is currently packaged in an Azure CLI extension and an Azure PowerShell module.
#### [Install Azure CLI extension](#tab/azure-cli)

```az extension add --name ssh```

> [!NOTE]
> The Azure CLI extension version must be greater than 1.1.0.

#### [Install Azure PowerShell module](#tab/azure-powershell)

```Install-Module -Name AzPreview -Scope CurrentUser -Repository PSGallery -Force```

---

### Enable functionality on your Arc-enabled server
In order to use the SSH connect feature, you must enable connections on the hybrid agent.

> [!NOTE]
> The following actions must be completed in an elevated terminal session.

View your current incoming connections:

```azcmagent config list```

If you have existing ports, you'll need to include them in the following command.

To add access to SSH connections, run the following:

```azcmagent config set incomingconnections.ports 22<,other open ports,...>```

If you're using a non-default port for your SSH connection, replace port 22 with your desired port in the previous command.

> [!NOTE]
> The following steps will not need to be run for most users.

### Register the HybridConnectivity resource provider
> [!NOTE]
> This is a one-time operation that needs to be performed on each subscription.

Check if the HybridConnectivity resource provider (RP) has been registered:

```az provider show -n Microsoft.HybridConnectivity```

If the RP hasn't been registered, run the following:

```az provider register -n Microsoft.HybridConnectivity```

This operation can take 2-5 minutes to complete.  Before moving on, check that the RP has been registered.

### Create default connectivity endpoint
> [!NOTE]
> The following actions must be completed for each Arc-enabled server.

Create the default endpoint in PowerShell:
 ```powershell
 az rest --method put --uri https://management.azure.com/subscriptions/<subscription>/resourceGroups/<resourcegroup>/providers/Microsoft.HybridCompute/machines/<arc enabled server name>/providers/Microsoft.HybridConnectivity/endpoints/default?api-version=2021-10-06-preview --body '{\"properties\": {\"type\": \"default\"}}'
 ```
Create the default endpoint in Bash:
```bash
az rest --method put --uri https://management.azure.com/subscriptions/<subscription>/resourceGroups/<resourcegroup>/providers/Microsoft.HybridCompute/machines/<arc enabled server name>/providers/Microsoft.HybridConnectivity/endpoints/default?api-version=2021-10-06-preview --body '{"properties": {"type": "default"}}'
```
Validate endpoint creation:
 ```
 az rest --method get --uri https://management.azure.com/subscriptions/<subscription>/resourceGroups/<resourcegroup>/providers/Microsoft.HybridCompute/machines/<arc enabled server name>/providers/Microsoft.HybridConnectivity/endpoints/default?api-version=2021-10-06-preview
 ```

## Examples
To view examples, view the Az CLI documentation page for [az ssh](/cli/azure/ssh) or the Azure PowerShell documentation page for [Az.Ssh](/powershell/module/az.ssh).
