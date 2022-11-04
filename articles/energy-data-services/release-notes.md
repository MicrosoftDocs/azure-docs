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


<hr width=100%>


## October 20, 2022

### Support for Private Links

Azure Private Link on Microsoft Energy Data Services provides private access to the service. This means traffic between your private network and Microsoft Energy Data Services travels over the Microsoft backbone network therefore limiting any exposure over the internet. By using Azure Private Link, you can connect to a Microsoft Energy Data Services instance from your virtual network via a private endpoint, which is a set of private IP addresses in a subnet within the virtual network. You can then limit access to your Microsoft Energy Data Services instance over these private IP addresses. [Create a private endpoint for Microsoft Energy Data Services](how-to-set-up-private-links.md).

### Encryption at Rest using Customer Managed Keys
Microsoft Energy Data Services Preview supports customer managed encryption keys (CMK). All data in Microsoft Energy Data Services is encrypted with Microsoft-managed keys by default. In addition to Microsoft-managed key, you can use your own encryption key to protect the data in Microsoft Energy Data Services. When you specify a customer-managed key, that key is used to protect and control access to the Microsoft-managed key that encrypts your data. [Data security and encryption in Microsoft Energy Data Services](how-to-manage-data-security-and-encryption.md).


<hr width=100%>


## Microsoft Energy Data Services Preview Release


### Key Announcement

Microsoft Energy Data Services is now available in public preview. 

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

 
