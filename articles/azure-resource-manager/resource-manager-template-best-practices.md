---
title: Best practices for creating Resource Manager templates | Microsoft Docs
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
ms.date: 03/31/2017
ms.author: tomfitz

---
# Best practices for creating Azure Resource Manager templates
These guidelines can help you create Azure Resource Manager templates that are reliable and easy to use. These guidelines are not requirements. They are only suggestions. For your scenario, you might want to use a variation of these guidelines.

## Resource names
Generally, you work with three types of resource names in Resource Manager:

* Resource names that must be unique.
* Resource names that are not required to be unique, but you choose to provide a name that helps you identify the context.
* Resource names that can be generic.

For help establishing a naming conventions, see [Infrastructure naming guidelines](../virtual-machines/windows/infrastructure-naming-guidelines.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). For information about resource name restrictions, see [Recommended naming conventions for Azure resources](../guidance/guidance-naming-conventions.md).

### Unique resource names
You must provide a unique resource name for any resource type that has a data access endpoint. Some common resource types that require a unique name include:

* Storage account 
* Web site
* SQL Server
* Azure Key Vault
* Azure Redis Cache
* Azure Batch account
* Azure Traffic Manager
* Search service
* Azure HDInsight cluster

Storage account names also must be lowercase, 24 characters or less, and not have any hyphens.

If you provide a parameter for these resource names, you must provide a unique name when you deploy the resource. Optionally, to generate a name, you can create a variable that uses the [uniqueString()](resource-group-template-functions.md#uniquestring) function. 

You also might want to add a prefix to or append the **uniqueString** result. Altering the unique name can help you more easily determine the resource type by looking at the name. For example, you can generate a unique name for a storage account with the following variable:

```json
"variables": {
    "storageAccountName": "[concat(uniqueString(resourceGroup().id),'storage')]"
}
```

### Resource names for identification
For resource types that you want to name but which are not required to be unique, you can provide a name that identifies both context and resource type. You want to provide a descriptive name that helps you recognize it in a list of resources. To vary the resource name when you deploy a resource, you can use a parameter for the name:

```json
"parameters": {
    "vmName": { 
        "type": "string",
        "defaultValue": "demoLinuxVM",
        "metadata": {
            "description": "The name of the VM to create."
        }
    }
}
```

If you do not need to pass in a name during deployment, use a variable: 

```json
"variables": {
    "vmName": "demoLinuxVM"
}
```

You also can pass in a hard-coded value:

```json
{
  "type": "Microsoft.Compute/virtualMachines",
  "name": "demoLinuxVM",
  ...
}
```

### Generic resource names
For resource types that are primarily accessed through a different resource, you can use a generic name that is hard-coded in the template. For example, you probably do not want to provide a customizable name for firewall rules on a SQL server.

```json
{
    "type": "firewallrules",
    "name": "AllowAllWindowsAzureIps",
    ...
}
```

## Parameters
The following information can be helpful when you work with parameters:

* Minimize your use of parameters. Whenever possible, use a variable or a literal value. Provide parameters only for these scenarios:
   
   * Settings you want to use variations of, by environment (such as SKU, size, or capacity).
   * Resource names you want to specify for easy identification.
   * Values you use often to complete other tasks (such as an admin user name).
   * Secrets (such as passwords).
   * The number or array of values to use when you create multiple instances of a resource type.
* Use camel case for parameter names.
* Provide a description in the metadata for every parameter.

   ```json
   "parameters": {
       "storageAccountType": {
           "type": "string",
           "metadata": {
               "description": "The type of the new storage account created to store the VM disks."
           }
       }
   }
   ```

* Define default values for parameters (except for passwords and SSH keys).
   
   ```json
   "parameters": {
        "storageAccountType": {
            "type": "string",
            "defaultValue": "Standard_GRS",
            "metadata": {
                "description": "The type of the new storage account created to store the VM disks."
            }
        }
   }
   ```

* Use **SecureString** for all passwords and secrets. 
   
   ```json
   "parameters": {
       "secretValue": {
           "type": "securestring",
           "metadata": {
               "description": "Value of the secret to store in the vault"
           }
       }
   }
   ```

* When possible, avoid using a parameter to specify location. Instead, use the **location** property of the resource group. By using the **resourceGroup().location** expression for all your resources, resources in the template are deployed in the same location as the resource group.
   
   ```json
   "resources": [
     {
         "name": "[variables('storageAccountName')]",
         "type": "Microsoft.Storage/storageAccounts",
         "apiVersion": "2016-01-01",
         "location": "[resourceGroup().location]",
         ...
     }
   ]
   ```
   
   If a resource type is supported in only a limited number of locations, you might want to specify a valid location directly in the template. If you must use a **location** parameter, share that parameter value as much as possible with resources that are likely to be in the same location. This approach minimizes the number of times users are asked to provide location information.
* Avoid using a parameter or variable for the API version for a resource type. Resource properties and values can vary by version number. Intellisense in code editors is not able to determine the correct schema when the API version is set to a parameter or variable. Instead, hard-code the API version in the template.

## Variables
The following information can be helpful when you work with variables:

* Use variables for values that you need to use more than once in a template. If a value is used only once, a hard-coded value makes your template easier to read.
* You cannot use the [reference](resource-group-template-functions.md#reference) function in the **variables** section of the template. The **reference** function derives its value from the resource's runtime state. However, variables are resolved during the initial parsing of the template. Instead, construct values that need the **reference** function directly in the **resources** or **outputs** section of the template.
* Include variables for resource names that need to be unique, as shown in [Resource names](#resource-names).
* You can group variables into complex objects. You can reference a value from a complex object in the format **variable.subentry**. Grouping variables can help you track related variables. It also improves readability of the template.
   
   ```json
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
   ```
   
   > [!NOTE]
   > A complex object cannot contain an expression that references a value from a complex object. Define a separate variable for this purpose.
   > 
   > 
   
     For more advanced examples of using complex objects as variables, see [Sharing state in Azure Resource Manager templates](best-practices-resource-manager-state.md).

## Resources
The following information can be helpful when you work with resources:

* To help other contributors understand the purpose of the resource, specify **comments** for each resource in the template.
   
   ```json
   "resources": [
     {
         "name": "[variables('storageAccountName')]",
         "type": "Microsoft.Storage/storageAccounts",
         "apiVersion": "2016-01-01",
         "location": "[resourceGroup().location]",
         "comments": "This storage account is used to store the VM disks.",
         ...
     }
   ]
   ```

* You can use tags to add metadata to resources. Use metadata to add information about your resources. For example, you can add metadata to record billing details for a resource. For more information, see [Using tags to organize your Azure resources](resource-group-using-tags.md).
* If you use a **public endpoint** in your template (such as an Azure Blob storage public endpoint), *do not hard-code* the namespace. Use the **reference** function to dynamically retrieve the namespace. You can use this approach to deploy the template to different public namespace environments without manually changing the endpoint in the template. Set the **apiVersion** value to the same version you are using for the **storageAccount** property in your template.
   
   ```json
   "osDisk": {
       "name": "osdisk",
       "vhd": {
           "uri": "[concat(reference(concat('Microsoft.Storage/storageAccounts/', variables('storageAccountName')), '2016-01-01').primaryEndpoints.blob, variables('vmStorageAccountContainerName'), '/',variables('OSDiskName'),'.vhd')]"
       }
   }
   ```
   
   If the storage account is deployed in the same template you are creating, you do not need to specify the provider namespace when you reference the resource. The simplified syntax is:
   
   ```json
   "osDisk": {
       "name": "osdisk",
       "vhd": {
           "uri": "[concat(reference(variables('storageAccountName'), '2016-01-01').primaryEndpoints.blob, variables('vmStorageAccountContainerName'), '/',variables('OSDiskName'),'.vhd')]"
       }
   }
   ```
   
   If you have other values in your template that are configured to use a public namespace, change these values to reflect the same **reference** function. For example, you can set the **storageUri** property of the virtual machine **diagnosticsProfile**:
   
   ```json
   "diagnosticsProfile": {
       "bootDiagnostics": {
           "enabled": "true",
           "storageUri": "[reference(concat('Microsoft.Storage/storageAccounts/', variables('storageAccountName')), '2016-01-01').primaryEndpoints.blob]"
       }
   }
   ```
   
   You also can **reference** an existing storage account in a different resource group:

   ```json
   "osDisk": {
       "name": "osdisk", 
       "vhd": {
           "uri":"[concat(reference(resourceId(parameters('existingResourceGroup'), 'Microsoft.Storage/storageAccounts/', parameters('existingStorageAccountName')), '2016-01-01').primaryEndpoints.blob,  variables('vmStorageAccountContainerName'), '/', variables('OSDiskName'),'.vhd')]"
       }
   }
   ```

* Assign **publicIPAddresses** parameters to a virtual machine only when an application requires it. To connect to a VM for debugging or management or administrative purposes, use **inboundNatRules** or **virtualNetworkGateways** properties, or a jumpbox.
   
     For more information about connecting to virtual machines, see:
   
   * [Running VMs for an N-tier architecture on Azure](../guidance/guidance-compute-n-tier-vm.md)
   * [Setting up WinRM access for virtual machines in Azure Resource Manager](../virtual-machines/windows/winrm.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
   * [Allow external access to your VM by using the Azure portal](../virtual-machines/windows/nsg-quickstart-portal.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
   * [Allow external access to your VM by using PowerShell](../virtual-machines/windows/nsg-quickstart-powershell.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
   * [Opening ports and endpoints](../virtual-machines/virtual-machines-linux-nsg-quickstart.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
* The **domainNameLabel** property for the **publicIPAddresses** parameter must be unique. The **domainNameLabel** property must be between 3 and 63 characters long, and follow the rules specified by this regular expression: `^[a-z][a-z0-9-]{1,61}[a-z0-9]$`. Because the **uniqueString** function generates a string that is 13 characters long, the **dnsPrefixString** parameter is limited to 50 characters.

   ```json
   "parameters": {
       "dnsPrefixString": {
           "type": "string",
           "maxLength": 50,
           "metadata": {
               "description": "DNS label for the public IP address. Must be lowercase. It should match the following regular expression: ^[a-z][a-z0-9-]{1,61}[a-z0-9]$ or it will raise an error."
           }
       }
   },
   "variables": {
       "dnsPrefix": "[concat(parameters('dnsPrefixString'),uniquestring(resourceGroup().id))]"
   }
   ```

* When you add a password to a **customScriptExtension** parameter, use the **commandToExecute** property in **protectedSettings**:
   
   ```json
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
   ```
   
   > [!NOTE]
   > To ensure that secrets are encrypted when they are passed as parameters to virtual machines and extensions, use the **protectedSettings** property of the relevant extensions.
   > 
   > 

## Outputs
If you use a template to create public IP addresses, include an **outputs** section that returns details of the IP address and the fully qualified domain name (FQDN). You can use the output values to easily retrieve details about public IP addresses and FQDNs after deployment. When you reference the resource, use the API version that you used to create it: 

```json
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

## Single template vs. nested templates
To deploy your solution, you can use either a single template or a main template with multiple nested templates. Nested templates are common for more advanced scenarios. Using a nested template gives you the following advantages:

* You can break down a solution into targeted components.
* You can reuse nested templates with different main templates.

If you choose to break down your template design into multiple nested templates, the following guidelines can help you standardize the design. These guidelines are based on the [patterns for designing Azure Resource Manager templates](best-practices-resource-manager-design-templates.md) documentation. We recommend a design that has the following templates:

* **Main template** (azuredeploy.json). Use for the input parameters.
* **Shared resources template**. Use to deploy shared resources that all other resources use (for example, virtual network and availability sets). The **dependsOn** expression ensures that this template is deployed before the other templates.
* **Optional resources template**. Use to conditionally deploy resources based on a parameter (for example, a jumpbox).
* **Member resources templates**. Each instance type within an application tier has its own configuration. Within a tier, different instance types can be defined. (For example, the first instance creates a cluster, and additional instances are added to the existing cluster.) Each instance type has its own deployment template.
* **Scripts**. Widely reusable scripts are applicable for each instance type (for example, initialize and format additional disks). Custom scripts that you create for specific customization purpose are different per instance type.

![Nested template](./media/resource-manager-template-best-practices/nestedTemplateDesign.png)

For more information, see [Using linked templates with Azure Resource Manager](resource-group-linked-templates.md).

## Conditionally link to nested templates
You can conditionally link to nested templates by using a parameter. The parameter becomes part of the URI for the template:

```json
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
```

## Template format
It's a good practice to pass your template through a JSON validator, to remove extraneous commas, parentheses, and brackets that might cause an error during deployment. Try [JSONlint](http://jsonlint.com/) or a linter package for your favorite editing environment (Visual Studio Code, Atom, Sublime Text, Visual Studio)

It's also a good idea to format your JSON for better readability. You can use a JSON formatter package for your local editor. In Visual Studio, format the document with **Ctrl+K, Ctrl+D**. In Visual Studio Code, use **Alt+Shift+F**. If your local editor doesn't format the document, you can use an [online formatter](https://www.bing.com/search?q=json+formatter).

## Next steps
* For guidance about architecting your solution for virtual machines, see [Running a Windows VM in Azure](../guidance/guidance-compute-single-vm.md) and [Running a Linux VM in Azure](../guidance/guidance-compute-single-vm-linux.md).
* For guidance about setting up a storage account, see [Microsoft Azure Storage performance and scalability checklist](../storage/storage-performance-checklist.md).
* For help with virtual networks, see the [networking infrastructure guidelines](../virtual-machines/windows/infrastructure-networking-guidelines.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).
* For guidance about how enterprises can use Resource Manager to effectively manage subscriptions, see [Azure enterprise scaffold - prescriptive subscription governance](resource-manager-subscription-governance.md).

