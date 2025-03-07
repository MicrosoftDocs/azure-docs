---
title: Filter data by using Azure Data Lake Storage query acceleration
titleSuffix: Azure Storage
description: Use query acceleration to retrieve a subset of data from your storage account.
author: normesta

ms.service: azure-data-lake-storage
ms.topic: how-to
ms.date: 11/18/2024
ms.author: normesta
ms.reviewer: jamsbak
ms.devlang: csharp
# ms.devlang: csharp, java, javascript, python
ms.custom: devx-track-csharp, devx-track-azurepowershell
---

# Filter data by using Azure Data Lake Storage query acceleration

This article shows you how to use query acceleration to retrieve a subset of data from your storage account.

Query acceleration enables applications and analytics frameworks to dramatically optimize data processing by retrieving only the data that they require to perform a given operation. To learn more, see [Azure Data Lake Storage Query Acceleration](data-lake-storage-query-acceleration.md).

## Prerequisites

- To access Azure Storage, you'll need an Azure subscription. If you don't already have a subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- A **general-purpose v2** storage account. see [Create a storage account](../common/storage-account-create.md).

- Double encryption is not supported.
- If you are querying a JSON file, each record size in this file should be smaller than 1MB.
- Choose a tab to view any SDK-specific prerequisites.

  ### [PowerShell](#tab/azure-powershell)

  Not applicable

  ### [.NET](#tab/dotnet)

  The [.NET SDK](https://dotnet.microsoft.com/download)

  ### [Java](#tab/java)

  - [Java Development Kit (JDK)](/java/azure/jdk/) version 8 or above

  - [Apache Maven](https://maven.apache.org/download.cgi)

    > [!NOTE]
    > This article assumes that you've created a Java project by using Apache Maven. For an example of how to create a project by using Apache Maven, see [Setting up](storage-quickstart-blobs-java.md#setting-up).

  ### [Python](#tab/python)

  [Python](https://www.python.org/downloads/) 3.8 or greater.

  ### [Node.js](#tab/nodejs)

  There are no additional prerequisites required to use the Node.js SDK.

---

## Set up your environment

### Step 1: Install packages

#### [PowerShell](#tab/azure-powershell)

Install the Az module version 4.6.0 or higher.

```powershell
Install-Module -Name Az -Repository PSGallery -Force
```

To update from an older version of Az, run the following command:

```powershell
Update-Module -Name Az
```

#### [.NET](#tab/dotnet)

1. Open a command prompt and change directory (`cd`) into your project folder For example:

   ```console
   cd myProject
   ```

2. Install the `12.5.0-preview.6` version or later of the Azure Blob storage client library for .NET package by using the `dotnet add package` command.

   ```console
   dotnet add package Azure.Storage.Blobs -v 12.8.0
   ```

3. The examples that appear in this article parse a CSV file by using the [CsvHelper](https://www.nuget.org/packages/CsvHelper/) library. To use that library, use the following command.

   ```console
   dotnet add package CsvHelper
   ```

#### [Java](#tab/java)

1. Open the *pom.xml* file of your project in a text editor. Add the following dependency elements to the group of dependencies.

   ```xml
   <!-- Request static dependencies from Maven -->
   <dependency>
       <groupId>com.azure</groupId>
       <artifactId>azure-core</artifactId>
       <version>1.6.0</version>
   </dependency>
    <dependency>
        <groupId>org.apache.commons</groupId>
        <artifactId>commons-csv</artifactId>
        <version>1.8</version>
    </dependency>
    <dependency>
      <groupId>com.azure</groupId>
      <artifactId>azure-storage-blob</artifactId>
      <version>12.8.0-beta.1</version>
    </dependency>
   ```

#### [Python](#tab/python)

Install the Azure Data Lake Storage client library for Python by using [pip](https://pypi.org/project/pip/).

```
pip install azure-storage-blob==12.4.0
```

#### [Node.js ](#tab/nodejs)

Install Data Lake client library for JavaScript by opening a terminal window, and then typing the following command.

```javascript
    npm install @azure/storage-blob
    npm install @fast-csv/parse
```

---

### Step 2: Add statements

#### [PowerShell](#tab/azure-powershell)

Not applicable

#### [.NET](#tab/dotnet)

Add these `using` statements to the top of your code file.

```csharp
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Blobs.Specialized;
```

Query acceleration retrieves CSV and JSON formatted data. Therefore, make sure to add using statements for any CSV or JSON parsing libraries that you choose to use. The examples that appear in this article parse a CSV file by using the [CsvHelper](https://www.nuget.org/packages/CsvHelper/) library that is available on NuGet. Therefore, we'd add these `using` statements to the top of the code file.

```csharp
using CsvHelper;
using CsvHelper.Configuration;
```

To compile examples presented in this article, you'll also need to add these `using` statements as well.

```csharp
using System.Threading.Tasks;
using System.IO;
using System.Globalization;
```

#### [Java](#tab/java)

Add these `import` statements to the top of your code file.

```java
import com.azure.storage.blob.*;
import com.azure.storage.blob.options.*;
import com.azure.storage.blob.models.*;
import com.azure.storage.common.*;
import java.io.*;
import java.util.function.Consumer;
import org.apache.commons.csv.*;
```

#### [Python](#tab/python)

Add these import statements to the top of your code file.

```python
import sys, csv
from azure.storage.blob import BlobServiceClient, ContainerClient, BlobClient, DelimitedTextDialect, BlobQueryError
```

### [Node.js](#tab/nodejs)

Include the `storage-blob` module by placing this statement at the top of your code file.

```javascript
const { BlobServiceClient } = require("@azure/storage-blob");
```

Query acceleration retrieves CSV and JSON formatted data. Therefore, make sure to add statements for any CSV or JSON parsing modules that you choose to use. The examples that appear in this article parse a CSV file by using the [fast-csv](https://www.npmjs.com/package/fast-csv) module. Therefore, we'd add this statement to the top of the code file.

```javascript
const csv = require('@fast-csv/parse');
```

---

## Retrieve data by using a filter

You can use SQL to specify the row filter predicates and column projections in a query acceleration request. The following code queries a CSV file in storage and returns all rows of data where the third column matches the value `Hemingway, Ernest`.

- In the SQL query, the keyword `BlobStorage` is used to denote the file that is being queried.

- Column references are specified as `_N` where the first column is `_1`. If the source file contains a header row, then you can refer to columns by the name that is specified in the header row.

### [PowerShell](#tab/azure-powershell)

```powershell
Function Get-QueryCsv($ctx, $container, $blob, $query, $hasheaders) {
    $tempfile = New-TemporaryFile
    $informat = New-AzStorageBlobQueryConfig -AsCsv -HasHeader:$hasheaders
    Get-AzStorageBlobQueryResult -Context $ctx -Container $container -Blob $blob -InputTextConfiguration $informat -OutputTextConfiguration (New-AzStorageBlobQueryConfig -AsCsv -HasHeader) -ResultFile $tempfile.FullName -QueryString $query -Force
    Get-Content $tempfile.FullName
}

$container = "data"
$blob = "csv/csv-general/seattle-library.csv"
Get-QueryCsv $ctx $container $blob "SELECT * FROM BlobStorage WHERE _3 = 'Hemingway, Ernest, 1899-1961'" $false

```

### [.NET](#tab/dotnet)

The async method `BlockBlobClient.QueryAsync` sends the query to the query acceleration API, and then streams the results back to the application as a [Stream](/dotnet/api/system.io.stream) object.

```cs
static async Task QueryHemingway(BlockBlobClient blob)
{
    string query = @"SELECT * FROM BlobStorage WHERE _3 = 'Hemingway, Ernest, 1899-1961'";
    await DumpQueryCsv(blob, query, false);
}

private static async Task DumpQueryCsv(BlockBlobClient blob, string query, bool headers)
{
    try
    {
        var options = new BlobQueryOptions()
        {
            InputTextConfiguration = new BlobQueryCsvTextOptions()
            { 
                HasHeaders = true, 
                RecordSeparator = "\n", 
                ColumnSeparator = ",", 
                EscapeCharacter = '\\', 
                QuotationCharacter = '"'
            },
            OutputTextConfiguration = new BlobQueryCsvTextOptions() 
            { 
                HasHeaders = true, 
                RecordSeparator = "\n", 
                ColumnSeparator = ",", 
                EscapeCharacter = '\\', 
                QuotationCharacter = '"' },
            ProgressHandler = new Progress<long>((finishedBytes) => 
                Console.Error.WriteLine($"Data read: {finishedBytes}"))
        };
        options.ErrorHandler += (BlobQueryError err) => {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.Error.WriteLine($"Error: {err.Position}:{err.Name}:{err.Description}");
            Console.ResetColor();
        };
        // BlobDownloadInfo exposes a Stream that will make results available when received rather than blocking for the entire response.
        using (var reader = new StreamReader((await blob.QueryAsync(
                query,
                options)).Value.Content))
        {
            using (var parser = new CsvReader
                (reader, new CsvConfiguration(CultureInfo.CurrentCulture) { HasHeaderRecord = true }))
            {
                while (await parser.ReadAsync())
                {
                    Console.Out.WriteLine(String.Join(" ", parser.Parser.Record));
                }
            }
        }
    }
    catch (Exception ex)
    {
        System.Windows.Forms.MessageBox.Show("Exception: " + ex.ToString());
    }
}

```

### [Java](#tab/java)

The method `BlockBlobClient.openInputStream()` sends the query to the query acceleration API, and then streams the results back to the application as a `InputStream` object which can be read like any other InputStream object.

```java
static void QueryHemingway(BlobClient blobClient) {
    String expression = "SELECT * FROM BlobStorage WHERE _3 = 'Hemingway, Ernest, 1899-1961'";
    DumpQueryCsv(blobClient, expression, true);
}

static void DumpQueryCsv(BlobClient blobClient, String query, Boolean headers) {
    try {
        BlobQuerySerialization input = new BlobQueryDelimitedSerialization()
            .setRecordSeparator('\n')
            .setColumnSeparator(',')
            .setHeadersPresent(headers)
            .setFieldQuote('\0')
            .setEscapeChar('\\');
        BlobQuerySerialization output = new BlobQueryDelimitedSerialization()
            .setRecordSeparator('\n')
            .setColumnSeparator(',')
            .setHeadersPresent(true)
            .setFieldQuote('\0')
            .setEscapeChar('\n');
        Consumer<BlobQueryError> errorConsumer = System.out::println;
        Consumer<BlobQueryProgress> progressConsumer = progress -> System.out.println("total bytes read: " + progress.getBytesScanned());
        BlobQueryOptions queryOptions = new BlobQueryOptions(query)
            .setInputSerialization(input)
            .setOutputSerialization(output)
            .setErrorConsumer(errorConsumer)
            .setProgressConsumer(progressConsumer);

        /* Open the query input stream. */
        InputStream stream = blobClient.openQueryInputStream(queryOptions).getValue();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(stream))) {
            /* Read from stream like you normally would. */
            for (CSVRecord record : CSVParser.parse(reader, CSVFormat.EXCEL.withHeader())) {
                System.out.println(record.toString());
            }
        }
    } catch (Exception e) {
        System.err.println("Exception: " + e.toString());
        e.printStackTrace(System.err);
    }
}
```

### [Python](#tab/python)

```python
def query_hemingway(blob: BlobClient):
    query = "SELECT * FROM BlobStorage WHERE _3 = 'Hemingway, Ernest, 1899-1961'"
    dump_query_csv(blob, query, False)

def dump_query_csv(blob: BlobClient, query: str, headers: bool):
    qa_reader = blob.query_blob(query, blob_format=DelimitedTextDialect(has_header=headers), on_error=report_error, encoding='utf-8')
    # records() returns a generator that will stream results as received. It will not block pending all results.
    csv_reader = csv.reader(qa_reader.records())
    for row in csv_reader:
        print("*".join(row))
```

### [Node.js](#tab/nodejs)

This example sends the query to the query acceleration API, and then streams the results back. The `blob` object passed into the `queryHemingway` helper function is of type [BlockBlobClient](/javascript/api/@azure/storage-blob/blockblobclient). To learn more about how to get a [BlockBlobClient](/javascript/api/@azure/storage-blob/blockblobclient) object, see [Quickstart: Manage blobs with JavaScript v12 SDK in Node.js](storage-quickstart-blobs-nodejs.md).

```javascript
async function queryHemingway(blob)
{
    const query = "SELECT * FROM BlobStorage WHERE _3 = 'Hemingway, Ernest, 1899-1961'";
    await dumpQueryCsv(blob, query, false);
}

async function dumpQueryCsv(blob, query, headers)
{
    var response = await blob.query(query, {
        inputTextConfiguration: {
            kind: "csv",
            recordSeparator: '\n',
            hasHeaders: headers
        },
        outputTextConfiguration: {
            kind: "csv",
            recordSeparator: '\n',
            hasHeaders: true
        },
        onProgress: (progress) => console.log(`Data read: ${progress.loadedBytes}`),
        onError: (err) => console.error(`Error: ${err.position}:${err.name}:${err.description}`)});
    return new Promise(
        function (resolve, reject) {
            csv.parseStream(response.readableStreamBody)
                .on('data', row => console.log(row))
                .on('error', error => {
                    console.error(error);
                    reject(error);
                })
                .on('end', rowCount => resolve());
    });
}
```

---

## Retrieve specific columns

You can scope your results to a subset of columns. That way you retrieve only the columns needed to perform a given calculation. This improves application performance and reduces cost because less data is transferred over the network.

> [!NOTE]
> The maximum number of columns that you can scope your results to is 49. If you need your results to contain more than 49 columns, then use a wildcard character (`*`) for the SELECT expression (For example: `SELECT *`).

This code retrieves only the `BibNum` column for all books in the data set. It also uses the information from the header row in the source file to reference columns in the query.

### [PowerShell](#tab/azure-powershell)

```powershell
Function Get-QueryCsv($ctx, $container, $blob, $query, $hasheaders) {
    $tempfile = New-TemporaryFile
    $informat = New-AzStorageBlobQueryConfig -AsCsv -HasHeader:$hasheaders
    Get-AzStorageBlobQueryResult -Context $ctx -Container $container -Blob $blob -InputTextConfiguration $informat -OutputTextConfiguration (New-AzStorageBlobQueryConfig -AsCsv -HasHeader) -ResultFile $tempfile.FullName -QueryString $query -Force
    Get-Content $tempfile.FullName
}

$container = "data"
$blob = "csv/csv-general/seattle-library-with-headers.csv"
Get-QueryCsv $ctx $container $blob "SELECT BibNum FROM BlobStorage" $true

```

### [.NET](#tab/dotnet)

```cs
static async Task QueryBibNum(BlockBlobClient blob)
{
    string query = @"SELECT BibNum FROM BlobStorage";
    await DumpQueryCsv(blob, query, true);
}
```

### [Java](#tab/java)

```java
static void QueryBibNum(BlobClient blobClient)
{
    String expression = "SELECT BibNum FROM BlobStorage";
    DumpQueryCsv(blobClient, expression, true);
}
```

### [Python](#tab/python)

```python
def query_bibnum(blob: BlobClient):
    query = "SELECT BibNum FROM BlobStorage"
    dump_query_csv(blob, query, True)
```

### [Node.js](#tab/nodejs)

```javascript
async function queryBibNum(blob)
{
    const query = "SELECT BibNum FROM BlobStorage";
    await dumpQueryCsv(blob, query, true);
}
```

---

The following code combines row filtering and column projections into the same query.

### [PowerShell](#tab/azure-powershell)

```powershell
Get-QueryCsv $ctx $container $blob $query $true

Function Get-QueryCsv($ctx, $container, $blob, $query, $hasheaders) {
    $tempfile = New-TemporaryFile
    $informat = New-AzStorageBlobQueryConfig -AsCsv -HasHeader:$hasheaders
    Get-AzStorageBlobQueryResult -Context $ctx -Container $container -Blob $blob -InputTextConfiguration $informat -OutputTextConfiguration (New-AzStorageBlobQueryConfig -AsCsv -HasHeader) -ResultFile $tempfile.FullName -QueryString $query -Force
    Get-Content $tempfile.FullName
}

$container = "data"
$query = "SELECT BibNum, Title, Author, ISBN, Publisher, ItemType
            FROM BlobStorage
            WHERE ItemType IN
                ('acdvd', 'cadvd', 'cadvdnf', 'calndvd', 'ccdvd', 'ccdvdnf', 'jcdvd', 'nadvd', 'nadvdnf', 'nalndvd', 'ncdvd', 'ncdvdnf')"

```

### [.NET](#tab/dotnet)

```cs
static async Task QueryDvds(BlockBlobClient blob)
{
    string query = @"SELECT BibNum, Title, Author, ISBN, Publisher, ItemType
        FROM BlobStorage
        WHERE ItemType IN
            ('acdvd', 'cadvd', 'cadvdnf', 'calndvd', 'ccdvd', 'ccdvdnf', 'jcdvd', 'nadvd', 'nadvdnf', 'nalndvd', 'ncdvd', 'ncdvdnf')";
    await DumpQueryCsv(blob, query, true);
}
```

### [Java](#tab/java)

```java
static void QueryDvds(BlobClient blobClient)
{
    String expression = "SELECT BibNum, Title, Author, ISBN, Publisher, ItemType " +
                        "FROM BlobStorage " +
                        "WHERE ItemType IN " +
                        "   ('acdvd', 'cadvd', 'cadvdnf', 'calndvd', 'ccdvd', 'ccdvdnf', 'jcdvd', 'nadvd', 'nadvdnf', 'nalndvd', 'ncdvd', 'ncdvdnf')";
    DumpQueryCsv(blobClient, expression, true);
}
```

### [Python](#tab/python)

```python
def query_dvds(blob: BlobClient):
    query = "SELECT BibNum, Title, Author, ISBN, Publisher, ItemType "\
        "FROM BlobStorage "\
        "WHERE ItemType IN "\
        "   ('acdvd', 'cadvd', 'cadvdnf', 'calndvd', 'ccdvd', 'ccdvdnf', 'jcdvd', 'nadvd', 'nadvdnf', 'nalndvd', 'ncdvd', 'ncdvdnf')"
    dump_query_csv(blob, query, True)
```

### [Node.js](#tab/nodejs)

```javascript
async function queryDvds(blob)
{
    const query = "SELECT BibNum, Title, Author, ISBN, Publisher, ItemType " +
                  "FROM BlobStorage " +
                  "WHERE ItemType IN " +
                  " ('acdvd', 'cadvd', 'cadvdnf', 'calndvd', 'ccdvd', 'ccdvdnf', 'jcdvd', 'nadvd', 'nadvdnf', 'nalndvd', 'ncdvd', 'ncdvdnf')";
    await dumpQueryCsv(blob, query, true);
}
```

---

## Next steps

- [Azure Data Lake Storage query acceleration](data-lake-storage-query-acceleration.md)
- [Query acceleration SQL language reference](query-acceleration-sql-reference.md)
