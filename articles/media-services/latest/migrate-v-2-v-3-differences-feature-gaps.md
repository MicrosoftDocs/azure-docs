---
title: Feature gaps between Azure Media Services V2 and V3 
description: This article describes the feature gaps between Azure Media Services V2 to v3.
services: media-services
author: IngridAtMicrosoft
manager: femila

ms.service: media-services
ms.devlang: multiple
ms.topic: conceptual
ms.tgt_pltfrm: multiple
ms.workload: media
ms.date: 1/14/2020
ms.author: inhenkel
---

# Feature gaps between Azure Media Services V2 and V3

![migration guide logo](./media/migration-guide/azure-media-services-logo-migration-guide.svg)

<hr color="#5ea0ef" size="10">

![migration steps 2](./media/migration-guide/steps-2.svg)

This part of the migration guidance gives you detailed information about the
differences between the V2 and V3 APIs.

## Feature gaps between V2 and V3 APIs

The V3 API has the following feature gaps with the V2 API. A couple
of the advanced features of the Media Encoder Standard in V2 APIs are currently
not available in V3:

- Inserting a silent audio track when input has no audio, as this is no longer required with the Azure Media Player.

- Inserting a video track when input has no video.

- Live Events with transcoding currently don't support Slate insertion mid-stream and ad marker insertion via API call.

- Azure Media Premium Encoder will no longer be supported in V2. If you're using it for 8-bit HEVC encoding, use the new HEVC support in the Standard Encoder. 
    - We added support for audio channel mapping to the Standard encoder.  See [Audio in the Media Services Encoding Swagger documentation](https://github.com/Azure/azure-rest-api-specs/blob/master/specification/mediaservices/resource-manager/Microsoft.Media/stable/2020-05-01/Encoding.json).
    - If you were using advanced features or output formats of the third-party licensed product such as MXF or ProRes, use the Azure Partner solution from Telestream, which will be transactional by the time of the V2 retirement. Alternatively you can use Imagine Communications, or [Bitmovin](http://bitmovin.com).

- The “availability set” property on the Streaming Endpoint in V2 is no longer supported. See the sample project and guidance for [High Availability VOD](./media-services-high-availability-encoding.md) delivery in the V3 API.

- In Media Services V3, FairPlay IV cannot be specified. While it doesn't impact customers using Media Services for both packaging and license delivery, it can be an issue when using a third-party DRM system to deliver the FairPlay licenses (hybrid mode).

- Client-side storage encryption for protection of assets at rest has been removed in the V3 API and replaced by storage service encryption for data at rest. The V3 APIs continue to work with existing storage encrypted assets but won't allow creation of new ones.

## Next steps

[!INCLUDE [migration guide next steps](./includes/migration-guide-next-steps.md)]