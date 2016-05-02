<properties
	pageTitle="Azure Stack 1-node hardware requirements | Microsoft Azure"
	description="Hardware requirements for a 1-node deployment of Microsoft Azure Stack."
	services="azure-stack"
	documentationCenter=""
	authors="ErikjeMS"
	manager="byronr"
	editor=""/>

<tags
	ms.service="azure-stack"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="06/28/2016"
	ms.author="erikje"/>

# Azure Stack 1-node hardware requirements

After you’ve [chosen to deploy](TBD.md) a one-node Azure Stack environment, you’ll need to comply with the following hardware requirements. These requirements are the same as the requirements for the Technical Preview 1 environment. So, you can reuse your Technical Preview 1 hardware for this Technical Preview 2 environment.

| Component | Minimum  | Recommended |
|---|---|---|
| Disk drives: Operating System | 1 OS disk with minimum of 200 GB available for system partition (SSD or HDD) | 1 OS disk with minimum of 200 GB available for system partition (SSD or HDD) |
| Disk drives: General Azure Stack POC Data | 4 disks. Each disk provides a minimum of 140 GB of capacity (SSD or HDD). All available disks will be used. | 4 disks. Each disk provides a minimum of 250 GB of capacity (SSD or HDD). All available disks will be used. |
| Compute: CPU | Dual-Socket: 12 Physical Cores  | Dual-Socket: 16 Physical Cores |
| Compute: Memory | 96 GB RAM  | 128 GB RAM |
| Compute: BIOS | Hyper-V Enabled (with SLAT support)  | Hyper-V Enabled (with SLAT support) |
| Network: NIC | Windows Server 2012 R2 Certification required for NIC; no specialized features required | Windows Server 2012 R2 Certification required for NIC; no specialized features required |
| HW logo certification | [Certified for Windows Server 2012 R2](http://windowsservercatalog.com/results.aspx?&chtext=&cstext=&csttext=&chbtext=&bCatID=1333&cpID=0&avc=79&ava=0&avq=0&OR=1&PGS=25&ready=0) |[Certified for Windows Server 2012 R2](http://windowsservercatalog.com/results.aspx?&chtext=&cstext=&csttext=&chbtext=&bCatID=1333&cpID=0&avc=79&ava=0&avq=0&OR=1&PGS=25&ready=0)|

**Data disk drive configuration:** All data drives must be of the same type (all SAS or all SATA) and capacity. If SAS disk drives are used, the disk drives must be attached via a single path (no MPIO, multi-path support is provided).

**Host Bus Adapter (HBA) configuration options**
 
- (Preferred) Simple HBA
- RAID HBA – Adapter must be configured in “pass through” mode
- RAID HBA – Disks should be configured as Single-Disk, RAID-0

**Supported bus and media type combinations**

-	SATA HDD

-	SAS HDD

-	RAID HDD

-	RAID SSD (If the media type is unspecified/unknown\*)

-	SATA SSD + SATA HDD

-	SAS SSD + SAS HDD

\* RAID controllers without pass-through capability can’t recognize the media type. Such controllers will mark both HDD and SSD as Unspecified. In that case, the SSD will be used as persistent storage instead of caching devices. Therefore, you can deploy the Microsoft Azure Stack POC on those SSDs.

**Example HBAs**: LSI 9207-8i, LSI-9300-8i, or LSI-9265-8i in pass-through mode

Sample OEM configurations are available.



## Next steps

[Prepare your Azure Stack environment](azure-stack-deploy-1node-prepare.md)

[Download the Azure Stack POC deployment package](https://azure.microsoft.com/overview/azure-stack/try/?v=try)

