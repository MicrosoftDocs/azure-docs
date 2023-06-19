---
title: Accelerated connections network performance optimization and NVAs
description: Learn how Accelerated Connections improves Network Virtual Appliance (NVA) performance.
author: steveesp
ms.service: virtual-network
ms.topic: conceptual
ms.date: 02/01/2023
ms.author: steveesp

---

# Accelerated connections and NVAs (Preview)

This article helps you understand the **Accelerated Connections** feature. When Accelerated Connections is enabled on the virtual network interface (vNIC) with Accelerated Networking, networking performance is improved. This high-performance feature is available on Network Virtual Appliances (NVAs) deployed from Azure Marketplace and offers competitive performance in Connections Per Second (CPS) optimization, along with improvements to handling large amounts of simultaneous connections. To access this feature during preview, use the [Preview sign-up form](https://go.microsoft.com/fwlink/?linkid=2223706).

> [!IMPORTANT]
> This feature is currently in public preview. This public preview is provided without a service-level agreement and shouldn't be used for production workloads. Certain features might not be supported, might have constrained capabilities, or might not be available in all Azure locations. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
>

Accelerated Connections supports the workloads that can send large amounts of active connections simultaneously. It supports these connections bursts with negligible degradation to VM throughput, latency or connections per second performance. The data path for the network traffic is highly optimized to offload the Software-defined networks (SDN) policies evaluation. The goal is to eliminate any bottlenecks in the cloud implementation and networking performance.

Accelerated Connections is implemented at the network interface level to allow maximum flexibility of network capacity. Multiple vNICs can be configured with this enhancement, the number depends on the supported VM family. Network Virtual Appliances (NVAs) on Azure Marketplace will be the first workloads to leverage this technology.

Network Virtual Appliances (NVAs) with most large scale solutions requiring v-firewall, v-switch, load balancers and other critical network features would experience higher CPS performance with Accelerated Connections.

> [!NOTE]
> During preview, this feature is only supported for NVAs available on the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps?search=network%20virtual%20appliance&page=1&filters=virtual-machine-images%3Bpartners).
>

**Diagram 1**

:::image type="content" source="./media/nva-accelerated-connections/accelerated-connections-diagram.png" alt-text="Diagram of the connection performance optimization feature.":::

### Benefits

* Increased Connections Per Second (CPS)
* Consistent active connections
* Increased CPU capacity/stability for high traffic network optimized VM
* Reduced jitter
* Decreased CPU utilization

### Considerations and limitations

* This feature is available only for NVAs deployed from Azure Marketplace during preview.
* To enable this feature, you must sign up for the preview using the [Preview sign-up form](https://go.microsoft.com/fwlink/?linkid=2223706).
* During preview, this feature is only available on Resource Groups created after sign-up.
* This feature can be enabled and is supported on new deployments using an Azure Resource Manager (ARM) template and preview instructions.
* Feature support may vary as per the NVAs available on Marketplace.
* Detaching and attaching a network interface on a running VM isn't supported as other Azure features.
* Marketplace portal isn't supported for the public preview.
* This feature is free during the preview, and chargeable after GA.

## Prerequisites

The following section lists the required prerequisites:

* [Accelerated networking](../virtual-network/accelerated-networking-overview.md) must be enabled on the traffic network interfaces of the NVA.
* Custom tags must be added to the resources during deployment (instructions will be provided).
* The data path tags should be added to the vNIC properties.
* You've signed up for the preview using the [Preview sign-up form](https://go.microsoft.com/fwlink/?linkid=2223706).

## Supported regions

This list will be updated as more regions become available. The following regions are supported:

* North Central US
* West Central US
* East US
* West US

## Supported SKUs

This feature is supported on all SKUs supported by Accelerated Networking except the Dv5 VM family, which isn't yet supported during preview.

## Next steps

Sign up for the [Preview](https://go.microsoft.com/fwlink/?linkid=2223706).
