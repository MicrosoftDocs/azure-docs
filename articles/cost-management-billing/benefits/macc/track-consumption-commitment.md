---
title: Track Your Microsoft Azure Consumption Commitment (MACC)
description: Learn how to track your Microsoft Azure Consumption Commitment (MACC) for a Microsoft Customer Agreement.
author: shrutis06
ms.reviewer: shrshett
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 03/03/2026
ms.author: shrshett
ms.custom: sfi-image-nochange
---

# Track your Microsoft Azure Consumption Commitment (MACC)

A Microsoft Azure Consumption Commitment (MACC) is a contractual agreement in which your organization commits to a specified level of Azure spending over a defined period. If your organization has a MACC associated with a Microsoft Customer Agreement or Enterprise Agreement billing account, you can track key details through the Azure portal or REST APIs. These details include start and end dates, remaining balance, and eligible spending.

MACC functionality in the Azure portal is available only to direct Microsoft Customer Agreement and direct Enterprise Agreement customers. A direct agreement is one signed directly between Microsoft and the customer, whereas an indirect agreement involves a customer signing through a Microsoft partner.

## Prerequisites

- If you have an Enterprise Agreement, you must have the Enterprise Administrator role to view the MACC balance.
- If you have a Microsoft Customer Agreement, you must have the Owner, Contributor, or Reader role on the billing account to view the MACC balance.

## Actions for tracking your MACC

### [Azure portal](#tab/portal)

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box, enter **cost management + billing**.

3. Under **Services**, select **Cost Management + Billing**.

    :::image type="content" source="../../manage/media/track-consumption-commitment/billing-search-cost-management-billing.png" alt-text="Screenshot that shows a search for Cost Management + Billing in the portal." lightbox="../../manage/media/track-consumption-commitment/billing-search-cost-management-billing.png" :::

4. On the **Billing scopes** pane, select the billing account for which you want to track the commitment. The billing account type must be **Microsoft Customer Agreement** or **Enterprise Agreement**, depending on your agreement type.

    :::image type="content" source="../../manage/media/track-consumption-commitment/list-of-scopes.png" alt-text="Screenshot that shows billing scopes." lightbox="../../manage/media/track-consumption-commitment/list-of-scopes.png" :::

    > [!NOTE]
    > The Azure portal remembers the last billing scope that you access and displays the scope the next time you open the list of billing scopes. You don't see the **Billing scopes** pane if you visited **Cost Management + Billing** earlier. If so, check that you're in the [right scope](#steps-for-checking-access-to-a-microsoft-customer-agreement). If not, [switch the scope](../../manage/view-all-accounts.md#switch-billing-scope-in-the-azure-portal) to select the billing account for a Microsoft Customer Agreement.

5. Depending on your agreement type, take one of the following steps:

    - For a Microsoft Customer Agreement, select **Benefits** on the left pane, and then select the **Microsoft Azure Consumption Commitment (MACC)** tile.  

      :::image type="content" source="../../manage/media/conditional-credit-offer/benefits-page.png" alt-text="Screenshot that shows billing benefits for a Microsoft Customer Agreement, including the Microsoft Azure Consumption Commitment tile." lightbox="../../manage/media/conditional-credit-offer/benefits-page.png" :::

    - For an Enterprise Agreement, select **Credits + Commitments** on the left pane, and then select **Microsoft Azure Consumption Commitment (MACC)**.  

      :::image type="content" source="../../manage/media/track-consumption-commitment/select-macc-tab-ea.png" alt-text="Screenshot that shows selecting the Microsoft Azure Consumption Commitment tab for an Enterprise Agreement." lightbox="../../manage/media/track-consumption-commitment/select-macc-tab-ea.png" :::

The **Microsoft Azure Consumption Commitment (MACC)** tab has the following sections.

#### Remaining commitment

The **Remaining commitment** section displays the remaining commitment amount since your last invoice.

:::image type="content" source="../../manage/media/track-consumption-commitment/macc-remaining-commitment.png" alt-text="Screenshot of remaining commitment for a Microsoft Azure Consumption Commitment." lightbox="../../manage/media/track-consumption-commitment/macc-remaining-commitment.png" :::

#### Details

The **Details** section displays other important aspects of your commitment.

:::image type="content" source="../../manage/media/track-consumption-commitment/macc-details.png" alt-text="Screenshot of Microsoft Azure Consumption Commitment details." lightbox="../../manage/media/track-consumption-commitment/macc-details.png" :::

| Term | Definition |
| --- | --- |
| **ID** | Identifier that uniquely identifies your MACC. It's used to get your MACC information through REST APIs. |
| **Purchase date** | Date when you made the commitment. |
| **Start date** | Date when the commitment became effective. |
| **End date** | Date when the commitment expired. |
| **Commitment amount** | Amount that you commit to spending on MACC-eligible products and services. |
| **Status** | Status of your commitment. |

Your MACC can have one of the following statuses:

- **Active**. The MACC is currently in effect. Eligible Azure spending contributes toward fulfilling your commitment.
- **Complete**. You fully met the MACC amount. No further action is required.
- **Expired**. The MACC end date passed without the commitment being fully met. Contact your Microsoft account team for more information.
- **Canceled**. The MACC was terminated before the end date. New Azure spending doesn't contribute toward your MACC. Contact your Microsoft account team for more information.

#### Events

The **Events** section displays events (invoiced spending) that decremented your MACC.

:::image type="content" source="../../manage/media/track-consumption-commitment/macc-events.png" alt-text="Screenshot of Microsoft Azure Consumption Commitment events." lightbox="../../manage/media/track-consumption-commitment/macc-events.png" :::

| Term | Definition |
| --- | --- |
| **Date** | Date when the event happened. |
| **Description** | Description of the event. |
| **Billing profile** | Billing profile for which the event happened. The billing profile applies only to Microsoft Customer Agreements. If you have an Enterprise Agreement enrollment, the billing profile doesn't appear. |
| **MACC decrement** | Amount of MACC decrement from the event. |
| **Remaining commitment** | Remaining MACC after the event. |

### [REST API](#tab/rest)

You can use the [Azure Billing](/rest/api/billing/) and [Consumption](/rest/api/consumption/) APIs to programmatically get MACC information for your billing account.

The following examples use REST APIs. Currently, PowerShell and the Azure CLI aren't supported. The response example is for Microsoft Customer Agreements. The response for Enterprise Agreements differs.

### Find billing accounts that you can access

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

Use the `displayName` property of the billing account to identify the billing account for which you want to track MACC. Copy the `name` value of the billing account. For example, if you want to track MACC for the `Contoso` billing account, copy `9a157b81-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx_xxxx-xx-xx`. Paste this value somewhere so that you can use it in the next step.

### Get a list of MACCs

Make the following request. Replace `<billingAccountName>` with the `name` value that you copied (`9a157b81-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx_xxxx-xx-xx`).

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

| Element name | Description |
| ------------ | ----------- |
| `purchasedDate` | Date when you purchased the MACC. |
| `status` | Status of your commitment. |
| `originalAmount` | Original commitment amount. |
| `closedBalance` | Remaining commitment since the last invoice. |
| `source` | Agreement source. For MACC, the source is always `ConsumptionCommitment`. |
| `startDate` | Date when the MACC became active. |
| `expirationDate` | Date when the MACC expires. |

Your MACC can have one of the following statuses:

- `Active`. The MACC is currently in effect. Eligible Azure spending contributes toward fulfilling your commitment.
- `Complete`. You fully met the MACC amount. No further action is required.
- `Expired`. The MACC end date passed without the commitment being fully met. Contact your Microsoft account team for more information.
- `Canceled`. The MACC was terminated before the end date. New Azure spending doesn't contribute toward your MACC. Contact your Microsoft account team for more information.

### Get events that affected a MACC

Make the following request. Replace `<billingAccountName>` with the `name` value that you copied earlier (`5e98e158-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx_xxxx-xx-xx`). You need to pass a `startDate` value and an `endDate` value to get events for your required duration.

```json
GET https://management.azure.com/providers/Microsoft.Billing/billingAccounts/<billingAccountName>/providers/Microsoft.Consumption/events?api-version=2021-05-01&startDate=<startDate>&endDate=<endDate>&$filter=lotsource%20eq%20%27ConsumptionCommitment%27
```

The API response returns all events that affected your MACC.

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

| Element name | Description |
| ------------ | ----------- |
| `billingProfileId` | Unique identifier for the billing profile for which the event happened. |
| `billingProfileDisplayName` | Display name for the billing profile for which the event happened. |
| `lotId` | Unique identifier for the MACC. |
| `lotSource` | Lot source for the agreement. The value is `ConsumptionCommitment` for MACC. |
| `transactionDate` | Date when the event occurred. |
| `description` | Description of the event. |
| `charges` | MACC decrement amount. |
| `closedBalance` | Remaining balance after the event. |
| `eventType` | Type of event. Only `SettledCharges` events are supported for MACC. |
| `invoiceNumber` | Unique ID of the invoice whose charges decremented the MACC. |

---

## MACC milestones

Milestones are predefined financial targets within the MACC framework that you must meet within a specific timeframe. They help track progress against your MACC and include both a due date and a milestone commitment amount.

Not every MACC includes milestones. If your MACC has milestones configured, they appear in the Azure portal when you select an event.

:::image type="content" source="../../manage/media/track-consumption-commitment/macc-main-page-milestones.png" alt-text="Screenshot that shows Microsoft Azure Consumption Commitment events." lightbox="../../manage/media/track-consumption-commitment/macc-main-page-milestones.png" :::

:::image type="content" source="../../manage/media/track-consumption-commitment/macc-milestones-page.png" alt-text="Screenshot that shows Microsoft Azure Consumption Commitment milestones." lightbox="../../manage/media/track-consumption-commitment/macc-milestones-page.png" :::

Here are key points about MACC milestones:

- **Missed milestone**. If you don't meet a milestone by its due date, a shortfall charge is applied to your account to fulfill the milestone commitment. The charge takes the form of an Azure prepayment credit.

- **Missed MACC**. If you don't meet the total MACC amount by the MACC end date, a shortfall charge is applied to your account for the remaining balance. The charge takes the form of an Azure prepayment credit.

> [!IMPORTANT]
> Consumption charges covered by shortfall credits don't accrue toward your MACC. For more information, see [Azure credits and MACC](#azure-credits-and-macc) later in this article.

## MACC shortfalls and alerts

Microsoft emails billing account admins to help you meet MACCs and milestones on time. These alerts give advance notice so you can act before getting shortfall charges.

### MACC expiry alerts

If you don't meet your MACC target, billing account admins get email notifications at the following intervals:

- 90 days before commitment expiry
- 60 days before commitment expiry
- 30 days before commitment expiry

### Milestone alerts

If your MACC includes milestones and you don't meet a milestone target, billing account admins get email alerts at the following intervals:

- 90 days before milestone end date
- 60 days before milestone end date
- 30 days before milestone end date

### Shortfall charges

If you don't meet the MACC or the milestone target by the end date, an email alert notifies you about a shortfall charge for the remaining balance. This shortfall charge is an Azure prepayment credit that's applied to your account to fulfill your remaining commitment.

## Azure services and Marketplace offers that are eligible for MACC

You can determine which Azure services and Microsoft Marketplace offers are eligible for MACC decrement in the Azure portal. See [Azure Consumption Commitment benefit](/marketplace/azure-consumption-commitment-benefit).

## Azure credits and MACC

If your organization receives Azure credits from Microsoft, consumption or purchases that those credits cover don't contribute to your MACC.

If your organization purchased Azure prepayment, consumption or purchases that the prepayment covers don't contribute to your MACC. However, the Azure prepayment purchase itself decrements your MACC.

### Example

Contoso makes a MACC of $50,000 in May. In June, it purchases an Azure prepayment of $10,000. This purchase decrements the MACC, leaving a remaining balance of $40,000.

During June, Contoso consumes $10,000 of Azure prepayment-eligible services. These service charges are covered by the Azure prepayment and don't decrement the MACC. After Contoso fully uses the Azure prepayment, all Azure service consumption and other eligible purchases decrement the MACC.

## Steps for checking access to a Microsoft Customer Agreement

[!INCLUDE [billing-check-mca](../../../../includes/billing-check-mca.md)]

## Support

If you need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.

## Related content

- [Determine which offers are eligible for MACC](/marketplace/azure-consumption-commitment-benefit)
- [Track your Azure credit balance](../credits/mca-check-azure-credits-balance.md)
