---
title: Security controls
description: Find a checklist of security controls for evaluating Azure App Service for your organization.
author: msmbaldwin

ms.topic: conceptual
ms.date: 09/04/2019
ms.author: mbaldwin

---
# Security controls for Azure App Service

This article documents the security controls built into Azure App Service.

[!INCLUDE [Security controls header](../../includes/security-controls-header.md)]

## Network

| Security control | Yes/No | Notes | Documentation
|---|---|--|
| Service endpoint support| Yes | Available for App Service.| [Azure App Service Access Restrictions](app-service-ip-restrictions.md)
| VNet injection support| Yes | App Service Environments are private implementations of App Service dedicated to a single customer injected into a customer's virtual network. | [Introduction to the App Service Environments](environment/intro.md)
| Network Isolation and Firewalling support| Yes | For the public multi-tenant variation of App Service, customers can configure network ACLs (IP Restrictions) to lock down allowed inbound traffic.  App Service Environments are deployed directly into virtual networks and hence can be secured with NSGs. | [Azure App Service Access Restrictions](app-service-ip-restrictions.md)
| Forced tunneling support| Yes | App Service Environments can be deployed into a customer's virtual network where forced tunneling is configured. | [Configure your App Service Environment with forced tunneling](environment/forced-tunnel-support.md)

## Monitoring & logging

| Security control | Yes/No | Notes | Documentation
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | App Service integrates with Application Insights for languages that support Application Insights (Full .NET Framework, .NET Core, Java and Node.JS).  See [Monitor Azure App Service performance](../azure-monitor/app/azure-web-apps.md). App Service also sends application metrics into Azure Monitor. | [Monitor apps in Azure App Service](web-sites-monitor.md)
| Control and management plane logging and audit| Yes | All management operations performed on App Service objects occur via [Azure Resource Manager](../azure-resource-manager/index.yml). Historical logs of these operations are available both in the portal and via the CLI. | [Azure Resource Manager resource provider operations](../role-based-access-control/resource-provider-operations.md#microsoftweb), [az monitor activity-log](/cli/azure/monitor/activity-log)
| Data plane logging and audit | No | The data plane for App Service is a remote file share containing a customer’s deployed web site content.  There is no auditing of the remote file share. |

## Identity

| Security control | Yes/No | Notes |  Documentation
|---|---|--|
| Authentication| Yes | Customers can build applications on App Service that automatically integrate with [Azure Active Directory (Azure AD)](../active-directory/index.yml) as well as other OAuth compatible identity providers For management access to App Service assets, all access is controlled by a combination of Azure AD authenticated principal and Azure Resource Manager RBAC roles. | [Authentication and authorization in Azure App Service](overview-authentication-authorization.md)
| Authorization| Yes | For management access to App Service assets, all access is controlled by a combination of Azure AD authenticated principal and Azure Resource Manager RBAC roles.  | [Authentication and authorization in Azure App Service](overview-authentication-authorization.md)

## Data protection

| Security control | Yes/No | Notes | Documentation
|---|---|--|
| Server-side encryption at rest: Microsoft-managed keys | Yes | Web site file content is stored in Azure Storage, which automatically encrypts the content at rest. <br><br>Customer supplied secrets are encrypted at rest. The secrets are encrypted at rest while stored in App Service configuration databases.<br><br>Locally attached disks can optionally be used as temporary storage by websites (D:\local and %TMP%). Locally attached disks are not encrypted at rest. | [Azure Storage encryption for data at rest](../storage/common/storage-service-encryption.md)
| Server-side encryption at rest: customer-managed keys (BYOK) | Yes | Customers can choose to store application secrets in Key Vault and retrieve them at runtime. | [Use Key Vault references for App Service and Azure Functions (preview)](app-service-key-vault-references.md)
| Column level encryption (Azure Data Services)| N/A | |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption )| Yes | Customers can configure web sites to require and use HTTPS for inbound traffic.  | [How to make an Azure App Service HTTPS only](https://blogs.msdn.microsoft.com/benjaminperkins/2017/11/30/how-to-make-an-azure-app-service-https-only/) (blog post)
| API calls encrypted| Yes | Management calls to configure App Service occur via [Azure Resource Manager](../azure-resource-manager/index.yml) calls over HTTPS. |

## Configuration management

| Security control | Yes/No | Notes | Documentation
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes | For management operations, the state of an App Service configuration can be exported as an Azure Resource Manager template and versioned over time. For runtime operations, customers can maintain multiple different live versions of an application using the App Service deployment slots feature. | 

## Next steps

- Learn more about the [built-in security controls across Azure services](../security/fundamentals/security-controls.md).
