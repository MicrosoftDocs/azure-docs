---
title: View Azure Advisor recommendations that matter to you
description: View and filter Azure Advisor recommendations to reduce noise.
services: advisor
author: kasparks
ms.service: advisor
ms.topic: article
ms.date: 04/03/2019
ms.author: kasparks
---

# View Azure Advisor recommendations that matter to you

Azure Advisor provides recommendations to help you optimize your Azure deployments. Within Advisor, you have access to a few features that will help you to narrow down your recommendations to only those that matter to you.

## Configure subscriptions and resource groups

Advisor gives you the ability to select Subscriptions and Resource Groups that matter to you and your organization. You will only see recommendations for the subscriptions and resource groups that you select. By default, all are selected. Configuration settings apply to the subscription or resource group, so the same settings will apply to everyone that has access to that subscription or resource group. Configuration settings can be changed in the Azure portal or programmatically.

To make changes in the Azure portal:

1. Open [Azure Advisor](https://aka.ms/azureadvisordashboard) in the Azure portal.

1. Select **Configuration** from the menu.

   ![Advisor configuration menu](./media/view-recommendations/configuration.png)

1. Check the box in the **Include** column for any subscriptions or resource groups to receive Advisor recommendations. If the box is disabled, you may not have permission to make a configuration change on that subscription or resource group. Learn more about [permissions in Azure Advisor](TODO).

1. Click **Apply** at the bottom after you make a change

## Filtering your view in the Azure portal

Configuration settings will remain applied to Advisor until they changed. If you want to limit your view of recommendations for a single viewing, you can use the drop downs provided at the top of the Advisor blades. From the Overview, High Availability, Security, Performance, Cost, and All Recommendation blades, you can select the Subscriptions, Resource Types, and recommendation status that you want to see. 

    ![Advisor filtering menu](./media/view-recommendations/filtering.png)


## Dismissing and postponing recommendations

Azure Advisor allows you to dismiss or postpone recommendations on a single resource. If you dismiss a recommendation, you will not see it again unless you manually activate it, however, postponing a recommendation will allow you to specify a duration after which the recommendation will automatically be activated again. This can be done in the Azure portal or programmatically.

To postpone or dismiss a single recommendation in the Azure portal: 

1. Open [Azure Advisor](https://aka.ms/azureadvisordashboard) in the Azure portal.
1. Select a recommendation category to view your recommendations
1. Select a recommendation from the list of recommendations
1. Select Postpone or Dismiss for the recommendation you want to postpone or dismiss

     ![Advisor filtering menu](./media/view-recommendations/filtering5.png)

To postpone or dismiss a multiple recommendation in the Azure portal: 

1. Open Azure Advisor in the Azure portal
2. Select a recommendation category to view your recommendations
3. Select a recommendation from the list of recommendations
4. Select the checkbox at the left of the row for all resources you want to postpone or dismiss the recommendation

     ![Advisor filtering menu](./media/view-recommendations/filtering5.png)

5. Select Postpone or Dismiss at the top left of the table

     ![Advisor filtering menu](./media/view-recommendations/filtering5.png)

> [!NOTE]
> You will need contributor or owner permission to dismiss or postpone a recommendation. Learn more about permissions in Azure Advisor.

Note: If the selection boxes are disabled, recommendations may still be loading. Please wait for all recommendations to load before trying to postpone or dismiss.

You can activate a recommendation that has been postponed or dismissed. This can be done in the Azure portal or programmatically. To do this in the Azure portal:

1. Open Azure Advisor in the Azure portal
1. Change the filter on the Overview blade to Postponed. This will show you if you have any postponed or dismissed recommendations.

    ![Advisor filtering menu](./media/view-recommendations/filtering5.png)

1. Select a category to see Postponed and Dismissed recommendations.
1. Select a recommendation from the list of recommendations. This will open that recommendation with the Postponed & Dismissed tab already selected to show the resources for which this recommendation has been postponed or dismissed.

     ![Advisor filtering menu](./media/view-recommendations/filtering5.png)

1. Click on Activate at the end of the row. Once clicked, the recommendation will be active for that resource, so it will be removed from this table. It will now be visible in the Active tab.
 
     ![Advisor filtering menu](./media/view-recommendations/filtering5.png)

## Learn more

This article explains how you can view recommendations that matter to you in Azure Advisor. To learn more about Advisor, see: 

- [What is Azure Advisor?](advisor-overview.md)
- [Getting Started with Advisor](advisor-get-started.md)
- [Permissions in Azure Advisor]()



