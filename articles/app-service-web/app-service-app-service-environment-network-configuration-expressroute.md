<properties 
	pageTitle="Network Configuration Details for Working with Express Route" 
	description="Network configuration details for running App Service Environments in a Virtual Networks connected to an ExpressRoute Circuit." 
	services="app-service" 
	documentationCenter="" 
	authors="stefsch" 
	manager="nirma" 
	editor=""/>

<tags 
	ms.service="app-service" 
	ms.workload="na" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="09/11/2015" 
	ms.author="stefsch"/>	

# Network Configuration Details for App Service Environments with ExpressRoute 

## Overview ##
Customers can connect an [Azure ExpressRoute][ExpressRoute] circuit to their virtual network infrastructure, thus extending their on-premises network to Azure.  An App Service Environment can  be created in a subnet of this [virtual network][virtualnetwork] infrastructure.  Apps running on the App Service Environment can then establish secure connections to back-end resources accessible only over the ExpressRoute connection.  

**Note:**  An App Service Environment cannot be created in a "v2" virtual network.  App Service Environments are currently only supported in classic "v1" virtual networks.

[AZURE.INCLUDE [app-service-web-to-api-and-mobile](../../includes/app-service-web-to-api-and-mobile.md)] 

## Required Network Connectivity ##
There are network connectivity requirements for App Service Environments that may not be initially met in a virtual network connected to an ExpressRoute.

App Service Environments require all of the following in order to function properly:


-  Outbound network connectivity to Azure Storage worldwide, and connectivity to Sql DB resources located in the same region as the App Service Environment.  This network path cannot travel through internal corporate proxies because doing so will likely change the effective NAT address of the outbound network traffic.  Changing the NAT address of an App Service Environment's outbound network traffic directed at Azure Storage and Sql DB endpoints will cause connectivity failures.
-  The DNS configuration for the virtual network must be capable of resolving endpoints within the following Azure controlled domains:  **.file.core.windows.net*, **.blob.core.windows.net*, **.database.windows.net*.
-  DNS configuration for the virtual network must remain stable whenever App Service Environments are created, as well as during re-configurations and scaling changes to App Service Environments.   
-  If a custom DNS server exists on the other end of a VPN gateway, the DNS server must be reachable and available. 
-  Inbound network access to required ports for App Service Environments must be allowed as described in this [article][requiredports].

The DNS requirement can be met by ensuring a valid DNS configuration for the virtual network.  

The inbound network access requirements can be met by configuring a [network security group][NetworkSecurityGroups] on the App Service Environment's subnet to allow the required access as described in this [article][requiredports].

## Enabling Outbound Network Connectivity for an App Service Environment##
By default, a newly created ExpressRoute circuit advertises a default route that allows outbound Internet connectivity.  With this configuration an App Service Environment will be able to connect to other Azure endpoints.

However a common customer configuration is to define their own default route which forces outbound Internet traffic to instead flow on-premises through a customer's proxy/firewall infrastructure.  This traffic flow invariably breaks App Service Environments because the outbound traffic is either blocked on-premises, or NAT'd to an unrecognizable set of addresses that no longer work with various Azure endpoints.

The solution is to define one (or more) user defined routes (UDRs) on the subnet that contains the App Service Environment.  A UDR defines subnet-specific routes that will be honored instead of the default route.

Background information on user defined routes is available in this [overview][UDROverview].  

Details on creating and configuring user defined routes is available in this [How To Guide][UDRHowTo].

## Example UDR Configuration for an App Service Environment ##

**Pre-requisites**

1. Install the very latest Azure Powershell from the [Azure Downloads page][AzureDownloads] (dated June 2015 or later).  Under "Command-line tools" there is an "Install" link under "Windows Powershell" that will install the latest Powershell cmdlets.

2. It is recommended that a unique subnet is created for exclusive use by an App Service Environment.  This ensures that the UDRs applied to the subnet will only open outbound traffic for the App Service Environment.
3. **Important**:  do not deploy the App Service Environment until **after** the following configuration steps are followed.  This ensures that outbound network connectivity is available before attempting to deploy an App Service Environment.

**Step 1:  Create a named route table**

The following snippet creates a route table called "DirectInternetRouteTable" in the West US Azure region:

    New-AzureRouteTable -Name 'DirectInternetRouteTable' -Location uswest

**Step 2:  Create one or more routes in the route table**

You will need to add one or more routes to the route table in order to enable outbound Internet access.  The example below adds enough routes to cover all possible Azure addresses used in the West US region.

    Get-AzureRouteTable -Name 'DirectInternetRouteTable' | Set-AzureRoute -RouteName 'Direct Internet Range 1' -AddressPrefix 23.0.0.0/8 -NextHopType Internet
    Get-AzureRouteTable -Name 'DirectInternetRouteTable' | Set-AzureRoute -RouteName 'Direct Internet Range 2' -AddressPrefix 40.0.0.0/8 -NextHopType Internet
    Get-AzureRouteTable -Name 'DirectInternetRouteTable' | Set-AzureRoute -RouteName 'Direct Internet Range 3' -AddressPrefix 65.0.0.0/8 -NextHopType Internet
    Get-AzureRouteTable -Name 'DirectInternetRouteTable' | Set-AzureRoute -RouteName 'Direct Internet Range 4' -AddressPrefix 104.0.0.0/8 -NextHopType Internet
    Get-AzureRouteTable -Name 'DirectInternetRouteTable' | Set-AzureRoute -RouteName 'Direct Internet Range 5' -AddressPrefix 137.0.0.0/8 -NextHopType Internet
    Get-AzureRouteTable -Name 'DirectInternetRouteTable' | Set-AzureRoute -RouteName 'Direct Internet Range 6' -AddressPrefix 138.0.0.0/8 -NextHopType Internet
    Get-AzureRouteTable -Name 'DirectInternetRouteTable' | Set-AzureRoute -RouteName 'Direct Internet Range 7' -AddressPrefix 157.0.0.0/8 -NextHopType Internet
    Get-AzureRouteTable -Name 'DirectInternetRouteTable' | Set-AzureRoute -RouteName 'Direct Internet Range 8' -AddressPrefix 168.0.0.0/8 -NextHopType Internet
    Get-AzureRouteTable -Name 'DirectInternetRouteTable' | Set-AzureRoute -RouteName 'Direct Internet Range 9' -AddressPrefix 191.0.0.0/8 -NextHopType Internet


For a comprehensive and updated list of CIDR ranges in use by Azure, you can download an Xml file containing all of the ranges from the [Microsoft Download Center][DownloadCenterAddressRanges] 

**Note:**  at some point an abbreviated CIDR short-hand of 0.0.0.0/0 will be available for use in the *AddressPrefix* parameter.  This short hand equates to "all Internet addresses".  For now developers will need to instead use a broad set of CIDR ranges sufficient to cover all possible Azure address ranges.

**Step 3:  Associate the route table to the subnet containing the App Service Environment**

The last  configuration step is to associate the route table to the subnet where the App Service Environment will be deployed.  The following command associates the "DirectInternetRouteTable" to the "ASESubnet" that will eventually contain an App Service Environment.

    Set-AzureSubnetRouteTable -VirtualNetworkName 'YourVirtualNetworkNameHere' -SubnetName 'ASESubnet' -RouteTableName 'DirectInternetRouteTable'


**Step 4:  Final Steps**

Once the route table is bound to the subnet, it is recommended to first test and confirm the intended effect.  For example, deploy a virtual machine into the subnet and confirm that:


- Outbound traffic to Azure endpoints is not flowing down the ExpressRoute circuit.
- DNS lookups for Azure endpoints are resolving properly. 

Once the above steps are confirmed, you can delete the virtual machine and then proceed with creating an App Service Environment!

## Getting started

To get started with App Service Environments, see [Introduction to App Service Environment][IntroToAppServiceEnvironment]

For more information about the Azure App Service platform, see [Azure App Service][AzureAppService].

<!-- LINKS -->
[virtualnetwork]: http://azure.microsoft.com/services/virtual-network/
[ExpressRoute]: http://azure.microsoft.com/services/expressroute/
[requiredports]: http://azure.microsoft.com/documentation/articles/app-service-app-service-environment-control-inbound-traffic/
[NetworkSecurityGroups]: http://azure.microsoft.com/documentation/articles/virtual-networks-nsg/
[UDROverview]: http://azure.microsoft.com/documentation/articles/virtual-networks-udr-overview/
[UDRHowTo]: http://azure.microsoft.com/documentation/articles/virtual-networks-udr-how-to/
[HowToCreateAnAppServiceEnvironment]: http://azure.microsoft.com/documentation/articles/app-service-web-how-to-create-an-app-service-environment/
[AzureDownloads]: http://azure.microsoft.com/en-us/downloads/ 
[DownloadCenterAddressRanges]: http://www.microsoft.com/download/details.aspx?id=41653  
[NetworkSecurityGroups]: https://azure.microsoft.com/documentation/articles/virtual-networks-nsg/
[AzureAppService]: http://azure.microsoft.com/documentation/articles/app-service-value-prop-what-is/
[IntroToAppServiceEnvironment]:  http://azure.microsoft.com/documentation/articles/app-service-app-service-environment-intro/
 

<!-- IMAGES -->
