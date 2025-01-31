---
title: Accelerated Networking overview
description: Learn how Accelerated Networking can improve the networking performance of Azure VMs.
author: mattreatMSFT
ms.author: mareat
ms.service: azure-virtual-network
ms.topic: how-to
ms.date: 10/22/2024
ms.custom: linux-related-content
---

# Accelerated Networking overview

> [!CAUTION]
> This article references CentOS, a Linux distribution that is End Of Life (EOL) status. Please consider your use and plan accordingly. For more information, see the [CentOS End Of Life guidance](/azure/virtual-machines/workloads/centos/centos-end-of-life).

This article describes the benefits, constraints, and supported configurations of Accelerated Networking. Accelerated Networking enables [single root I/O virtualization (SR-IOV)](/windows-hardware/drivers/network/overview-of-single-root-i-o-virtualization--sr-iov-) on supported virtual machine (VM) types, greatly improving networking performance. This high-performance data path bypasses the host, which reduces latency, jitter, and CPU utilization for the most demanding network workloads.

>[!NOTE]
>For more information on Microsoft Azure Network Adapter (MANA) preview, please refer to the [Azure MANA Docs](./accelerated-networking-mana-overview.md)

The following diagram illustrates how two VMs communicate with and without Accelerated Networking.

:::image type="content" source="~/reusable-content/ce-skilling/azure/media/virtual-network/accelerated-networking.png" alt-text="Screenshot that shows communication between Azure VMs with and without Accelerated Networking.":::

**Without Accelerated Networking**, all networking traffic in and out of the VM traverses the host and the virtual switch. The [virtual switch](/windows-server/virtualization/hyper-v-virtual-switch/hyper-v-virtual-switch) provides all policy enforcement to network traffic. Policies include network security groups, access control lists, isolation, and other network virtualized services.

**With Accelerated Networking**, network traffic that arrives at the VM's network interface (NIC) is forwarded directly to the VM. Accelerated Networking offloads all network policies that the virtual switch applied, and it applies them in hardware. Because hardware applies policies, the NIC can forward network traffic directly to the VM. The NIC bypasses the host and the virtual switch, while it maintains all the policies that it applied in the host.

## Benefits

Accelerated Networking has the following benefits:

- **Lower latency and higher packets per second**. Removing the virtual switch from the data path eliminates the time that packets spend in the host for policy processing. It also increases the number of packets that the VM can process.

- **Reduced jitter**. Processing time for virtual switches depends on the amount of policy to apply and the workload of the CPU that does the processing. Offloading policy enforcement to the hardware removes that variability by delivering packets directly to the VM. Offloading also removes the host-to-VM communication, all software interrupts, and all context switches.

- **Decreased CPU utilization**. Bypassing the virtual switch in the host leads to less CPU utilization for processing network traffic.

## Limitations and constraints

- The benefits of Accelerated Networking apply only to the VM that enables it.

- For best results, enable Accelerated Networking on at least two VMs in the same Azure virtual network. This feature has minimal effect on latency when you communicate across virtual networks or connect on-premises.

- You can't enable Accelerated Networking on a running VM. You can enable Accelerated Networking on a supported VM only when the VM is stopped and deallocated.

- You can't deploy virtual machines (classic) with Accelerated Networking through Azure Resource Manager.

- The Azure platform does not update the Mellanox NIC drivers in the VM. For VMs running Linux and FreeBSD, customers are encouraged to stay current with the latest kernel updates offered by the distribution. For VMs running Windows, customers should apply updated drivers from the NVIDIA support page if any issues are later encountered with the driver delivered with the Marketplace image or applied to a custom image.

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

To check whether a VM size supports Accelerated Networking, see [Sizes for virtual machines in Azure](/azure/virtual-machines/sizes).

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

If you use a custom image that supports Accelerated Networking, make sure you meet the following requirements.

#### Device and driver support
Any custom image supporting Accelerated Networking must include drivers that enable Single Root I/O Virtualization for the network interface cards (NIC) which are used on Azure platforms. This hardware list includes NVIDIA ConnectX-3, ConnectX-4 Lx, ConnectX-5 and the [Microsoft Azure Network Adapter (MANA)](accelerated-networking-mana-overview.md).

#### Dynamic binding and revocation of virtual function
Accelerated Networking requires guest OS images to properly handle the virtual function being removed or added dynamically. Scenarios such as host maintenance or live migration will result in dynamic revocation of the virtual function and restoration after the maintenance event. Additionally, applications must ensure that they bind to the synthetic device and not the virtual function in order to maintain network connectivity during these events. 

For more information about application binding requirements, see [How Accelerated Networking works in Linux and FreeBSD VMs](create-vm-accelerated-networking-cli.md?tabs=windows#handle-dynamic-binding-and-revocation-of-virtual-function). 

#### Configure drivers to be unmanaged
Accelerated Networking requires network configurations that mark the NVIDIA drivers as unmanaged devices. Images with cloud-init version 19.4 or later have networking correctly configured to support Accelerated Networking during provisioning. We strongly advise that you don't run competing network interface software (such as ifupdown and networkd) on custom images, and that you don't run dhcpclient directly on multiple interfaces.

# [RHEL, CentOS](#tab/redhat)

The following example shows a sample configuration drop-in for `NetworkManager` on RHEL or CentOS:

```bash
sudo cat <<EOF > /etc/udev/rules.d/68-azure-sriov-nm-unmanaged.rules
# Accelerated Networking on Azure exposes a new SRIOV interface to the VM.
# This interface is transparentlybonded to the synthetic interface,
# so NetworkManager should just ignore any SRIOV interfaces.
SUBSYSTEM=="net", DRIVERS=="hv_pci", ACTION!="remove", ENV{NM_UNMANAGED}="1"
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

---

#### Network traffic uses the Accelerated Networking data path

For NVIDIA drivers: Verify that the packets are flowing over the VF interface
- [Linux documentation](accelerated-networking-how-it-works.md#application-usage)
- [Windows documentation](create-vm-accelerated-networking-cli.md?tabs=windows#confirm-that-accelerated-networking-is-enabled)

For MANA driver: Verify that the traffic is flowing through MANA
- [Linux documentation](accelerated-networking-mana-linux.md#verify-that-traffic-is-flowing-through-mana)
- [Windows documentation](accelerated-networking-mana-windows.md#verify-that-traffic-is-flowing-through-mana)

---

## Related content

- [How Accelerated Networking works in Linux and FreeBSD VMs](./accelerated-networking-how-it-works.md)
- [Create a VM with Accelerated Networking by using PowerShell](./create-vm-accelerated-networking-powershell.md)
- [Create a VM with Accelerated Networking by using the Azure CLI](./create-vm-accelerated-networking-cli.md)
- [Proximity placement groups](/azure/virtual-machines/co-location)
