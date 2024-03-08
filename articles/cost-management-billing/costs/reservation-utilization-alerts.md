---
title: Reservation utilization alerts
description: This article helps you set up and use reservation utilization alerts.
author: bandersmsft
ms.author: banders
ms.date: 08/30/2023
ms.topic: how-to
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: jojoh
---

# Reservation utilization alerts

This article helps you set up and use reservation utilization alerts. The alerts are email notifications that you receive when reservations have low utilization. [Azure reservations](../reservations/save-compute-costs-reservations.md) can provide cost savings by committing to one-year or three-year plans. However, it's possible for reservations to go unutilized or underutilized, resulting in financial losses. If you have [Azure RBAC](../reservations/reservation-utilization.md#view-utilization-in-the-azure-portal-with-azure-rbac-access) permissions on the reservations or if you're a [billing administrator](../reservations/reservation-utilization.md#view-utilization-as-billing-administrator), you can [review](../reservations/reservation-utilization.md) the utilization percentage of your reservation purchases in the Azure portal. With reservation utilization alerts, you can promptly take remedial actions to ensure optimal utilization of your reservation purchases.

## Reservations that you can monitor

The reservation utilization alert is used to monitor the utilization of most categories of reservations. However, utilization alerts don't support prepurchase plans, including [Databricks](../reservations/prepay-databricks-reserved-capacity.md) and [Synapse Analytics - Pre-Purchase](../reservations/synapse-analytics-pre-purchase-plan.md).

## Supported scopes and required permissions

You can create a reservation utilization alert rule at any of the following scopes provided you have adequate permissions. For example, if you're an enterprise admin within an enterprise agreement, the alert rule should be created at the enrollment scope. It's important to note that this alert monitors all reservations available within the enrollment, regardless of their benefit scope. Scopes include single resource group, single subscription, management group, or shared.

| Supported agreement | Alert rule scope | Required role | Supported actions |
| --- | --- | --- | --- |
| Enterprise Agreement | Billing account | Enterprise admin, enterprise read only| Create, read, update, delete |
|• Microsoft Customer Agreement (MCA) in the Enterprise motion where you buy Azure services through a Microsoft representative. Also called an MCA enterprise agreement.<br><br>• Microsoft Customer Agreement (MCA) that you bought through the Azure website. Also called an MCA individual agreement. | Billing profile |Billing profile owner, billing profile contributor, billing profile reader, and invoice manager | Create, read, update, delete|
| Microsoft Partner Agreement (MPA) | Customer scope | Global admin, admin agent | Create, read, update, delete |

For more information, see [scopes and roles](understand-work-scopes.md).

## Manage an alert rule

To create a reservation utilization alert rule:

1. Sign into the Azure portal at <https://portal.azure.com>
1. Navigate to **Cost Management + Billing** and choose the appropriate billing scope based on your Azure contract.
1. In the **Cost Management** section, select **Cost alerts**.
1. Select **+ Add** and then on the Create alert rule page in the **Alert type** list, select **Reservation utilization**.
1. Fill out the form and then select **Create**. After you create the alert rule, you can view it from **Alert rules**.  
    :::image type="content" source="./media/reservation-utilization-alerts/create-alert-rule.png" alt-text="Screenshot showing Create alert rule." lightbox="./media/reservation-utilization-alerts/create-alert-rule.png" :::
1. To view, edit, or delete an alert rule, on the Cost alerts page, select **Alert rules**.  
    :::image type="content" source="./media/reservation-utilization-alerts/alert-rules.png" alt-text="Screenshot showing the list of Alert rules." lightbox="./media/reservation-utilization-alerts/alert-rules.png" :::

The following table explains the fields in the alert rule form.

| Field | Optional/mandatory | Definition | Sample input |
| --- | --- | --- | --- |
| Alert type|Mandatory | The type of alert that you want to create. | Reservation utilization |
| Services | Optional | Select if you want to filter the alert rule for any specific reservation type. **Note**: If you haven’t applied a filter, then the alert rule monitors all available services by default. |Virtual machine, SQL Database, and so on. |
| Reservations | Optional | Select if you want to filter the alert rule for any specific reservations. **Note**: If you haven’t  applied a filter, then the alert rule monitors all available reservations by default. | Contoso\_Sub\_alias-SQL\_Server\_Standard\_Edition. |
| Utilization percentage | Mandatory | When any of the reservations have a utilization that is less than the target percentage, then the alert notification is sent. | Utilization is less than 95% |
| Time grain | Mandatory | Choose the time over which reservation utilization value should be averaged. For example, if you choose Last 7-days, then the alert rule evaluates the last 7-day average reservation  utilization of all reservations. **Note**: Last day reservation utilization is subject to change because the usage data refreshes. So, Cost Management relies on the last 7-day or 30-day averaged utilization, which is more accurate. | Last 7-days, Last 30-days|
| Start on | Mandatory | The start date for the alert rule. | Current or any future date |
| Sent | Mandatory | Choose the rate at which consecutive alert notifications are sent. For example, assume that you chose the weekly option. If you receive your first alert notification on 2 May, then the next possible notification is sent a week later, which is 9 May. **Note**: The `Sent` and `Time grain` fields in the alert rule form are independent of each other. You can set them according to your needs. | Daily – If you want everyday notification.<br><br>Weekly – If you want the notifications to be a week apart.<br><br> Monthly – If you want the notifications to be a month apart.|
| Until | Mandatory | The end date for the alert rule. | The end date can be anywhere from one day to three years from the current date or the start date, whichever comes first. For example, if you create an alert on 3 March 2023, the end date can be any date from 4 March 2023, to 3 March 2026. |
| Recipients | Mandatory | You can enter up to 20 email IDs including distribution lists as alert recipients. | admin@contoso.com |
| Language | Mandatory | The language to be used in the alert email body | Any language supported by the Azure portal |
| Alert name | Mandatory | A unique name for your alert rule. Alert rule names must only include alphanumeric characters, underscore, or hyphen. | Sample\_RUalert\_3-3-23 |

## Information included in the alert email

The notification email for the reservation utilization alert provides essential information to investigate reservations with low utilization. It includes details such as:

- Alert rule name
- Creator
- Target utilization percentage
- Time grain (the period over which utilization was averaged)
- Alert rule scope
- Number of reservations evaluated
- Count of reservations with low utilization
- A list of the top five reservations from the list
- A hyperlink to review all the reservations in the Azure portal
- Timestamp indicating when the alert email was generated

For reference, here’s an example alert email.

:::image type="content" source="./media/reservation-utilization-alerts/sample-email.png" alt-text="Screenshot showing example email alert." lightbox="./media/reservation-utilization-alerts/sample-email.png" :::

## Partner experience

Microsoft partners that have a Microsoft Partner Agreement can create reservation utilization alerts to monitor their customers’ reservations in the [Azure portal](https://portal.azure.com). Alert rules are created centrally from the partner’s tenant, while reservation management is performed in each customer’s tenant. Partners can include respective customers as alert recipients when creating alert rules.

The following information provides more detail.

**Alert rule creator** - The Microsoft partner.

**Creation portal** - Azure portal of partner tenant.

**Permissions required for creation and management** - Global admin or admin agent.

**Supported scope** - Customer scope. All the reservations that are active for the selected customer are monitored by default.

**Alert recipients** - Can be the partner, or the customer, or both.

**Alert email’s landing page** - Reservations page in the customer tenant.

**Permissions needed to view reservations** - For partners to review reservations in the customer tenant, partners require foreign principal access to the customer subscription. The default permissions required for managing reservations are explained at [Who can manage a reservation by default](../reservations/view-reservations.md#who-can-manage-a-reservation-by-default).

## Next steps

If you haven’t already set up cost alerts for budgets, credits, or department spending quotas, see [Use cost alerts to monitor usage and spending](cost-mgt-alerts-monitor-usage-spending.md).