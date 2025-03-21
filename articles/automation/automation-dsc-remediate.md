---
title: Remediate noncompliant Azure Automation State Configuration servers
description: This article tells how to reapply configurations on demand to servers that are no longer compliant.
services: automation
ms.service: azure-automation
ms.subservice: desired-state-config
ms.custom: linux-related-content
ms.topic: conceptual
ms.date: 10/22/2024
---

# Remediate noncompliant Azure Automation State Configuration servers

[!INCLUDE [azure-automation-dsc-end-of-life](~/includes/dsc-automation/azure-automation-dsc-end-of-life.md)]

[!INCLUDE [automation-dsc-linux-retirement-announcement](./includes/automation-dsc-linux-retirement-announcement.md)]

When servers are registered with Azure Automation State Configuration, the configuration mode is set
to `ApplyOnly`, `ApplyAndMonitor`, or `ApplyAndAutoCorrect`. If the mode isn't set to
`ApplyAndAutoCorrect`, servers that drift from a compliant state for any reason remain noncompliant
until they're manually corrected.

Azure compute offers a feature named **Run Command** that allows customers to run scripts inside
virtual machines. This document provides example scripts for this feature when manually correcting
configuration drift.

## Correct drift of Windows virtual machines using PowerShell

You can correct drift of Windows virtual machines using the **Run** command feature. See
[Run PowerShell scripts in your Windows VM with Run command][01].

To force an Azure Automation State Configuration node to download the latest configuration and apply
it, use the [Update-DscConfiguration][03] cmdlet.

```powershell
Update-DscConfiguration -Wait -Verbose
```

## Correct drift of Linux virtual machines

For Linux virtual machines, you don't have the option of using the **Run** command. You can only
correct drift for these machines by repeating the registration process.

For Azure nodes, you can correct drift from the Azure portal or using Az module cmdlets. Details
about this process are documented in [Enable a VM using Azure portal][05].

For hybrid nodes, you can correct drift using the Python scripts. See
[Performing DSC operations from the Linux computer][06].

## Next steps

- For a PowerShell cmdlet reference, see [Az.Automation][02].
- To see an example of using Azure Automation State Configuration in a continuous deployment
  pipeline, see [Setup continuous deployment with Chocolatey][04].

<!-- link references -->
[01]: /azure/virtual-machines/windows/run-command
[02]: /powershell/module/az.automation/#automation
[03]: /powershell/module/psdesiredstateconfiguration/update-dscconfiguration
[04]: automation-dsc-cd-chocolatey.md
[05]: automation-dsc-onboarding.md#enable-a-vm-using-azure-portal
[06]: https://github.com/Microsoft/PowerShell-DSC-for-Linux#performing-dsc-operations-from-the-linux-computer
