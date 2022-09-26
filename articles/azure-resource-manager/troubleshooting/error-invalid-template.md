---
title: Invalid template errors
description: Describes how to resolve invalid template errors when deploying Bicep files or Azure Resource Manager templates (ARM templates).
ms.topic: troubleshooting
ms.date: 09/12/2022
---

# Resolve errors for invalid template

This article describes how to resolve invalid template errors for Bicep files and Azure Resource Manager templates (ARM templates). The error occurs for several reasons, like a syntax error, invalid parameter value, or circular dependency.

## Symptom

When a template is deployed, you receive an error that indicates:

```Output
Code=InvalidTemplate
Message=<varies>
```

The error message depends on the type of error.

## Cause

This error can result from several different types of errors. They usually involve a syntax or structural error in the template.

<a id="syntax-error"></a>

## Solution 1: Syntax error

If you receive an error message that indicates the template failed validation, you may have a syntax problem in your template.

```Output
Code=InvalidTemplate
Message=Deployment template validation failed
```

Syntax errors can occur because template expressions have many elements. For example, the name assignment for a storage account includes pairs of single or double quotes, curly braces, square brackets, and parentheses. Expressions also contain functions and characters like dollar signs, commas, and dots.


# [Bicep](#tab/bicep)

```bicep
name: 'storage${uniqueString(resourceGroup().id)}'
```

# [JSON](#tab/json)

```json
"name": "[concat('storage', uniqueString(resourceGroup().id))]",
```

---

When you receive this type of error, review the expression's syntax. To identify template errors, you can use [Visual Studio Code](https://code.visualstudio.com) with the latest [Bicep extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep) or [Azure Resource Manager Tools extension](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools).

<a id="incorrect-segment-lengths"></a>

## Solution 2: Incorrect segment lengths

Another invalid template error occurs when the resource name isn't in the correct format. To resolve that error, see [Resolve errors for name and type mismatch](error-invalid-name-segments.md).

<a id="parameter-not-valid"></a>

## Solution 3: Parameter isn't valid

You can specify a parameter's allowed values in a template. During deployment, if you provide a value that isn't an allowed value, you receive a message similar to the following error:

```Output
Code=InvalidTemplate;
Message=Deployment template validation failed: 'The provided value {parameter value}
for the template parameter {parameter name} is not valid. The parameter value is not
part of the allowed values
```

Check the template for the parameter's allowed values, and use an allowed value during deployment. For more information, see allowed values for [Bicep](../bicep/parameters.md#allowed-values) or [ARM templates](../templates/parameters.md#allowed-values).

<a id="too-many-resource-groups"></a>

## Solution 4: Too many target resource groups

You may see this error in earlier deployments because you were limited to five target resource groups in a single deployment. In May 2020, that limit was increased to 800 resource groups. For more information, see how to deploy to multiple resource groups for [Bicep](../bicep/deploy-to-resource-group.md#deploy-to-multiple-resource-groups) or [ARM templates](../templates/deploy-to-resource-group.md#deploy-to-multiple-resource-groups).

<a id="circular-dependency"></a>

## Solution 5: Circular dependency detected

You receive this error when resources depend on each other in a way that prevents the deployment from starting. A combination of interdependencies makes two or more resource wait for other resources that are also waiting. For example, resource1 depends on resource3, resource2 depends on resource1, and resource3 depends on resource2. You can usually solve this problem by removing unnecessary dependencies.

Bicep creates an implicit dependency when one resource uses the symbolic name of another resource. An explicit dependency using `dependsOn` usually isn't necessary. For more information, see Bicep [dependencies](../bicep/resource-dependencies.md).

To solve a circular dependency:

1. In your template, find the resource identified in the circular dependency.
1. For that resource, examine the `dependsOn` property and any uses of the `reference` function to see which resources it depends on.
1. Examine those resources to see which resources they depend on. Follow the dependencies until you notice a resource that depends on the original resource.
1. For the resources involved in the circular dependency, carefully examine all uses of the `dependsOn` property to identify any dependencies that aren't needed. Remove those dependencies. If you're unsure that a dependency is needed, try removing it.
1. Redeploy the template.

Removing values from the `dependsOn` property can cause errors when you deploy the template. If you get an error, add the dependency back into the template.

If that approach doesn't solve the circular dependency, consider moving part of your deployment logic into child resources (such as extensions or configuration settings). Configure those child resources to deploy after the resources involved in the circular dependency. For example, suppose you're deploying two virtual machines but you must set properties on each one that refer to the other. You can deploy them in the following order:

1. vm1
1. vm2
1. Extension on vm1 depends on vm1 and vm2. The extension sets values on vm1 that it gets from vm2.
1. Extension on vm2 depends on vm1 and vm2. The extension sets values on vm2 that it gets from vm1.

The same approach works for App Service apps. Consider moving configuration values into a child resource of the app resource. You can deploy two web apps in the following order:

1. webapp1
1. webapp2
1. Configuration for webapp1 depends on webapp1 and webapp2. It contains app settings with values from webapp2.
1. Configuration for webapp2 depends on webapp1 and webapp2. It contains app settings with values from webapp1.
