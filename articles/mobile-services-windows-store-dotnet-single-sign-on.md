<properties urlDisplayName="Authenticate with single sign-on" pageTitle="Authenticate your Windows Store app with Live Connect" metaKeywords="Azure Live Connect, Azure SSO, SSO Live Connect, mobile services sso, Windows Store app sso" description="Learn how to use Live Connect single sign-on in Azure Mobile Services from a Windows Store application." metaCanonical="" services="mobile-services" documentationCenter="Mobile" title="Authenticate your Windows Store app with Live Connect single sign-on" authors="glenga" solutions="" manager="dwrede" editor="" />

<tags ms.service="mobile-services" ms.workload="mobile" ms.tgt_pltfrm="mobile-windows-store" ms.devlang="dotnet" ms.topic="article" ms.date="11/22/2014" ms.author="glenga" />

# Authenticate your Windows Store app with Live Connect single sign-on
<div class="dev-center-tutorial-selector sublanding"> 
	<a href="/en-us/documentation/articles/mobile-services-windows-store-dotnet-single-sign-on/" title="Windows Store C#" class="current">Windows Store C#</a><a href="/en-us/documentation/articles/mobile-services-windows-store-javascript-single-sign-on/" title="Windows Store JavaScript">Windows Store JavaScript</a><a href="/en-us/documentation/articles/mobile-services-windows-phone-single-sign-on/" title="Windows Phone">Windows Phone</a>
</div>	

This topic shows you how to use Live Connect single sign-on to authenticate users in Azure Mobile Services from a Windows Store or Windows Phone 8.1 Store app.  In this tutorial, you add authentication to the quickstart project using Live Connect. When successfully authenticated by Live Connect, a logged-in user is welcomed by name and the user ID value is displayed.  

>[WACOM.NOTE]This tutorial demonstrates the benefits of using the single sign-on experience provided by Live Connect for Windows Store apps. This enables you to more easily authenticate an already logged-on user with you mobile service. For a more generalized authentication experience that supports multiple authentication providers, see the topic <a href="/en-us/documentation/articles/mobile-services-windows-store-dotnet-get-started-users/">Get started with authentication</a>. 

This tutorial walks you through these basic steps to enable Live Connect authentication:

1. [Register your app for authentication and configure Mobile Services]
2. [Restrict table permissions to authenticated users]
3. [Add authentication to the app]

This tutorial requires the following:

+ [Live SDK for Windows]
+ Microsoft Visual Studio 2012 Express for Windows 8 RC, or a later version
+ You must also first complete the tutorial [Add Mobile Services to an existing app].

##<a name="register"></a>Register your app for the Windows Store

To be able to authenticate users, you must submit your app to the Windows Store. You must then register the client secret to integrate Live Connect with Mobile Services.

[WACOM.INCLUDE [mobile-services-register-windows-store-app](../includes/mobile-services-register-windows-store-app.md)]

##<a name="permissions"></a>Restrict permissions to authenticated users

[WACOM.INCLUDE [mobile-services-restrict-permissions-javascript-backend](../includes/mobile-services-restrict-permissions-javascript-backend.md)] 

<ol start="3">
<li><p>In Visual Studio 2012 Express for Windows 8, open the project that you created when you completed the tutorial <a href="/en-us/documentation/articles/mobile-services-windows-store-get-started">Get started with Mobile Services</a>.</p></li> 
<li><p>Press the F5 key to run this quickstart-based app; verify that an unhandled exception with a status code of 401 (Unauthorized) is raised after the app starts.</p>
   
   	<p>This happens because the app attempts to access Mobile Services as an unauthenticated user, but the <em>TodoItem</em> table now requires authentication.</p></li>
</ol>

Next, you will update the app to authenticate users before requesting resources from the mobile service.

##<a name="add-authentication"></a>Add authentication to the app

1. Download and install the [Live SDK for Windows].

2. In the **Project** menu in Visual Studio, click **Add Reference**, then expand **Windows**, click **Extensions**, check **Live SDK**, and then click **OK**. 

  	![][16]

  	This adds a reference to the Live SDK to the project.

5. Open the project file MainPage.xaml.cs and add the following using statement:

        using Microsoft.Live;        

6. Add the following code snippet to the MainPage class:
	
        private LiveConnectSession session;
        private async System.Threading.Tasks.Task AuthenticateAsync()
        {
            LiveAuthClient liveIdClient = new LiveAuthClient("<< INSERT REDIRECT DOMAIN HERE >>");

            while (session == null)
            {
                // Force a logout to make it easier to test with multiple Microsoft Accounts
                if (liveIdClient.CanLogout)
                    liveIdClient.Logout();
	
                LiveLoginResult result = await liveIdClient.LoginAsync(new[] { "wl.basic" });
                if (result.Status == LiveConnectSessionStatus.Connected)
                {
                    session = result.Session;
                    LiveConnectClient client = new LiveConnectClient(result.Session);
                    LiveOperationResult meResult = await client.GetAsync("me");
                    MobileServiceUser loginResult = await App.MobileService
                        .LoginWithMicrosoftAccountAsync(result.Session.AuthenticationToken);
	
                    string title = string.Format("Welcome {0}!", meResult.Result["first_name"]);
                    var message = string.Format("You are now logged in - {0}", loginResult.UserId);
                    var dialog = new MessageDialog(message, title);
                    dialog.Commands.Add(new UICommand("OK"));
                    await dialog.ShowAsync();
                }
                else
                {
                    session = null;
                    var dialog = new MessageDialog("You must log in.", "Login Required");
                    dialog.Commands.Add(new UICommand("OK"));
                    await dialog.ShowAsync();
                }
            }
         }

    This creates a member variable for storing the current Live Connect session and a method to handle the authentication process. This code forces a logout, when possible, to make sure that the user is prompted for credentials each time the application runs. This makes it easier to test the application with different Microsoft Accounts to ensure that the authentication is working correctly. This mechanism will only work if the logged in user does not have a connected Microsoft account. 

	>[WACOM.NOTE]You should not request either Live Connection authentiction tokens or Mobile Services authorization tokens every time that your app runs. Not only is this inefficient, you can run into usage-relates issues should many customers try to start your app at the same time. A better approach is to cache the tokens and first try to use the cached Mobile Services token before calling **LoginWithMicrosoftAccountAsync**. For an example of how to cache this token, see [Get started with authentication](/en-us/documentation/articles/mobile-services-windows-store-dotnet-get-started-users/#tokens)
	

7. Update string _<< INSERT REDIRECT DOMAIN HERE >>_ from the previous step with the redirect domain that was specified when configuring the app in Live Connect, in the format **https://_service-name_.azure-mobile.net/**.

    <div class="dev-callout"><b>Note</b>
	<p>In a Windows Store app, an instance of the <strong>LiveAuthClient</strong> class is created by passing the redirect domain URI value to the class constructor. In a <a href="/en-us/develop/mobile/tutorials/single-sign-on-wp8/">Windows Phone 8 app</a>, the same class is instantiated by passing the client ID.</p>
    </div>

8. Replace the existing **OnNavigatedTo** event handler with the handler that calls the new **Authenticate** method:

        protected override async void OnNavigatedTo(NavigationEventArgs e)
        {
            await AuthenticateAsync();
            RefreshTodoItems();
        }
		
9. Press the F5 key to run the app and sign into Live Connect with your Microsoft Account. 

   When you are successfully logged-in, the app should run without errors, and you should be able to query Mobile Services and make updates to data.

## <a name="next-steps"> </a>Next steps

In the next tutorial, [Authorize users with scripts], you will take the user ID value provided by Mobile Services based on an authenticated user and use it to filter the data returned by Mobile Services. For information about how to use other identity providers for authentication, see [Get started with authentication]. Learn more about how to use Mobile Services with .NET in [Mobile Services .NET How-to Conceptual Reference]

<!-- Anchors. -->
[Register your app for authentication and configure Mobile Services]: #register
[Restrict table permissions to authenticated users]: #permissions
[Add authentication to the app]: #add-authentication
[Next Steps]:#next-steps

<!-- Images. -->
[0]: ./media/mobile-services-windows-store-dotnet-single-sign-on/mobile-services-submit-win8-app.png
[1]: ./media/mobile-services-windows-store-dotnet-single-sign-on/mobile-services-win8-app-name.png
[2]: ./media/mobile-services-windows-store-dotnet-single-sign-on/mobile-services-store-association.png
[3]: ./media/mobile-services-windows-store-dotnet-single-sign-on/mobile-services-select-app-name.png
[4]: ./media/mobile-services-windows-store-dotnet-single-sign-on/mobile-services-selection.png
[5]: ./media/mobile-services-windows-store-dotnet-single-sign-on/mobile-service-uri.png
[6]: ./media/mobile-services-windows-store-dotnet-single-sign-on/mobile-live-connect-apps-list.png
[7]: ./media/mobile-services-windows-store-dotnet-single-sign-on/mobile-live-connect-app-api-settings.png





[13]: ./media/mobile-services-windows-store-dotnet-single-sign-on/mobile-identity-tab-ma-only.png
[14]: ./media/mobile-services-windows-store-dotnet-single-sign-on/mobile-portal-data-tables.png
[15]: ./media/mobile-services-windows-store-dotnet-single-sign-on/mobile-portal-change-table-perms.png
[16]: ./media/mobile-services-windows-store-dotnet-single-sign-on/mobile-add-reference-live-dotnet.png

<!-- URLs. -->
[Submit an app page]: http://go.microsoft.com/fwlink/p/?LinkID=266582
[My Applications]: http://go.microsoft.com/fwlink/p/?LinkId=262039
[Live SDK for Windows]: http://go.microsoft.com/fwlink/p/?LinkId=262253
[Add Mobile Services to an existing app]: /en-us/documentation/articles/mobile-services-windows-store-dotnet-get-started-data/
[Get started with authentication]: /en-us/documentation/articles/mobile-services-windows-store-dotnet-get-started-users
[Authorize users with scripts]: /en-us/documentation/articles/mobile-services-windows-store-dotnet-authorize-users-in-scripts/

[Azure Management Portal]: https://manage.windowsazure.com/
[Mobile Services .NET How-to Conceptual Reference]: /en-us/develop/mobile/how-to-guides/work-with-net-client-library
