---
title: SSH access to Azure Arc-enabled servers
description: Leverage SSH remoting to access and manage Azure Arc-enabled servers.
ms.date: 02/18/2022
ms.topic: conceptual
---

# SSH access to Azure Arc-enabled servers
SSH for Arc-enabled servers enables SSH based connections to Arc-enabled servers without requiring a public IP address or additional open ports.
This functionality can be used interactively, automated, or with existing SSH based tooling,
allowing existing management tools to have a greater impact on hybrid servers.

## Key benefits
SSH access to Arc-enabled servers provides the following key benefits:
 - No public IP address or open SSH ports required
 - Access to Windows and Linux machines
 - Ability to log-in as a local user or an Azure user (Linux only)
 - Support for other OpenSSH based tooling with config file support

## Availability
SSH access to Arc-enabled servers is currently supported in the following regions:
- eastus2euap, eastus, eastus2, westus2, southeastasia, westeurope, northeurope, westcentralus, southcentralus, uksouth, australiaeast, francecentral, japaneast, eastasia, koreacentral, westus3, westus, centralus, northcentralus.

## Prerequisites
TODO
- hybrid agent version
- extension version
- role assignment
- sshd enabled 
- supported operating systems

## Getting started
### Register the HybridConnectivity resource provider
> [!NOTE]
> This is a one-time operation that needs to be performed on each subscription.

Check if the HybridConnitivity resource provider (RP) has been registered:

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

### Enable functionality on your Arc-enabled server
In order to leverage the SSH connect feature, you must enable connections on the hybrid agent.

> [!NOTE]
> The following actions must be completed in an elevated terminal session.

View your current incoming connections:

```azcmagent config list```

If you have existing ports, you will need to include them in the following command.

To add access to SSH connections, run the following:

```azcmagent config set incomingconnections.ports 22<,other open ports,...>```

> [!NOTE]
> If you are using a non-default port for your SSH connection, replace port 22 with your desired port in the previous command.

Restart the hybrid agent:
- Linux: 
    - ```sudo service himds restart```
- Windows:
    - ```Stop-Service himds```
    - ```Start-Service himds```

## Examples
To view examples of using the ```az ssh vm``` command, please view the az CLI documentation page for (az ssh)[https://docs.microsoft.com/cli/azure/ssh?view=azure-cli-latest].