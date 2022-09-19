---
title: Release notes #Required; page title is displayed in search results. Include the brand.
description: This topic provides release notes of Microsoft Energy Data Services releases, improvements, bug fixes, and known issues. #Required; article description that is displayed in search results. 
author: nitinnms #Required; your GitHub user alias, with correct capitalization.
ms.author: nitindwivedi #Required; microsoft alias of author; optional team alias.
ms.service: energy-data-services #Required; service per approved list. slug assigned by ACOM.
ms.topic: conceptual #Required; leave this attribute/value as-is.
ms.date: 09/20/2022 #Required; mm/dd/yyyy format.
ms.custom: template-concept #Required; leave this attribute/value as-is.
---

Microsoft Energy Data Services receives improvements on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about:

- The latest releases
- Known issues
- Bug fixes
- Deprecated functionality
- Plans for changes

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]


# Microsoft Energy Data Services Preview

## September 2022

### Key Announcement

Your Microsoft Energy Data Services instance conforms with the requirements of the Release-3, [Milestone-12](https://community.opengroup.org/osdu/governance/project-management-committee/-/wikis/M12-Release-Notes) of OSDU&trade; Technical Standard, Version 1.0.

### Partition & User Management

- You can create [new data partitions](../energy-data-services/how-to-add-more-data-partitions.md) (up to five) in your existing Microsoft Energy Data Services instance. Earlier, you could create a data partition only while provisioning the instance.
- The domain name for your entitlement groups for [user management](../energy-data-services/how-to-manage-users.md) is changed to "dataservices.energy".

### Data Ingestion

- Microsoft Energy Data Services - Enabled support for user context in ingestion ([ADR: Issue 52](https://community.opengroup.org/osdu/platform/data-flow/ingestion/home/-/issues/52)) (not yet supported in the Azure OSDU&trade; community edition)
  - In Microsoft Energy Data Services, the User identity is preserved and passed on to all ingestion workflow related services using the newly introduced _x-on-behalf-of_ header.
  - In Azure OSDU&trade; community edition, users could trigger an ingestion job by calling the workflow service even without appropriate service level entitlements on the underlying dependent services (using elevated SPN permissions). In Microsoft Energy Data Services, a user needs to have appropriate service level entitlements on all dependent services involved in the ingestion workflow
  - In Azure OSDU&trade; community edition, users who were not part of the same data entitlement group could accidentally modify and corrupt data (using elevated SPN permissions). In Microsoft Energy Data Services, only users belonging to the same data entitlement group can modify data, and the modified user and date information are captured.
- Workflow service payload is restricted to a maximum of 2MB. If it exceeds, the service will throw a HTTP 413 error. This restriction is placed to prevent workflow requests from overwhelming the server.
- Microsoft Energy Data Services leverages Azure Data Factory (ADF) to run large scale ingestion workloads.

### Search

- Improved security as Elasticsearch images is now pulled from Microsoft's internal Azure Container Registry instead of public repositories.
- Improved security by enabling encryption in transit in Elasticsearch, Registration, and Notification services.

### Monitoring

- You can create diagnostic settings to export [Airflow]../energy-data-services/how-to-integrate-airflow-logs-with-azure-monitor.md) and [Elasticsearch](../energy-data-services/how-to-integrate-elastic-logs-with-azure-monitor.md) logs from your Microsoft Energy Data Services instance to Azure Monitor.

### Hardware & Software

- Your Microsoft Energy Data Services instance runs on the latest version of Azure Kubernetes Services (AKS) clusters – [version 1.24.](https://kubernetes.io/blog/2022/04/07/upcoming-changes-in-kubernetes-1-24/)

### Region Availability

- In Preview, Availability Zones will be available by default in select regions. All new Microsoft Energy Data Services instances created in these select zones will have Availability Zones redundancy enabled on them upon creation.
- The selected regions where Availability Zones will be offered on Microsoft Energy Data Services Preview are - South Central US, East US, West Europe, and North Europe.
