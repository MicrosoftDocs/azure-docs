---
title: 'Azure Active Directory Domain Services for Azure Cloud Solution Providers | Microsoft Docs'
description: Azure Active Directory Domain Services for Azure Cloud Solution Providers.
services: active-directory-ds
documentationcenter: ''
author: mahesh-unnikrishnan
manager: mahesh-unnikrishnan
editor: curtand

ms.assetid: 56ccb219-11b2-4e43-9f07-5a76e3cd8da8
ms.service: active-directory-ds
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 12/07/2017
ms.author: maheshu
---

# Azure Active Directory (AD) Domain Services for Azure Cloud Solution Providers (CSP)
This article explains how you can use Azure AD Domain Services in an Azure CSP subscription.

## Azure CSP
Azure CSP is a program for Microsoft Partners and provides a license channel for various Microsoft cloud services. Azure CSP enables partners to manage sales, own the billing relationship, provide technical and billing support, and be the customer's single point of contact. In addition, Azure CSP provides a full set of tools, including a self-service portal and accompanying APIs to easily provision, manage, and provide billing for customers and their subscriptions.

The [Partner Center portal](https://docs.microsoft.com/azure/cloud-solution-provider/overview/partner-center-overview) acts as an entry point for all Azure CSP partners. It provides rich customer management capabilities, automated processing, and more. Azure CSP partners can use Partner Center capabilities by using a web-based UI or by using PowerShell and various API calls.

The following diagram illustrates how the CSP model works at a high-level. Contoso has an Azure AD Active Directory. They have a partnership with a CSP, who deploys and manages resources in their Azure CSP subscription. Note that Contoso may also have regular (direct) Azure subscriptions, which are billed directly to Contoso. 

![Overview of the CSP model](./media/csp/csp_model_overview.png)

The CSP partner's tenant has 3 special agent groups - Admin agents, Helpdesk agents and Sales agents. The Admin agents group is assigned to the tenant administrator role  in Contoso's Azure AD directory. As a result, a user belonging to the CSP partner's admin agents group has tenant admin privileges in Contoso's Azure AD directory. When the CSP partner provisions an Azure CSP subscription for Contoso, their admin agents group is assigned to the owner role for that subscription. This gives Contoso's admin agents the required privileges to provision Azure resources such as virtual machines, virtual networks and Azure AD Domain Services on behalf of Contoso.

For more information, see the [Azure CSP overview](https://docs.microsoft.com/azure/cloud-solution-provider/overview/azure-csp-overview)

## Benefits of using Azure AD Domain Services in an Azure CSP subscription
Azure AD Domain Services provides Windows Server AD compatible services in Azure such as LDAP, Kerberos/NTLM authentication, domain join, group policy, and DNS. Over the decades, many applications have been built to work against AD using these capabilities. Many independent software vendors (ISVs) have built and deployed applications at their customers' premises. These applications are onerous to support since that often requires access to the different environments in which these applications are deployed. With Azure CSP subscriptions, you have a simpler alternative with the scale and flexibility of Azure.

Azure AD Domain Services now supports Azure CSP subscriptions. You can now deploy your application in an Azure CSP subscription tied to your customer's Azure AD directory. As a result, your employees (support staff) can manage, administer, and service the virtual machines on which your application is deployed using your organization's corporate credentials. Further, you can provision an Azure AD Domain Services managed domain for your customer's Azure AD directory. Your application is connected to your customer's managed domain. Therefore, capabilities within your application that rely on Kerberos/NTLM, LDAP, or the [System.DirectoryServices API](https://msdn.microsoft.com/library/system.directoryservices) work seamlessly against your customer's directory. Your end customers benefit greatly from consuming your application as a service, without needing to worry about maintaining the infrastructure the application is deployed on.

All billing for Azure resources you consume in that subscription, including Azure AD Domain Services, is charged back to you. You maintain full control over the relationship with the customer when it comes to sales, billing, technical support etc. With the flexibility of the Azure CSP platform, a small team of support agents can service many such customers who have instances of your application deployed.


## Next steps
* [Enroll in the Azure CSP program](https://partnercenter.microsoft.com/partner/programs) and start creating business through Azure CSP.
* Review the list of [Azure services available in Azure CSP](https://docs.microsoft.com/azure/cloud-solution-provider/overview/azure-csp-available-services).
* [Enable Azure AD Domain Services using PowerShell](active-directory-ds-enable-using-powershell.md)
* [Get started with Azure AD Domain Services](active-directory-ds-getting-started.md)
