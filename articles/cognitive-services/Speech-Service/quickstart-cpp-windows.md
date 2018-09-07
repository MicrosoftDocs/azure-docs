---
title: 'Quickstart: Recognize speech in C++ on Windows Desktop by using the Cognitive Services Speech SDK'
titleSuffix: "Microsoft Cognitive Services"
description: Learn how to recognize speech in C++ on Windows Desktop by using the Cognitive Services Speech SDK
services: cognitive-services
author: wolfma61

ms.service: cognitive-services
ms.technology: Speech
ms.topic: article
ms.date: 07/16/2018
ms.author: wolfma
---

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

## Create a Visual Studio project

In Visual Studio 2017, create a new Visual C++ Windows Desktop Windows Console Application. In the **New Project** dialog box, from the left pane, expand **Installed** \> **Visual C++** \> **Windows Desktop**. Then select **Windows Console Application**. For the project name, enter *helloworld*.

![Screenshot of New Project dialog box](media/sdk/qs-cpp-windows-01-new-console-app.png)

If you're running on a 64-bit Windows installation, optionally switch your build platform to `x64`:

![Screenshot of build platform drop-down list, with x64 option highlighted](media/sdk/qs-cpp-windows-02-switch-to-x64.png)

## Install and reference the Speech SDK NuGet package

In the Solution Explorer, right-click the solution, and select **Manage NuGet Packages for Solution**.

![Screenshot of Solution Explorer, with Manage NuGet Packages for Solution highlighted](media/sdk/qs-cpp-windows-03-manage-nuget-packages.png)

In the upper-right corner, in the **Package Source** field, choose "Nuget.org".
From the **Browse** tab, search for the "Microsoft.CognitiveServices.Speech" package, and select it. Check the **Project** and **helloworld** boxes on the right, and select **Install** to install it into the helloworld project.

> [!NOTE]
> The current version of the Cognitive Services Speech SDK is `0.6.0`.

![Screenshot of Microsoft.CognitiveServices.Speech NuGet Package](media/sdk/qs-cpp-windows-04-nuget-install-0.5.0.png)

On the **License Acceptance** dialog box, accept the license:

![Screenshot of License Acceptance dialog box](media/sdk/qs-cpp-windows-05-nuget-license.png)

## Add the sample code

1. Replace your default starter code with the following one:

   [!code-cpp[Quickstart Code](~/samples-cognitive-services-speech-sdk/quickstart/cpp-windows/helloworld/helloworld.cpp#code)]

1. Replace the string `YourSubscriptionKey` with your subscription key.

1. Replace the string `YourServiceRegion` with the [region](regions.md) associated with your subscription (for example, `westus` for the free trial subscription).

1. Save changes to the project.

## Build and run the sample

1. Build the application. From the menu bar, select **Build** > **Build Solution**. The code should compile without errors now:

   ![Screenshot of Visual Studio application, with Build Solution option highlighted](media/sdk/qs-cpp-windows-06-build.png)

1. Start the application. From the menu bar, select **Debug** > **Start Debugging**, or press **F5**.

   ![Screenshot of Visual Studio application, with Start Debugging option highlighted](media/sdk/qs-cpp-windows-07-start-debugging.png)

1. A console window appears, prompting you to say something (in English).
   The result of the recognition is displayed on screen.

   ![Screenshot of console output after successful recognition](media/sdk/qs-cpp-windows-08-console-output-release.png)

[!INCLUDE [Download the sample](../../../includes/cognitive-services-speech-service-speech-sdk-sample-download-h2.md)]
Look for this sample in the `quickstart/cpp-windows` folder.

## Next steps

* [Get our samples](speech-sdk.md#get-the-samples)
