---
title: 'Azure Active Directory Domain Services for Azure Cloud Solution Providers | Microsoft Docs'
description: Azure Active Directory Domain Services for Azure Cloud Solution Providers.
services: active-directory-ds
documentationcenter: ''
author: iainfoulds
manager: mahesh-unnikrishnan
editor: curtand

ms.assetid: 56ccb219-11b2-4e43-9f07-5a76e3cd8da8
ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 12/08/2017
ms.author: iainfou
---

# Azure Active Directory (AD) Domain Services for Azure Cloud Solution Providers (CSP)
This article explains how you can use Azure AD Domain Services in an Azure CSP subscription.

## Overview of Azure CSP
Azure CSP is a program for Microsoft Partners and provides a license channel for various Microsoft cloud services. Azure CSP enables partners to manage sales, own the billing relationship, provide technical and billing support, and be the customer's single point of contact. In addition, Azure CSP provides a full set of tools, including a self-service portal and accompanying APIs. These tools enable CSP partners to easily provision and manage Azure resources, and provide billing for customers and their subscriptions.

The [Partner Center portal](https://docs.microsoft.com/azure/cloud-solution-provider/overview/partner-center-overview) acts as an entry point for all Azure CSP partners. It provides rich customer management capabilities, automated processing, and more. Azure CSP partners can use Partner Center capabilities by using a web-based UI or by using PowerShell and various API calls.

The following diagram illustrates how the CSP model works at a high level. Contoso has an Azure AD Active Directory. They have a partnership with a CSP, who deploys and manages resources in their Azure CSP subscription. Contoso may also have regular (direct) Azure subscriptions, which are billed directly to Contoso.

![Overview of the CSP model](./media/csp/csp_model_overview.png)

The CSP partner's tenant has three special agent groups - Admin agents, Helpdesk agents, and Sales agents. The Admin agents group is assigned to the tenant administrator role  in Contoso's Azure AD directory. As a result, a user belonging to the CSP partner's admin agents group has tenant admin privileges in Contoso's Azure AD directory. When the CSP partner provisions an Azure CSP subscription for Contoso, their admin agents group is assigned to the owner role for that subscription. As a result, the CSP partner's admin agents have the required privileges to provision Azure resources such as virtual machines, virtual networks, and Azure AD Domain Services on behalf of Contoso.

For more information, see the [Azure CSP overview](https://docs.microsoft.com/azure/cloud-solution-provider/overview/azure-csp-overview)

## Benefits of using Azure AD Domain Services in an Azure CSP subscription
Azure AD Domain Services provides Windows Server AD compatible services in Azure such as LDAP, Kerberos/NTLM authentication, domain join, group policy, and DNS. Over the decades, many applications have been built to work against AD using these capabilities. Many independent software vendors (ISVs) have built and deployed applications at their customers' premises. These applications are onerous to support since that often requires access to the different environments in which these applications are deployed. With Azure CSP subscriptions, you have a simpler alternative with the scale and flexibility of Azure.

Azure AD Domain Services now supports Azure CSP subscriptions. You can now deploy your application in an Azure CSP subscription tied to your customer's Azure AD directory. As a result, your employees (support staff) can manage, administer, and service the virtual machines on which your application is deployed using your organization's corporate credentials. Further, you can provision an Azure AD Domain Services managed domain for your customer's Azure AD directory. Your application is connected to your customer's managed domain. Therefore, capabilities within your application that rely on Kerberos/NTLM, LDAP, or the [System.DirectoryServices API](/dotnet/api/system.directoryservices) work seamlessly against your customer's directory. Your end customers benefit greatly from consuming your application as a service, without needing to worry about maintaining the infrastructure the application is deployed on.

All billing for Azure resources you consume in that subscription, including Azure AD Domain Services, is charged back to you. You maintain full control over the relationship with the customer when it comes to sales, billing, technical support etc. With the flexibility of the Azure CSP platform, a small team of support agents can service many such customers who have instances of your application deployed.


## CSP deployment models for Azure AD Domain services
There are two ways in which you can use Azure AD Domain Services with an Azure CSP subscription. Pick the right one based on the security and simplicity considerations your customers have.

### Direct deployment model
In this deployment model, Azure AD Domain Services is enabled within a virtual network belonging to the Azure CSP subscription. The CSP partner's admin agents have the following privileges:
* Global administrator privileges in the customer's Azure AD directory.
* Subscription owner privileges on the Azure CSP subscription.

![Direct deployment model](./media/csp/csp_direct_deployment_model.png)

In this deployment model, the CSP provider's admin agents can administer identities for the customer. These admin agents have the ability to provision new users, groups, add applications within the customer's Azure AD directory etc. This deployment model may be suited for smaller organizations that do not have a dedicated identity administrator or prefer for the CSP partner to administer identities on their behalf.


### Peered deployment model
In this deployment model, Azure AD Domain Services is enabled within a virtual network belonging to the customer - that is, a direct Azure subscription paid for by the customer. The CSP partner can then deploy applications within a virtual network belonging to the customer's CSP subscription. The virtual networks can then be connected using Azure virtual network peering. As a result, the workloads/applications deployed by the CSP partner in the Azure CSP subscription can connect to the customer's managed domain provisioned in the customer's direct Azure subscription.

![Peered deployment model](./media/csp/csp_peered_deployment_model.png)

This deployment model provides a separation of privileges and enables the CSP partner's helpdesk agents to administer the Azure subscription and deploy and manage resources within it. However, the CSP partner's helpdesk agents do not need to have global administrator privileges on the customer's Azure AD directory. The customer's identity administrators can continue to manage identities for their organization.

This deployment model may be suited to scenarios where an ISV (independent software vendor) provides a hosted version of their on-premises application, which also needs to connect to the customer's AD.


## Administering Azure AD Domain Services managed domains in CSP subscriptions
The following important considerations apply when administering a managed domain in an Azure CSP subscription:

* **CSP admin agents can provision a managed domain using their credentials:** Azure AD Domain Services supports Azure CSP subscriptions. Therefore, users belonging to a CSP partner's admin agents group can provision a new Azure AD Domain Services managed domain.

* **CSPs can script creation of new managed domains for their customers using PowerShell:** See [how to enable Azure AD Domain Services using PowerShell](powershell-create-instance.md) for details.

* **CSP admin agents cannot perform ongoing management tasks on the managed domain using their credentials:** CSP admin users cannot perform routine management tasks within the managed domain using their credentials. These users are external to the customer's Azure AD directory and their credentials are not available within the customer's Azure AD directory. Therefore, Azure AD Domain Services does not have access to the Kerberos and NTLM password hashes for these users. As a result, such users cannot be authenticated on Azure AD Domain Services managed domains.

  > [!WARNING]
  > **You must create a user account within the customer's directory to perform ongoing administration tasks on the managed domain.**
  > You cannot sign in to the managed domain using a CSP admin user's credentials. Use the credentials of a user account belonging to the customer's Azure AD directory to do so. You need these credentials for tasks such as joining virtual machines to the managed domain, administering DNS, administering Group Policy etc.
  >

* **The user account created for ongoing administration must be added to the 'AAD DC Administrators' group:** The 'AAD DC Administrators' group has privileges to perform certain delegated administration tasks on the managed domain. These tasks include configuring DNS, creating organizational units, administering group policy etc. For a CSP partner to perform such tasks on a managed domain, a user account needs to be created within the customer's Azure AD directory. The credentials for this account must be shared with the CSP partner's admin agents. Also, this user account must be added to the 'AAD DC Administrators' group to enable configuration tasks on the managed domain to be performed using this user account.


## Next steps
* [Enroll in the Azure CSP program](https://docs.microsoft.com/partner-center/enrolling-in-the-csp-program) and start creating business through Azure CSP.
* Review the list of [Azure services available in Azure CSP](https://docs.microsoft.com/azure/cloud-solution-provider/overview/azure-csp-available-services).
* [Enable Azure AD Domain Services using PowerShell](powershell-create-instance.md)
* [Get started with Azure AD Domain Services](create-instance.md)
