---
title:  SAP Information Lifecycle Management with Microsoft Azure Blob Storage | Microsoft Docs
description: SAP Information Lifecycle Management with Microsoft Azure Blob Storage
services: virtual-machines-linux,virtual-machines-windows
documentationcenter: ''
author: MSSedusch
manager: timlt
editor: ''
tags: azure-resource-manager
keywords: ''
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 01/28/2022
ms.author: sedusch
ms.custom: subject-rbac-steps

---
# SAP Information Lifecycle Management (ILM) with Microsoft Azure Blob Storage

SAP Information Lifecycle Management (ILM) provides a broad range of capabilities for managing data
volumes, Retention Management as well as the decommissioning of legacy systems, while balancing the
total cost of ownership, risk, and legal compliance. SAP ILM Store (a component of ILM) would enable
storing of these archive files and attachments from SAP system into Microsoft Azure Blob storage, thus
enabling cloud storage.

![Fig: Azure Blob Storage with ILM Store](media/sap-information-lifecycle-management/ilm-azure.png)

## How to

This document covers creation and configuration of Azure blob storage account to be used with SAP
ILM. This account will be used to store archive data from S/4HANA System.

The steps to be followed to create a storage account are:

1. Register a new application with your subscription.
2. Create a Blob storage account.
3. Create a new custom role or use an existing (build-In or custom) role.
4. Assign the role to application to allow access to the storage account.

> [!NOTE]
> Steps 2, 3 and 4 can either be done manually or by using the Microsoft Quickstart template.

### QuickStart template approach:

This is an automated approach to create the Azure account. You can find the template in the [Azure Quickstart Templates library](https://azure.microsoft.com/resources/templates/sap-ilm-store/).

### Manual configuration approach:
Azure blob storage account can be configured manually.
The steps to be followed are:

1. Register a new application  
The details are available at [Register an application with the Microsoft identity platform](../../active-directory/develop/quickstart-register-app.md)

   > [!NOTE]
   > Make sure that Client secret is added as per the section Add Credentials – Add a Client Secret

1. Create a Blob Storage account  
Refer steps in the page [Create a storage account](../../storage/common/storage-account-create.md?tabs=azure-portal)  
Ensure "Enable secure transfer" is set.  
It is recommended to set the following property values:  
   * Enable blob public access = false  
   * Minimum TLS Version = 1.2  
   * Enable storage account key access = false  
1. Maintain IAM for the account  
In the Access Control (IAM) setting, go to "Role Assignments" and add "Role assignment" for
the App created with the role of "Storage Blob Data Contributor". In the App dialog, choose
"User, group or Service Principal" for "Assign Access to" field.

   > [!NOTE]
   > Ensure no other user has access to this storage account apart from the registered application.

During the process of the account setup and configuration, it is recommended to refer to [Security recommendations for Blob Storage](../../storage/blobs/security-recommendations.md)
With the completion of this setup, we are ready to use this blob storage account with SAP ILM
to store archive files from S/4 HANA System.

## Next steps

* [SAP ILM on the SAP help portal](https://help.sap.com/doc/c3b6eda797634474b7a3aac5a48e84d5/1610%20001/en-US/frameset.htm)