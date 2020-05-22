---
title: Self-service sign-up for External Identities - Azure AD
description: Learn how to allow external users to sign up for your applications themselves by enabling self-service sign-up. Create a personalized sign-up experience by customizing the self-service sign-up user flow. 

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: conceptual
ms.date: 05/19/2020

ms.author: mimart
author: msmimart
manager: celestedg
ms.reviewer: elisolMS

ms.collection: M365-identity-device-management
---

# Self-service sign-up (Preview)
|     |
| --- |
| Self-service sign-up is a public preview feature of Azure Active Directory. For more information about previews, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).|
|     |

When sharing an application with external users, you might not always know in advance who will need access to the application. As an alternative to sending invitations directly to individuals, you can allow external users to sign up for specific applications themselves by enabling self-service sign-up. You can create a personalized sign-up experience by customizing the self-service sign-up user flow. For example, you can provide options to sign up with Azure AD or social identity providers and collect information about the user during the sign-up process.

> [!NOTE]
> You can associate user flows with apps built by your organization. User flows can't be used for Microsoft apps, like SharePoint or Teams.

## User flow for self-service sign-up

A self-service sign-up user flow creates a sign-up experience for your external users through the application you want to share. The user flow can be associated with one or more of your applications. First you'll enable self-service sign-up for your tenant and federate with the identity providers you want to allow external users to use for sign-in. Then you'll create and customize the sign-up user flow and assign your applications to it.
You can configure user flow settings to control how the user signs up for the application:

- Account types used for sign-in, such as social accounts like Facebook, or Azure AD accounts
- Attributes to be collected from the user signing up, such as first name, postal code, or country/region of residency

When a user wants to sign in to your application, whether it's a web, mobile, desktop, or single-page application (SPA), the application initiates an authorization request to the user flow-provided endpoint. The user flow defines and controls the user's experience. When the user completes the sign-up user flow, Azure AD generates a token and redirects the user back to your application. Upon completion of sign-up, a guest account is provisioned for the user in the directory. Multiple applications can use the same user flow.

## Example of self-service sign-up

The following example illustrates how we're bringing social identity providers to Azure AD with self-service sign up capabilities for guest users.  
A partner of Woodgrove opens the Woodgrove app. They decide they want to sign up for a supplier account, so they select Request your supplier account, which initiates the self-service sign-up flow.

![Example of self-service sign-up starting page](media/self-service-sign-up-overview/example-start-sign-up-flow.png)

They use the email of their choice to sign up.

![Example showing selection of Facebook for sign-in](media/self-service-sign-up-overview/example-sign-in-with-facebook.png)

Azure AD creates a relationship with Woodgrove using the partner's Facebook account, and creates a new guest account for the user after they sign up.

Woodgrove wants to know more about the user, like name, business name, business registration code, phone number.

![Example showing user sign-up attributes](media/self-service-sign-up-overview/example-enter-user-attributes.png)

The user enters the information, continues the sign-up flow, and gets access to the resources they need.

![Example showing the user signed in](media/self-service-sign-up-overview/example-signed-in.png)

## Next steps

 For details, see how to [add self-service sign-up to an app](self-service-sign-up-user-flow.md).