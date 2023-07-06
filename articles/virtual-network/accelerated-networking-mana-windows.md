---
title: Windows VMs with Azure MANA
description: Learn how Azure MANA Accelerated Networking can improve the networking performance of Windows VMs on Azure.
author: mattmcinnes
ms.service: virtual-network
ms.topic: how-to
ms.date: 07/05/2023
ms.author: mattmcinnes
---

# Windows VMs with Azure MANA

Learn how to use the Microsoft Azure Network Adapter (MANA) to improve the performance and availability of Windows virtual machines in Azure. MANA is a next-generation network interface that provides stable forward-compatible device drivers for Windows and Linux operating systems. MANA hardware and software are engineered by Microsoft and take advantage of the latest advancements in cloud networking technology.

>[!NOTE]
>MANA is currently part of the Azure Boost Preview. See the [preview announcement](https://aka.ms/azureboostpreview) for more information and to join.

## Supported Marketplace Images
Several [Azure marketplace](https://learn.microsoft.com/en-us/marketplace/azure-marketplace-overview) images have built-in support for Azure MANA's ethernet driver.

Linux:
- Ubuntu 20.04 LTS, 22.04 LTS
- Red Hat Enterprise Linux 8.8
- Red Hat Enterprise Linux 9.2
- SUSE Linux Enterprise Server 15 SP4
- Debian 12 “Bookworm”
- Oracle Linux 9.0

Windows:
- Windows Server 2016
- Windows Server 2019
- Windows Server 2022

## Check status of MANA support
Because Azure MANA's feature set requires both host hardware and VM driver software components, there are several checks required to ensure MANA is working properly.

### Portal check

Ensure that you have Accelerated Networking enabled on at least one of your NICs:
1.	From the Azure portal page for the VM, select Networking from the left menu.
1.	On the Networking settings page, select the Network Interface.
1.	On the NIC Overview page, under Essentials, note whether Accelerated networking is set to Enabled or Disabled.

### Hardware check

When Accelerated Networking is enabled, the underlying MANA NIC can be identified as a PCI device in the Virtual Machine.

>[!NOTE] 
>When multiple NICs are configured, there will still only be one PCIe Virtual Function assigned to the VM. MANA is designed such that all VM NICs interact with the same PCIe Virtual function. Since network resource limits are set at the VM SKU level, this has no impact on performance.

### Driver check
Verify your VM has a MANA Ethernet driver installed.

#### Powershell:
```powershell
PS C:\Users\testVM> Get-NetAdapter

Name                      InterfaceDescription                    ifIndex Status       MacAddress             LinkSpeed
----                      --------------------                    ------- ------       ----------             ---------
Ethernet 4                Microsoft Hyper-V Network Adapter #2         10 Up           60-45-BD-AA-24-AE       200 Gbps
Ethernet 5                Microsoft Azure Network Adapter #3            7 Up           60-45-BD-AA-24-AE       200 Gbps
```

#### Device Manager
1.	Open up device Manager
2.	Within device manager, you should see the Hyper-V Network Adapter as well as the Microsoft Azure Network Adapter (MANA)

## Driver install

If your VM has both portal and hardware support for MANA but doesn't have drivers installed, Windows VF drivers can be downloaded [here](https://aka.ms/azureboostpreview). Installation is similar to other Windows device drivers. A readme file with more detailed instructions is included in the download. 


## Verify traffic is flowing through the MANA adapter

In Powershell, run the following command:

```powershell
PS C:\ > Get-NetAdapter | Where-Object InterfaceDescription -Like "*Microsoft Azure Network Adapter*" | Get-NetAdapterStatistics

Name                             ReceivedBytes ReceivedUnicastPackets       SentBytes SentUnicastPackets
----                             ------------- ----------------------       --------- ------------------
Ethernet 5                       1230513627217            22739256679 ...724576506362       381331993845
```

