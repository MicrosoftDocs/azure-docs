---
author: berndverst
ms.author: beverst
title: Private endpoints for Durable Task Scheduler
titleSuffix: Durable Task
description: Learn how to use private endpoints to secure connectivity between your apps and Durable Task Scheduler, and how to configure them using the Azure portal, CLI, PowerShell, or Bicep.
ms.topic: concept-article
ms.service: azure-functions
ms.subservice: durable-task-scheduler
ms.date: 06/12/2026

#customer intent: As a developer or cloud architect, I want to understand how private endpoints work with Durable Task Scheduler so that I can secure my orchestration traffic within a virtual network.
---

# Private endpoints for Durable Task Scheduler

A [private endpoint](/azure/private-link/private-endpoint-overview) is a network interface that connects you privately and securely to a service powered by Azure Private Link. You can use private endpoints with Durable Task Scheduler to allow apps in your virtual network to connect to the scheduler over a private connection, without exposing traffic to the public internet.

## Private endpoint connections

By default, apps connect to the Durable Task Scheduler over a public endpoint address in the format `{scheduler-name}-{suffix}.{region}.durabletask.io`. When you create a private endpoint for your scheduler resource, the endpoint is mapped to a private IP address in your virtual network. This configuration allows your apps to communicate with the scheduler over the private network link instead of the public internet.

A private endpoint for Durable Task Scheduler targets the `scheduler` subresource on the `Microsoft.DurableTask/schedulers` resource type.

Clients connecting through the private endpoint use the same endpoint address and authentication mechanism as clients connecting to the public endpoint. With private DNS configured, the scheduler endpoint resolves to the private IP address when the request originates from within the virtual network.

## Benefits

Private endpoints for Durable Task Scheduler enable you to:

- **Secure your scheduler** by configuring the firewall to block all connections on the public endpoint.
- **Increase security** for the virtual network by enabling you to block exfiltration of data from the virtual network.
- **Connect securely** from on-premises networks that connect to the virtual network using [VPN](/azure/vpn-gateway/vpn-gateway-about-vpngateways) or [ExpressRoute](/azure/expressroute/expressroute-introduction) with private peering.

## Network architecture

With a private endpoint, connectivity between the apps in the virtual network and the scheduler flows over the Microsoft backbone network. Traffic never traverses the public internet.

The following diagram illustrates the difference between public and private endpoint connectivity:

- **Without a private endpoint**, your app sends gRPC traffic over the public internet to the scheduler's public endpoint.
- **With a private endpoint**, your app sends gRPC traffic through the virtual network's private IP address, which routes through the Azure Private Link to the scheduler.

Both connection methods use TLS encryption and identity-based authentication via [managed identity](./durable-task-scheduler-identity.md).

## DNS configuration

When you create a private endpoint for a Durable Task Scheduler resource, the DNS resolution of the scheduler's endpoint must resolve to the private IP address assigned to the private endpoint. You can use one of the following approaches:

- **Azure Private DNS zones (recommended)**: Configure a [private DNS zone](/azure/dns/private-dns-overview), a virtual network link, and a private endpoint DNS zone group. The portal can configure this integration when you select it during endpoint creation. Creating a private endpoint through CLI or Bicep alone doesn't create these DNS resources.
- **Custom DNS server**: If you use a custom DNS server, add a DNS record for the scheduler endpoint that points to the private IP address of the private endpoint.
- **Host file (for testing)**: You can modify the host file on a virtual machine to point the scheduler endpoint to the private IP address of the private endpoint.

> [!IMPORTANT]
> Without proper DNS configuration, your apps aren't able to resolve the scheduler endpoint to the private IP address, and the private endpoint connection fails.

In commercial Azure, the expected private DNS zone is `privatelink.durabletask.io`, with target subresource/group ID `scheduler`. The zone name differs in other clouds. Use the scheduler's returned `requiredZoneNames` values when configuring DNS, rather than the web app or SQL zone names in the general tutorials.

Get the scheduler-specific DNS zone names from its [private link resources](/rest/api/durabletask/schedulers/list-private-links?view=rest-durabletask-2026-02-01). In Bash, set `SCHEDULER_RESOURCE_ID` to your scheduler's full resource ID and run:

```azurecli
SCHEDULER_RESOURCE_ID="/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.DurableTask/schedulers/<scheduler-name>"

az rest \
    --method get \
    --uri "https://management.azure.com${SCHEDULER_RESOURCE_ID}/privateLinkResources?api-version=2026-02-01" \
    --query "value[?properties.groupId=='scheduler'].properties.requiredZoneNames[]" \
    --output tsv
```

Use each returned `requiredZoneNames` value as a private DNS zone name. If no names are returned, check the scheduler resource and API response before proceeding.

## Public network access

Creating a private endpoint doesn't disable public network access. The scheduler's `properties.publicNetworkAccess` property supports these values:

- **`Enabled` (default)**: Public and private endpoint connections are allowed, subject to the applicable access controls.
- **`Disabled`**: Only connections through private endpoints are allowed.

Only after the private endpoint connection is approved, private DNS resolves the scheduler hostname to the private endpoint IP address, and an application successfully performs an authenticated scheduler operation, optionally disable public access. See [Verify DNS resolution and connectivity](#verify-dns-resolution-and-connectivity).

For an existing scheduler, use [az durabletask scheduler update](/cli/azure/durabletask/scheduler#az-durabletask-scheduler-update) from the Azure CLI `durabletask` extension:

```azurecli
az durabletask scheduler update \
    --name "<scheduler-name>" \
    --resource-group "<resource-group>" \
    --public-network-access Disabled
```

> [!NOTE]
> Disabling public network access also affects access to the [Durable Task Scheduler dashboard](./durable-task-scheduler-dashboard.md). To continue using the dashboard with private endpoints, ensure the dashboard is accessed from within the virtual network or through a network path that routes to the private endpoint, with DNS resolution to its private IP address. Private networking doesn't replace identity and RBAC authorization.

## Considerations

Keep the following considerations in mind when using private endpoints with Durable Task Scheduler:

- **Region**: The private endpoint must be deployed in the same region as the virtual network. The scheduler resource can be in a different region, though placing them in the same region is recommended for optimal latency.
- **SKU availability**: Private endpoints are supported on schedulers using both the [Dedicated SKU](./durable-task-scheduler-billing.md#dedicated-sku-pricing-and-capacity) and [Consumption SKU](./durable-task-scheduler-billing.md#consumption-sku).
- **Multiple private endpoints**: You can create multiple private endpoints for the same scheduler resource in different virtual networks to enable access from multiple networks.
- **Identity and RBAC**: Private endpoints secure the *network path* to the scheduler. You still need to configure [identity-based access control](./durable-task-scheduler-identity.md) to authenticate and authorize your apps.
- **Task hubs**: A private endpoint connection on the scheduler applies to all task hubs within that scheduler. You can't create private endpoint connections for individual task hubs.
- **Emulator**: The [Durable Task Scheduler emulator](./develop-with-durable-task-scheduler.md#durable-task-scheduler-emulator) runs locally and doesn't support private endpoints. Private endpoints apply only to scheduler resources deployed in Azure.

## Configure a private endpoint

To create a private endpoint for your Durable Task Scheduler resource, follow the general private endpoint creation steps for your preferred method. Regardless of the method you choose, use the following Durable Task Scheduler-specific values when configuring the private endpoint:

| Setting | Value |
|---|---|
| **Resource type** | `Microsoft.DurableTask/schedulers` |
| **Target sub-resource** | `scheduler` |

### Connection approval

The connection can be automatically approved when the creating identity has sufficient permissions on the **scheduler**, such as Owner or Contributor, or an equivalent custom role with `Microsoft.DurableTask/schedulers/PrivateEndpointConnectionsApproval/action`. Permission to create the network endpoint alone isn't sufficient for scheduler-side approval.

If the connection is **Pending**, an authorized scheduler approver must approve it before it can carry application traffic. In the Azure portal, open **Private Link Center > Pending connections**, select the connection targeting your scheduler, and select **Approve**. For more information, see [Manage a private endpoint connection](/azure/private-link/manage-private-endpoint).

# [Azure portal](#tab/portal)

1. Follow the steps in [Create a private endpoint using the Azure portal](/azure/private-link/create-private-endpoint-portal#create-a-private-endpoint).
1. On the **Resource** tab, select the resource type and target sub-resource values from the preceding table.
1. On the **DNS** tab, enable private DNS integration and verify that the zone names match the scheduler's `requiredZoneNames`. Link the zones to the virtual network used by your clients.
1. For the remaining virtual network and tags settings, follow the portal documentation.

# [Azure CLI](#tab/cli)

1. Follow the steps in [Create a private endpoint using the Azure CLI](/azure/private-link/create-private-endpoint-cli).
1. Run the `az network private-endpoint create` command, with `--private-connection-resource-id` set to the full resource ID of your Durable Task Scheduler resource.
1. Set `--group-id` to `scheduler`.

For example:

```azurecli
az network private-endpoint create \
    --name <private-endpoint-name> \
    --resource-group <resource-group> \
    --vnet-name <vnet-name> \
    --subnet <subnet-name> \
    --private-connection-resource-id /subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.DurableTask/schedulers/<scheduler-name> \
    --group-id scheduler \
    --connection-name <connection-name>
```

After creating the endpoint, configure DNS. For each zone name returned in [DNS configuration](#dns-configuration), create the zone and link it to the client virtual network. The following example assumes the endpoint, DNS zone, and virtual network are in the same resource group. If the zone or link already exists, reuse it.

```azurecli
RESOURCE_GROUP="<resource-group>"
PRIVATE_ENDPOINT_NAME="<private-endpoint-name>"
VNET_NAME="<vnet-name>"
DNS_ZONE_NAME="<required-zone-name-from-the-scheduler>"

az network private-dns zone create \
    --resource-group "$RESOURCE_GROUP" \
    --name "$DNS_ZONE_NAME"

az network private-dns link vnet create \
    --resource-group "$RESOURCE_GROUP" \
    --zone-name "$DNS_ZONE_NAME" \
    --name scheduler-vnet-link \
    --virtual-network "$VNET_NAME" \
    --registration-enabled false

DNS_ZONE_ID=$(az network private-dns zone show \
    --resource-group "$RESOURCE_GROUP" \
    --name "$DNS_ZONE_NAME" \
    --query id --output tsv)

az network private-endpoint dns-zone-group create \
    --resource-group "$RESOURCE_GROUP" \
    --endpoint-name "$PRIVATE_ENDPOINT_NAME" \
    --name scheduler-dns-zone-group \
    --private-dns-zone "$DNS_ZONE_ID" \
    --zone-name scheduler-zone-1
```

For additional required zones, create and link each zone, then use `az network private-endpoint dns-zone-group add` instead of `create`. Keep the group name `scheduler-dns-zone-group`, and use a distinct `--zone-name` for each zone configuration. These group, link, and configuration names are example resource names, not service-required DNS names.

# [Azure PowerShell](#tab/powershell)

Use **Az.Network 7.25.1 or later**, **Az.DurableTask 0.1.1 or later**, and **Az.PrivateDns**. These minimum versions add scheduler support to the common Private Link cmdlets and public network access configuration using the stable `2026-02-01` scheduler API. See the [Az.Network changelog](https://github.com/Azure/azure-powershell/blob/main/src/Network/Network/ChangeLog.md) and [Az.DurableTask changelog](https://github.com/Azure/azure-powershell/blob/main/src/DurableTask/DurableTask/ChangeLog.md).

The following walkthrough assumes an existing scheduler, virtual network, and subnet in the same subscription and resource group. The private endpoint and DNS zone group are new resources. The subnet must allow private endpoints, and its network security groups and routes must permit the required traffic. You need permission to create the network and DNS resources, in addition to the scheduler-side permissions described in [Connection approval](#connection-approval). Adjust resource groups if networking or DNS is managed separately.

**1. Install and import modules, then select your subscription.**

```azurepowershell
Install-Module Az.Network -MinimumVersion 7.25.1 -Scope CurrentUser -Repository PSGallery
Install-Module Az.DurableTask -MinimumVersion 0.1.1 -Scope CurrentUser -Repository PSGallery
Install-Module Az.PrivateDns -Scope CurrentUser -Repository PSGallery

Import-Module Az.Network -MinimumVersion 7.25.1
Import-Module Az.DurableTask -MinimumVersion 0.1.1
Import-Module Az.PrivateDns

Connect-AzAccount
Set-AzContext -SubscriptionId '<subscription-id>'
$ErrorActionPreference = 'Stop'

$resourceGroup = '<resource-group>'
$schedulerName = '<scheduler-name>'
$vnetName = '<vnet-name>'
$subnetName = '<subnet-name>'
$privateEndpointName = "pe-$schedulerName"
```

If older module versions are already loaded, start a fresh PowerShell session after installation, then import the required versions.

**2. Get the existing resources and create the private endpoint.**

Create the endpoint in the virtual network's region, which can differ from the scheduler's region.

```azurepowershell
$scheduler = Get-AzDurableTaskScheduler -ResourceGroupName $resourceGroup -Name $schedulerName
$vnet = Get-AzVirtualNetwork -ResourceGroupName $resourceGroup -Name $vnetName
$subnet = Get-AzVirtualNetworkSubnetConfig -Name $subnetName -VirtualNetwork $vnet

$connection = New-AzPrivateLinkServiceConnection `
    -Name "$privateEndpointName-connection" `
    -PrivateLinkServiceId $scheduler.Id `
    -GroupId 'scheduler'

$privateEndpoint = New-AzPrivateEndpoint `
    -ResourceGroupName $resourceGroup `
    -Name $privateEndpointName `
    -Location $vnet.Location `
    -Subnet $subnet `
    -PrivateLinkServiceConnection $connection
```

If you lack scheduler-side approval permissions, add `-ByManualRequest` to [New-AzPrivateEndpoint](/powershell/module/az.network/new-azprivateendpoint). Have an authorized approver complete step 4. Don't retry creation if a pending endpoint already exists.

**3. Discover and configure the required private DNS zones.**

[Get-AzPrivateLinkResource](/powershell/module/az.network/get-azprivatelinkresource) returns `GroupId` and `RequiredZoneNames` directly on each PowerShell object. Reuse existing zones and virtual network links where available.

```azurepowershell
$zoneNames = @(Get-AzPrivateLinkResource -PrivateLinkResourceId $scheduler.Id |
    Where-Object { $_.GroupId -eq 'scheduler' } |
    ForEach-Object { $_.RequiredZoneNames } |
    Sort-Object -Unique)

if ($zoneNames.Count -eq 0) {
    throw 'The scheduler returned no required DNS zones. Check its private link resources.'
}

$zoneConfigs = @(
    foreach ($zoneName in $zoneNames) {
        $zone = Get-AzPrivateDnsZone -ResourceGroupName $resourceGroup |
            Where-Object { $_.Name -eq $zoneName }
        if (-not $zone) {
            $zone = New-AzPrivateDnsZone -ResourceGroupName $resourceGroup -Name $zoneName
        }

        $existingLink = Get-AzPrivateDnsVirtualNetworkLink `
            -ResourceGroupName $resourceGroup -ZoneName $zoneName |
            Where-Object { $_.VirtualNetworkId -eq $vnet.Id }
        if (-not $existingLink) {
            New-AzPrivateDnsVirtualNetworkLink `
                -ResourceGroupName $resourceGroup `
                -ZoneName $zoneName `
                -Name 'scheduler-vnet-link' `
                -VirtualNetworkId $vnet.Id | Out-Null
        }

        New-AzPrivateDnsZoneConfig `
            -Name ($zoneName.Replace('.', '-')) `
            -PrivateDnsZoneId $zone.ResourceId
    }
)

New-AzPrivateDnsZoneGroup `
    -ResourceGroupName $resourceGroup `
    -PrivateEndpointName $privateEndpointName `
    -Name 'scheduler-dns-zone-group' `
    -PrivateDnsZoneConfig $zoneConfigs
```

Omitting `-EnableRegistration` keeps auto-registration disabled for new virtual network links. Existing links should also have auto-registration disabled. The [DNS zone group](/powershell/module/az.network/new-azprivatednszonegroup) manages the endpoint's DNS records; don't create competing A records. Link each zone to every client virtual network that needs resolution. For custom DNS servers or connected networks, also configure appropriate DNS forwarding.

**4. Inspect and, if necessary, approve only this endpoint's connection.**

Query the scheduler's connections and match the exact private endpoint resource ID. If provisioning hasn't completed, wait and rerun the query.

```azurepowershell
$endpointConnections = @(Get-AzPrivateEndpointConnection -PrivateLinkResourceId $scheduler.Id |
    Where-Object { $_.PrivateEndpoint.Id -eq $privateEndpoint.Id })

if ($endpointConnections.Count -ne 1) {
    throw 'Expected exactly one scheduler connection for this endpoint. Inspect the connections.'
}

$endpointConnection = $endpointConnections[0]
$endpointConnection | Select-Object Name, Id,
    @{Name = 'Status'; Expression = { $_.PrivateLinkServiceConnectionState.Status }}
```

If its status is **Pending**, an authorized scheduler approver runs the following block. It uses the scheduler-side connection resource ID, not the network endpoint resource ID. Don't approve unrelated pending connections.

```azurepowershell
if ($endpointConnection.PrivateLinkServiceConnectionState.Status -eq 'Pending') {
    Approve-AzPrivateEndpointConnection `
        -ResourceId $endpointConnection.Id `
        -Description 'Approved for scheduler private connectivity'
}
```

Recheck the connection before proceeding. Allow time for approval and provisioning to complete.

```azurepowershell
$endpointConnection = Get-AzPrivateEndpointConnection -ResourceId $endpointConnection.Id
if ($endpointConnection.PrivateLinkServiceConnectionState.Status -ne 'Approved') {
    throw "Connection is not approved: $($endpointConnection.PrivateLinkServiceConnectionState.Status)"
}
```

**5. Verify private DNS and authenticated application connectivity.**

Retrieve the scheduler's hostname and the private endpoint network interface IP addresses:

```azurepowershell
$privateEndpoint = Get-AzPrivateEndpoint -ResourceGroupName $resourceGroup -Name $privateEndpointName
$privateIps = @($privateEndpoint.NetworkInterfaces | ForEach-Object {
    (Get-AzNetworkInterface -ResourceId $_.Id).IpConfigurations.PrivateIpAddress
})
$schedulerHost = ([uri]$scheduler.Endpoint).DnsSafeHost
$schedulerHost
$privateIps
```

From a **Windows client in the linked virtual network**, or a connected network with the required routing and DNS forwarding, substitute the hostname displayed above:

```powershell
$schedulerHost = '<scheduler-endpoint-hostname>'
Resolve-DnsName -Name $schedulerHost -Type A
Test-NetConnection -ComputerName $schedulerHost -Port 443
```

Confirm that DNS returns the private endpoint IP addresses, not public addresses. `Test-NetConnection` checks only TCP reachability. Also perform a scheduler operation using your application's configured identity and SDK to verify authentication, authorization, and application connectivity. Correct any DNS, forwarding, routing, or approval issues before restricting public access.

**6. Optionally disable public network access.**

Only after all previous checks succeed, use [Update-AzDurableTaskScheduler](/powershell/module/az.durabletask/update-azdurabletaskscheduler), then verify the setting:

```azurepowershell
Update-AzDurableTaskScheduler `
    -ResourceGroupName $resourceGroup `
    -Name $schedulerName `
    -PublicNetworkAccess 'Disabled'

Get-AzDurableTaskScheduler -ResourceGroupName $resourceGroup -Name $schedulerName |
    Select-Object Name, PublicNetworkAccess
```

The returned `PublicNetworkAccess` should be `Disabled`. Review the dashboard network, DNS, and RBAC requirements in [Public network access](#public-network-access) before making this change.

# [Bicep](#tab/bicep)

1. Follow the steps in [Create a private endpoint using Bicep](/azure/private-link/create-private-endpoint-bicep).
1. In your Bicep template, set the `privateLinkServiceConnections` to reference your Durable Task Scheduler resource.
1. Use `scheduler` as the group ID.
1. Replace the tutorial's SQL private DNS zone name with the scheduler's `requiredZoneNames` from [DNS configuration](#dns-configuration).
1. Create a `Microsoft.Network/privateDnsZones` resource for each returned zone name, link each zone to the client virtual network with `Microsoft.Network/privateDnsZones/virtualNetworkLinks` (`registrationEnabled: false`), and associate the zones with the private endpoint through `Microsoft.Network/privateEndpoints/privateDnsZoneGroups`. In the zone group's `privateDnsZoneConfigs` array, set each entry's `properties.privateDnsZoneId` to the corresponding zone resource ID. Reuse existing zones and virtual network links where appropriate.

For example, the private endpoint resource references the scheduler as follows. Include the DNS resources described in the preceding steps in the same template; this endpoint resource alone doesn't configure DNS.

```bicep
resource privateEndpoint 'Microsoft.Network/privateEndpoints@2024-05-01' = {
  name: privateEndpointName
  location: location
  properties: {
    subnet: {
      id: subnetId
    }
    privateLinkServiceConnections: [
      {
        name: connectionName
        properties: {
          privateLinkServiceId: schedulerResourceId
          groupIds: [
            'scheduler'
          ]
        }
      }
    ]
  }
}
```

---

## Verify DNS resolution and connectivity

From a client in the linked virtual network (or a connected network with the appropriate DNS forwarding), resolve the scheduler's endpoint hostname:

```bash
nslookup <scheduler-endpoint-hostname>
```

Verify that the returned address matches the private IP address assigned to the private endpoint's network interface. Confirm that the private endpoint connection is approved, then test access using your application's configured identity. If the hostname still resolves publicly, correct the private DNS zone, virtual network link, DNS zone group, or custom DNS forwarding before disabling public network access.

## Next steps

> [!div class="nextstepaction"]
> [Configure managed identity for Durable Task Scheduler](./durable-task-scheduler-identity.md)

- [Learn more about Azure Private Link](/azure/private-link/private-link-overview)
- [Learn more about Azure Private Endpoints](/azure/private-link/private-endpoint-overview)
- [About Durable Task Scheduler](./durable-task-scheduler.md)
