---
title: Programmatically create Azure Enterprise subscriptions| Microsoft Docs
description: Learn how to create additional Azure Enterprise or Enterprise Dev/Test subscriptions programmatically.
services: azure-resource-manager
author: adpick
manager: adpick
editor: ''

ms.assetid: 
ms.service: azure-resource-manager
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/05/2018
ms.author: adpick
---

# Programmatically create Azure Enterprise subscriptions (preview)

As an Azure customer on [Enterprise Agreement (EA)](https://azure.microsoft.com/pricing/enterprise-agreement/), you can create EA (MS-AZR-0017P) and EA Dev/Test (MS-AZR-0148P) subscriptions programmatically. In this article, you learn how to create subscriptions programmatically using Azure Resource Manager.

When you create an Azure subscription from this API, that subscription is governed by the agreement under which you obtained Microsoft Azure services from Microsoft or an authorized reseller. To learn more, see [Microsoft Azure Legal Information](https://azure.microsoft.com/support/legal/).

## Prerequisites

You must have an Owner or Contributor role on the Enrollment Account you wish to create subscriptions under. There are two ways to get these roles:

* Your Enrollment Administrator can [make you an Account Owner](https://ea.azure.com/helpdocs/addNewAccount) (log-in required) which makes you an Owner of the Enrollment Account. Follow the instructions in the invitation email you receive to manually create an initial subscription. Confirm account ownership and manually create an initial EA subscription before proceeding to the next step. Just adding the account to the enrollment isn't enough.

* An existing Owner of the Enrollment Account can [grant you access](grant-access-to-create-subscription.md). Similarly, if you want to use a service principal to create the EA subscription, you must [grant that service principal the ability to create subscriptions](grant-access-to-create-subscription.md).

## Find accounts you have access to

After you're added to an Azure EA enrollment as an Account Owner, Azure uses the account-to-enrollment relationship to determine where to bill the subscription charges. All subscriptions created under the account are billed towards the EA enrollment that the account is in. To create subscriptions, you must pass in values about the enrollment account and the user principals to own the subscription. 

To run the following commands, you must be logged in to the Account Owner's *home directory*, which is the directory that subscriptions are created in by default.

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
      "id": "/providers/Microsoft.Billing/enrollmentAccounts/747ddfe5-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "name": "747ddfe5-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "type": "Microsoft.Billing/enrollmentAccounts",
      "properties": {
        "principalName": "SignUpEngineering@contoso.com"
      }
    },
    {
      "id": "/providers/Microsoft.Billing/enrollmentAccounts/4cd2fcf6-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "name": "4cd2fcf6-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "type": "Microsoft.Billing/enrollmentAccounts",
      "properties": {
        "principalName": "BillingPlatformTeam@contoso.com"
      }
    }
  ]
}
```

# [PowerShell](#tab/azure-powershell)

Use the [Get-AzureRmEnrollmentAccount command](/powershell/module/azurerm.billing/get-azurermenrollmentaccount) to list all enrollment accounts you have access to.

```azurepowershell-interactive
Get-AzureRmEnrollmentAccount
```

Azure responds with a list of the Object IDs and email addresses of accounts.

```azurepowershell
ObjectId                               | PrincipalName
747ddfe5-xxxx-xxxx-xxxx-xxxxxxxxxxxx   | SignUpEngineering@contoso.com
4cd2fcf6-xxxx-xxxx-xxxx-xxxxxxxxxxxx   | BillingPlatformTeam@contoso.com
```

# [Azure CLI](#tab/azure-cli)

Use the [az billing enrollment-account list](https://aka.ms/EASubCreationPublicPreviewCLI) command to list all enrollment accounts you have access to.

```azurecli-interactive 
az billing enrollment-account list
```

Azure responds with a list of the Object IDs and email addresses of accounts.

```json
{
  "value": [
    {
      "id": "/providers/Microsoft.Billing/enrollmentAccounts/747ddfe5-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "name": "747ddfe5-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "type": "Microsoft.Billing/enrollmentAccounts",
      "properties": {
        "principalName": "SignUpEngineering@contoso.com"
      }
    },
    {
      "id": "/providers/Microsoft.Billing/enrollmentAccounts/747ddfe5-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "name": "4cd2fcf6-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "type": "Microsoft.Billing/enrollmentAccounts",
      "properties": {
        "principalName": "BillingPlatformTeam@contoso.com"
      }
    }
  ]
}
```

---

Use the `principalName` property to identify the account that you want subscriptions to be billed to. Use the `id` as the `enrollmentAccount` value that you use to create the subscription in the next step.

## Create subscriptions under a specific enrollment account 

The following example creates a request to create subscription named *Dev Team Subscription* and subscription offer is *MS-AZR-0017P* (regular EA). The enrollment account is `747ddfe5-xxxx-xxxx-xxxx-xxxxxxxxxxxx` (placeholder value, this value is a GUID), which is the enrollment account for SignUpEngineering@contoso.com. It also optionally adds two users as RBAC Owners for the subscription.

# [REST](#tab/rest)

Use the `id` of the `enrollmentAccount` in the path of the request to create subscription.

```json
POST https://management.azure.com/providers/Microsoft.Billing/enrollmentAccounts/747ddfe5-xxxx-xxxx-xxxx-xxxxxxxxxxxx/providers/Microsoft.Subscription/createSubscription?api-version=2018-03-01-preview

{
  "displayName": "Dev Team Subscription",
  "offerType": "MS-AZR-0017P",
  "owners": [
    {
      "objectId": "<userObjectId>"
    },
    {
      "objectId": "<servicePrincipalObjectId>"
    }
  ]
}
```

| Element Name  | Required | Type   | Description                                                                                               |
|---------------|----------|--------|-----------------------------------------------------------------------------------------------------------|
| `displayName` | No      | String | The display name of the subscription. If not specified, it's set to the name of the offer, like "Microsoft Azure Enterprise."                                 |
| `offerType`   | Yes      | String | The offer of the subscription. The two options for EA are [MS-AZR-0017P](https://azure.microsoft.com/pricing/enterprise-agreement/) (production use) and [MS-AZR-0148P](https://azure.microsoft.com/offers/ms-azr-0148p/) (dev/test, needs to be [turned on using the EA portal](https://ea.azure.com/helpdocs/DevOrTestOffer)).                |
| `owners`      | No       | String | The Object ID of any user that you'd like to add as an RBAC Owner on the subscription when it's created.  |

In the response, you get back a `subscriptionOperation` object for monitoring. When the subscription creation is finished, the `subscriptionOperation` object would return a `subscriptionLink` object, which has the subscription ID.

# [PowerShell](#tab/azure-powershell)

To use this preview module, install it by running `Install-Module AzureRM.Subscription -AllowPrerelease` first. To make sure `-AllowPrerelease` works, install a recent version of PowerShellGet from [Get PowerShellGet Module](/powershell/gallery/installing-psget).

Use the [New-AzureRmSubscription](/powershell/module/azurerm.subscription) along with `enrollmentAccount` object ID as the `EnrollmentAccountObjectId` parameter to create a new subscription. 

```azurepowershell-interactive
New-AzureRmSubscription -OfferType MS-AZR-0017P -Name "Dev Team Subscription" -EnrollmentAccountObjectId 747ddfe5-xxxx-xxxx-xxxx-xxxxxxxxxxxx -OwnerObjectId <userObjectId>,<servicePrincipalObjectId>
```

| Element Name  | Required | Type   | Description                                                                                               |
|---------------|----------|--------|-----------------------------------------------------------------------------------------------------------|
| `Name` | No      | String | The display name of the subscription. If not specified, it's set to the name of the offer, like "Microsoft Azure Enterprise."                                 |
| `OfferType`   | Yes      | String | The offer of the subscription. The two options for EA are [MS-AZR-0017P](https://azure.microsoft.com/pricing/enterprise-agreement/) (production use) and [MS-AZR-0148P](https://azure.microsoft.com/offers/ms-azr-0148p/) (dev/test, needs to be [turned on using the EA portal](https://ea.azure.com/helpdocs/DevOrTestOffer)).                |
| `EnrollmentAccountObjectId`      | Yes       | String | The Object ID of the enrollment account that the subscription is created under and billed to. This value is a GUID that you get from `Get-AzureRmEnrollmentAccount`. |
| `OwnerObjectId`      | No       | String | The Object ID of any user that you'd like to add as an RBAC Owner on the subscription when it's created.  |
| `OwnerSignInName`    | No       | String | The email address of any user that you'd like to add as an RBAC Owner on the subscription when it's created. You can use this parameter instead of `OwnerObjectId`.|
| `OwnerApplicationId` | No       | String | The application ID of any service principal that you'd like to add as an RBAC Owner on the subscription when it's created. You can use this parameter instead of `OwnerObjectId`. When using this parameter, the service principal must have [read access to the directory](/powershell/azure/active-directory/signing-in-service-principal?view=azureadps-2.0#give-the-service-principal-reader-access-to-the-current-tenant-get-azureaddirectoryrole).| 

To see a full list of all parameters, see [New-AzureRmSubscription](/powershell/module/azurerm.subscription.preview).

# [Azure CLI](#tab/azure-cli)

To use this preview extension, install it by running `az extension add --name subscription` first.

Use the [az account create](/cli/azure/ext/subscription/account?view=azure-cli-latest#-ext-subscription-az-account-create) along with `enrollmentAccount` object ID as the `enrollment-account-object-id` parameter to create a new subscription.

```azurecli-interactive 
az account create --offer-type "MS-AZR-0017P" --display-name "Dev Team Subscription" --enrollment-account-object-id "747ddfe5-xxxx-xxxx-xxxx-xxxxxxxxxxxx" --owner-object-id "<userObjectId>","<servicePrincipalObjectId>"
```

| Element Name  | Required | Type   | Description                                                                                               |
|---------------|----------|--------|-----------------------------------------------------------------------------------------------------------|
| `display-name` | No      | String | The display name of the subscription. If not specified, it's set to the name of the offer, like "Microsoft Azure Enterprise."                                 |
| `offer-type`   | Yes      | String | The offer of the subscription. The two options for EA are [MS-AZR-0017P](https://azure.microsoft.com/pricing/enterprise-agreement/) (production use) and [MS-AZR-0148P](https://azure.microsoft.com/offers/ms-azr-0148p/) (dev/test, needs to be [turned on using the EA portal](https://ea.azure.com/helpdocs/DevOrTestOffer)).                |
| `enrollment-account-object-id`      | Yes       | String | The Object ID of the enrollment account that the subscription is created under and billed to. This value is a GUID that you get from `az billing enrollment-account list`. |
| `owner-object-id`      | No       | String | The Object ID of any user that you'd like to add as an RBAC Owner on the subscription when it's created.  |
| `owner-upn`    | No       | String | The email address of any user that you'd like to add as an RBAC Owner on the subscription when it's created. You can use this parameter instead of `owner-object-id`.|
| `owner-spn` | No       | String | The application ID of any service principal that you'd like to add as an RBAC Owner on the subscription when it's created. You can use this parameter instead of `owner-object-id`. When using this parameter, the service principal must have [read access to the directory](/powershell/azure/active-directory/signing-in-service-principal?view=azureadps-2.0#give-the-service-principal-reader-access-to-the-current-tenant-get-azureaddirectoryrole).| 

To see a full list of all parameters, see [az account create](/cli/azure/ext/subscription/account?view=azure-cli-latest#-ext-subscription-az-account-create).

----

## Limitations of Azure Enterprise subscription creation API

- Only Azure Enterprise subscriptions can be created using this API.
- There's a limit of 50 subscriptions per account. After that, subscriptions can only be created by using Account Center.
- There needs to be at least one EA or EA Dev/Test subscriptions under the account, which means the Account Owner has gone through manual sign-up at least once.
- Users who aren't Account Owners, but were added to an enrollment account via RBAC, can't create subscriptions using Account Center.
- You can't select the tenant for the subscription to be created in. The subscription is always created in the home tenant of the Account Owner. To move the subscription to a different tenant, see [change subscription tenant](../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md).

## Next steps

* For an example on creating subscriptions using .NET, see [sample code on GitHub](https://github.com/Azure-Samples/create-azure-subscription-dotnet-core).
* Now that you've created a subscription, you can grant that ability to other users and service principals. For more information, see [Grant access to create Azure Enterprise subscriptions (preview)](grant-access-to-create-subscription.md).
* To learn more about managing large numbers of subscriptions using management groups, see [Organize your resources with Azure management groups](management-groups-overview.md)
