---
title: SAP HANA availability on Azure VMs - Overview | Microsoft Docs
description: Describes SAP HANA operations on Azure native VMs.
author: msjuergent
manager: patfilot
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: article
ms.date: 03/05/2018
ms.author: juergent
ms.custom: H1Hack27Feb2017
---

# SAP HANA high availability for Azure virtual machines

You can use numerous Azure capabilities to deploy mission-critical databases like SAP HANA on Azure VMs. This article provides guidance on how to achieve availability for SAP HANA instances that are hosted in Azure VMs. The article describes several scenarios that you can implement by using the Azure infrastructure to increase availability of SAP HANA in Azure. 

## Prerequisites

This article assumes that you are familiar with infrastructure as a service (IaaS) basics in Azure, including: 

- How to deploy virtual machines or virtual networks via the Azure portal or PowerShell.
- Using the Azure cross-platform command-line interface (Azure CLI), including the option to use JavaScript Object Notation (JSON) templates.

This article also assumes that you are familiar with installing SAP HANA instances, and with administrating and operating SAP HANA instances. It's especially important to be familiar with the setup and operations of HANA system replication. This includes tasks like backup and restore for SAP HANA databases.

These articles provide a good overview of using SAP HANA in Azure:

- [Manual installation of single-instance SAP HANA on Azure VMs](./hana-get-started.md)
- [Set up SAP HANA system replication in Azure VMs](sap-hana-high-availability.md)
- [Back up SAP HANA on Azure VMs](../../backup/sap-hana-db-about.md)

It's also a good idea to be familiar with these articles about SAP HANA:

- [High availability for SAP HANA](https://help.sap.com/viewer/6b94445c94ae495c83a19646e7c3fd56/2.0.02/en-US/6d252db7cdd044d19ad85b46e6c294a4.html)
- [FAQ: High availability for SAP HANA](https://help.sap.com/docs/SAP_HANA_PLATFORM/6b94445c94ae495c83a19646e7c3fd56/6d252db7cdd044d19ad85b46e6c294a4.html)
- [Perform system replication for SAP HANA](https://www.sap.com/documents/2017/07/606a676e-c97c-0010-82c7-eda71af511fa.html)
- [SAP HANA 2.0 SPS 01 What’s new: High availability](https://blogs.sap.com/2017/05/15/sap-hana-2.0-sps-01-whats-new-high-availability-by-the-sap-hana-academy/)
- [Network recommendations for SAP HANA system replication](https://www.sap.com/documents/2016/06/18079a1c-767c-0010-82c7-eda71af511fa.html)
- [SAP HANA system replication](https://help.sap.com/viewer/6b94445c94ae495c83a19646e7c3fd56/2.0.01/en-US/b74e16a9e09541749a745f41246a065e.html)
- [SAP HANA service auto-restart](https://help.sap.com/viewer/6b94445c94ae495c83a19646e7c3fd56/2.0.01/en-US/cf10efba8bea4e81b1dc1907ecc652d3.html)
- [Configure SAP HANA system replication](https://help.sap.com/viewer/6b94445c94ae495c83a19646e7c3fd56/2.0.01/en-US/676844172c2442f0bf6c8b080db05ae7.html)

Beyond being familiar with deploying VMs in Azure, before you define your availability architecture in Azure, we recommend that you read [Manage the availability of Windows virtual machines in Azure](/azure/virtual-machines/availability).

## Service level agreements for Azure components

Azure has different availability SLAs for different components, like networking, storage, and VMs. All SLAs are documented. For more information, see [Microsoft Azure Service Level Agreements](https://azure.microsoft.com/support/legal/sla/). 

[SLA for Virtual Machines](https://azure.microsoft.com/support/legal/sla/virtual-machines/v1_8/) describes three different SLAs, for three different configurations:

- A single VM that uses [Azure premium SSDs](/azure/virtual-machines/managed-disks-overview) for the OS disk and all data disks. This option provides a monthly uptime of 99.9 percent.
- Multiple (at least two) VMs that are organized in an [Azure availability set](/azure/virtual-machines/windows/tutorial-availability-sets). This option provides a monthly uptime of 99.95 percent.
- Multiple (at least two) VMs that are organized in an [Availability Zone](../../reliability/availability-zones-overview.md). This option provided a monthly uptime of 99.99 percent.

Measure your availability requirement against the SLAs that Azure components can provide. Then, choose your  scenarios for SAP HANA to achieve your required level of availability.

## Next steps

- Learn about [SAP HANA availability within one Azure region](./sap-hana-availability-one-region.md).
- Learn about [SAP HANA availability across Azure regions](./sap-hana-availability-across-regions.md).
