---
title: What's new - Personalizer
titleSuffix: Azure Cognitive Services
description: This article contains news about Personalizer.
manager: nitinme
services: cognitive-services
ms.service: cognitive-services
ms.subservice: personalizer
ms.topic: overview
ms.date: 05/28/2021
---
# What's new in Personalizer

Learn what's new in the service. These items may include release notes, videos, blog posts, and other types of information. Bookmark this page to keep up-to-date with the service.

## Release notes

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

* TLS 1.2 is now enforced for all HTTP requests to this service. For more information, see [Azure Cognitive Services security](../cognitive-services-security.md).

### November 2019 - Ignite conference

* Personalizer is generally available (GA)
* Azure Notebooks [tutorial](tutorial-use-azure-notebook-generate-loop-data.md) with entire lifecycle

### May 2019 - //Build conference

The following preview features were released at the Build 2019 Conference:

* [Rank and reward learning loop](what-is-personalizer.md)

## Videos

### 2019 Build videos

* [Deliver the Right Experiences & Content like Xbox with Cognitive Services Personalizer](https://azure.microsoft.com/resources/videos/build-2019-deliver-the-right-experiences-and-content-with-cognitive-services-personalizer/)

## Service updates

[Azure update announcements for Cognitive Services](https://azure.microsoft.com/updates/?product=cognitive-services)

## Next steps

* [Quickstart: Create a feedback loop in C#](./quickstart-personalizer-sdk.md?pivots=programming-language-csharp%253fpivots%253dprogramming-language-csharp)
* [Use the interactive demo](https://personalizationdemo.azurewebsites.net/)