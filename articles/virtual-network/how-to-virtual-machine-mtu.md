---
title: Configure MTU for virtual machines in Azure
titleSuffix: Azure Virtual Network
description: Get started with this how-to article to configure Maximum Transmission Unit (MTU) for Linux and Windows in Azure.
author: asudbring
ms.author: allensu
ms.service: virtual-network
ms.topic: how-to
ms.date: 03/14/2024

#customer intent: As a network administrator, I want to change the MTU for my Linux or Windows virtual machine so that I can optimize network performance.

---

# Configure Maximum Transmission Unit (MTU) for virtual machines in Azure

The Maximum Transmission Unit (MTU) is a measurement representing the largest size ethernet frame (packet) transmitted by a network device or interface. If a packet exceeds the largest size accepted by the device, the packet is fragmented into multiple smaller packets, then later reassembled at the destination. 

Fragmentation and reassembly can introduce performance and ordering issues, resulting in a suboptimal experience. Optimizing MTU for your solution can provide network bandwidth performance benefits by reducing the total number of packets required to send a dataset.  

The MTU is a configurable setting in a virtual machine's operating system. The default value MTU setting in Azure is 1500 bytes. 

VMs in Azure can support larger MTU than the 1,500-byte default only for traffic that stays within the virtual network.

The following table shows the largest MTU size supported on the Azure Network Interfaces available in Azure:

| Operating System | Network Interface | Largest MTU for inter virtual network traffic |
|------------------|-------------------|-----------------------------------------------|
| Windows Server | Mellanox Cx3, Cx4, Cx5 | 3900 </br> **When setting the MTU value with `Set-NetAdapterAdvancedProperty`, use the value `4088`. The value used when setting the MTU with `netsh` is 3900.** |
| Windows Server | (Preview) Microsoft Azure Network Adapter MANA | 9000 </br> **When setting the MTU value with `Set-NetAdapterAdvancedProperty`, use the value `9014`. The value used when setting the MTU with `netsh` is 9000.** | 
| Linux | Mellanox Cx3, Cx4, Cx5 | 3900 |
| Linux | (Preview) Microsoft Azure Network Adapter | 9000 | 

## Prerequisites

# [Linux](#tab/linux)

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

- Two Linux virtual machines in the same virtual network in Azure. For more information about creating a Linux virtual machine, see [Create a Linux virtual machine in the Azure portal](/azure/virtual-machines/linux/quick-create-portal). Remote access to the virtual machines is required for completion of the article. For more information about connecting to Azure Virtual Machines securely, see [What is Azure Bastion?](/azure/bastion/bastion-overview).

    - For the purposes of this article, the virtual machines are named **vm-1** and **vm-2**. Replace these values with your values.

# [Windows](#tab/windows)

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

- Two Windows Server virtual machines in the same virtual network in Azure. For more information about creating a Windows Server virtual machine, see [Create a Windows virtual machine in the Azure portal](/azure/virtual-machines/windows/quick-create-portal). Remote access to the virtual machines is required for completion of the article. For more information about connecting to Azure Virtual Machines securely, see [What is Azure Bastion?](/azure/bastion/bastion-overview).

    - For the purposes of this article, the virtual machines are named **vm-1** and **vm-2**. Replace these values with your values.

---

## Precautions

- Virtual machines in Azure can support larger MTUs than the 1,500-byte default only for traffic that stays within the virtual network. A larger MTU isn't supported for scenarios outside of inter-virtual network VM-to-VM traffic. Traffic traversing through gateways, peering’s, or to the internet aren't supported. Configuration of a larger MTU can result in fragmentation and reduction in performance. For traffic utilizing these scenarios, utilize the default 1,500 byte MTU for testing to ensure that a larger MTU is supported across the entire network path. 

- Optimal MTU is operating system, network, and application specific. The maximal supported MTU might not be optimal for your use case.

- Always test MTU settings changes in a noncritical environment first before applying broadly or to critical environments.

## Obtain vm-1 IP address

1. Sign-in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **Virtual machines** and select **Virtual machines** from the search results.

1. Select **vm-2**.

1. In the **Overview** of **vm-2**, in the **Networking** section, record the private IP address of **vm-2**. The IP address of **vm-2** is required to test the network path. For the purposes of this article, the example IP address is **10.0.0.4**. Replace the IP address with your own value.

## Obtain vm-2 IP address

1. In the search box, enter **Virtual machines** and select **Virtual machines** from the search results.

1. Select **vm-2**.

1. In the **Overview** of **vm-2**, in the **Networking** section, record the private IP address of **vm-2**. The IP address of **vm-2** is required to test the network path. For the purposes of this article, the example IP address is **10.0.0.5**. Replace the IP address with your own value.

## Determine the MTU size on a virtual machine

A shell script for Linux and a PowerShell module is used to determine the largest MTU size that can be used for a specific network path. The script uses ICMP ping to determine the maximum frame size that can be sent between the source and destination. 

The shell script and PowerShell are available in Azure samples gallery. Download the script for Linux and the module for Windows from the following links to **vm-1**:

- [Linux](link here)

- [Windows](link here)

Use the following steps to determine the largest MTU size that can be used for a specific network path:

# [Linux](#tab/linux)

Use the following steps to change the MTU size on a Linux virtual machine:

1. Sign-in to **vm-1**

1. Use the `ip` command to show the current network interfaces and their MTU settings:

    ```bash
    ip link show
    ```

    ```output
    azureuser@vm-linux:~$ ip link show
    1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT group default qlen 1000
        link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP mode DEFAULT group default qlen 1000
        link/ether 00:0d:3a:00:bd:77 brd ff:ff:ff:ff:ff:ff
    3: enP1328s1: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq eth0 state UP mode DEFAULT group default qlen 1000
        link/ether 00:0d:3a:00:bd:77 brd ff:ff:ff:ff:ff:ff
        altname enP1328p0s2
    ```

1. Set the MTU value on **vm-1** to the highest value supported by the network interface. Use the following example to set the MTU value to **3900**:

    ```bash
    echo '3900' | sudo tee /sys/class/net/eth0/mtu || echo "failed: $?"
    ```

    >[!IMPORTANT]
    > The MTU changes made in the previous steps don't persist during a reboot. To make the changes permanent, consult the appropriate documentation for your Linux distribution.

1. Sign-in to **vm-2**.

1. Use the `ip` command to show the current network interfaces and their MTU settings:

    ```bash
    ip link show
    ```

    ```output
    azureuser@vm-linux:~$ ip link show
    1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT group default qlen 1000
        link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP mode DEFAULT group default qlen 1000
        link/ether 00:0d:3a:00:bd:77 brd ff:ff:ff:ff:ff:ff
    3: enP1328s1: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq eth0 state UP mode DEFAULT group default qlen 1000
        link/ether 00:0d:3a:00:bd:77 brd ff:ff:ff:ff:ff:ff
        altname enP1328p0s2
    ```

1. Set the MTU value on **vm-2** to the highest value supported by the network interface. Use the following example to set the MTU value to **3900**:

    ```bash
    echo '3900' | sudo tee /sys/class/net/eth0/mtu || echo "failed: $?"
    ```

1. Sign-in to **vm-1**.

1. Use the following example to run the Linux shell script to determine the largest MTU size that can be used for a specific network path:

    ```bash
    source LinuxVmUtilities.sh;Get-PathMtu 10.0.0.5 1200 eth0
    ```

1. If the output of the script is successful, then the MTU size is set correctly. If the output of the script is not successful, then the mtu size is not set correctly.

    >[!IMPORTANT]
    > The MTU changes made in the previous steps don't persist during a reboot. To make the changes permanent, consult the appropriate documentation for your Linux distribution.

# [Windows](#tab/windows)

Use the following steps to change the MTU size on a Windows Server virtual machine:

1. Sign-in to **vm-1**.

1. Open a PowerShell window as an administrator.

1. Use the following example to display the current network interfaces.

    ```powershell
    Get-NetAdapter
    ```

    ```output
    PS C:\Users\azureuser> Get-NetAdapter

    Name                      InterfaceDescription                    ifIndex Status       MacAddress             LinkSpeed
    ----                      --------------------                    ------- ------       ----------             ---------
    Ethernet 2                Mellanox ConnectX-5 Virtual Adapter          10 Up           60-45-BD-CC-77-01       100 Gbps
    Ethernet                  Microsoft Hyper-V Network Adapter             6 Up           60-45-BD-CC-77-01       100 Gbps
    ```

    The virtual machine has two network interfaces displayed in the output.

1. Record the value of the MAC address of the Mellanox ConnectX-5 Virtual Adapter. You'll need this value for the next step. For the purposes of this article, the example value is **60-45-BD-CC-77-01**. Replace the value with your own value.

1. Use the following example to set the MTU value for the Mellanox ConnectX-5 Virtual Adapter to **4088**. Replace the value of the MAC address with your own value.

    ```powershell
    Get-NetAdapter | ? {$_.MacAddress -eq "60-45-BD-CC-77-01"} | Set-NetAdapterAdvancedProperty -RegistryKeyword "*JumboPacket" -RegistryValue 4088
    ```

1. Sign-in to **vm-2**.

1. Open a PowerShell window as an administrator.

1. Use the following example to display the current network interfaces.

    ```powershell
    Get-NetAdapter
    ```

    ```output
    PS C:\Users\azureuser> Get-NetAdapter

    Name                      InterfaceDescription                    ifIndex Status       MacAddress             LinkSpeed
    ----                      --------------------                    ------- ------       ----------             ---------
    Ethernet 2                Mellanox ConnectX-5 Virtual Adapter          10 Up           60-45-BD-CC-77-01       100 Gbps
    Ethernet                  Microsoft Hyper-V Network Adapter             6 Up           60-45-BD-CC-77-01       100 Gbps
    ```

    The virtual machine has two network interfaces displayed in the output.

1. Record the value of the MAC address of the Mellanox ConnectX-5 Virtual Adapter. You'll need this value for the next step. For the purposes of this article, the example value is **60-45-BD-CC-77-01**. Replace the value with your own value.

1. Use the following example to set the MTU value for the Mellanox ConnectX-5 Virtual Adapter to **4088**. Replace the value of the MAC address with your own value.

    ```powershell
    Get-NetAdapter | ? {$_.MacAddress -eq "60-45-BD-CC-77-01"} | Set-NetAdapterAdvancedProperty -RegistryKeyword "*JumboPacket" -RegistryValue 4088
    ```

1. Sign-in to **vm-1**.

1. Open a PowerShell window as an administrator.

1. Use the following example to run the PowerShell module you downloaded previously to test the network path. Replace the value of the destination host with the IP address of **vm-2**.

    ```powershell
    Import-Module UtilityFunctions.psm1

    Get-PathMtu -DestinationHost 10.0.0.5

    ```

    If the output of the script is successful, then the MTU size is set correctly. If the output of the script is not successful, then the mtu size is not set correctly.

1. Use `netsh` to set the MTU value for **vm-1** to persist reboots. 

    ```powershell
    netsh interface ipv4 set subinterface "Ethernet" mtu=3900 store=persistent
    ```

1. Repeat the previous steps on **vm-2** to set the MTU value for **vm-2** to persist reboots.

    ```powershell
    netsh interface ipv4 set subinterface "Ethernet" mtu=3900 store=persistent
    ```

---

## Related content

* [Microsoft Azure Network Adapter (MANA) overview](/azure/virtual-network/accelerated-networking-mana-overview).

