<properties 
	pageTitle="Work with a JavaScript backend mobile service" 
	description="Provides examples on how to define, register, and use server scripts in Azure Mobile Services." 
	services="mobile-services" 
	documentationCenter="" 
	authors="RickSaling" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="javascript" 
	ms.devlang="multiple" 
	ms.topic="article" 
	ms.date="07/21/2016" 
	ms.author="ricksal"/>


# Work with a JavaScript backend mobile service

This article provides detailed information about and examples of how to work with a JavaScript backend in Azure Mobile Services. 

##<a name="intro"></a>Introduction

In a JavaScript backend mobile service, you can define custom business logic as JavaScript code that's stored and executed on the server. This server script code is assigned to one of the following server functions:

+ [Insert, read, update, or delete operations on a given table][Table operations].
+ [Scheduled jobs][Job Scheduler].
+ [HTTP methods defined in a custom API][Custom API anchor]. 

The signature of the main function in the server script depends on the context of where the script is used. You can also define common script code as nodes.js modules that are shared across scripts. For more information, see [Source control and shared code][Source control, shared code, and helper functions].

For descriptions of individual server script objects and functions, see [Mobile Services server script reference]. 


##<a name="table-scripts"></a>Table operations

A table operation script is a server script that is registered to an operation on a table&mdash;insert, read, update, or delete (*del*). This section describes how to work with table operations in a JavaScript backend, which includes the following sections:

+ [Overview of table operations][Basic table operations]
+ [How to: Register for table operations]
+ [How to: Override the default response]
+ [How to: Override execute success]
+ [How to: Override default error handling]
+ [How to: Generate unique ID values](#generate-guids)
+ [How to: Add custom parameters]
+ [How to: Work with table users][How to: Work with users]

###<a name="basic-table-ops"></a>Overview of table operations

The name of the script must match the kind of operation for which it is registered. Only one script can be registered for a given table operation. The script is executed every time that the given operation is invoked by a REST request&mdash;for example, when a POST request is received to insert an item into the table. Mobile Services does not preserve state between script executions. Because a new global context is created every time a script is run, any state variables that are defined in the script are reinitialized. If you want to store state from one request to another, create a table in your mobile service, and then read and write the state to the table. For more information, see [How to: Access tables from scripts].

You write table operation scripts if you need to enforce customized business logic when the operation is executed. For example, the following script rejects insert operations where the string length of the `text` field is greater than ten characters: 

	function insert(item, user, request) {
	    if (item.text.length > 10) {
	        request.respond(statusCodes.BAD_REQUEST, 
				'Text length must be less than 10 characters');
	    } else {
	        request.execute();
	    }
	}

A table script function always takes three arguments.

- The first argument varies depending on the table operation. 

	- For inserts and updates, it is an **item** object, which is a JSON representation of the row being affected by the operation. This allows you to access column values by name, for example, *item.Owner*, where *Owner* is one of the names in the JSON representation.
	- For a delete, it is the ID of the record to delete. 
	- And for a read, it is a [query object] that specifies the rowset to return.

- The second argument is always a [user object][User object] that represents the user that submitted the request. 

- The third argument is always a [request object][request object], by which you can control execution of the requested operation and the response that's sent to the client.

Here are the canonical main-function signatures for the table operations: 

+ [Insert][insert function]: `function insert (item, user, request) { ... }`
+ [Update][update function]: `function update (item, user, request) { ... }`
+ [Delete][delete function]: `function del (id, user, request) { ... }`
+ [Read][read function]: `function read (query, user, request) { ... }`

>[AZURE.NOTE]A function that's registered to the delete operation must be named _del_ because delete is a reserved keyword in JavaScript. 

Every server script has a main function, and may have optional helper functions. Even though a server script may have been created for a specific table, it can also reference other tables in the same database. You can also define common functions as modules that can be shared across scripts. For more information, see [Source control and shared code][Source control, shared code, and helper functions].

###<a name="register-table-scripts"></a>How to: Register table scripts

You can define server scripts that are registered to a table operation in one of the following ways:

+ In the [Azure classic portal]. Scripts for table operations are accessed in the **Scripts** tab for a given table. The following shows the default code registered to the insert script for the `TodoItem` table. You can override this code with your own custom business logic.

	![1][1]
	
	To learn how to do this, see [Validate and modify data in Mobile Services by using server scripts].  

+ By using source control. When you have source control enabled, simply create a file named <em>`<table>`</em>.<em>`<operation>`</em>.js in the .\service\table subfolder in your git repository, where <em>`<table>`</em> is the name of the table and <em>`<operation>`</em> is the table operation being registered. For more information, see [Source control and shared code][Source control, shared code, and helper functions].

+ From the command prompt by using the Azure command line tool. For more information, see [Using the command line tool].


A table operation script must call at least one of the following functions of the [request object] to make sure that the client receives a response. 
 
+ **execute function**: The operation is completed as requested and the standard response is returned.
 
+ **respond function**: A custom response is returned.

> [AZURE.IMPORTANT] When a script has a code path in which neither **execute** nor **respond** is invoked, the operation may become unresponsive.

The following script calls the **execute** function to complete the data operation requested by the client: 

	function insert(item, user, request) { 
	    request.execute(); 
	}

In this example, the item is inserted into the database and the appropriate status code is returned to the user. 

When the **execute** function is called, the `item`, [query][query object], or `id` value that was passed as the first argument into the script function is used to perform the operation. For an insert, update or query operation, you can modify the item or query before you call **execute**: 

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
 
>[AZURE.NOTE]In a delete script, changing the value of the supplied userId variable does not affect which record gets deleted.

For more examples, see [Read and write data], [Modify the request] and [Validate data].


###<a name="override-response"></a>How to: Override the default response

You can also use a script to implement validation logic that can override the default response behavior. If validation fails, just call the **respond** function instead of the **execute** function and write the response to the client: 

	function insert(item, user, request) {
	    if (item.userId !== user.userId) {
	        request.respond(statusCodes.FORBIDDEN, 
	        'You may only insert records with your userId.');
	    } else {
	        request.execute();
	    }
	}

In this example, the request is rejected when the inserted item does not have a `userId` property that matches the `userId` of the [user object] that's supplied for the authenticated client. In this case, a database operation (*insert*) does not occur, and a response that has a 403 HTTP status code and a custom error message is returned to the client. For more examples, see [Modify the response].

###<a name="override-success"></a>How to: Override execute success

By default in a table operation, the **execute** function writes responses automatically. However, you can pass two optional parameters to the execute function that override its behavior on success and/or on error.

By passing in a **success** handler when you call execute, you can modify the results of a query before you write them to the response. The following example calls `execute({ success: function(results) { ... })` to perform additional work after data is read from the database but before the response is written:

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

When you provide a **success** handler to the **execute** function, you must also call the **respond** function as part of the **success** handler so that the runtime knows that the script has completed and that a response can be written. When you call **respond** without passing any arguments, Mobile Services generates the default response. 

>[AZURE.NOTE]You can call **respond** without arguments to invoke the default response only after you first call the **execute** function.
 
###<a name="override-error"></a>How to: Override default error handling

The **execute** function can fail if there is a loss of connectivity to the database, an invalid object, or an incorrect query. By default when an error occurs, server scripts log the error and write an error result to the response. Because Mobile Services provides default error handling, you don't have to handle errors that may occur in the service. 

You can override the default error handling by implementing explicit error handling if you want a particular compensating action or when you want to use the global console object to write more detailed information to the log. Do this by supplying an **error** handler to the **execute** function:

	function update(item, user, request) { 
	  request.execute({ 
	    error: function(err) { 
	      // Do some custom logging, then call respond. 
	      request.respond(); 
	    } 
	  }); 
	}
 

When you provide an error handler, Mobile Services returns an error result to the client when **respond** is called.

You can also provide both a **success** and an **error** handler if you wish.

###<a name="generate-guids"></a>How to: Generate unique ID values

Mobile Services supports unique custom string values for the table's **id** column. This allows applications to use custom values such as email addresses or user names for the ID. 

String IDs provide you with the following benefits:

+ IDs are generated without making a round-trip to the database.
+ Records are easier to merge from different tables or databases.
+ IDs values can integrate better with an application's logic.

When a string ID value is not set on an inserted records, Mobile Services generates a unique value for the ID. You can generate your own unique ID values in server scripts. The script example below generates a custom GUID and assigns it to a new record's ID. This is similar to the id value that Mobile Services would generate if you didn't pass in a value for a record's ID.

	// Example of generating an id. This is not required since Mobile Services
	// will generate an id if one is not passed in.
	item.id = item.id || newGuid();
	request.execute();

	function newGuid() {
		var pad4 = function(str) { return "0000".substring(str.length) + str; };
		var hex4 = function () { return pad4(Math.floor(Math.random() * 0x10000 /* 65536 */ ).toString(16)); };
		return (hex4() + hex4() + "-" + hex4() + "-" + hex4() + "-" + hex4() + "-" + hex4() + hex4() + hex4());
	}


When an application provides a value for an ID, Mobile Services stores it as-is. This includes leading or trailing white spaces. White space are not trimmed from value.

The value for the `id` must be unique and it must not include characters from the following sets:

+ Control characters: [0x0000-0x001F] and [0x007F-0x009F]. For more information, see [ASCII control codes C0 and C1](http://en.wikipedia.org/wiki/Data_link_escape_character#C1_set).
+  Printable characters: **"**(0x0022), **\+** (0x002B), **/** (0x002F), **?** (0x003F), **\\** (0x005C), **`** (0x0060)
+  The ids "." and ".."

You can also use integer IDs for your tables. To use an integer ID, you must create your table with the `mobile table create` command using the `--integerId` option. This command is used with the Command-line Interface (CLI) for Azure. For more information on using the CLI, see [CLI to manage Mobile Services tables](../virtual-machines-command-line-tools.md#Mobile_Tables).


###<a name="access-headers"></a>How to: Access custom parameters

When you send a request to your mobile service, you can include custom parameters in the URI of the request to instruct your table operation scripts how to process a given request. You then modify your script to inspect the parameter to determine the processing path.

For example, the following URI for a POST request tells the service to not permit the insertion of a new *TodoItem* that has the same text value:

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

Note the syntax of the call to the **success** function in the above code:

 		        }).read({
		            success: insertItemIfNotComplete
		        });

In JavaScript it is a compact version of the lengthier equivalent: 

		success: function(results) 
		{ 
			insertItemIfNotComplete(results); 
		}


###<a name="work-with-users"></a>How to: Work with users

In Azure Mobile Services, you can use an identity provider to authenticate users. For more information, see [Get started with authentication]. When an authenticated user invokes a table operation, Mobile Services uses the [user object] to supply information about the user to the registered script function. The **userId** property can be used to store and retrieve user-specific information. The following example sets the owner property of an item based on the **userId** of an authenticated user:

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

##<a name="custom-api"></a>Custom APIs

This section describes how you create and work with custom API endpoints, which includes the following sections: 
	
+ [Overview of custom APIs](#custom-api-overview)
+ [How to: Define a custom API]
+ [How to: Implement HTTP methods]
+ [How to: Send and receive data as XML]
+ [How to: Work with users and headers in a custom API]
+ [How to: Define multiple routes in a custom API]

###<a name="custom-api-overview"></a>Overview of custom APIs

A custom API is an endpoint in your mobile service that is accessed by one or more of the standard HTTP methods: GET, POST, PUT, PATCH, DELETE. A separate function export can be defined for each HTTP method supported by the custom API, all in a single script file. The registered script is invoked when a request to the custom API using the given method is received. For more information, see [Custom API].

When custom API functions are called by the Mobile Services runtime, both a [request][request object] and [response][response object] object are supplied. These objects expose the functionality of the [express.js library], which can be leveraged by your scripts. The following custom API named **hello** is a very simple example that returns _Hello, world!_ in response to a POST request:

		exports.post = function(request, response) {
		    response.send(200, "{ message: 'Hello, world!' }");
		} 

The **send** function on the [response object] returns your desired response to the client. This code is invoked by sending a POST request to the following URL:

		https://todolist.azure-mobile.net/api/hello  

The global state is maintained between executions. 

###<a name="define-custom-api"></a>How to: Define a custom API

You can define server scripts that are registered to HTTP methods in a custom API endpoint in one of the following ways:

+ In the [Azure classic portal]. Custom API scripts are created and modified in the **API** tab. The server script code is in the **Scripts** tab of a given custom API. The following shows the script that is invoked by a POST request to the `CompleteAll` custom API endpoint. 

	![2][2]
	
	Access permissions to custom API methods are assigned in the Permissions tab. To see how this custom API was created, see [Call a custom API from the client].  

+ By using source control. When you have source control enabled, simply create a file named <em>`<custom_api>`</em>.js in the .\service\api subfolder in your git repository, where <em>`<custom_api>`</em> is the name of the custom API being registered. This script file contains an _exported_ function for each HTTP method exposed by the custom API. Permissions are defined in a companion .json file. For more information, see [Source control and shared code][Source control, shared code, and helper functions].

+ From the command prompt by using the Azure command line tool. For more information, see [Using the command line tool].

###<a name="handle-methods"></a>How to: Implement HTTP methods

A custom API can handle one or more of the HTTP methods, GET, POST, PUT, PATCH, and DELETE. An exported function is defined for each HTTP method handled by the custom API. A single custom API code file can export one or all of the following functions:

		exports.get = function(request, response) { ... };
		exports.post = function(request, response) { ... };
		exports.patch = function(request, response) { ... };
		exports.put = function(request, response) { ... };
		exports.delete = function(request, response) { ... };

The custom API endpoint cannot be called using an HTTP method that has not been implemented in the server script, and a 405 (Method Not Allowed) error response is returned. Separate permission levels can be assigned to each support HTTP method.

###<a name="api-return-xml"></a>How to: Send and receive data as XML

When clients store and retrieve data, Mobile Services uses JavaScript Object Notation (JSON) to represent data in the message body. However, there are scenarios where you instead want to use an XML payload. For example, Windows Store apps have a built-in periodic notifications functionality that requires the service to emit XML. For more information, see [Define a custom API that supports periodic notifications].

The following **OrderPizza** custom API function returns a simple XML document as the response payload:

		exports.get = function(request, response) {
		  response.set('content-type', 'application/xml');
		  var xml = '<?xml version="1.0"?><PizzaOrderForm><PizzaOrderForm/>';
		  response.send(200, xml);
		};

This custom API function is invoked by an HTTP GET request to the following endpoint:

		https://todolist.azure-mobile.net/api/orderpizza

###<a name="get-api-user"></a>How to: Work with users and headers in a custom API

In Azure Mobile Services, you can use an identity provider to authenticate users. For more information, see [Get started with authentication]. When an authenticated user requests a custom API, Mobile Services uses the [user object] to provide information about the user to custom API code. The [user object] is accessed from the user property of the [request object]. The **userId** property can be used to store and retrieve user-specific information. 

The following **OrderPizza** custom API function sets the owner property of an item based on the **userId** of an authenticated user:

		exports.post = function(request, response) {
			var userTable = request.service.tables.getTable('user');
			userTable.lookup(request.user.userId, {
				success: function(userRecord) {
					callPizzaAPI(userRecord, request.body, function(orderResult) {
						response.send(201, orderResult);
					});
				}
			});
		
		};

This custom API function is invoked by an HTTP POST request to the following endpoint:

		https://<service>.azure-mobile.net/api/orderpizza

You can also access a specific HTTP header from the [request object], as shown in the following code:

		exports.get = function(request, response) {    
    		var header = request.header('my-custom-header');
    		response.send(200, "You sent: " + header);
		};

This simple example reads a custom header named `my-custom-header`, then returns the value in the response.

###<a name="api-routes"></a>How to: Define multiple routes in a custom API

Mobile Services enables you to define multiple paths, or routes, in a custom API. For example, HTTP GET requests to the following URLs in a **calculator** custom API will invoke an **add** or **subtract** function, respectively: 

+ `https://<service>.azure-mobile.net/api/calculator/add`
+ `https://<service>.azure-mobile.net/api/calculator/sub`

Multiple routes are defined by exporting a **register** function, which is passed an **api** object (similar to the [express object in express.js]) that is used to register routes under the custom API endpoint. The following example implements the **add** and **sub** methods in the **calculator** custom API: 

		exports.register = function (api) {
		    api.get('add', add);
		    api.get('sub', subtract);
		}
		
		function add(req, res) {
		    var result = parseInt(req.query.a) + parseInt(req.query.b);
		    res.send(200, { result: result });
		}
		
		function subtract(req, res) {
		    var result = parseInt(req.query.a) - parseInt(req.query.b);
		    res.send(200, { result: result });
		}

The **api** object passed to the **register** function exposes a function for each HTTP method (**get**, **post**, **put**, **patch**, **delete**). These functions register a route to a defined function for a specific HTTP method. Each function takes two parameters, the first is the route name and the second is the function registered to the route. 

The two routes in the above custom API example can be invoked by HTTP GET requests as follows (shown with the response):

+ `https://<service>.azure-mobile.net/api/calculator/add?a=1&b=2`

		{"result":3}

+ `https://<service>.azure-mobile.net/api/calculator/sub?a=3&b=5`

		{"result":-2}

##<a name="scheduler-scripts"></a>Job Scheduler

Mobile Services enables you to define server scripts that are executed either as jobs on a fixed schedule or on-demand from the Azure classic portal. Scheduled jobs are useful for performing periodic tasks such as cleaning-up table data and batch processing. For more information, see [Schedule jobs].

Scripts that are registered to scheduled jobs have a main function with the same name as the scheduled job. Because a scheduled script is not invoked by an HTTP request, there is no context that can be passed by the server runtime and the function takes no parameters. Like other kinds of scripts, you can have subroutine functions and require shared modules. For more information, see [Source control, shared code, and helper functions].

###<a name="scheduler-scripts"></a>How to: Define scheduled job scripts

A server script can be assigned to a job that's defined in the Mobile Services Scheduler. These scripts belong to the job and are executed according to the job schedule. (You can also use the [Azure classic portal] to run jobs on demand.) A script that defines a scheduled job has no parameters because Mobile Services doesn't pass it any data; it's executed as a regular JavaScript function and doesn't interact with Mobile Services directly. 

You define scheduled jobs in one of the following ways: 

+ In the [Azure classic portal] in the **Script** tab in the scheduler:

	![3][3]

	For more information about how to do this, see [Schedule backend jobs in Mobile Services]. 

+ From the command prompt by using the Azure command line tool. For more information, see [Using the command line tool].

>[AZURE.NOTE]When you have source control enabled, you can edit scheduled job script files directly in the .\service\scheduler subfolder in your git repository. For more information, see [How to: Share code by using source control].

##<a name="shared-code"></a>Source control, shared code, and helper functions

This sections shows you how to leverage source control to add your own custom node.js modules, shared code and other code reuse strategies, including the following sections:

+ [Overview of leveraging shared code](#leverage-source-control)
+ [How to: Load Node.js modules]
+ [How to: Use helper functions]
+ [How to: Share code by using source control]
+ [How to: Work with app settings] 

###<a name="leverage-source-control"></a>Overview of leveraging shared code

Because Mobile Services uses Node.js on the server, your scripts already have access to the built-in Node.js modules. You can also use source control to define your own modules or add other Node.js modules to your service.

The following are just some of the more useful modules that can be leveraged in your scripts by using the global **require** function:

+ **azure**: Exposes the functionality of the Azure SDK for Node.js. For more information, see the [Azure SDK for Node.js]. 
+ **crypto**: Provides crypto functionality of OpenSSL. For more information, see the [Node.js documentation][crypto API].
+ **path**: Contains utilities for working with file paths. For more information, see the [Node.js documentation][path API].
+ **querystring**: Contains utilities for working with query strings. For more information, see the [Node.js documentation][querystring API].
+ **request**: Sends HTTP requests to external REST services, such as Twitter and Facebook. For more information, see [Send HTTP request].
+ **sendgrid**: Sends email by using the Sendgrid email service in Azure. For more information, see [Send email from Mobile Services with SendGrid].
+ **url**: Contains utilities to parse and resolve URLs. For more information, see the [Node.js documentation][url API].
+ **util**: Contains various utilities, such as string formatting and object type checking. For more information, see the [Node.js documentation][util API]. 
+ **zlib**: Exposes compression functionality, such as gzip and deflate. For more information, see the [Node.js documentation][zlib API]. 

###<a name="modules-helper-functions"></a>How to: Leverage modules

Mobile Services exposes a set of modules that scripts can load by using the global **require** function. For example, a script can require **request** to make HTTP requests: 

	function update(item, user, request) { 
	    var httpRequest = require('request'); 
	    httpRequest('http://www.google.com', function(err, response, body) { 
	    	... 
	    }); 
	} 


###<a name="shared-code-source-control"></a>How to: Share code by using source control

You can use source control with the Node.js package manager (npm) to control which modules are available to your mobile service. There are two ways to do this:

+ For modules that are published to and installed by npm, use the package.json file to declare which packages you want to be installed by your mobile service. In this way, your service always has access to the latest version of the required packages. The package.json file lives in the `.\service` directory. For more information, see [Support for package.json in Azure Mobile Services].

+ For private or custom modules, you can use npm to manually install the module into the `.\service\node_modules` directory of your source control. For an example of how to manually upload a module, see [Leverage shared code and Node.js modules in your server scripts].

	>[AZURE.NOTE]When `node_modules` already exists in the directory hierarchy, NPM will create the `\node-uuid` subdirectory there instead of creating a new `node_modules` in the repository. In this case, just delete the existing `node_modules` directory.

After you commit the package.json file or custom modules to the repository for your mobile service, use **require** to reference the modules by name.   

>[AZURE.NOTE] Modules that you specify in package.json or upload to your mobile service are only used in your server script code. These modules are not used by the Mobile Services runtime.

###<a name="helper-functions"></a>How to: Use helper functions

In addition to requiring modules, individual server scripts can include helper functions. These are functions that are separate from the main function, which can be used to factor code in the script. 

In the following example, a table script is registered to the insert operation, which includes the helper function **handleUnapprovedItem**:


	function insert(item, user, request) {
	    if (!item.approved) {
	        handleUnapprovedItem(item, user, request);
	    } else {
	        request.execute();
	    }
	}
	
	function handleUnapprovedItem(item, user, request) {
	    // Do something with the supplied item, user, or request objects.
	}
 
In a script, helper functions must be declared after the main function. You must declare all variables in your script. Undeclared variables cause an error.

Helper functions can also be defined once and shared between server scripts. To share a function between scripts, functions must be exported and the script file must exist in the `.\service\shared\` directory. The following is a template for how to export a shared function in a file `.\services\shared\helpers.js`:

		exports.handleUnapprovedItem = function (tables, user, callback) {
		    
		    // Do something with the supplied tables or user objects and 
			// return a value to the callback function.
		};
 
You can then use a function like this in a table operation script:

		function insert(item, user, request) {
		    var helper = require('../shared/helper');
		    helper.handleUnapprovedItem(tables, user, function(result) {
		        	
					// Do something based on the result.
		            request.execute();
		        }
		    }
		}

In this example, you must pass both a [tables object] and a [user object] to the shared function. This is because shared scripts cannot access the global [tables object], and the [user object] only exists in the context of a request.

Script files are uploaded to the shared directory either by using [source control][How to: Share code by using source control] or by using the [command line tool][Using the command line tool].

###<a name="app-settings"></a>How to: Work with app settings

Mobile Services enables you to securely store values as app settings, which can be accessed by your server scripts at runtime.  When you add data to the app settings of your mobile service, the name/value pairs are stored encrypted and you can access them in your server scripts without hard-coding them in the script file. For more information, see [App settings].

The following custom API example uses the supplied [service object] to retrieve an app setting value.  

		exports.get = function(request, response) {
		
			// Get the MY_CUSTOM_SETTING value from app settings.
		    var customSetting = 
		        request.service.config.appSettings.my_custom_setting;
				
			// Do something and then send a response.

		}

The following code uses the configuration module to retrieve Twitter access token values, stored in app settings, that are used in a scheduled job script:

		// Get the service configuration module.
		var config = require('mobileservice-config');

		// Get the stored Twitter consumer key and secret. 
		var consumerKey = config.twitterConsumerKey,
		    consumerSecret = config.twitterConsumerSecret
		// Get the Twitter access token from app settings.    
		var accessToken= config.appSettings.TWITTER_ACCESS_TOKEN,
		    accessTokenSecret = config.appSettings.TWITTER_ACCESS_TOKEN_SECRET;

Note that this code also retrieves Twitter consumer key values stored in the **Identity** tab in the portal. Because a **config object** is not available in table operation and scheduled job scripts, you must require the configuration module to access app settings. For a complete example, see [Schedule backend jobs in Mobile Services].

<h2><a name="command-prompt"></a>Using the command line tool</h2>

In Mobile Services, you can create, modify, and delete server scripts by using the Azure command line tool. Before uploading your scripts, make sure that you are using the following directory structure:

![4][4]

Note that this directory structure is the same as the git repository when using source control. 

When uploading script files from the command line tool, you must first navigate to the `.\services\` directory. The following command uploads a script named `todoitem.insert.js` from the `table` subdirectory:

		~$azure mobile script upload todolist table/todoitem.insert.js
		info:    Executing command mobile script upload
		info:    mobile script upload command OK

The following command returns information about every script file maintained in your mobile service:

		~$ azure mobile script list todolist
		info:    Executing command mobile script list
		+ Retrieving script information
		info:    Table scripts
		data:    Name                       Size
		data:    -------------------------  ----
		data:    table/channels.insert      1980
		data:    table/TodoItem.insert      5504
		data:    table/TodoItem.read        64
		info:    Shared scripts
		data:    Name              Size
		data:    ----------------  ----
		data:    shared/helper.js  62
		data:    shared/uuid.js    7452
		info:    Scheduled job scripts
		data:    Job name    Script name           Status    Interval     Last run  Next run
		data:    ----------  --------------------  --------  -----------  --------  --------
		data:    getUpdates  scheduler/getUpdates  disabled  15 [minute]  N/A       N/A
		info:    Custom API scripts
		data:    Name                    Get          Put          Post         Patch        Delete
		data:    ----------------------  -----------  -----------  -----------  -----------  -----------
		data:    completeall             application  application  application  application  application
		data:    register_notifications  application  application  user         application  application
		info:    mobile script list command OK

For more information, see [Commands to manage Azure Mobile Services]. 

##<a name="working-with-tables"></a>Working with tables

This section details strategies for working directly with SQL Database table data, including the following sections:

+ [Overview of working with tables](#overview-tables)
+ [How to: Access tables from scripts]
+ [How to: Perform Bulk Inserts]
+ [How to: Map JSON types to database types]
+ [Using Transact-SQL to access tables]

###<a name="overview-tables"></a>Overview of working with tables

Many scenarios in Mobile Services require server scripts to access tables in the database. For example. because Mobile Services does not preserve state between script executions, any data that needs to be persisted between script executions must be stored in tables. You might also want to examine entries in a permissions table or store audit data instead of just writing to the log, where data has a limited duration and cannot be accessed programmatically. 

Mobile Services has two ways of accessing tables, either by using a [table object] proxy or by composing Transact-SQL queries using the [mssql object]. The [table object] makes it easy to access table data from your sever script code, but the [mssql object] supports more complex data operations and provides the most flexibility. 

###<a name="access-tables"></a>How to: Access tables from scripts

The easiest way to access tables from your script is by using the [tables object]. The **getTable** function returns a [table object] instance that's a proxy for accessing the requested table. You can then call functions on the proxy to access and change data. 

Scripts registered to both table operations and scheduled jobs can access the [tables object] as a global object. This line of code gets a proxy for the *TodoItems* table from the global [tables object]: 

		var todoItemsTable = tables.getTable('TodoItems');

Custom API scripts can access the [tables object] from the <strong>service</strong> property of the supplied [request object]. This line of code gets [tables object] from the request:

		var todoItemsTable = request.service.tables.getTable('TodoItem');

> [AZURE.NOTE] Shared functions cannot access the **tables** object directly. In a shared function, you must pass the tables object to the function.

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

A final example is in the code sample here: [How to: Access custom parameters][How to: Add custom parameters].

###<a name="bulk-inserts"></a>How to: Perform Bulk Inserts

If you use a **for** or **while** loop to directly insert a large number of items (1000, for example) into a  table , you may encounter a SQL connection limit that causes some of the inserts to fail. Your request may never complete or it may return a HTTP 500 Internal Server Error.  To avoid this problem, you can insert the items in batches of 10 or so. After the first batch is inserted, submit the next batch, and so on.

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

###<a name="JSON-types"></a>How to: Map JSON types to database types

The collections of data types on the client and in a Mobile Services database table are different. Sometimes they map easily to one another, and other times they don't. Mobile Services performs a number of type transformations in the mapping:

- The client language-specific types are serialized into JSON.
- The JSON representation is translated into JavaScript before it appears in server scripts.
- The JavaScript data types are converted to SQL database types when saved using the [tables object].

The transformation from client schema into JSON varies across platforms.  JSON.NET is used in Windows Store and Windows Phone clients. The Android client uses the gson library.  The iOS client uses the NSJSONSerialization class. The default serialization behavior of each of these libraries is used, except that date objects are converted to JSON strings that contain the date that's encoded by using ISO 8601.

When you are writing server scripts that use [insert], [update], [read] or [delete] functions, you can access the JavaScript representation of your data. Mobile Services uses the Node.js's deserialization function ([JSON.parse](http://es5.github.io/#x15.12)) to transform JSON on the wire into JavaScript objects. However Mobile Services does  a transformation to extract **Date** objects from ISO 8601 strings.

When you use the [tables object] or the [mssql object], or just let your table scripts execute, the deserialized JavaScript objects are inserted into your SQL database. In that process, object properties are mapped to T-SQL types:

JavaScript property|T-SQL type
---|---
Number|Float(53)
Boolean|Bit
Date|DateTimeOffset(3)|
String|Nvarchar(max)
Buffer|Not supported
Object|Not supported
Array|Not supported
Stream|Not supported

###<a name="TSQL"></a>Using Transact-SQL to access tables

The easiest way to work table data from server scripts is by using a [table object] proxy. However, there are more advanced scenarios that are not supported by the [table object], such as as join queries and other complex queries and invoking stored procedures. In these cases, you must execute Transact-SQL statements directly against the relational table by using the [mssql object]. This object provides the following functions:

- **query**: executes a query, specified by a TSQL string; the results are returned to the **success** callback on the **options** object. The query can include parameters if the *params* parameter is present.
- **queryRaw**: like *query* except that the result set returned from the query is in a "raw" format (see example below).
- **open**: used to get a connection to your Mobile Services database, and you can then use the connection object to invoke database operations such as transactions.

These methods give you increasingly more low-level control over the query processing.

+ [How to: Run a static query]
+ [How to: Run a dynamic query]
+ [How to: Join relational tables]
+ [How to: Run a query that returns *raw* results]
+ [How to: Get access to a database connection]	

####<a name="static-query"></a>How to: Run a static query

The following query has no parameters and returns three records from the `statusupdate` table. The rowset is in standard JSON format.

		mssql.query('select top 3 * from statusupdates', {
		    success: function(results) {
		        console.log(results);
		    },
            error: function(err) {
                console.log("error is: " + err);
			}
		});


####<a name="dynamic-query"></a>How to: Run a dynamic parameterized query

The following example implements custom authorization by reading permissions for each user from the permissions table. The placeholder (?) is replaced with the supplied parameter when the query is executed.

		    var sql = "SELECT _id FROM permissions WHERE userId = ? AND permission = 'submit order'";
		    mssql.query(sql, [user.userId], {
		        success: function(results) {
		            if (results.length > 0) {
		                // Permission record was found. Continue normal execution. 
		                request.execute();
		            } else {
		                console.log('User %s attempted to submit an order without permissions.', user.userId);
		                request.respond(statusCodes.FORBIDDEN, 'You do not have permission to submit orders.');
		            }
		        },
            	error: function(err) {
                	console.log("error is: " + err);
				}	
		    });


####<a name="joins"></a>How to: Join relational tables

You can join two tables by using the **query** method of the [mssql object] to pass in the TSQL code that implements the join. Let's assume we have some items in our **ToDoItem** table and each item in the table has a **priority** property, which corresponds to a column in the table. An item may look like this:

		{ text: 'Take out the trash', complete: false, priority: 1}

Let's also assume we have an additional table called **Priority** with rows that contain a priority **number** and a text **description**. For example, the priority number 1 might have the description of "Critical", with the object looking as follows:

		{ number: 1, description: 'Critical'}

We can now replace the **priority** number in our item with the text description of the priority number. We do this with a relational join of the two tables.

		mssql.query('SELECT t.text, t.complete, p.description FROM ToDoItem as t INNER JOIN Priority as p ON t.priority = p.number', {
			success: function(results) {
				console.log(results);
			},
            error: function(err) {
                console.log("error is: " + err);
		});
	
The script joins the two tables and writes the results to the log. The resulting objects could look like this:

		{ text: 'Take out the trash', complete: false, description: 'Critical'}


####<a name="raw"></a>How to: Run a query that returns *raw* results

This example executes the query, as before, but returns the resultset in "raw" format which requires you to parse it, row by row, and column by column. A possible scenario for this is if you need access to data types that Mobile Services does not support. This code simply writes the output to the console log so you can inspect the raw format.

		mssql.queryRaw('SELECT * FROM ToDoItem', {
		    success: function(results) {
		        console.log(results);
		    },
            error: function(err) {
                console.log("error is: " + err);
			}
		});

Here is the output from running this query. It contains metadata about each column in the table, followed by a representation of the rows and columns.

		{ meta: 
		   [ { name: 'id',
		       size: 19,
		       nullable: false,
		       type: 'number',
		       sqlType: 'bigint identity' },
		     { name: 'text',
		       size: 0,
		       nullable: true,
		       type: 'text',
		       sqlType: 'nvarchar' },
		     { name: 'complete',
		       size: 1,
		       nullable: true,
		       type: 'boolean',
		       sqlType: 'bit' },
		     { name: 'priority',
		       size: 53,
		       nullable: true,
		       type: 'number',
		       sqlType: 'float' } ],
		  rows: 
		   [ [ 1, 'good idea for the future', null, 3 ],
		     [ 2, 'this is important but not so much', null, 2 ],
		     [ 3, 'fix this bug now', null, 0 ],
		     [ 4, 'we need to fix this one real soon now', null, 1 ],
		   ] }

####<a name="connection"></a>How to: Get access to a database connection

You can use the **open** method to get access to the database connection. One reason to do this might be if you need to use database transactions.

Successful execution of the **open** causes the database connection to be passed into the **success** function as a parameter. You can invoke any of the following functions on the **connection** object: *close*, *queryRaw*, *query*, *beginTransaction*, *commit*, and *rollback*.

		    mssql.open({
		        success: function(connection) {
		            connection.query(//query to execute);
		        },
	            error: function(err) {
	                console.log("error is: " + err);
				}
		    });

##<a name="debugging"></a>Debugging and troubleshooting

The primary way to debug and troubleshoot your server scripts is by writing to the service log. By default, Mobile Services writes errors that occur during service script execution to the service logs. Your scripts can also write to the logs. Writing to logs is great way to debug your scripts and validate that they are behaving as desired.

###<a name="write-to-logs"></a>How to: Write output to the mobile service logs

To write to the logs, use the global [console object]. Use the **log** or **info** function to log information-level warnings. The **warning** and **error** functions log their respective levels, which are called-out in the logs. 

> [AZURE.NOTE] To view the logs for your mobile service, log on to the [Azure classic portal](https://manage.windowsazure.com/), select your mobile service, and then choose the **Logs** tab.

You can also use the logging functions of the [console object] to format your messages using parameters. The following example supplies a JSON object as a parameter to the message string:

	function insert(item, user, request) {
	    console.log("Inserting item '%j' for user '%j'.", item, user);  
	    request.execute();
	}

Notice that the string `%j` is used as the placeholder for a JSON object and that parameters are supplied in sequential order. 

To avoid overloading your log, you should remove or disable calls to console.log() that aren't needed for production use.

<!-- Anchors. -->
[Introduction]: #intro
[Table operations]: #table-scripts
[Basic table operations]: #basic-table-ops
[How to: Register for table operations]: #register-table-scripts
[How to: Define table scripts]: #execute-operation
[How to: override the default response]: #override-response
[How to: Modify an operation]: #modify-operation
[How to: Override success and error]: #override-success-error
[How to: Override execute success]: #override-success
[How to: Override default error handling]: #override-error
[How to: Access tables from scripts]: #access-tables
[How to: Add custom parameters]: #access-headers
[How to: Work with users]: #work-with-users
[How to: Define scheduled job scripts]: #scheduler-scripts
[How to: Refine access to tables]: #authorize-tables
[Using Transact-SQL to access tables]: #TSQL
[How to: Run a static query]: #static-query
[How to: Run a dynamic query]: #dynamic-query
[How to: Run a query that returns *raw* results]: #raw
[How to: Get access to a database connection]: #connection
[How to: Join relational tables]: #joins
[How to: Perform Bulk Inserts]: #bulk-inserts
[How to: Map JSON types to database types]: #JSON-types
[How to: Load Node.js modules]: #modules-helper-functions
[How to: Write output to the mobile service logs]: #write-to-logs
[Source control, shared code, and helper functions]: #shared-code
[Using the command line tool]: #command-prompt
[Working with tables]: #working-with-tables
[Custom API anchor]: #custom-api
[How to: Define a custom API]: #define-custom-api
[How to: Share code by using source control]: #shared-code-source-control
[How to: Use helper functions]: #helper-functions
[Debugging and troubleshooting]: #debugging
[How to: Implement HTTP methods]: #handle-methods
[How to: Work with users and headers in a custom API]: #get-api-user
[How to: Access custom API request headers]: #get-api-headers
[Job Scheduler]: #scheduler-scripts
[How to: Define multiple routes in a custom API]: #api-routes
[How to: Send and receive data as XML]: #api-return-xml
[How to: Work with app settings]: #app-settings

[1]: ./media/mobile-services-how-to-use-server-scripts/1-mobile-insert-script-users.png
[2]: ./media/mobile-services-how-to-use-server-scripts/2-mobile-custom-api-script.png
[3]: ./media/mobile-services-how-to-use-server-scripts/3-mobile-schedule-job-script.png
[4]: ./media/mobile-services-how-to-use-server-scripts/4-mobile-source-local-cli.png

<!-- URLs. -->
[Mobile Services server script reference]: http://msdn.microsoft.com/library/windowsazure/jj554226.aspx
[Schedule backend jobs in Mobile Services]: /develop/mobile/tutorials/schedule-backend-tasks/
[request object]: http://msdn.microsoft.com/library/windowsazure/jj554218.aspx
[response object]: http://msdn.microsoft.com/library/windowsazure/dn303373.aspx
[User object]: http://msdn.microsoft.com/library/windowsazure/jj554220.aspx
[push object]: http://msdn.microsoft.com/library/windowsazure/jj554217.aspx
[insert function]: http://msdn.microsoft.com/library/windowsazure/jj554229.aspx
[insert]: http://msdn.microsoft.com/library/windowsazure/jj554229.aspx
[update function]: http://msdn.microsoft.com/library/windowsazure/jj554214.aspx
[delete function]: http://msdn.microsoft.com/library/windowsazure/jj554215.aspx
[read function]: http://msdn.microsoft.com/library/windowsazure/jj554224.aspx
[update]: http://msdn.microsoft.com/library/windowsazure/jj554214.aspx
[delete]: http://msdn.microsoft.com/library/windowsazure/jj554215.aspx
[read]: http://msdn.microsoft.com/library/windowsazure/jj554224.aspx
[query object]: http://msdn.microsoft.com/library/windowsazure/jj613353.aspx
[apns object]: http://msdn.microsoft.com/library/windowsazure/jj839711.aspx
[mpns object]: http://msdn.microsoft.com/library/windowsazure/jj871025.aspx
[wns object]: http://msdn.microsoft.com/library/windowsazure/jj860484.aspx
[table object]: http://msdn.microsoft.com/library/windowsazure/jj554210.aspx
[tables object]: http://msdn.microsoft.com/library/windowsazure/jj614364.aspx
[mssql object]: http://msdn.microsoft.com/library/windowsazure/jj554212.aspx
[console object]: http://msdn.microsoft.com/library/windowsazure/jj554209.aspx
[Read and write data]: http://msdn.microsoft.com/library/windowsazure/jj631640.aspx
[Validate data]: http://msdn.microsoft.com/library/windowsazure/jj631638.aspx
[Modify the request]: http://msdn.microsoft.com/library/windowsazure/jj631635.aspx
[Modify the response]: http://msdn.microsoft.com/library/windowsazure/jj631631.aspx
[Azure classic portal]: https://manage.windowsazure.com/
[Schedule jobs]: http://msdn.microsoft.com/library/windowsazure/jj860528.aspx
[Validate and modify data in Mobile Services by using server scripts]: /develop/mobile/tutorials/validate-modify-and-augment-data-dotnet/
[Commands to manage Azure Mobile Services]: ../virtual-machines-command-line-tools.md#Mobile_Scripts
[Windows Store Push]: /develop/mobile/tutorials/get-started-with-push-dotnet/
[Windows Phone Push]: /develop/mobile/tutorials/get-started-with-push-wp8/
[iOS Push]: /develop/mobile/tutorials/get-started-with-push-ios/
[Android Push]: /develop/mobile/tutorials/get-started-with-push-android/
[Azure SDK for Node.js]: http://go.microsoft.com/fwlink/p/?LinkId=275539
[Send HTTP request]: http://msdn.microsoft.com/library/windowsazure/jj631641.aspx
[Send email from Mobile Services with SendGrid]: /develop/mobile/tutorials/send-email-with-sendgrid/
[Get started with authentication]: http://go.microsoft.com/fwlink/p/?LinkId=287177
[crypto API]: http://go.microsoft.com/fwlink/p/?LinkId=288802
[path API]: http://go.microsoft.com/fwlink/p/?LinkId=288803
[querystring API]: http://go.microsoft.com/fwlink/p/?LinkId=288804
[url API]: http://go.microsoft.com/fwlink/p/?LinkId=288805
[util API]: http://go.microsoft.com/fwlink/p/?LinkId=288806
[zlib API]: http://go.microsoft.com/fwlink/p/?LinkId=288807
[Custom API]: http://msdn.microsoft.com/library/windowsazure/dn280974.aspx
[Call a custom API from the client]: /develop/mobile/tutorials/call-custom-api-dotnet/#define-custom-api
[express.js library]: http://go.microsoft.com/fwlink/p/?LinkId=309046
[Define a custom API that supports periodic notifications]: /develop/mobile/tutorials/create-pull-notifications-dotnet/
[express object in express.js]: http://expressjs.com/api.html#express
[Store server scripts in source control]: /develop/mobile/tutorials/store-scripts-in-source-control/
[Leverage shared code and Node.js modules in your server scripts]: /develop/mobile/tutorials/store-scripts-in-source-control/#use-npm
[service object]: http://msdn.microsoft.com/library/windowsazure/dn303371.aspx
[App settings]: http://msdn.microsoft.com/library/dn529070.aspx
[config module]: http://msdn.microsoft.com/library/dn508125.aspx
[Support for package.json in Azure Mobile Services]: http://go.microsoft.com/fwlink/p/?LinkId=391036
 
