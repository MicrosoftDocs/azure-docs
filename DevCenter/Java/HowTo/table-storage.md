  <properties umbracoNaviHide="0" pageTitle="How to Use the Table Storage Service - How To - Java - Develop" metaKeywords="Get started Azure table Java, Azure nosql Java, Azure table storage Java, Azure table Java" metaDescription="" linkid="dev-java-how-to-use-table-storage" urlDisplayName="Table Service" headerExpose="" footerExpose="" disqusComments="1" />
  <h1>How to Use the Table Storage Service</h1>
  <p>This guide will show you how to perform common scenarios using the Windows Azure Table storage service. The samples are written in Java code. The scenarios covered include <strong>creating and deleting a table, inserting and querying entities in a table</strong>. For more information on tables, see the <a href="#bkmk_next-steps">Next Steps</a> section.</p>
  <h2>Table of Contents</h2>
  <ul>
    <li>
      <a href="#bkmk_what-is">What is the Table Service</a>
    </li>
    <li>
      <a href="#bkmk_concepts">Concepts</a>
    </li>
    <li>
      <a href="#bkmk_create-account">Create a Windows Azure Storage Account</a>
    </li>
    <li>
      <a href="#bkmk_CreateJavaApp">Create a Java Application</a>
    </li>
    <li>
      <a href="#bkmk_ConfigApp">Configure your Application to Access Table Storage</a>
    </li>
    <li>
      <a href="#bkmk_SetupConnectString">Setup a Windows Azure Storage Connection String</a>
    </li>
    <li>
      <a href="#bkmk_create-table">How To: Create a Table</a>
    </li>
    <li>
      <a href="#bkmk_add-entity">How To: Add an Entity to a Table</a>
    </li>
    <li>
      <a href="#bkmk_insert-batch">How To: Insert a Batch of Entities</a>
    </li>
    <li>
      <a href="#bkmk_retrieve-all-entities">How To: Retrieve All Entities in a Partition</a>
    </li>
    <li>
      <a href="#bkmk_retrieve-range-entities">How To: Retrieve a Range of Entities in a Partition</a>
    </li>
    <li>
      <a href="#bkmk_retrieve-single-entity">How To: Retrieve a Single Entity</a>
    </li>
    <li>
      <a href="#bkmk_modify-entity">How To: Modify an Entity</a>
    </li>
    <li>
      <a href="#bkmk_query-entity-properties">How To: Query a Subset of Entity Properties</a>
    </li>
    <li>
      <a href="#bkmk_insert-entity">How To: Insert-or-Replace an Entity</a>
    </li>
    <li>
      <a href="#bkmk_delete-entity">How To: Delete an Entity</a>
    </li>
    <li>
      <a href="#bkmk_delete-table">How To: Delete a Table</a>
    </li>
    <li>
      <a href="#bkmk_next-steps">Next Steps</a>
    </li>
  </ul>
  <h2>
    <a name="bkmk_what-is">
    </a>What is the Table Service</h2>
  <p>The Windows Azure Table storage service stores large amounts of structured data. The service is a NoSQL datastore which accepts authenticated calls from inside and outside the Azure cloud. Azure tables are ideal for storing structured, non-relational data. Common uses of the Table service include:</p>
  <ul>
    <li>Storing TBs of structured data capable of serving web scale applications</li>
    <li>Storing datasets that don't require complex joins, foreign keys, or stored procedures and can be denormalized for fast access</li>
    <li>Quickly querying data using a clustered index</li>
    <li>Accessing data using the OData protocol and LINQ queries with WCF Data Service .NET Libraries</li>
  </ul>
  <p>You can use the Table service to store and query huge sets of structured, non-relational data, and your tables will scale as demand increases.</p>
  <h2>
    <a name="bkmk_concepts">
    </a>Concepts</h2>
  <p>The Table service contains the following components:</p>
  <p>
    <img src="../../../DevCenter/dotNet/Media/table1.png" alt="Table1" />
  </p>
  <ul>
    <li>
      <p>
        <strong>URL format:</strong> Code addresses tables in an account using this address format: <br />http://&lt;storage account&gt;.table.core.windows.net/&lt;table&gt;<br /><br />You can address Azure tables directly using this address with the OData protocol. For more information, see <a href="http://www.odata.org/">OData.org</a></p>
    </li>
    <li>
      <p>
        <strong>Storage Account:</strong> All access to Windows Azure Storage is done through a storage account. The total size of blob, table, and queue contents in a storage account cannot exceed 100TB.</p>
    </li>
    <li>
      <p>
        <strong>Table</strong>: A table is a collection of entities. Tables don't enforce a schema on entities, which means a single table can contain entities that have different sets of properties. An account can contain many tables, the size of which is only limited by the 100TB storage account limit.</p>
    </li>
    <li>
      <p>
        <strong>Entity</strong>: An entity is a set of properties, similar to a database row. An entity can be up to 1MB in size.</p>
    </li>
    <li>
      <p>
        <strong>Properties</strong>: A property is a name-value pair. Each entity can include up to 252 properties to store data. Each entity also has 3 system properties that specify a partition key, a row key, and a timestamp. Entities with the same partition key can be queried more quickly, and inserted or modified in atomic operations. An entity's row key is its unique identifier within a partition.</p>
    </li>
  </ul>
  <h2>
    <a name="bkmk_create-account">
    </a>Create a Windows Azure Storage Account</h2>
  <p>To use storage operations, you need a Windows Azure storage account. You can create a storage account by following these steps. (You can also create a storage account <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh264518.aspx" target="_blank">using the REST API</a>.)</p>
  <ol>
    <li>
      <p>Log into the <a href="http://windows.azure.com" target="_blank">Windows Azure Management Portal</a>.</p>
    </li>
    <li>
      <p>In the navigation pane, click <strong>Hosted Services, Storage Accounts &amp; CDN</strong>.</p>
    </li>
    <li>
      <p>At the top of the navigation pane, click <strong>Storage Accounts</strong>.</p>
    </li>
    <li>
      <p>On the ribbon, in the Storage group, click <strong>New Storage Account</strong>. <br /><img src="../../../DevCenter/dotNet/Media/blob2.png" alt="Blob2" /><br /><br />The <strong>Create a New Storage Account </strong>dialog box opens. <br /><img src="../../../DevCenter/dotNet/Media/blob3.png" alt="Blob3" /></p>
    </li>
    <li>
      <p>In <strong>Choose a Subscription</strong>, select the subscription that the storage account will be used with.</p>
    </li>
    <li>
      <p>In <strong>Enter a URL</strong>, type a subdomain name to use in the URI for the storage account. The entry can contain from 3-24 lowercase letters and numbers. This value becomes the host name within the URI that is used to address Blob, Queue, or Table resources for the subscription.</p>
    </li>
    <li>
      <p>Choose a region or an affinity group in which to locate the storage. If you will be using storage from your Windows Azure application, select the same region where you will deploy your application.</p>
    </li>
    <li>
      <p>Click <strong>OK</strong>.</p>
    </li>
    <li>
      <p>Click the <strong>View</strong> button in the right-hand column below to display and save the <strong>Primary access key</strong> for the storage account. You will need this in subsequent steps to access storage. <br /><img src="../../../DevCenter/dotNet/Media/blob4.png" alt="Blob4" /></p>
    </li>
  </ol>
  <h2>
    <a name="bkmk_CreateJavaApp">
    </a>Create a Java Application</h2>
  <p>In this guide, you will use storage features which can be run within a Java application locally, or in code running within a web role or worker role in Windows Azure. We assume you have downloaded and installed the Java Development Kit (JDK), and followed the instructions in <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh690953(v=vs.103).aspx">Download the Windows Azure SDK for Java</a> to install the Windows Azure Libraries for Java and the Windows Azure SDK, and have created a Windows Azure storage account in your Windows Azure subscription.</p>
  <p>You can use any development tools to create your application, including Notepad. All you need is the ability to compile a Java project and reference the Windows Azure Libraries for Java.</p>
  <h2>
    <a name="bkmk_ConfigApp">
    </a>Configure your Application to Access Table Storage</h2>
  <p>Add the following import statements to the top of the Java file where you want to use Windows Azure storage APIs to access tables:</p>
  <pre class="prettyprint">// Include the following imports to use table APIs
import com.microsoft.windowsazure.services.core.storage.*;
import com.microsoft.windowsazure.services.table.client.*;
import com.microsoft.windowsazure.services.table.client.TableQuery.*;</pre>
  <h2>
    <a name="bkmk_SetupConnectString">
    </a>Setup a Windows Azure Storage Connection String</h2>
  <p>A Windows Azure storage client uses a storage connection string to store endpoints and credentials for accessing storage services. When running in a client application, you must provide the storage connection string in the following format, using the name of your storage account and the Primary access key for the storage account listed in the Management Portal for the <em>AccountName</em> and <em>AccountKey</em> values. This example shows how you can declare a static field to hold the connection string:</p>
  <pre class="prettyprint">// Define the connection-string with your values
public static final String storageConnectionString = 
    "DefaultEndpointsProtocol=http;" + 
    "AccountName=<em>your_storage_account</em>;" + 
    "AccountKey=<em>your_storage_account_key</em>";</pre>
  <p>In an application running within a role in Windows Azure, this string can be stored in the service configuration file, ServiceConfiguration.cscfg, and can be accessed with a call to the <strong>RoleEnvironment.getConfigurationSettings</strong> method. Here’s an example of getting the connection string from a <strong>Setting</strong> element named <em>StorageConnectionString</em> in the service configuration file:</p>
  <pre class="prettyprint">// Retrieve storage account from connection-string
String storageConnectionString = 
    RoleEnvironment.getConfigurationSettings().get("StorageConnectionString");</pre>
  <p>The samples below assume that you have used one of these two definitions to get the storage connection string.</p>
  <h2>
    <a name="bkmk_create-table">
    </a>How To: Create a Table</h2>
  <p>A <strong>CloudTableClient</strong> object lets you get reference objects for tables and entities. The following code creates a <strong>CloudTableClient</strong> object and uses it to create a new table. All code in this guide uses a storage connection string stored in the Windows Azure application's service configuration. There are also other ways to create <strong>CloudStorageAccount</strong> object.</p>
  <pre class="prettyprint">// Retrieve storage account from connection-string
CloudStorageAccount storageAccount =
    CloudStorageAccount.parse(storageConnectionString);
 
// Create the table client.
CloudTableClient tableClient = storageAccount.createCloudTableClient();
 
// Create the table if it doesn't exist.
String tableName = "people";
tableClient.createTableIfNotExists(tableName);</pre>
  <h2>
    <a name="bkmk_add-entity">
    </a>How To: Add an Entity to a Table</h2>
  <p>Entities map to Java objects using a custom class implementing <strong>TableEntity</strong>. For convenience, the <strong>TableServiceEntity</strong> class implements <strong>TableEntity</strong> and uses reflection to map properties to getter and setter methods named for the properties. To add an entity to a table, first create a class that defines the properties of your entity. The following code defines an entity class that uses the customer's first name as the row key, and last name as the partition key. Together, an entity's partition and row key uniquely identify the entity in the table. Entities with the same partition key can be queried faster than those with different partition keys.</p>
  <pre class="prettyprint">public class CustomerEntity extends TableServiceEntity {
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
}</pre>
  <p>Table operations involving entities require a <strong>TableOperation</strong> object. This object defines the operation to be performed on an entity, which can be executed with a <strong>CloudTableClient</strong> object. The following code creates a new instance of the <strong>CustomerEntity</strong> class with some customer data to be stored. The code next calls <strong>TableOperation.insert</strong> to create a <strong>TableOperation</strong> object to insert an entity into a table, and associates the new <strong>CustomerEntity</strong> with it. Finally, the code calls the <strong>execute</strong> method on the <strong>CloudTableClient</strong>, specifying the "people" table and the new <strong>TableOperation</strong>, which then sends a request to the storage service to insert the new customer entity into the "people" table.</p>
  <pre class="prettyprint">// Retrieve storage account from connection-string
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
</pre>
  <h2>
    <a name="bkmk_insert-batch">
    </a>How To: Insert a Batch of Entities</h2>
  <p>You can insert a batch of entities to the table service in one write operation. The following code creates a <strong>TableBatchOperation</strong> object, then adds three insert operations to it. Each insert operation is added by creating a new entity object, setting its values, and then calling the <strong>insert</strong> method on the <strong>TableBatchOperation</strong> object to associate the entity with a new insert operation. Then the code calls <strong>execute</strong> on the <strong>CloudTableClient</strong>, specifying the "people" table and the <strong>TableBatchOperation</strong> object, which sends the batch of table operations to the storage service in a single request. Some things to note on batch operations:</p>
  <ol>
    <li>You can perform up to 100 insert, delete, merge, replace, insert or merge, and insert or replace operations in any combination in a single batch.</li>
    <li>A batch operation can have a retrieve operation, if it is the only operation in the batch.</li>
    <li>All entities in a single batch operation must have the same partition key.</li>
    <li>A batch operation is limited to a 4MB data payload.</li>
  </ol>
  <pre class="prettyprint">// Retrieve storage account from connection-string
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
tableClient.execute("people", batchOperation);</pre>
  <h2>
    <a name="bkmk_retrieve-all-entities">
    </a>How To: Retrieve All Entities in a Partition</h2>
  <p>To query a table for entities in a partition, you can use a <strong>TableQuery</strong>. Call <strong>TableQuery.from</strong> to create a query on a particular table that returns a specified result type. The following code specifies a filter for entities where 'Smith' is the partition key. <strong>TableQuery.generateFilterCondition</strong> is a helper method to create filters for queries. Call <strong>where</strong> on the reference returned by the <strong>TableQuery.from</strong> method to apply the filter to the query. When the query is executed with a call to <strong>execute</strong> on the <strong>CloudTableClient</strong> object, it returns an <strong>Iterator</strong> with the <strong>CustomerEntity</strong> result type specified. You can then use the <strong>Iterator</strong> returned in a for each loop to consume the results. This code prints the fields of each entity in the query results to the console.</p>
  <pre class="prettyprint">// Retrieve storage account from connection-string
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
TableQuery&lt;CustomerEntity&gt; partitionQuery =
    TableQuery.from("people", CustomerEntity.class)
    .where(partitionFilter);

// Loop through the results, displaying information about the entity.
for (CustomerEntity entity : tableClient.execute(partitionQuery)) {
    System.out.println(entity.getPartitionKey() + " " + entity.getRowKey() + 
        "\t" + entity.getEmail() + "\t" + entity.getPhoneNumber());
}</pre>
  <h2>
    <a name="bkmk_retrieve-range-entities">
    </a>How To: Retrieve a Range of Entities in a Partition</h2>
  <p>If you don't want to query all the entities in a partition, you can specify a range by using comparison operators in a filter. The following code combines two filters to get all entities in partition 'Smith' where the row key (first name) starts with a letter up to 'E' in the alphabet. Then it prints the query results. If you use the entities added to the table in the batch insert section of this guide, only two entities are returned this time (Ben and Denise Smith); Jeff Smith is not included.</p>
  <pre class="prettyprint">// Retrieve storage account from connection-string
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
TableQuery&lt;CustomerEntity&gt; rangeQuery =
    TableQuery.from("people", CustomerEntity.class)
    .where(combinedFilter);

// Loop through the results, displaying information about the entity
for (CustomerEntity entity : tableClient.execute(rangeQuery)) {
    System.out.println(entity.getPartitionKey() + " " + entity.getRowKey() + 
        "\t" + entity.getEmail() + "\t" + entity.getPhoneNumber());
}</pre>
  <h2>
    <a name="bkmk_retrieve-single-entity">
    </a>How To: Retrieve a Single Entity</h2>
  <p>You can write a query to retrieve a single, specific entity. The following code calls <strong>TableOperation.retrieve</strong> with partition key and row key parameters to specify the customer 'Jeff Smith', instead of creating a <strong>TableQuery</strong> and using filters to do the same thing. When executed, the retrieve operation returns just one entity, rather than a collection. The <strong>getResultAsType</strong> method casts the result to the type of the assignment target, a <strong>CustomerEntity</strong> object. If this type is not compatible with the type specified for the query, an exception will be thrown. A null value is returned if no entity has an exact partition and row key match. Specifying both partition and row keys in a query is the fastest way to retrieve a single entity from the Table service.</p>
  <pre class="prettyprint">// Retrieve storage account from connection-string
CloudStorageAccount storageAccount =
    CloudStorageAccount.parse(storageConnectionString);
 
// Create the table client.
CloudTableClient tableClient = storageAccount.createCloudTableClient();
 
// Retrieve the entity with partition key of "Smith" and row key of "Jeff"
TableOperation retrieveSmithJeff = 
    TableOperation.retrieve("Smith", "Jeff", CustomerEntity.class);

// Submit the operation to the table service and get the specific entity.
CustomerEntity specificEntity =
    tableClient.execute("people", retrieveSmithJeff).getResultAsType();</pre>
  <h2>
    <a name="bkmk_modify-entity">
    </a>How To: Modify an Entity</h2>
  <p>To modify an entity, retrieve it from the table service, make changes to the entity object, and save the changes back to the table service with a replace or merge operation. The following code changes an existing customer's phone number. Instead of calling <strong>TableOperation.insert</strong> like we did to insert, this code calls <strong>TableOperation.replace</strong>. The <strong>CloudTableClient.execute</strong> method calls the table service, and the entity is replaced, unless another application changed it in the time since this application retrieved it. When that happens, an exception is thrown, and the entity must be retrieved, modified, and saved again. This optimistic concurrency retry pattern is common in a distributed storage system.</p>
  <pre class="prettyprint">// Retrieve storage account from connection-string
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
</pre>
  <h2>
    <a name="bkmk_query-entity-properties">
    </a>How To: Query a Subset of Entity Properties</h2>
  <p>A query to a table can retrieve just a few properties from an entity. This technique, called projection, reduces bandwidth and can improve query performance, especially for large entities. The query in the following code uses the <strong>select</strong> method to return only the email addresses of entities in the table. The results are projected into a collection of <strong>String</strong> with the help of an <strong>EntityResolver</strong>, which does the type conversion on the entities returned from the server. You can learn more about projection in this <a href="http://blogs.msdn.com/b/windowsazurestorage/archive/2011/09/15/windows-azure-tables-introducing-upsert-and-query-projection.aspx">blog post</a>. Note that projection is not supported on the local storage emulator, so this code runs only when using an account on the table service.</p>
  <pre class="prettyprint">// Retrieve storage account from connection-string
CloudStorageAccount storageAccount =
    CloudStorageAccount.parse(storageConnectionString);
 
// Create the table client.
CloudTableClient tableClient = storageAccount.createCloudTableClient();
 
// Define a projection query that retrieves only the Email property
TableQuery&lt;CustomerEntity&gt; projectionQuery = 
    TableQuery.from("people", CustomerEntity.class)
    .select(new String[] {"Email"});

// Define a Entity resolver to project the entity to the Email value.
EntityResolver&lt;String&gt; emailResolver = new EntityResolver&lt;String&gt;() {
    @Override
    public String resolve(String PartitionKey, String RowKey, Date timeStamp,
            HashMap&lt;String, EntityProperty&gt; properties, String etag) {
        return properties.get("Email").getValueAsString();
    }
};

// Loop through the results, displaying the Email values.
for (String projectedString : 
        tableClient.execute(projectionQuery, emailResolver)) {
    System.out.println(projectedString);
}</pre>
  <h2>
    <a name="bkmk_insert-entity">
    </a>How To: Insert-or-Replace an Entity</h2>
  <p>Often you want to add an entity to a table without knowing if it already exists in the table. An insert-or-replace operation allows you to make a single request which will insert the entity if it does not exist or replace the existing one if it does. Building on prior examples, the following code inserts or replaces the entity for 'Walter Harp'. After creating a new entity, this code calls the <strong>TableOperation.insertOrReplace</strong> method. This code then calls <strong>execute</strong> on the <strong>CloudTableClient</strong> with the table and the insert or replace table operation as the parameters. To update only part of an entity, the <strong>TableOperation.insertOrMerge</strong> method can be used instead. Note that insert-or-replace is not supported on the local storage emulator, so this code runs only when using an account on the table service. You can learn more about insert-or-replace and insert-or-merge in this <a href="http://blogs.msdn.com/b/windowsazurestorage/archive/2011/09/15/windows-azure-tables-introducing-upsert-and-query-projection.aspx">blog post</a>.</p>
  <pre class="prettyprint">// Retrieve storage account from connection-string
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
tableClient.execute("people", insertCustomer5);</pre>
  <h2>
    <a name="bkmk_delete-entity">
    </a>How To: Delete an Entity</h2>
  <p>You can easily delete an entity after you have retrieved it. Once the entity is retrieved, call <strong>TableOperation.delete</strong> with the entity to delete. Then call <strong>execute</strong> on the <strong>CloudTableClient</strong>. The following code retrieves and deletes a customer entity.</p>
  <pre class="prettyprint">// Retrieve storage account from connection-string
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
tableClient.execute("people", deleteSmithJeff);</pre>
  <h2>
    <a name="bkmk_delete-table">
    </a>How To: Delete a Table</h2>
  <p>Finally, the following code deletes a table from a storage account. A table which has been deleted will be unavailable to be recreated for a period of time following the deletion, usually less than forty seconds.</p>
  <pre class="prettyprint">// Retrieve storage account from connection-string
CloudStorageAccount storageAccount =
    CloudStorageAccount.parse(storageConnectionString);
 
// Create the table client.
CloudTableClient tableClient = storageAccount.createCloudTableClient();
 
// Delete the table and all its data if it exists.
tableClient.deleteTableIfExists("people");</pre>
  <h2>
    <a name="bkmk_next-steps">
    </a>Next Steps</h2>
  <p>Now that you've learned the basics of table storage, follow these links to learn how to do more complex storage tasks.</p>
  <ul>
    <li>See the MSDN Reference: <a href="http://msdn.microsoft.com/en-us/library/windowsazure/gg433040.aspx">Storing and Accessing Data in Windows Azure</a></li>
    <li>Visit the <a href="http://blogs.msdn.com/b/windowsazurestorage/">Windows Azure Storage Team Blog</a></li>
  </ul>