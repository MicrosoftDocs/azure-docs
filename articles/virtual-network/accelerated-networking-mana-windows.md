---
title: Windows VMs with Azure MANA
description: Learn how the Microsoft Azure Network Adapter can improve the networking performance of Windows VMs on Azure.
author: mattmcinnes
ms.service: virtual-network
ms.topic: how-to
ms.date: 07/10/2023
ms.author: mattmcinnes
---

# Windows VMs with Azure MANA

Learn how to use the Microsoft Azure Network Adapter (MANA) to improve the performance and availability of Windows virtual machines in Azure.

For Linux support, see [Linux VMs with Azure MANA](./accelerated-networking-mana-linux.md)

For more info regarding Azure MANA, see [Microsoft Azure Network Adapter (MANA) overview](./accelerated-networking-mana-overview.md)

> [!IMPORTANT]
> Azure MANA is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Supported Marketplace Images
Several [Azure marketplace](/marketplace/azure-marketplace-overview) Windows images have built-in support for Azure MANA's ethernet driver.

Windows:
- Windows Server 2016
- Windows Server 2019
- Windows Server 2022

## Check status of MANA support
Because Azure MANA's feature set requires both host hardware and VM driver software components, there are several checks required to ensure MANA is working properly. All checks are required to ensure MANA functions properly on your VM.

### Azure portal check

Ensure that you have Accelerated Networking enabled on at least one of your NICs:
1.	From the Azure portal page for the VM, select Networking from the left menu.
1.	On the Networking settings page, select the Network Interface.
1.	On the NIC Overview page, under Essentials, note whether Accelerated networking is set to Enabled or Disabled.

### Hardware check

When Accelerated Networking is enabled, the underlying MANA NIC can be identified as a PCI device in the Virtual Machine.

>[!NOTE] 
>When multiple NICs are configured on MANA-supported hardware, there will still only be one PCIe Virtual Function assigned to the VM. MANA is designed such that all VM NICs interact with the same PCIe Virtual function. Since network resource limits are set at the VM SKU level, this has no impact on performance.

### Driver check
There are several ways to verify your VM has a MANA Ethernet driver installed:

#### PowerShell:
```powershell
PS C:\Users\testVM> Get-NetAdapter

Name                      InterfaceDescription                    ifIndex Status       MacAddress             LinkSpeed
----                      --------------------                    ------- ------       ----------             ---------
Ethernet 4                Microsoft Hyper-V Network Adapter #2         10 Up           00-00-AA-AA-00-AA       200 Gbps
Ethernet 5                Microsoft Azure Network Adapter #3            7 Up           11-11-BB-BB-11-BB       200 Gbps
```

#### Device Manager
1.	Open up device Manager
2.	Within device manager, you should see the Hyper-V Network Adapter and the Microsoft Azure Network Adapter (MANA)

![A screenshot of Windows Device Manager with an Azure MANA network card successfully detected.](media/accelerated-networking-mana/device-manager-mana.png)

## Driver install

If your VM has both portal and hardware support for MANA but doesn't have drivers installed, Windows drivers can be downloaded [here](https://aka.ms/manawindowsdrivers). 

Installation is similar to other Windows device drivers. A readme file with more detailed instructions is included in the download. 


## Verify traffic is flowing through the MANA adapter

In PowerShell, run the following command:

```powershell
PS C:\ > Get-NetAdapter | Where-Object InterfaceDescription -Like "*Microsoft Azure Network Adapter*" | Get-NetAdapterStatistics

Name                             ReceivedBytes ReceivedUnicastPackets       SentBytes SentUnicastPackets
----                             ------------- ----------------------       --------- ------------------
Ethernet 5                       1230513627217            22739256679 ...724576506362       381331993845
```

## Next Steps

- [TCP/IP Performance Tuning for Azure VMs](./virtual-network-tcpip-performance-tuning.md)
- [Proximity Placement Groups](../virtual-machines/co-location.md)
- [Monitor Virtual Network](./monitor-virtual-network.md)
