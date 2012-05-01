  <properties umbracoNaviHide="0" pageTitle="How to Use the Table Storage Service from .NET" metaKeywords="Get started Azure table, Azure nosql, Azure large structured data store, Azure table, Azure table storage, Azure table .NET, Azure table storage .NET, Azure table C#, Azure table storage C#" metaDescription="Get started with Windows Azure table storage. Learn how to use the Windows Azure table storage service to create and delete tables and insert and query entities in a table." linkid="dev-net-how-to-table-services" urlDisplayName="Table Service" headerExpose="" footerExpose="" disqusComments="1" />
  <h1>How to Use the Table Storage Service</h1>
  <p>This guide will show you how to perform common scenarios using the Windows Azure Table storage service. The samples are written in C# code and use the .NET API. The scenarios covered include <strong>creating and deleting a table, inserting and querying entities in a table</strong>. For more information on tables, see the <a href="#next-steps">Next Steps</a> section.</p>
  <h2>Table of Contents</h2>
  <ul>
    <li>
      <a href="#what-is">What is the Table Service</a>
    </li>
    <li>
      <a href="#concepts">Concepts</a>
    </li>
    <li>
      <a href="#create-account">Create a Windows Azure Storage Account</a>
    </li>
    <li>
      <a href="#create-project">Create a Windows Azure Project in Visual Studio</a>
    </li>
    <li>
      <a href="#configure-access">Configure your Application to Access Storage</a>
    </li>
    <li>
      <a href="#setup-connection-string">Setup a Windows Azure Storage Connection String</a>
    </li>
    <li>
      <a href="#create-table">How To: Create a Table</a>
    </li>
    <li>
      <a href="#add-entity">How To: Add an Entity to a Table</a>
    </li>
    <li>
      <a href="#insert-batch">How To: Insert a Batch of Entities</a>
    </li>
    <li>
      <a href="#retrieve-all-entities">How To: Retrieve All Entities in a Partition</a>
    </li>
    <li>
      <a href="#retrieve-range-entities">How To: Retrieve a Range of Entities in a Partition</a>
    </li>
    <li>
      <a href="#retrieve-single-entity">How To: Retrieve a Single Entity</a>
    </li>
    <li>
      <a href="#update-entity">How To: Update an Entity</a>
    </li>
    <li>
      <a href="#query-entity-properties">How To: Query a Subset of Entity Properties</a>
    </li>
    <li>
      <a href="#insert-entity">How To: Insert-or-Replace an Entity</a>
    </li>
    <li>
      <a href="#delete-entity">How To: Delete an Entity</a>
    </li>
    <li>
      <a href="#delete-table">How To: Delete a Table</a>
    </li>
    <li>
      <a href="#next-steps">Next Steps</a>
    </li>
  </ul>
  <h2>
    <a name="what-is">
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
    <a name="concepts">
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
        <strong>Properties</strong>: A property is a name-value pair. Each entity can include up to 252 properties to store data. Each entity also has 3 system properties that specify a partition key, a row key, and a timestamp. Entities with the same partition key can be queried more quickly, and inserted/updated in atomic operations. An entity's row key is its unique identifier within a partition.</p>
    </li>
  </ul>
  <h2>
    <a name="create-account">
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
    <a name="create-project">
    </a>Create a Windows Azure Project in Visual Studio</h2>
  <p>In this guide, you will use storage features within a Windows Azure cloud project in Visual Studio. To learn how to create Windows Azure cloud projects:</p>
  <ol>
    <li>
      <p>
        <a href="/en-us/develop/net/">Download and install the Windows Azure SDK for .NET</a> if you have not already done so.</p>
    </li>
    <li>
      <p>Read <a href="http://msdn.microsoft.com/en-us/library/windowsazure/ee405487.aspx">Creating a Windows Azure Project in Visual Studio</a> on MSDN, and follow the steps for creating a Windows Azure project with at least one web or worker role.</p>
    </li>
  </ol>
  <h2>
    <a name="configure-access">
    </a>Configure Your Application to Access Storage</h2>
  <p>The web and worker roles in your cloud project already contain most of the references to use Table Services. However, you need to manually add a reference to <strong>System.Data.Services.Client</strong>:</p>
  <ol>
    <li>
      <p>In Solution Explorer, right-click <strong>References</strong>, and then click <strong>Add Reference</strong>.</p>
    </li>
    <li>
      <p>In the .NET tab, click <strong>System.Data.Services.Client</strong>.</p>
    </li>
    <li>
      <p>Click <strong>OK</strong>.</p>
    </li>
  </ol>
  <p>Then, add the following to the top of any C# file where you want to use Windows Azure Table Services:</p>
  <pre class="prettyprint">using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;
using System.Data.Services.Client;</pre>
  <h2>
    <a name="setup-connection-string">
    </a>Setup a Windows Azure Storage Connection String</h2>
  <p>The Windows Azure .NET storage client uses a storage connection string to store endpoints and credentials for accessing storage services. You can put your storage connection string in a configuration file, rather than hard-coding it in code. One option is to use .NET's built-in configuration mechanism (e.g. <strong>Web.config</strong> for web applications). In this guide, you will store your connection string using Windows Azure service configuration. The service configuration is unique to Windows Azure projects and allows you to change configuration from the Management Portal without redeploying your application.</p>
  <p>To configure your connection string in the Windows Azure service configuration:</p>
  <ol>
    <li>
      <p>In the Solution Explorer, in the <strong>Roles</strong> folder, right-click a web role or worker role and click <strong>Properties</strong>.<br /><img src="../../../DevCenter/dotNet/Media/blob5.png" alt="Blob5" /></p>
    </li>
    <li>
      <p>Click <strong>Settings</strong> and click <strong>Add Setting</strong>.<br /><img src="../../../DevCenter/dotNet/Media/blob6.png" alt="Blob6" /></p>
      <p>A new setting is created.</p>
    </li>
    <li>
      <p>In the <strong>Type</strong> drop-down of the <strong>Setting1</strong> entry, choose <strong>Connection String</strong>.<br /><img src="../../../DevCenter/dotNet/Media/blob7.png" alt="Blob7" /></p>
    </li>
    <li>
      <p>Click the <strong>...</strong> button at the right end of the <strong>Setting1</strong> entry. The <strong>Storage Account Connection String</strong> dialog opens.</p>
    </li>
    <li>
      <p>Choose whether you want to target the storage emulator (Windows Azure storage simulated on your desktop) or an actual storage account in the cloud, and click <strong>OK</strong>. The code in this guide works with either option.<br /><img src="../../../DevCenter/dotNet/Media/blob8.png" alt="Blob8" /></p>
    </li>
    <li>
      <p>Change the entry <strong>Name</strong> from <strong>Setting1</strong> to <strong>StorageConnectionString</strong>. You will reference this name in the code in this guide.<br /><img src="../../../DevCenter/dotNet/Media/blob9.png" alt="Blob9" /></p>
    </li>
  </ol>
  <p>You are now ready to perform the How To's in this guide.</p>
  <h2>
    <a name="create-table">
    </a>How To: Create a Table</h2>
  <p>A <strong>CloudTableClient</strong> object lets you get reference objects for tables and entities. The following code creates a <strong>CloudTableClient</strong> object and uses it to create a new table. All code in this guide uses a storage connection string stored in the Windows Azure application's service configuration. There are also other ways to create <strong>CloudStorageAccount</strong> object.</p>
  <pre class="prettyprint">// Retrieve storage account from connection-string
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
    RoleEnvironment.GetConfigurationSettingValue("StorageConnectionString"));

// Create the table client
CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

// Create the table if it doesn't exist
string tableName = "people";
tableClient.CreateTableIfNotExist(tableName);
</pre>
  <h2>
    <a name="add-entity">
    </a>How To: Add an Entity to a Table</h2>
  <p>Entities map to C# objects using a custom class derived from <strong>TableServiceEntity</strong>. To add an entity to a table, first create a class that defines the properties of your entity. The following code defines an entity class that uses the customer's first name as the row key, and last name as the partition key. Together, an entity's partition and row key uniquely identify the entity in the table. Entities with the same partition key can be queried faster than those with different partition keys.</p>
  <pre class="prettyprint">public class CustomerEntity : TableServiceEntity
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
</pre>
  <p>Table operations involving entities require a <strong>TableServiceContext</strong> object. This object tracks the client-side state of all table entities created and accessed in client code. Maintaining a client-side object representing each entity makes write operations more efficient because only objects with changes are updated on the table service when save operations are executed. The following code creates a <strong>TableServiceContext</strong> object by calling the <strong>GetDataServiceContext</strong> method. Then the code creates an instance of the <strong>CustomerEntity</strong> class. The code calls <strong>serviceContext.AddObject</strong> to insert the new entity into the table. This adds the entity object to the <strong>serviceContext</strong>, but no service operations occur. Finally, the code sends the new entity to the table service when the <strong>SaveChangesWithRetries</strong> method is called.</p>
  <pre class="prettyprint">// Retrieve storage account from connection-string
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
</pre>
  <h2>
    <a name="insert-batch">
    </a>How To: Insert a Batch of Entities</h2>
  <p>You can insert a batch of entities to the table service in one write operation. The following code creates three entity objects and adds each to the service context using the <strong>AddObject</strong> method. Then the code calls <strong>SaveChangesWithRetries</strong> with the <strong>SaveChangesOptions.Batch</strong> parameter. If you omit <strong>SaveChangesOptions.Batch</strong>, three separate calls to the table service would occur. Some other notes on batch operations:</p>
  <ol>
    <li>You can perform batch updates, deletes, or inserts.</li>
    <li>A single batch operation can include up to 100 entities.</li>
    <li>All entities in a single batch operation must have the same partition key.</li>
  </ol>
  <pre class="prettyprint">// Retrieve storage account from connection-string
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
</pre>
  <h2>
    <a name="retrieve-all-entities">
    </a>How To: Retrieve All Entities in a Partition</h2>
  <p>To query a table for entities in a partition, you can use a LINQ query. Call <strong>serviceContext.CreateQuery</strong> to create a query from your data source. The following code specifies a filter for entities where 'Smith' is the partition key. Call <strong>AsTableServiceQuery&lt;CustomerEntity&gt;</strong> on the result of the LINQ query to finish creating the <strong>CloudTableQuery</strong> object. You can then use the <strong>partitionQuery</strong> object you created in a <strong>foreach</strong> loop to consume the results. This code prints the fields of each entity in the query results to the console.</p>
  <pre class="prettyprint">// Retrieve storage account from connection-string
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
    RoleEnvironment.GetConfigurationSettingValue("StorageConnectionString"));

// Create the table client
CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

// Get the data service context
TableServiceContext serviceContext = tableClient.GetDataServiceContext();

// Specify a partition query, using "Smith" as the partition key
CloudTableQuery&lt;CustomerEntity&gt; partitionQuery =
    (from e in serviceContext.CreateQuery&lt;CustomerEntity&gt;("people")
     where e.PartitionKey == "Smith"
     select e).AsTableServiceQuery&lt;CustomerEntity&gt;();

// Loop through the results, displaying information about the entity
foreach (CustomerEntity entity in partitionQuery)
{
    Console.WriteLine("{0}, {1}\t{2}\t{3}", entity.PartitionKey, entity.RowKey,
        entity.Email, entity.PhoneNumber);
}
</pre>
  <h2>
    <a name="retrieve-range-entities">
    </a>How To: Retrieve a Range of Entities in a Partition</h2>
  <p>If you don't want to query all the entities in a partition, you can specify a range by using the <strong>CompareTo</strong> method instead of using the usual greater-than (&gt;) and less-than (&lt;) operators. This is because the latter will result in improper query construction. The following code uses two filters to get all entities in partition 'Smith' where the row key (first name) starts with a letter up to 'E' in the alphabet. Then it prints the query results. If you use the entities added to the table in the batch insert section of this guide, only two entities are returned this time (Ben and Denise Smith); Jeff Smith is not included.</p>
  <pre class="prettyprint">// Retrieve storage account from connection-string
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
    RoleEnvironment.GetConfigurationSettingValue("StorageConnectionString"));

// Create the table client
CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

// Get the data service context
TableServiceContext serviceContext = tableClient.GetDataServiceContext();

// Specify a partition query, using "Smith" as the partition key,
// with the row key being up to the letter "E"
CloudTableQuery&lt;CustomerEntity&gt; entityRangeQuery =
    (from e in serviceContext.CreateQuery&lt;CustomerEntity&gt;("people")
     where e.PartitionKey == "Smith" &amp;&amp; e.RowKey.CompareTo("E") &lt; 0
     select e).AsTableServiceQuery&lt;CustomerEntity&gt;();

// Loop through the results, displaying information about the entity
foreach (CustomerEntity entity in entityRangeQuery)
{
    Console.WriteLine("{0}, {1}\t{2}\t{3}", entity.PartitionKey, entity.RowKey,
        entity.Email, entity.PhoneNumber);
}
</pre>
  <h2>
    <a name="retrieve-single-entity">
    </a>How To: Retrieve a Single Entity</h2>
  <p>You can write a query to retrieve a single, specific entity. The following code uses two filters to specify the customer 'Jeff Smith'. Instead of calling <strong>AsTableServiceQuery</strong>, this code calls <strong>FirstOrDefault</strong>. This method returns just one entity, rather than a collection, so the code assigns the return value directly to a <strong>CustomerEntity </strong>object. A null value is returned if no entity has an exact partition and row key match. Specifying both partition and row keys in a query is the fastest way to retrieve a single entity from the Table service.</p>
  <pre class="prettyprint">// Retrieve storage account from connection-string
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
    RoleEnvironment.GetConfigurationSettingValue("StorageConnectionString"));

// Create the table client
CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

// Get the data service context
TableServiceContext serviceContext = tableClient.GetDataServiceContext();

// Return the entity with partition key of "Smith" and row key of "Jeff"
CustomerEntity specificEntity =
    (from e in serviceContext.CreateQuery&lt;CustomerEntity&gt;("people")
     where e.PartitionKey == "Smith" &amp;&amp; e.RowKey == "Jeff"
     select e).FirstOrDefault();
</pre>
  <h2>
    <a name="update-entity">
    </a>How To: Update an Entity</h2>
  <p>To update an entity, retrieve it from the table service, modify the entity object, and save the changes back to the table service. The following code changes an existing customer's phone number. Instead of calling <strong>AddObject</strong> like we did to insert, this code calls <strong>UpdateObject</strong>. The <strong>SaveChangesWithRetries</strong> method calls the table service, and the entity is updated, unless another application changed it in the time since this application retrieved it. When that happens, an exception is thrown, and the entity must be retrieved, modified, and saved again. This retry pattern is common in a distributed storage system.</p>
  <pre class="prettyprint">// Retrieve storage account from connection-string
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
    RoleEnvironment.GetConfigurationSettingValue("StorageConnectionString"));

// Create the table client
CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

// Get the data service context
TableServiceContext serviceContext = tableClient.GetDataServiceContext();

// Return the entity with partition key of "Smith" and row key of "Jeff"
CustomerEntity specificEntity =
    (from e in serviceContext.CreateQuery&lt;CustomerEntity&gt;("people")
     where e.PartitionKey == "Smith" &amp;&amp; e.RowKey == "Jeff"
     select e).FirstOrDefault();

// Specify a new phone number
specificEntity.PhoneNumber = "425-555-0105";

// Update the entity
serviceContext.UpdateObject(specificEntity);

// Submit the operation to the table service
serviceContext.SaveChangesWithRetries();

</pre>
  <h2>
    <a name="query-entity-properties">
    </a>How To: Query a Subset of Entity Properties</h2>
  <p>A query to a table can retrieve just a few properties from an entity. This technique, called projection, reduces bandwidth and can improve query performance, especially for large entities. The query in the following code returns only the email addresses of entities in the table. You can learn more about projection in this <a href="http://blogs.msdn.com/b/windowsazurestorage/archive/2011/09/15/windows-azure-tables-introducing-upsert-and-query-projection.aspx">blog post</a>. Note that projection is not supported on the local storage emulator, so this code runs only when using an account on the table service.</p>
  <pre class="prettyprint">// Retrieve storage account from connection-string
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
    RoleEnvironment.GetConfigurationSettingValue("StorageConnectionString"));

// Create the table client
CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

// Get the data service context
TableServiceContext serviceContext = tableClient.GetDataServiceContext();

// Define a projection query that retrieves only the Email property
var projectionQuery = 
    from e in serviceContext.CreateQuery&lt;CustomerEntity&gt;("people")
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
</pre>
  <h2>
    <a name="insert-entity">
    </a>How To: Insert-or-Replace an Entity</h2>
  <p>Often you want to add an entity to a table without knowing if it already exists in the table. An insert-or-replace operation allows you to make a single request which will insert the entity if it does not exist or replace the existing one if it does. Building on prior examples, the following code inserts or replaces the entity for 'Walter Harp'. After creating a new entity, this code calls the <strong>serviceContext.AttachTo</strong> method. This code then calls <strong>UpdateObject</strong>, and finally calls <strong>SaveChangesWithRetries</strong> with the <strong>SaveChangesOptions.ReplaceOnUpdate</strong> parameter. Omitting the <strong>SaveChangesOptions.ReplaceOnUpdate</strong> parameter causes an insert-or-merge operation. Note that insert-or-replace is not supported on the local storage emulator, so this code runs only when using an account on the table service. You can learn more about insert-or-replace and insert-or-merge in this <a href="http://blogs.msdn.com/b/windowsazurestorage/archive/2011/09/15/windows-azure-tables-introducing-upsert-and-query-projection.aspx">blog post</a>.</p>
  <pre class="prettyprint">// Retrieve storage account from connection-string
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
</pre>
  <h2>
    <a name="delete-entity">
    </a>How To: Delete an Entity</h2>
  <p>You can easily delete an entity after you have retrieved it. You can also use the <strong>AttachTo</strong> method to begin tracking it without retrieving it from the server (see insert-or-replace above). Once the entity is tracked with <strong>serviceContext</strong>, call <strong>DeleteObject</strong> with the entity to delete. Then call <strong>SaveChangesWithRetries</strong>. The following code retrieves and deletes a customer entity.</p>
  <pre class="prettyprint">// Retrieve storage account from connection-string
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
    RoleEnvironment.GetConfigurationSettingValue("StorageConnectionString"));

// Create the table client
CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

// Get the data service context
TableServiceContext serviceContext = tableClient.GetDataServiceContext();

CustomerEntity specificEntity =
    (from e in serviceContext.CreateQuery&lt;CustomerEntity&gt;("people")
     where e.PartitionKey == "Smith" &amp;&amp; e.RowKey == "Jeff"
     select e).FirstOrDefault();

// Delete the entity
serviceContext.DeleteObject(specificEntity);

// Submit the operation to the table service
serviceContext.SaveChangesWithRetries();
</pre>
  <h2>
    <a name="delete-table">
    </a>How To: Delete a Table</h2>
  <p>Finally, the following code deletes a table from a storage account. A table which has been deleted will be unavailable to be recreated for a period of time following the deletion.</p>
  <pre class="prettyprint">// Retrieve storage account from connection-string
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
    RoleEnvironment.GetConfigurationSettingValue("StorageConnectionString"));

// Create the table client
CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

// Delete the table it if exists
tableClient.DeleteTableIfExist("people");
</pre>
  <h2>
    <a name="next-steps">
    </a>Next Steps</h2>
  <p>Now that you've learned the basics of table storage, follow these links to learn how to do more complex storage tasks.</p>
  <ul>
    <li>See the MSDN Reference: <a href="http://msdn.microsoft.com/en-us/library/windowsazure/gg433040.aspx">Storing and Accessing Data in Windows Azure</a></li>
    <li>Visit the <a href="http://blogs.msdn.com/b/windowsazurestorage/">Windows Azure Storage Team Blog</a></li>
  </ul>