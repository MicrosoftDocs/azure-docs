---
title: Troubleshoot Azure enterprise cost views
description: Learn how to resolve any issues you might have with organizational cost views within the Azure portal.  
author: bandersmsft
ms.reviewer: amberb
ms.service: cost-management-billing
ms.topic: conceptual
ms.date: 02/13/2019
ms.author: banders
ms.custom: seodec18
---

# Troubleshoot enterprise cost views

Within enterprise enrollments, there are several settings that could cause users within the enrollment to not see costs.  These settings are managed by the enrollment administrator. Or, if the enrollment isn't bought directly through Microsoft, the settings are managed by the partner.  This article helps you understand what the settings are and how they impact the enrollment. These settings are independent of the Azure Role-based access control (RBAC) roles.

## Enable access to costs

Are you seeing a message Unauthorized, or *"Cost views are disabled in your enrollment."* when looking for cost information?
![Screenshot that shows "unauthorized" in Current Cost field for subscription.](./media/enterprise-mgmt-grp-troubleshoot-cost-view/unauthorized.png)

It might be for one of the following reasons:

1. You’ve bought Azure through an enterprise partner, and the partner didn't release pricing yet. Contact your partner to update the pricing setting within the [Enterprise portal](https://ea.azure.com).
2. If you’re an EA Direct customer, there are a couple of possibilities:
    * You're an Account Owner and your Enrollment Administrator disabled the **AO view charges** setting.  
    * You're a Department Administrator and your Enrollment Administrator disabled the **DA view charges** setting.
    * Contact your Enrollment Administrator to get access. The Enrollment Admin can update the settings in the [Enterprise portal](https://ea.azure.com/manage/enrollment).

      ![Screenshot that shows the Enterprise Portal Settings for view charges.](./media/enterprise-mgmt-grp-troubleshoot-cost-view/ea-portal-settings.png)

## Asset is unavailable

If you get an error message stating **This asset is unavailable** when trying to access a subscription or management group, then you don't have the correct role to view this item.  

![Screenshot that shows "asset is unavailable" message.](./media/enterprise-mgmt-grp-troubleshoot-cost-view/asset-not-found.png)

Ask your Azure subscription or management group administrator for access. For more information, see [Manage access using RBAC and the Azure portal](../../role-based-access-control/role-assignments-portal.md).

## Next steps
- If you have questions or need help, [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).
