---
title: Communication Identifier types
titleSuffix: An Azure Communication Services concept
description: Learn about the identities and access tokens
author: domessin
manager: rejooyan
services: azure-communication-services

ms.author: tchladek
ms.date: 06/30/2021
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: identity
---

# Understand Identifier types

Communication Services has a uniform way to address who is communicating with whom: the *identifier*. The identifier type is used for specifying who to call, or to see who has sent a chat message, among many other places.
Identifiers are shared types across all Communication Services APIs and SDKs and hold the information that is needed to uniquely identify a communication participant. Depending on context they can get wrapped with additional properties, for example inside a `ChatParticipant` in the Chat SDK or inside a `RemoteParticipant` in the Calling SDK.

In this article you will learn about the different types of identifiers that Communication Services support, how they are represented in different languages, and further tips on how to use them.


## The CommunicationIdentifier type

Communication Services enables communication between communication user identities that you create yourself, as well as Microsoft Teams users, and PSTN phone numbers. Each of theses different identity types has a corresponding identifier that represents it. Identifiers are a structured types that offer type-safety and work well with your editor's auto-complete features.

::: zone pivot="programming-language-csharp"
[!INCLUDE [Identifiers in the .NET SDK](./includes/identifiers/identifiers-net.md)]
::: zone-end

::: zone pivot="programming-language-javascript"
[!INCLUDE [Identifiers in the JavaScript SDK](./includes/identifiers/identifiers-js.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [Identifiers in the Python SDK](./includes/identifiers/identifiers-python.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [Identifiers in the Java SDK](./includes/identifiers/identifiers-java.md)]
::: zone-end

::: zone pivot="programming-language-ios"
[!INCLUDE [Identifiers in the iOS SDK](./includes/identifiers/identifiers-java.md)]
::: zone-end

::: zone pivot="programming-language-android"
[!INCLUDE [Identifiers in the Android SDK](./includes/identifiers/identifiers-android.md)]
::: zone-end

::: zone pivot="programming-language-rest"
[!INCLUDE [Identifiers in the REST API](./includes/identifiers/identifiers-rest.md)]
::: zone-end


## Next steps

* For an introduction to communication identities, see [Identity model](./identity-model.md).
* To learn how to quickly create identities for testing, see the [quick-create identity quickstart](../quickstarts/identity/quick-create-identity.md).
