---
title: Vision SDK Overview
titleSuffix: Azure AI services
description: This page gives you an overview of the Azure AI Vision SDK for Image Analysis.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-vision
ms.topic: overview
ms.date: 08/01/2023
ms.author: pafarley
ms.custom: devx-track-csharp
---

# Vision SDK overview

The Vision SDK (Preview) provides a convenient way to access the Image Analysis service using [version 4.0 of the REST APIs](https://aka.ms/vision-4-0-ref).

[!INCLUDE [License Notice](../includes/setup-sdk/license-notice-sdk.md)]

## Supported languages

The Vision SDK supports the following languages and platforms:

| Programming language | Quickstart | API Reference | Platform support |
|----------------------|------------|-----------|------------------|
| C# <sup>1</sup> | [quickstart](../quickstarts-sdk/image-analysis-client-library-40.md?pivots=programming-language-csharp)  | [reference](/dotnet/api/azure.ai.vision.imageanalysis) | Windows, UWP, Linux |
| C++ <sup>2</sup> | [quickstart](../quickstarts-sdk/image-analysis-client-library-40.md?pivots=programming-language-cpp)  | [reference](/cpp/cognitive-services/vision) | Windows, Linux |
| Python | [quickstart](../quickstarts-sdk/image-analysis-client-library-40.md?pivots=programming-language-python) | [reference](/python/api/azure-ai-vision) | Windows, Linux |
| Java | [quickstart](../quickstarts-sdk/image-analysis-client-library-40.md?pivots=programming-language-java) | [reference](/java/api/com.azure.ai.vision.imageanalysis) | Windows, Linux |


<sup>1 The Vision SDK for C# is based on .NET Standard 2.0. See [.NET Standard](/dotnet/standard/net-standard?tabs=net-standard-2-0#net-implementation-support) documentation.</sup>

<sup>2 ANSI-C isn't a supported programming language for the Vision SDK.</sup>

## GitHub samples

Numerous samples are available in the [Azure-Samples/azure-ai-vision-sdk](https://github.com/Azure-Samples/azure-ai-vision-sdk) repository on GitHub.

## Getting help

If you need assistance using the Vision SDK or would like to report a bug or suggest new features, open a [GitHub issue in the samples repository](https://github.com/Azure-Samples/azure-ai-vision-sdk/issues). The SDK development team monitors these issues.

Before you create a new issue:
* Make sure you first scan to see if a similar issue already exists.
* Find the sample closest to your scenario and run it to see if you see the same issue in the sample code.

## Release notes

* **Vision SDK 0.15.1-beta.1** released September 2023.
  * Image Analysis Java JRE APIs for Windows x64 and Linux x64 were added.
  * Image Analysis can now be done from a memory buffer (C#, C++, Python, Java).
* **Vision SDK 0.13.0-beta.1** released July 2023. Image Analysis support was added for Universal Windows Platform (UWP) applications (C++, C#). Run-time package size reduction: Only the two native binaries
`Azure-AI-Vision-Native.dll` and `Azure-AI-Vision-Extension-Image.dll` are now needed.
* **Vision SDK 0.11.1-beta.1** released May 2023. Image Analysis APIs were updated to support [Background Removal](../how-to/background-removal.md).
* **Vision SDK 0.10.0-beta.1** released April 2023. Image Analysis APIs were updated to support [Dense Captions](../concept-describe-images-40.md?tabs=dense).
* **Vision SDK 0.9.0-beta.1** first released on March 2023, targeting Image Analysis applications on Windows and Linux platforms.


## Next steps

- [Install the SDK](./install-sdk.md)
- [Try the Image Analysis Quickstart](../quickstarts-sdk/image-analysis-client-library-40.md)
