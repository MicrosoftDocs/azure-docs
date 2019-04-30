---
title: Create resource provider with Azure Custom Providers Preview
description: Describes how to create a resource provider and deploy its custom resource types.
services: managed-applications
author: MSEvanhi
ms.service: managed-applications
ms.topic: tutorial
ms.date: 04/30/2019
ms.author: evanhi
---

# Create custom provider and deploy custom resources

In this tutorial, you create your own resource provider and deploy custom resource types from that resource provider. For more information about creating custom providers, see [Azure Custom Providers Preview overview](custom-providers-overview.md).

## Deploy custom provider

Deploy to your Azure subscription an [example solution](https://github.com/raosuhas/managedapps-intro/blob/master/CustomRPWithFunction/azuredeploy.json). The template sets up your environment for the custom provider.

After deploying the template, your subscription has:

* Function App with the operations for resources and actions.
* Storage Account for storing users that are created through the custom provider.
* Custom Provider that defines the custom resource types and actions. It uses the function app endpoint for sending requests.
* Custom resource.

You can deploy the solution with the following button:

<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fraosuhas%2Fmanagedapps-intro%2Fmaster%2FCustomRPWithFunction%2Fazuredeploy.json" target="_blank">
    <img src="http://azuredeploy.net/deploybutton.png"/>
</a>

Or, for PowerShell, use:

```azurepowershell-interactive
New-AzResourceGroup -Name demogroup -Location eastus
New-AzResourceGroupDeployment -ResourceGroupName demogroup -TemplateUri https://raw.githubusercontent.com/raosuhas/managedapps-intro/master/CustomRPWithFunction/azuredeploy.json -funcname tffunc0430 -storageName tfstore0430
```

## View custom provider

The custom providers resource type is a hidden azure resources so to confirm that the resource provider has been deployed you will have to check the box that says Show hidden types in the azure portal browse page for the resource group.

![Show hidden resource types](./media/create-custom-providers/show-hidden.png)

```powershell
armclient get https://management.azure.com/subscriptions/0773a725-d727-4eb8-8cbd-9303ef1e07cc/resourceGroups/demogroup/providers/Microsoft.CustomProviders/resourceProviders/tffunc0430/users?api-version=2018-09-01-preview
```

## Call action

Create a ping
To make a ping request using our new Custom Provider, we will make a POST call with armclient to our Custom Provider instance:
POST  
https://management.azure.com/subscriptions/{subscriptionid}/resourceGroups/{resourcegroup}/providers/Microsoft.CustomProviders/resourceProviders/{customrpname}/ping?api-version=2018-09-01-preview
The code that enables this process is all implemented as part of the azure function that is deployed along with the template. Our ping call is built to ping back when called, replying with the following content: 
{'pingcontent': { 'source' : 'demofunc.azurewebsites.net' } , 'message' : 'hello demofunc.azurewebsites.net'}

## Create resource type

To make a new User request using the Custom Provider, we make a PUT call with armclient to our Custom Provider, passing the parameters for a new user in the body:
PUT
https://management.azure.com/subscriptions/{SubID}/resourceGroups/{resourceGroupID}/providers/Microsoft.CustomProviders/resourceProviders/{CustomRPName}/users/{NewUserName}?api-version=2018-09-01-preview "{'properties':{'FullName': 'Test User', 'Location': 'Earth'}}" 
Our Custom Provider will make a PUT call on its declared endpoint, the function we deployed in our template, which will add a new user to the storage account we created. You should get a response back like below:
{
  "properties": {
    "provisioningState": "Succeeded",
    "FullName": "Test User",
    "Location": "Earth"
  },
  "id": "/subscriptions/{SubID}/resourceGroups/{ResourceGroupID}/providers/Microsoft.CustomProviders/resourceProviders/{CustomRPName}/users/{NewUserName}",
  "name": "{NewUserName}",
  "type": "Microsoft.CustomProviders/resourceProviders/users"
} 



## Next steps

* For an introduction to managed applications, see [Managed application overview](overview.md).
* For information about publishing a Service Catalog managed application, see [Create and publish a Service Catalog managed application](publish-service-catalog-app.md).