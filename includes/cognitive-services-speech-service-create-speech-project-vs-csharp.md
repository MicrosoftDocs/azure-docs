---
author: wolfma61
ms.service: cognitive-services
ms.topic: include
ms.date: 07/05/2019
ms.author: wolfma
---

1. Open Visual Studio 2019.

1. Select **Create a new project**. 

1. Select **Console App (.NET Framework)**, and then select **Next**.

1. In **Project name**, enter **helloworld**, and then select **Create**.

    ![Create Visual C# Console App (.NET Framework)](../articles/cognitive-services/speech-service/media/sdk/qs-csharp-dotnet-windows-01-new-console-app.png "Create Visual C# Console App (.NET Framework)")

1. From the menu bar in Visual Studio, select **Tools** > **Get Tools and Features**, and make sure that the **.NET desktop development** workload is available. If the workload hasn't been installed, mark the checkbox, then select **Modify** to start the installation. It may take a few minutes to download and install.

   If the checkbox next to **.NET desktop development** is selected, you can close the dialog box now.

   ![Enable .NET desktop development](../articles/cognitive-services/speech-service/media/sdk/vs-enable-net-desktop-workload.png)

The next step is to install the [Speech SDK NuGet package](https://aka.ms/csspeech/nuget), so you can reference it in the code.

1. In the Solution Explorer, right-click helloworld, and then select **Manage NuGet Packages** to show the NuGet Package Manager.

   ![Right-click Manage NuGet Packages for Solution](../articles/cognitive-services/speech-service/media/sdk/qs-csharp-dotnet-windows-02-manage-nuget-packages.png "Manage NuGet Packages for Solution")

1. In the upper-right corner, find the **Package Source** dropdown, and make sure that **nuget.org** is selected.

1. In the upper-left corner, select **Browse**.

1. In the search box, type `Microsoft.CognitiveServices.Speech` package and press Enter.

1. Select `Microsoft.CognitiveServices.Speech`, and then select **Install** to install the latest stable version.

   ![Install Microsoft.CognitiveServices.Speech NuGet Package](../articles/cognitive-services/speech-service/media/sdk/qs-csharp-dotnet-windows-03-nuget-install-1.0.0.png "Install NuGet package")

1. Accept all agreements and licenses to start the installation.

   ![Accept the license](../articles/cognitive-services/speech-service/media/sdk/qs-csharp-dotnet-windows-04-nuget-license.png "Accept the license")

    After the package is installed, a confirmation appears in the Package Manager console.

Now, to build and run the console application, create a platform configuration that matches the architecture of the computer you're using.

1. From the menu bar, select **Build** > **Configuration Manager**.

    ![Launch the configuration manager](../articles/cognitive-services/speech-service/media/sdk/qs-csharp-dotnet-windows-05-cfg-manager-click.png "Launch the configuration manager")

1. In the **Configuration Manager** dialog box, locate the **Active solution platform** drop-down list, and select **New**.

    ![Add a new platform under the configuration manager window](../articles/cognitive-services/speech-service/media/sdk/qs-csharp-dotnet-windows-06-cfg-manager-new.png "Add a new platform under the configuration manager window")

1. If you are running 64-bit Windows, when prompted with **Type or select the new platform**, enter `x64`. If you are running 32-bit Windows, select `x86`. When you're finished, select **OK**.

    ![On 64-bit Windows, add a new platform named "x64"](../articles/cognitive-services/speech-service/media/sdk/qs-csharp-dotnet-windows-07-cfg-manager-add-x64.png "Add x64 platform")
