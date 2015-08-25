## How to create a classic VNet using Azure CLI

You can use the Azure CLI to manage your Azure resources from the command prompt from any computer running Windows, Linux, or OSX. To create a VNet by using the Azure CLI, follow the steps below.

1. If you have never used Azure CLI, see [Install and Configure the Azure CLI](xplat-cli.md) and follow the instructions up to the point where you select your Azure account and subscription.
2. Run the **azure network vnet create** command to create a VNet and a subnet, as shown below. Notice the output from the CLI command. The list shown after the output explains the parameters used.

			azure network vnet create --vnet TestVNet -e 192.168.0.0 -i 16 -n FrontEnd -p 192.168.1.0 -r 24 -l "Central US"
	
			info:    Executing command network vnet create
			+ Looking up network configuration
			+ Looking up locations
			+ Setting network configuration
			info:    network vnet create command OK

	- **--vnet**. Name of the VNet to be created. For our scenario, *TestVNet*
	- **-e (or --address-space)**. VNet address space. For our scenario, *192.168.0.0*
	- **-i (or -cidr)**. Network mask in CIDR format. For our scenario, *16*.
	- **-n (or --subnet-name**). Name of the first subnet. For our scenario, *FrontEnd*.
	- **-p (or --subnet-start-ip)**. Starting IP address for subnet, or subnet address space. For our scenario, *192.168.1.0*.
	- **-r (or --subnet-cidr)**. Network mask in CIDR format for subnet. For our scenario, *24*.
	- **-l (or --location)**. Azure region where the VNet will be created. For our scenario, *Central US*.

3. Run the **azure network vnet subnet create** command to create a subnet as shown below. Notice the output of the command. The list shown after the output explains the parameters used.

			azure network vnet subnet create -t TestVNet -n BackEnd -a 192.168.2.0/24
	
			info:    Executing command network vnet subnet create
			+ Looking up network configuration
			+ Creating subnet "BackEnd"
			+ Setting network configuration
			+ Looking up the subnet "BackEnd"
			+ Looking up network configuration
			data:    Name                            : BackEnd
			data:    Address prefix                  : 192.168.2.0/24
			info:    network vnet subnet create command OK

	- **-t (or --vnet-name**. Name of the VNet where the subnet will be created. For our scenario, *TestVNet*.
	- **-n (or --name)**. Name of the new subnet. For our scenario, *BackEnd*.
	- **-a (or --address-prefix)**. Subnet CIDR block. Four our scenario, *192.168.2.0/24*.

4. Run the **azure network vnet show** command to view the properties of the new vnet, as shown below.

			azure network vnet show

			info:    Executing command network vnet show
			Virtual network name: TestVNet
			+ Looking up the virtual network sites
			data:    Name                            : TestVNet
			data:    Location                        : Central US
			data:    State                           : Created
			data:    Address space                   : 192.168.0.0/16
			data:    Subnets:
			data:      Name                          : FrontEnd
			data:      Address prefix                : 192.168.1.0/24
			data:
			data:      Name                          : BackEnd
			data:      Address prefix                : 192.168.2.0/24
			data:
			info:    network vnet show command OK