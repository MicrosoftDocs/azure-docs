<properties umbraconavihide="0" pagetitle="Table Services - How To - Node.js - Develop" metakeywords="Azure nosql Node.js, Azure large structured data store Node.js, Azure table Node.js, Azure table storage Node.js" metadescription="Learn how to use the Windows Azure table storage service to create and delete tables and insert and query entities in a table from your Node.js application." linkid="dev-nodejs-how-to-table-services" urldisplayname="Table Service" headerexpose="" footerexpose="" disquscomments="1"></properties>

# How to Use the Table Storage Service from Node.js

This guide shows you how to perform common scenarios using the Windows
Azure Table storage service. The samples are written written using the
Node.js API. The scenarios covered include **creating and deleting a
table, inserting and querying entities in a table**. For more
information on tables, see the [Next Steps][] section.

## Table of Contents

[What is the Table Service?][]   
 [Concepts][]   
 [Create a Windows Azure Storage Account][]   
 [Create a Node.js Application][]   
 [Configure your Application to Access Storage][]   
 [Setup a Windows Azure Storage Connection][]   
 [How To: Create a Table][]   
 [How To: Add an Entity to a Table][]   
 [How To: Update an Entity][]   
 [How to: Change a Group of Entities][]   
 [How to: Query for an Entity][]   
 [How to: Query a Set of Entities][]   
 [How To: Query a Subset of Entity Properties][]   
 [How To: Delete an Entity][]   
 [How To: Delete a Table][]   
 [Next Steps][]

## <a name="what-is"> </a>What is the Table Service?

The Windows Azure Table storage service stores large amounts of
structured data. The service accepts authenticated calls from inside and
outside the Windows Azure cloud. Windows Azure tables are ideal for
storing structured, non-relational data. Common uses of Table services
include:

-   Storing a huge amount of structured data (many TB) that is
    automatically scaled to meet throughput demands
-   Storing datasets that don’t require complex joins, foreign keys, or
    stored procedures and can be denormalized for fast access
-   Quickly querying data such as user profiles using a clustered index

You can use the Table service to store and query huge sets of
structured, non-relational data, and your tables scale when volume
increases.

## <a name="concepts"> </a>Concepts

The Table service contains the following components:

![Table1][]

-   **URL format:** Code addresses tables in an account using this
    address format:   
    http://storageaccount.table.core.windows.net/table  
      
    You can address Azure tables directly using this address with the
    OData protocol. For more information, see [OData.org][]

-   **Storage Account:** All access to Windows Azure Storage is done
    through a storage account. The total size of blob, table, and queue
    contents in a storage account cannot exceed 100TB.

-   **Table**: A table is an unlimited collection of entities. Tables
    don’t enforce a schema on entities, which means a single table can
    contain entities that have different sets of properties. An account
    can contain many tables.

-   **Entity**: An entity is a set of properties, similar to a database
    row. An entity can be up to 1MB in size.

-   **Properties**: A property is a name-value pair. Each entity can
    include up to 252 properties to store data. Each entity also has
    three system properties that specify a partition key, a row key, and
    a timestamp. Entities with the same partition key can be queried
    more quickly, and inserted/updated in atomic operations. An entity’s
    row key is its unique identifier within a partition.

## <a name="create-account"> </a>Create a Windows Azure Storage Account

To use storage operations, you need a Windows Azure storage account. You
can create a storage account by following these steps. (You can also
create a storage account [using the REST API][].)

1.  Log into the [Windows Azure Management Portal].

2.  At the bottom of the navigation pane, click **+NEW**.

	![+new][plus-new]

3.  Click **Storage Account**, and then click **Quick Create**.

	![Quick create dialog][quick-create-storage]

4.  In URL, type a subdomain name to use in the URI for the
    storage account. The entry can contain from 3-24 lowercase letters
    and numbers. This value becomes the host name within the URI that is
    used to address Blob, Queue, or Table resources for the
    subscription.

5.  Choose a Region/Affinity Group in which to locate the
    storage. If you will be using storage from your Windows Azure
    application, select the same region where you will deploy your
    application.

6.  Click **Create Storage Account**.

## <a name="create-app"> </a>Create a Node.js Application

Create a blank tasklist application using the **Windows PowerShell for
Node.js** command window at the location **c:\\node\\tasklist**. For
instructions on how to use the PowerShell commands to create a blank
application, see the [Node.js Web Application][].

## <a name="configure-access"> </a>Configure Your Application to Access Storage

To use Windows Azure storage, you need to download and use the Node.js
azure package, which includes a set of convenience libraries that
communicate with the storage REST services.

### Use Node Package Manager (NPM) to obtain the package

1.  Use the **Windows PowerShell for Node.js** command window to
    navigate to the **c:\\node\\tasklist\\WebRole1** folder where you
    created your sample application.

2.  Type **npm install azure** in the command window, which should
    result in the following output:

        azure@0.5.0 ./node_modules/azure
        +-- xmlbuilder@0.3.1
        +-- mime@1.2.4
        +-- xml2js@0.1.12
        +-- qs@0.4.0
        +-- log@1.2.0
        +-- sax@0.3.4

3.  You can manually run the **ls** command to verify that a
    **node\_modules** folder was created. Inside that folder you will
    find the **azure** package, which contains the libraries you need to
    access storage.

### Import the package

Using Notepad or another text editor, add the following to the top the
**server.js** file of the application where you intend to use storage:

    var azure = require('azure');

## <a name="setup-connection-string"> </a>Setup a Windows Azure Storage Connection

If you are running against the storage emulator on the local machine,
you do not need to configure a connection string, as it will be
configured automatically. You can continue to the next section.

If you are planning to run against the real cloud storage service, you
need to modify your connection string to point at your cloud-based
storage. You can store the storage connection string in a configuration
file, rather than hard-coding it in code. In this tutorial you use the
Web.cloud.config file, which is created when you create a Windows Azure
web role.

1.  Use a text editor to open
    **c:\\node\\tasklist\\WebRole1\\Web.cloud.config**

2.  Add the following inside the **configuration** element.

        <appSettings>
            <add key="AZURE_STORAGE_ACCOUNT" value="your storage account" />
            <add key="AZURE_STORAGE_ACCESS_KEY" value="your storage access key" />
        </appSettings>

Note that the examples below assume that you are using cloud-based
storage.

## <a name="create-table"> </a>How to Create a Table

The following code creates a **TableService** object and uses it to
create a new table. Add the following near the top of **server.js**.

    var tableService = azure.createTableService();

The call to **createTableIfNotExists** will return the specified table
if it exists or create a new table with the specified name if it does
not already exist. Replace the existing definition of the
**createServer** method with the following.

    var tableName = 'tasktable';

    http.createServer(function serverCreated(req, res) {
        tableService.createTableIfNotExists(tableName, tableCreatedOrExists);
        
        function tableCreatedOrExists(error)
        {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
    	
            if(error === null){
                res.write('Using table ' + tableName + '\r\n');
                res.end();
    	
            } else {
                res.end('Could not use table: ' + error.Code);
            }
        }
    }).listen(port);

## <a name="add-entity"> </a>How to Add an Entity to a Table

To add an entity, first create an object that defines your entity
properties and their data types. Note that for every entity you must
specify a **PartitionKey** and **RowKey**. These are the unique
identifiers of your entities, and are values that can be queried much
faster than your other properties. The system uses **PartitionKey** to
automatically distribute the table’s entities over many storage nodes.
Entities with the same **PartitionKey** are stored on the same node. The
**RowKey** is the unique ID of the entity within the partition it
belongs to. To add an entity to your table, pass the entity object to
the **insertEntity** method.

    var http = require('http');
    var azure = require('azure');
    var port = process.env.port || 1337;

    var tableService = azure.createTableService();

    var tableName = 'tasktable';

    http.createServer(function serverCreated(req, res) {
        tableService.createTableIfNotExists(tableName, tableCreatedOrExists);
        
        function tableCreatedOrExists(error)
        {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
    	
            if(error === null){
                res.write('Using table ' + tableName + '\r\n');
    	    
                var task1 = {
                    PartitionKey : 'tasksSeattle',
                    RowKey: '1',
                    Description: 'Take out the trash',
                    DueDate: new Date(2011, 12, 14, 12) 
                };
                tableService.insertEntity(tableName, task1, entityInserted);
            } else {
                res.end('Could not use table: ' + error.Code);
            }
        }

        function entityInserted(error, serverEntity)
        {
            if(error === null){
                res.end('Successfully inserted entity ' + serverEntity.Description 
                        + ' \r\n');
            } else {
                res.end('Could not insert entity into table: ' + error.Code);
            }
        }
    }).listen(port);

## <a name="update-entity"> </a>How to Update an Entity

This code shows how to replace the old version of an existing entity
with an updated version.

    var tableService = azure.createTableService();

    var tableName = 'tasktable';

    http.createServer(function serverCreated(req, res) {
        tableService.createTableIfNotExists(tableName, tableCreatedOrExists);
        
        function tableCreatedOrExists(error)
        {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
    	
            if(error === null){
                res.write('Using table ' + tableName + '\r\n');
    	    
                var task1 = {
                    PartitionKey : 'tasksSeattle',
                    RowKey: '1',
                    Description: 'Do the dishes'
                };
                tableService.updateEntity(tableName, task1, entityUpdated);

            } else {
                res.end('Could not use table: ' + error.Code);
            }
        }

        function entityUpdated(error, serverEntity)
        {
            if(error === null){
                res.end('Successfully updated entity ' + serverEntity.Description 
                        + ' \r\n');
            } else {
                res.end('Could not update entity: ' + error.Code);
            }
        }
    }).listen(port);

If the entity that is being updated doesn’t exist, then the update
operation will fail. Therefore if the user is trying to store an entity
regardless of whether it already existed before, it is sometimes common
to call update and then insert right away if update fails (also known as
“upserting” an entity). The Node.js library does not natively support
this operation, so you have to manually chain **updateEntity** and
**insertEntity** to accomplish this effect.

## <a name="change-entities"> </a>How to Change a Group of Entities

Sometimes it makes sense to submit multiple operations together in a
batch to ensure atomic processing by the server. To accomplish that, you
use the **beginBatch** method on **TableService** and then call the
series of operations as usual. The difference is that the callback
functions of these operators will indicate that the operation was
batched, not submitted to the server. When you do want to submit the
batch, you call **commitBatch**. The callback supplied to that method
will indicate if the entire batch was submitted successfully. The
example below adds two entities together in a batch.

    var http = require('http');
    var azure = require('azure');
    var port = process.env.port || 1337;

    var tableService = azure.createTableService();

    var tableName = 'tasktable';

    http.createServer(function serverCreated(req, res) {
        tableService.createTableIfNotExists(tableName, tableCreatedOrExists);
        
        function tableCreatedOrExists(error)
        {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
    	
            if(error === null){
                res.write('Using table ' + tableName + '\r\n');

                tableService.beginBatch();

                var task1 = {
                    PartitionKey : 'tasksSeattle',
                    RowKey: '1',
                    Description: 'Take out the trash',
                    DueDate: new Date(2011, 12, 14, 12)
                };
                tableService.insertEntity(tableName, task1, entityInserted);
    	
            } else {
                res.end('Could not use table: ' + error.Code);
            }
        }

        function entityInserted(error)
        {
            if(error === null){
                res.write('Successfully inserted entity into batch\r\n');

                var task2 = {
                    PartitionKey : 'tasksSeattle',
                    RowKey: '2',
                    Description: 'Do the dishes'
                };
    	    
                tableService.insertEntity(tableName, task2, 
                                          secondEntityInserted);
            } else {
                res.end('Could not insert entity into batch: ' + error.Code);
            }
        }

        function secondEntityInserted(error)
        {
            if(error === null){
                res.write('Successfully inserted entity into batch\r\n');

                tableService.commitBatch(batchCommitted);
            } else {
                res.end('Could not insert entity into batch: ' + error.Code);
            }
        }

        function batchCommitted(error, resp)
        {
            if(error === null)
            {
                res.end('Successfully submitted batch');
            } else {
                res.end('Could not submit batch: ' + error.Code);
            }
        }
    }).listen(port);

## <a name="query-for-entity"> </a>How to Query for an Entity

To query an entity in a table, use the **queryEntity** method, by
passing the **PartitionKey** and **RowKey**.

    var http = require('http');
    var azure = require('azure');
    var port = process.env.port || 1337;

    var tableService = azure.createTableService();

    var tableName = 'tasktable';

    http.createServer(function serverCreated(req, res) {
        tableService.createTableIfNotExists(tableName, tableCreatedOrExists);
        
        function tableCreatedOrExists(error)
        {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
    	
            if(error === null){
                res.write('Using table ' + tableName + '\r\n');
    	    
                tableService.queryEntity(tableName, 'tasksSeattle', '1', 
                                         entityQueried);
            } else {
                res.end('Could not use table: ' + error.Code);
            }
        }

        function entityQueried(error, serverEntity)
        {
            if(error === null){
            res.end('Successfully queried entity ' + serverEntity.Description 
                    + ' \r\n');
            } else {
                res.end('Could not query entity: ' + error.Code);
            }
        }
    }).listen(port);

## <a name="query-set-entities"> </a>How to Query a Set of Entities

To query a table, use the **TableQuery** object to build up a query
expression using clauses such as **select**, **from**, **where**
(including convenience clauses such as **wherePartitionKey**,
**whereRowKey**, **whereNextPartitionKey**, and **whereNextRowKey**),
**and**, **or**, **orderBy**, and **top**. Then pass the query
expression to the **queryEntities** method. You can use the results in a
**for** loop inside the callback.

This example finds all tasks in Seattle based on the **PartitionKey**.

    var http = require('http');
    var azure = require('azure');
    var port = process.env.port || 1337;

    var tableService = azure.createTableService();

    var tableName = 'tasktable';

    http.createServer(function serverCreated(req, res) {
        tableService.createTableIfNotExists(tableName, tableCreatedOrExists);
        
        function tableCreatedOrExists(error)
        {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
    	
            if(error === null){
                res.write('Using table ' + tableName + '\r\n');
    	    
                var query = azure.TableQuery
                    .select()
                    .from(tableName)
                    .where('PartitionKey eq ?', 'tasksSeattle');
                tableService.queryEntities(query, entitiesQueried);
            } else {
                res.end('Could not use table: ' + error.Code);
            }
        }

        function entitiesQueried(error, serverEntities)
        {
            if(error === null){
                res.write('Successfully queried entities:\r\n');
                for(var index in serverEntities)
                {
                    res.write(serverEntities[index].Description + 
                              ' due on ' + serverEntities[index].DueDate + '\r\n');
                }
                res.end();
            } else {
                res.end('Could not query entities: ' + error.Code);
            }
        }
    }).listen(port);

## <a name="query-entity-properties"> </a>How to Query a Subset of Entity Properties

A query to a table can retrieve just a few properties from an entity.
This technique, called *projection*, reduces bandwidth and can improve
query performance, especially for large entities. Use the **select**
clause and pass the names of the properties you would like to bring over
to the client.

The query in the following code only returns the **Descriptions** of
entities in the table, note that in the program output, the **DueDate**
will show as **undefined** because it was not sent by the server.

*Please note that the following snippet only works against the cloud
storage service, the **select** keyword is not supported by the Storage
Emulator.*

    var http = require('http');
    var azure = require('azure');
    var port = process.env.port || 1337;

    var tableService = azure.createTableService();

    var tableName = 'tasktable';

    http.createServer(function serverCreated(req, res) {
        tableService.createTableIfNotExists(tableName, tableCreatedOrExists);
        
        function tableCreatedOrExists(error)
        {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
    	
            if(error === null){
                res.write('Using table ' + tableName + '\r\n');
    	    
                var query = azure.TableQuery
                    .select('Description')
                    .from(tableName)
                    .where('PartitionKey eq ?', 'tasksSeattle');
                tableService.queryEntities(query, entitiesQueried);
            } else {
                res.end('Could not use table: ' + error.Code);
            }
        }
        
        function entitiesQueried(error, serverEntities)
        {
            if(error === null){
                res.write('Successfully queried entities:\r\n');
                for(var index in serverEntities)
                {
                    res.write(serverEntities[index].Description + 
                              ' due on ' + serverEntities[index].DueDate + '\r\n');
                }
                res.end();
            } else {
                res.end('Could not query entities: ' + error.Code);
            }
        }
    }).listen(port);

## <a name="delete-entity"> </a>How to Delete an Entity

You can delete an entity using its partition and row keys. In this
example, the **task1** object contains the **RowKey** and
**PartitionKey** values of the entity to be deleted. Then the object is
passed to the **deleteEntity** method.

    var http = require('http');
    var azure = require('azure');
    var port = process.env.port || 1337;

    var tableService = azure.createTableService();

    var tableName = 'tasktable';

    http.createServer(function serverCreated(req, res) {
        tableService.createTableIfNotExists(tableName, tableCreatedOrExists);
        
        function tableCreatedOrExists(error)
        {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
    	
            if(error === null){
                res.write('Using table ' + tableName + '\r\n');
    	    
                var task1 = {
                    PartitionKey : 'tasksSeattle',
                    RowKey: '1'
                };
                tableService.deleteEntity(tableName, task1, entityDeleted);
            } else {
                res.end('Could not use table: ' + error.Code);
            }
        }

        function entityDeleted(error)
        {
            if(error === null){
                res.end('Successfully deleted entity\r\n');
            } else {
                res.end('Could not delete entity: ' + error.Code);
            }
        }
    }).listen(port);

## <a name="delete-table"> </a>How to Delete a Table

The following code deletes a table from a storage account.

    var http = require('http');
    var azure = require('azure');
    var port = process.env.port || 1337;

    var tableService = azure.createTableService();

    var tableName = 'tasktable';

    http.createServer(function serverCreated(req, res) {
        tableService.createTableIfNotExists(tableName, tableCreatedOrExists);
        
        function tableCreatedOrExists(error)
        {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
    	
            if(error === null){
                res.write('Using table ' + tableName + '\r\n');
    	    
                tableService.deleteTable(tableName, tableDeleted);
            } else {
                res.end('Could not use table: ' + error.Code);
            }
        }

        function tableDeleted(error)
        {
            if(error === null){
                res.end('Successfully deleted table\r\n');
            } else {
                res.end('Could not delete table: ' + error.Code);
            }
        }
    }).listen(port);

## <a name="next-steps"> </a>Next Steps

Now that you’ve learned the basics of table storage, follow these links
to learn how to do more complex storage tasks.

-   See the MSDN Reference: [Storing and Accessing Data in Windows Azure][]
-   [Visit the Windows Azure Storage Team Blog][]

  [Next Steps]: #next-steps
  [What is the Table Service?]: #what-is
  [Concepts]: #concepts
  [Create a Windows Azure Storage Account]: #create-account
  [Create a Node.js Application]: #create-app
  [Configure your Application to Access Storage]: #configure-access
  [Setup a Windows Azure Storage Connection]: #setup-connection-string
  [How To: Create a Table]: #create-table
  [How To: Add an Entity to a Table]: #add-entity
  [How To: Update an Entity]: #update-entity
  [How to: Change a Group of Entities]: #change-entities
  [How to: Query for an Entity]: #query-for-entity
  [How to: Query a Set of Entities]: #query-set-entities
  [How To: Query a Subset of Entity Properties]: #query-entity-properties
  [How To: Delete an Entity]: #delete-entity
  [How To: Delete a Table]: #delete-table
  [Table1]: ../../../DevCenter/dotNet/Media/table1.png
  [OData.org]: http://www.odata.org/
  [using the REST API]: http://msdn.microsoft.com/en-us/library/windowsazure/hh264518.aspx
  [Windows Azure Management Portal]: http://windows.azure.com

  [plus-new]: ../../../DevCenter/Shared/Media/plus-new.png
  [quick-create-storage]: ../../../DevCenter/Shared/Media/quick-storage.png
  [Blob2]: ../../../DevCenter/dotNet/Media/blob2.png
  [Blob3]: ../../../DevCenter/dotNet/Media/blob3.png
  [Blob4]: ../../../DevCenter/dotNet/Media/blob4.png
  [Node.js Web Application]: {localLink:2221} "Web App with Express"
  [Storing and Accessing Data in Windows Azure]: http://msdn.microsoft.com/en-us/library/windowsazure/gg433040.aspx
  [Visit the Windows Azure Storage Team Blog]: http://blogs.msdn.com/b/windowsazurestorage/
