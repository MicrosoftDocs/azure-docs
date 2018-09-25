---
title: Deploy multiple instances of Azure resources | Microsoft Docs
description: Use copy operation and arrays in an Azure Resource Manager template to iterate multiple times when deploying resources.
services: azure-resource-manager
documentationcenter: na
author: tfitzmac
editor: ''

ms.service: azure-resource-manager
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/10/2018
ms.author: tomfitz

---
# Deploy multiple instances of a resource or property in Azure Resource Manager Templates

This article shows you how to iterate in your Azure Resource Manager template to create multiple instances of a resource. If you need to specify whether a resource is deployed at all, see [condition element](resource-manager-templates-resources.md#condition).

For a tutorial, see [Tutorial: create multiple resource instances using Resource Manager templates](./resource-manager-tutorial-create-multiple-instances.md).

## Resource iteration

When you must decide during deployment to create one or more instances of a resource, add a `copy` element to the resource type. In the copy element, you specify the number of iterations and a name for this loop. The count value must be a positive integer and can't exceed 800. 

The resource to create multiple times takes the following format:

```json
{
	"$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
	"contentVersion": "1.0.0.0",
	"resources": [
		{
			"apiVersion": "2016-01-01",
			"type": "Microsoft.Storage/storageAccounts",
			"name": "[concat(copyIndex(),'storage', uniqueString(resourceGroup().id))]",
			"location": "[resourceGroup().location]",
			"sku": {
				"name": "Standard_LRS"
			},
			"kind": "Storage",
			"properties": {},
			"copy": {
				"name": "storagecopy",
				"count": 3
			}
		}
	],
	"outputs": {}
}
```

Notice that the name of each resource includes the `copyIndex()` function, which returns the current iteration in the loop. `copyIndex()` is zero-based. So, the following example:

```json
"name": "[concat('storage', copyIndex())]",
```

Creates these names:

* storage0
* storage1
* storage2.

To offset the index value, you can pass a value in the copyIndex() function. The number of iterations to perform is still specified in the copy element, but the value of copyIndex is offset by the specified value. So, the following example:

```json
"name": "[concat('storage', copyIndex(1))]",
```

Creates these names:

* storage1
* storage2
* storage3

The copy operation is helpful when working with arrays because you can iterate through each element in the array. Use the `length` function on the array to specify the count for iterations, and `copyIndex` to retrieve the current index in the array. So, the following example:

```json
"parameters": { 
  "org": { 
     "type": "array", 
     "defaultValue": [ 
         "contoso", 
         "fabrikam", 
         "coho" 
      ] 
  }
}, 
"resources": [ 
  { 
      "name": "[concat('storage', parameters('org')[copyIndex()])]", 
      "copy": { 
         "name": "storagecopy", 
         "count": "[length(parameters('org'))]" 
      }, 
      ...
  } 
]
```

Creates these names:

* storagecontoso
* storagefabrikam
* storagecoho

By default, Resource Manager creates the resources in parallel. Therefore, the order in which they're created isn't guaranteed. However, you may want to specify that the resources are deployed in sequence. For example, when updating a production environment, you may want to stagger the updates so only a certain number are updated at any one time.

To serially deploy multiple instances of a resource, set `mode` to **serial** and `batchSize` to the number of instances to deploy at a time. With serial mode, Resource Manager creates a dependency on earlier instances in the loop, so it doesn't start one batch until the previous batch completes.

For example, to serially deploy storage accounts two at a time, use:

```json
{
	"$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
	"contentVersion": "1.0.0.0",
	"resources": [
		{
			"apiVersion": "2016-01-01",
			"type": "Microsoft.Storage/storageAccounts",
			"name": "[concat(copyIndex(),'storage', uniqueString(resourceGroup().id))]",
			"location": "[resourceGroup().location]",
			"sku": {
				"name": "Standard_LRS"
			},
			"kind": "Storage",
			"properties": {},
			"copy": {
				"name": "storagecopy",
				"count": 4,
                "mode": "serial",
                "batchSize": 2
			}
		}
	],
	"outputs": {}
}
``` 

The mode property also accepts **parallel**, which is the default value.

## Property iteration

To create multiple values for a property on a resource, add a `copy` array in the properties element. This array contains objects, and each object has the following properties:

* name - the name of the property to create multiple values for
* count - the number of values to create
* input - an object that contains the values to assign to the property  

The following example shows how to apply `copy` to the dataDisks property on a virtual machine:

```json
{
  "name": "examplevm",
  "type": "Microsoft.Compute/virtualMachines",
  "apiVersion": "2017-03-30",
  "properties": {
    "storageProfile": {
      "copy": [{
          "name": "dataDisks",
          "count": 3,
          "input": {
              "lun": "[copyIndex('dataDisks')]",
              "createOption": "Empty",
              "diskSizeGB": "1023"
          }
      }],
      ...
```

Notice that when using `copyIndex` inside a property iteration, you must provide the name of the iteration. You don't have to provide the name when used with resource iteration.

Resource Manager expands the `copy` array during deployment. The name of the array becomes the name of the property. The input values become the object properties. The deployed template becomes:

```json
{
  "name": "examplevm",
  "type": "Microsoft.Compute/virtualMachines",
  "apiVersion": "2017-03-30",
  "properties": {
    "storageProfile": {
      "dataDisks": [
          {
              "lun": 0,
              "createOption": "Empty",
              "diskSizeGB": "1023"
          },
          {
              "lun": 1,
              "createOption": "Empty",
              "diskSizeGB": "1023"
          },
          {
              "lun": 2,
              "createOption": "Empty",
              "diskSizeGB": "1023"
          }
      }],
      ...
```

The copy element is an array so you can specify more than one property for the resource. Add an object for each property to create.

```json
{
    "name": "string",
    "type": "Microsoft.Network/loadBalancers",
    "apiVersion": "2017-10-01",
    "properties": {
        "copy": [
          {
              "name": "loadBalancingRules",
              "count": "[length(parameters('loadBalancingRules'))]",
              "input": {
                ...
              }
          },
          {
              "name": "probes",
              "count": "[length(parameters('loadBalancingRules'))]",
              "input": {
                ...
              }
          }
        ]
    }
}
```

You can use resource and property iteration together. Reference the property iteration by name.

```json
{
    "type": "Microsoft.Network/virtualNetworks",
    "name": "[concat(parameters('vnetname'), copyIndex())]",
    "apiVersion": "2018-04-01",
    "copy":{
        "count": 2,
        "name": "vnetloop"
    },
    "location": "[resourceGroup().location]",
    "properties": {
        "addressSpace": {
            "addressPrefixes": [
                "[parameters('addressPrefix')]"
            ]
        },
        "copy": [
            {
                "name": "subnets",
                "count": 2,
                "input": {
                    "name": "[concat('subnet-', copyIndex('subnets'))]",
                    "properties": {
                        "addressPrefix": "[variables('subnetAddressPrefix')[copyIndex('subnets')]]"
                    }
                }
            }
        ]
    }
}
```

## Variable iteration

To create multiple instances of a variable, use the `copy` element in the variables section. You can create multiple instances of objects with related values, and then assign those values to instances of the resource. You can use copy to create either an object with an array property or an array. Both approaches are shown in the following example:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {},
  "variables": {
    "disk-array-on-object": {
      "copy": [
        {
          "name": "disks",
          "count": 5,
          "input": {
            "name": "[concat('myDataDisk', copyIndex('disks', 1))]",
            "diskSizeGB": "1",
            "diskIndex": "[copyIndex('disks')]"
          }
        }
      ]
    },
    "copy": [
      {
        "name": "disks-top-level-array",
        "count": 5,
        "input": {
          "name": "[concat('myDataDisk', copyIndex('disks-top-level-array', 1))]",
          "diskSizeGB": "1",
          "diskIndex": "[copyIndex('disks-top-level-array')]"
        }
      }
    ]
  },
  "resources": [],
  "outputs": {
    "exampleObject": {
      "value": "[variables('disk-array-on-object')]",
      "type": "object"
    },
    "exampleArrayOnObject": {
      "value": "[variables('disk-array-on-object').disks]",
      "type" : "array"
    },
    "exampleArray": {
      "value": "[variables('disks-top-level-array')]",
      "type" : "array"
    }
  }
}
```

With either approach, the copy element is an array so you can specify more than one variable. Add an object for each variable to create.

```json
"copy": [
  {
    "name": "first-variable",
    "count": 5,
    "input": {
      "demoProperty": "[concat('myProperty', copyIndex('first-variable'))]",
    }
  },
  {
    "name": "second-variable",
    "count": 3,
    "input": {
      "demoProperty": "[concat('myProperty', copyIndex('second-variable'))]",
    }
  },
]
```

## Depend on resources in a loop
You specify that a resource is deployed after another resource by using the `dependsOn` element. To deploy a resource that depends on the collection of resources in a loop, provide the name of the copy loop in the dependsOn element. The following example shows how to deploy three storage accounts before deploying the Virtual Machine. The full Virtual Machine definition isn't shown. Notice that the copy element has name set to `storagecopy` and the dependsOn element for the Virtual Machines is also set to `storagecopy`.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {},
    "resources": [
        {
			"apiVersion": "2016-01-01",
			"type": "Microsoft.Storage/storageAccounts",
			"name": "[concat(copyIndex(),'storage', uniqueString(resourceGroup().id))]",
			"location": "[resourceGroup().location]",
			"sku": {
				"name": "Standard_LRS"
			},
			"kind": "Storage",
			"properties": {},
			"copy": {
				"name": "storagecopy",
				"count": 3
			}
		},
        {
            "apiVersion": "2015-06-15", 
            "type": "Microsoft.Compute/virtualMachines", 
            "name": "[concat('VM', uniqueString(resourceGroup().id))]",  
            "dependsOn": ["storagecopy"],
            ...
        }
    ],
    "outputs": {}
}
```

<a id="looping-on-a-nested-resource" />

## Iteration for a child resource
You can't use a copy loop for a child resource. To create multiple instances of a resource that you typically define as nested within another resource, you must instead create that resource as a top-level resource. You define the relationship with the parent resource through the type and name properties.

For example, suppose you typically define a dataset as a child resource within a data factory.

```json
"resources": [
{
    "type": "Microsoft.DataFactory/datafactories",
    "name": "exampleDataFactory",
    ...
    "resources": [
    {
        "type": "datasets",
        "name": "exampleDataSet",
        "dependsOn": [
            "exampleDataFactory"
        ],
        ...
    }
}]
```

To create multiple instances of data sets, move it outside of the data factory. The dataset must be at the same level as the data factory, but it's still a child resource of the data factory. You preserve the relationship between data set and data factory through the type and name properties. Since type can no longer be inferred from its position in the template, you must provide the fully qualified type in the format: `{resource-provider-namespace}/{parent-resource-type}/{child-resource-type}`.

To establish a parent/child relationship with an instance of the data factory, provide a name for the data set that includes the parent resource name. Use the format: `{parent-resource-name}/{child-resource-name}`.  

The following example shows the implementation:

```json
"resources": [
{
    "type": "Microsoft.DataFactory/datafactories",
    "name": "exampleDataFactory",
    ...
},
{
    "type": "Microsoft.DataFactory/datafactories/datasets",
    "name": "[concat('exampleDataFactory', '/', 'exampleDataSet', copyIndex())]",
    "dependsOn": [
        "exampleDataFactory"
    ],
    "copy": { 
        "name": "datasetcopy", 
        "count": "3" 
    } 
    ...
}]
```

## Example templates

The following examples show common scenarios for creating multiple resources or properties.

|Template  |Description  |
|---------|---------|
|[Copy storage](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/multipleinstance/copystorage.json) |Deploys multiple storage accounts with an index number in the name. |
|[Serial copy storage](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/multipleinstance/serialcopystorage.json) |Deploys multiple storage accounts one at time. The name includes the index number. |
|[Copy storage with array](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/multipleinstance/copystoragewitharray.json) |Deploys multiple storage accounts. The name includes a value from an array. |
|[VM deployment with a variable number of data disks](https://github.com/Azure/azure-quickstart-templates/tree/master/101-vm-windows-copy-datadisks) |Deploys multiple data disks with a virtual machine. |
|[Copy variables](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/multipleinstance/copyvariables.json) |Demonstrates the different ways of iterating on variables. |
|[Multiple security rules](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/multipleinstance/multiplesecurityrules.json) |Deploys multiple security rules to a network security group. It constructs the security rules from a parameter. For the parameter, see [multiple NSG parameter file](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/multipleinstance/multiplesecurityrules.parameters.json). |

## Next steps

* To go through a tutorial, see [Tutorial: create multiple resource instances using Resource Manager templates](./resource-manager-tutorial-create-multiple-instances.md).

* If you want to learn about the sections of a template, see [Authoring Azure Resource Manager Templates](resource-group-authoring-templates.md).
* To learn how to deploy your template, see [Deploy an application with Azure Resource Manager Template](resource-group-template-deploy.md).

