---
title: UI Library overview
titleSuffix: An Azure Communication Services concept document
description: Learn about the Azure Communication Services UI Library.
author: ddematheu2
manager: chrispalm
services: azure-communication-services

ms.author: dademath
ms.date: 06/30/2021
ms.topic: conceptual
ms.service: azure-communication-services
zone_pivot_groups: acs-plat-web-mobile
---

# UI Library Overview

Azure Communication Services - UI Library makes it easy for you to build modern communications user experiences using Azure Communication Services. 
It gives you a library of production-ready UI components that you can drop into your applications:

- **Composites** - These components are turn-key solutions that implement common communication scenarios.
  You can quickly add video calling or chat experiences to your applications.
  Composites are open-source higher order components built using UI components.

- **UI Components** - These components are open-source building blocks that let you build custom communications experience.
  Components are offered for both calling and chat capabilities that can be combined to build experiences.

These UI client libraries all use [Microsoft's Fluent design language](https://developer.microsoft.com/fluentui/) and assets. Fluent UI provides a foundational layer for the UI Library and is actively used across Microsoft products.

In conjunction to the UI components, the UI Library exposes a stateful client library for calling and chat.
This client is agnostic to any specific state management framework and can be integrated with common state managers like Redux or React Context.
This stateful client library can be used with the UI Components to pass props and methods for the UI Components to render data. For more information, see [Stateful Client Overview](https://azure.github.io/communication-ui-library/?path=/story/stateful-client-what-is-stateful--page).

::: zone pivot="platform-web"
[!INCLUDE [Web UI Library](includes/web-ui-library.md)]
::: zone-end

::: zone pivot="platform-mobile"
[!INCLUDE [Mobile UI Library](includes/mobile-ui-library.md)]
::: zone-end
