<properties linkid="develop-mobile-tutorials-get-started-with-users-dotnet" urlDisplayName="Get Started with Users" pageTitle="Get started with authentication (Windows Store) | Mobile Dev Center" metaKeywords="" description="Learn how to use Mobile Services to authenticate users of your Windows Store app through a variety of identity providers, including Google, Facebook, Twitter, and Microsoft." metaCanonical="" services="" documentationCenter="Mobile" title="Get started with authentication in Mobile Services" authors="glenga" solutions="" manager="" editor="" />




# Get started with authentication in Mobile Services

<div class="dev-center-tutorial-selector sublanding"><a href="/en-us/develop/mobile/tutorials/get-started-with-users-dotnet" title="Windows Store C#" class="current">Windows Store C#</a><a href="/en-us/develop/mobile/tutorials/get-started-with-users-js" title="Windows Store JavaScript">Windows Store JavaScript</a><a href="/en-us/develop/mobile/tutorials/get-started-with-users-wp8" title="Windows Phone">Windows Phone</a><a href="/en-us/develop/mobile/tutorials/get-started-with-users-ios" title="iOS">iOS</a><a href="/en-us/develop/mobile/tutorials/get-started-with-users-android" title="Android">Android</a><a href="/en-us/develop/mobile/tutorials/get-started-with-users-html" title="HTML">HTML</a><a href="/en-us/develop/mobile/tutorials/get-started-with-users-xamarin-ios" title="Xamarin.iOS">Xamarin.iOS</a><a href="/en-us/develop/mobile/tutorials/get-started-with-users-xamarin-android" title="Xamarin.Android">Xamarin.Android</a></div>
<div class="dev-onpage-video-clear clearfix">
<div class="dev-onpage-left-content">
<p>This topic shows you how to authenticate users in Azure Mobile Services from your app. In this tutorial, you add authentication to the quickstart project using an identity provider that is supported by Mobile Services. After being successfully authenticated and authorized by Mobile Services, the user ID value is displayed.</p>
<p>You can watch a video version of this tutorial by clicking the clip to the right.</p>
</div>
<div class="dev-onpage-video-wrapper"><a href="http://channel9.msdn.com/Series/Windows-Azure-Mobile-Services/Introduction-to-Windows-Azure-Mobile-Services" target="_blank" class="label">watch the tutorial</a> <a style="background-image: url('/media/devcenter/mobile/videos/get-started-with-users-windows-store-180x120.png') !important;" href="http://channel9.msdn.com/Series/Windows-Azure-Mobile-Services/Windows-Store-app-Getting-Started-with-Authentication-in-Windows-Azure-Mobile-Services" target="_blank" class="dev-onpage-video"><span class="icon">Play Video</span></a> <span class="time">10:04</span></div>
</div> 

This tutorial walks you through these basic steps to enable authentication in your app:

1. [Register your app for authentication and configure Mobile Services]
2. [Restrict table permissions to authenticated users]
3. [Add authentication to the app]

This tutorial is based on the Mobile Services quickstart. You must also first complete the tutorial [Get started with Mobile Services]. 

<div class="dev-callout"><b>Note</b>
	<p>This tutorial demonstrates the basic method provided by Mobile Services to authenticate users by using a variety of identity providers. This method is easy to configure and supports multiple providers. However, this method also requires users to log-in every time your app starts. To instead use Live Connect to provide a single sign-on experience in your Windows Store app, see the topic <a href="/en-us/develop/mobile/tutorials/single-sign-on-windows-8-dotnet">Single sign-on for Windows Store apps by using Live Connect</a>.</p>
</div>

<h2><a name="register"></a><span class="short-header">Register your app</span>Register your app for authentication and configure Mobile Services</h2>

To be able to authenticate users, you must register your app with an identity provider. You must then register the provider-generated client secret with Mobile Services.

1. Log on to the [Azure Management Portal], click **Mobile Services**, and then click your mobile service.

   	![][4]

2. Click the **Dashboard** tab and make a note of the **Mobile Service URL** value.

   	![][5]

    You may need to provide this value to the identity provider when you register your app.

3. Choose a supported identity provider from the list below and follow the steps to register your app with that provider:

 - <a href="/en-us/develop/mobile/how-to-guides/register-for-microsoft-authentication/" target="_blank">Microsoft Account</a>
 - <a href="/en-us/develop/mobile/how-to-guides/register-for-facebook-authentication/" target="_blank">Facebook login</a>
 - <a href="/en-us/develop/mobile/how-to-guides/register-for-twitter-authentication/" target="_blank">Twitter login</a>
 - <a href="/en-us/develop/mobile/how-to-guides/register-for-google-authentication/" target="_blank">Google login</a>
 - <a href="/en-us/documentation/articles/mobile-services-how-to-register-active-directory-authentication/" target="_blank">Azure Active Directory</a>


    Remember to make a note of the client identity and secret values generated by the provider.

    <div class="dev-callout"><b>Security Note</b>
	<p>The provider-generated secret is an important security credential. Do not share this secret with anyone or distribute it with your app.</p>
    </div>

4. Back in the Management Portal, click the **Identity** tab, enter the app identifier and shared secret values obtained from your identity provider, and click **Save**.

   	![][13]

5. (Optional) Complete the steps in [Register your Windows Store app package for Microsoft authentication].

    <div class="dev-callout"><b>Note</b>
	<p>This step is optional because it only applies to the Microsoft Account login provider. When you register your Windows Store app package information with Mobile Services, the client is able to re-use Microsoft Account login credentials for a single sign-on experience. If you do not do this, your Microsoft Account login users will be presented with a login prompt every time that the login method is called. Complete this step when you plan to use the Microsoft Account identity provider.</p>
    </div>

Both your mobile service and your app are now configured to work with your chosen authentication provider.

<h2><a name="permissions"></a><span class="short-header">Restrict permissions</span>Restrict permissions to authenticated users</h2>

1. In the Management Portal, click the **Data** tab, and then click the **TodoItem** table. 

   	![][14]

2. Click the **Permissions** tab, set all permissions to **Only authenticated users**, and then click **Save**. This will ensure that all operations against the **TodoItem** table require an authenticated user. This also simplifies the scripts in the next tutorial because they will not have to allow for the possibility of anonymous users.

   	![][15]

3. In Visual Studio 2012 Express for Windows 8, open the project that you created when you completed the tutorial [Get started with Mobile Services]. 

4. Press the F5 key to run this quickstart-based app; verify that an unhandled exception with a status code of 401 (Unauthorized) is raised after the app starts. 
   
   	This happens because the app attempts to access Mobile Services as an unauthenticated user, but the _TodoItem_ table now requires authentication.

Next, you will update the app to authenticate users before requesting resources from the mobile service.

<h2><a name="add-authentication"></a><span class="short-header">Add authentication</span>Add authentication to the app</h2>

5. Open the project file mainpage.xaml.cs and add the following using statement:

        using Windows.UI.Popups;

6. Add the following code snippet to the MainPage class:
	
        private MobileServiceUser user;
        private async System.Threading.Tasks.Task Authenticate()
        {
            while (user == null)
            {
                string message;
                try
                {
                    user = await App.MobileService
                        .LoginAsync(MobileServiceAuthenticationProvider.Facebook);
                    message = 
                        string.Format("You are now logged in - {0}", user.UserId);
                }
                catch (InvalidOperationException)
                {
                    message = "You must log in. Login Required";
                }
                        
                var dialog = new MessageDialog(message);
                dialog.Commands.Add(new UICommand("OK"));
                await dialog.ShowAsync();
            }
        }

    This creates a member variable for storing the current user and a method to handle the authentication process. The user is authenticated by using a Facebook login. If you are using an identity provider other than Facebook, change the value of **MobileServiceAuthenticationProvider** above to the value for your provider.

    <div class="dev-callout"><b>Note</b>
	<p>If you registered your Windows Store app package information with Mobile Services, you should call the <a href="http://go.microsoft.com/fwlink/p/?LinkId=311594" target="_blank">LoginAsync</a> method by supplying a value of <strong>true</strong> for the <em>useSingleSignOn</em> parameter. If you do not do this, your users will still be presented with a login prompt every time that the login method is called.</p>
    </div>

8. Replace the existing **OnNavigatedTo** method override with the following method that calls the new **Authenticate** method:

        protected override async void OnNavigatedTo(NavigationEventArgs e)
        {
            await Authenticate();
            RefreshTodoItems();
        }
		
9. Press the F5 key to run the app and sign into the app with your chosen identity provider. 

   	When you are successfully logged-in, the app should run without errors, and you should be able to query Mobile Services and make updates to data.

## <a name="next-steps"> </a>Next steps

In the next tutorial, [Authorize users with scripts], you will take the user ID value provided by Mobile Services based on an authenticated user and use it to filter the data returned by Mobile Services. Learn more about how to use Mobile Services with .NET in [Mobile Services .NET How-to Conceptual Reference]

<!-- Anchors. -->
[Register your app for authentication and configure Mobile Services]: #register
[Restrict table permissions to authenticated users]: #permissions
[Add authentication to the app]: #add-authentication
[Next Steps]:#next-steps

<!-- Images. -->




[4]: ./media/mobile-services-dotnet-get-started-users/mobile-services-selection.png
[5]: ./media/mobile-services-dotnet-get-started-users/mobile-service-uri.png







[13]: ./media/mobile-services-dotnet-get-started-users/mobile-identity-tab.png
[14]: ./media/mobile-services-dotnet-get-started-users/mobile-portal-data-tables.png
[15]: ./media/mobile-services-dotnet-get-started-users/mobile-portal-change-table-perms.png


<!-- URLs. -->
[Submit an app page]: http://go.microsoft.com/fwlink/p/?LinkID=266582
[My Applications]: http://go.microsoft.com/fwlink/p/?LinkId=262039
[Live SDK for Windows]: http://go.microsoft.com/fwlink/p/?LinkId=262253
[Single sign-on for Windows Store apps by using Live Connect]: ./mobile-services-single-sign-on-win8-dotnet.md
[Get started with Mobile Services]: /en-us/develop/mobile/tutorials/get-started
[Get started with data]: /en-us/develop/mobile/tutorials/get-started-with-data-dotnet
[Get started with authentication]: /en-us/develop/mobile/tutorials/get-started-with-users-dotnet
[Get started with push notifications]: /en-us/develop/mobile/tutorials/get-started-with-push-dotnet
[Authorize users with scripts]: /en-us/develop/mobile/tutorials/authorize-users-in-scripts-dotnet
[JavaScript and HTML]: /en-us/develop/mobile/tutorials/get-started-with-users-js

[Azure Management Portal]: https://manage.windowsazure.com/
[Mobile Services .NET How-to Conceptual Reference]: /en-us/develop/mobile/how-to-guides/work-with-net-client-library
[Register your Windows Store app package for Microsoft authentication]: /en-us/develop/mobile/how-to-guides/register-windows-store-app-package
