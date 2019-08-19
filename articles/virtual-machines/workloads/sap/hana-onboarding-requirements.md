---
title: Onboarding requirements for SAP HANA on Azure (Large Instances) | Microsoft Docs
description: Onboarding requirements for SAP HANA on Azure (Large Instances).
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
ms.date: 01/31/2019
ms.author: saghorpa
ms.custom: H1Hack27Feb2017

---
# Onboarding requirements

This list assembles requirements for running SAP HANA on Azure (Larger Instances).

**Microsoft Azure**

- An Azure subscription that can be linked to SAP HANA on Azure (Large Instances).
- Microsoft Premier support contract. For specific information related to running SAP in Azure, see [SAP Support Note #2015553 – SAP on Microsoft Azure: Support prerequisites](https://launchpad.support.sap.com/#/notes/2015553). If you use HANA Large Instance units with 384 and more CPUs, you also need to extend the Premier support contract to include Azure Rapid Response.
- Awareness of the HANA Large Instance SKUs you need after you perform a sizing exercise with SAP.

**Network connectivity**

- ExpressRoute between on-premises to Azure: To connect your on-premises data center to Azure, make sure to order at least a 1-Gbps connection from your ISP. Connectivity between HANA Large Instance units and Azure is using ExpressRoute technology as well. This ExpressRoute connection between the HANA Large Instance units and Azure is included in the price of the HANA Large Instance units, including all data ingress and egress charges for this specific ExpressRoute circuit. Therefore, you as customer, do not encounter additional costs beyond your ExpressRoute link between on-premises and Azure.

**Operating system**

- Licenses for SUSE Linux Enterprise Server 12 for SAP Applications.

   > [!NOTE] 
   > The operating system delivered by Microsoft isn't registered with SUSE. It isn't connected to a Subscription Management Tool instance.

- SUSE Linux Subscription Management Tool deployed in Azure on a VM. This tool provides the capability for SAP HANA on Azure (Large Instances) to be registered and respectively updated by SUSE. (There is no internet access within the HANA Large Instance data center.) 
- Licenses for Red Hat Enterprise Linux 6.7 or 7.x for SAP HANA.

   > [!NOTE]
   > The operating system delivered by Microsoft isn't registered with Red Hat. It isn't connected to a Red Hat Subscription Manager instance.

- Red Hat Subscription Manager deployed in Azure on a VM. The Red Hat Subscription Manager provides the capability for SAP HANA on Azure (Large Instances) to be registered and respectively updated by Red Hat. (There is no direct internet access from within the tenant deployed on the Azure Large Instance stamp.)
- SAP requires you to have a support contract with your Linux provider as well. This requirement isn't removed by the solution of HANA Large Instance or the fact that you run Linux in Azure. Unlike with some of the Linux Azure gallery images, the service fee is *not* included in the solution offer of HANA Large Instance. It's your responsibility to fulfill the requirements of SAP regarding support contracts with the Linux distributor. 
   - For SUSE Linux, look up the requirements of support contracts in [SAP Note #1984787 - SUSE Linux Enterprise Server 12: Installation notes](https://launchpad.support.sap.com/#/notes/1984787) and [SAP Note #1056161 - SUSE priority support for SAP applications](https://launchpad.support.sap.com/#/notes/1056161).
   - For Red Hat Linux, you need to have the correct subscription levels that include support and service updates to the operating systems of HANA Large Instance. Red Hat recommends the Red Hat Enterprise Linux subscription for SAP solution. Refer https://access.redhat.com/solutions/3082481. 

For the support matrix of the different SAP HANA versions with the different Linux versions, see [SAP Note #2235581](https://launchpad.support.sap.com/#/notes/2235581).

For the compatibility matrix of the operating system and HLI firmware/driver versions, refer [OS Upgrade for HLI](os-upgrade-hana-large-instance.md).


> [!IMPORTANT] 
> For Type II units only the SLES 12 SP2 OS version is supported at this point. 


**Database**

- Licenses and software installation components for SAP HANA (platform or enterprise edition).

**Applications**

- Licenses and software installation components for any SAP applications that connect to SAP HANA and related SAP support contracts.
- Licenses and software installation components for any non-SAP applications used with SAP HANA on Azure (Large Instances) environments and related support contracts.

**Skills**

- Experience with and knowledge of Azure IaaS and its components.
- Experience with and knowledge of how to deploy an SAP workload in Azure.
- SAP HANA installation certified personal.
- SAP architect skills to design high availability and disaster recovery around SAP HANA.

**SAP**

- Expectation is that you're an SAP customer and have a support contract with SAP.
- Especially for implementations of the Type II class of HANA Large Instance SKUs, consult with SAP on versions of SAP HANA and the eventual configurations on large-sized scale-up hardware.

**Next steps**
- Refer [SAP HANA (Large Instances) architecture on Azure](hana-architecture.md)