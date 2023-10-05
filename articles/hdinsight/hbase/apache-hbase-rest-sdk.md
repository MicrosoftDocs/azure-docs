---
title: Use the HBase .NET SDK - Azure HDInsight 
description: Use the HBase .NET SDK to create and delete tables, and to read and write data.
ms.service: hdinsight
ms.topic: how-to
ms.custom: hdinsightactive, devx-track-csharp, devx-track-dotnet
ms.date: 04/28/2023
---

# Use the .NET SDK for Apache HBase

[Apache HBase](apache-hbase-overview.md) provides two primary choices to work with your data: [Apache Hive queries, and calls to the HBase REST API](apache-hbase-tutorial-get-started-linux.md). You can work directly with the REST API using the `curl` command or a similar utility.

For C# and .NET applications, the [Microsoft HBase REST Client Library for .NET](https://www.nuget.org/packages/Microsoft.HBase.Client/) provides a client library on top of the HBase REST API.

## Install the SDK

The HBase .NET SDK is provided as a NuGet package, which can be installed from the Visual Studio **NuGet Package Manager Console** with the following command:

```console
Install-Package Microsoft.HBase.Client
```

## Instantiate a new HBaseClient object

To use the SDK, instantiate a new `HBaseClient` object, passing in `ClusterCredentials` composed of the `Uri` to your cluster, and the Hadoop user name and password.

```csharp
var credentials = new ClusterCredentials(new Uri("https://CLUSTERNAME.azurehdinsight.net"), "USERNAME", "PASSWORD");
client = new HBaseClient(credentials);
```

Replace CLUSTERNAME with your HDInsight HBase cluster name, and USERNAME and PASSWORD with the Apache Hadoop credentials specified on cluster creation. The default Hadoop user name is **admin**.

## Create a new table

HBase stores data in tables. A table consists of a *Rowkey*, the primary key, and one or more groups of columns called *column families*. The data in each table is horizontally distributed by a Rowkey range into *regions*. Each region has a start and end key. A table can have one or more regions. As the data in table grows, HBase splits large regions into smaller regions. Regions are stored in *region servers*, where one region server can store multiple regions.

The data is physically stored in *HFiles*. A single HFile contains data for one table, one region, and one column family. Rows in HFile are stored sorted on Rowkey. Each HFile has a *B+ Tree* index for speedy retrieval of the rows.

To create a new table, specify a `TableSchema` and columns. The following code checks whether the table `RestSDKTable` already exists - if not, the table is created.

```csharp
if (!client.ListTablesAsync().Result.name.Contains("RestSDKTable"))
{
    // Create the table
    var newTableSchema = new TableSchema {name = "RestSDKTable" };
    newTableSchema.columns.Add(new ColumnSchema() {name = "t1"});
    newTableSchema.columns.Add(new ColumnSchema() {name = "t2"});

    await client.CreateTableAsync(newTableSchema);
}
```

This new table has two-column families, t1 and t2. Since column families are stored separately in different HFiles, it makes sense to have a separate column family for frequently queried data. In the following [Insert data](#insert-data) example, columns are added to the t1 column family.

## Delete a table

To delete a table:

```csharp
await client.DeleteTableAsync("RestSDKTable");
```

## Insert data

To insert data, you specify a unique row key as the row identifier. All data is stored in a `byte[]` array. The following code defines and adds the `title`, `director`, and `release_date` columns to the t1 column family, as these columns are the most frequently accessed. The `description` and `tagline` columns are added to the t2 column family. You can partition your data into column families as needed.

```csharp
var key = "fifth_element";
var row = new CellSet.Row { key = Encoding.UTF8.GetBytes(key) };
var value = new Cell
{
    column = Encoding.UTF8.GetBytes("t1:title"),
    data = Encoding.UTF8.GetBytes("The Fifth Element")
};
row.values.Add(value);
value = new Cell
{
    column = Encoding.UTF8.GetBytes("t1:director"),
    data = Encoding.UTF8.GetBytes("Luc Besson")
};
row.values.Add(value);
value = new Cell
{
    column = Encoding.UTF8.GetBytes("t1:release_date"),
    data = Encoding.UTF8.GetBytes("1997")
};
row.values.Add(value);
value = new Cell
{
    column = Encoding.UTF8.GetBytes("t2:description"),
    data = Encoding.UTF8.GetBytes("In the colorful future, a cab driver unwittingly becomes the central figure in the search for a legendary cosmic weapon to keep Evil and Mr Zorg at bay.")
};
row.values.Add(value);
value = new Cell
{
    column = Encoding.UTF8.GetBytes("t2:tagline"),
    data = Encoding.UTF8.GetBytes("The Fifth is life")
};
row.values.Add(value);

var set = new CellSet();
set.rows.Add(row);

await client.StoreCellsAsync("RestSDKTable", set);
```

HBase implements [Cloud BigTable](https://cloud.google.com/bigtable/), so the data format looks like the following image:

:::image type="content" source="./media/apache-hbase-rest-sdk/hdinsight-table-roles.png" alt-text="Apache HBase sample data output" border="true":::

## Select data

To read data from an HBase table, pass the table name and row key to the `GetCellsAsync` method to return the `CellSet`.

```csharp
var key = "fifth_element";

var cells = await client.GetCellsAsync("RestSDKTable", key);
// Get the first value from the row.
Console.WriteLine(Encoding.UTF8.GetString(cells.rows[0].values[0].data));
// Get the value for t1:title
Console.WriteLine(Encoding.UTF8.GetString(cells.rows[0].values
    .Find(c => Encoding.UTF8.GetString(c.column) == "t1:title").data));
// With the previous insert, it should yield: "The Fifth Element"
```

In this case, the code returns only the first matching row, as there should only be one row for a unique key. The returned value is changed into `string` format from the `byte[]` array. You can also convert the value to other types, such as an integer for the movie's release date:

```csharp
var releaseDateField = cells.rows[0].values
    .Find(c => Encoding.UTF8.GetString(c.column) == "t1:release_date");
int releaseDate = 0;

if (releaseDateField != null)
{
    releaseDate = Convert.ToInt32(Encoding.UTF8.GetString(releaseDateField.data));
}
Console.WriteLine(releaseDate);
// Should return 1997
```

## Scan over rows

HBase uses `scan` to retrieve one or more rows. This example requests multiple rows in batches of 10, and retrieves data whose key values are between 25 and 35. After retrieving all rows, delete the scanner to clean up resources.

```csharp
var tableName = "mytablename";

// Assume the table has integer keys and we want data between keys 25 and 35
var scanSettings = new Scanner()
{
	batch = 10,
	startRow = BitConverter.GetBytes(25),
	endRow = BitConverter.GetBytes(35)
};
RequestOptions scanOptions = RequestOptions.GetDefaultOptions();
scanOptions.AlternativeEndpoint = "hbaserest0/";
ScannerInformation scannerInfo = null;
try
{
    scannerInfo = await client.CreateScannerAsync(tableName, scanSettings, scanOptions);
    CellSet next = null;
    while ((next = client.ScannerGetNextAsync(scannerInfo, scanOptions).Result) != null)
    {
	    foreach (var row in next.rows)
        {
            // ... read the rows
        }
    }
}
finally
{
    if (scannerInfo != null)
    {
        await client.DeleteScannerAsync(tableName, scannerInfo, scanOptions);
    }
}
```

## Next steps

* [Get started with an Apache HBase example in HDInsight](apache-hbase-tutorial-get-started-linux.md)
* Build an end-to-end application with [Analyze real-time Twitter sentiment with Apache HBase](./apache-hbase-tutorial-get-started-linux.md)
