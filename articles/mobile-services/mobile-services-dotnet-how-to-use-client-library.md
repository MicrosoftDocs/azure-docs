<properties
	pageTitle="Working with the Mobile Services managed client library (Windows | Xamarin) | Microsoft Azure"
	description="Learn how to use a .NET client for Azure Mobile Services with Windows and Xamarin apps."
	services="mobile-services"
	documentationCenter=""
	authors="ggailey777"
	manager="dwrede"
	editor=""/>

<tags
	ms.service="mobile-services"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-multiple"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="07/21/2016"
	ms.author="glenga"/>

# How to use the managed client library for Azure Mobile Services

[AZURE.INCLUDE [mobile-service-note-mobile-apps](../../includes/mobile-services-note-mobile-apps.md)]

&nbsp;


[AZURE.INCLUDE [mobile-services-selector-client-library](../../includes/mobile-services-selector-client-library.md)]

##Overview

This guide shows you how to perform common scenarios using the managed client library for Azure Mobile Services in Windows and Xamarin apps. The scenarios covered include querying for data, inserting, updating, and deleting data, authenticating users, and handling errors. If you are new to Mobile Services, you should consider first completing the [Mobile Services quickstart](mobile-services-dotnet-backend-xamarin-ios-get-started.md) tutorial.

[AZURE.INCLUDE [mobile-services-concepts](../../includes/mobile-services-concepts.md)]

##<a name="setup"></a>Setup and Prerequisites

We assume that you have created a mobile service and a table. For more information see [Create a table](http://go.microsoft.com/fwlink/?LinkId=298592). In the code used in this topic, the table is named `TodoItem` and it will have the following columns: `Id`, `Text`, and `Complete`.

The corresponding typed client-side .NET type is the following:


	public class TodoItem
	{
		public string Id { get; set; }

		[JsonProperty(PropertyName = "text")]
		public string Text { get; set; }

		[JsonProperty(PropertyName = "complete")]
		public bool Complete { get; set; }
	}

Note that the [JsonPropertyAttribute](http://www.newtonsoft.com/json/help/html/Properties_T_Newtonsoft_Json_JsonPropertyAttribute.htm) is used to define the mapping between the PropertyName mapping between the client type and the table.

When dynamic schema is enabled in a JavaScript backend mobile service, Azure Mobile Services automatically generates new columns based on the object in insert or update requests. For more information, see [Dynamic schema](http://go.microsoft.com/fwlink/?LinkId=296271). In a .NET backend mobile service, the table is defined in the data model of the project.

##<a name="create-client"></a>How to: Create the Mobile Services client

The following code creates the `MobileServiceClient` object that is used to access your mobile service.


	MobileServiceClient client = new MobileServiceClient(
		"AppUrl",
		"AppKey"
	);

In the code above, replace `AppUrl` and `AppKey` with the mobile service URL and application key, in that order. Both of these are available on the Azure classic portal, by selecting your mobile service and then clicking on "Dashboard".

>[AZURE.IMPORTANT]The application key is intended to filter-out random request against your mobile service, and it is distributed with the application. Because this key is not encrypted, it cannot be considered secure. To truly secure your mobile service data, you must instead authenticate users before allowing access. For more information, see [How to: Authenticate users](#authentication).

##<a name="instantiating"></a>How to: Create a table reference

All of the code that accesses or modifies data in the Mobile Services table calls functions on the `MobileServiceTable` object. You get a reference to the table by calling the [GetTable](https://msdn.microsoft.com/library/azure/jj554275.aspx) method on an instance of the `MobileServiceClient`, as follows:

    IMobileServiceTable<TodoItem> todoTable =
		client.GetTable<TodoItem>();

This is the typed serialization model; see the discussion of the [untyped serialization model](#untyped) below.

##<a name="querying"></a>How to: Query data from a mobile service

This section describes how to issue queries to the mobile service, which includes the following functionality:

- [Filter returned data]
- [Sort returned data]
- [Return data in pages]
- [Select specific columns]
- [Look up data by ID]

>[AZURE.NOTE] A server-driven page size is enforced to prevent all rows from being returned. This keeps default requests for large data sets from negatively impacting the service. To return more than 50 rows, use the `Take` method, as described in [Return data in pages].

### <a name="filtering"></a>How to: Filter returned data

The following code illustrates how to filter data by including a `Where` clause in a query. It returns all items from `todoTable` whose `Complete` property is equal to `false`. The `Where` function applies a row filtering predicate to the query against the table.

	// This query filters out completed TodoItems and
	// items without a timestamp.
	List<TodoItem> items = await todoTable
	   .Where(todoItem => todoItem.Complete == false)
	   .ToListAsync();

You can view the URI of the request sent to the mobile service by using message inspection software, such as browser developer tools or [Fiddler]. If you look at the request URI below,  notice that we are modifying the query string itself:

	GET /tables/todoitem?$filter=(complete+eq+false) HTTP/1.1
This request would normally be translated roughly into the following SQL query on the server side:

	SELECT *
	FROM TodoItem
	WHERE ISNULL(complete, 0) = 0

The function which is passed to the `Where` method can have an arbitrary number of conditions. For example, the line below:

	// This query filters out completed TodoItems where Text isn't null
	List<TodoItem> items = await todoTable
	   .Where(todoItem => todoItem.Complete == false
		   && todoItem.Text != null)
	   .ToListAsync();

Would be roughly translated (for the same request shown before) as

	SELECT *
	FROM TodoItem
	WHERE ISNULL(complete, 0) = 0
	      AND ISNULL(text, 0) = 0

The `where` statement above will find items with `Complete` status set to false with non-null `Text`.

We also could have written that in multiple lines instead:

	List<TodoItem> items = await todoTable
	   .Where(todoItem => todoItem.Complete == false)
	   .Where(todoItem => todoItem.Text != null)
	   .ToListAsync();

The two methods are equivalent and may be used interchangeably.  The former option -- of concatenating multiple predicates in one query -- is more compact and recommended.

The `where` clause supports operations that be translated into the Mobile Services OData subset. This includes relational operators (==, !=, <, <=, >, >=), arithmetic operators (+, -, /, *, %), number precision (Math.Floor, Math.Ceiling), string functions (Length, Substring, Replace, IndexOf, StartsWith, EndsWith), date properties (Year, Month, Day, Hour, Minute, Second), access properties of an object, and expressions combining all of these.

### <a name="sorting"></a>How to: Sort returned data

The following code illustrates how to sort data by including an `OrderBy` or `OrderByDescending` function in the query. It returns items from `todoTable` sorted ascending by the `Text` field.

	// Sort items in ascending order by Text field
	MobileServiceTableQuery<TodoItem> query = todoTable
					.OrderBy(todoItem => todoItem.Text)
 	List<TodoItem> items = await query.ToListAsync();

	// Sort items in descending order by Text field
	MobileServiceTableQuery<TodoItem> query = todoTable
					.OrderByDescending(todoItem => todoItem.Text)
 	List<TodoItem> items = await query.ToListAsync();

### <a name="paging"></a>How to: Return data in pages

By default, the server returns only the first 50 rows. You can increase the number of returned rows by calling the [Take] method. Use `Take` along with the [Skip] method to request a specific "page" of the total dataset returned by the query. The following query, when executed, returns the top three items in the table.

	// Define a filtered query that returns the top 3 items.
	MobileServiceTableQuery<TodoItem> query = todoTable
					.Take(3);
	List<TodoItem> items = await query.ToListAsync();

The following revised query skips the first three results and returns the next three after that. This is effectively the second "page" of data, where the page size is three items.

	// Define a filtered query that skips the top 3 items and returns the next 3 items.
	MobileServiceTableQuery<TodoItem> query = todoTable
					.Skip(3)
					.Take(3);
	List<TodoItem> items = await query.ToListAsync();

You can also use the [IncludeTotalCount] method to ensure that the query will get the total count for <i>all</i> the records that would have been returned, ignoring any take paging/limit clause specified:

	query = query.IncludeTotalCount();

This is a simplified scenario of passing hard-coded paging values to the `Take` and `Skip` methods. In a real-world app, you can use queries similar to the above with a pager control or comparable UI to let users navigate to previous and next pages.

####Paging considerations for a .NET backend mobile service

To override the 50 row limit in a .NET backend mobile service, you must also apply the [EnableQueryAttribute](https://msdn.microsoft.com/library/system.web.http.odata.enablequeryattribute.aspx) to the public GET method and specify the paging behavior. When applied to the method, the following sets the maximum returned rows to 1000:

    [EnableQuery(MaxTop=1000)]


### <a name="selecting"></a>How to: Select specific columns

You can specify which set of properties to include in the results by adding a `Select` clause to your query. For example, the following code shows how to select just one field and also how to select and format multiple fields:

	// Select one field -- just the Text
	MobileServiceTableQuery<TodoItem> query = todoTable
					.Select(todoItem => todoItem.Text);
	List<string> items = await query.ToListAsync();

	// Select multiple fields -- both Complete and Text info
	MobileServiceTableQuery<TodoItem> query = todoTable
					.Select(todoItem => string.Format("{0} -- {1}", todoItem.Text.PadRight(30), todoItem.Complete ? "Now complete!" : "Incomplete!"));
	List<string> items = await query.ToListAsync();

All the functions described so far are additive, so we can just keep calling them and we'll each time affect more of the query. One more example:

	MobileServiceTableQuery<TodoItem> query = todoTable
					.Where(todoItem => todoItem.Complete == false)
					.Select(todoItem => todoItem.Text)
					.Skip(3).
					.Take(3);
	List<string> items = await query.ToListAsync();

### <a name="lookingup"></a>How to: Look up data by ID

The `LookupAsync` function can be used to look up objects from the database with a particular ID.

	// This query filters out the item with the ID of 37BBF396-11F0-4B39-85C8-B319C729AF6D
	TodoItem item = await todoTable.LookupAsync("37BBF396-11F0-4B39-85C8-B319C729AF6D");

##<a name="inserting"></a>How to: Insert data into a mobile service

> [AZURE.NOTE] If you want to perform insert, lookup, delete, or update operations on a type, then you need to create a member called **Id**. This is why the example class **TodoItem** has a member of name **Id**. A valid id value must always be present in update and delete operations.

The following code illustrates how to insert new rows into a table. The parameter contains the data to be inserted as a .NET object.

	await todoTable.InsertAsync(todoItem);

If a unique custom ID value is not included in the `todoItem` passed to the `todoTable.InsertAsync` call, a value for ID is generated by the server and is set in the `todoItem` object returned to the client.

To insert untyped data, you may take advantage of Json.NET as shown below.

	JObject jo = new JObject();
	jo.Add("Text", "Hello World");
	jo.Add("Complete", false);
	var inserted = await table.InsertAsync(jo);

Here is an example using an email address as a unique string id.

	JObject jo = new JObject();
	jo.Add("id", "myemail@emaildomain.com");
	jo.Add("Text", "Hello World");
	jo.Add("Complete", false);
	var inserted = await table.InsertAsync(jo);


###Working with ID values

Mobile Services supports unique custom string values for the table's **id** column. This allows applications to use custom values such as email addresses or user names for the ID.

String IDs provide you with the following benefits:

+ IDs are generated without making a round-trip to the database.
+ Records are easier to merge from different tables or databases.
+ IDs values can integrate better with an application's logic.

When a string ID value is not set on an inserted record, Mobile Services generates a unique value for the ID. You can use the `Guid.NewGuid()` method To generate your own ID values, either on the client or in a .NET mobile backend service. To learn more about generating GUIDs in a JavaScript backend mobile service, see [How to: Generate unique ID values](mobile-services-how-to-use-server-scripts.md#generate-guids).

You can also use integer IDs for your tables. To use an integer ID, you must create your table with the `mobile table create` command using the `--integerId` option. This command is used with the Command-line Interface (CLI) for Azure. For more information on using the CLI, see [CLI to manage Mobile Services tables](../virtual-machines-command-line-tools.md#Mobile_Tables).

##<a name="modifying"></a>How to: Modify data in a mobile service

The following code illustrates how to update an existing instance with the same ID with new information. The parameter contains the data to be updated as a .NET object.

	await todoTable.UpdateAsync(todoItem);


To insert untyped data, you may take advantage of Json.NET like so. Note that when making an update, an ID must be specified, as that is how the mobile service identifies which instance to update. The ID can be obtained from the result of the `InsertAsync` call.

	JObject jo = new JObject();
	jo.Add("Id", "37BBF396-11F0-4B39-85C8-B319C729AF6D");
	jo.Add("Text", "Hello World");
	jo.Add("Complete", false);
	var inserted = await table.UpdateAsync(jo);

If you attempt to update an item without providing the "Id" value, there is no way for the service to tell which instance to update, so the Mobile Services SDK will throw an `ArgumentException`.


##<a name="deleting"></a>How to: Delete data in a mobile service

The following code illustrates how to delete an existing instance. The instance is identified by the "Id" field set on the `todoItem`.

	await todoTable.DeleteAsync(todoItem);

To delete untyped data, you may take advantage of Json.NET like so. Note that when making a delete request, an ID must be specified, as that is how the mobile service identifies which instance to delete. A delete request needs only the ID; other properties are not passed to the service, and if any are passed, they are ignored at the service. The result of a `DeleteAsync` call is usually `null` as well. The ID to pass in can be obtained from the result of the `InsertAsync` call.

	JObject jo = new JObject();
	jo.Add("Id", "37BBF396-11F0-4B39-85C8-B319C729AF6D");
	await table.DeleteAsync(jo);

If you attempt to delete an item without the "Id" field already set, there is no way for the service to tell which instance to delete, so you will get back a `MobileServiceInvalidOperationException` from the service. Similarly, if you attempt to delete an untyped item without the "Id" field already set, you will again get back a `MobileServiceInvalidOperationException` from the service.

##<a name="#custom-api"></a>How to: Call a custom API

A custom API enables you to define custom endpoints that expose server functionality that does not map to an insert, update, delete, or read operation. By using a custom API, you can have more control over messaging, including reading and setting HTTP message headers and defining a message body format other than JSON. For an example of how to create a custom API in your mobile service, see [How to: define a custom API endpoint](mobile-services-dotnet-backend-define-custom-api.md).

You call a custom API by calling one of the [InvokeApiAsync] method overloads on the client. For example, the following line of code sends a POST request to the **completeAll** API on the mobile service:

    var result = await App.MobileService
        .InvokeApiAsync<MarkAllResult>("completeAll",
        System.Net.Http.HttpMethod.Post, null);

Note that this a typed method call, which requires that the **MarkAllResult** return type be defined. Both typed and untyped methods are supported. This is an almost trivial example as it is typed, sends no payload, has no query parameters, and doesn't change the request headers. For more realistic examples and a more a complete discussion of [InvokeApiAsync], see [Custom API in Azure Mobile Services Client SDKs].

##How to: Register for push notifications

The Mobile Services client enables you to register for push notifications with Azure Notification Hubs. When registering, you obtain a handle that you obtain from the platform-specific Push Notification Service (PNS). You then provide this value along with any tags when you create the registration. The following code registers your Windows app for push notifications with the Windows Notification Service (WNS):

	private async void InitNotificationsAsync()
	{
	    // Request a push notification channel.
	    var channel =
	        await PushNotificationChannelManager
	            .CreatePushNotificationChannelForApplicationAsync();

	    // Register for notifications using the new channel and a tag collection.
		var tags = new List<string>{ "mytag1", "mytag2"};
	    await MobileService.GetPush().RegisterNativeAsync(channel.Uri, tags);
	}

Note that in this example, two tags are included with the registration. For more information on Windows apps, see [Add push notifications to your app](mobile-services-dotnet-backend-windows-universal-dotnet-get-started-push.md).

Xamarin apps require some additional code to be able to register a Xamarin app running on iOS or Android app with the Apple Push Notification Service (APNS) and Google Cloud Messaging (GCM) services, respectively. For more information see **Add push notifications to your app** ([Xamarin.iOS](partner-xamarin-mobile-services-ios-get-started-push.md#add-push) | [Xamarin.Android](partner-xamarin-mobile-services-android-get-started-push.md#add-push)).

>[AZURE.NOTE]When you need to send notifications to specific registered users, it is important to require authentication before registration, and then verify that the user is authorized to register with a specific tag. For example, you must check to make sure a user doesn't register with a tag that is someone else's user ID. For more information, see [Send push notifications to authenticated users](mobile-services-dotnet-backend-windows-store-dotnet-push-notifications-app-users.md).

##<a name="pull-notifications"></a>How to: Use periodic notifications in a Windows app

Windows supports period notifications (pull notifications) to update live tiles. With periodic notifications enabled, Windows will periodically access a custom API endpoint to update the app tile on the start menu. To use periodic notifications, you must [define a custom API](mobile-services-javascript-backend-define-custom-api.md) that returns XML data in a tile-specific format. For more information, see [Periodic notifications](https://msdn.microsoft.com/library/windows/apps/hh761461.aspx).

The following example turns on period notifications to request tile template data from a *tiles* custom endpoint:

    TileUpdateManager.CreateTileUpdaterForApplication().StartPeriodicUpdate(
        new System.Uri(MobileService.ApplicationUri, "/api/tiles"),
        PeriodicUpdateRecurrence.Hour
    );

Select a [PeriodicUpdateRecurrance](https://msdn.microsoft.com/library/windows/apps/windows.ui.notifications.periodicupdaterecurrence.aspx) value that best matches the update frequency of your data.

##<a name="optimisticconcurrency"></a>How to: Use optimistic concurrency

Two or more clients may write changes to the same item, at the same time, in some scenarios. Without any conflict detection, the last write would overwrite any previous updates even if this was not the desired result. Optimistic Concurrency Control assumes that each transaction can commit and therefore does not use any resource locking. Before committing a transaction, optimistic concurrency control verifies that no other transaction has modified the data. If the data has been modified, the committing transaction is rolled back.

Mobile Services supports optimistic concurrency control by tracking changes to each item using the `__version` system property column that is defined for each table created by Mobile Services. Each time a record is updated, Mobile Services sets the `__version` property for that record to a new value. During each update request, the `__version` property of the record included with the request is compared to the same property for the record on the server. If the version passed with the request does not match the server, then the Mobile Services .NET client library throws a `MobileServicePreconditionFailedException<T>`. The type included with the exception is the record from the server containing the server's version of the record. The application can then use this information to decide whether to execute the update request again with the correct `__version` value from the server to commit changes.

To enable optimistic concurrency the application defines a column on the table class for the `__version` system property. The following definition provides an example.

    public class TodoItem
    {
        public string Id { get; set; }

        [JsonProperty(PropertyName = "text")]
        public string Text { get; set; }

        [JsonProperty(PropertyName = "complete")]
        public bool Complete { get; set; }

		// *** Enable Optimistic Concurrency *** //
        [JsonProperty(PropertyName = "__version")]
        public byte[] Version { set; get; }
    }


Applications using untyped tables enable optimistic concurrency by setting the `Version` flag on the `SystemProperties` of the table as follows.

	//Enable optimistic concurrency by retrieving __version
	todoTable.SystemProperties |= MobileServiceSystemProperties.Version;


The following code shows how to resolve a write conflict once detected. The correct `__version` value must be included in the `UpdateAsync()` call to commit a resolution.

	private async void UpdateToDoItem(TodoItem item)
	{
    	MobileServicePreconditionFailedException<TodoItem> exception = null;

	    try
    	{
	        //update at the remote table
    	    await todoTable.UpdateAsync(item);
    	}
    	catch (MobileServicePreconditionFailedException<TodoItem> writeException)
	    {
        	exception = writeException;
	    }

    	if (exception != null)
    	{
			// Conflict detected, the item has changed since the last query
        	// Resolve the conflict between the local and server item
	        await ResolveConflict(item, exception.Item);
    	}
	}


	private async Task ResolveConflict(TodoItem localItem, TodoItem serverItem)
	{
    	//Ask user to choose the resoltion between versions
	    MessageDialog msgDialog = new MessageDialog(String.Format("Server Text: \"{0}\" \nLocal Text: \"{1}\"\n",
        	                                        serverItem.Text, localItem.Text),
                                                	"CONFLICT DETECTED - Select a resolution:");

	    UICommand localBtn = new UICommand("Commit Local Text");
    	UICommand ServerBtn = new UICommand("Leave Server Text");
    	msgDialog.Commands.Add(localBtn);
	    msgDialog.Commands.Add(ServerBtn);

    	localBtn.Invoked = async (IUICommand command) =>
	    {
        	// To resolve the conflict, update the version of the
	        // item being committed. Otherwise, you will keep
        	// catching a MobileServicePreConditionFailedException.
	        localItem.Version = serverItem.Version;

    	    // Updating recursively here just in case another
        	// change happened while the user was making a decision
	        UpdateToDoItem(localItem);
    	};

	    ServerBtn.Invoked = async (IUICommand command) =>
    	{
	        RefreshTodoItems();
    	};

	    await msgDialog.ShowAsync();
	}


For a more complete example of using optimistic concurrency for Mobile Services, see the [Optimistic Concurrency Tutorial].


##<a name="binding"></a>How to: Bind mobile service data to a Windows user interface

This section shows how to display returned data objects using UI elements in a Windows app. To query incomplete items in `todoTable` and display it in a very simple list, you can run the following example code to bind the source of the list with a query. Using `MobileServiceCollection` creates a mobile services-aware binding collection.

	// This query filters out completed TodoItems.
	MobileServiceCollection<TodoItem, TodoItem> items = await todoTable
		.Where(todoItem => todoItem.Complete == false)
		.ToCollectionAsync();

	// itemsControl is an IEnumerable that could be bound to a UI list control
	IEnumerable itemsControl  = items;

	// Bind this to a ListBox
	ListBox lb = new ListBox();
	lb.ItemsSource = items;

Some controls in the managed runtime support an interface called [ISupportIncrementalLoading](http://msdn.microsoft.com/library/windows/apps/Hh701916). This interface allows controls to request extra data when the user scrolls. There is built-in support for this interface for universal Windows 8.1 apps via `MobileServiceIncrementalLoadingCollection`, which automatically handles the calls from the controls. To use `MobileServiceIncrementalLoadingCollection` in Windows apps, do the following:

			MobileServiceIncrementalLoadingCollection<TodoItem,TodoItem> items;
		items =  todoTable.Where(todoItem => todoItem.Complete == false)
					.ToIncrementalLoadingCollection();

		ListBox lb = new ListBox();
		lb.ItemsSource = items;


To use the new collection on Windows Phone 8 and "Silverlight" apps, use the `ToCollection` extension methods on `IMobileServiceTableQuery<T>` and `IMobileServiceTable<T>`. To actually load data, call `LoadMoreItemsAsync()`.

	MobileServiceCollection<TodoItem, TodoItem> items = todoTable.Where(todoItem => todoItem.Complete==false).ToCollection();
	await items.LoadMoreItemsAsync();

When you use the collection created by calling `ToCollectionAsync` or `ToCollection`, you get a collection which can be bound to UI controls. This collection is paging-aware, i.e., a control can ask the collection to "load more items", and the collection will do it for the control. At that point there is no user code involved, the control will start the flow. However, since the collection is loading data from the network, it's expected that some times this loading will fail. To handle such failures, you may override the `OnException` method on `MobileServiceIncrementalLoadingCollection` to handle exceptions resulting from calls to `LoadMoreItemsAsync` performed by controls.

Finally, imagine that your table has many fields, but you only want to display some of them in your control. You may use the guidance in the section "[Select specific columns](#selecting)" above to select specific columns to display in the UI.

##<a name="authentication"></a>How to: Authenticate users

Mobile Services supports authenticating and authorizing app users using a variety of external identity providers: Facebook, Google, Microsoft Account, Twitter, and Azure Active Directory. You can set permissions on tables to restrict access for specific operations to only authenticated users. You can also use the identity of authenticated users to implement authorization rules in server scripts. For more information, see the tutorial [Add authentication to your app].

Two authentication flows are supported: a _server flow_ and a _client flow_. The server flow provides the simplest authentication experience, as it relies on the provider's web authentication interface. The client flow allows for deeper integration with device-specific capabilities as it relies on provider-specific device-specific SDKs.

###Server flow
To have Mobile Services manage the authentication process in your Windows apps,
you must register your app with your identity provider. Then in your mobile service, you need to configure the application ID and secret provided by your provider. For more information, see the tutorial [Add authentication to your app].

Once you have registered your identity provider, simply call the [LoginAsync method] with the [MobileServiceAuthenticationProvider] value of your provider. For example, the following code initiates a server flow sign-in by using Facebook.

	private MobileServiceUser user;
	private async System.Threading.Tasks.Task Authenticate()
	{
		while (user == null)
		{
			string message;
			try
			{
				user = await client
					.LoginAsync(MobileServiceAuthenticationProvider.Facebook);
				message =
					string.Format("You are now logged in - {0}", user.UserId);
			}
			catch (InvalidOperationException)
			{
				message = "You must log in. Login Required";
			}

			var dialog = new MessageDialog(message);
			dialog.Commands.Add(new UICommand("OK"));
			await dialog.ShowAsync();
		}
	}

If you are using an identity provider other than Facebook, change the value of [MobileServiceAuthenticationProvider] above to the value for your provider.

In this case, Mobile Services manages the OAuth 2.0 authentication flow by displaying the sign-in page of the selected provider and generating a Mobile Services authentication token after successful sign-on with the identity provider. The [LoginAsync method] returns a [MobileServiceUser], which provides both the [userId] of the authenticated user and the [MobileServiceAuthenticationToken], as a JSON web token (JWT). This token can be cached and re-used until it expires. For more information, see [Caching the authentication token].

###Client flow

Your app can also independently contact the identity provider and then provide the returned token to Mobile Services for authentication. This client flow enables you to provide a single sign-in experience for users or to retrieve additional user data from the identity provider.

####Single sign-in using a token from Facebook or Google

In the most simplified form, you can use the client flow as shown in this snippet for Facebook or Google.

	var token = new JObject();
	// Replace access_token_value with actual value of your access token obtained
	// using the Facebook or Google SDK.
	token.Add("access_token", "access_token_value");

	private MobileServiceUser user;
	private async System.Threading.Tasks.Task Authenticate()
	{
		while (user == null)
		{
			string message;
			try
			{
				// Change MobileServiceAuthenticationProvider.Facebook
				// to MobileServiceAuthenticationProvider.Google if using Google auth.
				user = await client
					.LoginAsync(MobileServiceAuthenticationProvider.Facebook, token);
				message =
					string.Format("You are now logged in - {0}", user.UserId);
			}
			catch (InvalidOperationException)
			{
				message = "You must log in. Login Required";
			}

			var dialog = new MessageDialog(message);
			dialog.Commands.Add(new UICommand("OK"));
			await dialog.ShowAsync();
		}
	}


####Single sign-in using Microsoft Account with the Live SDK

To be able to authenticate users, you must register your app at the Microsoft account Developer Center. You must then connect this registration with your mobile service. Complete the steps in [Register your app to use a Microsoft account login](mobile-services-how-to-register-microsoft-authentication.md) to create a Microsoft account registration and connect it to your mobile service. If you have both Windows Store and Windows Phone 8/Silverlight versions of your app, register the Windows Store version first.

The following code authenticates using Live SDK and uses the returned token to sign-in to your mobile service.

	private LiveConnectSession session;
 	//private static string clientId = "<microsoft-account-client-id>";
    private async System.Threading.Tasks.Task AuthenticateAsync()
    {

        // Get the URL the mobile service.
        var serviceUrl = App.MobileService.ApplicationUri.AbsoluteUri;

        // Create the authentication client for Windows Store using the mobile service URL.
        LiveAuthClient liveIdClient = new LiveAuthClient(serviceUrl);
        //// Create the authentication client for Windows Phone using the client ID of the registration.
        //LiveAuthClient liveIdClient = new LiveAuthClient(clientId);

        while (session == null)
        {
            // Request the authentication token from the Live authentication service.
			// The wl.basic scope is requested.
            LiveLoginResult result = await liveIdClient.LoginAsync(new string[] { "wl.basic" });
            if (result.Status == LiveConnectSessionStatus.Connected)
            {
                session = result.Session;

                // Get information about the logged-in user.
                LiveConnectClient client = new LiveConnectClient(session);
                LiveOperationResult meResult = await client.GetAsync("me");

                // Use the Microsoft account auth token to sign in to Mobile Services.
                MobileServiceUser loginResult = await App.MobileService
                    .LoginWithMicrosoftAccountAsync(result.Session.AuthenticationToken);

                // Display a personalized sign-in greeting.
                string title = string.Format("Welcome {0}!", meResult.Result["first_name"]);
                var message = string.Format("You are now logged in - {0}", loginResult.UserId);
                var dialog = new MessageDialog(message, title);
                dialog.Commands.Add(new UICommand("OK"));
                await dialog.ShowAsync();
            }
            else
            {
                session = null;
                var dialog = new MessageDialog("You must log in.", "Login Required");
                dialog.Commands.Add(new UICommand("OK"));
                await dialog.ShowAsync();
            }
        }
    }


###<a name="caching"></a>Caching the authentication token
In some cases, the call to the login method can be avoided after the first time the user authenticates. You can use [PasswordVault] for Windows Store apps to cache the current user identity the first time they log in and every subsequent time you check whether you already have the user identity in our cache. When the cache is empty, you still need to send the user through the login process.

	// After logging in
	PasswordVault vault = new PasswordVault();
	vault.Add(new PasswordCredential("Facebook", user.UserId, user.MobileServiceAuthenticationToken));

	// Log in
	var creds = vault.FindAllByResource("Facebook").FirstOrDefault();
	if (creds != null)
	{
		user = new MobileServiceUser(creds.UserName);
		user.MobileServiceAuthenticationToken = vault.Retrieve("Facebook", creds.UserName).Password;
	}
	else
	{
		// Regular login flow
		user = new MobileServiceuser( await client
			.LoginAsync(MobileServiceAuthenticationProvider.Facebook, token);
		var token = new JObject();
		// Replace access_token_value with actual value of your access token
		token.Add("access_token", "access_token_value");
	}

	 // Log out
	client.Logout();
	vault.Remove(vault.Retrieve("Facebook", user.UserId));


For Windows Phone apps, you may encrypt and cache data using the [ProtectedData] class and store sensitive information in isolated storage.

##<a name="errors"></a>How to: Handle errors

There are several ways to encounter, validate, and work around errors in Mobile Services.

As an example, server scripts are registered in a mobile service and can be used to perform a wide range of operations on data being inserted and updated, including validation and data modification. Imagine defining and registering a server script that validate and modify data, like so:

	function insert(item, user, request)
	{
	   if (item.text.length > 10) {
		  request.respond(statusCodes.BAD_REQUEST, { error: "Text cannot exceed 10 characters" });
	   } else {
		  request.execute();
	   }
	}

This server-side script validates the length of string data sent to the mobile service and rejects strings that are too long, in this case longer than 10 characters.

Now that the mobile service is validating data and sending error responses on the server-side, you can update your .NET app to be able to handle error responses from validation.

	private async void InsertTodoItem(TodoItem todoItem)
	{
		// This code inserts a new TodoItem into the database. When the operation completes
		// and Mobile Services has assigned an Id, the item is added to the CollectionView
		try
		{
			await todoTable.InsertAsync(todoItem);
			items.Add(todoItem);
		}
		catch (MobileServiceInvalidOperationException e)
		{
			// Handle error
		}
	}

##<a name="untyped"></a>How to: Work with untyped data

The .NET client is designed for strongly typed scenarios. However, sometimes, a more loosely typed experience is convenient; for example, this could be when dealing with objects with open schema. That scenario is enabled as follows. In queries, you forego LINQ and use the wire format.

	// Get an untyped table reference
	IMobileServiceTable untypedTodoTable = client.GetTable("TodoItem");

	// Lookup untyped data using OData
	JToken untypedItems = await untypedTodoTable.ReadAsync("$filter=complete eq 0&$orderby=text");

You get back JSON values that you can use like a property bag. For more information on JToken and Json.NET, see [Json.NET](http://json.codeplex.com/)

##<a name="unit-testing"></a>How to: Design unit tests

The value returned by `MobileServiceClient.GetTable` and the queries are interfaces. That makes them easily "mockable" for testing purposes, so you could create a `MyMockTable : IMobileServiceTable<TodoItem>` that implements your testing logic.

##<a name="customizing"></a>How to: Customize the client

This section shows ways in which you can customize the request headers and customize the serialization of JSON objects in the response.

### <a name="headers"></a>How to: Customize request headers

To support your specific app scenario, you might need to customize communication with the mobile service. For example, you may want to add a custom header to every outgoing request or even change responses status codes. You can do this by providing a custom DelegatingHandler, as in the following example:

	public async Task CallClientWithHandler()
	{
		MobileServiceClient client = new MobileServiceClient(
			"AppUrl",
			"AppKey" ,
			new MyHandler()
			);
		IMobileServiceTable<TodoItem> todoTable = client.GetTable<TodoItem>();
		var newItem = new TodoItem { Text = "Hello world", Complete = false };
		await table.InsertAsync(newItem);
	}

    public class MyHandler : DelegatingHandler
    {
        protected override async Task<HttpResponseMessage>
            SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            // Add a custom header to the request.
            request.Headers.Add("x-my-header", "my value");
            var response = await base.SendAsync(request, cancellationToken);
            // Set a differnt response status code.
            response.StatusCode = HttpStatusCode.ServiceUnavailable;
            return response;
        }
    }

This code adds a new **x-my-header** header in the request and arbitrarily sets the response code to unavailable. In a real-world scenario, you would set the response status code based on some custom logic required by your app.

### <a name="serialization"></a>How to: Customize serialization

The Mobile Services client library uses Json.NET to convert a JSON response into .NET objects on the client. You can configure the behavior of this serialization between .NET types and JSON in the messages. The [MobileServiceClient](http://msdn.microsoft.com/library/microsoft.windowsazure.mobileservices.mobileserviceclient.aspx) class exposes a `SerializerSettings` property of type [JsonSerializerSettings](http://james.newtonking.com/projects/json/help/?topic=html/T_Newtonsoft_Json_JsonSerializerSettings.htm)

Using this property, you may set one of the many Json.NET properties, such as the following:

	var settings = new JsonSerializerSettings();
	settings.ContractResolver = new CamelCasePropertyNamesContractResolver();
	client.SerializerSettings = settings;

This property converts all properties to lower case during serialization.

<!-- Anchors. -->
[What is Mobile Services]: #what-is
[Concepts]: #concepts
[How to: Create the Mobile Services client]: #create-client
[How to: Create a table reference]: #instantiating
[How to: Query data from a mobile service]: #querying
[Filter returned data]: #filtering
[Sort returned data]: #sorting
[Return data in pages]: #paging
[Select specific columns]: #selecting
[Look up data by ID]: #lookingup
[How to: Bind data to user interface in a mobile service]: #binding
[How to: Insert data into a mobile service]: #inserting
[How to: Modify data in a mobile service]: #modifying
[How to: Delete data in a mobile service]: #deleting
[How to: Use Optimistic Concurrency]: #optimisticconcurrency
[How to: Authenticate users]: #authentication
[How to: Handle errors]: #errors
[How to: Design unit tests]: #unit-testing
[How to: Query data from a mobile service]: #querying
[How to: Customize the client]: #customizing
[How to: Work with untyped data]: #untyped
[Customize request headers]: #headers
[Customize serialization]: #serialization
[Next steps]: #nextsteps
[Caching the authentication token]: #caching
[How to: Call a custom API]: #custom-api

<!-- Images. -->



<!-- URLs. -->
[Add authentication to your app]: mobile-services-dotnet-backend-windows-universal-dotnet-get-started-users.md
[PasswordVault]: http://msdn.microsoft.com/library/windows/apps/windows.security.credentials.passwordvault.aspx
[ProtectedData]: http://msdn.microsoft.com/library/system.security.cryptography.protecteddata%28VS.95%29.aspx
[LoginAsync method]: http://msdn.microsoft.com/library/windowsazure/microsoft.windowsazure.mobileservices.mobileserviceclientextensions.loginasync.aspx
[MobileServiceAuthenticationProvider]: http://msdn.microsoft.com/library/windowsazure/microsoft.windowsazure.mobileservices.mobileserviceauthenticationprovider.aspx
[MobileServiceUser]: http://msdn.microsoft.com/library/windowsazure/microsoft.windowsazure.mobileservices.mobileserviceuser.aspx
[UserID]: http://msdn.microsoft.com/library/windowsazure/microsoft.windowsazure.mobileservices.mobileserviceuser.userid.aspx
[MobileServiceAuthenticationToken]: http://msdn.microsoft.com/library/windowsazure/microsoft.windowsazure.mobileservices.mobileserviceuser.mobileserviceauthenticationtoken.aspx
[ASCII control codes C0 and C1]: http://en.wikipedia.org/wiki/Data_link_escape_character#C1_set
[CLI to manage Mobile Services tables]: ../virtual-machines-command-line-tools.md/#Commands_to_manage_mobile_services
[Optimistic Concurrency Tutorial]: mobile-services-windows-store-dotnet-handle-database-conflicts.md
[MobileServiceClient]: https://msdn.microsoft.com/library/azure/microsoft.windowsazure.mobileservices.mobileserviceclient.aspx

[IncludeTotalCount]: http://msdn.microsoft.com/library/windowsazure/dn250560.aspx
[Skip]: http://msdn.microsoft.com/library/windowsazure/dn250573.aspx
[Take]: http://msdn.microsoft.com/library/windowsazure/dn250574.aspx
[Fiddler]: http://www.telerik.com/fiddler
[Custom API in Azure Mobile Services Client SDKs]: http://blogs.msdn.com/b/carlosfigueira/archive/2013/06/19/custom-api-in-azure-mobile-services-client-sdks.aspx
[InvokeApiAsync]: http://msdn.microsoft.com/library/azure/microsoft.windowsazure.mobileservices.mobileserviceclient.invokeapiasync.aspx
