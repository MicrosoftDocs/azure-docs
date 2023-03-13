---
title: Integrating CIAM tenant with other systems
description: Learn how to use integrate the CIAM tenant with external systems.  
services: active-directory
author: csmulligan
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: conceptual
ms.date: 03/08/2023
ms.author: cmulligan
ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to know 
---
<!--   The content is mostly copied from https://learn.microsoft.com/en-us/azure/active-directory/external-identities/identity-providers. For now the text is used as a placeholder in the release branch, until further notice. -->

# Integrating the CIAM tenant with other systems

Azure Active Directory (Azure AD) B2B collaboration works with most apps that integrate with Azure AD. In this section, we walk through instructions for configuring some popular SaaS apps for use with Azure AD B2B.

Before you look at app-specific instructions, here are some rules of thumb:

For most of the apps, user setup needs to happen manually. That is, users must be created manually in the app as well.

For apps that support automatic setup, such as Dropbox, separate invitations are created from the apps. Users must be sure to accept each invitation.

In the user attributes, to mitigate any issues with mangled user profile disk (UPD) in guest users, always set User Identifier to user.mail.

## Dropbox Business

To enable users to sign in using their organization account, you must manually configure Dropbox Business to use Azure AD as a Security Assertion Markup Language (SAML) identity provider. If Dropbox Business has not been configured to do so, it cannot prompt or otherwise allow users to sign in using Azure AD.

## Next steps
- [Customizing the sign-in look and feel](concept-branding-customers.md)



