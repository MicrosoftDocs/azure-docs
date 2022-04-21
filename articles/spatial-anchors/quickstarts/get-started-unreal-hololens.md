---
title: 'Quickstart: Create a HoloLens app with Unreal'
description: In this quickstart, you learn how to build a HoloLens app with Unreal using Spatial Anchors.
author: jacksonf
services: azure-spatial-anchors
ms.author: jacksonf
ms.date: 04/20/2022
ms.topic: quickstart
ms.service: azure-spatial-anchors
ms.custom: mode-other, devx-track-azurecli 
ms.devlang: azurecli
---
# Run the sample app: HoloLens - Unreal

In this quickstart, you'll run the [Azure Spatial Anchors](../overview.md) sample app for HoloLens using Unreal. Spatial Anchors is a cross-platform developer service that allows you to create mixed reality experiences with objects that persist their location across devices over time. When you're finished, you'll have a HoloLens app built with Unreal that can save and recall a spatial anchor.

You'll learn how to:

- Create a Spatial Anchors account.
- Prepare Unreal build settings.
- Configure the Spatial Anchors account identifier and account key.
- Deploy the app and run it on a HoloLens device.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

To complete this quickstart:

- You need a HoloLens device. [Windows 10 May 2020 Update or later](/windows/mixed-reality/whats-new/release-notes-may-2020) must be installed on the device. To update to the latest release on HoloLens, open the **Settings** app, go to **Update & Security**, and then select **Check for updates**.
- You need a Windows computer with <a href="https://www.visualstudio.com/downloads/" target="_blank">Visual Studio 2019</a> or later installed. Your Visual Studio installation must include the **Universal Windows Platform development** workload and the **Windows 10 SDK (10.0.18362.0 or newer)** component. You must also install <a href="https://git-scm.com/download/win" target="_blank">Git for Windows</a>.
- You need to have <a href="https://www.unrealengine.com/get-now" target="_blank">Unreal Engine</a> version 4.26 or newer, with the <a href="https://docs.microsoft.com/en-us/windows/mixed-reality/develop/unreal/unreal-project-setup" target="_blank">HoloLens 2 installation options</a> installed.

## Create a Spatial Anchors resource

[!INCLUDE [Create Spatial Anchors resource](../../../includes/spatial-anchors-get-started-create-resource.md)]

## Download sample project

Clone the <a href="https://github.com/microsoft/Microsoft-OpenXR-Unreal/tree/main" target="_blank">OpenXR sample project</a> by running the following commands:

```console
git clone https://github.com/microsoft/Microsoft-OpenXR-Unreal.git
cd ./Microsoft-OpenXR-Unreal
```

> [!NOTE] 
> If using Unreal 5.0, use the <a href="https://github.com/microsoft/Microsoft-OpenXR-Unreal/tree/5.0" target="_blank">5.0 branch</a>.

## Configure Unreal
Navigate to the MsftOpenXRGame directory in the repository you just cloned.  Right click on MsftOpenXRGame.uproject and select **"Switch Unreal Engine version..."**.  Select the engine version you are using from the dropdown and click **"OK"**.  This will generate a Visual Studio solution.

> [!NOTE] 
> You may need to modify the **"EngineVersion"** string in **MsftOpenXRGame/Plugins/MicrosoftOpenXR/MicrosoftOpenXR.uplugin** to match the engine version you are using.
> See instructions on the sample's [GitHub page]("https://github.com/microsoft/Microsoft-OpenXR-Unreal#use-the-plugin-from-github-source").

Open and run this solution to launch the sample in the Unreal editor.

Follow the instructions [here]("../how-tos/setup-unreal-project") to ensure the Unreal project is setup with the proper plugins, build settings, and capabilities.

## Configure the account information
The next step is to configure the app to use your account information. You copied the **Account Key**, **Account ID**, and **Account Domain** values to a text editor earlier, in the ["Create a Spatial Anchors resource"](#create-a-spatial-anchors-resource) section.

In the sample application, double click on the **MRPlayerPawn** asset in the **Content Browser**.  Then double click on the **StartASA** function in the bottom left of the MRPlayerPawn Blueprint.  Navigate to the **Make AzureSpatialAnchorSessionConfiguration** node off of the **Config Session 2** node.

Set the Account Id, Account Key, and Account Domain fields from the corresponding values copied earlier.

Compile and save the Blueprint.

## Build and Deploy the HoloLens application

Select **File > Package Project > HoloLens** and select a folder for the appx.

In the device portal, <a href="https://docs.microsoft.com/en-us/windows/mixed-reality/develop/advanced-concepts/using-the-windows-device-portal#installing-an-app" target="_blank">Deploy the appxbundle</a> you just packaged.  If this is the first Unreal app you are deploying to your HoloLens, ensure the **Allow me to select framework packages** checkbox is enabled and also deploy **Microsoft.VCLibs.arm64.14.00.appx**

In the app, airtap with your right hand to create local spatial anchors represented by a pin asset where you selected.

Then say the voice command **Upload Anchors** to save these anchors as Azure Spatial Anchors.  When the pin assets have turned green, they have successfully uploaded.

Close and reopen the application to see the saved anchors load into the scene.

[!INCLUDE [Clean-up section](../../../includes/clean-up-section-portal.md)]

## Next steps
In this quickstart, you created a Spatial Anchors account. You then configured and deployed an app to save and recall spatial anchors.  To learn more about how to add Azure Spatial Anchor support to your own Unreal application, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Tutorial: Create your own Unreal app](../tutorials/tutorial-new-unreal-hololens-app.md)