<properties 
	pageTitle="Authenticate your app with Active Directory Authentication Library Single Sign-On (Xamarin.iOS) | Mobile Dev Center" 
	description="Learn how to authentication users for single sign-on with ADAL in your Xamarin.iOS application." 
	documentationCenter="xamarin" 
	authors="wesmc7777" 
	manager="dwrede" 
	editor="" 
	services=""/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-xamarin-ios" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="09/29/2014" 
	ms.author="wesmc,mahender"/>

# Authenticate your app with Active Directory Authentication Library Single Sign-On

[AZURE.INCLUDE [mobile-services-selector-adal-sso](../includes/mobile-services-selector-adal-sso.md)]

In this tutorial, you add authentication to the quickstart project using the Active Directory Authentication Library. 

To be able to authenticate users, you must register your application with the Azure Active Directory (AAD). This is done in two steps. First, you must register your mobile service and expose permissions on it. Second, you must register your Xamarin.iOS app and grant it access to those permissions


>[AZURE.NOTE] This tutorial is intended to help you better understand how Mobile Services enables you to do single sign-on Azure Active Directory authentication for Xamarin.iOS apps. If this is your first experience with Mobile Services, complete the tutorial [Get started with Mobile Services].

This tutorial walks you through these basic steps:

1. [Register your mobile service with the Azure Active Directory]
2. [Register your app with the Azure Active Directory] 
3. [Configure the mobile service to require authentication]
4. [Add authentication code to the client app]
5. [Test the client using authentication]

This tutorial requires the following:

* XCode 4.5 and iOS 6.0 (or later versions) 
* Visual Studio with the [Xamarin extension] or [Xamarin Studio] on OS X
* Completion of the [Get started with Mobile Services] or [Get Started with Data] tutorial.
* Microsoft Azure Mobile Services SDK
* A [Xamarin binding for the Active Directory Authentication Library for iOS].

[AZURE.INCLUDE [mobile-services-dotnet-adal-register-service](../includes/mobile-services-dotnet-adal-register-service.md)]

[AZURE.INCLUDE [mobile-services-dotnet-adal-register-client](../includes/mobile-services-dotnet-adal-register-client.md)]

## <a name="require-authentication"></a>Configure the mobile service to require authentication

[AZURE.INCLUDE [mobile-services-restrict-permissions-dotnet-backend](../includes/mobile-services-restrict-permissions-dotnet-backend.md)]

## <a name="add-authentication-code"></a>Add authentication code to the client app

1. Add your Xamarin binding for the Active Directory Authentication Library to your Xamarin.iOS project. In Visual Studio 2013, right click on **References** and select **Add Reference**. Then browse to your binding library and click **Add**. Be sure to also add the storyboards from the ADAL source.

2. Add the following to the QSTodoService class: 

        private MobileServiceUser user;
        public MobileServiceUser User { get { return user; } }

        public async Task Authenticate()
        {
            var aadAuthority = @"<INSERT-AUTHORITY-HERE>";
            var aadResource = @"<INSERT-RESOURCE-URI-HERE>";
            var aadClientId = @"<INSERT-CLIENT-ID-HERE>";
            var aadRedirect = @"<INSERT-REDIRECT-URI-HERE>";

            ADAuthenticationError error;
            var aadContext = ADAuthenticationContext.AuthenticationContextWithAuthority(aadAuthority, out error);
            if (error != null)
            {
                throw new InvalidOperationException("Error creating the AAD context: " + error.ErrorDetails);
            }

            var tcs = new TaskCompletionSource<string>();
            aadContext.AcquireTokenWithResource(aadResource, aadClientId, new NSUrl(aadRedirect), result =>
                {
                    if (result.Status == ADAuthenticationResultStatus.SUCCEEDED)
                    {
                        tcs.SetResult(result.AccessToken);
                    }
                    else
                    {
                        string errorDetails;
                        if (result.Status == ADAuthenticationResultStatus.USER_CANCELLED)
                        {
                            errorDetails = "Authentication cancelled by user";
                        }
                        else
                        {
                            errorDetails = result.Error.ErrorDetails;
                        }

                        tcs.SetException(new InvalidOperationException("Error during authentication: " + errorDetails));
                    }
                });
            string accessToken = await tcs.Task;

            var token = new JObject(new JProperty("access_token", accessToken));

            try
            {
                user = await this.client.LoginAsync(MobileServiceAuthenticationProvider.WindowsAzureActiveDirectory, token);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine (@"ERROR - AUTHENTICATION FAILED {0}", ex.Message);
            }
        }

6. In the code for the `AuthenticateAsync` method above, replace **INSERT-AUTHORITY-HERE** with the name of the tenant in which you provisioned your application, the format should be https://login.windows.net/tenant-name.onmicrosoft.com. This value can be copied out of the Domain tab in your Azure Active Directory in the [Azure Management Portal].

7. In the code for the `AuthenticateAsync` method above, replace **INSERT-RESOURCE-URI-HERE** with the **App ID URI** for your mobile service. If you followed the [How to Register with the Azure Active Directory] topic your App ID URI should be similar to https://todolist.azure-mobile.net/login/aad.

8. In the code for the `AuthenticateAsync` method above, replace **INSERT-CLIENT-ID-HERE** with the client ID you copied from the native client application.

9. In the code for the `AuthenticateAsync` method above, replace **INSERT-REDIRECT-URI-HERE** with the /login/done endpoint for your mobile service. This should be similar to https://todolist.azure-mobile.net/login/done.


3. In the QSTodoListViewController, modify **ViewDidLoad** by adding the following code just before the call to RefreshAsync();

        if (QSTodoService.DefaultService.User == null)
        {
            await QSTodoService.DefaultService.Authenticate();
        }

## <a name="test-client"></a>Test the client using authentication

1. From the Run menu, click Run to start the app 
2. You will receive a prompt to login against your Azure Active Directory.  
3. The app authenticates and returns the todo items.

   ![](./media/mobile-services-dotnet-backend-xamarin-ios-adal-sso-authentication/mobile-services-app-run.png)

<!-- Anchors. -->
[Register your mobile service with the Azure Active Directory]: #register-mobile-service-aad
[Register your app with the Azure Active Directory]: #register-app-aad
[Configure the mobile service to require authentication]: #require-authentication
[Add authentication code to the client app]: #add-authentication-code
[Test the client using authentication]: #test-client

<!-- URLs. -->
[Get started with data]: /en-us/documentation/articles/partner-xamarin-mobile-services-ios-get-started-data/
[Get started with Mobile Services]: /en-us/documentation/articles/mobile-services-dotnet-backend-xamarin-ios-get-started/
[How to Register with the Azure Active Directory]: /en-us/documentation/articles/mobile-services-how-to-register-active-directory-authentication/
[Azure Management Portal]: https://manage.windowsazure.com/
[Xamarin binding for the Active Directory Authentication Library for iOS]: https://github.com/AzureADSamples/NativeClient-Xamarin-iOS
[Xamarin extension]: http://xamarin.com/visual-studio
[Xamarin Studio]: http://xamarin.com/download