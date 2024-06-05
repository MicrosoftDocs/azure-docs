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
ms.date: 02/27/2024
ms.author: pafarley
---

# What's new in Azure AI Content Safety

Learn what's new in the service. These items might be release notes, videos, blog posts, and other types of information. Bookmark this page to stay up to date with new features, enhancements, fixes, and documentation updates.

## May 2024


### Custom categories (rapid) API

The custom categories (rapid) API lets you quickly define emerging harmful content patterns and scan text and images for matches. See [Custom categories (rapid)](./concepts/custom-categories-rapid.md) to learn more.

## March 2024

### Prompt Shields public preview

Previously known as **Jailbreak risk detection**, this updated feature detects User Prompt injection attacks, in which users deliberately exploit system vulnerabilities to elicit unauthorized behavior from large language model. Prompt Shields analyzes both direct user prompt attacks and indirect attacks that are embedded in input documents or images. See [Prompt Shields](./concepts/jailbreak-detection.md) to learn more.

### Groundedness detection public preview

The Groundedness detection API detects whether the text responses of large language models (LLMs) are grounded in the source materials provided by the users. Ungroundedness refers to instances where the LLMs produce information that is non-factual or inaccurate from what was present in the source materials. See [Groundedness detection](./concepts/groundedness.md) to learn more.


## January 2024

### Content Safety SDK GA

The Azure AI Content Safety service is now generally available through the following client library SDKs:

- **C#**: [Package](https://www.nuget.org/packages/Azure.AI.ContentSafety) | [API reference](/dotnet/api/overview/azure/ai.contentsafety-readme) | [Samples](https://github.com/Azure-Samples/AzureAIContentSafety/tree/main/dotnet/1.0.0) | Quickstarts: [Text](./quickstart-text.md), [Image](./quickstart-image.md)
- **Python**: [Package](https://pypi.org/project/azure-ai-contentsafety/) | [API reference](/python/api/overview/azure/ai-contentsafety-readme) | [Samples](https://github.com/Azure-Samples/AzureAIContentSafety/tree/main/python/1.0.0) | Quickstarts: [Text](./quickstart-text.md), [Image](./quickstart-image.md)
- **Java**: [Package](https://oss.sonatype.org/#nexus-search;quick~contentsafety) | [API reference](/java/api/overview/azure/ai-contentsafety-readme) | [Samples](https://github.com/Azure-Samples/AzureAIContentSafety/tree/main/java/1.0.0) | Quickstarts: [Text](./quickstart-text.md), [Image](./quickstart-image.md)
- **JavaScript**: [Package](https://www.npmjs.com/package/@azure-rest/ai-content-safety?activeTab=readme) | [API reference](https://www.npmjs.com/package/@azure-rest/ai-content-safety/v/1.0.0) | [Samples](https://github.com/Azure-Samples/AzureAIContentSafety/tree/main/js/1.0.0) | Quickstarts: [Text](./quickstart-text.md), [Image](./quickstart-image.md)

> [!IMPORTANT]
> The public preview versions of the Azure AI Content Safety SDKs will be deprecated by March 31, 2024. Please update your applications to use the GA versions.

## November 2023

### Jailbreak risk and Protected material detection (preview)

The new Jailbreak risk detection and Protected material detection APIs let you mitigate some of the risks when using generative AI.

- Jailbreak risk detection scans text for the risk of a [jailbreak attack](./concepts/jailbreak-detection.md) on a Large Language Model. [Quickstart](./quickstart-jailbreak.md)
- Protected material text detection scans AI-generated text for known text content (for example, song lyrics, articles, recipes, selected web content). [Quickstart](./quickstart-protected-material.md)

Jailbreak risk and Protected material detection are only available in select regions. See [Region availability](/azure/ai-services/content-safety/overview#region-availability).

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
