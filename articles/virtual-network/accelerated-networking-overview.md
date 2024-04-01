---
title: Accelerated Networking overview
description: Learn how Accelerated Networking can improve the networking performance of Azure VMs.
author: EllieMelissa
ms.service: virtual-network
ms.custom: linux-related-content
ms.topic: how-to
ms.date: 04/18/2023
ms.author: ealume
---

# Accelerated Networking overview

> [!CAUTION]
> This article references CentOS, a Linux distribution that is nearing End Of Life (EOL) status. Please consider your use and planning accordingly. For more information, see the [CentOS End Of Life guidance](~/articles/virtual-machines/workloads/centos/centos-end-of-life.md).

This article describes the benefits, constraints, and supported configurations of Accelerated Networking. Accelerated Networking enables [single root I/O virtualization (SR-IOV)](/windows-hardware/drivers/network/overview-of-single-root-i-o-virtualization--sr-iov-) on supported virtual machine (VM) types, greatly improving networking performance. This high-performance data path bypasses the host, which reduces latency, jitter, and CPU utilization for the most demanding network workloads.

>[!NOTE]
>For more information on Microsoft Azure Network Adapter (MANA) preview, please refer to the [Azure MANA Docs](./accelerated-networking-mana-overview.md)

The following diagram illustrates how two VMs communicate with and without Accelerated Networking.

:::image type="content" source="./media/create-vm-accelerated-networking/accelerated-networking.png" alt-text="Screenshot that shows communication between Azure VMs with and without Accelerated Networking.":::

**Without Accelerated Networking**, all networking traffic in and out of the VM traverses the host and the virtual switch. The [virtual switch](/windows-server/virtualization/hyper-v-virtual-switch/hyper-v-virtual-switch) provides all policy enforcement to network traffic. Policies include network security groups, access control lists, isolation, and other network virtualized services.

**With Accelerated Networking**, network traffic that arrives at the VM's network interface (NIC) is forwarded directly to the VM. Accelerated Networking offloads all network policies that the virtual switch applied, and it applies them in hardware. Because hardware applies policies, the NIC can forward network traffic directly to the VM. The NIC bypasses the host and the virtual switch, while it maintains all the policies that it applied in the host.

## Benefits

Accelerated Networking has the following benefits:

- **Lower latency and higher packets per second (pps)**. Removing the virtual switch from the data path eliminates the time that packets spend in the host for policy processing. It also increases the number of packets that the VM can process.

- **Reduced jitter**. Processing time for virtual switches depends on the amount of policy to apply and the workload of the CPU that does the processing. Offloading policy enforcement to the hardware removes that variability by delivering packets directly to the VM. Offloading also removes the host-to-VM communication, all software interrupts, and all context switches.

- **Decreased CPU utilization**. Bypassing the virtual switch in the host leads to less CPU utilization for processing network traffic.

## Limitations and constraints

- The benefits of Accelerated Networking apply only to the VM that enables it.

- For best results, enable Accelerated Networking on at least two VMs in the same Azure virtual network. This feature has minimal effect on latency when you communicate across virtual networks or connect on-premises.

- You can't enable Accelerated Networking on a running VM. You can enable Accelerated Networking on a supported VM only when the VM is stopped and deallocated.

- You can't deploy virtual machines (classic) with Accelerated Networking through Azure Resource Manager.

- The Azure platform does not update the Mellanox NIC drivers in the VM. For VMs running Linux and FreeBSD, customers are encouraged to stay current with the latest kernel updates offered by the distribution. For VMs running Windows, customers should apply updated drivers from the Nvidia support page if any issues are later encountered with the driver delivered with the Marketplace image or applied to a custom image.

### Supported regions

Accelerated Networking is available in all global Azure regions and the Azure Government Cloud.

### Supported operating systems

The following versions of Windows support Accelerated Networking:

- Windows Server 2022
- Windows Server 2019 Standard/Datacenter
- Windows Server 2016 Standard/Datacenter
- Windows Server 2012 R2 Standard/Datacenter
- Windows 10 version 21H2 or later, including Windows 10 Enterprise multisession
- Windows 11, including Windows 11 Enterprise multisession

The following Linux and FreeBSD distributions from Azure Marketplace support Accelerated Networking out of the box:

- Ubuntu 14.04 with the linux-azure kernel
- Ubuntu 16.04 or later
- SLES12 SP3 or later
- RHEL 7.4 or later
- CentOS 7.4 or later
- CoreOS Linux
- Debian "Stretch" with backports kernel
- Debian "Buster" or later
- Oracle Linux 7.4 and later with Red Hat Compatible Kernel (RHCK)
- Oracle Linux 7.5 and later with UEK version 5
- FreeBSD 10.4, 11.1, 12.0, or later

### Supported VM instances

Most general-purpose and compute-optimized VM instance sizes with two or more vCPUs support Accelerated Networking. On instances that support hyperthreading, VM instances with four or more vCPUs support Accelerated Networking.

To check whether a VM size supports Accelerated Networking, see [Sizes for virtual machines in Azure](../virtual-machines/sizes.md).

You can directly query the list of VM SKUs that support Accelerated Networking by using the Azure CLI [az vm list-skus](/cli/azure/vm#az-vm-list-skus) command:

  ```azurecli-interactive
  az vm list-skus \
    --location westus \
    --all true \
    --resource-type virtualMachines \
    --query '[].{size:size, name:name, acceleratedNetworkingEnabled: capabilities[?name==`AcceleratedNetworkingEnabled`].value | [0]}' \
    --output table
  ```

  >[!NOTE]
  >Although NC and NV sizes appear in the command output, those sizes don't support Accelerated Networking. Enabling Accelerated Networking on NC or NV VMs has no effect.

### Custom VM images

If you use a custom image that supports Accelerated Networking, make sure you have the required drivers to work with Mellanox ConnectX-3, ConnectX-4 Lx, and ConnectX-5 NICs on Azure. Accelerated Networking also requires network configurations that exempt configuration of the virtual functions on the mlx4_en and mlx5_core drivers.

Images with cloud-init version 19.4 or later have networking correctly configured to support Accelerated Networking during provisioning.

# [RHEL, CentOS](#tab/redhat)

The following example shows a sample configuration drop-in for `NetworkManager` on RHEL or CentOS:

```bash
sudo mkdir -p /etc/NetworkManager/conf.d
sudo cat > /etc/NetworkManager/conf.d/99-azure-unmanaged-devices.conf <<EOF
# Ignore SR-IOV interface on Azure, since it's transparently bonded
# to the synthetic interface
[keyfile]
unmanaged-devices=driver:mlx4_core;driver:mlx5_core
EOF
```

# [openSUSE, SLES](#tab/suse)

The following example shows a sample configuration drop-in for `networkd` on openSUSE or SLES:

```bash
sudo mkdir -p /etc/systemd/network
sudo cat > /etc/systemd/network/99-azure-unmanaged-devices.network <<EOF
# Ignore SR-IOV interface on Azure, since it's transparently bonded
# to the synthetic interface
[Match]
Driver=mlx4_en mlx5_en mlx4_core mlx5_core
[Link]
Unmanaged=yes
EOF
```

# [Ubuntu, Debian](#tab/ubuntu)

The following example shows a sample configuration drop-in for `networkd` on Ubuntu, Debian, or Flatcar:

```bash
sudo mkdir -p /etc/systemd/network
sudo cat > /etc/systemd/network/99-azure-unmanaged-devices.network <<EOF
# Ignore SR-IOV interface on Azure, since it's transparently bonded
# to the synthetic interface
[Match]
Driver=mlx4_en mlx5_en mlx4_core mlx5_core
[Link]
Unmanaged=yes
EOF
```

>[!NOTE]
>We strongly advise that you don't run competing network interface software (such as ifupdown and networkd) on custom images, and that you don't run dhcpclient directly on multiple interfaces.

---

## Next steps

- [How Accelerated Networking works in Linux and FreeBSD VMs](./accelerated-networking-how-it-works.md)
- [Create a VM with Accelerated Networking by using PowerShell](./create-vm-accelerated-networking-powershell.md)
- [Create a VM with Accelerated Networking by using the Azure CLI](./create-vm-accelerated-networking-cli.md)
- [Proximity placement groups](../virtual-machines/co-location.md)
