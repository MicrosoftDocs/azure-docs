---
title: Track your Microsoft Azure Consumption Commitment (MACC)
description: Learn how to track your Microsoft Azure Consumption Commitment (MACC) for a Microsoft Customer Agreement.
author: shrutis06
ms.reviewer: shrshett
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 01/20/2025
ms.author: shrshett
ms.custom: sfi-image-nochange
---

# Track your Microsoft Azure Consumption Commitment (MACC)

A Microsoft Azure Consumption Commitment (MACC) is a contractual agreement in which your organization commits to a specified level of Azure spending over a defined period. If your organization has a MACC associated with a Microsoft Customer Agreement (MCA) or Enterprise Agreement (EA) billing account, you can track key details—including start and end dates, remaining balance, and eligible spend—through the Azure portal or REST APIs.

MACC functionality in the Azure portal is available only to direct MCA and direct EA customers. A direct agreement is one signed directly between Microsoft and the customer, whereas an indirect agreement involves a customer signing through a Microsoft partner.


## Prerequisites

- **Enterprise Agreement (EA):** The user must have the Enterprise Administrator role to view the MACC balance.
- **Microsoft Customer Agreement (MCA):** The user must have the Owner, Contributor, or Reader role on the billing account to view the MACC balance.


## Track your MACC Commitment

### [Azure portal](#tab/portal)

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Search for **Cost Management + Billing**.  
    :::image type="content" source="./media/track-consumption-commitment/billing-search-cost-management-billing.png" alt-text="Screenshot showing search in portal for Cost Management + Billing." lightbox="./media/track-consumption-commitment/billing-search-cost-management-billing.png" :::
3. In the billing scopes page, select the billing account for which you want to track the commitment. The billing account type must be **Microsoft Customer Agreement** for Microsoft Customer Agreement (MCA) customers or **Enterprise Agreement** for EA customers.   
    :::image type="content" source="./media/track-consumption-commitment/list-of-scopes.png" alt-text="Screenshot that shows Billing Scopes." lightbox="./media/track-consumption-commitment/list-of-scopes.png" :::
    > [!NOTE]
     > Azure portal remembers the last billing scope that you access and displays the scope the next time you come to Cost Management + Billing page. You don't see the billing scopes page if you visited Cost Management + Billing earlier. If so, check that you are in the [right scope](#check-access-to-a-microsoft-customer-agreement). If not, [switch the scope](view-all-accounts.md#switch-billing-scope-in-the-azure-portal) to select the billing account for a Microsoft Customer Agreement.
4. Depending on your agreement type, do one of the following steps:
    - For MCA customers, select **Properties** from the left-hand side and then select **Microsoft Azure Consumption Commitment (MACC)**.  
        :::image type="content" source="./media/track-consumption-commitment/select-macc-tab.png" alt-text="Screenshot that shows selecting the MACC tab for MCA." lightbox="./media/track-consumption-commitment/select-macc-tab.png" :::
    - For EA customers, select **Credits + Commitments** in the left navigation menu, then select **Microsoft Azure Consumption Commitment (MACC)**.  
        :::image type="content" source="./media/track-consumption-commitment/select-macc-tab-ea.png" alt-text="Screenshot that shows selecting the MACC tab for EA." lightbox="./media/track-consumption-commitment/select-macc-tab-ea.png" :::
1. The Microsoft Azure Consumption Commitment (MACC) tab has the following sections.

#### Remaining commitment 

The remaining commitment displays the remaining commitment amount since your last invoice.

:::image type="content" source="./media/track-consumption-commitment/macc-remaining-commitment.png" alt-text="Screenshot of remaining commitment for a MACC." lightbox="./media/track-consumption-commitment/macc-remaining-commitment.png" :::

#### Details

The Details section displays other important aspects of your commitment.

:::image type="content" source="./media/track-consumption-commitment/macc-details.png" alt-text="Screenshot of MACC details." lightbox="./media/track-consumption-commitment/macc-details.png" :::

| Term | Definition |
|---|---|
| ID | An identifier that uniquely identifies your MACC. This identifier is used to get your MACC information through REST APIs. |
| Purchase date | The date when you made the commitment. |
| Start date | The date when the commitment became effective. |
| End date | The date when the commitment expired. |
| Commitment amount | The amount you commit to spend on MACC-eligible products/services. |
| Status | The status of your commitment. |

Your MACC can have one of the following statuses:

- **Active:** The MACC is currently in effect. Eligible Azure spend contributes toward fulfilling your commitment.
- **Completed:** The MACC commitment amount is fully met. No further action is required.
- **Expired:** The MACC end date passes without the commitment being fully met. Contact your Microsoft Account team for more information.
- **Canceled:** The MACC is terminated before the end date. New Azure spend does not contribute toward your MACC commitment. Contact your Microsoft Account team for more information.

#### Events

The Events section displays events (invoiced spend) that decremented your MACC commitment.

:::image type="content" source="./media/track-consumption-commitment/macc-events.png" alt-text="Screenshot of MACC events." lightbox="./media/track-consumption-commitment/macc-events.png" :::

| Term | Definition |
|---|---|
| Date | The date when the event happened |
| Description | A description of the event |
| Billing profile | The billing profile for which the event happened. The billing profile only applies to Microsoft Customer Agreements. If you have an EA enrollment, the Billing Profile isn't shown. |
| MACC decrement | The amount of MACC decrement from the event |
| Remaining commitment | The remaining MACC commitment after the event |

### [REST API](#tab/rest)

You can use the [Azure Billing](/rest/api/billing/) and the [Consumption](/rest/api/consumption/) APIs to programmatically get Microsoft Azure Consumption Commitment (MACC) for your billing account.

The following examples use REST APIs. Currently, PowerShell and Azure CLI aren't supported. The response sample provided is for Microsoft Customer Agreements; response for Enterprise Agreements differs.

### Find billing accounts you have access to

```json
GET https://management.azure.com/providers/Microsoft.Billing/billingAccounts?api-version=2020-05-01
```
The API response returns a list of billing accounts.

```json
{
  "value": [
    {
      "id": "/providers/Microsoft.Billing/billingAccounts/9a157b81-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx_xxxx-xx-xx",
      "name": "9a157b81-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx_xxxx-xx-xx",
      "type": "Microsoft.Billing/billingAccounts",
      "properties": {
        "displayName": "Contoso",
        "agreementType": "MicrosoftCustomerAgreement",
        "accountStatus": "Active",
        "accountType": "Enterprise",
        "hasReadAccess": true,
      }
    },
    {
      "id": "/providers/Microsoft.Billing/billingAccounts/9a12f056-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx_xxxx-xx-xx",
      "name": "9a12f056-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx_xxxx-xx-xx",
      "type": "Microsoft.Billing/billingAccounts",
      "properties": {
        "displayName": "Kayla Lewis",
        "agreementType": "MicrosoftCustomerAgreement",
        "accountStatus": "Active",
        "accountType": "Individual",
        "hasReadAccess": true,
      }
    }
  ]
}
```

Use the `displayName` property of the billing account to identify the billing account for which you want to track MACC. Copy the `name` of the billing account. For example, if you want to track MACC for **Contoso** billing account, you'd copy `9a157b81-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx_xxxx-xx-xx`. Paste this value somewhere so that you can use it in the next step.

### Get a list of Microsoft Azure Consumption Commitments

Make the following request, replacing `<billingAccountName>` with the `name` copied in the first step (`9a157b81-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx_xxxx-xx-xx`).

```json
GET https://management.azure.com/providers/Microsoft.Billing/billingAccounts/<billingAccountName>/providers/Microsoft.Consumption/lots?api-version=2021-05-01&$filter=source%20eq%20%27ConsumptionCommitment%27
```
The API response returns lists of MACCs for your billing account.

```json
    {
    "value": [
      {
        "id": "/providers/Microsoft.Billing/billingAccounts/9a157b81-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx_xxxx-xx-xx/providers/Microsoft.Consumption/lots/G2021032459206000XXXX",
        "name": "G2021032459206000XXXX",
        "type": "Microsoft.Consumption/lots",
        "eTag": null,
        "properties": {
          "purchasedDate": "2021-03-24T16:26:46.0000000Z",
          "status": "Active",
          "originalAmount": {
            "currency": "USD",
            "value": 10000.0
          },
          "closedBalance": {
            "currency": "USD",
            "value": 9899.42
          },
          "source": "ConsumptionCommitment",
          "startDate": "2021-03-01T00:00:00.0000000Z",
          "expirationDate": "2024-02-28T00:00:00.0000000Z"
        }
      },
      {
        "id": "/providers/Microsoft.Billing/billingAccounts/9a157b81-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx_xxxx-xx-xx/providers/Microsoft.Consumption/lots/G1011082459206000XXXX",
        "name": "G1011082459206000XXXX",
        "type": "Microsoft.Consumption/lots",
        "eTag": null,
        "properties": {
          "purchasedDate": "2021-03-24T16:26:46.0000000Z",
          "status": "Complete",
          "originalAmount": {
            "currency": "USD",
            "value": 10000.0
          },
          "closedBalance": {
            "currency": "USD",
            "value": 0.00
          },
          "source": "ConsumptionCommitment",
          "startDate": "2020-03-01T00:00:00.0000000Z",
          "expirationDate": "2021-02-28T00:00:00.0000000Z"
        }
      }
    ]
  }
```

| Element name  | Description                                                                                               |
|---------------|-----------------------------------------------------------------------------------------------------------|
| `purchasedDate`  | The date when the MACC was purchased.   |
| `status`  | The status of your commitment. |
| `originalAmount` | The original commitment amount. |
| `closedBalance`   | The remaining commitment since the last invoice.    |
| `source`      | For MACC, the source is always ConsumptionCommitment. |
| `startDate`      |  The date when the MACC became active.  |
| `expirationDate`  | The date when the MACC expires.   |

Your MACC can have one of the following statuses:

- **Active:** The MACC is currently in effect. Eligible Azure spend contributes toward fulfilling your commitment.
- **Completed:** The MACC commitment amount is fully met. No further action is required.
- **Expired:** The MACC end date passes without the commitment being fully met. Contact your Microsoft Account team for more information.
- **Canceled:** The MACC is terminated before the end date. New Azure spend doesn't contribute toward your MACC commitment. Contact your Microsoft Account team for more information.


### Get events that affected MACC commitment

Make the following request, replacing `<billingAccountName>` with the `name` copied in the first step (`5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx_xxxx-xx-xx`). You would need to pass a **startDate** and an **endDate** to get events for your required duration.

```json
GET https://management.azure.com/providers/Microsoft.Billing/billingAccounts/<billingAccountName>/providers/Microsoft.Consumption/events?api-version=2021-05-01&startDate=<startDate>&endDate=<endDate>&$filter=lotsource%20eq%20%27ConsumptionCommitment%27
```

The API response returns all events that affected your MACC commitment.

```json
{
  "value": [
    {
      "id": "/providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx_xxxx-xx-xx/providers/Microsoft.Consumption/events/103axxxx-2c25-7xx3-f2a0-ad9a3f1c91xx",
      "name": "103axxxx-2c25-7xx3-f2a0-ad9a3f1c91xx",
      "type": "Microsoft.Consumption/events",
      "eTag": null,
      "properties": {
        "billingProfileId": "/providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx_xxxx-xx-xx/billingProfiles/SWFF-DVM4-XXX-XXX",
        "billingProfileDisplayName": "Finance",
        "lotId": "/providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx_xxxx-xx-xx/providers/Microsoft.Consumption/lots/G2021032459206000XXXX",
        "lotSource": "ConsumptionCommitment",
        "transactionDate": "2021-05-05T00:09:13.0000000Z",
        "description": "Balance after invoice T00075XXXX",
        "charges": {
          "currency": "USD",
          "value": -100.0
        },
        "closedBalance": {
          "currency": "USD",
          "value": 9899.71
        },
        "eventType": "SettledCharges",
        "invoiceNumber": "T00075XXXX"
      }
    },
    {
      "id": "/providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx_xxxx-xx-xx/providers/Microsoft.Consumption/events/203axxxx-2c25-7xx3-f2a0-ad9a3f1c91xx",
      "name": "203axxxx-2c25-7xx3-f2a0-ad9a3f1c91xx",
      "type": "Microsoft.Consumption/events",
      "eTag": null,
      "properties": {
        "billingProfileId": "/providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx_xxxx-xx-xx/billingProfiles/SWFF-DVM4-XXX-XXX",
        "billingProfileDisplayName": "Engineering",
        "lotId": "/providers/Microsoft.Billing/billingAccounts/5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx_xxxx-xx-xx/providers/Microsoft.Consumption/lots/G2021032459206000XXXX",
        "lotSource": "ConsumptionCommitment",
        "transactionDate": "2021-04-05T00:09:13.0000000Z",
        "description": "Balance after invoice T00074XXXX",
        "charges": {
          "currency": "USD",
          "value": -0.29
        },
        "closedBalance": {
          "currency": "USD",
          "value": 9999.71
        },
        "eventType": "SettledCharges",
        "invoiceNumber": "T00074XXXX"
      }
    }
  ]
}

```
| Element name  | Description                                                                                               |
|---------------|-----------------------------------------------------------------------------------------------------------|
| `billingProfileId` | The unique identifier for the billing profile for which the event happened. |
| `billingProfileDisplayName` | The display name for the billing profile for which the event happened. |
| `lotId`   | The unique identifier for the MACC.    |
| `lotSource`      | Value is ConsumptionCommitment for MACC. |
| `transactionDate`      |  The date when the event occurred.  |
| `description`  | Description of the event.   |
| `charges`  | The MACC decrement amount.   |
| `closedBalance`  | The remaining balance after the event.   |
| `eventType`  | Only SettledCharges events are supported for MACC.   |
| `invoiceNumber`  | The unique ID of the invoice whose charges decremented the MACC.   |

---
## MACC Milestones

Milestones are predefined financial targets within the MACC framework that must be met within a specific timeframe. They help track progress against your MACC commitment and include both a due date and a milestone commitment amount.

> [!NOTE]
> Not every MACC includes milestones. If your MACC has milestones configured, you can see them in the Azure portal.

:::image type="content" source="./media/track-consumption-commitment/macc-main-page-milestones.png" alt-text="Screenshot that shows MACC page with milestones." lightbox="./media/track-consumption-commitment/macc-main-page-milestones.png" :::

:::image type="content" source="./media/track-consumption-commitment/macc-milestones-page.png" alt-text="Screenshot that shows MACC milestones details." lightbox="./media/track-consumption-commitment/macc-milestones-page.png" :::


**Key points about MACC milestones:**

- **Missed milestone:** If a milestone isn't met by its due date, a shortfall charge in the form of Azure prepayment credit is applied to your account to fulfill the milestone commitment.

- **Missed MACC commitment:** If the total MACC commitment amount isn't met by the MACC end date, a shortfall charge in the form of Azure prepayment credit is applied to your account for the remaining balance.

> [!IMPORTANT]
> Consumption charges covered by shortfall credits don't accrue toward your MACC. For more information, see [Azure credits and MACC](#azure-credits-and-macc).

---

## MACC Shortfall and Alerts

Microsoft emails Billing Account Admins to help meet MACC commitments and milestones on time. These alerts give advance notice so you can act before getting shortfall charges.

### MACC expiry alerts

If your MACC target isn't met, email notifications go to Billing Account Admins at the following intervals before the MACC end date:

- 90 days before expiry
- 60 days before expiry
- 30 days before expiry

### Milestone alerts

If your MACC includes milestones, email alerts go to Billing Account Admins at the following intervals before each milestone end date if the milestone target isn't met:

- 90 days before milestone end date
- 60 days before milestone end date
- 30 days before milestone end date

### Shortfall charges

If the MACC or MACC milestone target isn't met by the end date, an email alert is sent notifying you that a shortfall charge for the remaining balance is applied. This shortfall charge is an Azure prepayment credit that is applied to your account to fulfill your remaining commitment.

---

## Azure Services and Marketplace offers that are eligible for MACC

You can determine which Azure services and Marketplace offers are eligible for MACC decrement in the Azure portal. For more information, see [Determine which offers are eligible for Azure consumption commitments (MACC/CtC)](/marketplace/azure-consumption-commitment-benefit#determine-which-offers-are-eligible-for-azure-consumption-commitments-maccctc).

## Azure credits and MACC

If your organization receives Azure credits from Microsoft, consumption or purchases covered by those credits don't contribute toward your MACC commitment.

If your organization purchased Azure Prepayment, consumption or purchases covered by the prepayment don't contribute toward your MACC commitment. However, the Azure Prepayment purchase itself decrements your MACC commitment.

**Example:** Contoso makes a MACC commitment of $50,000 in May. In June, they purchase an Azure Prepayment of $10,000. This purchase decrements their MACC commitment, leaving a remaining balance of $40,000. During June, Contoso consumes $10,000 of Azure Prepayment-eligible services. These service charges are covered by their Azure Prepayment and don't decrement their MACC commitment. Once the Azure Prepayment is fully used, all Azure service consumption and other eligible purchases decrement their MACC commitment.


## Check access to a Microsoft Customer Agreement
[!INCLUDE [billing-check-mca](../../../includes/billing-check-mca.md)]

## Need help? Contact support.

If you need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.

## Next steps

- [Determine which offers are eligible for Azure consumption commitments (MACC/CTC)](/marketplace/azure-consumption-commitment-benefit#determine-which-offers-are-eligible-for-azure-consumption-commitments-maccctc)
- [Track your Azure credits balance](mca-check-azure-credits-balance.md)
