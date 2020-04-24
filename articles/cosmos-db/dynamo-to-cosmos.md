---
title: Migrate your application from Amazon DynamoDB to Azure Cosmos DB
description: A guide to help application developers to migrate their application from AWS Dynamo DB to Azure Cosmos DB  
author: manishmsfte
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 03/30/2020
ms.author: mansha
---

# Migrate your application from Amazon DynamoDB to Azure Cosmos DB
Azure Cosmos DB has now become an obvious choice because of:
- 99.999's of Availability 
- Five levels of Consistency 
- Throughput 
- Latency (reads/writes guarantee)
- Multi-geo distribution with read/write capabilities in all nodes (span across the world with 52+ Azure Regions), [refer here.](/distribute-data-globally)
- Wide SLA, which covers Availability, Consistency, Throughput & Latency, [refer here.](https://azure.microsoft.com/support/legal/sla/cosmos-db/v1_3/)
- Cost Flexibility:
    - Uniform pricing strategy across APIs, so no need to separately purchase individual service for specialized data model (Document, Graph, Columnar, so on)
    - No separate meter for read compute cost or write compute cost.
    - Reservation can work across API, across type of accounts and read/write workloads.

<br>In case, you already started with Amazon DynamoDB and would like to move to Azure Cosmos DB. Then continue reading through and you can easily migrate your application with minimal changes.
## Conceptual differences
|  Amazon DynamoDB | Azure Cosmos DB  |
|---|---|
|-|  Database |
|Table      |  Collection |
|  Item |  Document |
|Attribute|Field|
|Secondary Index|Secondary Index|
|Primary Key – Partition key|Partition Key|
|Primary Key – Sort Key|< Not Required >|
|Stream|ChangeFeed|
|DAC|< Not Required >|
|Write Compute Unit|Request Unit (Flexible, can be used for reads or writes)|
|Read Compute Unit    |Request Unit (Flexible, can be used for reads or writes)|
|Global Tables|< Not Required >  Directly select the region while provisioning Cosmos DB account (changes are allowed later)|

**Table-1:** Conceptual differences between Amazon DynamoDB & Azure Cosmos DB

## Structural differences
Azure Cosmos DB has simpler JSON structure, following example will show the differences:
| DynamoDB                                                                                 | CosmosDB                                                                                                                                                     |
|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| {<br>    TableName: "Music",<br>    KeySchema: [       <br>        &nbsp;{ <br>            &nbsp;&nbsp;AttributeName: "Artist", <br>            &nbsp;&nbsp;KeyType: "HASH", //Partition key<br>        &nbsp;},<br>   &nbsp;{ <br>            &nbsp;&nbsp;AttributeName: "SongTitle", <br>            &nbsp;&nbsp;KeyType: "RANGE" //Sort key<br>        &nbsp;}<br>    ],<br>    AttributeDefinitions: [<br>        &nbsp;{ <br>            &nbsp;&nbsp;AttributeName: "Artist", <br>            &nbsp;&nbsp;AttributeType: "S" <br>        &nbsp;&nbsp;},<br>        &nbsp;{ <br>            &nbsp;&nbsp;AttributeName: "SongTitle", <br>            &nbsp;&nbsp;AttributeType: "S" <br>        &nbsp;}<br>    ],<br>    ProvisionedThroughput: {       <br>        &nbsp;&nbsp;ReadCapacityUnits: 1, <br>        &nbsp;&nbsp;WriteCapacityUnits: 1<br>    &nbsp;}} | {<br>    "Artist": "",<br>    "SongTitle": "",<br>    "AlbumTitle": "",<br>    "Year": 9999,<br>    "Price": 0.0,<br>    "Genre": "",<br>    "Tags": ""<br>} <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br>|
**Table-2:** Comparison of Structure

## Migrate the data
To migrate the data, Azure Cosmos DB has various options, refer [here](/import-data) for more details.
## Migrate the Code
The guide is scoped to an Application's code migration, which we find most critical aspect. It has included side-by-side code comparison between Amazon DynamoDB code snippet and Azure Cosmos DB's equivalent code snippet, to help you reduce learning curve.

To download the source code of this guide follow:
```
git clone https://github.com/Azure-Samples/DynamoDB-to-CosmosDB
```
### Pre-requisites

- .NET Framework 4.7.2
- Visual Studio 2019
- Access to Azure Cosmos DB SQL API Account
- Local installation of Amazon DynamoDB
- Java 8

### Setup

- Run the downloadable version of Amazon DynamoDB at port 8000 (feel free to change and configure inside the code)
### Setting up your code
First add "nuget package" to your project as:
```
Install-Package Microsoft.Azure.Cosmos 
```
### Establish connection<br>
To connect Amazon DynamoDB, the following code will be used:
```
    AmazonDynamoDBConfig addbConfig = new AmazonDynamoDBConfig() ;
        addbConfig.ServiceURL = "endpoint";
        try { aws_dynamodbclient = new AmazonDynamoDBClient( addbConfig ); }
```
To connect Azure Cosmos DB, the following code will be used:
```
client_documentDB = new CosmosClient("your connectionstring from the Azure portal");
```
*****Azure Cosmos DB (Optimized)*****
<br>With Azure Cosmos DB, you can use the following options to optimize your connection as:
- ConnectionMode - Direct, it uses direct connectivity to connect to the data nodes in the Azure Cosmos DB service. Use gateway only to initialize and cache logical addresses and refresh on updates, refer [here](https://docs.microsoft.com/dotnet/api/microsoft.azure.documents.client.connectionmode?view=azure-dotnet) for more details.
- ApplicationRegion - preferred geo-replicated region to be used for Azure Cosmos DB service interaction. For global-distribution in Azure Cosmos DB, refer [here](/distribute-data-globally)
- ConsistencyLevel - you can override default consistency. For consistency, refer [here](/consistency-levels) for more details.
- BulkExecutionMode - To execute bulk operations, by enabling this option, refer [here](https://devblogs.microsoft.com/cosmosdb/introducing-bulk-support-in-the-net-sdk/) for more details.
````
client_cosmosDB = new CosmosClient(" Your connection string ",new CosmosClientOptions() { 
  ConnectionMode=ConnectionMode.Direct,
  ApplicationRegion=Regions.EastUS2,
  ConsistencyLevel=ConsistencyLevel.Session,
  AllowBulkExecution=true  });
````

### Provisioning of Data Container
Now to store the data into Amazon DynamoDB you need to create table first. In this process you need to define schema, key type, & attribute
````
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
````
In Amazon DynamoDB, you need to provision read compute units & write compute units. But in Azure Cosmos DB throughput needs to be specified as Request Units (RU) which can be used for any operations dynamically, refer [here](/request-units). The data is organized as Database --> Collection --> Document. You can specify the throughput at database level or at collection level or both.
To create a database:
````
    await client_cosmosDB.CreateDatabaseIfNotExistsAsync(movies_table_name);
````
then create the collection:
````
    await cosmosDatabase.CreateContainerIfNotExistsAsync(new ContainerProperties() { PartitionKeyPath = "/" + partitionKey, Id = new_collection_name }, provisionedThroughput);
````
### Loading Data
Loading of the data in Amazon DynamoDB:
````
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
              Console.Write( "\n               " );
            j += 99;
          }
          await putItem;
````
The moviesArray consists of list of JSON document then you need to iterate through and load the JSON document onto Amazon DynamoDB.
<br>In Azure Cosmos DB, you can opt for stream and write with moviesContainer.CreateItemStreamAsync(). However, in the sample, the JSON will be deserialized into the 'MovieModel' type to demonstrate type-casting feature. 
The code is multi-threaded, which will use Azure Cosmos DB's distributed architecture and speed-up the loading:
````
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
````
### Creating Document
Writing a new document in Amazon DynamoDB isn't type safe, the example below uses newItem as Document type:
````
Task<Document> writeNew = moviesTable.PutItemAsync(newItem, token);
await writeNew;
````
Azure Cosmos DB provides you type safety via data model. We use data model named 'MovieModel':
````
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
````
Now in Azure Cosmos DB newItem will be MovieModel: 
````
 MovieModel movieModel = new MovieModel()
            {
                Id = Guid.NewGuid().ToString(),
                Title = "The Big New Movie",
                Year = 2018,
                MovieInfo = new MovieInfo() { Plot = "Nothing happens at all.", Rating = 0 }
            };
    var writeNew= moviesContainer.CreateItemAsync(movieModel, new Microsoft.Azure.Cosmos.PartitionKey(movieModel.Year));
    await writeNew;
````
### Reading Document
To read in Amazon DynamoDB, you need to define primitives:
````
      // Create Primitives for the HASH and RANGE portions of the primary key
      Primitive hash = new Primitive(year.ToString(), true);
      Primitive range = new Primitive(title, false);

        Task<Document> readMovie = moviesTable.GetItemAsync(hash, range, token);
        movie_record = await readMovie;
````
However, with Azure Cosmos DB the query is natural (linq):
````
IQueryable<MovieModel> movieQuery = moviesContainer.GetItemLinqQueryable<MovieModel>(true)
                        .Where(f => f.Year == year && f.Title == title);
// The query is executed synchronously here, but can also be executed asynchronously via the IDocumentQuery<T> interface
    foreach (MovieModel movie in movieQuery)
    {
      movie_record_cosmosdb = movie;
    }
````
The documents collection in the above example will be:
- type safe
- provide a natural query option. 
### Update Item 
To update the item in Amazon DynamoDB:
````
        updateResponse = await client.UpdateItemAsync( updateRequest );
````
In Azure Cosmos DB, update will be treated as Upsert operation meaning insert the document if it doesn't exist:
````
await moviesContainer.UpsertItemAsync<MovieModel>(updatedMovieModel);
````
### Deleting Document
To delete an item in Amazon DynamoDB, you again need to fall on primitives:
````
Primitive hash = new Primitive(year.ToString(), true);
      Primitive range = new Primitive(title, false);
      DeleteItemOperationConfig deleteConfig = new DeleteItemOperationConfig( );
      deleteConfig.ConditionalExpression = condition;
      deleteConfig.ReturnValues = ReturnValues.AllOldAttributes;
      
  Task<Document> delItem = table.DeleteItemAsync( hash, range, deleteConfig );
        deletedItem = await delItem;
```` 
In Azure Cosmos DB, we can get the document and delete them asynchronously:
```
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

### Query Documents
In Amazon DynamoDB, api functions are required to query the data:
````
    QueryOperationConfig config = new QueryOperationConfig( );
      config.Filter = new QueryFilter( );
      config.Filter.AddCondition( "year", QueryOperator.Equal, new DynamoDBEntry[ ] { 1992 } );
      config.Filter.AddCondition( "title", QueryOperator.Between, new DynamoDBEntry[ ] { "B", "Hzz" } );
      config.AttributesToGet = new List<string> { "year", "title", "info" };
      config.Select = SelectValues.SpecificAttributes;
      search = moviesTable.Query( config ); 
````
In Azure Cosmos DB, you can do projection and filter inside a simple sql query:
```` 
var result = moviesContainer.GetItemQueryIterator<MovieModel>( 
  "select c.Year, c.Title, c.info from c where Year=1998 AND (CONTAINS(Title,'B') OR CONTAINS(Title,'Hzz'))");
````
For range operations, for example, 'between', you need to do a scan in Amazon DynamoDB:
````
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
````
In Azure Cosmos DB, you can use SQL query and a single-line statement:
````
var result = moviesContainer.GetItemQueryIterator<MovieModel>( 
  "select c.title, c.info.actors[0], c.info.directors,c.info.running_time_secs from c where BETWEEN year 1960 AND 1969");
````
### Deleting Container
To delete the table in Amazon DynamoDB, you can specify:
````
client.DeleteTableAsync( tableName );
````
To delete the collection in Azure Cosmos DB, you can specify:
````
    await moviesContainer.DeleteContainerAsync();
````
Then delete the database too if you need:
````
    await cosmosDatabase.DeleteAsync();
````    
### Conclusion
As you can see, Azure Cosmos DB supports natural queries (SQL), operations are asynchronous and much easier. You can easily migrate your complex code to Azure Cosmos DB, which becomes simpler after the migration. 

*****Happy Coding!*****

### Next Steps
- Learn about [performance optimization](/performance-tips).
- Learn about [optimize reads and writes](/key-value-store-cost)


##### Declaration
- ©Amazon DynamoDB & ©AWS belongs to Amazon
