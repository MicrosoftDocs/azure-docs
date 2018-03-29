---
title: Programmatically create Azure Enterprise subscriptions| Microsoft Docs
description: Learn how to create additional Azure Enterprise or Enterprise Dev/Test subscriptions programmatically.
author: jlian
manager: jlian
editor: ''

ms.assetid: 
ms.service: azure-resource-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 4/10/2018
ms.author: jlian
---

# Programmatically create Azure Enterprise subscriptions (preview)

As an [Azure Enterprise](https://azure.microsoft.com/pricing/enterprise-agreement/) customer and Account Owner, you can create EA and EA Dev/Test subscriptions programmatically. To give another user or service principal the permission to create subscriptions billed to your account, give them [Role-Based Access Control (RBAC)](../active-directory/role-based-access-control-configure.md) access to your enrollment account. The subscriptions created via this API are governed by your enterprise agreement. 

In this article you will:

> [!div class="checklist"]
> * Learn how to create subscriptions programmatically using Azure Resource Manager (ARM)
> * Understand how to share the ability to create subscriptions billed to your EA account

## Find accounts you have access to

After you're added to an Azure EA enrollment as an Account Owner, Azure uses the account-to-enrollment relationship to determine where to bill the subscription charges. To create subscriptions, first find out what enrollment accounts you have access to. If you're currently an EA Account Owner and you try to use this API, Azure checks for the following:

1. Your account has been added to an EA enrollment
1. You have one or more EA or EA Dev/Test subscription, meaning that you've gone through manual sign up at least once

If the above two conditions are met, an `enrollmentAccount` resource is returned and you can start creating subscriptions under that account. All subscriptions created under the account are billed towards the EA enrollment that the account is in.

Request to list all enrollment accounts you have access to:

# [REST](#tab/rest)

```json
GET https://management.azure.com/providers/Microsoft.Billing/enrollmentAccounts

{
  "parameters": {
    "api-version": "2018-03-01-preview"
  }
}
```
# [PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Get-EnrollmentAccounts
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive 
az bill list
```

---

Azure responds with a list of all enrollment accounts you have access to:

```json
{
  "value": [
    {
      "id": "/providers/Microsoft.Billing/enrollmentAccounts/e1bf1c8c-5ac6-44a0-bdcd-aa7c1cf60556",
      "name": "e1bf1c8c-5ac6-44a0-bdcd-aa7c1cf60556",
      "type": "Microsoft.Billing/enrollmentAccounts",
      "properties": {
        "principalName": "MobileOnboardingEng@contoso.com"
      }
    },
    {
      "id": "/providers/Microsoft.Billing/enrollmentAccounts/edd24053-07cd-4ed4-aa5b-326160a6680d",
      "name": "edd24053-07cd-4ed4-aa5b-326160a6680d",
      "type": "Microsoft.Billing/enrollmentAccounts",
      "properties": {
        "principalName": "MobileBackendEng@contoso.com"
      }
    }
  ]
}
```

Use the `principalName` property to identify the account that you want subscriptions to be billed to. Once you've decided, note down the `id` as that's the scope under which you can create subscriptions.

## Create subscriptions under a specific enrollment account 

Use the `id` of the `enrollmentAccount` you've determined from above to make a request to create subscriptions.

The following example creates a request to create subscription named *My New EA Subscription From API* and subscription offer is *MS-AZR-0143P* (EA Dev/Test). The enrollment account is `e1bf1c8c-5ac6-44a0-bdcd-aa7c1cf60556`, which is the enrollment account for MobileOnboardingEng@contoso.com. It also adds two users as RBAC Owners for the subscription.

# [REST](#tab/rest)

```json
POST https://management.azure.com/providers/Microsoft.Billing/enrollmentAccounts/e1bf1c8c-5ac6-44a0-bdcd-aa7c1cf60556/providers/Microsoft.Subscription/createSubscription

{
  "displayName": "My New EA Subscription From API",
  "offerType": "MS-AZR-0143P",
  "owners": [
    {
      "objectId": "973034ff-acb7-409c-b731-e789672c7b31"
    },
    {
      "objectId": "67439a9e-8519-4016-a630-f5f805eba567"
    }
  ]
}
```

| Element Name  | Required | Type   | Description                                                                                               |
|---------------|----------|--------|-----------------------------------------------------------------------------------------------------------|
| `displayName` | Yes      | String | The display name of the subscription. This is the name that shows up across Azure.                        |
| `offerType`   | Yes      | String | The offer of the subscription. For internal use, the only supported offer is MS-AZR-0015P.                |
| `owners`      | No       | String | The Object ID of any user that you'd like to add as an RBAC Owner on the subscription when it's created.  |

# [PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
New-AzureSubscription -Offer "MS-AZR-0143P" -Name "My New EA Subscription From API" -Owners "973034ff-acb7-409c-b731-e789672c7b31"
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive 
az sub create --offer "MS-AZR-0143P" --name "My New EA Subscription From API" --owners "973034ff-acb7-409c-b731-e789672c7b31"
```

----

## Delegate Contributor access to an enrollment account

To give another user or service principal the ability to create subscriptions against a specific account, [give them an RBAC Owner or Contributor role at the scope of the enrollment account](https://docs.microsoft.com/en-us/azure/active-directory/role-based-access-control-manage-access-rest). The following example gives a user in the tenant with `principalId` of `5ac84765-1c8c-4994-94b2-629461bd191b` (for MobileOnboardingEng@contoso.com) a Contributor role on the enrollment account. 

# [REST](#tab/rest)

Request:

```json
PUT  https://management.azure.com/providers/Microsoft.Billing/enrollmentAccounts/e1bf1c8c-5ac6-44a0-bdcd-aa7c1cf60556/providers/Microsoft.Authorization/roleAssignments/123e4567-e89b-12d3-a456-426655440003?api-version=2015-07-01

{
  "properties": {
    "roleDefinitionId": "/providers/Microsoft.Billing/enrollmentAccounts/providers/Microsoft.Authorization/roleDefinitions/acdd72a7-3385-48ef-bd42-f606fba81ae7",
    "principalId": "5ac84765-1c8c-4994-94b2-629461bd191b"
  }
}
```
When the Contributor role is successfully assigned at the enrollment account scope, this is the response:

```json
{
  "properties": {
    "roleDefinitionId": "/providers/Microsoft.Billing/enrollmentAccounts/providers/Microsoft.Authorization/roleDefinitions/acdd72a7-3385-48ef-bd42-f606fba81ae7",
    "principalId": "5ac84765-1c8c-4994-94b2-629461bd191b",
    "scope": "/providers/Microsoft.Billing/enrollmentAccounts/e1bf1c8c-5ac6-44a0-bdcd-aa7c1cf60556",
    "createdOn": "2018-03-05T08:36:26.4014813Z",
    "updatedOn": "2018-03-05T08:36:26.4014813Z",
    "createdBy": "877f0ab8-9c5f-420b-bf88-a1c6c7e2643e",
    "updatedBy": "877f0ab8-9c5f-420b-bf88-a1c6c7e2643e"
  },
  "id": "/providers/Microsoft.Billing/enrollmentAccounts/providers/Microsoft.Authorization/roleDefinitions/acdd72a7-3385-48ef-bd42-f606fba81ae7",
  "type": "Microsoft.Authorization/roleAssignments",
  "name": "196965ae-6088-4121-a92a-f1e33fdcc73e"
}
```

# [PowerShell](#tab/azure-powershell)

Use the [New-AzureRmRoleAssignment](https://docs.microsoft.com/azure/active-directory/role-based-access-control-manage-access-powershell#grant-access) to give another user Contributor access to your enrollment account.

```azurepowershell-interactive
New-AzureRmRoleAssignment -RoleDefinitionName Contributor -ObjectId 5ac84765-1c8c-4994-94b2-629461bd191b -Scope /providers/Microsoft.Billing/enrollmentAccounts/e1bf1c8c-5ac6-44a0-bdcd-aa7c1cf60556
```

# [Azure CLI](#tab/azure-cli)

Use the [az role assignment create](https://docs.microsoft.com/azure/active-directory/role-based-access-control-manage-access-azure-cli#assign-access) to give another user Contributor access to your enrollment account.

```azurecli-interactive 
az role assignment create --role Contributor --assignee-object-id 5ac84765-1c8c-4994-94b2-629461bd191b --scope /providers/Microsoft.Billing/enrollmentAccounts/e1bf1c8c-5ac6-44a0-bdcd-aa7c1cf60556
```

----

Now that you've added a user with Contributor role at the enrollment account scope, ask that user to authenticate against Azure and make a request to create subscription against the enrollment account you shared earlier.

## Limitations of Azure Enterprise subscription creation API

1. There's a limit of 50 subscriptions per account. After that, subscriptions can only be created via UI.
1. There needs to be one or more EA or EA Dev/Test subscription under the account, meaning that the Account Owner has gone through manual sign up at least once