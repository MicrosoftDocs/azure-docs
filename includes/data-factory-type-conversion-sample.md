### Type conversion sample
The following sample is for copying data from a Blob to Azure SQL with type conversions.

Suppose the Blob dataset is in CSV format and contains 3 columns. One of them is a datetime column with a custom datetime format using abbreviated French names for day of the week.

You will define the Blob Source dataset as follows along with type definitions for the columns.

	{
	    "name": "AzureBlobTypeSystemInput",
	    "properties":
	    {
	         "structure": 
	          [
	                { "name": "userid", "type": "Int64"},
	                { "name": "name", "type": "String"},
	                { "name": "lastlogindate", "type": "Datetime", "culture": "fr-fr", "format": "ddd-MM-YYYY"}
	          ],
	        "type": "AzureBlob",
	        "linkedServiceName": "StorageLinkedService",
	        "typeProperties": {
	            "folderPath": "mycontainer/myfolder",
	            "fileName":"myfile.csv",
	            "format":
	            {
	                "type": "TextFormat",
	                "columnDelimiter": ","
	            }
	        },
	        "external": true,
	        "availability":
	        {
	            "frequency": "Hour",
	            "interval": 1
	        },
			"policy": {
	            "externalData": {
	                "retryInterval": "00:01:00",
	                "retryTimeout": "00:10:00",
	                "maximumRetry": 3
	            }
			}
	    }
	}

Given the SQL type to .NET type mapping table above you would define the Azure SQL table with the following schema.

| Column Name | SQL Type |
| ----------- | -------- |
| userid | bigint |
| name | text |
| lastlogindate | datetime |

Next you will define the Azure SQL dataset as follows. Note: You do not need to specify “structure” section with type information since the type information is already specified in the underlying data store.

	{
	    "name": "AzureSQLOutput",
	    "properties": {
	        "type": "AzureSqlTable",
	        "linkedServiceName": "AzureSqlLinkedService",
	        "typeProperties": {
	            "tableName": "MyTable"
	        },
	        "availability": {
	            "frequency": "Hour",
	            "interval": 1
	        }
	    }
	}

In this case data factory will automatically do the type conversions including the Datetime field with the custom datetime format using the fr-fr culture when moving data from Blob to Azure SQL.


