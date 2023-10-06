---
title: What's new - Personalizer
titleSuffix: Azure AI services
description: This article contains news about Personalizer.
author: jcodella
ms.author: jacodel
ms.manager: nitinme
ms.service: azure-ai-personalizer
ms.topic: whats-new
ms.date: 05/28/2021
---
# What's new in Personalizer

Learn what's new in Azure AI Personalizer. These items may include release notes, videos, blog posts, and other types of information. Bookmark this page to keep up-to-date with the service.

## Release notes

### September 2022
* Personalizer Inference Explainabiltiy is now available as a Public Preview. Enabling inference explainability returns feature scores on every Rank API call, providing insight into how influential each feature is to the actions chosen by your Personalizer model. [Learn more about Inference Explainability](how-to-inference-explainability.md).
* Personalizer SDK now available in [Java](https://search.maven.org/artifact/com.azure/azure-ai-personalizer/1.0.0-beta.1/jar) and [Javascript](https://www.npmjs.com/package/@azure-rest/ai-personalizer).

### April 2022
* Local inference SDK (Preview): Personalizer now supports near-realtime (sub-10ms) inference without the need to wait for network API calls. Your Personalizer models can be used locally for lightning fast Rank calls using the [C# SDK (Preview)](https://www.nuget.org/packages/Azure.AI.Personalizer/2.0.0-beta.2), empowering your applications to personalize quickly and efficiently. Your model continues to train in Azure while your local model is seamlessly updated. 

### May 2021  - //Build conference

* Auto-Optimize (Preview) : You can configure a Personalizer loop that you are using to continuously improve over time with less work. Personalizer will automatically run offline evaluations, discover better machine learning settings, and apply them. To learn more, see [Personalizer Auto-Optimize (Preview)](concept-auto-optimization.md).
* Multi-slot personalization (Preview): If you have tiled layouts, carousels, and/or sidebars, it is easier to use Personalizer for each place that you recommend products or content on the same page. Personalizer now can now take a list of slots in the Rank API, assign an action to each, and learn from reward scores you send for each slot. To learn more, see [Multi-slot personalization (Preview)](concept-multi-slot-personalization.md).
* Personalizer is now available in more regions.
* Updated code samples (GitHub) and documentation. Use the links below to view updated samples:
  * [C#/.NET](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/dotnet/Personalizer)
  * [JavaScript](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/javascript/Personalizer)
  * [Python samples](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/python/Personalizer)

### July 2020

* New tutorial - [using Personalizer in a chat bot](tutorial-use-personalizer-chat-bot.md)

### June 2020

* New tutorial - [using Personalizer in a web app](tutorial-use-personalizer-web-app.md)

### May 2020 - //Build conference

The following are available in **Public Preview**:

 * [Apprentice mode](concept-apprentice-mode.md) as a learning behavior.

### March 2020

* TLS 1.2 is now enforced for all HTTP requests to this service. For more information, see [Azure AI services security](../security-features.md).

### November 2019 - Ignite conference

* Personalizer is generally available (GA)
* Azure Notebooks [tutorial](tutorial-use-azure-notebook-generate-loop-data.md) with entire lifecycle

### May 2019 - //Build conference

The following preview features were released at the Build 2019 Conference:

* [Rank and reward learning loop](what-is-personalizer.md)

## Videos

### 2019 Build videos

* [Deliver the Right Experiences & Content like Xbox with Azure AI Personalizer](https://azure.microsoft.com/resources/videos/build-2019-deliver-the-right-experiences-and-content-with-cognitive-services-personalizer/)

## Service updates

[Azure update announcements for Azure AI services](https://azure.microsoft.com/updates/?product=cognitive-services)

## Next steps

* [Quickstart: Create a feedback loop in C#](./quickstart-personalizer-sdk.md?pivots=programming-language-csharp%253fpivots%253dprogramming-language-csharp)
* [Use the interactive demo](https://personalizerdevdemo.azurewebsites.net/)
