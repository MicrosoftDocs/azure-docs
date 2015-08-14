## How to create a VNet using Azure CLI

You can use the Azure CLI to manage your Azure resources from the command prompt from any computer running Windows, Linux, or OSX. To create a VNet by using the Azure CLI, follow the steps below.

1. If you have never used Azure CLI, see [Install and Configure the Azure CLI](xplat-cli.md) and follow the instructions up to the point where you select your Azure account and subscription.
2. Run the **azure config mode** command to switch to Resource Manager mode, as shown below.

		azure config mode arm

		info:    New mode is arm

3. If necessary, run the **azure group create** to create a new resource group, as shown below. Notice the output of the command. The list shown after the output explains the parameters used.

		azure group create -n RG1 -l centralus
		info:    Executing command group create
		+ Getting resource group RG1
		+ Creating resource group RG1
		info:    Created resource group RG1
		data:    Id:                  /subscriptions/628dad04-b5d1-4f10-b3a4-dc61d88cf97c/resourceGroups/RG1
		data:    Name:                RG1
		data:    Location:            centralus
		data:    Provisioning State:  Succeeded
		data:    Tags: null
		data:
		info:    group create command OK

	- **-n (or --name)**. Name for the new resource group. For our scenario, *RG1*.
	- **-l (or --location)**. Azure region where the new resource group will be created. For our scenario, *centralus*.

4. Run the **azure network vnet create** command to create a VNet and a subnet, as shown below. Notice the output from the CLI command. The list shown after the output explains the parameters used.
		azure network vnet create -g RG1 -n TestVNet -a 192.168.0.0/16 -l centralus

		info:    Executing command network vnet create
		+ Looking up virtual network "TestVNet"
		+ Creating virtual network "TestVNet"
		+ Loading virtual network state
		data:    Id                              : /subscriptions/628dad04-b5d1-4f10-b3a4-dc61d88cf97c/resourceGroups/RG1/providers/Microsoft.Network/virtualNetworks/TestVNet2
		data:    Name                            : TestVNet
		data:    Type                            : Microsoft.Network/virtualNetworks
		data:    Location                        : centralus
		data:    ProvisioningState               : Succeeded
		data:    Address prefixes:
		data:      192.168.0.0/16
		info:    network vnet create command OK

	- **-g (or --resource-group)**. Name of the resource group where the VNet will be created. For our scenario, *RG1*.
	- **-n (or --name)**. Name of the VNet to be created. For our scenario, *TestVNet*
	- **-a (or --address-prefixes)**. List of CIDR blocks used for the VNet address space. For our scenario, *192.168.0.0/16*
	- **-l (or --location)**. Azure region where the VNet will be created. For our scenario, *centralus*.

5. Run the **azure network vnet subnet create** command to create a subnet as shown below. Notice the output of the command. The list shown after the output explains the parameters used.

		azure network vnet subnet create -g RG1 -e TestVNet -n FrontEnd -a 192.168.1.0/24

		info:    Executing command network vnet subnet create
		+ Looking up the subnet "FrontEnd"
		+ Creating subnet "FrontEnd"
		+ Looking up the subnet "FrontEnd"
		data:    Id                              : /subscriptions/628dad04-b5d1-4f10-b3a4-dc61d88cf97c/resourceGroups/RG1/providers/Microsoft.Network/virtualNetworks/TestVNet/subnets/FrontEnd
		data:    Type                            : Microsoft.Network/virtualNetworks/subnets
		data:    ProvisioningState               : Succeeded
		data:    Name                            : FrontEnd
		data:    Address prefix                  : 192.168.1.0/24
		data:
		info:    network vnet subnet create command OK

	- **-e (or --vnet-name**. Name of the VNet where the subnet will be created. For our scenario, *TestVNet*.
	- **-n (or --name)**. Name of the new subnet. For our scenario, *FrontEnd*.
	- **-a (or --address-prefix)**. Subnet CIDR block. Four our scenario, *192.168.1.0/24*.

6. Repeat step 5 above to create other subnets, if necessary. For our scenario, run the command below to create the *BackEnd* subnet.

		azure network vnet subnet create -g RG1 -e TestVNet -n BackEnd -a 192.168.2.0/24

4. Run the **azure network vnet show** command to view the properties of the new vnet, as shown below.

		azure network vnet show -g RG1 -n TestVNet

		info:    Executing command network vnet show
		+ Looking up virtual network "TestVNet"
		data:    Id                              : /subscriptions/628dad04-b5d1-4f10-b3a4-dc61d88cf97c/resourceGroups/RG1/providers/Microsoft.Network/virtualNetworks/TestVNet
		data:    Name                            : TestVNet
		data:    Type                            : Microsoft.Network/virtualNetworks
		data:    Location                        : centralus
		data:    ProvisioningState               : Succeeded
		data:    Address prefixes:
		data:      192.168.0.0/16
		data:    Subnets:
		data:      Name                          : FrontEnd
		data:      Address prefix                : 192.168.1.0/24
		data:
		data:      Name                          : BackEnd
		data:      Address prefix                : 192.168.2.0/24
		data:
		info:    network vnet show command OK