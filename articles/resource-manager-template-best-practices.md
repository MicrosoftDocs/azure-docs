---
title: Best practices Resource Manager template | Microsoft Docs
description: Guidelines for simplifying your Azure Resource Manager templates.
services: azure-resource-manager
documentationcenter: ''
author: tfitzmac
manager: timlt
editor: tysonn

ms.assetid: 31b10deb-0183-47ce-a5ba-6d0ff2ae8ab3
ms.service: azure-resource-manager
ms.workload: multiple
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/25/2016
ms.author: tomfitz

---
# Best practices for creating Azure Resource Manager templates
The following guidelines help you create Resource Manager templates that are reliable and easy-to-use. These guidelines are intended only as suggestions, not absolute requirements. Your scenario may require variations from these guidelines.

## Resource names
There are generally three types of resource names you work with:

1. Resource names that must be unique.
2. Resource names that do not need to be unique but you want to provide a name that helps identify the context.
3. Resource names that can be generic.

For help with establishing a naming convention, see [Infrastructure naming guidelines](virtual-machines/virtual-machines-windows-infrastructure-naming-guidelines.md). For information about resource name restrictions, see [Recommended naming conventions for Azure resources](guidance/guidance-naming-conventions.md).

### Unique resource names
You must provide a unique resource name for any resource type that has a data access endpoint. Some common types that require a unique name include:

* Storage account
* Web site
* SQL server
* Key vault
* Redis cache
* Batch account
* Traffic manager
* Search service
* HDInsight cluster

Furthermore, storage account names must be lower-case, 24 characters or less, and not include any hyphens.

If you provide a parameter for these resource names, you must guess a unique name during deployment. Instead, you can create a variable that uses the [uniqueString()](resource-group-template-functions.md#uniquestring) function to generate a name. Frequently, you also want to add a prefix or postfix to the **uniqueString** result so you can more easily determine the resource type by looking at the name. For example, you generate a unique name for a storage account with the following variable:

    "variables": {
        "storageAccountName": "[concat(uniqueString(resourceGroup().id),'storage')]"
    }

Storage accounts with a uniqueString prefix do not get clustered on the same racks.

### Resource names for identification
For resource types that you want to name but you do not have to guarantee uniqueness, simply provide a name that identifies both its context and resource type. You want to provide a descriptive name that helps you recognize it from a list of resource names. If you need to vary the resource name during deployments, use a parameter for the name:

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
   
   * Settings you wish to vary by environment (such as sku, size, or capacity).
   * Resource names you wish to specify for easy identification.
   * Values you use often to complete other tasks (such as admin user name).
   * Secrets (such as passwords)
   * The number or array of values to use when creating multiple instances of a resource type.
2. Parameter names should follow **camelCasing**.
3. Provide a description in the metadata for every parameter.
   
        "parameters": {
            "storageAccountType": {
                "type": "string",
                "metadata": {
                    "description": "The type of the new storage account created to store the VM disks"
                }
            }
        }
4. Define default values for parameters (except for passwords and SSH keys).
   
        "parameters": {
            "storageAccountType": {
                "type": "string",
                "defaultValue": "Standard_GRS",
                "metadata": {
                    "description": "The type of the new storage account created to store the VM disks"
                }
            }
        }
5. Use **securestring** for all passwords and secrets. 
   
        "parameters": {
            "secretValue": {
                "type": "securestring",
                "metadata": {
                    "description": "Value of the secret to store in the vault"
                }
            }
        }
6. When possible, avoid using a parameter to specify the **location**. Instead, use the location property of the resource group. By using the **resourceGroup().location** expression for all your resources, the resources in the template are deployed in the same location as the resource group.
   
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
7. Avoid using a parameter or variable for the API version for a resource type. Resource properties and values can vary by version number. Intellisense in code editors is not able to determine the correct schema when the API version is set to a parameter or variable. Instead, hard-code the API version in the template.

## Variables
1. Use variables for values that you need to use more than once in a template. If a value is used only once, a hard-coded value makes your template easier to read.
2. You cannot use the [reference](resource-group-template-functions.md#reference) function in the variables section. The reference function derives its value from the resource's runtime state, but variables are resolved during the initial parsing of the template. Instead, construct values that need the **reference** function directly in the **resources** or **outputs** section of the template.
3. Include variables for resource names that need to be unique, as shown in [Resource names](#resource-names).
4. You can group variables into complex objects. You can reference a value from a complex object in the format **variable.subentry**. Grouping variables helps you track related variables and improves readability of the template.
   
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
   
   > [!NOTE]
   > A complex object cannot contain an expression that references a value from a complex object. Define a separate variable for this purpose.
   > 
   > 
   
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
2. Use tags to add metadata to resources that enable you to add additional information about your resources. For example, you can add metadata to a resource for billing detail purposes. For more information, see [Using tags to organize your Azure resources](resource-group-using-tags.md).
3. If you use a **public endpoint** in your template (such as a blob storage public endpoint), **do not hardcode** the namespace. Use the **reference** function to retrieve the namespace dynamically. This approach allows you to deploy the template to different public namespace environments, without manually changing the endpoint in the template. Set the apiVersion to the same version you are using for the storageAccount in your template.
   
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
   
     If you have other values in your template configured with a public namespace, change these values to reflect the same reference function. For example, the storageUri property of the virtual machine diagnosticsProfile.
   
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
   
   * [Running VMs for an N-tier architecture on Azure](guidance/guidance-compute-n-tier-vm.md)
   * [Setting up WinRM access for Virtual Machines in Azure Resource Manager](virtual-machines/virtual-machines-windows-winrm.md)
   * [Allow external access to your VM using the Azure portal](virtual-machines/virtual-machines-windows-nsg-quickstart-portal.md)
   * [Allow external access to your VM using PowerShell](virtual-machines/virtual-machines-windows-nsg-quickstart-powershell.md)
   * [Opening ports and endpoints](virtual-machines/virtual-machines-linux-nsg-quickstart.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
2. The **domainNameLabel** property for publicIPAddresses must be unique. domainNameLabel is required to be between 3 and 63 characters long and to follow the rules specified by this regular expression `^[a-z][a-z0-9-]{1,61}[a-z0-9]$`. As the uniqueString function generates a string that is 13 characters long, the dnsPrefixString parameter is limited to no more than 50 characters.
   
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
3. When adding a password to a **customScriptExtension**, use the **commandToExecute** property in protectedSettings.
   
        "properties": {
            "publisher": "Microsoft.Azure.Extensions",
            "type": "CustomScript",
            "typeHandlerVersion": "2.0",
            "autoUpgradeMinorVersion": true,
            "settings": {
                "fileUris": [
                    "[concat(variables('template').assets, '/lamp-app/install_lamp.sh')]"
                ]
            },
            "protectedSettings": {
                "commandToExecute": "[concat('sh install_lamp.sh ', parameters('mySqlPassword'))]"
            }
        }
   
   > [!NOTE]
   > To ensure that secrets are encrypted when passed as parameters to virtualMachines/extensions, use the protectedSettings property of the relevant extensions.
   > 
   > 

## Outputs
If a template creates **publicIPAddresses**, it should have an **outputs** section that returns details of the IP address and the fully qualified domain name. These output values enable you to easily retrieve these details after deployment. When referencing the resource, use the API version that was used to create it. 

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
2. Can reuse nested templates with different main templates

When you decide to decompose your template design into multiple nested templates, the following guidelines help standardize the design. These guidelines are based on the [patterns for designing Azure Resource Manager templates](best-practices-resource-manager-design-templates.md) documentation. The recommended design consists of the following templates:

* **Main template** (azuredeploy.json). Used for the input parameters.
* **Shared resources template**. Deploys the shared resources that all other resources use (for example, virtual network, availability sets). The expression dependsOn enforces that this template is deployed before the other templates.
* **Optional resources template**. Conditionally deploys resources based on a parameter (for example, a jumpbox)
* **Member resources templates**. Each instance type within an application tier has its own configuration. Within a tier, different instance types can be defined (such as, first instance creates a cluster, additional instances are added to the existing cluster). Each instance type has its own deployment template.
* **Scripts**. Widely reusable scripts are applicable for each instance type (for example, initialize and format additional disks). Custom scripts are created for specific customization purpose are different per instance type.

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
2. It's also a good idea to format your JSON for better readability. You can use a JSON formatter package for your local editor. In Visual Studio, format the document with **Ctrl+K, Ctrl+D**. In VS Code, use **Alt+Shift+F**. If your local editor doesn't format the document, you can use an [online formatter](https://www.bing.com/search?q=json+formatter).

## Next steps
* For guidance on architecting your solution for virtual machines, see [Running a Windows VM on Azure](guidance/guidance-compute-single-vm.md) and [Running a Linux VM on Azure](guidance/guidance-compute-single-vm-linux.md).
* For guidance on setting up a storage account, see [Microsoft Azure Storage Performance and Scalability Checklist](storage/storage-performance-checklist.md).
* For help with virtual networks, see [Networking infrastructure guidelines](virtual-machines/virtual-machines-windows-infrastructure-networking-guidelines.md).
* For guidance on how enterprises can use Resource Manager to effectively manage subscriptions, see [Azure enterprise scaffold - prescriptive subscription governance](resource-manager-subscription-governance.md).

