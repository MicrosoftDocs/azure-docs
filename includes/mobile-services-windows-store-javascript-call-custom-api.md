
##<a name="update-app"></a>Update the app to call the custom API

1. In Visual Studio, open the default.html file in your quickstart project, locate the **button** element named `buttonRefresh`, and add the following new element right after it: 

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

  	![](./media/mobile-services-windows-store-javascript-call-custom-api/mobile-custom-api-windows-store-completed.png)

	A message dialog is displayed that indicates the number of items marked complete and the filtered query is executed again, which clears all items from the list.