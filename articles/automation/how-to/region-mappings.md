---
title: Azure Automation and Log Analytics workspace mappings
description: This article describes the mappings allowed between an Automation Account and a Log Analytics Workspace to support solution
services: automation
ms.service: automation
ms.subservice: process-automation
author: georgewallace
ms.author: gwallace
ms.date: 05/20/2019
ms.topic: conceptual
manager: carmonm 
---
# Workspace mappings

When enabling solutions like Update Management, Change Tracking and Inventory, or the Start/Stop VMs during off-hours solution, only certain regions are supported for linking a Log Analytics workspace and an Automation Account.

## Supported mappings

The following table shows the supported mappings:

|**Log Analytics Workspace Region**|**Azure Automation Region**|
|---|---|
|**US**||
|EastUS<sup>1</sup>|EastUS2|
|WestUS2|WestUS2|
|WestCentralUS<sup>2</sup>|WestCentralUS<sup>2</sup>|
|**Canada**||
|CanadaCentral|CanadaCentral|
|**Asia Pacific**||
|AustraliaSoutheast|AustraliaSoutheast|
|SoutheastAsia|SoutheastAsia|
|CentralIndia|CentralIndia|
|JapanEast|JapanEast|
|**Europe**||
|UKSouth|UKSouth|
|WestEurope|WestEurope|
|**US Gov**||
|USGovVirginia|USGovVirginia|

<sup>1</sup> EastUS mapping for Log Analytics workspaces to Automation Accounts are not an exact region to region mapping but is the correct mapping.

<sup>2</sup> Due to capacity restraints the region is not available when creating new resources. This includes Automation Accounts and Log Analytics workspaces. However, preexisting linked resources in the region should continue to work.

## Next steps

Learn how to onboard the following solutions:

Update Management and Change Tracking and Inventory:

* From a [virtual machine](../automation-onboard-solutions-from-vm.md)
* From your [Automation account](../automation-onboard-solutions-from-automation-account.md)
* When [browsing multiple machines](../automation-onboard-solutions-from-browse.md)
* From a [runbook](../automation-onboard-solutions.md)

Start/Stop VMs during off-hours

* [Deploy Start/Stop VMs during off-hours](../automation-solution-vm-management.md)