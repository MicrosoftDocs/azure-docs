---
title: Security attributes for Azure App Service
description: A checklist of security attributes for evaluating Azure App Service
services: app-service
documentationcenter: ''
author: msmbaldwin
manager: barbkess
ms.service: app-service

ms.topic: conceptual
ms.date: 05/08/2019
ms.author: mbaldwin

---
# Security attributes for Azure App Service

This article documents the common security attributes built into Azure App Service.

[!INCLUDE [Security attributes header](../../includes/security-attributes-header.md)]

## Preventative

| Security attribute | Yes/No | Notes |
|---|---|--|
| Encryption at rest (such as server-side encryption, server-side encryption with customer-managed keys, and other encryption features) | Yes | Web site file content is stored in Azure Storage, which automatically encrypts the content at rest. See [Azure Storage encryption for data at rest](../storage/common/storage-service-encryption.md).<br><br>Customer supplied secrets are encrypted at rest. The secrets are encrypted at rest while stored in App Service configuration databases.<br><br>Locally attached disks can optionally be used as temporary storage by websites (D:\local and %TMP%). Locally attached disks are not encrypted at rest. |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption )| Yes | Customers can configure web sites to require and use HTTPS for inbound traffic. See the blog post [How to make an Azure App Service HTTPS only](https://blogs.msdn.microsoft.com/benjaminperkins/2017/11/30/how-to-make-an-azure-app-service-https-only/). |
| Encryption key handling (CMK, BYOK, etc.)| Yes | Customers can choose to store application secrets in Key Vault and retrieve them at runtime. See [Use Key Vault references for App Service and Azure Functions (preview)](app-service-key-vault-references.md).|
| Column level encryption (Azure Data Services)| N/A | |
| API calls encrypted| Yes | Management calls to configure App Service occur via [Azure Resource Manager](../azure-resource-manager/index.yml) calls over HTTPS. |

## Network segmentation

| Security attribute | Yes/No | Notes |
|---|---|--|
| Service endpoint support| Yes | Currently available in preview for App Service. See [Azure App Service Access Restrictions](app-service-ip-restrictions.md). |
| VNet injection support| Yes | App Service Environments are private implementations of App Service dedicated to a single customer injected into a customer's virtual network. See [Introduction to the App Service Environments](environment/intro.md). |
| Network Isolation and Firewalling support| Yes | For the public multi-tenant variation of App Service, customers can configure network ACLs (IP Restrictions) to lock down allowed inbound traffic.  See [Azure App Service Access Restrictions](app-service-ip-restrictions.md).  App Service Environments are deployed directly into virtual networks and hence can be secured with NSGs. |
| Forced tunneling support| Yes | App Service Environments can be deployed into a customer's virtual network where forced tunneling is configured. Customers need to follow the directions in [Configure your App Service Environment with forced tunneling](environment/forced-tunnel-support.md). |

## Detection

| Security attribute | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | App Service integrates with Application Insights for languages that support Application Insights (Full .NET Framework, .NET Core, Java and Node.JS).  See [Monitor Azure App Service performance](../azure-monitor/app/azure-web-apps.md). App Service also sends application metrics into Azure Monitor. See [Monitor apps in Azure App Service](web-sites-monitor.md). |

## Identity and access management

| Security attribute | Yes/No | Notes|
|---|---|--|
| Authentication| Yes | Customers can build applications on App Service that automatically integrate with [Azure Active Directory (Azure AD)](../active-directory/index.yml) as well as other OAuth compatible identity providers; see [Authentication and authorization in Azure App Service](overview-authentication-authorization.md). For management access to App Service assets, all access is controlled by a combination of Azure AD authenticated principal and Azure Resource Manager RBAC roles. |
| Authorization| Yes | For management access to App Service assets, all access is controlled by a combination of Azure AD authenticated principal and Azure Resource Manager RBAC roles.  |


## Audit trail

| Security attribute | Yes/No | Notes|
|---|---|--|
| Control and management plane logging and audit| Yes | All management operations performed on App Service objects occur via [Azure Resource Manager](../azure-resource-manager/index.yml). Historical logs of these operations are available both in the portal and via the CLI; see [Azure Resource Manager resource provider operations](../role-based-access-control/resource-provider-operations.md#microsoftweb) and [az monitor activity-log](/cli/azure/monitor/activity-log). |
| Data plane logging and audit | No | The data plane for App Service is a remote file share containing a customer’s deployed web site content.  There is no auditing of the remote file share. |

## Configuration management

| Security attribute | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes | For management operations, the state of an App Service configuration can be exported as an Azure Resource Manager template and versioned over time. For runtime operations, customers can maintain multiple different live versions of an application using the App Service deployment slots feature. | 

