---
title: API connector code samples for user flows
description: Code samples for API connectors in self-service sign-up flows for Microsoft Entra External ID.
services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: sample
ms.date: 11/30/2022

ms.author: mimart
author: msmimart
manager: celestedg
ms.custom: "it-pro"
ms.collection: engagement-fy23, M365-identity-device-management
---

# Samples for External Identities self-service sign-up

The following tables provide links to code samples for applying web APIs in your self-service sign-up user flows using [API connectors](api-connectors-overview.md).

## API connector Azure Function quickstarts

| Sample                                                                                                                          | Description                                                                                                                                               |
| ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [.NET Core](https://github.com/Azure-Samples/active-directory-dotnet-external-identities-api-connector-azure-function-validate) | This .NET Core Azure Function sample demonstrates how to limit sign-ups to specific tenant domains and validate user-provided information. |
| [Node.js](https://github.com/Azure-Samples/active-directory-nodejs-external-identities-api-connector-azure-function-validate)   | This Node.js Azure Function sample demonstrates how to limit sign-ups to specific tenant domains and validate user-provided information.  |
| [Python](https://github.com/Azure-Samples/active-directory-python-external-identities-api-connector-azure-function-validate)    | This Python Azure Function sample demonstrates how to limit sign-ups to specific tenant domains and validate user-provided information.    |

<!-- \| [Java](../../azure-docs-pr/articles/active-directory/b2b/invite-internal-users.md#use-the-invitation-api-to-send-a-b2b-invitation) |  The sample below illustrates how to call the invitation API to invite an internal user as a B2B user. | -->

## Custom approval workflows

| Sample | Description |
|--------| ----------- |
| [Manual approval workflow](https://github.com/Azure-Samples/active-directory-dotnet-external-identities-api-connectors-approvals) | This sample demonstrates an end-to-end approval workflow to manage guest user account creation in self-service sign-up |

## Identity verification

| Sample                                                                                                            | Description                                                                                                                          |
| ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| [IDology](https://github.com/Azure-Samples/active-directory-dotnet-external-identities-idology-identity-verification) | This sample shows how to verify a user identity as part of your self-service sign-up by using an API connector to integrate with IDology. |
| [Experian](https://github.com/Azure-Samples/active-directory-dotnet-external-identities-experian-identity-verification) | This sample shows how to verify a user identity as part of your self-service sign-up by using an API connector to integrate with Experian. |

## Next steps

- [Code and Azure PowerShell samples](code-samples.md)
- [External Identities pricing](external-identities-pricing.md)
