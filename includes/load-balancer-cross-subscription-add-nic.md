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
In this section, you attach network interface cards to the load balancer. You create a network interface with [`New-AzNetworkInterface`](/powershell/module/az.network/new-aznetworkinterface) and then create an IP configuration for the network interface card with [`New-AzNetworkInterfaceIpConfig`](/powershell/module/az.network/new-aznetworkinterfaceipconfig).

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
    Location = 'eastus’
    IpConfiguration = $IP1Config
}
New-AzNetworkInterface @nic
```

# [Azure CLI](#tab/azurecli)

This step is only performed with Azure PowerShell. It's unnecessary with Azure CLI.

---