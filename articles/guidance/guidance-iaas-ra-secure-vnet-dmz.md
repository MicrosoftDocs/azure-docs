<properties
   pageTitle="Azure Architecture Reference - IaaS: Implementing a DMZ between Azure and the Internet | Microsoft Azure"
   description="How to implement a secure hybrid network architecture with Internet access in Azure."
   services="guidance,vpn-gateway,expressroute,load-balancer,virtual-network"
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
   ms.date="06/29/2016"
   ms.author="telmos"/>

# Implementing a DMZ between Azure and the Internet

[AZURE.INCLUDE [pnp-RA-branding](../../includes/guidance-pnp-header-include.md)]

This article describes best practices for implementing a secure hybrid network that extends your on-premises network to Azure, but that also accepts traffic from the Internet. This architecture extends that described in the article [Implementing a DMZ between Azure and your on-premises datacenter][implementing-a-secure-hybrid-network-architecture].

> [AZURE.NOTE] Azure has two different deployment models: [Resource Manager][resource-manager-overview] and classic. This reference architecture uses Resource Manager, which Microsoft recommends for new deployments. 

Typical use cases for this architecture include:

- Hybrid applications where workloads run partly on-premises and partly in Azure.

- Infrastructure that requires a more granular control over traffic entering an Azure VNet from a public network such as the Internet.

An [Azure Resource Manager template][azuredeploy] is available that you can use as a starting point to implement the architecture described in this document.

## Architecture diagram

The following diagram highlights the important components in this architecture (*click to zoom in*). This document focusses on the structures required for securing the network for controlled access from the Internet. For more information about the greyed-out elements, read [Implementing a DMZ between Azure and your on-premises datacenter][implementing-a-secure-hybrid-network-architecture]:

[![0]][0]

- **Public IP address (PIP).**. This is the IP address of the public endpoint. External users connected to the Internet can access the system through this address.

- **Azure load balancer.** All incoming requests pass through this load balancer which then distributes them to VMs running in the VNet.

- **Network virtual appliance (NVA).** An NVA is a generic term for a virtual appliance that might perform tasks such as acting as a firewall, WAN optimization (including network compression), custom routing, or a variety of other operations.

- **Public DMZ inbound subnet.** This subnet faces the Azure load balancer. Incoming requests received through this subnet pass to one of the NVAs.

- **Public DMZ outbound subnet.** This subnet is on the application side of the NVAs. Requests that are approved by the NVA pass through this subnet to the internal load balancer for the web tier.

Taken together, the public DMZ inbound subnet, NVAs, and public DMZ outbound subnet constitute a security perimeter for handling all requests arriving from the Internet.

## Recommendations

This section summarizes recommendations for providing public access to the application running in Azure, covering:

- Using a separate set of NVAs to handle traffic received from the Internet.

- Configuration of the public load balancer.

- Routing Internet traffic to the web tier through the NVAs in the public DMZ.

For information and recommendations about the gateway, elements in the private DMZ, the management and monitoring subnet, and the application subnets, see [Implementing a DMZ between Azure and your on-premises datacenter][implementing-a-secure-hybrid-network-architecture].

### NVA separation recommendations ###

Internet traffic may need to be handled differently than requests received from the on-premises network. Rather than try and route all on-premises and public traffic through the same set of NVAs, it is preferable to implement separate sets of NVAs, effectively creating different security perimeters. This approach reduces the complexity of the security checking, making configuration less error-prone, because each set of NVAs can be focussed on specific types of traffic (intranet or Internet). Additionally, the routing performed by the NVAs in the public security perimeter is significantly different from that provided by the NVAs in the private security perimeter.

### Public load balancer recommendations ###

To maintain scalability and availability, create the NVAs in an [availability set][availability-set] and use a public load balancer to handle traffic received through the PIP.

Do not open ports in the load balancer unnecessarily. For example, consider restricting inbound traffic for the web tier to port 80 (for HTTP requests), and optionally port 443 (for HTTPS requests).

### Public DMZ routing recommendations ###

The web tier comprises VMs fronted by a internal load balancer. You should not expose any of these items directly to the Internet; all traffic should pass through the NVAs in the security perimeter. Configure the NVAs to route validated incoming requests to the internal load balancer for the web tier. This routing should be transparent to the users making the requests. For example, if the NVAs are Linux VMs, you can use the [iptables][iptables] command to filter incoming traffic and implement NAT routing to direct it through the public outbound DMZ subnet to the internal load balancer for the web tier.

## Solution components

The solution provided for this architecture uses the same Resource Manager templates as those for the article [Implementing a DMZ between Azure and your on-premises datacenter][implementing-a-secure-hybrid-network-architecture], with the following additions:

- [azuredeploy.json][azuredeploy]. This is an extended version of the template used by the architecture described in [Implementing a DMZ between Azure and your on-premises datacenter][implementing-a-secure-hybrid-network-architecture]. This template creates the additional subnets for the public security perimeter (inbound and outbound).

- [ibb-dmz.json][ibb-dmz]. This template creates the public IP address, load balancer, and NVAs for the public security perimeter. Note that the public IP address is statically allocated, as are the IP addresses for the NVAs. 

> [AZURE.NOTE] Best practice is to use static IP addresses for NVAs; using dynamic addresses can cause them to change if the VM is deprovisioned and restarted. 

The solution also includes a bash script named [azuredeploy.sh][azuredeploy-script] that deploys the templates.

The following sections provide more details on the key resources created for this architecture by the templates.

### Load balancing the NVAs in the public security perimeter ###

The [ibb-dmz.json][ibb-dmz] template creates the NVAs for the security perimeter in an availability set. An Azure load balancer with a public IP address distributes requests to ports 80 and 443 across the availability set. The JSON snippet below shows how the template creates the load balancer. In this snippet, the `publicIPAddressID` parameter contains the public IP address of the load balancer, and the variable `ilbBEName` refers to the availability set containing the NVA VMs. The `lbFEId` and `lbBEId` variables referenced by the load balancing rules hold the internal IDs of these items.

```
"type": "Microsoft.Network/loadBalancers",
...
"properties": {
  "frontendIPConfigurations": [
    {
      "name": "feIpConfig1",
      "properties": {
        "publicIPAddress": {
          "id": "[variables('publicIPAddressID')]"
        }
      }
    }
  ],
  "backendAddressPools": [ { "name": "[variables('lbBEName')]" } ],
  "loadBalancingRules": [
    {
      "name": "http",
      "properties": {
        "frontendIPConfiguration": { "id": "[variables('lbFEId')]" },
        "backendAddressPool": { "id": "[variables('lbBEId')]" },
        "frontendPort": 80,
        "backendPort": 80,
        "protocol": "Tcp"
      }
    },
    {
      "name": "https",
      "properties": {
        "frontendIPConfiguration": { "id": "[variables('lbFEId')]" },
        "backendAddressPool": { "id": "[variables('lbBEId')]" },
        "frontendPort": 443,
        "backendPort": 443,
        "protocol": "Tcp"
      }
    }
  ]
}
```

The next snippet shows how the template creates the public IP address for the load balancer. The name of the IP address is passed in to the template as a parameter, and the type is set to Static:

```
"parameters": {

  "publicIPAddressName": {
    "type": "string",
    "defaultValue": "myPublicIP",
    "metadata": {
      "description": "Public IP Name"
    }
  }
},
"variables": {
  ...
  "publicIPAddressType": "Static",
  ...
},
"resources": [
  {
    "type": "Microsoft.Network/publicIPAddresses",
    ...
    "name": "[parameters('publicIPAddressName')]",
    ...
    "properties": {
      "publicIPAllocationMethod": "[variables('publicIPAddressType')]",
    }
  },
  ...
}
```

### Configuring routing in the NVAs for the public security perimeter ###

The NVAs in the public security perimeter are Linux (Ubuntu) VMs. The template runs the following bash script when it has created each VM:

``` bash
#!/bin/bash
#!/bin/bash
bash -c "echo net.ipv4.ip_forward=1 >> /etc/sysctl.conf"
sysctl -p /etc/sysctl.conf

PRIVATE_IP_ADDRESS=$(/sbin/ifconfig eth0 | grep 'inet addr:' | cut -d: -f2 | awk '{ print $1}')
PUBLIC_IP_ADDRESS=$(wget http://ipinfo.io/ip -qO -)
iptables -F
iptables -t nat -F
iptables -X
iptables -t nat -A PREROUTING -p tcp --dport 80 -j DNAT --to-destination 10.0.1.254:80
iptables -t nat -A POSTROUTING -p tcp -d 10.0.1.254 --dport 80 -j SNAT --to-source $PRIVATE_IP_ADDRESS
iptables -t nat -A POSTROUTING -p tcp -d 10.0.1.254 --dport 80 -j SNAT --to-source $PUBLIC_IP_ADDRESS
iptables -t nat -A PREROUTING -p tcp --dport 443 -j DNAT --to-destination 10.0.1.254:443
iptables -t nat -A POSTROUTING -p tcp -d 10.0.1.254 --dport 443 -j SNAT --to-source $PRIVATE_IP_ADDRESS
iptables -t nat -A POSTROUTING -p tcp -d 10.0.1.254 --dport 443 -j SNAT --to-source $PUBLIC_IP_ADDRESS
service ufw stop
service ufw start

DEBIAN_FRONTEND=noninteractive aptitude install -y -q iptables-persistent
/etc/init.d/iptables-persistent save
update-rc.d iptables-persistent defaults
```

The first two lines configure IP forwarding for the NICs. Traffic received in the NIC associated with the public DMZ inbound subnet will be passed to the NIC attached to the public DMZ outbound subnet. The next block configures NAT routing to direct incoming traffic on ports 80 and 443 to the internal load balancer for the web tier at address 10.0.1.254. The final three lines save these changes using the iptables-persistent service and ensure that the configuration is restored whenever the machine restarts.

> [AZURE.NOTE] The IP addresses for the NVAs are allocated statically. This is important, as it means that the IP routing tables saved by using the iptables-persistent package will still be valid even if the VMs are de-provisioned and restarted.

## Deploying the sample solution

The solution assumes the following prerequisites:

- You have an existing on-premises infrastructure, including a VPN server that can support IPSec connections.

- You have installed the latest version of the Azure CLI. [Follow these instructions for details][cli-install].

- If you're deploying the solution from Windows, you must install a tool that provides a bash shell, such as [GitHub Desktop][github-desktop].

To run the script that deploys the solution:

1. Download the [azuredeploy.sh][azuredeploy-script] script to your local computer.

2. Open the azuredeploy.sh script using an editor of your choice, and locate the *## Command Arguments* section:

	``` bash
	############################################################################ 
	## Command Arguments 
	############################################################################ 
	
	URI_BASE=https://raw.githubusercontent.com/mspnp/blueprints/master/ARMBuildingBlocks 
		
	# Default parameter values 
	BASE_NAME= 
	SUBSCRIPTION= 
	LOCATION=westus 
	OS_TYPE=Windows 
	ADMIN_USER_NAME=adminUser 
	ADMIN_PASSWORD=adminP@ssw0rd 

	NTWK_RESOURCE_GROUP=${BASE_NAME}-ntwk-rg

	# VPN parameter defaults
	INPUT_ON_PREMISES_PUBLIC_IP=
	INPUT_ON_PREMISES_ADDRESS_SPACE=
	INPUT_VPN_IPSEC_SHARED_KEY=
	...
	``` 

3. 	Set the BASE_NAME variable to the name of the 3-tier application infrastructure to be created. The script creates separate subnets for the Web tier, business tier, and data tier. Each tier consists of two VMs accessed through a load balancer.

4.	Set the SUBSCRIPTION variable to the subscription ID of the Azure account to use. By default, the script creates 11 VMs that consume 44 CPU cores although you can customize the installation to use smaller VMs. Make sure that you have sufficient quota available before continuing.

5.	Set the INPUT-ON-PREMISES_PUBLIC_IP variable to the public IP address of the VPN device located in the on-premises network.

6.	Set the INPUT_ON_PREMISES_ADDRESS_SPACE variable to the internal address space of the on-premises network. Use CIDR format; for example *192.168.0.0/16*.

7.	Set the INPUT_VPN_IPSEC_SHARED_KEY variable to the shared secret key to be used to connect from the VPN device to the Azure VPN gateway.

8.	Save the script and close the editor.

9. Open a bash shell and move to the folder containing the azuredeploy.sh script.

10. Log in to your Azure account. In the bash shell enter the following command:

	```cli
    azure login
	```

	Follow the instructions to connect to Azure.

11. Run the following command to set your current subscription to the value specified in step 4 above. Replace *nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn* with the subscription ID:

	```cli
	azure account set nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn
	```

12. Run the command `./azuredeploy.sh`.

13. Verify that the script completes successfully. You can simply re-run the script if an error occurs.

14. Browse to the Azure portal and verify that the following resource groups have been created:

	- ***myapp*-netwk-rg.** This resource group contains the network elements of the solution: the VNet that holds the subnets for the NVA, the application tiers, and the management subnet; the NSG definitions; the UDRs for forced tunneling for each application tier; the local gateway; the VPN gateway; the gateway public IP address; and the gateway connection. 

		The following image shows the subnets created in the VNet, highlighting the subnets for the public security perimeter (*click to zoom in*):

		[![1]][1]

	- ***myapp*-web-tier-rg.** This resource group contains the VMs for the Web tier grouped into an availability set (the script creates two VMs for each tier by default), storage for each VM, the network interfaces, and the load balancer for this tier.

	- ***myapp*-biz-tier-rg.**. This resource group holds the VMs and resources for the business tier. The structure is the same as that of the web tier.

	- ***myapp*-db-tier-rg.** This resource group holds the VMs and resources for the data access tier. The structure is the same as that of the web and business tiers.

	- ***myapp*-mgmt-rg.** This resource group contains the resources used by the NVA and the management subnets. The script creates two VMs (with storage) and a load balancer for the NVA, and a separate VM (with storage) for the jump box. Each NVA VM has three network interfaces (NICs). The NICs for each NVA VM are configured to permit IP forwarding. No additional software is installed on any of these VMs. This resource group also contains the UDR for the gateway subnet.

		> [AZURE.NOTE] The article [Implementing a secure hybrid network architecture in Azure][implementing-a-secure-hybrid-network-architecture] describes the contents of these resource groups in more detail.

	- ***myapp*-dmz-rg.** This resource group contains the resources used to implement the public security perimeter. The script creates a public IP address, Azure load balancer, the public DMZ inbound and public DMZ outbound subnets, the NICs, and the NVAs in an availability set (*click to expand*):

		[![2]][2]

15. In the ***myapp*-dmz-rg** resource group, click the ***myapp*-dmz-pip** public IP address and make a note of the IP address. Open Internet Explorer, and navigate to this address. You should see the default page for the web server software deployed on the web tier (IIS for Windows, and Apache for Ubuntu). This indicates that the routing in the NVAs has been configured correctly:

	[![3]][3]

16. Configure the VPN appliance on the on-premises network to connect to the Azure VPN gateway. For more information, see the article [Implementing a Hybrid Network Architecture with Azure and On-premises VPN][guidance-vpn-gateway].

### Customizing the solution

You can modify the following variables in the [azuredeploy.sh][azuredeploy-script]. The script passes these variables as parameters to the [ibb-dmz.json][ibb-dmz] template:

- **ADMIN_USER_NAME** and **ADMIN_PASSWORD**. The login credentials to use for the NVAs.

- **VM_SIZE**. The size of the VMs for the NVAs. The default is Standard_DS3.

> [AZURE.NOTE] For information about customizing other aspects of the architecture, see [Implementing a secure hybrid network architecture in Azure][implementing-a-secure-hybrid-network-architecture].

## Availability considerations

The load balancer requires each NVA to provide a health endpoint. An NVA that fails to respond on this endpoint is considered to be unavailable, and the load balancer will direct requests to other NVAs in the same availability set. If all NVAs fail to respond, the system becomes unavailable. Therefore, the more NVAs you deploy, the greater the availability of the system. For more information, see [Load Balancer probes][lb-probe].

You can implement simple health checking by installing a service such as Apache on each NVA; the default Apache configuration will respond to requests received on port 80. If necessary, you can implement a custom service that performs more comprehensive checking of the state of the NVA to establish that it is functioning correctly.

## Security considerations

This architecture provides three points of defence:

- The load balancer. Incoming traffic from the Internet can only pass through ports specified by the load balancer rules. Only open ports required by the application.

- The NSG rules with the public DMZ inbound and outbound networks. These rules enable you to add a further level of protection and help prevent the NVAs from being compromised. For example, you can restrict all incoming traffic to that received from the load balancer or management subnet.

- The NVAs for the public security perimeter. The NAT routing configuration passes all traffic directed towards port 80 and port 443 through to the web tier load balancer. All other requests are blocked. Note that in the sample solution, traffic is not audited. You can modify the way in which the NVAs handle requests, and add request logging, by using the [iptables][iptables] command.

## Scalability considerations

Do not connect the PIP directly to an NVA, even if the NVA availability set only contains a single device and there is no immediate need for a load balancer. This approach makes it easier add NVAs in the future without reconfiguring the system. It can also provide increased protection.

## Monitoring considerations

The NVAs in the public security perimeter should not be directly accessible to the Internet. Use the resources in the management subnet to connect to the NVAs and perform monitoring. The example in the [Architecture diagram][architecture] section depicts a jump box which provides access to DevOps staff, and a separate monitoring server. Depending on the size of the network and the monitoring workload, the jump box and monitoring server could be combined into a single machine, or monitoring functions could be spread across several VMs.

If the NVAs are protected by using NSG rules, it may also be necessary to open port 22 (for SSH access), or any other ports used by management and monitoring tools to enable requests from the data management subnet.

<!-- links -->

[resource-manager-overview]: ../resource-group-overview.md
[guidance-vpn-gateway]: ./guidance-hybrid-network-vpn.md
[script]: #sample-solution-script
[implementing-a-multi-tier-architecture-on-Azure]: ./guidance-compute-3-tier-vm.md
[architecture]: #architecture_diagram
[security]: #security
[recommendations]: #recommendations
[vpn-failover]: ./guidance-hybrid-network-expressroute-vpn-failover.md
[cli-install]: ../xplat-cli-install.md
[github-desktop]: https://desktop.github.com/
[ra-vpn]: ./guidance-hybrid-network-vpn.md
[ra-expressroute]: ./guidance-hybrid-network-expressroute.md
[implementing-a-secure-hybrid-network-architecture]: ./guidance-iaas-ra-secure-vnet-hybrid.md
[lb-probe]: ../load-balancer/load-balancer-custom-probe-overview.md
[network-security-group]: ../virtual-network/virtual-networks-nsg.md
[availability-set]: ../virtual-machines/virtual-machines-windows-manage-availability.md
[iptables]: https://help.ubuntu.com/community/IptablesHowTo
[azuredeploy-script]: https://github.com/mspnp/blueprints/blob/master/ARMBuildingBlocks/guidance-iaas-ra-pub-dmz/azuredeploy.sh
[azuredeploy]: https://github.com/mspnp/blueprints/blob/master/ARMBuildingBlocks/guidance-iaas-ra-pub-dmz/Templates/ra-secure-vnet-pub-dmz/azuredeploy.json
[ibb-dmz]: https://github.com/mspnp/blueprints/blob/master/ARMBuildingBlocks/ARMBuildingBlocks/Templates/ibb-dmz.json
[0]: ./media/guidance-iaas-ra-secure-vnet-dmz/figure1.png "Secure hybrid network architecture"
[1]: ./media/guidance-iaas-ra-secure-vnet-dmz/figure2.png "Subnets in the VNet"
[2]: ./media/guidance-iaas-ra-secure-vnet-dmz/figure3.png "Public DMZ resource group"
[3]: ./media/guidance-iaas-ra-secure-vnet-dmz/figure4.png "Default IIS page in Internet Explorer"