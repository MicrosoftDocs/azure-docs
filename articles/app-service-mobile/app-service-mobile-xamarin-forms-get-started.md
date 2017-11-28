---
title: Get started with Mobile Apps by using Xamarin.Forms
description: Follow this tutorial to start using Mobile Apps for Xamarin.Forms development
services: app-service\mobile
documentationcenter: xamarin
author: ggailey777
manager: syntaxc4
editor: ''

ms.assetid: 5e692220-cc89-4548-96c8-35259722acf5
ms.service: app-service-mobile
ms.workload: mobile
ms.tgt_pltfrm: mobile-xamarin
ms.devlang: dotnet
ms.topic: hero-article
ms.date: 10/01/2016
ms.author: glenga

---
# Create a Xamarin.Forms app
[!INCLUDE [app-service-mobile-selector-get-started](../../includes/app-service-mobile-selector-get-started.md)]

## Overview
This tutorial shows you how to add a cloud-based back-end service to a Xamarin.Forms mobile app by using the Mobile Apps feature of Azure App Service as the back end. You create both a new Mobile Apps back end and a simple to-do list Xamarin.Forms app that stores app data in Azure.

Completing this tutorial is a prerequisite for all other Mobile Apps tutorials for Xamarin.Forms.

## Prerequisites
To complete this tutorial, you need the following:

* An active Azure account. If you don't have an account, you can sign up for an Azure trial and get up to 10 free mobile apps that you can keep using even after your trial ends. For more information, see [Azure Free Trial](https://azure.microsoft.com/pricing/free-trial/).

* Visual Studio with Xamarin. For information, see the [Set up and install Visual Studio and Xamarin](https://msdn.microsoft.com/library/mt613162.aspx) page.

* A Mac with Xcode v7.0 or later and Xamarin Studio Community installed. For information, see [Set up and install Visual Studio and Xamarin](https://msdn.microsoft.com/library/mt613162.aspx) and [Set up, install, and verify for Mac users](https://msdn.microsoft.com/library/mt488770.aspx) (MSDN).

## Create a new Mobile Apps back end

To create a new Mobile Apps back end, do the following:

[!INCLUDE [app-service-mobile-dotnet-backend-create-new-service](../../includes/app-service-mobile-dotnet-backend-create-new-service.md)]

You have now set up a Mobile Apps back end that your mobile client applications can use. Next, you download a server project for a simple to-do list back end and then publish it to Azure.

## Configure the server project

To configure the server project to use either the Node.js or .NET back end, do the following:

[!INCLUDE [app-service-mobile-configure-new-backend](../../includes/app-service-mobile-configure-new-backend.md)]

## Download and run the Xamarin.Forms solution

You can download the solution in either of two ways. Download it to a Mac and open it in Xamarin Studio, or download it to a Windows computer and open it in Visual Studio by using a networked Mac for building the iOS app. For more information, see [Set up and install Visual Studio and Xamarin](https://msdn.microsoft.com/library/mt613162.aspx).

On a Mac or Windows computer, do the following:

1. Go to the [Azure portal].

2. On the **Settings** blade for your mobile app, under **Mobile**, select **Get Started** > **Xamarin.Forms**. Under **step 3**, select  **Create a new app**, and then select **Download**.

   This action downloads a project that contains a client application that's connected to your mobile app. Save the compressed project file to your local computer, and make a note of where you save it.

3. Extract the project that you downloaded, and then open it in Xamarin Studio (Mac) or Visual Studio (Windows).

   ![Extracted project in Xamarin Studio][9]

   ![Extracted project in Visual Studio][8]

## (Optional) Run the iOS project
In this section, you run the Xamarin iOS project for iOS devices. You can skip this section if you are not working with iOS devices.

#### In Xamarin Studio
1. Right-click the iOS project, and then select **Set As Startup Project**.

2. On the **Run** menu, select **Start Debugging** to build the project and start the app in the iPhone emulator.

#### In Visual Studio
1. Right-click the iOS project, and then select **Set as StartUp Project**.

2. On the **Build** menu, select **Configuration Manager**.

3. In the **Configuration Manager** dialog box, select the **Build** and **Deploy** check boxes next to the iOS project.

4. To build the project and start the app in the iPhone emulator, select the **F5** key.

   > [!NOTE]
   > If you have problems building the project, run the NuGet package manager and update to the latest version of the Xamarin support packages. Quickstart projects might be slow to update to the latest versions.    
   >
   >

5. In the app, type meaningful text, such as *Learn Xamarin*, and then select the plus sign (**+**).

    ![][10]

    This action sends a post request to the new Mobile Apps back end that's hosted in Azure. Data from the request is inserted into the TodoItem table. Items that are stored in the table are returned by the Mobile Apps back end, and the data is displayed in the list.

    > [!NOTE]
    > You'll find the code that accesses your Mobile Apps back end in the TodoItemManager.cs C# file of the portable class library project of your solution.
    >
    >

## (Optional) Run the Android project
In this section, you run the Xamarin droid project for Android. You can skip this section if you are not working with Android devices.

#### In Xamarin Studio

1. Right-click the Android project, and then select **Set As Startup Project**.

2. To build the project and start the app in an Android emulator, on the **Run** menu, select **Start Debugging**.

#### In Visual Studio

1. Right-click the Android (Droid) project, and then select **Set as StartUp Project**.

2. On the **Build** menu, select **Configuration Manager**.

3. In the **Configuration Manager** dialog box, select the **Build** and **Deploy** check boxes next to the Android project.

4. To build the project and start the app in an Android emulator, select the **F5** key.

   > [!NOTE]
   > If you have problems building the project, run the NuGet package manager and update to the latest version of the Xamarin support packages. Quickstart projects might be slow to update to the latest versions.    
   >
   >

5. In the app, type meaningful text, such as *Learn Xamarin*, and then select the plus sign (**+**).

    ![][11]
    
    This action sends a post request to the new Mobile Apps back end that's hosted in Azure. Data from the request is inserted into the TodoItem table. Items that are stored in the table are returned by the Mobile Apps back end, and the data is displayed in the list.
    
    > [!NOTE]
    > You'll find the code that accesses your Mobile Apps back end in the TodoItemManager.cs C# file of the portable class library project of your solution.
    >
    >

## (Optional) Run the Windows project

In this section, you run the Xamarin WinApp project for Windows devices. You can skip this section if you are not working with Windows devices.

#### In Visual Studio

1. Right-click any of the Windows projects, and then select **Set as StartUp Project**.

2. On the **Build** menu, select **Configuration Manager**.

3. In the **Configuration Manager** dialog box, select the **Build** and **Deploy** check boxes next to the Windows project that you chose.

4. To build the project and start the app in a Windows emulator, select the **F5** key.

   > [!NOTE]
   > If you have problems building the project, run the NuGet package manager and update to the latest version of the Xamarin support packages. Quickstart projects might be slow to update to the latest versions.    
   >
   >

5. In the app, type meaningful text, such as *Learn Xamarin*, and then select the plus sign (**+**).

    This action sends a post request to the new Mobile Apps back end that's hosted in Azure. Data from the request is inserted into the TodoItem table. Items that are stored in the table are returned by the Mobile Apps back end, and the data is displayed in the list.
    
    ![][12]
    
    > [!NOTE]
    > You'll find the code that accesses your Mobile Apps back end in the TodoItemManager.cs C# file of the portable class library project of your solution.
    >
    >

## Next steps

* [Add authentication to your app](app-service-mobile-xamarin-forms-get-started-users.md)  
  Learn how to authenticate users of your app with an identity provider.

* [Add push notifications to your app](app-service-mobile-xamarin-forms-get-started-push.md)  
  Learn how to add push notifications support to your app and configure your Mobile Apps back end to use Azure Notification Hubs to send the push notifications.

* [Enable offline sync for your app](app-service-mobile-xamarin-forms-get-started-offline-data.md)  
  Learn how to add offline support for your app by using a Mobile Apps back end. With offline sync, you can view, add, or modify your mobile app's data, even when there is no network connection.

* [Use the managed client for Mobile Apps](app-service-mobile-dotnet-how-to-use-client-library.md)  
  Learn how to work with the managed client SDK in your Xamarin app.

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
[Visual Studio Professional 2013]: https://go.microsoft.com/fwLink/p/?LinkID=257546
[Mobile app SDK]: http://go.microsoft.com/fwlink/?LinkId=257545
[Azure portal]: https://portal.azure.com/
