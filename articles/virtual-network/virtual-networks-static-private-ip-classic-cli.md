<properties 
   pageTitle="How to set a static private IP in classic mode ausing the CLI| Microsoft Azure"
   description="Understanding static private IPs (DIPs) and how to manage them in classic mode using the CLI"
   services="virtual-network"
   documentationCenter="na"
   authors="jimdial"
   manager="carmonm"
   editor="tysonn"
   tags="azure-service-management"
/>
<tags 
   ms.service="virtual-network"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="03/15/2016"
   ms.author="jdial" />

# How to set a static private IP address (classic) in Azure CLI

[AZURE.INCLUDE [virtual-networks-static-private-ip-selectors-classic-include](../../includes/virtual-networks-static-private-ip-selectors-classic-include.md)]

[AZURE.INCLUDE [virtual-networks-static-private-ip-intro-include](../../includes/virtual-networks-static-private-ip-intro-include.md)]

[AZURE.INCLUDE [azure-arm-classic-important-include](../../includes/azure-arm-classic-important-include.md)] This article covers the classic deployment model. You can also [manage a static private IP address in the Resource Manager deployment model](virtual-networks-static-private-ip-arm-cli.md).

The sample Azure CLI commands below expect a simple environment already created. If you want to run the commands as they are displayed in this document, first build the test environment described in [create a vnet](virtual-networks-create-vnet-classic-cli.md).

## How to specify a static private IP address when creating a VM
To create a new VM named *DNS01* in a new cloud service named *TestService* based on the scenario above, follow these steps:

1. If you have never used Azure CLI, see [Install and Configure the Azure CLI](../xplat-cli-install.md) and follow the instructions up to the point where you select your Azure account and subscription.
1. Run the **azure service create** command to create the cloud service.

		azure service create TestService --location uscentral

	Expected output:

		info:    Executing command service create
		info:    Creating cloud service
		data:    Cloud service name TestService
		info:    service create command OK
	
2. Run the **azure create vm** command to create the VM. Notice the value for a static private IP address. The list shown after the output explains the parameters used.

		azure vm create -l centralus -n DNS01 -w TestVNet -S "192.168.1.101" TestService bd507d3a70934695bc2128e3e5a255ba__RightImage-Windows-2012R2-x64-v14.2 adminuser AdminP@ssw0rd

	Expected output:

		info:    Executing command vm create
		warn:    --vm-size has not been specified. Defaulting to "Small".
		info:    Looking up image bd507d3a70934695bc2128e3e5a255ba__RightImage-Windows-2012R2-x64-v14.2
		info:    Looking up virtual network
		info:    Looking up cloud service
		warn:    --location option will be ignored
		info:    Getting cloud service properties
		info:    Looking up deployment
		info:    Retrieving storage accounts
		info:    Creating VM
		info:    OK
		info:    vm create command OK

	- **-l (or --location)**. Azure region where the VM will be created. For our scenario, *centralus*.
	- **-n (or --vm-name)**. Name of the VM to be created.
	- **-w (or --virtual-network-name)**. Name of the VNet where the VM will be created. 
	- **-S (or --static-ip)**. Static private IP address for the VM.
	- **TestService**. Name of the cloud service where the VM will be created.
	- **bd507d3a70934695bc2128e3e5a255ba__RightImage-Windows-2012R2-x64-v14.2**. Image used to create the VM.
	- **adminuser**. Local administrator for the Windows VM.
	- **AdminP@ssw0rd**. Local administrator password for the Windows VM.

## How to retrieve static private IP address information for a VM
To view the static private IP address information for the VM created with the script above, run the following Azure CLI command and observe the value for *Network StaticIP*:

	azure vm static-ip show DNS01

Expected output:

	info:    Executing command vm static-ip show
	info:    Getting virtual machines
	data:    Network StaticIP "192.168.1.101"
	info:    vm static-ip show command OK

## How to remove a static private IP address from a VM
To remove the static private IP address added to the VM in the script above, run the following Azure CLI command:
	
	azure vm static-ip remove DNS01

Expected output:

	info:    Executing command vm static-ip remove
	info:    Getting virtual machines
	info:    Reading network configuration
	info:    Updating network configuration
	info:    vm static-ip remove command OK

## How to add a static private IP to an existing VM
To add a static private IP address to the VM created using the script above, runt he following command:

	azure vm static-ip set DNS01 192.168.1.101

Expected output:

	info:    Executing command vm static-ip set
	info:    Getting virtual machines
	info:    Looking up virtual network
	info:    Reading network configuration
	info:    Updating network configuration
	info:    vm static-ip set command OK

## Next steps

- Learn about [reserved public IP](virtual-networks-reserved-public-ip.md) addresses.
- Learn about [instance-level public IP (ILPIP)](virtual-networks-instance-level-public-ip.md) addresses.
- Consult the [Reserved IP REST APIs](https://msdn.microsoft.com/library/azure/dn722420.aspx).
