---
title: Recover from catastrophic data loss in Azure Stack using the Infrastructure Backup Service | Microsoft Docs
description: When a catastrophic failure causes Azure Stack to fail, your can restore your infrastructure data when reestablishing your Azure Stack deployment.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila
editor: ''

ms.assetid: 2ECE8580-0BDE-4D4A-9120-1F6771F2E815
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 12/15/2017
ms.author: mabrigg

---
# Recover from catastrophic data loss

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

Azure Stack runs Azure services in your datacenter. Azure Stack can run on environments as small as four nodes installed in a single rack. In contrast, Azure runs in more than 40 regions in multiple datacenters and multiple zones in each region. User resources can span multiple servers, racks, datacenters, and regions. With Azure Stack, you only have the choice to deploy your entire cloud to a single rack. This exposes your cloud to the risk of catastrophic events at your datacenter or failures due to major product bugs. When a disaster strikes, the Azure Stack instance goes offline. All of the data is potentially unrecoverable.

Depending on the root cause of the data loss, you may need to repair a single infrastructure service or restore the entire Azure Stack instance. You may even need to restore to different hardware in the same location or in a different location.

| Scenario                                                           | Data Loss                            | Considerations                                                             |
|--------------------------------------------------------------------|--------------------------------------|----------------------------------------------------------------------------|
| Recover from catastrophic data loss due to disaster or product bug | All infrastructure and user and app data | User application and data are protected separately from infrastructure data |

## Workflows

The journey of protecting Azure Start starts with backing up the infrastructure and app/tenant data separately. This document covers how to protect the infrastructure. 

![Initial deployment of Azure Stack](media\azure-stack-backup\azure-stack-backup-workflow1.png)

In worst case scenarios where all data is lost, recovering Azure Stack is the process of restoring the infrastructure data unique to that deployment of Azure Stack and all user data. 

![Redeploy Azure Stack](media\azure-stack-backup\azure-stack-backup-workflow2.png)

## Data in backups

Azure Stack supports a type of deployment called cloud recovery mode. This mode is used only if you choose to recover Azure Stack after a disaster or product bug rendered the solution unrecoverable. This deployment mode does not recover any of the user data stored in the solution. The scope of this deployment mode is limited to restoring the following data:

 - Deployment inputs
 - Internal identity systems
 - Federated identify configuration (disconnected deployments)
 - Root certificates used by internal certificate authority
 - Azure Resource Manager configuration user data, such as subscriptions, plans, offers, and quotas for storage, network, and compute resources
 - KeyVault secrets and vaults
 - RBAC policy assignments and role assignments 

None of the user Infrastructure as a Service (IaaS) or Platform as a Service (PaaS) resources are recovered. That is IaaS VMs, storage accounts, blobs, tables, network configuration, and so on, are lost. The purpose of cloud recovery is to ensure your operators and users can log back into the portal after deployment is complete. Users logging back in will not see any of their resources. Users have their subscriptions restored and along with that the original plans and offers policies defined by the administrator. Users logging back into the system operates under the same constraints imposed by the original solution before the disaster. After cloud recovery completes, the operator can manually restore value-add and third-party RPs and associated data.

## Infrastructure Backup components

Infrastructure Backup includes the following components:

 - **Infrastructure Backup Controller**  
 The Infrastructure Backup Controller is instantiated with and resides in every Azure Stack Cloud.
 - **Backup Resource Provider**  
 The Backup Resource Provider (Backup RP) is composed of the user interface and application program interfaces (API)s exposing basic backup functionality for Azure Stack infrastructure.

### Infrastructure Backup Controller

The Infrastructure Backup Controller is a Service Fabric service gets instantiated for an Azure Stack Cloud. Backup resources are created at a regional level and capture region-specific service data from AD, CA, Azure Resource Manager, CRP, SRP, NRP, KeyVault, RBAC. 

## Backup Resource Provider

The Backup Resource Provider presents user interface in the Azure Stack portal for basic configuration and listing of backup resources. Operator can perform the following operations in the user interface:

 - Enable backup for the first time by providing external storage location, credentials, and encryption key
 - View completed created backup resources and status resources under creation
 - Modify the storage location where Backup Controller places backup data
 - Modify the credentials that Backup Controller uses to access external storage location
 - Modify the encryption key that Backup Controller uses to encrypt backups 

## Next steps

 - Learn about the best practices for [using the Infrastructure Backup Service](azure-stack-backup-best-pracitices.md).
