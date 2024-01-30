---
title: Deploy native C++ Windows Mixed Reality tutorial to HoloLens
description: In this quickstart, learn to run the native C++ HolographicApp tutorial on HoloLens. Build the tutorial application, change credentials, and run the sample.
author: florianborn71
ms.author: flborn
ms.date: 06/08/2020
ms.topic: quickstart
ms.custom:
- mode-api
- kr2b-contr-experiment
---

# Quickstart: Deploy native C++ WMR sample to HoloLens

This quickstart covers how to deploy and run the native C++ Windows Mixed Reality (WMR) tutorial application on a HoloLens 2.

In this quickstart you'll learn how to:

> [!div class="checklist"]
>
>* Build the tutorial application for HoloLens.
>* Change the Azure Remote Rendering credentials in the source code.
>* Deploy and run the sample on the device.

## Prerequisites

To get access to the Remote Rendering service, you first need to [create an account](../../../how-tos/create-an-account.md).

The following software must be installed:

* [Windows SDK 10.0.18362.0](https://developer.microsoft.com/windows/downloads/windows-10-sdk) or later.
* [The latest version of Visual Studio 2022](https://visualstudio.microsoft.com/vs/).
* [Visual Studio tools for Mixed Reality](/windows/mixed-reality/install-the-tools). Specifically, the following *Workload* installations are required:
  * **Desktop development with C++**
  * **Universal Windows Platform (UWP) development**
* [Git](https://git-scm.com/downloads).
* [Git LFS plugin](https://git-lfs.github.com/)

## Clone the Remote Rendering samples repository

As a first step, clone the Git repository, which houses the global Azure Remote Rendering samples. Type `cmd` in the Windows Start menu to open a command prompt window. Change to a directory where you want to store the ARR sample project.

Run the following commands:

```cmd
mkdir ARR
cd ARR
git clone https://github.com/Azure/azure-remote-rendering
```

The last command creates a folder in the ARR folder that contains the various sample projects for Azure Remote Rendering.

The C++ HoloLens tutorial can be found in the folder *NativeCpp/HoloLens-Wmr*.

## Build the project

Open the solution file *HolographicApp.sln* located in the *NativeCpp/HoloLens-Wmr* folder with Visual Studio.

Switch the build configuration to *Debug* (or *Release*) and *ARM64*. Make sure the debugger mode is set to *Device* as opposed to *Remote Machine*:

![Screenshot shows the Visual Studio configuration area with values as described.](media/vs-config-native-cpp-tutorial.png)

Since the account credentials are hardcoded in the tutorial's source code, change them to valid credentials. Open the file *HolographicAppMain.cpp* inside Visual Studio and change the part where the client is created inside the constructor of class `HolographicAppMain`:

```cpp
// 2. Create Client
{
    // Users need to fill out the following with their account data and model
    RR::SessionConfiguration init;
    init.AccountId = "00000000-0000-0000-0000-000000000000";
    init.AccountKey = "<account key>";
    init.RemoteRenderingDomain = "westus2.mixedreality.azure.com"; // <change to the region that the rendering session should be created in>
    init.AccountDomain = "westus2.mixedreality.azure.com"; // <change to the region the account was created in>
    m_modelURI = "builtin://Engine";
    m_sessionOverride = ""; // If there is a valid session ID to re-use, put it here. Otherwise a new one is created
    m_client = RR::ApiHandle(RR::RemoteRenderingClient(init));
}
```

Specifically, change the following values:

* `init.AccountId`, `init.AccountKey`, and `init.AccountDomain` to use your account data. See the section about how to [retrieve account information](../../../how-tos/create-an-account.md#retrieve-the-account-information).
* Specify where to create the remote rendering session by modifying the region part of the `init.RemoteRenderingDomain` string for other [regions](../../../reference/regions.md) than `westus2`, for instance `"westeurope.mixedreality.azure.com"`.
* In addition, `m_sessionOverride` can be changed to an existing session ID. Sessions can be created outside this sample. For more information, see [RenderingSession.ps1](../../../samples/powershell-example-scripts.md#script-renderingsessionps1) or [Use the session management REST API](../../../how-tos/session-rest-api.md) directly.

Creating a session outside the sample is recommended when the sample should run multiple times. If no session is passed in, the sample creates a session upon each startup, which may take several minutes.

Now you can compile the application.

## Launch the application

1. Connect the HoloLens with a USB cable to your PC.
1. Turn on the HoloLens and wait until the start menu shows up.
1. Start the Debugger in Visual Studio (F5). It automatically deploys the app to the device.

The sample app launches and a text panel appears that informs you about the current application state. The status at startup time is either starting a new session or connecting to an existing session. After model loading finishes, the built-in engine model appears right at your head position. Occlusion-wise, the engine model interacts properly with the spinning cube that is rendered locally.

 If you want to launch the sample again later, you can also find it from the HoloLens start menu. It might have an expired session ID compiled into it.

## Next steps

This quickstart is based on the outcome of a tutorial that explains how to integrate all Remote Rendering related pieces into a stock *Holographic App*. To learn which steps are necessary, follow this tutorial:

> [!div class="nextstepaction"]
> [Tutorial: Integrate Remote Rendering into a HoloLens Holographic App](../../../tutorials/native-cpp/hololens/integrate-remote-rendering-into-holographic-app.md)
