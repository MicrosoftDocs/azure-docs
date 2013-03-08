<properties linkid="develop-mobile-tutorials-validate-modify-and-augment-data-html" writer="glenga" urlDisplayName="Validate Data" pageTitle="Use server scripts to validate data in an HTML app" metaKeywords="" metaDescription="Learn how to use server scripts to validate, modify, and augment data with Windows Azure Mobile Services." metaCanonical="http://www.windowsazure.com/en-us/develop/mobile/tutorials/validate-modify-and-augment-data-html/" disqusComments="1" umbracoNaviHide="1" />

<div chunk="../chunks/article-left-menu-html.md" />

# Validate and modify data in Mobile Services by using server scripts 
<div class="dev-center-tutorial-selector"> 
	<a href="/en-us/develop/mobile/tutorials/validate-modify-and-augment-data-dotnet" title="Windows Store C#">Windows Store C#</a><a href="/en-us/develop/mobile/tutorials/validate-modify-and-augment-data-js" title="Windows Store JavaScript">Windows Store JavaScript</a><a href="/en-us/develop/mobile/tutorials/validate-modify-and-augment-data-wp8" title="Windows Phone 8">Windows Phone 8</a><a href="/en-us/develop/mobile/tutorials/validate-modify-and-augment-data-ios" title="iOS">iOS</a><a href="/en-us/develop/mobile/tutorials/validate-modify-and-augment-data-android" title="Android">Android</a><a href="/en-us/develop/mobile/tutorials/validate-modify-and-augment-data-html" title="HTML" class="current">HTML</a>
</div>

This topic shows you how to leverage server scripts in Windows Azure Mobile Services. Server scripts are registered in a mobile service and can be used to perform a wide range of operations on data being inserted and updated, including validation and data modification. In this tutorial, you will define and register server scripts that validate and modify data. Because the behavior of server side scripts often affects the client, you will also update your HTML app to take advantage of these new behaviors.

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

    This script checks the length of the **TodoItem.text** property and sends an error response when the length exceeds 10 characters. Otherwise, the **execute** function is called to complete the insert.

    <div class="dev-callout"> 
	<b>Note</b> 
	<p>You can remove a registered script on the <strong>Script</strong> tab by clicking <strong>Clear</strong> and then <strong>Save</strong>.</p></div>	

## <a name="update-client-validation"></a>Update the client

Now that the mobile service is validating data and sending error responses, you need to update your app to be able to handle error responses from validation.

1. Run one of the following command files from the **server** subfolder of the project that you modified when you completed the tutorial [Get started with data].

	+ **launch-windows** (Windows computers) 
	+ **launch-mac.command** (Mac OS X computers)
	+ **launch-linux.sh** (Linux computers)

	<div class="dev-callout"><b>Note</b>
		<p>On a Windows computer, type `R` when PowerShell asks you to confirm that you want to run the script. Your web browser might warn you to not run the script because it was downloaded from the internet. When this happens, you must request that the browser proceed to load the script.</p>
	</div>

	This starts a web server on your local computer to host the app.

1. In a web browser, navigate to <a href="http://localhost:8000/" target="_blank">http://localhost:8000/</a>, then type text in **Add new task** and click **Add**.

   Notice that the operation fails, which is a result of the 400 response (Bad Request) returned by the mobile service.

2. 	Open the file app.js, then replace the **$('#add-item').submit()** event handler with the following code:

		$('#add-item').submit(function(evt) {
			var textbox = $('#new-item-text'),
				itemText = textbox.val();
			if (itemText !== '') {
				todoItemTable.insert({ text: itemText, complete: false })
					.then(refreshTodoItems, function(error){
					alert(error.request.responseText);
				});
			}
			textbox.val('').focus();
			evt.preventDefault();
		});

   This version of the event handler includes error handling that displays the error response in a dialog.

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
	<p>Dynamic schema must be enabled the first time that this insert script runs. With dynamic schema enabled, Mobile Services automatically adds the <strong>createdAt</strong> column to the <strong>TodoItem</strong> table on the first execution. Dynamic schema is enabled by default for a new mobile service, and it should be disabled before the app is published.</p>
    </div>

2. In the web browser, reload the page, then type text (shorter than 10 characters) in **Add new task** and click **Add**.

   Notice that the new timestamp does not appear in the app UI.

3. Back in the Management Portal, click the **Browse** tab in the **todoitem** table.
   
   Notice that there is now a **createdAt** column, and the new inserted item has a timestamp value.
  
Next, you need to update the app to display this new column.

## <a name="update-client-timestamp"></a>Update the client again

The Mobile Service client will ignore any data in a response that it cannot serialize into properties on the defined type. The final step is to update the client to display this new data.

1. In your editor, open the file app.js, then replace the **refreshTodoItems** function with the following code:

     	function refreshTodoItems() {
			var query = todoItemTable.where({ complete: false });

			query.read().then(function(todoItems) {
				var listItems = $.map(todoItems, function(item) {
					return $('<li>')
						.attr('data-todoitem-id', item.id)
						.append($('<button class="item-delete">Delete</button>'))
						.append($('<input type="checkbox" class="item-complete">').prop('checked', item.complete))
						.append($('<div>').append($('<input class="item-text">').val(item.text)));
						.append($('<div>').append($('<input class="timestamp">').val(item.createdAt)));
				});

				$('#todo-items').empty().append(listItems).toggle(listItems.length > 0);
				$('#summary').html('<strong>' + todoItems.length + '</strong> item(s)');
			});
		}

   This displays the new **createdAt** property. 

2. In your editor, open the style.css file, and replace the styles on the `item-text` class with the following:

		.item-text { width: 70%; height: 26px; line-height: 24px; 
			border: 1px solid transparent; background-color: transparent; }
		.timestamp { width: 30%; height: 40px; font-size: .75em; }

	This resizes the textbox and styles the new timestamp text.
	
6. Reload the page. 	

   Notice that the timestamp is only displayed for items inserted after you updated the insert script.

7. Again in the **refreshTodoItems** function, replace the line of code that defines the query with the following:

         var query = todoItemTable.where(function () {
                return (this.complete === false && this.createdAt !== null);
            })

   This function updates the query to also filter out items that do not have a timestamp value.
	
8. Reload the page.

   Notice that all items created without timestamp value disappear from the UI.

You have completed this working with data tutorial.

## <a name="next-steps"> </a>Next steps

Now that you have completed this tutorial, consider continuing on with the final tutorial in the data series: [Refine queries with paging].

Server scripts are also used when authorizing users and for sending push notifications. For more information see the following topics:

* [Authorize users with scripts]
  <br/>Learn how to filter data based on the ID of an authenticated user.

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
[3]: ../Media/mobile-quickstart-startup-html.png

<!-- URLs. -->
[Mobile Services server script reference]: http://go.microsoft.com/fwlink/?LinkId=262293
[Get started with Mobile Services]: ./mobile-services-get-started-html.md
[Authorize users with scripts]: ./mobile-services-authorize-users-html.md
[Refine queries with paging]: ./mobile-services-paging-data-html.md
[Get started with data]: ./mobile-services-get-started-with-data-html.md
[Get started with authentication]: ./mobile-services-get-started-with-users-html.md
[WindowsAzure.com]: http://www.windowsazure.com/
[Management Portal]: https://manage.windowsazure.com/
[Windows Azure Management Portal]: https://manage.windowsazure.com/