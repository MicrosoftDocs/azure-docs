---
title: Azure Update Manager FAQ
description: This article gives answers to frequently asked questions about Azure Update Manager.
ms.service: azure-update-manager
ms.custom:
  - ignite-2024
ms.topic: faq
ms.date: 04/16/2025
author: habibaum
ms.author: v-uhabiba
# Customer intent: As an IT administrator who manages updates across various environments, I want to find answers to frequently asked questions about Azure Update Manager so that I can effectively use its features for patch management and ensure compliance across my systems.
---

# Azure Update Manager frequently asked questions

This article answers commonly asked questions about Azure Update Manager. If you have any other questions about the service's capabilities, go to the [discussion forum](https://feedback.azure.com/d365community/forum/721a322e-bd25-ec11-b6e6-000d3a4f0f1c) and post them. When a question is frequently asked, we add it to this article so that customers can find the answer quickly and easily.

## Fundamentals

### What are the benefits of using Update Manager?

Update Manager provides a software as a service (SaaS) solution to manage and govern software updates to Windows and Linux machines.

Following are the benefits of using Update Manager:

- Oversee update compliance for your entire fleet of Azure virtual machines (VMs), on-premises machines, and machines in multicloud environments (Azure Arc-enabled servers).
- View and deploy pending updates to help secure your machines [instantly](updates-maintenance-schedules.md#update-nowone-time-update).
- Manage [Extended Security Updates (ESUs)](/azure/azure-arc/servers/prepare-extended-security-updates) for your Azure Arc-enabled Windows Server 2012 and Windows Server 2012 R2 machines. Get consistent experience for deployment of ESUs and other updates.
- Define recurring time windows during which your machines receive updates and might undergo reboots by using [scheduled patching](scheduled-patching.md). Enforce machines grouped together based on standard Azure constructs (for example, subscriptions, location, resource group, and tags) to have common patch schedules by using [dynamic scoping](dynamic-scope-overview.md). Sync patch schedules for Windows machines in relation to *patch Tuesday*, the unofficial term for Microsoft's scheduled release of security fixes on the second Tuesday of each month.
- Enable incremental rollout of updates to Azure VMs in off-peak hours by using [automatic VM guest patching](/azure/virtual-machines/automatic-vm-guest-patching), and reduce reboots by enabling [hotpatching](updates-maintenance-schedules.md#hotpatching).
- [Assess](assessment-options.md#periodic-assessment) automatically the machines for pending updates every 24 hours, and flag machines that are out of compliance. Enforce enabling periodic assessments on multiple machines at scale by using [Azure Policy](periodic-assessment-at-scale.md).
- Create [custom reports](workbooks.md) for deeper understanding of the update data in the environment.
- Take advantage of granular access management to Azure resources by using Azure roles and identities, to control who can perform update operations and edit schedules.

### How does Update Manager work on machines?

Whenever you trigger any Update Manager operation on your machine, it pushes an extension on your machine. It interacts with the VM agent (for an Azure machine) or Azure Arc agent (for an Azure Arc-enabled machine) to fetch and install updates.

### Is enabling Azure Arc mandatory for patch management for machines not running on Azure?

Yes. Machines that aren't running on Azure must be enabled for Azure Arc if you want to manage them by using Update Manager.

### Is Update Manager dependent on Azure Automation and Log Analytics?

No, it's a native capability on a virtual machine.

### Where is update data stored in Update Manager?

All Update Manager data is stored in Azure Resource Graph. You can generate custom reports on the update data for deeper understanding and patterns by using Azure workbooks. [Learn more](query-logs.md).

### Are there programmatic ways to interact with Update Manager?

Yes. Update Manager supports the REST API, the Azure CLI, and Azure PowerShell for [Azure VMs](manage-vms-programmatically.md) and [Azure Arc-enabled machines](manage-arc-enabled-servers-programmatically.md).

### Do I need the Azure Monitor Agent to manage my machines by using Update Manager?

No. It's a native capability on a virtual machine and doesn't rely on the Azure Monitor Agent.

### Which operating systems does Update Manager support?

See [Supported update sources, types, Microsoft application updates, and third-party updates](support-matrix.md).

### Does Update Manager support Windows 10 and Windows 11?

Azure Automation Update Management didn't provide support for patching Windows 10 and Windows 11. The same is true for Update Manager. We recommend that you use Microsoft Intune as the solution for keeping Windows 10 and Windows 11 devices up to date.

## Pricing

### What is the pricing for Update Manager?

Update Manager is available at no extra charge for managing Azure VMs and [Azure Arc-enabled Azure Local VMs](/azure/azure-local/manage/azure-arc-vm-management-overview). The latter VMs must be created through an Azure Arc resource bridge on Azure Local. For all other Azure Arc-enabled servers, see [Azure Update Manager pricing](https://azure.microsoft.com/pricing/details/azure-update-management-center/).

### How is the Update Manager price calculated for Azure Arc-enabled servers?

For Azure Arc-enabled servers, Update Manager is charged per server on a monthly basis (assuming 31 days of connected usage). It's charged at a daily prorated value. An Azure Arc-enabled machine is charged only for the days when it's connected and managed by Update Manager. For more information, see [Azure Update Manager pricing](https://azure.microsoft.com/pricing/details/azure-update-management-center/).

### When is an Azure Arc-enabled server considered managed by Update Manager?

An Azure Arc-enabled server is considered managed by Update Manager for days on which the machine fulfills *both* of these conditions:

- The status for Azure Arc at any time during the day is **Connected**.
- An update operation (patched on demand or through a scheduled job, assessed on demand or through periodic assessment) is triggered on it, or it's associated with a schedule.

### Are there scenarios in which an Azure Arc-enabled server isn't charged for Update Manager?

An Azure Arc-enabled server managed through Update Manager isn't charged in the following scenarios:

- The machine is enabled for delivery of Extended Security Updates enabled by Azure Arc.
- Microsoft Defender for Servers Plan 2 is enabled for the subscription that hosts the Azure Arc-enabled server. However, if you're using Defender through a security connector, you're charged.
- Your Windows Server licenses have active Software Assurance or Windows Server subscription licenses, or Windows Server pay-as-you-go enabled by Azure Arc. For more information, see [Windows Server Management enabled by Azure Arc](/azure/azure-arc/servers/windows-server-management-overview).

### Will I be charged if I move from Automation Update Management to Update Manager?

You won't be charged for existing Azure Arc-enabled servers that used Automation Update Management for free as of September 1, 2023. You're charged for any new Azure Arc-enabled machines that you onboard to Update Manager in the same subscription.

### I'm a Defender for Servers customer and use update recommendations from Update Manager. Will I be charged for Update Manager?

If you purchased Defender for Servers Plan 2, you don't have to pay to remediate unhealthy resources for these recommendations: **Periodic assessment should be enabled on your machines** and **System updates should be installed on your machines**.

If you're using any other Defender for Servers plan for your Azure Arc-enabled machines, you're charged for those machines at the daily prorated rate per server by Update Manager.

### Is Update Manager chargeable on Azure Local?

Update Manager isn't charged for:

- Management of Azure Local instances via Azure Local and [Update Manager on Azure Local](/azure/azure-local/update/azure-update-manager-23h2).
- [Azure Arc-enabled Azure Local VMs](/azure/azure-local/manage/azure-arc-vm-management-overview) created via an Azure Arc resource bridge. An example is the **Machine-Azure Arc (Azure Local)** resource.

All other resources, including (but not limited to) the following resources, are charged:

- Management of individual Azure Local machines. Examples include **Machine - Azure Arc** and **Update Manager - Machines** resources.
- All VMs on Azure Local that you don't create by using an Azure Arc resource bridge. Examples include VMs projected as Azure Arc-enabled servers and VMs on Azure Local managed by Azure Arc-enabled System Center Virtual Machine Manager.

### Is there any additional cost associated with Update Manager for data transfers?

There's no extra cost for data transfers when you use Update Manager for patch management operations.

## Support and integration

### Does Update Manager support integration with Azure Lighthouse?

Update Manager doesn't currently support Azure Lighthouse integration.

### Does Update Manager support Azure Policy?

Yes, Update Manager supports update features via policies. For more information, see [Automate assessment at scale by using Azure Policy](periodic-assessment-at-scale.md) and [Onboard to schedule by using Azure Policy](scheduled-patching.md#onboard-to-schedule-by-using-azure-policy).

### I have machines across multiple subscriptions in Automation Update Management. Is this scenario supported in Update Manager?

Yes, Update Manager supports multiple-subscription scenarios.

### Is guidance available for moving VMs and schedules from System Center Configuration Manager to Update Manager?

To move update configurations from System Center Configuration Manager to Update Manager, you can follow [this guide](guidance-migration-azure.md).

## Miscellaneous

### Can I configure my machines to fetch updates from WSUS (Windows) and private repositories (Linux)?

By default, Update Manager relies on a Windows Update client running on your machine to fetch updates. You can configure a Windows Update client to fetch updates from Microsoft Update or a Windows Server Update Services (WSUS) repository, and then manage patch schedules by using Update Manager.

For Linux, you can fetch updates by pointing your machine to a public repository or clone a private repository that regularly pulls updates from upstream.

Update Manager honors machine settings and installs updates accordingly.

### Does Update Manager store customer data?

Update Manager doesn't move or store customer data out of the region where it's deployed.

## Related content

- [What is Azure Update Manager?](overview.md)
- [What's new in Azure Update Manager](whats-new.md)
