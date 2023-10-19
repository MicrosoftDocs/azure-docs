---
title: Use brokers with Xamarin iOS & Android
description: Learn how to setup Xamarin iOS applications that can use the Microsoft Authenticator and the Microsoft Authentication Library for .NET (MSAL.NET). Also learn how to migrate from Azure AD Authentication Library for .NET (ADAL.NET) to the Microsoft Authentication Library for .NET (MSAL.NET).
author: Dickson-Mwendia
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: how-to
ms.workload: identity
ms.date: 09/08/2019
ms.author: dmwendia
ms.reviewer: jmprieur, saeeda
ms.custom: devx-track-csharp, aaddev, has-adal-ref, devx-track-dotnet
#Customer intent: As an application developer, I want to learn how to use brokers with my Xamarin iOS or Android application and MSAL.NET.
---

# Use Microsoft Authenticator or Intune Company Portal on Xamarin applications

On Android and iOS, brokers like Microsoft Authenticator and the Android-specific Microsoft Intune Company Portal enable:

- **Single sign-on (SSO)**: Users don't need to sign in to each application.
- **Device identification**: The broker accesses the device certificate. This certificate is created on the device when it's joined to the workplace.
- **Application identification verification**: When an application calls the broker, it passes its redirect URL. The broker verifies the URL.

To enable one of these features, use the `WithBroker()` parameter when you call the `PublicClientApplicationBuilder.CreateApplication` method. The `.WithBroker()` parameter is set to true by default.

The setup of brokered authentication in the Microsoft Authentication Library for .NET (MSAL.NET) varies by platform:

* [iOS applications](#brokered-authentication-for-ios)
* [Android applications](#brokered-authentication-for-android)

## Brokered authentication for iOS

Use the following steps to enable your Xamarin.iOS app to communicate with the [Microsoft Authenticator](https://itunes.apple.com/us/app/microsoft-authenticator/id983156458) app. If you're targeting iOS 13, consider reading about [Apple's breaking API change](./msal-net-xamarin-ios-considerations.md).

### Step 1: Enable broker support

You must enable broker support for individual instances of `PublicClientApplication`. Support is disabled by default. When you create `PublicClientApplication` through `PublicClientApplicationBuilder`, use the `WithBroker()` parameter as the following example shows. The `WithBroker()` parameter is set to true by default.

```csharp
var app = PublicClientApplicationBuilder
                .Create(ClientId)
                .WithBroker()
                .WithReplyUri(redirectUriOnIos) // $"msauth.{Bundle.Id}://auth" (see step 6 below)
                .Build();
```

### Step 2: Enable keychain access

To enable keychain access, you must have a keychain access group for your application. You can use the `WithIosKeychainSecurityGroup()` API to set your keychain access group when you create your application:

```csharp
var builder = PublicClientApplicationBuilder
     .Create(ClientId)
     .WithIosKeychainSecurityGroup("com.microsoft.adalcache")
     .Build();
```

For more information, see [Enable keychain access](msal-net-xamarin-ios-considerations.md#enable-keychain-access).

### Step 3: Update AppDelegate to handle the callback

When MSAL.NET calls the broker, the broker calls back to your application through the `OpenUrl` method of the `AppDelegate` class. Because MSAL waits for the broker's response, your application needs to cooperate to call MSAL.NET back. To enable this cooperation, update the *AppDelegate.cs* file to override the following method.

```csharp
public override bool OpenUrl(UIApplication app, NSUrl url,
                             string sourceApplication,
                             NSObject annotation)
{
    if (AuthenticationContinuationHelper.IsBrokerResponse(sourceApplication))
    {
      AuthenticationContinuationHelper.SetBrokerContinuationEventArgs(url);
      return true;
    }

    else if (!AuthenticationContinuationHelper.SetAuthenticationContinuationEventArgs(url))
    {
         return false;
    }

    return true;
}
```

This method is invoked every time the application is started. It's used as an opportunity to process the response from the broker and complete the authentication process that MSAL.NET started.

### Step 4: Set UIViewController()

Still in the *AppDelegate.cs* file, set an object window. You don't typically need to set the object window for Xamarin iOS, but you do need an object window to send and receive responses from the broker.

To set up the object window:

1. In the *AppDelegate.cs* file, set `App.RootViewController` to a new `UIViewController()`. This assignment ensures that the call to the broker includes `UIViewController`. If this setting is assigned incorrectly, you might get this error:

      `"uiviewcontroller_required_for_ios_broker":"UIViewController is null, so MSAL.NET cannot invoke the iOS broker. See https://aka.ms/msal-net-ios-broker"`

1. On the `AcquireTokenInteractive` call, use `.WithParentActivityOrWindow(App.RootViewController)` and then pass in the reference to the object window you'll use.

    In *App.cs*:

    ```csharp
       public static object RootViewController { get; set; }
    ```

    In *AppDelegate.cs*:

    ```csharp
       LoadApplication(new App());
       App.RootViewController = new UIViewController();
    ```

    In the `AcquireToken` call:

    ```csharp
    result = await app.AcquireTokenInteractive(scopes)
                 .WithParentActivityOrWindow(App.RootViewController)
                 .ExecuteAsync();
    ```

### Step 5: Register a URL scheme

MSAL.NET uses URLs to invoke the broker and then return the broker response to your app. To complete the round trip, register a URL scheme for your app in the *Info.plist* file.

The `CFBundleURLSchemes` name must include `msauth.` as a prefix. Follow the prefix with `CFBundleURLName`.

In the URL scheme, `BundleId` uniquely identifies the app: `$"msauth.(BundleId)"`. So if `BundleId` is `com.yourcompany.xforms`, then the URL scheme is `msauth.com.yourcompany.xforms`.

> [!NOTE]
> This URL scheme becomes part of the redirect URI that uniquely identifies your app when it receives the response from the broker.

```xml
 <key>CFBundleURLTypes</key>
    <array>
      <dict>
        <key>CFBundleTypeRole</key>
        <string>Editor</string>
        <key>CFBundleURLName</key>
        <string>com.yourcompany.xforms</string>
        <key>CFBundleURLSchemes</key>
        <array>
          <string>msauth.com.yourcompany.xforms</string>
        </array>
      </dict>
    </array>
```

### Step 6: Add the broker identifier to the LSApplicationQueriesSchemes section

MSAL uses `–canOpenURL:` to check whether the broker is installed on the device. In iOS 9, Apple locked down the schemes that an application can query for.

Add `msauthv2` to the `LSApplicationQueriesSchemes` section of the *Info.plist* file, as in the following example:

```xml
<key>LSApplicationQueriesSchemes</key>
    <array>
      <string>msauthv2</string>
      <string>msauthv3</string>
    </array>
```

### Step 7: Add a redirect URI to your app registration

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

When you use the broker, your redirect URI has an extra requirement. The redirect URI _must_ have the following format:

```csharp
$"msauth.{BundleId}://auth"
```

Here's an example:

```csharp
public static string redirectUriOnIos = "msauth.com.yourcompany.XForms://auth";
```

Notice that the redirect URI matches the `CFBundleURLSchemes` name that you included in the *Info.plist* file.

Add the redirect URI to the app's registration. To generate a properly formatted redirect URI, use **App registrations** to generate the brokered redirect URI from the bundle ID.

**To generate the redirect URI:**

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least an [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **App registrations**.
1. Search for and select the application.
1. Select **Authentication** > **Add a platform** > **iOS / macOS**
1. Enter your bundle ID, and then select **Configure**.

    Copy the generated redirect URI that appears in the **Redirect URI** text box for inclusion in your code:

    :::image type="content" source="media/msal-net-use-brokers-with-xamarin-apps/portal-01-ios-platform-settings.png" alt-text="iOS platform settings with generated redirect URI":::
1. Select **Done** to complete generation of the redirect URI.

## Brokered authentication for Android

### Step 1: Enable broker support

Broker support is enabled on a per-`PublicClientApplication` basis. It's disabled by default. Use the `WithBroker()` parameter (set to true by default) when creating the `IPublicClientApplication` through the `PublicClientApplicationBuilder`.

```csharp
var app = PublicClientApplicationBuilder
                .Create(ClientId)
                .WithBroker()
                .WithRedirectUri(redirectUriOnAndroid) // See step #4
                .Build();
```

### Step 2: Update AppDelegate to handle the callback

When MSAL.NET calls the broker, the broker will, in turn, call back to your application with the `OnActivityResult()` method. Since MSAL will wait for the response from the broker, your application needs to route the result to MSAL.NET.

Route the result to the `SetAuthenticationContinuationEventArgs(int requestCode, Result resultCode, Intent data)` method by overriding the `OnActivityResult()` method as shown here:

```csharp
protected override void OnActivityResult(int requestCode, Result resultCode, Intent data)
{
   base.OnActivityResult(requestCode, resultCode, data);
   AuthenticationContinuationHelper.SetAuthenticationContinuationEventArgs(requestCode, resultCode, data);
}
```

This method is invoked every time the broker application is launched, and is used as an opportunity to process the response from the broker and complete the authentication process started by MSAL.NET.

### Step 3: Set an Activity

To enable brokered authentication, set an activity so that MSAL can send and receive the response to and from the broker. To do so, provide the activity (usually the `MainActivity`) to `WithParentActivityOrWindow(object parent)` the parent object.

For example, in the call to `AcquireTokenInteractive()`:

```csharp
result = await app.AcquireTokenInteractive(scopes)
             .WithParentActivityOrWindow((Activity)context))
             .ExecuteAsync();
```

### Step 4: Add a redirect URI to your app registration

MSAL uses URLs to invoke the broker and then return to your app. To complete that round trip, register a **Redirect URI** for your app.

The format of the redirect URI for your application depends on the certificate used to sign the APK. For example:

```
msauth://com.microsoft.xforms.testApp/hgbUYHVBYUTvuvT&Y6tr554365466=
```

The last part of the URI, `hgbUYHVBYUTvuvT&Y6tr554365466=`, is the Base64-encoded version of the signature that the APK is signed with. While developing your app in Visual Studio, if you're debugging your code without signing the APK with a specific certificate, Visual Studio signs the APK for you for debugging purposes. When Visual Studio signs the APK for you in this way, it gives it a unique signature for the machine it's built on. Thus, each time you build your app on a different machine, you'll need to update the redirect URI in the application's code and the application's registration in order to authenticate with MSAL.

While debugging, you may encounter an MSAL exception (or log message) stating the redirect URI provided is incorrect. **The exception or log message also indicates the redirect URI you should be using** with the current machine you're debugging on. You can use the provided redirect URI to continue developing your app as long as you update redirect URI in code and add the provided redirect URI to the app's registration.

Once you're ready to finalize your code, update the redirect URI in the code and the application's registration to use the signature of the certificate you sign the APK with.

In practice, this means you should consider adding a redirect URI for each member of your development team, *plus* a redirect URI for the production signed version of the APK.

You can compute the signature yourself, similar to how MSAL does it:

```csharp
   private string GetRedirectUriForBroker()
   {
      string packageName = Application.Context.PackageName;
      string signatureDigest = this.GetCurrentSignatureForPackage(packageName);
      if (!string.IsNullOrEmpty(signatureDigest))
      {
            return string.Format(CultureInfo.InvariantCulture, "{0}://{1}/{2}", RedirectUriScheme,
               packageName.ToLowerInvariant(), signatureDigest);
      }

      return string.Empty;
   }

   private string GetCurrentSignatureForPackage(string packageName)
   {
            PackageInfo info = Application.Context.PackageManager.GetPackageInfo(packageName,
               PackageInfoFlags.Signatures);
            if (info != null && info.Signatures != null && info.Signatures.Count > 0)
            {
               // First available signature. Applications can be signed with multiple signatures.
               // The order of Signatures is not guaranteed.
               Signature signature = info.Signatures[0];
               MessageDigest md = MessageDigest.GetInstance("SHA");
               md.Update(signature.ToByteArray());
               return Convert.ToBase64String(md.Digest(), Base64FormattingOptions.None);
               // Server side needs to register all other tags. ADAL will
               // send one of them.
            }
   }
```

You also have the option of acquiring the signature for your package by using **keytool** with the following commands:

* Windows:
    ```console
    keytool.exe -list -v -keystore "%LocalAppData%\Xamarin\Mono for Android\debug.keystore" -alias androiddebugkey -storepass android -keypass android
    ````
* macOS:
    ```console
    keytool -exportcert -alias androiddebugkey -keystore ~/.android/debug.keystore | openssl sha1 -binary | openssl base64
    ````

### Step 5 (optional): Fall back to the system browser

If MSAL is configured to use the broker but the broker is not installed, MSAL will fall back to using a web view (a browser). MSAL will try to authenticate using the default system browser on the device, which fails because the redirect URI is configured for the broker and the system browser doesn't know how to use it to navigate back to MSAL. To avoid the failure, you can configure an *intent filter* with the broker redirect URI you used in step 4.

Modify your application's manifest to add the intent filter:

```xml
<!-- NOTE the SLASH (required) that prefixes the signature value in the path attribute.
     The signature value is the Base64-encoded signature discussed above. -->
<intent-filter>
      <data android:scheme="msauth"
                    android:host="Package Name"
                    android:path="/Package Signature"/>
```

For example, if you have a redirect URI of `msauth://com.microsoft.xforms.testApp/hgbUYHVBYUTvuvT&Y6tr554365466=`, your manifest should look like the following XML snippet.

The forward-slash (`/`) in front of the signature in the `android:path` value is **required**.

```xml
<!-- NOTE the SLASH (required) that prefixes the signature value in the path attribute.
     The signature value is the Base64-encoded signature discussed above. -->
<intent-filter>
      <data android:scheme="msauth"
                    android:host="com.microsoft.xforms.testApp"
                    android:path="/hgbUYHVBYUTvuvT&Y6tr554365466="/>
```

For more information about configuring your application for system browser and Android 11 support, see [Update the Android manifest for system browser support](msal-net-xamarin-android-considerations.md#update-the-android-manifest-for-system-webview-support).

As an alternative, you can configure MSAL to fall back to the embedded browser, which doesn't rely on a redirect URI:

```csharp
.WithUseEmbeddedWebUi(true)
```

## Troubleshooting tips for Android brokered authentication

Here are a few tips on avoiding issues when you implement brokered authentication on Android:

- **Redirect URI** - Add a redirect URI to your application registration. A missing or incorrect redirect URI is a common issue encountered by developers.
- **Broker version** - Install the minimum required version of the broker apps. Either of these two apps can be used for brokered authentication on Android.
  - [Intune Company Portal](https://play.google.com/store/apps/details?id=com.microsoft.windowsintune.companyportal) (version 5.0.4689.0 or greater)
  - [Microsoft Authenticator](https://play.google.com/store/apps/details?id=com.azure.authenticator) (version 6.2001.0140 or greater).
- **Broker precedence** - MSAL communicates with the *first broker installed* on the device when multiple brokers are installed.

    Example: If you first install Microsoft Authenticator and then install Intune Company Portal, brokered authentication will *only* happen on the Microsoft Authenticator.
- **Logs** - If you encounter an issue with brokered authentication, viewing the broker's logs might help you diagnose the cause.
  - Get Microsoft Authenticator logs:

    1. Select the menu button in the top-right corner of the app.
    1. Select **Send Feedback** > **Having Trouble?**.
    1. Under **What are you trying to do?**, select an option and add a description.
    1. To send the logs, select the arrow in the top-right corner of the app.

    After you send the logs, a dialog box displays the incident ID. Record the incident ID, and include it when you request assistance.

  - Get Intune Company Portal logs:

    1. Select the menu button on the top-left corner of the app.
    1. Select **Help** > **Email Support**.
    1. To send the logs, select **Upload Logs Only**.

    After you send the logs, a dialog box displays the incident ID. Record the incident ID, and include it when you request assistance.

## Next steps

Learn about [Considerations for using Universal Windows Platform with MSAL.NET](/entra/msal/dotnet/acquiring-tokens/desktop-mobile/uwp).
