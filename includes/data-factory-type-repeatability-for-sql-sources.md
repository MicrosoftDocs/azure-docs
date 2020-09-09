---
author: linda33wj
ms.service: data-factory
ms.topic: include
ms.date: 11/09/2018
ms.author: jingwang
---
## Repeatability during Copy
When copying data to Azure SQL/SQL Server from other data stores one needs to keep repeatability in mind to avoid unintended outcomes. 

When copying data to Azure SQL/SQL Server Database, copy activity will by default APPEND the data set to the sink table by default. For example, when copying data from a CSV (comma separated values data) file source containing two records to Azure SQL/SQL Server Database, this is what the table looks like:

```
ID    Product        Quantity    ModifiedDate
...    ...            ...            ...
6    Flat Washer    3            2015-05-01 00:00:00
7     Down Tube    2            2015-05-01 00:00:00
```

Suppose you found errors in source file and updated the quantity of Down Tube from 2 to 4 in the source file. If you re-run the data slice for that period, you’ll find two new records appended to Azure SQL/SQL Server Database. The below assumes none of the columns in the table have the primary key constraint.

```
ID    Product        Quantity    ModifiedDate
...    ...            ...            ...
6    Flat Washer    3            2015-05-01 00:00:00
7     Down Tube    2            2015-05-01 00:00:00
6    Flat Washer    3            2015-05-01 00:00:00
7     Down Tube    4            2015-05-01 00:00:00
```

To avoid this, you will need to specify UPSERT semantics by leveraging one of the below 2 mechanisms stated below.

> [!NOTE]
> A slice can be re-run automatically in Azure Data Factory as per the retry policy specified.
> 
> 

### Mechanism 1
You can leverage **sqlWriterCleanupScript** property to first perform cleanup action when a slice is run. 

```json
"sink":  
{ 
  "type": "SqlSink", 
  "sqlWriterCleanupScript": "$$Text.Format('DELETE FROM table WHERE ModifiedDate >= \\'{0:yyyy-MM-dd HH:mm}\\' AND ModifiedDate < \\'{1:yyyy-MM-dd HH:mm}\\'', WindowStart, WindowEnd)"
}
```

The cleanup script would be executed first during copy for a given slice which would delete the data from the SQL Table corresponding to that slice. The activity will subsequently insert the data into the SQL Table. 

If the slice is now re-run, then you will find the quantity is updated as desired.

```
ID    Product        Quantity    ModifiedDate
...    ...            ...            ...
6    Flat Washer    3            2015-05-01 00:00:00
7     Down Tube    4            2015-05-01 00:00:00
```

Suppose the Flat Washer record is removed from the original csv. Then re-running the slice would produce the following result: 

```
ID    Product        Quantity    ModifiedDate
...    ...            ...            ...
7     Down Tube    4            2015-05-01 00:00:00
```
Nothing new had to be done. The copy activity ran the cleanup script to delete the corresponding data for that slice. Then it read the input from the csv (which then contained only 1 record) and inserted it into the Table. 

### Mechanism 2
> [!IMPORTANT]
> sliceIdentifierColumnName is not supported for Azure SQL Data Warehouse at this time. 

Another mechanism to achieve repeatability is by having a dedicated column (**sliceIdentifierColumnName**) in the target Table. This column would be used by Azure Data Factory to ensure the source and destination stay synchronized. This approach works when there is flexibility in changing or defining the destination SQL Table schema. 

This column would be used by Azure Data Factory for repeatability purposes and in the process Azure Data Factory will not make any schema changes to the Table. Way to use this approach:

1. Define a column of type binary (32) in the destination SQL Table. There should be no constraints on this column. Let's name this column as ‘ColumnForADFuseOnly’ for this example.
2. Use it in the copy activity as follows:
   
    ```json
    "sink":  
    { 
   
        "type": "SqlSink", 
        "sliceIdentifierColumnName": "ColumnForADFuseOnly"
    }
    ```

Azure Data Factory will populate this column as per its need to ensure the source and destination stay synchronized. The values of this column should not be used outside of this context by the user. 

Similar to mechanism 1, Copy Activity will automatically first clean up the data for the given slice from the destination SQL Table and then run the copy activity normally to insert the data from source to destination for that slice. 

