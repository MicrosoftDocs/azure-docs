<properties linkid="mobile-services-sql-scale-guidance" urlDisplayName="Scale mobile services backed by Azure SQL Database" pageTitle="Scale mobile services backed by Azure SQL Database - Azure Mobile Services" metaKeywords="" description="Learn how to diagnose and fix scalability issues in your mobile services backed by SQL Database" metaCanonical="" services="" documentationCenter="Mobile" title="Scale mobile services backed by Azure SQL Database" authors="yavorg" solutions="" manager="" editor="mollybos" />
  
# Scale mobile services backed by Azure SQL Database

Azure Mobile Services makes it very easy to get started and build an app that connects to a cloud-hosted backend that stores data in a SQL database. As your app grows, scaling your service instances is as simple as adjusting scale settings in the portal to add more computational and networking capacity. However, scaling the SQL database backing your service requires some proactive planning and monitoring as the service receives more load. This document will walk you through a set of best practices to ensure continued great performance of your SQL-backed mobile services.

This topic walks you through these basic sections:

1. [Diagnosing Problems](#Diagnosing)
2. [Indexing](#Indexing)
3. [Schema Design](#Schema)
4. [Query Design](#Query)
5. [Choosing the Right SQL Database Tier](#SQLTiers)
6. [Advanced Diagnostics](#Advanced)

<a name="Diagnosing"></a>
# Diagnosing Problems

<a name="Indexing"></a>
## Indexing

When you start to see problems with your query performance, the first thing you should investigate is the design of your indexes. Indexes are important because they directly affect how the SQL engine executes a query. 

For instance, if you often need to look up an element by ID, you should consider adding an index for that column. Otherwise, the SQL engine will be forced to perform a table scan and read each physical record (or at least the query column) and the records could be substantially spread out on disk.

So, if you are frequently doing SELECT or JOIN statements on particular columns, you should make sure you index them. See the section [Creating Indexes](#CreatingIndexes) for more information.

If indexes are so great and table scans are so bad, does that mean you should index every column in your table, just to be safe?  The short answer is, "probably not.  Indexes take up space and have overhead themselves: every time there is an insert in a table, the index structures for each of the indexed columns need to be updated. See below for guidelines on how to choose your column indexes.

### Index Design Guidelines

As mentioned above, it's not always better to add more indexes to a table, because indexes themselves can be costly, both in terms of performance and storage overhead.

#### Query considerations

* Consider adding indexes to columns that are frequently used in predicates (e.g., WHERE clauses) and join conditions, while balancing the database considerations below.
* Write queries that insert or modify as many rows as possible in a single statement, instead of using multiple queries to update the same rows. When there is only one statement, the database engine can better optimize how it maintains indexes.
	
#### Database considerations

Large numbers of indexes on a table affect the performance of INSERT, UPDATE, DELETE, and MERGE statements because all indexes must be adjusted appropriately as data in the table changes.

- For **heavily updated** tables, avoid indexing a large number of columns. For composite indexes, use as few columns as possible.

- For tables that are **not frequently updated** but that have large volumes of data, use many indexes. This can improve the performance of queries that do not modify data (such as SELECT statements) because the query optimizer will have more options for finding the best access method.

Indexing small tables may not be optimal because it can take the query optimizer longer to traverse the index searching for data than to perform a simple table scan. Therefore, indexes on small tables might never be used, but must still be maintained as data in the table changes.


<a name="CreatingIndexes"></a>
### Creating Indexes

#### JavaScript backend

To set the index for a column in the JavaScript backend, do the following:

1. Open your mobile service in the Azure management portal.
2. Click the **Data** tab.
3. Select the table you want to modify.
4. Click the **Columns** tab.
5. Select the column. In the command bar, click **Set Index**:

	![Mobile Services Portal - Set Index][SetIndexJavaScriptPortal]

You can also remove indexes within this view.

#### .NET backend

To define an index in Entity Framework, use the attribute `[Index]` on the fields that you want to index. For example:

		public class Post 
		{ 
		    public int Id { get; set; } 
		    public string Title { get; set; } 
		    public string Content { get; set; } 
		    [Index] 
		    public int Rating { get; set; } 
		    public int BlogId { get; set; } 
		}
		 
For more information, see [Index Annotations in Entity Framework][].

<a name="Schema"></a>
## Schema Design

<a name="Query"></a>
## Query Design

<a name="SQLTiers"></a>
## Choosing the Right SQL Database Tier 

<a name="Advanced"></a>
## Advanced Diagnostics
This section covers some more advanced diagnostic tasks, which may be useful if the steps so far have not addressed the issue fully.

### Prerequisites
To perform some of the diagnostic tasks in this section, you need access to a management tool for SQL databases such as **SQL Server Management Studio** or the management functionality built into the **Azure Management Portal**.

SQL Server Management Studio is a free Windows application, which offers the most advanced capabilities. If you do not have access to a Windows machine, consider provisioning a Virtual Machine in Azure as shown in [Create a Virtual Machine Running Windows Server](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-windows-tutorial/). If you intend to use the VM primarily for the purpose of running SQL Server Management Studio, a **Basic A0** (formerly "Extra Small") instance should be sufficient. 

The Azure Management Portal offers a built-in management experience, which is more limited, but is available without a local install.

The the following steps walk you through obtaining the connection information for the SQL database backing your mobile service and then using either of the two tools to connect to it. You may pick whichever tool you prefer.

#### Obtain SQL Connection Information 
1. Launch the [Azure Management Portal](http://manage.windowsazure.com).
2. On the Mobile Services tab, select the service you want to work with.
3. Select the **Configure** tab.
4. Select the **SQL Database** name in the **Database Settings** section. This will navigate to the Azure SQL Database tab in the portal.
5. Select **Set up Windows Azure firewall rules for this IP address**/
6. Make a note of the server address in the **Connect to your database** section, for example: *mcml4otbb9.database.windows.net*.

#### SQL Server Management Studio
1. Navigate to [SQL Server Editions - Express](http://www.microsoft.com/en-us/server-cloud/products/sql-server-editions/sql-server-express.aspx)
2. Find the **SQL Server Management Studio** section and select the **Download** button underneath.
3. Complete the setup steps until you can successfully run the application:

    ![SQL Server Management Studio][SSMS]

4. In the **Connect to Server** dialog enter the following values
    - Server name: *server address you obtained earlier*
    - Authentication: *SQL Server Authentication*
    - Login: *login you picked when creating server*
    - Password: *password you picked when creating server*
5. You should now be connected.

#### Azure Management Portal
1. On Azure SQL Database tab for your database, select the **Manage** button 
2. Configure the connection with the following values
    - Server: *should be pre-set to the right value*
    - Database: *leave blank*
    - Username: *login you picked when creating server*
    - Password: *password you picked when creating server*
3. You should now be connected.

    ![Azure Management Portal - SQL Database][PortalSqlManagement]

### Advanced Indexing

A table or view can contain the following types of indexes:

- **Clustered**. A clustered index specifies how records are physically stored on disk. There must be only one clustered index per table, because the data rows themselves can be sorted in only one order.

- **Nonclustered**. Nonclustered indexes are stored separately from data rows and are used to do a lookup based on the index value. All nonclustered indexes on a table use the key values from the clustered index as lookup key.

To provide a real-world analogy: consider a book or a technical manual. The contents of each page are a record, the page number is the clustered index, and the topic index in the back of the book is a nonclustered index. Each entry in the topic index points to the clustered index, the page number.

> [WACOM.NOTE] 
> By default, the JavaScript backend of Azure Mobile Services sets **\_createdAt** as the clustered index. If you remove this column, or if you want a different clustered index, be sure to follow the [clustered index design guidelines](#ClusteredIndexes) below. In the .NET backend, the class `TableData` defines `CreatedAt` as a clustered index using the annotation `[Index(IsClustered = true)]`

<a name="ClusteredIndexes"></a>
### Clustered index design guidelines

Every table should have a clustered index on the column (or columns, in the case of a composite key) with the following properties:

- Narrow - uses a small datatype, or is a [composite key][Primary and Foreign Key Constraints] of a small number of narrow columns
- Unique, or mostly unique
- Static - value is not frequently changed
- Ever-increasing 
- (Optional) Fixed-width
- (Optional) nonnull

The reason for the **narrow** property is that all other indexes on a table use the key values from the clustered index as lookup keys. In the example of a topic index at the back of a book, the clustered index is a page number and is a small number. If the chapter title were instead included in the clustered index, then the topic index would itself be much longer, because the key value would then be (chapter name, page number).

The key should be **static** and **ever-increasing** to avoid having to maintain the physical location of the records (which means either moving records physically, or potentially fragmenting storage by splitting the pages where the records are stored). 

#### Query considerations for clustered indexes

The clustered index will be most valuable for queries that do the following:

- Return a range of values by using operators such as BETWEEN, >, >=, <, and <=. 
	- After the row with the first value is found by using the clustered index, rows with subsequent indexed values are guaranteed to be physically adjacent. 
- Use JOIN clauses; typically these are foreign key columns.
- Use ORDER BY, or GROUP BY clauses.
	- An index on the columns specified in the ORDER BY or GROUP BY clause may remove the need for the Database Engine to sort the data, because the rows are already sorted. This improves query performance.

### Defining indexes and constraints 

To set the clustered index in the .NET backend using Entity Framework, set the `IsClustered` property of the annotation. For example, this is the definition of `CreatedAt` in `Microsoft.WindowsAzure.Mobile.Service.EntityData`:

        [Index(IsClustered = true)]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [TableColumnAttribute(TableColumnType.CreatedAt)]
        public DateTimeOffset? CreatedAt { get; set; }


The following guides describe how to set a clustered or nonclustered index by modifying the database schema directly:  

- [Creating and Modifying PRIMARY KEY Constraints][]
- [Create Nonclustered Indexes][]
- [Create Clustered Indexes][]
- [Create Unique Indexes][]


### Advanced Database Views



## See Also

### Indexing

- [Index Basics][]
- [General Index Design Guidelines][]
- [Unique Index Design Guidelines][]
- [Clustered Index Design Guidelines][]
- [Primary and Foreign Key Constraints][]
- [How much does that key cost?][]

### Entity Framework
- [Performance Considerations for Entity Framework 5][]

<!-- IMAGES -->
 
[SSMS]: ./media/mobile-services-sql-scale-guidance/1.png
[PortalSqlManagement]: ./media/mobile-services-sql-scale-guidance/2.png
[SetIndexJavaScriptPortal]: ./media/mobile-services-sql-scale-guidance\set-index-portal-ui.png
 
<!-- LINKS -->

<!-- MSDN -->
[Creating and Modifying PRIMARY KEY Constraints]: http://technet.microsoft.com/en-us/library/ms181043(v=sql.105).aspx
[Create Clustered Indexes]: http://technet.microsoft.com/en-us/library/ms186342(v=sql.120).aspx
[Create Unique Indexes]: http://technet.microsoft.com/en-us/library/ms187019.aspx
[Create Nonclustered Indexes]: http://technet.microsoft.com/en-us/library/ms189280.aspx

[Primary and Foreign Key Constraints]: http://msdn.microsoft.com/en-us/library/ms179610(v=sql.120).aspx
[Index Basics]: http://technet.microsoft.com/en-us/library/ms190457(v=sql.105).aspx
[General Index Design Guidelines]: http://technet.microsoft.com/en-us/library/ms191195(v=sql.105).aspx 
[Unique Index Design Guidelines]: http://technet.microsoft.com/en-us/library/ms187019(v=sql.105).aspx
[Clustered Index Design Guidelines]: http://technet.microsoft.com/en-us/library/ms190639(v=sql.105).aspx

<!-- EF -->
[Performance Considerations for Entity Framework 5]: http://msdn.microsoft.com/en-us/data/hh949853
[Code First Data Annotations]: http://msdn.microsoft.com/en-us/data/jj591583.aspx
[Index Annotations in Entity Framework]:http://msdn.microsoft.com/en-us/data/jj591583.aspx#Index

<!-- BLOG LINKS -->
[How much does that key cost?]: http://www.sqlskills.com/blogs/kimberly/how-much-does-that-key-cost-plus-sp_helpindex9/
