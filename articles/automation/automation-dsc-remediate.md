---
title: Remediate noncompliant Azure Automation State Configuration servers
description: How to reapply configurations on demand to servers where the configuration state has drifted
services: automation
ms.service: automation
ms.subservice: dsc
author: mgreenegit
ms.author: migreene
ms.topic: conceptual
ms.date: 07/17/2019
manager: nirb
---
# Remediate noncompliant DSC servers

When servers are registered with Azure Automation State Configuration,
the configuration mode is set to `ApplyOnly`, `ApplyandMonitor`, or `ApplyAndAutoCorrect`. If the mode isn't set to `ApplyAndAutoCorrect`,
servers that drift from a compliant state for any reason
remain noncompliant until they're manually corrected.

Azure compute offers a feature named Run Command
that allows customers to run scripts inside virtual machines.
This document provides example scripts for this feature
when manually correcting configuration drift.

## Correct drift of Windows virtual machines using PowerShell

For step-by-step instructions using
the Run Command feature on Windows virtual machines, see the documentation page
[Run PowerShell scripts in your Windows VM with Run Command](/azure/virtual-machines/windows/run-command).

To force an Azure Automation State Configuration node
to download the latest configuration and apply it,
use the [Update-DscConfiguration](/powershell/module/psdesiredstateconfiguration/update-dscconfiguration) cmdlet.

```powershell
Update-DscConfiguration -Wait -Verbose
```

## Correct drift of Linux virtual machines

Similar functionality isn't currently available for Linux servers.
The only option is to repeat the registration process.
For Azure nodes, you can correct drift from the Azure portal
or using Az module cmdlets. Details about this process are documented in 
[Onboarding machines for management by Azure Automation State Configuration](automation-dsc-onboarding#onboard-a-vm-using-azure-portal).
For hybrid nodes, you can correct drift using the included Python scripts.
See [PowerShell DSC for Linux repo](https://github.com/Microsoft/PowerShell-DSC-for-Linux#performing-dsc-operations-from-the-linux-computer).

## Next steps

- For a PowerShell cmdlet reference, see [Az.Automation](https://docs.microsoft.com/powershell/module/az.automation/?view=azps-3.7.0#automation
).
- To see an example of using Azure Automation State Configuration in a continuous deployment pipeline, see [Continuous Deployment Using Azure Automation State Configuration and Chocolatey](automation-dsc-cd-chocolatey.md).