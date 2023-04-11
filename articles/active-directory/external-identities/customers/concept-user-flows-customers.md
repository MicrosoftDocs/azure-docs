---
title: Self-service sign-up for CIAM 
description: Learn how to allow customers to sign up for your applications themselves by enabling self-service sign-up. Create a personalized sign-up experience by customizing the self-service sign-up user flow. 
services: active-directory
author: csmulligan
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: conceptual
ms.date: 03/09/2023
ms.author: cmulligan
ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to learn how to allow customers to sign up for your applications themselves.
---
<!--   The content is mostly copied from https://learn.microsoft.com/en-us/azure/active-directory/external-identities/self-service-sign-up-overview. For now the text  is used as a placeholder in the release branch, until further notice. -->

# Self-service sign-up for customers

When sharing an application with customers, you might not always know in advance who will need access to the application. As an alternative to sending invitations directly to individuals, you can allow customers to sign up for specific applications themselves by enabling self-service sign-up user flows. You can create a personalized sign-up experience by customizing the self-service sign-up user flow. For example, you can provide options to sign up with a social identity provider and collect information about the user during the sign-up process.

## User flow for self-service sign-up

A self-service sign-up user flow creates a sign-up experience for your customers through the application you want to share. The user flow can be associated with one or more of your applications. First you'll enable self-service sign-up for your tenant and federate with the identity providers you want to allow external users to use for sign-in. Then you'll create and customize the sign-up user flow and assign your applications to it.
You can configure user flow settings to control how the customer signs up for the application:

- Account types used for sign-in, such as social accounts like Facebook, or email address
- Attributes to be collected from the user signing up, such as first name, postal code, or country/region of residency

The customer can sign in to your application, via the web, mobile, desktop, or single-page application (SPA). The application initiates an authorization request to the user flow provided endpoint. The user flow defines and controls the customer's experience. When the customer completes the sign-up user flow, Azure AD generates a token and redirects the customer back to your application. Upon completion of sign-up, a guest account is provisioned for the customer in the directory. Multiple applications can use the same user flow.

## Example of self-service sign-up

The following example illustrates how we're bringing social identity providers to Azure AD with self-service sign-up capabilities for guest users.  
A customer of Woodgrove opens the Woodgrove app. They decide they want to sign up for a customer account, so they select Request your customer account, which initiates the self-service sign-up flow.

Azure AD creates a relationship with Woodgrove using the customer's Facebook account, and creates a new guest account for the customer after they sign up.

Woodgrove wants to know more about the customer, like name, business name, business registration code, phone number.

The customer enters the information, continues the sign-up flow, and gets access to the resources they need.

## Next steps

 For details, see how to [add a sign-up and sign-in flow](how-to-user-flow-sign-up-sign-in-customers.md).