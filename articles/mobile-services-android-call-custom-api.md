<properties linkid="mobile-services-call-custom-api-android" writer="ricksal" urlDisplayName="Call a custom API from the client" pageTitle="Call a custom API from an Android client | Mobile Dev Center" metaKeywords="" description="Learn how to define a custom API and then call it from an Android app that uses Windows Azure Mobile Services." metaCanonical="" disqusComments="1" umbracoNaviHide="1" documentationCenter="Mobile" title="Call a custom API from the client" />

# Call a custom API from the client

<div class="dev-center-tutorial-selector sublanding"> 
	<a href="/en-us/develop/mobile/tutorials/call-custom-api-android" title="Windows Store C#">Windows Store C#</a><a href="/en-us/develop/mobile/tutorials/call-custom-api-js" title="Windows Store JavaScript">Windows Store JavaScript</a><a href="/en-us/develop/mobile/tutorials/call-custom-api-wp8" title="Windows Phone">Windows Phone</a><a href="/en-us/develop/mobile/tutorials/call-custom-api-ios" title="iOS">iOS</a><a href="/en-us/develop/mobile/tutorials/call-custom-api-android" title="Android" class="current">Android</a>
</div>

This topic shows you how to call a custom API from an Android app. A custom API enables you to define custom endpoints that expose server functionality that does not map to an insert, update, delete, or read operation. By using a custom API, you can have more control over messaging, including reading and setting HTTP message headers and defining a message body format other than JSON.

The custom API created in this topic enables you to send a single POST request that sets the *completed* flag to `true` for all the todo items in your mobile service's table. Without this custom API, the client would have to send individual requests to update the flag for each todo item in the table.

You will add this functionality to the app that you created when you completed either the [Get started with Mobile Services] or the [Get started with data] tutorial. To do this, you will complete the following steps:

1. [Define the custom API]
2. [Update the app to call the custom API]
3. [Test the app] 

This tutorial is based on the Mobile Services quickstart. Before you start this tutorial, you must first complete [Get started with Mobile Services] or [Get started with data]. 

## <a name="define-custom-api"></a>Define the custom API

[WACOM.INCLUDE [mobile-services-create-custom-api](../includes/mobile-services-create-custom-api.md)]

<h2><a name="update-app"></a><span class="short-header">Update the app </span>Update the app to call the custom API</h2>

1. We will add a button labelled "Complete All" next to the existing button, and move both buttons down a line. In Eclipse, open the *res\layout\activity_to_do.xml* file in your quickstart project, locate the **LinearLayout** element that contains the **Button** element named `buttonAddToDo`. Copy the **LinearLayout** and paste it immediately following the original one. Delete the **Button** element from the first **LinearLayout**.

2. In the second **LinearLayout**, delete the **EditText** element, and add the following  code immediately following the existing **Button** element: 

        <Button
            android:id="@+id/buttonCompleteItem"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:onClick="completeItem"
            android:text="@string/complete_button_text" />

	This adds a new button to the page, on a separate line, next to the existing button.

3. The second **LinearLayout** now looks like this:

	     <LinearLayout
	        android:layout_width="match_parent" 
	        android:layout_height="wrap_content" 
	        android:background="#71BCFA"
	        android:padding="6dip"  >
	        <Button
	            android:id="@+id/buttonAddToDo"
	            android:layout_width="wrap_content"
	            android:layout_height="wrap_content"
	            android:onClick="addItem"
	            android:text="@string/add_button_text" />
	        <Button
	            android:id="@+id/buttonCompleteItem"
	            android:layout_width="wrap_content"
	            android:layout_height="wrap_content"
	            android:onClick="completeItem"
	            android:text="@string/complete_button_text" />
	    </LinearLayout>
	

4. Open the res\values\string.xml file and add the following line of code:

    	<string name="complete_button_text">Complete All</string>



5. In Package Explorer, right click the project name in the *src* folder (`com.example.{your projects name}`), choose **New** then **Class**. In the dialog, enter **MarkAllResult** in the class name field, choose OK, and replace the resulting class definition with the following code:

		import com.google.gson.annotations.SerializedName;
		
		public class MarkAllResult {
		    @SerializedName("count")
		    public int mCount;
		    
		    public int getCount() {
		        return mCount;
			}
		
			public void setCount(int count) {
			        this.mCount = count;
			}
		}

	This class is used to hold the row count value returned by the custom API. 

6. Locate the **refreshItemsFromTable** method in the **ToDoActivity.java** file, and make sure that the first line of code starts out like this:

        mToDoTable.where().field("complete").eq(false)

	This filters the items so that completed items are not returned by the query.

7. In the **ToDoActivity.java** file, add the following method:

		public void completeItem(View view) {
			mClient.invokeApi("completeAll", MarkAllResult.class, new ApiOperationCallback<MarkAllResult>() {
		        @Override
		        public void onCompleted(MarkAllResult result, Exception error, ServiceFilterResponse response) {
		            if (error != null) {
						createAndShowDialog(error, "Error");
		            } else {
						createAndShowDialog(result.getCount() + " item(s) marked as complete.", "Completed Items");
						refreshItemsFromTable();
		            }
		        }
		    });
		}
	
	This method handles the **Click** event for the new button. The **invokeApi** method is called on the client, which sends a POST request to the new custom API. The result returned by the custom API is displayed in a message dialog, as are any errors.

## <a name="test-app"></a>Test the app

1. From the **Run** menu, click **Run** to start the project in the Android emulator.

	This executes your app, built with the Android SDK, that uses the client library to send a query that returns items from your mobile service.


2. In the app, type some text in **Insert a TodoItem**, then click **Add**.

3. Repeat the previous step until you have added several todo items to the list.

4. Click the **Complete All** button.

  	![][4]

	A message dialog is displayed that indicates the number of items marked complete and the filtered query is executed again, which clears all items from the list.

## Next steps

Now that you have created a custom API and called it from your Android app, consider finding out more about the following Mobile Services topics:



* [Mobile Services server script reference]
  <br/>Learn more about creating custom APIs.

* [Store server scripts in source control]
  <br/> Learn how to use the source control feature to more easily and securely develop and publish custom API script code.

<!-- Anchors. -->
[Define the custom API]: #define-custom-api
[Update the app to call the custom API]: #update-app
[Test the app]: #test-app
[Next Steps]: #next-steps

<!-- Images. -->




[4]: ./media/mobile-services-android-call-custom-api/mobile-custom-api-android-completed.png

<!-- URLs. -->
[Mobile Services Android SDK]: http://go.microsoft.com/fwlink/p/?LinkID=280126
[Mobile Services server script reference]: http://go.microsoft.com/fwlink/?LinkId=262293
[My Apps dashboard]: http://go.microsoft.com/fwlink/?LinkId=262039
[Get started with Mobile Services]: /en-us/develop/mobile/tutorials/get-started-android
[Get started with data]: /en-us/develop/mobile/tutorials/get-started-with-data-android
[Get started with authentication]: /en-us/develop/mobile/tutorials/get-started-with-users-android
[Get started with push notifications]: /en-us/develop/mobile/tutorials/get-started-with-push-android

[Define a custom API that supports periodic notifications]: /en-us/develop/mobile/tutorials/create-pull-notifications-android
[Store server scripts in source control]: /en-us/develop/mobile/tutorials/store-scripts-in-source-control
