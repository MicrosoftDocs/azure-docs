---
title: Microsoft CloudKnox Permissions Management - View information about users, roles, and resources
description: How to view information about users, roles, and resources on the CloudKnox dashboard in Microsoft CloudKnox Permissions Management.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 01/24/2022
ms.author: v-ydequadros
---

# View permission metrics on the CloudKnox dashboard

The Microsoft CloudKnox Permissions Management (CloudKnox) dashboard provides an overview of the authorization system and account activity being monitored.

## Navigate the CloudKnox dashboard

1. From the authorization systems dropdown menu, select **AWS**, **Azure**, or **GCP**. 
2. From the **Authorization System** box, select the metrics you want to view from the **List** of accounts and **Folders**. Then select **Apply**. 

   The PCI chart updates according to the selected authorization system. It displays the date and time it was last updated in the upper right-hand corner.

3. To view the **Usage Analytics** tab, under the **Privilege Creep Index** gauge, select the number next to **Users that contributed to your index**. 

    For more information about the Usage Analytics tab, see [Usage Analytics](cloudknox-ui-usage-analytics.md).

4. To view the PCI chart view of the metrics, select the **Graph** icon from the middle section of the top of the screen.

    Or, select the **List** icon for a column view of number of identities in the Low, Medium, and High PCI categories. 

5. The **Highest PCI Change** column displays the authorization system name with the PCI number and the change number for the last seven days, if applicable. 
6. To view all authorization system changes, select **View All**.

## View user data on the Privilege Creep Index

The **Privilege Creep Index** heat map shows the incurred risk of users with access to high-risk privileges. The distribution graph displays all the users who contribute to the privilege creep. It displays how many users contribute to a particular score. For example, if the score from the privilege creep index chart is 14, the graph shows how many users have a score of 14.

    - To view detailed data about a user, hover over the number.

        The Privilege Creep Index Trend graph shows you the historical trend of the privilege creep index score over the last 90 days. 

    - To download the Privilege Creep Index History Report, select the **Download** icon.


## View information about users, roles, resources, and the PCI Trend

To view specific information about the following, select the number displayed on the heat map:

- **Users** - Displays the total number of users and how many fall into the high, medium, and low categories.
- **Roles** - Displays the total number of roles and how many fall into the high, medium, and low categories.
- **Resources** - Displays the total number of resources and how many fall into the high, medium, and low categories.
- **PCI Trend** - Displays a line graph of the PCI trend over the last several weeks.

The **Identity** section below the heat map on the left side of the page shows all the relevant findings about identities, including roles that can access secret information, roles that are inactive, over provisioned active roles, and so on. 

- To expand the full list, select **All Findings**.

The **Resource** section below the heat map on the right side of the page shows all the relevant findings about resources. It includes unencrypted S3 buckets, open security groups, and so on.

<!---## Next steps--->