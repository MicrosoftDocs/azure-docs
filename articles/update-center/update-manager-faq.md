---
title: Azure Update Manager FAQ
description: This article gives answers to frequently asked questions about Azure Update Manager
ms.service: azure-update-manager
ms.topic: conceptual
ms.date: 09/14/2023
author: snehasudhirG
ms.author: sudhirsneha
#Customer intent: As an implementer, I want answers to various questions.
---

# Azure Update Manager frequently asked questions

This  FAQ is a list of commonly asked questions about Azure Update Manager. If you have any other questions about its capabilities, go to the discussion forum and post your questions. When a question is frequently asked, we add it to this article so that it's found quickly and easily.

## What are the benefits of using Azure Update Manager over Automation Update Management?

Azure Update Manager offers several benefits over the Automation Update Management solution. [Learn more](overview.md#key-benefits).
Following are few benefits:
- Native experience with zero onboarding, no dependency on other services like Automation and Log Analytics.
- On-demand operations to enable you to take immediate actions like Patch Now and Assess Now.
- Enhanced flexibility with options like [Automatic VM guest patching](../virtual-machines/automatic-vm-guest-patching.md) in Azure, [hotpatching](/windows-server/get-started/hotpatch) or custom maintenance schedules.
- Granular access control at a VM level.
- Support for Azure Policy. 


## LA agent (also known as MMA) is retiring and will be replaced with AMA, can customers continue to use Automation Update Management with AMA?

Azure Update Manager doesn't rely on MMA or AMA. Customers need to move from Automation Update Management to Azure Update Manager as LA agent is retiring. However, note that customers shouldn't remove MMA agent from machines using Automation Update Management before migrating to Azure Update Manager or else Automation Update Management solution will not work.
 

## Will I be charged if I migrate to Azure Update Manager? 
Azure Update Manager is free of charge for Azure machines. Azure Arc-enabled machines are charged up to $5/server/month prorated at a daily level (@0.167/server/day). Example: if your Arc machines are turned off (not connected to Azure) for 20 days out 30 days of a month, then you pay only for 10 days when periodic assessment runs on your machine. So, you will pay approximately 0.167*10=$1.67/server/month for those Arc machines.

## How is Azure Update Manager price calculated for Arc-enabled machines?
Azure Update Manager is free for machines hosted on Azure or Azure Stack HCI. For Arc-enabled servers, it's chargeable up to $5/server/month. It's charged at a daily prorated value of 0.16/server/day. It means that your Arc-enabled machine would only be charged for the days when it's considered managed by Azure Update Manager.

> [!NOTE]
> A machine is considered managed by Update Management in a day if the following two conditions are met:
> 
> 1. If the machine has **Connected** status for Arc at the time of operation (patched on demand or through a scheduled job/assessed on demand or through periodic assessment) or for a specific time of the day (in case it is associated with a schedule, even if no operations are performed on the day).
> 
> 1. **A patch now or assess now operation is triggered for the machine in the day** or **the machine is assessed for pending patches through periodic assessment on the day**, or **the machine is associated with an active schedule on the day either statically or dynamically**.

Following are the cases when Arc-enabled servers wouldn't be charged by Azure Update Manager:

- As additional value added to the Arc ESUs, patch management using Azure Update Manager for machines enabled for extended support via Arc would be provided at no extra charge.
- Arc-enabled machines present in subscriptions enabled for Microsoft Defender for Servers Plan 2 would be provided at no additional charge. For all other Microsoft Defender for Cloud plans, Arc-enabled machines would be charged by Update Manager.

## If I migrate to AMA while I'm still using Automation Update Management, will my solution break?

Yes, MMA is a prerequisite for Automation Update Management to work. The ideal thing to do would be to migrate to the new Azure Update Manager and then make the move from MMA to AMA. The new Update Manager doesn't rely on MMA or AMA. 

## How does the new Azure Update Manager work on machines? 

Whenever you trigger any Azure Update Manager operation on your machine, it pushes an extension on your machine that interacts with the VM agent (for Azure machine) or Arc agent (for Arc-enabled machines) to fetch and install updates.

## Can I configure my machines to fetch updates from WSUS (Windows) and private repository (Linux)? 

By default, Azure Update Manager relies on Windows Update (WU) client running on your machine to fetch updates. You can configure WU client to fetch updates from Windows Update/Microsoft Update repository. Updates for Microsoft first party products are published on Microsoft Update repository. For more information, see how to [enable updates for Microsoft first party updates](configure-wu-agent.md#enable-updates-for-other-microsoft-products). 

Similarly for Linux, you can fetch updates by pointing your machine to a public repository or clone a private repository that regularly pulls updates from the upstream. In a nutshell, Azure Update Manager honors machine settings and installs updates accordingly.

## Where is updates data stored in Azure Update Manager? 

All Azure Update Manager data is stored in Azure Resource Graph (ARG) which is free of cost. It is unlike Automation Update Management that used to store data in Log Analytics and the customers had to pay for update data stored. 

## Are all the operating systems supported in Automation Update Management supported by Azure Update Manager?

We have tried our best to maintain the Operating Support parity. Read in detail about [Azure Update Manager OS support](support-matrix.md).

## Will I lose my Automation Update Management update related data if I migrate to Azure Update Manager?

We won't migrate updates related data to Azure Resource Graph, however you can refer to your historical data in Log Analytics workspace that you were using in Automation Update Management. 

## Is the new Azure Update Manager dependent on Azure Automation and Log Analytics? 

No, it's a native capability on a virtual machine.

## Do I need AMA for the new Azure Update Manager? 

No, it's a native capability on a virtual machine and doesn't rely on MMA or AMA. 

## If I have been using pre and post-script or alerting capability in Automation Update management, would I be provided with migration guidance? 

Yes, when these features become available in Azure Update Manager, we publish migration guidance for them as well. 

## I have some reports/dashboards built for Automation Update Management, how do I migrate those? 

You can build dashboards/reports on Azure Resource Graph (ARG) data. For more information, see [how to query ARG data](query-logs.md) and [sample queries](sample-query-logs.md). You can build workbooks on ARG data. We have a few built-in workbooks that you can modify as per your use case or create a new one. For more information on [how to create reports using workbooks](manage-workbooks.md).

## I have been using saved searches in Automation Update Management for schedules, how do I migrate to Azure Update Manager? 

You can resolve machines manually for those saved searches, Arc-enable them and then use dynamic scoping feature to define the same scope of machines. [Learn more](manage-dynamic-scoping.md)

## I'm a Defender for Server customer and use update recommendations powered by Azure Update Manager namely periodic assessment should be enabled on your machines and system updates should be installed on your machines. Would I be charged for Azure Update Manager?

If you have purchased a Defender for Servers Plan 2, then you won't have to pay to remediate the unhealthy resources for the above two recommendations. But if you're using any other Defender for server plan for your Arc machines, then you would be charged for those machines at the daily prorated $0.167/server by Azure Update Manager.

## I have been using Automation Update Management for free on Arc machines, would I have to pay to use Azure Update Manager on those machines? 

We'll provide Azure Update Manager for free for one year (starting from when Azure Update Manager goes GA) to all subscriptions that were using Automation Update Management on Arc-enabled machines for free. Post this period, machines are charged. 

## Does Azure Update Manager support integration with Azure Lighthouse? 

Azure Update Manager doesn't support Azure Lighthouse integration officially. However, you can try to check if the integration works on your dev environment.

## I have been using Automation Update Management for client operating system like Windows 10, 11. Would I be able to migrate to Azure Update Manager? 

Automation Update Management never officially supported client devices. [Learn more](../automation/update-management/operating-system-requirements.md#unsupported-operating-systems) We maintain the same stance for the new Azure Update Manager. Intune is the suggested solution from Microsoft for client devices.

## I'm using Automation Update Management on sovereign clouds; will I get region support in the new Azure Update Manager?

Yes, support is made available for sovereign clouds supported in Automation Update Management.

## Is the new Azure Update Manager compatible with SCCM?

Azure Update Manager isn't compatible with SCCM unlike Automation Update Management.

## I have machines across multiple subscriptions in Automation Update Management, is this scenario supported in Azure Update Manager?

Yes, Azure Update Manager supports multi-subscription scenarios.

## Are there programmatic ways of onboarding Azure Update Manager?

Yes, Azure Update Manager supports REST API, CLI and PowerShell for [Azure machines](manage-vms-programmatically.md) and [Arc-enabled machines](manage-arc-enabled-servers-programmatically.md).

## Is Arc-connectivity a prerequisite for using Azure Update Manager on hybrid machines?

Yes, Arc connectivity is a prerequisite for using Azure Update Manager on hybrid machines.

## Does Azure Update Manager support Azure Policy?

Yes, unlike Automation Update Management, the new Azure Update Manager supports update features via policies. For more information, see[how to enable periodic assessment at scale using policy](periodic-assessment-at-scale.md) and [how to enable schedules on your machines at scale using Policy](scheduled-patching.md#onboarding-to-schedule-using-policy)
 
 
## Next steps

- [An overview of Azure Update Manager](overview.md)
- [What's new in Azure Update Manager](whats-new.md)