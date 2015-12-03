<properties
	pageTitle="Working with the App Service Mobile Apps managed client library (Windows | Xamarin) | Microsoft Azure"
	description="Learn how to use a .NET client for Azure App Service Mobile Apps with Windows and Xamarin apps."
	services="app-service\mobile"
	documentationCenter=""
	authors="ggailey777"
	manager="dwrede"
	editor=""/>

<tags
	ms.service="app-service"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-multiple"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="11/05/2015" 
	ms.author="glenga"/>

# How to use the managed client for Azure Mobile Apps

[AZURE.INCLUDE [app-service-mobile-selector-client-library](../../includes/app-service-mobile-selector-client-library.md)]
&nbsp;

[AZURE.INCLUDE [app-service-mobile-note-mobile-services](../../includes/app-service-mobile-note-mobile-services.md)]

##Overview 

This guide shows you how to perform common scenarios using the managed client library for Azure App Service Mobile Apps for Windows and Xamarin apps. If you are new to Mobile Apps, you should consider first completing the [Mobile Apps quickstart](app-service-mobile-windows-store-dotnet-get-started.md) tutorial. In this guide, we focus on the client-side managed SDK. To learn more about the server-side SDK for the .NET backend, see [Work with .NET backend](app-service-mobile-dotnet-backend-how-to-use-server-sdk.md)

## Reference documentation

The reference documentation for the client SDK is located here: [Azure Mobile Apps .NET Client Reference](https://msdn.microsoft.com/library/azure/microsoft.windowsazure.mobileservices.aspx).

##<a name="setup"></a>Setup and Prerequisites

We assume that you have already created and published your Mobile App backend project, which includes at one table.  In the code used in this topic, the table is named `TodoItem` and it will have the following columns: `Id`, `Text`, and `Complete`. This is the same table created when you complete the [quickstart tutorial](app-service-mobile-windows-store-dotnet-get-started.md)

The corresponding typed client-side type in C# is the following:


	public class TodoItem
	{
		public string Id { get; set; }

		[JsonProperty(PropertyName = "text")]
		public string Text { get; set; }

		[JsonProperty(PropertyName = "complete")]
		public bool Complete { get; set; }
	}

Note that the [JsonPropertyAttribute](http://www.newtonsoft.com/json/help/html/Properties_T_Newtonsoft_Json_JsonPropertyAttribute.htm) is used to define the *PropertyName* mapping between the client type and the table.

##<a name="create-client"></a>How to: Create the Mobile App client

The following code creates the `MobileServiceClient` object that is used to access your Mobile App backend.

	MobileServiceClient client = new MobileServiceClient("MOBILE_APP_URL");

In the code above, replace `MOBILE_APP_URL` with the URL of the Mobile App backend, which is found in the blade for your Mobile App backend in the [Azure portal](https://portal.azure.com).

##<a name="instantiating"></a>How to: Create a table reference

All of the code that accesses or modifies data in a backend table calls functions on the `MobileServiceTable` object. You get a reference to the table by calling the [GetTable](https://msdn.microsoft.com/library/azure/jj554275.aspx) method on an instance of the `MobileServiceClient`, as follows:

    IMobileServiceTable<TodoItem> todoTable =
		client.GetTable<TodoItem>();

This is the typed serialization model. An untyped serialization model is also supported. The following creates a reference to an untyped table: 

	// Get an untyped table reference
	IMobileServiceTable untypedTodoTable = client.GetTable("TodoItem");

In untyped queries, you must specify the underlying OData query string.

##<a name="querying"></a>How to: Query data from your Mobile App

This section describes how to issue queries to the Mobile App backend, which includes the following functionality:

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

You can view the URI of the request sent to the backend by using message inspection software, such as browser developer tools or [Fiddler]. If you look at the request URI below,  notice that we are modifying the query string itself:

	GET /tables/todoitem?$filter=(complete+eq+false) HTTP/1.1

This request would normally be translated roughly into the following SQL query on the Azure side:

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

The two methods are equivalent and may be used interchangeably.  The former option&mdash;of concatenating multiple predicates in one query&mdash;is more compact and recommended.

The `where` clause supports operations that be translated into the OData subset. This includes relational operators (==, !=, <, <=, >, >=), arithmetic operators (+, -, /, *, %), number precision (Math.Floor, Math.Ceiling), string functions (Length, Substring, Replace, IndexOf, StartsWith, EndsWith), date properties (Year, Month, Day, Hour, Minute, Second), access properties of an object, and expressions combining all of these.

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

By default, the backend returns only the first 50 rows. You can increase the number of returned rows by calling the [Take] method. Use `Take` along with the [Skip] method to request a specific "page" of the total dataset returned by the query. The following query, when executed, returns the top three items in the table.

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

>[AZURE.NOTE]To override the 50 row limit in a Mobile App backend, you must also apply the [EnableQueryAttribute](https://msdn.microsoft.com/library/system.web.http.odata.enablequeryattribute.aspx) to the public GET method and specify the paging behavior. When applied to the method, the following sets the maximum returned rows to 1000:

    [EnableQuery(MaxTop=1000)]


### <a name="selecting"></a>How to: Select specific columns

You can specify which set of properties to include in the results by adding a `Select` clause to your query. For example, the following code shows how to select just one field and also how to select and format multiple fields:

	// Select one field -- just the Text
	MobileServiceTableQuery<TodoItem> query = todoTable
					.Select(todoItem => todoItem.Text);
	List<string> items = await query.ToListAsync();

	// Select multiple fields -- both Complete and Text info
	MobileServiceTableQuery<TodoItem> query = todoTable
					.Select(todoItem => string.Format("{0} -- {1}", 
						todoItem.Text.PadRight(30), todoItem.Complete ? 
						"Now complete!" : "Incomplete!"));
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

### <a name="lookingup"></a>How to: Execute untyped queries

When executing a query using an untyped table object, you must explicitly specify the OData query string, as in the following example:

	// Lookup untyped data using OData
	JToken untypedItems = await untypedTodoTable.ReadAsync("$filter=complete eq 0&$orderby=text");

You get back JSON values that you can use like a property bag. For more information on JToken and Json.NET, see [Json.NET](http://json.codeplex.com/)

##<a name="inserting"></a>How to: Insert data into a Mobile App backend

All client types must contain a member named **Id**, which is by default a string. This **Id** is required to perform CRUD operations and for offline. The following code illustrates how to insert new rows into a table. The parameter contains the data to be inserted as a .NET object.

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

Mobile Apps supports unique custom string values for the table's **id** column. This allows applications to use custom values such as email addresses or user names for the ID.

String IDs provide you with the following benefits:

+ IDs are generated without making a round-trip to the database.
+ Records are easier to merge from different tables or databases.
+ IDs values can integrate better with an application's logic.

When a string ID value is not set on an inserted record, the Mobile App backend generates a unique value for the ID. You can use the `Guid.NewGuid()` method To generate your own ID values, either on the client or in the backend. 

##<a name="modifying"></a>How to: Modify data in a Mobile App backend

The following code illustrates how to update an existing instance with the same ID with new information. The parameter contains the data to be updated as a .NET object.

	await todoTable.UpdateAsync(todoItem);

To insert untyped data, you may take advantage of Json.NET as follows: 
	JObject jo = new JObject();
	jo.Add("Id", "37BBF396-11F0-4B39-85C8-B319C729AF6D");
	jo.Add("Text", "Hello World");
	jo.Add("Complete", false);
	var inserted = await table.UpdateAsync(jo);

Note that when making an update, an ID must be specified. This is how the backend identifies which instance to update. The ID can be obtained from the result of the `InsertAsync` call. When you try to update an item without providing the "Id" value, an `ArgumentException` is raised.


##<a name="deleting"></a>How to: Delete data in a Mobile App backend

The following code illustrates how to delete an existing instance. The instance is identified by the "Id" field set on the `todoItem`.

	await todoTable.DeleteAsync(todoItem);

To delete untyped data, you may take advantage of Json.NET as follows:

	JObject jo = new JObject();
	jo.Add("Id", "37BBF396-11F0-4B39-85C8-B319C729AF6D");
	await table.DeleteAsync(jo);

Note that when you make a delete request, an ID must be specified. Other properties are not passed to the service or are ignored at the service. The result of a `DeleteAsync` call is usually `null`. The ID to pass in can be obtained from the result of the `InsertAsync` call. When you try to delete an item without the "Id" field already set, a `MobileServiceInvalidOperationException` is returned from the backend. 

##<a name="#custom-api"></a>How to: Call a custom API

A custom API enables you to define custom endpoints that expose server functionality that does not map to an insert, update, delete, or read operation. By using a custom API, you can have more control over messaging, including reading and setting HTTP message headers and defining a message body format other than JSON. 

You call a custom API by calling one of the [InvokeApiAsync] method overloads on the client. For example, the following line of code sends a POST request to the **completeAll** API on the backend:

    var result = await App.MobileService
        .InvokeApiAsync<MarkAllResult>("completeAll",
        System.Net.Http.HttpMethod.Post, null);

Note that this a typed method call, which requires that the **MarkAllResult** return type be defined. Both typed and untyped methods are supported. This is an almost trivial example as it is typed, sends no payload, has no query parameters, and doesn't change the request headers. For more realistic examples and a more a complete discussion of [InvokeApiAsync], see [Custom API in Azure Mobile Services Client SDKs].

##How to: Register for push notifications

The Mobile Apps client enables you to register for push notifications with Azure Notification Hubs. When registering, you obtain a handle that you obtain from the platform-specific Push Notification Service (PNS). You then provide this value along with any tags when you create the registration. The following code registers your Windows app for push notifications with the Windows Notification Service (WNS):

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

Note that in this example, two tags are included with the registration. For more information on Windows apps, including how to register for template registrations, see [Add push notifications to your app](app-service-mobile-windows-store-dotnet-get-started-push.md). 

Xamarin apps require some additional code to be able to register an app running on iOS or Android app with the Apple Push Notification Service (APNS) and Google Cloud Messaging (GCM) services, respectively. For more information see **Add push notifications to your app** ([Xamarin.iOS](partner-xamarin-mobile-services-ios-get-started-push.md#add-push) | [Xamarin.Android](partner-xamarin-mobile-services-android-get-started-push.md#add-push)).

## How to: Register push templates to send cross-platform notifications

To register templates, simply pass along templates with your **MobileService.GetPush().RegisterAsync()** method in your client app.

        MobileService.GetPush().RegisterAsync(channel.Uri, newTemplates());

Your templates will be of type JObject and can contain multiple templates in the following JSON format:

        public JObject newTemplates()
        {
            // single template for Windows Notification Service toast
            var template = "<toast><visual><binding template=\"ToastText01\"><text id=\"1\">$(message)</text></binding></visual></toast>";
            
            var templates = new JObject
            {
                ["generic-message"] = new JObject
                {
                    ["body"] = template,
                    ["headers"] = new JObject
                    {
                        ["X-WNS-Type"] = "wns/toast"
                    },
                    ["tags"] = new JArray()
                },
                ["more-templates"] = new JObject {...}
            };
            return templates;
        }

The method **RegisterAsync()** also accepts Secondary Tiles:

        MobileService.GetPush().RegisterAsync(string channelUri, JObject templates, JObject secondaryTiles);

Note that all tags will be stripped away for security. To add tags to installations or templates within installations, see [Work with the .NET backend server SDK for Azure Mobile Apps].

To send notifications utilizing these registered templates, work with [Notification Hubs APIs](https://msdn.microsoft.com/library/azure/dn495101.aspx).

##<a name="optimisticconcurrency"></a>How to: Use Optimistic Concurrency

Two or more clients may write changes to the same item, at the same time, in some scenarios. Without any conflict detection, the last write would overwrite any previous updates even if this was not the desired result. *Optimistic concurrency control* assumes that each transaction can commit and therefore does not use any resource locking. Before committing a transaction, optimistic concurrency control verifies that no other transaction has modified the data. If the data has been modified, the committing transaction is rolled back.

Mobile Apps supports optimistic concurrency control by tracking changes to each item using the `__version` system property column that is defined for each table in your Mobile App backend. Each time a record is updated, Mobile Apps sets the `__version` property for that record to a new value. During each update request, the `__version` property of the record included with the request is compared to the same property for the record on the server. If the version passed with the request does not match the backend, then the client library raises a `MobileServicePreconditionFailedException<T>`. The type included with the exception is the record from the backend containing the server's version of the record. The application can then use this information to decide whether to execute the update request again with the correct `__version` value from the backend to commit changes.  

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

For more information, see the [Offline Data Sync in Azure Mobile Apps](app-service-mobile-offline-data-sync.md).


##<a name="binding"></a>How to: Bind Mobile Apps data to a Windows user interface

This section shows how to display returned data objects using UI elements in a Windows app. To query incomplete items in `todoTable` and display it in a very simple list, you can run the following example code to bind the source of the list with a query. Using `MobileServiceCollection` creates a Mobile Apps-aware binding collection.

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

## <a name="package-sid"></a>How to: Obtain a Windows Store package SID

For Windows apps, a package SID is needed for enabling push notifications and certain authentication modes. To obtain this value:

1. In Visual Studio Solution Explorer, right-click the Windows Store app project, click **Store** > **Associate App with the Store...**.
2. In the wizard, click **Next**, sign in with your Microsoft account, type a name for your app in **Reserve a new app name**, then click **Reserve**.
3. After the app registration is successfully created, select the new app name, click **Next**, and then click **Associate**. This adds the required Windows Store registration information to the application manifest.
4. Log into the [Windows Dev Center](https://dev.windows.com/en-us/overview) using your Microsoft Account. Under **My apps**, click the app registration you just created.
5. Click **App management** > **App identity**, and then scroll down to find your **Package SID**.

Many uses of the package SID treat it as a URI, in which case you will need to use _ms-app://_ as the scheme. Make note of the version of your package SID formed by concatenating this value as a prefix.

<!--- We want to just point to the authentication topic when it's done
##<a name="authentication"></a>How to: Authenticate users

Mobile Apps supports authenticating and authorizing app users using a variety of external identity providers: Facebook, Google, Microsoft Account, Twitter, and Azure Active Directory. You can set permissions on tables to restrict access for specific operations to only authenticated users. You can also use the identity of authenticated users to implement authorization rules in server scripts. For more information, see the tutorial [Add authentication to your app].

Two authentication flows are supported: a _server flow_ and a _client flow_. The server flow provides the simplest authentication experience, as it relies on the provider's web authentication interface. The client flow allows for deeper integration with device-specific capabilities as it relies on provider-specific device-specific SDKs.

###Server flow
To have App Service manage the authentication process in your Windows apps,
you must register your app with your identity provider. Then in your mobile App backed, you need to configure the application ID and secret provided by your provider. For more information, see the tutorial [Add authentication to your app].

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

In this case, App Service manages the OAuth 2.0 authentication flow by displaying the sign-in page of the selected provider and generating an App Service authentication token after successful sign-on with the identity provider. The [LoginAsync method] returns a [MobileServiceUser], which provides both the [userId] of the authenticated user and the [MobileServiceAuthenticationToken], as a JSON web token (JWT). This token can be cached and re-used until it expires. For more information, see [Caching the authentication token].

###Client flow

Your app can also independently contact the identity provider and then provide the returned token to App Service for authentication. This client flow enables you to provide a single sign-in experience for users or to retrieve additional user data from the identity provider.

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

To be able to authenticate users, you must register your app at the Microsoft account Developer Center. You must then connect this registration with your Mobile App backend. Complete the steps in [Register your app to use a Microsoft account login](mobile-services-how-to-register-microsoft-authentication.md) to create a Microsoft account registration and connect it to your Mobile App backend. If you have both Windows Store and Windows Phone 8/Silverlight versions of your app, register the Windows Store version first.

The following code authenticates using Live SDK and uses the returned token to sign-in to your Mobile App backend. 

	private LiveConnectSession session;
 	//private static string clientId = "<microsoft-account-client-id>";
    private async System.Threading.Tasks.Task AuthenticateAsync()
    {

        // Get the URL the Mobile App backend.
        var serviceUrl = App.MobileService.ApplicationUri.AbsoluteUri;

        // Create the authentication client for Windows Store using the service URL.
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

                // Use the Microsoft account auth token to sign in to App Service.
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

-->

##<a name="errors"></a>How to: Handle errors

The following example shows you how to handle an exception that is returned by the backend:

	private async void InsertTodoItem(TodoItem todoItem)
	{
		// This code inserts a new TodoItem into the database. When the operation completes
		// and App Service has assigned an Id, the item is added to the CollectionView
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


##<a name="unit-testing"></a>How to: Design unit tests

The value returned by `MobileServiceClient.GetTable` and the queries are interfaces. That makes them easily "mockable" for testing purposes, so you could create a `MyMockTable : IMobileServiceTable<TodoItem>` that implements your testing logic.

##<a name="customizing"></a>How to: Customize the client

This section shows ways in which you can customize the request headers and customize the serialization of JSON objects in the response.

### <a name="headers"></a>How to: Customize request headers

To support your specific app scenario, you might need to customize communication with the Mobile App backend. For example, you may want to add a custom header to every outgoing request or even change responses status codes. You can do this by providing a custom [DelegatingHandler], as in the following example:

    public async Task CallClientWithHandler()
    {
        MobileServiceClient client = new MobileServiceClient(
            "AppUrl", "", "",
            new MyHandler()
            );
        IMobileServiceTable<TodoItem> todoTable = client.GetTable<TodoItem>();
        var newItem = new TodoItem { Text = "Hello world", Complete = false };
        await todoTable.InsertAsync(newItem);
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

The Mobile Apps client library uses Json.NET to convert a JSON response into .NET objects on the client. You can configure the behavior of this serialization between .NET types and JSON in the messages. The [MobileServiceClient] class exposes a `SerializerSettings` property of type [JsonSerializerSettings](http://james.newtonking.com/projects/json/help/?topic=html/T_Newtonsoft_Json_JsonSerializerSettings.htm)

Using this property, you may set one of the many Json.NET properties, such as the following:

	var settings = new JsonSerializerSettings();
	settings.ContractResolver = new CamelCasePropertyNamesContractResolver();
	client.SerializerSettings = settings;

This property converts all properties to lower case during serialization.

<!-- Anchors. -->
[Filter returned data]: #filtering
[Sort returned data]: #sorting
[Return data in pages]: #paging
[Select specific columns]: #selecting
[Look up data by ID]: #lookingup

<!-- Images. -->



<!-- URLs. -->
[Add authentication to your app]: mobile-services-dotnet-backend-windows-universal-dotnet-get-started-users.md
[Work with the .NET backend server SDK for Azure Mobile Apps]: app-service-mobile-dotnet-backend-how-to-use-server-sdk.md
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
[MobileServiceClient]: http://msdn.microsoft.com/library/microsoft.windowsazure.mobileservices.mobileserviceclient.aspx
[IncludeTotalCount]: http://msdn.microsoft.com/library/windowsazure/dn250560.aspx
[Skip]: http://msdn.microsoft.com/library/windowsazure/dn250573.aspx
[Take]: http://msdn.microsoft.com/library/windowsazure/dn250574.aspx
[Fiddler]: http://www.telerik.com/fiddler
[Custom API in Azure Mobile Services Client SDKs]: http://blogs.msdn.com/b/carlosfigueira/archive/2013/06/19/custom-api-in-azure-mobile-services-client-sdks.aspx
[InvokeApiAsync]: http://msdn.microsoft.com/library/azure/microsoft.windowsazure.mobileservices.mobileserviceclient.invokeapiasync.aspx
[DelegatingHandler]: https://msdn.microsoft.com/library/system.net.http.delegatinghandler(v=vs.110).aspx