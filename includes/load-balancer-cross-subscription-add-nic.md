---
 title: include file
 description: include file
 services: load-balancer
 author: mbender
 ms.service: load-balancer
 ms.topic: include
 ms.date: 05/31/2024
 ms.author: mbender-ms
ms.custom: include-file
---


## Attach network interface cards to the load balancer

# [Azure PowerShell](#tab/azurepowershell)
In this section, you attach the network interface card (NIC) in **Azure Subscription A** to the load balancer in **Azure Subscription B**. You create a network interface with [`New-AzNetworkInterface`](/powershell/module/az.network/new-aznetworkinterface) and then create an IP configuration for the network interface card with [`New-AzNetworkInterfaceIpConfig`](/powershell/module/az.network/new-aznetworkinterfaceipconfig).

> [!NOTE]
> The network interface card (NIC) must be in the same VNet as the load balancer’s backend pool.

```azurepowershell

# Set the subscription context to **Azure Subscription A**
Set-AzContext -Subscription 'Sub A' 

# Create a network interface card
$IP1 = @{
    Name = 'MyIpConfig'
    subnetID= $vnet.subnets[0].Id
    PrivateIpAddressVersion = 'IPv4'
-LoadBalancerBackendAddressPool $lb-be-info
}
$IP1Config = New-AzNetworkInterfaceIpConfig @IP1 -Primary
$nic = @{
    Name = 'MyNic'
    ResourceGroupName = '<Resoure Group Subscription A>'
    Location = 'eastus'
    IpConfiguration = $IP1Config
}
New-AzNetworkInterface @nic
```

# [Azure CLI](#tab/azurecli)

In this section, you attach the network interface card (NIC) in **Azure Subscription A** to the load balancer in **Azure Subscription B** with [`az network nic create`](/cli/azure/network/nic#az-network-nic-create)

> [!NOTE]
> The network interface card (NIC) must be in the same VNet as the load balancer’s backend pool.

```azurecli
# Set the subscription context to **Azure Subscription A**
Az account set –subscription 'Sub A'

# Attach the network interface card to the load balancer
az network nic create --name NIC --resource-group NIC-rg --vnet VNET-name --lb-address-pool "/subscriptions/<Subscription B ID>/resourceGroups/myResourceGroupLB/providers/Microsoft.Network/loadBalancers/myLoadBalancer/backendAddressPools/BackendPool1"
```
---
