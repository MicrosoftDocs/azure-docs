---
title: Self-service exchanges and refunds for Azure Reservations
description: Learn how you can exchange or refund Azure Reservations.
author: yashesvi
ms.service: cost-management-billing
ms.topic: conceptual
ms.date: 07/01/2020
ms.author: banders
---

# Self-service exchanges and refunds for Azure Reservations

Azure Reservations provide flexibility to help meet your evolving needs. You can exchange a reservation for another reservation of the same type, that is a virtual machine reservation can be exchanged to purchase reservation for any virtual machine size or region. Likewise, a SQL PaaS Database reservation can be exchanged to purchase any reservation for any SQL PaaS Database type or region. You can also refund reservations but the sum total of canceled reservation commitment can't exceed USD 50,000 in a 12 month rolling window. Azure Databricks reserved capacity, Azure VMware solution by CloudSimple reservation, Azure Red Hat Open Shift reservation, Red Hat plans and, SUSE Linux plans aren't eligible for refunds.

Self-service exchange and cancel capability isn't available for US Government Enterprise Agreement customers. Other US Government subscription types including Pay-As-You-Go and Cloud Solution Provider (CSP) are supported.

You must have owner access on the Reservation Order to exchange or refund an existing reservation. You can [Add or change users who can manage a reservation](https://docs.microsoft.com/azure/cost-management-billing/reservations/manage-reserved-vm-instance#add-or-change-users-who-can-manage-a-reservation).

> [!NOTE]
> Microsoft is not currently charging early termination fees for reservation refunds. We might charge the fees for refunds made in the future. We currently don't have a date for enabling the fee.

## How to exchange or refund an existing reservation

You can exchange your reservation from [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Reservations/ReservationsBrowseBlade).

1. Select the reservations that you want to refund and select **Exchange**.  
    [![Example image showing reservations to return](./media/exchange-and-refund-azure-reservations/exchange-refund-return.png)](./media/exchange-and-refund-azure-reservations/exchange-refund-return.png#lightbox)
1. Select the VM product that you want to purchase and type a quantity. Make sure that the new purchase total is more than the return total. [Determine the right size before you purchase](../../virtual-machines/windows/prepay-reserved-vm-instances.md#determine-the-right-vm-size-before-you-buy).  
    [![Example image showing the VM product to purchase with an exchange](./media/exchange-and-refund-azure-reservations/exchange-refund-select-purchase.png)](./media/exchange-and-refund-azure-reservations/exchange-refund-select-purchase.png#lightbox)
1. Review and complete the transaction.  
    [![Example image showing the VM product to purchase with an exchange, completing the return](./media/exchange-and-refund-azure-reservations/exchange-refund-confirm-exchange.png)](./media/exchange-and-refund-azure-reservations/exchange-refund-confirm-exchange.png#lightbox)

To refund a reservation, go to **Reservation Details** and select **Refund**.

## Exchange non-premium storage for premium storage

You can exchange a reservation purchased for a VM size that doesn't support premium storage to a corresponding VM size that does. For example, an _F1_ for an _F1s_. To make the exchange, go to Reservation Details and select **Exchange**. The exchange doesn't reset the term of the reserved instance or create a new transaction. 

## How transactions are processed

First, Microsoft cancels the existing reservation and refunds the pro-rated amount for that reservation. If there's an exchange, the new purchase is processed. Microsoft processes refunds using one of the following methods, depending on your account type and payment method:

### Enterprise agreement customers

Money is added to the monetary commitment for exchanges and refunds if the original purchase was made using one. If the monetary commitment term using the reservation was purchased is no longer active, then credit is added to your current enterprise agreement monetary commitment term. The credit is valid for 90 days from the date of refund. Unused credit expires at the end of 90 days.

If the original purchase was made as an overage, the original invoice on which the reservation was purchased and all later invoices are reopened and readjusted. Microsoft issues a credit memo for the refunds.

### Pay-as-you-go invoice payments and CSP program

The original reservation purchase invoice is canceled and then a new invoice is created for the refund. For exchanges, the new invoice shows the refund and the new purchase. The refund amount is adjusted against the purchase. If you only refunded a reservation, then the prorated amount stays with Microsoft and it's adjusted against a future reservation purchase. If you bought a reservation at pay-as-you-go rates and later move to a CSP, the reservation can be returned and repurchased without a penalty.

### Pay-as-you-go credit card customers

The original invoice is canceled, and a new invoice is created. The money is refunded to the credit card that was used for the original purchase. If you've changed your card, [contact support](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

## Cancel, exchange, and refund policies

Azure has the following policies for cancellations, exchanges, and refunds.

**Exchange policies**

- You can return multiple existing reservations to purchase one new reservation of the same type. You can't exchange reservations of one type for another. For example, you can't return a VM reservation to purchase a SQL reservation. You can change a reservation property such as family, series, version, SKU, region, quantity, and term with an exchange.
- Only reservation owners can process an exchange. [Learn how to Add or change users who can manage a reservation](manage-reserved-vm-instance.md#add-or-change-users-who-can-manage-a-reservation).
- An exchange is processed as a refund and a repurchase – different transactions are created for the cancellation and the new reservation purchase. The prorated reservation amount is refunded for the reservations that's traded-in. You're charged fully for the new purchase. The prorated reservation amount is the daily prorated residual value of the reservation being returned.
- You can exchange or refund reservations even if the enterprise agreement used to purchase the reservation is expired and was renewed as a new agreement.
- The new reservation's lifetime commitment should equal or be greater than the returned reservation's remaining commitment. Example: for a three-year reservation that's $100 per month and exchanged after the 18th payment, the new reservation's lifetime commitment should be $1,800 or more (paid monthly or upfront).
- The new reservation purchased as part of exchange has a new term starting from the time of exchange.
- There's no penalty or annual limits for exchanges.

**Refund policies**

- We're currently not charging an early termination fee, but in the future there might be a 12% early termination fee for cancellations.
- Total cancelled commitment can't exceed 50,000 USD in a 12-month rolling window. Example: for a three-year reservation that's 100 USD per month and refunded in the 18th month, the canceled commitment is 1,800 USD. After the refund, your new available limit for refund will be 48,200 USD. In 365 days from this refund, the 48,200 USD limit will be increased by 1,800 USD and your new pool will be 50,000 USD. Any other reservation cancellation will deplete the same pool, and the same replenishment logic will apply.
- Refunds are calculated based on the lowest price of either your purchase price or the current price of the reservation.
- Only reservation order owners can process a refund. [Learn how to Add or change users who can manage a reservation](manage-reserved-vm-instance.md#add-or-change-users-who-can-manage-a-reservation).

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
    - [Azure Reservations in the CSP program](/partner-center/azure-reservations)
