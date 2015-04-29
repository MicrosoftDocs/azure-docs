<properties 
	pageTitle="The High-Availability SharePoint Farm Resource Manager Template" 
	description="Step through the structure of the Azure Resource Manager template for the high-availability SharePoint farm." 
	services="virtual-machines" 
	documentationCenter="" 
	authors="JoeDavies-MSFT" 
	manager="timlt" 
	editor=""/>

<tags 
	ms.service="virtual-machines" 
	ms.workload="infrastructure-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/29/2015" 
	ms.author="josephd"/>

# The High-Availability SharePoint Farm Resource Manager Template

This topic steps you through the structure of the azuredeploy.json template file for the high-availability SharePoint farm.

## "parameters" section

The "parameters" specifies parameters that are used to input data into this template. A maximum of 50 parameters can be defined. Here is an example of a parameter for the Azure location:

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

The "variables" section specifies variables that can be used throughout this template. A maximum of 100 variables can be defined. Here are some examples:

	"RDPNAT":"RDP", 
	"spWebLB":"spWeb", 
	"SQLAOListener":"SQLAlwaysOnEndPointListener", 
	"SQLAOProbe":"SQLAlwaysOnEndPointProbe", 
	"staticSubnetName": "staticSubnet", 
	"sqlSubnetName": "sqlSubnet", 
	"spwebSubnetName": "spwebSubnet", 
	"spappSubnetName": "spappSubnet", 

## "resources" section

The **"resources"** section specifies information that is needed to deploy the resources for the SharePoint farm in a resource group. A maximum of 250 resources can be defined and resource dependencies can only be defined 5 levels deep.

This section contains the following sub-sections:

### Microsoft.Storage/storageAccounts  

This section creates a new storage account for all VHD and disk resources for the farm. Here is the JSON code for the storage account:

	{
	  "type": "Microsoft.Storage/storageAccounts",
	  "name": "[parameters('newStorageAccountName')]",
	  "apiVersion": "2014-12-01-preview",
	  "location": "[parameters('deploymentLocation')]",
	  "properties": {
		"accountType": "[parameters('storageAccountType')]"
	  }
	},

### Microsoft.Network/publicIPAddresses

These sections create a set of public IP addresses through which each virtual machine can be reached over the Internet. Here is an example:

	{
		"apiVersion": "2014-12-01-preview",
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

These sections create four availability sets, one for each tier of the deployment:

- Active Directory domain controllers
- SQL Server cluster
- Application tier servers
- Web tier servers

Here is an example:

	{
		"type": "Microsoft.Compute/availabilitySets",
		"name": "[variables('spAvailabilitySetName')]",
		"apiVersion": "2014-12-01-preview",
		"location": "[parameters('deploymentLocation')]"
	},

### Microsoft.Network/virtualNetworks

This section creates a cloud-only virtual network with four subnets (one for each tier of the deployment), into which the virtual machines are placed. Here is the JSON code:

	{
		"name": "[parameters('virtualNetworkName')]",
		"type": "Microsoft.Network/virtualNetworks",
		"location": "[parameters('deploymentLocation')]",
		"apiVersion": "2014-12-01-preview",
		"properties": {
			"addressSpace": {
			"addressPrefixes": [
				"[parameters('virtualNetworkPrefix')]"
			]
			},
			"subnets": "[variables('subnets')]"
		}
	},



### Microsoft.Network/loadBalancers

These sections creates load balancer instances for each virtual machine to provide NAT and traffic filtering for inbound traffic from the Internet. For each load balancer, settings configure the front end, the back end, and inbound NAT rules. For example, there are Remote Desktop traffic rules for each virtual machine and a rule to allow inbound web traffic (TCP port 80) from the Internet for the web tier servers. Here is the example for the web tier server:

        {
            "apiVersion": "2014-12-01-preview",
            "name": "[variables('splbName')]",
            "type": "Microsoft.Network/loadBalancers",
            "location": "[parameters('deploymentLocation')]",
            "dependsOn": [
                "[resourceId('Microsoft.Network/publicIPAddresses',variables('spIPAddressName'))]"
            ],
            "properties": {
                "frontendIPConfigurations": [
                    {
                        "name": "[variables('spLBFE')]",
                        "properties": {
                            "publicIPAddress": {
                                "id": "[resourceId('Microsoft.Network/publicIPAddresses',variables('spIPAddressName'))]"
                            },
                        }
                    }
                ],
                "backendAddressPools": [
                    {
                        "name": "[variables('spWebLBBE')]"
                    }
                ],
                "loadBalancingRules": [
                    {
                        "name": "[variables('spWebLB')]",
                        "properties": {
                        "frontendIPConfiguration": {
                            "id": "[variables('splbFEConfigID')]"
                        },
                        "probe": {
                            "id": "[variables('spwebProbeID')]"
                        },
                        "protocol": "tcp",
                        "frontendPort": 80,
                        "backendPort": 80,
                        "enableFloatingIP": false
                        }
                    }
                ],
                "probes": [
                    {
                        "name": "[variables('spWebProbe')]",
                        "properties": {
                            "protocol": "http",
                            "port": "[variables('spWebProbePort')]",
                            "intervalInSeconds": "15",
                            "numberOfProbes": "5",
                            "requestPath":"/"
                        }
                    }
                ]
            }
        },

### Microsoft.Network/networkInterfaces

These sections create one network interface for each virtual machine and configures static IP addresses for the domain controllers. Here is the example for the network interface for the primary domain controller:

	{
		"name": "[variables('adPDCNicName')]",
		"type": "Microsoft.Network/networkInterfaces",
		"location": "[parameters('deploymentLocation')]",
		"dependsOn": [
			"[parameters('virtualNetworkName')]",
			"[concat('Microsoft.Network/loadBalancers/',variables('rdpLBName'))]"
		],
		"apiVersion": "2014-12-01-preview",
		"properties": {
			"ipConfigurations": [
				{
					"name": "ipconfig1",
					"properties": {
						"privateIPAllocationMethod": "Static",
						"privateIPAddress" :"[parameters('adPDCNicIPAddress')]",
						"subnet": {
							"id": "[variables('staticSubnetRef')]"
						},
						"loadBalancerBackendAddressPools": [
							{
								"id":"[variables('adBEAddressPoolID')]"
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

These sections create and configure the nine virtual machines in the deployment. 

The first two main sections creates and configures the domain controllers in the deployment. Each section: 

- Specifies the storage account, availability set, network interface, and load balancer instance for each domain controller virtual machine
- Adds an extra disk to each domain controller virtual machine
- Runs the PowerShell script to configure the virtual machines as domain controllers

Here is the example for the primary domain controller:

        {
            "apiVersion": "2014-12-01-preview",
            "type": "Microsoft.Compute/virtualMachines",
            "name": "[variables('adPDCVMName')]",
            "location": "[parameters('deploymentLocation')]",
            "dependsOn": [
                "[resourceId('Microsoft.Storage/storageAccounts',parameters('newStorageAccountName'))]",
                "[resourceId('Microsoft.Network/networkInterfaces',variables('adPDCNicName'))]",
                "[resourceId('Microsoft.Compute/availabilitySets', variables('adAvailabilitySetName'))]",
                "[resourceId('Microsoft.Network/loadBalancers',variables('rdpLBName'))]"
            ],
            "properties": {
                "hardwareProfile": {
                    "vmSize": "[parameters('adVMSize')]"
                },
                "availabilitySet": {
                    "id": "[resourceId('Microsoft.Compute/availabilitySets', variables('adAvailabilitySetName'))]"
                },
                "osProfile": {
                    "computername": "[variables('adPDCVMName')]",
                    "adminUsername": "[parameters('adminUsername')]",
                    "adminPassword": "[parameters('adminPassword')]",
                    "windowsProfile": {
                        "provisionVMAgent": "true"
                    }
                },
                "storageProfile": {
                    "sourceImage": {
                        "id": "[variables('adSourceImageName')]"
                    },
                    "destinationVhdsContainer": "[concat('http://',parameters('newStorageAccountName'),'.blob.core.windows.net/',parameters('vmContainerName'),'/')]",
                    "dataDisks": [
                        {
                            "vhd": {
                                "uri":"[concat('http://',parameters('newStorageAccountName'),'.blob.core.windows.net/',parameters('vmContainerName'),'/', variables('adPDCVMName'),'data-1.vhd')]"
                                },
                            "name":"[concat(variables('adPDCVMName'),'-data-disk1')]",
                            "caching" : "None",
                            "diskSizeGB": "[variables('adDataDiskSize')]",
                            "lun": 0
                        }
                    ]
                },
                "networkProfile": {
                    "networkInterfaces": [
                        {
                            "id": "[resourceId('Microsoft.Network/networkInterfaces',variables('adPDCNicName'))]"
                        }
                    ]
                }
            },
            "resources" :[
                {
                    "type": "Microsoft.Compute/virtualMachines/extensions",
                    "name": "[concat(variables('adPDCVMName'),'/InstallDomainController')]",
                    "apiVersion": "2014-12-01-preview",
                    "location": "[parameters('deploymentLocation')]",
                    "dependsOn":[
                        "[resourceId('Microsoft.Compute/virtualMachines', variables('adPDCVMName'))]"
                    ],
                    "properties": {
                        "publisher": "Microsoft.Powershell",
                        "type": "DSC",
                        "typeHandlerVersion": "1.7",
                        "settings": {
                            "ModulesUrl": "[variables('adPDCModulesURL')]",
                            "ConfigurationFunction": "[variables('adPDCConfigurationFunction')]",
                            "Properties": {
                                "DomainName": "[parameters('domainName')]",
                                "AdminCreds":{
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


An additional section after each domain controller starting with **"name": "UpdateVNetDNS"** configures the DNS servers of the virtual network to use the static IP addresses of the two domain controllers.

The next three **"type": "Microsoft.Compute/virtualMachines"** sections create the SQL Server cluster virtual machines in the deployment. Each section:

- Specifies the storage account, availability set, load balancer, virtual network, and network interface for each virtual machine
- Adds two extra disks to each SQL server

Additional **"Microsoft.Compute/virtualMachines/extensions"** sections call the PowerShell script to configure the SQL Server cluster virtual machines, the SQL server cluster, and enable AlwaysOn Availability Groups.

The next four **"type": "Microsoft.Compute/virtualMachines"** sections create the SharePoint farm virtual machines in the deployment. Each section specifies the storage account, availability set, load balancer, virtual network, and network interface for each virtual machine.

Additional **"Microsoft.Compute/virtualMachines/extensions"** sections call PowerShell scripts to configure the SharePoint servers as a SharePoint farm.

Note the overall organization of the subsections of the **"resources"** section of the JSON file:

1.	Create the elements of Azure infrastructure that are required for supporting multiple virtual machines (a storage account, public IP addresses, availability sets, a virtual network, network interfaces, load balancer instances).
2.	Create the domain controller virtual machines, which use the previously-created common and specific elements of Azure infrastructure, add data disks, and run PowerShell scripts. Additionally, update the virtual network to use the static IP addresses of the domain controllers.
3.	Create the SQL Server cluster virtual machines, which use the previously-created common and specific elements of Azure infrastructure created for the domain controllers, add data disks, and run PowerShell scripts to configure the cluster and SQL Server AlwaysOn Availability Groups.
4.	Create the SharePoint server virtual machines, which use the previously-created common and specific elements of Azure infrastructure, add data disks, and run PowerShell scripts to configure the SharePoint farm.

Your own JSON template to build a multi-tier infrastructure in Azure should follow the same steps:

1.	Create the common (storage account, virtual network), tier-specific (availability sets), and virtual machine-specific (public IP addresses, availability sets, network interfaces, and load balancer instances) elements of Azure infrastructure that are required for your deployment.
2.	For each tier in your application (such as authentication, database, web), create and configure the servers in that tier using the common (storage account, virtual network), tier-specific (availability set) and virtual machine-specific (public IP addresses, network interfaces, load balancer instances) elements.

For more information, see [Azure Resource Manager Template Language](https://msdn.microsoft.com/library/azure/dn835138.aspx).


## Additional Resources

[Azure Compute, Network and Storage Providers under Azure Resource Manager](virtual-machines-azurerm-versus-azuresm.md)

[Azure Resource Manager Overview](resource-group-overview.md)

[Authoring Azure Resource Manager Templates](resource-group-authoring-templates.md)

[Virtual machines documentation](http://azure.microsoft.com/documentation/services/virtual-machines/)

