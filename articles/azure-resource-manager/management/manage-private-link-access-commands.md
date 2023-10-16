---
title: Manage resource management private links
description: Use APIs to manage existing resource management private links
ms.topic: conceptual
ms.custom: devx-track-azurecli, devx-track-azurepowershell
ms.date: 06/16/2022
---

# Manage resource management private links

This article explains how you to work with existing resource management private links. It shows API operations for getting and deleting existing resources.

If you need to create a resource management private link, see [Use portal to create private link for managing Azure resources](create-private-link-access-portal.md) or [Use APIs to create private link for managing Azure resources](create-private-link-access-commands.md).

## Resource management private links

To **get a specific** resource management private link, send the following request:

# [Azure CLI](#tab/azure-cli)
  ### Example
  ```azurecli
  # Login first with az login if not using Cloud Shell
  az resourcemanagement private-link show --resource-group PrivateLinkTestRG --name NewRMPL
  ```
   
# [PowerShell](#tab/azure-powershell)
  ### Example
  ```azurepowershell-interactive
  # Login first with Connect-AzAccount if not using Cloud Shell
  Get-AzResourceManagementPrivateLink -ResourceGroupName PrivateLinkTestRG -Name NewRMPL
  ```
   
# [REST](#tab/REST)
  REST call
  ```http
    GET https://management.azure.com/subscriptions/{subscriptionID}/resourceGroups/{resourceGroupName}/providers/Microsoft.Authorization/resourceManagementPrivateLinks/{rmplName}?api-version=2020-05-01 
  ```

The operation returns:

```json
{
  "properties": {
    "privateEndpointConnections": []
  },
  "id": {rmplResourceId},
  "name": {rmplName},
  "type": "Microsoft.Authorization/resourceManagementPrivateLinks",
  "location": {region}
}
```

---

To **get all** resource management private links in a subscription, use:
# [Azure CLI](#tab/azure-cli)
  ```azurecli
  # Login first with az login if not using Cloud Shell
  az resourcemanagement private-link list
  ```
   
# [PowerShell](#tab/azure-powershell)
  ```azurepowershell-interactive
  # Login first with Connect-AzAccount if not using Cloud Shell
  Get-AzResourceManagementPrivateLink
  ```
   
# [REST](#tab/REST)
  REST call
  ```http
  GET
  https://management.azure.com/subscriptions/{subscriptionID}/providers/Microsoft.Authorization/resourceManagementPrivateLinks?api-version=2020-05-01
  ```

  The operation returns:

  ```json
  [
    {
      "properties": {
        "privateEndpointConnections": []
      },
      "id": {rmplResourceId},
      "name": {rmplName},
      "type": "Microsoft.Authorization/resourceManagementPrivateLinks",
      "location": {region}
    },
    {
      "properties": {
        "privateEndpointConnections": []
      },
      "id": {rmplResourceId},
      "name": {rmplName},
      "type": "Microsoft.Authorization/resourceManagementPrivateLinks",
      "location": {region}
    }
  ]
  ```

---

To **delete a specific** resource management private link, use:
# [Azure CLI](#tab/azure-cli)
  ### Example
  ```azurecli
  # Login first with az login if not using Cloud Shell
  az resourcemanagement private-link delete --resource-group PrivateLinkTestRG --name NewRMPL
  ```
   
# [PowerShell](#tab/azure-powershell)
  ### Example
  ```azurepowershell-interactive
  # Login first with Connect-AzAccount if not using Cloud Shell
  Remove-AzResourceManagementPrivateLink -ResourceGroupName PrivateLinkTestRG -Name NewRMPL
  ```
   
# [REST](#tab/REST)
  REST call
  ```http
  DELETE
  https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Authorization/resourceManagementPrivateLinks/{rmplName}?api-version=2020-05-01
  ```

  The operation returns: `Status 200 OK`.

---

## Private link association

To **get a specific** private link association for a management group, use:
# [Azure CLI](#tab/azure-cli)
  ### Example
  ```azurecli
  # Login first with az login if not using Cloud Shell
  az private-link association show --management-group-id fc096d27-0434-4460-a3ea-110df0422a2d --name 1d7942d1-288b-48de-8d0f-2d2aa8e03ad4
  ```
   
# [PowerShell](#tab/azure-powershell)
  ### Example
  ```azurepowershell-interactive
  # Login first with Connect-AzAccount if not using Cloud Shell
  Get-AzPrivateLinkAssociation -ManagementGroupId fc096d27-0434-4460-a3ea-110df0422a2d -Name 1d7942d1-288b-48de-8d0f-2d2aa8e03ad4 | fl
  ```
   
# [REST](#tab/REST)
  REST call
  ```http
  GET
  https://management.azure.com/providers/Microsoft.Management/managementGroups/{managementGroupID}/providers/Microsoft.Authorization/privateLinkAssociations?api-version=2020-05-01 
  ```

  The operation returns:

  ```json
  {
    "value": [
      {
        "properties": {
          "privateLink": {rmplResourceID},
          "tenantId": {tenantId},
          "scope": "/providers/Microsoft.Management/managementGroups/{managementGroupId}"
        },
        "id": {plaResourceId},
        "type": "Microsoft.Authorization/privateLinkAssociations",
        "name": {plaName}
      }
    ]
  }
  ```

---

To **delete** a private link association, use:
# [Azure CLI](#tab/azure-cli)
  ### Example
  ```azurecli
  # Login first with az login if not using Cloud Shell
  az private-link association delete --management-group-id 24f15700-370c-45bc-86a7-aee1b0c4eb8a --name 1d7942d1-288b-48de-8d0f-2d2aa8e03ad4
  ```
   
# [PowerShell](#tab/azure-powershell)
  ### Example
  ```azurepowershell-interactive
  # Login first with Connect-AzAccount if not using Cloud Shell
  Remove-AzPrivateLinkAssociation -ManagementGroupId 24f15700-370c-45bc-86a7-aee1b0c4eb8a -Name 1d7942d1-288b-48de-8d0f-2d2aa8e03ad4
  ```
   
# [REST](#tab/REST)
  REST call

  ```http
  DELETE 
  https://management.azure.com/providers/Microsoft.Management/managementGroups/{managementGroupID}/providers/Microsoft.Authorization/privateLinkAssociations/{plaID}?api-version=2020-05-01
  ```

The operation returns: `Status 200 OK`.

---


## Next steps

* To learn more about private links, see [Azure Private Link](../../private-link/index.yml).
* To manage your private endpoints, see [Manage Private Endpoints](../../private-link/manage-private-endpoint.md).
* To create a resource management private links, see [Use portal to create private link for managing Azure resources](create-private-link-access-portal.md) or [Use REST API to create private link for managing Azure resources](create-private-link-access-rest.md).
