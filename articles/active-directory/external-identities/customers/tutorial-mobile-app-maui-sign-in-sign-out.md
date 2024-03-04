---
title: "Tutorial: Sign in users in .NET MAUI shell app"
description: This tutorial demonstrates how to add sign-in and sign-out code in .NET Multi-platform App UI (.NET MAUI) and how to run the app on the Android platform.
author: henrymbuguakiarie
manager: mwongerapk

ms.author: henrymbugua
ms.service: active-directory
ms.topic: tutorial
ms.subservice: ciam
ms.custom: devx-track-dotnet
ms.date: 06/05/2023
---

# Tutorial: Sign in users in .NET MAUI shell app

This tutorial demonstrates how to add sign-in and sign-out code in .NET Multi-platform App UI (.NET MAUI) and run the shell app on the Android platform.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Add sign-in and sign-out code.
> - Modify the app Shell.
> - Add platform-specific code.
> - Add app settings.
> - Run and test .NET MAUI shell app.

## Prerequisites

- [Tutorial: Create a .NET MAUI shell app, add MSALClient, and include an image resource](tutorial-mobile-app-maui-sign-in-prepare-app.md)
- [Tutorial: Register and configure .NET MAUI mobile app in a customer tenant](tutorial-mobile-app-maui-sign-in-prepare-tenant.md)

## Add sign-in and sign-out code

The user interface (UI) of a .NET MAUI app is constructed of objects that map to the native controls of each target platform. The main control groups used to create the UI of a .NET MAUI app are pages, layouts, and views.

### Add main view page

The next steps will organize our code so that the `main view` is defined.

1. Delete _MainPage.xaml_ and _MainPage.xaml.cs_ from your project, they're no longer needed. In the **Solution Explorer** pane, find the entry for **MainPage.xaml**, right-click it and select **Delete**.
1. Right-click on the **SignInMaui** project and select **Add** > **New Folder**. Name the folder **Views**.
1. Right-click on the **Views**.
1. Select **Add** > **New Item...**.
1. Select **.NET MAUI** in the template list.
1. Select the **.NET MAUI ContentPage (XAML)** template. Name the file **MainView.xaml**.
1. Select **Add**.
1. The _MainView.xaml_ file will open in a new document tab, displaying all of the XAML markup that represents the UI of the page. Replace the XAML markup with the following markup:

   :::code language="xaml" source="~/ms-identity-ciam-dotnet-tutorial/1-Authentication/2-sign-in-maui/Views/MainView.xaml" :::

1. Save the file.

   Let's break down the key parts of the XAML controls placed on the page:

   - `<ContentPage>` is the root object for the MainView class.
   - `<VerticalStackLayout>` is the child object of the ContentPage. This layout control arranges its children vertically, one after the other.
   - `<Image>` displays an image, in this case it's using the _azure_active_directory.png_ that you downloaded earlier.
   - `<Label>` controls display text.
   - `<Button>` can be pressed by the user, which raises the `Clicked` event. You can run code in response to the `Clicked` event.
   - `Clicked="OnSignInClicked"` the `Clicked` event of the button is assigned to the `OnSignInClicked` event handler, which will be defined in the code-behind file. You'll create this code in the next step.

#### Handle the OnSignInClicked event

The next step is to add the code for the button's `Clicked` event.

1. In the **Solution Explorer** pane of Visual Studio, expand the **MainView.xaml** file to reveal its code-behind file **MainView.xaml.cs**. Open the **MainView.xaml.cs** and replace the content of the file with following code:

   :::code language="csharp" source="~/ms-identity-ciam-dotnet-tutorial/1-Authentication/2-sign-in-maui/Views/MainView.xaml.cs" :::

   The `MainView` class is a content page responsible for displaying the main view of the app. In the constructor, it retrieves the cached user account using the `MSALClientHelper` from the `PublicClientSingleton` instance and enables the sign-in button, if no cached user account is found.

   When the sign-in button is clicked, it calls the `AcquireTokenSilentAsync` method to acquire a token silently and navigates to the `claimsview` page using the `Shell.Current.GoToAsync` method. Additionally, the `OnBackButtonPressed` method is overridden to return true, indicating that the back button is disabled for this view.

### Add claims view page

The next steps will organize the code so that `ClaimsView` page is defined. The page will display the user's claims found in the ID token.

1. In the **Solution Explorer** pane of Visual Studio, right-click on the **Views**.
1. Select **Add** > **New Item...**.
1. Select **.NET MAUI** in the template list.
1. Select the **.NET MAUI ContentPage (XAML)** template. Name the file **ClaimsView.xaml**.
1. Select **Add**.
1. The _ClaimsView.xaml_ file will open in a new document tab, displaying all of the XAML markup that represents the UI of the page. Replace the XAML markup with the following markup:

   :::code language="xaml" source="~/ms-identity-ciam-dotnet-tutorial/1-Authentication/2-sign-in-maui/Views/ClaimsView.xaml" :::

   This XAML markup code represents the UI layout for a claim view in a .NET MAUI app. It starts by defining the `ContentPage` with a title and disabling the back button behavior.

   Inside a `VerticalStackLayout`, there are several `Label` elements displaying static text, followed by a `ListView` named `Claims` that binds to a collection called `IdTokenClaims` to display the claims found in the ID token. Each claim is rendered within a `ViewCell` using a `DataTemplate` and displayed as a centered `Label` within a Grid.

   Lastly, there's a `Sign Out` button centered at the bottom of the layout, which triggers the `SignOutButton_Clicked` event handler when clicked.

#### Handle the ClaimsView data

The next step is to add the code to handle `ClaimsView` data.

1. In the **Solution Explorer** pane of Visual Studio, expand the **ClaimsView.xaml** file to reveal its code-behind file **ClaimsView.xaml.cs**. Open the **ClaimsView.xaml.cs** and replace the content of the file with following code:

   :::code language="csharp" source="~/ms-identity-ciam-dotnet-tutorial/1-Authentication/2-sign-in-maui/Views/ClaimsView.xaml.cs" :::

   The _ClaimsView.xaml.cs_ code represents the code-behind for a claim view in a .NET MAUI app. It starts by importing the necessary namespaces and defining the `ClaimsView` class, which extends `ContentPage`. The `IdTokenClaims` property is an enumerable of strings, initially set to a single string indicating no claims found.

   The `ClaimsView` constructor sets the binding context to the current instance, initializes the view components, and calls the `SetViewDataAsync` method asynchronously. The `SetViewDataAsync` method attempts to acquire a token silently, retrieves the claims from the authentication result, and sets the `IdTokenClaims` property to display them in the `ListView` named `Claims`. If a `MsalUiRequiredException` occurs, indicating that user interaction is needed for authentication, the app navigates to the claims view.

   The `OnBackButtonPressed` method overrides the back button behavior to always return true, preventing the user from going back from this view. The `SignOutButton_Clicked` event handler signs the user out using the `PublicClientSingleton` instance, and upon completion, navigates to the `main view`.

## Modify the app Shell

The `AppShell` class defines an app's visual hierarchy, the XAML markup used in creating the UI of the app. Update the `AppShell` to let it know about the `Views`.

1. Double-click the `AppShell.xaml` file in the **Solution Explorer** pane to open the XAML editor. Replace the XAML markup with the following code:

   :::code language="xaml" source="~/ms-identity-ciam-dotnet-tutorial/1-Authentication/2-sign-in-maui/AppShell.xaml" :::

   The XAML code defines an `AppShell` class that disables the flyout behavior and sets the main content to a `ShellContent` element with a title `Home` and a content template pointing to the `MainView` class.

1. In the **Solution Explorer** pane of Visual Studio, expand the **AppShell.xaml** file to reveal its code-behind file **AppShell.xaml.cs**. Open the **AppShell.xaml.cs** and replace the content of the file with following code:

   :::code language="csharp" source="~/ms-identity-ciam-dotnet-tutorial/1-Authentication/2-sign-in-maui/AppShell.xaml.cs" :::

   You update the `AppShell.xaml.cs` file to include the necessary route registrations for the `MainView` and `ClaimsView`. By calling the `InitializeComponent()` method, you ensure the initialization of the `AppShell` class. The `RegisterRoute()` method associate the `mainview` and `claimsview` routes with their respective view types, `MainView` and `ClaimsView`.

## Add platform-specific code

A .NET MAUI app project contains a Platforms folder, with each child folder representing a platform that .NET MAUI can target. To provide Android application-specific behavior to supplement the default application class, you follow these steps:

1. Double-click `Platforms/Android/AndroidManifest.xml` file in the **Solution Explorer** pane to open the xml editor. Update the following properties:

   - Set **Application name** to _MAUI CIAM_.
   - Set **Package name** to _SignInMaui.Droid_.
   - Set **Minimum Android version** to _Android 5.0 (API level 21)_.

1. Double-click `Platforms/Android/MainActivity.cs` file in the **Solution Explorer** pane to open the csharp editor. Replace the content of the file with following code:

   :::code language="csharp" source="~/ms-identity-ciam-dotnet-tutorial/1-Authentication/2-sign-in-maui/Platforms/Android/MainActivity.cs" :::

   Let's break down the key parts of the code you have added:

   - The necessary `using` statements are included at the top.
   - The `MainActivity` class is defined, inheriting from `MauiAppCompatActivity`, which is the base class for the Android platform in .NET MAUI.
   - The [Activity] attribute is applied to the `MainActivity` class, specifying various settings for the Android activity.
     - `Theme = "@style/Maui.SplashTheme"` sets the splash theme for the activity.
     - `MainLauncher = true` designates this activity as the main entry point of the application.
     - `ConfigurationChanges` specifies the configuration changes that the activity can handle, such as _screen size_, _orientation_, _UI mode_, _screen layout_, _smallest screen size_, and _density_.
   - `OnCreate` method is overridden to provide custom logic when the activity is being created.
     - `base.OnCreate(savedInstanceState)` calls the base implementation of the method.
     - `PlatformConfig.Instance.RedirectUri` is set to a dynamically generated value based on `PublicClientSingleton.Instance.MSALClientHelper.AzureAdConfig.ClientId`. It configures the redirect URI for the MSAL client.
     - `PlatformConfig.Instance.ParentWindow` is set to the current activity instance, which specifies the parent window for authentication-related operations.
     - `PublicClientSingleton.Instance.MSALClientHelper.InitializePublicClientAppAsync()` initializes the MSAL client app asynchronously using a helper method from a singleton instance called `MSALClientHelper`. The `Task.Run` is used to execute the initialization on a background thread, and `.Result` is used to synchronously wait for the task to complete.
   - `OnActivityResult` method is overridden to handle the result of an activity launched by the current activity.
     - `base.OnActivityResult(requestCode, resultCode, data)` calls the base implementation of the method.
     - `AuthenticationContinuationHelper.SetAuthenticationContinuationEventArgs(requestCode, resultCode, data)` sets the authentication continuation event arguments based on the received request code, result code, and intent data. This is used to continue the authentication flow after an external activity returns a result.

1. In the **Solution Explorer** pane of Visual Studio, select **Platforms**.
1. Right-click on the **Android** folder > **Add** > **New Item...**.
1. Select **C# Items** > **Class**. Name the file `MsalActivity.cs`.
1. Replace the content of `MsalActivity.cs` file with the following code:

   :::code language="csharp" source="~/ms-identity-ciam-dotnet-tutorial/1-Authentication/2-sign-in-maui/Platforms/Android/MsalActivity.cs" :::

   Let's break down the key parts of the code you have added:

   - `MsalActivity` class is declared within the `MauiAppBasic.Platforms.Android.Resources` namespace. The class inherits from the `BrowserTabActivity` class, indicating that it extends its functionality.
   - The class is decorated with the `[Activity(Exported = true)]` attribute, which signifies that the activity is exported and can be accessed by other methods.
   - An intent filter is specified using the "[IntentFilter(...)]" attribute. It configures the activity to intercept the `ActionView` intent.
   - The intent filter is set to handle the `ActionView` intent with the specified `DataScheme` (`msalEnter_the_Application_Id_Here`) and `DataHost` ("auth"). This configuration allows the activity to handle the authentication process by intercepting and processing the `ActionView` intent. Replace `Enter_the_Application_Id_Here` with the **Application (client) ID** of the app you registered earlier.

## Add app settings

Settings allow the separation of data that configures the behavior of an app from the code, allowing the behavior to be changed without rebuilding the app. The `MauiAppBuilder` provides `ConfigurationManager` to configure settings in our .NET MAUI app. Let's add the `appsettings.json` file as an `EmbeddedResource`.

To create `appsettings.json`, follow these steps:

1. In the **Solution Explorer** pane of Visual Studio, right-click on the **SignInMaui** project > **Add** > **New Item...**.
1. Select **Web** > **JavaScript JSON Configuration File**. Name the file `appsettings.json`.
1. Select **Add**.
1. Select **appsettings.json**
1. In the **Properties** pane, set **Build Action** to **Embedded resource**.
1. In the **Properties** pane, set **Copy to Output Directory** to **Copy always**.
1. Replace the content of `appsettings.json` file with the following code:

   :::code language="json" source="~/ms-identity-ciam-dotnet-tutorial/1-Authentication/2-sign-in-maui/appsettings.json" :::

1. In the `appsettings.json`, find the placeholder:

   1. `Enter_the_Tenant_Subdomain_Here` and replace it with the Directory (tenant) subdomain. For example, if your tenant primary domain is `contoso.onmicrosoft.com`, use `contoso`. If you don't have your tenant name, learn how to [read your tenant details](how-to-create-customer-tenant-portal.md#get-the-customer-tenant-details).
   1. `Enter_the_Application_Id_Here` and replace it with the Application (client) ID of the app you registered earlier.

## Run and test .NET MAUI mobile app

.NET MAUI apps are designed to run on multiple operating systems and devices. You'll need to select which target you want to test and debug your app with.

Set the **Debug Target** in the Visual Studio toolbar to the device you want to debug and test with. The following steps demonstrate setting the **Debug Target** to _Android_:

1. Select **Debug Target** drop-down.
1. Select **Android Emulators**.
1. Select emulator device.

Run the app by pressing _F5_ or select the _play button_ at the top of Visual Studio.

1. You can now test the sample .NET MAUI Android app. After you run the app, the Android app window appears in an emulator:

   :::image type="content" source="media/how-to-mobile-app-maui-sample-sign-in/maui-android-sign-in.jpg" alt-text="Screenshot of the sign-in button in the Android application.":::

1. On the Android window that appears, select the **Sign In** button. A browser window opens, and you're prompted to sign in.

   :::image type="content" source="media/how-to-mobile-app-maui-sample-sign-in/maui-android-sign-in-prompt.jpg" alt-text="Screenshot of user prompt to enter credential in Android application.":::

   During the sign in process, you're prompted to grant various permissions (to allow the application to access your data). Upon successful sign in and consent, the application screen displays the main page.

   :::image type="content" source="media/how-to-mobile-app-maui-sample-sign-in/maui-android-after-sign-in.png" alt-text="Screenshot of the main page in the Android application after signing in.":::

## Next Steps

- [Customize the default branding](how-to-customize-branding-customers.md).
- [Configure sign-in with Google](how-to-google-federation-customers.md).
