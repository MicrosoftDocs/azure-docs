---
title: Remediate non-compliant Azure Automation State Configuration servers
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
# Remediate non-compliant DSC servers

When servers are registered with Azure Automation State Configuration,
the 'Configuration Mode' is set to ApplyOnly, ApplyandMonitor, or ApplyAndAutoCorrect.
If the mode isn't set to AutoCorrect,
servers that drift from a compliant state for any reason
will remain non-compliant until they're manually corrected.

Azure compute offers a feature named Run Command
that allows customers to run scripts inside virtual machines.
This document provides example scripts for this feature
when manually correcting configuration drift.

## Correct drift of Windows virtual machines using PowerShell

For step by step instructions using
the Run Command feature on Windows virtual machines, see the documentation page
[Run PowerShell scripts in your Windows VM with Run Command](/azure/virtual-machines/windows/run-command).

To force an Azure Automation State Configuration node
to download the latest configuration and apply it,
use the `Update-DscConfiguration` cmdlet.
For details, see the
cmdlet documentation [Update-DscConfiguration](/powershell/module/psdesiredstateconfiguration/update-dscconfiguration).

```powershell
Update-DscConfiguration -Wait -Verbose
```

## Correct drift of Linux virtual machines

Similar functionality isn't currently available for Linux servers.
The only option is to repeat the registration process.
For Azure nodes,
drift-correction can be done from the portal
or using Az Automation cmdlets.
Details about this process are documented in the page
[Onboarding machines for management by Azure Automation State Configuration](/azure/automation/automation-dsc-onboarding#azure-portal).
For hybrid nodes,
drift-correction can be done using the included Python scripts.
See the documentation in
[PowerShell DSC for Linux repo](https://github.com/Microsoft/PowerShell-DSC-for-Linux#performing-dsc-operations-from-the-linux-computer).

## Next steps

- For PowerShell cmdlet reference, see [Azure Automation State Configuration cmdlets](/powershell/module/azurerm.automation/#automation)
- To see an example of using Azure Automation State Configuration in a continuous deployment pipeline, see [Continuous Deployment Using Azure Automation State Configuration and Chocolatey](automation-dsc-cd-chocolatey.md)
