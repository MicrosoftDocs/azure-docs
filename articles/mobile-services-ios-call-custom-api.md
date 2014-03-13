<properties linkid="manage-services-media-services" urlDisplayName="Media Services" pageTitle="Call a custom API from an iOS app | Mobile Services" metaKeywords="" description="Learn how to define a custom API and then call it from an iOS app that uses Windows Azure Mobile Services." metaCanonical="" services="" documentationCenter="Mobile" title="Call a custom API from the client" authors="krisragh" solutions="" manager="" editor="" />


# Call a custom API from the client 

<div class="dev-center-tutorial-selector sublanding"> 
	<a href="/en-us/develop/mobile/tutorials/call-custom-api-dotnet" title="Windows Store C#">Windows Store C#</a><a href="/en-us/develop/mobile/tutorials/call-custom-api-js" title="Windows Store JavaScript">Windows Store JavaScript</a><a href="/en-us/develop/mobile/tutorials/call-custom-api-wp8" title="Windows Phone" >Windows Phone</a><a href="/en-us/develop/mobile/tutorials/call-custom-api-ios" title="iOS" class="current">iOS</a><a href="/en-us/develop/mobile/tutorials/call-custom-api-android/" title="Android">Android</a>
</div>

This topic shows you how to call a custom API from an iOS app. A custom API enables you to define custom endpoints that expose server functionality that does not map to an insert, update, delete, or read operation. By using a custom API, you can have more control over messaging, including reading and setting HTTP message headers and defining a message body format other than JSON.

The custom API created in this topic gives you the ability to send a single POST request that sets the completed flag to `true` for all the todo items in the table. Without this custom API, the client would have to send individual requests to update the flag for each todo item in the table.

You will add this functionality to the app that you created when you completed either the [Get started with Mobile Services] or the [Get started with data] tutorial. To do this, you will complete the following steps:

1. [Define the custom API]
2. [Update the app to call the custom API]
3. [Test the app] 

This tutorial is based on the Mobile Services quickstart. Before you start this tutorial, you must first complete [Get started with Mobile Services] or [Get started with data]. This tutorial requires the [Mobile Services iOS SDK](https://go.microsoft.com/fwLink/p/?LinkID=266533) and [XCode 4.5](https://go.microsoft.com/fwLink/p/?LinkID=266532) and iOS 5.0 or later versions.

## <a name="define-custom-api"></a>Define the custom API

[WACOM.INCLUDE [mobile-services-create-custom-api](../includes/mobile-services-create-custom-api.md)]

<h2><a name="update-app"></a><span class="short-header">Update the app </span>Update the app to call the custom API</h2>

1. Create a button, so you can click it to call the custom API. Drag a **Round Rect Button** from the **Object Library** located at the bottom of the **Utilities** pane, and place it below or next to the text field. Double-click to add the text **"All"**. 

	This adds a new button **"All"**.

2. Open the **QSTodoService.m** code file, locate the `refreshDataOnSuccess` method and make sure that it contains the following code:

		- (void)refreshDataOnSuccess:(QSCompletionBlock)completion
		{		   
		    // Create a predicate that finds items where complete is false
		    NSPredicate * predicate = [NSPredicate predicateWithFormat:@"complete == NO"];
		    
		    // Query the TodoItem table and update the items property with the results from the service
		    [self.table readWithPredicate:predicate completion:^(NSArray *results, NSInteger totalCount, NSError *error)
		    {
		        [self logErrorIfNotNil:error];
		        
		        items = [results mutableCopy];
		        
		        // Let the caller know that we finished
		        completion();
		    }];		    		    		    
		}

	This filters the items so that completed items are not returned by the query.

3. Now it's time to connect this object to the view controller source code. **Control-click** the new **"All"** button, and drag the mouse over to before the `@end` line in **QSTodoListViewController.h**. Connect the object to a new **Action** named `onCompleteAll` in **QSTodoListViewController**. Xcode will automatically insert the following line before the `@end` line:

		   - (IBAction)onCompleteAll:(id)sender;

4. The goal of this `onCompleteAll` method is to handle the Click event for the new button. It invokes a new `completeAll` method that we will add to our custom class, which in turn sends a POST request to the new custom API. The result returned by the custom API is displayed in a message dialog, as are any errors. Edit **QSTodoListViewController.m** to add the following implementation before the `@end` line:

		   - (IBAction)onCompleteAll:(id)sender {
		    [self.todoService completeAll:^(id result, NSHTTPURLResponse* response, NSError* error)
		     {
		         if (error)
		         {
		             NSString* errorMessage = @"There was a problem! ";
		             errorMessage = [errorMessage stringByAppendingString:[error localizedDescription]];
		             UIAlertView* myAlert = [[UIAlertView alloc]
		                                     initWithTitle:@"Error!"
		                                     message:errorMessage
		                                     delegate:nil
		                                     cancelButtonTitle:@"Okay"
		                                     otherButtonTitles:nil];
		             [myAlert show];
		             [self refresh];
		         } else {
		             NSString* successMessage = [NSString stringWithFormat:@"%d items marked as complete", [[result objectForKey:@"count"] integerValue]];					 
		             UIAlertView* myAlert = [[UIAlertView alloc]
		                                     initWithTitle:@"Success!"
		                                     message:successMessage
		                                     delegate:nil
		                                     cancelButtonTitle:@"Okay"
		                                     otherButtonTitles:nil];
		             [myAlert show];
		             [self refresh];
		         }
		     }];
  		   }

5. Notice that the code above refers to a new method `completeAll` that has not yet been defined in **QSTodoService**. Edit **QSTodoService.h** and add the following line before the `@end` line:

		- (void) completeAll:(MSAPIBlock)completion;

6. Add the corresponding implementation of `completeAll` in **QSTodoService.m** before the `@end` line. iOS is similar to JavaScript in that it doesn't support JSON serialization of arbitrary types. As such, it has quite a simple API for invoking custom APIs as well, consisting of the `invokeAPI` method. 

		- (void) completeAll:(MSAPIBlock)completion
		{
		    [self.client
		     invokeAPI:@"completeall"
		     body:nil
		     HTTPMethod:@"POST"
		     parameters:nil
		     headers:nil
		     completion:completion ];
		}

## <a name="test-app"></a>Test the app

1. In Xcode, select an emulator to deploy to (either iPhone or iPad), press the **Run** button (or the **Command+R** key) to rebuild the project and start the app. This executes your Windows Azure Mobile Services client, built with the iOS SDK, that queries items from your mobile service.

2. Type text in the text field, and then click the **+** button. This sends a new item as an insert to the mobile service.

3. Repeat the previous step until you have added several items to the list.

4. Tap the **All** button. An alert box is displayed that indicates the number of items marked complete and the filtered query is executed again, which clears all items from the list.

  	![][4]


## Next steps

Now that you have created a custom API and called it from your iOS app, consider finding out more about the following Mobile Services topics:

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




[4]: ./media/mobile-services-ios-call-custom-api/mobile-custom-api-ios-completed.png

<!-- URLs. -->
[Windows Push Notifications & Live Connect]: http://go.microsoft.com/fwlink/?LinkID=257677
[Mobile Services server script reference]: http://go.microsoft.com/fwlink/?LinkId=262293
[My Apps dashboard]: http://go.microsoft.com/fwlink/?LinkId=262039
[Get started with Mobile Services]: /en-us/develop/mobile/tutorials/get-started-ios
[Get started with data]: /en-us/develop/mobile/tutorials/get-started-with-data-ios
[Get started with authentication]: /en-us/develop/mobile/tutorials/get-started-with-users-ios
[Get started with push notifications]: /en-us/develop/mobile/tutorials/get-started-with-push-ios

[Define a custom API that supports periodic notifications]: ./en-us/develop/mobile/tutorials/create-pull-notifications-ios
[Store server scripts in source control]: /en-us/develop/mobile/tutorials/store-scripts-in-source-control
