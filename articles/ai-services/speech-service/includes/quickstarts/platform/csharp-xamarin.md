---
title: 'Speech SDK for C# (Xamarin) platform setup - Speech service'
titleSuffix: Azure AI services
description: 'Use this guide to set up your platform for C# Xamarin with the Speech SDK.'
author: markamos
manager: nitinme
ms.service: azure-ai-speech
ms.topic: include
ms.date: 09/05/2023
ms.author: eur
ms.custom: devx-track-csharp, ignite-fall-2021
---

This guide shows how to create a [Xamarin](/xamarin/get-started/what-is-xamarin) forms project and install the [Speech SDK](~/articles/ai-services/speech-service/speech-sdk.md). Xamarin is an open-source platform for building modern and performant applications for iOS, Android, and Windows by using .NET.

For Xamarin development, the Speech SDK supports:

- Windows Desktop x86 and x64
- Universal Windows Platform x86, x64, ARM/ARM64
- Android x86, ARM32/64
- iOS x64 simulator and ARM64

### Prerequisites

This guide requires:

- [Microsoft Visual C++ Redistributable for Visual Studio 2019](https://support.microsoft.com/topic/the-latest-supported-visual-c-downloads-2647da03-1eea-4433-9aff-95f26a218cc0) for the Windows platform. Installing it for the first time might require a restart.
- [Visual Studio 2019](https://visualstudio.microsoft.com/downloads/).

### Create a Visual Studio project and install the Speech SDK

To create a Visual Studio project for cross-platform mobile app development with .NET and Xamarin, you need to:

- Set up Visual Studio development options.
- Create the project and select the target architecture.
- Install the Speech SDK.

#### Set up Visual Studio development options

Make sure you're set up correctly in Visual Studio for cross-platform mobile development with .NET:

1. Open Visual Studio 2019.

1. From the Visual Studio menu, select **Tools** > **Get Tools and Features** to open Visual Studio Installer and view the **Modifying** dialog box.

1. On the **Workloads** tab, find the **Mobile development with .NET** workload. If that workload is already selected, close the **Modifying** dialog box and go to step 6.

   :::image type="content" source="~/articles/ai-services/speech-service/media/sdk/vs-enable-xamarin-workload.png" alt-text="Screenshot that shows the Workloads tab, the Modifying dialog box, and Visual Studio Installer." lightbox="~/articles/ai-services/speech-service/media/sdk/vs-enable-xamarin-workload.png":::

1. Select **Mobile development with .NET**, and then select **Modify**.

1. In the **Before we get started** dialog box, select **Continue** to install the workload for mobile development with .NET. Installation of the new feature might take a while.

1. Close Visual Studio Installer.

#### Create the project

Next, create your project and select the target architecture:

1. On the Visual Studio menu bar, select **File** > **New** > **Project** to display the **Create a new project** window.

1. Find and select **Mobile App (Xamarin.Forms)**.

1. Select **Next**.

   :::image type="content" source="~/articles/ai-services/speech-service/media/sdk/vs-enable-xamarin-create-new-project.png" alt-text="Screenshot that shows how to create a new project in Visual Studio." lightbox="~/articles/ai-services/speech-service/media/sdk/vs-enable-xamarin-create-new-project.png":::

1. In the **Configure your new project** dialog box, in **Project name**, enter *helloworld*.

1. In **Location**, go to and select or create the folder where you want to save your project.

1. Select **Create**.

   :::image type="content" source="~/articles/ai-services/speech-service/media/sdk/vs-enable-xamarin-configure-your-new-project.png" alt-text="Screenshot that shows how to configure your new project in Visual Studio." lightbox="~/articles/ai-services/speech-service/media/sdk/vs-enable-xamarin-configure-your-new-project.png":::

1. In the **New Cross Platform App** window, select the **Blank** template, and then select **Create**.

   :::image type="content" source="~/articles/ai-services/speech-service/media/sdk/qs-csharp-xamarin-new-xamarin-project.png" alt-text="Screenshot that shows the New Mobile App Xamarin Forms Project dialog box in Visual Studio." lightbox="~/articles/ai-services/speech-service/media/sdk/qs-csharp-xamarin-new-xamarin-project.png":::

1. In **Platform**, select the boxes for **Android**, **iOS**, and **Windows (UWP)**.

1. Select **OK**. You return to the Visual Studio IDE, with the new project created and visible in the **Solution Explorer** pane.

   :::image type="content" source="~/articles/ai-services/speech-service/media/sdk/vs-enable-xamarin-helloworld.png" alt-text="Screenshot that shows the helloworld project visible in Visual Studio." lightbox="~/articles/ai-services/speech-service/media/sdk/vs-enable-xamarin-helloworld.png":::

1. Select your target platform architecture and startup project. On the Visual Studio toolbar, find the **Solution Platforms** dropdown box. If you don't see it, select **View** > **Toolbars** > **Standard** to display the toolbar that contains **Solution Platforms**.

   If you're running 64-bit Windows, select **x64** in the drop-down box. You can select **x86** if you want because 64-bit Windows also can run 32-bit applications.

   In the **Start-up Projects** dropdown box, select **helloworld.UWP (Universal Windows)**.

#### Install the Speech SDK for Xamarin

Install the [Speech SDK NuGet package](https://aka.ms/csspeech/nuget), and reference the Speech SDK in your project:

1. In **Solution Explorer**, right-click your solution. Select **Manage NuGet Packages for Solution** to go to the **NuGet - Solution** window.

1. Select **Browse**.

1. In **Package source**, select **nuget.org**.

   :::image type="content" source="~/articles/ai-services/speech-service/media/sdk/vs-enable-uwp-nuget-solution-browse.png" alt-text="Screenshot of the Manage Packages for Solution dialog box when you're installing the Speech SDK." lightbox="~/articles/ai-services/speech-service/media/sdk/vs-enable-uwp-nuget-solution-browse.png":::

1. In the **Search** box, enter **Microsoft.CognitiveServices.Speech**. Then select that package after it appears in the search results.

   > [!NOTE]
   > The iOS library inside **Microsoft.CognitiveServices.Speech** NuGet doesn't have bitcode enabled. If you need the bitcode library enabled for your application, use **Microsoft.CognitiveServices.Speech.Xamarin.iOS** NuGet for the iOS project specifically.

1. In the package status pane next to the search results, select all projects: **helloworld**, **helloworld.Android**, **helloworld.iOS**, and **helloworld.UWP**.

1. Select **Install**.

   :::image type="content" source="~/articles/ai-services/speech-service/media/sdk/qs-csharp-xamarin-nuget-install.png" alt-text="Screenshot that highlights the Microsoft.CognitiveServices.Speech package." lightbox="~/articles/ai-services/speech-service/media/sdk/qs-csharp-xamarin-nuget-install.png":::

1. In the **Preview Changes** dialog box, select **OK**.

1. In the **License Acceptance** dialog box, view the license, and then select **I Accept**. Install the Speech SDK package reference to all projects.

   After installation finishes successfully, you might see the following warning for **helloworld.iOS**. This warning is a known issue and shouldn't affect your app's functionality.

   ```output
   Could not resolve reference "C:\Users\Default\.nuget\packages\microsoft.cognitiveservices.speech\1.7.0\build\Xamarin.iOS\libMicrosoft.CognitiveServices.Speech.core.a". If this reference is required by your code, you may get compilation errors.
   ```

The Speech SDK is now installed. You can now delete or reuse the **helloworld** project that you created in the previous steps.
