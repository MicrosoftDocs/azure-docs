---
title: Global Secure Access (preview) network traffic dashboard
description: Learn how to use the Global Secure Access (preview) network traffic dashboard.
author: shlipsey3
ms.author: sarahlipsey
manager: amycolannino
ms.topic: conceptual
ms.date: 05/15/2023
ms.service: network-access
ms.custom: 
---

# Global Secure Access (preview) network traffic dashboard

The Global Secure Access (preview) network traffic dashboard provides you with visualizations of the network traffic acquired by the Microsoft Entra Private and Microsoft Entra Internet Access services. The dashboard compiles the data from your network configurations, including devices, users, and tenants into several widgets that provide you with answers to the following questions:

- How many active devices are deployed on my network?
- Was there a recent change to the number of active devices?
- What are the most used applications?
- How many unique users are accessing the network across all my tenants?

This article describes each of the widgets and how you can use the data on the dashboard to monitor and improve your network configurations.

## How to access the dashboard

Viewing the Global Secure Access dashboard requires a Reports Reader role in Microsoft Entra ID. 

To access the dashboard:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com/#home).
1. Go to **Global Secure Access (preview)** > **Dashboard**.

    :::image type="content" source="media/concept-traffic-dashboard/traffic-dashboard.png" alt-text="Screenshot of the Private access profile, with the view applications link highlighted." lightbox="media/concept-traffic-dashboard/traffic-dashboard-expanded.png":::

## Relationship map

This widget provides a summary of how many users and devices are using the service and how many applications were secured through the service. 

- **Users**: The number of distinct users seen in the last 24 hours. The data uses the *user principal name (UPN)*.
- **Devices**: The number of distinct devices seen in the last 24 hours. The data uses the *device ID*.
- **Workloads**: The number of distinct destinations seen in the last 24 hours. The data uses fully qualified domain names (FQDNs) and IP addresses.

![Screenshot of the relationship map widget.](media/concept-traffic-dashboard/relationship-map.png)

## Product deployment

There are two product deployment widgets that look at the active and inactive devices that you have deployed.

- **Active devices**: The number of distinct device IDs seen in the last 24 hours and the % change during that time.
- **Inactive devices**: The number of distinct device IDs that were seen in the last seven days, but not during the last 24 hours. The % change during the last 24 hours is also displayed.

![Screenshot of the product deployment widget.](media/concept-traffic-dashboard/product-deployment.png)

## Product insights

There are two product insights widgets that look at your cross-tenant access and top used applications.

### Cross-tenant access

- **Sign-ins**: The number of sign-ins through Microsoft Entra ID to Microsoft 365 in the last 24 hours. This widget provides you with information about the activity in your tenant. 
- **Total distinct tenants**: The number of distinct tenant IDs seen in the last 24 hours.
- **Unseen tenants**: The number of distinct tenant IDs that were seen in the last 24 hours, but not in the previous seven days.
- **Users**: The number of distinct user sign-ins to other tenants in the last 24 hours. 
- **Devices**: The number of distinct devices that signed in to other tenants in the last 24 hours.

![Screenshot of the product insights widget.](media/concept-traffic-dashboard/product-insights.png)

### Top used destinations

The top-visited destinations are displayed in the second product insight widget. You can change this view to look at the following options:

- **Transactions**: Displayed by default and shows the total number of transactions in the last 24 hours. 
- **Users**: The number of distinct users (UPN) accessing the destination in the last 24 hours.
- **Devices**: The number of distinct device IDs accessing the destination in the last 24 hours.

![Screenshot of the top destinations widget with the number of transactions field highlighted.](media/concept-traffic-dashboard/product-insights-top-destinations.png)

[!INCLUDE [Public preview important note](./includes/public-preview-important-note.md)]

## Next steps

- [Explore the traffic logs](how-to-view-traffic-logs.md)
- [Access the audit logs](how-to-access-audit-logs.md)