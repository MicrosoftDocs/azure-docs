<properties
   pageTitle="Azure reference architecture - IaaS: Implementing a highly available hybrid network architecture | Microsoft Azure"
   description="How to implement a secure site-to-site network architecture that spans an Azure virtual network and an on-premises network connected by using ExpressRoute with VPN gateway failover."
   services="guidance,virtual-network,vpn-gateway,expressroute"
   documentationCenter="na"
   authors="telmosampaio"
   manager="christb"
   editor=""
   tags="azure-resource-manager"/>

<tags
   ms.service="guidance"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="08/26/2016"
   ms.author="telmos"/>

# Implementing a highly available hybrid network architecture

[AZURE.INCLUDE [pnp-header](../../includes/guidance-pnp-header-include.md)]

This article describes best practices for connecting an on-premises network to virtual networks on Azure by using ExpressRoute, with a site-to-site virtual private network (VPN) as a failover connection. The traffic flows between the on-premises network and an Azure virtual network (VNet) through an ExpressRoute connection.  If there is a loss of connectivity in the ExpressRoute circuit, traffic will be routed through an IPSec VPN tunnel.

> [AZURE.NOTE] Azure has two different deployment models: [Resource Manager][resource-manager-overview] and classic. This blueprint uses Resource Manager, which Microsoft recommends for new deployments.

Typical use cases for this architecture include:

- Hybrid applications where workloads are distributed between an on-premises network and Azure.

- Applications running large-scale, mission-critical workloads that require a high degree of scalability.

- Large-scale backup and restore facilities for data that must be saved off-site.

- Handling Big Data workloads.

- Using Azure as a disaster-recovery site.

Note that if the ExpressRoute circuit is unavailable, the VPN route will only handle private peering connections. Public peering and Microsoft peering connections will pass over the Internet.

## Architecture diagram

>[AZURE.NOTE] The [Azure VPN Gateway service][azure-vpn-gateway] implements two types of virtual network gateways; VPN virtual network gateways and ExpressRoute virtual network gateways. Throughout this document, the term *VPN Gateway* refers to the Azure service, while the phrases *VPN virtual network gateway* and *ExpressRoute virtual network gateway* are used to refer to the VPN and ExpressRoute implementations of the gateway respectively.


The following diagram highlights the important components in this architecture:

![[0]][0]

- **Azure Virtual Networks (VNets).** Each VNet resides in a single Azure region, and can host multiple application tiers. Application tiers can be segmented using subnets in each VNet  and/or network security groups (NSGs).

- **On-premises corporate network.** This is a network of computers and devices, connected through a private local-area network running within an organization.

- **VPN appliance.** This is a device or service that provides external connectivity to the on-premises network. The VPN appliance may be a hardware device, or it can be a software solution such as the Routing and Remote Access Service (RRAS) in Windows Server 2012.

    > [AZURE.NOTE] For a list of supported VPN appliances and information on configuring selected VPN appliances for connecting to an Azure VPN Gateway, see the instructions for the appropriate device in the [list of VPN devices supported by Azure][vpn-appliance].

- **VPN virtual network gateway.** The VPN virtual network gateway enables the VNet to connect to the VPN appliance in the on-premises network. The VPN virtual network gateway is configured to accept requests from the on-premises network only through the VPN appliance. For more information, see [Connect an on-premises network to a Microsoft Azure virtual network][connect-to-an-Azure-vnet].

- **ExpressRoute virtual network gateway.** The ExpressRoute virtual network gateway enables the VNet to connect to the ExpressRoute circuit used for connectivity with your on-premises network.

- **Gateway subnet.** The virtual network gateways are held in the same subnet.

- **VPN connection.** The connection has properties that specify the connection type (IPSec) and the key shared with the on-premises VPN appliance to encrypt traffic.

- **ExpressRoute circuit.** This is a layer 2 or layer 3 circuit supplied by the connectivity provider that joins the on-premises network with Azure through the edge routers. The circuit uses the hardware infrastructure managed by the connectivity provider.

- **N-tier cloud application.** This is the application hosted in Azure. It might include multiple tiers, with multiple subnets connected through Azure load balancers. The traffic in each subnet may be subject to rules defined by using [Azure Network Security Groups][azure-network-security-group](NSGs). For more information, see [Getting started with Microsoft Azure security][getting-started-with-azure-security].

## Recommendations

### VNet and GatewaySubnet

- Create the ExpressRoute virtual network gateway and the VPN virtual network gateway in the same VNet. This means that they should share the same subnet named **GatewaySubnet**

- If the VNet already includes a subnet named **GatewaySubnet**, ensure that it has a /27 or larger address space. If the existing subnet is too small, then remove it as follows and create a new one as shown in the next bullet:

    ```powershell
    $vnet = Get-AzureRmVirtualNetworkGateway -Name <yourvnetname> -ResourceGroupName <yourresourcegroup>
    Remove-AzureRmVirtualNetworkSubnetConfig -Name GatewaySubnet -VirtualNetwork $vnet
    ```

- If the VNet does not contain a subnet named **GatewaySubnet**, then create a new one as follows:

    ```powershell
    $vnet = Get-AzureRmVirtualNetworkGateway -Name <yourvnetname> -ResourceGroupName <yourresourcegroup>
    Add-AzureRmVirtualNetworkSubnetConfig -Name "GatewaySubnet" -VirtualNetwork $vnet -AddressPrefix "10.200.255.224/27"
    $vnet = Set-AzureRmVirtualNetwork -VirtualNetwork $vnet
    ```

### VPN and ExpressRoute gateways

- Verify that your organization meets the [ExpressRoute prerequisite requirements][expressroute-prereq] for connecting to Azure.

- If you already have a VPN virtual network gateway in your Azure VNet, remove it, as shown below.

    ```powershell
    Remove-AzureRmVirtualNetworkGateway -Name <yourgatewayname> -ResourceGroupName <yourresourcegroup>
    ```

- Follow the instructions in [Implementing a hybrid network architecture with Azure ExpressRoute][implementing-expressroute] to establish your ExpressRoute connection.

- Follow the instructions in [Implementing a hybrid network architecture with Azure and On-premises VPN][implementing-vpn] to establish your VPN virtual network gateway connection.

- After you have established the virtual network gateway connections, test the environment as following:

    1. Make sure you can connect from your on-premises network to your Azure VNet.

    2. Temporarily remove the ExpressRoute virtual network gateway connection.

        ```powershell
        Remove-AzureRmVirtualNetworkGatewayConnection -ResourceGroupName <yourresourcegroup> -Name <yourERconnection>
        ```

    3. Verify that the you can still connect from your on-premises network to your Azure VNet using the VPN virtual network gateway connection.

    4. Reestablish the ExpressRoute connection.

        ```powershell
        New-AzureRmVirtualNetworkGatewayConnection -ResourceGroupName <yourresourcegroup> -Name <yourERconnection> -ConnectionType ExpressRoute -VirtualNetworkGateway1 <gateway1> -VirtualNetworkGateway2 <gateway2> -LocalNetworkGateway2 <localgw1> -SharedKey <sharedKey>
        ```

## Considerations

For ExpressRoute considerations, see the [Implementing a Hybrid Network Architecture with Azure ExpressRoute][guidance-expressroute] guidance.

For Site-to-Site VPN considerations, see the [Implementing a Hybrid Network Architecture with Azure and On-premises VPN][guidance-vpn] guidance.

For general Azure security considerations, see [Microsoft cloud services and network security][best-practices-security].

## Solution components

A sample solution script, [Deploy-ReferenceArchitecture.ps1][solution-script], is available that you can use to implement the architecture that follows the recommendations described in this article. This script utilizes [Resource Manager][ARM-Templates] templates. The templates are available as a set of fundamental building blocks, each of which performs a specific action such as creating a VNet or configuring an NSG. The purpose of the script is to orchestrate template deployment.

>[AZURE.NOTE] Deploy-ReferenceArchitecture.ps1 is a PowerShell script. If your operating system does not support PowerShell, a bash script called [deploy-reference-architecture.sh][solution-script-bash] is also available.

The templates are parameterized, with the parameters held in separate JSON files. You can modify the parameters in these files to configure the deployment to meet your own requirements. You do not need to amend the templates themselves. Note that you must not change the schemas of the objects in the parameter files.

When you edit the templates, create objects that follow the naming conventions described in [Recommended Naming Conventions for Azure Resources][naming conventions].

>[AZURE.NOTE] This script creates the ExpressRoute circuit but does not provision it. You must work with your service provider to perform this task.

The script references the parameters in the following files:

- **[virtualNetwork.parameters.json][vnet-parameters]**. This file defines the VNet settings, such as the name, address space, subnets, and the addresses of any DNS servers required:

    <!-- source: https://github.com/mspnp/reference-architectures/blob/master/guidance-hybrid-network-vpn-er/parameters/virtualNetwork.parameters.json#L4-L24 -->
    ```json
    "parameters": {
      "virtualNetworkSettings": {
        "value": {
          "name": "ra-hybrid-vpn-er-vnet",
          "addressPrefixes": [
            "10.20.0.0/16"
          ],
          "subnets": [
            {
              "name": "GatewaySubnet",
              "addressPrefix": "10.20.255.224/27"
            },
            {
              "name": "ra-hybrid-vpn-er-sn",
              "addressPrefix": "10.20.1.0/24"
            }
          ],
          "dnsServers": [ ]
        }
      }
    }
    ```

    You can specify the name of the VNet (*RA-hybrid-vpn-er-vnet* shown in the example above) and the address space (*10.20.0.0/16*).

    The `subnets` array indicates the subnets to add to the VNet. You must always create at least one subnet named *GatewaySubnet* with an address space of at least /27. You can create additional subnets as required by your application. Do not create any application objects in the GatewaySubnet.

    You can also use the `dnsServers` array to specify the addresses of DNS servers required by your application.

- **[virtualNetworkGateway-vpn.parameters.json][virtualnetworkgateway-vpn-parameters]**. This file contains the parameters used to create the network gateway for the VPN connection:

    <!-- source: https://github.com/mspnp/reference-architectures/blob/master/guidance-hybrid-network-vpn-er/parameters/virtualNetworkGateway-vpn.parameters.json#L4-L33 -->
    ```json
    "parameters": {
        "virtualNetworkSettings": {
            "value": {
            "name": "ra-hybrid-vpn-er-vnet"
            }
        },
        "virtualNetworkGatewaySettings": {
            "value": {
            "name": "ra-hybrid-vpn-vgw",
            "gatewayType": "Vpn",
            "vpnType": "RouteBased",
            "sku": "Standard"
            }
        },
        "connectionSettings": {
            "value": {
            "name": "ra-hybrid-vpn-cn",
            "connectionType": "IPsec",
            "sharedKey": "123secret",
            "virtualNetworkGateway1": {
                "name": "ra-hybrid-vpn-vgw"
            },
            "localNetworkGateway": {
                "name": "ra-hybrid-vpn-lgw",
                "ipAddress": "40.50.60.70",
                "addressPrefixes": [ "192.168.0.0/16" ]
            }
            }
        }
    }
    ```
    Do not change the `gatewayType` parameter; leave it set to *Vpn*. The `vpnType` parameter can be *RouteBased* or *PolicyBased*. You can set the `sku` parameter to *Standard* or *HighPerformance*. 

    The `connectionSettings` section defines the configuration for the local network gateway and the connection to the on-premises network.

    The `connectionType` and `sharedKey` settings specify the connection protocol and key to use to connect to the on-premises network (you should have already configured the on-premises VPN appliance).

    The `localNetworkGateway` object specifies the public IP address of the on-premises VPN appliance (*40.50.60.70* in this example), and an array of internal address spaces for the on-premises side of the network.

- **[virtualNetworkGateway-expressRoute.parameters.json][virtualnetworkgateway-expressroute-parameters]**. This file contains the parameters used to create the network gateway for ExpressRoute:
    <!-- source: https://github.com/mspnp/reference-architectures/blob/master/guidance-hybrid-network-vpn-er/parameters/virtualNetworkGateway-expressRoute.parameters.json#L4-L30 -->
    ```json
    "parameters": {
      "virtualNetworkSettings": {
        "value": {
          "name": "ra-hybrid-vpn-er-vnet"
        }
      },
      "virtualNetworkGatewaySettings": {
        "value": {
          "name": "ra-hybrid-er-vgw",
          "gatewayType": "ExpressRoute",
          "vpnType": "RouteBased",
          "sku": "Standard"
        }
      },
      "connectionSettings": {
        "value": {
          "name": "ra-hybrid-er-cn",
          "connectionType": "ExpressRoute",
          "virtualNetworkGateway1": {
            "name": "ra-hybrid-er-vgw"
          },
          "expressRouteCircuit": {
            "name": "ra-hybrid-vpn-er-erc"
          }
        }
      }
    }
    ```

    This time, ensure that the `gatewayType` parameter is set to *ExpressRoute*. The `vpnType` parameter can be *RouteBased* or *PolicyBased*. You can set the `sku` parameter to *Standard* or *HighPerformance*.

    The `connectionSettings` section defines the configuration for the local network gateway and the connection to the on-premises network:

    - The `connectionType` should be *ExpressRoute*.

    - The `expressRouteCircuit` object specifies the name of the ExpressRoute circuit to use to create the connection. This should be the name of a circuit defined in the [expressRouteCircuit.parameters.json][er-circuit-parameters] file described below.

- **[expressRouteCircuit.parameters.json][er-circuit-parameters]**. This file contains the details of the ExpressRoute circuit. Set the parameters in this file to the values appropriate to your provider:
    <!-- source: https://github.com/mspnp/reference-architectures/blob/master/guidance-hybrid-network-vpn-er/parameters/expressRouteCircuit.parameters.json#L4-L21 -->
    ```json
    "parameters": {
      ...,
      "expressRouteCircuitSettings": {
      "value": {
        "name": "ra-hybrid-vpn-er-erc",
        "skuTier": "Premium",
        "skuFamily": "UnlimitedData",
        "serviceProviderName": "Equinix",
        "peeringLocation": "Silicon Valley",
        "bandwidthInMbps": 50,
        "allowClassicOperations": false
      }
    }
    ```

## Solution Deployment

You can run the Deploy-ReferenceArchitecture.ps1 script twice. The first time to create the ExpressRoute circuit, and the second time to create the VNet, gateway, VPN connection and ExpressRoute connection to your Azure VNet. If you already have an existing ExpressRoute circuit, you do not need to create another and you only need to run the script once.

The solution assumes the following prerequisites:

- You have an existing on-premises infrastructure already configured with a suitable network appliance.

- You have an existing Azure subscription in which you can create resource groups.

- You have installed the [Azure Command-Line Interface][azure-cli].

- If you wish to use PowerShell, you have downloaded and installed the most recent build. See [here][azure-powershell-download] for instructions.

To run the script that deploys the solution:

1. Create a folder named `Scripts` that contains a subfolder named `Parameters`.

2. Download the [Deploy-ReferenceArchitecture.ps1][solution-script] PowerShell script or [deploy-reference-architecture.sh][solution-script-bash] bash script, as appropriate, to the Scripts folder.

3. Download the [virtualNetwork.parameters.json][vnet-parameters], [virtualNetworkGateway-expressRoute.parameters.json][virtualnetworkgateway-expressroute-parameters], [virtualNetworkGateway-vpn.parameters.json][virtualnetworkgateway-vpn-parameters], and [expressRouteCircuit.parameters.json][er-circuit-parameters] files to Parameters folder:

4. Edit the Deploy-ReferenceArchitecture.ps1 or deploy-reference-architecture.sh file in the Scripts folder, and change the following line to specify the resource group that should be created or used to hold the VM and resources created by the script:

    <!-- source: https://github.com/mspnp/reference-architectures/blob/master/guidance-hybrid-network-vpn-er/Deploy-ReferenceArchitecture.ps1#L43 -->
    ```powershell
    # PowerShell
    $resourceGroupName = "ra-hybrid-vpn-er-rg"
    ```

    <!-- source: https://github.com/mspnp/reference-architectures/blob/master/guidance-hybrid-network-vpn-er/deploy-reference-architecture.sh#L3 -->
    ```bash
    # bash
    RESOURCE_GROUP_NAME="ra-hybrid-vpn-er-rg"
    ```

5. Edit each of the JSON files in the Parameters folder to set the parameters for the virtual network, VPN gateway, ExpressRoute circuit, and connection, as described in the Solution Components section above

6. If you are using PowerShell and don't have an existing ExpressRoute circuit, open an Azure PowerShell window, move to the Scripts folder, and run the following command:

    ```powershell
    .\Deploy-ReferenceArchitecture.ps1 <subscription id> <location> Circuit
    ```

    Replace `<subscription id>` with your Azure subscription ID.

    For `<location>`, specify an Azure region, such as `eastus` or `westus`.

7. If you are using bash, open a bash shell command prompt, move to the Scripts folder, and run the following command:

    ```bash
    azure login
    ```

    Follow the instructions to log in to your Azure account. When you have connected, run the following command:

    ```bash
    ./deploy-reference-architecture.sh -s <subscription id> -l <location> -m circuit
    ```

    Replace `<subscription id>` with your Azure subscription ID.

    For `<location>`, specify an Azure region, such as `eastus` or `westus`.

8. When the script has completed, contact your service provider with the ServiceKey of the circuit and wait for the circuit to be provisioned.

9. After the circuit has been provisioned, run the script again as follows to create a VNet and virtual network gateway connections to the VNet:

    ```powershell
    .\Deploy-ReferenceArchitecture.ps1 <subscription id> <location> Network
    ```

    ```bash
    ./deploy-reference-architecture.sh -s <subscription id> -l <location> -m network
    ```

    Specify the same values for `<subscription id>` and `<location>` as before.

10. Use the Azure portal to verify that the VNet, VPN connection, and ExpressRoute connection have been created successfully.

11. From an on-premises machine, verify that you can connect to the VNet through the gateway using the VPN and ExpressRoute connections.

<!-- links -->

[resource-manager-overview]: ../resource-group-overview.md
[vpn-appliance]: ../vpn-gateway/vpn-gateway-about-vpn-devices.md
[azure-vpn-gateway]: ../vpn-gateway/vpn-gateway-about-vpngateways.md
[connect-to-an-Azure-vnet]: https://technet.microsoft.com/library/dn786406.aspx
[azure-network-security-group]: ../virtual-network/virtual-networks-nsg.md
[getting-started-with-azure-security]: ./../security/azure-security-getting-started.md
[expressroute-prereq]: ../expressroute/expressroute-prerequisites.md
[implementing-expressroute]: ./guidance-hybrid-network-expressroute.md#implementing-this-architecture
[implementing-vpn]: ./guidance-hybrid-network-vpn.md#implementing-this-architecture
[guidance-expressroute]: ./guidance-hybrid-network-expressroute.md
[guidance-vpn]: ./guidance-hybrid-network-vpn.md
[best-practices-security]: ../best-practices-network-security.md
[solution-script]: https://github.com/mspnp/reference-architectures/tree/master/guidance-hybrid-network-vpn-er/Deploy-ReferenceArchitecture.ps1
[solution-script-bash]: https://github.com/mspnp/reference-architectures/tree/master/guidance-hybrid-network-vpn-er/deploy-reference-architecture.sh
[vnet-parameters]: https://github.com/mspnp/reference-architectures/tree/master/guidance-hybrid-network-vpn-er/parameters/virtualNetwork.parameters.json
[virtualnetworkgateway-vpn-parameters]: https://github.com/mspnp/reference-architectures/tree/master/guidance-hybrid-network-vpn-er/parameters/virtualNetworkGateway-vpn.parameters.json
[virtualnetworkgateway-expressroute-parameters]: https://github.com/mspnp/reference-architectures/tree/master/guidance-hybrid-network-vpn-er/parameters/virtualNetworkGateway-expressRoute.parameters.json
[er-circuit-parameters]: https://github.com/mspnp/reference-architectures/tree/master/guidance-hybrid-network-vpn-er/parameters/expressRouteCircuit.parameters.json
[azure-powershell-download]: https://azure.microsoft.com/documentation/articles/powershell-install-configure/
[naming conventions]: ./guidance-naming-conventions.md
[azure-cli]: https://azure.microsoft.com/documentation/articles/xplat-cli-install/
[0]: ./media/guidance-hybrid-network-expressroute-vpn-failover/figure1.png "Architecture of a highly available hybrid network architecture using ExpressRoute and VPN gateway"
[ARM-Templates]: https://azure.microsoft.com/documentation/articles/resource-group-authoring-templates/
