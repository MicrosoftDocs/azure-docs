<properties linkid="mobile-services-call-custom-api-js" writer="glenga" urlDisplayName="Call a custom API from the client" pageTitle="Call a custom API from the client - Windows Azure Mobile Services" metaKeywords="" metaDescription="Learn how to define a custom API and then call it from a Windows Store app that use Windows Azure Mobile Services." metaCanonical="" disqusComments="1" umbracoNaviHide="1" />

<div chunk="../chunks/article-left-menu-windows-store.md" />

# Call a custom API from the client

<div class="dev-center-tutorial-selector sublanding"> 
	<a href="/en-us/develop/mobile/tutorials/call-custom-api-dotnet" title="Windows Store C#">Windows Store C#</a><a href="/en-us/develop/mobile/tutorials/call-custom-api-js" title="Windows Store JavaScript" class="current">Windows Store JavaScript</a><a href="/en-us/develop/mobile/tutorials/call-custom-api-wp8" title="Windows Phone">Windows Phone</a>
</div>

This topic shows you how to call a custom API from a Windows Store app. A custom API enables you to define custom endpoints that expose server functionality that does not map to an insert, update, delete, or read operation. By using a custom API, you can have more control over messaging, including reading and setting HTTP message headers and defining a message body format other than JSON.

The custom API created in this topic gives you the ability to send a single POST request that sets the completed flag to `true` for all the todo items in the table. Without this custom API, the client would have to send individual requests to update the flag for each todo item in the table.

You will add this functionality to the app that you created when you completed either the [Get started with Mobile Services] or the [Get started with data] tutorial. To do this, you will complete the following steps:

1. [Define the custom API]
2. [Update the app to call the custom API]
3. [Test the app] 

This tutorial is based on the Mobile Services quickstart. Before you start this tutorial, you must first complete [Get started with Mobile Services] or [Get started with data]. This tutorial uses Visual Studio 2012 Express for Windows 8.

## <a name="define-custom-api"></a>Define the custom API

<div chunk="../chunks/mobile-services-create-custom-api.md" />

<h2><a name="update-app"></a><span class="short-header">Update the app </span>Update the app to call the custom API</h2>

1. In Visual Studio 2012 Express for Windows 8, open the default.html file in your quickstart project, locate the **button** element named `buttonRefresh`, and add the following new element right after it: 

		<button id="buttonCompleteAll" style="margin-left: 5px">Complete All</button>

	This adds a new button to the page. 

2. Open the default.js code file in the `js` project folder, locate the **refreshTodoItems** function and make sure that this function contains the following code:

	    todoTable.where({ complete: false })
	       .read()
	       .done(function (results) {
	           todoItems = new WinJS.Binding.List(results);
	           listItems.winControl.itemDataSource = todoItems.dataSource;
	       });            

	This filters the items so that completed items are not returned by the query.

3. After the **refreshTodoItems** function, add the following code:

		var completeAllTodoItems = function () {
		    var okCommand = new Windows.UI.Popups.UICommand("OK");
		
		    // Asynchronously call the custom API using the POST method. 
		    mobileService.invokeApi("completeall", {
		        body: null,
		        method: "post"
		    }).done(function (results) {
		        var message = results.result.count + " item(s) marked as complete.";
		        var dialog = new Windows.UI.Popups.MessageDialog(message);
		        dialog.commands.append(okCommand);
		        dialog.showAsync().done(function () {
		            refreshTodoItems();
		        });
		    }, function (error) {
		        var dialog = new Windows.UI.Popups
		            .MessageDialog(error.message);
		        dialog.commands.append(okCommand);
		        dialog.showAsync().done();
		    });
		};

        buttonCompleteAll.addEventListener("click", function () {
            completeAllTodoItems();
        });

	This method handles the **Click** event for the new button. The **InvokeApiAsync** method is called on the client, which sends a POST request to the new custom API. The result returned by the custom API is displayed in a message dialog, as are any errors.

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
[Mobile Services server script reference]: http://go.microsoft.com/fwlink/?LinkId=262293
[My Apps dashboard]: http://go.microsoft.com/fwlink/?LinkId=262039
[Get started with Mobile Services]: ../tutorials/mobile-services-get-started-js.md
[Get started with data]: ../tutorials/mobile-services-get-started-with-data-js.md
[Get started with authentication]: ../tutorials/mobile-services-get-started-with-users-js.md
[Get started with push notifications]: ../tutorials/mobile-services-get-started-with-push-js.md
[WindowsAzure.com]: http://www.windowsazure.com/
[Define a custom API that supports periodic notifications]: ../tutorials/mobile-services-create-pull-notifications-js.md
[Store server scripts in source control]: ../tutorials/mobile-services-store-scripts-in-source-control.md