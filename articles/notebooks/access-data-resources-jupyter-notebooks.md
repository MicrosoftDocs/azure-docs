---
title: Access data in Jupyter notebooks - Azure Notebooks Preview
description: Learn how to access files, REST APIs, databases, and different Azure Storage resources from a Jupyter notebook.
ms.topic: how-to
ms.date: 12/04/2018
ms.custom: tracking-python
---
# Access cloud data in a notebook

Doing interesting work in a Jupyter notebook requires data. Data, indeed, is the lifeblood of notebooks.

You can certainly [import data files into a project](work-with-project-data-files.md), even using commands like `curl` from within a notebook to download a file directly. It's likely, however, that you need to work with much more extensive data that's available from non-file sources such as REST APIs, relational databases, and cloud storage such as Azure tables.

This article briefly outlines these different options. Because data access is best seen in action, you can find runnable code in the [Azure Notebooks Samples - Access your data](https://github.com/Microsoft/AzureNotebooks/blob/master/Samples/Access%20your%20data%20in%20Azure%20Notebooks.ipynb).

[!INCLUDE [notebooks-status](../../includes/notebooks-status.md)]

## REST APIs

Generally speaking, the vast amount of data available from the Internet is accessed not through files, but through REST APIs. Fortunately, because a notebook cell can contain whatever code you like, you can use code to send requests and receive JSON data. You can then convert that JSON into whatever format you want to use, such as a pandas dataframe.

To access data using a REST API, use the same code in a notebook's code cells that you use in any other application. The general structure using the requests library is as follows:

```python
import pandas
import requests

# New York City taxi data for 2014
data_url = 'https://data.cityofnewyork.us/resource/gkne-dk5s.json'

# General data request; include other API keys and credentials as needed in the data argument
response = requests.get(data_url, data={"limit": "20"})

if response.status_code == 200:
    dataframe_rest2 = pandas.DataFrame.from_records(response.json())
    print(dataframe_rest2)
```

## Azure SQL Database and SQL Managed Instance

You can access databases in SQL Database or SQL Managed Instance with the assistance of the pyodbc or pymssql libraries.

[Use Python to query an Azure SQL database](https://docs.microsoft.com/azure/sql-database/sql-database-connect-query-python) gives you instructions on creating a database in SQL Database containing AdventureWorks data, and shows how to query that data. The same code is shown in the sample notebook for this article.

## Azure Storage

Azure Storage provides several different types of non-relational storage, depending on the type of data you have and how you need to access it:

- Table Storage: provides low-cost, high-volume storage for tabular data, such as collected sensor logs, diagnostic logs, and so on.
- Blob storage: provides file-like storage for any type of data.

The sample notebook demonstrates working with both tables and blobs, including how to use a shared access signature to allow read-only access to blobs.

## Azure Cosmos DB

Azure Cosmos DB provides a fully indexed NoSQL store for JSON documents). The following articles provide a number of different ways to work with Cosmos DB from Python:

- [Build a SQL API app with Python](https://docs.microsoft.com/azure/cosmos-db/create-sql-api-python)
- [Build a Flask app with the Azure Cosmos DB's API for MongoDB](https://docs.microsoft.com/azure/cosmos-db/create-mongodb-flask)
- [Create a graph database using Python and the Gremlin API](https://docs.microsoft.com/azure/cosmos-db/create-graph-python)
- [Build a Cassandra app with Python and Azure Cosmos DB](https://docs.microsoft.com/azure/cosmos-db/create-cassandra-python)
- [Build a Table API app with Python and Azure Cosmos DB](https://docs.microsoft.com/azure/cosmos-db/create-table-python)

When working with Cosmos DB, you can use the [azure-cosmosdb-table](https://pypi.org/project/azure-cosmosdb-table/) library.

## Other Azure databases

Azure provides a number of other database types that you can use. The articles below provide guidance for accessing those databases from Python:

- [Azure Database for PostgreSQL: Use Python to connect and query data](https://docs.microsoft.com/azure/postgresql/connect-python)
- [Quickstart: Use Azure Redis Cache with Python](https://docs.microsoft.com/azure/redis-cache/cache-python-get-started)
- [Azure Database for MySQL: Use Python to connect and query data](https://docs.microsoft.com/azure/mysql/connect-python)
- [Azure Data Factory](https://azure.microsoft.com/services/data-factory/)
  - [Copy Wizard for Azure Data Factory](https://azure.microsoft.com/updates/code-free-copy-wizard-for-azure-data-factory/)

## Next steps

- [How to: Work with project data files](work-with-project-data-files.md)
