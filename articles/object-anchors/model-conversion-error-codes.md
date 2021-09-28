---
title: Model Conversion Error Codes
description: Model conversion error codes for the Azure Object Anchors service.
author: jastenze
manager: vriveras

ms.author: jastenze
ms.date: 04/20/2021
ms.topic: overview
ms.service: azure-object-anchors
#Customer intent: Explain different modes of model conversion failure and how to recover from them.
---

# Model Conversion Error Codes

For common modes of model conversion failure, the `Azure.MixedReality.ObjectAnchors.Conversion.AssetConversionProperties` object obtained from the `Value` field in the `Azure.MixedReality.ObjectAnchors.Conversion.AssetConversionOperation` contains an ErrorCode field of the `ConversionErrorCode` type. This type enumerates these common modes of failure for error message localization, failure recovery, and tips to the user on how the error can be corrected.

| Error Code                    | Description                       |  Mitigation                       |
| ---                      | ---                               | ---                               |
| INVALID_ASSET_URI | The asset at the URI provided when starting the conversion job could not be found. | When triggering an asset conversion job, provide an upload URI obtained from the service where the asset to be converted has been uploaded. |
| INVALID_JOB_ID | The provided ID for the asset conversion job to be created was set to the default all-zero GUID. | If a GUID is specified when creating an asset conversion job, ensure it is not the default all-zero GUID. |
| INVALID_GRAVITY | The gravity vector provided when creating the asset conversion job was a fully zeroed vector. | When starting an asset conversion, provide the gravity vector that corresponds to the uploaded asset. |
| INVALID_SCALE | The provided scale factor was not a positive non-zero value. | When starting an asset conversion, provide the scalar value that corresponds to the measurement unit scale (with regard to meters) of the uploaded asset. |
| ASSET_SIZE_TOO_LARGE | The intermediate .PLY file generated from the asset or its serialized equivalent was too large. | Refer to the asset size guidelines before submitting an asset for conversion to ensure conformity: aka.ms/aoa/faq |
| ASSET_DIMENSIONS_OUT_OF_BOUNDS | The dimensions of the asset exceeded the physical dimension limit. This can be a sign of an improperly set scale for the asset when creating a job. | Refer to the asset size guidelines before submitting an asset for conversion to ensure conformity, and ensure the provided scale corresponds to the uploaded asset: aka.ms/aoa/faq |
| ZERO_FACES | The intermediate .PLY file generated from the asset was determined to have no faces, making it invalid for conversion. | Ensure the asset is a valid mesh. |
| INVALID_FACE_VERTICES | The intermediate .PLY file generated from the asset contained faces that referenced nonexistent vertices. | Ensure the asset file is validly constructed. |
| ZERO_TRAJECTORIES_GENERATED | The camera trajectories generated from the uploaded asset were empty. | Refer to the asset guidelines before submitting an asset for conversion to ensure conformity: aka.ms/aoa/faq |
| TOO_MANY_RIG_POSES | The number of rig poses in the intermediate .PLY file exceeded service limits. | Refer to the asset size guidelines before submitting an asset for conversion to ensure conformity: aka.ms/aoa/faq |
| SERVICE_ERROR | An unknown service error occurred. | Contact a member of the Object Anchors service team if the issue persists: https://github.com/Azure/azure-object-anchors/issues |
| ASSET_CANNOT_BE_CONVERTED | The provided asset was corrupted, malformed, or otherwise unable to be converted in its provided format. | Ensure the asset is a validly constructed file of the specified type, and refer to the asset size guidelines before submitting an asset for conversion to ensure conformity: aka.ms/aoa/faq |

Any errors that occur outside the actual asset conversion jobs will be thrown as exceptions. Most notably, the `Azure.RequestFailedException` can be thrown for service calls that receive an unsuccessful (4xx or 5xx) or unexpected HTTP response code. For further details on these exceptions, examine the `Status`, `ErrorCode`, or `Message` fields on the exception.

| Exception                  | Cause                       |
| ---                      | ---                               |
| ArgumentException |  <ul><li>Occurs when using an invalidly constructed or all zero account ID to construct a request with the ObjectAnchorsConversionClient.</li><li>Occurs when attempting to initialize the ObjectAnchorsConversionClient using an invalid whitespace account domain.</li><li>Occurs when an unsupported service version is provided to the ObjectAnchorsConversionClient through ObjectAnchorsConversionClientOptions.</li></ul> |
| ArgumentNullException | <ul><li>Occurs when attempting to initialize the ObjectAnchorsConversionClient using an invalid null account domain.</li><li>Occurs when attempting to initialize the ObjectAnchorsConversionClient using an invalid null credential.</li></ul> |
| RequestFailedException | <ul><li>Occurs for all other issues resulting from a bad HTTP status code (unrelated to the status of a job that will/is/has run), such as an account not being found, an invalid upload uri being detected by the fronted, frontend service error, etc.</li></ul> |
| UnsupportedAssetFileTypeException | <ul><li>Occurs when attempting to submit a job with an asset with an extension or specified filetype that is unsupported by the Azure Object Anchors Conversion service.</li></ul> |