---
title: 'Verify Connectivity - ExpressRoute Troubleshooting Guide: Azure| Microsoft Docs'
description: This page provides instructions on troubleshooting and validating end to end connectivity of an ExpressRoute circuit.
services: expressroute
author: rambk

ms.service: expressroute
ms.topic: article
ms.date: 09/26/2017
ms.author: rambala
ms.custom: seodec18

---
# Verifying ExpressRoute connectivity
This article helps you verify and troubleshoot ExpressRoute connectivity. ExpressRoute, which extends an on-premises network into the Microsoft cloud over a private connection that is facilitated by a connectivity provider, involves the following three distinct network zones:

- 	Customer Network
-  	Provider Network
-  	Microsoft Datacenter

The purpose of this document is to help user to identify where (or even if) a connectivity issue exists and within which zone, thereby to seek help from appropriate team to resolve the issue. If Microsoft support is needed to resolve an issue, open a support ticket with [Microsoft Support][Support].

> [!IMPORTANT]
> This document is intended to help diagnosing and fixing simple issues. It is not intended to be a replacement for Microsoft support. Open a support ticket with [Microsoft Support][Support] if you are unable to solve the problem using the guidance provided.
>
>

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Overview
The following diagram shows the logical connectivity of a customer network to Microsoft network using ExpressRoute.
[![1]][1]

In the preceding diagram, the numbers indicate key network points. The network points are referenced often through this article by their associated number.

Depending on the ExpressRoute connectivity model (Cloud Exchange Co-location, Point-to-Point Ethernet Connection, or Any-to-any (IPVPN)) the network points 3 and 4 may be switches (Layer 2 devices). The key network points illustrated are as follows:

1.	Customer compute device (for example, a server or PC)
2.	CEs: Customer edge routers 
3.	PEs (CE facing): Provider edge routers/switches that are facing customer edge routers. Referred to as PE-CEs in this document.
4.	PEs (MSEE facing): Provider edge routers/switches that are facing MSEEs. Referred to as PE-MSEEs in this document.
5.	MSEEs: Microsoft Enterprise Edge (MSEE) ExpressRoute routers
6.	Virtual Network (VNet) Gateway
7.	Compute device on the Azure VNet

If the Cloud Exchange Co-location or Point-to-Point Ethernet Connection connectivity models are used, the customer edge router (2) would establish BGP peering with MSEEs (5). Network points 3 and 4 would still exist but be somewhat transparent as Layer 2 devices.

If the Any-to-any (IPVPN) connectivity model is used, the PEs (MSEE facing) (4) would establish BGP peering with MSEEs (5). Routes would then propagate back to the customer network via the IPVPN service provider network.

> [!NOTE]
>For ExpressRoute high availability, Microsoft requires a redundant pair of BGP sessions between MSEEs (5) and PE-MSEEs (4). A redundant pair of network paths is also encouraged between customer network and PE-CEs. However, in Any-to-any (IPVPN) connection model, a single CE device (2) may be connected to one or more PEs (3).
>
>

To validate an ExpressRoute circuit, the following steps are covered (with the network point indicated by the associated number):
1. [Validate circuit provisioning and state (5)](#validate-circuit-provisioning-and-state)
2. [Validate at least one ExpressRoute peering is configured (5)](#validate-peering-configuration)
3. [Validate ARP between Microsoft and the service provider (link between 4 and 5)](#validate-arp-between-microsoft-and-the-service-provider)
4. [Validate BGP and routes on the MSEE (BGP between 4 to 5, and 5 to 6 if a VNet is connected)](#validate-bgp-and-routes-on-the-msee)
5. [Check the Traffic Statistics (Traffic passing through 5)](#check-the-traffic-statistics)

More validations and checks will be added in the future, check back monthly!

## Validate circuit provisioning and state
Regardless of the connectivity model, an ExpressRoute circuit has to be created and thus a service key generated for circuit provisioning. Provisioning an ExpressRoute circuit establishes a redundant Layer 2 connections between PE-MSEEs (4) and MSEEs (5). For more information on how to create, modify, provision, and verify an ExpressRoute circuit, see the article [Create and modify an ExpressRoute circuit][CreateCircuit].

>[!TIP]
>A service key uniquely identifies an ExpressRoute circuit. This key is required for most of the powershell commands mentioned in this document. Also, should you need assistance from Microsoft or from an ExpressRoute partner to troubleshoot an ExpressRoute issue, provide the service key to readily identify the circuit.
>
>

### Verification via the Azure portal
In the Azure portal, the status of an ExpressRoute circuit can be checked by selecting ![2][2] on the left-side-bar menu and then selecting the ExpressRoute circuit. Selecting an ExpressRoute circuit listed under "All resources" opens the ExpressRoute circuit blade. In the ![3][3] section of the blade, the ExpressRoute essentials are listed as shown in the following screenshot:

![4][4]    

In the ExpressRoute Essentials, *Circuit status* indicates the status of the circuit on the Microsoft side. *Provider status* indicates if the circuit has been *Provisioned/Not provisioned* on the service-provider side. 

For an ExpressRoute circuit to be operational, the *Circuit status* must be *Enabled* and the *Provider status* must be *Provisioned*.

> [!NOTE]
> If the *Circuit status* is not enabled, contact [Microsoft Support][Support]. If the *Provider status* is not provisioned, contact your service provider.
>
>

### Verification via PowerShell
To list all the ExpressRoute circuits in a Resource Group, use the following command:

	Get-AzExpressRouteCircuit -ResourceGroupName "Test-ER-RG"

>[!TIP]
>You can get your resource group name through the Azure 
>. See the previous subsection of this document and note that the resource group name is listed in the example screenshot.
>
>

To select a particular ExpressRoute circuit in a Resource Group, use the following command:

	Get-AzExpressRouteCircuit -ResourceGroupName "Test-ER-RG" -Name "Test-ER-Ckt"

A sample response is:

	Name                             : Test-ER-Ckt
	ResourceGroupName                : Test-ER-RG
	Location                         : westus2
	Id                               : /subscriptions/***************************/resourceGroups/Test-ER-RG/providers/***********/expressRouteCircuits/Test-ER-Ckt
	Etag                             : W/"################################"
	ProvisioningState                : Succeeded
	Sku                              : {
                                     	"Name": "Standard_UnlimitedData",
                                     	"Tier": "Standard",
                                     	"Family": "UnlimitedData"
                                   		}
	CircuitProvisioningState         : Enabled
	ServiceProviderProvisioningState : Provisioned
	ServiceProviderNotes             : 
	ServiceProviderProperties        : {
                                     	"ServiceProviderName": "****",
                                     	"PeeringLocation": "******",
                                     	"BandwidthInMbps": 100
                                   		}
	ServiceKey                       : **************************************
	Peerings                         : []
	Authorizations                   : []

To confirm if an ExpressRoute circuit is operational, pay particular attention to the following fields:

	CircuitProvisioningState         : Enabled
	ServiceProviderProvisioningState : Provisioned

> [!NOTE]
> If the *CircuitProvisioningState* is not enabled, contact [Microsoft Support][Support]. If the *ServiceProviderProvisioningState* is not provisioned, contact your service provider.
>
>

### Verification via PowerShell (Classic)
To list all the ExpressRoute circuits under a subscription, use the following command:

	Get-AzureDedicatedCircuit

To select a particular ExpressRoute circuit, use the following command:

	Get-AzureDedicatedCircuit -ServiceKey **************************************

A sample response is:

	andwidth                         : 100
	BillingType                      : UnlimitedData
	CircuitName                      : Test-ER-Ckt
	Location                         : westus2
	ServiceKey                       : **************************************
	ServiceProviderName              : ****
	ServiceProviderProvisioningState : Provisioned
	Sku                              : Standard
	Status                           : Enabled

To confirm if an ExpressRoute circuit is operational, pay particular attention to the following fields:
	ServiceProviderProvisioningState : Provisioned
	Status                           : Enabled

> [!NOTE]
> If the *Status* is not enabled, contact [Microsoft Support][Support]. If the *ServiceProviderProvisioningState* is not provisioned, contact your service provider.
>
>

## Validate Peering Configuration
After the service provider has completed the provisioning the ExpressRoute circuit, a routing configuration can be created over the ExpressRoute circuit between MSEE-PRs (4) and MSEEs (5). Each ExpressRoute circuit can have one, two, or three routing contexts enabled: Azure private peering (traffic to private virtual networks in Azure), Azure public peering (traffic to public IP addresses in Azure), and Microsoft peering (traffic to Office 365 and Dynamics 365). For more information on how to create and modify routing configuration, see the article [Create and modify routing for an ExpressRoute circuit][CreatePeering].

### Verification via the Azure portal

> [!NOTE]
> If layer 3 is provided by the service provider and the peerings are blank in the portal, refresh the Circuit configuration using the refresh button on the portal. This operation will apply the right routing configuration on your circuit. 
>
>

In the Azure portal, status of an ExpressRoute circuit can be checked by selecting ![2][2] on the left-side-bar menu and then selecting the ExpressRoute circuit. Selecting an ExpressRoute circuit listed under "All resources" would open the ExpressRoute circuit blade. In the ![3][3] section of the blade, the ExpressRoute essentials would be listed as shown in the following screenshot:

![5][5]

In the preceding example, as noted Azure private peering routing context is enabled, whereas Azure public and Microsoft peering routing contexts are not enabled. A successfully enabled peering context would also have the primary and secondary point-to-point (required for BGP) subnets listed. The /30 subnets are used for the interface IP address of the MSEEs and PE-MSEEs. 

> [!NOTE]
> If a peering is not enabled, check if the primary and secondary subnets assigned match the configuration on PE-MSEEs. If not, to change the configuration on MSEE routers, refer to [Create and modify routing for an ExpressRoute circuit][CreatePeering]
>
>

### Verification via PowerShell
To get the Azure private peering configuration details, use the following commands:

	$ckt = Get-AzExpressRouteCircuit -ResourceGroupName "Test-ER-RG" -Name "Test-ER-Ckt"
	Get-AzExpressRouteCircuitPeeringConfig -Name "AzurePrivatePeering" -ExpressRouteCircuit $ckt

A sample response, for a successfully configured private peering, is:

	Name                       : AzurePrivatePeering
	Id                         : /subscriptions/***************************/resourceGroups/Test-ER-RG/providers/***********/expressRouteCircuits/Test-ER-Ckt/peerings/AzurePrivatePeering
	Etag                       : W/"################################"
	PeeringType                : AzurePrivatePeering
	AzureASN                   : 12076
	PeerASN                    : ####
	PrimaryPeerAddressPrefix   : 172.16.0.0/30
	SecondaryPeerAddressPrefix : 172.16.0.4/30
	PrimaryAzurePort           : 
	SecondaryAzurePort         : 
	SharedKey                  : 
	VlanId                     : 300
	MicrosoftPeeringConfig     : null
	ProvisioningState          : Succeeded

 A successfully enabled peering context would have the primary and secondary address prefixes listed. The /30 subnets are used for the interface IP address of the MSEEs and PE-MSEEs.

To get the Azure public peering configuration details, use the following commands:

	$ckt = Get-AzExpressRouteCircuit -ResourceGroupName "Test-ER-RG" -Name "Test-ER-Ckt"
	Get-AzExpressRouteCircuitPeeringConfig -Name "AzurePublicPeering" -ExpressRouteCircuit $ckt

To get the Microsoft peering configuration details, use the following commands:

	$ckt = Get-AzExpressRouteCircuit -ResourceGroupName "Test-ER-RG" -Name "Test-ER-Ckt"
	 Get-AzExpressRouteCircuitPeeringConfig -Name "MicrosoftPeering" -ExpressRouteCircuit $ckt

If a peering is not configured, there would be an error message. A sample response, when the stated peering (Azure Public peering in this example) is not configured within the circuit:

	Get-AzExpressRouteCircuitPeeringConfig : Sequence contains no matching element
	At line:1 char:1
		+ Get-AzExpressRouteCircuitPeeringConfig -Name "AzurePublicPeering ...
		+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    		+ CategoryInfo          : CloseError: (:) [Get-AzExpr...itPeeringConfig], InvalidOperationException
    		+ FullyQualifiedErrorId : Microsoft.Azure.Commands.Network.GetAzureExpressRouteCircuitPeeringConfigCommand


> [!NOTE]
> If a peering is not enabled, check if the primary and secondary subnets assigned match the configuration on the linked PE-MSEE. Also check if the correct *VlanId*, *AzureASN*, and *PeerASN* are used on MSEEs and if these values maps to the ones used on the linked PE-MSEE. If MD5 hashing is chosen, the shared key should be same on MSEE and PE-MSEE pair. To change the configuration on the MSEE routers, refer to [Create and modify routing for an ExpressRoute circuit][CreatePeering].  
>
>

### Verification via PowerShell (Classic)
To get the Azure private peering configuration details, use the following command:

	Get-AzureBGPPeering -AccessType Private -ServiceKey "*********************************"

A sample response, for a successfully configured private peering is:

	AdvertisedPublicPrefixes       : 
	AdvertisedPublicPrefixesState  : Configured
	AzureAsn                       : 12076
	CustomerAutonomousSystemNumber : 
	PeerAsn                        : ####
	PrimaryAzurePort               : 
	PrimaryPeerSubnet              : 10.0.0.0/30
	RoutingRegistryName            : 
	SecondaryAzurePort             : 
	SecondaryPeerSubnet            : 10.0.0.4/30
	State                          : Enabled
	VlanId                         : 100

A successfully, enabled peering context would have the primary and secondary peer subnets listed. The /30 subnets are used for the interface IP address of the MSEEs and PE-MSEEs.

To get the Azure public peering configuration details, use the following commands:

	Get-AzureBGPPeering -AccessType Public -ServiceKey "*********************************"

To get the Microsoft peering configuration details, use the following commands:

	Get-AzureBGPPeering -AccessType Microsoft -ServiceKey "*********************************"

> [!IMPORTANT]
> If layer 3 peerings were set by the service provider, setting the ExpressRoute peerings via the portal or PowerShell overwrites the service provider settings. Resetting the provider side peering settings requires the support of the service provider. Only modify the ExpressRoute peerings if it is certain that the service provider is providing layer 2 services only!
>
>

> [!NOTE]
> If a peering is not enabled, check if the primary and secondary peer subnets assigned match the configuration on the linked PE-MSEE. Also check if the correct *VlanId*, *AzureAsn*, and *PeerAsn* are used on MSEEs and if these values maps to the ones used on the linked PE-MSEE. To change the configuration on the MSEE routers, refer to [Create and modify routing for an ExpressRoute circuit][CreatePeering].
>
>

## Validate ARP between Microsoft and the service provider
This section uses PowerShell (Classic) commands. If you have been using PowerShell Azure Resource Manager commands, ensure that you have admin/co-admin access to the subscription. For troubleshooting using Azure Resource Manager commands please refer to the [Getting ARP tables in the Resource Manager deployment model][ARP] document.

> [!NOTE]
>To get ARP, both the Azure portal and Azure Resource Manager PowerShell commands can be used. If errors are encountered with the Azure Resource Manager PowerShell commands, classic PowerShell commands should work as Classic PowerShell commands also work with Azure Resource Manager ExpressRoute circuits.
>
>

To get the ARP table from the primary MSEE router for the private peering, use the following command:

	Get-AzureDedicatedCircuitPeeringArpInfo -AccessType Private -Path Primary -ServiceKey "*********************************"

An example response for the command, in the successful scenario:

	ARP Info:

                 Age           Interface           IpAddress          MacAddress
                 113             On-Prem       10.0.0.1      	  e8ed.f335.4ca9
                   0           Microsoft       10.0.0.2           7c0e.ce85.4fc9

Similarly, you can check the ARP table from the MSEE in the *Primary*/*Secondary* path, for *Private*/*Public*/*Microsoft* peerings.

The following example shows the response of the command for a peering does not exist.

	ARP Info:
	   
> [!NOTE]
> If the ARP table does not have IP addresses of the interfaces mapped to MAC addresses, review the following information:
>1. If the first IP address of the /30 subnet assigned for the link between the MSEE-PR and MSEE is used on the interface of MSEE-PR. Azure always uses the second IP address for MSEEs.
>2. Verify if the customer (C-Tag) and service (S-Tag) VLAN tags match both on MSEE-PR and MSEE pair.
>
>

## Validate BGP and routes on the MSEE
This section uses PowerShell (Classic) commands. If you have been using PowerShell Azure Resource Manager commands, ensure that you have admin/co-admin access to the subscription.

> [!NOTE]
>To get BGP information, both the Azure portal and Azure Resource Manager PowerShell commands can be used. If errors are encountered with the Azure Resource Manager PowerShell commands, classic PowerShell commands should work as classic PowerShell commands also work with Azure Resource Manager ExpressRoute circuits.
>
>

To get the routing table (BGP neighbor) summary for a particular routing context, use the following command:

	Get-AzureDedicatedCircuitPeeringRouteTableSummary -AccessType Private -Path Primary -ServiceKey "*********************************"

An example response is:

	Route Table Summary:

            Neighbor                   V                  AS              UpDown         StatePfxRcd
            10.0.0.1                   4                ####                8w4d                  50

As shown in the preceding example, the command is useful to determine for how long the routing context has been established. It also indicates number of route prefixes advertised by the peering router.

> [!NOTE]
> If the state is in Active or Idle, check if the primary and secondary peer subnets assigned match the configuration on the linked PE-MSEE. Also check if the correct *VlanId*, *AzureAsn*, and *PeerAsn* are used on MSEEs and if these values maps to the ones used on the linked PE-MSEE. If MD5 hashing is chosen, the shared key should be same on MSEE and PE-MSEE pair. To change the configuration on the MSEE routers, refer to [Create and modify routing for an ExpressRoute circuit][CreatePeering].
>
>

> [!NOTE]
> If certain destinations are not reachable over a particular peering, check the route table of the MSEEs belonging to the particular peering context. If a matching prefix (could be NATed IP) is present in the routing table, then check if there are firewalls/NSG/ACLs on the path and if they permit the traffic.
>
>

To get the full routing table from MSEE on the *Primary* path for the particular *Private* routing context, use the following command:

	Get-AzureDedicatedCircuitPeeringRouteTableInfo -AccessType Private -Path Primary -ServiceKey "*********************************"

An example successful outcome for the command is:

	Route Table Info:

             Network             NextHop              LocPrf              Weight                Path
         10.1.0.0/16            10.0.0.1                                       0    #### ##### #####     
         10.2.0.0/16            10.0.0.1                                       0    #### ##### #####
	...

Similarly, you can check the routing table from the MSEE in the *Primary*/*Secondary* path, for *Private*/*Public*/*Microsoft* a peering context.

The following example shows the response of the command for a peering does not exist:

	Route Table Info:

## Check the Traffic Statistics
To get the combined primary and secondary path traffic statistics--bytes in and out--of a peering context, use the following command:

	Get-AzureDedicatedCircuitStats -ServiceKey 97f85950-01dd-4d30-a73c-bf683b3a6e5c -AccessType Private

A sample output of the command is:

	PrimaryBytesIn PrimaryBytesOut SecondaryBytesIn SecondaryBytesOut
	-------------- --------------- ---------------- -----------------
	     240780020       239863857        240565035         239628474

A sample output of the command for a non-existent peering is:

	Get-AzureDedicatedCircuitStats : ResourceNotFound: Can not find any subinterface for peering type 'Public' for circuit '97f85950-01dd-4d30-a73c-bf683b3a6e5c' .
	At line:1 char:1
	+ Get-AzureDedicatedCircuitStats -ServiceKey 97f85950-01dd-4d30-a73c-bf ...
	+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    	+ CategoryInfo          : CloseError: (:) [Get-AzureDedicatedCircuitStats], CloudException
    	+ FullyQualifiedErrorId : Microsoft.WindowsAzure.Commands.ExpressRoute.GetAzureDedicatedCircuitPeeringStatsCommand

## Next Steps
For more information or help, check out the following links:

- [Microsoft Support][Support]
- [Create and modify an ExpressRoute circuit][CreateCircuit]
- [Create and modify routing for an ExpressRoute circuit][CreatePeering]

<!--Image References-->
[1]: ./media/expressroute-troubleshooting-expressroute-overview/expressroute-logical-diagram.png "Logical Express Route Connectivity"
[2]: ./media/expressroute-troubleshooting-expressroute-overview/portal-all-resources.png "All resources icon"
[3]: ./media/expressroute-troubleshooting-expressroute-overview/portal-overview.png "Overview icon"
[4]: ./media/expressroute-troubleshooting-expressroute-overview/portal-circuit-status.png "ExpressRoute Essentials sample screenshot"
[5]: ./media/expressroute-troubleshooting-expressroute-overview/portal-private-peering.png "ExpressRoute Essentials sample screenshot"

<!--Link References-->
[Support]: https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade
[CreateCircuit]: https://docs.microsoft.com/azure/expressroute/expressroute-howto-circuit-portal-resource-manager 
[CreatePeering]: https://docs.microsoft.com/azure/expressroute/expressroute-howto-routing-portal-resource-manager
[ARP]: https://docs.microsoft.com/azure/expressroute/expressroute-troubleshooting-arp-resource-manager






