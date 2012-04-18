# How to Use the Blob Storage Service from PHP

This guide will show you how to perform common scenarios using the Windows Azure Blob storage service. The samples are written in PHP and use the [Windows Azure SDK for PHP] [download]. The scenarios covered include **creating and deleting a table, and inserting, deleting, and querying entities in a table**. For more information on blobs, see the [Next Steps](#NextSteps) section.

##What is Blob Storage

	(TODO: Reference reusable content chunk.)

##Table of Contents

* [Concepts](#Concepts)
* [Create a Windows Azure Storage Account](#CreateAccount)
* [Create a PHP Application](#CreateApplication)
* [Configure your Application to Access Table Storage](#ConfigureStorage)
* [Setup a Windows Azure Storage Connect String](#ConnectionString)
* [How to Create a Table](#CreateTable)
* [How to Add an Entity to a Table](#AddEntity)
* [How to Retrieve a Single Entity](#RetrieveEntity)
* [How to Retrieve All Entities in a Partition](#RetEntitiesInPartition)
* [How to Retrieve a Subset of Entities in a Partition](#RetrieveSubset)
* [How to Retrieve a Subset of Entity Properties](#RetPropertiesSubset)
* [How to Update an Entity](#UpdateEntity)
* [How to Batch Table Operations](#BatchOperations)
* [How to Delete a Blob](#DeleteBlob)
* [How to Delete a Table](#DeleteTable)
* [Next Steps](#NextSteps)

<h2 id="Concepts">Concepts</h2>

	(TODO: Reference reusable content chunk.)

<h2 id="CreateAccount">Create a Windows Azure Storage Account</h2>

	(TODO: Reference reusable content chunk.)

<h2 id="CreateApplication">Create a PHP Application</h2>

The only requirement for creating a PHP application that accesses the Windows Azure Table storage service is the referencing of classes in the Windows Azure SDK for PHP from within your code. You can use any development tools to create your application, including Notepad.

In this guide, you will use storage features which can be called from within a PHP application locally, or in code running within a Windows Azure web role, worker role, or web site. We assume you have downloaded and installed PHP, followed the instructions in [Download the Windows Azure SDK for PHP] [download], and have created a Windows Azure storage account in your Windows Azure subscription.


<h2 id="ConfigureStorage">Configure your Application to Access Table Storage</h2>

To use the Windows Azure storage APIs to access blobs, you need to:

1. Reference the `Autoload.php` file (from the Windows Azure SDK for PHP) using the [require_once][require_once] statement, and
2. Reference any classes you might use.

The following example shows how to include the `Autoload.php` file and references some of the classes you might use with the Table API:

	require_once 'Autoload.php';

	use WindowsAzure\Services\Table\Utilities\AtomReaderWriter;
	use WindowsAzure\Services\Table\Utilities\MimeReaderWriter;
	use WindowsAzure\Core\WindowsAzureUtilities;
	use WindowsAzure\Core\ServiceException;
	use WindowsAzure\Resources;
	use WindowsAzure\Services\Table\TableRestProxy;
	use WindowsAzure\Services\Core\Models\ServiceProperties;
	use WindowsAzure\Services\Table\Models\QueryTablesOptions;
	use WindowsAzure\Services\Table\Models\Query;
	use WindowsAzure\Services\Table\Models\Filters\Filter;
	use WindowsAzure\Services\Table\Models\Entity;
	use WindowsAzure\Services\Table\Models\EdmType;
	use WindowsAzure\Services\Table\Models\QueryEntitiesOptions;
	use WindowsAzure\Services\Table\Models\BatchOperations;

In the examples below, the `require_once` statement will be shown always, but only the classes necessary for the example to execute will be referenced.

<h2 id="ConnectionString">Setup a Windows Azure Storage Connection String</h2>

A Windows Azure Table storage client uses a **Configuration** object for storing connection string information. After creating a new **Configuration** object, you must set properties for the name of your storage account, the primary access key, and the table URI for the storage account listed in the Management Portal. This example shows how you can create a new configuration object and set these properties:

	require_once 'Autoload.php';

	use WindowsAzure\Services\Core\Configuration;
	use WindowsAzure\Services\Table\TableSettings;
	
	$storage_account_name = "your_storage_account_name";
	$storage_account_key = "your_storage_account_key";
	$storage_account_URI = "http://your_storage_account_name.table.core.windows.net"
	
	$config = new Configuration();
	$config->setProperty(TableSettings::ACCOUNT_NAME, $storage_account_name);
	$config->setProperty(TableSettings::ACCOUNT_KEY, $storgae_account_key);
	$config->setProperty(TableSettings::URI, $storage_account_URI);

You will pass this `Configuration` instance (`$config`) to other objects when using the Table API.

<h2 id="CreateTable">How to Create a Table</h2>

A **TableService** object lets you create a table with the **createTable** method. When creating a table, you can set the Table Service timeout. (For more information about the table service timeout, see [Setting Timeouts for Table Service Operations][table-service-timeouts].) If you attempt to create a table that already exists, an exception will be thrown and should be handled appropriately. (For more information about error codes, see [Table Service Error Codes][table-error-codes].)

	require_once 'Autoload.php';

	use WindowsAzure\Services\Table\TableService;
	use WindowsAzure\Services\Table\Models\TableServiceOptions;
	use WindowsAzure\Core\ServiceException;

	// Create table service proxy.
	$table_proxy = TableService::create($config);

	// OPTIONAL: Set table service timeout.
	$options = new TableServiceOptions();
	$options->setTimeout('20'); //Default value is 30.

	try	{
		// Create table.
		$table_proxy->createTable("mytable", $options);
	}
	catch(ServiceException $e){
		$code = $e->getCode();
		$error_message = $e->getMessage();
		// Handle exception based on error codes and messages.
		// Error codes and messages can be found here: 
		// http://msdn.microsoft.com/en-us/library/windowsazure/dd179438.aspx
	}

For information about restrictions on Table names, see [Understanding the Table Service Data Model][table-data-model].

<h2 id="AddEntity">How to Add an Entity to a Table</h2>

To add an entity to a table, create a new **Entity** object and pass it to **TableService->insertEntity**. Note that when you create an entity you must specify a `PartitionKey` and `RowKey`. These are the unique identifiers for an entity and are values that can be queried much faster than other entity properties. The system uses `PartitionKey` to automatically distribute the table’s entities over many storage nodes. Entities with the same `PartitionKey` are stored on the same node. The `RowKey` is the unique ID of an entity within a partition.

	require_once 'Autoload.php';

	use WindowsAzure\Services\Table\TableService;
	use WindowsAzure\Services\Table\Models\TableServiceOptions;
	use WindowsAzure\Services\Table\Models\Entity;
	use WindowsAzure\Services\Table\Models\EdmType;
	use WindowsAzure\Utilities;

	// Create table service proxy.
	$table_proxy = TableService::create($config);
	
	// Create entity.
	$entity = new Entity();

	// PartitionKey and RowKey are required.
	$entity->setPartitionKey("tasksSeattle");
	$entity->setRowKey("1");

	// Other properties are optional.
	$entity->addProperty("Description", null, "Take out the trash."); // Default type is Edm::STRING.
	$entity->addProperty("DueDate", EdmType::DATETIME, new DateTime("2012-11-05T08:15:00-08:00"));
	$entity->addProperty("Location", EdmType::STRING, "Home");
	
	// Insert entity.
	$table_proxy->insertEntity("mytable", $entity);

For information about Table properties and types, see [Understanding the Table Service Data Model][table-data-model].

The **TableService** offers two alternative methods for inserting entities: **insertOrMergeEntity** and **insertOrReplaceEntity**. To use these methods, create a new **Entity** and pass it as a parameter to either method. Each method will insert the entity if it does not exist. If the entity already exists, **insertOrMergeEntity** will update property values if the properties already exist and add new properties if they do not exist, while **insertOrReplaceEntity** completely replaces an existing entity. The following example shows how to use **insertorMergeEntity**. If the entity with `PartitionKey` "tasksSeattle" and `RowKey` "1" does not already exist, it will be inserted. However, if it has previously been inserted (as shown in the example above), the `DueDate` property will be updated and the `Status` property will be added. The `Description` and `Location` properties are updated with the same values as before. If these latter two properties were not set, the existing values would remain unchanged.

	require_once 'Autoload.php';

	use WindowsAzure\Services\Table\TableService;
	use WindowsAzure\Services\Table\Models\TableServiceOptions;
	use WindowsAzure\Services\Table\Models\Entity;
	use WindowsAzure\Services\Table\Models\EdmType;
	use WindowsAzure\Utilities;

	// Create table service proxy.
	$table_proxy = TableService::create($config);
	
	//Create new entity.
	$entity = new Entity();
	
	// PartitionKey and RowKey are required.
	$entity->setPartitionKey("tasksSeattle");
	$entity->setRowKey("1");
	$entity->setTimestamp(Utilities::isoDate()); //This requirement is a bug.
	
	// If entity exists, existing properties are updated with new values and
	// new properties are added. Missing properties are unchanged.
	$entity->addProperty("Description", null, "Take out the trash.");
	$entity->addProperty("DueDate", EdmType::DATETIME, new DateTime()); // Modified the DueDate field.
	$entity->addProperty("Location", EdmType::STRING, "Home");
	$entity->addProperty("Status", EdmType::STRING, "Complete"); // Added Status field.
	
	$table_proxy->insertOrMergeEntity("mytable", $entity);
	// Calling insertOrReplaceEntity would simply replace the entity
	// having PartitionKey "tasksSeattle" and RowKey "1".
	   

<h2 id="RetrieveEntity">How to Retrieve a Single Entity</h2>

	(NOTE: There is a pending DCR that may change the coding pattern here and in other examples. The Query object may be abstracted, so that all options are passed in the $options object.)

The **TableService->getEntity** method allows you to retrieve a single entity by querying for its `PartitionKey` and `RowKey`. Queries are constructed using filters (for more information, see [Querying Tables and Entities][filters]). In the example below, a raw string is passed as a filter to a **Query** object, which in turn is passed to **QueriesEntitiesOptions** object. The **QueryEntitiesOptions** object is then passed to the **getEntity** method.

	require_once 'Autoload.php';

	use WindowsAzure\Services\Table\TableService;
	use WindowsAzure\Services\Table\Models\QueryEntitiesOptions;
	use WindowsAzure\Services\Table\Models\QueryEntitiesResult;
	use WindowsAzure\Services\Table\Models\Query;
	use WindowsAzure\Services\Table\Models\Filters\Filter;

	// Create table service proxy.
	$table_proxy = TableService::create($config);
	
	$query = new Query();
	$filter = "PartitionKey eq 'tasksSeattle' and RowKey eq '1'";
	$query->setFilter(Filter::applyRawString($filter));
    $options = new QueryEntitiesOptions();
    $options->setQuery($query);
	
	$result = $table_proxy->queryEntities("mytable", $options);
	
	$entities = $result->getEntities();
	
	echo count($entities)."<br />"; // Should be 1;
	echo $entities[0]->getPartitionKey().":".$entities[0]->getRowKey();

<h2 id="RetEntitiesInPartition">How to Retrieve All Entities in a Partition</h2>

As shown in the previous example, you can query for entities in a table by using a filter. To retrieve all entities in partition, use the filter "PartitionKey eq *partition_name*".

	require_once 'Autoload.php';

	use WindowsAzure\Services\Table\TableService;
	use WindowsAzure\Services\Table\Models\QueryEntitiesOptions;
	use WindowsAzure\Services\Table\Models\QueryEntitiesResult;
	use WindowsAzure\Services\Table\Models\Query;
	use WindowsAzure\Services\Table\Models\Filters\Filter;

	// Create table service proxy.
	$table_proxy = TableService::create($config);
	
	$query = new Query();
	$filter = "PartitionKey eq 'tasksSeattle'";
	$query->setFilter(Filter::applyRawString($filter));
    $options = new QueryEntitiesOptions();
    $options->setQuery($query);
	
	$result = $table_proxy->queryEntities("mytable", $options);
	
	$entities = $result->getEntities();
	
	foreach($entities as $entity){
		echo $entity->getPartitionKey().":".$entity->getRowKey()."<br />";
	}

<h2 id="RetrieveSubset">How to Retrieve a Subset of Entities in a Partition</h2>

The same pattern used in the previous two examples can be used to retrieve any subset of entities in a partition. The subset of entities you retrieve will be determined by the filter you use (for more information, see [Querying Tables and Entities][filters]).The following example shows how to use a filter to retrieve all entities with a specific `Location` and a `DueDate` less than a specified date.

	use WindowsAzure\Services\Table\TableService;
	use WindowsAzure\Services\Table\Models\QueryEntitiesOptions;
	use WindowsAzure\Services\Table\Models\QueryEntitiesResult;
	use WindowsAzure\Services\Table\Models\Query;
	use WindowsAzure\Services\Table\Models\Filters\Filter;

	// Create table service proxy.
	$table_proxy = TableService::create($config);
	
	$query = new Query();
	$filter = "Location eq 'Office' and DueDate lt '2012-11-5'";
	$query->setFilter(Filter::applyRawString($filter));
    $options = new QueryEntitiesOptions();
    $options->setQuery($query);
	
	$result = $table_proxy->queryEntities("mytable", $options);
	
	$entities = $result->getEntities();
	
	foreach($entities as $entity){
		echo $entity->getPartitionKey().":".$entity->getRowKey()."<br />";
	}

<h2 id="RetPropertiesSubset">How to Retrieve a Subset of Entity Properties</h2>

A query can retrieve a subset of entity properties. This technique, called *projection*, reduces bandwidth and can improve query performance, especially for large entities. To specify a property to be retrieved, pass the name of the property to the **Query->addSelectField** method. You can call this method multiple times to add more properties. After executing **TableService->queryEntities**, the returned entities will only have the selected properties. (If you want to return a subset of Table entities, use a filter as shown in the queries above.)

	require_once 'Autoload.php';

	use WindowsAzure\Services\Table\TableService;
	use WindowsAzure\Services\Table\Models\QueryEntitiesOptions;
	use WindowsAzure\Services\Table\Models\QueryEntitiesResult;
	use WindowsAzure\Services\Table\Models\Query;
	use WindowsAzure\Services\Table\Models\Filters\Filter;

	// Create table service proxy.
	$table_proxy = TableService::create($config);
	
	$query = new Query();
	$query->addSelectField("Description");
    $options = new QueryEntitiesOptions();
    $options->setQuery($query);
	
	$result = $table_proxy->queryEntities("mytable", $options);
	
	// All entities in the table are returned, regardless of whether they have the Description field.
	// To limit the results returned, use a filter.
	$entities = $result->getEntities();

	foreach($entities as $entity){
		$description = $entity->getProperty("Description")->getValue();
		echo $description."<br />";
	}

<h2 id="UpdateEntity">How to Update an Entity</h2>

An existing entity can be updated by using the **Entity->setProperty** and **Entity->addProperty** methods on the entity, and then calling **TableService->updateEntity**. The following example retrieves an entity, modifies one property, removes another property, and adds a new property. Note that removing a property is setting its value to **null**. 

	require_once 'Autoload.php';
	
	use WindowsAzure\Services\Table\TableService;
	use WindowsAzure\Services\Table\Models\QueryEntitiesOptions;
	use WindowsAzure\Services\Table\Models\QueryEntitiesResult;
	use WindowsAzure\Services\Table\Models\Query;
	use WindowsAzure\Services\Table\Models\EdmType;
	use WindowsAzure\Services\Table\Models\Property;
	use WindowsAzure\Services\Table\Models\Filters\Filter;

	// Create table service proxy.
	$table_proxy = TableService::create($config);
	
	$query = new Query();
	$filter = "PartitionKey eq 'tasksSeattle' and RowKey eq '1'";
	$query->setFilter(Filter::applyRawString($filter));
    $options = new QueryEntitiesOptions();
    $options->setQuery($query);
	
	$result = $table_proxy->queryEntities("mytable", $options);
	
	$entities = $result->getEntities();
	$entity = $entities[0];
	
	$due_date = $entity->getProperty("DueDate");
	$due_date->setValue(new DateTime());
	$entity->setProperty("DueDate", $due_date); // Modified the DueDate field.
	
	$location = $entity->getProperty("Location");
	$location->setValue(null);
	$entity->setProperty("Location", $location); // Removed Location field.
	
	$entity->addProperty("Status", EdmType::STRING, "In progress"); // Added Status field.

	$table_proxy->updateEntity("mytable", $entity);

<h2 id="BatchOperations">How to Batch Table Operations</h2>

The **TableService->batch** method allows you to execute multiple operations in a single request. The pattern here involves adding operations to **BatchRequest** object and then passing the **BatchRequest** object to the **TableService->batch** method. To add an operation to a **BatchRequest** object, you can call any of the following methods multiple times:

* **addInsertEntity** (adds an insertEntity operation)
* **addUpdateEntity** (adds an updateEntity operation)
* **addMergeEntity** (adds a mergeEntity operation)
* **addInsertOrReplaceEntity** (adds an insertOrReplaceEntity operation)
* **addInsertOrMergeEntity** (adds an insertOrMergeEntity operation)
* **addDeleteEntity** (adds a deleteEntity operation)

The following example shows how to execute insertEntity and deleteEntity operations in a single request:

 	(TODO: Add this code example - waiting on DCR.)

<h2 id="DeleteEntity">How to Delete an Entity</h2>

To delete an entity, pass the table name, and the entity's `PartitionKey` and `RowKey` to the **TableService->deleteEntity** method.

	require_once 'Autoload.php';

	use WindowsAzure\Services\Table\TableService;
	use WindowsAzure\Services\Table\Models\DeleteEntityOptions;

	// Create table service proxy.
	$table_proxy = TableService::create($config);
	
	// Delete entity.
	$table_proxy->deleteEntity("mytable", "tasksSeattle", "1");

Note that for concurrency checks, you can set the Etag for an entity to be deleted by using the **DeleteEntityOptions->setEtag** method and passing the **DeleteEntityOptions** object to **deleteEntity** as a fourth parameter.

<h2 id="DeleteTable">How to Delete a Table</h2>

Finally, to delete a table, pass the table name to the **TableService->deleteTable** method.



<h2 id="NextSteps">Next Steps</h2>

Now that you’ve learned the basics of blob storage, follow these links to learn how to do more complex storage tasks.

- See the MSDN Reference: [Storing and Accessing Data in Windows Azure] []
- Visit the Windows Azure Storage Team Blog: <http://blogs.msdn.com/b/windowsazurestorage/>

[download]: http://this.link.does.not.exist/yet
[Windows Azure Management Portal]: http://windows.azure.com/
[Storing and Accessing Data in Windows Azure]: http://msdn.microsoft.com/en-us/library/windowsazure/gg433040.aspx
[require_once]: http://php.net/require_once
[table-service-timeouts]: http://msdn.microsoft.com/en-us/library/windowsazure/dd894042.aspx
[table-error-codes]: http://msdn.microsoft.com/en-us/library/windowsazure/dd179438.aspx
[table-data-model]: http://msdn.microsoft.com/en-us/library/windowsazure/dd179338.aspx
[filters]: http://msdn.microsoft.com/en-us/library/windowsazure/dd894031.aspx