---
title: Track Azure credit balance for a Microsoft Customer Agreement
description: Learn how to check the Azure credit balance for a Microsoft Customer Agreement.
author: bandersmsft
ms.reviewer: amberb
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 03/21/2024
ms.author: banders
---

# Track Microsoft Customer Agreement Azure credit balance

You can check the Azure credit balance for your billing account for a Microsoft Customer Agreement in the Azure portal or through REST APIs.

In the billing account for a Microsoft Customer Agreement, credits are assigned to a billing profile. Each billing profile has its own credits that are automatically applied to the charges on its invoice. You must have an owner, contributor, reader, or invoice manager role on the billing profile or owner, contributor, or reader role on the billing account to view Azure credit balance for a billing profile. To learn more about the roles, see [Understand Microsoft Customer Agreement administrative roles in Azure](understand-mca-roles.md).

> [!NOTE]
> New credit can take up to 24 hours to appear in the Azure portal. If you get new credit and can't see it in the portal, allow 24 hours for it to appear.

This article applies to a billing account for a Microsoft Customer Agreement. [Check if you have access to a Microsoft Customer Agreement](#check-access-to-a-microsoft-customer-agreement).

## Check your credit balance

### [Azure portal](#tab/portal)

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Search for **Cost Management + Billing**.

    :::image type="content" border="true" source="./media/mca-check-azure-credits-balance/billing-search-cost-management-billing.png" alt-text="Screenshot that shows search in the Azure portal for Cost Management + Billing.":::

3. In the billing scopes page, select the billing account for which you want to track the credit balance. The billing account should be of type **Microsoft Customer Agreement**.

    :::image type="content" border="true" source="./media/mca-check-azure-credits-balance/list-of-scopes.png" alt-text="Screenshot that shows Billing Scopes.":::

    > [!NOTE]
    >
    > Azure portal remembers the last billing scope that you access and displays the scope the next time you come to Cost Management + Billing page. You won't see the billing scopes page if you have visited Cost Management + Billing earlier. If so, check that you are in the [right scope](#check-access-to-a-microsoft-customer-agreement). If not, [switch the scope](view-all-accounts.md#switch-billing-scope-in-the-azure-portal) to select the billing account for a Microsoft Customer Agreement.

3. Select **Payment methods** from the left-hand side and then select **Azure credits**.

   :::image type="content" border="true" source="./media/mca-check-azure-credits-balance/mca-payment-methods.png" alt-text="Screenshot of estimated and current balances.":::

4. The Azure credits page has the following sections:

   #### Balance

   The balance section displays the summary of your Azure credit balance.

   :::image type="content" border="true" source="./media/mca-check-azure-credits-balance/mca-credit-balance.png" alt-text="Screenshot showing the credit balance for a billing profile.":::

   | Term               | Definition                           |
   |--------------------|--------------------------------------------------------|
   | Estimated balance  | Estimated amount of credits you have after considering all billed and pending transactions |
   | Current balance    | Amount of credits as of your last invoice. It doesn't include any pending transactions |

   When your estimated balance drops to 0, you are charged for all your usage, including for products that are eligible for credits.

   #### Credits list

   The credits list section displays the list of Azure credits.

   :::image type="content" border="true" source="./media/mca-check-azure-credits-balance/mca-credits-list.png" alt-text="Screenshot showing the credits lists for a billing profile.":::

   | Term | Definition |
   |---|---|
   | Source | The acquisition source of the credit |
   | Start date | The date when you acquired the credit |
   | Expiration date | The date when the credit expires |
   | Current balance | The balance as of your last invoice |
   | Original amount | The original amount of credit |
   | Status | The current status of credit. Status can be active, used, expired, or expiring |

   #### Transactions

   The transactions section displays all transactions that affected your credits balance.

   :::image type="content" border="true" source="./media/mca-check-azure-credits-balance/mca-credits-transactions.png" alt-text="Screenshot showing credit transactions for a billing profile.":::

   | Term | Definition |
   |---|---|
   | Transaction date | The date when the transaction happened |
   | Description | A description of the transaction |
   | Amount| The amount of transaction |
   | Balance | The balance after the transaction |

    > [!NOTE]
    >
    > If you don't see Azure credits in the payment methods page, either you don't have credits or you have not selected the right scope. Select the billing account which has credits or one of its billing profiles. To learn how to change scopes, see [Switch billing scopes in the Azure portal](view-all-accounts.md#switch-billing-scope-in-the-azure-portal).

5. If you are viewing Azure credits at the billing account scope and the billing account has more than one billing profiles, the Azure credits page will show a table with a summary of Azure credits for each billing profile. Select a billing profile from the list, select payment methods and then Azure credits to view details for a billing profile.

    :::image type="content" border="true" source="./media/mca-check-azure-credits-balance/mca-account-credit-list.png" alt-text="Screenshot showing the credit list for a billing account.":::

### [REST API](#tab/rest)

You can use the [Azure Billing](/rest/api/billing/) and the [Consumption](/rest/api/consumption/) APIs to programmatically get the credit balance for your billing account.

The examples shown below use REST APIs. Currently, PowerShell and Azure CLI are not supported.

### Find billing profiles you have access to

```json
GET https://management.azure.com/providers/Microsoft.Billing/billingAccounts?$expand=billingProfiles&api-version=2019-10-01-preview
```
The API response returns a list of billing accounts and their billing profiles.

```json
{
  "value": [
    {
      "id": "/providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx_xxxx-xx-xx",
      "name": "5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx_xxxx-xx-xx",
      "properties": {
        "accountId": "5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "accountStatus": "Active",
        "accountType": "Enterprise",
        "agreementType": "MicrosoftCustomerAgreement",
        "billingProfiles": [
          {
            "id": "/providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx_xxxx-xx-xx/billingProfiles/PBFV-xxxx-xxx-xxx",
            "name": "PBFV-xxxx-xxx-xxx",
            "properties": {
              "address": {
                "addressLine1": "AddressLine1",
                "city": "City",
                "companyName": "CompanyName",
                "country": "Country",
                "postalCode": "xxxxx",
                "region": "Region"
              },
              "currency": "USD",
              "displayName": "Development",
              "hasReadAccess": true,
              "invoiceDay": 5,
              "invoiceEmailOptIn": true
            },
            "type": "Microsoft.Billing/billingAccounts/billingProfiles"
          }
        ],
        "displayName": "Contoso",
        "hasReadAccess": true,
      },
      "type": "Microsoft.Billing/billingAccounts"
    }
  ]
}
```

Use the `displayName` property of the billing profile to identify the billing profile for which you want to check the credit balance. Copy the `id` of the billing profile. For example, if you want to check credit balance for **Development** billing profile, you'd copy ```/providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx_xxxx-xx-xx/billingProfiles/PBFV-xxxx-xxx-xxx```. Paste this value somewhere so that you can use it in the next step.

### Get Azure credit balance

Make the following request, replacing `<billingProfileId>` with the `id` copied in the first step (```/providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx_xxxx-xx-xx/billingProfiles/PBFV-xxxx-xxx-xxx```).

```json
GET https://management.azure.com<billingProfileId>/providers/Microsoft.Consumption/credits/balanceSummary?api-version=2019-10-01
```

The API response returns estimated and current balance for the billing profile.

```json
{
  "id": "/providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx_xxxx-xx-xx/billingProfiles/PBFV-xxxx-xxx-xxx/providers/Microsoft.Consumption/credits/balanceSummary/57c2e8df-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "name": "57c2e8df-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "type": "Microsoft.Consumption/credits/balanceSummary",
  "eTag": null,
  "properties": {
    "balanceSummary": {
      "estimatedBalance": {
        "currency": "USD",
        "value": 996.13
      },
      "currentBalance": {
        "currency": "USD",
        "value": 997.87
      }
    },
    "pendingCreditAdjustments": {
      "currency": "USD",
      "value": 0.0
    },
    "expiredCredit": {
      "currency": "USD",
      "value": 0.0
    },
    "pendingEligibleCharges": {
      "currency": "USD",
      "value": -1.74
    }
  }
}
```

| Element name  | Description                                                                           |
|---------------|---------------------------------------------------------------------------------------|
| `estimatedBalance` | The estimated amount of credits you have after considering all billed and pending transactions. |
| `currentBalance`   | The amount of credits as of your last invoice. It doesn't include any pending transactions.    |
| `pendingCreditAdjustments`      | The adjustments like refunds that are not yet invoiced.  |
| `expiredCredit`      |  The credit that expired since your last invoice.  |
| `pendingEligibleCharges`  | The credit eligible charges that are not yet invoiced.   |

### Get list of credits

Make the following request, replacing `<billingProfileId>` with the `id` copied in the first step (```/providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx_xxxx-xx-xx/billingProfiles/PBFV-xxxx-xxx-xxx```).

```json
GET https://management.azure.com<billingProfileId>/providers/Microsoft.Consumption/lots?api-version=2019-10-01
```
The API response returns lists of Azure credits for a billing profile.

```json
{
  "value": [
    {
      "id": "/providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx_xxxx-xx-xx/billingProfiles/PBFV-xxxx-xxx-xxx/providers/Microsoft.Consumption/lots/f2ecfd94-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "name": "f2ecfd94-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "type": "Microsoft.Consumption/lots",
      "eTag": null,
      "properties": {
        "originalAmount": {
          "currency": "USD",
          "value": 500.0
        },
        "closedBalance": {
          "currency": "USD",
          "value": 500.0
        },
        "source": "Azure Promotional Credit",
        "startDate": "09/18/2019 21:47:31",
        "expirationDate": "09/18/2020 21:47:30",
        "poNumber": ""
      }
    },
    {
      "id": "/providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx_xxxx-xx-xx/billingProfiles/xxxx-xxxx-xxx-xxx/providers/Microsoft.Consumption/lots/4ea40eb5-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "name": "4ea40eb5-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "type": "Microsoft.Consumption/lots",
      "eTag": null,
      "properties": {
        "originalAmount": {
          "currency": "USD",
          "value": 500.0
        },
        "closedBalance": {
          "currency": "USD",
          "value": 497.87
        },
        "source": "Azure Promotional Credit",
        "startDate": "09/18/2019 21:47:31",
        "expirationDate": "09/18/2020 21:47:30",
        "poNumber": ""
      }
    }
  ]
}
```
| Element name  | Description                                                                                               |
|---------------|-----------------------------------------------------------------------------------------------------------|
| `originalAmount` | The original amount of the credit. |
| `closedBalance`   | The balance as of the last invoice.    |
| `source`      | The source that defines who how acquired the credit. |
| `startDate`      |  The date when the credit became active.  |
| `expirationDate`  | The date when the credit expires.   |
| `poNumber`  | The purchase order number of the invoice on which the credit was billed.   |

### Get transactions that affected credit balance

Make the following request, replacing `<billingProfileId>` with the `id` copied in the first step (```providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx_xxxx-xx-xx/billingProfiles/PBFV-xxxx-xxx-xxx```). You would need to pass a **startDate** and an **endDate** to get transactions for your required duration.

```json
GET https://management.azure.com<billingProfileId>/providers/Microsoft.Consumption/events?api-version=2019-10-01&startDate=2018-10-01T00:00:00.000Z&endDate=2019-10-11T12:00:00.000Z?api-version=2019-10-01
```
The API response returns all transactions that affected the credit balance for your billing profile.

```json
{
  "value": [
    {
      "id": "/providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx_xxxx-xx-xx/billingProfiles/PBFV-xxxx-xxx-xxx`/providers/Microsoft.Consumption/events/e2032eb5-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "name": "e2032eb5-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "type": "Microsoft.Consumption/events",
      "eTag": null,
      "properties": {
        "transactionDate": "10/11/2019",
        "description": "Credit eligible charges as of 10/11/2019",
        "newCredit": {
          "currency": "USD",
          "value": 0.0
        },
        "adjustments": {
          "currency": "USD",
          "value": 0.0
        },
        "creditExpired": {
          "currency": "USD",
          "value": 0.0
        },
        "charges": {
          "currency": "USD",
          "value": -1.74
        },
        "closedBalance": {
          "currency": "USD",
          "value": 998.26
        },
        "eventType": "PendingCharges",
        "invoiceNumber": ""
      }
    },
    {
      "id": "/providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx_xxxx-xx-xx/billingProfiles/PBFV-xxxx-xxx-xxx/providers/Microsoft.Consumption/events/381efd80-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "name": "381efd80-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "type": "Microsoft.Consumption/events",
      "eTag": null,
      "properties": {
        "transactionDate": "09/18/2019",
        "description": "New credit added on 09/18/2019",
        "newCredit": {
          "currency": "USD",
          "value": 500.0
        },
        "adjustments": {
          "currency": "USD",
          "value": 0.0
        },
        "creditExpired": {
          "currency": "USD",
          "value": 0.0
        },
        "charges": {
          "currency": "USD",
          "value": 0.0
        },
        "closedBalance": {
          "currency": "USD",
          "value": 1000.0
        },
        "eventType": "PendingNewCredit",
        "invoiceNumber": ""
      }
    }
  ]
}
```
| Element name  | Description                                                                                               |
|---------------|-----------------------------------------------------------------------------------------------------------|
| `transactionDate` | The date when the transaction took place. |
| `description` | The description of the transaction. |
| `adjustments`   | The credit adjustments for the transaction.    |
| `creditExpired`      | The amount of credit that expired. |
| `charges`      |  The charges for the transaction.  |
| `closedBalance`  | The balance after the transaction.   |
| `eventType`  | The type of transaction.   |
| `invoiceNumber`  | The invoice number of the invoice on which the transaction is billed. It will be empty for pending transaction.   |

---

## How credits are used

In a billing account for a Microsoft customer agreement, you use billing profiles to manage your invoices and payment methods. A monthly invoice is generated for each billing profile and you use the payment methods to pay the invoice.

You assign credits that you acquire to a billing profile. When an invoice is generated for the billing profile, credits are automatically applied to the total charges to calculate the amount that you need to pay. You pay the remaining amount with your payment methods like check/ wire transfer or credit card.

## Products that aren't covered by Azure credits

 The following products aren't covered by your Azure credits. You're charged for using these products regardless of your credit balance:

- Canonical
- Citrix XenApp Essentials
- Citrix XenDesktop
- Registered User
- Openlogic
- Remote Access Rights XenApp Essentials Registered User
- Ubuntu Advantage
- Visual Studio Enterprise (Monthly)
- Visual Studio Enterprise (Annual)
- Visual Studio Professional (Monthly)
- Visual Studio Professional (Annual)
- Azure Marketplace products
- Azure support plans

## Check access to a Microsoft Customer Agreement
[!INCLUDE [billing-check-mca](../../../includes/billing-check-mca.md)]

## Need help? Contact support.

If you need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.

## Next steps

- [Understand billing account for Microsoft Customer Agreement](../understand/mca-overview.md)
- [Understand terms on your Microsoft Customer Agreement invoice](../understand/mca-understand-your-invoice.md)
