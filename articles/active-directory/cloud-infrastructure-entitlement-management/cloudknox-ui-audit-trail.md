---
title: Use queries to see how users access information in an authorization system in Entra Permissions Management
description: How to use queries to see how users access information in an authorization system in Entra Permissions Management.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: overview
ms.date: 02/23/2022
ms.author: v-campisekat
---

# Use queries to see how users access information

> [!IMPORTANT]
> Entra Permissions Management (Entra) is currently in PREVIEW.
> Some information relates to a prerelease product that may be substantially modified before it's released. Microsoft makes no warranties, express or implied, with respect to the information provided here.

The **Audit** dashboard in Entra Permissions Management (Entra) provides an overview of queries a Entra user has created to review how users access their authorization systems and accounts. 

This article provides an overview of the components of the **Audit** dashboard.

## View information in the Audit dashboard


1. In Entra, select the **Audit** tab.

    Entra displays the query options available to you.

1. The following options display at the top of the **Audit** dashboard: 

    - A tab for each existing query. Select the tab to see details about the query.
    - **New Query**: Select the tab to create a new query.
    - **New tab (+)**: Select the tab to add a **New Query** tab.
    - **Saved Queries**: Select to view a list of saved queries.

1. To return to the main page, select **Back to Audit Trail**.


## Use a query to view information  

1. In Entra, select the **Audit** tab.
1. The **New query** tab displays the following options:

    - **Authorization Systems Type**: A list of your authorization systems: Amazon Web Services (**AWS**), Microsoft Azure (**Azure**), Google Cloud Platform (**GCP**), or Platform (**Platform**).

    - **Authorization System**: A **List** of accounts and **Folders** in the authorization system.

        - To display a **List** of accounts and **Folders** in the authorization system, select the down arrow, and then select **Apply**.

1. To add an **Audit Trail Condition**, select **Conditions** (the eye icon), select the conditions you want to add, and then select **Close**.
    
1. To edit existing parameters, select **Edit** (the pencil icon).

1. To add the parameter that you created to the query, select **Add**.

1. To search for activity data that you can add to the query, select **Search** .

1. To save your query, select **Save**.

1. To save your query under a different name, select **Save As** (the ellipses **(...)** icon).

1. To discard your work and start creating a query again, select **Reset Query**.

1. To delete a query, select the **X** to the right of the query tab.



## Next steps

- For information on how to filter and view user activity, see [Filter and query user activity](cloudknox-product-audit-trail.md).
- For information on how to create a query,see [Create a custom query](cloudknox-howto-create-custom-queries.md).
- For information on how to generate an on-demand report from a query, see [Generate an on-demand report from a query](cloudknox-howto-audit-trail-results.md).
