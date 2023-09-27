---
title: Custom extensions in a customer tenant
description: Learn about custom authentication extensions that let you enrich or customize application tokens with information from external systems.  
services: active-directory
author: msmimart
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: conceptual
ms.date: 04/30/2023
ms.author: mimart
ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to know 

---
# Add your own business logic

Microsoft Entra ID for customers is designed for flexibility. In addition to the built-in authentication events within a sign-up and sign-in user flow, you can define actions for events at various points within the authentication flow.

Custom authentication extensions in Microsoft Entra ID let you interact with external systems during a user authentication. The custom authentication extension contains information about your REST API endpoint, the credentials to call the REST API, the attributes that it returns, and when the REST API should be called.

You can create a custom authentication extension using the **OnTokenIssuanceStart** event, which is triggered just before a token is issued to the application:

:::image type="content" source="media/concept-custom-extensions/authentication-flow-events-inline.png" alt-text="Diagram showing extensibility points in the authentication flow." lightbox="media/concept-custom-extensions/authentication-flow-events-expanded.png" border="false":::

This article provides an overview of custom authentication extensions in Microsoft Entra ID for customers.

## Token issuance start event

The token issuance start event is triggered once a user completes all of their authentication challenges, and a security token is about to be issued.

When users authenticate to your application with Microsoft Entra ID, a security token is returned to your application. The security token contains claims that are statements about the user, such as name, unique identifier, or application roles.  Beyond the default set of claims that are contained in the security token, you can define your own custom claims from external systems using a REST API you develop.  

In some cases, key data might be stored in systems external to Microsoft Entra, such as a secondary email, billing tier, or sensitive information. It's not always feasible for the information in the external system to be stored in the Microsoft Entra directory. For these scenarios, you can use a custom authentication extension and a custom claims provider to add this external data into tokens returned to your application.

A token issuance event extension involves the following components:

- **Custom claims provider**. To customize the token return to your applications, enterprise applications in your Microsoft Entra tenant can configure custom claims provider to fetch data from external systems. The custom claims provider points to a custom extension and specifies the attributes to be added to the security token. Multiple claims provider can share the same custom extension. So, each application can choose its own set of attributes to be added to the security token.

- **REST API endpoint**. When an event fires, Microsoft Entra ID sends an HTTP request, to your REST API endpoint. The REST API can be an Azure Function, Azure Logic App, or some other publicly available API endpoint. Your REST API endpoint is responsible for interfacing with downstream databases, existing APIs, LDAP directories, or any other stores that contain the attributes you'd like to add to the token configuration.

   The REST API returns an HTTP response, or action, back to Microsoft Entra ID containing the attributes. Attributes that return by your REST API aren't automatically added to a token. Instead, an application's claims mapping policy must be configured for any attribute to be included in the token.

For details, see:

- [About custom authentication extensions](../../develop/custom-extension-overview.md?context=/azure/active-directory/external-identities/customers/context/customers-context)  
- [Configure a custom claims provider token issuance event](../../develop/custom-extension-get-started.md?context=/azure/active-directory/external-identities/customers/context/customers-context) using a custom claims provider.

## Next steps

- To learn more about how custom extensions work, see [Custom authentication extensions](../../develop/custom-extension-overview.md?context=/azure/active-directory/external-identities/customers/context/customers-context).
- Configure a [custom claims provider token issuance event](../../develop/custom-extension-get-started.md?context=/azure/active-directory/external-identities/customers/context/customers-context).
- See the [Microsoft Entra ID for customers Developer Center](https://aka.ms/ciam/dev) for the latest developer content and resources.
