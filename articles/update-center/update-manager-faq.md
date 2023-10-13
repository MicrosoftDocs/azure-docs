---
title: Azure Update Manager FAQ
description: This article gives answers to frequently asked questions about Azure Update Manager
ms.service: azure-update-manager
ms.topic: conceptual
ms.date: 09/25/2023
author: snehasudhirG
ms.author: sudhirsneha
#Customer intent: As an implementer, I want answers to various questions.
---

# Azure Update Manager frequently asked questions

This  FAQ is a list of commonly asked questions about Azure Update Manager. If you have any other questions about its capabilities, go to the discussion forum and post your questions. When a question is frequently asked, we add it to this article so that it's found quickly and easily.

## Fundamentals

### What are the benefits of using Azure Update Manager?

Azure Update Manager provides a SaaS solution to manage and govern software updates to Windows and Linux machines across Azure, on-premises, and multi-cloud environments.
Following are the benefits of using Azure Update Manager:
- Oversee update compliance for your entire fleet of machines in Azure (Azure VMs), on premises, and multi-cloud environments (Arc-enabled Servers).
- View and deploy pending updates to secure your machines [instantly](updates-maintenance-schedules.md#update-nowone-time-update).
- Manage [extended security updates (ESUs)](https://learn.microsoft.com/azure/azure-arc/servers/prepare-extended-security-updates) for your Azure Arc-enabled Windows Server 2012/2012 R2 machines. Get consistent experience for deployment of ESUs and other updates.
- Define recurring time windows during which your machines receive updates and might undergo reboots using [scheduled patching](scheduled-patching.md). Enforce machines grouped together based on standard Azure constructs (Subscriptions, Location, Resource Group, Tags etc.) to have common patch schedules using [dynamic scoping](dynamic-scope-overview.md). Sync patch schedules for Windows machines in relation to patch Tuesday, the unofficial term for month.
- Enable incremental rollout of updates to Azure VMs in off-peak hours using [automatic VM guest patching](../virtual-machines/automatic-vm-guest-patching.md) and reduce reboots by enabling [hot patching](updates-maintenance-schedules.md#hotpatching).
- Automatically [assess](assessment-options.md#periodic-assessment) machines for pending updates every 24 hours, and flag machines that are out of compliance. Enforce enabling periodic assessments on multiple machines at scale using [Azure Policy](periodic-assessment-at-scale.md).
- Create [custom reports](workbooks.md) for deeper understanding of the updates data of the environment.
- Granular access management to Azure resources with Azure roles and identity, to control who can perform update operations and edit schedules.

### How does the new Azure Update Manager work on machines?

Whenever you trigger any Azure Update Manager operation on your machine, it pushes an extension on your machine that interacts with the VM agent (for Azure machine) or Arc agent (for Arc-enabled machines) to fetch and install updates. 

### Is enabling Azure Arc mandatory for patch management for machines not running on Azure? 

Yes, machines that aren't running on Azure must be enabled for Arc, for management using Update Manager.

### Is the new Azure Update Manager dependent on Azure Automation and Log Analytics? 

No, it's a native capability on a virtual machine.

### Where is updates data stored in Azure Update Manager? 

All Azure Update Manager data is stored in Azure Resource Graph (ARG). Custom reports can be generated on the updates data for deeper understanding and patterns using Azure Workbooks [Learn more](query-logs.md)

### Are there programmatic ways to interact with Azure Update Manager? 

Yes, Azure Update Manager supports REST API, CLI and PowerShell for [Azure machines](manage-vms-programmatically.md) and [Arc-enabled machines](manage-arc-enabled-servers-programmatically.md).

### Do I need MMA or AMA for using Azure Update Manager to manage my machines? 

No, it's a native capability on a virtual machine and doesn't rely either on MMA or AMA.

### Which operating systems are supported by Azure Update Manager? 

For more information, see [Azure Update Manager OS support](support-matrix.md).

### Does Update Manager support Windows 10, 11? 

Automation Update Management didn't provide support for patching Windows 10 and 11. The same is true for Azure Update Manager. We recommend that you use Microsoft Intune as the solution for keeping Windows 10 and 11 devices up to date. 


## Impact of Log Analytics Agent retirement

### How do I move from Automation Update Management to Azure Update Manager?

Follow the [guidance](guidance-migration-automation-update-management-azure-update-manager.md) to move from Automation Update Management to Azure Update Manager.


### LA agent (also known as MMA) is retiring and will be replaced with AMA. Is it necessary to move to Update Manager or can I continue to use Automation Update Management with AMA?

The Azure Log Analytics agent, also known as the Microsoft Monitoring Agent (MMA) will be [retired in August 2024](https://azure.microsoft.com/updates/were-retiring-the-log-analytics-agent-in-azure-monitor-on-31-august-2024/). Azure Automation Update management solution relies on this agent and might encounter issues once the agent is retired. It doesn't work with Azure Monitoring Agent (AMA) either.

Therefore, if you're using Azure Automation Update management solution, you're encouraged to move to Azure Update Manager for their software update needs. All capabilities of Azure Automation Update Management Solution will be available on Azure Update Manager before the retirement date. Follow the [guidance](guidance-migration-automation-update-management-azure-update-manager.md) to move update management for your machines to Azure Update Manager.
 

### If I move to AMA while I'm still using Automation Update Management, will my solution break? 

Yes. Automation Update Management isn't compatible with AMA. We recommend that you move the machine to Azure Update Manager before removing MMA from the machine. Update Manager doesn't rely either on MMA or AMA. 


### Will I lose my Automation Update Management update related data if I move to Azure Update Manager? 

Automation Update Management uses Log Analytics workspace for storing updates data. Azure Update Manager uses Azure Resource Graph for data storage. You can continue using the historical data in Log Analytics workspace for old data and use Azure Resource Graph for new data. 

### I have some reports/dashboards built for Automation Update Management. How do I move those? 

You can rebuild custom dashboards/reports on updates data from Azure Resource Graph (ARG). For more information, see [how to query ARG data](query-logs.md) and [sample queries](sample-query-logs.md). These are a few built-in workbooks that you can modify as per your needs to get started. For more information, see [how to create reports using workbooks](manage-workbooks.md).

### I have been using saved searches in Automation Update Management for schedules. How do I migrate to Azure Update Manager? 

Arc-enabling of machines is a prerequisite for management with Update Manager. To move the saved searches. You can Arc-enable them and then use dynamic scoping feature to define the same scope of machines. [Learn more](manage-dynamic-scoping.md).


### If I have been using pre and post-script or alerting capability in Automation Update management, how can I move to Azure Update Manager? 

These capabilities will be added to Azure Update Manager. For more information, see [guidance for moving from Automation Update management to Azure Update Manager](guidance-migration-automation-update-management-azure-update-manager.md).

### I'm using Automation Update Management on sovereign clouds; will I get region support in the new Azure Update Manager? 

Yes, Automation Update Manager will be rolled out to sovereign clouds soon. 

## Pricing

### What is the pricing for Azure Update Manager? 

Azure Update Manager is available at no extra charge for managing Azure VMs and Arc-enabled Azure Stack HCI VMs (for which Azure Benefits are enabled). For Arc-enabled Servers, the price is $5 per server per month (assuming 31 days of usage).  

### How is Azure Update Manager price calculated for Arc-enabled servers? 

For Arc-enabled servers, Azure Update Manager is charged $5/server/month (assuming 31 days of connected usage). It's charged at a daily prorated value of 0.16/server/day. An Arc-enabled machine would only be charged for the days when it's connected and managed by Azure Update Manager.

### When is an Arc-enabled server considered managed by Azure Update Manager?

An Arc-enabled server is considered managed by Azure Update Manager for days on which the machine fulfills the following conditions: 
 - *Connected* status for Arc at any time during the day. 
 - An update operation (patched on demand or through a scheduled job, assessed on demand or through periodic assessment) is triggered on it, or it's associated with a schedule.
 
### Are there scenarios in which Arc-enabled Server isn't charged for Azure Update Manager? 

An Arc-enabled server managed with Azure Update Manager is not charged in following scenarios:
 - If the machine is enabled for delivery of Extended Security Updates (ESUs) enabled by Azure Arc.
 - Microsoft Defender for Servers Plan 2 is enabled for the subscription hosting the Arc-enabled server.

### Will I be charged if I move from Automation Update Management to Update Manager? 

Customers using Automation Update Management moving to Azure Update Manager won't be charged till retirement of LA agent.

### I'm a Defender for Server customer and use update recommendations powered by Azure Update Manager namely "periodic assessment should be enabled on your machines" and "system updates should be installed on your machines". Would I be charged for Azure Update Manager? 

If you have purchased a Defender for Servers Plan 2, then you won't have to pay to remediate the unhealthy resources for the above two recommendations. But if you're using any other Defender for server plan for your Arc machines, then you would be charged for those machines at the daily prorated $0.16/server by Azure Update Manager.

### Is Azure Update Manager chargeable on Azure Stack HCI?
Azure Update Manager is not charged for machines hosted Azure Stack HCI clusters that have been enabled for Azure benefits and Azure Arc VM management. [Learn more](https://learn.microsoft.com/azure-stack/hci/manage/azure-benefits?tabs=wac#azure-benefits-available-on-azure-stack-hci).
 

## Update Manager support and integration

### Does Azure Update Manager support integration with Azure Lighthouse? 

Azure Update Manager doesn't currently support Azure Lighthouse integration. 

### Does Azure Update Manager support Azure Policy? 

Yes, Azure Update Manager supports update features via policies. For more information, see [how to enable periodic assessment at scale using policy](periodic-assessment-at-scale.md) and [how to enable schedules on your machines at scale using Azure Policy](scheduled-patching.md#onboard-to-schedule-by-using-azure-policy).

### I have machines across multiple subscriptions in Automation Update Management. Is this scenario supported in Azure Update Manager?

Yes, Azure Update Manager supports multi-subscription scenarios. 

### Is there guidance available to move VMs and schedules from SCCM to Azure Update Manager? 

Customers can follow this [guide](guidance-migration-azure.md) to move update configurations from SCCM to Azure Update Manager. 

## Miscellaneous

### Can I configure my machines to fetch updates from WSUS (Windows) and private repository (Linux)? 

By default, Azure Update Manager relies on Windows Update (WU) client running on your machine to fetch updates. You can configure WU client to fetch updates from Microsoft Update/WSUS repository and manage patch schedules using Azure Update Manager.  

Similarly for Linux, you can fetch updates by pointing your machine to a public repository or clone a private repository that regularly pulls updates from the upstream.  

Azure Update Manager honors machine settings and installs updates accordingly. 

### Does Azure Update Manager store customer data? 

No, Azure Update Manager doesn't store any customer identifiable data outside of the Azure Resource Graph for the subscription. 

## Next steps

- [An overview of Azure Update Manager](overview.md)
- [What's new in Azure Update Manager](whats-new.md)