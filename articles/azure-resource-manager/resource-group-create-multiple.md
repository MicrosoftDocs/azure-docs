---
title: Deploy multiple instances of Azure resources | Microsoft Docs
description: Use copy operation and arrays in an Azure Resource Manager template to iterate multiple times when deploying resources.
services: azure-resource-manager
documentationcenter: na
author: tfitzmac
manager: timlt
editor: ''

ms.assetid: 94d95810-a87b-460f-8e82-c69d462ac3ca
ms.service: azure-resource-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/17/2017
ms.author: tomfitz

---
# Deploy multiple instances of resources in Azure Resource Manager templates
This topic shows you how to iterate in your Azure Resource Manager template to create multiple instances of a resource.

## copy and copyIndex
The resource to create multiple times takes the following format:

```json
"resources": [ 
  { 
      "name": "[concat('examplecopy-', copyIndex())", 
      "type": "Microsoft.Web/sites", 
      "location": "East US", 
      "apiVersion": "2015-08-01",
      "copy": { 
         "name": "websitescopy", 
         "count": "[parameters('count')]" 
      }, 
      "properties": {
          "serverFarmId": "hostingPlanName"
      } 
  } 
]
```

Notice that the number of times to iterate is specified in the copy object:

```json
"copy": { 
    "name": "websitescopy", 
    "count": "[parameters('count')]" 
} 
```

The count value must be a positive integer and cannot exceed 800.

Notice that the name of each resource includes the `copyIndex()` function, which returns the current iteration in the loop.

```json
"name": "[concat('examplecopy-', copyIndex())]",
```

If you deploy three web sites, they are named:

* examplecopy-0
* examplecopy-1
* examplecopy-2.

To offset the index value, you can pass a value in the copyIndex() function, such as `copyIndex(1)`. The number of iterations to perform is still specified in the copy element, but the value of copyIndex is offset by the specified value. So, using the same template as the previous example, but specifying copyIndex(1) would deploy three web sites named:

* examplecopy-1
* examplecopy-2
* examplecopy-3

Resource Manager creates the resources in parallel. Therefore, the order in which they are created is not guaranteed. To create iterated resources in sequence, see [Sequential looping for Azure Resource Manager templates](resource-manager-sequential-loop.md). 

You can only apply the copy object to a top-level resource. You cannot apply it to a property on a resource type, or to a child resource. The following pseudo-code example shows where copy can be applied:

```json
"resources": [
  {
    "type": "{provider-namespace-and-type}",
    "name": "parentResource",
    "copy": {  
      /* Yes, copy can be applied here */
    },
    "properties": {
      "exampleProperty": {
        /* No, copy cannot be applied here */
      }
    },
    "resources": [
      {
        "type": "{provider-type}",
        "name": "childResource",
        /* No, copy cannot be applied here. The resource must be promoted to top-level. */ 
      }
    ]
  }
] 
```

To iterate a child resource, see [Create multiple instances of a child resource](#create-multiple-instances-of-a-child-resource).

Although you cannot apply copy to a property, that property is still part of the iterations of the resource that contains the property. Therefore, you can use copyIndex() within the property to specify values. To create multiple values for a property, see [Create multiple instances of property on resource type](resource-manager-property-copy.md).

## Use copy with array
The copy operation is helpful when working with arrays because you can iterate through each element in the array. To deploy three web sites named:

* examplecopy-Contoso
* examplecopy-Fabrikam
* examplecopy-Coho

Use the following template:

```json
"parameters": { 
  "org": { 
     "type": "array", 
     "defaultValue": [ 
         "Contoso", 
         "Fabrikam", 
         "Coho" 
      ] 
  }
}, 
"resources": [ 
  { 
      "name": "[concat('examplecopy-', parameters('org')[copyIndex()])]", 
      "type": "Microsoft.Web/sites", 
      "location": "East US", 
      "apiVersion": "2015-08-01",
      "copy": { 
         "name": "websitescopy", 
         "count": "[length(parameters('org'))]" 
      }, 
      "properties": {
          "serverFarmId": "hostingPlanName"
      } 
  } 
]
```

Notice that the `length` function is used to specify the count. You provide the array as the parameter to the length function.

```json
"copy": {
    "name": "websitescopy",
    "count": "[length(parameters('siteNames'))]"
}
```

## Depend on resources in a loop
You specify that a resource is deployed after another resource by using the `dependsOn` element. To deploy a resource that depends on the collection of resources in a loop, provide the name of the copy loop in the dependsOn element. The following example shows how to deploy three storage accounts before deploying the Virtual Machine. The full Virtual Machine definition is not shown. Notice that the copy element has name set to `storagecopy` and the dependsOn element for the Virtual Machines is also set to `storagecopy`.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {},
    "resources": [
        {
            "apiVersion": "2015-06-15",
            "type": "Microsoft.Storage/storageAccounts",
            "name": "[concat('storage', uniqueString(resourceGroup().id), copyIndex())]",
            "location": "[resourceGroup().location]",
            "properties": {
                "accountType": "Standard_LRS"
            },
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

## Create multiple instances of a child resource
You cannot use a copy loop for a child resource. To create multiple instances of a resource that you typically define as nested within another resource, you must instead create that resource as a top-level resource. You define the relationship with the parent resource through the type and name properties.

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

To create multiple instances of data sets, move it outside of the data factory. The dataset must be at the same level as the data factory, but it is still a child resource of the data factory. You preserve the relationship between data set and data factory through the type and name properties. Since type can no longer be inferred from its position in the template, you must provide the fully qualified type in the format: `{resource-provider-namespace}/{parent-resource-type}/{child-resource-type}`.

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

## Next steps
* If you want to learn about the sections of a template, see [Authoring Azure Resource Manager Templates](resource-group-authoring-templates.md).
* To create iterated resources in sequence, see [Sequential looping for Azure Resource Manager templates](resource-manager-sequential-loop.md).
* To learn how to deploy your template, see [Deploy an application with Azure Resource Manager Template](resource-group-template-deploy.md).

