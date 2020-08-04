---
title: Migrate Xamarin Android apps using brokers to MSAL.NET 
titleSuffix: Microsoft identity platform
description: Learn how to migrate Xamarin Android apps that use Microsoft Authenticator from ADAL.NET to MSAL.NET.
author: aiwang
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 08/03/2020
ms.author: aiwang
ms.reviewer: saeeda
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn how to migrate my Xamarin Android applications that use Microsoft Authenticator from ADAL.NET to MSAL.NET. 
---

# Migrate Android applications that use Microsoft Authenticator from ADAL.NET to MSAL.NET

You've been using the Azure Active Directory Authentication Library for .NET (ADAL.NET) and the Android broker. Now it's time to migrate to the [Microsoft Authentication Library](msal-overview.md) for .NET (MSAL.NET), which supports the broker on Android from release 4.9 onward. 

Where should you start? This article helps you migrate your Xamarin Android app from ADAL to MSAL.

## Prerequisites
This article assumes that you already have a Xamarin Android app that's integrated with the Android broker. If you don't, move directly to MSAL.NET and begin the broker implementation there. For information on how to invoke the iOS broker in MSAL.NET with a new application, see [this documentation](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki/Leveraging-the-broker-on-iOS#why-use-brokers-on-xamarinios-and-xamarinandroid-applications).

## Background

### What are brokers?

Brokers are applications provided by Microsoft on Android and iOS. (See the [Microsoft Authenticator](https://www.microsoft.com/p/microsoft-authenticator/9nblgggzmcj6) and the Intune Company Portal app on Android.) 

They enable:

- Single sign-on.
- Device identification, which is required by some [Conditional Access policies](../conditional-access/overview.md). For more information, see [Device management](../conditional-access/concept-conditional-access-conditions.md#device-platforms).
- Application identification verification, which is also required in some enterprise scenarios. For more information, see [Intune mobile application management (MAM)](https://docs.microsoft.com/intune/mam-faq).

## Migrate from ADAL to MSAL

### **Step One: Enable the Broker**
<table>
<tr><td>Current ADAL code:</td><td>MSAL counterpart:</td></tr>
<tr><td>
In ADAL.NET, broker support was enabled on a per-authentication context basis, it is disabled by default. You had to set a 

`useBroker`
flag to true in the 

`PlatformParameters`
 constructor in order to call broker:

```CSharp
public PlatformParameters(
        Activity callerActivity, 
        bool useBroker)
```
Also, in the platform specific code, in this example, in the page renderer for Android, set the 
`useBroker` 
flag to true:
```CSharp
page.BrokerParameters = new PlatformParameters(
          this, 
          true, 
          PromptBehavior.SelectAccount);
```

Then, include the parameters in the acquire token call:
```CSharp
 AuthenticationResult result =
                    await
                        AuthContext.AcquireTokenAsync(
                              Resource, 
                              ClientId, 
                              new Uri(RedirectURI), 
                              platformParameters)
                              .ConfigureAwait(false);
```

</td><td>
In MSAL.NET, broker support is enabled on a per-Public Client Application basis. It is disabled by default. You must use the 

`WithBroker()` 
parameter (set to true by default) in order to call broker:

```CSharp
var app = PublicClientApplicationBuilder
                .Create(ClientId)
                .WithBroker()
                .WithRedirectUri(redirectUriOnAndroid)
                .Build();
```
In the Acquire Token call:
```CSharp
result = await app.AcquireTokenInteractive(scopes)
             .WithParentActivityOrWindow(App.RootViewController)
             .ExecuteAsync();
```
</table>

### **Step Two: Set a Activity**
In ADAL.NET, you passed in an activity (usually the MainActivity) as part of the PlatformParameters (see example in Step One). In MSAL.NET, to give the developer more flexibility, an activity is used, but not required in regular Android usage without the broker. In order to use the broker, you will need to set the activity in order to send and receive responses from broker. 
<table>
<tr><td>Current ADAL code:</td><td>MSAL counterpart:</td></tr>
<tr><td>
The activity is passed into the PlatformParameters in the Android specific platform.

```CSharp
page.BrokerParameters = new PlatformParameters(
          this, 
          true, 
          PromptBehavior.SelectAccount);
```
</td><td>
In MSAL.NET, you will need to do two things to set the activity for Android:

1) In 
`MainActivity.cs`
, set the 
`App.RootViewController`
 to the  
`MainActivity`. 
This will make sure there is a activity with the call to the broker. If it is not set correctly, you may get this error:
`"Activity_required_for_android_broker":"Activity is null, so MSAL.NET cannot invoke the Android broker. See https://aka.ms/Brokered-Authentication-for-Android"`
2) On the AcquireTokenInteractive call, use the 
`.WithParentActivityOrWindow(App.RootViewController)`
 and pass in the reference to the activity you will use. This example will use the MainActivity.

**For example:**

In `App.cs`:
```CSharp
   public static object RootViewController { get; set; }
```
In `MainActivity.cs`:
```CSharp
   LoadApplication(new App());
   App.RootViewController = this;
```
In the Acquire Token call:
```CSharp
result = await app.AcquireTokenInteractive(scopes)
             .WithParentActivityOrWindow(App.RootViewController)
             .ExecuteAsync();
```

</table>

### **Step Three: Update AppDelegate to handle the callback**
Both ADAL and MSAL call the broker, and the broker in turn calls back to your application through the `OpenUrl` method of the `AppDelegate` class. For more information, see [this documentation](msal-net-use-brokers-with-xamarin-apps.md#step-3-update-appdelegate-to-handle-the-callback).

There are no changes you need to make here.

### **Step Four: Register your RedirectUri in the application portal**
ADAL.NET and MSAL.NET use URLs to invoke the broker and return the broker response back to the app. The URL schemes are the same for ADAL and MSAL so you will not need to make any changes here. For more information about how to register the redirect URI in the portal, see [Leverage the broker in Xamarin.iOS applications](msal-net-use-brokers-with-xamarin-apps.md#step-8-make-sure-the-redirect-uri-is-registered-with-your-app).

There are no changes you need to make here.

---

## Next steps

Learn about [Xamarin Android-specific considerations with MSAL.NET](https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-net-xamarin-android-considerations)