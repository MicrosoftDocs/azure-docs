---
title: Manage Azure Reserved Virtual Machine Instances | Microsoft Docs
description: Learn how you can change subscription scope and manage access for Azure Reserved VM Instances. 
services: billing
documentationcenter: ''
author: vikramdesai01
manager: vikramdesai01
editor: ''

ms.service: billing
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/06/2017
ms.author: vikdesai
---
# Manage Reserved Virtual Machine Instances

After you buy an Azure Reserved VM Instance, you may want to apply the reservation to a different subscription than the one specified during purchase. Alternatively, if your matching virtual machines are running in multiple subscriptions, you may want to change the reservation scope to shared. To maximize the reservation discount, make sure that the number of instances you bought matches the attributes and number of virtual machines that you have running. To learn more about Reserved Virtual Machine Instances, see [Save money by pre-paying for Azure virtual machines](https://go.microsoft.com/fwlink/?linkid=862121).

## Change the scope for a reservation
 Your reservation discount applies to virtual machines that match your reservation and run within the reservation scope. The scope of a reservation can be single subscription or all subscriptions in your billing context. If you set the scope to single subscription, the reservation is matched to running virtual machines in the selected subscription. If you set the scope to shared, Azure matches the reservation to virtual machines that run in all the subscriptions within the billing context. The billing context is dependent on the subscription used to buy the reservation. To learn more, see [Pre-pay for VMs with Reserved VM Instances](https://go.microsoft.com/fwlink/?linkid=861721).

To update the scope of a reservation: 
1. Log in to the [Azure portal](https://portal.azure.com).
2. Select **More Services** > **Reservations**.
3. Select the reservation.
4. Select **Settings** > **Configuration**.
5. Change the scope. If you change from shared to single scope, you can only select subscriptions where you are the owner. Only subscriptions within the same billing context as the reservation, can be selected. The billing context is determined by the subscription that you selected when the reservation was bought. The scope only applies to Pay-As-You-Go offer MS-AZR-0003P subscriptions and Enterprise offer MS-AZR-0017P subscriptions. For enterprise agreements, dev/test subscriptions are not eligible to get the reservation discount.

## Split a single reservation into two reservations
 After you buy more than one instance, you may want to assign instances within a reservation to different subscriptions. By default, all instances (quantity specified during the purchase) have one scope - either single subscription or shared. For example, you purchased 10 Standard D2 VMs and specified the scope to be subscription A. You may now want to change the scope for 7 Reserved VM instances to subscription A and the remaining 3 to subscription B. Splitting a reservation allows you to distribute instances for granular scope management. You can simplify the allocation to subscriptions by choosing shared scope. But for cost management or budgeting purposes, you can allocate quantities to specific subscriptions.

 You can split a reservation into two reservations though PowerShell, CLI, or through the API.

### Split a reservation by using PowerShell
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
    # Split the reservation. The sum of the Reserved VM instances, the quantity, must equal the total number of instances in the reservation that you're splitting.
    Split-AzureRmReservation -ReservationOrderId a08160d4-ce6b-4295-bf52-b90a5d4c96a0 -ReservationId b8be062a-fb0a-46c1-808a-5a844714965a -Quantity 3,2
    ```
1. You can update the scope by running the following command:

    ```powershell
    Update-AzureRmReservation -ReservationOrderId a08160d4-ce6b-4295-bf52-b90a5d4c96a0 -ReservationId 5257501b-d3e8-449d-a1ab-4879b1863aca -AppliedScopeType Single -AppliedScope /subscriptions/15bb3be0-76d5-491c-8078-61fe3468d414
    ```

## Add or change users who can manage a reservation
You can delegate management of a reservation by adding people to roles on the reservation. By default, the person that bought the reservation and the account administrator have the Owner role on the reservation. 

You can manage access to reservations independently from the subscriptions that get the reservation discount. When you give someone permissions to manage a reservation, that doesn't give them rights to manage the subscription. And if you give someone permissions to manage a subscription within the reservation's scope, that doesn't give them rights to manage the reservation.
 
To delegate access management for a reservation: 
1.	Log in to the [Azure portal](https://portal.azure.com).
2.	Select **More Services** > **Reservation** to list reservations that you have access to.
3.	Select the reservation that you want to delegate access to other users.
4.	Select **Access Control (IAM)** in the menu.
5.	Select **Add** > **Role** > **Owner** (or a different role if you want to give limited access). 
6. Type the email address of the user you want to add as Owner. 
7. Select the user, and then select **Save**.

## Need help? Contact support

If you still have further questions, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.
