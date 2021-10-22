---
title: SAP Deployment Automation Powershell reference | Microsoft Docs
description: SAP Deployment Automation Powershell reference
services: virtual-machines-windows
author: kimforss
manager: kimforss
keywords: 'Azure, SAP'
ms.service: virtual-machines-sap
ms.topic: article
ms.workload: infrastructure
ms.date: 10/20/2021
ms.author: kimforss
---

# Using PowerShell in SAP Deployment Automation

You can deploy all [SAP Deployment Automation Framework](automation-deployment-framework.md) artifacts using Microsoft PowerShell.

## Control Plane operations

You can deploy or update the control plane using the [New-SAPAutomationRegion](module/automation-new-sapautomationregion.md) PowerShell command.

Remove the control plane using the [`Remove-SAPAutomationRegion` PowerShell command](module/automation-remove-sapautomationregion.md).

## Workload Zone operations

Deploy or update the workload zone using the [`New-SAPWorkloadZone` PowerShell command](module/automation-new-sapworkloadzone.md).

Remove the workload zone using the [`Remove-SAPSystem` PowerShell command](module/automation-remove-sapsystem.md).


## SAP System operations

Deploy or update the SAP system using the [`New-SAPSystem` PowerShell command](module/automation-new-sapsystem.md).

Remove the SAP system using the [`Remove-SAPSystem` PowerShell command](module/automation-remove-sapsystem.md).


## Next steps

> [!div class="nextstepaction"]
> [Deploying the control plane using PowerShell](module/automation-new-sapautomationregion.md)
> [Deploying the Workload Zone using PowerShell](module/automation-new-sapworkloadzone.md)
> [Deploying the SAP System using PowerShell](module/automation-new-sapsystem.md)
> [Bootstrapping the Deployer using PowerShell](module/automation-new-sapdeployer.md)
> [Bootstrapping the Library using PowerShell](module/automation-new-saplibrary.md)
> [Removing the control plane using PowerShell](module/automation-remove-sapautomationregion.md)
> [Removing a SAP deployment using PowerShell](module/automation-remove-sapsystem.md)
> [Set the Keyvault secrets using PowerShell](module/automation-set-sapsecrets.md)
> [Update the Terraform state file using PowerShell](module/automation-update-tfstate.md)




