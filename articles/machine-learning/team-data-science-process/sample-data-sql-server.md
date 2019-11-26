---
title: Sample Data in SQL Server on Azure - Team Data Science Process
description: Sample data stored in SQL Server on Azure using SQL or the Python programming language, then move it to Azure Machine Learning.
services: machine-learning
author: marktab
manager: cgronlun
editor: cgronlun
ms.service: machine-learning
ms.subservice: team-data-science-process
ms.topic: article
ms.date: 11/13/2017
ms.author: tdsp
ms.custom: seodec18, previous-author=deguhath, previous-ms.author=deguhath
---
# <a name="heading"></a>Sample data in SQL Server on Azure

This article shows how to sample data stored in SQL Server on Azure using either SQL or the Python programming language. It also shows how to move sampled data into Azure Machine Learning by saving it to a file, uploading it to an Azure blob, and then reading it into Azure Machine Learning Studio.

The Python sampling uses the [pyodbc](https://code.google.com/p/pyodbc/) ODBC library to connect to SQL Server on Azure and the [Pandas](https://pandas.pydata.org/) library to do the sampling.

> [!NOTE]
> The sample SQL code in this document assumes that the data is in a SQL Server on Azure. If it is not, refer to [Move data to SQL Server on Azure](move-sql-server-virtual-machine.md) article for instructions on how to move your data to SQL Server on Azure.
> 
> 

**Why sample your data?**
If the dataset you plan to analyze is large, it's usually a good idea to down-sample the data to reduce it to a smaller but representative and more manageable size. This facilitates data understanding, exploration, and feature engineering. Its role in the [Team Data Science Process (TDSP)](https://docs.microsoft.com/azure/machine-learning/team-data-science-process/) is to enable fast prototyping of the data processing functions and machine learning models.

This sampling task is a step in the [Team Data Science Process (TDSP)](https://docs.microsoft.com/azure/machine-learning/team-data-science-process/).

## <a name="SQL"></a>Using SQL
This section describes several methods using SQL to perform simple random sampling against the data in the database. Choose a method based on your data size and its distribution.

The following two items show how to use `newid` in SQL Server to perform the sampling. The method you choose depends on how random you want the sample to be (pk_id in the following sample code is assumed to be an auto-generated primary key).

1. Less strict random sample
   
        select  * from <table_name> where <primary_key> in 
        (select top 10 percent <primary_key> from <table_name> order by newid())
2. More random sample 
   
        SELECT * FROM <table_name>
        WHERE 0.1 >= CAST(CHECKSUM(NEWID(), <primary_key>) & 0x7fffffff AS float)/ CAST (0x7fffffff AS int)

Tablesample can be used for sampling the data as well. This may be a better approach if your data size is large (assuming that data on different pages is not correlated) and for the query to complete in a reasonable time.

    SELECT *
    FROM <table_name> 
    TABLESAMPLE (10 PERCENT)

> [!NOTE]
> You can explore and generate features from this sampled data by storing it in a new table
> 
> 

### <a name="sql-aml"></a>Connecting to Azure Machine Learning
You can directly  use the sample queries above in the Azure Machine Learning [Import Data][import-data] module to down-sample the data on the fly and bring it into an Azure Machine Learning experiment. A screenshot of using the reader module to read the sampled data is shown here:

![reader sql][1]

## <a name="python"></a>Using the Python programming language
This section demonstrates using the [pyodbc library](https://code.google.com/p/pyodbc/) to establish an ODBC connect to a SQL server database in Python. The database connection string is as follows: (replace servername, dbname, username and password with your configuration):

    #Set up the SQL Azure connection
    import pyodbc    
    conn = pyodbc.connect('DRIVER={SQL Server};SERVER=<servername>;DATABASE=<dbname>;UID=<username>;PWD=<password>')

The [Pandas](https://pandas.pydata.org/) library in Python provides a rich set of data structures and data analysis tools for data manipulation for Python programming. The  following code reads a 0.1% sample of the data from a table in Azure SQL database into a Pandas data:

    import pandas as pd

    # Query database and load the returned results in pandas data frame
    data_frame = pd.read_sql('''select column1, column2... from <table_name> tablesample (0.1 percent)''', conn)

You can now work with the sampled data in the Pandas data frame. 

### <a name="python-aml"></a>Connecting to Azure Machine Learning
You can use the following sample code to save the down-sampled data to a file and upload it to an Azure blob. The data in the blob can be directly read into an Azure Machine Learning Experiment using the [Import Data][import-data] module. The steps are as follows: 

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
3. Read data from Azure blob using Azure Machine Learning [Import Data][import-data] module as shown in the following screen grab:

![reader blob][2]

## The Team Data Science Process in Action example
To walkthrough an example of the Team Data Science Process a using a public dataset, see [Team Data Science Process in Action: using SQL Server](sql-walkthrough.md).

[1]: ./media/sample-sql-server-virtual-machine/reader_database.png
[2]: ./media/sample-sql-server-virtual-machine/reader_blob.png

[import-data]: https://msdn.microsoft.com/library/azure/4e1b0fe6-aded-4b3f-a36f-39b8862b9004/
