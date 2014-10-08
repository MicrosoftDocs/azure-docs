<properties urlDisplayName="Table Service" pageTitle="How to use table storage  from .NET | Microsoft Azure" metaKeywords="Get started Azure table   Azure nosql   Azure large structured data store   Azure table   Azure table storage   Azure table .NET   Azure table storage .NET   Azure table C#   Azure table storage C#" description="Learn how to use Microsoft Azure Table storage to create and delete tables and insert and query entities in a table." services="storage" documentationCenter=".NET" metaCanonical="" disqusComments="1" umbracoNaviHide="1" title="How to use Microsoft Azure Table storage" authors="tamram" manager="adinah" />

<tags ms.service="storage" ms.workload="storage" ms.tgt_pltfrm="na" ms.devlang="dotnet" ms.topic="article" ms.date="01/01/1900" ms.author="tamram" />



# How to use Table Storage from .NET


This guide will show you how to perform common scenarios using the 
Azure Table Storage Service. The samples are written in C\# code
and use the Azure Storage Client Library for .NET. The scenarios covered include **creating and
deleting a table**, as well as **working with table entities**. For more
information on tables, see the [Next steps][] section.

> [WACOM.NOTE] This guide targets the Azure .NET Storage Client Library 2.x and above. The recommended version is Storage Client Library 4.x, which is available via [NuGet](https://www.nuget.org/packages/WindowsAzure.Storage/) or as part of the [Azure SDK for .NET](/en-us/downloads/). See [How to: Programmatically access Table storage][] below for more details on obtaining the Storage Client Library.

## Table of Contents

-   [What is the Table Service][]
-   [Concepts][]
-   [Create an Azure Storage account][]
-   [Setup a storage connection string][]
-   [How to: Programmatically access Table storage][]
-   [How to: Create a table][]
-   [How to: Add an entity to a table][]
-   [How to: Insert a batch of entities][]
-   [How to: Retrieve all entities in a partition][]
-   [How to: Retrieve a range of entities in a partition][]
-   [How to: Retrieve a single entity][]
-   [How to: Replace an entity][]
-   [How to: Insert-or-replace an entity][]
-   [How to: Query a subset of entity properties][]
-   [How to: Delete an entity][]
-   [How to: Delete a table][]
-   [Next steps][]

[WACOM.INCLUDE [howto-table-storage](../includes/howto-table-storage.md)]

## <h2><a name="create-account"></a><span class="short-header">Create an account</span>Create an Azure Storage account</h2>

[WACOM.INCLUDE [create-storage-account](../includes/create-storage-account.md)]

## <h2><a name="setup-connection-string"></a><span class="short-header">Setup a connection string</span>Setup a storage connection string</h2>

[WACOM.INCLUDE [storage-configure-connection-string](../includes/storage-configure-connection-string.md)]

## <h2> <a name="configure-access"> </a><span  class="short-header">Access programmatically</span>How to: Programmatically access Table storage</h2>

<h3>Obtaining the assembly</h3>
You can use NuGet to obtain the `Microsoft.WindowsAzure.Storage.dll` assembly. Right-click your project in **Solution Explorer** and choose **Manage NuGet Packages**.  Search online for "WindowsAzure.Storage" and click **Install** to install the Azure Storage package and dependencies.

`Microsoft.WindowsAzure.Storage.dll` is also included in the Azure SDK for .NET, which can be downloaded from the <a href="http://www.windowsazure.com/en-us/develop/net/#">.NET Developer Center</a>. The assembly is installed to the `%Program Files%\Microsoft SDKs\Windows Azure\.NET SDK\<sdk-version>\ref\` directory.

<h3>Namespace declarations</h3>
Add the following code namespace declarations to the top of any C\# file
in which you wish to programmatically access Azure Storage:

    using Microsoft.WindowsAzure.Storage;
	using Microsoft.WindowsAzure.Storage.Auth;
    using Microsoft.WindowsAzure.Storage.Table;

Make sure you reference the `Microsoft.WindowsAzure.Storage.dll` assembly.

<h3>Retrieving your connection string</h3>
You can use the **CloudStorageAccount** type to represent 
your Storage Account information. If you are using an 
Azure project template and/or have a reference to the
Microsoft.WindowsAzure.CloudConfigurationManager namespace, you 
can you use the **CloudConfigurationManager** type
to retrieve your storage connection string and storage account
information from the Azure service configuration:

    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        CloudConfigurationManager.GetSetting("StorageConnectionString"));

If you are creating an application with no reference to Microsoft.WindowsAzure.CloudConfigurationManager, and your connection string is located in the `web.config` or `app.config` as show above, then you can use **ConfigurationManager** to retrieve the connection string.  You will need to add a reference to System.Configuration.dll to your project and add another namespace declaration for it:

	using System.Configuration;
	...
	CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
		ConfigurationManager.ConnectionStrings["StorageConnectionString"].ConnectionString);

<h3>ODataLib dependencies</h3>
ODataLib dependencies in the Storage Client Library for .NET are resolved through the ODataLib (version 5.0.2) packages available through NuGet and not WCF Data Services.  The ODataLib libraries can be downloaded directly or referenced by your code project through NuGet.  The specific ODataLib packages are [OData], [Edm], and [Spatial].

<h2><a name="create-table"></a><span class="short-header">Create a table</span>How to: Create a table</h2>

A **CloudTableClient** object lets you get reference objects for tables
and entities. The following code creates a **CloudTableClient** object
and uses it to create a new table. All code in this guide assumes that
the application being built is an Azure Cloud Service project and
uses a storage connection string stored in the Azure application's service configuration.

    // Retrieve the storage account from the connection string.
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        CloudConfigurationManager.GetSetting("StorageConnectionString"));

    // Create the table client.
    CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

    // Create the table if it doesn't exist.
    CloudTable table = tableClient.GetTableReference("people");
    table.CreateIfNotExists();

<h2><a name="add-entity"></a><span class="short-header">Add an entity to a table</span>How to: Add an entity to a table</h2>

Entities map to C\# objects using a custom class derived from
**TableEntity**. To add an entity to a table, create a
class that defines the properties of your entity. The following code
defines an entity class that uses the customer's first name as the row
key and last name as the partition key. Together, an entity's partition
and row key uniquely identify the entity in the table. Entities with the
same partition key can be queried faster than those with different
partition keys, but using diverse partition keys allows for greater parallel
operation scalability.  For any property that should be stored in the table service, 
the property must be a public property of a supported type that exposes both `get` and `set`.
Also, your entity type *must* expose a parameter-less constructor.

    public class CustomerEntity : TableEntity
    {
        public CustomerEntity(string lastName, string firstName)
        {
            this.PartitionKey = lastName;
            this.RowKey = firstName;
        }
		
        public CustomerEntity() { }

        public string Email { get; set; }

        public string PhoneNumber { get; set; }
    }

Table operations involving entities are performed using the **CloudTable**
object you created in "How to: Create a Table."  The operation to be performed
is represented by a **TableOperation** object.  The following code example shows the creation of the **CloudTable** object and then a **CustomerEntity** object.  To prepare the operation, a **TableOperation** is created to insert the customer entity into the table.  Finally, the operation is executed by calling **CloudTable.Execute**.

    // Retrieve the storage account from the connection string.
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
       CloudConfigurationManager.GetSetting("StorageConnectionString"));

    // Create the table client.
    CloudTableClient tableClient = storageAccount.CreateCloudTableClient();
	
	// Create the CloudTable object that represents the "people" table.
	CloudTable table = tableClient.GetTableReference("people");

    // Create a new customer entity.
    CustomerEntity customer1 = new CustomerEntity("Harp", "Walter");
    customer1.Email = "Walter@contoso.com";
    customer1.PhoneNumber = "425-555-0101";

    // Create the TableOperation that inserts the customer entity.
    TableOperation insertOperation = TableOperation.Insert(customer1);

    // Execute the insert operation.
    table.Execute(insertOperation);

<h2><a name="insert-batch"></a><span class="short-header">Insert a batch of entities</span>How to: Insert a batch of entities</h2>

You can insert a batch of entities into a table in one write
operation. Some other notes on batch
operations:

1.  You can perform updates, deletes, and inserts in the same single batch operation.
2.  A single batch operation can include up to 100 entities.
3.  All entities in a single batch operation must have the same
    partition key.
4.  While it is possible to perform a query as a batch operation, it must be the only operation in the batch.

<!-- -->
The following code example creates two entity objects and adds each
to a **TableBatchOperation** using the **Insert** method. Then **CloudTable.Execute** is called to execute the operation.

    // Retrieve the storage account from the connection string.
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        CloudConfigurationManager.GetSetting("StorageConnectionString"));

    // Create the table client.
    CloudTableClient tableClient = storageAccount.CreateCloudTableClient();
    
	// Create the CloudTable object that represents the "people" table.
    CloudTable table = tableClient.GetTableReference("people");

    // Create the batch operation.
    TableBatchOperation batchOperation = new TableBatchOperation();

    // Create a customer entity and add it to the table.
	CustomerEntity customer1 = new CustomerEntity("Smith", "Jeff");
	customer1.Email = "Jeff@contoso.com";
	customer1.PhoneNumber = "425-555-0104";
            
	// Create another customer entity and add it to the table.
	CustomerEntity customer2 = new CustomerEntity("Smith", "Ben");
	customer2.Email = "Ben@contoso.com";
	customer2.PhoneNumber = "425-555-0102";
            
	// Add both customer entities to the batch insert operation.
	batchOperation.Insert(customer1);
	batchOperation.Insert(customer2);

	// Execute the batch operation.
	table.ExecuteBatch(batchOperation);

<h2><a name="retrieve-all-entities"></a><span class="short-header">Retrieve all entities</span>How to: Retrieve all entities in a partition</h2>

To query a table for all entities in a partition, use a **TableQuery** object.
The following code example specifies a filter for entities where 'Smith'
is the partition key. This example prints the fields of
each entity in the query results to the console.

    // Retrieve the storage account from the connection string.
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        CloudConfigurationManager.GetSetting("StorageConnectionString"));

    // Create the table client.
    CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

    // Create the CloudTable object that represents the "people" table.
    CloudTable table = tableClient.GetTableReference("people");

    // Construct the query operation for all customer entities where PartitionKey="Smith".
    TableQuery<CustomerEntity> query = new TableQuery<CustomerEntity>().Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, "Smith"));

    // Print the fields for each customer.
    foreach (CustomerEntity entity in table.ExecuteQuery(query))
    {
        Console.WriteLine("{0}, {1}\t{2}\t{3}", entity.PartitionKey, entity.RowKey,
            entity.Email, entity.PhoneNumber);
    }

<h2><a name="retrieve-range-entities"></a><span class="short-header">Retrieve a range of entities</span>How to: Retrieve a range of entities in a partition</h2>

If you don't want to query all the entities in a partition, you can
specify a range by combining the partition key filter with a row key filter. The following code example
uses two filters to get all entities in partition 'Smith' where the row
key (first name) starts with a letter earlier than 'E' in the alphabet and then
prints the query results.

    // Retrieve the storage account from the connection string.
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        CloudConfigurationManager.GetSetting("StorageConnectionString"));

    // Create the table client.
    CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

    //Create the CloudTable object that represents the "people" table.
    CloudTable table = tableClient.GetTableReference("people");

	// Create the table query.
    TableQuery<CustomerEntity> rangeQuery = new TableQuery<CustomerEntity>().Where(
        TableQuery.CombineFilters(
            TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, "Smith"),
            TableOperators.And,
            TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.LessThan, "E")));

    // Loop through the results, displaying information about the entity.
    foreach (CustomerEntity entity in table.ExecuteQuery(rangeQuery))
    {
        Console.WriteLine("{0}, {1}\t{2}\t{3}", entity.PartitionKey, entity.RowKey,
            entity.Email, entity.PhoneNumber);
    }

<h2><a name="retrieve-single-entity"></a><span class="short-header">Retrieve a single entity</span>How to: Retrieve a single entity</h2>

You can write a query to retrieve a single, specific entity. The
following code uses a **TableOperation** to specify the customer 'Ben Smith'.
This method returns just one entity, rather than a
collection, and the returned value in **TableResult.Result** is a **CustomerEntity**.
Specifying both partition and row keys in a query is the fastest way to 
retrieve a single entity from the Table service.

    // Retrieve the storage account from the connection string.
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        CloudConfigurationManager.GetSetting("StorageConnectionString"));

    // Create the table client.
    CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

    // Create the CloudTable object that represents the "people" table.
    CloudTable table = tableClient.GetTableReference("people");

    // Create a retrieve operation that takes a customer entity.
    TableOperation retrieveOperation = TableOperation.Retrieve<CustomerEntity>("Smith", "Ben");

    // Execute the retrieve operation.
    TableResult retrievedResult = table.Execute(retrieveOperation);

    // Print the phone number of the result.
	if (retrievedResult.Result != null)
	   Console.WriteLine(((CustomerEntity)retrievedResult.Result).PhoneNumber);
	else
	   Console.WriteLine("The phone number could not be retrieved.");

<h2><a name="replace-entity"></a><span class="short-header">Replace an entity</span>How to: Replace an entity</h2>

To update an entity, retrieve it from the table service, modify the
entity object, and then save the changes back to the table service. The
following code changes an existing customer's phone number. Instead of
calling **Insert**, this code uses 
**Replace**. This causes the entity to be fully replaced on the server,
unless the entity on the server has changed since it was retrieved, in
which case the operation will fail.  This failure is to prevent your application
from inadvertently overwriting a change made between the retrieval and 
update by another component of your application.  The proper handling of this failure
is to retrieve the entity again, make your changes (if still valid), and then 
perform another **Replace** operation.  The next section will
show you how to override this behavior.

    // Retrieve the storage account from the connection string.
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        CloudConfigurationManager.GetSetting("StorageConnectionString"));

    // Create the table client
    CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

    // Create the CloudTable object that represents the "people" table.
    CloudTable table = tableClient.GetTableReference("people");

    // Create a retrieve operation that takes a customer entity.
    TableOperation retrieveOperation = TableOperation.Retrieve<CustomerEntity>("Smith", "Ben");

    // Execute the operation.
    TableResult retrievedResult = table.Execute(retrieveOperation);

    // Assign the result to a CustomerEntity object.
    CustomerEntity updateEntity = (CustomerEntity)retrievedResult.Result;

    if (updateEntity != null)
	{
	   // Change the phone number.
	   updateEntity.PhoneNumber = "425-555-0105";

	   // Create the InsertOrReplace TableOperation
	   TableOperation updateOperation = TableOperation.Replace(updateEntity);

	   // Execute the operation.
	   table.Execute(updateOperation);

	   Console.WriteLine("Entity updated.");
	}

	else
	   Console.WriteLine("Entity could not be retrieved.");

<h2><a name="insert-or-replace-entity"></a><span class="short-header">Insert-or-replace an entity</span>How to: Insert-or-replace an entity</h2>

**Replace** operations will fail if the entity has been changed since
it was retrieved from the server.  Furthermore, you must retrieve
the entity from the server first in order for the **Replace** to be successful.
Sometimes, however, you don't know if the entity exists on the server
and the current values stored in it are irrelevant - your update should
overwrite them all.  To accomplish this, you would use an **InsertOrReplace**
operation.  This operation inserts the entity if it doesn't exist, or
replaces it if it does, regardless of when the last update was made.  In the 
following code example, the customer entity for Ben Smith is still retrieved, but it is then saved back to the server using **InsertOrReplace**.  Any updates
made to the entity between the retrieval and update operation will be 
overwritten.

    // Retrieve the storage account from the connection string.
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        CloudConfigurationManager.GetSetting("StorageConnectionString"));

    // Create the table client.
    CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

    // Create the CloudTable object that represents the "people" table.
    CloudTable table = tableClient.GetTableReference("people");

    // Create a retrieve operation that takes a customer entity.
    TableOperation retrieveOperation = TableOperation.Retrieve<CustomerEntity>("Smith", "Ben");

    // Execute the operation.
    TableResult retrievedResult = table.Execute(retrieveOperation);

    // Assign the result to a CustomerEntity object.
    CustomerEntity updateEntity = (CustomerEntity)retrievedResult.Result;

    if (updateEntity != null)
	{
	   // Change the phone number.
	   updateEntity.PhoneNumber = "425-555-1234";

	   // Create the InsertOrReplace TableOperation
	   TableOperation insertOrReplaceOperation = TableOperation.InsertOrReplace(updateEntity);

	   // Execute the operation.
	   table.Execute(insertOrReplaceOperation);

	   Console.WriteLine("Entity was updated.");
	}

	else
	   Console.WriteLine("Entity could not be retrieved.");

<h2><a name="query-entity-properties"></a><span class="short-header">Query a subset of properties</span>How to: Query a subset of entity properties</h2>

A table query can retrieve just a few properties from an entity instead of all the entity properties. This technique, called projection, reduces bandwidth and can improve query performance, especially for large entities. The query in the
following code returns only the email addresses of entities in the
table. This is done by using a query of **DynamicTableEntity** and 
also an **EntityResolver**. You can learn more about projection in this [blog post][]. Note that projection is not supported on the local storage emulator, so this code runs only when using an account on the table service.

    // Retrieve storage account from connection string
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        CloudConfigurationManager.GetSetting("StorageConnectionString"));

    // Create the table client
    CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

    //Create the CloudTable that represents the "people" table.
    CloudTable table = tableClient.GetTableReference("people");

    // Define the query, and only select the Email property
    TableQuery<DynamicTableEntity> projectionQuery = new TableQuery<DynamicTableEntity>().Select(new string[] { "Email" });

    // Define an entity resolver to work with the entity after retrieval.
    EntityResolver<string> resolver = (pk, rk, ts, props, etag) => props.ContainsKey("Email") ? props["Email"].StringValue : null;

    foreach (string projectedEmail in table.ExecuteQuery(projectionQuery, resolver, null, null))
    {
        Console.WriteLine(projectedEmail);
    }

<h2><a name="delete-entity"></a><span class="short-header">Delete an entity</span>How to: Delete an entity</h2>

You can easily delete an entity after you have retrieved it, using the same pattern
shown for updating an entity.  The following code
retrieves and deletes a customer entity.

    // Retrieve storage account from connection string
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        CloudConfigurationManager.GetSetting("StorageConnectionString"));

    // Create the table client
    CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

    //Create the CloudTable that represents the "people" table.
    CloudTable table = tableClient.GetTableReference("people");

    // Create a retrieve operation that expects a customer entity.
    TableOperation retrieveOperation = TableOperation.Retrieve<CustomerEntity>("Smith", "Ben");

    // Execute the operation.
    TableResult retrievedResult = table.Execute(retrieveOperation);

    // Assign the result to a CustomerEntity.
    CustomerEntity deleteEntity = (CustomerEntity)retrievedResult.Result;

    // Create the Delete TableOperation.
	if (deleteEntity != null)
	{
	   TableOperation deleteOperation = TableOperation.Delete(deleteEntity);

	   // Execute the operation.
	   table.Execute(deleteOperation);

	   Console.WriteLine("Entity deleted.");
	}

	else
	   Console.WriteLine("Could not retrieve the entity.");

<h2><a name="delete-table"></a><span class="short-header">Delete a table</span>How to: Delete a table</h2>

Finally, the following code example deletes a table from a storage account. A
table which has been deleted will be unavailable to be recreated for a
period of time following the deletion.

    // Retrieve the storage account from the connection string.
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        CloudConfigurationManager.GetSetting("StorageConnectionString"));

    // Create the table client.
    CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

    //Create the CloudTable that represents the "people" table.
    CloudTable table = tableClient.GetTableReference("people");

    // Delete the table it if exists.
    table.DeleteIfExists();

<h2><a name="next-steps"></a><span class="short-header">Next steps</span>Next steps</h2>

Now that you've learned the basics of Table storage, follow these links
to learn how to do more complex storage tasks.

<ul>
<li>View the Table service reference documentation for complete details about available APIs:
  <ul>
    <li><a href="http://go.microsoft.com/fwlink/?LinkID=390731&clcid=0x409">Storage Client Library for .NET reference</a>
    </li>
    <li><a href="http://msdn.microsoft.com/en-us/library/windowsazure/dd179355">REST API reference</a></li>
  </ul>
</li>
<li>Learn about more advanced tasks you can perform with Azure Storage at <a href="http://msdn.microsoft.com/en-us/library/windowsazure/gg433040.aspx">Storing and Accessing Data in Azure</a>.</li>
<li>Learn how to work with Azure Storage in backend processes for Azure Websites at <a href="/en-us/documentation/articles/websites-dotnet-webjobs-sdk-get-started/">Get Started with the Azure WebJobs SDK</a>.</li>
<li>View more feature guides to learn about additional options for storing data in Azure.
  <ul>
    <li>Use <a href="/en-us/documentation/articles/storage-dotnet-how-to-use-blobs/">Blob Storage</a> to store unstructured data.</li>
    <li>Use <a href="/en-us/documentation/articles/storage-dotnet-how-to-use-queues/">Queue Storage</a> to store structured data.</li>
    <li>Use <a href="/en-us/documentation/articles/sql-database-dotnet-how-to-use/">SQL Database</a> to store relational data.</li>
  </ul>
</li>
</ul>

  [Next Steps]: #next-steps
  [What is the Table Service]: #what-is
  [Concepts]: #concepts
  [Create an Azure Storage Account]: #create-account
  [Create an Azure Project in Visual Studio]: #create-project
  [Configure your Application to Access Storage]: #configure-access
  [Setup a storage Connection String]: #setup-connection-string
  [How to: Programmatically access table storage]: #configure-access
  [How To: Create a Table]: #create-table
  [How To: Add an Entity to a Table]: #add-entity
  [How To: Insert a Batch of Entities]: #insert-batch
  [How To: Retrieve All Entities in a Partition]: #retrieve-all-entities
  [How To: Retrieve a Range of Entities in a Partition]: #retrieve-range-entities
  [How To: Retrieve a Single Entity]: #retrieve-single-entity
  [How To: Replace an Entity]: #replace-entity
  [How To: Insert-or-Replace an Entity]: #insert-or-replace-entity
  [How To: Query a Subset of Entity Properties]: #query-entity-properties
  [How To: Delete an Entity]: #delete-entity
  [How To: Delete a Table]: #delete-table
  [Download and install the Azure SDK for .NET]: /en-us/develop/net/
  [Creating an Azure Project in Visual Studio]: http://msdn.microsoft.com/en-us/library/windowsazure/ee405487.aspx
  
  [Blob5]: ./media/storage-dotnet-how-to-use-table-storage/blob5.png
  [Blob6]: ./media/storage-dotnet-how-to-use-table-storage/blob6.png
  [Blob7]: ./media/storage-dotnet-how-to-use-table-storage/blob7.png
  [Blob8]: ./media/storage-dotnet-how-to-use-table-storage/blob8.png
  [Blob9]: ./media/storage-dotnet-how-to-use-table-storage/blob9.png
  
  [blog post]: http://blogs.msdn.com/b/windowsazurestorage/archive/2011/09/15/windows-azure-tables-introducing-upsert-and-query-projection.aspx
  [.NET client library reference]: http://go.microsoft.com/fwlink/?LinkID=390731&clcid=0x409
  [Storing and Accessing Data in Azure]: http://msdn.microsoft.com/en-us/library/windowsazure/gg433040.aspx
  [Azure Storage Team Blog]: http://blogs.msdn.com/b/windowsazurestorage/
  [Configuring Connection Strings]: http://msdn.microsoft.com/en-us/library/windowsazure/ee758697.aspx
  [OData]: http://nuget.org/packages/Microsoft.Data.OData/5.0.2
  [Edm]: http://nuget.org/packages/Microsoft.Data.Edm/5.0.2
  [Spatial]: http://nuget.org/packages/System.Spatial/5.0.2
