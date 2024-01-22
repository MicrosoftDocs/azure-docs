---
title: Process data from Event Hubs Azure using Stream Analytics | Microsoft Docs
description: This article shows you how to process data from your Azure event hub using an Azure Stream Analytics job. 
ms.date: 05/22/2023
ms.topic: how-to
---


# Process data from your event hub using Azure Stream Analytics 
The Azure Stream Analytics service makes it easy to ingest, process, and analyze streaming data from Azure Event Hubs, enabling powerful insights to drive real-time actions. You can use the Azure portal to visualize incoming data and write a Stream Analytics query. Once your query is ready, you can move it into production in only a few clicks. 

## Key benefits
Here are the key benefits of Azure Event Hubs and Azure Stream Analytics integration: 

- **Preview data** – You can preview incoming data from an event hub in the Azure portal.
- **Test your query** – Prepare a transformation query and test it directly in the Azure portal. For the query language syntax, see [Stream Analytics Query Language](/stream-analytics-query/built-in-functions-azure-stream-analytics) documentation.
- **Deploy your query to production** – You can deploy the query into production by creating and starting an Azure Stream Analytics job.

## End-to-end flow

> [!IMPORTANT]
> If you aren't a member of [owner](../role-based-access-control/built-in-roles.md#owner) or [contributor](../role-based-access-control/built-in-roles.md#contributor) roles at the Azure subscription level, you must be a member of the [Stream Analytics Query Tester](../role-based-access-control/built-in-roles.md#stream-analytics-query-tester) role at the Azure subscription level to successfully complete steps in this section. This role allows you to perform testing queries without creating a stream analytics job first. For instructions on assigning a role to a user, see [Assign AD roles to users](../active-directory/roles/manage-roles-portal.md).

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to your **Event Hubs namespace** and then navigate to the **event hub**, which has the incoming data. 
1. Select **Process Data** on the event hub page or select **Process data** on the left menu. 

    :::image type="content" source="./media/process-data-azure-stream-analytics/process-data-tile.png" alt-text="Screenshot showing the Process data page for the event hub." lightbox="./media/process-data-azure-stream-analytics/process-data-tile.png":::
1. Select **Start** on the **Enable real-time insights from events** tile. 

    :::image type="content" source="./media/process-data-azure-stream-analytics/process-data-page-explore-stream-analytics.png" alt-text="Screenshot showing the Process data page with Enable real time insights from events tile selected." lightbox="./media/process-data-azure-stream-analytics/process-data-page-explore-stream-analytics.png":::
1. You see a query page with values already set for the following fields:
    1. Your **event hub** as an input for the query.
    1. Sample **SQL query** with SELECT statement. 
    1. An **output** alias to refer to your query test results. 

        :::image type="content" source="./media/process-data-azure-stream-analytics/query-editor.png" alt-text="Screenshot showing the Query editor for your Stream Analytics query." lightbox="./media/process-data-azure-stream-analytics/query-editor.png":::
        
        > [!NOTE]
        >  When you use this feature for the first time, this page asks for your permission to create a consumer group and a policy for your event hub to preview incoming data.
1. Select **Create** in the **Input preview** pane as shown in the preceding image. 
1. You immediately see a snapshot of the latest incoming data in this tab.
    - The serialization type in your data is automatically detected (JSON/CSV). You can manually change it as well to JSON/CSV/AVRO.
    - You can preview incoming data in the table format or raw format. 
    - If your data shown isn't current, select **Refresh** to see the latest events. 

        Here's an example of data in the **table format**: 

        :::image type="content" source="./media/process-data-azure-stream-analytics/snapshot-results.png" alt-text="Screenshot of the Input preview window in the result pane of the Process data page in a table format." lightbox="./media/process-data-azure-stream-analytics/snapshot-results.png":::

        Here's an example of data in the **raw format**: 
    
        :::image type="content" source="./media/process-data-azure-stream-analytics/snapshot-results-raw-format.png" alt-text="Screenshot of the Input preview window in the result pane of the Process data page in the raw format." lightbox="./media/process-data-azure-stream-analytics/snapshot-results-raw-format.png":::
1. Select **Test query** to see the snapshot of test results of your query in the **Test results** tab. You can also download the results.

    :::image type="content" source="./media/process-data-azure-stream-analytics/test-results.png" alt-text="Screenshot of the Input preview window in the result pane with test results." lightbox="./media/process-data-azure-stream-analytics/test-results.png":::
1. Write your own query to transform the data. See [Stream Analytics Query Language reference](/stream-analytics-query/stream-analytics-query-language-reference).
1. Once you've tested the query and you want to move it in to production, select **Create Stream Analytics job**. 

    :::image type="content" source="./media/process-data-azure-stream-analytics/create-job-link.png" alt-text="Screenshot of the Query page with the Create Stream Analytics job link selected.":::
1. On the **New Stream Analytics job** page, follow these steps: 
    1. Specify a **name** for the job.
    1. Select your **Azure subscription** where you want the job to be created.
    1. Select the **resource group** for the Stream Analytics job resource.
    1. Select the **location** for the job.
    1. For the **Event Hubs policy name**, create a new policy or select an existing one.
    1. For the **Event Hubs consumer group**, create a new consumer group or select an existing consumer group.
    1. Select **Create** to create the Stream Analytics job. 

        :::image type="content" source="./media/process-data-azure-stream-analytics/create-stream-analytics-job.png" alt-text="Screenshot showing the New Stream Analytics job window.":::

        > [!NOTE] 
        >  We recommend that you create a consumer group and a policy for each new Azure Stream Analytics job that you create from the Event Hubs page. Consumer groups allow only five concurrent readers, so providing a dedicated consumer group for each job will avoid any errors that might arise from exceeding that limit. A dedicated policy allows you to rotate your key or revoke permissions without impacting other resources. 
1. Your Stream Analytics job is now created where your query is the same that you tested, and input is your event hub. 

    :::image type="content" source="./media/process-data-azure-stream-analytics/add-output-link.png" alt-text="Screenshot showing the Stream Analytics job page with a link to add an output.":::    
9.	Add an [output](../stream-analytics/stream-analytics-define-outputs.md) of your choice. 
1. Navigate back to Stream Analytics job page by clicking the name of the job in breadcrumb link. 
1. Select **Edit query** above the **Query** window.
1. Update `[OutputAlias]` with your output name, and select **Save query** link above the query. Close the Query page by selecting X in the top-right corner.  
1. Now, on the Stream Analytics job page, select **Start** on the toolbar to start the job.

    :::image type="content" source="./media/process-data-azure-stream-analytics/set-output-start-job.png" alt-text="Screenshot of the Start job window for a Stream Analytics job.":::


## Access
**Issue** : User can't access preview data because they don’t have right permissions on the Subscription.

Option 1: The user who wants to preview incoming data needs to be added as a Contributor on Subscription.

Option 2: The user needs to be added as Stream Analytics Query tester role on Subscription. Navigate to Access control for the subscription. Add a new role assignment for the user as "Stream Analytics Query Tester" role.

Option 3: The user can create Azure Stream Analytics job. Set input as this event hub and navigate to "Query" to preview incoming data from this event hub.

Option 4: The admin can create a custom role on the subscription. Add the following permissions to the custom role and then add user to the new custom role.

:::image type="content" source="./media/process-data-azure-stream-analytics/custom-role.png" alt-text="Screenshots showing Microsoft.StreamAnalytics permissions page." lightbox="./media/process-data-azure-stream-analytics/custom-role.png":::


## Streaming units
Your Azure Stream Analytics job defaults to three streaming units (SUs). To adjust this setting, select **Scale** on the left menu in the **Stream Analytics job** page in the Azure portal. To learn more about streaming units, see [Understand and adjust Streaming Units](../stream-analytics/stream-analytics-streaming-unit-consumption.md).


:::image type="content" source="./media/process-data-azure-stream-analytics/scale.png" alt-text="Screenshots showing the Scale page for a Stream Analytics job." lightbox="./media/process-data-azure-stream-analytics/scale.png":::

## Next steps
To learn more about Stream Analytics queries, see [Stream Analytics Query Language](/stream-analytics-query/built-in-functions-azure-stream-analytics)
