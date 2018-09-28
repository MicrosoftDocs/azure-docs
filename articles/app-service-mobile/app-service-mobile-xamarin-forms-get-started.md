---
title: Get started with Mobile Apps by using Xamarin.Forms
description: Follow this tutorial to start using Mobile Apps for Xamarin.Forms development
services: app-service\mobile
documentationcenter: xamarin
author: conceptdev
manager: crdun

ms.assetid: 5e692220-cc89-4548-96c8-35259722acf5
ms.service: app-service-mobile
ms.workload: mobile
ms.tgt_pltfrm: mobile-xamarin
ms.devlang: dotnet
ms.topic: hero-article
ms.date: 09/24/2018
ms.author: crdun
---
# Create a Xamarin.Forms app with Azure

[!INCLUDE [app-service-mobile-selector-get-started](../../includes/app-service-mobile-selector-get-started.md)]

This tutorial shows you how to add a cloud-based back-end service to a Xamarin.Forms mobile app by using the Mobile Apps feature of Azure App Service as the back end. You create both a new Mobile Apps back end and a simple to-do list Xamarin.Forms app that stores app data in Azure.

Completing this tutorial is a prerequisite for all other Mobile Apps tutorials for Xamarin.Forms.

## Prerequisites

To complete this tutorial, you need the following:

* An active Azure account. If you don't have an account, you can sign up for an Azure trial and get up to 10 free mobile apps that you can keep using even after your trial ends. For more information, see [Azure Free Trial](https://azure.microsoft.com/pricing/free-trial/).

* Visual Studio Tools for Xamarin, in Visual Studio 2017 or Visual Studio for Mac. See the [Xamarin installation page][Install Xamarin] for instructions.

* (optional) To build an iOS app, a Mac with Xcode 9.0 or later is required. Visual Studio for Mac can be used to develop iOS apps, or Visual Studio 2017 can be used (so long as the Mac is available on the network).

## Create a new Mobile Apps back end

To create a new Mobile Apps back end, do the following:

[!INCLUDE [app-service-mobile-dotnet-backend-create-new-service](../../includes/app-service-mobile-dotnet-backend-create-new-service.md)]

You have now set up a Mobile App back-end that your mobile applications can use. Next, you download a server project for a simple to-do list back end and then publish it to Azure.

## Configure the server project

To configure the server project to use either the Node.js or .NET back end, do the following:

[!INCLUDE [app-service-mobile-configure-new-backend](../../includes/app-service-mobile-configure-new-backend.md)]

## Download and run the Xamarin.Forms solution

The Visual Studio Tools for Xamarin are required to open the solution, see the [Xamarin installation instructions][Install Xamarin]. If the tools are already installed, follow these steps to download and open the solution:

### Visual Studio

1. Go to the [Azure portal].

2. On the settings blade for your Mobile App, click **Quickstart** (under Deployment) > **Xamarin.Forms**. Under step 3, click  **Create a new app** if it's not already selected.  Next click the **Download** button.

   This action downloads a project that contains a client application that's connected to your mobile app. Save the compressed project file to your local computer, and make a note of where you save it.

3. Extract the project that you downloaded, and then open it in Visual Studio 2017.

   ![Extracted project in Visual Studio][8]

4. Follow the instructions below to run the Android or Windows projects; and if there is a networked Mac computer available, the iOS project.

### Visual Studio for Mac

1. Go to the [Azure portal].

2. On the settings blade for your Mobile App, click **Quickstart** (under Deployment) > **Xamarin.Forms**. Under step 3, click  **Create a new app** if it's not already selected.  Next click the **Download** button.

   This action downloads a project that contains a client application that's connected to your mobile app. Save the compressed project file to your local computer, and make a note of where you save it.

3. Extract the project that you downloaded, and then open it in Visual Studio for Mac.

   ![Extracted project in Visual Studio for Mac][9]

4. Follow the instructions below to run the Android or iOS projects.



## (Optional) Run the Android project

In this section, you run the Xamarin.Android project. You can skip this section if you are not working with Android devices.

### Visual Studio

1. Right-click the Android (Droid) project, and then select **Set as StartUp Project**.

2. On the **Build** menu, select **Configuration Manager**.

3. In the **Configuration Manager** dialog box, select the **Build** and **Deploy** check boxes next to the Android project, and ensure the shared code project has the **Build** box checked.

4. To build the project and start the app in an Android emulator, press the **F5** key or click the **Start** button.

### Visual Studio for Mac

1. Right-click the Android project, and then select **Set As Startup Project**.

2. To build the project and start the app in an Android emulator, select the **Run** menu, then **Start Debugging**.



In the app, type meaningful text, such as *Learn Xamarin*, and then select the plus sign (**+**).

![Android to-do app][11]

This action sends a post request to the new Mobile Apps back end that's hosted in Azure. Data from the request is inserted into the TodoItem table. Items that are stored in the table are returned by the Mobile Apps back end, and the data is displayed in the list.

> [!NOTE]
> The code that accesses your Mobile Apps back end is in the **TodoItemManager.cs** C# file of the shared code project in the solution.
>

## (Optional) Run the iOS project

In this section, you run the Xamarin.iOS project for iOS devices. You can skip this section if you are not working with iOS devices.

### Visual Studio

1. Right-click the iOS project, and then select **Set as StartUp Project**.

2. On the **Build** menu, select **Configuration Manager**.

3. In the **Configuration Manager** dialog box, select the **Build** and **Deploy** check boxes next to the iOS project, and ensure the shared code project has the **Build** box checked.

4. To build the project and start the app in the iPhone emulator, select the **F5** key.

### Visual Studio for Mac

1. Right-click the iOS project, and then select **Set As Startup Project**.

2. On the **Run** menu, select **Start Debugging** to build the project and start the app in the iPhone emulator.



In the app, type meaningful text, such as *Learn Xamarin*, and then select the plus sign (**+**).

![iOS to-do app][10]

This action sends a post request to the new Mobile Apps back end that's hosted in Azure. Data from the request is inserted into the TodoItem table. Items that are stored in the table are returned by the Mobile Apps back end, and the data is displayed in the list.

> [!NOTE]
> You'll find the code that accesses your Mobile Apps back end in the **TodoItemManager.cs** C# file of the shared code project in the solution.
>

## (Optional) Run the Windows project

In this section, you run the Xamarin.Forms Universal Windows Platform (UWP) project for Windows devices. You can skip this section if you are not working with Windows devices.

### Visual Studio

1. Right-click any the UWP project, and then select **Set as StartUp Project**.

2. On the **Build** menu, select **Configuration Manager**.

3. In the **Configuration Manager** dialog box, select the **Build** and **Deploy** check boxes next to the Windows project that you chose, and ensure the shared code project has the **Build** box checked.

4. To build the project and start the app in a Windows emulator, press the **F5** key or click the **Start** button (which should read **Local Machine**).

> [!NOTE]
> The Windows project cannot be run on macOS.



In the app, type meaningful text, such as *Learn Xamarin*, and then select the plus sign (**+**).

This action sends a post request to the new Mobile Apps back end that's hosted in Azure. Data from the request is inserted into the TodoItem table. Items that are stored in the table are returned by the Mobile Apps back end, and the data is displayed in the list.

![UWP to-do app][12]

> [!NOTE]
> You'll find the code that accesses your Mobile Apps back end in the **TodoItemManager.cs** C# file of the portable class library project of your solution.
>

## Troubleshooting

If you have problems building the solution, run the NuGet package manager and update to the latest version of `Xamarin.Forms`, and in the Android project, update the `Xamarin.Android` support packages. Quickstart projects might not always include the latest versions.

Please note that all the support packages referenced in your Android project must have the same version. The [Azure Mobile Apps NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Mobile.Client/) has `Xamarin.Android.Support.CustomTabs` dependency for Android platform, so if your project uses newer support packages you need to install this package with required version directly to avoid conflicts.

## Next steps

* [Add authentication to your app](app-service-mobile-xamarin-forms-get-started-users.md)
  Learn how to authenticate users of your app with an identity provider.

* [Add push notifications to your app](app-service-mobile-xamarin-forms-get-started-push.md)
  Learn how to add push notifications support to your app and configure your Mobile Apps back end to use Azure Notification Hubs to send the push notifications.

* [Enable offline sync for your app](app-service-mobile-xamarin-forms-get-started-offline-data.md)
  Learn how to add offline support for your app by using a Mobile Apps back end. With offline sync, you can view, add, or modify your mobile app's data, even when there is no network connection.

* [Use the managed client for Mobile Apps](app-service-mobile-dotnet-how-to-use-client-library.md)
  Learn how to work with the managed client SDK in your Xamarin app.

* [Using other Azure services with Xamarin.Forms](https://docs.microsoft.com/xamarin/xamarin-forms/data-cloud/)
  Adding additional Azurew features like search, storage, and cognitive services to Xamarin.Forms apps.

<!-- Anchors. -->
[Get started with Mobile Apps back ends]:#getting-started
[Create a new Mobile Apps back end]:#create-new-service
[Next steps]:#next-steps

<!-- Images. -->
[6]: ./media/app-service-mobile-xamarin-forms-get-started/xamarin-forms-quickstart.png
[8]: ./media/app-service-mobile-xamarin-forms-get-started/xamarin-forms-quickstart-vs.png
[9]: ./media/app-service-mobile-xamarin-forms-get-started/xamarin-forms-quickstart-xs.png
[10]: ./media/app-service-mobile-xamarin-forms-get-started/mobile-quickstart-startup-ios.png
[11]: ./media/app-service-mobile-xamarin-forms-get-started/mobile-quickstart-startup-android.png
[12]: ./media/app-service-mobile-xamarin-forms-get-started/mobile-quickstart-startup-windows.png

<!-- URLs. -->
[Install Xamarin]: https://docs.microsoft.com/xamarin/cross-platform/get-started/installation/
[Mobile app SDK]: http://go.microsoft.com/fwlink/?LinkId=257545
[Azure portal]: https://portal.azure.com/
