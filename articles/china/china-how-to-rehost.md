---
title: Rehost and migrate an application to Azure China 21Vianet | Microsoft Docs
description: If your application or workload is deployed to global Azure, you can rehost it on Azure China 21Vianet, but changes may be needed. This page discusses how to adapt Azure Active Directory, Azure Traffic Manager, Azure Notification Hubs, and Azure Key Vault.
services: china
cloud: na
documentationcenter: na
author: v-wimarc
manager: edprice

ms.assetid: na
ms.service: china
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/13/2017
ms.author: v-wimarc

---
# Rehost and migrate an application to Azure
If your application or workload is deployed to global Azure, you can rehost it on Microsoft Azure operated by 21Vianet (Azure China 21Vianet), but some design changes may be needed. This page discusses how to adapt Azure Active Directory, Azure Traffic Manager, Azure Notification Hubs, and Azure Key Vault when rehosting.

## Azure Active Directory services
Microsoft Azure China 21Vianet includes [Azure Active Directory](https://azure.microsoft.com/documentation/articles/active-directory-whatis/) (AD) as a dedicated service exclusively for users accessing applications within this environment. Azure AD identities cannot be synchronized between global Azure and Azure China 21Vianet. 

Currently, Azure AD Premium, Azure AD B2C, and Azure AD Domain Services are not supported. If your application uses any of these services, you must find an alternative solution. 

The following tables summarize the Azure AD features available on Azure. 

### Basic edition:

|**Feature**  |**Global Azure**  |**Azure China 21Vianet**  |
|---------|---------|---------|
|Directory objects     |    X     |     X    |
|Single sign-on (SSO)     |    X     |    X     |
|Self-service password change for cloud users     |    X     |     X    |
|Connect (sync engine that extends on-premises directories to Azure AD)     |     X    |    X     |
|Security and usage reports     |     X    |         |
|

### Premium and Basic edition:

|**Feature**  |**Global Azure**  |**Azure China 21Vianet**  |
|---------|---------|---------|
|Group-based access management and provisioning     |     X    |         |
|Self-service password change for cloud users     |     X   |         |
|Company branding (logon pages, access panel customization)     |     X    |         |
|Application proxy     |     X    |         |
|SLA     |     X    |         |
|


### Premium edition:


|**Feature**  |**Global Azure**  |**Azure China 21Vianet**   |
|---------|---------|---------|
|Self-service group and app management, self-service application additions, dynamic groups     |    X     |         |
|Self-service password reset, change, or unlock with on-premises writeback     |     X    |         |
|Multi-factor authentication, cloud and on-premises (MFA server)     |    X     |    Only for Azure portal     |
|Microsoft Identity Manager user CAL*     |    X     |         |
|Cloud app discovery     |     X    |         |
|Connect health     |     X    |         |
|Automatic password rollover for group accounts     |    X     |         |
|

### Azure AD B2C and social identity provider
If your application uses Azure AD B2C, you must find an alternative. AD B2C is a global Azure service that offers a social identity provider for integration with popular social networks—such as Facebook, Google+, LinkedIn, and Amazon—but these social networks are blocked in China. You must tailor your social marketing strategy specifically to WeChat, Sina Weibo, or other approved social networks.

Although Microsoft Azure China 21Vianet does not support a social identity provider at this time, the China Customer Advisory Team (CAT) has been working on many Azure solutions for integration with WeChat. For development guidance, please contact your Microsoft account representatives.

### Set up Azure Traffic Manager
In Microsoft Azure China 21Vianet, application [endpoints](https://www.azure.cn/documentation/articles/traffic-manager-endpoint-types/) (in Chinese) managed by Azure Traffic Manager must be hosted within China, in either the China East or China North datacenter.

Traffic Manager uses DNS to direct users to particular service endpoints based on the chosen traffic-routing method and the health of the current endpoints. Traffic Manager supports endpoints for Azure virtual machines, Azure Web Apps, and other Azure services, in addition to external endpoints not hosted on Azure. For details, see the [endpoint documentation](https://www.azure.cn/documentation/articles/traffic-manager-endpoint-types/) (in Chinese, or see the [English translation](https://translate.google.com.hk/translate?hl=zh-CN&sl=zh-CN&tl=en&u=https%3A%2F%2Fwww.azure.cn%2Fdocumentation%2Farticles%2Ftraffic-manager-endpoint-types%2F)).

When rehosting a global Azure application, you can support users who travel outside China by setting up Traffic Manager on global Azure, then route traffic to a site hosted on Azure China 21Vianet. Make sure to synchronize user data. Traffic Manager is configured with the [performance traffic-routing method](https://docs.microsoft.com/azure/traffic-manager/traffic-manager-routing-methods#performance). An app’s responsiveness improves when Traffic Manager routes users to the closest location as measured by the lowest network latency.

### Set up push notifications
When rehosting an application that uses push notifications, note that Azure Notification Hubs use a different platform notification service (PNS) in China. For Android devices, Notification Hubs use the Baidu Push PNS for notifications sent to mobile devices in China.

By comparison, global Azure [Notification Hubs](https://azure.microsoft.com/documentation/articles/notification-hubs-push-notification-overview/) work with APNS (Apple Push Notification Services), GCM (Google Cloud Message), WNS (Windows Push Notification Services), and MPNS (Microsoft Push Notification Service).

The design of your application’s push notifications should take into account whether the users of your service travel outside China. Users within China retain excellent access to applications hosted in Azure and can receive notifications through Azure Notification Hubs. However, to improve performance for users who travel outside China when accessing your application, consider adding a dynamic routing solution. For example, you can use the [performance traffic-routing method](https://docs.microsoft.com/azure/traffic-manager/traffic-manager-routing-methods#performance) to reroute users to an application instance hosted on global Azure instead.

### Design secure key management
Secure key management is essential to protecting data on the cloud. You can use Azure Key Vault to help safeguard cryptographic keys and secrets used by your cloud applications and services hosted on Microsoft Azure China 21Vianet. However, you cannot import or generate hardware security modules (HSMs), an added feature available in global Azure.

[Azure Key Vault](https://azure.microsoft.com/documentation/articles/key-vault-whatis/) encrypts keys and secrets, such as authentication keys, storage account keys, data encryption keys, .PFX files, and passwords. Key Vault streamlines the key management process and enables you to maintain control of keys that access and encrypt your data.

## Use the Global Connection Toolkit
The [Azure Global Connection Toolkit](https://github.com/Azure/AzureGlobalConnectionToolkit) helps ease application migration between national clouds and is available on [GitHub](https://github.com/Azure/AzureGlobalConnectionToolkit).

The Global Connection Toolkit offers two components:
- **Assessment Tool:** Generates a report so you can assess an existing global Azure subscription and get help with migration planning tasks. The report answers questions about migrating Azure Services between different Azure cloud environments, comparing services, estimating costs, and listing important considerations.
- **CI/CD (Continuous Integration and Continuous Delivery) Tool:** Validates and performs a migration. For example, use the CI/CD tool to migrate virtual machines from Azure’s East Asia region to the China East region. The toolkit syncs your metadata and configuration between the source and the destination subscriptions, ensuring they match the original after the migration. As an open source tool, it can be freely customized or integrated into an existing DevOps process. Choose from a PowerShell version and a cross-platform NodeJS version that support Mac, Linux, and Windows.

[Get the toolkit](https://github.com/Azure/AzureGlobalConnectionToolkit).

## Migrate Azure classic virtual machines
If you have classic Azure Service Manager IaaS resources, it is highly recommended that you first [migrate them to Azure Resource Manager](https://azure.microsoft.com/documentation/articles/virtual-machines-windows-migration-classic-resource-manager/) before moving them to Microsoft Azure China 21Vianet. 

Several tools are available for you to use in migrating IaaS resources or virtual machines from classic Azure to Azure Resource Manager, which launched publicly in early 2016. For example: 
- [General availability of IaaS migration from classic to resource manager](https://azure.microsoft.com/blog/iaas-migration-ga/)
- [Migrate IaaS resources from classic to Azure Resource Manager by using Azure PowerShell](https://azure.microsoft.com/documentation/articles/virtual-machines-windows-ps-migration-classic-resource-manager/)

## Next steps
- [Azure Active Directory](https://azure.microsoft.com/documentation/articles/active-directory-whatis/)
- [Endpoint documentation](https://www.azure.cn/documentation/articles/traffic-manager-endpoint-types/) (in Chinese)
- [Notification Hubs](https://azure.microsoft.com/documentation/articles/notification-hubs-push-notification-overview/)
- [Azure Key Vault](https://azure.microsoft.com/documentation/articles/key-vault-whatis/)
- [Global Connection Toolkit](https://github.com/Azure/AzureGlobalConnectionToolkit)
- [Migrate to Azure Resource Manager](https://azure.microsoft.com/documentation/articles/virtual-machines-windows-migration-classic-resource-manager/)

