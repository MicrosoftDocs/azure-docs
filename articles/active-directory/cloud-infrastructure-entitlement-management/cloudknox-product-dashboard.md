---
title: Microsoft CloudKnox Permissions Management dashboard - How to read information on the CloudKnox dashboard
description: How to read information on the Microsoft CloudKnox Permissions Management dashboard.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 01/03/2022
ms.author: v-ydequadros
---

# Microsoft CloudKnox Permissions Management - How to read information on the CloudKnox dashboard

Microsoft CloudKnox Permissions Management provides a visual, operational dashboard that summarizes and updates key statistics and data about an authorization system on an hourly basis. This dashboard is available for Amazon Web Services (AWS), Google Cloud Platform (GCP), Microsoft Azure, and vCenter Server virtual machine.

This data shows metrics related to avoidable risk. It allows the CloudKnox administrator to quickly and easily identify areas to reduce risks related to the principle of least privilege.

The CloudKnox dashboard contains two main components:

- Privilege Creep Index (PCI) gauge/chart - The PCI gauge identifies how many users who have been granted high-risk privileges aren't using them. The PCI chart identifies how many users are contributing to the PCI and where they're on the scale.

- Usage analytics summary – Provides a snapshot of permission metrics within the last 90 days.

## How to navigate the CloudKnox dashboard

1. From the first dropdown menu, select between **AWS**, **Azure**, **GCP**, or **VCENTER**. 
2. From the **Authorization System** dropdown, select the appropriate authorization system and select **Apply** to view the metrics. 

   The PCI chart is updated according to the selected authorization system. It displays the date and time it was last updated in the upper right-hand corner.
3. To redirect the user to the **Usage Analytics** tab, under the **Privilege Creep Index** gauge, select the number next to **Users that contributed to your index**. 

    For more information, see Usage Analytics for instructions on using this screen.
4. To view the PCI chart view of the metrics, select the **Graph** icon from the middle section of the top of the screen.

    Or, select the **List** icon for a column view of number of identities in the Low, Medium, and High PCI categories. 
5. The far right column displays **Highest PCI Change** for the last seven days and shows the Authorization system name with the PCI number and the change number, if applicable. 
6. To view all authorization system changes, select **View All** at the bottom of the box.

## How to read the Privilege Creep Index

The **Privilege Creep Index** heat map shows the incurred risk of users with access to high-risk privileges, and is a function of:

- Users who were given access to high-risk privileges but aren't actively using them. High-risk privileges include the ability to modify or delete contents within the authorization system.

- The number of resources a user has access to, otherwise known as resource reach.

- The high-risk privileges coupled with the number of resources a user has access to produce the score seen on the gauge. They are classified as high, medium, and low:

- High (red) - The score is between 68 and 100. A user has access to many high-risk privileges they aren't using, and has high resource reach.

- Medium (yellow) - The score is between 34 and 67. A user has access to some high-risk privileges that they use, or have medium resource reach.

- Low (green) - The score is between 0 and 33. A user has access to fewer high-risk privileges. They use all of them, and have low resource reach.

- The number displayed on the graph shows how many users contribute to the PCI. It shows how many users contribute to a particular score. Hover over the number to view specific data.

    The distribution graph displays all the users who contribute to the PC. It displays how many users contribute to a particular score. For example, if the score from the PCI gauge is 14, the graph shows how many users have a score of 14.

The PCI Trend graph shows you the historical trend of the PCI score over the last 90 days. To download the PCI History Report, select the **Download** icon.

## How to read the Usage Analytics Summary

The **Usage Analytics Summary** section provides a snapshot of the following high-risk tasks or actions users have accessed, and displays the total number of users with the high-risk access, how many users are inactive or have unexecuted tasks, and how many users are active or have executed tasks:

- **Users with Access to High Risk Tasks** - Displays the total number of users with access to a high risk task (**Total**), how many users have access but haven't used the task (**Inactive**), and how many users are actively using the task (**Active**).

- **Users with Access to Delete Tasks** - A subset of high-risk tasks, which displays the number of users with access to delete tasks (**Total**), how many users have the delete privilege but haven't used the privilege (**Inactive**), and how many users are actively executing the delete capability (**Active**).

- **High Risk Tasks Accessible by Users** - Displays all available high-risk tasks in the authorization system (**Granted**), how many high-risk tasks aren't used (**Unexecuted**), and how many high-risk tasks are used (**Executed**).

- **Delete Tasks Accessible by Users** - Displays all available delete tasks in the authorization system (**Granted**), how many delete tasks aren't used (**Unexecuted**), and how many delete tasks are used (**Executed**).

- **Resources that Permit High Risk Tasks** - Displays the total number of resources a user has access to (**Total**), how many resources are available but not used (**Inactive**), and how many resources are used (**Active**).

- **Resources that Permit Delete Tasks** - Displays the total number of resources that permit delete tasks (**Total**), how many resources with delete tasks aren't used (**Inactive**), and how many resources with delete tasks are used (**Active**).

## How to view information about users, roles, resources, and the PCI Trend

To view specific information about the following, select the number displayed on the heat map:
- **Users** - Displays the total number of users and how many fall into the high, medium, and low categories.
- **Roles** - Displays the total number of roles and how many fall into the high, medium, and low categories.
- **Resources** - Displays the total number of resources and how many fall into the high, medium, and low categories.
- **PCI Trend** - Displays a line graph of the PCI trend over the last several weeks.

The **Identity** section below the heat map on the left side of the page shows all the relevant findings about identities, including roles that can access secret information, roles that are inactive, over provisioned active roles, and so on. 

- To expand the full list, select **All Findings**.

The **Resource** section below the heat map on the right side of the page shows all the relevant findings about resources. It includes unencrypted S3 buckets, open security groups, and so on.

<!---## Next steps--->