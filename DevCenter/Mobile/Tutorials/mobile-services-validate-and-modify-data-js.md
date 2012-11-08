<properties linkid="develop-mobile-tutorials-validate-modify-and-augment-data-js" urlDisplayName="Validate Data" pageTitle="Use server scripts to validate data (JavaScript)" metaKeywords="" metaDescription="Learn how to use server scripts to validate, modify, and augment data with Windows Azure Mobile Services." metaCanonical="http://www.windowsazure.com/en-us/develop/mobile/tutorials/validate-modify-and-augment-data-dotnet/" disqusComments="1" umbracoNaviHide="1" />



<div class="umbMacroHolder" title="This is rendered content from macro" onresizestart="return false;" umbpageid="14808" ismacro="true" umb_chunkname="MobileArticleLeft" umb_chunkpath="devcenter/Menu" umb_macroalias="AzureChunkDisplayer" umb_hide="0" umb_modaltrigger="" umb_chunkurl="" umb_modalpopup="0"><!-- startUmbMacro --><span><strong>Azure Chunk Displayer</strong><br />No macro content available for WYSIWYG editing</span><!-- endUmbMacro --></div>

<!--<div class="dev-center-os-selector">
  <a href="/en-us/develop/mobile/tutorials/validate-modify-and-augment-data-dotnet/" title=".NET client version">C# and XAML</a>
  <a href="/en-us/develop/mobile/tutorials/validate-modify-and-augment-data-js/" title="JavaScript client version" class="current">JavaScript and HTML</a>
  <span>Tutorial</span>
</div>-->

# Validate and modify data in Mobile Services by using server scripts 
<div class="dev-center-tutorial-selector"> 
	<a href="/en-us/develop/mobile/tutorials/validate-modify-and-augment-data-dotnet" title="Windows Store C#">Windows Store C#</a>
	<a href="/en-us/develop/mobile/tutorials/validate-modify-and-augment-data-js" title="Windows Store JavaScript" class="current">Windows Store JavaScript</a>
	<a href="/en-us/develop/mobile/tutorials/validate-modify-and-augment-data-wp8" title="Windows Phone 8">Windows Phone 8</a> 
	<a href="/en-us/develop/mobile/tutorials/validate-modify-and-augment-data-ios" title="iOS">iOS</a>
</div>


This topic shows you how to leverage server scripts in Windows Azure Mobile Services. Server scripts are registered in a mobile service and can be used to perform a wide range of operations on data being inserted and updated, including validation and data modification. In this tutorial, you will define and register server scripts that validate and modify data. Because the behavior of server side scripts often affects the client, you will also update your Windows Store app to take advantage of these new behaviors.

This tutorial walks you through these basic steps:

1. [Add string length validation]
2. [Update the client to support validation]
3. [Add a timestamp on insert]
4. [Update the client to display the timestamp]

This tutorial builds on the steps and the sample app from the previous tutorial [Get started with data]. Before you begin this tutorial, you must first complete [Get started with data].  

## <a name="string-length-validation"></a>Add validation

It is always a good practice to validate the length of data that is submitted by users. First, you register a script that validates the length of string data sent to the mobile service and rejects strings that are too long, in this case longer than 10 characters.

1. Log into the [Windows Azure Management Portal], click **Mobile Services**, and then click your app. 

   ![][0]

2. Click the **Data** tab, then click the **TodoItem** table.

   ![][1]

3. Click **Script**, then select the **Insert** operation.

   ![][2]

4. Replace the existing script with the following function, and then click **Save**.

        function insert(item, user, request) {
            if (item.text.length > 10) {
                request.respond(statusCodes.BAD_REQUEST, 'Text length must be under 10');
            } else {
                request.execute();
            }
        }

    This script checks the length of the **TodoItem.text** property and sends an error response when the length exceeds 10 characters. Otherwise, the **execute** method is called to complete the insert.

## <a name="update-client-validation"></a>Update the client

Now that the mobile service is validating data and sending error responses, you need to update your app to be able to handle error responses from validation.

1. In Visual Studio 2012 Express for Windows 8, open the project that you modified when you completed the tutorial [Get started with data].

2. Press the **F5** key to run the app, then type text longer than 10 characters in **Insert a TodoItem** and click **Save**.

   Notice that the app raises an unhandled error as a result of the 400 response (Bad Request) returned by the mobile service.

    <div class="dev-callout"> 
	<b>Note</b> 
	<p>You can remove a registered script on the <strong>Script</strong> tab by clicking <strong>Clear</strong> and then <strong>Save</strong>.</p></div>	

6. 	Open the file default.js, then replace the existing **InsertTodoItem** method with the following:

        var insertTodoItem = function (todoItem) {
            // Inserts a new row into the database. When the operation completes
            // and Mobile Services has assigned an id, the item is added to the binding list.
            todoTable.insert(todoItem).done(function (item) {
                todoItems.push(item);
            }, function (error) {
                // Create the error message dialog and set its content to the error
                // message contained in the response.
                var msg = new Windows.UI.Popups.MessageDialog(
                    error.request.responseText);
                msg.showAsync();
            });
        };

   This version of the method includes error handling that displays the error response in a dialog.

## <a name="add-timestamp"></a>Add a timestamp

The previous tasks validated an insert and either accepted or rejected it. Now, you will update inserted data by using a server script that adds a timestamp property to the object before it gets inserted.

1. In the **Scripts** tab in the [Management Portal], replace the current **Insert** script with the following function, and then click **Save**.

        function insert(item, user, request) {
            if (item.text.length > 10) {
                request.respond(statusCodes.BAD_REQUEST, 'Text length must be under 10');
            } else {
                item.createdAt = new Date();
                request.execute();
            }
        }

    This function augments the previous insert script by adding a new **createdAt** timestamp property to the object before it gets inserted by the call to **request**.**execute**. 

    <div class="dev-callout"><b>Note</b>
	<p>Dynamic schema must be enabled the first time that this insert script runs. With dynamic schema enabled, Mobile Services automatically adds the <strong>createdAt</strong> column to the <strong>TodoItem</strong> table on the first execution. Dynamic schema is enabled by default for a new mobile service, and it should be disabled before the app is published to the Windows Store.</p>
    </div>

2. In Visual Studio, press the **F5** key to run the app, then type text (shorter than 10 characters) in **Insert a TodoItem** and click **Save**.

   Notice that the new timestamp does not appear in the app UI.

3. Back in the Management Portal, click the **Browse** tab in the **todoitem** table.
   
   Notice that there is now a **createdAt** column, and the new inserted item has a timestamp value.
  
Next, you need to update the Windows Store app to display this new column.

## <a name="update-client-timestamp"></a>Update the client again

The Mobile Service client will ignore any data in a response that it cannot serialize into properties on the defined type. The final step is to update the client to display this new data.

1. In Visual Studio, open the file default.html, then add the following HTML element in the TemplateItem grid:
	      
        <div style="-ms-grid-column: 4; -ms-grid-row-align: center; margin-left: 5px" 
            data-win-bind="innerText: createdAt"></div>  

   This displays the new **createdAt** property. 
	
6. Press the **F5** key to run the app. 

   Notice that the timestamp is only displayed for items inserted after you updated the insert script.

7. In the default.js file, replace the existing **RefreshTodoItems** method with the following code:

        var refreshTodoItems = function () {
            // More advanced query that filters out completed items. 
            todoTable.where(function () {
                return (this.complete === false && this.createdAt !== null);
            })
            .read()
            .done(function (results) {
                todoItems = new WinJS.Binding.List(results);
                listItems.winControl.itemDataSource = todoItems.dataSource;
            });
        };

   This method updates the query to also filter out items that do not have a timestamp value.
	
8. Press the **F5** key to run the app.

   Notice that all items created without timestamp value disappear from the UI.

You have completed this working with data tutorial.

## <a name="next-steps"> </a>Next steps

Now that you have completed this tutorial, consider continuing on with the final tutorial in the data series: [Refine queries with paging].

Server scripts are also used when authorizing users and for sending push notifications. For more information see the following tutorials:

* [Authorize users with scripts]
  <br/>Learn how to filter data based on the ID of an authenticated user.

* [Get started with push notifications] 
  <br/>Learn how to send a very basic push notification to your app.

* [Mobile Services server script reference]
  <br/>Learn more about registering and using server scripts.

<!-- Anchors. -->
[Add string length validation]: #string-length-validation
[Update the client to support validation]: #update-client-validation
[Add a timestamp on insert]: #add-timestamp
[Update the client to display the timestamp]: #update-client-timestamp
[Next Steps]: #next-steps

<!-- Images. -->
[0]: ../Media/mobile-services-selection.png
[1]: ../Media/mobile-portal-data-tables.png
[2]: ../Media/mobile-insert-script-users.png
[3]: ../Media/mobile-quickstart-startup.png

<!-- URLs. -->
[Mobile Services server script reference]: http://go.microsoft.com/fwlink/?LinkId=262293
[Get started with Mobile Services]: ../get-started/#create-new-service
[Authorize users with scripts]: ./mobile-services-authorize-users-js.md
[Refine queries with paging]: ./mobile-services-paging-data-js.md
[Get started with data]: ./mobile-services-get-started-with-data-js.md
[Get started with authentication]: ./mobile-services-get-started-with-users-js.md
[Get started with push notifications]: ./mobile-services-get-started-with-push-js.md
[C# and XAML]: ./mobile-services-validate-and-modify-data-dotnet.md
[WindowsAzure.com]: http://www.windowsazure.com/
[Management Portal]: https://manage.windowsazure.com/
[Windows Azure Management Portal]: https://manage.windowsazure.com/