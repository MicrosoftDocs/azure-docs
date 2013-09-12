<properties linkid="develop-mobile-tutorials-call-custom-api-ios" writer="krisragh" urlDisplayName="Call a custom API from the client" pageTitle="Call a custom API from an iOS client app | Mobile Services Tutorials" metaKeywords="" metaDescription="Learn how to define a custom API and then call it from an iOS app that use Windows Azure Mobile Services." metaCanonical="" disqusComments="1" umbracoNaviHide="1" />

<div chunk="../chunks/article-left-menu-windows-store.md" />

# Call a custom API from the client

<div class="dev-center-tutorial-selector sublanding"> 
	<a href="/en-us/develop/mobile/tutorials/call-custom-api-dotnet" title="Windows Store C#">Windows Store C#</a><a href="/en-us/develop/mobile/tutorials/call-custom-api-js" title="Windows Store JavaScript">Windows Store JavaScript</a><a href="/en-us/develop/mobile/tutorials/call-custom-api-wp8" title="Windows Phone" >Windows Phone</a><a href="/en-us/develop/mobile/tutorials/call-custom-api-ios" title="iOS" >iOS</a>
</div>

This topic shows you how to call a custom API from an iOS app. A custom API enables you to define custom endpoints that expose server functionality that does not map to an insert, update, delete, or read operation. By using a custom API, you can have more control over messaging, including reading and setting HTTP message headers and defining a message body format other than JSON.

The custom API created in this topic gives you the ability to send a single POST request that sets the completed flag to `true` for all the todo items in the table. Without this custom API, the client would have to send individual requests to update the flag for each todo item in the table.

You will add this functionality to the app that you created when you completed either the [Get started with Mobile Services] or the [Get started with data] tutorial. To do this, you will complete the following steps:

1. [Define the custom API]
2. [Update the app to call the custom API]
3. [Test the app] 

This tutorial is based on the Mobile Services quickstart. Before you start this tutorial, you must first complete [Get started with Mobile Services] or [Get started with data]. This tutorial uses Visual Studio 2012 Express for Windows Phone.

## <a name="define-custom-api"></a>Define the custom API

<div chunk="../chunks/mobile-services-create-custom-api.md" />

<h2><a name="update-app"></a><span class="short-header">Update the app </span>Update the app to call the custom API</h2>

iOS is similar to JavaScript in that it doesn’t support JSON serialization of arbitrary types. As such, it has quite a simple API for invoking custom APIs as well, consisting of two methods:


-     `invokeApi:(NSString *)apiName body:(id)body HTTPMethod:(NSString *)method parameters:(NSDictionary *)parameters headers:(NSDictionary *)headers completion:^(id result, NSHTTPURLResponse *response, NSError *error)`
This method passes the body parameter through the NSJSONSerialization to be serialized to the request body, and passes the response through the same class to be deserialized and returned to the caller on the completion block.
- `invokeApi:(NSString *)apiName data:(NSData *)data HTTPMethod:(NSString *)method parameters:(NSDictionary *)parameters headers:(NSDictionary *)headers completion:^(NSData *result, NSHTTPURLResponse *response, NSError *error)`
This method sends the data parameter as the request body directly, without applying any formatting, and sends the raw bytes of the result to the completion block.


Armed with this information, take the following steps to update the iOS quickstart application:

1. Use XCode to add an additional button. Drag a Round Rect Button from the Object Library located at the bottom of the Utilities pane, and place it below the text field. Double-click to add the text “Complete all”.

2. Update the application's code to create a corresponding action for the button: 

		- (void) complete
		{
			[client invokeAPI:@"completeAll" body:nil HTTPMethod:@"POST" parameters:nil headers:nil completion:^(id result, NSHTTPURLResponse *response, NSError *error) { 
			    if (error) { 
			        [self informUser:@"Error: %@", error]; 
			    } else { 
			        NSString *quoteOfTheDay = [[NSString alloc] initWithData:result encoding:NSUTF8StringEncoding]; 
			        [self informUser:@"%@ items marked as complete", [result objectForKey:@"Count"]]; 
			    } 
			}];
		}
		

## <a name="test-app"></a>Test the app

1. Click Run to test your app.

2. Tap the **Complete All** button.

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
[0]: ../Media/mobile-services-selection.png
[1]: ../Media/mobile-custom-api-create.png
[2]: ../Media/mobile-custom-api-create-dialog2.png
[3]: ../Media/mobile-custom-api-select2.png
[4]: ../Media/mobile-custom-api-windows-phone-completed.png

<!-- URLs. -->
[Windows Push Notifications & Live Connect]: http://go.microsoft.com/fwlink/?LinkID=257677
[Mobile Services server script reference]: http://go.microsoft.com/fwlink/?LinkId=262293
[My Apps dashboard]: http://go.microsoft.com/fwlink/?LinkId=262039
[Get started with Mobile Services]: ../tutorials/mobile-services-get-started-ios.md
[Get started with data]: ../tutorials/mobile-services-get-started-with-data-ios.md
[Get started with authentication]: ../tutorials/mobile-services-get-started-with-users-ios.md
[Get started with push notifications]: ../tutorials/mobile-services-get-started-with-push-ios.md
[WindowsAzure.com]: http://www.windowsazure.com/
[Define a custom API that supports periodic notifications]: ../tutorials/mobile-services-create-pull-notifications-ios.md
[Store server scripts in source control]: ../tutorials/mobile-services-store-scripts-in-source-control.md