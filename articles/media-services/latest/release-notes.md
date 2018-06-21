---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Azure Media Services v3 release notes | Microsoft Docs
description: To stay up-to-date with the most recent developments, this article provides you with the latest updates on Azure Media Services v3.
services: media-services
documentationcenter: ''
author: Juliako
manager: cfowler
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 03/19/2018
ms.author: juliako
---

# Azure Media Services v3 (preview) release notes 

To stay up-to-date with the most recent developments, this article provides you with information about:

* The latest releases
* Known issues
* Bug fixes
* Deprecated functionality
* Plans for changes

## May 07, 2018

### .Net SDK

The following features are present in the .Net SDK:

1. **Transforms** and **Jobs** to encode or analyze media content. For examples, see [Stream files](stream-files-tutorial-with-api.md) and [Analyze](analyze-videos-tutorial-with-api.md).
2. **StreamingLocators** for publishing and streaming content to end-user devices
3. **StreamingPolicies** and **ContentKeyPolicies** to configure key delivery and content protection (DRM) when delivering content.
4. **LiveEvents** and **LiveOutputs** to configure the ingest and archiving of live streaming content.
5. **Assets** to store and publish media content in Azure Storage. 
6. **StreamingEndpoints** to configure and scale dynamic packaging, encryption, and streaming for both live and on-demand media content.

### Known issues

Known issue:

When submitting a Job with a HTTPS URL (JobInputHttp) pointing to the source content, make sure that the HTTP server supports the ‘HEAD’ request. Otherwise, the Job will be rejected.

## Next steps

> [!div class="nextstepaction"]
> [Overview](media-services-overview.md)
