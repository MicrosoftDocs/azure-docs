---
title: Onboarding requirements for SAP HANA on Azure (Large Instances) | Microsoft Docs
description: Learn about onboarding requirements for SAP HANA on Azure (Large Instances).
services: virtual-machines-linux
documentationcenter: 
author: lauradolan
manager: bburns
editor: ''
ms.service: sap-on-azure
ms.subservice: sap-large-instances
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 05/14/2021
ms.author: ladolan
ms.custom: H1Hack27Feb2017

---
# Onboarding requirements

This article lists the requirements for running SAP HANA on Azure Large Instances (also known as BareMetal Infrastructure instances).

## Microsoft Azure

- An Azure subscription that can be linked to SAP HANA on Azure (Large Instances).
- Microsoft Premier support contract. For specific information related to running SAP in Azure, see [SAP Support Note #2015553 – SAP on Microsoft Azure: Support prerequisites](https://launchpad.support.sap.com/#/notes/2015553). If you use HANA Large Instance units with 384 and more CPUs, you also need to extend the Premier support contract to include Azure Rapid Response.
- Awareness of the [HANA Large Instance SKUs](hana-available-skus.md) you need after you complete a [sizing exercise](hana-sizing.md) with SAP.

## Network connectivity

- ExpressRoute between on-premises to Azure: To connect your on-premises data center to Azure, make sure to order at least a 1-Gbps connection from your ISP. Connectivity between HANA Large Instances and Azure uses ExpressRoute technology as well. This ExpressRoute connection between the HANA Large Instances and Azure is included in the price of the HANA Large Instances. The price also includes all data ingress and egress charges for this specific ExpressRoute circuit. So you won't have added costs beyond your ExpressRoute link between on-premises and Azure.

## Operating system

- Licenses for SUSE Linux Enterprise Server 12 and SUSE Linux Enterprise Server 15 for SAP Applications.

   > [!NOTE] 
   > The operating system delivered by Microsoft isn't registered with SUSE. It isn't connected to a Subscription Management Tool instance.

- SUSE Linux Subscription Management Tool deployed in Azure on a VM. This tool provides the capability for SAP HANA on Azure (Large Instances) to be registered and respectively updated by SUSE. (There's no internet access within the HANA Large Instance data center.) 

- Licenses for Red Hat Enterprise Linux 7.9 and 8.2 for SAP HANA.

   > [!NOTE]
   > The operating system delivered by Microsoft isn't registered with Red Hat. It isn't connected to a Red Hat Subscription Manager instance.

- Red Hat Subscription Manager deployed in Azure on a VM. The Red Hat Subscription Manager provides the capability for SAP HANA on Azure (Large Instances) to be registered and respectively updated by Red Hat. (There is no direct internet access from within the tenant deployed on the Azure Large Instance stamp.)
- SAP requires you to have a support contract with your Linux provider as well. This requirement isn't removed by the solution of HANA Large Instance or the fact that you run Linux in Azure. Unlike with some of the Linux Azure gallery images, the service fee is *not* included in the solution offer of HANA Large Instance. It's your responsibility to fulfill the requirements of SAP as far as support contracts with the Linux distributor. 
   - For SUSE Linux, look up the requirements of support contracts in [SAP Note #1984787 - SUSE Linux Enterprise Server 12: Installation notes](https://launchpad.support.sap.com/#/notes/1984787) and [SAP Note #1056161 - SUSE priority support for SAP applications](https://launchpad.support.sap.com/#/notes/1056161).
   - For Red Hat Linux, you need to have the correct subscription levels that include support and service updates to the operating systems of HANA Large Instance. Red Hat recommends the Red Hat Enterprise Linux subscription for SAP solution. Refer to https://access.redhat.com/solutions/3082481. 

For the support matrix of the different SAP HANA versions with the different Linux versions, see [SAP Note #2235581](https://launchpad.support.sap.com/#/notes/2235581).

For the compatibility matrix of the operating system and HLI firmware/driver versions, refer [OS Upgrade for HLI](os-upgrade-hana-large-instance.md).


> [!IMPORTANT] 
> For Type II units SLES 12 SP5, SLES 15 SP2 and SLES 15 SP3 OS versions are supported at this point. 


## Database

- Licenses and software installation components for SAP HANA (platform or enterprise edition).

## Applications

- Licenses and software installation components for any SAP applications that connect to SAP HANA and related SAP support contracts.
- Licenses and software installation components for any non-SAP applications used with SAP HANA on Azure (Large Instances) environments and related support contracts.

## Skills

- Experience with and knowledge of Azure IaaS and its components.
- Experience with and knowledge of how to deploy an SAP workload in Azure.
- SAP HANA installation certified personal.
- SAP architect skills to design high availability and disaster recovery around SAP HANA.

## SAP

- Expectation is that you're an SAP customer and have a support contract with SAP.
- Especially for implementations of the Type II class of HANA Large Instance SKUs, consult with SAP on versions of SAP HANA and the eventual configurations on large-sized scale-up hardware.

## Next steps

Learn about using SAP HANA data tiering and extension nodes.

> [!div class="nextstepaction"]
> [Use SAP HANA data tiering and extension nodes](hana-data-tiering-extension-nodes.md)
