---
author: wolfma61
ms.service: cognitive-services
ms.topic: include
ms.date: 09/13/2018
ms.author: wolfma
---

1. Start Visual Studio 2017.

1. From the menu bar in Visual Studio, select **Tools > Get Tools** and make sure that the **.NET desktop development** workload is available. If the workload hasn't been installed, mark the checkbox, then click **Modify** to start the installation. It may take a few minutes to download and install.

   If the checkbox next to **.NET desktop development** is selected, you can close the dialog box now.

   ![Enable .NET desktop development](~/articles/cognitive-services/speech-service/media/sdk/vs-enable-net-desktop-workload.png)

1. Next, let's create a project. From the menu bar select **File > New > Project**. When the dialog box appears, from the left panel expand these sections **Installed > Visual C# > Windows Desktop** and select **Console App (.NET Framework)**. Name this project *helloworld*.

    ![Create Visual C# Console App (.NET Framework)](~/articles/cognitive-services/speech-service/media/sdk/qs-csharp-dotnet-windows-01-new-console-app.png "Create Visual C# Console App (.NET Framework)")

1. Now that the project is set up, we need to install the [Speech SDK NuGet package](https://aka.ms/csspeech/nuget) and reference it in our code. Locate the Solution Explorer and right-click on helloworld. From the menu, select **Manage NuGet Packages...**.

   ![Right-click Manage NuGet Packages for Solution](~/articles/cognitive-services/speech-service/media/sdk/qs-csharp-dotnet-windows-02-manage-nuget-packages.png "Manage NuGet Packages for Solution")

1. In the upper-right corner of the NuGet Package Manager, locate the **Package Source** dropdown and make sure that **nuget.org** is selected. Then, select **Browse** and search for the `Microsoft.CognitiveServices.Speech` package and install the latest stable version.

   ![Install Microsoft.CognitiveServices.Speech NuGet Package](~/articles/cognitive-services/speech-service/media/sdk/qs-csharp-dotnet-windows-03-nuget-install-1.0.0.png "Install NuGet package")

1. Accept all agreements and licenses to start the installation.

   ![Accept the license](~/articles/cognitive-services/speech-service/media/sdk/qs-csharp-dotnet-windows-04-nuget-license.png "Accept the license")

    After the package is installed, a confirmation appears in the Package Manager console.

1. The next step is to create a platform configuration that matches the architecture of the computer you're using to build and run the console application. From the menu bar, select **Build** > **Configuration Manager...**.

    ![Launch the configuration manager](~/articles/cognitive-services/speech-service/media/sdk/qs-csharp-dotnet-windows-05-cfg-manager-click.png "Launch the configuration manager")

1. In the **Configuration Manager** dialog box, locate the **Active solution platform** drop-down list, and select **New**.

    ![Add a new platform under the configuration manager window](~/articles/cognitive-services/speech-service/media/sdk/qs-csharp-dotnet-windows-06-cfg-manager-new.png "Add a new platform under the configuration manager window")

1. If you are running 64-bit Windows, when prompted with **Type or select the new platform**, `x64`. If you are running 32-bit Windows, select `x86`. When you're finished, click **OK**.

    ![On 64-bit Windows, add a new platform named "x64"](~/articles/cognitive-services/speech-service/media/sdk/qs-csharp-dotnet-windows-07-cfg-manager-add-x64.png "Add x64 platform")
