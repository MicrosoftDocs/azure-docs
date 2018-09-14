---
title: Deploy Azure virtual network container networking | Microsoft Docs
description: Learn how to deploy the Azure Virtual Network container network interface (CNI) plug-in for Kubernetes clusters and Docker containers.
services: virtual-network
documentationcenter: na
author: jimdial
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-network
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 9/14/2018
ms.author: jdial
ms.custom: 

---

# Deploy the Azure Virtual Network container network interface plug-in

Bring the rich set of Azure network capabilities to containers, by utilizing the same software defined networking stack that powers virtual machines. The Azure Virtual Network container network interface (CNI) plug-in installs in an Azure virtual machine. To learn more about the plug-in, see [Enable containers to use Azure Virtual Network capabilities](container-networking-overview.md). You can deploy the plug-in to provide Azure Virtual Network capabilities to containers in Kubernetes clusters, or when using Docker on your computer. Alternatively, you can enable containers deployed with the Azure Kubernetes Service (AKS) or the ACS-Engine to utilize the plug-in. For details, see [Using the plug-in](container-networking-overview.md#using-the-plug-in).

## Download and install the plug-in

Download the plug-in from [GitHub](https://github.com/Azure/azure-container-networking/releases). Download the latest version for the platform you're using:

- **Linux**: [azure-vnet-cni-linux-amd64-\<version no.\>.tgz](https://github.com/Azure/azure-container-networking/releases/download/v1.0.12-rc3/azure-vnet-cni-linux-amd64-v1.0.12-rc3.tgz)
- **Windows**: [azure-vnet-cni-windows-amd64-\<version no.\>.zip](https://github.com/Azure/azure-container-networking/releases/download/v1.0.12-rc3/azure-vnet-cni-windows-amd64-v1.0.12-rc3.zip)

Copy the [install script](https://github.com/Azure/azure-container-networking/blob/master/scripts/install-cni-plugin.sh). Save the script to a `scripts` directory on your computer and name the file `install-cni-plugin.sh` for Linux, or `install-cni-plugin.ps1` for Windows. To install the plug-in, run the appropriate script for your platform, specifying the version of the plug-in you are using. For example, you might specify *v1.0.12-rc3*:

   ```bash
   \$scripts/install-cni-plugin.sh [version]
   ```

   ```powershell
   scripts\\ install-cni-plugin.ps1 [version]
   ```

The script installs the plug-in under `/opt/cni/bin` for Linux and `c:\cni\bin` for Windows. The installed plug-in comes with a simple network configuration file that works after installation, but needs to be set up. For details about the file and how to configure it appropriately, see [CNI Network Configuration File](#cni-network-configuration-file).

## Deploy plug-in for a Kubernetes cluster

Complete the following steps to install the plug-in on every Azure virtual machine in a Kubernetes cluster:

1. [Download and install the plug-in](#download-and-install-the-cni-plug-in).
2. Pre-allocate a virtual network IP address pool on every virtual machine from which IP addresses will be assigned to the pods. Every Azure virtual machine comes with a primary virtual network private IP address on each network interface. The pool of IP addresses for pods is added as secondary addresses (*ipconfigs*) on the virtual machine network interface using one of the following options:

   - **CLI**: [Assigning multiple IP addresses using the Azure CLI](virtual-network-multiple-ip-addresses-cli.md)
   - **PowerShell**: [Assigning multiple IP addresses using PowerShell](virtual-network-multiple-ip-addresses-powershell.md)
   - **Portal**: [Assigning multiple IP addresses using the Azure portal](virtual-network-multiple-ip-addresses-portal.md)
   - **Azure Resource Manager template**: [Assigning multiple IP addresses using templates](virtual-network-multiple-ip-addresses-template.md)

   Ensure that you add enough IP addresses for all of the pods that you expect to bring up on the virtual machine.

3. Select the plug-in for providing networking for your cluster by passing Kubelet the `–network-plugin=cni` command-line option during cluster creation. Kubernetes, by default, looks for the plug-in and the configuration file in the directories where they are already installed.
4. If you want your pods to access the internet, add the following *iptables* rule on your Linux virtual machines to source-NAT internet traffic. In the following example, the specified IP range is 10.0.0.0/8.

   ```bash
   iptables -t nat -A POSTROUTING -m iprange ! --dst-range 168.63.129.16 -m
   addrtype ! --dst-type local ! -d 10.0.0.0/8 -j MASQUERADE
   ```

   The rules NAT traffic that is not destined to the specified IP ranges. The assumption is that all traffic outside the previous ranges is internet traffic. You can choose to specify the IP ranges of the virtual machine's virtual network, that of peered virtual networks, and on-premises networks.

  Windows virtual machines automatically source NAT traffic that has a destination outside the subnet to which the virtual machine belongs. It is not possible to specify custom IP ranges.

After completing the previous steps, pods brought up on the Kubernetes Agent virtual machines are automatically assigned private IP addresses from the virtual network.

## Deploy plug-in for Docker containers
Follow the previous steps to [download and install](#download-the-cni-plug-in) the plug-in on your virtual machine. Once it is installed, you can create docker containers with the following command:

```
./docker-run.sh \<container-name\> \<container-namespace\> \<image\>
```

The containers automatically start receiving IP addresses from the allocated pool.

### CNI network configuration file

The CNI network configuration file is described in JSON format. It is, by default, present in `/etc/cni/net.d` for Linux and `c:\cni\netconf` for Windows. The file specifies the configuration of the plug-in. The following json is a sample configuration file, and the meaning of the settings:

```json
{

"cniVersion": "0.2.0",

"name": "azure",

"type": "azure-vnet",

"master": "eth0",

"bridge": "azure0",

"logLevel": "info",

"ipam": {

"type": "azure-vnet-ipam",

"environment": "azure"

}

}
```

#### Settings explanation

- **cniVersion**: The Azure Virtual Network CNI plug-ins support versions 0.3.0 and 0.3.1 of the [CNI spec](https://github.com/containernetworking/cni/blob/master/SPEC.md).
- **name**: Name of the network. This property can be set to any unique value.
- **type**: Name of the network plug-in. Set to *azure-vnet*.
- **mode**: Operational mode. This field is optional. For more information, see [operational modes](https://github.com/Azure/azure-container-networking/blob/master/docs/network.md).
- **master**: Name of the virtual machine network interface that will be used to connect containers to a virtual network. This field is optional. If omitted, the plug-in automatically picks a suitable host network interface. Typically, the primary host interface name is *Ethernet* on Windows and *eth0* on Linux.
- **bridge**: Name of the bridge that will be used to connect containers to a virtual network. This field is optional. If omitted, the plugin automatically picks a unique name, based on the master interface index.
- **logLevel**: Log verbosity. Valid values are *info* and *debug*. This field is optional. If omitted, the plug-in logs at infolevel.

### IPAM plug-in

- **type**: Name of the IPAM plug-in. Always set to *azure-vnet-ipam*.
- **environment**: Name of the environment. Always set to *azure*.