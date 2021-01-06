---
title: About API connectors in Azure AD B2C
description: Use Azure Active Directory (Azure AD) API connectors to customize and extend your sign-up user flows by using web APIs. 
services: active-directory-b2c
ms.service: active-directory
ms.subservice: B2C
ms.topic: how-to
ms.date: 10/15/2020

ms.author: mimart
author: msmimart
manager: celestedg
ms.custom: "it-pro"
---

# Use API connectors to customize and extend sign-up user flows

> [!IMPORTANT]
> API connectors for sign-up is a public preview feature of Azure AD B2C. For more information about previews, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Overview 
As a developer or IT administrator, you can use API connectors to integrate your sign-up user flows with web APIs to customize the sign-up experience. For example, with API connectors, you can:

- **Validate user input data**. Validate against malformed or invalid user data. For example, you can validate user-provided data against existing data in an external data store or list of permitted values. If invalid, you can ask a user to provide valid data or block the user from continuing the sign-up flow.
- **Integrate with a custom approval workflow**. Connect to a custom approval system for managing and limiting account creation.
- **Overwrite user attributes**. Reformat or assign a value to an attribute collected from the user. For example, if a user enters the first name in all lowercase or all uppercase letters, you can format the name with only the first letter capitalized. 
- **Perform identity verification**. Use an identity verification service to add an extra level of security to account creation decisions.
- **Run custom business logic**. You can trigger downstream events in your cloud systems to send push notifications, update corporate databases, manage permissions, audit databases, and perform other custom actions.

An API connector provides Azure Active Directory with the information needed to call an API including an endpoint URL and authentication. Once you configure an API connector, you can enable it for a specific step in a user flow. When a user reaches that step in the sign up flow, the API connector is invoked and materializes as an HTTP POST request to your API, sending user information ("claims") as key-value pairs in a JSON body. The API response can affect the execution of the user flow. For example, the API response can block a user from signing up, ask the user to re-enter information, or overwrite and append user attributes.

## Where you can enable an API connector in a user flow

There are two places in a user flow where you can enable an API connector:

- After signing in with an identity provider
- Before creating the user

> [!IMPORTANT]
> In both of these cases, the API connectors are invoked during user **sign-up**, not sign-in.

### After signing in with an identity provider

An API connector at this step in the sign-up process is invoked immediately after the user authenticates with an identity provider (like Google, Facebook, & Azure AD). This step precedes the ***attribute collection page***, which is the form presented to the user to collect user attributes. This step is not invoked if a user is registering with a local account. The following are examples of API connector scenarios you might enable at this step:

- Use the email or federated identity that the user provided to look up claims in an existing system. Return these claims from the existing system, pre-fill the attribute collection page, and make them available to return in the token.
- Implement an allow or block list based on social identity.

### Before creating the user

An API connector at this step in the sign-up process is invoked after the attribute collection page, if one is included. This step is always invoked before a user account is created. The following are examples of scenarios you might enable at this point during sign-up:

- Validate user input data and ask a user to resubmit data.
- Block a user sign-up based on data entered by the user.
- Perform identity verification.
- Query external systems for existing data about the user to return it in the application token or store it in Azure AD.


## Next steps
- Learn how to [add an API connector to a user flow](add-api-connector.md)
- Get started with our [samples](code-samples.md#api-connectors).
<!-- - Learn how to [add a custom approval system to self-service sign-up](add-approvals.md) -->