<properties
   pageTitle="Deploy Multiple Instances of Resources | Microsoft Azure"
   description="Use copy operation and arrays in an Azure Resource Manager template to iterate multiple times when deploying resources."
   services="azure-resource-manager"
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
   ms.date="10/20/2015"
   ms.author="tomfitz"/>

# Create multiple instances of resources in Azure Resource Manager

This topic shows you how to iterate in your Azure Resource Manager template to create multiple instances of a resource.

## copy, copyIndex, and length

Within the resource to create multiple times, you can define a **copy** object that specifies the number of times to iterate. The copy takes the following format:

    "copy": { 
        "name": "websitescopy", 
        "count": "[parameters('count')]" 
    } 

You can access the current iteration value with the **copyIndex()** function, such as shown below within the concat function.

    [concat('examplecopy-', copyIndex())]

When creating multiple resources from an array of values, you can use the **length** function to specify the count. You provide the array as the parameter to the length function.

    "copy": {
        "name": "websitescopy",
        "count": "[length(parameters('siteNames'))]"
    }

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

Of course, you set the copy count to a value other than the length of the array. For example, you could create an array with many values, and then pass in a parameter value that specifies how many of the array elements to deploy. In that case, you set the copy count as shown in the first example. 

## Depending on resources in a loop

You can specify that a resource be deployed after another resource by using the **dependsOn** element. When you need to deploy a resource that depends on the collection of resources in a loop, you can use provide the 
name of the copy loop in the **dependsOn** element. The following example shows how to deploy 3 storage accounts before deploying the Virtual Machine. The full Virtual Machine definition is not shown. Notice that the 
copy element has **name** set to **storagecopy** and the **dependsOn** element for the Virtual Machines is also set to **storagecopy**.

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

## Next steps
- If you want to learn about the sections of a template, see [Authoring Azure Resource Manager Templates](./resource-group-authoring-templates.md).
- For all of the functions you can use in a template, see [Azure Resource Manager Template Functions](./resource-group-template-functions.md).
- To learn how to deploy your template, see [Deploy an application with Azure Resource Manager Template](azure-portal/resource-group-template-deploy.md).
