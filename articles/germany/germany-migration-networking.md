---
title: Migrate network resources from Azure Germany to global Azure
description: This article provides information about migrating network resources from Azure Germany to global Azure.
author: gitralf
services: germany
cloud: Azure Germany
ms.author: ralfwi 
ms.service: germany
ms.date: 08/15/2018
ms.topic: article
ms.custom: bfmigrate
---

# Migrate Azure network resources to global Azure

Most networking services don't support migration from Azure Germany to global Azure. However, you can connect your networks in both cloud environments by using a site-to-site VPN. 

The steps you take to set up a site-to-site VPN between clouds are similar to the steps you take to deploy a site-to-site VPN between your on-premises network and Azure. Define a gateway in both clouds, and then tell the VPNs how to communicate with each other. [Create a site-to-site connection in the Azure portal](../vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal.md) describes the steps you complete to deploy a site-to-site VPN. Here's a summary of the steps:

1. Define a virtual network.
1. Define address space.
1. Define subnets.
1. Define a gateway subnet.
1. Define a gateway for the Azure Virtual Network network.
1. Define a gateway for the local network (your local VPN device).
1. Configure a local VPN device.
1. Build the connection.

To connect vIrtual networks between global Azure and Azure Germany:

1. Complete steps 1-5 in the preceding procedure in global Azure.
1. Complete steps 1-5 in Azure Germany.
1. Complete step 6 in global Azure:
   - Enter the public IP address of the VPN gateway in Azure Germany.
1. Complete step 6 in Azure Germany:
   - Enter the public IP address of the VPN gateway in global Azure.
1. Skip step 7.
1. Complete step 8.

## Virtual networks

Migrating virtual networks from Azure Germany to global Azure isn't supported at this time. We recommend that you create new virtual networks in the target region and migrate resources into those virtual networks.

- [About virtual networks](../virtual-network/virtual-networks-overview.md)
- [Planning virtual networks](../virtual-network/virtual-network-vnet-plan-design-arm.md)

## Network security groups

Migrating network security groups from Azure Germany to global Azure isn't supported at this time. We recommend that you create new network security groups in the target region and apply the network security groups rules to the new application environment.

Get the current configuration of any network security group from the portal or by running the following PowerShell commands:

```powershell
$nsg=Get-AzureRmNetworkSecurityGroup -ResourceName <nsg-name> -ResourceGroupName <resourcegroupname>
Get-AzureRmNetworkSecurityRuleConfig -NetworkSecurityGroup $nsg
```
For more information, see these articles:

- [About network security groups](../virtual-network/security-overview.md)
- [Manage network security groups](../virtual-network/manage-network-security-group.md)

## ExpressRoute

Migrating an Azure ExpressRoute instance from Azure Germany to global Azure isn't supported at this time. We recommend that you create new ExpressRoute circuits and a new ExpressRoute gateway in global Azure.

For more information, see these articles:

- [Create a new ExpressRoute gateway](../expressroute/expressroute-howto-add-gateway-portal-resource-manager.md)
- [ExpressRoute locations and service providers](../expressroute/expressroute-locations.md)
- [About virtual network gateways for ExpressRoute](../expressroute/expressroute-about-virtual-network-gateways.md)

## VPN Gateway

Migrating an Azure VPN Gateway instance from Azure Germany to global Azure isn't supported at this time. We recommend that you create and configure a new instance of VPN Gateway in global Azure.

You can collect information about your current VPN Gateway configuration by using the portal or PowerShell. In PowerShell, use a set of cmdlets that begin with `Get-AzureRmVirtualNetworkGateway*`.

Make sure that you update your on-premises configuration. Also, delete any existing rules for the old IP address ranges after you update your Azure network environment.

For more information, see these articles:

- [Create a site-to-site connection](../vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal.md)
- [Get-AzureRmVirtualNetworkGateway](/powershell/module/azurerm.network/get-azurermvirtualnetworkgateway?view=azurermps-6.5.0)
- [Blog post: Create a site-to-site connection](https://blogs.technet.microsoftcom/ralfwi/2017/02/02/connecting-clouds/)
 
## Application Gateway

Migrating an Azure Application Gateway instance from Azure Germany to global Azure isn't supported at this time. We recommend that you create and configure a new gateway in global Azure.

You can collect information about your current gateway configuration by using the portal or PowerShell. In PowerShell, use a set of cmdlets that begin with `Get-AzureRmApplicationGateway*`.

For more information, see these articles:

- [Create an application gateway](../application-gateway/quick-create-portal.md)
- [Get-AzureRmApplicationGateway](/powershell/module/azurerm.network/get-azurermapplicationgateway?view=azurermps-6.5.0)

## DNS

To migrate your Azure DNS configuration from Azure Germany to global Azure, export the DNS zone file, and then import it under the new subscription. Currently, the only way to export the zone file is by using the Azure CLI.

After you sign in to your source subscription in Azure Germany, configure the Azure CLI to use Azure Resource Manager mode. Export the zone by running this command:

```azurecli
az network dns zone export -g <resource group> -n <zone name> -f <zone file name>
```

Example:

```azurecli
az network dns zone export -g "myresourcegroup" -n "contoso.com" -f "contoso.com.txt"
```

This command calls the Azure DNS service to export the zone `contoso.com` in the resource group `myresourcegroup`. The output is stored as a BIND-compatible zone file in contoso.com.txt in the current folder.

When the export is finished, delete the NS records from the zone file. New NS records are created for the new region and subscription.

Now, sign in to your target environment, create a new resource group (or select an existing one), and then import the zone file:

```azurecli
az network dns zone import -g <resource group> -n <zone name> -f <zone file name>
```

When the zone has been imported, you must validate the zone by running the following command:

```azurecli
az network dns record-set list -g <resource group> -z <zone name>
```

When validation is finished, contact your domain registrar and redelegate the NS records. To get NS record information, run this command:

```azurecli
az network dns record-set ns list -g <resource group> -z --output json
```

For more information, see these articles:

- [Azure DNS overview](../dns/dns-overview.md)
- [Azure DNS import and export](../dns/dns-import-export.md)

## Network Watcher

Migrating an Azure Network Watcher instance from Azure Germany to global Azure isn't supported at this time. We recommend that you create and configure a new Network Watcher instance in global Azure. Afterward, compare results between the old and new environments.

For more information, see these articles:

- [Network Watcher overview](../network-watcher/network-watcher-monitoring-overview.md)
- [Network security group flow logs](../network-watcher/network-watcher-nsg-flow-logging-portal.md)
- [Connection Monitor](../network-watcher/connection-monitor.md)

## Traffic Manager

Azure Traffic Manager can help you complete a smooth migration. However, you can't migrate Traffic Manager profiles that you create in Azure Germany to global Azure. (During a migration, you migrate Traffic Manager endpoints to the target environment, so you need to update the Traffic Manager profile anyway.)

You can define additional endpoints in the target environment by using Traffic Manager while it's still running in the source environment. When Traffic Manager is running in the new environment, you can still define endpoints that you haven't yet migrated in the source environment. This scenario is known as [the Blue-Green scenario](https://azure.microsoft.com/blog/blue-green-deployments-using-azure-traffic-manager/). The scenario involves the following steps:

1. Create a new Traffic Manager profile in global Azure.
1. Define the endpoints in Azure Germany.
1. Change your DNS CNAME record to the new Traffic Manager profile.
1. Turn off the old Traffic Manager profile.
1. Migrate and configure endpoints. For each endpoint in Azure Germany:
   1. Migrate the endpoint to global Azure.
   1. Change the Traffic Manager profile to use the new endpoint.

For more information, see these articles:

- [Traffic Manager overview](../traffic-manager/traffic-manager-overview.md)
- [Create a Traffic Manager profile](../traffic-manager/traffic-manager-create-profile.md)

## Load Balancer

Migrating an Azure Load Balancer instance from Azure Germany to global Azure isn't supported at this time. We recommend that you create and configure a new load balancer in global Azure.

For more information, see these articles:

- [Load Balancer overview](../load-balancer/load-balancer-overview.md)
- [Create a new load balancer](../load-balancer/quickstart-load-balancer-standard-public-portal.md)

## Next steps

- Refresh your knowledge by completing these step-by-step tutorials:

  - [Virtual Network tutorials](https://docs.microsoft.com/azure/virtual-network/#step-by-step-tutorials)
  - [ExpressRoute tutorials](https://docs.microsoft.com/azure/expressroute/#step-by-step-tutorials)
  - [VPN Gateway tutorials](https://docs.microsoft.com/azure/vpn-gateway/#step-by-step-tutorials)
  - [Application Gateway tutorials](https://docs.microsoft.com/azure/application-gateway/#step-by-step-tutorials)
  - [Azure DNS tutorials](https://docs.microsoft.com/azure/dns/#step-by-step-tutorials)
  - [Network Watcher tutorials](https://docs.microsoft.com/azure/network-watcher/#step-by-step-tutorials)
  - [Traffic Manager tutorials](https://docs.microsoft.com/azure/traffic-manager/#step-by-step-tutorials)
  - [Load Balancer tutorials](https://docs.microsoft.com/azure/load-balancer/#step-by-step-tutorials)
- Refresh your [knowledge about network security groups](../virtual-network/security-overview.md#network-security-groups).