---
title: Infrastructure and Connectivity to SAP HANA on Azure (Large Instances) | Microsoft Docs
description: Configure required connectivity infrastructure to use SAP HANA on Azure (Large Instances).
services: virtual-machines-linux
documentationcenter: 
author: RicksterCDN
manager: jeconnoc
editor:

ms.service: virtual-machines-linux
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 09/10/2018
ms.author: rclaus
ms.custom: H1Hack27Feb2017

---

# SAP HANA (large instances) deployment 

After the purchase of SAP HANA on Azure (Large Instances) is finalized between you and the Microsoft enterprise account team, the following information is required by Microsoft to deploy HANA Large Instance Units:

- Customer name
- Business contact information (including e-mail address and phone number)
- Technical contact information (including e-mail address and phone number)
- Technical networking contact information (including e-mail address and phone number)
- Azure deployment region (West US, East US, Australia East, Australia Southeast, West Europe, and North Europe as of July 2017)
- Confirm SAP HANA on Azure (Large Instances) SKU (configuration)
- As already detailed in the Overview and Architecture document for HANA Large Instances, for every Azure Region being deployed to:
	- A /29 IP address range for ER-P2P Connections that connect Azure VNets to HANA Large Instances
	- A /24 CIDR Block used for the HANA Large Instances Server IP Pool
- The IP address range values used in the VNet Address Space attribute of every Azure VNet that connects to the HANA Large Instances
- Data for each of HANA Large Instances system:
  - Desired hostname - ideally with fully qualified domain name.
  - Desired IP address for the HANA Large Instance unit out of the Server IP Pool address range - Keep in mind that the first 30 IP addresses in the Server IP Pool address range are reserved for internal usage within HANA Large Instances
  - SAP HANA SID name for the SAP HANA instance (required to create the necessary SAP HANA-related disk volumes). The HANA SID is required for creating the permissions for sidadm on the NFS volumes, which are getting attached to the HANA Large Instance unit. It also is used as one of the name components of the disk volumes that get mounted. If you want to run more than one HANA instance on the unit, you need to list multiple HANA SIDs. Each one gets a separate set of volumes assigned.
  - The groupid the sidadm user has in the Linux OS is required to create the necessary SAP HANA-related disk volumes. The SAP HANA installation usually creates the sapsys group with a group id of 1001. The sidadm user is part of that group
  - The userid the sidadm user has in the Linux OS is required to create the necessary SAP HANA-related disk volumes. If you are running multiple HANA instances on the unit, you need to list all the <sid>adm users 
- Azure subscription ID for the Azure subscription to which SAP HANA on Azure HANA Large Instances are going to be directly connected. This subscription ID references the Azure subscription, which is going to be charged with the HANA Large Instance unit(s).

After you provide the information, Microsoft provisions SAP HANA on Azure (Large Instances) and will return the information necessary to link your Azure VNets to HANA Large Instances and to access the HANA Large Instance units.

Before reading this article, get familiar with [HANA Large Instances common terms](hana-know-terms.md) and the [HANA Large Instances SKUs](hana-available-skus.md).

You can use the following sequence to connect to the HANA Large Instances after it is deployed by the Microsoft:

1. [Connecting Azure VMs to HANA Large Instances](hana-connect-azure-vm-large-instances.md)
2. [Connecting a VNet to HANA Large Instances ExpressRoute](hana-connect-vnet-express-route.md)
3. [Additional network requirements (optional)](hana-additional-network-requirements.md)

**Next steps**

- Refer [Connecting Azure VMs to HANA Large Instances](hana-connect-azure-vm-large-instances.md).
- Refer [Connecting a VNet to HANA Large Instance ExpressRoute](hana-connect-vnet-express-route.md).