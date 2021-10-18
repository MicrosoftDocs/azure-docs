---
title: Operator assistance in Azure Active Directory 
description: Learn about deprecation of Operator assistance feature in Azure Active Directory

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 10/18/2021

ms.author: justinha
author: sajiang
manager: daveba
ms.reviewer: sajiang

ms.collection: M365-identity-device-management
---
# How to enable Operator Assistance

The Operator Assistance is one of the features within Azure AD and can be enabled if you do not allow automatic transfers and instead require an operator to manually transfer phone calls. When this setting is enabled, the office phone number is dialed and when answered, the system asks the operator to transfer the call to a given extension.

Operator Assistance can be enabled for an entire tenant or for an individual user. If the setting is **On**, the entire tenant is enabled for Operator Assistance. If you have chosen **phone call** as the default method, and have an extension specified as part of your office phone number (delineated by **x**), the phone call will enter Operator Assistance mode.

Here’s an example for a customer in U.S. The customer has an office phone number 425-555-1234x5678. When Operator Assistance is enabled, the system will dial 425-555-1234. Once answered, the customer (also known as the operator) is asked to transfer the call to extension 5678. Once transferred and answered, the system recites the normal MFA prompt and awaits approval.

If the setting is **Off**, the system will automatically dial extensions as part of the phone number. Your admin can still specify individual users who should be enabled for Operator Assistance by prefixing the extension with ‘@’. For example, 425-555-1234x@5678 would indicate that operator assistance should be used, even though the setting is **Off**.

## How is this feature enabled or disabled?

You can check the status of this feature in your own tenant by navigating to the [Azure AD portal](https://ms.portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade), then in the left pane, click **Security** > **MFA** > **Phone call settings**. The switch under **Operator required to transfer extensions** indicates whether the setting is enabled (toggle set to **On**) or disabled (toggle set to **Off**). 

You can improve the reliability, security and create a frictionless experience in MFA authentication by using the following guidance:

- You have [registered a direct phone number](http://aka.ms/mfasetup) (contains no extension) or [other method](concept-authentication-methods.md) to be used for Multi-Factor Authentication or Self-service password reset if enabled 
- Your admins have registered a direct phone number (contains no extension) on behalf of the user to be used for Multi-Factor Authentication or Self-service password reset if enabled. 
- Phone system supports automated attendant functionality 
 




