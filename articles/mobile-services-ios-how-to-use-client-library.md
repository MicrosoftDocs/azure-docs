<properties
	pageTitle="How to Use iOS Client Library for Azure Mobile Services"
	description="How to Use iOS Client Library for Mobile Services"
	services="mobile-services"
	documentationCenter="ios"
	authors="krisragh"
	manager="dwrede"
	editor=""/>

<tags
	ms.service="mobile-services"
	ms.workload="mobile"
	ms.tgt_pltfrm=""
	ms.devlang="objective-c"
	ms.topic="article"
	ms.date="02/27/2015"
	ms.author="krisragh"/>




# How to Use iOS Client Library for Azure Mobile Services

[AZURE.INCLUDE [mobile-services-selector-client-library](../includes/mobile-services-selector-client-library.md)]

This guide teaches you to perform common scenarios using the Azure Mobile Services [iOS SDK]. If you are new to Mobile Services, first complete [Mobile Services Quick Start] or [Add Mobile Services to Existing App] to configure your account, create a table, and create a mobile service.

[AZURE.INCLUDE [mobile-services-concepts](../includes/mobile-services-concepts.md)]

##<a name="Setup"></a>Setup and Prerequisites

This guide assumes that you have created a mobile service with a table. For more information see [Create a table], or reuse the `TodoItem` table created in [Mobile Services Quick Start] or [Add Mobile Services to Existing App]. This guide assumes that the table has the same schema as the tables in those tutorials. This guide also assumes that your Xcode references `WindowsAzureMobileServices.framework` and imports `WindowsAzureMobileServices/WindowsAzureMobileServices.h`.

##<a name="create-client"></a>How to: Create Mobile Services Client

To access an Azure mobile service in your project, create an `MSClient` client object. Replace `AppUrl` and `AppKey` with the mobile service URL and the application key Dashboard values, respectively.

```
MSClient *client = [MSClient clientWithApplicationURLString:@"AppUrl" applicationKey:@"AppKey"];
```

##<a name="table-reference"></a>How to: Create Table Reference

To access or update data for your Azure mobile service, create a reference to the table. Replace `TodoItem` with the name of your table.

```
	MSTable *table = [client tableWithName:@"TodoItem"];
```

##<a name="querying"></a>How to: Query Data

To create a database query, query the `MSTable` object. The following query gets all the items in `TodoItem` and logs the text of each item.

```
	[table readWithCompletion:^(NSArray *items, NSInteger totalCount, NSError *error) {
		if(error) { // error is nil if no error occured
			NSLog(@"ERROR %@", error);
		} else {
			for(NSDictionary *item in items) { // items is NSArray of records that match query
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
[self.table readWithPredicate:predicate completion:^(NSArray *results, NSInteger totalCount, NSError *error)
{
		if(error) {
				NSLog(@"ERROR %@", error);
		} else {
				for(NSDictionary *item in results) {
						NSLog(@"Todo Item: %@", [item objectForKey:@"text"]);
				}
		}

		// Let the caller know that we finished
		completion();
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

To sort results, let's look at an example. To first ascendingly by field `duration` and then descendingly by field `completion`, invoke `MSQuery` like so:

```
	[query orderByAscending:@"duration"];
	[query orderByDescending:@"complete"];
	[query readWithCompletion:^(NSArray *tableItems, NSInteger totalCount, NSError *error) {
			if(error) {
					NSLog(@"ERROR %@", error);
			} else {
					for(NSDictionary *item in tableItems) {
							NSLog(@"Todo Item: %@", [item objectForKey:@"text"]);
					}
			}
	}];
```

## <a name="paging"></a>How: Return Data in Pages with MSQuery

Mobile Services limits the amount of records that are returned in a single response. To control the number of records displayed to your users you must implement a paging system.  Paging is performed by using the following three properties of the **MSQuery** object:

+	`BOOL includeTotalCount`
+	`NSInteger fetchLimit`
+	`NSInteger fetchOffset`


In the following example, a simple function requests 20 records from the server and then appends them to the local collection of previously loaded records:

```
	- (bool) loadResults() {
		MSQuery *query = [table query];

		query.includeTotalCount = YES;
		query.fetchLimit = 20;
		query.fetchOffset = self.loadedItems.count;

		[query readWithCompletion:^(NSArray *items, NSInteger totalCount, NSError *error) {
			if(!error) {
				// Add the items to our local copy
				[self.loadedItems addObjectsFromArray:items];

				// Set a flag to keep track if there are any additional records we need to load
				self.moreResults = (self.loadedItems.count < totalCount);
			}
		}];
	}
```

## <a name="selecting"></a><a name="parameters"></a>How to: Limit Fields and Expand Query String Paramters with MSQuery

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

<h2><a name="inserting"></a>How to: Insert Data</h2>

To insert a new table row, create a new `NSDictionary` and invoke `table insert`. Mobile Services automatically generates new columns based on the `NSDictionary` if [Dynamic Schema] is not disabled. Also, if `id` is not provided, the backend automatically generates a new unique ID. Provide your own `id` to use email addresses, usernames, or your own custom values as the ID. Providing your own `id` may ease joins and business-oriented database logic.

```
	NSDictionary *newItem = @{@"id": @"custom-id", @"text": @"my new item", @"complete" : @NO};
	[table insert:newItem completion:^(NSDictionary *result, NSError *error) {
		// The result contains the new item that was inserted,
		// depending on your server scripts it may have additional or modified
		// data compared to what was passed to the server.
	}];
```

<h2><a name="modifying"></a>How to: Modify Data</h2>

Update an existing object by modifying an item returned from a previous query and then calling the **update** function.

	NSMutableDictionary *item = [self.results.item objectAtIndex:0];
	[item setObject:@YES forKey:@"complete"];
	[table update:item completion:^(NSDictionary *item, NSError *error) {
		//handle errors or any additional logic as needed
	}];

When making updates, you only need to supply the field being updated, along with the row ID, as in the following example:

	[table update:@{@"id" : @"37BBF396-11F0-4B39-85C8-B319C729AF6D", @"Complete": @YES} completion:^(NSDictionary *item, NSError *error) {
		//handle errors or any additional logic as needed
	}];


To delete an item from the table, simply pass the item to the delete method, as follows:

	[table delete:item completion:^(id itemId, NSError *error) {
		//handle errors or any additional logic as needed
	}];

You can also just delete a record using its id directly, as in the following example:

	[table deleteWithId:@"37BBF396-11F0-4B39-85C8-B319C729AF6D" completion:^(id itemId, NSError *error) {
		//handle errors or any additional logic as needed
	}];

Note that, at minimum, the `id` attribute must be set when making updates and deletes.

<h2><a name="errors"></a>How to: Handle errors</h2>

When a call is made to the mobile service, the completion block contains an `NSError *error` parameter. When an error occurs, this parameter is returned a non-null value. In your code, you should check this parameter and handle the error as needed.

When an error has occurred, you can get more information by including the MSError.h file in the code:

    #import <WindowsAzureMobileServices/MSError.h>

This file defines the following constants you can use to access additional data from `[error userInfo]`:

+ **MSErrorResponseKey**: the HTTP response data associated with the error
* **MSErrorRequestKey**: the HTTP request data associated with the error

In addition, a constant is defined for each error code. An explanation of these codes can be found in the MSError.h file.

For an example of performing validation and handling any, see [Validate and modify data in Mobile Services by using server scripts]. In this topic, server-side validation is implemented by using server scripts. When invalid data is submitted, and error response is returned and this response is handled by the client.

<!--
<h2><a name="#unit-testing"></a>How to: Design unit tests</h2>

_(Optional) This section shows how to write unit test when using the client library (info from Yavor)._

<h2><a name="#customizing"></a>How to: Customize the client</h2>

_(Optional) This section shows how to send customize client behaviors._

###<a name="custom-headers"></a>How to: Customize request headers

_(Optional) This section shows how to send custom request headers._

For more information see, New topic about processing headers in the server-side.

###<a name="custom-serialization"></a>How to: Customize serialization

_(Optional) This section shows how to use attributes to customize how data types are serialized._

For more information see, New topic about processing headers in the server-side.

## <a name="next-steps"></a>Next steps
-->

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
[Add Mobile Services to Existing App]: /en-us/develop/mobile/tutorials/get-started-data
[Mobile Services Quick Start]: /en-us/develop/mobile/tutorials/get-started-ios
[Get started with Mobile Services]: /en-us/develop/mobile/tutorials/get-started-ios
[Validate and modify data in Mobile Services by using server scripts]: /en-us/develop/mobile/tutorials/validate-modify-and-augment-data-ios
[Mobile Services SDK]: https://go.microsoft.com/fwLink/p/?LinkID=266533
[Get started with authentication]: /en-us/develop/mobile/tutorials/get-started-with-users-ios
[iOS SDK]: https://developer.apple.com/xcode

[Handling Expired Tokens]: http://go.microsoft.com/fwlink/p/?LinkId=301955
[Live Connect SDK]: http://go.microsoft.com/fwlink/p/?LinkId=301960
[Permissions]: http://msdn.microsoft.com/library/windowsazure/jj193161.aspx
[Use scripts to authorize users]: /en-us/develop/mobile/tutorials/authorize-users-in-scripts-ios
[Dynamic schema]: http://go.microsoft.com/fwlink/p/?LinkId=296271
[How to: access custom parameters]: /en-us/develop/mobile/how-to-guides/work-with-server-scripts#access-headers
[Create a table]: http://msdn.microsoft.com/library/windowsazure/jj193162.aspx
[NSDictionary object]: http://go.microsoft.com/fwlink/p/?LinkId=301965
[ASCII control codes C0 and C1]: http://en.wikipedia.org/wiki/Data_link_escape_character#C1_set
[CLI to manage Mobile Services tables]: http://www.windowsazure.com/manage/linux/other-resources/command-line-tools/#Mobile_Tables
