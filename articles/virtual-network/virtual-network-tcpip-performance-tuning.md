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

The purpose of this article is to discuss common TCP/IP performance tuning techniques and their considerations for virtual machines running on Microsoft Azure. It's important first to have a basic understanding of the concepts and then discuss how they can be tuned.

## Common TCP/IP tuning techniques

### MTU, fragmentation, and Large Send Offload (LSO)

#### Explanation of MTU

The maximum transmission unit (MTU) is the largest size frame (packet), specified in bytes, that can be sent over a network interface. The MTU is a configurable setting and the default MTU used on Azure VMs, and the default setting on most network devices globally, is 1500 bytes.

#### Explanation of fragmentation

Fragmentation occurs when a packet is sent that exceeds the MTU of a network interface. The TCP/IP stack will break the packet into smaller pieces (fragments) that conform to the interfaces MTU. Fragmentation occurs at the IP layer and is independent of the underlying protocol (such as TCP). When a 2000-byte packet is sent over a network interface with an MTU of 1500, then it will be broken down into one 1500-byte packet and one 500-byte packet.

Network devices in the path between a source and destination have the option to drop packets that exceed the MTU or to fragment the packet into smaller pieces.

#### The "Don’t Fragment (DF)" bit in an IP packet

The Don’t Fragment bit is a flag in the IP Protocol Header. When the DF bit is set, it indicates that intermediary network devices on the path between the sender and receiver must not fragment the packet. There are many reasons why this bit may be set (see Path Discovery section below for one example). When a network device receives a packet with the Don’t Fragment bit set, and that packet exceeds the devices interface MTU, then the standard behavior is for the device to drop the packet and send a “ICMP Fragmentation Needed” packet back to the original source of the packet.

#### Performance implications of fragmentation

Fragmentation can have negative performance implications. One of the main reasons for performance impact is the CPU/memory impact of fragmentation and reassembly of packets. When a network device needs to fragment a packet, it will have to allocate CPU/memory resources to perform fragmentation. The same must happen when the packet is reassembled. The network device must store all fragments until they're received so it can reassemble them into the original packet. This process of fragmentation/re-assembly can also cause latency due to the fragmentation/re-assembly process.

The other possible negative performance implication of fragmentation is that fragmented packets may arrive out of order. Out of order packets can cause certain types of network devices to drop the out of order packets - which will then require the entire packet to be retransmitted. Typical scenarios for dropping fragments include security devices like network firewalls or when a network device’s receive buffers are exhausted. When a network device's receive buffers are exhausted, a network device is attempting to reassemble a fragmented packet but doesn't have the resources to store and reassume the packet.

Fragmentation can be perceived as a negative operation, but support for fragmentation is necessary for connecting diverse networks over the Internet.

#### Benefits and consequences of modifying the MTU

As a general statement, increasing the MTU can create a more efficient network. Every packet that is transmitted has additional header information that is added to the original packet. More packet means more header overhead, and the network is less efficient as a result.

For example, the Ethernet header size is 14 bytes plus a 4-byte Frame Check Sequence (FCS) to ensure frame consistency. If one 2000-byte packet is sent, then 18 bytes of Ethernet overhead is added on the network. If the packet is fragmented into a 1500-byte packet and a 500-byte packet, then each packet will have 18 bytes of Ethernet header - or 36 bytes. Whereas a single 2000-byte packet would only have an Ethernet header of 18 bytes.

It's important to note that increasing the MTU in itself will not necessarily create a more efficient network. If an application sends only 500-byte packets, then the same header overhead will exist whether the MTU is 1500 bytes or 9000 bytes. In order for the network to be more efficient, then it must also use larger packet sizes that are relative to the MTU.

#### Azure and VM MTU

The default MTU for Azure VMs is 1500 bytes. The Azure Virtual Network stack will attempt to fragment a packet at 1400 bytes. However, the Azure Virtual Network stack will allow packets up to 2006 bytes when the "Don't Fragment" bit is set in the IP Header.

It's important to note that this fragmentation doesn't imply the Azure Virtual Network stack is inherently inefficient because it fragments packets at 1400 bytes while VMs have an MTU of 1500. The reality is that a large percentage of network packets is much smaller than 1400 bytes or 1500 bytes.

#### Azure and fragmentation

Azure's Virtual Network stack today is configured to drop "Out of Order Fragments" - meaning fragmented packets that don't arrive in their original fragmented order. These packets are dropped primarily due to a network security vulnerability announced in November 2018 called FragmentStack.

FragmentSmack is a defect in the way the Linux kernel handled reassembly of fragmented IPv4 and IPv6 packets. A remote attacker could use this flaw to trigger expensive fragment reassembly operations, which lead to increased CPU and a denial of service on the target system.

#### Tune the MTU

Azure VMs support a configurable MTU just as any other operating system. However, the fragmentation that occurs within Azure, and is detailed above, should be considered when configuring the MTU.

Azure doesn't encourage customers to increase their VM MTU. This discussion is intended to explain in detail how Azure implements MTU and performs fragmentation today.

> [!IMPORTANT]
>Increasing MTU has not shown to improve performance and could have a negative effect on application performance.
>
>

#### Large Send Offload (LSO)

Large Send Offload (LSO) can improve network performance by offloading the segmentation of packets to the Ethernet Adapter. With LSO enabled, the TCP/IP stack will create a large TCP packet and then send to the Ethernet adapter for segmentation before forwarding it. The benefit of LSO is that it can free the CPU from segmenting packets into packet sizes that conform to the MTU and offload that processing to the Ethernet interface where it is performed in hardware. More information about the benefits of LSO can be found in [Performance in Microsoft Network Adapter documentation](https://docs.microsoft.com/windows-hardware/drivers/network/performance-in-network-adapters#supporting-large-send-offload-lso).

When LSO is enabled, Azure customers may see large frame sizes when performing packet captures. These large frame sizes may lead some customers to believe that fragmentation or a jumbo MTU is being used when it’s not. With LSO, the ethernet adapter can advertise a larger MSS to the TCP/IP stack in order to create a larger TCP packet. This entire non-segmented frame is then forwarded to the Ethernet adapter and would be visible in a packet capture performed on the VM. However, the packet will be broken down into many smaller frames by the Ethernet adapter according to the Ethernet adapter’s MTU.

### TCP/MSS window scaling and PMTUD

#### Explanation of TCP MSS

TCP Maximum Segment Size (MSS) is a setting intended to set the maximum TCP segment size as to avoid fragmentation of TCP packets. Operating systems will typically set MSS as MSS = MTU - IP & TCP Header size (20 bytes each or 40 bytes total). So an interface with a MTU of 1500 will have an MSS of 1460. The MSS, however, is configurable.

This setting is agreed in the TCP three-way handshake when a TCP session is set up between a source and destination. Both sides send an MSS value and the lower of the two is used for the TCP connection.

Intermediary network devices, like VPN Gateways, including Azure VPN Gateway, have the ability to adjust the MTU independent of the source and destination to ensure optimal network performance. So, it should be noted that the MTU of the source and destination alone is not the sole factors in the actual MSS value.

#### Explanation of Path MTU Discovery (PMTUD)

While MSS is negotiated, it may not indicate the actual MSS that can be used as other network devices in the path between source and destination may have a lower MTU value than the source and destination. In this case, the device whose MTU is smaller than the packet will drop the packet, and send back an Internet Control Message Protocol (ICMP) Fragmentation Needed (Type 3, Code 4) message containing its MTU. This ICMP message allows the source host to reduce its Path MTU appropriately. The process is called Path MTU discovery.

The process of PMTUD is inherently inefficient and has implications to network performance. When packets are sent that exceed a network paths MTU, then those packets must be retransmitted with a lower MSS. If the sender does not receive the ICMP Fragmentation Needed packet, perhaps due to a network firewall in the path (commonly referred to as PMTUD blackhole), then the sender does not know it needs to lower the MSS and will continuously retransmit the packet. For this reason, we don’t recommend increasing the Azure VM MTU.

#### VPN considerations with MTU

Customers that use VMs that perform encapsulation (such as IPSec VPNs) can have additional implications to packet size and MTU. VPNs add additional headers will be added to the original packet thus increasing packet size and requiring a smaller MSS.

The current recommendation for Azure is to set TCP MSS clamping to 1350 bytes and tunnel interface MTU to 1400. More information can be found at the [VPN devices and IPSec/IKE parameters page](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpn-devices).

### Latency, round-trip time, and TCP window scaling

#### Latency and round-trip time

Network latency is governed by the speed of light over a fiber optic network. The reality is, network throughput of TCP is also effectively governed (practical maximums) because of the Round-Trip Time (RTT) between two network devices.

| | | | |
|-|-|-|-|
|Route|Distance|One-way time|Round-trip time (RTT)|
|New York to San Francisco|4,148 km|21 ms|42 ms|
|New York to London|5,585 km|28 ms|56 ms|
|New York to Sydney|15,993 km|80 ms|160 ms|

This table shows the straight-line distance between two locations, however, in networks, the distance is typically longer than the straight-line distance. A simple formula to calculate MINIMUM RTT as governed by the speed of light is: minimum RTT = 2 * (Distance kilometers / Speed of propagation).

A standard value of 200 can be used for speed of propagation -  value is the distance in meters light travels in 1 millisecond.

In the example New York to San Francisco, it is 4,148-km straight-line distance. Minimum RTT = 2 * (4,148 / 20). The output of the equation will be in milliseconds.

As the physical distance between two locations is a fixed reality, if maximum network performance is required, then the most logical option is to select destinations with the smallest distance between them. Secondarily, design decisions within the virtual network can be made to optimize the path of traffic and reduce latency. These virtual network considerations are described in the Network Design Considerations section below.

#### Latency and round-trip time effects on TCP

Round trip time (RTT) has a direct effect on maximum TCP throughput. The TCP protocol has a concept of Window Size. The Window Size is the maximum amount of traffic that can be sent over a TCP connection before the sender must receive acknowledgement from the receiver. If the TCP MSS is set to 1460, and the TCP Window Size is set to 65535 then the sender can send 45 packets before it must receive acknowledgement from the receiver. If acknowledgement is not received then the sender will retransmit. In this example, TCP Window Size / TCP MSS = packets sent. Or 65535 / 1460 is rounded up to 45.

This "waiting for acknowledgement" state, as a mechanism to create a reliable delivery of data, is what effectively causes RTT to affect TCP throughput. The longer the sender waits for acknowledgement, the longer it must also wait before sending more data.

The formula for calculating maximum throughput of a single TCP connection is as follows:
Window Size / (RTT latency in milliseconds / 1000) = Maximum bytes/second. The table below is formatted in Megabytes for readability and shows the maximum megabyte/per second throughput of a single TCP connection.

| | | | |
|-|-|-|-|
|TCP Window Size in Bytes|RTT Latency<br/>in Milliseconds|Maximum<br/>Megabytes per Second Throughput|Maximum<br/> Megabit per Second Throughput|
|65535|1|65.54|524.29|
|65535|30|2.18|17.48|
|65535|60|1.09|8.74|
|65535|90|.73|5.83|
|65535|120|.55|4.37|

If there is any packet loss, then it will reduce the maximum throughput of a TCP connection while the sender retransmits data it has already sent.

#### Explanation of TCP window scaling

TCP Window Scaling is a concept that dynamically increases the TCP Window Size allowing more data to be sent before an acknowledgement is required. In our previous example, 45 packets would be sent before an acknowledgement was required. If the number of packets that are sent before an acknowledgement is increased, then the TCP maximum throughput is also increased by reducing the number of times a sender is waiting for acknowledgement.

TCP throughput is demonstrated in a simple table below:

| | | | |
|-|-|-|-|
|TCP Window Size<br/>in Bytes|RTT Latency in  Milliseconds|Maximum<br/>Megabytes per Second Throughput|Maximum<br/> Megabit per Second Throughput|
|65535|30|2.18|17.48|
|131,070|30|4.37|34.95|
|262,140|30|8.74|69.91|
|524,280|30|17.48|139.81|

However, the TCP header value for TCP Window Size is only 2 bytes long, which means the maximum value for a receive window is 65535. In order to increase the maximum window size, a TCP Window Scale Factor was introduced.

The scale factor is also a setting that can be configured in an operating system. The formula for calculating the TCP Window Size using scale factors is as follows: TCP Window Size = TCP Window Size in Bytes \* (2^Scale Factor). If the Window Scale Factor is 3 and Window Size of 65535, calculation is as follows: 65535 \* (2^3) = 262,140 bytes. A Scale Factor of 14 results in a TCP Window Size of 14 (the maximum offset allowed), then the TCP Window Size will be 1,073,725,440 bytes (8.5 gigabits).

#### Support for TCP window scaling

Windows has the ability to set different scaling factors on a per connection type basis - there are several classes of connections (datacenter, internet, and so on). You can see the window scaling connection classification with the Get-NetTCPConnection powershell command.

```powershell
Get-NetTCPConnection
```

You can see the values of each class with the Get-NetTCPSetting powershell command.

```powershell
Get-NetTCPSetting
```

The initial TCP Window Size and TCP Scaling Factor can be set in Windows via the Set-NetTCPSetting powershell command. More information can be found at the [Set-NetTCPSetting page](https://docs.microsoft.com/powershell/module/nettcpip/set-nettcpsetting?view=win10-ps)

```powershell
Set-NetTCPSetting
```

The effective TCP settings for AutoTuningLevel are as follows.

| | | | |
|-|-|-|-|
|AutoTuningLevel|Scaling factor|Scaling multiplier|Formula to<br/>calculate maximum window size|
|Disabled|None|None|Window Size|
|Restricted|4|2^4|Window Size * (2^4)|
|Highly-Restricted|2|2^2|Window Size * (2^2)|
|Normal|8|2^8|Window Size * (2^8)|
|Experimental|14|2^14|Window Size * (2^14)|

While these settings are the most likely to affect TCP performance, it should be noted that many other factors across the Internet, outside the control of Azure, can also affect TCP performance.

#### Increase MTU size

A logical question to ask is "can increasing the MTU increase TCP performance as a larger MTU means a larger MSS"? The simple answer is – probably not. As discussed, There are pros and cons to packet size that are applicable beyond just TCP traffic. As discussed above, the most important factors affecting TCP throughput performance is TCP Window Size, packet loss, and RTT.

> [!IMPORTANT]
> Azure does not recommend that Azure customers modify the default MTU value on Virtual Machines.
>
>

### Accelerated Networking and Receive Side Scaling

#### Accelerated Networking

Virtual Machine network functions have historically been CPU intensive on both the VM Guest and the Hypervisor/Host. Every packet that transits through the host is processed in software by the host CPU - including all the Virtual Network encapsulation/de-capsulation. So, the more traffic that goes through the host, then the higher the CPU load. And, if the host CPU is busy doing other operations, then that will also affect network throughput and latency. This issue has been addressed through Accelerated Networking.

Accelerated Networking provides consistent ultra-low network latency via Azure's in-house programmable hardware and technologies such as SR-IOV. By moving much of Azure's software-defined networking stack off the CPUs and into FPGA-based SmartNICs, compute cycles are reclaimed by end-user applications, putting less load on the VM, decreasing jitter and inconsistency in latency. In other words, performance can be more deterministic.

Accelerated Networking achieves performance improvements by allowing the Guest VM to bypass the host and establish a datapath directly with a host’s SmartNIC. Benefits of Accelerated Networking are:

- **Lower Latency / Higher packets per second (pps)**: Removing the virtual switch from the datapath removes the time packets spend in the host for policy processing and increases the number of packets that can be processed inside the VM.

- **Reduced jitter**: Virtual switch processing depends on the amount of policy that needs to be applied and the workload of the CPU that is doing the processing. Offloading the policy enforcement to the hardware removes that variability by delivering packets directly to the VM, removing the host to VM communication and all software interrupts and context switches.

- **Decreased CPU utilization**: Bypassing the virtual switch in the host leads to less CPU utilization for processing network traffic.

Accelerated Networking must be explicitly enabled on a per VM basis. Instructions for enabling Accelerated Networking on a VM are available at the [Create a Linux virtual machine with Accelerated Networking page](https://docs.microsoft.com/azure/virtual-network/create-vm-accelerated-networking-cli).

#### Receive Side Scaling (RSS)

Receive Side Scaling is a network driver technology that distributes the receiving of network traffic more efficiently by distributing receive processing across multiple CPUs in a multi-processor system. In simple terms, RSS allows a system to process a greater amount of received traffic because it uses all available CPUs instead of just one. A more technical discussion of RSS can be found at the [Introduction to Receive Side Scaling page](https://docs.microsoft.com/windows-hardware/drivers/network/introduction-to-receive-side-scaling).

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
