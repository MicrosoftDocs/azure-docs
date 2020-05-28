---
title: Install Azure Spatial Anchors for Unity
description: Configure a Unity project to use Azure Spatial Anchors
author: craigktreasure
manager: vriveras
services: azure-spatial-anchors

ms.author: crtreasu
ms.date: 02/24/2019
ms.topic: how-to
ms.service: azure-spatial-anchors
---

# Configuring Azure Spatial Anchors in a Unity project

## Requirements

Azure Spatial Anchors currently supports Unity 2019.1+ with the following configurations.

* Unity 2019.1 and Unity 2019.2 with AR Foundation 2.
* Unity 2019.3 with AR Foundation 3 is supported in Azure Spatial Anchors 2.3.0+.

## Configuring a project

Azure Spatial Anchors for Unity is currently distributed using a Unity Asset Package (`.unitypackage`), which can be found in the [GitHub releases](https://github.com/Azure/azure-spatial-anchors-samples/releases).

### Import the asset package

1. Download the `AzureSpatialAnchors.unitypackage` file for the version you wan to target from the [GitHub releases](https://github.com/Azure/azure-spatial-anchors-samples/releases).
2. Follow the instructions [here](https://docs.unity3d.com/Manual/AssetPackagesImport.html) to import the Unity asset package into your project.

### Unity 2019.1 and 2019.2

When using Azure Spatial Anchors 2.3.0+ with Unity 2019.1 or 2019.2, you'll need to modify a couple of files after importing the asset package.

For **Android**, you'll need to replace the content of `Assets/Android/mainTemplate.gradle` with the content from [here](https://github.com/Azure/azure-spatial-anchors-samples/blob/181599165f19c8215a4e7491f56758acc70d9301/Unity/Assets/Plugins/Android/mainTemplate.gradle). After replacing the content of the file, update the value of the `azureSpatialAnchorsSdkVersion` property with the version of Azure Spatial Anchors you want to use. For example:

```groovy
def azureSpatialAnchorsSdkVersion = '2.3.0'
```

For **iOS**, you'll need to replace the content of `Assets/AzureSpatialAnchors.SDK/Plugins/iOS/Podfile` with the content from [here](https://github.com/Azure/azure-spatial-anchors-samples/blob/181599165f19c8215a4e7491f56758acc70d9301/Unity/Assets/AzureSpatialAnchors.SDK/Plugins/iOS/Podfile). After replacing the content of the file, update the version of the `AzureSpatialAnchors` CocoaPod with the version of Azure Spatial Anchors you want to use. For example:

```groovy
  pod 'AzureSpatialAnchors', '2.3.0'
```

## Next steps

> [!div class="nextstepaction"]
> [How To: Create and locate anchors in Unity](./create-locate-anchors-unity.md)
