---
title: Xamarin Android considerations (MSAL.NET) | Azure
titleSuffix: Microsoft identity platform
description: Learn about considerations for using Xamarin Android with Microsoft Authentication Library for .NET (MSAL.NET).
services: active-directory
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 04/24/2019
ms.author: marsma
ms.reviewer: saeeda
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn about considerations for using Xamarin Android and MSAL.NET so that I can decide if this platform meets my application development needs.
---

# Considerations for using Xamarin Android with MSAL.NET
This article discusses what you should consider when you use Xamarin Android with Microsoft Authentication Library for .NET (MSAL.NET).

## Set the parent activity

On Xamarin Android, set the parent activity so that the token returns after the interaction. Here's a code example:

```csharp
var authResult = AcquireTokenInteractive(scopes)
 .WithParentActivityOrWindow(parentActivity)
 .ExecuteAsync();
```

In MSAL 4.2 and later, you can also set this functionality at the level of `PublicClientApplication`. To do so, use a callback:

```csharp
// Requires MSAL.NET 4.2 or later
var pca = PublicClientApplicationBuilder
  .Create("<your-client-id-here>")
  .WithParentActivityOrWindow(() => parentActivity)
  .Build();
```

If you use [CurrentActivityPlugin](https://github.com/jamesmontemagno/CurrentActivityPlugin), then your `PublicClientApplication` builder code looks like the following example.

```csharp
// Requires MSAL.NET 4.2 or later
var pca = PublicClientApplicationBuilder
  .Create("<your-client-id-here>")
  .WithParentActivityOrWindow(() => CrossCurrentActivity.Current)
  .Build();
```

## Ensure that control returns to MSAL 
When the interactive portion of the authentication flow ends, make sure that control goes back to MSAL. On Android, override the `OnActivityResult` method of `Activity`. Then call the `SetAuthenticationContinuationEventArgs` method of the `AuthenticationContinuationHelper` MSAL class. 

Here's an example:

```csharp
protected override void OnActivityResult(int requestCode, 
                                         Result resultCode, Intent data)
{
 base.OnActivityResult(requestCode, resultCode, data);
 AuthenticationContinuationHelper.SetAuthenticationContinuationEventArgs(requestCode,
                                                                         resultCode,
                                                                         data);
}

```

This line ensures that the control returns to MSAL at the end of the interactive portion of the authentication flow.

## Update the Android manifest
The *AndroidManifest.xml* file should contain the following values:

<!--Intent filter to capture System Browser or Authenticator calling back to our app after sign-in-->
```
  <activity
        android:name="com.microsoft.identity.client.BrowserTabActivity">
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

Alternatively, [create the activity in code](https://docs.microsoft.com/xamarin/android/platform/android-manifest#the-basics) rather than manually editing *AndroidManifest.xml*. To create the activity in code, first create a class that includes the `Activity` attribute and the `IntentFilter` attribute. 

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

### Xamarin.Forms 4.3.X manifest

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


## Troubleshoot
You can create a new Xamarin.Forms application and add a reference to the MSAL.NET NuGet package.
But you might have build issues if you upgrade an existing Xamarin.Forms application to MSAL.NET preview 1.1.2 or later.

To troubleshoot build issues:

- Update the existing MSAL.NET NuGet package to MSAL.NET preview 1.1.2 or later.
- Check that Xamarin.Forms automatically updated to version 2.5.0.122203. If necessary, update Xamarin.Forms to this version.
- Check that Xamarin.Android.Support.v4 automatically updated to version 25.4.0.2. If necessary, update to version 25.4.0.2.
- Ensure all the Xamarin.Android.Support packages target version 25.4.0.2.
- Clean or rebuild the application.
- In Visual Studio, try setting the maximum number of parallel project builds to 1. To do that, select **Options** > **Projects and Solutions** > **Build and Run** > **Maximum number of parallel projects builds**.
- If you're building from the command line and your command uses `/m`, try removing this element from the command.

### Error: The name AuthenticationContinuationHelper doesn't exist in the current context

If an error indicates that `AuthenticationContinuationHelper` doesn't exist in the current context, Visual Studio might have incorrectly updated the Android.csproj* file. Sometimes the *\<HintPath>* file path incorrectly contains *netstandard13* instead of *monoandroid90*.

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
|[https://github.com/Azure-Samples/active-directory-xamarin-native-v2](https://github.com/azure-samples/active-directory-xamarin-native-v2) | Xamarin.iOS, Android, UWP | A simple Xamarin.Forms app that shows how to use MSAL to authenticate Microsoft personal accounts and Azure AD through the Azure AD 2.0 endpoint. The app also shows how to access Microsoft Graph and shows the resulting token. <br>![Topology](media/msal-net-xamarin-android-considerations/topology.png) |
