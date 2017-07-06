---
title: 'Resolve mismatched directory errors for existing Azure AD Domain Services managed domains | Microsoft Docs'
description: Understand and resolve mismatched directory errors for existing Azure AD Domain Services managed domains
services: active-directory-ds
documentationcenter: ''
author: mahesh-unnikrishnan
manager: stevenpo
editor: curtand

ms.assetid: 40eb75b7-827e-4d30-af6c-ca3c2af915c7
ms.service: active-directory-ds
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic:
ms.date: 07/06/2017
ms.author: maheshu

---
# Resolve mismatched directory errors for existing Azure AD Domain Services managed domains
You have an existing managed domain that was enabled using the Azure classic portal. When you navigate to the new Azure portal and view the managed domain, you see the following error message.

![Mismatched directory error](.\media\getting-started\mismatched-tenant-error.png)

You cannot administer this managed domain until the error is resolved.


## What's causing this error?
This error is caused when your managed domain and the virtual network it is enabled in belong to two different Azure AD tenants. For example, you have a managed domain called 'contoso.com' and it was enabled for Contoso's Azure AD tenant. However, the Azure virtual network in which the managed domain was enabled belongs to Fabrikam - a different Azure AD tenant.

The new Azure portal (and specifically the Azure AD Domain Services extension) is built on Azure Resource Manager. In the modern Azure Resource Manager environment, certain restrictions are enforced to deliver greater security and for roles based access control (RBAC) to resources. Enabling Azure AD Domain Services for an Azure AD tenant is a sensitive operation since it causes credential hashes to be synchronized to the managed domain. This operation requires you to be a tenant admin for the directory and have administrative privileges over the virtual network in which you enable the managed domain. For these RBAC checks to work consistently, the managed domain and the virtual network should belong to the same Azure AD tenant.

In short, you cannot enable a managed domain for an Azure AD tenant 'contoso.com' to show up in a virtual network belonging to an Azure subscription owned by another Azure AD tenant 'fabrikam.com'. The Azure classic portal did not enforce such restrictions as it wasn't built on top of the resource manager platform.

**Valid configuration**: In this deployment scenario, the Contoso managed domain is enabled for the Contoso Azure AD tenant. The managed domain is exposed in a virtual network belonging to an Azure subscription owned by the Contoso Azure AD tenant. Therefore, both the managed domain as well as the virtual network belong to the same Azure AD tenant. This is a valid and fully supported configuration.

![Valid tenant configuration](./media/getting-started/valid-tenant-config.png)

**Mismatched tenant configuration**: In this deployment scenario, the Contoso managed domain is enabled for the Contoso Azure AD tenant. However, the managed domain is exposed in a virtual network that belongs to an Azure subscription owned by the Fabrikam Azure AD tenant. Therefore, the managed domain and the virtual network belong to two different Azure AD tenants. This is a mismatched tenant configuration and is not supported. The virtual network must be moved to the same Azure AD tenant (i.e. Contoso) as the managed domain. See the [Resolution](#resolution) section for details.

![Mismatched tenant configuration](./media/getting-started/mismatched-tenant-config.png)

Therefore, in scenarios where the managed domain and the virtual network it is enabled in belong to two different Azure AD tenants you see this error.

The following rules apply in the resource manager environment:
- An Azure AD directory may have multiple Azure subscriptions.
- An Azure subscription may have multiple resources such as virtual networks.
- A single Azure AD Domain Services managed domain is enabled for an Azure AD directory.
- An Azure AD Domain Services managed domain can be enabled on a virtual network belonging to any of the Azure subscriptions within the same Azure AD tenant.


## Resolution
You have two options to resolve the mismatched directory error. You may:

- Click the **Delete** button to delete the existing managed domain. Re-create using the [Azure portal](https://portal.azure.com), so that the managed domain and virtual network it is available in belong to the Azure AD directory. All machines previously joined to the deleted domain need to be domain-joined afresh to the newly created managed domain.

- Contact Azure support to move the Azure subscription containing the virtual network to the Azure AD directory, to which your managed domain belongs. To do this, click **New support request** and specify **mismatched directory** in the **Details** section of the support request. Include the information provided in the error message as part of the support request.
