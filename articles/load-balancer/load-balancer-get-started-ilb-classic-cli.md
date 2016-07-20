<properties 
   pageTitle="Create an internal load balancer using the Azure CLI in the classic deployment model | Microsoft Azure"
   description="Learn how to create an internal load balancer using the Azure CLI in the classic deployment model"
   services="load-balancer"
   documentationCenter="na"
   authors="joaoma"
   manager="carolz"
   editor=""
   tags="azure-service-management"
/>
<tags  
   ms.service="load-balancer"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="02/09/2016"
   ms.author="joaoma" />

# Get started creating an internal load balancer (classic) using the Azure CLI

[AZURE.INCLUDE [load-balancer-get-started-ilb-classic-selectors-include.md](../../includes/load-balancer-get-started-ilb-classic-selectors-include.md)]

[AZURE.INCLUDE [load-balancer-get-started-ilb-intro-include.md](../../includes/load-balancer-get-started-ilb-intro-include.md)]

[AZURE.INCLUDE [azure-arm-classic-important-include](../../includes/learn-about-deployment-models-classic-include.md)] Learn how to [perform these steps using the Resource Manager model](load-balancer-get-started-ilb-arm-cli.md).

[AZURE.INCLUDE [load-balancer-get-started-ilb-scenario-include.md](../../includes/load-balancer-get-started-ilb-scenario-include.md)]


## To create an internal load balancer set for virtual machines

To create an internal load balancer set and the servers that will send their traffic to it, you must do the following:

1. Create an instance of Internal Load Balancing that will be the endpoint of incoming traffic to be load balanced across the servers of a load-balanced set.

1. Add endpoints corresponding to the virtual machines that will be receiving the incoming traffic.

1. Configure the servers that will be sending the traffic to be load balanced to send their traffic to the virtual IP (VIP) address of the Internal Load Balancing instance.

## Step by step creating an internal load balancer using CLI

This guide shows how to create an internal load balancer based on the scenario above.

1. If you have never used Azure CLI, see [Install and Configure the Azure CLI](../../articles/xplat-cli-install.md) and follow the instructions up to the point where you select your Azure account and subscription.

2. Run the **azure config mode** command to switch to classic mode, as shown below.

		azure config mode asm

	Expected output:

		info:    New mode is asm


## Create endpoint and load balancer set 

The scenario assumes the virtual machines "DB1" and "DB2" in a cloud service called "mytestcloud". Both virtual machines are using a virtual network called my "testvnet" with subnet "subnet-1".

This guide will create an internal load balancer set using port 1433 as private port and 1433 as local port.

This is a common scenario where you have SQL virtual machines on the back end using an internal load balancer to guarantee the database servers won't be exposed directly using a public IP address. 


### Step 1 

Create an internal load balancer set using `azure network service internal-load-balancer add`. 

	 azure service internal-load-balancer add -r mytestcloud -n ilbset -t subnet-1 -a 192.168.2.7

Parameters used:

**-r** - cloud service name<BR>
**-n** - internal load balancer name<BR>
**-t** - subnet name ( same subnet by the virtual machines you will add to the internal load balancer)<BR>
**-a** - (optional) add a static private IP address<BR>

Check out `azure service internal-load-balancer --help` for more information. 
 
You can check the internal load balancer properties using the command `azure service internal-load-balancer list` *cloud service name*. 

Here follows an example of the output:

	azure service internal-load-balancer list my-testcloud
	info:    Executing command service internal-load-balancer list
	+ Getting cloud service deployment
	data:    Name    Type     SubnetName  StaticVirtualNetworkIPAddress
	data:    ------  -------  ----------  -----------------------------
	data:    ilbset  Private  subnet-1    192.168.2.7
	info:    service internal-load-balancer list command OK


## Step 2 

You configure the internal load balancer set when you add the first endpoint. You will associate the endpoint, virtual machine and probe port to the internal load balancer set in this step.

	azure vm endpoint create db1 1433 -k 1433 tcp -t 1433 -r tcp -e 300 -f 600 -i ilbset

Parameters used:

**-k** - local virtual machine port<BR>
**-t** - probe port<BR>
**-r** - probe protocol<BR>
**-e** - probe interval in seconds<BR>
**-f** - timeout interval in seconds <BR>
**-i** - internal load balancer name <BR>


## Step 3 

Verify the load balancer configuration using `azure vm show` *virtual machine name*

	azure vm show DB1 

The output will be:

		azure vm show DB1
	info:    Executing command vm show
	+ Getting virtual machines
	data:    DNSName "mytestcloud.cloudapp.net"
	data:    Location "East US 2"
	data:    VMName "DB1"
	data:    IPAddress "192.168.2.4"
	data:    InstanceStatus "ReadyRole"
	data:    InstanceSize "Standard_D1"
	data:    Image "a699494373c04fc0bc8f2bb1389d6106__Windows-Server-2012-R2-20151022-en.us-127GB.vhd"
	data:    OSDisk hostCaching "ReadWrite"
	data:    OSDisk name "db1-DB1-0-201511120457370846"
	data:    OSDisk mediaLink "https://XXXX.blob.core.windows.net/vhd"
	data:    OSDisk sourceImageName "a699494373c04fc0bc8f2bb1389d6106__Windows-Server-2012-R2-20151022-en.us-127GB.vhd"
	data:    OSDisk operatingSystem "Windows"
	data:    OSDisk iOType "Standard"
	data:    ReservedIPName ""
	data:    VirtualIPAddresses 0 address "137.116.64.107"
	data:    VirtualIPAddresses 0 name "db1ContractContract"
	data:    VirtualIPAddresses 0 isDnsProgrammed true
	data:    VirtualIPAddresses 1 address "192.168.2.7"
	data:    VirtualIPAddresses 1 name "ilbset"
	data:    Network Endpoints 0 localPort 5986
	data:    Network Endpoints 0 name "PowerShell"
	data:    Network Endpoints 0 port 5986
	data:    Network Endpoints 0 protocol "tcp"
	data:    Network Endpoints 0 virtualIPAddress "137.116.64.107"	
	data:    Network Endpoints 0 enableDirectServerReturn false
	data:    Network Endpoints 1 localPort 3389
	data:    Network Endpoints 1 name "Remote Desktop"
	data:    Network Endpoints 1 port 60173
	data:    Network Endpoints 1 protocol "tcp"
	data:    Network Endpoints 1 virtualIPAddress "137.116.64.107"
	data:    Network Endpoints 1 enableDirectServerReturn false
	data:    Network Endpoints 2 localPort 1433
	data:    Network Endpoints 2 name "tcp-1433-1433"
	data:    Network Endpoints 2 port 1433
	data:    Network Endpoints 2 loadBalancerProbe port 1433
	data:    Network Endpoints 2 loadBalancerProbe protocol "tcp"
	data:    Network Endpoints 2 loadBalancerProbe intervalInSeconds 300
	data:    Network Endpoints 2 loadBalancerProbe timeoutInSeconds 600
	data:    Network Endpoints 2 protocol "tcp"
	data:    Network Endpoints 2 virtualIPAddress "192.168.2.7"
	data:    Network Endpoints 2 enableDirectServerReturn false
	data:    Network Endpoints 2 loadBalancerName "ilbset"
	info:    vm show command OK


## Create a remote desktop endpoint for a virtual machine

You can create a remote desktop endpoint to forward network traffic from a public port to a local port for a specific virtual machine using `azure vm endpoint create`.

	azure vm endpoint create web1 54580 -k 3389 


## Remove virtual machine from load balancer

You can remove a virtual machine from an internal load balancer set by deleting the associated endpoint. Once the endpoint is removed, the virtual machine won't belong to the load balancer set anymore. 

 Using the example above, you can remove the endpoint created for virtual machine "DB1" from internal load balancer "ilbset" by using the command `azure vm endpoint delete`.

	azure vm endpoint delete DB1 tcp-1433-1433


Check out `azure vm endpoint --help` for more information. 


## Next steps

[Configure a load balancer distribution mode using source IP affinity](load-balancer-distribution-mode.md)

[Configure idle TCP timeout settings for your load balancer](load-balancer-tcp-idle-timeout.md)