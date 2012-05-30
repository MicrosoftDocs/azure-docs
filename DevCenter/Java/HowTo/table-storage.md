<properties umbraconavihide="0" pagetitle="How to Use the Table Storage Service - How To - Java - Develop" metakeywords="Get started Azure table Java, Azure nosql Java, Azure table storage Java, Azure table Java" metadescription="" linkid="dev-java-how-to-use-table-storage" urldisplayname="Table Service" headerexpose="" footerexpose="" disquscomments="1"></properties>

# How to use the Table storage service from Java

This guide will show you how to perform common scenarios using the
Windows Azure Table storage service. The samples are written in Java
code. The scenarios covered include **creating and deleting a table,
inserting and querying entities in a table**. For more information on
tables, see the [Next steps](#NextSteps) section.

## <a name="Contents"> </a>Table of Contents

* [What is Table Storage](#what-is)
* [Concepts](#Concepts)
* [Create a Windows Azure storage account](#CreateAccount)
* [Create a Java application](#CreateApplication)
* [Configure your application to access Table Storage](#ConfigureStorage)
* [Setup a Windows Azure storage connection string](#ConnectionString)
* [How to: Create a table](#CreateTable)
* [How to: Add an entity to a table](#AddEntity)
* [How to: Insert a batch of entities](#InsertBatch)
* [How to: Retrieve all entities in a partition](#RetrieveEntities)
* [How to: Retrieve a range of entities in a partition](#RetrieveRange)
* [How to: Retrieve a single entity](#RetriveSingle)
* [How to: Modify an entity](#ModifyEntity)
* [How to: Query a sbset of entity properties](#QueryProperties)
* [How to: Insert-or-replace an entity](#InsertOrReplace)
* [How to: Delete an entity](#DeleteEntity)
* [How to: Delete a table](#DeleteTable)
* [Next steps](#NextSteps)

<div chunk="../../Shared/Chunks/howto-table-storage.md" />

<h2 id="CreateAccount">Create a Windows Azure storage account</h2>

<div chunk="../../Shared/Chunks/create-storage-account.md" />

## <a name="CreateApplication"> </a>Create a Java application

In this guide, you will use storage features which can be run within a
Java application locally, or in code running within a web role or worker
role in Windows Azure. We assume you have downloaded and installed the
Java Development Kit (JDK), and followed the instructions in [Windows Azure SDK for Java] to install the Windows Azure Libraries
for Java and the Windows Azure SDK, and have created a Windows Azure
storage account in your Windows Azure subscription.

You can use any development tools to create your application, including
Notepad. All you need is the ability to compile a Java project and
reference the Windows Azure Libraries for Java.

## <a name="ConfigureStorage"> </a>Configure your application to access table storage

Add the following import statements to the top of the Java file where
you want to use Windows Azure storage APIs to access tables:

    // Include the following imports to use table APIs
    import com.microsoft.windowsazure.services.core.storage.*;
    import com.microsoft.windowsazure.services.table.client.*;
    import com.microsoft.windowsazure.services.table.client.TableQuery.*;

## <a name="ConnectionString"> </a>Setup a Windows Azure storage connection string

A Windows Azure storage client uses a storage connection string to store
endpoints and credentials for accessing storage services. When running
in a client application, you must provide the storage connection string
in the following format, using the name of your storage account and the
Primary access key for the storage account listed in the Management
Portal for the *AccountName* and *AccountKey* values. This example shows
how you can declare a static field to hold the connection string:

    // Define the connection-string with your values
    public static final String storageConnectionString = 
        "DefaultEndpointsProtocol=http;" + 
        "AccountName=your_storage_account;" + 
        "AccountKey=your_storage_account_key";

In an application running within a role in Windows Azure, this string
can be stored in the service configuration file,
ServiceConfiguration.cscfg, and can be accessed with a call to the
**RoleEnvironment.getConfigurationSettings** method. Here’s an example
of getting the connection string from a **Setting** element named
*StorageConnectionString* in the service configuration file:

    // Retrieve storage account from connection-string
    String storageConnectionString = 
        RoleEnvironment.getConfigurationSettings().get("StorageConnectionString");

The samples below assume that you have used one of these two definitions
to get the storage connection string.

## <a name="CreateTable"> </a>How to: Create a table

A **CloudTableClient** object lets you get reference objects for tables
and entities. The following code creates a **CloudTableClient** object
and uses it to create a new table. All code in this guide uses a storage
connection string stored in the Windows Azure application's service
configuration. There are also other ways to create
**CloudStorageAccount** object.

    // Retrieve storage account from connection-string
    CloudStorageAccount storageAccount =
        CloudStorageAccount.parse(storageConnectionString);
     
    // Create the table client.
    CloudTableClient tableClient = storageAccount.createCloudTableClient();
     
    // Create the table if it doesn't exist.
    String tableName = "people";
    tableClient.createTableIfNotExists(tableName);

## <a name="AddEntity"> </a>How to: Add an entity to a table

Entities map to Java objects using a custom class implementing
**TableEntity**. For convenience, the **TableServiceEntity** class
implements **TableEntity** and uses reflection to map properties to
getter and setter methods named for the properties. To add an entity to
a table, first create a class that defines the properties of your
entity. The following code defines an entity class that uses the
customer's first name as the row key, and last name as the partition
key. Together, an entity's partition and row key uniquely identify the
entity in the table. Entities with the same partition key can be queried
faster than those with different partition keys.

    public class CustomerEntity extends TableServiceEntity {
        public CustomerEntity(String lastName, String firstName) {
            this.partitionKey = lastName;
            this.rowKey = firstName;
        }

        public CustomerEntity() { }

        String email;
        String phoneNumber;
        
        public String getEmail() {
            return this.email;
        }
        
        public void setEmail(String email) {
            this.email = email;
        }
        
        public String getPhoneNumber() {
            return this.phoneNumber;
        }
        
        public void setPhoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
        }
    }

Table operations involving entities require a **TableOperation** object.
This object defines the operation to be performed on an entity, which
can be executed with a **CloudTableClient** object. The following code
creates a new instance of the **CustomerEntity** class with some
customer data to be stored. The code next calls
**TableOperation.insert** to create a **TableOperation** object to
insert an entity into a table, and associates the new **CustomerEntity**
with it. Finally, the code calls the **execute** method on the
**CloudTableClient**, specifying the "people" table and the new
**TableOperation**, which then sends a request to the storage service to
insert the new customer entity into the "people" table.

    // Retrieve storage account from connection-string
    CloudStorageAccount storageAccount =
        CloudStorageAccount.parse(storageConnectionString);
     
    // Create the table client.
    CloudTableClient tableClient = storageAccount.createCloudTableClient();
     
    // Create a new customer entity.
    CustomerEntity customer1 = new CustomerEntity("Harp", "Walter");
    customer1.setEmail("Walter@contoso.com");
    customer1.setPhoneNumber("425-555-0101");

    // Create an operation to add the new customer to the people table.
    TableOperation insertCustomer1 = TableOperation.insert(customer1);

    // Submit the operation to the table service.
    tableClient.execute("people", insertCustomer1);

## <a name="InsertBatch"> </a>How to: Insert a batch of entities

You can insert a batch of entities to the table service in one write
operation. The following code creates a **TableBatchOperation** object,
then adds three insert operations to it. Each insert operation is added
by creating a new entity object, setting its values, and then calling
the **insert** method on the **TableBatchOperation** object to associate
the entity with a new insert operation. Then the code calls **execute**
on the **CloudTableClient**, specifying the "people" table and the
**TableBatchOperation** object, which sends the batch of table
operations to the storage service in a single request. Some things to
note on batch operations:

1.  You can perform up to 100 insert, delete, merge, replace, insert or
    merge, and insert or replace operations in any combination in a
    single batch.
2.  A batch operation can have a retrieve operation, if it is the only
    operation in the batch.
3.  All entities in a single batch operation must have the same
    partition key.
4.  A batch operation is limited to a 4MB data payload.

<!-- -->

    // Retrieve storage account from connection-string
    CloudStorageAccount storageAccount =
        CloudStorageAccount.parse(storageConnectionString);
     
    // Create the table client.
    CloudTableClient tableClient = storageAccount.createCloudTableClient();
     
    // Define a batch operation.
    TableBatchOperation batchOperation = new TableBatchOperation();

    // Create a customer entity to add to the table.
    CustomerEntity customer = new CustomerEntity("Smith", "Jeff");
    customer.setEmail("Jeff@contoso.com");
    customer.setPhoneNumber("425-555-0104");
    batchOperation.insert(customer);

    // Create another customer entity to add to the table.
    CustomerEntity customer2 = new CustomerEntity("Smith", "Ben");
    customer2.setEmail("Ben@contoso.com");
    customer2.setPhoneNumber("425-555-0102");
    batchOperation.insert(customer2);

    // Create a third customer entity to add to the table.
    CustomerEntity customer3 = new CustomerEntity("Smith", "Denise");
    customer3.setEmail("Denise@contoso.com");
    customer3.setPhoneNumber("425-555-0103");
    batchOperation.insert(customer3);

    // Execute the batch of operations on the "people" table.
    tableClient.execute("people", batchOperation);

## <a name="RetrieveEntities"> </a>How to: Retrieve all entities in a partition

To query a table for entities in a partition, you can use a
**TableQuery**. Call **TableQuery.from** to create a query on a
particular table that returns a specified result type. The following
code specifies a filter for entities where 'Smith' is the partition key.
**TableQuery.generateFilterCondition** is a helper method to create
filters for queries. Call **where** on the reference returned by the
**TableQuery.from** method to apply the filter to the query. When the
query is executed with a call to **execute** on the **CloudTableClient**
object, it returns an **Iterator** with the **CustomerEntity** result
type specified. You can then use the **Iterator** returned in a for each
loop to consume the results. This code prints the fields of each entity
in the query results to the console.

    // Retrieve storage account from connection-string
    CloudStorageAccount storageAccount =
        CloudStorageAccount.parse(storageConnectionString);
     
    // Create the table client.
    CloudTableClient tableClient = storageAccount.createCloudTableClient();
     
    // Create a filter condition where the partition key is "Smith".
    String partitionFilter = TableQuery.generateFilterCondition(
        TableConstants.PARTITION_KEY, 
        QueryComparisons.EQUAL,
        "Smith");

    // Specify a partition query, using "Smith" as the partition key filter.
    TableQuery<CustomerEntity> partitionQuery =
        TableQuery.from("people", CustomerEntity.class)
        .where(partitionFilter);

    // Loop through the results, displaying information about the entity.
    for (CustomerEntity entity : tableClient.execute(partitionQuery)) {
        System.out.println(entity.getPartitionKey() + " " + entity.getRowKey() + 
            "\t" + entity.getEmail() + "\t" + entity.getPhoneNumber());
    }

## <a name="RetrieveRange"> </a>How to: Retrieve a range of entities in a partition

If you don't want to query all the entities in a partition, you can
specify a range by using comparison operators in a filter. The following
code combines two filters to get all entities in partition 'Smith' where
the row key (first name) starts with a letter up to 'E' in the alphabet.
Then it prints the query results. If you use the entities added to the
table in the batch insert section of this guide, only two entities are
returned this time (Ben and Denise Smith); Jeff Smith is not included.

    // Retrieve storage account from connection-string
    CloudStorageAccount storageAccount =
        CloudStorageAccount.parse(storageConnectionString);
     
    // Create the table client.
    CloudTableClient tableClient = storageAccount.createCloudTableClient();
     
    // Create a filter condition where the partition key is "Smith".
    String partitionFilter = TableQuery.generateFilterCondition(
        TableConstants.PARTITION_KEY, 
        QueryComparisons.EQUAL,
        "Smith");

    // Create a filter condition where the row key is less than the letter "E".
    String rowFilter = TableQuery.generateFilterCondition(
        TableConstants.ROW_KEY, 
        QueryComparisons.LESS_THAN,
        "E");

    // Combine the two conditions into a filter expression.
    String combinedFilter = TableQuery.combineFilters(partitionFilter, 
            Operators.AND, rowFilter);

    // Specify a range query, using "Smith" as the partition key,
    // with the row key being up to the letter "E".
    TableQuery<CustomerEntity> rangeQuery =
        TableQuery.from("people", CustomerEntity.class)
        .where(combinedFilter);

    // Loop through the results, displaying information about the entity
    for (CustomerEntity entity : tableClient.execute(rangeQuery)) {
        System.out.println(entity.getPartitionKey() + " " + entity.getRowKey() + 
            "\t" + entity.getEmail() + "\t" + entity.getPhoneNumber());
    }

## <a name="RetriveSingle"> </a>How to: Retrieve a single entity

You can write a query to retrieve a single, specific entity. The
following code calls **TableOperation.retrieve** with partition key and
row key parameters to specify the customer 'Jeff Smith', instead of
creating a **TableQuery** and using filters to do the same thing. When
executed, the retrieve operation returns just one entity, rather than a
collection. The **getResultAsType** method casts the result to the type
of the assignment target, a **CustomerEntity** object. If this type is
not compatible with the type specified for the query, an exception will
be thrown. A null value is returned if no entity has an exact partition
and row key match. Specifying both partition and row keys in a query is
the fastest way to retrieve a single entity from the Table service.

    // Retrieve storage account from connection-string
    CloudStorageAccount storageAccount =
        CloudStorageAccount.parse(storageConnectionString);
     
    // Create the table client.
    CloudTableClient tableClient = storageAccount.createCloudTableClient();
     
    // Retrieve the entity with partition key of "Smith" and row key of "Jeff"
    TableOperation retrieveSmithJeff = 
        TableOperation.retrieve("Smith", "Jeff", CustomerEntity.class);

    // Submit the operation to the table service and get the specific entity.
    CustomerEntity specificEntity =
        tableClient.execute("people", retrieveSmithJeff).getResultAsType();

## <a name="ModifyEntity"> </a>How to: Modify an entity

To modify an entity, retrieve it from the table service, make changes to
the entity object, and save the changes back to the table service with a
replace or merge operation. The following code changes an existing
customer's phone number. Instead of calling **TableOperation.insert**
like we did to insert, this code calls **TableOperation.replace**. The
**CloudTableClient.execute** method calls the table service, and the
entity is replaced, unless another application changed it in the time
since this application retrieved it. When that happens, an exception is
thrown, and the entity must be retrieved, modified, and saved again.
This optimistic concurrency retry pattern is common in a distributed
storage system.

    // Retrieve storage account from connection-string
    CloudStorageAccount storageAccount =
        CloudStorageAccount.parse(storageConnectionString);
     
    // Create the table client.
    CloudTableClient tableClient = storageAccount.createCloudTableClient();
     
    // Retrieve the entity with partition key of "Smith" and row key of "Jeff".
    TableOperation retrieveSmithJeff = 
        TableOperation.retrieve("Smith", "Jeff", CustomerEntity.class);

    // Submit the operation to the table service and get the specific entity.
    CustomerEntity specificEntity =
        tableClient.execute("people", retrieveSmithJeff).getResultAsType();
        
    // Specify a new phone number.
    specificEntity.setPhoneNumber("425-555-0105");

    // Create an operation to replace the entity.
    TableOperation replaceEntity = TableOperation.replace(specificEntity);

    // Submit the operation to the table service.
    tableClient.execute("people", replaceEntity);

## <a name="QueryProperties"> </a>How to: Query a subset of entity properties

A query to a table can retrieve just a few properties from an entity.
This technique, called projection, reduces bandwidth and can improve
query performance, especially for large entities. The query in the
following code uses the **select** method to return only the email
addresses of entities in the table. The results are projected into a
collection of **String** with the help of an **EntityResolver**, which
does the type conversion on the entities returned from the server. You
can learn more about projection in this [blog post][]. Note that
projection is not supported on the local storage emulator, so this code
runs only when using an account on the table service.

    // Retrieve storage account from connection-string
    CloudStorageAccount storageAccount =
        CloudStorageAccount.parse(storageConnectionString);
     
    // Create the table client.
    CloudTableClient tableClient = storageAccount.createCloudTableClient();
     
    // Define a projection query that retrieves only the Email property
    TableQuery<CustomerEntity> projectionQuery = 
        TableQuery.from("people", CustomerEntity.class)
        .select(new String[] {"Email"});

    // Define a Entity resolver to project the entity to the Email value.
    EntityResolver<String> emailResolver = new EntityResolver<String>() {
        @Override
        public String resolve(String PartitionKey, String RowKey, Date timeStamp,
                HashMap<String, EntityProperty> properties, String etag) {
            return properties.get("Email").getValueAsString();
        }
    };

    // Loop through the results, displaying the Email values.
    for (String projectedString : 
            tableClient.execute(projectionQuery, emailResolver)) {
        System.out.println(projectedString);
    }

## <a name="InsertOrReplace"> </a>How to: Insert-or-replace an entity

Often you want to add an entity to a table without knowing if it already
exists in the table. An insert-or-replace operation allows you to make a
single request which will insert the entity if it does not exist or
replace the existing one if it does. Building on prior examples, the
following code inserts or replaces the entity for 'Walter Harp'. After
creating a new entity, this code calls the
**TableOperation.insertOrReplace** method. This code then calls
**execute** on the **CloudTableClient** with the table and the insert or
replace table operation as the parameters. To update only part of an
entity, the **TableOperation.insertOrMerge** method can be used instead.
Note that insert-or-replace is not supported on the local storage
emulator, so this code runs only when using an account on the table
service. You can learn more about insert-or-replace and insert-or-merge
in this [blog post][].

    // Retrieve storage account from connection-string
    CloudStorageAccount storageAccount =
        CloudStorageAccount.parse(storageConnectionString);
     
    // Create the table client.
    CloudTableClient tableClient = storageAccount.createCloudTableClient();
     
    // Create a new customer entity.
    CustomerEntity customer5 = new CustomerEntity("Harp", "Walter");
    customer5.setEmail("Walter@contoso.com");
    customer5.setPhoneNumber("425-555-0106");

    // Create an operation to add the new customer to the people table.
    TableOperation insertCustomer5 = TableOperation.insertOrReplace(customer5);

    // Submit the operation to the table service.
    tableClient.execute("people", insertCustomer5);

## <a name="DeleteEntity"> </a>How to: Delete an entity

You can easily delete an entity after you have retrieved it. Once the
entity is retrieved, call **TableOperation.delete** with the entity to
delete. Then call **execute** on the **CloudTableClient**. The following
code retrieves and deletes a customer entity.

    // Retrieve storage account from connection-string
    CloudStorageAccount storageAccount =
        CloudStorageAccount.parse(storageConnectionString);
     
    // Create the table client.
    CloudTableClient tableClient = storageAccount.createCloudTableClient();
     
    // Create an operation to retrieve the entity with partition key of "Smith" and row key of "Jeff".
    TableOperation retrieveSmithJeff = TableOperation.retrieve("Smith", "Jeff", CustomerEntity.class);

    // Retrieve the entity with partition key of "Smith" and row key of "Jeff".
    CustomerEntity entitySmithJeff =
            tableClient.execute("people", retrieveSmithJeff).getResultAsType();

    // Create an operation to delete the entity.
    TableOperation deleteSmithJeff = TableOperation.delete(entitySmithJeff);

    // Submit the delete operation to the table service.
    tableClient.execute("people", deleteSmithJeff);

## <a name="DeleteTable"> </a>How to: Delete a table

Finally, the following code deletes a table from a storage account. A
table which has been deleted will be unavailable to be recreated for a
period of time following the deletion, usually less than forty seconds.

    // Retrieve storage account from connection-string
    CloudStorageAccount storageAccount =
        CloudStorageAccount.parse(storageConnectionString);
     
    // Create the table client.
    CloudTableClient tableClient = storageAccount.createCloudTableClient();
     
    // Delete the table and all its data if it exists.
    tableClient.deleteTableIfExists("people");

## <a name="NextSteps"> </a>Next steps

Now that you've learned the basics of table storage, follow these links
to learn how to do more complex storage tasks.

-   See the MSDN Reference: [Storing and Accessing Data in Windows
    Azure]
-   Visit the [Windows Azure Storage Team Blog][]

[OData.org]: http://www.odata.org/
[using the REST API]: http://msdn.microsoft.com/en-us/library/windowsazure/hh264518.aspx
[blog post]: http://blogs.msdn.com/b/windowsazurestorage/archive/2011/09/15/windows-azure-tables-introducing-upsert-and-query-projection.aspx
[Storing and Accessing Data in Windows Azure]: http://msdn.microsoft.com/en-us/library/windowsazure/gg433040.aspx
[Windows Azure Storage Team Blog]: http://blogs.msdn.com/b/windowsazurestorage/
[Windows Azure SDK for Java]: http://www.windowsazure.com/en-us/develop/java/java-home/download-the-windows-azure-sdk-for-java/
[Storing and Accessing Data in Windows Azure]: http://msdn.microsoft.com/en-us/library/windowsazure/gg433040.aspx
