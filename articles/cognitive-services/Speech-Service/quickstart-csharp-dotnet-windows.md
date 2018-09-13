---
title: 'Quickstart: Recognize speech in C# under .NET Framework on Windows by using the Cognitive Services Speech SDK'
titleSuffix: "Microsoft Cognitive Services"
description: Learn how to recognize speech in C# under .NET Framework on Windows by using the Cognitive Services Speech SDK
services: cognitive-services
author: wolfma61

ms.service: cognitive-services
ms.component: speech-service
ms.topic: quickstart
ms.date: 08/28/2018
ms.author: wolfma
---

# Quickstart: Recognize speech in C# under .NET Framework on Windows by using the Speech SDK

[!INCLUDE [Selector](../../../includes/cognitive-services-speech-service-quickstart-selector.md)]

In this article, you create a C# console application for .NET Framework on Windows by using the [Speech SDK](speech-sdk.md). You transcribe speech to text in real time from your PC's microphone. The application is built with the [Speech SDK NuGet package](https://aka.ms/csspeech/nuget) and Microsoft Visual Studio 2017 (any edition).

## Prerequisites

You need a Speech service subscription key to complete this Quickstart. You can get one for free. See [Try the Speech service for free](get-started.md) for details.

## Create a Visual Studio project

1. Start Visual Studio 2017.
 
1. Make sure the **.NET desktop environment** workload is available. Choose **Tools** > **Get Tools and Features** from the Visual Studio menu bar to open the Visual Studio installer. If this workload is already enabled, close the dialog box. 

    Otherwise, select the box next to **.NET desktop development**, and select**Modify** at the lower right corner of the dialog box. Installation of the new feature will take a moment.

    ![Screenshot of Visual Studio installer, with Workloads tab highlighted](media/sdk/vs-enable-net-desktop-workload.png)

1. Create a new Visual C# Console App. In the **New Project** dialog box, from the left pane, expand **Installed** > **Visual C#** > **Windows Desktop**. Then choose **Console App (.NET Framework)**. For the project name, enter *helloworld*.

    ![Screenshot of New Project dialog box](media/sdk/qs-csharp-dotnet-windows-01-new-console-app.png "Create Visual C# Console App (.NET Framework)")

1. Install and reference the [Speech SDK NuGet package](https://aka.ms/csspeech/nuget). In Solution Explorer, right-click the solution, and select **Manage NuGet Packages for Solution**.

    ![Screenshot of Solution Explorer, with Manage NuGet Packages for Solution highlighted](media/sdk/qs-csharp-dotnet-windows-02-manage-nuget-packages.png "Manage NuGet Packages for Solution")

1. In the upper-right corner, in the **Package Source** field, select **Nuget.org**. Search for the `Microsoft.CognitiveServices.Speech` package, and install it into the **helloworld** project.

    ![Screenshot of Manage Packages for Solution dialog box](media/sdk/qs-csharp-dotnet-windows-03-nuget-install-0.5.0.png "Install Nuget package")

1. Accept the displayed license to begin installation of the NuGet package.

    ![Screenshot of License Acceptance dialog box](media/sdk/qs-csharp-dotnet-windows-04-nuget-license.png "Accept the license")

    After the package is installed, a confirmation appears in the Package Manager console.

1. Using Configuration Manager, create a platform configuration matching your PC architecture. Select **Build** > **Configuration Manager**.

    ![Screenshot of Visual Studio application, with Build and Configuration Manager highlighted](media/sdk/qs-csharp-dotnet-windows-05-cfg-manager-click.png "Launch the configuration manager")

1. In the **Configuration Manager** dialog box, add a new platform. From the **Active solution platform** drop-down list, select **New**.

    ![Screenshot of Configuration Manager dialog box, with New highlighted](media/sdk/qs-csharp-dotnet-windows-06-cfg-manager-new.png "Add a new platform under the configuration manager window")

1. If you are running 64-bit Windows, create a new platform configuration named `x64`. If you are running 32-bit Windows, create a new platform configuration named `x86`.

    ![Screenshot of New Solution Platform dialog box, with x64 highlighted](media/sdk/qs-csharp-dotnet-windows-07-cfg-manager-add-x64.png "Add x64 platform")


## Add sample code

1. Open `Program.cs`, and replace all the code in it with the following.

    [!code-csharp[Quickstart Code](~/samples-cognitive-services-speech-sdk/quickstart/csharp-dotnet-windows/helloworld/Program.cs#code)]

1. In the same file, replace the string `YourSubscriptionKey` with your Speech service subscription key.

1. Also replace the string `YourServiceRegion` with the [region](regions.md) associated with your subscription (for example, `westus` for the free trial subscription).

1. Save changes to the project.

## Build and run the app

1. Build the application. From the menu bar, select **Build** > **Build Solution**. The code should compile without errors now.

    ![Screenshot of Visual Studio application, with Build Solution option highlighted](media/sdk/qs-csharp-dotnet-windows-08-build.png "Successful build")

1. Start the application. From the menu bar, select **Debug** > **Start Debugging**, or press **F5**.

    ![Screenshot of Visual Studio application, with Start Debugging option highlighted](media/sdk/qs-csharp-dotnet-windows-09-start-debugging.png "Start the app into debugging")

1. A console window appears, prompting you to say something. Speak an English phrase or sentence. Your speech is transmitted to the Speech service and transcribed to text, which appears in the same window.

    ![Screenshot of console output after successful recognition](media/sdk/qs-csharp-dotnet-windows-10-console-output.png "Console output after successful recognition")

[!INCLUDE [Download this sample](../../../includes/cognitive-services-speech-service-speech-sdk-sample-download-h2.md)]
Look for this sample in the `quickstart/csharp-dotnet-windows` folder.

## Next steps

> [!div class="nextstepaction"]
> [Recognize intents from speech by using the Speech SDK for C#](how-to-recognize-intents-from-speech-csharp.md)

## See also

- [Translate speech](how-to-translate-speech-csharp.md)
- [Customize acoustic models](how-to-customize-acoustic-models.md)
- [Customize language models](how-to-customize-language-model.md)
