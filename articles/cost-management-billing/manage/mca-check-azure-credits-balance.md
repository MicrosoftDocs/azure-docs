---
title: Track Azure credit balance for a Microsoft Customer Agreement
description: Learn how to check the Azure credit balance for a Microsoft Customer Agreement.
author: shrutis06
ms.reviewer: shrshett
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 01/22/2025
ms.author: shrshett
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

1. In the billing scopes page, select the billing account for which you want to track the credit balance. The billing account should be of type **Microsoft Customer Agreement**.

    :::image type="content" border="true" source="./media/mca-check-azure-credits-balance/list-of-scopes.png" alt-text="Screenshot that shows billing scopes in Cost Management + Billing.":::

   
   > [!NOTE]
   > Azure portal remembers the last billing scope that you access and displays the scope the next time you come to Cost Management + Billing page. You won't see the billing scopes page if you have visited Cost Management + Billing earlier. If so, check that you are in the **[right scope](/azure/cost-management-billing/manage/mca-check-azure-credits-balance?tabs=portal)**. If not, **[switch the scope](/azure/cost-management-billing/manage/view-all-accounts)** to select the billing account for a Microsoft Customer Agreement.
   
   
   
   
1. Select **Payment methods** from the left-hand side and then select **Azure credits**.


    :::image type="content" border="true" source="./media/mca-check-azure-credits-balance/azure-credits-page-azportal.png" alt-text="Screenshot that shows Credits in the Azure portal for Cost Management + Billing.":::
   
   
   
   #### Available Balance

   Available credits after your last invoice. This includes all active credits only and excludes any expired or future credits. When your available balance drops to 0, you are charged for all your usage, including products that are eligible for credits.
   
   #### Credit details

    View list of all credits with details.
   
   | Term | Definition |
   |---|---|
   | Source |The acquisition source of the credit.|
   | Start date |The date when credit was acquired.|
   | Expiration date |The date when the credit expires.|
   | Original amount|The original amount of the credit.|
   | Balance|The credit balance after the latest invoice.|
   | Status |The current status of credit. Status can be active, used, expired, or expiring |
   
   
   ####  Transactions

     The transactions section displays all transactions that affected your credits balance.
   
     :::image type="content" border="true" source="./media/mca-check-azure-credits-balance/credits-transactions-azportal.png" alt-text="Screenshot that shows Credit transactions in the Azure portal for Cost Management + Billing.":::
   
   | Term | Definition |
   |---|---|
   | Transaction date |The date when the transaction happened.|
   | Description |Description of the transaction.|
   | Amount |The amount of transaction.|
   
   > [!NOTE]
   > If you don't see Azure credits in the payment methods page, either you don't have credits or you have not selected the right scope. Select the billing account which has credits or one of its billing profiles. To learn how to change scopes, see [Switch billing scopes in the Azure portal](view-all-accounts.md#switch-billing-scope-in-the-azure-portal).
   
   
   
   
1. If you are viewing Azure credits at the billing account scope and the billing account has more than one billing profiles, the Azure credits page will show a table with a summary of Azure credits for each billing profile. Select a billing profile from the list, select payment methods and then Azure credits to view details for a billing profile.

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

### Get list of credits

Make the following request, replacing `<billingProfileId>` with the `id` copied in the first step (```/providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx_xxxx-xx-xx/billingProfiles/PBFV-xxxx-xxx-xxx```).

```json
GET https://management.azure.com/providers/Microsoft.Billing/billingAccounts/<billingAccountId>/billingProfiles/<billingProfileId>/providers/Microsoft.Consumption/lots?api-version=2023-03-01
```
The API response returns original credit amounts and available balance across all credit lots for the billing profile. This includes active, expired, and credits with a future start date. Available balance can be computed by aggregating the values in `closedBalance` across all active credits.

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
| `creditCurrency` |The currency of the credit. |
| `billingCurrency`   |The currency used for billing.   |
| `originalAmount`      |The original amount of the credit in USD. |
| `originalAmountInBillingCurrency`      | The original amount of the credit in billing currency with exchange rate. |
| `expirationDate`  |The date when the credit expires.   |
| `closedBalance` |The balance as of the last invoice in USD. |
| `closedBalanceInBillingCurrency` |The balance as of the last invoice in billing currency with exchange rate. |
| `reseller` |Information about the reseller, if any. |
| `source` |The source of the credit, e.g., Azure promotional credit. |
| `startDate` |The date when the credit became active. |
| `expirationDate` |The date when the credit expires. |
| `poNumber`  |The purchase order number of the invoice on which the credit was billed.   |
| `isEstimatedBalance` |Indicates whether the balance is estimated. |

### Get transactions that affected credit balance

Make the following request, replacing `<billingProfileId>` with the `id` copied in the first step (```providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx_xxxx-xx-xx/billingProfiles/PBFV-xxxx-xxx-xxx```). You would need to pass a **startDate** and an **endDate** to get transactions for your required duration.

```json
GET https://management.azure.com/providers/Microsoft.Billing/billingAccounts/<billingAccountID>/billingProfiles/<billingProfileID>/providers/Microsoft.Consumption/events?api-version=2023-03-01&startDate=<date>&endDate=<date>
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

In a billing account for a Microsoft customer agreement, you use billing profiles to manage your invoices and payment methods. A monthly invoice is generated for each billing profile, and you use the payment methods to pay the invoice.

Credits that you acquire are assigned to a billing profile. When an invoice is generated for the billing profile, credits are automatically applied to the total charges to calculate the amount that you need to pay. You pay the remaining amount with your payment methods like check/ wire transfer or credit card.

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

