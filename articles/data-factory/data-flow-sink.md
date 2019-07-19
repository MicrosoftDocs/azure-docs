---
title:  Set up a sink transformation in the Mapping Data Flow feature of Azure Data Factory 
description: Learn how to set up a sink transformation in the Mapping Data Flow.
author: kromerm
ms.author: makromer
ms.service: data-factory
ms.topic: conceptual
ms.date: 02/03/2019
---

# Sink transformation for a data flow

[!INCLUDE [notes](../../includes/data-factory-data-flow-preview.md)]

After you transform your data flow, you can sink the data into a destination dataset. In the sink transformation, choose a dataset definition for the destination output data. You can have as many sink transformations as your data flow requires.

To account for schema drift and changes in incoming data, sink the output data to a folder without a defined schema in the output dataset. You can also account for column changes in your sources by selecting **Allow schema drift** in the source. Then automap all fields in the sink.

![Options on the Sink tab, including the Auto Map option](media/data-flow/sink1.png "sink 1")

To sink all incoming fields, turn on **Auto Map**. To choose the fields to sink to the destination, or to change the names of the fields at the destination, turn off **Auto Map**. Then open the **Mapping** tab to map output fields.

![Options on the Mapping tab](media/data-flow/sink2.png "sink 2")

## Output 
For Azure Blob storage or Data Lake Storage sink types, output the transformed data into a folder. Spark generates partitioned output data files based on the partitioning scheme that the sink transformation uses. 

You can set the partitioning scheme from the **Optimize** tab. If you want Data Factory to merge your output into a single file, select **Single partition**.

![Options on the Optimize tab](media/data-flow/opt001.png "sink options")

## Field mapping

On the **Mapping** tab of your sink transformation, you can map the incoming columns on the left to the destinations on the right. When you sink data flows to files, Data Factory will always write new files to a folder. When you map to a database dataset, you can generate a new table that uses this schema by setting  **Save Policy** to **Overwrite**. Or insert new rows in an existing table and then map the fields to the existing schema. 

![The Mapping tab](media/data-flow/sink2.png "Sinks")

In the mapping table, you can multiselect to link multiple columns, delink multiple columns, or map multiple rows to the same column name.

To always map the incoming set of fields to a target as they are and to fully accept flexible schema definitions, select **Allow schema drift**.

![The Mapping tab, showing fields mapped to columns in the dataset](media/data-flow/multi1.png "multiple options")

To reset your column mappings, select **Re-map**.

![The Sink tab](media/data-flow/sink1.png "Sink One")

Select **Validate schema** to fail the sink if the schema changes.

Select **Clear the folder** to truncate the contents of the sink folder before writing the destination files in that target folder.

## File name options

Set up file naming: 

   * **Default**: Allow Spark to name files based on PART defaults.
   * **Pattern**: Enter a pattern for your output files. For example, **loans[n]** will create loans1.csv, loans2.csv, and so on.
   * **Per partition**: Enter one file name per partition.
   * **As data in column**: Set the output file to the value of a column.
   * **Output to a single file**: With this option, ADF will combine the partitioned output files into a single named file. To use this option, your dataset should resolve to a folder name. Also, please be aware that this merge operation can possibly fail based upon node size.

> [!NOTE]
> File operations start only when you're running the Execute Data Flow activity. They don't start in Data Flow Debug mode.

## Database options

Choose database settings:

* **Update method**: The default is to allow inserts. Clear **Allow insert** if you want to stop inserting new rows from your source. To update, upsert, or delete rows, first add an alter-row transformation to tag rows for those actions. 
* **Recreate table**: Drop or create your target table before the data flow finishes.
* **Truncate table**: Remove all rows from your target table before the data flow finishes.
* **Batch size**: Enter a number to bucket writes into chunks. Use this option for large data loads. 
* **Enable staging**: Use PolyBase when you load Azure Data Warehouse as your sink dataset.

![The Settings tab, showing SQL sink options](media/data-flow/alter-row2.png "SQL Options")

> [!NOTE]
> In Data Flow, you can direct Data Factory to create a new table definition in your target database. To create the table definition, set a dataset in the sink transformation that has a new table name. In the SQL dataset, below the table name, select **Edit** and enter a new table name. Then, in the sink transformation, turn on **Allow schema drift**. Set **Import schema** to **None**.

![SQL dataset settings, showing where to edit the table name](media/data-flow/dataset2.png "SQL Schema")

> [!NOTE]
> When you update or delete rows in your database sink, you must set the key column. This setting allows the alter-row transformation to determine the unique row in the data movement library (DML).

## Next steps

Now that you've created your data flow, add a [Data Flow activity to your pipeline](concepts-data-flow-overview.md).
