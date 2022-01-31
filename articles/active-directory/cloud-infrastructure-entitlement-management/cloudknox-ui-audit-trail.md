---
title: View information on how users access information in an authorization system in Microsoft CloudKnox Permissions Management
description: How to view how users access information in an authorization system in Microsoft CloudKnox Permissions Management.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: overview
ms.date: 01/31/2022
ms.author: v-ydequadros
---

# View information on how users access information

The **Audit trail** dashboard in Microsoft CloudKnox Permissions Management (CloudKnox) provides an overview of queries a CloudKnox user has created to review how users access their authorization systems and accounts. 

This article provides an overview of the components of the **Audit trail** dashboard.

## View information in the Audit trail dashboard


1. In CloudKnox, select the **Audit trail** tab.

    CloudKnox displays the query options available to you.

1. The following options display at the top of the **Audit trail** dashboard: 

    - A tab for each existing query - Select the tab to see details about the query.
    - **New query** tab - Select the tab to create a new query.
    - **New tab (+)** - Select the tab to add a **New query** tab.
    - **Saved queries** - Select to view a list of saved queries.

1. To return to the main page, select **Back to Audit trail**.


## Use a query to view information  

The **New query** tab displays the following options:

- **Authorization systems type** - A list of your authorization systems: Amazon Web Services (**AWS**), Microsoft Azure (**Azure**), or Google Cloud Platform (**GCP**).

- **Authorization system** - A **List** of accounts and **Folders** in the authorization system.
 
    - To display a **List** of accounts and **Folders** that you can include in your query:

    - Select the down arrow to display a **List** of accounts and **Folders** in the authorization system. Then select **Apply**.

    - Query parameters you can add to a new or existing query.

    - To add or modify the query parameters for your new query:

    - To add an **Audit trail Condition**, select **Conditions** (the eye icon), and then select the conditions you want to add. Then select **Close**.
    
    - To edit existing parameters, select **Edit** (the pencil icon).

    - To add the parameter you created to the query, select **Add**.

    - To search for activity data you can add to the query, select **Search** .

    - To save your query, select **Save**.

    - To save your query under a different name, select **Save As** (the ellipses **(...)** icon).

    - To discard your work and start creating a query again, select **Reset query**.

    - To delete a query, select the **X** to the right of the query tab.



## Next steps

- For information on how to filter and view user activity, see [Filter and query user activity](cloudknox-product-audit-trail.md).
- For information on how to create a query,see [Create a custom query](cloudknox-howto-create-custom-queries.md).
- For information on how to generate an on-demand report from a custom query, see [Generate an on-demand report from a query](cloudknox-howto-audit-trail-results.md).