<properties
   pageTitle="Using linked templates with Azure Resource Manager"
   description="Describes how to use linked templates in an Azure Resource Manager template to create a modular template solution. Shows how to pass parameters values, specify a parameter file, and dynamically created URLs."
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
   ms.date="12/07/2015"
   ms.author="tomfitz"/>

# Using linked templates with Azure Resource Manager

From within one Azure Resource Manager template, you can link to another template which enables you to decompose your deployment into a set of targeted, purpose-specific templates. Just as with decomposing an application 
into a number of code classes, decomposition provides benefits in terms of testing, re-use, and readability.  

You can pass parameters from a main template to a linked template, and those parameters can directly map to parameters or variables exposed by the calling template. The linked template can also pass an output variable back 
to the source template, enabling a two-way data exchange between templates.

## Linking to a template

You create a link between two templates by adding a deployment resource within the main template that points to the linked template. You set the **templateLink** property to the URI of the linked template. You can 
provide parameter values for the linked template either by specifying the values directly in your template or by 
linking to a parameter file. The following example uses the **parameters** property to specify a paramter value directly.

    "resources": [ 
      { 
         "apiVersion": "2015-01-01", 
         "name": "nestedTemplate", 
         "type": "Microsoft.Resources/deployments", 
         "properties": { 
           "mode": "incremental", 
           "templateLink": {
              "uri": "https://www.contoso.com/AzureTemplates/newStorageAccount.json",
              "contentVersion": "1.0.0.0"
           }, 
           "parameters": { 
              "StorageAccountName":{"value": "[parameters('StorageAccountName')]"} 
           } 
         } 
      } 
    ] 

The Resource Manager service must be able to access the linked template, which means you cannot specify a local file or a file that is only available on your local network for the linked template. You can only provide a URI value that includes either **http** or **https**. One option is to place your linked template in a storage account, and use the URI for that item, such as shown below.

    "templateLink": {
        "uri": "http://mystorageaccount.blob.core.windows.net/templates/template.json",
        "contentVersion": "1.0.0.0",
    }


## Linking to a parameter file

The next example uses the **parametersLink** property to link to a parameter file.

    "resources": [ 
      { 
         "apiVersion": "2015-01-01", 
         "name": "nestedTemplate", 
         "type": "Microsoft.Resources/deployments", 
         "properties": { 
           "mode": "incremental", 
           "templateLink": {
              "uri":"https://www.contoso.com/AzureTemplates/newStorageAccount.json",
              "contentVersion":"1.0.0.0"
           }, 
           "parametersLink": { 
              "uri":"https://www.contoso.com/AzureTemplates/parameters.json",
              "contentVersion":"1.0.0.0"
           } 
         } 
      } 
    ] 

The the URI value for the linked parameter file cannot be a local file, and must include either **http** or **https**.

## Using variables to link templates

The previous examples showed hard-coded URL values for the template links. This approach might work for a simple template but it does not work well when working with a large set of modular templates. Instead, you can create a static variable that stores a base URL 
for the main template and then dynamically create URLs for the linked templates from that base URL. The benefit of this approach is you can 
easily move or fork the template because you only need to change the static variable in the main template. The main template passes the correct URIs throughout the decomposed template.

The following example shows how to use a base URL to create two URLs for linked templates (**sharedTemplateUrl** and **vmTemplate**). 

    "variables": {
        "templateBaseUrl": "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/postgresql-on-ubuntu/",
        "sharedTemplateUrl": "[concat(variables('templateBaseUrl'), 'shared-resources.json')]",
        "tshirtSizeSmall": {
            "vmSize": "Standard_A1",
            "diskSize": 1023,
            "vmTemplate": "[concat(variables('templateBaseUrl'), 'database-2disk-resources.json')]",
            "vmCount": 2,
            "slaveCount": 1,
            "storage": {
                "name": "[parameters('storageAccountNamePrefix')]",
                "count": 1,
                "pool": "db",
                "map": [0,0],
                "jumpbox": 0
            }
        }
    }

You can also use [deployment()](../resource-group-template-functions/#deployment) to get the base URL for the current template, and use that to get the URL for other templates in the same location. This is useful if your template location changes (maybe due to versioning) or you want to avoid hard coding URLs in the template file. 

    "variables": {
        "sharedTemplateUrl": "[uri(deployment().properties.templateLink.uri, 'shared-resources.json')]"
    }

## Passing values back from a linked template

If you need to pass a value from linked template to the main template, you can create a value in **outputs** section of the linked template. For an example, see 
[Sharing State in Azure Resource Manager Templates](best-practices-resource-manager-state.md).

## Next steps
- [Authoring templates](./resource-group-authoring-templates.md)
- [Deploying templates](resource-group-template-deploy.md)
