<properties
   pageTitle="Create Multiple Instances of Resources"
   description="Describes how to use the copy operation in an Azure Resource Manager template to iterate multiple times when deploying resources."
   services="na"
   documentationCenter="na"
   authors="tfitzmac"
   manager="wpickett"
   editor=""/>

<tags
   ms.service="azure-resource-manager"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="07/14/2015"
   ms.author="tomfitz"/>

# Create Multiple Instances of Resources in Azure Resource Manager

This topic shows you how to iterate in your Azure Resource Manager template to create multiple instances of a resource.

## copy and copyIndex()

Within the resource to create multiple times, you can define a **copy** object that specifies the number of times to iterate. The copy takes the following format:

    "copy": { 
        "name": "websitescopy", 
        "count": "[parameters('count')]" 
    } 

You can access the current iteration value with the **copyIndex()** function, such as shown below within the concat function.

    [concat('examplecopy-', copyIndex())]

## Use index value in name

You can use the copy operation create multiple instances of a resource that are uniquely named based on the incrementing index. For example, you might want to add a unique number to the end of each 
resource name that is deployed. To deploy three web sites named:

- examplecopy-0
- examplecopy-1
- examplecopy-2.

Use the following template:

    "parameters": { 
      "count": { 
        "type": "int", 
        "defaultValue": 3 
      } 
    }, 
    "resources": [ 
      { 
          "name": "[concat('examplecopy-', copyIndex())]", 
          "type": "Microsoft.Web/sites", 
          "location": "East US", 
          "apiVersion": "2014-06-01",
          "copy": { 
             "name": "websitescopy", 
             "count": "[parameters('count')]" 
          }, 
          "properties": {} 
      } 
    ]

## Offset index value

You'll notice in the previous example that the index value goes from zero to 2. To offset the index value, you can pass a value in the **copyIndex()** function, such as **copyIndex(1)**. The number of iterations to perform is still specified in the copy element, but the value of copyIndex is offset by the specified value. So, using the same template as the previous example, but specifying **copyIndex(1)** would deploy three web sites named:

- examplecopy-1
- examplecopy-2
- examplecopy-3

## Use with array
   
The copy operation is particularly helpful when working with arrays because you can iterate through each element in the array. To deploy three web sites named:

- examplecopy-Contoso
- examplecopy-Fabrikam
- examplecopy-Coho

Use the following template:

    "parameters": { 
      "org": { 
         "type": "array", 
             "defaultValue": [ 
             "Contoso", 
             "Fabrikam", 
             "Coho" 
          ] 
      },
      "count": { 
         "type": "int", 
         "defaultValue": 3 
      } 
    }, 
    "resources": [ 
      { 
          "name": "[concat('examplecopy-', parameters('org')[copyIndex()])]", 
          "type": "Microsoft.Web/sites", 
          "location": "East US", 
          "apiVersion": "2014-06-01",
          "copy": { 
             "name": "websitescopy", 
             "count": "[parameters('count')]" 
          }, 
          "properties": {} 
      } 
    ]

## Next Steps
- [Authoring Azure Resource Manager Templates](./resource-group-authoring-templates.md)
- [Azure Resource Manager Template Functions](./resource-group-template-functions.md)
- [Deploy an application with Azure Resource Manager Template](azure-portal/resource-group-template-deploy.md)
