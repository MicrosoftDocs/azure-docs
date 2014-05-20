<properties pageTitle="Work with a .NET backend mobile service" metaKeywords="Web API, mobile service, Azure, controllers" description="Provides examples on how to define, register, and use server-side components in Azure Mobile Services." metaCanonical="" services="mobile-services" documentationCenter="Mobile" title="Work with server scripts in Mobile Services" authors="glenga" solutions="mobile" manager="" editor="" />


# Work with a .NET backend mobile service

This article provides detailed information about and examples of how to work with a .NET backend Visual Studio project that defines you mobile service in Azure Mobile Services. This topic is divided into these sections:

+ [Introduction]
+ [Table operations]
	+ [How to: Register for table operations]
	+ [How to: Override the default response]
	+ [How to: Override execute success]
	+ [How to: Override default error handling]
	+ [How to: Add custom parameters]
	+ [How to: Work with table users][How to: Work with users]
+ [Custom API][Custom API anchor]
	+ [How to: Define a custom API]
	+ [How to: Implement HTTP methods]
	+ [How to: Send and receive data as XML]
	+ [How to: Work with users and headers in a custom API]
	+ [How to: Define multiple routes in a custom API]
+ [Job Scheduler]
	+ [How to: Define scheduled job scripts]
+ [Source control, shared code, and helper functions]
	+ [How to: Load Node.js modules]
	+ [How to: Use helper functions]
	+ [How to: Share code by using source control]
	+ [How to: Work with app settings] 
+ [Using the command line tool]
+ [Working with tables]
	+ [How to: Access tables from scripts]
	+ [How to: Perform Bulk Inserts]
	+ [How to: Map JSON types to database types]
	+ [Using Transact-SQL to access tables]
+ [Debugging and troubleshooting]
	+ [How to: Write output to the mobile service logs]

##<a name="intro"></a>Introduction

In a .NET backend mobile service, you can define custom business logic as JavaScript code that's stored and executed on the server. This server script code is assigned to one of the following server functions:

+ [Insert, read, update, or delete operations on a given table][Table operations].
+ [Scheduled jobs][Job Scheduler].
+ [HTTP methods defined in a custom API][Custom API anchor]. 

The signature of the main function in the server script depends on the context of where the script is used. You can also define common script code as nodes.js modules that are shared across scripts. For more information, see [Source control and shared code][Source control, shared code, and helper functions].

For descriptions of individual server script objects and functions, see [Mobile Services server script reference]. 


<!-- Anchors. -->
[Introduction]: #intro
[Table operations]: #table-scripts
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

