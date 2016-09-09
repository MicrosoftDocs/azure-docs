<properties
   pageTitle="Implementing a Hybrid Network Architecture with Azure ExpressRoute | Reference Architecture | Microsoft Azure"
   description="How to implement a secure site-to-site network architecture that spans an Azure virtual network and an on-premises network connected by using Azure ExpressRoute."
   services=""
   documentationCenter="na"
   authors="telmosampaio"
   manager="christb"
   editor=""
   tags=""/>

<tags
   ms.service="guidance"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="08/04/2016"
   ms.author="telmos"/>

# Implementing a hybrid network architecture with Azure ExpressRoute

[AZURE.INCLUDE [pnp-header](../../includes/guidance-pnp-header-include.md)]

This article describes best practices for connecting an on-premises network to virtual networks on Azure by using ExpressRoute. ExpressRoute connections are made using a private dedicated connection through a third-party connectivity provider. The private connection extends your on-premises network into Azure providing access to your own IaaS infrastructure in Azure, public endpoints used in PaaS services, and Office365 SaaS services. This document focuses on using ExpressRoute to connect to a single Azure virtual network (VNet) using what is called private peering.

> [AZURE.NOTE] Azure has two different deployment models: [Resource Manager][resource-manager-overview] and classic. This blueprint uses Resource Manager, which Microsoft recommends for new deployments.

Typical use cases for this architecture include:

- Hybrid applications where workloads are distributed between an on-premises network and Azure.

- Applications running large-scale, mission-critical workloads that require a high degree of scalability.

- Large-scale backup and restore facilities for data that must be saved off-site.

- Handling Big Data workloads.

- Using Azure as a disaster-recovery site.

> [AZURE.NOTE] The [ExpressRoute technical overview][expressroute-technical-overview] provides an introduction to ExpressRoute.

## Architecture diagram

The following diagram highlights the important components in this architecture:

![[0]][0]

- **Azure virtual networks (VNets).** Each VNet resides in a single Azure region, and can host multiple application tiers. Application tiers can be segmented using subnets in each VNet  and/or network security groups (NSGs). 

- **Azure public services.** These are Azure services that can be utilized within a hybrid application. These services are also available over the public Internet, but accessing them via an ExpressRoute circuit provides low latency and more predictable performance since traffic does not go through the Internet. Connections are performed by using **public peering**, with addresses that are either owned by your organization or supplied by your connectivity provider. 

- **Office 365 services.** These are the publicly available Office 365 applications and services provided by Microsoft. Connections are performed by using **Microsoft peering**, with addresses that are either owned by your organization or supplied by your connectivity provider.

	>[AZURE.NOTE] You can also connect directly to Microsoft CRM Online through a Microsoft peering.

- **On-premises corporate network.** This is a network of computers and devices, connected through a private local-area network running within an organization.

- **Local edge routers.** These are routers that connect the on-premises network to the circuit managed by the provider. Depending on how your connection is provisioned, you need to provide the public IP addresses used by the routers. 

- **Microsoft edge routers.** These are two routers in an active-active highly available configuration. These routers enable a connectivity provider to connect their circuits directly to their datacenter. Depending on how your connection is provisioned, you need to provide the public IP addresses used by the routers.

- **ExpressRoute circuit.** This is a layer 2 or layer 3 circuit supplied by the connectivity provider that joins the on-premises network with Azure through the edge routers. The circuit uses the hardware infrastructure managed by the connectivity provider.

- **Connectivity providers.** These are companies that provide a connection either using layer 2 or layer 3 connectivity between your datacenter and an Azure datacenter.

## Recommendations

### Connectivity providers

- Select a suitable ExpressRoute connectivity provider for your location. To obtain a list of connectivity providers available at your location, use the following Azure PowerShell command:

	```powershell
	Get-AzureRmExpressRouteServiceProvider
	```

	ExpressRoute connectivity providers connect your datacenter to Microsoft in the following ways:

	- **Co-located at a cloud exchange.** If you're co-located in a facility with a cloud exchange, you can order virtual cross-connections to the Microsoft cloud through the co-location provider’s Ethernet exchange. Co-location providers can offer either Layer 2 cross-connections, or managed Layer 3 cross-connections between your infrastructure in the co-location facility and the Microsoft cloud..

	- **Point-to-point Ethernet connections.** You can connect your on-premises datacenters/offices to the Microsoft cloud through point-to-point Ethernet links. Point-to-point Ethernet providers can offer Layer 2 connections, or managed Layer 3 connections between your site and the Microsoft cloud.

	- **Any-to-any (IPVPN) networks.** You can integrate your WAN with the Microsoft cloud. IPVPN providers (typically MPLS VPN) offer any-to-any connectivity between your branch offices and datacenters. The Microsoft cloud can be interconnected to your WAN to make it look just like any other branch office. WAN providers typically offer managed Layer 3 connectivity.

	For more information about connectivity providers, see [ExpressRoute circuits and routing domains][connectivity-providers].

### ExpressRoute circuit

- Ensure that your organization has met the [ExpressRoute prerequiste requirements][expressroute-prereqs] for connecting to Azure.

- If you haven't already done so, add a subnet named `GatewaySubnet` to your Azure VNet and create an ExpressRoute virtual network gateway using the Azure VPN Gateway service. For more information about this process, see [ExpressRoute workflows for circuit provisioning and circuit states][ExpressRoute-provisioning].

- Create an ExpressRoute circuit as follows:

	1. Run the following PowerShell command:

		```powershell
		New-AzureRmExpressRouteCircuit -Name <<circuit-name>> -ResourceGroupName <<resource-group>> -Location <<location>> -SkuTier <<sku-tier>> `
		    -SkuFamily <<sku-family>> -ServiceProviderName <<service-provider-name>> -PeeringLocation <<peering-location>> -BandwidthInMbps <<bandwidth-in-mbps>>
		```

	2. Send the `ServiceKey` for the new circuit to the service provider.

	3. Wait for the provider to provision the circuit. You can verify the provisioning state of a circuit by using the following PowerShell command:

	    ```powershell
	    Get-AzureRmExpressRouteCircuit -Name <<circuit-name>> -ResourceGroupName <<resource-group>>
	    ```

		The `Provisioning state` field in the `Service Provider` section of the output will change from `NotProvisioned` to `Provisioned` when the circuit is ready.

		>[AZURE.NOTE]If you're using a layer 3 connection, the provider should configure and manage routing for you; you provide the information necessary to enable the provider to implement the appropriate routes.

- If you're using a layer 2 connection, follow the steps below. If you're using a layer 3 connection, skip to the next bullet.

	1. Reserve two /30 subnets composed of valid public IP addresses for each type of peering you want to implement. These /30 subnets will be used to provide IP addresses for the routers used for the circuit. If you are implementing private, public, and Microsoft peering, you'll need 6 /30 subnets with valid public IP addresses. 	

	2. Configure routing for the ExpressRoute circuit. You need to run the command below for each type of peering you want to configure (private, public, and Microsoft).
	
		>[AZURE.NOTE]See [Create and modify routing for an ExpressRoute circuit][configure-expressroute-routing] for details. Use the following PowerShell commands to add a network peering for routing traffic:

		```powershell
		Set-AzureRmExpressRouteCircuitPeeringConfig -Name <<peering-name>> -Circuit <<circuit-name>> -PeeringType <<peering-type>> -PeerASN <<peer-asn>> -PrimaryPeerAddressPrefix <<primary-peer-address-prefix>> -SecondaryPeerAddressPrefix <<secondary-peer-address-prefix>> -VlanId <<vlan-id>>

		Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit <<circuit-name>>
		```

	3. Reserve another pool of valid public IP addresses to use for NAT for public, and Microsoft peering. It is recommended to have a different pool for each peering. Specify the pool to your connectivity provider, so they can configure BGP advertisements for those ranges.

- [Link your private VNet(s) in the cloud to the ExpressRoute circuit][link-vnet-to-expressroute]. Use the following PowerShell commands:

	```
	$circuit = Get-AzureRmExpressRouteCircuit -Name <<circuit-name>> -ResourceGroupName <<resource-group>>
	$gw = Get-AzureRmVirtualNetworkGateway -Name <<gateway-name>> -ResourceGroupName <<resource-group>>
	New-AzureRmVirtualNetworkGatewayConnection -Name <<connection-name>> -ResourceGroupName <<resource-group>> -Location <<location> -VirtualNetworkGateway1 $gw -PeerId $circuit.Id -ConnectionType ExpressRoute
	```

Note the following points:

- ExpressRoute uses the Border Gateway Protocol (BGP) for exchanging routing information between your network and Azure.

- You can connect multiple VNets located in different regions to the same ExpressRoute circuit as long as all VNets and the ExpressRoute circuit are located within the same geopolitical region.

## Availability considerations

You can configure high availability for your Azure connection in different ways, depending on the type of provider you use, and the number of ExpressRoute circuits and virtual network gateway connections you're willing to configure. The points below summarize your availability options:

- ExpressRoute does not support router redundancy protocols such as HSRP and VRRP to implement high availability. Instead, it uses a redundant pair of BGP sessions per peering. To facilitate highly-available connections to your network, Microsoft Azure provisions you with two redundant ports on two routers (part of the Microsoft edge) in an active-active configuration.

- If you're using a layer 2 connection, deploy redundant routers in your on-premises network in an active-active configuration. Connect the primary circuit to one router, and the secondary circuit to the other. This will give you a highly available connection at both ends of the connection. This is necessary if you require the ExpressRoute SLA. See [SLA for Azure ExpressRoute][sla-for-expressroute] for details.

	The following diagram shows a configuration with redundant on-premises routers connected to the primary and secondary circuits. Each circuit handles the traffic for a public peering and a private peering (each peering is designated a pair of /30 address spaces, as described in the previous section).

	![[1]][1]

- If you're using a layer 3 connection, verify that it provides redundant BGP sessions that handle availability for you.

- Virtual networks can be connected to multiple ExpressRoute circuits and each  circuits can be supplied by different service providers. This strategy provides additional high-availability and disaster recovery capabilities.

- Configure a Site-to-Site VPN as a failover path for ExpressRoute. This is only applicable to private peering. For Azure and Office 365 services, the Internet is the only failover path.

- By default, BGP sessions use an idle timeout value of 60 seconds. Once a session is timed-out 3 times, the route is marked as unavailable, and all traffic is redirected to the remaining router. This 180-second timeout might be too long for critical applications. In such case, you can change your BGP time-out settings on the on-premises router to a smaller value.

## Security considerations

You can configure security options for your Azure connection in different ways, depending on your security concerns and compliance needs. The points below summarize your security options.

- ExpressRoute operates in layer 3. Threats in the Application layer can be prevented by using a Network Security Appliance which restricts traffic to legitimate resources. Additionally, ExpressRoute connections using public peering can only be initiated from on-premises. This prevents a rogue service from accessing and compromising on-premises data from the public Internet.

- To maximize security, add network security appliances between the on-premises network and the provider edge routers. This will help to restrict the inflow of unauthorized traffic from the VNet:

	![[2]][2]

- For auditing or compliance purposes, it may be necessary to prohibit direct access from components running in the VNet to the Internet and implement [forced tunneling][forced-tuneling]. In this situation, Internet traffic should be redirected back through a proxy running  on-premises where it can be audited. The proxy can be configured to block unauthorized traffic flowing out, and filter potentially malicious inbound traffic.

	![[3]][3]

- By default, Azure VMs expose endpoints used for providing login access for management purposes - RDP and Remote Powershell for Windows VMs, and SSH for Linux-based VMs when deployed through the Azure portal. To maximize security, do not enable a public IP address for your VMs, and use NSGs to ensure that these VMs aren't publicly accessible. VMs should only be available using the internal IP address. These addresses can be made accessible through the ExpressRoute network, enabling on-premises DevOps staff to perform any necessary configuration or maintenance.

- If you must expose management endpoints for VMs to an external network, use NSGs and/or access control lists to restrict the visibility of these ports to a whitelist of IP addresses or networks.

## Scalability considerations

ExpressRoute circuits provide a high bandwidth path between networks. Generally, the higher the bandwidth the greater the cost. Although some providers allow you to change your bandwidth, make sure you pick an initial bandwidth that surpasses your needs, and provides room for growth. In case you need to increase bandwidth in the future, you are left with two options.

- Increase the bandwidth. Remember that not all providers allow you to do that dynamically. And you should avoid having to do this as much as possible. But if needed, after checking with your provider, run the commands below.

	```powershell
	$ckt = Get-AzureRmExpressRouteCircuit -Name <<circuit-name>> -ResourceGroupName <<resource-group>>
    $ckt.ServiceProviderProperties.BandwidthInMbps = <<bandwidth-in-mbps>>
    Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $ckt
	```

	You can increase the bandwidth without loss of connectivity. Downgrading the bandwidth will result in disruption in connectivity. You have to delete the circuit and recreate it with the new configuration.

- If you are using the Standard SKU for ExpressRoute and need to upgrade to Premium, or change your your pricing plan (metered or unlimited), run the commands below. The `Sku.Tier` property can be `Standard` or `Premium`; the `Sku.Name` property can be `MeteredData` or `UnlimitedData`.

	```powershell
	$ckt = Get-AzureRmExpressRouteCircuit -Name <<circuit-name>> -ResourceGroupName <<resource-group>>

    $ckt.Sku.Tier = "Premium"
    $ckt.Sku.Family = "MeteredData"
	$ckt.Sku.Name = "Premium_MeteredData"

    Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $ckt
	```

	>[AZURE.IMPORTANT] Make sure the `Sku.Name` property matches the `Sku.Tier` and `Sku.Family`. If you change the family and tier, but not the name, your connection will be disabled.

	You can upgrade the SKU without disruption, but you cannot switch from the unlimited pricing plan to metered. When downgrading the SKU, your bandwidth consumption must remain within the default limit of the standard SKU.

	> [AZURE.NOTE] ExpressRoute offers two pricing plans to customers, based on metering or unlimited data. See [ExpressRoute pricing][expressroute-pricing] for details. Charges vary according to circuit bandwidth. Available bandwidth will likely vary from provider to provider. Use the `Get-AzureRmExpressRouteServiceProvider` cmdlet to see the providers available in your region and the bandwidths that they offer.
	>
	> A single ExpressRoute circuit can support a number of peerings and VNet links. See [ExpressRoute limits][expressroute-limits] for more information.
	>
	> For an extra charge, ExpressRoute Premium Add-on provides:
	>
	> - Up to 10,000 routes per circuit. Without ExpressRoute Premium Add-on, the limit is 4,000 routes per circuit.
	>
	> - Global connectivity, enabling an ExpressRoute circuit located anywhere in the world to access resources in any region rather than just regions in the same continent.
	>
	> - An increase in the number of VNet links per circuit from 10 to a larger limit, depending on the bandwidth of the circuit.

- ExpressRoute circuits are designed to allow temporary network bursts up to two times the bandwidth limit that you procured for no additional cost. This is achieved by using redundant links. However, not all connectivity providers support this feature; verify that your connectivity provider enables this feature before depending on it.

## Monitoring considerations

You can use the [Azure Connectivity Toolkit (AzureCT)][azurect] to monitor connectivity between your on-premises datacenter and Azure.  

## Troubleshooting considerations

If a previously functioning ExpressRoute circuit now fails to connect, in the absence of any configuration changes on-premises or within your private VNet, you may need to contact the connectivity provider and work with them to correct the issue. You can also use the following Azure PowerShell commands to perform some limited checking and help determine where problems might lie:

- Verify that the circuit has been provisioned:

	```powershell
	Get-AzureRmExpressRouteCircuit -Name <<circuit-name>> -ResourceGroupName <<resource-group>>
	```

	The output of this command shows several properties for your circuit, including `ProvisioningState`, `CircuitProvisioningState`, and `ServiceProviderProvisioningState` as shown below.
	
		ProvisioningState                : Succeeded
		Sku                              : {
		                                     "Name": "Standard_MeteredData",
		                                     "Tier": "Standard",
		                                     "Family": "MeteredData"
		                                   }
		CircuitProvisioningState         : Enabled
		ServiceProviderProvisioningState : NotProvisioned

- If the `ProvisioningState` is not set to `Succeeded` after you tried to create a new circuit, remove the circuit by using the command below and try to create it again.

	```powershell
	Remove-AzureRmExpressRouteCircuit -Name <<circuit-name>> -ResourceGroupName <<resource-group>>
	```
- If your provider had already provisioned the circuit, and the `ProvisioningState` is set to `Failed`, or the `CircuitProvisioningState` is not `Enabled`, contact your provider for further assistance.

## Solution components

<!-- The following text is boilerplate, and should be used in all RA docs -->

A sample solution script, [Deploy-ReferenceArchitecture.ps1][solution-script], is available that you can use to implement the architecture that follows the recommendations described in this article. This script utilizes [Azure Resource Manager][arm-templates] templates. The templates are available as a set of fundamental building blocks, each of which performs a specific action such as creating a VNet or configuring an NSG. The purpose of the script is to orchestrate template deployment.

The templates are parameterized, with the parameters held in separate JSON files. You can modify the parameters in these files to configure the deployment to meet your own requirements. You do not need to amend the templates themselves. Note that you must not change the schemas of the objects in the parameter files.

When you edit the parameter files, create objects that follow the naming conventions described in [Recommended Naming Conventions for Azure Resources][naming-conventions].

<!-- End of boilerplate -->

>[AZURE.NOTE] This script creates the ExpressRoute circuit but does not provision it. You must work with your service provider to perform this task.

The script references the parameters in the following files:

- **[er-gateway-er-connection-settings.parameters.json][er-gateway-parameters]**. This file contains the parameters that specify the settings for a VNet and virtual network gateway connection for linking to the ExpressRoute circuit. 

	```json
	"parameters": {
      "virtualNetworkSettings": {
        "value": {
          "name": "hybrid-er-vnet",
          "addressPrefixes": [
            "10.20.0.0/16"
          ],
          "subnets": [
            {
              "name": "GatewaySubnet",
              "addressPrefix": "10.20.255.224/27"
            },
            {
              "name": "hybrid-er-internal-subnet",
              "addressPrefix": "10.20.0.0/24"
            }
          ],
          "dnsServers": [ ]
        }
      },
      "virtualNetworkGatewaySettings": {
        "value": {
          "name": "hybrid-er-vgw",
          "gatewayType": "ExpressRoute",
          "vpnType": "RouteBased",
          "sku": "Standard"
        }
      },
      "connectionSettings": {
        "value": {
          "name": "hybrid-er-vpn",
          "connectionType": "ExpressRoute",
          "virtualNetworkGateway1": {
            "name": "hybrid-er-vgw"
          },
          "expressRouteCircuit": {
            "name": "hybrid-er-erc"
          }
        }
      }
	}
	```

	- The `virtualNetworkSettings` section defines the structure of the VNet to create. You can specify the name of the VNet (*hybrid-er-vnet* shown in the example above) and the address space (*10.20.0.0/16*).

		The `subnets` array indicates the subnets to add to the VNet. You must always create at least one subnet named *GatewaySubnet* with an address space of at least /27. Do not create any application objects in the GatewaySubnet. 

		You should also create subnets with sufficient space to hold the IP addresses for each peering required by your organization. 

		You can also use the `dnsServers` array to specify the addresses of DNS servers required by your application.

	- The `virtualNetworkGatewaySettings` section contains the information used to create the Azure VPN gateway. 

		For this architecture, ensure that the `gatewayType` parameter is set to *ExpressRoute*. The `vpnType` parameter can be *RouteBased* or *PolicyBased*. You can set the `sku` parameter to *Standard* or *HighPerformance*.

	- The `connectionSettings` section defines the configuration for the local network gateway and the connection to the on-premises network.

		The `connectionType` should be *ExpressRoute*.

		The `expressRouteCircuit` object specifies the name of the ExpressRoute circuit to use to create the connection. This should be the name of a circuit defined in the [er-circuit.parameters.json][er-circuit-parameters] file.

- **[er-circuit.parameters.json][er-circuit-parameters]**. This file contains the details of the ExpressRoute circuit. Set the parameters in this file to the values appropriate to your provider:

	```json
	"parameters": {
      "expressRouteCircuitSettings": {
        "value": {
          "name": "hybrid-er-erc",
          "skuTier": "Premium",
          "skuFamily": "UnlimitedData",
          "serviceProviderName": "Equinix",
          "peeringLocation": "Silicon Valley",
          "bandwidthInMbps": 50,
          "allowClassicOperations": false
        }
      }
	}
	```

## Deployment

You can run the Deploy-ReferenceArchitecture.ps1 script twice. The first time to create the ExpressRoute circuit, and the second time to create a virtual network connection to your Azure VNet through the ExpressRoute circuit. If you already have an ExpressRoute circuit, you do not need to create another one, and you can just run the script once to connect to the VNet.

The solution assumes the following prerequisites:

- You have an existing on-premises infrastructure already configured with a suitable network appliance.

- You have an existing Azure subscription in which you can create resource groups.

- You have downloaded and installed the most recent build of Azure Powershell. See [here][azure-powershell-download] for instructions.

To run the script that deploys the solution:

1. Move to a convenient folder on your local computer and create the following two subfolders:

	- Scripts

	- Templates

2. Download the [Deploy-ReferenceArchitecture.ps1][solution-script] file to the Scripts folder

3. Download the [er-gateway-er-connection-settings.parameters.json][er-gateway-parameters] and [er-circuit.parameters.json][er-circuit-parameters] files to Templates folder:

4. Edit the Deploy-ReferenceArchitecture.ps1 file in the Scripts folder, and change the following line to specify the resource group that should be created or used to hold the resources created by the script:

	```powershell
	$resourceGroupName = "hybrid-er-rg"
	```
5. Edit the parameter files in the Templates folder to set the parameters for the VNet, virtual network gateway, and ExpressRoute connection, as described in the Solution Components section above.

6. Open an Azure PowerShell window, move to the Scripts folder, and run the following command to create the ExpressRoute circuit. If you already have an ExpressRoute circuit, you can skip this step:

	```powershell
	.\Deploy-ReferenceArchitecture.ps1 <subscription id> <location> Circuit
	```

	Replace `<subscription id>` with your Azure subscription ID.

	For `<location>`, specify an Azure region, such as `eastus` or `westus`.

7. When the script has completed, contact your service provider with the ServiceKey of the circuit and wait for the circuit to be provisioned.

	You can find the ServiceKey by using the Azure portal:

	![[4]][4]

8. After the circuit has been provisioned, run the script again as follows to create a VNet and a virtual network gateway connection to the VNet:

	```powershell
	.\Deploy-ReferenceArchitecture.ps1 <subscription id> <location> VNet
	```

	Specify the same values for `<subscription id>` and `<location>` as before.

9. Use the Azure portal to verify that the VNet and ExpressRoute virtual network gateway connection have been created successfully.

## Next steps

- See [Implementing a highly available hybrid network architecture][highly-available-network-architecture] for information about increasing the availability of a hybrid network based on ExpressRoute by failing over to a VPN connection.

<!-- links -->
[expressroute-technical-overview]: ../expressroute/expressroute-introduction.md
[resource-manager-overview]: ../resource-group-overview.md
[azure-powershell]: ../powershell-azure-resource-manager.md
[expressroute-prereqs]: ../expressroute/expressroute-prerequisites.md
[configure-expressroute-routing]: ../expressroute/expressroute-howto-routing-arm.md
[sla-for-expressroute]: https://azure.microsoft.com/support/legal/sla/expressroute/v1_0/
[link-vnet-to-expressroute]: ../expressroute/expressroute-howto-linkvnet-arm.md
[ExpressRoute-provisioning]: ../expressroute/expressroute-workflows.md
[expressroute-pricing]: https://azure.microsoft.com/pricing/details/expressroute/
[expressroute-limits]: ../azure-subscription-service-limits/#networking-limits
[sample-script]: #sample-solution-script
[connectivity-providers]: ../expressroute/expressroute-introduction/#how-can-i-connect-my-network-to-microsoft-using-expressroute
[azurect]: https://github.com/Azure/NetworkMonitoring/tree/master/AzureCT
[forced-tuneling]: ./guidance-iaas-ra-secure-vnet-hybrid.md
[highly-available-network-architecture]: ./guidance-hybrid-network-expressroute-vpn-failover.md
[arm-templates]: ../resource-group-authoring-templates.md
[naming-conventions]: ./guidance-naming-conventions.md
[solution-script]: https://raw.githubusercontent.com/mspnp/arm-building-blocks/master/guidance-hybrid-network-er/Scripts/Deploy-ReferenceArchitecture.ps1
[er-gateway-parameters]: https://raw.githubusercontent.com/mspnp/arm-building-blocks/master/guidance-hybrid-network-er/Templates/er-gateway-er-connection-settings.parameters.json
[er-circuit-parameters]: https://raw.githubusercontent.com/mspnp/arm-building-blocks/master/guidance-hybrid-network-er/Templates/er-circuit.parameters.json

[azure-powershell-download]: https://azure.microsoft.com/documentation/articles/powershell-install-configure/
[0]: ./media/guidance-hybrid-network-expressroute/figure1.png "Hybrid network architecture using Azure ExpressRoute"
[1]: ./media/guidance-hybrid-network-expressroute/figure2.png "Using redundant routers with ExpressRoute primary and secondary circuits"
[2]: ./media/guidance-hybrid-network-expressroute/figure3.png "Adding security devices to the on-premises network"
[3]: ./media/guidance-hybrid-network-expressroute/figure4.png "Using forced tunneling to audit Internet-bound traffic"
[4]: ./media/guidance-hybrid-network-expressroute/figure5.png "Locating the ServiceKey of an ExpressRoute circuit"
