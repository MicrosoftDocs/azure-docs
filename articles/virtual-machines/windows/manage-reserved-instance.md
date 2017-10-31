---
title: Manage Azure Reserved Virtual Machine Instances | Microsoft Docs
description: Learn how you can manage your Reserved Virtual Machine Instances to optimize utilization. 
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

Reserved Virtual Machine Instances allow you to pre-pay for 1 to 3 years of compute capacity for a discount on the virtual machines you use. To maximize the reservation discount, you need to ensure that number of running virtual machines matching the reservation attributes are at least equal to the quantity bought. After you buy a reservation, you may want to apply the reservation to a different subscription than the one specified during purchase. Alternatively, if your matching virtual machines are running in multiple subscriptions, you may want to change the reservation scope to shared. 

Managing a reservation by updating the scope of a reservation allows you to get the most optimal utilization.

## Changing scope for a reservation
The scope of the reservation governs which virtual machines get the reservation discount. The coverage of your reservation discount is dependent on the matching virtual machines running within the scope.

To update the scope of a reservation: 
1. Log in to the [Azure portal](https://portal.azure.com)
2. Select **More Services -> Reservations**
3. Select the reservation, and navigate to **Settings -> Configuration**
4. Change the scope from single to shared or vice versa. Note, when you change from shared to single, only subscriptions that you have "Owner" access within the same billing context as the reservation, can be selected. Also, the scope only applies to eligible subscription offers types. (For enterprise subscriptions - offer MS-AZR-0017P. For Pay-As-You-Go subscriptions - offer MS-AZR-0003P). For enterprise subscriptions, dev/test subscriptions are not eligible to get the reservation discount. For Pay-As-You-Go subscriptions only Pay-As-You-Go offer type is eligible to get the reservation discount, other subscriptions offer types created by the same account admin are not eligible.

## Splitting a single reservation into two reservations
 When you buy a reservation, all the instances that you specify in the quantity have one scope - either single subscription or shared. After you have bought a reservation, with quantity greater than one, you may want to assign the reservation to different subscriptions. For example, you purchased 10 Standard D2 VMs and specified the scope to be subscription1. You may now want to change the scope for 7 out of 10 to subscripton1 and 3 out of 10 to subscription2. Note, you can simplify the allocation to subscriptions by choosing shared scope. But for cost management or budgeting purposes, you may want to allocate quantities to specific subscriptions.

To distribute the quantity for more granular scope assignment, you can split a reservation. You can split a reservation into two reservations with quantities distributed though PowerShell, CLI, or through the API. After you split the reservation, you can change the scope of individual reservation through portal, PowerShell, CLI, or through the API

To split a reservation through Powershell cmdlets:
1. You can get the reservation order ID (you can also get the ID via Azure portal).
    ```powershell
    # Get the reservation orders you have access to
    Get-AzureRmReservationOrder
    ```
2. You can get the details of a reservation, including the quantity, which you plan to split.
    ```powershell
    Get-AzureRmReservation -ReservationOrderId a08160d4-ce6b-4295-bf52-b90a5d4c96a0 -ReservationId b8be062a-fb0a-46c1-808a-5a844714965a
    ```
3. You can split the reservation into two reservations distributing the quantity.
    ```powershell
    # Split the reservation. The sum of the quantity during split must equal the quantity in the reservation being split.
    Split-AzureRmReservation -ReservationOrderId a08160d4-ce6b-4295-bf52-b90a5d4c96a0 -ReservationId b8be062a-fb0a-46c1-808a-5a844714965a -Quantity 3,2
    ```
4. After you split the reservation into two, you can update the scope in the portal or through the powershell cmdlet.
    ```powershell
    Update-AzureRmReservation -ReservationOrderId a08160d4-ce6b-4295-bf52-b90a5d4c96a0 -ReservationId 5257501b-d3e8-449d-a1ab-4879b1863aca -AppliedScopeType Single -AppliedScope /subscriptions/15bb3be0-76d5-491c-8078-61fe3468d414
    ```

## Add or change users who can manage a reservation
Access to a reservation is managed independently of the subscriptions where the reservation discount is applied. By default, the purchaser and the account admin of the payer subscription are added into the “Owner” role on the reservation. You may want to delegate management of the reservation scope to additional users. Additional users can be added to manage a reservation, by adding them to a role on the reservation. 
1.	Log in to the [Azure portal](https://portal.azure.com)
2.	Select **More Services -> Reservation** to list reservations that you have access to.
3.	Select the reservation that you want to delegate access to other users
4.	Select **Access Control (IAM)** in the menu
5.	Select **Add > Role > Owner** (or a different role if you want to give limited access). Type the email address of the user you want to add as Owner, select the user, and then select **Save**.

## Need help? Contact support.
If you still have further questions, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.
