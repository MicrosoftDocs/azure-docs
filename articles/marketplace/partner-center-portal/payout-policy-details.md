---
title: Payout policy details - Azure Marketplace
description: Details concerning payout policies, including schedules and recoupment.
author: mingshen
ms.author: mingshen
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 04/24/2020
---

# Payout policy details

## Where to find upcoming payouts

In Partner Center, select **Payout** at the upper-right corner of the portal:

![Illustrates the Payout icon in the upper-right corner of the Partner Center portal.](./media/payout-overview.png)

> [!NOTE]
> Not all account roles have access to payout information. For details, see [Roles and permissions to access the payout report](https://docs.microsoft.com/azure/marketplace/partner-center-portal/payout-summary).

## Payment schedules

The following tables provide details that apply to a customer who has an Enterprise Agreement.

### After May 1, 2020

For purchases occurring after May 1, 2020 from a customer with an Enterprise Agreement with Microsoft, publishers receive payouts per the schedule shown in the following table. Payouts will be sent in the next payout cycle, 30 days after the customer invoice is sent, regardless of whether or not the customer has paid Microsoft.

| Event  | Date  | Partner visibility: Partner Center payout report  |  Partner visibility: Partner Center analytics\* |
| --- | --- | --- | --- |
| Transaction or month of usage | 8/1/2020 – 8/31/2020 | N/A | **Usage report**: new consumption shown (refreshed every four hours)<br>**Order report**: N/A |
| Term ending (month) | 8/31/2020 | N/A | **Usage report**: month end consumption shown<br>**Order report**: N/A |
| Order generated | 9/3/2020 – 9/7/2020 | N/A | **Usage report**: consumption shown with OrderID/OrderLineItemID<br>**Order report**: customer orders shown as ACTIVE |
| Calculate payout earning | 9/4/2020 – 9/10/2020 | Denoted as **Unprocessed** in Transaction History on the Payout Dashboard | **Usage report**: consumption shown with OrderID/OrderLineItemID<br>**Order report**: customer orders shown as ACTIVE |
| Monthly payout | 10/5/2020 | Denoted as **Upcoming** in transaction History on the Payout Dashboard | **Usage report**: consumption shown with OrderID/OrderLineItemID<br>**Order report**: customer orders shown as ACTIVE |
| Payout date | 10/15/2020 | Denoted as **Sent** in Transaction History and in the Payments section of the Payout Dashboard | **Usage report**: consumption shown with OrderID/OrderLineItemID<br>**Order report**: customer orders shown as ACTIVE |
| Customer invoice collected | 12/1/2020 | Denoted as **Sent** in Transaction History and in the Payments section of the Payout Dashboard | **Usage report**: consumption shown with OrderID/OrderLineItemID<br>**Order report**: customer orders shown as ACTIVE  |
|  |  |  |  |

\* Usage and Order reports are accessible in the Analyze section in Partner Center.

### Prior to May 1, 2020

All purchases occurring before this date are processed and paid per the schedule below after Microsoft has collected payment from customers and processed the marketplace fee.

| Event  | Date  | Partner visibility: Partner Center payout report  |  Partner visibility: Partner Center analytics\*  |
| --- | --- | --- | --- |
| Transaction or month of usage | 8/1/2019 – 8/31/2019 | N/A | **Usage report**: new consumption shown (refreshed every four hours)<br>**Order report**: N/A |
| Term ending (month) | 8/31/2019 | N/A | **Usage report**: month end consumption shown<br>**Order report**: N/A |
| Order generated | 9/3/2019 – 9/7/2019 | N/A | **Usage report**: consumption shown with OrderID/OrderLineItemID<br>**Order report**: customer orders shown as ACTIVE |
| Customer invoice collected | 12/1/2019 | N/A | **Usage report**: consumption shown with OrderID/OrderLineItemID<br>**Order report**: customer orders shown as ACTIVE |
| Calculate payout | 12/5/2019 –12/7/2019 | Denoted as **Unprocessed** in the Transaction History on the Payout Dashboard | **Usage report**: consumption shown with OrderID/OrderLineItemID<br>**Order report**: customer orders shown as ACTIVE |
| Monthly payout | 1/5/2019 | Denoted as **Upcoming** in the transaction History on the Payout Dashboard | **Usage report**: consumption shown with OrderID/OrderLineItemID<br>**Order report**: customer orders shown as ACTIVE |
| Payout date | 1/15/2019 | Denoted as **Sent** in Transaction History and in the Payments section on the Payout Dashboard | **Usage report**: consumption shown with OrderID/OrderLineItemID<br>**Order report**: customer orders shown as ACTIVE |
|  |  |  |  |

\* Usage and Order reports are accessible in the Analyze section in Partner Center.

### Customers who pay using credit card or invoice

All purchases with a credit card or monthly invoice have a 30-day holding period to ensure that funds are cleared and there are no chargebacks or suspected fraud.

| Event  | Date  | Partner visibility: Partner Center payout report  |  Partner visibility: Partner Center analytics\*  |
| --- | --- | --- | --- |
| Transaction or month of usage | 8/1/2019 - 8/31/2019 | N/A | **Usage report**: new consumption shown (refreshed every four hours)<br>**Order report**: N/A |
| Term ending (month) | 8/31/2019 | N/A | **Usage report**: month end consumption shown<br>**Order report**: N/A |
| Order generated | 9/3/2019 – 9/7/2019 | N/A | **Usage report**: consumption shown with OrderID/OrderLineItemID<br>**Order report**: customer orders shown as ACTIVE |
| Customer invoice collected | 9/7/2019 – 9/10/2019 | N/A | **Usage report**: consumption shown with OrderID/OrderLineItemID<br>**Order report**: customer orders shown as ACTIVE |
| Calculate payout | 9/8/2019 -9/12/2019 | Denoted as **Unprocessed** in the Transaction History on the Payout Dashboard | **Usage report**: consumption shown with OrderID/OrderLineItemID<br>**Order report**: customer orders shown as ACTIVE |
| Monthly payout | 11/5/2019\* | Denoted as **Upcoming** in the Transaction History on the Payout Dashboard | **Usage report**: consumption shown with OrderID/OrderLineItemID<br>**Order report**: customer orders shown as ACTIVE |
| Payout date | 11/15/2019 | Denoted as **Sent** in the Transaction History and in the Payments section on the Payout Dashboard | **Usage report**: consumption shown with OrderID/OrderLineItemID<br>**Order report**: customer orders shown as ACTIVE |
|  |  |  |  |

\* Usage and Order reports are accessible in the Analyze section in Partner Center.

## Recoupment policy

### Definition

There are times when customers fail to pay Microsoft for transactions in the commercial marketplace, even after a thorough collections process. When these funds are written off, we will recoup funds from publishers if a written-off payout was made.

### Funds written off as uncollectable

When a customer fails to pay Microsoft according to their billing schedule, Microsoft begins the collections process. The collections process takes approximately four months and involves persistent communication from Microsoft. If payment is not received by the end of this process, Microsoft writes off the funds as uncollectable.

### Recoupment process

After the customer's charges are written off as uncollectable, the recoupment process begins. This involves withholding future payouts to the publisher to true up the account. For example, if we write off $1,000 in payouts that were already made, then future payouts to the publisher are withheld until we recover this amount.

### Payout and recoupment schedule

#### Purchases after May 1, 2020

| Event  | Date  | Partner visibility of payout statement  |  Partner visibility of analytics  |
| --- | --- | --- | --- |
| Transaction or month of usage | 8/1/2020 – 8/31/2020 | N/A | **Usage report**: new consumption shown (refreshed every four hours)<br>**Order report**: N/A |
| Term ending (month) | 8/31/2020 | N/A | **Usage report**: month end consumption shown<br>**Order report**: N/A |
| Order generated | 9/3/2020 – 9/7/2020 | N/A | **Usage report**: consumption shown with OrderID/OrderLineItemID<br>**Order report**: customer orders shown as ACTIVE |
| Calculate payout earning | 9/4/2020 – 9/10/2020 | Denoted as **Unprocessed** in Transaction History on the Payout Dashboard | **Usage report**: consumption shown with OrderID/OrderLineItemID<br>**Order report**: customer orders shown as ACTIVE |
| Monthly payout | 10/5/2020 | Denoted as **Upcoming** in transaction History on the Payout Dashboard | **Usage report**: consumption shown with OrderID/OrderLineItemID<br>**Order report**: customer orders shown as ACTIVE |
| Payout date | 10/15/2020 | Denoted as **Sent** in Transaction History and in the Payments section on the Payout Dashboard | **Usage report**: consumption shown with OrderID/OrderLineItemID<br>**Order report**: customer orders shown as ACTIVE |
| Customer invoice date | 12/1/2020 | Denoted as **Sent** in Transaction History and in the Payments section on the Payout Dashboard | **Usage report**: consumption shown with OrderID/OrderLineItemID<br>**Order report**: customer orders shown as ACTIVE |
| Customer does not pay Microsoft | 12/2/2020 – 12/5/2020 | Denoted as **Sent** in Transaction History and in the Payments section on the Payout Dashboard | **Usage report**: consumption shown with OrderID/OrderLineItemID<br>**Order report**: customer orders shown as ACTIVE |
|  |  |  |  |
