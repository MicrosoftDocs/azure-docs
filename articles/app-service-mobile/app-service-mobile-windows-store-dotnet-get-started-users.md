---
title: Add authentication to your Universal Windows Platform (UWP) app | Microsoft Docs
description: 'Learn how to use Azure App Service Mobile Apps to authenticate users of your Universal Windows Platform (UWP) app using a variety of identity providers, including: AAD, Google, Facebook, Twitter, and Microsoft.'
services: app-service\mobile
documentationcenter: windows
author: elamalani
manager: panarasi
editor: ''

ms.assetid: 6cffd951-893e-4ce5-97ac-86e3f5ad9466
ms.service: app-service-mobile
ms.workload: mobile
ms.tgt_pltfrm: mobile-windows
ms.devlang: dotnet
ms.topic: article
ms.date: 06/25/2019
ms.author: emalani
---
# Add authentication to your Windows app
[!INCLUDE [app-service-mobile-selector-get-started-users](../../includes/app-service-mobile-selector-get-started-users.md)]

> [!NOTE]
> Visual Studio App Center is investing in new and integrated services central to mobile app development. Developers can use **Build**, **Test** and **Distribute** services to set up Continuous Integration and Delivery pipeline. Once the app is deployed, developers can monitor the status and usage of their app using the **Analytics** and **Diagnostics** services, and engage with users using the **Push** service. Developers can also leverage **Auth** to authenticate their users and **Data** service to persist and sync app data in the cloud. Check out [App Center](https://appcenter.ms/?utm_source=zumo&utm_campaign=app-service-mobile-windows-store-dotnet-get-started-users) today.
>

## Overview
This topic shows you how to add cloud-based authentication to your mobile app. In this tutorial, you add authentication to the Universal Windows Platform (UWP) quickstart project for Mobile Apps using an identity provider that is supported by Azure App Service. After being successfully authenticated and authorized by your Mobile App backend, the user ID value is displayed.

This tutorial is based on the Mobile Apps quickstart. You must first complete the tutorial [Get started with Mobile Apps](app-service-mobile-windows-store-dotnet-get-started.md).

## <a name="register"></a>Register your app for authentication and configure the App Service
[!INCLUDE [app-service-mobile-register-authentication](../../includes/app-service-mobile-register-authentication.md)]

## <a name="redirecturl"></a>Add your app to the Allowed External Redirect URLs

Secure authentication requires that you define a new URL scheme for your app. This allows the authentication system to redirect back to your app once the authentication process is complete. In this tutorial, we use the URL scheme _appname_ throughout. However, you can use any URL scheme you choose. It should be unique to your mobile application. To enable the redirection on the server side:

1. In the [Azure portal](https://ms.portal.azure.com), select your App Service.

2. Click the **Authentication / Authorization** menu option.

3. In the **Allowed External Redirect URLs**, enter `url_scheme_of_your_app://easyauth.callback`.  The **url_scheme_of_your_app** in this string is the URL Scheme for your mobile application.  It should follow normal URL specification for a protocol (use letters and numbers only, and start with a letter).  You should make a note of the string that you choose as you will need to adjust your mobile application code with the URL Scheme in several places.

4. Click **Save**.

## <a name="permissions"></a>Restrict permissions to authenticated users
[!INCLUDE [app-service-mobile-restrict-permissions-dotnet-backend](../../includes/app-service-mobile-restrict-permissions-dotnet-backend.md)]

Now, you can verify that anonymous access to your backend has been disabled. With the UWP app project set as the start-up project, deploy and run the app; verify that an unhandled exception with a status code of 401 (Unauthorized) is raised after the app starts. This happens because the app attempts to access your Mobile App Code as an unauthenticated user, but the *TodoItem* table now requires authentication.

Next, you will update the app to authenticate users before requesting resources from your App Service.

## <a name="add-authentication"></a>Add authentication to the app
1. In the UWP app project file MainPage.xaml.cs and add the following code snippet:
   
        // Define a member variable for storing the signed-in user. 
        private MobileServiceUser user;
   
        // Define a method that performs the authentication process
        // using a Facebook sign-in. 
        private async System.Threading.Tasks.Task<bool> AuthenticateAsync()
        {
            string message;
            bool success = false;
            try
            {
                // Change 'MobileService' to the name of your MobileServiceClient instance.
                // Sign-in using Facebook authentication.
                user = await App.MobileService
                    .LoginAsync(MobileServiceAuthenticationProvider.Facebook, "{url_scheme_of_your_app}");
                message =
                    string.Format("You are now signed in - {0}", user.UserId);
   
                success = true;
            }
            catch (InvalidOperationException)
            {
                message = "You must log in. Login Required";
            }
   
            var dialog = new MessageDialog(message);
            dialog.Commands.Add(new UICommand("OK"));
            await dialog.ShowAsync();
            return success;
        }
   
    This code authenticates the user with a Facebook login. If you are using an identity provider other than Facebook, change the value of **MobileServiceAuthenticationProvider** above to the value for your provider.
2. Replace the **OnNavigatedTo()** method in MainPage.xaml.cs. Next, you will add a **Sign in** button to the app that triggers authentication.

        protected override async void OnNavigatedTo(NavigationEventArgs e)
        {
            if (e.Parameter is Uri)
            {
                App.MobileService.ResumeWithURL(e.Parameter as Uri);
            }
        }

3. Add the following code snippet to the MainPage.xaml.cs:
   
        private async void ButtonLogin_Click(object sender, RoutedEventArgs e)
        {
            // Login the user and then load data from the mobile app.
            if (await AuthenticateAsync())
            {
                // Switch the buttons and load items from the mobile app.
                ButtonLogin.Visibility = Visibility.Collapsed;
                ButtonSave.Visibility = Visibility.Visible;
                //await InitLocalStoreAsync(); //offline sync support.
                await RefreshTodoItems();
            }
        }
4. Open the MainPage.xaml project file, locate the element that defines the **Save** button and replace it with the following code:
   
        <Button Name="ButtonSave" Visibility="Collapsed" Margin="0,8,8,0" 
                Click="ButtonSave_Click">
            <StackPanel Orientation="Horizontal">
                <SymbolIcon Symbol="Add"/>
                <TextBlock Margin="5">Save</TextBlock>
            </StackPanel>
        </Button>
        <Button Name="ButtonLogin" Visibility="Visible" Margin="0,8,8,0" 
                Click="ButtonLogin_Click" TabIndex="0">
            <StackPanel Orientation="Horizontal">
                <SymbolIcon Symbol="Permissions"/>
                <TextBlock Margin="5">Sign in</TextBlock> 
            </StackPanel>
        </Button>
5. Add the following code snippet to the App.xaml.cs:

        protected override void OnActivated(IActivatedEventArgs args)
        {
            if (args.Kind == ActivationKind.Protocol)
            {
                ProtocolActivatedEventArgs protocolArgs = args as ProtocolActivatedEventArgs;
                Frame content = Window.Current.Content as Frame;
                if (content.Content.GetType() == typeof(MainPage))
                {
                    content.Navigate(typeof(MainPage), protocolArgs.Uri);
                }
            }
            Window.Current.Activate();
            base.OnActivated(args);
        }
6. Open Package.appxmanifest file, navigate to **Declarations**, in **Available Declarations** dropdown list, select **Protocol** and click **Add** button. Now configure the **Properties** of the **Protocol** declaration. In **Display name**, add the name you wish to display to users of your application. In **Name**, add your {url_scheme_of_your_app}.
7. Press the F5 key to run the app, click the **Sign in** button, and sign into the app with your chosen identity provider. After your sign-in is successful, the app runs without errors and you are able to query your backend and make updates to data.

## <a name="tokens"></a>Store the authentication token on the client
The previous example showed a standard sign-in, which requires the client to contact both the identity provider and the App Service every time that the app starts. Not only is this method inefficient, you can run into usage-relates issues should many customers try to start you app at the same time. A better approach is to cache the authorization token returned by your App Service and try to use this first before using a provider-based sign-in.

> [!NOTE]
> You can cache the token issued by App Services regardless of whether you are using client-managed or service-managed authentication. This tutorial uses service-managed authentication.
> 
> 

[!INCLUDE [mobile-windows-universal-dotnet-authenticate-app-with-token](../../includes/mobile-windows-universal-dotnet-authenticate-app-with-token.md)]

## Next steps
Now that you completed this basic authentication tutorial, consider continuing on to one of the following tutorials:

* [Add push notifications to your app](app-service-mobile-windows-store-dotnet-get-started-push.md)  
  Learn how to add push notifications support to your app and configure your Mobile App backend to use Azure Notification Hubs to send push notifications.
* [Enable offline sync for your app](app-service-mobile-windows-store-dotnet-get-started-offline-data.md)  
  Learn how to add offline support your app using an Mobile App backend. Offline sync allows end-users to interact with a mobile app&mdash;viewing, adding, or modifying data&mdash;even when there is no network connection.

<!-- URLs. -->
[Get started with your mobile app]: app-service-mobile-windows-store-dotnet-get-started.md
