<properties linkid="mobile-services-how-to-dotnet-client" urlDisplayName=".NET Client" pageTitle="How to use an .NET client - Windows Azure Mobile Services feature guide" metaKeywords="Windows Azure Mobile Services, Mobile Service .NET client, .NET client" metaDescription="Learn how to use a .NET client for Windows Azure Mobile Services." metaCanonical="" disqusComments="1" umbracoNaviHide="0" writer="krisragh" />


<div chunk="../chunks/article-left-menu-dotnet.md" />

# How to use a .NET client for Windows Azure Mobile Services

<div class="dev-center-tutorial-selector"><a href="/en-us/develop/mobile/how-to-guides/work-with-net-client-library/" title=".NET Framework" class="current">.NET Framework</a> <a href="/en-us/develop/mobile/how-to-guides/work-with-html-js-client/" title="JavaScript">HTML/JavaScript</a> <a href="/en-us/develop/mobile/how-to-guides/work-with-android-client-library/" title="Android">Android</a></div>


This guide shows you how to perform common scenarios using a .NET client for Windows Azure Mobile Services, in Windows Store apps and Windows Phone apps. The scenarios covered include querying for data, inserting, updating, and deleting data, authenticating users, and handling errors. If you are new to Mobile Services, you should consider first completing the "Mobile Services quickstart" tutorial ([Windows Store quickstart tutorial]/[Windows Phone quickstart tutorial]) and the "Getting Started with Data in .NET" tutorial ([Windows Store data tutorial]/[Windows Phone data tutorial]). The quickstart tutorial requires the [Mobile Services SDK] and helps you configure your account and create your first mobile service.


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
- [How to: Bind data to user interface in a mobile service]
- [How to: Authenticate users]
- [How to: Handle errors]
- [How to: Work with untyped data]
- [How to: Design unit tests]
- [How to: Customize the client]
	- [Customize request headers]
	- [Customize serialization]
	
<div chunk="../chunks/mobile-services-concepts.md" />

<h2><a name="setup"></a><span class="short-header">Setup</span>Setup and Prerequisites</h2>

We assume that you have created a mobile service and a table. For more information see [Create a table](http://go.microsoft.com/fwlink/?LinkId=298592). In the code used in this topic, the table is named `TodoItem` and it will have the following columns: `id`, `Text`, and `Complete`.

The corresponding typed client-side .NET type is the following:


	public class TodoItem
	{
		public int id { get; set; }

		[JsonProperty(PropertyName = "text")]
		public string Text { get; set; }

		[JsonProperty(PropertyName = "complete")]
		public bool Complete { get; set; }
	}
	
When dynamic schema is enabled, Windows Azure Mobile Services automatically generates new columns based on the object in insert or update requests. For more information, see [Dynamic schema](http://go.microsoft.com/fwlink/?LinkId=296271).

<h2><a name="create-client"></a><span class="short-header">Create the Mobile Services client</span>How to: Create the Mobile Services client</h2>

The following code creates the `MobileServiceClient` object that is used to access your mobile service. 

			
	MobileServiceClient client = new MobileServiceClient( 
		"AppUrl", 
		"AppKey" 
	); 

In the code above, replace `AppUrl` and `AppKey` with the mobile service URL and application key, in that order. Both of these are available on the Windows Azure Management Portal, by selecting your mobile service and then clicking on "Dashboard".

<h2><a name="instantiating"></a><span class="short-header">Creating a table reference</span>How to: Create a table reference</h2>

All of the code that accesses or modifies data in the Mobile Services table calls functions on the `MobileServiceTable` object. You get a reference to the table by calling the [GetTable](http://msdn.microsoft.com/en-us/library/windowsazure/jj554275.aspx) function on an instance of the `MobileServiceClient`. 

    IMobileServiceTable<TodoItem> todoTable = 
		client.GetTable<TodoItem>();

This is the typed serialization model; see discussion of <a href="#untyped">the untyped serialization model</a> below.
			
<h2><a name="querying"></a><span class="short-header">Querying data</span>How to: Query data from a mobile service</h2>

This section describes how to issue queries to the mobile service. Subsections describe different aspects such as sorting, filtering, and paging. 
			
### <a name="filtering"></a>How to: Filter returned data

The following code illustrates how to filter data by including a `Where` clause in a query. It returns all items from `todoTable` whose `Complete` property is equal to `false`. The `Where` function applies a row filtering predicate to the query against the table. 
	

	// This query filters out completed TodoItems and 
	// items without a timestamp. 
	List<TodoItem> items = await todoTable
	   .Where(todoItem => todoItem.Complete == false)
	   .ToListAsync();

You can view the URI of the request sent to the mobile service by using message inspection software, such as browser developer tools or Fiddler. If you look at the request URI below,  notice that we are modifying the query string  itself:

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

The following code illustrates how to sort data by including an `OrderBy` or `OrderByDescending` function in the query. It returns items from `todoTable` sorted ascending by the `Text` field. By default, the server returns only the first 50 elements. 

<div class="dev-callout"><strong>Note</strong> <p>A server-driven page size is used by default to prevent all elements from being returned. This keeps default requests for large data sets from negatively impacting the service. </p> </div>

You may increase the number of items to be returned by calling `Take` as described in the next section.

	// Sort items in ascending order by Text field
	MobileServiceTableQuery<TodoItem> query = todoTable
					.OrderBy(todoItem => todoItem.Text)       
 	List<TodoItem> items = await query.ToListAsync();

	// Sort items in descending order by Text field
	MobileServiceTableQuery<TodoItem> query = todoTable
					.OrderByDescending(todoItem => todoItem.Text)       
 	List<TodoItem> items = await query.ToListAsync();			

### <a name="paging"></a>How to: Return data in pages

The following code shows how to implement paging in returned data by using the `Take` and `Skip` clauses in the query.  The following query, when executed, returns the top three items in the table. 

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
			
You can also use the [IncludeTotalCount](http://msdn.microsoft.com/en-us/library/windowsazure/jj730933.aspx) method to ensure that the query will get the total count for <i>all</i> the records that would have been returned, ignoring any take paging/limit clause specified:

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
			
All the functions described so far are additive, so we can just keep calling them and we’ll each time affect more of the query. One more example:

	MobileServiceTableQuery<TodoItem> query = todoTable
					.Where(todoItem => todoItem.Complete == false)
					.Select(todoItem => todoItem.Text)
					.Skip(3).
					.Take(3);
	List<string> items = await query.ToListAsync();
	
### <a name="lookingup"></a>How to: Look up data by ID

The `LookupAsync` function can be used to look up objects from the database with a particular ID. 

	// This query filters out the item with the ID of 25
	TodoItem item25 = await todoTable.LookupAsync(25);

<h2><a name="inserting"></a><span class="short-header">Inserting data</span>How to: Insert data into a mobile service</h2>

<div class="dev-callout"><strong>Note</strong> <p>If you want to perform insert, lookup, delete, or update operations on a type, then you need to create a member called <strong>Id</strong> (regardless of case). This is why the example class <strong>TodoItem</strong> has a member of name <strong>Id</strong>. An ID value must not be set to anything other than the default value during insert operations; by contrast, the ID value should always be set to a non-default value and present in update and delete operations.</p> </div>

The following code illustrates how to insert new rows into a table. The parameter contains the data to be inserted as a .NET object.

	await todoTable.InsertAsync(todoItem);

After the await `todoTable.InsertAsync` call returns, the ID of the object in the server is populated to the `todoItem` object in the client. 

To insert untyped data, you may take advantage of Json.NET as shown below. Again, note that an ID must not be specified when inserting an object.

	JObject jo = new JObject(); 
	jo.Add("Text", "Hello World"); 
	jo.Add("Complete", false);
	var inserted = await table.InsertAsync(jo);

If you attempt to insert an item with the "Id" field already set, you will get back a `MobileServiceInvalidOperationException` from the service. 

<h2><a name="modifying"></a><span class="short-header">Modifying data</span>How to: Modify data in a mobile service</h2>

The following code illustrates how to update an existing instance with the same ID with new information. The parameter contains the data to be updated as a .NET object.

	await todoTable.UpdateAsync(todoItem);


To insert untyped data, you may take advantage of Json.NET like so. Note that when making an update, an ID must be specified, as that is how the mobile service identifies which instance to update. The ID can be obtained from the result of the `InsertAsync` call.

	JObject jo = new JObject(); 
	jo.Add("Id", 52);
	jo.Add("Text", "Hello World"); 
	jo.Add("Complete", false);
	var inserted = await table.UpdateAsync(jo);
			
If you attempt to update an item without the "Id" field already set, there is no way for the service to tell which instance to update, so you will get back a `MobileServiceInvalidOperationException` from the service. Similarly, if you attempt to update an untyped item without the "Id" field already set, you will again get back a `MobileServiceInvalidOperationException` from the service. 
			
			
<h2><a name="deleting"></a><span class="short-header">Deleting data</span>How to: Delete data in a mobile service</h2>

The following code illustrates how to delete an existing instance. The instance is identified by the "Id" field set on the `todoItem`.

	await todoTable.DeleteAsync(todoItem);

To delete untyped data, you may take advantage of Json.NET like so. Note that when making a delete request, an ID must be specified, as that is how the mobile service identifies which instance to delete. A delete request needs only the ID; other properties are not passed to the service, and if any are passed, they are ignored at the service. The result of a `DeleteAsync` call is usually `null` as well. The ID to pass in can be obtained from the result of the `InsertAsync` call.

	JObject jo = new JObject(); 
	jo.Add("Id", 52);
	await table.DeleteAsync(jo);
			
If you attempt to delete an item without the "Id" field already set, there is no way for the service to tell which instance to delete, so you will get back a `MobileServiceInvalidOperationException` from the service. Similarly, if you attempt to delete an untyped item without the "Id" field already set, you will again get back a `MobileServiceInvalidOperationException` from the service. 
			

<h2><a name="binding"></a><span class="short-header">Displaying data</span>How to: Bind data to user interface in a mobile service</h2>

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

<h2><a name="caching"></a><span class="short-header">Authentication</span>How to: Authenticate users</h2>

Mobile Services supports authenticating and authorizing app users using a variety of external identity providers: Facebook, Google, Microsoft Account, and Twitter. You can set permissions on tables to restrict access for specific operations to only authenticated users. You can also use the identity of authenticated users to implement authorization rules in server scripts. For more information, see the "Get started with authentication" tutorial ([Windows Store authentication]/[Windows Phone authentication])

Two authentication flows are supported: a "server" flow and a "client" flow. The server flow provides the simplest authentication experience, as it relies on the provider’s web authentication interface. The client flow allows for deeper integration with device-specific capabilities as it relies on provider-specific device-specific SDKs.

<h3>Server flow</h3>
To login with Facebook, use the following code. If you are using an identity provider other than Facebook, change the value of [MobileServiceAuthenticationProvider](http://msdn.microsoft.com/en-us/library/microsoft.windowsazure.mobileservices.mobileserviceauthenticationprovider.aspx) above to the value for your provider.

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

Inside your mobile service, you need to configure the application ID and secret provided by your authentication provider. For more information, see the "Get started with authentication" tutorial ([Windows Store authentication]/[Windows Phone authentication])

<h3>Client flow</h3>

In the most simplified form, we can use the client flow as shown in this snippet for Facebook or Google. 

	var token = new JObject();
	// Replace access_token_value with actual value of your access token obtained using the Facebook or Google SDK
	token.Add("access_token", "access_token_value");
			
	private MobileServiceUser user;
	private async System.Threading.Tasks.Task Authenticate()
	{
		while (user == null)
		{
			string message;
			try
			{
				// Change MobileServiceAuthenticationProvider.Facebook to MobileServiceAuthenticationProvider.Google if using Google
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


<h3>Caching the authentication token</h3>
In some cases, the call to the login method can be avoided after the first time the user authenticates. We can use [PasswordVault] for Windows Store apps to cache the current user identity the first time they log in and every subsequent time we check whether we already have the user identity in our cache. If the cache is empty, we still need to go through the login process. 

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


For Windows Phone apps, you may encrypt and cache data using the [ProtectData] class and store sensitive information in isolated storage.

<h2><a name="errors"></a><span class="short-header">Error handling</span>How to: Handle errors</h2>

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

<h2><a name="untyped"></a><span class="short-header">Working with untyped data</span>How to: Work with untyped data</h2>

The .NET client is designed for strongly typed scenarios. However, sometimes, a more loosely typed experience is convenient; for example, this could be when dealing with objects with open schema. That scenario is enabled as follows. In queries, you forego LINQ and use the wire format.

	// Get an untyped table reference
	IMobileServiceTable untypedTodoTable = client.GetTable("TodoItem");			

	// Lookup untyped data using OData
	JToken untypedItems = await untypedTodoTable.ReadAsync("$filter=complete eq 0&$orderby=text");

You get back JSON values that you can use like a property bag. For more information on JToken and Json.NET, see [Json.NET](http://json.codeplex.com/)

<h2><a name="unit-testing"></a><span class="short-header">Designing tests</span>How to: Design unit tests</h2>

The value returned by `MobileServiceClient.GetTable` and the queries are interfaces. That makes them easily "mockable" for testing purposes, so you could create a `MyMockTable : IMobileServiceTable<TodoItem>` that implements your testing logic.

<h2><a name="customizing"></a><span class="short-header">Customizing the client</span>How to: Customize the client</h2>

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

Using this property, you may set Json.NET properties (there have many), including one -- for example -- to convert all properties to lower case:

	var settings = new JsonSerializerSettings();
	settings.ContractResolver = new CamelCasePropertyNamesContractResolver();
	client.SerializerSettings = settings;
				
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
[How to: Authenticate users]: #caching
[How to: Handle errors]: #errors
[How to: Design unit tests]: #unit-testing 
[How to: Query data from a mobile service]: #querying
[How to: Customize the client]: #customizing
[How to: Work with untyped data]: #untyped
[Customize request headers]: #headers
[Customize serialization]: #serialization

<!-- URLs. -->
[Get started with Mobile Services]: ../tutorials/mobile-services-get-started.md
[Mobile Services SDK]: http://go.microsoft.com/fwlink/?LinkId=257545
[Get started with authentication]: ../mobile-services-get-started-with-users-dotnet.md
[Windows Store quickstart tutorial]: http://www.windowsazure.com/en-us/develop/mobile/tutorials/get-started/
[Windows Phone quickstart tutorial]: http://www.windowsazure.com/en-us/develop/mobile/tutorials/get-started-wp8/
[Windows Store data tutorial]: http://www.windowsazure.com/en-us/develop/mobile/tutorials/get-started-with-data-dotnet/
[Windows Phone data tutorial]: http://www.windowsazure.com/en-us/develop/mobile/tutorials/get-started-with-data-wp8/
[Windows Store authentication]: http://www.windowsazure.com/en-us/develop/mobile/tutorials/get-started-with-users-dotnet/
[Windows Phone authentication]: http://www.windowsazure.com/en-us/develop/mobile/tutorials/get-started-with-users-wp8/
[PasswordVault]: http://msdn.microsoft.com/en-us/library/windows/apps/windows.security.credentials.passwordvault.aspx
[7]: ../Media/mobile-add-nuget-package-dotnet.png
[8]: ../Media/mobile-dashboard-tab.png
[Mobile Services SDK]: http://go.microsoft.com/fwlink/?LinkId=257545
[ProtectData]: http://msdn.microsoft.com/en-us/library/system.security.cryptography.protecteddata%28VS.95%29.aspx
[Mobile Services SDK]: http://nuget.org/packages/WindowsAzure.MobileServices/