---
title: Best practices for application registration configuration - Microsoft identity platform
description: Learn about a set of best practices and general guidance on application registration configuration.
services: active-directory
author: Chrispine-Chiedo
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 05/10/2021
ms.custom: template-concept
ms.author: cchiedo
ms.reviewer: saumadan, marsma
---

# Application registration configuration best practices

The following document describes security best practices for the following application registration properties.

- Redirect URI
- Implicit Grant Flow for access token
- Credentials
- AppId Uri
- Application ownership
- Checklist

## Application registration hygiene

An Azure AD application registration is a critical part of your business application. Any misconfiguration or lapse in hygiene of your application can result in downtime or compromise.

It is important to understand that your application registration has a wider impact than the business application because of its surface area. Depending on the permissions added to your application, a compromised app can have an organization wide impact.
Since an application registration is essential to getting your users logged in, any downtime to it can affect your business or some critical service that your business depends upon. So, it is important to allocate time and resources to ensure your application registration stays in a healthy state at all times. We recommend that you conduct a periodical security and health assessment of your applications much like a Security Threat Model assessment for your code.

In this article we describe a few best practices that every organization must follow to safe guard their ecosystem.

## Redirect Uri configuration

It is important to keep Redirect URIs of your application up to date. A lapse in the ownership of one of the redirect URIs can lead to an application compromise. Ensure that all DNS records are updated and monitored periodically for changes. Along with maintaining ownership of all URIs, do not use wildcard reply URLs or insecure schemes such as http, URN, etc.

![redirect Uri](media/active-directory-application-registration-best-practices/redirect-uri.png)

### Redirect Uri summary

| Do                                    | Don't          |
| ------------------------------------- | -------------- |
| Maintain ownership of all URIs        | Use wildcards  |
| Keep DNS up to date                   | Use URN scheme |
| Keep the list small                   |                |
| Trim any unnecessary URIs             |                |
| Update URLs from Http to Https scheme |                |

## Implicit flow token configuration

Scenarios that require Implicit flow can now use Auth code flow to reduce the risk of compromise associated with Implicit Grant Flow misuse. If you configured your application registration to get Access tokens using Implicit Flow, but do not actively use it, you must turn off the setting to protect from misuse.
For more information on Auth code flow, refer to the [Auth code flow docs](https://docs.microsoft.com)

![IGF](media/active-directory-application-registration-best-practices/implict-grant-flow.png)

### Implicit Grant Flow summary

| Do                                                                    | Don't                                                                  |
| --------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Understand if Implicit Flow is required (https://aka.ms/igfScenarios) | Use Implicit Flow unless explicitly required (https://aka.ms/igfCheck) |
| Separate App Reg for (valid) Implicit Flow scenarios                  |                                                                        |
| Turn off unused implicit flow                                         |                                                                        |

## Credential configuration

Credentials are a vital part of an application registration when you application is used as a confidential client. If your app registration is used only as a Public Client App (allows users to sign-in using a public endpoint), ensure that you do not have any credentials on your application object. Review the credentials used in your applications for freshness of use and their expiration. An unused credential on an application can result in security breach.
While its convenient to use password secrets as a credential, we strongly recommend that you use x509 certificates as the only credential type for getting tokens as your application. Monitor your DevOps pipelines to ensure credentials of any kind are never committed into code repositories. If using Azure, we strongly recommend using Managed Identity so application credentials are automatically managed.

![credentials](media/active-directory-application-registration-best-practices/credentials.png)

| Do                                                                     | Don't                             |
| ---------------------------------------------------------------------- | --------------------------------- |
| Use certificate credentials (https://aka.ms/aadCertCreds)              | Use Password credentials          |
| Use Key vault with Managed identities (https://aka.ms/managedIdentity) | Share credentials across apps     |
| Rollover frequently                                                    | Have many credentials on one app  |
|                                                                        | Let stale credentials hang around |
|                                                                        | Commit credentials in code        |

## AppId Uri configuration

Certain applications can expose resources (via WebAPI) and therefore need to define an AppId Uri that uniquely identifies the resource in a tenant. We recommend using either api or https schemes and set the AppId Uri in the following formats to avoid Uri collisions in your organization.

**Valid api schemes:**

- _api://{appId}_
- _api://{tenantId}/{appId}_
- _api://{tenantId}/{string}_
- _https://{verifiedCustomerDomain}/{string}_
- _https://{string}.{verifiedCustomerDomain}_
- _https://{string}.{verifiedCustomerDomain}/{string}_

![appid](media/active-directory-application-registration-best-practices/appid-uri.png)

### AppId Uri summary

| Do                                           | Don't                  |
| -------------------------------------------- | ---------------------- |
| Avoid collisions by using valid Uri formats. | Use wildcard AppId Uri |
| Use verified domain in LoB apps              | Malformed Uri          |
| Inventory your AppId Uris                    |                        |

## App ownership configuration

Ensure app ownership is kept to a minimal set of people within the organization. It is recommended to run through the owners list once every few months to ensure owners are still part of the organization and their charter accounts for ownership of the application registration.

![ownership](media/active-directory-application-registration-best-practices/app-ownership.png)

### App ownership summary

| Do                  | Don't |
| ------------------- | ----- |
| Keep it small       | ----- |
| Monitor owners list | ----- |

## Checklist

App developers can use the _Checklist_ available in Azure portal to ensure their app registration meets a high quality bar and provides guidance to integrate securely. The integration assistant highlights best practices and recommendation that help avoid common oversights when integrating with Microsoft identity platform.

![checklist](media/active-directory-application-registration-best-practices/checklist.png)

### Checklist summary

| Do                                                 | Don't |
| -------------------------------------------------- | ----- |
| Use checklist to get scenario based recommendation | ----- |
| Deep link into app registration blades             | ----- |
