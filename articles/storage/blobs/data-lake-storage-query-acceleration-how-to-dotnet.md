---
title: Filter data by using Azure Data Lake Storage query acceleration (.NET) | Microsoft Docs
description: Use .NET and query acceleration (Preview) to retrieve a subset of data from your storage
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: conceptual
ms.date: 03/16/2020
ms.author: normesta
ms.reviewer: jamsbak
---

# Filter data by using Azure Data Lake Storage query acceleration (.NET)

This article shows you how to use .NET and quick query (Preview) to retrieve a subset of data from your storage account. 

Query acceleration (Preview) is a new capability for Azure Data Lake Storage that enables application and analytics frameworks to dramatically optimize data processing by retrieving only the data that they require to perform a given operation. To learn more, see [Azure Data Lake Storage Query Acceleration (Preview)](data-lake-storage-query-acceleration.md).

> [!NOTE]
> The query acceleration feature is in public preview, and is available in the West Central US and West US 2 regions. To review limitations, see the [Known issues](data-lake-storage-known-issues.md) article. To enroll in the preview, see [this form](https://aka.ms/adls/queryaccelerationpreview). 

## Prerequisites

- To access Azure Storage, you'll need an Azure subscription. If you don't already have a subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- A **general-purpose v2** storage account. see [Create a storage account](../common/storage-quickstart-create-account.md).

## Set up your project

To get started, download the query acceleration packages. 

install the [Azure.Storage.Blob](https://www.nuget.org/packages/Azure.Storage.Files.DataLake/12.0.0-preview.6) NuGet package.  (Need preview package name and install location).

For more information about how to install NuGet packages, see [Install and manage packages in Visual Studio using the NuGet Package Manager](https://docs.microsoft.com/nuget/consume-packages/install-use-packages-visual-studio).

Then, add these using statements to the top of your code file.

```csharp
using statement 1;
using statement 2;
...
...
```
## Retrieve data by using a filter

Quick query can retrieve CSV and Json formatted data. In this section, we'll parse a CSV file by using the [TinyCsvParser](https://www.nuget.org/packages/TinyCsvParser/) library that is available on NuGet.  The following code defines a class that holds the data for each returned row, and a class that provides a way to map each column in the CSV file with a class member.  

```csharp
class Person 
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public DateTime BirthDate { get; set; }
}

class CsvPersonMapping : CsvMapping<Person>
{
    public CsvPersonMapping()
    {
        MapProperty(0, x => x.FirstName);
        MapProperty(1, x => x.LastName);
        MapProperty(2, x => x.BirthDate);
    }
}
```

You can use SQL to specify the row filter predicates and column projections in a quick query request. The following code queries a CSV file in storage and returns all rows of data where the first column matches the value `Contoso`. 

- In the SQL query, the keyword `BlobStorage` is used to denote the file that is being queried.

- Column references are specified as `_N` where the first column is `_1`.

- The async method `RunQueryAsync` sends the query to the quick query API, and then streams the results back to the application as a [Stream](https://docs.microsoft.com/dotnet/api/system.io.stream?view=netframework-4.8) object.


```csharp

private static async Task Query<TRecord, TMapper>
    (CloudBlobClient serviceClient, Uri blobUri, string query) 
        where TMapper : ICsvMapping<TRecord>, new()
{
    var blob = (CloudBlob)serviceClient.GetBlobReferenceFromServer(blobUri);
    var parser = new CsvParser<TRecord>(new CsvParserOptions(false, ','), new TMapper());
    
    using (Stream resultStream = await blob.RunQueryAsync(query, null))
    {
        parser.ReadFromStream(resultStream, Encoding.UTF8)
            .ForAll(row => Console.WriteLine
            (row.IsValid ? row.Result.ToString() : row.Error.ToString()));
    }
}

private static async Task QueryPeople(CloudBlobClient serviceClient, Uri blobUri)
{
    string query = @"SELECT * FROM BlobStorage WHERE _1 = 'Contoso'";
    await Query<Person, CsvPersonMapping>(serviceClient, blobUri, query);
}

```

## Retrieve specific columns

You can scope your results to a subset of columns. That way you retrieve only the columns needed to perform a given calculation. This improves application performance and reduces cost because less data is transferred over the network. 

This code retrieves only the `BirthDate` column. To achieve this with the TinyCsvParser library, you'll need to define a new mapping class. 

```csharp
class BirthDateMapping : CsvMapping<Person>
{
    public BirthDateMapping()
    {
        MapProperty(0, x => x.BirthDate);
    }
}

private static async Task QueryBirthDates(CloudBlobClient serviceClient, Uri blobUri)
{
    string query = @"SELECT _3 FROM BlobStorage";
    await Query<Person, BirthDateMapping>(serviceClient, blobUri, query);
}
```

The following code combines row filtering and column projections into the same query. 

```csharp
private static async Task QueryBirthDates(CloudBlobClient serviceClient, Uri blobUri)
{
    string query = @"SELECT _3 FROM BlobStorage WHERE _1 = 'Contoso'";
    await Query<Person, BirthDateMapping>(serviceClient, blobUri, query);
}
```

## Next steps

- [Quick query enrollment form](https://aka.ms/adlsquickquerypreview)    
- [Azure Data Lake Storage quick query (Preview)](data-lake-storage-quick-query.md)
- Quick query SQL language reference
- Quick query REST API reference
