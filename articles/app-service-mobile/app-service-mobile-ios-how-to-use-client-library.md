<properties
	pageTitle="How to Use iOS SDK for Azure Mobile Apps"
	description="How to Use iOS SDK for Azure Mobile Apps"
	services="app-service\mobile"
	documentationCenter="ios"
	authors="krisragh"
	manager="dwrede"
	editor=""/>

<tags
	ms.service="app-service-mobile"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-ios"
	ms.devlang="objective-c"
	ms.topic="article"
	ms.date="09/28/2015"
	ms.author="krisragh"/>

# How to Use iOS Client Library for Azure Mobile Apps

[AZURE.INCLUDE [app-service-mobile-selector-offline](../../includes/app-service-mobile-selector-client-library.md)]
&nbsp;  
[AZURE.INCLUDE [app-service-mobile-note-mobile-services](../../includes/app-service-mobile-note-mobile-services.md)]

This guide teaches you to perform common scenarios using the latest [Azure Mobile Apps iOS SDK](https://go.microsoft.com/fwLink/?LinkID=266533&clcid=0x409). If you are new to Azure Mobile Apps, first complete [Azure Mobile Apps Quick Start] to create a backend, create a table, and download a pre-built iOS Xcode project. In this guide, we focus on the client-side iOS SDK. To learn more about the .NET server-side SDK for the backend, see [Work with .NET Backend](app-service-mobile-dotnet-backend-how-to-use-server-sdk.md)

##<a name="Setup"></a>Setup and Prerequisites

This guide assumes that you have created a backend with a table. This guide assumes that the table has the same schema as the tables in those tutorials. This guide also assumes that in your code, you reference `WindowsAzureMobileServices.framework` and import `WindowsAzureMobileServices/WindowsAzureMobileServices.h`.

##<a name="create-client"></a>How to: Create Client

To access an Azure Mobile Apps backend in your project, create an `MSClient`. Replace `AppUrl` with the app URL. You may leave `gatewayURLString` and `applicationKey` empty. If you set up a gateway for authentication, populate `gatewayURLString` with the gateway URL.

```
MSClient *client = [MSClient clientWithApplicationURLString:@"AppUrl" gatewayURLString:@"" applicationKey:@""];
```

##<a name="table-reference"></a>How to: Create Table Reference

To access or update data, create a reference to the backend table. Replace `TodoItem` with the name of your table.

```
	MSTable *table = [client tableWithName:@"TodoItem"];
```

##<a name="querying"></a>How to: Query Data

To create a database query, query the `MSTable` object. The following query gets all the items in `TodoItem` and logs the text of each item.

```
[table readWithCompletion:^(MSQueryResult *result, NSError *error) {
		if(error) { // error is nil if no error occured
				NSLog(@"ERROR %@", error);
		} else {
				for(NSDictionary *item in result.items) { // items is NSArray of records that match query
						NSLog(@"Todo Item: %@", [item objectForKey:@"text"]);
				}
		}
}];
```

##<a name="filtering"></a>How to: Filter Returned Data

To filter results, there are many available options.

To filter using a predicate, use an `NSPredicate` and `readWithPredicate`. The following filters returned data to find only incomplete Todo items.

```
// Create a predicate that finds items where complete is false
NSPredicate * predicate = [NSPredicate predicateWithFormat:@"complete == NO"];
// Query the TodoItem table and update the items property with the results from the service
[table readWithPredicate:predicate completion:^(MSQueryResult *result, NSError *error) {
		if(error) {
				NSLog(@"ERROR %@", error);
		} else {
				for(NSDictionary *item in result.items) {
						NSLog(@"Todo Item: %@", [item objectForKey:@"text"]);
				}
		}
}];
```

##<a name="query-object"></a>How to: Use MSQuery

To perform a complex query (including sorting and paging), create an `MSQuery` object, directly or by using a predicate:

```
    MSQuery *query = [table query];
    MSQuery *query = [table queryWithPredicate: [NSPredicate predicateWithFormat:@"complete == NO"]];
```

`MSQuery` lets you control several query behaviors, including the following. Execute an `MSQuery` query by calling `readWithCompletion` on it, as shown in the next example.
* Specify order of results
* Limit which fields to return
* Limit how many records to return
* Specify total count in response
* Specify custom query string parameters in request
* Apply additional functions


## <a name="sorting"></a>How to: Sort Data with MSQuery

To sort results, let's look at an example. To first ascendingly by field `text` and then descendingly by field `completion`, invoke `MSQuery` like so:

```
[query orderByAscending:@"text"];
[query orderByDescending:@"complete"];
[query readWithCompletion:^(MSQueryResult *result, NSError *error) {
		if(error) {
				NSLog(@"ERROR %@", error);
		} else {
				for(NSDictionary *item in result.items) {
						NSLog(@"Todo Item: %@", [item objectForKey:@"text"]);
				}
		}
}];
```


## <a name="selecting"></a><a name="parameters"></a>How to: Limit Fields and Expand Query String Parameters with MSQuery

To limit fields to be returned in a query, specify the names of the fields in the **selectFields** property. This returns only the text and completed fields:

```
	query.selectFields = @[@"text", @"completed"];
```

To include additional query string parameters in the server request (for example, because a custom server-side script uses them), populate `query.parameters` like so:

```
	query.parameters = @{
		@"myKey1" : @"value1",
		@"myKey2" : @"value2",
	};
```

##<a name="inserting"></a>How to: Insert Data

To insert a new table row, create a new `NSDictionary` and invoke `table insert`. Mobile Services automatically generates new columns based on the `NSDictionary` if [Dynamic Schema] is not disabled.

If `id` is not provided, the backend automatically generates a new unique ID. Provide your own `id` to use email addresses, usernames, or your own custom values as ID. Providing your own ID may ease joins and business-oriented database logic.

```
	NSDictionary *newItem = @{@"id": @"custom-id", @"text": @"my new item", @"complete" : @NO};
	[self.table insert:newItem completion:^(NSDictionary *result, NSError *error) {
		// The result contains the new item that was inserted,
		// depending on your server scripts it may have additional or modified
		// data compared to what was passed to the server.
		if(error) {
				NSLog(@"ERROR %@", error);
		} else {
						NSLog(@"Todo Item: %@", [result objectForKey:@"text"]);
		}
	}];
```

##<a name="modifying"></a>How to: Modify Data

To update an existing row, modify an item and call `update`:

```
	NSMutableDictionary *newItem = [oldItem mutableCopy]; // oldItem is NSDictionary
	[newItem setValue:@"Updated text" forKey:@"text"];
	[self.table update:newItem completion:^(NSDictionary *item, NSError *error) {
		// Handle error or perform additional logic as needed
	}];
```

Alternatively, supply the row ID and the updated field:

```
	[self.table update:@{@"id":@"37BBF396-11F0-4B39-85C8-B319C729AF6D", @"Complete":@YES} completion:^(NSDictionary *item, NSError *error) {
		// Handle error or perform additional logic as needed
	}];
```

At minimum, the `id` attribute must be set when making updates.

##<a name="deleting"></a>How to: Delete Data

To delete an item, invoke `delete` with the item:

```
	[self.table delete:item completion:^(id itemId, NSError *error) {
		// Handle error or perform additional logic as needed
	}];
```

Alternatively, delete by providing a row ID:

```
	[self.table deleteWithId:@"37BBF396-11F0-4B39-85C8-B319C729AF6D" completion:^(id itemId, NSError *error) {
		// Handle error or perform additional logic as needed
	}];   
```

At minimum, the `id` attribute must be set when making deletes.


##<a name="errors"></a>How to: Handle Errors

When you call a mobile service, the completion block contains an `NSError *error` parameter. When an error occurs, this parameter is non-nil. In your code, you should check this parameter and handle the error as needed.

The file [`<WindowsAzureMobileServices/MSError.h>`](https://github.com/Azure/azure-mobile-services/blob/master/sdk/iOS/src/MSError.h) defines the constants `MSErrorResponseKey`, `MSErrorRequestKey`, and `MSErrorServerItemKey` to get more data related to the error. In addition, the file defines constants for each error code. For an example on how to use these constants, see [Conflict-Handler] for its usage of `MSErrorServerItemKey` and `MSErrorPreconditionFailed`.

<!-- Anchors. -->

[What is Mobile Services]: #what-is
[Concepts]: #concepts
[Setup and Prerequisites]: #Setup
[How to: Create the Mobile Services client]: #create-client
[How to: Create a table reference]: #table-reference
[How to: Query data from a mobile service]: #querying
[Filter returned data]: #filtering
[Sort returned data]: #sorting
[Return data in pages]: #paging
[Select specific columns]: #selecting
[How to: Bind data to the user interface]: #binding
[How to: Insert data into a mobile service]: #inserting
[How to: Modify data in a mobile service]: #modifying
[How to: Authenticate users]: #authentication
[Cache authentication tokens]: #caching-tokens
[How to: Upload images and large files]: #blobs
[How to: Handle errors]: #errors
[How to: Design unit tests]: #unit-testing
[How to: Customize the client]: #customizing
[Customize request headers]: #custom-headers
[Customize data type serialization]: #custom-serialization
[Next Steps]: #next-steps
[How to: Use MSQuery]: #query-object

<!-- Images. -->

<!-- URLs. -->
[Azure Mobile Apps Quick Start]: app-service-mobile-ios-get-started.md

[Add Mobile Services to Existing App]: /develop/mobile/tutorials/get-started-data
[Get started with Mobile Services]: /develop/mobile/tutorials/get-started-ios
[Validate and modify data in Mobile Services by using server scripts]: /develop/mobile/tutorials/validate-modify-and-augment-data-ios
[Mobile Services SDK]: https://go.microsoft.com/fwLink/p/?LinkID=266533
[Authentication]: /develop/mobile/tutorials/get-started-with-users-ios
[iOS SDK]: https://developer.apple.com/xcode

[Handling Expired Tokens]: http://go.microsoft.com/fwlink/p/?LinkId=301955
[Live Connect SDK]: http://go.microsoft.com/fwlink/p/?LinkId=301960
[Permissions]: http://msdn.microsoft.com/library/windowsazure/jj193161.aspx
[Service-side Authorization]: mobile-services-javascript-backend-service-side-authorization.md
[Use scripts to authorize users]: /develop/mobile/tutorials/authorize-users-in-scripts-ios
[Dynamic Schema]: http://go.microsoft.com/fwlink/p/?LinkId=296271
[How to: access custom parameters]: /develop/mobile/how-to-guides/work-with-server-scripts#access-headers
[Create a table]: http://msdn.microsoft.com/library/windowsazure/jj193162.aspx
[NSDictionary object]: http://go.microsoft.com/fwlink/p/?LinkId=301965
[ASCII control codes C0 and C1]: http://en.wikipedia.org/wiki/Data_link_escape_character#C1_set
[CLI to manage Mobile Services tables]: ../virtual-machines-command-line-tools.md#Mobile_Tables
[Conflict-Handler]: mobile-services-ios-handling-conflicts-offline-data.md#add-conflict-handling
