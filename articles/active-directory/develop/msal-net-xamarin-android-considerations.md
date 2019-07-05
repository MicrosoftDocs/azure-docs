---
title: Xamarin Android considerations (Microsoft Authentication Library for .NET) | Azure
description: Learn about specific considerations when using Xamarin Android with the Microsoft Authentication Library for .NET (MSAL.NET).
services: active-directory
documentationcenter: dev-center-name
author: rwike77
manager: CelesteDG
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/24/2019
ms.author: ryanwi
ms.reviewer: saeeda
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn about specific considerations when using Xamarin Android and MSAL.NET so I can decide if this platform meets my application development needs and requirements.
ms.collection: M365-identity-device-management
---

# Xamarin Android-specific considerations with MSAL.NET
This article discusses specific considerations when using Xamarin Android with the Microsoft Authentication Library for .NET (MSAL.NET).

This article is for MSAL.NET 3.x. If you are interested in MSAL.NET 2.x, see [Xamarin Android specifics in MSAL.NET 2.x](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki/Xamarin-Android-specifics-2x).

## Set the parent activity

On Xamarin.Android, you need to set the parent activity so that the token gets back once the interaction has happened.

```csharp
var authResult = AcquireTokenInteractive(scopes)
 .WithParentActivityOrWindow(parentActivity)
 .ExecuteAsync();
```

## Ensuring control goes back to MSAL once the interactive portion of the authentication flow ends
On Android, you need to override the `OnActivityResult` method of the `Activity` and call the SetAuthenticationContinuationEventArgs method of the AuthenticationContinuationHelper MSAL class.

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
That line ensures that the control goes back to MSAL once the interactive portion of the authentication flow ended.

## Update the Android manifest
The `AndroidManifest.xml` should contain the following values:
```csharp
<activity android:name="microsoft.identity.client.BrowserTabActivity">
	<intent-filter>
		<action android:name="android.intent.action.VIEW" />
		<category android:name="android.intent.category.DEFAULT" />
		<category android:name="android.intent.category.BROWSABLE" />
		<data android:scheme="msal{client_id}" android:host="auth" />
         </intent-filter>
</activity>
```

## Use the embedded web view (optional)

By default MSAL.NET uses the system web browser, which enables you to get SSO with Web applications and other apps. In some rare cases, you might want to specify that you want to use the embedded web view. For more information, see [MSAL.NET uses a Web browser](msal-net-web-browsers.md) and [Android system browser](msal-net-system-browser-android-considerations.md).

```csharp
bool useEmbeddedWebView = !app.IsSystemWebViewAvailable;

var authResult = AcquireTokenInteractive(scopes)
 .WithParentActivityOrWindow(parentActivity)
 .WithEmbeddedWebView(useEmbeddedWebView)
 .ExecuteAsync();
```

## Troubleshooting
If you create a new Xamarin.Forms application and add a reference to the MSAL.Net NuGet package, this will just work.
However, if you want to upgrade an existing Xamarin.Forms application to MSAL.NET preview 1.1.2 or later you might experience build issues.

To troubleshoot these issues, you should:
- Update the existing MSAL.NET NuGet package to MSAL.NET preview 1.1.2 or later
- Check that Xamarin.Forms automatically updated to version 2.5.0.122203 (if not, update to this version)
- Check that Xamarin.Android.Support.v4 automatically updated to version 25.4.0.2 (if not, update to this version)
- All the Xamarin.Android.Support packages should be targeting version 25.4.0.2
- Clean/Rebuild
- Try setting the max parallel project builds to 1 in Visual Studio (Options->Projects and Solutions->Build and Run-> Maximum number of parallel projects builds)
- Alternatively, if you are building from the command line, try removing /m from your command if you are using it.


### Error: The name 'AuthenticationContinuationHelper' does not exist in the current context

This is probably because Visual Studio did not correctly update the Android.csproj* file. Sometimes the **\<HintPath>** filepath incorrectly contains netstandard13 instead of **monoandroid90**.

```xml
<Reference Include="Microsoft.Identity.Client, Version=3.0.4.0, Culture=neutral, PublicKeyToken=0a613f4dd989e8ae,
           processorArchitecture=MSIL">
  <HintPath>..\..\packages\Microsoft.Identity.Client.3.0.4-preview\lib\monoandroid90\Microsoft.Identity.Client.dll</HintPath>
</Reference>
```

## Next steps

More details and samples are provided in the [Android Specific Considerations](https://github.com/azure-samples/active-directory-xamarin-native-v2#android-specific-considerations) paragraph of the following sample's readme.md file:

| Sample | Platform | Description |
| ------ | -------- | ----------- |
|[https://github.com/Azure-Samples/active-directory-xamarin-native-v2](https://github.com/azure-samples/active-directory-xamarin-native-v2) | Xamarin iOS, Android, UWP | A simple Xamarin Forms app showcasing how to use MSAL to authenticate MSA and Azure AD via the AADD v2.0 endpoint, and access the Microsoft Graph with the resulting token. <br>![Topology](media/msal-net-xamarin-android-considerations/topology.png) |