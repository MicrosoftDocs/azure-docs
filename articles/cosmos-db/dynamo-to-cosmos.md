---
title: Migrate your application from Amazon DynamoDB to Azure Cosmos DB
description: Learn how to migrate your .NET application from Amazon's DynamoDB to Azure Cosmos DB  
author: manishmsfte
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 04/29/2020
ms.author: mansha
---

# Migrate your application from Amazon DynamoDB to Azure Cosmos DB

Azure Cosmos DB is a scalable, globally distributed, fully managed database. It provides guaranteed low latency access to your data. To learn more about Azure Cosmos DB, see the [overview](introduction.md) article. This article describes how to migrate your .NET application from DynamoDB to Azure Cosmos DB with minimal code changes.

## Conceptual differences

The following are the key conceptual differences between Azure Cosmos DB and DynamoDB:

|  DynamoDB | Azure Cosmos DB  |
|---|---|
|Not applicable|  Database |
|Table      |  Collection |
|  Item |  Document |
|Attribute|Field|
|Secondary Index|Secondary Index|
|Primary Key – Partition key|Partition Key|
|Primary Key – Sort Key| Not Required |
|Stream|ChangeFeed|
|Write Compute Unit|Request Unit (Flexible, can be used for reads or writes)|
|Read Compute Unit    |Request Unit (Flexible, can be used for reads or writes)|
|Global Tables| Not Required. You can directly select the region while provisioning the Azure Cosmos account (you can change the region later)|

## Structural differences

Azure Cosmos DB has a simpler JSON structure when compared to that of DynamoDB. The following example shows the differences

**DynamoDB**:

The following JSON object represents the data format in DynamoDB

```json
{
TableName: "Music",
KeySchema: [
{ 
  AttributeName: "Artist",
  KeyType: "HASH", //Partition key
},
{ 
  AttributeName: "SongTitle",
  KeyType: "RANGE" //Sort key
}
],
AttributeDefinitions: [
{ 
  AttributeName: "Artist",
  AttributeType: "S"
},
{ 
  AttributeName: "SongTitle",
  AttributeType: "S"
}
],
ProvisionedThroughput: {
  ReadCapacityUnits: 1,
  WriteCapacityUnits: 1
 }
}
 ```

**Azure Cosmos DB**:

The following JSON object represents the data format in Azure Cosmos DB

```json
{
"Artist": "",
"SongTitle": "",
"AlbumTitle": "",
"Year": 9999,
"Price": 0.0,
"Genre": "",
"Tags": ""
}
```

## Migrate your data

There are various options available to migrate your data to Azure Cosmos DB. To learn more, see the [Options to migrate your on-premises or cloud data to Azure Cosmos DB](cosmosdb-migrationchoices.md) article.

## Migrate your code

This article is scoped to migrate an application's code to Azure Cosmos DB, which is the critical aspect of database migration. To help you reduce learning curve, the following sections include a side-by-side code comparison between Amazon DynamoDB and Azure Cosmos DB's equivalent code snippet.

To download the source code, clone the following repo:

```bash
git clone https://github.com/Azure-Samples/DynamoDB-to-CosmosDB
```

### Pre-requisites

- .NET Framework 4.7.2
- Visual Studio 2019
- Access to Azure Cosmos DB SQL API Account
- Local installation of Amazon DynamoDB
- Java 8
- Run the downloadable version of Amazon DynamoDB at port 8000 (you can change and configure the code)

### Set up your code

Add the following "NuGet package" to your project:

```bash
Install-Package Microsoft.Azure.Cosmos 
```

### Establish connection

**DynamoDB**:

In Amazon DynamoDB, the following code is used to connect:

```csharp
    AmazonDynamoDBConfig addbConfig = new AmazonDynamoDBConfig() ;
        addbConfig.ServiceURL = "endpoint";
        try { aws_dynamodbclient = new AmazonDynamoDBClient( addbConfig ); }
```

**Azure Cosmos DB**:

To connect Azure Cosmos DB, update your code to:

```csharp
client_documentDB = new CosmosClient("your connectionstring from the Azure portal");
```

**Optimize the connection in Azure Cosmos DB**

With Azure Cosmos DB, you can use the following options to optimize your connection:

* **ConnectionMode** - Use direct connection mode to connect to the data nodes in the Azure Cosmos DB service. Use gateway mode only to initialize and cache the logical addresses and refresh on updates. See the [connectivity modes](performance-tips.md#networking) article for more details.

* **ApplicationRegion** - This option is used to set the preferred geo-replicated region that is used to interact with Azure Cosmos DB. To learn more see the [global distribution](distribute-data-globally.md) article.

* **ConsistencyLevel** - This option is used to override default consistency level. To learn more, see the [Consistency levels](consistency-levels.md) article.

* **BulkExecutionMode** - This option is used to execute bulk operations by setting the *AllowBulkExecution* property to true. To learn more see the [Bulk import](tutorial-sql-api-dotnet-bulk-import.md) article.

   ```csharp
   client_cosmosDB = new CosmosClient(" Your connection string ",new CosmosClientOptions()
   { 
    ConnectionMode=ConnectionMode.Direct,
    ApplicationRegion=Regions.EastUS2,
    ConsistencyLevel=ConsistencyLevel.Session,
    AllowBulkExecution=true  
   });
   ```

### Provision the container

**DynamoDB**:

To store the data into Amazon DynamoDB you need to create the table first. In this process you define the schema, key type, and attributes as shown in the following code:

```csharp
// movies_key_schema
public static List<KeySchemaElement> movies_key_schema
  = new List<KeySchemaElement>
{
  new KeySchemaElement
  {
    AttributeName = partition_key_name,
    KeyType = "HASH"
  },
  new KeySchemaElement
  {
    AttributeName = sort_key_name,
    KeyType = "RANGE"
  }
};

// key names for the Movies table
public const string partition_key_name = "year";
public const string sort_key_name      = "title";
  public const int readUnits=1, writeUnits=1; 

    // movie_items_attributes
    public static List<AttributeDefinition> movie_items_attributes
  = new List<AttributeDefinition>
{
  new AttributeDefinition
  {
    AttributeName = partition_key_name,
    AttributeType = "N"
  },
  new AttributeDefinition
  {
    AttributeName = sort_key_name,
    AttributeType = "S"
  }

CreateTableRequest  request;
CreateTableResponse response;

// Build the 'CreateTableRequest' structure for the new table
request = new CreateTableRequest
{
  TableName             = table_name,
  AttributeDefinitions  = table_attributes,
  KeySchema             = table_key_schema,
  // Provisioned-throughput settings are always required,
  // although the local test version of DynamoDB ignores them.
  ProvisionedThroughput = new ProvisionedThroughput( readUnits, writeUnits );
};
```

**Azure Cosmos DB**:

In Amazon DynamoDB, you need to provision the read compute units & write compute units. Whereas in Azure Cosmos DB you specify the throughput as [Request Units (RU/s)](request-units.md), which can be used for any operations dynamically. The data is organized as database --> container--> item. You can specify the throughput at database level or at collection level or both.

To create a database:

```csharp
await client_cosmosDB.CreateDatabaseIfNotExistsAsync(movies_table_name);
```

To create the container:

```csharp
await cosmosDatabase.CreateContainerIfNotExistsAsync(new ContainerProperties() { PartitionKeyPath = "/" + partitionKey, Id = new_collection_name }, provisionedThroughput);
```

### Load the data

**DynamoDB**:

The following code shows how to load the data in Amazon DynamoDB. The moviesArray consists of list of JSON document then you need to iterate through and load the JSON document into Amazon DynamoDB:

```csharp
int n = moviesArray.Count;
for( int i = 0, j = 99; i < n; i++ )
    {
  try
  {
    string itemJson = moviesArray[i].ToString();
    Document doc = Document.FromJson(itemJson);
    Task putItem = moviesTable.PutItemAsync(doc);
    if( i >= j )
    {
      j++;
      Console.Write( "{0,5:#,##0}, ", j );
      if( j % 1000 == 0 )
        Console.Write( "\n " );
      j += 99;
    }
    await putItem;
```

**Azure Cosmos DB**:

In Azure Cosmos DB, you can opt for stream and write with `moviesContainer.CreateItemStreamAsync()`. However, in this sample, the JSON will be deserialized into the *MovieModel* type to demonstrate type-casting feature. The code is multi-threaded, which will use Azure Cosmos DB's distributed architecture and speed-up the loading:

```csharp
List<Task> concurrentTasks = new List<Task>();
for (int i = 0, j = 99; i < n; i++)
{
  try
  {
      MovieModel doc= JsonConvert.DeserializeObject<MovieModel>(moviesArray[i].ToString());
      doc.Id = Guid.NewGuid().ToString();
      concurrentTasks.Add(moviesContainer.CreateItemAsync(doc,new PartitionKey(doc.Year)));
      {
          j++;
          Console.Write("{0,5:#,##0}, ", j);
          if (j % 1000 == 0)
              Console.Write("\n               ");
          j += 99;
      }
      
  }
  catch (Exception ex)
  {
      Console.WriteLine("\n     ERROR: Could not write the movie record #{0:#,##0}, because:\n       {1}",
                          i, ex.Message);
      operationFailed = true;
      break;
  }
}
await Task.WhenAll(concurrentTasks);
```

### Create a document

**DynamoDB**:

Writing a new document in Amazon DynamoDB isn't type safe, the following example uses newItem as document type:

```csharp
Task<Document> writeNew = moviesTable.PutItemAsync(newItem, token);
await writeNew;
```

**Azure Cosmos DB**:

Azure Cosmos DB provides you type safety via data model. We use data model named 'MovieModel':

```csharp
public class MovieModel
{
    [JsonProperty("id")]
    public string Id { get; set; }
    [JsonProperty("title")]
    public string Title{ get; set; }
    [JsonProperty("year")]
    public int Year { get; set; }
    public MovieModel(string title, int year)
    {
        this.Title = title;
        this.Year = year;
    }
    public MovieModel()
    {

    }
    [JsonProperty("info")]
    public   MovieInfo MovieInfo { get; set; }

    internal string PrintInfo()
    {
        if(this.MovieInfo!=null)
        return            string.Format("\nMovie with title:{1}\n Year: {2}, Actors: {3}\n Directors:{4}\n Rating:{5}\n", this.Id, this.Title, this.Year, String.Join(",",this.MovieInfo.Actors), this.MovieInfo, this.MovieInfo.Rating);
        else
            return string.Format("\nMovie with  title:{0}\n Year: {1}\n",  this.Title, this.Year);
    }
}
```

In Azure Cosmos DB newItem will be MovieModel:

```csharp
 MovieModel movieModel = new MovieModel()
            {
                Id = Guid.NewGuid().ToString(),
                Title = "The Big New Movie",
                Year = 2018,
                MovieInfo = new MovieInfo() { Plot = "Nothing happens at all.", Rating = 0 }
            };
    var writeNew= moviesContainer.CreateItemAsync(movieModel, new Microsoft.Azure.Cosmos.PartitionKey(movieModel.Year));
    await writeNew;
```

### Read a document

**DynamoDB**:

To read in Amazon DynamoDB, you need to define primitives:

```csharp
// Create Primitives for the HASH and RANGE portions of the primary key
Primitive hash = new Primitive(year.ToString(), true);
Primitive range = new Primitive(title, false);

  Task<Document> readMovie = moviesTable.GetItemAsync(hash, range, token);
  movie_record = await readMovie;
```

**Azure Cosmos DB**:

However, with Azure Cosmos DB the query is natural (linq):

```csharp
IQueryable<MovieModel> movieQuery = moviesContainer.GetItemLinqQueryable<MovieModel>(true)
                        .Where(f => f.Year == year && f.Title == title);
// The query is executed synchronously here, but can also be executed asynchronously via the IDocumentQuery<T> interface
    foreach (MovieModel movie in movieQuery)
    {
      movie_record_cosmosdb = movie;
    }
```

The documents collection in the above example will be:

- type safe
- provide a natural query option.

### Update an item

**DynamoDB**:
To update the item in Amazon DynamoDB:

```csharp
updateResponse = await client.UpdateItemAsync( updateRequest );
````

**Azure Cosmos DB**:

In Azure Cosmos DB, update will be treated as Upsert operation meaning insert the document if it doesn't exist:

```csharp
await moviesContainer.UpsertItemAsync<MovieModel>(updatedMovieModel);
```

### Delete a document

**DynamoDB**:

To delete an item in Amazon DynamoDB, you again need to fall on primitives:

```csharp
Primitive hash = new Primitive(year.ToString(), true);
      Primitive range = new Primitive(title, false);
      DeleteItemOperationConfig deleteConfig = new DeleteItemOperationConfig( );
      deleteConfig.ConditionalExpression = condition;
      deleteConfig.ReturnValues = ReturnValues.AllOldAttributes;
      
  Task<Document> delItem = table.DeleteItemAsync( hash, range, deleteConfig );
        deletedItem = await delItem;
```

**Azure Cosmos DB**:

In Azure Cosmos DB, we can get the document and delete them asynchronously:

```csharp
var result= ReadingMovieItem_async_List_CosmosDB("select * from c where c.info.rating>7 AND c.year=2018 AND c.title='The Big New Movie'");
while (result.HasMoreResults)
{
  var resultModel = await result.ReadNextAsync();
  foreach (var movie in resultModel.ToList<MovieModel>())
  {
    await moviesContainer.DeleteItemAsync<MovieModel>(movie.Id, new PartitionKey(movie.Year));
  }
  }
```

### Query documents

**DynamoDB**:

In Amazon DynamoDB, api functions are required to query the data:

```csharp
QueryOperationConfig config = new QueryOperationConfig( );
  config.Filter = new QueryFilter( );
  config.Filter.AddCondition( "year", QueryOperator.Equal, new DynamoDBEntry[ ] { 1992 } );
  config.Filter.AddCondition( "title", QueryOperator.Between, new DynamoDBEntry[ ] { "B", "Hzz" } );
  config.AttributesToGet = new List<string> { "year", "title", "info" };
  config.Select = SelectValues.SpecificAttributes;
  search = moviesTable.Query( config ); 
```

**Azure Cosmos DB**:

In Azure Cosmos DB, you can do projection and filter inside a simple sql query:

```csharp
var result = moviesContainer.GetItemQueryIterator<MovieModel>( 
  "select c.Year, c.Title, c.info from c where Year=1998 AND (CONTAINS(Title,'B') OR CONTAINS(Title,'Hzz'))");
```

For range operations, for example, 'between', you need to do a scan in Amazon DynamoDB:

```csharp
ScanRequest sRequest = new ScanRequest
{
  TableName = "Movies",
  ExpressionAttributeNames = new Dictionary<string, string>
  {
    { "#yr", "year" }
  },
  ExpressionAttributeValues = new Dictionary<string, AttributeValue>
  {
      { ":y_a", new AttributeValue { N = "1960" } },
      { ":y_z", new AttributeValue { N = "1969" } },
  },
  FilterExpression = "#yr between :y_a and :y_z",
  ProjectionExpression = "#yr, title, info.actors[0], info.directors, info.running_time_secs"
};

ClientScanning_async( sRequest ).Wait( );
```

In Azure Cosmos DB, you can use SQL query and a single-line statement:

```csharp
var result = moviesContainer.GetItemQueryIterator<MovieModel>( 
  "select c.title, c.info.actors[0], c.info.directors,c.info.running_time_secs from c where BETWEEN year 1960 AND 1969");
```

### Delete a container

**DynamoDB**:

To delete the table in Amazon DynamoDB, you can specify:

```csharp
client.DeleteTableAsync( tableName );
```

**Azure Cosmos DB**:

To delete the collection in Azure Cosmos DB, you can specify:

```csharp
await moviesContainer.DeleteContainerAsync();
```
Then delete the database too if you need:

```csharp
await cosmosDatabase.DeleteAsync();
```

As you can see, Azure Cosmos DB supports natural queries (SQL), operations are asynchronous and much easier. You can easily migrate your complex code to Azure Cosmos DB, which becomes simpler after the migration.

### Next Steps

- Learn about [performance optimization](performance-tips.md).
- Learn about [optimize reads and writes](key-value-store-cost.md)
- Learn about [Monitoring in Cosmos DB](monitor-cosmos-db.md)

