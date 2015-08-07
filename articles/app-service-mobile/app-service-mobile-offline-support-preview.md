<properties
	pageTitle="Offline support for Azure Mobile Apps (Windows Store) | Mobile Dev Center"
	description="This topic describes the offline support for Azure Mobile Apps"
	documentationCenter="windows"
	authors="wesmc7777"
	manager="dwrede"
	editor=""
	services="app-service\mobile"/>

<tags
	ms.service="app-service-mobile"
	ms.workload="mobile"
	ms.tgt_pltfrm="na"
	ms.devlang="multiple"
	ms.topic="article"
	ms.date="08/06/2015"
	ms.author="wesmc"/>

# Offline support for Azure Mobile Apps

## What is offline support for Azure Mobile Apps?

Offline sync allows end-users on a mobile device to interact with a Mobile App when there is no actual network connection to the Mobile App backend. Create, Read, Update, and Delete (CRUD) operations are all executed against local database store. When the device is back online, the changes in the local database on the device can be synced with the Mobile App backend.

Offline sync has several potential uses:

* Improve app responsiveness by caching server data locally on the device
* Make apps resilient against intermittent network connectivity
* Allow end-users to create and modify data even when there is no network access, supporting scenarios with little or no connectivity
* Sync data across multiple devices and detect conflicts when the same record is modified by two devices

Local database store details

* SQLite must be installed on Windows
* Supporting other db stores or custom stores?



## What is a sync table?

Mobile device client code normally interacts with data in a Mobile App backend using the `IMobileServiceTable` interface or it's equivalent on the client platform. To support offline, a local database table acts as buffer between the actual backend database table and client requests. 

Client code will interact with the table using the `IMobileServiceSyncTable` interface to support offline buffering. This interface supports all the methods of `IMobileServiceTable` with additional support for pulling data from a Mobile App backend table and merging it into a local store table. How the local table is synchronized with the backend database is mainly controlled by your logic in the client app.

 

## How offline synchronization behaves


When supporting offline, your client code controls when local changes will be synchronized with a Mobile App backend. Nothing is sent to the backend server until an `IMobileServicesSyncContext.PushAsync` (push) or `IMobileServicesSyncTable.PullAsync` (pull) is executed. 

Notice that push is executed on a different interface (`IMobileServicesSyncContext`) than a pull. This is because an app could change multiple tables which in turn are related through relationships. As a result the `IMobileServicesSyncContext` associated with your `MobileServiceClient` tracks changes the client app makes for all local tables. When a push to the backend server is executed on the context, all tracked table changes are updated on the server.

If a pull is executed against a table that has pending local updates tracked by the context, that pull operation will automatically be preceded by a context push. Again, this helps preserve table relationships but, may result in an unexpected push if you are not aware of this behavior.

You can optimize the data set pulled over the network as a result of pull operations using a scope query and query identifier passed as parameters to `PullAsync`. The query identifier can be any string you choose that is unique for your query in your client app. For example, if you wanted to only pull todoitems from the server that had text containing the work "milk", the following code would pull a todoitem from the server with the text "Pick up milk".

	await todoTable.PullAsync("milkQuery", todoTable.CreateQuery().Where(i => i.Text.Contains("milk")));


* Pull individual tables, and can scope with queries (see query ID below)
* Purge
	* Removes all items from local store
	* If there are pending operations, will throw exception unless the parameter for "force" is set
	* Why purge: 
		* During development if local store has gotten into a bad state. In Windows, Xamarin, and Android, can also change the filename for the local store
		* If you haven't implemented soft delete in the server
		* NOTE: this is probably too complicated to include initially If your pull query can cause stale data on the client. For instance, suppose in the todo example, on device1 you only pull items that are not completed. Then, if a todo item "Buy milk" is marked completed on the server or another device, then device1 will still have the "Get milk" todo item. The app should purge data periodically to avoid this problem.


There’s a lot more to it, and that’s probably what needs to be fleshed out by me.
 
For instance:

* all sync table operations are put into an operation queue, which is then played back when push is called.
* Conflict handling can either be done through a handler, or in bulk
* Pull on a table will push changes in the sync context if there are pending operations for that table. So, once there is more than one table, it’s behaviorally different. (hopefully that answers your question, Wes)
 
Regarding the questions that we get: based on forum posts and SO, these are the underlying issues:

* What is a sync context?
* What’s the difference between a SyncTable and a regular one?
* What is the __version column?
* How do I pull multiple tables?
* How to do common conflict handling patterns (out of scope for now)
* What state is stored on the server?  How do clients know they need to sync?
* Foreign key relationships between tables


## local store
* The local storage can be customized on the client. By default there is a local store in Windows, Xamarin, and Android, that is based on SQLite (give the class names). In iOS, the default implementation is based on Core Data.
* The data objects on the client should have some system properties, most are not required.
	* Managed
		* Write out the attributes
	* iOS
		*table for the entity
* Note: because the iOS local store is based on Core Data, the developer must define the following tables:
	* System tables 

## Incremental sync and querying
* Pass queryID to pull to enable incremental syncing
* To use this, the server MUST support send a valid __updatedAt system column, and must support sorting on this column
* This is used only on the client.
* Incremental sync works by storing the latest updatedAt value for each batch result of the pull operation, uses '1970-01-01' initially
* Query looks like this:
* mymobileservice-code.azurewebsites.net/tables/TodoItem?$filter=(__updatedAt ge datetimeoffset'1970-01-01T00:00:00.0000000%2B00:00')&$orderby=__updatedAt&$skip=0&$top=50&__includeDeleted=true&__systemproperties=__updatedAt%2C__deleted
* Note: when using incremental sync, you cannot add your own $orderby clause

## Conflict handling
* Opt-in to conflict handling on the client by including a "version" column in the data model
* See local store system properties
		

## Soft delete (nice to have)

## Debugging (nice to have section)
* Code for a delegating handler on managed
* MSFilter on iOS
* ? on Android
* NOTE: this is not strictly related to offine sync, but people 
