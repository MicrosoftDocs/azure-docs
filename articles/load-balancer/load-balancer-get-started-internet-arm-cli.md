<properties 
   pageTitle="Create an Internet facing load balancer in Resource Manager using the Azure CLI | Microsoft Azure"
   description="Learn how to create an Internet facing load balancer in Resource Manager using the Azure CLI"
   services="load-balancer"
   documentationCenter="na"
   authors="joaoma"
   manager="carmonm"
   editor=""
   tags="azure-resource-manager"
/>
<tags  
   ms.service="load-balancer"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="02/24/2016"
   ms.author="joaoma" />

# Get started creating an Internet facing load balancer using Azure CLI

[AZURE.INCLUDE [load-balancer-get-started-internet-arm-selectors-include.md](../../includes/load-balancer-get-started-internet-arm-selectors-include.md)]

[AZURE.INCLUDE [load-balancer-get-started-internet-intro-include.md](../../includes/load-balancer-get-started-internet-intro-include.md)]

[AZURE.INCLUDE [azure-arm-classic-important-include](../../includes/azure-arm-classic-important-include.md)] This article covers the Resource Manager deployment model. You can also [Learn how to create an Internet facing load balancer using classic deployment](load-balancer-get-started-internet-classic-portal.md)


[AZURE.INCLUDE [load-balancer-get-started-internet-scenario-include.md](../../includes/load-balancer-get-started-internet-scenario-include.md)]

This will cover the sequence of individual tasks it has to be done to create a load balancer and explain in detail what is being done to accomplish the goal.


## What is required to create an internet facing load balancer?

You need to create and configure the following objects to deploy a load balancer.

- Front end IP configuration - contains public IP addresses for incoming network traffic. 

- Back end address pool - contains network interfaces (NICs) for the virtual machines to receive network traffic from the load balancer. 

- Load balancing rules - contains rules mapping a public port on the load balancer to port in the back end address pool.

- Inbound NAT rules - contains rules mapping a public port on the load balancer to a port for a specific virtual machine in the back end address pool.

- Probes - contains health probes used to check availability of virtual machines instances in the back end address pool.

You can get more information about load balancer components with Azure resource manager at [Azure Resource Manager support for Load Balancer](load-balancer-arm.md).

## Setup CLI to use Resource Manager

1. If you have never used Azure CLI, see [Install and Configure the Azure CLI](../../articles/xplat-cli-install.md) and follow the instructions up to the point where you select your Azure account and subscription.

2. Run the **azure config mode** command to switch to Resource Manager mode, as shown below.

		azure config mode arm

	Expected output:

		info:    New mode is arm

## Create a virtual network and a public IP address for the front end IP pool

### Step 1

Create a virtual network (VNet) named *NRPVnet* in the East US location using a resource group named *NRPRG*.

	azure network vnet create NRPRG NRPVnet eastUS -a 10.0.0.0/16

Create a subnet named *NRPVnetSubnet* with a CIDR block of 10.0.0.0/24 in *NRPVnet*. 

	azure network vnet subnet create NRPRG NRPVnet NRPVnetSubnet -a 10.0.0.0/24

### Step 2

Create a public IP address named *NRPPublicIP* to be used by a front end IP pool with DNS name *loadbalancernrp.eastus.cloudapp.azure.com*. The command below uses the static allocation type and idle timeout of 4 minutes.

	azure network public-ip create -g NRPRG -n NRPPublicIP -l eastus -d loadbalancernrp -a static -i 4


>[AZURE.IMPORTANT] The load balancer will use the domain label of the public IP as its FQDN. This a change from classic deployment which uses the cloud service as the load balancer FQDN. 
>In this example, the FQDN will be *loadbalancernrp.eastus.cloudapp.azure.com*.

## Create a load balancer

In the following example, the command below creates a load balancer named *NRPlb* in the *NRPRG* resource group in the *East US* Azure location.  

	azure network lb create NRPRG NRPlb eastus

## Create a front end IP pool and a backend address pool

The example below creates the front end IP pool which will receive the incoming network traffic to the load balancer and the backend IP pool where the front end pool will send the load balanced network traffic.

### Step 1 

Create a front end IP pool associating the public IP created in the previous step and the load balancer. 

	azure network lb frontend-ip create nrpRG NRPlb NRPfrontendpool -i nrppublicip

### Step 2 

Set up a back end address pool used to receive incoming traffic from the front end IP pool. 

	azure network lb address-pool create NRPRG NRPlb NRPbackendpool

## Create LB rules, NAT rules, and probe

The example below creates the following items.

- a NAT rule to translate all incoming traffic on port 21 to port 22<sup>1</sup>
- a NAT rule to translate all incoming traffic on port 23 to port 22
- a load balancer rule to balance all incoming traffic on port 80 to port 80 on the addresses in the back end pool.
- a probe rule which will check the health status on a page named *HealthProbe.aspx*.

<sup>1</sup> NAT rules are associated to a specific virtual machine instance behind the load balancer. The incoming network traffic to port 21 will be sent to a specific virtual machine on port 22 associated with a NAT rule in the example below. You have to choose a protocol for NAT rule, UDP or TCP. Both protocols can't be assigned to the same port.

### Step 1

Create the NAT rules.

	azure network lb inbound-nat-rule create -g nrprg -l nrplb -n ssh1 -p tcp -f 21 -b 22
	azure network lb inbound-nat-rule create -g nrprg -l nrplb -n ssh2 -p tcp -f 23 -b 22

Parameters:

- **-g** - resource group name
- **-l** - load balancer name 
- **-n** - name of the resource whether is nat rule, probe or lb rule.
- **-p** - protocol (it can be TCP or UDP)  
- **-f** - front end port to be used (The probe command uses -f to define the probe path)
- **-b** - back end port to be used

### Step 2

Create a load balancer rule.

	azure network lb rule create nrprg nrplb lbrule -p tcp -f 80 -b 80 -t NRPfrontendpool -o NRPbackendpool
### Step 3

Create a health probe.

	azure network lb probe create -g nrprg -l nrplb -n healthprobe -p "http" -o 80 -f healthprobe.aspx -i 15 -c 4

	
	

**-g** - resource group 
**-l** - name of the load balancer set
**-n** - name of the health probe
**-p** - protocol used by health probe
**-i** - probe interval in seconds
**-c** - number of checks 

### Step 4

Check your settings.

	azure network lb show nrprg nrplb

Expected output:

	info:    Executing command network lb show
	+ Looking up the load balancer "nrplb"
	+ Looking up the public ip "NRPPublicIP"	
	data:    Id                              : /subscriptions/####################################/resourceGroups/nrprg/providers/Microsoft.Network/loadBalancers/nrplb
	data:    Name                            : nrplb
	data:    Type                            : Microsoft.Network/loadBalancers
	data:    Location                        : eastus
	data:    Provisioning State              : Succeeded
	data:    Frontend IP configurations:
	data:      Name                          : NRPfrontendpool
	data:      Provisioning state            : Succeeded
	data:      Public IP address id          : /subscriptions/####################################/resourceGroups/NRPRG/providers/Microsoft.Network/publicIPAddresses/NRPPublicIP
	data:      Public IP allocation method   : Static
	data:      Public IP address             : 40.114.13.145
	data:
	data:    Backend address pools:
	data:      Name                          : NRPbackendpool
	data:      Provisioning state            : Succeeded
	data:
	data:    Load balancing rules:
	data:      Name                          : HTTP
	data:      Provisioning state            : Succeeded
	data:      Protocol                      : Tcp
	data:      Frontend port                 : 80
	data:      Backend port                  : 80
	data:      Enable floating IP            : false
	data:      Idle timeout in minutes       : 4
	data:      Frontend IP configuration     : /subscriptions/####################################/resourceGroups/nrprg/providers/Microsoft.Network/loadBalancers/nrplb/frontendIPConfigurations/NRPfrontendpool
	data:      Backend address pool          : /subscriptions/####################################/resourceGroups/nrprg/providers/Microsoft.Network/loadBalancers/nrplb/backendAddressPools/NRPbackendpool
	data:
	data:    Inbound NAT rules:
	data:      Name                          : ssh1
	data:      Provisioning state            : Succeeded
	data:      Protocol                      : Tcp
	data:      Frontend port                 : 21
	data:      Backend port                  : 22
	data:      Enable floating IP            : false
	data:      Idle timeout in minutes       : 4
	data:      Frontend IP configuration     : /subscriptions/####################################/resourceGroups/nrprg/providers/Microsoft.Network/loadBalancers/nrplb/frontendIPConfigurations/NRPfrontendpool
	data:
	data:      Name                          : ssh2
	data:      Provisioning state            : Succeeded
	data:      Protocol                      : Tcp
	data:      Frontend port                 : 23
	data:      Backend port                  : 22
	data:      Enable floating IP            : false
	data:      Idle timeout in minutes       : 4
	data:      Frontend IP configuration     : /subscriptions/####################################/resourceGroups/nrprg/providers/Microsoft.Network/loadBalancers/nrplb/frontendIPConfigurations/NRPfrontendpool
	data:
	data:    Probes:
	data:      Name                          : healthprobe
	data:      Provisioning state            : Succeeded
	data:      Protocol                      : Http
	data:      Port                          : 80
	data:      Interval in seconds           : 15
	data:      Number of probes              : 4
	data:
	info:    network lb show command OK

## Create NICs

You need to create NICs (or modify existing ones) and associate them to NAT rules, load balancer rules, and probes.

### Step 1 

Create a NIC named *lb-nic1-be*, and associate it with the *rdp1* NAT rule, and the *NRPbackendpool* back end address pool.
	
	azure network nic create -g nrprg -n lb-nic1-be --subnet-name nrpvnetsubnet --subnet-vnet-name nrpvnet -d "/subscriptions/####################################/resourceGroups/nrprg/providers/Microsoft.Network/loadBalancers/nrplb/backendAddressPools/NRPbackendpool" -e "/subscriptions/####################################/resourceGroups/nrprg/providers/Microsoft.Network/loadBalancers/nrplb/inboundNatRules/rdp1" eastus

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

Create a NIC named *lb-nic2-be*, and associate it with the *rdp2* NAT rule, and the *NRPbackendpool* back end address pool.

 	azure network nic create -g nrprg -n lb-nic2-be --subnet-name nrpvnetsubnet --subnet-vnet-name nrpvnet -d "/subscriptions/####################################/resourceGroups/nrprg/providers/Microsoft.Network/loadBalancers/nrplb/backendAddressPools/NRPbackendpool" -e "/subscriptions/####################################/resourceGroups/nrprg/providers/Microsoft.Network/loadBalancers/nrplb/inboundNatRules/rdp2" eastus

### Step 3 

Create a virtual machine (VM) named *web1*, and associate it with the NIC named *lb-nic1-be*. A storage account called *web1nrp* was created before running the command below.

	azure vm create --resource-group nrprg --name web1 --location eastus --vnet-name nrpvnet --vnet-subnet-name nrpvnetsubnet --nic-name lb-nic1-be --availset-name nrp-avset --storage-account-name web1nrp --os-type Windows --image-urn MicrosoftWindowsServer:WindowsServer:2012-R2-Datacenter:4.0.20150825

>[AZURE.IMPORTANT] VMs in a load balancer need to be in the same availability set. Use `azure availset create` to create an availability set. 

The output will be the following:

	info:    Executing command vm create
	+ Looking up the VM "web1"
	Enter username: azureuser
	Enter password for azureuser: *********
	Confirm password: *********
	info:    Using the VM Size "Standard_A1"
	info:    The [OS, Data] Disk or image configuration requires storage account
	+ Looking up the storage account web1nrp
	+ Looking up the availability set "nrp-avset"
	info:    Found an Availability set "nrp-avset"
	+ Looking up the NIC "lb-nic1-be"
	info:    Found an existing NIC "lb-nic1-be"
	info:    Found an IP configuration with virtual network subnet id "/subscriptions/####################################/resourceGroups/NRPRG/providers/Microsoft.Network/virtualNetworks/NRPVnet/subnets/NRPVnetSubnet" in the NIC "lb-nic1-be"
	info:    This is a NIC without publicIP configured
	+ Creating VM "web1"
	info:    vm create command OK

>[AZURE.NOTE] The informational message **This is a NIC without publicIP configured** is expected since the NIC created for the load balancer connecting to Internet using the load balancer public IP address. 

Since the *lb-nic1-be* NIC is associated with the *rdp1* NAT rule, you can connect to *web1* using RDP through port 3441 on the load balancer.

### Step 4

Create a virtual machine (VM) named *web2*, and associate it with the NIC named *lb-nic2-be*. A storage account called *web1nrp* was created before running the command below.

	azure vm create --resource-group nrprg --name web2 --location eastus --vnet-	name nrpvnet --vnet-subnet-name nrpvnetsubnet --nic-name lb-nic2-be --availset-name nrp-avset --storage-account-name web2nrp --os-type Windows --image-urn MicrosoftWindowsServer:WindowsServer:2012-R2-Datacenter:4.0.20150825

## Update an existing load balancer

You can add rules referencing the an existing load balancer. In the example below, a new load balancer rule is added to an existing load balancer **NRPlb**

	azure network lb rule create -g nrprg -l nrplb -n lbrule2 -p tcp -f 8080 -b 8051 -t frontendnrppool -o NRPbackendpool

Parameters:

**-g** - resource group name<br>
**-l** - load balancer name<BR> 
**-n** - load balancer rule name<BR>
**-p** - protocol<BR>
**-f** - front end port<BR>
**-b** - back end port<BR>
**-t** - front end pool name<BR>
**-b** - back end pool name<BR>

## Delete a load balancer 


To remove a load balancer use the following command

	azure network lb delete -g nrprg -n nrplb 

Where **nrprg** is the resource group and **nrplb** the load balancer name.

## Next steps

[Get started configuring an internal load balancer](load-balancer-get-started-ilb-arm-cli.md)

[Configure a load balancer distribution mode](load-balancer-distribution-mode.md)

[Configure idle TCP timeout settings for your load balancer](load-balancer-tcp-idle-timeout.md)
