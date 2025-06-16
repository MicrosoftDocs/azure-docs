---
title: New feature updates in Azure Site Recovery
description: Provides a summary of new features updates in the Azure Site Recovery service.
ms.topic: concept-article
ms.author: jsuri
ms.service: azure-site-recovery
author: jyothisuri
ms.date: 05/11/2025
---

# Site Recovery feature updates

The Azure Site Recovery service is updated and improved on an ongoing basis. To help you stay up-to-date, this article provides you with information about the latest feature releases. This page is updated regularly.

You can follow and subscribe to Site Recovery update notifications in the [Azure updates channel](https://azure.microsoft.com/updates/?product=site-recovery).

## Updates (April 2025)

### Azure Site Recovery for Shared Disks

Azure Site Recovery for Shared Disk feature enables you to protect, monitor, recover, and re-protect your workloads running on [Windows Server Failover Clusters (WSFC)](/sql/sql-server/failover-clusters/windows/windows-server-failover-clustering-wsfc-with-sql-server) on Azure VMs with Shared Disk. 

You can use the benefits of Shared Disk for your mission-critical applications such as SQL FCI, SAP ASCS, Scale-out File Servers, etc., while ensuring business continuity and disaster recovery (BCDR) with Azure Site Recovery. [Learn more](tutorial-shared-disk.md). 

**Salient Features**:
- **OS Support:** Windows Server 2016 and later.  
- **Nodes:** Up to 4 nodes per cluster. 
- **Shared Disks:** Any number of shared disks can be attached to the cluster.  
- **Support:** High Churn and PowerShell support.


## Updates (March 2025)

### Azure Site Recovery support for Azure Trusted Launch VMs (Linux OS) (preview)

Azure Site Recovery support for [Azure Trusted Launch VMs](/virtual-machines/trusted-launch.md) running Linux OS is in public preview. Azure Trusted Launch VMs provide foundational compute security to Azure Generation 2 VMs by enabling Secure Boot and vTPM capabilities. This public preview is available for Azure Trusted launch VMs running Linux OS. Azure Site Recovery support for Trusted launch VM running Windows OS is already generally available.  [Learn more](concepts-trusted-vm.md).

## Updates (May 2024)

### Use Azure Monitor for Azure Site Recovery

Azure Site Recovery now surfaces default alerts via Azure Monitor for critical events such as replication health turning unhealthy, failover failures, agent expiry, and so on. You can monitor these alerts via the Azure Business Continuity Center, Azure Monitor dashboard, or your Recovery Services vault and route these alerts to various notification channels of choice (Email, ITSM, Webhook, SMS). [Learn more](site-recovery-monitor-and-troubleshoot.md)

We recommend using built-in Azure Monitor alerts over classic alerts to use the following benefits of Azure Monitor: 
- Ability to configure notifications to a wide range of notification channels supported by Azure Monitor 
- Ability to select which scenarios to get notified for 
- Ability to have a consistent alerts management experience for multiple Azure services including backup, with at-scale management capabilities 

### Azure Site Recovery support for Azure Trusted Launch virtual machines (Windows OS) (preview)

Azure Trusted Launch virtual machines provide foundational compute security to Azure Generation 2 virtual machines by enabling Secure Boot and vTPM capabilities. This public preview is for Windows OS only. [Learn more](concepts-trusted-vm.md). 


## Updates (February 2024)

### Enable replication for added VMware virtual machine data disks

Azure Site Recovery now supports enabling replication for data disks that you add to a VMware virtual machine that's already enabled for disaster recovery. Support is available for VMware virtual machines protected using the modernized architecture. [Learn more](vmware-azure-enable-replication-added-disk.md). 


## Updates (January 2024)

### Support for Azure virtual machines using Premium SSD v2 in Azure Site Recovery 

Enabling disaster recovery on Premium SSD v2 is currently available in select regions and we plan to keep adding support in more regions over the coming weeks. If you are interested in participating in the preview, you can [request access](https://forms.office.com/pages/responsepage.aspx?id=v4j5cvGGr0GRqy180BHbRxOsc7Qc-ylHvn9ZP9cSTHFUNlRUT0FSUkFHWTdFRDYzWEo4T05XWERKMC4u) to get started. 


## Updates (November 2023)

### Use Azure Business Continuity center (preview)

You can now also manage Azure Site Recovery protections using Azure Business Continuity (ABC) center. ABC enables you to manage your protection estate across solutions and environments. It provides a unified experience with consistent views, seamless navigation, and supporting information to provide a holistic view of your business continuity estate for better discoverability with the ability to do core activities. [Learn more about the supported scenarios](../business-continuity-center/business-continuity-center-support-matrix.md).

## Updates (August 2023)

### Azure Site Recovery Higher Churn Support

Azure Site Recovery has increased its data churn limit by approximately 2.5x to 50 MB/s per disk. With this you can configure disaster recovery (DR) for Azure virtual machines having data churn up to 100 MB/s. This helps you to enable DR for more IO intensive workloads. 

This is an opt-in support. To opt for the higher churn limit is easy – you need to select the option High Churn when enabling the replication. By default, Normal Churn option is selected. If you want to use the higher churn limit for Azure virtual machines already protected using Azure Site Recovery, you need to disable replication and re-enable replication with the High Churn option selected. Note that this feature is only available for Azure-to-Azure scenarios. [Learn more](concepts-azure-to-azure-high-churn-support.md).  

## Updates (April 2023)

### Large disk support for disaster recovery of Hyper-V virtual machines using Site Recovery

You can now enable disaster recovery for Hyper-V virtual machines with data disks up to 32 TB in size. This applies to Hyper-V virtual machines that replicate to a managed disk in any Azure region using Site Recovery. The feature is deployed in all Azure public and government clouds. With this improvement, customers can protect:

- Their machines to managed disks and failback from managed disks. Previously, only failover to managed disk was supported, whereas replication would happen to unmanaged disks only.
- Large OS disks (up to 4 TB in size, whereas only 2 TB sized OS disks for Generation 1 virtual machines and 300 GB sized OS disks for Generation 2 virtual machines were supported).

[Learn more](hyper-v-azure-tutorial.md) 

## Updates (March 2023)

### Classic experience to protect VMware machines using Azure Site Recovery will be retired on 30 March 2026

In October 2022, we launched modernized experience to protect VMware virtual machines and physical servers. Since then, we've been enhancing our capabilities. We will begin deprecating Azure Site Recovery's classic experience to protect VMware virtual machines and physical servers on March 15, 2023 because modernized experience now has full capabilities of classic experience and other advancements. This functionality will be retired on March 30, 2026.

To avoid service interruption and minimize your security risk, transition to the modernized experience before 30 March 2026.

## Updates (January 2023)

### At-scale monitoring for Azure Site Recovery with Backup center

With this update, you can get at scale monitoring for your replicated items, jobs, and manage them across subscriptions, resource groups, and locations from a single view in Backup center. This is powerful tool for all customers to easily monitor Site Recovery at scale. 

Azure Site Recovery users can now use Azure Backup center for at-scale monitoring and management capabilities across subscriptions, resource groups, and regions like:
- View entire replicated items inventory on a day-to-day basis from a single view across the vaults,
- Single pane of glass to monitor all your replication jobs.

Backup center supports Azure virtual machine, VMware, and Physical machine scenarios for Azure Site Recovery. [Learn more](../backup/backup-center-overview.md) 


## Next steps

Keep up-to-date with our updates on the [Azure Updates](https://azure.microsoft.com/updates/?product=site-recovery) page.