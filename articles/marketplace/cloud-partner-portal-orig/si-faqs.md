---
title: Seller Insights FAQ 
description: Frequently Asked Questions about the Seller Insights feature of the Cloud Partner Portal.
author: dsindona
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 09/14/2018
ms.author: dsindona
---

Seller Insights FAQ
===================

This article provides guidance for common user procedures within and questions about Seller Insights.


Find definitions for the values in the downloaded transaction file
------------------------------------------------------------------

The definitions of the metric values in the transaction file are found in the article [Seller Insights Definitions](./si-insights-definitions-v4.md).


See customer details of transactions for which I've been paid
-------------------------------------------------------------

After downloading your transactions from the Payout module, locate the column
labeled **Payout Status**, and apply the filter to only display the value "Paid
Out." The following columns will appear containing the customer details:
**Company Name**, **Customer Email**, **Customer Country**, **Customer State**, and **Customer
Postal Code**.


Calculate my open accounts receivable
-------------------------------------

After downloading your transactions from the Payout module, locate the column
labeled **Payout Status**, and apply the filter to only display the value
"Upcoming Payout" and "Not Ready for Payout." Then sum the column labeled
**Payout Amount (PC)**.


Calculate revenue by customer usage period
------------------------------------------

After downloading your transactions from the Payout module, locate the column
labeled **Transaction Status**, and filter the value "Paid".   For each
transaction listed, the column labeled **Payout Amount (PC)** represents the
amount you were paid.  To estimate the usage period associated with the
transaction, use the column **Charge Date**, which is a close approximation of the
last day of usage for the period to which the transaction applies.


Calculate your bad debt
---------------------

After downloading your transactions from the Payout module, locate the column
labeled **Final Collection Status**, and apply the filter to only display the
value "Write Off." Then sum the column labeled **Payout Amount (PC)**.


View payout or customer contact information
-------------------------------------------

Sign in as a user with the "owner" role and not the "contributor" role. Only the
owner role will see payout and customer information. You can find out more about
user roles in the article [Manage users](./cloud-partner-portal-manage-users.md).


Calculate my advance payouts
----------------------------

After downloading your transactions from the Payout module, locate the column
labeled **Transaction Type**, and apply the filter to only display the value
"Charge." Next, locate the column labeled **Final Collection Status**, and apply
the filter to only display the value "In Progress". Finally, sum the **Payout
Amount (PC)** column to calculate all advances paid to you prior to collection
from the customer.


Calculate customer refunds
--------------------------

After downloading your transactions from the Payout module, locate the column
labeled **Final Collection Status**, and apply the filter to only display the
value "Refund." Sum the **Charge Amount (PC)** column to calculate all refunds
processed for your customers.


Identify which transactions involved a Microsoft Channel Partner
----------------------------------------------------------------

All transactions in the column **Azure License Type** that are filtered to display
the values "Enterprise through Reseller" and "Cloud Solution Provider" involve a
Microsoft Channel Partner. For more details on the partner, you can find their
**Reseller Name** and **Reseller Email** in the Payout module download and the
Customer module download.


Identify trial usage and trial conversions
------------------------------------------

Order, Usage and Payout module downloads now contain **Trial End Date** to help
you understand when the trial period ended for that specific order, where
applicable. To see trial usage and orders, locate the **SKU Billing Type** column
in the downloads, and apply the filter to only display the value "Trial." To see
trial conversions, locate the **Trial End Date** column in the downloads, and
apply the filter to only display orders when the **Trial End Date** is past
today's date and **Cancel Date** column is empty or later than the **Trial End
Date**.


When is my monthly payout calculated
------------------------------------

Your payouts are issued to you by the 15th of each month for all amounts ready
for payout by the last calendar day of the preceding month. On the third day of
the month, Microsoft will calculate the previous month's payout amount and
update all applicable charge transactions in your download with "Upcoming
Payout" in the **Payout Status** column. Those transactions will stay in that
state until the payment request is sent to your bank account, at which time
their **Payout Status** will be updated to "Paid Out," and the "Payout Date" will
be updated to show the date we submitted the payment request to your bank.


Calculate customer acquisition and loss
---------------------------------------

You can see the date when the customer first bought one of your offers by
locating the **Date Acquired** column in the customer download. Similarly, you can
see the date after which they no longer had any offer published by you by
locating the **Date Lost** column in the customer download.


Finding more help
-----------------

- [Seller Insights Definitions](./si-insights-definitions-v4.md) - Find definitions for metrics and data

- [Getting started with Seller Insights](./si-getting-started.md) - Introduction to the Seller Insights feature.

