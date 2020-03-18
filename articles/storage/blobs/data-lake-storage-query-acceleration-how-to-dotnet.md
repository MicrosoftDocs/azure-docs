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

## Install the packages that enable query acceleration 

1. To get started, download the query acceleration packages. You can obtain a compressed .zip file that contains these packages by using this link: [https://aka.ms/adls/qqsdk/.net](https://aka.ms/adls/qqsdk/.net). 

2. Extract the files in this .zip file to any folder on your local drive. 

3. In **Solution Explorer**, right-click either **References** or your project and select **Manage NuGet Packages**.

   The NuGet Package Manager opens.

4. In the NuGet Package Manager, add the folder on your local drive as a package source. 

   For more guidance, see [Package sources](https://docs.microsoft.com/nuget/consume-packages/install-use-packages-visual-studio#package-sources).

5. Make sure that the **Package source** drop-down list is set to **all**. This ensures that you install any packages from [https://www.nuget.org/]() that the query accelerator packages depends on.

   > [!div class="mx-imgBorder"]
   > ![Nuget Packages set to all](./media/data-lake-storage-query-acceleration/nuget-package-all.png)

6. Choose the **Browse** tab, select the **Include pre-release** checkbox, and in the search text box, type **Azure.Storage**. 

      > [!div class="mx-imgBorder"]
   > ![Search for query accelerator packages](./media/data-lake-storage-query-acceleration/nuget-package-search.png)

7. Install the **Azure.Storage.Blobs**, **Azure.Storage.Common**, and **Azure.Storage.QuickQuery** packages.

   For more information about how to install NuGet packages, see [Install and manage packages in Visual Studio using the NuGet Package Manager](https://docs.microsoft.com/nuget/consume-packages/install-use-packages-visual-studio).

## Add using statements to your code files

Add these `using` statements to the top of your code file.

```csharp
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Blobs.Specialized;
using Azure.Storage.QuickQuery;
using Azure.Storage.QuickQuery.Models;
```

Quick query retrieves CSV and Json formatted data. Therefore, make sure to add using statements for any CSV or Json parsing libraries that you choose to use. The examples that appear in this article parse a CSV file by using the [CsvHelper](https://www.nuget.org/packages/CsvHelper/) library that is available on NuGet. Therefore, we'd add these using statements to the top of the code file.

```csharp
using CsvHelper;
using CsvHelper.Configuration;
```

## Retrieve data by using a filter

You can use SQL to specify the row filter predicates and column projections in a query acceleration request. The following code queries a CSV file in storage and returns all rows of data where the third column matches the value `Hemingway, Ernest`. 

- In the SQL query, the keyword `BlobStorage` is used to denote the file that is being queried.

- Column references are specified as `_N` where the first column is `_1`. If the source file contains a header row, then you can specify `CvsTextConfiguration.HasHeaders = true` which will allow you to refer to columns by their name.

- The async method `BlobQuickQueryClient.QueryAsync` sends the query to the query acceleration API, and then streams the results back to the application as a [Stream](https://docs.microsoft.com/dotnet/api/system.io.stream?view=netframework-4.8) object.

```csharp
static async Task QueryHemingway(BlockBlobClient blob)
{
    string query = @"SELECT * FROM BlobStorage WHERE _3 = 'Hemingway, Ernest'";
    await DumpQueryCsv(blob, query, false);
}

private static async Task DumpQueryCsv(BlockBlobClient blob, string query, bool headers)
{
    try
    {
        using (var reader = new StreamReader((await blob.GetQuickQueryClient().QueryAsync(query,
                new CvsTextConfiguration() { HasHeaders = headers }, 
                new CvsTextConfiguration() { HasHeaders = true }, 
                new ErrorHandler(),
                new BlobRequestConditions(), 
                new ProgressHandler(),
                CancellationToken.None)).Value.Content))
        {
            using (var parser = new CsvReader(reader, new CsvConfiguration(CultureInfo.CurrentCulture) 
            { HasHeaderRecord = true }))
            {
                while (await parser.ReadAsync())
                {
                    parser.Context.Record.All(cell =>
                    {
                        Console.Out.Write(cell + "  ");
                        return true;
                    });
                    Console.Out.WriteLine();
                }
            }
        }
    }
    catch (Exception ex)
    {
        Console.Error.WriteLine("Exception: " + ex.ToString());
    }
}

class ErrorHandler : IBlobQueryErrorReceiver
{
    public void ReportError(BlobQueryError err)
    {
        Console.Error.WriteLine(String.Format("Error: {1}:{2}", err.Name, err.Description));
    }
}

class ProgressHandler : IProgress<long>
{
    public void Report(long value)
    {
        Console.Error.WriteLine("Bytes scanned: " + value.ToString());
    }
}

```

## Retrieve specific columns

You can scope your results to a subset of columns. That way you retrieve only the columns needed to perform a given calculation. This improves application performance and reduces cost because less data is transferred over the network. 

This code retrieves only the `PublicationYear` column for all books in the data set. It also uses the information from the header row in the source file to reference columns in the query. 

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

- [Query acceleration enrollment form](https://aka.ms/adls/queryaccelerationpreview)    
- [Azure Data Lake Storage query acceleration (Preview)](data-lake-storage-quick-query.md)
- Query acceleration SQL language reference
- Query acceleration REST API reference
