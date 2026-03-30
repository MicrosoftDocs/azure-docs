---
title: Windows VMs with the Microsoft Azure Network Adapter
description: Learn how the Microsoft Azure Network Adapter can improve the networking performance of Windows VMs in Azure.
author: mattmcinnes
ms.service: azure-virtual-network
ms.topic: how-to
ms.date: 07/10/2023
ms.author: mattmcinnes
# Customer intent: As a cloud administrator, I want to configure the Microsoft Azure Network Adapter for my Windows VMs, so that I can enhance their networking performance and improve overall availability in the Azure environment.
---

# Windows VMs with the Microsoft Azure Network Adapter

Learn how to use the Microsoft Azure Network Adapter (MANA) to improve the performance and availability of Windows virtual machines (VMs) in Azure.

For Linux support, see [Linux VMs with the Microsoft Azure Network Adapter](./accelerated-networking-mana-linux.md).

For more info about MANA, see [Microsoft Azure Network Adapter overview](./accelerated-networking-mana-overview.md).

## Supported Azure Marketplace images

Several Windows images from [Azure Marketplace](/marketplace/azure-marketplace-overview) have built-in support for the Ethernet driver in MANA:

Operating system support details are listed at [Azure Accelerated Networking Overview](accelerated-networking-overview.md).


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
Ethernet                  Microsoft Hyper-V Network Adapter            13 Up           00-0D-3A-AA-00-AA       200 Gbps
Ethernet 3                Microsoft Azure Network Adapter #2            8 Up           00-0D-3A-AA-00-AA       200 Gbps
```

If you do not see the "Microsoft Azure Network Adapter" listed, either your VM has landed on hardware with a different network interface or your operating system does not support MANA. You can check that the MANA device is present using the following command.

```powershell
PS C:\Users\testVM> Get-PnpDevice -PresentOnly | Where-Object { $_.InstanceId -match '^PCI\\VEN_1414&DEV_00BA&' }

Status     Class           FriendlyName                                                                     InstanceId
------     -----           ------------                                                                     ----------
OK         MultiFunction   Microsoft Azure Network Adapter Virtual Bus                                      PCI\VEN_1414...
```
If the output is missing or blank, your VM has landed on hardware with a different network adapter. If you see the output above from ```Get-PnpDevice``` but not from ```Get-NetAdapter```, you are missing MANA driver support in your operating system.  

#### Device Manager

1. Open Device Manager.
2. Expand **Network adapters**, and then select **Microsoft Azure Network Adapter**. The properties for the adapter show that the device is working properly.

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
If the values associated with MANA are 0 or do not increment, you are not using the virtual function. 

## Next steps

- [TCP/IP performance tuning for Azure VMs](./virtual-network-tcpip-performance-tuning.md)
- [Proximity placement groups](/azure/virtual-machines/co-location)
- [Monitoring Azure virtual networks](./monitor-virtual-network.md)
