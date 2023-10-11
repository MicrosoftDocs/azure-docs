---
title: View associated resources for a user-assigned managed identity
description: Step-by-step instructions for viewing the Azure resources that are associated with a user-assigned managed identity
services: active-directory
documentationcenter: ''
author: barclayn
manager: amycolannino
editor: ''

ms.service: active-directory
ms.subservice: msi
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 01/18/2023
ms.author: barclayn
ms.collection: M365-identity-device-management
---

# View associated Azure resources for a user-assigned managed identity (Preview)

This article will explain how to view the Azure resources that are associated with a user-assigned managed identity. This feature is available in public preview.

## Prerequisites

- If you're unfamiliar with managed identities for Azure resources, check out the [overview section](overview.md).
- If you don't already have an Azure account, [sign up for a free account](https://azure.microsoft.com/free/).


## View resources for a user-assigned managed identity

Being able to quickly see which Azure resources are associated with a user-assigned managed identity gives you greater visibility into your environment. You can quickly identify unused identities that can be safely deleted, and know which resources will be affected by changing the permissions or group membership of a managed identity.

### Portal

- From the **Azure portal** search for **Managed Identities**.
- Select a managed identity
- In the left-hand menu, select the **Associated resources** link
- A list of the Azure resources associated with the managed identity will be displayed

:::image type="content" source="media/viewing-associated-resources/associated-resources-list-cropped.png" alt-text="Screenshot showing a list of associated resources for a user-assigned managed identity.":::

Select the resource name to be brought to its summary page.

#### Filtering and sorting by resource type

Filter the resources by typing in the filter box at the top of the summary page. You can filter by the name, type, resource group, and subscription ID.

Select the column title to sort alphabetically, ascending or descending.

### REST API 

The list of associated resources can also be accessed using the REST API. This endpoint is separate to the API endpoint used to retrieve a list of user-assigned managed identities. You'll need the following information:
 - Subscription ID
 - Resource name of the user-assigned managed identity that you want to view the resources for
 - Resource group of the user-assigned managed identity
 
*Request format*
```
https://management.azure.com/subscriptions/{resourceID of user-assigned identity}/listAssociatedResources?$filter={filter}&$orderby={orderby}&$skip={skip}&$top={top}&$skiptoken={skiptoken}&api-version=2021-09-30-preview 
```

*Parameters*

| Parameter   | Example  |Description  |
|---|---|---|
| $filter  |  ```type eq 'microsoft.cognitiveservices/account' and contains(name, 'test')``` |  An OData expression that allows you to filter any of the available fields: name, type, resourceGroup, subscriptionId, subscriptionDisplayName<br/><br/>The following operations are supported: ```and```, ```or```, ```eq``` and ```contains``` |
|  $orderby |  ```name asc``` |  An OData expression that allows you to order by any of the available fields |
|  $skip |  50 |  The number of items you want to skip while paging through the results. |
| $top  |  10 | The number of resources to return. 0 will return only a count of the resources.  |

You can see a sample request to the REST API:

```http
POST https://management.azure.com/subscriptions/aab111d1-1111-43e2-8d11-3bfc47ab8111/resourceGroups/devrg/providers/Microsoft.ManagedIdentity/userAssignedIdentities/devIdentity/listAssociatedResources?$filter={filter}&$orderby={orderby}&$skip={skip}&$top={top}&skipToken={skipToken}&api-version=2021-09-30-preview 
```

Notice a sample response from the REST API:

```json
{
  "totalCount": 2,
  "value": [
    {
      "id": "/subscriptions/{subId}/resourceGroups/testrg/providers/Microsoft.CognitiveServices/accounts/test1",
      "name": "test1",
      "type": "microsoft.cognitiveservices/accounts",
      "resourceGroup": "testrg",
      "subscriptionId": "{subId}",
      "subscriptionDisplayName": "TestSubscription"
    },
    {
      "id": "/subscriptions/{subId}/resourceGroups/testrg/providers/Microsoft.CognitiveServices/accounts/test2",
      "name": "test2",
      "type": "microsoft.cognitiveservices/accounts",
      "resourceGroup": "testrg",
      "subscriptionId": "{subId}",
      "subscriptionDisplayName": "TestSubscription"
    }
  ],
  "nextLink": "https://management.azure.com/subscriptions/{subId}/resourceGroups/testrg/providers/Microsoft.ManagedIdentity/userAssignedIdentities/testid?skiptoken=ew0KICAiJGlkIjogIjEiLA0KICAiTWF4Um93cyI6IDIsDQogICJSb3dzVG9Ta2lwIjogMiwNCiAgIkt1c3RvQ2x1c3RlclVybCI6ICJodHRwczovL2FybXRvcG9sb2d5Lmt1c3RvLndpbmRvd3MubmV0Ig0KfQ%253d%253d&api-version=2021"
}

```

### Command Line Interface

To view the associated resources for a user-assigned managed identity, run the following command:

```azurecli
az identity list-resources --resource-group <ResourceGroupName> --name <ManagedIdentityName>
```

The response will look like this:

```json
[
  {
    "id": "/subscriptions/XXXX-XXXX-XXXX-XXXX-XXXfc47ab8130/resourceGroups/ProductionServices/providers/Microsoft.Compute/virtualMachines/linux-prod-1-US",
    "name": "linux-prod-1-US",
    "resourceGroup": "productionservices",
    "subscriptionDisplayName": "Visual Studio Enterprise Subscription",
    "subscriptionId": "XXXX-XXXX-XXXX-XXXX-XXXfc47ab8130",
    "type": "microsoft.compute/virtualmachines"
  },
  {
    "id": "/subscriptions/XXXX-XXXX-XXXX-XXXX-XXXfc47ab8130/resourceGroups/ProductionServices/providers/Microsoft.Web/sites/prodStatusCheck-US",
    "name": "prodStatusCheck-US",
    "resourceGroup": "productionservices",
    "subscriptionDisplayName": "Visual Studio Enterprise Subscription",
    "subscriptionId": "XXXX-XXXX-XXXX-XXXX-XXXfc47ab8130",
    "type": "microsoft.web/sites"
  },
  {
    "id": "/subscriptions/XXXX-XXXX-XXXX-XXXX-XXXfc47ab8130/resourceGroups/ProductionServices/providers/Microsoft.Web/sites/salesApp-US-1",
    "name": "salesApp-US-1",
    "resourceGroup": "productionservices",
    "subscriptionDisplayName": "Visual Studio Enterprise Subscription",
    "subscriptionId": "XXXX-XXXX-XXXX-XXXX-XXXfc47ab8130",
    "type": "microsoft.web/sites"
  },
  {
    "id": "/subscriptions/XXXX-XXXX-XXXX-XXXX-XXXfc47ab8130/resourceGroups/ProductionServices/providers/Microsoft.Web/sites/salesPortal-us-2",
    "name": "salesPortal-us-2",
    "resourceGroup": "productionservices",
    "subscriptionDisplayName": "Visual Studio Enterprise Subscription",
    "subscriptionId": "XXXX-XXXX-XXXX-XXXX-XXXfc47ab8130",
    "type": "microsoft.web/sites"
  },
  {
    "id": "/subscriptions/XXXX-XXXX-XXXX-XXXX-XXXfc47ab8130/resourceGroups/vmss/providers/Microsoft.Compute/virtualMachineScaleSets/vmsstest",
    "name": "vmsstest",
    "resourceGroup": "vmss",
    "subscriptionDisplayName": "Visual Studio Enterprise Subscription",
    "subscriptionId": "XXXX-XXXX-XXXX-XXXX-XXXfc47ab8130",
    "type": "microsoft.compute/virtualmachinescalesets"
  }
]
```

### REST API using PowerShell

There's no specific PowerShell command for returning the associated resources of a managed identity, but you can use the REST API in PowerShell by using the following command:

```PowerShell
Invoke-AzRestMethod -Path "/subscriptions/XXX-XXX-XXX-XXX/resourceGroups/test-rg/providers/Microsoft.ManagedIdentity/userAssignedIdentities/test-identity-name/listAssociatedResources?api-version=2021-09-30-PREVIEW&%24orderby=name%20asc&%24skip=0&%24top=100" -Method Post
```

>[!NOTE]
> All resources associated with an identity will be returned, regardless of the user's permissions. The user only needs to have access to read the managed identity. This means that more resources may be visible than the user can see elsewhere in the portal. This is to provide full visibility of the identity's usage. If the user doesn't have access to an associated resource, an error will be displayed if they try to access it from the list.

## Delete a user-assigned managed identity

When you select the delete button for a user-assigned managed identity, you'll see a list of up to 10 associated resources for that identity. The full count will be displayed at the top of the pane. This list allows you to see which resources will be affected by deleting the identity. You'll be asked to confirm your decision.

:::image type="content" source="media/viewing-associated-resources/associated-resources-delete.png" alt-text="Screenshot showing the delete confirmation screen for a user-assigned managed identity.":::

This confirmation process is only available in the portal. To view an identity's resources before deleting it using the REST API, retrieve the list of resources manually in advance.

## Limitations

 - This functionality is available in all public regions, and will be available in USGov and China in the coming weeks.
 - API requests for associated resources are limited to one per second per tenant. If you exceed this limit, you may receive a `HTTP 429` error. This limit doesn't apply to retrieving a list of user-assigned managed identities.
 - Azure Resources types that are in preview, or their support for Managed identities is in preview, may not appear in the associated resources list until fully generally available. This list includes Service Fabric clusters, Blueprints, and Machine learning services.
 - This functionality is limited to tenants with fewer than 5,000 subscriptions. An error will be displayed if the tenant has greater than 5,000 subscriptions.
 - The list of associated resources will display the resource type, not display name.
 - Azure Policy assignments appear in the list, but their names aren't displayed correctly.
 - This functionality isn't yet available through PowerShell.

## Next steps

* [Managed identities for Azure resources](./overview.md)
