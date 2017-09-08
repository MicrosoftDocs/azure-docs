---
title: Before you start replication of Azure VMs to another region | Microsoft Docs'
description: Summarizes the steps you need to take before replicating Azure VMs between Azure regions, using the Azure Site Recovery service
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: carmon
editor: ''

ms.assetid: dab98aa5-9c41-4475-b7dc-2e07ab1cfd18
ms.service: site-recovery
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/01/2017
ms.author: raynew

---

# Step 2: Before you start

After you've reviewed the [architecture](azure-to-azure-walkthrough-architecture.md) for replicating Azure virtual machines (VMs) between Azure regions with [Azure Site Recovery](site-recovery-overview.md), use this article to verify prerequisites.

- When you finish the article, you should have a clear understanding of what's needed to make the deployment work, and have completed the prerequisite steps.
- Post any comments at the bottom of this article, or ask questions in the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).

>[!NOTE]
>
> Azure VM replication is currently in preview.



## Support recommendations

Review the table below. Get a full list of support requirements in the [support matrix.](site-recovery-support-matrix-azure-to-azure.md)

**Component** | **Requirement**
--- | ---
**Recovery Services vault** | We recommend that you create a Recovery Services vault in the target Azure region that you want to use for disaster recovery. For example, if you want to replicate source VMs in East US to Central US, create the vault in Central US.
**Azure subscription** | Your Azure subscription should be enabled to create VMs, in the target location that you want to use as the disaster recovery region. Contact support to enable the required quota.
**Target region capacity** | In the target Azure region, the subscription should have enough capacity for VMs, storage accounts, and network components.
**Storage** | Use the [storage guidance](../storage/common/storage-scalability-targets.md#scalability-targets-for-virtual-machine-disks) for your source Azure VMs, to avoid performance issues.<br/><br/> Storage accounts must be in the same region as the vault.<br/><br/> You can't replicate to premium accounts in Central and South India.<br/><br/> If you deploy replication with the default settings, Site Recovery creates the required storage accounts based on the source configuration. If you customize settings, follow the [scalability targets for VM disks](../storage/common/storage-scalability-targets.md#scalability-targets-for-virtual-machine-disks).
**Networking** | You need to allow outbound connectivity from Azure VMs, for specific URLs/IP ranges.<br/><br/> Network accounts must be in the same region as the vault.
**Azure VM** | Make sure all of the latest root certificates are on the Windows/Linux Azure VM. If they're not, you won't be able to register the VM in Site Recovery, because of security constraints.
**Azure user account** | Your Azure user account needs to have certain [permissions](site-recovery-role-based-linked-access-control.md#permissions-required-to-enable-replication-for-new-virtual-machines) to enable replication of an Azure virtual machine.


## Set permissions on the account

1. Read about the [permissions](site-recovery-role-based-linked-access-control.md) you need for replication.
2. Follow these [instructions](../active-directory/role-based-access-control-configure.md#add-access) to add permissions.


## Verify target resources

1. Enable your Azure subscription to allow you to create VMs in the target region you want to use for disaster recovery that you want to use as the disaster recovery region. Contact support to enable the required quota.
2. Make sure your subscription has enough resources to enable VMs with sizes that match your source VMs. By default, when set up replication, Site Recovery picks the same size for the target VM, or the closest possible size. Learn more about [troubleshooting](site-recovery-azure-to-azure-troubleshoot-errors.md#azure-resource-quota-issues-error-code-150097) target resources.

## Verify Azure VM certificates

1. Check that all the latest root certificates are present on the Windows or Linux VMs you want to replicate. If the latest root certificates are not present, the VM cannot be registered to Site Recovery due to security constraints.
2. For Windows VMs, do the following:

    - Install all the latest Windows updates on the VM so that all the trusted root certificates are on the machine.
    - In a disconnected environment, follow the standard Windows Update process/certificate update process in your organization, to get the latest root certificates, and updated CRL, on the VMs.
3. For Linux VMs, follow the guidance provided by your Linux distributor to get the latest trusted root certificates and the latest certificate revocation list on the VM. Learn more about [troubleshooting](site-recovery-azure-to-azure-troubleshoot-errors.md#trusted-root-certificates-error-code-151066) trusted root issues.


## Next steps

Go to [Step 3: Plan networking](azure-to-azure-walkthrough-network.md) to set up outbound connectivity.
