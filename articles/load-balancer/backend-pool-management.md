---
title: Backend Pool Management
titleSuffix: Azure Load Balancer
description: Get started learning how to configure and manage the backend pool of an Azure Load Balancer
services: load-balancer
author: asudbring
ms.service: load-balancer
ms.topic: how-to
ms.date: 12/27/2021
ms.author: allensu 
ms.custom: devx-track-azurepowershell

---
# Backend pool management
The backend pool is a critical component of the load balancer. The backend pool defines the group of resources that will serve traffic for a given load-balancing rule.

There are two ways of configuring a backend pool:
* Network Interface Card (NIC)
* IP address

When preallocating your backend pool with an IP address range which you plan to later create virtual machines and virtual machine scale sets, configure your backend pool by IP address and VNET ID combination.

This article focuses on configuration of backend pools by IP addresses.

## Configure backend pool by IP address and virtual network
In scenarios with pre-populated backend pools, use IP and virtual network.

All backend pool management is done directly on the backend pool object as highlighted in the examples below.

### PowerShell
Create new backend pool:

```azurepowershell-interactive
$resourceGroup = "myResourceGroup"
$loadBalancerName = "myLoadBalancer"
$backendPoolName = "myBackendPool"
$vnetName = "myVnet"
$location = "eastus"
$nicName = "myNic"

$backendPool = New-AzLoadBalancerBackendAddressPool -ResourceGroupName $resourceGroup -LoadBalancerName $loadBalancerName -Name $backendPoolName  
```

Update backend pool with a new IP from existing virtual network:
 
```azurepowershell-interactive
$virtualNetwork = 
Get-AzVirtualNetwork -Name $vnetName -ResourceGroupName $resourceGroup 
 
$ip1 = New-AzLoadBalancerBackendAddressConfig -IpAddress "10.0.0.5" -Name "TestVNetRef" -VirtualNetwork $virtualNetwork  
 
$backendPool.LoadBalancerBackendAddresses.Add($ip1) 

Set-AzLoadBalancerBackendAddressPool -InputObject $backendPool
```

Retrieve the backend pool information for the load balancer to confirm that the backend addresses are added to the backend pool:

```azurepowershell-interactive
Get-AzLoadBalancerBackendAddressPool -ResourceGroupName $resourceGroup -LoadBalancerName $loadBalancerName -Name $backendPoolName 
```
Create a network interface and add it to the backend pool. Set the IP address to one of the backend addresses:

```azurepowershell-interactive
$nic =
New-AzNetworkInterface -ResourceGroupName $resourceGroup -Location $location -Name $nicName -PrivateIpAddress 10.0.0.4 -Subnet $virtualNetwork.Subnets[0]
```

Create a VM and attach the NIC with an IP address in the backend pool:
```azurepowershell-interactive
# Create a username and password for the virtual machine
$cred = Get-Credential

# Create a virtual machine configuration
$vmname = "myVM1"
$vmsize = "Standard_DS1_v2"
$pubname = "MicrosoftWindowsServer"
$nicname = "myNic"
$off = "WindowsServer"
$sku = "2019-Datacenter"
$resourceGroup = "myResourceGroup"
$location = "eastus"

$nic =
Get-AzNetworkInterface -Name $nicname -ResourceGroupName $resourceGroup

$vmConfig =
New-AzVMConfig -VMName $vmname -VMSize $vmsize | Set-AzVMOperatingSystem -Windows -ComputerName $vmname -Credential $cred | Set-AzVMSourceImage -PublisherName $pubname -Offer $off -Skus $sku -Version latest | Add-AzVMNetworkInterface -Id $nic.Id

# Create a virtual machine using the configuration
$vm1 = New-AzVM -ResourceGroupName $resourceGroup -Zone 1 -Location $location -VM $vmConfig
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
  * Limit of 100 IP addresses in the backend pool for IP based LBs
  * The backend resources must be in the same virtual network as the load balancer for IP based LBs
  * A Load Balancer with IP-based Backend Pool cannot function as a Private Link service
  * ACI containers are not currently supported by IP based LBs
  * Load Balancers or services such as Application Gateway cannot be placed in the backend pool of the load balancer
  * Inbound NAT Rules cannot be specified by IP address
  * You can configure IP-based and NIC-based backend pools for the same load balancer however, you cannot create a single backend pool that mixes backed addresses targeted by NIC and IP addresses within the same pool.

>[!Important]
> When a backend pool is configured by IP address, it will behave as a Basic Load Balancer with default outbound enabled. For secure by default configuration and applications with demanding outbound needs, configure the backend pool by NIC.

## Next steps
In this article, you learned about Azure Load Balancer backend pool management and how to configure a backend pool by IP address and virtual network.

Learn more about [Azure Load Balancer](load-balancer-overview.md).

Review the [REST API](/rest/api/load-balancer/loadbalancerbackendaddresspools/createorupdate) for IP based backendpool management.
