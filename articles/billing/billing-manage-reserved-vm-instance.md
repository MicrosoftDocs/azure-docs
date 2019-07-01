---
title: Manage Azure Reservations
description: Learn how you can change subscription scope and manage access for Azure Reservations.
ms.service: billing
author: bandersmsft
manager: yashesvi
ms.service: billing
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/01/2019
ms.author: banders
---
# Manage Reservations for Azure resources

After you buy an reservation for Azure, you may need to apply the reservation to a different subscription, change who can manage the reservation, or change the scope of the reservation. You can also split a reservation into two reservations to apply some of the instances you bought to another subscription.

If you bought Azure Reserved Virtual Machine Instances, you can change the optimize setting for the reservation. The reservation discount can apply to VMs in the same series or you can reserve data center capacity for a specific VM size.


[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Reservation Order and Reservation

When you purchase of a reservation, two objects are created: **Reservation Order** and **Reservation**.

At the time of purchase, a Reservation Order has one Reservation under it. Actions such as split, merge, partial refund, or exchange create new reservations under the **Reservation Order**.

To view a Reservation Order, go to **Reservations** > select the reservation, and then click the **Reservation order ID**.

![Example of reservation order details showing Reservation order ID ](./media/billing-manage-reserved-vm-instance/reservation-order-details.png)

A reservation inherits permissions from its reservation order.

## Change the reservation scope

 Your reservation discount applies to virtual machines, SQL databases, Azure Cosmos DB, or other resources that match your reservation and run in the reservation scope. The billing context is dependent on the subscription used to buy the reservation.

To update the scope of a reservation:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **All services** > **Reservations**.
3. Select the reservation.
4. Select **Settings** > **Configuration**.
5. Change the scope.

If you change from shared to single scope, you can only select subscriptions where you are the owner. Only subscriptions within the same billing context as the reservation, can be selected.

The scope only applies to individual subscriptions with pay-as-you-go rates (offers MS-AZR-0003P or MS-AZR-0023P), Enterprise offer MS-AZR-0017P or MS-AZR-0148P, or CSP subscription types.

## Add or change users who can manage a reservation

You can delegate reservation management by adding people to roles on the reservation order or the reservation. By default, the person that places the reservation order and the account administrator have the Owner role on the reservation order and the reservation.

You can manage access to reservations orders and reservations independently from the subscriptions that get the reservation discount. When you give someone permissions to manage a reservation order or the reservation, it doesn't give them permission to manage the subscription. Similarly, if you give someone permissions to manage a subscription in the reservation's scope, it doesn't give them rights to manage the reservation order or the reservation.

To perform an exchange or refund, the user must have access to the reservation order. When granting someone permissions, it’s best to grant permissions to the reservation order, not the reservation.


To delegate access management for a reservation:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **All Services** > **Reservation** to list reservations that you have access to.
3. Select the reservation that you want to delegate access to other users.
4. Select **Access control (IAM)**.
5. Select **Add role assignment** > **Role** > **Owner**. Or, if you want to give limited access, select a different role.
6. Type the email address of the user you want to add as owner.
7. Select the user, and then select **Save**.

## Split a single reservation into two reservations

 After you buy more than one resource instance within a reservation, you may want to assign instances within that reservation to different subscriptions. By default, all instances have one scope - either single subscription or shared. For example, you bought 10 reservation instances and specified the scope to be subscription A. You may now want to change the scope for 7 reservations to subscription A and the remaining 3 to subscription B. Splitting a reservation allows you to distribute instances for granular scope management. You can simplify the allocation to subscriptions by choosing shared scope. But for cost management or budgeting purposes, you can allocate quantities to specific subscriptions.

 You can split a reservation into two reservations though PowerShell, CLI, or through the API.

### Split a reservation by using PowerShell

1. Get the reservation order ID by running the following command:

    ```powershell
    # Get the reservation orders you have access to
    Get-AzReservationOrder
    ```

2. Get the details of a reservation:

    ```powershell
    Get-AzReservation -ReservationOrderId a08160d4-ce6b-4295-bf52-b90a5d4c96a0 -ReservationId b8be062a-fb0a-46c1-808a-5a844714965a
    ```

3. Split the reservation into two and distribute the instances:

    ```powershell
    # Split the reservation. The sum of the reservations, the quantity, must equal the total number of instances in the reservation that you're splitting.
    Split-AzReservation -ReservationOrderId a08160d4-ce6b-4295-bf52-b90a5d4c96a0 -ReservationId b8be062a-fb0a-46c1-808a-5a844714965a -Quantity 3,2
    ```
4. You can update the scope by running the following command:

    ```powershell
    Update-AzReservation -ReservationOrderId a08160d4-ce6b-4295-bf52-b90a5d4c96a0 -ReservationId 5257501b-d3e8-449d-a1ab-4879b1863aca -AppliedScopeType Single -AppliedScope /subscriptions/15bb3be0-76d5-491c-8078-61fe3468d414
    ```

## Cancellations and exchanges

Depending on the reservation type, you may be able to cancel or exchange a reservation. For more information, see the cancellation and exchanges sections in the following topics:

- [Prepay for Virtual Machines with Azure Reserved VM Instances](..//virtual-machines/windows/prepay-reserved-vm-instances.md#cancellations-and-exchanges)
- [Prepay for SUSE software plans from Azure Reservations](../virtual-machines/linux/prepay-suse-software-charges.md#cancellation-and-exchanges-not-allowed)
- [Prepay for SQL Database compute resources with Azure SQL Database reserved capacity](../sql-database/sql-database-reserved-capacity.md#cancellations-and-exchanges)

## Change optimize setting for Reserved VM Instances

 When you buy a Reserved VM Instance, you choose instance size flexibility or capacity priority. Instance size flexibility applies the reservation discount to other VMs in the same [VM size group](https://aka.ms/RIVMGroups). Capacity priority prioritizes data center capacity for your deployments. This option offers additional confidence in your ability to launch the VM instances when you need them.

By default, when the scope of the reservation is shared, the instance size flexibility is on. The data center capacity isn't prioritized for VM deployments.

For reservations where the scope is single, you can optimize the reservation for capacity priority instead of VM instance size flexibility.

To update the optimize setting for the reservation:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **All Services** > **Reservations**.
3. Select the reservation.
4. Select **Settings** > **Configuration**.
5. Change the **Optimize for** setting.

## Need help? Contact us.

If you have questions or need help,  [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps

To learn more about Azure Reservations, see the following articles:

- [What are reservations for Azure?](billing-save-compute-costs-reservations.md)

Buy a service plan:
- [Prepay for Virtual Machines with Azure Reserved VM Instances](../virtual-machines/windows/prepay-reserved-vm-instances.md)
- [Prepay for SQL Database compute resources with Azure SQL Database reserved capacity](../sql-database/sql-database-reserved-capacity.md)
- [Prepay for Azure Cosmos DB resources with Azure Cosmos DB reserved capacity](../cosmos-db/cosmos-db-reserved-capacity.md)

Buy a software plan:
- [Prepay for Red Hat software plans from Azure Reservations](../virtual-machines/linux/prepay-rhel-software-charges.md)
- [Prepay for SUSE software plans from Azure Reservations](../virtual-machines/linux/prepay-suse-software-charges.md)

Understand discount and usage:
- [Understand how the VM reservation discount is applied](billing-understand-vm-reservation-charges.md)
- [Understand how the Red Hat Enterprise Linux software plan discount is applied](../billing/billing-understand-rhel-reservation-charges.md)
- [Understand how the SUSE Linux Enterprise software plan discount is applied](../billing/billing-understand-suse-reservation-charges.md)
- [Understand how other reservation discounts are applied](billing-understand-reservation-charges.md)
- [Understand reservation usage for your Pay-As-You-Go subscription](billing-understand-reserved-instance-usage.md)
- [Understand reservation usage for your Enterprise enrollment](billing-understand-reserved-instance-usage-ea.md)
- [Windows software costs not included with Reservations](billing-reserved-instance-windows-software-costs.md)
