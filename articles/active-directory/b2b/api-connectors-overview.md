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

As a developer, IT administrator, etc., you can use API connectors to integrate with your own web APIs as part of your [self-service sign-up user flow](self-service-sign-up-overview.md). You can use API connectors to:

- [**Enable custom approvals**](self-service-sign-up-add-approvals.md) – Enable your custom user approval system for managing who successfully signs up to your tenant.
- **Overwrite input claims** - Reformat values in input claims. For example, if a user enters the first name in all lowercase or all uppercase letters, you can format the name with only the first letter capitalized. 
- **Enrich user data** - Integrate with your cloud systems that have user information. For example, your API can receive the user's email address, query a CRM system, and return the user's loyalty number. Returned claims can be used to pre-fill form fields or return additional data in the application token. 
- **Validate user input data** - Prevent malformed or invalid user data. For example, you can perform identity proofing or validate user provided data against existing data or permitted values. Based on the validation, you can ask a user to provide valid data or block the user from continuing the sign up flow.
- **Run custom business logic** - You can trigger downstream events in your cloud systems to send push notifications, update corporate databases, manage permissions, audit databases, and perform other custom actions.

An API connector represents a contract between Azure AD and an API endpoint by defining the HTTP **endpoint**, **authentication**, **request** and **expected response**. Once you configure an API connector, you can enable it for a specific step in a user flow. 

An API connector materializes as an **HTTP POST** request, sending the claims as key-value pairs in a JSON body. The response should also have the HTTP header **Content-Type: application/json**. Attributes are serialized in the same way as user attributes in Microsoft Graph. <!--# TODO: Add link to MS Graph or create separate reference.-->

## Where you can enable an API connector for a user flow
There are two places in the *sign up* path of a user flow in which an API connector may be used.

### After signing in with an identity provider
This step is invoked immediately after login via an identity provider (Google, Facebook, Azure Active Directory) during sign up.
This precedes the **attribute collection page**, which is a page in which a form is presented to the user in order to collect information about that user. 

Example scenarios: 
- Look up claims in an existing system in which a user can be identified by email or federated identity. These claims can be returned, which will pre-fill the attribute collection page and make them available to return in the token.
- Validate that the user is in a blacklist or whitelist and control whether they can continue in the sign up flow.

### Before creating the user
This step is invoked after an attribute collection page, if one exists.  
This step is always invoked before a user account is created in Azure AD. 

Example scenarios:
- Validate user input data and ask a user to resubmit data.
- Block a user sign up based on user input data.
- Perform identity proofing.
- Query external systems for existing data about a user. You can return it as part of the token as well as store it in Azure AD. 


## Expected response types from the Web API

When the web API receives an HTTP request from Azure AD during a user flow, it can return these responses:

- [Continuation response](#continuation-response)
- [Exit response](#exit-response)
- [Validation-error response](#validation-error-response)

### Continuation response

A continuation response indicates for the user flow to continue to the next step. In a continuation response, the API can send back claims. 

A claim returned from the API:
- If before an attribute collection page, pre-fills the input field. Must be selected as a 'User attribute' for the user flow.
- Overrides any existing value of the claim.
- Assigns a value to the claim if it was previously null. 

> [!NOTE]
> To return a claim in the token, select it in the **Application claims** blade.

> [!NOTE]
> A claim is only stored in the directory if it is collected in the attribute collection page by being selected in the **User attributes** blade.

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
`version` and `action` are required in the response.


### Exit response

An exit response exits the flow. It can be issued by the API on purpose to stop the continuation of the flow by displaying a block page. The block page renders the API provided `userMessage` to the user. The `code` value can be used for troubleshooting. 

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
`version`, `action`, `userMessage`, and `code` are required in the response.

![Example  block page](./media/api-connectors/<insert-image>)

### Validation-error response

An API call invoked after an attribute collection page may return a Validation-error response.  When doing so, the user flow stays on the attribute collection page and the `userMessage` is relayed to the user. The user can edit and resubmit the form and try again. This type of response can be used for input validation. 
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
`version`, `action`, `userMessage`, and `code` are required in the response.

![Example validation page](./media/api-connectors/<insert-image>)

> [!CAUTION]
> If an invalid response is returned or some other error occurs (e.g. network error), the user flow will be shown a block page with a generic error message and asked to try again.


## Frequently asked questions (FAQ)

### How do I integrate to an existing API endpoint?
You can use an [HTTP trigger in Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-http-webhook-trigger?tabs=csharp) for a simple way to call and invoke other Web APIs.

## Next steps
- Learn how to [add an API connector to a user flow](self-service-sign-up-add-api-connector.md)
- Learn how to [add a custom approval system to self service sign up](self-service-sign-up-add-approvals.md)
- Learn how to [use API connectors for identity proofing using IDology](sample-identity-proofing-idology.md) <!--#TODO: Make doc, link.-->