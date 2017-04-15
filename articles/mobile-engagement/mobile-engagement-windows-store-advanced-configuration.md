---
title: Advanced Configuration for Windows Universal Apps Engagement SDK
description: Advanced Configuration options for Azure Mobile Engagement with Windows Universal Apps
services: mobile-engagement
documentationcenter: mobile
author: piyushjo
manager: erikre
editor: ''

ms.assetid: 6d85dd5d-ac07-43ba-bbe4-e91c3a17690b
ms.service: mobile-engagement
ms.workload: mobile
ms.tgt_pltfrm: mobile-windows-store
ms.devlang: dotnet
ms.topic: article
ms.date: 10/04/2016
ms.author: piyushjo;ricksal

---
# Advanced Configuration for Windows Universal Apps Engagement SDK
> [!div class="op_single_selector"]
> * [Universal Windows](mobile-engagement-windows-store-advanced-configuration.md)
> * [Windows Phone Silverlight](mobile-engagement-windows-phone-integrate-engagement.md)
> * [iOS](mobile-engagement-ios-integrate-engagement.md)
> * [Android](mobile-engagement-android-advanced-configuration.md)
> 
> 

This procedure describes how to configure various configuration options for Azure Mobile Engagement Android apps.

## Prerequisites
[!INCLUDE [Prereqs](../../includes/mobile-engagement-windows-store-prereqs.md)]

## Advanced configuration
### Disable automatic crash reporting
You can disable the automatic crash reporting feature of Engagement. Then, when an unhandled exception occurs, Engagement does nothing.

> [!WARNING]
> If you disable this feature, then when an unhandled crash occurs in your app, Engagement does not send the crash **AND** does not close the session and jobs.
> 
> 

To disable automatic crash reporting, customize your configuration depending on the way you declared it:

#### From `EngagementConfiguration.xml` file
Set report crash to `false` between `<reportCrash>` and `</reportCrash>` tags.

#### From `EngagementConfiguration` object at run time
Set report crash to false using your EngagementConfiguration object.

        /* Engagement configuration. */
        EngagementConfiguration engagementConfiguration = new EngagementConfiguration();
        engagementConfiguration.Agent.ConnectionString = "Endpoint={appCollection}.{domain};AppId={appId};SdkKey={sdkKey}";

        /* Disable Engagement crash reporting. */
        engagementConfiguration.Agent.ReportCrash = false;

### Disable real time reporting
By default, the Engagement service reports logs in real time. If your application reports logs frequently, it is better to buffer the logs and to report them all at once on a regular time basis. This is called “burst mode”.

To do so, call the method:

        EngagementAgent.Instance.SetBurstThreshold(int everyMs);

The argument is a value in **milliseconds**. Whenever you want to reactivate the real-time logging, call the method without any parameter, or with the 0 value.

Burst mode slightly increases the battery life but has an impact on the Engagement Monitor: all sessions and jobs duration are rounded to the burst threshold (thus, sessions and jobs shorter than the burst threshold may not be visible). We recommend using a burst threshold no longer than 30000 (30s). Saved logs are limited to 300 items. If sending is too long, you can lose some logs.

> [!WARNING]
> The burst threshold cannot be configured to a period less than one second. If you do so, the SDK shows a trace with the error and automatically resets to the default value, zero seconds. This triggers the SDK to report the logs in real-time.
> 
> 

[here]:http://www.nuget.org/packages/Capptain.WindowsCS
[NuGet website]:http://docs.nuget.org/docs/start-here/overview
