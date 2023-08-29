---
title: Securing PaaS web & mobile applications
titleSuffix: Azure App Service
description: "Learn about Azure App Service security best practices for securing your PaaS web and mobile applications. "
services: security
documentationcenter: na
author: terrylanfear
manager: rkarlin

ms.assetid:
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/29/2023
ms.author: terrylan

---
# Best practices for securing PaaS web and mobile applications using Azure App Service

In this article, we discuss a collection of [Azure App Service](../../app-service/overview.md) security best practices for securing your PaaS web and mobile applications. These best practices are derived from our experience with Azure and the experiences of customers like yourself.

Azure App Service is a platform-as-a-service (PaaS) offering that lets you create web and mobile apps for any platform or device and connect to data anywhere, in the cloud or on-premises. App Service includes the web and mobile capabilities that were previously delivered separately as Azure Websites and Azure Mobile Services. It also includes new capabilities for automating business processes and hosting cloud APIs. As a single integrated service, App Service brings a rich set of capabilities to web, mobile, and integration scenarios.

## Authenticate through Azure Active Directory (AD)
App Service provides an OAuth 2.0 service for your identity provider. OAuth 2.0 focuses on client developer simplicity while providing specific authorization flows for web applications, desktop applications, and mobile phones. Azure AD uses OAuth 2.0 to enable you to authorize access to mobile and web applications. To learn more, see [Authentication and authorization in Azure App Service](../../app-service/overview-authentication-authorization.md).

## Restrict access based on role
Restricting access is imperative for organizations that want to enforce security policies for data access. You can use Azure role-based access control (Azure RBAC) to assign permissions to users, groups, and applications at a certain scope, such as the need to know and least privilege security principles. To learn more about granting users access to applications, see [What is Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md).

## Protect your keys
It doesn't matter how good your security is if you lose your subscription keys. Azure Key Vault helps safeguard cryptographic keys and secrets used by cloud applications and services. With Key Vault, you can encrypt keys and secrets (such as authentication keys, storage account keys, data encryption keys, .PFX files, and passwords) by using keys that are protected by hardware security modules (HSMs). For added assurance, you can import or generate keys in HSMs. You can also use Key Vault to manage your TLS certificates with auto-renewal. See [What is Azure Key Vault](../../key-vault/general/overview.md) to learn more.

## Restrict incoming source IP addresses
[App Service Environments](../../app-service/environment/intro.md) has a virtual network integration feature that helps you restrict incoming source IP addresses through network security groups (NSGs). If you are unfamiliar with Azure Virtual Networks (VNETs), this is a capability that allows you to place many of your Azure resources in a non-internet, routable network that you control access to. To learn more, see [Integrate your app with an Azure Virtual Network](../../app-service/overview-vnet-integration.md).

For App Service on Windows, you can also restrict IP addresses dynamically by configuring the web.config. For more information, see [Dynamic IP Security](/iis/configuration/system.webServer/security/dynamicIpSecurity/).


## Next steps
This article introduced you to a collection of App Service security best practices for securing your PaaS web and mobile applications. To learn more about securing your PaaS deployments, see:

- [Securing PaaS deployments](paas-deployments.md)
- [Securing PaaS databases in Azure](paas-applications-using-sql.md)