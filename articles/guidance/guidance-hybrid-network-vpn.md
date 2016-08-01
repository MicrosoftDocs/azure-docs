<properties
   pageTitle="Implementing a Hybrid Network Architecture with Azure and On-premises VPN | Reference Architecture | Microsoft Azure"
   description="How to implement a secure site-to-site network architecture that spans an Azure virtual network and an on-premises network connected by using a VPN."
   services=""
   documentationCenter="na"
   authors="RohitSharma-pnp"
   manager="christb"
   editor=""
   tags=""/>

<tags
   ms.service="guidance"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="07/29/2016"
   ms.author="roshar"/>

# Implementing a Hybrid Network Architecture with Azure and On-premises VPN

[AZURE.INCLUDE [pnp-header](../../includes/guidance-pnp-header-include.md)]

This article outlines a set of practices for extending an on-premises network onto Azure using a site-to-site virtual private network (VPN). The traffic flows between the on-premises network and an Azure Virtual Network (VNet) through an IPSec VPN tunnel. This architecture is suitable for hybrid applications with the following characteristics:

- Parts of the application run on-premises while others run in Azure.

- The traffic between on-premises hardware and the cloud is likely to be light, or it is beneficial to trade slightly extended latency for the flexibility and processing power of the cloud.

- The extended network constitutes a closed system. There is no direct path from the Internet to the Azure VNet.

- Users connect to the on-premises network to use the services hosted in Azure. The bridge between the on-premises network and the services running in Azure is transparent to users.

Examples of scenarios that fit this profile include:

- Line-of-business applications used within an organization, where part of the functionality has been migrated to the cloud.

- Development/test/lab workloads.

> [AZURE.NOTE] Azure has two different deployment models: [Resource Manager][resource-manager-overview] and classic. This blueprint uses Resource Manager, which Microsoft recommends for new deployments.

## Architecture diagram

The following diagram highlights the components in this architecture:

![[0]][0]

- **On-premises network.** This is a network of computers and devices, connected through a private local-area network running within an organization.

- **VPN appliance.** This is a device or service that provides external connectivity to the on-premises network. The VPN appliance may be a hardware device, or it can be a software solution such as the Routing and Remote Access Service (RRAS) in Windows Server 2012.

    > [AZURE.NOTE] For a list of supported VPN appliances and information on configuring selected VPN appliances for connecting to an Azure VPN Gateway, see the instructions for the appropriate device in the [list of VPN devices supported by Azure][vpn-appliance].

- **N-tier cloud application.** This is the application hosted in Azure. It might include multiple tiers, with multiple subnets connected through Azure load balancers. The traffic in each subnet may be subject to rules defined by using [Azure Network Security Groups (NSGs)][azure-network-security-group]. For more information, see [Getting started with Microsoft Azure security][getting-started-with-azure-security].

    > [AZURE.NOTE] This article describes the cloud application as a single entity. See [Implementing a Multi-tier Architecture on Azure][implementing-a-multi-tier-architecture-on-Azure] for detailed information.

- **[Virtual network (VNet)][azure-virtual-network].** The cloud application and the components for the Azure VPN Gateway reside in the same VNet.

- **[Azure VPN Gateway][azure-vpn-gateway].** The VPN gateway service enables you to connect the VNet to the on-premises network through a VPN appliance. For more information, see [Connect an on-premises network to a Microsoft Azure virtual network][connect-to-an-Azure-vnet]. The VPN Gateway comprises the following elements:

	- **Virtual network gateway.** This is a resource that provides a virtual VPN appliance for the VNet. It is responsible for routing traffic from the on-premises network to the VNet.
	
	- **Local network gateway.** This is an abstraction of the on-premises VPN appliance. Network traffic from the cloud application to the on-premises network is routed through this gateway.

	- **Connection.** The connection has properties that specify the connection type (IPSec) and the key shared with the on-premises VPN appliance to encrypt traffic.

	- **Gateway subnet.** The virtual network gateway is held in its own subnet, which is subject to various requirements, as described in the Recommendations section below.

- **Internal load balancer.** Network traffic from the VPN Gateway is routed to the cloud application through an internal load balancer. The load balancer is located in the front-end subnet of the application.

## Recommendations

### VNet and Gateway subnet

- Create an Azure VNet for holding the components in the cloud. The address space of the Azure VNet must be large enough to accommodate the addresses used by the VMs and subnets in the VNet. Ensure that the VNet address space has sufficient room for growth if additional VMs are likely to be needed in the future. The address space of the VNet must not overlap with the on-premises network. For example, the diagram above uses the address space 10.20.0.0/16 for the VNet.

- Create a subnet named _GatewaySubnet_, with an address range of /27. This subnet is required by the virtual network gateway, and allocating 32 addresses to this subnet will help to prevent you running up against possible gateway size limitations in the future. Avoid placing this subnet in the middle of the address space. A good practice is to set the address space for the gateway subnet at the upper end of the VNet address space. The example shown in the diagram uses 10.20.255.224/27.  A quick procedure to calculate the CIDR is as follows:

    1. Set the variable bits in the address space of the VNet to 1, up to the bits being used by the gateway subnet, then set the remaining bits to 0.
    2. Convert the resulting bits to decimal and express it as an address space with the prefix length set to the size of the gateway subnet.

 For example, for a VNet with an IP address range of 10.20.0.0/16, applying step #1 above becomes 10.20.0b11111111.0b11100000.  Converting that to decimal and expressing it as an address space yields 10.20.255.224/27

    > [AZURE.WARNING] Do not deploy other virtual machines or role instances to the gateway subnet. Also, do not assign an NSG to this subnet, as it will cause the gateway to stop functioning.

### Virtual network gateway

- Allocate a public IP address for the virtual network gateway.

- Create the virtual network gateway in the Gateway subnet and assign it the newly allocated public IP address. Use the gateway type that most closely matches your requirements and which is enabled by your VPN appliance:

	- Create a [policy-based gateway][policy-based-routing] if you need to closely control how requests are routed. based on policy criteria such as address prefixes. Policy-based gateways use static routing, and only work with site-to-site connections.

    - Create a [route-based gateway][route-based-routing] if you connect to the on-premises network using RRAS, support multi-site or cross-region connections, or implement VNet-to-VNet connections (including routes that traverse multiple VNets). Route-based gateways use dynamic routing to direct traffic between networks. They can tolerate failures in the network path better than static routes, because they can try alternative routes. Route-based gateways can also reduce the management overhead, because routes might not need to be updated manually when network addresses change.

    - For a list of supported VPN appliances, see [About VPN devices for Site-to-Site VPN Gateway connections][vpn-appliances].

    > [AZURE.NOTE] After the gateway has been created, you cannot change between gateway types without deleting and re-creating the gateway.

- Select the Azure VPN Gateway SKU that most closely matches your throughput requirements. Azure VPN Gateway is available in three SKUs shown in the following table. Each SKU provides differing throughput, [Charges are levied][azure-gateway-charges] based on the amount of time that the gateway is provisioned and available.

	| SKU | VPN Throughput | Max IPSec Tunnels|
	|-----|----------------|------------------|
	| Basic | 100 Mbps | 10 |
	| Standard | 100 Mbps | 10 |
	| High Performance | 200 Mbps | 30 |

	> [AZURE.NOTE] The Basic SKU is not compatible with Azure ExpressRoute. You can [change the SKU][changing-SKUs] after the getway has been created.

- Create routing rules for the gateway subnet that direct incoming application traffic from the gateway to the internal load balancer rather than allowing requests to pass directly to the VMs that implement the application.

### On-premises network connection

- Create a local network gateway. Specify the public IP address of the on-premises VPN appliance, and the address space of the on-premises network. Note that the on-premises VPN appliance must have a public IP address that can be accessed by the local network gateway in Azure VPN Gateway. The VPN device cannot be located behind a NAT device.

- Create a site-to-site connection for the virtual network gateway and the local network gateway. Select the Site-to-site (IPSec) connection type, and specify the shared key. Site-to-site encryption with the Azure VPN Gateway is based on the IPSec protocol, using pre-shared keys for authentication. You specify the key when you create the Azure VPN Gateway. You must configure the VPN appliance running on-premises with the same key. Other authentication mechanisms are not currently supported.

- Ensure that the on-premises routing infrastructure is configured to forward requests intended for addresses in the Azure VNet to the VPN device.

- Open any ports required by the cloud application in the on-premises network.

- Test the connection to verify that:

	- The on-premises VPN appliance correctly routes traffic to the cloud application through the Azure VPN Gateway.

	- The VNet correctly routes traffic back to the on-premises network.

	- Prohibited traffic in both directions is blocked correctly.

## Availability considerations

- If you need to ensure that the on-premises network remains available to the Azure VPN Gateway, implement a failover cluster for the on-premises VPN Gateway.

- If your organization has multiple on-premises sites, create [multi-site connections][vpn-gateway-multi-site] to one or more Azure VNets. This approach requires dynamic (route-based) routing, so ensure that the on-premises VPN Gateway supports this feature.

See [SLA for VPN Gateway][sla-for-vpn-gateway] for the details about the VPN Gateway SLA.

## Security considerations

- Generate a different shared key for each VPN gateway. Use a strong shared key to help resist brute-force attacks.

    > [AZURE.NOTE] Currently, you cannot use Azure Key Vault to pre-shared keys Azure VPN gateway.

- Ensure that the on-premises VPN appliance uses an encryption method that is [compatible with the Azure VPN Gateway][vpn-appliance-ipsec]. For policy-based routing, the Azure VPN Gateway supports the AES256, AES128, and 3DES encryption algorithms. Route-based gateways support AES256 and 3DES.

- If your on-premises VPN appliance is on a perimeter network that has a firewall between the perimeter network and the Internet, you might have to configure [additional firewall rules][additional-firewall-rules] to allow the site-to-site VPN connection.

- If the application in the VNet sends data to the Internet, consider [implementing forced tunnelling][forced-tunnelling] to route all Internet-bound traffic through the on-premises network. This approach enables you to audit outgoing requests made by the application from the on-premises infrastructure.

    > [AZURE.NOTE] Forced tunnelling can impact connectivity to Azure services (the Storage Service, for example) and the Windows License Manager.

## Scalability considerations

- You can achieve limited vertical scalability by moving from the Basic or Standard VPN Gateway SKUs to the High Performance VPN SKU.

- For VNets that expect a large volume of VPN traffic, consider distributing the different workloads into separate smaller VNets and configuring a VPN Gateway for each of them.

	You can partition the VNet either horizontally or vertically. To partition horizontally, move some VM instances from each tier into subnets of the new VNet. The result is that each VNet has the same structure and functionality. To partition vertically, redesign each tier to divide the functionality into different logical areas (such as handling orders, invoicing, customer account management, and so on). Each functional area can then be placed in its own VNet.

    The following diagram shows horizontal partitioning:

    ![[1]][1]

- Replicating an on-premises Active Directory domain controller in the VNet, and implementing DNS in the VNet, can help to reduce some of the security-related and administrative traffic flowing from on-premises to the cloud.

## Monitoring and manageability considerations

- Monitor diagnostic information from on-premises VPN appliances. This process depends on the features provided by the VPN appliance. For example, if you are using the Routing and Remote Access Service on Windows Server 2012, you should enable [RRAS logging][rras-logging].

- Use the [Azure VPN Gateway diagnostics][gateway-diagnostic-logs] to capture information about connectivity issues. These logs can be used to track information such as the source and destinations of connection requests, which protocol was used, and how the connection was established (or why the attempt failed).

- Monitor the operational logs of the Azure VPN Gateway by using the audit logs available in the Azure portal. Separate logs are available for the local network gateway, the Azure network gateway, and the connection. This information can be used to track any changes made to the gateway, and can be useful if a previously functioning gateway stops working for some reason.

	![[2]][2]

- Monitor connectivity, and track connectivity failure events. You can use a monitoring package such as [Nagios][nagios] to capture and report this information.

## Troubleshooting considerations

> [AZURE.NOTE] Visit the Routing and Remote Access Blog for general information on [troubleshooting common VPN-related errors][troubleshooting-vpn-errors].

If traffic is unable to traverse the VPN connection, check the following:

### On-premises VPN appliance:

- Is the on-premises VPN appliance functioning correctly?

	Check any log files generated by the VPN appliance for errors and failures. The location of this information will vary according to your appliance. For example, if you are using RRAS on Windows Server 2012, you can use the following PowerShell command to display error event information for the RRAS service:

	```
	Get-EventLog -LogName System -EntryType Error -Source RemoteAccess | Format-List -Property *
	```

	The _Message_ property of each entry provides a description of the error. Some common examples are:

	- Inability to connect, possibly due to an incorrect IP address specified for the Azure VPN Gateway in the RRAS VPN network interface configuration:

	```
	EventID            : 20111
	MachineName        : on-prem-vm
	Data               : {41, 3, 0, 0}
	Index              : 14231
	Category           : (0)
	CategoryNumber     : 0
	EntryType          : Error
	Message            : RoutingDomainID- {00000000-0000-0000-0000-000000000000}: A Demand Dial connection to the remote
	                     interface AzureGateway on port VPN2-4 was successfully initiated but failed to complete
	                     successfully because of the  following error: The network connection between your computer and
	                     the VPN server could not be established because the remote server is not responding. This could
	                     be because one of the network devices (e.g, firewalls, NAT, routers, etc) between your computer
	                     and the remote server is not configured to allow VPN connections. Please contact your
	                     Administrator or your service provider to determine which device may be causing the problem.
	Source             : RemoteAccess
	ReplacementStrings : {{00000000-0000-0000-0000-000000000000}, AzureGateway, VPN2-4, The network connection between
	                     your computer and the VPN server could not be established because the remote server is not
	                     responding. This could be because one of the network devices (e.g, firewalls, NAT, routers, etc)
	                     between your computer and the remote server is not configured to allow VPN connections. Please
	                     contact your Administrator or your service provider to determine which device may be causing the
	                     problem.}
	InstanceId         : 20111
	TimeGenerated      : 3/18/2016 1:26:02 PM
	TimeWritten        : 3/18/2016 1:26:02 PM
	UserName           :
	Site               :
	Container          :
	```

	- The wrong shared key being specified in the RRAS VPN network interface configuration:

	```
	EventID            : 20111
	MachineName        : on-prem-vm
	Data               : {233, 53, 0, 0}
	Index              : 14245
	Category           : (0)
	CategoryNumber     : 0
	EntryType          : Error
	Message            : RoutingDomainID- {00000000-0000-0000-0000-000000000000}: A Demand Dial connection to the remote
	                     interface AzureGateway on port VPN2-4 was successfully initiated but failed to complete
	                     successfully because of the  following error: IKE authentication credentials are unacceptable

	Source             : RemoteAccess
	ReplacementStrings : {{00000000-0000-0000-0000-000000000000}, AzureGateway, VPN2-4, IKE authentication credentials are
	                     unacceptable
	                     }
	InstanceId         : 20111
	TimeGenerated      : 3/18/2016 1:34:22 PM
	TimeWritten        : 3/18/2016 1:34:22 PM
	UserName           :
	Site               :
	Container          :
	```

	You can also obtain event log information about attempts to connect through the RRAS service by using the following PowerShell command:

	```
	Get-EventLog -LogName Application -Source RasClient | Format-List -Property *
	```

	In the event of a failure to connect, this log will contain errors that look similar to the following:

	```
	EventID            : 20227
	MachineName        : on-prem-vm
	Data               : {}
	Index              : 4203
	Category           : (0)
	CategoryNumber     : 0
	EntryType          : Error
	Message            : CoId={B4000371-A67F-452F-AA4C-3125AA9CFC78}: The user SYSTEM dialed a connection named
	                     AzureGateway which has failed. The error code returned on failure is 809.
	Source             : RasClient
	ReplacementStrings : {{B4000371-A67F-452F-AA4C-3125AA9CFC78}, SYSTEM, AzureGateway, 809}
	InstanceId         : 20227
	TimeGenerated      : 3/18/2016 1:29:21 PM
	TimeWritten        : 3/18/2016 1:29:21 PM
	UserName           :
	Site               :
	Container          :
	```

- Is the VPN appliance correctly routing traffic through the Azure VPN Gateway?

	Use a tool such as [PsPing][psping] to verify connectivity and routing across the VPN gateway. For example, to test connectivity from an on-premises machine to a web server located on the VNet, run the following command (replace `<<web-server-address>>` with the address of the web server):

	```
	PsPing -t <<web-server-address>>:80
	```

	If the on-premises machine can route traffic to the web server, you should see output similar to the following:

	```
	D:\PSTools>psping -t 10.20.0.5:80

	PsPing v2.01 - PsPing - ping, latency, bandwidth measurement utility
	Copyright (C) 2012-2014 Mark Russinovich
	Sysinternals - www.sysinternals.com

	TCP connect to 10.20.0.5:80:
	Infinite iterations (warmup 1) connecting test:
	Connecting to 10.20.0.5:80 (warmup): 6.21ms
	Connecting to 10.20.0.5:80: 3.79ms
	Connecting to 10.20.0.5:80: 3.44ms
	Connecting to 10.20.0.5:80: 4.81ms

	  Sent = 3, Received = 3, Lost = 0 (0% loss),
	  Minimum = 3.44ms, Maximum = 4.81ms, Average = 4.01ms
	```

	If the on-premises machine cannot communicate with the specified destination, you will see messages like this:

	```
	D:\PSTools>psping -t 10.20.1.6:80

	PsPing v2.01 - PsPing - ping, latency, bandwidth measurement utility
	Copyright (C) 2012-2014 Mark Russinovich
	Sysinternals - www.sysinternals.com

	TCP connect to 10.20.1.6:80:
	Infinite iterations (warmup 1) connecting test:
	Connecting to 10.20.1.6:80 (warmup): This operation returned because the timeout period expired.
	Connecting to 10.20.1.6:80: This operation returned because the timeout period expired.
	Connecting to 10.20.1.6:80: This operation returned because the timeout period expired.
	Connecting to 10.20.1.6:80: This operation returned because the timeout period expired.
	Connecting to 10.20.1.6:80:
	  Sent = 3, Received = 0, Lost = 3 (100% loss),
	  Minimum = 0.00ms, Maximum = 0.00ms, Average = 0.00ms
	```

- Does the on-premises firewall allow VPN traffic to pass through? Have the correct ports been opened?

- Verify that the on-premises VPN appliance uses an encryption method that is [compatible with the Azure VPN Gateway][vpn-appliance].

    For policy-based routing, the Azure VPN Gateway supports the AES256, AES128, and 3DES encryption algorithms. Route-based gateways support AES256 and 3DES.

### Azure VNet Gateway:

- Examine [Azure VPN Gateway diagnostic logs][gateway-diagnostic-logs] for potential issues.

- Are the Azure VPN Gateway and on-premises VPN appliance configured with the same shared authentication key?

	You can view the shared key stored by the Azure VPN Gateway by using the following Azure CLI command:

	```
	azure network vpn-connection shared-key show <<resource-group>> <<vpn-connection-name>>
	```

	Use the command appropriate for your on-premises VPN appliance to show the shared key configured for that appliance.

- Verify that the _GatewaySubnet_ subnet holding the Azure VPN Gateway is not associated with an NSG.

	You can view the subnet details by using the following Azure CLI command:

    ```
    azure network vnet subnet show -g <<resource-group>> -e <<vnet-name>> -n GatewaySubnet
    ```

	Ensure there is no data field named _Network Security Group id_. The following example shows the results for instance of the _GatewaySubnet_ that has an assigned NSG (_VPN-Gateway-Group_). This can cause prevent the gateway from working correctly if there are any rules defined for this NSG:

        C:\>azure network vnet subnet show -g profx-prod-rg -e profx-vnet -n GatewaySubnet
        info:    Executing command network vnet subnet show
        + Looking up virtual network "profx-vnet"
        + Looking up the subnet "GatewaySubnet"
        data:    Id                              : /subscriptions/########-####-####-####-############/resourceGroups/profx-prod-rg/providers/Microsoft.Network/virtualNetworks/profx-vnet/subnets/GatewaySubnet
        data:    Name                            : GatewaySubnet
        data:    Provisioning state              : Succeeded
        data:    Address prefix                  : 10.20.3.0/27
        data:    Network Security Group id       : /subscriptions/########-####-####-####-############/resourceGroups/profx-prod-rg/providers/Microsoft.Network/networkSecurityGroups/VPN-Gateway-Group
        info:    network vnet subnet show command OK

- Are the virtual machines in the Azure VNet configured to permit traffic coming in from outside the VNet? Check any NSG rules associated with subnets containing these virtual machines.

	You can view all NSG rules by using the following Azure CLI command:

    ```
    azure network nsg show -g <<resource-group>> -n <<nsg-name>>
    ```

- Has the Azure VPN Gateway been disconnected?

	You can use the following Azure PowerShell command to check the current status of the Azure VPN connection. The `<<connection-name>>` parameter is the name of the Azure VPN connection that links the virtual network gateway and the local gateway.

	```
	Get-AzureRmVirtualNetworkGatewayConnection -Name <<connection-name>> - ResourceGroupName <<resource-group>>
	```

	The following snippets highlight the output generated if the gateway is connected (the first example), and disconnected (the second example):

	```
	PS C:\> Get-AzureRmVirtualNetworkGatewayConnection -Name profx-gateway-connection -ResourceGroupName profx-prod-rg

	AuthorizationKey           :
	VirtualNetworkGateway1     : Microsoft.Azure.Commands.Network.Models.PSVirtualNetworkGateway
	VirtualNetworkGateway2     :
	LocalNetworkGateway2       : Microsoft.Azure.Commands.Network.Models.PSLocalNetworkGateway
	Peer                       :
	ConnectionType             : IPsec
	RoutingWeight              : 0
	SharedKey                  : ####################################
	ConnectionStatus           : Connected
	EgressBytesTransferred     : 55254803
	IngressBytesTransferred    : 32227221
	ProvisioningState          : Succeeded
	...
	```

	```
	PS C:\> Get-AzureRmVirtualNetworkGatewayConnection -Name profx-gateway-connection2 -ResourceGroupName profx-prod-rg

	AuthorizationKey           :
	VirtualNetworkGateway1     : Microsoft.Azure.Commands.Network.Models.PSVirtualNetworkGateway
	VirtualNetworkGateway2     :
	LocalNetworkGateway2       : Microsoft.Azure.Commands.Network.Models.PSLocalNetworkGateway
	Peer                       :
	ConnectionType             : IPsec
	RoutingWeight              : 0
	SharedKey                  : ####################################
	ConnectionStatus           : NotConnected
	EgressBytesTransferred     : 0
	IngressBytesTransferred    : 0
	ProvisioningState          : Succeeded
	...
	```

### Host VM configuration, network bandwidth utilization, and application performance:

- Verify that the firewall in the guest operating system running on the Azure VMs in the subnet are configured correctly to allow permitted traffic from the on-premises IP ranges.

- Is the volume of traffic close to the limit of the bandwidth available to the Azure VPN Gateway?

	Tooling depends on the facilities available to your VPN appliance running on-premises. For example, if you are using RRAS on Windows Server 2012, you can use Performance Monitor to track the volume of data being received and transmitted over the VPN connection; using the _RAS Total_ object, select the _Bytes Received/Sec_ and _Bytes Transmitted/Sec_ counters:

	![[3]][3]

	You should compare the results with the bandwidth available to the VPN gateway (100 Mbps for the Basic and Standard SKUs, and 200 Mbps for the High Performance SKU):

	![[4]][4]

- Are any of the virtual machines in the Azure VNet running slowly? Are they overloaded, are there enough of them to handle the load, are all load-balancers configured correctly?

	This requires [capturing and analyzing diagnostic information][azure-vm-diagnostics]. You can examine the results using the Azure portal, but many third-party tools are also available that can provide detailed insights into the performance data.

- Is the application making efficient use of cloud resources?

	Instrument application code running on each VM to determine whether applications are making the best use of resources. You can use tools such as [Application Insights][application-insights] to help perform these tasks.

## Solution components

<!-- The following text is boilerplate, and should be used in all RA docs -->

A sample solution script, [Deploy-ReferenceArchitecture.ps1][solution-script], is available that you can use to implement the architecture that follows the recommendations described in this article. This script utilizes [Azure Resource Manager][arm-templates] templates. The templates are available as a set of fundamental building blocks, each of which performs a specific action such as creating a VNet or configuring an NSG. The purpose of the script is to orchestrate template deployment.

The templates are parameterized, with the parameters held in separate JSON files. You can modify the parameters in these files to configure the deployment to meet your own requirements. You do not need to amend the templates themselves. Note that you must not change the schemas of the objects in the parameter files.

When you edit the templates, create objects that follow the naming conventions described in [Recommended Naming Conventions for Azure Resources][naming conventions].

<!-- End of boilerplate -->

The script references the parameters in the **[vpn-gateway-vpn-connection-settings.parameters.json][gateway-parameters]** file to create an Azure VPN gateway, VNet structure, and connection to the on-premises network:

```json
"parameters": {
  "virtualNetworkSettings": {
    "value": {
      "name": "hybrid-vnet",
      "addressPrefixes": [
        "10.20.0.0/16"
      ],
      "subnets": [
        {
          "name": "GatewaySubnet",
          "addressPrefix": "10.20.255.224/27"
        },
        {
          "name": "hybrid-internal-subnet",
          "addressPrefix": "10.20.1.0/24"
        }
      ],
      "dnsServers": [ ]
    }
  },
  "virtualNetworkGatewaySettings": {
    "value": {
      "name": "hybrid-vgw",
      "gatewayType": "Vpn",
      "vpnType": "RouteBased",
      "sku": "Standard"
    }
  },
  "connectionSettings": {
    "value": {
      "name": "hybrid-vpn",
      "connectionType": "IPsec",
      "sharedKey": "123secret",
      "virtualNetworkGateway1": {
        "name": "hybrid-vgw"
      },
      "localNetworkGateway": {
        "name": "hybrid-lgw",
        "ipAddress": "40.50.60.70",
        "addressPrefixes": [ "10.10.0.0/16" ]
      }
    }
  }
}
```

- The `virtualNetworkSettings` section defines the structure of the VNet to create. You can specify the name of the VNet (*hybrid-vnet* shown in the example above) and the address space (*10.20.0.0/16*).

	The `subnets` array indicates the subnets to add to the VNet. You must always create at least one subnet named *GatewaySubnet* with an address space of at least /27. You can create additional subnets as required by your application. Do not create any application objects in the GatewaySubnet.

	You can also use the `dnsServers` array to specify the addresses of DNS servers required by your application.

- The `virtualNetworkGatewaySettings` section contains the information used to create the Azure VPN gateway. 

	For this architecture, do not change the `gatewayType` parameter. The `vpnType` parameter can be *RouteBased* or *PolicyBased*. You can set the `sku` parameter to *Standard* or *HighPerformance*. 

- The `connectionSettings` section defines the configuration for the local network gateway and the connection to the on-premises network.

	The `connectionType` and `sharedKey` settings specify the connection protocol and key to use to connect to the on-premises network (you should have already configured the on-premises VPN appliance).

	The `localNetworkGateway` object specifies the public IP address of the on-premises VPN appliance (*40.50.60.70* in this example), and an array of internal address spaces for the on-premises side of the network.

## Deployment

The solution assumes the following prerequisites:

- You have an existing on-premises infrastructure already configured with a VPN appliance.

- You have an existing Azure subscription in which you can create resource groups.

- You have downloaded and installed the most recent build of Azure Powershell. See [here][azure-powershell-download] for instructions.

To run the script that deploys the solution:

1. Move to a convenient folder on your local computer and create the following two subfolders:

	- Scripts

	- Templates

2. Download the [Deploy-ReferenceArchitecture.ps1][solution-script] file to the Scripts folder

3. Download the [vpn-gateway-vpn-connection-settings.parameters.json][gateway-parameters] file to Templates folder:

4. Edit the Deploy-ReferenceArchitecture.ps1 file in the Scripts folder, and change the following line to specify the resource group that should be created or used to hold the resources created by the script:

	```powershell
	$resourceGroupName = "hybrid-dev-rg"
	```
5. Edit the vpn-gateway-vpn-connection-settings.parameters.json file in the Templates folder to set the parameters for the VNet, virtual network gateway, and connection, as described in the Solution Components section above.

6. Open an Azure PowerShell window, move to the Scripts folder, and run the following command:

	```powershell
	.\Deploy-ReferenceArchitecture.ps1 <subscription id> <location>
	```

	Replace `<subscription id>` with your Azure subscription ID.

	For `<location>`, specify an Azure region, such as `eastus` or `westus`.

7. When the script has completed, use the Azure portal to verify that the network and gateway have been created successfully.

8. From an on-premises machine, verify that you can connect to the VNet through the gateway.

## Next steps

- [Installing additional domain controllers for an on-premises Active Directory domain using VMs in an Azure VNet][installing-ad].

- [Guidelines for deploying Windows Server Active Directory on Azure VMs][deploying-ad].

- [Creating a DNS server in a VNet][creating-dns].

- [Configuring and managing DNS in a VNet][configuring-dns].

- [Using on-premises Stormshield network security appliances across a VPN][stormshield].

- [Implementing a Hybrid Network Architecture with Azure ExpressRoute][expressroute].

<!-- links -->

[implementing-a-multi-tier-architecture-on-Azure]: ./guidance-compute-3-tier-vm.md
[resource-manager-overview]: ../resource-group-overview.md
[arm-templates]: ../resource-group-authoring-templates.md
[azure-cli]: ../virtual-machines-command-line-tools.md
[azure-portal]: ../azure-portal/resource-group-portal.md
[azure-powershell]: ../powershell-azure-resource-manager.md
[azure-virtual-network]: ../virtual-network/virtual-networks-overview.md
[vpn-appliance]: ../vpn-gateway/vpn-gateway-about-vpn-devices.md
[azure-vpn-gateway]: https://azure.microsoft.com/services/vpn-gateway/
[azure-gateway-charges]: https://azure.microsoft.com/pricing/details/vpn-gateway/
[azure-network-security-group]: https://azure.microsoft.com/documentation/articles/virtual-networks-nsg/
[connect-to-an-Azure-vnet]: https://technet.microsoft.com/library/dn786406.aspx
[vpn-gateway-multi-site]: ../vpn-gateway/vpn-gateway-multi-site.md
[policy-based-routing]: https://en.wikipedia.org/wiki/Policy-based_routing
[route-based-routing]: https://en.wikipedia.org/wiki/Static_routing
[network-security-group]: ../virtual-network/virtual-networks-nsg.md
[sla-for-vpn-gateway]: https://azure.microsoft.com/support/legal/sla/vpn-gateway/v1_0/
[additional-firewall-rules]: https://technet.microsoft.com/library/dn786406.aspx#firewall
[nagios]: https://www.nagios.org/
[azure-vpn-gateway-diagnostics]: http://blogs.technet.com/b/keithmayer/archive/2014/12/18/diagnose-azure-virtual-network-vpn-connectivity-issues-with-powershell.aspx
[ping]: https://technet.microsoft.com/library/ff961503.aspx
[tracert]: https://technet.microsoft.com/library/ff961507.aspx
[psping]: http://technet.microsoft.com/sysinternals/jj729731.aspx
[nmap]: http://nmap.org
[changing-SKUs]: https://azure.microsoft.com/blog/azure-virtual-network-gateway-improvements/
[gateway-diagnostic-logs]: http://blogs.technet.com/b/keithmayer/archive/2015/12/07/step-by-step-capturing-azure-resource-manager-arm-vnet-gateway-diagnostic-logs.aspx
[troubleshooting-vpn-errors]: https://blogs.technet.microsoft.com/rrasblog/2009/08/12/troubleshooting-common-vpn-related-errors/
[rras-logging]: https://www.petri.com/enable-diagnostic-logging-in-windows-server-2012-r2-routing-and-remote-access
[create-on-prem-network]: https://technet.microsoft.com/library/dn786406.aspx#routing
[create-azure-vnet]: ../virtual-network/virtual-networks-create-vnet-classic-cli.md
[azure-vm-diagnostics]: https://azure.microsoft.com/blog/windows-azure-virtual-machine-monitoring-with-wad-extension/
[application-insights]: ../application-insights/app-insights-overview-usage.md
[forced-tunnelling]: https://azure.microsoft.com/documentation/articles/vpn-gateway-about-forced-tunneling/
[getting-started-with-azure-security]: ./../azure-security-getting-started.md
[vpn-appliances]: ../vpn-gateway/vpn-gateway-about-vpn-devices.md
[installing-ad]: ../active-directory/active-directory-install-replica-active-directory-domain-controller.md
[deploying-ad]: https://msdn.microsoft.com/library/azure/jj156090.aspx
[creating-dns]: https://blogs.msdn.microsoft.com/mcsuksoldev/2014/03/04/creating-a-dns-server-in-azure-iaas/
[configuring-dns]: ../virtual-network/virtual-networks-manage-dns-in-vnet.md
[stormshield]: https://azure.microsoft.com/marketplace/partners/stormshield/stormshield-network-security-for-cloud/
[vpn-appliance-ipsec]: ../vpn-gateway/vpn-gateway-about-vpn-devices.md#ipsec-parameters
[expressroute]: ./guidance-hybrid-network-expressroute.md
[naming conventions]: ./guidance-naming-conventions.md

[solution-script]: https://raw.githubusercontent.com/mspnp/arm-building-blocks/master/guidance-hybrid-network-vpn/Scripts/Deploy-ReferenceArchitecture.ps1
[gateway-parameters]: https://raw.githubusercontent.com/mspnp/arm-building-blocks/master/guidance-hybrid-network-vpn/Templates/vpn-gateway-vpn-connection-settings.parameters.json 

[azure-powershell-download]: https://azure.microsoft.com/documentation/articles/powershell-install-configure/

[0]: ./media/guidance-hybrid-network-vpn/arch-diagram.png "Structure of a hybrid network spanning the on-premises and cloud infrastructures"
[1]: ./media/guidance-hybrid-network-vpn/partitioned-vpn.png "Partitioning a VNet to improve scalability"
[2]: ./media/guidance-hybrid-network-vpn/audit-logs.png "Audit logs in the Azure portal"
[3]: ./media/guidance-hybrid-network-vpn/RRAS-perf-counters.png "Performance counters for monitoring VPN network traffic"
[4]: ./media/guidance-hybrid-network-vpn/RRAS-perf-graph.png "Example VPN network performance graph"