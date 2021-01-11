---
title: Programmatically create Azure Enterprise Agreement subscriptions with the latest APIs
description: Learn how to create Azure Enterprise Agreement subscriptions programmatically using the latest versions of REST API, Azure CLI, and Azure PowerShell.
author: bandersmsft
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 11/17/2020
ms.reviewer: andalmia
ms.author: banders 
ms.custom: devx-track-azurepowershell, devx-track-azurecli
---

# Programmatically create Azure Enterprise Agreement subscriptions with the latest APIs

This article helps you programmatically create Azure Enterprise Agreement (EA) subscriptions for an EA billing account using the most recent API versions. If you are still using the older preview version, see [Programmatically create Azure subscriptions with preview APIs](programmatically-create-subscription-preview.md). 

In this article, you learn how to create subscriptions programmatically using Azure Resource Manager.

When you create an Azure subscription programmatically, that subscription is governed by the agreement under which you obtained Azure services from Microsoft or an authorized reseller. For more information, see [Microsoft Azure Legal Information](https://azure.microsoft.com/support/legal/).

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

## Prerequisites

You must have an Owner role on an Enrollment Account to create a subscription. There are two ways to get the role:

* The Enterprise Administrator of your enrollment can [make you an Account Owner](https://ea.azure.com/helpdocs/addNewAccount) (sign in required) which makes you an Owner of the Enrollment Account.
* An existing Owner of the Enrollment Account can [grant you access](grant-access-to-create-subscription.md). Similarly, to use a service principal to create an EA subscription, you must [grant that service principal the ability to create subscriptions](grant-access-to-create-subscription.md).

## Find accounts you have access to

After you're added to an Enrollment Account associated to an Account Owner, Azure uses the account-to-enrollment relationship to determine where to bill the subscription charges. All subscriptions created under the account are billed to the EA enrollment that the account is in. To create subscriptions, you must pass in values about the enrollment account and the user principals to own the subscription.

To run the following commands, you must be logged in to the Account Owner's *home directory*, which is the directory that subscriptions are created in by default.

### [REST](#tab/rest-getEnrollments)

Request to list all enrollment accounts you have access to:

```json
GET https://management.azure.com/providers/Microsoft.Billing/billingaccounts/?api-version=2020-05-01
```

The API response lists all enrollment accounts you have access to:

```json
{
  "value": [
    {
      "id": "/providers/Microsoft.Billing/billingAccounts/1234567",
      "name": "1234567",
      "properties": {
        "accountStatus": "Unknown",
        "accountType": "Enterprise",
        "agreementType": "EnterpriseAgreement",
        "soldTo": {
          "companyName": "Contoso",
          "country": "US "
        },
        "billingProfiles": {
          "hasMoreResults": false
        },
        "displayName": "Contoso",
        "enrollmentAccounts": [
          {
            "id": "/providers/Microsoft.Billing/billingAccounts/1234567/enrollmentAccounts/7654321",
            "name": "7654321",
            "type": "Microsoft.Billing/enrollmentAccounts",
            "properties": {
              "accountName": "Contoso",
              "accountOwnerEmail": "kenny@contoso.onmicrosoft.com",
              "costCenter": "Test",
              "isDevTest": false
            }
          }
        ],
        "hasReadAccess": false
      },
      "type": "Microsoft.Billing/billingAccounts"
    }
  ]
}

```

The value for a billing scope and `id` are the same thing. The `id` for your enrollment account is the billing scope under which the subscription request is initiated. It’s important to know the ID because it’s a required parameter that you use later in the article to create a subscription.

<!-- 
### [PowerShell](#tab/azure-powershell-getEnrollments)

we're still working on enabling PowerShell SDK for billing APIs. Check back soon.

-->


<!--
### [Azure CLI](#tab/azure-cli-getEnrollments)

we're still working on enabling CLI SDK for billing APIs. Check back soon.
-->

---

## Create subscriptions under a specific enrollment account

The following example creates a subscription named *Dev Team Subscription* in the enrollment account selected in the previous step. 

### [REST](#tab/rest-EA)

Call the PUT API to create a subscription creation request/alias.

```json
PUT  https://management.azure.com/providers/Microsoft.Subscription/aliases/sampleAlias?api-version=2020-09-01 
```

In the request body, provide as the `billingScope` the `id` from one of your `enrollmentAccounts`.

```json 
{
  "properties": {
	    "billingScope": "/providers/Microsoft.Billing/BillingAccounts/1234567/enrollmentAccounts/7654321",
	    "DisplayName": "Dev Team Subscription", //Subscription Display Name
	    "Workload": "Production"
  }
}
```

Allowed values for `Workload` are `Production` and `DevTest`.

#### Response

```json
{
  "id": "/providers/Microsoft.Subscription/aliases/sampleAlias",
  "name": "sampleAlias",
  "type": "Microsoft.Subscription/aliases",
  "properties": {
    "subscriptionId": "b5bab918-e8a9-4c34-a2e2-ebc1b75b9d74",
    "provisioningState": "Accepted"
  }
}
```

You can do a GET on the same URL to get the status of the request.

### Request

```json
GET https://management.azure.com/providers/Microsoft.Subscription/aliases/sampleAlias?api-version=2020-09-01
```

### Response

```json
{
  "id": "/providers/Microsoft.Subscription/aliases/sampleAlias",
  "name": "sampleAlias",
  "type": "Microsoft.Subscription/aliases",
  "properties": {
    "subscriptionId": "b5bab918-e8a9-4c34-a2e2-ebc1b75b9d74",
    "provisioningState": "Succeeded"
  }
}
```

An in-progress status is returned as an `Accepted` state under `provisioningState`.

### [PowerShell](#tab/azure-powershell-EA)

To install the latest version of the module that contains the `New-AzSubscriptionAlias` cmdlet, run `Install-Module Az.Subscription`. To install a recent version of PowerShellGet, see [Get PowerShellGet Module](/powershell/scripting/gallery/installing-psget).

Run the following [New-AzSubscriptionAlias](/powershell/module/az.subscription/new-azsubscription) command, using the billing scope `"/providers/Microsoft.Billing/BillingAccounts/1234567/enrollmentAccounts/7654321"`. 

```azurepowershell-interactive
New-AzSubscriptionAlias -AliasName "sampleAlias" -SubscriptionName "Dev Team Subscription" -BillingScope "/providers/Microsoft.Billing/BillingAccounts/1234567/enrollmentAccounts/7654321" -Workload 'Production"
```

You get the subscriptionId as part of the response from the command.

```azurepowershell
{
  "id": "/providers/Microsoft.Subscription/aliases/sampleAlias",
  "name": "sampleAlias",
  "type": "Microsoft.Subscription/aliases",
  "properties": {
    "provisioningState": "Succeeded",
    "subscriptionId": "4921139b-ef1e-4370-a331-dd2229f4f510"
  }
}
```

### [Azure CLI](#tab/azure-cli-EA)

First, install the extension by running `az extension add --name account` and `az extension add --name alias`.

Run the following [az account alias create](/cli/azure/ext/account/account/alias?view=azure-cli-latest#ext_account_az_account_alias_create&preserve-view=true) command and provide `billing-scope` and `id` from one of your `enrollmentAccounts`. 

```azurecli-interactive
az account alias create --name "sampleAlias" --billing-scope "/providers/Microsoft.Billing/billingAccounts/1234567/enrollmentAccounts/654321" --display-name "Dev Team Subscription" --workload "Production"
```

You get the subscriptionId as part of the response from the command.

```azurecli
{
  "id": "/providers/Microsoft.Subscription/aliases/sampleAlias",
  "name": "sampleAlias",
  "properties": {
    "provisioningState": "Succeeded",
    "subscriptionId": "4921139b-ef1e-4370-a331-dd2229f4f510"
  },
  "type": "Microsoft.Subscription/aliases"
}
```

---

## Limitations of Azure Enterprise subscription creation API

- Only Azure Enterprise subscriptions are created using the API.
- There's a limit of 2000 subscriptions per enrollment account. After that, more subscriptions for the account can only be created in the Azure portal. To create more subscriptions through the API, create another enrollment account. Canceled, deleted, and transferred subscriptions count toward the 2000 limit.
- Users who aren't Account Owners, but were added to an enrollment account via Azure RBAC, can't create subscriptions in the Azure portal.
- You can't select the tenant for the subscription to be created in. The subscription is always created in the home tenant of the Account Owner. To move the subscription to a different tenant, see [change subscription tenant](../../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md).


## Next steps

* Now that you've created a subscription, you can grant that ability to other users and service principals. For more information, see [Grant access to create Azure Enterprise subscriptions (preview)](grant-access-to-create-subscription.md).
* For more information about managing large numbers of subscriptions using management groups, see [Organize your resources with Azure management groups](../../governance/management-groups/overview.md).
