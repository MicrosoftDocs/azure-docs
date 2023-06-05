---
title: Global Secure Access network traffic dashboard
description: Learn how to use the Global Secure Access network traffic dashboard.
author: shlipsey3
ms.author: sarahlipsey
manager: amycolannino
ms.topic: conceptual
ms.date: 05/15/2023
ms.service: network-access
ms.custom: 
---

# Global Secure Access network traffic dashboard

The Global Secure Access network traffic dashboard provides you with visualizations of the network traffic acquired by the Microsoft Entra Private and Microsoft Entra Internet Access services. The dashboard compiles the data from your network configurations, including devices, users, and tenants into several widgets that provide you with answers to the following questions:

- How many active devices are deployed on my network?
- Was there a recent change to the number of active devices?
- What are the most used applications?
- How many unique users are accessing the network across all my tenants?

This article describes each of the widgets and how you can use the data on the dashboard to monitor and improve your network configurations.

## How to access the dashboard

Viewing the Global Secure Access dashboard requires a Reports Reader role in Microsoft Entra ID. 

To access the dashboard:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com/#home) as a **Security Administrator** or **Global Administrator**.
1. Go to **Global Secure Access**.
1. Select **Network access** from the side menu.
1. Select **Dashboard**.

If you're accessing the dashboard for the first time, we recommend viewing the **Guided tour**. The widgets are categorized by network deployment, product deployment, and product insights.

## Relationship map

This widget provides a summary of how many users and devices are using the service and how many applications that were secured through the service. 

- **Users**: The number of distinct users seen in the last 24 hours. The data uses the *user principal name (UPN)*.
- **Devices**: The number of distinct devices seen in the last 24 hours. The data uses the *device ID*.
- **Applications**: The number of distinct destinations seen in the last 24 hours. The data uses fully qualified domain names (FQDNs) and IP addresses.

![Screenshot of the relationship map widget.](media/concept-traffic-dashboard/relationship-map.png)

## Product deployment

There are two product deployment widgets that look at the active and inactive devices that you have deployed.

- **Active devices**: The number of distinct device IDs seen in the last 24 hours and the % change during that time.
- **Inactive devices**: The number of distinct device IDs that were seen in the last 7 days, but not during the last 24 hours. The % change during the last 24 hours is also displayed.

![Screenshot of the product deployment widget.](media/concept-traffic-dashboard/product-deployment.png)

## Product insights

There are two product insights widgets that look at your cross-tenant access and top used applications.

### Cross-tenant access

- **Sign-ins**: The number of sign-ins through Microsoft Entra ID to Microsoft 365 in the last 24 hours.  provides you with information about the number of sign-ins, distinct tenant IDs, unseen tenants, distinct users signing in, and devices signing in. The widget also displays the top-visited destinations the devices are accessing.
- **Total distinct tenants**: The number of distinct tenant IDs seen in the last 24 hours.
- **Unseen tenants**: The number of distinct tenant IDs that were seen in the last 24 hours, but not in the previous 7 days.
- **Users**: The number of distinct user sign-ins to other tenants in the last 24 hours. 
- **Devices**: The number of distinct devices that signed in to other tenants in the last 24 hours.

![Screenshot of the product insights widget.](media/concept-traffic-dashboard/product-insights.png)

### Top used destinations

You can change this widget to view the top 5 destinations by users, devices, and transactions.

- **Default**: Total number of transactions in the last 24 hours. 
- **Users**: The number of distinct users (UPN) accessing the destination in the last 24 hours.
- **Devices**: The number of distinct device IDs accessing the destination in the last 24 hours.

![Screenshot of the top used destinations widget.](media/concept-traffic-dashboard/product-insights-top-destinations.png)

## Next steps

- [Explore the traffic logs](how-to-view-traffic-logs.md)
- [Access the audit logs](how-to-access-audit-logs.md)