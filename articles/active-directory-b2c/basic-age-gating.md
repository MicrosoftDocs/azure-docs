---
title: Using age gating in Azure Active Directory B2C | Microsoft Docs
description: Learn about how to identify minors using your application.
services: active-directory-b2c
author: davidmu1
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 04/29/2018
ms.author: davidmu
ms.component: B2C
---

# Using age gating in Azure AD B2C

>[!IMPORTANT]
>This feature is in private preview.  Please see our [service blog](https://blogs.msdn.microsoft.com/azureadb2c/) for details as this becomes available, or contact AADB2CPreview@microsoft.com.  Do NOT use this on production directories, using these new features can result in data loss and may have unexpected changes in behavior until we go into general availability.  
>

## Age gating
Age gating allows you to use Azure AD B2C to identify minors in your application.  You can choose to block the user from signing into the application or allow them to go back to the application with additional claims that identify the user's age group and their parental consent status.  

>[!NOTE]
>Parental consent is tracked in a user attribute called `consentProvidedForMinor`.  You can update this property through the Graph API and it will use this field when updating `legalAgeGroupClassification`.
>

## Setting up your directory for age gating
In order to use age gating in a user flow, you need to configure your directory to have additional properties. This operation can be done through `Properties` in the menu (which will be available only if you're part of the private preview).  
1. In the Azure AD B2C extension, click on the **Properties** for your tenant in the menu on the left.
2. Under the **Age gating** section, click on the **Configure** button.
3. Wait for the operation to complete and your directory will be set up for age gating.

## Enabling age gating in your user flow
Once your directory is set up to use age gating, you can then use this feature in the preview version user flows.  This feature requires changes that make it incompatible with existing types of user flows.  You enable age gating with the following steps:
1. Create a preview user flow.
2. Once it has been created, go to **Properties** in the menu.
3. In the **Age gating** section, press the toggle to enable the feature.
4. You can then choose how you want to manage users that identify as minors.

## What does enabling age gating do?
Once age gating is enabled in your user flow, the user experience changes.  On sign up, users will now be asked for their date of birth and country of residence along with the user attributes configured for the user flow.  On sign in, users that haven't previously entered a date of birth and country of residence will be asked for this information the next time they sign in.  From these two values, Azure AD B2C will identify whether the user is a minor and update the `ageGroup` field, the value can be `null`, `Undefined`, `Minor`, `Adult`, and `NotAdult`.  The `ageGroup` and `consentProvidedForMinor` fields are then used to calculate `legalAgeGroupClassification`. 

## Age gating options
You can choose to have Azure AD B2C block minors without parental consent or allow them and have the application make decisions on what to do with them.  

### Allowing minors without parental consent
For user flows that allow either sign up, sign in or both, you can choose to allow minors without consent into your application.  For minors without parental consent, they're allowed to sign in or sign up as normal and Azure AD B2C issues an ID token with the `legalAgeGroupClassification` claim.  By using this claim you can choose the experience that these users have, such as going through an experience to collect parental consent (and update the `consentProvidedForMinor` field).

### Blocking minors without parental consent
For user flows that allow either sign up, sign in or both, you can choose to block minors without consent from application.  There are two options for handling blocked users in Azure AD B2C:
* Send a JSON back to the application - this option will send a response back to the application that a minor was blocked.
* Show an error page -  the user will be shown a page informing them that they can't access the application
