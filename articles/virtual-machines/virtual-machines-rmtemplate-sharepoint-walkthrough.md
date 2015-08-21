<properties
	pageTitle="The three-server SharePoint farm Resource Manager template"
	description="Step through the structure of the Azure Resource Manager template for the three-server SharePoint farm."
	services="virtual-machines"
	documentationCenter=""
	authors="JoeDavies-MSFT"
	manager="timlt"
	editor=""
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines"
	ms.workload="infrastructure-services"                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            ms.tgt_pltfrm="vm-windows-sharepoint"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/28/2015"
	ms.author="davidmu"/>

# The three-server SharePoint farm Resource Manager template

This topic steps you through the structure of the azuredeploy.json template file for the three-server SharePoint farm. You can see the contents of this template in your browser from [here](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/sharepoint-three-vm/azuredeploy.json).

Alternately, to examine a local copy of the azuredeploy.json file, designate a local folder as the location for the file, and then create it (for example, C:\Azure\Templates\SharePointFarm). Fill in the folder name and run these commands at the Azure PowerShell command prompt.

	$folderName="<folder name, such as C:\Azure\Templates\SharePointFarm>"
	$webclient = New-Object System.Net.WebClient
	$url = "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/sharepoint-three-vm/azuredeploy.json"
	$filePath = $folderName + "\azuredeploy.json"
	$webclient.DownloadFile($url,$filePath)

Open the azuredeploy.json template in a text editor or tool of your choice. The following describes the structure of the template file and the purpose of each section.

## "parameters" section

The **"parameters"** section specifies parameters that are used to input data into a template. You must supply the data when the template is executed. A maximum of 50 parameters can be defined. Here is an example of a parameter for the Azure location:

	"deploymentLocation": {
		"type": "string",
		"allowedValues": [
			"West US",
			"East US",
			"West Europe",
			"East Asia",
			"Southeast Asia"
		],
		"metadata": {
			"Description": "The region to deploy the resources into"
		},
		"defaultValue":"West Europe"
	},

## "variables" section

The **"variables"** section specifies variables and their values that the template uses. Variable values can be explicitly set or be derived from parameter values. In contrast to parameters, you do not supply them when you execute the template. A maximum of 100 variables can be defined. Here are some examples:

	"LBFE": "LBFE",
	"LBBE": "LBBE",
	"RDPNAT": "RDP",
	"spWebNAT": "spWeb",
	"adSubnetName": "adSubnet",
	"sqlSubnetName": "sqlSubnet",
	"spSubnetName": "spSubnet",
	"adNicName": "adNic",
	"sqlNicName": "sqlNic",
	"spNicName": "spNic",

## "resources" section

The **"resources"** section specifies information that is needed to deploy the resources for the SharePoint farm in a resource group. A maximum of 250 resources can be defined, and resource dependencies can only be defined 5 levels deep.

This section contains the following subsections:

### Microsoft.Storage/storageAccounts  

This section creates a new storage account for all VHD and disk resources for the farm. Here is the JSON code for the storage account:

	{
	  "type": "Microsoft.Storage/storageAccounts",
	  "name": "[parameters('newStorageAccountName')]",
	  "apiVersion": "2015-05-01-preview",
	  "location": "[parameters('deploymentLocation')]",
	  "properties": {
		"accountType": "[parameters('storageAccountType')]"
	  }
	},

### Microsoft.Network/publicIPAddresses

These sections create a set of public IP addresses through which each virtual machine can be reached over the Internet. Here is an example:

	{
		"apiVersion": "2015-05-01-preview",
		"type": "Microsoft.Network/publicIPAddresses",
		"name": "[variables('adpublicIPAddressName')]",
		"location": "[parameters('deploymentLocation')]",
		"properties": {
			"publicIPAllocationMethod": "[parameters('publicIPAddressType')]",
			"dnsSettings": {
				"domainNameLabel": "[parameters('adDNSPrefix')]"
			}
		}
	},

### Microsoft.Compute/availabilitySets

These sections create three availability sets, one for each tier of the deployment:

- Active Directory domain controllers
- SQL Server cluster
- SharePoint Servers

Here is an example:

	{
		"type": "Microsoft.Compute/availabilitySets",
		"name": "[variables('spAvailabilitySetName')]",
		"apiVersion": "2015-05-01-preview",
		"location": "[parameters('deploymentLocation')]"
	},

### Microsoft.Network/virtualNetworks

These sections create a cloud-only virtual network with three subnets (one for each tier of the deployment), into which the virtual machines are placed. Here is the JSON code:

	{
		"name": "[parameters('virtualNetworkName')]",
		"type": "Microsoft.Network/virtualNetworks",
		"location": "[parameters('deploymentLocation')]",
		"apiVersion": "2015-05-01-preview",
		"properties": {
			"addressSpace": {
			"addressPrefixes": [
				"[parameters('virtualNetworkAddressRange')]"
			]
			},
			"subnets": "[variables('subnets')]"
		}
	},


### Microsoft.Network/loadBalancers

These sections create load balancer instances for each virtual machine to provide Network Address Translation (NAT) and traffic filtering for inbound traffic from the Internet. For each load balancer, settings configure the front end, the back end, and inbound NAT rules. For example, there are Remote Desktop traffic rules for each virtual machine and, for the SharePoint Server, a rule to allow inbound web traffic (TCP port 80) from the Internet. Here is the example for the SharePoint Server:


	{
		"apiVersion": "2015-05-01-preview",
		"name": "[variables('spLBName')]",
		"type": "Microsoft.Network/loadBalancers",
		"location": "[parameters('deploymentLocation')]",
		"dependsOn": [
			"[resourceId('Microsoft.Network/publicIPAddresses',variables('sppublicIPAddressName'))]"
		],
		"properties": {
			"frontendIPConfigurations": [
				{
					"name": "[variables('LBFE')]",
					"properties": {
						"publicIPAddress": {
							"id": "[resourceId('Microsoft.Network/publicIPAddresses',variables('sppublicIPAddressName'))]"
						}
					}
				}
			],
			"backendAddressPools": [
				{
					"name": "[variables('LBBE')]"
				}
			],
			"inboundNatRules": [
				{
					"name": "[variables('RDPNAT')]",
					"properties": {
						"frontendIPConfiguration": {
							"id": "[variables('splbFEConfigID')]"
						},
						"protocol": "tcp",
						"frontendPort": "[parameters('RDPPort')]",
						"backendPort": 3389,
						"enableFloatingIP": false
					}
				},
				{
					"name": "[variables('spWebNAT')]",
					"properties": {
						"frontendIPConfiguration": {
							"id": "[variables('splbFEConfigID')]"
						},
						"protocol": "tcp",
						"frontendPort": 80,
						"backendPort": 80,
						"enableFloatingIP": false
					}
				}
			]
		}
	},

### Microsoft.Network/networkInterfaces

These sections create one network interface for each virtual machine and configure a static IP address for the domain controller. Here is the example for the network interface of the domain controller:

	{
		"name": "[variables('adNicName')]",
		"type": "Microsoft.Network/networkInterfaces",
		"location": "[parameters('deploymentLocation')]",
		"dependsOn": [
			"[parameters('virtualNetworkName')]",
			"[concat('Microsoft.Network/loadBalancers/',variables('adlbName'))]"
		],
		"apiVersion": "2015-05-01-preview",
		"properties": {
			"ipConfigurations": [
				{
					"name": "ipconfig1",
					"properties": {
						"privateIPAllocationMethod": "Static",
						"privateIPAddress": "[parameters('adNicIPAddress')]",
						"subnet": {
							"id": "[variables('adSubnetRef')]"
						},
						"loadBalancerBackendAddressPools": [
							{
								"id": "[variables('adBEAddressPoolID')]"
							}
						],
						"loadBalancerInboundNatRules": [
							{
								"id": "[variables('adRDPNATRuleID')]"
							}
						]
					}
				}
			]
		}
	},


### Microsoft.Compute/virtualMachines

These sections create and configure the three virtual machines in the deployment.

The first section creates and configures the domain controller, which:

- Specifies the storage account, availability set, network interface, and load balancer instance.
- Adds an extra disk.
- Runs a PowerShell script to configure the domain controller.

Here is the JSON code:

		{
			"apiVersion": "2015-05-01-preview",
			"type": "Microsoft.Compute/virtualMachines",
			"name": "[parameters('adVMName')]",
			"location": "[parameters('deploymentLocation')]",
			"dependsOn": [
				"[resourceId('Microsoft.Storage/storageAccounts',parameters('newStorageAccountName'))]",
				"[resourceId('Microsoft.Network/networkInterfaces',variables('adNicName'))]",
				"[resourceId('Microsoft.Compute/availabilitySets', variables('adAvailabilitySetName'))]",
				"[resourceId('Microsoft.Network/loadBalancers',variables('adlbName'))]"
			],
			"properties": {
				"hardwareProfile": {
					"vmSize": "[parameters('adVMSize')]"
				},
				"availabilitySet": {
					"id": "[resourceId('Microsoft.Compute/availabilitySets', variables('adAvailabilitySetName'))]"
				},
				"osProfile": {
					"computername": "[parameters('adVMName')]",
					"adminUsername": "[parameters('adminUsername')]",
					"adminPassword": "[parameters('adminPassword')]"
				},
				"storageProfile": {
					"imageReference": {
						"publisher": "[parameters('adImagePublisher')]",
						"offer": "[parameters('adImageOffer')]",
						"sku": "[parameters('adImageSKU')]",
						"version": "latest"
					},
					"osDisk": {
						"name": "osdisk",
						"vhd": {
							"uri": "[concat('http://',parameters('newStorageAccountName'),'.blob.core.windows.net/',parameters('vmContainerName'),'/',parameters('adVMName'),'-osdisk.vhd')]"
						},
						"caching": "ReadWrite",
						"createOption": "FromImage"
					},
					"dataDisks": [
						{
							"vhd": {
								"uri": "[concat('http://',parameters('newStorageAccountName'),'.blob.core.windows.net/',parameters('vmContainerName'),'/', variables('adDataDisk'),'-1.vhd')]"
							},
							"name": "[concat(parameters('adVMName'),'-data-disk1')]",
							"caching": "None",
							"createOption": "empty",
							"diskSizeGB": "[variables('adDataDiskSize')]",
							"lun": 0
						}
					]
				},
				"networkProfile": {
					"networkInterfaces": [
						{
							"id": "[resourceId('Microsoft.Network/networkInterfaces',variables('adNicName'))]"
						}
					]
				}
			},
			"resources": [
				{
					"type": "Microsoft.Compute/virtualMachines/extensions",
					"name": "[concat(parameters('adVMName'),'/InstallDomainController')]",
					"apiVersion": "2015-05-01-preview",
					"location": "[parameters('deploymentLocation')]",
					"dependsOn": [
						"[resourceId('Microsoft.Compute/virtualMachines', parameters('adVMName'))]"
					],
					"properties": {
						"publisher": "Microsoft.Powershell",
						"type": "DSC",
						"typeHandlerVersion": "1.7",
						"settings": {
							"ModulesUrl": "[variables('adModulesURL')]",
							"ConfigurationFunction": "[variables('adConfigurationFunction')]",
							"Properties": {
								"DomainName": "[parameters('domainName')]",
								"AdminCreds": {
									"UserName": "[parameters('adminUserName')]",
									"Password": "PrivateSettingsRef:AdminPassword"
								}
							}
						},
						"protectedSettings": {
							"Items": {
								"AdminPassword": "[parameters('adminPassword')]"
							}
						}
					}
				}
			]
		},

An additional section for the domain controller starting with **"name": "UpdateVNetDNS"** configures the DNS server of the virtual network to use the static IP address of the domain controller.

The next **"type": "Microsoft.Compute/virtualMachines"** section creates the SQL Server virtual machines in the deployment and:

- Specifies the storage account, availability set, load balancer, virtual network, and network interface.
- Adds an extra disk.

Additional **"Microsoft.Compute/virtualMachines/extensions"** sections call the PowerShell script to configure the SQL Server.

The next **"type": "Microsoft.Compute/virtualMachines"** section creates the SharePoint virtual machine in the deployment, specifying the storage account, availability set, load balancer, virtual network, and network interface. An additional **"Microsoft.Compute/virtualMachines/extensions"** section calls a PowerShell script to configure the SharePoint farm.

Note the overall organization of the subsections of the **"resources"** section of the JSON file:

1.	Create the elements of Azure infrastructure that are required for supporting multiple virtual machines (a storage account, public IP addresses, availability sets, a virtual network, network interfaces, and load balancer instances).
2.	Create the domain controller virtual machine, which uses the previously created common and specific elements of Azure infrastructure, adds a data disk, and runs a PowerShell script. Additionally, update the virtual network to use the static IP address of the domain controller.
3.	Create the SQL Server virtual machine, which uses the previously created common and specific elements of the Azure infrastructure created for the domain controller, adds data disks, and runs a PowerShell script to configure the SQL Server.
4.	Create the SharePoint Server virtual machine, which uses the previously created common and specific elements of the Azure infrastructure and runs a PowerShell script to configure the SharePoint farm.

Your own JSON template to build a multi-tier infrastructure in Azure should follow the same steps:

1.	Create the common (storage account, virtual network), tier-specific (availability sets), and virtual machine-specific (public IP addresses, availability sets, network interfaces, load balancer instances) elements of Azure infrastructure that are required for your deployment.
2.	For each tier in your application (such as authentication, database, web), create and configure the servers in that tier using the common (storage account, virtual network), tier-specific (availability set) and virtual machine-specific (public IP addresses, network interfaces, load balancer instances) elements.

For more information, see [Azure Resource Manager template language](../resource-group-authoring-templates.md).

## Additional resources

[Azure compute, network, and storage providers under Azure Resource Manager](virtual-machines-azurerm-versus-azuresm.md)
[Azure Resource Manager overview](../resource-group-overview.md)

[Authoring Azure Resource Manager templates](../resource-group-authoring-templates.md)

[Virtual machines documentation](http://azure.microsoft.com/documentation/services/virtual-machines/)
