---
<<<<<<< HEAD
title: 'Quickstart: Recognize speech in C++ on Windows Desktop by using the Cognitive Services Speech SDK'
=======
title: 'Quickstart: Recognize speech in C++ on Windows using the Cognitive Services Speech SDK'
>>>>>>> b9088cd86088b17653d810cbf24318d09e4d9a32
titleSuffix: "Microsoft Cognitive Services"
description: Learn how to recognize speech in C++ on Windows Desktop by using the Cognitive Services Speech SDK
services: cognitive-services
author: wolfma61

ms.service: cognitive-services
ms.technology: Speech
ms.topic: quickstart
ms.date: 08/28/2018
ms.author: wolfma
---

<<<<<<< HEAD
# Quickstart: Recognize speech in C++ on Windows Desktop by using the Speech SDK

[!INCLUDE [Selector](../../../includes/cognitive-services-speech-service-quickstart-selector.md)]

In this article, you learn how to create a C++-based console application for Windows Desktop that makes use of the Speech SDK.
The application is based on the [Microsoft Cognitive Services Speech SDK NuGet Package](https://aka.ms/csspeech/nuget) and Microsoft Visual Studio 2017.

## Prerequisites

* A subscription key for the Speech service. See [Try the Speech service for free](get-started.md).
* A Windows PC with a working microphone.
* [Microsoft Visual Studio 2017](https://www.visualstudio.com/), Community Edition, or later.
* The Desktop development with C++ workload in Visual Studio, and the NuGet package manager component in Visual Studio.
  You can enable both in **Tools** > **Get Tools and Features**, under the **Workloads** and **Individual components** tabs, respectively:

  ![Screenshot of Workloads tab in Visual Studio](media/sdk/vs-enable-cpp-workload.png)

  ![Screenshot of Individual components tab in Visual Studio](media/sdk/vs-enable-nuget-package-manager.png)
=======
# Quickstart: Recognize speech in C++ on Windows using the Speech SDK

[!INCLUDE [Selector](../../../includes/cognitive-services-speech-service-quickstart-selector.md)]

In this article, you create a C++ console application for Windows using the Cognitive Services [Speech SDK](speech-sdk.md) to transcribe speech to text in real time from your PC's microphone. The application is built with the [Speech SDK NuGet package](https://aka.ms/csspeech/nuget) and Microsoft Visual Studio 2017 (any edition).

## Prerequisites

You need a Speech service subscription key to complete this Quickstart. You can get one for free. See [Try the speech service for free](get-started.md) for details.

## Create Visual Studio project

1. Start Visual Studio 2017.
>>>>>>> b9088cd86088b17653d810cbf24318d09e4d9a32

1. Make sure the **Desktop development with C++** workload is available. Choose **Tools** \> **Get Tools and Features** from the Visual Studio menu bar to open the Visual Studio installer. If this workload is already enabled, skip to the next step. 

<<<<<<< HEAD
In Visual Studio 2017, create a new Visual C++ Windows Desktop Windows Console Application. In the **New Project** dialog box, from the left pane, expand **Installed** \> **Visual C++** \> **Windows Desktop**. Then select **Windows Console Application**. For the project name, enter *helloworld*.

![Screenshot of New Project dialog box](media/sdk/qs-cpp-windows-01-new-console-app.png)
=======
    ![Enable Desktop development with C++ workload](media/sdk/vs-enable-cpp-workload.png)

    Otherwise, mark the checkbox next to **Desktop development with C++,** 
>>>>>>> b9088cd86088b17653d810cbf24318d09e4d9a32

1. Make sure the **NuGet package manager** component is available. Switch to the Individual Components tab of the Visual Studio installer dialog and mark the **NuGet package manager** checkbox if it is not already enabled.

<<<<<<< HEAD
![Screenshot of build platform drop-down list, with x64 option highlighted](media/sdk/qs-cpp-windows-02-switch-to-x64.png)
=======
      ![Enable NuGet package manager in Visual Studio ](media/sdk/vs-enable-nuget-package-manager.png)
>>>>>>> b9088cd86088b17653d810cbf24318d09e4d9a32

1. If you needed to enable either the C++ workload or NuGet, click the **Modify** button at the lower right corner of the dialog. Installation of the new features takes a moment. If both features were already enabled, close the dialog instead.

<<<<<<< HEAD
In the Solution Explorer, right-click the solution, and select **Manage NuGet Packages for Solution**.

![Screenshot of Solution Explorer, with Manage NuGet Packages for Solution highlighted](media/sdk/qs-cpp-windows-03-manage-nuget-packages.png)

In the upper-right corner, in the **Package Source** field, choose "Nuget.org".
From the **Browse** tab, search for the "Microsoft.CognitiveServices.Speech" package, and select it. Check the **Project** and **helloworld** boxes on the right, and select **Install** to install it into the helloworld project.
=======
1. Create a new Visual C++ Windows Desktop Windows console Application. First, choose **File** \> **New** \> **Project** from the menu. In the **New Project** dialog, expand **Installed** \> **Visual C++** \> **Windows Desktop** in the left pane, then select **Windows Console Application**. For the project name, enter *helloworld*.

    ![Create Visual C++ Windows Desktop Windows Console Application](media/sdk/qs-cpp-windows-01-new-console-app.png)

1. If you're running 64-bit Windows, you may switch your build platform to `x64` using the drop-down menu in the Visual Studio toolbar. (64-bit versions of Windows can run 32-bit applications, so this is not a requirement.)
>>>>>>> b9088cd86088b17653d810cbf24318d09e4d9a32

    ![Switch the build platform to x64](media/sdk/qs-cpp-windows-02-switch-to-x64.png)

<<<<<<< HEAD
![Screenshot of Microsoft.CognitiveServices.Speech NuGet Package](media/sdk/qs-cpp-windows-04-nuget-install-0.5.0.png)

On the **License Acceptance** dialog box, accept the license:

![Screenshot of License Acceptance dialog box](media/sdk/qs-cpp-windows-05-nuget-license.png)
=======
1. In Solution Explorer, right-click the solution and choose **Manage NuGet Packages for Solution**.

    ![Right-click Manage NuGet Packages for Solution](media/sdk/qs-cpp-windows-03-manage-nuget-packages.png)

1. In the upper-right corner, in the **Package Source** field, select **Nuget.org**. Search for the `Microsoft.CognitiveServices.Speech` package and install it into the **helloworld** project.
>>>>>>> b9088cd86088b17653d810cbf24318d09e4d9a32

    ![Install Microsoft.CognitiveServices.Speech NuGet Package](media/sdk/qs-cpp-windows-04-nuget-install-0.5.0.png)

1. Accept the displayed license to begin installation of the NuGet package.

    ![Accept the license](media/sdk/qs-cpp-windows-05-nuget-license.png)

After the package is installed, a confirmation appears in the Package Manager console.

## Add sample code

1. Open the source file *helloworld.cpp*. Replace all the code in it with the following.

   [!code-cpp[Quickstart Code](~/samples-cognitive-services-speech-sdk/quickstart/cpp-windows/helloworld/helloworld.cpp#code)]

1. In the same file, replace the string `YourSubscriptionKey` with your subscription key.

1. Also replace the string `YourServiceRegion` with the [region](regions.md) associated with your subscription (for example, `westus` for the free trial subscription).

1. Save changes to the project.

## Build and run the app

1. Build the application. From the menu bar, choose **Build** > **Build Solution**. The code should compile without errors.

   ![Screenshot of Visual Studio application, with Build Solution option highlighted](media/sdk/qs-cpp-windows-06-build.png)

1. Start the application. From the menu bar, choose **Debug** > **Start Debugging**, or press **F5**.

   ![Screenshot of Visual Studio application, with Start Debugging option highlighted](media/sdk/qs-cpp-windows-07-start-debugging.png)

<<<<<<< HEAD
1. A console window appears, prompting you to say something (in English).
   The result of the recognition is displayed on screen.
=======
1. A console window appears, prompting you to say something. Speak an English phrase or sentence. Your speech is transmitted to the Speech service and transcribed to text, which appears in the same window.
>>>>>>> b9088cd86088b17653d810cbf24318d09e4d9a32

   ![Screenshot of console output after successful recognition](media/sdk/qs-cpp-windows-08-console-output-release.png)

[!INCLUDE [Download this sample](../../../includes/cognitive-services-speech-service-speech-sdk-sample-download-h2.md)]
Look for this sample in the `quickstart/cpp-windows` folder.

## Next steps

> [!div class="nextstepaction"]
> [Recognize intents from speech by using the Speech SDK for C#](how-to-recognize-intents-from-speech-csharp.md)

## See also

- [Translate speech](how-to-translate-speech-csharp.md)
- [Customize acoustic models](how-to-customize-acoustic-models.md)
- [Customize language models](how-to-customize-language-model.md)
