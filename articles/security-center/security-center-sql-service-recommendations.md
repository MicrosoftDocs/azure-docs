---
title: Protecting Azure SQL service and data in Azure Security Center  | Microsoft Docs
description: This document addresses recommendations in Azure Security Center that help you protect your data and Azure SQL service and stay in compliance with security policies.
services: security-center
documentationcenter: na
author: TerryLanfear
manager: MBaldwin
editor: ''

ms.assetid: bcae6987-05d0-4208-bca8-6a6ce7c9a1e3
ms.service: security-center
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/20/2016
ms.author: terrylan

---
# Protecting Azure SQL service and data in Azure Security Center
Azure Security Center analyzes the security state of your Azure resources. When Security Center identifies potential security vulnerabilities, it creates recommendations that guide you through the process of configuring the needed controls.  Recommendations apply to Azure resource types: virtual machines (VMs), networking, SQL and data, and applications.

This article addresses recommendations that apply to Azure SQL service and data. Recommendations center around enabling auditing for Azure SQL servers and databases, enabling encryption for SQL databases, and enabling encryption of your Azure storage account.  Use the table below as a reference to help you understand the available SQL service and data recommendations and what each one does if you apply it.

## Available SQL service and data recommendations
| Recommendation | Description |
| --- | --- |
| [Enable server SQL Auditing](security-center-enable-auditing-on-sql-servers.md) |Recommends that you turn on auditing for Azure SQL servers (Azure SQL service only; doesn't include SQL running on your virtual machines). |
| [Enable database SQL Auditing](security-center-enable-auditing-on-sql-databases.md) |Recommends that you turn on auditing for Azure SQL databases (Azure SQL service only; doesn't include SQL running on your virtual machines). |
| [Enable Transparent Data Encryption on SQL databases](security-center-enable-transparent-data-encryption.md) |Recommends that you enable encryption for SQL databases (Azure SQL service only). |
| [Enable encryption for Azure Storage Account](security-center-enable-encryption-for-storage-account.md) | Recommends that you enable Azure Storage Service Encryption for data at rest. Storage Service Encryption (SSE) works by encrypting the data when it is written to Azure storage and decrypts before retrieval. SSE is currently available only for the Azure Blob service and can be used for block blobs, page blobs, and append blobs. To learn more, see [Storage Service Encryption for data at rest](../storage/storage-service-encryption.md).</br>SSE is only supported on Resource Manager storage accounts. Classic storage accounts are currently not supported. To understand the classic and Resource Manager deployment models, see [Azure deployment models](../azure-classic-rm.md). |

## See also
To learn more about recommendations that apply to other Azure resource types, see the following:

* [Protecting your virtual machines in Azure Security Center](security-center-virtual-machine-recommendations.md)
* [Protecting your applications in Azure Security Center](security-center-application-recommendations.md)
* [Protecting your network in Azure Security Center](security-center-network-recommendations.md)

To learn more about Security Center, see the following:

* [Setting security policies in Azure Security Center](security-center-policies.md) -- Learn how to configure security policies for your Azure subscriptions and resource groups.
* [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md) -- Learn how to manage and respond to security alerts.
* [Azure Security Center FAQ](security-center-faq.md) -- Find frequently asked questions about using the service.
