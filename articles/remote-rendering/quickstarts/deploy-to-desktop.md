---
title: Deploy Unity sample to Desktop
description: Quickstart that shows how to get the Unity sample onto a desktop PC
author: christophermanthei
ms.author: chmant
ms.date: 03/20/2020
ms.topic: quickstart
ms.custom: mode-other
---

# Quickstart: Deploy Unity sample to Desktop

This quickstart covers how to deploy and run the quickstart sample app for Unity to a desktop PC.

In this quickstart, you learn how to:

> [!div class="checklist"]
>
>* Build the quickstart sample app for desktop
>* Deploy the sample to a PC
>* Run the sample on a PC

## Prerequisites

In this quickstart, we deploy the sample project from [Quickstart: Render a model with Unity](render-model.md).

Make sure your credentials are saved properly with the scene and you can connect to a session from within the Unity editor.

## Disable virtual reality support

Only flat desktop apps are currently supported on desktop so VR support has to be disabled.

# [Standalone](#tab/UnityStandalone)

In the standalone build VR support is automatically disabled. No steps are needed here.

# [Universal Windows Platform (UWP)](#tab/UnityUWP)

1. Open *Edit > Project Settings...*
1. Select **XR Plugin Management** in the menu to the left.
1. Select the **Universal Windows Platform settings** tab.
1. Disable **OpenXR**.\
    ![A screenshot showing the Project Settings menu with a disabled "OpenXR" setting.](./media/unity-2020-disable-xr.png)

---

## Build the sample project

# [Standalone](#tab/UnityStandalone)

1. Open *File > Build Settings*.
1. Change *Platform* to **PC, Mac & Linux Standalone**.
1. Set *Target Platform* to **Windows**.\
  ![A screenshot showing the Build Menu with the settings set for a standalone build.](./media/unity-2021-build-settings-pc-standalone.png)
1. Select **Switch Platform**.
1. When pressing **Build** (or 'Build And Run'), you're asked to select some folder where the *.exe* should be stored.

# [UWP](#tab/UnityUWP)

1. Open *File > Build Settings*.
1. Change *Platform* to **Universal Windows Platform**.\
  ![A screenshot showing the Build Menu with the settings set for a UWP build.](./media/unity-2021-build-settings-pc.png)
1. Select **Switch Platform**.
1. When pressing **Build** (or 'Build And Run'), you're asked to select some folder where the solution should be stored.

---

## Build the Visual Studio solution

# [Standalone](#tab/UnityStandalone)

Building in standalone mode doesn't produce a Visual Studio solution, but instead a simple *.exe* file. No second building step is necessary here.

# [UWP](#tab/UnityUWP)

1. Open the generated **Quickstart.sln** with Visual Studio.
1. Change the configuration to **Release** and **x86**.
1. Switch the debugger mode to **Local Machine**.\
  ![A screenshot showing the Visual Studio configuration and debugger mode.](./media/unity-deploy-config-pc.png)
1. Build the solution.

---

## Launch the sample project

# [Standalone](#tab/UnityStandalone)

Run the *.exe* file, which was produced in the build step.

# [UWP](#tab/UnityUWP)

Start the Debugger in Visual Studio (F5). It automatically deploys the app to the PC.

The sample app should launch and then start a new session. After a while, the session is ready and the remotely rendered model will appear in front of you.
If you want to launch the sample a second time later, you can also find it from the Start menu now.

---

## Next steps

In the next quickstart, we'll take a look at converting a custom model.

> [!div class="nextstepaction"]
> [Quickstart: Convert a model for rendering](convert-model.md)
