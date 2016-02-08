## Repeatability during Copy

When copying data from and to relational stores, you need to keep repeatability in mind to avoid unintended outcomes. 

**Note:** A slice can be re-run automatically in Azure Data Factory as per the retry policy specified. It is recommended to set a retry policy to guard against transient failures. Hence repeatability is an important aspect to take care of during data movement. 

**As a source:**

In most cases when reading from relational stores, you would want to read only the data corresponding to that slice. A way to do so would be by using the WindowStart and WindowEnd variables available in Azure Data Factory. Read about the variables and functions in Azure Data Factory here in the [Scheduling and Execution](data-factory-scheduling-and-execution.md) article. Example: 
	
	  "source": {
	    "type": "SqlSource",
	    "sqlReaderQuery": "$$Text.Format('select * from MyTable where timestampcolumn >= \\'{0:yyyy-MM-dd HH:mm\\' AND timestampcolumn < \\'{1:yyyy-MM-dd HH:mm\\'', WindowStart, WindowEnd)"
	  },

The above query will read data from ‘MyTable’ that falls in the slice duration range. Re-run of this slice would also always ensure this behavior. 

In other cases, you may wish to read the entire Table (suppose for one time move only) and may define the sqlReaderQuery as follows:

	
	"source": {
	            "type": "SqlSource",
	            "sqlReaderQuery": "select * from MyTable"
	          },
	
