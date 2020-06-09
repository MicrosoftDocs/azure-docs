---
title: Deploy native C++ tutorial to Hololens
description: Quickstart that shows how to run the native C++ tutorial to Hololens
author: florianborn71
ms.author: flborn
ms.date: 06/08/2020
ms.topic: quickstart
---

# Quickstart: Deploy native C++ sample to HoloLens

This quickstart covers how to deploy and run the native C++ tutorial to a HoloLens 2.

In this quickstart you will learn how to:

> [!div class="checklist"]
>
>* Build the tutorial app for HoloLens
>* Deploy the sample to the device
>* Run the sample on the device

## Prerequisites

To get access to the Azure Remote Rendering service, you first need to [create an account](../../how-tos/create-an-account.md).

The following software must be installed:

* Windows SDK 10.0.18362.0 [(download)](https://developer.microsoft.com/windows/downloads/windows-10-sdk)
* The latest version of Visual Studio 2019 [(download)](https://visualstudio.microsoft.com/vs/older-downloads/)
* [Visual Studio tools for Mixed Reality](https://docs.microsoft.com/windows/mixed-reality/install-the-tools). Specifically, the following *Workload* installations are mandatory:
  * **Desktop development with C++**
  * **Universal Windows Platform (UWP) development**
* GIT [(download)](https://git-scm.com/downloads)
* Unity 2019.3.1 [(download)](https://unity3d.com/get-unity/download)
  * Install these modules in Unity:
    * **UWP** - Universal Windows Platform Build Support
    * **IL2CPP** - Windows Build Support (IL2CPP)


## Clone the sample app

Open a command prompt (type `cmd` in the Windows start menu) and change to a directory where you want to store the ARR sample project.

Run the following commands:

```cmd
mkdir ARR
cd ARR
git clone https://github.com/Azure/azure-remote-rendering
```

The last command creates a subdirectory in the ARR directory containing the various sample projects for Azure Remote Rendering.

The quickstart sample app for Unity is found in the subdirectory *Unity/Quickstart*.

















## Build the sample project

1. Open *File > Build Settings*.
1. Change *Platform* to **Universal Windows Platform**
1. Set *Target Device* to **HoloLens**
1. Set *Architecture* to **ARM64**
1. Set *Build Type* to **D3D Project**
    ![Build settings](./media/unity-build-settings.png)
1. Select **Switch to Platform**
1. When pressing **Build** (or 'Build And Run'), you will be asked to select some folder where the solution should be stored
1. Open the generated **Quickstart.sln** with Visual Studio
1. Change the configuration to **Release** and **ARM64**
1. Switch the debugger mode to **Remote Machine**
    ![Solution configuration](media/unity-deploy-config.png)
1. Build the solution (F7)
1. For the project 'Quickstart', go to *Properties > Debugging*
    1. Make sure the configuration *Release* is active
    1. Set *Debugger to Launch* to **Remote Machine**
    1. Change *Machine Name* to the **IP of your HoleLens**

## Launch the sample project

1. Connect the HoloLens with a USB cable to your PC.
1. Start the Debugger in Visual Studio (F5). It will automatically deploy the app to the device.

The sample app should launch and then start a new session. After a while, the session is ready and the remotely rendered model will appear in front of you.
If you want to launch the sample a second time later, you can also find it from the HoloLens start menu now.

## Next steps

In the next quickstart, we will take a look at converting a custom model.

> [!div class="nextstepaction"]
> [Quickstart: Convert a model for rendering](convert-model.md)
