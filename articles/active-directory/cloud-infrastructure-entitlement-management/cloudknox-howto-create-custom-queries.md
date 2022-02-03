---
title: Create a custom query in CloudKnox Permissions Management  
description: How to create a custom query in the Audit trail dashboard in CloudKnox Permissions Management.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 02/02/2022
ms.author: v-ydequadros
---

# Create a custom query 

> [!IMPORTANT]
> CloudKnox Permissions Management (CloudKnox) is currently in PREVIEW.
> Some information relates to a prerelease product that may be substantially modified before it's released. Microsoft makes no warranties, express or implied, with respect to the information provided here.

This article describes how you can use the Audit trail dashboard in CloudKnox Permissions Management (CloudKnox) to create custom queries that you can modify, save, and run as often as you want.

## Open the Audit trail dashboard

- In CloudKnox, select the **Audit trail** tab.

    CloudKnox displays the query options available to you.

## Create a custom query

1. In the **Audit trail** tab, select the authorization systems you want to search: 
    1. Select **Authorization system**.
    2. Select the authorization systems you want to search.
    3. Select **Apply**.
2. In **New Query**, enter query parameters.
3. To change your query, select **Edit** (the pencil icon), and then change the query parameters.
4. To change the parameter options, select the down arrow in each box to display a dropdown list of available selections. Then select the option you want.

    For example, to query by a date, select **Date** in the first box. In the second and third boxes, select the down arrow, and then select one of the date-related options.
5. To add parameters, select **Add**, select the down arrow in the first box to display a dropdown list of available selections. Then select the parameter you want.
6. To add more parameters to the same query, select **Add** (the plus sign), and from the first box, select **And** or **Or**. 

    Repeat this step for the second and third box to complete entering the parameters.
7. To change your selections, select **Reset** for the parameter you want to change, and then make your selections again.
8. When you’re ready to run your query, select **Search**.
9. To save the query, select **Save**.

    CloudKnox saves the query and adds it to the **Saved queries** list.

## Save the query under a new name

1. In the **Audit trail** tab, select the ellipses menu **(…)** on the far right and select **Save as**.
2. Enter a new name for the query, and then select **Save**.

    CloudKnox saves the query under the new name. Both the new query and the original query display in the **Saved queries** list.

## View a saved query

1. In the **Audit trail** tab, select the down arrow next to **Saved queries**.

    A list of saved queries appears.
2. Select the query you want to open.
3. To open the query with the authorization systems you saved with the query, select **Load with the saved authorization systems**.
4. To open the query with the authorization systems you have currently selected (which may be different from the ones you originally saved), select **Load with the currently selected authorization systems**.
5. Select **Load Queries**.

    CloudKnox displays details of the query. Select  query to see its details.

## Run a saved query

1. In the **Audit trail** tab, load the query you want to run.
2. Select the name of the query.

    CloudKnox displays the results of the query in a report.

## Delete a query

1. In the **Audit trail** tab, load the query you want to delete.
2. Select **Delete**.

    CloudKnox deletes the query. Deleted queries don't display in the **Saved queries** list.

## Rename a query

1. In the **Audit trail** tab, load the query you want to rename.
2. Select the ellipses menu **(…)** on the far right, and select **Rename**. 
3. Enter a new name for the query, and then select **Save**.

    CloudKnox saves the query under the new name. Both the new query and the original query display in the **Saved queries** list.

## Duplicate a query

1. In the **Audit trail** tab, load the query you want to duplicate.
2. Select the ellipses menu **(…)** on the far right, and then select **Duplicate**.

    CloudKnox creates a copy of the query. Both the copy of the query and the original query display in the **Saved queries** list.

    You can rename the original or copy of the query, change it, and save it without changing the other query.



## Next steps

- For information on how to view how users access information, see [View information on how users access information](cloudknox-ui-audit-trail.md).
- For information on how to filter and view user activity, see [Filter and query user activity](cloudknox-product-audit-trail.md).
- For information on how to generate an on-demand report from a custom query, see [Generate an on-demand report from a query](cloudknox-howto-audit-trail-results.md).