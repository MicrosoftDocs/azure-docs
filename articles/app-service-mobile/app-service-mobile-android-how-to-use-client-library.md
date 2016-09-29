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
	ms.date="09/23/2016"
	ms.author="adrianha"/>


# How to use the Android client library for Mobile Apps

[AZURE.INCLUDE [app-service-mobile-selector-client-library](../../includes/app-service-mobile-selector-client-library.md)]

This guide shows you how to use the Android client SDK for Mobile Apps to implement common scenarios, such as:

- Querying for data (inserting, updating, and deleting).
- Authentication.
- Handling errors.
- Customizing the client. 

It also does a deep-dive into common client code used in most mobile apps.

This guide focuses on the client-side Android SDK.  To learn more about the server-side SDKs for Mobile Apps, see
[Work with .NET backend SDK][10] or [How to use the Node.js backend SDK][11].

## Reference Documentation

You can find the [Javadocs API reference][12] for the Android client library on GitHub.

## Supported Platforms

The Azure Mobile Apps Android SDK supports API levels 19 through 24 (KitKat through Nougat).  

The "server-flow" authentication uses a WebView for the presented UI. If the device is not able to present a 
WebView UI, then other methods of authentication are needed that is outside the scope of the product.  This 
SDK is not suitable for Watch-type or similarly restricted devices.

## Setup and Prerequisites

Complete the [Mobile Apps quickstart](app-service-mobile-android-get-started.md) tutorial.  This task ensures
all pre-requisites for developing Azure Mobile Apps have been met.  The Quickstart also helps you configure 
your account and create your first Mobile App backend.

If you decide not to complete the Quickstart tutorial, complete the following tasks:

- [create a Mobile App backend][13] to use with your Android app.
- In Android Studio, [update the Gradle build files](#gradle-build).
- [Enable internet permission](#enable-internet).

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

    Currently the latest version is 3.1.0. The supported versions are listed [here][14].

###<a name="enable-internet"></a>Enable internet permission

To access Azure, your app must have the INTERNET permission enabled. If it's not already enabled, add the 
following line of code to your **AndroidManifest.xml** file:

	<uses-permission android:name="android.permission.INTERNET" />

## The basics deep dive

This section discusses some of the code in the Quickstart app that pertains to using Azure Mobile Apps.  

###<a name="data-object"></a>Define client data classes

To access data from SQL Azure tables, define client data classes that correspond to the tables in the 
Mobile App backend. Examples in this topic assume a table named **ToDoItem**, which has the following columns:

- id
- text
- complete

The corresponding typed client-side object:

	public class ToDoItem {
		private String id;
		private String text;
		private Boolean complete;
	}

The code resides in a file called **ToDoItem.java**.

If your SQL Azure table contains more columns, you would add the corresponding fields to this class.  For 
example, if the DTO (data transfer object) had an integer Priority column, then you might add this field, 
along with its getter and setter methods:

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

To learn how to create additional tables in your Mobile Apps backend, see [How to: Define a table controller][15] 
(.NET backend) or [Define Tables using a Dynamic Schema][16] (Node.js backend). For a Node.js backend, you can 
also use the **Easy tables** setting in the [Azure portal].

###<a name="create-client"></a>How to: Create the client context

This code creates the **MobileServiceClient** object that is used to access your Mobile App backend. The code goes 
in the `onCreate` method of the **Activity** class specified in *AndroidManifest.xml* as a **MAIN** action and 
**LAUNCHER** category. In the Quickstart code, it goes in the **ToDoActivity.java** file.

		MobileServiceClient mClient = new MobileServiceClient(
			"MobileAppUrl", // Replace with the Site URL
			this)

In this code, replace `MobileAppUrl` with the URL of your Mobile App backend, which can be found in the 
[Azure portal] in the blade for your Mobile App backend. For this line of code to compile, you also need to 
add the following **import** statement:

	import com.microsoft.windowsazure.mobileservices.*;

###<a name="instantiating"></a>How to: Create a table reference

The easiest way to query or modify data in the backend is by using the *typed programming model*, since Java 
is a strongly typed language. This model provides seamless JSON serialization and deserialization using the 
[gson][3] library when sending data between client objects and tables in the backend Azure SQL.

To access a table, first create a [MobileServiceTable][8] object by calling the **getTable** method on 
the [MobileServiceClient][9].  This method has two overloads:

	public class MobileServiceClient {
	    public <E> MobileServiceTable<E> getTable(Class<E> clazz);
	    public <E> MobileServiceTable<E> getTable(String name, Class<E> clazz);
	}

In the following code, **mClient** is a reference to your MobileServiceClient object.  The first overload is 
used where the class name and the table name are the same, and is the one used in the Quickstart:

	MobileServiceTable<ToDoItem> mToDoTable = mClient.getTable(ToDoItem.class);

The second overload is used when the table name is different from the class name: the first parameter is the 
table name.

	MobileServiceTable<ToDoItem> mToDoTable = mClient.getTable("ToDoItemBackup", ToDoItem.class);

###<a name="binding"></a>How to: Bind data to the user interface

Data binding involves three components:

- The data source
- The screen layout
- The adapter that ties the two together.

In our sample code, we return the data from the Mobile Apps SQL Azure table **ToDoItem** into an array. This
activity is a common pattern for data applications.  Database queries often return a collection of rows that 
the client gets in a list or array. In this sample, the array is the data source.

The code specifies a screen layout that defines the view of the data that appears on the device.  The two are 
bound together with an adapter, which in this code is an extension of the **ArrayAdapter&lt;ToDoItem&gt;** class.

#### <a name="layout"></a>How to: Define the Layout

The layout is defined by several snippets of XML code. Given an existing layout, the following code represents 
the **ListView** we want to populate with our server data.

    <ListView
        android:id="@+id/listViewToDo"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        tools:listitem="@layout/row_list_to_do" >
    </ListView>

In the preceding code, the *listitem* attribute specifies the id of the layout for an individual row in the 
list. This code specifies a check box and its associated text and gets instantiated once for each item in the 
list. This layout does not display the **id** field, and a more complex layout would specify additional fields 
in the display. This code is in the **row_list_to_do.xml** file.

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

Since the data source of our view is an array of **ToDoItem**, we subclass our adapter from an 
**ArrayAdapter&lt;ToDoItem&gt;** class. This subclass produces a View for every **ToDoItem** using the 
**row_list_to_do** layout.

In our code we define the following class that is an extension of the **ArrayAdapter&lt;E&gt;** class:

	public class ToDoItemAdapter extends ArrayAdapter<ToDoItem> {

Override the adapters **getView** method. For example:

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

The second parameter to the ToDoItemAdapter constructor is a reference to the layout. We can now instantiate
the **ListView** and assign the adapter to the **ListView**.

	ListView listViewToDo = (ListView) findViewById(R.id.listViewToDo);
	listViewToDo.setAdapter(mAdapter);

### <a name="api"></a>The API structure

Mobile Apps table operations and custom API calls are asynchronous. Use the [Future] and [AsyncTask] objects for 
the asynchronous methods involving queries, inserts, updates, and deletes. Using futures makes it easier
to perform multiple operations on a background thread without having to deal with multiple nested callbacks.

Review the **ToDoActivity.java** file in the Android quickstart project from the [Azure portal] for an example.

#### <a name="use-adapter"></a>How to: Use the adapter

You are now ready to use data binding. The following code shows how to get items in the table and fills the
local adapter with the returned items.

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

Call the adapter any time you modify the **ToDoItem** table. Since modifications are done on a record by 
record basis, you handle a single row instead of a collection. When you insert an item, call the 
**add** method on the adapter; when deleting, call the **remove** method.

##<a name="querying"></a>How to: Query data from your Mobile App backend

This section describes how to issue queries to the Mobile App backend, which includes the following tasks:

- [Return all Items]
- [Filter returned data]
- [Sort returned data]
- [Return data in pages]
- [Select specific columns]
- [Concatenate query methods](#chaining)

### <a name="showAll"></a>How to: Return all Items from a Table

The following query returns all items in the **ToDoItem** table.

	List<ToDoItem> results = mToDoTable.execute().get();

The *results* variable returns the result set from the query as a list.

### <a name="filtering"></a>How to: Filter returned data

The following query execution returns all items from the **ToDoItem** table where **complete** equals 
**false**.

	List<ToDoItem> result = mToDoTable.where()
								.field("complete").eq(false)
								.execute().get();

**mToDoTable** is the reference to the mobile service table that we created previously.

Define a filter using the **where** method call on the table reference. The **where** method is followed 
by a **field** method followed by a method that specifies the logical predicate. Possible predicate 
methods include **eq** (equals), **ne** (not equal), **gt** (greater than), **ge** (greater than or equal to), 
**lt** (less than), **le** (less than or equal to). These methods let you compare number and string fields to 
specific values.

You can filter on dates. The following methods let you compare the entire date field or parts of the 
date: **year**, **month**, **day**, **hour**, **minute**, and **second**. The following example adds 
a filter for items whose *due date* equals 2013.

	mToDoTable.where().year("due").eq(2013).execute().get();

The following methods support complex filters on string fields: **startsWith**, **endsWith**, **concat**, 
**subString**, **indexOf**, **replace**, **toLower**, **toUpper**, **trim**, and **length**. The following 
example filters for table rows where the *text* column starts with "PRI0."

	mToDoTable.where().startsWith("text", "PRI0").execute().get();

The following operator methods are supported on number fields: **add**, **sub**, **mul**, **div**, 
**mod**, **floor**, **ceiling**, and **round**. The following example filters for table rows where the 
**duration** is an even number.

	mToDoTable.where().field("duration").mod(2).eq(0).execute().get();

You can combine predicates with these logical methods: **and**, **or** and **not**. The following example 
combines two of the preceding examples.

	mToDoTable.where().year("due").eq(2013).and().startsWith("text", "PRI0")
				.execute().get();

Group and nest logical operators:

	mToDoTable.where()
				.year("due").eq(2013)
					.and
				(startsWith("text", "PRI0").or().field("duration").gt(10))
				.execute().get();

For more detailed discussion and examples of filtering, see [Exploring the richness of the Android client query model](http://hashtagfail.com/post/46493261719/mobile-services-android-querying).

### <a name="sorting"></a>How to: Sort returned data

The following code returns all items from a table of **ToDoItems** sorted ascending by the *text* 
field. *mToDoTable* is the reference to the backend table that you created previously:

	mToDoTable.orderBy("text", QueryOrder.Ascending).execute().get();

The first parameter of the **orderBy** method is a string equal to the name of the field on which to 
sort. The second parameter uses the **QueryOrder** enumeration to specify whether to sort ascending 
or descending.  If you are filtering using the ***where*** method, the ***where*** method must be 
invoked before the ***orderBy*** method.

### <a name="paging"></a>How to: Return data in pages

The first example shows how to select the top five items from a table. The query returns the items from 
a table of **ToDoItems**. **mToDoTable** is the reference to the backend table that you created previously:

    List<ToDoItem> result = mToDoTable.top(5).execute().get();


Here's a query that skips the first five items, and then returns the next five:

	mToDoTable.skip(5).top(5).execute().get();

### <a name="selecting"></a>How to: Select specific columns

The following code illustrates how to return all items from a table of **ToDoItems**, but only displays
the **complete** and **text** fields. **mToDoTable** is the reference to the backend table that we 
created previously.

	List<ToDoItemNarrow> result = mToDoTable.select("complete", "text").execute().get();

The parameters to the select function are the string names of the table's columns that you want to return.

The **select** method needs to follow methods like **where** and **orderBy**. It can 
be followed by paging methods like **top**.

### <a name="chaining"></a>How to: Concatenate query methods

The methods used in querying backend tables can be concatenated. Chaining query methods allows you to select 
specific columns of filtered rows that are sorted and paged. You can create complex logical filters.
Each query method returns a Query object. To end the series of methods and actually run the query, call the 
**execute** method. For example:

	mToDoTable.where()
        .year("due").eq(2013)
		.and().startsWith("text", "PRI0")
		.or().field("duration").gt(10)
		.orderBy(duration, QueryOrder.Ascending)
        .select("id", "complete", "text", "duration")
        .top(20)
		.execute().get();

The chained query methods must be ordered as follows:

1. Filtering (**where**) methods.
2. Sorting (**orderBy**) methods.
3. Selection (**select**) methods.
4. paging (**skip** and **top**) methods.

##<a name="inserting"></a>How to: Insert data into the backend

Instantiate an instance of the *ToDoItem* class and set its properties.

	ToDoItem item = new ToDoItem();
	item.text = "Test Program";
	item.complete = false;

Then use **insert()** to insert an object:

	ToDoItem entity = mToDoTable.insert(item).get();

The returned entity matches the data inserted into the backend table, included the ID and any other values set 
on the backend.

Mobile Apps tables require a primary key column named **id**. By default, this column is a string. The default 
value of the ID column is a GUID.  You can provide other unique values, such as email addresses or usernames. When 
a string ID value is not provided for an inserted record, the backend generates a new GUID.

String ID values provide the following advantages:

+ IDs can be generated without making a round trip to the database.
+ Records are easier to merge from different tables or databases.
+ ID values integrate better with an application's logic.

String ID values are **REQUIRED** for offline sync support.

##<a name="updating"></a>How to: Update data in a mobile app

To update data in a table, pass the new object to the **update()** method.

    mToDoTable.update(item).get();

In this example, *item* is a reference to a row in the *ToDoItem* table, which has had some changes made to it.
The row with the same **id** is updated.

##<a name="deleting"></a>How to: Delete data in a mobile app

The following code shows how to delete data from a table by specifying the data object.

	mToDoTable.delete(item);

You can also delete an item by specifying the **id** field of the row to delete.

	String myRowId = "2FA404AB-E458-44CD-BC1B-3BC847EF0902";
   	mToDoTable.delete(myRowId);

##<a name="lookup"></a>How to: Look up a specific item

Look up an item with a specific **id** field with the **lookUp()** method:

	ToDoItem result = mToDoTable
						.lookUp("0380BAFB-BCFF-443C-B7D5-30199F730335")
						.get();

##<a name="untyped"></a>How to: Work with untyped data

The untyped programming model gives you exact control over JSON serialization.  There are some common
scenarios where you may wish to use an untyped programming model. For example, if your backend table 
contains many columns and you only need to reference a subset of the columns.  The typed model requires 
you to define all the mobile apps table's columns in your data class.  

Most of the API calls for accessing data are similar to the typed programming calls. The main difference 
is that in the untyped model you invoke methods on the **MobileServiceJsonTable** object, instead of 
the **MobileServiceTable** object.

### <a name="json_instance"></a>How to: Create an instance of an untyped table

Similar to the typed model, you start by getting a table reference, but in this case it's 
a **MobileServicesJsonTable** object. Obtain the reference by calling the **getTable** method on 
an instance of the client:

    private MobileServiceJsonTable mJsonToDoTable;
	//...
    mJsonToDoTable = mClient.getTable("ToDoItem");

Once you have created an instance of the **MobileServiceJsonTable**, it has virtually the same API
available as with the typed programming model. In some cases, the methods take an untyped parameter
instead of a typed parameter.

### <a name="json_insert"></a>How to: Insert into an untyped table

The following code shows how to do an insert. The first step is to create a [JsonObject][1], which is part 
of the [gson][3] library.

	JsonObject jsonItem = new JsonObject();
	jsonItem.addProperty("text", "Wake up");
	jsonItem.addProperty("complete", false);

Then, Use **insert()** to insert the untyped object into the table.

    mJsonToDoTable.insert(jsonItem).get();

If you need to get the ID of the inserted object, use the **getAsJsonPrimitive()** method.

	jsonItem.getAsJsonPrimitive("id").getAsInt());

### <a name="json_delete"></a>How to: Delete from an untyped table

The following code shows how to delete an instance, in this case, the same instance of a **JsonObject** 
that was created in the prior *insert* example. The code is the same as with the typed case, 
but the method has a different signature since it references an **JsonObject**.

         mToDoTable.delete(jsonItem);

You can also delete an instance directly by using its ID:

		 mToDoTable.delete(ID);

### <a name="json_get"></a>How to: Return all rows from an untyped table

The following code shows how to retrieve an entire table. Since you are using a JSON Table, you can 
selectively retrieve only some of the table's columns.

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

The same set of filtering, filtering and paging methods that are available for the typed model are available
for the untyped model as well.

##<a name="custom-api"></a>How to: Call a custom API

A custom API enables you to define custom endpoints that expose server functionality that does not map to 
an insert, update, delete, or read operation. By using a custom API, you can have more control over messaging, 
including reading and setting HTTP message headers and defining a message body format other than JSON.

From an Android client, you call the **invokeApi** method to call the custom API endpoint. The following 
example shows how to call an API endpoint named **completeAll**, which returns a collection class named 
**MarkAllResult**.

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

The **invokeApi** method is called on the client, which sends a POST request to the new custom API. The result 
returned by the custom API is displayed in a message dialog, as are any errors. Other versions of **invokeApi** 
let you optionally send an object in the request body, specify the HTTP method, and send query parameters with 
the request. Untyped versions of **invokeApi** are provided as well.

##<a name="authentication"></a>How to: add authentication to your app

Tutorials already describe in detail how to add these features.

App Service supports [authenticating app users](app-service-mobile-android-get-started-users.md) using a variety 
of external identity providers: Facebook, Google, Microsoft Account, Twitter, and Azure Active Directory. You 
can set permissions on tables to restrict access for specific operations to only authenticated users. You can 
also use the identity of authenticated users to implement authorization rules in your backend.

Two authentication flows are supported: a **server** flow and a **client** flow. The server flow provides the 
simplest authentication experience, as it relies on the identity providers web interface.  No additional SDKs
are required to implement server flow authentication. Server flow authentication does not provide a deep 
integration into the mobile device and is only recommended for proof of concept scenarios.

The client flow allows for deeper integration with device-specific capabilities such as single sign-on as it 
relies on SDKs provided by the identity provider.  For example, you can integrate the Facebook SDK into your
mobile application.  The mobile client swaps into the Facebook app and confirms your sign-on before swapping
back to your mobile app.

Four steps are required to enable authentication in your app:

- Register your app for authentication with an identity provider.
- Configure your App Service backend.
- Restrict table permissions to authenticated users only on the App Service backend.
- Add authentication code to your app.

You can set permissions on tables to restrict access for specific operations to only authenticated users. You 
can also use the SID of an authenticated user to modify requests.  For more information, review 
[Get started with authentication] and the Server SDK HOWTO documentation.

### <a name="caching"></a>How to: Add authentication code to your app

The following code starts a server flow login process using the Google provider:

	MobileServiceUser user = mClient.login(MobileServiceAuthenticationProvider.Google);

Obtain the ID of the logged-in user from a **MobileServiceUser** using the **getUserId** method. For an 
example of how to use Futures to call the asynchronous login APIs, see [Get started with authentication].

### <a name="caching"></a>How to: Cache authentication tokens

Caching authentication tokens requires you to store the User ID and authentication token locally on the 
device. The next time the app starts, you check the cache, and if these values are present, you can skip 
the log in procedure and rehydrate the client with this data. However this data is sensitive, and it 
should be stored encrypted for safety in case the phone gets stolen.

You can see a complete example of how to cache authentication tokens in [Cache authentication tokens section][7].

When you try to use an expired token, you receive a *401 unauthorized* response. You can handle authentication 
errors using filters.  Filters intercept requests to the App Service backend. The filter code tests the response 
for a 401, triggers the sign-in process, and then resumes the request that generated the 401. 

## <a name="adal"></a>How to: Authenticate users with the Active Directory Authentication Library

You can use the Active Directory Authentication Library (ADAL) to sign users into your application using Azure 
Active Directory. Using a client flow login is often preferable to using the `loginAsync()` methods as it provides 
a more native UX feel and allows for additional customization.

1. Configure your mobile app backend for AAD sign-in by following the [How to configure App Service for Active Directory login](app-service-mobile-how-to-configure-active-directory-authentication.md) tutorial. Make sure 
   to complete the optional step of registering a native client application.

2. Install ADAL by modifying your build.gradle file to include the following definitions:

```
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
```

3. Add the following code to your application, making the following replacements:

* Replace **INSERT-AUTHORITY-HERE** with the name of the tenant in which you provisioned your application. The 
  format should be https://login.windows.net/contoso.onmicrosoft.com. This value can be copied from the Domain 
  tab in your Azure Active Directory in the [Azure classic portal].

* Replace **INSERT-RESOURCE-ID-HERE** with the client ID for your mobile app backend. You can obtain the client
  ID from the **Advanced** tab under **Azure Active Directory Settings** in the portal.

* Replace **INSERT-CLIENT-ID-HERE** with the client ID you copied from the native client application.

* Replace **INSERT-REDIRECT-URI-HERE** with your site's _/.auth/login/done_ endpoint, using the HTTPS scheme. This 
  value should be similar to _https://contoso.azurewebsites.net/.auth/login/done_.

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

You can [read an overview][6] that describes how Microsoft Azure Notification Hubs supports a wide variety of 
push notifications.  In [this tutorial][5], a push notification is sent to all devices every time a record is 
inserted.

## How to: add offline sync to your app

The Quickstart tutorial contains code that implements offline sync. Look for code prefixed with comments:

	// Offline Sync

By uncommenting the following lines of code you can implement offline sync, and you can add similar code to 
other Mobile Apps code.

##<a name="customizing"></a>How to: Customize the client

There are several ways for you to customize the default behavior of the client.

### <a name="headers"></a>How to: Customize request headers

Configure a **ServiceFilter** to add a custom HTTP header to each request:

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

The client assumes that the table names, column names, and data types on the backend all match exactly the 
data objects defined in the client. There can be any number of reasons why the server and client names 
might not match. In your scenario, you might want to do the following kinds of customizations:

- The column names used in the App Service table don't match the names you are using in the client.
- Use an App Service table that has a different name than the class it maps to in the client.
- Turn on automatic property capitalization.
- Add complex properties to an object.

### <a name="columns"></a>How to: Map different client and server names

Suppose that your Java client code uses standard Java-style names for the **ToDoItem** object properties, 
such as the following properties:

- mId
- mText
- mComplete
- mDuration

Serialize the client names into JSON names that match the column names of the **ToDoItem** table 
on the server. The following code uses the [gson][3] library to annotate the properties:

	@com.google.gson.annotations.SerializedName("text")
	private String mText;

	@com.google.gson.annotations.SerializedName("id")
	private int mId;

	@com.google.gson.annotations.SerializedName("complete")
	private boolean mComplete;

	@com.google.gson.annotations.SerializedName("duration")
	private String mDuration;

### <a name="table"></a>How to: Map different table names between the client and the backend

Map the client table name to a different mobile services table name by using an override of the [getTable()][4] 
method:

	mToDoTable = mClient.getTable("ToDoItemBackup", ToDoItem.class);

### <a name="conversions"></a>How to: Automate column name mappings

You can specify a conversion strategy that applies to every column by using the [gson][3] API. The Android client 
library uses [gson][3] behind the scenes to serialize Java objects to JSON data before the data is sent to Azure 
App Service.  The following code uses the **setFieldNamingStrategy()** method to set the strategy. This example 
will delete the initial character (an "m"), and then lower-case the next character, for every field name. For
example, it would turn "mId" into "id."

	client.setGsonBuilder(
	    MobileServiceClient
	    .createMobileServiceGsonBuilder()
	    .setFieldNamingStrategy(new FieldNamingStrategy() {
	        public String translateName(Field field) {
	            String name = field.getName();
	            return Character.toLowerCase(name.charAt(1))
	                + name.substring(2);
	            }
	        });

This code must be executed before using the **MobileServiceClient**.

### <a name="complex"></a>How to: Store an object or array property into a table

So far, our serialization examples have involved primitive types such as integers and strings.  Primitive
types easily serialize into JSON.  If we want to add a complex object that doesn't automatically serialize
to JSON, we need to provide the JSON serialization method.  To see an example of how to provide custom
JSON serialization, review the blog post [Customizing serialization using the gson library in the Mobile Services Android client][2].

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
[1]: http://google-gson.googlecode.com/svn/trunk/gson/docs/javadocs/com/google/gson/JsonObject.html
[2]: http://hashtagfail.com/post/44606137082/mobile-services-android-serialization-gson
[3]: http://go.microsoft.com/fwlink/p/?LinkId=290801
[4]: http://go.microsoft.com/fwlink/p/?LinkId=296840
[5]: app-service-mobile-android-get-started-push.md
[6]: ../notification-hubs/notification-hubs-push-notification-overview.md#integration-with-app-service-mobile-apps
[7]: app-service-mobile-android-get-started-users.md#cache-tokens
[8]: http://azure.github.io/azure-mobile-apps-android-client/com/microsoft/windowsazure/mobileservices/table/MobileServiceTable.html
[9]: http://azure.github.io/azure-mobile-apps-android-client/com/microsoft/windowsazure/mobileservices/MobileServiceClient.html
[10]: app-service-mobile-dotnet-backend-how-to-use-server-sdk.md
[11]: app-service-mobile-node-backend-how-to-use-server-sdk.md
[12]: http://azure.github.io/azure-mobile-apps-android-client/
[13]: app-service-mobile-android-get-started.md#create-a-new-azure-mobile-app-backend
[14]: http://go.microsoft.com/fwlink/p/?LinkID=717034
[15]: app-service-mobile-dotnet-backend-how-to-use-server-sdk.md#how-to-define-a-table-controller
[16]: app-service-mobile-node-backend-how-to-use-server-sdk.md#TableOperations
[Future]: http://developer.android.com/reference/java/util/concurrent/Future.html
[AsyncTask]: http://developer.android.com/reference/android/os/AsyncTask.html