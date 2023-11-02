---
title: Accelerated connections network performance optimization and NVAs
description: Learn how Accelerated Connections improves Network Virtual Appliance (NVA) performance.
author: steveesp
ms.service: virtual-network
ms.topic: conceptual
ms.date: 02/01/2023
ms.author: steveesp

---

# Accelerated connections and NVAs (Limited GA)

This article helps you understand the **Accelerated Connections** feature. When Accelerated Connections is enabled on the virtual network interface (vNIC) with Accelerated Networking, this feature significantly improves networking efficiency, resulting in enhanced overall performance. This high-performance feature offers industry leading performance in Connections Per Second (CPS) optimization, along with improvements to handling large amounts of simultaneous connections. The feature also improves the number of Total Active Connections for network intensive workloads. Accelerated Connections is configured at the network interface level to allow flexibility to size the performance at vNIC. This especially benefits smaller VM sizes. These benefits are available for  Network Virtual Appliances (NVAs) with a large number of connections. To access this feature during limited General Availability (limited GA), use the [sign-up form](https://go.microsoft.com/fwlink/?linkid=2223706).

> [!IMPORTANT]
> This feature is currently in limited General Availability (GA) and customer sign-up is needed to use it.
>

Accelerated Connections supports the workloads that utilize large amounts of active connections simultaneously. It supports these connections bursts with negligible degradation to Virtual Machine (VM) throughput, latency or Connections Per Second (CPS) performance. The data path for the network traffic is highly optimized to offload the Software-defined networks (SDN) policies evaluation. The goal is to eliminate any bottlenecks in the cloud implementation and networking performance.

Feature enablement is at the vNIC level and irrespective of the VM size, making it available for VMs as small as four vCPUs. After enabling the feature, a performance improvement of up to twenty-five times (x25) in terms of Connections Per Second (CPS) can be achieved, especially for high numbers of simultaneous active connections. This essentially allows users to enhance existing VM’s network capabilities without resizing to a larger VM size.

There are a total of four performance tiers at vNIC level which gives the flexibility to control the networking capability. All tiers have different networking capabilities. Instructions on how to select performance tier based on VM sizes will be provided after a customer sign up for the feature.

Accelerated Connections is implemented at the network interface level to allow maximum flexibility of network capacity. Multiple vNICs can be configured with this enhancement, the number depends on the supported VM family. Network Virtual Appliances (NVAs) on Azure Marketplace will be the first workloads to be offered this ground-breaking feature.

Network Virtual Appliances (NVAs) with the largest scale workloads requiring virtual firewalls, virtual switches, load balancers and other critical network features will experience dramatically improved CPS performance with Accelerated Connections. 

> [!NOTE]
> During limited GA, this feature is only supported for NVAs available on the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps?search=network%20virtual%20appliance&page=1&filters=virtual-machine-images%3Bpartners).
>

**Architecture diagram**

:::image type="content" source="./media/nva-accelerated-connections/accelerated-connections-diagram.png" alt-text="Diagram of the connection performance optimization feature.":::

### Benefits

* Industry leading Connections Per Second (CPS)
* Increased number of total connections 
* Consistent throughput across a very large number of active connections 
* Reduced jitter on connection creation 
* Cost savings when using fewer VMs and licenses while achieving industry leading network connection performance 

### Considerations and limitations

* This feature is available only for NVAs deployed from Azure Marketplace during limited GA.
* To enable this feature, you must sign up using the [sign-up form](https://go.microsoft.com/fwlink/?linkid=2223706).
* This feature can be enabled and is supported only on new deployments.
* Feature support may vary as per the NVAs available on Marketplace.
* Detaching and attaching a network interface on a VM requires stop-deallocate first. 
* Marketplace portal isn't supported for the limited GA. Other tools such as templates, CLI, Terraform and other multi-cloud tools are supported. 
* This feature is free during the limited GA, but chargeable after limited GA. 

## Prerequisites

The following section lists the required prerequisites:

* [Accelerated networking](../virtual-network/accelerated-networking-overview.md) must be enabled on the traffic network interfaces of the NVA.
* Custom tags must be added to the resources during deployment (instructions will be provided).
* Registered for the limited GA using the [sign-up form](https://go.microsoft.com/fwlink/?linkid=2223706).

## Supported regions

This list will be updated as more regions become available. The following regions are supported:

* North Central US
* West Central US
* East US
* West US
* East US 2
* Central US

## Supported SKUs

This feature is supported on all SKUs supported by Accelerated Networking except the Dv5 VM family, which isn't yet supported during limited GA.

## Supported enablement methods

This feature enablement and deployment is supported using following methods: 

* PowerShell
* ARM templates via Azure portal
* Azure CLI
* Terraform
* SDK Package Deployment


## Next steps

Sign up for the [Limited GA](https://go.microsoft.com/fwlink/?linkid=2223706).
