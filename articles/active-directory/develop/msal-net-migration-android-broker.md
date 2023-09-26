---
title: Migrate Xamarin Android apps using brokers to MSAL.NET
description: Learn how to migrate Xamarin Android apps that use the Microsoft Authenticator or Intune Company Portal from ADAL.NET to MSAL.NET.
author: henrymbuguakiarie
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 08/31/2020
ms.author: henrymbugua
ms.reviewer: saeeda
ms.custom: aaddev, has-adal-ref
#Customer intent: As an application developer, I want to learn how to migrate my Xamarin Android applications that use Microsoft Authenticator from ADAL.NET to MSAL.NET.
---

# Migrate Android applications that use a broker from ADAL.NET to MSAL.NET

If you have a Xamarin Android app currently using the Azure Active Directory Authentication Library for .NET (ADAL.NET) and an [authentication broker](msal-android-single-sign-on.md), it's time to migrate to the [Microsoft Authentication Library for .NET](msal-overview.md) (MSAL.NET).

## Prerequisites

* A Xamarin Android app already integrated with a broker ([Microsoft Authenticator](https://play.google.com/store/apps/details?id=com.azure.authenticator) or [Intune Company Portal](https://play.google.com/store/apps/details?id=com.microsoft.windowsintune.companyportal)) and ADAL.NET that you need to migrate to MSAL.NET.

## Step 1: Enable the broker

<table>
<tr><td>Current ADAL code:</td><td>MSAL counterpart:</td></tr>
<tr><td>
In ADAL.NET, broker support is enabled on a per-authentication context basis.

To call the broker, you had to set a `useBroker` to *true* in the `PlatformParameters` constructor:

```CSharp
public PlatformParameters(
        Activity callerActivity,
        bool useBroker)
```

In the platform-specific page renderer code for Android, you set the `useBroker` flag to true:

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
In MSAL.NET, broker support is enabled on a per-PublicClientApplication basis.

Use the `WithBroker()` parameter (which is set to true by default) to call broker:

```CSharp
var app = PublicClientApplicationBuilder
                .Create(ClientId)
                .WithBroker()
                .WithRedirectUri(redirectUriOnAndroid)
                .Build();
```

Then, in the AcquireToken call:

```CSharp
result = await app.AcquireTokenInteractive(scopes)
             .WithParentActivityOrWindow(App.RootViewController)
             .ExecuteAsync();
```
</table>

## Step 2: Set an Activity

In ADAL.NET, you passed in an activity (usually the MainActivity) as part of the PlatformParameters as shown in [Step 1: Enable the broker](#step-1-enable-the-broker).

MSAL.NET also uses an activity, but it's not required in regular Android usage without a broker. To use the broker, set the activity to send and receive responses from broker.

<table>
<tr><td>Current ADAL code:</td><td>MSAL counterpart:</td></tr>
<tr><td>
The activity is passed into the PlatformParameters in the Android-specific platform.

```CSharp
page.BrokerParameters = new PlatformParameters(
          this,
          true,
          PromptBehavior.SelectAccount);
```
</td><td>

In MSAL.NET, do two things to set the activity for Android:

1. In `MainActivity.cs`, set the `App.RootViewController`  to the `MainActivity` to ensure there's an activity with the call to the broker.

    If it's not set correctly, you may get this error:
`"Activity_required_for_android_broker":"Activity is null, so MSAL.NET cannot invoke the Android broker. See https://aka.ms/Brokered-Authentication-for-Android"`

1. On the AcquireTokenInteractive call, use the `.WithParentActivityOrWindow(App.RootViewController)`
 and pass in the reference to the activity you will use. This example will use the MainActivity.

**For example:**

In *App.cs*:

```CSharp
   public static object RootViewController { get; set; }
```

In *MainActivity.cs*:

```CSharp
   LoadApplication(new App());
   App.RootViewController = this;
```

In the AcquireToken call:

```CSharp
result = await app.AcquireTokenInteractive(scopes)
             .WithParentActivityOrWindow(App.RootViewController)
             .ExecuteAsync();
```
</table>

## Next steps

For more information about Android-specific considerations when using MSAL.NET with Xamarin, see [Configuration requirements and troubleshooting tips for Xamarin Android with MSAL.NET](msal-net-xamarin-android-considerations.md).
