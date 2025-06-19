---
title: Migrate from gateway-based to regional virtual network integration
description: Learn how to migrate your App Service virtual network integration from legacy gateway-based integration to modern regional virtual network integration for improved performance and capabilities.
author: seligj95
ms.topic: how-to
ms.date: 06/19/2025
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

## Prerequisites

Before beginning the migration, ensure you have:

* **App Service plan**: A Basic, Standard, Premium, PremiumV2, PremiumV3, or Elastic Premium plan
* **Virtual network**: An Azure Resource Manager virtual network in the same region as your app
* **Subnet**: An empty subnet or a new subnet dedicated for virtual network integration
* **Permissions**: Appropriate RBAC permissions to configure virtual network integration
* **Planning**: Understanding of your current networking requirements and dependencies

## Migration planning and preparation

The migration process is a disconnect/connect operation that might cause brief downtime. Proper planning minimizes issues with your applications.

### Step 1: Assess your current setup

1. **Document existing connections**: Note which apps use gateway-based integration
2. **Identify dependencies**: Catalog resources accessed through the current integration
3. **Review networking rules**: Document any NSGs, route tables, or firewall rules
4. **Plan downtime**: Schedule migration during maintenance windows

### Step 2: Subnet planning and requirements

The subnet used for regional virtual network integration must meet [specific requirements](./overview-vnet-integration.md#subnet-requirements). You can either have one subnet per plan or take advantage of the [multi-plan subnet join feature](./overview-vnet-integration.md#subnet-requirements) to connect apps from different plans to the same subnet.

* **Size**: Minimum `/28` (16 addresses), recommended `/26` (64 addresses) for production
* **Delegation**: Must be delegated to `Microsoft.Web/serverFarms`
* **Availability**: Can't be used by other services simultaneously
* **Location**: Must be in the same virtual network you want to integrate with

> [!TIP]
> Always provision double the IP addresses of your expected maximum scale to accommodate platform upgrades and scaling operations.

### Step 3: Create or prepare the integration subnet

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
# Create a new subnet for App Service integration
az network vnet subnet create \
    --resource-group <resource-group-name> \
    --vnet-name <vnet-name> \
    --name <subnet-name> \
    --address-prefixes <cidr-block> \
    --delegations Microsoft.Web/serverFarms
```

# [Azure PowerShell](#tab/powershell)

```azurepowershell-interactive
# Create a new subnet for App Service integration
$vnet = Get-AzVirtualNetwork -ResourceGroupName <resource-group-name> -Name <vnet-name>
Add-AzVirtualNetworkSubnetConfig -Name <subnet-name> -VirtualNetwork $vnet -AddressPrefix <cidr-block> -Delegation "Microsoft.Web/serverFarms"
Set-AzVirtualNetwork -VirtualNetwork $vnet
```

---

## Migration procedure

### Same-region migration (most common)

When migrating from gateway-based integration to regional integration within the same region:

![Diagram showing migration from gateway-based to regional virtual network integration](media/migrate-gateway-based-vnet-integration/same-region-migration.png)

#### Step 1: Disconnect gateway-based integration

# [Azure portal](#tab/portal)

1. Go to your app in the Azure portal
2. Select **Settings** > **Networking**
3. Under **VNet Integration**, select **Disconnect**
4. Confirm the disconnection

# [Azure CLI](#tab/cli)

```azurecli-interactive
# Disconnect gateway-based virtual network integration
az webapp vnet-integration remove \
    --resource-group <resource-group-name> \
    --name <app-name>
```

# [Azure PowerShell](#tab/powershell)

```azurepowershell-interactive
# Disconnect gateway-based virtual network integration
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
# Configure regional virtual network integration
az webapp vnet-integration add \
    --resource-group <resource-group-name> \
    --name <app-name> \
    --vnet <vnet-name> \
    --subnet <subnet-name>
```

# [Azure PowerShell](#tab/powershell)

```azurepowershell-interactive
# Configure regional virtual network integration
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

### Cross-region migration considerations

If you're currently using gateway-based integration to connect to a virtual network in a different region, you can set up [virtual network peering](../virtual-network/virtual-network-peering-overview.md):

1. Create a virtual network in your app's region
2. Establish virtual network peering between regions
3. Set up regional virtual network integration with the local virtual network
4. Configure routing to access cross-region resources through peering

## Post-migration configuration and optimization

After successfully migrating to regional virtual network integration, you can take advantage of other features and optimizations:

* Enhance routing capabilities with [advanced traffic routing configurations](./overview-vnet-integration.md#routes)
* Control outbound traffic with [Network Security Groups (NSGs)](./overview-vnet-integration.md#network-routing)
* Direct traffic through specific network appliances with [User Defined Routes (UDRs)](./overview-vnet-integration.md#application-routing)
* Obtain static outbound IP addresses and increase SNAT port availability with [NAT Gateway integration](./overview-inbound-outbound-ips.md#get-a-static-outbound-ip)
* Enable [service endpoints](./overview-vnet-integration.md#service-endpoints) for Azure services
* Connect to Azure services using [private endpoints](./overview-vnet-integration.md#private-endpoints) for enhanced security
* Set up [private DNS zones](./overview-vnet-integration.md#azure-dns-private-zones) for name resolution of private endpoints

## Troubleshooting common issues

### Connectivity problems

**Issue**: App can't reach virtual network resources after migration

**Solutions**:
1. Verify subnet delegation is set to `Microsoft.Web/serverFarms`
2. Check NSG rules allow required traffic
3. Ensure Route All is enabled if needed
4. Confirm DNS resolution is working

### Performance issues

**Issue**: Slower performance after migration

**Solutions**:
1. Monitor network latency to virtual network resources
2. Review and optimize NSG and UDR configurations
3. Consider enabling NAT Gateway for better SNAT port availability
4. Check for bandwidth limitations in network appliances

### IP address exhaustion

**Issue**: Running out of IP addresses in integration subnet

**Solutions**:
1. Move to a larger subnet (can't resize existing subnet)
2. Implement multi-plan subnet join to consolidate plans
3. Monitor and right-size your App Service plan instances

### DNS resolution issues

**Issue**: Can't resolve private DNS names

**Solutions**:
1. Configure Azure DNS private zones
2. Set up custom DNS servers in virtual network settings
3. Verify private endpoint DNS configuration

## Next steps

After successfully migrating to regional virtual network integration, explore these related articles:

* [Enable virtual network integration in Azure App Service](./configure-vnet-integration-enable.md)
* [Configure virtual network integration routing](./configure-vnet-integration-routing.md)
* [Azure NAT Gateway integration](./overview-nat-gateway-integration.md)
* [App Service networking features overview](./networking-features.md)
* [Virtual network integration overview](./overview-vnet-integration.md)
* [Troubleshoot virtual network integration](./troubleshoot/azure/app-service/troubleshoot-vnet-integration-apps.md)