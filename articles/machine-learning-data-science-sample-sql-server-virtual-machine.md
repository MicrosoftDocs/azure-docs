<properties 
	pageTitle="Sample Data in SQL Server on Azure| Azure" 
	description="Sample Data in SQL Server on Azure" 
	services="machine-learning" 
	documentationCenter="" 
	authors="fashah" 
	manager="paulettm" 
	editor="cgronlun" />

<tags 
	ms.service="machine-learning" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="02/18/2015" 
	ms.author="fashah,garye" /> 

#<a name="heading"></a>Sample Data in SQL Server on Azure

This document covers sampling data stored in SQL Server on Azure in the following ways:

1. [Using SQL](#sql)
2. [Using the Python Programming Language](#python) 

**Note**
>The sample SQL code in this document assumes that the data is in a SQL Server on Azure. If it isn't, please refer to the cloud data science process map for instructions to move your data to a SQL Server in Azure.

###<a name="SQL"></a>Using SQL

This section describes several methods using SQL to perform simple random sampling against the data in the database. Please choose a method based on your data size and its distribution.

The two items below show how to use newid in SQL Server to perform the sampling. The method you choose depends on how random you want the sample to be (pk_id in the sample code below is assumed to be an auto-generated primary key).

1. Less strict random sample

	    select  * from <table_name> where <primary_key> in 
    	(select top 10 percent <primary_key> from <table_name> order by newid())

2. More random sample 

	    SELECT * FROM <table_name>
    	WHERE 0.1 >= CAST(CHECKSUM(NEWID(), <primary_key>) & 0x7fffffff AS float)/ CAST (0x7fffffff AS int)

Tablesample can be used for sampling as well as demonstrated below. This may be a better approach if your data size is large (assuming that data on different pages is not correlated) and for the query to complete in a reasonable time.

	SELECT *
	FROM <table_name> 
	TABLESAMPLE (10 PERCENT)

**Note**
> You can explore and generate features from this sampled data by storing it in a new table


####<a name="sql-aml"></a>Connecting to Azure Machine Learning

You can directly  use the sample queries above in the Azure ML Reader module to down-sample the data on the fly and bring it into an Azure ML experiment. A screen shot of using the reader module to read the sampled data is shown below:
   
![reader sql][1]

###<a name="python"></a>Using the Python programming language 

This section demonstrates using the pyodbc library to connect to a SQL server database in Python. The database connection string is as follows: (replace servername, dbname, username and password with your configuration):

	#Set up the SQL Azure connection
	import pyodbc	
	conn = pyodbc.connect('DRIVER={SQL Server};SERVER=<servername>;DATABASE=<dbname>;UID=<username>;PWD=<password>')

The [Pandas ](http://pandas.pydata.org/) library in Python provides a rich set of data structures and data analysis tools for data manipulation for Python programming. The code below reads a 0.1% sample of the data from a table in Azure SQL database into a Pandas data :

	import pandas as pd

	# Query database and load the returned results in pandas data frame
	data_frame = pd.read_sql('''select column1, cloumn2... from <table_name> tablesample (0.1 percent)''', conn)

You can now work with the sampled data in the Pandas data frame. 

####<a name="python-aml"></a>Connecting to Azure Machine Learning

You can use the following sample code to save the down-sampled data to a file and upload it to an Azure blob. The data in the blob can be directly read into an Azure ML Experiment using the *Reader Module*. The steps are as follows: 

1. Write the pandas data frame to a local file

		dataframe.to_csv(os.path.join(os.getcwd(),LOCALFILENAME), sep='\t', encoding='utf-8', index=False)

2. Upload local file to Azure blob

		from azure.storage import BlobService
    	import tables

		STORAGEACCOUNTNAME= <storage_account_name>
		LOCALFILENAME= <local_file_name>
		STORAGEACCOUNTKEY= <storage_account_key>
		CONTAINERNAME= <container_name>
		BLOBNAME= <blob_name>

	    output_blob_service=BlobService(account_name=STORAGEACCOUNTNAME,account_key=STORAGEACCOUNTKEY)    
	    localfileprocessed = os.path.join(os.getcwd(),LOCALFILENAME) #assuming file is in current working directory
	    
	    try:
	   
	    #perform upload
	    output_blob_service.put_block_blob_from_path(CONTAINERNAME,BLOBNAME,localfileprocessed)
	    
	    except:	        
		    print ("Something went wrong with uploading blob:"+BLOBNAME)

3. Read data from Azure blob using Azure ML *Reader Module* as shown in the screen grab below:
 
![reader blob][2]

### Azure Data Science in Action Example

For an end-to-end walkthrough example of the Azure Data Science Process using a public dataset, see [Azure Data Science Process in Action](machine-learning-data-science-process-sql-walkthrough.md).

[1]: ./media/machine-learning-data-science-sample-sql-server-virtual-machine/reader_database.png
[2]: ./media/machine-learning-data-science-sample-sql-server-virtual-machine/reader_blob.png

