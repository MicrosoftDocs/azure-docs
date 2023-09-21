---
title: About API connectors in self-service sign-up flows
description: Use Microsoft Entra API connectors to customize and extend your self-service sign-up user flows by using web APIs. 
services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: conceptual
ms.date: 11/28/2022

ms.author: mimart
author: msmimart
manager: celestedg
ms.custom: "it-pro"                 
ms.collection: engagement-fy23, M365-identity-device-management
---

# Use API connectors to customize and extend self-service sign-up 

## Overview 
As a developer or IT administrator, you can use [API connectors](self-service-sign-up-add-api-connector.md#create-an-api-connector) to integrate your [self-service sign-up user flows](self-service-sign-up-overview.md) with web APIs to customize the sign-up experience and integrate with external systems. For example, with API connectors, you can:

- [**Integrate with a custom approval workflow**](self-service-sign-up-add-approvals.md). Connect to a custom approval system for managing and limiting account creation.
- [**Perform identity verification**](code-samples-self-service-sign-up.md#identity-verification). Use an identity verification service to add an extra level of security to account creation decisions.
- **Validate user input data**. Validate against malformed or invalid user data. For example, you can validate user-provided data against existing data in an external data store or list of permitted values. If invalid, you can ask a user to provide valid data or block the user from continuing the sign-up flow.
- **Overwrite user attributes**. Reformat or assign a value to an attribute collected from the user. For example, if a user enters the first name in all lowercase or all uppercase letters, you can format the name with only the first letter capitalized. 
- **Run custom business logic**. You can trigger downstream events in your cloud systems to send push notifications, update corporate databases, manage permissions, audit databases, and perform other custom actions.

An API connector provides Microsoft Entra ID with the information needed to call API endpoint by defining the HTTP endpoint URL and authentication for the API call. Once you configure an API connector, you can enable it for a specific step in a user flow. When a user reaches that step in the sign-up flow, the API connector is invoked and materializes as an HTTP POST request to your API, sending user information ("claims") as key-value pairs in a JSON body. The API response can affect the execution of the user flow. For example, the API response can block a user from signing up, ask the user to reenter information, or overwrite and append user attributes.

## Where you can enable an API connector in a user flow

There are two places in a user flow where you can enable an API connector:

- After federating with an identity provider during sign-up
- Before creating the user

> [!IMPORTANT]
> In both of these cases, the API connectors are invoked during user **sign-up**, not sign-in.

### After federating with an identity provider during sign-up

An API connector at this step in the sign-up process is invoked immediately after the user authenticates with an identity provider (like Google, Facebook, & Microsoft Entra ID). This step precedes the [***attribute collection page***](self-service-sign-up-user-flow.md#select-the-layout-of-the-attribute-collection-form), which is the form presented to the user to collect user attributes. This step isn't invoked if a user is registering with a local account. The following are examples of API connector scenarios you might enable at this step:

- Use the email or federated identity that the user provided to look up claims in an existing system. Return these claims from the existing system, pre-fill the attribute collection page, and make them available to return in the token.
- Implement an allow or blocklist based on social identity.

### Before creating the user

An API connector at this step in the sign-up process is invoked after the attribute collection page, if one is included. This step is always invoked before a user account is created. The following are examples of scenarios you might enable at this point during sign-up:

- Validate user input data and ask a user to resubmit data.
- Block a user sign-up based on data entered by the user.
- Perform identity verification.
- Query external systems for existing data about the user to return it in the application token or store it in Microsoft Entra ID.

## Next steps
- Learn how to [add an API connector to a user flow](self-service-sign-up-add-api-connector.md)
- Learn about [Microsoft Entra entitlement management](self-service-portal.md)
- Learn how to [add a custom approval system to self-service sign-up](self-service-sign-up-add-approvals.md)
