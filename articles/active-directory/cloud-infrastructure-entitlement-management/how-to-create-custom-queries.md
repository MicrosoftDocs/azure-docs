---
title: Create a custom query in Microsoft Entra Permissions Management
description: How to create a custom query in the Audit dashboard in Microsoft Entra Permissions Management.
services: active-directory
author: jenniferf-skc
manager: amycolannino
ms.service: active-directory 
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 06/16/2023
ms.author: jfields
---

# Create a custom query

This article describes how you can use the **Audit** dashboard in Permissions Management to create custom queries that you can modify, save, and run as often as you want.

## Open the Audit dashboard

- In the Permissions Management home page, select the **Audit** tab.

    Permissions Management displays the query options available to you.

## Create a custom query

1. In the **Audit** dashboard, in the **New Query** subtab, select **Authorization System Type**, and then select the authorization systems you want to search: Amazon Web Services (**AWS**), Microsoft **Azure**, Google Cloud Platform (**GCP**), or Platform (**Platform**).
1. Select the authorization systems you want to search from the **List** and **Folders** box, and then select **Apply**.

1. In the **New Query** box, enter your query parameters, and then select **Add**.
    For example, to query by a date, select **Date** in the first box. In the second and third boxes, select the down arrow, and then select one of the date-related options.

1. To add parameters, select **Add**, select the down arrow in the first box to display a dropdown of available selections. Then select the parameter you want.
1. To add more parameters to the same query, select **Add** (the plus sign), and from the first box, select **And** or **Or**.

    Repeat this step for the second and third box to complete entering the parameters.
1. To change your query as you're creating it, select **Edit** (the pencil icon), and then change the query parameters.
1. To change the parameter options, select the down arrow in each box to display a dropdown of available selections. Then select the option you want.
1. To discard your selections, select **Reset Query** for the parameter you want to change, and then make your selections again.
1. When you're ready to run your query, select **Search**.
1. To save the query, select **Save**.

    Permissions Management saves the query and adds it to the **Saved Queries** list.

## Save the query under a new name

1. In the **Audit** dashboard, select the ellipses menu **(…)** on the far right and select **Save As**.
2. Enter a new name for the query, and then select **Save**.

    Permissions Management saves the query under the new name. Both the new query and the original query display in the **Saved Queries** list.

## View a saved query

1. In the **Audit** dashboard, select the down arrow next to **Saved Queries**.

    A list of saved queries appears.
2. Select the query you want to open.
3. To open the query with the authorization systems you saved with the query, select **Load with the saved authorization systems**.
4. To open the query with the authorization systems you have currently selected (which may be different from the ones you originally saved), select **Load with the currently selected authorization systems**.
5. Select **Load Queries**.

    Permissions Management displays details of the query in the **Activity** table. Select a query to see its details:

    - The **Identity Details**.
    - The **Domain** name.
    - The **Resource Name** and **Resource Type**.
    - The **Task Name**.
    - The **Date**.
    - The **IP Address**.
    - The **Authorization System**.

## View a raw events summary

1. In the **Audit** dashboard, select **View** (the eye icon) to open the **Raw Events Summary** box.

    The **Raw Events Summary** box displays **Username or Role Session Name**, the **Task name**, and the script for your query.
1. Select **Copy** to copy the script.
1. Select **X** to close the **Raw events summary** box.


## Run a saved query

1. In the **Audit** dashboard, select the query you want to run.

    Permissions Management displays the results of the query in the **Activity** table.

## Delete a query

1. In the **Audit** dashboard, load the query you want to delete.
2. Select **Delete**.

    Permissions Management deletes the query. Deleted queries don't display in the **Saved Queries** list.

## Rename a query

1. In the **Audit** dashboard, load the query you want to rename.
2. Select the ellipses menu **(…)** on the far right, and select **Rename**.
3. Enter a new name for the query, and then select **Save**.

    Permissions Management saves the query under the new name. Both the new query and the original query display in the **Saved Queries** list.

## Duplicate a query

1. In the **Audit** dashboard, load the query you want to duplicate.
2. Select the ellipses menu **(…)** on the far right, and then select **Duplicate**.

    Permissions Management creates a copy of the query. Both the copy of the query and the original query display in the **Saved Queries** list.

    You can rename the original or copy of the query, change it, and save it without changing the other query.



## Next steps

- For information on how to view how users access information, see [Use queries to see how users access information](ui-audit-trail.md).
- For information on how to filter and view user activity, see [Filter and query user activity](product-audit-trail.md).
- For information on how to generate an on-demand report from a query, see [Generate an on-demand report from a query](how-to-audit-trail-results.md).
