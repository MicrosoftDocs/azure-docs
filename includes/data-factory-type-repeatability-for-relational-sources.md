## Repeatability during Copy
When copying data from and to relational stores, you need to keep repeatability in mind to avoid unintended outcomes. 

A slice can be rerun automatically in Azure Data Factory as per the retry policy specified. We recommend that you set a retry policy to guard against transient failures. Hence repeatability is an important aspect to take care of during data movement. 

**As a source:**

> [!NOTE]
> The following samples are for Azure SQL but are applicable to any data store that supports rectangular datasets. You may have to adjust the **type** of source and the **query** property (for example: query instead of sqlReaderQuery) for the data store.   
> 
> 

Usually, when reading from relational stores, you would want to read only the data corresponding to that slice. A way to do so would be by using the WindowStart and WindowEnd variables available in Azure Data Factory. Read about the variables and functions in Azure Data Factory here in the [Scheduling and Execution](../articles/data-factory/data-factory-scheduling-and-execution.md) article. Example: 

```json
"source": {
"type": "SqlSource",
"sqlReaderQuery": "$$Text.Format('select * from MyTable where timestampcolumn >= \\'{0:yyyy-MM-dd HH:mm\\' AND timestampcolumn < \\'{1:yyyy-MM-dd HH:mm\\'', WindowStart, WindowEnd)"
},
```
This query reads data from ‘MyTable’ that falls in the slice duration range. Rerun of this slice would also always ensure this behavior. 

In other cases, you may wish to read the entire Table (suppose for one time move only) and may define the sqlReaderQuery as follows:

```json
"source": 
{            
	"type": "SqlSource",
	"sqlReaderQuery": "select * from MyTable"
},
```
