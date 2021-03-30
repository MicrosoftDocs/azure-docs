---
title: Bicep file structure and syntax
description: Describes the structure and properties of a Bicep file using declarative syntax.
ms.topic: conceptual
ms.date: 03/30/2021
---

# Understand the structure and syntax of Bicep files

This article describes the structure of a Bicep file. It presents the different sections of the file and the properties that are available in those sections.

This article is intended for users who have some familiarity with Bicep files. It provides detailed information about the structure of the template. For a step-by-step tutorial that guides you through the process of creating a Bicep file, see [Tutorial: Create and deploy first Azure Resource Manager Bicep file](bicep-tutorial-create-first-bicep.md).

## Template format

A Bicep file has the following elements:

```bicep
targetScope = '<scope>'

@<decorator>()
param <parameter-name> <parameter-data-type> = <default-value>

var <variable-name> = <variable-value>

module <module-symbolic-name> '<path-to-file>' = {
  name: '<linked-deployment-name>'
  params: {
    <parameter-names-and-values>
  }
}

resource <resource-symbolic-name> '<resource-type>@<api-version>' = {
  <resource-properties>
}

output <output-name> <output-data-type> = <output-value>
```

The elements can appear in any order.

## Target scope

By default, the target scope is set to `resourceGroup`. If you're deploying at the resource group level, you don't need to set the target scope in your Bicep file.

The allowed values are:

* **resourceGroup** - default value, used for [resource group deployments](deploy-to-resource-group.md).
* **subscription** - used for [subscription deployments](deploy-to-subscription.md).
* **managementGroup** - used for [management group deployments](deploy-to-management-group.md).
* **tenant** - used for [tenant deployments](deploy-to-tenant.md).

## Parameters

Use parameters for values that need to vary for different deployments. For example, you might add a SKU parameter to specify different sizes for a resource.

For the available data types, see [Data types in ARM templates](data-types.md).

You can add one or more decorators for each parameter. These decorators define the values that are allowed for the parameter.

You can define a default value for the parameter that is used if no value is provided during deployment.

For more information, see [Parameters in ARM templates](template-parameters.md).

## Variables

Use variables for complex expressions that are repeated in a Bicep file. For example, you might add a variable for a resource name that is constructed by concatenating several values together.

You don't specify a [data type](data-types.md) for a variable. Instead, the data type is inferred from the value.

For more information, see [Variables in ARM templates](template-variables.md).

## Modules

Use modules to link to other Bicep files that contain code you want to reuse. The module contains one or more resources to deploy. Those resources are deployed along with any other resources in your Bicep file.

The symbolic name enables you to reference the module from somewhere else in the file. For example, you can get an output value from a module by using the symbolic name and the name of the output value.

For more information, see [Use Bicep modules](bicep-modules.md).

## Resource

Use the `resource` keyword to define a resource to deploy. Your resource declaration includes a symbolic name for the resource. Use the symbolic name in other parts of the Bicep file to get a value from the resource.

In your resource declaration, you include properties for the resource type. These are unique to each resource type.

For more information, see [Resource declaration in ARM templates](resource-declaration.md).

## Outputs

Use outputs to return value from the deployment. Specify a [data type](data-types.md) for the output value.

Typically, you return a value from a deployed resource when you need to reuse that value for another operation.

For more information, see [Outputs in ARM templates](template-outputs.md).

## Comments and metadata

You have a few options for adding comments and metadata to your template.

### Comments

For inline comments, you can use either `//` or `/* ... */` but this syntax doesn't work with all tools. If you add this style of comment, be sure the tools you use support inline JSON comments.

> [!NOTE]
> To deploy templates with comments by using Azure CLI with version 2.3.0 or older, you must use the `--handle-extended-json-format` switch.

```json
{
  "type": "Microsoft.Compute/virtualMachines",
  "apiVersion": "2018-10-01",
  "name": "[variables('vmName')]", // to customize name, change it in variables
  "location": "[parameters('location')]", //defaults to resource group location
  "dependsOn": [ /* storage account and network interface must be deployed first */
    "[resourceId('Microsoft.Storage/storageAccounts/', variables('storageAccountName'))]",
    "[resourceId('Microsoft.Network/networkInterfaces/', variables('nicName'))]"
  ],
```

In Visual Studio Code, the [Azure Resource Manager Tools extension](quickstart-create-templates-use-visual-studio-code.md) can automatically detect an ARM template and change the language mode. If you see **Azure Resource Manager Template** at the bottom-right corner of Visual Studio Code, you can use the inline comments. The inline comments are no longer marked as invalid.

![Visual Studio Code Azure Resource Manager template mode](./media/template-syntax/resource-manager-template-editor-mode.png)

### Metadata

You can add a `metadata` object almost anywhere in your template. Resource Manager ignores the object, but your JSON editor may warn you that the property isn't valid. In the object, define the properties you need.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "metadata": {
    "comments": "This template was developed for demonstration purposes.",
    "author": "Example Name"
  },
```

For `parameters`, add a `metadata` object with a `description` property.

```json
"parameters": {
  "adminUsername": {
    "type": "string",
    "metadata": {
      "description": "User name for the Virtual Machine."
    }
  },
```

When deploying the template through the portal, the text you provide in the description is automatically used as a tip for that parameter.

![Show parameter tip](./media/template-syntax/show-parameter-tip.png)

For `resources`, add a `comments` element or a `metadata` object. The following example shows both a `comments` element and a `metadata` object.

```json
"resources": [
  {
    "type": "Microsoft.Storage/storageAccounts",
    "apiVersion": "2018-07-01",
    "name": "[concat('storage', uniqueString(resourceGroup().id))]",
    "comments": "Storage account used to store VM disks",
    "location": "[parameters('location')]",
    "metadata": {
      "comments": "These tags are needed for policy compliance."
    },
    "tags": {
      "Dept": "[parameters('deptName')]",
      "Environment": "[parameters('environment')]"
    },
    "sku": {
      "name": "Standard_LRS"
    },
    "kind": "Storage",
    "properties": {}
  }
]
```

For `outputs`, add a `metadata` object to the output value.

```json
"outputs": {
  "hostname": {
    "type": "string",
    "value": "[reference(variables('publicIPAddressName')).dnsSettings.fqdn]",
    "metadata": {
      "comments": "Return the fully qualified domain name"
    }
  },
```

You can't add a `metadata` object to user-defined functions.

## Multi-line strings

You can break a string into multiple lines. For example, see the `location` property and one of the comments in the following JSON example.

```json
{
  "type": "Microsoft.Compute/virtualMachines",
  "apiVersion": "2018-10-01",
  "name": "[variables('vmName')]", // to customize name, change it in variables
  "location": "[
    parameters('location')
    ]", //defaults to resource group location
  /*
    storage account and network interface
    must be deployed first
  */
  "dependsOn": [
    "[resourceId('Microsoft.Storage/storageAccounts/', variables('storageAccountName'))]",
    "[resourceId('Microsoft.Network/networkInterfaces/', variables('nicName'))]"
  ],
```

> [!NOTE]
> To deploy templates with multi-line strings by using Azure CLI with version 2.3.0 or older, you must use the `--handle-extended-json-format` switch.

## Next steps

* To view complete templates for many different types of solutions, see the [Azure Quickstart Templates](https://azure.microsoft.com/documentation/templates/).
* For details about the functions you can use from within a template, see [ARM template functions](template-functions.md).
* To combine several templates during deployment, see [Using linked and nested templates when deploying Azure resources](linked-templates.md).
* For recommendations about creating templates, see [ARM template best practices](template-best-practices.md).
* For answers to common questions, see [Frequently asked questions about ARM templates](frequently-asked-questions.md).
