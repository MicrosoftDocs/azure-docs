---
title: Windows VMs with the Microsoft Azure Network Adapter
description: Learn how the Microsoft Azure Network Adapter can improve the networking performance of Windows VMs in Azure.
author: mattmcinnes
ms.service: virtual-network
ms.topic: how-to
ms.date: 07/10/2023
ms.author: mattmcinnes
---

# Windows VMs with the Microsoft Azure Network Adapter

Learn how to use the Microsoft Azure Network Adapter (MANA) to improve the performance and availability of Windows virtual machines (VMs) in Azure.

For Linux support, see [Linux VMs with the Microsoft Azure Network Adapter](./accelerated-networking-mana-linux.md).

For more info about MANA, see [Microsoft Azure Network Adapter overview](./accelerated-networking-mana-overview.md).

> [!IMPORTANT]
> MANA is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Supported Azure Marketplace images

The following Windows images from [Azure Marketplace](/marketplace/azure-marketplace-overview) have built-in support for the Ethernet driver in MANA:

- Windows Server 2016
- Windows Server 2019
- Windows Server 2022

## Check the status of MANA support

Because the MANA feature set requires both host hardware and VM software components, you must perform the following checks to ensure that MANA is working properly on your VM.

### Azure portal check

Ensure that Accelerated Networking is enabled on at least one of your NICs:

1. On the Azure portal page for the VM, select **Networking** from the left menu.
1. On the **Networking settings** page, for **Network Interface**, select your NIC.
1. On the **NIC Overview** pane, under **Essentials**, note whether **Accelerated Networking** is set to **Enabled** or **Disabled**.

### Hardware check

When you enable Accelerated Networking, you can identify the underlying MANA NIC as a PCI device in the virtual machine.

> [!NOTE]
> When you configure multiple NICs on MANA-supported hardware, there's still only one PCI Express (PCIe) Virtual Function (VF) assigned to the VM. MANA is designed such that all VM NICs interact with the same PCIe VF. Because network resource limits are set at the level of the VM type, this configuration has no effect on performance.

### Driver check

To verify that your VM has a MANA Ethernet driver installed, you can use PowerShell or Device Manager.

#### PowerShell

```powershell
PS C:\Users\testVM> Get-NetAdapter

Name                      InterfaceDescription                    ifIndex Status       MacAddress             LinkSpeed
----                      --------------------                    ------- ------       ----------             ---------
Ethernet 4                Microsoft Hyper-V Network Adapter #2         10 Up           00-00-AA-AA-00-AA       200 Gbps
Ethernet 5                Microsoft Azure Network Adapter #3            7 Up           11-11-BB-BB-11-BB       200 Gbps
```

#### Device Manager

1. Open Device Manager.
2. Expand **Network adapters**, and then select **Microsoft Azure Network Adapter**. The properties for the adapter show that the device is working properly.

   ![Screenshot of Windows Device Manager that shows an MANA network card successfully detected.](media/accelerated-networking-mana/device-manager-mana.png)

## Install drivers

If your VM has both portal and hardware support for MANA but doesn't have drivers installed, you can [download the Windows drivers](https://aka.ms/manawindowsdrivers).

Installation is similar to the installation of other Windows device drivers. The download includes a readme file that has detailed instructions.

## Verify that traffic is flowing through MANA

In PowerShell, run the following command:

```powershell
PS C:\ > Get-NetAdapter | Where-Object InterfaceDescription -Like "*Microsoft Azure Network Adapter*" | Get-NetAdapterStatistics

Name                             ReceivedBytes ReceivedUnicastPackets       SentBytes SentUnicastPackets
----                             ------------- ----------------------       --------- ------------------
Ethernet 5                       1230513627217            22739256679 ...724576506362       381331993845
```

## Next steps

- [TCP/IP performance tuning for Azure VMs](./virtual-network-tcpip-performance-tuning.md)
- [Proximity placement groups](../virtual-machines/co-location.md)
- [Monitoring Azure virtual networks](./monitor-virtual-network.md)
