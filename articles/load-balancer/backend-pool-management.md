---
title: Backend Pool Management
titleSuffix: Azure Load Balancer
description: Get started learning how to configure and manage the backend pool of an Azure Load Balancer
services: load-balancer
author: asudbring
ms.service: load-balancer
ms.topic: how-to
ms.date: 01/28/2021
ms.author: allensu 
ms.custom: devx-track-azurepowershell

---
# Backend pool management
The backend pool is a critical component of the load balancer. The backend pool defines the group of resources that will serve traffic for a given load-balancing rule.

There are two ways of configuring a backend pool:
* Network Interface Card (NIC)
* Combination of IP address and Virtual Network (VNET) Resource ID

Configure your backend pool by NIC when using existing virtual machines and virtual machine scale sets. This method builds the most direct link between your resource and the backend pool.

When preallocating your backend pool with an IP address range which you plan to later create virtual machines and virtual machine scale sets, configure your backend pool by IP address and VNET ID combination.

You can configure IP-based and NIC-based backend pools for the same load balancer however, you cannot create a single backend pool that mixes backed addresses targeted by NIC and IP addresses within the same pool.

The configuration sections of this article will focus on:

* Azure PowerShell
* Azure CLI
* REST API
* Azure Resource Manager templates

These sections give insight into how the backend pools are structured for each configuration option.

## Configuring backend pool by NIC
The backend pool is created as part of the load balancer operation. The IP configuration property of the NIC is used to add backend pool members.

The following examples are focused on the create and populate operations for the backend pool to highlight this workflow and relationship.

  >[!NOTE]
  >It is important to note that backend pools configured via network interface cannot be updated as part of an operation on the backend pool. Any addition or deletion of backend resources must occur on the network interface of the resource.

### PowerShell
Create a new backend pool:
 
```azurepowershell-interactive
$resourceGroup = "myResourceGroup"
$loadBalancerName = "myLoadBalancer"
$backendPoolName = "myBackendPool"

$backendPool =
New-AzLoadBalancerBackendAddressPool -ResourceGroupName $resourceGroup -LoadBalancerName $loadBalancerName -BackendAddressPoolName $backendPoolName  
```

Create a new network interface and add it to the backend pool:

```azurepowershell-interactive
$resourceGroup = "myResourceGroup"
$loadBalancerName = "myLoadBalancer"
$backendPoolName = "myBackendPool"
$nicname = "myNic"
$location = "eastus"
$vnetname = <your-vnet-name>

$vnet =
Get-AzVirtualNetwork -Name $vnetname -ResourceGroupName $resourceGroup

$nic =
New-AzNetworkInterface -ResourceGroupName $resourceGroup -Location $location -Name $nicname -LoadBalancerBackendAddressPool $backendPoolName -Subnet $vnet.Subnets[0]
```

Retrieve the backend pool information for the load balancer to confirm that this network interface is added to the backend pool:

```azurepowershell-interactive
$resourceGroup = "myResourceGroup"
$loadBalancerName = "myLoadBalancer"
$backendPoolName = "myBackendPool"

$lb =
Get-AzLoadBalancer -ResourceGroupName $res
Get-AzLoadBalancerBackendAddressPool -ResourceGroupName $resourceGroup -LoadBalancerName $loadBalancerName -BackendAddressPoolName $backendPoolName 
```

Create a new virtual machine and attach the network interface to place it in the backend pool:

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
Create the backend pool:

```azurecli-interactive
az network lb address-pool create \
--resource-group myResourceGroup \
--lb-name myLB \
--name myBackendPool
```

Create a new network interface and add it to the backend pool:

```azurecli-interactive
az network nic create \
--resource-group myResourceGroup \
--name myNic \
--vnet-name myVnet \
--subnet mySubnet \
--network-security-group myNetworkSecurityGroup \
--lb-name myLB \
--lb-address-pools myBackEndPool
```

Retrieve the backend pool to confirm the IP address have been correctly added:

```azurecli-interactive
az network lb address-pool show \
--resource-group myResourceGroup \
--lb-name myLb \
--name myBackendPool
```

Create a new virtual machine and attach the network interface to place it in the backend pool:

```azurecli-interactive
az vm create \
--resource-group myResourceGroup \
--name myVM \
--nics myNic \
--image UbuntuLTS \
--admin-username azureuser \
--generate-ssh-keys
```

### Resource Manager Template

Follow this [quickstart Resource Manager template](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.network/load-balancer-standard-create/) to deploy a load balancer and virtual machines and add the virtual machines to the backend pool via network interface.

Follow this [quickstart Resource Manager template](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.network/load-balancer-ip-configured-backend-pool) to deploy a load balancer and virtual machines and add the virtual machines to the backend pool via IP address.


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
A Backend Pool configured by IP address has the following limitations:
  * Can only be used for Standard load balancers
  * Limit of 100 IP addresses in the backend pool
  * The backend resources must be in the same virtual network as the load balancer
  * A Load Balancer with IP-based Backend Pool cannot function as a Private Link service
  * ACI containers are not currently supported by this feature
  * Load balancers or services such as Application Gateway cannot be placed in the backend pool of the load balancer
  * Inbound NAT Rules cannot be specified by IP address

>[!Important]
> When a backend pool is configured by IP address, it will behave as a Basic Load Balancer with default outbound enabled. For secure by default configuration and applications with demanding outbound needs, configure the backend pool by NIC.

## Next steps
In this article, you learned about Azure Load Balancer backend pool management and how to configure a backend pool by IP address and virtual network.

Learn more about [Azure Load Balancer](load-balancer-overview.md).

Review the [REST API](/rest/api/load-balancer/loadbalancerbackendaddresspools/createorupdate) for IP based backendpool management.
