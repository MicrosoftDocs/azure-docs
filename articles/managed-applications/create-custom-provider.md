---
title: Create resource provider with Azure Custom Providers Preview
description: Describes how to create a resource provider and deploy its custom resource types.
services: managed-applications
author: MSEvanhi
ms.service: managed-applications
ms.topic: tutorial
ms.date: 05/01/2019
ms.author: evanhi
---

# Quickstart: Create custom provider and deploy custom resources

In this quickstart, you create your own resource provider and deploy custom resource types for that resource provider. For more information about custom providers, see [Azure Custom Providers Preview overview](custom-providers-overview.md).

## Prerequisites

To complete the steps in this quickstart, you need to call REST operations. There are [different ways of sending REST requests](/rest/api/azure/). If you don't already have a tool for REST operations, install [ARMClient](https://github.com/projectkudu/ARMClient). It's an open-source command-line tool that simplifies invoking the Azure Resource Manager API.

## Deploy custom provider

To set up the custom provider, deploy an [example template](https://github.com/Azure/azure-docs-json-samples/blob/master/custom-providers/customprovider.json) to your Azure subscription.

After deploying the template, your subscription has the following resources:

* Function App with the operations for the resources and actions.
* Storage Account for storing users that are created through the custom provider.
* Custom Provider that defines the custom resource types and actions. It uses the function app endpoint for sending requests.
* Custom resource from the custom provider.

To deploy the custom provider with PowerShell, use:

```azurepowershell-interactive
$rgName = "<resource-group-name>"
$funcName = "<function-app-name>"

New-AzResourceGroup -Name $rgName -Location eastus
New-AzResourceGroupDeployment -ResourceGroupName $rgName `
  -TemplateUri https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/custom-providers/customprovider.json `
  -funcname $funcName
```

Or, you can deploy the solution with the following button:

<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-docs-json-samples%2Fmaster%2Fcustom-providers%2Fcustomprovider.json" target="_blank">
    <img src="https://azuredeploy.net/deploybutton.png"/>
</a>

## View custom provider and resource

In the portal, the custom provider is a hidden resource type. To confirm that the resource provider has been deployed, navigate to the resource group. Select the option to **Show hidden types**.

![Show hidden resource types](./media/create-custom-providers/show-hidden.png)

To see the custom resource type that you deployed, use the GET operation on your resource type.

```
GET https://management.azure.com/subscriptions/<sub-id>/resourceGroups/<rg-name>/providers/Microsoft.CustomProviders/resourceProviders/<provider-name>/users?api-version=2018-09-01-preview
```

With ARMClient, use:

```powershell
$subID = (Get-AzContext).Subscription.Id
$requestURI = "https://management.azure.com/subscriptions/$subID/resourceGroups/$rgName/providers/Microsoft.CustomProviders/resourceProviders/$funcName/users?api-version=2018-09-01-preview"

armclient GET $requestURI
```

You receive the response:

```json
{
  "value": [
    {
      "properties": {
        "provisioningState": "Succeeded",
        "FullName": "Santa Claus",
        "Location": "NorthPole"
      },
      "id": "/subscriptions/<sub-id>/resourceGroups/<rg-name>/providers/Microsoft.CustomProviders/resourceProviders/<provider-name>/users/santa",
      "name": "santa",
      "type": "Microsoft.CustomProviders/resourceProviders/users"
    }
  ]
}
```

## Call action

Your custom provider also has an action named **ping**. The code that processes the request is implemented in the function app. The ping action replies with a greeting.

To send a ping request, use the POST operation on your custom provider.

```
POST https://management.azure.com/subscriptions/<sub-id>/resourceGroups/<rg-name>/providers/Microsoft.CustomProviders/resourceProviders/<provider-name>/ping?api-version=2018-09-01-preview
```

With ARMClient, use:

```powershell
$pingURI = "https://management.azure.com/subscriptions/$subID/resourceGroups/$rgName/providers/Microsoft.CustomProviders/resourceProviders/$funcName/ping?api-version=2018-09-01-preview"

armclient POST $pingURI
```

You receive the response:

```json
{
  "pingcontent": {
    "source": "<function-name>.azurewebsites.net"
  },
  "message": "hello <function-name>.azurewebsites.net"
}
```

## Create resource type

To create the custom resource type, you can deploy the resource in a template. This approach is shown in the template you deployed in this quickstart. You can also send a PUT request for the resource type.

```
PUT https://management.azure.com/subscriptions/<sub-id>/resourceGroups/<rg-name>/providers/Microsoft.CustomProviders/resourceProviders/<provider-name>/users/<resource-name>?api-version=2018-09-01-preview

{"properties":{"FullName": "Test User", "Location": "Earth"}}
```

With ARMClient, use:

```powershell
$addURI = "https://management.azure.com/subscriptions/$subID/resourceGroups/$rgName/providers/Microsoft.CustomProviders/resourceProviders/$funcName/users/testuser?api-version=2018-09-01-preview"
$requestBody = "{'properties':{'FullName': 'Test User', 'Location': 'Earth'}}"

armclient PUT $addURI $requestBody
```

You receive the response:

```json
{
  "properties": {
    "provisioningState": "Succeeded",
    "FullName": "Test User",
    "Location": "Earth"
  },
  "id": "/subscriptions/<sub-ID>/resourceGroups/<rg-name>/providers/Microsoft.CustomProviders/resourceProviders/<provider-name>/users/testuser",
  "name": "testuser",
  "type": "Microsoft.CustomProviders/resourceProviders/users"
}
```

## Next steps

For an introduction to custom providers, see [Azure Custom Providers Preview overview](custom-providers-overview.md).
