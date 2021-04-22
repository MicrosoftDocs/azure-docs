---
title: Programmatically create Azure Enterprise Agreement subscriptions with the latest APIs
description: Learn how to create Azure Enterprise Agreement subscriptions programmatically using the latest versions of REST API, Azure CLI, Azure PowerShell, and Azure Resource Manager templates.
author: bandersmsft
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 03/29/2021
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
* An existing Owner of the Enrollment Account can [grant you access](/rest/api/billing/2019-10-01-preview/enrollmentaccountroleassignments/put). Similarly, to use a service principal to create an EA subscription, you must [grant that service principal the ability to create subscriptions](/rest/api/billing/2019-10-01-preview/enrollmentaccountroleassignments/put).  
    If you're using an SPN to create subscriptions, use the ObjectId of the Azure AD Application Registration as the Service Principal ObjectId using [Azure Active Directory PowerShell](/powershell/module/azuread/get-azureadserviceprincipal?view=azureadps-2.0) or [Azure CLI](/cli/azure/ad/sp?view=azure-cli-latest#az_ad_sp_list).
  > [!NOTE]
  > Ensure that you use the correct API version to give the enrollment account owner permissions. For this article and for the APIs documented in it, use the [2019-10-01-preview](/rest/api/billing/2019-10-01-preview/enrollmentaccountroleassignments/put) API. If you're migrating to use the newer APIs, you must grant owner permission again using [2019-10-01-preview](/rest/api/billing/2019-10-01-preview/enrollmentaccountroleassignments/put). Your previous configuration made with the [2015-07-01 version](grant-access-to-create-subscription.md) doesn't automatically convert for use with the newer APIs.

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

The values for a billing scope and `id` are the same thing. The `id` for your enrollment account is the billing scope under which the subscription request is initiated. It’s important to know the ID because it’s a required parameter that you use later in the article to create a subscription.

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

The values for a billing scope and `id` are the same thing. The `id` for your enrollment account is the billing scope under which the subscription request is initiated. It’s important to know the ID because it’s a required parameter that you use later in the article to create a subscription.

---

## Create subscriptions under a specific enrollment account

The following example creates a subscription named *Dev Team Subscription* in the enrollment account selected in the previous step. 

### [REST](#tab/rest)

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

### [PowerShell](#tab/azure-powershell)

To install the latest version of the module that contains the `New-AzSubscriptionAlias` cmdlet, run `Install-Module Az.Subscription`. To install a recent version of PowerShellGet, see [Get PowerShellGet Module](/powershell/scripting/gallery/installing-psget).

Run the following [New-AzSubscriptionAlias](/powershell/module/az.subscription/new-azsubscription) command, using the billing scope `"/providers/Microsoft.Billing/BillingAccounts/1234567/enrollmentAccounts/7654321"`. 

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

Run the following [az account alias create](/cli/azure/account/alias#az_account_alias_create) command and provide `billing-scope` and `id` from one of your `enrollmentAccounts`. 

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

## Use ARM template

The previous section showed how to create a subscription with PowerShell, CLI, or REST API. If you need to automate creating subscriptions, consider using an Azure Resource Manager template (ARM template).

The following template creates a subscription. For `billingScope`, provide the enrollment account ID. For `targetManagementGroup`, provide the management group where you want to create the subscription.

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
        },
        "targetManagementGroup": {
            "type": "string",
            "metadata": {
                "description": "Provide the ID of the target management group to place the subscription."
            }
        }
    },
    "resources": [
        {
            "scope": "/", 
            "name": "[parameters('subscriptionAliasName')]",
            "type": "Microsoft.Subscription/aliases",
            "apiVersion": "2020-09-01",
            "properties": {
                "workLoad": "Production",
                "displayName": "[parameters('subscriptionAliasName')]",
                "billingScope": "[parameters('billingScope')]",
                "managementGroupId": "[tenantResourceId('Microsoft.Management/managementGroups/', parameters('targetManagementGroup'))]"
            }
        }
    ],
    "outputs": {}
}
```

Deploy the template at the [management group level](../../azure-resource-manager/templates/deploy-to-management-group.md).

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
      },
      "targetManagementGroup": {
        "value": "mg2"
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
  -billingScope "/providers/Microsoft.Billing/BillingAccounts/1234567/enrollmentAccounts/7654321" `
  -targetManagementGroup mg2
```

### [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az deployment mg create \
  --name exampledeployment \
  --location eastus \
  --management-group-id mg1 \
  --template-file azuredeploy.json \
  --parameters subscriptionAliasName='sampleAlias' billingScope='/providers/Microsoft.Billing/BillingAccounts/1234567/enrollmentAccounts/7654321' targetManagementGroup=mg2
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
* To change the management group for a subscription, see [Move subscriptions](../../governance/management-groups/manage.md#move-subscriptions).
