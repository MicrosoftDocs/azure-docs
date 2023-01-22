# Tutorial: Transform text logs during ingestion 

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
    - Do not allow circular logging, log rotation where the file is overwritten with new entries, or renaming where a file is moved and a new file with the same name is opened. 


## Write a KQL query to transform ingested data 

1. View the data in the target custom table in Log Analytics:
    1.  In the Azure portal, select **Log Analytics workspaces** > your Log Analytics workspace > **Logs**.
    1. Run a basic query the custom logs table to view table data.
1. Use the query window to write and test a query that transforms the raw data in your table.

    For information about the KQL operators that transformations support, see [Structure of transformation in Azure Monitor](../essentials/data-collection-transformations-structure.md#kql-limitations). 

    This query doesn't modify the actual data in the table. That's what the transformation will do during ingestion.

    **Example**
    
    The sample uses [basic KQL operators](/azure/data-explorer/kql-quick-reference) to parss the data in the `RawData` column into three new columns, called `Time Ingested`, `RecordNumber`, and `RandomContent`:
 
    - The `extend` operator adds new columns.  
    - The `project` operator formats the output to match the columns of the target table schema:  

    ```kusto 
    AwesomeLog1_CL  
    | extend d=todynamic(RawData)  
    | project TimeGenerated,TimeIngested=tostring(d.Time), 
    RecordNumber=tostring(d.RecordNumber), 
    RandomContent=tostring(d.RandomContent), 
    RawData 
    ```

1. Make the query a single line and copy it so you can paste it in the DCR UI. The ingestion-time transformation processes a single row at a time and `source` represents the row in the query. So, replace the table name with the word `source`:

    ```kusto 
    source | extend d=todynamic(RawData) | project TimeGenerated,TimeIngested=tostring(d.Time),RecordNumber=tostring(d.RecordNumber), RandomContent=tostring(d.RandomContent), RawData 
    ``` 
 
## Modify the custom table to include the new columns 

Go to Home > All resources > {workspace name} > Tables and select the ellipsis (three dots) next to your custom table. 

Add three new columns as Strings; TimeIngested, RecordNumber, RandomContent and save. 


## Apply Transform to DCR 

Go to Home > Monitor > Data collection Rules > {Your DCR}   

Open Custom Text Logs and Paste the KQL transform into the transform field.  Save and close 
 

## Check that the transform is working 

Open workspace in the Azure portal by going to Home > All resources > {workspace Name} 

Open Logs and close the Queries popup 

Query the custom logs table in the query tab. You should see all the columns from the transform. 


## Next steps 

- Learn more about Data Collection Transformations in Azure Monitor
- Learn more about data collection rules. 
- Learn more about data collection endpoints. 

 