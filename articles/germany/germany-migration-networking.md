---
title: Migrate Azure network resource from Azure Germany to global Azure
description: This article provides information about migrating your Azure network resources from Azure Germany to global Azure.
author: gitralf
services: germany
cloud: Azure Germany
ms.author: ralfwi 
ms.service: germany
ms.date: 12/12/2019
ms.topic: article
ms.custom: bfmigrate
---

# Migrate network resources to global Azure

> [!IMPORTANT]
> Since [August 2018](https://news.microsoft.com/europe/2018/08/31/microsoft-to-deliver-cloud-services-from-new-datacentres-in-germany-in-2019-to-meet-evolving-customer-needs/), we have not been accepting new customers or deploying any new features and services into the original Microsoft Cloud Germany locations.
>
> Based on the evolution in customers’ needs, we recently [launched](https://azure.microsoft.com/blog/microsoft-azure-available-from-new-cloud-regions-in-germany/) two new datacenter regions in Germany, offering customer data residency, full connectivity to Microsoft’s global cloud network, as well as market competitive pricing. 
>
> Take advantage of the breadth of functionality, enterprise-grade security, and comprehensive features available in our new German datacenter regions by [migrating](germany-migration-main.md) today.

Most networking services don't support migration from Azure Germany to global Azure. However, you can connect your networks in both cloud environments by using a site-to-site VPN. 

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

The steps you take to set up a site-to-site VPN between clouds are similar to the steps you take to deploy a site-to-site VPN between your on-premises network and Azure. Define a gateway in both clouds, and then tell the VPNs how to communicate with each other. [Create a site-to-site connection in the Azure portal](../vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal.md) describes the steps you complete to deploy a site-to-site VPN. Here's a summary of the steps:

1. Define a virtual network.
1. Define address space.
1. Define subnets.
1. Define a gateway subnet.
1. Define a gateway for the virtual network.
1. Define a gateway for the local network (your local VPN device).
1. Configure a local VPN device.
1. Build the connection.

To connect virtual networks between global Azure and Azure Germany:

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

For more information:

- Refresh your knowledge by completing the [Azure Virtual Network tutorials](https://docs.microsoft.com/azure/virtual-network).
- Review the [virtual networks overview](../virtual-network/virtual-networks-overview.md).
- Learn how to [plan virtual networks](../virtual-network/virtual-network-vnet-plan-design-arm.md).

## Network security groups

Migrating network security groups from Azure Germany to global Azure isn't supported at this time. We recommend that you create new network security groups in the target region and apply the network security groups rules to the new application environment.

Get the current configuration of any network security group from the portal or by running the following PowerShell commands:

```powershell
$nsg=Get-AzNetworkSecurityGroup -ResourceName <nsg-name> -ResourceGroupName <resourcegroupname>
Get-AzNetworkSecurityRuleConfig -NetworkSecurityGroup $nsg
```

For more information:

- Refresh your [knowledge about network security groups](../virtual-network/security-overview.md#network-security-groups).
- Review the [network security overview](../virtual-network/security-overview.md)
- Learn how to [manage network security groups](../virtual-network/manage-network-security-group.md).

## ExpressRoute

Migrating an Azure ExpressRoute instance from Azure Germany to global Azure isn't supported at this time. We recommend that you create new ExpressRoute circuits and a new ExpressRoute gateway in global Azure.

For more information:

- Refresh your knowledge by completing the [ExpressRoute tutorials](https://docs.microsoft.com/azure/expressroute).
- Learn how to [create a new ExpressRoute gateway](../expressroute/expressroute-howto-add-gateway-portal-resource-manager.md).
- Learn about [ExpressRoute locations and service providers](../expressroute/expressroute-locations.md).
- Read about [virtual network gateways for ExpressRoute](../expressroute/expressroute-about-virtual-network-gateways.md).

## VPN Gateway

Migrating an Azure VPN Gateway instance from Azure Germany to global Azure isn't supported at this time. We recommend that you create and configure a new instance of VPN Gateway in global Azure.

You can collect information about your current VPN Gateway configuration by using the portal or PowerShell. In PowerShell, use a set of cmdlets that begin with `Get-AzVirtualNetworkGateway*`.

Make sure that you update your on-premises configuration. Also, delete any existing rules for the old IP address ranges after you update your Azure network environment.

For more information:

- Refresh your knowledge by completing the [VPN Gateway tutorials](https://docs.microsoft.com/azure/vpn-gateway).
- Learn how to [create a site-to-site connection](../vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal.md).
- Review the [Get-AzVirtualNetworkGateway](/powershell/module/az.network/get-azvirtualnetworkgateway) PowerShell cmdlets.
- Read the blog post [Create a site-to-site connection](https://blogs.technet.microsoft.com/ralfwi/2017/02/02/connecting-clouds/).
 
## Application Gateway

Migrating an Azure Application Gateway instance from Azure Germany to global Azure isn't supported at this time. We recommend that you create and configure a new gateway in global Azure.

You can collect information about your current gateway configuration by using the portal or PowerShell. In PowerShell, use a set of cmdlets that begin with `Get-AzApplicationGateway*`.

For more information:

- Refresh your knowledge by completing the [Application Gateway tutorials](https://docs.microsoft.com/azure/application-gateway/application-gateway-web-application-firewall-portal).
- Learn how to [create an application gateway](../application-gateway/quick-create-portal.md).
- Review the [Get-AzApplicationGateway](/powershell/module/az.network/get-azapplicationgateway) PowerShell cmdlets.

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

For more information:

- Refresh your knowledge by completing the [Azure DNS tutorials](https://docs.microsoft.com/azure/dns).
- Review the [Azure DNS overview](../dns/dns-overview.md).
- Learn more about [Azure DNS import and export](../dns/dns-import-export.md).

## Network Watcher

Migrating an Azure Network Watcher instance from Azure Germany to global Azure isn't supported at this time. We recommend that you create and configure a new Network Watcher instance in global Azure. Afterward, compare results between the old and new environments.

For more information:

- Refresh your knowledge by completing the [Network Watcher tutorials](https://docs.microsoft.com/azure/network-watcher).
- Review the [Network Watcher overview](../network-watcher/network-watcher-monitoring-overview.md).
- Learn more about [network security group flow logs](../network-watcher/network-watcher-nsg-flow-logging-portal.md).
- Read about [Connection Monitor](../network-watcher/connection-monitor.md).

## Traffic Manager

Azure Traffic Manager can help you complete a smooth migration. However, you can't migrate Traffic Manager profiles that you create in Azure Germany to global Azure. (During a migration, you migrate Traffic Manager endpoints to the target environment, so you need to update the Traffic Manager profile anyway.)

You can define additional endpoints in the target environment by using Traffic Manager while it's still running in the source environment. When Traffic Manager is running in the new environment, you can still define endpoints that you haven't yet migrated in the source environment. This scenario is known as the [Blue-Green scenario](https://azure.microsoft.com/blog/blue-green-deployments-using-azure-traffic-manager/). The scenario involves the following steps:

1. Create a new Traffic Manager profile in global Azure.
1. Define the endpoints in Azure Germany.
1. Change your DNS CNAME record to the new Traffic Manager profile.
1. Turn off the old Traffic Manager profile.
1. Migrate and configure endpoints. For each endpoint in Azure Germany:
   1. Migrate the endpoint to global Azure.
   1. Change the Traffic Manager profile to use the new endpoint.

For more information:

- Refresh your knowledge by completing the [Traffic Manager tutorials](https://docs.microsoft.com/azure/traffic-manager).
- Review the [Traffic Manager overview](../traffic-manager/traffic-manager-overview.md).
- Learn how to [create a Traffic Manager profile](../traffic-manager/traffic-manager-create-profile.md).

## Load Balancer

Migrating an Azure Load Balancer instance from Azure Germany to global Azure isn't supported at this time. We recommend that you create and configure a new load balancer in global Azure.

For more information:

- Refresh your knowledge by completing the [Load Balancer tutorials](https://docs.microsoft.com/azure/load-balancer).
- Review the [Load Balancer overview](../load-balancer/load-balancer-overview.md).
- Learn how to [create a new load balancer](../load-balancer/quickstart-load-balancer-standard-public-portal.md).

## Next steps

Learn about tools, techniques, and recommendations for migrating resources in the following service categories:

- [Compute](./germany-migration-compute.md)
- [Storage](./germany-migration-storage.md)
- [Web](./germany-migration-web.md)
- [Databases](./germany-migration-databases.md)
- [Analytics](./germany-migration-analytics.md)
- [IoT](./germany-migration-iot.md)
- [Integration](./germany-migration-integration.md)
- [Identity](./germany-migration-identity.md)
- [Security](./germany-migration-security.md)
- [Management tools](./germany-migration-management-tools.md)
- [Media](./germany-migration-media.md)
