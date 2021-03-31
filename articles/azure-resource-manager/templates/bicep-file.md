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

For the available data types, see [Data types in templates](data-types.md).

You can add one or more decorators for each parameter. These decorators define the values that are allowed for the parameter.

You can define a default value for the parameter that is used if no value is provided during deployment.

For more information, see [Parameters in templates](template-parameters.md).

## Variables

Use variables for complex expressions that are repeated in a Bicep file. For example, you might add a variable for a resource name that is constructed by concatenating several values together.

You don't specify a [data type](data-types.md) for a variable. Instead, the data type is inferred from the value.

For more information, see [Variables in templates](template-variables.md).

## Modules

Use modules to link to other Bicep files that contain code you want to reuse. The module contains one or more resources to deploy. Those resources are deployed along with any other resources in your Bicep file.

The symbolic name enables you to reference the module from somewhere else in the file. For example, you can get an output value from a module by using the symbolic name and the name of the output value.

For more information, see [Use Bicep modules](bicep-modules.md).

## Resource

Use the `resource` keyword to define a resource to deploy. Your resource declaration includes a symbolic name for the resource. Use the symbolic name in other parts of the Bicep file to get a value from the resource.

In your resource declaration, you include properties for the resource type. These properties are unique to each resource type.

For more information, see [Resource declaration in templates](resource-declaration.md).

## Outputs

Use outputs to return value from the deployment. Specify a [data type](data-types.md) for the output value.

Typically, you return a value from a deployed resource when you need to reuse that value for another operation.

For more information, see [Outputs in templates](template-outputs.md).

## Comments

Use `//` for single-line comments or `/* ... */` for multi-line comments

The following example shows a single-line comment.

```bicep
// This is your primary NIC.
resource nic1 'Microsoft.Network/networkInterfaces@2020-06-01' = {
   ...
}
```

The following example shows a multi-line comment.

```bicep
/*
  This template assumes the key vault already exists and
  is in same subscription and resource group as the deployment.
*/
param existingKeyVaultName string
```

## Multi-line strings

You can break a string into multiple lines. Use three single quote characters `'''` to start and end the multi-line string. You can optionally include a newline after the starting quotes.

Characters that are entered between the opening and closing sequence are read verbatim, and no escaping is necessary or possible.

Because the Bicep parser reads all characters as-is, depending on the line endings of your Bicep file, newlines will either be interpreted as \r\n or \n.
Interpolation is not currently supported in multi-line strings.
Multi-line strings containing ''' are not supported.


## Next steps

For an introduction to Bicep, see [What is Bicep?](bicep-overview.md).
