---
title: Configure Azure ExpressRoute v1
description: Network configuration for App Service Environment for Power Apps with Azure ExpressRoute. This doc is provided only for customers who use the legacy v1 ASE.
author: madsd

ms.assetid: 34b49178-2595-4d32-9b41-110c96dde6bf
ms.topic: article
ms.date: 03/29/2022
ms.author: madsd
ms.custom: seodec18
---

# Network configuration details for App Service Environment for Power Apps with Azure ExpressRoute

> [!IMPORTANT]
> This article is about App Service Environment v1. [App Service Environment v1 will be retired on 31 August 2024](https://azure.microsoft.com/updates/app-service-environment-version-1-and-version-2-will-be-retired-on-31-august-2024-2/). There's a new version of App Service Environment that is easier to use and runs on more powerful infrastructure. To learn more about the new version, start with the [Introduction to the App Service Environment](overview.md). If you're currently using App Service Environment v1, please follow the steps in [this article](upgrade-to-asev3.md) to migrate to the new version.

As of 15 January 2024, you can no longer create new App Service Environment v1 resources using any of the available methods including ARM/Bicep templates, Azure Portal, Azure CLI, or REST API. Existing App Service Environment v1 resources will continue to be supported until 31 August 2024. You must [migrate to App Service Environment v3](upgrade-to-asev3.md) before 31 August 2024 to prevent resource deletion and data loss.
>

Customers can connect an [Azure ExpressRoute][ExpressRoute] circuit to their virtual network infrastructure to extend their on-premises network to Azure. App Service Environment is created in a subnet of the [virtual network][virtualnetwork] infrastructure. Apps that run on App Service Environment establish secure connections to back-end resources that are accessible only over the ExpressRoute connection.  

App Service Environment can be created in these scenarios:
- Azure Resource Manager virtual networks.
- Classic deployment model virtual networks.
- Virtual networks that use public address ranges or RFC1918 address spaces (that is, private addresses). 

[!INCLUDE [app-service-web-to-api-and-mobile](../../../includes/app-service-web-to-api-and-mobile.md)]

## Required network connectivity

App Service Environment has network connectivity requirements that initially might not be met in a virtual network that's connected to ExpressRoute.

App Service Environment requires the following network connectivity settings to function properly:

* Outbound network connectivity to Azure Storage endpoints worldwide on both port 80 and port 443. These endpoints are located in the same region as App Service Environment and also other Azure regions. Azure Storage endpoints resolve under the following DNS domains: table.core.windows.net, blob.core.windows.net, queue.core.windows.net, and file.core.windows.net.  

* Outbound network connectivity to the Azure Files service on port 445.

* Outbound network connectivity to Azure SQL Database endpoints that are located in the same region as App Service Environment. SQL Database endpoints resolve under the database.windows.net domain, which requires open access to ports 1433, 11000-11999, and 14000-14999. For details about SQL Database V12 port usage, see [Ports beyond 1433 for ADO.NET 4.5](/azure/azure-sql/database/adonet-v12-develop-direct-route-ports).

* Outbound network connectivity to the Azure management-plane endpoints (both Azure classic deployment model and Azure Resource Manager endpoints). Connectivity to these endpoints includes the management.core.windows.net and management.azure.com domains. 

* Outbound network connectivity to the ocsp.msocsp.com, mscrl.microsoft.com, and crl.microsoft.com domains. Connectivity to these domains is needed to support TLS functionality.

* The DNS configuration for the virtual network must be able to resolve all endpoints and domains mentioned in this article. If the endpoints can't be resolved, App Service Environment creation fails. Any existing App Service Environment is marked as unhealthy.

* Outbound access on port 53 is required for communication with DNS servers.

* If a custom DNS server exists on the other end of a VPN gateway, the DNS server must be reachable from the subnet that contains App Service Environment. 

* The outbound network path can't travel through internal corporate proxies and can't be force tunneled on-premises. These actions change the effective NAT address of outbound network traffic from App Service Environment. Changes to the NAT address of App Service Environment outbound network traffic cause connectivity failures to many of the endpoints. App Service Environment creation fails. Any existing App Service Environment is marked as unhealthy.

* Inbound network access to required ports for App Service Environment must be allowed. For details, see [How to control inbound traffic to App Service Environment][requiredports].

To fulfill the DNS requirements, make sure a valid DNS infrastructure is configured and maintained for the virtual network. If the DNS configuration is changed after App Service Environment is created, developers can force App Service Environment to pick up the new DNS configuration. You can trigger a rolling environment reboot by using the **Restart** icon under App Service Environment management in the [Azure portal](https://portal.azure.com). The reboot causes the environment to pick up the new DNS configuration.

To fulfill the inbound network access requirements, configure a [network security group (NSG)][NetworkSecurityGroups] on the App Service Environment subnet. The NSG allows the required access [to control inbound traffic to App Service Environment][requiredports].

## Outbound network connectivity

By default, a newly created ExpressRoute circuit advertises a default route that allows outbound internet connectivity. App Service Environment can use this configuration to connect to other Azure endpoints.

A common customer configuration is to define their own default route (0.0.0.0/0), which forces outbound internet traffic to flow on-premises. This traffic flow invariably breaks App Service Environment. The outbound traffic is either blocked on-premises or NAT'd to an unrecognizable set of addresses that no longer work with various Azure endpoints.

The solution is to define one (or more) user-defined routes (UDRs) on the subnet that contains App Service Environment. A UDR defines subnet-specific routes that are honored instead of the default route.

If possible, use the following configuration:

* The ExpressRoute configuration advertises 0.0.0.0/0. By default, the configuration force tunnels all outbound traffic on-premises.
* The UDR applied to the subnet that contains App Service Environment defines 0.0.0.0/0 with a next hop type of internet. An example of this configuration is described later in this article.

The combined effect of this configuration is that the subnet-level UDR takes precedence over the ExpressRoute force tunneling. Outbound internet access from App Service Environment is guaranteed.

> [!IMPORTANT]
> The routes defined in a UDR must be specific enough to take precedence over any routes that are advertised by the ExpressRoute configuration. The example described in the next section uses the broad 0.0.0.0/0 address range. This range can accidentally be overridden by route advertisements that use more specific address ranges.
> 
> App Service Environment isn't supported with ExpressRoute configurations that cross-advertise routes from the public peering path to the private peering path. ExpressRoute configurations that have public peering configured receive route advertisements from Microsoft for a large set of Microsoft Azure IP address ranges. If these address ranges are cross-advertised on the private peering path, all outbound network packets from the App Service Environment subnet are force tunneled to the customer's on-premises network infrastructure. This network flow isn't currently supported with App Service Environment. One solution is to stop cross-advertising routes from the public peering path to the private peering path.
> 
> 

For background information about user-defined routes, see [Virtual network traffic routing][UDROverview].  

To learn how to create and configure user-defined routes, see [Route network traffic with a route table by using PowerShell][UDRHowTo].

## UDR configuration

This section shows an example UDR configuration for App Service Environment.

### Prerequisites

* Install Azure PowerShell from the [Azure Downloads page][AzureDownloads]. Choose a download with a date of June 2015 or later. Under **Command-line tools** > **Windows PowerShell**, select **Install** to install the latest PowerShell cmdlets.

* Create a unique subnet for exclusive use by App Service Environment. The unique subnet ensures that the UDRs applied to the subnet open outbound traffic for App Service Environment only.

> [!IMPORTANT]
> Only deploy App Service Environment after you complete the configuration steps. The steps ensure outbound network connectivity is available before you try to deploy App Service Environment.

### Step 1: Create a route table

Create a route table named **DirectInternetRouteTable** in the West US Azure region, as shown in this snippet:

`New-AzureRouteTable -Name 'DirectInternetRouteTable' -Location uswest`

### Step 2: Create routes in the table

Add routes to the route table to enable outbound internet access.  

Configure outbound access to the internet. Define a route for 0.0.0.0/0 as shown in this snippet:

`Get-AzureRouteTable -Name 'DirectInternetRouteTable' | Set-AzureRoute -RouteName 'Direct Internet Range 0' -AddressPrefix 0.0.0.0/0 -NextHopType Internet`

0.0.0.0/0 is a broad address range. The range is overridden by address ranges advertised by ExpressRoute that are more specific. A UDR with a 0.0.0.0/0 route should be used in conjunction with an ExpressRoute configuration that advertises 0.0.0.0/0 only. 

As an alternative, download a current, comprehensive list of CIDR ranges in use by Azure. The XML file for all Azure IP address ranges is available from the [Microsoft Download Center][DownloadCenterAddressRanges].  

> [!NOTE]
>
> The Azure IP address ranges change over time. User-defined routes need periodic manual updates to keep in sync.
>
> A single UDR has a default upper limit of 100 routes. You need to "summarize" the Azure IP address ranges to fit within the 100-route limit. UDR-defined routes need to be more specific than routes that are advertised by your ExpressRoute connection.
> 

### Step 3: Associate the table to the subnet

Associate the route table to the subnet where you intend to deploy App Service Environment. This command associates the **DirectInternetRouteTable** table to the **ASESubnet** subnet that will contain App Service Environment.

`Set-AzureSubnetRouteTable -VirtualNetworkName 'YourVirtualNetworkNameHere' -SubnetName 'ASESubnet' -RouteTableName 'DirectInternetRouteTable'`

### Step 4: Test and confirm the route

After the route table is bound to the subnet, test and confirm the route.

Deploy a virtual machine into the subnet and confirm these conditions:

* Outbound traffic to the Azure and non-Azure endpoints described in this article does **not** flow down the ExpressRoute circuit. If outbound traffic from the subnet is force tunneled on-premises, App Service Environment creation always fails.
* DNS lookups for the endpoints described in this article all resolve properly. 

After you complete the configuration steps and confirm the route, delete the virtual machine. The subnet needs to be "empty" when App Service Environment is created.

Now you're ready to deploy App Service Environment!

## Next steps

To get started with App Service Environment for Power Apps, see [Introduction to App Service Environment][IntroToAppServiceEnvironment].

<!-- LINKS -->
[virtualnetwork]: https://azure.microsoft.com/services/virtual-network/ 
[ExpressRoute]: https://azure.microsoft.com/services/expressroute/ 
[requiredports]: app-service-app-service-environment-control-inbound-traffic.md 
[NetworkSecurityGroups]: ../../virtual-network/virtual-network-vnet-plan-design-arm.md
[UDROverview]: ../../virtual-network/virtual-networks-udr-overview.md
<!-- Old link -- [UDRHowTo]: https://azure.microsoft.com/documentation/articles/virtual-networks-udr-how-to/ -->

[UDRHowTo]: ../../virtual-network/tutorial-create-route-table-powershell.md
[AzureDownloads]: https://azure.microsoft.com/downloads/ 
[DownloadCenterAddressRanges]: https://www.microsoft.com/download/details.aspx?id=41653 
[IntroToAppServiceEnvironment]:  app-service-app-service-environment-intro.md 

<!-- IMAGES -->