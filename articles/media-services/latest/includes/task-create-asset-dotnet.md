---
author: IngridAtMicrosoft
ms.service: media-services 
ms.topic: include
ms.date: 08/18/2020
ms.author: inhenkel
ms.custom: dotnet
---

<!--Create a media services asset REST-->

The following Azure .NET command creates a new Media Services asset. Replace the values `subscriptionID`, `resourceGroup`, and `amsAccountName` with values you are currently working with. Give your asset a name by setting `assetName` here.

[!code-csharp[Main](../../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/UploadEncodeAndStreamFiles/Program.cs#CreateInputAsset)]
