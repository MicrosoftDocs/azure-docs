---
title: Template test cases for test toolkit
description: Describes the template tests that are run by the Azure Resource Manager template test toolkit.
ms.topic: conceptual
ms.custom: devx-track-arm-template
ms.date: 11/09/2022
ms.author: tomfitz
author: tfitzmac
---

# Test cases for ARM templates

This article describes tests that are run with the [template test toolkit](test-toolkit.md) for Azure Resource Manager templates (ARM templates). It provides examples that **pass** or **fail** the test and includes the name of each test. For more information about how to run tests or how to run a specific test, see [Test parameters](test-toolkit.md#test-parameters).

## Use correct schema

Test name: **DeploymentTemplate Schema Is Correct**

In your template, you must specify a valid schema value.

The following example **fails** because the schema is invalid.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-01-01/deploymentTemplate.json#",
}
```

The following example displays a **warning** because schema version `2015-01-01` is deprecated and isn't maintained.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
}
```

The following example **passes** using a valid schema.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
}
```

The template's `schema` property must be set to one of the following schemas:

- `https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#`
- `https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#`
- `https://schema.management.azure.com/schemas/2018-05-01/subscriptionDeploymentTemplate.json#`
- `https://schema.management.azure.com/schemas/2019-08-01/tenantDeploymentTemplate.json#`
- `https://schema.management.azure.com/schemas/2019-08-01/managementGroupDeploymentTemplate.json`

## Declared parameters must be used

Test name: **Parameters Must Be Referenced**

This test finds parameters that aren't used in the template or parameters that aren't used in a valid expression.

To reduce confusion in your template, delete any parameters that are defined but not used. Eliminating unused parameters simplifies template deployments because you don't have to provide unnecessary values.

In Bicep, use [Linter rule - no unused parameters](../bicep/linter-rule-no-unused-parameters.md).

The following example **fails** because the expression that references a parameter is missing the leading square bracket (`[`).

```json
"resources": [
  {
    "location": " parameters('location')]"
  }
]
```

The following example **passes** because the expression is valid.

```json
"resources": [
  {
    "location": "[parameters('location')]"
  }
]
```

## Secure parameters can't have hard-coded default

Test name: **Secure String Parameters Cannot Have Default**

Don't provide a hard-coded default value for a secure parameter in your template. A secure parameter can have an empty string as a default value or use the [newGuid](template-functions-string.md#newguid) function in an expression.

You use the types `secureString` or `secureObject` on parameters that contain sensitive values, like passwords. When a parameter uses a secure type, the value of the parameter isn't logged or stored in the deployment history. This action prevents a malicious user from discovering the sensitive value.

When you provide a default value, that value is discoverable by anyone who can access the template or the deployment history.

In Bicep, use [Linter rule - secure parameter default](../bicep/linter-rule-secure-parameter-default.md).

The following example **fails**.

```json
"parameters": {
  "adminPassword": {
    "defaultValue": "HardcodedPassword",
    "type": "secureString"
  }
}
```

The next example **passes**.

```json
"parameters": {
  "adminPassword": {
    "type": "secureString"
  }
}
```

The following example **passes** because the `newGuid` function is used.

```json
"parameters": {
  "secureParameter": {
    "type": "secureString",
    "defaultValue": "[newGuid()]"
  }
}
```

## Environment URLs can't be hard-coded

Test name: **DeploymentTemplate Must Not Contain Hardcoded Uri**

Don't hard-code environment URLs in your template. Instead, use the [environment](template-functions-deployment.md#environment) function to dynamically get these URLs during deployment. For a list of the URL hosts that are blocked, see the [test case](https://github.com/Azure/arm-ttk/blob/master/arm-ttk/testcases/deploymentTemplate/DeploymentTemplate-Must-Not-Contain-Hardcoded-Uri.test.ps1).

In Bicep, use [Linter rule - no hardcoded environment URL](../bicep/linter-rule-no-hardcoded-environment-urls.md).

The following example **fails** because the URL is hard-coded.

```json
"variables":{
  "AzureURL":"https://management.azure.com"
}
```

The test also **fails** when used with [concat](template-functions-string.md#concat) or [uri](template-functions-string.md#uri).

```json
"variables":{
  "AzureSchemaURL1": "[concat('https://','gallery.azure.com')]",
  "AzureSchemaURL2": "[uri('gallery.azure.com','test')]"
}
```

The following example **passes**.

```json
"variables": {
  "AzureSchemaURL": "[environment().gallery]"
}
```

## Location uses parameter

Test name: **Location Should Not Be Hardcoded**

To set a resource's location, your templates should have a parameter named `location` with the type set to  `string`. In the main template, _azuredeploy.json_ or _mainTemplate.json_, this parameter can default to the resource group location. In linked or nested templates, the location parameter shouldn't have a default location.

Template users may have limited access to regions where they can create resources. A hard-coded resource location might block users from creating a resource. The `"[resourceGroup().location]"` expression could block users if the resource group was created in a region the user can't access. Users who are blocked are unable to use the template.

By providing a `location` parameter that defaults to the resource group location, users can use the default value when convenient but also specify a different location.

In Bicep, use [Linter rule - no location expressions outside of parameter default values](../bicep/linter-rule-no-loc-expr-outside-params.md).

The following example **fails** because the resource's `location` is set to `resourceGroup().location`.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {},
  "variables": {},
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2021-02-01",
      "name": "storageaccount1",
      "location": "[resourceGroup().location]",
      "kind": "StorageV2",
      "sku": {
        "name": "Premium_LRS",
        "tier": "Premium"
      }
    }
  ]
}
```

The next example uses a `location` parameter but **fails** because the parameter defaults to a hard-coded location.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "location": {
      "type": "string",
      "defaultValue": "westus"
    }
  },
  "variables": {},
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2021-02-01",
      "name": "storageaccount1",
      "location": "[parameters('location')]",
      "kind": "StorageV2",
      "sku": {
        "name": "Premium_LRS",
        "tier": "Premium"
      }
    }
  ],
  "outputs": {}
}
```

The following example **passes** when the template is used as the main template. Create a parameter that defaults to the resource group location but allows users to provide a different value.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": {
        "description": "Location for the resources."
      }
    }
  },
  "variables": {},
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2021-02-01",
      "name": "storageaccount1",
      "location": "[parameters('location')]",
      "kind": "StorageV2",
      "sku": {
        "name": "Premium_LRS",
        "tier": "Premium"
      }
    }
  ],
  "outputs": {}
}
```

> [!NOTE]
> If the preceding example is used as a linked template, the test **fails**. When used as a linked template, remove the default value.

## Resources should have location

Test name: **Resources Should Have Location**

The location for a resource should be set to a [template expression](template-expressions.md) or `global`. The template expression would typically use the `location` parameter described in [Location uses parameter](#location-uses-parameter).

In Bicep, use [Linter rule - no hardcoded locations](../bicep/linter-rule-no-hardcoded-location.md).

The following example **fails** because the `location` isn't an expression or `global`.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {},
  "functions": [],
  "variables": {},
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2021-02-01",
      "name": "storageaccount1",
      "location": "westus",
      "kind": "StorageV2",
      "sku": {
        "name": "Premium_LRS",
        "tier": "Premium"
      }
    }
  ],
  "outputs": {}
}
```

The following example **passes** because the resource `location` is set to `global`.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {},
  "functions": [],
  "variables": {},
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2021-02-01",
      "name": "storageaccount1",
      "location": "global",
      "kind": "StorageV2",
      "sku": {
        "name": "Premium_LRS",
        "tier": "Premium"
      }
    }
  ],
  "outputs": {}
}

```

The next example also **passes** because the `location` parameter uses an expression. The resource `location` uses the expression's value.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": {
        "description": "Location for the resources."
      }
    }
  },
  "variables": {},
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2021-02-01",
      "name": "storageaccount1",
      "location": "[parameters('location')]",
      "kind": "StorageV2",
      "sku": {
        "name": "Premium_LRS",
        "tier": "Premium"
      }
    }
  ],
  "outputs": {}
}
```

## VM size uses parameter

Test name: **VM Size Should Be A Parameter**

Don't hard-code the `hardwareProfile` object's `vmSize`. The test fails when the `hardwareProfile` is omitted or contains a hard-coded value. Provide a parameter so users of your template can modify the size of the deployed virtual machine. For more information, see [Microsoft.Compute virtualMachines](/azure/templates/microsoft.compute/virtualmachines).

The following example **fails** because the `hardwareProfile` object's `vmSize` is a hard-coded value.

```json
"resources": [
  {
    "type": "Microsoft.Compute/virtualMachines",
    "apiVersion": "2020-12-01",
    "name": "demoVM",
    "location": "[parameters('location')]",
    "properties": {
      "hardwareProfile": {
        "vmSize": "Standard_D2_v3"
      }
    }
  }
]
```

The example **passes** when a parameter specifies a value for `vmSize`:

```json
"parameters": {
  "vmSizeParameter": {
    "type": "string",
    "defaultValue": "Standard_D2_v3",
    "metadata": {
      "description": "Size for the virtual machine."
    }
  }
}
```

Then, `hardwareProfile` uses an expression for `vmSize` to reference the parameter's value:

```json
"resources": [
  {
    "type": "Microsoft.Compute/virtualMachines",
    "apiVersion": "2020-12-01",
    "name": "demoVM",
    "location": "[parameters('location')]",
    "properties": {
      "hardwareProfile": {
        "vmSize": "[parameters('vmSizeParameter')]"
      }
    }
  }
]
```

## Min and max values are numbers

Test name: **Min And Max Value Are Numbers**

When you define a parameter with `minValue` and `maxValue`, specify them as numbers. You must use `minValue` and `maxValue` as a pair or the test fails.

The following example **fails** because `minValue` and `maxValue` are strings.

```json
"exampleParameter": {
  "type": "int",
  "minValue": "0",
  "maxValue": "10"
}
```

The following example **fails** because only `minValue` is used.

```json
"exampleParameter": {
  "type": "int",
  "minValue": 0
}
```

The following example **passes** because `minValue` and `maxValue` are numbers.

```json
"exampleParameter": {
  "type": "int",
  "minValue": 0,
  "maxValue": 10
}
```

## Artifacts parameter defined correctly

Test name: **artifacts parameter**

When you include parameters for `_artifactsLocation` and `_artifactsLocationSasToken`, use the correct defaults and types. The following conditions must be met to pass this test:

- If you provide one parameter, you must provide the other.
- `_artifactsLocation` must be a `string`.
- `_artifactsLocation` must have a default value in the main template.
- `_artifactsLocation` can't have a default value in a nested template.
- `_artifactsLocation` must have either `"[deployment().properties.templateLink.uri]"` or the raw repo URL for its default value.
- `_artifactsLocationSasToken` must be a `secureString`.
- `_artifactsLocationSasToken` can only have an empty string for its default value.
- `_artifactsLocationSasToken` can't have a default value in a nested template.

In Bicep, use [Linter rule - artifacts parameters](../bicep/linter-rule-artifacts-parameters.md).

## Declared variables must be used

Test name: **Variables Must Be Referenced**

This test finds variables that aren't used in the template or aren't used in a valid expression. To reduce confusion in your template, delete any variables that are defined but not used.

Variables that use the `copy` element to iterate values must be referenced. For more information, see [Variable iteration in ARM templates](copy-variables.md).

In Bicep, use [Linter rule - no unused variables](../bicep/linter-rule-no-unused-variables.md).

The following example **fails** because the variable that uses the `copy` element isn't referenced.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "itemCount": {
      "type": "int",
      "defaultValue": 5
    }
  },
  "variables": {
    "copy": [
      {
        "name": "stringArray",
        "count": "[parameters('itemCount')]",
        "input": "[concat('item', copyIndex('stringArray', 1))]"
      }
    ]
  },
  "resources": [],
  "outputs": {}
}
```

The following example **fails** because the expression that references a variable is missing the leading square bracket (`[`).

```json
"outputs": {
  "outputVariable": {
    "type": "string",
    "value": " variables('varExample')]"
  }
}
```

The following example **passes** because the variable is referenced in `outputs`.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "itemCount": {
      "type": "int",
      "defaultValue": 5
    }
  },
  "variables": {
    "copy": [
      {
        "name": "stringArray",
        "count": "[parameters('itemCount')]",
        "input": "[concat('item', copyIndex('stringArray', 1))]"
      }
    ]
  },
  "resources": [],
  "outputs": {
    "arrayResult": {
      "type": "array",
      "value": "[variables('stringArray')]"
    }
  }
}
```

The following example **passes** because the expression is valid.

```json
"outputs": {
  "outputVariable": {
    "type": "string",
    "value": "[variables('varExample')]"
  }
}
```

## Dynamic variable should not use concat

Test name: **Dynamic Variable References Should Not Use Concat**

Sometimes you need to dynamically construct a variable based on the value of another variable or parameter. Don't use the [concat](template-functions-string.md#concat) function when setting the value. Instead, use an object that includes the available options and dynamically get one of the properties from the object during deployment.

The following example **passes**. The `currentImage` variable is dynamically set during deployment.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "osType": {
      "type": "string",
      "allowedValues": [
        "Windows",
        "Linux"
      ]
    }
  },
  "variables": {
    "imageOS": {
      "Windows": {
        "image": "Windows Image"
      },
      "Linux": {
        "image": "Linux Image"
      }
    },
    "currentImage": "[variables('imageOS')[parameters('osType')].image]"
  },
  "resources": [],
  "outputs": {
    "result": {
      "type": "string",
      "value": "[variables('currentImage')]"
    }
  }
}
```

## Use recent API version

Test name: **apiVersions Should Be Recent**

The API version for each resource should use a recent version that's hard-coded as a string. The test evaluates the API version in your template against the resource provider's versions in the toolkit's cache. An API version that's less than two years old from the date the test was run is considered recent. Don't use a preview version when a more recent version is available.

A warning that an API version wasn't found only indicates the version isn't included in the toolkit's cache. Using the latest version of an API, which is recommended, can generate the warning.

Learn more about the [toolkit cache](https://github.com/Azure/arm-ttk/tree/master/arm-ttk/cache).

In Bicep, use [Linter rule - use recent API versions](../bicep/linter-rule-use-recent-api-versions.md).

The following example **fails** because the API version is more than two years old.

```json
"resources": [
  {
    "type": "Microsoft.Storage/storageAccounts",
    "apiVersion": "2019-06-01",
    "name": "storageaccount1",
    "location": "[parameters('location')]"
  }
]
```

The following example **fails** because a preview version is used when a newer version is available.

```json
"resources": [
  {
    "type": "Microsoft.Storage/storageAccounts",
    "apiVersion": "2020-08-01-preview",
    "name": "storageaccount1",
    "location": "[parameters('location')]"
  }
]
```

The following example **passes** because it's a recent version that's not a preview version.

```json
"resources": [
  {
    "type": "Microsoft.Storage/storageAccounts",
    "apiVersion": "2021-02-01",
    "name": "storageaccount1",
    "location": "[parameters('location')]"
  }
]
```

## Use hard-coded API version

Test name: **Providers apiVersions Is Not Permitted**

The API version for a resource type determines which properties are available. Provide a hard-coded API version in your template. Don't retrieve an API version that's determined during deployment because you won't know which properties are available.

The following example **fails**.

```json
"resources": [
  {
    "type": "Microsoft.Compute/virtualMachines",
    "apiVersion": "[providers('Microsoft.Compute', 'virtualMachines').apiVersions[0]]",
    ...
  }
]
```

The following example **passes**.

```json
"resources": [
  {
    "type": "Microsoft.Compute/virtualMachines",
    "apiVersion": "2020-12-01",
    ...
  }
]
```

## Properties can't be empty

Test name: **Template Should Not Contain Blanks**

Don't hard-code properties to an empty value. Empty values include null and empty strings, objects, or arrays. If a property is set to an empty value, remove that property from your template. You can set a property to an empty value during deployment, such as through a parameter.

The `template` property in a [nested template](linked-templates.md#nested-template) can include empty properties. For more information about nested templates, see [Microsoft.Resources deployments](/azure/templates/microsoft.resources/deployments).

The following example **fails** because there are empty properties.

```json
"resources": [
  {
    "type": "Microsoft.Storage/storageAccounts",
    "apiVersion": "2021-01-01",
    "name": "storageaccount1",
    "location": "[parameters('location')]",
    "sku": {},
    "kind": ""
  }
]
```

The following example **passes** because the properties include values.

```json
"resources": [
  {
    "type": "Microsoft.Storage/storageAccounts",
    "apiVersion": "2021-01-01",
    "name": "storageaccount1",
    "location": "[parameters('location')]",
    "sku": {
      "name": "Standard_LRS",
      "tier": "Standard"
    },
    "kind": "Storage"
  }
]
```

## Use Resource ID functions

Test name: **IDs Should Be Derived From ResourceIDs**

When specifying a resource ID, use one of the resource ID functions. The allowed functions are:

- [resourceId](template-functions-resource.md#resourceid)
- [subscriptionResourceId](template-functions-resource.md#subscriptionresourceid)
- [tenantResourceId](template-functions-resource.md#tenantresourceid)
- [extensionResourceId](template-functions-resource.md#extensionresourceid)

Don't use the concat function to create a resource ID.

In Bicep, use [Linter rule - use resource ID functions](../bicep/linter-rule-use-resource-id-functions.md).

The following example **fails**.

```json
"networkSecurityGroup": {
    "id": "[concat('/subscriptions/', subscription().subscriptionId, '/resourceGroups/', resourceGroup().name, '/providers/Microsoft.Network/networkSecurityGroups/', variables('networkSecurityGroupName'))]"
}
```

The next example **passes**.

```json
"networkSecurityGroup": {
    "id": "[resourceId('Microsoft.Network/networkSecurityGroups', variables('networkSecurityGroupName'))]"
}
```

## ResourceId function has correct parameters

Test name: **ResourceIds should not contain**

When generating resource IDs, don't use unnecessary functions for optional parameters. By default, the [resourceId](template-functions-resource.md#resourceid) function uses the current subscription and resource group. You don't need to provide those values.

The following example **fails** because you don't need to provide the current subscription ID and resource group name.

```json
"networkSecurityGroup": {
    "id": "[resourceId(subscription().subscriptionId, resourceGroup().name, 'Microsoft.Network/networkSecurityGroups', variables('networkSecurityGroupName'))]"
}
```

The next example **passes**.

```json
"networkSecurityGroup": {
    "id": "[resourceId('Microsoft.Network/networkSecurityGroups', variables('networkSecurityGroupName'))]"
}
```

This test applies to:

- [resourceId](template-functions-resource.md#resourceid)
- [subscriptionResourceId](template-functions-resource.md#subscriptionresourceid)
- [tenantResourceId](template-functions-resource.md#tenantresourceid)
- [extensionResourceId](template-functions-resource.md#extensionresourceid)
- [reference](template-functions-resource.md#reference)
- [list*](template-functions-resource.md#list)

For `reference` and `list*`, the test **fails** when you use `concat` to construct the resource ID.

## dependsOn best practices

Test name: **DependsOn Best Practices**

When setting the deployment dependencies, don't use the [if](template-functions-logical.md#if) function to test a condition. If one resource depends on a resource that's [conditionally deployed](conditional-resource-deployment.md), set the dependency as you would with any resource. When a conditional resource isn't deployed, Azure Resource Manager automatically removes it from the required dependencies.

The `dependsOn` element can't begin with a [concat](template-functions-array.md#concat) function.

In Bicep, use [Linter rule - no unnecessary dependsOn entries](../bicep/linter-rule-no-unnecessary-dependson.md).

The following example **fails** because it contains an `if` function.

```json
"dependsOn": [
  "[if(equals(parameters('newOrExisting'),'new'), variables('storageAccountName'), '')]"
]
```

The following example **fails** because it begins with `concat`.

```json
"dependsOn": [
  "[concat(variables('storageAccountName'))]"
]
```

The following example **passes**.

```json
"dependsOn": [
  "[variables('storageAccountName')]"
]
```

## Nested or linked deployments can't use debug

Test name: **Deployment Resources Must Not Be Debug**

When you define a [nested or linked template](linked-templates.md) with the `Microsoft.Resources/deployments` resource type, you can enable [debugging](/azure/templates/microsoft.resources/deployments#debugsetting-object). Debugging is used when you need to test a template but can expose sensitive information. Before the template is used in production, turn off debugging. You can remove the `debugSetting` object or change the `detailLevel` property to `none`.

The following example **fails**.

```json
"debugSetting": {
  "detailLevel": "requestContent"
}
```

The following example **passes**.

```json
"debugSetting": {
  "detailLevel": "none"
}
```

## Admin user names can't be literal value

Test name: **adminUsername Should Not Be A Literal**

When setting an `adminUserName`, don't use a literal value. Create a parameter for the user name and use an expression to reference the parameter's value.

In Bicep, use [Linter rule - admin user name should not be literal](../bicep/linter-rule-admin-username-should-not-be-literal.md).

The following example **fails** with a literal value.

```json
"osProfile":  {
  "adminUserName": "myAdmin"
}
```

The following example **passes** with an expression.

```json
"osProfile": {
  "adminUsername": "[parameters('adminUsername')]"
}
```

## Use latest VM image

Test name: **VM Images Should Use Latest Version**

This test is disabled, but the output shows that it passed. The best practice is to check your template for the following criteria:

If your template includes a virtual machine with an image, make sure it's using the latest version of the image.

In Bicep, use [Linter rule - use stable VM image](../bicep/linter-rule-use-stable-vm-image.md).

## Use stable VM images

Test name: **Virtual Machines Should Not Be Preview**

Virtual machines shouldn't use preview images. The test checks the `storageProfile` to verify that the `imageReference` doesn't use a string that contains _preview_. And that _preview_ isn't used in the `imageReference` properties `offer`, `sku`, or `version`.

For more information about the `imageReference` property, see [Microsoft.Compute virtualMachines](/azure/templates/microsoft.compute/virtualmachines#imagereference-object) and [Microsoft.Compute virtualMachineScaleSets](/azure/templates/microsoft.compute/virtualmachinescalesets#imagereference-object).

In Bicep, use [Linter rule - use stable VM image](../bicep/linter-rule-use-stable-vm-image.md).

The following example **fails** because `imageReference` is a string that contains _preview_.

```json
"properties": {
  "storageProfile": {
    "imageReference": "latest-preview"
  }
}
```

The following example **fails** when _preview_ is used in `offer`, `sku`, or `version`.

```json
"properties": {
  "storageProfile": {
    "imageReference": {
      "publisher": "Canonical",
      "offer": "UbuntuServer_preview",
      "sku": "16.04-LTS-preview",
      "version": "preview"
    }
  }
}
```

The following example **passes**.

```json
"storageProfile": {
  "imageReference": {
    "publisher": "Canonical",
    "offer": "UbuntuServer",
    "sku": "16.04-LTS",
    "version": "latest"
  }
}
```

## Don't use ManagedIdentity extension

Test name: **ManagedIdentityExtension must not be used**

Don't apply the `ManagedIdentity` extension to a virtual machine. The extension was deprecated in 2019 and should no longer be used.

## Outputs can't include secrets

Test name: **Outputs Must Not Contain Secrets**

Don't include any values in the `outputs` section that potentially exposes secrets. For example, secure parameters of type `secureString` or `secureObject`, or [list*](template-functions-resource.md#list) functions such as `listKeys`.

The output from a template is stored in the deployment history, so a malicious user could find that information.

In Bicep, use [Linter rule - outputs should not contain secrets](../bicep/linter-rule-outputs-should-not-contain-secrets.md).

The following example **fails** because it includes a secure parameter in an output value.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "secureParam": {
      "type": "secureString"
    }
  },
  "functions": [],
  "variables": {},
  "resources": [],
  "outputs": {
    "badResult": {
      "type": "string",
      "value": "[concat('this is the value ', parameters('secureParam'))]"
    }
  }
}
```

The following example **fails** because it uses a [list*](template-functions-resource.md#list) function in the outputs.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storageName": {
      "type": "string"
    }
  },
  "functions": [],
  "variables": {},
  "resources": [],
  "outputs": {
    "badResult": {
      "type": "object",
      "value": "[listKeys(resourceId('Microsoft.Storage/storageAccounts', parameters('storageName')), '2021-02-01')]"
    }
  }
}
```

## Use protectedSettings for commandToExecute secrets

Test name: **CommandToExecute Must Use ProtectedSettings For Secrets**

For resources with type `CustomScript`, use the encrypted `protectedSettings` when `commandToExecute` includes secret data such as a password. For example, secret data can be used in secure parameters of type `secureString` or `secureObject`, [list*](template-functions-resource.md#list) functions such as `listKeys`, or custom scripts.

Don't use secret data in the `settings` object because it uses clear text. For more information, see [Microsoft.Compute virtualMachines/extensions](/azure/templates/microsoft.compute/virtualmachines/extensions), [Windows](
/azure/virtual-machines/extensions/custom-script-windows), or [Linux](../../virtual-machines/extensions/custom-script-linux.md).

In Bicep, use [Linter rule - use protectedSettings for commandToExecute secrets](../bicep/linter-rule-protect-commandtoexecute-secrets.md).

The following example **fails** because `settings` uses `commandToExecute` with a secure parameter.

```json
"parameters": {
  "adminPassword": {
    "type": "secureString"
  }
}
...
"properties": {
  "type": "CustomScript",
  "settings": {
    "commandToExecute": "[parameters('adminPassword')]"
  }
}
```

The following example **fails** because `settings` uses `commandToExecute` with a `listKeys` function.

```json
"properties": {
  "type": "CustomScript",
  "settings": {
    "commandToExecute": "[listKeys(resourceId('Microsoft.Storage/storageAccounts', parameters('storageName')), '2021-02-01')]"
  }
}
```

The following example **passes** because `protectedSettings` uses `commandToExecute` with a secure parameter.

```json
"parameters": {
  "adminPassword": {
    "type": "secureString"
  }
}
...
"properties": {
  "type": "CustomScript",
  "protectedSettings": {
    "commandToExecute": "[parameters('adminPassword')]"
  }
}
```

The following example **passes** because `protectedSettings` uses `commandToExecute` with a `listKeys` function.

```json
"properties": {
  "type": "CustomScript",
  "protectedSettings": {
    "commandToExecute": "[listKeys(resourceId('Microsoft.Storage/storageAccounts', parameters('storageName')), '2021-02-01')]"
  }
}
```

## Use recent API versions in reference functions

Test name: **apiVersions Should Be Recent In Reference Functions**

The API version used in a [reference](template-functions-resource.md#reference) function must be recent and not a preview version. The test evaluates the API version in your template against the resource provider's versions in the toolkit's cache. An API version that's less than two years old from the date the test was run is considered recent.

A warning that an API version wasn't found only indicates the version isn't included in the toolkit's cache. Using the latest version of an API, which is recommended, can generate the warning.

Learn more about the [toolkit cache](https://github.com/Azure/arm-ttk/tree/master/arm-ttk/cache).

The following example **fails** because the API version is more than two years old.

```json
"outputs": {
  "stgAcct": {
    "type": "string",
    "value": "[reference(resourceId(parameters('storageResourceGroup'), 'Microsoft.Storage/storageAccounts', parameters('storageAccountName')), '2019-06-01')]"
  }
}
```

The following example **fails** because the API version is a preview version.

```json
"outputs": {
  "stgAcct": {
    "type": "string",
    "value": "[reference(resourceId(parameters('storageResourceGroup'), 'Microsoft.Storage/storageAccounts', parameters('storageAccountName')), '2020-08-01-preview')]"
  }
}
```

The following example **passes** because the API version less than two years old and isn't a preview version.

```json
"outputs": {
  "stgAcct": {
    "type": "string",
    "value": "[reference(resourceId(parameters('storageResourceGroup'), 'Microsoft.Storage/storageAccounts', parameters('storageAccountName')), '2021-02-01')]"
  }
}
```

## Use type and name in resourceId functions

Test name: **Resources Should Not Be Ambiguous**

This test is disabled, but the output shows that it passed. The best practice is to check your template for the following criteria:

A [resourceId](template-functions-resource.md#resourceid) must include a resource type and resource name. This test finds all the template's `resourceId` functions and verifies that the resource is used in the template with the correct syntax. Otherwise the function is considered ambiguous.

For example, a `resourceId` function is considered ambiguous:

- When a resource isn't found in the template and a resource group isn't specified.
- If a resource includes a condition and a resource group isn't specified.
- If a related resource contains some but not all of the name segments. For example, a child resource contains more than one name segment. For more information, see [resourceId remarks](template-functions-resource.md#remarks-3).

## Use inner scope for nested deployment secure parameters

Test name: **Secure Params In Nested Deployments**

Use the nested template's `expressionEvaluationOptions` object with `inner` scope to evaluate expressions that contain secure parameters of type `secureString` or `secureObject` or [list*](template-functions-resource.md#list) functions such as `listKeys`. If the `outer` scope is used, expressions are evaluated in clear text within the parent template's scope. The secure value is then visible to anyone with access to the deployment history. The default value of `expressionEvaluationOptions` is `outer`.

For more information about nested templates, see [Microsoft.Resources deployments](/azure/templates/microsoft.resources/deployments) and [Expression evaluation scope in nested templates](linked-templates.md#expression-evaluation-scope-in-nested-templates).

In Bicep, use [Linter rule - secure params in nested deploy](../bicep/linter-rule-secure-params-in-nested-deploy.md).

The following example **fails** because `expressionEvaluationOptions` uses `outer` scope to evaluate secure parameters or `list*` functions.

```json
"resources": [
  {
    "type": "Microsoft.Resources/deployments",
    "apiVersion": "2021-04-01",
    "name": "nestedTemplate",
    "properties": {
      "expressionEvaluationOptions": {
        "scope": "outer"
      }
    }
  }
]
```

The following example **passes** because `expressionEvaluationOptions` uses `inner` scope to evaluate secure parameters or `list*` functions.

```json
"resources": [
  {
    "type": "Microsoft.Resources/deployments",
    "apiVersion": "2021-04-01",
    "name": "nestedTemplate",
    "properties": {
      "expressionEvaluationOptions": {
        "scope": "inner"
      }
    }
  }
]
```

## Next steps

- To learn about running the test toolkit, see [Use ARM template test toolkit](test-toolkit.md).
- For a Learn module that covers using the test toolkit, see [Preview changes and validate Azure resources by using what-if and the ARM template test toolkit](/training/modules/arm-template-test/).
- To test parameter files, see [Test cases for parameter files](parameters.md).
- For createUiDefinition tests, see [Test cases for createUiDefinition.json](createUiDefinition-test-cases.md).
- To learn about tests for all files, see [Test cases for all files](all-files-test-cases.md).
