---
title: Microsoft CloudKnox Permissions Management - View key statistics and data about your authorization system on the CloudKnox dashboard
description: How to view View  statistics and data about your authorization system in the Microsoft CloudKnox Permissions Management dashboard.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: overview
ms.date: 01/26/2022
ms.author: v-ydequadros
---

# View key statistics and data about your authorization system

Microsoft CloudKnox Permissions Management (CloudKnox) provides a dashboard that summarizes and updates key statistics and data about your authorization system on a regular basis. This dashboard is available for Amazon Web Services (AWS), Microsoft Azure, and Google Cloud Platform (GCP).

## View metrics related to avoidable risk

The data provided by CloudKnox shows metrics related to avoidable risk. These metrics allow the CloudKnox administrator to quickly and easily identify areas where they can reduce risks related to the principle of least privilege.

You can view the following data on the CloudKnox dashboards:

- The **PCI heat map** on the CloudKnox **Dashboard** identifies:
    - The number of users who have been granted high-risk privileges aren't using them.
    - The number of users who contribute to the privilege creep index and where they appear on the scale.

- The **Usage analytics summary** on the **Usage analytics** dashboard provides a snapshot of permission metrics within the last 90 days.


## Components of the CloudKnox Dashboard

When you launch CloudKnox, select **Dashboard** to displays the following information:

- **Authorization system types** - A drop-down list of authorization system types you can access: Amazon Web Services (AWS), Microsoft Azure (Azure), nd Google Cloud Platform (GCP).
 
- **Authorization systems** - Displays a **List** of accounts and **Folders** in the selected authorization system you can access.

- **Privilege creep index (PCI)** - A graph displaying the **# of identities contributing to PCI** and the related PRIVILEGE CREEP INDEX.

    The PCI graph displays a bubble in the upper right corner. The bubble displays the number of identities that are considered high risk. *High-risk* refers to the number of users who have permissions that exceed their normal or required usage.
    - To display a list of the number of identities contributing to the **Low PCI**, **Medium PCI**, and **High PCI**, select the list icon in the upper right of the graph.
    - To display the privilege creep index graph again, select the graph icon in the upper right of the list box. 

- **Highest PCI change** - A list of your accounts, the privilege creep index, and the change in the index over the past 7 days.
    - To download the list, select the down arrow in the upper right of the list box.

        The following message displays: **We'll email you a link to download the file.** 
        - Check your email for the message from the CloudKnox Customer Success Team. The email contains a link to the **PCI history** report in Microsoft Excel format.
        <!---Ad Link reports@cloudknox.io---> 
        - The email also includes a link to the **Reports** dashboard, where you can configure how and when you want to receive reports automatically.
    - To view all the changes in the privilege creep index, select **View all**.

- **Identity** - A summary of the **Findings** that includes the number of identities that are:
    - **Inactive roles** - A list of roles that haven"t been accessed in over 90 days.
    - **Roles that can access secret information** - A list of roles that can access secret information.
    - **Over-provisioned active roles** - A list of roles that have more permissions than they currently access.
    - **Resources that can access secret information** - A list of resources that can access secret information.
    - **Roles with privilege escalation** - A list of roles that can increase privileges.

    To view the list to all findings, select **All findings**.

- **Resources** - A summary of the **Findings** that includes the number of resources that are:
    - **Open security groups**
    - **Instances with access to S3 buckets**
    - **Unencrypted S3 buckets**
    - **SSE-S3 Encrypted buckets**
    - **S3 Bucket accessible externally** 



## The PCI heat map

The **Privilege creep index**  heat map shows the incurred risk of users with access to high-risk privileges, and is a function of:

- Users who were given access to high-risk privileges but aren't actively using them. High-risk privileges include the ability to modify or delete contents within the authorization system.

- The number of resources a user has access to, otherwise known as resource reach.

- The high-risk privileges coupled with the number of resources a user has access to produce the score seen on the chart. They're classified as high, medium, and low.

    - **High** (displayed in red) - The score is between 68 and 100. A user has access to many high-risk privileges they aren't using, and has high resource reach.
    - **Medium** (displayed in yellow) - The score is between 34 and 67. A user has access to some high-risk privileges that they use, or have medium resource reach.
    - **Low** (displayed in green) - The score is between 0 and 33. A user has access to fewer high-risk privileges. They use all of them, and have low resource reach.

- The number displayed on the graph shows how many users contribute to a particular score. To view detailed data about a user, hover over the number. 

    The distribution graph displays all the users who contribute to the privilege creep. It displays how many users contribute to a particular score. For example, if the score from the privilege creep index chart is 14, the graph shows how many users have a score of 14.

- The PCI Trend graph shows you the historical trend of the privilege creep index score over the last 90 days. To download the **PCI history report**, select the **Download** icon.

### View information on the heat map

To view detailed information about the following, select the number displayed on the heat map:

- **Users** - Displays the total number of users and how many fall into the high, medium, and low categories.
- **Roles** - Displays the total number of roles and how many fall into the high, medium, and low categories.
- **Resources** - Displays the total number of resources and how many fall into the high, medium, and low categories.
- **PCI trend** - Displays a line graph of the privilege creep index trend over the last several weeks.

- The **Identity** section below the heat map on the left side of the page shows all the relevant findings about identities, including roles that can access secret information, roles that are inactive, over provisioned active roles, and so on. 

    - To expand the full list of identities, select **All findings**.

- The **Resource** section below the heat map on the right side of the page shows all the relevant findings about resources. It includes unencrypted S3 buckets, open security groups, and so on.
- 
<!---Is this still in?

## The Usage analytics summary

The **Usage Analytics summary** section on the [Usage analytics dashboard](cloudknox-ui-usage-analytics.md) provides a snapshot of the following high-risk tasks or actions users have accessed, and displays the total number of users with the high-risk access, how many users are inactive or have unexecuted tasks, and how many users are active or have executed tasks:

- **Users with access to high-risk tasks** - Displays the total number of users with access to a high risk task (**Total**), how many users have access but haven't used the task (**Inactive**), and how many users are actively using the task (**Active**).

- **Users with access to delete tasks** - A subset of high-risk tasks, which displays the number of users with access to delete tasks (**Total**), how many users have the delete privilege but haven't used the privilege (**Inactive**), and how many users are actively executing the delete capability (**Active**).

- **High-risk tasks accessible by users** - Displays all available high-risk tasks in the authorization system (**Granted**), how many high-risk tasks aren't used (**Unexecuted**), and how many high-risk tasks are used (**Executed**).

- **Delete tasks accessible by users** - Displays all available delete tasks in the authorization system (**Granted**), how many delete tasks aren't used (**Unexecuted**), and how many delete tasks are used (**Executed**).

- **Resources that permit high-risk tasks** - Displays the total number of resources a user has access to (**Total**), how many resources are available but not used (**Inactive**), and how many resources are used (**Active**).

- **Resources that permit delete tasks** - Displays the total number of resources that permit delete tasks (**Total**), how many resources with delete tasks aren't used (**Inactive**), and how many resources with delete tasks are used (**Active**).--->



## Next steps

- For information on how to view authorization system and account activity data on the CloudKnox dashboard, see [View authorization system and account activity on the CloudKnox dashboard](cloudknox-product-dashboard.md).
- For an overview of the Usage Analytics dashboard, see [An overview of the Usage analytics  dashboard](cloudknox-ui-usage-analytics.md).


<!---For an overview of the The Audit Trail dashboard, see [The CloudKnox dashboard](cloudknox-audit-trail-dashboard.html).--->
<!---For an overview of the JEP Controller dashboard, see [The JEP Controller dashboard](cloudknox-ui-jep-controller.html).--->
<!---For an overview of the The Compliance dashboard, see [The Compliance dashboard](cloudknox-ui-compliance.html).--->
<!---For an overview of the The Reports dashboard, see [The Reports dashboard](cloudknox-ui-reports.html).--->
<!---For an overview of the The Autopilot dashboard, see [The Autopilot dashboard](cloudknox-ui-autopilot.html).--->