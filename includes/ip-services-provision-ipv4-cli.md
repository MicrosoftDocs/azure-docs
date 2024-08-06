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

# [Unified model](#tab/azurecli/unified)

The following steps display the procedure for provisioning a sample customer range (1.2.3.0/24) to the US West 2 region.

> [!NOTE]
> Clean up or delete steps aren't shown on this page given the nature of the resource. For information on removing a provisioned custom IP prefix, see [Manage custom IP prefix](../articles/virtual-network/ip-services/manage-public-ip-address-prefix.md).

### Create a resource group and specify the prefix and authorization messages

Create a resource group in the desired location for provisioning the BYOIP range.

```azurecli-interactive
  az group create \
    --name myResourceGroup \
    --location westus2
```
### Provision a unified custom IP address prefix
The following command creates a custom IP prefix in the specified region and resource group. Specify the exact prefix in CIDR notation as a string to ensure there's no syntax error. For the `--authorization-message` parameter, use the variable **$byoipauth** that contains your subscription ID, prefix to be provisioned, and expiration date matching the Validity Date on the ROA. Ensure the format is in that order. Use the variable **$byoipauthsigned** for the `--signed-message` parameter created in the certificate readiness section.

```azurecli-interactive
  byoipauth="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|1.2.3.0/24|yyyymmdd"
  
  az network custom-ip prefix create \
    --name myCustomIpPrefix \
    --resource-group myResourceGroup \
    --location westus2 \
    --cidr ‘1.2.3.0/24’ \
    --zone 1 2 3
    --authorization-message $byoipauth \
    --signed-message $byoipauthsigned
```
The range is pushed to the Azure IP Deployment Pipeline. The deployment process is asynchronous. To determine the status, execute the following command:   

 ```azurecli-interactive
  az network custom-ip prefix show \
    --name myCustomIpPrefix \
    --resource-group myResourceGroup
```
Sample output is shown below, with some fields removed for clarity:

```
{
  "cidr": "1.2.3.0/24",
  "commissionedState": "Provisioning",
  "id": "/subscriptions/xxxx/resourceGroups/myResourceGroup/providers/Microsoft.Network/customIPPrefixes/myCustomIpPrefix",
  "location": "westus2",
  "name": myCustomIpPrefix,
  "resourceGroup": "myResourceGroup",
}
```

The **CommissionedState** field should show the range as **Provisioning** initially, followed in the future by **Provisioned**.

> [!NOTE]
> The estimated time to complete the provisioning process is 30 minutes.

> [!IMPORTANT]
> After the custom IP prefix is in a **Provisioned** state, a child public IP prefix can be created. These public IP prefixes and any public IP addresses can be attached to networking resources. For example, virtual machine network interfaces or load balancer front ends. The IPs won't be advertised and therefore won't be reachable. For more information on a migration of an active prefix, see [Manage a custom IP prefix](../articles/virtual-network/ip-services/manage-public-ip-address-prefix.md).

### Commission the unified custom IP address prefix

When the custom IP prefix is in **Provisioned** state, the following command updates the prefix to begin the process of advertising the range from Azure.

```azurecli-interactive
az network custom-ip prefix update \
    --name myCustomIpPrefix \
    --resource-group myResourceGroup \
    --state commission 
```

As before, the operation is asynchronous. Use [az network custom-ip prefix show](/cli/azure/network/custom-ip/prefix#az-network-custom-ip-prefix-show) to retrieve the status. The **CommissionedState** field will initially show the prefix as **Commissioning**, followed in the future by **Commissioned**. The advertisement rollout isn't completed all at once. The range is partially advertised while still in the **Commissioning** status.

> [!NOTE]
> The estimated time to fully complete the commissioning process is 3-4 hours.

> [!IMPORTANT]
> As the custom IP prefix transitions to a **Commissioned** state, the range is being advertised with Microsoft from the local Azure region and globally to the Internet by Microsoft's wide area network under Autonomous System Number (ASN) 8075. Advertising this same range to the Internet from a location other than Microsoft at the same time could potentially create BGP routing instability or traffic loss. For example, a customer on-premises building. Plan any migration of an active range during a maintenance period to avoid impact. Additionally, you could take advantage of the regional commissioning feature to put a custom IP prefix into a state where it is only advertised within the Azure region it is deployed in--see [Manage a custom IP address prefix (BYOIP)](manage-custom-ip-address-prefix.md) for more information.

# [Global/Regional Model)](#tab/azurecli/globalregional)

The following steps display the modified steps for provisioning a sample global (parent) IP range (1.2.3.0/4) and regional (child) IP ranges to the US West 2 and US East 2 Regions.

> [!NOTE]
> Clean up or delete steps aren't shown on this page given the nature of the resource. For information on removing a provisioned custom IP prefix, see [Manage custom IP prefix](../articles/virtual-network/ip-services/manage-public-ip-address-prefix.md).

### Create a resource group and specify the prefix and authorization messages

Create a resource group in the desired location for provisioning the global range resource. Although the global range will be associated with a region, the prefix will be advertised by the Microsoft WAN to the Internet globally.

```azurecli-interactive
  az group create \
    --name myResourceGroup \
    --location westus2
```

### Provision a global custom IP address prefix

The following command creates a custom IP prefix in the specified region and resource group. Specify the exact prefix in CIDR notation as a string to ensure there's no syntax error. No zonal properties are provided because the global range isn't associated with any particular region (and therefore no regional availability zones). The global custom IP prefix resource will still sit in a region in your subscription; this has no bearing on how the range will be advertised by Microsoft.

```azurecli-interactive
  byoipauth="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|1.2.3.0/24|yyyymmdd"
  
  az network custom-ip prefix create \
    --name myCustomIPGlobalPrefix \
    --resource-group myResourceGroup \
    --location westus2 \
    --cidr ‘1.2.3.0/24’ \
    --authorization-message $byoipauth \
    --signed-message $byoipauthsigned
    --isparent
```

### Provision regional custom IP address prefixes

After the global custom IP prefix is in a **Provisioned** state, regional custom IP prefixes can be created. These ranges must always be of size /64 to be considered valid. The ranges can be created in any region (it doesn't need to be the same as the global custom IP prefix), keeping in mind any geolocation restrictions associated with the original global range. The "children" custom IP prefixes advertise from the region they're created in. Because the validation is only done for global custom IP prefix provision, no Authorization or Signed message is required (but availability zones can be utilized).

```azurecli-interactive
  az network custom-ip prefix create \
    --name myCustomIPRegionalPrefix1 \
    --resource-group myResourceGroup \
    --location westus2 \
    --cidr ‘1.2.3.0/25’ \
    --zone 1 2 3 \
    --cip-prefix-parent myCustomIPGlobalPrefix

  az network custom-ip prefix create \
    --name myCustomIPRegionalPrefix2 \
    --resource-group myResourceGroup \
    --location westus2 \
    --cidr ‘1.2.3.128/25’ \
    --zone 3
    --cip-prefix-parent myCustomIPGlobalPrefix
```

After the regional custom IP prefix is in a **Provisioned** state, public IP prefixes can be derived from the regional custom IP prefix. These public IP prefixes and any public IP addresses derived from them can be attached to networking resources, though they aren't yet being advertised.

### Commission the custom IP address prefixes

When commissioning custom IP prefixes using this model, the global and regional prefixes are treated separately. In other words, commissioning a regional custom IP prefix isn't connected to commissioning the global custom IP prefix.

:::image type="content" source="./media/create-custom-ip-address-prefix-portal/any-region-prefix-v4.png" alt-text="Diagram of custom IPv4 prefix showing parent prefix and child prefixes across multiple regions.":::

The safest strategy for range migrations is as follows:
1. Provision all required regional custom IP prefixes in their respective regions. Create public IP prefixes and public IP addresses and attach to resources.
2. Commission each regional custom IP prefix and test connectivity to the IPs within the region. Repeat for each regional custom IP prefix.
3. Commission the global custom IP prefix, which advertises the larger range to the Internet. Complete this step only after verifying all regional custom IP prefixes (and derived prefixes/IPs) work as expected.

Using the previous example ranges, the command sequence would be:

```azurecli-interactive
az network custom-ip prefix update \
    --name myCustomIPRegionalPrefix \
    --resource-group myResourceGroup \
    --state commission 

az network custom-ip prefix update \
    --name myCustomIPRegionalPrefix2 \
    --resource-group myResourceGroup \
    --state commission 
```
Followed by:

```azurecli-interactive
az network custom-ip prefix update \
    --name myCustomIPGlobalPrefix \
    --resource-group myResourceGroup \
    --state commission 
```

> [!NOTE]
> The estimated time to fully complete the commissioning process for a custom IP global prefix is 3-4 hours. The estimated time to fully complete the commissioning process for a custom IP regional prefix is 30 minutes.

It's possible to commission the global custom IP prefix before the regional custom IP prefixes. Doing this advertises the global range to the Internet before the regional prefixes are ready so it's not recommended for migrations of active ranges. You can decommission a global custom IP prefix while there are still active (commissioned) regional custom IP prefixes. Also, you can decommission a regional custom IP prefix while the global prefix is still active (commissioned).

[!INCLUDE [ip-services-provisioning-note-1](ip-services-provisioning-note-1.md)]
