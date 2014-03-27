<properties pageTitle="Get Started with Mobile Services for Xamarin iOS apps" metaKeywords="" description="Follow this tutorial to get started using Azure Mobile Services for Xamarin iOS development." metaCanonical="" services="mobile" documentationCenter="Mobile" title="Get started with Mobile Services" authors="craigd" solutions="" manager="" editor="" />

# <a name="getting-started"> </a>Get started with Mobile Services

<div class="dev-center-tutorial-selector sublanding">
	<a href="/en-us/documentation/articles/mobile-services-windows-store-get-started" title="Windows Store">Windows Store</a>
	<a href="/en-us/documentation/articles/mobile-services-windows-phone-get-started" title="Windows Phone">Windows Phone</a>
	<a href="/en-us/documentation/articles/mobile-services-ios-get-started" title="iOS">iOS</a>
	<a href="/en-us/documentation/articles/mobile-services-android-get-started" title="Android">Android</a>
	<a href="/en-us/documentation/articles/mobile-services-html-get-started" title="HTML">HTML</a>
	<a href="/en-us/documentation/articles/partner-xamarin-mobile-services-ios-get-started" title="Xamarin.iOS" class="current">Xamarin.iOS</a>
	<a href="/en-us/documentation/articles/partner-xamarin-mobile-services-android-get-started" title="Xamarin.Android">Xamarin.Android</a>
	<a href="/en-us/documentation/articles/partner-sencha-mobile-services-get-started/" title="Sencha">Sencha</a>
	<a href="/en-us/documentation/articles/mobile-services-javascript-backend-phonegap-get-started/" title="PhoneGap">PhoneGap</a>
</div>

<!--<div class="dev-center-tutorial-subselector">
	<a href="/en-us/documentation/articles/mobile-services-dotnet-backend-xamarin-ios-get-started/" title=".NET backend">.NET backend</a> | 
	<a href="/en-us/documentation/articles/partner-xamarin-mobile-services-ios-get-started/"  title="JavaScript backend" class="current">JavaScript backend</a>
</div>-->

<div class="dev-onpage-video-clear clearfix">
<div class="dev-onpage-left-content">
<p>This tutorial shows you how to add a cloud-based backend service to a Xamarin.iOS app using Azure Mobile Services. In this tutorial, you will create both a new mobile service and a simple <em>To do list</em> app that stores app data in the new mobile service.</p>
<p>If you prefer to watch a video, the clip to the right follows the same steps as this tutorial.</p>
</div>
<div class="dev-onpage-video-wrapper"><a href="http://channel9.msdn.com/Series/Windows-Azure-Mobile-Services/Getting-Started-with-Xamarin-and-Windows-Azure-Mobile-Services" target="_blank" class="label">watch the tutorial</a> <a style="background-image: url('/media/devcenter/mobile/videos/get-started-xamarin-180x120.png') !important;" href="http://channel9.msdn.com/Series/Windows-Azure-Mobile-Services/Getting-Started-with-Xamarin-and-Windows-Azure-Mobile-Services" target="_blank" class="dev-onpage-video"><span class="icon">Play Video</span></a> <span class="time">10:05</span></div>
</div>

A screenshot from the completed app is below:

![][0]

Completing this tutorial requires XCode 4.5 and iOS 5.0 or later versions as well as [Xamarin Studio] for OS X or the Xamarin Visual Studio plug-in for Visual Studio on Windows.

<div class="dev-callout"><strong>Note</strong> <p>To complete this tutorial, you need an Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see <a href="http://www.windowsazure.com/en-us/pricing/free-trial/?WT.mc_id=A643EE910&amp;returnurl=http%3A%2F%2Fwww.windowsazure.com%2Fen-us%2Fdevelop%2Fmobile%2Ftutorials%2Fget-started-xamarin-ios%2F" target="_blank">Azure Free Trial</a>.</p></div>

## <a name="create-new-service"> </a>Create a new mobile service

[WACOM.INCLUDE [mobile-services-create-new-service](../includes/mobile-services-create-new-service.md)]

<h2><span class="short-header">Create a new app</span>Create a new Xamarin.iOS app</h2>

Once you have created your mobile service, you can follow an easy quickstart in the Management Portal to either create a new app or modify an existing app to connect to your mobile service. 

In this section you will create a new Xamarin.iOS app that is connected to your mobile service.

1.  In the Management Portal, click **Mobile Services**, and then click the mobile service that you just created.

2. In the quickstart tab, click **Xamarin.iOS** under **Choose platform** and expand **Create a new Xamarin.iOS app**.

	![][6]

	This displays the three easy steps to create a Xamarin.iOS app connected to your mobile service.

  	![][7]

3. If you haven't already done so, download and install [Xcode] v4.4 or a later version and [Xamarin Studio].

4. Click **Create TodoItems table** to create a table to store app data.

5. Under **Download and run app**, click **Download**. 

	This downloads the project for the sample _To do list_ application that is connected to your mobile service and references the Azure Mobile Services component for Xamarin.iOS. Save the compressed project file to your local computer, and make a note of where you saved it.

<h2><span class="short-header">Run your app</span>Run your new Xamarin.iOS app</h2>

The final stage of this tutorial is to build and run your new app.

1. Browse to the location where you saved the compressed project files, expand the files on your computer, and open the **XamarinTodoQuickStart.iOS.sln** solution file using Xamarin Studio or Visual Studio.

	![][8]

	![][9]

2. Press the **Run** button to build the project and start the app in the iPhone emulator, which is the default for this project.

3. In the app, type meaningful text, such as _Complete the tutorial_ and then click the plus (**+**) icon.

	![][10]

	This sends a POST request to the new mobile service hosted in Azure. Data from the request is inserted into the TodoItem table. Items stored in the table are returned by the mobile service, and the data is displayed in the list.

	<div class="dev-callout"> 
	<b>Note</b> 
   	<p>You can review the code that accesses your mobile service to query and insert data, which is found in the TodoService.cs C# file.</p> 
 	</div>

4. Back in the Management Portal, click the **Data** tab and then click the **TodoItems** table.

	![][11]

	This lets you browse the data inserted by the app into the table.

	![][12]

## <a name="next-steps"> </a>Next Steps
Now that you have completed the quickstart, learn how to perform additional important tasks in Mobile Services: 

* [Get started with data]
  <br/>Learn more about storing and querying data using Mobile Services.

* [Get started with authentication]
  <br/>Learn how to authenticate users of your app with an identity provider.

* [Get started with push notifications] 
  <br/>Learn how to send a very basic push notification to your app.


<!-- Anchors. -->
[Getting started with Mobile Services]:#getting-started
[Create a new mobile service]:#create-new-service
[Define the mobile service instance]:#define-mobile-service-instance
[Next Steps]:#next-steps

<!-- Images. -->
[0]: ./media/partner-xamarin-mobile-services-ios-get-started/mobile-quickstart-completed-ios.png
[6]: ./media/partner-xamarin-mobile-services-ios-get-started/mobile-portal-quickstart-xamarin-ios.png
[7]: ./media/partner-xamarin-mobile-services-ios-get-started/mobile-quickstart-steps-xamarin-ios.png
[8]: ./media/partner-xamarin-mobile-services-ios-get-started/mobile-xamarin-project-ios-xs.png
[9]: ./media/partner-xamarin-mobile-services-ios-get-started/mobile-xamarin-project-ios-vs.png
[10]: ./media/partner-xamarin-mobile-services-ios-get-started/mobile-quickstart-startup-ios.png
[11]: ./media/partner-xamarin-mobile-services-ios-get-started/mobile-data-tab.png
[12]: ./media/partner-xamarin-mobile-services-ios-get-started/mobile-data-browse.png


<!-- URLs. -->
[Get started with data]: /en-us/develop/mobile/tutorials/get-started-with-data-xamarin-ios
[Get started with authentication]: /en-us/develop/mobile/tutorials/get-started-with-users-xamarin-ios
[Get started with push notifications]: /en-us/develop/mobile/tutorials/get-started-with-push-xamarin-ios

[Xamarin Studio]: http://xamarin.com/download
[Mobile Services iOS SDK]: https://go.microsoft.com/fwLink/p/?LinkID=266533

[Management Portal]: https://manage.windowsazure.com/
