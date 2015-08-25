## Download and understand the ARM template

You can download the existing ARM template for creating a VNet and two subnets from github, make any changes you might want, and reuse it. To do so, follow the steps below.

1. Navigate to https://github.com/Azure/azure-quickstart-templates/tree/master/101-two-subnets.
2. Click **azuredeploy.json**, and then click **RAW**.
3. Save the file to a a local folder on your computer.
4. If you are familiar with ARM templates, skip to step 7.
5. Open the file you just saved and look at the contents under **parameters** in line 5. ARM template parameters provide a placeholder for values that can be filled out during deployment.

	| Parameter | Description |
	|---|---|
	| **location** | Azure region where the VNet will be created |
	| **vnetName** | Name for the new VNet |
	| **addressPrefix** | Address space for the VNet, in CIDR format |
	| **subnet1Name** | Name for the first VNet |
	| **subnet1Prefix** | CIDR block for the first subnet |
	| **subnet2Name** | Name for the second VNet |
	| **subnet2Prefix** | CIDR block for the second subnet |

	>[AZURE.IMPORTANT] ARM templates maintained in github can change over time. Make sure you check the template before using it.
	
6. Check the content under **resources** and notice the following:

	- **type**. Type of resource being created by the template. In this case, **Microsoft.Network/virtualNetworks**, which represent a VNet.
	- **name**. Name for the resource. Notice the use of **[parameters('vnetName')]**, which means the name will provided as input by the user or a parameter file during deployment.
	- **properties**. List of properties for the resource. This template uses the address space and subnet properties during VNet creation.

7. Navigate back to https://github.com/Azure/azure-quickstart-templates/tree/master/101-two-subnets.
8. Click **azuredeploy-paremeters.json**, and then click **RAW**.
9. Save the file to a a local folder on your computer.
10. Open the file you just saved and edit the values for the parameters. Use the values below to deploy the VNet described in our scenario.

		{
		  "location": {
		    "value": "Central US"
		  },
		  "vnetName": {
		      "value": "TestVNet"
		  },
		  "addressPrefix": {
		      "value": "192.168.0.0/16"
		  },
		  "subnet1Name": {
		      "value": "FrontEnd"
		  },
		  "subnet1Prefix": {
		    "value": "192.168.1.0/24"
		  },
		  "subnet2Name": {
		      "value": "BackEnd"
		  },
		  "subnet2Prefix": {
		      "value": "192.168.2.0/24"
		  }
		}

11. Save the file.
  