---
title: Azure Active Directory B2C custom policies | Microsoft Docs
description: Learn about Azure Active Directory B2C custom policies.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 03/20/2019
ms.author: marsma
ms.subservice: B2C
---

# Custom policies in Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

Custom policies are configuration files that define the behavior of your Azure Active Directory (Azure AD) B2C tenant. User flows are predefined in the Azure AD B2C portal for the most common identity tasks. Custom policies can be fully edited by an identity developer to complete many different tasks.

## Comparing user flows and custom policies

| | User flows | Custom policies |
|-|-------------------|-----------------|
| Target users | All application developers with or without identity expertise. | Identity pros, systems integrators, consultants, and in-house identity teams. They are comfortable with OpenIDConnect flows and understand identity providers and claims-based authentication. |
| Configuration method | Azure portal with a user-friendly user-interface (UI). | Directly editing XML files and then uploading to the Azure portal. |
| UI customization | Full UI customization including HTML, CSS and JavaScript.<br><br>Multilanguage support with Custom strings. | Same |
| Attribute customization | Standard and custom attributes. | Same |
| Token and session management | Custom token and multiple session options. | Same |
| Identity Providers | Predefined local or social provider and most OIDC identity providers, such as federation with Azure Active Directory tenants. | Standards-based OIDC, OAUTH, and SAML.  Authentication is also possible by using integration with REST APIs. |
| Identity Tasks | Sign-up or sign-in with local or many social accounts.<br><br>Self-service password reset.<br><br>Profile edit.<br><br>Multi-Factor Authentication.<br><br>Customize tokens and sessions.<br><br>Access token flows. | Complete the same tasks as user flows using custom identity providers or use custom scopes.<br><br>Provision a user account in another system at the time of registration.<br><br>Send a welcome email using your own email service provider.<br><br>Use a user store outside Azure AD B2C.<br><br>Validate user provided information with a trusted system by using an API. |

## Policy files

These three types of policy files are used:

- **Base file** - contains most of the definitions. It is recommended that you make a minimum number of changes to this file to help with troubleshooting, and long-term maintenance of your policies.
- **Extensions file** - holds the unique configuration changes for your tenant.
- **Relying Party (RP) file** - The single task-focused file that is invoked directly by the application or service (also, known as a Relying Party). Each unique task requires its own RP and depending on branding requirements, the number might be "total of applications x total number of use cases."

User flows in Azure AD B2C follow the three-file pattern depicted above, but the developer only sees the RP file, while the Azure portal makes changes in the background to the extensions file.

## Custom policy core concepts

The customer identity and access management (CIAM) service in Azure includes:

- A user directory that is accessible by using Microsoft Graph and which holds user data for both local accounts and federated accounts.
- Access to the **Identity Experience Framework** that orchestrates trust between users and entities and passes claims between them to complete an identity or access management task. 
- A security token service (STS) that issues ID tokens, refresh tokens, and access tokens (and equivalent SAML assertions) and validates them to protect resources.

Azure AD B2C interacts with identity providers, users, other systems, and with the local user directory in sequence to achieve an identity task. For example, sign in a user, register a new user, or reset a password. The Identity Experience Framework and a policy (also called a user journey or a trust framework policy) establishes multi-party trust and explicitly defines the actors, the actions, the protocols, and the sequence of steps to complete.

The Identity Experience Framework is a fully configurable, policy-driven, cloud-based Azure platform that orchestrates trust between entities in standard protocol formats such as OpenIDConnect, OAuth, SAML, WSFed, and a few non-standard ones, for example REST API-based system-to-system claims exchanges. The framework creates user-friendly, white-labeled experiences that support HTML and CSS.

A custom policy is represented as one or several XML-formatted files that refer to each other in a hierarchical chain. The XML elements define the claims schema, claims transformations, content definitions, claims providers, technical profiles, and user journey orchestration steps, among other elements. A custom policy is accessible as one or several XML files that are executed by the Identity Experience Framework when invoked by a relying party. Developers configuring custom policies must define the trusted relationships in careful detail to include metadata endpoints, exact claims exchange definitions, and configure secrets, keys, and certificates as needed by each identity provider.

### Inheritance model

When an application calls the RP policy file, the Identity Experience Framework in Azure AD B2C adds all of the elements from base file, from the extensions file, and then from the RP policy file to assemble the current policy in effect.  Elements of the same type and name in the RP file will override those in the extensions, and extensions overrides base.

## Next steps

> [!div class="nextstepaction"]
> [Get started with custom policies](active-directory-b2c-get-started-custom.md)
