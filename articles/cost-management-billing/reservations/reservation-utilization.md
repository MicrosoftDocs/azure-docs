---
title: View Azure reservation utilization
description: Learn how to get reservation utilization and details.
author: yashesvi
ms.reviewer: yashar
ms.service: cost-management-billing
ms.subservice: reservations
ms.topic: how-to
ms.date: 04/15/2021
ms.author: banders
---

# View reservation utilization after purchase

You can view reservation utilization percentage and the resources that used the reservation in the Azure portal and in the Cost Management Power BI app.

## View utilization in the Azure portal with Azure RBAC access

To view reservation utilization, you must have Azure RBAC access to the reservation or you must have elevated access to manage all Azure subscriptions and management groups.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to [Reservations](https://portal.azure.com/#blade/Microsoft_Azure_Reservations/ReservationsBrowseBlade).
1. The list shows all the reservations where you have the Owner or Reader role. Each reservation shows the last known utilization percentage.
1. Select the utilization percentage to see the utilization history and details. The following video shows an example.
   > [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE4sYwk] 

## View utilization as billing administrator

An Enterprise Agreement (EA) administrator or a Microsoft Customer Agreement (MCA) billing administrator can view the utilization from **Cost Management + Billing**.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to **Cost Management + Billing** > **Reservations**.
1. Select the utilization percentage to see the utilization history and details.

## Get reservations and utilization using APIs, PowerShell, and CLI

You can get the [reservation utilization](/rest/api/billing/enterprise/billing-enterprise-api-reserved-instance-usage) using the Reserved Instance usage API.

## See reservations and utilization in Power BI

There are two options for Power BI users:

- Azure Cost Management connector for Power BI Desktop - Reservation purchase date and utilization data are available in the [Azure Cost Management connector for Power BI Desktop](/power-bi/desktop-connect-azure-cost-management). Create the reports you want by using the connector.
- Azure Cost Management Power BI App - Use the [Azure Cost Management Power BI App](https://appsource.microsoft.com/product/power-bi/costmanagement.azurecostmanagementapp) for pre-created reports that you can further customize.

## Next steps

- [Manage Azure Reservations](manage-reserved-vm-instance.md).
- [Understand reservation usage for your Pay-As-You-Go subscription](understand-reserved-instance-usage.md).
- [Understand reservation usage for your Enterprise enrollment](understand-reserved-instance-usage-ea.md).
- [Understand reservation usage for CSP subscriptions](/partner-center/azure-reservations).
