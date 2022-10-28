---
title: Accelerated Networking overview
description: Accelerated Networking to improves networking performance of Azure VMs.
services: virtual-network
documentationcenter: ''
author: asudbring
manager: gedegrac
editor: ''

ms.assetid:
ms.service: virtual-network
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 02/15/2022
ms.author: allensu
---

# What is Accelerated Networking?

Accelerated networking enables single root I/O virtualization (SR-IOV) to a VM, greatly improving its networking performance. This high-performance path bypasses the host from the data path, which reduces latency, jitter, and CPU utilization for the most demanding network workloads on supported VM types. The following diagram illustrates how two VMs communicate with and without accelerated networking:

![Communication between Azure virtual machines with and without accelerated networking](./media/create-vm-accelerated-networking/accelerated-networking.png)

Without accelerated networking, all networking traffic in and out of the VM must traverse the host and the virtual switch. The virtual switch provides all policy enforcement, such as network security groups, access control lists, isolation, and other network virtualized services to network traffic.

> [!NOTE]
> To learn more about virtual switches, see [Hyper-V Virtual Switch](/windows-server/virtualization/hyper-v-virtual-switch/hyper-v-virtual-switch).

With accelerated networking, network traffic arrives at the VM's network interface (NIC) and is then forwarded to the VM. All network policies that the virtual switch applies are now offloaded and applied in hardware. Because policy is applied in hardware, the NIC can forward network traffic directly to the VM. The NIC bypasses the host and the virtual switch, while it maintains all the policy it applied in the host.

The benefits of accelerated networking only apply to the VM that it's enabled on. For the best results, enable this feature on at least two VMs connected to the same Azure virtual network. When communicating across virtual networks or connecting on-premises, this feature has minimal impact to overall latency.

## Benefits

- **Lower Latency / Higher packets per second (pps)**: Eliminating the virtual switch from the data path removes the time packets spend in the host for policy processing. It also increases the number of packets that can be processed inside the VM.

- **Reduced jitter**: Virtual switch processing depends on the amount of policy that needs to be applied. It also depends on the workload of the CPU that's doing the processing. Offloading the policy enforcement to the hardware removes that variability by delivering packets directly to the VM. Offloading also removes the host-to-VM communication, all software interrupts, and all context switches.

- **Decreased CPU utilization**: Bypassing the virtual switch in the host leads to less CPU utilization for processing network traffic.

## Supported operating systems

The following versions of Windows are supported:

- **Windows Server 2019 Standard/Datacenter**
- **Windows Server 2016 Standard/Datacenter** 
- **Windows Server 2012 R2 Standard/Datacenter**
- **Windows 10, version 21H2 or later** _(includes Windows 10 Enterprise multi-session)_
- **Windows 11** _(includes Windows 11 Enterprise multi-session)_

The following distributions are supported out of the box from the Azure Gallery: 
- **Ubuntu 14.04 with the linux-azure kernel**
- **Ubuntu 16.04 or later** 
- **SLES12 SP3 or later** 
- **RHEL 7.4 or later**
- **CentOS 7.4 or later**
- **CoreOS Linux**
- **Debian "Stretch" with backports kernel, Debian "Buster" or later**
- **Oracle Linux 7.4 and later with Red Hat Compatible Kernel (RHCK)**
- **Oracle Linux 7.5 and later with UEK version 5**
- **FreeBSD 10.4, 11.1 & 12.0 or later**

## Limitations and constraints

### Supported VM instances

Accelerated Networking is supported on most general purpose and compute-optimized instance sizes with 2 or more vCPUs. On instances that support hyperthreading, Accelerated Networking is supported on VM instances with 4 or more vCPUs. 

Support for Accelerated Networking can be found in the individual [virtual machine sizes](../virtual-machines/sizes.md) documentation.

The list of Virtual Machine SKUs that support Accelerated Networking can be queried directly via the following Azure CLI [`az vm list-skus`](/cli/azure/vm#az-vm-list-skus) command.

```azurecli-interactive
az vm list-skus \
  --location westus \
  --all true \
  --resource-type virtualMachines \
  --query '[].{size:size, name:name, acceleratedNetworkingEnabled: capabilities[?name==`AcceleratedNetworkingEnabled`].value | [0]}' \
  --output table
```

### Custom images (or) Azure compute gallery images

If you're using a custom image and your image supports Accelerated Networking, make sure that you have the required drivers to work with Mellanox ConnectX-3, ConnectX-4 Lx, and ConnectX-5 NICs on Azure. Also, Accelerated Networking requires network configurations that exempt the configuration of the virtual functions (mlx4_en and mlx5_core drivers). In images that have cloud-init >=19.4, networking is correctly configured to support Accelerated Networking during provisioning.


Sample configuration drop-in for NetworkManager (RHEL, CentOS):
```
sudo mkdir -p /etc/NetworkManager/conf.d 
sudo cat /etc/NetworkManager/conf.d/99-azure-unmanaged-devices.conf <<EOF 
# Ignore SR-IOV interface on Azure, since it'll be transparently bonded 
# to the synthetic interface 
[keyfile] 
unmanaged-devices=driver:mlx4_core;driver:mlx5_core 
EOF 
```

Sample configuration drop-in for networkd (Ubuntu, Debian, Flatcar):
```
sudo mkdir -p /etc/systemd/network 
sudo cat /etc/systemd/network/99-azure-unmanaged-devices.network <<EOF 
# Ignore SR-IOV interface on Azure, since it'll be transparently bonded 
# to the synthetic interface 
[Match] 
Driver=mlx4_en mlx5_en mlx4_core mlx5_core 
[Link] 
Unmanaged=yes 
EOF 
```

### Regions

Accelerated networking is available in all global Azure regions and Azure Government Cloud.

### Enabling accelerated networking on a running VM

A supported VM size without accelerated networking enabled can only have the feature enabled when it's stopped and deallocated.

### Deployment through Azure Resource Manager

Virtual machines (classic) can't be deployed with accelerated networking.

## Next steps
* Learn [how Accelerated Networking works](./accelerated-networking-how-it-works.md)
* Learn how to [create a VM with Accelerated Networking in PowerShell](./create-vm-accelerated-networking-powershell.md)
* Learn how to [create a VM with Accerelated Networking using Azure CLI](./create-vm-accelerated-networking-cli.md)
* Improve latency with an [Azure proximity placement group](../virtual-machines/co-location.md)
