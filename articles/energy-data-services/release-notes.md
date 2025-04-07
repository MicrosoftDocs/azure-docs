---
title: Release notes for Microsoft Azure Data Manager for Energy
description: This article provides release notes of Azure Data Manager for Energy releases, improvements, bug fixes, and known issues.
author: bharathim
ms.author: bselvaraj
ms.service: azure-data-manager-energy
ms.topic: conceptual
ms.date: 09/20/2022
ms.custom: template-concept
---

# Release Notes for Azure Data Manager for Energy 

Azure Data Manager for Energy is updated on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about:

- The latest releases
- Known issues
- Bug fixes
- Deprecated functionality
- Plans for changes

This page is updated with the details about the upcoming release approximately a week before the actual deployment.

<hr width = 100%>

## February 2025
### Reservoir DDMS preview 
Reservoir DDMS (M23 version) is available as a preview feature on Azure Data Manager for Energy Developer tier as a fully integrated offering for customers and partners. See [How to enable Reservoir DDMS (Preview)](how-to-enable-reservoir-ddms.md) for more details.

### Wellbore domain services worker
Azure Data Manager for Energy now includes support for the Wellbore domain services worker, which enhances Wellbore DDMS performance and scalability when handling large bulk data (> 1 GB). This Python back-end service is used internally by the OSDU&reg; Wellbore Domain Data Management Service (WDDMS). It provides an internal API for accessing wellbore bulk data, facilitating efficient data management and processing. See [ADR: Worker Service for Wellbore Bulk Data Access](https://community.opengroup.org/osdu/platform/domain-data-mgmt-services/wellbore/wellbore-domain-services/-/issues/73) for more details.

### Scale and Performance improvements for seismic workflows
Azure Data Manager for Energy has implemented performance and scale enhancements to handle ingestion and conversion of seismic datasets with higher number of vertical samples. Additionally, for consuming these datasets via seismic streaming applications, Azure Data Manager for Energy now supports up to 4x higher throughput, allowing a proportional increase in the number of consumers using SDMS APIs.

### Create legal tags for restricted COO (Country of Origin)
OSDU&reg; defines `residencyRisk` for data originating from certain countries in the default configuration [DefaultCountryCode.json](https://community.opengroup.org/osdu/platform/security-and-compliance/legal/-/blob/master/legal-core/src/main/resources/DefaultCountryCode.json?ref_type=heads). This configuration can now be edited in an OSDU&reg; compliant manner to allow the creation of legal tags and the ingestion of data from such countries on Azure Data Manager for Energy. These configurations apply at a partition level. See [How to enable legal tag creation for OSDU&reg; restricted COO (Country of Origin) data?](how-to-enable-legal-tags-restricted-country-of-origin.md) for more details.

## November 2024
### SOC 2 and ISO certification
Azure Data Manager for Energy is now SOC 2 and ISO compliant, reinforcing our commitment to securely managing sensitive data, building trust, and meeting regulatory requirements. All certifications and compliance reports are available [here](https://servicetrust.microsoft.com/DocumentPage/7adf2d9e-d7b5-4e71-bad8-713e6a183cf3) and will be regularly updated.

### Support for EDS Naturalization DAG (Preview)
Support for the `eds_naturalization` DAG is now available as a preview feature with the Azure Data Manager for Energy M23 release.

### Configure encryption with customer-managed keys stored in Azure Key Vault Managed HSM
You can now use keys stored in Azure Key Vault Managed HSM to encrypt data stored at rest in Azure Data Manager for Energy. See [Data security and encryption in Azure Data Manager for Energy](how-to-manage-data-security-and-encryption.md).

## August 2024

### Compliant with M23 OSDU&reg; release
Azure Data Manager for Energy has now been upgraded with the supported set of services with the M23 OSDU&reg; milestone release. With this release, you can take advantage of the key improvements made in the OSDU&reg; latest 
 community features and capabilities available in the [OSDU&reg; M23](https://community.opengroup.org/osdu/governance/project-management-committee/-/wikis/M23-Release-Notes) The upgrade with the OSDU&reg; M23 release is limited to the services available and supported and you can refer [here](osdu-services-on-adme.md) for a detailed list of services available and unavailable on Azure Data Manager for Energy. See the [updated API Swaggers here](https://microsoft.github.io/adme-samples/).

### Syncing Reference Values
We are releasing a Limited Preview for syncing Reference Values with your Azure Data Manager for Energy data partitions. Note that this feature is currently only available for newly created Azure Data Manager for Energy after feature enablement for your Azure subscription. Learn more about [Reference Values on Azure Data Manager for Energy](concepts-reference-data-values.md).

### CNAME DNS Record Fix
Previously, each ADME resource had an incorrect privatelink DNS record by default, causing inaccessibility issues for some SLB apps. This release resolves the issue for both new and existing instances, ensuring correct and secure configuration of private endpoints. For more details, see [How to setup private links](how-to-set-up-private-links.md).

## June 2024

### Azure Data Manager for Energy Developer Tier Price Update
Effective June 1, 2024, the monthly base instance fee of the Developer tier of Azure Data Manager for Energy will be $2,898 (US East Region). This reflects a 75% cost savings to our customers/partners compared to the previous base instance price of $11,680 per month (US East) and provides ongoing support to our partners and customers as they continue their application modernization and interoperability efforts. The monthly cost above is based on an hourly rate of $3.97 (US East) and an assumption of 730 hours for a given month. These new cost savings will be reflected in all available regions where the product is available based on current regional rate adjustments. Regional differences and additional pricing details will be reflected on the product's [pricing](https://azure.microsoft.com/pricing/details/energy-data-services) page. Note that the pricing page will reflect the current price and will be updated to the new pricing amount on the effective date listed above.


## April 2024

### Azure Data Manager for Energy in Qatar Central Region
Azure Data Manager for Energy is now available in the Qatar Central Region. This new region is enabled for both the Standard and Developer tiers of Azure Data Manager for Energy, and is available for select customers and partners only. Please reach out to your designated Microsoft account team member to unlock access. Once access is provided, you can select "Qatar" as your preferred region when creating Azure Data Manager for Energy resource, using the [Azure portal](https://ms.portal.azure.com/#create/Microsoft.AzureDataManagerforEnergy) or your preferred provisioning method. Qatar Central region supports zone-redundant storage (ZRS) with 3 availability zones for disaster recovery. Data is stored at rest in Qatar in compliance with data residency requirements. For more details on zonal replication, please review the [documentation](../site-recovery/azure-to-azure-how-to-enable-zone-to-zone-disaster-recovery.md) page. Note that the default maximum ingress per general purpose v2 and Blob storage accounts in Qatar Central is 25 Gbps. For more details, please review scalability and performance [targets](../storage/common/scalability-targets-standard-account.md#scale-targets-for-standard-storage-accounts).

## March 2024

### Azure Data Manager for Energy in Australia East Region
Azure Data Manager for Energy is now available in the Australia East Region. This new region is enabled for both the Standard and Developer tiers of Azure Data Manager for Energy. You can now select Australia East as your preferred region when creating Azure Data Manage for Energy resource, using the [Azure portal](https://ms.portal.azure.com/#create/Microsoft.AzureDataManagerforEnergy).

### External Data Sources (Preview)
External Data Sources (EDS) allows data from an [OSDU&reg;](https://osduforum.org/) compliant external data sources to be shared with an Azure Data Manager for Energy resource. EDS is designed to pull specified data (metadata) from OSDU-compliant data sources via scheduled jobs while leaving associated dataset files (LAS, SEG-Y, etc.) stored at the external source for retrieval on demand.

For details, see [How to enable External Data Services (EDS) Preview?](how-to-enable-external-data-sources.md)

## November 2023

### Compliant with M18 OSDU&reg; release
Azure Data Manager for Energy is now compliant with the M18 OSDU&reg; milestone release. With this release, you can take advantage of the latest features and capabilities available in the [OSDU&reg; M18](https://community.opengroup.org/osdu/governance/project-management-committee/-/wikis/M18-Release-Notes).

## September 2023

### Azure Data Manager for Energy in Brazil South Region
Azure Data Manager for Energy is now available in Brazil South Region. Both developer tier and standard tier are available in Brazil South region. You can now select Brazil South as your preferred region when creating Azure Data Manager for Energy resource, using the [Azure portal](https://ms.portal.azure.com/#create/Microsoft.AzureDataManagerforEnergy)".

### Audit Logs for DDMS 
You can now access Audit Logs for create, read, update and delete events for Petrel Data Services, Seismic DMS, and Wellbore DMS Public APIs. This allows you to trace user actions, compile relevant metadata, and use this to run internal audits. [Learn More](./how-to-manage-audit-logs.md)  

## August 2023

### General Availability Fixed Pricing for Azure Data Manager for Energy
Starting September 2023, the General Availability pricing changes for Azure Data Manager for Energy will be effective. You can visit the [Product Pricing Page](https://azure.microsoft.com/pricing/details/energy-data-services/) to learn more.


## June 2023

### Service Level Agreement (SLA) for Azure Data Manager for Energy
Starting July 2023, Azure Data Manager for Energy offers an uptime SLA for its Standard tier offering. You can find the details of our SLA in the document 'Service Level Agreements for Microsoft Online Services (WW)'  published from July 2023 onwards at [Microsoft Licensing Documents & Resource website](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services?lang=1).

### Developer tier for accelerating innovation with OSDU&reg;
Azure Data Manager for Energy is now available in two tiers; Developer and Standard.  All active resources of Azure Data Manager for Energy prior to this release are considered Standard, and now a new Tier option is available called the 'Developer' tier.  Customers can now select their desired tier when creating their Azure Data Manage for Energy resource using the [Azure portal](https://aka.ms/adme-create). [Learn more](./quickstart-create-microsoft-energy-data-services-instance.md)

### Compliant with M16 OSDU&reg; release
Azure Data Manager for Energy is now compliant with the M16 OSDU&reg; milestone release. With this release, you can take advantage of the latest features and capabilities available in the [OSDU&reg; M16](https://community.opengroup.org/osdu/governance/project-management-committee/-/wikis/M16-Release-Notes).

### Disaster recovery: cross-region failover
Azure Data Manager for Energy (Standard tier only) now supports cross-region disaster recovery in a multi-region geography (data residency boundary). The service replicates your critical data (in near real time) and infrastructure across another Azure region within the same geography, ensuring data redundancy and enabling swift failover to a secondary region in the event of an outage. [Learn more](./reliability-energy-data-services.md).

### Support for file uploads greater than 5 GB up to 10 GB
Azure Data Manager for Energy now supports uploading dataset files greater than 5 GB using Azcopy. [Learn more](./how-to-upload-large-files-using-file-service.md)

### Partition names without resource name prefix
July 2023 onwards, all data partitions created in your Azure Data Manager for Energy resource discontinues having the resource name as a prefix. For example, if your resource is called `myadmeresource` and you create a data partition called `mydata`, the partition name/ID will be `mydata`, while previously it used to be `myadmeresource-mydata`. This change won't affect existing data partitions.

<hr width = 100%>

## May 2023

### Enriched Airflow Logs

Airflow logs from your Azure Data Manager for Energy Preview resource now include extra fields: Dag Name, Dag Task Name, Run ID or Correlation ID, Code Path, TryNumber, Content, Location, Log Severity Level, and Resource ID. These fields can be utilized in the KQL query editor of your linked Log Analytics Workspace to get more specific logs for your executed workflows/DAGs. Learn more about [how to integrate Airflow logs with Azure Monitor](how-to-integrate-airflow-logs-with-azure-monitor.md). 

<hr width = 100%>

## April 2023

### Support for Private Links during instance provisioning

Azure Private link enables access to Azure Data Manager for Energy Preview instance over a private endpoint in your virtual network, which ensures restricted access to the service. With this feature, you can now configure private endpoints to your Azure Data Manager for Energy instance during the instance creation. Your service instance can now have private connectivity from the very beginning. Learn more about [how to set up private links](how-to-set-up-private-links.md).

### Enabled Monitoring of OSDU Service Logs

Now you can configure diagnostic settings of your Azure Data Manager for Energy to export OSDU Service Logs to Azure Monitor. You can access, query, & analyze the logs in a Log Analytics Workspace. You can archive them in a storage account for later use. Learn more about [how to integrate OSDU service logs with Azure Monitor](how-to-integrate-osdu-service-logs-with-azure-monitor.md)

### Monitoring and investigating actions with Audit logs

Knowing who is taking what action on which item is critical in helping organizations meet regulatory compliance and record management requirements. Azure Data Manager for Energy captures audit logs for data plane APIs of OSDU services and audit events listed [here](https://community.opengroup.org/osdu/platform/deployment-and-operations/audit-and-metrics). Learn more about [audit logging in Azure Data Manager for Energy](how-to-manage-audit-logs.md).

<hr width = 100%>

## February 2023

### Compliant with M14 OSDU&reg; release

Azure Data Manager for Energy is now compliant with the M14 OSDU&reg; milestone release. With this release, you can take advantage of the latest features and capabilities available in the [OSDU&reg; M14](https://community.opengroup.org/osdu/governance/project-management-committee/-/wikis/M14-Release-Notes).

### Product Billing enabled

Billing for Azure Data Manager for Energy is enabled. During preview, the price for each instance is based on a fixed per-hour consumption. [Pricing information for Azure Data Manager for Energy.](https://azure.microsoft.com/pricing/details/energy-data-services/#pricing)


### Available on Azure Marketplace

You can go directly to the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/Microsoft.AzureDataManagerforEnergy?tab=Overview) to create an Azure Data Manager for Energy resource in your subscription. You don't need to raise a support ticket with Microsoft to provision an instance anymore. 

### Support for Petrel Data Services
Azure Data Manager for Energy supports [Petrel Data Services](overview-ddms.md#) that allows you to use [Petrel](https://www.software.slb.com/products/petrel) from SLB&trade; with Azure Data Manager from Energy as its data store. You can view your Petrel projects, liberate data from Petrel, and collaborate in real time with data permanently stored in Azure Data Manager for Energy. 

### Enable Resource sharing (CORS)

CORS provides a secure way to allow one origin (the origin domain) to call APIs in another origin. You can set CORS rules for each Azure Data Manager for Energy instance. When you set CORS rules for the instance they get applied automatically across all the services and storage accounts linked with Azure Data Manager for Energy. [How to enable CORS.]( ../energy-data-services/how-to-enable-CORS.md)

<hr width = 100%>

## January 2023

### Managed Identity support 

You can use a managed identity to authenticate to any [service that supports Azure AD (Active Directory) authentication](../active-directory/managed-identities-azure-resources/services-azure-active-directory-support.md) with Azure Data Manager for Energy. For example, you can write a script in Azure Function to ingest data in Azure Data Manager for Energy. Now, you can use managed identity to connect to Azure Data Manager for Energy using system or user assigned managed identity from other Azure services. [Learn more.](../energy-data-services/how-to-use-managed-identity.md)

### Availability Zone support

Availability Zones are physically separate locations within an Azure region made up of one or more datacenters equipped with independent power, cooling, and networking. Availability Zones provide in-region High Availability and protection against local disasters. Azure Data Manager for Energy supports zone-redundant instance by default and there's no setup required by the customer. [Learn more.](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=energy-data-services&regions=all)

<hr width=100%>

## December 2022

### Support for Lockbox

Most operations such as support and troubleshooting, performed by Microsoft personnel don't require access to customer data. In those rare circumstances where such access is required, Customer Lockbox for Azure Data Manager for Energy provides you with an interface to review, approve or reject data access requests. Azure Data Manager for Energy now supports Lockbox. [Learn more](../security/fundamentals/customer-lockbox-overview.md).


<hr width=100%>

## October 2022

### Support for Private Links

Azure Private Link on Azure Data Manager for Energy provides private access to the service. With Azure Private Link, traffic between your private network and Azure Data Manager for Energy travels over the Microsoft backbone network, therefore limiting any exposure over the internet. By using Azure Private Link, you can connect to an Azure Data Manager for Energy instance from your virtual network via a private endpoint. You can limit access to your Azure Data Manager for Energy instance over these private IP addresses. [Create a private endpoint for Azure Data Manager for Energy](how-to-set-up-private-links.md).

### Encryption at rest using Customer Managed keys

Azure Data Manager for Energy supports customer managed encryption keys (CMK). All data in Azure Data Manager for Energy is encrypted with Microsoft-managed keys by default. In addition to Microsoft-managed key, you can use your own encryption key to protect the data in Azure Data Manager for Energy. When you specify a customer-managed key, that key is used to protect and control access to the Microsoft-managed key that encrypts your data. [Data security and encryption in Azure Data Manager for Energy](how-to-manage-data-security-and-encryption.md).


<hr width=100%>


## September 2022

### Key Announcement: Release

Azure Data Manager for Energy is now available in. Information on latest releases, bug fixes, & deprecated functionality for Azure Data Manager for Energy will be updated monthly.

Azure Data Manager for Energy is developed in alignment with the emerging requirements of the OSDU&reg; technical standard, version 1.0. and is currently aligned with Mercury Release(R3), [Milestone-12](https://community.opengroup.org/osdu/governance/project-management-committee/-/wikis/M12-Release-Notes).

### Partition & User Management

- New data partitions can be [created after provisioning an Azure Data Manager for Energy instance](how-to-add-more-data-partitions.md). Earlier, data partitions could only be created when provisioning a new instance.
- The domain name for entitlement groups for [user management](how-to-manage-users.md) has been changed to "dataservices.energy".

### Data Ingestion

- Azure Data Manager for Energy supports user context in ingestion ([ADR: Issue 52](https://community.opengroup.org/osdu/platform/data-flow/ingestion/home/-/issues/52)) 
  - User identity is preserved and passed on to all ingestion workflow related services using the newly introduced _x-on-behalf-of_ header. You need to have appropriate service level entitlements on all dependent services involved in the ingestion workflow to modify data.
- Workflow service payload is restricted to a maximum of 2 MB. If it exceeds, the service throws an HTTP 413 error. This restriction is placed to prevent workflow requests from overwhelming the server.
- Azure Data Manager for Energy uses Azure Data Factory (ADF) to run large scale ingestion workloads.

### Search

Azure Data Manager for Energy is more secure as Elasticsearch images are now pulled from Microsoft's internal Azure Container Registry instead of public repositories. In addition, Elastic search, registration, and notification services are now encrypted in transit further enhancing the security of the product.

### Monitoring

Azure Data Manager for Energy supports diagnostic settings for [Airflow logs](how-to-integrate-airflow-logs-with-azure-monitor.md) and [Elasticsearch logs](how-to-integrate-elastic-logs-with-azure-monitor.md). You can configure Azure Monitor to view these logs in the storage location of your choice.

### Region Availability

Currently, Azure Data Manager for Energy is available in the following regions - South Central US, East US, West Europe, and North Europe.

---

 
