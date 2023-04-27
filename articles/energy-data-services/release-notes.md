---
title: Release notes for Microsoft Azure Data Manager for Energy Preview
description: This article provides release notes of Azure Data Manager for Energy Preview releases, improvements, bug fixes, and known issues.
author: nitinnms
ms.author: nitindwivedi
ms.service: energy-data-services
ms.topic: conceptual
ms.date: 09/20/2022
ms.custom: template-concept
---

# Release Notes for Azure Data Manager for Energy Preview 

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

Azure Data Manager for Energy Preview is updated on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about:

- The latest releases
- Known issues
- Bug fixes
- Deprecated functionality
- Plans for changes

<hr width = 100%>

## April 2023

### Enabled Monitoring of OSDU Service Logs

Now you can configure diagnostic settings of your Azure Data Manager for Energy Preview to export OSDU Service Logs to Azure Monitor. You can access, query, & analyze the logs in a Log Analytics Workspace. You can archive them in a storage account for later use. 

### Monitoring and investigating actions with Audit logs

Knowing who is taking what action on which item is critical in helping organizations meet regulatory compliance and record management requirements. Azure Data Manager for Energy captures audit logs for data plane APIs of OSDU services and audit events listed [here](https://community.opengroup.org/osdu/documentation/-/wikis/Releases/R3.0/GCP/GCP-Operation/Logging/Audit-Logging-Status). Learn more about [audit logging in Azure Data Manager for Energy](how-to-manage-audit-logs.md).

## February 2023

### Compliant with M14 OSDU&trade; release

Azure Data Manager for Energy Preview is now compliant with the M14 OSDU&trade; milestone release. With this release, you can take advantage of the latest features and capabilities available in the [OSDU&trade; M14](https://community.opengroup.org/osdu/governance/project-management-committee/-/wikis/M14-Release-Notes).

### Product Billing enabled

Billing for Azure Data Manager for Energy Preview is enabled. During Preview, the price for each instance is based on a fixed per-hour consumption. [Pricing information for Azure Data Manager for Energy Preview.](https://azure.microsoft.com/pricing/details/energy-data-services/#pricing)


### Available on Azure Marketplace

You can go directly to the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/Microsoft.MicrosoftEnergyDataServices?tab=Overview) to create an Azure Data Manager for Energy Preview instance in your subscription. You don't need to raise a support ticket with Microsoft to provision an instance anymore. 

### Support for Petrel Data Services
Azure Data Manager for Energy Preview supports [Petrel Data Services](overview-ddms.md#) that allows you to use [Petrel](https://www.software.slb.com/products/petrel) from SLB&trade; with Azure Data Manager from Energy as its data store. You can view your Petrel projects, liberate data from Petrel, and collaborate in real time with data permanently stored in Azure Data Manager for Energy. 

### Enable Resource sharing (CORS)

CORS provides a secure way to allow one origin (the origin domain) to call APIs in another origin. You can set CORS rules for each Azure Data Manager for Energy Preview instance. When you set CORS rules for the instance they get applied automatically across all the services and storage accounts linked with Azure Data Manager for Energy Preview. [How to enable CORS.]( ../energy-data-services/how-to-enable-CORS.md)

## January 2023

### Managed Identity support 

You can use a managed identity to authenticate to any [service that supports Azure AD (Active Directory) authentication](../active-directory/managed-identities-azure-resources/services-azure-active-directory-support.md) with Azure Data Manager for Energy Preview. For example, you can write a script in Azure Function to ingest data in Azure Data Manager for Energy Preview. Now, you can use managed identity to connect to Azure Data Manager for Energy Preview using system or user assigned managed identity from other Azure services. [Learn more.](../energy-data-services/how-to-use-managed-identity.md)

### Availability Zone support

Availability Zones are physically separate locations within an Azure region made up of one or more datacenters equipped with independent power, cooling, and networking. Availability Zones provide in-region High Availability and protection against local disasters. Azure Data Manager for Energy Preview supports zone-redundant instance by default and there's no setup required by the customer. [Learn more.](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=energy-data-services&regions=all)

<hr width=100%>

## December 2022

### Support for Lockbox

Most operations, support, and troubleshooting performed by Microsoft personnel don't require access to customer data. In those rare circumstances where such access is required, Customer Lockbox for Azure Data Manager for Energy Preview provides you with an interface to review, approve or reject data access requests. Azure Data Manager for Energy Preview now supports Lockbox. [Learn more](../security/fundamentals/customer-lockbox-overview.md).


<hr width=100%>

## October 2022

### Support for Private Links

Azure Private Link on Azure Data Manager for Energy Preview provides private access to the service. With Azure Private Link, traffic between your private network and Azure Data Manager for Energy Preview travels over the Microsoft backbone network, therefore limiting any exposure over the internet. By using Azure Private Link, you can connect to an Azure Data Manager for Energy Preview instance from your virtual network via a private endpoint. You can limit access to your Azure Data Manager for Energy Preview instance over these private IP addresses. [Create a private endpoint for Azure Data Manager for Energy Preview](how-to-set-up-private-links.md).

### Encryption at rest using Customer Managed keys

Azure Data Manager for Energy Preview supports customer managed encryption keys (CMK). All data in Azure Data Manager for Energy Preview is encrypted with Microsoft-managed keys by default. In addition to Microsoft-managed key, you can use your own encryption key to protect the data in Azure Data Manager for Energy Preview. When you specify a customer-managed key, that key is used to protect and control access to the Microsoft-managed key that encrypts your data. [Data security and encryption in Azure Data Manager for Energy Preview](how-to-manage-data-security-and-encryption.md).


<hr width=100%>


## September 2022

### Key Announcement: Preview Release

Azure Data Manager for Energy is now available in preview. Information on latest releases, bug fixes, & deprecated functionality for Azure Data Manager for Energy Preview will be updated monthly.

Azure Data Manager for Energy Preview is developed in alignment with the emerging requirements of the OSDU&trade; technical standard, version 1.0. and is currently aligned with Mercury Release(R3), [Milestone-12](https://community.opengroup.org/osdu/governance/project-management-committee/-/wikis/M12-Release-Notes).

### Partition & User Management

- New data partitions can be [created after provisioning an Azure Data Manager for Energy Preview instance](how-to-add-more-data-partitions.md). Earlier, data partitions could only be created when provisioning a new instance.
- The domain name for entitlement groups for [user management](how-to-manage-users.md) has been changed to "dataservices.energy".

### Data Ingestion

- Azure Data Manager for Energy Preview supports user context in ingestion ([ADR: Issue 52](https://community.opengroup.org/osdu/platform/data-flow/ingestion/home/-/issues/52)) 
  - User identity is preserved and passed on to all ingestion workflow related services using the newly introduced _x-on-behalf-of_ header. You need to have appropriate service level entitlements on all dependent services involved in the ingestion workflow to modify data.
- Workflow service payload is restricted to a maximum of 2 MB. If it exceeds, the service throws an HTTP 413 error. This restriction is placed to prevent workflow requests from overwhelming the server.
- Azure Data Manager for Energy Preview uses Azure Data Factory (ADF) to run large scale ingestion workloads.

### Search

Azure Data Manager for Energy Preview is more secure as Elasticsearch images are now pulled from Microsoft's internal Azure Container Registry instead of public repositories. In addition, Elastic search, registration, and notification services are now encrypted in transit further enhancing the security of the product.

### Monitoring

Azure Data Manager for Energy Preview supports diagnostic settings for [Airflow logs](how-to-integrate-airflow-logs-with-azure-monitor.md) and [Elasticsearch logs](how-to-integrate-elastic-logs-with-azure-monitor.md). You can configure Azure Monitor to view these logs in the storage location of your choice.

### Region Availability

Currently, Azure Data Manager for Energy Preview is available in the following regions - South Central US, East US, West Europe, and North Europe.

---

 
