---
title: Azure Active Directory PoC Playbook Building Blocks| Microsoft Docs
description: Explore and quickly implement Identity and Access Management scenarios 
services: active-directory
keywords: azure active directory, playbook, Proof of Concept, PoC
documentationcenter: ''
author: dstefan
manager: asuthar

ms.assetid: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 3/28/2017
ms.author: dstefan

---
# Azure Active Directory Proof of Concept Playbook: Building Blocks

## Catalog of Actors

| Actor | Description | PoC Responsibility | 
| --- | --- | --- |
| **Identity Architecture / development team** | This team is usually the one that designs the solution, implements prototypes, drives approvals and finally hands off to operations | They provide the environments and are the ones evaluating the different scenarios from the manageability perspective |
| **On-Premises Identity Operations team** | Manages the different identity sources on-premises: Active Directory Forests, LDAP directories, HR systems, and Federation Identity Providers. | Provide access to onpremises resources needed for the PoC scenarios.<br/>They should be involved as little as possible| 
| **Application Technical Owners** | Technical owners of the different cloud apps and services that will integrate with Azure AD | Provide details on SaaS applications (potentially instances for testing) |
| **Azure AD Global Admin** | Manages the Azure AD configuration | Provide credentials to configure the synchronization service. Usually the same team as Identity Architecture during PoC but separate during the operations phase|
| **Database team** | Owners of the Database infrastructure | Provide access to SQL environment (ADFS or Azure AD Connect) for specific scenario preparations.<br/>They should be involved as little as possible |
| **Network team** | Owners of the Network infrastructure | Provide required access at the network level for the synchronization servers to properly access the data sources and cloud services (firewall rules, ports opened, IPSec rules etc.) | 
| **Security team** | Defines the security strategy, analyzes security reports from various sources and follows through on findings. | Provide target security evaluation scenarios | 

## Common Prerequisites for all building blocks

Below are some pre-requisites needed for any POC with Azure AD Premium. 

| Pre-requisite | Resources | 
| --- | --- |
| Azure AD tenant defined with a valid Azure subscription | [How to get an Azure Active Directory tenant](active-directory-howto-tenant.md)<br/>>[!Note]If you already have an environment with Azure AD Premium licenses, you can get a zero cap subscription by navigating to https://aka.ms/accessaad <br/>> Learn more at: https://blogs.technet.microsoft.com/enterprisemobility/2016/02/26/azure-ad-mailbag-azure-subscriptions-and-azure-ad-2/ and https://technet.microsoft.com/en-us/library/dn832618.aspx | 
| Domains defined and verified | [Add a custom domain name to Azure Active Directory](active-directory-domains-add-azure-portal.md)<br/>>[!Note]Some workloads such as Power BI could have provisioned an azure AD tenant under the covers. To check if a given domain is associated to a tenant, navigate to https://login.microsoftonline.com/<domain>/v2.0/.well-known/openid-configuration. If you get a successful response, then the domain is already assigned to a tenant and take over might be needed. If this is the case, please contact Microsoft for further guidance. Learn more about the takeover options at: https://azure.microsoft.com/en-us/documentation/articles/active-directory-self-service-signup/ | 
| Azure AD Premium or EMS trial Enabled | [Azure Active Directory Premium free for one month](https://azure.microsoft.com/en-us/trial/get-started-active-directory/) |
| You have assigned Azure AD Premium or EMS licenses to PoC users | [License yourself and your users in Azure Active Directory](active-directory-licensing-get-started-azure-portal.md) | 
| Azure AD Global Admin credentials | [Assigning administrator roles in Azure Active Directory](active-directory-assign-admin-roles-azure-portal.md) |
| Optional but strongly recommended: Parallel lab environment as a fallback | [Prerequisites for Azure AD Connect](./connect/active-directory-aadconnect-prerequisites.md) | 

## Directory Synchronization – Password Hash Sync (PHS) – New Installation 

Approximate time to Complete: 1 hour for less than 1,000 PoC users

### Pre-requisites


## Branding 



## SaaS Federated SSO Configuration 



## SaaS Password SSO Configuration



## SaaS Shared Accounts Configuration



## Groups – Delegated Ownership 



## Self Service Password Reset



## Self Service Access to Application Management 



## Azure Multi-Factor Authentication with Phone Calls



## MFA Conditional Access for SaaS applications 



## Privileged Identity Management (PIM) 



## Discovering Risk Events



## Deploying Sign-in risk policies 



[!INCLUDE [active-directory-playbook-toc](../../includes/active-directory-playbook-toc.md)]