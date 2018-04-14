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

As an Azure customer on [Enterprise Agreement (EA)](https://azure.microsoft.com/pricing/enterprise-agreement/), you can create EA (MS-AZR-0017P) and EA Dev/Test (MS-AZR-0148P) subscriptions programmatically. To give another user or service principal the permission to create subscriptions billed to your account, give them [Role-Based Access Control (RBAC)](../active-directory/role-based-access-control-configure.md) access to your enrollment account. 

> [!IMPORTANT]
> The Azure subscription(s) created via this API are governed by the agreement under which you have obtained Microsoft Azure services from Microsoft or an authorized reseller. To learn more, see [Microsoft Azure Legal Information](https://azure.microsoft.com/support/legal/).

In this article you will:

> [!div class="checklist"]
> * Learn how to create subscriptions programmatically using Azure Resource Manager (ARM)
> * Understand how to use RBAC to share the ability to create subscriptions billed to your EA account

## Ask your EA Enrollment Admin to add you as Account Owner

To begin, ask your Enrollment Administrator to [add you as an Account Owner in using the EA portal](https://ea.azure.com/helpdocs/addNewAccount) (log-in required). Follow the instructions in the invitation email you receive to manually create an initial subscription.

> [!IMPORTANT]
> You must confirm account ownership and manually create an initial EA subscription before proceeding to the next step. Just adding the account to the enrollment is not enough.

## Find accounts you have access to

After you're added to an Azure EA enrollment as an Account Owner, Azure uses the account-to-enrollment relationship to determine where to bill the subscription charges. To create subscriptions, first find out what enrollment accounts you have access to. If you're currently an EA Account Owner and you try to use this API, Azure checks for the following conditions:

- Your account has been added to an EA enrollment
- You have one or more EA or EA Dev/Test subscriptions, meaning that you've gone through manual sign-up at least once
- You're logged into the Account Owner's *home directory*, which is the directory that subscriptions are created in by default

If the above two conditions are met, an `enrollmentAccount` resource is returned and you can start creating subscriptions under that account. All subscriptions created under the account are billed towards the EA enrollment that the account is in.

# [REST](#tab/rest)

Request to list all enrollment accounts:

```json
GET https://management.azure.com/providers/Microsoft.Billing/enrollmentAccounts?api-version=2018-03-01-preview
```

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

# [PowerShell](#tab/azure-powershell)

[!INCLUDE [cloud-shell-powershell.md](../../includes/cloud-shell-powershell.md)]

Use the [Get-EnrollmentAccount command](/powershell/module/azurerm.billing/get-azurermenrollmentaccount) to list all enrollment accounts you have access to.

```azurepowershell-interactive
Get-EnrollmentAccount
```

Azure responds with a list of the Object IDs and email addresses of accounts.

```azurepowershell
ObjectId                               | PrincipalName
e1bf1c8c-5ac6-44a0-bdcd-aa7c1cf60556   | MobileOnboardingEng@contoso.com
edd24053-07cd-4ed4-aa5b-326160a6680d   | MobileBackendEng@contoso.com
```

# [Azure CLI](#tab/azure-cli)

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

Use the [az billing enrollment-account list](https://aka.ms/EASubCreationPublicPreviewCLI) command to list all enrollment accounts you have access to.

```azurecli-interactive 
az billing enrollment-account list
```
Azure responds with a list of the Object IDs and email addresses of accounts.

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

---

Use the `principalName` property to identify the account that you want subscriptions to be billed to. Use the `id` as the `enrollmentAccount` value that you use to create the subscription in the next step.

## Create subscriptions under a specific enrollment account 

The following example creates a request to create subscription named *Dev Team Subscription* and subscription offer is *MS-AZR-0017P* (regular EA). The enrollment account is `e1bf1c8c-5ac6-44a0-bdcd-aa7c1cf60556`, which is the enrollment account for MobileOnboardingEng@contoso.com. It also optionally adds two users as RBAC Owners for the subscription.

# [REST](#tab/rest)

Use the `id` of the `enrollmentAccount` in the path of the request to create subscription.

```json
POST https://management.azure.com/providers/Microsoft.Billing/enrollmentAccounts/e1bf1c8c-5ac6-44a0-bdcd-aa7c1cf60556/providers/Microsoft.Subscription/createSubscription?api-version=2018-03-01-preview

{
  "displayName": "Dev Team Subscription",
  "offerType": "MS-AZR-0017P",
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
| `displayName` | No      | String | The display name of the subscription. If not specified, it is set to the name of the offer, like "Microsoft Azure Enterprise."                                 |
| `offerType`   | Yes      | String | The offer of the subscription. The two options for EA are [MS-AZR-0017P](https://azure.microsoft.com/pricing/enterprise-agreement/) (production use) and [MS-AZR-0148P](https://azure.microsoft.com/offers/ms-azr-0148p/) (dev/test, needs to be [turned on using the EA portal](https://ea.azure.com/helpdocs/DevOrTestOffer)).                |
| `owners`      | No       | String | The Object ID of any user that you'd like to add as an RBAC Owner on the subscription when it's created.  |

In the response, you get back a `subscriptionOperation` object for monitoring. When the subscription creation is finished, the `subscriptionOperation` object would return a `subscriptionLink` object, which has the subscription ID.

# [PowerShell](#tab/azure-powershell)

To use this preview module, install it by running `Install-Module AzureRM.Subscription -AllowPrerelease` first. To make sure `-AllowPrerelease` works, install a recent version of PowerShellGet from [Get PowerShellGet Module](/powershell/gallery/psget/get_psget_module).

Use the [New-AzureRmSubscription](/powershell/module/azurerm.subscription.preview) along with `enrollmentAccount` name as the `EnrollmentAccountObjectId` parameter to create a new subscription. 

```azurepowershell-interactive
New-AzureRmSubscription -OfferType MS-AZR-0017P -Name "Dev Team Subscription" -EnrollmentAccountObjectId e1bf1c8c-5ac6-44a0-bdcd-aa7c1cf60556 -OwnerObjectId 973034ff-acb7-409c-b731-e789672c7b31,67439a9e-8519-4016-a630-f5f805eba567
```

| Element Name  | Required | Type   | Description                                                                                               |
|---------------|----------|--------|-----------------------------------------------------------------------------------------------------------|
| `Name` | No      | String | The display name of the subscription. If not specified, it is set to the name of the offer, like "Microsoft Azure Enterprise."                                 |
| `OfferType`   | Yes      | String | The offer of the subscription. The two options for EA are [MS-AZR-0017P](https://azure.microsoft.com/pricing/enterprise-agreement/) (production use) and [MS-AZR-0148P](https://azure.microsoft.com/offers/ms-azr-0148p/) (dev/test, needs to be [turned on using the EA portal](https://ea.azure.com/helpdocs/DevOrTestOffer)).                |
| `OwnerObjectId`      | No       | String | The Object ID of any user that you'd like to add as an RBAC Owner on the subscription when it's created.  |
| `OwnerSignInName`    | No       | String | The email address of any user that you'd like to add as an RBAC Owner on the subscription when it's created. You can use this parameter instead of `OwnerObjectId`.|
| `OwnerApplicationId` | No       | String | The application ID of any service principal that you'd like to add as an RBAC Owner on the subscription when it's created. You can use this parameter instead of `OwnerObjectId`.| 

To see a full list of all parameters, see [New-AzureRmSubscription](/powershell/module/azurerm.subscription.preview).

# [Azure CLI](#tab/azure-cli)

To use this preview extension, install it by running `az extension add --name subscription` first.

Use the [az account create](/cli/azure/ext/subscription/account) along with `enrollmentAccount` name as the `enrollment_account_name` parameter to create a new subscription.

```azurecli-interactive 
az account create --offer-type "MS-AZR-0017P" --display-name "Dev Team Subscription" --enrollment-account-name "e1bf1c8c-5ac6-44a0-bdcd-aa7c1cf60556" --owner-object-id "973034ff-acb7-409c-b731-e789672c7b31","67439a9e-8519-4016-a630-f5f805eba567"
```

| Element Name  | Required | Type   | Description                                                                                               |
|---------------|----------|--------|-----------------------------------------------------------------------------------------------------------|
| `display-name` | No      | String | The display name of the subscription. If not specified, it is set to the name of the offer, like "Microsoft Azure Enterprise."                                 |
| `offer-type`   | Yes      | String | The offer of the subscription. The two options for EA are [MS-AZR-0017P](https://azure.microsoft.com/pricing/enterprise-agreement/) (production use) and [MS-AZR-0148P](https://azure.microsoft.com/offers/ms-azr-0148p/) (dev/test, needs to be [turned on using the EA portal](https://ea.azure.com/helpdocs/DevOrTestOffer)).                |
| `owner-object-id`      | No       | String | The Object ID of any user that you'd like to add as an RBAC Owner on the subscription when it's created.  |
| `upn`    | No       | String | The email address of any user that you'd like to add as an RBAC Owner on the subscription when it's created. You can use this parameter instead of `owner-object-id`.|
| `spn` | No       | String | The application ID of any service principal that you'd like to add as an RBAC Owner on the subscription when it's created. You can use this parameter instead of `owner-object-id`.| 

To see a full list of all parameters, see [az account create](/cli/azure/account).

----

## Delegate access to an enrollment account using RBAC

To give another user or service principal the ability to create subscriptions against a specific account, [give them an RBAC Owner role at the scope of the enrollment account](../active-directory/role-based-access-control-manage-access-rest.md). The following example gives a user in the tenant with `principalId` of `5ac84765-1c8c-4994-94b2-629461bd191b` (for MobileOnboardingEng@contoso.com) an Owner role on the enrollment account. 

# [REST](#tab/rest)

```json
PUT  https://management.azure.com/providers/Microsoft.Billing/enrollmentAccounts/e1bf1c8c-5ac6-44a0-bdcd-aa7c1cf60556/providers/Microsoft.Authorization/roleAssignments/123e4567-e89b-12d3-a456-426655440003?api-version=2015-07-01

{
  "properties": {
    "roleDefinitionId": "/providers/Microsoft.Billing/enrollmentAccounts/providers/Microsoft.Authorization/roleDefinitions/acdd72a7-3385-48ef-bd42-f606fba81ae7",
    "principalId": "5ac84765-1c8c-4994-94b2-629461bd191b"
  }
}
```
When the Owner role is successfully assigned at the enrollment account scope, Azure responds with information of the role assignment:

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

Use the [New-AzureRmRoleAssignment](../active-directory/role-based-access-control-manage-access-powershell.md) to give another user Owner access to your enrollment account.

```azurepowershell-interactive
New-AzureRmRoleAssignment -RoleDefinitionName Owner -ObjectId 5ac84765-1c8c-4994-94b2-629461bd191b -Scope /providers/Microsoft.Billing/enrollmentAccounts/e1bf1c8c-5ac6-44a0-bdcd-aa7c1cf60556
```

# [Azure CLI](#tab/azure-cli)

Use the [az role assignment create](../active-directory/role-based-access-control-manage-access-azure-cli.md) to give another user Owner access to your enrollment account.

```azurecli-interactive 
az role assignment create --role Owner --assignee-object-id 5ac84765-1c8c-4994-94b2-629461bd191b --scope /providers/Microsoft.Billing/enrollmentAccounts/e1bf1c8c-5ac6-44a0-bdcd-aa7c1cf60556
```

----

Once a user becomes an RBAC Owner for your enrollment account, they can programmatically create subscriptions under it. A subscription created by a delegated user still has the original Account Owner as Service Admin, but it also has the delegated user as an Owner by default. 

## Audit who created subscriptions using activity logs

To track the subscriptions created via this API, use the [Tenant Activity Log API](/rest/api/monitor/tenantactivitylogs). It's currently not possible to use PowerShell, CLI, or Azure portal to track subscription creation.

1. As a tenant admin of the Azure AD tenant, [elevate access](role-based-access-control/elevate-access-global-admin.md) then assign a Reader role to the auditing user over the scope `/providers/microsoft.insights/eventtypes/management`.
1. As the auditing user, call the [Tenant Activity Log API](/rest/api/monitor/tenantactivitylogs) to see subscription creation activities. Example:

```
GET "/providers/Microsoft.Insights/eventtypes/management/values?api-version=2015-04-01&$filter=eventTimestamp ge '{greaterThanTimeStamp}' and eventTimestamp le '{lessThanTimestamp}' and eventChannels eq 'Operation' and resourceProvider eq 'Microsoft.Subscription'" 
```

> [!NOTE]
> To conveniently call this API from the command line, try [ARMClient](https://github.com/projectkudu/ARMClient).

## Limitations of Azure Enterprise subscription creation API

- Only Azure Enterprise subscriptions can be created using this API.
- There's a limit of 50 subscriptions per account. After that, subscriptions can only be created by using Account Center.
- There needs to be at least one EA or EA Dev/Test subscriptions under the account, which means the Account Owner has gone through manual sign-up at least once.
- Users who aren't Account Owners, but were added to an enrollment account via RBAC, cannot create subscriptions using Account Center.
- You cannot select the tenant for the subscription to be created in. The subscription is always created in the home tenant of the Account Owner. To move the subscription to a different tenant, see [change subscription tenant](..\active-directory\active-directory-how-subscriptions-associated-directory.md).

## Next steps

* To learn more about Azure Resource Manager and its APIs, see [Azure Resource Manager overview](resource-group-overview.md).
* To learn more about managing large numbers of subscriptions using Management Groups, see [Organize your resources with Azure Management Groups](management-groups-overview.md)
* To see a comprehensive best practice guidance for large organizations on subscription governance, see [Azure enterprise scaffold - prescriptive subscription governance](resource-manager-subscription-governance.md)
