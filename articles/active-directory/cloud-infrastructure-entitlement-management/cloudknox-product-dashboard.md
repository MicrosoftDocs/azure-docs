---
title: Microsoft CloudKnox Permissions Management product integration - ServiceNow
description: How to configure and use ServiceNow.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 12/08/2021
ms.author: v-ydequadros
---

# Microsoft CloudKnox Permissions Management product integration - ServiceNow

Microsoft CloudKnox Permissions Management provides a visual, operational dashboard that summarizes and updates key statistics and data about an authorization system on an hourly basis. This dashboard is available for Amazon Web Services (AWS), Google Cloud Platform (GCP), Microsoft Azure, and vCenter Server virtual machine.

This data shows metrics related to avoidable risk, and allows the CloudKnox administrator to quickly and easily identify areas in which risk can be reduced regarding the principle of least privilege.

## The CloudKnox dashboard

The CloudKnox dashboard contains the following information:

- Privilege Creep Index (PCI) gauge/chart - The gauge identifies how many high-risk privileges have been granted to users and in which are not being utilized, and the chart conveys how many users are contributing to the PCI and where they are on the scale.

- Usage analytics summary – Provides a snapshot of permission metrics within the last 90 days.

## How to navigate the dashboard

1. From the first dropdown menu, select between **AWS**, **Azure**, **GCP**, or **VCENTER**. 
2. From the **Authorization System** dropdown, select the appropriate authorization system and click **Apply** to view the metrics. 

   The PCI chart is updated according to the authorization system selected, and will show the date and time it was last updated in the upper right-hand corner.
3. To redirect the user to the **Usage Analytics** tab, under the **Privilege Creep Index** gauge, click the number next to **Users that contributed to your index**. 

    For more information, see [Usage Analytics]() for instructions on using this screen.
4. To view the PCI chart view of the metrics, click the **Graph** icon from the middle section of the top of the screen.

    Or, click the **List** icon for a column view of number of identities in the Low, Medium, and High PCI categories. 
5. The far right column displays **Highest PCI Change** for the last 7 days and shows the Authorization system name with the PCI number and the change number, if applicable. 
6. To view all authorization system changes, click **View All** at the bottom of the box.

## How to read the dashboard

1. The **Privilege Creep Index** heat map shows the incurred risk of users with access to high-risk privileges, and is a function of:

	- Users who were given access to high-risk privileges but are not actively using them (that is, the capability to modify or delete contents within the authorization system).

	- The number of resources a user has access to, otherwise known as resource reach.

	- The high-risk privileges coupled with the number of resources a user has access to produces the score seen on the gauge, and are classified as high, medium, and low:

	- High (red) - Score it between 68 and 100 - Users have access to many high-risk privileges but are not using them, and/or have high resource reach.

	- Medium (yellow) - Score is between 34 and 67 - Users have access to some high-risk privileges and use some of them, or they have medium resource reach.

	- Low (green) - Score is between 0 and 33 - Users have access to fewer high-risk privileges, they are using all their high-risk privileges and/or they have low resource reach.

	- The number displayed on the graph shows how many users are contributing to the pci, and shows how many users contribute to a particular score. Hover over the number displayed to show specific data.

   The distribution graph to the right of the gauge maps out all the users who are contributing to the pci, and shows how many users contribute to a particular score. For example, if the score from the PCI gauge is 14, the graph shows how many users have a score of 14.

2. The PCI Trend graph shows you the historical trend of the PCI score over the last 90 days. To download the PCI History Report, click the **Download** icon.

3. The **Usage Analytics Summary** section provides a snapshot of the following high-risk tasks or actions users have accessed, and displays the total number of users with the high-risk access, how many users are inactive or have unexecuted tasks, and how many users are active or have executed tasks:

	- **Users with Access to High Risk Tasks** - Displays the total number of users with access to a high risk task (Total), how many users have access but have not used the task (Inactive), and how many users are actively using the task (Active).

	- **Users with Access to Delete Tasks** - A subset of high-risk tasks, which displays the number of users with access to delete tasks (Total), how many users have the delete privilege but have not used the privilege (Inactive), and how many users are actively executing the delete capability (Active).

	- **High Risk Tasks Accessible by Users** - Displays all available high-risk tasks in the authorization system (Granted), how many high-risk tasks are not used (Unexecuted), and how many high-risk tasks are being used (Executed).

	- **Delete Tasks Accessible by Users** - Displays all available delete tasks in the authorization system (Granted), how many delete tasks are not used (Unexecuted), and how many delete tasks are being used (Executed).

	- **Resources that Permit High Risk Tasks** - Displays the total number of resources a user has access to (Total), how many resources are available but not utilized (Inactive), and how many resources are being used (Active).

	- **Resources that Permit Delete Tasks** - Displays the total number of resources that permit delete tasks (Total), how many resources with delete tasks are not being utilized (Inactive), and how many resources with delete tasks are being used (Active).


4. To view specific information about the following, click the number displayed on the heat map:
	- **Users** - Displays the total number of users and how many fall into the high, medium, and low categories.
	- **Roles** - Displays the total number of roles and how many fall into the high, medium, and low categories.
	- **Resources** - Displays the total number of resources and how many fall into the high, medium, and low categories.
	- **PCI Trend** - Displays a line graph of the PCI trend over the last several weeks.

5. The **Identity** section below the heat map on the left side of the page shows all the relevant findings about identities, including roles that can access secret information, roles that are inactive, over provisioned active roles, and so on. 

   - To expand the full list, click **All Findings**.
6. The **Resource** section below the heat map on the right side of the page shows all the relevant findings about resources, including unencrypted S3 buckets, open security groups, and so on.

<!---## Next steps--->