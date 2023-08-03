---
title: Deploy Azure virtual network container networking
description: Learn how to deploy the Azure Virtual Network container network interface (CNI) plug-in for Kubernetes clusters.
author: asudbring
ms.service: virtual-network
ms.topic: how-to
ms.date: 03/24/2023
ms.author: allensu
---

# Deploy the Azure Virtual Network container network interface plug-in

The Azure Virtual Network container network interface (CNI) plug-in installs in an Azure virtual machine and brings virtual network capabilities to Kubernetes Pods and Docker containers. To learn more about the plug-in, see [Enable containers to use Azure Virtual Network capabilities](container-networking-overview.md). Additionally, the plug-in can be used with the Azure Kubernetes Service (AKS) by choosing the [Advanced Networking](../aks/configure-azure-cni.md?toc=%2fazure%2fvirtual-network%2ftoc.json) option, which automatically places AKS containers in a virtual network.

## Deploy plug-in for ACS-Engine Kubernetes cluster

The ACS-Engine deploys a Kubernetes cluster with an Azure Resource Manager template. The cluster configuration is specified in a JSON file that is passed to the tool when generating the template. To learn more about the entire list of supported cluster settings and their descriptions, see [Microsoft Azure Container Service Engine - Cluster Definition](https://github.com/Azure/acs-engine/blob/master/docs/clusterdefinition.md). The plug-in is the default networking plug-in for clusters created using the ACS-Engine. The following network configuration settings are important when configuring the plug-in:

  | Setting                              | Description                                                                                                           |
  |--------------------------------------|------------------------------------------------------------------------------------------------------                 |
  | firstConsecutiveStaticIP             | The IP address that is allocated to the main node. This setting is mandatory.                                   |
  | clusterSubnet under kubernetesConfig | CIDR of the virtual network subnet where the cluster is deployed, and from which IP addresses are allocated to Pods   |
  | vnetSubnetId under masterProfile     | Specifies the Azure Resource Manager resource ID of the subnet where the cluster is to be deployed                    |
  | vnetCidr                             | CIDR of the virtual network where the cluster is deployed                                                             |
  | max-Pods under kubeletConfig         | Maximum number of Pods on every agent virtual machine. For the plug-in, the default is 30. You can specify up to 250  |

### Example configuration

The json example that follows is for a cluster with the following properties:

-	One main node and two agent nodes 

-	Deployed in a subnet named *KubeClusterSubnet* (10.0.0.0/20), with both main and agent nodes residing in it.

```json
{
  "apiVersion": "vlabs",
  "properties": {
    "orchestratorProfile": {
      "orchestratorType": "Kubernetes",
      "kubernetesConfig": {
        "clusterSubnet": "10.0.0.0/20" --> Subnet allocated for the cluster
      }
    },
    "masterProfile": {
      "count": 1,
      "dnsPrefix": "ACSKubeMaster",
      "vmSize": "Standard_A2",
      "vnetSubnetId": "/subscriptions/<subscription ID>/resourceGroups/<Resource Group Name>/providers/Microsoft.Network/virtualNetworks/<Vnet Name>/subnets/KubeClusterSubnet",
      "firstConsecutiveStaticIP": "10.0.1.50", --> IP address allocated to the Master node
      "vnetCidr": "10.0.0.0/16" --> Virtual network address space
    },
    "agentPoolProfiles": [
      {
        "name": "k8sagentpoo1",
        "count": 2,
        "vmSize": "Standard_A2_v2",
"vnetSubnetId": "/subscriptions/<subscription ID>/resourceGroups/<Resource Group Name>/providers/Microsoft.Network/virtualNetworks/<VNet Name>/subnets/KubeClusterSubnet",
        "availabilityProfile": "AvailabilitySet"
      }
    ],
    "linuxProfile": {
      "adminUsername": "KubeServerAdmin",
      "ssh": {
        "publicKeys": [
          {…}
        ]
      }
    },
    "servicePrincipalProfile": {
      "clientId": "dd438987-aa12-4754-b47d-375811889714",
      "secret": "azure123"
    }
  }
}
```

## Deploy plug-in for a Kubernetes cluster

Complete the following steps to install the plug-in on every Azure virtual machine in a Kubernetes cluster:

1. [Download and install the plug-in](#download-and-install-the-plug-in).

2. Preallocate a virtual network IP address pool on every virtual machine from which IP addresses are assigned to Pods. Every Azure virtual machine comes with a primary virtual network private IP address on each network interface. The pool of IP addresses for Pods is added as secondary addresses (*ipconfigs*) on the virtual machine network interface, using one of the following options:

   - **CLI**: [Assign multiple IP addresses using the Azure CLI](./ip-services/virtual-network-multiple-ip-addresses-cli.md)

   - **PowerShell**: [Assign multiple IP addresses using PowerShell](./ip-services/virtual-network-multiple-ip-addresses-powershell.md)

   - **Portal**: [Assign multiple IP addresses using the Azure portal](./ip-services/virtual-network-multiple-ip-addresses-portal.md)

   - **Azure Resource Manager template**: [Assign multiple IP addresses using templates](./template-samples.md)

   Ensure that you add enough IP addresses for all of the Pods that you expect to bring up on the virtual machine.

3. Select the plug-in for providing networking for your cluster by passing Kubelet the `–network-plugin=cni` command-line option during cluster creation. Kubernetes, by default, looks for the plug-in and the configuration file in the directories where they're already installed.

4. If you want your Pods to access the internet, add the following *iptables* rule on your Linux virtual machines to source-NAT internet traffic. In the following example, the specified IP range is 10.0.0.0/8.

   ```bash
   iptables -t nat -A POSTROUTING -m iprange ! --dst-range 168.63.129.16 -m
   addrtype ! --dst-type local ! -d 10.0.0.0/8 -j MASQUERADE
   ```

   The rules NAT traffic that isn't destined to the specified IP ranges. The assumption is that all traffic outside the previous ranges is internet traffic. You can choose to specify the IP ranges of the virtual machine's virtual network, that of peered virtual networks, and on-premises networks.

   Windows virtual machines automatically source NAT traffic that has a destination outside the subnet to which the virtual machine belongs. It isn't possible to specify custom IP ranges.

After completion of the previous steps, Pods brought up on the Kubernetes Agent virtual machines are automatically assigned private IP addresses from the virtual network.

## Deploy plug-in for Docker containers

1. [Download and install the plug-in](#download-and-install-the-plug-in).

2. Create Docker containers with the following command:

   ```
   ./docker-run.sh \<container-name\> \<container-namespace\> \<image\>
   ```

The containers automatically start receiving IP addresses from the allocated pool. If you want to load balance traffic to the Docker containers, they must be placed behind a software load balancer with  a load balancer probe.

### CNI network configuration file

The CNI network configuration file is described in JSON format. It is, by default, present in `/etc/cni/net.d` for Linux and `c:\cni\netconf` for Windows. The file specifies the configuration of the plug-in and is different for Windows and Linux. The json that follows is a sample Linux configuration file, followed by an explanation for some of the key settings. You don't need to make any changes to the file:

```json
{
	   "cniVersion":"0.3.0",
	   "name":"azure",
	   "plugins":[
	      {
	         "type":"azure-vnet",
	         "mode":"bridge",
	         "bridge":"azure0",
	         "ipam":{
	            "type":"azure-vnet-ipam"
	         }
	      },
	      {
	         "type":"portmap",
	         "capabilities":{
	            "portMappings":true
	         },
	         "snat":true
	      }
	   ]
}
```

#### Settings explanation

- **"cniVersion"**: The Azure Virtual Network CNI plug-ins support versions 0.3.0 and 0.3.1 of the [CNI spec](https://github.com/containernetworking/cni/blob/master/SPEC.md).

- **"name"**: Name of the network. This property can be set to any unique value.

- **"type"**: Name of the network plug-in. Set to **azure-vnet**.

- **"mode"**: Operational mode. This field is optional. The only mode supported is "bridge". For more information, see [operational modes](https://github.com/Azure/azure-container-networking/blob/master/docs/network.md).

- **"bridge"**: Name of the bridge that is used to connect containers to a virtual network. This field is optional. If omitted, the plugin automatically picks a unique name, based on the main interface index.

- **"ipam"** - **"type"**: Name of the IPAM plug-in. Always set to **azure-vnet-ipam**.

## Download and install the plug-in

Download the plug-in from [GitHub](https://github.com/Azure/azure-container-networking/releases). Download the latest version for the platform that you're using:

- **Linux**: [azure-vnet-cni-linux-amd64-\<version no.\>.tgz](https://github.com/Azure/azure-container-networking/releases/download/v1.4.20/azure-vnet-cni-linux-amd64-v1.4.20.tgz)

- **Windows**: [azure-vnet-cni-windows-amd64-\<version no.\>.zip](https://github.com/Azure/azure-container-networking/releases/download/v1.4.20/azure-vnet-cni-windows-amd64-v1.4.20.zip)

Copy the install script for [Linux](https://github.com/Azure/azure-container-networking/blob/master/scripts/install-cni-plugin.sh) or [Windows](https://github.com/Azure/azure-container-networking/blob/master/scripts/Install-CniPlugin.ps1) to your computer. Save the script to a `scripts` directory on your computer and name the file `install-cni-plugin.sh` for Linux, or `install-cni-plugin.ps1` for Windows.

To install the plug-in, run the appropriate script for your platform, specifying the version of the plug-in you're using. For example, you might specify *v1.4.20*. For the Linux install, provide an appropriate [CNI plugin version](https://github.com/containernetworking/plugins/releases), such as *v1.0.1*:

   ```bash
   scripts/install-cni-plugin.sh [azure-cni-plugin-version] [cni-plugin-version]
   ```

   ```powershell
   scripts\\ install-cni-plugin.ps1 [azure-cni-plugin-version]
   ```

The script installs the plug-in under `/opt/cni/bin` for Linux and `c:\cni\bin` for Windows. The installed plug-in comes with a simple network configuration file that works after installation. It doesn't need to be updated. To learn more about the settings in the file, see [CNI network configuration file](#cni-network-configuration-file).
