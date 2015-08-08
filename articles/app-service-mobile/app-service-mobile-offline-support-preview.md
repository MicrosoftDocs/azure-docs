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

Offline sync allows end-users on a mobile device to interact with a Mobile App when there is no actual network connection to the Azure Mobile App backend. Create, Read, Update, and Delete (CRUD) operations are all executed against local database store. When the device is back online, the changes in the local database on the device can be synced with the Mobile App backend.

Offline sync has several potential uses:

* Improve app responsiveness by caching server data locally on the device
* Make apps resilient against intermittent network connectivity
* Allow end-users to create and modify data even when there is no network access, supporting scenarios with little or no connectivity
* Sync data across multiple devices and detect conflicts when the same record is modified by two devices.



The following tutorials provide a basic walkthrough of Offline Sync for Azure Mobile Apps:

* [Using offline data sync in Azure Mobile Apps](app-service-mobile-windows-store-dotnet-get-started-offline-data-preview.md)
* [Handling database conflicts with offline data sync]   


## What is a sync table?

Mobile device client code normally interacts with data in a Mobile App backend using the `IMobileServiceTable` interface or it's equivalent on a client platform. To support offline, a local database table acts as buffer between the actual backend database table and client requests. This local database is often called a sync table or the local store. Before any table operations can be performed, the local store must be initialized. 

Client code will interact with the table using the `IMobileServiceSyncTable` interface to support offline buffering. This interface supports all the methods of `IMobileServiceTable` along with additional support for pulling data from a Mobile App backend table and merging it into a local store table. How the local table is synchronized with the backend database is mainly controlled by your logic in the client app.

The sync table uses the [System Properties](https://msdn.microsoft.com/library/azure/dn518225.aspx) on the table to implement change tracking for offline synchronization. 

The local storage itself can be customized on the client. By default the Mobile Apps client SDKs support a SQLite local store for Windows, Xamarin, and Android. In iOS, the default implementation is based on Core Data.

* The data objects on the client should have some system properties, most are not required.
	* Managed
		* Write out the attributes
	* iOS
		*table for the entity
* Note: because the iOS local store is based on Core Data, the developer must define the following tables:
	* System tables 


Local database store details:

* Default SQLite support with Mobile Apps but SQLite must be installed on Windows.
* Supporting other db stores or custom stores? Implement the `IMobileServiceLocalStore` interface.

 

## How offline synchronization behaves


When supporting offline, your client code controls when local changes will be synchronized with a Mobile App backend. Nothing is sent to the backend server until an `IMobileServicesSyncContext.PushAsync` (push) or `IMobileServicesSyncTable.PullAsync` (pull) is executed. The following list contains important points that help describe how offline sync works.

* **Sync Context**: Notice that push is executed on a different interface (`IMobileServicesSyncContext`) than a pull. This is because an app could change multiple tables which in turn are related through relationships. As a result the `IMobileServicesSyncContext` associated with your `MobileServiceClient` tracks changes the client app makes for all local tables. Each sync related table operation is put into an operation queue, which is then played back on the server database when the sync context executes a push. Note that all tracked table changes are updated on the server to preserve relationships that may exist across tables. Only records that have been modified in some way locally (through CUD operations) will be sent to the server.

* **Implicit Pushes**: If a pull is executed against a table that has pending local updates tracked by the context, that pull operation will automatically be preceded by a context push. Again, this helps preserve table relationships but, may result in an unexpected push if you are not aware of this behavior.

* **Incremental Sync**: You can optimize the data set pulled over the network as a result of pull operations using a scope query and query identifier passed as parameters to `PullAsync`. Providing these parameters enables incremental sync. Incremental sync uses the `UpdatedAt` timestamp to get only those records modified since the last sync. The query identifier can be any string you choose that is unique for each logical query in your app. For example, if you wanted to only pull todoitems from the server that had text containing the work "milk", the following code would pull a todoitem from the server with the text "Pick up milk".

		await todoTable.PullAsync("milkQuery", todoTable.CreateQuery().Where(i => i.Text.Contains("milk")));

	The query ID is used to store the last updated timestamp from the results of the last pull operation. If the query has a parameter, you could use the value as part of the query ID. For instance, if you are filtering on userid, your query ID could be as follows:

		await todoTable.PullAsync("todoItems" + userid, syncTable.Where(u => u.UserId = userid));

    If you want to opt out of incremental sync, pass `null` as the query ID. In this case, all records will be retrieved on every call to `PullAsync`, which is potentially inefficient.

		*To use this, the server MUST support send a valid __updatedAt system column, and must support sorting on this column
		* This is used only on the client.
		* Incremental sync works by storing the latest updatedAt value for each batch result of the pull operation, uses '1970-01-01' initially
		* Query looks like this:
		* mymobileservice-code.azurewebsites.net/tables/TodoItem?$filter=(__updatedAt ge datetimeoffset'1970-01-01T00:00:00.0000000%2B00:00')&$orderby=__updatedAt&$skip=0&$top=50&__includeDeleted=true&__systemproperties=__updatedAt%2C__deleted
		* Note: when using incremental sync, you cannot add your own $orderby clause

 	
* **Purging**: Azure Mobile apps can clear the contents of the local store database using `IMobileServiceSyncTable.PurgeAsync`. This may be necessary if a local store is in a bad state preventing synchronization. A purge will remove all items from the local store. If there are operations pending synchronization with the server database, the purge will throw an exception unless the parameter the force parameter is set to true.

	Another reason for purging is stale data on the client. For instance, suppose in the todoitem example, Device1 only pulls items that are not completed. Then, a todoitem "Buy milk" is marked completed on the server by another device. Device1 will still have the "Buy milk" todoitem in local store. The app should purge data periodically clear such stale records.

	!!! **Purging with/vs Soft Delete** !!!



## Conflict handling
* Opt-in to conflict handling on the client by including a "version" column in the data model
* See local store system properties
* Conflict handling can either be done through a handler, or in bulk
* Note that the `MobileServicePushFailedException` can occur for both a push and a pull operation because of **implicit push**. 

## Soft delete (nice to have)

## Debugging (nice to have section)
* Code for a delegating handler on managed
* MSFilter on iOS
* ? on Android
* NOTE: this is not strictly related to offine sync, but people 
