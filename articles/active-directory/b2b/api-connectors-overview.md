---
title: Manage API connectors in self-service sign-up flows
description: Add API connectors to a self-service sign-up flow

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: conceptual
ms.date: 04/20/2020

ms.author: edgomezc
author: edgomezc
manager: kexia
ms.reviewer: mal
ms.custom: "it-pro"                 
ms.collection: M365-identity-device-management
---

# Use API connectors to customize and extend your user flows via Web APIs

As a developer or IT administrator, you can use API connectors to integrate your user flows with external systems. For example, you might want to extend your user flow by integrating with a user approval system, validate user input data, or run custom business logic. For example, you can use API connectors to:

- **Validate user input data**. Prevent malformed or invalid user data. For example, you can perform identity proofing or validate user-provided data against existing data or permitted values. Based on the validation, you can ask a user to provide valid data or block the user from continuing the sign-up flow.
- [**Enable custom approvals**](self-service-sign-up-add-approvals.md) – Enable your custom user approval system for managing who successfully signs up to your tenant.
- **Overwrite input claims**. Reformat values in input claims. For example, if a user enters the first name in all lowercase or all uppercase letters, you can format the name with only the first letter capitalized. 
- **Enrich user data**. Integrate with your cloud systems that have user information. For example, your API can receive the user's email address, query a CRM system, and return the user's loyalty number. Returned claims can be used to pre-fill form fields or return additional data in the application token. 
- **Run custom business logic**. You can trigger downstream events in your cloud systems to send push notifications, update corporate databases, manage permissions, audit databases, and perform other custom actions.

An API connector represents a contract between Azure AD and an API endpoint by defining the HTTP **endpoint**, **authentication**, **request** and **expected response**. Once you configure an API connector, you can enable it for a specific step in a user flow. 

An API connector materializes as an **HTTP POST** request, sending the claims as key-value pairs in a JSON body. The response should also have the HTTP header **Content-Type: application/json**. Attributes are serialized in the same way as user attributes in Microsoft Graph. <!--# TODO: Add link to MS Graph or create separate reference.-->

## Where you can enable an API connector for a user flow

There are two places in a sign-up user flow where you can enable an API connector: 

- After signing in with an identity provider, and
- Before creating the user.


### After signing in with an identity provider

When you configure an API connector at this step in the sign-up process, it's invoked immediately after the user signs in for the first time with an identity provider (Google, Facebook, Azure AD). This step precedes the **attribute collection page**, which is a form you can present to the user to collect user information. The following are examples of API connector scenarios you might enable at this step:

- Use the email or federated identity that the user just provided to look up claims in an existing system. Return these claims from the existing system, pre-fill the attribute collection page, and make them available to return in the token.
- Validate whether the user is included in an allow or deny list, and control whether they can continue with the sign-up flow.

### Before creating the user

An API connector at this step in the sign-up process is invoked after the attribute collection page, if one is included. This step is always invoked before a user account is created in Azure AD. The following are examples of scenarios you might enable at this point during sign-up:

- Validate user input data and ask a user to resubmit data.
- Block a user sign-up based on data entered by the user.
- Perform identity proofing.
- Query external systems for existing data about the user. You can return the data as part of the token and store it in Azure AD.

## Expected response types from the web API

When the web API receives an HTTP request from Azure AD during a user flow, it can return these responses:

- [Continuation response](#continuation-response)
- [Exit response](#exit-response)
- [Validation-error response](#validation-error-response)

### Continuation response

A continuation response indicates that the user flow should continue to the next step. In a continuation response, the API can return claims.

If a claim is returned from the API, the claim does the following:

- Pre-fills input fields in the attribute collection page if the claims are returned  before the page is presented. The claim must be selected in the **User attributes** for the user flow.
- Overrides any value that has already been assigned to the claim.
- Assigns a value to the claim if it was previously null.

> [!NOTE]
> A claim is stored in the directory only if it is selected in the **User attributes** blade and collected in the attribute collection page. You can always return a claim in the token by selecting it in the **Application claims** blade.

The following is an example of a continuation response:

```http
Response 
Status code: 200 
{ 
    "version": "1.0.0", 
    "action": "Allow",  
    "postalCode": "12349" // return claim 
};  
```

The `version` and `action` are required in the response.


### Exit response

An exit response exits the user flow. It can be purposely issued by the API to stop the continuation of the user flow by displaying a block page to the user. The block page displays the `userMessage` provided by the API. The `code` value can be used for troubleshooting.

The following is an example of an exit response:

```http
Response 
Status code: 200 
{ 
    "version": "1.0.0", 
    "action": "ShowBlockPage", 
    "userMessage": "There was a problem with your request. You are not able to sign up at this time.", 
    "code": "CONTOSO-EXIT-01", 
} 
```

The `version`, `action`, `userMessage`, and `code` are required in the response.

![Example  block page](./media/api-connectors/<insert-image>)

### Validation-error response

An API call invoked after an attribute collection page may return a validation-error response.  When doing so, the user flow stays on the attribute collection page and the `userMessage` is displayed to the user. The user can then edit and resubmit the form. This type of response can be used for input validation.

The following is an example of a validation-error response:

```http
Response 
Status code: 400 
{ 
    "version": "1.0.0", 
    "action": "ValidationError",  
    "userMessage": "Please enter a valid Postal Code.", 
    "code": "CONTOSO-VALIDATION-01", 
} 
```

The `version`, `action`, `userMessage`, and `code` are required in the response.

![Example validation page](./media/api-connectors/<insert-image>)

> [!IMPORTANT]
> If an invalid response is returned or another error occurs (for example, a network error), the user will be shown a block page with a generic error message and asked to try again.

## Frequently asked questions (FAQ)

### How do I integrate with an existing API endpoint?
You can use an [HTTP trigger in Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-http-webhook-trigger?tabs=csharp) as a simple way to call and invoke other web APIs.

## Next steps
- Learn how to [add an API connector to a user flow](self-service-sign-up-add-api-connector.md)
- Learn how to [add a custom approval system to self service sign up](self-service-sign-up-add-approvals.md)
- Learn how to [use API connectors for identity proofing using IDology](sample-identity-proofing-idology.md) <!--#TODO: Make doc, link.-->