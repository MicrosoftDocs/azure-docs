## Deploy the ARM template by using the Azure CLI

To deploy the ARM template you downloaded by using PowerShell, follow the steps below.

1. If you have never used Azure CLI, see [Install and Configure the Azure CLI](xplat-cli.md) and follow the instructions up to the point where you select your Azure account and subscription.
2. Run the **azure config mode** command to switch to Resource Manager mode, as shown below.

		azure config mode arm

		info:    New mode is arm

3. If necessary, run the **azure group create** to create a new resource group, as shown below. Notice the output of the command. The list shown after the output explains the parameters used. For more information about resource groups, visit [Azure Resource Manager Overview](resource-group-overview.md/#resource-groups).

		azure group create -n TestRG -l centralus
		info:    Executing command group create
		+ Getting resource group TestRG
		+ Creating resource group TestRG
		info:    Created resource group TestRG
		data:    Id:                  /subscriptions/628dad04-b5d1-4f10-b3a4-dc61d88cf97c/resourceGroups/TestRG
		data:    Name:                TestRG
		data:    Location:            centralus
		data:    Provisioning State:  Succeeded
		data:    Tags: null
		data:
		info:    group create command OK

	- **-n (or --name)**. Name for the new resource group. For our scenario, *TestRG*.
	- **-l (or --location)**. Azure region where the new resource group will be created. For our scenario, *centralus*.

4. Run the **azure group deployment create** cmdlet to deploy the new VNet by using the template and parameter files you downloaded and modified above. The list shown after the output explains the parameters used.

		azure group deployment create -g TestRG -n TestVNetDeployment -f C:\ARM\azuredeploy.json -e C:\ARM\azuredeploy-parameters.json

		info:    Executing command group deployment create
		+ Initializing template configurations and parameters
		+ Creating a deployment
		info:    Created template deployment "TestVNetDeployment"
		+ Registering providers
		info:    Registering provider microsoft.network
		+ Waiting for deployment to complete
		data:    DeploymentName     : TestVNetDeployment
		data:    ResourceGroupName  : TestRG
		data:    ProvisioningState  : Succeeded
		data:    Timestamp          : 2015-08-14T21:56:11.152759Z
		data:    Mode               : Incremental
		data:    Name           Type    Value
		data:    -------------  ------  --------------
		data:    location       String  Central US
		data:    vnetName       String  TestVNet
		data:    addressPrefix  String  192.168.0.0/16
		data:    subnet1Prefix  String  192.168.1.0/24
		data:    subnet1Name    String  FrontEnd
		data:    subnet2Prefix  String  192.168.2.0/24
		data:    subnet2Name    String  BackEnd
		info:    group deployment create command OK

	- **-g (or --resource-group)**. Name of the resource group the new VNet will be created in.
	- **-f (or --template-file)**. Path to your ARM template file.
	- **-e (or --parameters-file)**. Path to your ARM parameters file.

5. Run the **azure network vnet show** command to view the properties of the new vnet, as shown below.

		azure network vnet show -g TestRG -n TestVNet

		info:    Executing command network vnet show
		+ Looking up virtual network "TestVNet"
		data:    Id                              : /subscriptions/628dad04-b5d1-4f10-b3a4-dc61d88cf97c/resourceGroups/TestRG/providers/Microsoft.Network/virtualNetworks/TestVNet
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