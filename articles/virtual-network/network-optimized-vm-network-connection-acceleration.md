---  
title: Network Optimized Virtual Machine Connection Acceleration (Preview)
titleSuffix: Azure Virtual Network 
description: Learn how Azure Network Optimized Virtual Machines improve performance with faster connection setup and higher scalability. Explore key benefits and use cases.  
author: asudbring  
ms.topic: concept-article  
ms.date: 05/19/2025
ms.author: allensu
# Customer intent: As a cloud architect, I want to implement Network Optimized Virtual Machines, so that I can achieve lower latency and higher connection scalability for applications requiring enhanced networking performance.
---  

# Network optimized virtual machine connection acceleration (Preview)

Network Optimized virtual machines enhance accelerated networking by providing hardware acceleration of initial connection setup for certain traffic types. This task was previously performed in software. These enhancements reduce the end-to-end latency for initially establishing a connection or initial packet flow. The enhancements allow a virtual machine to scale up the number of connections it manages more quickly, subject to application constraints.

Azure introduced accelerated networking to enhance virtual machine networking performance. This feature gives VMs direct access to the host's physical networking hardware using a technology called SR-IOV.

For information on how accelerated networking works in Azure, see [Accelerated networking overview](accelerated-networking-overview.md?tabs=redhat).

For information about SR-IOV, see [Overview of single root I/O virtualization (SR-IOV)](/windows-hardware/drivers/network/overview-of-single-root-i-o-virtualization--sr-iov-).

Network Optimized Virtual Machines feature updated network flow limits that scale with vCPU count, offering greater capacity compared to general-purpose Azure virtual machines. These capabilities make Network Optimized Virtual Machines a powerful choice for applications requiring high-performance networking and scalability.

> [!IMPORTANT]
> Network Optimized Virtual Machines: Enhanced Performance and Connection Setup is currently in PREVIEW.  
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Traffic and software-defined networking features that support enhanced connection setup

When using Network Optimized Virtual Machines, you can expect to see performance improvements for the following supported scenarios:

- Virtual machine to virtual machine traffic within virtual network
- Virtual machine to internal load balancer endpoint
- Virtual network peering, within region
- Virtual network peering, across region

More virtual network configurations function as expected but don't include enhanced connection setup performance, similar to general-purpose virtual machines. Plans exist to expand scenario support for hardware connection setup acceleration in the future.

## Supported virtual machine size families

You can take advantage of enhanced connection setup capabilities by utilizing a supported virtual machine type. Further enablement steps aren't required.

- The following virtual machine size families support enhanced connection setup capabilities:
  - Dlnv6
  - Dnsv6
  - Ensv6

Virtual machines with **`n`** included in their name include enhanced connection setup capabilities.

## Network connection limits for network optimized virtual machines

Connection and flow limits for Network Optimized Virtual Machines are adjusted to enhance scalability and ensure consistent performance. These limits depend on the vCPU count of the virtual machine. When the connection or flow limit is reached, any new packets attempting to create connections or flows beyond the limit are dropped.

For more information on the concepts and accounting for connection and flow limits, see [Azure virtual machine network throughput](virtual-machine-network-throughput.md).

| **vCPU** | **Connection Limit** |
|----------|----------------------|
| 2-7      | 500,000              |
| 8-15     | 600,000              |
| 16-31    | 700,000              |
| 32-47    | 800,000              |
| 48-63    | 1,000,000            |
| 64-95    | 2,000,000            |
| 96-192   | 2,000,000            |
| 192+     | 4,000,000            |

> [!WARNING]  
> These limits are provided as guidance. Each application and guest operating system manages network flows and timeouts differently. Your actual maximum achievable connection limit varies and can be less than the limits posted in the previous table.

## Connection setup performance (CPS)

Network Optimized Virtual Machines reduce latency for connection creation and enable higher connection creation rates. The connection creation rate, also known as connections per second (CPS), depends on several factors. These factors include virtual machine performance, operating system configuration, application settings, network traffic type and behavior, and infrastructure load. By optimizing these elements, you can achieve improved CPS performance in supported scenarios.

CPS throttling occurs for Network Optimized Virtual Machines based on the number of vCPUs in the virtual machine. If the workload creates connections at a rate exceeding the infrastructure limit, the system drops packets. Once the connection creation rate falls below the limit, the system allows more connections to succeed. When testing CPS, consider that virtual machine connection limits and flow expiration directly affect the sustained testing of the maximum connection creation rate.

| **vCPUs (#)** |  **Connections per Second** |
|----------------|----------------------------|
| 2              | 62,500                     |
| 4              | 62,500                     |
| 8              | 75,000                     |
| 16             | 87,500                     |
| 32             | 100,000                    |
| 48             | 125,000                    |
| 64             | 250,000                    |
| 128            | 250,000                    |
| 192+           | 420,000+                   |

## Limitations

- Virtual network and Network Security Group flow logging isn't supported for Network Optimized Virtual Machine sizes during preview.
- Live Migration is disabled for Network Optimized Virtual Machine sizes during preview.
- TCP Reset on idle timeout is currently enabled for all load balancing rules regardless of user configuration. This setting results in TCP resets being set for idle connections at the default value of 4 minutes.
- Azure Monitor Metrics for network flows and flow creation rate aren't accurate.
- Increased connection setup performance isn't currently applicable to network traffic destined to private link endpoints.
- Increased connection setup performance isn't applicable to certain container networking scenarios.
