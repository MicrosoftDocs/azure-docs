---
author: erhopf
ms.service: cognitive-services
ms.topic: include
ms.date: 10/15/2020
ms.author: erhopf
---

To create a Visual Studio project for cross-platform mobile app development with .NET and Xamarin, you need to:
- Set up Visual Studio development options.
- Create the project and select the target architecture. 
- Install the Speech SDK.

### Set up Visual Studio development options

To start, make sure you're set up correctly in Visual Studio for cross-platform mobile development with .NET:

1. Open Visual Studio 2019.

1. From the Visual Studio menu bar, select **Tools** > **Get Tools and Features** to open Visual Studio Installer and view the **Modifying** dialog.
   
1. On the **Workloads** tab, under **Windows**, find the **Mobile development with .NET** workload. If the check box next to that workload is already selected, close the **Modifying** dialog and go to step 6.

   ![Screenshot that shows the Workloads tab, the Modifying dialog, and Visual Studio Installer.](../articles/cognitive-services/Speech-Service/media/sdk/vs-enable-xamarin-workload.png)

1. Select the **Mobile development with .NET** check box, and then select **Modify**. 

1. In the **Before we get started** dialog, select **Continue** to install the workload for mobile development with .NET. Installation of the new feature might take a while.

1. Close Visual Studio Installer.

### Create the project

Next, create your project and select the target architecture:

1. On the Visual Studio menu bar, select **File** > **New** > **Project** to display the **Create a new project** window.   

1. Find and select **Mobile App (Xamarin.Forms)**.

1. Select **Next**.

   ![Screenshot that shows how to create a new project in Visual Studio.](../articles/cognitive-services/Speech-Service/media/sdk/vs-enable-xamarin-create-new-project.png)   

1. In the **Configure your new project** dialog, in **Project name**, enter **helloworld**.

1. In **Location**, go to and select or create the folder where you want to save your project.

1. Select **Create**.

   ![Screenshot that shows how to configure your new project in Visual Studio.](../articles/cognitive-services/Speech-Service/media/sdk/vs-enable-xamarin-configure-your-new-project.png)   

1. In the **New Cross Platform App** window, select the **Blank** template, and then select **OK**.

   ![Screenshot that shows the New Mobile App Xamarin Forms Project dialog in Visual Studio.](../articles/cognitive-services/Speech-Service/media/sdk/qs-csharp-xamarin-new-xamarin-project.png)

1. In **Platform**, select the boxes for **Android**, **iOS**, and **Windows (UWP)**.

1. Select **OK**. You're returned to the Visual Studio IDE, with the new project created and visible in the **Solution Explorer** pane.

   ![Screenshot that shows the helloworld project visible in Visual Studio.](../articles/cognitive-services/Speech-Service/media/sdk/vs-enable-xamarin-helloworld.png)

1. Select your target platform architecture and startup project. On the Visual Studio toolbar, find the **Solution Platforms** drop-down box. If you don't see it, select **View** > **Toolbars** > **Standard** to display the toolbar that contains **Solution Platforms**. 

   If you're running 64-bit Windows, select **x64** in the drop-down box. You can select **x86** if you want because 64-bit Windows also can run 32-bit applications. 
   
   In the **Start-up Projects** drop-down box, select **helloworld.UWP (Universal Windows)**.

### Install the Speech SDK

Install the [Speech SDK NuGet package](https://aka.ms/csspeech/nuget), and reference the Speech SDK in your project:

1. In **Solution Explorer**, right-click your solution. Select **Manage NuGet Packages for Solution** to go to the **NuGet - Solution** window.

1. Select **Browse**.   

1. In **Package source**, select **nuget.org**.

   ![Screenshot of the Manage Packages for Solution dialog when you're installing the Speech SDK.](../articles/cognitive-services/Speech-Service/media/sdk/vs-enable-uwp-nuget-solution-browse.png)

1. In the **Search** box, enter **Microsoft.CognitiveServices.Speech**. Then select that package after it appears in the search results.   

   > [!NOTE] 
   > The iOS library inside **Microsoft.CognitiveServices.Speech** NuGet doesn't have bitcode enabled. If you need the bitcode library enabled for your application, use **Microsoft.CognitiveServices.Speech.Xamarin.iOS** NuGet for the iOS project specifically.

1. In the package status pane next to the search results, select all projects: **helloworld**, **helloworld.Android**, **helloworld.iOS**, and **helloworld.UWP**.

1. Select **Install**.

   ![Screenshot that highlights the Microsoft.CognitiveServices.Speech package.](../articles/cognitive-services/Speech-Service/media/sdk/qs-csharp-xamarin-nuget-install.png)

1. In the **Preview Changes** dialog, select **OK**.

1. In the **License Acceptance** dialog, view the license, and then select **I Accept**. Install the Speech SDK package reference to all projects. 

   After installation finishes successfully, you might see the following warning for **helloworld.iOS**. This is a known issue and should not affect your app's functionality.

   `Could not resolve reference "C:\Users\Default\.nuget\packages\microsoft.cognitiveservices.speech\1.7.0\build\Xamarin.iOS\libMicrosoft.CognitiveServices.Speech.core.a". If this reference is required by your code, you may get compilation errors.`
