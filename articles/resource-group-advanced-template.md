<properties
   pageTitle="Azure Resource Manager Advanced Template Operations"
   description="Describes how to use nested templates and the copy operation in an Azure Resource Manager template when deploying apps to Azure."
   services="na"
   documentationCenter="na"
   authors="tfitzmac"
   manager="wpickett"
   editor=""/>

<tags
   ms.service="na"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="AzurePortal"
   ms.workload="na"
   ms.date="06/29/2015"
   ms.author="tomfitz"/>

# Advanced Template Operations

This topic describes the copy operation and nested templates which you can use to perform more advanced tasks when deploying resources to Azure.

## copy

Enables you to iterate a specified number of times when deploying a resource.
   
The copy operation is particularly helpful when working with arrays because you can iterate through each element in the array. The **copyIndex()** function returns the current value for the iteration. You can deploy three web sites named:

- examplecopy-Contoso
- examplecopy-Fabrikam
- examplecopy-Coho

with the following template.

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

You can also use the copy operation without an array. For example, you might want to add an incrementing number to the end of each resource name that is deployed. You can deploys three web sites named:

- examplecopy-0
- examplecopy-1
- examplecopy-2.

with the following template.

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

You'll notice in the previous example that the index value goes from zero to 2. To offset the index value, you can pass a value in the **copyIndex()** function, such as **copyIndex(1)**. The number of iterations to perform is still specified in the copy element, but the value of copyIndex is offset by the specified value. So, using the same template as the previous example, but specifying **copyIndex(1)** would deploy three web sites named:

- examplecopy-1
- examplecopy-2
- examplecopy-3

## Nested template

You may need to merge two templates together, or launch a child template from a parent. You can accomplish this through the use of a deployment resource within the master template that points to the nested template. You set the **templateLink** property to the URI of the nested template. You can provide parameter values for the nested template either by specifying the values directly in your template or by linking to a parameter file. The first example uses the **parameters** property to specify a paramter value directly.

    "resources": [ 
      { 
         "apiVersion": "2015-01-01", 
         "name": "nestedTemplate", 
         "type": "Microsoft.Resources/deployments", 
         "properties": { 
           "mode": "incremental", 
           "templateLink": {
              "uri": "https://www.contoso.com/ArmTemplates/newStorageAccount.json",
              "contentVersion": "1.0.0.0"
           }, 
           "parameters": { 
              "StorageAccountName":{"value": "[parameters('StorageAccountName')]"} 
           } 
         } 
      } 
    ] 

The next example uses the **parametersLink** property to link to a parameter file.

    "resources": [ 
      { 
         "apiVersion": "2015-01-01", 
         "name": "nestedTemplate", 
         "type": "Microsoft.Resources/deployments", 
         "properties": { 
           "mode": "incremental", 
           "templateLink": {
              "uri":"https://www.contoso.com/ArmTemplates/newStorageAccount.json",
              "contentVersion":"1.0.0.0"
           }, 
           "parametersLink": { 
              "uri":"https://www.contoso.com/ArmTemplates/parameters.json",
              "contentVersion":"1.0.0.0"
           } 
         } 
      } 
    ] 

## Next Steps
- [Authoring Azure Resource Manager Templates](./resource-group-authoring-templates.md)
- [Azure Resource Manager Template Functions](./resource-group-template-functions.md)
- [Deploy an application with Azure Resource Manager Template](azure-portal/resource-group-template-deploy.md)
- [Azure Resource Manager Overview](./resource-group-overview.md)
