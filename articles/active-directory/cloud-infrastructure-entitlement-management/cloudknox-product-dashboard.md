---
title: Microsoft CloudKnox Permissions Management - View data about authorization systems and account activity
description: How to view authorization system and account activity data on the CloudKnox dashboard in Microsoft CloudKnox Permissions Management.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 01/26/2022
ms.author: v-ydequadros
---

# View data about authorization systems and account activity

The Microsoft CloudKnox Permissions Management (CloudKnox) home page provides an overview of the authorization system and account activity being monitored. You can use this page to view data collected from your Amazon Web Services (AWS), Microsoft Azure, and Google Cloud Platform (GCP) authorization systems.

## View data about your authorization system

1. In CloudKnox, select **Dashboard**.
1. From the **Authorization systems** dropdown menu, select **AWS**, **Azure**, or **GCP**. 
1. Select the **Authorization system** box to display a **List** of accounts and **Folders** available to you. 
1. Select the accounts and folders you want, and then select **Apply**. 

   The **Permissions creep index (PCI)** chart appears. The number of days since it was last updated displays in the upper right corner. 

    The PCI graph displays a bubble in the upper right corner. The bubble displays the number of identities that are considered high risk. *High risk* refers to the number of users who have permissions that exceed their normal or required usage.

1. To display a list of the number of identities contributing to the **Low PCI**, **Medium PCI**, and **High PCI**, select the **List** icon for a column view of number of identities in the low, medium, and high PCI categories.

1. The **Highest PCI change** displays the authorization system name with the PCI number and the change number for the last seven days, if applicable.
 
1. To view all authorization system changes, select **View all**.

1. To return to the PCI graph, select the **Graph** icon in the upper right of the list box. 

For more information about the CloudKnox dashboard, see [View key statistics and data about your authorization system](cloudknox-ui-dashboard.md).

## View user data on the PCI heat map

The **Permissions creep index (PCI)** heat map shows the incurred risk of users with access to high-risk privileges. The distribution graph displays all the users who contribute to the privilege creep. It displays how many users contribute to a particular score. For example, if the score from the PCI chart is 14, the graph shows how many users have a score of 14.

- To view detailed data about a user, hover over the number.

    The PCI trend graph shows you the historical trend of the PCI score over the last 90 days. 

- To download the **PCI History** report, select **Download** (the down arrow icon).


## View information about users, roles, resources, and PCI trends

To view specific information about the following, select the number displayed on the heat map:

- **Users** - Displays the total number of users and how many fall into the high, medium, and low categories.
- **Roles** - Displays the total number of roles and how many fall into the high, medium, and low categories.
- **Resources** - Displays the total number of resources and how many fall into the high, medium, and low categories.
- **PCI trend** - Displays a line graph of the PCI trend over the last several weeks.

## View identity findings

The **Identity** section below the heat map on the left side of the page shows all the relevant findings about identities, including roles that can access secret information, roles that are inactive, over provisioned active roles, and so on. 

- To expand the full list of identity findings, select **All findings**.

## View resource findings

The **Resource** section below the heat map on the right side of the page shows all the relevant findings about resources. It includes unencrypted S3 buckets, open security groups, and so on.

## Next steps

- For more information about the CloudKnox dashboard, see [View key statistics and data about your authorization system](cloudknox-ui-dashboard.md).