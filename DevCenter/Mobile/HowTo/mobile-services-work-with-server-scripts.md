<properties linkid="register-for-facebook-auth" writer="glenga" urldisplayname="Mobile Services" headerexpose="" pagetitle="Work with server scripts in Mobile Services" metakeywords="server scripts, mobile devices, Windows Azure, scheduler" footerexpose="" metadescription="Provides examples on how to define, register, and use server scripts in Windows Azure Mobile Services." umbraconavihide="0" disquscomments="1"></properties>

<div chunk="../chunks/article-left-menu-html.md" />

# Work with server scripts in Mobile Services
 
In Windows Azure Mobile Services, you define custom business logic as JavaScript code that's stored and executed on the server. This code, which is referred to as a *server script*, is either registered to an insert, read, update, or delete operation on a given table or is assigned to a scheduled job. Every server script has a main function, and may have optional helper functions. The signature of the main function depends on whether the script is registered to a table operation or is run as a scheduled job. 

This article includes these sections:

+ [Table operation scripts]
	+ [How to: Register table scripts]
	+ [How to: Define table scripts]
	+ [How to: Work with users]
	+ [How to: Override the default response]
	+ [How to: Override success and error]
	+ [How to: Access custom parameters]
+ [How to: Define scheduled job scripts]
+ [How to: Access tables from scripts]
+ [How to: Join relational tables]
+ [How to: Perform Bulk Inserts]
+ [How to: Map JSON types to database types]
+ [How to: Leverage modules and helper functions]
+ [How to: Write output to logs]

For descriptions of individual objects and functions, see [Mobile Services server script reference].

<div class="dev-callout"><strong>Note</strong>
<p>Mobile Services does not preserve state between script executions. Because a new global context is created every time a script is run, any state variables that are defined in the script are reinitialized. If you want to store state from one request to another, create a table in your mobile service, and then read and write the state to the table. For more information, see <a href="#access-tables">How to: Access tables from scripts</a>.</p>
</div> 

<h2><a name="table-scripts"></a><span class="short-header">Table scripts</span>Table operation scripts</h2>

A table operation script is a server script that's registered to an operation on a table--insert, read, update, or delete. The name of the script must match the kind of operation against which it's registered. Only one script can be registered for a given table operation. The script is executed every time that the given operation is invoked by a REST request--for example, when a POST request is received to insert an item into the table.

You write table operation scripts to enforce your business logic when the operation is executed. For example, the following script rejects insert operations where the string length of the `text` field is greater than ten characters: 

	function insert(item, user, request) {
	    if (item.text.length > 10) {
	        request.respond(statusCodes.BAD_REQUEST, 'Text length must be less than 10 characters');
	    } else {
	        request.execute();
	    }
	}

A table script function always takes three arguments. The second argument is always a [user object][User object] that represents the user that submitted the request. The third argument is always a [request object][Request object], by which you can control execution of the requested operation and the response that's sent to the client.

Here are the canonical main-function signatures for the table operations: 

+ [Insert][insert function]: `function insert (item, user, request) { … }`
+ [Update][update function]: `function update (item, user, request) { … }`
+ [Delete][delete function]: `function del (id, user, request) { … }`
+ [Read][read function]: `function read (query, user, request) { … }`


<div class="dev-callout"><strong>Note</strong>
<p>A function that's registered to the delete operation must be named <em>del</em> because delete is a reserved keyword in JavaScript. </p>
</div> 

###<a name="register-table-scripts"></a>How to: Register table scripts

There are two ways to register server scripts against table operations. 

+ In the [Windows Azure Management Portal][Management Portal] in the **Scripts** tab for a given table in the **Data** tab. This illustration shows how to set the insert script for the `TodoItem` table:

	![1][]
	
	For more information about how to do this, see [Validate and modify data in Mobile Services by using server scripts]. 

+ In the Windows Azure command-prompt tool. The following command uploads a script named `todoitem.insert.js` from the `table` subfolder:

		~$azure mobile script upload todolist table/todoitem.insert.js
		info:    Executing command mobile script upload
		info:    mobile script upload command OK

	For more information, see [Commands to manage Windows Azure Mobile Services]. 

###<a name="execute-operation"></a>How to: Define table scripts

A table operation script must call at least one of the following functions of the [request object] to make sure that the client receives a response. 
 
+ **execute function**: The operation is completed as requested and the standard response is returned.
 
+ **respond function**: A custom response is returned.

<div class="dev-callout"><strong>Important</strong>
<p>When a script has a code path in which neither <b>execute</b> nor <b>respond</b> is invoked, the operation may become unresponsive.</p></div>

The following script calls the **execute** function to complete the data operation requested by the client: 

	function insert(item, user, request) { 
	    request.execute(); 
	}

In this example, the item is inserted into the database and the appropriate status code is returned to the user. 

When the **execute** function is called, the `item`, [query][query object] or `id` value that was passed as the first argument into the script function is used to perform the operation. For an insert, update or query operation, you can modify the item or query before you call **execute**: 

	function insert(item, user, request) { 
	    item.scriptComment =
			'this was added by a script and will be saved to the database'; 
	    request.execute(); 
	} 
 
	function update(item, user, request) { 
	    item.scriptComment = 
			'this was added by a script and will be saved to the database'; 
	    request.execute(); 
	} 

	function read(query, user, request) { 
		// Only return records for the current user 	    
		query.where({ userid: user.userId}); 
	    request.execute(); 
	}
 
<div class="dev-callout"><strong>Note</strong>
<p>In a delete script, changing the value of the supplied userId variable does not affect which record gets deleted.</p>
</div>

For more examples, see [Read and write data], [Modify the request] and [Validate data].

###<a name="work-with-users"></a>How to: Work with users

In Windows Azure Mobile Services, you can use an identity provider to authenticate users. For more information, see [Get started with authentication]. When an authenticated user invokes a table operation, Mobile Services uses the [user object] to supply information about the user to the registered script function. The **userId** property can be used to store and retrieve user-specific information. The following example sets the owner property of an item based on the userId of an authenticated user:

	function insert(item, user, request) {
	    item.owner = user.userId;
	    request.execute();
	}

The next example adds an additional filter to the query based on the **userId** of an authenticated user. This filter restricts the result to only items that belong to the current user:  

	function read(query, user, request) {
	    query.where({
	        owner: user.userId
	    });
	    request.execute();
	}

###<a name="override-response"></a>How to: Override the default response

You can also use a script to override the default response behavior. Just call the **respond** function instead of the **execute** function and write the response to the client: 

	function insert(item, user, request) {
	    if (item.userId !== user.userId) {
	        request.respond(statusCodes.FORBIDDEN, 
	        'You may only insert records with your userId.');
	    } else {
	        request.execute();
	    }
	}

In this example, the request is rejected when the inserted item does not have a `userId` property that matches the `userId` of the [user object] that's supplied for the authenticated client. In this case, a database operation (*insert*) does not occur, and a response that has a 403 HTTP status code and a custom error message is returned to the client. For more examples, see [Modify the response].

###<a name="override-success-error"></a>How to: Override success and error

By default in a table operation, the **execute** function writes responses automatically. However, by passing in a success handler when you call execute, you can modify the results of a query before you write them to the response. The following example calls `execute({ success: function(results) { … })` to perform additional work after data is read from the database but before the response is written:

	function read(query, user, request) {
	    request.execute({
	        success: function(results) {
	            results.forEach(function(r) {
	                r.scriptComment = 
	                'this was added by a script after querying the database';
	            });
	            request.respond();
	        }
	    });
	}

When you provide a success handler to the **execute** function, you must also call the **respond** function so that the runtime knows that the script has completed and that a response can be written. When you call **respond** without passing any arguments, Mobile Services generates the default response. 

<div class="dev-callout"><strong>Note</strong>
<p>You can call <strong>respond</strong> without arguments to invoke the default response only after you first call the <strong>execute</strong> function.</p></div>
 
The **execute** function can fail if there is a loss of connectivity to the database, an invalid object, or an incorrect query. By default when an error occurs, server scripts log the error and write an error result to the response. Because Mobile Services provides default error handling, you don't have to handle errors that may occur in the service. 

You can implement explicit error handling when you want a particular compensating action or when you want to use the global console object to write more detailed information to the log. Do this by supplying an error handler to the **execute** function:

	function update(item, user, request) { 
	  request.execute({ 
	    error: function(err) { 
	      // Do some custom logging, then call respond. 
	      request.respond(); 
	    } 
	  }); 
	}
 

When you provide an error handler, Mobile Services returns an error result to the client when **respond** is called.

###<a name="access-headers"></a>How to: Access custom parameters

When you send a request to your mobile service, you can include custom parameters in the URI of the request to instruct your table operation scripts how to process a given request. For example, the following URI for a POST request tells the service to not permit the insertion of a new TodoItem that has the same text value:

		https://todolist.azure-mobile.net/tables/TodoItem?duplicateText=false


These custom query parameters are accessed as JSON values from the **parameters** property of the [request object]. The **request** object is supplied by Mobile Services to any function registered to a table operation. The following server script for the insert operation checks the value of the `duplicateText` parameter before the insert operation is run:

		function insert(item, user, request) {
		    var todoItemTable = tables.getTable('TodoItem');
		    // Check the supplied custom parameter to see if
		    // we should allow duplicate text items to be inserted.		   
		    if (request.parameters.duplicateText === 'false') {
		        // Find all existing items with the same text
		        // and that are not marked 'complete'. 
		        todoItemTable.where({
		            text: item.text,
		            complete: false
		        }).read({
		            success: insertItemIfNotComplete
		        });
		    } else {
		        request.execute();
		    }

		    function insertItemIfNotComplete(existingItems) {
		        if (existingItems.length > 0) {
		            request.respond(statusCodes.CONFLICT, 
                        "Duplicate items are not allowed.");
		        } else {
		            // Insert the item as normal. 
		            request.execute();
		        }
		    }
		}

Note that in **insertItemIfNotComplete** the **execute** function of the [request object] is invoked to insert the item when there is no duplicate text; otherwise the **respond** function is invoked to notify the client of the duplicate.  

<h2><a name="scheduler-scripts"></a><span class="short-header">Scheduler scripts</span>How to: Define scheduled job scripts</h2>

A server script can be assigned to a job that's defined in the scheduler. These scripts belong to the job and are executed according to the job schedule. (You can also use the [Management Portal] to run jobs on demand.) A script that defines a scheduled job has no parameters because Mobile Services doesn't pass it any data; it's executed as a regular JavaScript function and doesn't interact with Mobile Services directly. 

You define scheduled jobs  in the [Windows Azure Management Portal][Management Portal] in the **Script** tab in the scheduler:

![2][]

For more information about how to do this, see [Schedule backend jobs in Mobile Services]. 

<!--There are two ways to create scheduled jobs. 

+ In the [Windows Azure Management Portal][Management Portal] in the **Scheduler** tab. For an example of how to do this, see the tutorial [Schedule backend jobs in Mobile Services]. 

+ From the command prompt using the Windows Azure command line tool. For more information, see [Commands to manage Windows Azure Mobile Services].  -->

<h2><a name="access-tables"></a><span class="short-header">Access tables</span>How to: Access tables from scripts</h2>

In many scenarios, you have to access table data from your scripts--for example, you might want to examine entries in a permissions table or store audit data. You can also use tables to preserve state between script executions. 

Use the [tables object] to access tables in your mobile service. The **getTable** function returns a [table object] instance that's a proxy for accessing the requested table. You can then call operation functions on the proxy to access and change data. This line of code gets a proxy for the *TodoItems* table:

		var todoItemsTable = tables.getTable('TodoItems');

Once you have a [table object], you can call one or more table operation functions: insert, update, delete or read. This example reads user permissions from a permissions table:

	function insert(item, user, request) {
		var permissionsTable = tables.getTable('permissions');
	
		permissionsTable
			.where({ userId: user.userId, permission: 'submit order'})
			.read({ success: checkPermissions });
			
		function checkPermissions(results) {
			if(results.length > 0) {
				// Permission record was found. Continue normal execution.
				request.execute();
			} else {
				console.log('User %s attempted to submit an order without permissions.', user.userId);
				request.respond(statusCodes.FORBIDDEN, 'You do not have permission to submit orders.');
			}
		}
	}


The next example writes auditing information to an **audit** table:

	function update(item, user, request) {
		request.execute({ success: insertAuditEntry });
		
		function insertAuditEntry() {
			var auditTable = tables.getTable('audit');
			var audit = {
				record: 'checkins',
				recordId: item.id,
				timestamp: new Date(),
				values: JSON.stringify(item)
			};
			auditTable.insert(audit, {
				success: function() {
					// Write to the response now that all data operations are complete
					request.respond();
				}
			});
		}
	}


<h2><a name="joins"></a><span class="short-header">Joins</span>How to: Join relational tables</h2>

You can join two tables by using the **query** method of the [mssql object] to pass in the TSQL code that implements the join.

We recommend that you complete the [Getting Started with Data] tutorial before you proceed so that you will have the mobile service and **ToDoItem** table that this section relies on. Here we will add a **Priority** table to the service, and add a priority number to the **ToDoItem** table. We will then join the tables to generate a list of work items that each have a priority description.

The join is implementeded by using a server script, which populates the **Priority** table with  rows that contain a priority number and a text description. For example, the priority number 0 might have the description of "critical, must do now!". Next the script adds rows to the **ToDoItem** table that contain a text field and a priority number. Because *dynamic schema* is enabled, the new priority number field is added to the existing schema (We recomend that you turn off *dynamic schema* when your service is in working mode, but it is handy during development, as shown in this sample.) Last, the rows in the two tables are joined, based on the priority number as the join column. 

To create the **Priority** table, in your mobile service, on the Data tab, choose **New**. Enter a table name of "Priority" and then choose the check mark.

![3][]

Next, to insert some items into the table, first create an on-demand scheduled job named **JoinTables**  (For details, see [How to: Define scheduled job scripts]).

On the **SCRIPT** tab, use the following code to replace the function body:

    	function priorities(){
			var priorityTable = tables.getTable('Priority');
		    //Write to my service log 
		    console.info("Running 'insertpriorities' job."); 
			var item = { number: 0, description: "critical and urgent" };
			priorityTable.insert(item);
			item.number = 1;
			item.description = "critical";
			priorityTable.insert(item);
			item.number = 2;
			item.description = "urgent";
			priorityTable.insert(item);
			item.number = 3;
			item.description = "take your time";
			priorityTable.insert(item);
		}
		
Immediately following the previous block, add this code:

    	function toDoItem(){
			var ToDoItemTable = tables.getTable('ToDoItem');
		    //Write to my service log 
		    console.info("Running 'InsertWorkItems' job."); 
			var item = { priority: 0, text: "fix this bug now" };
			ToDoItemTable.insert(item);
			item.priority = 1;
			item.text = "we need to fix this one real soon now";
			ToDoItemTable.insert(item);
			item.priority = 2;
			item.text = "this is important but not so much";
			ToDoItemTable.insert(item);
			item.priority = 3;
			item.text = "good idea for the future";
			ToDoItemTable.insert(item);
		}

Next add this function to do the actual join:

	    function join(){
		    //Write to my service log 
		    console.info("Running 'Join' job."); 
			mssql.query('SELECT t.text, p.description FROM ToDoItem as t INNER JOIN Priority as p ON t.priority = p.number', {
	            success: function(results) {
	                console.log(results);
	            }
	        });
		}
	
Now, at the very beginning, add the following code so that the appropriate function is executed:

			var command = "priorities";
		    if (command == "priorities"){    
		        priorities();
		    }
		    else
		    if (command == "toDoItem"){ 
		        toDoItem();   
		    }  
		    else
		    if (command == "Join"){    
		        join();
		    } 
		
Save the script.

<div class="dev-callout"><strong>Note</strong>
<p>
Because certain Windows Azure subscriptions allow only one scheduler script, in this example, we combined what could be three separate scripts into one.
</p>
</div>



To run the script, choose the "Run Once" button at the bottom of the page. The script inserts four rows into the **Priorities** table. You can verify by viewing  the **DATA** tab on the Dashboard screen.

Next, change the value of the **command** variable at the top of the script to  *toDoItem* and run the script again. This time the script inserts four rows in the **ToDoItem** table.

Last, change the value of the **command** variable to *Join* and run the script again. The script joins the two tables and writes the results to the log, which you can inspect by going back to your mobile services screen, and choosing **LOGS**. The line at the top represents the last execution of the script; you can highlight it and choose **DETAILS** in the page footer to examine the results of the join.	

In a production scenario, you could put the logic in the **join** function into a *Read* script for the **ToDoItem** table.

<h2><a name="bulk-inserts"></a><span class="short-header">Bulk inserts</span>How to: Perform Bulk Inserts</h2>

If you use a tight **for** or **while** loop to insert a large number of items (1000, for example) into a  table , you might encounter a SQL connection limit that causes some of the inserts to fail. Your request may never complete or it may return a HTTP 500 Internal Server Error.  To avoid this problem, you can insert the items in batches of 10 or so. After the first batch is inserted, submit the next batch, and so on.

By using the following script, you can set the size of a batch of records to insert in parallel. We recomend that you keep the number of records small. The function **insertItems** calls itself recursively when an async insert batch has completed. The for loop at the end inserts one record at a time, and calls **insertComplete** on success and **errorHandler** on error. **insertComplete**  controls whether **insertItems** will be called recursively for the next batch, or whether the job is done and the script should exit.

		var todoTable = tables.getTable('TodoItem'); 
		var recordsToInsert = 1000;
		var batchSize = 10; 
		var totalCount = 0;
		var errorCount = 0; 
		
		function insertItems() {        
		    var batchCompletedCount = 0;  
		
		    var insertComplete = function() { 
		        batchCompletedCount++; 
		        totalCount++; 
		        if(batchCompletedCount === batchSize || totalCount === recordsToInsert) {                        
		            if(totalCount < recordsToInsert) {
		                // kick off the next batch 
		                insertItems(); 
		            } else { 
		                // or we are done, report the status of the job 
		                // to the log and don't do any more processing 
		                console.log("Insert complete. %d Records processed. There were %d errors.", totalCount, errorCount); 
		            } 
		        } 
		    }; 
		
		    var errorHandler = function(err) { 
		        errorCount++; 
		        console.warn("Ignoring insert failure as part of batch.", err); 
		        insertComplete(); 
		    };
		
		    for(var i = 0; i < batchSize; i++) { 
		        var item = { text: "This is item number: " + totalCount + i }; 
		        todoTable.insert(item, { 
		            success: insertComplete, 
		            error: errorHandler 
		        }); 
		    } 
		} 
		
		insertItems(); 


The entire code sample, and accompanying discussion, can be found in this [blog posting](http://blogs.msdn.com/b/jpsanders/archive/2013/03/20/server-script-to-insert-table-items-in-windows-azure-mobile-services.aspx). If you use this code, you can adapt it to your specific situation, and thoroughly test it.



<h2><a name="JSON-types"></a><span class="short-header">Map JSON types</span>How to: Map JSON types to database types</h2>

The collections of data types on the client and in a Mobile Services database table are different. Sometimes they map easily to one another, and other times they don't. Mobile Services performs a number of type transformations in the mapping:

- The client language-specific types are serialized into JSON.
- The JSON representation is translated into JavaScript before it appears in server scripts.
- The JavaScript data types are converted to SQL database types when saved using the [tables object].

The transformation from client schema into JSON varies across platforms.  JSON.NET is used in Windows Store and Windows Phone clients. The Android client uses the gson library.  The iOS client uses the NSJSONSerialization class. The default serialization behavior of each of these libraries is used, except that date objects are converted to JSON strings that contain the date that's encoded by using ISO 8601.

When you are writing server scripts that use [insert], [update], [read] or [delete] functions, you can access the JavaScript representation of your data. Mobile Services uses the Node.js’s deserialization function ([JSON.parse](http://es5.github.io/#x15.12)) to transform JSON on the wire into JavaScript objects. However Mobile Services does  a transformation to extract **Date** objects from ISO 8601 strings.

When you use the [tables object] or the [mssql object], or just let your table scripts execute, the deserialized JavaScript objects are inserted into your SQL database. In that process, object properties are mapped to T-SQL types:

<table border="1">
<tr>
<td>JavaScript property</td>
<td>T-SQL type</td>
</tr><tr>
<td>Number</td>
<td>Float(53)</td>
</tr><tr>
<td>Boolean</td>
<td>Bit</td>
</tr><tr>
<td>Date</td>
<td>DateTimeOffset(3)</td>
</tr>
<tr>
<td>String</td>
<td>Nvarchar(max)</td>
</tr>
<tr>
<td>Buffer</td>
<td>Not supported</td>
</tr><tr>
<td>Object</td>
<td>Not supported</td>
</tr><tr>
<td>Array</td>
<td>Not supported</td>
</tr><tr>
<td>Stream</td>
<td>Not supported</td>
</tr>
</table> 



<h2><a name="helper-functions"></a><span class="short-header">Modules and helpers</span>How to: Leverage modules and helper functions</h2>

Mobile Services exposes a set of modules that scripts can load by using the global **require** function. For example, a script can require **request** to make HTTP requests: 

	function update(item, user, request) { 
	    var httpRequest = require('request'); 
	    httpRequest('http://www.google.com', function(err, response, body) { 
	    	... 
	    }); 
	} 

Some of these modules are provided by Mobile Services, but others are built-in Node.js modules. The following useful modules are available to your scripts when they are loaded by using the global **require** function:

+ **azure**: Exposes the functionality of the Windows Azure SDK for Node.js. For more information, see the [Windows Azure SDK for Node.js]. 

+ **crypto**: Provides crypto functionality of OpenSSL. For more information, see the [Node.js documentation][crypto API].

+ **path**: Contains utilities for working with file paths. For more information, see the [Node.js documentation][path API].

+ **querystring**: Contains utilities for working with query strings. For more information, see the [Node.js documentation][querystring API].
 
+ **request**: Sends HTTP requests to external REST services, such as Twitter and Facebook. For more information, see [Send HTTP request].
 
+ **sendgrid**: Sends email by using the Sendgrid email service in Windows Azure. For more information, see [Send email from Mobile Services with SendGrid].
 
+ **url**: Contains utilities to parse and resolve URLs. For more information, see the [Node.js documentation][url API].

+ **util**: Contains various utilities, such as string formatting and object type checking. For more information, see the [Node.js documentation][util API]. 

+ **zlib**: Exposes compression functionality, such as gzip and deflate. For more information, see the [Node.js documentation][zlib API]. 

<div class="dev-callout"><strong>Note</strong>
<p>Some Node.js modules might be disallowed. When you try to require a disallowed module, a runtime error occurs.</p></div>

In addition to requiring modules, server scripts can also include optional helper functions. In the following example, a table script is registered to the insert operation, which includes the helper function **handleUnapprovedItem**:


	function insert(item, user, request) {
	    if (!item.approved) {
	        handleUnapprovedItem(item, request);
	    } else {
	        request.execute();
	    }
	}
	
	function handleUnapprovedItem(item, request) {
	    // Implementation 
	}
 
In a script, table functions must be declared after the main function. 

<div class="dev-callout"><strong>Note</strong>
<p>You must declare all variables in your script. Undeclared variables cause an error.</p></div>

<h2><a name="handle-errors"></a><span class="short-header">Writing to logs</span>How to: Write output to the mobile service logs</h2>

By default, Mobile Services writes errors that occur during service script execution to the service logs. Your scripts can also write to the logs. Writing to logs is great way to debug your scripts and validate that they are behaving as desired. To write to the logs, use the global [console object]. Use the **log** or **info** function to log information-level warnings. The **warning** and **error** functions log their respective levels, which are called-out in the logs. 

<div class="dev-callout"><strong>Note</strong>
<p>To view the logs for your mobile service, log on to the <a href="https://manage.windowsazure.com/">Management Portal</a>, select your mobile service, and then choose the <strong>Logs</strong> tab.</p></div>

You can also use the logging functions of the [console object] to format your messages using parameters. The following example supplies a JSON object as a parameter to the message string:

	function insert(item, user, request) {
	    console.log("Inserting item '%j' for user '%j'.", item, user);  
	    request.execute();
	}

Notice that the string `%j` is used as the placeholder for a JSON object and that parameters are supplied in sequential order. 

<!-- Anchors. -->
[Table operation scripts]: #table-scripts
[How to: Register table scripts]: #register-table-scripts
[How to: Define table scripts]: #execute-operation
[How to: override the default response]: #override-response
[How to: Modify an operation]: #modify-operation
[How to: Override success and error]: #override-success-error
[How to: Write output to logs]: #write-to-logs
[How to: Define scheduled job scripts]: #scheduler-scripts
[How to: Refine access to tables]: #authorize-tables
[How to: Join relational tables]: #joins
[How to: Perform Bulk Inserts]: #bulk-inserts
[How to: Map JSON types to database types]: #JSON-types
[How to: Leverage modules and helper functions]: #modules-helper-functions
[How to: Access tables from scripts]: #access-tables
[How to: Access custom parameters]: #access-headers
[How to: Work with users]: #work-with-users

<!-- Images. -->
[1]: ../Media/mobile-insert-script-users.png
[2]: ../Media/mobile-schedule-job-script.png
[3]: ../Media/mobile-create-priority-table.png

<!-- URLs. -->
[Mobile Services server script reference]: http://msdn.microsoft.com/en-us/library/windowsazure/jj554226.aspx
[Schedule backend jobs in Mobile Services]: /en-us/develop/mobile/tutorials/schedule-backend-tasks/
[request object]: http://msdn.microsoft.com/en-us/library/windowsazure/jj554218.aspx
[User object]: http://msdn.microsoft.com/en-us/library/windowsazure/jj554220.aspx
[push object]: http://msdn.microsoft.com/en-us/library/windowsazure/jj554217.aspx
[insert function]: http://msdn.microsoft.com/en-us/library/windowsazure/jj554229.aspx
[insert]: http://msdn.microsoft.com/en-us/library/windowsazure/jj554229.aspx
[update function]: http://msdn.microsoft.com/en-us/library/windowsazure/jj554214.aspx
[delete function]: http://msdn.microsoft.com/en-us/library/windowsazure/jj554215.aspx
[read function]: http://msdn.microsoft.com/en-us/library/windowsazure/jj554224.aspx
[update]: http://msdn.microsoft.com/en-us/library/windowsazure/jj554214.aspx
[delete]: http://msdn.microsoft.com/en-us/library/windowsazure/jj554215.aspx
[read]: http://msdn.microsoft.com/en-us/library/windowsazure/jj554224.aspx
[query object]: http://msdn.microsoft.com/en-us/library/windowsazure/jj613353.aspx
[apns object]: http://msdn.microsoft.com/en-us/library/windowsazure/jj839711.aspx
[mpns object]: http://msdn.microsoft.com/en-us/library/windowsazure/jj871025.aspx
[wns object]: http://msdn.microsoft.com/en-us/library/windowsazure/jj860484.aspx
[table object]: http://msdn.microsoft.com/en-us/library/windowsazure/jj554210.aspx
[tables object]: http://msdn.microsoft.com/en-us/library/windowsazure/jj614364.aspx
[mssql object]: http://msdn.microsoft.com/en-us/library/windowsazure/jj554212.aspx
[console object]: http://msdn.microsoft.com/en-us/library/windowsazure/jj554209.aspx
[Read and write data]: http://msdn.microsoft.com/en-us/library/windowsazure/jj631640.aspx
[Validate data]: http://msdn.microsoft.com/en-us/library/windowsazure/jj631638.aspx
[Modify the request]: http://msdn.microsoft.com/en-us/library/windowsazure/jj631635.aspx
[Modify the response]: http://msdn.microsoft.com/en-us/library/windowsazure/jj631631.aspx
[Management Portal]: https://manage.windowsazure.com/

[Validate and modify data in Mobile Services by using server scripts]: /en-us/develop/mobile/tutorials/validate-modify-and-augment-data-dotnet/
[Commands to manage Windows Azure Mobile Services]: /en-us/manage/linux/other-resources/command-line-tools/#Commands_to_manage_mobile_services/#Mobile_Scripts
[Getting Started with Data]: /en-us/develop/mobile/tutorials/get-started-with-data-dotnet/
[Windows Store Push]: /en-us/develop/mobile/tutorials/get-started-with-push-dotnet/
[Windows Phone Push]: /en-us/develop/mobile/tutorials/get-started-with-push-wp8/
[iOS Push]: /en-us/develop/mobile/tutorials/get-started-with-push-ios/
[Android Push]: /en-us/develop/mobile/tutorials/get-started-with-push-android/

[Windows Azure SDK for Node.js]: http://go.microsoft.com/fwlink/p/?LinkId=275539
[Send HTTP request]: http://msdn.microsoft.com/en-us/library/windowsazure/jj631641.aspx
[Send email from Mobile Services with SendGrid]: /en-us/develop/mobile/tutorials/send-email-with-sendgrid/
[Get started with authentication]: http://go.microsoft.com/fwlink/p/?LinkId=287177
[crypto API]: http://go.microsoft.com/fwlink/p/?LinkId=288802
[path API]: http://go.microsoft.com/fwlink/p/?LinkId=288803
[querystring API]: http://go.microsoft.com/fwlink/p/?LinkId=288804
[url API]: http://go.microsoft.com/fwlink/p/?LinkId=288805
[util API]: http://go.microsoft.com/fwlink/p/?LinkId=288806
[zlib API]: http://go.microsoft.com/fwlink/p/?LinkId=288807
