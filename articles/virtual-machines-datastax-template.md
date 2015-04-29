<properties
	pageTitle="DataStax on Ubuntu Resource Manager Template"
	description="Learn to easily deploy a new DataStax cluster on Ubuntu VMs using Azure PowerShell or the Azure CLI and a Resource Manager template"
	services="multiple"
	documentationCenter=""
	authors="karthmut"
	manager="timlt"
	editor="tysonn"/>

<tags
	ms.service="multiple"
	ms.workload="multiple"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/29/2015"
	ms.author="karthmut"/>

# DataStax on Ubuntu Resource Manager Template

DataStax is a recognize industry leaders in developing and delivering solutions based on commercially supported, enterprise-ready Apache Cassandra™, the open source NoSQL distributed database technology widely-acknowledged to be agile, always-on, and predictably scalable to any size. DataStax is available in both Enterprise (DSE) and Community (DSC), flavors it provides capabilities like in-memory computing, enterprise-level security, fast and powerful integrated analytics and enterprise search.

In addition to what was already available in Azure Marketplace, now you can also easily deploy a new DataStax cluster on Ubuntu VMs using Azure PowerShell or the Azure CLI and a Resource Manager template.

Newly deployed clusters based on this template will have the topology described in the following diagram, although other topologies can be easily achieved by customizing presented approach:

![cluster-architecture](media/virtual-machines-datastax-template/cluster-architecture.png)

Basically, through a parameter you can define the number of nodes that will be deployed in the new Apache Cassandra cluster and, in addition to that, an instance of DataStax Operation Center service will be also deployed in a stand-alone VM within the same VNET, giving you the ability to monitor the status of the cluster and all individual nodes, add/remove nodes, and perform all administrative tasks related that cluster.

Once the deployment is complete you can access the Datastax Operations Center VM instance using the configured DNS address. The OpsCenter VM has SSH port 22 enabled, as well as port 8443 for HTTPS. DNS address for the operations center will include the dnsName and region entered as parameters when creating a deployment based on this template in the format `{dnsName}.{region}.cloudapp.azure.com`. If you created a deployment with the `dnsName` parameter set to “datastax” in the “West US” region you could access the Datastax Operations Center virtual machine for the deployment at `https://datastax.westus.cloudapp.azure.com:8443`.

> [AZURE.NOTE] The certificate used in the deployment is a self-signed certificate that will create a browser warning. You can follow the process on the [Datastax](http://www.datastax.com/) web site for replacing the certificate with your own SSL certificate.

Before diving into more details related to Azure Resource Manager and the template we used for this deployment, make sure you have Azure, PowerShell, and Azure CLI configured and ready to go.

[AZURE.INCLUDE [arm-getting-setup-powershell](../includes/arm-getting-setup-powershell.md)]

[AZURE.INCLUDE [xplat-getting-set-up-arm](../includes/xplat-getting-set-up-arm.md)]

## Create a Cassandra cluster based on DataStax with a Resource Manager template and Azure PowerShell

Follow these steps to create an Apache Cassandra cluster, based on DataStax, using a Resource Manager template in the Github template repository with Azure PowerShell.

### Step 1: Download the JSON file for the template and other files.

Designate a local folder as the location for the JSON template and other files and create it (for example, C:\Azure\Templates\DataStax).

Fill in the folder name and run these commands:

	$folderName="C:\Azure\Templates\DataStax"
	$webclient = New-Object System.Net.WebClient
	$url = "https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/datastax-on-ubuntu/azuredeploy.json"
	$filePath = $folderName + "\azuredeploy.json"
	$webclient.DownloadFile($url,$filePath)
	$url = "https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/datastax-on-ubuntu/azuredeploy-parameters.json"
	$filePath = $folderName + "\azuredeploy-parameters.json"
	$webclient.DownloadFile($url,$filePath)
	$url = "https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/datastax-on-ubuntu/dsenode.sh"
	$filePath = $folderName + "\dsenode.sh"
	$webclient.DownloadFile($url,$filePath)
	$url = "https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/datastax-on-ubuntu/ephemeral-nodes-resources.json"
	$filePath = $folderName + "\ephemeral-nodes-resources.json"
	$webclient.DownloadFile($url,$filePath)
	$url = "https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/datastax-on-ubuntu/metadata.json"
	$filePath = $folderName + "\metadata.json"
	$webclient.DownloadFile($url,$filePath)
	$url = "https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/datastax-on-ubuntu/opscenter-install-resources.json"
	$filePath = $folderName + "\opscenter-install-resources.json"
	$webclient.DownloadFile($url,$filePath)
	$url = "https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/datastax-on-ubuntu/opscenter-resources.json"
	$filePath = $folderName + "\opscenter-resources.json"
	$webclient.DownloadFile($url,$filePath)
	$url = "https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/datastax-on-ubuntu/opscenter.sh"
	$filePath = $folderName + "\opscenter.sh"
	$webclient.DownloadFile($url,$filePath)
	$url = "https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/datastax-on-ubuntu/shared-resources.json"
	$filePath = $folderName + "shared-resources.json"
	$webclient.DownloadFile($url,$filePath)

As an alternative, you can also clone the template repository using a git client of your choice, for example:

	git clone https://github.com/Azure/azure-quickstart-templates C:\Azure\Templates

When completed, look for datastax-on-ubuntu folder in your C:\Azure\Templates.

### Step 2: (optional) Familiarize with template parameters.

When you deploy non trivial solutions like an Apache Cassandra cluster based on DataStax, you must specify a set of configuration parameters to deal with a number of settings required. By declaring these parameters in template definition, it’s possible to specify values during deployment execution through an external file or at command line.

Looking for "parameters" section at the top of the azuredeploy.json file, you’ll find the set of parameters that are required by the template to configure a DataStax cluster. Here is an example of that section in the azuredeploy.json template:

	"parameters": {
		"region": {
			"type": "string",
			"defaultValue": "West US",
			"metadata": {
				"Description": "Location where resources will be provisioned"
			}
		},
		"storageAccountPrefix": {
			"type": "string",
			"defaultValue": "uniqueStorageAccountName",
			"metadata": {
				"Description": "Unique namespace for the Storage Account where the Virtual Machine's disks will be placed"
			}
		},
		"dnsName": {
			"type": "string",
			"metadata" : {
				"Description": "DNS subname for the opserations center public IP"
			}
		},
		"virtualNetworkName": {
			"type": "string",
			"defaultValue": "myvnet",
			"metadata": {
				"Description": "Name of the virtual network provisioned for the cluster"
			}
		},
		"adminUsername": {
			"type": "string",
			"metadata": {
				"Description": "Administrator user name used when provisioning virtual machines"
			}
		},
		"adminPassword": {
			"type": "securestring",
			"metadata": {
				"Description": "Administrator password used when provisioning virtual machines"
			}
		},
		"opsCenterAdminPassword": {
			"type": "securestring",
			"metadata": {
				"Description": "Sets the operations center admin user password"
			}
		},
		"clusterVmSize": {
			"type": "string",
			"defaultValue": "Standard_D3",
			"allowedValues": [
				"Standard_D1",
				"Standard_D2",
				"Standard_D3",
				"Standard_D4",
				"Standard_D11",
				"Standard_D12",
				"Standard_D13",
				"Standard_D14"
			],
			"metadata": {
				"Description": "The size of the virtual machines used when provisioning cluster nodes"
			}
		},
		"clusterNodeCount": {
			"type": "int",
			"metadata": {
				"Description": "The number of nodes provisioned in the cluster"
			}
		},
		"clusterName": {
			"type": "string",
			"metadata": {
				"Description": "The name of the cluster provisioned"
			}
		}
	}

By describing required parameters, including details like data types, allowed values and so on, it’s clear that this section will be really helpful for any validation task related to parameter values passed at template execution in an interactive mode (e.g. PowerShell or Azure CLI), but also to whatever self-discovery UI that could be dynamically built by parsing the list of required parameters and their description.

### Step 3: Deploy new DataStax cluster with the template.

Preparing a parameter file for your deployment means create a JSON file containing runtime values for all parameters, that will then be passed as a single entity to the deployment command.

Here is an example you can find in the azuredeploy-parameters.json file:

	{
		"storageAccountPrefix": {
			"value": "scorianisa"
		},
		"dnsName": {
			"value": "scorianids"
		},
		"virtualNetworkName": {
			"value": "datastax"
		},
		"adminUsername": {
			"value": "scoriani"
		},
		"adminPassword": {
			"value": ""
		},
		"region": {
			"value": "West US"
		},
		"opsCenterAdminPassword": {
			"value": ""
		},
		"clusterVmSize": {
			"value": "Standard_D3"
		},
		"clusterNodeCount": {
			"value": 3
		},
		"clusterName": {
			"value": "cl1"
		}
	}

Fill in an Azure deployment name, Resource Group name, Azure location, the folder for your saved JSON file, and then run these commands:

	$deployName="<deployment name>"
	$RGName="<resource group name>"
	$locName="<Azure location, such as West US>"
	$folderName="<folder name, such as C:\Azure\Templates\DataStax>"
	$templateFile= $folderName + "\azuredeploy.json"
	$templateParameterFile= $folderName + "\azuredeploy-parameters.json"

	New-AzureResourceGroup –Name $RGName –Location $locName

	New-AzureResourceGroupDeployment -Name $deployName -ResourceGroupName $RGName -TemplateParameterFile $templateParameterFile -TemplateFile $templateFile

When you run the **New-AzureResourceGroupDeployment** command, this will extract parameter values from the JSON file, and will start executing template accordingly. Defining and using multiple parameter files with your different environments (e.g. Test, Production, etc.) will promote template reuse and simplify complex multi-environment solutions.

When deploying, please keep in mind that a new Azure Storage Account needs to be created so the name you provide as the storage account parameter needs to be unique and meet all requirements for an Azure Storage Account.

During and after deployment, you can check all the requests that were made during provisioning, including any errors that occurred.  

To do that, go to the [Azure Portal](https://portal.azure.com), and do the following:

- Click “Browse” on the left-hand navigation bar, scroll down and click on “Resource Groups”.  
- After clicking on the Resource Group that you just created, it will bring up the “Resource Group” blade.  
- By clicking on the “Events” bar graph in the “Monitoring” part of the “Resource Group” blade, you can see the events for your deployment:
- Clicking on individual events lets you drill further down into the details of each individual operation made on behalf of the template

After your tests, if you need to remove this resource group and all of its resources (the storage account, virtual machine, and virtual network), use this command:

	Remove-AzureResourceGroup –Name "<resource group name>" -Force

### Step 3-b: Deploy a DataStax cluster with a Resource Manager template using Azure CLI

Functionally equivalent with the PowerShell approach listed above, deploying an Apache Cassandra cluster via Azure CLI require to first create a Resource Group by specifying name and location:

	azure group create dsc "West US"

And subsequently, invoking a deployment creation and passing Resource Group name, parameter file and the actual template as shown below:

	azure group deployment create dsc -f .\azuredeploy.json -e .\azuredeploy-parameters.json

It is also possible to check status of individual deployments by invoking the following command:

	azure group deployment list dsc

## A tour of template structure and file organization created to deploy DataStax on Ubuntu

In order to create a robust and reusable approach to Resource Manager templates design, additional thinking is required to organize the series of complex and interrelated tasks required during deployment of a complex solution like DataStax. Leveraging ARM **template linking** capabilities, **resource looping** in addition to script execution through related extensions, it’s possible to implement a modular approach that can be reused with virtually any complex template-based deployment.

This diagram describes the relationships between all files downloaded from GitHub for this deployment:

![datastax-files](media/virtual-machines-datastax-template/datastax-files.png)

We mentioned already the role of **azuredeploy-parameters.json**, which will be used to pass a given set of parameter values during template execution, but the core of this deployment approach is contained in **azuredeploy.json**. Skipping the parameters section, as we described that before in this document, the following section is represented by **“variables”**. Basically this contains a number of fields (JSON data types or fragments) that will be set to constants or calculated values at execution time, as you can see in the following example:

	"variables": {
	"templateBaseUrl": "https://raw.githubusercontent.com/trentmswanson/azure-quickstart-templates/master/datastax-on-ubuntu/",
	"sharedTemplateUrl": "[concat(variables('templateBaseUrl'), 'shared-resources.json')]",
	"clusterNodesTemplateUrl": "[concat(variables('templateBaseUrl'), 'ephemeral-nodes-resources.json')]",
	"opsCenterTemplateUrl": "[concat(variables('templateBaseUrl'), 'opscenter-resources.json')]",
	"opsCenterInstallTemplateUrl": "[concat(variables('templateBaseUrl'), 'opscenter-install-resources.json')]",
	"opsCenterVmSize": "Standard_A1",
	"networkSettings": {
		"virtualNetworkName": "[parameters('virtualNetworkName')]",
		"addressPrefix": "10.0.0.0/16",
		"subnet": {
			"dse": {
				"name": "dse",
				"prefix": "10.0.0.0/24",
				"vnet": "[parameters('virtualNetworkName')]"
			}
		},
		"statics": {
			"clusterRange": {
				"base": "10.0.0.",
				"start": 5
			},
			"opsCenter": "10.0.0.240"
		}
	},
	"osSettings": {
		"imageReference": {
			"publisher": "Canonical",
			"offer": "UbuntuServer",
			"sku": "14.04.2-LTS",
			"version": "latest"
		},
		"scripts": [
			"[concat(variables('templateBaseUrl'), 'dsenode.sh')]",
			"[concat(variables('templateBaseUrl'), 'opscenter.sh')]",
			"https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/shared_scripts/ubuntu/vm-disk-utils-0.1.sh"
		]
	},
	"sharedStorageAccountName": "[concat(parameters('storageAccountPrefix'),'cmn')]",
	"nodeList": "[concat(variables('networkSettings').statics.clusterRange.base, variables('networkSettings').statics.clusterRange.start, '-', parameters('clusterNodeCount'))]"
	},

Drilling down into this example, you can see two different approaches. In this first fragment, “osSettings” variable will be set to a nested JSON element containing 4 key value pairs:

	"osSettings": {
	      "imageReference": {
	        "publisher": "Canonical",
	        "offer": "UbuntuServer",
	        "sku": "14.04.2-LTS",
	        "version": "latest"
	      },

	 
In this second fragment instead, “scripts” variable is a JSON array where single elements will be calculated at runtime using a template language function (concat) and the value of another variable plus string constants:

	      "scripts": [
	        "[concat(variables('templateBaseUrl'), 'dsenode.sh')]",
	        "[concat(variables('templateBaseUrl'), 'opscenter.sh')]",
	        "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/shared_scripts/ubuntu/vm-disk-utils-0.1.sh"
	      ]

The **"resources"** section is where most of the action is happening. Looking carefully inside this section, you can immediately identify two different cases: the first one is an element defined of type `Microsoft.Resources/deployments` that basically means the invocation of a nested deployment within the main one. Through the `templateLink` element (and related version property) it’s possible to specify a linked template file that will be invoked passing a set of parameters as input, as you can notice in this fragment:

	{
	      "name": "shared",
	      "type": "Microsoft.Resources/deployments",
	      "apiVersion": "2015-01-01",
	      "properties": {
	        "mode": "Incremental",
	        "templateLink": {
	          "uri": "[variables('sharedTemplateUrl')]",
	          "contentVersion": "1.0.0.0"
	        },
	        "parameters": {
	          "region": {
	            "value": "[parameters('region')]"
	          },
	          "networkSettings": {
	            "value": "[variables('networkSettings')]"
	          },
	          "storageAccountName": {
	            "value": "[variables('sharedStorageAccountName')]"
	          }
	        }
	      }
	    },

From this first example is clear how **azuredeploy.json** in this scenario has been organized as an orchestration mechanism, invoking a number of other template files, each one responsible for part of required deployment activities.

In particular, the following linked templates will be used for this deployment:

-	**shared-resource.json**: contains the definition of all resources that will be shared across the deployement. Examples are storage accounts used to store VM’s OS disks or virtual networks.
-	**opscenter-resources.json**: deploys OpsCenter VM and all related resources, like network interface, public IP address and so on.
-	**opscenter-install-resources.json**: deploys OpsCenter VM extension (custom script for Linux) that will invoke the specific bash script file (**opscenter.sh**) required to setup OpsCenter service within that VM.
-	**ephemeral-nodes-resources.json**: deploys all cluster nodes VMs and connected resources (e.g. network cards, private IPs, etc.). This template will also deploy VM extensions (custom scripts for Linux) and invoke a bash script (**dsenode.sh**) to physically install Apache Cassandra bits on each node.

Let’s drill down into this last template, as it is one of the most interesting from a template development perspective. One important concept to highlight is how a single template file can deploy multiple copies of a single resource type, and for each instance can set unique values for required settings. This concept is known as **Resource Looping**.

When **ephemeral-nodes-resources.json** is invoked from within the main **azuredeploy.json** file, in fact, a parameter called **nodeCount** is provided as part of the parameters list. Within the child template, that parameter (number of nodes to deploy in the cluster) will be used inside the **“copy”** element of each resource that needs to be deployed in multiple copies, as highlighted in the fragment below. For all settings where is necessary to specify unique values between different instances of the deployed resource, then the **copyindex()** function can be used to obtain a numeric value indicating the current index in that particular resource loop creation. In the following fragment you can see this concept applied to multiple VMs creation for cluster nodes:

			   {
			      "apiVersion": "2015-05-01-preview",
			      "type": "Microsoft.Compute/virtualMachines",
			      "name": "[concat(parameters('namespace'), 'vm', copyindex())]",
			      "location": "[parameters('region')]",
			      "copy": {
			        "name": "[concat(parameters('namespace'), 'vmLoop')]",
			        "count": "[parameters('nodeCount')]"
			      },
			      "dependsOn": [
			        "[concat('Microsoft.Network/networkInterfaces/', parameters('namespace'), 'nic', copyindex())]",
			        "[concat('Microsoft.Compute/availabilitySets/', parameters('namespace'), 'set')]",
			        "[concat('Microsoft.Storage/storageAccounts/', variables('storageAccountName'))]"
			      ],
			      "properties": {
			        "availabilitySet": {
			          "id": "[resourceId('Microsoft.Compute/availabilitySets', concat(parameters('namespace'), 'set'))]"
			        },
			        "hardwareProfile": {
			          "vmSize": "[parameters('vmSize')]"
			        },
			        "osProfile": {
			          "computername": "[concat(parameters('namespace'), 'vm', copyIndex())]",
			          "adminUsername": "[parameters('adminUsername')]",
			          "adminPassword": "[parameters('adminPassword')]"
			        },
			        "storageProfile": {
			          "imageReference": "[parameters('osSettings').imageReference]",
			          "osDisk": {
			            "name": "osdisk",
			            "vhd": {
			              "uri": "[concat('http://',variables('storageAccountName'),'.blob.core.windows.net/vhds/', variables('vmName'), copyindex(), '-osdisk.vhd')]"
			            },
			            "caching": "ReadWrite",
			            "createOption": "FromImage"
			          },
			          "dataDisks": [
			            {
			              "name": "datadisk1",
			              "diskSizeGB": 1023,
			              "lun": 0,
			              "vhd": {
			                "Uri": "[concat('http://', variables('storageAccountName'),'.blob.core.windows.net/','vhds/', variables('vmName'), copyindex(), 'DataDisk1.vhd')]"
			              },
			              "caching": "None",
			              "createOption": "Empty"
			            }
			          ]
			        },
			        "networkProfile": {
			          "networkInterfaces": [
			            {
			              "id": "[resourceId('Microsoft.Network/networkInterfaces',concat(parameters('namespace'), 'nic', copyindex()))]"
			            }
			          ]
			        }
			      }
			    },

Another important concept in resource creation is the ability to specify dependencies and precedencies between resources, as you can notice in the **dependsOn** JSON array. In this particular template, each node will also have an attached 1TB disk (see `dataDisks`) that can be uses for hosting backups and snapshots from the Apache Cassandra instance.

Attached disks are formatted as part of the node preparation activities triggered by the execution of the **dsenode.sh** script file. The first row of that script in fact is invoking another script:

	bash vm-disk-utils-0.1.sh

vm-disk-utils-0.1.sh is part of the **shared_scripts\ubuntu** folder, within the azure-quickstart-tempates github repo, and contains very useful functions for disk mounting, formatting and striping that can be reused every time you need to execute similar tasks as part of your template creation.

Another interesting fragment to explore, is the one related to CustomScriptForLinux VM extensions. These are installed as a separate type of resource, with a dependency on each cluster node (and in the OpsCenter instance), leveraging the same resource looping mechanism described for virtual machines:

	{
	"type": "Microsoft.Compute/virtualMachines/extensions",
	"name": "[concat(parameters('namespace'), 'vm', copyindex(), '/installdsenode')]",
	"apiVersion": "2015-05-01-preview",
	"location": "[parameters('region')]",
	"copy": {
		"name": "[concat(parameters('namespace'), 'vmLoop')]",
		"count": "[parameters('nodeCount')]"
	},
	"dependsOn": [
		"[concat('Microsoft.Compute/virtualMachines/', parameters('namespace'), 'vm', copyindex())]",
		"[concat('Microsoft.Network/networkInterfaces/', parameters('namespace'), 'nic', copyindex())]"
	],
	"properties": {
		"publisher": "Microsoft.OSTCExtensions",
		"type": "CustomScriptForLinux",
		"typeHandlerVersion": "1.2",
		"settings": {
			"fileUris": "[parameters('osSettings').scripts]",
			"commandToExecute": "bash dsenode.sh"
		}
	}
	}

All other template files required for this deployment are instead creating single instances of all required resources, so can be considered a simple version of this **ephemeral-nodes-resources.json** file.

By familiarizing with the other files included in this deployment, you will be able to understand all the details and best practices required to organize and orchestrate complex deployment strategies for multi nodes solutions, based on any technology, leveraging Azure Resource Manager templates. While not mandatory, a recommended approach is to structure your template files as highlighted by the following diagram:

![datastax-template-structure](media/virtual-machines-datastax-template/datastax-template-structure.png)

In essence, this approach suggests to:

-	Define your core template file as a central orchestration point for all specific deployment activities, leveraging template linking to invoke sub template executions
-	Create a specific template files that will deploy all resources shared across all other specific deployment tasks (e.g. storage accounts, vnet configuration, etc.). This can be heavily reused between deployments that have similar requirements in terms of common infrastructure.
-	Include optional resource templates for spot requirements specific of a given resource
-	For identical members of a group of resources (nodes in a cluster, etc.) create specific templates that leverage resource looping in order to deploy multiple instances with unique properties
-	For all post deployment tasks (e.g. product installation, configurations, etc.) leverage script deployment extensions and create scripts specific to each technology

For more information, see [Azure Resource Manager Template Language](https://msdn.microsoft.com/library/azure/dn835138.aspx).
