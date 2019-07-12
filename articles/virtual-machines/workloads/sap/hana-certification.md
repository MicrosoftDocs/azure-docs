---
title: Certification of SAP HANA on Azure (Large Instances) | Microsoft Docs
description: Certification of SAP HANA on Azure (Large Instances).
services: virtual-machines-linux
documentationcenter: 
author: RicksterCDN
manager: gwallace
editor: ''

ms.service: virtual-machines-linux
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 09/04/2018
ms.author: saghorpa
ms.custom: H1Hack27Feb2017

---
# Certification

Besides the NetWeaver certification, SAP requires a special certification for SAP HANA to support SAP HANA on certain infrastructures, such as Azure IaaS.

The core SAP Note on NetWeaver, and to a degree SAP HANA certification, is [SAP Note #1928533 – SAP applications on Azure: Supported products and Azure VM types](https://launchpad.support.sap.com/#/notes/1928533).

The certification records for SAP HANA on Azure (Large Instances) units can be found in the [SAP HANA certified IaaS Platforms](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html#categories=Microsoft%20Azure) site. 

The SAP HANA on Azure (Large Instances) types, referred to in SAP HANA certified IaaS Platforms site, provides Microsoft and SAP customers the ability to deploy large SAP Business Suite, SAP BW, S/4 HANA, BW/4HANA, or other SAP HANA workloads in Azure. The solution is based on the SAP-HANA certified dedicated hardware stamp ([SAP HANA tailored data center integration – TDI](https://scn.sap.com/docs/DOC-63140)). If you run an SAP HANA TDI-configured solution, all SAP HANA-based applications (such as SAP Business Suite on SAP HANA, SAP BW on SAP HANA, S4/HANA, and BW4/HANA) works on the hardware infrastructure.

Compared to running SAP HANA in VMs, this solution has a benefit. It provides for much larger memory volumes. To enable this solution, you need to understand the following key aspects:

- The SAP application layer and non-SAP applications run in VMs that are hosted in the usual Azure hardware stamps.
- Customer on-premises infrastructure, data centers, and application deployments are connected to the cloud platform through ExpressRoute (recommended) or a virtual private network (VPN). Active Directory and DNS also are extended into Azure.
- The SAP HANA database instance for HANA workload runs on SAP HANA on Azure (Large Instances). The Large Instance stamp is connected into Azure networking, so software running in VMs can interact with the HANA instance running in HANA Large Instance.
- Hardware of SAP HANA on Azure (Large Instances) is dedicated hardware provided in an IaaS with SUSE Linux Enterprise Server or Red Hat Enterprise Linux preinstalled. As with virtual machines, further updates and maintenance to the operating system is your responsibility.
- Installation of HANA or any additional components necessary to run SAP HANA on units of HANA Large Instance is your responsibility. All respective ongoing operations and administration of SAP HANA on Azure are also your responsibility.
- In addition to the solutions described here, you can install other components in your Azure subscription that connects to SAP HANA on Azure (Large Instances). Examples are components that enable communication with or directly to the SAP HANA database, such as jump servers, RDP servers, SAP HANA Studio, SAP Data Services for SAP BI scenarios, or network monitoring solutions.
- As in Azure, HANA Large Instance offers support for high availability and disaster recovery functionality.

**Next steps**
- Refer [Available SKUs for HLI](hana-available-skus.md) 