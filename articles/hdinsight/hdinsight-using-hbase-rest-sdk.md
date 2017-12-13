---
title: Using the HBase REST SDK - Azure HDInsight | Microsoft Docs
description: 
services: hdinsight
documentationcenter: ''
tags: azure-portal
author: ashishthaps
manager: jhubbard
editor: cgronlun

ms.assetid: 
ms.service: hdinsight
ms.custom: hdinsightactive
ms.workload: big-data
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 12/13/2017
ms.author: ashishth
---
# Using the HBase REST SDK

When you use [HBase](hdinsight-hbase-overview.md) as your massively scalable NoSQL database, you are given two primary choices to work with your data: [Hive queries and calls to HBase's RESTful API](hdinsight-hbase-tutorial-get-started-linux.md). A common way to work with the REST API is through the use of `curl`, or similar.

If your developers are more familiar with `C#`, with .NET as the platform of choice, the [Microsoft HBase REST Client Library for .NET](https://www.nuget.org/packages/Microsoft.HBase.Client/) provides a client library on top of the HBase REST API, and is available as a NuGet package to quickly get started.

## Installing the SDK

The HBase .NET SDK is provided as a NuGet package, which can be installed from the Visual Studio **NuGet Package Manager Console** with the following command:

    Install-Package Microsoft.HBase.Client


## Instantiating a new HBaseClient object

To begin using the library, you must instantiate a new `HBaseClient` object, passing in `ClusterCredentials` composed of the `Uri` to your cluster, the Hadoop user name and password.

```c#
var credentials = new ClusterCredentials(new Uri("https://CLUSTERNAME.azurehdinsight.net"), "USERNAME", "PASSWORD");
client = new HBaseClient(credentials);
```

Replace CLUSTERNAME with your HDInsight HBase cluster name, and USERNAME and PASSWORD with the Hadoop credentials specified on cluster creation. The default Hadoop user name is **admin**.

## Create a new table

HBase, like any other RDBMS, stores data in tables. A table consists of a `Rowkey`, the primary key and one or more group of columns known as **Column families**. The data in table is horizontally distributed by `Rowkey` range into **Regions**. Each region has a start and end key. A table can have one or more regions. As the data in table grows, HBase splits large regions into smaller regions. Regions are stored in **Region Servers**. One region server can store multiple regions.

The data is physically stored in **HFiles**. A single HFile contains data for one table, one region and one column family. Rows in HFile are stored sorted on Rowkey. HFile has a B+ Tree index for speedy retrieval of the rows.

To create a new table, you specify a `TableSchema` and columns. In the code below, we are first checking for the existence of the table prior to creating it.

```c#
if (!client.ListTablesAsync().Result.name.Contains("RestSDKTable"))
{
    // Create the table
    var newTableSchema = new TableSchema {name = "RestSDKTable" };
    newTableSchema.columns.Add(new ColumnSchema() {name = "t1"});
    newTableSchema.columns.Add(new ColumnSchema() {name = "t2"});

    await client.CreateTableAsync(newTableSchema);
}
```

We created a new table named "RestSDKTable" with two column families, t1 and t2. As discussed above, column families are stored separately in different HFiles, thus it makes sense to have a separate column family for data which is queried often. For example, we'll add columns to the t1 column family that we'll query often.

## Delete a table

Deleting a table is as simple as this:

```c#
await client.DeleteTableAsync("RestSDKTable");
```

## Inserting data

When you insert data, you must specify a unique row key. This serves as the Id for the row. All of the data is stored in a `byte[]` array. You'll notice that we are storing the `title`, `director`, and `release_date` columns within the t1 column family, and `description` and `tagline` within the t2 column family. This is because we tend to query the t1 column family more often. You may partition your data into column families however you see fit.

```c#
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

HBase implements BigTable. Thus, the format from our data above will look like:

![User with Cluster User role](./media/hdinsight-using-hbase-rest-sdk/table.png)


## Selecting data

To read data from the HBase table, pass the table name and row key to the `GetCellsAsync` method to return the `CellSet`.

```c#
var key = "fifth_element";

var cells = await client.GetCellsAsync("RestSDKTable", key);
// Get the first value from the row.
Console.WriteLine(Encoding.UTF8.GetString(cells.rows[0].values[0].data));
// Get the value for t1:title
Console.WriteLine(Encoding.UTF8.GetString(cells.rows[0].values
    .Find(c => Encoding.UTF8.GetString(c.column) == "t1:title").data));
// With the previous insert, it should yield: "The Fifth Element"
```

In this case, we're just returning the first matching row (there should only be one when using a unique key), then converting the returned values into `string` format from the `byte[]` array. You may also convert the values to other types, such as an integer for our movie's release date:

```c#
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

## Scanning over rows

HBase uses `scan` to retrieve one or more rows. In this example, we're requesting multiple rows in batches of 10, and retrieving data whose key values are between 25 and 35. After retrieving our rows, we delete the scanner to clean up resources.

```c#
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

In this article, we learned how to use the HBase .NET SDK to work with the HBase REST API. Learn more about HBase and other tools to work with its data by following the links below.

* [Get started with an Apache HBase example in HDInsight](hdinsight-hbase-tutorial-get-started-linux.md)
* Build an end-to-end application with [Analyze real-time Twitter sentiment with HBase](../hdinsight-hbase-analyze-twitter-sentiment.md)
