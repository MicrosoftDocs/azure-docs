<properties
	pageTitle="Use server scripts to validate and modify data (Xamarin iOS) | Mobile Dev Center"
	description="Learn how to validate and modify data sent using server scripts from your Xamarin iOS app."
	services="mobile-services"
	documentationCenter="xamarin"
	authors="ggailey777"
	manager="dwrede"
	editor=""/>

<tags
	ms.service="mobile-services"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-xamarin-ios"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="04/24/2015"
	ms.author="ggailey777"/>

# Validate and modify data in Mobile Services by using server scripts

[AZURE.INCLUDE [mobile-services-selector-validate-modify-data](../includes/mobile-services-selector-validate-modify-data.md)]

This topic shows you how to leverage server scripts in Azure Mobile Services. Server scripts are registered in a mobile service and can be used to perform a wide range of operations on data being inserted and updated, including validation and data modification. In this tutorial, you will define and register server scripts that validate and modify data. Because the behavior of server side scripts often affects the client, you will also update your iOS app to take advantage of these new behaviors. The finished code is available in the [ValidateModifyData app][GitHub] sample.

This tutorial walks you through these basic steps:

1. [Add string length validation]
2. [Update the client to support validation]
3. [Add a timestamp on insert]
4. [Update the client to display the timestamp]

This tutorial builds on the steps and the sample app from the previous tutorial [Get started with data]. Before you begin this tutorial, you should first complete [Get started with data].  

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

    > [AZURE.NOTE] You can remove a registered script on the **Script** tab by clicking **Clear** and then **Save**.

## <a name="update-client-validation"></a>Update the client

Now that the mobile service is validating data and sending error responses, you need to update your app to be able to handle error responses from validation.

1. In Xamarin Studio, open the project that you modified when you completed the tutorial [Get started with data].

2. Press the **Run** button to build the project and start the app, then type text longer than 10 characters in the textbox and click the  plus (**+**) icon.

	Notice that the app raises an unhandled error as a result of the 400 response (Bad Request) returned by the mobile service.

3. In the TodoService.cs file, locate the current <code>try/catch</code> exception handling in the **InsertTodoItemAsync** method, and replace the <code>catch</code> with:

    catch (Exception ex) {
        var exDetail = (ex.InnerException.InnerException as MobileServiceInvalidOperationException);
        Console.WriteLine(exDetail.Message);

        UIAlertView alert = new UIAlertView() {
            	Title = "Error",
            	Message = exDetail.Message
        } ;
        alert.AddButton("Ok");
        alert.Show();

        return -1;
		}

	This shows a popup window which displays the error to the user.

4. Locate the **OnAdd** method in **TodoListViewController.cs**. Update the method to make sure the returned <code>index</code> isn't <code>-1</code> as is returned in the exception handling in **InsertTodoItemAsync**. In this case we don't want to add a new row to the <code>TableView</code>.

    if (index != -1) {
        TableView.InsertRows(new [] { NSIndexPath.FromItemSection(index, 0) },
            UITableViewRowAnimation.Top);
        itemText.Text = "";
    }


5. Rebuild and start the app.

	![][4]

	Notice that error is handled and the error messaged is displayed to the user.


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
[0]: ./media/partner-xamarin-mobile-services-ios-validate-modify-data-server-scripts/mobile-services-selection.png
[1]: ./media/partner-xamarin-mobile-services-ios-validate-modify-data-server-scripts/mobile-portal-data-tables.png
[2]: ./media/partner-xamarin-mobile-services-ios-validate-modify-data-server-scripts/mobile-insert-script-users.png

[4]: ./media/partner-xamarin-mobile-services-ios-validate-modify-data-server-scripts/mobile-quickstart-data-error-ios.png

<!-- URLs. -->
[Mobile Services server script reference]: http://go.microsoft.com/fwlink/?LinkId=262293
[Get started with Mobile Services]: /develop/mobile/tutorials/get-started-xamarin-ios
[Authorize users with scripts]: /develop/mobile/tutorials/authorize-users-in-scripts-xamarin-ios
[Refine queries with paging]: /develop/mobile/tutorials/add-paging-to-data-xamarin-ios
[Get started with data]: /develop/mobile/tutorials/get-started-with-data-xamarin-ios
[Get started with authentication]: /develop/mobile/tutorials/get-started-with-users-xamarin-ios
[Get started with push notifications]: /develop/mobile/tutorials/get-started-with-push-xamarin-ios

[Management Portal]: https://manage.windowsazure.com/
[Azure Management Portal]: https://manage.windowsazure.com/
[GitHub]: http://go.microsoft.com/fwlink/p/?LinkId=331330
