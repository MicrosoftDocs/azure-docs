---
title: Create a custom resource provider
description: Describes how to create a custom resource provider and deploy custom resources.
ms.topic: tutorial
ms.date: 09/20/2022
ms.author: evanhi
author: MSEvanhi
ms.custom: devx-track-azurecli
---

# Quickstart: Create Azure Custom Resource Provider and deploy custom resources

In this quickstart, you create a custom resource provider and deploy custom resources for that resource provider. For more information about custom resource providers, see [Azure Custom Resource Providers Overview](overview.md).

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- To complete the steps in this quickstart, you need to call `REST` operations. There are [different ways of sending REST requests](/rest/api/azure/).

# [Azure CLI](#tab/azure-cli)

Prepare your environment for the Azure CLI.

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

Azure CLI examples use `az rest` for `REST` requests. For more information, see [az rest](/cli/azure/reference-index#az-rest).

# [PowerShell](#tab/azure-powershell)

- The PowerShell commands are run locally using PowerShell 7 or later and the Azure PowerShell modules. For more information, see [Install Azure PowerShell](/powershell/azure/install-azure-powershell).
- If you don't already have a tool for `REST` operations, install the [ARMClient](https://github.com/projectkudu/ARMClient). It's an open-source command-line tool that simplifies invoking the Azure Resource Manager API.
- After the **ARMClient** is installed, you can display usage information from a PowerShell command prompt by typing: `armclient.exe`. Or, go to the [ARMClient wiki](https://github.com/projectkudu/ARMClient/wiki).

---

## Deploy custom resource provider

To set up the custom resource provider, deploy an [example template](https://github.com/Azure/azure-docs-json-samples/blob/master/custom-providers/customprovider.json) to your Azure subscription.

The template deploys the following resources to your subscription:

- Function app with the operations for the resources and actions.
- Storage account for storing users that are created through the custom resource provider.
- Custom resource provider that defines the custom resource types and actions. It uses the function app endpoint for sending requests.
- Custom resource from the custom resource provider.

To deploy the custom resource provider, use Azure CLI, PowerShell, or the Azure portal.

# [Azure CLI](#tab/azure-cli)

This example prompts you to enter a resource group, location, and provider's function app name. The names are stored in variables that are used in other commands. The [az group create](/cli/azure/group#az-group-create) and [az deployment group create](/cli/azure/deployment/group#az-deployment-group-create) commands deploy the resources.

```azurecli-interactive
read -p "Enter a resource group name:" rgName &&
read -p "Enter the location (i.e. eastus):" location &&
read -p "Enter the provider's function app name:" funcName &&
templateUri="https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/custom-providers/customprovider.json" &&
az group create --name $rgName --location "$location" &&
az deployment group create --resource-group $rgName --template-uri $templateUri --parameters funcName=$funcName &&
echo "Press [ENTER] to continue ..." &&
read
```

# [PowerShell](#tab/azure-powershell)

This example prompts you to enter a resource group, location, and provider's function app name. The names are stored in variables that are used in other commands. The [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) and [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment) commands deploy the resources.

```powershell
$rgName = Read-Host -Prompt "Enter a resource group name"
$location = Read-Host -Prompt "Enter the location (i.e. eastus)"
$funcName = Read-Host -Prompt "Enter the provider's function app name"
$templateUri = "https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/custom-providers/customprovider.json"
New-AzResourceGroup -Name $rgName -Location "$location"
New-AzResourceGroupDeployment -ResourceGroupName $rgName -TemplateUri $templateUri -funcName $funcName
Read-Host -Prompt "Press [ENTER] to continue ..."
```

---

To deploy the template from the Azure portal, select the **Deploy to Azure** button.

:::image type="content" source="../../media/template-deployments/deploy-to-azure.svg" alt-text="Illustration of the Deploy to Azure button." link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-docs-json-samples%2Fmaster%2Fcustom-providers%2Fcustomprovider.json":::

## View custom resource provider and resource

In the portal, the custom resource provider is a hidden resource type. To confirm that the resource provider was deployed, go to the resource group and select **Show hidden types**.

:::image type="content" source="./media/create-custom-provider/show-hidden.png" alt-text="Screenshot of Azure portal displaying hidden resource types and resources deployed in a resource group.":::

To see the custom resource that you deployed, use the `GET` operation on your resource type. The resource type `Microsoft.CustomProviders/resourceProviders/users` shown in the JSON response includes the resource that was created by the template.

```http
GET https://management.azure.com/subscriptions/<sub-id>/resourceGroups/<rg-name>/providers/Microsoft.CustomProviders/resourceProviders/<provider-name>/users?api-version=2018-09-01-preview
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
subID=$(az account show --query id --output tsv)
requestURI="https://management.azure.com/subscriptions/$subID/resourceGroups/$rgName/providers/Microsoft.CustomProviders/resourceProviders/$funcName/users?api-version=2018-09-01-preview"
az rest --method get --uri $requestURI
```

You receive the response:

```json
{
  "value": [
    {
      "id": "/subscriptions/<sub-id>/resourceGroups/<rg-name>/providers/Microsoft.CustomProviders/resourceProviders/<provider-name>/users/ana",
      "name": "ana",
      "properties": {
        "FullName": "Ana Bowman",
        "Location": "Moon",
        "provisioningState": "Succeeded"
      },
      "type": "Microsoft.CustomProviders/resourceProviders/users"
    }
  ]
}
```

# [PowerShell](#tab/azure-powershell)

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
        "FullName": "Ana Bowman",
        "Location": "Moon"
      },
      "id": "/subscriptions/<sub-id>/resourceGroups/<rg-name>/providers/Microsoft.CustomProviders/resourceProviders/<provider-name>/users/ana",
      "name": "ana",
      "type": "Microsoft.CustomProviders/resourceProviders/users"
    }
  ]
}
```

---

## Call action

Your custom resource provider also has an action named `ping`. The code that processes the request is implemented in the function app. The `ping` action replies with a greeting.

To send a `ping` request, use the `POST` operation on your action.

```http
POST https://management.azure.com/subscriptions/<sub-id>/resourceGroups/<rg-name>/providers/Microsoft.CustomProviders/resourceProviders/<provider-name>/ping?api-version=2018-09-01-preview
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
pingURI="https://management.azure.com/subscriptions/$subID/resourceGroups/$rgName/providers/Microsoft.CustomProviders/resourceProviders/$funcName/ping?api-version=2018-09-01-preview"
az rest --method post --uri $pingURI
```

You receive the response:

```json
{
  "message": "hello <function-name>.azurewebsites.net",
  "pingcontent": {
    "source": "<function-name>.azurewebsites.net"
  }
}
```

# [PowerShell](#tab/azure-powershell)

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

---

## Use PUT to create resource

In this quickstart, the template used the resource type `Microsoft.CustomProviders/resourceProviders/users` to deploy a resource. You can also use a `PUT` operation to create a resource. For example, if a resource isn't deployed with the template, the `PUT` operation will create a resource.

In this example, because the template already deployed a resource, the `PUT` operation creates a new resource.

```http
PUT https://management.azure.com/subscriptions/<sub-id>/resourceGroups/<rg-name>/providers/Microsoft.CustomProviders/resourceProviders/<provider-name>/users/<resource-name>?api-version=2018-09-01-preview

{"properties":{"FullName": "Test User", "Location": "Earth"}}
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
addURI="https://management.azure.com/subscriptions/$subID/resourceGroups/$rgName/providers/Microsoft.CustomProviders/resourceProviders/$funcName/users/testuser?api-version=2018-09-01-preview"
az rest --method put --uri $addURI --body "{'properties':{'FullName': 'Test User', 'Location': 'Earth'}}"
```

You receive the response:

```json
{
  "id": "/subscriptions/<sub-ID>/resourceGroups/<rg-name>/providers/Microsoft.CustomProviders/resourceProviders/<provider-name>/users/testuser",
  "name": "testuser",
  "properties": {
    "FullName": "Test User",
    "Location": "Earth",
    "provisioningState": "Succeeded"
  },
  "type": "Microsoft.CustomProviders/resourceProviders/users"
}
```

# [PowerShell](#tab/azure-powershell)

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

---

You can rerun the `GET` operation from the [view custom resource provider and resource](#view-custom-resource-provider-and-resource) section to show the two resources that were created. This example shows output from the Azure CLI command.

```json
{
  "value": [
    {
      "id": "/subscriptions/<sub-id>/resourceGroups/<rg-name>/providers/Microsoft.CustomProviders/resourceProviders/<provider-name>/users/ana",
      "name": "ana",
      "properties": {
        "FullName": "Ana Bowman",
        "Location": "Moon",
        "provisioningState": "Succeeded"
      },
      "type": "Microsoft.CustomProviders/resourceProviders/users"
    },
    {
      "id": "/subscriptions/<sub-id>/resourceGroups/<rg-name>/providers/Microsoft.CustomProviders/resourceProviders/<provider-name>/users/testuser",
      "name": "testuser",
      "properties": {
        "FullName": "Test User",
        "Location": "Earth",
        "provisioningState": "Succeeded"
      },
      "type": "Microsoft.CustomProviders/resourceProviders/users"
    }
  ]
}
```

## Custom resource provider commands

Use the [custom-providers](/cli/azure/custom-providers/resource-provider) commands to work with your custom resource provider.

### List custom resource providers

Use the `list` command to display all the custom resource providers in a subscription. The default lists the current subscription's custom resource providers, or you can specify the `--subscription` parameter. To list for a resource group, use the `--resource-group` parameter.

```azurecli-interactive
az custom-providers resource-provider list --subscription $subID
```

```json
[
  {
    "actions": [
      {
        "endpoint": "https://<provider-name>.azurewebsites.net/api/{requestPath}",
        "name": "ping",
        "routingType": "Proxy"
      }
    ],
    "id": "/subscriptions/<sub-id>/resourceGroups/<rg-name>/providers/Microsoft.CustomProviders/resourceproviders/<provider-name>",
    "location": "eastus",
    "name": "<provider-name>",
    "provisioningState": "Succeeded",
    "resourceGroup": "<rg-name>",
    "resourceTypes": [
      {
        "endpoint": "https://<provider-name>.azurewebsites.net/api/{requestPath}",
        "name": "users",
        "routingType": "Proxy, Cache"
      }
    ],
    "tags": {},
    "type": "Microsoft.CustomProviders/resourceproviders",
    "validations": null
  }
]
```

### Show the properties

Use the `show` command to display the custom resource provider's properties. The output format resembles the `list` output.

```azurecli-interactive
az custom-providers resource-provider show --resource-group $rgName --name $funcName
```

### Create a new resource

Use the `create` command to create or update a custom resource provider. This example updates the `actions` and `resourceTypes`.

```azurecli-interactive
az custom-providers resource-provider create --resource-group $rgName --name $funcName \
--action name=ping endpoint=https://myTestSite.azurewebsites.net/api/{requestPath} routing_type=Proxy \
--resource-type name=users endpoint=https://myTestSite.azurewebsites.net/api/{requestPath} routing_type="Proxy, Cache"
```

```json
"actions": [
  {
    "endpoint": "https://myTestSite.azurewebsites.net/api/{requestPath}",
    "name": "ping",
    "routingType": "Proxy"
  }
],

"resourceTypes": [
  {
    "endpoint": "https://myTestSite.azurewebsites.net/api/{requestPath}",
    "name": "users",
    "routingType": "Proxy, Cache"
  }
],
```

### Update the provider's tags

The `update` command only updates tags for a custom resource provider. In the Azure portal, the custom resource provider's app service shows the tag.

```azurecli-interactive
az custom-providers resource-provider update --resource-group $rgName --name $funcName --tags new=tag
```

```json
"tags": {
  "new": "tag"
},
```

### Delete a custom resource provider

The `delete` command prompts you and deletes only the custom resource provider. The storage account, app service, and app service plan aren't deleted. After the provider is deleted, you're returned to a command prompt.

```azurecli-interactive
az custom-providers resource-provider delete --resource-group $rgName --name $funcName
```

## Clean up resources

If you're finished with the resources created in this article, you can delete the resource group. When you delete a resource group, all the resources in that resource group are deleted.

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az group delete --resource-group $rgName
```

# [PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Remove-AzResourceGroup -Name $rgName
```

---


## Next steps

For an introduction to custom resource providers, see the following article:

> [!div class="nextstepaction"]
> [Azure Custom Resource Providers Overview](overview.md)
