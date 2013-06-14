<properties linkid="mobile-services-call-custom-api-dotnet" writer="glenga" urlDisplayName="Call a custom API from the client" pageTitle="Call a custom API from the client - Windows Azure Mobile Services" metaKeywords="" metaDescription="Learn how to define a custom API and then call it from a Windows Store app that use Windows Azure Mobile Services." metaCanonical="" disqusComments="1" umbracoNaviHide="1" />

<div chunk="../chunks/article-left-menu-windows-store.md" />

# Call a custom API from the client

<div class="dev-center-tutorial-selector"> 
	<a href="/en-us/develop/mobile/tutorials/call-custom-api-dotnet" title="Windows Store C#" class="current">Windows Store C#</a>
    <a href="/en-us/develop/mobile/tutorials/call-custom-api-js" title="Windows Store JavaScript">Windows Store JavaScript</a>
    <a href="/en-us/develop/mobile/tutorials/call-custom-api-wp8" title="Windows Phone">Windows Store JavaScript</a>
</div>

This topic shows you how to call a custom API from a Windows Store app. The custom API gives you the ability to send a single POST request that sets the completed flag to `true` for all the todo items in the table. Without this custom API, the client would have to send individual requests to update the flag for each todo item in the table.

You will add this functionality to the app that you created when you completed either the [Get started with Mobile Services] or the [Get started with data] tutorial. To do this, you will complete the following steps:

1. [Define the custom API]
2. [Update the app to call the custom API]
3. [Test the app] 

This tutorial is based on the Mobile Services quickstart. Before you start this tutorial, you must first complete [Get started with Mobile Services] or [Get started with data]. This tutorial uses Visual Studio 2012 Express for Windows 8.

## <a name="define-custom-api"></a>Define the custom API

1. Log into the [Windows Azure Management Portal], click **Mobile Services**, and then click your app.

   ![][0]

2. Click the **API** tab, and then click **Create a custom API**.

   ![][1]

   This displays the **Create a new custom API** dialog.

3. Type _completeall_ in **API name**, and then click the check button.

   ![][2]

  This creates the new API.

   	<div class="dev-callout"><b>Note</b>
   		<p>Default permissions are set, which means that any user of the app can call the custom API. However, the application key is not distributed or stored securely and cannot be considered a secure credential. Because of this, you should consider restricting access to only authenticated users on operations that modify data or affect the mobile service. For more information, see <a href="/en-us/develop/mobile/tutorials/get-started-with-users-dotnet" target="_blank">Get started with authentication</a>.</p>
   	</div>

4. Click the new **completeall** entry in the API table.

	![][3]

5. Click the **Script** tab and replace the existing code with the following:

		exports.post = function(request, response) {
			var mssql = request.service.mssql;
			var sql = "UPDATE todoitem SET complete = 1 " + 
                "WHERE complete = 0; SELECT @@ROWCOUNT as count";
			mssql.query(sql, {
				success: function(results) {			
					if(results.length == 1)							
						response.send(200, results[0]);			
				}
			})
		};


	This code uses the [mssql object] to access the **todoitem** table directly to set the completed flag on all items. Because the **exports.post** function is used, clients send a POST request to perform the operation. The number of changed rows is returned to the client as an integer value.

Next, you will modify the quickstart app to add a new button and code that asynchronously calls the new custom API.

<h2><a name="update-app"></a><span class="short-header">Update the app </span>Update the app to call the custom API</h2>

1. In Visual Studio 2012 Express for Windows 8, open the MainPage.xaml file in your quickstart project, locate the **Button** element named `ButtonRefresh`, and replace it with the following XAML code: 

		<StackPanel Orientation="Horizontal">
	        <Button Margin="72,0,0,0" Name="ButtonRefresh" 
	                Click="ButtonRefresh_Click">Refresh</Button>
	        <Button Margin="12,0,0,0" Name="ButtonCompleteAll" 
	                Click="ButtonCompleteAll_Click">Complete All</Button>
	    </StackPanel>

	This adds a new button to the page. 

2. Open the MainPage.xaml.cs code file, and add the following class definition code:

	    public class MarkAllResult
	    {
	        public int Count { get; set; }
	    }

	This class is used to hold the row count value returned by the custom API. 

3. Locate the **RefreshTodoItems** method in the **MainPage** class, and make sure that the `query` is defined by using the following **Where** method:

        .Where(todoItem => todoItem.Complete == false)

	This filters the items so that completed items are not returned by the query.

3. In the **MainPage** class, add the following method:

        private async void ButtonCompleteAll_Click(object sender, RoutedEventArgs e)
        {
            var result = await App.MobileService
                .InvokeApiAsync<MarkAllResult>("completeall");
            var dialog = new MessageDialog(result.Count + 
                " item(s) marked as complete.");
            await dialog.ShowAsync();
            RefreshTodoItems();
        }

	This method handles the **Click** event for the new button. The **InvokeApiAsync** method is called on the client, which sends a request to the new custom API. The result returned by the custom API is displayed in a message dialog.

## <a name="test-app"></a>Test the app

1. In Visual Studio, press the **F5** key to rebuild the project and start the app.

2. In the app, type some text in **Insert a TodoItem**, then click **Save**.

3. Repeat the previous step until you have added several todo items to the list.

4. Click the **Complete All** button.

  ![][4]

	A message dialog is displayed that indicates the number of items marked complete and the filtered query is executed again, which clears all items from the list.

## Next steps

Now that you have created a custom API and called it from your Windows Store app, consider finding out more about the following Mobile Services topics:

* [Define a custom API that supports periodic notifications]
	<br/>Learn how to use a custom API to support periodic notifications in a Windows Store app. With period notifications enabled, Windows will periodically access your custom API endpoint and use the returned XML, in a tile-specific format, to update the app tile on start menu.

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
[0]: ../Media/mobile-services-selection.png
[1]: ../Media/mobile-custom-api-create.png
[2]: ../Media/mobile-custom-api-create-dialog2.png
[3]: ../Media/mobile-custom-api-select2.png
[4]: ../Media/mobile-custom-api-windows-store-completed.png

<!-- URLs. -->
[Windows Push Notifications & Live Connect]: http://go.microsoft.com/fwlink/?LinkID=257677
[Mobile Services server script reference]: http://go.microsoft.com/fwlink/?LinkId=262293
[My Apps dashboard]: http://go.microsoft.com/fwlink/?LinkId=262039
[Get started with Mobile Services]: ../tutorials/mobile-services-get-started/#create-new-service
[Get started with data]: ../tutorials/mobile-services-get-started-with-data-dotnet.md
[Get started with authentication]: ../tutorials/mobile-services-get-started-with-users-dotnet.md
[Get started with push notifications]: ../tutorials/mobile-services-get-started-with-push-dotnet.md
[JavaScript and HTML]: mobile-services-win8-javascript/
[WindowsAzure.com]: http://www.windowsazure.com/
[Windows Azure Management Portal]: https://manage.windowsazure.com/
[Periodic notifications]: http://msdn.microsoft.com/en-us/library/windows/apps/jj150587.aspx
[PeriodicUpdateRecurrance]: http://msdn.microsoft.com/en-us/library/windows/apps/windows.ui.notifications.periodicupdaterecurrence.aspx
[mssql object]: http://msdn.microsoft.com/en-us/library/windowsazure/jj554212.aspx
[Define a custom API that supports periodic notifications]: ../tutorials/mobile-services-create-pull-notifications-dotnet.md
[Store server scripts in source control]: ../tutorials/mobile-services-store-scripts-in-source-control.md