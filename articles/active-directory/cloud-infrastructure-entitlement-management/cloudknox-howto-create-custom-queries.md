---
title: Microsoft CloudKnox Permissions Management - Create custom queries in the Audit Trail dashboard 
description: Microsoft CloudKnox Permissions Management - How to create custom queries in the Audit Trail dashboard.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 12/28/2021
ms.author: v-ydequadros
---

# Microsoft CloudKnox Permissions Management - Create custom queries in the Audit Trail dashboard

This topic describes how you can use the Audit Trail dashboard to create custom queries that you can modify, save, and run as often as you want.

## Open the Audit Trail dashboard

- In CloudKnox, select the **Audit Trail** tab.

    Cloudknox displays the query options available to you.

## Create a custom query

1. In the **Audit Trail** tab, select the authorization systems you want to search: 
    1. Select **Authorization System**.
    2. Select the authorization systems you want to search.
    3. Select **Apply**.
2. In **New Query**, enter a query.
3. To change your query, select **Edit** (the pencil icon), and then change the query parameters.
4. To change the parameter options, select the down arrow in each box to display a dropdown list of available selections. Then select the option you want.

    For example, to query by a date, select **Date** in the first box. Select the down arrow in the second and third boxes to display a dropdown list of available date-related options you can select.
5. To add parameters, select **Add**, select the down arrow in the first box to display a dropdown list of available selections. Then select the parameter you want.
6. To add additional parameters to the same query, select **Add** (the plus sign), and from the first box, select **And** or **Or**. 

    Repeat this step for the second and third box to complete entering the parameters.
7. To change your selections, select **Reset** for the parameter you want to change, and then make your selections again.
8. When you’re ready to run your query, select **Search**.
9. To save the query, select **Save**.

    Cloudknox saves the query and adds it to the **Saved Queries** list.

## Save the query under a new name

1. In the the **Audit Trail** tab, select the ellipses menu **(…)** on the far right and select **Save As**.
2. Enter a new name for the query, and then select **Save**.

    Cloudknox saves the query under the new name. Both the new query and the original query display in the **Saved Queries** list.

## View a saved query

1. In the the **Audit Trail** tab, select the down arrow next to **Saved Queries**.

    A list of saved queries appears.
2. Select the query you want to open.
3. To open the query with the authorization systems you saved with the query, select **Load with the saved authorization systems**.
4. To open the query with the authorization systems you have currently selected (which may be different from the ones you originally saved), select **Load with the currently selected authorization systems**.
5. Select **Load Queries**.

    CloudKnox displays details of the query. Select  query to see its details.

## Run a saved query

1. In the the **Audit Trail** tab, load the query you want to run.
2. Select the name of the query.
    CloudKnox displays the results of the query in a report.

## Delete a query

1. In the the **Audit Trail** tab, load the query you want to delete.
2. Select **Delete**.

    Cloudknox deletes the query. Deleted queries don't display in the **Saved Queries** list.

## Rename a query

1. In the the **Audit Trail** tab, load the query you want to rename.
2. Select the ellipses menu **(…)** on the far right, and select **Rename**. 
3. Enter a new name for the query, and then select **Save**.

    Cloudknox saves the query under the new name. Both the new query and the original query display in the **Saved Queries** list.

## Duplicate a query

1. In the the **Audit Trail** tab, load the query you want to duplicate.
2. Select the ellipses menu **(…)** on the far right, and then select **Duplicate**.

    Cloudknox creates a copy of the query. Both the copy of the query and the original query display in the **Saved Queries** list.

    You can rename the original or copy of the query, change it, and save it without changing the other query.

<!---## Next steps--->
<!---Use the Audit Trail dashboard to generate custom reports--->
