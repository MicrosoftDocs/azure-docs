---
title: Deprecation of classic experience to protect VMware and Physical machines using Azure Site Recovery | Microsoft Docs
description: Details about upcoming deprecation of classic experience to protect VMware and Physical machines to Azure and alternate options
services: site-recovery
author: Sharmistha-Rai
ms.service: site-recovery
ms.topic: article
ms.date: 11/15/2022
ms.author: sharrai 

---
# Deprecation of classic experience to protect VMware and Physical machines using Azure Site Recovery 

This article describes the upcoming deprecation plan, the corresponding implications, and the alternative options available for the customers for the following scenario:

Classic experience to protect VMware and physical machines to Azure using Site Recovery

> [!IMPORTANT]
> On November 15, 2023, the support for classic experience to protect VMware and Physical machines using Azure Site Recovery will be deprecated. It is advised to move to the [modernized experience](how-to-move-from-classic-to-modernized-vmware-disaster-recovery.md) at the earliest to avoid any disruption to environment and minimize security risk. 

## What changes should you expect?

- Starting November 2022, you'll receive Azure portal notifications & email communications with the upcoming deprecation of classic replication experience of VMware and physical machines. The capability will be completely deprecated and go out of support on November 2023.

- Starting 15 November 2022, only use the new, modernized experience can be used to enable Azure Site Recovery for all newly created Recovery Services vaults.

- Existing VMware and physical machines can remain on the classic management experience until 15 November 2023. However, changes to any configurations of the replication on these existing VMware and physical machines will require upgrade to the new modernized experience, starting 15 April 2023. 

- Any support for new features or improvements, along with mobility agent support for new Linux distros, will only be released on the new, modernized experience.

- Replication health of all machines not migrated by 15 November 2023 may get disrupted. Customers won't be able to view, manage, or performs any DR-related operations via the Azure Site Recovery experience in Azure portal. 
 
## Alternatives 

[Modernized experience](vmware-azure-architecture-modernized.md) is the alternative that the customer should choose to ensure that their DR strategy isn't impacted once the experience is deprecated. 

## Remediation steps

Execute the following steps to move your existing replications to the modernized experience:

1. [Check the required infrastructure for your setup](move-from-classic-to-modernized-vmware-disaster-recovery.md#how-to-define-required-infrastructure) and the [FAQs](move-from-classic-to-modernized-vmware-disaster-recovery.md#faqs) for all related information.
2. [Check the architecture and minimum version of all components](move-from-classic-to-modernized-vmware-disaster-recovery.md#architecture) required for this migration.
3. Check all the [resources required](move-from-classic-to-modernized-vmware-disaster-recovery.md#required-infrastructure) and deploy the [Azure Site Recovery replication appliance](deploy-vmware-azure-replication-appliance-modernized.md).  
4. [Prepare the classic Recovery Services vault](move-from-classic-to-modernized-vmware-disaster-recovery.md#prepare-classic-recovery-services-vault) used by your existing replications.
5. [Prepare the modernized Recovery Services vault](move-from-classic-to-modernized-vmware-disaster-recovery.md#prepare-modernized-recovery-services-vault) where your appliance has been registered.
6. [Trigger migration for your existing replications](how-to-move-from-classic-to-modernized-vmware-disaster-recovery.md).

## Next steps
Plan for the deprecation and move to the modernized experience to experience the [benefits](move-from-classic-to-modernized-vmware-disaster-recovery.md#why-should-i-migrate-my-machines-to-the-modernized-architecture) and stay up-to-date. In case you have any queries regarding this deprecation, reach out to Microsoft Support.

