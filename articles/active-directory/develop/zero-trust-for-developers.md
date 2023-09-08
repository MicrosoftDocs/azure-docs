---
title: "Increase application security using Zero Trust principles"
description: Learn how using Zero Trust principles can help increase the security of your application and its data.
services: active-directory
author: davidmu1
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 01/06/2023
ms.custom: template-concept
ms.author: davidmu
ms.reviewer: nichola, arielsc

# Customer intent: As a developer, I want to learn about the Zero Trust principles and the features of the Microsoft identity platform that I can use to build applications that are Zero Trust-ready.
---

# Increase application security using Zero Trust principles

A secure network perimeter around the applications that are developed can't be assumed. Nearly every developed application, by design, will be accessed from outside the network perimeter. Applications can't be guaranteed to be secure when they're developed or will remain so after they're deployed. It's the responsibility of the application developer to not only maximize the security of the application, but also minimize the damage the application can cause if it's compromised.

Additionally, the responsibility includes supporting the evolving needs of the customers and users, who expect that the application meets Zero Trust security requirements. Learn the principles of the [Zero Trust model](https://www.microsoft.com/security/business/zero-trust?rtc=1) and adopt the practices. By learning and adopting the principles, applications can be developed that are more secure and that minimize the damage they could cause if there's a break in security.

The Zero Trust model prescribes a culture of explicit verification rather than implicit trust. The model is anchored on three key [guiding principles](/security/zero-trust/#guiding-principles-of-zero-trust):

- Verify explicitly
- Use least privileged access
- Assume breach

## Zero Trust best practices

Follow these best practices to build Zero Trust-ready applications with the [Microsoft identity platform](./v2-overview.md) and its tools.

### Verify explicitly

The Microsoft identity platform offers authentication mechanisms for verifying the identity of the person or service accessing a resource. Apply the best practices described below to *verify explicitly* any entities that need to access data or resources.

| Best practice | Benefits to application security |
| ------------- | -------------------------------- |
| Use the [Microsoft Authentication Libraries](./reference-v2-libraries.md) (MSAL). | MSAL is a set of Microsoft Authentication Libraries for developers. With MSAL, users and applications can be authenticated, and tokens can be acquired to access corporate resources using just a few lines of code. MSAL uses modern protocols ([OpenID Connect and OAuth 2.0](./active-directory-v2-protocols.md)) that remove the need for applications to ever handle a user's credentials directly. This handling of credentials vastly improves the security for both users and applications as the identity provider becomes the security perimeter. Also, these protocols continuously evolve to address new paradigms, opportunities, and challenges in identity security. |
| Adopt enhanced security extensions like [Continuous Access Evaluation](../conditional-access/concept-continuous-access-evaluation.md) (CAE) and Conditional Access authentication context when appropriate. | In Azure AD, some of the most used extensions include [Conditional Access](../conditional-access/overview.md), [Conditional Access authentication context](./developer-guide-conditional-access-authentication-context.md) and CAE. Applications that use enhanced security features like CAE and Conditional Access authentication context must be coded to handle claims challenges. Open protocols enable the [claims challenges and claims requests](./claims-challenge.md) to be used to invoke extra client capabilities. The capabilities might be to continue interaction with Azure AD, such as when there was an anomaly or if the user authentication conditions change. These extensions can be coded into an application without disturbing the primary code flows for authentication. |
| Use the correct **authentication flow** by [application type](./v2-app-types.md). For web applications, always try to use [confidential client flows](./authentication-flows-app-scenarios.md#single-page-public-client-and-confidential-client-applications). For mobile applications, try to use [brokers](./msal-android-single-sign-on.md#sso-through-brokered-authentication) or the [system browser](./msal-android-single-sign-on.md#sso-through-system-browser) for authentication. | The flows for web applications that can hold a secret (confidential clients) are considered more secure than public clients (for example: Desktop and Console applications). When the system web browser is used to authenticate a mobile application, a secure [Single Sign-On](../manage-apps/what-is-single-sign-on.md) (SSO) experience enables the use of application protection policies. |

### Use least privileged access

A developer uses the Microsoft identity platform to grant permissions (scopes) and verify that a caller has been granted proper permission before allowing access. Enforce least privileged access in applications by enabling fine-grained permissions that allow the smallest amount of access necessary to be granted. Consider the following practices to make sure of adherence to the [principle of least privilege](./secure-least-privileged-access.md):

- Evaluate the permissions that are requested to make sure that the absolute least privileged is set to get the job done. Don't create "catch-all" permissions with access to the entire API surface.
- When designing APIs, provide granular permissions to allow least-privileged access. Start with dividing the functionality and data access into sections that can be controlled by using [scopes](./v2-permissions-and-consent.md#scopes-and-permissions) and [App roles](./howto-add-app-roles-in-azure-ad-apps.md). Don't add APIs to existing permissions in a way that changes the semantics of the permission.
- Offer **read-only** permissions. `Write` access, includes privileges for create, update, and delete operations. A client should never require write access to only read data.
- Offer both [delegated and application](/graph/auth/auth-concepts#delegated-and-application-permissions) permissions. Skipping application permissions can create hard requirement for clients to achieve common scenarios like automation, microservices and more.
- Consider "standard" and "full" access permissions if working with sensitive data. Restrict the sensitive properties so that they can't be accessed using a "standard" access permission, for example `Resource.Read`. And then implement a "full" access permission, for example `Resource.ReadFull` that returns all available properties including sensitive information.

### Assume breach

The Microsoft identity platform application registration portal is the primary entry point for applications intending to use the platform for their authentication and associated needs. When registering and configuring applications, follow the practices described below to minimize the damage they could cause if there's a security breach. For more information, see [Azure AD application registration security best practices](./security-best-practices-for-app-registration.md).

Consider the following actions prevent breaches in security:

- Properly define the redirect URIs for the application. Don't use the same application registration for multiple applications.
- Verify redirect URIs used in the application registration for ownership and to avoid domain takeovers. Don't create the application as a multi-tenant unless it's intended to be. |
- Make sure application and service principal owners are always defined and maintained for the applications registered in the tenant.

## Next steps

- Zero Trust [Guidance Center](/security/zero-trust/)
- Microsoft identity platform [best practices and recommendations](./identity-platform-integration-checklist.md).
