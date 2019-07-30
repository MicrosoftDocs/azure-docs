---
title: Programmatically create Azure Enterprise subscriptions| Microsoft Docs
description: Learn how to create additional Azure Enterprise or Enterprise Dev/Test subscriptions programmatically.
services: azure-resource-manager
author: jureid

ms.service: azure-resource-manager
ms.topic: conceptual
ms.date: 04/10/2019
ms.author: jureid
---

# Programmatically create Azure Enterprise subscriptions (preview)

As an Azure customer on [Enterprise Agreement (EA)](https://azure.microsoft.com/pricing/enterprise-agreement/), you can create EA (MS-AZR-0017P) and EA Dev/Test (MS-AZR-0148P) subscriptions programmatically. In this article, you learn how to create subscriptions programmatically using Azure Resource Manager.

When you create an Azure subscription from this API, that subscription is governed by the agreement under which you obtained Microsoft Azure services from Microsoft or an authorized reseller. To learn more, see [Microsoft Azure Legal Information](https://azure.microsoft.com/support/legal/).

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Prerequisites

You must have an Owner role on the Enrollment Account you wish to create subscriptions under. There are two ways to get these roles:

* Your Enrollment Administrator can [make you an Account Owner](https://ea.azure.com/helpdocs/addNewAccount) (sign in required) which makes you an Owner of the Enrollment Account. Follow the instructions in the invitation email you receive to manually create an initial subscription. Confirm account ownership and manually create an initial EA subscription before proceeding to the next step. Just adding the account to the enrollment isn't enough.

* An existing Owner of the Enrollment Account can [grant you access](grant-access-to-create-subscription.md). Similarly, if you want to use a service principal to create the EA subscription, you must [grant that service principal the ability to create subscriptions](grant-access-to-create-subscription.md).

## Find accounts you have access to

After you're added to an Azure EA enrollment as an Account Owner, Azure uses the account-to-enrollment relationship to determine where to bill the subscription charges. All subscriptions created under the account are billed towards the EA enrollment that the account is in. To create subscriptions, you must pass in values about the enrollment account and the user principals to own the subscription. 

To run the following commands, you must be logged in to the Account Owner's *home directory*, which is the directory that subscriptions are created in by default.

## [REST](#tab/rest)

Request to list all enrollment accounts you have access to:

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

Use the `principalName` property to identify the account that you want subscriptions to be billed to. Copy the `name` of that account. For example, if you wanted to create subscriptions under the SignUpEngineering@contoso.com enrollment account, you'd copy ```747ddfe5-xxxx-xxxx-xxxx-xxxxxxxxxxxx```. This is the object ID of the enrollment account. Paste this value somewhere so that you can use it in the next step as `enrollmentAccountObjectId`.

## [PowerShell](#tab/azure-powershell)

Open [Azure Cloud Shell](https://shell.azure.com/) and select PowerShell.

Use the [Get-AzEnrollmentAccount](/powershell/module/az.billing/get-azenrollmentaccount) cmdlet to list all enrollment accounts you have access to.

```azurepowershell-interactive
Get-AzEnrollmentAccount
```

Azure responds with a list of enrollment accounts you have access to:

```azurepowershell
ObjectId                               | PrincipalName
747ddfe5-xxxx-xxxx-xxxx-xxxxxxxxxxxx   | SignUpEngineering@contoso.com
4cd2fcf6-xxxx-xxxx-xxxx-xxxxxxxxxxxx   | BillingPlatformTeam@contoso.com
```
Use the `principalName` property to identify the account that you want subscriptions to be billed to. Copy the `ObjectId` of that account. For example, if you wanted to create subscriptions under the SignUpEngineering@contoso.com enrollment account, you'd copy ```747ddfe5-xxxx-xxxx-xxxx-xxxxxxxxxxxx```. Paste this object ID somewhere so that you can use it in the next step as the `enrollmentAccountObjectId`.

## [Azure CLI](#tab/azure-cli)

Use the [az billing enrollment-account list](https://aka.ms/EASubCreationPublicPreviewCLI) command to list all enrollment accounts you have access to.

```azurecli-interactive 
az billing enrollment-account list
```

Azure responds with a list of enrollment accounts you have access to:

```json
[
  {
    "id": "/providers/Microsoft.Billing/enrollmentAccounts/747ddfe5-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "name": "747ddfe5-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "principalName": "SignUpEngineering@contoso.com",
    "type": "Microsoft.Billing/enrollmentAccounts",
  },
  {
    "id": "/providers/Microsoft.Billing/enrollmentAccounts/747ddfe5-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "name": "4cd2fcf6-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "principalName": "BillingPlatformTeam@contoso.com",
    "type": "Microsoft.Billing/enrollmentAccounts",
  }
]
```

Use the `principalName` property to identify the account that you want subscriptions to be billed to. Copy the `name` of that account. For example, if you wanted to create subscriptions under the SignUpEngineering@contoso.com enrollment account, you'd copy ```747ddfe5-xxxx-xxxx-xxxx-xxxxxxxxxxxx```. This is the object ID of the enrollment account. Paste this value somewhere so that you can use it in the next step as `enrollmentAccountObjectId`.

---

## Create subscriptions under a specific enrollment account

The following example creates a subscription named *Dev Team Subscription* in the enrollment account selected in the previous step. The subscription offer is *MS-AZR-0017P* (regular Microsoft Enterprise Agreement). It also optionally adds two users as RBAC Owners for the subscription.

# [REST](#tab/rest)

Make the following request, replacing `<enrollmentAccountObjectId>` with the `name` copied from the first step (```747ddfe5-xxxx-xxxx-xxxx-xxxxxxxxxxxx```). If you'd like to specify owners, learn [how to get user object IDs](grant-access-to-create-subscription.md#userObjectId).

```json
POST https://management.azure.com/providers/Microsoft.Billing/enrollmentAccounts/<enrollmentAccountObjectId>/providers/Microsoft.Subscription/createSubscription?api-version=2018-03-01-preview

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

First, install this preview module by running `Install-Module Az.Subscription -AllowPrerelease`. To make sure `-AllowPrerelease` works, install a recent version of PowerShellGet from [Get PowerShellGet Module](/powershell/gallery/installing-psget).

Run the [New-AzSubscription](/powershell/module/az.subscription) command below, replacing `<enrollmentAccountObjectId>` with the `ObjectId` collected in the first step (```747ddfe5-xxxx-xxxx-xxxx-xxxxxxxxxxxx```). If you'd like to specify owners, learn [how to get user object IDs](grant-access-to-create-subscription.md#userObjectId).

```azurepowershell-interactive
New-AzSubscription -OfferType MS-AZR-0017P -Name "Dev Team Subscription" -EnrollmentAccountObjectId <enrollmentAccountObjectId> -OwnerObjectId <userObjectId1>,<servicePrincipalObjectId>
```

| Element Name  | Required | Type   | Description                                                                                               |
|---------------|----------|--------|-----------------------------------------------------------------------------------------------------------|
| `Name` | No      | String | The display name of the subscription. If not specified, it's set to the name of the offer, like "Microsoft Azure Enterprise."                                 |
| `OfferType`   | Yes      | String | The offer of the subscription. The two options for EA are [MS-AZR-0017P](https://azure.microsoft.com/pricing/enterprise-agreement/) (production use) and [MS-AZR-0148P](https://azure.microsoft.com/offers/ms-azr-0148p/) (dev/test, needs to be [turned on using the EA portal](https://ea.azure.com/helpdocs/DevOrTestOffer)).                |
| `EnrollmentAccountObjectId`      | Yes       | String | The Object ID of the enrollment account that the subscription is created under and billed to. This value is a GUID that you get from `Get-AzEnrollmentAccount`. |
| `OwnerObjectId`      | No       | String | The Object ID of any user that you'd like to add as an RBAC Owner on the subscription when it's created.  |
| `OwnerSignInName`    | No       | String | The email address of any user that you'd like to add as an RBAC Owner on the subscription when it's created. You can use this parameter instead of `OwnerObjectId`.|
| `OwnerApplicationId` | No       | String | The application ID of any service principal that you'd like to add as an RBAC Owner on the subscription when it's created. You can use this parameter instead of `OwnerObjectId`. When using this parameter, the service principal must have [read access to the directory](/powershell/azure/active-directory/signing-in-service-principal?view=azureadps-2.0#give-the-service-principal-reader-access-to-the-current-tenant-get-azureaddirectoryrole).| 

To see a full list of all parameters, see [New-AzSubscription](/powershell/module/az.subscription.preview).

# [Azure CLI](#tab/azure-cli)

First, install this preview extension by running `az extension add --name subscription`.

Run the [az account create](/cli/azure/ext/subscription/account?view=azure-cli-latest#-ext-subscription-az-account-create) command below, replacing `<enrollmentAccountObjectId>` with the `name` you copied in the first step (```747ddfe5-xxxx-xxxx-xxxx-xxxxxxxxxxxx```). If you'd like to specify owners, learn [how to get user object IDs](grant-access-to-create-subscription.md#userObjectId).

```azurecli-interactive 
az account create --offer-type "MS-AZR-0017P" --display-name "Dev Team Subscription" --enrollment-account-object-id "<enrollmentAccountObjectId>" --owner-object-id "<userObjectId>","<servicePrincipalObjectId>"
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

---

## Limitations of Azure Enterprise subscription creation API

- Only Azure Enterprise subscriptions can be created using this API.
- There's an initial limit of 50 subscriptions per enrollment account, but you can [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) to increase the limit to 200. After that, subscriptions can only be created through the Account Center.
- There needs to be at least one EA or EA Dev/Test subscriptions under the account, which means the Account Owner has gone through manual sign-up at least once.
- Users who aren't Account Owners, but were added to an enrollment account via RBAC, can't create subscriptions using Account Center.
- You can't select the tenant for the subscription to be created in. The subscription is always created in the home tenant of the Account Owner. To move the subscription to a different tenant, see [change subscription tenant](../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md).

## Next steps

* For an example on creating subscriptions using .NET, see [sample code on GitHub](https://github.com/Azure-Samples/create-azure-subscription-dotnet-core).
* Now that you've created a subscription, you can grant that ability to other users and service principals. For more information, see [Grant access to create Azure Enterprise subscriptions (preview)](grant-access-to-create-subscription.md).
* To learn more about managing large numbers of subscriptions using management groups, see [Organize your resources with Azure management groups](management-groups-overview.md)
