---
title: Access the Azure Media Services API - Azure CLI | Microsoft Docs
description: Follow the steps of this how-to to access the Azure Media Services API.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.custom: mvc
ms.date: 05/15/2019
ms.author: juliako
---

# Access Azure Media Services API with the Azure CLI
 
To use the Azure AD service principal authentication to connect to the Azure Media Services API, Your application needs to request an Azure AD token that has the following parameters:

* Azure AD tenant endpoint
* Media Services resource URI
* Resource URI for REST Media Services
* Azure AD application values: the client ID and client secret

For detailed explanation, see [Accessing Media Services v3 APIs](media-services-apis-overview.md#accessing-the-azure-media-services-api).

This article shows you how to use the Azure CLI to create an Azure AD application and service principal and get the values that are needed to access Azure Media Services resources.

## Prerequisites 

[Create a Media Services account](create-account-cli-how-to.md).

Make sure to remember the values that you used for the resource group name and Media Services account name.
 
[!INCLUDE [media-services-cli-instructions](../../../includes/media-services-cli-instructions.md)]

[!INCLUDE [media-services-v3-cli-access-api-include](../../../includes/media-services-v3-cli-access-api-include.md)]

## See also

- [Scale Media Reserved Units - CLI](media-reserved-units-cli-how-to.md)
- [Create a Media Services account - CLI](create-account-cli-how-to.md) 
- [Reset account credentials - CLI](cli-reset-account-credentials.md)
- [Create assets - CLI](cli-create-asset.md)
- [Upload a file - CLI](cli-upload-file-asset.md)
- [Create transforms - CLI](cli-create-transform.md)
- [Encode with a custom transform - CLI](custom-preset-cli-howto.md)
- [Create jobs - CLI](cli-create-jobs.md)
- [Create EventGrid - CLI](job-state-events-cli-how-to.md)
- [Publish an asset - CLI](cli-publish-asset.md)
- [Filter - CLI](filters-dynamic-manifest-cli-howto.md)
- [Azure CLI](https://docs.microsoft.com/cli/azure/ams?view=azure-cli-latest)

## Next steps

The Streaming Endpoint from which you want to stream content has to be in the Running state. The following CLI command starts your default Streaming Endpoint:

`az ams streaming-endpoint start -n default -a <amsaccount> -g <amsResourceGroup>`

