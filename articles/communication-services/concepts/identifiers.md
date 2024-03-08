---
title: Communication Identifier types
titleSuffix: An Azure Communication Services concept
description: Understand identifier types and their usage
author: DominikMe
manager: RezaJooyandeh
services: azure-communication-services

ms.author: domessin
ms.date: 08/30/2022
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: identity
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
zone_pivot_groups: acs-js-csharp-java-python-ios-android-rest
---

# Understand identifier types

Communication Services SDKs and REST APIs use the *identifier* type to identify who is communicating with whom. For example, identifiers specify who to call, or who has sent a chat message.

Depending on context, identifiers get wrapped with extra properties, like inside the `ChatParticipant` in the Chat SDK or inside the `RemoteParticipant` in the Calling SDK.

In this article, you'll learn about different types of identifiers and how they look across programming languages. You'll also get tips on how to use them.


## The CommunicationIdentifier type

There are user identities that you create yourself and there are external identities. Microsoft Teams users and phone numbers are external identities that come to play in interop scenarios. Each of these different identity types has a corresponding identifier that represents it. An identifier is a structured type that offers type-safety and works well with your editor's code completion.

::: zone pivot="programming-language-javascript"
[!INCLUDE [Identifiers in the JavaScript SDK](./includes/identifiers/identifiers-js.md)]
::: zone-end

::: zone pivot="programming-language-csharp"
[!INCLUDE [Identifiers in the .NET SDK](./includes/identifiers/identifiers-net.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [Identifiers in the Python SDK](./includes/identifiers/identifiers-python.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [Identifiers in the Java SDK](./includes/identifiers/identifiers-java.md)]
::: zone-end

::: zone pivot="programming-language-ios"
[!INCLUDE [Identifiers in the iOS SDK](./includes/identifiers/identifiers-ios.md)]
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
* To learn how to use Communication Services together with Microsoft Teams, see [Teams interoperability](./teams-interop.md).
* To learn how to use a Raw ID, see [Use cases for string identifiers in Communication SDKs](./raw-id-use-cases.md).
