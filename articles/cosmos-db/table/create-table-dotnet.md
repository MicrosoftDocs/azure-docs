---
title: 'Quickstart: Table API with .NET - Azure Cosmos DB'
description: This quickstart shows how to access the Azure Cosmos DB Table API from a .NET application using the Azure.Data.Tables SDK
author: DavidCBerry13
ms.service: cosmos-db
ms.subservice: cosmosdb-table
ms.devlang: csharp
ms.topic: quickstart
ms.date: 09/26/2021
ms.author: daberry
ms.custom: devx-track-csharp, mode-api, devx-track-azurecli
---

# Quickstart: Build a Table API app with .NET SDK and Azure Cosmos DB

[!INCLUDE[appliesto-table-api](../includes/appliesto-table-api.md)]

This quickstart shows how to access the Azure Cosmos DB [Table API](introduction.md) from a .NET application.  The Cosmos DB Table API is a schemaless data store allowing applications to store structured NoSQL data in the cloud.  Because data is stored in a schemaless design, new properties (columns) are automatically added to the table when an object with a new attribute is added to the table.

.NET applications can access the Cosmos DB Table API using the [Azure.Data.Tables](https://www.nuget.org/packages/Azure.Data.Tables/) NuGet package.  The [Azure.Data.Tables](https://www.nuget.org/packages/Azure.Data.Tables/) package is a [.NET Standard 2.0](/dotnet/standard/net-standard) library that works with both .NET Framework (4.7.2 and later) and .NET Core (2.0 and later) applications.

## Prerequisites

The sample application is written in [.NET Core 3.1](https://dotnet.microsoft.com/download/dotnet/3.1), though the principles apply to both .NET Framework and .NET Core applications.  You can use either [Visual Studio](https://www.visualstudio.com/downloads/), [Visual Studio for Mac](https://visualstudio.microsoft.com/vs/mac/), or [Visual Studio Code](https://code.visualstudio.com/) as an IDE.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note-dotnet.md)]

## Sample application

The sample application for this tutorial may be cloned or downloaded from the repository [https://github.com/Azure-Samples/msdocs-azure-data-tables-sdk-dotnet](https://github.com/Azure-Samples/msdocs-azure-data-tables-sdk-dotnet).  Both a starter and completed app are included in the sample repository.

```bash
git clone https://github.com/Azure-Samples/msdocs-azure-data-tables-sdk-dotnet
```

The sample application uses weather data as an example to demonstrate the capabilities of the Table API. Objects representing weather observations are stored and retrieved using the Table API, including storing objects with additional properties to demonstrate the schemaless capabilities of the Table API.

:::image type="content" source="./media/create-table-dotnet/table-api-app-finished-application-720px.png" alt-text="A screenshot of the finished application showing data stored in a Cosmos DB table using the Table API." lightbox="./media/create-table-dotnet/table-api-app-finished-application.png":::

## 1 - Create an Azure Cosmos DB account

You first need to create a Cosmos DB Tables API account that will contain the table(s) used in your application.  This can be done using the Azure portal, Azure CLI, or Azure PowerShell.

### [Azure portal](#tab/azure-portal)

Log in to the [Azure portal](https://portal.azure.com/) and follow these steps to create an Cosmos DB account.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Create cosmos db account step 1](./includes/create-table-dotnet/create-cosmos-db-acct-1.md)] | :::image type="content" source="./media/create-table-dotnet/azure-portal-create-cosmos-db-account-table-api-1-240px.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find Cosmos DB accounts in Azure." lightbox="./media/create-table-dotnet/azure-portal-create-cosmos-db-account-table-api-1.png":::           |
| [!INCLUDE [Create cosmos db account step 1](./includes/create-table-dotnet/create-cosmos-db-acct-2.md)] | :::image type="content" source="./media/create-table-dotnet/azure-portal-create-cosmos-db-account-table-api-2-240px.png" alt-text="A screenshot showing the Create button location on the Cosmos DB accounts page in Azure." lightbox="./media/create-table-dotnet/azure-portal-create-cosmos-db-account-table-api-2.png":::           |
| [!INCLUDE [Create cosmos db account step 1](./includes/create-table-dotnet/create-cosmos-db-acct-3.md)] | :::image type="content" source="./media/create-table-dotnet/azure-portal-create-cosmos-db-account-table-api-3-240px.png" alt-text="A screenshot showing the Azure Table option as the correct option to select." lightbox="./media/create-table-dotnet/azure-portal-create-cosmos-db-account-table-api-3.png":::           |
| [!INCLUDE [Create cosmos db account step 1](./includes/create-table-dotnet/create-cosmos-db-acct-4.md)] | :::image type="content" source="./media/create-table-dotnet/azure-portal-create-cosmos-db-account-table-api-4-240px.png" alt-text="A screenshot showing how to fill out the fields on the Cosmos DB Account creation page." lightbox="./media/create-table-dotnet/azure-portal-create-cosmos-db-account-table-api-4.png":::           |

### [Azure CLI](#tab/azure-cli)

Cosmos DB accounts are created using the [az cosmosdb create](/cli/azure/cosmosdb#az-cosmosdb-create) command. You must include the `--capabilities EnableTable` option to enable table storage within your Cosmos DB.  As all Azure resource must be contained in a resource group, the following code snippet also creates a resource group for the  Cosmos DB account.

Cosmos DB account names must be between 3 and 44 characters in length and may contain only lowercase letters, numbers, and the hyphen (-) character.  Cosmos DB account names must also be unique across Azure.

Azure CLI commands can be run in the [Azure Cloud Shell](https://shell.azure.com) or on a workstation with the [Azure CLI installed](/cli/azure/install-azure-cli).

It typically takes several minutes for the Cosmos DB account creation process to complete.

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

Azure Cosmos DB accounts are created using the [New-AzCosmosDBAccount](/powershell/module/az.cosmosdb/new-azcosmosdbaccount) cmdlet. You must include the `-ApiKind "Table"` option to enable table storage within your Cosmos DB.  As all Azure resource must be contained in a resource group, the following code snippet also creates a resource group for the Azure Cosmos DB account.

Azure Cosmos DB account names must be between 3 and 44 characters in length and may contain only lowercase letters, numbers, and the hyphen (-) character.  Azure Cosmos DB account names must also be unique across Azure.

Azure PowerShell commands can be run in the [Azure Cloud Shell](https://shell.azure.com) or on a workstation with [Azure PowerShell installed](/powershell/azure/install-az-ps).

It typically takes several minutes for the Cosmos DB account creation process to complete.

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

Next, you need to create a table within your Cosmos DB account for your application to use.  Unlike a traditional database, you only need to specify the name of the table, not the properties (columns) in the table.  As data is loaded into your table, the properties (columns) will be automatically created as needed.

### [Azure portal](#tab/azure-portal)

In the [Azure portal](https://portal.azure.com/), complete the following steps to create a table inside your Cosmos DB account.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Create cosmos db table step 1](./includes/create-table-dotnet/create-cosmos-table-1.md)] | :::image type="content" source="./media/create-table-dotnet/azure-portal-create-cosmos-db-table-api-1-240px.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find your Cosmos DB account." lightbox="./media/create-table-dotnet/azure-portal-create-cosmos-db-table-api-1.png":::           |
| [!INCLUDE [Create cosmos db table step 2](./includes/create-table-dotnet/create-cosmos-table-2.md)] | :::image type="content" source="./media/create-table-dotnet/azure-portal-create-cosmos-db-table-api-2-240px.png" alt-text="A screenshot showing the location of the Add Table button." lightbox="./media/create-table-dotnet/azure-portal-create-cosmos-db-table-api-2.png":::           |
| [!INCLUDE [Create cosmos db table step 3](./includes/create-table-dotnet/create-cosmos-table-3.md)] | :::image type="content" source="./media/create-table-dotnet/azure-portal-create-cosmos-db-table-api-3-240px.png" alt-text="A screenshot showing how to New Table dialog box for an Cosmos DB table." lightbox="./media/create-table-dotnet/azure-portal-create-cosmos-db-table-api-3.png":::           |

### [Azure CLI](#tab/azure-cli)

Tables in Cosmos DB are created using the [az cosmosdb table create](/cli/azure/cosmosdb/table#az-cosmosdb-table-create) command.

```azurecli
COSMOS_TABLE_NAME='WeatherData'

az cosmosdb table create \
    --account-name $COSMOS_ACCOUNT_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $COSMOS_TABLE_NAME \
    --throughput 400
```

### [Azure PowerShell](#tab/azure-powershell)

Tables in Cosmos DB are created using the [New-AzCosmosDBTable](/powershell/module/az.cosmosdb/new-azcosmosdbtable) cmdlet.

```azurepowershell
$cosmosTableName = 'WeatherData'

# Create the table for the application to use
New-AzCosmosDBTable `
    -Name $cosmosTableName `
    -AccountName $cosmosAccountName `
    -ResourceGroupName $resourceGroupName
```

---

## 3 - Get Cosmos DB connection string

To access your table(s) in Cosmos DB, your app will need the table connection string for the CosmosDB Storage account.  The connection string can be retrieved using the Azure portal, Azure CLI or Azure PowerShell.

### [Azure portal](#tab/azure-portal)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Get cosmos db table connection string step 1](./includes/create-table-dotnet/get-cosmos-connection-string-1.md)] | :::image type="content" source="./media/create-table-dotnet/azure-portal-cosmos-db-table-connection-string-1-240px.png" alt-text="A screenshot showing the location of the connection strings link on the Cosmos DB page." lightbox="./media/create-table-dotnet/azure-portal-cosmos-db-table-connection-string-1.png":::           |
| [!INCLUDE [Get cosmos db table connection string step 2](./includes/create-table-dotnet/get-cosmos-connection-string-2.md)] | :::image type="content" source="./media/create-table-dotnet/azure-portal-cosmos-db-table-connection-string-2-240px.png" alt-text="A screenshot showing the which connection string to select and use in your application." lightbox="./media/create-table-dotnet/azure-portal-cosmos-db-table-connection-string-2.png":::           |

### [Azure CLI](#tab/azure-cli)

To get the primary table storage connection string using Azure CLI, use the [az cosmosdb keys list](/cli/azure/cosmosdb/keys#az-cosmosdb-keys-list) command with the option `--type connection-strings`.  This command uses a [JMESPath query](https://jmespath.org/) to display only the primary table connection string.

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

---

The connection string for your Cosmos DB account is considered an app secret and must be protected like any other app secret or password.  This example uses the [Secret Manager tool](/aspnet/core/security/app-secrets#secret-manager) to store the connection string during development and make it available to the application.  The Secret Manager tool can be accessed from either Visual Studio or the .NET CLI.

### [Visual Studio](#tab/visual-studio)

To open the Secret Manager tool from Visual Studio, right-click on the project and select **Manage User Secrets** from the context menu.  This will open the *secrets.json* file for the project.  Replace the contents of the file with the JSON below, substituting in your Cosmos DB table connection string.

```json
{
  "ConnectionStrings": {
    "CosmosTableApi": "<cosmos db table connection string>"
  }  
}
```

### [.NET CLI](#tab/netcore-cli)

To use the Secret Manager, you must first initialize it for your project using the `dotnet user-secrets init` command.

```dotnetcli
dotnet user-secrets init
```

Then, use the `dotnet user-secrets set` command to add the Cosmos DB table connection string as a secret.

```dotnetcli
dotnet user-secrets set "ConnectionStrings:CosmosTableApi" "<cosmos db table connection string>"
```

---

## 4 - Install Azure.Data.Tables NuGet package

To access the Cosmos DB Table API from a .NET application, install the [Azure.Data.Tables](https://www.nuget.org/packages/Azure.Data.Tables) NuGet package.

### [Visual Studio](#tab/visual-studio)

```PowerShell
Install-Package Azure.Data.Tables
```

### [.NET CLI](#tab/netcore-cli)

```dotnetcli
dotnet add package Azure.Data.Tables
```

---

## 5 - Configure the Table client in Startup.cs

The Azure SDK communicates with Azure using client objects to execute different operations against Azure.  The [TableClient](/dotnet/api/azure.data.tables.tableclient) object is the object used to communicate with the Cosmos DB Table API.

An application will typically create a single [TableClient](/dotnet/api/azure.data.tables.tableclient) object per table to be used throughout the application.  It's recommended to use dependency injection (DI) and register the [TableClient](/dotnet/api/azure.data.tables.tableclient) object as a singleton to accomplish this.  For more information about using DI with the Azure SDK, see [Dependency injection with the Azure SDK for .NET](/dotnet/azure/sdk/dependency-injection).

In the `Startup.cs` file of the application, edit the ConfigureServices() method to match the following code snippet:

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddRazorPages()
        .AddMvcOptions(options =>
        {
            options.Filters.Add(new ValidationFilter());
        });
    
    var connectionString = Configuration.GetConnectionString("CosmosTableApi");
    services.AddSingleton<TableClient>(new TableClient(connectionString, "WeatherData"));
    
    services.AddSingleton<TablesService>();
}
```

You will also need to add the following using statement at the top of the Startup.cs file.

```csharp
using Azure.Data.Tables;
```

## 6 - Implement Cosmos DB table operations

All Cosmos DB table operations for the sample app are implemented in the `TableService` class located in the *Services* directory.  You will need to import the `Azure` and `Azure.Data.Tables` namespaces at the top of this file to work with objects in the `Azure.Data.Tables` SDK package.

```csharp
using Azure;
using Azure.Data.Tables;
```

At the start of the `TableService` class, add a member variable for the [TableClient](/dotnet/api/azure.data.tables.tableclient) object and a constructor to allow the [TableClient](/dotnet/api/azure.data.tables.tableclient) object to be injected into the class.

```csharp
private TableClient _tableClient;

public TablesService(TableClient tableClient)
{
    _tableClient = tableClient;
}
```

### Get rows from a table

The [TableClient](/dotnet/api/azure.data.tables.tableclient) class contains a method named [Query](/dotnet/api/azure.data.tables.tableclient.query) which allows you to select rows from the table.  In this example, since no parameters are being passed to the method, all rows will be selected from the table.

The method also takes a generic parameter of type [ITableEntity](/dotnet/api/azure.data.tables.itableentity) that specifies the model class data will be returned as. In this case, the built-in class [TableEntity](/dotnet/api/azure.data.tables.itableentity) is used, meaning the `Query` method will return a `Pageable<TableEntity>` collection as its results.

```csharp
public IEnumerable<WeatherDataModel> GetAllRows()
{
    Pageable<TableEntity> entities = _tableClient.Query<TableEntity>();

    return entities.Select(e => MapTableEntityToWeatherDataModel(e));
}
```

The [TableEntity](/dotnet/api/azure.data.tables.itableentity) class defined in the `Azure.Data.Tables` package has properties for the partition key and row key values in the table.  Together, these two values for a unique key for the row in the table.  In this example application, the name of the weather station (city) is stored in the partition key and the date/time of the observation is stored in the row key.  All other properties (temperature, humidity, wind speed) are stored in a dictionary in the `TableEntity` object.

It is common practice to map a [TableEntity](/dotnet/api/azure.data.tables.tableentity) object to an object of your own definition.  The sample application defines a class `WeatherDataModel` in the *Models* directory for this purpose.  This class has properties for the station name and observation date that the partition key and row key will map to, providing more meaningful property names for these values.  It then uses a dictionary to store all the other properties on the object.  This is a common pattern when working with Table storage since a row can have any number of arbitrary properties and we want our model objects to be able to capture all of them.  This class also contains methods to list the properties on the class.

```csharp
public class WeatherDataModel 
{
    // Captures all of the weather data properties -- temp, humidity, wind speed, etc
    private Dictionary<string, object> _properties = new Dictionary<string, object>();

    public string StationName { get; set; }

    public string ObservationDate { get; set; }

    public DateTimeOffset? Timestamp { get; set; }

    public string Etag { get; set; }

    public object this[string name] 
    { 
        get => ( ContainsProperty(name)) ? _properties[name] : null; 
        set => _properties[name] = value; 
    }
    
    public ICollection<string> PropertyNames => _properties.Keys;

    public int PropertyCount => _properties.Count;

    public bool ContainsProperty(string name) => _properties.ContainsKey(name);       
}
```

The `MapTableEntityToWeatherDataModel` method is used to map a [TableEntity](/dotnet/api/azure.data.tables.itableentity) object to a `WeatherDataModel` object.  The [TableEntity](/dotnet/api/azure.data.tables.itableentity) object contains a [Keys](/dotnet/api/azure.data.tables.tableentity.keys) property to get all of the property names contained in the table for the object (effectively the column names for this row in the table).  The `MapTableEntityToWeatherDataModel` method directly maps the `PartitionKey`, `RowKey`, `Timestamp`, and `Etag` properties and then uses the `Keys` property to iterate over the other properties in the `TableEntity` object and map those to the `WeatherDataModel` object, minus the properties that have already been directly mapped.

Edit the code in the `MapTableEntityToWeatherDataModel` method to match the following code block.

```csharp
public WeatherDataModel MapTableEntityToWeatherDataModel(TableEntity entity)
{
    WeatherDataModel observation = new WeatherDataModel();
    observation.StationName = entity.PartitionKey;
    observation.ObservationDate = entity.RowKey;
    observation.Timestamp = entity.Timestamp;
    observation.Etag = entity.ETag.ToString();

    var measurements = entity.Keys.Where(key => !EXCLUDE_TABLE_ENTITY_KEYS.Contains(key));
    foreach (var key in measurements)
    {
        observation[key] = entity[key];
    }
    return observation;            
}
```

### Filter rows returned from a table

To filter the rows returned from a table, you can pass an OData style filter string to the [Query](/dotnet/api/azure.data.tables.tableclient.query) method. For example, if you wanted to get all of the weather readings for Chicago between midnight July 1, 2021 and midnight July 2, 2021 (inclusive) you would pass in the following filter string.

```odata
PartitionKey eq 'Chicago' and RowKey ge '2021-07-01 12:00 AM' and RowKey le '2021-07-02 12:00 AM'
```

You can view all OData filter operators on the OData website in the section [Filter System Query Option](https://www.odata.org/documentation/odata-version-2-0/uri-conventions/).

In the example application, the `FilterResultsInputModel` object is designed to capture any filter criteria provided by the user.

```csharp
public class FilterResultsInputModel : IValidatableObject
{
    public string PartitionKey { get; set; }
    public string RowKeyDateStart { get; set; }
    public string RowKeyTimeStart { get; set; }
    public string RowKeyDateEnd { get; set; }
    public string RowKeyTimeEnd { get; set; }
    [Range(-100, +200)]
    public double? MinTemperature { get; set; }
    [Range(-100,200)]
    public double? MaxTemperature { get; set; }
    [Range(0, 300)]
    public double? MinPrecipitation { get; set; }
    [Range(0,300)]
    public double? MaxPrecipitation { get; set; }
}
```

When this object is passed to the `GetFilteredRows` method in the `TableService` class, it creates a filter string for each non-null property value.  It then creates a combined filter string by joining all of the values together with an "and" clause.  This combined filter string is passed to the [Query](/dotnet/api/azure.data.tables.tableclient.query) method on the [TableClient](/dotnet/api/azure.data.tables.tableclient) object and only rows matching the filter string will be returned.  You can use a similar method in your code to construct suitable filter strings as required by your application.

```csharp
public IEnumerable<WeatherDataModel> GetFilteredRows(FilterResultsInputModel inputModel)
{
    List<string> filters = new List<string>();

    if (!String.IsNullOrEmpty(inputModel.PartitionKey))
        filters.Add($"PartitionKey eq '{inputModel.PartitionKey}'");
    if (!String.IsNullOrEmpty(inputModel.RowKeyDateStart) && !String.IsNullOrEmpty(inputModel.RowKeyTimeStart))
        filters.Add($"RowKey ge '{inputModel.RowKeyDateStart} {inputModel.RowKeyTimeStart}'");
    if (!String.IsNullOrEmpty(inputModel.RowKeyDateEnd) && !String.IsNullOrEmpty(inputModel.RowKeyTimeEnd))
        filters.Add($"RowKey le '{inputModel.RowKeyDateEnd} {inputModel.RowKeyTimeEnd}'");
    if (inputModel.MinTemperature.HasValue)
        filters.Add($"Temperature ge {inputModel.MinTemperature.Value}");
    if (inputModel.MaxTemperature.HasValue)
        filters.Add($"Temperature le {inputModel.MaxTemperature.Value}");
    if (inputModel.MinPrecipitation.HasValue)
        filters.Add($"Precipitation ge {inputModel.MinTemperature.Value}");
    if (inputModel.MaxPrecipitation.HasValue)
        filters.Add($"Precipitation le {inputModel.MaxTemperature.Value}");

    string filter = String.Join(" and ", filters);
    Pageable<TableEntity> entities = _tableClient.Query<TableEntity>(filter);

    return entities.Select(e => MapTableEntityToWeatherDataModel(e));
}
```

### Insert data using a TableEntity object

The simplest way to add data to a table is by using a [TableEntity](/dotnet/api/azure.data.tables.itableentity) object.  In this example, data is mapped from an input model object to a [TableEntity](/dotnet/api/azure.data.tables.itableentity) object.  The properties on the input object representing the weather station name and observation date/time are mapped to the [PartitionKey](/dotnet/api/azure.data.tables.tableentity.partitionkey) and [RowKey](/dotnet/api/azure.data.tables.tableentity.rowkey) properties respectively which together form a unique key for the row in the table.  Then the additional properties on the input model object are mapped to dictionary properties on the TableEntity object.  Finally, the [AddEntity](/dotnet/api/azure.data.tables.tableclient.addentity) method on the [TableClient](/dotnet/api/azure.data.tables.tableclient) object is used to insert data into the table.

Modify the `InsertTableEntity` class in the example application to contain the following code.

```csharp
public void InsertTableEntity(WeatherInputModel model)
{
    TableEntity entity = new TableEntity();
    entity.PartitionKey = model.StationName;
    entity.RowKey = $"{model.ObservationDate} {model.ObservationTime}";

    // The other values are added like a items to a dictionary
    entity["Temperature"] = model.Temperature;
    entity["Humidity"] = model.Humidity;
    entity["Barometer"] = model.Barometer;
    entity["WindDirection"] = model.WindDirection;
    entity["WindSpeed"] = model.WindSpeed;
    entity["Precipitation"] = model.Precipitation;

    _tableClient.AddEntity(entity);
}
```

### Upsert data using a TableEntity object

If you try to insert a row into a table with a partition key/row key combination that already exists in that table, you will receive an error.  For this reason, it is often preferable to use the [UpsertEntity](/dotnet/api/azure.data.tables.tableclient.upsertentity) instead of the AddEntity method when adding rows to a table.  If the given partition key/row key combination already exists in the table, the [UpsertEntity](/dotnet/api/azure.data.tables.tableclient.upsertentity) method will update the existing row.  Otherwise, the row will be added to the table.

```csharp
public void UpsertTableEntity(WeatherInputModel model)
{
    TableEntity entity = new TableEntity();
    entity.PartitionKey = model.StationName;
    entity.RowKey = $"{model.ObservationDate} {model.ObservationTime}";

    // The other values are added like a items to a dictionary
    entity["Temperature"] = model.Temperature;
    entity["Humidity"] = model.Humidity;
    entity["Barometer"] = model.Barometer;
    entity["WindDirection"] = model.WindDirection;
    entity["WindSpeed"] = model.WindSpeed;
    entity["Precipitation"] = model.Precipitation;

    _tableClient.UpsertEntity(entity);
}
```

### Insert or upsert data with variable properties

One of the advantages of using the Cosmos DB Table API is that if an object being loaded to a table contains any new properties then those properties are automatically added to the table and the values stored in Cosmos DB.  There is no need to run DDL statements like ALTER TABLE to add columns as in a traditional database.

This model gives your application flexibility when dealing with data sources that may add or modify what data needs to be captured over time or when different inputs provide different data to your application. In the sample application, we can simulate a weather station that sends not just the base weather data but also some additional values. When an object with these new properties is stored in the table for the first time, the corresponding properties (columns) will be automatically added to the table.

In the sample application, the `ExpandableWeatherObject` class is built around an internal dictionary to support any set of properties on the object.  This class represents a typical pattern for when an object needs to contain an arbitrary set of properties.

```csharp
public class ExpandableWeatherObject
{
    public Dictionary<string, object> _properties = new Dictionary<string, object>();

    public string StationName { get; set; }

    public string ObservationDate { get; set; }

    public object this[string name]
    {
        get => (ContainsProperty(name)) ? _properties[name] : null;
        set => _properties[name] = value;
    }

    public ICollection<string> PropertyNames => _properties.Keys;

    public int PropertyCount => _properties.Count;

    public bool ContainsProperty(string name) => _properties.ContainsKey(name);
}
```

To insert or upsert such an object using the Table API, map the properties of the expandable object into a [TableEntity](/dotnet/api/azure.data.tables.tableentity) object and use the [AddEntity](/dotnet/api/azure.data.tables.tableclient.addentity) or [UpsertEntity](/dotnet/api/azure.data.tables.tableclient.upsertentity) methods on the [TableClient](/dotnet/api/azure.data.tables.tableclient) object as appropriate.

```csharp
public void InsertExpandableData(ExpandableWeatherObject weatherObject)
{
    TableEntity entity = new TableEntity();
    entity.PartitionKey = weatherObject.StationName;
    entity.RowKey = weatherObject.ObservationDate;

    foreach (string propertyName in weatherObject.PropertyNames)
    {
        var value = weatherObject[propertyName];
        entity[propertyName] = value;
    }
    _tableClient.AddEntity(entity);
}

        
public void UpsertExpandableData(ExpandableWeatherObject weatherObject)
{
    TableEntity entity = new TableEntity();
    entity.PartitionKey = weatherObject.StationName;
    entity.RowKey = weatherObject.ObservationDate;

    foreach (string propertyName in weatherObject.PropertyNames)
    {
        var value = weatherObject[propertyName];
        entity[propertyName] = value;
    }
    _tableClient.UpsertEntity(entity);
}

```
  
### Update an entity

Entities can be updated by calling the [UpdateEntity](/dotnet/api/azure.data.tables.tableclient.updateentity) method on the [TableClient](/dotnet/api/azure.data.tables.tableclient) object.  Because an entity (row) stored using the Table API could contain any arbitrary set of properties, it is often useful to create an update object based around a Dictionary object similar to the `ExpandableWeatherObject` discussed earlier.  In this case, the only difference is the addition of an `Etag` property which is used for concurrency control during updates.

```csharp
public class UpdateWeatherObject
{
    public Dictionary<string, object> _properties = new Dictionary<string, object>();

    public string StationName { get; set; }
    public string ObservationDate { get; set; }
    public string Etag { get; set; }

    public object this[string name]
    {
        get => (ContainsProperty(name)) ? _properties[name] : null;
        set => _properties[name] = value;
    }

    public ICollection<string> PropertyNames => _properties.Keys;

    public int PropertyCount => _properties.Count;

    public bool ContainsProperty(string name) => _properties.ContainsKey(name);
}
```

In the sample app, this object is passed to the `UpdateEntity` method in the `TableService` class.  This method first loads the existing entity from the Table API using the [GetEntity](/dotnet/api/azure.data.tables.tableclient.getentity) method on the [TableClient](/dotnet/api/azure.data.tables.tableclient).  It then updates that entity object and uses the `UpdateEntity` method save the updates to the database.  Note how the [UpdateEntity](/dotnet/api/azure.data.tables.tableclient.updateentity) method takes the current Etag of the object to insure the object has not changed since it was initially loaded.  If you want to update the entity regardless, you may pass a value of `ETag.All` to the `UpdateEntity` method.

```csharp
public void UpdateEntity(UpdateWeatherObject weatherObject)
{
    string partitionKey = weatherObject.StationName;
    string rowKey = weatherObject.ObservationDate;

    // Use the partition key and row key to get the entity
    TableEntity entity = _tableClient.GetEntity<TableEntity>(partitionKey, rowKey).Value;

    foreach (string propertyName in weatherObject.PropertyNames)
    {
        var value = weatherObject[propertyName];
        entity[propertyName] = value;
    }

    _tableClient.UpdateEntity(entity, new ETag(weatherObject.Etag));
}
```

### Remove an entity

To remove an entity from a table, call the [DeleteEntity](/dotnet/api/azure.data.tables.tableclient.deleteentity) method on the [TableClient](/dotnet/api/azure.data.tables.tableclient) object with the partition key and row key of the object.

```csharp
public void RemoveEntity(string partitionKey, string rowKey)
{
    _tableClient.DeleteEntity(partitionKey, rowKey);           
}
```

## 7 - Run the code

Run the sample application to interact with the Cosmos DB Table API.  The first time you run the application, there will be no data because the table is empty.  Use any of the buttons at the top of application to add data to the table.

:::image type="content" source="./media/create-table-dotnet/table-api-app-data-insert-buttons-480px.png" alt-text="A screenshot of the application showing the location of the buttons used to insert data into Cosmos DB using the Table A P I." lightbox="./media/create-table-dotnet/table-api-app-data-insert-buttons.png":::

Selecting the **Insert using Table Entity** button opens a dialog allowing you to insert or upsert a new row using a `TableEntity` object.

:::image type="content" source="./media/create-table-dotnet/table-api-app-insert-table-entity-480px.png" alt-text="A screenshot of the application showing the dialog box used to insert data using a TableEntity object." lightbox="./media/create-table-dotnet/table-api-app-insert-table-entity.png":::

Selecting the **Insert using Expandable Data** button brings up a dialog that enables you to insert an object with custom properties, demonstrating how the Cosmos DB Table API automatically adds properties (columns) to the table when needed.  Use the *Add Custom Field* button to add one or more new properties and demonstrate this capability.

:::image type="content" source="./media/create-table-dotnet/table-api-app-insert-expandable-entity-480px.png" alt-text="A screenshot of the application showing the dialog box used to insert data using an object with custom fields." lightbox="./media/create-table-dotnet/table-api-app-insert-expandable-entity.png":::

Use the **Insert Sample Data** button to load some sample data into your Cosmos DB Table.

:::image type="content" source="./media/create-table-dotnet/table-api-app-sample-data-insert-480px.png" alt-text="A screenshot of the application showing the location of the sample data insert button." lightbox="./media/create-table-dotnet/table-api-app-sample-data-insert.png":::

Select the **Filter Results** item in the top menu to be taken to the Filter Results page.  On this page, fill out the filter criteria to demonstrate how a filter clause can be built and passed to the Cosmos DB Table API.

:::image type="content" source="./media/create-table-dotnet/table-api-app-filter-data-480px.png" alt-text="A screenshot of the application showing filter results page and highlighting the menu item used to navigate to the page." lightbox="./media/create-table-dotnet/table-api-app-filter-data.png":::

## Clean up resources

When you are finished with the sample application, you should remove all Azure resources related to this article from your Azure account.  You can do this by deleting the resource group.

### [Azure portal](#tab/azure-portal)

A resource group can be deleted using the [Azure portal](https://portal.azure.com/) by doing the following.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Delete resource group step 1](./includes/create-table-dotnet/remove-resource-group-1.md)] | :::image type="content" source="./media/create-table-dotnet/azure-portal-remove-resource-group-1-240px.png" alt-text="A screenshot showing how to search for a resource group." lightbox="./media/create-table-dotnet/azure-portal-remove-resource-group-1.png"::: |
| [!INCLUDE [Delete resource group step 2](./includes/create-table-dotnet/remove-resource-group-2.md)] | :::image type="content" source="./media/create-table-dotnet/azure-portal-remove-resource-group-2-240px.png" alt-text="A screenshot showing the location of the Delete resource group button." lightbox="./media/create-table-dotnet/azure-portal-remove-resource-group-2.png"::: |
| [!INCLUDE [Delete resource group step 3](./includes/create-table-dotnet/remove-resource-group-3.md)] | :::image type="content" source="./media/create-table-dotnet/azure-portal-remove-resource-group-3-240px.png" alt-text="A screenshot showing the confirmation dialog for deleting a resource group." lightbox="./media/create-table-dotnet/azure-portal-remove-resource-group-3.png"::: |

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

In this quickstart, you've learned how to create an Azure Cosmos DB account, create a table using the Data Explorer, and run an app.  Now you can query your data using the Table API.  

> [!div class="nextstepaction"]
> [Import table data to the Table API](table-import.md)
