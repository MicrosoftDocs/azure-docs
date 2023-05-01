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
<!--   The content is mostly copied from https://learn.microsoft.com/en-us/azure/active-directory/external-identities/identity-providers. For now the text is used as a placeholder in the release branch, until further notice. -->

# Custom authentication extensions

Azure AD for customers is designed for flexibility. In addition to the built-in authentication events within a sign-up and sign-in user flow, you can define actions for events at various points within the authentication flow.

Custom authentication extensions in Azure Active Directory let you interact with external systems during a user authentication. The custom authentication extension contains information about your REST API endpoint, the credentials to call the REST API, the attributes that it returns, and when the REST API should be called.

Custom authentication extensions are triggered at particular parts of the authentication flow. The following diagram shows the currently supported trigger points during the authentication flow:

![Diagram showing extensibility points in the authentication flow.](media/concept-planning-your-solution/authentication-flow-events.png)

You can extend the authentication flow at three points:

- Before attribute collection using the **OnAttributeCollectionStart** event.

- Upon attribute submission using the **OnAttributeCollectionSubmit** event.

- Before token issuance using the **OnTokenIssuanceStart** event.

This article provides an overview of custom authentication extensions for Azure Active Directory (Azure AD) for customers.

## OnAttributeCollectionStart

The *OnAttributeCollectionStart* event occurs at the beginning of the attribute collection process during sign-up for a new user. You can use this event to block sign-up (for example, based on the domain they're authenticating from) or modify the initial attributes to be collected.

## OnAttributeCollectionSubmit

The *OnAttributeCollectionSubmit* event is fired after the user provides attribute information during signing up and can be used to validate the information provided by the user (such as an invitation code or partner number), modify the collected attributes (such as address validation), and either allow the user to continue in the journey or show a validation or block page.

## OnTokenIssuanceStart

The token issuance start event is triggered once a user completes all of their authentication challenges, and a security token is about to be issued.

When users authenticate to your application with Azure Active Directory, a security token is returned to your application. The security token contains claims that are statements about the user, such as name, unique identifier, or application roles.  Beyond the default set of claims that are contained in the security token, you can define your own custom claims from external systems using a REST API you develop.  

In some cases, key data might be stored in systems external to Microsoft Entra, such as a secondary email, billing tier, or sensitive information. It's not always feasible for the information in the external system to be stored in the Azure AD directory. For these scenarios, you can use a custom authentication extension and a custom claims provider to add this external data into tokens returned to your application.

A token issuance event extension involves the following components:

- **Custom claims provider**. To customize the token return to your applications, enterprise applications in your Azure AD tenant can configure custom claims provider to fetch data from external systems. The custom claims provider points to a custom extension and specifies the attributes to be added to the security token. Multiple claims provider can share the same custom extension. So, each application can choose its own set of attributes to be added to the security token.

- **REST API endpoint**. When an event fires, Azure AD sends an HTTP request, to your REST API endpoint. The REST API can be an Azure Function, Azure Logic App, or some other publicly available API endpoint. Your REST API endpoint is responsible for interfacing with downstream databases, existing APIs, LDAP directories, or any other stores that contain the attributes you'd like to add to the token configuration.

   The REST API returns an HTTP response, or action, back to Azure AD containing the attributes. Attributes that return by your REST API aren't automatically added to a token. Instead, an application's claims mapping policy must be configured for any attribute to be included in the token.

Learn more about [Custom authentication extensions](../../develop/custom-extension-overview.md?context=/azure/active-directory/external-identities/customers/context/customers-context) and [Adding claims from external systems](../../develop/custom-claims-provider-overview.md?context=/azure/active-directory/external-identities/customers/context/customers-context).

## Next steps

- To learn how custom extensions work, see [Custom authentication extensions](../../develop/custom-extension-overview.md).
- See how to [configure a custom authentication extension](how-to-configure-custom-extension.md) for the OnAttributeCollectionStart or OnAttributeCollectionSubmit event.
- See how to [configure an OnTokenIssuanceStart custom authentication extension](../../develop/custom-extension-get-started.md?context=/azure/active-directory/external-identities/customers/context/customers-context) using a custom claims provider.
