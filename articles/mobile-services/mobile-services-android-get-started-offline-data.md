<properties
	pageTitle="Add Offline Data Sync to your Android Mobile Services app | Microsoft Azure"
	description="Learn how to use Azure Mobile Services to cache and sync offline data in your Android application"
	documentationCenter="android"
	authors="RickSaling"
	manager="dwrede"
	editor=""
	services="mobile-services"/>

<tags
	ms.service="mobile-services"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-android"
	ms.devlang="java"
	ms.topic="article"
	ms.date="07/21/2016"
	ms.author="ricksal"/>

# Add Offline Data Sync to your Android Mobile Services app

[AZURE.INCLUDE [mobile-services-selector-offline](../../includes/mobile-services-selector-offline.md)]

&nbsp;

[AZURE.INCLUDE [mobile-service-note-mobile-apps](../../includes/mobile-services-note-mobile-apps.md)]
> For the equivalent Mobile Apps version of this topic, see [Enable offline sync for your Android mobile app](../app-service-mobile/app-service-mobile-android-get-started-offline-data.md).

## Summary

Mobile apps can lose network connectivity when moving to an area without service, or due to network issues. For example, a construction industry app used at a remote construction site might need to enter scheduling data that is synced up to Azure later. With Azure Mobile Services offline sync, you can keep working when network connectivity is lost, which is essential to many mobile apps. With offline sync, you work with a local copy of your Azure SQL Server table, and periodically re-sync the two.

In this tutorial, you'll update the app from the [Mobile Services Quick Start tutorial] to enable offline sync, and then test the app by adding data offline,  syncing those items to the online database, and verifying the changes in the Azure classic portal.

Whether you are offline or connected, conflicts can arise any time multiple changes are made to data.  A future tutorial will explore handling sync conflicts, where you choose which version of the changes to accept. In this tutorial, we assume no sync conflicts and any changes you make to existing data will be applied directly to the Azure SQL Server.


## What you need to get started

[AZURE.INCLUDE [mobile-services-android-prerequisites](../../includes/mobile-services-android-prerequisites.md)]

## Update the app to support offline sync

With offline sync you read to and write from a *sync table* (using the *IMobileServiceSyncTable* interface), which is part of a **SQLite** database on your device.

To push and pull changes between the device and Azure Mobile Services, you use a *synchronization context* (*MobileServiceClient.SyncContext*), which you initialize with the local database that you use to store data locally.

1. Add permission to check for network connectivity by adding this code to the *AndroidManifest.xml* file:

	    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />


2. Add the following **import** statements to *ToDoActivity.java*:

		import java.util.Map;

		import android.widget.Toast;

		import com.microsoft.windowsazure.mobileservices.table.query.Query;
		import com.microsoft.windowsazure.mobileservices.table.sync.MobileServiceSyncContext;
		import com.microsoft.windowsazure.mobileservices.table.sync.MobileServiceSyncTable;
		import com.microsoft.windowsazure.mobileservices.table.sync.localstore.ColumnDataType;
		import com.microsoft.windowsazure.mobileservices.table.sync.localstore.SQLiteLocalStore;

3. Near the top of the `ToDoActivity` class, change the declaration of the `mToDoTable` variable from a `MobileServiceTable<ToDoItem>` class to a `MobileServiceSyncTable<ToDoItem>` class.

		 private MobileServiceSyncTable<ToDoItem> mToDoTable;

	This is where you define the sync table.

4. To handle initialization of the local store, in the `onCreate` method, add the following lines after creating the `MobileServiceClient` instance:

			// Saves the query which will be used for pulling data
			mPullQuery = mClient.getTable(ToDoItem.class).where().field("complete").eq(false);

			SQLiteLocalStore localStore = new SQLiteLocalStore(mClient.getContext(), "ToDoItem", null, 1);
			SimpleSyncHandler handler = new SimpleSyncHandler();
			MobileServiceSyncContext syncContext = mClient.getSyncContext();

			Map<String, ColumnDataType> tableDefinition = new HashMap<String, ColumnDataType>();
			tableDefinition.put("id", ColumnDataType.String);
			tableDefinition.put("text", ColumnDataType.String);
			tableDefinition.put("complete", ColumnDataType.Boolean);
			tableDefinition.put("__version", ColumnDataType.String);

			localStore.defineTable("ToDoItem", tableDefinition);
			syncContext.initialize(localStore, handler).get();

			// Get the Mobile Service Table instance to use
			mToDoTable = mClient.getSyncTable(ToDoItem.class);

5. Following the preceding code, which is inside a `try` block, add an additional `catch` block following the `MalformedURLException` one:

		} catch (Exception e) {
			Throwable t = e;
			while (t.getCause() != null) {
					t = t.getCause();
				}
			createAndShowDialog(new Exception("Unknown error: " + t.getMessage()), "Error");
		}

6. Add this method to verify network connectivity:

		private boolean isNetworkAvailable() {
			ConnectivityManager connectivityManager
					= (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
			NetworkInfo activeNetworkInfo = connectivityManager.getActiveNetworkInfo();
			return activeNetworkInfo != null && activeNetworkInfo.isConnected();
		}


7. Add this method to sync between the local *SQL Light* store and the Azure SQL Server:

		public void syncAsync(){
			if (isNetworkAvailable()) {
				new AsyncTask<Void, Void, Void>() {

					@Override
					protected Void doInBackground(Void... params) {
						try {
							mClient.getSyncContext().push().get();
							mToDoTable.pull(mPullQuery).get();

						} catch (Exception exception) {
							createAndShowDialog(exception, "Error");
						}
						return null;
					}
				}.execute();
			} else {
				Toast.makeText(this, "You are not online, re-sync later!" +
						"", Toast.LENGTH_LONG).show();
			}
		}


8. In the `onCreate` method, add this code as the next-to-the-last line, right before the call to `refreshItemsFromTable`:

			syncAsync();

	This causes the device on startup to sync with the Azure table. Otherwise you would display the last offline contents of the local store.



9. Update the code in the `refreshItemsFromTable` method to use this query (first line of code inside the `try` block):

		final MobileServiceList<ToDoItem> result = mToDoTable.read(mPullQuery).get();

10. In the `onOptionsItemSelected` method replace the contents of the `if` block with this code:

			syncAsync();
			refreshItemsFromTable();

	This code runs when you press the **Refresh** button in the upper right corner. This is the main way you sync your local store to Azure, in addition to syncing at startup. This encourages batching of sync changes, and is efficient given that the pull from Azure is a relatively expensive operation. You could also design this app to sync on every change by adding a call to `syncAsync` to the `addItem` and `checkItem` methods, if your app required this.


## Test the app

In this section, you will test the behavior with WiFi on, and then turn off WiFi to create an offline scenario.

When you add data items, they are held in the local SQL Light store, but not synced to the mobile service until you press the **Refresh** button. Other apps may have different requirements regarding when data needs to be synchronized, but for demo purposes this tutorial has the user explicitly request it.

When you press that button, a new background task starts, and first pushes all the changes made to the local store, by using the synchronization context, and then pulls all changed data from Azure to the local table.


### Online testing

Lets test the following scenarios.

1. Add some new items on your device;
2. Verify the items don't show in the portal;
3. next press **Refresh** and verify that they then show up.
4. Change or add an item in the portal, then press **Refresh** and verify that the changes show up on your device.

### Offline testing

<!-- Now if you run the app and tap the refresh button, you should see all the items from the server. At that point you should be able to turn off the networking from the device by placing it in *Airplane Mode*, and continue making changes – the app will work just fine. When it’s time to sync the changes to the server, turn the network back on, and tap the **Refresh** button again.

One thing which is important to point out: if there are pending changes in the local store, a pull operation will first push those changes to the server (so that if there are changes in the same row, the push operation will fail and the application has an opportunity to handle the conflicts appropriately). That means that the push call in the code above isn’t necessarily required, but I think it’s always a good practice to be explicit about what the code is doing.
-->

1. Place the device or simulator in *Airplane Mode*. This creates an offline scenario.

2. Add some *ToDo* items, or mark some items as complete. Quit the device or simulator (or forcibly close the app) and restart. Verify that your changes have been persisted on the device because they are held in the local SQL Light store.

3. View the contents of the Azure *TodoItem* table. Verify that the new items have _not_ been synced to the server:

   - For the JavaScript backend, go to the Azure classic portal, and click the Data tab to view the contents of the `TodoItem` table.
   - For the .NET backend, view the table contents either with a SQL tool such as *SQL Server Management Studio*, or a REST client such as *Fiddler* or *Postman*.

4. Turn on WiFi in the device or simulator. Next, press the **Refresh** button.

5. View the TodoItem data again in the Azure classic portal. The new and changed TodoItems should now appear.


## Next Steps

* [Using Soft Delete in Mobile Services][Soft Delete]

## Additional Resources

* [Cloud Cover: Offline Sync in Azure Mobile Services]

* [Azure Friday: Offline-enabled apps in Azure Mobile Services] \(note: demos are for Windows, but feature discussion applies to all platforms\)


<!-- URLs. -->

[Get the sample app]: #get-app
[Review the Core Data model]: #review-core-data
[Review the Mobile Services sync code]: #review-sync
[Change the sync behavior of the app]: #setup-sync
[Test the app]: #test-app


[Mobile Services sample repository on GitHub]: https://github.com/Azure/mobile-services-samples


[Get started with Mobile Services]: mobile-services-android-get-started.md
[Handling Conflicts with Offline Support for Mobile Services]:  mobile-services-android-handling-conflicts-offline-data.md
[Soft Delete]: mobile-services-using-soft-delete.md

[Cloud Cover: Offline Sync in Azure Mobile Services]: http://channel9.msdn.com/Shows/Cloud+Cover/Episode-155-Offline-Storage-with-Donna-Malayeri
[Azure Friday: Offline-enabled apps in Azure Mobile Services]: http://azure.microsoft.com/documentation/videos/azure-mobile-services-offline-enabled-apps-with-donna-malayeri/

[Mobile Services Quick Start tutorial]: mobile-services-android-get-started.md
