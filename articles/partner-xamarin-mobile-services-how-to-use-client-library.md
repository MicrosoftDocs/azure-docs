<properties 
	pageTitle="How to use the Xamarin Component client - Azure Mobile Services feature guide" 
	description="Learn how to use the Xamarin Component client for Azure Mobile Services." 
	authors="lindydonna" 
	manager="dwrede" 
	editor="" 
	services="mobile-services" 
	documentationCenter="xamarin"/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-xamarin" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="04/24/2015" 
	ms.author="lindydonna"/>

# How to use the Xamarin Component client for Azure Mobile Services
[AZURE.INCLUDE [mobile-services-selector-client-library](../includes/mobile-services-selector-client-library.md)]

This guide shows you how to perform common scenarios using the Xamarin Component client for Azure Mobile Services, in Xamarin apps for iOS and Android. The scenarios covered include querying for data, inserting, updating, and deleting data, authenticating users, and handling errors. If you are new to Mobile Services, you should consider first completing the "Mobile Services quickstart" tutorial ([Xamarin.iOS][Xamarin.iOS quickstart tutorial]/[Xamarin.Android][Xamarin.Android quickstart tutorial]) and the "Getting Started with Data in .NET" tutorial ([Xamarin.iOS][Xamarin.iOS data tutorial]/[Xamarin.Android][Xamarin.Android data tutorial]). The quickstart tutorial requires [Xamarin][Xamarin download] the [Mobile Services SDK] and helps you configure your account and create your first mobile service.

[AZURE.INCLUDE [mobile-services-concepts](../includes/mobile-services-concepts.md)]

## <a name="setup"></a>Setup and Prerequisites

We assume that you have created a mobile service and a table. For more information see [Create a table](http://go.microsoft.com/fwlink/?LinkId=298592). In the code used in this topic, the table is named `TodoItem` and it will have the following columns: `id`, `Text`, and `Complete`.

The corresponding typed client-side .NET type is the following:


	public class TodoItem
	{
		public string id { get; set; }

		[JsonProperty(PropertyName = "text")]
		public string Text { get; set; }

		[JsonProperty(PropertyName = "complete")]
		public bool Complete { get; set; }
	}
	
When dynamic schema is enabled, Azure Mobile Services automatically generates new columns based on the object in insert or update requests. For more information, see [Dynamic schema](http://go.microsoft.com/fwlink/?LinkId=296271).

## <a name="create-client"></a>How to: Create the Mobile Services client

The following code creates the `MobileServiceClient` object that is used to access your mobile service. 
			
	MobileServiceClient client = new MobileServiceClient( 
		"AppUrl", 
		"AppKey" 
	); 

In the code above, replace `AppUrl` and `AppKey` with the mobile service URL and application key, in that order. Both of these are available on the Azure Management Portal, by selecting your mobile service and then clicking on "Dashboard".

## <a name="instantiating"></a>How to: Create a table reference

All of the code that accesses or modifies data in the Mobile Services table calls functions on the `MobileServiceTable` object. You get a reference to the table by calling the [GetTable](http://msdn.microsoft.com/library/windowsazure/jj554275.aspx) function on an instance of the `MobileServiceClient`. 

    IMobileServiceTable<TodoItem> todoTable = 
		client.GetTable<TodoItem>();

This is the typed serialization model; see discussion of <a href="#untyped">the untyped serialization model</a> below.
			
## <a name="querying"></a>How to: Query data from a mobile service 

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

> [AZURE.NOTE] A server-driven page size is used by default to prevent all elements from being returned. This keeps default requests for large data sets from negatively impacting the service.

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
			
You can also use the [IncludeTotalCount](http://msdn.microsoft.com/library/windowsazure/jj730933.aspx) method to ensure that the query will get the total count for <i>all</i> the records that would have been returned, ignoring any take paging/limit clause specified:

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

	// This query filters out the item with the ID of 25
	TodoItem item25 = await todoTable.LookupAsync(25);

## <a name="inserting"></a>How to: Insert data into a mobile service

> [AZURE.NOTE] If you want to perform insert, lookup, delete, or update operations on a type, then you need to create a member called **Id** (regardless of case). This is why the example class **TodoItem** has a member of name **Id**. An ID value must not be set to anything other than the default value during insert operations; by contrast, the ID value should always be set to a non-default value and present in update and delete operations.

The following code illustrates how to insert new rows into a table. The parameter contains the data to be inserted as a .NET object.

	await todoTable.InsertAsync(todoItem);

After the await `todoTable.InsertAsync` call returns, the ID of the object in the server is populated to the `todoItem` object in the client. 

To insert untyped data, you may take advantage of Json.NET as shown below. Again, note that an ID must not be specified when inserting an object.

	JObject jo = new JObject(); 
	jo.Add("Text", "Hello World"); 
	jo.Add("Complete", false);
	var inserted = await table.InsertAsync(jo);

If you attempt to insert an item with the "Id" field already set, you will get back a `MobileServiceInvalidOperationException` from the service. 

## <a name="modifying"></a>How to: Modify data in a mobile service

The following code illustrates how to update an existing instance with the same ID with new information. The parameter contains the data to be updated as a .NET object.

	await todoTable.UpdateAsync(todoItem);


To insert untyped data, you may take advantage of Json.NET like so. Note that when making an update, an ID must be specified, as that is how the mobile service identifies which instance to update. The ID can be obtained from the result of the `InsertAsync` call.

	JObject jo = new JObject(); 
	jo.Add("Id", 52);
	jo.Add("Text", "Hello World"); 
	jo.Add("Complete", false);
	var inserted = await table.UpdateAsync(jo);
			
If you attempt to update an item without the "Id" field already set, there is no way for the service to tell which instance to update, so you will get back a `MobileServiceInvalidOperationException` from the service. Similarly, if you attempt to update an untyped item without the "Id" field already set, you will again get back a `MobileServiceInvalidOperationException` from the service. 
			
			
## <a name="deleting"></a>How to: Delete data in a mobile service

The following code illustrates how to delete an existing instance. The instance is identified by the "Id" field set on the `todoItem`.

	await todoTable.DeleteAsync(todoItem);

To delete untyped data, you may take advantage of Json.NET like so. Note that when making a delete request, an ID must be specified, as that is how the mobile service identifies which instance to delete. A delete request needs only the ID; other properties are not passed to the service, and if any are passed, they are ignored at the service. The result of a `DeleteAsync` call is usually `null` as well. The ID to pass in can be obtained from the result of the `InsertAsync` call.

	JObject jo = new JObject(); 
	jo.Add("Id", 52);
	await table.DeleteAsync(jo);
			
If you attempt to delete an item without the "Id" field already set, there is no way for the service to tell which instance to delete, so you will get back a `MobileServiceInvalidOperationException` from the service. Similarly, if you attempt to delete an untyped item without the "Id" field already set, you will again get back a `MobileServiceInvalidOperationException` from the service. 
		


## <a name="authentication"></a>How to: Authenticate users

Mobile Services supports authenticating and authorizing app users using a variety of external identity providers: Facebook, Google, Microsoft Account, Twitter, and Azure Active Directory. You can set permissions on tables to restrict access for specific operations to only authenticated users. You can also use the identity of authenticated users to implement authorization rules in server scripts. For more information, see the "Get started with authentication" tutorial ([Xamarin.iOS][Xamarin.iOS authentication]/[Xamarin.Android][Xamarin.Android authentication]).

Two authentication flows are supported: a _server flow_ and a _client flow_. The server flow provides the simplest authentication experience, as it relies on the provider's web authentication interface. The client flow allows for deeper integration with device-specific capabilities as it relies on provider-specific device-specific SDKs.

### Server flow
To have Mobile Services manage the authentication process in your Windows Store or Windows Phone app, 
you must register your app with your identity provider. Then in your mobile service, you need to configure the application ID and secret provided by your provider. For more information, see the "Get started with authentication" tutorial ([Xamarin.iOS][Xamarin.iOS authentication]/[Xamarin.Android][Xamarin.Android authentication]).

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

### Client flow

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

### <a name="caching"></a>Caching the authentication token
In some cases, the call to the login method can be avoided after the first time the user authenticates. You can use a local secure store (such as [Xamarin.Auth][Xamarin.Auth component]) to cache the current user identity the first time they log in and every subsequent time you check whether you already have the user identity in our cache. When the cache is empty, you still need to send the user through the login process. 

	using Xamarin.Auth;
	var accountStore = AccountStore.Create(); // Xamarin.iOS
	//var accountStore = AccountStore.Create(this); // Xamarin.Android

	// After logging in
	var account = new Account (user.UserId, new Dictionary<string,string> {{"token",user.MobileServiceAuthenticationToken}});
	accountStore.Save(account, "Facebook");

	// Log in 
	var accounts = accountStore.FindAccountsForService ("Facebook").ToArray();
	if (accounts.Count != 0)
	{
		user = new MobileServiceUser (accounts[0].Username);
		user.MobileServiceAuthenticationToken = accounts[0].Properties["token"];
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
	accountStore.Delete(account, "Facebook");


## <a name="errors"></a>How to: Handle errors

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

## <a name="untyped"></a>How to: Work with untyped data

The Xamarin Component client is designed for strongly typed scenarios. However, sometimes, a more loosely typed experience is convenient; for example, this could be when dealing with objects with open schema. That scenario is enabled as follows. In queries, you forego LINQ and use the wire format.

	// Get an untyped table reference
	IMobileServiceTable untypedTodoTable = client.GetTable("TodoItem");			

	// Lookup untyped data using OData
	JToken untypedItems = await untypedTodoTable.ReadAsync("$filter=complete eq 0&$orderby=text");

You get back JSON values that you can use like a property bag. For more information on JToken and Json.NET, see [Json.NET](http://json.codeplex.com/)

## <a name="unit-testing"></a>How to: Design unit tests

The value returned by `MobileServiceClient.GetTable` and the queries are interfaces. That makes them easily "mockable" for testing purposes, so you could create a `MyMockTable : IMobileServiceTable<TodoItem>` that implements your testing logic.

## <a name="nextsteps"></a>Next steps

Now that you have completed this how-to conceptual reference topic, learn how to perform important tasks in Mobile Services in detail:

* Get started with Mobile Services ([Xamarin.iOS][Get started with Mobile Services iOS]/[Xamarin.Android][Get started with Mobile Services Android])
  <br/>Learn the basics of how to use Mobile Services.

* Get started with data ([Xamarin.iOS][Get started with data iOS]/[Xamarin.Android][Get started with data Android])
  <br/>Learn more about storing and querying data using Mobile Services.

* Get started with authentication ([Xamarin.iOS][Get started with authentication iOS]/[Xamarin.Android][Get started with authentication Android])
  <br/>Learn how to authenticate users of your app with an identity provider.

* Validate and modify data with scripts ([Xamarin.iOS][Validate and modify data with scripts ios]/[Xamarin.Android][Validate and modify data with scripts android])
  <br/>Learn more about using server scripts in Mobile Services to validate and change data sent from your app.

* Refine queries with paging ([Xamarin.iOS][Refine queries with paging iOS]/[Xamarin.Android][Refine queries with paging Android])
  <br/>Learn how to use paging in queries to control the amount of data handled in a single request.

* Authorize users with scripts ([Xamarin.iOS][Authorize users with scripts iOS]/[Xamarin.Android][Authorize users with scripts Android])
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

<!-- URLs. -->
[Get started with Mobile Services iOS]: /develop/mobile/tutorials/get-started-xamarin-ios
[Get started with Mobile Services Android]: /develop/mobile/tutorials/get-started-xamarin-android
[Xamarin download]: http://xamarin.com/download/
[Mobile Services SDK]: http://go.microsoft.com/fwlink/?LinkId=257545
[Xamarin.iOS quickstart tutorial]: /develop/mobile/tutorials/get-started-xamarin-ios/
[Xamarin.Android quickstart tutorial]: /develop/mobile/tutorials/get-started-xamarin-android/
[Xamarin.iOS data tutorial]: /develop/mobile/tutorials/get-started-with-data-xamarin-ios/
[Xamarin.Android data tutorial]: /develop/mobile/tutorials/get-started-with-data-xamarin-android/
[Xamarin.iOS authentication]: /develop/mobile/tutorials/get-started-with-users-xamarin-ios/
[Xamarin.Android authentication]: /develop/mobile/tutorials/get-started-with-users-xamarin-android/
[Mobile Services SDK]: http://go.microsoft.com/fwlink/?LinkId=257545
[Xamarin.Auth component]: https://components.xamarin.com/view/xamarin.auth

[Mobile Services SDK]: http://nuget.org/packages/WindowsAzure.MobileServices/
[Get started with data iOS]: /develop/mobile/tutorials/get-started-with-data-xamarin-ios
[Get started with data Android]: /develop/mobile/tutorials/get-started-with-data-xamarin-android
[Get started with authentication iOS]: /develop/mobile/tutorials/get-started-with-users-xamarin-ios
[Get started with authentication Android]: /develop/mobile/tutorials/get-started-with-users-xamarin-android
[Validate and modify data with scripts ios]: /develop/mobile/tutorials/validate-modify-and-augment-data-xamarin-ios
[Validate and modify data with scripts android]: /develop/mobile/tutorials/validate-modify-and-augment-data-xamarin-android
[Refine queries with paging iOS]: /develop/mobile/tutorials/add-paging-to-data-xamarin-ios
[Refine queries with paging Android]: /develop/mobile/tutorials/add-paging-to-data-xamarin-android
[Authorize users with scripts iOS]: /develop/mobile/tutorials/authorize-users-in-scripts-xamarin-ios
[Authorize users with scripts Android]: /develop/mobile/tutorials/authorize-users-in-scripts-xamarin-android
[LoginAsync method]: http://msdn.microsoft.com/library/windowsazure/microsoft.windowsazure.mobileservices.mobileserviceclientextensions.loginasync.aspx
[MobileServiceAuthenticationProvider]: http://msdn.microsoft.com/library/windowsazure/microsoft.windowsazure.mobileservices.mobileserviceauthenticationprovider.aspx
[MobileServiceUser]: http://msdn.microsoft.com/library/windowsazure/microsoft.windowsazure.mobileservices.mobileserviceuser.aspx
[UserID]: http://msdn.microsoft.com/library/windowsazure/microsoft.windowsazure.mobileservices.mobileserviceuser.userid.aspx
[MobileServiceAuthenticationToken]: http://msdn.microsoft.com/library/windowsazure/microsoft.windowsazure.mobileservices.mobileserviceuser.mobileserviceauthenticationtoken.aspx
