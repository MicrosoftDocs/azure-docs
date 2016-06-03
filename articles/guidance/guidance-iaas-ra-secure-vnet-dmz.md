<properties
   pageTitle="Azure Architecture Reference - IaaS: Implementing a secure hybrid network architecture with Internet access in Azure | Microsoft Azure"
   description="How to implement a secure hybrid network architecture with Internet access in Azure."
   services="guidance,vpn-gateway,expressroute,load-balancer,virtual-network"
   documentationCenter="na"
   authors="JohnPWSharp"
   manager="telmosampaio"
   editor=""
   tags="azure-resource-manager"/>

<tags
   ms.service="guidance"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="06/03/2016"
   ms.author="v-josha"/>

# Implementing a secure hybrid network architecture with Internet access in Azure

[AZURE.INCLUDE [pnp-RA-branding](../../includes/guidance-pnp-header-include.md)]

This article describes best practices for implementing a secure hybrid network that extends your on-premises network to Azure, but that also needs to provide access to requests arriving from the public Internet. This architecture extends that described in the article [Implementing a secure hybrid network architecture in Azure][implementing-a-secure-hybrid-network-architecture].

> [AZURE.NOTE] Azure has two different deployment models: [Resource Manager][resource-manager-overview] and classic. This reference architecture uses Resource Manager, which Microsoft recommends for new deployments.

Typical use cases for this architecture include:

- Hybrid applications where workloads run partly on-premises and partly in Azure.

- Infrastructure that requires a more granular control over traffic entering an Azure VNet from a public network such as the Internet.

## Architecture diagram

The following diagram highlights the important components in this architecture (*click to zoom in*):

[![0]][0]

- **On-premises network.** This is a network of computers and devices, connected through a private local-area network running within an organization.

- **Azure virtual network (VNet).** The VNet hosts the application and other resources running in the cloud.

- **Network Security Groups (NSGs).** Each subnet uses [NSG rules][network-security-group] to protect the resources located in that subnet.

- **Gateway.** The gateway provides the connectivity between routers in the on-premises network and the VNet.

- **Network virtual appliance (NVA).** An NVA is a generic term for a virtual appliance that might perform tasks such as acting as a firewall, WAN optimization (including network compression), custom routing, or a variety of other operations. The NVAs are arranged in two sets constituting a private DMZ and a public DMZ:

	-  The NVAs in the private DMZ handle requests from the on-premises network through the **private DMZ inbound network**.

	-  The NVAs in the public DMZ process requests received from the public Internet through the **public DMZ inbound network**. These requests enter the system through an Azure load balancer exposed by a **public IP address (PIP)**.

	The NVAs can validate these requests and, if they're acceptable, the NVAs can forward them to the web tier through the **NVA DMZ outbound subnets** (private or public, depending on the source of the requests).

- **Web tier, business tier, and data tier subnets.** These are subnets hosting the VMs and services that implement an example 3-tier application running in the cloud. See [Implementing a multi-tier architecture on Azure][implementing-a-multi-tier-architecture-on-Azure] for more details about this structure.

- **Management subnet.** This subnet contains VMs that implement management and monitoring capabilities for the components running in the VNet. The optional monitoring VM captures log and performance data from the virtual hardware in the cloud. The jump box enables authorized DevOps staff to log in, configure, and manage the network. Note that the jump box and monitoring functions can be combined into a single VM, depending on the monitoring workload.

## Recommendations

This section summarizes recommendations for providing public access to the application running in the cloud, covering:

- Configuration of the public load balancer,

- Routing Internet traffic to the web tier through the NVAs in the public DMZ.

For information and recommendations about the gateway, elements in the private DMZ, the management and monitoring subnet, and the application subnets, refer to the article [Implementing a multi-tier architecture on Azure][implementing-a-multi-tier-architecture-on-Azure].

### Public load balancer recommendations ###

All requests from the Internet enter through a public IP address (PIP). To maintain scalability and availability, create the NVAs in an [availability set][availability-set] and use a public load balancer to handle traffic received through the PIP. Do not connect the PIP directly to an NVA, even if the NVA availability set only contains a single device. This approach enables you to more easily add NVAs in the future without the need to reconfigure the system.

Use the load balancer as a first layer of defence; do not open ports unnecessarily. For example, consider restricting inbound traffic for the web tier to port 80 (for HTTP requests), and optionally port 443 (for HTTPS requests).

### Public DMZ routing recommendations ###

The web tier comprises VMs fronted by a internal load balancer. You should not expose any of these items directly to the Internet; all traffic should pass through the NVAs in the public DMZ. Configure the NVAs to route validated incoming requests to the internal load balancer for the web tier. This routing should be transparent to the users making the requests. For example, if the NVAs are Linux VMs, you can use the [iptables][iptables] command to filter incoming traffic and and implement NAT routing to direct it through the outbound DMZ network to the internal load balancer.

## Solution components

The solution provided for this architecture utilizes the same ARM templates as those for the article [Implementing a secure hybrid network architecture in Azure][implementing-a-secure-hybrid-network-architecture], with the following additions:

- [azuredeploy.json][azuredeploy]. This is an extended version of the template that creates . It creates an additional subnets for the public DMZ (inbound and outbound).

- [ibb-dmz.json][ibb-dmz]. This template creates the public IP address, load balancer, and NVAs for the public DMZ. Note that the public IP address is statically allocated.

The solution also includes a bash script named [azuredeploy.sh][azuredeploy-script] that invokes invokes the templates to construct the system.

The following sections provide more details on the key resources created for this architecture by the templates.

### Load balancing the NVAs in the public DMZ ###

The [ibb-dmz.json][ibb-dmz] template creates the NVAs for the public DMZ in an availability set. An Azure load balancer with a public IP address distributes requests to ports 80 and 443 across the availability set. The JSON snippet below shows how the template creates the load balancer. In this snippet, the publicIPAddressID parameter contains the public IP address of the load balancer, and the variable ilbBEName refers to the availability set containing the NVA VMs. The lbFEId and lbBEId variables referenced by the load balancing rules hold the internal IDs of these items.

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

### Configuring routing in the NVAs for the public DMZ ###

The NVAs in the public DMZ are Linux (Ubuntu) VMs. The template runs the following bash script when it has created each VM:

``` bash
#!/bin/bash
sudo bash -c "echo net.ipv4.ip_forward=1 >> /etc/sysctl.conf"
sudo sysctl -p /etc/sysctl.conf

PRIVATE_IP_ADDRESS=$(/sbin/ifconfig eth0 | grep 'inet addr:' | cut -d: -f2 | awk '{ print $1}')
PUBLIC_IP_ADDRESS=$(wget http://ipinfo.io/ip -qO -)

sudo iptables -F
sudo iptables -t nat -F
sudo iptables -X
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j DNAT --to-destination 10.0.3.254:80
sudo iptables -t nat -A POSTROUTING -p tcp -d 10.0.3.254 --dport 80 -j SNAT --to-source $PRIVATE_IP_ADDRESS
sudo iptables -t nat -A POSTROUTING -p tcp -d 10.0.3.254 --dport 80 -j SNAT --to-source $PUBLIC_IP_ADDRESS

sudo iptables -t nat -A PREROUTING -p tcp --dport 443 -j DNAT --to-destination 10.0.3.254:443
sudo iptables -t nat -A POSTROUTING -p tcp -d 10.0.3.254 --dport 443 -j SNAT --to-source $PRIVATE_IP_ADDRESS
sudo iptables -t nat -A POSTROUTING -p tcp -d 10.0.3.254 --dport 443 -j SNAT --to-source $PUBLIC_IP_ADDRESS

sudo service ufw stop
sudo service ufw start
```

The first two lines configure IP forwarding for the NICs; traffic received in the NIC associated with the public DMZ inbound subnet will be passed to the NIC attached to the public DMZ outbound subnet. The remaining lines configure NAT routing to direct incoming traffic on ports 80 and 443 to the internal load balancer for the web tier at address 10.0.3.254.

## Deploying the sample solution

The solution assumes the following prerequisites:

- You have an existing on-premises infrastructure, including a VPN server that can support IPSec connections.

- You have installed the latest version of the Azure CLI. [Follow these instructions for details][cli-install].

- If you're deploying the solution from Windows, you must install a tool that provides a bash shell, such as [git for Windows][git-for-windows].

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
	...
	``` 

3. 	Set the BASE_NAME variable to the name of the 3-tier application infrastructure to be created. The script creates separate subnets for the Web tier, business tier, and data tier. Each tier consists of two VMs accessed through a load balancer.

4.	Set the SUBSCRIPTION variable to the subscription ID of the Azure account to use. By default, the script creates nine VMs that consume 36 CPU cores although you can customize the installation to use smaller VMs. Make sure that you have sufficient quota available before continuing.

5.	Save the script and close the editor.

6. Open a bash shell and move to the folder containing the azuredeploy.sh script.

7. Log in to your Azure account. In the bash shell enter the following command:

	```cli
    azure login
	```

	Follow the instructions to connect to Azure.

8. Run the following command to set your current subscription to the value specified in step 4 above. Replace *nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn* with the subscription ID:

	```cli
	azure account set nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn
	```

9. Run the command `./azuredeploy.sh`. You must supply the following information as command line parameters:

10. Verify that the script completes successfully. You can simply re-run the script if an error occurs.


***START HERE - NEED TO RUN SCRIPT BEFORE CONTINUING***

11. Browse to the Azure portal and verify that the following resource groups have been created:

	- ***myapp*-netwk-rg.** This resource group contains the network elements of the solution: the VNet that holds the subnets for the NVA, the application tiers, and the management subnet; the NSG definitions; the UDRs for forced tunneling for each application tier; the local gateway; the VPN gateway; the gateway public IP address; and the gateway connection, as shown below (*click to zoom in*):

		[![2]][2]

		The following image shows the subnets created in the VNet (*click to zoom in*):

		[![3]][3]

	- ***myapp*-web-tier-rg.** This resource group contains the VMs for the Web tier grouped into an availability set (the script creates two VMs for each tier by default), storage for each VM, the network interfaces, and the load balancer for this tier (*click to zoom in*):

		[![4]][4]

	- ***myapp*-biz-tier-rg.**. This resource group holds the VMs and resources for the business tier. The structure is the same as that of the web tier.

	- ***myapp*-db-tier-rg.** This resource group holds the VMs and resources for the data access tier. The structure is the same as that of the web and business tiers.

	- ***myapp*-mgmt-subnet-rg.** This resource group contains the resources used by the NVA and the management subnets. The script creates two VMs (with storage) and a load balancer for the NVA, and a separate VM (with storage) for the jump box. Each NVA VM has three network interfaces (NICs). The NICs for each NVA VM are configured to permit IP forwarding. No additional software is installed on any of these VMs. This resource group also contains the UDR for the gateway subnet (*click to zoom in*):

	[![5]][5]

8. Configure the VPN appliance on the on-premises network to connect to the Azure VPN gateway. For more information, seer the article [Implementing a Hybrid Network Architecture with Azure and On-premises VPN][guidance-vpn-gateway].

**TBD**

### Customizing the solution

**TBD**

## Availability considerations

**TBD**

## Security considerations

**TBD**

## Scalability considerations

**TBD**

## Monitoring considerations

<!-- links -->

[resource-manager-overview]: ../resource-group-overview.md
[guidance-vpn-gateway]: ./guidance-hybrid-network-vpn.md
[script]: #sample-solution-script
[implementing-a-multi-tier-architecture-on-Azure]: ./guidance-compute-3-tier-vm.md
[architecture]: #architecture_blueprint
[security]: #security
[recommendations]: #recommendations
[vpn-failover]: ./guidance-hybrid-network-expressroute-vpn-failover.md
[cli-install]: https://azure.microsoft.com/documentation/articles/xplat-cli-install
[git-for-windows]: https://git-for-windows.github.io
[ra-vpn]: ./guidance-hybrid-network-vpn.md
[ra-expressroute]: ./guidance-hybrid-network-expressroute.md
[implementing-a-secure-hybrid-network-architecture]: ./guidance-iaas-ra-secure-vnet-hybrid.md
[network-security-group]: https://azure.microsoft.com/documentation/articles/virtual-networks-nsg/
[availability-set]: https://azure.microsoft.com/documentation/articles/virtual-machines-windows-manage-availability/
[iptables]: https://help.ubuntu.com/community/IptablesHowTo

[azuredeploy-script]: https://github.com/mspnp/blueprints/blob/master/ARMBuildingBlocks/guidance-iaas-ra-pub-dmz/azuredeploy.sh
[azuredeploy]: https://github.com/mspnp/blueprints/blob/master/ARMBuildingBlocks/guidance-iaas-ra-pub-dmz/Templates/ra-vnet-subnets-udr-nsg/azuredeploy.json
[ibb-dmz]: https://github.com/mspnp/blueprints/blob/master/ARMBuildingBlocks/ARMBuildingBlocks/Templates/ibb-dmz.json

[0]: ./media/guidance-iaas-ra-secure-vnet-dmz/figure1.png "Secure hybrid network architecture"



<!-- Not currently referenced, but probably will be once content is added: -->
[getting-started-with-azure-security]: ./../azure-security-getting-started.md
[cloud-services-network-security]: https://azure.microsoft.com/documentation/articles/best-practices-network-security/
