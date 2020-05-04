---
title: Publisher verification overview
description: An overview of publisher verification for Microsoft identity platform.
services: active-directory
author: rwike77
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 04/30/2020
ms.author: ryanwi
ms.custom: aaddev
ms.reviewer: jesakowi
---

# Publisher verification

Publisher verification allows developers with a verified (or “vetted”) Microsoft Partner Center (MPN) account to mark one or more app registrations as publisher verified.   

This feature is primarily targeted at developers building multi-tenant apps that leverage [OAuth 2.0 and OpenID Connect](active-directory-v2-protocols.md) with the [Microsoft identity platform](v2-overview.md). These apps can sign users in using OpenID Connect, or they may use OAuth to request access to data using APIs like [Microsoft Graph](https://developer.microsoft.com/graph/).

## Benefits
Publisher verification provides the following benefits:
- Transparency and risk reduction for customers- this capability helps customers understand which apps being used in their organizations are published by developers they trust. 

- UX differentiation- a “verified” badge will appear on the Azure AD [consent prompt](application-consent-experience.md), Enterprise Apps page, and additional UX surfaces used by end-users and admins. 

- Smoother enterprise adoption- admins will soon be able to configure new User Consent Policies, and publisher verification status will be one of the primary policy criteria. 

- Risk evaluation- Microsoft’s detections for “risky” consent requests will include publisher verification as a signal. 

## Requirements
There are a few pre-requisites for publisher verification, some of which will have already been completed by many Microsoft partners. They are: 

1. An MPN ID for a valid [Microsoft Partner Network](https://partner.microsoft.com/membership) account that has completed the [verification](/partner-center/verification-responses) process. This MPN account must be the [Partner global account (PGA)](/partner-center/account-structure#the-top-level-is-the-partner-global-account-pga) for your organization. 

1. An Azure AD tenant with a DNS-verified [custom domain](/azure/active-directory/fundamentals/add-custom-domain), which must match the domain of the email address used during verification in the previous step. 

1. An app registered in an Azure AD tenant, with a [Publisher Domain](howto-configure-publisher-domain.md) configured using the same domain as previously used. 

1. The user performing verification must be authorized to make changes to both the app registration in Azure AD and the MPN account in Partner Center. 

  1. In Azure AD this user must either be the Owner of the app or have one of the following [roles](/azure/active-directory/users-groups-roles/directory-assign-admin-roles): Application Admin, Cloud Application Admin, Global Admin. 

  1. In Partner Center this user must have of the following [roles](/partner-center/permissions-overview): MPN Admin, Accounts Admin, or a Global Admin (this is a shared role mastered in Azure AD). 

Developers who have already met these pre-requisites can get verified in a matter of minutes. If they have not been met, getting set up is free. 

If you cannot currently meet these requirements, or don’t know if you can, you can still participate in the private preview! We want to hear your feedback and help you understand how you can satisfy these requirements. 

## Frequently Asked Questions 

- **When will the verified badge start showing up on the consent screen?** Admins and end-users will be able to see the badge even during the Private Preview phase. Users who get prompted to consent to your app will start seeing the badge soon after you have gone through the process successfully, although it may take some time for this to replicate throughout the system. This will generally be a few minutes but could be a few hours. 

- **When will other experiences start showing the badge or using verification status?**  

  - The Enterprise Apps experience will start showing an indication of publisher verified apps by Public Preview in mid-May. Admins will be able to set policies using this information in a similar timeframe. 

  - Dates on additional UI surfaces have not been announced. 

  - Microsoft’s risk-based consent capability will start factoring in verification status immediately. 

- **I don’t know my MPN ID- where do I find it?** See the [Microsoft Partner Network FAQ](https://support.microsoft.com/help/4515614/frequently-asked-questions-joining-the-microsoft-partner-network-mpn) for guidance on how to find your organization’s MPN ID. 

- **How do I make sure my MPN verification (also known as vetting/authorization) is complete in Partner Center?** If you are unsure whether vetting has been completed, you can check the [partner profile](https://partner.microsoft.com/pcv/accountsettings/connectedpartnerprofile) page in Partner Center. It will say “Verification status: Authorized”. 

- **I do not have an MPN account and need to create one. How long will verification take?** This process is often quick, especially if you have enrolled in other Microsoft programs before. However, at times of increased load, you should expect three weeks for a net-new vetting to be processed. See [Verify your account information](/partner-center/verification-responses) or [Vetting process for Partners in Partner Center](https://support.microsoft.com/help/4522960/vetting-process-for-partners-in-partner-center) for more details. 

- **Do I need to complete this process again for each app that my organization publishes?** Most of the steps in this process only need to be performed once. For example, you will only need a single verified/vetted MPN ID. However, this MPN ID will need to be associated with each app you want to mark as publisher verified. You can use PowerShell or Microsoft Graph to help mark multiple apps verified in bulk. 

- **Will I have to go through parts of this process again in the future to renew my app’s publisher verification status?** As of Private Preview, the renewal/attestation process is not yet defined. Microsoft reserves the right to add a required renewal process in the future, which may involve one or more steps needing to be performed again. 

- **I successfully marked my app publisher verified, but the verified Publisher display name is showing up incorrectly. Why?** The display name property is pulled directly from your MPN account in Partner Center when you mark your app registration as publisher verified. If it is incorrect, that means it was set incorrectly in Partner Center. You can confirm the display name by visiting the [partner profile](https://partner.microsoft.com/pcv/accountsettings/connectedpartnerprofile) page in Partner Center. See the next question for instructions on updating it, if necessary. 

- **My organization’s name has changed, or was incorrect initially, and needs to be updated. How do I do this?** You can update your organization’s name on the [Partner profile](https://partner.microsoft.com/pcv/accountsettings/connectedpartnerprofile) page in Partner Center. After doing this, you will need to perform the initial [verification process](/partner-center/verification-responses) again. After that completes, you will need to update your Verified Publisher information in Azure AD using the “update” button on the Branding blade where you initially performed verification. 

- **My MPN ID has changed, how do I update it on my app(s) in Azure AD?** You will need to remove your old MPN ID from each app that was previously marked as publisher verified and go through the binding process again with the new one. The same requirements will apply as the initial process.  

- **How much does this cost? Does it require any license?** Microsoft does not charge developers for publisher verification and it does not require any specific license. 

- **Is this the same thing as Microsoft 365 Publisher Attestation? What about Microsoft 365 App Certification?** These are not the same things. Publisher verification is a complementary but separate feature to both [Microsoft 365 Publisher Attestation](/microsoft-365-app-certification/docs/attestation) and [Microsoft 365 App Certification](/microsoft-365-app-certification/docs/certification). For more info: 

  - **Publisher Attestation** is a voluntary program allows you to complete a self-assessment of your app's security, data handling, and compliance practices. The information you provide will be processed and presented to your potential customers so they can better evaluate your app before enabling it for their organization. 

  - **Microsoft 365 App Certification** offers assurance and confidence to enterprise organizations that data and privacy are adequately secured and protected when your Microsoft Word, Excel, PowerPoint, Outlook, Teams integration, or Graph API app is introduced to the Microsoft 365 platform. Certification confirms that an app solution is compatible with Microsoft technologies, compliant with cloud app security best practices, and supported by Microsoft, a trusted partner. 

  You will need to complete the publisher verification process independently of participation in those programs. 

- **Is this the same thing as the Azure AD Application Gallery?** No- publisher verification is a complementary but separate feature to the [Azure Active Directory application gallery](/azure/active-directory/azuread-dev/howto-app-gallery-listing). You will need to complete the publisher verification process independently of participation in that program. 




**What information does publisher verification provide to customers?** 

The primary goal of publisher verification (Preview) is to help admins and end users better understand the authenticity of application developers integrating with the Microsoft identity platform. In other words, is the publisher a known source or a bad actor disguising themselves as a well-known publisher? When an application is marked as publisher verified, it means that the publisher has verified their identity using their Microsoft Partner Network (MPN) account and has associated this MPN account with their application registration. 

**What information does Publisher Verification not provide?**  

When an application is marked publisher verified this does not indicate whether the application or its publisher  has achieved any specific certifications, complies with industry standards, adheres to best practices, etc. Other Microsoft programs do provide this information, including [Microsoft 365 App Certification](/microsoft-365-app-certification/overview).

**How does a publisher obtain a verified publisher status?**  

Publisher verification is performed on an application-by- application basis so a publisher must verify each application where they would like a publisher verification badge to appear.   

For a publisher to mark an app as publisher verified, the following requirements must be met: 

1. The publisher must have a valid [Microsoft Partner Network account](https://partner.microsoft.com/membership).  

1. This account must have completed the [MPN account verification](/partner-center/verification-responses) process.  

1. This account must be the partner global account (PGA) for the publisher’s organization. 

1. The app must be registered in an Azure Active Directory tenant.  

1. A [publisher domain](/azure/active-directory/develop/howto-configure-publisher-domain) must be set on the application. 

1. The domain used for email verification in the partner’s MPN account must match either: 

  1. A DNS-verified [custom domain](/azure/active-directory/fundamentals/add-custom-domain) in the tenant where the app is registered  

  1. The app publisher domain from #5 

1. The user performing verification must be authorized to make changes to both the app registration in Azure AD and the MPN account in Partner Center. 

  1. In Azure AD this user must either be the owner of the app or have one of the following [roles](/azure/active-directory/users-groups-roles/directory-assign-admin-roles): application admin, cloud application admin, global admin. 

  1. In Partner Center this user must have one of the following [roles](/partner-center/permissions-overview): MPN admin, accounts admin, or a global admin (this is a shared role mastered in Azure AD). 

## Additional resources
Microsoft identity platform & Azure AD 

- [Register an application with the Microsoft identity platform](quickstart-register-app.md)
- [Add a custom domain to Azure AD with DNS verification](/azure/active-directory/fundamentals/add-custom-domain) 
- [Configure an app's publisher domain](howto-configure-publisher-domain.md)
- [Administrator role permissions in Azure Active Directory](/azure/active-directory/users-groups-roles/directory-assign-admin-roles)
- [Set up an Azure AD tenant](quickstart-create-new-tenant.md)

Microsoft Partner Network (MPN) and Partner Center 

- [Microsoft Partner Network Sign-up](https://partner.microsoft.com/membership)
- [Microsoft Partner Network FAQ](https://support.microsoft.com/help/4515614/frequently-asked-questions-joining-the-microsoft-partner-network-mpn)
- [Verify your account information](https://docs.microsoft.com/partner-center/verification-responses) 
- [Vetting process for Partners in Partner Center](https://support.microsoft.com/help/4522960/vetting-process-for-partners-in-partner-center) 
- [Partner Center Account Structure & Hierarchy](/partner-center/account-structure) 
- [Partner Center Roles & Permissions](/partner-center/permissions-overview) 

## Next steps
* Learn how to [mark an app as publisher verified](mark-app-as-publisher-verified.md)
* [Troubleshoot](troubleshoot-publisher-verification.md) publisher verification