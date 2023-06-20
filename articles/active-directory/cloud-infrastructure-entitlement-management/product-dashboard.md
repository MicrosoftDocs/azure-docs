---
title: View data about the activity in your authorization system
description: How to view data about the activity in your authorization system in the Microsoft Entra Permissions Management Dashboard.
services: active-directory
author: jenniferf-skc
manager: amycolannino
ms.service: active-directory 
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 06/19/2023
ms.author: jfields
---

# View data about the activity in your authorization system

The Permissions Management **Dashboard** provides an overview of the authorization system and account activity being monitored. Use this dashboard to view data collected from your Amazon Web Services (AWS), Microsoft Azure, and Google Cloud Platform (GCP) authorization systems.

## View data about your authorization system

1. From the Permissions Management home page, select **Dashboard**.
1. From the **Authorization systems type** dropdown, select **AWS**, **Azure**, or **GCP**.
1. Select the **Authorization System** box to display a **List** of accounts and **Folders** available to you.
1. Select the accounts and folders you want, and then select **Apply**.

   The **Permission Creep Index (PCI)** chart updates to display information about the accounts and folders you selected. The number of days since the information was last updated displays in the upper right corner.

   >[!NOTE]
   >Default and GCP-managed service accounts are not included in the PCI calculation.

1. In the Permission Creep Index (PCI) graph, select a bubble.

    The bubble displays the number of identities that are considered high-risk.

    *High-risk* refers to the number of users who have permissions that exceed their normal or required usage.

1. Select the box to display detailed information about the identities contributing to the **Low PCI**, **Medium PCI**, and **High PCI**.

1. The **Highest PCI change** displays the authorization system name with the PCI number and the change number for the last seven days, if applicable.

    - To view all the changes and PCI ratings in your authorization system, select **View all**.

1. To return to the PCI graph, select the **Graph** icon in the upper right of the list box.

For more information about the Permissions Management **Dashboard**, see [View key statistics and data about your authorization system](ui-dashboard.md).

## View user data on the PCI heat map

The **Permission Creep Index (PCI)** heat map shows the incurred risk of users with access to high-risk privileges. The distribution graph displays all the users who contribute to the privilege creep. It displays how many users contribute to a particular score. For example, if the score from the PCI chart is 14, the graph shows how many users have a score of 14.

- To view detailed data about a user, select the number.

    The PCI trend graph shows you the historical trend of the PCI score over the last 90 days.

- To download the **PCI History** report, select **Download** (the down arrow icon).


## View information about users, roles, resources, and PCI trends

To view specific information about the following, select the number displayed on the heat map.

- **Users**: Displays the total number of users and how many fall into the high, medium, and low categories.
- **Roles**: Displays the total number of roles and how many fall into the high, medium, and low categories.
- **Resources**: Displays the total number of resources and how many fall into the high, medium, and low categories.
- **PCI trend**: Displays a line graph of the PCI trend over the last several weeks.

## View identity findings

The **Identity** section below the heat map on the left side of the page shows all the relevant findings about identities, including roles that can access secret information, roles that are inactive, over provisioned active roles, and so on.

- To expand the full list of identity findings, select **All findings**.

## View resource findings

The **Resource** section below the heat map on the right side of the page shows all the relevant findings about your resources. It includes unencrypted S3 buckets, open security groups, managed keys, and so on.

## Next steps

- For more information about how to view key statistics and data in the Dashboard, see [View key statistics and data about your authorization system](ui-dashboard.md).
