---
title: Custom authentication extension 
titleSuffix: Microsoft identity platform
description: Use Microsoft Entra custom authentication extensions to customize your user's sign-in experience by using REST APIs or outbound webhooks.
services: active-directory
author: yoelhor
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: conceptual
ms.date: 03/06/2023
ms.author: davidmu
ms.reviewer: JasSuri
ms.custom: aaddev 
#Customer intent: As a developer, I want to learn about custom authentication extensions so that I can augment tokens with claims from an external identity system or role management system.
---

# Custom authentication extensions (preview)

This article provides an overview of custom authentication extensions for Microsoft Entra ID. Custom authentication extensions allow you to customize the Microsoft Entra authentication experience, by integrating with external systems.

The following diagram depicts the sign-in flow integrated with a custom authentication extension.

:::image type="content" source="media/custom-extension-overview/workflow.png" alt-text="Diagram that shows a token being augmented with claims from an external source." border="false" lightbox="media/custom-extension-overview/workflow.png":::

1. A user attempts to sign into an app and is redirected to the Microsoft Entra sign-in page.
1. Once a user completes a certain step in the authentication, an **event listener** is triggered.
1. The Microsoft Entra **event listener** service (custom authentication extension) sends an HTTP request to your **REST API endpoint**. The request contains information about the event, the user profile, session data, and other context information.
1. The **REST API** performs a custom workflow.
1. The **REST API** returns an HTTP response to Microsoft Entra ID.
1. The Microsoft Entra **custom authentication extension** processes the response and customizes the authentication based on the event type and the HTTP response payload.
1. A **token** is returned to the **app**.

## Custom authentication extension REST API endpoint

When an event fires, Microsoft Entra ID calls a REST API endpoint you own. The request to the REST API contains information about the event, the user profile, authentication request data, and other context information.

You can use any programming language, framework, and hosting environment to create and host your custom authentication extensions REST API. For a quick way to get started, use a C# Azure Function. Azure Functions lets you run your code in a serverless environment without having to first create a virtual machine (VM) or publish a web application. 

Your REST API must handle:

- Token validation for securing the REST API calls.
- Business logic
- Incoming and outgoing validation of HTTP request and response schemas.
- Auditing and logging.
- Availability, performance and security controls.

### Protect your REST API

To ensure the communications between the custom authentication  extension and your REST API are secured appropriately, multiple security controls must be applied.

1. When the custom authentication extension calls your REST API, it sends an HTTP `Authorization` header with a bearer token issued by Microsoft Entra ID.
1. The bearer token contains an `appid` or `azp` claim. Validate that the respective claim contains the  `99045fe1-7639-4a75-9d4a-577b6ca3810f` value. This value ensures that the Microsoft Entra ID is the one who calls the REST API.
    1. For **V1** Applications, validate the `appid` claim.
    1. For **V2** Applications, validate the `azp` claim.
1. The bearer token `aud` audience claim contains the ID of the associated application registration. Your REST API endpoint needs to validate that the bearer token is issued for that specific audience.

## Custom claims provider

A custom claims provider is a type of custom authentication extension that calls a REST API to fetch claims from external systems. A custom claims provider can be assigned to one or many applications in your directory and maps claims from external systems into tokens.

Learn more about [custom claims providers](custom-claims-provider-overview.md).

## Next steps

- Learn more about [custom claim providers](custom-claims-provider-overview.md).
- Learn how to [create and register a custom claims provider](custom-extension-get-started.md) with a sample OpenID Connect application.
- If you already have a custom claims provider registered, you can configure a [SAML application](custom-extension-configure-saml-app.md) to receive tokens with claims sourced from an external store.
