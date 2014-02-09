<properties linkid="develop-mobile-tutorials-get-started" urlDisplayName="Get Started" pageTitle="Get Started with Mobile Services for Windows Store apps | Mobile Dev Center" metaKeywords="" description="Follow this tutorial to get started using Windows Azure Mobile Services for Windows Store development in C#, VB, or JavaScript. " metaCanonical="" services="" documentationCenter="Mobile" title="Get started with Mobile Services" authors=""  solutions="" writer="glenga" manager="" editor=""  />


# <a name="getting-started"> </a>Get started with Mobile Services

<div class="dev-center-tutorial-selector sublanding"><a href="/en-us/develop/mobile/tutorials/get-started" title="Windows Store" class="current">Windows Store</a><a href="/en-us/develop/mobile/tutorials/get-started-wp8" title="Windows Phone">Windows Phone</a><a href="/en-us/develop/mobile/tutorials/get-started-ios" title="iOS">iOS</a>
<!--<a href="/en-us/develop/mobile/tutorials/get-started-android" title="Android">Android</a><a href="/en-us/develop/mobile/tutorials/get-started-html" title="HTML">HTML</a><a href="/en-us/develop/mobile/tutorials/get-started-xamarin-ios" title="Xamarin.iOS">Xamarin.iOS</a><a href="/en-us/develop/mobile/tutorials/get-started-xamarin-android" title="Xamarin.Android">Xamarin.Android</a><a href="/en-us/develop/mobile/tutorials/get-started-sencha/" title="Sencha">Sencha</a>--></div>

This tutorial shows you how to add a cloud-based backend service to a Windows Store app using Windows Azure Mobile Services. In this tutorial, you will create both a new mobile service and a simple _To do list_ app that stores app data in the new mobile service. The mobile service that you will create uses the supported .NET languages using Visual Studio for server-side business logic and to manage the mobile service. To create a mobile service that lets you write your server-side business logic in JavaScript, see the [JavaScript version] of this topic.

A screenshot from the completed app is below:

![][0]

Completing this tutorial is a prerequisite for all other Mobile Services tutorials for Windows Store apps. 

>[WACOM.NOTE]To complete this tutorial, you need a Windows Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see <a href="http://www.windowsazure.com/en-us/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fwww.windowsazure.com%2Fen-us%2Fdocumentation%2Farticles%2Fmobile-services-dotnet-backend-windows-store-get-started%2F" target="_blank">Windows Azure Free Trial</a>.<br />This tutorial requires <a href="https://go.microsoft.com/fwLink/p/?LinkID=257546" target="_blank">Visual Studio Professional 2013</a>. A free trial version is available.

## Create a new mobile service

[WACOM.INCLUDE [mobile-services-dotnet-backend-create-new-service](../includes/mobile-services-dotnet-backend-create-new-service.md)]

## Create a new Windows Store app

Once you have created your mobile service, you can follow an easy quickstart in the Management Portal to either create a new app or modify an existing app to connect to your mobile service. 

In this section you will create a new Windows Store app that is connected to your mobile service.

1. In the Management Portal, click **Mobile Services**, and then click the mobile service that you just created.
   
2. In the quickstart tab, click **Windows** under **Choose platform** and expand **Create a new Windows Store app**.

   	![][6]

   	This displays the three easy steps to create a Windows Store app connected to your mobile service.

  	![][7]

3. If you haven't already done so, download and install <a href="https://go.microsoft.com/fwLink/p/?LinkID=257546" target="_blank">Visual Studio Professional 2013</a> on your local computer or virtual machine.

4. Under **Download and run your app and service locally**, select a language for your Windows Store app, then click **Download**. 

  	This downloads a solution contains projects for both the mobile service and for the sample _To do list_ application that is connected to your mobile service. Save the compressed project file to your local computer, and make a note of where you save it.

5. Under **Publish your service to the cloud**, click to download your publish profile. Save the downloaded file to your local computer, and make a note of where you save it.

	<div class="dev-callout"><strong>Security note</strong> <p>After importing the publish profile, consider deleting the downloaded file as it contains information that can be used by others to access your services.</p></div>

## Test the app against the local mobile service

1. Browse to the location where you saved the compressed project files, expand the files on your computer, and open the solution file in Visual Studio 2013 Express for Windows.

2. Press the **F5** key to rebuild the project and start the mobile service locally.

	![][8]

	A web page is displayed after the mobile service starts successfully.

3. In Solution Explorer in Visual Studio, right-click your Windows Store app project and click **Set as StartUp Project** and then press the **F5** key to rebuild the project and start the app.

	This starts the Windows Store app, which connects to the local mobile service instance.	

4. In the app, type meaningful text, such as _Complete the tutorial_, in **Insert a TodoItem**, and then click **Save**.

	![][10]

	This sends a POST request to the local mobile service. Data from the request is inserted into the TodoItem table. Items stored in the table are returned by the mobile service, and the data is displayed in the second column in the app.

	>[WACOM.NOTE]You can review the code that accesses your mobile service to query and insert data, which is found in the MainPage.xaml.cs file.


## Publish your mobile service

After testing the Windows Store app against the local mobile service, the final stage of this tutorial is to publish the mobile service to Windows Azure and run the app against the live service.

1. In Solution Explorer, right-click the mobile service project and click **Publish**, then in the Publish Web dialog box, click **Import**, click **Browse**, navigate to the location where you earlier saved the publish profile file, Select the publish profile file, click **OK**, then click **Publish**.

	![][11]

	After publishing succeeds, you will again see the confirmation page that the mobile service is up and running, this time in Windows Azure.

2. In the Windows Store app project, open the App.xaml.cs file, locate the code that creates a **MobileServiceClient** instance, comment-out the code that creates this client using _localhost_ and uncomment the code that creates the client using the remote mobile service URL, which looks like the following:

        public static MobileServiceClient MobileService = new MobileServiceClient(
            "https://<your_mobile_service>.azure-mobile.net/",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
        );

	The client will now access the mobile service published to Windows Azure. 
 
3. Press the **F5** key to rebuild the project and start the app.

4. In the app, type meaningful text, such as _Complete the tutorial_, in **Insert a TodoItem**, and then click **Save**.

	![][10]

## Next Steps
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
[0]: ./media/mobile-services-dotnet-backend-windows-store-dotnet-get-started/mobile-quickstart-completed.png

[6]: ./media/mobile-services-dotnet-backend-windows-store-dotnet-get-started/mobile-portal-quickstart.png
[7]: ./media/mobile-services-dotnet-backend-windows-store-dotnet-get-started/mobile-quickstart-steps.png
[8]: ./media/mobile-services-dotnet-backend-windows-store-dotnet-get-started/mobile-service-startup.png

[10]: ./media/mobile-services-dotnet-backend-windows-store-dotnet-get-started/mobile-quickstart-startup.png
[11]: ./media/mobile-services-dotnet-backend-windows-store-dotnet-get-started/mobile-quickstart-publish.png
[12]: ./media/mobile-services-dotnet-backend-windows-store-dotnet-get-started/mobile-data-browse.png


<!-- URLs. -->
[Get started with data]: /en-us/documentation/articles/mobile-services-dotnet-backend-windows-store-dotnet-get-started-data
[Get started with authentication]: /en-us/documentation/articles/mobile-services-dotnet-backend-windows-store-dotnet-get-started-users
[Get started with push notifications]: /en-us/documentation/articles/mobile-services-dotnet-backend-windows-store-dotnet-get-started-push-notification-hubs
[Visual Studio Professional 2013]: https://go.microsoft.com/fwLink/p/?LinkID=257546
[Mobile Services SDK]: http://go.microsoft.com/fwlink/?LinkId=257545
[JavaScript and HTML]: mobile-services-win8-javascript/
[Management Portal]: https://manage.windowsazure.com/
[JavaScript version]: /en-us/documentation/articles/mobile-services-windows-store-get-started
[Get started with data in Mobile Services using Visual Studio 2012]: /en-us/documentation/articles/mobile-services-windows-store-dotnet-get-started-data-vs2012