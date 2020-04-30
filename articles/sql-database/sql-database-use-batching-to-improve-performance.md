---
title: How to use batching to improve application performance
description: The topic provides evidence that batching database operations greatly improves the speed and scalability of your Azure SQL Database applications. Although these batching techniques work for any SQL Server database, the focus of the article is on Azure.
services: sql-database
ms.service: sql-database
ms.subservice: development
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: stevestein
ms.author: sstein
ms.reviewer: genemi
ms.date: 01/25/2019
---
# How to use batching to improve SQL Database application performance

Batching operations to Azure SQL Database significantly improves the performance and scalability of your applications. In order to understand the benefits, the first part of this article covers some sample test results that compare sequential and batched requests to a SQL Database. The remainder of the article shows the techniques, scenarios, and considerations to help you to use batching successfully in your Azure applications.

## Why is batching important for SQL Database

Batching calls to a remote service is a well-known strategy for increasing performance and scalability. There are fixed processing costs to any interactions with a remote service, such as serialization, network transfer, and deserialization. Packaging many separate transactions into a single batch minimizes these costs.

In this paper, we want to examine various SQL Database batching strategies and scenarios. Although these strategies are also important for on-premises applications that use SQL Server, there are several reasons for highlighting the use of batching for SQL Database:

* There is potentially greater network latency in accessing SQL Database, especially if you are accessing SQL Database from outside the same Microsoft Azure datacenter.
* The multitenant characteristics of SQL Database means that the efficiency of the data access layer correlates to the overall scalability of the database. SQL Database must prevent any single tenant/user from monopolizing database resources to the detriment of other tenants. In response to usage in excess of predefined quotas, SQL Database can reduce throughput or respond with throttling exceptions. Efficiencies, such as batching, enable you to do more work on SQL Database before reaching these limits. 
* Batching is also effective for architectures that use multiple databases (sharding). The efficiency of your interaction with each database unit is still a key factor in your overall scalability. 

One of the benefits of using SQL Database is that you don’t have to manage the servers that host the database. However, this managed infrastructure also means that you have to think differently about database optimizations. You can no longer look to improve the database hardware or network infrastructure. Microsoft Azure controls those environments. The main area that you can control is how your application interacts with SQL Database. Batching is one of these optimizations. 

The first part of the paper examines various batching techniques for .NET applications that use SQL Database. The last two sections cover batching guidelines and scenarios.

## Batching strategies

### Note about timing results in this article

> [!NOTE]
> Results are not benchmarks but are meant to show **relative performance**. Timings are based on an average of at least 10 test runs. Operations are inserts into an empty table. These tests were measured pre-V12, and they do not necessarily correspond to throughput that you might experience in a V12 database using the new [DTU service tiers](sql-database-service-tiers-dtu.md) or [vCore service tiers](sql-database-service-tiers-vcore.md). The relative benefit of the batching technique should be similar.

### Transactions

It seems strange to begin a review of batching by discussing transactions. But the use of client-side transactions has a subtle server-side batching effect that improves performance. And transactions can be added with only a few lines of code, so they provide a fast way to improve performance of sequential operations.

Consider the following C# code that contains a sequence of insert and update operations on a simple table.

```csharp
List<string> dbOperations = new List<string>();
dbOperations.Add("update MyTable set mytext = 'updated text' where id = 1");
dbOperations.Add("update MyTable set mytext = 'updated text' where id = 2");
dbOperations.Add("update MyTable set mytext = 'updated text' where id = 3");
dbOperations.Add("insert MyTable values ('new value',1)");
dbOperations.Add("insert MyTable values ('new value',2)");
dbOperations.Add("insert MyTable values ('new value',3)");
```
The following ADO.NET code sequentially performs these operations.

```csharp
using (SqlConnection connection = new SqlConnection(CloudConfigurationManager.GetSetting("Sql.ConnectionString")))
{
    conn.Open();

    foreach(string commandString in dbOperations)
    {
        SqlCommand cmd = new SqlCommand(commandString, conn);
        cmd.ExecuteNonQuery();
    }
}
```

The best way to optimize this code is to implement some form of client-side batching of these calls. But there is a simple way to increase the performance of this code by simply wrapping the sequence of calls in a transaction. Here is the same code that uses a transaction.

```csharp
using (SqlConnection connection = new SqlConnection(CloudConfigurationManager.GetSetting("Sql.ConnectionString")))
{
    conn.Open();
    SqlTransaction transaction = conn.BeginTransaction();

    foreach (string commandString in dbOperations)
    {
        SqlCommand cmd = new SqlCommand(commandString, conn, transaction);
        cmd.ExecuteNonQuery();
    }

    transaction.Commit();
}
```

Transactions are actually being used in both of these examples. In the first example, each individual call is an implicit transaction. In the second example, an explicit transaction wraps all of the calls. Per the documentation for the [write-ahead transaction log](https://docs.microsoft.com/sql/relational-databases/sql-server-transaction-log-architecture-and-management-guide?view=sql-server-ver15#WAL), log records are flushed to the disk when the transaction commits. So by including more calls in a transaction, the write to the transaction log can delay until the transaction is committed. In effect, you are enabling batching for the writes to the server’s transaction log.

The following table shows some ad hoc testing results. The tests performed the same sequential inserts with and without transactions. For more perspective, the first set of tests ran remotely from a laptop to the database in Microsoft Azure. The second set of tests ran from a cloud service and database that both resided within the same Microsoft Azure datacenter (West US). The following table shows the duration in milliseconds of sequential inserts with and without transactions.

**On-Premises to Azure**:

| Operations | No Transaction (ms) | Transaction (ms) |
| --- | --- | --- |
| 1 |130 |402 |
| 10 |1208 |1226 |
| 100 |12662 |10395 |
| 1000 |128852 |102917 |

**Azure to Azure (same datacenter)**:

| Operations | No Transaction (ms) | Transaction (ms) |
| --- | --- | --- |
| 1 |21 |26 |
| 10 |220 |56 |
| 100 |2145 |341 |
| 1000 |21479 |2756 |

> [!NOTE]
> Results are not benchmarks. See the [note about timing results in this article](#note-about-timing-results-in-this-article).

Based on the previous test results, wrapping a single operation in a transaction actually decreases performance. But as you increase the number of operations within a single transaction, the performance improvement becomes more marked. The performance difference is also more noticeable when all operations occur within the Microsoft Azure datacenter. The increased latency of using SQL Database from outside the Microsoft Azure datacenter overshadows the performance gain of using transactions.

Although the use of transactions can increase performance, continue to [observe best practices for transactions and connections](https://msdn.microsoft.com/library/ms187484.aspx). Keep the transaction as short as possible, and close the database connection after the work completes. The using statement in the previous example assures that the connection is closed when the subsequent code block completes.

The previous example demonstrates that you can add a local transaction to any ADO.NET code with two lines. Transactions offer a quick way to improve the performance of code that makes sequential insert, update, and delete operations. However, for the fastest performance, consider changing the code further to take advantage of client-side batching, such as table-valued parameters.

For more information about transactions in ADO.NET, see [Local Transactions in ADO.NET](https://docs.microsoft.com/dotnet/framework/data/adonet/local-transactions).

### Table-valued parameters

Table-valued parameters support user-defined table types as parameters in Transact-SQL statements, stored procedures, and functions. This client-side batching technique allows you to send multiple rows of data within the table-valued parameter. To use table-valued parameters, first define a table type. The following Transact-SQL statement creates a table type named **MyTableType**.

```sql
    CREATE TYPE MyTableType AS TABLE 
    ( mytext TEXT,
      num INT );
```

In code, you create a **DataTable** with the exact same names and types of the table type. Pass this **DataTable** in a parameter in a text query or stored procedure call. The following example shows this technique:

```csharp
using (SqlConnection connection = new SqlConnection(CloudConfigurationManager.GetSetting("Sql.ConnectionString")))
{
    connection.Open();

    DataTable table = new DataTable();
    // Add columns and rows. The following is a simple example.
    table.Columns.Add("mytext", typeof(string));
    table.Columns.Add("num", typeof(int));
    for (var i = 0; i < 10; i++)
    {
        table.Rows.Add(DateTime.Now.ToString(), DateTime.Now.Millisecond);
    }

    SqlCommand cmd = new SqlCommand(
        "INSERT INTO MyTable(mytext, num) SELECT mytext, num FROM @TestTvp",
        connection);

    cmd.Parameters.Add(
        new SqlParameter()
        {
            ParameterName = "@TestTvp",
            SqlDbType = SqlDbType.Structured,
            TypeName = "MyTableType",
            Value = table,
        });

    cmd.ExecuteNonQuery();
}
```

In the previous example, the **SqlCommand** object inserts rows from a table-valued parameter, **\@TestTvp**. The previously created **DataTable** object is assigned to this parameter with the **SqlCommand.Parameters.Add** method. Batching the inserts in one call significantly increases the performance over sequential inserts.

To improve the previous example further, use a stored procedure instead of a text-based command. The following Transact-SQL command creates a stored procedure that takes the **SimpleTestTableType** table-valued parameter.

```sql
CREATE PROCEDURE [dbo].[sp_InsertRows] 
@TestTvp as MyTableType READONLY
AS
BEGIN
INSERT INTO MyTable(mytext, num) 
SELECT mytext, num FROM @TestTvp
END
GO
```

Then change the **SqlCommand** object declaration in the previous code example to the following.

```csharp
SqlCommand cmd = new SqlCommand("sp_InsertRows", connection);
cmd.CommandType = CommandType.StoredProcedure;
```

In most cases, table-valued parameters have equivalent or better performance than other batching techniques. Table-valued parameters are often preferable, because they are more flexible than other options. For example, other techniques, such as SQL bulk copy, only permit the insertion of new rows. But with table-valued parameters, you can use logic in the stored procedure to determine which rows are updates and which are inserts. The table type can also be modified to contain an “Operation” column that indicates whether the specified row should be inserted, updated, or deleted.

The following table shows ad hoc test results for the use of table-valued parameters in milliseconds.

| Operations | On-Premises to Azure (ms) | Azure same datacenter (ms) |
| --- | --- | --- |
| 1 |124 |32 |
| 10 |131 |25 |
| 100 |338 |51 |
| 1000 |2615 |382 |
| 10000 |23830 |3586 |

> [!NOTE]
> Results are not benchmarks. See the [note about timing results in this article](#note-about-timing-results-in-this-article).
> 
> 

The performance gain from batching is immediately apparent. In the previous sequential test, 1000 operations took 129 seconds outside the datacenter and 21 seconds from within the datacenter. But with table-valued parameters, 1000 operations take only 2.6 seconds outside the datacenter and 0.4 seconds within the datacenter.

For more information on table-valued parameters, see [Table-Valued Parameters](https://msdn.microsoft.com/library/bb510489.aspx).

### SQL bulk copy

SQL bulk copy is another way to insert large amounts of data into a target database. .NET applications can use the **SqlBulkCopy** class to perform bulk insert operations. **SqlBulkCopy** is similar in function to the command-line tool, **Bcp.exe**, or the Transact-SQL statement, **BULK INSERT**. The following code example shows how to bulk copy the rows in the source **DataTable**, table, to the destination table in SQL Server, MyTable.

```csharp
using (SqlConnection connection = new SqlConnection(CloudConfigurationManager.GetSetting("Sql.ConnectionString")))
{
    connection.Open();

    using (SqlBulkCopy bulkCopy = new SqlBulkCopy(connection))
    {
        bulkCopy.DestinationTableName = "MyTable";
        bulkCopy.ColumnMappings.Add("mytext", "mytext");
        bulkCopy.ColumnMappings.Add("num", "num");
        bulkCopy.WriteToServer(table);
    }
}
```

There are some cases where bulk copy is preferred over table-valued parameters. See the comparison table of Table-Valued parameters versus BULK INSERT operations in the article [Table-Valued Parameters](https://msdn.microsoft.com/library/bb510489.aspx).

The following ad hoc test results show the performance of batching with **SqlBulkCopy** in milliseconds.

| Operations | On-Premises to Azure (ms) | Azure same datacenter (ms) |
| --- | --- | --- |
| 1 |433 |57 |
| 10 |441 |32 |
| 100 |636 |53 |
| 1000 |2535 |341 |
| 10000 |21605 |2737 |

> [!NOTE]
> Results are not benchmarks. See the [note about timing results in this article](#note-about-timing-results-in-this-article).
> 
> 

In smaller batch sizes, the use table-valued parameters outperformed the **SqlBulkCopy** class. However, **SqlBulkCopy** performed 12-31% faster than table-valued parameters for the tests of 1,000 and 10,000 rows. Like table-valued parameters, **SqlBulkCopy** is a good option for batched inserts, especially when compared to the performance of non-batched operations.

For more information on bulk copy in ADO.NET, see [Bulk Copy Operations in SQL Server](https://msdn.microsoft.com/library/7ek5da1a.aspx).

### Multiple-row Parameterized INSERT statements

One alternative for small batches is to construct a large parameterized INSERT statement that inserts multiple rows. The following code example demonstrates this technique.

```csharp
using (SqlConnection connection = new SqlConnection(CloudConfigurationManager.GetSetting("Sql.ConnectionString")))
{
    connection.Open();

    string insertCommand = "INSERT INTO [MyTable] ( mytext, num ) " +
        "VALUES (@p1, @p2), (@p3, @p4), (@p5, @p6), (@p7, @p8), (@p9, @p10)";

    SqlCommand cmd = new SqlCommand(insertCommand, connection);

    for (int i = 1; i <= 10; i += 2)
    {
        cmd.Parameters.Add(new SqlParameter("@p" + i.ToString(), "test"));
        cmd.Parameters.Add(new SqlParameter("@p" + (i+1).ToString(), i));
    }

    cmd.ExecuteNonQuery();
}
```

This example is meant to show the basic concept. A more realistic scenario would loop through the required entities to construct the query string and the command parameters simultaneously. You are limited to a total of 2100 query parameters, so this limits the total number of rows that can be processed in this manner.

The following ad hoc test results show the performance of this type of insert statement in milliseconds.

| Operations | Table-valued parameters (ms) | Single-statement INSERT (ms) |
| --- | --- | --- |
| 1 |32 |20 |
| 10 |30 |25 |
| 100 |33 |51 |

> [!NOTE]
> Results are not benchmarks. See the [note about timing results in this article](#note-about-timing-results-in-this-article).
> 
> 

This approach can be slightly faster for batches that are less than 100 rows. Although the improvement is small, this technique is another option that might work well in your specific application scenario.

### DataAdapter

The **DataAdapter** class allows you to modify a **DataSet** object and then submit the changes as INSERT, UPDATE, and DELETE operations. If you are using the **DataAdapter** in this manner, it is important to note that separate calls are made for each distinct operation. To improve performance, use the **UpdateBatchSize** property to the number of operations that should be batched at a time. For more information, see [Performing Batch Operations Using DataAdapters](https://msdn.microsoft.com/library/aadf8fk2.aspx).

### Entity framework

Entity Framework does not currently support batching. Different developers in the community have attempted to demonstrate workarounds, such as override the **SaveChanges** method. But the solutions are typically complex and customized to the application and data model. The Entity Framework codeplex project currently has a discussion page on this feature request. To view this discussion, see [Design Meeting Notes - August 2, 2012](https://entityframework.codeplex.com/wikipage?title=Design%20Meeting%20Notes%20-%20August%202%2c%202012).

### XML

For completeness, we feel that it is important to talk about XML as a batching strategy. However, the use of XML has no advantages over other methods and several disadvantages. The approach is similar to table-valued parameters, but an XML file or string is passed to a stored procedure instead of a user-defined table. The stored procedure parses the commands in the stored procedure.

There are several disadvantages to this approach:

* Working with XML can be cumbersome and error prone.
* Parsing the XML on the database can be CPU-intensive.
* In most cases, this method is slower than table-valued parameters.

For these reasons, the use of XML for batch queries is not recommended.

## Batching considerations

The following sections provide more guidance for the use of batching in SQL Database applications.

### Tradeoffs

Depending on your architecture, batching can involve a tradeoff between performance and resiliency. For example, consider the scenario where your role unexpectedly goes down. If you lose one row of data, the impact is smaller than the impact of losing a large batch of unsubmitted rows. There is a greater risk when you buffer rows before sending them to the database in a specified time window.

Because of this tradeoff, evaluate the type of operations that you batch. Batch more aggressively (larger batches and longer time windows) with data that is less critical.

### Batch size

In our tests, there was typically no advantage to breaking large batches into smaller chunks. In fact, this subdivision often resulted in slower performance than submitting a single large batch. For example, consider a scenario where you want to insert 1000 rows. The following table shows how long it takes to use table-valued parameters to insert 1000 rows when divided into smaller batches.

| Batch size | Iterations | Table-valued parameters (ms) |
| --- | --- | --- |
| 1000 |1 |347 |
| 500 |2 |355 |
| 100 |10 |465 |
| 50 |20 |630 |

> [!NOTE]
> Results are not benchmarks. See the [note about timing results in this article](#note-about-timing-results-in-this-article).
> 
> 

You can see that the best performance for 1000 rows is to submit them all at once. In other tests (not shown here), there was a small performance gain to break a 10000 row batch into two batches of 5000. But the table schema for these tests is relatively simple, so you should perform tests on your specific data and batch sizes to verify these findings.

Another factor to consider is that if the total batch becomes too large, SQL Database might throttle and refuse to commit the batch. For the best results, test your specific scenario to determine if there is an ideal batch size. Make the batch size configurable at runtime to enable quick adjustments based on performance or errors.

Finally, balance the size of the batch with the risks associated with batching. If there are transient errors or the role fails, consider the consequences of retrying the operation or of losing the data in the batch.

### Parallel processing

What if you took the approach of reducing the batch size but used multiple threads to execute the work? Again, our tests showed that several smaller multithreaded batches typically performed worse than a single larger batch. The following test attempts to insert 1000 rows in one or more parallel batches. This test shows how more simultaneous batches actually decreased performance.

| Batch size [Iterations] | Two threads (ms) | Four threads (ms) | Six threads (ms) |
| --- | --- | --- | --- |
| 1000 [1] |277 |315 |266 |
| 500 [2] |548 |278 |256 |
| 250 [4] |405 |329 |265 |
| 100 [10] |488 |439 |391 |

> [!NOTE]
> Results are not benchmarks. See the [note about timing results in this article](#note-about-timing-results-in-this-article).
> 
> 

There are several potential reasons for the degradation in performance due to parallelism:

* There are multiple simultaneous network calls instead of one.
* Multiple operations against a single table can result in contention and blocking.
* There are overheads associated with multithreading.
* The expense of opening multiple connections outweighs the benefit of parallel processing.

If you target different tables or databases, it is possible to see some performance gain with this strategy. Database sharding or federations would be a scenario for this approach. Sharding uses multiple databases and routes different data to each database. If each small batch is going to a different database, then performing the operations in parallel can be more efficient. However, the performance gain is not significant enough to use as the basis for a decision to use database sharding in your solution.

In some designs, parallel execution of smaller batches can result in improved throughput of requests in a system under load. In this case, even though it is quicker to process a single larger batch, processing multiple batches in parallel might be more efficient.

If you do use parallel execution, consider controlling the maximum number of worker threads. A smaller number might result in less contention and a faster execution time. Also, consider the additional load that this places on the target database both in connections and transactions.

### Related performance factors

Typical guidance on database performance also affects batching. For example, insert performance is reduced for tables that have a large primary key or many nonclustered indexes.

If table-valued parameters use a stored procedure, you can use the command **SET NOCOUNT ON** at the beginning of the procedure. This statement suppresses the return of the count of the affected rows in the procedure. However, in our tests, the use of **SET NOCOUNT ON** either had no effect or decreased performance. The test stored procedure was simple with a single **INSERT** command from the table-valued parameter. It is possible that more complex stored procedures would benefit from this statement. But don’t assume that adding **SET NOCOUNT ON** to your stored procedure automatically improves performance. To understand the effect, test your stored procedure with and without the **SET NOCOUNT ON** statement.

## Batching scenarios

The following sections describe how to use table-valued parameters in three application scenarios. The first scenario shows how buffering and batching can work together. The second scenario improves performance by performing master-detail operations in a single stored procedure call. The final scenario shows how to use table-valued parameters in an “UPSERT” operation.

### Buffering

Although there are some scenarios that are obvious candidate for batching, there are many scenarios that could take advantage of batching by delayed processing. However, delayed processing also carries a greater risk that the data is lost in the event of an unexpected failure. It is important to understand this risk and consider the consequences.

For example, consider a web application that tracks the navigation history of each user. On each page request, the application could make a database call to record the user’s page view. But higher performance and scalability can be achieved by buffering the users’ navigation activities and then sending this data to the database in batches. You can trigger the database update by elapsed time and/or buffer size. For example, a rule could specify that the batch should be processed after 20 seconds or when the buffer reaches 1000 items.

The following code example uses [Reactive Extensions - Rx](https://msdn.microsoft.com/data/gg577609) to process buffered events raised by a monitoring class. When the buffer fills or a timeout is reached, the batch of user data is sent to the database with a table-valued parameter.

The following NavHistoryData class models the user navigation details. It contains basic information such as the user identifier, the URL accessed, and the access time.

```csharp
public class NavHistoryData
{
    public NavHistoryData(int userId, string url, DateTime accessTime)
    { UserId = userId; URL = url; AccessTime = accessTime; }
    public int UserId { get; set; }
    public string URL { get; set; }
    public DateTime AccessTime { get; set; }
}
```

The NavHistoryDataMonitor class is responsible for buffering the user navigation data to the database. It contains a method, RecordUserNavigationEntry, which responds by raising an **OnAdded** event. The following code shows the constructor logic that uses Rx to create an observable collection based on the event. It then subscribes to this observable collection with the Buffer method. The overload specifies that the buffer should be sent every 20 seconds or 1000 entries.

```csharp
public NavHistoryDataMonitor()
{
    var observableData =
        Observable.FromEventPattern<NavHistoryDataEventArgs>(this, "OnAdded");

    observableData.Buffer(TimeSpan.FromSeconds(20), 1000).Subscribe(Handler);
}
```

The handler converts all of the buffered items into a table-valued type and then passes this type to a stored procedure that processes the batch. The following code shows the complete definition for both the NavHistoryDataEventArgs and the NavHistoryDataMonitor classes.

```csharp
public class NavHistoryDataEventArgs : System.EventArgs
{
    public NavHistoryDataEventArgs(NavHistoryData data) { Data = data; }
    public NavHistoryData Data { get; set; }
}

public class NavHistoryDataMonitor
{
    public event EventHandler<NavHistoryDataEventArgs> OnAdded;

    public NavHistoryDataMonitor()
    {
        var observableData =
            Observable.FromEventPattern<NavHistoryDataEventArgs>(this, "OnAdded");

        observableData.Buffer(TimeSpan.FromSeconds(20), 1000).Subscribe(Handler);
    }
```

The handler converts all of the buffered items into a table-valued type and then passes this type to a stored procedure that processes the batch. The following code shows the complete definition for both the NavHistoryDataEventArgs and the NavHistoryDataMonitor classes.

```csharp
    public class NavHistoryDataEventArgs : System.EventArgs
    {
        if (OnAdded != null)
            OnAdded(this, new NavHistoryDataEventArgs(data));
    }

    protected void Handler(IList<EventPattern<NavHistoryDataEventArgs>> items)
    {
        DataTable navHistoryBatch = new DataTable("NavigationHistoryBatch");
        navHistoryBatch.Columns.Add("UserId", typeof(int));
        navHistoryBatch.Columns.Add("URL", typeof(string));
        navHistoryBatch.Columns.Add("AccessTime", typeof(DateTime));
        foreach (EventPattern<NavHistoryDataEventArgs> item in items)
        {
            NavHistoryData data = item.EventArgs.Data;
            navHistoryBatch.Rows.Add(data.UserId, data.URL, data.AccessTime);
        }

        using (SqlConnection connection = new SqlConnection(CloudConfigurationManager.GetSetting("Sql.ConnectionString")))
        {
            connection.Open();

            SqlCommand cmd = new SqlCommand("sp_RecordUserNavigation", connection);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.Add(
                new SqlParameter()
                {
                    ParameterName = "@NavHistoryBatch",
                    SqlDbType = SqlDbType.Structured,
                    TypeName = "NavigationHistoryTableType",
                    Value = navHistoryBatch,
                });

            cmd.ExecuteNonQuery();
        }
    }
}
```

To use this buffering class, the application creates a static NavHistoryDataMonitor object. Each time a user accesses a page, the application calls the NavHistoryDataMonitor.RecordUserNavigationEntry method. The buffering logic proceeds to take care of sending these entries to the database in batches.

### Master detail

Table-valued parameters are useful for simple INSERT scenarios. However, it can be more challenging to batch inserts that involve more than one table. The “master/detail” scenario is a good example. The master table identifies the primary entity. One or more detail tables store more data about the entity. In this scenario, foreign key relationships enforce the relationship of details to a unique master entity. Consider a simplified version of a PurchaseOrder table and its associated OrderDetail table. The following Transact-SQL creates the PurchaseOrder table with four columns: OrderID, OrderDate, CustomerID, and Status.

```sql
CREATE TABLE [dbo].[PurchaseOrder](
[OrderID] [int] IDENTITY(1,1) NOT NULL,
[OrderDate] [datetime] NOT NULL,
[CustomerID] [int] NOT NULL,
[Status] [nvarchar](50) NOT NULL,
CONSTRAINT [PrimaryKey_PurchaseOrder] 
PRIMARY KEY CLUSTERED ( [OrderID] ASC ))
```

Each order contains one or more product purchases. This information is captured in the PurchaseOrderDetail table. The following Transact-SQL creates the PurchaseOrderDetail table with five columns: OrderID, OrderDetailID, ProductID, UnitPrice, and OrderQty.

```sql
CREATE TABLE [dbo].[PurchaseOrderDetail](
[OrderID] [int] NOT NULL,
[OrderDetailID] [int] IDENTITY(1,1) NOT NULL,
[ProductID] [int] NOT NULL,
[UnitPrice] [money] NULL,
[OrderQty] [smallint] NULL,
CONSTRAINT [PrimaryKey_PurchaseOrderDetail] PRIMARY KEY CLUSTERED 
( [OrderID] ASC, [OrderDetailID] ASC ))
```

The OrderID column in the PurchaseOrderDetail table must reference an order from the PurchaseOrder table. The following definition of a foreign key enforces this constraint.

```sql
ALTER TABLE [dbo].[PurchaseOrderDetail]  WITH CHECK ADD 
CONSTRAINT [FK_OrderID_PurchaseOrder] FOREIGN KEY([OrderID])
REFERENCES [dbo].[PurchaseOrder] ([OrderID])
```

In order to use table-valued parameters, you must have one user-defined table type for each target table.

```sql
CREATE TYPE PurchaseOrderTableType AS TABLE 
( OrderID INT,
    OrderDate DATETIME,
    CustomerID INT,
    Status NVARCHAR(50) );
GO

CREATE TYPE PurchaseOrderDetailTableType AS TABLE 
( OrderID INT,
    ProductID INT,
    UnitPrice MONEY,
    OrderQty SMALLINT );
GO
```

Then define a stored procedure that accepts tables of these types. This procedure allows an application to locally batch a set of orders and order details in a single call. The following Transact-SQL provides the complete stored procedure declaration for this purchase order example.

```sql
CREATE PROCEDURE sp_InsertOrdersBatch (
@orders as PurchaseOrderTableType READONLY,
@details as PurchaseOrderDetailTableType READONLY )
AS
SET NOCOUNT ON;

-- Table that connects the order identifiers in the @orders
-- table with the actual order identifiers in the PurchaseOrder table
DECLARE @IdentityLink AS TABLE ( 
SubmittedKey int, 
ActualKey int, 
RowNumber int identity(1,1)
);

-- Add new orders to the PurchaseOrder table, storing the actual
-- order identifiers in the @IdentityLink table   
INSERT INTO PurchaseOrder ([OrderDate], [CustomerID], [Status])
OUTPUT inserted.OrderID INTO @IdentityLink (ActualKey)
SELECT [OrderDate], [CustomerID], [Status] FROM @orders ORDER BY OrderID;

-- Match the passed-in order identifiers with the actual identifiers
-- and complete the @IdentityLink table for use with inserting the details
WITH OrderedRows As (
SELECT OrderID, ROW_NUMBER () OVER (ORDER BY OrderID) As RowNumber 
FROM @orders
)
UPDATE @IdentityLink SET SubmittedKey = M.OrderID
FROM @IdentityLink L JOIN OrderedRows M ON L.RowNumber = M.RowNumber;

-- Insert the order details into the PurchaseOrderDetail table, 
-- using the actual order identifiers of the master table, PurchaseOrder
INSERT INTO PurchaseOrderDetail (
[OrderID],
[ProductID],
[UnitPrice],
[OrderQty] )
SELECT L.ActualKey, D.ProductID, D.UnitPrice, D.OrderQty
FROM @details D
JOIN @IdentityLink L ON L.SubmittedKey = D.OrderID;
GO
```

In this example, the locally defined @IdentityLink table stores the actual OrderID values from the newly inserted rows. These order identifiers are different from the temporary OrderID values in the @orders and @details table-valued parameters. For this reason, the @IdentityLink table then connects the OrderID values from the @orders parameter to the real OrderID values for the new rows in the PurchaseOrder table. After this step, the @IdentityLink table can facilitate inserting the order details with the actual OrderID that satisfies the foreign key constraint.

This stored procedure can be used from code or from other Transact-SQL calls. See the table-valued parameters section of this paper for a code example. The following Transact-SQL shows how to call the sp_InsertOrdersBatch.

```sql
declare @orders as PurchaseOrderTableType
declare @details as PurchaseOrderDetailTableType

INSERT @orders 
([OrderID], [OrderDate], [CustomerID], [Status])
VALUES(1, '1/1/2013', 1125, 'Complete'),
(2, '1/13/2013', 348, 'Processing'),
(3, '1/12/2013', 2504, 'Shipped')

INSERT @details
([OrderID], [ProductID], [UnitPrice], [OrderQty])
VALUES(1, 10, $11.50, 1),
(1, 12, $1.58, 1),
(2, 23, $2.57, 2),
(3, 4, $10.00, 1)

exec sp_InsertOrdersBatch @orders, @details
```

This solution allows each batch to use a set of OrderID values that begin at 1. These temporary OrderID values describe the relationships in the batch, but the actual OrderID values are determined at the time of the insert operation. You can run the same statements in the previous example repeatedly and generate unique orders in the database. For this reason, consider adding more code or database logic that prevents duplicate orders when using this batching technique.

This example demonstrates that even more complex database operations, such as master-detail operations, can be batched using table-valued parameters.

### UPSERT

Another batching scenario involves simultaneously updating existing rows and inserting new rows. This operation is sometimes referred to as an “UPSERT” (update + insert) operation. Rather than making separate calls to INSERT and UPDATE, the MERGE statement is best suited to this task. The MERGE statement can perform both insert and update operations in a single call.

Table-valued parameters can be used with the MERGE statement to perform updates and inserts. For example, consider a simplified Employee table that contains the following columns: EmployeeID, FirstName, LastName, SocialSecurityNumber:

```sql
CREATE TABLE [dbo].[Employee](
[EmployeeID] [int] IDENTITY(1,1) NOT NULL,
[FirstName] [nvarchar](50) NOT NULL,
[LastName] [nvarchar](50) NOT NULL,
[SocialSecurityNumber] [nvarchar](50) NOT NULL,
CONSTRAINT [PrimaryKey_Employee] PRIMARY KEY CLUSTERED 
([EmployeeID] ASC ))
```

In this example, you can use the fact that the SocialSecurityNumber is unique to perform a MERGE of multiple employees. First, create the user-defined table type:

```sql
CREATE TYPE EmployeeTableType AS TABLE 
( Employee_ID INT,
    FirstName NVARCHAR(50),
    LastName NVARCHAR(50),
    SocialSecurityNumber NVARCHAR(50) );
GO
```

Next, create a stored procedure or write code that uses the MERGE statement to perform the update and insert. The following example uses the MERGE statement on a table-valued parameter, @employees, of type EmployeeTableType. The contents of the @employees table are not shown here.

```sql
MERGE Employee AS target
USING (SELECT [FirstName], [LastName], [SocialSecurityNumber] FROM @employees) 
AS source ([FirstName], [LastName], [SocialSecurityNumber])
ON (target.[SocialSecurityNumber] = source.[SocialSecurityNumber])
WHEN MATCHED THEN 
UPDATE SET
target.FirstName = source.FirstName, 
target.LastName = source.LastName
WHEN NOT MATCHED THEN
    INSERT ([FirstName], [LastName], [SocialSecurityNumber])
    VALUES (source.[FirstName], source.[LastName], source.[SocialSecurityNumber]);
```

For more information, see the documentation and examples for the MERGE statement. Although the same work could be performed in a multiple-step stored procedure call with separate INSERT and UPDATE operations, the MERGE statement is more efficient. Database code can also construct Transact-SQL calls that use the MERGE statement directly without requiring two database calls for INSERT and UPDATE.

## Recommendation summary

The following list provides a summary of the batching recommendations discussed in this article:

* Use buffering and batching to increase the performance and scalability of SQL Database applications.
* Understand the tradeoffs between batching/buffering and resiliency. During a role failure, the risk of losing an unprocessed batch of business-critical data might outweigh the performance benefit of batching.
* Attempt to keep all calls to the database within a single datacenter to reduce latency.
* If you choose a single batching technique, table-valued parameters offer the best performance and flexibility.
* For the fastest insert performance, follow these general guidelines but test your scenario:
  * For < 100 rows, use a single parameterized INSERT command.
  * For < 1000 rows, use table-valued parameters.
  * For >= 1000 rows, use SqlBulkCopy.
* For update and delete operations, use table-valued parameters with stored procedure logic that determines the correct operation on each row in the table parameter.
* Batch size guidelines:
  * Use the largest batch sizes that make sense for your application and business requirements.
  * Balance the performance gain of large batches with the risks of temporary or catastrophic failures. What is the consequence of retries or loss of the data in the batch? 
  * Test the largest batch size to verify that SQL Database does not reject it.
  * Create configuration settings that control batching, such as the batch size or the buffering time window. These settings provide flexibility. You can change the batching behavior in production without redeploying the cloud service.
* Avoid parallel execution of batches that operate on a single table in one database. If you do choose to divide a single batch across multiple worker threads, run tests to determine the ideal number of threads. After an unspecified threshold, more threads will decrease performance rather than increase it.
* Consider buffering on size and time as a way of implementing batching for more scenarios.

## Next steps

This article focused on how database design and coding techniques related to batching can improve your application performance and scalability. But this is just one factor in your overall strategy. For more ways to improve performance and scalability, see [Azure SQL Database performance guidance for single databases](sql-database-performance-guidance.md) and [Price and performance considerations for an elastic pool](sql-database-elastic-pool-guidance.md).

