---
title: Dynamics 365 for Customer Engagement offer prerequisites | Azure Marketplace 
description: The prerequisites for publishing an Azure application offer on the Azure Marketplace.
services: Dynamics 365 for Customer Engagement offer, Azure, Marketplace, Cloud Partner Portal, 
author: v-miclar
ms.service: marketplace
ms.topic: conceptual
ms.date: 03/13/2019
ms.author: pabutler
---

# Dynamics 365 for Customer Engagement prerequisites

This article describes the technical and business prerequisites for publishing a Dynamics 365 for Customer Engagement application offer on the AppSource Marketplace.  If you have not already done so, review the [Office 365, Dynamics 365, PowerApps, and Power BI Offer Publishing Guide](../../appsource-offer-publishing-guide.md).


## Technical requirements

Your Dynamics 365 for Customer Engagement application must conform to the [Microsoft AppSource app review guidelines](https://smp-cdn-prod.azureedge.net/documents/AppsourceGuidelines/Microsoft%20AppSource%20app%20review%20guidelines_v5.pdf), which includes the following requirements:


|              Requirement             |        Description           |
|            ---------------           |      ---------------         |
| Azure Active Directory integration   | Your app must allow Azure Active Directory federated single sign-on (AAD federated SSO) with consent enabled. For more information, see [How to get AppSource Certified for Azure Active Directory](https://docs.microsoft.com/azure/active-directory/develop/howto-get-appsource-certified). |
| Integration with Microsoft Cloud services (optional) | Where this functionality is required, your app should integrate with other Microsoft Cloud services like Microsoft Power BI, Microsoft Flow, or Microsoft Azure services such as machine learning or cognitive services. |
| Line-of-business focused            |  Your app must focus on a well-defined business process or issue, primarily target business customers, and enable users to sign in with their work credentials (username and password).  |
| Free trial period and trial experience |  A customer must be able to use your app for free for a limited time: either a “Get it now” for free apps, a “Free trial” for a specified period,  a “Test drive” demonstrator, or a “Contact me”  request option.  |
| No/low configuration                 | Your app must be easy and quick to configure and set up (no development or customization required).  |
| Customer support                     | Support for your app must include a support link where customers can find help.  |
| Availability/uptime                  | Your app must have an uptime of at least 99.9%. |
|  |  |


## Business requirements

The business requirements include the following procedural, contractual, and legal obligations:

* You must be registered on the [Microsoft Partner Network (MPN)](https://partners.microsoft.com/PartnerProgram/simplifiedenrollment.aspx) or be a registered Cloud Marketplace Publisher. If you’re not registered, follow the steps in [Become a Cloud Marketplace Publisher](https://docs.microsoft.com/azure/marketplace/become-publisher).  (You may also connect with the [Dynamics 365 for Customer Engagement onboarding team](https://experience.dynamics.com/isvengage/)).

    >[!NOTE]
    >You should use the same Microsoft Developer Center registration account to sign in to the Cloud Partner Portal. You should have only one Microsoft account for your Azure Marketplace offerings. This account shouldn’t be specific to individual services or offers.

* Because AppSource doesn't offer a commerce-enabled publishing option, you must use your current ordering and billing infrastructure with no additional investment or changes.
* You’re responsible for making technical support available to customers in a commercially reasonable manner. This support can be free, paid, or through community approaches.
* You’re responsible for licensing your software and any third-party software dependencies.
* You should have created the associated marketing collateral, such as an official app name, description (in HTML format), logo images in PNG format (40 x 40, 90 x 90, 115 x 115, and 255 x 115 pixels), and Terms of Use and a Privacy policy.  


## Next steps

After you have met these requirements, you can [create a Dynamics 365 Customer Engagement offer](./cpp-create-offer.md) 
