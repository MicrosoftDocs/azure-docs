---
author: IngridAtMicrosoft
ms.service: media-services 
ms.topic: include
ms.date: 08/18/2020
ms.author: inhenkel
ms.custom: CLI
---

<!--Create a media services asset REST-->

The following Azure REST command creates a new Media Services asset. Replace the values `subscriptionID`, `resourceGroup`, and `amsAccountName` with values you are currently working with. Give your asset a name by setting `assetName` here.

```
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Media/mediaServices/{amsAccountName}/assets/{assetName}?api-version=2018-07-01
```