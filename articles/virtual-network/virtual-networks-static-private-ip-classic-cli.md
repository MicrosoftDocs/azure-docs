<properties 
   pageTitle="How to set a static internal private IP in classic and CLI| Microsoft Azure"
   description="Understanding static internal IPs (DIPs) and how to manage them in classic and CLI"
   services="virtual-network"
   documentationCenter="na"
   authors="telmosampaio"
   manager="carolz"
   editor="tysonn"
   tags="azure-service-management"
/>
<tags 
   ms.service="virtual-network"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="09/06/2015"
   ms.author="telmos" />

# How to set a static internal private IP in Azure CLI

[AZURE.INCLUDE [virtual-networks-static-private-ip-selectors-classic-include](../../includes/virtual-networks-static-private-ip-selectors-classic-include.md)]

[AZURE.INCLUDE [virtual-networks-static-private-ip-intro-include](../../includes/virtual-networks-static-private-ip-intro-include.md)]

[AZURE.INCLUDE [azure-arm-classic-important-include](../../includes/azure-arm-classic-important-include.md)]. This article covers the classic deployment model. You can also [manage static private IP address in the Resource Manager deployment model](virtual-networks-static-private-ip-arm-cli).

>[AZURE.NOTE] The sample PowerShell commands below expect a simple environment already created. If you want to run the commands as they are displayed in this document, first build the test environment described in [create a vnet](virtual-networks-create-vnet-classic-cli).

## How to specify a static internal IP when creating a VM
TO create a new VM named *DC01* in a new cloud service named *TestService* based on the scenario above, follow these steps:

1. If you have never used Azure CLI, see [Install and Configure the Azure CLI](xplat-cli.md) and follow the instructions up to the point where you select your Azure account and subscription.
1. Run the **azure service create** command to create the cloud service.

		azure service create TestService --location uscentral

	Expected output:

		info:    Executing command service create
		info:    Creating cloud service
		data:    Cloud service name TestService
		info:    service create command OK
	
2. Run the **azure create vm** command to create the VM. Notice the value for a static IP address. The list shown after the output explains the parameters used.

		azure vm create -l centralus -n DC01 -w TestVNet -S "192.168.1.101" TestService bd507d3a70934695bc2128e3e5a255ba__RightImage-Windows-2012R2-x64-v14.2 adminuser AdminP@ssw0rd

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
	- **-S (or --static-ip)**. Private static IP for the VM.
	- **TestService**. Name of the cloud service where the VM will be created.
	- **bd507d3a70934695bc2128e3e5a255ba__RightImage-Windows-2012R2-x64-v14.2**. Image used to create the VM.
	- **adminuser**. Local administrator for the Windows VM.
	- **AdminP@ssw0rd**. Local administrator password for the Windows VM.

## How to retrieve static internal IP information for a VM
To view the static internal IP information for the VM created with the script above, run the following Azure CLI command and observe the value for *Network StaticIP*:

	azure vm static-ip show DC01

Expected output:

	info:    Executing command vm static-ip show
	info:    Getting virtual machines
	data:    Network StaticIP "192.168.1.101"
	info:    vm static-ip show command OK

## How to remove a static internal IP from a VM
To remove the static internal IP added to the VM in the script above, run the following Azure CLI command:
	
	azure vm static-ip remove DC01

Expected output:

	info:    Executing command vm static-ip remove
	info:    Getting virtual machines
	info:    Reading network configuration
	info:    Updating network configuration
	info:    vm static-ip remove command OK

## How to add a static internal IP to an existing VM
To add a static internal IP to the VM created using the script above, runt he following command:

	azure vm static-ip set DC01 192.168.1.101

Expected output:

	info:    Executing command vm static-ip set
	info:    Getting virtual machines
	info:    Looking up virtual network
	info:    Reading network configuration
	info:    Updating network configuration
	info:    vm static-ip set command OK

## Next steps

- Learn about [reserved public IP](../virtual-networks-reserved-public-ip) addresses.
- Learn about [instance-level public IP (ILPIP)](../virtual-networks-instance-level-public-ip) addresses.
- Consult the [Reserved IP REST APIs](https://msdn.microsoft.com/library/azure/dn722420.aspx).