---
author: craigktreasure
ms.service: azure-object-anchors
ms.topic: include
ms.date: 02/18/2021
ms.author: crtreasu
---

The next step is to download the Azure Object Anchors package for Unity.

# [Download with web browser](#tab/unity-package-web-uid)

Locate the Azure Object Anchors package for Unity [here](https://aka.ms/aoa/unity-sdk/package). Select the version you want and download the package using the **Download** button.

# [Download with NPM](#tab/unity-package-npm)

This step requires that <a href="https://www.npmjs.com/get-npm" target="_blank">NPM</a> is installed and available.

Run the following command replacing `<version_number>` with the version of Azure Object Anchors you want to download:

```bash
npm pack com.microsoft.azure.object-anchors.unity@<version_number> --registry https://pkgs.dev.azure.com/aipmr/MixedReality-Unity-Packages/_packaging/Unity-packages/npm/registry/
```

> [!NOTE]
> To list the available versions of the Azure Object Anchors package, run the following:
>
> ```bash
> npm view com.microsoft.azure.object-anchors.unity --registry https://pkgs.dev.azure.com/aipmr/MixedReality-Unity-Packages/_packaging/Unity-packages/npm/registry/ versions
> ```

The Azure Object Anchors package will be downloaded to the folder where you ran the command.

---
