---
title: Troubleshoot Synapse Studio connectivity
description: In this article we provide steps to troubleshoot Azure Synapse Studio connectivity problems using PowerShell.
author: whhender 
ms.service: azure-synapse-analytics
ms.subservice: troubleshooting
ms.topic: troubleshooting-general
ms.date: 11/14/2024 
ms.author: whhender 
ms.reviewer: whhender
---

# Troubleshoot Synapse Studio connectivity with PowerShell

Azure Synapse Studio depends on a set of Web API endpoints to work properly. This guide will help you identify causes of connectivity issues when:

- You're configuring your local network (such as network behind a corporate firewall) for accessing Azure Synapse Studio.
- You're experiencing connectivity issues using Azure Synapse Studio.

## Prerequisite

* PowerShell 5.0 or higher version on Windows, or
* PowerShell Core 6.0 or higher version on Windows.

## Troubleshooting steps

Open the link and save the opened script file. Don't save the address of the link, as it could change in the future.

- [Test-AzureSynapse.ps1](https://go.microsoft.com/fwlink/?linkid=2119734)

In file explorer, right-click on the downloaded script file, and select "Run with PowerShell".

![Run downloaded script file with PowerShell](media/troubleshooting-synapse-studio-powershell/run-with-powershell.png)

When prompted, enter the Azure Synapse workspace name that is currently experiencing a problem or that you want to test for connectivity, and press enter.

![Enter workspace name](media/troubleshooting-synapse-studio-powershell/enter-workspace-name.png)

The diagnostic session will be started. Wait for it to complete.

![Wait for diagnosis to complete](media/troubleshooting-synapse-studio-powershell/wait-for-diagnosis.png)

In the end, a diagnosis summary will be shown. If your PC can't connect to one or more of the endpoints, it will show some suggestions in the "Summary" section.

![Review diagnostic summary](media/troubleshooting-synapse-studio-powershell/diagnosis-summary.png)

Additionally, a diagnostic log file for this session will be generated in the same folder as the troubleshooting script. Its location is shown in "General tips" section (`D:\TestAzureSynapse_2020....log`). You can send this file to technical support if necessary.

If you're a network administrator and tuning your firewall configuration for Azure Synapse Studio, the technical details shown above the "Summary" section might help.

* All the test items (requests) marked with "Passed" mean they have passed connectivity tests, regardless of the HTTP status code.
 For the failed requests, the reason is shown in yellow, such as `NamedResolutionFailure` or `ConnectFailure`. These reasons might help you figure out whether there are misconfigurations with your network environment.

## Next steps

If the previous steps don't help to resolve your issue, [create a support ticket](../sql-data-warehouse/sql-data-warehouse-get-started-create-support-ticket.md).
