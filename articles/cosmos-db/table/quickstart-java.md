---
title: Use the API for Table and Java to build an app - Azure Cosmos DB
description: This quickstart shows how to use the Azure Cosmos DB for Table to create an application with the Azure portal and Java
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: table
ms.devlang: java
ms.topic: quickstart
ms.date: 05/28/2020
ms.custom: seo-java-august2019, seo-java-september2019, devx-track-java, mode-api, ignite-2022, devx-track-extended-java
---

# Quickstart: Build a API for Table app with Java SDK and Azure Cosmos DB

[!INCLUDE[Table](../includes/appliesto-table.md)]

> [!div class="op_single_selector"]
>
> * [.NET](quickstart-dotnet.md)
> * [Java](quickstart-java.md)
> * [Node.js](quickstart-nodejs.md)
> * [Python](quickstart-python.md)
>

This quickstart shows how to access the Azure Cosmos DB [Tables API](introduction.md) from a Java application. The Azure Cosmos DB Tables API is a schemaless data store allowing applications to store structured NoSQL data in the cloud. Because data is stored in a schemaless design, new properties (columns) are automatically added to the table when an object with a new attribute is added to the table.

Java applications can access the Azure Cosmos DB Tables API using the [azure-data-tables](https://search.maven.org/artifact/com.azure/azure-data-tables) client library.

## Prerequisites

The sample application is written in [Spring Boot 2.6.4](https://spring.io/projects/spring-boot), You can use either [Visual Studio Code](https://code.visualstudio.com/), or [IntelliJ IDEA](https://www.jetbrains.com/idea/) as an IDE.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note-java.md)]

## Sample application

The sample application for this tutorial may be cloned or downloaded from the repository [https://github.com/Azure-Samples/msdocs-azure-data-tables-sdk-java](https://github.com/Azure-Samples/msdocs-azure-data-tables-sdk-java).  Both a starter and completed app are included in the sample repository.

```bash
git clone https://github.com/Azure-Samples/msdocs-azure-data-tables-sdk-java
```

The sample application uses weather data as an example to demonstrate the capabilities of the Tables API. Objects representing weather observations are stored and retrieved using the API for Table, including storing objects with additional properties to demonstrate the schemaless capabilities of the Tables API.

:::image type="content" source="./media/quickstart-java/table-api-app-finished-application-720px.png" alt-text="A screenshot of the finished application showing data stored in an Azure Cosmos DB table using the Table API." lightbox="./media/quickstart-java/table-api-app-finished-application.png":::

## 1 - Create an Azure Cosmos DB account

You first need to create an Azure Cosmos DB Tables API account that will contain the table(s) used in your application. This can be done using the Azure portal, Azure CLI, or Azure PowerShell.

### [Azure portal](#tab/azure-portal)

Sign in to the [Azure portal](https://portal.azure.com/) and follow these steps to create an Azure Cosmos DB account.

| Instructions                                                                                          |                                                                                                                                                                                                                                                                                                                               Screenshot |
|:------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
| [!INCLUDE [Create Azure Cosmos DB db account step 1](./includes/quickstart-java/create-cosmos-db-acct-1.md)] | :::image type="content" source="./media/quickstart-java/azure-portal-create-cosmos-db-account-table-api-1-240px.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find Azure Cosmos DB accounts in Azure." lightbox="./media/quickstart-java/azure-portal-create-cosmos-db-account-table-api-1.png"::: |
| [!INCLUDE [Create Azure Cosmos DB db account step 2](./includes/quickstart-java/create-cosmos-db-acct-2.md)] | :::image type="content" source="./media/quickstart-java/azure-portal-create-cosmos-db-account-table-api-2-240px.png" alt-text="A screenshot showing the Create button location on the Azure Cosmos DB accounts page in Azure." lightbox="./media/quickstart-java/azure-portal-create-cosmos-db-account-table-api-2.png"::: |
| [!INCLUDE [Create Azure Cosmos DB db account step 3](./includes/quickstart-java/create-cosmos-db-acct-3.md)] | :::image type="content" source="./media/quickstart-java/azure-portal-create-cosmos-db-account-table-api-3-240px.png" alt-text="A screenshot showing the Azure Table option as the correct option to select." lightbox="./media/quickstart-java/azure-portal-create-cosmos-db-account-table-api-3.png"::: |
| [!INCLUDE [Create Azure Cosmos DB db account step 4](./includes/quickstart-java/create-cosmos-db-acct-4.md)] | :::image type="content" source="./media/quickstart-java/azure-portal-create-cosmos-db-account-table-api-4-240px.png" alt-text="A screenshot showing how to fill out the fields on the Azure Cosmos DB Account creation page." lightbox="./media/quickstart-java/azure-portal-create-cosmos-db-account-table-api-4.png"::: |

### [Azure CLI](#tab/azure-cli)

Azure Cosmos DB accounts are created using the [az Azure Cosmos DB create](/cli/azure/cosmosdb#az-cosmosdb-create) command. You must include the `--capabilities EnableTable` option to enable table storage within your Azure Cosmos DB.  As all Azure resource must be contained in a resource group, the following code snippet also creates a resource group for the  Azure Cosmos DB account.

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

| Instructions                                                                                      | Screenshot |
|:--------------------------------------------------------------------------------------------------|-----------:|
| [!INCLUDE [Create Azure Cosmos DB db table step 1](./includes/quickstart-java/create-cosmos-table-1.md)] | :::image type="content" source="./media/quickstart-java/azure-portal-create-cosmos-db-table-api-1-240px.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find your Azure Cosmos DB account." lightbox="./media/quickstart-java/azure-portal-create-cosmos-db-table-api-1.png":::           |
| [!INCLUDE [Create Azure Cosmos DB db table step 2](./includes/quickstart-java/create-cosmos-table-2.md)] | :::image type="content" source="./media/quickstart-java/azure-portal-create-cosmos-db-table-api-2-240px.png" alt-text="A screenshot showing the location of the Add Table button." lightbox="./media/quickstart-java/azure-portal-create-cosmos-db-table-api-2.png":::           |
| [!INCLUDE [Create Azure Cosmos DB db table step 3](./includes/quickstart-java/create-cosmos-table-3.md)] | :::image type="content" source="./media/quickstart-java/azure-portal-create-cosmos-db-table-api-3-240px.png" alt-text="A screenshot showing how to New Table dialog box for an Azure Cosmos DB table." lightbox="./media/quickstart-java/azure-portal-create-cosmos-db-table-api-3.png":::           |

### [Azure CLI](#tab/azure-cli)

Tables in Azure Cosmos DB are created using the [az Azure Cosmos DB table create](/cli/azure/cosmosdb/table#az-cosmosdb-table-create) command.

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

To access your table(s) in Azure Cosmos DB, your app will need the table connection string for the CosmosDB Storage account. The connection string can be retrieved using the Azure portal, Azure CLI or Azure PowerShell.

### [Azure portal](#tab/azure-portal)

| Instructions                                                                                                              | Screenshot |
|:--------------------------------------------------------------------------------------------------------------------------|-----------:|
| [!INCLUDE [Get Azure Cosmos DB db table connection string step 1](./includes/quickstart-java/get-cosmos-connection-string-1.md)] | :::image type="content" source="./media/quickstart-java/azure-portal-cosmos-db-table-connection-string-1-240px.png" alt-text="A screenshot showing the location of the connection strings link on the Azure Cosmos DB page." lightbox="./media/quickstart-java/azure-portal-cosmos-db-table-connection-string-1.png":::           |
| [!INCLUDE [Get Azure Cosmos DB db table connection string step 2](./includes/quickstart-java/get-cosmos-connection-string-2.md)] | :::image type="content" source="./media/quickstart-java/azure-portal-cosmos-db-table-connection-string-2-240px.png" alt-text="A screenshot showing the which connection string to select and use in your application." lightbox="./media/quickstart-java/azure-portal-cosmos-db-table-connection-string-2.png":::           |

### [Azure CLI](#tab/azure-cli)

To get the primary table storage connection string using Azure CLI, use the [az Azure Cosmos DB keys list](/cli/azure/cosmosdb/keys#az_cosmosdb_keys_list) command with the option `--type connection-strings`.  This command uses a [JMESPath query](/cli/azure/query-azure-cli) to display only the primary table connection string.

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

The connection string for your Azure Cosmos DB account is considered an app secret and must be protected like any other app secret or password.  This example uses the POM to store the connection string during development and make it available to the application.

```xml
<profiles>
    <profile>
        <id>local</id>
        <properties>
            <azure.tables.connection.string>
                <![CDATA[YOUR-DATA-TABLES-SERVICE-CONNECTION-STRING]]>
            </azure.tables.connection.string>
            <azure.tables.tableName>WeatherData</azure.tables.tableName>
        </properties>
        <activation>
            <activeByDefault>true</activeByDefault>
        </activation>
    </profile>
</profiles>
```

## 4 - Include the azure-data-tables package

To access the Azure Cosmos DB Tables API from a Java application, include the [azure-data-tables](https://search.maven.org/artifact/com.azure/azure-data-tables) package.

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-data-tables</artifactId>
    <version>12.2.1</version>
</dependency>
```

---

## 5 - Configure the Table client in TableServiceConfig.java

The Azure SDK communicates with Azure using client objects to execute different operations against Azure. The [TableClient](/java/api/com.azure.data.tables.tableclient) object is the object used to communicate with the Azure Cosmos DB Tables API.

An application will typically create a single [TableClient](/java/api/com.azure.data.tables.tableclient) object per table to be used throughout the application.  It's recommended to indicate that a method produces a [TableClient](/java/api/com.azure.data.tables.tableclient) object bean to be managed by the Spring container and  as a singleton to accomplish this.

In the `TableServiceConfig.java` file of the application, edit the `tableClientConfiguration()` method to match the following code snippet:

```java
@Configuration
public class TableServiceConfiguration {

    private static String TABLE_NAME;

    private static String CONNECTION_STRING;

    @Value("${azure.tables.connection.string}")
    public void setConnectionStringStatic(String connectionString) {
        TableServiceConfiguration.CONNECTION_STRING = connectionString;
    }

    @Value("${azure.tables.tableName}")
    public void setTableNameStatic(String tableName) {
        TableServiceConfiguration.TABLE_NAME = tableName;
    }

    @Bean
    public TableClient tableClientConfiguration() {
        return new TableClientBuilder()
                .connectionString(CONNECTION_STRING)
                .tableName(TABLE_NAME)
                .buildClient();
    }
    
}
```

You'll also need to add the following using statement at the top of the `TableServiceConfig.java` file.

```java
import com.azure.data.tables.TableClient;
import com.azure.data.tables.TableClientBuilder;
```

## 6 - Implement Azure Cosmos DB table operations

All Azure Cosmos DB table operations for the sample app are implemented in the `TablesServiceImpl` class located in the *Services* directory.  You'll need to import the `com.azure.data.tables` SDK package.

```java
import com.azure.data.tables.TableClient;
import com.azure.data.tables.models.ListEntitiesOptions;
import com.azure.data.tables.models.TableEntity;
import com.azure.data.tables.models.TableTransactionAction;
import com.azure.data.tables.models.TableTransactionActionType;
```

At the start of the `TableServiceImpl` class, add a member variable for the [TableClient](/java/api/com.azure.data.tables.tableclient) object and a constructor to allow the [TableClient](/java/api/com.azure.data.tables.tableclient) object to be injected into the class.

```java
@Autowired
private TableClient tableClient;
```

### Get rows from a table

The [TableClient](/java/api/com.azure.data.tables.tableclient) class contains a method named [listEntities](/java/api/com.azure.data.tables.tableclient.listentities) which allows you to select rows from the table.  In this example, since no parameters are being passed to the method, all rows will be selected from the table.

The method also takes a generic parameter of type [TableEntity](/java/api/com.azure.data.tables.models.tableentity) that specifies the model class data will be returned as. In this case, the built-in class [TableEntity](/java/api/com.azure.data.tables.models.tableentity) is used, meaning the `listEntities` method will return a `PagedIterable<TableEntity>` collection as its results.

```java
public List<WeatherDataModel> retrieveAllEntities() {
    List<WeatherDataModel> modelList = tableClient.listEntities().stream()
        .map(WeatherDataUtils::mapTableEntityToWeatherDataModel)
        .collect(Collectors.toList());
    return Collections.unmodifiableList(WeatherDataUtils.filledValue(modelList));
}
```

The [TableEntity](/java/api/com.azure.data.tables.models.tableentity) class defined in the `com.azure.data.tables.models` package has properties for the partition key and row key values in the table.  Together, these two values for a unique key for the row in the table.  In this example application, the name of the weather station (city) is stored in the partition key and the date/time of the observation is stored in the row key.  All other properties (temperature, humidity, wind speed) are stored in a dictionary in the `TableEntity` object.

It's common practice to map a [TableEntity](/java/api/com.azure.data.tables.models.tableentity) object to an object of your own definition.  The sample application defines a class `WeatherDataModel` in the *Models* directory for this purpose.  This class has properties for the station name and observation date that the partition key and row key will map to, providing more meaningful property names for these values.  It then uses a dictionary to store all the other properties on the object.  This is a common pattern when working with Table storage since a row can have any number of arbitrary properties and we want our model objects to be able to capture all of them.  This class also contains methods to list the properties on the class.

```java
public class WeatherDataModel {

    public WeatherDataModel(String stationName, String observationDate, OffsetDateTime timestamp, String etag) {
        this.stationName = stationName;
        this.observationDate = observationDate;
        this.timestamp = timestamp;
        this.etag = etag;
    }

    private String stationName;

    private String observationDate;

    private OffsetDateTime timestamp;

    private String etag;

    private Map<String, Object> propertyMap = new HashMap<String, Object>();

    public String getStationName() {
        return stationName;
    }

    public void setStationName(String stationName) {
        this.stationName = stationName;
    }

    public String getObservationDate() {
        return observationDate;
    }

    public void setObservationDate(String observationDate) {
        this.observationDate = observationDate;
    }

    public OffsetDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(OffsetDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getEtag() {
        return etag;
    }

    public void setEtag(String etag) {
        this.etag = etag;
    }

    public Map<String, Object> getPropertyMap() {
        return propertyMap;
    }

    public void setPropertyMap(Map<String, Object> propertyMap) {
        this.propertyMap = propertyMap;
    }
}
```

The `mapTableEntityToWeatherDataModel` method is used to map a [TableEntity](/java/api/com.azure.data.tables.models.tableentity) object to a `WeatherDataModel` object.  The `mapTableEntityToWeatherDataModel` method directly maps the `PartitionKey`, `RowKey`, `Timestamp`, and `Etag` properties and then uses the `properties.keySet` to iterate over the other properties in the `TableEntity` object and map those to the `WeatherDataModel` object, minus the properties that have already been directly mapped.

Edit the code in the `mapTableEntityToWeatherDataModel` method to match the following code block.

```java
public static WeatherDataModel mapTableEntityToWeatherDataModel(TableEntity entity) {
    WeatherDataModel observation = new WeatherDataModel(
        entity.getPartitionKey(), entity.getRowKey(),
        entity.getTimestamp(), entity.getETag());
    rearrangeEntityProperties(observation.getPropertyMap(), entity.getProperties());
    return observation;
}

private static void rearrangeEntityProperties(Map<String, Object> target, Map<String, Object> source) {
    Constants.DEFAULT_LIST_OF_KEYS.forEach(key -> {
        if (source.containsKey(key)) {
            target.put(key, source.get(key));
        }
    });
    source.keySet().forEach(key -> {
        if (Constants.DEFAULT_LIST_OF_KEYS.parallelStream().noneMatch(defaultKey -> defaultKey.equals(key))
        && Constants.EXCLUDE_TABLE_ENTITY_KEYS.parallelStream().noneMatch(defaultKey -> defaultKey.equals(key))) {
            target.put(key, source.get(key));
        }
    });
}
```

### Filter rows returned from a table
To filter the rows returned from a table, you can pass an OData style filter string to the [listEntities](/java/api/com.azure.data.tables.tableclient.listentities) method. For example, if you wanted to get all of the weather readings for Chicago between midnight July 1, 2021 and midnight July 2, 2021 (inclusive) you would pass in the following filter string.

```odata
PartitionKey eq 'Chicago' and RowKey ge '2021-07-01 12:00 AM' and RowKey le '2021-07-02 12:00 AM'
```

You can view all OData filter operators on the OData website in the section [Filter System Query Option](https://www.odata.org/documentation/odata-version-2-0/uri-conventions/)

In the example application, the `FilterResultsInputModel` object is designed to capture any filter criteria provided by the user.

```java
public class FilterResultsInputModel implements Serializable {

    private String partitionKey;

    private String rowKeyDateStart;

    private String rowKeyTimeStart;

    private String rowKeyDateEnd;

    private String rowKeyTimeEnd;

    private Double minTemperature;

    private Double maxTemperature;

    private Double minPrecipitation;

    private Double maxPrecipitation;

    public String getPartitionKey() {
        return partitionKey;
    }

    public void setPartitionKey(String partitionKey) {
        this.partitionKey = partitionKey;
    }

    public String getRowKeyDateStart() {
        return rowKeyDateStart;
    }

    public void setRowKeyDateStart(String rowKeyDateStart) {
        this.rowKeyDateStart = rowKeyDateStart;
    }

    public String getRowKeyTimeStart() {
        return rowKeyTimeStart;
    }

    public void setRowKeyTimeStart(String rowKeyTimeStart) {
        this.rowKeyTimeStart = rowKeyTimeStart;
    }

    public String getRowKeyDateEnd() {
        return rowKeyDateEnd;
    }

    public void setRowKeyDateEnd(String rowKeyDateEnd) {
        this.rowKeyDateEnd = rowKeyDateEnd;
    }

    public String getRowKeyTimeEnd() {
        return rowKeyTimeEnd;
    }

    public void setRowKeyTimeEnd(String rowKeyTimeEnd) {
        this.rowKeyTimeEnd = rowKeyTimeEnd;
    }

    public Double getMinTemperature() {
        return minTemperature;
    }

    public void setMinTemperature(Double minTemperature) {
        this.minTemperature = minTemperature;
    }

    public Double getMaxTemperature() {
        return maxTemperature;
    }

    public void setMaxTemperature(Double maxTemperature) {
        this.maxTemperature = maxTemperature;
    }

    public Double getMinPrecipitation() {
        return minPrecipitation;
    }

    public void setMinPrecipitation(Double minPrecipitation) {
        this.minPrecipitation = minPrecipitation;
    }

    public Double getMaxPrecipitation() {
        return maxPrecipitation;
    }

    public void setMaxPrecipitation(Double maxPrecipitation) {
        this.maxPrecipitation = maxPrecipitation;
    }
}
```

When this object is passed to the `retrieveEntitiesByFilter` method in the `TableServiceImpl` class, it creates a filter string for each non-null property value.  It then creates a combined filter string by joining all of the values together with an "and" clause.  This combined filter string is passed to the [listEntities](/java/api/com.azure.data.tables.tableclient.listentities) method on the [TableClient](/java/api/com.azure.data.tables.tableclient) object and only rows matching the filter string will be returned.  You can use a similar method in your code to construct suitable filter strings as required by your application.

```java
public List<WeatherDataModel> retrieveEntitiesByFilter(FilterResultsInputModel model) {

    List<String> filters = new ArrayList<>();

    if (!StringUtils.isEmptyOrWhitespace(model.getPartitionKey())) {
        filters.add(String.format("PartitionKey eq '%s'", model.getPartitionKey()));
    }
    if (!StringUtils.isEmptyOrWhitespace(model.getRowKeyDateStart())
            && !StringUtils.isEmptyOrWhitespace(model.getRowKeyTimeStart())) {
        filters.add(String.format("RowKey ge '%s %s'", model.getRowKeyDateStart(), model.getRowKeyTimeStart()));
    }
    if (!StringUtils.isEmptyOrWhitespace(model.getRowKeyDateEnd())
            && !StringUtils.isEmptyOrWhitespace(model.getRowKeyTimeEnd())) {
        filters.add(String.format("RowKey le '%s %s'", model.getRowKeyDateEnd(), model.getRowKeyTimeEnd()));
    }
    if (model.getMinTemperature() != null) {
        filters.add(String.format("Temperature ge %f", model.getMinTemperature()));
    }
    if (model.getMaxTemperature() != null) {
        filters.add(String.format("Temperature le %f", model.getMaxTemperature()));
    }
    if (model.getMinPrecipitation() != null) {
        filters.add(String.format("Precipitation ge %f", model.getMinPrecipitation()));
    }
    if (model.getMaxPrecipitation() != null) {
        filters.add(String.format("Precipitation le %f", model.getMaxPrecipitation()));
    }

    List<WeatherDataModel> modelList = tableClient.listEntities(new ListEntitiesOptions()
        .setFilter(String.join(" and ", filters)), null, null).stream()
        .map(WeatherDataUtils::mapTableEntityToWeatherDataModel)
        .collect(Collectors.toList());
    return Collections.unmodifiableList(WeatherDataUtils.filledValue(modelList));
}
```

### Insert data using a TableEntity object

The simplest way to add data to a table is by using a [TableEntity](/java/api/com.azure.data.tables.models.tableentity) object.  In this example, data is mapped from an input model object to a [TableEntity](/java/api/com.azure.data.tables.models.tableentity) object.  The properties on the input object representing the weather station name and observation date/time are mapped to the `PartitionKey` and `RowKey`) properties respectively which together form a unique key for the row in the table.  Then the additional properties on the input model object are mapped to dictionary properties on the [TableClient](/java/api/com.azure.data.tables.models.tableentity) object.  Finally, the [createEntity](/java/api/com.azure.data.tables.tableclient.createentity) method on the [TableClient](/java/api/com.azure.data.tables.models.tableentity) object is used to insert data into the table.

Modify the `insertEntity` class in the example application to contain the following code.

```java
public void insertEntity(WeatherInputModel model) {
    tableClient.createEntity(WeatherDataUtils.createTableEntity(model));
}
```

### Upsert data using a TableEntity object

If you try to insert a row into a table with a partition key/row key combination that already exists in that table, you'll receive an error.  For this reason, it's often preferable to use the [upsertEntity](/java/api/com.azure.data.tables.tableclient.upsertentity) instead of the `insertEntity` method when adding rows to a table.  If the given partition key/row key combination already exists in the table, the [upsertEntity](/java/api/com.azure.data.tables.tableclient.upsertentity) method will update the existing row.  Otherwise, the row will be added to the table.

```java
public void upsertEntity(WeatherInputModel model) {
    tableClient.upsertEntity(WeatherDataUtils.createTableEntity(model));
}
```

### Insert or upsert data with variable properties

One of the advantages of using the Azure Cosmos DB Tables API is that if an object being loaded to a table contains any new properties then those properties are automatically added to the table and the values stored in Azure Cosmos DB.  There's no need to run DDL statements like `ALTER TABLE` to add columns as in a traditional database.

This model gives your application flexibility when dealing with data sources that may add or modify what data needs to be captured over time or when different inputs provide different data to your application. In the sample application, we can simulate a weather station that sends not just the base weather data but also some additional values. When an object with these new properties is stored in the table for the first time, the corresponding properties (columns) will be automatically added to the table.

In the sample application, the `ExpandableWeatherObject` class is built around an internal dictionary to support any set of properties on the object.  This class represents a typical pattern for when an object needs to contain an arbitrary set of properties.

```java
public class ExpandableWeatherObject {

    private String stationName;

    private String observationDate;

    private Map<String, Object> propertyMap = new HashMap<String, Object>();

    public String getStationName() {
        return stationName;
    }

    public void setStationName(String stationName) {
        this.stationName = stationName;
    }

    public String getObservationDate() {
        return observationDate;
    }

    public void setObservationDate(String observationDate) {
        this.observationDate = observationDate;
    }

    public Map<String, Object> getPropertyMap() {
        return propertyMap;
    }

    public void setPropertyMap(Map<String, Object> propertyMap) {
        this.propertyMap = propertyMap;
    }

    public boolean containsProperty(String key) {
        return this.propertyMap.containsKey(key);
    }

    public Object getPropertyValue(String key) {
        return containsProperty(key) ? this.propertyMap.get(key) : null;
    }

    public void putProperty(String key, Object value) {
        this.propertyMap.put(key, value);
    }

    public List<String> getPropertyKeys() {
        List<String> list = Collections.synchronizedList(new ArrayList<String>());
        Iterator<String> iterators = this.propertyMap.keySet().iterator();
        while (iterators.hasNext()) {
            list.add(iterators.next());
        }
        return Collections.unmodifiableList(list);
    }

    public Integer getPropertyCount() {
        return this.propertyMap.size();
    }
}
```

To insert or upsert such an object using the API for Table, map the properties of the expandable object into a [TableEntity](/java/api/com.azure.data.tables.models.tableentity) object and use the [createEntity](/java/api/com.azure.data.tables.tableclient.createentity) or [upsertEntity](/java/api/com.azure.data.tables.tableclient.upsertentity) methods on the [TableClient](/java/api/com.azure.data.tables.tableclient) object as appropriate.

```java
public void insertExpandableEntity(ExpandableWeatherObject model) {
    tableClient.createEntity(WeatherDataUtils.createTableEntity(model));
}

public void upsertExpandableEntity(ExpandableWeatherObject model) {
    tableClient.upsertEntity(WeatherDataUtils.createTableEntity(model));
}
```

### Update an entity

Entities can be updated by calling the [updateEntity](/java/api/com.azure.data.tables.tableclient.updateentity) method on the [TableClient](/java/api/com.azure.data.tables.tableclient) object.  Because an entity (row) stored using the Tables API could contain any arbitrary set of properties, it's often useful to create an update object based around a dictionary object similar to the `ExpandableWeatherObject` discussed earlier. In this case, the only difference is the addition of an `etag` property which is used for concurrency control during updates.

```java
public class UpdateWeatherObject {

    private String stationName;

    private String observationDate;

    private String etag;

    private Map<String, Object> propertyMap = new HashMap<String, Object>();

    public String getStationName() {
        return stationName;
    }

    public void setStationName(String stationName) {
        this.stationName = stationName;
    }

    public String getObservationDate() {
        return observationDate;
    }

    public void setObservationDate(String observationDate) {
        this.observationDate = observationDate;
    }

    public String getEtag() {
        return etag;
    }

    public void setEtag(String etag) {
        this.etag = etag;
    }

    public Map<String, Object> getPropertyMap() {
        return propertyMap;
    }

    public void setPropertyMap(Map<String, Object> propertyMap) {
        this.propertyMap = propertyMap;
    }
}
```

In the sample app, this object is passed to the `updateEntity` method in the `TableServiceImpl` class.  This method first loads the existing entity from the Tables API using the [getEntity](/java/api/com.azure.data.tables.tableclient.getentity) method on the [TableClient](/java/api/com.azure.data.tables.tableclient).  It then updates that entity object and uses the `updateEntity` method save the updates to the database.  Note how the [updateEntity](/java/api/com.azure.data.tables.tableclient.updateentity) method takes the current Etag of the object to ensure the object hasn't changed since it was initially loaded. If you want to update the entity regardless, you may pass a value of `etag` to the `updateEntity` method.

```java
public void updateEntity(UpdateWeatherObject model) {
    TableEntity tableEntity = tableClient.getEntity(model.getStationName(), model.getObservationDate());
    Map<String, Object> propertiesMap = model.getPropertyMap();
    propertiesMap.keySet().forEach(key -> tableEntity.getProperties().put(key, propertiesMap.get(key)));
    tableClient.updateEntity(tableEntity);
}
```

### Remove an entity

To remove an entity from a table, call the [deleteEntity](/java/api/com.azure.data.tables.tableclient.deleteentity) method on the [TableClient](/java/api/com.azure.data.tables.tableclient) object with the partition key and row key of the object.

```java
public void deleteEntity(WeatherInputModel model) {
    tableClient.deleteEntity(model.getStationName(),
            WeatherDataUtils.formatRowKey(model.getObservationDate(), model.getObservationTime()));
}
```

## 7 - Run the code

Run the sample application to interact with the Azure Cosmos DB Tables API.  The first time you run the application, there will be no data because the table is empty. Use any of the buttons at the top of application to add data to the table.

:::image type="content" source="./media/quickstart-java/table-api-app-data-insert-buttons-480px.png" alt-text="A screenshot of the application showing the location of the buttons used to insert data into Azure Cosmos DB using the Table API." lightbox="./media/quickstart-java/table-api-app-data-insert-buttons.png":::

Selecting the **Insert using Table Entity** button opens a dialog allowing you to insert or upsert a new row using a `TableEntity` object.

:::image type="content" source="./media/quickstart-java/table-api-app-insert-table-entity-480px.png" alt-text="A screenshot of the application showing the dialog box used to insert data using a TableEntity object." lightbox="./media/quickstart-java/table-api-app-insert-table-entity.png":::

Selecting the **Insert using Expandable Data** button brings up a dialog that enables you to insert an object with custom properties, demonstrating how the Azure Cosmos DB Tables API automatically adds properties (columns) to the table when needed. Use the *Add Custom Field* button to add one or more new properties and demonstrate this capability.

:::image type="content" source="./media/quickstart-java/table-api-app-insert-expandable-entity-480px.png" alt-text="A screenshot of the application showing the dialog box used to insert data using an object with custom fields." lightbox="./media/quickstart-java/table-api-app-insert-expandable-entity.png":::

Use the **Insert Sample Data** button to load some sample data into your Azure Cosmos DB table.

:::image type="content" source="./media/quickstart-java/table-api-app-sample-data-insert-480px.png" alt-text="A screenshot of the application showing the location of the sample data insert button." lightbox="./media/quickstart-java/table-api-app-sample-data-insert.png":::

Select the **Filter Results** item in the top menu to be taken to the Filter Results page.  On this page, fill out the filter criteria to demonstrate how a filter clause can be built and passed to the Azure Cosmos DB Tables API.

:::image type="content" source="./media/quickstart-java/table-api-app-filter-data-480px.png" alt-text="A screenshot of the application showing filter results page and highlighting the menu item used to navigate to the page." lightbox="./media/quickstart-java/table-api-app-filter-data.png":::

## Clean up resources

When you're finished with the sample application, you should remove all Azure resources related to this article from your Azure account.  You can do this by deleting the resource group.

### [Azure portal](#tab/azure-portal)

A resource group can be deleted using the [Azure portal](https://portal.azure.com/) by doing the following.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Delete resource group step 1](./includes/quickstart-java/remove-resource-group-1.md)] | :::image type="content" source="./media/quickstart-java/azure-portal-remove-resource-group-1-240px.png" alt-text="A screenshot showing how to search for a resource group." lightbox="./media/quickstart-java/azure-portal-remove-resource-group-1.png"::: |
| [!INCLUDE [Delete resource group step 2](./includes/quickstart-java/remove-resource-group-2.md)] | :::image type="content" source="./media/quickstart-java/azure-portal-remove-resource-group-2-240px.png" alt-text="A screenshot showing the location of the Delete resource group button." lightbox="./media/quickstart-java/azure-portal-remove-resource-group-2.png"::: |
| [!INCLUDE [Delete resource group step 3](./includes/quickstart-java/remove-resource-group-3.md)] | :::image type="content" source="./media/quickstart-java/azure-portal-remove-resource-group-3-240px.png" alt-text="A screenshot showing the confirmation dialog for deleting a resource group." lightbox="./media/quickstart-java/azure-portal-remove-resource-group-3.png"::: |

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
