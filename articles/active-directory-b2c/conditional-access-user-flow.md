---
title: Add Conditional Access to a user flow in Azure AD B2C
description: Learn how Conditional Access is at the heart of the new identity driven control plane.

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: overview
ms.date: 09/01/2020

ms.author: mimart
author: msmimart
manager: celested

ms.collection: M365-identity-device-management
---
# Add Conditional Access to a user flow in Azure AD B2C

[!INCLUDE [b2c-public-preview-feature](../../includes/active-directory-b2c-public-preview.md)]

In your applications you may have user flows that enable users to sign up, sign in, or manage their profile. By adding Conditional Access You can create multiple user flows of different types in your Azure Active Directory B2C (Azure AD B2C) tenant and use them in your applications as needed. User flows can be reused across applications.

In this article, you learn how to:

Create a sign-up and sign-in user flow
Create a profile editing user flow
Create a password reset user flow
This tutorial shows you how to create some recommended user flows by using the Azure portal. If you're looking for information about how to set up a resource owner password credentials (ROPC) flow in your application, see Configure the resource owner password credentials flow in Azure AD B2C.

Integrate with Azure AD B2C user flows and custom policies. Conditions can be triggered from built-in user flows in Azure AD B2C or can be incorporated into B2C custom policies. As with other aspects of the B2C user flow, end user experience messaging can be customized according to the organization’s voice, brand, and mitigation alternatives.

Use user flows for quick configuration and enablement of common identity tasks like sign up, sign in, and profile editing.
your users access your organization's resources from anywhere using a variety of devices and apps. As a result, focusing on who can access a resource is no longer enough. You also need to consider where the user is, the device being used, the resource being accessed, and more.

Azure Active Directory (Azure AD) Conditional Access (CA) analyses signals such as user, device, and location to automate decisions and enforce organizational access policies for resource.  

Every authentication in B2C must be configured by a user flow. Advanced users using Identity Experience Framework/Custom policies would configure those instead. Advanced configuration with samples are included below.

The latest versions of user flows must be used for compatibility with Conditional Access. Under properties of your user flow, look for a setting labeled **Conditional Access** to confirm that you're using the latest version of a user flow.

## Add Conditional Access to a user flow

Only two settings per user flow need to be revisited:

Multifactor Authentication.  MFA is setup independently of CA.  MFA can now be completed by the end user using an SMS/Voice one time code OR via an email One time Password.   

MFA can be activated “Always On” – in this modality MFA will always be required without regards to CA 

MFA can be set to Conditional – in this mode, MFA will be required only when an active Conditional Access Policy requires it. 

Conditional Access -  This setting should always be set as default to ON.  Advanced use cases may require it to be OFF during troubleshooting, migrations, or in legacy implementations. 
