---
title: What is identity and access management (IAM)?
description:  Learn what identity and access management (IAM) is, why it's important, and how it works.  Learn about authentication and authorization, single sign-on (SSO), and multi-factor authentication (MFA). Learn about SAML, Open ID Connect (OIDC), and OAuth 2.0 and other authentication and authorization standards, tokens, and more.
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.date: 06/05/2023
ms.author: ryanwi
ms.reviewer: 
---

# What is identity and access management (IAM)?

In this article, you learn some of the fundamental concepts of Identity and Access Management (IAM), why it's important, and how it works.

Identity and access management ensures that the right people, machines, and software components get access to the right resources at the right time. First, the person, machine, or software component proves they're who or what they claim to be. Then, the person, machine, or software component is allowed or denied access to or use of certain resources.

To learn about the basic terms and concepts, see [Identity fundamentals](./whatis.md).

## What does IAM do?

IAM systems typically provide the following core functionality:

- **Identity management** - The process of creating, storing, and managing identity information. Identity providers (IdP) are software solutions that are used to track and manage user identities, as well as the permissions and access levels associated with those identities.

- **Identity federation** - You can allow users who already have passwords elsewhere (for example, in your enterprise network or with an internet or social identity provider) to get access to your system.

- **Provisioning and deprovisioning of users** - The process of creating and managing user accounts, which includes specifying which users have access to which resources, and assigning permissions and access levels.

- **Authentication of users** - Authenticate a user, machine, or software component by confirming that they're who or what they say they are. You can add multi-factor authentication (MFA) for individual users for extra security or single sign-on (SSO) to allow users to authenticate their identity with one portal instead of many different resources.

- **Authorization of users** - Authorization ensures a user is granted the exact level and type of access to a tool that they're entitled to. Users can also be portioned into groups or roles so large cohorts of users can be granted the same privileges.

- **Access control** - The process of determining who or what has access to which resources. This includes defining user roles and permissions, as well as setting up authentication and authorization mechanisms. Access controls regulate access to systems and data.

- **Reports and monitoring** - Generate reports after actions taken on the platform (like sign-in time, systems accessed, and type of authentication) to ensure compliance and assess security risks. Gain insights into the security and usage patterns of your environment.

## How IAM works

This section provides an overview of the authentication and authorization process and the more common standards.

### Authenticating, authorizing, and accessing resources

Let's say you have an application that signs in a user and then accesses a protected resource.

:::image type="content" source="./media/introduction-identity-access-management/openid-oauth.svg" alt-text="Diagram that shows the user authentication and authorization process for accessing a protected resource using an identity provider." :::

1. The user (resource owner) initiates an authentication request with the identity provider/authorization server from the client application.

1. If the credentials are valid, the identity provider/authorization server first sends an ID token containing information about the user back to the client application.

1. The identity provider/authorization server also obtains end-user consent and grants the client application authorization to access the protected resource. Authorization is provided in an access token, which is also sent back to the client application.

1. The access token is attached to subsequent requests made to the protected resource server from the client application.

1. The identity provider/authorization server validates the access token.  If successful the request for protected resources is granted, and a response is sent back to the client application.

For more information, read [Authentication and authorization](/azure/active-directory/develop/authentication-vs-authorization#authentication-and-authorization-using-the-microsoft-identity-platform).

### Authentication and authorization standards

These are the most well-known and commonly used authentication and authorization standards:

#### OAuth 2.0

OAuth is an open-standards identity management protocol that provides secure access for websites, mobile apps, and Internet of Things and other devices. It uses tokens that are encrypted in transit and eliminates the need to share credentials. OAuth 2.0, the latest release of OAuth, is a popular framework used by major social media platforms and consumer services, from Facebook and LinkedIn to Google, PayPal, and Netflix. To learn more, read about [OAuth 2.0 protocol](/azure/active-directory/develop/active-directory-v2-protocols).
#### OpenID Connect (OIDC)

With the release of the OpenID Connect (which uses public-key encryption), OpenID became a widely adopted authentication layer for OAuth. Like SAML, OpenID Connect (OIDC) is widely used for single sign-on (SSO), but OIDC uses REST/JSON instead of XML. OIDC was designed to work with both native and mobile apps by using REST/JSON protocols. The primary use case for SAML, however, is web-based apps. To learn more, read about [OpenID Connect protocol](/azure/active-directory/develop/active-directory-v2-protocols).

#### JSON web tokens (JWTs)

JWTs are an open standard that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. JWTs can be verified and trusted because they’re digitally signed. They can be used to pass the identity of authenticated users between the identity provider and the service requesting the authentication. They also can be authenticated and encrypted. To learn more, read [JSON Web Tokens](/azure/active-directory/develop/active-directory-v2-protocols#tokens).

#### Security Assertion Markup Language (SAML)

SAML is an open standard utilized for exchanging authentication and authorization information between, in this case, an IAM solution and another application. This method uses XML to transmit data and is typically the method used by identity and access management platforms to grant users the ability to sign in to applications that have been integrated with IAM solutions. To learn more, read [SAML protocol](/azure/active-directory/develop/active-directory-saml-protocol-reference).

#### System for Cross-Domain Identity Management (SCIM)

Created to simplify the process of managing user identities, SCIM provisioning allows organizations to efficiently operate in the cloud and easily add or remove users, benefitting budgets, reducing risk, and streamlining workflows. SCIM also facilitates communication between cloud-based applications.  To learn more, read [Develop and plan provisioning for a SCIM endpoint](/azure/active-directory/app-provisioning/use-scim-to-provision-users-and-groups?toc=/azure/active-directory/develop/toc.json&bc=/azure/active-directory/develop/breadcrumb/toc.json).

#### Web Services Federation (WS-Fed)

WS-Fed was developed by Microsoft and used extensively in their applications, this standard defines the way security tokens can be transported between different entities to exchange identity and authorization information. To learn more, read Web Services Federation Protocol.

## Next steps

To learn more, see:

- [Single sign-on (SSO)](/azure/active-directory/manage-apps/what-is-single-sign-on)
- [Multi-factor authentication (MFA)](/azure/active-directory/authentication/concept-mfa-howitworks)
- [Authentication vs authorization](/azure/active-directory/develop/authentication-vs-authorization)
- [OAuth 2.0 and OpenID Connect](/azure/active-directory/develop/active-directory-v2-protocols)
- [App types and authentication flows](/azure/active-directory/develop/authentication-flows-app-scenarios)
- [Security tokens](/azure/active-directory/develop/security-tokens)
