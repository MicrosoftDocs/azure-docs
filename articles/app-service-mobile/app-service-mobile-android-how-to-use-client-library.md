<properties
	pageTitle="How to use the Android Mobile Apps Client Library"
	description="How to use Android client SDK for Azure Mobile Apps."
	services="app-service\mobile"
	documentationCenter="android"
	authors="RickSaling"
	manager="erikre"
	editor=""/>

<tags
	ms.service="app-service-mobile"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-android"
	ms.devlang="java"
	ms.topic="article"
	ms.date="07/21/2016"
	ms.author="ricksal"/>


# How to use the Android client library for Mobile Apps

[AZURE.INCLUDE [app-service-mobile-selector-client-library](../../includes/app-service-mobile-selector-client-library.md)]

This guide shows you how to use the Android client SDK for Mobile Apps to implement common scenarios, such as querying
for data (inserting, updating, and deleting), authenticating users, handling errors, and customizing the client. It also
does a deep-dive into common client code used in most mobile apps.

This guide focuses on the client-side Android SDK.  To learn more about the server-side SDKs for Mobile Apps, see
[Work with .NET backend SDK](app-service-mobile-dotnet-backend-how-to-use-server-sdk.md) or
[How to use the Node.js backend SDK](app-service-mobile-node-backend-how-to-use-server-sdk.md).

## Reference Documentation

You can find the Javadocs API reference for the Android client library [on GitHub](http://azure.github.io/azure-mobile-apps-android-client/).

## Setup and Prerequisites

The Mobile Services SDK for Android supports Android version 2.2 or later, but we recommend building against version 4.2 or later.

Complete the [Mobile Apps quickstart](app-service-mobile-android-get-started.md) tutorial, which will ensure that you have
installed Android Studio; it will help you configure your account and create your first Mobile App backend. If you do this,
you can skip the rest of this section.

If you decide not to complete the Quickstart tutorial, and want to connect an Android app to a Mobile App backend, you
need to do the following:

- [create a Mobile App backend](app-service-mobile-android-get-started.md#create-a-new-azure-mobile-app-backend) to use
  with your Android app (unless your app already has one)
- In Android Studio, [update the Gradle build files](#gradle-build), and
- [Enable internet permission](#enable-internet)

After this, you will need to complete the steps described in the Deep dive section.

###<a name="gradle-build"></a>Update the Gradle build file

Change both **build.gradle** files:

1. Add this code to the *Project* level **build.gradle** file inside the *buildscript* tag:

		buildscript {
		    repositories {
		        jcenter()
		    }
		}

2. Add this code to the *Module app* level **build.gradle** file inside the *dependencies* tag:

		compile 'com.microsoft.azure:azure-mobile-android:3.1.0'

	Currently the latest version is 3.1.0. The supported versions are listed [here](http://go.microsoft.com/fwlink/p/?LinkID=717034).

###<a name="enable-internet"></a>Enable internet permission
To access Azure, your app must have the INTERNET permission enabled. If it's not already enabled, add the following line of code to your **AndroidManifest.xml** file:

	<uses-permission android:name="android.permission.INTERNET" />

## The basics deep dive

This section discusses some of the code in the Quickstart app. If you did not complete the Quickstart, you will need to add this code to your app.

> [AZURE.NOTE] The string "MobileServices" occurs frequently in the code: the code actually references the Mobile Apps SDK, it's just a temporary carry-over from the past.


###<a name="data-object"></a>Define client data classes

To access data from SQL Azure tables, you define client data classes that correspond to the tables in the Mobile App backend. Examples in this topic assume a table named *ToDoItem*, which has the following columns:

- id
- text
- complete

The corresponding typed client-side object is the following:

	public class ToDoItem {
		private String id;
		private String text;
		private Boolean complete;
	}

The code will reside in a file called **ToDoItem.java**.

If your SQL Azure table contains more columns, you would add the corresponding fields  to this class.

For example if it had an integer Priority column, then you might add this field, along with its getter and setter methods:

	private Integer priority;

	/**
	* Returns the item priority
	*/
	public Integer getPriority() {
	return mPriority;
	}
	
	/**
	* Sets the item priority
	*
	* @param priority
	*            priority to set
	*/
	public final void setPriority(Integer priority) {
	mPriority = priority;
	}

To learn how to create additional tables in your Mobile Apps backend, see [How to: Define a table controller](app-service-mobile-dotnet-backend-how-to-use-server-sdk.md#how-to-define-a-table-controller) (.NET backend) or [Define Tables using a Dynamic Schema](app-service-mobile-node-backend-how-to-use-server-sdk.md#TableOperations) (Node.js backend). For a Node.js backend, you can also use the **Easy tables** setting in the [Azure portal].

###<a name="create-client"></a>How to: Create the client context

This code creates the **MobileServiceClient** object that is used to access your Mobile App backend. The code goes in the `onCreate` method of the **Activity** class specified in *AndroidManifest.xml* as a **MAIN** action and **LAUNCHER** category. In the Quickstart code, it goes in the **ToDoActivity.java** file.

		MobileServiceClient mClient = new MobileServiceClient(
			"MobileAppUrl", // Replace with the above Site URL
			this)

In this code, replace `MobileAppUrl` with the URL of your Mobile App backend, which can be found in the [Azure portal](https://portal.azure.com/) in the blade for your Mobile App backend. For this line of code to compile, you also need to add the following **import** statement:

	import com.microsoft.windowsazure.mobileservices.*;

###<a name="instantiating"></a>How to: Create a table reference

The easiest way to query or modify data in the backend is by using the *typed programming model*, since Java is a strongly typed language (later on we will discuss the *untyped* model). This model provides seamless JSON serialization and deserialization using the [gson](http://go.microsoft.com/fwlink/p/?LinkId=290801) library when sending data between  client objects and tables in the backend Azure SQL: the developer doesn't have to do anything, the framework handles it all.

To access a table, first create a [MobileServiceTable](http://azure.github.io/azure-mobile-apps-android-client/com/microsoft/windowsazure/mobileservices/table/MobileServiceTable.html) object by calling the **getTable** method on the [MobileServiceClient](http://azure.github.io/azure-mobile-apps-android-client/com/microsoft/windowsazure/mobileservices/MobileServiceClient.html).  This method has two overloads:

	public class MobileServiceClient {
	    public <E> MobileServiceTable<E> getTable(Class<E> clazz);
	    public <E> MobileServiceTable<E> getTable(String name, Class<E> clazz);
	}

In the following code, *mClient* is a reference to your MobileServiceClient object.

The [first overload](http://azure.github.io/azure-mobile-apps-android-client/com/microsoft/windowsazure/mobileservices/MobileServiceClient.html#getTable-java.lang.String-) is used where the class name and the table name are the same, and is the one used in the Quickstart:

	MobileServiceTable<ToDoItem> mToDoTable = mClient.getTable(ToDoItem.class);


The [2nd overload](http://azure.github.io/azure-mobile-apps-android-client/com/microsoft/windowsazure/mobileservices/MobileServiceClient.html#getTable-java.lang.String-java.lang.Class-) is used when the table name is different from the class name: the first parameter is the table name.

	MobileServiceTable<ToDoItem> mToDoTable = mClient.getTable("ToDoItemBackup", ToDoItem.class);

###<a name="binding"></a>How to: Bind data to the user interface

Data binding involves three components:

- The data source
- The screen layout
- The adapter that ties the two together.

In our sample code, we return the data from the Mobile Apps SQL Azure table *ToDoItem* into an array. This is a very common pattern for data applications: database queries often return a collection of rows which the client gets in a list or array. In this sample the array is the data source.

The code specifies a screen layout that defines the view of the data that will appear on the device.

And the two are bound together with an adapter, which in this code is an extension of the *ArrayAdapter&lt;ToDoItem&gt;* class.

#### <a name="layout"></a>How to: Define the Layout

The layout is defined by several snippets of XML code. Given an existing layout, let's assume the following code represents the **ListView** we want to populate with our server data.

    <ListView
        android:id="@+id/listViewToDo"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        tools:listitem="@layout/row_list_to_do" >
    </ListView>

In the above code the *listitem* attribute specifies the id of the layout for an individual row in the list. Here is that code, which specifies a check box and its associated text. This gets instantiated once for each item in the list. This layout does not display the **id** field, and a more complex layout would specify additional fields in the display. This code is in the **row_list_to_do.xml** file.

	<?xml version="1.0" encoding="utf-8"?>
	<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
	    android:layout_width="match_parent"
	    android:layout_height="match_parent"
	    android:orientation="horizontal">
	    <CheckBox
	        android:id="@+id/checkToDoItem"
	        android:layout_width="wrap_content"
	        android:layout_height="wrap_content"
	        android:text="@string/checkbox_text" />
	</LinearLayout>


#### <a name="adapter"></a>How to: Define the adapter

Since the data source of our view is an array of *ToDoItem*, we subclass our adapter from a *ArrayAdapter&lt;ToDoItem&gt;* class. This subclass will produce a View for every *ToDoItem* using the *row_list_to_do* layout.

In our code we define the following class which is an extension of the *ArrayAdapter&lt;E&gt;* class:

	public class ToDoItemAdapter extends ArrayAdapter<ToDoItem> {


You must override the adapter's *getView* method. This sample code is one example of how to do this: details will vary with your application.

    @Override
	public View getView(int position, View convertView, ViewGroup parent) {
		View row = convertView;

		final ToDoItem currentItem = getItem(position);

		if (row == null) {
			LayoutInflater inflater = ((Activity) mContext).getLayoutInflater();
			row = inflater.inflate(R.layout.row_list_to_do, parent, false);
		}

		row.setTag(currentItem);

		final CheckBox checkBox = (CheckBox) row.findViewById(R.id.checkToDoItem);
		checkBox.setText(currentItem.getText());
		checkBox.setChecked(false);
		checkBox.setEnabled(true);

        checkBox.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View arg0) {
                if (checkBox.isChecked()) {
                    checkBox.setEnabled(false);
                    if (mContext instanceof ToDoActivity) {
                        ToDoActivity activity = (ToDoActivity) mContext;
                        activity.checkItem(currentItem);
                    }
                }
            }
        });


		return row;
	}

We create an instance of this class in our Activity as follows:

	ToDoItemAdapter mAdapter;
	mAdapter = new ToDoItemAdapter(this, R.layout.row_list_to_do);

Note that the second parameter to the ToDoItemAdapter constructor is a reference to the layout. The call to the constructor is followed by the following code which first gets a reference to the **ListView**, and next calls *setAdapter* to configure itself to use the adapter we just created:

	ListView listViewToDo = (ListView) findViewById(R.id.listViewToDo);
	listViewToDo.setAdapter(mAdapter);

### <a name="api"></a>The API structure

Mobile Apps table operations and custom API calls are asynchronous, so you use the [Future](http://developer.android.com/reference/java/util/concurrent/Future.html) and [AsyncTask](http://developer.android.com/reference/android/os/AsyncTask.html) objects in all of the asynchronous  methods involving queries and inserts, updates and deletes. This makes it easier to perform multiple operations on a background thread without having to deal with multiple nested callbacks.

To see how these asynchronous APIs are used in your Android app and how data is displayed in the UI, review the **ToDoActivity.java** file in the Android quickstart project from the [Azure portal].


#### <a name="use-adapter"></a>How to: Use the adapter

You are now ready to use data binding. The following code shows how to get the items in the mobile service table, clear the adapter, and then call the adapter's *add* method to fill it with the returned items.

    public void showAll(View view) {
        AsyncTask<Void, Void, Void> task = new AsyncTask<Void, Void, Void>(){
            @Override
            protected Void doInBackground(Void... params) {
                try {
                    final List<ToDoItem> results = mToDoTable.execute().get();
                    runOnUiThread(new Runnable() {

                        @Override
                        public void run() {
                            mAdapter.clear();
                            for (ToDoItem item : results) {
                                mAdapter.add(item);
                            }
                        }
                    });
                } catch (Exception exception) {
                    createAndShowDialog(exception, "Error");
                }
                return null;
            }
        };
		runAsyncTask(task);
    }

You must also call the adapter any time you modify the *ToDoItem* table if you want to display the results of doing that. Since modifications are done on a record by record basis, you will be dealing with a single row instead of a collection. When you insert an item you call the *add* method on the adapter, when deleting, you call the *remove* method.

##<a name="querying"></a>How to: Query data from your Mobile App backend

This section describes how to issue queries to the Mobile App backend, which includes the following tasks:

- [Return all Items]
- [Filter returned data]
- [Sort returned data]
- [Return data in pages]
- [Select specific columns]
- [Concatenate query methods](#chaining)

### <a name="showAll"></a>How to: Return all Items from a Table

The following query returns all items in the *ToDoItem* table.

	List<ToDoItem> results = mToDoTable.execute().get();

The *results* variable returns the result set from the query as a list.

### <a name="filtering"></a>How to: Filter returned data

The following query execution returns all items from the *ToDoItem* table where *complete* equals *false*. This is the code that is already in the Quickstart.

	List<ToDoItem> result = mToDoTable.where()
								.field("complete").eq(false)
								.execute().get();

*mToDoTable* is the reference to the mobile service table that we created previously.

You define a filter using the **where** method call on the table reference. This is followed by a **field** method call followed by a method call that specifies the logical predicate. Possible predicate methods include **eq** (equals), **ne** (not equal), **gt** (greater than), **ge** (greater than or equal to), **lt** (less than), **le** (less than or equal to), and etc. These methods let you compare number and string fields to specific values.

You can filter on dates. The following methods let you compare the entire date field or parts of of the date: **year**, **month**, **day**, **hour**, **minute** and **second**. The following example adds a filter for items whose *due date* equals 2013.

	mToDoTable.where().year("due").eq(2013).execute().get();

The following methods support complex filters on string fields: **startsWith**, **endsWith**, **concat**, **subString**, **indexOf**, **replace**, **toLower**, **toUpper**, **trim**, and **length**. The following example filters for table rows where the *text* column starts with "PRI0".

	mToDoTable.where().startsWith("text", "PRI0").execute().get();

The following operator methods are supported on number fields: **add**, **sub**, **mul**, **div**, **mod**, **floor**, **ceiling**, and **round**. The following example filters for table rows where the *duration* is an even number.

	mToDoTable.where().field("duration").mod(2).eq(0).execute().get();

You can combine predicates with these logical methods: **and**, **or** and **not**. The following example combines two of the above examples.

	mToDoTable.where().year("due").eq(2013).and().startsWith("text", "PRI0")
				.execute().get();

And you can group and nest logical operators, like this:

	mToDoTable.where()
				.year("due").eq(2013)
					.and
				(startsWith("text", "PRI0").or().field("duration").gt(10))
				.execute().get();

For more detailed discussion and examples of filtering, see [Exploring the richness of the Android client query model](http://hashtagfail.com/post/46493261719/mobile-services-android-querying).

### <a name="sorting"></a>How to: Sort returned data

The following code returns all items from a table of *ToDoItems* sorted ascending by the *text* field. *mToDoTable* is the reference to the backend table that you created previously:

	mToDoTable.orderBy("text", QueryOrder.Ascending).execute().get();

The first parameter of the **orderBy** method is a string equal to the name of the field on which to sort.

The second parameter uses the **QueryOrder** enumeration to specify whether to sort ascending or descending.

Note that if you are filtering using the ***where*** method, the ***where*** method must be invoked prior to the ***orderBy*** method.

### <a name="paging"></a>How to: Return data in pages

The first example shows how to select the top 5 items from a table. The query returns the items from a table of  *ToDoItems*. *mToDoTable* is the reference to the backend table that you created previously:

    List<ToDoItem> result = mToDoTable.top(5).execute().get();


Here's a query that skips the first 5 items, and then returns the next 5:

	mToDoTable.skip(5).top(5).execute().get();


### <a name="selecting"></a>How to: Select specific columns

The following code illustrates how to return all items from a table of  *ToDoItems*, but only displays the *complete* and *text* fields. *mToDoTable* is the reference to the backend table that we created previously.

	List<ToDoItemNarrow> result = mToDoTable.select("complete", "text").execute().get();


Here the parameters to the select function are the string names of the table's columns that you want to return.

The **select** method needs to follow methods like **where** and **orderBy**, if they are present. It can be followed by paging methods like **top**.

### <a name="chaining"></a>How to: Concatenate query methods

As you have seen, the methods used in querying backend tables can be concatenated. This allows you to do things like select specific columns of filtered rows that are sorted and paged. You can create quite complex logical filters.

What makes this work is that the query methods you use return **MobileServiceQuery&lt;T&gt;** objects, which can in turn have additional methods invoked on them. To end the series of methods and actually run the query, you call the **execute** method.

Here's a code sample where *mToDoTable* is a reference to the *ToDoItem* table.

	mToDoTable.where().year("due").eq(2013)
					.and().startsWith("text", "PRI0")
					.or().field("duration").gt(10)
				.select("id", "complete", "text", "duration")
				.orderBy(duration, QueryOrder.Ascending).top(20)
				.execute().get();

The main requirement in chaining methods together is that the *where* method and predicates need to come first. After that, you can call subsequent methods in the order that best meets the needs of your application.


##<a name="inserting"></a>How to: Insert data into the backend

The following code shows how to insert a new row into a table.

First you instantiate an instance of the *ToDoItem* class and set its properties.

	ToDoItem item = new ToDoItem();
	item.text = "Test Program";
	item.complete = false;

Next you execute the following code:

	ToDoItem entity = mToDoTable.insert(item).get();

The returned entity matches the data inserted into the backend table, included the ID and any other values set on the backend.

Mobile Apps requires that each table have a column named **id**, which is used to index the table. By default, this column is a string data type, which is needed to support offline sync. The default value of the ID column is a GUID, but you can provide other unique values, such as email addresses or usernames. When a string ID value is not provided for an inserted record, the backend generates a new GUID value.

String ID values provide the following advantages:

+ IDs can be generated without making a round-trip to the database.
+ Records are easier to merge from different tables or databases.
+ ID values integrate better with an application's logic.

##<a name="updating"></a>How to: Update data in a mobile app

The following code shows how to update data in a table.

    mToDoTable.update(item).get();

In this example, *item* is a reference to a row in the *ToDoItem* table, which has had some changes made to it.

##<a name="deleting"></a>How to: Delete data in a mobile app

The following code shows how to delete data from a table by specifying the data object.

	mToDoTable.delete(item);

You can also delete an item by specifying the **id** field of the row to delete.

	String myRowId = "2FA404AB-E458-44CD-BC1B-3BC847EF0902";
   	mToDoTable.delete(myRowId);


##<a name="lookup"></a>How to: Look up a specific item

This code shows how to look up an item with a specific *id*.

	ToDoItem result = mToDoTable
						.lookUp("0380BAFB-BCFF-443C-B7D5-30199F730335")
						.get();

##<a name="untyped"></a>How to: Work with untyped data

The untyped programming model gives you exact control over the JSON serialization, and there are some scenarios where you may wish to use it, for example, if your backend table contains a large number of columns and you only need to reference a few of them. Using the typed model requires you to define all of the mobile apps table's columns in your data class. But with the untyped model you only define the columns you need to use.

Most of the API calls for accessing data are similar to the typed programming calls. The main difference is that in the untyped model you invoke methods on the **MobileServiceJsonTable** object, instead of the **MobileServiceTable** object.


### <a name="json_instance"></a>How to: Create an instance of an untyped table

Similar to the typed model, you start by getting a table reference, but in this case it's a **MobileServicesJsonTable** object. You get the reference by calling the **getTable** method on an instance of the client, like this:

    private MobileServiceJsonTable mJsonToDoTable;
	//...
    mJsonToDoTable = mClient.getTable("ToDoItem");

Once you have created an instance of the **MobileServiceJsonTable**, you can call almost all of the methods on it that you can with the typed programming model. However in some cases the methods take an untyped parameter, as we see in the following examples.

### <a name="json_insert"></a>How to: Insert into an untyped table

The following code shows how to do an insert. The first step is to create a [**JsonObject**](http://google-gson.googlecode.com/svn/trunk/gson/docs/javadocs/com/google/gson/JsonObject.html), which is part of the [gson]( http://go.microsoft.com/fwlink/p/?LinkId=290801) library.

	JsonObject jsonItem = new JsonObject();
	jsonItem.addProperty("text", "Wake up");
	jsonItem.addProperty("complete", false);

The next step is to insert the object.

    mJsonToDoTable.insert(jsonItem).get();


If you need to get the ID of the inserted object, use this method call:

	jsonItem.getAsJsonPrimitive("id").getAsInt());


### <a name="json_delete"></a>How to: Delete from an untyped table

The following code shows how to delete an instance, in this case, the same instance of a **JsonObject** that was created in the prior *insert* example. Note that the code is the same as with the typed case, but the method has a different signature since it references an **JsonObject**.


         mToDoTable.delete(jsonItem);


You can also delete an instance directly by using its ID:

		 mToDoTable.delete(ID);


### <a name="json_get"></a>How to: Return all rows from an untyped table

The following code shows how to retrieve an entire table. Since you are using a JSON Table, you can selectively retrieve only some of the table's columns.

    public void showAllUntyped(View view) {
        new AsyncTask<Void, Void, Void>() {
            @Override
            protected Void doInBackground(Void... params) {
                try {
                    final JsonElement result = mJsonToDoTable.execute().get();
                    final JsonArray results = result.getAsJsonArray();
                    runOnUiThread(new Runnable() {

                        @Override
                        public void run() {
                            mAdapter.clear();
                            for (JsonElement item : results) {
                                String ID = item.getAsJsonObject().getAsJsonPrimitive("id").getAsString();
                                String mText = item.getAsJsonObject().getAsJsonPrimitive("text").getAsString();
                                Boolean mComplete = item.getAsJsonObject().getAsJsonPrimitive("complete").getAsBoolean();
                                ToDoItem mToDoItem = new ToDoItem();
                                mToDoItem.setId(ID);
                                mToDoItem.setText(mText);
                                mToDoItem.setComplete(mComplete);
                                mAdapter.add(mToDoItem);
                            }
                        }
                    });
                } catch (Exception exception) {
                    createAndShowDialog(exception, "Error");
                }
                return null;
            }
        }.execute();
    }

You can do filtering, sorting and paging by concatenating  methods that have the same names as those used in the typed programming model.



##<a name="custom-api"></a>How to: Call a custom API

A custom API enables you to define custom endpoints that expose server functionality that does not map to an insert, update, delete, or read operation. By using a custom API, you can have more control over messaging, including reading and setting HTTP message headers and defining a message body format other than JSON.

From an Android client, you call the **invokeApi** method to call the custom API endpoint. The following example shows how to call an API endpoint named *completeAll*, which returns a collection class named MarkAllResult.

	public void completeItem(View view) {

	    ListenableFuture<MarkAllResult> result = mClient.invokeApi( "completeAll", MarkAllResult.class );

	    	Futures.addCallback(result, new FutureCallback<MarkAllResult>() {
	    		@Override
	    		public void onFailure(Throwable exc) {
	    			createAndShowDialog((Exception) exc, "Error");
	    		}

	    		@Override
	    		public void onSuccess(MarkAllResult result) {
	    			createAndShowDialog(result.getCount() + " item(s) marked as complete.", "Completed Items");
	                refreshItemsFromTable();
	    		}
	    	});
	    }

The **invokeApi** method is called on the client, which sends a POST request to the new custom API. The result returned by the custom API is displayed in a message dialog, as are any errors. Other versions of **invokeApi** let you optionally send an object in the request body, specify the HTTP method, and send query parameters with the request. Untyped versions of **invokeApi** are provided as well.

##<a name="authentication"></a>How to: add authentication to your app

Tutorials already describe in detail how to add these features.

App Service supports [authenticating app users](app-service-mobile-android-get-started-users.md) using a variety of external identity providers: Facebook, Google, Microsoft Account, Twitter, and Azure Active Directory. You can set permissions on tables to restrict access for specific operations to only authenticated users. You can also use the identity of authenticated users to implement authorization rules in your backend.

Two authentication flows are supported: a *server* flow and a *client* flow. The server flow provides the simplest authentication experience, as it relies on the provider's web authentication interface. The client flow allows for deeper integration with device-specific capabilities such as single-sign-on as it relies on provider-specific device-specific SDKs, and requires you to code this.

Three steps are required to enable authentication in your app:

- Register your app for authentication with a provider, and configure your Mobile App backend.
- Restrict table permissions to authenticated users only.
- Add authentication code to your app.

You can set permissions on tables to restrict access for specific operations to only authenticated users. You can also use the SID of an authenticated user to modify requests.

These first two tasks are done using the [Azure portal](https://portal.azure.com/). For more information, see [Get started with authentication].

### <a name="caching"></a>How to: Add authentication code to your app

The following code starts the server flow login process using the Google provider:

	MobileServiceUser user = mClient.login(MobileServiceAuthenticationProvider.Google);

You can get the ID of the logged-in user from a **MobileServiceUser**  using the **getUserId** method. For an example of how to use Futures to call the asynchronous login APIs, see [Get started with authentication].


### <a name="caching"></a>How to: Cache authentication tokens

Caching authentication tokens requires you to store the User ID and authentication token locally on the device. The next time the app starts, you check the cache, and if these values are present, you can skip the log in procedure and re-hydrate the client with this data. However this data is sensitive, and it should be stored encrypted for safety in case the phone gets stolen.

You can see a complete example of how to cache authentication tokens in [Cache authentication tokens section](app-service-mobile-android-get-started-users.md#cache-tokens).

When you try to use an expired token you will get a *401 unauthorized* response. The user must then log in to obtain new tokens. You can avoid having to write code to handle this in every place in your app that calls your mobile service by using filters, which allow you to intercept calls to and responses from Mobile Services. The filter code will then test the response for a 401, trigger the sign-in process if needed, and then resume the request that generated the 401. You can also inspect the token to check the expiration.


## <a name="adal"></a>How to: Authenticate users with the Active Directory Authentication Library

You can use the Active Directory Authentication Library (ADAL) to sign users into your application using Azure Active Directory. This is often preferable to using the `loginAsync()` methods, as it provides a more native UX feel and allows for additional customization.

1. Configure your mobile app backend for AAD sign-in by followin the [How to configure App Service for Active Directory login](app-service-mobile-how-to-configure-active-directory-authentication.md) tutorial. Make sure to complete the optional step of registering a native client application.

2. Install ADAL by modifying your build.gradle file to include the following:

	repositories {
		mavenCentral()
		flatDir {
			dirs 'libs'
		}
		maven {
			url "YourLocalMavenRepoPath\\.m2\\repository"
		}
	}
    packagingOptions {
        exclude 'META-INF/MSFTSIG.RSA'
        exclude 'META-INF/MSFTSIG.SF'
    }
	dependencies {
		compile fileTree(dir: 'libs', include: ['*.jar'])
		compile('com.microsoft.aad:adal:1.1.1') {
			exclude group: 'com.android.support'
		} // Recent version is 1.1.1
    	compile 'com.android.support:support-v4:23.0.0'
	}

3. Add the below code to your application, making the following replacements:

* Replace **INSERT-AUTHORITY-HERE** ith the name of the tenant in which you provisioned your application. The format should be https://login.windows.net/contoso.onmicrosoft.com. This value can be copied out of the Domain tab in your Azure Active Directory in the [Azure classic portal].

* Replace **INSERT-RESOURCE-ID-HERE** with the client ID for your mobile app backend. You can obtain this from the **Advanced** tab under **Azure Active Directory Settings** in the portal.

* Replace **INSERT-CLIENT-ID-HERE** with the client ID you copied from the native client application.

* Replace **INSERT-REDIRECT-URI-HERE** with your site's _/.auth/login/done_ endpoint, using the HTTPS scheme. This value should be similar to _https://contoso.azurewebsites.net/.auth/login/done_.

		private AuthenticationContext mContext;
		private void authenticate() {
		String authority = "INSERT-AUTHORITY-HERE";
		String resourceId = "INSERT-RESOURCE-ID-HERE";
		String clientId = "INSERT-CLIENT-ID-HERE";
		String redirectUri = "INSERT-REDIRECT-URI-HERE";
		try {
		    mContext = new AuthenticationContext(this, authority, true);
		    mContext.acquireToken(this, resourceId, clientId, redirectUri, PromptBehavior.Auto, "", callback);
		} catch (Exception exc) {
		    exc.printStackTrace();
		}
		}
		private AuthenticationCallback<AuthenticationResult> callback = new AuthenticationCallback<AuthenticationResult>() {
		@Override
		public void onError(Exception exc) {
		    if (exc instanceof AuthenticationException) {
		        Log.d(TAG, "Cancelled");
		    } else {
		        Log.d(TAG, "Authentication error:" + exc.getMessage());
		    }
		}
		@Override
			public void onSuccess(AuthenticationResult result) {
		    if (result == null || result.getAccessToken() == null
		            || result.getAccessToken().isEmpty()) {
		        Log.d(TAG, "Token is empty");
		    } else {
		        try {
		            JSONObject payload = new JSONObject();
		            payload.put("access_token", result.getAccessToken());
		            ListenableFuture<MobileServiceUser> mLogin = mClient.login("aad", payload.toString());
		            Futures.addCallback(mLogin, new FutureCallback<MobileServiceUser>() {
		                @Override
		                public void onFailure(Throwable exc) {
		                    exc.printStackTrace();
		                }
		                @Override
		                public void onSuccess(MobileServiceUser user) {
		            		Log.d(TAG, "Login Complete");
		                }
		            });
		        }
		        catch (Exception exc){
		            Log.d(TAG, "Authentication error:" + exc.getMessage());
		        }
		    }
		}
		};
		@Override
		protected void onActivityResult(int requestCode, int resultCode, Intent data) {
		super.onActivityResult(requestCode, resultCode, data);
		if (mContext != null) {
		    mContext.onActivityResult(requestCode, resultCode, data);
		}
		}


## How to: add push notification to your app

You can [read an overview](../notification-hubs/notification-hubs-overview.md#integration-with-app-service-mobile-apps) that describes how Microsoft Azure Notification Hubs supports a wide variety of push notifications,

In [this tutorial](app-service-mobile-android-get-started-push.md), every time a record is inserted, a push notification is sent.

## How to: add offline sync to your app
The Quickstart tutorial contains code that implements offline sync. Look for code prefixed with comments like this:

	// Offline Sync

By uncommenting the following lines of code you can implement offline sync, and you can add similar code to other Mobile Apps code.

##<a name="customizing"></a>How to: Customize the client

There are several ways for you to customize the default behavior of the client.

### <a name="headers"></a>How to: Customize request headers

You might want to attach a custom header to every outgoing request. You can accomplish that by configuring a **ServiceFilter** like this:

	private class CustomHeaderFilter implements ServiceFilter {

        @Override
        public ListenableFuture<ServiceFilterResponse> handleRequest(
                	ServiceFilterRequest request,
					NextServiceFilterCallback next) {

            runOnUiThread(new Runnable() {

                @Override
                public void run() {
	        		request.addHeader("My-Header", "Value");	                }
            });

            SettableFuture<ServiceFilterResponse> result = SettableFuture.create();
            try {
                ServiceFilterResponse response = next.onNext(request).get();
                result.set(response);
            } catch (Exception exc) {
                result.setException(exc);
            }
        }

### <a name="serialization"></a>How to: Customize serialization

The client assumes that the table names, column names and data types on the backend all match exactly the data objects defined in the client. But there can be any number of reasons why the server and client names might not match. In your scenario, you might want to do the following kinds of customizations:

- The column names used in the mobile-  service table don't match the names you are using in the client.
- Use a mobile service table that has a different name than the class it maps to in the client.
- Turn on automatic property capitalization.
- Add complex properties to an object.

### <a name="columns"></a>How to: Map different client and server names

Suppose that your Java client code uses standard Java-style names for the *ToDoItem* object properties, such as the following.

- mId
- mText
- mComplete
- mDuration


You must serialize the client names into JSON names that match the column names of the *ToDoItem* table on the server. The following code, which makes use of the [gson](http://go.microsoft.com/fwlink/p/?LinkId=290801) library does this.

	@com.google.gson.annotations.SerializedName("text")
	private String mText;

	@com.google.gson.annotations.SerializedName("id")
	private int mId;

	@com.google.gson.annotations.SerializedName("complete")
	private boolean mComplete;

	@com.google.gson.annotations.SerializedName("duration")
	private String mDuration;

### <a name="table"></a>How to: Map different table names between the client and the backend

Mapping the client table name to a different mobile services table name is easy, we just use one of the overrides of the
<a href="http://go.microsoft.com/fwlink/p/?LinkId=296840" target="_blank">getTable()</a> function, as seen in the following code.

	mToDoTable = mClient.getTable("ToDoItemBackup", ToDoItem.class);


### <a name="conversions"></a>How to: Automate column name mappings

Mapping column names for a narrow table with only a few columns isn't a big deal, as we saw in the prior section. But suppose our table has a lot of columns, say 20 or 30. It turns out that we can call the <a href=" http://go.microsoft.com/fwlink/p/?LinkId=290801" target="_blank">gson</a> API and specify a conversion strategy that will apply to every column, and avoid having to annotate every single column name.

To do this we use the <a href=" http://go.microsoft.com/fwlink/p/?LinkId=290801" target="_blank">gson</a> library which the Android client library uses behind the scenes to serialize Java objects to JSON data, which is sent to Azure Mobile Services.

The following code uses the *setFieldNamingStrategy()* method, in which we define a *FieldNamingStrategy()* method. This method says to delete the initial character (an "m"), and then lower-case the next character, for every field name. This code also enables pretty-printing of the output JSON.

	client.setGsonBuilder(
	    MobileServiceClient
	    .createMobileServiceGsonBuilder()
	    .setFieldNamingStrategy(new FieldNamingStrategy() {
	        public String translateName(Field field) {
	            String name = field.getName();
	            return Character.toLowerCase(name.charAt(1))
	                + name.substring(2);
	            }
	        })
	        .setPrettyPrinting());



This code must be executed prior to any method calls on the Mobile Services client object.

### <a name="complex"></a>How to: Store an object or array property into a table

So far all of our serialization examples have involved primitive types such as integers and strings which easily serialize into JSON and into the mobile services table. Suppose we want to add a complex object to our client type, which doesn't automatically serialize to JSON and to the table. For example we might want to add an array of strings to the client object. It is now up to us to specify how to do the serialization, and how to store the array into the mobile services table.

To see an example of how to do this, check out the blog post <a href="http://hashtagfail.com/post/44606137082/mobile-services-android-serialization-gson" target="_blank">Customizing serialization using the <a href=" http://go.microsoft.com/fwlink/p/?LinkId=290801" target="_blank">gson</a> library in the Mobile Services Android client</a>.

This general method can be used whenever we have a complex object that is not automatically serializable into JSON and the mobile services table.

<!-- Anchors. -->

[What is Mobile Services]: #what-is
[Concepts]: #concepts
[How to: Create the Mobile Services client]: #create-client
[How to: Create a table reference]: #instantiating
[The API structure]: #api
[How to: Query data from a mobile service]: #querying
[Return all Items]: #showAll
[Filter returned data]: #filtering
[Sort returned data]: #sorting
[Return data in pages]: #paging
[Select specific columns]: #selecting
[How to: Concatenate query methods]: #chaining
[How to: Bind data to the user interface]: #binding
[How to: Define the layout]: #layout
[How to: Define the adapter]: #adapter
[How to: Use the adapter]: #use-adapter
[How to: Insert data into a mobile service]: #inserting
[How to: update data in a mobile service]: #updating
[How to: Delete data in a mobile service]: #deleting
[How to: Look up a specific item]: #lookup
[How to: Work with untyped data]: #untyped
[How to: Authenticate users]: #authentication
[Cache authentication tokens]: #caching
[How to: Handle errors]: #errors
[How to: Design unit tests]: #tests
[How to: Customize the client]: #customizing
[Customize request headers]: #headers
[Customize serialization]: #serialization
[Next Steps]: #next-steps
[Setup and Prerequisites]: #setup

<!-- Images. -->



<!-- URLs. -->
[Get started with Azure Mobile Apps]: app-service-mobile-android-get-started.md
[ASCII control codes C0 and C1]: http://en.wikipedia.org/wiki/Data_link_escape_character#C1_set
[Mobile Services SDK for Android]: http://go.microsoft.com/fwlink/p/?LinkID=717033
[Azure portal]: https://portal.azure.com
[Get started with authentication]: app-service-mobile-android-get-started-users.md
