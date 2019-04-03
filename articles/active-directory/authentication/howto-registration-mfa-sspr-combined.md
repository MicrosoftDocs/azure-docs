---
title: Get started with combined registration for Azure AD SSPR and MFA (preview) - Azure Active Directory
description: Enable combined Azure AD Multi-Factor Authentication and self-service password reset registration (preview)

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 03/18/2019

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: sahenry

ms.collection: M365-identity-device-management
---
# Enable combined security information registration (preview)

Before enabling the new experience, review the article [Combined security information registration (preview)](concept-registration-mfa-sspr-combined.md) to ensure you understand the functionality and impact of this feature.

![Combined security information registration enhanced experience](media/howto-registration-mfa-sspr-combined/combined-security-info-more-required.png)

|     |
| --- |
| Combined security information registration for Azure Multi-Factor Authentication and Azure AD self-service password reset is a public preview feature of Azure Active Directory. For more information about previews, see  [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/)|
|     |

## Enable combined registration

Complete the following steps to enable combined registration:

1. Sign in to the Azure portal as a user administrator or global administrator.
2. Browse to **Azure Active Directory** > **User settings** > **Manage settings for access panel preview features**.
3. Under **Users can use preview features for registering and managing security info - refresh**, choose to enable for a **Selected** group of users or for **All** users.

![Enable the combined security info preview experience for All users](media/howto-registration-mfa-sspr-combined/combined-security-info-enable.png)

> [!IMPORTANT]
> Starting in March of 2019 the phone call options will not be available to MFA and SSPR users in free/trial Azure AD tenants. SMS messages are not impacted by this change. Phone call will continue to be available to users in paid Azure AD tenants. This change only impacts free/trial Azure AD tenants.

> [!NOTE]
> Once you enable combined registration, users who register or confirm their phone number or mobile app through the new experience can use them for MFA and SSPR, if those methods are enabled in the MFA and SSPR policies. If you then disable this experience, users who go to the previous SSPR registration page at `https:/aka.ms/ssprsetup` will be required to perform multi-factor authentication before they can access the page.

If you have configured the site to zone assignment list in Internet Explorer the following sites must be in the same zone:

* [https://login.microsoftonline.com](https://login.microsoftonline.com)
* [https://mysignins.microsoft.com](https://mysignins.microsoft.com)
* [https://account.activedirectory.windowsazure.com](https://account.activedirectory.windowsazure.com)

## Next steps

[Available methods for MFA and SSPR](concept-authentication-methods.md)

[Configure self-service password reset](howto-sspr-deployment.md)

[Configure Azure Multi-Factor Authentication](howto-mfa-getstarted.md)

[Troubleshooting combined security info registration](howto-registration-mfa-sspr-combined-troubleshoot.md)