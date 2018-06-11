---
title: Manage Azure Reserved Instances - Azure Billing | Microsoft Docs
description: Learn how you can change subscription scope and manage access for Azure Reserved VM Instances. 
services: billing
documentationcenter: ''
author: vikramdesai01
manager: vikramdesai01
editor: ''

ms.service: billing
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/09/2018
ms.author: vikdesai
---
# Manage Reserved Instances

After you buy an Azure Reserved VM Instance, you may want to apply the Reserved Instance to a different subscription than the one specified during purchase. Alternatively, if your matching virtual machines are running in multiple subscriptions, you may want to change the Reserved Instance scope to shared. To maximize the Reserved Instance discount, make sure that the number of instances you bought matches the attributes and number of virtual machines that you have running. To learn more about Azure Reserved Instances, see [Save money by pre-paying for Azure virtual machines](https://go.microsoft.com/fwlink/?linkid=862121).

## Change the scope for a Reserved Instance
 Your Reserved Instance discount applies to virtual machines that match your Reserved Instance and run within the Reserved Instance scope. The scope of a Reserved Instance can be single subscription or all subscriptions in your billing context. If you set the scope to single subscription, the Reserved Instance is matched to running virtual machines in the selected subscription. If you set the scope to shared, Azure matches the Reserved Instance to virtual machines that run in all the subscriptions within the billing context. The billing context is dependent on the subscription used to buy the Reserved Instance. To learn more, see [Pre-pay for VMs with Reserved Instances](https://go.microsoft.com/fwlink/?linkid=861721).

To update the scope of a Reserved Instance: 
1. Log in to the [Azure portal](https://portal.azure.com).
2. Select **All Services** > **Reservations**.
3. Select the Reserved Instance.
4. Select **Settings** > **Configuration**.
5. Change the scope. If you change from shared to single scope, you can only select subscriptions where you are the owner. Only subscriptions within the same billing context as the Reserved Instance, can be selected. The billing context is determined by the subscription that you selected when the Reserved Instance was bought. The scope only applies to Pay-As-You-Go offer MS-AZR-0003P subscriptions and Enterprise offer MS-AZR-0017P subscriptions. For enterprise agreements, dev/test subscriptions are not eligible to get the Reserved Instance discount.

## Split a single Reserved Instance into two Reserved Instances
 After you buy more than one instance, you may want to assign instances within a Reserved Instance to different subscriptions. By default, all instances (quantity specified during the purchase) have one scope - either single subscription or shared. For example, you purchased 10 Standard D2 VMs and specified the scope to be subscription A. You may now want to change the scope for seven Reserved Instances to subscription A and the remaining 3 to subscription B. Splitting a Reserved Instance allows you to distribute instances for granular scope management. You can simplify the allocation to subscriptions by choosing shared scope. But for cost management or budgeting purposes, you can allocate quantities to specific subscriptions.

 You can split a Reserved Instance into two Reserved Instances though PowerShell, CLI, or through the API.

### Split a Reserved Instance by using PowerShell
1. Get the Reserved Instance order ID by running the following command:

    ```powershell
    # Get the Reserved Instance orders you have access to
    Get-AzureRmReservationOrder
    ```
2. Get the details of a Reserved Instance:

    ```powershell
    Get-AzureRmReservation -ReservationOrderId a08160d4-ce6b-4295-bf52-b90a5d4c96a0 -ReservationId b8be062a-fb0a-46c1-808a-5a844714965a
    ```
3. Split the Reserved Instance into two and distribute the instances:

    ```powershell
    # Split the Reserved Instance. The sum of the Reserved Instances, the quantity, must equal the total number of instances in the Reserved Instance that you're splitting.
    Split-AzureRmReservation -ReservationOrderId a08160d4-ce6b-4295-bf52-b90a5d4c96a0 -ReservationId b8be062a-fb0a-46c1-808a-5a844714965a -Quantity 3,2
    ```
1. You can update the scope by running the following command:

    ```powershell
    Update-AzureRmReservation -ReservationOrderId a08160d4-ce6b-4295-bf52-b90a5d4c96a0 -ReservationId 5257501b-d3e8-449d-a1ab-4879b1863aca -AppliedScopeType Single -AppliedScope /subscriptions/15bb3be0-76d5-491c-8078-61fe3468d414
    ```

## Add or change users who can manage a Reserved Instance
You can delegate management of a Reserved Instance by adding people to roles on the Reserved Instance. By default, the person that bought the Reserved Instance and the account administrator have the Owner role on the Reserved Instance. 

You can manage access to Reserved Instances independently from the subscriptions that get the Reserved Instance discount. When you give someone permissions to manage a Reserved Instance, that doesn't give them rights to manage the subscription. And if you give someone permissions to manage a subscription within the Reserved Instance's scope, that doesn't give them rights to manage the Reserved Instance.
 
To delegate access management for a Reserved Instance: 
1.	Log in to the [Azure portal](https://portal.azure.com).
2.	Select **All Services** > **Reservation** to list Reserved Instances that you have access to.
3.	Select the Reserved Instance that you want to delegate access to other users.
4.	Select **Access Control (IAM)** in the menu.
5.	Select **Add** > **Role** > **Owner** (or a different role if you want to give limited access). 
6. Type the email address of the user you want to add as Owner. 
7. Select the user, and then select **Save**.

## Next steps
To learn more about Azure Reserved Instances, see the following articles:

- [Save money on virtual machines with Azure Reserved Instances](billing-save-compute-costs-reservations.md)
- [Prepay for Virtual Machines with Reserved Instances](../virtual-machines/windows/prepay-reserved-vm-instances.md)
- [Understand how the Reserved Instance discount is applied](billing-understand-vm-reservation-charges.md)
- [Understand Reserved Instance usage for your Pay-As-You-Go subscription](billing-understand-reserved-instance-usage.md)
- [Understand Reserved Instance usage for your Enterprise enrollment](billing-understand-reserved-instance-usage-ea.md)
- [Windows software costs not included with Reserved Instances](billing-reserved-instance-windows-software-costs.md)

## Need help? Contact support

If you still have further questions, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.
