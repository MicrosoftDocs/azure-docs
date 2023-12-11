---
title: Overview of Azure Boost
description: Learn more about how Azure Boost can Learn more about how Azure Boost can improve security and performance of your virtual machines.
author: mattmcinnes
ms.service: virtual-machines
ms.topic: conceptual
ms.workload: infrastructure
ms.custom:
  - ignite-2023
ms.date: 11/07/2023
ms.author: mattmcinnes
ms.reviewer: mattmcinnes
#Customer intent: I want to improve the security and performance of my Azure virtual machines
---

# Microsoft Azure Boost

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Sizes

Azure Boost is a system designed by Microsoft that offloads server virtualization processes traditionally performed by the hypervisor and host OS onto purpose-built software and hardware. This offloading frees up CPU resources for the guest virtual machines, resulting in improved performance. Azure Boost also provides a secure foundation for your cloud workloads. Microsoft's in-house developed hardware and software systems provide a secure environment for your virtual machines.

## Benefits

Azure Boost contains several features that can improve the performance and security of your virtual machines. These features are available on select [Azure Boost compatible virtual machine sizes](../../articles/azure-boost/overview.md#current-availability).

- **Networking:** Azure Boost includes a suite of software and hardware networking systems that provide a significant boost to both network performance (Up to 200-Gbps network bandwidth) and network security. Azure Boost compatible virtual machine hosts contain the new [Microsoft Azure Network Adapter (MANA)](../../articles/virtual-network/accelerated-networking-mana-overview.md). Learn more about [Azure Boost networking](../../articles/azure-boost/overview.md#networking).

- **Storage:** Storage operations are offloaded to the Azure Boost FPGA. This offload provides leading efficiency and performance while improving security, reducing jitter, and improving latency for workloads. Local storage now runs at up to 17.3-GBps and 3.8 million IOPS with remote storage up to 12.5-GBps throughput and 650 K IOPS. Learn more about [Azure Boost Storage](../../articles/azure-boost/overview.md#storage).

- **Security:** Azure Boost uses [Cerberus](../security/fundamentals/project-cerberus.md) as an independent HW Root of Trust to achieve NIST 800-193 certification. Customer workloads can't run on Azure Boost powered architecture unless the firmware and software running on the system is trusted. Learn more about [Azure Boost Security](../../articles/azure-boost/overview.md#security).

- **Performance:** With Azure Boost offloading storage and networking, CPU resources are freed up for increased virtualization performance. Resources that would normally be used for these essential background tasks are now available to the guest VM. Learn more about [Azure Boost Performance](../../articles/azure-boost/overview.md#performance).

## Networking
The next generation of Azure Boost will introduce the [Microsoft Azure Network Adapter (MANA)](../../articles/virtual-network/accelerated-networking-mana-overview.md). This network interface card (NIC) includes the latest hardware acceleration features and provides competitive performance with a consistent driver interface. This custom hardware and software implementation ensures optimal networking performance, tailored specifically for Azure's demands. MANA's features are designed to enhance your networking experience with: 
- **Over 200-Gbps of network bandwidth:**
Custom hardware and software drivers facilitating faster and more efficient data transfers. Starting up to 200Gbps network bandwidth with increases in the future.

- **High network availability and stability:** 
With an active/active network connection to the Top of Rack (ToR) switch, Azure Boost ensures your network is always up and running at the highest possible performance.  

- **Native support for DPDK:**
Learn more about Azure Boost's support for [Data Plane Development Kit (DPDK) on Linux VMs](../virtual-network/setup-dpdk-mana.md). 

- **Consistent driver interface:**
Assuring a one-time transition that won't be disrupted during future hardware changes.

- **Integration with future Azure features:**
Consistent updates and performance enhancements ensures you're always a step ahead.

:::image type="content" source="./media/boost-networking-mana-diagram.png" alt-text="Diagram showing the networking layout of an Azure Boost host with a connected MANA NIC.":::

## Storage
Azure Boost architecture offloads storage covering local, remote and cached disks that provide leading efficiency and performance while improving security, reducing jitter & improving latency for workloads. Azure Boost already provides acceleration for workloads in the fleet using remote storage including specialized workloads such as the Ebsv5 VM types. Also, these improvements provide potential cost saving for customers by consolidating existing workload into fewer or smaller sized VMs. 

Azure Boost delivers industry leading throughput performance at up to 12.5-GBps throughput and 650K IOPS. This performance is enabled by accelerated storage processing and exposing NVMe disk interfaces to VMs. Storage tasks are offloaded from the host processor to dedicated programmable Azure Boost hardware in our dynamically programmable FPGA. This architecture allows us to update the FPGA hardware in the fleet enabling continuous delivery for our customers.

:::image type="content" source="./media/boost-storage-nvme-vs-scsi.png" alt-text="Diagram showing the difference between managed SCSI storage and Azure Boost's managed NVMe storage.":::

By fully applying Azure Boost architecture, we deliver remote, local, and cached disk performance improvements at up to 17-GBps throughput and 3.8M IOPS. Azure Boost SSDs are designed to provide high performance optimized encryption at rest, and minimal jitter to NVMe local disks for Azure VMs with local disks.

:::image type="content" source="./media/boost-storage-ssd-comparison.png" alt-text="Diagram showing the difference between local SCSI SSDs and Azure Boost's local NVMe SSDs.":::

## Security
Azure Boost's security contains several components that work together to provide a secure environment for your virtual machines. Microsoft's in-house developed hardware and software systems provide a secure foundation for your cloud workloads. 

- **Security chip:**
Boost employs the [Cerberus](../security/fundamentals/project-cerberus.md) chip as an independent hardware root of trust to achieve NIST 800-193 certification. Customer workloads can't run on Azure Boost powered architecture unless the firmware and software running on the system garners trust.

- **Attestation:**
HW RoT identity, Secure Boot, and Attestation through Azure’s Attestation Service ensures that Boost and its powered hosts always operate in a healthy and trusted state. Any machine that can't be securely attested is prevented from hosting workloads and it's restored to a trusted state offline.

- **Code integrity:**
Boost systems embrace multiple layers of defense-in-depth, including ubiquitous code integrity verification that enforces only Microsoft approved and signed code runs on the Boost system on chip. Microsoft has sought to learn from and contribute back to the wider security community, up streaming advancements to the Integrity Measurement Architecture.

- **Security Enhanced OS:**
Azure Boost uses Security Enhanced Linux (SELinux) to enforce principle of least privileges for all software running on its system on chip. All control plane and data plane software running on top of the Boost OS is restricted to running only with the minimum set of privileges required to operate – the operating system restricts any attempt by Boost software to act in an unexpected manner. Boost OS properties make it difficult to compromise code, data, or the availability of Boost and Azure hosting Infrastructure.

- **Rust memory safety:**
Rust serves as the primary language for all new code written on the Boost system, to provide memory safety without impacting performance. Control and data plane operations are isolated with memory safety improvements that enhance Azure’s ability to keep tenants safe. 

- **FIPS certification:**
Boost employs a FIPS 140 certified system kernel, providing reliable and robust security validation of cryptographic modules.

## Performance
The hardware running virtual machines are a shared resource. The hypervisor (host system) must perform several tasks to ensure that each virtual machine is both isolated from other virtual machines and that each virtual machine receives the resources it needs to run. These tasks include networking between the physical and virtual networks, security, and storage management. Azure Boost reduces the overhead of these tasks by offloading them to dedicated hardware. This offloading frees up CPU resources for the guest virtual machines, resulting in improved performance.

- **VMs using large sizes:** 
Large sizes that encompass most of a host's resources benefit from Azure Boost. While a large VM size running on a Boost-enabled host might not directly see extra resources, workloads and applications that stress the host processes replaced by Azure Boost see a performance increase.

- **Dedicated hosts:**
Performance improvements also have significant impact to Azure Dedicated Hosts (ADH) users. Azure Boost-enabled hosts can potentially run extra, small VMs or increase the size of existing VMs. This allows you to do more work on a single host, reducing your overall costs.


## Current availability
Azure Boost is currently available on several VM size families:

[!INCLUDE [azure-boost-series](includes/azure-boost-series.md)]

## Next Steps
- Learn more about [Azure Virtual Network](../virtual-network/virtual-networks-overview.md).
- Look into [Azure Dedicated Hosts](../virtual-machines/dedicated-hosts.md).
- Learn more about [Azure Storage](../storage/common/storage-introduction.md).
