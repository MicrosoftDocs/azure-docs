---
title: Self-service exchanges and refunds for Azure Reservations
description: Learn how you can exchange or refund Azure Reservations.
author: yashesvi
manager: yashesvi
ms.service: cost-management-billing
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/21/2020
ms.author: banders
---

# Self-service exchanges and refunds for Azure Reservations

Azure Reservations provide flexibility to help meet your evolving needs. You can exchange a reservation for another reservation of the same type. You can also refund a reservation, up to $50,000 USD per year, if you no longer need it. The maximum limit of the refund applies to all reservations in the scope of your agreement with Microsoft.

Self-service exchange and cancel capability isn't available for US Government Enterprise Agreement customers. Other US Government subscription types including Pay-As-You-Go and CSP are supported.

You must have owner access on the Reservation Order to exchange or refund an existing reservation.

## Exchange an existing reserved instance

You can exchange your reservation with three quick steps in the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Reservations/ReservationsBrowseBlade).

1. Select the reservations that you want to refund and click **Exchange**.  
    ![Example image showing reservations to return](./media/exchange-and-refund-azure-reservations/exchange-refund-return.png)
2. Select the VM product that you want to purchase and type a quantity. Make sure that the new purchase total is more than the return total. [Determine the right size before you purchase](../../virtual-machines/windows/prepay-reserved-vm-instances.md#determine-the-right-vm-size-before-you-buy).  
    ![Example image showing the VM product to purchase with an exchange](./media/exchange-and-refund-azure-reservations/exchange-refund-select-purchase.png)
3. Review and complete the transaction.  
    ![Example image showing the VM product to purchase with an exchange, completing the return](./media/exchange-and-refund-azure-reservations/exchange-refund-confirm-exchange.png)

To refund a reservation, go to **Reservation Details** and click **Refund**.

## How transactions are processed

First, Microsoft cancels the existing reservation and refunds the pro-rated amount for that reservation. If there's an exchange, the new purchase is processed. Microsoft processes refunds using one of the following methods, depending on your account type and payment method:

### Enterprise agreement customers

Money is added to the monetary commitment for exchanges and refunds if the original purchase was made using one. Any overage invoices since the original purchases are reopened and rerated to make sure the monetary commitment is used. If the monetary commitment term using the reservation was purchased is no longer active, then credit is added to your current enterprise agreement monetary commitment term. The credit is valid for 90 days from the date fo refund. Unused credit expires at the end of 90 days.

If the original purchase was made as an overage, Microsoft issues a credit memo.

### Pay-as-you-go invoice payments and CSP program

The original reservation purchase invoice is canceled and then a new invoice is created for the refund. For exchanges, the new invoice shows the refund and the new purchase. The refund amount is adjusted against the purchase. If you only refunded a reservation, then the prorated amount stays with Microsoft and it's adjusted against a future reservation purchase.

### Pay-as-you-go credit card customers

The original invoice is canceled, and a new invoice is created. The money is refunded to the credit card that was used for the original purchase. If you've changed your card, [contact support](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

## Cancel, exchange, and refund policies

Azure has the following policies for cancellations, exchanges, and refunds.

**Exchange policies**

- You can return multiple existing reservations to purchase a new reservation of the same type. You can't exchange reservations of one type for another. For example, you can't return a VM reservation to purchase a SQL reservation.
- Only reservation owners can process an exchange. [Learn how to Add or change users who can manage a reservation](manage-reserved-vm-instance.md#add-or-change-users-who-can-manage-a-reservation).
- An exchange is processed as a refund and repurchase – different transactions are created for the cancellation and the new purchase. The prorated reservation amount is refunded for the reservations that you trade-in. You're charged fully for the new purchase. The prorated reservation amount is the daily prorated residual value of the reservation being returned.
- You can exchange or refund reservations even if the enterprise agreement used to purchase the reservation is expired and was renewed as a new agreement.
- You can change any reservation property such as size, region, quantity, and term with an exchange.
- The new purchase total should equal or be greater than the returned amount.
- The new reservation purchased as part of exchange has a new term starting from the time of exchange.
- There's no penalty or annual limits for exchanges.

**Refund policies**
- If you cancel a reservation, there may be a 12% early termination fee.
- The refund you receive for a cancellation is the remaining pro-rated balance minus the 12% early termination fee. To cancel, go to the reservation in the Azure portal and select **Refund**.
- Your total refund amount can't exceed $50,000 USD in a 12-month rolling window.
- Refunds are calculated based on the lowest price of either your purchase price or the current price of the reservation.
- Only reservation owners can process a refund. [Learn how to Add or change users who can manage a reservation](manage-reserved-vm-instance.md#add-or-change-users-who-can-manage-a-reservation).
- Microsoft reserves the right to charge a 12% penalty for any returns. The penalty isn't currently charged, but will be charged in future.

## Exchange non-premium storage for premium storage

You can exchange a reservation purchased for a VM size that doesn't support premium storage to a corresponding VM size that does. For example, an _F1_ for an _F1s_. To make the exchange, go to Reservation Details and click **Exchange**. The exchange doesn't reset the term of the reserved instance or create a new transaction.

## Need help? Contact us.

If you have questions or need help, [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

## Next steps

- To learn how to manage a reservation, see [Manage Azure Reservations](manage-reserved-vm-instance.md).
- To learn more about Azure Reservations, see the following articles:
    - [What are Azure Reservations?](save-compute-costs-reservations.md)
    - [Manage Reservations in Azure](manage-reserved-vm-instance.md)
    - [Understand how the reservation discount is applied](../manage/understand-vm-reservation-charges.md)
    - [Understand reservation usage for your Pay-As-You-Go subscription](understand-reserved-instance-usage.md)
    - [Understand reservation usage for your Enterprise enrollment](understand-reserved-instance-usage-ea.md)
    - [Windows software costs not included with reservations](reserved-instance-windows-software-costs.md)
    - [Azure Reservations in Partner Center Cloud Solution Provider (CSP) program](/partner-center/azure-reservations)
