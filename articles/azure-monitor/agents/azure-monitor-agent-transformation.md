---
title: Transform text logs during ingestion in Azure Monitor Logs 
description: Write a KQL query that transforms text log data and add the transformation to a data collection rule in Azure Monitor Logs.
ms.topic: conceptual
ms.date: 07/19/2023
author: guywi-ms
ms.author: guywild
ms.reviewer: jeffwo
---
# Tutorial: Transform text logs during ingestion in Azure Monitor Logs

Ingestion-time transformations let you filter or modify incoming data before it's stored in a Log Analytics workspace. This article explains how to write a KQL query that transforms text log data and add the transformation to a data collection rule. 

The procedure described here assumes you've already ingested some data from a text file, as described in [Collect text logs with Azure Monitor Agent](../agents/data-collection-text-log.md). In this tutorial, you'll:

1. Write a KQL query to transform ingested data.
1. Modify the target table schema.
1. Add the transformation to your data collection rule.
1. Verify that the transformation works correctly. 

## Prerequisites 

To complete this procedure, you need: 

- Log Analytics workspace where you have at least [contributor rights](../logs/manage-access.md#azure-rbac).
- [Data collection rule](../essentials/data-collection-rule-overview.md), [data collection endpoint](../essentials/data-collection-endpoint-overview.md#create-a-data-collection-endpoint), and [custom table](../logs/create-custom-table.md#create-a-custom-table), as described in [Collect text logs with Azure Monitor Agent](../agents/data-collection-text-log.md). 
- A VM, Virtual Machine Scale Set, or Arc-enabled on-premises server that writes logs to a text file.
    Text file requirements:    
    - Store on the local drive of the machine on which Azure Monitor Agent is running. 
    - Delineate with an end of line. 
    - Use ASCII or UTF-8 encoding. Other formats such as UTF-16 aren't supported.
    - Don't allow circular logging, log rotation where the file is overwritten with new entries, or renaming where a file is moved and a new file with the same name is opened. 


## Write a KQL query to transform ingested data 

1. View the data in the target custom table in Log Analytics:
    1.  In the Azure portal, select **Log Analytics workspaces** > your Log Analytics workspace > **Logs**.
    1. Run a basic query the custom logs table to view table data.
1. Use the query window to write and test a query that transforms the raw data in your table.

    For information about the KQL operators that transformations support, see [Structure of transformation in Azure Monitor](../essentials/data-collection-transformations-structure.md#kql-limitations).
   
   > [!Note]
   > The only columns that are available to apply transforms against are TimeGenerated and RawData.  Other columns are added to the table automatically after the transformation and are not available at the time of transformation.
   > The _ResourceId column can't be used in the transformation.

    **Example**
    
    The sample uses [basic KQL operators](/azure/data-explorer/kql-quick-reference) to parse the data in the `RawData` column into three new columns, called `Time Ingested`, `RecordNumber`, and `RandomContent`:
 
    - The `extend` operator adds new columns.  
    - The `project` operator formats the output to match the columns of the target table schema:  

    ```kusto 
    MyTable_CL
    | extend d=todynamic(RawData)  
    | project TimeGenerated,TimeIngested=tostring(d.Time), 
    RecordNumber=tostring(d.RecordNumber), 
    RandomContent=tostring(d.RandomContent), 
    RawData 
    ```
    > [!NOTE]
    > Information the user should notice even if skimmingQuerying table data in this way doesn't actually modify the data in the table. Azure Monitor applies the transformation in the [data ingestion pipeline](../essentials/data-collection-transformations.md#how-transformations-work) after you [add your transformation query to the data collection rule](#apply-the-transformation-to-your-data-collection-rule).

1. Format the query into a single line and replace the table name in the first line of the query with the word `source`.
    
    For example:

    ```kusto 
    source | extend d=todynamic(RawData) | project TimeGenerated,TimeIngested=tostring(d.Time),RecordNumber=tostring(d.RecordNumber), RandomContent=tostring(d.RandomContent), RawData 
    ``` 

1. Copy the formatted query so you can paste it into the data collection rule configuration. 

## Modify the custom table to include the new columns 

[Add or delete columns in your custom table](../logs/create-custom-table.md#add-or-delete-a-custom-column), based on your transformation query.

The example transformation query above adds three new columns of type `string`: 
- `TimeIngested`
- `RecordNumber`
- `RandomContent`

To support this transformation, add these three new columns to your custom table.

:::image type="content" source="media/azure-monitor-agent-transformation/add-custom-columns-azure-monitor-logs.png" alt-text="Screenshot of the Schema editor pane with the TimeIngested, RecordNumber, and RandomContent columns being defined." lightbox="media/azure-monitor-agent-transformation/add-custom-columns-azure-monitor-logs.png":::

## Apply the transformation to your data collection rule 

1. On the **Monitor** menu, select **Data Collection Rules** > your data collection rule.
1. Select **Data sources** > your data source. 
1. Paste the formatted transformation query in the **Transform** field on the **Data source** tab of the **Add data source** screen.
1. Select **Save**.

    :::image type="content" source="media/azure-monitor-agent-transformation/add-transformation-to-data-collection-rule.png" alt-text="Screenshot of the Add data sources pane with the Transform field highlighted." lightbox="media/azure-monitor-agent-transformation/add-transformation-to-data-collection-rule.png":::

## Check that the transformation works 

View the data in the target custom table and check that data is being ingested correctly into the modified table:
1. In the Azure portal, select **Log Analytics workspaces** > your Log Analytics workspace > **Logs**.
1. Run a basic query the custom logs table to view table data.


## Next steps 

Learn more about: 
- [Data collection transformations](../essentials/data-collection-rule-structure.md).
- [Data collection rules](../essentials/data-collection-rule-overview.md). 
- [Data collection endpoints](../essentials/data-collection-endpoint-overview.md). 

 
