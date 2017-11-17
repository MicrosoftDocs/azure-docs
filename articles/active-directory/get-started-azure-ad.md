---
# required metadata
title: Get started with Azure Active Directory | Microsoft Docs
description:
keywords:
author: jeffgilb
manager: femila
ms.author: jeffgilb
ms.reviewer: jsnow
ms.date: 10/04/2017
ms.topic: article
ms.prod:
ms.service: active-directory
ms.workload: identity
ms.technology:
ms.assetid:
services: active-directory
custom: it-pro

# optional metadata
#ROBOTS:
#audience:
#ms.devlang:
#ms.suite:
#ms.tgt_pltfrm:
#ms.custom:
---

# Get started with Azure AD
Modern identity management requires scaleable, consistent reliablity to ensure the availablity of applications and services to only authenticated users. To adequately support the identity management needs of users, IT needs a way to provide access to approved, public software as a service (SaaS) apps, a way to host internal line of business apps, and even ways to enhance on-premises app development and usage. All of these requirements point to the need of a cloud-based identity management solution.      

Azure Active Directory (Azure AD) is Microsoft’s multi-tenant, cloud based directory and identity management service. Azure AD combines core directory services, advanced identity governance, and application access management. The multi-tenant, geo-distributed, high availability design of Azure AD means that you can rely on it for your most critical business needs.

Azure AD includes a full suite of identity management capabilities including the ability to synchronize on-premises resource information, customizable company branding, simple license management, and even self-service password management.  These easy to set up capabilities can help get started using Azure AD to secure cloud-based applications, streamline IT processes, cut costs, and help ensure that corporate compliance goals are met.

![Azure AD ](./media/get-started-azure-ad/Azure_Active_Directory.png)

The rest of this article tells you how to get started with Azure AD. 

## Sign up for Azure Active Directory Premium
To [get started with Azure Active Directory (Azure AD) Premium](active-directory-get-started-premium.md), you can purchase licenses and associate them with your Azure subscription. If you create a new Azure subscription, you will also need to activate your licensing plan and Azure AD service access. 

To sign up for Active Directory Premium, you have several options: 

- Use your Azure or Office 365 subscription
- Use an Enterprise Mobility + Security licensing plan
- Use a Microsoft Volume Licensing plan

> ### Verification step
> After activating the subscription, ensure that you can log in to the service.

## Add a custom domain name
Every Azure AD directory comes with an initial domain name in the form of *domainname*.onmicrosoft.com. The initial domain name cannot be changed or deleted, but you can also [add your corporate domain name to Azure AD](add-custom-domain.md). For example, your organization probably has other domain names used to do business and users who sign in using your corporate domain name. Adding custom domain names to Azure AD allows you to assign user names in the directory that are familiar to your users, such as ‘alice@contoso.com.’ instead of 'alice@.onmicrosoft.com'. The process is simple:

1. Add the custom domain name to your directory
2. Add a DNS entry for the domain name at the domain name registrar
3. Verify the custom domain name in Azure AD

> ### Verification step
> After adding a custom domain, ensure that it has the **Verified** status displayed on the **Domain names** blade of the Azure AD portal.

## Add company branding to your sign-in page 
To avoid confusion, many companies want to apply a consistent look and feel across all the websites and services they manage. Azure Active Directory (Azure AD) provides this capability by allowing you to [customize the appearance of the sign-in page with your company logo and custom color schemes](customize-branding.md). The sign-in page is the page that appears when you sign in to Office 365 or other web-based applications that are using Azure AD as their identity provider. You interact with this page to enter your credentials.

> ### Verification step
> Log in to the Azure portal and ensure that your customized sign-in page and any additional language customizations have been configured correctly. 

## Add new users
You can [add new users to your organization's Azure AD](add-users-azure-active-directory.md) one at a time using the Azure portal or by synchronizing your on-premises Windows Server AD resource data. You can add cloud-based users directly from the Azure AD portal or synchronize on-premises user information.

To enable on-premises identity synchronization to Azure AD, you need to install and configure [Azure AD Connect](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnect) on a server in your organization. This application handles synchronizing users and groups from your existing identity source to your Azure AD tenant.

> ### Verification step
> After creating or synchronizing new users, make sure they are visible in Azure AD.

## Assign licenses
Although obtaining a subscription is all you need to configure paid capabilities, you must still [assign user licenses](license-users-groups.md) for Azure AD Premium paid features. Any user who should have access to, or who is managed through, an Azure AD paid feature must be assigned a license. License assignment is a mapping between a user and a purchased service, such as Azure AD Premium, Basic, or Enterprise Mobility + Security.

You can use group-based license assignment to set up rules such as in the following examples:

- All users in your directory automatically get a license
- Everyone with the appropriate job title gets a license
- You can delegate the decision to other managers in the organization (by using self-service groups)

> ### Verification step
> Review assigned and available licenses under **Azure Active Directory** > **Licenses** > **All products**.

## Configure self-service password reset
[Self-service password reset (SSPR)](active-directory-passwords-getting-started.md) offers a simple means for IT administrators to enable users to reset or unlock their passwords or accounts. The system includes detailed reporting to track when users use the system along with notifications to alert you to misuse or abuse.

> ### Verification step
> Review enabled SSPR properties under **Azure Active Directory** > **Password reset** to ensure the proper user and group assignments have been made. 


### Learn more
[Azure Active Directory Product Page](https://azure.microsoft.com/services/active-directory/)

[Azure Active Directory pricing information page](https://azure.microsoft.com/pricing/details/active-directory/)