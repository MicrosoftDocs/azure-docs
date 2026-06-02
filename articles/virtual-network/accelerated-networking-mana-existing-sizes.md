---
title: Microsoft Azure Network Adapter (MANA) support for existing VM Sizes
description: Update for Microsoft Azure Network Adapter (MANA) support for existing VM Sizes
author: alisheriffMSFT
ms.service: azure-virtual-network
ms.topic: how-to # Need to determine what is the right value
ms.date: 04/07/2026
ms.author: mattmcinnes
# Customer intent: As a cloud administrator, I want to learn about Microsoft Azure Network Adapter, Accelerated Networking and how these work with non-V6 VM Sizes on Intel.
---

# MANA support for existing VM series
The following content is for customers running existing Virtual Machine (VM) Sizes using Accelerated Networking.

> [!IMPORTANT]
> For timelines pertaining to VM series running on MANA-capable hardware, see the [announcement](https://techcommunity.microsoft.com/blog/AzureInfrastructureBlog/announcing-microsoft-azure-network-adapter-mana-support-for-existing-vm-skus/4493279).

Existing VM series are supported on [Microsoft Azure Network Adapter (MANA)](./accelerated-networking-mana-overview.md) capable hardware. However, since these VM series were introduced before MANA was released, they may not fully benefit from all performance, reliability, and resiliency improvements.

Newer VM series are built and optimized with MANA in mind and are designed to take full advantage of its performance, reliability, and resiliency improvements. For this reason, it is recommended to use newer VM sizes for the most optimal networking experience.

However, you can continue running workloads on your existing VM series. These VM series remain supported and can run on both Mellanox (previous generation) and MANA‑enabled hardware until the series is retired. While most workloads are expected to transition to MANA-capable hardware without issue, you should ensure that your workload is compatible with MANA for optimal networking performance.

## Applicable VM series
The VM series listed below are eligible to land on MANA-capable hardware and may require additional validation to fully benefit from networking improvements.

| Family | Series |
| --- | --- |
| A-family | Av2* |
| B-family | Bsv2|
| D-family | Dv1*, Dsv1* <br>Dv2*, Dsv2* <br>Dv3, Dsv3<br> Dv4, Dsv4, Ddv4, Ddsv4 <br>Dv5, Dsv5, Ddv5, Ddsv5, Dlsv5, Dldsv5 <br>Dpsv6, Dpdsv6, Dplsv6, Dpldsv6|
| E-family | Ev3, Esv3 <br>Ev4, Esv4, Edv4, Edsv4 <br>Ev5, Esv5, Edv5, Edsv5 <br>Epsv6, Epdsv6|
| Eb-family | Ebsv5, Ebdsv5 |
| F-family | F*, Fs*, Fsv2* |
| G-family | G*, Gs* |
| L-family | Ls* |

*These VM series are [announced for retirement](https://learn.microsoft.com/azure/virtual-machines/sizes/retirement/retired-sizes-list). If you’re currently using one of these VM series, view the [migration guide](https://learn.microsoft.com/azure/virtual-machines/migration/sizes/d-ds-dv2-dsv2-ls-series-migration-guide) to switch to a replacement series as soon as possible to avoid service interruption, capacity limitations, and forced deallocation as the series approaches retirement.

## Compatibility
Use the following steps to verify that your workload is compatible with the Microsoft Azure Network Adapter (MANA). If you are running a Network Virtual Appliance (NVA) or DPDK-based workload, see [NVA guidance](./accelerated-networking-mana-network-virtual-appliance-opt-out.md) or [DPDK guidance](./setup-dpdk-mana.md) for more information.

> [!NOTE]
> If Accelerated Networking is not enabled on your VM, no action is required. While your VM may still be placed on MANA-capable hardware, your workload will continue to run as expected without changes.

1.  **Check OS support**<br>Ensure your VM is running an operating system that supports MANA. If your OS supports MANA, no further action is needed.
    -  Linux: See [Linux VMs with MANA](./accelerated-networking-mana-linux.md)
    -  Windows: See [Windows VMs with MANA](./accelerated-networking-mana-windows.md)
  
2.  **Resize Intel-based workloads if possible**<br>Intel-based workloads are recommended to resize to Intel v6 or later VM series, which support MANA regardless of the operating system.

3. **Update operating system to support MANA if resizing is not possible**<br>
If you are running Arm-based workloads and/or cannot resize your VM, update your operating system to support `MANA`. MANA-eligible VM series can run on both hardware with Mellanox (`ConnectX-3`, `ConnectX-4 Lx`, `ConnectX-5`) and MANA NICs, so existing `mlx4` and `mlx5` support still needs to be present. 
    - Linux: [Use a supported kernel version](./accelerated-networking-mana-linux.md)
    - Windows: [Install the required MANA drivers](./accelerated-networking-mana-windows.md)

4. **Validate workload behavior**<br>After deployment or resizing, verify that your workload performs as expected.

### Custom images
Azure may place VMs on MANA-capable hardware even if the OS doesn't support MANA. To maximize performance, we recommend using an operating system that supports MANA.

## Network performance impacts
Networking limits in Azure are tied to the VM size, not the underlying hardware. No change in performance is expected when moving to MANA-capable hardware if your VM's operating system supports all network devices used in Azure.

> [!NOTE] 
> While Azure performs extensive testing across a wide range of use cases, virtual machines may still experience rare intermittent connectivity or degraded performance. In such cases, it is highly recommended to migrate to the latest generation of VMs or at a minimum, utilize an [operating system](./accelerated-networking-overview.md#supported-operating-systems) that is compatible with MANA.

If a VM is placed on MANA-capable hardware but the OS doesn't support MANA, networking automatically falls back to the NetVSC network adapter. In this scenario:
- The MANA Virtual Function (VF) may be visible, but no interfaces are exposed by the MANA driver.
- Performance is expected to be comparable to SR‑IOV-based `ConnectX‑3`, `ConnectX‑4 Lx`, and `ConnectX‑5` devices.
- Workloads with a high number of concurrent connections may see reduced performance.

## FAQ
### Where can I find more information about MANA? 
To learn more about MANA, visit the [Microsoft Azure Network Adapter (MANA) Overview](./accelerated-networking-mana-overview.md).

### Will my existing VM be deployed on MANA hardware?
Both existing and newly created VMs in the supported series may be placed on MANA-capable hardware.
- Existing VMs can land on MANA-capable hardware after a "stop-deallocate and start" operation or standard Azure maintenance event.
- New VMs created in the supported VM series are also eligible to be deployed on MANA capable hardware.

### How can I check if my VM is deployed on MANA capable hardware? 
If you are using a Linux operating system, follow the instructions described in [Linux VMs with the Microsoft Azure Network Adapter](./accelerated-networking-mana-linux.md). You'll see a PCIe device in the virtual machine and on the bonded NIC.

### Are DPDK-based application impacted by this change workload?
Yes. If your workload doesn't support MANA yet, we recommend that you update your DPDK-based applications. See [Microsoft Azure Network Adapter (MANA) and DPDK on Linux](./setup-dpdk-mana.md) for the minimum MANA compatibility requirements.

### Are Network Virtual Appliances (NVAs) impacted by this change? 
Yes. NVAs on applicable VM series may also be deployed on MANA capable hardware. Visit the [NVA support page](./accelerated-networking-mana-network-virtual-appliance-opt-out.md) for more information about MANA support for NVAs. 

### What should I do if I have issues? 
We’re here to help. Contact Microsoft Support, who can assist with troubleshooting, guidance, and next steps. You can open a support request through the Azure portal by selecting Help + support, or visit the Microsoft Support site to start a new case. A support engineer reviews your request, engage internal teams as needed, and keep you updated until the issue is resolved. 

### Are Azure Kubernetes Service (AKS) instances impacted?
No. AKS instances aren't impacted and will continue to perform as expected when deployed on MANA hardware.

### Is VNet encryption impacted?
No. VNet encryption will continue to perform as expected if VMs are deployed on MANA hardware.

## Related content
- [Accelerated Networking Overview](https://aka.ms/accelnet)
- [How Accelerated Networking works in Linux and FreeBSD VMs](/azure/virtual-network/accelerated-networking-how-it-works)
