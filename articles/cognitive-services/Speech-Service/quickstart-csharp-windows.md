---
title: 'Quickstart: Recognize speech using the Cognitive Services Speech C# SDK for Windows | Microsoft Docs'
description: Learn how to recognize speech using the C# SDK for Speech service.
titleSuffix: "Microsoft Cognitive Services"
services: cognitive-services
author: wolfma61
manager: onano

ms.service: cognitive-services
ms.component: speech-service
ms.topic: article
ms.date: 05/07/2018
ms.author: wolfma
---
# Quickstart: Recognize speech using the Cognitive Services Speech C# SDK

In this article, you learn how to create a C# console application in Windows using the Cognitive Services Speech SDK to transcribe speech to text.

## Prerequisites

* A subscription key for the Speech service. See [Try the speech service for free](get-started.md).
* Visual Studio 2017, Community Edition or higher.
* The **.NET desktop development** workload in Visual Studio. You can enable it in **Tools** \> **Get Tools and Features**. 

## Create a Visual Studio project

1. In Visual Studio 2017, create a new Visual C# Console App. In the **New Project** dialog box, from the left pane, expand **Installed** and then select **Console App (.NET Framework)**. For the project name, enter *CsharpHelloSpeech*.

    ![Create Visual C# Console App (.NET Framework)](media/sdk/speechsdk-05-vs-cs-new-console-app.png "Create Visual C# Console App")

2. Install and reference the [Speech SDK NuGet package](https://aka.ms/csspeech/nuget). In the Solution Explorer, right-click the solution and select **Manage NuGet Packages for Solution**.

    ![Right-click Manage NuGet Packages for Solution](media/sdk/speechsdk-06-vs-cs-manage-nuget-packages.png "Manage NuGet Packages for Solution")

3. In the upper-right corner, in the **Package Source** field, select **Nuget.org**. Search for and install the `Microsoft.CognitiveServices.Speech` package and install it into the **CsharpHelloSpeech** project.

    ![Install Microsoft.CognitiveServices.Speech NuGet Package](media/sdk/speechsdk-08-vs-cs-nuget-install.png "Install Nuget package")

4. In the license screen that pops up, accept the license:

    ![Accept the license](media/sdk/speechsdk-09-vs-cs-nuget-license.png "Accept the license")

## Create a platform configuration matching your PC architecture

In this section, you add a new platform to the configuration that matches your processor architecture.

1. Start the Configuration Manager. Select **Build** > **Configuration Manager**.

    ![Launch the configuration manager](media/sdk/speechsdk-12-vs-cs-cfg-manager-click.png "Launch the configuration manager")

2. In the **Configuration Manager** dialog box, add a new platform. From the **Active solution platform** drop-down list, select **New**.

    ![Add a new platform under the configuration manager window](media/sdk/speechsdk-14-vs-cs-cfg-manager-new.png "Add a new platform under the configuration manager window")

3. If you are running 64-bit Windows, create a new platform configuration named `x64`. If you are running 32-bit Windows, create a new platform configuration named `x86`. In this article, you create an `x64` platform configuration. 

    ![On 64-bit Windows, add a new platform named "x64"](media/sdk/speechsdk-15-vs-cs-cfg-manager-add-x64.png "Add x64 platform")

## Add the sample code

1. In the `Program.cs` for your Visual Studio project, replace the body of the `Program` class with the following. Make sure you replace the subscription key and region with one that you obtained for the service.

    [!code-csharp[Quickstart Code](~/samples-cognitive-services-speech-sdk/Windows/quickstart-csharp/Program.cs#code)]

2. After pasting the code, the `Main()` method must resemble as shown in the following screenshot:

    ![Main method after pasting the code](media/sdk/speechsdk-17-vs-cs-paste-code.png "Final Main method")

3. Visual Studio's IntelliSense highlights the references to the Speech SDK's classes that could not be resolved. To fix this error, add the following `using` statement to the beginning of the code (either manually, or using Visual Studio's [quick actions](https://docs.microsoft.com/visualstudio/ide/quick-actions)).

    [!code-cpp[Quickstart Code](~/samples-cognitive-services-speech-sdk/Windows/quickstart-csharp/Program.cs#usingstatement)]

    ![Use the quick action to add the missing using statement](media/sdk/speechsdk-18-vs-cs-add-using.png "Resolve IntelliSense issues")

4. Make sure that the IntelliSense highlighting is resolved and save changes to the project.

## Build and run the sample

1. Build the application. From the menu bar, select **Build** > **Build Solution**. The code should compile without errors now:

    ![Successful build](media/sdk/speechsdk-20-vs-cs-build.png "Successful build")

2. Start the application. From the menu bar, select **Debug** > **Start Debugging**, or press **F5**. 

    ![Start the app into debugging](media/sdk/speechsdk-21-vs-cs-f5.png "Start the app into debugging")

3. A console window pops up, prompting you to say something (in English).
The result of the recognition is displayed on screen.

    ![Console output after successful recognition](media/sdk/speechsdk-22-cs-vs-console-output.png "Console output after successful recognition")

## Download code

For the latest set of samples, see the [Cognitive Services Speech SDK Sample GitHub repository](https://aka.ms/csspeech/samples).

## Next steps

- [Translate speech](how-to-translate-speech.md)
- [Customize acoustic models](how-to-customize-acoustic-models.md)
- [Customize language models](how-to-customize-language-model.md)
