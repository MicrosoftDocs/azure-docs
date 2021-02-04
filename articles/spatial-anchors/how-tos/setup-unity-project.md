---
title: Install Azure Spatial Anchors for Unity
description: Configure a Unity project to use Azure Spatial Anchors
author: msftradford
manager: MehranAzimi-msft
services: azure-spatial-anchors

ms.author: parkerra
ms.date: 2/3/2021
ms.topic: how-to
ms.service: azure-spatial-anchors
---

# Configuring Azure Spatial Anchors in a Unity project

This guide will show you how to get started with the Azure Spatial Anchors SDK in your Unity project.

## Requirements

Azure Spatial Anchors currently supports Unity 2019.4 (LTS) with the following configurations.

* Unity 2019.4 with AR Foundation 3.1 is supported in Azure Spatial Anchors 2.4.0+.

## Configuring a project

### Download packages
[!INCLUDE [Download Unity Packages](../../../includes/spatial-anchors-unity-download-packages.md)]

### Import packages
[!INCLUDE [Import Unity Packages](../../../includes/spatial-anchors-unity-import-packages.md)]

### Android only: Configure the mainTemplate.gradle file

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

## Next steps

> [!div class="nextstepaction"]
> [How To: Create and locate anchors in Unity](./create-locate-anchors-unity.md)
