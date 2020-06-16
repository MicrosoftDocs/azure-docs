---
title: Overview of SAP HANA on Azure (Large Instances) | Microsoft Docs
description: Overview of how to deploy SAP HANA on Azure (Large Instances).
services: virtual-machines-linux
documentationcenter: 
author: msjuergent
manager: bburns
editor: ''

ms.service: virtual-machines-linux

ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 07/12/2019
ms.author: juergent
ms.custom: H1Hack27Feb2017

---
#  What is SAP HANA on Azure (Large Instances)?

SAP HANA on Azure (Large Instances) is a unique solution to Azure. In addition to providing virtual machines for deploying and running SAP HANA, Azure offers you the possibility to run and deploy SAP HANA on bare-metal servers that are dedicated to you. The SAP HANA on Azure (Large Instances) solution builds on non-shared host/server bare-metal hardware that is assigned to you. The server hardware is embedded in larger stamps that contain compute/server, networking, and storage infrastructure. As a combination, it's HANA tailored data center integration (TDI) certified. SAP HANA on Azure (Large Instances) offers different server SKUs or sizes. Units can have 36 Intel CPU cores and 768 GB of memory and go up to units that have up to 480 Intel CPU cores and up to 24 TB of memory.

The customer isolation within the infrastructure stamp is performed in tenants, which looks like:

- **Networking**: Isolation of customers within infrastructure stack through virtual networks per customer assigned tenant. A tenant is assigned to a single customer. A customer can have multiple tenants. The network isolation of tenants prohibits network communication between tenants in the infrastructure stamp level, even if the tenants belong to the same customer.
- **Storage components**: Isolation through storage virtual machines that have storage volumes assigned to them. Storage volumes can be assigned to one storage virtual machine only. A storage virtual machine is assigned exclusively to one single tenant in the SAP HANA TDI certified infrastructure stack. As a result, storage volumes assigned to a storage virtual machine can be accessed in one specific and related tenant only. They aren't visible between the different deployed tenants.
- **Server or host**: A server or host unit isn't shared between customers or tenants. A server or host deployed to a customer, is an atomic bare-metal compute unit that is assigned to one single tenant. *No* hardware partitioning or soft partitioning is used that might result in you sharing a host or a server with another customer. Storage volumes that are assigned to the storage virtual machine of the specific tenant are mounted to such a server. A tenant can have one to many server units of different SKUs exclusively assigned.
- Within an SAP HANA on Azure (Large Instances) infrastructure stamp, many different tenants are deployed and isolated against each other through the tenant concepts on networking, storage, and compute level. 


These bare-metal server units are supported to run SAP HANA only. The SAP application layer or workload middle-ware layer runs in virtual machines. The infrastructure stamps that run the SAP HANA on Azure (Large Instances) units are connected to the Azure network services backbones. In this way, low-latency connectivity between SAP HANA on Azure (Large Instances) units and virtual machines is provided.

As of July 2019, we differentiate between two different revisions of HANA Large Instance stamps and location of deployments:

- "Revision 3" (Rev 3): Are the stamps that were made available for customer to deploy before July 2019
- "Revision 4" (Rev 4): New stamp design that is deployed in close proximity to Azure VM hosts and which so far are released in the Azure regions of:
	-  West US2 
	-  East US 
	-  West Europe
	-  North Europe


This document is one of several documents that cover SAP HANA on Azure (Large Instances). This document introduces the basic architecture, responsibilities, and services provided by the solution. High-level capabilities of the solution are also discussed. For most other areas, such as networking and connectivity, four other documents cover details and drill-down information. The documentation of SAP HANA on Azure (Large Instances) doesn't cover aspects of the SAP NetWeaver installation or deployments of SAP NetWeaver in VMs. SAP NetWeaver on Azure is covered in separate documents found in the same Azure documentation container. 


The different documents of HANA Large Instance guidance cover the following areas:

- [SAP HANA (Large Instances) overview and architecture on Azure](hana-overview-architecture.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
- [SAP HANA (Large Instances) infrastructure and connectivity on Azure](hana-overview-infrastructure-connectivity.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
- [Install and configure SAP HANA (Large Instances) on Azure](hana-installation.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
- [SAP HANA (Large Instances) high availability and disaster recovery on Azure](hana-overview-high-availability-disaster-recovery.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
- [SAP HANA (Large Instances) troubleshooting and monitoring on Azure](troubleshooting-monitoring.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
- [High availability set up in SUSE by using the STONITH](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/ha-setup-with-stonith)
- [OS backup and restore for Type II SKUs of Revision 3 stamps](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/os-backup-type-ii-skus)

**Next steps**
- Refer [Know the terms](hana-know-terms.md)