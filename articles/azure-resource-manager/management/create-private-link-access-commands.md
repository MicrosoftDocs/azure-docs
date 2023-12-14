---
title: Manage resources through private link
description: Restrict management access for resource to private link
ms.topic: conceptual
ms.date: 06/16/2022
---

# Use APIs to create a private link for managing Azure resources

This article explains how you can use [Azure Private Link](../../private-link/index.yml) to restrict access for managing resources in your subscriptions.

[!INCLUDE [Create content](../../../includes/resource-manager-create-rmpl.md)]

## Create resource management private link

To create resource management private link, send the following request:
# [Azure CLI](#tab/azure-cli)
  ### Example
  ```azurecli
  # Login first with az login if not using Cloud Shell
  az resourcemanagement private-link create --location WestUS --resource-group PrivateLinkTestRG --name NewRMPL
  ```
   
# [PowerShell](#tab/azure-powershell)
  ### Example
  ```azurepowershell-interactive
  # Login first with Connect-AzAccount if not using Cloud Shell
  New-AzResourceManagementPrivateLink -ResourceGroupName PrivateLinkTestRG -Name NewRMPL
  ```
   
# [REST](#tab/REST)
  REST call
  ```http
  PUT
  https://management.azure.com/subscriptions/{subscriptionID}/resourceGroups/{resourceGroupName}/providers/Microsoft.Authorization/resourceManagementPrivateLinks/{rmplName}?api-version=2020-05-01
  ```

  In the request body, include the location you want for the resource:

  ```json
  {
    "location":"{region}"
  }
  ```

  The operation returns:

  ```json
  {  
    "id": "/subscriptions/{subID}/resourceGroups/{rgName}/providers/Microsoft.Authorization/resourceManagementPrivateLinks/{name}",
    "location": "{region}",
    "name": "{rmplName}",
    "properties": {
      "privateEndpointConnections": []
    },
    "resourceGroup": "{rgName}",
    "type": "Microsoft.Authorization/resourceManagementPrivateLinks"
  }
  ```
  
---

Note the ID that is returned for the new resource management private link. You'll use it for creating the private link association.

## Create private link association
The resource name of a private link association resource must be a GUID, and it isn't yet supported to disable the publicNetworkAccess field. 

To create the private link association, use:
# [Azure CLI](#tab/azure-cli)
  ### Example
  ```azurecli
  # Login first with az login if not using Cloud Shell
  az private-link association create --management-group-id fc096d27-0434-4460-a3ea-110df0422a2d --name 1d7942d1-288b-48de-8d0f-2d2aa8e03ad4 --privatelink "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/PrivateLinkTestRG/providers/Microsoft.Authorization/resourceManagementPrivateLinks/newRMPL"
  ```
   
# [PowerShell](#tab/azure-powershell)
  ### Example
  ```azurepowershell-interactive
  # Login first with Connect-AzAccount if not using Cloud Shell
  New-AzPrivateLinkAssociation -ManagementGroupId fc096d27-0434-4460-a3ea-110df0422a2d -Name 1d7942d1-288b-48de-8d0f-2d2aa8e03ad4 -PrivateLink "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/PrivateLinkTestRG/providers/Microsoft.Authorization/resourceManagementPrivateLinks/newRMPL" -PublicNetworkAccess enabled | fl
  ```
   
# [REST](#tab/REST)
  REST call

  ```http
  PUT
  https://management.azure.com/providers/Microsoft.Management/managementGroups/{managementGroupId}/providers/Microsoft.Authorization/privateLinkAssociations/{GUID}?api-version=2020-05-01 
  ```

  In the request body, include:

  ```json
  {
    "properties": {
      "privateLink": "/subscriptions/{subscription-id}/resourceGroups/{rg-name}/providers/Microsoft.Authorization/resourceManagementPrivateLinks/{rmplName}",
      "publicNetworkAccess": "enabled"
    }
  }
  ```

  The operation returns:

  ```json
  {
    "id": {plaResourceId},
    "name": {plaName},
    "properties": {
      "privateLink": {rmplResourceId},
      "publicNetworkAccess": "Enabled",
      "tenantId": "{tenantId}",
      "scope": "/providers/Microsoft.Management/managementGroups/{managementGroupId}"
    },
    "type": "Microsoft.Authorization/privateLinkAssociations"
  }
  ```
---

## Add private endpoint

This article assumes you already have a virtual network. In the subnet that will be used for the private endpoint, you must turn off private endpoint network policies. If you haven't turned off private endpoint network policies, see [Disable network policies for private endpoints](../../private-link/disable-private-endpoint-network-policy.md).

To create a private endpoint, see Private Endpoint documentation for creating via [Portal](../../private-link/create-private-endpoint-portal.md), [PowerShell](../../private-link/create-private-endpoint-powershell.md), [CLI](../../private-link/create-private-endpoint-cli.md), [Bicep](../../private-link/create-private-endpoint-bicep.md), or [template](../../private-link/create-private-endpoint-template.md).

In the request body, set the `privateServiceLinkId` to the ID from your resource management private link. The `groupIds` must contain `ResourceManagement`. The location of the private endpoint must be the same as the location of the subnet.

```json
{
  "location": "westus2",
  "properties": {
    "privateLinkServiceConnections": [
      {
        "name": "{connection-name}",
        "properties": {
           "privateLinkServiceId": "/subscriptions/{subID}/resourceGroups/{rgName}/providers/Microsoft.Authorization/resourceManagementPrivateLinks/{name}",
           "groupIds": [
              "ResourceManagement"
           ]
         }
      }
    ],
    "subnet": {
      "id": "/subscriptions/{subID}/resourceGroups/{rgName}/providers/Microsoft.Network/virtualNetworks/{vnet-name}/subnets/{subnet-name}"
    }
  }
}
```

The next step varies depending whether you're using automatic or manual approval. For more information about approval, see [Access to a private link resource using approval workflow](../../private-link/private-endpoint-overview.md#access-to-a-private-link-resource-using-approval-workflow).

The response includes approval state.

```json
"privateLinkServiceConnectionState": {
    "actionsRequired": "None",
    "description": "",
    "status": "Approved"
},
```

If your request is automatically approved, you can continue to the next section. If your request requires manual approval, wait for the network admin to approve your private endpoint connection.

## Next steps

To learn more about private links, see [Azure Private Link](../../private-link/index.yml).
