---
title: Configure MTU for virtual machines in Azure
titleSuffix: Azure Virtual Network
description: Get started with this how-to article to configure Maximum Transmission Unit (MTU) for Linux and Windows in Azure.
author: asudbring
ms.author: allensu
ms.service: azure-virtual-network
ms.topic: how-to
ms.date: 07/22/2024

#customer intent: As a network administrator, I want to change the MTU for my Linux or Windows virtual machine so that I can optimize network performance.

---

# Configure Maximum Transmission Unit (MTU) for virtual machines in Azure

The Maximum Transmission Unit (MTU) is a measurement representing the largest size ethernet frame (packet) transmitted by a network device or interface. If a packet exceeds the largest size accepted by the device, the packet is fragmented into multiple smaller packets, then later reassembled at the destination. 

Fragmentation and reassembly can introduce performance and ordering issues, resulting in a suboptimal experience. Optimizing MTU for your solution can provide network bandwidth performance benefits by reducing the total number of packets required to send a dataset. Configuration of larger MTU sizes can potentially improve network throughput as it reduces the number of packets and header overhead required to send a dataset. 

The MTU is a configurable setting in a virtual machine's operating system. The default value MTU setting in Azure is 1500 bytes. 

VMs in Azure can support larger MTU than the 1,500-byte default only for traffic that stays within the virtual network.

The following table shows the largest MTU size supported on the Azure Network Interfaces available in Azure:

| Operating System | Network Interface | Largest MTU for inter virtual network traffic |
|------------------|-------------------|-----------------------------------------------|
| Windows Server | Mellanox Cx-3, Cx-4, Cx-5 | 3900 </br> **When setting the MTU value with `Set-NetAdapterAdvancedProperty`, use the value `4088`.**. **To persist reboots, the value returned by `Test-Connection` must also be set with `Set-NetIPInterface`.** |
| Windows Server | (Preview) Microsoft Azure Network Adapter MANA | 9000 </br> **When setting the MTU value with `Set-NetAdapterAdvancedProperty`, use the value `9014`.** **To persist reboots, the value returned by `Test-Connection` must also be set with `Set-NetIPInterface`.** | 
| Linux | Mellanox Cx-3, Cx-4, Cx-5 | 3900 |
| Linux | (Preview) Microsoft Azure Network Adapter | 9000 | 

## Prerequisites

# [Linux](#tab/linux)

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

- Two Linux virtual machines in the same virtual network in Azure. For more information about creating a Linux virtual machine, see [Create a Linux virtual machine in the Azure portal](/azure/virtual-machines/linux/quick-create-portal). Remote access to the virtual machines is required for completion of the article. For more information about connecting to Azure Virtual Machines securely, see [What is Azure Bastion?](/azure/bastion/bastion-overview)

    - For the purposes of this article, the virtual machines are named **vm-1** and **vm-2**. Replace these values with your values.

# [Windows](#tab/windows)

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

- Two Windows Server virtual machines in the same virtual network in Azure. For more information about creating a Windows Server virtual machine, see [Create a Windows virtual machine in the Azure portal](/azure/virtual-machines/windows/quick-create-portal). Remote access to the virtual machines is required for completion of the article. For more information about connecting to Azure Virtual Machines securely, see [What is Azure Bastion?](/azure/bastion/bastion-overview)

    - For the purposes of this article, the virtual machines are named **vm-1** and **vm-2**. Replace these values with your values.

- The newest version of PowerShell installed in the Windows Server virtual machines. The commands in the article don't work with PowerShell installed in Windows Server. For more information about [Installing PowerShell on Windows](/powershell/scripting/install/installing-powershell-on-windows).

---

## Resource examples

The following resources are used as examples in this article. Replace these values with your values.

| Resource | Name | IP Address |
|----------|-------|-------------|
| **Virtual Machine 1** | vm-1 | 10.0.0.4 |
| **Virtual Machine 2** | vm-2 | 10.0.0.5 |

## Precautions

- Virtual machines in Azure can support a larger MTU than the 1,500-byte default only for traffic that stays within the virtual network. A larger MTU isn't supported for scenarios outside of intra-virtual network VM-to-VM traffic. Traffic traversing through gateways, peering’s, or to the internet might not be supported. Configuration of a larger MTU can result in fragmentation and reduction in performance. For traffic utilizing these scenarios, utilize the default 1,500 byte MTU for testing to ensure that a larger MTU is supported across the entire network path. 

- Optimal MTU is operating system, network, and application specific. The maximal supported MTU might not be optimal for your use case.

- Always test MTU settings changes in a noncritical environment first before applying broadly or to critical environments.

## Path MTU Discovery

It's important to understand the MTU supported across the network path your application or machines uses. Path MTU discovery is a means to find out the largest MTU supported between a source and destination address. Using a larger MTU than is supported between the source and destination address results in fragmentation, which could negatively affect performance.

In this article, the examples used test the MTU path between two virtual machines. Subsequent tests can be performed from a virtual machine to any routable destination.

Use the following steps to set a larger MTU size on a source and destination virtual machine. Verify the path MTU with a shell script for Linux or PowerShell for Windows. If the larger MTU isn't supported, the results shown in the path MTU discovery test differ from the settings configured on the source or destination virtual machine interface.

# [Linux](#tab/linux)

The shell script is available in the Azure samples gallery. Download the script for Linux from the following link and save to **vm-1** and **vm-2**.

- [GetPathMTU - Path MTU Discovery Sample Script](/samples/azure-samples/getpathmtu/getpathmtu/)

Use the following steps to change the MTU size on a Linux virtual machine:

1. Sign-in to **vm-1**

1. Use the `ip` command to show the current network interfaces and their MTU settings, Record the IP address for the subsequent steps. In this example, the IP address is **10.0.0.4** and the ethernet interface is **eth0**.

    ```bash
    ip address show
    ```

    ```output
    azureuser@vm-1:~$ ip address show
    1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
        link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
        inet 127.0.0.1/8 scope host lo
           valid_lft forever preferred_lft forever
        inet6 ::1/128 scope host 
           valid_lft forever preferred_lft forever
    2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP group default qlen 1000
        link/ether 00:0d:3a:c5:f3:14 brd ff:ff:ff:ff:ff:ff
        inet 10.0.0.4/24 metric 100 brd 10.0.0.255 scope global eth0
           valid_lft forever preferred_lft forever
        inet6 fe80::20d:3aff:fec5:f314/64 scope link 
           valid_lft forever preferred_lft forever
    3: enP46433s1: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq master eth0 state UP group default qlen 1000
        link/ether 00:0d:3a:c5:f3:14 brd ff:ff:ff:ff:ff:ff
        altname enP46433p0s2
        inet6 fe80::20d:3aff:fec5:f314/64 scope link 
           valid_lft forever preferred_lft forever
    ```

1. Set the MTU value on **vm-1** to the highest value supported by the network interface. In this example, the name of the network interface is **eth0**. Replace this value with your value.

    * For the Mellanox adapter, use the following example to set the MTU value to **3900**:

    ```bash
    echo '3900' | sudo tee /sys/class/net/eth0/mtu || echo "failed: $?"
    ```

    * For the Microsoft Azure Network Adapter, use the following example to set the MTU value to **9000**:

    ```bash
    echo '9000' | sudo tee /sys/class/net/eth0/mtu || echo "failed: $?"
    ```

    >[!IMPORTANT]
    > The MTU changes made in the previous steps don't persist during a reboot. To make the changes permanent, consult the appropriate documentation for your Linux distribution.

1. Use the `ip` command to verify that the MTU settings are applied to the network interface:

    ```bash
    ip address show
    ```

    ```output
    azureuser@vm-1:~$ ip address show
    1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
        link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
        inet 127.0.0.1/8 scope host lo
           valid_lft forever preferred_lft forever
        inet6 ::1/128 scope host 
           valid_lft forever preferred_lft forever
    2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 3900 qdisc mq state UP group default qlen 1000
        link/ether 00:0d:3a:c5:f3:14 brd ff:ff:ff:ff:ff:ff
        inet 10.0.0.4/24 metric 100 brd 10.0.0.255 scope global eth0
           valid_lft forever preferred_lft forever
        inet6 fe80::20d:3aff:fec5:f314/64 scope link 
           valid_lft forever preferred_lft forever
    3: enP46433s1: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 3900 qdisc mq master eth0 state UP group default qlen 1000
        link/ether 00:0d:3a:c5:f3:14 brd ff:ff:ff:ff:ff:ff
        altname enP46433p0s2
        inet6 fe80::20d:3aff:fec5:f314/64 scope link 
           valid_lft forever preferred_lft forever
    ```

1. Sign-in to **vm-2** to repeat the previous steps to set the MTU value to the highest value supported by the network interface.

1. Sign-in to **vm-1**.

1. Use the following example to execute the Linux shell script to test the largest MTU size that can be used for a specific network path. Replace the value of the destination host with the IP address of **vm-2**.

    ```bash
    ./GetPathMtu.sh 10.0.0.5
    ```

1. The output is similar to the following example. If the script's output doesn't display the setting on the network interface, it indicates that the MTU size isn't set correctly. Alternatively, it could mean that a network device along the path only supports the MTU size returned by the GetPathMTU script.

    ```output
    azureuser@vm-1:~/GetPathMTU$ ./GetPathMtu.sh 10.0.0.5
    destination: 10.0.0.5
    startSendBufferSize: 1200
    interfaceName: Default interface
    Test started ....................................................................................................................................................................................................
    3900
    ```

1. Verify the MTU size on the network interface using `PING`. For Linux, use the -M, -s, and -c flags. The -M option instructs ping to NOT fragment, -s sets the packet size, and -c sets the number of pings to send. To determine the packet size, subtract 28 from the MTU setting of 3900.
    
    ```bash
    ping 10.0.0.5 -c 10 -M do -s 3872
    ```
    
    ```output
    azureuser@vm-1:~/GetPathMTU$ ping 10.0.0.5 -c 10 -M do -s 3872
    PING 10.0.0.5 (10.0.0.5) 3872(3900) bytes of data.
    3880 bytes from 10.0.0.5: icmp_seq=1 ttl=64 time=3.70 ms
    3880 bytes from 10.0.0.5: icmp_seq=2 ttl=64 time=1.08 ms
    3880 bytes from 10.0.0.5: icmp_seq=3 ttl=64 time=1.51 ms
    3880 bytes from 10.0.0.5: icmp_seq=4 ttl=64 time=1.25 ms
    3880 bytes from 10.0.0.5: icmp_seq=5 ttl=64 time=1.29 ms
    3880 bytes from 10.0.0.5: icmp_seq=6 ttl=64 time=1.05 ms
    3880 bytes from 10.0.0.5: icmp_seq=7 ttl=64 time=5.67 ms
    3880 bytes from 10.0.0.5: icmp_seq=8 ttl=64 time=1.92 ms
    3880 bytes from 10.0.0.5: icmp_seq=9 ttl=64 time=2.72 ms
    3880 bytes from 10.0.0.5: icmp_seq=10 ttl=64 time=1.20 ms

    --- 10.0.0.5 ping statistics ---
    10 packets transmitted, 10 received, 0% packet loss, time 9014ms
    rtt min/avg/max/mdev = 1.051/2.138/5.666/1.426 ms
    ```

    An indication that there is a mismatch in settings between the source and destination displays as an error message in the output. In this case, the MTU isn't set on the source network interface.

    ```output
    azureuser@vm-1:~/GetPathMTU$ ping 10.0.0.5 -c 10 -M do -s 3872
    PING 10.0.0.5 (10.0.0.5) 3872(3900) bytes of data.
    ping: local error: message too long, mtu=1500
    ping: local error: message too long, mtu=1500
    ping: local error: message too long, mtu=1500
    ping: local error: message too long, mtu=1500
    ping: local error: message too long, mtu=1500
    ping: local error: message too long, mtu=1500
    ping: local error: message too long, mtu=1500
    ping: local error: message too long, mtu=1500
    ping: local error: message too long, mtu=1500
    ping: local error: message too long, mtu=1500

    --- 10.0.0.5 ping statistics ---
    10 packets transmitted, 0 received, +10 errors, 100% packet loss, time 9248ms
    ```

1. Sign-in to **vm-2**.

1. Use the following example to run the Linux shell script to test the largest MTU size that can be used for a specific network path:

    ```bash
    ./GetPathMtu.sh 10.0.0.4
    ```

1. The output is similar to the following example. If the script's output doesn't display the setting on the network interface, it indicates that the MTU size isn't set correctly. Alternatively, it could mean that a network device along the path only supports the MTU size returned by the GetPathMTU script.

     ```output
    azureuser@vm-1:~/GetPathMTU$ ./GetPathMtu.sh 10.0.0.4
    destination: 10.0.0.4
    startSendBufferSize: 1200
    interfaceName: Default interface
    Test started ....................................................................................................................................................................................................
    3900
    ```

1. Verify the MTU size on the network interface using `PING`. For Linux, use the -M, -s, and -c flags. The -M option instructs ping to NOT fragment, -s sets the packet size, and -c sets the number of pings to send. To determine the packet size, subtract 28 from the MTU setting of 3900.
    
    ```bash
    ping 10.0.0.4 -c 10 -M do -s 3872
    ```
    
    ```output
    azureuser@vm-2:~/GetPathMTU$ ping 10.0.0.4 -c 10 -M do -s 3872
    PING 10.0.0.4 (10.0.0.4) 3872(3900) bytes of data.
    3880 bytes from 10.0.0.4: icmp_seq=1 ttl=64 time=3.70 ms
    3880 bytes from 10.0.0.4: icmp_seq=2 ttl=64 time=1.08 ms
    3880 bytes from 10.0.0.4: icmp_seq=3 ttl=64 time=1.51 ms
    3880 bytes from 10.0.0.4: icmp_seq=4 ttl=64 time=1.25 ms
    3880 bytes from 10.0.0.4: icmp_seq=5 ttl=64 time=1.29 ms
    3880 bytes from 10.0.0.4: icmp_seq=6 ttl=64 time=1.05 ms
    3880 bytes from 10.0.0.4: icmp_seq=7 ttl=64 time=5.67 ms
    3880 bytes from 10.0.0.4: icmp_seq=8 ttl=64 time=1.92 ms
    3880 bytes from 10.0.0.4: icmp_seq=9 ttl=64 time=2.72 ms
    3880 bytes from 10.0.0.4: icmp_seq=10 ttl=64 time=1.20 ms

    --- 10.0.0.4 ping statistics ---
    10 packets transmitted, 10 received, 0% packet loss, time 9014ms
    rtt min/avg/max/mdev = 1.051/2.138/5.666/1.426 ms
    ```

    An indication that there is a mismatch in settings between the source and destination displays as an error message in the output. In this case, the MTU isn't set on the source network interface.

    ```output
    azureuser@vm-2:~/GetPathMTU$ ping 10.0.0.4 -c 10 -M do -s 3872
    PING 10.0.0.4 (10.0.0.4) 3872(3900) bytes of data.
    ping: local error: message too long, mtu=1500
    ping: local error: message too long, mtu=1500
    ping: local error: message too long, mtu=1500
    ping: local error: message too long, mtu=1500
    ping: local error: message too long, mtu=1500
    ping: local error: message too long, mtu=1500
    ping: local error: message too long, mtu=1500
    ping: local error: message too long, mtu=1500
    ping: local error: message too long, mtu=1500
    ping: local error: message too long, mtu=1500

    --- 10.0.0.4 ping statistics ---
    10 packets transmitted, 0 received, +10 errors, 100% packet loss, time 9248ms
    ```

# [Windows](#tab/windows)

Use PowerShell to test the connection and MTU size between **vm-1** and **vm-2**.

>[!IMPORTANT]
> You must have the newest version of PowerShell installed in the Windows Server virtual machines. The commands in the article don't work with PowerShell included with Windows Server. For more information about [Installing PowerShell on Windows](/powershell/scripting/install/installing-powershell-on-windows)

Use the following steps to change the MTU size on a Windows Server virtual machine:

1. Sign-in to **vm-1**.

1. Open a PowerShell window as an administrator.

1. Use `Get-NetIPAddress` to show the IP address of **vm-1**. Record the IP address for the subsequent steps. In this example, the IP address is **10.0.0.4**.

    ```powershell
    Get-NetIPAddress -AddressFamily IPv4
    ```

    ```output
    PS C:\Users\azureuser> Get-NetIPAddress -AddressFamily IPv4

    IPAddress         : 10.0.0.4
    InterfaceIndex    : 7
    InterfaceAlias    : Ethernet
    AddressFamily     : IPv4
    Type              : Unicast
    PrefixLength      : 24
    PrefixOrigin      : Dhcp
    SuffixOrigin      : Dhcp
    AddressState      : Preferred
    ValidLifetime     : Infinite ([TimeSpan]::MaxValue)
    PreferredLifetime : Infinite ([TimeSpan]::MaxValue)
    SkipAsSource      : False
    PolicyStore       : ActiveStore

    IPAddress         : 127.0.0.1
    InterfaceIndex    : 1
    InterfaceAlias    : Loopback Pseudo-Interface 1
    AddressFamily     : IPv4
    Type              : Unicast
    PrefixLength      : 8
    PrefixOrigin      : WellKnown
    SuffixOrigin      : WellKnown
    AddressState      : Preferred
    ValidLifetime     : Infinite ([TimeSpan]::MaxValue)
    PreferredLifetime : Infinite ([TimeSpan]::MaxValue)
    SkipAsSource      : False
    PolicyStore       : ActiveStore
    ```

1. Use `Get-NetAdapter` in the following example to display the current network interfaces.

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

1. Record the value of the MAC address of the network interface and the name. You'll need these values for the next step. For the purposes of this article, the example values are **60-45-BD-CC-77-01** and **Ethernet 2**. Replace the values with your own value.

1. Use the following example to display the current MTU value for the network interface.

    ```powershell
    Get-NetAdapter -Name "Ethernet 2" | Format-List -Property MtuSize
    ```
    
    ```output
    PS C:\Users\azureuser> Get-NetAdapter -Name "Ethernet 2" | Format-List -Property MtuSize

    MtuSize : 1500
    ```

1. Windows Virtual machine support both the Mellanox interface and the Microsoft Azure Network Adapter. 
    
    * To set the value on the Mellanox interface, use the following example to set the MTU value to **4088**. Replace the value of the MAC address with your own value.

    ```powershell
    Get-NetAdapter | ? {$_.MacAddress -eq "60-45-BD-CC-77-01"} | Set-NetAdapterAdvancedProperty -RegistryKeyword "*JumboPacket" -RegistryValue 4088
    ```

    * To set the value on the Microsoft Azure Network Adapter, use the following example to set the MTU value to **9014**. Replace the value of the MAC address with your own value.

    ```powershell
    Get-NetAdapter | ? {$_.MacAddress -eq "60-45-BD-CC-77-01"} | Set-NetAdapterAdvancedProperty -RegistryKeyword "*JumboPacket" -RegistryValue 9014
    ```

1. Use the following example to verify the MTU value is set on the network interface.

    ```powershell
    Get-NetAdapter -Name "Ethernet 2" | Format-List -Property MtuSize
    ```

    ```output
    PS C:\Users\azureuser> Get-NetAdapter -Name "Ethernet 2" | Format-List -Property MtuSize

    MtuSize : 4074
    ```

1. Internet Control Message Protocol (ICMP) traffic is required between the source and destination to test the MTU size. Use the following example to enable ICMP traffic on **vm-1**:

    ```powershell
    Set-NetFirewallRule -DisplayName 'File and Printer Sharing (Echo Request - ICMPv4-In)' -enabled True
    ```  

1. Sign-in to **vm-2** to repeat the previous steps to set the MTU value to the highest value supported by the network interface.

1. Sign-in to **vm-1**.

1. Open a PowerShell window as an administrator.

1. Use the following example to execute the PowerShell command `Test-Connection` test the network path. Replace the value of the destination host with the IP address of **vm-2**.

    ```powershell
    Test-Connection -TargetName 10.0.0.5 -MtuSize
    ```

1. The output is similar to the following example. If the command's output doesn't display the setting on the network interface, it indicates that the MTU size isn't set correctly. Alternatively, it could mean that a network device along the path only supports the MTU size returned by the `Test-Connection` command.

    ```output
    PS C:\Users\azureuser> Test-Connection -TargetName 10.0.0.5 -MtuSize

       Destination: 10.0.0.5

    Source           Address                   Latency Status           MtuSize
                                              (ms)                      (B)
    ------           -------                   ------- ------           -------
    vm-1             10.0.0.5                        1 Success             3892
    ```

1. Verify the MTU size on the network interface using `PING`. For Windows, use -f and -l. The -f option instructs ping to NOT fragment and -l sets the packet size. Use the value returned by the `Test-Connection` command for the MtuSize property. In this example, it's **3892**.

    ```powershell
    ping 10.0.0.5 -f -l 3892
    ```
    
    ```output
    PS C:\Users\azureuser> ping 10.0.0.5 -f -l 3892

    Pinging 10.0.0.5 with 3892 bytes of data:
    Reply from 10.0.0.5: bytes=3892 time=1ms TTL=128
    Reply from 10.0.0.5: bytes=3892 time<1ms TTL=128
    Reply from 10.0.0.5: bytes=3892 time=1ms TTL=128
    Reply from 10.0.0.5: bytes=3892 time=1ms TTL=128

    Ping statistics for 10.0.0.5:
        Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
    Approximate round trip times in milli-seconds:
        Minimum = 0ms, Maximum = 1ms, Average = 0ms
    ```

    An indication that there is a mismatch in settings between the source and destination displays as an error message in the output. In this case, the MTU isn't set on the source network interface.

    ```output
    PS C:\Users\azureuser> ping 10.0.0.5 -f -l 3892

    Pinging 10.0.0.5 with 3892 bytes of data:
    Packet needs to be fragmented but DF set.
    Packet needs to be fragmented but DF set.
    Packet needs to be fragmented but DF set.
    Packet needs to be fragmented but DF set.

    Ping statistics for 10.0.0.5:
        Packets: Sent = 4, Received = 0, Lost = 4 (100% loss),
    ```

1. Use `Get-NetIPInterface` to determine the interface alias and the current MTU value. 

    ```powershell
    Get-NetIPInterface
    ```

    ```output
    PS C:\Users\azureuser> Get-NetIPInterface

    ifIndex InterfaceAlias                  AddressFamily NlMtu(Bytes) InterfaceMetric Dhcp     ConnectionState PolicyStore
    ------- --------------                  ------------- ------------ --------------- ----     --------------- -----------
    6       Ethernet                        IPv6                  4074              10 Enabled  Connected       ActiveStore
    1       Loopback Pseudo-Interface 1     IPv6            4294967295              75 Disabled Connected       ActiveStore
    6       Ethernet                        IPv4                  4074              10 Enabled  Connected       ActiveStore
    1       Loopback Pseudo-Interface 1     IPv4            4294967295              75 Enabled  Connected       ActiveStore
    ```

    In the example, the interface alias is **Ethernet** and the MTU value is **4074**.

1. Use `Set-NetIPInterface` to set the MTU value for **vm-1** to persist reboots. For the MTU value, **3892** is used in this example. Replace this value with your value returned by the `Test-Connection` command. The interface alias is **Ethernet** in this example. Replace this value with your value.

    * Mellanox interface:
    
    ```powershell
    Set-NetIPInterface -InterfaceAlias "Ethernet" -NIMtuBytes 3892
    ```
    
    * Microsoft Azure Network Adapter:
    
    ```powershell
    Set-NetIPInterface -InterfaceAlias "Ethernet" -NIMtuBytes 9000
    ```

1. Use `Get-NetIPInterface` to verify the MTU was set with `Set-NetIPInterface`.

    ```powershell
    Get-NetIPInterface -InterfaceAlias "Ethernet"
    ```

    ```output
    PS C:\Users\azureuser> Get-NetIPInterface -InterfaceAlias "Ethernet"

    ifIndex InterfaceAlias                  AddressFamily NlMtu(Bytes) InterfaceMetric Dhcp     ConnectionState PolicyStore
    ------- --------------                  ------------- ------------ --------------- ----     --------------- -----------
    6       Ethernet                        IPv6                  3892              10 Enabled  Connected       ActiveStore
    6       Ethernet                        IPv4                  3892              10 Enabled  Connected       ActiveStore
    ```

1. Sign-in to **vm-2**.

1. Open a PowerShell window as an administrator.

1. Use the following example to execute the PowerShell command `Test-Connection` test the network path. Replace the value of the destination host with the IP address of **vm-2**.

    ```powershell
    Test-Connection -TargetName 10.0.0.4 -MtuSize
    ```

1. The output is similar to the following example. If the command's output doesn't display the setting on the network interface, it indicates that the MTU size isn't set correctly. Alternatively, it could mean that a network device along the path only supports the MTU size returned by the `Test-Connection` command.

    ```output
    PS C:\Users\azureuser> Test-Connection -TargetName 10.0.0.4 -MutSize

       Destination: 10.0.0.4

    Source           Address                   Latency Status           MtuSize
                                              (ms)                      (B)
    ------           -------                   ------- ------           -------
    vm-2             10.0.0.4                        1 Success             3892
    ```

1. Verify the MTU size on the network interface using `PING`. For Windows, use -f and -l. The -f option instructs ping to NOT fragment and -l sets the packet size. To determine the packet size, subtract 28 from the MTU setting of 3900.

    ```powershell
    ping 10.0.0.4 -f -l 3892
    ```
    
    ```output
    PS C:\Users\azureuser> ping 10.0.0.4 -f -l 3892

    Pinging 10.0.0.4 with 3892 bytes of data:
    Reply from 10.0.0.4: bytes=3892 time=1ms TTL=128
    Reply from 10.0.0.4: bytes=3892 time<1ms TTL=128
    Reply from 10.0.0.4: bytes=3892 time=1ms TTL=128
    Reply from 10.0.0.4: bytes=3892 time=1ms TTL=128

    Ping statistics for 10.0.0.4:
        Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
    Approximate round trip times in milli-seconds:
        Minimum = 0ms, Maximum = 1ms, Average = 0ms
    ```

    An indication that there is a mismatch in settings between the source and destination displays as an error message in the output. In this case, the MTU isn't set on the source network interface.

    ```output
    PS C:\Users\azureuser> ping 10.0.0.4 -f -l 3892

    Pinging 10.0.0.4 with 3892 bytes of data:
    Packet needs to be fragmented but DF set.
    Packet needs to be fragmented but DF set.
    Packet needs to be fragmented but DF set.
    Packet needs to be fragmented but DF set.

    Ping statistics for 10.0.0.4:
        Packets: Sent = 4, Received = 0, Lost = 4 (100% loss),
    ```

1. Use `Get-NetIPInterface` to determine the interface alias and the current MTU value. 

    ```powershell
    Get-NetIPInterface
    ```

    ```output
    PS C:\Users\azureuser> Get-NetIPInterface

    ifIndex InterfaceAlias                  AddressFamily NlMtu(Bytes) InterfaceMetric Dhcp     ConnectionState PolicyStore
    ------- --------------                  ------------- ------------ --------------- ----     --------------- -----------
    6       Ethernet                        IPv6                  4074              10 Enabled  Connected       ActiveStore
    1       Loopback Pseudo-Interface 1     IPv6            4294967295              75 Disabled Connected       ActiveStore
    6       Ethernet                        IPv4                  4074              10 Enabled  Connected       ActiveStore
    1       Loopback Pseudo-Interface 1     IPv4            4294967295              75 Enabled  Connected       ActiveStore
    ```

    In the example, the interface alias is **Ethernet** and the MTU value is **4074**.

1. Use `Set-NetIPInterface` to set the MTU value for **vm-2** to persist reboots. For the MTU value, **3892** is used in this example. Replace this value with your value returned by the `Test-Connection` command. The interface alias is **Ethernet** in this example. Replace this value with your value.

    * Mellanox interface:
    
    ```powershell
    Set-NetIPInterface -InterfaceAlias "Ethernet" -NIMtuBytes 3892
    ```
    
    * Microsoft Azure Network Adapter:
    
    ```powershell
    Set-NetIPInterface -InterfaceAlias "Ethernet" -NIMtuBytes 9000
    ```

1. Use `Get-NetIPInterface` to verify the MTU was set with `Set-NetIPInterface`.

    ```powershell
    Get-NetIPInterface -InterfaceAlias "Ethernet"
    ```

    ```output
    PS C:\Users\azureuser> Get-NetIPInterface -InterfaceAlias "Ethernet"

    ifIndex InterfaceAlias                  AddressFamily NlMtu(Bytes) InterfaceMetric Dhcp     ConnectionState PolicyStore
    ------- --------------                  ------------- ------------ --------------- ----     --------------- -----------
    6       Ethernet                        IPv6                  3892              10 Enabled  Connected       ActiveStore
    6       Ethernet                        IPv4                  3892              10 Enabled  Connected       ActiveStore
    ```
---

## Revert changes

To revert the changes made in this article, use the following steps:

# [Linux](#tab/linux)

1. Sign-in to **vm-1**.

1. Use the following example to set the MTU value to the default value of **1500**:

    ```bash
    echo '1500' | sudo tee /sys/class/net/eth0/mtu || echo "failed: $?"
    ```

    >[!IMPORTANT]
    > The MTU changes made in the previous steps don't persist during a reboot. To make the changes permanent, consult the appropriate documentation for your Linux distribution.

1. Use the `ip` command to verify that the MTU settings are applied to the network interface:

    ```bash
    ip address show
    ```

    ```output
    azureuser@vm-1:~$ ip address show
    1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
        link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
        inet 127.0.0.1/8 scope host lo
           valid_lft forever preferred_lft forever
        inet6 ::1/128 scope host 
           valid_lft forever preferred_lft forever
    2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP group default qlen 1000
        link/ether 00:0d:3a:c5:f3:14 brd ff:ff:ff:ff:ff:ff
        inet 10.0.0.4/24 metric 100 brd 10.0.0.255 scope global eth0
           valid_lft forever preferred_lft forever
        inet6 fe80::20d:3aff:fec5:f314/64 scope link 
           valid_lft forever preferred_lft forever
    3: enP46433s1: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq master eth0 state UP group default qlen 1000
        link/ether 00:0d:3a:c5:f3:14 brd ff:ff:ff:ff:ff:ff
        altname enP46433p0s2
        inet6 fe80::20d:3aff:fec5:f314/64 scope link 
           valid_lft forever preferred_lft forever
    ```

1. Sign-in to **vm-2** to repeat the previous steps to set the MTU value to the default value of **1500**.

# [Windows](#tab/windows)

1. Sign-in to **vm-1**.

1. Open a PowerShell window as an administrator.

1. Use the following example to set the MTU value to the default value of **1500**:

    ```powershell
    Get-NetAdapter | ? {$_.MacAddress -eq "60-45-BD-CC-77-01"} | Set-NetAdapterAdvancedProperty -RegistryKeyword "*JumboPacket" -RegistryValue 1514
    ```

1. Use the following example to verify the MTU value is set on the network interface:

    ```powershell
    Get-NetAdapter -Name "Ethernet 2" | Format-List -Property MtuSize
    ```

    ```output
    PS C:\Users\azureuser> Get-NetAdapter -Name "Ethernet 2" | Format-List -Property MtuSize

    MtuSize : 1500
    ```

1. Use the following steps on **vm-1** to set the MTU value for **vm-1** to persist reboots.

    ```powershell
    Set-NetIPInterface -InterfaceAlias "Ethernet 2" -NIMtuBytes 1500
    ```

1. Sign-in to **vm-2** to repeat the previous steps to set the MTU value to the default value of **1500**.

---

## Related content

* [Microsoft Azure Network Adapter (MANA) overview](/azure/virtual-network/accelerated-networking-mana-overview).

