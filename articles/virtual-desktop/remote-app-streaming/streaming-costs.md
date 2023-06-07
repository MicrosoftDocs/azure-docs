---
title: Estimate per-user app streaming costs for Azure Virtual Desktop - Azure
description: How to estimate per-user billing costs for Azure Virtual Desktop.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: how-to
ms.date: 07/14/2021
ms.author: helohr
manager: femila
---

# Estimate per-user app streaming costs for Azure Virtual Desktop

Per-user access pricing for Azure Virtual Desktop lets you grant access to apps and desktops hosted with Azure Virtual Desktop to users outside of your organization. To learn more about per-user access pricing for Azure Virtual Desktop, see [Understanding licensing and per-user access pricing](licensing.md). This article will show you how to estimate user access costs for your deployment, assuming full pricing.

>[!NOTE]
>The prices in this article are based on full price per-user subscriptions without promotional offers or discounts. Also, keep in mind that there are additional costs associated with an Azure Virtual Desktop deployment, such as infrastructure consumption costs. To learn more about these other costs, see [Understanding total Azure Virtual Desktop deployment costs](total-costs.md).

## Requirements

Before you can estimate per-user access costs for an existing deployment, you’ll need the following things:

- An Azure Virtual Desktop deployment that's had active users within the last month.
- [Azure Virtual Desktop Insights for your Azure Virtual Desktop deployment](../insights.md)

## Measure monthly user activity in a host pool

In order to estimate total costs for running a host pool, you'll first need to know the number of active users over the past month. You can use Azure Virtual Desktop Insights to find this number.

To check monthly active users on Azure Virtual Desktop Insights:

1. Open the Azure portal, then search for and select **Azure Virtual Desktop**. After that, select **Insights** to open Azure Virtual Desktop Insights.

2. Select the name of the subscription or host pool that you want to measure.

3. On the **Overview** tab, find the **Monthly users (MAU)** chart in the **Utilization** section.

4. Check the monthly active users (MAU) value for the most recent date. The MAU shows how many users connected to this host pool within the last 28 days before that date.

## Estimate per-user access costs for an Azure Virtual Desktop host pool

Next, we'll check the amount billed per billing cycle. This number is determined by how many users connected to at least one session host in your enrolled subscription.

Additionally, there are two price tiers for users:

- Users that only connect to RemoteApp application groups.
- Users that connect to at least one desktop application group.

You can estimate the total cost by checking how many users in each pricing tier connected to session hosts in your subscription.

To check the number of users in each tier:

1. Go to the [Azure Virtual Desktop pricing page](https://azure.microsoft.com/pricing/details/virtual-desktop/#pricing) and look for the "Apps" and "Desktops + apps" prices for your region.
2. Use the connection volume number you found in step 4 of [Measure monthly activity in a host pool](#measure-monthly-user-activity-in-a-host-pool) to calculate the total user access cost.
   
   If your host pool uses a RemoteApp application group, you'll need to multiply the connection volume by the price value you see in "Apps." In other words, you'll need to use this equation:

   Connection volume x "Apps" price per user = total cost

   If your host pool uses a Desktop application group, multiply it by the "Apps + Desktops" price per user instead, like this:

   Connection volume x "Apps + Desktops" price per user = total cost

>[!IMPORTANT]
>Depending on your environment, the actual price may be very different from the estimate following these instructions will give you. For example, the estimate might be higher than the real cost because your users access resources from multiple host pools but you're only charged once per user each billing cycle. The estimate might also underestimate the costs if the user activity during the 28-day time window you're basing your data on doesn't match your typical monthly user activity. For example, a month with a week-long holiday or a major service outage will have lower-than-average user activity and won't give you an accurate estimate.

## Next steps

If you're interested in learning about estimating total costs for an entire Azure Virtual Desktop deployment, see [Understanding total Azure Virtual Desktop deployment costs](total-costs.md). To learn about licensing requirements and costs, see [Understanding licensing and per-user access pricing](licensing.md).
