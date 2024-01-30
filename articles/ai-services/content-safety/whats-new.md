---
title: What's new in Azure AI Content Safety?
titleSuffix: Azure AI services
description: Stay up to date on recent releases and updates to Azure AI Content Safety.
#services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-content-safety
ms.custom: build-2023
ms.topic: overview
ms.date: 04/07/2023
ms.author: pafarley
---

# What's new in Azure AI Content Safety

Learn what's new in the service. These items might be release notes, videos, blog posts, and other types of information. Bookmark this page to stay up to date with new features, enhancements, fixes, and documentation updates.

## January 2024

### Content Safety SDK GA

The Azure AI Content Safety service is now generally available through the following client library SDKs:

- **C#**: [Package](https://www.nuget.org/packages/Azure.AI.ContentSafety) | [API reference](/dotnet/api/overview/azure/ai.contentsafety-readme?view=azure-dotnet) | [Samples](https://github.com/Azure-Samples/AzureAIContentSafety/tree/main/dotnet/1.0.0)
- **Python**: [Package](https://pypi.org/project/azure-ai-contentsafety/) | [API reference](/python/api/overview/azure/ai-contentsafety-readme?view=azure-python) | [Samples](https://github.com/Azure-Samples/AzureAIContentSafety/tree/main/python/1.0.0)
- **Java**: [Package](https://oss.sonatype.org/#nexus-search;quick~contentsafety) | [API reference](/java/api/overview/azure/ai-contentsafety-readme?view=azure-java-stable) | [Samples](https://github.com/Azure-Samples/AzureAIContentSafety/tree/main/java/1.0.0)
- **JavaScript**: [Package](https://www.npmjs.com/package/@azure-rest/ai-content-safety?activeTab=readme) | [API reference](https://www.npmjs.com/package/@azure-rest/ai-content-safety/v/1.0.0) | [Samples](https://github.com/Azure-Samples/AzureAIContentSafety/tree/main/js/1.0.0)

## November 2023

### Jailbreak risk and Protected material detection (preview)

The new Jailbreak risk detection and Protected material detection APIs let you mitigate some of the risks when using generative AI.

- Jailbreak risk detection scans text for the risk of a [jailbreak attack](./concepts/jailbreak-detection.md) on a Large Language Model. [Quickstart](./quickstart-jailbreak.md)
- Protected material text detection scans AI-generated text for known text content (for example, song lyrics, articles, recipes, selected web content). [Quickstart](./quickstart-protected-material.md)

Jailbreak risk and Protected material detection are available in the East US and West Europe Azure regions.

## October 2023

### Azure AI Content Safety is generally available (GA)

The Azure AI Content Safety service is now generally available as a cloud service.
- The service is available in many more Azure regions. See the [Overview](./overview.md) for a list.
- The return formats of the Analyze APIs have changed. See the [Quickstarts](./quickstart-text.md) for the latest examples.
- The names and return formats of several APIs have changed. See the [Migration guide](./how-to/migrate-to-general-availability.md) for a full list of breaking changes. Other guides and quickstarts now reflect the GA version.

### Azure AI Content Safety Java and JavaScript SDKs

The Azure AI Content Safety service is now available through Java and JavaScript SDKs. The SDKs are available on [Maven](https://central.sonatype.com/artifact/com.azure/azure-ai-contentsafety) and [npm](https://www.npmjs.com/package/@azure-rest/ai-content-safety). Follow a [quickstart](./quickstart-text.md) to get started.

## July 2023

### Azure AI Content Safety C# SDK

The Azure AI Content Safety service is now available through a C# SDK. The SDK is available on [NuGet](https://www.nuget.org/packages/Azure.AI.ContentSafety/). Follow a [quickstart](./quickstart-text.md) to get started.

## May 2023

### Azure AI Content Safety public preview

Azure AI Content Safety detects material that is potentially offensive, risky, or otherwise undesirable. This service offers state-of-the-art text and image models that detect problematic content. Azure AI Content Safety helps make applications and services safer from harmful user-generated and AI-generated content. Follow a [quickstart](./quickstart-text.md) to get started.

## Azure AI services updates

[Azure update announcements for Azure AI services](https://azure.microsoft.com/updates/?product=cognitive-services)
