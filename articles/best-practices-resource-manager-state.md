<properties
	pageTitle="Handling State in Resource Manager Templates | Microsoft Azure"
	description="Shows recommended approaches for using complex objects to share state data with Azure Resource Manager templates and linked templates"
	services="azure-resource-manager"
	documentationCenter=""
	authors="tfitzmac"
	manager="timlt"
	editor="tysonn"/>

<tags
	ms.service="azure-resource-manager"
	ms.workload="multiple"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/12/2016"
	ms.author="tomfitz"/>

# Sharing state in Azure Resource Manager templates

This topic shows best practices for managing and sharing state within templates. The parameters and variables shown in this topic are examples of the type of objects you can define to conveniently organize your deployment requirements. From these examples, you can implement your own objects with property values that make sense for your environment.

This topic is part of a larger whitepaper. To read the full paper, download [World Class ARM Templates Considerations and Proven Practices](http://download.microsoft.com/download/8/E/1/8E1DBEFA-CECE-4DC9-A813-93520A5D7CFE/World Class ARM Templates - Considerations and Proven Practices.pdf).


## Provide standard configuration settings

Rather than offer a template that provides total flexibility and countless variations, a common pattern is to provide the ability to select known configurations — in effect, standard t-shirt sizes such as sandbox, small, medium, and large. Other examples of t-shirt sizes are product offerings, such as community edition or enterprise edition. In other cases, it may be workload specific configurations of a technology – such as map reduce or no sql.

With complex objects, you can create variables that contain collections of data, sometimes known as "property bags" and use that data to drive the resource declaration in your template. This approach provides good, known configurations of varying sizes that are preconfigured for customers. Without known configurations, end customers must determine cluster sizing on their own, factor in platform resource constraints, and do math to identify the resulting partitioning of storage accounts and other resources (due to cluster size and resource constraints). In addition to making a better experience for the customer, a small number of known configurations is easier to support and can help you deliver a higher level of density.

The following example shows how to define variables that contain complex objects for representing collections of data. The collections define values that are used for virtual machine size, network settings, operating system settings and availability settings.

    "variables": {
      "tshirtSize": "[variables(concat('tshirtSize', parameters('tshirtSize')))]",
      "tshirtSizeSmall": {
        "vmSize": "Standard_A1",
        "diskSize": 1023,
        "vmTemplate": "[concat(variables('templateBaseUrl'), 'database-2disk-resources.json')]",
        "vmCount": 2,
        "storage": {
          "name": "[parameters('storageAccountNamePrefix')]",
          "count": 1,
          "pool": "db",
          "map": [0,0],
          "jumpbox": 0
        }
      },
      "tshirtSizeMedium": {
        "vmSize": "Standard_A3",
        "diskSize": 1023,
        "vmTemplate": "[concat(variables('templateBaseUrl'), 'database-8disk-resources.json')]",
        "vmCount": 2,
        "storage": {
          "name": "[parameters('storageAccountNamePrefix')]",
          "count": 2,
          "pool": "db",
          "map": [0,1],
          "jumpbox": 0
        }
      },
      "tshirtSizeLarge": {
        "vmSize": "Standard_A4",
        "diskSize": 1023,
        "vmTemplate": "[concat(variables('templateBaseUrl'), 'database-16disk-resources.json')]",
        "vmCount": 3,
        "slaveCount": 2,
        "storage": {
          "name": "[parameters('storageAccountNamePrefix')]",
          "count": 2,
          "pool": "db",
          "map": [0,1,1],
          "jumpbox": 0
        }
      },
      "osSettings": {
        "scripts": [
          "[concat(variables('templateBaseUrl'), 'install_postgresql.sh')]",
          "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/shared_scripts/ubuntu/vm-disk-utils-0.1.sh"
        ],
        "imageReference": {
          "publisher": "Canonical",
          "offer": "UbuntuServer",
          "sku": "14.04.2-LTS",
          "version": "latest"
        }
      },
      "networkSettings": {
        "vnetName": "[parameters('virtualNetworkName')]",
        "addressPrefix": "10.0.0.0/16",
        "subnets": {
          "dmz": {
            "name": "dmz",
            "prefix": "10.0.0.0/24",
            "vnet": "[parameters('virtualNetworkName')]"
          },
          "data": {
            "name": "data",
            "prefix": "10.0.1.0/24",
            "vnet": "[parameters('virtualNetworkName')]"
          }
        }
      },
      "availabilitySetSettings": {
        "name": "pgsqlAvailabilitySet",
        "fdCount": 3,
        "udCount": 5
      }
    }

Notice that the **tshirtSize** variable concatenates the t-shirt size you provided through a parameter (**Small**, **Medium**, **Large**) to the text **tshirtSize**. You will use this variable to retrieve the associated complex object variable for that t-shirt size.

You can then reference these variables later in the template. The ability to reference named-variables and their properties simplifies the template syntax, 
and makes it easy to understand context. The following example defines a resource to deploy by using the objects shown above to set values. For example, note that the VM size is set by retrieving the value 
for `variables('tshirtSize').vmSize` while the value for the disk size is retrieved from `variables('tshirtSize').diskSize`. In addition, the URI for a linked template is set with the value for `variables('tshirtSize').vmTemplate`.

    "name": "master-node",
    "type": "Microsoft.Resources/deployments",
    "apiVersion": "2015-01-01",
    "dependsOn": [
        "[concat('Microsoft.Resources/deployments/', 'shared')]"
    ],
    "properties": {
        "mode": "Incremental",
        "templateLink": {
          "uri": "[variables('tshirtSize').vmTemplate]",
          "contentVersion": "1.0.0.0"
        },
        "parameters": {
          "adminPassword": {
            "value": "[parameters('adminPassword')]"
          },
          "replicatorPassword": {
            "value": "[parameters('replicatorPassword')]"
          },
          "osSettings": {
            "value": "[variables('osSettings')]"
          },
          "subnet": {
            "value": "[variables('networkSettings').subnets.data]"
          },
          "commonSettings": {
            "value": {
              "region": "[parameters('region')]",
              "adminUsername": "[parameters('adminUsername')]",
              "namespace": "ms"
            }
          },
          "storageSettings": {
            "value":"[variables('tshirtSize').storage]"
          },
          "machineSettings": {
            "value": {
              "vmSize": "[variables('tshirtSize').vmSize]",
              "diskSize": "[variables('tshirtSize').diskSize]",
              "vmCount": 1,
              "availabilitySet": "[variables('availabilitySetSettings').name]"
            }
          },
          "masterIpAddress": {
            "value": "0"
          },
          "dbType": {
            "value": "MASTER"
          }
        }
      }
    }

## Pass state to a template

You share state into a template through parameters that you provide directly during deployment.

The following table lists commonly-used parameters in templates.

Name | Value | Description
---- | ----- | -----------
location	| String from a constrained list of Azure regions	| The location where the resources will be deployed.
storageAccountNamePrefix	| String	| Unique DNS name for the Storage Account where the VM's disks will be placed
domainName	| String	| Domain name of the publicly accessible jumpbox VM in the format: **{domainName}.{location}.cloudapp.com** For example: **mydomainname.westus.cloudapp.azure.com**
adminUsername	| String	| Username for the VMs
adminPassword	| String	| Password for the VMs
tshirtSize	| String from a constrained list of offered t-shirt sizes	| The named scale unit size to provision. For example, "Small", "Medium", "Large"
virtualNetworkName	| String	| Name of the virtual network that the consumer wants to use.
enableJumpbox	| String from a constrained list (enabled/disabled)	| Parameter that identifies whether to enable a jumpbox for the environment. Values: "enabled", "disabled"

The **tshirtSize** parameter used in the previous section is defined as:

    "parameters": {
      "tshirtSize": {
        "type": "string",
        "defaultValue": "Small",
        "allowedValues": [
          "Small",
          "Medium",
          "Large"
        ],
        "metadata": {
          "Description": "T-shirt size of the MongoDB deployment"
        }
      }
    }


## Pass state to linked templates

When connecting to linked templates, you will often use a mix of static and generated variables.

### Static variables

Static variables are often used to provide base values, such as URLs, that are used throughout a template.

In the template excerpt below, `templateBaseUrl` specifies the root location for the template in GitHub. The next line builds a new variable `sharedTemplateUrl` that concatenates the base URL with the known name of the shared resources template. Below that, a complex object variable is used to store a t-shirt size, where the base URL is 
concatenated to the known configuration template location and stored in the `vmTemplate` property.

The benefit of this approach is that if the template location changes, you only need to change the static variable 
in one place which passes it throughout the linked templates.

    "variables": {
      "templateBaseUrl": "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/postgresql-on-ubuntu/",
      "sharedTemplateUrl": "[concat(variables('templateBaseUrl'), 'shared-resources.json')]",
      "tshirtSizeSmall": {
        "vmSize": "Standard_A1",
        "diskSize": 1023,
        "vmTemplate": "[concat(variables('templateBaseUrl'), 'database-2disk-resources.json')]",
        "vmCount": 2,
        "slaveCount": 1,
        "storage": {
          "name": "[parameters('storageAccountNamePrefix')]",
          "count": 1,
          "pool": "db",
          "map": [0,0],
          "jumpbox": 0
        }
      }
    }

### Generated variables

In addition to static variables, a number of variables are generated dynamically. This section identifies some of the common types of generated variables.

#### tshirtSize

You are familiar with this generated variable from the examples above.

#### networkSettings

In a capacity, capability, or end-to-end scoped solution template, the linked templates typically create resources that exist on a network. One straightforward approach is to use a complex object to store 
network settings and pass them to linked templates.

An example of communicating network settings can be seen below.

    "networkSettings": {
      "vnetName": "[parameters('virtualNetworkName')]",
      "addressPrefix": "10.0.0.0/16",
      "subnets": {
        "dmz": {
          "name": "dmz",
          "prefix": "10.0.0.0/24",
          "vnet": "[parameters('virtualNetworkName')]"
        },
        "data": {
          "name": "data",
          "prefix": "10.0.1.0/24",
          "vnet": "[parameters('virtualNetworkName')]"
        }
      }
    }

#### availabilitySettings

Resources created in linked templates are often placed in an availability set. In the following example, the availability set name is specified and also the fault domain and update domain count to use.

    "availabilitySetSettings": {
      "name": "pgsqlAvailabilitySet",
      "fdCount": 3,
      "udCount": 5
    }

If you need multiple availability sets (for example, one for master nodes and another for data nodes), you can use a name as a prefix, specify multiple availability sets, or follow the model shown earlier 
for creating a variable for a specific t-shirt size.

#### storageSettings

Storage details are often shared with linked templates. In the example below, a *storageSettings* object provides details about the storage account and container names.

    "storageSettings": {
        "vhdStorageAccountName": "[parameters('storageAccountName')]",
        "vhdContainerName": "[variables('vmStorageAccountContainerName')]",
        "destinationVhdsContainer": "[concat('https://', parameters('storageAccountName'), variables('vmStorageAccountDomain'), '/', variables('vmStorageAccountContainerName'), '/')]"
    }

#### osSettings

With linked templates, you may need to pass operating system settings to various nodes types across different known configuration types. A complex object is an easy way to store and share operating system information and also makes 
it easier to support multiple operating system choices for deployment.

The following example shows an object for *osSettings*:

    "osSettings": {
      "imageReference": {
        "publisher": "Canonical",
        "offer": "UbuntuServer",
        "sku": "14.04.2-LTS",
        "version": "latest"
      }
    }

#### machineSettings

A generated variable, *machineSettings* is a complex object containing a mix of core variables for creating a new VM: administrator user name and password, a prefix for the VM names, and an operating 
system image reference as shown below:

    "machineSettings": {
        "adminUsername": "[parameters('adminUsername')]",
        "adminPassword": "[parameters('adminPassword')]",
        "machineNamePrefix": "mongodb-",
        "osImageReference": {
            "publisher": "[variables('osFamilySpec').imagePublisher]",
            "offer": "[variables('osFamilySpec').imageOffer]",
            "sku": "[variables('osFamilySpec').imageSKU]",
            "version": "latest"
        }
    },

Note that *osImageReference* retrieves the values from the *osSettings* variable defined in the main template. That means you can easily change the operating system for a VM—entirely or based 
on the preference of a template consumer.

#### vmScripts

The *vmScripts* object contains details about the scripts to download and execute on a VM instance, including outside and inside references. Outside references include the infrastructure. 
Inside references include the installed software installed and configuration.

You use the *scriptsToDownload* property to list the scripts to download to the VM.

As the example below shows, this object also contains references to command-line arguments for different types of actions. These actions include executing the default installation for 
each individual node, an installation that runs after all nodes are deployed, and any additional scripts that may be specific to a given template.

This example is from a template used to deploy MongoDB, which requires an arbiter to deliver high availability. The *arbiterNodeInstallCommand* has been added to *vmScripts* to install the arbiter.

The variables section is where you’ll find the variables that define the specific text to execute the script with the proper values.

    "vmScripts": {
        "scriptsToDownload": [
            "[concat(variables('scriptUrl'), 'mongodb-', variables('osFamilySpec').osName, '-install.sh')]",
            "[concat(variables('sharedScriptUrl'), 'vm-disk-utils-0.1.sh')]"
        ],
        "regularNodeInstallCommand": "[variables('installCommand')]",
        "lastNodeInstallCommand": "[concat(variables('installCommand'), ' -l')]",
        "arbiterNodeInstallCommand": "[concat(variables('installCommand'), ' -a')]"
    },


## Return state from a template

Not only can you pass data into a template, you can also share data back to the calling template. In the **outputs** section of a linked template, you can provide key/value pairs that can be consumed 
by the source template.

The following example shows how to pass the private IP address generated in a linked template.

    "outputs": {
        "masterip": {
            "value": "[reference(concat(variables('nicName'),0)).ipConfigurations[0].properties.privateIPAddress]",
            "type": "string"
         }
    }

Within the main template, you can use that data with the following syntax:

    "[reference('master-node').outputs.masterip.value]"

You can use this expression in either the outputs section or the resources section of the main template. You cannot use the expression in the variables section because it relies on the runtime state. To return this value from the main template, use:

    "outputs": { 
      "masterIpAddress": {
        "value": "[reference('master-node').outputs.masterip.value]",
        "type": "string"
      }
     
For an example of using the outputs section of a linked template to return data disks for a virtual machine, see [Creating multiple data disks for a Virtual Machine](resource-group-create-multiple.md#creating-multiple-data-disks-for-a-virtual-machine).

## Define authentication settings for virtual machine

You can use the same pattern shown above for configuration settings to specify the authentication settings for a virtual machine. You create a parameter for passing in the type of authentication.

    "parameters": {
      "authenticationType": {
        "allowedValues": [
          "password",
          "sshPublicKey"
        ],
        "defaultValue": "password",
        "metadata": {
          "description": "Authentication type"
        },
        "type": "string"
      }
    }

You add variables for the different authentication types, and a variable to store which type is used for this deployment based on the value of the parameter.

    "variables": {
      "osProfile": "[variables(concat('osProfile', parameters('authenticationType')))]",
      "osProfilepassword": {
        "adminPassword": "[parameters('adminPassword')]",
        "adminUsername": "notused",
        "computerName": "[parameters('vmName')]",
        "customData": "[base64(variables('customData'))]"
      },
      "osProfilesshPublicKey": {
        "adminUsername": "notused",
        "computerName": "[parameters('vmName')]",
        "customData": "[base64(variables('customData'))]",
        "linuxConfiguration": {
          "disablePasswordAuthentication": "true",
          "ssh": {
            "publicKeys": [
              {
                "keyData": "[parameters('sshPublicKey')]",
                "path": "/home/notused/.ssh/authorized_keys"
              }
            ]
          }
        }
      }
    }

When defining the virtual machine, you set the **osProfile** to the variable you created.

    {
      "type": "Microsoft.Compute/virtualMachines",
      ...
      "osProfile": "[variables('osProfile')]"
    }


## Next steps
- To learn about the sections of the template, see [Authoring Azure Resource Manager Templates](resource-group-authoring-templates.md)
- To see the functions that are available within a template, see [Azure Resource Manager Template Functions](resource-group-template-functions.md)

