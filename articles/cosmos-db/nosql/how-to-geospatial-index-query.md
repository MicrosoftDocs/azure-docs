---
title: Index and query GeoJSON location data
titleSuffix: Azure Cosmos DB for NoSQL
description: Add geospatial location data to Azure Cosmos DB for NoSQL and then query the data efficiently in your application.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: how-to
ms.date: 08/01/2023
ms.custom: query-reference
---

# Index and query GeoJSON location data in Azure Cosmos DB for NoSQL

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

Geospatial data in Azure Cosmos DB for NoSQL allows you to store location information and perform common queries, including but not limited to:

- Finding if a location is within a defined area
- Measuring the distance between two locations
- Determining if a path intersects with a location or area

This guide walks through the process of creating geospatial data, indexing the data, and then querying the data in a container.

## Prerequisites

- An existing Azure Cosmos DB for NoSQL account.
  - If you don't have an Azure subscription, [Try Azure Cosmos DB for NoSQL free](https://cosmos.azure.com/try/).
  - If you have an existing Azure subscription, [create a new Azure Cosmos DB for NoSQL account](how-to-create-account.md).
- Latest version of [.NET](/dotnet/).
- Latest version of [Azure CLI](/cli/azure/).
  - If you're using a local installation, sign in to the Azure CLI by using the [``az login``](/cli/azure/reference-index#az-login) command.

## Create container and indexing policy

All containers include a default indexing policy that will successfully index geospatial data. To create a customized indexing policy, create an account and specify a JSON file with the policy's configuration. In this section, a custom spatial index is used for a newly created container.

1. Open a terminal.

1. Create a shell variable for the name of your Azure Cosmos DB for NoSQL account and resource group.

    ```azurecli-interactive
    # Variable for resource group name
    resourceGroupName="<name-of-your-resource-group>"

    # Variable for account name
    accountName="<name-of-your-account>"
    ```

1. Create a new database named ``cosmicworks`` using [``az cosmosdb sql database create``](/cli/azure/cosmosdb/sql/database#az-cosmosdb-sql-database-create).

    ```azurecli-interactive
    az cosmosdb sql database create \
        --resource-group $resourceGroupName \
        --account-name $accountName \
        --name "cosmicworks" \
        --throughput 400
    ```

1. Create a new JSON file named **index-policy.json** and add the following JSON object to the file.

    ```json
    {
      "indexingMode": "consistent",
      "automatic": true,
      "includedPaths": [
        {
          "path": "/*"
        }
      ],
      "excludedPaths": [
        {
          "path": "/\"_etag\"/?"
        }
      ],
      "spatialIndexes": [
        {
          "path": "/location/*",
          "types": [
            "Point",
            "Polygon"
          ]
        }
      ]
    }
    ```

1. Use [``az cosmosdb sql container create``](/cli/azure/cosmosdb/sql/container#az-cosmosdb-sql-container-create) to create a new container named ``locations`` with a partition key path of ``/region``.

    ```azurecli-interactive
    az cosmosdb sql container create \
        --resource-group $resourceGroupName \
        --account-name $accountName \
        --database-name "cosmicworks" \
        --name "locations" \
        --partition-key-path "/category" \
        --idx @index-policy.json
    ```

1. Retrieve the primary connection string for the account using [``az cosmosdb keys list``](/cli/azure/cosmosdb/keys#az-cosmosdb-keys-list).

    ```azurecli-interactive
    az cosmosdb keys list \
        --resource-group $resourceGroupName \
        --name $accountName \
        --type "connection-strings" \
        --query "connectionStrings[?keyKind == \`Primary\`].connectionString" \
        --output tsv
    ```

    > [!TIP]
    > To see all the possible connection strings for an account, use ``az cosmosdb keys list --resource-group $resourceGroupName --name $accountName --type "connection-strings"``.

1. Record the connection string. You use this credential later in this guide.

## Create .NET SDK console application

The .NET SDK for Azure Cosmos DB for NoSQL provides classes for common GeoJSON objects. Use this SDK to streamline the process of adding geographic objects to your container.

1. Open a terminal in an empty directory.

1. Create a new .NET application by using the [``dotnet new``](/dotnet/core/tools/dotnet-new) command with the **console** template.

    ```dotnetcli
    dotnet new console
    ```

1. Import the [Microsoft.Azure.Cosmos](https://www.nuget.org/packages/Microsoft.Azure.Cosmos) NuGet package using the [``dotnet add package``](/dotnet/core/tools/dotnet-add-package) command.

    ```dotnetcli
    dotnet add package Microsoft.Azure.Cosmos --version 3.*
    ```

    > [!WARNING]
    > Entity Framework does not currently spatial data in Azure Cosmos DB for NoSQL. Use one of the Azure Cosmos DB for NoSQL SDKs for strongly-typed GeoJSON support.

1. Build the project with the [``dotnet build``](/dotnet/core/tools/dotnet-build) command.

    ```dotnetcli
    dotnet build
    ```

1. Open the integrated developer environment (IDE) of your choice in the same directory as your .NET console application.

1. Open the newly created **Program.cs** file and delete any existing code. Add [using directives](/dotnet/csharp/language-reference/keywords/using-directive) for the ``Microsoft.Azure.Cosmos``, ``Microsoft.Azure.Cosmos.Linq``, and``Microsoft.Azure.Cosmos.Spatial`` namespaces.

    ```csharp
    using Microsoft.Azure.Cosmos;
    using Microsoft.Azure.Cosmos.Linq;
    using Microsoft.Azure.Cosmos.Spatial;
    ```

1. Add a string variable named *``connectionString`` with the connection string you recorded earlier in this guide.

    ```csharp
    string connectionString = "<your-account-connection-string>"
    ```

1. Create a new instance of the [``CosmosClient``](/dotnet/api/microsoft.azure.cosmos.cosmosclient) class passing in ``connectionString`` and wrapping it in a [using statement](/dotnet/csharp/language-reference/statements/using).

    ```csharp
    using CosmosClient client = new (connectionString);
    ```

1. Retrieve a reference to the previously created container (``cosmicworks/locations``) in the Azure Cosmos DB for NoSQL account by using [``CosmosClient.GetDatabase``](/dotnet/api/microsoft.azure.cosmos.cosmosclient.getdatabase) and then [``Database.GetContainer``](/dotnet/api/microsoft.azure.cosmos.database.getcontainer). Store the result in a variable named ``container``.

    ```csharp
    var container = client.GetDatabase("cosmicworks").GetContainer("locations");
    ```

1. Save the **Program.cs** file.

## Add geospatial data

The .NET SDK includes multiple types in the [``Microsoft.Azure.Cosmos.Spatial``](/dotnet/api/microsoft.azure.cosmos.spatial) namespace to represent common GeoJSON objects. These types streamline the process of adding new location information to items in a container.

1. Create a new file named **Office.cs**. In the file, add a using directive to ``Microsoft.Azure.Cosmos.Spatial`` and then create a ``Office`` [record type](/dotnet/csharp/language-reference/builtin-types/record) with these properties:

    | | Type | Description | Default value |
    | --- | --- | --- | --- |
    | **id** | ``string`` | Unique identifier | |
    | **name** | ``string`` | Name of the office | |
    | **location** | ``Point`` | GeoJSON geographical point | |
    | **category** | ``string`` | Partition key value | ``business-office`` |

    ```csharp
    using Microsoft.Azure.Cosmos.Spatial;

    public record Office(
        string id,
        string name,
        Point location,
        string category = "business-office"
    );
    ```

    > [!NOTE]
    > This record includes a [``Point``](/dotnet/api/microsoft.azure.cosmos.spatial.point) property representing a specific position in GeoJSON. For more information, see [GeoJSON Point](https://datatracker.ietf.org/doc/html/rfc7946#section-3.1.2).

1. Create another new file named **Region.cs**. Add another record type named ``Region`` with these properties:

    | | Type | Description | Default value |
    | --- | --- | --- | --- |
    | **id** | ``string`` | Unique identifier | |
    | **name** | ``string`` | Name of the office | |
    | **location** | ``Polygon`` | GeoJSON geographical shape | |
    | **category** | ``string`` | Partition key value | ``business-region`` |

    ```csharp
    using Microsoft.Azure.Cosmos.Spatial;

    public record Region(
        string id,
        string name,
        Polygon location,
        string category = "business-region"
    );
    ```

    > [!NOTE]
    > This record includes a [``Polygon``](/dotnet/api/microsoft.azure.cosmos.spatial.polygon) property representing a shape composed of lines drawn between multiple locations in GeoJSON. For more information, see [GeoJSON Polygon](https://datatracker.ietf.org/doc/html/rfc7946#section-3.1.6).

1. Create another new file named **Result.cs**. Add a record type named ``Result`` with these two properties:

    | | Type | Description |
    | --- | --- | --- |
    | **name** | ``string`` | Name of the matched result |
    | **distanceKilometers** | ``decimal`` | Distance in kilometers |

    ```csharp
    public record Result(
        string name,
        decimal distanceKilometers
    );
    ```

1. Save the **Office.cs**, **Region.cs**, and **Result.cs** files.

1. Open the **Program.cs** file again.

1. Create a new [``Polygon``](/dotnet/api/microsoft.azure.cosmos.spatial.polygon) in a variable named ``mainCampusPolygon``.

    ```csharp
    Polygon mainCampusPolygon = new (
        new []
        {
            new LinearRing(new [] {
                new Position(-122.13237, 47.64606),
                new Position(-122.13222, 47.63376),
                new Position(-122.11841, 47.64175),
                new Position(-122.12061, 47.64589),
                new Position(-122.13237, 47.64606),
            })
        }
    );
    ```

1. Create a new ``Region`` variable named ``mainCampusRegion`` using the polygon, the unique identifier ``1000``, and the name ``Main Campus``.

    ```csharp
    Region mainCampusRegion = new ("1000", "Main Campus", mainCampusPolygon);
    ```

1. Use [``Container.UpsertItemAsync``](/dotnet/api/microsoft.azure.cosmos.container.upsertitemasync) to add the region to the container. Write the region's information to the console.

    ```csharp
    await container.UpsertItemAsync<Region>(mainCampusRegion);
    Console.WriteLine($"[UPSERT ITEM]\t{mainCampusRegion}");
    ```

    > [!TIP]
    > This guide uses **upsert** instead of **insert** so you can run the script multiple times without causing a conflict between unique identifiers. For more information on upsert operations, see [creating items](how-to-dotnet-create-item.md).

1. Create a new [``Point``](/dotnet/api/microsoft.azure.cosmos.spatial.point) variable named ``headquartersPoint``. Use that variable to create a new ``Office`` variable named ``headquartersOffice`` using the point, the unique identifier ``0001``, and the name ``Headquarters``.

    ```csharp
    Point headquartersPoint = new (-122.12827, 47.63980);
    Office headquartersOffice = new ("0001", "Headquarters", headquartersPoint);
    ```

1. Create another ``Point`` variable named ``researchPoint``. Use that variable to create another ``Office`` variable named ``researchOffice`` using the corresponding point, the unique identifier ``0002``, and the name ``Research and Development``.

    ```csharp
    Point researchPoint = new (-96.84369, 46.81298);
    Office researchOffice = new ("0002", "Research and Development", researchPoint);
    ```

1. Create a [``TransactionalBatch``](/dotnet/api/microsoft.azure.cosmos.transactionalbatch) to upsert both ``Office`` variables as a single transaction. Then, write both office's information to the console.

    ```csharp
    TransactionalBatch officeBatch = container.CreateTransactionalBatch(new PartitionKey("business-office"));
    officeBatch.UpsertItem<Office>(headquartersOffice);
    officeBatch.UpsertItem<Office>(researchOffice);
    await officeBatch.ExecuteAsync();

    Console.WriteLine($"[UPSERT ITEM]\t{headquartersOffice}");
    Console.WriteLine($"[UPSERT ITEM]\t{researchOffice}");
    ```

    > [!NOTE]
    > For more information on transactions, see [transactional batch operations](transactional-batch.md).

1. Save the **Program.cs** file.

1. Run the application in a terminal using [``dotnet run``](/dotnet/core/tools/dotnet-run). Observe that the output of the application run includes information about the three newly created items.

    ```bash
    dotnet run
    ```

    ```output
    [UPSERT ITEM]   Region { id = 1000, name = Main Campus, location = Microsoft.Azure.Cosmos.Spatial.Polygon, category = business-region }
    [UPSERT ITEM]   Office { id = 0001, name = Headquarters, location = Microsoft.Azure.Cosmos.Spatial.Point, category = business-office }
    [UPSERT ITEM]   Office { id = 0002, name = Research and Development, location = Microsoft.Azure.Cosmos.Spatial.Point, category = business-office }
    ```

## Query geospatial data using NoSQL query

The types in the ``Microsoft.Azure.Cosmos.Spatial`` namespace can be used as inputs to a NoSQL parameterized query to use built-in functions like [``ST_DISTANCE``](query/st-distance.md).

1. Open the **Program.cs** file.

1. Create a new ``string`` variable named ``nosql`` with the query is used in this section to measure the distance between points.

    ```csharp
    string nosqlString = @"
        SELECT
            o.name,
            NumberBin(distanceMeters / 1000, 0.01) AS distanceKilometers
        FROM
            offices o
        JOIN
            (SELECT VALUE ROUND(ST_DISTANCE(o.location, @compareLocation))) AS distanceMeters
        WHERE
            o.category = @partitionKey AND
            distanceMeters > @maxDistance
    ";
    ```

    > [!TIP]
    > This query places the geospatial function within a [subquery](query/subquery.md) to simplify the process of reusing the already calculated value multiple times in the [``SELECT``](query/select.md) and [``WHERE``](query/where.md) clauses.

1. Create a new [``QueryDefinition``](/dotnet/api/microsoft.azure.cosmos.querydefinition) variable named ``query`` using the ``nosqlString`` variable as a parameter. Then use the [``QueryDefinition.WithParameter``](/dotnet/api/microsoft.azure.cosmos.querydefinition.withparameter) fluent method multiple times to add these parameters to the query:

    | | Value |
    | --- | --- |
    | **@maxDistance** | ``2000`` |
    | **@partitionKey** | ``"business-office"`` |
    | **@compareLocation** | ``new Point(-122.11758, 47.66901)`` |

    ```csharp
    var query = new QueryDefinition(nosqlString)
        .WithParameter("@maxDistance", 2000)
        .WithParameter("@partitionKey", "business-office")
        .WithParameter("@compareLocation", new Point(-122.11758, 47.66901));
    ```

1. Create a new iterator using [``Container.GetItemQueryIterator<>``](/dotnet/api/microsoft.azure.cosmos.container.getitemqueryiterator), the ``Result`` generic type, and the ``query`` variable. Then, use a combination of a **while** and **foreach** loop to iterate over all results in each page of results. Output each result to the console.

    ```csharp
    var distanceIterator = container.GetItemQueryIterator<Result>(query);
    while (distanceIterator.HasMoreResults)
    {
        var response = await distanceIterator.ReadNextAsync();
        foreach (var result in response)
        {
            Console.WriteLine($"[DISTANCE KM]\t{result}");
        }
    }
    ```

    > [!NOTE]
    > For more information on enumerating query results, see [query items](how-to-dotnet-query-items.md).

1. Save the **Program.cs** file.

1. Run the application again in a terminal using ``dotnet run``. Observe that the output now includes the results of the query.

    ```bash
    dotnet run
    ```

    ```output
    [DISTANCE KM]   Result { name = Headquarters, distanceKilometers = 3.34 }
    [DISTANCE KM]   Result { name = Research and Development, distanceKilometers = 1907.43 }
    ```

## Query geospatial data using LINQ

The [LINQ to NoSQL](query/linq-to-sql.md) functionality in the .NET SDK supports including geospatial types in the query expressions. Even further, the SDK includes extension methods that map to equivalent built-in functions:

| Extension method | Built-in function |
| --- | --- |
| [``Distance()``](/dotnet/api/microsoft.azure.cosmos.spatial.geometry.distance) | [``ST_DISTANCE``](query/st-distance.md) |
| [``Intersects()``](/dotnet/api/microsoft.azure.cosmos.spatial.geometry.intersects) | [``ST_INTERSECTS``](query/st-intersects.md) |
| [``IsValid()``](/dotnet/api/microsoft.azure.cosmos.spatial.geometry.isvalid) | [``ST_ISVALID``](query/st-isvalid.md) |
| [``IsValidDetailed()``](/dotnet/api/microsoft.azure.cosmos.spatial.geometry.isvaliddetailed) | [``ST_ISVALIDDETAILED``](query/st-isvaliddetailed.md) |
| [``Within()``](/dotnet/api/microsoft.azure.cosmos.spatial.geometry.within) | [``ST_WITHIN``](query/st-within.md) |

1. Open the **Program.cs** file.

1. Retrieve the ``Region`` item from the container with a unique identifier of ``1000`` and store it in a variable named ``region``.

    ```csharp
    Region region = await container.ReadItemAsync<Region>("1000", new PartitionKey("business-region"));
    ```

1. Use the [``Container.GetItemLinqQueryable<>``](/dotnet/api/microsoft.azure.cosmos.container.getitemlinqqueryable) method to get a LINQ queryable, and the build the LINQ query fluently by performing these three actions:

    1. Use the [``Queryable.Where<>``](/dotnet/api/system.linq.queryable.where) extension method to filter to only items with a ``category`` equivalent to ``"business-office"``.

    1. Use ``Queryable.Where<>`` again to filter to only locations within the ``region`` variable's ``location`` property using [``Geometry.Within()``](/dotnet/api/microsoft.azure.cosmos.spatial.geometry.within).

    1. Translate the LINQ expression to a feed iterator using [``CosmosLinqExtensions.ToFeedIterator<>``](/dotnet/api/microsoft.azure.cosmos.linq.cosmoslinqextensions.tofeediterator).

    ```csharp
    var regionIterator = container.GetItemLinqQueryable<Office>()
        .Where(o => o.category == "business-office")
        .Where(o => o.location.Within(region.location))
        .ToFeedIterator<Office>();
    ```

    > [!IMPORTANT]
    > In this example, the office's location property has a **point**, and the region's location property has a **polygon**. ``ST_WITHIN`` is determining if the point of the office is within the polygon of the region.

1. Use a combination of a **while** and **foreach** loop to iterate over all results in each page of results. Output each result to the console.

    ```csharp
    while (regionIterator.HasMoreResults)
    {
        var response = await regionIterator.ReadNextAsync();
        foreach (var office in response)
        {
            Console.WriteLine($"[IN REGION]\t{office}");
        }
    }
    ```

1. Save the **Program.cs** file.

1. Run the application one last time in a terminal using ``dotnet run``. Observe that the output now includes the results of the second LINQ-based query.

    ```bash
    dotnet run
    ```

    ```output
    [IN REGION]     Office { id = 0001, name = Headquarters, location = Microsoft.Azure.Cosmos.Spatial.Point, category = business-office }
    ```

## Clean up resources

Remove your database after you complete this guide.

1. Open a terminal and create a shell variable for the name of your account and resource group.

    ```azurecli-interactive
    # Variable for resource group name
    resourceGroupName="<name-of-your-resource-group>"

    # Variable for account name
    accountName="<name-of-your-account>"
    ```

1. Use [``az cosmosdb sql database delete``](/cli/azure/cosmosdb/sql/database#az-cosmosdb-sql-database-delete) to remove the database.

    ```azurecli-interactive
    az cosmosdb sql database delete \
        --resource-group $resourceGroupName \
        --account-name $accountName \
        --name "cosmicworks"
    ```

## Next steps

> [!div class="nextstepaction"]
> [Geospatial and GeoJSON location data](query/geospatial.md)
