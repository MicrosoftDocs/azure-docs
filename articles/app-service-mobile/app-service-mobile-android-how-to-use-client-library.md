---
title: How to use the Azure Mobile Apps SDK for Android | Microsoft Docs
description: How to use the Azure Mobile Apps SDK for Android
services: app-service\mobile
documentationcenter: android
author: elamalani
manager: crdun

ms.assetid: 5352d1e4-7685-4a11-aaf4-10bd2fa9f9fc
ms.service: app-service-mobile
ms.workload: mobile
ms.tgt_pltfrm: mobile-android
ms.devlang: java
ms.topic: article
ms.date: 06/25/2019
ms.author: emalani
---

# How to use the Azure Mobile Apps SDK for Android

> [!NOTE]
> Visual Studio App Center is investing in new and integrated services central to mobile app development. Developers can use **Build**, **Test** and **Distribute** services to set up Continuous Integration and Delivery pipeline. Once the app is deployed, developers can monitor the status and usage of their app using the **Analytics** and **Diagnostics** services, and engage with users using the **Push** service. Developers can also leverage **Auth** to authenticate their users and **Data** service to persist and sync app data in the cloud. Check out [App Center](https://appcenter.ms/?utm_source=zumo&utm_campaign=app-service-mobile-android-how-to-use-client-library) today.
>

This guide shows you how to use the Android client SDK for Mobile Apps to implement common scenarios, such as:

* Querying for data (inserting, updating, and deleting).
* Authentication.
* Handling errors.
* Customizing the client.

This guide focuses on the client-side Android SDK.  To learn more about the server-side SDKs for Mobile Apps, see [Work with .NET backend SDK][10] or [How to use the Node.js backend SDK][11].

## Reference Documentation

You can find the [Javadocs API reference][12] for the Android client library on GitHub.

## Supported Platforms

The Azure Mobile Apps SDK for Android supports API levels 19 through 24 (KitKat through Nougat) for phone and tablet form factors.  Authentication, in particular, utilizes a common web framework approach to gather credentials.  Server-flow authentication does not work with small form factor devices such as watches.

## Setup and Prerequisites

Complete the [Mobile Apps quickstart](app-service-mobile-android-get-started.md) tutorial.  This task ensures all pre-requisites for developing Azure Mobile Apps have been met.  The Quickstart also helps you configure your account and create your first Mobile App backend.

If you decide not to complete the Quickstart tutorial, complete the following tasks:

* [create a Mobile App backend][13] to use with your Android app.
* In Android Studio, [update the Gradle build files](#gradle-build).
* [Enable internet permission](#enable-internet).

### <a name="gradle-build"></a>Update the Gradle build file

Change both **build.gradle** files:

1. Add this code to the *Project* level **build.gradle** file:

    ```gradle
    buildscript {
        repositories {
            jcenter()
            google()
        }
    }

    allprojects {
        repositories {
            jcenter()
            google()
        }
    }
    ```

2. Add this code to the *Module app* level **build.gradle** file inside the *dependencies* tag:

    ```gradle
    implementation 'com.microsoft.azure:azure-mobile-android:3.4.0@aar'
    ```

    Currently the latest version is 3.4.0. The supported versions are listed [on bintray][14].

### <a name="enable-internet"></a>Enable internet permission

To access Azure, your app must have the INTERNET permission enabled. If it's not already enabled, add the following line of code to your **AndroidManifest.xml** file:

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

## Create a Client Connection

Azure Mobile Apps provides four functions to your mobile application:

* Data Access and Offline Synchronization with an Azure Mobile Apps Service.
* Call Custom APIs written with the Azure Mobile Apps Server SDK.
* Authentication with Azure App Service Authentication and Authorization.
* Push Notification Registration with Notification Hubs.

Each of these functions first requires that you create a `MobileServiceClient` object.  Only one `MobileServiceClient` object should be created within your mobile client (that is, it should be a Singleton pattern).  To create a `MobileServiceClient` object:

```java
MobileServiceClient mClient = new MobileServiceClient(
    "<MobileAppUrl>",       // Replace with the Site URL
    this);                  // Your application Context
```

The `<MobileAppUrl>` is either a string or a URL object that points to your mobile backend.  If you are using Azure App Service to host your mobile backend, then ensure you use the secure `https://` version of the URL.

The client also requires access to the Activity or Context - the `this` parameter in the example.  The MobileServiceClient construction should happen within the `onCreate()` method of the Activity referenced in the `AndroidManifest.xml` file.

As a best practice, you should abstract server communication into its own (singleton-pattern) class.  In this case, you should pass the Activity within the constructor to appropriately configure the service.  For example:

```java
package com.example.appname.services;

import android.content.Context;
import com.microsoft.windowsazure.mobileservices.*;

public class AzureServiceAdapter {
    private String mMobileBackendUrl = "https://myappname.azurewebsites.net";
    private Context mContext;
    private MobileServiceClient mClient;
    private static AzureServiceAdapter mInstance = null;

    private AzureServiceAdapter(Context context) {
        mContext = context;
        mClient = new MobileServiceClient(mMobileBackendUrl, mContext);
    }

    public static void Initialize(Context context) {
        if (mInstance == null) {
            mInstance = new AzureServiceAdapter(context);
        } else {
            throw new IllegalStateException("AzureServiceAdapter is already initialized");
        }
    }

    public static AzureServiceAdapter getInstance() {
        if (mInstance == null) {
            throw new IllegalStateException("AzureServiceAdapter is not initialized");
        }
        return mInstance;
    }

    public MobileServiceClient getClient() {
        return mClient;
    }

    // Place any public methods that operate on mClient here.
}
```

You can now call `AzureServiceAdapter.Initialize(this);` in the `onCreate()` method of your main activity.  Any other methods needing access to the client use `AzureServiceAdapter.getInstance();` to obtain a reference to the service adapter.

## Data Operations

The core of the Azure Mobile Apps SDK is to provide access to data stored within SQL Azure on the Mobile App backend.  You can access this data using strongly typed classes (preferred) or untyped queries (not recommended).  The bulk of this section deals with using strongly typed classes.

### Define client data classes

To access data from SQL Azure tables, define client data classes that correspond to the tables in the Mobile App backend. Examples in this topic assume a table named **MyDataTable**, which has the following columns:

* id
* text
* complete

The corresponding typed client-side object resides in a file called **MyDataTable.java**:

```java
public class ToDoItem {
    private String id;
    private String text;
    private Boolean complete;
}
```

Add getter and setter methods for each field that you add.  If your SQL Azure table contains more columns, you would add the corresponding fields to this class.  For example, if the DTO (data transfer object) had an integer Priority column, then you might add this field, along with its getter and setter methods:

```java
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
```

To learn how to create additional tables in your Mobile Apps backend, see [How to: Define a table controller][15] (.NET backend) or [Define Tables using a Dynamic Schema][16] (Node.js backend).

An Azure Mobile Apps backend table defines five special fields, four of which are available to clients:

* `String id`: The globally unique ID for the record.  As a best practice, make the id the String representation of a [UUID][17] object.
* `DateTimeOffset updatedAt`: The date/time of the last update.  The updatedAt field is set by the server and should never be set by your client code.
* `DateTimeOffset createdAt`: The date/time that the object was created.  The createdAt field is set by the server and should never be set by your client code.
* `byte[] version`: Normally represented as a string, the version is also set by the server.
* `boolean deleted`: Indicates that the record has been deleted but not purged yet.  Do not use `deleted` as a property in your class.

The `id` field is required.  The `updatedAt` field and `version` field are used for offline synchronization (for incremental sync and conflict resolution respectively).  The `createdAt` field is a reference field and is not used by the client.  The names are "across-the-wire" names of the properties and are not adjustable.  However, you can create a mapping between your object and the "across-the-wire" names using the [gson][3] library.  For example:

```java
package com.example.zumoappname;

import com.microsoft.windowsazure.mobileservices.table.DateTimeOffset;

public class ToDoItem
{
    @com.google.gson.annotations.SerializedName("id")
    private String mId;
    public String getId() { return mId; }
    public final void setId(String id) { mId = id; }

    @com.google.gson.annotations.SerializedName("complete")
    private boolean mComplete;
    public boolean isComplete() { return mComplete; }
    public void setComplete(boolean complete) { mComplete = complete; }

    @com.google.gson.annotations.SerializedName("text")
    private String mText;
    public String getText() { return mText; }
    public final void setText(String text) { mText = text; }

    @com.google.gson.annotations.SerializedName("createdAt")
    private DateTimeOffset mCreatedAt;
    public DateTimeOffset getCreatedAt() { return mCreatedAt; }
    protected void setCreatedAt(DateTimeOffset createdAt) { mCreatedAt = createdAt; }

    @com.google.gson.annotations.SerializedName("updatedAt")
    private DateTimeOffset mUpdatedAt;
    public DateTimeOffset getUpdatedAt() { return mUpdatedAt; }
    protected void setUpdatedAt(DateTimeOffset updatedAt) { mUpdatedAt = updatedAt; }

    @com.google.gson.annotations.SerializedName("version")
    private String mVersion;
    public String getVersion() { return mVersion; }
    public final void setVersion(String version) { mVersion = version; }

    public ToDoItem() { }

    public ToDoItem(String id, String text) {
        this.setId(id);
        this.setText(text);
    }

    @Override
    public boolean equals(Object o) {
        return o instanceof ToDoItem && ((ToDoItem) o).mId == mId;
    }

    @Override
    public String toString() {
        return getText();
    }
}
```

### Create a Table Reference

To access a table, first create a [MobileServiceTable][8] object by calling the **getTable** method on the [MobileServiceClient][9].  This method has two overloads:

```java
public class MobileServiceClient {
    public <E> MobileServiceTable<E> getTable(Class<E> clazz);
    public <E> MobileServiceTable<E> getTable(String name, Class<E> clazz);
}
```

In the following code, **mClient** is a reference to your MobileServiceClient object.  The first overload is used where the class name and the table name are the same, and is the one used in the Quickstart:

```java
MobileServiceTable<ToDoItem> mToDoTable = mClient.getTable(ToDoItem.class);
```

The second overload is used when the table name is different from the class name: the first parameter is the table name.

```java
MobileServiceTable<ToDoItem> mToDoTable = mClient.getTable("ToDoItemBackup", ToDoItem.class);
```

## <a name="query"></a>Query a Backend Table

First, obtain a table reference.  Then execute a query on the table reference.  A query is any combination of:

* A `.where()` [filter clause](#filtering).
* An `.orderBy()` [ordering clause](#sorting).
* A `.select()` [field selection clause](#selection).
* A `.skip()` and `.top()` for [paged results](#paging).

The clauses must be presented in the preceding order.

### <a name="filter"></a> Filtering Results

The general form of a query is:

```java
List<MyDataTable> results = mDataTable
    // More filters here
    .execute()          // Returns a ListenableFuture<E>
    .get()              // Converts the async into a sync result
```

The preceding example returns all results (up to the maximum page size set by the server).  The `.execute()` method executes the query on the backend.  The query is converted to an [OData v3][19] query before transmission to the Mobile Apps backend.  On receipt, the Mobile Apps backend converts the query into an SQL statement before executing it on the SQL Azure instance.  Since network activity takes some time, The `.execute()` method returns a [`ListenableFuture<E>`][18].

### <a name="filtering"></a>Filter returned data

The following query execution returns all items from the **ToDoItem** table where **complete** equals **false**.

```java
List<ToDoItem> result = mToDoTable
    .where()
    .field("complete").eq(false)
    .execute()
    .get();
```

**mToDoTable** is the reference to the mobile service table that we created previously.

Define a filter using the **where** method call on the table reference. The **where** method is followed by a **field** method followed by a method that specifies the logical predicate. Possible predicate methods include **eq** (equals), **ne** (not equal), **gt** (greater than), **ge** (greater than or equal to), **lt** (less than), **le** (less than or equal to). These methods let you compare number and string fields to specific values.

You can filter on dates. The following methods let you compare the entire date field or parts of the date: **year**, **month**, **day**, **hour**, **minute**, and **second**. The following example adds a filter for items whose *due date* equals 2013.

```java
List<ToDoItem> results = MToDoTable
    .where()
    .year("due").eq(2013)
    .execute()
    .get();
```

The following methods support complex filters on string fields: **startsWith**, **endsWith**, **concat**, **subString**, **indexOf**, **replace**, **toLower**, **toUpper**, **trim**, and **length**. The following example filters for table rows where the *text* column starts with "PRI0."

```java
List<ToDoItem> results = mToDoTable
    .where()
    .startsWith("text", "PRI0")
    .execute()
    .get();
```

The following operator methods are supported on number fields: **add**, **sub**, **mul**, **div**, **mod**, **floor**, **ceiling**, and **round**. The following example filters for table rows where the **duration** is an even number.

```java
List<ToDoItem> results = mToDoTable
    .where()
    .field("duration").mod(2).eq(0)
    .execute()
    .get();
```

You can combine predicates with these logical methods: **and**, **or** and **not**. The following example combines two of the preceding examples.

```java
List<ToDoItem> results = mToDoTable
    .where()
    .year("due").eq(2013).and().startsWith("text", "PRI0")
    .execute()
    .get();
```

Group and nest logical operators:

```java
List<ToDoItem> results = mToDoTable
    .where()
    .year("due").eq(2013)
    .and(
        startsWith("text", "PRI0")
        .or()
        .field("duration").gt(10)
    )
    .execute().get();
```

For more detailed discussion and examples of filtering, see [Exploring the richness of the Android client query model][20].

### <a name="sorting"></a>Sort returned data

The following code returns all items from a table of **ToDoItems** sorted ascending by the *text* field. *mToDoTable* is the reference to the backend table that you created previously:

```java
List<ToDoItem> results = mToDoTable
    .orderBy("text", QueryOrder.Ascending)
    .execute()
    .get();
```

The first parameter of the **orderBy** method is a string equal to the name of the field on which to sort. The second parameter uses the **QueryOrder** enumeration to specify whether to sort ascending or descending.  If you are filtering using the ***where*** method, the ***where*** method must be invoked before the ***orderBy*** method.

### <a name="selection"></a>Select specific columns

The following code illustrates how to return all items from a table of **ToDoItems**, but only displays the **complete** and **text** fields. **mToDoTable** is the reference to the backend table that we created previously.

```java
List<ToDoItemNarrow> result = mToDoTable
    .select("complete", "text")
    .execute()
    .get();
```

The parameters to the select function are the string names of the table's columns that you want to return.  The **select** method needs to follow methods like **where** and **orderBy**. It can be followed by paging methods like **skip** and **top**.

### <a name="paging"></a>Return data in pages

Data is **ALWAYS** returned in pages.  The maximum number of records returned is set by the server.  If the client requests more records, then the server returns the maximum number of records.  By default, the maximum page size on the server is 50 records.

The first example shows how to select the top five items from a table. The query returns the items from a table of **ToDoItems**. **mToDoTable** is the reference to the backend table that you created previously:

```java
List<ToDoItem> result = mToDoTable
    .top(5)
    .execute()
    .get();
```

Here's a query that skips the first five items, and then returns the next five:

```java
List<ToDoItem> result = mToDoTable
    .skip(5).top(5)
    .execute()
    .get();
```

If you wish to get all records in a table, implement code to iterate over all pages:

```java
List<MyDataModel> results = new ArrayList<>();
int nResults;
do {
    int currentCount = results.size();
    List<MyDataModel> pagedResults = mDataTable
        .skip(currentCount).top(500)
        .execute().get();
    nResults = pagedResults.size();
    if (nResults > 0) {
        results.addAll(pagedResults);
    }
} while (nResults > 0);
```

A request for all records using this method creates a minimum of two requests to the Mobile Apps backend.

> [!TIP]
> Choosing the right page size is a balance between memory usage while the request is happening, bandwidth usage and delay in receiving the data completely.  The default (50 records) is suitable for all devices.  If you exclusively operate on larger memory devices, increase up to 500.  We have found that increasing the page size beyond 500 records results in unacceptable delays and large memory issues.

### <a name="chaining"></a>How to: Concatenate query methods

The methods used in querying backend tables can be concatenated. Chaining query methods allows you to select specific columns of filtered rows that are sorted and paged. You can create complex logical filters.  Each query method returns a Query object. To end the series of methods and actually run the query, call the **execute** method. For example:

```java
List<ToDoItem> results = mToDoTable
        .where()
        .year("due").eq(2013)
        .and(
            startsWith("text", "PRI0").or().field("duration").gt(10)
        )
        .orderBy(duration, QueryOrder.Ascending)
        .select("id", "complete", "text", "duration")
        .skip(200).top(100)
        .execute()
        .get();
```

The chained query methods must be ordered as follows:

1. Filtering (**where**) methods.
2. Sorting (**orderBy**) methods.
3. Selection (**select**) methods.
4. paging (**skip** and **top**) methods.

## <a name="binding"></a>Bind data to the user interface

Data binding involves three components:

* The data source
* The screen layout
* The adapter that ties the two together.

In our sample code, we return the data from the Mobile Apps SQL Azure table **ToDoItem** into an array. This activity is a common pattern for data applications.  Database queries often return a collection of rows that the client gets in a list or array. In this sample, the array is the data source.  The code specifies a screen layout that defines the view of the data that appears on the device.  The two are bound together with an adapter, which in this code is an extension of the **ArrayAdapter&lt;ToDoItem&gt;** class.

#### <a name="layout"></a>Define the Layout

The layout is defined by several snippets of XML code. Given an existing layout, the following code represents the **ListView** we want to populate with our server data.

```xml
    <ListView
        android:id="@+id/listViewToDo"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        tools:listitem="@layout/row_list_to_do" >
    </ListView>
```

In the preceding code, the *listitem* attribute specifies the id of the layout for an individual row in the list. This code specifies a check box and its associated text and gets instantiated once for each item in the list. This layout does not display the **id** field, and a more complex layout would specify additional fields in the display. This code is in the **row_list_to_do.xml** file.

```xml
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
```

#### <a name="adapter"></a>Define the adapter
Since the data source of our view is an array of **ToDoItem**, we subclass our adapter from an **ArrayAdapter&lt;ToDoItem&gt;** class. This subclass produces a View for every **ToDoItem** using the **row_list_to_do** layout.  In our code, we define the following class that is an extension of the **ArrayAdapter&lt;E&gt;** class:

```java
public class ToDoItemAdapter extends ArrayAdapter<ToDoItem> {
}
```

Override the adapters **getView** method. For example:

```java
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
```

We create an instance of this class in our Activity as follows:

```java
    ToDoItemAdapter mAdapter;
    mAdapter = new ToDoItemAdapter(this, R.layout.row_list_to_do);
```

The second parameter to the ToDoItemAdapter constructor is a reference to the layout. We can now instantiate the **ListView** and assign the adapter to the **ListView**.

```java
    ListView listViewToDo = (ListView) findViewById(R.id.listViewToDo);
    listViewToDo.setAdapter(mAdapter);
```

#### <a name="use-adapter"></a>Use the Adapter to Bind to the UI

You are now ready to use data binding. The following code shows how to get items in the table and fills the local adapter with the returned items.

```java
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
```

Call the adapter any time you modify the **ToDoItem** table. Since modifications are done on a record by record basis, you handle a single row instead of a collection. When you insert an item, call the **add** method on the adapter; when deleting, call the **remove** method.

You can find a complete example in the [Android Quickstart Project][21].

## <a name="inserting"></a>Insert data into the backend

Instantiate an instance of the *ToDoItem* class and set its properties.

```java
ToDoItem item = new ToDoItem();
item.text = "Test Program";
item.complete = false;
```

Then use **insert()** to insert an object:

```java
ToDoItem entity = mToDoTable
    .insert(item)       // Returns a ListenableFuture<ToDoItem>
    .get();
```

The returned entity matches the data inserted into the backend table, included the ID and any other values (such as the `createdAt`, `updatedAt`, and `version` fields) set on the backend.

Mobile Apps tables require a primary key column named **id**. This column must be a string. The default value of the ID column is a GUID.  You can provide other unique values, such as email addresses or usernames. When a string ID value is not provided for an inserted record, the backend generates a new GUID.

String ID values provide the following advantages:

* IDs can be generated without making a round trip to the database.
* Records are easier to merge from different tables or databases.
* ID values integrate better with an application's logic.

String ID values are **REQUIRED** for offline sync support.  You cannot change an Id once it is stored in the backend database.

## <a name="updating"></a>Update data in a mobile app

To update data in a table, pass the new object to the **update()** method.

```java
mToDoTable
    .update(item)   // Returns a ListenableFuture<ToDoItem>
    .get();
```

In this example, *item* is a reference to a row in the *ToDoItem* table, which has had some changes made to it.  The row with the same **id** is updated.

## <a name="deleting"></a>Delete data in a mobile app

The following code shows how to delete data from a table by specifying the data object.

```java
mToDoTable
    .delete(item);
```

You can also delete an item by specifying the **id** field of the row to delete.

```java
String myRowId = "2FA404AB-E458-44CD-BC1B-3BC847EF0902";
mToDoTable
    .delete(myRowId);
```

## <a name="lookup"></a>Look up a specific item by Id

Look up an item with a specific **id** field with the **lookUp()** method:

```java
ToDoItem result = mToDoTable
    .lookUp("0380BAFB-BCFF-443C-B7D5-30199F730335")
    .get();
```

## <a name="untyped"></a>How to: Work with untyped data

The untyped programming model gives you exact control over JSON serialization.  There are some common scenarios where you may wish to use an untyped programming model. For example, if your backend table contains many columns and you only need to reference a subset of the columns.  The typed model requires you to define all the columns defined in the Mobile Apps backend in your data class.  Most of the API calls for accessing data are similar to the typed programming calls. The main difference is that in the untyped model you invoke methods on the **MobileServiceJsonTable** object, instead of the **MobileServiceTable** object.

### <a name="json_instance"></a>Create an instance of an untyped table

Similar to the typed model, you start by getting a table reference, but in this case it's a **MobileServicesJsonTable** object. Obtain the reference by calling the **getTable** method on an instance of the client:

```java
private MobileServiceJsonTable mJsonToDoTable;
//...
mJsonToDoTable = mClient.getTable("ToDoItem");
```

Once you have created an instance of the **MobileServiceJsonTable**, it has virtually the same API available as with the typed programming model. In some cases, the methods take an untyped parameter instead of a typed parameter.

### <a name="json_insert"></a>Insert into an untyped table
The following code shows how to do an insert. The first step is to create a [JsonObject][1], which is part of the [gson][3] library.

```java
JsonObject jsonItem = new JsonObject();
jsonItem.addProperty("text", "Wake up");
jsonItem.addProperty("complete", false);
```

Then, Use **insert()** to insert the untyped object into the table.

```java
JsonObject insertedItem = mJsonToDoTable
    .insert(jsonItem)
    .get();
```

If you need to get the ID of the inserted object, use the **getAsJsonPrimitive()** method.

```java
String id = insertedItem.getAsJsonPrimitive("id").getAsString();
```
### <a name="json_delete"></a>Delete from an untyped table
The following code shows how to delete an instance, in this case, the same instance of a **JsonObject** that was created in the prior *insert* example. The code is the same as with the typed case, but the method has a different signature since it references an **JsonObject**.

```java
mToDoTable
    .delete(insertedItem);
```

You can also delete an instance directly by using its ID:

```java
mToDoTable.delete(ID);
```

### <a name="json_get"></a>Return all rows from an untyped table
The following code shows how to retrieve an entire table. Since you are using a JSON Table, you can selectively retrieve only some of the table's columns.

```java
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
```

The same set of filtering, filtering and paging methods that are available for the typed model are available for the untyped model.

## <a name="offline-sync"></a>Implement Offline Sync

The Azure Mobile Apps Client SDK also implements offline synchronization of data by using a SQLite database to store a copy of the server data locally.  Operations performed on an offline table do not require mobile connectivity to work.  Offline sync aids in resilience and performance at the expense of more complex logic for conflict resolution.  The Azure Mobile Apps Client SDK implements the following features:

* Incremental Sync: Only updated and new records are downloaded, saving bandwidth and memory consumption.
* Optimistic Concurrency: Operations are assumed to succeed.  Conflict Resolution is deferred until updates are performed on the server.
* Conflict Resolution: The SDK detects when a conflicting change has been made at the server and provides hooks to alert the user.
* Soft Delete: Deleted records are marked deleted, allowing other devices to update their offline cache.

### Initialize Offline Sync

Each offline table must be defined in the offline cache before use.  Normally, table definition is done immediately after the creation of the client:

```java
AsyncTask<Void, Void, Void> initializeStore(MobileServiceClient mClient)
    throws MobileServiceLocalStoreException, ExecutionException, InterruptedException
{
    AsyncTask<Void, Void, Void> task = new AsyncTask<Void, Void, Void>() {
        @Override
        protected void doInBackground(Void... params) {
            try {
                MobileServiceSyncContext syncContext = mClient.getSyncContext();
                if (syncContext.isInitialized()) {
                    return null;
                }
                SQLiteLocalStore localStore = new SQLiteLocalStore(mClient.getContext(), "offlineStore", null, 1);

                // Create a table definition.  As a best practice, store this with the model definition and return it via
                // a static method
                Map<String, ColumnDataType> toDoItemDefinition = new HashMap<String, ColumnDataType>();
                toDoItemDefinition.put("id", ColumnDataType.String);
                toDoItemDefinition.put("complete", ColumnDataType.Boolean);
                toDoItemDefinition.put("text", ColumnDataType.String);
                toDoItemDefinition.put("version", ColumnDataType.String);
                toDoItemDefinition.put("updatedAt", ColumnDataType.DateTimeOffset);

                // Now define the table in the local store
                localStore.defineTable("ToDoItem", toDoItemDefinition);

                // Specify a sync handler for conflict resolution
                SimpleSyncHandler handler = new SimpleSyncHandler();

                // Initialize the local store
                syncContext.initialize(localStore, handler).get();
            } catch (final Exception e) {
                createAndShowDialogFromTask(e, "Error");
            }
            return null;
        }
    };
    return runAsyncTask(task);
}
```

### Obtain a reference to the Offline Cache Table

For an online table, you use `.getTable()`.  For an offline table, use `.getSyncTable()`:

```java
MobileServiceSyncTable<ToDoItem> mToDoTable = mClient.getSyncTable("ToDoItem", ToDoItem.class);
```

All the methods that are available for online tables (including filtering, sorting, paging, inserting data, updating data, and deleting data) work equally well on online and offline tables.

### Synchronize the Local Offline Cache

Synchronization is within the control of your app.  Here is an example synchronization method:

```java
private AsyncTask<Void, Void, Void> sync(MobileServiceClient mClient) {
    AsyncTask<Void, Void, Void> task = new AsyncTask<Void, Void, Void>(){
        @Override
        protected Void doInBackground(Void... params) {
            try {
                MobileServiceSyncContext syncContext = mClient.getSyncContext();
                syncContext.push().get();
                mToDoTable.pull(null, "todoitem").get();
            } catch (final Exception e) {
                createAndShowDialogFromTask(e, "Error");
            }
            return null;
        }
    };
    return runAsyncTask(task);
}
```

If a query name is provided to the `.pull(query, queryname)` method, then incremental sync is used to return only records that have been created or changed since the last successfully completed pull.

### Handle Conflicts during Offline Synchronization

If a conflict happens during a `.push()` operation, a `MobileServiceConflictException` is thrown.   The server-issued item is embedded in the exception and can be retrieved by `.getItem()` on the exception.  Adjust the push by calling the following items on the MobileServiceSyncContext object:

*  `.cancelAndDiscardItem()`
*  `.cancelAndUpdateItem()`
*  `.updateOperationAndItem()`

Once all conflicts are marked as you wish, call `.push()` again to resolve all the conflicts.

## <a name="custom-api"></a>Call a custom API

A custom API enables you to define custom endpoints that expose server functionality that does not map to an insert, update, delete, or read operation. By using a custom API, you can have more control over messaging, including reading and setting HTTP message headers and defining a message body format other than JSON.

From an Android client, you call the **invokeApi** method to call the custom API endpoint. The following example shows how to call an API endpoint named **completeAll**, which returns a collection class named **MarkAllResult**.

```java
public void completeItem(View view) {
    ListenableFuture<MarkAllResult> result = mClient.invokeApi("completeAll", MarkAllResult.class);
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
```

The **invokeApi** method is called on the client, which sends a POST request to the new custom API. The result returned by the custom API is displayed in a message dialog, as are any errors. Other versions of **invokeApi** let you optionally send an object in the request body, specify the HTTP method, and send query parameters with the request. Untyped versions of **invokeApi** are provided as well.

## <a name="authentication"></a>Add authentication to your app

Tutorials already describe in detail how to add these features.

App Service supports [authenticating app users](app-service-mobile-android-get-started-users.md) using various external identity providers: Facebook, Google, Microsoft Account, Twitter, and Azure Active Directory. You can set permissions on tables to restrict access for specific operations to only authenticated users. You can also use the identity of authenticated users to implement authorization rules in your backend.

Two authentication flows are supported: a **server** flow and a **client** flow. The server flow provides the simplest authentication experience, as it relies on the identity providers web interface.  No additional SDKs are required to implement server flow authentication. Server flow authentication does not provide a deep integration into the mobile device and is only recommended for proof of concept scenarios.

The client flow allows for deeper integration with device-specific capabilities such as single sign-on as it relies on SDKs provided by the identity provider.  For example, you can integrate the Facebook SDK into your mobile application.  The mobile client swaps into the Facebook app and confirms your sign-on before swapping back to your mobile app.

Four steps are required to enable authentication in your app:

* Register your app for authentication with an identity provider.
* Configure your App Service backend.
* Restrict table permissions to authenticated users only on the App Service backend.
* Add authentication code to your app.

You can set permissions on tables to restrict access for specific operations to only authenticated users. You can also use the SID of an authenticated user to modify requests.  For more information, review [Get started with authentication] and the Server SDK HOWTO documentation.

### <a name="caching"></a>Authentication: Server Flow

The following code starts a server flow login process using the Google provider.  Additional configuration is required because of the security requirements for the Google provider:

```java
MobileServiceUser user = mClient.login(MobileServiceAuthenticationProvider.Google, "{url_scheme_of_your_app}", GOOGLE_LOGIN_REQUEST_CODE);
```

In addition, add the following method to the main Activity class:

```java
// You can choose any unique number here to differentiate auth providers from each other. Note this is the same code at login() and onActivityResult().
public static final int GOOGLE_LOGIN_REQUEST_CODE = 1;

@Override
protected void onActivityResult(int requestCode, int resultCode, Intent data) {
    // When request completes
    if (resultCode == RESULT_OK) {
        // Check the request code matches the one we send in the login request
        if (requestCode == GOOGLE_LOGIN_REQUEST_CODE) {
            MobileServiceActivityResult result = mClient.onActivityResult(data);
            if (result.isLoggedIn()) {
                // login succeeded
                createAndShowDialog(String.format("You are now logged in - %1$2s", mClient.getCurrentUser().getUserId()), "Success");
                createTable();
            } else {
                // login failed, check the error message
                String errorMessage = result.getErrorMessage();
                createAndShowDialog(errorMessage, "Error");
            }
        }
    }
}
```

The `GOOGLE_LOGIN_REQUEST_CODE` defined in your main Activity is used for the `login()` method and within the `onActivityResult()` method.  You can choose any unique number, as long as the same number is used within the `login()` method and the `onActivityResult()` method.  If you abstract the client code into a service adapter (as shown earlier), you should call the appropriate methods on the service adapter.

You also need to configure the project for customtabs.  First specify a redirect-URL.  Add the following snippet to `AndroidManifest.xml`:

```xml
<activity android:name="com.microsoft.windowsazure.mobileservices.authentication.RedirectUrlActivity">
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="{url_scheme_of_your_app}" android:host="easyauth.callback"/>
    </intent-filter>
</activity>
```

Add the **redirectUriScheme** to the `build.gradle` file for your application:

```gradle
android {
    buildTypes {
        release {
            // … …
            manifestPlaceholders = ['redirectUriScheme': '{url_scheme_of_your_app}://easyauth.callback']
        }
        debug {
            // … …
            manifestPlaceholders = ['redirectUriScheme': '{url_scheme_of_your_app}://easyauth.callback']
        }
    }
}
```

Finally, add `com.android.support:customtabs:28.0.0` to the dependencies list in the `build.gradle` file:

```gradle
dependencies {
    implementation fileTree(dir: 'libs', include: ['*.jar'])
    implementation 'com.google.code.gson:gson:2.3'
    implementation 'com.google.guava:guava:18.0'
    implementation 'com.android.support:customtabs:28.0.0'
    implementation 'com.squareup.okhttp:okhttp:2.5.0'
    implementation 'com.microsoft.azure:azure-mobile-android:3.4.0@aar'
    implementation 'com.microsoft.azure:azure-notifications-handler:1.0.1@jar'
}
```

Obtain the ID of the logged-in user from a **MobileServiceUser** using the **getUserId** method. For an example of how to use Futures to call the asynchronous login APIs, see [Get started with authentication].

> [!WARNING]
> The URL Scheme mentioned is case-sensitive.  Ensure that all occurrences of `{url_scheme_of_you_app}` match case.

### <a name="caching"></a>Cache authentication tokens

Caching authentication tokens requires you to store the User ID and authentication token locally on the device. The next time the app starts, you check the cache, and if these values are present, you can skip the log in procedure and rehydrate the client with this data. However this data is sensitive, and it should be stored encrypted for safety in case the phone gets stolen.  You can see a complete example of how to cache authentication tokens in [Cache authentication tokens section][7].

When you try to use an expired token, you receive a *401 unauthorized* response. You can handle authentication errors using filters.  Filters intercept requests to the App Service backend. The filter code tests the response for a 401, triggers the sign-in process, and then resumes the request that generated the 401.

### <a name="refresh"></a>Use Refresh Tokens

The token returned by Azure App Service Authentication and Authorization has a defined life time of one hour.  After this period, you must reauthenticate the user.  If you are using a long-lived token that you have received via client-flow authentication, then you can reauthenticate with Azure App Service Authentication and Authorization using the same token.  Another Azure App Service token is generated with a new lifetime.

You can also register the provider to use Refresh Tokens.  A Refresh Token is not always available.  Additional configuration is required:

* For **Azure Active Directory**, configure a client secret for the Azure Active Directory App.  Specify the client secret in the Azure App Service when configuring Azure Active Directory Authentication.  When calling `.login()`, pass `response_type=code id_token` as a parameter:

    ```java
    HashMap<String, String> parameters = new HashMap<String, String>();
    parameters.put("response_type", "code id_token");
    MobileServiceUser user = mClient.login
        MobileServiceAuthenticationProvider.AzureActiveDirectory,
        "{url_scheme_of_your_app}",
        AAD_LOGIN_REQUEST_CODE,
        parameters);
    ```

* For **Google**, pass the `access_type=offline` as a parameter:

    ```java
    HashMap<String, String> parameters = new HashMap<String, String>();
    parameters.put("access_type", "offline");
    MobileServiceUser user = mClient.login
        MobileServiceAuthenticationProvider.Google,
        "{url_scheme_of_your_app}",
        GOOGLE_LOGIN_REQUEST_CODE,
        parameters);
    ```

* For **Microsoft Account**, select the `wl.offline_access` scope.

To refresh a token, call `.refreshUser()`:

```java
MobileServiceUser user = mClient
    .refreshUser()  // async - returns a ListenableFuture<MobileServiceUser>
    .get();
```

As a best practice, create a filter that detects a 401 response from the server and tries to refresh the user token.

## Log in with Client-flow Authentication

The general process for logging in with client-flow authentication is as follows:

* Configure Azure App Service Authentication and Authorization as you would server-flow authentication.
* Integrate the authentication provider SDK for authentication to produce an access token.
* Call the `.login()` method as follows (`result` should be an `AuthenticationResult`):

    ```java
    JSONObject payload = new JSONObject();
    payload.put("access_token", result.getAccessToken());
    ListenableFuture<MobileServiceUser> mLogin = mClient.login("{provider}", payload.toString());
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
    ```

See the complete code example in the next section.

Replace the `onSuccess()` method with whatever code you wish to use on a successful login.  The `{provider}` string is a valid provider: **aad** (Azure Active Directory), **facebook**, **google**, **microsoftaccount**, or **twitter**.  If you have implemented custom authentication, then you can also use the custom authentication provider tag.

### <a name="adal"></a>Authenticate users with the Active Directory Authentication Library (ADAL)

You can use the Active Directory Authentication Library (ADAL) to sign users into your application using Azure Active Directory. Using a client flow login is often preferable to using the `loginAsync()` methods as it provides a more native UX feel and allows for additional customization.

1. Configure your mobile app backend for AAD sign-in by following the [How to configure App Service for Active Directory login][22] tutorial. Make sure to complete the optional step of registering a native client application.
2. Install ADAL by modifying your build.gradle file to include the following definitions:

    ```gradle
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
        implementation fileTree(dir: 'libs', include: ['*.jar'])
        implementation('com.microsoft.aad:adal:1.16.1') {
            exclude group: 'com.android.support'
        } // Recent version is 1.16.1
        implementation 'com.android.support:support-v4:28.0.0'
    }
    ```

3. Add the following code to your application, making the following replacements:

    * Replace **INSERT-AUTHORITY-HERE** with the name of the tenant in which you provisioned your application. The format should be https://login.microsoftonline.com/contoso.onmicrosoft.com.
    * Replace **INSERT-RESOURCE-ID-HERE** with the client ID for your mobile app backend. You can obtain the client ID from the **Advanced** tab under **Azure Active Directory Settings** in the portal.
    * Replace **INSERT-CLIENT-ID-HERE** with the client ID you copied from the native client application.
    * Replace **INSERT-REDIRECT-URI-HERE** with your site's */.auth/login/done* endpoint, using the HTTPS scheme. This value should be similar to *https://contoso.azurewebsites.net/.auth/login/done*.

```java
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
```

## <a name="filters"></a>Adjust the Client-Server Communication

The Client connection is normally a basic HTTP connection using the underlying HTTP library supplied with the Android SDK.  There are several reasons why you would want to change that:

* You wish to use an alternate HTTP library to adjust timeouts.
* You wish to provide a progress bar.
* You wish to add a custom header to support API management functionality.
* You wish to intercept a failed response so that you can implement reauthentication.
* You wish to log backend requests to an analytics service.

### Using an alternate HTTP Library

Call the `.setAndroidHttpClientFactory()` method immediately after creating your client reference.  For example, to set the connection timeout to 60 seconds (instead of the default 10 seconds):

```java
mClient = new MobileServiceClient("https://myappname.azurewebsites.net");
mClient.setAndroidHttpClientFactory(new OkHttpClientFactory() {
    @Override
    public OkHttpClient createOkHttpClient() {
        OkHttpClient client = new OkHttpClient();
        client.setReadTimeout(60, TimeUnit.SECONDS);
        client.setWriteTimeout(60, TimeUnit.SECONDS);
        return client;
    }
});
```

### Implement a Progress Filter

You can implement an intercept of every request by implementing a `ServiceFilter`.  For example, the following updates a pre-created progress bar:

```java
private class ProgressFilter implements ServiceFilter {
    @Override
    public ListenableFuture<ServiceFilterResponse> handleRequest(ServiceFilterRequest request, NextServiceFilterCallback next) {
        final SettableFuture<ServiceFilterResponse> resultFuture = SettableFuture.create();
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (mProgressBar != null) mProgressBar.setVisibility(ProgressBar.VISIBLE);
            }
        });

        ListenableFuture<ServiceFilterResponse> future = next.onNext(request);
        Futures.addCallback(future, new FutureCallback<ServiceFilterResponse>() {
            @Override
            public void onFailure(Throwable e) {
                resultFuture.setException(e);
            }
            @Override
            public void onSuccess(ServiceFilterResponse response) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        if (mProgressBar != null)
                            mProgressBar.setVisibility(ProgressBar.GONE);
                    }
                });
                resultFuture.set(response);
            }
        });
        return resultFuture;
    }
}
```

You can attach this filter to the client as follows:

```java
mClient = new MobileServiceClient(applicationUrl).withFilter(new ProgressFilter());
```

### Customize Request Headers

Use the following `ServiceFilter` and attach the filter in the same way as the `ProgressFilter`:

```java
private class CustomHeaderFilter implements ServiceFilter {
    @Override
    public ListenableFuture<ServiceFilterResponse> handleRequest(ServiceFilterRequest request, NextServiceFilterCallback next) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                request.addHeader("X-APIM-Router", "mobileBackend");
            }
        });
        SettableFuture<ServiceFilterResponse> result = SettableFuture.create();
        try {
            ServiceFilterResponse response = next.onNext(request).get();
            result.set(response);
        } catch (Exception exc) {
            result.setException(exc);
        }
    }
}
```

### <a name="conversions"></a>Configure Automatic Serialization

You can specify a conversion strategy that applies to every column by using the [gson][3] API. The Android client library uses [gson][3] behind the scenes to serialize Java objects to JSON data before the data is sent to Azure App Service.  The following code uses the **setFieldNamingStrategy()** method to set the strategy. This example will delete the initial character (an "m"), and then lower-case the next character, for every field name. For example, it would turn "mId" into "id."  Implement a conversion strategy to reduce the need for `SerializedName()` annotations on most fields.

```java
FieldNamingStrategy namingStrategy = new FieldNamingStrategy() {
    public String translateName(File field) {
        String name = field.getName();
        return Character.toLowerCase(name.charAt(1)) + name.substring(2);
    }
}

client.setGsonBuilder(
    MobileServiceClient
        .createMobileServiceGsonBuilder()
        .setFieldNamingStrategy(namingStrategy)
);
```

This code must be executed before creating a mobile client reference using the **MobileServiceClient**.

<!-- URLs. -->
[Get started with Azure Mobile Apps]: app-service-mobile-android-get-started.md
[ASCII control codes C0 and C1]: https://en.wikipedia.org/wiki/Data_link_escape_character#C1_set
[Mobile Services SDK for Android]: https://go.microsoft.com/fwlink/p/?LinkID=717033
[Azure portal]: https://portal.azure.com
[Get started with authentication]: app-service-mobile-android-get-started-users.md
[1]: https://static.javadoc.io/com.google.code.gson/gson/2.8.5/com/google/gson/JsonObject.html
[2]: https://hashtagfail.com/post/44606137082/mobile-services-android-serialization-gson
[3]: https://www.javadoc.io/doc/com.google.code.gson/gson/2.8.5
[4]: https://go.microsoft.com/fwlink/p/?LinkId=296840
[5]: app-service-mobile-android-get-started-push.md
[6]: ../notification-hubs/notification-hubs-push-notification-overview.md#integration-with-app-service-mobile-apps
[7]: app-service-mobile-android-get-started-users.md#cache-tokens
[8]: https://azure.github.io/azure-mobile-apps-android-client/com/microsoft/windowsazure/mobileservices/table/MobileServiceTable.html
[9]: https://azure.github.io/azure-mobile-apps-android-client/com/microsoft/windowsazure/mobileservices/MobileServiceClient.html
[10]: app-service-mobile-dotnet-backend-how-to-use-server-sdk.md
[11]: app-service-mobile-node-backend-how-to-use-server-sdk.md
[12]: https://azure.github.io/azure-mobile-apps-android-client/
[13]: app-service-mobile-android-get-started.md#create-a-new-azure-mobile-app-backend
[14]: https://go.microsoft.com/fwlink/p/?LinkID=717034
[15]: app-service-mobile-dotnet-backend-how-to-use-server-sdk.md#define-table-controller
[16]: app-service-mobile-node-backend-how-to-use-server-sdk.md#TableOperations
[17]: https://developer.android.com/reference/java/util/UUID.html
[18]: https://github.com/google/guava/wiki/ListenableFutureExplained
[19]: https://www.odata.org/documentation/odata-version-3-0/
[20]: https://hashtagfail.com/post/46493261719/mobile-services-android-querying
[21]: https://github.com/Azure-Samples/azure-mobile-apps-android-quickstart
[22]: ../app-service/configure-authentication-provider-aad.md
[Future]: https://developer.android.com/reference/java/util/concurrent/Future.html
[AsyncTask]: https://developer.android.com/reference/android/os/AsyncTask.html
