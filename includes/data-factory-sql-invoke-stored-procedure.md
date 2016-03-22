## Invoking stored procedure for SQL Sink

When copying data into SQL Server or Azure SQL/SQL Server Database, a user specified stored procedure could be configured and invoked with additional parameters. 

A stored procedure can be leveraged when built-in copy mechanisms do not serve the purpose. This is typically leveraged when extra processing (merging columns, looking up additional values, insertion into multiple tables…) needs to be done before the final insertion of source data in the destination table. 

You may invoke a stored procedure of choice. The following sample shows how to use a stored procedure to do a simple insertion into a table in the database. 

**Output dataset**

In this example, type is set to: SqlServerTable. Set it to AzureSqlTable to use with an Azure SQL database. 

	{
	  "name": "SqlOutput",
	  "properties": {
	    "type": "SqlServerTable",
	    "linkedServiceName": "SqlLinkedService",
	    "typeProperties": {
	      "tableName": "Marketing"
	    },
	    "availability": {
	      "frequency": "Hour",
	      "interval": 1
	    }
	  }
	}
	
Define the SqlSink section in copy activity JSON as follows. To call a stored procedure while insert data, both SqlWriterStoredProcedureName and SqlWriterTableType properties are needed.

	"sink":
	{
	    "type": "SqlSink",
	    "SqlWriterTableType": "MarketingType",
	    "SqlWriterStoredProcedureName": "spOverwriteMarketing", 
	    "storedProcedureParameters":
	            {
	                "stringData": 
	                {
	                    "value": "str1"     
	                }
	            }
	}

In your database, define the stored procedure with the same name as SqlWriterStoredProcedureName. It handles input data from your specified source, and insert into the output table. Notice that the parameter name of the stored procedure should be the same as the tableName defined in Table JSON file.

	CREATE PROCEDURE spOverwriteMarketing @Marketing [dbo].[MarketingType] READONLY, @stringData varchar(256)
	AS
	BEGIN
	    DELETE FROM [dbo].[Marketing] where ProfileID = @stringData
	    INSERT [dbo].[Marketing](ProfileID, State)
	    SELECT * FROM @Marketing
	END

In your database, define the table type with the same name as SqlWriterTableType. Notice that the schema of the table type should be same as the schema returned by your input data.

	CREATE TYPE [dbo].[MarketingType] AS TABLE(
	    [ProfileID] [varchar](256) NOT NULL,
	    [State] [varchar](256) NOT NULL,
	)

The stored procedure feature takes advantage of [Table-Valued Parameters](https://msdn.microsoft.com/library/bb675163.aspx).