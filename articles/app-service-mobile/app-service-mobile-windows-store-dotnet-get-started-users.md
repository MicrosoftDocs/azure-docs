<properties
	pageTitle="Add authentication to your Universal Windows Platform (UWP) app | Azure Mobile Apps"
	description="Learn how to use Azure App Service Mobile Apps to authenticate users of your Universal Windows Platform (UWP) app using a variety of identity providers, including: AAD, Google, Facebook, Twitter, and Microsoft."
	services="app-service\mobile"
	documentationCenter="windows"
	authors="ggailey777"
	manager="erikre"
	editor=""/>

<tags
	ms.service="app-service-mobile"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-windows"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="05/14/2016"
	ms.author="glenga"/>

# Add authentication to your Windows app

[AZURE.INCLUDE [app-service-mobile-selector-get-started-users](../../includes/app-service-mobile-selector-get-started-users.md)]

This topic shows you how to add cloud-based authentication to your mobile app. In this tutorial, you add authentication to the Universal Windows Platform (UWP) quickstart project for Mobile Apps using an identity provider that is supported by Azure App Service. After being successfully authenticated and authorized by your Mobile App backend, the user ID value is displayed.

This tutorial is based on the Mobile Apps quickstart. You must first complete the tutorial [Get started with Mobile Apps](app-service-mobile-windows-store-dotnet-get-started.md).

##<a name="register"></a>Register your app for authentication and configure the App Service

[AZURE.INCLUDE [app-service-mobile-register-authentication](../../includes/app-service-mobile-register-authentication.md)]

##<a name="permissions"></a>Restrict permissions to authenticated users

[AZURE.INCLUDE [app-service-mobile-restrict-permissions-dotnet-backend](../../includes/app-service-mobile-restrict-permissions-dotnet-backend.md)]

Now, you can verify that anonymous access to your backend has been disabled. With the UWP app project set as the start-up project, deploy and run the app; verify that an unhandled exception with a status code of 401 (Unauthorized) is raised after the app starts. This happens because the app attempts to access your Mobile App Code as an unauthenticated user, but the *TodoItem* table now requires authentication.

Next, you will update the app to authenticate users before requesting resources from your App Service.

##<a name="add-authentication"></a>Add authentication to the app

1. In the UWP app project file MainPage.cs and add the following code snippet to the MainPage class:
	
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
                    .LoginAsync(MobileServiceAuthenticationProvider.Facebook);
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

3. Comment-out or delete the call to the **ButtonRefresh_Click** method (or the **InitLocalStoreAsync** method) in the existing **OnNavigatedTo** method override. This prevents the data from being loaded before the user is authenticated. Next, you will add a **Sign in** button to the app that triggers authentication.

4. Add the following code snippet to the MainPage class:

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
		
5. Open the MainPage.xaml project file, locate the element that defines the **Save** button and replace it with the following code:

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

9. Press the F5 key to run the app, click the **Sign in** button, and sign into the app with your chosen identity provider. After your sign-in is successful, the app runs without errors and you are able to query your backend and make updates to data.


##<a name="tokens"></a>Store the authentication token on the client

The previous example showed a standard sign-in, which requires the client to contact both the identity provider and the App Service every time that the app starts. Not only is this method inefficient, you can run into usage-relates issues should many customers try to start you app at the same time. A better approach is to cache the authorization token returned by your App Service and try to use this first before using a provider-based sign-in.

>[AZURE.NOTE]You can cache the token issued by App Services regardless of whether you are using client-managed or service-managed authentication. This tutorial uses service-managed authentication.

[AZURE.INCLUDE [mobile-windows-universal-dotnet-authenticate-app-with-token](../../includes/mobile-windows-universal-dotnet-authenticate-app-with-token.md)]

##Next steps

Now that you completed this basic authentication tutorial, consider continuing on to one of the following tutorials:

+ [Add push notifications to your app](app-service-mobile-windows-store-dotnet-get-started-push.md)  
  Learn how to add push notifications support to your app and configure your Mobile App backend to use Azure Notification Hubs to send push notifications.

+ [Enable offline sync for your app](app-service-mobile-windows-store-dotnet-get-started-offline-data.md)  
  Learn how to add offline support your app using an Mobile App backend. Offline sync allows end-users to interact with a mobile app&mdash;viewing, adding, or modifying data&mdash;even when there is no network connection.


<!-- URLs. -->
[Get started with your mobile app]: app-service-mobile-windows-store-dotnet-get-started.md

