<properties umbraconavihide="0" pagetitle="How to Use the Table Storage Service from .NET" metakeywords="Get started Azure table, Azure nosql, Azure large structured data store, Azure table, Azure table storage, Azure table .NET, Azure table storage .NET, Azure table C#, Azure table storage C#" metadescription="Get started with Windows Azure table storage. Learn how to use the Windows Azure table storage service to create and delete tables and insert and query entities in a table." linkid="dev-net-how-to-table-services" urldisplayname="Table Service" headerexpose footerexpose disquscomments="1"></properties>

# How to Use the Table Storage Service

This guide will show you how to perform common scenarios using the
Windows Azure Table storage service. The samples are written in C\# code
and use the .NET API. The scenarios covered include **creating and
deleting a table, inserting and querying entities in a table**. For more
information on tables, see the [Next Steps][] section.

## Table of Contents

-   [What is the Table Service][]
-   [Concepts][]
-   [Create a Windows Azure Storage Account][]
-   [Create a Windows Azure Project in Visual Studio][]
-   [Configure your Application to Access Storage][]
-   [Setup a Windows Azure Storage Connection String][]
-   [How To: Create a Table][]
-   [How To: Add an Entity to a Table][]
-   [How To: Insert a Batch of Entities][]
-   [How To: Retrieve All Entities in a Partition][]
-   [How To: Retrieve a Range of Entities in a Partition][]
-   [How To: Retrieve a Single Entity][]
-   [How To: Update an Entity][]
-   [How To: Query a Subset of Entity Properties][]
-   [How To: Insert-or-Replace an Entity][]
-   [How To: Delete an Entity][]
-   [How To: Delete a Table][]
-   [Next Steps][]

## <a name="what-is"> </a>What is the Table Service

The Windows Azure Table storage service stores large amounts of
structured data. The service is a NoSQL datastore which accepts
authenticated calls from inside and outside the Azure cloud. Azure
tables are ideal for storing structured, non-relational data. Common
uses of the Table service include:

-   Storing TBs of structured data capable of serving web scale
    applications
-   Storing datasets that don't require complex joins, foreign keys, or
    stored procedures and can be denormalized for fast access
-   Quickly querying data using a clustered index
-   Accessing data using the OData protocol and LINQ queries with WCF
    Data Service .NET Libraries

You can use the Table service to store and query huge sets of
structured, non-relational data, and your tables will scale as demand
increases.

## <a name="concepts"> </a>Concepts

The Table service contains the following components:

![Table1][]

-   **URL format:** Code addresses tables in an account using this
    address format:   
    http://<storage account\>.table.core.windows.net/<table\>  
      
    You can address Azure tables directly using this address with the
    OData protocol. For more information, see [OData.org][]

-   **Storage Account:** All access to Windows Azure Storage is done
    through a storage account. The total size of blob, table, and queue
    contents in a storage account cannot exceed 100TB.

-   **Table**: A table is a collection of entities. Tables don't enforce
    a schema on entities, which means a single table can contain
    entities that have different sets of properties. An account can
    contain many tables, the size of which is only limited by the 100TB
    storage account limit.

-   **Entity**: An entity is a set of properties, similar to a database
    row. An entity can be up to 1MB in size.

-   **Properties**: A property is a name-value pair. Each entity can
    include up to 252 properties to store data. Each entity also has 3
    system properties that specify a partition key, a row key, and a
    timestamp. Entities with the same partition key can be queried more
    quickly, and inserted/updated in atomic operations. An entity's row
    key is its unique identifier within a partition.

## <a name="create-account"> </a>Create a Windows Azure Storage Account

To use storage operations, you need a Windows Azure storage account. You
can create a storage account by following these steps. (You can also
create a storage account [using the REST API][].)

1.  Log into the [Windows Azure Management Portal][].

2.  In the navigation pane, click **Hosted Services, Storage Accounts &
    CDN**.

3.  At the top of the navigation pane, click **Storage Accounts**.

4.  On the ribbon, in the Storage group, click **New Storage Account**.
      
    ![Blob2][]  
      
    The **Create a New Storage Account**dialog box opens.   
    ![Blob3][]

5.  In **Choose a Subscription**, select the subscription that the
    storage account will be used with.

6.  In **Enter a URL**, type a subdomain name to use in the URI for the
    storage account. The entry can contain from 3-24 lowercase letters
    and numbers. This value becomes the host name within the URI that is
    used to address Blob, Queue, or Table resources for the
    subscription.

7.  Choose a region or an affinity group in which to locate the storage.
    If you will be using storage from your Windows Azure application,
    select the same region where you will deploy your application.

8.  Click **OK**.

9.  Click the **View** button in the right-hand column below to display
    and save the **Primary access key** for the storage account. You
    will need this in subsequent steps to access storage.   
    ![Blob4][]

## <a name="create-project"> </a>Create a Windows Azure Project in Visual Studio

In this guide, you will use storage features within a Windows Azure
cloud project in Visual Studio. To learn how to create Windows Azure
cloud projects:

1.  [Download and install the Windows Azure SDK for .NET][] if you have
    not already done so.

2.  Read [Creating a Windows Azure Project in Visual Studio][] on MSDN,
    and follow the steps for creating a Windows Azure project with at
    least one web or worker role.

## <a name="configure-access"> </a>Configure Your Application to Access Storage

The web and worker roles in your cloud project already contain most of
the references to use Table Services. However, you need to manually add
a reference to **System.Data.Services.Client**:

1.  In Solution Explorer, right-click **References**, and then click
    **Add Reference**.

2.  In the .NET tab, click **System.Data.Services.Client**.

3.  Click **OK**.

Then, add the following to the top of any C\# file where you want to use
Windows Azure Table Services:

    using Microsoft.WindowsAzure;
    using Microsoft.WindowsAzure.StorageClient;
    using System.Data.Services.Client;

## <a name="setup-connection-string"> </a>Setup a Windows Azure Storage Connection String

The Windows Azure .NET storage client uses a storage connection string
to store endpoints and credentials for accessing storage services. You
can put your storage connection string in a configuration file, rather
than hard-coding it in code. One option is to use .NET's built-in
configuration mechanism (e.g. **Web.config** for web applications). In
this guide, you will store your connection string using Windows Azure
service configuration. The service configuration is unique to Windows
Azure projects and allows you to change configuration from the
Management Portal without redeploying your application.

To configure your connection string in the Windows Azure service
configuration:

1.  In the Solution Explorer, in the **Roles** folder, right-click a web
    role or worker role and click **Properties**.  
    ![Blob5][]

2.  Click **Settings** and click **Add Setting**.  
    ![Blob6][]

    A new setting is created.

3.  In the **Type** drop-down of the **Setting1** entry, choose
    **Connection String**.  
    ![Blob7][]

4.  Click the **...** button at the right end of the **Setting1** entry.
    The **Storage Account Connection String** dialog opens.

5.  Choose whether you want to target the storage emulator (Windows
    Azure storage simulated on your desktop) or an actual storage
    account in the cloud, and click **OK**. The code in this guide works
    with either option.  
    ![Blob8][]

6.  Change the entry **Name** from **Setting1** to
    **StorageConnectionString**. You will reference this name in the
    code in this guide.  
    ![Blob9][]

You are now ready to perform the How To's in this guide.

## <a name="create-table"> </a>How To: Create a Table

A **CloudTableClient** object lets you get reference objects for tables
and entities. The following code creates a **CloudTableClient** object
and uses it to create a new table. All code in this guide uses a storage
connection string stored in the Windows Azure application's service
configuration. There are also other ways to create
**CloudStorageAccount** object.

    // Retrieve storage account from connection-string
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        RoleEnvironment.GetConfigurationSettingValue("StorageConnectionString"));

    // Create the table client
    CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

    // Create the table if it doesn't exist
    string tableName = "people";
    tableClient.CreateTableIfNotExist(tableName);

## <a name="add-entity"> </a>How To: Add an Entity to a Table

Entities map to C\# objects using a custom class derived from
**TableServiceEntity**. To add an entity to a table, first create a
class that defines the properties of your entity. The following code
defines an entity class that uses the customer's first name as the row
key, and last name as the partition key. Together, an entity's partition
and row key uniquely identify the entity in the table. Entities with the
same partition key can be queried faster than those with different
partition keys.

    public class CustomerEntity : TableServiceEntity
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

Table operations involving entities require a **TableServiceContext**
object. This object tracks the client-side state of all table entities
created and accessed in client code. Maintaining a client-side object
representing each entity makes write operations more efficient because
only objects with changes are updated on the table service when save
operations are executed. The following code creates a
**TableServiceContext** object by calling the **GetDataServiceContext**
method. Then the code creates an instance of the **CustomerEntity**
class. The code calls **serviceContext.AddObject** to insert the new
entity into the table. This adds the entity object to the
**serviceContext**, but no service operations occur. Finally, the code
sends the new entity to the table service when the
**SaveChangesWithRetries** method is called.

    // Retrieve storage account from connection-string
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        RoleEnvironment.GetConfigurationSettingValue("StorageConnectionString"));

    // Create the table client
    CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

    // Get the data service context
    TableServiceContext serviceContext = tableClient.GetDataServiceContext();

    // Create a new customer entity
    CustomerEntity customer1 = new CustomerEntity("Harp", "Walter");
    customer1.Email = "Walter@contoso.com";
    customer1.PhoneNumber = "425-555-0101";

    // Add the new customer to the people table
    serviceContext.AddObject("people", customer1);

    // Submit the operation to the table service
    serviceContext.SaveChangesWithRetries();

## <a name="insert-batch"> </a>How To: Insert a Batch of Entities

You can insert a batch of entities to the table service in one write
operation. The following code creates three entity objects and adds each
to the service context using the **AddObject** method. Then the code
calls **SaveChangesWithRetries** with the **SaveChangesOptions.Batch**
parameter. If you omit **SaveChangesOptions.Batch**, three separate
calls to the table service would occur. Some other notes on batch
operations:

1.  You can perform batch updates, deletes, or inserts.
2.  A single batch operation can include up to 100 entities.
3.  All entities in a single batch operation must have the same
    partition key.

<!-- -->

    // Retrieve storage account from connection-string
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        RoleEnvironment.GetConfigurationSettingValue("StorageConnectionString"));

    // Create the table client
    CloudTableClient tableClient = storageAccount.CreateCloudTableClient();
    string tableName = "people";

    // Get the data service context
    TableServiceContext serviceContext = tableClient.GetDataServiceContext();

    // Create a customer entity and add to the table
    CustomerEntity customer = new CustomerEntity("Smith", "Jeff");
    customer.Email = "Jeff@contoso.com";
    customer.PhoneNumber = "425-555-0104";
    serviceContext.AddObject(tableName, customer);

    // Create another customer entity and add to the table
    CustomerEntity customer2 = new CustomerEntity("Smith", "Ben");
    customer2.Email = "Ben@contoso.com";
    customer2.PhoneNumber = "425-555-0102";
    serviceContext.AddObject(tableName, customer2);

    // Create a customer entity and add to the table
    CustomerEntity customer3 = new CustomerEntity("Smith", "Denise");
    customer3.Email = "Denise@contoso.com";
    customer3.PhoneNumber = "425-555-0103";
    serviceContext.AddObject(tableName, customer3);

    // Submit the operation to the table service
    serviceContext.SaveChangesWithRetries(SaveChangesOptions.Batch);

## <a name="retrieve-all-entities"> </a>How To: Retrieve All Entities in a Partition

To query a table for entities in a partition, you can use a LINQ query.
Call **serviceContext.CreateQuery** to create a query from your data
source. The following code specifies a filter for entities where 'Smith'
is the partition key. Call **AsTableServiceQuery<CustomerEntity\>** on
the result of the LINQ query to finish creating the **CloudTableQuery**
object. You can then use the **partitionQuery** object you created in a
**foreach** loop to consume the results. This code prints the fields of
each entity in the query results to the console.

    // Retrieve storage account from connection-string
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        RoleEnvironment.GetConfigurationSettingValue("StorageConnectionString"));

    // Create the table client
    CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

    // Get the data service context
    TableServiceContext serviceContext = tableClient.GetDataServiceContext();

    // Specify a partition query, using "Smith" as the partition key
    CloudTableQuery<CustomerEntity> partitionQuery =
        (from e in serviceContext.CreateQuery<CustomerEntity>("people")
         where e.PartitionKey == "Smith"
         select e).AsTableServiceQuery<CustomerEntity>();

    // Loop through the results, displaying information about the entity
    foreach (CustomerEntity entity in partitionQuery)
    {
        Console.WriteLine("{0}, {1}\t{2}\t{3}", entity.PartitionKey, entity.RowKey,
            entity.Email, entity.PhoneNumber);
    }

## <a name="retrieve-range-entities"> </a>How To: Retrieve a Range of Entities in a Partition

If you don't want to query all the entities in a partition, you can
specify a range by using the **CompareTo** method instead of using the
usual greater-than (\>) and less-than (<) operators. This is because the
latter will result in improper query construction. The following code
uses two filters to get all entities in partition 'Smith' where the row
key (first name) starts with a letter up to 'E' in the alphabet. Then it
prints the query results. If you use the entities added to the table in
the batch insert section of this guide, only two entities are returned
this time (Ben and Denise Smith); Jeff Smith is not included.

    // Retrieve storage account from connection-string
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        RoleEnvironment.GetConfigurationSettingValue("StorageConnectionString"));

    // Create the table client
    CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

    // Get the data service context
    TableServiceContext serviceContext = tableClient.GetDataServiceContext();

    // Specify a partition query, using "Smith" as the partition key,
    // with the row key being up to the letter "E"
    CloudTableQuery<CustomerEntity> entityRangeQuery =
        (from e in serviceContext.CreateQuery<CustomerEntity>("people")
         where e.PartitionKey == "Smith" && e.RowKey.CompareTo("E") < 0
         select e).AsTableServiceQuery<CustomerEntity>();

    // Loop through the results, displaying information about the entity
    foreach (CustomerEntity entity in entityRangeQuery)
    {
        Console.WriteLine("{0}, {1}\t{2}\t{3}", entity.PartitionKey, entity.RowKey,
            entity.Email, entity.PhoneNumber);
    }

## <a name="retrieve-single-entity"> </a>How To: Retrieve a Single Entity

You can write a query to retrieve a single, specific entity. The
following code uses two filters to specify the customer 'Jeff Smith'.
Instead of calling **AsTableServiceQuery**, this code calls
**FirstOrDefault**. This method returns just one entity, rather than a
collection, so the code assigns the return value directly to a
**CustomerEntity**object. A null value is returned if no entity has an
exact partition and row key match. Specifying both partition and row
keys in a query is the fastest way to retrieve a single entity from the
Table service.

    // Retrieve storage account from connection-string
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        RoleEnvironment.GetConfigurationSettingValue("StorageConnectionString"));

    // Create the table client
    CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

    // Get the data service context
    TableServiceContext serviceContext = tableClient.GetDataServiceContext();

    // Return the entity with partition key of "Smith" and row key of "Jeff"
    CustomerEntity specificEntity =
        (from e in serviceContext.CreateQuery<CustomerEntity>("people")
         where e.PartitionKey == "Smith" && e.RowKey == "Jeff"
         select e).FirstOrDefault();

## <a name="update-entity"> </a>How To: Update an Entity

To update an entity, retrieve it from the table service, modify the
entity object, and save the changes back to the table service. The
following code changes an existing customer's phone number. Instead of
calling **AddObject** like we did to insert, this code calls
**UpdateObject**. The **SaveChangesWithRetries** method calls the table
service, and the entity is updated, unless another application changed
it in the time since this application retrieved it. When that happens,
an exception is thrown, and the entity must be retrieved, modified, and
saved again. This retry pattern is common in a distributed storage
system.

    // Retrieve storage account from connection-string
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        RoleEnvironment.GetConfigurationSettingValue("StorageConnectionString"));

    // Create the table client
    CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

    // Get the data service context
    TableServiceContext serviceContext = tableClient.GetDataServiceContext();

    // Return the entity with partition key of "Smith" and row key of "Jeff"
    CustomerEntity specificEntity =
        (from e in serviceContext.CreateQuery<CustomerEntity>("people")
         where e.PartitionKey == "Smith" && e.RowKey == "Jeff"
         select e).FirstOrDefault();

    // Specify a new phone number
    specificEntity.PhoneNumber = "425-555-0105";

    // Update the entity
    serviceContext.UpdateObject(specificEntity);

    // Submit the operation to the table service
    serviceContext.SaveChangesWithRetries();

## <a name="query-entity-properties"> </a>How To: Query a Subset of Entity Properties

A query to a table can retrieve just a few properties from an entity.
This technique, called projection, reduces bandwidth and can improve
query performance, especially for large entities. The query in the
following code returns only the email addresses of entities in the
table. You can learn more about projection in this [blog post][]. Note
that projection is not supported on the local storage emulator, so this
code runs only when using an account on the table service.

    // Retrieve storage account from connection-string
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        RoleEnvironment.GetConfigurationSettingValue("StorageConnectionString"));

    // Create the table client
    CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

    // Get the data service context
    TableServiceContext serviceContext = tableClient.GetDataServiceContext();

    // Define a projection query that retrieves only the Email property
    var projectionQuery = 
        from e in serviceContext.CreateQuery<CustomerEntity>("people")
        select new
        {
            Email = e.Email
            // You can specify additional fields here
        };

    // Loop through the results, displaying the Email value
    foreach (var person in projectionQuery)
    {
        Console.WriteLine(person.Email);
    }

## <a name="insert-entity"> </a>How To: Insert-or-Replace an Entity

Often you want to add an entity to a table without knowing if it already
exists in the table. An insert-or-replace operation allows you to make a
single request which will insert the entity if it does not exist or
replace the existing one if it does. Building on prior examples, the
following code inserts or replaces the entity for 'Walter Harp'. After
creating a new entity, this code calls the **serviceContext.AttachTo**
method. This code then calls **UpdateObject**, and finally calls
**SaveChangesWithRetries** with the
**SaveChangesOptions.ReplaceOnUpdate** parameter. Omitting the
**SaveChangesOptions.ReplaceOnUpdate** parameter causes an
insert-or-merge operation. Note that insert-or-replace is not supported
on the local storage emulator, so this code runs only when using an
account on the table service. You can learn more about insert-or-replace
and insert-or-merge in this [blog post][].

    // Retrieve storage account from connection-string
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        RoleEnvironment.GetConfigurationSettingValue("StorageConnectionString"));

    // Create the table client
    CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

    // Get the data service context
    TableServiceContext serviceContext = tableClient.GetDataServiceContext();

    // Create a new customer entity
    CustomerEntity customer5 = new CustomerEntity("Harp", "Walter");
    customer5.Email = "Walter@contoso.com";
    customer5.PhoneNumber = "425-555-0106";

    // Attach this customer to the people table
    serviceContext.AttachTo("people", customer5);

    // Insert this customer if new, or replace if exists
    serviceContext.UpdateObject(customer5);

    // Submit the operation the table service, using the ReplaceOnUpdate option
    serviceContext.SaveChangesWithRetries(SaveChangesOptions.ReplaceOnUpdate);

## <a name="delete-entity"> </a>How To: Delete an Entity

You can easily delete an entity after you have retrieved it. You can
also use the **AttachTo** method to begin tracking it without retrieving
it from the server (see insert-or-replace above). Once the entity is
tracked with **serviceContext**, call **DeleteObject** with the entity
to delete. Then call **SaveChangesWithRetries**. The following code
retrieves and deletes a customer entity.

    // Retrieve storage account from connection-string
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        RoleEnvironment.GetConfigurationSettingValue("StorageConnectionString"));

    // Create the table client
    CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

    // Get the data service context
    TableServiceContext serviceContext = tableClient.GetDataServiceContext();

    CustomerEntity specificEntity =
        (from e in serviceContext.CreateQuery<CustomerEntity>("people")
         where e.PartitionKey == "Smith" && e.RowKey == "Jeff"
         select e).FirstOrDefault();

    // Delete the entity
    serviceContext.DeleteObject(specificEntity);

    // Submit the operation to the table service
    serviceContext.SaveChangesWithRetries();

## <a name="delete-table"> </a>How To: Delete a Table

Finally, the following code deletes a table from a storage account. A
table which has been deleted will be unavailable to be recreated for a
period of time following the deletion.

    // Retrieve storage account from connection-string
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        RoleEnvironment.GetConfigurationSettingValue("StorageConnectionString"));

    // Create the table client
    CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

    // Delete the table it if exists
    tableClient.DeleteTableIfExist("people");

## <a name="next-steps"> </a>Next Steps

Now that you've learned the basics of table storage, follow these links
to learn how to do more complex storage tasks.

-   See the MSDN Reference: [Storing and Accessing Data in Windows
    Azure][]
-   Visit the [Windows Azure Storage Team Blog][]

  [Next Steps]: #next-steps
  [What is the Table Service]: #what-is
  [Concepts]: #concepts
  [Create a Windows Azure Storage Account]: #create-account
  [Create a Windows Azure Project in Visual Studio]: #create-project
  [Configure your Application to Access Storage]: #configure-access
  [Setup a Windows Azure Storage Connection String]: #setup-connection-string
  [How To: Create a Table]: #create-table
  [How To: Add an Entity to a Table]: #add-entity
  [How To: Insert a Batch of Entities]: #insert-batch
  [How To: Retrieve All Entities in a Partition]: #retrieve-all-entities
  [How To: Retrieve a Range of Entities in a Partition]: #retrieve-range-entities
  [How To: Retrieve a Single Entity]: #retrieve-single-entity
  [How To: Update an Entity]: #update-entity
  [How To: Query a Subset of Entity Properties]: #query-entity-properties
  [How To: Insert-or-Replace an Entity]: #insert-entity
  [How To: Delete an Entity]: #delete-entity
  [How To: Delete a Table]: #delete-table
  [Table1]: ../../../DevCenter/dotNet/Media/table1.png
  [OData.org]: http://www.odata.org/
  [using the REST API]: http://msdn.microsoft.com/en-us/library/windowsazure/hh264518.aspx
  [Windows Azure Management Portal]: http://windows.azure.com
  [Blob2]: ../../../DevCenter/dotNet/Media/blob2.png
  [Blob3]: ../../../DevCenter/dotNet/Media/blob3.png
  [Blob4]: ../../../DevCenter/dotNet/Media/blob4.png
  [Download and install the Windows Azure SDK for .NET]: /en-us/develop/net/
  [Creating a Windows Azure Project in Visual Studio]: http://msdn.microsoft.com/en-us/library/windowsazure/ee405487.aspx
  [Blob5]: ../../../DevCenter/dotNet/Media/blob5.png
  [Blob6]: ../../../DevCenter/dotNet/Media/blob6.png
  [Blob7]: ../../../DevCenter/dotNet/Media/blob7.png
  [Blob8]: ../../../DevCenter/dotNet/Media/blob8.png
  [Blob9]: ../../../DevCenter/dotNet/Media/blob9.png
  [blog post]: http://blogs.msdn.com/b/windowsazurestorage/archive/2011/09/15/windows-azure-tables-introducing-upsert-and-query-projection.aspx
  [Storing and Accessing Data in Windows Azure]: http://msdn.microsoft.com/en-us/library/windowsazure/gg433040.aspx
  [Windows Azure Storage Team Blog]: http://blogs.msdn.com/b/windowsazurestorage/
