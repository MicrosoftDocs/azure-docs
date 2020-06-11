---
title: ARM template test toolkit
description: Describes how to run the ARM template test toolkit on your template. The toolkit lets you see if you have implemented recommended practices.
ms.topic: conceptual
ms.date: 06/11/2020
ms.author: tomfitz
author: tfitzmac
---

# Use ARM template test toolkit

The following sections of this article provide a description of each test including its name.

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

## Use Resource ID functions

Test name: **IDs Should Be Derived From ResourceIDs**

When specifying a resource ID, use one of the resource ID functions. The allowed functions are:

* [resourceId](template-functions-resource.md#resourceid)
* [subscriptionResourceId](template-functions-resource.md#subscriptionresourceid)
* [tenantResourceId](template-functions-resource.md#tenantresourceid)
* [extensionResourceId](template-functions-resource.md#extensionresourceid)

The following example **passes** this test.

```json
"networkSecurityGroup": {
    "id": "[resourceId('Microsoft.Network/networkSecurityGroups', variables('networkSecurityGroupName'))]"
}
```

Don't use the concat function to create a resource ID. The following example **fails** this test.

```json
"networkSecurityGroup": {
    "id": "[concat('/subscriptions/', subscription().subscriptionId, '/resourceGroups/', resourceGroup().name, '/providers/Microsoft.Network/networkSecurityGroups/', variables('networkSecurityGroupName'))]"
}
```

## ResourceId function has correct parameters

Test name: **ResourceIds should not contain**

When generating resource IDs, don't use unnecessary functions for optional parameters. By default, the [resourceId](template-functions-resource.md#resourceid) function uses the current subscription and resource group. You don't need to provide those values.  

The following example **passes** this test.

```json
"networkSecurityGroup": {
    "id": "[resourceId('Microsoft.Network/networkSecurityGroups', variables('networkSecurityGroupName'))]"
}
```

The following example **fails** this test, because you don't need to provide the current subscription ID and resource group name.

```json
"networkSecurityGroup": {
    "id": "[resourceId(subscription().subscriptionId, resourceGroup().name, 'Microsoft.Network/networkSecurityGroups', variables('networkSecurityGroupName'))]"
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

## Location uses parameter

Test name: **Location Should Not Be Hardcoded**

When defining the location for each resource, use a parameter. Users of your template may have limited regions available to them. By providing a location parameter, those users can specify a location that is available to them. When you set the location to a hardcoded value, the user might be unable to deploy your template. 

In some cases, one user sets up the resource groups and other users deploy resources to the resource group. When you set the resource location to `"[resourceGroup().location]"`, the resource group may have been created by in a region that other users can't access. Again, those users are blocked from using the template.

Instead, create a parameter that allows users to use the resource group location or provide a different value.

```json
"parameters": {
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": {
        "description": "Location for the resources."
      }
    }
}
```

Set the resource location to that parameter.

```json
"resources": [
    {
        "type": "Microsoft.Storage/storageAccounts",
        "apiVersion": "2019-06-01",
        "name": "[parameters('storageAccountName')]",
        "location": "[parameters('location')]",
        "kind": "Storage",
        "sku": {
            "name": "[parameters('storageAccountType')]"
        }
    }
]
```

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

## Declared variables must be used

Test name: **Variables Must Be Referenced**

To reduce confusion in your template, delete any variables that are defined but not used. This test finds any variables that aren't used anywhere in the template.

## Secure parameters can't have default value

Test name: **Secure String Parameters Cannot Have Default**

Don't provide a hard-coded default value for a secure parameter in your template.

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

## Properties can't be empty

Test name: **Template Should Not Contain Blanks**

Don't hardcode properties to an empty value. Empty values include null and empty strings, objects, or arrays. If you've set a property to an empty value, remove that property from your template. However, it's okay to set a property to an empty value during deployment, such as through a parameter.

## Use latest image

Test name: **VM Images Should Use Latest Version**

If your template includes a virtual machine with an image, make sure it's using the latest version of the image.

## Use stable images

Test name: **Virtual-Machines-Should-Not-Be-Preview**

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

## Use parameter for VM size

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

## Use recent API version

The API version for each resource should use a recent version. The test evaluates the version you use against the versions available for that resource type.

## Use hardcoded API version

The API version for a resource type determines which properties are available for the resource. Provide a hardcoded API version in your template. Don't retrieve an API version that is determined during deployment. You won't know which properties are available.

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
