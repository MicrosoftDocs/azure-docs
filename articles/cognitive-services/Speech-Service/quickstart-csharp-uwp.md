---
title: 'Quickstart: Recognize speech in C# in a UWP app the Cognitive Services Speech SDK | Microsoft Docs'
titleSuffix: "Microsoft Cognitive Services"
description: Learn how to recognize speech in a UWP app using the Cognitive Services Speech SDK
services: cognitive-services
author: wolfma61
manager: onano

ms.service: cognitive-services
ms.component: speech-service
ms.topic: article
ms.date: 07/16/2018
ms.author: wolfma
---

# Quickstart: Recognize speech in a UWP app using the Speech SDK

In this article, you learn how to create a Universal Windows Platform (UWP) application using the Cognitive Services Speech SDK to transcribe speech to text.
The application is based on the [Microsoft Cognitive Services Speech SDK NuGet Package](https://aka.ms/csspeech/nuget) and Microsoft Visual Studio 2017.

> [!NOTE]
> UWP apps built with the Speech SDK do not yet pass the Windows App Certification Kit (WACK).
> Side-loading of apps is possible, submitting an app to Windows Store is not.
> This will be fixed in a upcoming release.

## Prerequisites

* A subscription key for the Speech service. See [Try the speech service for free](get-started.md).
* A Windows PC (Windows 10 Fall Creators Update or later) with a working microphone.
* [Microsoft Visual Studio 2017](https://www.visualstudio.com/), Community Edition or higher.
* The **Universal Windows Platform development** workload in Visual Studio.You can enable it in **Tools** \> **Get Tools and Features**.

  ![Enable Universal Windows Platform development](media/sdk/vs-enable-uwp-workload.png)

## Create a Visual Studio project

1. In Visual Studio 2017, create a new Visual C# Windows Universal Blank App. In the **New Project** dialog box, from the left pane, expand **Installed** \> **Visual C#** \> **Windows Universal** and then select **Blank App (Universal Windows)**. For the project name, enter *helloworld*.

    ![](media/sdk/qs-csharp-uwp-01-new-blank-app.png)

1. In the **New Universal Windows Platform Project** window that pops up, choose **Windows 10 Fall Creators Update (10.0; Build 16299)** as **Minimum version**, and this or any later version as **Target version**, then click **OK**.

    ![](media/sdk/qs-csharp-uwp-02-new-uwp-project.png)

1. If you're running on a 64-bit Windows installation, you may switch your build platform to `x64`:

   ![Switch the build platform to x64](media/sdk/qs-csharp-uwp-03-switch-to-x64.png)

   > [!NOTE]
   > At this time, the Speech SDK does not support to target ARM processors.

1. Install and reference the [Speech SDK NuGet package](https://aka.ms/csspeech/nuget). In the Solution Explorer, right-click the solution and select **Manage NuGet Packages for Solution**.

    ![Right-click Manage NuGet Packages for Solution](media/sdk/qs-csharp-uwp-04-manage-nuget-packages.png)

1. In the upper-right corner, in the **Package Source** field, select **Nuget.org**. Search for and install the `Microsoft.CognitiveServices.Speech` package and install it into the **helloworld** project.

    ![Install Microsoft.CognitiveServices.Speech NuGet Package](media/sdk/qs-csharp-uwp-05-nuget-install-0.5.0.png "Install Nuget package")

1. In the license screen that pops up, accept the license:

    ![Accept the license](media/sdk/qs-csharp-uwp-06-nuget-license.png "Accept the license")

1. In the Package Manager console you should see the following output line:

   ```text
   Successfully installed 'Microsoft.CognitiveServices.Speech 0.5.0' to helloworld
   ```

## Add the sample code

1. In the Solution Explorer, double-click **Package.appxmanifest** to edit your application manifest.
   Select the **Capabilities** tab, select the checkbox for the **Microphone** capability, and save your changes.

   ![](media/sdk/qs-csharp-uwp-07-capabilities.png)

1. Edit your app UI by double-clicking `MainPage.xaml` in the Solution Explorer.
   When in the designer's XAML view, insert the following XAML snippet into the Grid tag (between `<Grid>` and `</Grid>`):

   [!code-xml[UI elements](~/samples-cognitive-services-speech-sdk/quickstart/csharp-uwp/helloworld/MainPage.xaml#StackPanel)]

1. Edit the XAML code-behind by double-clicking `MainPage.xaml.cs` in the Solution Explorer (it is grouped under the `MainPage.xaml` item).
   Replace all code with the following:

   [!code-csharp[Quickstart Code](~/samples-cognitive-services-speech-sdk/quickstart/csharp-uwp/helloworld/MainPage.xaml.cs#code)]

1. In the `SpeechRecognitionFromMicrophone_ButtonClicked` handler, replace the string `YourSubscriptionKey` with your subscription key.

1. In the `SpeechRecognitionFromMicrophone_ButtonClicked` handler, replace the string `YourServiceRegion` with the [region](regions.md) associated with your subscription (for example, `westus` for the free trial subscription).

1. Save all changes to the project.

## Build and run the sample

1. Build the application. From the menu bar, select **Build** > **Build Solution**. The code should compile without errors now:

    ![Successful build](media/sdk/qs-csharp-uwp-08-build.png "Successful build")

1. Start the application. From the menu bar, select **Debug** > **Start Debugging**, or press **F5**.

    ![Start the app into debugging](media/sdk/qs-csharp-uwp-09-start-debugging.png "Start the app into debugging")

1. A GUI window pops up. First click the **Enable Microphone** button and acknowledge the permission request that pops up.

    ![Start the app into debugging](media/sdk/qs-csharp-uwp-10-access-prompt.png "Start the app into debugging")

1. Then click the **Speech recognition with microphone input** and speak a short phrase into your microphone.
   The speech recognition result should be display in the GUI.

    ![](media/sdk/qs-csharp-uwp-11-ui-result.png)

[!include[Download the sample](../../../includes/cognitive-services-speech-service-speech-sdk-sample-download-h2.md)]
Look for this sample in the `quickstart/csharp-uwp` folder.

## Next steps

- [Translate speech](how-to-translate-speech.md)
- [Customize acoustic models](how-to-customize-acoustic-models.md)
- [Customize language models](how-to-customize-language-model.md)
