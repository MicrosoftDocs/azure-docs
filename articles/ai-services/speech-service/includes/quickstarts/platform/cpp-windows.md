---
title: 'Quickstart: Speech SDK for C++ (Windows) platform setup - Speech service'
titleSuffix: Azure AI services
description: Use this guide to set up your platform for C++ on Windows desktop operating systems by using the Speech SDK.
services: cognitive-services
author: markamos
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 06/11/2022
ms.author: eur
ms.custom: ignite-fall-2021
---

This guide shows how to install the [Speech SDK](~/articles/ai-services/speech-service/speech-sdk.md) for C++ on Windows desktop operating systems.

This setup guide requires:

* [Microsoft Visual C++ Redistributable for Visual Studio 2019](https://support.microsoft.com/topic/the-latest-supported-visual-c-downloads-2647da03-1eea-4433-9aff-95f26a218cc0) for the Windows platform. Installing it for the first time might require a restart.
* [Visual Studio 2019](https://visualstudio.microsoft.com/downloads/).

### Create a project in Visual Studio and install the Speech SDK

To create a Visual Studio project for C++ desktop development, you need to:

- Set up Visual Studio development options.
- Create the project.
- Select the target architecture.
- Install the Speech SDK.

#### Set up Visual Studio development options

To start, make sure you're set up correctly in Visual Studio for C++ desktop development:

1. Open Visual Studio 2019 to display the start window.   

1. Select **Continue without code** to go to the Visual Studio IDE.

   ![Screenshot that shows the Visual Studio 2019 start window.](~/articles/ai-services/speech-service/media/sdk/vs-start-window.png)

1. From the Visual Studio menu bar, select **Tools** > **Get Tools and Features** to open Visual Studio Installer and view the **Modifying** dialog.   

1. On the **Workloads** tab, under **Windows**, find the **Desktop development with C++** workload. If the check box next to that workload isn't already selected, select it.

   ![Screenshot that shows the Workloads tab of the Modifying dialog for Visual Studio Installer.](~/articles/ai-services/speech-service/media/sdk/vs-enable-cpp-workload.png)

1. On the **Individual components** tab, find the **NuGet package manager** check box. If the check box isn't already selected, select it.

1. In the corner, select the button labeled either **Close** or **Modify**. The button name varies depending on whether you selected any features for installation. 

   If you select **Modify**, installation begins. The process might take a while.

1. Close Visual Studio Installer.

#### Create the project

Next, create your project and select the target architecture:

1. On the Visual Studio menu bar, select **File** > **New** > **Project** to display the **Create a new project** window.
   
1. Find and select **Console App**. Make sure that you select the C++ version of this project type, as opposed to C# or Visual Basic.

1. Select **Next**.

   ![Screenshot of selections for creating a console app project in Visual Studio.](~/articles/ai-services/speech-service/media/sdk/qs-cpp-windows-01-new-console-app.png)   

1. In the **Configure your new project** dialog, in **Project name**, enter **helloworld**.

1. In **Location**, go to and select (or create) the folder where you want to save your project, and then select **Create**.

   ![Screenshot of selections for configuring a new project in Visual Studio.](~/articles/ai-services/speech-service/media/sdk/vs-enable-cpp-configure-your-new-project.png)

1. Select your target platform architecture. On the Visual Studio toolbar, find the **Solution Platforms** drop-down box. If you don't see it, select **View** > **Toolbars** > **Standard** to display the toolbar that contains **Solution Platforms**.

   If you're running 64-bit Windows, select **x64** in the drop-down box. 64-bit Windows can also run 32-bit applications, so you can choose **x86** if you prefer.

#### Install the Speech SDK by using Visual Studio

Finally, install the [Speech SDK NuGet package](https://aka.ms/csspeech/nuget) and reference the Speech SDK in your project:

1. In Solution Explorer, right-click your solution, and then select **Manage NuGet Packages for Solution** to go to the **NuGet - Solution** window.

1. Select **Browse**.   

1. In **Package source**, select **nuget.org**.

   ![Screenshot that shows the Manage NuGet Packages for Solution dialog, with the Browse tab, search box, and package source highlighted.](~/articles/ai-services/speech-service/media/sdk/qs-cpp-windows-03-manage-nuget-packages.png)

1. In the **Search** box, enter **Microsoft.CognitiveServices.Speech**. Choose that package after it appears in the search results.

1. In the package status pane next to the search results, select your **helloworld** project.

1. Select **Install**.

   ![Screenshot that shows the Microsoft.CognitiveServices.Speech package selected, with the project and the Install button highlighted.](~/articles/ai-services/speech-service/media/sdk/qs-cpp-windows-04-nuget-install-1.0.0.png)

1. In the **Preview Changes** dialog, select **OK**.

1. In the **License Acceptance** dialog, view the license, and then select **I Accept**. The package installation begins. When installation is complete, the **Output** pane displays a message that's similar to the following text: `Successfully installed 'Microsoft.CognitiveServices.Speech 1.15.0' to helloworld`.

