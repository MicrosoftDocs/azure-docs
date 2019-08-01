---
title: Azure Security and Compliance Blueprint - Analytics for FedRAMP
description: Azure Security and Compliance Blueprint - Analytics for FedRAMP
services: security
author: jomolesk

ms.assetid: b4675715-668e-4557-9c1c-698aabf62ceb
ms.service: security
ms.topic: article
ms.date: 05/02/2018
ms.author: jomolesk
---

# Azure Security and Compliance Blueprint: Analytics for FedRAMP

## Overview

The [Federal Risk and Authorization Management Program (FedRAMP)](https://www.fedramp.gov/) is a United States government-wide program that provides a standardized approach to security assessment, authorization, and continuous monitoring for cloud products and services. This Azure Security and Compliance Blueprint provides guidance for how to deliver a Microsoft Azure analytics architecture that helps implement a subset of FedRAMP High controls. This solution provides guidance on the deployment and configuration of Azure resources for a common reference architecture, demonstrating ways in which customers can meet specific security and compliance requirements and serves as a foundation for customers to build and configure their own analytics solutions in Azure.

This reference architecture, associated control implementation guides, and threat models are intended to serve as a foundation for customers to adjust to their specific requirements and should not be used as-is in a production environment. Deploying an application into this environment without modification is insufficient to completely meet the requirements of the FedRAMP High baseline. Please note the following:
- The architecture provides a baseline to help customers deploy workloads to Azure in a FedRAMP-compliant manner.
- Customers are responsible for conducting appropriate security and compliance assessments of any solution built using this architecture, as requirements may vary based on the specifics of each customer's implementation.

## Architecture diagram and components

This solution provides an analytics platform upon which customers can build their own analytics tools. The reference architecture outlines a generic use case where customers input data either through bulk data imports by the SQL/Data Administrator or through operational data updates via an Operational User. Both work streams incorporate [Azure Functions](https://docs.microsoft.com/azure/azure-functions/functions-overview) for importing data into the SQL Database. Azure Functions must be configured by the customer through the Azure Portal to handle the import tasks unique to each customer's own analytics requirements.

Microsoft Azure offers a variety of reporting and analytics services for the customer; however, this solution incorporates Azure Analysis Services in conjunction with Azure SQL Database to rapidly browse through data and deliver faster results through smarter modeling of customer data. Azure Analytics Services is a form of machine learning intended to increase query speeds by discovering new relationships between datasets. Once the data has been trained through several statistical functions, up to 7 additional query pools (8 total including the customer server) can be synchronized with the same tabular models to spread query workload and reduce response times.

For enhanced analytics and reporting, SQL Databases can be configured with columnstore indexes. Both Azure Analytics Services and SQL Databases can be scaled up or down or shut off completely in response to customer usage. All SQL traffic is encrypted with SSL through the inclusion of self-signed certificates. As a best practice, Azure recommends the use of a trusted certificate authority for enhanced security.

Once data is uploaded to the Azure SQL Database and trained by Azure Analysis Services, it is digested by both the Operational User and SQL/Data Admin with Power BI. Power BI displays data intuitively and pulls together information across multiple datasets to draw greater insight. Its high degree of adaptability and easy integration with Azure SQL Database ensures that customers can configure it to handle a wide array of scenarios as required by their business needs.

The entire solution is built upon an Azure Storage which account customers configure from the Azure Portal. Azure Storage encrypts all data with Storage Service Encryption to maintain confidentiality of data at rest.  Geographic Redundant Storage (GRS) ensures that an adverse event at the customer's primary data center will not result in a loss of data as a second copy will be stored in a separate location hundreds of miles away.

For enhanced security, this architecture manages resources with Azure Active Directory and Azure Key Vault. System health is monitored through Azure Monitor. Customers configure both monitoring services to capture logs and display system health in a single, easily navigable dashboard.

Azure SQL Database is commonly managed through SQL Server Management Studio (SSMS), which runs from a local machine configured to access the Azure SQL Database via a secure VPN or ExpressRoute connection. **Azure recommends configuring a VPN or Azure ExpressRoute connection for management and data import into the reference architecture resource group.**

![Analytics for FedRAMP reference architecture diagram](images/fedramp-analytics-reference-architecture.png?raw=true "Analytics for FedRAMP reference architecture diagram")

### Roles
The analytics blueprint outlines a scenario with three general user types: the Operational User, the SQL/Data Admin, and the Systems Engineer. Azure Role-based Access Control (RBAC) enables the implementation of precise access management through built-in custom roles. Resources are available for configuring [Role-based Access Control](https://docs.microsoft.com/azure/active-directory/role-based-access-control-configure) and outlining and implementing [pre-defined roles](https://docs.microsoft.com/azure/active-directory/role-based-access-built-in-roles).

#### Systems engineer
The Systems Engineer owns the customer subscription for Azure and configures the deployment of the solution through the Azure Portal.

#### SQL/data administrator
The SQL/Data Administrator establishes the bulk data import function and the operational data update function for uploading to the Azure SQL database. The SQL/Data Administrator is not responsible for any operational data updates in the database but will be able to view the data through Power BI.

#### Operational user
The Operational User updates the data regularly and owns the day-to-day data generation. The Operational User will also interpret results through Power BI.

### Azure services

This solution uses the following Azure services. Details of the deployment architecture are in the [Deployment Architecture](#deployment-architecture) section.
- Azure Functions
- Azure SQL Database
- Azure Analysis Service
- Azure Active Directory
- Azure Key Vault
- Azure Monitor (logs)
- Azure Storage
- ExpressRoute/VPN Gateway
- Power BI Dashboard

## Deployment architecture
The following section details the development and implementation elements.

![alt text](images/fedramp-analytics-components.png?raw=true "Analytics for FedRAMP components diagram")

**Azure Functions**: [Azure Functions](https://docs.microsoft.com/azure/azure-functions/functions-overview) are solutions for running small pieces of code in the cloud via most programming languages. Functions in this solution integrate with Azure Storage to automatically pull customer data into the cloud, facilitating integration with other Azure services. Functions are easily scalable and only incur a cost when they are running.

**Azure Analysis Service**: [Azure Analysis Service](https://docs.microsoft.com/azure/analysis-services/analysis-services-overview) provides enterprise data modeling and integration with Azure data platform services. Azure Analysis Service speeds up browsing through massive amounts of data by combining data from multiple sources into a single data model.

**Power BI**: [Power BI](https://docs.microsoft.com/power-bi/service-azure-and-power-bi) provides analytics and reporting functionality for customers trying to pull greater insight out of their data processing efforts.

### Networking
**Network security groups**: [NSGs](https://docs.microsoft.com/azure/virtual-network/virtual-networks-nsg) are set up to manage traffic directed at deployed resources and services. Network Security Groups are set to a deny-by-default scheme and only permit traffic that is contained in the pre-configured Access Control List (ACL).

Each of the NSGs have specific ports and protocols open so that the solution can work securely and correctly. In addition, the following configurations are enabled for each NSG:
  -	[Diagnostic logs and events](https://docs.microsoft.com/azure/virtual-network/virtual-network-nsg-manage-log) are enabled and stored in a storage account
  -	[Azure Monitor logs](https://docs.microsoft.com/azure/log-analytics/log-analytics-azure-networking-analytics) is connected to the NSG's diagnostic logs.

### Data at rest
The architecture protects data at rest through encryption, database auditing, and other measures.

**Data replication**
Azure Government has two options for [data replication](https://docs.microsoft.com/azure/storage/common/storage-redundancy):
 - The default setting for data replication is **Geo-Redundant Storage (GRS)**, which asynchronously stores customer data in a separate data center outside of the primary region. This ensures recovery of data in a total loss event for the primary data center.
 - **Locally Redundant Storage (LRS)** can alternatively be configured via the Azure Storage Account. LRS replicates data within a storage scale unit, which is hosted in the same region in which the customer creates their account. All data is replicated concurrently, ensuring that no backup data is lost in a primary storage scale unit failure.

**Azure Storage**
To meet encrypted data at rest requirements, all services deployed in this reference architecture leverage [Azure Storage](https://azure.microsoft.com/services/storage/), which stores data with [Storage Service Encryption](https://docs.microsoft.com/azure/storage/storage-service-encryption).

**Azure Disk Encryption**
[Azure Disk Encryption](https://docs.microsoft.com/azure/security/azure-security-disk-encryption) leverages the BitLocker feature of Windows to provide volume encryption for OS and data disks. The solution integrates with Azure Key Vault to help control and manage the disk-encryption keys.

**Azure SQL Database**
The Azure SQL Database instance uses the following database security measures:
-	[AD authentication and authorization](https://docs.microsoft.com/azure/sql-database/sql-database-aad-authentication) enables identity management of database users and other Microsoft services in one central location.
-	[SQL database auditing](https://docs.microsoft.com/azure/sql-database/sql-database-auditing-get-started) tracks database events and writes them to an audit log in an Azure storage account.
-	SQL Database is configured to use [Transparent Data Encryption (TDE)](https://docs.microsoft.com/sql/relational-databases/security/encryption/transparent-data-encryption-azure-sql), which performs real-time encryption and decryption of data and log files to protect information at rest. TDE provides assurance that stored data has not been subject to unauthorized access.
-	[Firewall rules](https://docs.microsoft.com/azure/sql-database/sql-database-firewall-configure) prevent all access to database servers until proper permissions are granted. The firewall grants access to databases based on the originating IP address of each request.
-	[SQL Threat Detection](https://docs.microsoft.com/azure/sql-database/sql-database-threat-detection-get-started) enables the detection and response to potential threats as they occur by providing security alerts for suspicious database activities, potential vulnerabilities, SQL injection attacks, and anomalous database access patterns.
-	[Always Encrypted columns](https://docs.microsoft.com/azure/sql-database/sql-database-always-encrypted-azure-key-vault) ensure that sensitive data never appears as plaintext inside the database system. After enabling data encryption, only client applications or app servers with access to the keys can access plaintext data.
-	[SQL Database dynamic data masking](https://docs.microsoft.com/azure/sql-database/sql-database-dynamic-data-masking-get-started) can be done after the reference architecture deploys. Customers will need to adjust dynamic data masking settings to adhere to their database schema.

### Logging and audit
[Azure Monitor](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-get-started)
generates an all-up display of monitoring data including activity logs, metrics, and diagnostic data, enabling customers to create a complete picture of system health.  
[Azure Monitor logs](https://docs.microsoft.com/azure/security/azure-security-disk-encryption) provides extensive logging of system and user activity, as well as system health. It collects and analyzes data generated by resources in Azure and on-premises environments.
- **Activity Logs**: [Activity logs](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-activity-logs) provide insight into operations performed on resources in a subscription.
- **Diagnostic Logs**: [Diagnostic logs](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs) include all logs emitted by every resource. These logs include Windows event system logs and Azure Blob storage, tables, and queue logs.
- **Firewall Logs**: The Application Gateway provides full diagnostic and access logs. Firewall logs are available for WAF-enabled Application Gateway resources.
- **Log Archiving**: All diagnostic logs write to a centralized and encrypted Azure storage account for archival with a defined retention period of 2 days. These logs connect to Azure Monitor logs for processing, storing, and dashboard reporting.

Additionally, the following monitoring solutions are included as a part of this architecture:
-	[Azure Automation](https://docs.microsoft.com/azure/automation/automation-hybrid-runbook-worker): The Azure Automation solution stores, runs, and manages runbooks.
-	[Security and Audit](https://docs.microsoft.com/azure/operations-management-suite/oms-security-getting-started): The Security and Audit dashboard provides a high-level insight into the security state of resources by providing metrics on security domains, notable issues, detections, threat intelligence, and common security queries.
-	[SQL Assessment](https://docs.microsoft.com/azure/log-analytics/log-analytics-sql-assessment): The SQL Health Check solution assesses the risk and health of server environments on a regular interval and provides customers with a prioritized list of recommendations specific to the deployed server infrastructure.
-	[Azure Activity Logs](https://docs.microsoft.com/azure/log-analytics/log-analytics-activity): The Activity Log Analytics solution assists with analysis of the Azure activity logs across all Azure subscriptions for a customer.

### Identity management
-	Authentication to the application is performed using Azure AD. For more information, see [Integrating applications with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/develop/active-directory-integrating-applications). Additionally, the database column encryption uses Azure AD to authenticate the application to Azure SQL Database. For more information, see how to [protect sensitive data in SQL Database](https://docs.microsoft.com/azure/sql-database/sql-database-always-encrypted-azure-key-vault).
-	[Azure Active Directory Identity Protection](https://docs.microsoft.com/azure/active-directory/active-directory-identityprotection) detects potential vulnerabilities affecting an organization’s identities, configures automated responses to detected suspicious actions related to an organization’s identities, and investigates suspicious incidents to take appropriate action to resolve them.
-	[Azure Role-based Access Control (RBAC)](https://docs.microsoft.com/azure/active-directory/role-based-access-control-configure) enables focused access management for Azure. Subscription access is limited to the subscription administrator.

To learn more about using the security features of Azure SQL Database, see the [Contoso Clinic Demo Application](https://github.com/Microsoft/azure-sql-security-sample) sample.

### Security
**Secrets management**: The solution uses [Azure Key Vault](https://azure.microsoft.com/services/key-vault/) for the management of keys and secrets. Azure Key Vault helps safeguard cryptographic keys and secrets used by cloud applications and services.

## Guidance and recommendations

### ExpressRoute and VPN
[ExpressRoute](https://docs.microsoft.com/azure/expressroute/expressroute-introduction) or a secure VPN tunnel needs to be configured to securely establish a connection to the resources deployed as a part of this data analytics reference architecture. As ExpressRoute connections do not go over the Internet, these connections offer more reliability, faster speeds, lower latencies, and higher security than typical connections over the Internet. By appropriately setting up ExpressRoute or a VPN, customers can add a layer of protection for data in transit.

### Azure Active Directory setup
[Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-whatis) is essential to managing the deployment and provisioning access to personnel interacting with the environment. An existing Windows Server Active Directory can be integrated with AAD in [four clicks](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnect-get-started-express). Customers can also tie the deployed Active Directory infrastructure (domain controllers) to an existing AAD by making the deployed Active Directory infrastructure a subdomain of an AAD forest.

### Additional services
#### IaaS - VM considerations
This PaaS solution does not incorporate any Azure IaaS VMs. A customer could create an Azure VM to run many of these PaaS services. In this case, specific features and services for business continuity and Azure Monitor logs could be leveraged:

##### Business continuity
- **High availability**: Server workloads are grouped in an [Availability Set](https://docs.microsoft.com/azure/virtual-machines/virtual-machines-windows-manage-availability?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) to help ensure high availability of virtual machines in Azure. At least one virtual machine is available during a planned or unplanned maintenance event, meeting the 99.95% Azure SLA.

- **Recovery Services Vault**: The [Recovery Services Vault](https://docs.microsoft.com/azure/backup/backup-azure-recovery-services-vault-overview) houses backup data and protects all configurations of Azure Virtual Machines in this architecture. With a Recovery Services Vault, customers can restore files and folders from an IaaS VM without restoring the entire VM, enabling faster restore times.

##### Monitoring solutions
-	[AD Assessment](https://docs.microsoft.com/azure/log-analytics/log-analytics-ad-assessment): The Active Directory Health Check solution assesses the risk and health of server environments on a regular interval and provides a prioritized list of recommendations specific to the deployed server infrastructure.
-	[Antimalware Assessment](https://docs.microsoft.com/azure/log-analytics/log-analytics-malware): The Antimalware solution reports on malware, threats, and protection status.
-	[Update Management](https://docs.microsoft.com/azure/operations-management-suite/oms-solution-update-management): The Update Management solution allows customer management of operating system security updates, including a status of available updates and the process of installing required updates.
-	[Agent Health](https://docs.microsoft.com/azure/operations-management-suite/oms-solution-agenthealth): The Agent Health solution reports how many agents are deployed and their geographic distribution, as well as how many agents which are unresponsive and the number of agents which are submitting operational data.
-	[Change Tracking](https://docs.microsoft.com/azure/automation/automation-change-tracking): The Change Tracking solution allows customers to easily identify changes in the environment.

##### Security
- **Malware protection**: [Microsoft Antimalware](https://docs.microsoft.com/azure/security/azure-security-antimalware) for Virtual Machines provides real-time protection capability that helps identify and remove viruses, spyware, and other malicious software, with configurable alerts when known malicious or unwanted software attempts to install or run on protected virtual machines.
- **Patch management**: Windows virtual machines deployed as part of this reference architecture are configured by default to receive automatic updates from Windows Update Service. This solution also includes the [Azure Automation](https://docs.microsoft.com/azure/automation/automation-intro) service through which updated deployments can be created to patch virtual machines when needed.

#### Azure Commercial
Although this data analytics architecture is not intended for deployment to the [Azure Commercial](https://azure.microsoft.com/overview/what-is-azure/) environment, similar objectives can be achieved through the services described in this reference architecture, as well as additional services available only in the Azure Commercial environment. Please note that Azure Commercial maintains a FedRAMP JAB P-ATO at the Moderate Impact Level, allowing government agencies and partners to deploy moderately sensitive information to the cloud leveraging the Azure Commercial environment.

Azure Commercial offers a wide variety of analytics services for pulling insights out of large amounts of data:
-	[Azure Machine Learning Studio](https://docs.microsoft.com/azure/machine-learning/studio/what-is-ml-studio), a component of the [Cortana Intelligence Suite](https://azure.microsoft.com/overview/ai-platform/), develops a predictive analysis model from one or more data sources. Statistical functions are used over several iterations to generate an effective model that applications such as Power BI can then consume.
-	[Azure Data Lake Store](https://docs.microsoft.com/azure/data-lake-store/data-lake-store-overview) enables the capture of data of any size, type, and ingestion speed in a single place for operational and exploratory analytics. Azure Data Lake Store is compatible with most open source components in the Hadoop ecosystem and integrates nicely with other Azure services.

## Threat model

The data flow diagram (DFD) for this reference architecture is available for [download](https://aka.ms/blueprintanalyticsthreatmodel) or can be found below:

## Compliance documentation
The [Azure Security and Compliance Blueprint – FedRAMP High Customer Responsibility Matrix](https://aka.ms/blueprinthighcrm) lists all security controls required by the FedRAMP High baseline. Similarly, the [Azure Security and Compliance Blueprint – FedRAMP Moderate Customer Responsibility Matrix](https://aka.ms/blueprintanalyticscimmod) lists all security controls required by the FedRAMP Moderate baseline. Both documents detail whether the implementation of each control is the responsibility of Microsoft, the customer, or shared between the two.

The [Azure Security and Compliance Blueprint - FedRAMP High Control Implementation Matrix](https://aka.ms/blueprintanalyticscimhigh) and the [Azure Security and Compliance Blueprint - FedRAMP Moderate Control Implementation Matrix](https://aka.ms/blueprintanalyticscimmod) provide information on which controls are covered by the analytics architecture for each FedRAMP baseline, including detailed descriptions of how the implementation meets the requirements of each covered control.

## Disclaimer

 - This document is for informational purposes only. MICROSOFT MAKES NO WARRANTIES, EXPRESS, IMPLIED, OR STATUTORY, AS TO THE INFORMATION IN THIS DOCUMENT. This document is provided "as-is." Information and views expressed in this document, including URL and other Internet website references, may change without notice. Customers reading this document bear the risk of using it.
 - This document does not provide customers with any legal rights to any intellectual property in any Microsoft product or solutions.
 - Customers may copy and use this document for internal reference purposes.
 - Certain recommendations in this document may result in increased data, network, or compute resource usage in Azure, and may increase a customer's Azure license or subscription costs.
 - This architecture is intended to serve as a foundation for customers to adjust to their specific requirements and should not be used as-is in a production environment.
 - This document is developed as a reference and should not be used to define all means by which a customer can meet specific compliance requirements and regulations. Customers should seek legal support from their organization on approved customer implementations.
