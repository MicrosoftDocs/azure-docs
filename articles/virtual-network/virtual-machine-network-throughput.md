---
title: Azure Virtual Machine Network Throughput and Bandwidth
description: Learn how Azure virtual machine network throughput and bandwidth allocation work. Discover flow limits, performance optimization, and monitoring best practices for VM networking.
author: asudbring
ms.service: azure-virtual-network
ms.topic: concept-article
ms.date: 07/28/2025
ms.author: allensu
ms.reviewer: kumud, mareat
ms.custom: sfi-image-nochange
# Customer intent: "As a cloud architect, I want to understand the network bandwidth allocation for Azure virtual machines, so that I can optimize application performance based on throughput needs."
---

# Virtual machine network bandwidth

Azure virtual machine network throughput determines how much bandwidth your applications can use for network communication. Azure offers various virtual machine sizes and types, each with different network performance capabilities measured in megabits per second (Mbps). Understanding how bandwidth allocation works helps you optimize application performance and choose the right VM size for your workload requirements.

Each virtual machine size has a different mix of performance capabilities. One capability is network throughput (or bandwidth), measured in megabits per second (Mbps). Because virtual machines are hosted on shared hardware, the network capacity must be shared fairly among the virtual machines sharing the same hardware. Larger virtual machines are allocated relatively more bandwidth than smaller virtual machines.

The network bandwidth allocated to each virtual machine is measured on egress (outbound) traffic from the virtual machine. All network traffic leaving the virtual machine is counted toward the allocated limit, regardless of destination. For example, if a virtual machine has a 1,000-Mbps limit, that limit applies whether the outbound traffic is destined for another virtual machine in the same virtual network, or outside of Azure.

Ingress isn't measured or limited directly. However, there are other factors, such as CPU and storage limits, which can affect a virtual machine's ability to process incoming data.

Accelerated networking is a feature designed to improve network performance, including latency, throughput, and CPU utilization. While accelerated networking can improve a virtual machine's throughput, it can do so only up to the virtual machine's allocated bandwidth. To learn more about Accelerated networking, see Accelerated networking for [Windows](create-vm-accelerated-networking-powershell.md) or [Linux](create-vm-accelerated-networking-cli.md) virtual machines.

Azure virtual machines must have one, but might have several, network interfaces attached to them. Bandwidth allocated to a virtual machine is the sum of all outbound traffic across all network interfaces attached to a virtual machine. In other words, the allocated bandwidth is per virtual machine, regardless of how many network interfaces are attached to the virtual machine. To learn how many network interfaces different Azure VM sizes support, see Azure [Windows](/azure/virtual-machines/sizes?toc=%2fazure%2fvirtual-network%2ftoc.json) and [Linux](/azure/virtual-machines/sizes?toc=%2fazure%2fvirtual-network%2ftoc.json) VM sizes.

## Expected network throughput

Expected outbound throughput and the number of network interfaces supported by each VM size is detailed in Azure [Windows](/azure/virtual-machines/sizes?toc=%2fazure%2fvirtual-network%2ftoc.json) and [Linux](/azure/virtual-machines/sizes?toc=%2fazure%2fvirtual-network%2ftoc.json) VM sizes. Select a type, such as General purpose, then select a size and series on the resulting page, such as the Dv2-series. Each series has a table with networking specifications in the last column titled,

**Max NICs / Expected network performance (Mbps)**.

The throughput limit applies to the virtual machine. Throughput is unaffected by the following factors:

- **Number of network interfaces**: The bandwidth limit is cumulative of all outbound traffic from the virtual machine.

- **Accelerated networking**: Though the feature can be helpful in achieving the published limit, it doesn't change the limit.

- **Traffic destination**: All destinations count toward the outbound limit.

- **Protocol**: All outbound traffic over all protocols counts towards the limit.

## Network flow limits

The number of network connections on a virtual machine at any moment can affect its network performance. The Azure networking stack uses data structures called **flows** to track each direction of a TCP/UDP connection. For a typical TCP/UDP connection, it creates two flows: one for inbound traffic and another for outbound traffic. A Five-tuple, consisting of protocol, local IP address, remote IP address, local port, and remote port, identifies each flow.

Data transfer between endpoints requires creation of several flows in addition to flows that perform the data transfer. Some examples are flows created for DNS resolution and flows created for load balancer health probes. Network virtual appliances (NVAs) such as gateways, proxies, firewalls, see flows created for connections terminated at the appliance and originated by the appliance.

:::image type="content" source="./media/virtual-machine-network-throughput/flow-count-through-network-virtual-appliance.png" alt-text="Screenshot of Azure VM flow count diagram showing TCP conversation routing through a network virtual appliance with inbound and outbound connections.":::

## Flow limits and active connections recommendations

Today, the Azure networking stack supports at least 500K total connections (500k inbound + 500k outbound flows) for all VM sizes. For the smallest sizes (2-7 vCPU), we recommend that your workload utilizes 100K or fewer total connections. Recommended connection limits vary based on the VM vCPU count and are shared below.

### Azure Boost VM Sizes with MANA
| VM Size(#vCPUs) | Recommended Connection Limit
| ------------------- |  ------------------ |
| 2-7                 |  100,000            |
| 8-15                |  500,000            |
| 16-31                 |  700,000            |
| 32-63               |  800,000            |
| 64+                 |  2,000,000          |

### Other VM Sizes
| VM Size(#vCPUs) | Recommended Connection Limit
| ------------------- |  ------------------ |
| 2-7                 |  100,000            |
| 8-15                |  500,000            |
| 16-31                 |  700,000            |
| 32-63               |  800,000            |
| 64+                 |  1,000,000          |

Network Optimized VM sizes have improved network connection performance that differs from the limits above. For information on Network Optimized VM connection limits see [the following article](/azure/virtual-network/network-optimized-vm-network-connection-acceleration)

Above the recommended limit, connections may be dropped or encounter reduced performance. Connection establishment and termination rates can also affect network performance as connection establishment and termination shares CPU with packet processing routines. We recommend that you benchmark workloads against expected traffic patterns and scale out workloads appropriately to match your performance needs. Microsoft has released a tool to make this easier, see [NCPS Tool](https://aka.ms/ncps) for more details. 

Note, NVAs such as gateways, proxies, firewalls, and other applications that forward traffic should use half the recommended connection limits, as forwarding traffic consumes twice the number of flows when compared to typical client-server communication.  

Metrics are available in [Azure Monitor](/azure/azure-monitor/essentials/metrics-supported#microsoftcomputevirtualmachines) to track the number of network flows and the flow creation rate on your VM or Virtual Machine Scale Sets instances. It's possible that the number of flows tracked by your VM guest OS is different than the number of flows tracked by the Azure network stack for various reasons. To ensure your network connections aren't dropped, use the Inbound and Outbound Flows metric.

:::image type="content" source="./media/virtual-machine-network-throughput/azure-monitor-flow-metrics.png" alt-text="Screenshot of Azure Monitor metrics page displaying network flow performance charts with inbound and outbound flow statistics for virtual machines.":::

## Next steps

- [Optimize network throughput for a virtual machine operating system](virtual-network-optimize-network-bandwidth.md)

- [Test network throughput](virtual-network-bandwidth-testing.md) for a virtual machine.
