---
title: Simplified experience for Azure Migrate
description: Describes the simplified experience an upgraded agent-based migration stack for physical and VMware environments
author: rashi-ms
ms.author: v-uhabiba
ms.manager: dhananjayanr
ms.service: azure-migrate
ms.topic: how-to
ms.date: 04/24/2025
# Customer intent: As a system administrator managing physical and VMware environments, I want to utilize an upgraded agent-based migration stack so that I can efficiently migrate newer Linux distributions and ensure a seamless migration process to Azure.
---

# Overview of simplified experience for Azure Migrate (Agent-based VMWare or Physical servers)

The enhanced agent-based migration stack designed for physical and VMware environments. The upgraded stack offers several significant benefits, such as:

- It enables the migration of newer Linux distributions to Azure, expanding the range of supported operating systems and ensuring that customers can leverage the latest advancements in Linux technology. 
- It utilizes Windows Server 2019 (WS2019) and 	Windows Server 2022 (WS2022) for the replication appliance.
- It offers a unified OS support matrix and implies that customers can benefit from a consistent and streamlined approach to operating system support across their migration processes.

The upgraded agent-based migration stack provides customers with the tools and capabilities to efficiently migrate newer Linux distributions. It also allows them to utilize WS2019 and WS2022 for replication and benefit from a unified OS support matrix. These features enhance the overall migration process to Azure. [Learn more](tutorial-migrate-physical-virtual-machines.md#simplified-experience-recommended)

## Key differences

The key differences between the Classic and Simplified experience:

| **Aspect** | **Classic experience** | **Simplified experience** |
| --- | --- | --- | 
| Upgrade and replacement | Old version with traditional interface | Upgraded version offering a more streamlined and user-friendly interface.
| Enhanced compatibility | Limited support for newer Linux distributions | Supports newer Linux distributions and uses Windows Server 2019 as the replication appliance. |
| Improved performance and reliability | Standard performance and reliability | Leveraging latest technologies for better performance and reliability in physical and VMware agent-based migrations. |
|Streamlined migration process| Traditional migration process	 | Provides a more seamless and efficient migration process, addressing multiple customer concerns. |
| Deprecation of classic experience | Support for ongoing replications active until March 2026, Support for initializing new replications ends by October 30, 2025 | NA |

## Action Required
- Do not use the classic experience for any new agent-based VMware or physical server replications. Replication initialization using classic experience will not be supported after **October 30, 2025**.
- Support for servers currently under replication with the classic experience will continue until the retirement date, **March 30, 2026**. Please plan your migrations before the retirement date.
- If you have any servers discovered via the replication appliance under classic experience, please plan your replications before **October 30, 2025**, and subsequent migrations accordingly.

[Learn more](../site-recovery/vmware-physical-azure-classic-deprecation.md)


## Next steps

- Learn about the [Simplified experience](tutorial-migrate-physical-virtual-machines.md#simplified-experience-recommended).
