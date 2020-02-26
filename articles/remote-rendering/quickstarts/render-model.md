---
title: Render a model with Unity
description: Quickstart that guides the user through the steps to render a model
author: FlorianBorn71
ms.author: flborn
ms.date: 01/23/2020
ms.topic: quickstart
---

# Quickstart: Render a model with Unity

This quickstart covers how to run a Unity sample that renders a built-in model remotely, using the Azure Remote Rendering (ARR) service.

We won't go into detail about the ARR API itself or how to set up a new Unity project. Those topics are covered in [Tutorial: Setting up a Unity project from scratch](../tutorials/unity/project-setup.md).

In this quickstart you will learn how to:
> [!div class="checklist"]
>
>* Set up your local development environment
>* Get and build the ARR Quickstart sample app for Unity
>* Render a model in the ARR Quickstart sample app

## Prerequisites

To get access to the Azure Remote Rendering service, you first need to [create an account](../how-tos/create-an-account.md).

The following software must be installed:

* Windows SDK 10.0.18362.0 [(download)](https://developer.microsoft.com/windows/downloads/windows-10-sdk)
* The latest version of Visual Studio 2019 [(download)](https://visualstudio.microsoft.com/vs/older-downloads/)
* GIT [(download)](https://git-scm.com/downloads)
* Unity 2019.3.1 [(download)](https://unity3d.com/get-unity/download)
* The NuGet command-line tool and Credential Provider (see below)

### Installing NuGet

1. Go to [https://dev.azure.com/arrClient/arrClient](https://dev.azure.com/arrClient/arrClient).
1. Click on **Artifacts**, change the dropdown to **ArrPackages**, and click on **Connect to feed**.
  ![Connect to Feed 1](../overview/media/connect-to-feed.png)
1. Click on **Nuget.exe**, then **Get the tools**
  ![Connect to Feed 2](../overview/media/connect-to-feed-2.png)
1. From the link under *Step 1*, download the latest NuGet.exe (under *Windows x86 Commandline*)
1. Copy NuGet.exe to some folder and add the location to your `PATH` environment variable.
1. The page linked under *Step 2* describes how to install the NuGet Credential Provider. The [manual installation](https://github.com/microsoft/artifacts-credprovider#manual-installation-on-windows) is straight forward.
1. Open a **new** command prompt (if you had to change your `PATH` environment variable you cannot reuse an existing one).
1. Add the "arrPackages" feed with the following NuGet command:
  
    ```cmd
    NuGet.exe sources Add -Name "ArrPackages" -Source "https://pkgs.dev.azure.com/arrClient/_packaging/ArrPackages/nuget/v3/index.json"
    ```

## Clone the sample app

Open a command prompt (type `cmd` in the Windows start menu) and change to a directory where you want to store the ARR sample project.

Run the following commands:

```cmd
mkdir ARR
cd ARR
git clone https://dev.azure.com/arrClient/arrClient/_git/arrClient
```

The last command creates a subdirectory in the ARR directory containing the various sample projects for Azure Remote Rendering.

The quickstart sample app for Unity is found in the subdirectory *Unity/Quickstart* but **do not open it yet**:
It expects Unity packages to be present in directory beside it, which you need to first obtain using NuGet.

## Getting the Unity NuGet packages

You need to use NuGet commands to pull the packages from the ARR depot – from the same command prompt window within the ARR directory, run the following command:

```cmd
cd arrClient\Unity
nuget install com.microsoft.azure.remote_rendering -ExcludeVersion
```

If the NuGet command results in authentication prompts, make sure you have NuGet and the NuGet Credential Provider installed as described in the prerequisites above.

The command above will download a NuGet package, carrying a Unity package. This operation adds the following directory to your *ARR\arrClient\Unity* folder:

* *com.microsoft.azure.remote_rendering* - The Unity package, which provides the client functionality of Azure Remote Rendering

## Rendering a model with the Unity sample project

Open the Unity Hub and add the sample project, which is the *ARR\arrClient\Unity\Quickstart* folder.
Open the project. If necessary, allow Unity to upgrade the project to your installed version.

The default model we render is a [built-in sample model](../samples/sample-model.md). We will show how to convert a custom model using the ARR conversion service in the [next quickstart](convert-model.md).

### Enter your account info

1. In the Unity asset browser, navigate to the *Scenes* folder and open the **Quickstart** scene.
1. From the *Hierarchy*, select the **RemoteRendering** game object.
1. In the *Inspector*, enter your [account credentials](../how-tos/create-an-account.md).

![ARR Account Info](./media/arr-sample-account-info.png)

> [!IMPORTANT]
> Azure Portal displays your account's domain only as *mixedreality.azure.com*. This is insufficient for successfully connecting.
> Set **AccountDomain** to `<region>.mixedreality.azure.com`, where `<region>` is [one of the available regions](../reference/regions.md) that you already chose during account creation.

Later we want to deploy this project to a HoloLens and connect to the Remote Rendering service from that device. Since we have no easy way to enter the credentials on the device, the quickstart sample will **save the credentials in the Unity scene**.

> [!WARNING]
> Make sure to not check the project with your saved credentials into some repository where it would leak secret login information!

### Create a session and view the default model

Press Unity's **Play** button to start the session. You should see an overlay with status text, at the bottom of the viewport in the *Game* panel. The session will undergo a series of state transitions. In the **Starting** state, the remote VM is spun up, which takes several minutes. Upon success, it transitions to the **Ready** state. Now the session enters the **Connecting** state, where it tries to reach the rendering runtime on that VM. When successful, the sample transitions to the **Connected** state. At this point, it will start downloading the model for rendering. Because of the model's size, the download can take a few more minutes. Then the remotely rendered model will appear.

![Output from the sample](media/arr-sample-output.png)

Congratulations! You are now viewing a remotely rendered model!

## Inspecting the scene

Once the remote rendering connection is running, the Inspector panel updates with additional status information:

![Unity sample playing](./media/arr-sample-configure-session-running.png)

You can now explore the scene graph by selecting the new node and clicking **Show children** in the Inspector.

![Unity Hierarchy](./media/unity-hierarchy.png)

There is a [cut plane](../overview/features/cut-planes.md) object in the scene. Try enabling it in its properties and moving it around:

![Changing the cut plane](media/arr-sample-unity-cutplane.png)

To synchronize transforms, either click **Sync now** or check the **Sync every frame** option. For component properties, just changing them is enough.

## Next steps

In the next quickstart, we will deploy the sample to a HoloLens to view the remotely rendered model in its original size.

> [!div class="nextstepaction"]
> [Quickstart: Deploy Unity sample to HoloLens](deploy-to-hololens.md)
