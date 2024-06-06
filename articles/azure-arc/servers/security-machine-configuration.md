---
title: Machine configuration
description: Machine configuration for Azure Arc-enabled servers.
ms.topic: conceptual
ms.date: 06/06/2024
---

# Machine configuration

This article describes the basics of Azure Machine Configuration, a compliance reporting and configuration tool based on PowerShell Desired State Configuration. It explains how the tool can check and optionally remediate security and other settings on machines at scale. Users can utilize built-in policies from Microsoft or author their own. The article also details the permissions needed to assign these policies and provides instructions for disabling the machine configuration agent if not needed. 

## Machine configuration basics

Azure Machine Configuration is a PowerShell Desired State Configuration-based compliance reporting and configuration tool. It can help you check security and other settings on your machines at-scale and optionally remediate them if they drift from the approved state. Microsoft provides its own built-in Machine Configuration policies for your use, or you can author your own policies to check any condition on your machine.

Machine Configuration policies run in the Local System context on Windows or root on Linux, and therefore can access any system settings or resources. You should review which accounts in your organization have permission to assign Azure Policies or Azure Guest Assignments (the Azure resource representing a machine configuration) and ensure all those accounts are trusted.

### Disabling the machine configuration agent

If you don’t intend to use machine configuration policies, you can disable the machine configuration agent with the following command (run locally on each machine):

`azcmagent config set guestconfiguration.enabled false`

## Agent modes

The Azure Connected Machine agent has two possible modes:

1. Full mode, the default mode which allows all use of agent functionality.

1. Monitor mode, which applies a Microsoft-managed extension allowlist, disables remote connectivity, and disables the machine configuration agent.

If you’re using Arc solely for monitoring purposes, setting the agent to Monitor mode makes it easy to restrict the agent to just the functionality required to use Azure Monitor. You can configure the agent mode with the following command (run locally on each machine):

`azcmagent config set config.mode monitor`

