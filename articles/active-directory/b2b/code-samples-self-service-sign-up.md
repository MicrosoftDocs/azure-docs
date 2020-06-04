---
title: API connector code samples for user flows - Azure AD
description: Code samples for API connectors in self-service sign-up flows for Azure Active Directory External Identities.

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: conceptual
ms.date: 06/11/2020

ms.author: mimart
author: msmimart
manager: celestedg
ms.collection: M365-identity-device-management
---

# Samples for External Identities self-service sign-up

The following tables provide links to code samples for External Identities.

## API connector Azure Function quickstarts

| Sample | Description |
|--------| ----------- |
| [.NET](https://github.com/azure-ad-b2c/saml-sp-tester/tree/master/source-code) | Call the invitation API to get the redemption URL for a custom invitation email. |
| [JavaScript](../../azure-docs-pr/articles/active-directory/b2b/invite-internal-users.md#use-the-invitation-api-to-send-a-b2b-invitation) |  The sample below illustrates how to call the invitation API to invite an internal user as a B2B user. |
| [Python](../../azure-docs-pr/articles/active-directory/b2b/invite-internal-users.md#use-the-invitation-api-to-send-a-b2b-invitation) |  The sample below illustrates how to call the invitation API to invite an internal user as a B2B user. |
| [Java](../../azure-docs-pr/articles/active-directory/b2b/invite-internal-users.md#use-the-invitation-api-to-send-a-b2b-invitation) |  The sample below illustrates how to call the invitation API to invite an internal user as a B2B user. |

## Custom approval systems

| Sample | Description |
|--------| ----------- |
| [Woodgrove](code-samples.md) | This sample PowerShell script uses the .csv file upload feature to send invitations to guest users in bulk. |

## Identity proofing

| Sample | Description |
|--------| ----------- |
| [IDology](https://github.com/Azure-Samples/active-directory-dotnet-external-identities-idology-identity-proofing) | This sample shows how to add ID proofing to your self-service sign-up user flow by using an API connector to integrate with IDology |
| [Experian](https://github.com/Azure-Samples/) | This sample shows how add identity verification to your self-service sign-up user flow by using an API connector to integrate with Experian. |
