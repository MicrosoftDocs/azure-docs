---
title: Manage API connectors in self-service sign-up flows
description: Use API connectors to customize and extend your self-service sign-up user flows

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: conceptual
ms.date: 04/20/2020

ms.author: mimart
author: msmimart
manager: celestedg
ms.reviewer: mal
ms.custom: "it-pro"                 
ms.collection: M365-identity-device-management
---

# Use API connectors to customize and extend self-service sign-up 

## Overview 
As a developer or IT administrator, you can use API connectors to integrate your [self-service sign-up user flows](self-service-sign-up-overview.md) with external systems by leveraging Web APIs. For example, you can use API connectors to:

- [**Integrate with a custom approval workflows**](self-service-sign-up-add-approvals.md). Connect to a custom approval system for managing account creation.
<!-- - [**Perform identity proofing**](code-samples-self-service-sign-up.md#identity-proofing). Use an identity proofing and verification service to add an extra level of security to account creation decisions. -->
- **Perform identity proofing**. Use an identity proofing and verification service to add an extra level of security to account creation decisions.
- **Validate user input data**. Validate against malformed or invalid user data. For example, you can validate user-provided data against existing data in an external data store or list of permitted values. If invalid, you can ask a user to provide valid data or block the user from continuing the sign-up flow.
- **Overwrite user attributes**. Reformat or assign a value to an attribute collected from the user. For example, if a user enters the first name in all lowercase or all uppercase letters, you can format the name with only the first letter capitalized. 
<!-- - **Enrich user data**. Integrate with your external cloud systems that store user information to integrate them with the sign-up flow. For example, your API can receive the user's email address, query a CRM system, and return the user's loyalty number. Returned claims can be used to pre-fill form fields or return additional data in the application token.  -->
- **Run custom business logic**. You can trigger downstream events in your cloud systems to send push notifications, update corporate databases, manage permissions, audit databases, and perform other custom actions.

An API connector represents a contract between Azure AD and an API endpoint by defining the HTTP endpoint, authentication, request, and expected response. Once you configure an API connector, you can enable it for a specific step in a user flow. When a user reaches that step in the sign up flow, the API connector is invoked and materializes as an HTTP POST request, sending selected claims as key-value pairs in a JSON body. The API response can affect the execution of the user flow. For example, the API response can block a user from signing up, ask the user to re-enter information, or overwrite and append user attributes.

## Where you can enable an API connector in a user flow

There are two places in a user flow where you can enable an API connector:

- After signing in with an identity provider
- Before creating the user

In both of these cases, the API connectors are invoked during sign-up, not sign-in.

### After signing in with an identity provider

An API connector at this step in the sign-up process is invoked immediately after the user authenticates with an identity provider (Google, Facebook, Azure AD). This step precedes the ***attribute collection page***, which is the form presented to the user to collect user attributes. The following are examples of API connector scenarios you might enable at this step:

- Use the email or federated identity that the user provided to look up claims in an existing system. Return these claims from the existing system, pre-fill the attribute collection page, and make them available to return in the token.
- Validate whether the user is included in an allow or deny list, and control whether they can continue with the sign-up flow.

### Before creating the user

An API connector at this step in the sign-up process is invoked after the attribute collection page, if one is included. This step is always invoked before a user account is created in Azure AD. The following are examples of scenarios you might enable at this point during sign-up:

- Validate user input data and ask a user to resubmit data.
- Block a user sign-up based on data entered by the user.
- Perform identity proofing.
- Query external systems for existing data about the user to return it in the application token or store it in Azure AD.

<!-- > [!IMPORTANT]
> If an invalid response is returned or another error occurs (for example, a network error), the user will be redirected to the app with the error re -->

## Frequently asked questions (FAQ)

### How do I integrate with an existing API endpoint?
You can use an [HTTP trigger in Azure Functions](https://docs.microsoft.com/azure/azure-functions/functions-bindings-http-webhook-trigger?tabs=csharp) as a simple way to call and invoke other Web APIs.

## Next steps
- Learn how to [add an API connector to a user flow](self-service-sign-up-add-api-connector.md)
- Learn how to [add a custom approval system to self-service sign-up](self-service-sign-up-add-approvals.md)
<!--#TODO: Make doc, link.-->