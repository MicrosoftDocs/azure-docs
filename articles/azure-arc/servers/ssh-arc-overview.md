---
title: (Preview) SSH access to Azure Arc-enabled servers
description: Leverage SSH remoting to access and manage Azure Arc-enabled servers.
ms.date: 03/25/2022
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
 - Ability to log-in as a local user or an [Azure user (Linux only)](../../active-directory/devices/howto-vm-sign-in-azure-ad-linux.md)
 - Support for other OpenSSH based tooling with config file support

## Prerequisites
To leverage this functionality, please ensure the following: 
 - Ensure the Arc-enabled server has a hybrid agent version of "1.13.21320.014" or higher.
 - Run: ```azcmagent show``` on your Arc-enabled Server.
 - [Ensure the Arc-enabled server has the "sshd" service enabled](/windows-server/administration/openssh/openssh_install_firstuse).
 - Ensure you have the Virtual Machine Local User Login role assigned (role ID: 602da2baa5c241dab01d5360126ab525)

### Availability
SSH access to Arc-enabled servers is currently supported in the following regions:
- eastus2euap, eastus, eastus2, westus2, southeastasia, westeurope, northeurope, westcentralus, southcentralus, uksouth, australiaeast, francecentral, japaneast, eastasia, koreacentral, westus3, westus, centralus, northcentralus.

### Supported operating systems
 - Windows: Windows 7+ and Windows Server 2012+
 - Linux: 
   - CentOS: CentOS 7, CentOS 8
   - RedHat Enterprise Linux (RHEL): RHEL 7.4 to RHEL 7.10, RHEL 8.3+
   - SUSE Linux Enterprise Server (SLES): SLES 12, SLES 15.1+
   - Ubuntu Server: Ubuntu Server 16.04 to Ubuntu Server 20.04

## Getting started
### Register the HybridConnectivity resource provider
> [!NOTE]
> This is a one-time operation that needs to be performed on each subscription.

Check if the HybridConnectivity resource provider (RP) has been registered:

```az provider show -n Microsoft.HybridConnectivity```

If the RP has not been registered, run the following:

```az provider register -n Microsoft.HybridConnectivity```

This operation can take 2-5 minutes to complete.  Before moving on, check that the RP has been registered.

### Install az CLI extension
This functionality is currently package in an az CLI extension.
In order to install this extension, run:

```az extension add --name ssh```

If you already have the extension installed, it can be updated by running:

```az extension update --name ssh```

> [!NOTE]
> The Azure CLI extension version must be greater than 1.1.0.

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

### Enable functionality on your Arc-enabled server
In order to use the SSH connect feature, you must enable connections on the hybrid agent.

> [!NOTE]
> The following actions must be completed in an elevated terminal session.

View your current incoming connections:

```azcmagent config list```

If you have existing ports, you will need to include them in the following command.

To add access to SSH connections, run the following:

```azcmagent config set incomingconnections.ports 22<,other open ports,...>```

> [!NOTE]
> If you are using a non-default port for your SSH connection, replace port 22 with your desired port in the previous command.

## Examples
To view examples of using the ```az ssh arc``` command, view the az CLI documentation page for [az ssh](/cli/azure/ssh).
