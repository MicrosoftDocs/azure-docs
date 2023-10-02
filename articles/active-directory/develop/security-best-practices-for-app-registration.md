---
title: Security best practices for application properties
description: Learn about the best practices and general guidance for security related application properties in Microsoft Entra ID.
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
ms.reviewer: saumadan
---

# Security best practices for application properties in Microsoft Entra ID

Security is an important concept when registering an application in Microsoft Entra ID and is a critical part of its business use in the organization. Any misconfiguration of an application can result in downtime or compromise. Depending on the permissions added to an application, there can be organization-wide effects.

Because secure applications are essential to the organization, any downtime to them because of security issues can affect the business or some critical service that the business depends upon. So, it's important to allocate time and resources to ensure applications always stay in a healthy and secure state. Conduct a periodic security and health assessment of applications, much like a Security Threat Model assessment for code. For a broader perspective on security for organizations, see the [security development lifecycle](https://www.microsoft.com/securityengineering/sdl) (SDL).

This article describes security best practices for the following application properties:

- Redirect URI
- Access tokens (used for implicit flows)
- Certificates and secrets
- Application ID URI
- Application ownership

## Redirect URI

It's important to keep Redirect URIs of your application up to date. Under **Authentication** for the application in the Azure portal, a platform must be selected for the application and then the **Redirect URI** property can be defined.

:::image type="content" source="./media/application-registration-best-practices/redirect-uri.png" alt-text="Screenshot that shows where the redirect U R I property is located.":::

Consider the following guidance for redirect URIs:

- Maintain ownership of all URIs. A lapse in the ownership of one of the redirect URIs can lead to application compromise.
- Make sure all DNS records are updated and monitored periodically for changes.
- Don't use wildcard reply URLs or insecure URI schemes such as http, or URN.
- Keep the list small. Trim any unnecessary URIs. If possible, update URLs from Http to Https.

## Access tokens (used for implicit flows)

Scenarios that required **implicit flow** can now use **Auth code flow** to reduce the risk of compromise associated with implicit flow misuse. Under **Authentication** for the application in the Azure portal, a platform must be selected for the application and then the **Access tokens (used for implicit flows)** property can be set.

:::image type="content" source="./media/application-registration-best-practices/implict-grant-flow.png" alt-text="Screenshot that shows where the implicit flow property is located.":::

Consider the following guidance related to implicit flow:

- Understand if [implicit flow is required](./v2-oauth2-implicit-grant-flow.md#suitable-scenarios-for-the-oauth2-implicit-grant). Don't use implicit flow unless explicitly required.
- If the application was configured to receive access tokens using implicit flow, but doesn't actively use them, turn off the setting to protect from misuse.
- Use separate applications for valid implicit flow scenarios.

## Certificates and secrets

Certificates and secrets, also known as credentials, are a vital part of an application when it's used as a confidential client. Under **Certificates and secrets** for the application in the Azure portal, certificates and secrets can be added or removed.

:::image type="content" source="./media/application-registration-best-practices/credentials.png" alt-text="Screenshot that shows where the certificates and secrets are located.":::

Consider the following guidance related to certificates and secrets:

- Always use [certificate credentials](./certificate-credentials.md) whenever possible and don't use password credentials, also known as *secrets*. While it's convenient to use password secrets as a credential, when possible use x509 certificates as the only credential type for getting tokens for an application.
  - Configure [application authentication method policies](/graph/api/resources/applicationauthenticationmethodpolicy) to govern the use of secrets by limiting their lifetimes or blocking their use altogether.
- Use Key Vault with [managed identities](../managed-identities-azure-resources/overview.md) to manage credentials for an application.
- If an application is used only as a Public Client App (allows users to sign in using a public endpoint), make sure that there are no credentials specified on the application object.
- Review the credentials used in applications for freshness of use and their expiration. An unused credential on an application can result in a security breach. Rollover credentials frequently and don't share credentials across applications. Don't have many credentials on one application.
- Monitor your production pipelines to prevent credentials of any kind from being committed into code repositories.
- [Credential Scanner](../../security/develop/security-code-analysis-overview.md#credential-scanner) is a static analysis tool that can be used to detect credentials (and other sensitive content) in source code and build output.

## Application ID URI

The **Application ID URI** property of the application specifies the globally unique URI used to identify the web API. It's the prefix for scopes and in access tokens, it's also the value of the audience claim and it must use a verified customer owned domain. For multi-tenant applications, the value must also be globally unique. It's also referred to as an identifier URI. Under **Expose an API** for the application in the Azure portal, the **Application ID URI** property can be defined.

:::image type="content" source="./media/application-registration-best-practices/app-id-uri.png" alt-text="Screenshot that shows where the Application I D U R I is located.":::

Consider the following guidance related to defining the Application ID URI:

- The api or https URI schemes are recommended. Set the property in the supported formats to avoid URI collisions in your organization. Don't use wildcards.
- Use a verified domain in Line of Business (LoB) applications.
- Keep an inventory of the URIs in your organization to help maintain security.
- Use the Application ID URI to expose the WebApi in the organization. Don't use the Application ID URI to identify the application, and instead use the Application (client) ID property.

[!INCLUDE [active-directory-identifierUri](../../../includes/active-directory-identifier-uri-patterns.md)]

## App ownership configuration

Owners can manage all aspects of a registered application. It's important to regularly review the ownership of all applications in the organization. For more information, see [Microsoft Entra access reviews](../governance/access-reviews-overview.md). Under **Owners** for the application in the Azure portal, the owners of the application can be managed.

:::image type="content" source="./media/application-registration-best-practices/app-ownership.png" alt-text="Screenshot that shows where owners of the application are managed.":::

Consider the following guidance related to specifying application owners:

- Application ownership should be kept to a minimal set of people within the organization.
- An administrator should review the owners list once every few months to make sure that owners are still part of the organization and should still own an application.

## Integration assistant

The **Integration assistant** in Azure portal can be used to make sure that an application meets a high quality bar and to provide secure integration. The integration assistant highlights best practices and recommendation that help avoid common oversights when integrating with the Microsoft identity platform.

:::image type="content" source="./media/application-registration-best-practices/checklist.png" alt-text="Screenshot that shows where to find the integration assistant.":::

## Next steps

- For more information about the Auth code flow, see the [OAuth 2.0 authorization code flow](./v2-oauth2-auth-code-flow.md).
