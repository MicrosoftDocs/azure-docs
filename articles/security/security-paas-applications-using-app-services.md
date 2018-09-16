---
title: Securing PaaS web and mobile applications using Azure App Service | Microsoft Docs
description: " Learn about Azure App Service security best practices for securing your PaaS web and mobile applications. "
services: security
documentationcenter: na
author: techlake
manager: MBaldwin
editor: ''

ms.assetid:
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/21/2017
ms.author: terrylan

---
# Securing PaaS web and mobile applications using Azure App Service

In this article, we discuss a collection of [Azure App Service](https://azure.microsoft.com/services/app-service/) security best practices for securing your PaaS web and mobile applications. These best practices are derived from our experience with Azure and the experiences of customers like yourself.

## Azure App Service
[Azure App Service](../app-service/app-service-web-overview.md) is a PaaS offering that lets you create web and mobile apps for any platform or device and connect to data anywhere, in the cloud or on-premises. App Service includes the web and mobile capabilities that were previously delivered separately as Azure Websites and Azure Mobile Services. It also includes new capabilities for automating business processes and hosting cloud APIs. As a single integrated service, App Service brings a rich set of capabilities to web, mobile, and integration scenarios.

## Best practices

When using App Service, follow these best practices:

- [Authenticate through Azure Active Directory (AD)](../app-service/app-service-authentication-overview.md). App Service provides an OAuth 2.0 service for your identity provider. OAuth 2.0 focuses on client developer simplicity while providing specific authorization flows for Web applications, desktop applications, and mobile phones. Azure AD uses OAuth 2.0 to enable you to authorize access to mobile and web applications.
- Restrict access based on the need to know and least privilege security principles. Restricting access is imperative for organizations that want to enforce security policies for data access. Role-Based Access Control (RBAC) can be used to assign permissions to users, groups, and applications at a certain scope. To learn more about granting users access to applications, see [get started with access management](../role-based-access-control/overview.md).
- Protect your keys. It doesn't matter how good your security is if you lose your subscription keys. Azure Key Vault helps safeguard cryptographic keys and secrets used by cloud applications and services. By using Key Vault, you can encrypt keys and secrets (such as authentication keys, storage account keys, data encryption keys, .PFX files, and passwords) by using keys that are protected by hardware security modules (HSMs). For added assurance, you can import or generate keys in HSMs. See [Azure Key Vault](../key-vault/key-vault-whatis.md) to learn more. You can also use Key Vault to manage your TLS certificates with auto-renewal.
- Restrict incoming source IP addresses. [App Service Environment](../app-service/environment/intro.md) has a virtual network integration feature that helps you restrict incoming source IP addresses through network security groups (NSGs). If you are unfamiliar with Azure Virtual Networks (VNETs), this is a capability that allows you to place many of your Azure resources in a non-internet, routable network that you control access to. To learn more, see [Integrate your app with an Azure Virtual Network](../app-service/web-sites-integrate-with-vnet.md).

## Next steps
This article introduced you to a collection of App Service security best practices for securing your PaaS web and mobile applications. To learn more about securing your PaaS deployments, see:

- [Securing PaaS deployments](security-paas-deployments.md)
- [Securing PaaS web and mobile applications using Azure SQL Database and SQL Data Warehouse](security-paas-applications-using-sql.md)
