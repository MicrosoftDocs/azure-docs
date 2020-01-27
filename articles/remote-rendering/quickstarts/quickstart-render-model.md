---
title: Render a model with Unity
description: Tutorial that guides the user through the steps to render a model with Azure Remote Rendering
author: FlorianBorn71
manager: jlyons
services: azure-remote-rendering
ms.author: flborn
ms.date: 01/23/2020
ms.topic: quickstart
ms.service: azure-remote-rendering
---

# Quickstart: Render a model with Unity

This quickstart covers how to run a Unity sample that renders a built-in model remotely, using the Azure Remote Rendering (ARR) service.

We won't go into detail about the ARR API itself or how to set up a Unity project from scratch. To learn how to set up a Unity project and adding relevant ARR API calls to the scripts, refer to [Tutorial-1: Getting started](../tutorials/tutorial-1-getting-started.md).

In this quickstart you will learn how to:
> [!div class="checklist"]
>
>- Set up your local development environment
>- Get and build the Unity sample app
>- Render a model in the Unity sample app

## Prerequisites

The following software must be installed:

- Windows SDK 10.0.18362.0 [(download)](https://developer.microsoft.com/windows/downloads/windows-10-sdk "Windows SDK")
- The latest version of Visual Studio 2017 [(download)](https://visualstudio.microsoft.com/vs/older-downloads/ "Visual Studio 2017")
- GIT [(download)](https://git-scm.com/downloads "GIT")
- Unity 2019.3 [(download)](https://unity3d.com/get-unity/download "Unity")
- The NuGet command line and companion credential manager:
  - Go to [this site](https://dev.azure.com/arrClient/arrClient).
  - Click on *Artifacts*, change the dropdown to *ArrPackages*, and click on *Connect to feed*.

  ![Connect to Feed](./media/connect-to-feed.png "Connect to Feed")

  - Download the NuGet command-line tool and the Credential Provider package from the link displayed.
  - Extract to a directory of your choice and add the location to your `PATH` environment variable.
    - Add the "arrPackages" feed with the following NuGet command:
        `NuGet.exe sources Add -Name "ArrPackages" -Source "https://pkgs.dev.azure.com/arrClient/_packaging/ArrPackages/nuget/v3/index.json"`

## Clone the sample app

Open a command prompt (type `cmd` in the Windows start menu) and change to a directory where you want to store your ARR project.

Run the following commands:

1. `mkdir ARR`
1. `cd ARR`
1. `git clone https://dev.azure.com/arrClient/arrClient/_git/arrClient`

The last command creates a directory called *arrClient* in your ARR directory. It contains the sample app and a copy of the documentation.

The sample Unity app is found in the subdirectory *Unity/AzureRemoteRenderingSample* but **do not open it yet!** The project requires Unity packages to be present, which you need to obtain first.

## Obtaining the Unity NuGet packages

We will pull the Unity packages from the ARR depot using NuGet. Type the following commands into your command prompt:

1. `cd arrClient\Unity`
1. `nuget install com.microsoft.azure.remote_rendering -ExcludeVersion`
1. `nuget install ScriptableRenderPipeline -ExcludeVersion`

If the NuGet command results in authentication prompts, make sure you are using the NuGet companion credential manager from the prerequisites steps.

Afterwards there is a new directory *ARR/ArrClient/Unity*, containing three subfolders:

- *AzureRemoteRenderingSample* - The sample project
- *com.microsoft.azure.remote_rendering* - The Unity package, which provides the client functionality of Azure Remote Rendering
- *ScriptableRenderPipeline* - A customized version of Unity's scriptable render pipeline

## Rendering a built-in model

The first model we render will be a built-in model provided by ARR. We will show how to convert a custom model in the next quickstart.

Launch the Unity Hub and add the folder *ARR\arrClient\Unity\AzureRemoteRenderingSample* as a Unity project.
Open the project. Allow Unity to upgrade the project to your installed version, if necessary.

### Enter your account info

Select the *RemoteRendering* dropdown menu and open the *AccountInfo* window. Enter your account credentials.

![ARR Account Info](./media/arr-sample-account-info.png "ARR Account Info")

You only need to set the *AccountDomain* and *Account Id/Key* values. You can ignore the two fields under *Account Token*.

These credentials will be saved to Unity's editor preferences.

### Create a session and view the default model

From Unity's asset browser, open the scene **SampleScene**. Then select the **RRRoot** node:

![Unity Scene Tree](./media/unity-scene.png "Unity Scene Tree")

Selecting the **RRRoot** node shows the following properties in the Inspector panel:

![Unity Configure Sample Not Playing](./media/arr-sample-configure-session.png "Unity Configure Sample Not Playing")

Now press Unity's **Play** button to start the session.
If the account has been set up correctly, then the Inspector panel updates with additional status information at the bottom:

![Unity Configure Sample Playing](./media/arr-sample-configure-session-running.png "Unity Configure Sample Playing")

The session will undergo a series of state transitions. In the **Starting** state the remote VM is spun up, which may take several minutes. Upon success, it transitions to the **Ready** state. Now the session enters the **Connecting** state, where it tries to reach the rendering runtime on that VM. When successful, it finally transitions to the **Connected** state. Shortly after, a remotely rendered model will appear in the viewport.

Congratulations! You are now viewing a remotely rendered model!

Be aware that the rendered image will only appear in the 'Game' panel, not in the camera preview.

You can now explore the scene graph by selecting the new node and clicking **Show children** in the Inspector window.

![Unity Hierarchy](./media/unity-hierarchy.png)

Try moving objects or the [cut plane](../sdk/features-cut-planes.md) around in the editor. To synchronize transforms, either click **Sync now** or check the **Sync every frame** option. For component properties, just changing them is enough.

![Unity Inspector](./media/unity-inspector.png)

![Unity Engine](./media/unity-engine.png "Unity Engine")

## Next steps

Advance to the next article to learn how to...

> [!div class="nextstepaction"]
> [Convert a model for rendering](quickstart-convert-model.md)
