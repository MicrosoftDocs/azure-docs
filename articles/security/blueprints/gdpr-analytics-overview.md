---
title: Azure Security and Compliance Blueprint - Analytics for GDPR
description: Azure Security and Compliance Blueprint - Analytics for GDPR
services: security
author: jomolesk

ms.assetid: fe97b5e5-72d8-4930-bbe9-ead2b6ef3542
ms.service: security
ms.topic: article
ms.date: 05/14/2018
ms.author: jomolesk
---

# Azure Security and Compliance Blueprint: Analytics for GDPR

## Overview
The General Data Protection Regulation (GDPR) contains many requirements about collecting, storing, and using personal information, including how organizations identify and secure personal data, accommodate transparency requirements, detect and report personal data breaches, and train privacy personnel and other employees. The GDPR gives individuals greater control over their personal data and imposes many new obligations on organizations that collect, handle, or analyze personal data. The GDPR imposes new rules on organizations that offer goods and services to people in the European Union (EU), or that collect and analyze data tied to EU residents. The GDPR applies no matter where an organization is located.

Microsoft designed Azure with industry-leading security measures and privacy policies to safeguard data in the cloud, including the categories of personal data identified by the GDPR. Microsoft's
[contractual terms](http://aka.ms/Online-Services-Terms) commit Microsoft to the requirements of processors.

This Azure Security and Compliance Blueprint provides guidance to deploy a data analytics architecture in Azure that assists with the requirements of the GDPR. This solution demonstrates ways in which customers can meet specific security and compliance requirements and serves as a foundation for customers to build and configure their own data analytics solutions in Azure. Customers can utilize this reference architecture and follow Microsoft's [four-step process](https://aka.ms/gdprebook) in their journey to GDPR compliance:
1. Discover: Identify which personal data exists and where it resides.
2. Manage: Govern how personal data is used and accessed.
3. Protect: Establish security controls to prevent, detect, and respond to vulnerabilities and data breaches.
4. Report: Keep required documentation and manage data requests and breach notifications.

This reference architecture, associated implementation guide, and threat model are intended to serve as a foundation for customers to adapt to their specific requirements and should not be used as-is in a production environment. Please note the following:
- The architecture provides a baseline to help customers deploy workloads to Azure in a GDPR-compliant manner.
- Customers are responsible for conducting appropriate security and compliance assessments of any solution built using this architecture, as requirements may vary based on the specifics of each customer's implementation.

## Architecture diagram and components
This solution provides an analytics platform upon which customers can build their own analytics tools. The reference architecture outlines a generic use case where customers input data either through bulk data imports by the SQL/Data Administrator or through operational data updates via an Operational User. Both work streams incorporate Azure Functions for importing data into Azure SQL Database. Azure Functions must be configured by the customer through the Azure portal to handle the import tasks unique to each customer's own analytics requirements.

Azure offers a variety of reporting and analytics services for the customer; however, this solution incorporates Azure Machine Learning services in conjunction with Azure SQL Database to rapidly browse through data and deliver faster results through smarter modeling of customer data. Azure Machine Learning is a form of machine learning intended to increase query speeds by discovering new relationships between datasets. Once the data has been trained through several statistical functions, up to 7 additional query pools (8 total including the customer server) can be synchronized with the same tabular models to spread query workload and reduce response times.

For enhanced analytics and reporting, Azure SQL databases can be configured with columnstore indexes. Both Azure Machine Learning and Azure SQL databases can be scaled up or down or shut off completely in response to customer usage. All SQL traffic is encrypted with SSL through the inclusion of self-signed certificates. As a best practice, Azure recommends the use of a trusted certificate authority for enhanced security.

Once data is uploaded to the Azure SQL Database and trained by Azure Machine Learning, it is digested by both the Operational User and SQL/Data Admin with Power BI. Power BI displays data intuitively and pulls together information across multiple datasets to draw greater insight. Its high degree of adaptability and easy integration with Azure SQL Database ensures that customers can configure it to handle a wide array of scenarios as required by their business needs.

The entire solution is built upon Azure Storage which customers configure from the Azure portal. Azure Storage encrypts all data with Storage Service Encryption to maintain confidentiality of data at rest. Geographic Redundant Storage (GRS) ensures that an adverse event at the customer's primary data center will not result in a loss of data as a second copy will be stored in a separate location hundreds of miles away.

For enhanced security, this architecture manages resources with Azure Active Directory and Azure Key Vault. System health is monitored through Operations Management Suite (OMS) and Azure Monitor. Customers configure both monitoring services to capture logs and display system health in a single, easily navigable dashboard.

Azure SQL Database is commonly managed through SQL Server Management Studio (SSMS), which runs from a local machine configured to access the Azure SQL Database via a secure VPN or ExpressRoute connection. **Azure recommends configuring a VPN or ExpressRoute connection for management and data import into the reference architecture resource group**.

![Analytics for GDPR reference architecture diagram](images/gdpr-analytics-architecture.png?raw=true "Analytics for GDPR reference architecture diagram")

This solution uses the following Azure services. Details of the deployment architecture are in the [Deployment Architecture](#deployment-architecture) section.

- Azure Functions
- Azure SQL Database
- Azure Machine Learning
- Azure Active Directory
- Azure Key Vault
- Operations Management Suite (OMS)
- Azure Monitor
- Azure Storage
- Power BI Dashboard
- Azure Data Catalog
- Azure Security Center
- Application Insights
- Azure Event Grid
- network security groups

## Deployment architecture
The following section details the deployment and implementation elements.

**Azure Event Grid**
[Azure Event Grid](https://docs.microsoft.com/azure/event-grid/overview) allows customers to easily build applications with event-based architectures. Users select the Azure resource they would like to subscribe to, and give the event handler or webhook an endpoint to send the event to. Customers can secure webhook endpoints by adding query parameters to the webhook URL when creating an Event Subscription. Azure Event Grid only supports HTTPS webhook endpoints. Azure Event Grid allows customers to control the level of access given to different users to do various management operations such as list event subscriptions, create new ones, and generate keys. Event Grid utilizes Azure Role-Based Access Control (RBAC).

**Azure Functions**
[Azure Functions](https://docs.microsoft.com/azure/azure-functions/functions-overview) is a server-less compute service that enables users to run code on-demand without having to explicitly provision or manage infrastructure. Use Azure Functions to run a script or piece of code in response to a variety of events.

**Azure Machine Learning**
[Azure Machine Learning](https://docs.microsoft.com/azure/machine-learning/preview/) is a data science technique that allows computers to use existing data to forecast future behaviors, outcomes, and trends.

**Azure Data Catalog**:
[Data Catalog](https://docs.microsoft.com/azure/data-catalog/data-catalog-what-is-data-catalog) makes data sources easily discoverable and understandable by the users who manage the data. Common data sources can be registered, tagged, and searched for personal data. The data remains in its existing location, but a copy of its metadata is added to Data Catalog, along with a reference to the data source location. The metadata is also indexed to make each data source easily discoverable via search and understandable to the users who discover it.

### Virtual network
This reference architecture defines a private VNet with an address space of 10.0.0.0/16.

**Network security groups**: [NSGs](https://docs.microsoft.com/azure/virtual-network/virtual-networks-nsg) contain Access Control Lists (ACLs) that allow or deny traffic within a VNet. NSGs can be used to secure traffic at a subnet or individual VM level. The following NSGs exist:
  -	An NSG for Active Directory
  - An NSG for the workload

Each of the NSGs have specific ports and protocols open so that the solution can work securely and correctly. In addition, the following configurations are enabled for each NSG:
  -	[Diagnostic logs and events](https://docs.microsoft.com/azure/virtual-network/virtual-network-nsg-manage-log) are enabled and stored in a storage account
  -	OMS Log Analytics is connected to the [NSG's diagnostics](https://github.com/krnese/AzureDeploy/blob/master/AzureMgmt/AzureMonitor/nsgWithDiagnostics.json)

**Subnets**: Each subnet is associated with its corresponding NSG.

### Data in transit
Azure encrypts all communications to and from Azure datacenters by default. All transactions to Azure Storage through the Azure portal occur via HTTPS.

### Data at rest

The architecture protects data at rest through encryption, database auditing, and other measures.

**Azure Storage**
To meet encrypted data at rest requirements, all [Azure Storage](https://azure.microsoft.com/services/storage/) uses [Storage Service Encryption](https://docs.microsoft.com/azure/storage/storage-service-encryption). This helps protect and safeguard personal data in support of organizational security commitments and compliance requirements defined by the GDPR.

**Azure Disk Encryption**
[Azure Disk Encryption](https://docs.microsoft.com/azure/security/azure-security-disk-encryption) leverages the BitLocker feature of Windows to provide volume encryption for data disks. The solution integrates with Azure Key Vault to help control and manage the disk-encryption keys.

**Azure SQL Database**:
The Azure SQL Database instance uses the following database security measures:
-	[AD authentication and authorization](https://docs.microsoft.com/azure/sql-database/sql-database-aad-authentication) enables identity management of database users and other Microsoft services in one central location.
-	[SQL database auditing](https://docs.microsoft.com/azure/sql-database/sql-database-auditing-get-started) tracks database events and writes them to an audit log in an Azure storage account.
-	Azure SQL Database is configured to use [Transparent Data Encryption (TDE)](https://docs.microsoft.com/sql/relational-databases/security/encryption/transparent-data-encryption-azure-sql), which performs real-time encryption and decryption of the database, associated backups, and transaction log files to protect information at rest. TDE provides assurance that stored personal data has not been subject to unauthorized access.
-	[Firewall rules](https://docs.microsoft.com/azure/sql-database/sql-database-firewall-configure) prevent all access to database servers until proper permissions are granted. The firewall grants access to databases based on the originating IP address of each request.
-	[SQL Threat Detection](https://docs.microsoft.com/azure/sql-database/sql-database-threat-detection-get-started) enables the detection and response to potential threats as they occur by providing security alerts for suspicious database activities, potential vulnerabilities, SQL injection attacks, and anomalous database access patterns.
-	[Always Encrypted Columns](https://docs.microsoft.com/azure/sql-database/sql-database-always-encrypted-azure-key-vault) ensure that sensitive personal data never appears as plaintext inside the database system. After enabling data encryption, only client applications or application servers with access to the keys can access plaintext data.
- [Extended Properties](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-addextendedproperty-transact-sql) can be used to discontinue the processing of data subjects, as it allows users to add custom properties to database objects and tag data as "Discontinued" to support application logic to prevent the processing of associated personal data.
- [Row-Level Security](https://docs.microsoft.com/sql/relational-databases/security/row-level-security) enables users to define policies to restrict access to data to discontinue processing.
- [SQL Dynamic Data Masking (DDM)](https://docs.microsoft.com/azure/sql-database/sql-database-dynamic-data-masking-get-started) limits sensitive personal data exposure by masking the data to non-privileged users or applications. DDM can automatically discover potentially sensitive data and suggest the appropriate masks to be applied. This helps with the identification of personal data qualifying for GDPR protection, and for reducing access such that it does not exit the database via unauthorized access. **Note: Customers will need to adjust DDM settings to adhere to their database schema.**

### Identity management
The following technologies provide capabilities to manage access to personal data in the Azure environment:
-	[Azure Active Directory (AAD)](https://azure.microsoft.com/services/active-directory/) is Microsoft's multi-tenant cloud-based directory and identity management service. All users for this solution are created in AAD, including users accessing Azure SQL Database.
-	Authentication to the application is performed using AAD. For more information, see [Integrating applications with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/develop/active-directory-integrating-applications). Additionally, the database column encryption uses AAD to authenticate the application to Azure SQL Database. For more information, see how to [protect sensitive data in SQL Database](https://docs.microsoft.com/azure/sql-database/sql-database-always-encrypted-azure-key-vault).
-	[Azure Role-Based Access Control (RBAC)](https://docs.microsoft.com/azure/active-directory/role-based-access-control-configure) enables administrators to define fine-grained access permissions to grant only the amount of access that users need to perform their jobs. Instead of giving every user unrestricted permissions for Azure resources, administrators can allow only certain actions for accessing personal data. Subscription access is limited to the subscription administrator.
- [AAD Privileged Identity Management (PIM)](https://docs.microsoft.com/azure/active-directory/active-directory-privileged-identity-management-getting-started) enables customers to minimize the number of users who have access to certain information such as personal data.  Administrators can use AAD Privileged Identity Management to discover, restrict, and monitor privileged identities and their access to resources. This functionality can also be used to enforce on-demand, just-in-time administrative access when needed.
-	[AAD Identity Protection](https://docs.microsoft.com/azure/active-directory/active-directory-identityprotection) detects potential vulnerabilities affecting an organization’s identities, configures automated responses to detected suspicious actions related to an organization’s identities, and investigates suspicious incidents to take appropriate action to resolve them.

### Security
**Secrets management**
The solution uses [Azure Key Vault](https://azure.microsoft.com/services/key-vault/) for the management of keys and secrets. Azure Key Vault helps safeguard cryptographic keys and secrets used by cloud applications and services. The following Azure Key Vault capabilities help customers protect personal data and access to such data:
- Advanced access policies are configured on a need basis.
- Key Vault access policies are defined with minimum required permissions to keys and secrets.
- All keys and secrets in Key Vault have expiration dates.
- All keys in Key Vault are protected by specialized hardware security modules (HSMs). The key type is an HSM Protected 2048-bit RSA Key.
- All users and identities are granted minimum required permissions using RBAC.
- Diagnostics logs for Key Vault are enabled with a retention period of at least 365 days.
- Permitted cryptographic operations for keys are restricted to the ones required.

**Security alerts**: [Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-intro) enables customers to monitor traffic, collect logs, and analyze data sources for threats. Additionally, Azure Security Center accesses existing configuration of Azure services to provide configuration and service recommendations to help improve security posture and protect personal data. Azure Security Center includes a [threat intelligence report](https://docs.microsoft.com/azure/security-center/security-center-threat-report) for each detected threat to assist incident response teams investigate and remediate threats.

### Logging and auditing

[Operations Management Suite (OMS)](https://docs.microsoft.com/azure/security/azure-security-disk-encryption) provides extensive logging of system and user activity, as well as system health. The OMS [Log Analytics](https://azure.microsoft.com/services/log-analytics/) solution collects and analyzes data generated by resources in Azure and on-premises environments.
- **Activity logs**: [Activity logs](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-activity-logs) provide insight into operations performed on resources in a subscription. Activity logs can help determine an operation's initiator, time of occurrence, and status.
- **Diagnostic logs**: [Diagnostic logs](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs) include all logs emitted by every resource. These logs include Windows event system logs and Azure Blob storage, tables, and queue logs.
- **Log archiving**: All diagnostic logs write to a centralized and encrypted Azure storage account for archival with a defined retention period of 2 days. These logs connect to Azure Log Analytics for processing, storing, and dashboard reporting.

Additionally, the following OMS solutions are included as a part of this architecture:
-	[AD Assessment](https://docs.microsoft.com/azure/log-analytics/log-analytics-ad-assessment): The Active Directory Health Check solution assesses the risk and health of server environments on a regular interval and provides a prioritized list of recommendations specific to the deployed server infrastructure.
-	[Antimalware Assessment](https://docs.microsoft.com/azure/log-analytics/log-analytics-malware): The Antimalware solution reports on malware, threats, and protection status.
-	[Azure Automation](https://docs.microsoft.com/azure/automation/automation-hybrid-runbook-worker): The Azure Automation solution stores, runs, and manages runbooks.
-	[Security and Audit](https://docs.microsoft.com/azure/operations-management-suite/oms-security-getting-started): The Security and Audit dashboard provides a high-level insight into the security state of resources by providing metrics on security domains, notable issues, detections, threat intelligence, and common security queries.
-	[SQL Assessment](https://docs.microsoft.com/azure/log-analytics/log-analytics-sql-assessment): The SQL Health Check solution assesses the risk and health of server environments on a regular interval and provides customers with a prioritized list of recommendations specific to the deployed server infrastructure.
-	[Update Management](https://docs.microsoft.com/azure/operations-management-suite/oms-solution-update-management): The Update Management solution allows customer management of operating system security updates, including a status of available updates and the process of installing required updates.
-	[Agent Health](https://docs.microsoft.com/azure/operations-management-suite/oms-solution-agenthealth): The Agent Health solution reports how many agents are deployed and their geographic distribution, as well as how many agents which are unresponsive and the number of agents which are submitting operational data.
-	[Azure Activity Logs](https://docs.microsoft.com/azure/log-analytics/log-analytics-activity): The Activity Log Analytics solution assists with analysis of the Azure activity logs across all Azure subscriptions for a customer.
-	[Change Tracking](https://docs.microsoft.com/azure/automation/automation-change-tracking): The Change Tracking solution allows customers to easily identify changes in the environment.

**Azure Monitor**
[Azure Monitor](https://docs.microsoft.com/azure/monitoring-and-diagnostics/) helps customers track performance, maintain security, and identify trends by enabling organizations to audit, create alerts, and archive data, including tracking API calls in customers' Azure resources.

**Application Insights**
[Application Insights](https://docs.microsoft.com/azure/application-insights/) is an extensible Application Performance Management (APM) service for web developers on multiple platforms. Use it to monitor live web application. It detects performance anomalies and includes powerful analytics tools to help diagnose issues and to understand what users actually do with the app. It's designed to help users continuously improve performance and usability.

## Threat model

The data flow diagram for this reference architecture is available for [download](https://aka.ms/gdprAnalyticsdfd) or can be found below. This model can help customers understand the points of potential risk in the system infrastructure when making modifications.

![Analytics for GDPR threat model](images/gdpr-analytics-threat-model.png?raw=true "Analytics for GDPR threat model")

## Compliance documentation
The [Azure Security and Compliance Blueprint – GDPR Customer Responsibility Matrix](https://aka.ms/gdprCRM) lists controller and processor responsibilities for all GDPR articles. Please note that for Azure services, a customer is usually the controller and Microsoft acts as the processor.

The [Azure Security and Compliance Blueprint - GDPR Data Analytics Implementation Matrix](https://aka.ms/gdprAnalytics) provides information on which GDPR articles are addressed by the data analytics architecture, including detailed descriptions of how the implementation meets the requirements of each covered article.


## Guidance and recommendations
### VPN and ExpressRoute
A secure VPN tunnel or [ExpressRoute](https://docs.microsoft.com/azure/expressroute/expressroute-introduction) needs to be configured to securely establish a connection to the resources deployed as a part of this data analytics reference architecture. By appropriately setting up a VPN or ExpressRoute, customers can add a layer of protection for data in transit.

By implementing a secure VPN tunnel with Azure, a virtual private connection between an on-premises network and an Azure Virtual Network can be created. This connection takes place over the Internet and allows customers to securely “tunnel” information inside an encrypted link between the customer's network and Azure. Site-to-Site VPN is a secure, mature technology that has been deployed by enterprises of all sizes for decades. The [IPsec tunnel mode](https://docs.microsoft.com/previous-versions/windows/it-pro/windows-server-2003/cc786385(v=ws.10)) is used in this option as an encryption mechanism.

Because traffic within the VPN tunnel does traverse the Internet with a site-to-site VPN, Microsoft offers another, even more secure connection option. Azure ExpressRoute is a dedicated WAN link between Azure and an on-premises location or an Exchange hosting provider. As ExpressRoute connections do not go over the Internet, these connections offer more reliability, faster speeds, lower latencies, and higher security than typical connections over the Internet. Furthermore, because this is a direct connection of customer's telecommunication provider, the data does not travel over the Internet and therefore is not exposed to it.

Best practices for implementing a secure hybrid network that extends an on-premises network to Azure are [available](https://docs.microsoft.com/azure/architecture/reference-architectures/dmz/secure-vnet-hybrid).

### Extract-Transform-Load (ETL) process
[PolyBase](https://docs.microsoft.com/sql/relational-databases/polybase/polybase-guide) can load data into Azure SQL Database without the need for a separate ETL or import tool. PolyBase allows access to data through T-SQL queries. Microsoft's business intelligence and analysis stack, as well as third-party tools compatible with SQL Server, can be used with PolyBase.

### Azure Active Directory setup
[Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-whatis) is essential to managing the deployment and provisioning access to personnel interacting with the environment. An existing Windows Server Active Directory can be integrated with AAD in [four clicks](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnect-get-started-express). Customers can also tie the deployed Active Directory infrastructure (domain controllers) to an existing AAD by making the deployed Active Directory infrastructure a subdomain of an AAD forest.

## Disclaimer

 - This document is for informational purposes only. MICROSOFT MAKES NO WARRANTIES, EXPRESS, IMPLIED, OR STATUTORY, AS TO THE INFORMATION IN THIS DOCUMENT. This document is provided "as-is." Information and views expressed in this document, including URL and other Internet website references, may change without notice. Customers reading this document bear the risk of using it.
 - This document does not provide customers with any legal rights to any intellectual property in any Microsoft product or solutions.
 - Customers may copy and use this document for internal reference purposes.
 - Certain recommendations in this document may result in increased data, network, or compute resource usage in Azure, and may increase a customer's Azure license or subscription costs.
 - This architecture is intended to serve as a foundation for customers to adjust to their specific requirements and should not be used as-is in a production environment.
 - This document is developed as a reference and should not be used to define all means by which a customer can meet specific compliance requirements and regulations. Customers should seek legal support from their organization on approved customer implementations.
