---
title: Manage resources - REST
description: Use REST opeartions with Azure Resource Manager to manage your resources. Shows how to read, deploy, and delete resources. 
ms.topic: conceptual
ms.author: jehunte
ms.date: 04/26/2023
---
# Manage Azure resources by using the REST API

Learn how to use the REST API for [Azure Resource Manager](overview.md) to manage your Azure resources. For a comprehensive reference of how to structure Azure REST calls, see [Getting Started with REST](https://learn.microsoft.com/rest/api/azure/). View the [Resource Management REST API reference](https://learn.microsoft.com/rest/api/resources/) for more details on the available operations.


Other articles about managing resources:

- [Manage Azure resources by using the Azure portal](manage-resources-portal.md)
- [Manage Azure resources by using Azure PowerShell](manage-resources-powershell.md)
- [Manage Azure resources by using Azure CLI](manage-resources-cli.md)

## Obtain an access token
To make a REST API call to Azure, you first need to obtain an access token. Include this access token in the headers of your Azure REST API calls using the "Authorization" header and setting the value to "Bearer {access-token}".

If you will need to programatically retreive new tokens, you can obtain an access token by [Registering your client application with Azure AD](https://learn.microsoft.com/rest/api/azure/#register-your-client-application-with-azure-ad).

If you are getting started and want to quickly test Azure REST APIs, you can retrieve your access token from the Azure portal. Note that the specific steps may vary slightly depending on the browser you are using, but the general process should be similar.

1. Open your web browser (e.g. Microsoft Edge, Google Chrome, Mozilla Firefox, etc.).
2. Navigate to the [Azure portal](https://portal.azure.com/).
3. Right-click on the webpage and select "Inspect" or "Inspect Element" from the context menu. Alternatively, you can press F12 (Windows) or Option + Command + I (Mac) to open the devtools.
4. Refresh the page.
5. Select the "batch" request in the populated list of network requests. You can filter the requests by name and search for "batch".
6. Click on the request to view its details.
7. Under the "Headers" tab, you should see the authorization request headers.

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
curl -X GET \
  'https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/resources?api-version=2021-04-01' \
  -H 'Authorization: Bearer {access-token}' \
  -H 'Content-Type: application/json'
```

## Deploy resources to an existing resource group

You can deploy Azure resources directly by using the REST API, or deploy a Resource Manager template to create Azure resources.

### Deploy a resource

The following REST operation creates a storage account. To see this example in more detail, see [Create an Azure Storage account with the REST API](https://learn.microsoft.com/rest/api/storagerp/storage-sample-create-account). Complete reference documentation for the Storage Resource Provider and additional samples are available in the [Storage Resource Provider REST API Reference](https://learn.microsoft.com/rest/api/storagerp/).

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

The following operations deploy a Quickstart template to create a storage account. For more information, see [Quickstart: Create Azure Resource Manager templates by using Visual Studio Code](../templates/quickstart-create-templates-use-visual-studio-code.md). For the API reference of this call, see [Deployments - Create Or Update](https://learn.microsoft.com/rest/api/resources/deployments/create-or-update?tabs=HTTP).


```http
PUT /subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.Resources/deployments/my-deployment?api-version=2021-04-01 HTTP/1.1
Authorization: Bearer <bearer-token>
Content-Type: application/json
Host: management.azure.com

{
  "properties": {
    "templateLink": {
      "uri": "azuredeploy.json",
    },
    "parameters": "azuredeploy.parameters.json",
    "mode": "Incremental"
  }
}
```

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
- To learn more about Azure Resource Manager's supported REST operations, see [Azure Resource Manager REST reference](https://learn.microsoft.com/rest/api/resources/).
- To learn the Resource Manager template syntax, see [Understand the structure and syntax of Azure Resource Manager templates](../templates/syntax.md).
- To learn how to develop templates, see the [step-by-step tutorials](../index.yml).
- To view the Azure Resource Manager template schemas, see [template reference](/azure/templates/).
