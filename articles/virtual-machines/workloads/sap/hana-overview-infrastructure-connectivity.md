---
title: Infrastructure and connectivity to SAP HANA on Azure (large instances) | Microsoft Docs
description: Configure required connectivity infrastructure to use SAP HANA on Azure (large instances).
services: virtual-machines-linux
documentationcenter: 
author: RicksterCDN
manager: gwallace
editor:

ms.service: virtual-machines-linux
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 07/12/2019
ms.author: juergent
ms.custom: H1Hack27Feb2017

---

# SAP HANA (large instances) deployment 

This article assumes that you've completed your purchase of SAP HANA on Azure (large instances) from Microsoft. Before reading this article, for general background, see [HANA large instances common terms](hana-know-terms.md) and [HANA large instances SKUs](hana-available-skus.md).


Microsoft requires the following information to deploy HANA large instance units:

- Customer name.
- Business contact information (including email address and phone number).
- Technical contact information (including email address and phone number).
- Technical networking contact information (including email address and phone number).
- Azure deployment region (for example, West US, Australia East, or North Europe).
- SAP HANA on Azure (large instances) SKU (configuration).
- For every Azure deployment region:
	- A /29 IP address range for ER-P2P connections that connect Azure virtual networks to HANA large instances.
	- A /24 CIDR Block used for the HANA large instances server IP pool.
	- Optional when using [ExpressRoute Global Reach](https://docs.microsoft.com/azure/expressroute/expressroute-global-reach) to enable direct routing from on-premise to HANA Large Instance units or routing between HANA Large Instance units in different Azure regions, you need to reserve another /29 IP address range. This particular range may not overlap with any of the other IP address ranges you defined before.
- The IP address range values used in the virtual network address space attribute of every Azure virtual network that connects to the HANA large instances.
- Data for each HANA large instances system:
  - Desired hostname, ideally with a fully qualified domain name.
  - Desired IP address for the HANA large instance unit out of the Server IP pool address range. (The first 30 IP addresses in the server IP pool address range are reserved for internal use within HANA large instances.)
  - SAP HANA SID name for the SAP HANA instance (required to create the necessary SAP HANA-related disk volumes). Microsoft needs the HANA SID for creating the permissions for sidadm on the NFS volumes. These volumes attach to the HANA large instance unit. The HANA SID is also used as one of the name components of the disk volumes that get mounted. If you want to run more than one HANA instance on the unit, you should list multiple HANA SIDs. Each one gets a separate set of volumes assigned.
  - In the Linux OS, the sidadm user has a group ID. This ID is required to create the necessary SAP HANA-related disk volumes. The SAP HANA installation usually creates the sapsys group, with a group ID of 1001. The sidadm user is part of that group.
  - In the Linux OS, the sidadm user has a user ID. This ID is required to create the necessary SAP HANA-related disk volumes. If you're running several HANA instances on the unit, list all the sidadm users. 
- The Azure subscription ID for the Azure subscription to which SAP HANA on Azure HANA large instances are going to be directly connected. This subscription ID references the Azure subscription, which is going to be charged with the HANA large instance unit or units.

After you provide the preceding information, Microsoft provisions SAP HANA on Azure (large instances). Microsoft sends you information to link your Azure virtual networks to HANA large instances. You can also access the HANA large instance units.

Use the following sequence to connect to the HANA large instances after Microsoft has deployed it:

1. [Connecting Azure VMs to HANA large instances](hana-connect-azure-vm-large-instances.md)
2. [Connecting a VNet to HANA large instances ExpressRoute](hana-connect-vnet-express-route.md)
3. [Additional network requirements (optional)](hana-additional-network-requirements.md)

