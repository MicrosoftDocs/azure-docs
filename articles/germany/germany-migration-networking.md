---
title: Migration from Azure Germany compute resources to global Azure
description: Provides help for migrating network resources
author: gitralf
ms.author: ralfwi 
ms.date: 7/20/2018
ms.topic: article
ms.custom: bfmigrate
---

# Networking

## Virtual Network (VNet)

Migration of Vnets between Azure Germany and global Azure isn't supported at this time. The recommended approach is to create new virtual networks in the target region and migrate resources into those Vnets.

### Links

- [About Virtual networks](../virtual-network/virtual-networks-overview.md)
- [Planning Virtual networks](../virtual-network/virtual-network-vnet-plan-design-arm.md)

## Network Security Groups (NSG)

Migration of Network Security Groups between Azure Germany and global Azure isn't supported at this time. The recommended approach is to create new Network Security groups in the target region and apply the NSG rules to the new application environment.

### Links

- [About NSG](../virtual-network/security-overview.md)
- [Manage NSG](../virtual-network/manage-network-security-group.md)

## ExpressRoute

Migration of ExpressRoute between Azure Germany and global Azure isn't supported at this time. The recommended approach is to create new ExpressRoute circuits and new ExpressRoute gateway.

### Links

- [ExpressRoute locations and service providers](../expressroute/expressroute-locations.md)
- [Create a new ExpressRoute gateway](../expressroute/expressroute-howto-add-gateway-portal-resource-manager.md)
- [More info about ExpressRoute gateway](../expressroute/expressroute-about-virtual-network-gateways.md)

## VPN Gateway

Migration of Virtual Private Network (VPN) Gateways between Azure Germany and global Azure isn't supported at this time. The recommended approach is to create and configure a new VPN Gateway.

Collect information about your current VPN gateway configuration by using the portal or by using PowerShell. There's a set of cmdlets starting with `Get-AzureRmVirtualNetworkGateway\*`.

Don't forget to update your on-premise configuration and delete any existing rules for the old IP ranges once you updated your Azure network environment.

### Links

- [VPN Gateway overview](../vpn-gateway/vpn-gateway-about-vpngateways.md)
- [Create Site-to-Site connection](../vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal.md) with VPN gateway
- Blog: [Create Site-to-site connection](https://blogs.technet.microsoft.com/ralfwi/2017/02/02/connecting-clouds/) between Azure Germany andglobalc Azure

## Application Gateway

Migration of Application Gateways between Azure Germany and global Azure isn't supported at this time. The recommended approach is to create and configure a new Gateway.

Collect information about your current gateway configuration by using the portal or by using PowerShell. There's a set of cmdlets starting with `Get-AzureRmApplicationGateway\*`.

### Links

- [Application Gateway overview](../application-gateway/application-gateway-introduction.md?toc=%2fazure%2fnetworking%2ftoc.json)
- [Create Application Gateway](../application-gateway/quick-create-portal.md)

## Azure DNS

Export the DNS zone file and import it under the new subscription. Currently the only mechanism to export the zone file is by using Azure CLI.

When you're signed on to your source subscription in Azure Germany, configure CLI to use Resource Manager mode. Export the zone:

    az network dns zone export -g <resource group> -n <zone name> -f <zone file name>

Example:

    az network dns zone export -g "myresourcegroup" -n "contoso.com" -f "contoso.com.txt"

This command calls the Azure DNS service to export the zone "contoso.com" in the resource group "myresourcegroup". The output is stored as a BIND-compatible zone file in "contoso.com.txt" in the current folder.

After the export is done, delete the NS records from the zone file as NS records will be created fresh for the new region and subscription.

Now sign in to your target environment, create a new resource group (or choose an existing one) and import the previously created zone file:

    az network dns zone import -g <resource group> -n <zone name> -f <zone file name>

Once the zone has been imported, you have to validate the zone by running the following command:

    az network dns record-set list -g <resource group> -z <zone name>

Once the validation is done, contact your domain registrar and redelegate the NS records. Get NS record information by executing this command:

    az network dns record-set ns list -g <resource group> -z --output json

## Network Watcher

Migration of Network Watcher between Azure Germany and global Azure isn't supported at this time. The recommended approach is to create and configure a new Network Watcher.

### Links

- [NSG Flow Logs](../network-watcher/network-watcher-nsg-flow-logging-portal.md)
- [Connection Monitor](../network-watcher/connection-monitor.md)

## Traffic Manager

Traffic Manager profiles created in Azure Germany can't be migrated over to global Azure. Since you also migrate all the Traffic Manager endpoints to the target environment, you need to update the Traffic Manager profile anyway.

Traffic Manager can help you with a smooth migration. With Traffic Manager still running in the old environment, you can already define additional endpoints in the target environment. Once Target Manager runs in the new environment, you can still define endpoints in the old environment that you didn't migrate so far. This is known as [the Blue-Green scenario](https://azure.microsoft.com/en-us/blog/blue-green-deployments-using-azure-traffic-manager/). In short:

- Create a new Traffic Manager in Azure public.
- Define the endpoints still in Azure Germany.
- Change your DNS CNAME to the new Traffic Manager.
- Turn off the old Traffic Manager
- Migrate endpoint by endpoint to the new environment and change the Traffic Manager profile accordingly.

### Links

- [Traffic Manager overview](../traffic-manager/traffic-manager-overview.md)
- [Create a Traffic Manager profile](../traffic-manager/traffic-manager-create-profile.md)
- [Blue-Green scenario](https://azure.microsoft.com/en-us/blog/blue-green-deployments-using-azure-traffic-manager/)

## Load Balancer

Migration of Load Balancers between Azure Germany and global Azure isn't supported at this time. The recommended approach is to create and configure a new Load Balancer.

### Links

- [Load balancer overview](../load-balancer/load-balancer-overview.md)
- [Create new load balancer](../load-balancer/quickstart-load-balancer-standard-public-portal.md)