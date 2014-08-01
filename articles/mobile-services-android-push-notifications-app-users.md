<properties linkid="develop-mobile-tutorials-push-notifications-to-users-android" urlDisplayName="" pageTitle="Push notifications to users (Android ) | Mobile Dev Center" metaKeywords="" description="Learn how to use Mobile Services to push notifications to users of your Android app." metaCanonical="" services="" documentationCenter="Mobile" title="Push notifications to users by using Mobile Services" authors="ricksal" solutions="" manager="" editor="" />


# Push notifications to users by using Mobile Services

<div class="dev-center-tutorial-selector sublanding">
	<a href="/en-us/develop/mobile/tutorials/push-notifications-to-users-wp8" title="Windows Phone">Windows Phone</a><a href="/en-us/develop/mobile/tutorials/push-notifications-to-users-ios" title="iOS">iOS</a><a href="/en-us/develop/mobile/tutorials/push-notifications-to-users-android" title="Android" class="current">Android</a>
</div>

<div class="dev-onpage-left-content">
<p>This topic extends the <a href="/en-us/develop/mobile/tutorials/get-started-with-push-android">previous push notification tutorial</a> by adding a new table to store Google Cloud Messaging (GCM) registration URIs, which can then be used to send push notifications to multiple users of the Android app. In this tutorial, a single update will generate push notifications to all registered devices whenever inserts are done to the ToDoList table . In the preceding tutorial, a notification was sent only to the device doing the insert.</p>
</div>


This tutorial walks you through these steps to update push notifications in your app:

1. [Create the Registration table]
2. [Update your app]
3. [Update server scripts]
4. [Verify the push notification behavior] 

This tutorial is based on the Mobile Services quickstart and builds on the previous tutorial [Get started with push notifications]. Before you start this tutorial, you must first complete [Get started with push notifications].  

## <a name="create-table"></a>Create a new table

1. Log into the [Azure Management Portal], click **Mobile Services**, and then click your app.

   	![][0]

2. Click the **Data** tab, and then click **Create**.

   	![][1]

   	This displays the **Create new table** dialog.

3. Keeping the default **Anybody with the application key** setting for all permissions, type _Registration_ in **Table name**, and then click the check button.

   	![][2]

  	This creates the **Registration** table, which stores the registration URIs used to send push notifications separate from item data.

Next, you will modify the push notifications app to store registration data in this new table instead of in the **TodoItem** table.

## <a name="update-app"></a>Update your app

1. In Eclipse in the Package Explorer, right-click the package (under the `src` node), click **New**, click **Class**.

2. In **Name** type `Registration`, then click **Finish**

	![][6]

	This creates the new Registration class.

3. Open the file ToDoItem.java, and cut the following code:

		@com.google.gson.annotations.SerializedName("handle")
		private String mHandle;
	
		public String getHandle() {
			return mHandle;
		}
	
		public final void setHandle(String handle) {
			mHandle = handle;
		}
	

4. Paste the code you cut in the preceding step into the body of the **Registration** class you previously created.



5. Add the following code to the **Registration** class:

		@com.google.gson.annotations.SerializedName("id")
		private int mId;
	
		/**
		 * Returns the item id
		 */
		public int getId() {
			return mId;
		}
	
		/**
		 * Sets the item id
		 * 
		 * @param id : id to set
		 */
		public final void setId(int id) {
			mId = id;
		}


6.  Open the **ToDoActivity.java** file, and in the `addItem` method, delete the following lines:

		item.setHandle(MyHandler.getHandle());

7. Find the `mClient` property, replace it with the following code:

		/**
		 * Mobile Service Client reference
		 */
		private static MobileServiceClient mClient;
	
		/**
		 * Returns the client reference
		 */
		public static MobileServiceClient getClient() {
			return mClient;
		}
	




8. In the **MyHandler** file, add the following import statements:

		import android.util.Log;
		
		import com.microsoft.windowsazure.notifications.NotificationsHandler;

		import com.microsoft.windowsazure.mobileservices.MobileServiceClient;
		import com.microsoft.windowsazure.mobileservices.MobileServiceTable;
		import com.microsoft.windowsazure.mobileservices.ServiceFilterResponse;
		import com.microsoft.windowsazure.mobileservices.TableOperationCallback;
		

9. Add the following code to the end of the `onRegistered` method:

	    MobileServiceClient client = ToDoActivity.getClient();
	    MobileServiceTable<Registration> registrations = client.getTable(Registration.class);

	    // Create a new Registration
	    Registration registration = new Registration();
	    registration.setHandle(gcmRegistrationId);

	    // Insert the new Registration
	    registrations.insert(registration, new TableOperationCallback<Registration>() {

	        public void onCompleted(Registration entity, Exception exception, ServiceFilterResponse response) {

	            if (exception != null) {
	                Log.e("MyHandler", exception.getMessage());
	            } else {
	                Log.e("MyHandler", "Registration OK");
	            }
	        }
	    });
		

Your app is now updated to support push notifications to users.

## <a name="update-scripts"></a>Update server scripts

1. In the Management Portal, click the **Data** tab and then click the **Registration** table. 

   	![][3]

2. In **registration**, click the **Script** tab and select **Insert**.
   
   	![][4]

   	This displays the function that is invoked when an insert occurs in the **Registration** table.

3. Replace the insert function with the following code, and then click **Save**:

		function insert(item, user, request) {
			var registrationTable = tables.getTable('Registration');
			registrationTable
				.where({ handle: item.handle })
				.read({ success: insertRegistrationIfNotFound });
	        function insertRegistrationIfNotFound(existingRegistrations) {
        	    if (existingRegistrations.length > 0) {
            	    request.respond(200, existingRegistrations[0]);
        	    } else {
            	    request.execute();
        	    }
    	    }
	    }

   	This script checks the **Registration** table for an existing registration with the same URI. The insert only proceeds if no matching registration was found. This prevents duplicate registration records.

4. Click **TodoItem**, click **Script** and select **Insert**. 

   	![][5]

5. Replace the insert function with the following code, and then click **Save**:

		function insert(item, user, request) {
		    request.execute({
		        success: function() {
		            // Write to the response and then send the notification in the background
		            request.respond();
		            sendNotifications(item.text);
		
		        }
		    });
		
        function sendNotifications(item_text) {
            var registrationTable = tables.getTable('Registration');
            registrationTable.read({
                success: function(registrations) {
                    registrations.forEach(function(registration) {
                        push.gcm.send(registration.handle, item_text, {
                            success: function(response) {
                                console.log('Push notification sent: ', response);
                            }, error: function(error) {
                                console.log('Error sending push notification: ', error);
                            }
                        });
                    });
                }
            });
        }
    }

    This insert script sends a push notification (with the text of the inserted item) to all registrations stored in the **Registration** table.

## <a name="test-app"></a>Test the app

1. In Eclipse, from the **Run** menu, click **Run** to start the app.

5. In the app, type meaningful text, such as _A new Mobile Services task_ and then click the **Add** button.

  
6. You will see a black notification box appear briefly in the lower part of the screen. 

  	![][28]

<!--7. Tap on the icon and swipe down to display the notification, which appears in the graphic below.

  	![][27]-->

You have successfully completed this tutorial.

## Next steps

This concludes the tutorials that demonstrate the basics of working with push notifications. Consider finding out more about the following Mobile Services topics:

* [Get started with data]
  <br/>Learn more about storing and querying data using Mobile Services.

* [Get started with authentication]
  <br/>Learn how to authenticate users of your app with Windows Account.

* [Mobile Services server script reference]
  <br/>Learn more about registering and using server scripts.

* [How to use the Android client library for Mobile Services]
  <br/>Learn more about how to use Mobile Services with .NET.
  
<!-- Anchors. -->
[Create the Registration table]: #create-table
[Update your app]: #update-app
[Update server scripts]: #update-scripts
[Verify the push notification behavior]: #test-app
[Next Steps]: #next-steps

<!-- Images. -->
[0]: ./media/mobile-services-android-push-notifications-app-users/mobile-services-selection.png
[1]: ./media/mobile-services-android-push-notifications-app-users/mobile-create-table.png
[2]: ./media/mobile-services-android-push-notifications-app-users/mobile-create-registration-table.png
[3]: ./media/mobile-services-android-push-notifications-app-users/mobile-portal-data-tables-registration.png
[4]: ./media/mobile-services-android-push-notifications-app-users/mobile-insert-script-registration.png
[5]: ./media/mobile-services-android-push-notifications-app-users/mobile-insert-script-push2.png
[6]: ./media/mobile-services-android-push-notifications-app-users/mobile-create-registration-class.png

[27]: ./media/mobile-services-android-push-notifications-app-users/mobile-quickstart-push2-android.png
[28]: ./media/mobile-services-android-push-notifications-app-users/mobile-push-icon.png

<!-- URLs. -->
[Windows Push Notifications & Live Connect]: http://go.microsoft.com/fwlink/?LinkID=257677
[Mobile Services server script reference]: http://go.microsoft.com/fwlink/?LinkId=262293
[My Apps dashboard]: http://go.microsoft.com/fwlink/?LinkId=262039
[Get started with Mobile Services]: /en-us/develop/mobile/how-to-guides/work-with-net-client-library/#create-new-service
[Get started with data]: /en-us/develop/mobile/tutorials/get-started-with-data-android
[Get started with authentication]: /en-us/develop/mobile/tutorials/get-started-with-users-android
[Get started with push notifications]: /en-us/develop/mobile/tutorials/get-started-with-push-android
[JavaScript and HTML]: mobile-services-win8-javascript/

[Azure Management Portal]: https://manage.windowsazure.com/
[How to use the Android client library for Mobile Services]: /en-us/develop/mobile/how-to-guides/work-with-android-client-library
