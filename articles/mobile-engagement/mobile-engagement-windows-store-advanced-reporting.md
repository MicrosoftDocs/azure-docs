---
title: Windows Universal Advanced Reporting with MobileApps Engagement
description: How to Integrate Azure Mobile Engagement with Windows Universal Apps
services: mobile-engagement
documentationcenter: mobile
author: piyushjo
manager: erikre
editor: ''

ms.assetid: ea5030bf-73ac-49b7-bc3e-c25fc10e945a
ms.service: mobile-engagement
ms.workload: mobile
ms.tgt_pltfrm: mobile-windows-store
ms.devlang: dotnet
ms.topic: article
ms.date: 08/12/2016
ms.author: piyushjo;ricksal

---
# Advanced Reporting with the Windows Universal Apps Engagement SDK
> [!div class="op_single_selector"]
> * [Universal Windows](mobile-engagement-windows-store-advanced-reporting.md)
> * [Windows Phone Silverlight](mobile-engagement-windows-phone-integrate-engagement.md)
> * [iOS](mobile-engagement-ios-integrate-engagement.md)
> * [Android](mobile-engagement-android-advanced-reporting.md)
> 
> 

This topic describes additional reporting scenarios in your Windows Universal application. These scenarios include options that you can choose to apply to the app created in the [Getting Started](mobile-engagement-windows-store-dotnet-get-started.md) tutorial.

## Prerequisites
[!INCLUDE [Prereqs](../../includes/mobile-engagement-windows-store-prereqs.md)]

Before starting this tutorial, you must first complete the [Getting Started](mobile-engagement-windows-store-dotnet-get-started.md) tutorial, which is deliberately direct and simple. This tutorial covers additional options you can choose from.

## Specifying engagement configuration at runtime
The Engagement configuration is centralized in the `Resources\EngagementConfiguration.xml` file of your project, which is where it was specified in the [Getting Started](mobile-engagement-windows-store-dotnet-get-started.md) topic.

But you can also specify it at runtime: you can call the following method before the Engagement agent initialization:

          /* Engagement configuration. */
          EngagementConfiguration engagementConfiguration = new EngagementConfiguration();

          /* Set the Engagement connection string. */
          engagementConfiguration.Agent.ConnectionString = "Endpoint={appCollection}.{domain};AppId={appId};SdkKey={sdkKey}";

          /* Initialize Engagement angent with above configuration. */
          EngagementAgent.Instance.Init(e, engagementConfiguration);



## Recommended method: overload your `Page` classes
To activate the reporting of all the logs required by Engagement to compute Users, Sessions, Activities, Crashes and Technical statistics, make all your `Page` sub-classes inherit from the `EngagementPage` classes.

Here is an example for a page of your application. You can do the same thing for all pages of your application.

### C# Source file
Modify your page `.xaml.cs` file:

* Add to your `using` statements:
  
      using Microsoft.Azure.Engagement;
* Replace `Page` with `EngagementPage`:

**Without Engagement:**

        namespace Example
        {
          public sealed partial class ExamplePage : Page
          {
            [...]
          }
        }

**With Engagement:**

        using Microsoft.Azure.Engagement;

        namespace Example
        {
          public sealed partial class ExamplePage : EngagementPage
          {
            [...]
          }
        }

> [!IMPORTANT]
> If your page overrides the `OnNavigatedTo` method, be sure to call `base.OnNavigatedTo(e)`. Otherwise, the activity is not be reported (the `EngagementPage` calls `StartActivity` inside its `OnNavigatedTo` method).
> 
> 

### XAML file
Modify your page `.xaml` file:

* Add to your namespaces declarations:
  
      xmlns:engagement="using:Microsoft.Azure.Engagement"
* Replace `Page` with `engagement:EngagementPage`:

**Without Engagement:**

        <Page>
            <!-- layout -->
            ...
        </Page>

**With Engagement:**

        <engagement:EngagementPage
            xmlns:engagement="using:Microsoft.Azure.Engagement">
            <!-- layout -->
            ...
        </engagement:EngagementPage >

### Override the default behaviour
By default, the class name of the page is reported as the activity name, with no extra. If the class uses the "Page" suffix, Engagement removes it.

To override the default behavior for the name, add this code:

        // in the .xaml.cs file
        protected override string GetEngagementPageName()
        {
          /* your code */
          return "new name";
        }

To report extra information with your activity, add this code:

        // in the .xaml.cs file
        protected override Dictionary<object,object> GetEngagementPageExtra()
        {
          /* your code */
          return extra;
        }

These methods are called from within the `OnNavigatedTo` method of your page.

### Alternate method: call `StartActivity()` manually
If you cannot or do not want to overload your `Page` classes, you can instead start your activities by calling `EngagementAgent` methods directly.

We recommend calling `StartActivity` inside your `OnNavigatedTo` method of your Page.

            protected override void OnNavigatedTo(NavigationEventArgs e)
            {
              base.OnNavigatedTo(e);
              EngagementAgent.Instance.StartActivity("MyPage");
            }

> [!IMPORTANT]
> Ensure you end your session correctly.
> 
> The Windows Universal SDK automatically calls the `EndActivity` method when the application is closed. Thus, it is **HIGHLY** recommended to call the `StartActivity` method whenever the activity of the user change, and to **NEVER** call the `EndActivity` method. This method notifies the Engagement server that the current user has left the application, which will impact all application logs.
> 
> 

## Advanced reporting
Optionally, you may want to report application-specific events, errors and jobs, to do so, use the others methods found in the `EngagementAgent` class. The Engagement API allows use of all Engagement's advanced capabilities.

For further information, see [How to use the advanced Mobile Engagement tagging API in your Windows Universal app](mobile-engagement-windows-store-use-engagement-api.md).

