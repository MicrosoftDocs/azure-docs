---
title: Xamarin Android code configuration and troubleshooting (MSAL.NET) | Azure
titleSuffix: Microsoft identity platform
description: Learn about considerations for using Xamarin Android with Microsoft Authentication Library for .NET (MSAL.NET).
services: active-directory
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 08/28/2020
ms.author: marsma
ms.reviewer: saeeda
ms.custom: "devx-track-csharp, aaddev"
#Customer intent: As an application developer, I want to learn about special requirements for using Xamarin Android and MSAL.NET.
---

# Configuration requirements and troubleshooting tips for Xamarin Android with MSAL.NET

There are several configuration changes you're required to make in your code when using Xamarin Android with Microsoft Authentication Library for .NET (MSAL.NET). The following sections describe the required modifications, followed by a [Troubleshooting](#troubleshooting) section to help you avoid some of the most common issues.

## Set the parent activity

On Xamarin Android, set the parent activity so the token returns after the interaction:

```csharp
var authResult = AcquireTokenInteractive(scopes)
 .WithParentActivityOrWindow(parentActivity)
 .ExecuteAsync();
```

In MSAL.NET 4.2 and later, you can also set this functionality at the level of [PublicClientApplication][PublicClientApplication]. To do so, use a callback:

```csharp
// Requires MSAL.NET 4.2 or later
var pca = PublicClientApplicationBuilder
  .Create("<your-client-id-here>")
  .WithParentActivityOrWindow(() => parentActivity)
  .Build();
```

If you use [CurrentActivityPlugin](https://github.com/jamesmontemagno/CurrentActivityPlugin), then your [`PublicClientApplication`][PublicClientApplication] builder code should look similar to this code snippet:

```csharp
// Requires MSAL.NET 4.2 or later
var pca = PublicClientApplicationBuilder
  .Create("<your-client-id-here>")
  .WithParentActivityOrWindow(() => CrossCurrentActivity.Current)
  .Build();
```

## Ensure that control returns to MSAL

When the interactive portion of the authentication flow ends, return control to MSAL by overriding the [`Activity`][Activity].[`OnActivityResult()`][OnActivityResult] method.

In your override, call MSAL.NET's `AuthenticationContinuationHelper`.`SetAuthenticationContinuationEventArgs()` method to return control to MSAL at the end of the interactive portion of the authentication flow.

```csharp
protected override void OnActivityResult(int requestCode,
                                         Result resultCode,
                                         Intent data)
{
    base.OnActivityResult(requestCode, resultCode, data);

    // Return control to MSAL
    AuthenticationContinuationHelper.SetAuthenticationContinuationEventArgs(requestCode,
                                                                            resultCode,
                                                                            data);
}
```

## Update the Android manifest

The *AndroidManifest.xml* file should contain the following values:

```XML
  <!--Intent filter to capture System Browser or Authenticator calling back to our app after sign-in-->
  <activity
        android:name="microsoft.identity.client.BrowserTabActivity">
     <intent-filter>
            <action android:name="android.intent.action.VIEW" />
            <category android:name="android.intent.category.DEFAULT" />
            <category android:name="android.intent.category.BROWSABLE" />
            <data android:scheme="msauth"
                android:host="Enter_the_Package_Name"
                android:path="/Enter_the_Signature_Hash" />
     </intent-filter>
  </activity>
```

Substitute the package name that you registered in the Azure portal for the `android:host=` value. Substitute the key hash that you registered in the Azure portal for the `android:path=` value. The signature hash should *not* be URL encoded. Ensure that a leading forward slash (`/`) appears at the beginning of your signature hash.

Alternatively, [create the activity in code](/xamarin/android/platform/android-manifest#the-basics) rather than manually editing *AndroidManifest.xml*. To create the activity in code, first create a class that includes the `Activity` attribute and the `IntentFilter` attribute.

Here's an example of a class that represents the values of the XML file:

```csharp
  [Activity]
  [IntentFilter(new[] { Intent.ActionView },
        Categories = new[] { Intent.CategoryBrowsable, Intent.CategoryDefault },
        DataHost = "auth",
        DataScheme = "msal{client_id}")]
  public class MsalActivity : BrowserTabActivity
  {
  }
```

### Xamarin.Forms 4.3.x manifest

Xamarin.Forms 4.3.x generates code that sets the `package` attribute to `com.companyname.{appName}` in *AndroidManifest.xml*. If you use `DataScheme` as `msal{client_id}`, then you might want to change the value to match the value of the `MainActivity.cs` namespace.

## Use the embedded web view (optional)

By default, MSAL.NET uses the system web browser. This browser enables you to get single sign-on (SSO) by using web applications and other apps. In some rare cases, you might want your system to use an embedded web view.

This code example shows how to set up an embedded web view:

```csharp
bool useEmbeddedWebView = !app.IsSystemWebViewAvailable;

var authResult = AcquireTokenInteractive(scopes)
 .WithParentActivityOrWindow(parentActivity)
 .WithEmbeddedWebView(useEmbeddedWebView)
 .ExecuteAsync();
```

For more information, see [Use web browsers for MSAL.NET](msal-net-web-browsers.md) and [Xamarin Android system browser considerations](msal-net-system-browser-android-considerations.md).

## Troubleshooting

### General tips

- Update the existing MSAL.NET NuGet package to the [latest version of MSAL.NET](https://www.nuget.org/packages/Microsoft.Identity.Client/).
- Verify that Xamarin.Forms is on the latest version.
- Verify that Xamarin.Android.Support.v4 is on the latest version.
- Ensure all the Xamarin.Android.Support packages target the latest version.
- Clean or rebuild the application.
- In Visual Studio, try setting the maximum number of parallel project builds to **1**. To do that, select **Options** > **Projects and Solutions** > **Build and Run** > **Maximum number of parallel projects builds**.
- If you're building from the command line and your command uses `/m`, try removing this element from the command.

### Error: The name AuthenticationContinuationHelper doesn't exist in the current context

If an error indicates that `AuthenticationContinuationHelper` doesn't exist in the current context, Visual Studio might have incorrectly updated the *Android.csproj\** file. Sometimes the file path in the `<HintPath>` element incorrectly contains `netstandard13` instead of `monoandroid90`.

This example contains a correct file path:

```xml
<Reference Include="Microsoft.Identity.Client, Version=3.0.4.0, Culture=neutral, PublicKeyToken=0a613f4dd989e8ae,
           processorArchitecture=MSIL">
  <HintPath>..\..\packages\Microsoft.Identity.Client.3.0.4-preview\lib\monoandroid90\Microsoft.Identity.Client.dll</HintPath>
</Reference>
```

## Next steps

For more information, see the sample of a [Xamarin mobile application that uses Microsoft identity platform](https://github.com/azure-samples/active-directory-xamarin-native-v2#android-specific-considerations). The following table summarizes the relevant information in the README file.

| Sample | Platform | Description |
| ------ | -------- | ----------- |
|[https://github.com/Azure-Samples/active-directory-xamarin-native-v2](https://github.com/azure-samples/active-directory-xamarin-native-v2) | Xamarin.iOS, Android, UWP | A simple Xamarin.Forms app that shows how to use MSAL to authenticate Microsoft personal accounts and Azure AD through the Azure AD 2.0 endpoint. The app also shows how to access Microsoft Graph and shows the resulting token. <br>![Diagram of authentication flow](media/msal-net-xamarin-android-considerations/topology.png) |

<!-- REF LINKS -->
[PublicClientApplication]: /dotnet/api/microsoft.identity.client.publicclientapplication
[OnActivityResult]: /dotnet/api/android.app.activity.onactivityresult
[Activity]: /dotnet/api/android.app.activity
