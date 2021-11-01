---
title: Security in Azure Managed Instance for Apache Cassandra - overview
description: Security in Azure Managed Instance for Apache Cassandra - overview
author: TheovanKraay
ms.author: thvankra
ms.service: managed-instance-apache-cassandra
ms.topic: concepts
ms.date: 29/10/2021
ms.custom: references_regions, devx-track-azurecli

---

# Security in Azure Managed Instance for Apache Cassandra - overview

This article discusses database security best practices and key features offered by Azure Managed Instance for Apache Cassandra to help you prevent, detect, and respond to database breaches.

## How do I secure my database

Data security is a shared responsibility between you, the customer, and your database provider. Depending on the database provider you choose, the amount of responsibility you carry can vary. If you choose an on-premises solution, you need to provide everything from end-point protection to physical security of your hardware - which is no easy task. If you choose a managed service such as Azure Managed Instance for Apache Cassandra, your area of concern reduces. 

## How does Azure Managed Instance for Apache Cassandra secure my database


|Security requirement|Azure Managed Instance for Apache Cassandra's security approach|
|---|---|
|Network security| Azure Managed Instance for Apache Cassandra resources are hosted on a Microsoft tenant, with network interface cards (NICs) for each resource injected exclusievly into Virtual Networks using private IPs. There are no public IPs exposed with this service.|
|Automated online backups|Azure Managed Instance for Apache Cassandra datacenters are backed up every 4 hours and retained for 2 days. Backups are held in local storage accounts.|
|Restore deleted data|The automated online backups can be used to recover data you may have accidentally deleted up to ~2 days after the event.|
|HTTPS/SSL/TLS and disk encryption | In Azure Managed Instance for Apache Cassandra, all data is encrypted at rest. Server SSL (TLS 1.2) and node-to-node encryption are enforced. Client SSL is an optional configuration. |
|Monitor for attacks|Azure Managed Instance for Apache Cassandra is integrated with [Azure Monitor](../azure/azure-monitor/overview.md). By using audit logging and activity logs, you can monitor your account for normal and abnormal activity. You can view what operations were performed on your resources, who initiated the operation, when the operation occurred, the status of the operation, and much more.|
|Respond to attacks|Once you have contacted Azure support to report a potential attack, a 5-step incident response process is kicked off. The goal of the 5-step process is to restore normal service security and operations as quickly as possible after an issue is detected and an investigation is started.<br><br>Learn more in [Microsoft Azure Security Response in the Cloud](https://gallery.technet.microsoft.com/Shared-Responsibilities-81d0ff91).|
|Patched servers|As a managed database, Azure Managed Instance for Apache Cassandra eliminates the need to manage and patch servers, that's done for you, automatically.|
|Security and data protection certifications| For the most up-to-date list of certifications see the overall [Azure Compliance site](https://www.microsoft.com/en-us/trustcenter/compliance/complianceofferings) as well as the latest [Azure Compliance Document](https://gallery.technet.microsoft.com/Overview-of-Azure-c1be3942) with all certifications (search for Cosmos).


## Next steps

For more information about Microsoft certifications, see [Azure Trust Center](https://azure.microsoft.com/support/trust-center/).