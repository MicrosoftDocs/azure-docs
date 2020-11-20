---
author: craigktreasure
ms.service: azure-object-anchors
ms.topic: include
ms.date: 11/19/2020
ms.author: crtreasu
---
Run the following command replacing `<version_number>` with the version of Azure Object Anchors you want to download
to the current folder:

```bash
npm pack com.microsoft.azure.object-understanding.unity@<version_number> --registry https://api.bintray.com/npm/microsoft/AzureMixedReality-NPM
```

> [!NOTE]
> To list the available versions of the Azure Object Anchors package, run the following:
>
> ```bash
> npm view com.microsoft.azure.object-understanding.unity --registry https://api.bintray.com/npm/microsoft/AzureMixedReality-NPM versions
> ```

The Azure Object Anchors package will be downloaded to the folder where you ran the command.
