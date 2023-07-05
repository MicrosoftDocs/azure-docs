---
title: Deprecation of classic experience to protect VMware and physical machines using Azure Site Recovery | Microsoft Docs
description: Details about upcoming deprecation of classic experience to protect VMware and physical machines to Azure and alternate options
services: site-recovery
author: Sharmistha-Rai
ms.service: site-recovery
ms.topic: conceptual
ms.date: 03/14/2023
ms.author: ankitadutta

---

# Deprecation of classic experience to protect VMware and Physical machines using Azure Site Recovery 

This article describes the upcoming deprecation plan, corresponding implications, and the alternative options available to the customers in the following scenario:

Classic experience to protect VMware and physical machines to Azure using Site Recovery

> [!IMPORTANT]
> The support for the classic experience of protecting VMware and physical machines using Azure Site Recovery will be discontinued on March 15, 2026. We recommend switching to the [modernized experience](how-to-move-from-classic-to-modernized-vmware-disaster-recovery.md) at the earliest to avoid any disruption to your environment and minimize security risks. 

## What changes should you expect?

- Starting March 15, 2023, you'll receive Azure portal notifications & email communications for the upcoming deprecation of classic replication experience of VMware and physical machines. This capability will no longer be supported after March 30, 2026.

- Starting March 15, 2023, you can only use the modernized experience to enable Azure Site Recovery for all newly created Recovery Services vaults.

- Existing VMware and physical machines can remain on the classic management experience until March 30, 2026. After 30 March 2026, changes to any configurations of the replication on these existing VMware and physical machines will require upgrade to the new modernized experience. 

- Support for new features or improvements, along with mobility agent support for new Linux distros, will only be available on the modernized experience.

- If you do not migrate your machines by March 30, 2026, the replication health of your machines may be disrupted and you will no longer be able to view, manage, or perform any disaster recovery-related operations through the Azure Site Recovery experience in the Azure portal.


## Alternatives 

The [modernized experience](vmware-azure-architecture-modernized.md) is an alternative that the customer should choose to ensure that their DR strategy isn't impacted once the experience is deprecated. 

## Remediation steps

Follow these steps to move your existing replications to the modernized experience:

1. [Check the required infrastructure for your setup](move-from-classic-to-modernized-vmware-disaster-recovery.md#how-to-define-required-infrastructure) and the [FAQs](move-from-classic-to-modernized-vmware-disaster-recovery.md#faqs) for all related information.
2. [Check the architecture and minimum version of all components](move-from-classic-to-modernized-vmware-disaster-recovery.md#architecture) required for this migration.
3. Check all the [resources required](move-from-classic-to-modernized-vmware-disaster-recovery.md#required-infrastructure) and deploy the [Azure Site Recovery replication appliance](deploy-vmware-azure-replication-appliance-modernized.md).  
4. [Prepare the classic Recovery Services vault](move-from-classic-to-modernized-vmware-disaster-recovery.md#prepare-classic-recovery-services-vault) used by your existing replications.
5. [Prepare the modernized Recovery Services vault](move-from-classic-to-modernized-vmware-disaster-recovery.md#prepare-modernized-recovery-services-vault) where your appliance has been registered.
6. [Trigger migration for your existing replications](how-to-move-from-classic-to-modernized-vmware-disaster-recovery.md).

## Next steps

Plan ahead for the deprecation and move to the modernized experience to take advantage of its [benefits](move-from-classic-to-modernized-vmware-disaster-recovery.md#why-should-i-migrate-my-machines-to-the-modernized-architecture) and stay up-to-date. 

In case you have any queries regarding this deprecation, reach out to Microsoft Support.
