---
title: View reservations for Azure resources| Microsoft Docs
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

You can view and manage the purchased reservation from the Azure portal.

## Permissions to view a reservation

Following users can view and manage reservations
- Users who purchase the reservation and the account administrator of the subscription used for billing the reservation get the Owner role on the reservation order and the reservation. To allow other people to view the reservation, you must add them as an **Owner** or **Reader** on the Reservation order or reservation. Adding someone to the subscription that's provided for billing the reservation, does not add them to reservation automatically.
- Additional permissions related to Enterprise Agreement (EA) only : Users with "Enterprise Administrator" role can view and manage all reservations that are applying to the Enterprise agreement, users with "Enterprise Administrator (read only)" role can only view the reservation. Go to Cost Management + Billing > Reservation Transactions, and click on the banner, if you have required billing permissions you will be able to see and manage reservations. If you dont see reservations, make sure that you are logged in using the AAD tenant under which the reservations are created. Department admins and account owners cannot see reservations unless they are explicitly added to them using IAM. See [Managing Azure Enterprise roles](https://docs.microsoft.com/azure/cost-management-billing/manage/understand-ea-roles)
- Additional permissions related to Microsoft cloud agreement (MCA) only: Users with billing profile owner or billing profile contributor roles can manage all reservations  purchases made using the billing profile. Billing profile readers and invoice managers can view all reservations that are paid using the billing profile but cannot make changes to the reservations. Go to Cost Management + Billing > Billing Profile > Reservation Transactions and click on the banner to see reservation. Make sure that you are logged in using the AAD tenant under which the reservations are created, otherwise you will not see the reservations. See [Billing profile roles and tasks](https://docs.microsoft.com/azure/cost-management-billing/manage/understand-mca-roles#billing-profile-roles-and-tasks)

For more information, see [Add or change users who can manage a reservation](manage-reserved-vm-instance.md#add-or-change-users-who-can-manage-a-reservation).

## View reservation and utilization in the Azure portal

To view a reservation as an Owner or Reader

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Go to [Reservations](https://portal.azure.com/#blade/Microsoft_Azure_Reservations/ReservationsBrowseBlade).
3. The list will shows all the reservations where you have the Owner or Reader role. Each reservation shows the last known utilization percentage.
4. Click on the utilization percentage to see the utilization history and details. See details in the video below.
   > [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE4sYwk] 

## Get reservations and utilization using APIs, PowerShell, CLI

Get list of all reservations using following resources
- [API: Reservation Order - List](/rest/api/reserved-vm-instances/reservationorder/list)
- [PowerShell: Reservation Order - List](/powershell/module/azurerm.reservations/get-azurermreservationorder)
- [CLI: Reservation Order - List](/cli/azure/reservations/reservation-order#az-reservations-reservation-order-list)

You can also get the [reservation utilization](/rest/api/billing/enterprise/billing-enterprise-api-reserved-instance-usage) using the Reserved Instance usage API. 

## See reservations and utilization in Power BI

There are two options for Power BI users
- Content Pack: Reservation purchases and utilization data is available in the [Consumption Insights Power BI content pack](/power-bi/desktop-connect-azure-cost-management). Create the reports you want using this content pack. 
- Cost management app: Use the [Cost Management App](https://appsource.microsoft.com/product/power-bi/costmanagement.azurecostmanagementapp) for pre-created reports that you can further customize.

## Next steps

- [Manage Azure Reservations](manage-reserved-vm-instance.md).
- [Understand reservation usage for your Pay-As-You-Go subscription](understand-reserved-instance-usage.md)
- [Understand reservation usage for your Enterprise enrollment](understand-reserved-instance-usage-ea.md)
- [Understand reservation usage for CSP subscriptions](/partner-center/azure-reservations)

## Need help? Contact us

If you have questions or need help,  [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).
