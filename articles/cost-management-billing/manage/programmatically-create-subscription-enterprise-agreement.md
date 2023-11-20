---
title: Programmatically create Azure Enterprise Agreement subscriptions with the latest APIs
description: Learn how to create Azure Enterprise Agreement subscriptions programmatically using the latest versions of REST API, Azure CLI, Azure PowerShell, and Azure Resource Manager templates.
author: bandersmsft
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 05/17/2023
ms.reviewer: sapnakeshari
ms.author: banders
ms.custom: devx-track-azurepowershell, devx-track-azurecli, devx-track-arm-template, devx-track-bicep
---

# Programmatically create Azure Enterprise Agreement subscriptions with the latest APIs

This article helps you programmatically create Azure Enterprise Agreement (EA) subscriptions for an EA billing account using the most recent API versions. If you are still using the older preview version, see [Programmatically create Azure subscriptions legacy APIs](programmatically-create-subscription-preview.md).

In this article, you learn how to create subscriptions programmatically using Azure Resource Manager.

When you create an Azure subscription programmatically, that subscription is governed by the agreement under which you obtained Azure services from Microsoft or an authorized reseller. For more information, see [Microsoft Azure Legal Information](https://azure.microsoft.com/support/legal/).

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

## Prerequisites

A user must have an Owner role on an Enrollment Account to create a subscription. There are two ways to get the role:

* The Enterprise Administrator of your enrollment can [make you an Account Owner](https://ea.azure.com/helpdocs/addNewAccount) (sign in required) which makes you an Owner of the Enrollment Account.
* An existing Owner of the Enrollment Account can [grant you access](/rest/api/billing/2019-10-01-preview/enrollmentaccountroleassignments/put).

To use a service principal (SPN) to create an EA subscription, an Owner of the Enrollment Account must [grant that service principal the ability to create subscriptions](/rest/api/billing/2019-10-01-preview/enrollmentaccountroleassignments/put).

When using an SPN to create subscriptions, use the ObjectId of the Microsoft Entra Enterprise application as the Service Principal ID using [Microsoft Graph PowerShell](/powershell/module/microsoft.graph.applications/get-mgserviceprincipal) or [Azure CLI](/cli/azure/ad/sp#az-ad-sp-list). You can also use the steps at [Find your SPN and tenant ID](assign-roles-azure-service-principals.md#find-your-spn-and-tenant-id) to find the object ID in the Azure portal for an existing SPN.

For more information about the EA role assignment API request, see [Assign roles to Azure Enterprise Agreement service principal names](assign-roles-azure-service-principals.md). The article includes a list of roles (and role definition IDs) that can be assigned to an SPN.

  > [!NOTE]
  > - Ensure that you use the correct API version to give the enrollment account owner permissions. For this article and for the APIs documented in it, use the [2019-10-01-preview](/rest/api/billing/2019-10-01-preview/enrollmentaccountroleassignments/put) API.
  > - If you're migrating to use the newer APIs, your previous configuration made with the [2015-07-01 version](grant-access-to-create-subscription.md) doesn't automatically convert for use with the newer APIs.
> - The Enrollment Account information is only visible when the user's role is Account Owner. When a user has multiple roles, the API uses the user's least restrictive role.

## Find accounts you have access to

After you're added to an Enrollment Account associated to an Account Owner, Azure uses the account-to-enrollment relationship to determine where to bill the subscription charges. All subscriptions created under the account are billed to the EA enrollment that the account is in. To create subscriptions, you must pass in values about the enrollment account and the user principals to own the subscription.

To run the following commands, you must be logged in to the Account Owner's *home directory*, which is the directory that subscriptions are created in by default.

### [REST](#tab/rest)

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

The values for a billing scope and `id` are the same thing. The `id` for your enrollment account is the billing scope under which the subscription request is initiated. It's important to know the ID because it's a required parameter that you use later in the article to create a subscription.

### [PowerShell](#tab/azure-powershell)

Please use either Azure CLI or REST API to get this value.

### [Azure CLI](#tab/azure-cli)

Request to list all enrollment accounts you have access to:

```azurecli-interactive
> az billing account list
```

Response lists all enrollment accounts you have access to

```json
[
  {
    "accountStatus": "Unknown",
    "accountType": "Enterprise",
    "agreementType": "EnterpriseAgreement",
    "billingProfiles": {
      "hasMoreResults": false,
      "value": null
    },
    "departments": null,
    "displayName": "Contoso",
    "enrollmentAccounts": [
      {
        "accountName": "Contoso",
        "accountOwner": "",
        "costCenter": "Test",
        "department": null,
        "endDate": null,
        "id": "/providers/Microsoft.Billing/billingAccounts/1234567/enrollmentAccounts/7654321",
        "name": "7654321",
        "startDate": null,
        "status": null,
        "type": "Microsoft.Billing/enrollmentAccounts"
      }
    ],
    "enrollmentDetails": null,
    "hasReadAccess": false,
    "id": "/providers/Microsoft.Billing/billingAccounts/1234567",
    "name": "1234567",
    "soldTo": {
      "addressLine1": null,
      "addressLine2": null,
      "addressLine3": null,
      "city": null,
      "companyName": "Contoso",
      "country": "US ",
      "district": null,
      "email": null,
      "firstName": null,
      "lastName": null,
      "phoneNumber": null,
      "postalCode": null,
      "region": null
    },
    "type": "Microsoft.Billing/billingAccounts"
  },
```

The values for a billing scope and `id` are the same thing. The `id` for your enrollment account is the billing scope under which the subscription request is initiated. It's important to know the ID because it's a required parameter that you use later in the article to create a subscription.

---

## Create subscriptions under a specific enrollment account

The following example creates a subscription named *Dev Team Subscription* in the enrollment account selected in the previous step.

Using one of the following methods, you'll create a subscription alias name. We recommend that when you create the alias name, you:

- Use alphanumeric characters and hyphens
- Start with a letter and end with an alphanumeric character
- Don't use periods

An alias is used for simple substitution of a user-defined string instead of the subscription GUID. In other words, you can use it as a shortcut. You can learn more about alias at [Alias - Create](/rest/api/subscription/2021-10-01/alias/create). In the following examples, `sampleAlias` is created but you can use any string you like.

If you have multiple user roles in addition to the Account Owner role, then you must retrieve the account ID from the Azure portal. Then you can use the ID to programmatically create subscriptions.

### [REST](#tab/rest)

Call the PUT API to create a subscription creation request/alias.

```json
PUT  https://management.azure.com/providers/Microsoft.Subscription/aliases/sampleAlias?api-version=2021-10-01
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
GET https://management.azure.com/providers/Microsoft.Subscription/aliases/sampleAlias?api-version=2021-10-01
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

### [PowerShell](#tab/azure-powershell)

To install the version of the module that contains the `New-AzSubscriptionAlias` cmdlet, in below example run `Install-Module Az.Subscription -RequiredVersion 0.9.0`. To install version 0.9.0 of PowerShellGet, see [Get PowerShellGet Module](/powershell/gallery/powershellget/install-powershellget).

Run the following [New-AzSubscriptionAlias](/powershell/module/az.subscription/get-azsubscriptionalias) command, using the billing scope `"/providers/Microsoft.Billing/BillingAccounts/1234567/enrollmentAccounts/7654321"`.

```azurepowershell-interactive
New-AzSubscriptionAlias -AliasName "sampleAlias" -SubscriptionName "Dev Team Subscription" -BillingScope "/providers/Microsoft.Billing/BillingAccounts/1234567/enrollmentAccounts/7654321" -Workload "Production"
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

### [Azure CLI](#tab/azure-cli)

First, install the extension by running `az extension add --name account` and `az extension add --name alias`.

Run the following [az account alias create](/cli/azure/account/alias#az-account-alias-create) command and provide `billing-scope` and `id` from one of your `enrollmentAccounts`.

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

## Create subscriptions in a different enrollment

Using the subscription [Alias](/rest/api/subscription/2021-10-01/alias/create) REST API, you can use the `subscriptionTenantId` parameter in the request body. Your SPN must get the token from the home tenant to create the subscription. After you create the SPN, you get the token from `subscriptionTenantId` and accept the transfer using the [Accept Ownership](/rest/api/subscription/2021-10-01/subscription/accept-ownership) API.

For more information about creating EA subscriptions in another tenant, see [Create subscription in other tenant and view transfer requests](direct-ea-administration.md#create-subscription-in-other-tenant-and-view-transfer-requests).

## Use ARM template or Bicep

The previous section showed how to create a subscription with PowerShell, CLI, or REST API. If you need to automate creating subscriptions, consider using an Azure Resource Manager template (ARM template) or [Bicep file](../../azure-resource-manager/bicep/overview.md).

The following ARM template creates a subscription. For `billingScope`, provide the enrollment account ID. The subscription is created in the root management group. After creating the subscription, you can move it to another management group.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-08-01/managementGroupDeploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "subscriptionAliasName": {
            "type": "string",
            "metadata": {
                "description": "Provide a name for the alias. This name will also be the display name of the subscription."
            }
        },
        "billingScope": {
            "type": "string",
            "metadata": {
                "description": "Provide the full resource ID of billing scope to use for subscription creation."
            }
        }
    },
    "resources": [
        {
            "scope": "/",
            "name": "[parameters('subscriptionAliasName')]",
            "type": "Microsoft.Subscription/aliases",
            "apiVersion": "2021-10-01",
            "properties": {
                "workLoad": "Production",
                "displayName": "[parameters('subscriptionAliasName')]",
                "billingScope": "[parameters('billingScope')]"
            }
        }
    ],
    "outputs": {}
}
```

Or, use a Bicep file to create the subscription.

```bicep
targetScope = 'managementGroup'

@description('Provide a name for the alias. This name will also be the display name of the subscription.')
param subscriptionAliasName string

@description('Provide the full resource ID of billing scope to use for subscription creation.')
param billingScope string

resource subscriptionAlias 'Microsoft.Subscription/aliases@2021-10-01' = {
  scope: tenant()
  name: subscriptionAliasName
  properties: {
    workload: 'Production'
    displayName: subscriptionAliasName
    billingScope: billingScope
  }
}
```

Deploy the template at the [management group level](../../azure-resource-manager/templates/deploy-to-management-group.md). The following examples show deploying the JSON ARM template, but you can deploy a Bicep file instead.

### [REST](#tab/rest)

```json
PUT https://management.azure.com/providers/Microsoft.Management/managementGroups/mg1/providers/Microsoft.Resources/deployments/exampledeployment?api-version=2020-06-01
```

With a request body:

```json
{
  "location": "eastus",
  "properties": {
    "templateLink": {
      "uri": "http://mystorageaccount.blob.core.windows.net/templates/template.json"
    },
    "parameters": {
      "subscriptionAliasName": {
        "value": "sampleAlias"
      },
      "billingScope": {
        "value": "/providers/Microsoft.Billing/BillingAccounts/1234567/enrollmentAccounts/7654321"
      }
    },
    "mode": "Incremental"
  }
}
```

### [PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
New-AzManagementGroupDeployment `
  -Name exampledeployment `
  -Location eastus `
  -ManagementGroupId mg1 `
  -TemplateFile azuredeploy.json `
  -subscriptionAliasName sampleAlias `
  -billingScope "/providers/Microsoft.Billing/BillingAccounts/1234567/enrollmentAccounts/7654321"
```

### [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az deployment mg create \
  --name exampledeployment \
  --location eastus \
  --management-group-id mg1 \
  --template-file azuredeploy.json \
  --parameters subscriptionAliasName='sampleAlias' billingScope='/providers/Microsoft.Billing/BillingAccounts/1234567/enrollmentAccounts/7654321'
```

---

To move a subscription to a new management group, use the following ARM template.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-08-01/managementGroupDeploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "targetMgId": {
            "type": "string",
            "metadata": {
                "description": "Provide the ID of the management group that you want to move the subscription to."
            }
        },
        "subscriptionId": {
            "type": "string",
            "metadata": {
                "description": "Provide the ID of the existing subscription to move."
            }
        }
    },
    "resources": [
        {
            "scope": "/",
            "type": "Microsoft.Management/managementGroups/subscriptions",
            "apiVersion": "2020-05-01",
            "name": "[concat(parameters('targetMgId'), '/', parameters('subscriptionId'))]",
            "properties": {
            }
        }
    ],
    "outputs": {}
}
```

Or, the following Bicep file.

```bicep
targetScope = 'managementGroup'

@description('Provide the ID of the management group that you want to move the subscription to.')
param targetMgId string

@description('Provide the ID of the existing subscription to move.')
param subscriptionId string

resource subToMG 'Microsoft.Management/managementGroups/subscriptions@2020-05-01' = {
  scope: tenant()
  name: '${targetMgId}/${subscriptionId}'
}
```

## Limitations of Azure Enterprise subscription creation API

- Only Azure Enterprise subscriptions are created using the API.
- There's a limit of 5000 subscriptions per enrollment account. After that, more subscriptions for the account can only be created in the Azure portal. To create more subscriptions through the API, create another enrollment account. Canceled, deleted, and transferred subscriptions count toward the 5000 limit.
- Users who aren't Account Owners, but were added to an enrollment account via Azure RBAC, can't create subscriptions in the Azure portal.

## Next steps

* Now that you've created a subscription, you can grant that ability to other users and service principals. For more information, see [Grant access to create Azure Enterprise subscriptions (preview)](grant-access-to-create-subscription.md).
* For more information about managing large numbers of subscriptions using management groups, see [Organize your resources with Azure management groups](../../governance/management-groups/overview.md).
* To change the management group for a subscription, see [Move subscriptions](../../governance/management-groups/manage.md#move-subscriptions).
* For advanced subscription creation scenarios using REST API, see [Alias - Create](/rest/api/subscription/2021-10-01/alias/create).
