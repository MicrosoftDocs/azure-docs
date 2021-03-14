---
title: Test cases for test toolkit
description: Describes the tests that are run by the ARM template test toolkit.
ms.topic: conceptual
ms.date: 12/03/2020
ms.author: tomfitz
author: tfitzmac
---

# Default test cases for ARM template test toolkit

This article describes the default tests that are run with the [template test toolkit](test-toolkit.md). It provides examples that pass or fail the test. It includes the name of each test.

## Use correct schema

Test name: **DeploymentTemplate Schema Is Correct**

In your template, you must specify a valid schema value.

The following example **passes** this test.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {},
  "resources": []
}
```

The schema property in the template must be set to one of the following schemas:

* `https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#`
* `https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#`
* `https://schema.management.azure.com/schemas/2018-05-01/subscriptionDeploymentTemplate.json#`
* `https://schema.management.azure.com/schemas/2019-08-01/tenantDeploymentTemplate.json#`
* `https://schema.management.azure.com/schemas/2019-08-01/managementGroupDeploymentTemplate.json`

## Parameters must exist

Test name: **Parameters Property Must Exist**

Your template should have a parameters element. Parameters are essential for making your templates reusable in different environments. Add parameters to your template for values that change when deploying to different environments.

The following example **passes** this test:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
      "vmName": {
          "type": "string",
          "defaultValue": "linux-vm",
          "metadata": {
            "description": "Name for the Virtual Machine."
          }
      }
  },
  ...
```

## Declared parameters must be used

Test name: **Parameters Must Be Referenced**

To reduce confusion in your template, delete any parameters that are defined but not used. This test finds any parameters that aren't used anywhere in the template. Eliminating unused parameters also makes it easier to deploy your template because you don't have to provide unnecessary values.

## Secure parameters can't have hardcoded default

Test name: **Secure String Parameters Cannot Have Default**

Don't provide a hard-coded default value for a secure parameter in your template. An empty string is fine for the default value.

You use the types **SecureString** or **SecureObject** on parameters that contain sensitive values, like passwords. When a parameter uses a secure type, the value of the parameter isn't logged or stored in the deployment history. This action prevents a malicious user from discovering the sensitive value.

However, when you provide a default value, that value is discoverable by anyone who can access the template or the deployment history.

The following example **fails** this test:

```json
"parameters": {
    "adminPassword": {
        "defaultValue": "HardcodedPassword",
        "type": "SecureString"
    }
}
```

The next example **passes** this test:

```json
"parameters": {
    "adminPassword": {
        "type": "SecureString"
    }
}
```

## Environment URLs can't be hardcoded

Test name: **DeploymentTemplate Must Not Contain Hardcoded Uri**

Don't hardcode environment URLs in your template. Instead, use the [environment function](template-functions-deployment.md#environment) to dynamically get these URLs during deployment. For a list of the URL hosts that are blocked, see the [test case](https://github.com/Azure/arm-ttk/blob/master/arm-ttk/testcases/deploymentTemplate/DeploymentTemplate-Must-Not-Contain-Hardcoded-Uri.test.ps1).

The following example **fails** this test because the URL is hardcoded.

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

The following example **passes** this test.

```json
"variables": {
    "AzureSchemaURL": "[environment().gallery]"
},
```

## Location uses parameter

Test name: **Location Should Not Be Hardcoded**

Your templates should have a parameter named location. Use this parameter for setting the location of resources in your template. In the main template (named azuredeploy.json or mainTemplate.json), this parameter can default to the resource group location. In linked or nested templates, the location parameter shouldn't have a default location.

Users of your template may have limited regions available to them. When you hard code the resource location, users may be blocked from creating a resource in that region. Users could be blocked even if you set the resource location to `"[resourceGroup().location]"`. The resource group may have been created in a region that other users can't access. Those users are blocked from using the template.

By providing a location parameter that defaults to the resource group location, users can use the default value when convenient but also specify a different location.

The following example **fails** this test because location on the resource is set to `resourceGroup().location`.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {},
    "variables": {},
    "resources": [
        {
            "type": "Microsoft.Storage/storageAccounts",
            "apiVersion": "2019-06-01",
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

The next example uses a location parameter but **fails** this test because the location parameter defaults to a hardcoded location.

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
            "apiVersion": "2019-06-01",
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

Instead, create a parameter that defaults to the resource group location but allows users to provide a different value. The following example **passes** this test when the template is used as the main template.

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
            "apiVersion": "2019-06-01",
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

However, if the preceding example is used as a linked template, the test **fails**. When used as a linked template, remove the default value.

## Resources should have location

Test name: **Resources Should Have Location**

The location for a resource should be set to a [template expression](template-expressions.md) or `global`. The template expression would typically use the location parameter described in the previous test.

The following example **fails** this test because the location isn't an expression or `global`.

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
            "apiVersion": "2019-06-01",
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

The following example **passes** this test.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {},
    "functions": [],
    "variables": {},
    "resources": [
        {
            "type": "Microsoft.Maps/accounts",
            "apiVersion": "2020-02-01-preview",
            "name": "demoMap",
            "location": "global",
            "sku": {
                "name": "S0"
            }
        }
    ],
    "outputs": {
    }
}
```

The next example also **passes** this test.

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
            "apiVersion": "2019-06-01",
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

Don't hardcode the virtual machine size. Provide a parameter so users of your template can modify the size of the deployed virtual machine.

The following example **fails** this test.

```json
"hardwareProfile": {
    "vmSize": "Standard_D2_v3"
}
```

Instead, provide a parameter.

```json
"vmSize": {
    "type": "string",
    "defaultValue": "Standard_A2_v2",
    "metadata": {
        "description": "Size for the Virtual Machine."
    }
},
```

Then, set the VM size to that parameter.

```json
"hardwareProfile": {
    "vmSize": "[parameters('vmSize')]"
},
```

## Min and max values are numbers

Test name: **Min And Max Value Are Numbers**

If you define min and max values for a parameter, specify them as numbers.

The following example **fails** this test:

```json
"exampleParameter": {
    "type": "int",
    "minValue": "0",
    "maxValue": "10"
},
```

Instead, provide the values as numbers. The following example **passes** this test:

```json
"exampleParameter": {
    "type": "int",
    "minValue": 0,
    "maxValue": 10
},
```

You also get this warning if you provide a min or max value, but not the other.

## Artifacts parameter defined correctly

Test name: **artifacts parameter**

When you include parameters for `_artifactsLocation` and `_artifactsLocationSasToken`, use the correct defaults and types. The following conditions must be met to pass this test:

* if you provide one parameter, you must provide the other
* `_artifactsLocation` must be a **string**
* `_artifactsLocation` must have a default value in the main template
* `_artifactsLocation` can't have a default value in a nested template 
* `_artifactsLocation` must have either `"[deployment().properties.templateLink.uri]"` or the raw repo URL for its default value
* `_artifactsLocationSasToken` must be a **secureString**
* `_artifactsLocationSasToken` can only have an empty string for its default value
* `_artifactsLocationSasToken` can't have a default value in a nested template 

## Declared variables must be used

Test name: **Variables Must Be Referenced**

To reduce confusion in your template, delete any variables that are defined but not used. This test finds any variables that aren't used anywhere in the template.

## Dynamic variable should not use concat

Test name: **Dynamic Variable References Should Not Use Concat**

Sometimes you need to dynamically construct a variable based on the value of another variable or parameter. Don't use the [concat](template-functions-string.md#concat) function when setting the value. Instead, use an object that includes the available options and dynamically get one of the properties from the object during deployment.

The following example **passes** this test. The **currentImage** variable is dynamically set during deployment.

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

The API version for each resource should use a recent version. The test evaluates the version you use against the versions available for that resource type.

## Use hardcoded API version

Test name: **Providers apiVersions Is Not Permitted**

The API version for a resource type determines which properties are available. Provide a hard-coded API version in your template. Don't retrieve an API version that is determined during deployment. You won't know which properties are available.

The following example **fails** this test.

```json
"resources": [
    {
        "type": "Microsoft.Compute/virtualMachines",
        "apiVersion": "[providers('Microsoft.Compute', 'virtualMachines').apiVersions[0]]",
        ...
    }
]
```

The following example **passes** this test.

```json
"resources": [
    {
       "type": "Microsoft.Compute/virtualMachines",
       "apiVersion": "2019-12-01",
       ...
    }
]
```

## Properties can't be empty

Test name: **Template Should Not Contain Blanks**

Don't hardcode properties to an empty value. Empty values include null and empty strings, objects, or arrays. If you've set a property to an empty value, remove that property from your template. However, it's okay to set a property to an empty value during deployment, such as through a parameter.

## Use Resource ID functions

Test name: **IDs Should Be Derived From ResourceIDs**

When specifying a resource ID, use one of the resource ID functions. The allowed functions are:

* [resourceId](template-functions-resource.md#resourceid)
* [subscriptionResourceId](template-functions-resource.md#subscriptionresourceid)
* [tenantResourceId](template-functions-resource.md#tenantresourceid)
* [extensionResourceId](template-functions-resource.md#extensionresourceid)

Don't use the concat function to create a resource ID. The following example **fails** this test.

```json
"networkSecurityGroup": {
    "id": "[concat('/subscriptions/', subscription().subscriptionId, '/resourceGroups/', resourceGroup().name, '/providers/Microsoft.Network/networkSecurityGroups/', variables('networkSecurityGroupName'))]"
}
```

The next example **passes** this test.

```json
"networkSecurityGroup": {
    "id": "[resourceId('Microsoft.Network/networkSecurityGroups', variables('networkSecurityGroupName'))]"
}
```

## ResourceId function has correct parameters

Test name: **ResourceIds should not contain**

When generating resource IDs, don't use unnecessary functions for optional parameters. By default, the [resourceId](template-functions-resource.md#resourceid) function uses the current subscription and resource group. You don't need to provide those values.  

The following example **fails** this test, because you don't need to provide the current subscription ID and resource group name.

```json
"networkSecurityGroup": {
    "id": "[resourceId(subscription().subscriptionId, resourceGroup().name, 'Microsoft.Network/networkSecurityGroups', variables('networkSecurityGroupName'))]"
}
```

The next example **passes** this test.

```json
"networkSecurityGroup": {
    "id": "[resourceId('Microsoft.Network/networkSecurityGroups', variables('networkSecurityGroupName'))]"
}
```

This test applies to:

* [resourceId](template-functions-resource.md#resourceid)
* [subscriptionResourceId](template-functions-resource.md#subscriptionresourceid)
* [tenantResourceId](template-functions-resource.md#tenantresourceid)
* [extensionResourceId](template-functions-resource.md#extensionresourceid)
* [reference](template-functions-resource.md#reference)
* [list*](template-functions-resource.md#list)

For `reference` and `list*`, the test **fails** when you use `concat` to construct the resource ID.

## dependsOn best practices

Test name: **DependsOn Best Practices**

When setting the deployment dependencies, don't use the [if](template-functions-logical.md#if) function to test a condition. If one resource depends on a resource that is [conditionally deployed](conditional-resource-deployment.md), set the dependency as you would with any resource. When a conditional resource isn't deployed, Azure Resource Manager automatically removes it from the required dependencies.

The following example **fails** this test.

```json
"dependsOn": [
    "[if(equals(parameters('newOrExisting'),'new'), variables('storageAccountName'), '')]"
]
```

The next example **passes** this test.

```json
"dependsOn": [
    "[variables('storageAccountName')]"
]
```

## Nested or linked deployments can't use debug

Test name: **Deployment Resources Must Not Be Debug**

When you define a [nested or linked template](linked-templates.md) with the **Microsoft.Resources/deployments** resource type, you can enable debugging for that template. Debugging is fine when you need to test that template but should be turned when you're ready to use the template in production.

## Admin user names can't be literal value

Test name: **adminUsername Should Not Be A Literal**

When setting an admin user name, don't use a literal value.

The following example **fails** this test:

```json
"osProfile":  {
    "adminUserName":  "myAdmin"
},
```

Instead, use a parameter. The following example **passes** this test:

```json
"osProfile": {
    "adminUsername": "[parameters('adminUsername')]"
}
```

## Use latest VM image

Test name: **VM Images Should Use Latest Version**

If your template includes a virtual machine with an image, make sure it's using the latest version of the image.

## Use stable VM images

Test name: **Virtual Machines Should Not Be Preview**

Virtual machines shouldn't use preview images.

The following example **fails** this test.

```json
"imageReference": {
    "publisher": "Canonical",
    "offer": "UbuntuServer",
    "sku": "16.04-LTS",
    "version": "latest-preview"
}
```

The following example **passes** this test.

```json
"imageReference": {
    "publisher": "Canonical",
    "offer": "UbuntuServer",
    "sku": "16.04-LTS",
    "version": "latest"
},
```

## Don't use ManagedIdentity extension

Test name: **ManagedIdentityExtension must not be used**

Don't apply the ManagedIdentity extension to a virtual machine. For more information, see [How to stop using the virtual machine managed identities extension and start using the Azure Instance Metadata Service](../../active-directory/managed-identities-azure-resources/howto-migrate-vm-extension.md).

## Outputs can't include secrets

Test name: **Outputs Must Not Contain Secrets**

Don't include any values in the outputs section that potentially expose secrets. The output from a template is stored in the deployment history, so a malicious user could find that information.

The following example **fails** the test because it includes a secure parameter in an output value.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "secureParam": {
            "type": "securestring"
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
            "value": "[listKeys(resourceId('Microsoft.Storage/storageAccounts', parameters('storageName')), '2019-06-01')]"
        }
    }
}
```

## Next steps

- To learn about running the test toolkit, see [Use ARM template test toolkit](test-toolkit.md).
- For a Microsoft Learn module that covers using the test toolkit, see [Preview changes and validate Azure resources by using what-if and the ARM template test toolkit](/learn/modules/arm-template-test/).