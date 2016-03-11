<properties
   pageTitle="Comparing capabilities for managing external identities using Azure Active Directory | Microsoft Azure"
   description="Compares Azure Active Directory B2B collaboration, B2C, and Multi-tenant App for supporting authentication and authorization for external identities"
   services="active-directory"
   documentationCenter="" 
   authors="arvindsuthar"
   manager="cliffdi"
   editor=""
   tags=""/>

<tags
   ms.service="active-directory"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="identity"
   ms.date="02/24/2016"
   ms.author="asuthar"/>

# Comparing capabilities for managing external identities using Azure Active Directory

In addition to managing mobile workforce access to SaaS apps, Azure Active Directory (Azure AD) can help your organization share resources with business partners and deliver applications to businesses and consumers.

## Developing applications for businesses

Do you provide a service or application, such as a payroll service, to businesses? Azure AD provides the identity platform that allows you to build applications that seamlessly integrate with millions of organizations that have already configured Azure AD as part of deploying Office 365 or other enterprise services.

**Example:** A pharmaceutical distributor provides medical supplies and information systems to the healthcare industry. They needed to field an analytics application to medical practices and wanted customers to manage their own identities. This company chose Azure AD as the identity platform for their practice management application, providing Azure AD identities to their customers at sign up when necessary. For more information, see [Azure Active Directory developer's guide](active-directory-developers-guide.md).

## Enabling business partner access to your corporate resources

Do you have business partners or others outside your company who need to access your enterprise resources, such as a SharePoint site or your ERP system? Azure AD enables admins to grant external users (who may or may not exist in Azure AD) single sign on access to corporate applications. This improves security as users lose access when they leave the partner organization, while you control access policies within your organization. This also simplifies administration as you don’t need to manage an external partner directory or per partner federation relationships.

**Example:** An imaging company provides retailers with photo imaging services and operates the largest retail network of printing kiosks. They chose Azure AD to enable thousands of users at their retail business partners to use their own credentials to download the latest partner marketing materials and reorder photo processing supplies from the company’s supplier extranet. For more information, see [Azure AD B2B collaboration](active-directory-b2b-what-is-azure-ad-b2b.md).

## Developing applications for consumers

Do you need to securely and cost-effectively publish online applications, such as a retail store front, to millions of consumers? Azure AD provides a platform enabling social as well as username/password sign-in, branded self-service sign up, and self-service password reset for consumers of your application. This increases convenience for your consumers while reducing load on your developers.

**Example:** The \#1 sports franchise in the world needed to directly engage with its 450 million fans. To do this, they built a mobile app using Azure AD for user authentication and profile storage. Fans get simplified registration and sign-in through use of social accounts like Facebook, or they can use traditional username/passwords for a seamless experience across iOS, Android, and Windows phones. Building on the established Azure AD platform significantly reduced custom code while giving the franchise customized branding and alleviating concerns about security, data breaches, and scalability. For more information, see [Azure AD B2C](https://azure.microsoft.com/documentation/services/active-directory-b2c/).

## Comparison of Azure AD capabilities

Each of the scenarios already discussed in this article is addressed by capabilities within Azure AD. This table should help clarify which capabilities are most relevant to you:

| **Consider this product...**       | [Azure AD multi-tenant SaaS app](active-directory-developers-guide.md)    | [Azure AD B2B collaboration](active-directory-b2b-what-is-azure-ad-b2b.md)        | [Azure AD B2C](https://azure.microsoft.com/documentation/services/active-directory-b2c/)                |
|-----------------------|-------------------------|----------------------------|------------------------|
| **If I need to provide...** | a service to businesses | partner access to my apps  | a service to consumers |
| **And I am similar to...**  | Pharma distributor      | Imaging company            | Sports franchise       |
| **Deploying an app for...**  | Practice management     | Supplier extranet          | Soccer fans            |
| **Targeting...**        | Doctor’s offices        | Approved business partners | Anyone with email      |
| **Accessible when...**      | Customer admin consents | My admin invites           | The consumer signs up      |
