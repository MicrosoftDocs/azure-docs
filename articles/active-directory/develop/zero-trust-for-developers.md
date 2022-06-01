---
title: "Increase app security by following Zero Trust principles"
titleSuffix: Microsoft identity platform
description: Learn how following the Zero Trust principles can help increase the security of your application, its data, and which features of the Microsoft identity platform you can use to build Zero Trust-ready apps.
services: active-directory
author: chrischiedo
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 12/02/2021
ms.custom: template-concept
ms.author: cchiedo
ms.reviewer: nichola, arielsc, marsma

# Customer intent: As a developer, I want to learn about the Zero Trust principles and the features of the Microsoft identity platform that I can use to build applications that are Zero Trust-ready.
---

# Build Zero Trust-ready apps using Microsoft identity platform features and tools

You can no longer assume a secure network perimeter around the applications you build. Nearly every app you build will, by design, be accessed from outside the network perimeter. You also can't guarantee every app you build is secure or will remain so after it's deployed.

Knowing this as the app developer, it's your responsibility to not only maximize your app's security, but also minimize the damage your app can cause if it's compromised.

Additionally, you are responsible for supporting the evolving needs of your customers and users, who will expect that your application meets their Zero Trust security requirements.

By learning the principles of the [Zero Trust model](https://www.microsoft.com/security/business/zero-trust?rtc=1) and adopting their practices, you can:
- Build more secure apps
- Minimize the damage your apps could cause if there is a breach

## Zero Trust principles

The Zero Trust model prescribes a culture of explicit verification rather than implicit trust. The model is anchored on three key [guiding principles](/security/zero-trust/#guiding-principles-of-zero-trust):
- Verify explicitly
- Use least privileged access
- Assume breach

## Best practices for building Zero Trust-ready apps with the Microsoft identity platform

Follow these best practices to build Zero Trust-ready apps with the [Microsoft identity platform](./v2-overview.md) and its tools.

### Verify explicitly

The Microsoft identity platform offers authentication mechanisms for verifying the identity of the person or service accessing a resource. Apply the best practices described below to ensure that you *verify explicitly* any entities that need to access data or resources.

|Best practice   |Benefits to app security   |
|----------------|---------------------------|
|Use the [Microsoft Authentication Libraries](./reference-v2-libraries.md) (MSAL).|MSAL is a set of Microsoft's authentication libraries for developers. With MSAL, you can authenticate users and applications, and acquire tokens to access corporate resources using just a few lines of code. MSAL uses modern protocols ([OpenID Connect and OAuth 2.0](./active-directory-v2-protocols.md)) that remove the need for apps to ever handle a user's credentials directly. This vastly improves the security for both users and applications as the identity provider becomes the security perimeter. Also, these protocols continuously evolve to address new paradigms, opportunities, and challenges in identity security.|
|Adopt enhanced security extensions like [Continuous Access Evaluation](../conditional-access/concept-continuous-access-evaluation.md) (CAE) and Conditional Access authentication context when appropriate.|In Azure AD, some of the most used extensions include [Conditional Access](../conditional-access/overview.md), [Conditional Access authentication context](./developer-guide-conditional-access-authentication-context.md) and CAE. Applications that use enhanced security features like CAE and Conditional Access authentication context must be coded to handle claims challenges. Open protocols enable you to use the [claims challenges and claims requests](./claims-challenge.md) to invoke extra client capabilities. This might be to indicate to apps that they need to re-interact with Azure AD, like if there was an anomaly or if the user no longer satisfies the conditions under which they authenticated earlier. As a developer you can code for these extensions without disturbing their primary code flows for authentication.|
|Use the correct **authentication flow** by [app type](./v2-app-types.md) for authentication. For web applications, you should always aim to use [confidential client flows](./authentication-flows-app-scenarios.md#single-page-public-client-and-confidential-client-applications). For mobile applications, you should use [brokers](./msal-android-single-sign-on.md#sso-through-brokered-authentication) or the [system browser](./msal-android-single-sign-on.md#sso-through-system-browser) for authentication. |The flows for web applications that can hold a secret (confidential clients) are considered more secure than public clients (for example: Desktop and Console apps). When you use the system web browser to authenticate your mobile apps, you get a secure [single sign-on](../manage-apps/what-is-single-sign-on.md) (SSO) experience that supports app protection policies.|

### Use least privileged access

Using the Microsoft identity platform, you can grant permissions (scopes) and verify that a caller has been granted proper permission before allowing access. You can enforce least privileged access in your apps by enabling fine-grained permissions that allow you to grant the smallest amount of access necessary. Follow the practices described below to ensure you adhere to the [principle of least privilege](./secure-least-privileged-access.md).

| Do                                    | Don't          |
| ------------------------------------- | -------------- |
| Evaluate the permissions you request to ensure that you seek the absolute least privileged set to get the job done. | Create "catch-all" permissions with access to the entire API surface. |
| When designing APIs, provide granular permissions to allow least-privileged access. Start with dividing the functionality and data access into sections that can be controlled via [scopes](./v2-permissions-and-consent.md#scopes-and-permissions) and [App roles](./howto-add-app-roles-in-azure-ad-apps.md). | Add your APIs to existing permissions in a way that changes the semantics of the permission. |
| Offer **read-only** permissions. "*Write* access", includes privileges for create, update, and delete operations. A client should never require write access to only read data |   -----        |
| Offer both [delegated and application](/graph/auth/auth-concepts#delegated-and-application-permissions) permissions. Skipping application permissions can create hard requirement for your clients to achieve common scenarios like automation, microservices and more. |   -----        |
| Consider "standard" and "full" access permissions if working with sensitive data. Restrict the sensitive properties so that they cannot be accessed using a "standard" access permission, for example *Resource.Read*. And then implement a "full" access permission, for example *Resource.ReadFull*, that returns all available properties including sensitive information.|-----        |


### Assume breach

The Microsoft identity platform app registration portal is the primary entry point for applications intending to use the platform for their authentication and associated needs. When registering and configuring your apps, follow the practices described below to minimize the damage your apps could cause if there is a security breach. For more guidance, check [Azure AD application registration security best practices](./security-best-practices-for-app-registration.md).

:::image type="content" source="./media/zero-trust-for-developers/app-registration-portal.png" alt-text="Azure portal screenshot showing an app registration pane":::

| Do                                    | Don't          |
| ------------------------------------- | -------------- |
| Properly define your redirect URLs    | Use the same app registration for multiple apps  |
| Check redirect URIs used in your app registration for ownership and to avoid domain takeovers | Create your application as a multi-tenant unless you really intended to|
| Ensure app and service principal owners are always defined and maintained for your apps registered in your tenant |   -----        |


## Next steps

- Zero Trust [Guidance Center](/security/zero-trust/)
- Microsoft identity platform [best practices and recommendations](./identity-platform-integration-checklist.md).
