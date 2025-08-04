---
title: TCP/IP performance tuning for Azure VMs
description: Learn various common TCP/IP performance tuning techniques and their relationship to Azure VMs.
services: virtual-network
author: asudbring
manager: kumudD
ms.service: azure-virtual-network
ms.topic: how-to
ms.date: 04/21/2025
ms.author: allensu
# Customer intent: "As a network administrator managing Azure VMs, I want to implement TCP/IP performance tuning techniques, so that I can optimize network throughput and minimize latency for my virtual machines."
---

# TCP/IP performance tuning for Azure VMs

This article discusses common TCP/IP performance tuning techniques and some things to consider when you use them for virtual machines running on Azure. It provides a basic overview of the techniques and explored how virtual machines can be tuned.

## Common TCP/IP tuning techniques

### MTU, fragmentation, and large send offload

#### MTU

The maximum transmission unit (MTU) is the largest size frame (packet plus network access headers) specified in bytes that can be sent over a network interface. The MTU is a configurable setting. The default MTU used on Azure VMs, and the default setting on most network devices globally, is 1,500 bytes.

#### Fragmentation

Fragmentation occurs when a packet is sent that exceeds the MTU of a network interface. The TCP/IP stack breaks the packet into smaller pieces (fragments) that conform to the interface's MTU. Fragmentation occurs at the IP layer and is independent of the underlying protocol (such as TCP). When a 2,000-byte packet is sent over a network interface with an MTU of 1,500, the packet is broken down into one 1,500-byte packet and one 500-byte packet.

Network devices in the path between a source and destination can either drop packets that exceed the MTU or fragment the packet into smaller pieces.

#### The Don’t Fragment bit in an IP packet

The Don’t Fragment (DF) bit is a flag in the IP protocol header. The DF bit indicates that network devices on the path between the sender and receiver must not fragment the packet. This bit could be set for many reasons. (See the "Path MTU Discovery" section of this article for one example.) When a network device receives a packet with the Don’t Fragment bit set, and that packet exceeds the device's interface MTU, the standard behavior is for the device to drop the packet. The device sends an ICMP Fragmentation Needed message back to the original source of the packet.

#### Performance implications of fragmentation

Fragmentation can have negative performance implications. One of the main reasons for the effect on performance is the CPU/memory effect of the fragmentation and reassembly of packets. When a network device needs to fragment a packet, it has to allocate CPU/memory resources to perform fragmentation.

The same thing happens when the packet is reassembled. The network device must store all the fragments until they're received so it can reassemble them into the original packet.

#### Azure and fragmentation

Azure doesn't process fragmented packets with Accelerated Networking. When a VM receives a fragmented packet, the nonaccelerated path processes it. As a result, fragmented packets miss the benefits of Accelerated Networking, such as lower latency, reduced jitter, and higher packets per second. For this reason, we recommend avoiding fragmentation if possible.

Azure, by default, drops fragmented packets that arrive at the VM out of order, meaning the packets don't match the transmission sequence from the source endpoint. This issue can occur when packets travel over the internet or other large WANs.

#### Tune the MTU

You can improve internal Virtual Network throughput by increasing the MTU for your VM's traffic. However, if the VM communicates with destinations outside the Virtual Network that have a different MTU, fragmentation might occur and reduce performance.

For more information about setting the MTU on Azure VMs, see [Configure Maximum Transmission Unit (MTU) for virtual machines in Azure](./how-to-virtual-machine-mtu.md).

#### Large send offload

Large send offload (LSO) can improve network performance by offloading the segmentation of packets to the ethernet adapter. When LSO is enabled, the TCP/IP stack creates a large TCP packet and sends it to the ethernet adapter for segmentation before forwarding it. The benefit of LSO frees the CPU from segmenting packets into sizes that conform to the MTU and offload that processing to the ethernet interface hardware. To learn more about the benefits of LSO, see [Supporting large send offload](/windows-hardware/drivers/network/performance-in-network-adapters#supporting-large-send-offload-lso).

When LSO is enabled, Azure customers might notice large frame sizes during packet captures. These large frame sizes might cause some customers to assume fragmentation is occurring or that a large MTU is being used when it’s not. With LSO, the ethernet adapter can advertise a larger maximum segment size (MSS) to the TCP/IP stack to create a larger TCP packet. The ethernet adapter then breaks this entire nonsegmented frame into many smaller frames according to its MTU, which are visible in a packet capture performed on the VM.

### TCP MSS window scaling and PMTUD

#### TCP maximum segment size

TCP maximum segment size (MSS) is a setting that limits the size of TCP segments, which avoids fragmentation of TCP packets. Operating systems typically use this formula to set MSS:

`MSS = MTU - (IP header size + TCP header size)`

The IP header and the TCP header are 20 bytes each, or 40 bytes total. An interface with an MTU of 1,500 has an MSS of 1,460. The MSS is configurable.

This setting is agreed to in the TCP three-way handshake when a TCP session is set up between a source and a destination. Both sides send an MSS value, and the lower of the two is used for the TCP connection.

Keep in mind that the MTUs of the source and destination aren't the only factors that determine the MSS value. Intermediary network devices, like VPN gateways, including Azure VPN Gateway, can adjust the MTU independently of the source and destination to ensure optimal network performance.

#### Path MTU Discovery

MSS is negotiated, but it might not indicate the actual MSS that can be used. Other network devices in the path between the source and the destination might have a lower MTU value than the source and destination. In this case, the device whose MTU is smaller than the packet drops the packet. The device sends back an ICMP Fragmentation Needed (Type 3, Code 4) message that contains its MTU. This ICMP message allows the source host to reduce its Path MTU appropriately. The process is called Path MTU Discovery (PMTUD).

The PMTUD process reduces network performance due to its inefficiency. When a network path's MTU is exceeded, packets must be retransmitted with a lower MSS. If a network firewall blocks the ICMP Fragmentation Needed message, the sender remains unaware of the need to lower the MSS and repeatedly retransmits the packet. For this reason, we advise against increasing the Azure VM MTU.

#### VPN and MTU

If you use VMs that perform encapsulation (like IPsec VPNs), there are some other considerations regarding packet size and MTU. VPNs add more headers to packets. The added headers increase the packet size and require a smaller MSS.

For Azure, we recommend that you set TCP MSS clamping to 1,350 bytes and tunnel interface MTU to 1,400. For more information, see the [VPN devices and IPsec/IKE parameters page](../vpn-gateway/vpn-gateway-about-vpn-devices.md).

### Latency, round-trip time, and TCP window scaling

#### Latency and round-trip time

The speed of light determines network latency over a fiber optic network. The round-trip time (RTT) between two network devices governs TCP network throughput.

| Route | Distance | One-way time | RTT |
| ----- | -------- | ------------ | --- |
|New York to San Francisco|4,148 km|21 ms|42 ms|
|New York to London|5,585 km|28 ms|56 ms|
|New York to Sydney|15,993 km|80 ms|160 ms|

This table shows the straight-line distance between two locations. In networks, the distance is typically longer than the straight-line distance. Here's a simple formula to calculate minimum RTT as governed by the speed of light:

`minimum RTT = 2 * (Distance in kilometers / Speed of propagation)`

You can use 200 for the speed of propagation. The speed of propagation is the distance, in kilometers, that light travels in 1 millisecond.

Let's take New York to San Francisco as an example. The straight-line distance is 4,148 km. Entering that value into the equation results in the following equation:

`Minimum RTT = 2 * (4,148 / 200)`

The output of the equation is in milliseconds.

If you want to get the best network performance, the logical option is to select destinations with the shortest distance between them. You should also design your virtual network to optimize the path of traffic and reduce latency. For more information, see the "Network design considerations" section of this article.

#### Latency and round-trip time effects on TCP

Round-trip time has a direct effect on maximum TCP throughput. In TCP protocol, *window size* is the maximum amount of traffic that can be sent over a TCP connection before the sender needs to receive acknowledgment from the receiver. If the TCP MSS is set to 1,460 and the TCP window size is set to 65,535, the sender can send 45 packets before acknowledgment from the receiver. If the sender doesn't get acknowledgment, it retransmits the data. Here's the formula:

`TCP window size / TCP MSS = packets sent`

In this example, 65,535 / 1,460 is rounded up to 45.

This "waiting for acknowledgment" state, a mechanism to ensure reliable delivery of data, is what causes RTT to affect TCP throughput. The longer the sender waits for acknowledgment, the longer it needs to wait before sending more data.

Here's the formula for calculating the maximum throughput of a single TCP connection:

`Window size / (RTT latency in milliseconds / 1,000) = maximum bytes/second`

This table shows the maximum megabytes/per second throughput of a single TCP connection. (For readability, megabytes is used for the unit of measure.)

| TCP window size (bytes) | RTT latency (ms) | Maximum megabyte/second throughput | Maximum megabit/second throughput |
| ----------------------- | ---------------- | ---------------------------------- | --------------------------------- |
|65,535|1|65.54|524.29|
|65,535|30|2.18|17.48|
|65,535|60|1.09|8.74|
|65,535|90|0.73|5.83|
|65,535|120|0.55|4.37|

If packets are lost, the maximum throughput of a TCP connection is reduced while the sender retransmits data it sent.

#### TCP window scaling

TCP window scaling is a technique that dynamically increases the TCP window size to allow more data to be sent before an acknowledgment is required. In the previous example, 45 packets would be sent before an acknowledgment was required. If you increase the number of packets that can be sent before an acknowledgment is needed, you're reducing the number of times a sender is waiting for acknowledgment.

This table illustrates those relationships:

| TCP window size (bytes) | RTT latency (ms) | Maximum megabyte/second throughput | Maximum megabit/second throughput |
| ----------------------- | ---------------- | ---------------------------------- | --------------------------------- |
|65,535|30|2.18|17.48|
|131,070|30|4.37|34.95|
|262,140|30|8.74|69.91|
|524,280|30|17.48|139.81|

But the TCP header value for TCP window size is only 2 bytes long, which means the maximum value for a receive window is 65,535. To increase the maximum window size, a TCP window scale factor was introduced.

The scale factor is also a setting that you can configure in an operating system. Here's the formula for calculating the TCP window size by using scale factors:

`TCP window size = TCP window size in bytes * (2^scale factor)`

Here's the calculation for a window scale factor of 3 and a window size of 65,535:

`65,535 * (2^3) = 524,280 bytes`

A scale factor of 14 results in a TCP window size of 14 (the maximum offset allowed). The TCP window size is 1,073,725,440 bytes (8.5 gigabits).

#### Support for TCP window scaling

Windows can set different scaling factors for different connection types. (Classes of connections include datacenter, internet, and so on.) You use the `Get-NetTCPConnection` PowerShell command to view the window scaling connection type:

```powershell
Get-NetTCPConnection
```

You can use the `Get-NetTCPSetting` PowerShell command  to view the values of each class:

```powershell
Get-NetTCPSetting
```

You can set the initial TCP window size and TCP scaling factor in Windows by using the `Set-NetTCPSetting` PowerShell command. For more information, see  [Set-NetTCPSetting](/powershell/module/nettcpip/set-nettcpsetting).

```powershell
Set-NetTCPSetting
```

The following values are the effective TCP settings for `AutoTuningLevel`:

| AutoTuningLevel | Scaling factor | Scaling multiplier | Formula to<br/>calculate maximum window size |
| --------------- | -------------- | ------------------ | -------------------------------------------- |
|Disabled|None|None|Window size|
|Restricted|4|2^4|Window size * (2^4)|
|Highly restricted|2|2^2|Window size * (2^2)|
|Normal|8|2^8|Window size * (2^8)|
|Experimental|14|2^14|Window size * (2^14)|

These settings are the most likely to affect TCP performance, but keep in mind that many other factors across the internet, outside the control of Azure, can also affect TCP performance.

### Accelerated networking and receive side scaling

#### Accelerated networking

Virtual machine network functions historically are CPU intensive on both the guest VM and the hypervisor/host. The host CPU processes in software all packets that transit through the host, including all virtual network encapsulation and decapsulation. The more traffic that goes through the host, the higher the CPU load. If the host CPU is busy with other operations that affects network throughput and latency. Azure addresses this issue with accelerated networking.

Accelerated networking provides consistent ultralow network latency via the in-house programmable hardware of Azure and technologies like SR-IOV. Accelerated networking moves much of the Azure software-defined networking stack off the CPUs and into FPGA-based SmartNICs. This change enables end-user applications to reclaim compute cycles that put less load on the VM decreasing jitter and inconsistency in latency. In other words, performance can be more deterministic.

Accelerated networking improves performance by allowing the guest VM to bypass the host and establish a datapath directly with a host’s SmartNIC. Here are some benefits of accelerated networking:

- **Lower latency / higher packets per second (pps)**: Removing the virtual switch from the datapath eliminates the time packets spend in the host for policy processing and increases the number of packets that can be processed in the VM.

- **Reduced jitter**: Virtual switch processing depends on the amount of policy that needs to be applied and the workload of the CPU that's doing the processing. Offloading the policy enforcement to the hardware removes that variability by delivering packets directly to the VM, eliminating the host-to-VM communication and all software interrupts and context switches.

- **Decreased CPU utilization**: Bypassing the virtual switch in the host leads to less CPU utilization for processing network traffic.

To use accelerated networking, you need to explicitly enable it on each applicable VM. See [Create a Linux virtual machine with Accelerated Networking](./create-vm-accelerated-networking-cli.md) for instructions.

#### Receive side scaling

Receive side scaling (RSS) is a network driver technology that distributes the receiving of network traffic more efficiently by distributing receive processing across multiple CPUs in a multiprocessor system. In simple terms, RSS allows a system to process more received traffic because it uses all available CPUs instead of just one. For a more technical discussion of RSS, see [Introduction to receive side scaling](/windows-hardware/drivers/network/introduction-to-receive-side-scaling).

To get the best performance when accelerated networking is enabled on a VM, you need to enable RSS. RSS can also provide benefits on VMs that don’t use accelerated networking. For an overview of how to determine if RSS is enabled and how to enable it, see [Optimize network throughput for Azure virtual machines](./virtual-network-optimize-network-bandwidth.md).

### TCP TIME_WAIT and TIME_WAIT assassination

TCP TIME_WAIT is another common setting that impacts network and application performance. Busy VMs frequently open and close many sockets, either as clients or servers. During normal TCP operations, a socket often enters the TIME_WAIT state and remains there for an extended period. This state ensures the delivery of any remaining data on the socket before it closes. As a result, TCP/IP stacks typically prevent socket reuse by dropping the client's TCP SYN packet silently.

You can configure how long a socket remains in the TIME_WAIT state. The duration can range from 30 seconds to 240 seconds. Sockets are a finite resource, and their availability is configurable. Typically, about 30,000 sockets are available for use at any given time. If the system consumes all available sockets or if clients and servers use mismatched TIME_WAIT settings, the VM might attempt to reuse a socket still in the TIME_WAIT state. In such cases, new connections fail because the TCP SYN packets are silently dropped.

The value for port range for outbound sockets is configurable within the TCP/IP stack of an operating system. The same thing is true for TCP TIME_WAIT settings and socket reuse. Changing these numbers can potentially improve scalability. But, depending on the situation, these changes could cause interoperability issues. You should be careful if you change these values.

You can use TIME_WAIT assassination to address this scaling limitation. TIME_WAIT assassination allows a socket to be reused in certain situations, like when the sequence number in the IP packet of the new connection exceeds the sequence number of the last packet from the previous connection. In this case, the operating system allows the new connection to be established (it accepts the new SYN/ACK) and force close the previous connection that was in a TIME_WAIT state. This capability is supported on Windows VMs in Azure. To learn about support in other VMs, check with the OS vendor.

To learn about configuring TCP TIME_WAIT settings and source port range, see [Settings that can be modified to improve network performance](/biztalk/technical-guides/settings-that-can-be-modified-to-improve-network-performance).

## Virtual network factors that can affect performance

### VM maximum outbound throughput

Azure provides various VM sizes and types, each with a different mix of performance capabilities. One of these capabilities is network throughput (or bandwidth), which is measured in megabits per second (Mbps). Because virtual machines are hosted on shared hardware, the network capacity needs to be shared fairly among the virtual machines using the same hardware. Larger virtual machines are allocated more bandwidth than smaller virtual machines.

The network bandwidth allocated to each virtual machine is measured on egress (outbound) traffic from the virtual machine. All network traffic leaving the virtual machine is counted toward the allocated limit, regardless of destination. If a virtual machine has a 1,000-Mbps limit, that limit applies whether the outbound traffic is destined for another virtual machine in the same virtual network or one outside of Azure.

Ingress isn't measured or limited directly. But there are other factors, like CPU and storage limits, that can affect a virtual machine’s ability to process incoming data.

Accelerated networking is designed to improve network performance, including latency, throughput, and CPU utilization. Accelerated networking can improve a virtual machine’s throughput, but it can do that only up to the virtual machine’s allocated bandwidth.

Azure virtual machines have at least one network interface attached to them. They might have several. The bandwidth allocated to a virtual machine is the sum of all outbound traffic across all network interfaces attached to the machine. In other words, the bandwidth is allocated on a per-virtual machine basis, regardless of how many network interfaces are attached to the machine.

Expected outbound throughput and the number of network interfaces supported by each VM size are detailed in [Sizes for Windows virtual machines in Azure](/azure/virtual-machines/sizes?toc=%2fazure%2fvirtual-network%2ftoc.json). To see maximum throughput, select a type, like **General purpose**, and then find the section about the size series on the resulting page (for example, "Dv2-series"). For each series, there's a table that provides networking specifications in the last column, which is titled "Max NICs / Expected network bandwidth (Mbps)."

The throughput limit applies to the virtual machine. Throughput isn't affected by these factors:

- **Number of network interfaces**: The bandwidth limit applies to the sum of all outbound traffic from the virtual machine.

- **Accelerated networking**: Though this feature can be helpful in achieving the published limit, it doesn't change the limit.

- **Traffic destination**: All destinations count toward the outbound limit.

- **Protocol**: All outbound traffic over all protocols counts towards the limit.

For more information, see [Virtual machine network bandwidth](./virtual-machine-network-throughput.md).

### Linux Virtual Machines (VMs) Optimization

Modern Linux kernels have features that can help achieving consistency and performance, sometimes required by certain workloads.

For more information, see [Optimize network bandwidth on Azure VMs](/azure/virtual-network/virtual-network-optimize-network-bandwidth#linux-virtual-machines)

### Internet performance considerations

As discussed throughout this article, factors on the internet and outside the control of Azure can affect network performance. Here are some of those factors:

- **Latency**: The round-trip time between two endpoints is affected by issues on intermediate networks, by traffic that doesn't take the "shortest" distance path, and by suboptimal peering paths.

- **Packet loss**: Packet loss is caused by network congestion, physical path issues, and underperforming network devices.

- **MTU size/Fragmentation**: Fragmentation along the path can lead to delays in data arrival or in packets arriving out of order, which can affect the delivery of packets.

Traceroute is a good tool for measuring network performance characteristics (like packet loss and latency) along every network path between a source device and a destination device.

### Network design considerations

Along with the considerations discussed earlier in this article, the topology of a virtual network can affect the network's performance. For example, a hub-and-spoke design that backhauls traffic globally to a single-hub virtual network introduces network latency, which affects overall network performance.

The number of network devices that network traffic passes through can also affect overall latency. In a hub-and-spoke design, if traffic passes through a spoke network virtual appliance and a hub virtual appliance before transiting to the internet, the network virtual appliances introduce some latency.

### Azure regions, virtual networks, and latency

Azure regions are made up of multiple datacenters that exist within a general geographic area. These datacenters might not be physically next to each other. In some cases, they're separated by as much as 10 kilometers. The virtual network is a logical overlay on top of the Azure physical datacenter network. A virtual network doesn't imply any specific network topology within the datacenter.

For example, two VMs that are in the same virtual network and subnet might be in different racks, rows, or even datacenters. They can be separated by feet of fiber optic cable or by kilometers of fiber optic cable. This variation could introduce variable latency (a few milliseconds difference) between different VMs.

The geographic placement of VMs, and the potential resulting latency between two VMs, is influenced by the configuration of availability sets, proximity placement groups, and availability zones. But the distance between datacenters in a region is region-specific and primarily influenced by datacenter topology in the region.

### Source NAT port exhaustion

A deployment in Azure can communicate with endpoints outside of Azure on the public internet and/or in the public IP space. When an instance initiates an outbound connection, Azure dynamically maps the private IP address to a public IP address. After Azure creates this mapping, return traffic for the outbound originated flow can also reach the private IP address where the flow originated.

For every outbound connection, the Azure Load Balancer needs to maintain this mapping for some period of time. With the multitenant nature of Azure, maintaining this mapping for every outbound flow for every VM can be resource intensive. So there are limits that are set and based on the configuration of the Azure Virtual Network. Or, to say that more precisely, an Azure VM can only make some outbound connections at a given time. When these limits are reached, the VM won't make more outbound connections.

But this behavior is configurable. For more information about SNAT and SNAT port exhaustion, see [this article](../load-balancer/load-balancer-outbound-connections.md).

## Measure network performance on Azure

Many of the performance maximums in this article are related to the network latency / round-trip time (RTT) between two VMs. This section provides some suggestions for how to test latency/RTT and how to test TCP performance and VM network performance. You can tune and performance test the TCP/IP and network values discussed earlier by using the techniques described in this section. Enter latency, MTU, MSS, and window size values into the calculations provided earlier and compare theoretical maximums to actual values observed during testing.

### Measure round-trip time and packet loss

TCP performance relies heavily on RTT and packet Loss. The PING utility available in Windows and Linux provides the easiest way to measure RTT and packet loss. The output of PING shows the minimum/maximum/average latency between a source and destination. It shows packet loss. PING uses the ICMP protocol by default. You can use PsPing to test TCP RTT. For more information, see [PsPing](/sysinternals/downloads/psping).

ICMP and TCP pings don't measure the accelerated networking datapath. To measure the datapath, read about Latte and SockPerf in [this article](./virtual-network-test-latency.md).

### Measure actual bandwidth of a virtual machine

To accurately measure the bandwidth of Azure VMs, follow [this guidance](./virtual-network-bandwidth-testing.md).

For more information on testing other scenarios, see these articles:

- [Troubleshooting Expressroute network performance](../expressroute/expressroute-troubleshooting-network-performance.md)

- [How to validate VPN throughput to a virtual network](../vpn-gateway/vpn-gateway-validate-throughput-to-vnet.md)

### Detect inefficient TCP behaviors

In packet captures, Azure customers might see TCP packets with TCP flags (SACK, DUP ACK, RETRANSMIT, and FAST RETRANSMIT) that could indicate network performance problems. These packets specifically indicate network inefficiencies that result from packet loss. But packet loss isn't necessarily caused by Azure performance problems. Performance issues could be the result of application, operating system, or other problems that might not be directly related to the Azure platform.

Also, keep in mind that some retransmission and duplicate ACKs are normal on a network. TCP protocols were built to be reliable. Evidence of these TCP packets in a packet capture doesn't necessarily indicate a systemic network problem, unless they're excessive.

Still, these packet types are indications that TCP throughput isn't achieving its maximum performance, for reasons discussed in other sections of this article.

## Next steps

Now that you've learned about TCP/IP performance tuning for Azure VMs, consider exploring other factors for [planning virtual networks](./virtual-network-vnet-plan-design-arm.md). You can also [learn more about connecting and configuring virtual networks](./index.yml).
