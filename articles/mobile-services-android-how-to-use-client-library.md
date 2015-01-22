<properties urlDisplayName="Android Client Library" pageTitle="Working with the Mobile Services Android Client Library" metaKeywords="" description="Learn how to use an Android client for Azure Mobile Services." metaCanonical="" services="mobile-services" documentationCenter="android" title="" authors="RickSaling" solutions="" manager="dwrede" editor=""/>

<tags ms.service="mobile-services" ms.workload="mobile" ms.tgt_pltfrm="Mobile-Android" ms.devlang="Java" ms.topic="article" ms.date="10/20/2014" ms.author="ricksal" />

# How to use the Android client library for Mobile Services

<div class="dev-center-tutorial-selector sublanding"> 
  <a href="/en-us/develop/mobile/how-to-guides/work-with-net-client-library/" title=".NET Framework">.NET Framework</a><a href="/en-us/develop/mobile/how-to-guides/work-with-html-js-client/" title="HTML/JavaScript">HTML/JavaScript</a><a href="/en-us/develop/mobile/how-to-guides/work-with-ios-client-library/" title="iOS">iOS</a><a href="/en-us/develop/mobile/how-to-guides/work-with-android-client-library/" title="Android" class="current">Android</a><a href="/en-us/develop/mobile/how-to-guides/work-with-xamarin-client-library/" title="Xamarin">Xamarin</a>
</div>


This guide shows you how to perform common scenarios using the Android client for Azure Mobile Services.  The scenarios covered include querying for data; inserting, updating, and deleting data, authenticating users, handling errors, and customizing the client. If you are new to Mobile Services, you should consider first completing the [Mobile Services quickstart][Get started with Mobile Services]. The quickstart tutorial helps you configure your account and create your first mobile service.

The samples are written in Java and require the [Mobile Services SDK]. This tutorial also requires the [Android SDK](https://go.microsoft.com/fwLink/p/?LinkID=280125&clcid=0x409), which includes the Eclipse integrated development environment (IDE) and Android Developer Tools (ADT) plugin. The Mobile Services SDK supports Android version 2.2 or later, but we recommend building against Android version 4.2 or later.



## Table of Contents

- [What is Mobile Services]
- [Concepts]
- [Setup and Prerequisites]
- [How to: Create the Mobile Services client]
- [How to: Create a table reference]
	- [The API structure]
- [How to: Query data from a mobile service]
	- [Filter returned data]
    - [Sort returned data]
	- [Return data in pages]
	- [Select specific columns]
	- [How to: Concatenate query methods]
- [How to: Insert data into a mobile service]
- [How to: Update data in a mobile service]
- [How to: Delete data in a mobile service]
- [How to: Look up a specific item]
- [How to: Work with untyped data]
- [How to: Bind data to the user interface]
	- [How to: Define the layout]
	- [How to: Define the adapter]
	- [How to: Use the adapter]
- [How to: Authenticate users]
	- [Cache authentication tokens]
- [How to: Handle errors]
- [How to: Customize the client]
	- [Customize request headers]
	- [Customize serialization]
- [Next steps][]

[AZURE.INCLUDE [mobile-services-concepts](../includes/mobile-services-concepts.md)]


<h2><a name="setup"></a>Setup and Prerequisites</h2>

We assume that you have created a mobile service and a table. For more information see [Create a table](http://go.microsoft.com/fwlink/p/?LinkId=298592). In the code used in this topic, we assume the table is named *ToDoItem*, and that it has the following columns:

<ul>
<li>id</li>
<li>text</li>
<li>complete</li>
<li>due</li>
<li>duration</li>
</ul>

The corresponding typed client side object is the following:

	public class ToDoItem {
		private String id;
		private String text;
		private Boolean complete;
		private Date due
		private Integer duration;
	}
	
When dynamic schema is enabled, Azure Mobile Services automatically generates new columns based on the object in the insert or update request. For more information, see [Dynamic schema]( http://go.microsoft.com/fwlink/p/?LinkId=296271).

<h2><a name="create-client"></a>How to: Create the Mobile Services client</h2>

The following code creates the [MobileServiceClient](http://dl.windowsazure.com/androiddocs/com/microsoft/windowsazure/mobileservices/MobileServiceClient.html) object that is used to access your mobile service. 

			MobileServiceClient mClient = new MobileServiceClient(
					"MobileServiceUrl", // Replace with the above Site URL
					"AppKey", 			// replace with the Application Key 
					this)

In the code above, replace `MobileServiceUrl` and `AppKey` with the mobile service URL and application key, in that order. Both of these are available on the Azure Management Portal, by selecting your mobile service and then clicking on *Dashboard*.

<h2><a name="instantiating"></a>How to: Create a table reference</h2>

The easiest way to query or modify data in the mobile service is by using the *typed programming model*, since Java is a strongly typed language (later on we will discuss the *untyped* model). This model provides seamless serialization and deserialization to JSON using the <a href=" http://go.microsoft.com/fwlink/p/?LinkId=290801" target="_blank">gson</a> library when sending data between the client and the mobile service: the developer doesn't have to do anything, the framework handles it all.

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

 


### <a name="api"></a>The API structure

Mobile services table operations use the asynchronous callback model. Methods involving queries and operations like inserts, updates and deletes, all have a parameter that is a callback object. This object always contains an **OnCompleted** method. The **onCompleted** method contains one parameter that is an **Exception** object, which you can test to determine the success of the method call. A null **Exception** object indicates success, otherwise the **Exception** object describes the reason for failure.

There are several different callback objects, and which one you use depends on whether you are querying, modifying, or deleting data. The parameters to the *onCompleted* method vary, depending on which callback object it is part of.


<h2><a name="querying"></a>How to: Query data from a mobile service</h2>

This section describes how to issue queries to the mobile service. Subsections describe diffent aspects such as sorting, filtering, and paging. Finally, we discuss how you can concatenate these operations together.

The following code returns all items in the *ToDoItem* table. 

		mToDoTable.execute(new TableQueryCallback<ToDoItem>() {
				public void onCompleted(List<ToDoItem> result, int count,
					Exception exception, ServiceFilterResponse response) {
					if (exception == null) {
						for (ToDoItem item : result) {
                			Log.i(TAG, "Read object with ID " + item.id);  
						}
					}
				}
			});

Queries like this one use the  [**TableQueryCallback&lt;E&gt;**](http://go.microsoft.com/fwlink/p/?LinkId=296849) callback object.

The *result* parameter returns the result set from the query, and the code inside the success branch of the *exception* test shows how to parse the individual rows.


### <a name="filtering"></a>How to: Filter returned data

The following code returns all items from the *ToDoItem* table whose *complete* field equals *false*. *mToDoTable* is the reference to the mobile service table that we created previously. 

		mToDoTable.where().field("complete").eq(false)
				  .execute(new TableQueryCallback<ToDoItem>() {
						public void onCompleted(List<ToDoItem> result, 
												int count, 
												Exception exception,
												ServiceFilterResponse response) {
				if (exception == null) {
					for (ToDoItem item : result) {
                		Log.i(TAG, "Read object with ID " + item.id);  
					}
				} 
			}
		});

You start a filter with a [**where**](http://go.microsoft.com/fwlink/p/?LinkId=296867) method call on the table reference. This is followed by a [**field**](http://go.microsoft.com/fwlink/p/?LinkId=296869) method call followed by a method call that specifies the logical predicate. Possible predicate methods include [**eq**](http://go.microsoft.com/fwlink/p/?LinkId=298461), [**ne**](http://go.microsoft.com/fwlink/p/?LinkId=298462), [**gt**](http://go.microsoft.com/fwlink/p/?LinkId=298463), [**ge**](http://go.microsoft.com/fwlink/p/?LinkId=298464), [**lt**](http://go.microsoft.com/fwlink/p/?LinkId=298465), [**le**](http://go.microsoft.com/fwlink/p/?LinkId=298466) etc.

This is sufficient for comparing number and string fields to specific values. But you can do a lot more.

For example, you can filter on dates. You can compare the entire date field, but you can also compare parts of the date, with methods such as [**year**](http://go.microsoft.com/fwlink/p/?LinkId=298467), [**month**](http://go.microsoft.com/fwlink/p/?LinkId=298468), [**day**](http://go.microsoft.com/fwlink/p/?LinkId=298469), [**hour**](http://go.microsoft.com/fwlink/p/?LinkId=298470), [**minute**](http://go.microsoft.com/fwlink/p/?LinkId=298471) and [**second**](http://go.microsoft.com/fwlink/p/?LinkId=298472). The following partial code adds a filter for items whose *due date* equals 2013.

		mToDoTable.where().year("due").eq(2013)

You can do a wide variety of complex filters on string fields with methods like [**startsWith**](http://go.microsoft.com/fwlink/p/?LinkId=298473), [**endsWith**](http://go.microsoft.com/fwlink/p/?LinkId=298474), [**concat**](http://go.microsoft.com/fwlink/p/?LinkId=298475), [**subString**](http://go.microsoft.com/fwlink/p/?LinkId=298477), [**indexOf**](http://go.microsoft.com/fwlink/p/?LinkId=298488), [**replace**](http://go.microsoft.com/fwlink/p/?LinkId=298491), [**toLower**](http://go.microsoft.com/fwlink/p/?LinkId=298492), [**toUpper**](http://go.microsoft.com/fwlink/p/?LinkId=298493), [**trim**](http://go.microsoft.com/fwlink/p/?LinkId=298495), and [**length**](http://go.microsoft.com/fwlink/p/?LinkId=298496). The following partial code filters for table rows where the *text* column starts with "PRI0".

		mToDoTable.where().startsWith("text", "PRI0")

Number fields also allow a wide variety of more complex filters with methods like [**add**](http://go.microsoft.com/fwlink/p/?LinkId=298497), [**sub**](http://go.microsoft.com/fwlink/p/?LinkId=298499), [**mul**](http://go.microsoft.com/fwlink/p/?LinkId=298500), [**div**](http://go.microsoft.com/fwlink/p/?LinkId=298502), [**mod**](http://go.microsoft.com/fwlink/p/?LinkId=298503), [**floor**](http://go.microsoft.com/fwlink/p/?LinkId=298505), [**ceiling**](http://go.microsoft.com/fwlink/p/?LinkId=298506), and [**round**](http://go.microsoft.com/fwlink/p/?LinkId=298507). The following partial code filters for table rows where the *duration* is an even number.

		mToDoTable.where().field("duration").mod(2).eq(0)


You can combine predicates with methods like [**and**](http://go.microsoft.com/fwlink/p/?LinkId=298512), [**or**](http://go.microsoft.com/fwlink/p/?LinkId=298514) and [**not**](http://go.microsoft.com/fwlink/p/?LinkId=298515). This partial code combines two of the above examples.

		mToDoTable.where().year("due").eq(2013).and().startsWith("text", "PRI0")

And you can group and nest logical operators, as shown in this partial code:

		mToDoTable.where()
					.year("due").eq(2013)
						.and
					(startsWith("text", "PRI0").or().field("duration").gt(10))

For more detailed discussion and examples of filtering, see [Exploring the richness of the Mobile Services Android client query model](http://hashtagfail.com/post/46493261719/mobile-services-android-querying).

### <a name="sorting"></a>How to: Sort returned data

The following code returns all items from a table of *ToDoItems* sorted ascending by the *text* field. *mToDoTable* is the reference to the mobile mervice table that you created previously.

		mToDoTable.orderBy("text", QueryOrder.Ascending)
			.execute(new TableQueryCallback<ToDoItem>() { 
				/* same implementation as above */ 
			}); 

The first parameter of the [**orderBy**](http://go.microsoft.com/fwlink/p/?LinkId=298519) method is a string equal to the name of the field on which to sort.

The second parameter uses the [**QueryOrder**](http://go.microsoft.com/fwlink/p/?LinkId=298521) enumeration to specify whether to sort ascending or descending.

Note that if you are filtering using the ***where*** method, the ***where*** method must be invoked prior to the ***orderBy*** method.

### <a name="paging"></a>How to: Return data in pages

The first example shows how to select the top 5 items from a table. The query returns the items from a table of  *ToDoItems*. *mToDoTable* is the reference to the mobile service table that you created previously.

		mToDoTable.top(5)
	            .execute(new TableQueryCallback<ToDoItem>() {	
	            public void onCompleted(List<ToDoItem> result, 
										int count,
	                    				Exception exception, 
										ServiceFilterResponse response) {
	                if (exception == null) {
	                    for (ToDoItem item : result) {
                			Log.i(TAG, "Read object with ID " + item.id);  
	                    }
	                } 
	            }
	        });

Next, we define a query that skips the first 5 items, and then returns the next 5.

		mToDoTable.skip(5).top(5)
	            .execute(new TableQueryCallback<ToDoItem>() {	
	            // implement onCompleted logic here
	        });


### <a name="selecting"></a>How to: Select specific columns

The following code illustrates how to return all items from a table of  *ToDoItems*, but only displays the *complete* and *text* fields. *mToDoTable* is the reference to the mobile service table that we created previously.

		mToDoTable.select("complete", "text")
	            .execute(new TableQueryCallback<ToDoItem>() { 
					/* same implementation as above */ 
			}); 

	
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
					.execute(new TableQueryCallback<ToDoItem>() { 
						/* code to execute */ 
				});

The main requirement in chaining methods together is that the *where* method and predicates need to come first. After that, you can call subsequent methods in the order that best meets the needs of your application.


<h2><a name="inserting"></a>How to: Insert data into a mobile service</h2>

The following code shows how to insert new rows into a table.

First you instantiate an instance of the *ToDoItem* class and set its properties.

		ToDoItem mToDoItem = new ToDoItem();
		mToDoItem.text = "Test Program";
		mToDoItem.complete = false;
		mToDoItem.duration = 5; 
		
 Next you call the [**insert**](http://go.microsoft.com/fwlink/p/?LinkId=296862) method.

		mToDoTable.insert(mToDoItem, new TableOperationCallback<ToDoItem>() {
			public void onCompleted(ToDoItem entity, 
								Exception exception, 
								ServiceFilterResponse response) {	
				if (exception == null) {
                		Log.i(TAG, "Read object with ID " + entity.id);  
				} 
			}
		});

For **insert** operations, the callback object is a [**TableOperationCallback&lt;ToDoItem&gt;**](http://go.microsoft.com/fwlink/p/?LinkId=296865).

The entity parameter of the **onCompleted** method contains the newly inserted object. The successful code shows how to access the *id* of the inserted row.

Mobile Services supports unique custom string values for the table id. This allows applications to use custom values such as email addresses or usernames for the id column of a Mobile Services table. For example if you wanted to identify each record by an email address, you could use the following JSON object.

		ToDoItem mToDoItem = new ToDoItem();
		mToDoItem.id = "myemail@mydomain.com";
		mToDoItem.text = "Test Program";
		mToDoItem.complete = false;
		mToDoItem.duration = 5; 

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


<h2><a name="updating"></a>How to: Update data in a mobile service</h2>

The following code shows how to update data in a table. In this example, *mToDoItem* is a reference to an item in the *ToDoItem* table, and we update its *duration* property..

		mToDoItem.duration = 5;
		mToDoTable.update(mToDoItem, new TableOperationCallback<ToDoItem>() {
			public void onCompleted(ToDoItem entity, 
									Exception exception, 
									ServiceFilterResponse response) {
				if (exception == null) {
            			Log.i(TAG, "Read object with ID " + entity.id);  
				} 
			}
		});

Note that the callback object and *onCompleted* method's parameters are the same as when we do an insert.

<h2><a name="deleting"></a>How to: Delete data in a mobile service</h2>

The following code shows how to delete data from a table. It deletes an existing item from the ToDoItem table, using a reference to the item, in this case *mToDoItem*.

		mToDoTable.delete(mToDoItem, new TableDeleteCallback() {
		    public void onCompleted(Exception exception,
									ServiceFilterResponse response) {
		        if(exception == null){
		            Log.i(TAG, "Object deleted");
		        }
		    }
		});

Note that in the *delete* case, the callback object is a [**TableDeleteCallback**](http://go.microsoft.com/fwlink/p/?LinkId=296858) and the **onCompleted** method is somewhat different in that no table row is returned.

The following code illustrates another way to do this. It deletes an existing item in the ToDoItem table by specifying the value of the id field of the row to delete (assumed to equal "37BBF396-11F0-4B39-85C8-B319C729AF6D"). 

		mToDoTable.delete("37BBF396-11F0-4B39-85C8-B319C729AF6D", new TableDeleteCallback() {
		    public void onCompleted(Exception exception, 
		            ServiceFilterResponse response) {
		        if(exception == null){
		            Log.i(TAG, "Object deleted");
		        }
		    }
		});

<h2><a name="lookup"></a>How to: Look up a specific item</h2>
Sometimes you want to look up a specific item by its *id*, unlike querying where you typically get a collection of items that satisfy some criteria. The following code shows how to do this, for *id* = "37BBF396-11F0-4B39-85C8-B319C729AF6D".

		mToDoTable.lookUp("37BBF396-11F0-4B39-85C8-B319C729AF6D", new TableOperationCallback<ToDoItem>() {
		    public void onCompleted(item entity, Exception exception,
		            ServiceFilterResponse response) {
		        if(exception == null){
		            Log.i(TAG, "Read object with ID " + entity.id);    
		        }
		    }
		});


<h2><a name="untyped"></a>How to: Work with untyped data</h2>

The untyped programming model gives you exact control over the JSON serialization, and there are some scenarios where you may wish to use it, for example, if your mobile service table contains a large number of columns and you only need to reference a few of them. Using the typed model requires you to define all of the movile service table's columns in your data class. But with the untyped model you only define the columns you need to use.

Similar to the typed model, you start by getting a table reference, but in this case it's a [MobileServicesJsonTable](http://go.microsoft.com/fwlink/p/?LinkId=298733) object. You get the reference by calling the [getTable()](http://go.microsoft.com/fwlink/p/?LinkId=298734) method on an instance of the Mobile Services client.


You use the following overload of this method, which is used for working with the untyped JSON-based programming models:

		public class MobileServiceClient {
		    public MobileServiceJsonTable getTable(String name);
		}

Most of the API calls for accessing data are similar to the typed programming calls. The main difference is that in the untyped model you invoke methods on the **MobileServiceJsonTable** object, instead of the **MobileServiceTable** object. Usage of the callback object and the **onCompleted** method is very similar to the typed model.


### <a name="json_instance"></a>How to: Create an instance of an untyped table

Once you create an instance of the Mobile Services client (here, the *mClient* variable), you next create an instance of a **MobileServiceJsonTable**, with the following code.

		MobileServiceJsonTable mTable = mClient.getTable("ToDoItem");

Once you have created an instance of the **MobileServiceJsonTable**, you can call almost all of the methods on it that you can with the typed programming model. However in some cases the methods take an untyped parameter, as we see in the following examples.

### <a name="json_insert"></a>How to: Insert into an untyped table

The following code shows how to do an insert. The first step is to create a [**JsonObject**](http://google-gson.googlecode.com/svn/trunk/gson/docs/javadocs/com/google/gson/JsonObject.html), which is part of the <a href=" http://go.microsoft.com/fwlink/p/?LinkId=290801" target="_blank">gson</a> library.

		JsonObject task = new JsonObject();
		task.addProperty("text", "Wake up");
		task.addProperty("complete", false);
		task.addProperty("duration", 5);

The next step is to insert the object. The callback function passed to the [**insert**](http://go.microsoft.com/fwlink/p/?LinkId=298535) method is an instance of the [**TableJsonOperationCallback**](http://go.microsoft.com/fwlink/p/?LinkId=298532) class. Note how the first parameter of the *onCompleted* method is a JsonObject.
		 
		mTable.insert(task, new TableJsonOperationCallback() {
		    public void onCompleted(JsonObject jsonObject, 
									Exception exception,
									ServiceFilterResponse response) {
		        if(exception == null){
		            Log.i(TAG, "Object inserted with ID " + 
		        jsonObject.getAsJsonPrimitive("id").getAsString());
		        }
		    }
		});


Note how we get the ID of the inserted object with this method call:

		        jsonObject.getAsJsonPrimitive("id").getAsInt());


### <a name="json_delete"></a>How to: Delete from an untyped table

The following code shows how to delete an instance, in this case, the same instance of a **JsonObject** that was created in the prior *insert* example. Note the callback object, **TableDeleteCallback**, is the same object used in the typed programming model, and its **onCompleted** method has a different signature from that used in the **insert** example.


		mTable.delete(task, new TableDeleteCallback() {
		    public void onCompleted(Exception exception, 
									ServiceFilterResponse response) {
		        if(exception == null){
		            Log.i(TAG, "Object deleted");
		        }
		    }
		});

You can also delete an instance directly by using its ID: 
		
		mTable.delete(task.getAsJsonPrimitive("id").getAsString(), ...)


### <a name="json_get"></a>How to: Return all rows from an untyped table

The following code shows how to retrieve an entire table. Note that the untyped progamming model uses a different callback object: [**TableJsonQueryCallback**](http://go.microsoft.com/fwlink/p/?LinkId=298543).

		mTable.execute(new TableJsonQueryCallback() {
		    public void onCompleted(JsonElement result, 
									int count, 
									Exception exception,
									ServiceFilterResponse response) {
		        if(exception == null){
		            JsonArray results = result.getAsJsonArray();
		            for(JsonElement item : results){
		                Log.i(TAG, "Read object with ID " + 
		            item.getAsJsonObject().getAsJsonPrimitive("id").getAsInt());
		            }
		        }
		    }
		});

You can do filtering, sorting and paging by concatenating  methods that have the same names as those used in the typed programming model.


<h2><a name="binding"></a>How to: Bind data to the user interface</h2>

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

		mToDoTable.execute(new TableQueryCallback<ToDoItem>() {
			public void onCompleted(List<ToDoItem> result, int count, Exception exception, ServiceFilterResponse response) {
				if (exception == null) {
					mAdapter.clear();
					for (ToDoItem item : result) {
						mAdapter.add(item);
					}
				} 
			}
		});

You must also call the adapter any time you modify the *ToDoItem* table if you want to display the results of doing that. Since modifications are done on a record by record basis, you will be dealing with a single row instead of a collection. When you insert an item you call the *add* method on the adapter, when deleting, you call the *remove* method.


<h2><a name="authentication"></a>How to: Authenticate users</h2>

Mobile Services supports authenticating and authorizing app users using a variety of external identity providers: Facebook, Google, Microsoft Account, Twitter, and Azure Active Directory. You can set permissions on tables to restrict access for specific operations to only authenticated users. You can also use the identity of authenticated users to implement authorization rules in server scripts. For more information, see [Get started with authentication](http://go.microsoft.com/fwlink/p/?LinkId=296316).

Two authentication flows are supported: a *server* flow and a *client* flow. The server flow provides the simplest authentication experience, as it relies on the provider's web authentication interface. The client flow allows for deeper integration with device-specific capabilities such as single-sign-on as it relies on provider-specific device-specific SDKs.

Three steps are required to enable authentication in your app:

<ol>
<li>Register your app for authentication with a provider, and configure Mobile Services</li>
<li>Restrict table permissions to authenticated users only</li>
<li>Add authentication code to your app</li>
</ol>

Mobile Services supports the following existing identity providers that you can use to authenticate users:

- Microsoft Account
- Facebook
- Twitter
- Google 
- Azure Active Directory

You can set permissions on tables to restrict access for specific operations to only authenticated users. You can also use the ID of an authenticated user to modify requests. 

These first two tasks are done using the [Azure Management Portal](https://manage.windowsazure.com/). For more information, see [Get started with authentication](http://go.microsoft.com/fwlink/p/?LinkId=296316).

### <a name="caching"></a>How to: Add authentication code to your app

1.  Add the following import statements to your app's activity file.

		import com.microsoft.windowsazure.mobileservices.MobileServiceUser;
		import com.microsoft.windowsazure.mobileservices.MobileServiceAuthenticationProvider;
		import com.microsoft.windowsazure.mobileservices.UserAuthenticationCallback;

2. In the **onCreate** method of the activity class, add the following line of code after the code that creates the `MobileServiceClient` object: we assume that the reference to the `MobileServiceClient` object is *mClient*.
	
			// Login using the Google provider.
			mClient.login(MobileServiceAuthenticationProvider.Google,
					new UserAuthenticationCallback() {
						@Override
						public void onCompleted(MobileServiceUser user,
								Exception exception, ServiceFilterResponse response) {	
							if (exception == null) {
								/* User now logged in, you can get their identity via user.getUserId() */ 
							} else {
								/* Login error */
							}
						}
					});

    This code authenticates the user using a Google login. A dialog is displayed which displays the ID of the authenticated user. You cannot proceed without a positive authentication.

    > [AZURE.NOTE] If you are using an identity provider other than Google, change the value passed to the **login** method above to one of the following: _MicrosoftAccount_, _Facebook_, _Twitter_, or _WindowsAzureActiveDirectory_.
    </div>


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
		    // Login using the provider.
		    mClient.login(MobileServiceAuthenticationProvider.MicrosoftAccount,
		            new UserAuthenticationCallback() {
		                @Override
		                public void onCompleted(MobileServiceUser user,
		                        Exception exception, ServiceFilterResponse response) {
		                    if (exception == null) {
		                        createTable();
		                        cacheUser(mClient.getCurrentUser());
		                    } else {
		                        createAndShowDialog("You must log in. Login Required", "Error");
		                    }
		                }
		            });
		}
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


So what happens if your token expires? In this case, when you try to use it to connect, you will get a *401 unauthorized* response. The user must then log in to obtain new tokens. You can avoid having to write code to handle this in every place in your app that calls Mobile Servides by using filters, which allow you to intercept calls to and responses from Mobile Services. The filter code will then test the response for a 401, trigger the login process if needed, and then resume the request that generated the 401.


<h2><a name="errors"></a>How to: Handle errors</h2>

You can see an example of doing validation and handling any errors <a href="https://www.windowsazure.com/en-us/develop/mobile/tutorials/validate-modify-and-augment-data-dotnet/" target="_blank">here</a>, which implements validation via server scripts that return exceptions on error, and client code that handles the excpetions.

Another approach is to provide a *global* error handler. The code we've seen that accesses the mobile service table has involved three different callback objects:

- **TableQueryCallback** / **TableQueryJsonCallback**
- **TableOperationCallback** / **TableJsonOperationCallback**
- **TableDeleteCallback** 

Each of these has an **OnCompleted** method where the second parameter is a **java.lang.Exception** object. You can subclass these callback objects and implement your own **onCompleted** method that checks if the exception parameter is null. If so, there is no error, and you just call  <b>super.OnCompleted()</b>.

If the **Exception** object is not null, perform some generic error handling in which you display more detailed information about the error. The following code snippet shows one way to show more detail.

		String msg = exception.getCause().getMessage();



Now the developer can use their subclassed callbacks and not worry about checking the exception, because it is handled in one central place (#2) for all instances of the callback.


<h2><a name="customizing"></a>How to: Customize the client</h2>

### <a name="headers"></a>How to: Customize request headers

You might want to attach a custom header to every outgoing request. You can accomplish that by configuring a ServiceFilter like this:

		client = client.withFilter(new ServiceFilter() {
		
		    @Override
		    public void handleRequest(ServiceFilterRequest request,
					NextServiceFilterCallback nextServiceFilterCallback,
		        	ServiceFilterResponseCallback responseCallback) {
		        request.addHeader("My-Header", "Value");      
		        nextServiceFilterCallback.onNext(request, responseCallback);
		    }
		});


### <a name="serialization"></a>How to: Customize serialization

Mobile Services assumes by default that the table names, column names and data types on the server all match exactly what is on the client. But there can be any number of reasons why the server and client names might not match. One example might be if you have an existing client that you want to change so that it uses Azure Mobile Services instead of a compettitor's product.

You might want to do the following kinds of customizations:
<ul>
<li>
The column names used in the mobile service table don't match the names you are using in the client</li>

<li>Use a mobile service table that has a different name than the class it maps to in the client</li>
<li>Turn on automatic property capitalization</li>

<li>Add complex properties to an object</li>

</ul>

### <a name="columns"></a>How to: Map different client and server names

Suppose that your Java client code uses standard Java-style names for the *ToDoItem* object properties, such as the following. 
<ul>
<li>mId</li>
<li>mText</li>
<li>mComplete</li>
<li>mDuration</li>

</ul>

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


## <a name="next-steps"></a>Next steps

The Javadocs reference for the Android client API is at [http://dl.windowsazure.com/androiddocs/com/microsoft/windowsazure/mobileservices/package-summary.html](http://go.microsoft.com/fwlink/p/?LinkId=298735 "here")

<!-- Anchors. -->

[What is Mobile Services]: #what-is
[Concepts]: #concepts
[How to: Create the Mobile Services client]: #create-client
[How to: Create a table reference]: #instantiating
[The API structure]: #api
[How to: Query data from a mobile service]: #querying
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
[Get started with Mobile Services]: /en-us/develop/mobile/tutorials/get-started-android/
[Mobile Services SDK]: http://go.microsoft.com/fwlink/p/?linkid=280126
[Get started with authentication]: /en-us/develop/mobile/tutorials/get-started-with-users-android/
[ASCII control codes C0 and C1]: http://en.wikipedia.org/wiki/Data_link_escape_character#C1_set
[CLI to manage Mobile Services tables]: http://www.windowsazure.com/en-us/manage/linux/other-resources/command-line-tools/#Mobile_Tables
