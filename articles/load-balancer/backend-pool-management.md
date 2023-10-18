---
title: Backend Pool Management
titleSuffix: Azure Load Balancer
description: Get started learning how to configure and manage the backend pool of an Azure Load Balancer.
services: load-balancer
author: mbender-ms
ms.service: load-balancer
ms.topic: how-to
ms.date: 02/03/2023
ms.author: mbender 
ms.custom: template-how-to, devx-track-azurepowershell, devx-track-azurecli, engagement-fy23
---

# Backend pool management

The backend pool is a critical component of the load balancer. The backend pool defines the group of resources that will serve traffic for a given load-balancing rule.

There are two ways of configuring a backend pool:

* Network Interface Card (NIC)

* IP address

To preallocate a backend pool with an IP address range that later will contain virtual machines and Virtual Machine Scale Sets, configure the pool by IP address and virtual network ID.
This article focuses on configuration of backend pools by IP addresses.

## Configure backend pool by IP address and virtual network

In scenarios with pre-populated backend pools, use IP and virtual network.

You configure backend pool management on the backend pool object as highlighted in the following examples.

### PowerShell

Create a new backend pool:

```azurepowershell-interactive
$be = @{
    ResourceGroupName = 'myResourceGroup'
    LoadBalancerName = 'myLoadBalancer'
    Name = 'myBackendPool'
}
$backendPool = New-AzLoadBalancerBackendAddressPool @be

```

Update backend pool with a new IP from existing virtual network:
 
```azurepowershell-interactive
$vnet = @{
    Name = 'myVnet'
    ResourceGroupName = 'myResourceGroup'
}
$virtualNetwork = Get-AzVirtualNetwork @vnet

$add1 = @{
    IpAddress = '10.0.0.5'
    Name = 'TestVNetRef'
    VirtualNetworkId = $virtualNetwork.Id
}
$ip1 = New-AzLoadBalancerBackendAddressConfig @add1
 
$backendPool.LoadBalancerBackendAddresses.Add($ip1) 

Set-AzLoadBalancerBackendAddressPool -InputObject $backendPool

```

Retrieve the backend pool information for the load balancer to confirm that the backend addresses are added to the backend pool:

```azurepowershell-interactive
$pool = @{
    ResourceGroupName = 'myResourceGroup'
    LoadBalancerName = 'myLoadBalancer'
    Name = 'myBackendPool'
}
Get-AzLoadBalancerBackendAddressPool @pool

```
Create a network interface and add it to the backend pool. Set the IP address to one of the backend addresses:

```azurepowershell-interactive
$net = @{
    Name = 'myNic'
    ResourceGroupName = 'myResourceGroup'
    Location = 'eastus'
    PrivateIpAddress = '10.0.0.5'
    Subnet = $virtualNetwork.Subnets[0]
}
$nic = New-AzNetworkInterface @net

```

Create a VM and attach the NIC with an IP address in the backend pool:

```azurepowershell-interactive
# Create a username and password for the virtual machine
$cred = Get-Credential

# Create a virtual machine configuration
$net = @{
    Name = 'myNic'
    ResourceGroupName = 'myResourceGroup'
}
$nic = Get-AzNetworkInterface @net

$vmc = @{
    VMName = 'myVM1'
    VMSize = 'Standard_DS1_v2'
}

$vmos = @{
    ComputerName = 'myVM1'
    Credential = $cred
}

$vmi = @{
    PublisherName = 'MicrosoftWindowsServer'
    Offer = 'WindowsServer'
    Skus = '2019-Datacenter'
    Version = 'latest'
}
$vmConfig = 
New-AzVMConfig @vmc | Set-AzVMOperatingSystem -Windows @vmos | Set-AzVMSourceImage @vmi | Add-AzVMNetworkInterface -Id $nic.Id


# Create a virtual machine using the configuration
$vm = @{
    ResourceGroupName = 'myResourceGroup'
    Zone = '1'
    Location = 'eastus'
    VM = $vmConfig

}
$vm1 = New-AzVM @vm

```

### CLI

Using CLI you can either populate the backend pool via command-line parameters or through a JSON configuration file.

Create and populate the backend pool via the command-line parameters:

```azurecli-interactive
az network lb address-pool create \
--resource-group myResourceGroup \
--lb-name myLB \
--name myBackendPool \
--vnet {VNET resource ID} \
--backend-address name=addr1 ip-address=10.0.0.4 \
--backend-address name=addr2 ip-address=10.0.0.5
```

Create and populate the Backend Pool via JSON configuration file:

```azurecli-interactive
az network lb address-pool create \
--resource-group myResourceGroup \
--lb-name myLB \
--name myBackendPool \
--vnet {VNET resource ID} \
--backend-address-config-file @config_file.json
```

JSON configuration file:
```JSON
        [
          {
            "name": "address1",
            "virtualNetwork": "/subscriptions/{subscriptionId}/resourceGroups/{resource-group-name}/providers/Microsoft.Network/virtualNetworks/{vnet-name}",
            "ipAddress": "10.0.0.4"
          },
          {
            "name": "address2",
            "virtualNetwork": "/subscriptions/{subscriptionId}/resourceGroups/{resource-group-name}/providers/Microsoft.Network/virtualNetworks/{vnet-name}",
            "ipAddress": "10.0.0.5"
          }
        ]
```

Retrieve the backend pool information for the load balancer to confirm that the backend addresses are added to the backend pool:

```azurecli-interactive
az network lb address-pool show \
--resource-group myResourceGroup \
--lb-name MyLb \
--name MyBackendPool
```

Create a network interface and add it to the backend pool. Set the IP address to one of the backend addresses:

```azurecli-interactive
az network nic create \
  --resource-group myResourceGroup \
  --name myNic \
  --vnet-name myVnet \
  --subnet mySubnet \
  --network-security-group myNetworkSecurityGroup \
  --lb-name myLB \
  --private-ip-address 10.0.0.4
```

Create a VM and attach the NIC with an IP address in the backend pool:

```azurecli-interactive
az vm create \
  --resource-group myResourceGroup \
  --name myVM \
  --nics myNic \
  --image UbuntuLTS \
  --admin-username azureuser \
  --generate-ssh-keys
```

### Limitations
  * IP based backends can only be used for Standard Load Balancers
  * The backend resources must be in the same virtual network as the load balancer for IP based LBs
  * A load balancer with IP based Backend Pool can’t function as a Private Link service
  * [Private endpoint resources](../private-link/private-endpoint-overview.md) can't be placed in an IP based backend pool
  * ACI containers aren't currently supported by IP based LBs
  * Load balancers or services such as Application Gateway can’t be placed in the backend pool of the load balancer
  * Inbound NAT Rules can’t be specified by IP address
  * You can configure IP based and NIC based backend pools for the same load balancer. You can’t create a single backend pool that mixes backed addresses targeted by NIC and IP addresses within the same pool.
  * A virtual machine in the same virtual network as an internal load balancer can't access the frontend of the ILB and its backend VMs simultaneously.
  * Internet routing preference IPs are currently not supported with IP based backend pools. Any Internet routing preference IPs in IP based backend pools will be billed and routed via the default Microsoft global network.
  * If backend pools are constantly changing (due to the constant addition or removal of backend resources). This may cause reset signals sent back to the source from the backend resource. As a workaround, you can use retries.

>[!Important]
> When a backend pool is configured by IP address, it will behave as a Basic Load Balancer with default outbound enabled. For secure by default configuration and applications with demanding outbound needs, configure the backend pool by NIC.

## Next steps

In this article, you learned about Azure Load Balancer backend pool management and how to configure a backend pool by IP address and virtual network.

Learn more about [Azure Load Balancer](load-balancer-overview.md).

Review the [REST API](/rest/api/load-balancer/loadbalancerbackendaddresspools/createorupdate) for IP based backend pool management.
