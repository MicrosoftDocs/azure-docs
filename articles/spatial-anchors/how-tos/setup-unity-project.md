---
title: Install Azure Spatial Anchors for Unity
description: Configure a Unity project to use Azure Spatial Anchors
author: craigktreasure
manager: vriveras
services: azure-spatial-anchors

ms.author: crtreasu
ms.date: 08/17/2020
ms.topic: how-to
ms.service: azure-spatial-anchors
---

# Configuring Azure Spatial Anchors in a Unity project

This guide will show you how to get started with the Azure Spatial Anchors SDK in your Unity project.

## Requirements

Azure Spatial Anchors currently supports Unity 2019.4 (LTS) with the following configurations.

* Unity 2019.4 with AR Foundation 3.1 is supported in Azure Spatial Anchors 2.4.0+.

## Configuring a project

### [Add the Unity Package Manager packages to your project](#tab/UPMPackage)

Azure Spatial Anchors for Unity is currently distributed using Unity Package Manager (UPM) Packages. These packages can be found in our [NPM registry](https://bintray.com/microsoft/AzureMixedReality-NPM). To learn more about working with scoped package registries in a Unity project, see the official Unity documentation [here](https://docs.unity3d.com/Manual/upm-scoped.html).

#### Add the registry to your Unity project

1. In a file explorer, navigate to your Unity project's `Packages` folder. Open the project manifest file, `manifest.json`, in a text editor.
2. At the top of the file, at the same level as the `dependencies` section, add the following entry to include the Azure Spatial Anchors registry to your project. The `scopedRegistries` entry tells Unity where to look for the Azure Spatial Anchors SDK packages.

    [!code-json[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-unity-scoped-registry-setup.md?range=9-19&highlight=2-10)]

#### Add the SDK package(s) to your Unity project

| Platform | Package name                                    |
|----------|-------------------------------------------------|
| Android  | com.microsoft.azure.spatial-anchors-sdk.android |
| iOS      | com.microsoft.azure.spatial-anchors-sdk.ios     |
| HoloLens | com.microsoft.azure.spatial-anchors-sdk.windows |

1. For each platform (Android/iOS/HoloLens) that you would like to support in your project, add an entry with the package name and package version to the `dependencies` section in your project manifest. See below for an example.

    [!code-json[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-unity-scoped-registry-setup.md?range=9-22&highlight=12-14)]

2. Save and close the `manifest.json` file. When you return to Unity, Unity should automatically detect the project manifest change and retrieve the specified packages. You can expand the `Packages` folder in your Project view to verify that the right packages have been imported.

#### Android only: Configure the mainTemplate.gradle file

1. Go to **Edit** > **Project Settings** > **Player**.
2. In the **Inspector Panel** for **Player Settings**, select the **Android** icon.
3. Under the **Build** section, check the **Custom Main Gradle Template** checkbox to generate a custom gradle template at `Assets\Plugins\Android\mainTemplate.gradle`.
4. Open your `mainTemplate.gradle` file in a text editor. 
5. In the `dependencies` section, paste the following dependencies:

    ```gradle
    implementation('com.squareup.okhttp3:okhttp:[3.11.0]')
    implementation('com.microsoft.appcenter:appcenter-analytics:[1.10.0]')
    ```

When it's all done, your `dependencies` section should look something like this:

[!code-gradle[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-unity-android-gradle-setup.md?range=9-13&highlight=3-4)]

### [Import the asset package](#tab/UnityAssetPackage)

> [!WARNING]
> The Unity Asset Package distribution of the Azure Spatial Anchors SDK will be deprecated after SDK version 2.5.0.

1. Download the `AzureSpatialAnchors.unitypackage` file for the version you want to target from the [GitHub releases](https://github.com/Azure/azure-spatial-anchors-samples/releases).	
2. Follow the instructions [here](https://docs.unity3d.com/Manual/AssetPackagesImport.html) to import the Unity asset package into your project.	

---

## Next steps

> [!div class="nextstepaction"]
> [How To: Create and locate anchors in Unity](./create-locate-anchors-unity.md)
