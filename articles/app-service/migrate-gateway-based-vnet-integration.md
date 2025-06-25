---
title: Migrate from gateway-based to regional virtual network integration
description: Learn how to migrate your App Service virtual network integration from legacy gateway-based integration to modern regional virtual network integration for improved performance and capabilities.
author: seligj95
ms.topic: how-to
ms.date: 06/20/2025
ms.author: jordanselig
ms.custom: devx-track-azurecli, devx-track-azurepowershell
---
# Migrate from gateway-based to regional virtual network integration

App Service supports two types of virtual network integration: **regional virtual network integration** (recommended) and **gateway-based virtual network integration** (legacy). This article guides you through migrating from the legacy gateway-based approach to the modern regional integration method.

## Overview

Regional virtual network integration is the recommended approach for connecting your App Service apps to Azure virtual networks. Unlike gateway-based integration, regional integration doesn't require a VPN gateway and provides superior performance, broader feature support, and enhanced security capabilities.

**Why migrate?** More than 99% of App Service virtual network integrations use the regional method due to its advantages. Gateway-based integration should only be considered when you need to connect directly to a virtual network in a different region and you can't establish virtual network peering.

## Key differences and benefits

Gateway-based integration has significant limitations that regional integration addresses:

### Gateway-based integration limitations

Gateway-based integration can't be used in the following scenarios:

* With virtual networks connected to ExpressRoute
* From Linux apps
* From Windows container apps
* To access service endpoint-secured resources
* To resolve App Settings referencing a network-protected Key Vault
* With coexistence gateways supporting both ExpressRoute and point-to-site/site-to-site VPNs

### Feature comparison

| Feature | Regional virtual network integration | Gateway-based integration |
|:--------|:-------------------------------------|:--------------------------|
| **Gateway requirement** | None | Virtual network gateway required |
| **Bandwidth** | No VPN limitations | Limited by SSTP point-to-site VPN |
| **Connectivity** | Two subnets per App Service plan | Five virtual networks per plan |
| **Network features** | Route tables, NSGs, NAT gateway | Not supported |
| **Platform support** | Windows, Linux, Windows containers | Windows only |
| **Service endpoints** | Full support | Not supported |
| **Key Vault integration** | Network-protected Key Vault app setting support | Not supported |
| **ExpressRoute compatibility** | Full support | Not supported |
| **Cross-region connectivity** | Through global peering only | Direct connection supported |
| **Performance** | Native virtual network performance | VPN overhead |
| **Scaling** | Better resource utilization | Limited by gateway capacity |
| **Cost** | No extra charges | VPN Gateway charges ($19-$525/month) + bandwidth costs |

## Prerequisites

Before beginning the migration, ensure you have:

* **App Service plan**: A Basic, Standard, Premium, PremiumV2, PremiumV3, PremiumV4, or Elastic Premium plan
* **Virtual network**: A virtual network in the same region as your app
* **Subnet**: An empty subnet or a new subnet dedicated for virtual network integration
* **Permissions**: Appropriate RBAC permissions to configure virtual network integration
* **Planning**: Understanding of your current networking requirements and dependencies

## Migration planning and preparation

> [!IMPORTANT]
> The migration process is a disconnect/connect operation that **will cause downtime**. Virtual network integration is slot-specific and doesn't swap during deployment slot operations, requiring careful planning to minimize impact on your applications.

### Understanding downtime and impact

The migration involves a complete disconnection from gateway-based integration before connecting to regional integration. During this process:

- Your app loses connectivity to virtual network resources
- Dependencies on private endpoints, service endpoints, or internal services are interrupted  
- Downtime typically lasts 2-5 minutes depending on configuration complexity, but can be even longer

### Migration strategies

Choose the strategy that best fits your downtime tolerance and operational requirements:

#### Option 1: Blue-green deployment (minimal downtime)

**Best for: Production workloads requiring minimal downtime**

1. **Create a new App Service plan** in the same region
2. **Set up regional virtual network integration** on the new plan
3. **Deploy your application** to the new plan with regional integration
4. **Test thoroughly** to ensure connectivity works as expected
5. **Switch traffic** using Azure Traffic Manager, Application Gateway, or DNS changes
6. **Decommission** the old plan after verifying stability

#### Option 2: Deployment slot testing (minimal downtime)

**Best for: Thorough testing with brief production downtime**

Since virtual network integration is slot-specific, you can test regional virtual network integration on a staging slot:

1. **Prepare the integration subnet** in advance
2. **Configure regional VNet integration on your staging slot** using the prepared subnet
3. **Test your application thoroughly** on the staging slot with regional integration
4. **When ready, disconnect gateway-based integration from production** and configure regional integration on production
5. **Swap slots** to promote the tested code

> [!NOTE]
> Virtual network configurations remain with their respective slots after swapping. After slot swap, your production slot will have the tested application code and the newly configured regional virtual network integration if you configured it on the production slot prior to the slot swap.

#### Option 3: Direct migration (planned downtime)

**Best for: Applications that can tolerate brief downtime**

1. **Schedule during low-traffic periods** (nights, weekends)
2. **Prepare all configurations** in advance
3. **Notify stakeholders** of the planned maintenance
4. **Have rollback procedures** ready

## Premigration preparation steps

### Step 1: Assess your current setup

1. **Document existing connections**: Note which apps use gateway-based integration
2. **Identify dependencies**: Catalog resources accessed through the current integration
3. **Review networking rules**: Document any NSGs, route tables, or firewall rules
4. **Evaluate downtime tolerance**: Determine acceptable maintenance windows
5. **Plan rollback strategy**: Prepare procedures to revert if issues occur

### Step 2: Plan your subnet configuration

The subnet used for regional virtual network integration must meet [specific requirements](./overview-vnet-integration.md#subnet-requirements):

* **Size**: Minimum `/28` (16 addresses), recommended `/26` (64 addresses) for production
* **Delegation**: Must be delegated to `Microsoft.Web/serverFarms`
* **Availability**: Can't be used by other services simultaneously
* **Location**: Must be in the same virtual network you want to integrate with

#### Subnet sizing guidance

| Scenario | Recommended Size | Max App Instances |
|----------|------------------|-------------------|
| Development/Test | `/28` (16 addresses) | 11 instances |
| Production | `/26` (64 addresses) | 59 instances |
| Multi-plan subnet join | `/26` or larger | Varies by plans |

> [!TIP]
> Always provision double the IP addresses of your expected maximum scale to accommodate platform upgrades and scaling operations.

#### Multi-plan subnet join

You can connect multiple App Service plans to the same subnet using the [multi-plan subnet join feature](./overview-vnet-integration.md#subnet-requirements). This approach:
- Requires a minimum `/26` subnet
- Allows resource consolidation
- Supports plans across different subscriptions (subnet can be in different subscription)

### Step 3: Create the integration subnet

# [Azure portal](#tab/portal)

1. Navigate to your virtual network in the Azure portal
2. Select **Subnets** > **+ Subnet**
3. Configure the subnet:
   - **Name**: Choose a descriptive name (for example `app-service-integration`)
   - **Address range**: Select appropriate CIDR block
   - **Subnet delegation**: Select `Microsoft.Web/serverFarms`
4. Select **Save**

# [Azure CLI](#tab/cli)

```azurecli-interactive
az network vnet subnet create \
    --resource-group <resource-group-name> \
    --vnet-name <vnet-name> \
    --name <subnet-name> \
    --address-prefixes <cidr-block> \
    --delegations Microsoft.Web/serverFarms
```

# [Azure PowerShell](#tab/powershell)

```azurepowershell-interactive
$vnet = Get-AzVirtualNetwork -ResourceGroupName <resource-group-name> -Name <vnet-name>
Add-AzVirtualNetworkSubnetConfig -Name <subnet-name> -VirtualNetwork $vnet -AddressPrefix <cidr-block> -Delegation "Microsoft.Web/serverFarms"
Set-AzVirtualNetwork -VirtualNetwork $vnet
```

---

## Performing the migration

### Same-region migration (most common scenario)

For apps currently using gateway-based integration in the same region:

:::image type="content" source="media/migrate-gateway-based-vnet-integration/same-region-migration.png" alt-text="Diagram showing migration from gateway-based to regional virtual network integration.":::

#### Step 1: Disconnect gateway-based integration

# [Azure portal](#tab/portal)

1. Go to your app in the Azure portal
2. Select **Settings** > **Networking**
3. Under **VNet Integration**, select **Disconnect**
4. Confirm the disconnection

# [Azure CLI](#tab/cli)

```azurecli-interactive
az webapp vnet-integration remove \
    --resource-group <resource-group-name> \
    --name <app-name>
```

# [Azure PowerShell](#tab/powershell)

```azurepowershell-interactive
$webApp = Get-AzWebApp -ResourceGroupName <resource-group-name> -Name <app-name>
$webApp.VirtualNetworkSubnetId = $null
Set-AzWebApp -WebApp $webApp
```

---

#### Step 2: Configure regional virtual network integration

# [Azure portal](#tab/portal)

1. In your app, select **Settings** > **Networking**
2. Under **Outbound traffic configuration**, select **Not configured** next to Virtual network integration
3. Select **Add virtual network integration**
4. Choose your virtual network and the prepared subnet
5. Select **Connect**

# [Azure CLI](#tab/cli)

```azurecli-interactive
az webapp vnet-integration add \
    --resource-group <resource-group-name> \
    --name <app-name> \
    --vnet <vnet-name> \
    --subnet <subnet-name>
```

# [Azure PowerShell](#tab/powershell)

```azurepowershell-interactive
$subnetResourceId = "/subscriptions/<subscription-id>/resourceGroups/<vnet-resource-group>/providers/Microsoft.Network/virtualNetworks/<vnet-name>/subnets/<subnet-name>"
$webApp = Get-AzResource -ResourceType Microsoft.Web/sites -ResourceGroupName <resource-group-name> -ResourceName <app-name>
$webApp.Properties.virtualNetworkSubnetId = $subnetResourceId
$webApp.Properties.vnetRouteAllEnabled = 'true'
$webApp | Set-AzResource -Force
```

---

#### Step 3: Verify connectivity

After integration is complete, test your app's connectivity to virtual network resources:

1. **Application testing**: Verify your app can access databases, storage, and other resources
2. **DNS resolution**: Confirm DNS queries resolve correctly for private resources
3. **Performance testing**: Monitor application performance after the migration

### Cross-region migration

If you're currently using gateway-based integration to connect to a virtual network in a different region:

Set up [virtual network peering](../virtual-network/virtual-network-peering-overview.md) to enable regional integration:

1. **Create a virtual network** in your app's region
2. **Establish virtual network peering** between regions  
3. **Set up regional virtual network integration** with the local virtual network
4. **Configure routing** to access cross-region resources through peering

## Post-migration configuration and optimization

After successfully migrating to regional virtual network integration, you can take advantage of other features and optimizations:

* Enhance routing capabilities with [advanced traffic routing configurations](./overview-vnet-integration.md#routes)
* Control outbound traffic with [Network Security Groups (NSGs)](./overview-vnet-integration.md#network-routing)
* Direct traffic through specific network appliances with [User Defined Routes (UDRs)](./overview-vnet-integration.md#application-routing)
* Obtain static outbound IP addresses and increase SNAT port availability with [NAT Gateway integration](./overview-inbound-outbound-ips.md#get-a-static-outbound-ip)
* Enable [service endpoints](./overview-vnet-integration.md#service-endpoints) for Azure services
* Connect to Azure services using [private endpoints](./overview-vnet-integration.md#private-endpoints) for enhanced security
* Set up [private DNS zones](./overview-vnet-integration.md#azure-dns-private-zones) for name resolution of private endpoints

## Troubleshooting

For common issues and solutions after migration, see [Troubleshoot virtual network integration](/troubleshoot/azure/app-service/troubleshoot-vnet-integration-apps).

## Next steps

After successfully migrating to regional virtual network integration, explore these related articles:

**Configuration guides:**
* [Enable virtual network integration in Azure App Service](./configure-vnet-integration-enable.md)
* [Configure virtual network integration routing](./configure-vnet-integration-routing.md)  
* [Azure NAT Gateway integration](./overview-nat-gateway-integration.md)

**Learn more about App Service networking:**
* [App Service networking features overview](./networking-features.md)
* [Virtual network integration overview](./overview-vnet-integration.md)
* [Troubleshoot virtual network integration](/troubleshoot/azure/app-service/troubleshoot-vnet-integration-apps)

**Related tutorials:**
* [Tutorial: Isolate back-end communication with Virtual Network integration](./tutorial-networking-isolate-vnet.md)

**Azure networking documentation:**
* [Azure Virtual Network documentation](../virtual-network/index.yml)
* [Azure private endpoints](../private-link/private-endpoint-overview.md)
* [Azure NAT Gateway](../virtual-network/nat-gateway/nat-overview.md)
