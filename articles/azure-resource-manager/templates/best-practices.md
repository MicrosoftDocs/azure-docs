---
title: Best practices for templates
description: Describes recommended approaches for authoring Azure Resource Manager templates (ARM templates). Offers suggestions to avoid common problems when using templates.
ms.topic: conceptual
ms.custom: devx-track-arm-template
ms.date: 09/22/2023
---
# ARM template best practices

This article shows you how to use recommended practices when constructing your Azure Resource Manager template (ARM template). These recommendations help you avoid common problems when using an ARM template to deploy a solution.

## Template limits

Limit the size of your template to 4 MB, and each resource definition to 1 MB. The limits apply to the final state of the template after it has been expanded with iterative resource definitions, and values for variables and parameters. The parameter file is also limited to 4 MB. You may get an error with a template or parameter file of less than 4 MB if the total size of the request is too large. For more information about how to simplify your template to avoid a large request, see [Resolve errors for job size exceeded](error-job-size-exceeded.md).

You're also limited to:

* 256 parameters
* 256 variables
* 800 resources (including [copy count](copy-resources.md))
* 64 output values
* 10 unique locations per subscription/tenant/management group scope
* 24,576 characters in a template expression

You can exceed some template limits by using a nested template. For more information, see [Using linked and nested templates when deploying Azure resources](linked-templates.md). To reduce the number of parameters, variables, or outputs, you can combine several values into an object. For more information, see [Objects as parameters](/azure/architecture/guide/azure-resource-manager/advanced-templates/objects-as-parameters).

## Resource group

When you deploy resources to a resource group, the resource group stores metadata about the resources. The metadata is stored in the location of the resource group.

If the resource group's region is temporarily unavailable, you can't update resources in the resource group because the metadata is unavailable. The resources in other regions will still function as expected, but you can't update them. To minimize risk, locate your resource group and resources in the same region.

## Parameters

The information in this section can be helpful when you work with [parameters](./parameters.md).

### General recommendations for parameters

* Minimize your use of parameters. Instead, use variables or literal values for properties that don't need to be specified during deployment.

* Use camel case for parameter names.

* Use parameters for settings that vary according to the environment, like SKU, size, or capacity.

* Use parameters for resource names that you want to specify for easy identification.

* Provide a description of every parameter in the metadata.

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
   }
   ```

* Use `allowedValues` sparingly. Use it only when you must make sure some values aren't included in the permitted options. If you use `allowedValues` too broadly, you might block valid deployments by not keeping your list up to date.

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

* Use a parameter to specify the location for resources, and set the default value to `resourceGroup().location`. Providing a location parameter enables users of the template to specify a location where they have permission to deploy resources.

   ```json
   "parameters": {
     "location": {
       "type": "string",
       "defaultValue": "[resourceGroup().location]",
       "metadata": {
         "description": "The location in which the resources should be deployed."
       }
     }
   }
   ```

* Don't specify `allowedValues` for the location parameter. The locations you specify might not be available in all clouds.

* Use the location parameter value for resources that are likely to be in the same location. This approach minimizes the number of times users are asked to provide location information.

* For resources that aren't available in all locations, use a separate parameter or specify a literal location value.

## Variables

The following information can be helpful when you work with [variables](./variables.md):

* Use camel case for variable names.

* Use variables for values that you need to use more than once in a template. If a value is used only once, a hard-coded value makes your template easier to read.

* Use variables for values that you construct from a complex arrangement of template functions. Your template is easier to read when the complex expression only appears in variables.

* You can't use the [reference](template-functions-resource.md#reference) function in the `variables` section of the template. The `reference` function derives its value from the resource's runtime state. However, variables are resolved during the initial parsing of the template. Construct values that need the `reference` function directly in the `resources` or `outputs` section of the template.

* Include variables for resource names that must be unique.

* Use a [copy loop in variables](copy-variables.md) to create a repeated pattern of JSON objects.

* Remove unused variables.

## API version

Set the `apiVersion` property to a hard-coded API version for the resource type. When creating a new template, we recommend you use the latest API version for a resource type. To determine available values, see [template reference](/azure/templates/).

When your template works as expected, we recommend you continue using the same API version. By using the same API version, you don't have to worry about breaking changes that might be introduced in later versions.

Don't use a parameter for the API version. Resource properties and values can vary by API version. IntelliSense in a code editor can't determine the correct schema when the API version is set to a parameter. If you pass in an API version that doesn't match the properties in your template, the deployment will fail.

Don't use variables for the API version.

## Resource dependencies

When deciding what [dependencies](./resource-dependency.md) to set, use the following guidelines:

* Use the `reference` function and pass in the resource name to set an implicit dependency between resources that need to share a property. Don't add an explicit `dependsOn` element when you've already defined an implicit dependency. This approach reduces the risk of having unnecessary dependencies. For an example of setting an implicit dependency, see [reference and list functions](./resource-dependency.md#reference-and-list-functions).

* Set a child resource as dependent on its parent resource.

* Resources with the [condition element](conditional-resource-deployment.md) set to `false` are automatically removed from the dependency order. Set the dependencies as if the resource is always deployed.

* Let dependencies cascade without setting them explicitly. For example, your virtual machine depends on a virtual network interface, and the virtual network interface depends on a virtual network and public IP addresses. Therefore, the virtual machine is deployed after all three resources, but don't explicitly set the virtual machine as dependent on all three resources. This approach clarifies the dependency order and makes it easier to change the template later.

* If a value can be determined before deployment, try deploying the resource without a dependency. For example, if a configuration value needs the name of another resource, you might not need a dependency. This guidance doesn't always work because some resources verify the existence of the other resource. If you receive an error, add a dependency.

## Resources

The following information can be helpful when you work with [resources](./syntax.md#resources):

* To help other contributors understand the purpose of the resource, specify `comments` for each resource in the template.

    ```json
    "resources": [
      {
        "name": "[variables('storageAccountName')]",
        "type": "Microsoft.Storage/storageAccounts",
        "apiVersion": "2019-06-01",
        "location": "[resourceGroup().location]",
        "comments": "This storage account is used to store the VM disks.",
          ...
      }
    ]
    ```

   If your ARM template is stored in a `.jsonc` file, comments using the `//` syntax are supported, as shown here.

    ```javascript
    "resources": [
      {
        // This storage account is used to store the VM disks.
        "name": "[variables('storageAccountName')]",
        "type": "Microsoft.Storage/storageAccounts",
        "apiVersion": "2019-06-01",
        "location": "[resourceGroup().location]",
          ...
      }
    ]
    ```

   For more details about comments and metadata see [Understand the structure and syntax of ARM templates](./syntax.md#comments-and-metadata).

* If you use a *public endpoint* in your template (such as an Azure Blob storage public endpoint), *don't hard-code* the namespace. Use the `reference` function to dynamically retrieve the namespace. You can use this approach to deploy the template to different public namespace environments without manually changing the endpoint in the template. Set the API version to the same version that you're using for the storage account in your template.

    ```json
    "diagnosticsProfile": {
      "bootDiagnostics": {
        "enabled": "true",
        "storageUri": "[reference(resourceId('Microsoft.Storage/storageAccounts', variables('storageAccountName')), '2019-06-01').primaryEndpoints.blob]"
      }
    }
    ```

   If the storage account is deployed in the same template that you're creating and the name of the storage account isn't shared with another resource in the template, you don't need to specify the provider namespace or the `apiVersion` when you reference the resource. The following example shows the simplified syntax.

    ```json
    "diagnosticsProfile": {
      "bootDiagnostics": {
        "enabled": "true",
        "storageUri": "[reference(variables('storageAccountName')).primaryEndpoints.blob]"
      }
    }
    ```

   You also can reference an existing storage account that's in a different resource group.

    ```json
    "diagnosticsProfile": {
      "bootDiagnostics": {
        "enabled": "true",
        "storageUri": "[reference(resourceId(parameters('existingResourceGroup'), 'Microsoft.Storage/storageAccounts', parameters('existingStorageAccountName')), '2019-06-01').primaryEndpoints.blob]"
      }
    }
    ```

* Assign public IP addresses to a virtual machine only when an application requires it. To connect to a virtual machine for administrative purposes, use inbound NAT rules, a virtual network gateway, or a jumpbox.

     For more information about connecting to virtual machines, see:

   * [What is Azure Bastion?](../../bastion/bastion-overview.md)
   * [How to connect and sign on to an Azure virtual machine running Windows](../../virtual-machines/windows/connect-rdp.md)
   * [Setting up WinRM access for Virtual Machines in Azure Resource Manager](../../virtual-machines/windows/connect-winrm.md)
   * [Connect to a Linux VM](../../virtual-machines/linux-vm-connect.md)

* The `domainNameLabel` property for public IP addresses must be unique. The `domainNameLabel` value must be between 3 and 63 characters long, and follow the rules specified by this regular expression: `^[a-z][a-z0-9-]{1,61}[a-z0-9]$`. Because the `uniqueString` function generates a string that is 13 characters long, the `dnsPrefixString` parameter is limited to 50 characters.

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

* When you add a password to a custom script extension, use the `commandToExecute` property in the `protectedSettings` property.

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
   > To ensure that secrets are encrypted when they are passed as parameters to VMs and extensions, use the `protectedSettings` property of the relevant extensions.

* Specify explicit values for properties that have default values that could change over time. For example, if you're deploying an AKS cluster, you can either specify or omit the `kubernetesVersion` property. If you don't specify it, then [the cluster is defaulted to the N-1 minor version and latest patch](../../aks/supported-kubernetes-versions.md#azure-portal-and-cli-versions). When you deploy the cluster using an ARM template, this default behavior might not be what you expect. Redeploying your template may result in the cluster being upgraded to a new Kubernetes version unexpectedly. Instead, consider specifying an explicit version number and then manually changing it when you're ready to upgrade your cluster.

## Comments

In addition to the `comments` property, comments using the `//` syntax are supported.  For more details about comments and metadata see [Understand the structure and syntax of ARM templates](./syntax.md#comments-and-metadata). You may choose to save JSON files that contain `//` comments using the `.jsonc` file extension, to indicate the JSON file contains comments. The ARM service will also accept comments in any JSON file including parameters files.

## Visual Studio Code ARM Tools

Working with ARM templates is much easier with the Azure Resource Manager (ARM) Tools for Visual Studio Code. This extension provides language support, resource snippets, and resource auto-completion to help you create and validate Azure Resource Manager templates. To learn more and install the extension, see [Azure Resource Manager (ARM) Tools](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools).

## Use test toolkit

The ARM template test toolkit is a script that checks whether your template uses recommended practices. When your template isn't compliant with recommended practices, it returns a list of warnings with suggested changes. The test toolkit can help you learn how to implement best practices in your template.

After you've completed your template, run the test toolkit to see if there are ways you can improve its implementation. For more information, see [Use ARM template test toolkit](test-toolkit.md).

## Next steps

* For information about the structure of the template file, see [Understand the structure and syntax of ARM templates](./syntax.md).
* For recommendations about how to build templates that work in all Azure cloud environments, see [Develop ARM templates for cloud consistency](./template-cloud-consistency.md).
