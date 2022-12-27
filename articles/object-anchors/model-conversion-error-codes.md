---
title: Model conversion error codes
description: Learn about model conversion error codes and exception errors in the Azure Object Anchors service, and how to address them.
author: vriveras
manager: vriveras

ms.author: virivera
ms.date: 06/10/2022
ms.topic: error-reference
ms.service: azure-object-anchors
ms.custom: kr2b-contr-experiment
#Customer intent: Explain different modes of model conversion failure and how to recover from them.
---

# Model conversion error codes

For common modes of model conversion failure, the `Azure.MixedReality.ObjectAnchors.Conversion.AssetConversionProperties` object you get from the `Value` field in the `Azure.MixedReality.ObjectAnchors.Conversion.AssetConversionOperation` contains an `ErrorCode` field of the `ConversionErrorCode` type.

The `ConversionErrorCode` type enumerates the following common modes of model conversion failure. These enumerations are useful for error message localization, failure recovery, and tips to the user on how to correct the error.

| Error code                    | Description                       |  Mitigation                       |
| ---                      | ---                               | ---                               |
| INVALID_ASSET_URI | The asset at the URI provided when starting the conversion job couldn't be found. | When triggering an asset conversion job, provide an upload URI you get from the service where the asset to be converted is uploaded. |
| INVALID_JOB_ID | The provided ID for the asset conversion job was set to the default all-zero GUID. | If a GUID is specified when creating an asset conversion job, make sure it isn't the default all-zero GUID. |
| INVALID_GRAVITY | The gravity vector provided when creating the asset conversion job was a fully zeroed vector. | When starting an asset conversion, provide the gravity vector that corresponds to the uploaded asset. |
| INVALID_SCALE | The provided scale factor wasn't a positive non-zero value. | When starting an asset conversion, provide the scalar value that corresponds to the measurement unit scale, with respect to meters, of the uploaded asset. |
| ASSET_SIZE_TOO_LARGE | The intermediate PLY file generated from the asset or its serialized equivalent was too large. | Ensure conformity with the [asset size guidelines](faq.md) before submitting an asset for conversion. |
| ASSET_DIMENSIONS_OUT_OF_BOUNDS | The dimensions of the asset exceeded the physical dimension limit. This error can be a sign of an improperly set scale for the asset when creating a job. | Inspect the `ScaledAssetDimensions` property in your `AssetConversionProperties` object. This property contains the actual dimensions of the asset calculated after applying the scale in meters. Then, ensure conformity with the [asset size guidelines](faq.md) before submitting the asset for conversion. Make sure the provided scale corresponds to the uploaded asset. |
| ZERO_FACES | The intermediate PLY file generated from the asset was determined to have no faces, making it invalid for conversion. | Ensure the asset is a valid mesh. |
| INVALID_FACE_VERTICES | The intermediate PLY file generated from the asset contained faces that referenced nonexistent vertices. | Ensure the asset file is validly constructed. |
| ZERO_TRAJECTORIES_GENERATED | The camera trajectories generated from the uploaded asset were empty. | Ensure conformity with the [asset size guidelines](faq.md) before submitting an asset for conversion. |
| TOO_MANY_RIG_POSES | The number of rig poses in the intermediate PLY file exceeded service limits. | Ensure conformity with the [asset size guidelines](faq.md) before submitting an asset for conversion. |
| SERVICE_ERROR | An unknown service error occurred. | [File a GitHub issue to the Object Anchors service team](https://github.com/Azure/azure-object-anchors/issues) if the issue persists. |
| ASSET_CANNOT_BE_CONVERTED | The provided asset was corrupted, malformed, or otherwise couldn't be converted in its provided format. | Ensure the asset is a validly constructed file of the specified type. Ensure conformity with the [asset size guidelines](faq.md) before submitting the asset for conversion. |

## Exception errors

Any errors that occur outside the actual asset conversion jobs are thrown as exceptions. Most notably, the `Azure.RequestFailedException` can be thrown for service calls that receive an unsuccessful (4xx or 5xx) or unexpected HTTP response code. For further details on these exceptions, examine the `Status`, `ErrorCode`, or `Message` fields on the exception.

| Exception                  | Cause                       |
| ---                      | ---                               |
| ArgumentException |  <ul><li>Using an invalidly constructed or all-zero account ID to construct a request with the `ObjectAnchorsConversionClient`.</li><li>Attempting to initialize the `ObjectAnchorsConversionClient` using an invalid whitespace account domain.</li><li>Providing an unsupported service version to the `ObjectAnchorsConversionClient` through `ObjectAnchorsConversionClientOptions`.</li></ul> |
| ArgumentNullException | <ul><li>Attempting to initialize the `ObjectAnchorsConversionClient` using an invalid null account domain.</li><li>Attempting to initialize the `ObjectAnchorsConversionClient` using an invalid null credential.</li></ul> |
| RequestFailedException | <ul><li>All other issues resulting from a bad HTTP status code, unrelated to job status. Examples include an account not being found, the front end detecting an invalid upload URI, or a front end service error.</li></ul> |
| UnsupportedAssetFileTypeException | <ul><li>Submitting an asset with an extension or specified filetype that the Azure Object Anchors Conversion service doesn't support.</li></ul> |

## Next steps

- [Quickstart: Create an Object Anchors model from a 3D model](quickstarts/get-started-model-conversion.md)
- [Frequently asked questions about Azure Object Anchors](faq.md)
- [Azure Object Anchors client library for .NET](/dotnet/api/overview/azure/mixedreality.objectanchors.conversion-readme)
