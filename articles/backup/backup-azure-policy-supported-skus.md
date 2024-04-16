---
title: Supported VM SKUs for Azure Policy
description: 'An article describing the supported VM SKUs (by Publisher, Image Offer and Image SKU) which are supported for the built-in Azure Policies provided by Backup'
ms.topic: conceptual
ms.date: 04/08/2022
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Supported VM SKUs for Azure Policy

> [!CAUTION]
> This article references CentOS, a Linux distribution that is nearing End Of Life (EOL) status. Please consider your use and planning accordingly. For more information, see the [CentOS End Of Life guidance](~/articles/virtual-machines/workloads/centos/centos-end-of-life.md).

Azure Backup provides a built-in policy (using Azure Policy) that can be assigned to **all Azure VMs in a specified location within a subscription or resource group**. When this policy is assigned to a given scope, all new VMs created in that scope are automatically configured for backup to an **existing vault in the same location and subscription**. The table below lists all the VM SKUs supported by this policy.

## Supported VMs*

**Policy Name:** Configure backup on VMs of a location to an existing central vault in the same location

Image Publisher | Image Offer | Image SKU
--- | --- | ---
MicrosoftWindowsServer | WindowsServer | Windows Server 2008 R2 SP1 (2008-R2-SP1)
MicrosoftWindowsServer | WindowsServer | [smalldisk] Windows Server 2008 R2 SP (2008-R2-SP1-smalldisk)
MicrosoftWindowsServer | WindowsServer | Windows Server 2012 Datacenter (2012-Datacenter)
MicrosoftWindowsServer | WindowsServer | [smalldisk] Windows Server 2012 Datacenter (2012-Datacenter-smalldisk)
MicrosoftWindowsServer | WindowsServer | Windows Server 2012 R2 Datacenter (2012-R2-Datacenter)
MicrosoftWindowsServer | WindowsServer | [smalldisk] Windows Server 2012 R2 Datacenter (2012-R2-Datacenter-smalldisk)
MicrosoftWindowsServer | WindowsServer | Windows Server 2016 Datacenter (2016-Datacenter)
MicrosoftWindowsServer | WindowsServer | Windows Server 2016 Datacenter - Server Core (2016-Datacenter-Server-Core)
MicrosoftWindowsServer | WindowsServer | [smalldisk] Windows Server 2016 Datacenter - Server Core (2016-Datacenter-Server-Core-smalldisk)
MicrosoftWindowsServer | WindowsServer | [smalldisk] Windows Server 2016 Datacenter (2016-Datacenter-smalldisk)
MicrosoftWindowsServer | WindowsServer | Windows Server 2016 Datacenter - Gen 2 (2016-Datacenter-gensecond)
MicrosoftWindowsServer | WindowsServer | Windows Server 2019 Datacenter Server Core with Containers (2016-Datacenter-with-Containers)
MicrosoftWindowsServer | WindowsServer | Windows Server 2016 Remote Desktop Session Host 2016 (2016-Datacenter-with-RDSH)
MicrosoftWindowsServer | WindowsServer | Windows Server 2019 Datacenter (2019-Datacenter)
MicrosoftWindowsServer | WindowsServer | Windows Server 2019 Datacenter Server Core (2019-Datacenter-Core)
MicrosoftWindowsServer | WindowsServer | [smalldisk] Windows Server 2019 Datacenter Server Core (2019-Datacenter-Core-smalldisk)
MicrosoftWindowsServer | WindowsServer | Windows Server 2019 Datacenter Server Core with Containers (2019-Datacenter-Core-with-Containers)
MicrosoftWindowsServer | WindowsServer | [smalldisk] Windows Server 2019 Datacenter Server Core with Containers (2019-Datacenter-Core-with-Containers-smalldisk)
MicrosoftWindowsServer | WindowsServer | [smalldisk] Windows Server 2019 Datacenter (2019-Datacenter-smalldisk)
MicrosoftWindowsServer | WindowsServer | Windows Server 2019 Datacenter with Containers (2019-Datacenter-with-Containers)
MicrosoftWindowsServer | WindowsServer | [smalldisk] Windows Server 2019 Datacenter with Containers (2019-Datacenter-with-Containers-smalldisk)
MicrosoftWindowsServer | WindowsServer | Windows Server 2019 Datacenter (zh-cn) (2019-Datacenter-zhcn)
MicrosoftWindowsServer | WindowsServerSemiAnnual | Datacenter-Core-1709-smalldisk
MicrosoftWindowsServer | WindowsServerSemiAnnual | Datacenter-Core-1709-with-Containers-smalldisk
MicrosoftWindowsServer | WindowsServerSemiAnnual | Datacenter-Core-1803-with-Containers-smalldisk
MicrosoftWindowsServer | WindowsServer | Windows Server 2019 Datacenter - Gen 2 (2019-Datacenter-gensecond)
MicrosoftWindowsServer | WindowsServer | Windows Server 2022 Datacenter - Gen 2 (2022-datacenter-g2)
MicrosoftWindowsServer | WindowsServer | Windows Server 2022 Datacenter(2022-datacenter)
MicrosoftWindowsServer | WindowsServer | Windows Server 2022 Datacenter: Azure Edition - Gen 2 (2022-datacenter-azure-edition)
MicrosoftWindowsServer | WindowsServer | [smalldisk] Windows Server 2022 Datacenter: Azure Edition - Gen 2 (2022-datacenter-azure-edition-smalldisk)
MicrosoftWindowsServer | WindowsServer | Windows Server 2022 Datacenter: Azure Edition Core- Gen 2 (2022-datacenter-azure-edition-core)
MicrosoftWindowsServer | WindowsServer | [smalldisk] Windows Server 2022 Datacenter: Azure Edition Core - Gen 2 (2022-datacenter-azure-edition-core-smalldisk)
MicrosoftWindowsServer | WindowsServer | [smalldisk] Windows Server 2022 Datacenter -Gen 2 (2022-datacenter-smalldisk-g2)
MicrosoftWindowsServer | WindowsServer | [smalldisk] Windows Server 2022 Datacenter -Gen 1 (2022-datacenter-smalldisk)
MicrosoftWindowsServer | WindowsServer | Windows Server 2022 Datacenter Server Core -Gen 2 (2022-datacenter-core-g2)
MicrosoftWindowsServer | WindowsServer | Windows Server 2022 Datacenter Server Core -Gen 1 (2022-datacenter-core)
MicrosoftWindowsServer | WindowsServer | [smalldisk]Windows Server 2022 Datacenter Server Core -Gen 2 (2022-datacenter-core-smalldisk-g2)
MicrosoftWindowsServer | WindowsServer | [smalldisk]Windows Server 2022 Datacenter Server Core -Gen 1 (2022-datacenter-core-smalldisk)
MicrosoftWindowsServerHPCPack | WindowsServerHPCPack | All Image SKUs
MicrosoftSQLServer | SQL2016SP1-WS2016 | All Image SKUs
MicrosoftSQLServer | SQL2016-WS2016 | All Image SKUs
MicrosoftSQLServer | SQL2016SP1-WS2016-BYOL | All Image SKUs
MicrosoftSQLServer | SQL2012SP3-WS2012R2 | All Image SKUs
MicrosoftSQLServer | SQL2016-WS2012R2 | All Image SKUs
MicrosoftSQLServer | SQL2014SP2-WS2012R2 | All Image SKUs
MicrosoftSQLServer | SQL2012SP3-WS2012R2-BYOL | All Image SKUs
MicrosoftSQLServer | SQL2014SP1-WS2012R2-BYOL | All Image SKUs
MicrosoftSQLServer | SQL2014SP2-WS2012R2-BYOL | All Image SKUs
MicrosoftSQLServer | SQL2016-WS2012R2-BYOL | All Image SKUs
MicrosoftRServer | MLServer-WS2016 | All Image SKUs
MicrosoftVisualStudio | VisualStudio | All Image SKUs
MicrosoftVisualStudio | Windows | All Image SKUs
MicrosoftDynamicsAX | Dynamics | Pre-Req-AX7-Onebox-U8
microsoft-ads | windows-data-science-vm | All Image SKUs
MicrosoftWindowsDesktop | Windows-10 | All Image SKUs
RedHat | RHEL | 6.7, 6.8, 6.9, 6.10, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7
RedHat | RHEL-SAP-HANA | 6.7, 7.2, 7.3
SUSE | SLES | 12.X
SUSE | SLES-HPC | 12.X
SUSE | SLES-HPC-Priority | 12.X
SUSE | SLES-SAP | 12.X
SUSE | SLES-SAP-BYOS | 12.X
SUSE | SLES-Priority | 12.X
SUSE | SLES-BYOS | 12.X
SUSE | SLES-SAPCAL | 12.X
SUSE | SLES-Standard | 12.X
Canonical | UbuntuServer | 14.04.0-LTS
Canonical | UbuntuServer | 14.04.1-LTS
Canonical | UbuntuServer | 14.04.2-LTS
Canonical | UbuntuServer | 14.04.3-LTS
Canonical | UbuntuServer | 14.04.4-LTS
Canonical | UbuntuServer | 14.04.5-DAILY-LTS
Canonical | UbuntuServer | 14.04.5-LTS
Canonical | UbuntuServer | 16.04-DAILY-LTS
Canonical | UbuntuServer | 16.04-LTS
Canonical | UbuntuServer | 16.04.0-LTS
Canonical | UbuntuServer | 18.04-DAILY-LTS
Canonical | UbuntuServer | 18.04-LTS
Canonical | UbuntuServer | 20.04-LTS
Oracle | Oracle-Linux | 6.8, 6.9, 6.10, 7.3, 7.4, 7.5, 7.6
OpenLogic | CentOS | 6.X, 7.X
OpenLogic | CentOS–LVM | 6.X, 7.X
OpenLogic | CentOS–SRIOV | 6.X, 7.X
cloudera | cloudera-centos-os | 7.X
