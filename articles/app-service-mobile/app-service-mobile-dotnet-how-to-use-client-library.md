---
title: Working with the App Service Mobile Apps managed client library (Windows | Microsoft Docs
description: Learn how to use a .NET client for Azure App Service Mobile Apps with Windows and Xamarin apps.
services: app-service\mobile
documentationcenter: ''
author: conceptdev
manager: crdun
editor: ''

ms.assetid: 0280785c-e027-4e0d-aaf2-6f155e5a6197
ms.service: app-service-mobile
ms.workload: mobile
ms.tgt_pltfrm: mobile-multiple
ms.devlang: dotnet
ms.topic: article
ms.date: 09/24/2018
ms.author: crdun

---
# How to use the managed client for Azure Mobile Apps
[!INCLUDE [app-service-mobile-selector-client-library](../../includes/app-service-mobile-selector-client-library.md)]

## Overview
This guide shows you how to perform common scenarios using the managed client library for Azure App Service
Mobile Apps for Windows and Xamarin apps. If you are new to Mobile Apps, you should consider first completing
the [Azure Mobile Apps quickstart][1] tutorial. In this guide, we focus on the client-side managed SDK. To learn
more about the server-side SDKs for Mobile Apps, see the documentation for the [.NET Server SDK][2] or the
[Node.js Server SDK][3].

## Reference documentation
The reference documentation for the client SDK is located here: [Azure Mobile Apps .NET client reference][4].
You can also find several client samples in the [Azure-Samples GitHub repository][5].

## Supported Platforms
The .NET Platform supports the following platforms:

* Xamarin Android releases for API 19 through 24 (KitKat through Nougat)
* Xamarin iOS releases for iOS versions 8.0 and later
* Universal Windows Platform
* Windows Phone 8.1
* Windows Phone 8.0 except for Silverlight applications

The "server-flow" authentication uses a WebView for the presented UI.  If the device is not able to present a
WebView UI, then other methods of authentication are needed.  This SDK is thus not suitable for Watch-type or
similarly restricted devices.

## <a name="setup"></a>Setup and Prerequisites
We assume that you have already created and published your Mobile App backend project, which includes at least
one table.  In the code used in this topic, the table is named `TodoItem` and it has the following columns:
`Id`, `Text`, and `Complete`. This table is the same table created when you complete the
[Azure Mobile Apps quickstart][1].

The corresponding typed client-side type in C# is the following class:

```
public class TodoItem
{
    public string Id { get; set; }

    [JsonProperty(PropertyName = "text")]
    public string Text { get; set; }

    [JsonProperty(PropertyName = "complete")]
    public bool Complete { get; set; }
}
```

The [JsonPropertyAttribute][6] is used to define the *PropertyName* mapping between the client field and the table field.

To learn how to create tables in your Mobile Apps backend, see the [.NET Server SDK topic][7]
or the [Node.js Server SDK topic][8]. If you created your Mobile App backend in the Azure portal using the QuickStart,
you can also use the **Easy tables** setting in the [Azure portal].

### How to: Install the managed client SDK package
Use one of the following methods to install the managed client SDK package for Mobile Apps from [NuGet][9]:

* **Visual Studio**
  Right-click your project, click **Manage NuGet Packages**, search for the `Microsoft.Azure.Mobile.Client` package, then click **Install**.
* **Xamarin Studio**
  Right-click your project, click **Add** > **Add NuGet Packages**, search for the `Microsoft.Azure.Mobile.Client `package, and then click **Add Package**.

In your main activity file, remember to add the following **using** statement:

```
using Microsoft.WindowsAzure.MobileServices;
```

> [!NOTE]
> Please note that all the support packages referenced in your Android project must have the same version. The SDK has `Xamarin.Android.Support.CustomTabs` dependency for Android platform, so if your project uses newer support packages you need to install this package with required version directly to avoid conflicts.

### <a name="symbolsource"></a>How to: Work with debug symbols in Visual Studio
The symbols for the Microsoft.Azure.Mobile namespace are available on [SymbolSource][10].  Refer to the
[SymbolSource instructions][11] to integrate SymbolSource with Visual Studio.

## <a name="create-client"></a>Create the Mobile Apps client
The following code creates the [MobileServiceClient][12] object that is used to access your Mobile App backend.

```
var client = new MobileServiceClient("MOBILE_APP_URL");
```

In the preceding code, replace `MOBILE_APP_URL` with the URL of the Mobile App backend, which is found in the
blade for your Mobile App backend in the [Azure portal]. The MobileServiceClient object should be a singleton.

## Work with Tables
The following section details how to search and retrieve records and modify the data within the table.  The following
topics are covered:

* [Create a table reference](#instantiating)
* [Query data](#querying)
* [Filter returned data](#filtering)
* [Sort returned data](#sorting)
* [Return data in pages](#paging)
* [Select specific columns](#selecting)
* [Look up a record by Id](#lookingup)
* [Dealing with untyped queries](#untypedqueries)
* [Inserting data](#inserting)
* [Updating data](#updating)
* [Deleting data](#deleting)
* [Conflict Resolution and Optimistic Concurrency](#optimisticconcurrency)
* [Binding to a Windows User Interface](#binding)
* [Changing the Page Size](#pagesize)

### <a name="instantiating"></a>How to: Create a table reference
All the code that accesses or modifies data in a backend table calls functions on the `MobileServiceTable`
object. Obtain a reference to the table by calling the [GetTable] method, as follows:

```
IMobileServiceTable<TodoItem> todoTable = client.GetTable<TodoItem>();
```

The returned object uses the typed serialization model. An untyped serialization model is also supported. The
following example [creates a reference to an untyped table]:

```
// Get an untyped table reference
IMobileServiceTable untypedTodoTable = client.GetTable("TodoItem");
```

In untyped queries, you must specify the underlying OData query string.

### <a name="querying"></a>How to: Query data from your Mobile App
This section describes how to issue queries to the Mobile App backend, which includes the following functionality:

* [Filter returned data](#filtering)
* [Sort returned data](#sorting)
* [Return data in pages](#paging)
* [Select specific columns](#selecting)
* [Look up data by ID](#lookingup)

> [!NOTE]
> A server-driven page size is enforced to prevent all rows from being returned.  Paging keeps
> default requests for large data sets from negatively impacting the service.  To return more than 50 rows,
> use the `Skip` and `Take` method, as described in [Return data in pages](#paging).

### <a name="filtering"></a>How to: Filter returned data
The following code illustrates how to filter data by including a `Where` clause in a query. It returns all items from
`todoTable` whose `Complete` property is equal to `false`. The [Where] function applies a row filtering predicate to
the query against the table.

```
// This query filters out completed TodoItems and items without a timestamp.
List<TodoItem> items = await todoTable
    .Where(todoItem => todoItem.Complete == false)
    .ToListAsync();
```

You can view the URI of the request sent to the backend by using message inspection software, such as browser developer
tools or [Fiddler]. If you look at the request URI, notice that the query string is modified:

```
GET /tables/todoitem?$filter=(complete+eq+false) HTTP/1.1
```

This OData request is translated into an SQL query by the Server SDK:

```
SELECT *
    FROM TodoItem
    WHERE ISNULL(complete, 0) = 0
```

The function that is passed to the `Where` method can have an arbitrary number of conditions.

```
// This query filters out completed TodoItems where Text isn't null
List<TodoItem> items = await todoTable
    .Where(todoItem => todoItem.Complete == false && todoItem.Text != null)
    .ToListAsync();
```

This example would be translated into an SQL query by the Server SDK:

```
SELECT *
    FROM TodoItem
    WHERE ISNULL(complete, 0) = 0
          AND ISNULL(text, 0) = 0
```

This query can also be split into multiple clauses:

```
List<TodoItem> items = await todoTable
    .Where(todoItem => todoItem.Complete == false)
    .Where(todoItem => todoItem.Text != null)
    .ToListAsync();
```

The two methods are equivalent and may be used interchangeably.  The former option&mdash;of concatenating
multiple predicates in one query&mdash;is more compact and recommended.

The `Where` clause supports operations that be translated into the OData subset. Operations include:

* Relational operators (==, !=, <, <=, >, >=),
* Arithmetic operators (+, -, /, *, %),
* Number precision (Math.Floor, Math.Ceiling),
* String functions (Length, Substring, Replace, IndexOf, StartsWith, EndsWith),
* Date properties (Year, Month, Day, Hour, Minute, Second),
* Access properties of an object, and
* Expressions combining any of these operations.

When considering what the Server SDK supports, you can consider the [OData v3 Documentation].

### <a name="sorting"></a>How to: Sort returned data
The following code illustrates how to sort data by including an [OrderBy] or [OrderByDescending] function
in the query. It returns items from `todoTable` sorted ascending by the `Text` field.

```
// Sort items in ascending order by Text field
MobileServiceTableQuery<TodoItem> query = todoTable
                .OrderBy(todoItem => todoItem.Text)
List<TodoItem> items = await query.ToListAsync();

// Sort items in descending order by Text field
MobileServiceTableQuery<TodoItem> query = todoTable
                .OrderByDescending(todoItem => todoItem.Text)
List<TodoItem> items = await query.ToListAsync();
```

### <a name="paging"></a>How to: Return data in pages
By default, the backend returns only the first 50 rows. You can increase the number of returned rows by calling
the [Take] method. Use `Take` along with the [Skip] method to request a specific "page" of the total dataset
returned by the query. The following query, when executed, returns the top three items in the table.

```
// Define a filtered query that returns the top 3 items.
MobileServiceTableQuery<TodoItem> query = todoTable.Take(3);
List<TodoItem> items = await query.ToListAsync();
```

The following revised query skips the first three results and returns the next three results. This query produces
the second "page" of data, where the page size is three items.

```
// Define a filtered query that skips the top 3 items and returns the next 3 items.
MobileServiceTableQuery<TodoItem> query = todoTable.Skip(3).Take(3);
List<TodoItem> items = await query.ToListAsync();
```

The [IncludeTotalCount] method requests the total count for *all* the records that would have been returned,
ignoring any paging/limit clause specified:

```
query = query.IncludeTotalCount();
```

In a real world app, you can use queries similar to the preceding example with a pager control or comparable UI to
navigate between pages.

> [!NOTE]
> To override the 50-row limit in a Mobile App backend, you must also apply the [EnableQueryAttribute]
> to the public GET method and specify the paging behavior. When applied to the method, the following sets the
> maximum returned rows to 1000:
>
> `[EnableQuery(MaxTop=1000)]`


### <a name="selecting"></a>How to: Select specific columns
You can specify which set of properties to include in the results by adding a [Select] clause to your query. For
example, the following code shows how to select just one field and also how to select and format multiple fields:

```
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
```

All the functions described so far are additive, so we can keep chaining them. Each chained call affects more of
the query. One more example:

```
MobileServiceTableQuery<TodoItem> query = todoTable
                .Where(todoItem => todoItem.Complete == false)
                .Select(todoItem => todoItem.Text)
                .Skip(3).
                .Take(3);
List<string> items = await query.ToListAsync();
```

### <a name="lookingup"></a>How to: Look up data by ID
The [LookupAsync] function can be used to look up objects from the database with a particular ID.

```
// This query filters out the item with the ID of 37BBF396-11F0-4B39-85C8-B319C729AF6D
TodoItem item = await todoTable.LookupAsync("37BBF396-11F0-4B39-85C8-B319C729AF6D");
```

### <a name="untypedqueries"></a>How to: Execute untyped queries
When executing a query using an untyped table object, you must explicitly specify the OData query string by
calling [ReadAsync], as in the following example:

```
// Lookup untyped data using OData
JToken untypedItems = await untypedTodoTable.ReadAsync("$filter=complete eq 0&$orderby=text");
```

You get back JSON values that you can use like a property bag. For more information on JToken and Newtonsoft
Json.NET, see the [Json.NET] site.

### <a name="inserting"></a>How to: Insert data into a Mobile App backend
All client types must contain a member named **Id**, which is by default a string. This **Id** is required to
perform CRUD operations and for offline sync. The following code illustrates how to use the [InsertAsync] method
to insert new rows into a table. The parameter contains the data to be inserted as a .NET object.

```
await todoTable.InsertAsync(todoItem);
```

If a unique custom ID value is not included in the `todoItem` during an insert, a GUID is generated by the server.
You can retrieve the generated Id by inspecting the object after the call returns.

To insert untyped data, you may take advantage of Json.NET:

```
JObject jo = new JObject();
jo.Add("Text", "Hello World");
jo.Add("Complete", false);
var inserted = await table.InsertAsync(jo);
```

Here is an example using an email address as a unique string id:

```
JObject jo = new JObject();
jo.Add("id", "myemail@emaildomain.com");
jo.Add("Text", "Hello World");
jo.Add("Complete", false);
var inserted = await table.InsertAsync(jo);
```

### Working with ID values
Mobile Apps supports unique custom string values for the table's **id** column. A string value allows applications
to use custom values such as email addresses or user names for the ID.  String IDs provide you with the following
benefits:

* IDs are generated without making a round trip to the database.
* Records are easier to merge from different tables or databases.
* IDs values can integrate better with an application's logic.

When a string ID value is not set on an inserted record, the Mobile App backend generates a unique value for the
ID. You can use the [Guid.NewGuid] method to generate your own ID values, either on the client or in the backend.

```
JObject jo = new JObject();
jo.Add("id", Guid.NewGuid().ToString("N"));
```

### <a name="modifying"></a>How to: Modify data in a Mobile App backend
The following code illustrates how to use the [UpdateAsync] method to update an existing record with the same ID
with new information. The parameter contains the data to be updated as a .NET object.

```
await todoTable.UpdateAsync(todoItem);
```

To update untyped data, you may take advantage of [Json.NET] as follows:

```
JObject jo = new JObject();
jo.Add("id", "37BBF396-11F0-4B39-85C8-B319C729AF6D");
jo.Add("Text", "Hello World");
jo.Add("Complete", false);
var inserted = await table.UpdateAsync(jo);
```

An `id` field must be specified when making an update. The backend uses the `id` field to identify which
row to update. The `id` field can be obtained from the result of the `InsertAsync` call. An `ArgumentException` is
raised if you try to update an item without providing the `id` value.

### <a name="deleting"></a>How to: Delete data in a Mobile App backend
The following code illustrates how to use the [DeleteAsync] method to delete an existing instance. The instance
is identified by the `id` field set on the `todoItem`.

```
await todoTable.DeleteAsync(todoItem);
```

To delete untyped data, you may take advantage of Json.NET as follows:

```
JObject jo = new JObject();
jo.Add("id", "37BBF396-11F0-4B39-85C8-B319C729AF6D");
await table.DeleteAsync(jo);
```

When you make a delete request, an ID must be specified. Other properties are not passed to the service or
are ignored at the service. The result of a `DeleteAsync` call is usually `null`. The ID to pass in can be
obtained from the result of the `InsertAsync` call. A `MobileServiceInvalidOperationException` is thrown when
you try to delete an item without specifying the `id` field.

### <a name="optimisticconcurrency"></a>How to: Use Optimistic Concurrency for conflict resolution
Two or more clients may write changes to the same item at the same time. Without conflict detection, the last
write would overwrite any previous updates. **Optimistic concurrency control** assumes that each transaction
can commit and therefore does not use any resource locking.  Before committing a transaction, optimistic
concurrency control verifies that no other transaction has modified the data. If the data has been modified,
the committing transaction is rolled back.

Mobile Apps supports optimistic concurrency control by tracking changes to each item using the `version` system
property column that is defined for each table in your Mobile App backend. Each time a record is updated, Mobile
Apps sets the `version` property for that record to a new value. During each update request, the `version` property
of the record included with the request is compared to the same property for the record on the server. If the
version passed with the request does not match the backend, then the client library raises a
`MobileServicePreconditionFailedException<T>` exception. The type included with the exception is the record from
the backend containing the servers version of the record. The application can then use this information to decide
whether to execute the update request again with the correct `version` value from the backend to commit changes.

Define a column on the table class for the `version` system property to enable optimistic concurrency. For example:

```
public class TodoItem
{
    public string Id { get; set; }

    [JsonProperty(PropertyName = "text")]
    public string Text { get; set; }

    [JsonProperty(PropertyName = "complete")]
    public bool Complete { get; set; }

    // *** Enable Optimistic Concurrency *** //
    [JsonProperty(PropertyName = "version")]
    public string Version { set; get; }
}
```

Applications using untyped tables enable optimistic concurrency by setting the `Version` flag on the
`SystemProperties` of the table as follows.

```
//Enable optimistic concurrency by retrieving version
todoTable.SystemProperties |= MobileServiceSystemProperties.Version;
```

In addition to enabling optimistic concurrency, you must also catch the `MobileServicePreconditionFailedException<T>`
exception in your code when calling [UpdateAsync].  Resolve the conflict by applying the correct `version` to the
updated record and call [UpdateAsync] with the resolved record. The following code shows how to resolve a write
conflict once detected:

```
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
    //Ask user to choose the resolution between versions
    MessageDialog msgDialog = new MessageDialog(
        String.Format("Server Text: \"{0}\" \nLocal Text: \"{1}\"\n",
        serverItem.Text, localItem.Text),
        "CONFLICT DETECTED - Select a resolution:");

    UICommand localBtn = new UICommand("Commit Local Text");
    UICommand ServerBtn = new UICommand("Leave Server Text");
    msgDialog.Commands.Add(localBtn);
    msgDialog.Commands.Add(ServerBtn);

    localBtn.Invoked = async (IUICommand command) =>
    {
        // To resolve the conflict, update the version of the item being committed. Otherwise, you will keep
        // catching a MobileServicePreConditionFailedException.
        localItem.Version = serverItem.Version;

        // Updating recursively here just in case another change happened while the user was making a decision
        UpdateToDoItem(localItem);
    };

    ServerBtn.Invoked = async (IUICommand command) =>
    {
        RefreshTodoItems();
    };

    await msgDialog.ShowAsync();
}
```

For more information, see the [Offline Data Sync in Azure Mobile Apps] topic.

### <a name="binding"></a>How to: Bind Mobile Apps data to a Windows user interface
This section shows how to display returned data objects using UI elements in a Windows app.  The
following example code binds to the source of the list with a query for incomplete items. The
[MobileServiceCollection] creates a Mobile Apps-aware binding collection.

```
// This query filters out completed TodoItems.
MobileServiceCollection<TodoItem, TodoItem> items = await todoTable
    .Where(todoItem => todoItem.Complete == false)
    .ToCollectionAsync();

// itemsControl is an IEnumerable that could be bound to a UI list control
IEnumerable itemsControl  = items;

// Bind this to a ListBox
ListBox lb = new ListBox();
lb.ItemsSource = items;
```

Some controls in the managed runtime support an interface called [ISupportIncrementalLoading]. This interface
allows controls to request extra data when the user scrolls. There is built-in support for this interface
for universal Windows apps via [MobileServiceIncrementalLoadingCollection], which automatically handles the
calls from the controls. Use `MobileServiceIncrementalLoadingCollection` in Windows apps as follows:

```
MobileServiceIncrementalLoadingCollection<TodoItem,TodoItem> items;
items = todoTable.Where(todoItem => todoItem.Complete == false).ToIncrementalLoadingCollection();

ListBox lb = new ListBox();
lb.ItemsSource = items;
```

To use the new collection on Windows Phone 8 and "Silverlight" apps, use the `ToCollection` extension methods
on `IMobileServiceTableQuery<T>` and `IMobileServiceTable<T>`. To load data, call `LoadMoreItemsAsync()`.

```
MobileServiceCollection<TodoItem, TodoItem> items = todoTable.Where(todoItem => todoItem.Complete==false).ToCollection();
await items.LoadMoreItemsAsync();
```

When you use the collection created by calling `ToCollectionAsync` or `ToCollection`, you get a collection that
can be bound to UI controls.  This collection is paging-aware.  Since the collection is loading data from the
network, loading sometimes fails. To handle such failures, override the `OnException` method on
`MobileServiceIncrementalLoadingCollection` to handle exceptions resulting from calls to `LoadMoreItemsAsync`.

Consider if your table has many fields but you only want to display some of them in your control. You
may use the guidance in the preceding section "[Select specific columns](#selecting)" to select specific columns
to display in the UI.

### <a name="pagesize"></a>Change the Page size
Azure Mobile Apps returns a maximum of 50 items per request by default.  You can change the paging size by increasing the maximum page size on both the client and server.  To increase the requested page size, specify `PullOptions` when using `PullAsync()`:

```
PullOptions pullOptions = new PullOptions
    {
        MaxPageSize = 100
    };
```

Assuming you have made the `PageSize` equal to or greater than 100 within the server, a request returns up to
100 items.

## <a name="#offlinesync"></a>Work with Offline Tables
Offline tables use a local SQLite store to store data for use when offline.  All table operations are done against
the local SQLite store instead of the remote server store.  To create an offline table, first prepare your project:

1. In Visual Studio, right-click the solution > **Manage NuGet Packages for Solution...**, then search for and install the
   **Microsoft.Azure.Mobile.Client.SQLiteStore** NuGet package for all projects in the solution.
2. (Optional) To support Windows devices, install one of the following SQLite runtime packages:

   * **Windows 8.1 Runtime:** Install [SQLite for Windows 8.1][3].
   * **Windows Phone 8.1:** Install [SQLite for Windows Phone 8.1][4].
   * **Universal Windows Platform** Install [SQLite for the Universal Windows][5].
3. (Optional). For Windows devices, click **References** > **Add Reference...**, expand the **Windows** folder > **Extensions**,
    then enable the appropriate **SQLite for Windows** SDK along with the **Visual C++ 2013 Runtime for Windows** SDK.
    The SQLite SDK names vary slightly with each Windows platform.

Before a table reference can be created, the local store must be prepared:

```
var store = new MobileServiceSQLiteStore(Constants.OfflineDbPath);
store.DefineTable<TodoItem>();

//Initializes the SyncContext using the default IMobileServiceSyncHandler.
await this.client.SyncContext.InitializeAsync(store);
```

Store initialization is normally done immediately after the client is created.  The **OfflineDbPath** should be a filename
suitable for use on all platforms that you support.  If the path is a fully qualified path (that is, it starts with
a slash), then that path is used.  If the path is not fully qualified, the file is placed in a platform-specific
location.

* For iOS and Android devices, the default path is the "Personal Files" folder.
* For Windows devices, the default path is the application-specific "AppData" folder.

A table reference can be obtained using the `GetSyncTable<>` method:

```
var table = client.GetSyncTable<TodoItem>();
```

You do not need to authenticate to use an offline table.  You only need to authenticate when you are communicating
with the backend service.

### <a name="syncoffline"></a>Syncing an Offline Table
Offline tables are not synchronized with the backend by default.  Synchronization is split into two pieces.  You
can push changes separately from downloading new items.  Here is a typical sync method:

```
public async Task SyncAsync()
{
    ReadOnlyCollection<MobileServiceTableOperationError> syncErrors = null;

    try
    {
        await this.client.SyncContext.PushAsync();

        await this.todoTable.PullAsync(
            //The first parameter is a query name that is used internally by the client SDK to implement incremental sync.
            //Use a different query name for each unique query in your program
            "allTodoItems",
            this.todoTable.CreateQuery());
    }
    catch (MobileServicePushFailedException exc)
    {
        if (exc.PushResult != null)
        {
            syncErrors = exc.PushResult.Errors;
        }
    }

    // Simple error/conflict handling. A real application would handle the various errors like network conditions,
    // server conflicts and others via the IMobileServiceSyncHandler.
    if (syncErrors != null)
    {
        foreach (var error in syncErrors)
        {
            if (error.OperationKind == MobileServiceTableOperationKind.Update && error.Result != null)
            {
                //Update failed, reverting to server's copy.
                await error.CancelAndUpdateItemAsync(error.Result);
            }
            else
            {
                // Discard local change.
                await error.CancelAndDiscardItemAsync();
            }

            Debug.WriteLine(@"Error executing sync operation. Item: {0} ({1}). Operation discarded.", error.TableName, error.Item["id"]);
        }
    }
}
```

If the first argument to `PullAsync` is null, then incremental sync is not used.  Each sync operation retrieves all records.

The SDK performs an implicit `PushAsync()` before pulling records.

Conflict handling happens on a `PullAsync()` method.  You can deal with conflicts in the same way as online tables.  The conflict
is produced when `PullAsync()` is called instead of during the insert, update, or delete. If multiple conflicts happen, they are
bundled into a single MobileServicePushFailedException.  Handle each failure separately.

## <a name="#customapi"></a>Work with a custom API
A custom API enables you to define custom endpoints that expose server functionality that does not map to an
insert, update, delete, or read operation. By using a custom API, you can have more control over messaging,
including reading and setting HTTP message headers and defining a message body format other than JSON.

You call a custom API by calling one of the [InvokeApiAsync] methods on the client. For example, the following
line of code sends a POST request to the **completeAll** API on the backend:

```
var result = await client.InvokeApiAsync<MarkAllResult>("completeAll", System.Net.Http.HttpMethod.Post, null);
```

This form is a typed method call and requires that the **MarkAllResult** return type is defined. Both
typed and untyped methods are supported.

The InvokeApiAsync() method prepends '/api/' to the API that you wish to call unless the API starts with a '/'.
For example:

* `InvokeApiAsync("completeAll",...)` calls /api/completeAll on the backend
* `InvokeApiAsync("/.auth/me",...)` calls /.auth/me on the backend

You can use InvokeApiAsync to call any WebAPI, including those WebAPIs that are not defined with Azure Mobile Apps.  When
you use InvokeApiAsync(), the appropriate headers, including authentication headers, are sent with the request.

## <a name="authentication"></a>Authenticate users
Mobile Apps supports authenticating and authorizing app users using various external identity providers: Facebook,
Google, Microsoft Account, Twitter, and Azure Active Directory. You can set permissions on tables to restrict
access for specific operations to only authenticated users. You can also use the identity of authenticated users
to implement authorization rules in server scripts. For more information, see the tutorial
[Add authentication to your app].

Two authentication flows are supported: *client-managed* and *server-managed* flow. The server-managed flow provides
the simplest authentication experience, as it relies on the provider's web authentication interface. The client-managed
flow allows for deeper integration with device-specific capabilities as it relies on provider-specific
device-specific SDKs.

> [!NOTE]
> We recommend using a client-managed flow in your production apps.

To set up authentication, you must register your app with one or more identity providers.  The identity provider
generates a client ID and a client secret for your app.  These values are then set in your backend to enable Azure
App Service authentication/authorization.  For more information, follow the detailed instructions in the
tutorial [Add authentication to your app].

The following topics are covered in this section:

* [Client-managed authentication](#clientflow)
* [Server-managed authentication](#serverflow)
* [Caching the authentication token](#caching)

### <a name="clientflow"></a>Client-managed authentication
Your app can independently contact the identity provider and then provide the returned token during login with
your backend. This client flow enables you to provide a single sign-on experience for users or to retrieve
additional user data from the identity provider. Client flow authentication is preferred to using a server flow
as the identity provider SDK provides a more native UX feel and allows for additional customization.

Examples are provided for the following client-flow authentication patterns:

* [Active Directory Authentication Library](#adal)
* [Facebook or Google](#client-facebook)
* [Live SDK](#client-livesdk)

#### <a name="adal"></a>Authenticate users with the Active Directory Authentication Library
You can use the Active Directory Authentication Library (ADAL) to initiate user authentication from the client
using Azure Active Directory authentication.

1. Configure your mobile app backend for AAD sign-on by following the [How to configure App Service for Active
   Directory login] tutorial. Make sure to complete the optional step of registering a native client application.
2. In Visual Studio or Xamarin Studio, open your project and add a reference to the
   `Microsoft.IdentityModel.CLients.ActiveDirectory` NuGet package. When searching, include pre-release versions.
3. Add the following code to your application, according to the platform you are using. In each, make the following
   replacements:

   * Replace **INSERT-AUTHORITY-HERE** with the name of the tenant in which you provisioned your application. The
     format should be https://login.microsoftonline.com/contoso.onmicrosoft.com. This value can be copied from the Domain
     tab in your Azure Active Directory in the [Azure portal].
   * Replace **INSERT-RESOURCE-ID-HERE** with the client ID for your mobile app backend. You can obtain the client
     ID from the **Advanced** tab under **Azure Active Directory Settings** in the portal.
   * Replace **INSERT-CLIENT-ID-HERE** with the client ID you copied from the native client application.
   * Replace **INSERT-REDIRECT-URI-HERE** with your site's */.auth/login/done* endpoint, using the HTTPS
     scheme. This value should be similar to *https://contoso.azurewebsites.net/.auth/login/done*.

     The code needed for each platform follows:

     **Windows:**

    ```
    private MobileServiceUser user;
    private async Task AuthenticateAsync()
    {

        string authority = "INSERT-AUTHORITY-HERE";
        string resourceId = "INSERT-RESOURCE-ID-HERE";
        string clientId = "INSERT-CLIENT-ID-HERE";
        string redirectUri = "INSERT-REDIRECT-URI-HERE";
        while (user == null)
        {
            string message;
            try
            {
                AuthenticationContext ac = new AuthenticationContext(authority);
                AuthenticationResult ar = await ac.AcquireTokenAsync(resourceId, clientId,
                    new Uri(redirectUri), new PlatformParameters(PromptBehavior.Auto, false) );
                JObject payload = new JObject();
                payload["access_token"] = ar.AccessToken;
                user = await App.MobileService.LoginAsync(
                    MobileServiceAuthenticationProvider.WindowsAzureActiveDirectory, payload);
                message = string.Format("You are now logged in - {0}", user.UserId);
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
    ```

     **Xamarin.iOS**

    ```
    private MobileServiceUser user;
    private async Task AuthenticateAsync(UIViewController view)
    {

        string authority = "INSERT-AUTHORITY-HERE";
        string resourceId = "INSERT-RESOURCE-ID-HERE";
        string clientId = "INSERT-CLIENT-ID-HERE";
        string redirectUri = "INSERT-REDIRECT-URI-HERE";
        try
        {
            AuthenticationContext ac = new AuthenticationContext(authority);
            AuthenticationResult ar = await ac.AcquireTokenAsync(resourceId, clientId,
                new Uri(redirectUri), new PlatformParameters(view));
            JObject payload = new JObject();
            payload["access_token"] = ar.AccessToken;
            user = await client.LoginAsync(
                MobileServiceAuthenticationProvider.WindowsAzureActiveDirectory, payload);
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine(@"ERROR - AUTHENTICATION FAILED {0}", ex.Message);
        }
    }
    ```

     **Xamarin.Android**

    ```
    private MobileServiceUser user;
    private async Task AuthenticateAsync()
    {

        string authority = "INSERT-AUTHORITY-HERE";
        string resourceId = "INSERT-RESOURCE-ID-HERE";
        string clientId = "INSERT-CLIENT-ID-HERE";
        string redirectUri = "INSERT-REDIRECT-URI-HERE";
        try
        {
            AuthenticationContext ac = new AuthenticationContext(authority);
            AuthenticationResult ar = await ac.AcquireTokenAsync(resourceId, clientId,
                new Uri(redirectUri), new PlatformParameters(this));
            JObject payload = new JObject();
            payload["access_token"] = ar.AccessToken;
            user = await client.LoginAsync(
                MobileServiceAuthenticationProvider.WindowsAzureActiveDirectory, payload);
        }
        catch (Exception ex)
        {
            AlertDialog.Builder builder = new AlertDialog.Builder(this);
            builder.SetMessage(ex.Message);
            builder.SetTitle("You must log in. Login Required");
            builder.Create().Show();
        }
    }
    protected override void OnActivityResult(int requestCode, Result resultCode, Intent data)
    {

        base.OnActivityResult(requestCode, resultCode, data);
        AuthenticationAgentContinuationHelper.SetAuthenticationAgentContinuationEventArgs(requestCode, resultCode, data);
    }
    ```

#### <a name="client-facebook"></a>Single Sign-On using a token from Facebook or Google
You can use the client flow as shown in this snippet for Facebook or Google.

```
var token = new JObject();
// Replace access_token_value with actual value of your access token obtained
// using the Facebook or Google SDK.
token.Add("access_token", "access_token_value");

private MobileServiceUser user;
private async Task AuthenticateAsync()
{
    while (user == null)
    {
        string message;
        try
        {
            // Change MobileServiceAuthenticationProvider.Facebook
            // to MobileServiceAuthenticationProvider.Google if using Google auth.
            user = await client.LoginAsync(MobileServiceAuthenticationProvider.Facebook, token);
            message = string.Format("You are now logged in - {0}", user.UserId);
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
```

#### <a name="client-livesdk"></a>Single Sign On using Microsoft Account with the Live SDK
To authenticate users, you must register your app at the Microsoft account Developer Center. Configure the
registration details on your Mobile App backend. To create a Microsoft account registration and
connect it to your Mobile App backend, complete the steps in
[Register your app to use a Microsoft account login]. If you have both Microsoft Store and Windows Phone
8/Silverlight versions of your app, register the Microsoft Store version first.

The following code authenticates using Live SDK and uses the returned token to sign in to your Mobile
App backend.

```
private LiveConnectSession session;
    //private static string clientId = "<microsoft-account-client-id>";
private async System.Threading.Tasks.Task AuthenticateAsync()
{

    // Get the URL the Mobile App backend.
    var serviceUrl = App.MobileService.ApplicationUri.AbsoluteUri;

    // Create the authentication client for Microsoft Store using the service URL.
    LiveAuthClient liveIdClient = new LiveAuthClient(serviceUrl);
    //// Create the authentication client for Windows Phone using the client ID of the registration.
    //LiveAuthClient liveIdClient = new LiveAuthClient(clientId);

    while (session == null)
    {
        // Request the authentication token from the Live authentication service.
        // The wl.basic scope should always be requested.  Other scopes can be added
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
```

For more information, see the [Windows Live SDK] documentation.

### <a name="serverflow"></a>Server-managed authentication
Once you have registered your identity provider, call the [LoginAsync] method on the [MobileServiceClient] with
the [MobileServiceAuthenticationProvider] value of your provider. For example, the following code initiates a
server flow sign-in by using Facebook.

```
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
```

If you are using an identity provider other than Facebook, change the value of [MobileServiceAuthenticationProvider]
to the value for your provider.

In a server flow, Azure App Service manages the OAuth authentication flow by displaying the sign-in page of
the selected provider.  Once the identity provider returns, Azure App Service generates an App Service
authentication token. The [LoginAsync] method returns a [MobileServiceUser], which provides both the [UserId]
of the authenticated user and the [MobileServiceAuthenticationToken], as a JSON web token (JWT). This token can be
cached and reused until it expires. For more information, see [Caching the authentication token](#caching).

### <a name="caching"></a>Caching the authentication token
In some cases, the call to the login method can be avoided after the first successful authentication by storing
the authentication token from the provider.  Microsoft Store and UWP apps can use [PasswordVault] to cache the
current authentication token after a successful sign-in, as follows:

```
await client.LoginAsync(MobileServiceAuthenticationProvider.Facebook);

PasswordVault vault = new PasswordVault();
vault.Add(new PasswordCredential("Facebook", client.currentUser.UserId,
    client.currentUser.MobileServiceAuthenticationToken));
```

The UserId value is stored as the UserName of the credential and the token is the stored as the Password. On
subsequent start-ups, you can check the **PasswordVault** for cached credentials. The following example uses
cached credentials when they are found, and otherwise attempts to authenticate again with the backend:

```
// Try to retrieve stored credentials.
var creds = vault.FindAllByResource("Facebook").FirstOrDefault();
if (creds != null)
{
    // Create the current user from the stored credentials.
    client.currentUser = new MobileServiceUser(creds.UserName);
    client.currentUser.MobileServiceAuthenticationToken =
        vault.Retrieve("Facebook", creds.UserName).Password;
}
else
{
    // Regular login flow and cache the token as shown above.
}
```

When you sign out a user, you must also remove the stored credential, as follows:

```
client.Logout();
vault.Remove(vault.Retrieve("Facebook", client.currentUser.UserId));
```

Xamarin    apps use the [Xamarin.Auth] APIs to securely store credentials in an **Account** object. For an example
of using these APIs, see the [AuthStore.cs] code file in the [ContosoMoments photo sharing sample](https://github.com/azure-appservice-samples/ContosoMoments).

When you use client-managed authentication, you can also cache the access token obtained from your provider such
as Facebook or Twitter. This token can be supplied to request a new authentication token from the backend, as
follows:

```
var token = new JObject();
// Replace <your_access_token_value> with actual value of your access token
token.Add("access_token", "<your_access_token_value>");

// Authenticate using the access token.
await client.LoginAsync(MobileServiceAuthenticationProvider.Facebook, token);
```

## <a name="pushnotifications"></a>Push Notifications
The following topics cover Push Notifications:

* [Register for Push Notifications](#register-for-push)
* [Obtain a Microsoft Store package SID](#package-sid)
* [Register with Cross-platform templates](#register-xplat)

### <a name="register-for-push"></a>How to: Register for Push Notifications
The Mobile Apps client enables you to register for push notifications with Azure Notification Hubs. When
registering, you obtain a handle that you obtain from the platform-specific Push Notification Service (PNS). You
then provide this value along with any tags when you create the registration. The following code registers your
Windows app for push notifications with the Windows Notification Service (WNS):

```
private async void InitNotificationsAsync()
{
    // Request a push notification channel.
    var channel = await PushNotificationChannelManager.CreatePushNotificationChannelForApplicationAsync();

    // Register for notifications using the new channel.
    await MobileService.GetPush().RegisterNativeAsync(channel.Uri, null);
}
```

If you are pushing to WNS, then you MUST [obtain a Microsoft Store package SID](#package-sid).  For more information
on Windows apps, including how to register for template registrations, see [Add push notifications to your app].

Requesting tags from the client is not supported.  Tag Requests are silently dropped from registration.
If you wish to register your device with tags, create a Custom API that uses the Notification Hubs API to perform
the registration on your behalf.  [Call the Custom API](#customapi) instead of the `RegisterNativeAsync()` method.

### <a name="package-sid"></a>How to: Obtain a Microsoft Store package SID
A package SID is needed for enabling push notifications in Microsoft Store apps.  To receive a package SID, register your
application with the Microsoft Store.

To obtain this value:

1. In Visual Studio Solution Explorer, right-click the Microsoft Store app project, click **Store** > **Associate App with the Store...**.
2. In the wizard, click **Next**, sign in with your Microsoft account, type a name for your app in **Reserve a new app name**, then click **Reserve**.
3. After the app registration is successfully created, select the app name, click **Next**, and then click **Associate**.
4. Log in to the [Windows Dev Center] using your Microsoft Account. Under **My apps**, click the app registration you created.
5. Click **App management** > **App identity**, and then scroll down to find your **Package SID**.

Many uses of the package SID treat it as a URI, in which case you need to use *ms-app://* as the scheme. Make
note of the version of your package SID formed by concatenating this value as a prefix.

Xamarin apps require some additional code to be able to register an app running on the iOS or Android
platforms. For more information, see the topic for your platform:

* [Xamarin.Android](app-service-mobile-xamarin-android-get-started-push.md#add-push)
* [Xamarin.iOS](app-service-mobile-xamarin-ios-get-started-push.md#add-push-notifications-to-your-app)

### <a name="register-xplat"></a>How to: Register push templates to send cross-platform notifications
To register templates, use the `RegisterAsync()` method with the templates, as follows:

```
JObject templates = myTemplates();
MobileService.GetPush().RegisterAsync(channel.Uri, templates);
```

Your templates should be `JObject` types and can contain multiple templates in the following JSON format:

```
public JObject myTemplates()
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
```

The method **RegisterAsync()** also accepts Secondary Tiles:

```
MobileService.GetPush().RegisterAsync(string channelUri, JObject templates, JObject secondaryTiles);
```

All tags are stripped away during registration for security. To add tags to installations or templates within
installations, see [Work with the .NET backend server SDK for Azure Mobile Apps].

To send notifications utilizing these registered templates, refer to the [Notification Hubs APIs].

## <a name="misc"></a>Miscellaneous Topics
### <a name="errors"></a>How to: Handle errors
When an error occurs in the backend, the client SDK raises a `MobileServiceInvalidOperationException`.  The
following example shows how to handle an exception that is returned by the backend:

```
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
```

Another example of dealing with error conditions can be found in the [Mobile Apps Files Sample]. The
[LoggingHandler] example provides a logging delegate handler to log the requests being made
to the backend.

### <a name="headers"></a>How to: Customize request headers
To support your specific app scenario, you might need to customize communication with the Mobile App backend. For
example, you may want to add a custom header to every outgoing request or even change responses status codes. You
can use a custom [DelegatingHandler], as in the following example:

```
public async Task CallClientWithHandler()
{
    MobileServiceClient client = new MobileServiceClient("AppUrl", new MyHandler());
    IMobileServiceTable<TodoItem> todoTable = client.GetTable<TodoItem>();
    var newItem = new TodoItem { Text = "Hello world", Complete = false };
    await todoTable.InsertAsync(newItem);
}

public class MyHandler : DelegatingHandler
{
    protected override async Task<HttpResponseMessage>
        SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        // Change the request-side here based on the HttpRequestMessage
        request.Headers.Add("x-my-header", "my value");

        // Do the request
        var response = await base.SendAsync(request, cancellationToken);

        // Change the response-side here based on the HttpResponseMessage

        // Return the modified response
        return response;
    }
}
```


<!-- Anchors. -->


<!-- Images. -->

<!-- URLs. -->
[1]: app-service-mobile-windows-store-dotnet-get-started.md
[2]: app-service-mobile-dotnet-backend-how-to-use-server-sdk.md
[3]: app-service-mobile-node-backend-how-to-use-server-sdk.md
[4]: https://msdn.microsoft.com/library/azure/mt419521(v=azure.10).aspx
[5]: https://github.com/Azure-Samples
[6]: http://www.newtonsoft.com/json/help/html/Properties_T_Newtonsoft_Json_JsonPropertyAttribute.htm
[7]: app-service-mobile-dotnet-backend-how-to-use-server-sdk.md#define-table-controller
[8]: app-service-mobile-node-backend-how-to-use-server-sdk.md#TableOperations
[9]: https://www.nuget.org/packages/Microsoft.Azure.Mobile.Client/
[10]: http://www.symbolsource.org/
[11]: http://www.symbolsource.org/Public/Wiki/Using
[12]: https://msdn.microsoft.com/library/azure/microsoft.windowsazure.mobileservices.mobileserviceclient(v=azure.10).aspx

[Add authentication to your app]: app-service-mobile-windows-store-dotnet-get-started-users.md
[Offline Data Sync in Azure Mobile Apps]: app-service-mobile-offline-data-sync.md
[Add push notifications to your app]: app-service-mobile-windows-store-dotnet-get-started-push.md
[Register your app to use a Microsoft account login]: ../app-service/app-service-mobile-how-to-configure-microsoft-authentication.md
[How to configure App Service for Active Directory login]: ../app-service/app-service-mobile-how-to-configure-active-directory-authentication.md

<!-- Microsoft URLs. -->
[MobileServiceCollection]: https://msdn.microsoft.com/library/azure/dn250636(v=azure.10).aspx
[MobileServiceIncrementalLoadingCollection]: https://msdn.microsoft.com/library/azure/dn268408(v=azure.10).aspx
[MobileServiceAuthenticationProvider]: http://msdn.microsoft.com/library/windowsazure/microsoft.windowsazure.mobileservices.mobileserviceauthenticationprovider(v=azure.10).aspx
[MobileServiceUser]: http://msdn.microsoft.com/library/windowsazure/microsoft.windowsazure.mobileservices.mobileserviceuser(v=azure.10).aspx
[MobileServiceAuthenticationToken]: http://msdn.microsoft.com/library/windowsazure/microsoft.windowsazure.mobileservices.mobileserviceuser.mobileserviceauthenticationtoken(v=azure.10).aspx
[GetTable]: https://msdn.microsoft.com/library/azure/jj554275(v=azure.10).aspx
[creates a reference to an untyped table]: https://msdn.microsoft.com/library/azure/jj554278(v=azure.10).aspx
[DeleteAsync]: https://msdn.microsoft.com/library/azure/dn296407(v=azure.10).aspx
[IncludeTotalCount]: https://msdn.microsoft.com/library/azure/dn250560(v=azure.10).aspx
[InsertAsync]: https://msdn.microsoft.com/library/azure/dn296400(v=azure.10).aspx
[InvokeApiAsync]: https://msdn.microsoft.com/library/azure/dn268343(v=azure.10).aspx
[LoginAsync]: https://msdn.microsoft.com/library/azure/dn296411(v=azure.10).aspx
[LookupAsync]: https://msdn.microsoft.com/library/azure/jj871654(v=azure.10).aspx
[OrderBy]: https://msdn.microsoft.com/library/azure/dn250572(v=azure.10).aspx
[OrderByDescending]: https://msdn.microsoft.com/library/azure/dn250568(v=azure.10).aspx
[ReadAsync]: https://msdn.microsoft.com/library/azure/mt691741(v=azure.10).aspx
[Take]: https://msdn.microsoft.com/library/azure/dn250574(v=azure.10).aspx
[Select]: https://msdn.microsoft.com/library/azure/dn250569(v=azure.10).aspx
[Skip]: https://msdn.microsoft.com/library/azure/dn250573(v=azure.10).aspx
[UpdateAsync]: https://msdn.microsoft.com/library/azure/dn250536.(v=azure.10)aspx
[UserID]: http://msdn.microsoft.com/library/windowsazure/microsoft.windowsazure.mobileservices.mobileserviceuser.userid(v=azure.10).aspx
[Where]: https://msdn.microsoft.com/library/azure/dn250579(v=azure.10).aspx
[Azure portal]: https://portal.azure.com/
[EnableQueryAttribute]: https://msdn.microsoft.com/library/system.web.http.odata.enablequeryattribute.aspx
[Guid.NewGuid]: https://msdn.microsoft.com/library/system.guid.newguid(v=vs.110).aspx
[ISupportIncrementalLoading]: http://msdn.microsoft.com/library/windows/apps/Hh701916.aspx
[Windows Dev Center]: https://dev.windows.com/overview
[DelegatingHandler]: https://msdn.microsoft.com/library/system.net.http.delegatinghandler(v=vs.110).aspx
[Windows Live SDK]: https://msdn.microsoft.com/library/bb404787.aspx
[PasswordVault]: http://msdn.microsoft.com/library/windows/apps/windows.security.credentials.passwordvault.aspx
[ProtectedData]: http://msdn.microsoft.com/library/system.security.cryptography.protecteddata%28VS.95%29.aspx
[Notification Hubs APIs]: https://msdn.microsoft.com/library/azure/dn495101.aspx
[Mobile Apps Files Sample]: https://github.com/Azure-Samples/app-service-mobile-dotnet-todo-list-files
[LoggingHandler]: https://github.com/Azure-Samples/app-service-mobile-dotnet-todo-list-files/blob/master/src/client/MobileAppsFilesSample/Helpers/LoggingHandler.cs#L63

<!-- External URLs -->
[OData v3 Documentation]: http://www.odata.org/documentation/odata-version-3-0/
[Fiddler]: http://www.telerik.com/fiddler
[Json.NET]: http://www.newtonsoft.com/json
[Xamarin.Auth]: https://components.xamarin.com/view/xamarin.auth/
[AuthStore.cs]: https://github.com/azure-appservice-samples/ContosoMoments
[ContosoMoments photo sharing sample]: https://github.com/azure-appservice-samples/ContosoMoments
