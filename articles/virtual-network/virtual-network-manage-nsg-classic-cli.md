<properties 
   pageTitle="Manage NSGs using the Azure CLI in the classic deployment model | Microsoft Azure"
   description="Learn how to manage exising NSGs using the Azure CLI in the classic deployment model"
   services="virtual-network"
   documentationCenter="na"
   authors="telmosampaio"
   manager="carmonm"
   editor=""
   tags="azure-service-management"
/>
<tags  
   ms.service="virtual-network"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="02/14/2016"
   ms.author="telmos" />

# Manage NSGs (classic) using the Azure CLI

[AZURE.INCLUDE [virtual-network-manage-classic-selectors-include.md](../../includes/virtual-network-manage-nsg-classic-selectors-include.md)]

[AZURE.INCLUDE [virtual-network-manage-nsg-intro-include.md](../../includes/virtual-network-manage-nsg-intro-include.md)]

[AZURE.INCLUDE [azure-arm-classic-important-include](../../includes/learn-about-deployment-models-classic-include.md)] [Resource Manager model](virtual-network-manage-cli.md).

[AZURE.INCLUDE [virtual-network-manage-nsg-classic-scenario-include.md](../../includes/virtual-network-manage-nsg-classic-scenario-include.md)]

[AZURE.INCLUDE [azure-cli-prerequisites-include.md](../../includes/azure-cli-prerequisites-include.md)]

## Retrieve Information

You can view your existing NSGs, retrieve rules for an existing NSG, and find out what resources an NSG is associated to.

### View existing NSGs

To view the list of NSGs in a specific resource group, run the `azure network nsg list` command as shown below. 

	azure network nsg list

Expected output:

	info:    Executing command network nsg list
	info:    Getting the network security groups
	data:    Name          Location    Label
	data:    ------------  ----------  -----
	data:    NSG-BackEnd   Central US       
	data:    NSG-FrontEnd  Central US       
	info:    network nsg list command OK
		 
### List all rules for an NSG

To view the rules of an NSG named **NSG-FrontEnd**, run the `azure network nsg show` command as shown below. 

	azure network nsg show --name NSG-FrontEnd

Expected output:
	
	info:    Executing command network nsg show
	info:    Looking up the network security group "NSG-FrontEnd"
	data:    Name                            : NSG-FrontEnd
	data:    Location                        : Central US
	data:    Security group rules:
	data:    Name                               Source IP           Source Port  Destination IP   Destination Port  Protocol  Type      Action  Priority  Default
	data:    ---------------------------------  ------------------  -----------  ---------------  ----------------  --------  --------  ------  --------  -------
	data:    rdp-rule                           INTERNET            *            *                3389              TCP       Inbound   Allow   100       false  
	data:    web-rule                           INTERNET            *            *                80                TCP       Inbound   Allow   200       false  
	data:    ALLOW VNET OUTBOUND                VIRTUAL_NETWORK     *            VIRTUAL_NETWORK  *                 *         Outbound  Allow   65000     true   
	data:    ALLOW VNET INBOUND                 VIRTUAL_NETWORK     *            VIRTUAL_NETWORK  *                 *         Inbound   Allow   65000     true   
	data:    ALLOW INTERNET OUTBOUND            *                   *            INTERNET         *                 *         Outbound  Allow   65001     true   
	data:    ALLOW AZURE LOAD BALANCER INBOUND  AZURE_LOADBALANCER  *            *                *                 *         Inbound   Allow   65001     true   
	data:    DENY ALL OUTBOUND                  *                   *            *                *                 *         Outbound  Deny    65500     true   
	data:    DENY ALL INBOUND                   *                   *            *                *                 *         Inbound   Deny    65500     true   
	info:    network nsg show command OK

>[AZURE.NOTE] You can also use `azure network nsg rule list --nsg-name NSG-FrontEnd` to list the rules from the **NSG-FrontEnd** NSG.

### View NSG associations

## Manage rules

You can add rules to an existing NSG, edit existing rules, and remove rules.

### Add a rule

To add a rule allowing **inbound** traffic to port **443** from any machine to the **NSG-FrontEnd** NSG, run the `azure network nsg rule create` command as shown below.

	azure network nsg rule create --resource-group RG-NSG \
		--nsg-name NSG-FrontEnd \
		--name allow-https \
		--protocol Tcp \
		--source-address-prefix * \
		--source-port-range * \
		--destination-address-prefix * \
		--destination-port-range 443 \
		--action Allow \
		--priority 102 \
		--type Inbound		

Expected output:

	info:    Executing command network nsg rule create
	info:    Looking up the network security group "NSG-FrontEnd"
	info:    Creating a network security rule "allow-https"
	info:    Looking up the network security group "NSG-FrontEnd"
	data:    Name                            : allow-https
	data:    Source address prefix           : *
	data:    Source Port                     : *
	data:    Destination address prefix      : *
	data:    Destination Port                : 443
	data:    Protocol                        : TCP
	data:    Type                            : Inbound
	data:    Action                          : Allow
	data:    Priority                        : 102
	info:    network nsg rule create command OK

### Change a rule

To change the rule created above to allow inbound traffic from the **Internet** only, run the `azure network nsg rule set` command as shown below.

	azure network nsg rule set --nsg-name NSG-FrontEnd \
		--name allow-https \
		--source-address-prefix Internet

Expected output:

	info:    Executing command network nsg rule set
	info:    Looking up the network security group "NSG-FrontEnd"
	info:    Setting a network security rule "allow-https"
	info:    Looking up the network security group "NSG-FrontEnd"
	data:    Name                            : allow-https
	data:    Source address prefix           : INTERNET
	data:    Source Port                     : *
	data:    Destination address prefix      : *
	data:    Destination Port                : 443
	data:    Protocol                        : TCP
	data:    Type                            : Inbound
	data:    Action                          : Allow
	data:    Priority                        : 102
	info:    network nsg rule set command OK

### Delete a rule

To delete the rule created above, run the `azure network nsg rule delete` command as shown below.

	azure network nsg rule delete --nsg-name NSG-FrontEnd \
		--name allow-https \
		--quiet

>[AZURE.NOTE] The **--quiet** parameter ensures you don't need to confirm the deletion.

Expected output:

	info:    Executing command network nsg rule delete
	info:    Looking up the network security group "NSG-FrontEnd"
	info:    Deleting network security rule "allow-https"
	info:    network nsg rule delete command OK

## Manage associations

You can associate an NSG to subnets and VMs. You can also dissociate an NSG from any resource it's associated to. However, you can manage associations to subnets when using Azure CLI.

### Dissociate an NSG from a subnet

To dissociate the **NSG-FrontEnd** NSG from the **FrontEnd** subnet, run the `azure network nsg subnet remove` command as shown below.

	azure network nsg subnet remove --nsg-name NSG-FrontEnd \
		--vnet-name TestVNet \
		--subnet-name FrontEnd \
		--quiet

Expected output:

	info:    Executing command network nsg subnet remove
	info:    Looking up the network security group "NSG-FrontEnd"
	info: 	 Looking up the subnet "FrontEnd"
	info:    Looking up network configuration
	info:    Creating a network security group "NSG-FrontEnd"
	info:    network nsg subnet remove command OK

### Associate an NSG to a subnet

To associate the **NSG-FrontEnd** NSG to the **FronEnd** subnet again, run the `azure network nsg subnet add` command as shown below.

	azure network nsg subnet add --nsg-name NSG-FrontEnd \
		--vnet-name TestVNet \
		--subnet-name FrontEnd

Expected output:

	info:    Executing command network nsg subnet add
	info:    Looking up the network security group "NSG-FrontEnd"
	info:    Looking up the subnet "FrontEnd"
	info:    Looking up network configuration
	info:    Creating a network security group "NSG-FrontEnd"
	info:    network nsg subnet add command OK

## Delete an NSG

You can only delete an NSG if it's not associated to any resource. To delete an NSG, follow the steps below.

1. If the NSG is associated to any subnet, run the `azure network nsg subnet remove` as shown in [Dissociate an NSG from a subnet](#Dissociate-an-NSG-from-a-subnet) for each subnet.
2. To delete the NSG, run the `azure network nsg delete` command as shown below.

		azure network nsg delete --name NSG-FrontEnd --quiet

	Expected output:

		info:    Executing command network nsg delete
		info:    Deleting network security group "NSG-FrontEnd"
		info:    network nsg delete command OK

## Next steps

- [Enable logging](virtual-network-nsg-manage-log.md) for NSGs.