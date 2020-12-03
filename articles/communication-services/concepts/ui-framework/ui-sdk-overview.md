---
title: Create your Own UI Framework Component
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you'll learn how to join an Teams meeting with the Azure Communication Calling SDK
author: ddematheu2
ms.author: dademath
ms.date: 11/16/2020
ms.topic: quickstart
ms.service: azure-communication-services

---

# Azure Communication Services UI Framework

:::image type="content" source="../media/ui framework/preandcustomcomposite.png" alt-text="Comparison between pre-built and custom composites":::

Azure Communication Services UI Framework simplifies building modern user experiences. You can choose from
different production-ready UI SDKs options depending on your customization, performance, and feature needs:

- **Composite Components** - Turn-key solutions that implement common communication scenarios. Developers can quickly add video calling or chat experiences to their applications. Composites come in two flavors depending on the scenario required:
  - **Open-Source Composites** - These are open-source UI composite components built on the core Azure Communication SDKs that deliver core voice and video calling, chat, and SMS experiences.
  - **Meeting Composite** - These are closed-source components focused on meeting experiences that leverage collaboration between Azure Communication Services and Teams. They include certain features unique to the meeting system, but provide a lower level of customization. More info: [UI Framework Meetings](./meetings.md)
- **Base Components** - These are open-source building blocks that enable developers to build custom communications experience. 

These UI SDKs all use [Microsoft's Fluent design language](https://developer.microsoft.com/fluentui/) and assets. The Meeting system is designed to match Microsoft Team's default meeting experience. 

## **Differentiating Components and Composites**

**Base Components** wrap the core Azure Communication SDKs and solve for basic actions such as initializing the core SDKs, rendering video, and providing user controls for muting, video on/off, etc. Developers can leverage these **Base Components** to build their own custom layout experiences using pre-built, production ready communication components.

:::image type="content" source="../media/ui framework/componentoverview.png" alt-text="Overview of component for UI Framework":::

**Composite Components** combine multiple **Base Components** to create more complete communication
experiences. These higher-level components abstract the combination of
**Base Components** so you can concentrate on your app's
business logic. For example, if you want to bring a text chat experience into
an app, you simply import the chat composite component and initialize it. You don't need to worry about individual UI elements such as the text message window, or how multiple elements work with each other, or how these UI elements bind to the underling Azure Communication Services data plane. 

:::image type="content" source="../media/ui framework/compositeoverview.png" alt-text="Overview of composite for UI Framework":::

You can also create your own custom **Composite Components** 
using desired **Base Components.** This allows for customization, such as modifying mute iconography, while still benefiting from UX controls for the rest of the application. 

## What UI Framework is best for my project?
Understanding these requirements will help you pick the right SDK:

1. **How much customization do you desire?** Azure Communication core SDKs do not have a UX and are designed so you can build whatever UX you want. Base components, and composites provide UI assets at the the cost of reduced customization.
1. **Do you require Meeting features?** The Meeting system has several unique capabilities not currently available in the core Azure SDKs, such as blurred backgrounds. 
3. **What platforms are you targeting?** Differant platforms have differant capabilities.

Details about feature availability in the varied [UI SDKs is available here](ui-sdk-features.md), but key trade-offs are summarized below.

|SDK|Implementation Complexity|	Customization Ability|	Calling|	Chat|	SMS|	Meetings
|--|--|-|-|-|-|-|
|Open-Source Composite	|Medium|	High|	✔	|✔|	✔|❌	
|Meeting Composite|	Low	|Low|❌|❌|❌|✔
|Base Components|	High|	High|	✔	|✔	|✔|❌	
|Core SDKs|	High|	High|	✔|	✔	|✔|❌	

## Cost

Usage of Azure UI Frameworks does not have any additional Azure cost or metering. You only pay for the
usage of the underlying service, using the same Calling, Chat, and PSTN meters.

## Supported use cases

Calling:

1.  Join Teams Meeting Call
2.  Join Azure Communication Services call with Group Id
3.  Start a VoIP call to a Teams user
4.  Start a VoIP call to another Azure Communication Services user
5.  Start a PSTN call to a phone number using Azure Communication Services
    procured phone number

Chat:

1.  Join a Teams Meeting Chat
2.  Join Azure Communication Services chat with Thread Id

## Supported identities:

An ACS identity is required to initialize the UI Framework and authenticate to the service. 

## Customizability

UI Framework is built with customization in mind in terms of themes, sizing,
layouts and data models:

-   Themes: Change color schemes on Base and Composite Components to match your
    branding style.

-   Sizing: Resize Base and Composite Components to match your desired
    specification.

-   Layouts: Use Base Components to create custom layouts that match your specific
    experience.

-   Data Models: Provide your own application specific data models that match
    your identities to Azure Communication Services identities to customize
    display names and avatar images for communication experiences.

## Recommended Architecture 

:::image type="content" source="../media/ui framework/frameworkarchitecture.png" alt-text="UI Framework recommended architecture with client server architecture ":::

Composite and Base Components are initialized using an Azure
Communication Services access token. Access tokens should be procured from Azure Communication Services through a
trusted service you manage. 

These SDKs also require the context for the call or chat they will join. Similar to user access tokens, these context should be disseminated to clients via your own trusted service. The list below summarizes the initialization and resource management functions that you need to operationalize.

| Contoso Responsibilities                                 | UI Framework Composite Responsibilities                         |
|----------------------------------------------------------|-----------------------------------------------------------------|
| Provide access token from Azure                    | Pass through given access token to initialize components        |
| Provide refresh function                                 | Refresh access token using developer provided function          |
| Retrieve/Pass join information for call or chat          | Pass through call and chat information to initialize components |
| Retrieve/Pass user information for any custom data model | Pass through custom data model to components to render          |
