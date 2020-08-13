---
title: Install Azure Spatial Anchors for Unity
description: Configure a Unity project to use Azure Spatial Anchors
author: craigktreasure
manager: vriveras
services: azure-spatial-anchors

ms.author: crtreasu
ms.date: 08/13/2020
ms.topic: how-to
ms.service: azure-spatial-anchors
---

# Configuring Azure Spatial Anchors in a Unity project

## Requirements

Azure Spatial Anchors currently supports Unity 2019.4 (LTS) with the following configurations.

* Unity 2019.4 with AR Foundation 3.1 is supported in Azure Spatial Anchors 2.4.0+.

## Configuring a project

Azure Spatial Anchors for Unity is currently distributed using Unity Package Manager (UPM) Packages. These packages can be found in our [BinTray registry](https://bintray.com/microsoft/AzureSpatialAnchors).

### Add the registry to your Unity project
1. In a file explorer, navigate to your Unity project's `Packages` folder. Open the project manifest file, `manifest.json`, in a text editor.
2. At the top of the file, at the same level as the `dependencies` section, add the following entry to include the Azure Spatial Anchors registry to your project. The `scopedRegistries` entry tells Unity where to look for the Azure Spatial Anchors SDK packages.

[!code-json[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-unity-scoped-registry-setup.md?range=9-19&highlight=10-18)]

### Add the SDK package(s) to your Unity project

| Platform | Package Name                                    |
|----------|-------------------------------------------------|
| Android  | com.microsoft.azure.spatial-anchors-sdk.android |
| iOS      | com.microsoft.azure.spatial-anchors-sdk.ios     |
| HoloLens | com.microsoft.azure.spatial-anchors-sdk.windows |

1. For each platform (Android/iOS/HoloLens) that you would like to support in your project, add an entry with the package name and package version to the `dependencies` section in your project manifest. See below for an example.

[!code-json[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-unity-scoped-registry-setup.md?range=9-22&highlight=20-22)]

2. Save and close the `manifest.json` file. When you return to Unity, Unity should automatically detect the project manifest change and retrieve the specified packages. You can expand the `Packages` folder in your Project view to verify that the right packages have been imported.

## Next steps

> [!div class="nextstepaction"]
> [How To: Create and locate anchors in Unity](./create-locate-anchors-unity.md)
