---
title: Programmatically create Azure subscriptions with the latest APIs
description: Learn how to create Azure subscriptions programmatically using the latest versions of REST API, Azure CLI, and Azure PowerShell.
author: bandersmsft
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 10/12/2020
ms.reviewer: andalmia
ms.author: banders 
ms.custom: devx-track-azurepowershell
---

# Programmatically create Azure subscriptions with the latest APIs

This article helps you programmatically create Azure subscriptions using the most recent API versions. If you are still using the older preview version, see [Programmatically create Azure subscriptions with preview APIs](programmatically-create-subscription-preview.md). 

Azure customers with a billing account for the following agreement types can create subscriptions programmatically:

- [Enterprise Agreement (EA)](https://azure.microsoft.com/pricing/enterprise-agreement/)
- [Microsoft Customer Agreement (MCA)](https://azure.microsoft.com/pricing/purchase-options/microsoft-customer-agreement/)
- [Microsoft Partner Agreement (MPA)](https://www.microsoft.com/licensing/news/introducing-microsoft-partner-agreement)

In this article, you learn how to create subscriptions programmatically using Azure Resource Manager.

When you create an Azure subscription programmatically, that subscription is governed by the agreement under which you obtained Azure services from Microsoft or an authorized reseller. For more information, see [Microsoft Azure Legal Information](https://azure.microsoft.com/support/legal/).

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

## Create subscriptions for an EA billing account

Use the information in the following sections to create EA subscriptions.

### Prerequisites

You must have an Owner role on an Enrollment Account to create a subscription. There are two ways to get the role:

* The Enterprise Administrator of your enrollment can [make you an Account Owner](https://ea.azure.com/helpdocs/addNewAccount) (sign in required) which makes you an Owner of the Enrollment Account.
* An existing Owner of the Enrollment Account can [grant you access](grant-access-to-create-subscription.md). Similarly, to use a service principal to create an EA subscription, you must [grant that service principal the ability to create subscriptions](grant-access-to-create-subscription.md).

### Find accounts you have access to

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

Note the `id` from one of your `enrollmentAccounts`. It's the billing scope under which a subscription creation request is initiated. 

<!-- 
### [PowerShell](#tab/azure-powershell-getEnrollments)

we're still working on enabling PowerShell SDK for billing APIs. Check back soon.

-->


<!--
### [Azure CLI](#tab/azure-cli-getEnrollments)

we're still working on enabling CLI SDK for billing APIs. Check back soon.
-->

---

### Create subscriptions under a specific enrollment account

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

### Limitations of Azure Enterprise subscription creation API

- Only Azure Enterprise subscriptions are created using the API.
- There's a limit of 2000 subscriptions per enrollment account. After that, more subscriptions for the account can only be created in the Azure portal. To create more subscriptions through the API, create another enrollment account.
- Users who aren't Account Owners, but were added to an enrollment account via Azure RBAC, can't create subscriptions in the Azure portal.
- You can't select the tenant for the subscription to be created in. The subscription is always created in the home tenant of the Account Owner. To move the subscription to a different tenant, see [change subscription tenant](../../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md).


## Create subscriptions for an MCA account

Use the information in the following sections to create MCA subscriptions.

### Prerequisites

You must have an owner, contributor, or Azure subscription creator role on an invoice section or owner or contributor role on a billing profile or a billing account to create subscriptions. For more information, see [Subscription billing roles and tasks](understand-mca-roles.md#subscription-billing-roles-and-tasks).

The following examples use REST APIs. Currently, PowerShell and Azure CLI aren't supported.

### Find billing accounts that you have access to

Make the following request to list all the billing accounts.

### [REST](#tab/rest-getBillingAccounts)

```json
GET https://management.azure.com/providers/Microsoft.Billing/billingaccounts/?api-version=2020-05-01

```
The API response lists the billing accounts that you have access to.

```json
{
  "value": [
    {
      "id": "/providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx",
      "name": "5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx",
      "properties": {
        "accountStatus": "Active",
        "accountType": "Enterprise",
        "agreementType": "MicrosoftCustomerAgreement",
        "billingProfiles": {
          "hasMoreResults": false
        },
        "displayName": "Contoso",
        "hasReadAccess": false
      },
      "type": "Microsoft.Billing/billingAccounts"
    }
  ]
}
```

Use the `displayName` property to identify the billing account for which you want to create subscriptions. Ensure, the agreementType of the account is *MicrosoftCustomerAgreement*. Copy the `name` of the account.  For example, to create a subscription for the `Contoso` billing account, copy `5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx`. Paste the value somewhere so that you can use it in the next step.

<!--
### [PowerShell](#tab/azure-powershell-getBillingAccounts)

we're still working on enabling PowerShell SDK for billing APIs. Check back soon.
-->

<!--
### [Azure CLI](#tab/azure-cli-getBillingAccounts)

we're still working on enabling CLI SDK for billing APIs. Check back soon.
-->

---

### Find billing profiles & invoice sections to create subscriptions

The charges for your subscription appear on a section of a billing profile's invoice. Use the following API to get the list of billing profiles and invoice sections on which you have permission to create Azure subscriptions.

First you get the list of billing profiles under the billing account that you have access to.

### [REST](#tab/rest-getBillingProfiles)
```json
GET https://management.azure.com/providers/Microsoft.Billing/billingaccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx/billingprofiles/?api-version=2020-05-01
```
The API response lists all the billing profiles on which you have access to create subscriptions:

```json
{
  "value": [
    {
      "id": "/providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx/billingProfiles/AW4F-xxxx-xxx-xxx",
      "name": "AW4F-xxxx-xxx-xxx",
      "properties": {
        "billingRelationshipType": "Direct",
        "billTo": {
          "addressLine1": "One Microsoft Way",
          "city": "Redmond",
          "companyName": "Contoso",
          "country": "US",
          "email": "kenny@contoso.com",
          "phoneNumber": "425xxxxxxx",
          "postalCode": "98052",
          "region": "WA"
        },
        "currency": "USD",
        "displayName": "Contoso Billing Profile",
        "enabledAzurePlans": [
          {
            "skuId": "0002",
            "skuDescription": "Microsoft Azure Plan for DevTest"
          },
          {
            "skuId": "0001",
            "skuDescription": "Microsoft Azure Plan"
          }
        ],
        "hasReadAccess": true,
        "invoiceDay": 5,
        "invoiceEmailOptIn": false,
        "invoiceSections": {
          "hasMoreResults": false
        },
        "poNumber": "001",
        "spendingLimit": "Off",
        "status": "Active",
        "systemId": "AW4F-xxxx-xxx-xxx",
        "targetClouds": []
      },
      "type": "Microsoft.Billing/billingAccounts/billingProfiles"
    }
  ]
}
```

 Copy the `id` to next identify the invoice sections underneath the billing profile. For example, copy `/providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx/billingProfiles/AW4F-xxxx-xxx-xxx` and call the following API.

```json
GET https://management.azure.com/providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx/billingProfiles/AW4F-xxxx-xxx-xxx/invoicesections?api-version=2020-05-01
```
### Response

```json
{
  "totalCount": 1,
  "value": [
    {
      "id": "/providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx/billingProfiles/AW4F-xxxx-xxx-xxx/invoiceSections/SH3V-xxxx-xxx-xxx",
      "name": "SH3V-xxxx-xxx-xxx",
      "properties": {
        "displayName": "Development",
        "state": "Active",
        "systemId": "SH3V-xxxx-xxx-xxx"
      },
      "type": "Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections"
    }
  ]
}
```

Use the `id` property to identify the invoice section for which you want to create subscriptions. Copy the entire string. For example, `/providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx/billingProfiles/AW4F-xxxx-xxx-xxx/invoiceSections/SH3V-xxxx-xxx-xxx`. 

<!--
### [PowerShell](#tab/azure-powershell-getBillingProfiles)

we're still working on enabling PowerShell SDK for billing APIs. Check back soon.
-->

<!--
### [Azure CLI](#tab/azure-cli-getBillingProfiles)

we're still working on enabling CLI SDK for billing APIs. Check back soon.
-->

---

### Create a subscription for an invoice section

The following example creates a subscription named *Dev Team subscription* for the *Development* invoice section. The subscription is billed to the *Contoso Billing Profile* billing profile and appears on the *Development* section of its invoice. You use the copied billing scope from the previous step: `/providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx/billingProfiles/AW4F-xxxx-xxx-xxx/invoiceSections/SH3V-xxxx-xxx-xxx`. 

### [REST](#tab/rest-MCA)

```json
PUT  https://management.azure.com/providers/Microsoft.Subscription/aliases/sampleAlias?api-version=2020-09-01
```

### Request body

```json
{
  "properties":
    {
	    "billingScope": "/providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx/billingProfiles/AW4F-xxxx-xxx-xxx/invoiceSections/SH3V-xxxx-xxx-xxx",
	    "DisplayName": "Dev Team subscription",
	    "Workload": "Production"
    }
}
```

### Response

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

### [PowerShell](#tab/azure-powershell-MCA)

To install the latest version of the module that contains the `New-AzSubscriptionAlias` cmdlet, run `Install-Module Az.Subscription`. To install a recent version of PowerShellGet, see [Get PowerShellGet Module](/powershell/scripting/gallery/installing-psget).

Run the following [New-AzSubscriptionAlias](/powershell/module/az.subscription/new-azsubscription) command and the billing scope `"/providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx/billingProfiles/AW4F-xxxx-xxx-xxx/invoiceSections/SH3V-xxxx-xxx-xxx"`. 

```azurepowershell-interactive
New-AzSubscriptionAlias -AliasName "sampleAlias" -SubscriptionName "Dev Team Subscription" -BillingScope "/providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx/billingProfiles/AW4F-xxxx-xxx-xxx/invoiceSections/SH3V-xxxx-xxx-xxx" -Workload 'Production"
```

You get the subscriptionId as part of the response from the command.

```azurepowershell
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

### [Azure CLI](#tab/azure-cli-MCA)

First, install the extension by running `az extension add --name account` and `az extension add --name alias`.

Run the [az account alias create](/cli/azure/ext/account/account/alias?view=azure-cli-latest#ext_account_az_account_alias_create&preserve-view=true) following command.

```azurecli-interactive
az account alias create --name "sampleAlias" --billing-scope "/providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx/billingProfiles/AW4F-xxxx-xxx-xxx/invoiceSections/SH3V-xxxx-xxx-xxx" --display-name "Dev Team Subscription" --workload "Production"
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

## Create subscriptions for an MPA billing account

Use the information in the following sections to create MPA subscriptions.

### Prerequisites

You must have a Global Admin or  Admin Agent role in your organization's cloud solution provider account to create subscription for your billing account. For more information, see [Partner Center - Assign users roles and permissions](/partner-center/permissions-overview).

The following examples use REST APIs. Currently, PowerShell and Azure CLI aren't supported.

### Find the billing accounts that you have access to

Make the following request to list all billing accounts that you have access to.

### [REST](#tab/rest-getBillingAccount-MPA)

```json
GET https://management.azure.com/providers/Microsoft.Billing/billingaccounts/?api-version=2020-05-01
```

The API response lists the billing accounts.

```json
{
  "value": [
    {
      "id": "/providers/Microsoft.Billing/billingAccounts/99a13315-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx",
      "name": "99a13315-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx",
      "properties": {
        "accountStatus": "Active",
        "accountType": "Partner",
        "agreementType": "MicrosoftPartnerAgreement",
        "billingProfiles": {
          "hasMoreResults": false
        },
        "displayName": "Contoso",
        "hasReadAccess": true
      },
      "type": "Microsoft.Billing/billingAccounts"
    }
  ]
}
```

Use the `displayName` property to identify the billing account for which you want to create subscriptions. Ensure, the agreementType of the account is *MicrosoftPartnerAgreement*. Copy the `name` for the account. For example, to create a subscription for the `Contoso` billing account, copy `99a13315-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx`. Paste the value somewhere so that you can use it in the next step.

<!--
### [PowerShell](#tab/azure-powershell-getBillingAccounts-MPA)

we're still working on enabling PowerShell SDK for billing APIs. Check back soon.
-->

<!--
### [Azure CLI](#tab/azure-cli-getBillingAccounts-MPA)

we're still working on enabling CLI SDK for billing APIs. Check back soon.
-->

---

### Find customers that have Azure plans

Make the following request, with the `name` copied from the first step (```99a13315-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx```) to list all customers in the billing account for whom you can create Azure subscriptions.

### [REST](#tab/rest-getCustomers)

```json
GET https://management.azure.com/providers/Microsoft.Billing/billingAccounts/99a13315-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx/customers?api-version=2020-05-01
```

The API response lists the customers in the billing account with Azure plans. You can create subscriptions for these customers.

```json
{
  "totalCount": 2,
  "value": [
    {
      "id": "/providers/Microsoft.Billing/billingAccounts/99a13315-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx/customers/7d15644f-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "name": "7d15644f-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "properties": {
        "billingProfileDisplayName": "Fabrikam toys Billing Profile",
        "billingProfileId": "/providers/Microsoft.Billing/billingAccounts/99a13315-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx/billingProfiles/YL4M-xxxx-xxx-xxx",
        "displayName": "Fabrikam toys"
      },
      "type": "Microsoft.Billing/billingAccounts/customers"
    },
    {
      "id": "/providers/Microsoft.Billing/billingAccounts/99a13315-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx/customers/acba85c9-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "name": "acba85c9-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "properties": {
        "billingProfileDisplayName": "Contoso toys Billing Profile",
        "billingProfileId": "/providers/Microsoft.Billing/billingAccounts/99a13315-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx/billingProfiles/YL4M-xxxx-xxx-xxx",
        "displayName": "Contoso toys"
      },
      "type": "Microsoft.Billing/billingAccounts/customers"
    }
  ]
}

```

Use the `displayName` property to identify the customer for which you want to create subscriptions. Copy the `id` for the customer. For example, to create a subscription for `Fabrikam toys`, copy `/providers/Microsoft.Billing/billingAccounts/99a13315-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx/customers/7d15644f-xxxx-xxxx-xxxx-xxxxxxxxxxxx`. Paste the value somewhere to use it in later steps.

<!--
### [PowerShell](#tab/azure-powershell-getCustomers)

we're still working on enabling PowerShell SDK for billing APIs. Check back soon.
-->

<!--
### [Azure CLI](#tab/azure-cli-getCustomers)

we're still working on enabling CLI SDK for billing APIs. Check back soon.
-->

---

### Optional for Indirect providers: Get the resellers for a customer

If you're an Indirect provider in the CSP two-tier model, you can specify a reseller while creating subscriptions for customers.

Make the following request, with the `id` copied from the second step (```/providers/Microsoft.Billing/billingAccounts/99a13315-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx/customers/2281f543-xxxx-xxxx-xxxx-xxxxxxxxxxxx```) to list all resellers that are available for a customer.

### [REST](#tab/rest-getIndirectResellers)

```json
GET "https://management.azure.com/providers/Microsoft.Billing/billingAccounts/99a13315-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx/customers/2281f543-xxxx-xxxx-xxxx-xxxxxxxxxxxx?$expand=resellers&api-version=2020-05-01"
```
The API response lists the resellers for the customer:

```json
{
  "value": [{
  "id": "/providers/Microsoft.Billing/billingAccounts/99a13315-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx/customers/2ed2c490-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "name": "2ed2c490-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "type": "Microsoft.Billing/billingAccounts/customers",
  "properties": {
    "billingProfileDisplayName": "Fabrikam toys Billing Profile",
    "billingProfileId": "/providers/Microsoft.Billing/billingAccounts/99a13315-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx/billingProfiles/YL4M-xxxx-xxx-xxx",
    "displayName": "Fabrikam toys",
    "resellers": [
      {
        "resellerId": "3xxxxx",
        "description": "Wingtip"
      }
    ]
  }
}]
}
```

Use the `description` property to identify the reseller who is associated with the subscription. Copy the `resellerId` for the reseller. For example, to associate `Wingtip`, copy `3xxxxx`. Paste the value somewhere so that you can use it in the next step.

<!--
### [PowerShell](#tab/azure-powershell-getIndirectResellers)

we're still working on enabling PowerShell SDK for billing APIs. Check back soon.
-->

<!--
### [Azure CLI](#tab/azure-cli-getIndirectResellers)

we're still working on enabling CLI SDK for billing APIs. Check back soon.
-->

---

### Create a subscription for a customer

The following example creates a subscription named *Dev Team subscription*  for *Fabrikam toys* and associate *Wingtip* reseller to the subscription. You use the copied billing scope from previous step: `/providers/Microsoft.Billing/billingAccounts/99a13315-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx/customers/2281f543-xxxx-xxxx-xxxx-xxxxxxxxxxxx`. 

### [REST](#tab/rest-MPA)

```json
PUT  https://management.azure.com/providers/Microsoft.Subscription/aliases/sampleAlias?api-version=2020-09-01
```

### Request body

```json
{
  "properties":
    {
	    "billingScope": "/providers/Microsoft.Billing/billingAccounts/99a13315-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx/customers/2281f543-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
	    "DisplayName": "Dev Team subscription",
	    "Workload": "Production"
    }
}
```
### Response

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

Pass the optional *resellerId* copied from the second step in the request body of the API.

### [PowerShell](#tab/azure-powershell-MPA)

To install the latest version of the module that contains the `New-AzSubscriptionAlias` cmdlet, run `Install-Module Az.Subscription`. To install a recent version of PowerShellGet, see [Get PowerShellGet Module](/powershell/scripting/gallery/installing-psget).

Run the following [New-AzSubscriptionAlias](/powershell/module/az.subscription/new-azsubscription) command, using the billing scope `"/providers/Microsoft.Billing/billingAccounts/99a13315-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx/customers/2281f543-xxxx-xxxx-xxxx-xxxxxxxxxxxx"`. 

```azurepowershell-interactive
New-AzSubscriptionAlias -AliasName "sampleAlias" -SubscriptionName "Dev Team Subscription" -BillingScope "/providers/Microsoft.Billing/billingAccounts/99a13315-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx/customers/2281f543-xxxx-xxxx-xxxx-xxxxxxxxxxxx" -Workload 'Production"
```

You get the subscriptionId as part of the response from the command.

```azurepowershell
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

Pass the optional *resellerId* copied from the second step in the `New-AzSubscriptionAlias` call.

### [Azure CLI](#tab/azure-cli-MPA)

First, install the extension by running `az extension add --name account` and `az extension add --name alias`.

Run the following [az account alias create](/cli/azure/ext/account/account/alias?view=azure-cli-latest#ext_account_az_account_alias_create&preserve-view=true) command. 

```azurecli-interactive
az account alias create --name "sampleAlias" --billing-scope "/providers/Microsoft.Billing/billingAccounts/99a13315-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx/customers/2281f543-xxxx-xxxx-xxxx-xxxxxxxxxxxx" --display-name "Dev Team Subscription" --workload "Production"
```

You get the subscriptionId as part of the response from command.

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

Pass the optional *resellerId* copied from the second step in the `az account alias create` call.

---

## Create subscriptions using ARM templates

You can create subscriptions on your Azure Resource Manager template (ARM template), allowing you to automate your production/test deployment processes. In the following example, you use an ARM template to create an Azure subscription and an Azure resource group.

### Prerequisites

You must have an owner, contributor, or Azure subscription creator role on an invoice section or owner or contributor role on a billing profile or a billing account to create subscriptions. For more information, see [Subscription billing roles and tasks](understand-mca-roles.md#subscription-billing-roles-and-tasks).

Additionally, since you are doing an ARM template deployment, you need to have write permissions on the root object. So if you're creating the ARM deployment under a management group, you need to have write permissions on the management group. Note that the action is purely to create an ARM deployment, if a subscription is created, it is created only in the management group specified in the ARM template.

The following examples use REST APIs. Currently, PowerShell and Azure CLI aren't supported.

### Find billing accounts that you have access to

Make the following request to list all the billing accounts.

### [REST](#tab/rest-getBillingAccounts)

```json
GET https://management.azure.com/providers/Microsoft.Billing/billingaccounts/?api-version=2020-05-01
```

The API response lists the billing accounts that you have access to.

```json
{
  "value": [
    {
      "id": "/providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx",
      "name": "5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx",
      "properties": {
        "accountStatus": "Active",
        "accountType": "Enterprise",
        "agreementType": "MicrosoftCustomerAgreement",
        "billingProfiles": {
          "hasMoreResults": false
        },
        "displayName": "Contoso",
        "hasReadAccess": false
      },
      "type": "Microsoft.Billing/billingAccounts"
    }
  ]
}
```

Use the `displayName` property to identify the billing account for which you want to create subscriptions. Ensure, the agreementType of the account is *MicrosoftCustomerAgreement*. Copy the `name` of the account. For example, to create a subscription for the `Contoso` billing account, copy `5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx`. Paste the value somewhere so that you can use it in the next step.

<!--
### [PowerShell](#tab/azure-powershell-getBillingAccounts)

we're still working on enabling PowerShell SDK for billing APIs. Check back soon.
-->

<!--
### [Azure CLI](#tab/azure-cli-getBillingAccounts)

we're still working on enabling CLI SDK for billing APIs. Check back soon.
-->

---

### Find billing profiles & invoice sections to create subscriptions

The charges for your subscription appear on a section of a billing profile's invoice. Use the following API to get the list of billing profiles and invoice sections on which you have permission to create Azure subscriptions.

First you get the list of billing profiles under the billing account that you have access to.

### [REST](#tab/rest-getBillingProfiles)

```json
GET https://management.azure.com/providers/Microsoft.Billing/billingaccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx/billingprofiles/?api-version=2020-05-01
```

The API response lists all the billing profiles on which you have access to create subscriptions:

```json
{
  "value": [
    {
      "id": "/providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx/billingProfiles/AW4F-xxxx-xxx-xxx",
      "name": "AW4F-xxxx-xxx-xxx",
      "properties": {
        "billingRelationshipType": "Direct",
        "billTo": {
          "addressLine1": "One Microsoft Way",
          "city": "Redmond",
          "companyName": "Contoso",
          "country": "US",
          "email": "kenny@contoso.com",
          "phoneNumber": "425xxxxxxx",
          "postalCode": "98052",
          "region": "WA"
        },
        "currency": "USD",
        "displayName": "Contoso Billing Profile",
        "enabledAzurePlans": [
          {
            "skuId": "0002",
            "skuDescription": "Microsoft Azure Plan for DevTest"
          },
          {
            "skuId": "0001",
            "skuDescription": "Microsoft Azure Plan"
          }
        ],
        "hasReadAccess": true,
        "invoiceDay": 5,
        "invoiceEmailOptIn": false,
        "invoiceSections": {
          "hasMoreResults": false
        },
        "poNumber": "001",
        "spendingLimit": "Off",
        "status": "Active",
        "systemId": "AW4F-xxxx-xxx-xxx",
        "targetClouds": []
      },
      "type": "Microsoft.Billing/billingAccounts/billingProfiles"
    }
  ]
}
```

 Copy the `id` to next identify the invoice sections underneath the billing profile. For example, copy `/providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx/billingProfiles/AW4F-xxxx-xxx-xxx` and call the following API.

```json
GET https://management.azure.com/providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx/billingProfiles/AW4F-xxxx-xxx-xxx/invoicesections?api-version=2020-05-01
```

### Response

```json
{
  "totalCount": 1,
  "value": [
    {
      "id": "/providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx/billingProfiles/AW4F-xxxx-xxx-xxx/invoiceSections/SH3V-xxxx-xxx-xxx",
      "name": "SH3V-xxxx-xxx-xxx",
      "properties": {
        "displayName": "Development",
        "state": "Active",
        "systemId": "SH3V-xxxx-xxx-xxx"
      },
      "type": "Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections"
    }
  ]
}
```

Use the `id` property to identify the invoice section for which you want to create subscriptions. Copy the entire string. For example, `/providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx/billingProfiles/AW4F-xxxx-xxx-xxx/invoiceSections/SH3V-xxxx-xxx-xxx`. 

<!--
### [PowerShell](#tab/azure-powershell-getBillingProfiles)

we're still working on enabling PowerShell SDK for billing APIs. Check back soon.

### [Azure CLI](#tab/azure-cli-getBillingProfiles)

we're still working on enabling CLI SDK for billing APIs. Check back soon.
-->

---

### Create a subscription and resource group with a template

The following ARM template creates a subscription named *Dev Team subscription* for the *Development* invoice section. The subscription is billed to the *Contoso Billing Profile* billing profile and appear on the *Development* section of its invoice. You use the copied billing scope from previous step: `/providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx/billingProfiles/AW4F-xxxx-xxx-xxx/invoiceSections/SH3V-xxxx-xxx-xxx`. 

#### Request

```rest
PUT https://management.azure.com/providers/Microsoft.Resources/deployments/sampleTemplate?api-version=2019-10-01
```

#### Request Body

```json
{
  "properties":
    {
	    "location": "westus",
	    "properties": {
		    "template": {
			    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
			    "contentVersion": "1.0.0.0",
			    "parameters": {},
			    "variables": {
				    "uniqueAliasName": "sampleAlias"
			    },
			    "resources": [
				    {
					    "type": "Microsoft.Resources/deployments",
					    "apiVersion": "2019-10-01",
					    "name": "sampleTemplate",
					    "location": "westus",
					    "properties": {
						    "expressionEvaluationOptions": {
							    "scope": "inner"
						    },
						    "mode": "Incremental",
						    "template": {
							      "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
							    "contentVersion": "1.0.0.0",
							    "variables": {
								    "uniqueAliasName": "sampleAlias"
							    },
							    "resources": [
								    {
									    "name": "[variables('uniqueAliasName')]",
									    "type": "Microsoft.Subscription/aliases",
									    "apiVersion": "2020-09-01",
									    "properties": {
										    "workLoad": "Production",
										    "displayName": "Dev Team subscription",
										    "billingScope": "/providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx/billingProfiles/AW4F-xxxx-xxx-xxx/invoiceSections/SH3V-xxxx-xxx-xxx"
									    },
									    "dependsOn": [],
									    "tags": {}
								    }
							    ],
							    "outputs": {
								    "subscriptionId": {
									    "type": "string",
									    "value": "[replace(reference(variables('uniqueAliasName')).subscriptionId, 'invalidrandom/', '')]"
								    }
							    }
						    }
					    }
				    },
				    {
					    "name": "sampleOuterResource",
					    "type": "Microsoft.Resources/deployments",
					    "apiVersion": "2019-10-01",
					    "location": "westus",
					    "properties": {
						    "expressionEvaluationOptions": {
							    "scope": "inner"
						    },
						    "mode": "Incremental",
						    "parameters": {
							    "subscriptionId": {
								    "value": "[reference('sampleTemplate').outputs.subscriptionId.value]"
							    }
						    },
						    "template": {
							    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
							"contentVersion": "1.0.0.0",
							    "parameters": {
								    "subscriptionId": {
									    "type": "string"
								    }
							    },
							    "variables": {},
							    "resources": [
								    {
									    "name": "sampleInnerResource",
									    "type": "Microsoft.Resources/deployments",
									    "subscriptionId": "[parameters('subscriptionId')]",
									    "apiVersion": "2019-10-01",
									    "location": "westus",
									    "properties": {
										    "expressionEvaluationOptions": {
											    "scope": "inner"
										    },
										    "mode": "Incremental",
										    "parameters": {},
										    "template": {
											    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
											    "contentVersion": "1.0.0.0",
											    "parameters": {},
											    "variables": {},
											    "resources": [
												    {
													    "type": "Microsoft.Resources/resourceGroups",
													    "apiVersion": "2020-05-01",
													    "location": "[deployment().location]",
													    "name": "sampleRG",
													    "properties": {},
													    "tags": {}
												    }
											    ],
											    "outputs": {}
										    }
									    }
								    }
							    ],
							    "outputs": {}
						    }
					    }
				    }
			    ],
			    "outputs": {
				    "messageFromLinkedTemplate": {
					    "type": "string",
					    "value": "[reference('sampleTemplate').outputs.subscriptionId.value]"
				    }
			    }
		    },
		    "mode": "Incremental"
	    }
    }
}
```

#### Response

```json
{
  "id": "/providers/Microsoft.Resources/deployments/sampleTemplate",
  "name": "sampleTemplate",
  "type": "Microsoft.Resources/deployments",
  "location": "westus",
  "properties": {
    "templateHash": "16005880870587497948",
    "parameters": {},
    "mode": "Incremental",
    "provisioningState": "Accepted",
    "timestamp": "2020-10-07T19:06:34.110811Z",
    "duration": "PT0.1345459S",
    "correlationId": "2b57ddf6-7e27-42cb-90b4-90eeccd11a28",
    "providers": [
      {
        "namespace": "Microsoft.Resources",
        "resourceTypes": [
          {
            "resourceType": "deployments",
            "locations": [
              "westus"
            ]
          }
        ]
      }
    ],
    "dependencies": [
      {
        "dependsOn": [
          {
            "id": "/providers/Microsoft.Resources/deployments/sampleTemplate",
            "resourceType": "Microsoft.Resources/deployments",
            "resourceName": "anuragTemplate1"
          }
        ],
        "id": "/providers/Microsoft.Resources/deployments/sampleOuterResource",
        "resourceType": "Microsoft.Resources/deployments",
        "resourceName": "sampleOuterResource"
      }
    ]
  }
}
```

You can GET the status of the deployment to monitor progress.

```json
GET https://management.azure.com/providers/Microsoft.Resources/deployments/sampleTemplate?api-version=2019-10-01
```

#### Response

```json
{
  "id": "/providers/Microsoft.Resources/deployments/sampleDeployment5",
  "name": "sampleDeployment5",
  "type": "Microsoft.Resources/deployments",
  "location": "westus",
  "properties": {
    "templateHash": "16005880870587497948",
    "parameters": {},
    "mode": "Incremental",
    "provisioningState": "Succeeded",
    "timestamp": "2020-10-07T19:07:20.8007311Z",
    "duration": "PT46.824466S",
    "correlationId": "2b57ddf6-7e27-42cb-90b4-90eeccd11a28",
    "providers": [
      {
        "namespace": "Microsoft.Resources",
        "resourceTypes": [
          {
            "resourceType": "deployments",
            "locations": [
              "westus"
            ]
          }
        ]
      }
    ],
    "dependencies": [
      {
        "dependsOn": [
          {
            "id": "/providers/Microsoft.Resources/deployments/sampleTemplate",
            "resourceType": "Microsoft.Resources/deployments",
            "resourceName": "sampleTemplate"
          }
        ],
        "id": "/providers/Microsoft.Resources/deployments/sampleOuterResource",
        "resourceType": "Microsoft.Resources/deployments",
        "resourceName": "sampleOuterResource"
      }
    ],
    "outputs": {
      "messageFromLinkedTemplate": {
        "type": "String",
        "value": "16edf959-11fd-48bb-9a46-85190963ead9"
      }
    },
    "outputResources": [
      {
        "id": "/providers/Microsoft.Subscription/aliases/sampleAlias"
      },
      {
        "id": "/subscriptions/16edf959-11fd-48bb-9a46-85190963ead9/resourceGroups/sampleRG"
      }
    ]
  }
}
```

In the preceding example, you can see the subscription created was `16edf959-11fd-48bb-9a46-85190963ead9` and RG created was `sampleRG`.

## Next steps

* Now that you've created a subscription, you can grant that ability to other users and service principals. For more information, see [Grant access to create Azure Enterprise subscriptions (preview)](grant-access-to-create-subscription.md).
* For more information about managing large numbers of subscriptions using management groups, see [Organize your resources with Azure management groups](../../governance/management-groups/overview.md).
