---
title: Track Azure credit balance for a Microsoft Customer Agreement
description: Learn how to check the Azure credit balance for a Microsoft Customer Agreement.
author: bandersmsft
manager: amberb
tags: billing
ms.service: billing
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/01/2019
ms.author: banders

---
# Track Microsoft Customer Agreement Azure credit balance

You can check the Azure credit balance for Microsoft Customer Agreement in the Azure portal. You use credits to pay for charges that are covered by the credits.

You are charged when you use products that aren't covered by the credits or your usage exceeds your credit balance. For more information, see [Products that aren't covered by Azure credits](#products-that-arent-covered-by-azure-credits).

This article applies to a billing account for a Microsoft Customer Agreement. [Check if you have access to a Microsoft Customer Agreement](#check-access-to-a-microsoft-customer-agreement).

## Check your credit balance in the Azure portal

1. Sign in to the [Azure portal]( https://portal.azure.com).

2. Search for **Cost Management + Billing**.

    ![Screenshot that shows search in portal for cost management + billing](./media/billing-mca-check-azure-credits-balance/billing-search-cost-management-billing.png)

3.  Select **Azure credits** from the left-hand side. Depending on your access, you may need to select a billing account or a billing profile and then select **Azure credits**.

4. The Azure credits page displays the following information:

   ![Screenshot of credit balance and transactions for a Billing profile](./media/billing-mca-check-azure-credits-balance/billing-mca-credits-overview.png)

   | Term               | Definition                           |
   |--------------------|--------------------------------------------------------|
   | Estimated balance  | Estimated amount of credits you have after considering all billed and pending transactions |
   | Current balance    | Amount of credits as of your last invoice. It doesn't include any pending transactions |
   | Transactions       | All billing transactions that affected your Azure credit balance |

   When your estimated balance drops to 0, you are charged for all your usage, including for products that are covered by credits.

6. Select **Credits list** to view list of credits for the billing profile. The credits list provides the following information:

   ![Screenshot of credits lists for a Billing profile](./media/billing-mca-check-azure-credits-balance/billing-mca-credits-list.png)

   | Term | Definition |
   |---|---|
   | Estimated balance | Amount of Azure credit you have after subtracting unbilled credit eligible charges from your current balance|
   | Current balance | Amount of Azure credit you have before considering unbilled credit eligible charges. It is calculated by adding new Azure credits you've received to the credit balance at the time of your last invoice|
   | Source | The acquisition source of the credit |
   | Start date | The date when you acquired the credit |
   | Expiration date | The date when the credit expires |
   | Balance | The balance as of your last invoice |
   | Original amount | The original amount of credit |
   | Status | The current status of credit. Status can be active, used, expired, or expiring |

## How credits are used

In a billing account for a Microsoft customer agreement, you use billing profiles to manage your invoices and payment methods. A monthly invoice is generated for each billing profile and you use the payment methods to pay the invoice.

Azure credits are one of the payment methods. You get credit from Microsoft like promotional credit and service level credit. These credits are assigned to a billing profile. When an invoice is generated for the billing profile, credits are automatically applied to the total billed amount to calculate the amount that you need to pay. You pay the remaining amount with another payment method like check or wire transfer.

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

## Check your credit balance through the API

### Prerequisites

You must have an owner, contributor, reader or invoice manager role on the billing profile for which you want to track Azure credit balance. To learn more about the roles for billing profiles, see [Billing profile roles and tasks](billing-understand-mca-roles.md#billing-profile-roles-and-tasks).

The examples shown below are for REST APIs. Support for powershell and CLIs is coming soon.

### Find billing profiles you have access to

```json
GET https://management.azure.com/providers/Microsoft.Billing/billingAccounts?$expand=billingProfiles&api-version=2019-10-01-preview
```

The API response returns all billing profiles you have access to.

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
            "id": "/providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx_xxxx-xx-xx/billingProfiles/XXXX-XXXX-XXX-XXX",
            "name": "XXXX-XXXX-XXX-XXX",
            "properties": {
              "address": {
                "addressLine1": "AddressLine1",
                "city": "City",
                "companyName": "CompanyName",
                "country": "Country",
                "postalCode": "XXXXX",
                "region": "Region"
              },
              "currency": "USD",
              "displayName": "Contoso profile",
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

Copy the `id` of the billing profile for which you want to check credit balance. For example, if you want to check credit balance for Contoso profile billing profile, you'd copy ```providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx_xxxx-xx-xx/billingProfiles/XXXX-XXXX-XXX-XXX```. Paste this value somewhere so that you can use it in the next step as `billingProfileId`.

### Get your Azure credits balance 

Make the following request, replacing `<billingProfileId>` with the `billingProfileId` copied from the first step (```providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx_xxxx-xx-xx/billingProfiles/XXXX-XXXX-XXX-XXX```). 

```json
GET https://management.azure.com/<billingProfileId>/providers/Microsoft.Consumption/credits/balanceSummary?api-version=2019-10-01
```

The API response returns estimated and current balance.

```json
{
  "id": "/providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx_xxxx-xx-xx/billingProfiles/XXXX-XXXX-XXX-XXX/providers/Microsoft.Consumption/credits/balanceSummary/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "name": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
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

| Element Name  | Description                                                                                               |
|---------------|-----------------------------------------------------------------------------------------------------------|
| `estimatedBalance` | The estimated amount of credits you have after considering all billed and pending transactions. |
| `currentBalance`   | The amount of credits as of your last invoice. It doesn't include any pending transactions.    |
| `pendingCreditAdjustments`      | The credit adjustments that are not yet invoiced.  |
| `expiredCredit`      |  The credits that expired but not yet considered in your invoice.  |
| `pendingEligibleCharges`  | The credit eligible charges that are not yet invoiced.   |

### Get list of credits


### Get transactions that affected your credit balance

Make the following request, replacing `<billingProfileId>` with the `billingProfileId` copied from the first step (```providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx_xxxx-xx-xx/billingProfiles/XXXX-XXXX-XXX-XXX```). You would need to pass a **startDate** and an **endDate** to get transactions for your required duration.

```json
GET https://management.azure.com/<billingProfileId>/providers/providers/Microsoft.Consumption/events?api-version=2019-10-01&startDate=2018-10-01T00:00:00.000Z&endDate=2019-10-11T12:00:00.000Z?api-version=2019-10-01
```
The API response returns all transactions that affected your credit balance.

```json
{
  "value": [
    {
      "id": "//providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx_xxxx-xx-xx/billingProfiles/XXXX-XXXX-XXX-XXX/providers/Microsoft.Consumption/events/e2032eb5-801b-19a8-ebcd-d09504afcdc7",
      "name": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
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
      "id": "/providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx_xxxx-xx-xx/billingProfiles/XXXX-XXXX-XXX-XXX/providers/Microsoft.Consumption/events/381efd80-2e5d-4f63-da32-49f94d656df6",
      "name": "381efd80-2e5d-4f63-da32-49f94d656df6",
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
| Element Name  | Description                                                                                               |
|---------------|-----------------------------------------------------------------------------------------------------------|
| `transactionDate` | The date when the transaction took place. |
| `adjustments`   | For refund or rebill transactions, the credit adjustments for the transaction.    |
| `creditExpired`      | The amount of credit that expired. |
| `charges`      |  The charges for the transaction.  |
| `closedBalance`  | The balance after the transaction.   |
| `eventType`  | The type of transaction.   |
| `invoiceNumber`  | The number of invoice on which the transaction is billed. it will be empty for pending transaction.   |

<!--Todo - Add link to the swagger  -->

## Check access to a Microsoft Customer Agreement
[!INCLUDE [billing-check-mca](../../includes/billing-check-mca.md)]

## Need help? Contact support.

If you need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.

## Next steps

- [Understand billing account for Microsoft Customer Agreement](billing-mca-overview.md)
- [Understand terms on your Microsoft Customer Agreement invoice](billing-mca-understand-your-invoice.md)
