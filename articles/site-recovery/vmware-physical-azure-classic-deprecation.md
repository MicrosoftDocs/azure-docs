---
title: Classic experience (deprecated) to protect VMware and Physical machines using Azure Site Recovery
description: Details about the deprecation of the classic experience to protect VMware and physical machines to Azure and the available alternatives
ms.service: azure-site-recovery
ms.topic: overview
ms.date: 08/26/2026
ms.author: v-gajeronika

# Customer intent: "As an IT administrator managing VMware and physical machines, I want to migrate from the classic experience to the modernized experience of Azure Site Recovery, so that I can ensure ongoing disaster recovery support and avoid disruptions after the deprecation date."
---

# Classic experience (deprecated) to protect VMware and physical machines using Azure Site Recovery 

This article describes the deprecation plan, its implications, and the alternative options available to customers in the following scenario:

Classic experience to protect VMware and physical machines to Azure using Site Recovery

> [!IMPORTANT]
> Azure Site Recovery no longer supports the classic experience of protecting VMware and physical machines using Azure Site Recovery as of March 15, 2026. Switch to the [modernized experience](how-to-move-from-classic-to-modernized-vmware-disaster-recovery.md) to avoid any disruption to your environment and minimize security risks. 

## What changes apply?

- Starting March 15, 2023, you receive Azure portal notifications and email communications about the deprecation of classic replication experience of VMware and physical machines. Azure Site Recovery no longer supports this capability as of March 30, 2026.

- Starting March 15, 2023, you can only use the modernized experience to enable Azure Site Recovery for all Recovery Services vaults.

- After March 30, 2026, existing VMware and physical machines can no longer remain on the classic management experience. Changes to replication configurations on these existing VMware and physical machines require an upgrade to the modernized experience.

- Support for new features or improvements, along with mobility agent support for new Linux distros, is only available on the modernized experience.

- If you haven't migrated your machines, the replication health of your machines might be disrupted, and you can no longer view, manage, or perform any disaster recovery-related operations through the Azure Site Recovery experience in the Azure portal.

- Enabling replication for Classic Appliance from portal is blocked and PowerShell is blocked as of January 31, 2026.


## Migrate from classic experience to modernized experience

The [modernized experience](vmware-azure-architecture-modernized.md) helps ensure your Disaster Recovery strategy isn't impacted by the deprecation. 

## Remediation steps

Follow these steps to move your existing replications to the modernized experience:

1. [Check the required infrastructure for your setup](move-from-classic-to-modernized-vmware-disaster-recovery.md#how-to-define-required-infrastructure) and the [FAQs](./classic-to-modernized-common-questions.md) for all related information.
2. [Check the architecture and minimum version of all components](move-from-classic-to-modernized-vmware-disaster-recovery.md#architecture) required for this migration.
3. Check all the [resources required](move-from-classic-to-modernized-vmware-disaster-recovery.md#required-infrastructure) and deploy the [Azure Site Recovery replication appliance](deploy-vmware-azure-replication-appliance-modernized.md).  
4. [Prepare the classic Recovery Services vault](move-from-classic-to-modernized-vmware-disaster-recovery.md#prepare-classic-recovery-services-vault) used by your existing replications.
5. [Prepare the modernized Recovery Services vault](move-from-classic-to-modernized-vmware-disaster-recovery.md#prepare-modernized-recovery-services-vault) where your appliance is registered.
6. [Trigger migration for your existing replications](how-to-move-from-classic-to-modernized-vmware-disaster-recovery.md).

## Next steps

Plan for the deprecation and move to the modernized experience to take advantage of its [benefits](./classic-to-modernized-common-questions.md#why-should-i-migrate-my-machines-to-the-modernized-architecture) and stay up to date. 

If you have any questions about this deprecation, contact Microsoft Support.
