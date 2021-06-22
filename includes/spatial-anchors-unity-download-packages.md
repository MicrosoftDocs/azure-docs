---
author: msftradford
ms.service: azure-spatial-anchors
ms.topic: include
ms.date: 03/30/2021
ms.author: parkerra
---

The next step is to download the Azure Spatial Anchors packages for Unity. 

> [!WARNING]
> ASA SDK 2.7.0 is the minimum supported version. If using Unity 2020, ASA SDK 2.9.0 is the minimum supported version.

To use Azure Spatial Anchors in Unity, you will need to download the core package as well as a platform-specific package for each platform (Android/iOS/HoloLens) that you plan to support.

| Platform | Package name                                    |
|----------|-------------------------------------------------|
| Android/iOS/HoloLens  | com.microsoft.azure.spatial-anchors-sdk.core@<version_number> |
| Android  | com.microsoft.azure.spatial-anchors-sdk.android@<version_number> |
| iOS      | com.microsoft.azure.spatial-anchors-sdk.ios@<version_number>     |
| HoloLens | com.microsoft.azure.spatial-anchors-sdk.windows@<version_number> |

# [Download with web browser](#tab/unity-package-web-ui)

Locate the Azure Spatial Anchors core package for Unity [here](https://aka.ms/aoa/unity-sdk/package). Select the version you want and download the package using the **Download** button. Repeat this step to download the package for each platform that you plan to support.

# [Download with NPM](#tab/unity-package-npm)

This step requires that <a href="https://www.npmjs.com/get-npm" target="_blank">NPM</a> is installed and available.

Run the following command replacing `<version_number>` with the version of Azure Spatial Anchors you want to download
to the current folder:

```bash
npm pack com.microsoft.azure.spatial-anchors-sdk.core@<version_number> --registry https://pkgs.dev.azure.com/aipmr/MixedReality-Unity-Packages/_packaging/Unity-packages/npm/registry/
```

> [!NOTE]
> To list the available versions of the Azure Spatial Anchors package, run the following:
>
> ```bash
> npm view com.microsoft.azure.spatial-anchors-sdk.core --registry https://pkgs.dev.azure.com/aipmr/MixedReality-Unity-Packages/_packaging/Unity-packages/npm/registry/ versions
> ```

The Azure Spatial Anchors core package will be downloaded to the folder where you ran the command. Repeat this step to download the package for each platform that you plan to support.

# [Install with Mixed Reality Feature Tool (beta)](#tab/unity-package-mixed-reality-feature-tool)

Continue to the next step. You'll use the <a a href="/windows/mixed-reality/develop/unity/welcome-to-mr-feature-tool" target="_blank">Mixed Reality Feature Tool</a> in a later step.

---