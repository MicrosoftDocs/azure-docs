---
title: Deploy Unity sample to HoloLens
description: Quickstart that shows how to get the Unity sample onto the HoloLens
author: jakrams
ms.author: jakras
ms.date: 02/14/2020
ms.topic: quickstart
---

# Quickstart: Deploy Unity sample to HoloLens

This quickstart covers how to deploy and run the Unity sample app to a HoloLens.

In this quickstart you will learn how to:

> [!div class="checklist"]
>
>* Build the Unity sample for HoloLens
>* Deploy the sample to the device
>* Configure the connection settings

## Prerequisites

In this quickstart we will deploy the sample project that is used in [Quickstart: Render a model with Unity](render-model.md).

## Building the sample project

1. Open *File > Build Settings*.
1. Change *Platform* to **Universal Windows Platform**
1. Set *Target Device* to **HoloLens**
1. Set *Architecture* to **ARM64**
    ![Build settings](./media/unity-build-settings.png)
1. Select **Switch to Platform**
1. When pressing **Build** (or 'Build And Run'), you will be asked to select an output folder
1. Open the generated **UnityProject.sln** with Visual Studio
1. Change the configuration to **Release** and **ARM64**
1. Switch the debugger mode to **Remote Machine**
    ![Solution configuration](media/unity-deploy-config.png)
1. Build the solution (F7)
1. For the project 'UnityProject', go to *Properties > Debugging*
    1. Make sure the configuration *Release* is active
    1. Set *Debugger to Launch* to **Remote Machine**
    1. Change *Machine Name* to the **IP of your HoleLens**
1. Launch the project. It will automatically deploy to the device.

## Launching the sample

1. When first launched, the sample app should display a message indicating that it can't connect to localhost.
1. Change the server hostname as follows:
1. Open the device web portal
1. Go to the page: *System > File explorer*
1. Download the file: `LocalAppData / UnityProject / LocalState / connect.xml`
1. Update the XML for your account credentials and session information (or leave session information blank to autocreate a session).
1. Reupload it to the same location.
1. When the app is restarted, it should load the model on the server. To restart the app, make sure to close any open window before selecting it from the start menu again.

An example connect.xml will look like:

```xml
<?xml version="1.0" encoding="utf-8"?>
<UseSessionSettings xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <sessionid />
  <useSessionId>false</useSessionId>
  <accountInfo>
    <AccountDomain></AccountDomain>
    <AccountId />
    <AccountKey />
    <AuthenticationToken />
    <AccessToken />
  </accountInfo>
</UseSessionSettings>
```

## Next steps

* [Unity SDK concepts](unity-concepts.md)
* [Tutorial: Setting up a Unity project from scratch](../../tutorials/unity/project-setup.md)
