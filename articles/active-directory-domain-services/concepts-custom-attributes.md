---
title: Create and manage custom attributes for Azure AD Domain Services | Microsoft Docs
description: Learn how to create and manage custom attributes in an Azure AD DS managed domain.
services: active-directory-ds
author: justinha
manager: amycolannino

ms.assetid: 1a14637e-b3d0-4fd9-ba7a-576b8df62ff2
ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: how-to
ms.date: 01/29/2023
ms.author: justinha

---
# Custom attributes for Azure Active Directory Domain Services

For various reasons, companies often can’t modify code for legacy apps. For example, apps may use a custom attribute, such as a custom employee ID, and rely on that attribute for LDAP operations. 

Azure AD supports adding custom data to resources using [extensions](/graph/extensibility-overview). Azure Active Directory Domain Services (Azure AD DS) can synchronize the following types of extensions from Azure AD, so you can also use apps that depend on custom attributes with Azure AD DS:  

- [onPremisesExtensionAttributes](/graph/extensibility-overview?tabs=http#extension-attributes) are a set of 15 attributes that can store extended user string attributes. 
- [Directory Extensions](/graph/extensibility-overview?tabs=http#directory-azure-ad-extensions) allow the schema extension of specific directory objects, such as users and groups, with strongly-typed attributes through registration with an application in the tenant. 

Both types of extensions can be configured By using Azure AD Connect for users who are managed on-premises, or MSGraph APIs for cloud-only users. 

>[!Note] 
>It is not supported to synchronize the following types of extensions:  
>- Custom Security Attributes in Azure AD (Preview)
>- MSGraph Schema Extensions
>- Open Extensions


