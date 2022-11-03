---
title: SAP on Azure Deployment Automation Framework PowerShell reference | Microsoft Docs
description: SAP on Azure Deployment Automation Framework PowerShell reference
services: virtual-machines-windows
author: kimforss
manager: kimforss
keywords: 'Azure, SAP'
ms.service: virtual-machines-sap
ms.topic: article
ms.workload: infrastructure
ms.date: 11/17/2021
ms.author: kimforss
---

# Using PowerShell in SAP on Azure Deployment Automation Framework

You can deploy all [SAP on Azure Deployment Automation Framework](deployment-framework.md) components using Microsoft PowerShell.

## Control Plane operations

You can deploy or update the control plane using the [New-SAPAutomationRegion](module/new-sapautomationregion.md) PowerShell command.

Remove the control plane using the [`Remove-SAPAutomationRegion`](module/remove-sapautomationregion.md) PowerShell command.

You can bootstrap the deployer in the control plane using the [New-SAPDeployer](module/new-sapdeployer.md) PowerShell command.

You can bootstrap the SAP Library in the control plane using the [New-SAPLibrary](module/new-saplibrary.md) PowerShell command.

## Workload Zone operations

Deploy or update the workload zone using the [`New-SAPWorkloadZone`](module/new-sapworkloadzone.md) PowerShell command.

Remove the workload zone using the [`Remove-SAPSystem`](module/remove-sapsystem.md)  PowerShell command.


## SAP System operations

Deploy or update the SAP system using the [`New-SAPSystem`](module/new-sapsystem.md) PowerShell command.

Remove the SAP system using the [`Remove-SAPSystem`](module/remove-sapsystem.md)  PowerShell command.


## Other operations

Set the deployment credentials using the
[`Set-SAPSecrets`](module/set-sapsecrets.md) PowerShell command.

Update the Terraform state file using the
[`Update-TFState`](module/update-tfstate.md) PowerShell command.

## Next steps

> [!div class="nextstepaction"]
> [Deploying the control plane using PowerShell](module/new-sapautomationregion.md)




