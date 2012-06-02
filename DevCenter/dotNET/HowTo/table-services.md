<properties umbraconavihide="0" pagetitle="How to Use the Table Storage Service from .NET" metakeywords="Get started Azure table, Azure nosql, Azure large structured data store, Azure table, Azure table storage, Azure table .NET, Azure table storage .NET, Azure table C#, Azure table storage C#" metadescription="Get started with Windows Azure table storage. Learn how to use the Windows Azure table storage service to create and delete tables and insert and query entities in a table." linkid="dev-net-how-to-table-services" urldisplayname="Table Service" headerexpose="" footerexpose="" disquscomments="1"></properties>

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

<div chunk="../../Shared/Chunks/howto-table-storage.md" />

## <a name="create-account"> </a>Create a Windows Azure Storage Account
<div chunk="../../Shared/Chunks/create-storage-account.md" />

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

The Windows Azure .NET storage API supports using a storage connection
string to configure endpoints and credentials for accessing storage
services. You can put your storage connection string in a configuration
file, rather than hard-coding it in code:

- When using Windows Azure Cloud Services, it is recommended you store your connection string using the Windows Azure service configuration system (`*.csdef` and `*.cscfg` files).
- When using Windows Azure Web Sites or Windows Azure Virtual Machines, it is recommended you store your connection string using the .NET configuration system (e.g. `web.config` file).

In both cases, you can retrieve your connection string using the `CloudConfigurationManager.GetSetting` method as shown later in this guide.

### Configuring your connection string when using Cloud Services

The service configuration mechanism is unique to Windows Azure Cloud Services
projects and enables you to dynamically change configuration settings
from the Windows Azure Management Portal without redeploying your
application.

To configure your connection string in the Windows Azure service
configuration:

1.  Within the Solution Explorer of Visual Studio, in the **Roles**
    folder of your Windows Azure Deployment Project, right-click your
    web role or worker role and click **Properties**.  
    ![Blob5][]

2.  Click the **Settings** tab and press the **Add Setting** button.  
    ![Blob6][]

    A new **Setting1** entry will then show up in the settings grid.

3.  In the **Type** drop-down of the new **Setting1** entry, choose
    **Connection String**.  
    ![Blob7][]

4.  Click the **...** button at the right end of the **Setting1** entry.
    The **Storage Account Connection String** dialog will open.

5.  Choose whether you want to target the storage emulator (the Windows
    Azure storage simulated on your local machine) or an actual storage
    account in the cloud. The code in this guide works with either
    option. Enter the **Primary Access Key** value copied from the
    earlier step in this tutorial if you wish to store blob data in the
    storage account we created earlier on Windows Azure.   
    ![Blob8][]

6.  Change the entry **Name** from **Setting1** to a "friendlier" name
    like **StorageConnectionString**. You will reference this
    connectionstring later in the code in this guide.  
    ![Blob9][]
	
### Configuring your connection string when using Web Sites or Virtual Machines

When using Web Sites or Virtual Machines, it is recommended you use the .NET configuration system (e.g. `web.config`).  You store the connection string using the `<appSettings>` element:

	<configuration>
	    <appSettings>
		    <add key="StorageConnectionString"
			     value="DefaultEndpointsProtocol=https;AccountName=[AccountName];AccountKey=[AccountKey]" />
		</appSettings>
	</configuration>

Read [Configuring Connection Strings][] for more information on storage connection strings.
	
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
        CloudConfigurationManager.GetSetting("StorageConnectionString"));

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
        CloudConfigurationManager.GetSetting("StorageConnectionString"));

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
        CloudConfigurationManager.GetSetting("StorageConnectionString"));

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
is the partition key. Call **AsTableServiceQuery&lt;CustomerEntity&gt;** on
the result of the LINQ query to finish creating the **CloudTableQuery**
object. You can then use the **partitionQuery** object you created in a
**foreach** loop to consume the results. This code prints the fields of
each entity in the query results to the console.

    // Retrieve storage account from connection-string
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        CloudConfigurationManager.GetSetting("StorageConnectionString"));

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
usual greater-than (&gt;) and less-than (&lt;) operators. This is because the
latter will result in improper query construction. The following code
uses two filters to get all entities in partition 'Smith' where the row
key (first name) starts with a letter up to 'E' in the alphabet. Then it
prints the query results. If you use the entities added to the table in
the batch insert section of this guide, only two entities are returned
this time (Ben and Denise Smith); Jeff Smith is not included.

    // Retrieve storage account from connection-string
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        CloudConfigurationManager.GetSetting("StorageConnectionString"));

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
        CloudConfigurationManager.GetSetting("StorageConnectionString"));

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
        CloudConfigurationManager.GetSetting("StorageConnectionString"));

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
        CloudConfigurationManager.GetSetting("StorageConnectionString"));

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
        CloudConfigurationManager.GetSetting("StorageConnectionString"));

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
        CloudConfigurationManager.GetSetting("StorageConnectionString"));

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
        CloudConfigurationManager.GetSetting("StorageConnectionString"));

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
  [Configuring Connection Strings]: http://msdn.microsoft.com/en-us/library/windowsazure/ee758697.aspx