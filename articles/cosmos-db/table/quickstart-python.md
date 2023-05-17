---
title: 'Quickstart: API for Table with Python - Azure Cosmos DB'
description: This quickstart shows how to access the Azure Cosmos DB for Table from a Python application using the Azure Data Tables SDK
author: seesharprun
ms.service: cosmos-db
ms.subservice: table
ms.devlang: python
ms.topic: quickstart
ms.date: 05/04/2023
ms.author: sidandrews
ms.reviewer: mjbrown
ms.custom: devx-track-python, mode-api, devx-track-azurecli, ignite-2022, py-fresh-zinc
---

# Quickstart: Build an API for Table app with Python SDK and Azure Cosmos DB

[!INCLUDE[Table](../includes/appliesto-table.md)]

> [!div class="op_single_selector"]
>
> * [.NET](quickstart-dotnet.md)
> * [Java](quickstart-java.md)
> * [Node.js](quickstart-nodejs.md)
> * [Python](quickstart-python.md)
>

This quickstart shows how to access the Azure Cosmos DB [API for Table](introduction.md) from a Python application. The Azure Cosmos DB for Table is a schemaless data store allowing applications to store structured NoSQL data in the cloud. Because data is stored in a schemaless design, new properties (columns) are automatically added to the table when an object with a new attribute is added to the table. Python applications can access the Azure Cosmos DB for Table using the [Azure Data Tables SDK for Python](https://pypi.org/project/azure-data-tables/) package.

## Prerequisites

The sample application is written in [Python 3.7 or later](https://www.python.org/downloads/), though the principles apply to all Python 3.7+ applications. You can use [Visual Studio Code](https://code.visualstudio.com/) as an IDE.

If you don't have an [Azure subscription](../../guides/developer/azure-developer-guide.md#understanding-accounts-subscriptions-and-billing), create a [free account](https://azure.microsoft.com/free/dotnet) before you begin.

## Sample application

The sample application for this tutorial may be cloned or downloaded from the repository https://github.com/Azure-Samples/msdocs-azure-tables-sdk-python-flask.

```bash
git clone https://github.com/Azure-Samples/msdocs-azure-tables-sdk-python-flask.git
```

A *1-starter-app* and *2-completed-app* sample folder are included in the sample repository. The *1-starter-app* has some functionality left for you to complete with lines marked "#TODO". The code snippets shown in this article are the suggested additions to complete the *1-starter-app*.

The completed sample application uses weather data as an example to demonstrate the capabilities of the API for Table. Objects representing weather observations are stored and retrieved using the API for Table, including storing objects with extra properties to demonstrate the schemaless capabilities of the API for Table. The following image shows the local application running in a browser, displaying the weather data stored in the Azure Cosmos DB for Table.

:::image type="content" source="./media/quickstart-python/table-api-app-finished-application-720px.png" alt-text="A screenshot of the finished application, which shows data stored in an Azure Cosmos DB table using the API for Table." lightbox="./media/quickstart-python/table-api-app-finished-application.png":::

## 1 - Create an Azure Cosmos DB account

You first need to create an Azure Cosmos DB Tables API account that will contain the table(s) used in your application. Create an account with the Azure portal, Azure CLI, or Azure PowerShell.

### [Azure portal](#tab/azure-portal)

Log in to the [Azure portal](https://portal.azure.com/) and follow these steps to create an Azure Cosmos DB account.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Create Azure Cosmos DB db account step 1](./includes/quickstart-python/create-cosmos-db-acct-1.md)] | :::image type="content" source="./media/quickstart-python/azure-portal-create-cosmos-db-account-table-api-1-240px.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find Azure Cosmos DB accounts in Azure." lightbox="./media/quickstart-python/azure-portal-create-cosmos-db-account-table-api-1.png":::           |
| [!INCLUDE [Create Azure Cosmos DB db account step 2](./includes/quickstart-python/create-cosmos-db-acct-2.md)] | :::image type="content" source="./media/quickstart-python/azure-portal-create-cosmos-db-account-table-api-2-240px.png" alt-text="A screenshot showing the Create button location on the Azure Cosmos DB accounts page in Azure." lightbox="./media/quickstart-python/azure-portal-create-cosmos-db-account-table-api-2.png":::           |
| [!INCLUDE [Create Azure Cosmos DB db account step 3](./includes/quickstart-python/create-cosmos-db-acct-3.md)] | :::image type="content" source="./media/quickstart-python/azure-portal-create-cosmos-db-account-table-api-3-240px.png" alt-text="A screenshot showing the Azure Table option as the correct option to select." lightbox="./media/quickstart-python/azure-portal-create-cosmos-db-account-table-api-3.png":::           |
| [!INCLUDE [Create Azure Cosmos DB db account step 4](./includes/quickstart-python/create-cosmos-db-acct-4.md)] | :::image type="content" source="./media/quickstart-python/azure-portal-create-cosmos-db-account-table-api-4-240px.png" alt-text="A screenshot showing how to fill out the fields on the Azure Cosmos DB Account creation page." lightbox="./media/quickstart-python/azure-portal-create-cosmos-db-account-table-api-4.png":::           |

### [Azure CLI](#tab/azure-cli)

Azure Cosmos DB accounts are created using the [az cosmosdb create](/cli/azure/cosmosdb#az-cosmosdb-create) command. You must include the `--capabilities EnableTable` option to enable table storage within your Azure Cosmos DB. As all Azure resources must be contained in a resource group, the following code snippet also creates a resource group for the Azure Cosmos DB account.

Azure Cosmos DB account names must be between 3 and 44 characters in length and may contain only lowercase letters, numbers, and the hyphen (-) character. Azure Cosmos DB account names must also be unique across Azure.

Azure CLI commands can be run in the [Azure Cloud Shell](https://shell.azure.com/) or on a workstation with the [Azure CLI installed](/cli/azure/install-azure-cli).

It typically takes several minutes for the Azure Cosmos DB account creation process to complete.

```azurecli
LOCATION='eastus'
RESOURCE_GROUP_NAME='rg-msdocs-tables-sdk-demo'
COSMOS_ACCOUNT_NAME='cosmos-msdocs-tables-sdk-demo-123'    # change 123 to a unique set of characters for a unique name

az group create \
    --location $LOCATION \
    --name $RESOURCE_GROUP_NAME

az cosmosdb create \
    --name $COSMOS_ACCOUNT_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --capabilities EnableTable
```

### [Azure PowerShell](#tab/azure-powershell)

Azure Cosmos DB accounts are created using the [New-AzCosmosDBAccount](/powershell/module/az.cosmosdb/new-azcosmosdbaccount) cmdlet. You must include the `-ApiKind "Table"` option to enable table storage within your Azure Cosmos DB.  As all Azure resources must be contained in a resource group, the following code snippet also creates a resource group for the Azure Cosmos DB account.

Azure Cosmos DB account names must be between 3 and 44 characters in length and may contain only lowercase letters, numbers, and the hyphen (-) character.  Azure Cosmos DB account names must also be unique across Azure.

Azure PowerShell commands can be run in the [Azure Cloud Shell](https://shell.azure.com) or on a workstation with [Azure PowerShell installed](/powershell/azure/install-azure-powershell).

It typically takes several minutes for the Azure Cosmos DB account creation process to complete.

```azurepowershell
$location = 'eastus'
$resourceGroupName = 'rg-msdocs-tables-sdk-demo'
$cosmosAccountName = 'cosmos-msdocs-tables-sdk-demo-123'  # change 123 to a unique set of characters for a unique name

# Create a resource group
New-AzResourceGroup `
    -Location $location `
    -Name $resourceGroupName

# Create an Azure Cosmos DB 
New-AzCosmosDBAccount `
    -Name $cosmosAccountName `
    -ResourceGroupName $resourceGroupName `
    -Location $location `
    -ApiKind "Table"
```

---

## 2 - Create a table

Next, you need to create a table within your Azure Cosmos DB account for your application to use. Unlike a traditional database, you only need to specify the name of the table, not the properties (columns) in the table. As data is loaded into your table, the properties (columns) are automatically created as needed.

### [Azure portal](#tab/azure-portal)

In the [Azure portal](https://portal.azure.com/), complete the following steps to create a table inside your Azure Cosmos DB account.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Create Azure Cosmos DB db table step 1](./includes/quickstart-python/create-cosmos-table-1.md)] | :::image type="content" source="./media/quickstart-python/azure-portal-create-cosmos-db-table-api-1-240px.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find your Azure Cosmos DB account." lightbox="./media/quickstart-python/azure-portal-create-cosmos-db-table-api-1.png":::           |
| [!INCLUDE [Create Azure Cosmos DB db table step 2](./includes/quickstart-python/create-cosmos-table-2.md)] | :::image type="content" source="./media/quickstart-python/azure-portal-create-cosmos-db-table-api-2-240px.png" alt-text="A screenshot showing the location of the Add Table button." lightbox="./media/quickstart-python/azure-portal-create-cosmos-db-table-api-2.png":::           |
| [!INCLUDE [Create Azure Cosmos DB db table step 3](./includes/quickstart-python/create-cosmos-table-3.md)] | :::image type="content" source="./media/quickstart-python/azure-portal-create-cosmos-db-table-api-3-240px.png" alt-text="A screenshot showing how to New Table dialog box for an Azure Cosmos DB table." lightbox="./media/quickstart-python/azure-portal-create-cosmos-db-table-api-3.png":::           |

### [Azure CLI](#tab/azure-cli)

Tables in Azure Cosmos DB are created using the [az cosmosdb table create](/cli/azure/cosmosdb/table#az-cosmosdb-table-create) command.

```azurecli
COSMOS_TABLE_NAME='WeatherData'

az cosmosdb table create \
    --account-name $COSMOS_ACCOUNT_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $COSMOS_TABLE_NAME \
    --throughput 400
```

### [Azure PowerShell](#tab/azure-powershell)

Tables in Azure Cosmos DB are created using the [New-AzCosmosDBTable](/powershell/module/az.cosmosdb/new-azcosmosdbtable) cmdlet.

```azurepowershell
$cosmosTableName = 'WeatherData'

# Create the table for the application to use
New-AzCosmosDBTable `
    -Name $cosmosTableName `
    -AccountName $cosmosAccountName `
    -ResourceGroupName $resourceGroupName
```

---

## 3 - Get Azure Cosmos DB connection string

To access your table(s) in Azure Cosmos DB, your app needs the table connection string for the Cosmos DB Storage account.  The connection string can be retrieved using the Azure portal, Azure CLI or Azure PowerShell.

### [Azure portal](#tab/azure-portal)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Get Azure Cosmos DB db table connection string step 1](./includes/quickstart-python/get-cosmos-connection-string-1.md)] | :::image type="content" source="./media/quickstart-python/azure-portal-cosmos-db-table-connection-string-1-240px.png" alt-text="A screenshot showing the location of the connection strings link on the Azure Cosmos DB page." lightbox="./media/quickstart-python/azure-portal-cosmos-db-table-connection-string-1.png":::           |
| [!INCLUDE [Get Azure Cosmos DB db table connection string step 2](./includes/quickstart-python/get-cosmos-connection-string-2.md)] | :::image type="content" source="./media/quickstart-python/azure-portal-cosmos-db-table-connection-string-2-240px.png" alt-text="A screenshot showing which connection string to select and use in your application." lightbox="./media/quickstart-python/azure-portal-cosmos-db-table-connection-string-2.png":::           |

### [Azure CLI](#tab/azure-cli)

To get the primary connection string using Azure CLI, use the [az cosmosdb keys list](/cli/azure/cosmosdb/keys#az-cosmosdb-keys-list) command with the option `--type connection-strings`. This command uses a [JMESPath query](/cli/azure/query-azure-cli) to display only the primary table connection string.

```azurecli
# This gets the primary connection string
az cosmosdb keys list \
    --type connection-strings \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $COSMOS_ACCOUNT_NAME \
    --query "connectionStrings[?description=='Primary Table Connection String'].connectionString" \
    --output tsv
```

### [Azure PowerShell](#tab/azure-powershell)

To get the primary connection string using Azure PowerShell, use the [Get-AzCosmosDBAccountKey](/powershell/module/az.cosmosdb/get-azcosmosdbaccountkey) cmdlet.

```azurepowershell
# This gets the primary connection string
$(Get-AzCosmosDBAccountKey `
    -ResourceGroupName $resourceGroupName `
    -Name $cosmosAccountName `
    -Type "ConnectionStrings")."Primary Table Connection String"
```

The connection string for your Azure Cosmos DB account is considered an app secret and must be protected like any other app secret or password.

---

## 4 - Install the Azure Data Tables SDK for Python

After you've created an Azure Cosmos DB account, your next step is to install the Microsoft [Azure Data Tables SDK for Python](https://pypi.python.org/pypi/azure-data-tables/). For details on installing the SDK, refer to the [README.md](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/tables/azure-data-tables/README.md) file in the Data Tables SDK for Python repository on GitHub.

Install the Azure Tables client library for Python with pip:

```bash
pip install azure-data-tables
```

Don't forget to also install the *requirements.txt* in the *1-starter-app* or *2-completed-app* folders.

---

## 5 - Configure the Table client in an .env file

Copy your Azure Cosmos DB account connection string from the Azure portal, and create a TableServiceClient object using your copied connection string. Switch to the *1-starter-app* or *2-completed-app* folder. Regardless of which app you start with, you need to define environment variables in an `.env` file.

```python
# Configuration Parameters
conn_str = "A connection string to an Azure Cosmos DB account."
table_name = "WeatherData"
project_root_path = "Project abs path"
```

The Azure SDK communicates with Azure using client objects to execute different operations against Azure. The [`TableServiceClient`](/python/api/azure-data-tables/azure.data.tables.tableserviceclient) object is the object used to communicate with the Azure Cosmos DB for Table. An application will typically have a single `TableServiceClient` overall, and it will have a [`TableClient`](/python/api/azure-data-tables/azure.data.tables.tableclient) per table.

For example, the following code creates a `TableServiceClient` object using the connection string from the environment variable.

```python
self.conn_str = os.getenv("conn_str")
self.table_service = TableServiceClient.from_connection_string(self.conn_str)
```

---

## 6 - Implement Azure Cosmos DB table operations

All Azure Cosmos DB table operations for the sample app are implemented in the `TableServiceHelper` class located in *helper* file under the *webapp* directory. You'll need to import the `TableServiceClient` class at the top of this file to work with objects in the [azure.data.tables](https://pypi.org/project/azure-data-tables/) client library for Python.

```python
from azure.data.tables import TableServiceClient
```

At the start of the `TableServiceHelper` class, create a constructor and add a member variable for the `TableClient` object to allow the `TableClient` object to be injected into the class.

```python
def __init__(self, table_name=None, conn_str=None):
    self.table_name = table_name if table_name else os.getenv("table_name")
    self.conn_str = conn_str if conn_str else os.getenv("conn_str")
    self.table_service = TableServiceClient.from_connection_string(self.conn_str)
    self.table_client = self.table_service.get_table_client(self.table_name)
```

### Filter rows returned from a table

To filter the rows returned from a table, you can pass an OData style filter string to the `query_entities` method. For example, if you wanted to get all of the weather readings for Chicago between midnight July 1, 2021 and midnight July 2, 2021 (inclusive) you would pass in the following filter string.

```odata
PartitionKey eq 'Chicago' and RowKey ge '2021-07-01 12:00 AM' and RowKey le '2021-07-02 12:00 AM'
```

You can view related OData filter operators on the azure-data-tables website in the section [Writing Filters](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/tables/azure-data-tables/samples#writing-filters).

When request.args parameter is passed to the `query_entity` method in the `TableServiceHelper` class, it creates a filter string for each non-null property value. It then creates a combined filter string by joining all of the values together with an "and" clause. This combined filter string is passed to the `query_entities` method on the `TableClient` object and only rows matching the filter string are returned. You can use a similar method in your code to construct suitable filter strings as required by your application.

```python
def query_entity(self, params):
    filters = []
    if params.get("partitionKey"):
        filters.append("PartitionKey eq '{}'".format(params.get("partitionKey")))
    if params.get("rowKeyDateStart") and params.get("rowKeyTimeStart"):
        filters.append("RowKey ge '{} {}'".format(params.get("rowKeyDateStart"), params.get("rowKeyTimeStart")))
    if params.get("rowKeyDateEnd") and params.get("rowKeyTimeEnd"):
        filters.append("RowKey le '{} {}'".format(params.get("rowKeyDateEnd"), params.get("rowKeyTimeEnd")))
    if params.get("minTemperature"):
        filters.append("Temperature ge {}".format(params.get("minTemperature")))
    if params.get("maxTemperature"):
        filters.append("Temperature le {}".format(params.get("maxTemperature")))
    if params.get("minPrecipitation"):
        filters.append("Precipitation ge {}".format(params.get("minPrecipitation")))
    if params.get("maxPrecipitation"):
        filters.append("Precipitation le {}".format(params.get("maxPrecipitation")))
    return list(self.table_client.query_entities(" and ".join(filters)))
```

### Insert data using a TableEntity object

The simplest way to add data to a table is by using a [`TableEntity`](/python/api/azure-data-tables/azure.data.tables.tableentity) object. In this example, data is mapped from an input model object to a `TableEntity` object. The properties on the input object representing the weather station name and observation date/time are mapped to the `PartitionKey` and `RowKey` properties respectively, which together form a unique key for the row in the table. Then the extra properties on the input model object are mapped to dictionary properties on the TableEntity object. Finally, the `create_entity` method on the `TableClient` object is used to insert data into the table.

Modify the `insert_entity` function in the example application to contain the following code.

```python
def insert_entity(self):
    entity = self.deserialize()
    return self.table_client.create_entity(entity)
    
@staticmethod
def deserialize():
    params = {key: request.form.get(key) for key in request.form.keys()}
    params["PartitionKey"] = params.pop("StationName")
    params["RowKey"] = "{} {}".format(params.pop("ObservationDate"), params.pop("ObservationTime"))
    return params
```

### Upsert data using a TableEntity object

If you try to insert a row into a table with a partition key/row key combination that already exists in that table, you'll receive an error. For this reason, it's often preferable to use the `upsert_entity` instead of the `create_entity` method when adding rows to a table. If the given partition key/row key combination already exists in the table, the `upsert_entity` method updates the existing row. Otherwise, the row is added to the table.

```python
def upsert_entity(self):
    entity = self.deserialize()
    return self.table_client.upsert_entity(entity)
    
@staticmethod
def deserialize():
    params = {key: request.form.get(key) for key in request.form.keys()}
    params["PartitionKey"] = params.pop("StationName")
    params["RowKey"] = "{} {}".format(params.pop("ObservationDate"), params.pop("ObservationTime"))
    return params
```

### Insert or upsert data with variable properties

One of the advantages of using the Azure Cosmos DB for Table is that if an object being loaded to a table contains any new properties then those properties are automatically added to the table and the values stored in Azure Cosmos DB. There's no need to run DDL statements like ALTER TABLE to add columns as in a traditional database.

This model gives your application flexibility when dealing with data sources that may add or modify what data needs to be captured over time or when different inputs provide different data to your application. In the sample application, we can simulate a weather station that sends not just the base weather data but also some extra values. When an object with these new properties is stored in the table for the first time, the corresponding properties (columns) are automatically added to the table.

To insert or upsert such an object using the API for Table, map the properties of the expandable object into a `TableEntity` object and use the `create_entity` or `upsert_entity` methods on the `TableClient` object as appropriate.

In the sample application, the `upsert_entity` function can also implement the function of insert or upsert data with variable properties

```python
def insert_entity(self):
    entity = self.deserialize()
    return self.table_client.create_entity(entity)

def upsert_entity(self):
    entity = self.deserialize()
    return self.table_client.upsert_entity(entity)

@staticmethod
def deserialize():
    params = {key: request.form.get(key) for key in request.form.keys()}
    params["PartitionKey"] = params.pop("StationName")
    params["RowKey"] = "{} {}".format(params.pop("ObservationDate"), params.pop("ObservationTime"))
    return params
```

### Update an entity

Entities can be updated by calling the `update_entity` method on the `TableClient` object. 

In the sample app, this object is passed to the `upsert_entity` method in the `TableClient` class. It updates that entity object and uses the `upsert_entity` method save the updates to the database. 

```python
def update_entity(self):
    entity = self.update_deserialize()
    return self.table_client.update_entity(entity)
    
@staticmethod
def update_deserialize():
    params = {key: request.form.get(key) for key in request.form.keys()}
    params["PartitionKey"] = params.pop("StationName")
    params["RowKey"] = params.pop("ObservationDate")
    return params
```

### Remove an entity

To remove an entity from a table, call the `delete_entity` method on the `TableClient` object with the partition key and row key of the object.
    
```python
def delete_entity(self):
    partition_key = request.form.get("StationName")
    row_key = request.form.get("ObservationDate")
    return self.table_client.delete_entity(partition_key, row_key)
```

## 7 - Run the code

Run the sample application to interact with the Azure Cosmos DB for Table. For example, starting in the *2-completed-app* folder, with requirements installed, you can use:

```bash
python3 run.py webapp
```

See the *README.md* file in the [sample repository root](https://github.com/Azure-Samples/msdocs-azure-tables-sdk-python-flask/tree/main) for more information about running the sample application.

The first time you run the application, there will be no data because the table is empty. Use any of the buttons at the top of application to add data to the table.

:::image type="content" source="./media/quickstart-python/table-api-app-data-insert-buttons-480px.png" alt-text="A screenshot of the application showing the location of the buttons used to insert data into Azure Cosmos DB using the Table API." lightbox="./media/quickstart-python/table-api-app-data-insert-buttons.png":::

Selecting the **Insert using Table Entity** button opens a dialog allowing you to insert or upsert a new row using a `TableEntity` object.

:::image type="content" source="./media/quickstart-python/table-api-app-insert-table-entity-480px.png" alt-text="A screenshot of the application showing the dialog box used to insert data using a TableEntity object." lightbox="./media/quickstart-python/table-api-app-insert-table-entity.png":::

Selecting the **Insert using Expandable** Data button brings up a dialog that enables you to insert an object with custom properties, demonstrating how the Azure Cosmos DB for Table automatically adds properties (columns) to the table when needed. Use the *Add Custom Field* button to add one or more new properties and demonstrate this capability.

:::image type="content" source="./media/quickstart-python/table-api-app-insert-expandable-entity-480px.png" alt-text="A screenshot of the application showing the dialog box used to insert data using an object with custom fields." lightbox="./media/quickstart-python/table-api-app-insert-expandable-entity.png":::

Use the **Insert Sample Data** button to load some sample data into your Azure Cosmos DB Table.

* For the *1-starter-app* sample folder, you'll need to at least complete the code for the `submit_transaction` function for the sample data insert to work.

* The sample data is loaded from a *sample_data.json* file. The *.env* variable `project_root_path` tells the app where to find this file. For example, if you're running the application from the *1-starter-app* or *2-completed-app* folder, set `project_root_path` to "" (blank).

:::image type="content" source="./media/quickstart-python/table-api-app-sample-data-insert-480px.png" alt-text="A screenshot of the application showing the location of the sample data insert button." lightbox="./media/quickstart-python/table-api-app-sample-data-insert.png":::

Select the **Filter Results** item in the top menu to be taken to the Filter Results page.  On this page, fill out the filter criteria to demonstrate how a filter clause can be built and passed to the Azure Cosmos DB for Table.

:::image type="content" source="./media/quickstart-python/table-api-app-filter-data-480px.png" alt-text="A screenshot of the application showing filter results page and highlighting the menu item used to navigate to the page." lightbox="./media/quickstart-python/table-api-app-filter-data.png":::

## Clean up resources

When you're finished with the sample application, you should remove all Azure resources related to this article from your Azure account.  You can remove all resources by deleting the resource group.

### [Azure portal](#tab/azure-portal)

A resource group can be deleted using the [Azure portal](https://portal.azure.com/) by doing the following.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Delete resource group step 1](./includes/quickstart-python/remove-resource-group-1.md)] | :::image type="content" source="./media/quickstart-python/azure-portal-remove-resource-group-1-240px.png" alt-text="A screenshot showing how to search for a resource group." lightbox="./media/quickstart-python/azure-portal-remove-resource-group-1.png":::           |
| [!INCLUDE [Delete resource group step 2](./includes/quickstart-python/remove-resource-group-2.md)] | :::image type="content" source="./media/quickstart-python/azure-portal-remove-resource-group-2-240px.png" alt-text="A screenshot showing the location of the Delete resource group button." lightbox="./media/quickstart-python/azure-portal-remove-resource-group-2.png":::           |
| [!INCLUDE [Delete resource group step 3](./includes/quickstart-python/remove-resource-group-3.md)] | :::image type="content" source="./media/quickstart-python/azure-portal-remove-resource-group-3-240px.png" alt-text="A screenshot showing the confirmation dialog for deleting a resource group." lightbox="./media/quickstart-python/azure-portal-remove-resource-group-3.png":::           |

### [Azure CLI](#tab/azure-cli)

To delete a resource group using the Azure CLI, use the [az group delete](/cli/azure/group#az-group-delete) command with the name of the resource group to be deleted.  Deleting a resource group also removes all Azure resources contained in the resource group.

```azurecli
az group delete --name $RESOURCE_GROUP_NAME
```

### [Azure PowerShell](#tab/azure-powershell)

To delete a resource group using Azure PowerShell, use the [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) command with the name of the resource group to be deleted.  Deleting a resource group also removes all Azure resources contained in the resource group.

```azurepowershell
Remove-AzResourceGroup -Name $resourceGroupName
```

---

## Next steps

In this quickstart, you've learned how to create an Azure Cosmos DB account, create a table using the Data Explorer, and run an app. Now you can query your data using the API for Table.  

> [!div class="nextstepaction"]
> [Query Azure Cosmos DB by using the API for Table](tutorial-query.md)
