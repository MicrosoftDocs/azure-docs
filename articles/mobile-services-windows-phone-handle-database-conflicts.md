<properties pageTitle="Handle database write conflicts with optimistic concurrency (Windows Store) | Mobile Dev Center" description="Learn how to handle database write conflicts on both the server and in your Windows Store application." documentationCenter="windows" authors="wesmc7777" manager="dwrede" editor="" services=""/>

<tags ms.service="mobile-services" ms.workload="mobile" ms.tgt_pltfrm="mobile-windows-phone" ms.devlang="dotnet" ms.topic="article" ms.date="09/23/2014" ms.author="wesmc"/>

# Handling database write conflicts

<div class="dev-center-tutorial-selector sublanding">
<a href="/en-us/develop/mobile/tutorials/handle-database-write-conflicts-dotnet/" title="Windows Store C#">Windows Store C#</a>
<a href="/en-us/documentation/articles/mobile-services-windows-store-javascript-handle-database-conflicts/" title="Windows Store JavaScript">Windows Store JavaScript</a>
<a href="/en-us/develop/mobile/tutorials/handle-database-write-conflicts-wp8/" title="Windows Phone" class="current">Windows Phone</a>
</div>

This tutorial is intended to help you better understand how to handle conflicts that occur when two or more clients write to the same database record in a Windows Phone 8 app. Two or more clients may write changes to the same item, at the same time, in some scenarios. Without any conflict detection, the last write would overwrite any previous updates even if this was not the desired result. Mobile Services provides support for detecting and resolving these conflicts. This topic walks you through the steps that allow you to handle database write conflicts on both the server and in your application.

In this tutorial you will add functionality to the quickstart app to handle contentions that occur when updating the TodoItem database. This tutorial walks you through these basic steps:

1. [Update the application to allow updates]
2. [Enable Conflict Detection in your application]
3. [Test database write conflicts in the application]
4. [Automatically handling conflict resolution in server scripts]


This tutorial requires the following

+ Microsoft Visual Studio 2012 Express for Windows Phone 8 or later.
+ [Windows Phone 8 SDK] running on Windows 8. 
+ [Azure Account]
+ This tutorial is based on the Mobile Services quickstart. Before you start this tutorial, you must first complete [Get started with Mobile Services].
+ Azure Mobile Services NuGet Package 1.1.0 or later. To get the latest version, follow these steps below:
	1. In Visual Studio, open the project and right-click the project in Solution Explorer then click **Manage Nuget Packages**. 

		![][13]

	2. Expand **Online** and click **Microsoft and .NET**. In the search text box enter **Azure Mobile Services**. Click **Install** on the **Azure Mobile Services** NuGet Package.

		![][14]


 

<h2><a name="uiupdate"></a>Update the application to allow updates</h2>

In this section you will update the TodoList user interface to allow updating the text of each item in a ListBox control. The ListBox will contain a CheckBox and TextBox control for each item in the database table. You will be able to update the text field of the TodoItem. The application will handle the `LostFocus` event from that TextBox to update the item in the database.


1. In Visual Studio, open the TodoList project you downloaded in the [Get started with Mobile Services] tutorial.
2. In the Visual Studio Solution Explorer, open MainPage.xaml and replace the `phone:LongListSelector` definition with the ListBox shown below and save the change.

		<ListBox Grid.Row="4" Grid.ColumnSpan="2" Name="ListItems">
			<ListBox.ItemTemplate>
				<DataTemplate>
					<StackPanel Orientation="Horizontal">
						<CheckBox Name="CheckBoxComplete" IsChecked="{Binding Complete, Mode=TwoWay}" Checked="CheckBoxComplete_Checked" Margin="10,5" VerticalAlignment="Center"/>
						<TextBox x:Name="ToDoText" Width="330" Text="{Binding Text, Mode=TwoWay}" AcceptsReturn="False" LostFocus="ToDoText_LostFocus"/>
					</StackPanel>
				</DataTemplate>
			</ListBox.ItemTemplate>
		</ListBox>


2. In the Visual Studio Solution Explorer, open MainPage.xaml.cs and add the following `using` directive.

		using System.Threading.Tasks;


3. In the Visual Studio Solution Explorer, open MainPage.xaml.cs. Add the event handler to the MainPage for the TextBox `LostFocus` event as shown below.


        private async void ToDoText_LostFocus(object sender, RoutedEventArgs e)
        {
            TextBox tb = (TextBox)sender;
            TodoItem item = tb.DataContext as TodoItem;
            //let's see if the text changed
            if (item.Text != tb.Text)
            {
                item.Text = tb.Text;
                await UpdateToDoItem(item);
            }
        }

4. In MainPage.xaml.cs, add the definition for the MainPage `UpdateToDoItem()` method referenced in the event handler as shown below.

        private async Task UpdateToDoItem(TodoItem item)
        {
            try
            {
                //update at the remote table
                await todoTable.UpdateAsync(item);
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "Update Failed", MessageBoxButton.OK);
            }
        }

The application now writes the text changes to each item back to the database when the TextBox loses focus.

<h2><a name="enableOC"></a>Enable Conflict Detection in your application</h2>

Two or more clients may write changes to the same item, at the same time, in some scenarios. Without any conflict detection, the last write would overwrite any previous updates even if this was not the desired result. [Optimistic Concurrency Control] assumes that each transaction can commit and therefore does not use any resource locking. Before committing a transaction, optimistic concurrency control verifies that no other transaction has modified the data. If the data has been modified, the committing transaction is rolled back. Azure Mobile Services supports optimistic concurrency control by tracking changes to each item using the `__version` system property column that is added to each table. In this section, we will enable the application to detect these write conflicts through the `__version` system property. The application will be notified by a `MobileServicePreconditionFailedException` during an update attempt if the record has changed since the last query. It will then be able to make a choice of whether to commit its change to the database or leave the last change to the database intact. For more information on the System Properties for Mobile Services, see [System Properties].

1. In MainPage.xaml.cs update the **TodoItem** class definition with the following code to include the **__version** system property enabling support for write conflict detection:

		public class TodoItem
		{
			public string Id { get; set; }            
			[JsonProperty(PropertyName = "text")]
			public string Text { get; set; }            
			[JsonProperty(PropertyName = "complete")]
			public bool Complete { get; set; }            
			[JsonProperty(PropertyName = "__version")]
			public string Version { set; get; }
		}

	> [AZURE.NOTE[ When using untyped tables, enable optimistic concurrency by adding the Version flag to the SystemProperties of the table.  
	>
	>````` 
	//Enable optimistic concurrency by retrieving __version
todoTable.SystemProperties |= MobileServiceSystemProperties.Version;
`````


2. By adding the `Version` property to the `TodoItem` class, the application will be notified with a `MobileServicePreconditionFailedException` exception during an update if the record has changed since the last query. This exception includes the latest version of the item from the server. In MainPage.xaml.cs, add the following code to handle the exception in the `UpdateToDoItem()` method.

        private async Task UpdateToDoItem(TodoItem item)
        {
            Exception exception = null;
            try
            {
                //update at the remote table
                await todoTable.UpdateAsync(item);
            }
            catch (MobileServicePreconditionFailedException<TodoItem> writeException)
            {
                exception = writeException;
            }
            catch (Exception ex)
            {
                exception = ex;
            }
            if (exception != null)
            {
                if (exception is MobileServicePreconditionFailedException<TodoItem>)
                {
                    //conflict detected, the item has changed since the last query
                    await ResolveConflict(item, ((MobileServicePreconditionFailedException<TodoItem>)exception).Item);
                }
                else
                    MessageBox.Show(exception.Message, "Update Failed", MessageBoxButton.OK);
            }
        }


3. In MainPage.xaml.cs, add the definition for the `ResolveConflict()` method referenced in `UpdateToDoItem()`. Notice that in order to resolve the conflict, you set the local item's version to the updated version from the server before committing the user's decision. Otherwise, you will continually encounter the conflict.


        private async Task ResolveConflict(TodoItem localItem, TodoItem serverItem)		
        {
            // Ask user to choose between the local text value or leaving the 
			// server's updated text value
            MessageBoxResult mbRes = MessageBox.Show(String.Format("The item has already been updated on the server.\n\n" +
                                                                   "Server value: {0} \n" +
                                                                   "Local value: {1}\n\n" +
                                                                   "Press OK to update the server with the local value.\n\n" +
                                                                   "Press CANCEL to keep the server value.", serverItem.Text, localItem.Text), 
                                                                   "CONFLICT DETECTED ", MessageBoxButton.OKCancel);
            // OK : After examining the updated text from the server, overwrite it
            //      with the changes made in this client.
            if (mbRes == MessageBoxResult.OK)
            {
                // Update the version of the item to the latest version
                // to resolve the conflict. Otherwise the exception
                // will be thrown again for the attempted update.
                localItem.Version = serverItem.Version;
                // Recursively updating just in case another conflict 
				// occurs while the user is deciding.
                await this.UpdateToDoItem(localItem);
            }
            // CANCEL : After examining the updated text from the server, leave 
			// the server item intact and refresh this client's query discarding 
			// the proposed changes.
            if (mbRes == MessageBoxResult.Cancel)
            {
                RefreshTodoItems();
            }
        }



<h2><a name="test-app"></a>Test database write conflicts in the application</h2>

In this section you will test the code that handles write conflicts by running the app in two different Windows Phone 8 emulators (WVGA and WVGA 512M). Both client apps will attempt to update the same item's `text` property requiring the user to resolve the conflict.


1. In Visual Studio, make sure **Emulator WVGA 512MB** is selected from the dropdown box as the deployment target as shown in the screenshot below.

	![][0]

2. In Visual Studio on the menu, click **BUILD** then **Deploy Solution**. If the emulator was not previously running, it will take a few minutes for the emulator to load the Windows Phone 8 Operating System. Verify in the output window at the bottom that the build and deployment to the Windows Phone 8 emulator succeeded.

	![][2]

3. In Visual Studio, change the deployment target dropdown box to **Emulator WVGA**.

	![][1]

4. In Visual Studio on the menu, click **BUILD** then **Deploy Solution**. Verify in the output window at the bottom that the build and deployment to the Windows Phone 8 emulator succeeded.

   	![][2]
  
5. Place both emulators running side by side. We can simulate concurrent write conflicts between the client apps running on these emulators. Swipe from right to left in both emulators to view the list of installed applications. Scroll to the bottom of each list and click the **todolist** app.

	![][3]

6. In the left emulator, update the `text` of the last TodoItem to **Test Write 1**, then click another text box so that the `LostFocus` event handler updates the database. The screenshot below shows an example. 

	![][4]

7. At this point the corresponding item in the right emulator has an old version and old text value. In the right emulator, enter **Test Write 2** for the text property. Then click another text box so the `LostFocus` event handler in the right emulator attempts to update the database with the old version.

	![][5]

8. Since the version used with the update attempt didn't match the server version, the Mobile Services SDK throws the `MobileServicePreconditionFailedException` allowing the app to resolve this conflict. To resolve the conflict, you can click **ok** to commit the values from the right app. Alternatively, click **cancel** to discard the values in the right app, leaving the values from the left app committed. 

	![][6]



<h2><a name="scriptsexample"></a>Automatically handling conflict resolution in server scripts</h2>

You can detect and resolve write conflicts in server scripts. This is a good idea when you can use scripted logic instead of user interaction to resolve the conflict. In this section, you will add a server side script to the TodoItem table for the application. The logic this script will use to resolve conflicts is as follows:

+  If the TodoItem's ` complete` field is set to true, then it is considered completed and `text` can no longer be changed.
+  If the TodoItem's ` complete` field is still false, then attempts to update `text` will be comitted.

The following steps walk you through adding the server update script and testing it.

1. Log into the [Azure Management Portal], click **Mobile Services**, and then click your app. 

   	![][7]

2. Click the **Data** tab, then click the **TodoItem** table.

   	![][8]

3. Click **Script**, then select the **Update** operation.

   	![][9]

4. Replace the existing script with the following function, and then click **Save**.

		function update(item, user, request) { 
			request.execute({ 
				conflict: function (serverRecord) {
					// Only committing changes if the item is not completed.
					if (serverRecord.complete === false) {
						//write the updated item to the table
						request.execute();
					}
					else
					{
						request.respond(statusCodes.FORBIDDEN, 'The item is already completed.');
					}
				}
			}); 
		}   
5. Change the TodoItem text for the last item in the app in the left emulator. Then click another text box so the `LostFocus` event handler updates the database.

	![][4]

6. In the right emulator, enter a different value for the text property of the last TodoItem. Then click another text box so the `LostFocus` event handler in the right emulator attempts to update the database with the old version

	![][5]

7. Notice that no exception was encountered in the app since the server script resolved the conflict by allowing the update since the item is not marked complete. To see that the update was truly successful, click **Refresh** in the app in the left emulator to re-query the database.

	![][10]

8. In the app in the left emulator, click the check box to complete the last TodoItem.

	![][11]

9. In the app in the right emulator, try to update the same TodoItem's text and trigger the `LostFocus` event. In response to the conflict, the script resolved it by refusing the update because the item was already completed. 

	![][12]


## <a name="next-steps"> </a>Next steps

This tutorial demonstrated how to enable a Windows Phone 8 app to handle write conflicts when working with data in Mobile Services. Next, consider completing one of the following tutorials in our data series:

* [Validate and modify data with scripts]
  <br/>Learn more about using server scripts in Mobile Services to validate and change data sent from your app.

* [Refine queries with paging]
  <br/>Learn how to use paging in queries to control the amount of data handled in a single request.

Once you have completed the data series, you can also try one of the following Windows Phone 8 tutorials:

* [Get started with authentication] 
  <br/>Learn how to authenticate users of your app.

* [Get started with push notifications] 
  <br/>Learn how to send a very basic push notification to your app with Mobile Services.
 
<!-- Anchors. -->
[Update the application to allow updates]: #uiupdate
[Enable Conflict Detection in your application]: #enableOC
[Test database write conflicts in the application]: #test-app
[Automatically handling conflict resolution in server scripts]: #scriptsexample
[Next Steps]:#next-steps

<!-- Images. -->
[0]: ./media/mobile-services-windows-phone-handle-database-conflicts/mobile-EmulatorWVGA512MB.png
[1]: ./media/mobile-services-windows-phone-handle-database-conflicts/mobile-EmulatorWVGA.png
[2]: ./media/mobile-services-windows-phone-handle-database-conflicts/mobile-build-deploy-wp8.png
[3]: ./media/mobile-services-windows-phone-handle-database-conflicts/mobile-start-apps-oc-wp8.png
[4]: ./media/mobile-services-windows-phone-handle-database-conflicts/mobile-oc-apps-write1-wp8.png
[5]: ./media/mobile-services-windows-phone-handle-database-conflicts/mobile-oc-apps-write2-wp8.png
[6]: ./media/mobile-services-windows-phone-handle-database-conflicts/mobile-oc-apps-exception-wp8.png
[7]: ./media/mobile-services-windows-phone-handle-database-conflicts/mobile-services-selection.png
[8]: ./media/mobile-services-windows-phone-handle-database-conflicts/mobile-portal-data-tables.png
[9]: ./media/mobile-services-windows-phone-handle-database-conflicts/mobile-insert-script-users.png
[10]: ./media/mobile-services-windows-phone-handle-database-conflicts/mobile-oc-apps-insync-wp8.png
[11]: ./media/mobile-services-windows-phone-handle-database-conflicts/mobile-oc-apps-complete-checkbox-wp8.png
[12]: ./media/mobile-services-windows-phone-handle-database-conflicts/mobile-oc-apps-already-completed-wp8.png
[13]: ./media/mobile-services-windows-phone-handle-database-conflicts/mobile-manage-nuget-packages-VS.png
[14]: ./media/mobile-services-windows-phone-handle-database-conflicts/mobile-manage-nuget-packages-dialog.png


<!-- URLs. -->
[Optimistic Concurrency Control]: http://go.microsoft.com/fwlink/?LinkId=330935
[Get started with Mobile Services]: /en-us/develop/mobile/tutorials/get-started/#create-new-service
[Azure Account]: http://www.windowsazure.com/en-us/pricing/free-trial/
[Validate and modify data with scripts]: /en-us/develop/mobile/tutorials/validate-modify-and-augment-data-wp8
[Refine queries with paging]: /en-us/develop/mobile/tutorials/add-paging-to-data-wp8
[Get started with Mobile Services]: /en-us/develop/mobile/tutorials/get-started-wp8
[Get started with data]: ./mobile-services-get-started-with-data-wp8.md
[Get started with authentication]: /en-us/develop/mobile/tutorials/get-started-with-users-wp8
[Get started with push notifications]: /en-us/develop/mobile/tutorials/get-started-with-push-wp8

[Azure Management Portal]: https://manage.windowsazure.com/
[Management Portal]: https://manage.windowsazure.com/
[Windows Phone 8 SDK]: http://go.microsoft.com/fwlink/p/?LinkID=268374
[Mobile Services SDK]: http://go.microsoft.com/fwlink/p/?LinkID=268375
[Developer Code Samples site]:  http://go.microsoft.com/fwlink/p/?LinkId=271146
[System Properties]: http://go.microsoft.com/fwlink/?LinkId=331143
