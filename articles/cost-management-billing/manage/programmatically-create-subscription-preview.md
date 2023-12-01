---
title: Programmatically create Azure subscriptions with legacy APIs
description: Learn how to create additional Azure subscriptions programmatically using legacy versions of REST API, Azure CLI, and Azure PowerShell.
author: bandersmsft
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 05/17/2023
ms.reviewer: sgautam
ms.author: banders
ms.custom: devx-track-azurepowershell, devx-track-azurecli
---

# Programmatically create Azure subscriptions with legacy APIs

This article helps you programmatically create Azure subscriptions using our legacy preview API. In this article, you learn how to create subscriptions programmatically using Azure Resource Manager.

We have new articles for the latest API version for use with different Azure agreement subscription types:

- [Create EA subscriptions programmatically with latest API](programmatically-create-subscription-enterprise-agreement.md)
- [Create MCA subscriptions programmatically with latest API](programmatically-create-subscription-microsoft-customer-agreement.md)
- [Create MPA subscriptions programmatically with latest API](Programmatically-create-subscription-microsoft-customer-agreement.md)

However, you can still use the information in this article if you don't want to use the latest API version.

Azure customers with a billing account for the following agreement types can create subscriptions programmatically:

- Enterprise Agreement
- Microsoft Customer Agreement (MCA)
- Microsoft Partner Agreement (MPA)

When you create an Azure subscription programmatically, the subscription is governed by the agreement under which you obtained Azure services from Microsoft or an authorized reseller. For more information, see [Microsoft Azure Legal Information](https://azure.microsoft.com/support/legal/).

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

You can't create support plans programmatically. You can buy a new support plan or upgrade one in the Azure portal. Navigate to **Help + support** and then at the top of the page, select **Choose the right support plan**.

## Create subscriptions for an EA billing account

Use the information in the following sections to create EA subscriptions.

### Prerequisites

You must have an Owner role on an Enrollment Account to create a subscription. There are two ways to get the role:

* The Enterprise Administrator of your enrollment can [make you an Account Owner](https://ea.azure.com/helpdocs/addNewAccount) and sign in required which makes you an Owner of the Enrollment Account.
* An existing Owner of the Enrollment Account can [grant you access](grant-access-to-create-subscription.md). Similarly, to use a service principal to create an EA subscription, you must [grant that service principal the ability to create subscriptions](grant-access-to-create-subscription.md).

### Find accounts you have access to

After you're added to an Enrollment Account associated to an Account Owner, Azure uses the account-to-enrollment relationship to determine where to bill the subscription charges. All subscriptions created under the account are billed to the EA enrollment that the account is in. To create subscriptions, you must pass in values about the enrollment account and the user principals to own the subscription.

To run the following commands, you must be signed in to the Account Owner's *home directory*, which is the directory that subscriptions are created in by default.

### [REST](#tab/rest)

Request to list all enrollment accounts that you have access to:

```json
GET https://management.azure.com/providers/Microsoft.Billing/enrollmentAccounts?api-version=2018-03-01-preview
```

The API response lists all enrollment accounts you have access to:

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

Use the `principalName` property to identify the account that you want subscriptions to be billed to. Copy the `name` of that account. For example, create subscriptions under the SignUpEngineering@contoso.com enrollment account, copy ```747ddfe5-xxxx-xxxx-xxxx-xxxxxxxxxxxx```. The identifier is the object ID of the enrollment account. Paste the value somewhere so that you can use it in the next step as `enrollmentAccountObjectId`.

### [PowerShell](#tab/azure-powershell)

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
Use the `principalName` property to identify the account that you want subscriptions to be billed to. Copy the `ObjectId` of that account. For example, to create subscriptions under the SignUpEngineering@contoso.com enrollment account, copy ```747ddfe5-xxxx-xxxx-xxxx-xxxxxxxxxxxx```. Paste the object ID somewhere so that you can use it in the next step as the `enrollmentAccountObjectId`.

### [Azure CLI](#tab/azure-cli)

Use the [az billing enrollment-account list](/cli/azure/billing) command to list all enrollment accounts you have access to.

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

Use the `principalName` property to identify the account that you want subscriptions to be billed to. Copy the `name` of that account. For example, to create subscriptions under the SignUpEngineering@contoso.com enrollment account, copy ```747ddfe5-xxxx-xxxx-xxxx-xxxxxxxxxxxx```. The identifier is the object ID of the enrollment account. Paste the value somewhere so that you can use it in the next step as `enrollmentAccountObjectId`.

---

### Create subscriptions under a specific enrollment account

The following example creates a subscription named *Dev Team Subscription* in the enrollment account selected in the previous step. The subscription offer is *MS-AZR-0017P* (regular Microsoft Enterprise Agreement). It also optionally adds two users as Azure RBAC Owners for the subscription.

### [REST](#tab/rest)

Make the following request, replacing `<enrollmentAccountObjectId>` with the `name` copied from the first step (```747ddfe5-xxxx-xxxx-xxxx-xxxxxxxxxxxx```). To specify owners, see [how to get user object IDs](grant-access-to-create-subscription.md#userObjectId).

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
| `owners`      | No       | String | The Object ID of any user to be added as an Azure RBAC Owner on the subscription when it's created.  |

In the response, as part of the header `Location`, you get back a url that you can query for status on the subscription creation operation. When the subscription creation is finished, a GET on `Location` url will return a `subscriptionLink` object, which has the subscription ID. For more details, refer [Subscription API documentation](/rest/api/subscription/)

### [PowerShell](#tab/azure-powershell)

To install the version of the module that contains the `New-AzSubscriptionAlias` cmdlet, in below example run `Install-Module Az.Subscription -RequiredVersion 0.9.0`. To install version 0.9.0 of PowerShellGet, see [Get PowerShellGet Module](/powershell/gallery/powershellget/install-powershellget).

Run the [New-AzSubscription](/powershell/module/az.subscription) command below, replacing `<enrollmentAccountObjectId>` with the `ObjectId` collected in the first step (```747ddfe5-xxxx-xxxx-xxxx-xxxxxxxxxxxx```). To specify owners, see [how to get user object IDs](grant-access-to-create-subscription.md#userObjectId).

```azurepowershell-interactive
New-AzSubscription -OfferType MS-AZR-0017P -Name "Dev Team Subscription" -EnrollmentAccountObjectId <enrollmentAccountObjectId> -OwnerObjectId <userObjectId1>,<servicePrincipalObjectId>
```

| Element Name  | Required | Type   | Description |
|---------------|----------|--------|----|
| `Name` | No      | String | The display name of the subscription. If not specified, it's set to the name of the offer, like *Microsoft Azure Enterprise*. |
| `OfferType`   | Yes      | String | The subscription offer. The two options for EA are [MS-AZR-0017P](https://azure.microsoft.com/pricing/enterprise-agreement/) (production use) and [MS-AZR-0148P](https://azure.microsoft.com/offers/ms-azr-0148p/) (dev/test, needs to be [turned on using the EA portal](https://ea.azure.com/helpdocs/DevOrTestOffer)).                |
| `EnrollmentAccountObjectId`      | Yes       | String | The Object ID of the enrollment account that the subscription is created under and billed to. The value is a GUID that you get from `Get-AzEnrollmentAccount`. |
| `OwnerObjectId`      | No       | String | The Object ID of any user to add as an Azure RBAC Owner on the subscription when it's created.  |
| `OwnerSignInName`    | No       | String | The email address of any user to add as an Azure RBAC Owner on the subscription when it's created. You can use the parameter instead of `OwnerObjectId`.|
| `OwnerApplicationId` | No       | String | The application ID of any service principal to add as an Azure RBAC Owner on the subscription when it's created. You can use the parameter instead of `OwnerObjectId`. When using the parameter, the service principal must have [read access to the directory](/powershell/module/microsoft.graph.identity.directorymanagement/get-mgdirectoryrole).|


### [Azure CLI](#tab/azure-cli)

First, install the preview extension by running `az extension add --name subscription`.

Run the [az account create](/cli/azure/account#-ext-subscription-az-account-create) command below, replacing `<enrollmentAccountObjectId>` with the `name` you copied in the first step (```747ddfe5-xxxx-xxxx-xxxx-xxxxxxxxxxxx```). To specify owners, see [how to get user object IDs](grant-access-to-create-subscription.md#userObjectId).

```azurecli-interactive
az account create --offer-type "MS-AZR-0017P" --display-name "Dev Team Subscription" --enrollment-account-object-id "<enrollmentAccountObjectId>" --owner-object-id "<userObjectId>","<servicePrincipalObjectId>"
```

| Element Name  | Required | Type   | Description |
|---------------|----------|--------|------------|
| `display-name` | No      | String | The display name of the subscription. If not specified, it's set to the name of the offer, like *Microsoft Azure Enterprise*.|
| `offer-type`   | Yes      | String | The offer of the subscription. The two options for EA are [MS-AZR-0017P](https://azure.microsoft.com/pricing/enterprise-agreement/) (production use) and [MS-AZR-0148P](https://azure.microsoft.com/offers/ms-azr-0148p/) (dev/test, needs to be [turned on using the EA portal](https://ea.azure.com/helpdocs/DevOrTestOffer)).                |
| `enrollment-account-object-id`      | Yes       | String | The Object ID of the enrollment account that the subscription is created under and billed to. The value is a GUID that you get from `az billing enrollment-account list`. |
| `owner-object-id`      | No       | String | The Object ID of any user to add as an Azure RBAC Owner on the subscription when it's created.  |
| `owner-upn`    | No       | String | The email address of any user to add as an Azure RBAC Owner on the subscription when it's created. You can use the parameter instead of `owner-object-id`.|
| `owner-spn` | No       | String | The application ID of any service principal to add as an Azure RBAC Owner on the subscription when it's created. You can use the parameter instead of `owner-object-id`. When using the parameter, the service principal must have [read access to the directory](/powershell/module/microsoft.graph.identity.directorymanagement/get-mgdirectoryrole).|

To see a full list of all parameters, see [az account create](/cli/azure/account#-ext-subscription-az-account-create).

---

### Limitations of Azure Enterprise subscription creation API

- Only Azure Enterprise subscriptions can be created using the API.
- There's a limit of 5000 subscriptions per enrollment account. After that, more subscriptions for the account can only be created in the Azure portal. If you want to create more subscriptions through the API, create another enrollment account. Canceled, deleted, and transferred subscriptions count toward the 5000 limit.
- Users who aren't Account Owners, but were added to an enrollment account with Azure RBAC, can't create subscriptions in the Azure portal.
- You can't select the tenant for the subscription to be created in. The subscription is always created in the home tenant of the Account Owner. To move the subscription to a different tenant, see [change subscription tenant](../../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md).


## Create subscriptions for an MCA account

Use the information in the following sections to create subscriptions for an MCA account.

### Prerequisites

You must have an owner, contributor, or Azure subscription creator role on an invoice section or owner or contributor role on a billing profile or a billing account to create subscriptions. For more information, see [Subscription billing roles and tasks](understand-mca-roles.md#subscription-billing-roles-and-tasks).

The following examples use REST APIs. Currently, PowerShell and Azure CLI aren't supported.

### Find billing accounts that you have access to

Make the following request to list all the billing accounts.

```json
GET https://management.azure.com/providers/Microsoft.Billing/billingAccounts?api-version=2019-10-01-preview
```
The API response lists the billing accounts that you have access to.

```json
{
  "value": [
    {
      "id": "/providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx",
      "name": "5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx",
      "properties": {
        "accountId": "5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "accountStatus": "Active",
        "accountType": "Enterprise",
        "agreementType": "MicrosoftCustomerAgreement",
        "displayName": "Contoso",
        "hasReadAccess": true,
        "organizationId": "41b29574-xxxx-xxxx-xxxx-xxxxxxxxxxxxx_xxxx-xx-xx"
      },
      "type": "Microsoft.Billing/billingAccounts"
    },
    {
      "id": "/providers/Microsoft.Billing/billingAccounts/4f89e155-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx",
      "name": "4f89e155-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx",
      "properties": {
        "accountId": "4f89e155-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "accountStatus": "Active",
        "accountType": "Enterprise",
        "agreementType": "MicrosoftCustomerAgreement",
        "displayName": "Fabrikam",
        "hasReadAccess": true,
        "organizationId": "41b29574-xxxx-xxxx-xxxx-xxxxxxxxxxxxx_xxxx-xx-xx"
      },
      "type": "Microsoft.Billing/billingAccounts"
    }
  ]
}

```
Use the `displayName` property to identify the billing account for which you want to create subscriptions. Ensure, the agreementType of the account is *MicrosoftCustomerAgreement*. Copy the `name` of the account.  For example, to create a subscription for the `Contoso` billing account, copy `5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx`. Paste the value somewhere so that you can use it in the next step.

### Find invoice sections to create subscriptions

The charges for your subscription appear on a section of a billing profile's invoice. Use the following API to get the list of invoice sections and billing profiles on which you have permission to create Azure subscriptions.

Make the following request, replacing `<billingAccountName>` with the `name` copied from the first step (```5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx```).

```json
POST https://management.azure.com/providers/Microsoft.Billing/billingAccounts/<billingAccountName>/listInvoiceSectionsWithCreateSubscriptionPermission?api-version=2019-10-01-preview
```

The API response lists all the invoice sections and their billing profiles on which you have access to create subscriptions:

```json
{
    "value": [{
        "billingProfileDisplayName": "Contoso finance",
        "billingProfileId": "/providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx/billingProfiles/PBFV-xxxx-xxx-xxx",
        "enabledAzurePlans": [{
            "productId": "DZH318Z0BPS6",
            "skuId": "0001",
            "skuDescription": "Microsoft Azure Plan"
        }, {
            "productId": "DZH318Z0BPS6",
            "skuId": "0002",
            "skuDescription": "Microsoft Azure Plan for DevTest"
        }],
        "invoiceSectionDisplayName": "Development",
        "invoiceSectionId": "/providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx/billingProfiles/PBFV-xxxx-xxx-xxx/invoiceSections/GJ77-xxxx-xxx-xxx"
    }, {
        "billingProfileDisplayName": "Contoso finance",
        "billingProfileId": "/providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx/billingProfiles/PBFV-xxxx-xxx-xxx",
        "enabledAzurePlans": [{
            "productId": "DZH318Z0BPS6",
            "skuId": "0001",
            "skuDescription": "Microsoft Azure Plan"
        }, {
            "productId": "DZH318Z0BPS6",
            "skuId": "0002",
            "skuDescription": "Microsoft Azure Plan for DevTest"
        }],
        "invoiceSectionDisplayName": "Testing",
        "invoiceSectionId": "/providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx/billingProfiles/PBFV-XXXX-XXX-XXX/invoiceSections/GJGR-XXXX-XXX-XXX"
  }]
}

```

Use the `invoiceSectionDisplayName` property to identify the invoice section for which you want to create subscriptions. Copy `invoiceSectionId`, `billingProfileId`, and one of the `skuId` for the invoice section. For example, to create a subscription of type `Microsoft Azure plan` for `Development` invoice section, copy `/providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_2019-05-31/billingProfiles/PBFV-XXXX-XXX-XXX/invoiceSections/GJGR-XXXX-XXX-XXX`, `/providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_2019-05-31/billingProfiles/PBFV-xxxx-xxx-xxx`, and `0001`. Paste the values somewhere so that you can use them in the next step.

### Create a subscription for an invoice section

The following example creates a subscription named *Dev Team subscription* of type *Microsoft Azure Plan* for the *Development* invoice section. The subscription is billed to the *Contoso finance's* billing profile and appear on the *Development* section of its invoice.

Make the following request, replacing `<invoiceSectionId>` with the `invoiceSectionId` copied from the second step (```/providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_2019-05-31/billingProfiles/PBFV-XXXX-XXX-XXX/invoiceSections/GJGR-XXXX-XXX-XXX```). Pass the `billingProfileId` and `skuId` copied from the second step in the request parameters of the API. To specify owners, see [how to get user object IDs](grant-access-to-create-subscription.md#userObjectId).

```json
POST https://management.azure.com<invoiceSectionId>/providers/Microsoft.Subscription/createSubscription?api-version=2018-11-01-preview
```

```json
'{"displayName": "Dev Team subscription",
  "billingProfileId": "<billingProfileId>",
  "skuId": "<skuId>",
  "owners": [
      {
        "objectId": "<userObjectId>"
      },
      {
        "objectId": "<servicePrincipalObjectId>"
      }
    ],
  "costCenter": "35683",
  "managementGroupId": "/providers/Microsoft.Management/managementGroups/xxxxxxx",",
}'

```

| Element Name  | Required | Type   | Description                                                                                               |
|---------------|----------|--------|-----------------------------------------------------------------------------------------------------------|
| `displayName` | Yes      | String | The display name of the subscription.|
| `billingProfileId`   | Yes      | String | The ID of the billing profile that is billed for the subscription's charges.  |
| `skuId` | Yes      | String | The sku ID that determines the type of Azure plan. |
| `owners`      | No       | String | The Object ID of any user or service principal to add as an Azure RBAC Owner on the subscription when it's created.  |
| `costCenter` | No      | String | The cost center associated with the subscription. It shows up in the usage CSV file. |
| `managementGroupId` | No      | String | The ID of the management group to which the subscription will be added. To get the list of management groups, see [Management Groups - List API](/rest/api/managementgroups/entities/list). Use the ID of a management group from the API. |

In the response, you get back a `subscriptionCreationResult` object for monitoring. When the subscription creation is finished, the `subscriptionCreationResult` object returns a `subscriptionLink` object, which has the subscription ID.

## Create subscriptions for an MPA billing account

Use the information in the following sections to create subscriptions for an MPA billing account.

### Prerequisites

You must have a Global Admin or Admin Agent role in your organization's Cloud Solution Provider account to create subscription for your billing account. For more information, see [Partner Center - Assign users roles and permissions](/partner-center/permissions-overview).

The following examples use REST APIs. Currently, PowerShell and Azure CLI aren't supported.

### Find the billing accounts that you have access to

Make the request below to list all billing accounts that you have access to.

```json
GET https://management.azure.com/providers/Microsoft.Billing/billingAccounts?api-version=2019-10-01-preview
```

The API response lists the billing accounts.

```json
{
  "value": [
    {
      "id": "/providers/Microsoft.Billing/billingAccounts/99a13315-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx",
      "name": "99a13315-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx",
      "properties": {
        "accountId": "5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "accountStatus": "Active",
        "accountType": "Enterprise",
        "agreementType": "MicrosoftPartnerAgreement",
        "displayName": "Contoso",
        "hasReadAccess": true,
        "organizationId": "1d100e69-xxxx-xxxx-xxxx-xxxxxxxxxxxxx_xxxx-xx-xx"
      },
      "type": "Microsoft.Billing/billingAccounts"
    },
    {
      "id": "/providers/Microsoft.Billing/billingAccounts/4f89e155-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx",
      "name": "4f89e155-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx",
      "properties": {
        "accountId": "4f89e155-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "accountStatus": "Active",
        "accountType": "Enterprise",
        "agreementType": "MicrosoftCustomerAgreement",
        "displayName": "Fabrikam",
        "hasReadAccess": true,
        "organizationId": "1d100e69-xxxx-xxxx-xxxx-xxxxxxxxxxxxx_xxxx-xx-xx"
      },
      "type": "Microsoft.Billing/billingAccounts"
    }
  ]
}

```
Use the `displayName` property to identify the billing account for which you want to create subscriptions. Ensure, the agreementType of the account is *MicrosoftPartnerAgreement*. Copy the `name` for the account. For example, to create a subscription for the `Contoso` billing account, copy `99a13315-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx`. Paste the value somewhere so that you can use it in the next step.

### Find customers that have Azure plans

Make the following request, replacing `<billingAccountName>` with the `name` copied from the first step (```5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx```) to list all customers in the billing account for whom you can create Azure subscriptions.

```json
GET https://management.azure.com/providers/Microsoft.Billing/billingAccounts/<billingAccountName>/customers?api-version=2019-10-01-preview
```
The API response lists the customers in the billing account with Azure plans. You can create subscriptions for the customers.

```json
{
  "value": [
    {
      "id": "/providers/Microsoft.Billing/billingAccounts/99a13315-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx/customers/2281f543-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "name": "2281f543-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "properties": {
        "billingProfileDisplayName": "Contoso USD",
        "billingProfileId": "/providers/Microsoft.Billing/billingAccounts/99a13315-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx/billingProfiles/JUT6-xxxx-xxxx-xxxx",
        "displayName": "Fabrikam toys"
      },
      "type": "Microsoft.Billing/billingAccounts/customers"
    },
    {
      "id": "/providers/Microsoft.Billing/billingAccounts/99a13315-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx/customers/97c3fac4-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "name": "97c3fac4-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "properties": {
        "billingProfileDisplayName": "Fabrikam sports",
        "billingProfileId": "/providers/Microsoft.Billing/billingAccounts/99a13315-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx/billingProfiles/JUT6-xxxx-xxxx-xxxx",
        "displayName": "Fabrikam bakery"
      },
      "type": "Microsoft.Billing/billingAccounts/customers"
    }]
}

```

Use the `displayName` property to identify the customer for which you want to create subscriptions. Copy the `id` for the customer. For example, to create a subscription for `Fabrikam toys`, copy `/providers/Microsoft.Billing/billingAccounts/99a13315-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx/customers/2281f543-xxxx-xxxx-xxxx-xxxxxxxxxxxx`. Paste the value somewhere to use it in later steps.

### Optional for Indirect providers: Get the resellers for a customer

If you're an Indirect provider in the CSP two-tier model, you can specify a reseller while creating subscriptions for customers.

Make the following request, replacing `<customerId>` with the `id` copied from the second step (```/providers/Microsoft.Billing/billingAccounts/99a13315-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx/customers/2281f543-xxxx-xxxx-xxxx-xxxxxxxxxxxx```) to list all resellers that are available for a customer.

```json
GET https://management.azure.com<customerId>?$expand=resellers&api-version=2019-10-01-preview
```
The API response lists the resellers for the customer:

```json
{
  "value": [{
  "id": "/providers/Microsoft.Billing/billingAccounts/99a13315-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx/customers/2ed2c490-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "name": "2ed2c490-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "type": "Microsoft.Billing/billingAccounts/customers",
  "properties": {
    "displayName": "Fabrikam toys",
    "resellers": [
      {
        "resellerId": "3xxxxx",
        "description": "Wingtip"
      }
    ]
  }
},
{
  "id": "/providers/Microsoft.Billing/billingAccounts/99a13315-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx/customers/4ed2c793-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "name": "4ed2c793-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "type": "Microsoft.Billing/billingAccounts/customers",
  "properties": {
    "displayName": "Fabrikam toys",
    "resellers": [
      {
        "resellerId": "5xxxxx",
        "description": "Tailspin"
      }
    ]
  }
}]
}
```

Use the `description` property to identify the reseller to associate with the subscription. Copy the `resellerId` for the reseller. For example, to associate `Wingtip`, copy `3xxxxx`. Paste the value somewhere so that you can use it in the next step.

### Create a subscription for a customer

The following example creates a subscription named *Dev Team subscription* for *Fabrikam toys* and associate *Wingtip* reseller to the subscription.

Make the following request, replacing `<customerId>` with the `id` copied from the second step (```/providers/Microsoft.Billing/billingAccounts/99a13315-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx/customers/2281f543-xxxx-xxxx-xxxx-xxxxxxxxxxxx```). Pass the optional *resellerId* copied from the second step in the request parameters of the API.

```json
POST https://management.azure.com<customerId>/providers/Microsoft.Subscription/createSubscription?api-version=2018-11-01-preview
```

```json
'{"displayName": "Dev Team subscription",
  "skuId": "0001",
  "resellerId": "<resellerId>",
}'
```

| Element Name  | Required | Type   | Description                                                                                               |
|---------------|----------|--------|-----------------------------------------------------------------------------------------------------------|
| `displayName` | Yes      | String | The display name of the subscription.|
| `skuId` | Yes      | String | The sku ID of the Azure plan. Use *0001* for subscriptions of type Microsoft Azure Plan |
| `resellerId`      | No       | String | The ID of the reseller who will be associated with the subscription.  |

In the response, you get back a `subscriptionCreationResult` object for monitoring. When the subscription creation is finished, the `subscriptionCreationResult` object returns a `subscriptionLink` object. It has the subscription ID.

## Next steps

- To view and example of creating an Enterprise Agreement (EA) subscription using .NET, see [sample code on GitHub](https://github.com/Azure-Samples/create-azure-subscription-dotnet-core).
* Now that you've created a subscription, you can grant that ability to other users and service principals. For more information, see [Grant access to create Azure Enterprise subscriptions (preview)](grant-access-to-create-subscription.md).
* For more information about managing large numbers of subscriptions using management groups, see [Organize your resources with Azure management groups](../../governance/management-groups/overview.md).
