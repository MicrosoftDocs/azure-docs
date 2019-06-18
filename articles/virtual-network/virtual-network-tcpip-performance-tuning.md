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
ms.date: 04/02/2019
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

Network devices in the path between a source and destination can either drop packets that exceed the MTU or fragment the packet into smaller pieces.

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

The default MTU for Azure VMs is 1,500 bytes. The Azure Virtual Network stack will attempt to fragment a packet at 1,400 bytes.

Note that the Virtual Network stack isn't inherently inefficient because it fragments packets at 1,400 bytes even though VMs have an MTU of 1,500. A large percentage of network packets are much smaller than 1,400 or 1,500 bytes.

#### Azure and fragmentation

Virtual Network stack is set up to drop "out of order fragments," that is, fragmented packets that don't arrive in their original fragmented order. These packets are dropped mainly because of a network security vulnerability announced in November 2018 called FragmentSmack.

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

`Minimum RTT = 2 * (4,148 / 200)`

The output of the equation is in milliseconds.

If you want to get the best network performance, the logical option is to select destinations with the shortest distance between them. You should also design your virtual network to optimize the path of traffic and reduce latency. For more information, see the "Network design considerations" section of this article.

#### Latency and round-trip time effects on TCP

Round-trip time has a direct effect on maximum TCP throughput. In TCP protocol, *window size* is the maximum amount of traffic that can be sent over a TCP connection before the sender needs to receive acknowledgement from the receiver. If the TCP MSS is set to 1,460 and the TCP window size is set to 65,535, the sender can send 45 packets before it has to receive acknowledgement from the receiver. If the sender doesn't get acknowledgement, it will retransmit the data. Here's the formula:

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

Virtual machine network functions have historically been CPU intensive on both the guest VM and the hypervisor/host. Every packet that transits through the host is processed in software by the host CPU, including all virtual network encapsulation and decapsulation. So the more traffic that goes through the host, the higher the CPU load. And if the host CPU is busy with other operations, that will also affect network throughput and latency. Azure addresses this issue with accelerated networking.

Accelerated networking provides consistent ultralow network latency via the in-house programmable hardware of Azure and technologies like SR-IOV. Accelerated networking moves much of the Azure software-defined networking stack off the CPUs and into FPGA-based SmartNICs. This change enables end-user applications to reclaim compute cycles, which puts less load on the VM, decreasing jitter and inconsistency in latency. In other words, performance can be more deterministic.

Accelerated networking improves performance by allowing the guest VM to bypass the host and establish a datapath directly with a host’s SmartNIC. Here are some benefits of accelerated networking:

- **Lower latency / higher packets per second (pps)**: Removing the virtual switch from the datapath eliminates the time packets spend in the host for policy processing and increases the number of packets that can be processed in the VM.

- **Reduced jitter**: Virtual switch processing depends on the amount of policy that needs to be applied and the workload of the CPU that's doing the processing. Offloading the policy enforcement to the hardware removes that variability by delivering packets directly to the VM, eliminating the host-to-VM communication and all software interrupts and context switches.

- **Decreased CPU utilization**: Bypassing the virtual switch in the host leads to less CPU utilization for processing network traffic.

To use accelerated networking, you need to explicitly enable it on each applicable VM. See [Create a Linux virtual machine with Accelerated Networking](https://docs.microsoft.com/azure/virtual-network/create-vm-accelerated-networking-cli) for instructions.

#### Receive side scaling

Receive side scaling (RSS) is a network driver technology that distributes the receiving of network traffic more efficiently by distributing receive processing across multiple CPUs in a multiprocessor system. In simple terms, RSS allows a system to process more received traffic because it uses all available CPUs instead of just one. For a more technical discussion of RSS, see [Introduction to receive side scaling](https://docs.microsoft.com/windows-hardware/drivers/network/introduction-to-receive-side-scaling).

To get the best performance when accelerated networking is enabled on a VM, you need to enable RSS. RSS can also provide benefits on VMs that don’t use accelerated networking. For an overview of how to determine if RSS is enabled and how to enable it, see [Optimize network throughput for Azure virtual machines](https://aka.ms/FastVM).

### TCP TIME_WAIT and TIME_WAIT assassination

TCP TIME_WAIT is another common setting that affects network and application performance. On busy VMs that are opening and closing many sockets, either as clients or as servers (Source IP:Source Port + Destination IP:Destination Port), during the normal operation of TCP, a given socket can end up in a TIME_WAIT state for a long time. The TIME_WAIT state is meant to allow any additional data to be delivered on a socket before closing it. So TCP/IP stacks generally prevent the reuse of a socket by silently dropping the client's TCP SYN packet.

The amount of time a socket is in TIME_WAIT is configurable. It could range from 30 seconds to 240 seconds. Sockets are a finite resource, and the number of sockets that can be used at any given time is configurable. (The number of available sockets is typically about 30,000.) If the available sockets are consumed, or if clients and servers have mismatched TIME_WAIT settings, and a VM tries to reuse a socket in a TIME_WAIT state, new connections will fail as TCP SYN packets are silently dropped.

The value for port range for outbound sockets is usually configurable within the TCP/IP stack of an operating system. The same thing is true for TCP TIME_WAIT settings and socket reuse. Changing these numbers can potentially improve scalability. But, depending on the situation, these changes could cause interoperability issues. You should be careful if you change these values.

You can use TIME_WAIT assassination to address this scaling limitation. TIME_WAIT assassination allows a socket to be reused in certain situations, like when the sequence number in the IP packet of the new connection exceeds the sequence number of the last packet from the previous connection. In this case, the operating system will allow the new connection to be established (it will accept the new SYN/ACK) and force close the previous connection that was in a TIME_WAIT state. This capability is supported on Windows VMs in Azure. To learn about support in other VMs, check with the OS vendor.

To learn about configuring TCP TIME_WAIT settings and source port range, see [Settings that can be modified to improve network performance](https://docs.microsoft.com/biztalk/technical-guides/settings-that-can-be-modified-to-improve-network-performance).

## Virtual network factors that can affect performance

### VM maximum outbound throughput

Azure provides a variety of VM sizes and types, each with a different mix of performance capabilities. One of these capabilities is network throughput (or bandwidth), which is measured in megabits per second (Mbps). Because virtual machines are hosted on shared hardware, the network capacity needs to be shared fairly among the virtual machines using the same hardware. Larger virtual machines are allocated more bandwidth than smaller virtual machines.

The network bandwidth allocated to each virtual machine is metered on egress (outbound) traffic from the virtual machine. All network traffic leaving the virtual machine is counted toward the allocated limit, regardless of destination. For example, if a virtual machine has a 1,000-Mbps limit, that limit applies whether the outbound traffic is destined for another virtual machine in the same virtual network or one outside of Azure.

Ingress is not metered or limited directly. But there are other factors, like CPU and storage limits, that can affect a virtual machine’s ability to process incoming data.

Accelerated networking is designed to improve network performance, including latency, throughput, and CPU utilization. Accelerated networking can improve a virtual machine’s throughput, but it can do that only up to the virtual machine’s allocated bandwidth.

Azure virtual machines have at least one network interface attached to them. They might have several. The bandwidth allocated to a virtual machine is the sum of all outbound traffic across all network interfaces attached to the machine. In other words, the bandwidth is allocated on a per-virtual machine basis, regardless of how many network interfaces are attached to the machine.

Expected outbound throughput and the number of network interfaces supported by each VM size are detailed in [Sizes for Windows virtual machines in Azure](https://docs.microsoft.com/azure/virtual-machines/windows/sizes?toc=%2fazure%2fvirtual-network%2ftoc.json). To see maximum throughput, select a type, like **General purpose**, and then find the section about the size series on the resulting page (for example, "Dv2-series"). For each series, there's a table that provides networking specifications in the last column, which is titled "Max NICs / Expected network bandwidth (Mbps)."

The throughput limit applies to the virtual machine. Throughput is not affected by these factors:

- **Number of network interfaces**: The bandwidth limit applies to the sum of all outbound traffic from the virtual machine.

- **Accelerated networking**: Though this feature can be helpful in achieving the published limit, it doesn't change the limit.

- **Traffic destination**: All destinations count toward the outbound limit.

- **Protocol**: All outbound traffic over all protocols counts towards the limit.

For more information, see [Virtual machine network bandwidth](https://aka.ms/AzureBandwidth).

### Internet performance considerations

As discussed throughout this article, factors on the internet and outside the control of Azure can affect network performance. Here are some of those factors:

- **Latency**: The round-trip time between two destinations can be affected by issues on intermediate networks, by traffic that doesn't take the "shortest" distance path, and by suboptimal peering paths.

- **Packet loss**: Packet loss can be caused by network congestion, physical path issues, and underperforming network devices.

- **MTU size/Fragmentation**: Fragmentation along the path can lead to delays in data arrival or in packets arriving out of order, which can affect the delivery of packets.

Traceroute is a good tool for measuring network performance characteristics (like packet loss and latency) along every network path between a source device and a destination device.

### Network design considerations

Along with the considerations discussed earlier in this article, the topology of a virtual network can affect the network's performance. For example, a hub-and-spoke design that backhauls traffic globally to a single-hub virtual network will introduce network latency, which will affect overall network performance.

The number of network devices that network traffic passes through can also affect overall latency. For example, in a hub-and-spoke design, if traffic passes through a spoke network virtual appliance and a hub virtual appliance before transiting to the internet, the network virtual appliances can introduce latency.

### Azure regions, virtual networks, and latency

Azure regions are made up of multiple datacenters that exist within a general geographic area. These datacenters might not be physically next to each other. In some cases they're separated by as much as 10 kilometers. The virtual network is a logical overlay on top of the Azure physical datacenter network. A virtual network doesn't imply any specific network topology within the datacenter.

For example, two VMs that are in the same virtual network and subnet might be in different racks, rows, or even datacenters. They could be separated by feet of fiber optic cable or by kilometers of fiber optic cable. This variation could introduce variable latency (a few milliseconds difference) between different VMs.

The geographic placement of VMs, and the potential resulting latency between two VMs, can be influenced by the configuration of availability sets and Availability Zones. But the distance between datacenters in a region is region-specific and primarily influenced by datacenter topology in the region.

### Source NAT port exhaustion

A deployment in Azure can communicate with endpoints outside of Azure on the public internet and/or in the public IP space. When an instance initiates an outbound connection, Azure dynamically maps the private IP address to a public IP address. After Azure creates this mapping, return traffic for the outbound originated flow can also reach the private IP address where the flow originated.

For every outbound connection, the Azure Load Balancer needs to maintain this mapping for some period of time. With the multitenant nature of Azure, maintaining this mapping for every outbound flow for every VM can be resource intensive. So there are limits that are set and based on the configuration of the Azure Virtual Network. Or, to say that more precisely, an Azure VM can only make a certain number of outbound connections at a given time. When these limits are reached, the VM won't be able to make more outbound connections.

But this behavior is configurable. For more information about SNAT and SNAT port exhaustion, see [this article](https://docs.microsoft.com/azure/load-balancer/load-balancer-outbound-connections).

## Measure network performance on Azure

A number of the performance maximums in this article are related to the network latency / round-trip time (RTT) between two VMs. This section provides some suggestions for how to test latency/RTT and how to test TCP performance and VM network performance. You can tune and performance test the TCP/IP and network values discussed earlier by using the techniques described in this section. You can plug latency, MTU, MSS, and window size values into the calculations provided earlier and compare theoretical maximums to actual values that you observe during testing.

### Measure round-trip time and packet loss

TCP performance relies heavily on RTT and packet Loss. The PING utility available in Windows and Linux provides the easiest way to measure RTT and packet loss. The output of PING will show the minimum/maximum/average latency between a source and destination. It will also show packet loss. PING uses the ICMP protocol by default. You can use PsPing to test TCP RTT. For more information, see [PsPing](https://docs.microsoft.com/sysinternals/downloads/psping).

### Measure actual throughput of a TCP connection

NTttcp is a tool for testing the TCP performance of a Linux or Windows VM. You can change various TCP settings and then test the benefits by using NTttcp. For more information, see these resources:

- [Bandwidth/Throughput testing (NTttcp)](https://aka.ms/TestNetworkThroughput)

- [NTttcp Utility](https://gallery.technet.microsoft.com/NTttcp-Version-528-Now-f8b12769)

### Measure actual bandwidth of a virtual machine

You can test the performance of different VM types, accelerated networking, and so on, by using a tool called iPerf. iPerf is also available on Linux and Windows. iPerf can use TCP or UDP to test overall network throughput. iPerf TCP throughput tests are influenced by the factors discussed in this article (like latency and RTT). So UDP might yield better results if you just want to test maximum throughput.

For more information, see these articles:

- [Troubleshooting Expressroute network performance](https://docs.microsoft.com/azure/expressroute/expressroute-troubleshooting-network-performance)

- [How to validate VPN throughput to a virtual network](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-validate-throughput-to-vnet)

### Detect inefficient TCP behaviors

In packet captures, Azure customers might see TCP packets with TCP flags (SACK, DUP ACK, RETRANSMIT, and FAST RETRANSMIT) that could indicate network performance problems. These packets specifically indicate network inefficiencies that result from packet loss. But packet loss isn't necessarily caused by Azure performance problems. Performance problems could be the result of application problems, operating system problems, or other problems that might not be directly related to the Azure platform.

Also, keep in mind that some retransmission and duplicate ACKs are normal on a network. TCP protocols were built to be reliable. Evidence of these TCP packets in a packet capture doesn't necessarily indicate a systemic network problem, unless they're excessive.

Still, these packet types are indications that TCP throughput isn't achieving its maximum performance, for reasons discussed in other sections of this article.

## Next steps

Now that you've learned about TCP/IP performance tuning for Azure VMs, you might want to read about other considerations for [planning virtual networks](https://docs.microsoft.com/azure/virtual-network/virtual-network-vnet-plan-design-arm) or [learn more about connecting and configuring virtual networks](https://docs.microsoft.com/azure/virtual-network/).
