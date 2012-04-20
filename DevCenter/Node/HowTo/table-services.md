<?xml version="1.0" encoding="utf-8"?>
<body>
  <properties umbracoNaviHide="0" pageTitle="Table Services - How To - Node.js - Develop" metaKeywords="Azure nosql Node.js, Azure large structured data store Node.js, Azure table Node.js, Azure table storage Node.js" metaDescription="Learn how to use the Windows Azure table storage service to create and delete tables and insert and query entities in a table from your Node.js application." linkid="dev-nodejs-how-to-table-services" urlDisplayName="Table Service" headerExpose="" footerExpose="" disqusComments="1" />
  <h1>How to Use the Table Storage Service from Node.js</h1>
  <p>This guide shows you how to perform common scenarios using the Windows Azure Table storage service. The samples are written written using the Node.js API. The scenarios covered include <strong>creating and deleting a table, inserting and querying entities in a table</strong>. For more information on tables, see the <a href="#next-steps">Next Steps</a> section.</p>
  <h2>Table of Contents</h2>
  <p>
    <a href="#what-is">What is the Table Service?</a>
    <br />
    <a href="#concepts">Concepts</a>
    <br />
    <a href="#create-account">Create a Windows Azure Storage Account</a>
    <br />
    <a href="#create-app">Create a Node.js Application</a>
    <br />
    <a href="#configure-access">Configure your Application to Access Storage</a>
    <br />
    <a href="#setup-connection-string">Setup a Windows Azure Storage Connection</a>
    <br />
    <a href="#create-table">How To: Create a Table</a>
    <br />
    <a href="#add-entity">How To: Add an Entity to a Table</a>
    <br />
    <a href="#update-entity">How To: Update an Entity</a>
    <br />
    <a href="#change-entities">How to: Change a Group of Entities</a>
    <br />
    <a href="#query-for-entity">How to: Query for an Entity</a>
    <br />
    <a href="#query-set-entities">How to: Query a Set of Entities</a>
    <br />
    <a href="#query-entity-properties">How To: Query a Subset of Entity Properties</a>
    <br />
    <a href="#delete-entity">How To: Delete an Entity</a>
    <br />
    <a href="#delete-table">How To: Delete a Table</a>
    <br />
    <a href="#next-steps">Next Steps</a>
  </p>
  <h2>
    <a name="what-is">
    </a>What is the Table Service?</h2>
  <p>The Windows Azure Table storage service stores large amounts of structured data. The service accepts authenticated calls from inside and outside the Windows Azure cloud. Windows Azure tables are ideal for storing structured, non-relational data. Common uses of Table services include:</p>
  <ul>
    <li>Storing a huge amount of structured data (many TB) that is automatically scaled to meet throughput demands</li>
    <li>Storing datasets that don’t require complex joins, foreign keys, or stored procedures and can be denormalized for fast access</li>
    <li>Quickly querying data such as user profiles using a clustered index</li>
  </ul>
  <p>You can use the Table service to store and query huge sets of structured, non-relational data, and your tables scale when volume increases.</p>
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
        <strong>URL format:</strong> Code addresses tables in an account using this address format: <br />http://&lt;storage account&gt;.table.core.windows.net/&lt;table&gt;<br /><br />You can address Azure tables directly using this address with the OData protocol. For more information, see <a href="http://www.odata.org/" target="_blank">OData.org</a></p>
    </li>
    <li>
      <p>
        <strong>Storage Account:</strong> All access to Windows Azure Storage is done through a storage account. The total size of blob, table, and queue contents in a storage account cannot exceed 100TB.</p>
    </li>
    <li>
      <p>
        <strong>Table</strong>: A table is an unlimited collection of entities. Tables don’t enforce a schema on entities, which means a single table can contain entities that have different sets of properties. An account can contain many tables.</p>
    </li>
    <li>
      <p>
        <strong>Entity</strong>: An entity is a set of properties, similar to a database row. An entity can be up to 1MB in size.</p>
    </li>
    <li>
      <p>
        <strong>Properties</strong>: A property is a name-value pair. Each entity can include up to 252 properties to store data. Each entity also has three system properties that specify a partition key, a row key, and a timestamp. Entities with the same partition key can be queried more quickly, and inserted/updated in atomic operations. An entity’s row key is its unique identifier within a partition.</p>
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
      <p>In Enter a URL, type a subdomain name to use in the URI for the storage account. The entry can contain from 3-24 lowercase letters and numbers. This value becomes the host name within the URI that is used to address Table, Queue, or Table resources for the subscription.</p>
    </li>
    <li>
      <p>Choose a region or an affinity group in which to locate the storage. If you will be using storage from your Windows Azure application, select the same region where you will deploy your application.</p>
    </li>
    <li>
      <p>Finally, take note of your<strong> Primary access key</strong> in the right-hand column. You will need this in subsequent steps to access storage. <br /><img src="../../../DevCenter/dotNet/Media/blob4.png" alt="Blob4" /></p>
    </li>
  </ol>
  <h2>
    <a name="create-app">
    </a>Create a Node.js Application</h2>
  <p>Create a blank tasklist application using the <strong>Windows PowerShell for Node.js</strong> command window at the location <strong>c:\node\tasklist</strong>. For instructions on how to use the PowerShell commands to create a blank application, see the <a href="{localLink:2221}" title="Web App with Express">Node.js Web Application</a>.</p>
  <h2>
    <a name="configure-access">
    </a>Configure Your Application to Access Storage</h2>
  <p>To use Windows Azure storage, you need to download and use the Node.js azure package, which includes a set of convenience libraries that communicate with the storage REST services.</p>
  <h3>Use Node Package Manager (NPM) to obtain the package</h3>
  <ol>
    <li>
      <p>Use the <strong>Windows PowerShell for Node.js</strong> command window to navigate to the <strong>c:\node\tasklist\WebRole1</strong> folder where you created your sample application.</p>
    </li>
    <li>
      <p>Type <strong>npm install azure</strong> in the command window, which should result in the following output:</p>
      <pre class="prettyprint">azure@0.5.0 ./node_modules/azure
├── xmlbuilder@0.3.1
├── mime@1.2.4
├── xml2js@0.1.12
├── qs@0.4.0
├── log@1.2.0
└── sax@0.3.4
</pre>
    </li>
    <li>
      <p>You can manually run the <strong>ls</strong> command to verify that a <strong>node_modules</strong> folder was created. Inside that folder you will find the <strong>azure</strong> package, which contains the libraries you need to access storage.</p>
    </li>
  </ol>
  <h3>Import the package</h3>
  <p>Using Notepad or another text editor, add the following to the top the <strong>server.js</strong> file of the application where you intend to use storage:</p>
  <pre class="prettyprint">var azure = require('azure');
</pre>
  <h2>
    <a name="setup-connection-string">
    </a>Setup a Windows Azure Storage Connection</h2>
  <p>If you are running against the storage emulator on the local machine, you do not need to configure a connection string, as it will be configured automatically. You can continue to the next section.</p>
  <p>If you are planning to run against the real cloud storage service, you need to modify your connection string to point at your cloud-based storage. You can store the storage connection string in a configuration file, rather than hard-coding it in code. In this tutorial you use the Web.cloud.config file, which is created when you create a Windows Azure web role.</p>
  <ol>
    <li>
      <p>Use a text editor to open <strong>c:\node\tasklist\WebRole1\Web.cloud.config</strong></p>
    </li>
    <li>
      <p>Add the following inside the <strong>configuration</strong> element.</p>
      <pre class="prettyprint">&lt;appSettings&gt;
    &lt;add key="AZURE_STORAGE_ACCOUNT" value="your storage account" /&gt;
    &lt;add key="AZURE_STORAGE_ACCESS_KEY" value="your storage access key" /&gt;
&lt;/appSettings&gt;
</pre>
    </li>
  </ol>
  <p>Note that the examples below assume that you are using cloud-based storage.</p>
  <h2>
    <a name="create-table">
    </a>How to Create a Table</h2>
  <p>The following code creates a <strong>TableService</strong> object and uses it to create a new table. Add the following near the top of <strong>server.js</strong>.</p>
  <pre class="prettyprint">var tableService = azure.createTableService();
</pre>
  <p>The call to <strong>createTableIfNotExists</strong> will return the specified table if it exists or create a new table with the specified name if it does not already exist. Replace the existing definition of the <strong>createServer</strong> method with the following.</p>
  <pre class="prettyprint">var tableName = 'tasktable';

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
</pre>
  <h2>
    <a name="add-entity">
    </a>How to Add an Entity to a Table</h2>
  <p>To add an entity, first create an object that defines your entity properties and their data types. Note that for every entity you must specify a <strong>PartitionKey</strong> and <strong>RowKey</strong>. These are the unique identifiers of your entities, and are values that can be queried much faster than your other properties. The system uses <strong>PartitionKey</strong> to automatically distribute the table’s entities over many storage nodes. Entities with the same <strong>PartitionKey</strong> are stored on the same node. The <strong>RowKey</strong> is the unique ID of the entity within the partition it belongs to. To add an entity to your table, pass the entity object to the <strong>insertEntity</strong> method.</p>
  <pre class="prettyprint">var http = require('http');
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
</pre>
  <h2>
    <a name="update-entity">
    </a>How to Update an Entity</h2>
  <p>This code shows how to replace the old version of an existing entity with an updated version.</p>
  <pre class="prettyprint">var tableService = azure.createTableService();

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
</pre>
  <p>If the entity that is being updated doesn’t exist, then the update operation will fail. Therefore if the user is trying to store an entity regardless of whether it already existed before, it is sometimes common to call update and then insert right away if update fails (also known as “upserting” an entity). The Node.js library does not natively support this operation, so you have to manually chain <strong>updateEntity</strong> and <strong>insertEntity</strong> to accomplish this effect.</p>
  <h2>
    <a name="change-entities">
    </a>How to Change a Group of Entities</h2>
  <p>Sometimes it makes sense to submit multiple operations together in a batch to ensure atomic processing by the server. To accomplish that, you use the <strong>beginBatch</strong> method on <strong>TableService</strong> and then call the series of operations as usual. The difference is that the callback functions of these operators will indicate that the operation was batched, not submitted to the server. When you do want to submit the batch, you call <strong>commitBatch</strong>. The callback supplied to that method will indicate if the entire batch was submitted successfully. The example below adds two entities together in a batch.</p>
  <pre class="prettyprint">var http = require('http');
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
</pre>
  <h2>
    <a name="query-for-entity">
    </a>How to Query for an Entity</h2>
  <p>To query an entity in a table, use the <strong>queryEntity</strong> method, by passing the <strong>PartitionKey</strong> and <strong>RowKey</strong>.</p>
  <pre class="prettyprint">var http = require('http');
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
</pre>
  <h2>
    <a name="query-set-entities">
    </a>How to Query a Set of Entities</h2>
  <p>To query a table, use the <strong>TableQuery</strong> object to build up a query expression using clauses such as <strong>select</strong>, <strong>from</strong>, <strong>where</strong> (including convenience clauses such as <strong>wherePartitionKey</strong>, <strong>whereRowKey</strong>, <strong>whereNextPartitionKey</strong>, and <strong>whereNextRowKey</strong>), <strong>and</strong>, <strong>or</strong>, <strong>orderBy</strong>, and <strong>top</strong>. Then pass the query expression to the <strong>queryEntities</strong> method. You can use the results in a <strong>for</strong> loop inside the callback.</p>
  <p>This example finds all tasks in Seattle based on the <strong>PartitionKey</strong>.</p>
  <pre class="prettyprint">var http = require('http');
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
</pre>
  <h2>
    <a name="query-entity-properties">
    </a>How to Query a Subset of Entity Properties</h2>
  <p>A query to a table can retrieve just a few properties from an entity. This technique, called <em>projection</em>, reduces bandwidth and can improve query performance, especially for large entities. Use the <strong>select</strong> clause and pass the names of the properties you would like to bring over to the client.</p>
  <p>The query in the following code only returns the <strong>Descriptions</strong> of entities in the table, note that in the program output, the <strong>DueDate</strong> will show as <strong>undefined</strong> because it was not sent by the server.</p>
  <p>
    <em>Please note that the following snippet only works against the cloud storage service, the <strong>select</strong> keyword is not supported by the Storage Emulator.</em>
  </p>
  <pre class="prettyprint">var http = require('http');
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
</pre>
  <h2>
    <a name="delete-entity">
    </a>How to Delete an Entity</h2>
  <p>You can delete an entity using its partition and row keys. In this example, the <strong>task1</strong> object contains the <strong>RowKey</strong> and <strong>PartitionKey</strong> values of the entity to be deleted. Then the object is passed to the <strong>deleteEntity</strong> method.</p>
  <pre class="prettyprint">var http = require('http');
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
</pre>
  <h2>
    <a name="delete-table">
    </a>How to Delete a Table</h2>
  <p>The following code deletes a table from a storage account.</p>
  <pre class="prettyprint">var http = require('http');
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
</pre>
  <h2>
    <a name="next-steps">
    </a>Next Steps</h2>
  <p>Now that you’ve learned the basics of table storage, follow these links to learn how to do more complex storage tasks.</p>
  <ul>
    <li>See the MSDN Reference: <a href="http://msdn.microsoft.com/en-us/library/windowsazure/gg433040.aspx">Storing and Accessing Data in Windows Azure</a></li>
    <li>
      <a href="http://blogs.msdn.com/b/windowsazurestorage/">Visit the Windows Azure Storage Team Blog</a>
    </li>
  </ul>
</body>