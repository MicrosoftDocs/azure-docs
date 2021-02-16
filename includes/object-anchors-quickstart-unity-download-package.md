---
author: craigktreasure
ms.service: azure-object-anchors
ms.topic: include
ms.date: 02/16/2021
ms.author: crtreasu
---
Run the following command replacing `<version_number>` with the version of Azure Object Anchors you want to download
to the current folder:

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
