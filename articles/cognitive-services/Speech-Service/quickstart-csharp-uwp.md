---
title: 'Quickstart: Recognize speech in C# in a UWP app using the Cognitive Services Speech SDK'
titleSuffix: "Microsoft Cognitive Services"
description: Learn how to recognize speech in a UWP app using the Cognitive Services Speech SDK
services: cognitive-services
author: wolfma61

ms.service: cognitive-services
ms.component: speech-service
ms.topic: quickstart
ms.date: 09/24/2018
ms.author: wolfma
---

# Quickstart: Recognize speech in a UWP app using the Speech SDK

[!INCLUDE [Selector](../../../includes/cognitive-services-speech-service-quickstart-selector.md)]

In this article, you create a C# Universal Windows Platform (UWP) application using the Cognitive Services [Speech SDK](speech-sdk.md) to transcribe speech to text in real time from your device's microphone. The application is built with the [Speech SDK NuGet Package](https://aka.ms/csspeech/nuget) and Microsoft Visual Studio 2017 (any edition).

> [!NOTE]
> The Universal Windows Platform lets you develop apps that run on any device that supports Windows 10, including PCs, Xbox, Surface Hub, and other devices.

## Prerequisites

You need a Speech service subscription key to complete this Quickstart. You can get one for free. See [Try the speech service for free](get-started.md) for details.

## Create Visual Studio project

1. Start Visual Studio 2017.

1. Make sure the **Universal Windows Platform development** workload is available. Choose **Tools** \> **Get Tools and Features** from the Visual Studio menu bar to open the Visual Studio installer. If this workload is already enabled, close the dialog. 

    ![Enable Universal Windows Platform development](media/sdk/vs-enable-uwp-workload.png)

    Otherwise, mark the checkbox next to **.NET cross-platform development,** then click the **Modify** button at the lower right corner of the dialog. Installation of the new feature takes a moment.

1. Create a blank Visual C# Universal Windows app. First, choose **File** \> **New** \> **Project** from the menu. In the **New Project** dialog, expand **Installed** \> **Visual C#** \> **Windows Universal** in the left pane, then select **Blank App (Universal Windows)**. For the project name, enter *helloworld*.

    ![](media/sdk/qs-csharp-uwp-01-new-blank-app.png)

1. The Speed SDK requires that your application be built for the Windows 10 Fall Creators Update or later. In the **New Universal Windows Platform Project** window that pops up, choose **Windows 10 Fall Creators Update (10.0; Build 16299)** as **Minimum version**, and this or any later version as **Target version**, then click **OK**.

    ![](media/sdk/qs-csharp-uwp-02-new-uwp-project.png)

1. If you're running 64-bit Windows, you may switch your build platform to `x64` using the drop-down menu in the Visual Studio toolbar. (64-bit Windows can run 32-bit applications, so you may leave it set to `x86` if you prefer.)

   ![Switch the build platform to x64](media/sdk/qs-csharp-uwp-03-switch-to-x64.png)

   > [!NOTE]
   > The Speech SDK supports Intel-compatible processors only. ARM is currently not supported.

1. Install and reference the [Speech SDK NuGet package](https://aka.ms/csspeech/nuget). In the Solution Explorer, right-click the solution and select **Manage NuGet Packages for Solution**.

    ![Right-click Manage NuGet Packages for Solution](media/sdk/qs-csharp-uwp-04-manage-nuget-packages.png)

1. In the upper-right corner, in the **Package Source** field, select **Nuget.org**. Search for the `Microsoft.CognitiveServices.Speech` package and install it into the **helloworld** project.

    ![Install Microsoft.CognitiveServices.Speech NuGet Package](media/sdk/qs-csharp-uwp-05-nuget-install-0.5.0.png "Install Nuget package")

1. Accept the displayed license to begin installation of the NuGet package.

    ![Accept the license](media/sdk/qs-csharp-uwp-06-nuget-license.png "Accept the license")

1. The following output line appears in the Package Manager console.

   ```text
   Successfully installed 'Microsoft.CognitiveServices.Speech 1.0.0' to helloworld
   ```

1. Since the application uses the microphone for speech input, add the **Microphone** capability to the project.

   In Solution Explorer, double-click **Package.appxmanifest** to edit your application manifest.
   Then switch to the **Capabilities** tab, mark the checkbox for the **Microphone** capability, and save your changes.

   ![](media/sdk/qs-csharp-uwp-07-capabilities.png)


## Add sample code

1. The application's user interface is defined using XAML. Open `MainPage.xaml` in the Solution Explorer. In the designer's XAML view, insert the following XAML snippet into the Grid tag (between `<Grid>` and `</Grid>`).

   [!code-xml[UI elements](~/samples-cognitive-services-speech-sdk/quickstart/csharp-uwp/helloworld/MainPage.xaml#StackPanel)]

1. Open the code-behind source file `MainPage.xaml.cs` (find it grouped under `MainPage.xaml`). Replace all the code in it with the following.

   [!code-csharp[Quickstart Code](~/samples-cognitive-services-speech-sdk/quickstart/csharp-uwp/helloworld/MainPage.xaml.cs#code)]

1. In the `SpeechRecognitionFromMicrophone_ButtonClicked` handler in this file, replace the string `YourSubscriptionKey` with your subscription key.

1. In the `SpeechRecognitionFromMicrophone_ButtonClicked` handler, replace the string `YourServiceRegion` with the [region](regions.md) associated with your subscription (for example, `westus` for the free trial subscription).

1. Save all changes to the project.

## Build and run the app

1. Build the application. From the menu bar, select **Build** > **Build Solution**. The code should compile without errors now.

    ![Successful build](media/sdk/qs-csharp-uwp-08-build.png "Successful build")

1. Start the application. From the menu bar, select **Debug** > **Start Debugging**, or press **F5**.

    ![Start the app into debugging](media/sdk/qs-csharp-uwp-09-start-debugging.png "Start the app into debugging")

1. A GUI window pops up. First click the **Enable Microphone** button and acknowledge the permission request that pops up.

    ![Start the app into debugging](media/sdk/qs-csharp-uwp-10-access-prompt.png "Start the app into debugging")

1. Click the **Speech recognition with microphone input** and speak an English phrase or sentence into your device's microphone. Your speech is transmitted to the Speech service and transcribed to text, which appears in the window.

    ![](media/sdk/qs-csharp-uwp-11-ui-result.png)

[!INCLUDE [Download this sample](../../../includes/cognitive-services-speech-service-speech-sdk-sample-download-h2.md)]
Look for this sample in the `quickstart/csharp-uwp` folder.

## Next steps

> [!div class="nextstepaction"]
> [Recognize intents from speech by using the Speech SDK for C#](how-to-recognize-intents-from-speech-csharp.md)

## See also

- [Translate speech](how-to-translate-speech-csharp.md)
- [Customize acoustic models](how-to-customize-acoustic-models.md)
- [Customize language models](how-to-customize-language-model.md)
