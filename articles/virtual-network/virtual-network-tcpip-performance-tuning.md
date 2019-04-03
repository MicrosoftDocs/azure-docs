---
title: TCP/IP performance tuning for Azure VMs | Microsoft Docs
description: Learn various common TCP/IP performance tuning techniques and their relationship to Azure VMs. 
services: virtual-network
documentationcenter: na
author: [rimayber, dgoddard, stegag, steveesp, minale, btalb, prachank]
manager: paragk
editor: ''

ms.assetid:
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 3/30/2019
ms.author: [rimayber, dgoddard, stegag, steveesp, minale, btalb, prachank]

---

# TCP/IP performance tuning for Azure VMs

This article discusses common TCP/IP performance tuning techniques and some things to consider when you use them for virtual machines running on Azure. It will provide a basic overview of the techniques and explore how they can be tuned.

## Common TCP/IP tuning techniques

### MTU, fragmentation, and large send offload

#### MTU

The maximum transmission unit (MTU) is the largest size frame (packet), specified in bytes, that can be sent over a network interface. The MTU is a configurable setting. The default MTU used on Azure VMs, and the default setting on most network devices globally, is 1,500 bytes.

#### Fragmentation

Fragmentation occurs when a packet is sent that exceeds the MTU of a network interface. The TCP/IP stack will break the packet into smaller pieces (fragments) that conform to the interface's MTU. Fragmentation occurs at the IP layer and is independent of the underlying protocol (such as TCP). When a 2,000-byte packet is sent over a network interface with an MTU of 1,500, the packet will be broken down into one 1,500-byte packet and one 500-byte packet.

Network devices in the path between a source and destination have the option to drop packets that exceed the MTU or to fragment the packet into smaller pieces.

#### The Don’t Fragment bit in an IP packet

The Don’t Fragment (DF) bit is a flag in the IP protocol header. The DF bit indicates that network devices on the path between the sender and receiver must not fragment the packet. This bit could be set for many reasons. (See the "Path MTU Discovery" section of this article for one example.) When a network device receives a packet with the Don’t Fragment bit set, and that packet exceeds the device's interface MTU, the standard behavior is for the device to drop the packet. The device sends an ICMP Fragmentation Needed message back to the original source of the packet.

#### Performance implications of fragmentation

Fragmentation can have negative performance implications. One of the main reasons for the effect on performance is the CPU/memory impact of the fragmentation and reassembly of packets. When a network device needs to fragment a packet, it will have to allocate CPU/memory resources to perform fragmentation.

The same thing happens when the packet is reassembled. The network device has to store all the fragments until they're received so it can reassemble them into the original packet. This process of fragmentation and reassembly can also cause latency.

The other possible negative performance implication of fragmentation is that fragmented packets might arrive out of order. When packets are received out of order, some types of network devices can drop them. When that happens, the whole packet has to be retransmitted.

Fragments are typically dropped by security devices like network firewalls or when a network device’s receive buffers are exhausted. When a network device's receive buffers are exhausted, a network device is attempting to reassemble a fragmented packet but doesn't have the resources to store and reassume the packet.

Fragmentation can be seen as a negative operation, but support for fragmentation is necessary when you're connecting diverse networks over the internet.

#### Benefits and consequences of modifying the MTU

Generally speaking, you can create a more efficient network by increasing the MTU. Every packet that's transmitted has header information that's added to the original packet. When fragmentation creates more packets, there's more header overhead, and that makes the network less efficient.

Here's an example. The Ethernet header size is 14 bytes plus a 4-byte frame check sequence to ensure frame consistency. If one 2,000-byte packet is sent, 18 bytes of Ethernet overhead is added on the network. If the packet is fragmented into a 1,500-byte packet and a 500-byte packet, each packet will have 18 bytes of Ethernet header, a total of 36 bytes.

Keep in mind that increasing the MTU won't necessarily create a more efficient network. If an application sends only 500-byte packets, the same header overhead will exist whether the MTU is 1,500 bytes or 9,000 bytes. The network will become more efficient only if it uses larger packet sizes that are affected by the MTU.

#### Azure and VM MTU

The default MTU for Azure VMs is 1,500 bytes. The Azure Virtual Network stack will attempt to fragment a packet at 1,400 bytes. But the Virtual Network stack will allow packets up to 2,006 bytes when the Don't Fragment bit is set in the IP header.

Note that the Virtual Network stack isn't inherently inefficient because it fragments packets at 1,400 bytes even though VMs have an MTU of 1,500. A large percentage of network packets are much smaller than 1,400 or 1,500 bytes.

#### Azure and fragmentation

Virtual Network stack is set up to drop "out of order fragments," that is, fragmented packets that don't arrive in their original fragmented order. These packets are dropped mainly because of a network security vulnerability announced in November 2018 called FragmentStack.

FragmentSmack is a defect in the way the Linux kernel handled reassembly of fragmented IPv4 and IPv6 packets. A remote attacker could use this flaw to trigger expensive fragment reassembly operations, which could lead to increased CPU and a denial of service on the target system.

#### Tune the MTU

You can configure an Azure VM MTU, as you can in any other operating system. But you should consider the fragmentation that occurs in Azure, described above, when you're configuring an MTU.

We don't encourage customers to increase VM MTUs. This discussion is meant to explain the details of how Azure implements MTU and performs fragmentation.

> [!IMPORTANT]
>Increasing MTU isn't known to improve performance and could have a negative effect on application performance.
>
>

#### Large send offload

Large send offload (LSO) can improve network performance by offloading the segmentation of packets to the Ethernet adapter. When LSO is enabled, the TCP/IP stack creates a large TCP packet and sends it to the Ethernet adapter for segmentation before forwarding it. The benefit of LSO is that it can free the CPU from segmenting packets into sizes that conform to the MTU and offload that processing to the Ethernet interface where it's performed in hardware. To learn more about the benefits of LSO, see [Supporting large send offload](https://docs.microsoft.com/windows-hardware/drivers/network/performance-in-network-adapters#supporting-large-send-offload-lso).

When LSO is enabled, Azure customers might see large frame sizes when they perform packet captures. These large frame sizes might lead some customers to think fragmentation is occurring or that a large MTU is being used when it’s not. With LSO, the Ethernet adapter can advertise a larger maximum segment size (MSS) to the TCP/IP stack to create a larger TCP packet. This entire non-segmented frame is then forwarded to the Ethernet adapter and would be visible in a packet capture performed on the VM. But the packet will be broken down into many smaller frames by the Ethernet adapter, according to the Ethernet adapter’s MTU.

### TCP MSS window scaling and PMTUD

#### TCP maximum segment size

TCP maximum segment size (MSS) is a setting that limits the size of TCP segments, which avoids fragmentation of TCP packets. Operating systems will typically use this formula to set MSS:

`MSS = MTU - (IP header size + TCP header size)`

The IP header and the TCP header are 20 bytes each, or 40 bytes total. So an interface with an MTU of 1,500 will have an MSS of 1,460. But the MSS is configurable.

This setting is agreed to in the TCP three-way handshake when a TCP session is set up between a source and a destination. Both sides send an MSS value, and the lower of the two is used for the TCP connection.

Keep in mind that the MTUs of the source and destination aren't the only factors that determine the MSS value. Intermediary network devices, like VPN gateways, including Azure VPN Gateway, can adjust the MTU independently of the source and destination to ensure optimal network performance.

#### Path MTU Discovery

MSS is negotiated, but it might not indicate the actual MSS that can be used. This is because other network devices in the path between the source and the destination might have a lower MTU value than the source and destination. In this case, the device whose MTU is smaller than the packet will drop the packet. The device will send back an ICMP Fragmentation Needed (Type 3, Code 4) message that contains its MTU. This ICMP message allows the source host to reduce its Path MTU appropriately. The process is called Path MTU Discovery (PMTUD).

The PMTUD process is inefficient and affects network performance. When packets are sent that exceed a network path's MTU, the packets need to be retransmitted with a lower MSS. If the sender doesn't receive the ICMP Fragmentation Needed message, maybe because of a network firewall in the path (commonly referred to as a *PMTUD blackhole*), the sender doesn't know it needs to lower the MSS and will continuously retransmit the packet. This is why we don’t recommend increasing the Azure VM MTU.

#### VPN and MTU

If you use VMs that perform encapsulation (like IPsec VPNs), there are some additional considerations regarding packet size and MTU. VPNs add more headers to packets, which increases the packet size and requires a smaller MSS.

For Azure, we recommend that you set TCP MSS clamping to 1,350 bytes and tunnel interface MTU to 1,400. For more information, see the [VPN devices and IPSec/IKE parameters page](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpn-devices).

### Latency, round-trip time, and TCP window scaling

#### Latency and round-trip time

Network latency is governed by the speed of light over a fiber optic network. Network throughput of TCP is also effectively governed by the round-trip time (RTT) between two network devices.

| | | | |
|-|-|-|-|
|**Route**|**Distance**|**One-way time**|**RTT**|
|New York to San Francisco|4,148 km|21 ms|42 ms|
|New York to London|5,585 km|28 ms|56 ms|
|New York to Sydney|15,993 km|80 ms|160 ms|

This table shows the straight-line distance between two locations. In networks, the distance is typically longer than the straight-line distance. Here's a simple formula to calculate minimum RTT as governed by the speed of light:
`minimum RTT = 2 * (Distance in kilometers / Speed of propagation)`

You can use 200 for the speed of propagation. This is the distance, in meters, that light travels in 1 millisecond.

Let's take New York to San Francisco as an example. The straight-line distance is 4,148 km. Plugging that value into the equation, we get the following:

`Minimum RTT = 2 * (4,148 / 20)`

The output of the equation is in milliseconds.

If you want to get the best network performance, the logical option is to select destinations with the shortest distance between them. You should also design your virtual network to optimize the path of traffic and reduce latency. For more information, see the "Network design considerations" section of this article.

#### Latency and round-trip time effects on TCP

Round-trip time has a direct effect on maximum TCP throughput. In TCP protocol, *window size* is the maximum amount of traffic that can be sent over a TCP connection before the sender needs to receive acknowledgement from the receiver. If the TCP MSS is set to 1,460 and the TCP window size is set to 65,535, the sender can send 45 packets before it has to receive acknowledgement from the receiver. If the sender doesn't get acknowledgement, it will retransmit. Here's the formula:

`TCP window size / TCP MSS = packets sent`

In this example, 65,535 / 1,460 is rounded up to 45.

This "waiting for acknowledgement" state, a mechanism to ensure reliable delivery of data, is what causes RTT to affect TCP throughput. The longer the sender waits for acknowledgement, the longer it needs to wait before sending more data.

Here's the formula for calculating the maximum throughput of a single TCP connection:

`Window size / (RTT latency in milliseconds / 1,000) = maximum bytes/second`

This table shows the maximum megabytes/per second throughput of a single TCP connection. (For readability, megabytes is used for the unit of measure.)

| | | | |
|-|-|-|-|
|**TCP window size (bytes)**|**RTT latency (ms)**|**Maximum megabyte/second throughput**|**Maximum megabit/second throughput**|
|65,535|1|65.54|524.29|
|65,535|30|2.18|17.48|
|65,535|60|1.09|8.74|
|65,535|90|.73|5.83|
|65,535|120|.55|4.37|

If packets are lost, the maximum throughput of a TCP connection will be reduced while the sender retransmits data it has already sent.

#### TCP window scaling

TCP window scaling is a technique that dynamically increases the TCP window size to allow more data to be sent before an acknowledgement is required. In the previous example, 45 packets would be sent before an acknowledgement was required. If you increase the number of packets that can be sent before an acknowledgement is needed, you're reducing the number of times a sender is waiting for acknowledgement, which increases the TCP maximum throughput.

This table illustrates those relationships:

| | | | |
|-|-|-|-|
|**TCP window size (bytes)**|**RTT latency (ms)**|**Maximum megabyte/second throughput**|**Maximum megabit/second throughput**|
|65,535|30|2.18|17.48|
|131,070|30|4.37|34.95|
|262,140|30|8.74|69.91|
|524,280|30|17.48|139.81|

But the TCP header value for TCP window size is only 2 bytes long, which means the maximum value for a receive window is 65,535. To increase the maximum window size, a TCP window scale factor was introduced.

The scale factor is also a setting that you can configure in an operating system. Here's the formula for calculating the TCP window size by using scale factors:

`TCP window size = TCP window size in bytes \* (2^scale factor)`

Here's the calculation for a window scale factor of 3 and a window size of 65,535:

`65,535 \* (2^3) = 262,140 bytes`

A scale factor of 14 results in a TCP window size of 14 (the maximum offset allowed). The TCP window size will be 1,073,725,440 bytes (8.5 gigabits).

#### Support for TCP window scaling

Windows can set different scaling factors for different connection types. (Classes of connections include datacenter, internet, and so on.) You use the `Get-NetTCPConnection` PowerShell command to view the window scaling connection type:

```powershell
Get-NetTCPConnection
```

You can use the `Get-NetTCPSetting` PowerShell command  to view the values of each class:

```powershell
Get-NetTCPSetting
```

You can set the initial TCP window size and TCP scaling factor in Windows by using the `Set-NetTCPSetting` PowerShell command. For more information, see  [Set-NetTCPSetting](https://docs.microsoft.com/powershell/module/nettcpip/set-nettcpsetting?view=win10-ps).

```powershell
Set-NetTCPSetting
```

These are the effective TCP settings for `AutoTuningLevel`:

| | | | |
|-|-|-|-|
|**AutoTuningLevel**|**Scaling factor**|**Scaling multiplier**|**Formula to<br/>calculate maximum window size**|
|Disabled|None|None|Window size|
|Restricted|4|2^4|Window size * (2^4)|
|Highly restricted|2|2^2|Window size * (2^2)|
|Normal|8|2^8|Window size * (2^8)|
|Experimental|14|2^14|Window size * (2^14)|

These settings are the most likely to affect TCP performance, but keep in mind that many other factors across the internet, outside the control of Azure, can also affect TCP performance.

#### Increase MTU size

Because a larger MTU means a larger MSS, you might wonder whether increasing the MTU can increase TCP performance. Probably not. There are pros and cons to packet size beyond just TCP traffic. As discussed earlier, the most important factors affecting TCP throughput performance are TCP window size, packet loss, and RTT.

> [!IMPORTANT]
> We don't recommend that Azure customers change the default MTU value on virtual machines.
>
>

### Accelerated networking and receive side scaling

#### Accelerated networking

Virtual machine network functions have historically been CPU intensive on both the guest VM and the hypervisor/host. Every packet that transits through the host is processed in software by the host CPU, including all virtual network encapsulation and decapsulation. So, the more traffic that goes through the host, the higher the CPU load. And if the host CPU is busy with other operations, that will also affect network throughput and latency. Azure addresses this issue with accelerated networking.

Accelerated networking provides consistent ultralow network latency via the in-house programmable hardware of Azure and technologies like SR-IOV. Accelerated networking moves much of the Azure software-defined networking stack off the CPUs and into FPGA-based SmartNICs. This change enables end-user applications to reclaim compute cycles, which puts less load on the VM, decreasing jitter and inconsistency in latency. In other words, performance can be more deterministic.

Accelerated networking improves performance by allowing the guest VM to bypass the host and establish a datapath directly with a host’s SmartNIC. Here are some benefits of accelerated networking:

- **Lower latency/higher packets per second (pps)**: Removing the virtual switch from the datapath eliminates the time packets spend in the host for policy processing and increases the number of packets that can be processed in the VM.

- **Reduced jitter**: Virtual switch processing depends on the amount of policy that needs to be applied and the workload of the CPU that's doing the processing. Offloading the policy enforcement to the hardware removes that variability by delivering packets directly to the VM, eliminating the host-to-VM communication and all software interrupts and context switches.

- **Decreased CPU utilization**: Bypassing the virtual switch in the host leads to less CPU utilization for processing network traffic.

To use accelerated networking, you need to explicitly enable it on each applicable VM. See [Create a Linux virtual machine with Accelerated Networking](https://docs.microsoft.com/azure/virtual-network/create-vm-accelerated-networking-cli) for instructions.

#### Receive side scaling

Receive side scaling (RSS) is a network driver technology that distributes the receiving of network traffic more efficiently by distributing receive processing across multiple CPUs in a multi-processor system. In simple terms, RSS allows a system to process a greater amount of received traffic because it uses all available CPUs instead of just one. A more technical discussion of RSS can be found at the [Introduction to Receive Side Scaling page](https://docs.microsoft.com/windows-hardware/drivers/network/introduction-to-receive-side-scaling).

RSS is required to achieve maximum performance when Accelerated Networking is enabled on a VM. There can also be benefits in using RSS on VMs that don’t have accelerated networking enabled. An overview of how to determine if RSS is enabled and configuration for enabling it can be found at the [Optimize network throughput for Azure virtual machines page](http://aka.ms/FastVM).

### TCP Time Wait and Time Wait Assassination

Another common problem that affects network and application performance is the TCP Time Wait setting. On busy VMs that are opening and closing many sockets, either as a client or server (Source IP:Source Port + Destination IP:Destination Port), during the normal operation of TCP, a given socket can end up in a time wait state for a substantial amount of time. This "time wait" state, is meant to allow any additional data to be delivered on a socket prior to closing it. Therefore, TCP/IP stacks generally prevent the reuse of a socket by silently dropping the clients TCP SYN packet.

This amount of time a socket is in time wait state is configurable but could range from 30 seconds to 240 seconds. Sockets are a finite resource, and the number of sockets that can be used at any given time are configurable (the number generally lies around 30,000 potential sockets). If this number is exhausted, or clients and servers have mismatched time wait settings, and a VM tries to reuse a socket in time wait state, then new connections will fail as TCP SYN packets are silently dropped.

Usually the value for port range for outbound sockets, as well as TCP Time Wait settings and socket reuse are configurable within the TCP/IP Stack of an operating system. Changing these numbers can potentially improve scalability, but depending on the scenario, could introduce interoperability issues and should be changed with caution.

A capability called Time Wait Assassination was introduced to address this scaling limitation. Time Wait Assassination allows a socket to be reused under certain scenarios like when the Sequence Number in the IP Packet of the new connection exceeds the Sequence Number of the last packet from the previous connection. In this case, the operating system will allow the new connection to be established (accept the new SYN ACK) and force close the previous connection that was in time wait state. This capability is supported on Windows VMs within Azure today and support within other VMs should be investigated by Azure customers with the respective OS vendors.

Documentation on configuring TCP Time Wait settings and source port range is available at the [Settings that can be Modified to Improve Network Performance page](https://docs.microsoft.com/biztalk/technical-guides/settings-that-can-be-modified-to-improve-network-performance).

## Virtual Network factors that can affect performance

### VM maximum outbound throughput

Azure offers a variety of VM sizes and types, each with a different mix of performance capabilities. One such performance capability is network throughput (or bandwidth), measured in megabits per second (Mbps). Because virtual machines are hosted on shared hardware, the network capacity must be shared fairly among the virtual machines sharing the same hardware. Larger virtual machines are allocated relatively more bandwidth than smaller virtual machines.

The network bandwidth allocated to each virtual machine is metered on egress (outbound) traffic from the virtual machine. All network traffic leaving the virtual machine is counted toward the allocated limit, regardless of destination. For example, if a virtual machine has a 1,000-Mbps limit, that limit applies whether the outbound traffic is destined for another virtual machine in the same virtual network, or outside of Azure.
Ingress is not metered or limited directly. However, there are other factors, such as CPU and storage limits, which can impact a virtual machine’s ability to process incoming data.

Accelerated Networking is a feature designed to improve network performance, including latency, throughput, and CPU utilization. While Accelerated Networking can improve a virtual machine’s throughput, it can do so only up to the virtual machine’s allocated bandwidth.

Azure virtual machines must have one, but may have several, network interfaces attached to them. Bandwidth allocated to a virtual machine is the sum of all outbound traffic across all network interfaces attached to a virtual machine. In other words, the allocated bandwidth is per virtual machine, regardless of how many network interfaces are attached to the virtual machine.
 
Expected outbound throughput and the number of network interfaces supported by each VM size is detailed here. To see maximum throughput, select a type, such as General Purpose, then select a size-series on the resulting page, such as the Dv2-series. Each series has a table with networking specifications in the last column titled, Max NICs / Expected network performance (Mbps).

The throughput limit applies to the virtual machine. Throughput is unaffected by the following factors:

- **Number of network interfaces**: The bandwidth limit is cumulative of all outbound traffic from the virtual machine.

- **Accelerated networking**: Though the feature can be helpful in achieving the published limit, it does not change the limit.

- **Traffic destination**: All destinations count toward the outbound limit.

- **Protocol**: All outbound traffic over all protocols counts towards the limit.

A [table of maximum bandwidth per VM type can be found by visiting this page](https://docs.microsoft.com/azure/virtual-machines/windows/sizes) and clicking on the respective VM type. In each type page, a table will show the maximum NICs and maximum expected network bandwidth.

More information about VM Network Bandwidth can be found at [Virtual machine network bandwidth](http://aka.ms/AzureBandwidth).

### Internet performance considerations

As discussed throughout this article, factors on the Internet and outside the control of Azure can affect network performance. Those factors are:

- **Latency**: The round-trip time between two destinations can be affected by issues on intermediate networks, traffic not taking the "shortest" distance path possible and suboptimal peering paths

- **Packet loss**: Packet loss can be caused by network congestion, physical path issues, and under-performing network devices

- **MTU size/Fragmentation**: Fragmentation along the path can lead to delays in data arrival or packets arriving out of order, which may affect delivery of packets

Traceroute is a good tool to measure network performance characteristics (such as packet loss and latency) along every network path between a source and destination device.

### Network design considerations

Along with the above considerations, the topology of a Virtual Network can affect Virtual Network performance. For example, a hub and spoke design that backhauls traffic globally to a single hub virtual network will introduce network latency and thus effect overall network performance. Similarly, the number of network devices that network traffic passes through can also affect overall latency. For example, in a hub and spoke design, if traffic is passing through a spoke Network Virtual Appliance and a Hub Virtual Appliance before transiting to the Internet, then latency can be introduced by the Network Virtual Appliances.

### Azure Regions, Virtual Networks, and Latency

Azure Regions are made up of multiple data centers that exist within a general geographic area. These datacenters may not be physically next to each other and in some cases may be separated by as much as 10 kilometers. The Virtual Network is a logical overlay on top of Azure’s physical data center network and a Virtual Network does not imply any specific network topology within the data center. For example, VM A and VM B are in the same Virtual Network and subnet, but may be in different racks, rows or even datacenters. They may be separated by feet of fiber optic cable or kilometers of fiber optic cable. This reality may introduce variable latency (few milliseconds difference) between different VMs.

This geographic placement, and thus latency between two VMs, can be influenced through the configuration of Availability Sets and Availability Zones, however, distance between datacenters in a region is region-specific and predominantly influenced by datacenter topology in the region.

### Source NAT port exhaustion

A deployment in Azure can communicate with endpoints outside Azure in the public Internet and/or public IP space. When an instance initiates this outbound connection, Azure dynamically maps the private IP address to a public IP address. After this mapping is created, return traffic for this outbound originated flow can also reach the private IP address where the flow originated.

For every outbound connection, the Azure Load Balancer must maintain this mapping for some period of time. With the multi-tenant nature of Azure, maintaining this mapping for every outbound flow for every VM can be resource-intensive. Therefore, there are limits that are set and based on the configuration of the Azure Virtual Network. Or stated more precisely - an Azure VM can only make a certain number of outbound connections at a given time. When these limits are exhausted, then the Azure VM will be prevented from making any further outbound connections.

This behavior is, however, configurable. For more information about [SNAT and SNAT port exhaustion], see [this article](https://docs.microsoft.com/azure/load-balancer/load-balancer-outbound-connections).

## Measure network performance on Azure

A number of the performance maximums in this article are related to network latency / round-trip time (RTT) between two VMs. This section provides some suggestions for how to test latency/RTT, as well as TCP performance and VM network performance. The TCP/IP & network values discussed above can be tuned and performance tested using the techniques described below. The values of latency, MTU, MSS, and window size can be used in the calculations listed above and theoretical maximums can be compared to actual values observed during testing.

### Measure round-trip time and packet loss

TCP performance relies heavily on RTT and Packet Loss. The simplest way to measure RTT and Packet Loss is using the ping utility available in Windows and Linux. The output of ping will show min/max/avg latency between a source and destination as well as packet loss. Ping uses the ICMP protocol by default. To test TCP RTT, then PsPing can be used. More information on PsPing is available at [this link](https://docs.microsoft.com/sysinternals/downloads/psping).

### Measure actual throughput of a TCP connection

NTttcp is a tool that is used to test TCP performance of a Linux or Windows VM. Various TCP settings can be tweaked and the benefits tested using NTttcp. More information about NTttcp can be found at the links below.

- [Bandwidth/Throughput testing (NTttcp)](https://aka.ms/TestNetworkThroughput)

- [NTttcp Utility](https://gallery.technet.microsoft.com/NTttcp-Version-528-Now-f8b12769)

### Measure actual bandwidth of a virtual machine

Performance testing of different VM types, Accelerated Networking, and so on, can be tested using a tool called Iperf, also available on Linux and Windows. Iperf can use TCP or UDP to test overall network throughput. TCP throughput tests using Iperf are influenced by the factors discussed in this article (latency, RTT, and so on). So, UDP may yield better results for simply testing maximum throughput.

Additional information can be found below:

- [Troubleshooting Expressroute network performance](https://docs.microsoft.com/azure/expressroute/expressroute-troubleshooting-network-performance)

- [How to validate VPN throughput to a virtual network](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-validate-throughput-to-vnet)

### Detect inefficient TCP behaviors

Azure customers may see TCP packets with TCP Flags (SACK, DUP ACK, RETRANSMIT, and FAST RETRANSMIT) in packet captures that may indicate network performance issues. These packets specifically indicate network inefficiencies as a result of packet loss. However, packet loss is not necessarily due to Azure performance issues. Performance issues could be the result of application, operating system, or other issues that might not be directly related to the Azure platform. It’s also important to note that some retransmission or duplicate ACKs on a network is normal – TCP protocols were built to be reliable. And, evidence of these TCP packets in a packet capture does not necessarily indicate a systemic network problem unless they are excessive.

However, it should be stated clearly that these packet types are indications that TCP throughput is not achieving its maximum performance – for reasons discussed in other sections.
