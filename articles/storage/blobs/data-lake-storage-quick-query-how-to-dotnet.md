---
title: Filter data by using Azure Data Lake Storage quick query (.NET) | Microsoft Docs
description: Filter data by using Azure Data Lake Storage quick query.
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: conceptual
ms.date: 11/13/2019
ms.author: normesta
ms.reviewer: jamsbak
---

# Filter data by using Azure Data Lake Storage quick query (.NET)

Azure Data Lake Storage Quick Query (Preview) is a new capability for ADLS that allows applications and analytics frameworks to optimize both performance and cost by only retrieving a subset of data contained in a file.

This article shows how to use the Azure Storage client library for .NET to leverage Quick Query in your application. Using Quick Query directly from your application makes significant performance enhancement possible because data that is not required by the application does not need to be transferred over the network and then filtered out by the application. Due to this reduced computation overhead requirement, it is possible to gain significant cost savings due to the ability to achieve the same data processing outcome with less or smaller VMs.

> [!NOTE]
> The quick query feature is in public preview, and is available in the region1, region2, and region3 regions. To review limitations, see the [Known issues](data-lake-storage-known-issues.md) article. To enroll in the preview, see [this form](https://aka.ms/adlsquickquerypreview). 

## Prerequisites

•	Azure subscription: If you don't have an Azure subscription, create a free account before you begin.

•	Azure Storage StorageV2 account: If you don't have a Storage account, create an account.

## Download the Azure Storage client library for .NET with quick query support

Before integrating Quick Query into your application, you must first download a preview version of the Azure Storage client library for .NET to your computer. Once Quick Query reaches general availability, this functionality will be integrated into the main library, which is available from NuGet and therefore this still will not be required:

```
	wget <<TODO: Add download link>>
```

You can now add a reference to the downloaded library into your application project.

## Retrieve data using a filter

ADLS Quick Query uses a reduced SQL grammar to express the required row filtering predicates and column projections. The complete SQL reference supported by Quick Query is available here: Link goes here.

The following snippet uses the TinyCsvParser library from NuGet to parse the resulting CSV data. This library requires that a class is defined to hold the data for each returned row and a mapping class so that each column in the CSV data is mapped into a member of the class. Here, we show how to query for all rows whose first column matches the value of ‘Mary Poppins’:

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

private static async Task Query<TRecord, TMapper>(CloudBlobClient serviceClient, Uri blobUri, string query) where TMapper : ICsvMapping<TRecord>, new()
{
    var blob = (CloudBlob)serviceClient.GetBlobReferenceFromServer(blobUri);
    var parser = new CsvParser<TRecord>(new CsvParserOptions(false, ','), new TMapper());
    using (Stream resultStream = await blob.RunQueryAsync(query, null))
    {
        parser.ReadFromStream(resultStream, Encoding.UTF8)
            .ForAll(row => Console.WriteLine(row.IsValid ? row.Result.ToString() : row.Error.ToString()));
    }
}

private static async Task QueryPeople(CloudBlobClient serviceClient, Uri blobUri)
{
    string query = @"SELECT * FROM BlobStorage WHERE _1 = 'Mary Poppins'";
    await Query<Person, CsvPersonMapping>(serviceClient, blobUri, query);
}

```
Note the features of the above snippet:

1.	In the SQL query, the keyword BlobStorage is used to denote the file being queried
2.	Column references are specified as _N where the first column is _1
3.	The async method RunQueryAsync sends the query to the Quick Query API and streams the results back to the application as a Stream object

## Retrieve a subset of column from a CSV file

It is very common that applications only require a small number of the columns contained in a CSV file in order to perform their required calculation. Retrieving only the number of columns actually required by the application again improves performance and reduces cost due to the reduced amount of data transferred to the application.

Building on the above code snippet, here’s a sample that only retrieves the BirthDate column. To achieve this with TinyCsvParser, we also need to define a new mapping class:

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

Note that both row filtering and column projections can be combined into the same query. For example:

"SELECT _3 FROM BlobStorage WHERE _1 = 'Mary Poppins'"

## Next steps

- [Quick query enrollment form](data-lake-storage-quick-query.md)	
- [Azure Data Lake Storage Quick Query (Preview)](https://aka.ms/adlsquickquerypreview)
- Quick query SQL language reference
- Quick query REST API reference
