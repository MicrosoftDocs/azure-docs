---
title: Architecture of SAP HANA on Azure (Large Instances) | Microsoft Docs
description: Learn the architecture for deploying SAP HANA on Azure (Large Instances).
services: virtual-machines-linux
documentationcenter: 
author: lauradolan
manager: juergent
editor: ''
ms.service: sap-on-azure
ms.subservice: sap-large-instances
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 07/21/2021
ms.author: ladolan
ms.custom: H1Hack27Feb2017

---
# SAP HANA (Large Instances) architecture on Azure

In this article, we'll describe the architecture for deploying SAP HANA on Azure Large Instances (otherwise known as BareMetal Infrastructure). 

At a high level, the SAP HANA on Azure (Large Instances) solution has the SAP application layer on virtual machines (VMs). The database layer is on the SAP certified HANA Large Instance (HLI). The HLI is located in the same Azure region as the Azure IaaS VMs.

> [!NOTE]
> Deploy the SAP application layer in the same Azure region as the SAP database management system (DBMS) layer. This rule is well documented in published information about SAP workloads on Azure. 

## Architectural overview

The overall architecture of SAP HANA on Azure (Large Instances) provides an SAP TDI-certified hardware configuration. The hardware is a non-virtualized, bare metal, high-performance server for the SAP HANA database. It gives you the flexibility to scale resources for the SAP application layer to meet your needs.

![Architectural overview of SAP HANA on Azure (Large Instances)](./media/hana-overview-architecture/image1-architecture.png)

The architecture shown is divided into three sections:

- **Right**: Shows an on-premises infrastructure that runs different applications in data centers so that end users can access line-of-business (LOB) applications, such as SAP. Ideally, this on-premises infrastructure is connected to Azure with [ExpressRoute](https://azure.microsoft.com/services/expressroute/).

- **Center**: Shows Azure IaaS and, in this case, use of VMs to host SAP or other applications that use SAP HANA as a DBMS. Smaller HANA instances that function with the memory that VMs provide are deployed in VMs together with their application layer. For more information about virtual machines, see [Virtual machines](https://azure.microsoft.com/services/virtual-machines/).

   Azure network services are used to group SAP systems together with other applications into virtual networks. These virtual networks connect to on-premises systems and to SAP HANA on Azure (Large Instances).

   For SAP NetWeaver applications and databases that are supported to run in Azure, see [SAP Support Note #1928533 – SAP applications on Azure: Supported products and Azure VM types](https://launchpad.support.sap.com/#/notes/1928533). For documentation on how to deploy SAP solutions on Azure, see:

  -  [Use SAP on Windows virtual machines](../../virtual-machines/workloads/sap/get-started.md?toc=/azure/virtual-machines/linux/toc.json)
  -  [Use SAP solutions on Azure virtual machines](../../virtual-machines/workloads/sap/get-started.md)

- **Left**: Shows the SAP HANA TDI-certified hardware in the Azure Large Instance stamp. The HANA Large Instance units connect to the virtual networks of your Azure subscription using the same technology on-premises servers use to connect into Azure. In May 2019, we introduced an optimization that allows communication between the HANA Large Instance units and the Azure VMs without the ExpressRoute Gateway. This optimization, called ExpressRoute FastPath, is shown in the preceding diagram by the red lines.

## Components of the Azure Large Instance stamp

The Azure Large Instance stamp itself combines the following components:

- **Computing**: Servers based on different generations of Intel Xeon processors that offer the necessary computing capability and are SAP HANA certified.
- **Network**: A unified high-speed network fabric that interconnects the computing, storage, and LAN components.
- **Storage**: A storage infrastructure that is accessed through a unified network fabric. The storage capacity provided depends on the SAP HANA on Azure (Large Instances) configuration deployed. More storage capacity is available at added monthly cost.

## Tenants

Within the multi-tenant infrastructure of the Large Instance stamp, customers are deployed as isolated tenants. At deployment of the tenant, you name an Azure subscription within your Azure enrollment. This Azure subscription is the one the HANA Large Instance is billed against. These tenants have a 1:1 relationship to the Azure subscription. 

For a network, it's possible to access a HANA Large Instance deployed in one tenant in one Azure region from different virtual networks belonging to different Azure subscriptions. Those Azure subscriptions must belong to the same Azure enrollment.

## Availability across regions

As with VMs, SAP HANA on Azure (Large Instances) is offered in multiple Azure regions. To offer disaster recovery capabilities, you can choose to opt in. Different Large Instance stamps within one geo-political region are connected to each other. For example, HANA Large Instance Stamps in US West and US East are connected through a dedicated network link for disaster recovery replication.

## Available SKUs

Just as Azure allows you to choose between different VM types, you can choose from different SKUs of HANA Large Instances. You can select the SKU appropriate for the specific SAP HANA workload type. SAP applies memory-to-processor-socket ratios for varying workloads based on the Intel processor generations. For more information on available SKUs, see [Available SKUs for HLI](hana-available-skus.md).

## Next steps

Learn about SAP HANA Large Instances network architecture.

> [!div class="nextstepaction"]
> [SAP HANA (Large Instances) network architecture](hana-network-architecture.md)
