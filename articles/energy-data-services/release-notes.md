---
title: Release notes for Microsoft Energy Data Services Preview #Required; page title is displayed in search results. Include the brand.
description: This topic provides release notes of Microsoft Energy Data Services Preview releases, improvements, bug fixes, and known issues. #Required; article description that is displayed in search results. 
author: nitinnms #Required; your GitHub user alias, with correct capitalization.
ms.author: nitindwivedi #Required; microsoft alias of author; optional team alias.
ms.service: energy-data-services #Required; service per approved list. slug assigned by ACOM.
ms.topic: conceptual #Required; leave this attribute/value as-is.
ms.date: 09/20/2022 #Required; mm/dd/yyyy format.
ms.custom: template-concept #Required; leave this attribute/value as-is.
---

# Release Notes for Microsoft Energy Data Services Preview

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

Microsoft Energy Data Services is updated on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about:

- The latest releases
- Known issues
- Bug fixes
- Deprecated functionality
- Plans for changes

<hr width = 100%>

## February 2023
### Product Billing Update

Microsoft Energy Data Services will begin billing February 15, 2023. Prices will be based on a fixed per-hour consumption rate at a 50 percent discount during preview. 
- No upfront costs or termination fees—pay only for what you use.
- No charges for storage, data transfers or compute overage during preview.


## January 2023

### Managed Identity Support 

You can use a managed identity to authenticate to any [service that supports Azure AD (Active Directory) authentication](../active-directory/managed-identities-azure-resources/services-azure-active-directory-support.md) with Microsoft Energy Data Services. For example, you can write a script in Azure Function to ingest data in Microsoft Energy Data Services. Now, you can use managed identity to connect to Microsoft Energy Data Services using system or user assigned managed identity from other Azure services. [Learn more.]( ../energy-data-services/how-to-use-managed-identity.md)

### Availability zone support

Availability Zones are physically separate locations within an Azure region made up of one or more datacenters equipped with independent power, cooling, and networking. Availability Zones provide in-region High Availability and protection against local disasters. Microsoft Energy Data Services Preview supports zone-redundant instance by default and there's no setup required by the Customer. [Learn more.](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=energy-data-services&regions=all)

<hr width=100%>

## December 2022

### Lockbox

Most operations, support, and troubleshooting performed by Microsoft personnel do not require access to customer data. In those rare circumstances where such access is required, Customer Lockbox for Microsoft Energy Data Services provides you an interface to review and approve or reject data access requests. Microsoft Energy Data Services now supports Lockbox. [Learn more](../security/fundamentals/customer-lockbox-overview.md).


<hr width=100%>

## October 2022

### Support for Private Links

Azure Private Link on Microsoft Energy Data Services provides private access to the service. This means traffic between your private network and Microsoft Energy Data Services travels over the Microsoft backbone network therefore limiting any exposure over the internet. By using Azure Private Link, you can connect to a Microsoft Energy Data Services instance from your virtual network via a private endpoint, which is a set of private IP addresses in a subnet within the virtual network. You can then limit access to your Microsoft Energy Data Services instance over these private IP addresses. [Create a private endpoint for Microsoft Energy Data Services](how-to-set-up-private-links.md).

### Encryption at Rest using Customer Managed Keys
Microsoft Energy Data Services Preview supports customer managed encryption keys (CMK). All data in Microsoft Energy Data Services is encrypted with Microsoft-managed keys by default. In addition to Microsoft-managed key, you can use your own encryption key to protect the data in Microsoft Energy Data Services. When you specify a customer-managed key, that key is used to protect and control access to the Microsoft-managed key that encrypts your data. [Data security and encryption in Microsoft Energy Data Services](how-to-manage-data-security-and-encryption.md).


<hr width=100%>


## September 2022

### Key Announcement: Preview Release

Microsoft Energy Data Services is now available in public preview. Information on latest releases, bug fixes, & deprecated functionality for Microsoft Energy Data Services Preview will be updated monthly. Keep tracking this page. 

Microsoft Energy Data Services is developed in alignment with the emerging requirements of the OSDU™ Technical Standard, Version 1.0. and is currently aligned with Mercury Release(R3), [Milestone-12](https://community.opengroup.org/osdu/governance/project-management-committee/-/wikis/M12-Release-Notes).

### Partition & User Management

- New data partitions can be [created dynamically](how-to-add-more-data-partitions.md) as needed post provisioning of the platform (up to five). Earlier, data partitions could only be created when provisioning a new instance.
- The domain name for entitlement groups for [user management](how-to-manage-users.md) has been changed to "dataservices.energy".

### Data Ingestion

- Enabled support for user context in ingestion ([ADR: Issue 52](https://community.opengroup.org/osdu/platform/data-flow/ingestion/home/-/issues/52)) 
  - User identity is preserved and passed on to all ingestion workflow related services using the newly introduced _x-on-behalf-of_ header. A user needs to have appropriate service level entitlements on all dependent services involved in the ingestion workflow and only users with appropriate data level entitlements can modify data.
- Workflow service payload is restricted to a maximum of 2 MB. If it exceeds, the service will throw an HTTP 413 error. This restriction is placed to prevent workflow requests from overwhelming the server.
- Microsoft Energy Data Services uses Azure Data Factory (ADF) to run large scale ingestion workloads.

### Search

- Improved security as Elasticsearch images are now pulled from Microsoft's internal Azure Container Registry instead of public repositories.
- Improved security by enabling encryption in transit for Elasticsearch, Registration, and Notification services.

### Monitoring

- Diagnostic settings can be exported from [Airflow](how-to-integrate-airflow-logs-with-azure-monitor.md) and [Elasticsearch](how-to-integrate-elastic-logs-with-azure-monitor.md) to Azure Monitor.

### Region Availability

- Currently, Microsoft Energy Data Services is being offered in the following regions - South Central US, East US, West Europe, and North Europe.

---

 
