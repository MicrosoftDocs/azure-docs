<properties linkid="develop-mobile-tutorials-push-notifications-to-users-# android #" writer="ricksal" urlDisplayName="Push Notifications to Users" pageTitle="Push Notifications to app users - Windows Azure Mobile Services" metaKeywords="" metaDescription="Learn how to push notifications to app users in Android apps that use Windows Azure Mobile Services." metaCanonical="" disqusComments="1" umbracoNaviHide="1" />

# Push notifications to users by using Mobile Services

<div class="dev-center-tutorial-selector sublanding">
	<a href="/en-us/develop/mobile/tutorials/push-notifications-to-users-dotnet" title="Windows Store C#" class="current">Windows Store C#</a>
	<a href="/en-us/develop/mobile/tutorials/push-notifications-to-users-js" title="Windows Store JavaScript">Windows Store JavaScript</a>
	<a href="/en-us/develop/mobile/tutorials/push-notifications-to-users-wp8" title="Windows Phone">Windows Phone</a>
	<a href="/en-us/develop/mobile/tutorials/push-notifications-to-users-ios" title="iOS">iOS</a>
	<a href="/en-us/develop/mobile/tutorials/push-notifications-to-users-android" title="Android" class="current">Android</a>
</div>

<div class="dev-onpage-left-content">
<p>This topic extends the <a href="/en-us/develop/mobile/tutorials/get-started-with-push-android">previous push notification tutorial</a> by adding a new table to store Google Cloud Messaging (GCM) registration URIs, which can then be used to send push notifications to multiple users of the Android app. In this tutorial, a single update will generate push notifications to all registered devices whenever inserts are done to the ToDoList table . In the preceding tutorial, a notification was sent only to the device doing the insert.</p>
</div>


This tutorial walks you through these steps to update push notifications in your app:

1. [Create the Registration table]
2. [Update the app]
3. [Update server scripts]
4. [Verify the push notification behavior] 

This tutorial is based on the Mobile Services quickstart and builds on the previous tutorial [Get started with push notifications]. Before you start this tutorial, you must first complete [Get started with push notifications].  

## <a name="create-table"></a>Create a new table

1. Log into the [Windows Azure Management Portal], click **Mobile Services**, and then click your app.

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

3. Open the file ToDoItem.java, and delete the following code:

		@com.google.gson.annotations.SerializedName("handle")
		private String mHandle;
	
		public String getHandle() {
			return mHandle;
		}
	
		public final void setHandle(String handle) {
			mHandle = handle;
		}
	

4. Insert the following code into the body of the **Registration** class you previously created:

		@com.google.gson.annotations.SerializedName("handle")
		private String mHandle;
	
		public String getHandle() {
		    return mHandle;
		}
	
		public final void setHandle(String handle) {
			mHandle = handle;
		}
	


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


6.  Open the **ToDoItemActivity.java** file, and in the `addItem` method, delete the following lines:

		item.setHandle(mHandle);

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
	


<!--7.  Add the following private variable to the class:

		/**
		 * Mobile Service Table used to store user data
		 */
		private MobileServiceTable<Registration> mRegistrationTable;

	
8. In the **onCreate** method, add this code after the MobileServiceClient is instantiated:

			// Get the Mobile Service  Registration Table instance to use
			mRegistrationTable = mClient.getTable(Registration.class);


9. Add this `addRegistration` method code after the `addItem` method:

		/**
		 * Add a new registration
		 */
		public void addRegistration() {
			if (mClient == null) {
				return;
			}
			// Create a new registration
			Registration registration = new Registration();
			registration.setHandle(mRegistationId);
			
			// Insert the new registration
			mRegistrationTable.insert(registration, new TableOperationCallback<Registration>() {
	
				public void onCompleted(Registration entity, Exception exception, ServiceFilterResponse response) {
					
					if (exception == null) {
						createAndShowDialog("Registration successfully inserted", "Success!" );
					} else {
						createAndShowDialog(exception, "Error");
					}
				}
			});
		}
-->

10. In the **GCMIntentService** file, add the following import statements:

		import android.util.Log;
		
		import com.google.android.gcm.GCMRegistrar;
		
		import com.microsoft.windowsazure.mobileservices.MobileServiceClient;
		import com.microsoft.windowsazure.mobileservices.MobileServiceTable;
		import com.microsoft.windowsazure.mobileservices.ServiceFilterResponse;
		import com.microsoft.windowsazure.mobileservices.TableOperationCallback;
		

11. Replace the `onRegistered` method with the following code:

	@Override
	protected void onRegistered(final Context context, String registrationID) {

		MobileServiceClient client = ToDoActivity.getClient();
		MobileServiceTable<Registration> registrations = client.getTable(Registration.class);

		// Create a new Registration
		Registration registration = new Registration();
		registration.setHandle(registrationID);
		
		// Insert the new Registration
		registrations.insert(registration, new TableOperationCallback<Registration>() {

			public void onCompleted(Registration entity, Exception exception, ServiceFilterResponse response) {
				
				if (exception != null) {
					Log.e("GCMIntentService", exception.getMessage());
				} else {
					GCMRegistrar.setRegisteredOnServer(context, true);

				}
			}
		});
	}
	

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

  
6. You will see an icon appear in the upper left corner of the emulator, which we have outlined in red to emphasize it (the red does not appear on the actual screen). 

  ![][28]

7. Tap on the icon and swipe down to display the notification, which appears in the graphic below.

  ![][27]

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
[Update the app]: #update-app
[Update server scripts]: #update-scripts
[Verify the push notification behavior]: #test-app
[Next Steps]: #next-steps

<!-- Images. -->
[0]: ../Media/mobile-services-selection.png
[1]: ../Media/mobile-create-table.png
[2]: ../Media/mobile-create-registration-table.png
[3]: ../Media/mobile-portal-data-tables-registration.png
[4]: ../Media/mobile-insert-script-registration.png
[5]: ../Media/mobile-insert-script-push2.png
[6]: ../Media/mobile-create-registration-class.png
[7]: ../Media/mobile-push-users-android.png
[27]: ../Media/mobile-quickstart-push2-android.png
[28]: ../Media/mobile-push-icon.png

<!-- URLs. -->
[Windows Push Notifications & Live Connect]: http://go.microsoft.com/fwlink/?LinkID=257677
[Mobile Services server script reference]: http://go.microsoft.com/fwlink/?LinkId=262293
[My Apps dashboard]: http://go.microsoft.com/fwlink/?LinkId=262039
[Get started with Mobile Services]: /en-us/develop/mobile/how-to-guides/work-with-net-client-library/#create-new-service
[Get started with data]: ../tutorials/mobile-services-get-started-with-data-android.md
[Get started with authentication]: ../tutorials/mobile-services-get-started-with-users-android.md
[Get started with push notifications]: ../tutorials/mobile-services-get-started-with-push-android.md
[JavaScript and HTML]: mobile-services-win8-javascript/
[WindowsAzure.com]: http://www.windowsazure.com/
[Windows Azure Management Portal]: https://manage.windowsazure.com/
[How to use the Android client library for Mobile Services]: ../HowTo/mobile-services-client-android.md
