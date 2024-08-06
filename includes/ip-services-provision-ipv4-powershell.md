---
 title: include file
 description: include file
 services: virtual-network
 sub-services: ip-services
 author: mbender-ms
 ms.service: azure-virtual-network
 ms.topic: include
 ms.date: 08/06/2024
 ms.author: mbender
 ms.custom: include file
---

# [Unified Model](#tab/unified/azurepowershell)

The following steps display the procedure for provisioning a sample customer range (1.2.3.0/24) to the US West 2 region.

> [!NOTE]
> Clean up or delete steps aren't shown on this page given the nature of the resource. For information on removing a provisioned custom IP prefix, see [Manage custom IP prefix](../articles/virtual-network/ip-services/manage-public-ip-address-prefix.md).

### Create a resource group and specify the prefix and authorization messages

Create a resource group in the desired location for provisioning the BYOIP range. 

```azurepowershell-interactive
$rg =@{
    Name = 'myResourceGroup'
    Location = 'WestUS2'
}
New-AzResourceGroup @rg
```

### Provision a unified custom IP address prefix

The following command creates a custom IP prefix in the specified region and resource group. Specify the exact prefix in CIDR notation as a string to ensure there's no syntax error. For the `-AuthorizationMessage` parameter, substitute your subscription ID, prefix to be provisioned, and expiration date matching the Validity Date on the ROA. Ensure the format is in that order. Use the variable **$byoipauthsigned** for the `-SignedMessage` parameter created in the certificate readiness section.

```azurepowershell-interactive
$prefix =@{
    Name = 'myCustomIPPrefix'
    ResourceGroupName = 'myResourceGroup'
    Location = 'WestUS2'
    CIDR = '1.2.3.0/24'
    AuthorizationMessage = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|1.2.3.0/24|yyyymmdd'
    SignedMessage = $byoipauthsigned
}
$myCustomIpPrefix = New-AzCustomIPPrefix @prefix -Zone 1,2,3
```

The range is pushed to the Azure IP Deployment Pipeline. The deployment process is asynchronous. To determine the status, execute the following command:  

```azurepowershell-interactive
Get-AzCustomIpPrefix -ResourceId $myCustomIpPrefix.Id
```

Here's a sample output with some fields removed for clarity:

```
Name              : myCustomIpPrefix
ResourceGroupName : myResourceGroup
Location          : westus2
Id                : /subscriptions/xxxx/resourceGroups/myResourceGroup/providers/Microsoft.Network/customIPPrefixes/MyCustomIPPrefix
Cidr              : 1.2.3.0/24
Zones             : {1, 2, 3}
CommissionedState : Provisioning
```

The **CommissionedState** field should show the range as **Provisioning** initially, followed in the future by **Provisioned**.

> [!NOTE]
> The estimated time to complete the provisioning process is 30 minutes.

> [!IMPORTANT]
> After the custom IP prefix is in a **Provisioned** state, a child public IP prefix can be created. These public IP prefixes and any public IP addresses can be attached to networking resources. For example, virtual machine network interfaces or load balancer front ends. The IPs won't be advertised and therefore won't be reachable. For more information on a migration of an active prefix, see [Manage a custom IP prefix](../articles/virtual-network/ip-services/manage-public-ip-address-prefix.md).

### Commission the unified custom IP address prefix

When the custom IP prefix is in the **Provisioned** state, the following command updates the prefix to begin the process of advertising the range from Azure.

```azurepowershell-interactive
Update-AzCustomIpPrefix -ResourceId $myCustomIPPrefix.Id -Commission
```

As before, the operation is asynchronous. Use [Get-AzCustomIpPrefix](/powershell/module/az.network/get-azcustomipprefix) to retrieve the status. The **CommissionedState** field will initially show the prefix as **Commissioning**, followed in the future by **Commissioned**. The advertisement rollout isn't completed all at once. The range is partially advertised while still in the **Commissioning** status.

> [!NOTE]
> The estimated time to fully complete the commissioning process is 3-4 hours.

> [!IMPORTANT]
> As the custom IP prefix transitions to a **Commissioned** state, the range is being advertised with Microsoft from the local Azure region and globally to the Internet by Microsoft's wide area network under Autonomous System Number (ASN) 8075. Advertising this same range to the Internet from a location other than Microsoft at the same time could potentially create BGP routing instability or traffic loss. For example, a customer on-premises building. Plan any migration of an active range during a maintenance period to avoid impact. Additionally, you could take advantage of the regional commissioning feature to put a custom IP prefix into a state where it is only advertised within the Azure region it is deployed in. For more information, see [Manage a custom IP address prefix (BYOIP)](../articles/virtual-network/ip-services/manage-public-ip-address-prefix.md).

# [Global/Regional Model](#tab/globalregional/azurepowershell)

The following steps display the modified steps for provisioning a sample global (parent) IP range (1.2.3.0/4) and regional (child) IP ranges to the US West 2 and US East 2 Regions.

> [!NOTE]
> Clean up or delete steps aren't shown on this page given the nature of the resource. For information on removing a provisioned custom IP prefix, see [Manage custom IP prefix](../articles/virtual-network/ip-services/manage-public-ip-address-prefix.md).

### Create a resource group and specify the prefix and authorization messages

Create a resource group in the desired location for provisioning the global range resource. Although the global range is associated with a region, the prefix is advertised by the Microsoft WAN to the Internet globally.

```azurepowershell-interactive
$rg =@{
    Name = 'myResourceGroup'
    Location = 'USWest2'
}
New-AzResourceGroup @rg
```

### Provision a global custom IP address prefix

The following command creates a custom IP prefix in the specified region and resource group. Specify the exact prefix in CIDR notation as a string to ensure there's no syntax error. No zonal properties are provided because the global range isn't associated with any particular region (and therefore no regional availability zones). The global custom IP prefix resource will still sit in a region in your subscription; this has no bearing on how the range is advertised by Microsoft.

```azurepowershell-interactive
$prefix =@{
    Name = 'myCustomGlobalPrefix'
    ResourceGroupName = 'myResourceGroup'
    Location = 'WestUS2'
    CIDR = '1.2.3.0/24'
    AuthorizationMessage = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|1.2.3.0/24|yyyymmdd'
    SignedMessage = $byoipauthsigned
}
$myCustomIPGlobalPrefix = New-AzCustomIPPrefix @prefix -IsParent
```
### Provision regional custom IP address prefixes

After the global custom IP prefix is in a **Provisioned** state, regional custom IP prefixes can be created. These ranges must always be of size /64 to be considered valid. The ranges can be created in any region (it doesn't need to be the same as the global custom IP prefix), keeping in mind any geolocation restrictions associated with the original global range. The *child* custom IP prefixes advertise from the region where they're created. Because the validation is only done for global custom IP prefix provision, no Authorization or Signed message is required (but availability zones can be utilized).

```azurepowershell-interactive
$prefix =@{
    Name = 'myCustomIPRegionalPrefix1'
    ResourceGroupName = 'myResourceGroup'
    Location = 'WestUS2'
    CIDR = '1.2.3.0/25'

}
$myCustomIPRegionalPrefix = New-AzCustomIPPrefix @prefix -CustomIpPrefixParent $myCustomIPGlobalPrefix -Zone 1,2,3

$prefix2 =@{
    Name = 'myCustomIPRegionalPrefix2'
    ResourceGroupName = 'myResourceGroup'
    Location = 'EastUS2'
    CIDR = '1.2.3.128/25'
}
$myCustomIPRegionalPrefix2 = New-AzCustomIPPrefix @prefix2 -CustomIpPrefixParent $myCustomIPGlobalPrefix -Zone 3
```

After the regional custom IP prefix is in a **Provisioned** state, public IP prefixes can be derived from the regional custom IP prefix. These public IP prefixes and any public IP addresses derived from them can be attached to networking resources, though they aren't yet being advertised.

### Commission the custom IP address prefixes

When commissioning custom IP prefixes using this model, the global and regional prefixes are treated separately. In other words, commissioning a regional custom IP prefix isn't connected to commissioning the global custom IP prefix.

:::image type="content" source="./media/create-custom-ip-address-prefix-portal/any-region-prefix-v4.png" alt-text="Diagram of custom IPv4 prefix showing parent prefix and child prefixes across multiple regions.":::

The safest strategy for range migrations is as follows:
1. Provision all required regional custom IP prefixes in their respective regions. Create public IP prefixes and public IP addresses and attach to resources.
2. Commission each regional custom IP prefix and test connectivity to the IPs within the region. Repeat for each regional custom IP prefix.
3. Commission the global custom IP prefix, which advertises the larger range to the Internet. Complete this step only after verifying all regional custom IP prefixes (and derived prefixes/IPs) work as expected.

With the previous example ranges, the command sequence would be:

```azurepowershell-interactive
Update-AzCustomIpPrefix -ResourceId $myCustomIPRegionalPrefix.Id -Commission
Update-AzCustomIpPrefix -ResourceId $myCustomIPRegionalPrefix2.Id -Commission
``` 
Followed by:

```azurepowershell-interactive
Update-AzCustomIpPrefix -ResourceId $myCustomIPGlobalPrefix.Id -Commission
```
> [!NOTE]
> The estimated time to fully complete the commissioning process for a custom IP global prefix is 3-4 hours. The estimated time to fully complete the commissioning process for a custom IP regional prefix is 30 minutes.

It's possible to commission the global custom IP prefix before the regional custom IP prefixes. Since this process advertises the global range to the Internet before the regional prefixes are ready, it's not recommended for migrations of active ranges. You can decommission a global custom IP prefix while there are still active (commissioned) regional custom IP prefixes. Also, you can decommission a regional custom IP prefix while the global prefix is still active (commissioned).

> [!IMPORTANT]
> As the global custom IP prefix transitions to a **Commissioned** state, the range is being advertised with Microsoft from the local Azure region and globally to the Internet by Microsoft's wide area network under Autonomous System Number (ASN) 8075. Advertising this same range to the Internet from a location other than Microsoft at the same time could potentially create BGP routing instability or traffic loss. For example, a customer on-premises building. Plan any migration of an active range during a maintenance period to avoid impact.

[!INCLUDE [ip-services-provisioning-note-1](ip-services-provisioning-note-1.md)]