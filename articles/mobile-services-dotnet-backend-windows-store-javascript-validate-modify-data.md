<properties pageTitle="Use the .Net backend to validate and modify data (Windows Store) | Mobile Dev Center" description="Learn how to validate, modify, and augment data for your Javascript Windows Store app with .Net backend Windows Azure Mobile Services." services="mobile-services" documentationCenter="windows" authors="wesmc7777" manager="dwrede" editor=""/>

<tags ms.service="mobile-services" ms.workload="mobile" ms.tgt_pltfrm="mobile-windows-store" ms.devlang="javascript" ms.topic="article" ms.date="09/26/2014" ms.author="wesmc"/>

# Validate and modify data in Mobile Services using the .NET Backend

[WACOM.INCLUDE [mobile-services-selector-validate-modify-data](../includes/mobile-services-selector-validate-modify-data.md)]

This topic shows you how to use code in your .Net backend Azure Mobile Services to validate and modify data. The .NET backend service is an HTTP service built with the Web API framework. If you are familiar with the `ApiController` class defined with the Web API framework, the `TableController` class provided by Mobile Services will be very intuitive. `TableController` is derived from the `ApiController` class and provides additional functionality for interfacing with a database table. It can be used to perform operations on data being inserted and updated, including validation and data modification which is demonstrated in this tutorial. 

This tutorial walks you through these basic steps:

1. [Add string length validation]
2. [Update the client to support validation]
3. [Test length validation]
4. [Add a timestamp field for CompleteDate]
5. [Update the client to display the CompleteDate]

This tutorial builds on the steps and the sample app from the previous tutorial, [Getting Started] or [Get started with data](/en-us/documentation/articles/mobile-services-dotnet-backend-windows-store-javascript-get-started-data/). Before you begin this tutorial, you must first complete the [Getting Started] or [Get started with data](/en-us/documentation/articles/mobile-services-dotnet-backend-windows-store-javascript-get-started-data/) tutorial.  

## <a name="string-length-validation"></a>Add validation code to the Mobile Service

[WACOM.INCLUDE [mobile-services-dotnet-backend-add-validation](../includes/mobile-services-dotnet-backend-add-validation.md)]


## <a name="update-client-validation"></a>Update the client

Now that the mobile service is setup to validate data and send error responses for an invalid text length, you need to update your app to be able to handle error responses from validation. The error will be caught from the client app's call to `IMobileServiceTable<TodoItem].InsertAsync()`.

1. In the Solution Explorer window in Visual Studio, navigate to the JavaScript client project and expand the **js** folder. Then open the default.js file

2. In default.js replace the existing **insertTodoItem** function with the following function definition:


        var insertTodoItem = function (todoItem) {
            // This code inserts a new TodoItem into the database. When the operation completes
            // and Mobile Services has assigned an id, the item is added to the Binding List
            todoTable.insert(todoItem)
                .then(function (item) {
                  todoItems.push(item);
                },
                function (error) {
                  var msgDialog =
                    new Windows.UI.Popups.MessageDialog(JSON.parse(error.request.responseText).message,
                    error.request.statusText + "(" + error.request.status + ")");
                  msgDialog.showAsync();
                });
        };

   	This version of the function includes error handling and displays a `MessageDialog` with the error message from the response, status text, and status code.

## <a name="test-length-validation"></a>Test Length Validation

1. In Solution Explorer in Visual Studio, right click the JavaScript client app project and then click **Debug**, **Start new instance**.

2. Enter the text for a new todo item with a length greater than 10 characters and then click **Save**.

    ![][1]

3. You will get a message dialog similar to the following in response to the invalid text.

    ![][2]

## <a name="add-timestamp"></a>Add a timestamp field for CompleteDate


[WACOM.INCLUDE [mobile-services-dotnet-backend-add-completedate](../includes/mobile-services-dotnet-backend-add-completedate.md)]

## <a name="update-client-timestamp"></a>Update the client to display the completeDate

The final step is to update the client to display the new **completeDate** data. 


1. In Solution Explorer for Visual Studio, in the JavaScript client project, open the default.html file. Replace the binding template `div` tag element with the definition below. Then save the file. This adds a `div` tag with the innerText property bound to **completeDate**.
	      
        <div id="TemplateItem" data-win-control="WinJS.Binding.Template">
          <div style="display: -ms-grid; -ms-grid-columns: 3">
            <input class="itemCheckbox" type="checkbox" data-win-bind="checked: complete; 
              dataContext: this" />
            <div style="-ms-grid-column: 2; -ms-grid-row-align: center; margin-left: 5px" 
              data-win-bind="innerText: text">
            </div>
            <div style="-ms-grid-column: 3; -ms-grid-row-align: center; margin-left: 10px" 
              data-win-bind="innerText: completeDate">
            </div>
          </div>
        </div>



2. In default.js, remove the `.Where` clause function in the existing **refreshTodoItems** function so completed todoitems are included in the results.

            var refreshTodoItems = function () {
                // This code refreshes the entries in the list view be querying the TodoItems table.
                // The query excludes completed TodoItems
                todoTable.read()
                    .done(function (results) {
                        todoItems = new WinJS.Binding.List(results);
                        listItems.winControl.itemDataSource = todoItems.dataSource;
                    });
            };


3. In default.js, update the **updateCheckedTodoItem** function as follows so that the items are refreshed after an update and completed items are not removed from the list. Then save the file.	

            var updateCheckedTodoItem = function (todoItem) {
                // This code takes a freshly completed TodoItem and updates the database. 
                todoTable.update(todoItem).done(function () {
                    refreshTodoItems();
                });
            };


4. In the Solution Explorer windows of Visual Studio, right click the **Solution** and click **Rebuild Solution** to rebuild both the client and the .NET backend service. Verify both project build without errors.

    ![][3]
	
5. Press the **F5** key to run the client app and service locally. Add some new items and click to mark some items complete to see the **CompleteDate** timestamp being updated.

    ![][4]

6. In Solution Explorer for Visual Studio, right click the todolist service project and click **Publish**. Publish your .NET backend service to Microsoft Azure using your publishing setting file that you downloaded from the Azure portal.

7. Update the default.js file for the client project by uncommenting the connection to the mobile service address. Test the app against the .NET Backend hosted in your Azure account.




## <a name="next-steps"> </a>Next steps

Now that you have completed this tutorial, consider continuing on with the final tutorial in the data series: [Refine queries with paging].

Server scripts are also used when authorizing users and for sending push notifications. For more information see the following tutorials:

* [Service-side authorization of users]
  <br/>Learn how to filter data based on the ID of an authenticated user.

* [Get started with push notifications] 
  <br/>Learn how to send a very basic push notification to your app.

* [Mobile Services .NET How-to Conceptual Reference]
  <br/>Learn more about how to use Mobile Services with .NET.

<!-- Anchors. -->
[Add string length validation]: #string-length-validation
[Update the client to support validation]: #update-client-validation
[Test length validation]: #test-length-validation
[Add a timestamp field for CompleteDate]: #add-timestamp
[Update the client to display the CompleteDate]: #update-client-timestamp
[Next Steps]: #next-steps

<!-- Images. -->
[1]: ./media/mobile-services-dotnet-backend-windows-store-javascript-validate-modify-data/mobile-services-invalid-text-length.png
[2]: ./media/mobile-services-dotnet-backend-windows-store-javascript-validate-modify-data/mobile-services-invalid-text-length-exception-dialog.png
[3]: ./media/mobile-services-dotnet-backend-windows-store-javascript-validate-modify-data/mobile-services-rebuild-solution.png
[4]: ./media/mobile-services-dotnet-backend-windows-store-javascript-validate-modify-data/mobile-services-final-local-app-run.png



<!-- URLs. -->
[Get started with Mobile Services]: /en-us/develop/mobile/tutorials/get-started/#create-new-service
[Service-side authorization of users]: /en-us/documentation/articles/mobile-services-dotnet-backend-windows-store-javascript-authorize-users-in-scripts/
[Refine queries with paging]: /en-us/develop/mobile/tutorials/add-paging-to-data-dotnet
[Getting Started]: /en-us/documentation/articles/mobile-services-dotnet-backend-windows-store-javascript-get-started/
[Get started with authentication]: /en-us/documentation/articles/mobile-services-dotnet-backend-windows-store-javascript-get-started-users/
[Get started with push notifications]: /en-us/documentation/articles/mobile-services-dotnet-backend-windows-store-javascript-get-started-push/
[JavaScript and HTML]: /en-us/develop/mobile/tutorials/validate-modify-and-augment-data-js

[Management Portal]: https://manage.windowsazure.com/
[Azure Management Portal]: https://manage.windowsazure.com/
[Mobile Services .NET How-to Conceptual Reference]: /en-us/develop/mobile/how-to-guides/work-with-net-client-library
