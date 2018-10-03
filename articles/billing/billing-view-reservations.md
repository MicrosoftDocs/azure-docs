---
title: View Azure Reservations | Microsoft Docs
description: Learn how to view Azure Reservations in the Azure portal. 
services: 'billing'
documentationcenter: ''
author: yashesvi
manager: yashar
editor: ''

ms.service: billing
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/03/2018
ms.author: cwatson
---
# View Azure Reservations in the Azure portal

Depending on your subscription type and permissions, there are a couple of ways to view Azure Reservations.

## View Reservations as Owner or Reader

By default, when you buy a reservation, you and the account administrator can view the reservation. You and the account administrator automatically get the Owner role on the reservation. To allow other people to view the reservation, you must add them as an **Owner** or **Reader** on the Reservation. For more information, see [Add or change users who can manage a reservation](billing-manage-reserved-vm-instance.md#add-or-change-users-who-can-manage-a-reservation).
 
To view a reservation as an Owner or Reader,

1. Sign in to the [Azure portal]( http://portal.azure.com).
1. Search on **Reservations**.

    ![Screenshot that shows Azure portal search](./media/billing-view-reservation/portal-reservation-search.png)

1. You see a list of the reservations where you have the Owner or Reader role.

If you need to change the scope of a reservation, split a reservation, or change who can manage a reservation, see [Manage Azure Reservations](billing-manage-reserved-vm-instance.md).

## View Reservation transactions for Enterprise enrollments

 If you have a partner led Enterprise enrollment, view reservations by going to **Reports** in the EA portal. For other Enterprise enrollments, you can view reservations in the EA portal and in the Azure portal. You must be an EA administrator to view reservation transactions.

To view reservation transactions in Azure portal,

1. Sign in to the [Azure portal]( http://portal.azure.com).
1. Search on **Cost Management + Billing**.

    ![Screenshot that shows Azure portal search](./media/billing-view-reservation/portal-cm-billing-search.png)

1. Select **Reservation transactions**.
1. To filter the results, select  **Timespan**, **Type**, or **Description**.
1. Select **Apply**.

    ![Screenshot that shows Reservation transactions results](./media/billing-view-reservation/portal-billing-reservation-transaction-results.png)

To get the data by using an API, see [Get Reserved Instance transaction charges for enterprise customers](/rest/api/billing/enterprise/billing-enterprise-api-reserved-instance-charges).

## Next steps

To learn more about Azure Reservations, see the following articles:

- [What are Azure Reservations?](billing-save-compute-costs-reservations.md)
- [Prepay for Cosmos DB reserved capacity](../cosmos-db/cosmos-db-reserved-capacity.md)
- [Prepay for SQL Database compute resources with Azure SQL Database reserved capacity](../sql-database/sql-database-reserved-capacity.md)
- [Prepay for Virtual Machines with Azure Reserved VM Instances](../virtual-machines/windows/prepay-reserved-vm-instances.md)
- [Manage Azure Reservations](billing-manage-reserved-vm-instance.md)
- [Understand reservation usage for your Pay-As-You-Go subscription](billing-understand-reserved-instance-usage.md)
- [Understand reservation usage for your Enterprise enrollment](billing-understand-reserved-instance-usage-ea.md)
- [Understand reservation usage for CSP subscriptions](https://docs.microsoft.com/partner-center/azure-reservations)

## Need help? Contact support

If you still have further questions, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.
