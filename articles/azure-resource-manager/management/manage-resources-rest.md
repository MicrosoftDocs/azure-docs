---
title: Manage resources - REST
description: Use REST operations with Azure Resource Manager to manage your resources. Shows how to read, deploy, and delete resources. 
ms.topic: conceptual
ms.custom: devx-track-arm-template
ms.author: jehunte
ms.date: 04/26/2023
---
# Manage Azure resources by using the REST API

Learn how to use the REST API for [Azure Resource Manager](overview.md) to manage your Azure resources. For a comprehensive reference of how to structure Azure REST calls, see [Getting Started with REST](/rest/api/azure/). View the [Resource Management REST API reference](/rest/api/resources/) for more details on the available operations.

## Obtain an access token
To make a REST API call to Azure, you first need to obtain an access token. Include this access token in the headers of your Azure REST API calls using the "Authorization" header and setting the value to "Bearer {access-token}".

If you need to programatically retrieve new tokens as part of your application, you can obtain an access token by [Registering your client application with Azure AD](/rest/api/azure/#register-your-client-application-with-azure-ad).

If you are getting started and want to test Azure REST APIs using your individual token, you can retrieve your current access token quickly with either Azure PowerShell or Azure CLI.

### [Azure CLI](#tab/azure-cli)
```azurecli-interactive
token=$(az account get-access-token --query accessToken --output tsv)
```

### [Azure PowerShell](#tab/azure-powershell)
```azurepowershell-interactive
$token = (Get-AzAccessToken).Token
```

---

## Operation scope
You can call many Azure Resource Manager operations at different scopes:

| Type | Scope |
| --- | --- |
| Management group | `providers/Microsoft.Management/managementGroups/{managementGroupId}` |
| Subscription | `subscriptions/{subscriptionId}` |
| Resource group | `subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}` |
| Resource | `subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderName}/{resourceType}/{resourceName}` |

## List resources
The following REST operation returns the resources within a provided resource group.

```http
GET /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/resources?api-version=2021-04-01 HTTP/1.1
Authorization: Bearer <bearer-token>
Host: management.azure.com
```

Here is an example cURL command that you can use to list all resources in a resource group using the Azure Resource Manager API:
```curl
curl  -H "Authorization: Bearer $token" -H 'Content-Type: application/json' -X GET 'https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/resources?api-version=2021-04-01'
```


With the authentication step, this example looks like:
### [Azure CLI](#tab/azure-cli)
```azurecli-interactive
token=$(az account get-access-token --query accessToken --output tsv)
curl  -H "Authorization: Bearer $token" -H 'Content-Type: application/json' -X GET 'https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/resources?api-version=2021-04-01'
```

### [Azure PowerShell](#tab/azure-powershell)
```azurepowershell-interactive
$token = (Get-AzAccessToken).Token
$headers = @{Authorization="Bearer $token"}
Invoke-WebRequest -Method GET -Headers $headers -Uri 'https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/resources?api-version=2021-04-01'
```

---

## Deploy resources to an existing resource group

You can deploy Azure resources directly by using the REST API, or deploy a Resource Manager template to create Azure resources.

### Deploy a resource

The following REST operation creates a storage account. To see this example in more detail, see [Create an Azure Storage account with the REST API](/rest/api/storagerp/storage-sample-create-account). Complete reference documentation and samples for the Storage Resource Provider are available in the [Storage Resource Provider REST API Reference](/rest/api/storagerp/).

```http
PUT /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/{accountName}?api-version=2018-02-01 HTTP/1.1
Authorization: Bearer <bearer-token>
Content-Type: application/json
Host: management.azure.com

{
  "sku": {
    "name": "Standard_GRS"
  },
  "kind": "StorageV2",
  "location": "eastus2",
}
```

### Deploy a template

The following operations deploy a Quickstart template to create a storage account. For more information, see [Quickstart: Create Azure Resource Manager templates by using Visual Studio Code](../templates/quickstart-create-templates-use-visual-studio-code.md). For the API reference of this call, see [Deployments - Create Or Update](/rest/api/resources/deployments/create-or-update).


```http
PUT /subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.Resources/deployments/my-deployment?api-version=2021-04-01 HTTP/1.1
Authorization: Bearer <bearer-token>
Content-Type: application/json
Host: management.azure.com

{
  "properties": {
    "templateLink": {
      "uri": "https://example.com/azuretemplates/azuredeploy.json"
    },
    "parametersLink": {
        "uri": "https://example.com/azuretemplates/azuredeploy.parameters.json"
    },
    "mode": "Incremental"
  }
}
```
For the REST APIs, the value of `uri` can't be a local file or a file that is only available on your local network. Azure Resource Manager must be able to access the template. Provide a URI value that downloadable as HTTP or HTTPS.
For more information, see [Deploy resources with Resource Manager templates and Azure PowerShell](../templates/deploy-powershell.md).

## Deploy a resource group and resources

You can create a resource group and deploy resources to the group by using a template. For more information, see [Create resource group and deploy resources](../templates/deploy-to-subscription.md#resource-groups).

## Deploy resources to multiple subscriptions or resource groups

Typically, you deploy all the resources in your template to a single resource group. However, there are scenarios where you want to deploy a set of resources together but place them in different resource groups or subscriptions. For more information, see [Deploy Azure resources to multiple subscriptions or resource groups](../templates/deploy-to-resource-group.md).

## Delete resources

The following operation shows how to delete a storage account.

```http
DELETE /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/{accountName}?api-version=2022-09-01 HTTP/1.1
Authorization: Bearer <bearer-token>
Host: management.azure.com
```

For more information about how Azure Resource Manager orders the deletion of resources, see [Azure Resource Manager resource group deletion](delete-resource-group.md).

## Manage access to resources

[Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md) is the way that you manage access to resources in Azure. For more information, see [Add or remove Azure role assignments using REST](../../role-based-access-control/role-assignments-rest.md).

## Next steps

- To learn Azure Resource Manager, see [Azure Resource Manager overview](overview.md).
- To learn more about Azure Resource Manager's supported REST operations, see [Azure Resource Manager REST reference](/rest/api/resources/).
- To learn the Resource Manager template syntax, see [Understand the structure and syntax of Azure Resource Manager templates](../templates/syntax.md).
- To learn how to develop templates, see the [step-by-step tutorials](../index.yml).
- To view the Azure Resource Manager template schemas, see [template reference](/azure/templates/).
