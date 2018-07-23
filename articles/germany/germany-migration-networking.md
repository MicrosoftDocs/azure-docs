---
title: Migration from Azure Germany compute resources to public Azure
description: Provides help for migrating network resources
author: gitralf
ms.author: ralfwi 
ms.date: 7/20/2018
ms.topic: article
ms.custom: bfmigrate
---

# Networking

## Virtual Network (VNet)

Migration of Vnets between Azure Germany and public Azure is not supported at this time. The recommended approach is to create new virtual networks in the target region and migrate resources into those Vnets.

### Links

- [About Virtual networks](../virtual-network/virtual-networks-overview.md)
- [Planning Virtual networks](../virtual-network/virtual-network-vnet-plan-design-arm.md)

## Network Security Groups (NSG)

Migration of Network Security Groups between Azure Germany and public Azure is not supported at this time. The recommended approach is to create new Network Security groups in the target region and apply the NSG rules to the new application environment.

### Links

- [About NSG](../virtual-network/security-overview.md)
- [Manage NSG](../virtual-network/manage-network-security-group.md)

## ExpressRoute

Migration of ExpressRoute between Azure Germany and public Azure is not supported at this time. The recommended approach is to create new ExpressRoute circuits and new ExpressRoute gateway.

### Links

- [ExpressRoute locations and service providers](../expressroute/expressroute-locations.md)
- [Create a new ExpressRoute gateway](../expressroute/expressroute-howto-add-gateway-portal-resource-manager.md)
- [More info about ExpressRoute gateway](../expressroute/expressroute-about-virtual-network-gateways.md)

## VPN Gateway

Migration of Virtual Private Network Gateways between Azure Germany and public Azure is not supported at this time. The recommended approach is to create and configure a new Gateway as described in the documents provided in the link section. You can collect information about your current VPN gateway configuration by using the portal or by using PowerShell and the *Get-AzureRmVirtualNetworkGateway\** set of cmdlets.

Don't forget to update your on-premise configuration and delete any existing rules for the old IP ranges once you updated your Azure network environment.

### Links

- [VPN Gateway overview](../vpn-gateway/vpn-gateway-about-vpngateways.md)
- [Create Site-to-Site connection](../vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal.md) with VPN gateway
- Blog: [Create Site-to-site connection](https://blogs.technet.microsoft.com/ralfwi/2017/02/02/connecting-clouds/) between Azure Germany and public Azure

## Application Gateway

Migration of Application Gateways between Azure Germany and public Azure is not supported at this time. The recommended approach is to create and configure a new Gateway as described in the documents provided in the link section. You can collect information about your current gateway configuration by using the portal or by using PowerShell and the *Get-AzureRmApplicationGateway\** set of cmdlets.

### Links

- [Application Gateway overview](../application-gateway/application-gateway-introduction.md?toc=%2fazure%2fnetworking%2ftoc.json)
- [Create Application Gateway](../application-gateway/quick-create-portal.md)

## Azure DNS

You have to export the DNS zone file and import it under the new subscription. Currently the only mechanism to export the zone file is by using Azure CLI.

When you are logged into your source subscription in Azure Germany, configure CLI to use Resource Manager mode. Export the zone :

    az network dns zone export -g \<resource group\> -n \<zone name\> -f \<zone file name\>

Example:

    az network dns zone export -g "myresourcegroup" -n "contoso.com" -f "contoso.com.txt"

This exports the existing Azure DNS zone "contoso.com" in resource group "myresourcegroup" to the file "contoso.com.txt" (in the current folder). It calls the Azure DNS service to enumerate record sets in the zone and export the results to a BIND-compatible zone file.

After the export is done, delete the NS records from the zone file as NS records will be created fresh for the new region and subscription.

Now login to your target environment, create a new resource group (or choose an existing one) and import the previously created zone file:

    az network dns zone import -g \<resource group\> -n \<zone name\> -f \<zone file name\>

Once the zone has been imported you have to validate the zone by running the following command:

    az network dns record-set list -g \<resource group\> -z \<zone name\>

Once this is done, please contact your domain registrar and redelegate the NS records. NS records can be obtained by executing the command shown below. You can also login to the console and get the NS record information.

    az network dns record-set ns list -g \<resource group\> -z \--output json

## Network Watcher

Unfortunately, a migration of Network Watcher between Azure Germany and public Azure is not supported at this time. The recommended approach is to create and configure a new Network Watcher as described in the documents provided in the link section.

### Links

- [NSG Flow Logs](../network-watcher/network-watcher-nsg-flow-logging-portal.md)
- [Connection Monitor](../network-watcher/connection-monitor.md)

## Traffic Manager

Traffic Manager profiles created in Azure Germany cannot be migrated over to public Azure. Since you also migrate all the Traffic Manager endpoints to the target environment, you need to update the Traffic Manager profile anyway.

Traffic Manager might help you to perform a smooth migration since you can define endpoints in both the source and the target environment with Traffic Manager still running in the old environment or already running in the new environment. This is known as the Blue-Green scenario and well documented (see in the link section below). In short, this is how it works:

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

Migration of Load Balancers between Azure Germany and public Azure is not supported at this time. The recommended approach is to create and configure a new Load Balancer as described in the documents provided in the link section.

### Links

- [Load balancer overview](../load-balancer/load-balancer-overview.md)
- [Create new load balancer](../load-balancer/quickstart-load-balancer-standard-public-portal.md)