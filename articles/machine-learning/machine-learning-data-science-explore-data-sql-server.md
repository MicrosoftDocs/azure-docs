<properties 
	pageTitle="Explore data in SQL Server Virtual Machine on Azure | Microsoft Azure" 
	description="How to explore data that is stored in a SQL Server VM on Azure." 
	services="machine-learning" 
	documentationCenter="" 
	authors="bradsev" 
	manager="paulettm" 
	editor="cgronlun" />

<tags 
	ms.service="machine-learning" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/14/2016" 
	ms.author="fashah;garye;bradsev" /> 

#Explore data in SQL Server Virtual Machine on Azure


This document covers how to explore data that is stored in a SQL Server VM on Azure. This can be done by data wrangling using SQL or by using a programming language like Python.

The **menu** below links to topics that describe how to use tools to explore data from various storage environments. This task is a step in the Cortana Analytics Process (CAP).

[AZURE.INCLUDE [cap-explore-data-selector](../../includes/cap-explore-data-selector.md)]


> [AZURE.NOTE] The sample SQL statements in this document assume that data is in SQL Server. If it isn't, please refer to the cloud data science process map to learn how to move your data to SQL Server.



## <a name="sql-dataexploration"></a>Explore SQL data with SQL scripts

Here are a few sample SQL scripts that can be used to explore data stores in SQL Server.

1. Get the count of observations per day

	`SELECT CONVERT(date, <date_columnname>) as date, count(*) as c from <tablename> group by CONVERT(date, <date_columnname>)` 

2. Get the levels in a categorical column

	`select  distinct <column_name> from <databasename>`

3. Get the number of levels in combination of two categorical columns 

	`select <column_a>, <column_b>,count(*) from <tablename> group by <column_a>, <column_b>`

4. Get the distribution for numerical columns

	`select <column_name>, count(*) from <tablename> group by <column_name>`

> [AZURE.NOTE] For a practical example, you can use the [NYC Taxi dataset](http://www.andresmh.com/nyctaxitrips/) and refer to the IPNB titled [NYC Data wrangling using IPython Notebook and SQL Server](https://github.com/Azure/Azure-MachineLearning-DataScience/blob/master/Misc/DataScienceProcess/iPythonNotebooks/machine-Learning-data-science-process-sql-walkthrough.ipynb) for an end-to-end walk-through.

##<a name="python"></a>Explore SQL data with Python

Using Python to explore data and generate features when the data is in SQL Server is similar to processing data in Azure blob using Python as documented in [Process Azure Blob data in you data science environment](machine-learning-data-science-process-data-blob.md). The data needs to be loaded from the database into a pandas data frame and then can be processed further. We document the process of connecting to the database and loading the data into the data frame in this section.

The following connection string format can be used to connect to a SQL Server database from Python using pyodbc (replace servername, dbname, username and password with your specific values):

	#Set up the SQL Azure connection
	import pyodbc	
	conn = pyodbc.connect('DRIVER={SQL Server};SERVER=<servername>;DATABASE=<dbname>;UID=<username>;PWD=<password>')

The [Pandas library](http://pandas.pydata.org/) in Python provides a rich set of data structures and data analysis tools for data manipulation for Python programming. The code below reads the results returned from a SQL Server database into a Pandas data frame:

	# Query database and load the returned results in pandas data frame
	data_frame = pd.read_sql('''select <columnname1>, <cloumnname2>... from <tablename>''', conn)

Now you can work with the Pandas data frame as covered in topics [Process Azure Blob data in you data science environment](machine-learning-data-science-process-data-blob.md).

## Cortana Analytics Process in Action Example

For an end-to-end walkthrough example of the Cortana Analytics Process using a public dataset, see [The Team Data Science Process in action: using SQL Server](machine-learning-data-science-process-sql-walkthrough.md).

 