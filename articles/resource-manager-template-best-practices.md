<properties
	pageTitle="Best practices Resource Manager template | Microsoft Azure"
	description="Guidelines for simplifying your Azure Resource Manager templates."
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
	ms.date="07/15/2016"
	ms.author="tomfitz"/>

# Best practices for creating Azure Resource Manager templates

The following guidelines will help you create Resource Manager templates that are reliable and easy-to-use. These guidelines are intended only as suggestions, not absolute requirements. Your scenario may require variations from these guidelines.

## Resource names

There are generally three types of resource names you will work with:

1. Resource names that must be unique.
2. Resource names that do not need to be unique but you want to provide a name that helps identify the context.
3. Resource names that can be generic.

For help with establishing a naming convention, see [Infrastructure naming guidelines](./virtual-machines/virtual-machines-windows-infrastructure-naming-guidelines.md). For information about resource name restrictions, see [Recommended naming conventions for Azure resources](./guidance/guidance-naming-conventions.md).

### Unique resource names

You must provide a unique resource name for any resource type that has a data access endpoint. Some common types that require a unique name include:

- Storage account
- Web site
- SQL server
- Key vault
- Redis cache
- Batch account
- Traffic manager
- Search service
- HDInsight cluster

Furthermore, storage account names must be lower-case, 24 characters or less, and not include any hyphens.

Rather than providing a parameter for these resource names and trying to guess a unique name during deployment, you can create a variable that uses the [uniqueString()](resource-group-template-functions.md#uniquestring) function to generate a name. Frequently, you will also want to add a prefix or postfix to the **uniqueString** result so you can more easily determine the resource type by looking at the name. For example, you can generate a unique name for a storage account with the following variable.

    "variables": {
        "storageAccountName": "[concat(uniqueString(resourceGroup().id),'storage')]"
    }

Storage accounts with a uniqueString prefix will not get clustered on the same racks.

### Resource names for identification

For resource types that you want to name but you do not have to guarantee uniqueness, simply provide a name that identifies both its context and resource type. You'll want to provide a descriptive name that helps you recognize it from a list of resource names. If you need to vary the resource name during deployments, use a parameter for the name:

    "parameters": {
        "vmName": { 
            "type": "string",
            "defaultValue": "demoLinuxVM",
            "metadata": {
                "description": "The name of the VM to create."
            }
        }
    }

If you do not need to pass in a name during deployment, use a variable: 

    "variables": {
        "vmName": "demoLinuxVM"
    }

Or, a hard-coded value:

    {
      "type": "Microsoft.Compute/virtualMachines",
      "name": "demoLinuxVM",
      ...
    }

### Generic resource names

For resource types that are largely accessed through another resource, you can use a generic name that is hard-coded in the template. For example, you probably do not want to provide a customizable name for firewall rules on a SQL Server.

    {
        "type": "firewallrules",
        "name": "AllowAllWindowsAzureIps",
        ...
    }

## Parameters

1. Minimize parameters whenever possible. If you can use a variable or a literal, do so. Only provide parameters for:
 - Settings you wish to vary by environment (such as sku, size, or capacity).
 - Resource names you wish to specify for easy identification.
 - Values you use often to complete other tasks (such as admin user name).
 - Secrets (such as passwords)
 - The number or array of values to use when creating multiple instances of a resource type.

1. Parameter names should follow **camelCasing**.

1. Provide a description in the metadata for every parameter.

        "parameters": {
            "storageAccountType": {
                "type": "string",
                "metadata": {
                    "description": "The type of the new storage account created to store the VM disks"
                }
            }
        }

1. Define default values for parameters (except for passwords and SSH keys).

        "parameters": {
            "storageAccountType": {
                "type": "string",
                "defaultValue": "Standard_GRS",
                "metadata": {
                    "description": "The type of the new storage account created to store the VM disks"
                }
            }
        }

1. Use **securestring** for all passwords and secrets. 

        "parameters": {
            "secretValue": {
                "type": "securestring",
                "metadata": {
                    "description": "Value of the secret to store in the vault"
                }
            }
        }
 
1. When possible, avoid using a parameter to specify the **location**. Instead, use the location property of the resource group. By using the **resourceGroup().location** expression for all your resources, the resources in the template will be deployed in the same location as the resource group.

        "resources": [
          {
              "name": "[variables('storageAccountName')]",
              "type": "Microsoft.Storage/storageAccounts",
              "apiVersion": "2016-01-01",
              "location": "[resourceGroup().location]",
              ...
          }
        ]
  
     If a resource type is supported in only a limited number of locations, consider specifying a valid location directly in the template. If you must use a location parameter, share that parameter value as much as possible with resources that are likely to be in the same location. This approach minimizes users having to provide locations for every resource type.

1. Avoid using a parameter or variable for the API version for a resource type. Resource properties and values can vary by version number. Intellisense in code editors will not be able to determine the correct schema when the API version is set to a parameter or variable. Instead, hard-code the API version in the template.

## Variables 

1. Use variables for values that you need to use more than once in a template. If a value is used only once, a hard-coded value will make your template easier to read.

1. You cannot use the [reference](resource-group-template-functions.md#reference) function in the variables section. The reference function derives its value from the resource's runtime state, but variables are resolved during the initial parsing of the template. Instead, construct values that need the **reference** function directly in the **resources** or **outputs** section of the template.

1. Include variables for resource names that need to be unique, as shown in [Resource names](#resource-names).

1. You can group variables into complex objects. You can reference a value from a complex object in the format **variable.subentry**. Grouping variables helps you keep track of related variables and improves readability of the template.

        "variables": {
            "storage": {
                "name": "[concat(uniqueString(resourceGroup().id),'storage')]",
                "type": "Standard_LRS"
            }
        },
        "resources": [
          {
              "type": "Microsoft.Storage/storageAccounts",
              "name": "[variables('storage').name]",
              "apiVersion": "2016-01-01",
              "location": "[resourceGroup().location]",
              "sku": {
                  "name": "[variables('storage').type]"
              },
              ...
          }
        ]
 
     > [AZURE.NOTE] A complex object cannot contain an expression that references a value from a complex object. Define a separate variable for this purpose.

     For more advanced examples of using complex objects as variables, see [Sharing state in Azure Resource Manager templates](best-practices-resource-manager-state.md).

## Resources

1. Specify **comments** for each resource in the template to help other contributors understand the purpose of the resource.

        "resources": [
          {
              "name": "[variables('storageAccountName')]",
              "type": "Microsoft.Storage/storageAccounts",
              "apiVersion": "2016-01-01",
              "location": "[resourceGroup().location]",
              "comments": "This storage account is used to store the VM disks",
              ...
          }
        ]

1. Use tags to add metadata to resources that enable you to add additional information about your resources. For example, you can add metadata to a resource for billing detail purposes. For more information, see [Using tags to organize your Azure resources](resource-group-using-tags.md).

1. If you use a **public endpoint** in your template (such as a blob storage public endpoint), **do not hardcode** the namespace. Use the **reference** function to retrieve the namespace dynamically. This allows you to deploy the template to different public namespace environments, without manually changing the endpoint in the template. Set the apiVersion to the same version you are using for the storageAccount in your template.

        "osDisk": {
            "name": "osdisk",
            "vhd": {
                "uri": "[concat(reference(concat('Microsoft.Storage/storageAccounts/', variables('storageAccountName')), '2016-01-01').primaryEndpoints.blob, variables('vmStorageAccountContainerName'), '/',variables('OSDiskName'),'.vhd')]"
            }
        }

     If the storage account is deployed in the same template, you do not need to specify the provider namespace when referencing the resource. The simplified syntax is:
     
        "osDisk": {
            "name": "osdisk",
            "vhd": {
                "uri": "[concat(reference(variables('storageAccountName'), '2016-01-01').primaryEndpoints.blob, variables('vmStorageAccountContainerName'), '/',variables('OSDiskName'),'.vhd')]"
            }
        }

     If you have other values in your template configured with a public namespace, change these to reflect the same reference function. For example, the storageUri property of the virtual machine diagnosticsProfile.

        "diagnosticsProfile": {
            "bootDiagnostics": {
                "enabled": "true",
                "storageUri": "[reference(concat('Microsoft.Storage/storageAccounts/', variables('storageAccountName')), '2016-01-01').primaryEndpoints.blob]"
            }
        }
 
     You can also **reference** an existing storage account in a different resource group.


        "osDisk": {
            "name": "osdisk", 
            "vhd": {
                "uri":"[concat(reference(resourceId(parameters('existingResourceGroup'), 'Microsoft.Storage/storageAccounts/', parameters('existingStorageAccountName')), '2016-01-01').primaryEndpoints.blob,  variables('vmStorageAccountContainerName'), '/', variables('OSDiskName'),'.vhd')]"
            }
        }

1. Assign publicIPAddresses to a virtual machine only when required for an application. To connect for debug, management or administrative purposes, use either inboundNatRules, virtualNetworkGateways or a jumpbox.

     For more information about connecting to virtual machines, see:
     - [Running VMs for an N-tier architecture on Azure](./guidance/guidance-compute-3-tier-vm.md)
     - [Setting up WinRM access for Virtual Machines in Azure Resource Manager](./virtual-machines/virtual-machines-windows-winrm.md)
     - [Allow external access to your VM using the Azure Portal](./virtual-machines/virtual-machines-windows-nsg-quickstart-portal.md)
     - [Allow external access to your VM using PowerShell](./virtual-machines/virtual-machines-windows-nsg-quickstart-powershell.md)
     - [Opening ports and endpoints](./virtual-machines/virtual-machines-linux-nsg-quickstart.md)

1. The **domainNameLabel** property for publicIPAddresses must be unique. domainNameLabel is required to be between 3 and 63 characters long and to follow the rules specified by this regular expression `^[a-z][a-z0-9-]{1,61}[a-z0-9]$`. As the uniqueString function will generate a string that is 13 characters long in the example below it is presumed that the dnsPrefixString prefix string has been checked to be no more than 50 characters long and to conform to those rules.

        "parameters": {
            "dnsPrefixString": {
                "type": "string",
                "maxLength": 50,
                "metadata": {
                    "description": "DNS Label for the Public IP. Must be lowercase. It should match with the following regular expression: ^[a-z][a-z0-9-]{1,61}[a-z0-9]$ or it will raise an error."
                }
            }
        },
        "variables": {
            "dnsPrefix": "[concat(parameters('dnsPrefixString'),uniquestring(resourceGroup().id))]"
        }

1. When adding a password to a **customScriptExtension**, use the **commandToExecute** property in protectedSettings.

        "properties": {
            "publisher": "Microsoft.OSTCExtensions",
            "type": "CustomScriptForLinux",
            "settings": {
                "fileUris": [
                    "[concat(variables('template').assets, '/lamp-app/install_lamp.sh')]"
                ]
            },
            "protectedSettings": {
                "commandToExecute": "[concat('sh install_lamp.sh ', parameters('mySqlPassword'))]"
            }
        }

     > [AZURE.NOTE] In order to ensure that secrets which are passed as parameters to virtualMachines/extensions are encrypted, the protectedSettings property of the relevant extensions must be used.

## Outputs

If a template creates any new **publicIPAddresses** then it should have an **output** section that provides details of the IP address and fully qualified domain created to easily retrieve these details after deployment. When referencing the resource, use the API version that was used to create it. 

```
"outputs": {
    "fqdn": {
        "value": "[reference(resourceId('Microsoft.Network/publicIPAddresses',parameters('publicIPAddressName')), '2016-07-01').dnsSettings.fqdn]",
        "type": "string"
    },
    "ipaddress": {
        "value": "[reference(resourceId('Microsoft.Network/publicIPAddresses',parameters('publicIPAddressName')), '2016-07-01').ipAddress]",
        "type": "string"
    }
}
```

## Single template or nested templates

To deploy your solution, you can use either a single template or a main template with multiple nested templates. Nested templates are common for more advanced scenarios. Nested templates contain the following advantages:

1. Can decompose solution into targeted components
2. Can re-use nested templates with different main templates

When you decide to decompose your template design into multiple nested templates, the following guidelines will help standardize the design. These guidelines are based on the [patterns for designing Azure Resource Manager templates](best-practices-resource-manager-design-templates.md) documentation. The recommended design consists of the following templates.

+ **Main template** (azuredeploy.json). Used for the input parameters.
+ **Shared resources template**. Deploys the shared resources that all other resources use (e.g. virtual network, availability sets). The expression dependsOn enforces that this template is deployed before the other templates.
+ **Optional resources template**. Conditionally deploys resources based on a parameter (e.g. a jumpbox)
+ **Member resources templates**. Each instance type within an application tier has its own configuration. Within a tier, different instance types can be defined (such as, first instance creates a new cluster, additional instances are added to the existing cluster). Each instance type will have its own deployment template.
+ **Scripts**. Widely reusable scripts are applicable for each instance type (e.g. initialize and format additional disks). Custom scripts are created for specific customization purpose are different per instance type.

![nested template](./media/resource-manager-template-best-practices/nestedTemplateDesign.png)

For more information, see [Using linked templates with Azure Resource Manager](resource-group-linked-templates.md).

## Conditionally link to nested template

You can conditionally link to nested templates by using a parameter that becomes part of the URI for the template.

    "parameters": {
        "newOrExisting": {
            "type": "String",
            "allowedValues": [
                "new",
                "existing"
            ]
        }
    },
    "variables": {
        "templatelink": "[concat('https://raw.githubusercontent.com/Contoso/Templates/master/',parameters('newOrExisting'),'StorageAccount.json')]"
    },
    "resources": [
        {
            "apiVersion": "2015-01-01",
            "name": "nestedTemplate",
            "type": "Microsoft.Resources/deployments",
            "properties": {
                "mode": "incremental",
                "templateLink": {
                    "uri": "[variables('templatelink')]",
                    "contentVersion": "1.0.0.0"
                },
                "parameters": {
                }
            }
        }
    ]

## Template format

1. It is a good practice to pass your template through a JSON validator to remove extraneous commas, parenthesis, brackets that may cause an error during deployment. Try [JSONlint](http://jsonlint.com/) or a linter package for your favorite editing environment (Visual Studio Code, Atom, Sublime Text, Visual Studio, etc.)
1. It's also a good idea to format your JSON for better readability. You can use a JSON formatter package for your local editor. In Visual Studio, format the document with **Ctrl+K, Ctrl+D**. In VS Code, use **Alt+Shift+F**. If your local editor doesn't format the document, you can use an [online formatter](https://www.bing.com/search?q=json+formatter).

## Next steps

1. For guidance on architecting your solution for virtual machines, see [Running a Windows VM on Azure](./guidance/guidance-compute-single-vm.md) and [Running a Linux VM on Azure](./guidance/guidance-compute-single-vm-linux.md).
2. For guidance on setting up a storage account, see [Microsoft Azure Storage Performance and Scalability Checklist](./storage/storage-performance-checklist.md).
3. For help with virtual networks, see [Networking infrastructure guidelines](./virtual-machines/virtual-machines-windows-infrastructure-networking-guidelines.md).
