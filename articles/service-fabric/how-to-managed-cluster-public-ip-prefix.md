---
title: Use a Public IP address prefix for a Service Fabric managed cluster
description: This article describes how to enable Public IP address prefix for Azure Service Fabric managed clusters.
ms.topic: how-to
ms.author: ankurjain
author: ankurjain
ms.service: service-fabric
ms.custom: devx-track-azurecli, devx-track-azurepowershell, devx-track-arm-template
services: service-fabric
ms.date: 07/05/2023
---

# Use a Public IP address prefix for a Service Fabric managed cluster

Public IP Prefix allows you to reserve a range of [public IP addresses](https://learn.microsoft.com/azure/virtual-network/ip-services/public-ip-addresses) for your public endpoints in Azure. Public IP prefixes are assigned from a pool of addresses in each Azure region. You create a public IP address prefix in an Azure region and subscription by specifying a name and prefix size, which is the number of addresses available for use. For example, if you would like to configure VM Scale Sets, application gateways, or load balancers to be public facing, you need public IP addresses for them. A public IP prefix enables you to use one prefix to manage all IP addresses effectively.
In regions with Availability Zones, Public IP address prefixes can be created as zone-redundant or associated with a specific availability zone. If public IP prefix is created as zone-redundant, the IPs in the prefix are chosen from the pool that is replicated across SLB servers in all zones.

Here are some of the benefits of using a Public IP Prefix for your managed cluster:

- Improved fleet management: If you manage a fleet of Service Fabric managed clusters, associating each cluster with a public IP from the same prefix can simplify the management of the entire fleet and reduce management overhead. For example, you can add an entire prefix with a single firewall rule that adds all IP addresses of the prefix associated with the SF managed clusters to an allowlist in the firewall.

- Enhanced control and security: By associating a public IP from a prefix to Service Fabric managed cluster, you can simplify the control and security of your cluster's public IP address space. Because the cluster is always assigned a public IP from the reserved range of IPs within the IP prefix, you can easily assign network access control lists (ACLs) and other network rules specific to that range. The IP prefix simplifies your control allowing you to easily manage which resources can access the cluster and vice versa.

- Effective resource management: A Public IP prefix enables you to use one prefix to manage all your public endpoints with predictable, contiguous IP range that doesn’t change as you scale. You can see which IP addresses are allocated and available within the prefix range. 

As seen in the diagram, a service fabric managed cluster with three node types having their own subnets has all their inbound and outbound traffic routed through the two load balancers. If external services would like to communicate with SFMC cluster, they would use the public IP addresses (allocated from public IP prefix, let’s say A) associated with the front end of the load balancers.

![Diagram depicting a managed cluster using a public IP prefix.](media/how-to-managed-cluster-public-ip-prefix/public-ip-prefix-scenario-diagram.png)

>[!NOTE] 
> The public IP address prefix in Service Fabric managed cluster only supports IPv4 addresses as of now. The support for IPv6 addresses will be enabled in near future.

## Prefix sizes

The following public IP prefix sizes are available:

-  /28 (IPv4) = 16 addresses

-  /29 (IPv4) = 8 addresses

-  /30 (IPv4) = 4 addresses

-  /31 (IPv4) = 2 addresses

Prefix size is specified as a Classless Inter-Domain Routing (CIDR) mask size.

There are no limits as to how many prefixes created in a subscription. The number of ranges created can't exceed more static public IP addresses than allowed in your subscription. For more information, see [Azure limits](https://learn.microsoft.com/azure/azure-resource-manager/management/azure-subscription-service-limits?toc=%2Fazure%2Fvirtual-network%2Ftoc.json#azure-resource-manager-virtual-networking-limits).


## Create a public IP address prefix for Service Fabric Managed Cluster

The following section describes the steps that should be taken to implement public IP prefix for Service Fabric managed cluster:

1.	Follow the steps in the [Create a public IP address prefix](https://learn.microsoft.com/azure/virtual-network/ip-services/create-public-ip-prefix-portal?tabs=create-default).
2.  Use a [sample ARM deployment template](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/SF-Managed-Standard-SKU-1-NT-PIPrefix) for public IP prefix configuration as part of the service fabric managed cluster creation.
3.	You can also modify your existing ARM template and expose new template property `PublicIPPrefixId` under `Microsoft.ServiceFabric/managedClusters` resource that takes the resource ID of the public IP prefix or update via Azure CLI, or PowerShell. Use Service Fabric API version `2023-03-01-Preview` or later.

#### ARM Template:

```json
{ 
    "type": "Microsoft.ServiceFabric/managedclusters/", 
    "properties": { 
                  "publicIPPrefixId": "string" 
                  } 
} 
```

#### Azure CLI:

##### Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with [az group create](/cli/azure/group#az-group-create) named **QuickStartCreateIPPrefix-rg** in the **eastus2** location.

```azurecli-interactive
  az group create \
    --name QuickStartCreateIPPrefix-rg \
    --location eastus2
```

##### Create a public IP address prefix

The following section describes the steps to create a zone redundant, zonal, and non-zonal public IP prefix using Azure CLI. 

The prefix in the example is * **IPv4** - /28 (16 addresses)

For more information on available prefix sizes, see [Prefix sizes](https://learn.microsoft.com/azure/virtual-network/ip-services/public-ip-address-prefix#prefix-sizes).

Create a public IP prefix with [az network public-ip prefix create](/cli/azure/network/public-ip/prefix#az-network-public-ip-prefix-create) named **myPublicIpPrefix** in the **eastus2** location.


# [**Zone redundant IPv4 prefix**](#tab/ipv4-zone-redundant)

To create a IPv4 public IP prefix, enter **IPv4** in the **`--version`** parameter. To create a zone redundant IPv4 prefix, enter **1,2,3** in the **`--zone`** parameter.

```azurecli-interactive
  az network public-ip prefix create \
    --length 28 \
    --name myPublicIpPrefix \
    --resource-group QuickStartCreateIPPrefix-rg \
    --location eastus2 \
    --version IPv4 \
    --zone 1 2 3
```

# [**Zonal IPv4 prefix**](#tab/ipv4-zonal)

To create a IPv4 public IP prefix, enter **IPv4** in the **`--version`** parameter. Enter **2** in the **`--zone`** parameter to create a zonal IP prefix in zone 2.

```azurecli-interactive
  az network public-ip prefix create \
    --length 28 \
    --name myPublicIpPrefix-zonal \
    --resource-group QuickStartCreateIPPrefix-rg \
    --location eastus2 \
    --version IPv4 \
    --zone 2
```

>[!NOTE]
>The above options for zones are only valid selections in regions with [Availability Zones](https://learn.microsoft.com/azure/reliability/availability-zones-overview?toc=%2Fazure%2Fvirtual-network%2Ftoc.json#availability-zones).

# [**Non-zonal IPv4 prefix**](#tab/ipv4-non-zonal)

To create a IPv4 public IP prefix, enter **IPv4** in the **`--version`** parameter. Remove the **`--zone`** parameter to create a non-zonal IP prefix.

```azurecli-interactive
  az network public-ip prefix create \
    --length 28 \
    --name myPublicIpPrefix-nozone \
    --resource-group QuickStartCreateIPPrefix-rg \
    --location eastus2 \
    --version IPv4
```

The removal of the **`--zone`** parameter in the command is valid in all regions.  

The removal of the **`--zone`** parameter is the default selection for standard public IP addresses in regions without [Availability Zones](https://learn.microsoft.com/azure/reliability/availability-zones-overview?toc=%2Fazure%2Fvirtual-network%2Ftoc.json#availability-zones).


# [**Routing Preference Internet IPv4 prefix**](#tab/ipv4-routing-pref)

To create a IPv4 public IP prefix with routing preference Internet, enter **RoutingPreference=Internet** in the **`--ip-tags`** parameter.

```azurecli-interactive
  az network public-ip prefix create \
    --length 28 \
    --name myPublicIpPrefix-rpinternet \
    --resource-group QuickStartCreateIPPrefix-rg \
    --location eastus2 \
    --version IPv4
    --iptags 'RoutingPreference=Internet'
```
---

##### Deploy the ARM template

Capture the resource ID from the Public IP prefix created into the ARM template and deploy the template.

  ```azurecli-interactive
    az deployment group create \
  	--name ExampleDeployment \
  	--resource-group ExampleGroup \
  	--template-file <path-to-template> 
```


#### Azure PowerShell:

##### Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) named **QuickStartCreateIPPrefix-rg** in the **eastus2** location.

```azurepowershell-interactive
$rg =@{
    Name = 'QuickStartCreateIPPrefix-rg'
    Location = 'eastus2'
}
New-AzResourceGroup @rg
```

##### Create a public IP address prefix

The following section describes the steps to create a zone redundant, zonal, and non-zonal public IP prefix using Azure PowerShell. 

The prefix in the example is * **IPv4** - /28 (16 addresses)

For more information on available prefix sizes, see [Prefix sizes](https://learn.microsoft.com/azure/virtual-network/ip-services/public-ip-address-prefix#prefix-sizes).

Create a public IP prefix with [New-AzPublicIpPrefix](/powershell/module/az.network/new-azpublicipprefix) named **myPublicIpPrefix** in the **eastus2** location.


# [**Zone redundant IPv4 prefix**](#tab/ipv4-zone-redundant-ps)

To create a IPv4 public IP prefix, enter **IPv4** in the **`-IpAddressVersion`** parameter. To create a zone redundant IPv4 prefix, enter **1,2,3** in the **`-Zone`** parameter.

```azurepowershell-interactive
$ipv4 =@{
    Name = 'myPublicIpPrefix'
    ResourceGroupName = 'QuickStartCreateIPPrefix-rg'
    Location = 'eastus2'
    PrefixLength = '28'
    IpAddressVersion = 'IPv4'
    Zone = 1,2,3
}
New-AzPublicIpPrefix @ipv4
```

# [**Zonal IPv4 prefix**](#tab/ipv4-zonal-ps)

To create a IPv4 public IP prefix, enter **IPv4** in the **`-IpAddressVersion`** parameter. Enter **2** in the **`-Zone`** parameter to create a zonal IP prefix in zone 2.

```azurepowershell-interactive
$ipv4 =@{
    Name = 'myPublicIpPrefix-zonal'
    ResourceGroupName = 'QuickStartCreateIPPrefix-rg'
    Location = 'eastus2'
    PrefixLength = '28'
    IpAddressVersion = 'IPv4'
    Zone = 2
}
New-AzPublicIpPrefix @ipv4
```

>[!NOTE]
>The above options for zones are only valid selections in regions with [Availability Zones](https://learn.microsoft.com/azure/reliability/availability-zones-overview?toc=%2Fazure%2Fvirtual-network%2Ftoc.json#availability-zones).

# [**Non-zonal IPv4 prefix**](#tab/ipv4-non-zonal-ps)

To create a IPv4 public IP prefix, enter **IPv4** in the **`-IpAddressVersion`** parameter. Remove the **`-Zone`** parameter to create a non-zonal IP prefix.

```azurepowershell-interactive
$ipv4 =@{
    Name = 'myPublicIpPrefix-nozone'
    ResourceGroupName = 'QuickStartCreateIPPrefix-rg'
    Location = 'eastus2'
    PrefixLength = '28'
    IpAddressVersion = 'IPv4'
}
New-AzPublicIpPrefix @ipv4
```

The removal of the **`-Zone`** parameter in the command is valid in all regions.  

The removal of the **`-Zone`** parameter is the default selection for standard public IP addresses in regions without [Availability Zones](https://learn.microsoft.com/azure/reliability/availability-zones-overview?toc=%2Fazure%2Fvirtual-network%2Ftoc.json#availability-zones).

# [**Routing Preference Internet IPv4 prefix**](#tab/ipv4-routing-pref-ps)

To create a IPv4 public IP prefix with routing preference Internet, create an **IpTag** with an **ipTagType** 'Routing Preference' and **Tag** 'Internet'.

```azurepowershell-interactive
$tagproperty = @{
IpTagType = 'RoutingPreference'
Tag = 'Internet'
}
$routingprefinternettag = New-Object -TypeName Microsoft.Azure.Commands.Network.Models.PSPublicIpPrefixTag -Property $tagproperty 
$ipv4 =@{
    Name = 'myPublicIpPrefix-routingprefinternet'
    ResourceGroupName = 'QuickStartCreateIPPrefix-rg'
    Location = 'eastus2'
    PrefixLength = '28'
    IpAddressVersion = 'IPv4'
    IpTag = $routingprefinternettag
}
New-AzPublicIpPrefix @ipv4
```

---

##### Deploy the ARM template

Capture the resource ID from the Public IP prefix created into the ARM template and deploy the template.

```azurepowershell-interactive
New-AzResourceGroupDeployment -ResourceGroupName "ExampleGroup" -TemplateFile <path-to-template> -TemplateParameterFile <path-to-template-parameter-file>
```

## Limitations

- You can't specify the set of IP addresses for the prefix (though you can specify which IP you want from the prefix). Azure gives the IP addresses for the prefix, based on the size that you specify.  Additionally, all public IP addresses created from the prefix must exist in the same Azure region and subscription as the prefix. Addresses must be assigned to resources in the same region and subscription.

- You can create a prefix of up to 16 IP addresses. Review [Network limits increase requests](https://learn.microsoft.com/azure/quotas/networking-quota-requests) and [Azure limits](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/azure-subscription-service-limits?toc=%2Fazure%2Fvirtual-network%2Ftoc.json#azure-resource-manager-virtual-networking-limits) for more information.

- The size of the range can't be modified after the prefix has been created.

- Only static public IP addresses created with the standard SKU can be assigned from the prefix's range. To learn more about public IP address SKUs, see [public IP address](https://learn.microsoft.com/azure/virtual-network/ip-services/public-ip-addresses#public-ip-addresses).

- Addresses from the range can only be assigned to Azure Resource Manager resources. Addresses can't be assigned to resources in the classic deployment model.

- You can't delete a prefix if any addresses within it are assigned to public IP address resources associated to a resource. Dissociate all public IP address resources that are assigned IP addresses from the prefix first. For more information on disassociating public IP addresses, see [Manage public IP addresses](https://learn.microsoft.com/azure/virtual-network/ip-services/virtual-network-public-ip-address#view-modify-settings-for-or-delete-a-public-ip-address).
  

## Next steps

> [!div class="nextstepaction"]
> [Review the Service Fabric managed cluster networking scenarios](how-to-managed-cluster-networking.md).
> 
> [!div class="nextstepaction"]
> [Review Service Fabric managed cluster configuration options](how-to-managed-cluster-configuration.md).
