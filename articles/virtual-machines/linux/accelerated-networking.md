---
title: Create an Azure virtual machine with Accelerated Networking - Linux | Microsoft Docs
description: Learn how to create a Linux virtual machine with Accelerated Networking.
services: virtual-network
documentationcenter: na
author: jimdial
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 12/14/2017
ms.author: jdial
ms.custom: 

---
# Create a Linux virtual machine with Accelerated Networking

In this tutorial, you learn how to create an Linux virtual machine (VM) with Accelerated Networking. Accelerated Networking is in preview release for specific Linux distributions. Accelerated networking enables single root I/O virtualization (SR-IOV) to a VM, greatly improving its networking performance. This high-performance path bypasses the host from the datapath reducing latency, jitter, and CPU utilization, for use with the most demanding network workloads on supported VM types. The following picture shows communication between two VMs with and without accelerated networking:

![Comparison](./media/accelerated-networking/image1.png)

Without accelerated networking, all networking traffic in and out of the VM must traverse the host and the virtual switch. The virtual switch provides all policy enforcement, such as network security groups, access control lists, isolation, and other network virtualized services to network traffic. To learn more about virtual switches, read the [Hyper-V network virtualization and virtual switch](https://technet.microsoft.com/library/jj945275.aspx) article.

With accelerated networking, network traffic arrives at the VM's network interface (NIC), and is then forwarded to the VM. All network policies that the virtual switch applies without accelerated networking are offloaded and applied in hardware. Applying policy in hardware enables the NIC to forward network traffic directly to the VM, bypassing the host and the virtual switch, while maintaining all the policy it applied in the host.

The benefits of accelerated networking only apply to the VM that it is enabled on. For the best results, it is ideal to enable this feature on at least two VMs connected to the same Azure Virtual Network (VNet). When communicating across VNets or connecting on-premises, this feature has minimal impact to overall latency.

> [!WARNING]
> Features in preview release may not have the same level of availability and reliability as features that are in general 
> availability release. The feature is not supported, may have constrained capabilities, and may not be available in all Azure 
> locations. For the most up-to-date notifications on availability and status of this feature, see [Azure Virtual Network updates](https://azure.microsoft.com/en-us/updates/?product=virtual-network).

## Benefits
* **Lower Latency / Higher packets per second (pps):** Removing the virtual switch from the datapath removes the time packets spend in the host for policy processing and increases the number of packets that can be processed inside the VM.
* **Reduced jitter:** Virtual switch processing depends on the amount of policy that needs to be applied and the workload of the CPU that is doing the processing. Offloading the policy enforcement to the hardware removes that variability by delivering packets directly to the VM, removing the host to VM communication and all software interrupts and context switches.
* **Decreased CPU utilization:** Bypassing the virtual switch in the host leads to less CPU utilization for processing network traffic.

## <a name="Limitations"></a>Limitations
The following limitations exist when using this capability:

* **Network interface creation:** Accelerated networking can only be enabled for a new NIC. It cannot be enabled for an existing NIC.
* **VM creation:** A NIC with accelerated networking enabled can only be attached to a VM when the VM is created. The NIC cannot be attached to an existing VM. If adding the VM to an existing availability set, all VMs in the availability set must also have accelerated networking enabled.
* **Regions:** The capability is available in many Azure regions, and continues to expand. For a full list, see [Azure Virtual Networking Updates](https://azure.microsoft.com/updates/accelerated-networking-in-expanded-preview) blog.   
* **Supported operating systems:** Ubuntu Server 16.04 LTS with kernel 4.4.0-77 or higher, SLES 12 SP2, RHEL 7.3, and CentOS 7.3 (Published by “Rogue Wave Software”).
* **VM Size:** General purpose and compute-optimized instance sizes with eight or more cores. For more information, see [Linux VM sizes](sizes.md). The set of supported VM instance sizes continues to expand.
* **Deployment through Azure Resource Manager (ARM) only:** Virtual machines (classic) cannot be deployed with Accelerated Networking.

You can use the [Azure portal](#portal) or Azure [PowerShell](#powershell) to create an Ubuntu or SLES VM. For RHEL and CentOS instructions, see [RHEL and CentOS](#rhel-and-centos).


## Create a network interface
Install the latest [Azure CLI 2.0](/cli/azure/install-az-cli2) and log in to an Azure account using [az login](/cli/azure/#login).

In the following examples, replace example parameter names with your own values. Example parameter names included *myResourceGroup2*, *mysNic*, and *myVM*.

First, create a resource group with [az group create](/cli/azure/group#create). The following example creates a resource group named *myResourceGroup2* in the *centralus* location:

```azurecli
az group create --name myResourceGroup2 --location centralus
```
While this feature is in preview, you must select a supported Linux region listed in [Linux accelerated networking preview](https://azure.microsoft.com/updates/accelerated-networking-in-expanded-preview).

## Create a virtual network
Create a virtual network with [az network vnet create](/cli/azure/network/vnet#create). The following example creates a virtual network named *myVnet* with one subnet:

```azurecli
az network vnet create \
    --resource-group myResourceGroup2 \
    --name myVnet \
    --address-prefix 192.168.0.0/16 \
    --subnet-name mySubnet \
    --subnet-prefix 192.168.1.0/24
```

## Create a network security group
Create a network security group with [az network nsg create](/cli/azure/network/nsg#create). The following example creates a network security group named *myNetworkSecurityGroup*:

```azurecli
az network nsg create \
    --resource-group myResourceGroup2 \
    --name myNetworkSecurityGroup
```

The network security group contains several default rules, one of which disables all inbound access from the Internet. Open a port to allow SSH access to the virtual machine:

```azurecli
az network nsg rule create \
  --resource-group myResourceGroup2 \
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

## Create a network interface with accelerated networking

Create a public IP address with az network public-ip create.  The public IP address isn't required if you don't plan to access the virtual machine from the Internet, but to complete the steps in this article, it is required.

```azurecli
az network public-ip create \
    --name myPublicIp \
    --resource-group myResourceGroup2
```

Create a network interface with [az network nic create](/cli/azure/network/nic#create) with accelerated networking enabled. The following example creates a network interface named *myNic* in the *mySubnet* subnet of the *myVnet* virtual network and associates the *myNetworkSecurityGroup* network security group to the network interface:

```azurecli
az network nic create \
    --resource-group myResourceGroup2 \
    --name myNic \
    --vnet-name myVnet \
    --subnet mySubnet \
    --accelerated-networking true \
    --public-ip-address myPublicIp \
    --network-security-group myNetworkSecurityGroup
```

## Create a VM and attach the NIC
When you create the VM, specify the NIC you created with `--nics`. While this feature is in preview, you can only select a VM size and Linux distribution listed in [Linux accelerated networking preview](https://azure.microsoft.com/updates/accelerated-networking-in-expanded-preview). 

Create a VM with [az vm create](/cli/azure/vm#create). The following example creates a VM named *myVM* with the UbuntuLTS image:

```azurecli
az vm create \
    --resource-group myResourceGroup2 \
    --name myVM \
    --image UbuntuLTS \
    --size Standard_DS3_v2 \
    --admin-username azureuser \
    --generate-ssh-keys \
    --nics myNic
```

Once the VM is created, output similar to the following example output is returned. Take note of the **publicIpAddress**. This address is used to access the VM in subsequent steps.

```azurecli
{
  "fqdns": "",
  "id": "/subscriptions/<ID>/resourceGroups/myResourceGroup2/providers/Microsoft.Compute/virtualMachines/myVM",
  "location": "centralus",
  "macAddress": "00-0D-3A-23-9A-49",
  "powerState": "VM running",
  "privateIpAddress": "192.168.0.4",
  "publicIpAddress": "40.68.254.142",
  "resourceGroup": "myResourceGroup2"
}
```

## SSH to the VM

Use the following command to create an SSH session with the VM. Replace *40.68.254.142* with the public IP address assigned to the virtual machine you created and replace *azureuser* if you used a different value for `--admin-username` when you created the VM.

```bash
ssh azureuser@40.68.254.142
```

## Configure the operating system - recent versions

From the Bash shell, enter `uname -r` and and confirm that the operating system version is one of the following:

    * **Ubuntu**: 4.4.0-77-generic, or greater
    * **SLES**: 4.4.59-92.20-default, or greater
    * **RHEL**: 7.3, or greater
    * **CentOS**: XXX, or greater

If the version of your distribution is less than the versions listed, complete the steps in [Configure the operating system - earlier versions](#configure-the-operating-system---earlier-versions), instead of the steps in this section.

Create a bond between the standard networking vNIC and the accelerated networking vNIC by running the commands that follow. Network traffic uses the higher performing accelerated networking vNIC, while the bond ensures that networking traffic is not interrupted across certain configuration changes.
  		  
```bash
wget https://raw.githubusercontent.com/LIS/lis-next/master/tools/sriov/configure_hv_sriov.sh
chmod +x ./configure_hv_sriov.sh
sudo ./configure_hv_sriov.sh
```

The VM restarts after a 60 second pause. Once the VM restarts, SSH into the VM again. Run `ifconfig` and confirm that the **bond0** interface is showing as *UP*.
 
>[!NOTE]
>Applications using accelerated networking must communicate over the *bond0* interface, not *eth0*.  The interface name may change before accelerated networking reaches general availability.

## Configure the operating system - earlier versions

If your distribution is the same, or a later version than the distribution versions listed in [Configure the operating system - recent versions](#configure-the-operating-system---recent-versions), skip this step. Creating VMs with earlier distribution versions requires some extra steps to load the latest drivers needed for SR-IOV and the Virtual Function (VF) driver for the network card. The first phase of the instructions prepares an image that can be used to make one or more virtual machines that have the drivers pre-loaded.

### Phase 1: Prepare a base image 

Provision a VM with an earlier distribution by completing the steps in the [Configure the operating system](configure-the-operating-system) section.

Install LIS 4.2.2:
    
    ```bash
    wget http://download.microsoft.com/download/6/8/F/68FE11B8-FAA4-4F8D-8C7D-74DA7F2CFC8C/lis-rpms-4.2.2-2.tar.gz
    tar -xvf lis-rpms-4.2.2-2.tar.gz
    cd LISISO && sudo ./install.sh
    ```

Download config files:
    
    ```bash
    cd /etc/udev/rules.d/  
    sudo wget https://raw.githubusercontent.com/LIS/lis-next/master/tools/sriov/60-hyperv-vf-name.rules 
    cd /usr/sbin/
    sudo wget https://raw.githubusercontent.com/LIS/lis-next/master/tools/sriov/hv_vf_name 
    sudo chmod +x hv_vf_name
    cd /etc/sysconfig/network-scripts/
    sudo wget https://raw.githubusercontent.com/LIS/lis-next/master/tools/sriov/ifcfg-vf1   
    ```

Deprovision the VM

    ```bash
    sudo waagent -deprovision+user 
    ```

From the Azure portal, stop the VM, go to the VM’s "Disks", and capture the OSDisk’s VHD URI. This URI contains the base image’s VHD name and its storage account. 
 
### Phase 2: Provision a new VM on Azure

Provision new VMs based with New-AzureRMVMConfig using the base image VHD captured in phase 1, with AcceleratedNetworking enabled on the vNIC:

```azurecli
$RgName="myResourceGroup2"
$Location="westus2"
    
# Create a resource group
New-AzureRmResourceGroup `
     -Name $RgName `
     -Location $Location

    # Create a subnet
    $Subnet = New-AzureRmVirtualNetworkSubnetConfig `
     -Name MySubnet `
     -AddressPrefix 10.0.0.0/24

    # Create a virtual network
    $Vnet=New-AzureRmVirtualNetwork `
     -ResourceGroupName $RgName `
     -Location $Location `
     -Name MyVnet `
     -AddressPrefix 10.0.0.0/16 `
     -Subnet $Subnet
    
    # Create a public IP address
    $Pip = New-AzureRmPublicIpAddress `
     -Name MyPublicIp `
     -ResourceGroupName $RgName `
     -Location $Location `
     -AllocationMethod Static
    
    # Create a virtual network interface and associate the public IP address to it
    $Nic = New-AzureRmNetworkInterface `
     -Name MyNic `
     -ResourceGroupName $RgName `
     -Location $Location `
     -SubnetId $Vnet.Subnets[0].Id `
     -PublicIpAddressId $Pip.Id `
     -EnableAcceleratedNetworking
    
    # Specify the base image's VHD URI (from phase 1, step 5). 
    # Note: The storage account of this base image vhd should have "Storage service encryption" disabled
    # See more from here: https://docs.microsoft.com/azure/storage/storage-service-encryption
    # This is just an example URI, you will need to replace this when running this script
    $sourceUri="https://myexamplesa.blob.core.windows.net/vhds/CentOS73-Base-Test120170629111341.vhd" 

    # Specify a URI for the location from which the new image binary large object (BLOB) is copied to start the virtual machine. 
    # Must end with ".vhd" extension
    $OsDiskName = "MyOsDiskName.vhd" 
    $destOsDiskUri = "https://myexamplesa.blob.core.windows.net/vhds/" + $OsDiskName
    
    # Define a credential object for the VM. PowerShell prompts you for a username and password.
    $Cred = Get-Credential
    
    # Create a custom virtual machine configuration
    $VmConfig = New-AzureRmVMConfig `
     -VMName MyVM -VMSize Standard_DS4_v2 | `
    Set-AzureRmVMOperatingSystem `
     -Linux `
     -ComputerName myVM `
     -Credential $Cred | `
    Add-AzureRmVMNetworkInterface -Id $Nic.Id | `
    Set-AzureRmVMOSDisk `
     -Name $OsDiskName `
     -SourceImageUri $sourceUri `
     -VhdUri $destOsDiskUri `
     -CreateOption FromImage `
     -Linux
    
    # Create the virtual machine.    
    New-AzureRmVM `
     -ResourceGroupName $RgName `
     -Location $Location `
     -VM $VmConfig
    ```

After the VMs boots, check the VF device by "lspci" and check the Mellanox entry. For example, you should see the following text in the lspci output:
    
```bash
0001:00:02.0 Ethernet controller: Mellanox Technologies MT27500/MT27520 Family [ConnectX-3/ConnectX-3 Pro Virtual Function]
```
    
Run the bonding script:

```bash
sudo bondvf.sh
```

Reboot the VM:

```bash
sudo reboot
```

The VM should start with bond0 configured and the Accelerated Networking path enabled.  Run `ifconfig` to confirm.

## Bring up the DPDK

The following instructions bring up the DPDK with MLX4. You can use DPDK by either porting all the required kernel patches and installing RDMA core, or by just deploying the latest Ubuntu image on Azure and installing Mellanox OFED. For more information on both approaches, see [MLX4 poll mode driver library](http://www.dpdk.org/doc/guides/nics/mlx4.html).

The DPDK application on Azure has to bind to a Fail-safe poll mode driver (PMD), since the packets can show up either on the VF interface or the synthetic interface. Binding applications to the Fail-safe PMD library ensures that applications can see all packets. 

If you're not already connected to the VM via SSH, [SSH into the VM](#ssh-to-the-vm). Download the Fail-safe PMD script:

```bash
wget https://gallery.technet.microsoft.com/Azure-DPDK-Failsafe-PMD-c34b1a4b/file/183012/1/failsafe.sh
chmod +x ./failsafe.sh
```

Get the MAC address of the **bond0** (virtual function) interface:

```bash
ifconfig
```

Run the Fail-safe script (replace `<replace-with-mac-address>` in the following command with the MAC address of the **bond0** interface):

```bash
sudo ./failsafe.sh <replace-with-mac-address> 
```

The output of the previous command is similar to the following output:

```bash
--vdev=net_failsafe0,mac=00:15:5d:44:4b:0c,exec(/root/failsafe.sh,preferred, 00:15:5d:44:4b:0c),exec(/root/failsafe.sh,fallback,00:15:5d:44:4b:0c) -w 0000:00.0 
``` 

Run the DPDK application: 

```bash
testpmd –c 0xf -n 4 $(/root/failsafe.sh 00:15:5d:44:4b:0c) -- --port-numaconfig=0,1 --socket-num=1  --burst=64 --txd=256 --rxd=256 --mbcache=512  -rxq=1 --txq=1 --nb-cores=1 --forward-mode=macswap --i    
```

@@@ The previous command failed for me on Ubuntu (of course, I used the MAC address for bond0, rather than the one above) with the following error:

bash: /root/failsafe.sh: Permission denied
The program 'testpmd' is currently not installed. You can install it by typing:
sudo apt install dpdk

@@@

or

```bash 
testpmd –c 0xf -n 4 -- vdev=” net_failsafe0,mac=00:15:5d:44:4b:0c,exec(/root/failsafe.sh,preferred, 00:15:5d:44:4b:0c),exec(/root/failsafe.sh,fallback,00:15:5d:44:4b:0c)" -w 0000:00.0 -- --port-numa-config=0,1 --socket-num=1  --burst=64 --txd=256 -rxd=256 --mbcache=512  --rxq=1 --txq=1 --nb-cores=1 -i    
```

@@@ The previous command also failed for me with this error:

bash: syntax error near unexpected token `('

@@@

When more than one VF is assigned to the VM, and the failsafe.sh script is run without any parameters, the command’s output, will generate a command line for all VFs that are presented on the VM. @@@ I'm not clear what to tell people to replace the MACs below with @@@  

```bash 
/root/failsafe.sh 00:15:5d:44:4b:0d 00:15:5d:44:4b:13 --vdev=net_failsafe0,mac=00:15:5d:44:4b:0d,exec(/root/failsafe.sh,preferred, 00:15:5d:44:4b:0d),exec(/root/failsafe.sh,fallback,00:15:5d:44:4b:0d,0) -vdev=net_failsafe1,mac=00:15:5d:44:4b:13,exec(/root/failsafe.sh,preferred, 00:15:5d:44:4b:13),exec(/root/failsafe.sh,fallback,00:15:5d:44:4b:13,1) -w 0000:00.0   
``` 

If only a specific VF is needed, the following can be run: 

```bash
sudo ./failsafe.sh preferred 
```

@@@ Likely because of the previous errors I'm receiving, the command returned no output for me.

The output returns all VF pci devices: 

```bash
0002:00:02.0,port=0
0003:00:02.0,port=0 
```

Run testpmd with a specific VF:  

```bash
./x86_64-native-linuxapp-gcc/build/app/test-pmd/testpmd -n 1 $(/root/failsafe.sh 00:15:5d:44:4b:0d)  -- -i
```