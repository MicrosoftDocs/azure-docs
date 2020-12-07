---
title: Overview of BareMetal Infrastructure in Azure
description: Overview of how to deploy BareMetal Infrastructure in Azure.
ms.topic: conceptual
ms.date: 12/18/2020
---

#  What is BareMetal Infrastructure on Azure?

Azure BareMetal Infrastructure provides a secure solution for migrating enterprise custom workloads. The BareMetal instances are non-shared host/server hardware assigned to you. It unlocks porting your on-prem solution with specialized workloads requiring certified hardware, licensing, and support agreements. Azure handles infrastructure monitoring and maintenance for you, while in-guest OS monitoring and application monitoring fall within your ownership.

Azure BareMetal Infrastructure provides a path to modernize your infrastructure landscape while maintaining your existing investments and architecture. With BareMetal Infrastructure, you can bring specialized workloads to Azure, allowing you access and integration with Azure services with low latency.

## SKU availability in Azure regions
BareMetal Infrastructure for specialized and general-purpose workloads is available, starting with four regions based on Revision 4.2 (Rev 4.2) stamps:
- West Europe
- North Europe
- East US 2
- South Central US

By early Q2 2021, two Revision 4 (Rev 4) stamp regions will be converted to BareMetal Infrastructure regions:
- West US2
- East US2

>[!NOTE]
>**Rev 4.2** is the latest rebranded BareMetal Infrastructure using Rev 4 architecture.  Rev 4 provides closer proximity to the Azure virtual machine (VM) hosts and lowers the latency between Azure VMs and BareMetal Instance units. You can access and manage your BareMetal instances through the Azure portal. 

## Support
It is your responsibility for operating system (OS) license, patching (OS and installed software), installing third-party software, acquiring licenses for third-party software, and supportability of the installed software applications.

- Microsoft provides certified hardware for specialized workloads.  Select the SKU based on your specialized workload type.
- BareMetal Infrastructure uses a bring-your-own-license (BYOL) model: OS, specialized workload, and third-party applications.
- Microsoft provisions the OS for you.
- You have root access and full control.
- ISO 27001, ISO 27017, SOC 1, and SOC 2 compliant.

It is your responsibility to design and implement back up and recovery solutions, high availability, and disaster recovery.

>[!IMPORTANT]
>As soon as you receive root access, you assume all responsibility for licensing, security, and support for OS and third-party software. 

[image]

## Compute
