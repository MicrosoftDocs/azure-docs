---
title: Best practices for Azure Resource Manager templates
description: Describes recommended approaches for authoring Azure Resource Manager templates. Offers suggestions to avoid common problems when using templates. 
services: azure-resource-manager
documentationcenter: na
author: tfitzmac
ms.service: azure-resource-manager
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/12/2019
ms.author: tomfitz
---
# Azure Resource Manager template best practices

This article gives recommendations about how to construct your Resource Manager template. These recommendations help you avoid common problems when using a template to deploy a solution.

For recommendations about how to govern your Azure subscriptions, see [Azure enterprise scaffold: Prescriptive subscription governance](/azure/architecture/cloud-adoption/appendix/azure-scaffold?toc=%2Fen-us%2Fazure%2Fazure-resource-manager%2Ftoc.json&bc=%2Fen-us%2Fazure%2Fbread%2Ftoc.json).

For recommendations about how to build templates that work in all Azure cloud environments, see [Develop Azure Resource Manager templates for cloud consistency](templates-cloud-consistency.md).

## Template limits

Limit the size of your template to 4 MB, and each parameter file to 64 KB. The 4-MB limit applies to the final state of the template after it has been expanded with iterative resource definitions, and values for variables and parameters. 

You're also limited to:

* 256 parameters
* 256 variables
* 800 resources (including copy count)
* 64 output values
* 24,576 characters in a template expression

You can exceed some template limits by using a nested template. For more information, see [Using linked templates when deploying Azure resources](resource-group-linked-templates.md). To reduce the number of parameters, variables, or outputs, you can combine several values into an object. For more information, see [Objects as parameters](resource-manager-objects-as-parameters.md).

## Resource group

When you deploy resources to a resource group, the resource group stores metadata about the resources. The metadata is stored in the location of the resource group.

If the resource group's region is temporarily unavailable, you can't update resources in the resource group because the metadata is unavailable. The resources in other regions will still function as expected, but you can't update them. To minimize risk, locate your resource group and resources in the same region.

## Parameters
The information in this section can be helpful when you work with [parameters](resource-group-authoring-templates.md#parameters).

### General recommendations for parameters

* Minimize your use of parameters. Instead, use variables or literal values for properties that don't need to be specified during deployment.

* Use camel case for parameter names.

* Use parameters for settings that vary according to the environment, like SKU, size, or capacity.

* Use parameters for resource names that you want to specify for easy identification.

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

* Define default values for parameters that aren't sensitive. By specifying a default value, it's easier to deploy the template, and users of your template see an example of an appropriate value. Any default value for a parameter must be valid for all users in the default deployment configuration. 
   
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

* To specify an optional parameter, don't use an empty string as a default value. Instead, use a literal value or a language expression to construct a value.

   ```json
   "storageAccountName": {
     "type": "string",
     "defaultValue": "[concat('storage', uniqueString(resourceGroup().id))]",
     "metadata": {
       "description": "Name of the storage account"
     }
   },
   ```

* Don't use a parameter for the API version for a resource type. Resource properties and values can vary by version number. IntelliSense in a code editor can't determine the correct schema when the API version is set to a parameter. Instead, hard-code the API version in the template.

* Use `allowedValues` sparingly. Use it only when you must make sure some values aren't included in the permitted options. If you use `allowedValues` too broadly, you might block valid deployments by not keeping your list up-to-date.

* When a parameter name in your template matches a parameter in the PowerShell deployment command, Resource Manager resolves this naming conflict by adding the postfix **FromTemplate** to the template parameter. For example, if you include a parameter named **ResourceGroupName** in your template, it conflicts with the **ResourceGroupName** parameter in the [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment) cmdlet. During deployment, you're prompted to provide a value for **ResourceGroupNameFromTemplate**.

### Security recommendations for parameters

* Always use parameters for user names and passwords (or secrets).

* Use `securestring` for all passwords and secrets. If you pass sensitive data in a JSON object, use the `secureObject` type. Template parameters with secure string or secure object types can't be read after resource deployment. 
   
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

* Don't provide default values for user names, passwords, or any value that requires a `secureString` type.

* Don't provide default values for properties that increase the attack surface area of the application.

### Location recommendations for parameters

* Use a parameter to specify the location for resources, and set the default value to `resourceGroup().location`. Providing a location parameter enables users of the template to specify a location that they have permission to deploy to.

   ```json
   "parameters": {
     "location": {
       "type": "string",
       "defaultValue": "[resourceGroup().location]",
       "metadata": {
         "description": "The location in which the resources should be deployed."
       }
     }
   },
   ```

* Don't specify `allowedValues` for the location parameter. The locations you specify might not be available in all clouds.

* Use the location parameter value for resources that are likely to be in the same location. This approach minimizes the number of times users are asked to provide location information.

* For resources that aren't available in all locations, use a separate parameter or specify a literal location value.

## Variables

The following information can be helpful when you work with [variables](resource-group-authoring-templates.md#variables):

* Use variables for values that you need to use more than once in a template. If a value is used only once, a hard-coded value makes your template easier to read.

* Use variables for values that you construct from a complex arrangement of template functions. Your template is easier to read when the  complex expression only appears in variables.

* Don't use variables for `apiVersion` on a resource. The API version determines the schema of the resource. Often, you can't change the version without changing the properties for the resource.

* You can't use the [reference](resource-group-template-functions-resource.md#reference) function in the **variables** section of the template. The **reference** function derives its value from the resource's runtime state. However, variables are resolved during the initial parsing of the template. Construct values that need the **reference** function directly in the **resources** or **outputs** section of the template.

* Include variables for resource names that must be unique.

* Use a [copy loop in variables](resource-group-create-multiple.md#variable-iteration) to create a repeated pattern of JSON objects.

* Remove unused variables.

## Resource dependencies

When deciding what [dependencies](resource-group-define-dependencies.md) to set, use the following guidelines:

* Use the **reference** function and pass in the resource name to set an implicit dependency between resources that need to share a property. Don't add an explicit `dependsOn` element when you've already defined an implicit dependency. This approach reduces the risk of having unnecessary dependencies.

* Set a child resource as dependent on its parent resource.

* Resources with the [condition element](resource-group-authoring-templates.md#condition) set to false are automatically removed from the dependency order. Set the dependencies as if the resource is always deployed.

* Let dependencies cascade without setting them explicitly. For example, your virtual machine depends on a virtual network interface, and the virtual network interface depends on a virtual network and public IP addresses. Therefore, the virtual machine is deployed after all three resources, but don't explicitly set the virtual machine as dependent on all three resources. This approach clarifies the dependency order and makes it easier to change the template later.

* If a value can be determined before deployment, try deploying the resource without a dependency. For example, if a configuration value needs the name of another resource, you might not need a dependency. This guidance doesn't always work because some resources verify the existence of the other resource. If you receive an error, add a dependency.

## Resources

The following information can be helpful when you work with [resources](resource-group-authoring-templates.md#resources):

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

* If you use a *public endpoint* in your template (such as an Azure Blob storage public endpoint), *don't hard-code* the namespace. Use the **reference** function to dynamically retrieve the namespace. You can use this approach to deploy the template to different public namespace environments without manually changing the endpoint in the template. Set the API version to the same version that you're using for the storage account in your template:
   
   ```json
   "osDisk": {
       "name": "osdisk",
       "vhd": {
           "uri": "[concat(reference(concat('Microsoft.Storage/storageAccounts/', variables('storageAccountName')), '2016-01-01').primaryEndpoints.blob, variables('vmStorageAccountContainerName'), '/',variables('OSDiskName'),'.vhd')]"
       }
   }
   ```
   
   If the storage account is deployed in the same template that you're creating, you don't need to specify the provider namespace when you reference the resource. The following example shows the simplified syntax:
   
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

If you use a template to create public IP addresses, include an [outputs section](resource-group-authoring-templates.md#outputs) that returns details of the IP address and the fully qualified domain name (FQDN). You can use output values to easily retrieve details about public IP addresses and FQDNs after deployment.

```json
"outputs": {
    "fqdn": {
        "value": "[reference(parameters('publicIPAddresses_name')).dnsSettings.fqdn]",
        "type": "string"
    },
    "ipaddress": {
        "value": "[reference(parameters('publicIPAddresses_name')).ipAddress]",
        "type": "string"
    }
}
```

## Next steps

* For information about the structure of the Resource Manager template file, see [Understand the structure and syntax of Azure Resource Manager Templates](resource-group-authoring-templates.md).
* For recommendations about how to build templates that work in all Azure cloud environments, see [Develop Azure Resource Manager templates for cloud consistency](templates-cloud-consistency.md).
