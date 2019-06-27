---
title: Security recommendations for Windows virtual machines in Azure
description: Security recommendations for the virtual machines in Azure. Implementing these recommendations will help you fulfill your security obligations as described in our shared responsibility model and will improve the overall security for your deployments
services: vm-windows
author: barclayn
manager: barbkess

ms.service: vm-service
ms.topic: conceptual
ms.date: 06/27/2019
ms.author: barclayn

---
<!-- We have simplified and limited the number of possible headers to:
- General
    - topics that don't fit into any other category but that are not coming up 
- Identity and access management
    - Authentication, authorization, MFA, RBAC, any other identity management topics
- Data security
    - data in transit, data at rest, TLS, HTTPS, any other topics that discuss protecting data from unauthorized access 
- Networking
    - 
- Monitoring
    - Auditing 
    - Logging 
    - Sentinel

Security center 
- business continuity 
-->

# Security recommendations for Windows Virtual machines in Azure

This article contains security recommendations for virtual machines in Azure. Implementing these recommendations will help you fulfill your security obligations as described in our shared responsibility model and will improve the overall security for your Web App solutions. For more information on what Microsoft does to fulfill service provider responsibilities, read [Azure infrastructure security](../security/azure-security-infrastructure.md).

## General

| Recommendation | Comments |
|-|-|----|
| Stay up-to-date | Use the latest versions of supported platforms, programming languages, protocols, and frameworks. |
| Build VM images using the latest updates | Before you create images ensure that all the latest updates are installed |

## Identity and access management

| Recommendation | Comments |
|-|----|
| Disable anonymous access | Unless you need to support anonymous requests, disable anonymous access. For more information on Azure App Service authentication options, see [Authentication and authorization in Azure App Service](overview-authentication-authorization.md)|
| Require authentication | Whenever possible, use the App Service authentication module rather than write code to handle authentication and authorization.  You can read more about the authentication module in the article titled [Authentication and authorization in Azure App Service](overview-authentication-authorization.md) |
| Protect back-end resources with authenticated access | You can either use the user's identity or use an application identity to authenticate to a back-end resource. When you choose to use an application identity use a [managed identity](overview-managed-identity.md).
| Require client certificate authentication | Client certificate authentication improves security by only allowing connections from clients that can authenticate using certificates that you provide. |

## Data security

| Recommendation | Comments |
|-|-|
| Encrypt VM disks | [Azure Disk Encryption](../../security/azure-security-disk-encryption-overview.md) helps you encrypt your Windows and Linux IaaS virtual machine disks. Encrypting disks make the contents unreadable without the necessary keys. This protects the data from unauthorized access |
| Limit installed software | Limiting installed software to those required to support your 
| Use antivirus/Antimalware | In Azure you can use antimalware software from security vendors such as Microsoft, Symantec, Trend Micro, and Kaspersky. This software helps protect your virtual machines from malicious files, adware, and other threats. Microsoft Antimalware for Azure is a single-agent solution for applications and tenant environments. It's designed to run in the background without human intervention. You can deploy protection based on the needs of your application workloads, with either basic secure-by-default or advanced custom configuration, including antimalware monitoring. For more information on Microsoft Antimalware for Azure see [Microsoft Antimalware for Azure Cloud Services and Virtual Machines](../security/azure-security-antimalware.md) |

## Networking

| Recommendation | Comments |
|-|-|
| Restrict access to management ports | Attackers scan public cloud IP ranges for open management ports and attempt “easy” attacks like common passwords and known unpatched vulnerabilities. [Just-in-time (JIT) virtual machine (VM) access](../security-center/security-center-just-in-time.md) can be used to lock down inbound traffic to your Azure VMs, reducing exposure to attacks while providing easy access to connect to VMs when needed. |
| Limit network access | Network security groups allow you to restrict network access and control the number of exposed endpoints. For more information, see [] |

## Monitoring

| Recommendation | Comments |
|-|-|
|Use Azure Security Center standard tier | [Azure Security Center](../../security-center/security-center-app-services.md) is natively integrated with Azure App Service. It can run assessments and provide security recommendations |

## Business continuity

| Recommendation | Comments |
|-|-|
| Back up your virtual machines | [Azure Backup](../../backup/backup-overview.md) helps protect your application data with minimal operating costs. Application errors can corrupt your data, and human errors can introduce bugs into your applications. With Azure Backup, your virtual machines running Windows and Linux are protected. |
| Adopt a business continuity and disaster recovery (BCDR) strategy | Azure site recovery allows you to choose from different options designed to support your business continuity needs. It supports different replication and fail over scenarios. For more information see  [About Site Recovery](../../site-recovery/site-recovery-overview.md) |
