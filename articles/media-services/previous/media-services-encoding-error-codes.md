---
title: Azure Media Services encoding error codes | Microsoft Docs
description: This topic lists error codes that could be returned in case an error was encountered during the encoding task execution..
services: media-services
documentationcenter: ''
author: juliako
manager: femila
editor: ''

ms.assetid: ce4e939f-5aee-41f9-859d-e4429815e9f2
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/18/2019
ms.author: juliako

---

# Encoding error codes

The following table lists error codes that could be returned in case an error was encountered during the encoding task execution.  To get error details in your .NET code, use the [ErrorDetails](https://msdn.microsoft.com/library/microsoft.windowsazure.mediaservices.client.errordetail.aspx) class. To get error details in your REST code, use the [ErrorDetail](https://msdn.microsoft.com/library/jj853026.aspx) REST API.

| ErrorDetail.Code | Possible causes for error |
| --- | --- |
| Unknown |Unknown error while executing the task |
| ErrorDownloadingInputAssetMalformedContent |Category of errors that covers errors in downloading input asset such as bad file names, zero length files, incorrect formats and so on. |
| ErrorDownloadingInputAssetServiceFailure |Category of errors that covers problems on the service side - for example network or storage errors while downloading. |
| ErrorParsingConfiguration |Category of errors where task \<see cref="MediaTask.PrivateData"/> (configuration) is not valid, for example the configuration is not a valid system preset or it contains invalid XML. |
| ErrorExecutingTaskMalformedContent |Category of errors during the execution of the task where issues inside the input media files cause failure. |
| ErrorExecutingTaskUnsupportedFormat |Category of errors where the media processor cannot process the files provided - media format not supported, or does not match the Configuration. For example, trying to produce an audio-only output from an asset that has only video |
| ErrorProcessingTask |Category of other errors that the media processor encounters during the processing of the task that are unrelated to content. |
| ErrorUploadingOutputAsset |Category of errors when uploading the output asset |
| ErrorCancelingTask |Category of errors to cover failures when attempting to cancel the Task |
| TransientError |Category of errors to cover transient issues (eg. temporary networking issues with Azure Storage) |

To get help from the **Media Services** team, open a [support ticket](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade).

## Media Services learning paths
[!INCLUDE [media-services-learning-paths-include](../../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../../includes/media-services-user-voice-include.md)]

## Related articles
* [Perform advanced encoding tasks by customizing Media Encoder Standard presets](media-services-custom-mes-presets-with-dotnet.md)
* [Quotas and Limitations](media-services-quotas-and-limitations.md)

<!--Reference links in article-->
[1]: https://azure.microsoft.com/pricing/details/media-services/
