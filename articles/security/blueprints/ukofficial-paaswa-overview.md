---
title: Azure Security and Compliance Blueprint - PaaS Web Application Hosting for UK OFFICIAL Workloads
description: Azure Security and Compliance Blueprint - PaaS Web Application Hosting for UK OFFICIAL Workloads
services: security
author: jomolesk

ms.assetid: 446105ad-a863-44f5-a964-6ead1dac4787
ms.service: security
ms.topic: article
ms.date: 07/13/2018
ms.author: jomolesk
---
# Azure Security and Compliance Blueprint: PaaS Web Application Hosting for UK OFFICIAL Workloads

## Azure Security and Compliance Blueprints

Azure Blueprints consist of guidance documents and automation templates that deploy cloud-based architectures to offer solutions to scenarios that have accreditation or compliance requirements. Azure Blueprints are guidance and automation template collections that allow Microsoft Azure customers to accelerate delivery of their business goals through provisioning a foundation architecture that can be extended to meet any further requirements.

## Overview

This Azure Security and Compliance Blueprint provides guidance and automation scripts to deliver a Microsoft Azure [platform as a service (PaaS)](https://azure.microsoft.com/overview/what-is-paas/) hosted web application architecture appropriate for handling workloads classified as [UK OFFICIAL](https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/715778/May-2018_Government-Security-Classifications-2.pdf). This security classification encompasses the majority of information created or processed by the public sector. This includes routine business operations and services, which if lost, stolen, or published in the media, some of which could have damaging consequences. The typical threat profile for the OFFICIAL classification is much the same as a private business who provides valuable information and services. UK OFFICIAL anticipates the need to defend UK Government data or services against threat or compromise by attackers with bounded capabilities and resources such as (but is not limited to) hactivists, single-issue pressure groups, investigative journalists, competent individual hackers, and the majority of criminal individuals and groups.

This blueprint has been reviewed by the UK National Cyber Security Centre (NCSC) and aligns to the NCSC 14 Cloud Security Principles.

The architecture uses Azure [platform as a service](https://azure.microsoft.com/overview/what-is-paas/) components to deliver an environment that allows customers to avoid the expense and complexity of buying software licenses, of managing the underlying application infrastructure and middleware or the development tools, and other resources. Customers manage the applications and services that they develop, focusing on delivering business value, whilst Microsoft Azure manages the other Azure resources such as virtual machines, storage and networking, putting more of the [division of responsibility](https://docs.microsoft.com/azure/security/security-paas-deployments#division-of-responsibility) for infrastructure management on to the Azure platform. [Azure App Services](https://azure.microsoft.com/services/app-service/) offers auto-scaling, high availability, supports Windows and Linux, and enables automated deployments from GitHub, Azure DevOps, or any Git repository as default services. Through using App Services, developers can concentrate on delivering business value without the overhead of managing infrastructure. It is possible to build greenfield new Java, PHP, Node.js, Python, HTML or C# web applications or also to migrate existing cloud or on premises web applications to Azure App Services (although thorough due diligence and testing to confirm performance is required).

This blueprint focuses on the provisioning of a secure foundation [platform as a service](https://azure.microsoft.com/overview/what-is-paas/) web-based interface for public and also back-office users. This blueprint design scenario considers the use of Azure hosted web-based services where a public user can securely submit, view, and manage sensitive data; also that a back office or government operator can securely process the sensitive data that the public user has submitted. Use cases for this scenario could include:

- A user submitting a tax return, with a government operator processing the submission;
- A user requesting a service through a web-based application, with a back-office user validating and delivering the service; or
- A user seeking and viewing public domain help information concerning a government service.

Using [Azure Resource Manager](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview) templates and Azure Command Line Interface scripts, the blueprint deploys an environment that aligns to the UK National Cyber Security Centre (NCSC) 14 [Cloud Security Principles](https://www.ncsc.gov.uk/guidance/implementing-cloud-security-principles) and the Center for Internet Security (CIS) [Critical Security Controls](https://www.cisecurity.org/critical-controls.cfm). The NCSC recommends their Cloud Security Principles be used by customers to evaluate the security properties of the service and to help understand the division of responsibility between the customer and supplier. Microsoft has provided information against each of these principles to help better understand the split of responsibilities. This architecture and corresponding Azure Resource Manager templates are supported by the Microsoft whitepaper, [14 Cloud Security Controls for UK cloud Using Microsoft Azure](https://gallery.technet.microsoft.com/14-Cloud-Security-Controls-670292c1). This architecture has been reviewed by the NCSC, and aligns with the UK NCSC 14 Cloud Security Principles, thus enabling public sector organizations to fast-track their ability to meet compliance obligations using cloud-based services globally and in the UK on the Microsoft Azure cloud. This template deploys the infrastructure for the workload. Application code and supporting business tier and data tier software must be installed and configured by customers. Detailed deployment instructions are available [here](https://aka.ms/ukofficial-paaswa-repo/).

This blueprint is a foundation architecture. Our customers can use this blueprint as a foundation for their OFFICIAL classification web-based workloads and expand on the templates and resources with their own requirements. This blueprint builds on the principles of the [UK-OFFICAL Three-Tier IaaS Web Applications blueprint](https://aka.ms/ukofficial-iaaswa) to offer our customers both [infrastructure as a service (IaaS)](https://azure.microsoft.com/overview/what-is-iaas/) and PaaS implementation choices for hosting web-based workloads.

To deploy this blueprint, an Azure subscription is required. If you do not have an Azure subscription, you can sign up quickly and easily at no charge: Get Started with Azure. Click [here](https://aka.ms/ukofficial-paaswa-repo/) for deployment instructions.

## Architecture and components

This blueprint delivers a web application hosting solution in an Azure cloud environment that supports UK OFFICIAL workloads. The architecture delivers a secure environment that leverages Azure platform as a service capabilities. Within the environment, two App Service web apps are deployed (one for public users and one for back-office users), with an API App tier to provide the business services for the web front end. An Azure SQL Database is deployed as a managed relational data store for the application. Connectivity to these components from outside the platform and between all these components is encrypted through TLS 1.2 to ensure data in transport privacy, with access authenticated by Azure Active Directory.

![PaaS Web Application Hosting for UK OFFICIAL Workloads reference architecture diagram](images/ukofficial-paaswa-architecture.png?raw=true "PaaS Web Application Hosting for UK OFFICIAL Workloads reference architecture diagram")

As part of the deployment architecture, secure storage provision, monitoring & logging, unified security management & advanced threat protection, and management capabilities are also deployed to ensure that customers have all the tools required to secure and monitor their environment for this solution.

This solution uses the following Azure services. Details of the deployment architecture are in the [deployment architecture](#deployment-architecture) section.

- Azure Active Directory
- App Service
- Web App
- API App
- Azure DNS
- Key Vault
- Azure Monitor (logs)
- Application Insights
- Azure Resource Manager
- Azure Security Center
- Azure SQL Database
- Azure Storage

## Deployment architecture

The following section details the deployment and implementation elements.

### Security

#### Identity and authentication

This blueprint ensures that access to resources is protected through directory and identity management services. This architecture makes full use of [identity as the security perimeter](https://docs.microsoft.com/azure/security/security-paas-deployments). 

The following technologies provide identity management capabilities in the Azure environment:

- [Azure Active Directory (Azure AD)](https://azure.microsoft.com/services/active-directory/) is Microsoft's multi-tenant cloud-based directory and identity management service. All users for the solution were created in Azure Active Directory, including users accessing the SQL Database.
- Authentication to the operator facing web application and access for the administration of the Azure resources is performed using Azure AD. For more information, see [Integrating applications with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/develop/active-directory-integrating-applications).
- Database column encryption uses Azure AD to authenticate the application to Azure SQL Database. For more information, see [Always Encrypted: Protect sensitive data in SQL Database](https://docs.microsoft.com/azure/sql-database/sql-database-always-encrypted-azure-key-vault).
- The citizen facing web application is configured for public access. To allow for account creation and authentication through active directory or social network identity providers [Azure Active Directory B2C](https://azure.microsoft.com/services/active-directory-b2c/) can be integrated if required.
- [Azure Active Directory Identity Protection](https://docs.microsoft.com/azure/active-directory/active-directory-identityprotection) detects potential vulnerabilities and risky accounts provides recommendations to enhance the security posture of your organization’s identities, configures automated responses to detected suspicious actions related to your organization’s identities, and investigates suspicious incidents and takes appropriate action to resolve them.
- [Azure Role-based Access Control (RBAC)](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-portal) enables precisely focused access management for Azure. Subscription access is limited to the subscription administrator, and Azure Key Vault access is restricted only to users who require key management access.
- Through leveraging [Azure Active Directory Conditional Access](https://docs.microsoft.com/azure/active-directory/active-directory-conditional-access-azure-portal) customers can enforce additional security controls on access to apps or users in their environment based on specific conditions such as location, device, state and sign in risk.
- [Azure DDoS Protection](https://docs.microsoft.com/azure/security/security-paas-deployments#security-advantages-of-a-paas-cloud-service-model) combined with application design best practices, provides defense against DDoS attacks, with always-on traffic monitoring, and real-time mitigation of common network-level attacks. With a PaaS architecture, platform level DDoS protection is transparent to the customer and incorporated into the platform but it is important to note that the application security design responsibility lies with the customer.

#### Data in transit

Data is transit from outside and between Azure components is protected using [Transport Layer Security/Secure Sockets Layer (TLS/SSL)](https://www.microsoft.com/TrustCenter/Security/Encryption), which uses symmetric cryptography based on a shared secret to encrypt communications as they travel over the network. By default, network traffic is secured using TLS 1.2.

#### Security and malware protection

[Azure Security Center](https://azure.microsoft.com/services/security-center/) provides a centralized view of the security state of all your Azure resources. At a glance, you can verify that the appropriate security controls are in place and configured correctly, and you can quickly identify any resources that require attention.

[Azure Advisor](https://docs.microsoft.com/azure/advisor/advisor-overview) is a personalized cloud consultant that helps you follow best practices to optimize your Azure deployments. It analyzes your resource configuration and usage telemetry and then recommends solutions that can help you improve the cost effectiveness, performance, high availability, and security of your Azure resources.

[Microsoft Antimalware](https://docs.microsoft.com/azure/security/azure-security-antimalware) is a real-time protection capability that helps identify and remove viruses, spyware, and other malicious software. This by default is installed on the underlying PaaS virtual machine infrastructure and is managed by the Azure fabric transparently to the customer.

### PaaS services in this blueprint

#### Azure App Service

Azure App Service provides a fully managed web hosting environment for web application developed in Java, PHP, Node.js Python, HTML and C# without having to manage infrastructure. It offers auto-scaling and high availability, supports both Windows and Linux, and enables automated deployments from [Azure DevOps](https://azure.microsoft.com/services/visual-studio-team-services/) or any Git-based repo.

App Service is [ISO, SOC, and PCI compliant](https://www.microsoft.com/TrustCenter/) and can authenticate users with [Azure Active Directory](https://docs.microsoft.com/azure/app-service/configure-authentication-provider-aad) or with social login ([Google](https://docs.microsoft.com/azure/app-service/configure-authentication-provider-google), [Facebook](https://docs.microsoft.com/azure/app-service/configure-authentication-provider-facebook), [Twitter](https://docs.microsoft.com/azure/app-service/configure-authentication-provider-twitter), and [Microsoft authentication](https://docs.microsoft.com/azure/app-service/configure-authentication-provider-microsoft).

Basic, Standard, and Premium plans are for production workloads and run on dedicated Virtual Machine instances. Each instance can support multiple applications and domains. App services also support [IP address restrictions](https://docs.microsoft.com/azure/app-service/app-service-ip-restrictions) to secure traffic to trusted IP addresses if required and also [managed identities for Azure resources](https://docs.microsoft.com/azure/app-service/overview-managed-identity) for secure connection to other PaaS services such as [Key Vault](https://azure.microsoft.com/services/key-vault/) and [Azure SQL Database](https://azure.microsoft.com/services/sql-database/). Where additional security is required our Isolated plan hosts your apps in a private, dedicated Azure environment and is ideal for apps that require secure connections with your on-premises network, or additional performance and scale.

This template deploys the following App Service features:

- [Standard](https://docs.microsoft.com/azure/app-service/overview-hosting-plans) App Service Plan Tier
- Multiple App Service [deployment slots](https://docs.microsoft.com/azure/app-service/deploy-staging-slots): Dev, Preview, QA, UAT and of course Production (default slot).
- [Managed identities for Azure resources](https://docs.microsoft.com/azure/app-service/overview-managed-identity) to connect to [Azure Key Vault](https://azure.microsoft.com/services/key-vault/) (this could also be used to provide access to [Azure SQL Database](https://azure.microsoft.com/services/sql-database/) 
- Integration with [Azure Application Insights](https://docs.microsoft.com/azure/application-insights/app-insights-azure-web-apps) to monitor performance
- [Diagnostic Logs](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs) 
- Metric [alerts](https://docs.microsoft.com/azure/application-insights/app-insights-alerts) 
- [Azure API Apps](https://azure.microsoft.com/services/app-service/api/) 

#### Azure SQL Database

SQL Database is a general-purpose relational database managed service in Microsoft Azure that supports structures such as relational data, JSON, spatial, and XML. SQL Database offers managed single SQL databases, managed SQL databases in an [elastic pool](https://docs.microsoft.com/azure/sql-database/sql-database-elastic-pool), and SQL [Managed Instances](https://docs.microsoft.com/azure/sql-database/sql-database-managed-instance) (in public preview). It delivers [dynamically scalable performance](https://docs.microsoft.com/azure/sql-database/sql-database-service-tiers) and provides options such as [columnstore indexes](https://docs.microsoft.com/sql/relational-databases/indexes/columnstore-indexes-overview) for extreme analytic analysis and reporting, and [in-memory OLTP](https://docs.microsoft.com/azure/sql-database/sql-database-in-memory) for extreme transactional processing. Microsoft handles all patching and updating of the SQL code base seamlessly and abstracts away all management of the underlying infrastructure.

Azure SQL Database in this blueprint

The Azure SQL Database instance uses the following database security measures:

- [Server-level and database-level firewall rules](https://docs.microsoft.com/azure/sql-database/sql-database-firewall-configure), or through [Virtual Network Service Endpoints](https://docs.microsoft.com/azure/virtual-network/virtual-network-service-endpoints-overview) using [virtual network rules](https://docs.microsoft.com/azure/sql-database/sql-database-vnet-service-endpoint-rule-overview).
- [Transparent data encryption](https://docs.microsoft.com/sql/relational-databases/security/encryption/transparent-data-encryption-azure-sql) helps protect Azure SQL Database and Azure Data Warehouse against the threat of malicious activity. It performs real-time encryption and decryption of the database, associated backups, and transaction log files at rest without requiring changes to the application.
- [Azure AD authentication](https://docs.microsoft.com/azure/sql-database/sql-database-aad-authentication), you can centrally manage the identities of database users and other Microsoft services in one central location. Central ID management provides a single place to manage database users and simplifies permission management.
- Use of Azure Active Directory for database administration
- [Audit logs](https://docs.microsoft.com/azure/sql-database/sql-database-auditing) to storage accounts
- Metric [alerts](https://docs.microsoft.com/azure/application-insights/app-insights-alerts) for failed DB connections
- [SQL Threat Detection](https://docs.microsoft.com/azure/sql-database/sql-database-threat-detection)
- [Always Encrypted columns](https://docs.microsoft.com/azure/sql-database/sql-database-always-encrypted-azure-key-vault)

### Azure Storage

Microsoft [Azure Storage](https://azure.microsoft.com/services/storage/) is a Microsoft-managed cloud service that provides storage that is highly available, secure, durable, scalable, and redundant. Azure Storage consists of Blob storage, File Storage, and Queue storage.

#### Azure Storage in this blueprint

This template uses the following Azure Storage components:

- [Storage Service Encryption](https://docs.microsoft.com/azure/storage/common/storage-service-encryption) 
- Only allow HTTPS connections

#### Data at rest

Through [Storage Service Encryption](https://docs.microsoft.com/azure/storage/common/storage-service-encryption) all data written to Azure Storage is encrypted through 256-bit AES encryption, one of the strongest block ciphers available. You can use Microsoft-managed encryption keys with SSE or you can use [your own encryption keys](https://docs.microsoft.com/azure/storage/common/storage-service-encryption-customer-managed-keys).

Storage accounts can be secured via [Virtual Network Service Endpoints](https://docs.microsoft.com/azure/virtual-network/virtual-network-service-endpoints-overview) using [virtual network rules](https://docs.microsoft.com/azure/storage/common/storage-network-security).

Detailed information about securing Azure Storage can be found in the [security guide](https://docs.microsoft.com/azure/storage/common/storage-security-guide).


### Secrets management

#### Azure Key Vault

[Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-overview) is used to secure application keys and secrets to ensure that they are not accessible by third parties. Key Vault is not intended to be used as a store for user passwords. It allows you to create multiple secure containers, called vaults. These vaults are backed by hardware security modules (HSMs). Vaults help reduce the chances of accidental loss of security information by centralizing the storage of application secrets. Key Vaults also control and log the access to anything stored in them. Azure Key Vault can handle requesting and renewing Transport Layer Security (TLS) certificates, providing the features required for a robust certificate lifecycle management solution.

#### Azure Key Vault in this blueprint

- Holds the Storage access key, with read access granted to the [managed identity](https://docs.microsoft.com/azure/app-service/overview-managed-identity) of the Customer facing web app
- Holds the SQL Server DBA Password (in a separate vault)
- Diagnostics logging

### Monitoring, logging, and audit

#### Azure Monitor logs

[Azure Monitor logs](https://azure.microsoft.com/services/log-analytics/) is a service in Azure that helps you collect and analyze data generated by resources in your cloud and on-premises environments.

#### Azure Monitor logs in this blueprint

- SQL Assessment
- Key Vault diagnostics
- Application Insights connection
- Azure Activity Log

#### Application Insights

[Application Insights](https://docs.microsoft.com/azure/application-insights/app-insights-overview) is an extensible Application Performance Management (APM) service for web developers on multiple platforms. Used to monitor live web applications it will automatically detect performance anomalies, analyze performance, diagnose issues and to understand how users interact with the app. Application Insights can be deployed on platforms including .NET, Node.js and Java EE, hosted on-premises or in the cloud. It integrates with your DevOps process, and has connection points to a variety of development tools.

#### Application Insights in this blueprint

This template uses the following Application Insights components:

- Application Insights dashboard per site (Operator, Customer and API)

#### Azure Activity Logs

[Azure Activity Log](https://docs.microsoft.com/azure/azure-monitor/platform/activity-logs-overview) audits control-plane events for your subscriptions. Using the Activity Log, you can determine the 'what, who, and when' for any write operations (PUT, POST, DELETE) taken on the resources in your subscription. You can also understand the status of the operation and other relevant properties.

#### Azure Monitor

[Azure Monitor](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-azure-monitor) enables core monitoring for Azure services by allowing the collection of metrics, activity logs, and diagnostic logs. Azure Monitor provides base-level infrastructure metrics and logs for most services in Microsoft Azure.

## Threat model

The data flow diagram for this reference architecture is available for [download](https://aka.ms/ukofficial-paaswa-tm) or can be found below. This model can help customers understand the points of potential risk in the system infrastructure when making modifications.

![PaaS Web Application Hosting for UK OFFICIAL Workloads threat model](images/ukofficial-paaswa-threat-model.png?raw=true "PaaS Web Application Hosting for UK OFFICIAL Workloads threat model")

## NCSC Cloud Security Principles compliance documentation

The Crown Commercial Service (an agency that works to improve commercial and procurement activity by the government) renewed the classification of Microsoft in-scope enterprise cloud services to G-Cloud v6, covering all its offerings at the OFFICIAL level. Details of Azure and G-Cloud can be found in the [Azure UK G-Cloud security assessment summary](https://www.microsoft.com/trustcenter/compliance/uk-g-cloud).

This blueprint aligns to the 14 cloud security principles that are documented in the NCSC [Cloud Security Principles](https://www.ncsc.gov.uk/guidance/implementing-cloud-security-principles) to help ensure an environment that supports workloads classified as UK OFFICIAL.

The [Azure Security and Compliance Blueprint - UK OFFICIAL Customer Responsibility Matrix](https://aka.ms/ukofficial-crm) (Excel Workbook) lists all 14 cloud security principles and denotes, for each principle (or principle subpart), whether the principle implementation is the responsibility of Microsoft, the customer, or shared between the two.

The [Azure Security and Compliance Blueprint - PaaS Web Application for UK OFFICIAL Principle Implementation Matrix](https://aka.ms/ukofficial-paaswa-pim) (Excel Workbook) lists all 14 cloud security principles and denotes, for each principle (or principle subpart) that is designated a customer responsibility in the Customer Responsibilities Matrix, 1) if the blueprint implements the principle, and 2) a description of how the implementation aligns with the principle requirement(s).  

Furthermore, the Cloud Security Alliance (CSA) published the Cloud Control Matrix to support customers in the evaluation of cloud providers and to identify questions that should be answered before moving to cloud services. In response, Microsoft Azure answered the CSA Consensus Assessment Initiative Questionnaire ([CSA CAIQ](https://www.microsoft.com/TrustCenter/Compliance/CSA)), which describes how Microsoft addresses the suggested principles.

## Third-party assessment

This blueprint has been reviewed by the UK National Cyber Security Centre (NCSC) and aligns to the NCSC 14 Cloud Security Principles

The automation templates have been tested by the UK Customer Success Unit Azure Cloud Solution Architect team and by our Microsoft partner, [Ampliphae](https://www.ampliphae.com/).


## Deploy the solution

This Azure Security and Compliance Blueprint Automation is comprised of JSON configuration files and PowerShell scripts that are handled by Azure Resource Manager's API service to deploy resources within Azure. Detailed deployment instructions are available [here](https://aka.ms/ukofficial-paaswa-repo).

Three approaches have been provided for deployment; A simple "express" [Azure CLI 2](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) suitable for quickly building a test environment; a parameterized [Azure CLI 2](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) approach providing greater configuration for workload environments; and an Azure portal based deployment where the operator can specify the deployment parameters through the Azure portal. 

1.	Clone or download [this](https://aka.ms/ukofficial-paaswa-repo) GitHub repository to your local workstation.
2.	Review [Method 1: Azure CLI 2 (Express version)](https://aka.ms/ukofficial-paaswa-repo/#method-1-azure-cli-2-express-version) and execute the provided commands.
3.	Review [Method 1a: Azure CLI 2 (Configuring the deployment via script arguments)](https://aka.ms/ukofficial-paaswa-repo/#method-1a-azure-cli-2-configuring-the-deployment-via-script-arguments) and execute the provided commands
4.	Review [Method 2: Azure portal Deployment Process](https://aka.ms/ukofficial-paaswa-repo/#method-2-azure-portal-deployment-process) and execute the listed commands

## Guidance and recommendations

### API Management

[Azure API Management](https://azure.microsoft.com/services/api-management/) could be used in front of the API App Service to provide additional layers of security, throttling and controls to expose, proxy and protect APIs.

### Azure B2C

[Azure Active Directory B2C](https://azure.microsoft.com/services/active-directory-b2c/)  may be implemented as a control to allow users to register, create an identity, and enable authorization and access control for the public web application.

## Disclaimer

- This document is for informational purposes only. MICROSOFT MAKES NO WARRANTIES, EXPRESS, IMPLIED, OR STATUTORY, AS TO THE INFORMATION IN THIS DOCUMENT. This document is provided "as-is." Information and views expressed in this document, including URL and other Internet website references, may change without notice. Customers reading this document bear the risk of using it.
- This document does not provide customers with any legal rights to any intellectual property in any Microsoft product or solutions.
- Customers may copy and use this document for internal reference purposes.
- Certain recommendations in this document may result in increased data, network, or compute resource usage in Azure, and may increase a customer's Azure license or subscription costs.
- This architecture is intended to serve as a foundation for customers to adjust to their specific requirements and should not be used as-is in a production environment.
- This document is developed as a reference and should not be used to define all means by which a customer can meet specific compliance requirements and regulations. Customers should seek legal support from their organization on approved customer implementations.
