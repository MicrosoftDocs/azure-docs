---
title: 'Quickstart: Speech SDK for .NET Framework (Windows) platform setup - Speech service'
titleSuffix: Azure Cognitive Services
description: Use this guide to set up your platform for C# under .NET Framework for Windows with the Speech service SDK.
services: cognitive-services
author: markamos
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 10/10/2019
ms.author: erhopf
---

This guide shows how to install the [Speech SDK](~/articles/cognitive-services/speech-service/speech-sdk.md) for .NET Framework (Windows). If you just want the package name to get started on your own, run `Install-Package Microsoft.CognitiveServices.Speech` in the NuGet console.

[!INCLUDE [License Notice](~/includes/cognitive-services-speech-service-license-notice.md)]

## Prerequisites

This quickstart requires:

* [Visual Studio 2019](https://visualstudio.microsoft.com/downloads/)

## Create a Visual Studio project and install the Speech SDK

You'll need to install the [Speech SDK NuGet package](https://aka.ms/csspeech/nuget) so you can reference it in your code. To do that, you may first need to create a **helloworld** project. If you already have a project with the **.NET desktop development** workload available, you can use that project and skip to [Use NuGet Package Manager to install the Speech SDK](#use-nuget-package-manager-to-install-the-speech-sdk).

### Create helloworld project

1. Open Visual Studio 2019.

1. In the Start window, select **Create a new project**. 

1. In the **Create a new project** window, choose **Console App (.NET Framework)**, and then select **Next**.

1. In the **Configure your new project** window, enter *helloworld* in **Project name**, choose or create the directory path in **Location**, and then select **Create**.

1. From the Visual Studio menu bar, select **Tools** > **Get Tools and Features**, which opens Visual Studio Installer and displays the **Modifying** dialog box.

1. Check whether the **.NET desktop development** workload is available. If the workload hasn't been installed, select the check box next to it, and then select **Modify** to start the installation. It may take a few minutes to download and install.

   If the check box next to **.NET desktop development** is already selected, select **Close** to exit the dialog box.

   ![Enable .NET desktop development](~/articles/cognitive-services/speech-service/media/sdk/vs-enable-net-desktop-workload.png)

1. Close Visual Studio Installer.

### Use NuGet Package Manager to install the Speech SDK

1. In the Solution Explorer, right-click the **helloworld** project, and then select **Manage NuGet Packages** to show the NuGet Package Manager.

   ![NuGet Package Manager](~/articles/cognitive-services/speech-service/media/sdk/vs-nuget-package-manager.png)

1. In the upper-right corner, find the **Package Source** drop-down box, and make sure that **`nuget.org`** is selected.

1. In the upper-left corner, select **Browse**.

1. In the search box, type *Microsoft.CognitiveServices.Speech* and select **Enter**.

1. From the search results, select the **Microsoft.CognitiveServices.Speech** package, and then select **Install** to install the latest stable version.

   ![Install Microsoft.CognitiveServices.Speech NuGet package](~/articles/cognitive-services/speech-service/media/sdk/qs-csharp-dotnet-windows-03-nuget-install-1.0.0.png)

1. Accept all agreements and licenses to start the installation.

   After the package is installed, a confirmation appears in the **Package Manager Console** window.

### Choose target architecture

To build and run the console application, create a platform configuration matching your computer's architecture.

1. From the menu bar, select **Build** > **Configuration Manager**. The **Configuration Manager** dialog box appears.

   ![Configuration Manager dialog box](~/articles/cognitive-services/speech-service/media/sdk/vs-configuration-manager-dialog-box.png)

1. In the **Active solution platform** drop-down box, select **New**. The **New Solution Platform** dialog box appears.

1. In the **Type or select the new platform** drop-down box:
   - If you're running 64-bit Windows, select **x64**.
   - If you're running 32-bit Windows, select **x86**.

1. Select **OK** and then **Close**.

## Next steps

[!INCLUDE [windows](../quickstart-list.md)]
