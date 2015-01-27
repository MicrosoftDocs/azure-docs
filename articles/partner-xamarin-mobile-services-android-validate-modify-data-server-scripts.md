<properties 
	pageTitle="Use server scripts to validate and modify data (Xamarin Android) | Mobile Dev Center" 
	description="Learn how to validate and modify data sent using server scripts from your Xamarin.Android app." 
	documentationCenter="xamarin" 
	services="mobile-services" 
	authors="lindydonna" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-xamarin-android" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="09/26/2014" 
	ms.author="donnam"/>

# Validate and modify data in Mobile Services by using server scripts

[AZURE.INCLUDE [mobile-services-selector-validate-modify-data](../includes/mobile-services-selector-validate-modify-data.md)]

This topic shows you how to leverage server scripts in Azure Mobile Services. Server scripts are registered in a mobile service and can be used to perform a wide range of operations on data being inserted and updated, including validation and data modification. In this tutorial, you will define and register server scripts that validate and modify data. Because the behavior of server side scripts often affects the client, you will also update your Android app to take advantage of these new behaviors. The finished code is available in the [ValidateModifyData app][GitHub] sample.

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
                request.respond(statusCodes.BAD_REQUEST, 'Text length must be 10 characters or less.');
            } else {
                request.execute();
            }
        }

    This script checks the length of the **text** property and sends an error response when the length exceeds 10 characters. Otherwise, the **execute** method is called to complete the insert.

    > [AZURE.TIP] You can remove a registered script on the **Script** tab by clicking **Clear** and then **Save**.

## <a name="update-client-validation"></a>Update the client

Now that the mobile service is validating data and sending error responses, you need to verify that your app is correctly handling error responses from validation.

1. In Xamarin Studio, open the project that you created when you completed the tutorial [Get started with data].

2. In the TodoActivity.cs file, locate the **AddItem** method and replace the call to the CreateAndShowDialog method with the following code:

    	var exDetail = ex.InnerException.InnerException as 	
			MobileServiceInvalidOperationException;
    	CreateAndShowDialog(exDetail.Message, "Error");

	This displays the error message returned by the mobile service. 

3. Click **Run** to start the app, then type text longer than 10 characters in the textbox and click the **Add** button.

  	Notice that error is handled and the error messaged is displayed to the user.

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

    > [AZURE.IMPORTANT] Dynamic schema must be enabled the first time that this insert script runs. With dynamic schema enabled, Mobile Services automatically adds the **createdAt** column to the **TodoItem** table on the first execution. Dynamic schema is enabled by default for a new mobile service, and it should be disabled before the app is published.

2. From the **Run** menu, then click **Run** to start the app, then type text (shorter than 10 characters) in the textbox and click **Add**.

   	Notice that the new timestamp does not appear in the app UI.

3. Back in the Management Portal, click the **Browse** tab in the **todoitem** table.
   
   	Notice that there is now a **createdAt** column, and the new inserted item has a timestamp value.
  
Next, you need to update the Android app to display this new column.

## <a name="update-client-timestamp"></a>Update the client again

The Mobile Service client will ignore any data in a response that it cannot serialize into properties on the defined type. The final step is to update the client to display this new data.

1. Add the following code to the private field definitions in the **TodoItem** class:

        [DataMember(Name = "createdAt")]
        public DateTime? CreatedAt { get; set; }
  
    > [AZURE.NOTE] The `DataMember's Name` annotation tells the client to map the new `CreatedAt` property in the app to the `createdAt` column defined in the TodoItem table, which has a different name. By using this annotation, your app can have property names on objects that differ from column names in the SQL Database. Without this annotation, an error occurs because of the casing differences.

2. In the GetView method, add the following code just above where the current code that sets <code>checkBox.Text</code> to <code>currentItem.Text</code>:

       	string displayDate = "missing";
       	if (currentItem.CreatedAt.HasValue)
       		displayDate = currentItem.CreatedAt.Value.ToShortTimeString();

   	This creates a formatted date string when a timestamp value exists. 

3. Locate the code `checkBox.Text = currentItem.Text` again and replace this line of code with the following:

		checkBox.Text = string.Format("{0} - {1}", currentItem.Text, displayDate);

	This appends the timestamp date to the item for display.
	
4. From the **Run** menu, then click **Run** to start the app. 

	Notice that the timestamp is only displayed for items inserted after you updated the insert script.

5. In **TodoActivity.cs**, replace the existing query in **RefreshItemsFromTableAsync** with the following query:

		var list = await todoTable.Where(item => item.Complete == false && 
										 item.CreatedAt != null)
								  .ToListAsync();

	This method updates the query to also filter out items that do not have a timestamp value.
	
6. From the **Run** menu, then click **Run** to start the app.

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
[0]: ./media/partner-xamarin-mobile-services-android-validate-modify-data-server-scripts/mobile-services-selection.png
[1]: ./media/partner-xamarin-mobile-services-android-validate-modify-data-server-scripts/mobile-portal-data-tables.png
[2]: ./media/partner-xamarin-mobile-services-android-validate-modify-data-server-scripts/mobile-insert-script-users.png



<!-- URLs. -->
[Mobile Services server script reference]: http://go.microsoft.com/fwlink/?LinkId=262293
[Get started with Mobile Services]: /en-us/develop/mobile/tutorials/get-started-xamarin-android
[Authorize users with scripts]: /en-us/develop/mobile/tutorials/authorize-users-in-scripts-xamarin-android
[Refine queries with paging]: /en-us/develop/mobile/tutorials/add-paging-to-data-xamarin-android
[Get started with data]: /en-us/develop/mobile/tutorials/get-started-with-data-xamarin-android
[Get started with authentication]: /en-us/develop/mobile/tutorials/get-started-with-users-xamarin-android
[Get started with push notifications]: /en-us/develop/mobile/tutorials/get-started-with-push-xamarin-android

[Management Portal]: https://manage.windowsazure.com/
[Azure Management Portal]: https://manage.windowsazure.com/
[GitHub]: http://go.microsoft.com/fwlink/p/?LinkId=331330
