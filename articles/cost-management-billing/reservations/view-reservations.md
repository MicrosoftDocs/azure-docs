---
title: View reservations for Azure resources
description: Learn how to view Azure reservations in the Azure portal. See reservations and utilization by using APIs, PowerShell, CLI, and Power BI.
author: yashesvi
ms.reviewer: yashar
ms.service: cost-management-billing
ms.subservice: reservations
ms.topic: how-to
ms.date: 12/08/2020
ms.author: banders
---

# View Azure reservations

This article explains how to view Azure reservations in the Azure portal. You can view and manage a purchased reservation in the Azure portal.

## Permissions to view a reservation

The following users can view and manage reservations:

Two users get the Owner role for the reservation order and the reservation. The owners are the user that bought the reservation and the billing account administrator of the subscription where the reservation was bought. Both users can view and manage reservations.

To allow other people to view the reservation, you must add them as an **Owner** or a **Reader** for the Reservation order or the reservation. Adding someone to the subscription where the reservation was bought doesn't automatically add them to the reservation.

### Enterprise Agreement 

There are additional permissions related to Enterprise Agreement (EA) only. Users with the _Enterprise Administrator_ role can view and manage all reservation orders and reservations that apply to the Enterprise Agreement. Users with _Enterprise Administrator (read only)_ role can only view the reservation. 

To view or manage reservations:

1. Go to **Cost Management + Billing** and then on left side of the page, select **Reservation Transactions**.
2. If you have the required billing permissions, you can view and manage reservations. If you don't see any reservations, make sure that you're signed in using the Azure AD tenant where the reservations were created. 

Department admins and account owners can't view reservations _unless_ they're explicitly added to them using Access control (IAM). For more information, see [Managing Azure Enterprise roles](../manage/understand-ea-roles.md).

Enterprise Administrators can take ownership a reservation order and can add other users a reservation using Access control (IAM). 

### Microsoft Customer Agreement

There are additional permissions related to Microsoft Customer Agreement only. Users with the billing profile owner role or the billing profile contributor role can manage all reservation purchases made using the billing profile. Billing profile readers and invoice managers can view all reservations that are paid for with the billing profile. However, they can't make changes to reservations. 

To view or manage reservations:

1. Go to **Cost Management + Billing** and then on the left side of the page, select **Reservation Transactions**.
2. If you have the required billing permissions, you can view and manage reservations. If you don't see any reservations, make sure that you're signed in using the Azure AD tenant where the reservations were created. 

For more information, see [Billing profile roles and tasks](../manage/understand-mca-roles.md#billing-profile-roles-and-tasks)

## View reservation and utilization in the Azure portal

To view a reservation as an Owner or Reader

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Go to [Reservations](https://portal.azure.com/#blade/Microsoft_Azure_Reservations/ReservationsBrowseBlade).
3. The list shows all the reservations where you have the Owner or Reader role. Each reservation shows the last known utilization percentage.
4. Select the utilization percentage to see the utilization history and details. See details in the video below.
   > [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE4sYwk] 

## Get reservations and utilization using APIs, PowerShell, and CLI

Get list of all reservations using the following resources:

- [API: Reservation Order - List](/rest/api/reserved-vm-instances/reservationorder/list)
- [PowerShell: Reservation Order - List](/powershell/module/azurerm.reservations/get-azurermreservationorder)
- [CLI: Reservation Order - List](/cli/azure/reservations/reservation-order#az-reservations-reservation-order-list)

You can also get the [reservation utilization](/rest/api/billing/enterprise/billing-enterprise-api-reserved-instance-usage) using the Reserved Instance usage API. 

## See reservations and utilization in Power BI

There are two options for Power BI users
- Content Pack: Reservation purchase date and utilization data are available in the [Consumption Insights Power BI content pack](/power-bi/desktop-connect-azure-cost-management). Create the reports you want by using the content pack. 
- Cost management app: Use the [Cost Management App](https://appsource.microsoft.com/product/power-bi/costmanagement.azurecostmanagementapp) for pre-created reports that you can further customize.

## Need help? Contact us

If you have questions or need help, [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps

- [Manage Azure Reservations](manage-reserved-vm-instance.md).
- [Understand reservation usage for your Pay-As-You-Go subscription](understand-reserved-instance-usage.md).
- [Understand reservation usage for your Enterprise enrollment](understand-reserved-instance-usage-ea.md).
- [Understand reservation usage for CSP subscriptions](/partner-center/azure-reservations).

