---
author: msftradford
ms.service: azure-spatial-anchors
ms.topic: include
ms.date: 03/18/2021
ms.author: parkerra
---
To download the required packages, you will need to have <a href="https://www.npmjs.com/get-npm" target="_blank">NPM</a> installed.

Run the following command replacing `<version_number>` with the version of Azure Spatial Anchors you want to download
to the current folder:

```bash
npm pack com.microsoft.azure.spatial-anchors-sdk.core@<version_number> --registry https://api.bintray.com/npm/microsoft/AzureMixedReality-NPM
```

> [!NOTE]
> To list the available versions of the Azure Spatial Anchors package, run the following:
>
> ```bash
> npm view com.microsoft.azure.spatial-anchors-sdk.core --registry https://api.bintray.com/npm/microsoft/AzureMixedReality-NPM versions
> ```

> [!WARNING]
> ASA SDK 2.7.0 is the minimum supported version. If using Unity 2020, ASA SDK 2.9.0 is the minimum supported version.

The Azure Spatial Anchors core package will be downloaded to the folder where you ran the command.

Repeat this step to download the package for each platform (Android/iOS/HoloLens) that you would like to support in your project.

| Platform | Package name                                    |
|----------|-------------------------------------------------|
| Android  | com.microsoft.azure.spatial-anchors-sdk.android@<version_number> |
| iOS      | com.microsoft.azure.spatial-anchors-sdk.ios@<version_number>     |
| HoloLens | com.microsoft.azure.spatial-anchors-sdk.windows@<version_number> |