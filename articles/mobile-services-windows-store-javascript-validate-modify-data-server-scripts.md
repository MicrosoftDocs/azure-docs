<properties urlDisplayName="Validate Data" pageTitle="Use server scripts to validate and modify data (JavaScript) | Mobile Dev Center" metaKeywords="" description="Learn how to validate and modify data sent using server scripts from your Windows Store JavaScript app." metaCanonical="http://www.windowsazure.com/en-us/develop/mobile/tutorials/validate-modify-and-augment-data-dotnet/" services="mobile-services" documentationCenter="windows" title="" authors="ggailey777" solutions="" manager="dwrede" editor=""/>

<tags ms.service="mobile-services" ms.workload="mobile" ms.tgt_pltfrm="mobile-windows-store" ms.devlang="javascript" ms.topic="article" ms.date="09/26/2014" ms.author="glenga" />

# Validate and modify data in Mobile Services by using server scripts 

[AZURE.INCLUDE [mobile-services-selector-validate-modify-data](../includes/mobile-services-selector-validate-modify-data.md)]

This topic shows you how to leverage server scripts in Azure Mobile Services. Server scripts are registered in a mobile service and can be used to perform a wide range of operations on data being inserted and updated, including validation and data modification. In this tutorial, you will define and register server scripts that validate and modify data. Because the behavior of server side scripts often affects the client, you will also update your Windows Store app to take advantage of these new behaviors.

This tutorial walks you through these basic steps:

1. [Add string length validation]
2. [Update the client to support validation]
3. [Add a timestamp on insert]
4. [Update the client to display the timestamp]

This tutorial builds on the steps and the sample app from the previous tutorial [Get started with data]. Before you begin this tutorial, you must first complete [Get started with data].  

## <a name="string-length-validation"></a>Add validation

It is always a good practice to validate the length of data that is submitted by users. First, you register a script that validates the length of string data sent to the mobile service and rejects strings that are too long, in this case longer than 10 characters.

1. Log into the [Azure Management Portal], click **Mobile Services**, and then click your app. 

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

    > [AZURE.TIP] You can remove a registered script on the **Script** tab by clicking **Clear** and then **Save**.	

## <a name="update-client-validation"></a>Update the client

Now that the mobile service is validating data and sending error responses, you need to update your app to be able to handle error responses from validation.

1. In Visual Studio 2012 Express for Windows 8, open the project that you modified when you completed the tutorial [Get started with data].

2. Press the **F5** key to run the app, then type text longer than 10 characters in **Insert a TodoItem** and click **Save**.

   	Notice that the app raises an unhandled error as a result of the 400 response (Bad Request) returned by the mobile service.

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

> [AZURE.NOTE] The **createdAt** timestamp property demonstrated here is now redundant. Mobile Services automatically creates a **__createdAt** system property for each table.

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

    > [AZURE.NOTE] Dynamic schema must be enabled the first time that this insert script runs. With dynamic schema enabled, Mobile Services automatically adds the **createdAt** column to the **TodoItem** table on the first execution. Dynamic schema is enabled by default for a new mobile service, and it should be disabled before the app is published to the Windows Store.

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
[0]: ./media/mobile-services-windows-store-javascript-validate-modify-data-server-scripts/mobile-services-selection.png
[1]: ./media/mobile-services-windows-store-javascript-validate-modify-data-server-scripts/mobile-portal-data-tables.png
[2]: ./media/mobile-services-windows-store-javascript-validate-modify-data-server-scripts/mobile-insert-script-users.png


<!-- URLs. -->
[Mobile Services server script reference]: http://go.microsoft.com/fwlink/?LinkId=262293
[Get started with Mobile Services]: /en-us/develop/mobile/tutorials/get-started/#create-new-service
[Authorize users with scripts]: /en-us/develop/mobile/tutorials/authorize-users-in-scripts-js
[Refine queries with paging]: /en-us/develop/mobile/tutorials/add-paging-to-data-js
[Get started with data]: /en-us/develop/mobile/tutorials/get-started-with-data-js
[Get started with authentication]: /en-us/develop/mobile/tutorials/get-started-with-users-js
[Get started with push notifications]: /en-us/develop/mobile/tutorials/get-started-with-push-js
[C# and XAML]: /en-us/develop/mobile/tutorials/validate-modify-and-augment-data-dotnet

[Management Portal]: https://manage.windowsazure.com/
[Azure Management Portal]: https://manage.windowsazure.com/
