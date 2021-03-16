---
title: Azure Communication Services UI Framework overview
titleSuffix: An Azure Communication Services conceptual document
description: Learn about Azure Communication Services UI Framework
author: ddematheu2
ms.author: dademath
ms.date: 03/10/2021
ms.topic: quickstart
ms.service: azure-communication-services

---

# Azure Communication Services UI Framework

[!INCLUDE [Private Preview Notice](../../includes/private-preview-include.md)]

:::image type="content" source="../media/ui-framework/pre-and-custom-composite.png" alt-text="Comparison between pre-built and custom composites":::

Azure Communication Services UI Framework makes it easy for you to build modern communications user experiences. It gives you a library of production-ready UI components that you can drop into your applications:

- **Composite Components** - These components are turn-key solutions that implement common communication scenarios. You can quickly add video calling or chat experiences to their applications. Composites are open-source components built using base components.
- **Base Components** - These components are open-source building blocks that let you build custom communications experience. Components are offered for both calling and chat capabilities that can be combined to build experiences. 

These UI client libraries all use [Microsoft's Fluent design language](https://developer.microsoft.com/fluentui/) and assets. Fluent UI provides a foundational layer for the UI Framework that has been battle tested across Microsoft products.

## **Differentiating Components and Composites**

**Base Components** are built on top of core Azure Communication Services client libraries and implement basic actions such as initializing the core client libraries, rendering video, and providing user controls for muting, video on/off, etc. You can use these **Base Components** to build your own custom layout experiences using pre-built, production ready communication components.

:::image type="content" source="../media/ui-framework/component-overview.png" alt-text="Overview of component for UI Framework":::

**Composite Components** combine multiple **Base Components** to create more complete communication experiences. These higher-level components can be easily integrated into an existing app to drop a fully fledge communication experience without the task of building it from scratch. Developers can concentrate on building the surrounding experience and flow desired into their apps and leave the communications complexity to Composite Components.

:::image type="content" source="../media/ui-framework/composite-overview.png" alt-text="Overview of composite for UI Framework":::

## What UI Framework is best for my project?

Understanding these requirements will help you choose the right client library:

- **How much customization do you desire?** Azure Communication core client libraries don't have a UX and are designed so you can build whatever UX you want. UI Framework components provide UI assets at the cost of reduced customization.
- **Do you require Meeting features?** The Meeting system has several unique capabilities not currently available in the core Azure Communication Services client libraries, such as blurred background and raised hand.
- **What platforms are you targeting?** Different platforms have different capabilities.

Details about feature availability in the varied [UI SDKs is available here](ui-sdk-features.md), but key trade-offs are summarized below.

|Client library / SDK|Implementation Complexity|	Customization Ability|	Calling| Chat| [Teams Interop](./../teams-interop.md)
|---|---|---|---|---|---|---|
|Composite Components|Low|Low|✔|✔|✕
|Base Components|Medium|Medium|✔|✔|✕
|Core client libraries|High|High|✔|✔ |✔

## Cost

Usage of Azure UI Frameworks does not have any extra Azure cost or metering. You only pay for the
usage of the underlying service, using the same Calling, Chat, and PSTN meters.

## Supported use cases

Calling:

- Join Azure Communication Services call with Group ID

Chat:

- Join Azure Communication Services chat with Thread ID

## Supported identities:

An Azure Communication Services identity is required to initialize the UI Framework and authenticate to the service. For more information on authentication, see [Authentication](../authentication.md) and [Access Tokens](../../quickstarts/access-tokens.md)


## Recommended architecture 

:::image type="content" source="../media/ui-framework/framework-architecture.png" alt-text="UI Framework recommended architecture with client-server architecture ":::

Composite and Base Components are initialized using an Azure Communication Services access token. Access tokens should be procured from Azure Communication Services through a
trusted service that you manage. See [Quickstart: Create Access Tokens](../../quickstarts/access-tokens.md) and [Trusted Service Tutorial](../../tutorials/trusted-service-tutorial.md) for more information.

These client libraries also require the context for the call or chat they will join. Similar to user access tokens, this context should be disseminated to clients via your own trusted service. The list below summarizes the initialization and resource management functions that you need to operationalize.

| Contoso Responsibilities                                 | UI Framework Responsibilities                         |
|----------------------------------------------------------|-----------------------------------------------------------------|
| Provide access token from Azure                    | Pass through given access token to initialize components        |
| Provide refresh function                                 | Refresh access token using developer provided function          |
| Retrieve/Pass join information for call or chat          | Pass through call and chat information to initialize components |
| Retrieve/Pass user information for any custom data model | Pass through custom data model to components to render          |
