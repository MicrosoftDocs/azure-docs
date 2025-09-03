---
title: Simplified experience for Azure Migrate
description: Describes the simplified experience an upgraded agent-based migration stack for physical and VMware environments
author: dhananjayanr98
ms.author: dhananjayanr
ms.manager: dhananjayanr
ms.service: azure-migrate
ms.topic: how-to
ms.date: 08/26/2025
# Customer intent: As a system administrator managing physical and VMware environments, I want to utilize an upgraded agent-based migration stack so that I can efficiently migrate newer Linux distributions and ensure a seamless migration process to Azure.
---

# Overview of simplified experience for Azure Migrate (agent-based VMware or physical servers)

The simplified experience leverages an enhanced agent-based migration stack tailored for physical and VMware environments, offering several key advantages:
- **Broader OS support**: It enables migration of newer Linux distributions to Azure, expanding compatibility and allowing customers to benefit from the latest innovations in Linux technology.
- **Modern replication appliance**: It utilizes Windows Server 2022 (WS2022) for the replication appliance, ensuring robust and up-to-date infrastructure.
- **Unified OS support matrix**: This provides a consistent and streamlined approach to operating system support across migration workflows, simplifying planning and execution.
  
Overall, the upgraded stack equips customers with powerful tools to efficiently migrate newer Linux distributions, leverage modern Windows Server platforms for replication, and benefit from a unified OS support framework—enhancing the entire migration journey to Azure.

## Key differences between classic and simplified experience

The key differences between the Classic and Simplified experience:

| **Aspect** | **Classic experience** | **Simplified experience** |
| --- | --- | --- | 
| Upgrade and replacement | Old version with traditional interface | Upgraded version offering a more streamlined and user-friendly interface.
| Enhanced compatibility | Limited support for newer Linux distributions | Supports newer Linux distributions and uses Windows Server 2022 as the replication appliance. |
| Improved performance and reliability | Standard performance and reliability | Leveraging latest technologies for better performance and reliability in physical and VMware agent-based migrations. |
|Streamlined migration process| Traditional migration process	 | Provides a more seamless and efficient migration process, addressing multiple customer concerns. |
| Deprecation of classic experience | Support for ongoing replications will remain active until March 2026, while support for initiating new replications will end on October 30, 2025 | NA |

## Action required
- Classic experience is scheduled for deprecation on **30 March 2026**. We recommend using the **simplified experience** for initiating agent-based replication of any new VMware or physical servers.
  >[!NOTE]
  >Classic experience will not support starting replications on new servers after **October 30, 2025**.
- If you have servers discovered through the replication appliance under the classic experience, ensure replication is initiated before **October 30, 2025**, and plan your subsequent migrations before the deprecation date **(March 30, 2026)**.
- Existing VMware and physical machines can continue using the classic experience until **March 30, 2026**. After that date, any changes to replication configurations will require an upgrade to the new simplified experience.
-  New features, enhancements, and mobility agent support for additional Linux distributions will only be made available in the simplified experience.
-  If you don’t migrate your machines by **March 30, 2026**, replication health may be affected. You won’t be able to view, manage, or perform operations on these machines through the Azure portal after this date.
  
## Move your existing replications on classic experience to simplified experience
>[!NOTE]
  > When you migrate physical machines and VMware machines using agent based migration, the tool uses the same replication architecture as agent-based disaster recovery in Azure Site Recovery. Some components share the same code base and some content might link to Site Recovery documentation. **Simplified experience** is referred to as **Modernized experience** under Site recovery documentation.

Follow these steps to move your existing replications to the simplified experience:

1. [Check the required infrastructure for your setup](../site-recovery/move-from-classic-to-modernized-vmware-disaster-recovery.md#how-to-define-required-infrastructure) and the [FAQs](../site-recovery/classic-to-modernized-common-questions.md) for all related information.
2. [Check the architecture and minimum version of all components](../site-recovery/move-from-classic-to-modernized-vmware-disaster-recovery.md#architecture) required for this migration.
3. Check all the [resources required](../site-recovery/move-from-classic-to-modernized-vmware-disaster-recovery.md#required-infrastructure) and deploy the [replication appliance](tutorial-migrate-physical-virtual-machines.md#simplified-experience-recommended).  
4. [Prepare the classic Recovery Services vault](../site-recovery/move-from-classic-to-modernized-vmware-disaster-recovery.md#prepare-classic-recovery-services-vault) used by your existing replications.
5. [Prepare the simplified/modernized Recovery Services vault](../site-recovery/move-from-classic-to-modernized-vmware-disaster-recovery.md#prepare-modernized-recovery-services-vault) where your appliance has been registered.
6. [Trigger migration for your existing replications](../site-recovery/how-to-move-from-classic-to-modernized-vmware-disaster-recovery.md).

  
## Next steps

- Learn more about the [Simplified experience](tutorial-migrate-physical-virtual-machines.md#simplified-experience-recommended).
- Learn more about the [Deprecation of classic experience](../site-recovery/vmware-physical-azure-classic-deprecation.md).
