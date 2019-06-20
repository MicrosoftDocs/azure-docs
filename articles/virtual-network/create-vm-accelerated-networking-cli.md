---
title: Create an Azure virtual machine with Accelerated Networking | Microsoft Docs
description: Learn how to create a Linux virtual machine with Accelerated Networking enabled.
services: virtual-network
documentationcenter: na
author: gsilva5
manager: gedegrac
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 01/10/2019
ms.author: gsilva
ms.custom: 

---
# Create a Linux virtual machine with Accelerated Networking

In this tutorial, you learn how to create a Linux virtual machine (VM) with Accelerated Networking. To create a Windows VM with Accelerated Networking, see [Create a Windows VM with Accelerated Networking](create-vm-accelerated-networking-powershell.md). Accelerated networking enables single root I/O virtualization (SR-IOV) to a VM, greatly improving its networking performance. This high-performance path bypasses the host from the datapath, reducing latency, jitter, and CPU utilization, for use with the most demanding network workloads on supported VM types. The following picture shows communication between two VMs with and without accelerated networking:

![Comparison](./media/create-vm-accelerated-networking/accelerated-networking.png)

Without accelerated networking, all networking traffic in and out of the VM must traverse the host and the virtual switch. The virtual switch provides all policy enforcement, such as network security groups, access control lists, isolation, and other network virtualized services to network traffic. To learn more about virtual switches, read the [Hyper-V network virtualization and virtual switch](https://technet.microsoft.com/library/jj945275.aspx) article.

With accelerated networking, network traffic arrives at the virtual machine's network interface (NIC), and is then forwarded to the VM. All network policies that the virtual switch applies are now offloaded and applied in hardware. Applying policy in hardware enables the NIC to forward network traffic directly to the VM, bypassing the host and the virtual switch, while maintaining all the policy it applied in the host.

The benefits of accelerated networking only apply to the VM that it is enabled on. For the best results, it is ideal to enable this feature on at least two VMs connected to the same Azure virtual network (VNet). When communicating across VNets or connecting on-premises, this feature has minimal impact to overall latency.

## Benefits
* **Lower Latency / Higher packets per second (pps):** Removing the virtual switch from the datapath removes the time packets spend in the host for policy processing and increases the number of packets that can be processed inside the VM.
* **Reduced jitter:** Virtual switch processing depends on the amount of policy that needs to be applied and the workload of the CPU that is doing the processing. Offloading the policy enforcement to the hardware removes that variability by delivering packets directly to the VM, removing the host to VM communication and all software interrupts and context switches.
* **Decreased CPU utilization:** Bypassing the virtual switch in the host leads to less CPU utilization for processing network traffic.

## Supported operating systems
The following distributions are supported out of the box from the Azure Gallery: 
* **Ubuntu 14.04 with the linux-azure kernel**
* **Ubuntu 16.04 or later** 
* **SLES12 SP3 or later** 
* **RHEL 7.4 or later**
* **CentOS 7.4 or later**
* **CoreOS Linux**
* **Debian "Stretch" with backports kernel**
* **Oracle Linux 7.4 and later with Red Hat Compatible Kernel (RHCK)**
* **Oracle Linux 7.5 and later with UEK version 5**
* **FreeBSD 10.4, 11.1 & 12.0**

## Limitations and Constraints

### Supported VM instances
Accelerated Networking is supported on most general purpose and compute-optimized instance sizes with 2 or more vCPUs.  These supported series are: D/DSv2 and F/Fs

On instances that support hyperthreading, Accelerated Networking is supported on VM instances with 4 or more vCPUs. Supported series are: D/Dsv3, E/Esv3, Fsv2, Lsv2, Ms/Mms and Ms/Mmsv2.

For more information on VM instances, see [Linux VM sizes](../virtual-machines/linux/sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

### Regions
Available in all public Azure regions as well as Azure Government Clouds.

<!-- ### Network interface creation 
Accelerated networking can only be enabled for a new NIC. It cannot be enabled for an existing NIC.
removed per issue https://github.com/MicrosoftDocs/azure-docs/issues/9772 -->
### Enabling Accelerated Networking on a running VM
A supported VM size without accelerated networking enabled can only have the feature enabled when it is stopped and deallocated.  
### Deployment through Azure Resource Manager
Virtual machines (classic) cannot be deployed with Accelerated Networking.

## Create a Linux VM with Azure Accelerated Networking
## Portal creation
Though this article provides steps to create a virtual machine with accelerated networking using the Azure CLI, you can also [create a virtual machine with accelerated networking using the Azure portal](../virtual-machines/linux/quick-create-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json). When creating a virtual machine in the portal, in the **Create a virtual machine** blade, choose the **Networking** tab.  In this tab, there is an option for **Accelerated networking**.  If you have chosen a [supported operating system](#supported-operating-systems) and [VM size](#supported-vm-instances), this option will automatically populate to "On."  If not, it will populate the "Off" option for Accelerated Networking and give the user a reason why it is not be enabled.   

* *Note:* Only supported operating systems can be enabled through the portal.  If you are using a custom image, and your image supports Accelerated Networking, please create your VM using CLI or Powershell. 

After the virtual machine is created, you can confirm Accelerated Networking is enabled by following the instructions in the [Confirm that accelerated networking is enabled](#confirm-that-accelerated-networking-is-enabled).

## CLI creation
### Create a virtual network

Install the latest [Azure CLI](/cli/azure/install-azure-cli) and log in to an Azure account using [az login](/cli/azure/reference-index). In the following examples, replace example parameter names with your own values. Example parameter names included *myResourceGroup*, *myNic*, and *myVm*.

Create a resource group with [az group create](/cli/azure/group). The following example creates a resource group named *myResourceGroup* in the *centralus* location:

```azurecli
az group create --name myResourceGroup --location centralus
```

Select a supported Linux region listed in [Linux accelerated networking](https://azure.microsoft.com/updates/accelerated-networking-in-expanded-preview).

Create a virtual network with [az network vnet create](/cli/azure/network/vnet). The following example creates a virtual network named *myVnet* with one subnet:

```azurecli
az network vnet create \
    --resource-group myResourceGroup \
    --name myVnet \
    --address-prefix 192.168.0.0/16 \
    --subnet-name mySubnet \
    --subnet-prefix 192.168.1.0/24
```

### Create a network security group
Create a network security group with [az network nsg create](/cli/azure/network/nsg). The following example creates a network security group named *myNetworkSecurityGroup*:

```azurecli
az network nsg create \
    --resource-group myResourceGroup \
    --name myNetworkSecurityGroup
```

The network security group contains several default rules, one of which disables all inbound access from the Internet. Open a port to allow SSH access to the virtual machine with [az network nsg rule create](/cli/azure/network/nsg/rule):

```azurecli
az network nsg rule create \
  --resource-group myResourceGroup \
  --nsg-name myNetworkSecurityGroup \
  --name Allow-SSH-Internet \
  --access Allow \
  --protocol Tcp \
  --direction Inbound \
  --priority 100 \
  --source-address-prefix Internet \
  --source-port-range "*" \
  --destination-address-prefix "*" \
  --destination-port-range 22
```

### Create a network interface with accelerated networking

Create a public IP address with [az network public-ip create](/cli/azure/network/public-ip). A public IP address isn't required if you don't plan to access the virtual machine from the Internet, but to complete the steps in this article, it is required.

```azurecli
az network public-ip create \
    --name myPublicIp \
    --resource-group myResourceGroup
```

Create a network interface with [az network nic create](/cli/azure/network/nic) with accelerated networking enabled. The following example creates a network interface named *myNic* in the *mySubnet* subnet of the *myVnet* virtual network and associates the *myNetworkSecurityGroup* network security group to the network interface:

```azurecli
az network nic create \
    --resource-group myResourceGroup \
    --name myNic \
    --vnet-name myVnet \
    --subnet mySubnet \
    --accelerated-networking true \
    --public-ip-address myPublicIp \
    --network-security-group myNetworkSecurityGroup
```

### Create a VM and attach the NIC
When you create the VM, specify the NIC you created with `--nics`. Select a size and distribution listed in [Linux accelerated networking](https://azure.microsoft.com/updates/accelerated-networking-in-expanded-preview). 

Create a VM with [az vm create](/cli/azure/vm). The following example creates a VM named *myVM* with the UbuntuLTS image and a size that supports Accelerated Networking (*Standard_DS4_v2*):

```azurecli
az vm create \
    --resource-group myResourceGroup \
    --name myVM \
    --image UbuntuLTS \
    --size Standard_DS4_v2 \
    --admin-username azureuser \
    --generate-ssh-keys \
    --nics myNic
```

For a list of all VM sizes and characteristics, see [Linux VM sizes](../virtual-machines/linux/sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

Once the VM is created, output similar to the following example output is returned. Take note of the **publicIpAddress**. This address is used to access the VM in subsequent steps.

```azurecli
{
  "fqdns": "",
  "id": "/subscriptions/<ID>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM",
  "location": "centralus",
  "macAddress": "00-0D-3A-23-9A-49",
  "powerState": "VM running",
  "privateIpAddress": "192.168.0.4",
  "publicIpAddress": "40.68.254.142",
  "resourceGroup": "myResourceGroup"
}
```

### Confirm that accelerated networking is enabled

Use the following command to create an SSH session with the VM. Replace `<your-public-ip-address>` with the public IP address assigned to the virtual machine you created, and replace *azureuser* if you used a different value for `--admin-username` when you created the VM.

```bash
ssh azureuser@<your-public-ip-address>
```

From the Bash shell, enter `uname -r` and confirm that the kernel version is one of the following versions, or greater:

* **Ubuntu 16.04**: 4.11.0-1013
* **SLES SP3**: 4.4.92-6.18
* **RHEL**: 7.4.2017120423
* **CentOS**: 7.4.20171206


Confirm the Mellanox VF device is exposed to the VM with the `lspci` command. The returned output is similar to the following output:

```bash
0000:00:00.0 Host bridge: Intel Corporation 440BX/ZX/DX - 82443BX/ZX/DX Host bridge (AGP disabled) (rev 03)
0000:00:07.0 ISA bridge: Intel Corporation 82371AB/EB/MB PIIX4 ISA (rev 01)
0000:00:07.1 IDE interface: Intel Corporation 82371AB/EB/MB PIIX4 IDE (rev 01)
0000:00:07.3 Bridge: Intel Corporation 82371AB/EB/MB PIIX4 ACPI (rev 02)
0000:00:08.0 VGA compatible controller: Microsoft Corporation Hyper-V virtual VGA
0001:00:02.0 Ethernet controller: Mellanox Technologies MT27500/MT27520 Family [ConnectX-3/ConnectX-3 Pro Virtual Function]
```

Check for activity on the VF (virtual function) with the `ethtool -S eth0 | grep vf_` command. If you receive output similar to the following sample output, accelerated networking is enabled and working.

```bash
vf_rx_packets: 992956
vf_rx_bytes: 2749784180
vf_tx_packets: 2656684
vf_tx_bytes: 1099443970
vf_tx_dropped: 0
```
Accelerated Networking is now enabled for your VM.

## Handle dynamic binding and revocation of virtual function 
Applications must run over the synthetic NIC that is exposed in VM. If the application runs directly over the VF NIC, it doesn't receive **all** packets that are destined to the VM, since some packets show up over the synthetic interface.
If you run an application over the synthetic NIC, it guarantees that the application receives **all** packets that are destined to it. It also makes sure that the application keeps running, even if the VF is revoked when the host is being serviced. 
Applications binding to the synthetic NIC is a **mandatory** requirement for all applications taking advantage of **Accelerated Networking**.

## Enable Accelerated Networking on existing VMs
If you have created a VM without Accelerated Networking, it is possible to enable this feature on an existing VM.  The VM must support Accelerated Networking by meeting the following prerequisites that are also outlined above:

* The VM must be a supported size for Accelerated Networking
* The VM must be a supported Azure Gallery image (and kernel version for Linux)
* All VMs in an availability set or VMSS must be stopped/deallocated before enabling Accelerated Networking on any NIC

### Individual VMs & VMs in an availability set
First stop/deallocate the VM or, if an Availability Set, all the VMs in the Set:

```azurecli
az vm deallocate \
    --resource-group myResourceGroup \
    --name myVM
```

Important, please note, if your VM was created individually, without an availability set, you only need to stop/deallocate the individual VM to enable Accelerated Networking.  If your VM was created with an availability set, all VMs contained in the availability set will need to be stopped/deallocated before enabling Accelerated Networking on any of the NICs. 

Once stopped, enable Accelerated Networking on the NIC of your VM:

```azurecli
az network nic update \
    --name myNic \
    --resource-group myResourceGroup \
    --accelerated-networking true
```

Restart your VM or, if in an Availability Set, all the VMs in the Set and confirm that Accelerated Networking is enabled: 

```azurecli
az vm start --resource-group myResourceGroup \
    --name myVM
```

### VMSS
VMSS is slightly different but follows the same workflow.  First, stop the VMs:

```azurecli
az vmss deallocate \
    --name myvmss \
    --resource-group myrg
```

Once the VMs are stopped, update the Accelerated Networking property under the network interface:

```azurecli
az vmss update --name myvmss \
    --resource-group myrg \
    --set virtualMachineProfile.networkProfile.networkInterfaceConfigurations[0].enableAcceleratedNetworking=true
```

Please note, a VMSS has VM upgrades that apply updates using three different settings, automatic, rolling and manual.  In these instructions the policy is set to automatic so that the VMSS will pick up the changes immediately after restarting.  To set it to automatic so that the changes are immediately picked up: 

```azurecli
az vmss update \
    --name myvmss \
    --resource-group myrg \
    --set upgradePolicy.mode="automatic"
```

Finally, restart the VMSS:

```azurecli
az vmss start \
    --name myvmss \
    --resource-group myrg
```

Once you restart, wait for the upgrades to finish but once completed, the VF will appear inside the VM.  (Please make sure you are using a supported OS and VM size.)

### Resizing existing VMs with Accelerated Networking

VMs with Accelerated Networking enabled can only be resized to VMs that support Accelerated Networking.  

A VM with Accelerated Networking enabled cannot be resized to a VM instance that does not support Accelerated Networking using the resize operation.  Instead, to resize one of these VMs: 

* Stop/Deallocate the VM or if in an availability set/VMSS, stop/deallocate all the VMs in the set/VMSS.
* Accelerated Networking must be disabled on the NIC of the VM or if in an availability set/VMSS, all VMs in the set/VMSS.
* Once Accelerated Networking is disabled, the VM/availability set/VMSS can be moved to a new size that does not support Accelerated Networking and restarted.  

