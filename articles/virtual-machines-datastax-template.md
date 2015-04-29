<properties
	pageTitle="DataStax on Ubuntu Resource Manager Template"
	description="Learn to easily deploy a new DataStax cluster on Ubuntu VMs using Azure PowerShell or the Azure CLI and a Resource Manager template"
	services="virtual-machines"
	documentationCenter=""
	authors="karthmut"
	manager="timlt"
	editor="tysonn"/>

<tags
	ms.service="virtual-machines"
	ms.workload="multiple"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/29/2015"
	ms.author="karthmut"/>

# DataStax on Ubuntu with a Resource Manager Template

DataStax is a recognized industry leader in developing and delivering solutions based on Apache Cassandra™ - the commercially-supported, enterprise-ready NoSQL distributed database technology that is widely-acknowledged as agile, always-on, and predictably scalable to any size. DataStax offers both the Enterprise (DSE) and Community (DSC) flavors. It also provides capabilities like in-memory computing, enterprise-level security, fast and powerful integrated analytics, and enterprise search.

In addition to what is already available in Azure Marketplace, now you can also easily deploy a new DataStax cluster on Ubuntu VMs using a Resource Manager template deployed through [Azure PowerShell](powershell-install-configure.md) or the [Azure CLI](xplat-cli.md).

Newly deployed clusters based on this template will have the topology described in the following diagram, although other topologies can be easily achieved by customizing the template presented in this article:

![cluster-architecture](media/virtual-machines-datastax-template/cluster-architecture.png)

Using parameters, you can define the number of nodes that will be deployed in the new Apache Cassandra cluster. An instance of the DataStax Operation Center service will be also deployed in a stand-alone VM within the same VNET, giving you the ability to monitor the status of the cluster and all individual nodes, add/remove nodes, and perform all administrative tasks related to that cluster.

Once the deployment is complete, you can access the Datastax Operations Center VM instance using the configured DNS address. The OpsCenter VM has SSH port 22 enabled, as well as port 8443 for HTTPS. The DNS address for the operations center will include the *dnsName* and *region* entered as parameters, resulting in the format `{dnsName}.{region}.cloudapp.azure.com`. If you created a deployment with the *dnsName* parameter set to "datastax” in the "West US” region you could access the Datastax Operations Center VM for the deployment at `https://datastax.westus.cloudapp.azure.com:8443`.

> [AZURE.NOTE] The certificate used in the deployment is a self-signed certificate that will create a browser warning. You can follow the process on the [Datastax](http://www.datastax.com/) web site for replacing the certificate with your own SSL certificate.

Before diving into more details related to the Azure Resource Manager and the template we will use for this deployment, make sure you have Azure PowerShell or the Azure CLI configured correctly.

[AZURE.INCLUDE [arm-getting-setup-powershell](../includes/arm-getting-setup-powershell.md)]

[AZURE.INCLUDE [xplat-getting-set-up-arm](../includes/xplat-getting-set-up-arm.md)]

## Create a Datastax-based Cassandra cluster with a Resource Manager template

Follow these steps to create an Apache Cassandra cluster, based on DataStax, using a Resource Manager template from the Github template repository. Each step will include directions for both Azure PowerShell and the Azure CLI.

### Step 1-a: Download the template files using PowerShell

Create a local folder for the JSON template and other associated files (for example, C:\Azure\Templates\DataStax).

Substitute in the folder name of your local folder and run these commands:

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

### Step 1-b: Download the template files using the Azure CLI

Clone the entire template repository using a git client of your choice, for example:

	git clone https://github.com/Azure/azure-quickstart-templates C:\Azure\Templates

When completed, look for the **datastax-on-ubuntu** folder in your C:\Azure\Templates directory.

### Step 2: (optional) Understand the template parameters

When you deploy non-trivial solutions like an Apache Cassandra cluster based on DataStax, you must specify a set of configuration parameters to deal with a number of settings required. By declaring these parameters in the template definition, it’s possible to specify values during deployment through an external file or in the command-line.

In the "parameters" section at the top of the **azuredeploy.json** file, you’ll find the set of parameters that are required by the template to configure a DataStax cluster. Here is an example of the parameters section from this template's azuredeploy.json file:

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

Each parameter has details such as data type and allowed values. This allows for validation of parameters passed during template execution in an interactive mode (e.g. PowerShell or Azure CLI), as well as a self-discovery UI that could be dynamically-built by parsing the list of required parameters and their descriptions.

### Step 3-a: Deploy a DataStax cluster with a template using PowerShell

Prepare a parameters file for your deployment by creating a JSON file containing runtime values for all parameters. This file will then be passed as a single entity to the deployment command. If you do not include a parameters file, PowerShell will use any default values specified in the template, and then prompt you to fill in the remaining values.

Here is an example set of parameters from the **azuredeploy-parameters.json** file:

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

Fill in an Azure deployment name, resource group name, Azure location, and the folder of your saved JSON deployment file. Then run these commands:

	$deployName="<deployment name>"
	$RGName="<resource group name>"
	$locName="<Azure location, such as West US>"
	$folderName="<folder name, such as C:\Azure\Templates\DataStax>"
	$templateFile= $folderName + "\azuredeploy.json"
	$templateParameterFile= $folderName + "\azuredeploy-parameters.json"

	New-AzureResourceGroup –Name $RGName –Location $locName

	New-AzureResourceGroupDeployment -Name $deployName -ResourceGroupName $RGName -TemplateParameterFile $templateParameterFile -TemplateFile $templateFile

When you run the **New-AzureResourceGroupDeployment** command, this will extract parameter values from the JSON parameters file, and will start executing the template accordingly. Defining and using multiple parameter files with your different environments (e.g. Test, Production, etc.) will promote template reuse and simplify complex multi-environment solutions.

When deploying, please keep in mind that a new Azure Storage Account needs to be created so the name you provide as the storage account parameter must be unique and meet all requirements for an Azure Storage Account (lowercase letters and numbers only).

During and after deployment, you can check all the requests that were made during provisioning, including any errors that occurred.  

To do that, go to the [Azure Portal](https://portal.azure.com) and do the following:

- Click "Browse” on the left-hand navigation bar, scroll down and click on "Resource Groups”.  
- After clicking on the Resource Group that you just created, it will bring up the "Resource Group” blade.  
- By clicking on the "Events” bar graph in the "Monitoring” part of the "Resource Group” blade, you can see the events for your deployment:
- Clicking on individual events lets you drill further down into the details of each individual operation made on behalf of the template

After your tests, if you need to remove this resource group and all of its resources (the storage account, virtual machine, and virtual network), use this single command:

	Remove-AzureResourceGroup –Name "<resource group name>" -Force

### Step 3-b: Deploy a DataStax cluster with a template using the Azure CLI

To deploy a Datastax cluster via the Azure CLI, first create a Resource Group by specifying a name and a location:

	azure group create dsc "West US"

Pass this Resource Group name, the location of the JSON template file, and the location of the parameters file (see the above PowerShell section for details) into the following command:

	azure group deployment create dsc -f .\azuredeploy.json -e .\azuredeploy-parameters.json

You can check the status of individual resources deployments with the following command:

	azure group deployment list dsc

## A tour of the Datastax template structure and file organization

In order to design a robust and reusable Resource Manager template, additional thinking is needed to organize the series of complex and interrelated tasks required during the deployment of a complex solution like DataStax. Leveraging ARM **template linking** and **resource looping** in addition to script execution through related extensions, it’s possible to implement a modular approach that can be reused with virtually any complex template-based deployment.

This diagram describes the relationships between all the files downloaded from GitHub for this deployment:

![datastax-files](media/virtual-machines-datastax-template/datastax-files.png)

This section steps you through the structure of the **azuredeploy.json** file for the Datastax cluster.

### "parameters" section

The "parameters" section of **azuredeploy.json** specifies modifiable parameters that are used in this template. The aforementioned **azuredeploy-parameters.json** file is used to pass values into the "parameters" section of azuredeploy.json during template execution.

### "variables" section

The "variables" section specifies variables that can be used throughout this template. This contains a number of fields (JSON data types or fragments) that will be set to constants or calculated values at execution time. Here is the "variables" section for this Datastax template:

	"variables": {
	"templateBaseUrl": "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/datastax-on-ubuntu/",
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

Drilling down into this example, you can see two different approaches. In this first fragment, the "osSettings” variable is a nested JSON element containing 4 key-value pairs:

	"osSettings": {
	      "imageReference": {
	        "publisher": "Canonical",
	        "offer": "UbuntuServer",
	        "sku": "14.04.2-LTS",
	        "version": "latest"
	      },

	 
In this second fragment, the "scripts" variable is a JSON array where each element will be calculated at runtime using a template language function (concat) and the value of another variable plus string constants:

	      "scripts": [
	        "[concat(variables('templateBaseUrl'), 'dsenode.sh')]",
	        "[concat(variables('templateBaseUrl'), 'opscenter.sh')]",
	        "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/shared_scripts/ubuntu/vm-disk-utils-0.1.sh"
	      ]

### "resources" section

The **"resources"** section is where most of the action is happening. Looking carefully inside this section, you can immediately identify two different cases: the first one is an element defined of type `Microsoft.Resources/deployments` that basically means the invocation of a nested deployment within the main one. Through the "templateLink" element (and related version property), it’s possible to specify a linked template file that will be invoked passing a set of parameters as input, as seen in this fragment:

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

From this first example, it is clear how **azuredeploy.json** in this scenario has been organized as a sort of orchestration mechanism, invoking a number of other template files, each one responsible for part of the required deployment activities.

In particular, the following linked templates will be used for this deployment:

-	**shared-resource.json**: contains the definition of all resources that will be shared across the deployment. Examples are storage accounts used to store VM’s OS disks and virtual networks.
-	**opscenter-resources.json**: deploys an OpsCenter VM and all related resources, including a network interface and public IP address.
-	**opscenter-install-resources.json**: deploys the OpsCenter VM extension (custom script for Linux) that will invoke the specific bash script file (**opscenter.sh**) required to setup the OpsCenter service within that VM.
-	**ephemeral-nodes-resources.json**: deploys all cluster node VMs and connected resources (network cards, private IPs, etc.). This template will also deploy VM extensions (custom scripts for Linux) and invoke a bash script (**dsenode.sh**) to physically install Apache Cassandra bits on each node.

Let’s drill down into how this last template is used, as it is one of the most interesting from a template development perspective. One important concept to highlight is how a single template file can deploy multiple copies of a single resource type, and for each instance can set unique values for required settings. This concept is known as **Resource Looping**.

When **ephemeral-nodes-resources.json** is invoked from within the main **azuredeploy.json** file, a parameter called **nodeCount** is provided as part of the parameters list. Within the child template, nodeCount (the number of nodes to deploy in the cluster) will be used inside the **"copy”** element of each resource that needs to be deployed in multiple copies, as highlighted in the fragment below. For all settings where you need unique values for different instances of the deployed resource, the **copyindex()** function can be used to obtain a numeric value indicating the current index in that particular resource loop creation. In the following fragment, you can see this concept applied to multiple VMs being created for the Datastax cluster nodes:

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

Another important concept in resource creation is the ability to specify dependencies and precedencies between resources, as you can see in the **dependsOn** JSON array. In this particular template, each node will also have an attached 1TB disk (see "dataDisks") that can be used for hosting backups and snapshots of the Apache Cassandra instance.

Attached disks are formatted as part of the node preparation activities triggered by the execution of the **dsenode.sh** script file. The first row of that script invokes another script:

	bash vm-disk-utils-0.1.sh

vm-disk-utils-0.1.sh is part of the **shared_scripts\ubuntu** folder in the azure-quickstart-tempates github repo, and contains very useful functions for disk mounting, formatting, and striping. These functions can be used in all templates in the repo.

Another interesting fragment to explore is the one related to CustomScriptForLinux VM extensions. These are installed as a separate type of resource, with a dependency on each cluster node (and the OpsCenter instance). They leverage the same resource looping mechanism described for virtual machines:

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

By familiarizing yourself with the other files included in this deployment, you will be able to understand all the details and best practices required to organize and orchestrate complex deployment strategies for multi-nodes solutions, based on any technology, leveraging Azure Resource Manager templates. While not mandatory, a recommended approach is to structure your template files as highlighted by the following diagram:

![datastax-template-structure](media/virtual-machines-datastax-template/datastax-template-structure.png)

In essence, this approach suggests to:

-	Define your core template file as a central orchestration point for all specific deployment activities, leveraging template linking to invoke sub template executions
-	Create a specific template files that will deploy all resources shared across all other specific deployment tasks (e.g. storage accounts, vnet configuration, etc.). This can be heavily reused between deployments that have similar requirements in terms of common infrastructure.
-	Include optional resource templates for spot requirements specific of a given resource
-	For identical members of a group of resources (nodes in a cluster, etc.) create specific templates that leverage resource looping in order to deploy multiple instances with unique properties
-	For all post deployment tasks (e.g. product installation, configurations, etc.) leverage script deployment extensions and create scripts specific to each technology

For more information, see [Azure Resource Manager Template Language](https://msdn.microsoft.com/library/azure/dn835138.aspx).
