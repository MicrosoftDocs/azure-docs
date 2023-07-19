---
title: 'Speech SDK for .NET Framework (Windows) platform setup - Speech service'
titleSuffix: Azure AI services
description: 'Use this guide to set up your platform for C# under the .NET Framework for Windows with the Speech SDK.'
services: cognitive-services
author: markamos
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 06/11/2022
ms.author: eur
ms.custom: devx-track-dotnet, ignite-fall-2021
---

This guide shows how to install the [Speech SDK](~/articles/ai-services/speech-service/speech-sdk.md) for a .NET Framework (Windows) console app. 

### Prerequisites

This guide requires:

* [Microsoft Visual C++ Redistributable for Visual Studio 2019](https://support.microsoft.com/topic/the-latest-supported-visual-c-downloads-2647da03-1eea-4433-9aff-95f26a218cc0) for the Windows platform. Installing it for the first time might require a restart.
* [Visual Studio 2019](https://visualstudio.microsoft.com/downloads/).

### Create a Visual Studio project and install the Speech SDK

You need to install the [Speech SDK NuGet package](https://aka.ms/csspeech/nuget) so you can reference it in your code. To do that, you might first need to create a **helloworld** project. If you already have a project with the **.NET desktop development** workload available, you can use that project and skip to [Use NuGet Package Manager to install the Speech SDK](#use-nuget-package-manager-to-install-the-speech-sdk).

#### Create a helloworld project

1. Open Visual Studio 2019.

1. In the **Start** window, select **Create a new project**. 

1. In the **Create a new project** window, choose **Console App (.NET Framework)**, and then select **Next**.

1. In the **Configure your new project** window, enter **helloworld** in **Project name**, choose or create the directory path in **Location**, and then select **Create**.

1. From the Visual Studio menu bar, select **Tools** > **Get Tools and Features**. This step opens Visual Studio Installer and displays the **Modifying** dialog.

1. Check whether the **.NET desktop development** workload is available. If the workload hasn't been installed, select the check box next to it, and then select **Modify** to start the installation. It might take a few minutes to download and install.

   If the check box next to **.NET desktop development** is already selected, select **Close** to close the dialog.

   ![Screenshot that shows enabling .NET desktop development.](~/articles/ai-services/speech-service/media/sdk/vs-enable-net-desktop-workload.png)

1. Close Visual Studio Installer.

#### Use NuGet Package Manager to install the Speech SDK

1. In Solution Explorer, right-click the **helloworld** project, and then select **Manage NuGet Packages** to show NuGet Package Manager.   

1. In the upper-right corner, find the **Package Source** drop-down box, and make sure that **nuget.org** is selected.

   ![Screenshot that shows NuGet Package Manager.](~/articles/ai-services/speech-service/media/sdk/vs-nuget-package-manager.png)

1. In the upper-left corner, select **Browse**.

1. In the search box, type **Microsoft.CognitiveServices.Speech** and select **Enter**.

1. From the search results, select the **Microsoft.CognitiveServices.Speech** package, and then select **Install** to install the latest stable version.

   ![Screenshot that shows installing the Microsoft.CognitiveServices.Speech NuGet package.](~/articles/ai-services/speech-service/media/sdk/qs-csharp-dotnet-windows-03-nuget-install-1.0.0.png)

1. Accept all agreements and licenses to start the installation.

   After the package is installed, a confirmation appears in the **Package Manager Console** window.

#### Choose target architecture

To build and run the console application, create a platform configuration that matches your computer's architecture.

1. From the menu bar, select **Build** > **Configuration Manager**. The **Configuration Manager** dialog appears.   

1. In the **Active solution platform** drop-down box, select **New**. The **New Solution Platform** dialog appears.

   ![Screenshot that shows the Configuration Manager dialog.](~/articles/ai-services/speech-service/media/sdk/vs-configuration-manager-dialog-box.png)

1. In the **Type or select the new platform** drop-down box:
   - If you're running 64-bit Windows, select **x64**.
   - If you're running 32-bit Windows, select **x86**.

1. Select **OK** and then **Close**.

