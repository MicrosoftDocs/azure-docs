---
title: Securing PaaS web and mobile applications using Azure App Services | Microsoft Docs
description: " Learn about Azure App Services security best practices for securing your PaaS web and mobile applications. "
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
ms.date: 03/21/2017
ms.author: terrylan

---
# Securing PaaS web and mobile applications using Azure App Services

In this article, we discuss a collection of [Azure App Services](https://azure.microsoft.com/services/app-service/) security best practices for securing your PaaS web and mobile applications. These best practices are derived from our experience with Azure and the experiences of customers like yourself.

## Azure App Services
[Azure App Services](../app-service/app-service-value-prop-what-is.md) is a PaaS offering that lets you create web and mobile apps for any platform or device and connect to data anywhere, in the cloud or on-premises. App Services includes the web and mobile capabilities that were previously delivered separately as Azure Websites and Azure Mobile Services. It also includes new capabilities for automating business processes and hosting cloud APIs. As a single integrated service, App Services brings a rich set of capabilities to web, mobile, and integration scenarios.

To learn more, see overviews on [Mobile Apps](../app-service-mobile/app-service-mobile-value-prop.md) and [Web Apps](../app-service-web/app-service-web-overview.md).

## Best practices

When using App Services, follow these best practices:

- [Authenticate through Azure Active Directory (AD)](../app-service-web/web-sites-authentication-authorization.md#authenticate-through-azure-active-directory). App Services provides an OAuth 2.0 service for your identity provider. OAuth 2.0 focuses on client developer simplicity while providing specific authorization flows for Web applications, desktop applications, and mobile phones. Azure AD uses OAuth 2.0 to enable you to authorize access to mobile and web applications.
- Restrict access based on the need to know and least privilege security principles. Restricting access is imperative for organizations that want to enforce security policies for data access. Role-Based Access Control (RBAC) can be used to assign permissions to users, groups, and applications at a certain scope. See [get started with access management](../active-directory/role-based-access-control-what-is.md), to learn more about granting users access to applications.
- Protect your keys. It won’t matter how good your security is if you lose your subscription keys. Azure Key Vault helps safeguard cryptographic keys and secrets used by cloud applications and services. By using Key Vault, you can encrypt keys and secrets (such as authentication keys, storage account keys, data encryption keys, .PFX files, and passwords) by using keys that are protected by hardware security modules (HSMs). For added assurance, you can import or generate keys in HSMs. See [Azure Key Vault](../key-vault/key-vault-whatis.md) to learn more. You can also use Key Vault to manage your TLS certificates with auto-renewal.
- Restrict incoming source IP addresses. App Services has a virtual network integration feature that helps you restrict incoming source IP addresses through network security groups (NSGs). If you are unfamiliar with Azure Virtual Networks (VNETs), this is a capability that allows you to place many of your Azure resources in a non-internet, routable network that you control access to. See [Integrate your app with an Azure Virtual Network](../app-service-web/web-sites-integrate-with-vnet.md) to learn more.

## Next steps
This article introduced you to a collection of App Services security best practices for securing your PaaS web and mobile applications. To learn more about securing your PaaS deployments, see:

- [Securing PaaS deployments](security-paas-deployments.md)
- [Securing PaaS web and mobile applications using Azure SQL Database and SQL Data Warehouse](security-paas-applications-using-sql.md)
