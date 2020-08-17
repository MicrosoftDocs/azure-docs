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

Every authentication in B2C must be configured by a user flow. Advanced users using Identity Experience Framework/Custom policies would configure those instead. Advanced configuration with samples are included below.

The latest versions of user flows must be used for compatibility with Conditional Access. Under properties of your user flow, look for a setting labeled **Conditional Access** to confirm that you're using the latest version of a user flow.

## Add Conditional Access to a user flow

Only two settings per user flow need to be revisited:

Multifactor Authentication.  MFA is setup independently of CA.  MFA can now be completed by the end user using an SMS/Voice one time code OR via an email One time Password.   

MFA can be activated “Always On” – in this modality MFA will always be required without regards to CA 

MFA can be set to Conditional – in this mode, MFA will be required only when an active Conditional Access Policy requires it. 

Conditional Access -  This setting should always be set as default to ON.  Advanced use cases may require it to be OFF during troubleshooting, migrations, or in legacy implementations. 
