<properties
	pageTitle="Working with the Mobile Services Android Client Library"
	description="Learn how to use an Android client for Azure Mobile Services."
	services="mobile-services"
	documentationCenter="android"
	authors="RickSaling"
	manager="erikre"
	editor=""/>

<tags
	ms.service="mobile-services"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-android"
	ms.devlang="java"
	ms.topic="article"
	ms.date="07/21/2016"
	ms.author="ricksal"/>


# How to use the Android client library for Mobile Services

[AZURE.INCLUDE [mobile-services-selector-client-library](../../includes/mobile-services-selector-client-library.md)]

&nbsp;

[AZURE.INCLUDE [mobile-service-note-mobile-apps](../../includes/mobile-services-note-mobile-apps.md)]
> For the equivalent Mobile Apps version of this topic, see [How to use the Android client library for Mobile Apps](../app-service-mobile/app-service-mobile-android-how-to-use-client-library.md).
 
This guide shows you how to perform common scenarios using the Android client for Azure Mobile Services.  The scenarios covered include querying for data; inserting, updating, and deleting data, authenticating users, handling errors, and customizing the client.

If you are new to Mobile Services, you should first complete the quickstart tutorial [Get started with Mobile Services]. Successfully completing that tutorial ensures that you will have  installed Android Studio; it will help you configure your account and create your first mobile service, and install the Mobile Services SDK, which supports Android version 2.2 or later, but we recommend building against Android version 4.2 or later.

You can find the Javadocs API reference for the Android client library [here](http://go.microsoft.com/fwlink/p/?LinkId=298735).

[AZURE.INCLUDE [mobile-services-concepts](../../includes/mobile-services-concepts.md)]

##<a name="setup"></a>Setup and Prerequisites

We assume that you have created a mobile service and a table. For more information see [Create a table](http://go.microsoft.com/fwlink/p/?LinkId=298592). In the code used in this topic, we assume the table is named *ToDoItem*, and that it has the following columns:

- id
- text
- complete

The corresponding typed client side object is the following:

	public class ToDoItem {
		private String id;
		private String text;
		private Boolean complete;
	}

When dynamic schema is enabled, Azure Mobile Services automatically generates new columns based on the object in the insert or update request. For more information, see [Dynamic schema](http://go.microsoft.com/fwlink/p/?LinkId=296271).

##<a name="create-client"></a>How to: Create the Mobile Services client
The following code creates the [MobileServiceClient](http://dl.windowsazure.com/androiddocs/com/microsoft/windowsazure/mobileservices/MobileServiceClient.html) object that is used to access your mobile service. The code goes in the `onCreate` method of the Activity class specified in *AndroidManifest.xml* as a **MAIN** action and **LAUNCHER** category.

		MobileServiceClient mClient = new MobileServiceClient(
				"MobileServiceUrl", // Replace with the above Site URL
				"AppKey", 			// replace with the Application Key
				this)

In the code above, replace `MobileServiceUrl` and `AppKey` with the mobile service URL and application key, in that order. Both of these are available on the Azure classic portal, by selecting your mobile service and then clicking on *Dashboard*.

##<a name="instantiating"></a>How to: Create a table reference

The easiest way to query or modify data in the mobile service is by using the *typed programming model*, since Java is a strongly typed language (later on we will discuss the *untyped* model). This model provides seamless serialization and deserialization to JSON using the [gson](http://go.microsoft.com/fwlink/p/?LinkId=290801) library when sending data between the client and the mobile service: the developer doesn't have to do anything, the framework handles it all.

The first thing you do to query or modify data is to create a [MobileServiceTable](http://go.microsoft.com/fwlink/p/?LinkId=296835) object by calling the **getTable** method on the [**MobileServiceClient**](http://dl.windowsazure.com/androiddocs/com/microsoft/windowsazure/mobileservices/MobileServiceClient.html).  We will look at two overloads of this method:

	public class MobileServiceClient {
	    public <E> MobileServiceTable<E> getTable(Class<E> clazz);
	    public <E> MobileServiceTable<E> getTable(String name, Class<E> clazz);
	}

In the following code, *mClient* is a reference to your mobile service client.

The [first overload](http://go.microsoft.com/fwlink/p/?LinkId=296839) is used where the class name and the table name are the same:

		MobileServiceTable<ToDoItem> mToDoTable = mClient.getTable(ToDoItem.class);


The [2nd overload](http://go.microsoft.com/fwlink/p/?LinkId=296840) is used when the table name is different from the type name.

		MobileServiceTable<ToDoItem> mToDoTable = mClient.getTable("ToDoItemBackup", ToDoItem.class);

## <a name="api"></a>The API structure

Since version 2.0 of the client library, mobile services table operations use the [Future](http://developer.android.com/reference/java/util/concurrent/Future.html) and [AsyncTask](http://developer.android.com/reference/android/os/AsyncTask.html) objects in all of the asynchronous operations such as methods involving queries and operations like inserts, updates and deletes. This makes it easier to perform multiple operations (while on a background thread) without having to deal with multiple nested callbacks.


##<a name="querying"></a>How to: Query data from a mobile service

This section describes how to issue queries to the mobile service. Subsections describe diffent aspects such as sorting, filtering, and paging. Finally, we discuss how you can concatenate these operations together.

### <a name="showAll"></a>How to: Return all Items from a Table

The following code returns all items in the *ToDoItem* table. It displays them in the UI by adding the items to an adapter. This code is similar to what is in the the quickstart tutorial [Get started with Mobile Services].

		new AsyncTask<Void, Void, Void>() {

            @Override
            protected Void doInBackground(Void... params) {
                try {

					final MobileServiceList<ToDoItem> result = mToDoTable.execute().get();
                    runOnUiThread(new Runnable() {

                        @Override
                        public void run() {
                            mAdapter.clear();
                            for (ToDoItem item : result) {
                                mAdapter.add(item);
                            }
                        }
                    });
               } catch (Exception exception) {
                    createAndShowDialog(exception, "Error");
               }
               return result;
            }
		}.execute();


Queries like this one use the [AsyncTask](http://developer.android.com/reference/android/os/AsyncTask.html) object.

The *result* variable returns the result set from the query, and the code following the `mToDoTable.execute().get()` statement shows how to display the individual rows.


### <a name="filtering"></a>How to: Filter returned data

The following code returns all items from the *ToDoItem* table whose *complete* field equals *false*. *mToDoTable* is the reference to the mobile service table that we created previously.

        new AsyncTask<Void, Void, Void>() {
            @Override
            protected Void doInBackground(Void... params) {
                try {
                    final MobileServiceList<ToDoItem> result =
						mToDoTable.where().field("complete").eq(false).execute().get();
					for (ToDoItem item : result) {
                		Log.i(TAG, "Read object with ID " + item.id);
					}
                } catch (Exception exception) {
                    createAndShowDialog(exception, "Error");
                }
                return null;
            }
        }.execute();



You start a filter with a [**where**](http://go.microsoft.com/fwlink/p/?LinkId=296867) method call on the table reference. This is followed by a [**field**](http://go.microsoft.com/fwlink/p/?LinkId=296869) method call followed by a method call that specifies the logical predicate. Possible predicate methods include [**eq**](http://go.microsoft.com/fwlink/p/?LinkId=298461), [**ne**](http://go.microsoft.com/fwlink/p/?LinkId=298462), [**gt**](http://go.microsoft.com/fwlink/p/?LinkId=298463), [**ge**](http://go.microsoft.com/fwlink/p/?LinkId=298464), [**lt**](http://go.microsoft.com/fwlink/p/?LinkId=298465), [**le**](http://go.microsoft.com/fwlink/p/?LinkId=298466) etc.

This is sufficient for comparing number and string fields to specific values. But you can do a lot more.

For example, you can filter on dates. You can compare the entire date field, but you can also compare parts of the date, with methods such as [**year**](http://go.microsoft.com/fwlink/p/?LinkId=298467), [**month**](http://go.microsoft.com/fwlink/p/?LinkId=298468), [**day**](http://go.microsoft.com/fwlink/p/?LinkId=298469), [**hour**](http://go.microsoft.com/fwlink/p/?LinkId=298470), [**minute**](http://go.microsoft.com/fwlink/p/?LinkId=298471) and [**second**](http://go.microsoft.com/fwlink/p/?LinkId=298472). The following partial code adds a filter for items whose *due date* equals 2013.

		mToDoTable.where().year("due").eq(2013).execute().get();

You can do a wide variety of complex filters on string fields with methods like [**startsWith**](http://go.microsoft.com/fwlink/p/?LinkId=298473), [**endsWith**](http://go.microsoft.com/fwlink/p/?LinkId=298474), [**concat**](http://go.microsoft.com/fwlink/p/?LinkId=298475), [**subString**](http://go.microsoft.com/fwlink/p/?LinkId=298477), [**indexOf**](http://go.microsoft.com/fwlink/p/?LinkId=298488), [**replace**](http://go.microsoft.com/fwlink/p/?LinkId=298491), [**toLower**](http://go.microsoft.com/fwlink/p/?LinkId=298492), [**toUpper**](http://go.microsoft.com/fwlink/p/?LinkId=298493), [**trim**](http://go.microsoft.com/fwlink/p/?LinkId=298495), and [**length**](http://go.microsoft.com/fwlink/p/?LinkId=298496). The following partial code filters for table rows where the *text* column starts with "PRI0".

		mToDoTable.where().startsWith("text", "PRI0").execute().get();

Number fields also allow a wide variety of more complex filters with methods like [**add**](http://go.microsoft.com/fwlink/p/?LinkId=298497), [**sub**](http://go.microsoft.com/fwlink/p/?LinkId=298499), [**mul**](http://go.microsoft.com/fwlink/p/?LinkId=298500), [**div**](http://go.microsoft.com/fwlink/p/?LinkId=298502), [**mod**](http://go.microsoft.com/fwlink/p/?LinkId=298503), [**floor**](http://go.microsoft.com/fwlink/p/?LinkId=298505), [**ceiling**](http://go.microsoft.com/fwlink/p/?LinkId=298506), and [**round**](http://go.microsoft.com/fwlink/p/?LinkId=298507). The following partial code filters for table rows where the *duration* is an even number.

		mToDoTable.where().field("duration").mod(2).eq(0).execute().get();


You can combine predicates with methods like [**and**](http://go.microsoft.com/fwlink/p/?LinkId=298512), [**or**](http://go.microsoft.com/fwlink/p/?LinkId=298514) and [**not**](http://go.microsoft.com/fwlink/p/?LinkId=298515). This partial code combines two of the above examples.

		mToDoTable.where().year("due").eq(2013).and().startsWith("text", "PRI0")
					.execute().get();

And you can group and nest logical operators, as shown in this partial code:

		mToDoTable.where()
					.year("due").eq(2013)
						.and
					(startsWith("text", "PRI0").or().field("duration").gt(10))
					.execute().get();

For more detailed discussion and examples of filtering, see [Exploring the richness of the Mobile Services Android client query model](http://hashtagfail.com/post/46493261719/mobile-services-android-querying).

### <a name="sorting"></a>How to: Sort returned data

The following code returns all items from a table of *ToDoItems* sorted ascending by the *text* field. *mToDoTable* is the reference to the mobile mervice table that you created previously.

		mToDoTable.orderBy("text", QueryOrder.Ascending).execute().get();

The first parameter of the [**orderBy**](http://go.microsoft.com/fwlink/p/?LinkId=298519) method is a string equal to the name of the field on which to sort.

The second parameter uses the [**QueryOrder**](http://go.microsoft.com/fwlink/p/?LinkId=298521) enumeration to specify whether to sort ascending or descending.

Note that if you are filtering using the ***where*** method, the ***where*** method must be invoked prior to the ***orderBy*** method.

### <a name="paging"></a>How to: Return data in pages

The first example shows how to select the top 5 items from a table. The query returns the items from a table of  *ToDoItems*. *mToDoTable* is the reference to the mobile service table that you created previously.

       final MobileServiceList<ToDoItem> result = mToDoTable.top(5).execute().get();


Next, we define a query that skips the first 5 items, and then returns the next 5.

		mToDoTable.skip(5).top(5).execute().get();


### <a name="selecting"></a>How to: Select specific columns

The following code illustrates how to return all items from a table of  *ToDoItems*, but only displays the *complete* and *text* fields. *mToDoTable* is the reference to the mobile service table that we created previously.

		mToDoTable.select("complete", "text").execute().get();


Here the parameters to the select function are the string names of the table's columns that you want to return.

The [**select**](http://go.microsoft.com/fwlink/p/?LinkId=290689) method needs to follow methods like [**where**](http://go.microsoft.com/fwlink/p/?LinkId=296296) and [**orderBy**](http://go.microsoft.com/fwlink/p/?LinkId=296313), if they are present. It can be followed by methods like [**top**](http://go.microsoft.com/fwlink/p/?LinkId=298731).

### <a name="chaining"></a>How to: Concatenate query methods

The methods used in querying mobile mervice tables can be concatenated. This allows you to do things like select specific columns of filtered rows that are sorted and paged. You can create quite complex logical filters.

What makes this work is that the query methods you use return [**MobileServiceQuery&lt;T&gt;**](http://go.microsoft.com/fwlink/p/?LinkId=298551) objects, which can in turn have additional methods invoked on them. To end the series of methods and actually run the query, you call the [**execute**](http://go.microsoft.com/fwlink/p/?LinkId=298554) method.

Here's a code sample where *mToDoTable* is a reference to the mobile services *ToDoItem* table.

		mToDoTable.where().year("due").eq(2013)
						.and().startsWith("text", "PRI0")
						.or().field("duration").gt(10)
					.select("id", "complete", "text", "duration")
					.orderBy(duration, QueryOrder.Ascending).top(20)
					.execute().get();

The main requirement in chaining methods together is that the *where* method and predicates need to come first. After that, you can call subsequent methods in the order that best meets the needs of your application.


##<a name="inserting"></a>How to: Insert data into a mobile service

The following code shows how to insert a new row into a table.

First you instantiate an instance of the *ToDoItem* class and set its properties.

		ToDoItem mToDoItem = new ToDoItem();
		mToDoItem.text = "Test Program";
		mToDoItem.complete = false;

 Next you execute the following code:

		// Insert the new item
	    new AsyncTask<Void, Void, Void>() {

	        @Override
	        protected Void doInBackground(Void... params) {
	            try {
	                mToDoTable.insert(item).get();
	                if (!item.isComplete()) {
	                    runOnUiThread(new Runnable() {
	                        public void run() {
	                            mAdapter.add(item);
	                        }
	                    });
	                }
	            } catch (Exception exception) {
	                createAndShowDialog(exception, "Error");
	            }
	            return null;
	        }
	    }.execute();


This code inserts the new item, and adds it to the adapter so it displays in the UI.

Mobile Services supports unique custom string values for the table id. This allows applications to use custom values such as email addresses or usernames for the id column of a Mobile Services table. For example if you wanted to identify each record by an email address, you could use the following JSON object.

		ToDoItem mToDoItem = new ToDoItem();
		mToDoItem.id = "myemail@mydomain.com";
		mToDoItem.text = "Test Program";
		mToDoItem.complete = false;

If a string id value is not provided when inserting new records into a table, Mobile Services will generate a unique value for the id.

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


##<a name="updating"></a>How to: Update data in a mobile service

The following code shows how to update data in a table. In this example, *item* is a reference to a row in the *ToDoItem* table, which has had some changes made to it. The following method updates the table and the UI adapter.

	private void updateItem(final ToDoItem item) {
	    if (mClient == null) {
	        return;
	    }

	    new AsyncTask<Void, Void, Void>() {

	        @Override
	        protected Void doInBackground(Void... params) {
	            try {
	                mToDoTable.update(item).get();
	                runOnUiThread(new Runnable() {
	                    public void run() {
	                        if (item.isComplete()) {
	                            mAdapter.remove(item);
	                        }
	                        refreshItemsFromTable();
	                    }
	                });
	            } catch (Exception exception) {
	                createAndShowDialog(exception, "Error");
	            }
	            return null;
	        }
	    }.execute();
	}

##<a name="deleting"></a>How to: Delete data in a mobile service

The following code shows how to delete data from a table. It deletes an existing item from the ToDoItem table that has had the **Completed** check box on the UI checked.

	public void checkItem(final ToDoItem item) {
		if (mClient == null) {
			return;
		}

		// Set the item as completed and update it in the table
		item.setComplete(true);

		new AsyncTask<Void, Void, Void>() {

            @Override
            protected Void doInBackground(Void... params) {
                try {
                    mToDoTable.delete(item);
                    runOnUiThread(new Runnable() {
                        public void run() {
                            if (item.isComplete()) {
                                mAdapter.remove(item);
                            }
                            refreshItemsFromTable();
                        }
                    });
                } catch (Exception exception) {
                    createAndShowDialog(exception, "Error");
                }
                return null;
            }
        }.execute();
	}


The following code illustrates another way to do this. It deletes an existing item in the ToDoItem table by specifying the value of the id field of the row to delete (assumed to equal "2FA404AB-E458-44CD-BC1B-3BC847EF0902"). In an actual app you would pick up the ID somehow and pass it in as a variable. Here, to simplify testing, you can go to your service in the Azure classic portal, click **Data** and copy an ID that you wish to test with.

    public void deleteItem(View view) {

        final String ID = "2FA404AB-E458-44CD-BC1B-3BC847EF0902";
        new AsyncTask<Void, Void, Void>() {

            @Override
            protected Void doInBackground(Void... params) {
                try {
                    mToDoTable.delete(ID);
                    runOnUiThread(new Runnable() {
                        public void run() {
                            refreshItemsFromTable();
                        }
               });
                } catch (Exception exception) {
                    createAndShowDialog(exception, "Error");
                }
                return null;
            }
        }.execute();
    }

##<a name="lookup"></a>How to: Look up a specific item
Sometimes you want to look up a specific item by its *id*, unlike querying where you typically get a collection of items that satisfy some criteria. The following code shows how to do this, for an *id* value of `0380BAFB-BCFF-443C-B7D5-30199F730335`. In an actual app you would pick up the ID somehow and pass it in as a variable. Here, to simplify testing, you can go to your service in the Azure classic portal, click the **Data** tab and copy an ID that you wish to test with.

    /**
     * Lookup specific item from table and UI
     */
    public void lookup(View view) {

        final String ID = "0380BAFB-BCFF-443C-B7D5-30199F730335";
        new AsyncTask<Void, Void, Void>() {

            @Override
            protected Void doInBackground(Void... params) {
                try {
                    final ToDoItem result = mToDoTable.lookUp(ID).get();
                    runOnUiThread(new Runnable() {
                        public void run() {
                            mAdapter.clear();
                            mAdapter.add(result);
                        }
               });
                } catch (Exception exception) {
                    createAndShowDialog(exception, "Error");
                }
                return null;
            }
        }.execute();
    }

##<a name="untyped"></a>How to: Work with untyped data

The untyped programming model gives you exact control over the JSON serialization, and there are some scenarios where you may wish to use it, for example, if your mobile service table contains a large number of columns and you only need to reference a few of them. Using the typed model requires you to define all of the mobile service table's columns in your data class. But with the untyped model you only define the columns you need to use.

Most of the API calls for accessing data are similar to the typed programming calls. The main difference is that in the untyped model you invoke methods on the **MobileServiceJsonTable** object, instead of the **MobileServiceTable** object.


### <a name="json_instance"></a>How to: Create an instance of an untyped table

Similar to the typed model, you start by getting a table reference, but in this case it's a [MobileServicesJsonTable](http://go.microsoft.com/fwlink/p/?LinkId=298733) object. You get the reference by calling the [getTable()](http://go.microsoft.com/fwlink/p/?LinkId=298734) method on an instance of the Mobile Services client.

First you define the variable:

    /**
     * Mobile Service Json Table used to access untyped data
     */
    private MobileServiceJsonTable mJsonToDoTable;



Once you create an instance of the Mobile Services client in the **onCreate** method (here, the *mClient* variable), you next create an instance of a **MobileServiceJsonTable**, with the following code.


            // Get the Mobile Service Json Table to use
            mJsonToDoTable = mClient.getTable("ToDoItem");

Once you have created an instance of the **MobileServiceJsonTable**, you can call almost all of the methods on it that you can with the typed programming model. However in some cases the methods take an untyped parameter, as we see in the following examples.

### <a name="json_insert"></a>How to: Insert into an untyped table

The following code shows how to do an insert. The first step is to create a [**JsonObject**](http://google-gson.googlecode.com/svn/trunk/gson/docs/javadocs/com/google/gson/JsonObject.html), which is part of the <a href=" http://go.microsoft.com/fwlink/p/?LinkId=290801" target="_blank">gson</a> library.

		JsonObject item = new JsonObject();
		item.addProperty("text", "Wake up");
		item.addProperty("complete", false);

The next step is to insert the object. The callback function passed to the [**insert**](http://go.microsoft.com/fwlink/p/?LinkId=298535) method is an instance of the [**TableJsonOperationCallback**](http://go.microsoft.com/fwlink/p/?LinkId=298532) class. Note how the parameter of the *insert* method is a JsonObject.

        // Insert the new item
        new AsyncTask<Void, Void, Void>() {

            @Override
            protected Void doInBackground(Void... params) {
                try {
                    mJsonToDoTable.insert(item).get();
                    refreshItemsFromTable();
                } catch (Exception exception) {
                    createAndShowDialog(exception, "Error");
                }
                return null;
            }
        }.execute();


If you need to get the ID of the inserted object, use this method call:

		        jsonObject.getAsJsonPrimitive("id").getAsInt());


### <a name="json_delete"></a>How to: Delete from an untyped table

The following code shows how to delete an instance, in this case, the same instance of a **JsonObject** that was created in the prior *insert* example. Note that the code is the same as with the typed case, but the method has a different signature since it references an **JsonObject**.


         mToDoTable.delete(item);


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


##<a name="binding"></a>How to: Bind data to the user interface

Data binding involves three components:

- the data source
- the screen layout
- and the adapter that ties the two together.

In our sample code, we return the data from the mobile service table *ToDoItem* into an array. This is one very common pattern for data applications: database queries typically return a collection of rows which the client gets in a list or array. In this sample the array is the data source.

The code specifies a screen layout that defines the view of the data that will appear on the device.

And the two are bound together with an adapter, which in this code is an extension of the *ArrayAdapter&lt;ToDoItem&gt;* class.

### <a name="layout"></a>How to: Define the Layout

The layout is defined by several snippets of XML code. Given an existing layout, let's assume the following code represents the **ListView** we want to populate with our server data.

    <ListView
        android:id="@+id/listViewToDo"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        tools:listitem="@layout/row_list_to_do" >
    </ListView>


In the above code the *listitem* attribute specifies the id of the layout for an individual row in the list. Here is that code, which specifies a check box and its associated text. This gets instantiated once for each item in the list. A more complex layout would specify additional fields in the display. This code is in the *row_list_to_do.xml* file.

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


### <a name="adapter"></a>How to: Define the adapter

Since the data source of our view is an array of *ToDoItem*, we subclass our adapter from a *ArrayAdapter&lt;ToDoItem&gt;* class. This subclass will produce a View for every *ToDoItem* using the *row_list_to_do* layout.

In our code we define the following class which is an extension of the *ArrayAdapter&lt;E&gt;* class:

	public class ToDoItemAdapter extends ArrayAdapter<ToDoItem> {


You must override the adapter's *getView* method. This sample code is one example of how to do this: details will vary with your application.

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

		return row;
	}

We create an instance of this class in our Activity as follows:

	ToDoItemAdapter mAdapter;
	mAdapter = new ToDoItemAdapter(this, R.layout.row_list_to_do);

Note that the second parameter to the ToDoItemAdapter constructor is a reference to the layout. The call to the constructor is followed by the following code which first gets a reference to the **ListView**, and next calls *setAdapter* to configure itself to use the adapter we just created:

	ListView listViewToDo = (ListView) findViewById(R.id.listViewToDo);
	listViewToDo.setAdapter(mAdapter);


### <a name="use-adapter"></a>How to: Use the adapter

You are now ready to use data binding. The following code shows how to get the items in the mobile service table, clear the apapter, and then call the adapter's *add* method to fill it with the returned items.

    public void showAll(View view) {
        new AsyncTask<Void, Void, Void>() {
            @Override
            protected Void doInBackground(Void... params) {
                try {
                    final MobileServiceList<ToDoItem> result = mToDoTable.execute().get();
                    runOnUiThread(new Runnable() {

                        @Override
                        public void run() {
                            mAdapter.clear();
                            for (ToDoItem item : result) {
                                mAdapter.add(item);
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

You must also call the adapter any time you modify the *ToDoItem* table if you want to display the results of doing that. Since modifications are done on a record by record basis, you will be dealing with a single row instead of a collection. When you insert an item you call the *add* method on the adapter, when deleting, you call the *remove* method.

##<a name="custom-api"></a>How to: Call a custom API

A custom API enables you to define custom endpoints that expose server functionality that does not map to an insert, update, delete, or read operation. By using a custom API, you can have more control over messaging, including reading and setting HTTP message headers and defining a message body format other than JSON. For an example of how to create a custom API in your mobile service, see [How to: define a custom API endpoint](mobile-services-dotnet-backend-define-custom-api.md).

[AZURE.INCLUDE [mobile-services-android-call-custom-api](../../includes/mobile-services-android-call-custom-api.md)]


##<a name="authentication"></a>How to: Authenticate users

Mobile Services supports authenticating and authorizing app users using a variety of external identity providers: Facebook, Google, Microsoft Account, Twitter, and Azure Active Directory. You can set permissions on tables to restrict access for specific operations to only authenticated users. You can also use the identity of authenticated users to implement authorization rules in your backend. For more information, see [Get started with authentication](http://go.microsoft.com/fwlink/p/?LinkId=296316).

Two authentication flows are supported: a *server* flow and a *client* flow. The server flow provides the simplest authentication experience, as it relies on the provider's web authentication interface. The client flow allows for deeper integration with device-specific capabilities such as single-sign-on as it relies on provider-specific device-specific SDKs.

Three steps are required to enable authentication in your app:

- Register your app for authentication with a provider, and configure Mobile Services
- Restrict table permissions to authenticated users only
- Add authentication code to your app


Mobile Services supports the following existing identity providers that you can use to authenticate users:

- Microsoft Account
- Facebook
- Twitter
- Google
- Azure Active Directory

You can set permissions on tables to restrict access for specific operations to only authenticated users. You can also use the ID of an authenticated user to modify requests.

These first two tasks are done using the [Azure classic portal](https://manage.windowsazure.com/). For more information, see [Get started with authentication](http://go.microsoft.com/fwlink/p/?LinkId=296316).

### <a name="caching"></a>How to: Add authentication code to your app

1.  Add the following import statements to your app's activity file.

		import java.util.concurrent.ExecutionException;
		import java.util.concurrent.atomic.AtomicBoolean;

		import android.content.Context;
		import android.content.SharedPreferences;
		import android.content.SharedPreferences.Editor;

		import com.microsoft.windowsazure.mobileservices.authentication.MobileServiceAuthenticationProvider;
		import com.microsoft.windowsazure.mobileservices.authentication.MobileServiceUser;

2. In the **onCreate** method of the activity class, add the following line of code after the code that creates the `MobileServiceClient` object: we assume that the reference to the `MobileServiceClient` object is *mClient*.

	    // Login using the Google provider.

		ListenableFuture<MobileServiceUser> mLogin = mClient.login(MobileServiceAuthenticationProvider.Google);

    	Futures.addCallback(mLogin, new FutureCallback<MobileServiceUser>() {
    		@Override
    		public void onFailure(Throwable exc) {
    			createAndShowDialog((Exception) exc, "Error");
    		}
    		@Override
    		public void onSuccess(MobileServiceUser user) {
    			createAndShowDialog(String.format(
                        "You are now logged in - %1$2s",
                        user.getUserId()), "Success");
    			createTable();
    		}
    	});

    This code authenticates the user using a Google login. A dialog is displayed which displays the ID of the authenticated user. You cannot proceed without a positive authentication.

    > [AZURE.NOTE] If you are using an identity provider other than Google, change the value passed to the **login** method above to one of the following: _MicrosoftAccount_, _Facebook_, _Twitter_, or _WindowsAzureActiveDirectory_.


3. When you run the app, sign in with your chosen identity provider.


### <a name="caching"></a>How to: Cache authentication tokens

This section shows how to cache an authentication token. Do this to prevent users from having to authenticate again if app is "hibernated" while the token is still valid.

Caching authentication tokens requires you to store the User ID and authentication token locally on the device. The next time the app starts, you check the cache, and if these values are present, you can skip the log in procedure and re-hydrate the client with this data. However this data is sensitive, and it should be stored encrypted for safety in case the phone gets stolen.

The following code snippet demonstrates obtaining a token for a Microsoft Account log in. The token is cached and reloaded if the cache is found.

	private void authenticate() {
		if (LoadCache())
		{
			createTable();
		}
		else
		{
			    // Login using the Google provider.
				ListenableFuture<MobileServiceUser> mLogin = mClient.login(MobileServiceAuthenticationProvider.Google);

		    	Futures.addCallback(mLogin, new FutureCallback<MobileServiceUser>() {
		    		@Override
		    		public void onFailure(Throwable exc) {
		    			createAndShowDialog("You must log in. Login Required", "Error");
		    		}
		    		@Override
		    		public void onSuccess(MobileServiceUser user) {
		    			createAndShowDialog(String.format(
		                        "You are now logged in - %1$2s",
		                        user.getUserId()), "Success");
		    			cacheUserToken(mClient.getCurrentUser());
		    			createTable();
		    		}
		    	});		}
	}


	private boolean LoadCache()
	{
		SharedPreferences prefs = getSharedPreferences("temp", Context.MODE_PRIVATE);
		String tmp1 = prefs.getString("tmp1", "undefined");
		if (tmp1 == "undefined")
			return false;
		String tmp2 = prefs.getString("tmp2", "undefined");
		if (tmp2 == "undefined")
			return false;
		MobileServiceUser user = new MobileServiceUser(tmp1);
		user.setAuthenticationToken(tmp2);
		mClient.setCurrentUser(user);
		return true;
	}


	private void cacheUser(MobileServiceUser user)
	{
		SharedPreferences prefs = getSharedPreferences("temp", Context.MODE_PRIVATE);
		Editor editor = prefs.edit();
		editor.putString("tmp1", user.getUserId());
		editor.putString("tmp2", user.getAuthenticationToken());
		editor.commit();
	}


So what happens if your token expires? In this case, when you try to use it to connect, you will get a *401 unauthorized* response. The user must then log in to obtain new tokens. You can avoid having to write code to handle this in every place in your app that calls your mobile service by using filters, which allow you to intercept calls to and responses from Mobile Services. The filter code will then test the response for a 401, trigger the sign-in process if needed, and then resume the request that generated the 401.


##<a name="customizing"></a>How to: Customize the client

There are several ways for you to customize the default behavior of the Mobile Services client.

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

Mobile Services assumes by default that the table names, column names and data types on the server all match exactly what is on the client. But there can be any number of reasons why the server and client names might not match. One example might be if you have an existing client that you want to change so that it uses Mobile Services instead of a competitor's product.

You might want to do the following kinds of customizations:

- The column names used in the mobile-  service table don't match the names you are using in the client
- Use a mobile service table that has a different name than the class it maps to in the client
- Turn on automatic property capitalization
- Add complex properties to an object

### <a name="columns"></a>How to: Map different client and server names

Suppose that your Java client code uses standard Java-style names for the *ToDoItem* object properties, such as the following.

- mId
- mText
- mComplete
- mDuration


You must serialize the client names into JSON names that match the column names of the *ToDoItem* table on the server. The following code, which makes use of the <a href=" http://go.microsoft.com/fwlink/p/?LinkId=290801" target="_blank">gson</a> library does this.

	@com.google.gson.annotations.SerializedName("text")
	private String mText;

	@com.google.gson.annotations.SerializedName("id")
	private int mId;

	@com.google.gson.annotations.SerializedName("complete")
	private boolean mComplete;

	@com.google.gson.annotations.SerializedName("duration")
	private String mDuration;

### <a name="table"></a>How to: Map different table names between client and mobile services

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
[Get started with Mobile Services]: mobile-services-android-get-started.md
[ASCII control codes C0 and C1]: http://en.wikipedia.org/wiki/Data_link_escape_character#C1_set
