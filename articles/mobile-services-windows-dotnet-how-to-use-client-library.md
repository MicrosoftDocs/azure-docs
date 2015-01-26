<properties pageTitle="Working with the Mobile Services .NET Client Library" description="Learn how to use an .NET client for Azure Mobile Services." services="" documentationCenter="windows" authors="ggailey777" manager="dwrede" editor=""/>

<tags ms.service="mobile-services" ms.workload="mobile" ms.tgt_pltfrm="mobile-windows-store" ms.devlang="dotnet" ms.topic="article" ms.date="10/10/2014" ms.author="glenga"/>





# How to use a .NET client for Azure Mobile Services

<div class="dev-center-tutorial-selector sublanding">
  <a href="/en-us/develop/mobile/how-to-guides/work-with-net-client-library/" title=".NET Framework" class="current">.NET Framework</a>
  	<a href="/en-us/develop/mobile/how-to-guides/work-with-html-js-client/" title="HTML/JavaScript">HTML/JavaScript</a><a href="/en-us/develop/mobile/how-to-guides/work-with-ios-client-library/" title="iOS">iOS</a><a href="/en-us/develop/mobile/how-to-guides/work-with-android-client-library/" title="Android">Android</a><a href="/en-us/develop/mobile/how-to-guides/work-with-xamarin-client-library/" title="Xamarin">Xamarin</a>
</div>


This guide shows you how to perform common scenarios using a .NET client for Azure Mobile Services, in Windows Store apps and Windows Phone apps. The scenarios covered include querying for data, inserting, updating, and deleting data, authenticating users, and handling errors. If you are new to Mobile Services, you should consider first completing the "Mobile Services quickstart" tutorial ([Windows Store quickstart tutorial]/[Windows Phone quickstart tutorial]) and the "Getting Started with Data in .NET" tutorial ([Windows Store data tutorial]/[Windows Phone data tutorial]). The quickstart tutorial requires the [Mobile Services SDK] and helps you configure your account and create your first mobile service.


## Table of Contents

- [What is Mobile Services]
- [Concepts]
- [How to: Create the Mobile Services client]
- [How to: Create a table reference]
- [How to: Query data from a mobile service]
	- [Filter returned data]
    - [Sort returned data]
	- [Return data in pages]
	- [Select specific columns]
	- [Look up data by ID]
- [How to: Insert data into a mobile service]
- [How to: Modify data in a mobile service]
- [How to: Delete data in a mobile service]
- [How to: Call a custom API]
- [How to: Use Optimistic Concurrency]
- [How to: Bind data to user interface in a mobile service]
- [How to: Authenticate users]
- [How to: Handle errors]
- [How to: Work with untyped data]
- [How to: Design unit tests]
- [How to: Customize the client]
	- [Customize request headers]
	- [Customize serialization]
- [Next steps]

[AZURE.INCLUDE [mobile-services-concepts](../includes/mobile-services-concepts.md)]

<h2><a name="setup"></a>Setup and Prerequisites</h2>

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

When dynamic schema is enabled, Azure Mobile Services automatically generates new columns based on the object in insert or update requests. For more information, see [Dynamic schema](http://go.microsoft.com/fwlink/?LinkId=296271).

<h2><a name="create-client"></a>How to: Create the Mobile Services client</h2>

The following code creates the `MobileServiceClient` object that is used to access your mobile service.


	MobileServiceClient client = new MobileServiceClient(
		"AppUrl",
		"AppKey"
	);

In the code above, replace `AppUrl` and `AppKey` with the mobile service URL and application key, in that order. Both of these are available on the Azure Management Portal, by selecting your mobile service and then clicking on "Dashboard".

<h2><a name="instantiating"></a>How to: Create a table reference</h2>

All of the code that accesses or modifies data in the Mobile Services table calls functions on the `MobileServiceTable` object. You get a reference to the table by calling the [GetTable](http://msdn.microsoft.com/en-us/library/windowsazure/jj554275.aspx) function on an instance of the `MobileServiceClient`.

    IMobileServiceTable<TodoItem> todoTable =
		client.GetTable<TodoItem>();

This is the typed serialization model; see discussion of the <a href="#untyped">untyped serialization model</a> below.

<h2><a name="querying"></a>How to: Query data from a mobile service</h2>

This section describes how to issue queries to the mobile service. Subsections describe different aspects such as sorting, filtering, and paging.

>[AZURE.NOTE] A server-driven page size is used by default to prevent all rows from being returned. This keeps default requests for large data sets from negatively impacting the service. To return more than 50 rows, use the `Take` method, as described in [Return data in pages].  

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

<a name="inserting"></a>How to: Insert data into a mobile service

> [AZURE.NOTE] If you want to perform insert, lookup, delete, or update operations on a type, then you need to create a member called **Id**. This is why the example class **TodoItem** has a member of name **Id**. A valid id value must always be present in update and delete operations.

The following code illustrates how to insert new rows into a table. The parameter contains the data to be inserted as a .NET object.

	await todoTable.InsertAsync(todoItem);

If a unique custom ID value is not included in the `todoItem` passed to the `todoTable.InsertAsync` call, a value for ID will be generated by the server set in the `todoItem` object returned to the client.

Mobile Services supports unique custom string values for the table id. This allows applications to use custom values such as email addresses or user names for the id column of a Mobile Services table. If a string ID value is not provided when inserting new records into a table, Mobile Services will generate a unique value for the id.

Supporting string ids provides the following advantages to developers

+ Ids can be generated without making a roundtrip to the database.
+ Records are easier to merge from different tables or databases.
+ Ids values can integrate better with an application's logic.

You can also use server scripts to set id values. The script example below generates a custom GUID and assigns it to a new record's id. This is similar to the id value that Mobile Services would generate if you didn't pass in a value for a record's id.

	//Example of generating an id. This is not required since Mobile Services
	//will generate an id if one is not passed in.
	item.id = item.id || newGuid();
	request.execute();

	function newGuid() {
		var pad4 = function(str) { return "0000".substring(str.length) + str; };
		var hex4 = function () { return pad4(Math.floor(Math.random() * 0x10000 /* 65536 */ ).toString(16)); };
		return (hex4() + hex4() + "-" + hex4() + "-" + hex4() + "-" + hex4() + "-" + hex4() + hex4() + hex4());
	}


If an application provides a value for an id, Mobile Services will store it as is. This includes leading or trailing white spaces. White space will not be trimmed from value.

The value for the `id` must be unique and it must not include characters from the following sets:

+ Control characters: [0x0000-0x001F] and [0x007F-0x009F]. For more information, see [ASCII control codes C0 and C1].
+  Printable characters: **"**(0x0022), **\+** (0x002B), **/** (0x002F), **?** (0x003F), **\\** (0x005C), **`** (0x0060)
+  The ids "." and ".."


You can alternatively use integer Ids for your tables. In order to use an integer Id you must create your table with the `mobile table create` command using the `--integerId` option. This command is used with the Command-line Interface (CLI) for Azure. For more information on using the CLI, see [CLI to manage Mobile Services tables].


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


<h2><a name="modifying"></a>How to: Modify data in a mobile service</h2>

The following code illustrates how to update an existing instance with the same ID with new information. The parameter contains the data to be updated as a .NET object.

	await todoTable.UpdateAsync(todoItem);


To insert untyped data, you may take advantage of Json.NET like so. Note that when making an update, an ID must be specified, as that is how the mobile service identifies which instance to update. The ID can be obtained from the result of the `InsertAsync` call.

	JObject jo = new JObject();
	jo.Add("Id", "37BBF396-11F0-4B39-85C8-B319C729AF6D");
	jo.Add("Text", "Hello World");
	jo.Add("Complete", false);
	var inserted = await table.UpdateAsync(jo);

If you attempt to update an item without providing the "Id" value, there is no way for the service to tell which instance to update, so the Mobile Services SDK will throw an `ArgumentException`.


<h2><a name="deleting"></a>How to: Delete data in a mobile service</h2>

The following code illustrates how to delete an existing instance. The instance is identified by the "Id" field set on the `todoItem`.

	await todoTable.DeleteAsync(todoItem);

To delete untyped data, you may take advantage of Json.NET like so. Note that when making a delete request, an ID must be specified, as that is how the mobile service identifies which instance to delete. A delete request needs only the ID; other properties are not passed to the service, and if any are passed, they are ignored at the service. The result of a `DeleteAsync` call is usually `null` as well. The ID to pass in can be obtained from the result of the `InsertAsync` call.

	JObject jo = new JObject();
	jo.Add("Id", "37BBF396-11F0-4B39-85C8-B319C729AF6D");
	await table.DeleteAsync(jo);

If you attempt to delete an item without the "Id" field already set, there is no way for the service to tell which instance to delete, so you will get back a `MobileServiceInvalidOperationException` from the service. Similarly, if you attempt to delete an untyped item without the "Id" field already set, you will again get back a `MobileServiceInvalidOperationException` from the service.

##<a name="#custom-api"></a>How to: Call a custom API

A custom API enables you to define custom endpoints that expose server functionality that does not map to an insert, update, delete, or read operation. By using a custom API, you can have more control over messaging, including reading and setting HTTP message headers and defining a message body format other than JSON. For a complete example, including how to create a custom API in your mobile service, see [Call a custom API from the client].

You call a custom API by calling one of the [InvokeApiAsync] method overloads on the client. For example, the following line of code sends a POST request to the **completeAll** API on the mobile service:

    var result = await App.MobileService
        .InvokeApiAsync<MarkAllResult>("completeAll",
        System.Net.Http.HttpMethod.Post, null);

Note that this a typed method call, which requires that the **MarkAllResult** return type be defined. Both typed and untyped methods are supported. This is an almost trivial example as it is typed, sends no payload, has no query parameters, and doesn't change the request headers. For more realistic examples and a more a complete discussion of [InvokeApiAsync], see [Custom API in Azure Mobile Services Client SDKs].


##<a name="optimisticconcurrency"></a>How to: Use Optimistic Concurrency

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


<h2><a name="binding"></a>How to: Bind data to user interface in a mobile service</h2>

This section shows how to display returned data objects using UI elements. To query incomplete items in `todoTable` and display it in a very simple list, you can run the following example code to bind the source of the list with a query. Using `MobileServiceCollection` creates a mobile services-aware binding collection.

	// This query filters out completed TodoItems.
	MobileServiceCollection<TodoItem, TodoItem> items = await todoTable
		.Where(todoItem => todoItem.Complete == false)
		.ToCollectionAsync();

	// itemsControl is an IEnumerable that could be bound to a UI list control
	IEnumerable itemsControl  = items;

	// Bind this to a ListBox
	ListBox lb = new ListBox();
	lb.ItemsSource = items;

Some controls in the Windows Runtime support an interface called [ISupportIncrementalLoading](http://msdn.microsoft.com/en-us/library/windows/apps/Hh701916). This interface allows controls to request extra data when the user scrolls. There is built-in support for this interface for Windows Store apps via `MobileServiceIncrementalLoadingCollection`, which automatically handles the calls from the controls. To use `MobileServiceIncrementalLoadingCollection` in Windows Store apps, do the following:

			MobileServiceIncrementalLoadingCollection<TodoItem,TodoItem> items;
		items =  todoTable.Where(todoItem => todoItem.Complete == false)
					.ToIncrementalLoadingCollection();

		ListBox lb = new ListBox();
		lb.ItemsSource = items;


To use the new collection on Windows Phone, use the `ToCollection` extension methods on `IMobileServiceTableQuery<T>` and `IMobileServiceTable<T>`. To actually load data, call `LoadMoreItemsAsync()`.

	MobileServiceCollection<TodoItem, TodoItem> items = todoTable.Where(todoItem => todoItem.Complete==false).ToCollection();
	await items.LoadMoreItemsAsync();

When you use the collection created by calling `ToCollectionAsync` or `ToCollection`, you get a collection which can be bound to UI controls. This collection is paging-aware, i.e., a control can ask the collection to "load more items", and the collection will do it for the control. At that point there is no user code involved, the control will start the flow. However, since the collection is loading data from the network, it's expected that some times this loading will fail. To handle such failures, you may override the `OnException` method on `MobileServiceIncrementalLoadingCollection` to handle exceptions resulting from calls to `LoadMoreItemsAsync` performed by controls.

Finally, imagine that your table has many fields, but you only want to display some of them in your control. You may use the guidance in the section <a href="#selecting">"Select specific columns"</a> above to select specific columns to display in the UI.

<h2><a name="authentication"></a>How to: Authenticate users</h2>

Mobile Services supports authenticating and authorizing app users using a variety of external identity providers: Facebook, Google, Microsoft Account, Twitter, and Azure Active Directory. You can set permissions on tables to restrict access for specific operations to only authenticated users. You can also use the identity of authenticated users to implement authorization rules in server scripts. For more information, see the "Get started with authentication" tutorial ([Windows Store][Windows Store authentication]/[Windows Phone][Windows Phone authentication])

Two authentication flows are supported: a _server flow_ and a _client flow_. The server flow provides the simplest authentication experience, as it relies on the provider's web authentication interface. The client flow allows for deeper integration with device-specific capabilities as it relies on provider-specific device-specific SDKs.

<h3>Server flow</h3>
To have Mobile Services manage the authentication process in your Windows Store or Windows Phone app,
you must register your app with your identity provider. Then in your mobile service, you need to configure the application ID and secret provided by your provider. For more information, see the "Get started with authentication" tutorial ([Windows Store][Windows Store authentication]/[Windows Phone][Windows Phone authentication]).

Once you have registered your identity provider, simply call the [LoginAsync method] with the [MobileServiceAuthenticationProvider] value of your provider. For example, the following code initiates a server flow login by using Facebook.

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

In this case, Mobile Services manages the OAuth 2.0 authentication flow by displaying the login page of the selected provider and generating a Mobile Services authentication token after successful login with the identity provider. The [LoginAsync method] returns a [MobileServiceUser], which provides both the [userId] of the authenticated user and the [MobileServiceAuthenticationToken], as a JSON web token (JWT). This token can be cached and re-used until it expires. For more information, see [Caching the authentication token].

> [AZURE.NOTE] **Windows Store app**
When you use the Microsoft Account login provider to authenticate users of your Windows Store app, you should also register the app package with Mobile Services. When you register your Windows Store app package information with Mobile Services, the client is able to re-use Microsoft Account login credentials for a single sign-on experience. If you do not do this, your Microsoft Account login users will be presented with a login prompt every time that the login method is called. To learn how to register your Windows Store app package, see [Register your Windows Store app package for Microsoft authentication](/en-us/develop/mobile/how-to-guides/register-windows-store-app-package/%20target="_blank"). After the package information is registered with Mobile Services, call the [LoginAsync](http://go.microsoft.com/fwlink/p/?LinkId=311594%20target="_blank") method by supplying a value of **true** for the _useSingleSignOn_ parameter to re-use the credentials.

<h3>Client flow</h3>

Your app can also independently contact the identity provider and then provide the returned token to Mobile Services for authentication. This client flow enables you to provide a single sign-in experience for users or to retrieve additional user data from the identity provider.

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

If using a Microsoft account, login like so:

	// Replace authentication_token_value with actual value of your Microsoft authentication token obtained through the Live SDK
	user = await client
		.LoginWithMicrosoftAccountAsync(authentication_token_value);

For an example of how to use Microsoft Account to provide a single sign-in experience, see "Authenticate your app with single sign-in" tutorial ([Windows Store](/en-us/develop/mobile/tutorials/single-sign-on-windows-8-dotnet/)/[Windows Phone](/en-us/develop/mobile/tutorials/single-sign-on-wp8/)).

<h3><a name="caching"></a>Caching the authentication token</h3>
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

<h2><a name="errors"></a>How to: Handle errors</h2>

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

<h2><a name="untyped"></a>How to: Work with untyped data</h2>

The .NET client is designed for strongly typed scenarios. However, sometimes, a more loosely typed experience is convenient; for example, this could be when dealing with objects with open schema. That scenario is enabled as follows. In queries, you forego LINQ and use the wire format.

	// Get an untyped table reference
	IMobileServiceTable untypedTodoTable = client.GetTable("TodoItem");

	// Lookup untyped data using OData
	JToken untypedItems = await untypedTodoTable.ReadAsync("$filter=complete eq 0&$orderby=text");

You get back JSON values that you can use like a property bag. For more information on JToken and Json.NET, see [Json.NET](http://json.codeplex.com/)

<h2><a name="unit-testing"></a>How to: Design unit tests</h2>

The value returned by `MobileServiceClient.GetTable` and the queries are interfaces. That makes them easily "mockable" for testing purposes, so you could create a `MyMockTable : IMobileServiceTable<TodoItem>` that implements your testing logic.

<h2><a name="customizing"></a>How to: Customize the client</h2>

### <a name="headers"></a>How to: Customize request headers

You might want to attach a custom header to every outgoing request, or to change responses status codes. You can accomplish that by configuring a DelegatingHandler like below:

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
		protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
		{
			request.Headers.Add("x-my-header", "my value");
			var response = awaitbase.SendAsync(request, cancellationToken);
			response.StatusCode = HttpStatusCode.ServiceUnavailable;
			return response;
		}
	}


### <a name="serialization"></a>How to: Customize serialization

The [MobileServiceClient](http://msdn.microsoft.com/en-us/library/microsoft.windowsazure.mobileservices.mobileserviceclient.aspx) class exposes a `SerializerSettings` property of type [JsonSerializerSettings](http://james.newtonking.com/projects/json/help/?topic=html/T_Newtonsoft_Json_JsonSerializerSettings.htm)

Using this property, you may set Json.NET properties (there are many), including one -- for example -- to convert all properties to lower case:

	var settings = new JsonSerializerSettings();
	settings.ContractResolver = new CamelCasePropertyNamesContractResolver();
	client.SerializerSettings = settings;

<h2><a name="nextsteps"></a>Next steps</h2>

Now that you have completed this how-to conceptual reference topic, learn how to perform important tasks in Mobile Services in detail:

* [Get started with Mobile Services]
  <br/>Learn the basics of how to use Mobile Services.

* [Get started with data]
  <br/>Learn more about storing and querying data using Mobile Services.

* [Get started with authentication]
  <br/>Learn how to authenticate users of your app with an identity provider.

* [Validate and modify data with scripts]
  <br/>Learn more about using server scripts in Mobile Services to validate and change data sent from your app.

* [Refine queries with paging]
  <br/>Learn how to use paging in queries to control the amount of data handled in a single request.

* [Authorize users with scripts]
  <br/>Learn how to take the user ID value provided by Mobile Services based on an authenticated user and use it to filter the data returned by Mobile Services.

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
[Get started with Mobile Services]: /en-us/develop/mobile/tutorials/get-started
[Mobile Services SDK]: http://go.microsoft.com/fwlink/?LinkId=257545
[Windows Store quickstart tutorial]: http://www.windowsazure.com/en-us/develop/mobile/tutorials/get-started/
[Windows Phone quickstart tutorial]: http://www.windowsazure.com/en-us/develop/mobile/tutorials/get-started-wp8/
[Windows Store data tutorial]: http://www.windowsazure.com/en-us/develop/mobile/tutorials/get-started-with-data-dotnet/
[Windows Phone data tutorial]: http://www.windowsazure.com/en-us/develop/mobile/tutorials/get-started-with-data-wp8/
[Windows Store authentication]: http://www.windowsazure.com/en-us/develop/mobile/tutorials/get-started-with-users-dotnet/
[Windows Phone authentication]: http://www.windowsazure.com/en-us/develop/mobile/tutorials/get-started-with-users-wp8/
[PasswordVault]: http://msdn.microsoft.com/en-us/library/windows/apps/windows.security.credentials.passwordvault.aspx
[Mobile Services SDK]: http://go.microsoft.com/fwlink/?LinkId=257545
[ProtectedData]: http://msdn.microsoft.com/en-us/library/system.security.cryptography.protecteddata%28VS.95%29.aspx
[Mobile Services SDK]: http://nuget.org/packages/WindowsAzure.MobileServices/
[Get started with data]: /en-us/develop/mobile/tutorials/get-started-with-data-dotnet/
[Get started with authentication]: /en-us/develop/mobile/tutorials/get-started-with-users-dotnet
[Validate and modify data with scripts]: /en-us/develop/mobile/tutorials/validate-modify-and-augment-data-dotnet
[Refine queries with paging]: /en-us/develop/mobile/tutorials/add-paging-to-data-dotnet
[Authorize users with scripts]: /en-us/develop/mobile/tutorials/authorize-users-in-scripts-dotnet
[LoginAsync method]: http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.windowsazure.mobileservices.mobileserviceclientextensions.loginasync.aspx
[MobileServiceAuthenticationProvider]: http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.windowsazure.mobileservices.mobileserviceauthenticationprovider.aspx
[MobileServiceUser]: http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.windowsazure.mobileservices.mobileserviceuser.aspx
[UserID]: http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.windowsazure.mobileservices.mobileserviceuser.userid.aspx
[MobileServiceAuthenticationToken]: http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.windowsazure.mobileservices.mobileserviceuser.mobileserviceauthenticationtoken.aspx
[ASCII control codes C0 and C1]: http://en.wikipedia.org/wiki/Data_link_escape_character#C1_set
[CLI to manage Mobile Services tables]: http://www.windowsazure.com/en-us/manage/linux/other-resources/command-line-tools/#Mobile_Tables
[Optimistic Concurrency Tutorial]: http://www.windowsazure.com/en-us/develop/mobile/tutorials/handle-database-write-conflicts-dotnet/

[IncludeTotalCount]: http://msdn.microsoft.com/en-us/library/windowsazure/dn250560.aspx
[Skip]: http://msdn.microsoft.com/en-us/library/windowsazure/dn250573.aspx
[Take]: http://msdn.microsoft.com/en-us/library/windowsazure/dn250574.aspx
[Fiddler]: http://www.telerik.com/fiddler
[Custom API in Azure Mobile Services Client SDKs]: http://blogs.msdn.com/b/carlosfigueira/archive/2013/06/19/custom-api-in-azure-mobile-services-client-sdks.aspx
[Call a custom API from the client]: /en-us/documentation/articles/mobile-services-dotnet-backend-windows-store-dotnet-call-custom-api/
[InvokeApiAsync]: http://msdn.microsoft.com/library/azure/microsoft.windowsazure.mobileservices.mobileserviceclient.invokeapiasync.aspx
