---
title: Use built-in notebook commands and features in Azure Cosmos DB
description: Learn how to use built-in commands and features to do common operations using Azure Cosmos DB's built-in notebooks.
author: deborahc
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/23/2019
ms.author: dech

---

# Use built-in notebook commands and features in Azure Cosmos DB

Built-in Jupyter notebooks in Azure Cosmos DB enable you to analyze and visualize your data from the Azure portal. This article describes how to use built-in notebook commands and features to do common operations.

## Install a new package
After you enable notebook support for your Azure Cosmos accounts, you can open a new notebook and install a package.

In a new code cell, insert and run the following code, replacing ``PackageToBeInstalled`` with the desired Python package.
```python
import sys
!{sys.executable} -m pip install PackageToBeInstalled –user
```
This package will be available to use from any notebook in the Azure Cosmos account workspace. 

> [!TIP]
> If your notebook requires a custom package, we recommend that you add a cell in your notebook to install the package, as packages are removed if you [reset the workspace](#reset-notebooks-workspace).  

## Run a SQL query

You can use the ``%%sql`` magic command to run a [SQL query](sql-query-getting-started.md) against any container in your account. Use the syntax:

```bash
%%sql --database {database_id} --container {container_id}
{Query text}
```

- Replace ``{database_id}`` and ``{container_id}`` with the name of the database and container in your Cosmos account. If the ``--database`` and ``--container`` arguments are not provided, the query will be executed on the [default database and container](#set-default-database-for-queries).
- You can run any SQL query that is valid in Azure Cosmos DB. 
The query text must be on a new line.

For example: 
```bash
%%sql --database RetailDemo --container WebsiteData
SELECT c.Action, c.Price as ItemRevenue, c.Country, c.Item FROM c
```
Run ```%%sql?``` in a cell to see the help documentation for the sql magic command in the notebook.

## Run a SQL query and output to a Pandas DataFrame

You can output the results of a ``%%sql`` query into a [Pandas DataFrame](https://pandas.pydata.org/pandas-docs/stable/getting_started/dsintro.html#dataframe). Use the syntax: 

```bash
%%sql --database {database_id} --container {container_id} --output {outputDataFrameVar}
{Query text}
```
- Replace ``{database_id}`` and ``{container_id}`` with the name of the database and container in your Cosmos account. If the ``--database`` and ``--container`` arguments are not provided, the query will be executed on the [default database and container](#set-default-database-for-queries).
- Replace ``{outputDataFrameVar}`` with the name of the DataFrame variable that will contain the results.
- You can run any SQL query that is valid in Azure Cosmos DB. 
The query text must be on a new line. 

For example:

```bash
%%sql --database RetailDemo --container WebsiteData --output df_cosmos
SELECT c.Action, c.Price as ItemRevenue, c.Country, c.Item FROM c
```
```bash
df_cosmos.head(10)

	Action	ItemRevenue	Country	Item
0	Viewed	9.00	Tunisia	Black Tee
1	Viewed	19.99	Antigua and Barbuda	Flannel Shirt
2	Added	3.75	Guinea-Bissau	Socks
3	Viewed	3.75	Guinea-Bissau	Socks
4	Viewed	55.00	Czech Republic	Rainjacket
5	Viewed	350.00	Iceland	Cosmos T-shirt
6	Added	19.99	Syrian Arab Republic	Button-Up Shirt
7	Viewed	19.99	Syrian Arab Republic	Button-Up Shirt
8	Viewed	33.00	Tuvalu	Red Top
9	Viewed	14.00	Cape Verde	Flip Flop Shoes
```

## Set default database for queries
You can set the default database ```%%sql``` commands will use for the notebook. Replace ```{database_id}``` with the name of your database.

```bash
%database {database_id}
```
Run ```%database?``` in a cell to see documentation in the notebook.

## Set default container for queries
You can set the default container ```%%sql``` commands will use for the notebook. Replace ```{container_id}``` with the name of your container.

```bash
%container {container_id}
```
Run ```%container?``` in a cell to see documentation in the notebook.

## Use the built-in Python SDK
Version 4 of the [Azure Cosmos DB Python SDK for SQL API](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/cosmos/azure-cosmos) is installed and included in the notebook environment for the Cosmos account.

Use the built-in ``cosmos_client`` instance to run any SDK operation. 

For example:

```python
## Import modules as needed
from azure.cosmos.partition_key import PartitionKey

## Create a new database if it doesn't exist
database = cosmos_client.create_database_if_not_exists('RetailDemo')

## Create a new container if it doesn't exist
container = database.create_container_if_not_exists(id='WebsiteData', partition_key=PartitionKey(path='/CartID'))
```
See [Python SDK samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/cosmos/azure-cosmos/samples). 

> [!IMPORTANT]
> The built-in Python SDK is only supported for SQL (Core) API accounts. For other APIs, you will need to [install the relevant Python driver](#install-a-new-package) that corresponds to the API. 

## Create a custom instance of ``cosmos_client``
For more flexibility, you can create a custom instance of ``cosmos_client`` in order to:

- Customize the [connection policy](https://docs.microsoft.com/python/api/azure-cosmos/azure.cosmos.documents.connectionpolicy?view=azure-python-preview)
- Run operations against a different Cosmos account than the one you are in

You can access the connection string and primary key of the current account via the [environment variables](#access-the-account-endpoint-and-primary-key-env-variables). 

```python
import os
import azure.cosmos.cosmos_client as cosmos
import azure.cosmos.documents as documents

# These should be set to a region you've added for Cosmos DB
region_1 = "Central US" 
region_2 = "East US 2"

custom_connection_policy = documents.ConnectionPolicy()
custom_connection_policy.PreferredLocations = [region_1, region_2] # Set the order of regions the SDK will route requests to. The regions should be regions you've added for Cosmos, otherwise this will error.

# Create a new instance of CosmosClient, getting the endpoint and key from the environment variables
custom_client = cosmos.CosmosClient(os.environ["COSMOS_ENDPOINT"], {'masterKey': os.environ["COSMOS_KEY"]}, connection_policy=custom_connection_policy)
```
## Access the account endpoint and primary key env variables
```python
import os

endpoint = os.environ["COSMOS_ENDPOINT"]
primary_key = os.environ["COSMOS_KEY"]
```
> [!IMPORTANT]
> The ``COSMOS_ENDPOINT`` and ``COSMOS_KEY`` environment variables are only applicable for SQL API. For other APIs, find the endpoint and key in the **Connection Strings** or **Keys** blade in your Cosmos account.  

## Reset notebooks workspace
To reset the notebooks workspace to the default settings, select **Reset Workspace** on the command bar. This will remove any custom installed packages and restart the Jupyter server. Your notebooks, files, and Cosmos resources will not be affected.  

![Reset notebooks workspace](media/use-notebook-features-and-commands/reset-workspace.png)

## Next steps

- Learn about the benefits of [Azure Cosmos DB Jupyter notebooks](cosmosdb-jupyter-notebooks.md)
- Learn about the [Azure Cosmos DB Python SDK for SQL API](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/cosmos/azure-cosmos)
