---
title: Azure Marketplace SaaS Applications Technical Publishing Guide
description: Step-by-step guide and publishing checklists for publishing SaaS applications to Azure Marketplace
services: Marketplace, Compute, Storage, Networking, Blockchain, Security, SaaS
documentationcenter:
author: BrentL-Collabera
manager: 
editor: BrentL-Collabera

ms.assetid: 
ms.service: marketplace
ms.workload: 
ms.tgt_pltfrm: 
ms.devlang: 
ms.topic: article
ms.date: 02/28/2018
ms.author: pabutler

---



# SaaS applications technical publishing guide

Welcome to the Azure Marketplace SaaS Applications Technical Publishing Guide. This guide is designed to help candidate and existing publishers to list their applications and services in the Azure Marketplace using the SaaS Applications offering.  
You want to use SaaS Applications offer when your solution will be deployed in your own Azure subscription and customers will log on through an interface that you design and manage to test the application. It does this by using [Azure Active Directory (Azure AD)](https://docs.microsoft.com/azure/active-directory/active-directory-whatis) to leverage your existing trial environment. In other words, it is a customer-led, partner-hosted free trial. It is critical to expose your solution in a way that gives cloud buyers the opportunity to experience your solution independently for no charge or fee, and so this offer type provides a trial experience that matches how customers search for cloud solutions.  

For an overview of all other Marketplace offerings, please refer to the [Marketplace Publisher Guide](https://aka.ms/sellerguide).

## SaaS application technical guidance
The technical requirements for SaaS applications are simple. Publishers are only required to be integrated with Azure AD to be published.  Azure AD integration with applications is well documented and Microsoft provides multiple SDKs and resources to accomplish this.  

To start, we recommend that you have a subscription dedicated for your Azure Marketplace publishing, allowing you to isolate the work from other initiatives. In addition, if not already installed, we recommend that you have the following tools as part of your development environment: 
- [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest)  
- [Azure powerShell](https://docs.microsoft.com/powershell/azure/overview?view=azurermps-5.0.0)  
- [Azure Developer Tools (Review what's available)](https://azure.microsoft.com/tools/)  
- [Visual Studio Code](https://code.visualstudio.com/)  

### Resources
The following lists provide links to the best Azure AD resources to get you started: 

**Documentation**

- [Azure Active Directory Developer's Guide](https://docs.microsoft.com/azure/active-directory/develop/active-directory-developers-guide)

- [Integrating with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/develop/active-directory-how-to-integrate)

- [Integrating Applications with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/develop/active-directory-integrating-applications)

- [Azure Roadmap - Security and Identity](https://azure.microsoft.com/roadmap/?category=security-identity)

**Videos**

- [Azure Active Directory Authentication with Vittorio Bertocci](https://channel9.msdn.com/Shows/XamarinShow/Episode-27-Azure-Active-Directory-Authentication-with-Vittorio-Bertocci?term=azure%20active%20directory%20integration)

- [Azure Active Directory Identity Technical Briefing - Part 1 of 2](https://channel9.msdn.com/Blogs/MVP-Enterprise-Mobility/Azure-Active-Directory-Identity-Technical-Briefing-Part-1-of-2?term=azure%20active%20directory%20integration)

- [Azure Active Directory Identity Technical Briefing - Part 2 of 2](https://channel9.msdn.com/Blogs/MVP-Azure/Azure-Active-Directory-Identity-Technical-Briefing-Part-2-of-2?term=azure%20active%20directory%20integration)

- [Building Apps with Microsoft Azure Active Directory](https://channel9.msdn.com/Blogs/Windows-Development-for-the-Enterprise/Building-Apps-with-Microsoft-Azure-Active-Directory?term=azure%20active%20directory%20integration)

- [Microsoft Azure Videos focused on Active Directory](https://azure.microsoft.com/resources/videos/index/?services=active-directory)

**Training**  
- [Microsoft Azure for IT Pros Content Series: Azure Active Directory](https://mva.microsoft.com/en-US/training-courses/microsoft-azure-for-it-pros-content-series-azure-active-directory-16754?l=N0e23wtxC_2106218965)

**Azure Active Directory Service Updates**  
- [Azure AD Service updates](https://azure.microsoft.com/updates/?product=active-directory)

For support, you can use the following resources:
- [MSDN Forums](https://social.msdn.microsoft.com/Forums/azure/en-US/home?forum=WindowsAzureAD)
- [StackOverflow](https://stackoverflow.com/questions/tagged/azure-active-directory)

## The Azure Active Directory gallery
In addition to having your application listed in the Azure Marketplace/AppSource, you can also have the application listed in the Azure AD application gallery that is part of the Azure Marketplace AppStore. Customers who use Azure AD as an identity provider can find the different SaaS application connectors published here. IT administrators can add connectors from the app gallery, and then configure and use the connectors for single sign-on (SSO) and provisioning. Azure AD supports all major federation protocols for SSO, including SAML 2.0, OpenID Connect, OAuth, and WS-Fed.  

After you've tested that your application integration works with Azure AD, submit your request for access on our Application Network Portal. If you have an Office 365 account, use that to sign in to the portal. If you do not have an Office 365 account, you can use your Microsoft account (such as Outlook or Hotmail) to sign in.

## Program benefits
- Provides the best possible single sign-on experience for customers
- Simple and minimal configuration of the application
- Customers can search for the application and find it in the gallery
- Any customer can use this integration regardless of which Azure AD SKU they use (Free, Basic or Premium)
- Step-by-step configuration tutorial for our mutual customers
- Enables the user provisioning for the same app if you are using SCIM

## Prerequisites
To list an application in the Azure AD gallery, the application must first implement one of the federation protocols supported by Azure AD. Please read the terms and conditions of the Azure AD application gallery located at [Microsoft Azure Legal Information](https://azure.microsoft.com/support/legal/).  

The following describes additional prerequisite information depending on which protocol you are using:

**OpenID Connect** - Create the multi-tenant application in Azure AD and implement consent framework for your application. Send the login request to the common endpoint so that any customer can provide consent to the application. You can control the customer user access based on the tenant ID and user's UPN received in the token.  
**SAML 2.0 or WS-Fed** - Your application should have a capability to do the SAML or WS-Fed SSO integration in either SP or IdP mode.
