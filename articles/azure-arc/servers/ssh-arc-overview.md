---
title: SSH access to Azure Arc-enabled servers
description: Use SSH remoting to access and manage Azure Arc-enabled servers.
ms.date: 07/01/2023
ms.topic: conceptual
ms.custom: references_regions
---

# SSH access to Azure Arc-enabled servers
SSH for Arc-enabled servers enables SSH based connections to Arc-enabled servers without requiring a public IP address or additional open ports.
This functionality can be used interactively, automated, or with existing SSH based tooling,
allowing existing management tools to have a greater impact on Azure Arc-enabled servers.

## Key benefits
SSH access to Arc-enabled servers provides the following key benefits:
 - No public IP address or open SSH ports required
 - Access to Windows and Linux machines
 - Ability to log in as a local user or an [Azure user (Linux only)](../../active-directory/devices/howto-vm-sign-in-azure-ad-linux.md)
 - Support for other OpenSSH based tooling with config file support

## Prerequisites
To enable this functionality, ensure the following: 
 - Ensure the Arc-enabled server has a hybrid agent version of "1.31.xxxx" or higher.  Run: ```azcmagent show``` on your Arc-enabled Server.
 - Ensure the Arc-enabled server has the "sshd" service enabled. For Linux machines `openssh-server` can be installed via a package manager and needs to be enabled.  SSHD needs to be [enabled on Windows](/windows-server/administration/openssh/openssh_install_firstuse).
 - Ensure you have the Owner or Contributer role assigned.

Authenticating with Microsoft Entra credentials has additional requirements:
 - `aadsshlogin` and `aadsshlogin-selinux` (as appropriate) must be installed on the Arc-enabled server. These packages are installed with the `Azure AD based SSH Login – Azure Arc` VM extension. 
 - Configure role assignments for the VM.  Two Azure roles are used to authorize VM login:
   - **Virtual Machine Administrator Login**: Users who have this role assigned can log in to an Azure virtual machine with administrator privileges.
   - **Virtual Machine User Login**: Users who have this role assigned can log in to an Azure virtual machine with regular user privileges.
 
    An Azure user who has the Owner or Contributor role assigned for a VM doesn't automatically have privileges to Microsoft Entra login to the VM over SSH. There's an intentional (and audited) separation between the set of people who control virtual machines and the set of people who can access virtual machines. 

    > [!NOTE]
    > The Virtual Machine Administrator Login and Virtual Machine User Login roles use `dataActions` and can be assigned at the management group, subscription, resource group, or resource scope. We recommend that you assign the roles at the management group, subscription, or resource level and not at the individual VM level. This practice avoids the risk of reaching the [Azure role assignments limit](../../role-based-access-control/troubleshoot-limits.md) per subscription.

### Availability
SSH access to Arc-enabled servers is currently supported in all regions supported by Arc-Enabled Servers with the following exceptions:
 - Germany West Central

## Getting started

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
> The following step will not need to be run for most users as it should complete automatically at first connection.
> This step must be completed for each Arc-enabled server.

#### [Create the default endpoint with Azure CLI:](#tab/azure-cli)
```bash
az rest --method put --uri https://management.azure.com/subscriptions/<subscription>/resourceGroups/<resourcegroup>/providers/Microsoft.HybridCompute/machines/<arc enabled server name>/providers/Microsoft.HybridConnectivity/endpoints/default?api-version=2023-03-15 --body '{"properties": {"type": "default"}}'
```
> [!NOTE]
> If using Azure CLI from PowerShell, the following should be used.
```powershell
az rest --method put --uri https://management.azure.com/subscriptions/<subscription>/resourceGroups/<resourcegroup>/providers/Microsoft.HybridCompute/machines/<arc enabled server name>/providers/Microsoft.HybridConnectivity/endpoints/default?api-version=2023-03-15 --body '{\"properties\":{\"type\":\"default\"}}'
```

Validate endpoint creation:
 ```bash
az rest --method get --uri https://management.azure.com/subscriptions/<subscription>/resourceGroups/<resourcegroup>/providers/Microsoft.HybridCompute/machines/<arc enabled server name>/providers/Microsoft.HybridConnectivity/endpoints/default?api-version=2023-03-15
 ```
 
#### [Create the default endpoint with Azure PowerShell:](#tab/azure-powershell)
 ```powershell
Invoke-AzRestMethod -Method put -Path /subscriptions/<subscription>/resourceGroups/<resourcegroup>/providers/Microsoft.HybridCompute/machines/<arc enabled server name>/providers/Microsoft.HybridConnectivity/endpoints/default?api-version=2023-03-15 -Payload '{"properties": {"type": "default"}}'
```

Validate endpoint creation:
 ```powershell
 Invoke-AzRestMethod -Method get -Path /subscriptions/<subscription>/resourceGroups/<resourcegroup>/providers/Microsoft.HybridCompute/machines/<arc enabled server name>/providers/Microsoft.HybridConnectivity/endpoints/default?api-version=2023-03-15
 ```
 ---
 
 ### Install local command line tool
This functionality is currently packaged in an Azure CLI extension and an Azure PowerShell module.
#### [Install Azure CLI extension](#tab/azure-cli)

```az extension add --name ssh```

> [!NOTE]
> The Azure CLI extension version must be greater than 2.0.0.

#### [Install Azure PowerShell module](#tab/azure-powershell)

```powershell
Install-Module -Name Az.Ssh -Scope CurrentUser -Repository PSGallery
Install-Module -Name Az.Ssh.ArcProxy -Scope CurrentUser -Repository PSGallery
```

---

### Enable functionality on your Arc-enabled server
In order to use the SSH connect feature, you must update the Service Configuration in the Connectivity Endpoint on the Arc-Enabled Server to allow SSH connection to a specific port. You may only allow connection to a single port. The CLI tools attempt to update the allowed port at runtime, but the port can be manually configured with the following:

> [!NOTE]
> There may be a delay after updating the Service Configuration until you are able to connect.

#### [Azure CLI](#tab/azure-cli)

```az rest --method put --uri https://management.azure.com/subscriptions/<subscription>/resourceGroups/<resourcegroup>/providers/Microsoft.HybridCompute/machines/<arc enabled server name>/providers/Microsoft.HybridConnectivity/endpoints/default/serviceconfigurations/SSH?api-version=2023-03-15 --body '{\"properties\": {\"serviceName\": \"SSH\", \"port\": \"22\"}}'```

#### [Azure PowerShell](#tab/azure-powershell)

```Invoke-AzRestMethod -Method put -Path /subscriptions/<subscription>/resourceGroups/<resourcegroup>/providers/Microsoft.HybridCompute/machines/<arc enabled server name>/providers/Microsoft.HybridConnectivity/endpoints/default/serviceconfigurations/SSH?api-version=2023-03-15 -Payload '{"properties": {"serviceName": "SSH", "port": 22}}'```

---

If you're using a nondefault port for your SSH connection, replace port 22 with your desired port in the previous command.

### Optional: Install Azure AD login extension
The `Azure AD based SSH Login – Azure Arc` VM extension can be added from the extensions menu of the Arc server. The Azure AD login extension can also be installed locally via a package manager via: `apt-get install aadsshlogin` or the following command.

```az connectedmachine extension create --machine-name <arc enabled server name> --resource-group <resourcegroup> --publisher Microsoft.Azure.ActiveDirectory --name AADSSHLogin --type AADSSHLoginForLinux --location <location>```


## Examples
To view examples, view the Az CLI documentation page for [az ssh](/cli/azure/ssh) or the Azure PowerShell documentation page for [Az.Ssh](/powershell/module/az.ssh).

## Next steps

- Learn about [OpenSSH for Windows](/windows-server/administration/openssh/openssh_overview)
- Learn about troubleshooting [SSH access to Azure Arc-enabled servers](ssh-arc-troubleshoot.md).
- Learn about troubleshooting [agent connection issues](troubleshoot-agent-onboard.md).
