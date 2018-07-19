---
title: Understand the agent check results in Update Management
description: Learn how to troubleshoot issues with the Update Management agent.
services: automation
author: georgewallace
ms.author: gwallace
ms.date: 07/13/2018
ms.topic: conceptual
ms.service: automation
ms.component: update-management
manager: carmonm
---

# Understandthe agent check results in Update Management

In Update Management you can check the health of an agent. By clicking the **Troubleshoot** link under the **Update Agent Readiness** column in the portal, you launch the **Update agent checks** page. This page shows you problems with the agent and a link to this article in order to assist you in troubleshooting your issues.

![Update agent checks page](./media/update-agent-issues/update-agent-checks.png)

## Pre-requisite checks

### OS Check

The OS check, checks to ensure that the Hybrid Worker is running one of the following Operating Systems:

|Operating system  |Notes  |
|---------|---------|
|Windows Server 2008, Windows Server 2008 R2 RTM    | Supports only update assessments.         |
|Windows Server 2008 R2 SP1 and later     |.NET Framework 4.5 or later is required. ([Download .NET Framework](/dotnet/framework/install/guide-for-developers))<br/> Windows PowerShell 4.0 or later is required. ([Download WMF 4.0](https://www.microsoft.com/download/details.aspx?id=40855))<br/> Windows PowerShell 5.1 is recommended for increased reliability.  ([Download WMF 5.1](https://www.microsoft.com/download/details.aspx?id=54616))        |
|CentOS 6 (x86/x64) and 7 (x64)      | Linux agents must have access to an update repository. Classification-based patching requires 'yum' to return security data which CentOS does not have out of the box.         |
|Red Hat Enterprise 6 (x86/x64) and 7 (x64)     | Linux agents must have access to an update repository.        |
|SUSE Linux Enterprise Server 11 (x86/x64) and 12 (x64)     | Linux agents must have access to an update repository.        |
|Ubuntu 14.04 LTS and 16.04 LTS (x86/x64)      |Linux agents must have access to an update repository.         |

### WMF Check

The WMF check, ensures that the system have the required version of the Windows Management. [Windows Management Framework 4.0](https://www.microsoft.com/download/details.aspx?id=40855) is the lowest version supported. It is recommended that you install [Windows Management Framework 5.1](https://www.microsoft.com/download/details.aspx?id=54616) for increased reliability of the Hybrid Runbook Worker.

### TLS 1.2 Support

This check, determines if you are using TLS 1.2 to encrypt your communications. TLS 1.0 is no longer supported by the platform and it is recommended that clients use TLS 1.2 to communicate with Update Management.

## Connectivity Checks

### Insert check name here

## VM Service Health Checks

### Health Service Check

### Event 4502 Check

## Access Permissions Checks

### Crypto Folder Access

