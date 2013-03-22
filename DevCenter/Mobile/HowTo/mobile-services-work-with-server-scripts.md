<properties linkid="register-for-facebook-auth" urldisplayname="Mobile Services" headerexpose="" pagetitle="Work with server scripts in Mobile Services" metakeywords="server scripts, mobile devices, Windows Azure, scheduler" footerexpose="" metadescription="Provides examples on how to define, register, and use server scripts in Windows Azure Mobile Services." umbraconavihide="0" disquscomments="1"></properties>

# Work with server scripts in Mobile Services
 
Windows Azure Mobile Services enables you to define custom business logic that is run on the server. This logic is provided as a JavaScript code that stored and executed on the server. In Mobile Services, a server script is either registered to an insert, read, update, or delete operation on a given table or is assigned to a scheduled job. Server scripts have a main function along with optional helper functions. The signature of the main function depends on the whether the script is registered to a table operation or run as a scheduled job. 

This topic includes the following sections:

+ [Table operation scripts]
	+ [How to: Register table scripts]
	+ [How to: Define table scripts]
	+ [How to: Work with users]
	+ [How to: Override the default response]
	+ [How to: Override success and error]
	+ [How to: Access custom parameters]
+ [How to: Define scheduled job scripts]
+ [How to: Access tables from scripts]
+ [How to: Leverage modules and helper functions]
+ [How to: Write output to logs]

For a detailed description of individual objects and functions, see the [Mobile Services server script reference].

<div class="dev-callout"><strong>Note</strong>
<p>Mobile Services does not preserve state between script executions. Every time a script executes, a new global context is created in which for the script is executed. Do not define any state variables in your scripts. If you need to store state from one request to another, create a table in your mobile service in which to store your state, and then read and write your state to the table. For more information, see <a href="#access-tables">How to: Access tables from scripts</a>.</p>
</div> 

<h2><a name="table-scripts"></a><span class="short-header">Table scripts</span>Table operation scripts</h2>

Table operation scripts are server scripts that are registered to a give operation on a table (insert, read, update, or delete). The name of the script must match the type of operation against which it is registered. There can only be one server script registered for a given table operation. The script is executed every time that the given operation is invoked by a REST request. For example, an insert script for a given table is executed each time POST request is received to insert an item into that table. The following script rejects insert operations where the string length of the `text` field is greater than ten characters: 

	function insert(item, user, request) {
	    if (item.text.length > 10) {
	        request.respond(statusCodes.BAD_REQUEST, 'Text length must be under 10');
	    } else {
	        request.execute();
	    }
	}

A table script function always takes three arguments. The second argument is always a [user object][User object] that represents the user that submitted the request. The third argument is always a [request object][Request object], which lets you control execution of the requested operation and the response sent to the client.

Canonical script function signatures are as follows: 

+ [Insert][insert function]: `function insert (item, user, request) { … }`
+ [Update][update function]: `function update (item, user, request) { … }`
+ [Delete][delete function]: `function del (id, user, request) { … }`
+ [Read][read function]: `function read (query, user, request) { … }`


<div class="dev-callout"><strong>Note</strong>
<p>A function registered to the delete operation must be named del because delete is a reserved keyword in JavaScript. </p>
</div> 

###<a name="register-table-scripts"></a>How to: register table scripts

There are two ways to register server scripts against table operations. 

+ In the [Windows Azure Management Portal][Management Portal] in the **Scripts** tab for a given table in the **Data** tab. The following shows how to set the insert script for the `TodoItem` table:

	![1][]
	
	For detailed steps of how to do this, see the tutorial [Validate and modify data in Mobile Services by using server scripts]. 

+ From the command prompt using the Windows Azure command line tool. The following command uploads a new script named `todoitem.insert.js` from the `table` subfolder:

		~$azure mobile script upload todolist table/todoitem.insert.js
		info:    Executing command mobile script upload
		info:    mobile script upload command OK

	For more information, see [Commands to manage Windows Azure Mobile Services]. 

###<a name="execute-operation"></a>How to: Define table scripts

A table operation script must call at least one of the following functions of the [request object] to make sure that the client receives a response. 
 
+ **execute function**: The operation is completed as requested and the standard response is returned.
 
+ **respond function**: A custom response is returned.

<div class="dev-callout"><strong>Important</strong>
<p>These scripts must call execute or respond to make sure that a response is returned to the client. When a script has a code path in which neither of these functions is invoked, the operation may become unresponsive.</p>

The following script calls the **execute** function to complete the data operation requested by the client: 

	function insert(item, user, request) { 
	    request.execute(); 
	}

In this example, the item is inserted into the database and the appropriate status code is returned to the user. 

When the **execute** function is called, the `item`, [query][query object] or `id` value that was passed as the first argument into the script function is used to perform the operation. For an insert, update or query operation, you can modify the item or query before you call execute, as in the following examples: 

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

For more examples, see the topics [Read and write data], [Modify the request] and [Validate data].

###<a name="work-with-users"></a>How to: Work with users

Mobile Services enables you to authenticate users by using an identity provider. For more information, see [Get started with authentication]. When an authenticated user invokes a table operation, Mobile Services supplies information about the authenticated user in the [user object] supplied to the registered script function. The **userId** property can be used to store and retrieve user-specific information. The following example sets the owner property of an item based on the userId of an authenticated user:

	function insert(item, user, request) {
	    item.owner = user.userId;
	    request.execute();
	}

The following example adds an additional filter to the query based on the **userId** of an authenticated user. This filter restricts the result to only items that belong to the current user:  

	function read(query, user, request) {
	    query.where({
	        owner: user.userId
	    });
	    request.execute();
	}

###<a name="override-response"></a>How to: override the default response

A script can also override the default response behavior. This is done by calling the **respond** function instead of **execute** and writing the response to the client, as in the following example: 

	function insert(item, user, request) {
	    if (item.userId !== user.userId) {
	        request.respond(statusCodes.FORBIDDEN, 
	        'You may only insert records with your userId.');
	    } else {
	        request.execute();
	    }
	}

In this example, the request is rejected when the inserted item does not have a `userId` property that matches the `userId` of the supplied [user object] for the authenticated client. In this case, a database operation (insert) does not occur, and a response with a 403 HTTP status code with a custom error message returned to the client. For more examples, see the topic [Modify the response].

###<a name="override-success-error"></a>How to: override success and error

By default in a table operation, the **execute** function writes responses automatically. In some cases you may want to modify the results of a query before writing those results to the response. You can do this by using passing in a success handler when you call **execute**. The following example calls `execute({ success: function(results} { … })` to perform additional work after data is read from the database but before the response is written:

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

When you provide a success handler to the **execute** function, you are responsible for letting the runtime know that you script has completed and that a response can be written. You do this by calling the **respond** function. When you call **respond** without passing any arguments, Mobile Services generates the default response. 

<div class="dev-callout"><strong>Note</strong>
<p>You can only call the <strong>respond</strong> function without arguments to invoke the default response after first calling the <strong>execute</strong> function.</p>
 
The **execute** function can fail for a variety of reasons, including loss of connectivity to the database, an invalid object, or an incorrect query. Server scripts have a default behavior for errors, which is to log the error and write an error result to the response. Because Mobile Services provides default error handling for scripts, you do not need to handle such errors that may occur in the service. 

You typically implement explicit error handling when some sort of compensating action is possible or when you want to write more detailed information to the log using the global console object. Do this by supplying an error handler to the **execute** function, as in the following example:

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

When you send a request to your mobile service, you can include one or more custom parameters in the URI of the request. These parameters might instruct your table operation scripts how to process a given request. For example, the following URI for a POST request tells the service to not permit the insertion of a new TodoItem with the same text value:

		https://todolist.azure-mobile.net/tables/TodoItem?duplicateText=false


These custom query parameters are accessed as JSON values from the **parameters** property of the [request object]. The **request** object is supplied by Mobile Services to any function registered to a table operation. The following server script for the insert operation checks the value of the `duplicateText` parameter before performing the insert operation:

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

<h2><a name="scheduler-scripts"></a><span class="short-header">Scheduler scripts</span>How to: define scheduled job scripts</h2>

Server scripts can be assigned to a job defined in the scheduler. These scripts belong to the job and are executed based on the job schedule. Jobs can also be run on-demand in the [Management Portal]. A script that defines a scheduled job has no parameters as it is not passed any data by Mobile Services. These scripts are executed as regular JavaScript functions and do not interact with Mobile Services directly. 

Scheduled jobs are defined in the [Windows Azure Management Portal][Management Portal] in the **Script** tab in the scheduler, as shown in the following:

![2][]

For more information about how to do this, see the tutorial [Schedule backend jobs in Mobile Services]. 

<!--There are two ways to create scheduled jobs. 

+ In the [Windows Azure Management Portal][Management Portal] in the **Scheduler** tab. For an example of how to do this, see the tutorial [Schedule backend jobs in Mobile Services]. 

+ From the command prompt using the Windows Azure command line tool. For more information, see [Commands to manage Windows Azure Mobile Services].  -->

<h2><a name="access-tables"></a><span class="short-header">Access tables</span>How to: Access tables from scripts</h2>

There are many scenarios where you need to access table data from your scripts. You might want to check entries in a permissions table or store audit data. You can also use tables to preserve state between script executions. 

Use the [tables object] to access tables in your mobile service. The **getTable** function returns a [table object] instance that is a proxy for accessing the requested table. Operation functions can then be called on the proxy to access and change data. The following line of code gets a proxy for the TodoItems table:

		var todoItemsTable = tables.getTable('TodoItems');

Once you have a [table object], you can call one or more table operation functions: insert, update, delete or read. The following example reads user permissions from a permissions table:

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


The following example writes auditing information to an **audit** table:

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

<h2><a name="helper-functions"></a><span class="short-header">Modules and helpers</span>How to: leverage modules and helper functions</h2>

Mobile Services exposes a set of modules that scripts can load by using the global **require** function. For example, a script can require **request** to make HTTP requests: 

	function update(item, user, request) { 
	    var request = require('request'); 
	    request('http://www.google.com', function(err, response, body) { 
	    	... 
	    }); 
	} 

Some of these modules are provided by Mobile Services, while others are built-in Node.js modules. The following are examples of some useful modules that are available to your scripts when loaded using the global **require** function:

+ **azure**: Exposes the functionality of the Windows Azure SDK for Node.js. For more information, see the [Windows Azure SDK for Node.js]. 

+ **crypto**: Provides crypto functionality of OpenSSL. For more information, see the [Node.js documentation][crypto API].

+ **path**: Contains utilities for working with file paths. For more information, see the [Node.js documentation][path API].

+ **querystring**: Contains utilities for working with query strings. For more information, see the [Node.js documentation][querystring API].
 
+ **request**: Sends HTTP requests to external REST services, such as Twitter and Facebook. For more information, see [Send HTTP request].
 
+ **sendgrid**: Used to send email by using the Sendgrid email service in Windows Azure. For more information, see [Send email from Mobile Services with SendGrid].
 
+ **url**: Contains utilities used to parse and resolve URLs. For more information, see the [Node.js documentation][url API].

+ **util**: Contains various utilities, including string formatting and object type checking. For more information, see the [Node.js documentation][util API]. 

+ **zlib**: Exposes compression functionality, including gzip and deflate. For more information, see the [Node.js documentation][zlib API]. 

<div class="dev-callout"><strong>Note</strong>
<p>Some Node.js modules might be disallowed. When you try to require a disallowed module, a runtime error occurs.</div>

In addition to requiring modules, server scripts can also optionally include helper functions. In the following example is a table script registered to the insert operation, which includes the helper function **handleUnapprovedItem**:


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
<p>You must declare all variables in your script. Undeclared variables are not permitted and will cause an error.</p></div>

<h2><a name="handle-errors"></a><span class="short-header">Writing to logs</span>How to: write output to the mobile service logs</h2>

By default, Mobile Services writes errors that occur during service script execution to the service logs. You scripts can also write to the logs. Writing to logs is great way to debug your scripts and validate that they are behaving as desired. You use the global [console object] to write to the logs. Use the **log** or **info** functions to log information-level warnings. The **warning** and **error** functions logs their respective levels, which are called-out in the logs. 

<div class="dev-callout"><strong>Note</strong>
<p>To view the logs for your mobile service, login to the <a href="https://manage.windowsazure.com/">Management Portal</a>, select your mobile service, and then click the <strong>Logs</strong> tab.</p></div>

The logging functions of the [console object] also enable you to format your messages using parameters. The following example supplies a JSON object as a parameter to the message string:

	function insert(item, user, request) {
	    console.log("Inserting item '%j' for user '%j'.", item, user);  
	    request.execute();
	}

Note that the string `%j` is used as the placeholder for a JSON object and that parameters are supplied in sequential order. 

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
[How to: Leverage modules and helper functions]: #modules-helper-functions
[How to: Access tables from scripts]: #access-tables
[How to: Access custom parameters]: #access-headers
[How to: Work with users]: #work-with-users

<!-- Images. -->
[1]: ../Media/mobile-insert-script-users.png
[2]: ../Media/mobile-schedule-job-script.png

<!-- URLs. -->
[Mobile Services server script reference]: http://msdn.microsoft.com/en-us/library/windowsazure/jj554226.aspx
[Schedule backend jobs in Mobile Services]: /en-us/develop/mobile/tutorials/schedule-backend-tasks/
[request object]: http://msdn.microsoft.com/en-us/library/windowsazure/jj554218.aspx
[User object]: http://msdn.microsoft.com/en-us/library/windowsazure/jj554220.aspx
[push object]: http://msdn.microsoft.com/en-us/library/windowsazure/jj554217.aspx
[insert function]: http://msdn.microsoft.com/en-us/library/windowsazure/jj554229.aspx
[update function]: http://msdn.microsoft.com/en-us/library/windowsazure/jj554214.aspx
[delete function]: http://msdn.microsoft.com/en-us/library/windowsazure/jj554215.aspx
[read function]: http://msdn.microsoft.com/en-us/library/windowsazure/jj554224.aspx
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