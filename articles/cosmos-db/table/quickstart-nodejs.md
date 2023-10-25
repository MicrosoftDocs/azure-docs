---
title: 'Quickstart: API for Table with Node.js - Azure Cosmos DB'
description: This quickstart shows how to use the Azure Cosmos DB for Table to create an application with the Azure portal and Node.js
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: table
ms.devlang: javascript
ms.topic: quickstart
ms.date: 05/28/2020
ms.custom: devx-track-js, mode-api, ignite-2022
---

# Quickstart: Build a API for Table app with Node.js and Azure Cosmos DB

[!INCLUDE[Table](../includes/appliesto-table.md)]

> [!div class="op_single_selector"]
>
> * [.NET](quickstart-dotnet.md)
> * [Java](quickstart-java.md)
> * [Node.js](quickstart-nodejs.md)
> * [Python](quickstart-python.md)
>

In this quickstart, you create an Azure Cosmos DB for Table account, and use Data Explorer and a Node.js app cloned from GitHub to create tables and entities. Azure Cosmos DB is a multi-model database service that lets you quickly create and query document, table, key-value, and graph databases with global distribution and horizontal scale capabilities.

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
- [Node.js 0.10.29+](https://nodejs.org/) .
- [Git](https://git-scm.com/downloads).

## Sample application

The sample application for this tutorial may be cloned or downloaded from the repository [https://github.com/Azure-Samples/msdocs-azure-data-tables-sdk-js](https://github.com/Azure-Samples/msdocs-azure-data-tables-sdk-js).  Both a starter and completed app are included in the sample repository.

```bash
git clone https://github.com/Azure-Samples/msdocs-azure-data-tables-sdk-js
```

The sample application uses weather data as an example to demonstrate the capabilities of the API for Table. Objects representing weather observations are stored and retrieved using the API for Table, including storing objects with additional properties to demonstrate the schemaless capabilities of the API for Table.

:::image type="content" source="./media/quickstart-nodejs/table-api-app-finished-application-720px.png" alt-text="A screenshot of the finished application showing data stored in an Azure Cosmos DB table using the API for Table." lightbox="./media/quickstart-nodejs/table-api-app-finished-application.png":::

## 1 - Create an Azure Cosmos DB account

You first need to create an Azure Cosmos DB Tables API account that will contain the table(s) used in your application.  This can be done using the Azure portal, Azure CLI, or Azure PowerShell.

### [Azure portal](#tab/azure-portal)

Log in to the [Azure portal](https://portal.azure.com/) and follow these steps to create an Azure Cosmos DB account.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Create Azure Cosmos DB db account step 1](./includes/quickstart-nodejs/create-cosmos-db-acct-1.md)] | :::image type="content" source="./media/quickstart-nodejs/azure-portal-create-cosmos-db-account-table-api-1-240px.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find Azure Cosmos DB accounts in Azure." lightbox="./media/quickstart-nodejs/azure-portal-create-cosmos-db-account-table-api-1.png":::           |
| [!INCLUDE [Create Azure Cosmos DB db account step 1](./includes/quickstart-nodejs/create-cosmos-db-acct-2.md)] | :::image type="content" source="./media/quickstart-nodejs/azure-portal-create-cosmos-db-account-table-api-2-240px.png" alt-text="A screenshot showing the Create button location on the Azure Cosmos DB accounts page in Azure." lightbox="./media/quickstart-nodejs/azure-portal-create-cosmos-db-account-table-api-2.png":::           |
| [!INCLUDE [Create Azure Cosmos DB db account step 1](./includes/quickstart-nodejs/create-cosmos-db-acct-3.md)] | :::image type="content" source="./media/quickstart-nodejs/azure-portal-create-cosmos-db-account-table-api-3-240px.png" alt-text="A screenshot showing the Azure Table option as the correct option to select." lightbox="./media/quickstart-nodejs/azure-portal-create-cosmos-db-account-table-api-3.png":::           |
| [!INCLUDE [Create Azure Cosmos DB db account step 1](./includes/quickstart-nodejs/create-cosmos-db-acct-4.md)] | :::image type="content" source="./media/quickstart-nodejs/azure-portal-create-cosmos-db-account-table-api-4-240px.png" alt-text="A screenshot showing how to fill out the fields on the Azure Cosmos DB Account creation page." lightbox="./media/quickstart-nodejs/azure-portal-create-cosmos-db-account-table-api-4.png":::           |

### [Azure CLI](#tab/azure-cli)

Azure Cosmos DB accounts are created using the [az cosmosdb create](/cli/azure/cosmosdb#az-cosmosdb-create) command. You must include the `--capabilities EnableTable` option to enable table storage within your Azure Cosmos DB.  As all Azure resource must be contained in a resource group, the following code snippet also creates a resource group for the  Azure Cosmos DB account.

Azure Cosmos DB account names must be between 3 and 44 characters in length and may contain only lowercase letters, numbers, and the hyphen (-) character.  Azure Cosmos DB account names must also be unique across Azure.

Azure CLI commands can be run in the [Azure Cloud Shell](https://shell.azure.com) or on a workstation with the [Azure CLI installed](/cli/azure/install-azure-cli).

It typically takes several minutes for the Azure Cosmos DB account creation process to complete.

```azurecli
LOCATION='eastus'
RESOURCE_GROUP_NAME='rg-msdocs-tables-sdk-demo'
COSMOS_ACCOUNT_NAME='cosmos-msdocs-tables-sdk-demo-123'    # change 123 to a unique set of characters for a unique name
COSMOS_TABLE_NAME='WeatherData'

az group create \
    --location $LOCATION \
    --name $RESOURCE_GROUP_NAME

az cosmosdb create \
    --name $COSMOS_ACCOUNT_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --capabilities EnableTable
```

### [Azure PowerShell](#tab/azure-powershell)

Azure Cosmos DB accounts are created using the [New-AzCosmosDBAccount](/powershell/module/az.cosmosdb/new-azcosmosdbaccount) cmdlet. You must include the `-ApiKind "Table"` option to enable table storage within your Azure Cosmos DB.  As all Azure resource must be contained in a resource group, the following code snippet also creates a resource group for the Azure Cosmos DB account.

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

Next, you need to create a table within your Azure Cosmos DB account for your application to use.  Unlike a traditional database, you only need to specify the name of the table, not the properties (columns) in the table.  As data is loaded into your table, the properties (columns) will be automatically created as needed.

### [Azure portal](#tab/azure-portal)

In the [Azure portal](https://portal.azure.com/), complete the following steps to create a table inside your Azure Cosmos DB account.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Create Azure Cosmos DB db table step 1](./includes/quickstart-nodejs/create-cosmos-table-1.md)] | :::image type="content" source="./media/quickstart-nodejs/azure-portal-create-cosmos-db-table-api-1-240px.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find your Azure Cosmos DB account." lightbox="./media/quickstart-nodejs/azure-portal-create-cosmos-db-table-api-1.png":::           |
| [!INCLUDE [Create Azure Cosmos DB db table step 2](./includes/quickstart-nodejs/create-cosmos-table-2.md)] | :::image type="content" source="./media/quickstart-nodejs/azure-portal-create-cosmos-db-table-api-2-240px.png" alt-text="A screenshot showing the location of the Add Table button." lightbox="./media/quickstart-nodejs/azure-portal-create-cosmos-db-table-api-2.png":::           |
| [!INCLUDE [Create Azure Cosmos DB db table step 3](./includes/quickstart-nodejs/create-cosmos-table-3.md)] | :::image type="content" source="./media/quickstart-nodejs/azure-portal-create-cosmos-db-table-api-3-240px.png" alt-text="A screenshot showing how to New Table dialog box for an Azure Cosmos DB table." lightbox="./media/quickstart-nodejs/azure-portal-create-cosmos-db-table-api-3.png":::           |

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

To access your table(s) in Azure Cosmos DB, your app will need the table connection string for the CosmosDB Storage account.  The connection string can be retrieved using the Azure portal, Azure CLI or Azure PowerShell.

### [Azure portal](#tab/azure-portal)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Get Azure Cosmos DB db table connection string step 1](./includes/quickstart-nodejs/get-cosmos-connection-string-1.md)] | :::image type="content" source="./media/quickstart-nodejs/azure-portal-cosmos-db-table-connection-string-1-240px.png" alt-text="A screenshot showing the location of the connection strings link on the Azure Cosmos DB page." lightbox="./media/quickstart-nodejs/azure-portal-cosmos-db-table-connection-string-1.png":::           |
| [!INCLUDE [Get Azure Cosmos DB db table connection string step 2](./includes/quickstart-nodejs/get-cosmos-connection-string-2.md)] | :::image type="content" source="./media/quickstart-nodejs/azure-portal-cosmos-db-table-connection-string-2-240px.png" alt-text="A screenshot showing which connection string to select and use in your application." lightbox="./media/quickstart-nodejs/azure-portal-cosmos-db-table-connection-string-2.png":::           |

### [Azure CLI](#tab/azure-cli)

To get the primary table storage connection string using Azure CLI, use the [az cosmosdb keys list](/cli/azure/cosmosdb/keys#az-cosmosdb-keys-list) command with the option `--type connection-strings`.  This command uses a [JMESPath query](/cli/azure/query-azure-cli) to display only the primary table connection string.

```azurecli
# This gets the primary Table connection string
az cosmosdb keys list \
    --type connection-strings \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $COSMOS_ACCOUNT_NAME \
    --query "connectionStrings[?description=='Primary Table Connection String'].connectionString" \
    --output tsv
```

### [Azure PowerShell](#tab/azure-powershell)

To get the primary table storage connection string using Azure PowerShell, use the [Get-AzCosmosDBAccountKey](/powershell/module/az.cosmosdb/get-azcosmosdbaccountkey) cmdlet.

```azurepowershell
# This gets the primary Table connection string
$(Get-AzCosmosDBAccountKey `
    -ResourceGroupName $resourceGroupName `
    -Name $cosmosAccountName `
    -Type "ConnectionStrings")."Primary Table Connection String"
```

The connection string for your Azure Cosmos DB account is considered an app secret and must be protected like any other app secret or password.  

---

## 4 - Install the Azure Data Tables SDK for JS

To access the Azure Cosmos DB for Table from a nodejs application, install the [Azure Data Tables SDK](https://www.npmjs.com/package/@azure/data-tables) package.

```bash
  npm install @azure/data-tables
```

## 5 - Configure the Table client in env.js file

Copy your Azure Cosmos DB or Storage account connection string from the Azure portal, and create a TableServiceClient object using your copied connection string. Switch to folder `1-strater-app` or `2-completed-app`. Then, add the value of the corresponding environment variables in `configure/env.js` file.

```js
const env = {
  connectionString:"A connection string to an Azure Storage or Azure Cosmos DB account.",
  tableName: "WeatherData",
};
```

The Azure SDK communicates with Azure using client objects to execute different operations against Azure. The `TableClient` class is the class used to communicate with the Azure Cosmos DB for Table. An application will typically create a single `serviceClient` object per table to be used throughout the application.

```js
const { TableClient } = require("@azure/data-tables");
const env = require("../configure/env");
const serviceClient = TableClient.fromConnectionString(
  env.connectionString,
  env.tableName
);
```

---

## 6 - Implement Azure Cosmos DB table operations

All Azure Cosmos DB table operations for the sample app are implemented in the `serviceClient` object located in `tableClient.js` file under *service* directory. 

```js
const { TableClient } = require("@azure/data-tables");
const env = require("../configure/env");
const serviceClient = TableClient.fromConnectionString(
  env.connectionString,
  env.tableName
);
```

### Get rows from a table

The `serviceClient` object contains a method named `listEntities` which allows you to select rows from the table.  In this example, since no parameters are being passed to the method, all rows will be selected from the table.

```js
const allRowsEntities = serviceClient.listEntities();
```

### Filter rows returned from a table

To filter the rows returned from a table, you can pass an OData style filter string to the `listEntities` method. For example, if you wanted to get all of the weather readings for Chicago between midnight July 1, 2021 and midnight July 2, 2021 (inclusive) you would pass in the following filter string.

```odata
PartitionKey eq 'Chicago' and RowKey ge '2021-07-01 12:00' and RowKey le '2021-07-02 12:00'
```

You can view all OData filter operators on the OData website in the section Filter [System Query Option](https://www.odata.org/documentation/odata-version-2-0/uri-conventions/).

When request.args parameter is passed to the `listEntities` method in the `serviceClient` class, it creates a filter string for each non-null property value. It then creates a combined filter string by joining all of the values together with an "and" clause. This combined filter string is passed to the `listEntities` method on the `serviceClient` object and only rows matching the filter string will be returned. You can use a similar method in your code to construct suitable filter strings as required by your application.

```js
const filterEntities = async function (option) {
  /*
    You can query data according to existing fields
    option provides some conditions to query,eg partitionKey, rowKeyDateTimeStart, rowKeyDateTimeEnd
    minTemperature, maxTemperature, minPrecipitation, maxPrecipitation
  */
  const filterEntitiesArray = [];
  const filters = [];
  if (option.partitionKey) {
    filters.push(`PartitionKey eq '${option.partitionKey}'`);
  }
  if (option.rowKeyDateTimeStart) {
    filters.push(`RowKey ge '${option.rowKeyDateTimeStart}'`);
  }
  if (option.rowKeyDateTimeEnd) {
    filters.push(`RowKey le '${option.rowKeyDateTimeEnd}'`);
  }
  if (option.minTemperature !== null) {
    filters.push(`Temperature ge ${option.minTemperature}`);
  }
  if (option.maxTemperature !== null) {
    filters.push(`Temperature le ${option.maxTemperature}`);
  }
  if (option.minPrecipitation !== null) {
    filters.push(`Precipitation ge ${option.minPrecipitation}`);
  }
  if (option.maxPrecipitation !== null) {
    filters.push(`Precipitation le ${option.maxPrecipitation}`);
  }
  const res = serviceClient.listEntities({
    queryOptions: {
      filter: filters.join(" and "),
    },
  });
  for await (const entity of res) {
    filterEntitiesArray.push(entity);
  }

  return filterEntitiesArray;
};
```

### Insert data using a TableEntity object

The simplest way to add data to a table is by using a `TableEntity` object. In this example, data is mapped from an input model object to a `TableEntity` object. The properties on the input object representing the weather station name and observation date/time are mapped to the `PartitionKey` and `RowKey` properties respectively which together form a unique key for the row in the table. Then the additional properties on the input model object are mapped to dictionary properties on the TableEntity object. Finally, the `createEntity` method on the `serviceClient` object is used to insert data into the table.

Modify the `insertEntity` function in the example application to contain the following code.

```js
const insertEntity = async function (entity) {

  await serviceClient.createEntity(entity);

};
```
### Upsert data using a TableEntity object

If you try to insert a row into a table with a partition key/row key combination that already exists in that table, you will receive an error. For this reason, it is often preferable to use the `upsertEntity` instead of the `createEntity` method when adding rows to a table. If the given partition key/row key combination already exists in the table, the `upsertEntity` method will update the existing row. Otherwise, the row will be added to the table.

```js
const upsertEntity = async function (entity) {

  await serviceClient.upsertEntity(entity, "Merge");

};
```
### Insert or upsert data with variable properties

One of the advantages of using the Azure Cosmos DB for Table is that if an object being loaded to a table contains any new properties then those properties are automatically added to the table and the values stored in Azure Cosmos DB. There is no need to run DDL statements like ALTER TABLE to add columns as in a traditional database.

This model gives your application flexibility when dealing with data sources that may add or modify what data needs to be captured over time or when different inputs provide different data to your application. In the sample application, we can simulate a weather station that sends not just the base weather data but also some additional values. When an object with these new properties is stored in the table for the first time, the corresponding properties (columns) will be automatically added to the table.

To insert or upsert such an object using the API for Table, map the properties of the expandable object into a `TableEntity` object and use the `createEntity` or `upsertEntity` methods on the `serviceClient` object as appropriate.

In the sample application, the `upsertEntity` function can also implement the function of insert or upsert data with variable properties

```js
const insertEntity = async function (entity) {
  await serviceClient.createEntity(entity);
};

const upsertEntity = async function (entity) {
  await serviceClient.upsertEntity(entity, "Merge");
};
```
### Update an entity

Entities can be updated by calling the `updateEntity` method on the `serviceClient` object. 

In the sample app, this object is passed to the `upsertEntity` method in the `serviceClient` object. It updates that entity object and uses the `upsertEntity` method save the updates to the database. 

```js
const updateEntity = async function (entity) {
  await serviceClient.updateEntity(entity, "Replace");
};
```

## 7 - Run the code

Run the sample application to interact with the Azure Cosmos DB for Table.  The first time you run the application, there will be no data because the table is empty.  Use any of the buttons at the top of application to add data to the table.

:::image type="content" source="./media/quickstart-nodejs/table-api-app-data-insert-buttons-480px.png" alt-text="A screenshot of the application showing the location of the buttons used to insert data into Azure Cosmos DB using the Table API." lightbox="./media/quickstart-nodejs/table-api-app-data-insert-buttons.png":::

Selecting the **Insert using Table Entity** button opens a dialog allowing you to insert or upsert a new row using a `TableEntity` object.

:::image type="content" source="./media/quickstart-nodejs/table-api-app-insert-table-entity-480px.png" alt-text="A screenshot of the application showing the dialog box used to insert data using a TableEntity object." lightbox="./media/quickstart-nodejs/table-api-app-insert-table-entity.png":::

Selecting the **Insert using Expandable Data** button brings up a dialog that enables you to insert an object with custom properties, demonstrating how the Azure Cosmos DB for Table automatically adds properties (columns) to the table when needed.  Use the *Add Custom Field* button to add one or more new properties and demonstrate this capability.

:::image type="content" source="./media/quickstart-nodejs/table-api-app-insert-expandable-entity-480px.png" alt-text="A screenshot of the application showing the dialog box used to insert data using an object with custom fields." lightbox="./media/quickstart-nodejs/table-api-app-insert-expandable-entity.png":::

Use the **Insert Sample Data** button to load some sample data into your Azure Cosmos DB Table.

:::image type="content" source="./media/quickstart-nodejs/table-api-app-sample-data-insert-480px.png" alt-text="A screenshot of the application showing the location of the sample data insert button." lightbox="./media/quickstart-nodejs/table-api-app-sample-data-insert.png":::

Select the **Filter Results** item in the top menu to be taken to the Filter Results page.  On this page, fill out the filter criteria to demonstrate how a filter clause can be built and passed to the Azure Cosmos DB for Table.

:::image type="content" source="./media/quickstart-nodejs/table-api-app-filter-data-480px.png" alt-text="A screenshot of the application showing filter results page and highlighting the menu item used to navigate to the page." lightbox="./media/quickstart-nodejs/table-api-app-filter-data.png":::

## Clean up resources

When you are finished with the sample application, you should remove all Azure resources related to this article from your Azure account.  You can do this by deleting the resource group.

### [Azure portal](#tab/azure-portal)

A resource group can be deleted using the [Azure portal](https://portal.azure.com/) by doing the following.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Delete resource group step 1](./includes/quickstart-nodejs/remove-resource-group-1.md)] | :::image type="content" source="./media/quickstart-nodejs/azure-portal-remove-resource-group-1-240px.png" alt-text="A screenshot showing how to search for a resource group." lightbox="./media/quickstart-nodejs/azure-portal-remove-resource-group-1.png"::: |
| [!INCLUDE [Delete resource group step 2](./includes/quickstart-nodejs/remove-resource-group-2.md)] | :::image type="content" source="./media/quickstart-nodejs/azure-portal-remove-resource-group-2-240px.png" alt-text="A screenshot showing the location of the Delete resource group button." lightbox="./media/quickstart-nodejs/azure-portal-remove-resource-group-2.png"::: |
| [!INCLUDE [Delete resource group step 3](./includes/quickstart-nodejs/remove-resource-group-3.md)] | :::image type="content" source="./media/quickstart-nodejs/azure-portal-remove-resource-group-3-240px.png" alt-text="A screenshot showing the confirmation dialog for deleting a resource group." lightbox="./media/quickstart-nodejs/azure-portal-remove-resource-group-3.png"::: |

### [Azure CLI](#tab/azure-cli)

To delete a resource group using the Azure CLI, use the [az group delete](/cli/azure/group#az-group-delete) command with the name of the resource group to be deleted.  Deleting a resource group will also remove all Azure resources contained in the resource group.

```azurecli
az group delete --name $RESOURCE_GROUP_NAME
```

### [Azure PowerShell](#tab/azure-powershell)

To delete a resource group using Azure PowerShell, use the [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) command with the name of the resource group to be deleted.  Deleting a resource group will also remove all Azure resources contained in the resource group.

```azurepowershell
Remove-AzResourceGroup -Name $resourceGroupName
```

---

## Next steps

In this quickstart, you've learned how to create an Azure Cosmos DB account, create a table using the Data Explorer, and run an app. Now you can query your data using the API for Table.  

> [!div class="nextstepaction"]
> [Query Azure Cosmos DB by using the API for Table](tutorial-query.md)
