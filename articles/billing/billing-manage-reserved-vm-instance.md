---
title: Manage Azure Reserved VM Instances | Microsoft Docs
description: Learn how you can change subscription scope and manage access for Azure Reserved VM Instances. 
services: billing
documentationcenter: ''
author: yashesvi
manager: yashesvi
editor: ''

ms.service: billing
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/31/2018
ms.author: yashesvi
---
# Manage reserved instances in Azure

After you buy an Azure Reserved VM Instance, you may want to apply the reserved instance to a different subscription than the one specified during purchase. Alternatively, if your matching virtual machines are running in multiple subscriptions, you may want to change the reserved instance scope to shared. To maximize the reserved instance discount, make sure that the number of instances you bought matches the attributes and number of virtual machines that you have running. To learn more about Azure reserved instances, see [Save money by pre-paying for Azure virtual machines](https://go.microsoft.com/fwlink/?linkid=862121).

## Change the scope for a reserved instance
 Your reserved instance discount applies to virtual machines that match your reserved instance and run within the reserved instance scope. The scope of a reserved instance can be single subscription or all subscriptions in your billing context. If you set the scope to single subscription, the reserved instance is matched to running virtual machines in the selected subscription. If you set the scope to shared, Azure matches the reserved instance to virtual machines that run in all the subscriptions within the billing context. The billing context is dependent on the subscription used to buy the reserved instance. To learn more, see [Pre-pay for VMs with reserved instances](https://go.microsoft.com/fwlink/?linkid=861721).

To update the scope of a reserved instance: 
1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **All Services** > **Reservations**.
3. Select the reserved instance.
4. Select **Settings** > **Configuration**.
5. Change the scope. If you change from shared to single scope, you can only select subscriptions where you are the owner. Only subscriptions within the same billing context as the reserved instance, can be selected. The billing context is determined by the subscription that you selected when the reserved instance was bought. The scope only applies to Pay-As-You-Go offer MS-AZR-0003P subscriptions and Enterprise offer MS-AZR-0017P subscriptions. For enterprise agreements, dev/test subscriptions are not eligible to get the reserved instance discount.

## Add or change users who can manage a reserved instance
You can delegate management of a reserved instance by adding people to roles on the reserved instance. By default, the person that bought the reserved instance and the account administrator have the Owner role on the reserved instance. 

You can manage access to reserved instances independently from the subscriptions that get the reserved instance discount. When you give someone permissions to manage a reserved instance, that doesn't give them rights to manage the subscription. And if you give someone permissions to manage a subscription within the reserved instance's scope, that doesn't give them rights to manage the reserved instance.
 
To delegate access management for a reserved instance: 
1.	Sign in to the [Azure portal](https://portal.azure.com).
2.	Select **All Services** > **Reservation** to list reserved instances that you have access to.
3.	Select the reserved instance that you want to delegate access to other users.
4.	Select **Access Control (IAM)** in the menu.
5.	Select **Add** > **Role** > **Owner** (or a different role if you want to give limited access). 
6. Type the email address of the user you want to add as Owner. 
7. Select the user, and then select **Save**.

## Optimize Reserved VM Instance for VM size flexibility or capacity priority
 VM instance flexibility applies the reservation discount to other VMs in the same [VM size group](https://aka.ms/RIVMGroups). By default, when the scope of the reservation is shared, the instance size flexibility is on and datacenter capacity isn't prioritized for VM deployments. For reservations where the scope is single, you can optimize the reservation for capacity priority instead of VM instance size flexibility. Capacity priority reserves data center capacity for your deployments, offering additional confidence in your ability to launch the VM instances when you need them.

To update the scope of a reserved instance: 
1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **All Services** > **Reservations**.
3. Select the reserved instance.
4. Select **Settings** > **Configuration**.
5. Change the Optimize for setting.

## Split a single reserved instance into two reserved instances
 After you buy more than one instance, you may want to assign instances within a reserved instance to different subscriptions. By default, all instances (quantity specified during the purchase) have one scope - either single subscription or shared. For example, you purchased 10 Standard D2 VMs and specified the scope to be subscription A. You may now want to change the scope for seven reserved instances to subscription A and the remaining 3 to subscription B. Splitting a reserved instance allows you to distribute instances for granular scope management. You can simplify the allocation to subscriptions by choosing shared scope. But for cost management or budgeting purposes, you can allocate quantities to specific subscriptions.

 You can split a reserved instance into two reserved instances though PowerShell, CLI, or through the API.

### Split a reserved instance by using PowerShell
1. Get the reserved instance order ID by running the following command:

    ```powershell
    # Get the reserved instance orders you have access to
    Get-AzureRmReservationOrder
    ```

2. Get the details of a reserved instance:

    ```powershell
    Get-AzureRmReservation -ReservationOrderId a08160d4-ce6b-4295-bf52-b90a5d4c96a0 -ReservationId b8be062a-fb0a-46c1-808a-5a844714965a
    ```

3. Split the reserved instance into two and distribute the instances:

    ```powershell
    # Split the reserved instance. The sum of the reserved instances, the quantity, must equal the total number of instances in the reserved instance that you're splitting.
    Split-AzureRmReservation -ReservationOrderId a08160d4-ce6b-4295-bf52-b90a5d4c96a0 -ReservationId b8be062a-fb0a-46c1-808a-5a844714965a -Quantity 3,2
    ```

1. You can update the scope by running the following command:

    ```powershell
    Update-AzureRmReservation -ReservationOrderId a08160d4-ce6b-4295-bf52-b90a5d4c96a0 -ReservationId 5257501b-d3e8-449d-a1ab-4879b1863aca -AppliedScopeType Single -AppliedScope /subscriptions/15bb3be0-76d5-491c-8078-61fe3468d414
    ```

## Next steps
To learn more about Azure reserved instances, see the following articles:

- [What are Azure Reserved VM Instances?](billing-save-compute-costs-reservations.md)
- [Prepay for Virtual Machines with Azure Reserved VM Instances](../virtual-machines/windows/prepay-reserved-vm-instances.md)
- [Understand how the reserved instance discount is applied](billing-understand-vm-reservation-charges.md)
- [Understand reserved instance usage for your Pay-As-You-Go subscription](billing-understand-reserved-instance-usage.md)
- [Understand reserved instance usage for your Enterprise enrollment](billing-understand-reserved-instance-usage-ea.md)
- [Windows software costs not included with reserved instances](billing-reserved-instance-windows-software-costs.md)

## Need help? Contact support

If you still have further questions, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.
