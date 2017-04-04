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
These guidelines can help you create Azure Resource Manager templates that are reliable and easy to use. The guidelines are only suggestions. They are not requirements, except where noted. Your scenario might require a variation of one of the following approaches or examples.

## Resource names
Generally, you work with three types of resource names in Resource Manager:

* Resource names that must be unique.
* Resource names that are not required to be unique, but you choose to provide a name that can help you identify a resource based on context.
* Resource names that can be generic.

For help establishing a naming convention, see the [Azure infrastructure naming guidelines](../virtual-machines/windows/infrastructure-naming-guidelines.md). For information about resource name restrictions, see [Recommended naming conventions for Azure resources](../guidance/guidance-naming-conventions.md).

### Unique resource names
You must provide a unique resource name for any resource type that has a data access endpoint. Some common resource types that require a unique name include:

* Azure Storage<sup>1</sup> 
* Web Apps feature of Azure App Service
* SQL Server
* Azure Key Vault
* Azure Redis Cache
* Azure Batch
* Azure Traffic Manager
* Azure Search
* Azure HDInsight

<sup>1</sup> Storage account names also must be lowercase, 24 characters or less, and not have any hyphens.

If you provide a parameter for a resource name, you must provide a unique name when you deploy the resource. Optionally, you can create a variable that uses the [uniqueString()](resource-group-template-functions.md#uniquestring) function to generate a name. 

You also might want to add a prefix or suffix to the **uniqueString** result. Modifying the unique name can help you more easily identify the resource type from the name. For example, you can generate a unique name for a storage account by using the following variable:

```json
"variables": {
    "storageAccountName": "[concat(uniqueString(resourceGroup().id),'storage')]"
}
```

### Resource names for identification
Some resource types you might want to name, but their names do not have to be unique. For these resource types, you can provide a name that identifies both the resource context and the resource type. Provide a descriptive name that helps you identify the resource in a list of resources. If you need to use a different resource name for different deployments, you can use a parameter for the name:

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

If you do not need to pass in a name during deployment, you can use a variable: 

```json
"variables": {
    "vmName": "demoLinuxVM"
}
```

You also can use a hard-coded value:

```json
{
  "type": "Microsoft.Compute/virtualMachines",
  "name": "demoLinuxVM",
  ...
}
```

### Generic resource names
For resource types that you mostly access through a different resource, you can use a generic name that is hard-coded in the template. For example, you can set a standard, generic name for firewall rules on a SQL server:

```json
{
    "type": "firewallrules",
    "name": "AllowAllWindowsAzureIps",
    ...
}
```

## Parameters
The following information can be helpful when you work with parameters:

* Minimize your use of parameters. Whenever possible, use a variable or a literal value. Use parameters only for these scenarios:
   
   * Settings that you want to use variations of according to environment (SKU, size, capacity).
   * Resource names that you want to specify for easy identification.
   * Values that you use frequently to complete other tasks (such as an admin user name).
   * Secrets (such as passwords).
   * The number or array of values to use when you create multiple instances of a resource type.
* Use camel case for parameter names.
* Provide a description of every parameter in the metadata:

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

* Define default values for parameters (except for passwords and SSH keys):
   
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

* Use **SecureString** for all passwords and secrets: 
   
   ```json
   "parameters": {
       "secretValue": {
           "type": "securestring",
           "metadata": {
               "description": "The value of the secret to store in the vault."
           }
       }
   }
   ```

* Whenever possible, don't use a parameter to specify location. Instead, use the **location** property of the resource group. By using the **resourceGroup().location** expression for all your resources, resources in the template are deployed in the same location as the resource group:
   
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
   
   If a resource type is supported in only a limited number of locations, you might want to specify a valid location directly in the template. If you must use a **location** parameter, share that parameter value as much as possible with resources that are likely to be in the same location. This minimizes the number of times users are asked to provide location information.
* Avoid using a parameter or variable for the API version for a resource type. Resource properties and values can vary by version number. IntelliSense in a code editor cannot determine the correct schema when the API version is set to a parameter or variable. Instead, hard-code the API version in the template.

## Variables
The following information can be helpful when you work with variables:

* Use variables for values that you need to use more than once in a template. If a value is used only once, a hard-coded value makes your template easier to read.
* You cannot use the [reference](resource-group-template-functions.md#reference) function in the **variables** section of the template. The **reference** function derives its value from the resource's runtime state. However, variables are resolved during the initial parsing of the template. Construct values that need the **reference** function directly in the **resources** or **outputs** section of the template.
* Include variables for resource names that must be unique, as described in [Resource names](#resource-names).
* You can group variables into complex objects. Use the **variable.subentry** format to reference a value from a complex object. Grouping variables can help you track related variables. It also improves readability of the template. Here's an example:
   
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
   
     For advanced examples of using complex objects as variables, see [Share state in Azure Resource Manager templates](best-practices-resource-manager-state.md).

## Resources
The following information can be helpful when you work with resources:

* To help other contributors understand the purpose of the resource, specify **comments** for each resource in the template:
   
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
* If you use a *public endpoint* in your template (such as an Azure Blob storage public endpoint), *do not hard-code* the namespace. Use the **reference** function to dynamically retrieve the namespace. You can use this approach to deploy the template to different public namespace environments without manually changing the endpoint in the template. Set the API version to the same version that you are using for the storage account in your template:
   
   ```json
   "osDisk": {
       "name": "osdisk",
       "vhd": {
           "uri": "[concat(reference(concat('Microsoft.Storage/storageAccounts/', variables('storageAccountName')), '2016-01-01').primaryEndpoints.blob, variables('vmStorageAccountContainerName'), '/',variables('OSDiskName'),'.vhd')]"
       }
   }
   ```
   
   If the storage account is deployed in the same template that you are creating, you do not need to specify the provider namespace when you reference the resource. This is the simplified syntax:
   
   ```json
   "osDisk": {
       "name": "osdisk",
       "vhd": {
           "uri": "[concat(reference(variables('storageAccountName'), '2016-01-01').primaryEndpoints.blob, variables('vmStorageAccountContainerName'), '/',variables('OSDiskName'),'.vhd')]"
       }
   }
   ```
   
   If you have other values in your template that are configured to use a public namespace, change these values to reflect the same **reference** function. For example, you can set the **storageUri** property of the virtual machine diagnostics profile:
   
   ```json
   "diagnosticsProfile": {
       "bootDiagnostics": {
           "enabled": "true",
           "storageUri": "[reference(concat('Microsoft.Storage/storageAccounts/', variables('storageAccountName')), '2016-01-01').primaryEndpoints.blob]"
       }
   }
   ```
   
   You also can reference an existing storage account that is in a different resource group:

   ```json
   "osDisk": {
       "name": "osdisk", 
       "vhd": {
           "uri":"[concat(reference(resourceId(parameters('existingResourceGroup'), 'Microsoft.Storage/storageAccounts/', parameters('existingStorageAccountName')), '2016-01-01').primaryEndpoints.blob,  variables('vmStorageAccountContainerName'), '/', variables('OSDiskName'),'.vhd')]"
       }
   }
   ```

* Assign public IP addresses to a virtual machine only when an application requires it. To connect to a virtual machine (VM) for debugging, or for management or administrative purposes, use inbound NAT rules, a virtual network gateway, or a jumpbox.
   
     For more information about connecting to virtual machines, see:
   
   * [Run VMs for an N-tier architecture in Azure](../guidance/guidance-compute-n-tier-vm.md)
   * [Set up WinRM access for VMs in Azure Resource Manager](../virtual-machines/windows/winrm.md)
   * [Allow external access to your VM by using the Azure portal](../virtual-machines/windows/nsg-quickstart-portal.md)
   * [Allow external access to your VM by using PowerShell](../virtual-machines/windows/nsg-quickstart-powershell.md)
   * [Allow external access to your Linux VM by using Azure CLI](../virtual-machines/virtual-machines-linux-nsg-quickstart.md)
* The **domainNameLabel** property for public IP addresses must be unique. The **domainNameLabel** value must be between 3 and 63 characters long, and follow the rules specified by this regular expression: `^[a-z][a-z0-9-]{1,61}[a-z0-9]$`. Because the **uniqueString** function generates a string that is 13 characters long, the **dnsPrefixString** parameter is limited to 50 characters:

   ```json
   "parameters": {
       "dnsPrefixString": {
           "type": "string",
           "maxLength": 50,
           "metadata": {
               "description": "The DNS label for the public IP address. It must be lowercase. It should match the following regular expression, or it will raise an error: ^[a-z][a-z0-9-]{1,61}[a-z0-9]$"
           }
       }
   },
   "variables": {
       "dnsPrefix": "[concat(parameters('dnsPrefixString'),uniquestring(resourceGroup().id))]"
   }
   ```

* When you add a password to a custom script extension, use the **commandToExecute** property in the **protectedSettings** property:
   
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
   > To ensure that secrets are encrypted when they are passed as parameters to VMs and extensions, use the **protectedSettings** property of the relevant extensions.
   > 
   > 

## Outputs
If you use a template to create public IP addresses, include an **outputs** section that returns details of the IP address and the fully qualified domain name (FQDN). You can use output values to easily retrieve details about public IP addresses and FQDNs after deployment. When you reference the resource, use the API version that you used to create it: 

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

If you choose to use nested templates, the following guidelines can help you standardize your template design. These guidelines are based on [patterns for designing Azure Resource Manager templates](best-practices-resource-manager-design-templates.md). We recommend a design that has the following templates:

* **Main template** (azuredeploy.json). Use for the input parameters.
* **Shared resources template**. Use to deploy shared resources that all other resources use (for example, virtual network and availability sets). Use the **dependsOn** expression to ensure that this template is deployed before other templates.
* **Optional resources template**. Use to conditionally deploy resources based on a parameter (for example, a jumpbox).
* **Member resources template**. Each instance type within an application tier has its own configuration. Within a tier, you can define different instance types. (For example, the first instance creates a cluster, and additional instances are added to the existing cluster.) Each instance type has its own deployment template.
* **Scripts**. Widely reusable scripts are applicable for each instance type (for example, initialize and format additional disks). Custom scripts that you create for a specific customization purpose are different, based on the instance type.

![Nested template](./media/resource-manager-template-best-practices/nestedTemplateDesign.png)

For more information, see [Use linked templates with Azure Resource Manager](resource-group-linked-templates.md).

## Conditionally link to nested templates
You can use a parameter to conditionally link to nested templates. The parameter becomes part of the URI for the template:

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
It's a good practice to pass your template through a JSON validator. A validator can help you remove extraneous commas, parentheses, and brackets that might cause an error during deployment. Try [JSONLint](http://jsonlint.com/) or a linter package for your favorite editing environment (Visual Studio Code, Atom, Sublime Text, Visual Studio).

It's also a good idea to format your JSON for better readability. You can use a JSON formatter package for your local editor. In Visual Studio, to format the document, press **Ctrl+K, Ctrl+D**. In Visual Studio Code, press **Alt+Shift+F**. If your local editor doesn't format the document, you can use an [online formatter](https://www.bing.com/search?q=json+formatter).

## Next steps
* For guidance on architecting your solution for virtual machines, see [Run a Windows VM in Azure](../guidance/guidance-compute-single-vm.md) and [Run a Linux VM in Azure](../guidance/guidance-compute-single-vm-linux.md).
* For guidance on setting up a storage account, see [Azure Storage performance and scalability checklist](../storage/storage-performance-checklist.md).
* For help with virtual networks, see the [networking infrastructure guidelines](../virtual-machines/windows/infrastructure-networking-guidelines.md).
* To learn about how an enterprise can use Resource Manager to effectively manage subscriptions, see [Azure enterprise scaffold: Prescriptive subscription governance](resource-manager-subscription-governance.md).

