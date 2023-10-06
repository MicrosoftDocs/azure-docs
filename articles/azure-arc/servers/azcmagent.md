---
title: azcmagent CLI reference
description: Reference documentation for the Azure Connected Machine agent command line tool
ms.topic: reference
ms.date: 04/20/2023
---

# azcmagent CLI reference

The Azure Connected Machine agent command line tool, azcmagent, helps you configure, manage, and troubleshoot a server's connection with Azure Arc. The azcmagent CLI is installed with the Azure Connected Machine agent and controls actions specific to the server where it's running. Once the server is connected to Azure Arc, you can use the [Azure CLI](/cli/azure/connectedmachine) or [Azure PowerShell](/powershell/module/az.connectedmachine/) module to enable extensions, manage tags, and perform other operations on the server resource.

Unless otherwise specified, the command syntax and flags represent available options in the most recent release of the Azure Connected Machine agent. For more information, see [What's new with the Azure Connected Machine agent](agent-release-notes.md).

## Commands

| Command | Purpose |
| ------- | ------- |
| [azcmagent check](azcmagent-check.md) | Run network connectivity checks for Azure Arc endpoints |
| [azcmagent config](azcmagent-config.md) | Manage agent settings |
| [azcmagent connect](azcmagent-connect.md) | Connect the server to Azure Arc |
| [azcmagent disconnect](azcmagent-disconnect.md) | Disconnect the server from Azure Arc |
| [azcmagent genkey](azcmagent-genkey.md) | Generate a public-private key pair for asynchronous onboarding |
| [azcmagent help](azcmagent-help.md) | Get help for commands |
| [azcmagent license](azcmagent-license.md) | Display the end-user license agreement |
| [azcmagent logs](azcmagent-logs.md) | Collect logs to troubleshoot agent issues |
| [azcmagent show](azcmagent-show.md) | Display the agent status |
| [azcmagent version](azcmagent-version.md) | Display the agent version |

## Frequently asked questions

### How can I install the azcmagent CLI?

The azcmagent CLI is bundled with the Azure Connected Machine agent. Review your [deployment options](deployment-options.md) for Azure Arc to learn how to install and configure the agent.

### Where is the CLI installed?

On Windows operating systems, the CLI is installed at `%PROGRAMFILES%\AzureConnectedMachineAgent\azcmagent.exe`. This path is automatically added to the system PATH variable during the installation process. You may need to close and reopen your console to refresh the PATH variable and be able to run `azcmagent` without specifying the full path.

On Linux operating systems, the CLI is installed at `/opt/azcmagent/bin/azcmagent`

### What's the difference between the azcmagent CLI and the Azure CLI for Azure Arc-enabled servers?

The azcmagent CLI is used to configure the local agent. It's responsible for connecting the agent to Azure, disconnecting it, and configuring local settings like proxy URLs and security features.

The Azure CLI and other management experiences are used to interact with the Azure Arc resource in Azure once the agent is connected. These tools help you manage extensions, move the resource to another subscription or resource group, and change certain settings of the Arc server remotely.
