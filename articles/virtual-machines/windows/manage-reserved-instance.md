---
title: Manage Azure Reserved Virtual Machine Instances | Microsoft Docs
description: Learn how you can change subscription scope and manage access for a reservation. 
services: ''
documentationcenter: ''
author: vikramdesai01
manager: vikramdesai01
editor: ''

ms.service: billing
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/24/2017
ms.author: vikdesai
---
# Manage Reserved Virtual Machine Instances

After you buy a reservation, you may want to apply the reservation to a different subscription than the one specified during purchase. Alternatively, if your matching virtual machines are running in multiple subscriptions, you may want to change the reservation scope to shared. To maximize the reservation discount, you need to ensure that number of running virtual machines matching the reservation attributes are at least equal to the quantity bought. To learn more about Reserved Virtual Machine Instances, see [Save money by pre-paying for Azure virtual machines](https://go.microsoft.com/fwlink/?linkid=862121)

## Change scope for a reservation
 Your reservation discount applies to virtual machines that match your reservation and run within the reservation scope. The scope of a reservation can be single subscription or all subscription in your billing context. If you set the scope to single subscription, the reservation is matched to running virtual machines in the selected subscription. Setting scope to shared, matches the reservation to running virtual machines in all subscriptions within the billing context. The billing context is dependent on the subscription used to buy the reservation, to learn more see [Pre-pay for VMs with Reserved VM Instances](https://go.microsoft.com/fwlink/?linkid=861721).

To update the scope of a reservation: 
1. Log in to the [Azure portal](https://portal.azure.com)
2. Select **More Services** > **Reservations**
3. Select the reservation.
4. Select **Settings** > **Configuration**
5. Change the scope. If you change from shared to single, only subscriptions that you have "Owner" access. Only subscriptions within the same billing context as the reservation, can be selected. The scope only applies to eligible subscription offers types. For enterprise subscriptions, offer MS-AZR-0017P. For Pay-As-You-Go subscriptions, offer MS-AZR-0003P. For enterprise subscriptions, dev/test subscriptions are not eligible to get the reservation discount.

## Split a single reservation into two reservations
 After you buy more than one instance, you may want to assign instances within a reservation to different subscriptions. By default, all instances (quantity specified during the purchase) have one scope - either single subscription or shared. For example, you purchased 10 Standard D2 VMs and specified the scope to be subscriptionA. You may now want to change the scope for seven Reserved VM instances to subscriptonA and the remaining 3 to subscriptionB. Splitting a reservation allows you to distribute instances, for granular scope management. You can simplify the allocation to subscriptions by choosing shared scope. But for cost management or budgeting purposes, you can allocate quantities to specific subscriptions.

 You can split a reservation into two reservations though PowerShell, CLI, or through the API. After you split the reservation, you can change the scope of individual reservation through portal, PowerShell, CLI, or through the API.

### Split a reservation by using PowerShell.
1. Get the reservation order ID by running the following command:

    ```powershell
    # Get the reservation orders you have access to
    Get-AzureRmReservationOrder
    ```
2. Get the details of a reservation:

    ```powershell
    Get-AzureRmReservation -ReservationOrderId a08160d4-ce6b-4295-bf52-b90a5d4c96a0 -ReservationId b8be062a-fb0a-46c1-808a-5a844714965a
    ```
3. Split the reservation into two and distribute the instances:

    ```powershell
    # Split the reservation. The sum of the VM instances quantity must equal the total instances in the reservation you're splitting.
    Split-AzureRmReservation -ReservationOrderId a08160d4-ce6b-4295-bf52-b90a5d4c96a0 -ReservationId b8be062a-fb0a-46c1-808a-5a844714965a -Quantity 3,2
    ```
4. You can update the scope by running the following command:

    ```powershell
    Update-AzureRmReservation -ReservationOrderId a08160d4-ce6b-4295-bf52-b90a5d4c96a0 -ReservationId 5257501b-d3e8-449d-a1ab-4879b1863aca -AppliedScopeType Single -AppliedScope /subscriptions/15bb3be0-76d5-491c-8078-61fe3468d414
    ```

## Add or change users who can manage a reservation
After you buy a reservation, the purchaser and the account admin of the payment subscription are added into the “Owner” role on the reservation. You can manage access to reservation independently of the subscriptions getting the reservation discount. Adding a user to manage a reservation does not give user rights to manage subscriptions. Similarly, when a user is given access to a subscription within the reservation's scope, they do not get access to manage a reservation. 
 
You can delegate management of a reservation, by adding users to a role on the reservation. 
1.	Log in to the [Azure portal](https://portal.azure.com)
2.	Select **More Services** > **Reservation** to list reservations that you have access to.
3.	Select the reservation that you want to delegate access to other users
4.	Select **Access Control (IAM)** in the menu
5.	Select **Add** > **Role** > **Owner** (or a different role if you want to give limited access). 
6. Type the email address of the user you want to add as Owner. 
7. Select the user, and then select **Save**.

## Need help? Contact support.

If you still have further questions, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.
