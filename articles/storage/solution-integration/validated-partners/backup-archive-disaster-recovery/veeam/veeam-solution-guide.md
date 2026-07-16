---
title: Azure Data Protection with Veeam
titleSuffix: Azure Storage
description: This article provides information for using Azure Blob storage with Veeam solutions, including details on how to get started and best practices.

author: karauten
ms.author: karauten
ms.date: 09/07/2025
ms.topic: concept-article
ms.service: azure-storage
ms.subservice: storage-partner-integration
# Customer intent: As a cloud administrator, I want to implement Veeam solutions with Azure Blob storage so that I can efficiently back up, restore, and protect my on-premises and Azure workloads while managing costs effectively.
---

<!--

Initial score: 71 (1120/43)
Current score: 100 (1255/0)

-->

# Data protection with Veeam

Azure Blob Storage is compatible with many Veeam products, offering a cost-effective solution for data retention and recovery. Due to the wide range of features available in Azure, no single Veeam product supports all of them. To understand which features each product supports, refer to Veeam’s article on [using object storage with Veeam Products](https://www.veeam.com/kb4241).

This article provides a comprehensive overview of Veeam’s backup and data protection solutions for Microsoft Azure environments. It assists IT professionals, cloud architects, and system administrators who are planning to deploy, manage, or optimize Veeam services within Azure. 

The guide outlines support options, deployment pathways, best practices, and use cases to help ensure secure, scalable, and efficient data resilience across cloud and hybrid infrastructures.

## Solution overview

:::image type="content" source="../media/veeam-solution-guide-sml.png" alt-text="Architecture guide for Veeam backup solutions with as-a-service Veeam solutions. All Veeam solutions support either Veeam Vault or Azure Storage as a backup data repository." lightbox="../media/veeam-solution-guide.png":::

## Using Azure Blob Storage with Veeam
Veeam offerings support object storage as a destination for either short- or long-term data storage and archiving purposes.

### SaaS, self-managed, or service provider managed
- **[Veeam Data Cloud](https://vee.am/datacloud)**, as a service, offers a unified cloud SaaS platform for data resilience.
- **[Veeam Data Platform](https://vee.am/dataplatform)** provides full control over your backup infrastructure and configuration.

### Veeam Data Cloud
**[Veeam Data Cloud](https://vee.am/datacloud)** SaaS Data Protection platform offers data protection as a service. Offering data resilience solutions that protect your on-premises and cloud-based data in a single unified cloud platform.

- **[Veeam Data Cloud Vault](https://vee.am/vault)** is a fully managed, secure cloud storage resource built on Azure, [with predictable pricing](https://vee.am/vault). By integrating features like immutability, air-gapped protection and role-based access, Veeam Vault ensures backups are protected against ransomware, accidental deletion, and unauthorized access.
- **[Veeam Data Cloud for Microsoft 365](https://helpcenter.veeam.com/docs/vdcm365/userguide/welcome.html)** to protect Microsoft 365 Exchange Online, SharePoint Online, OneDrive, and Teams data.
- **[Veeam Data Cloud for Entra ID](https://helpcenter.veeam.com/docs/vdc/userguide/entra_id_protection.html)** to protect users, groups, administrative units, roles, application registrations, audit logs and more.
- **[Veeam Data Cloud for Azure](https://helpcenter.veeam.com/docs/vdcazure/userguide/onboarding.html)** to protect Azure Virtual Machines, Azure SQL, Azure File data and more.

### Veeam Data Platform

**[Veeam Data Platform](https://vee.am/dataplatform)** allows you to deploy and manage backups for your infrastructure with full control. Available to deploy in [Azure Marketplace](https://vee.am/vbrazuremarketplace), or as a stand-alone download. It's also possible to [find a partner](https://vee.am/findapartner) to help you deploy and manage your solution.

- **[Veeam Backup & Replication](https://helpcenter.veeam.com/docs/backup/hyperv/overview.html)** supports [Veeam Vault](https://vee.am/vault) and [Azure storage as a destination](https://helpcenter.veeam.com/docs/backup/hyperv/object_storage_repository.html), it's also possible to utilize [Azure Archive tier](https://helpcenter.veeam.com/docs/backup/vsphere/osr_adding_blob_storage_archive_tier.html) for longer term retention. Veeam manages the data lifecycle of stored objects. See [review considerations and limitations for using Azure Blob with Veeam Products](https://www.veeam.com/kb4241) for more detail. 

     [Unstructured data backup of Azure Blob and Azure Data Lake Storage](https://helpcenter.veeam.com/docs/backup/vsphere/os_azure_add.html) allows you to make a copy of your storage account data in a separate repository.

     You can use [Azure Data Box with Veeam Backup & Replication](https://helpcenter.veeam.com/docs/backup/hyperv/osr_adding_data_box.html?) to offload data to Azure Storage while avoiding bandwidth consumption. Azure Data Box is a physical device that supports a subset of the Azure Storage REST APIs. It's important to note that not all features are supported.

- **[Veeam Backup for Microsoft Azure](https://helpcenter.veeam.com/docs/vbazure/guide/deploying_appliance.html)** supports [Veeam Vault](https://vee.am/vault) and [Azure Storage as target locations](https://helpcenter.veeam.com/docs/vbazure/guide/repository_add_console.html) for image-level backups of Azure virtual machines (VMs) and Azure SQL databases. Learn how to [add a repository in Veeam Backup for Microsoft Azure](https://helpcenter.veeam.com/docs/vbazure/guide/adding_repositories.html). Veeam manages the data lifecycle of stored objects. See [review considerations and limitations for using Azure Blob with Veeam Products](https://www.veeam.com/kb4241) for more detail. 

### Veeam Backup for Microsoft 365 and Microsoft Entra ID
Veeam Backup for Microsoft 365 supports both object storage as a primary repository and Azure Archive storage for long-term retention. Learn how to add an [Azure object storage repository in Veeam Backup for Microsoft 365](https://helpcenter.veeam.com/docs/vbo365/guide/adding_azure_storage.html). 

[Backup for Microsoft Entra ID](https://helpcenter.veeam.com/docs/backup/entraid/overview.html) is built into Veeam Backup & Replication. Veeam manages the data lifecycle of stored objects. See [review considerations and limitations for using Azure Blob with Veeam Products](https://www.veeam.com/kb4241) for more detail. 

### Veeam Kasten for Kubernetes
Veeam Kasten protects containers, configuration and VMs on Kubernetes, with support for [Veeam Vault](https://docs.kasten.io/latest/api/profiles/#create-a-veeam-data-cloud-vault-location-profile) and [Azure Blob storage](https://docs.kasten.io/latest/usage/configuration/#azure-storage) as backup locations.

## Use cases

### Backup on-premises workloads to Azure
You can store backups of your on-premises workloads using [Veeam Backup & Replication](https://helpcenter.veeam.com/docs/backup/hyperv/overview.html), allowing you to use [Veeam Data Cloud Vault](https://vee.am/vault) or Azure Storage's pay-per use model to easily scale your backup infrastructure with durable, cost effective storage. This approach also includes support for virtual workloads, physical workloads, enterprise applications and unstructured data.

### Restore your on-premises workloads to Azure
For fast restore of your on-premises workloads directly to Azure, you can use [Veeam Backup & Replication](https://helpcenter.veeam.com/docs/backup/hyperv/overview.html), giving you the ability to use Azure as an on-demand recovery site for migration purposes.

### Protect Azure workloads with Veeam
To agentlessly protect Azure VMs, Files, SQL, and more, you can use [Veeam Data Cloud for Azure](https://helpcenter.veeam.com/docs/vdcazure/userguide/welcome.html) as a service, or [Veeam Backup for Azure](https://helpcenter.veeam.com/docs/vbazure/guide/overview.html). 

### Protect your Microsoft 365 and Microsoft Entra ID data
You can protect your Exchange Online, SharePoint Online, OneDrive, and Teams data with [Veeam Data Cloud for Microsoft 365](https://helpcenter.veeam.com/docs/vdcm365/userguide/welcome.html) as a service, or [Veeam Backup for Microsoft 365](https://helpcenter.veeam.com/docs/vbo365/guide/). 

[Veeam Data Cloud for Microsoft Entra ID](https://helpcenter.veeam.com/docs/vdc/userguide/entra_id_protection.html) provides comprehensive backup and restore for Microsoft Entra ID users, groups, application registrations, conditional access policies and more.  

## Before you begin

As you plan your Azure Storage strategy with Veeam, review the [Microsoft Cloud Adoption Framework](/azure/cloud-adoption-framework/) for guidance on setting up your Azure environment.

When considering how to deploy Veeam Data Platform solutions for your specific infrastructure, review the following articles:

- [Veeam Backup & Replication Best Practices](https://vee.am/vbrbestpractices)
- [Veeam Backup for Azure Sizing and Scalability Guidelines](https://vee.am/vbazsizing)
- [Veeam Backup for Microsoft 365 Best Practices](https://vee.am/vb365bestpractices)

> [!NOTE] 
> Veeam handles the data lifecycle by storing backup data as encrypted individual blocks. To avoid conflicts or unintended behavior, don't apply Lifecycle Management Policies or enable Microsoft Defender for Storage on storage accounts designated for Veeam backups. [Review considerations and limitations for using Azure Blob with Veeam Products](https://www.veeam.com/kb4241)

## Resources
- [Veeam Data Cloud User Guide](https://helpcenter.veeam.com/docs/vdc/userguide/welcome.html)
- [Veeam Backup & Replication VMware vSphere](https://helpcenter.veeam.com/docs/backup/vsphere/overview.html)
- [Veeam Backup & Replication Microsoft Hyper-V](https://helpcenter.veeam.com/docs/backup/hyperv/)
- [Veeam Backup & Replication support for Azure VMware Solution](https://www.veeam.com/kb4012)
- [Veeam Backup & Replication support for Azure Local](https://www.veeam.com/kb4047)
- [Veeam Backup for Azure User Guide](https://helpcenter.veeam.com/docs/vbazure/guide/)
- [Veeam Backup for Microsoft 365 User Guide](https://helpcenter.veeam.com/docs/vbo365/guide/vbo_introduction.html)
- [Veeam Kasten User Guide](https://docs.kasten.io/latest/)
- [Veeam Plugins for Enterprise Applications User Guide](https://helpcenter.veeam.com/docs/backup/plugins/overview.html)
- [Veeam Agent Management User Guide](https://helpcenter.veeam.com/docs/backup/agents/introduction.html)


### Supplemental Resources
- [Veeam How-To Videos](https://www.veeam.com/how-to-videos.html)
- [Veeam Documentation](https://www.veeam.com/documentation-guides-datasheets.html)
- [Veeam Knowledge Base](https://www.veeam.com/knowledge-base.html)

## Next steps
You can continue to use the Veeam solution you know and trust to protect your workloads running on Azure. Veeam makes it easy to use their solutions to protect VMs and many other services within Azure.

### Marketplace offerings
- [Deploy Veeam Data Cloud Vault from Azure Marketplace](https://vee.am/vaultazuremarketplace)
- [Deploy Veeam Data Cloud for Microsoft 365 from Azure Marketplace](https://vee.am/vdcm365azuremarketplace)
- [Deploy Veeam Data Cloud for Microsoft Entra ID from Azure Marketplace](https://vee.am/vdcentraazuremarketplace)
- [Deploy Veeam Backup & Replication from Azure Marketplace](https://vee.am/vbrazuremarketplace)

## Support

### Open a support case with Veeam

On the [Veeam customer support site](https://www.veeam.com/support.html), sign in, and open a case.

To understand the support options available to you from Veeam, review the [Veeam Customer Support Policy](https://www.veeam.com/support-policy.html).

### Open a support case with Azure

In the [Azure portal](https://portal.azure.com/) search for support in the search bar at the top. Select Help + support -> New Support Request.

> [!NOTE] 
> When you open a case, be specific that you need assistance with Azure Storage or Azure Networking. Don't specify Azure Backup. Azure Backup is the name of an Azure service and your case is routed incorrectly.
