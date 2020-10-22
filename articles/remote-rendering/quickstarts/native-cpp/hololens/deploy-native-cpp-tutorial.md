---
title: Deploy native C++ tutorial to HoloLens
description: Quickstart that shows how to run the native C++ tutorial on HoloLens
author: florianborn71
ms.author: flborn
ms.date: 06/08/2020
ms.topic: quickstart
---

# Quickstart: Deploy native C++ sample to HoloLens

This quickstart covers how to deploy and run the native C++ tutorial application on a HoloLens 2.

In this quickstart you will learn how to:

> [!div class="checklist"]
>
>* Build the tutorial application for HoloLens.
>* Change the ARR credentials in the source code.
>* Deploy and run the sample on the device.

## Prerequisites

To get access to the Azure Remote Rendering service, you first need to [create an account](../../../how-tos/create-an-account.md).

The following software must be installed:

* Windows SDK 10.0.18362.0 [(download)](https://developer.microsoft.com/windows/downloads/windows-10-sdk)
* The latest version of Visual Studio 2019 [(download)](https://visualstudio.microsoft.com/vs/older-downloads/)
* [Visual Studio tools for Mixed Reality](/windows/mixed-reality/install-the-tools). Specifically, the following *Workload* installations are mandatory:
  * **Desktop development with C++**
  * **Universal Windows Platform (UWP) development**
* GIT [(download)](https://git-scm.com/downloads)

## Clone the ARR samples repository

As a first step, we clone the Git repository, which houses the public Azure Remote Rendering samples. Open a command prompt (type `cmd` in the Windows start menu) and change to a directory where you want to store the ARR sample project.

Run the following commands:

```cmd
mkdir ARR
cd ARR
git clone https://github.com/Azure/azure-remote-rendering
```

The last command creates a subdirectory in the ARR directory containing the various sample projects for Azure Remote Rendering.

The C++ HoloLens tutorial can be found in the subdirectory *NativeCpp/HoloLens*.

## Build the project

Open the solution file *HolographicApp.sln* located in the *NativeCpp/HoloLens* subdirectory with Visual Studio 2019.

Switch the build configuration to *Debug* (or *Release*) and *ARM64*. Also make sure the debugger mode is set to *Device* as opposed to *Remote Machine*:

![Visual Studio config](media/vs-config-native-cpp-tutorial.png)

Since the account credentials are hardcoded in the tutorial's source code, change them to valid credentials. For that, open file `HolographicAppMain.cpp` inside Visual Studio and change the part where the frontend is created inside the constructor of class `HolographicAppMain`:

```cpp
// 2. Create front end
{
    // Users need to fill out the following with their account data and model
    RR::AzureFrontendAccountInfo init;
    init.AccountId = "00000000-0000-0000-0000-000000000000";
    init.AccountKey = "<account key>";
    init.AccountDomain = "westus2.mixedreality.azure.com"; // <change to your region>
    m_modelURI = "builtin://Engine";
    m_sessionOverride = ""; // If there is a valid session ID to re-use, put it here. Otherwise a new one is created
    m_frontEnd = RR::ApiHandle(RR::AzureFrontend(init));
}
```

Specifically, change the following values:
* `init.AccountId` and `init.AccountKey` to use your account data. See paragraph about how to [retrieve account information](../../../how-tos/create-an-account.md#retrieve-the-account-information).
* The region part of the `init.AccountDomain` string for other regions than `westus2`, for instance `"westeurope.mixedreality.azure.com"`
* In addition, `m_sessionOverride` can be changed to an existing session ID. Sessions can be created outside this sample, for instance by using [the powershell script](../../../samples/powershell-example-scripts.md#script-renderingsessionps1) or using the [session REST API](../../../how-tos/session-rest-api.md#create-a-session) directly.
Creating a session outside the sample is recommended when the sample should run multiple times. If no session is passed in, the sample will create a new session upon each startup, which may take several minutes.

Now the application can be compiled.

## Launch the application

1. Connect the HoloLens with a USB cable to your PC.
1. Turn on the HoloLens and wait until the start menu shows up.
1. Start the Debugger in Visual Studio (F5). It will automatically deploy the app to the device.

The sample app should launch and a text panel should appear that informs you about the current application state. The status at startup time is either starting a new session or connecting to an existing session. After model loading has completed, the built-in engine model appears right at your head position. Occlusion-wise, the engine model interacts properly with the spinning cube that is rendered locally.

 If you want to launch the sample a second time later, you can also find it from the HoloLens start menu, but note it may have an expired session ID compiled into it.

## Next steps

This quickstart is based on the outcome of a tutorial that explains how to integrate all Remote Rendering related pieces into a stock *Holographic App*. To learn which steps are necessary, follow this tutorial:

> [!div class="nextstepaction"]
> [Tutorial: Integrate Remote Rendering into a HoloLens Holographic App](../../../tutorials/native-cpp/hololens/integrate-remote-rendering-into-holographic-app.md)