<properties 
   pageTitle="Create an internal load balancer using the Azure CLI in Resource Manager | Microsoft Azure"
   description="Learn how to create an internal load balancer using the Azure CLI in Resource Manager"
   services="load-balancer"
   documentationCenter="na"
   authors="joaoma"
   manager="carolz"
   editor=""
   tags="azure-resource-manager"
/>
<tags  
   ms.service="load-balancer"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="02/09/2016"
   ms.author="joaoma" />

# Get started creating an internal load balancer using the Azure CLI

[AZURE.INCLUDE [load-balancer-get-started-ilb-arm-selectors-include.md](../../includes/load-balancer-get-started-ilb-arm-selectors-include.md)]
<BR>
[AZURE.INCLUDE [load-balancer-get-started-ilb-intro-include.md](../../includes/load-balancer-get-started-ilb-intro-include.md)]

[AZURE.INCLUDE [azure-arm-classic-important-include](../../includes/learn-about-deployment-models-rm-include.md)] [classic deployment model](load-balancer-get-started-ilb-classic-cli.md).

[AZURE.INCLUDE [load-balancer-get-started-ilb-scenario-include.md](../../includes/load-balancer-get-started-ilb-scenario-include.md)]

## What is required to create an internal load balancer?

You need to create and configure the following objects to deploy a load balancer:

- Front end IP configuration - configures the private IP address  for incoming network traffic. 

- Back end address pool - contains network interfaces (NICs) to receive traffic from the load balancer. 

- Load balancing rules - contains rules mapping a incoming network traffic port to a port receiving network traffic in the back end pool.

- Inbound NAT rules - contains rules mapping a public port on the load balancer to a port for a specific virtual machine in the back end address pool.

- Probes - contains health probes used to check availability of virtual machines associated with the back end address pool.

You can get more information about load balancer components with Azure resource manager at [Azure Resource Manager support for Load Balancer](load-balancer-arm.md).

## Setup CLI to use Resource Manager


1. If you have never used Azure CLI, see [Install the Azure CLI](../xplat-cli-install.md) and follow the instructions up to the point where you select your Azure account and subscription.


2. Run the **azure config mode** command to switch to Resource Manager mode, as shown below.

		azure config mode arm

	Expected output:

		info:    New mode is arm

## Step by step creating an internal load balancer 

The following steps will create an internal load balancer based on the scenario above:

### Step 1 

If you haven't done yet, download the latest version of [Azure command line interface](https://azure.microsoft.com/downloads/).

### Step 2 

After installing it, authenticate your account.

	azure login

The authentication process will request your use name and password for your azure subscription.

### Step 3

Change the command tools to Azure resource manager mode.

	azure config mode arm

## Create a resource group

All resources in Azure resource manager are associated to a resource group. If you haven't done yet, create a resource group.

	azure group create <resource group name> <location>


## Create an internal  load balancer set 


### Step 1 

Create an internal load balancer using `azure network lb create` command. In the following scenario, a resource group named nrprg is created in East US region.
 	
	azure network lb create -n nrprg -l westus

>[AZURE.NOTE] all resources for an internal load balancer such as virtual network and virtual network subnet must be in the same resource group and in the same region.


### Step 2 

Create a front end IP address for the internal load balancer. The IP address used has to be within the subnet range of your virtual network.

	
	azure network lb frontend-ip create -g nrprg -l ilbset -n feilb -a 10.0.0.7 -e nrpvnetsubnet -m nrpvnet

Parameters used:

**-g** - resource group 
**-l** - name of the internal load balancer set
**-n** - name of the front end IP 
**-a** - private IP address within the subnet range.
**-e** - subnet name
**-m** - virtual network name 

### Step 3 

Create the back end address pool. 

	azure network lb address-pool create -g nrprg -l ilbset -n beilb

Parameters used:

**-g** - resource group 
**-l** - name of the internal load balancer set
**-n** - name of the back end address pool

After defining a front end IP address and a back end address pool, you can create load balancer rules, inbound NAT rules and customize health probes.

### Step 4


Create a load balancer rule for internal load balancer. Following the scenario above, the command creates a load balancer rule listening to port 1433 in the front end pool and sending load balanced network traffic to back end address pool also using port 1433. 

	azure network lb rule create -g nrprg -l ilbset -n ilbrule -p tcp -f 1433 -b 1433 -t feilb -o beilb

Parameters used:

**-g** - resource group 
**-l** - name of the internal load balancer set
**-n** - name of the load balancer rule
**-p** - protocol used for the rule
**-f** - port which is listening to incoming network traffic in the load balancer front end
**-b** - port receiving the network traffic in the back end address pool

### Step 5

Create inbound NAT rules. Inbound NAT rules are used to create endpoints in a load balancer which will go to a specific virtual machine instance.
Following the example above, 2 NAT rules were created for remote desktop access.

	azure network lb inbound-nat-rule create -g nrprg -l ilbset -n NATrule1 -p TCP -f 5432 -b 3389
	
	azure network lb inbound-nat-rule create -g nrprg -l ilbset -n NATrule2 -p TCP -f 5433 -b 3389

Parameters used:

**-g** - resource group 
**-l** - name of the internal load balancer set
**-n** - name of the inbound NAT rule
**-p** - protocol used for the rule
**-f** - port which is listening to incoming network traffic in the load balancer front end
**-b** - port receiving the network traffic in the back end address pool

### Step 5 

Create health probes for the load balancer. A health probe checks all virtual machine instances to make sure it can send network traffic. The virtual machine instance with failed probe checks is removed from the load balancer until it goes back online and probe checks as healthy.

	azure network lb probe create -g nrprg -l ilbset -n ilbprobe -p tcp -i 300 -c 4

**-g** - resource group 
**-l** - name of the internal load balancer set
**-n** - name of the health probe
**-p** - protocol used by health probe
**-i** - probe interval in seconds
**-c** - number of checks 

>[AZURE.NOTE] The Microsoft Azure platform uses a static, publicly routable IPv4 address for a variety of administrative scenarios. The IP address is 168.63.129.16. This IP address should not be blocked by any firewalls, because it can cause unexpected behavior.
>With respect to Azure Internal Load Balancing, this IP address is used by monitoring probes from the load balancer to determine the health state for virtual machines in a load balanced set. If a Network Security Group is used to restrict traffic to Azure virtual machines in an internally load-balanced set or is applied to a Virtual Network Subnet, ensure that a Network Security Rule is added to allow traffic from 168.63.129.16.

## Create NICs

You need to create NICs (or modify existing ones) and associate them to NAT rules, load balancer rules, and probes.

### Step 1 

Create a NIC named *lb-nic1-be*, and associate it with the *rdp1* NAT rule, and the *beilb* back end address pool.
	
	azure network nic create -g nrprg -n lb-nic1-be --subnet-name nrpvnetsubnet --subnet-vnet-name nrpvnet -d "/subscriptions/####################################/resourceGroups/nrprg/providers/Microsoft.Network/loadBalancers/nrplb/backendAddressPools/beilb" -e "/subscriptions/####################################/resourceGroups/nrprg/providers/Microsoft.Network/loadBalancers/nrplb/inboundNatRules/rdp1" eastus

Parameters:

- **-g** - resource group name
- **-n** - name for the NIC resource
- **--subnet-name** - name of the subnet 
- **--subnet-vnet-name** - name of the virtual network
- **-d** - ID of the back end pool resource - starts with /subscription/{subscriptionID/resourcegroups/<resourcegroup-name>/providers/Microsoft.Network/loadbalancers/<load-balancer-name>/backendaddresspools/<name-of-the-backend-pool> 
- **-e** - ID of the NAT rule which will be associated to the NIC resource - starts with /subscriptions/####################################/resourceGroups/<resourcegroup-name>/providers/Microsoft.Network/loadBalancers/<load-balancer-name>/inboundNatRules/<nat-rule-name>


Expected output:

	info:    Executing command network nic create
	+ Looking up the network interface "lb-nic1-be"
	+ Looking up the subnet "nrpvnetsubnet"
	+ Creating network interface "lb-nic1-be"
	+ Looking up the network interface "lb-nic1-be"
	data:    Id                              : /subscriptions/####################################/resourceGroups/nrprg/providers/Microsoft.Network/networkInterfaces/lb-nic1-be
	data:    Name                            : lb-nic1-be
	data:    Type                            : Microsoft.Network/networkInterfaces
	data:    Location                        : eastus
	data:    Provisioning state              : Succeeded
	data:    Enable IP forwarding            : false
	data:    IP configurations:
	data:      Name                          : NIC-config
	data:      Provisioning state            : Succeeded
	data:      Private IP address            : 10.0.0.4
	data:      Private IP Allocation Method  : Dynamic
	data:      Subnet                        : /subscriptions/####################################/resourceGroups/NRPRG/providers/Microsoft.Network/virtualNetworks/NRPVnet/subnets/NRPVnetSubnet
	data:      Load balancer backend address pools
	data:        Id                          : /subscriptions/####################################/resourceGroups/nrprg/providers/Microsoft.Network/loadBalancers/nrplb/backendAddressPools/NRPbackendpool
	data:      Load balancer inbound NAT rules:
	data:        Id                          : /subscriptions/####################################/resourceGroups/nrprg/providers/Microsoft.Network/loadBalancers/nrplb/inboundNatRules/rdp1
	data:
	info:    network nic create command OK

### Step 2

Create a NIC named *lb-nic2-be*, and associate it with the *rdp2* NAT rule, and the *beilb* back end address pool.

 	azure network nic create -g nrprg -n lb-nic2-be --subnet-name nrpvnetsubnet --subnet-vnet-name nrpvnet -d "/subscriptions/####################################/resourceGroups/nrprg/providers/Microsoft.Network/loadBalancers/nrplb/backendAddressPools/beilb" -e "/subscriptions/####################################/resourceGroups/nrprg/providers/Microsoft.Network/loadBalancers/nrplb/inboundNatRules/rdp2" eastus

### Step 3 

Create a virtual machine (VM) named *DB1*, and associate it with the NIC named *lb-nic1-be*. A storage account called *web1nrp* was created before running the command below.

	azure vm create --resource-group nrprg --name DB1 --location eastus --vnet-name nrpvnet --vnet-subnet-name nrpvnetsubnet --nic-name lb-nic1-be --availset-name nrp-avset --storage-account-name web1nrp --os-type Windows --image-urn MicrosoftWindowsServer:WindowsServer:2012-R2-Datacenter:4.0.20150825

>[AZURE.IMPORTANT] VMs in a load balancer need to be in the same availability set. Use `azure availset create` to create an availability set. 

### Step 4

Create a virtual machine (VM) named *DB2*, and associate it with the NIC named *lb-nic2-be*. A storage account called *web1nrp* was created before running the command below.

	azure vm create --resource-group nrprg --name DB2 --location eastus --vnet-	name nrpvnet --vnet-subnet-name nrpvnetsubnet --nic-name lb-nic2-be --availset-name nrp-avset --storage-account-name web2nrp --os-type Windows --image-urn MicrosoftWindowsServer:WindowsServer:2012-R2-Datacenter:4.0.20150825

## Delete a load balancer 


To remove a load balancer use the following command

	azure network lb delete -g nrprg -n ilbset 

Where **nrprg** is the resource group and **ilbset** the internal load balancer name.


## Next steps

[Configure a load balancer distribution mode using source IP affinity](load-balancer-distribution-mode.md)

[Configure idle TCP timeout settings for your load balancer](load-balancer-tcp-idle-timeout.md)

