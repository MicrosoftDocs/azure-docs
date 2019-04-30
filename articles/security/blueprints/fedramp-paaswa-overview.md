---
title: Azure Security and Compliance Blueprint - PaaS Web Application for FedRAMP
description: Azure Security and Compliance Blueprint - PaaS Web Application for FedRAMP
services: security
author: jomolesk

ms.assetid: 41570fc1-4d74-48ed-afb0-ef1be857029e
ms.service: security
ms.topic: article
ms.date: 06/01/2018
ms.author: jomolesk
---

# Azure Security and Compliance Blueprint: PaaS Web Application for FedRAMP

## Overview

The [Federal Risk and Authorization Management Program (FedRAMP)](https://www.fedramp.gov/) is a United States government-wide program that provides a standardized approach to security assessment, authorization, and continuous monitoring for cloud products and services. This Azure Security and Compliance Blueprint provides guidance for how to deliver a Microsoft Azure platform as a service (PaaS) architecture that helps implement a subset of FedRAMP High controls. This solution provides guidance on the deployment and configuration of Azure resources for a common reference architecture, demonstrating ways in which customers can meet specific security and compliance requirements and serves as a foundation for customers to build and configure their own solutions on Azure.

This reference architecture, associated control implementation guides, and threat models are intended to serve as a foundation for customers to adjust to their specific requirements and should not be used as-is in a production environment. Deploying an application into this environment without modification is insufficient to completely meet the requirements of the FedRAMP High baseline. Please note the following:
- The architecture provides a baseline to help customers deploy workloads to Azure in a FedRAMP-compliant manner.
- Customers are responsible for conducting appropriate security and compliance assessments of any solution built using this architecture, as requirements may vary based on the specifics of each customer's implementation.

## Architecture diagram and components
This solution provides a reference architecture for a PaaS web application with an Azure SQL Database backend. The web application is hosted in an isolated Azure App Service Environment, which is a private, dedicated environment in an Azure datacenter. The environment load balances traffic for the web application across VMs managed by Azure. This architecture also includes network security groups, an Application Gateway, Azure DNS, and Load Balancer. Furthermore, Azure Monitor provides real-time analytics of system health. **Azure recommends configuring a VPN or ExpressRoute connection for management and data import into the reference architecture subnet.**

![PaaS Web Application for FedRAMP reference architecture diagram](images/fedramp-paaswa-architecture.png?raw=true "PaaS Web Application for FedRAMP reference architecture diagram")

This solution uses the following Azure services. Details of the deployment architecture are located in the [deployment architecture](#deployment-architecture) section.

- Azure Active Directory
- Azure Key Vault
- Azure SQL Database
- Application Gateway
	- (1) Web Application Firewall
		- Firewall mode: prevention
		- Rule set: OWASP 3.0
		- Listener: port 443
- Azure virtual network
- Network security groups
- Azure DNS
- Azure Storage
- Azure Monitor
- App Service Environment v2
- Azure Load Balancer
- Azure Web App
- Azure Resource Manager

## Deployment architecture
The following section details the deployment and implementation elements.

**Azure Resource Manager**:
[Azure Resource Manager](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview) enables customers to work with the resources in the solution as a group. Customers can deploy, update, or delete all the resources for the solution in a single, coordinated operation. Customers use a template for deployment and that template can work for different environments such as testing, staging, and production. Resource Manager provides security, auditing, and tagging features to help customers manage their resources after deployment.

**App Service Environment v2**:
The [Azure App Service Environment (ASE)](https://docs.microsoft.com/azure/app-service/environment/intro) is an App Service feature that provides a fully isolated and dedicated environment for securely running App Service applications at a high scale.

ASEs are isolated to only run a single customer's applications and are always deployed into a virtual network. Customers have fine-grained control over both inbound and outbound application network traffic, and applications can establish high-speed secure connections over virtual networks to on-premises corporate resources.

Use of ASEs for this architecture are allowed for the following controls/configurations:

- Host inside a secured Azure Virtual Network and network security rules
- ASE configured with self-signed ILB certificate for HTTPS communication
- [Internal Load Balancing mode](https://docs.microsoft.com/azure/app-service-web/app-service-environment-with-internal-load-balancer)
- Disable [TLS 1.0](https://docs.microsoft.com/azure/app-service-web/app-service-app-service-environment-custom-settings)
- Change [TLS Cipher](https://docs.microsoft.com/azure/app-service-web/app-service-app-service-environment-custom-settings)
- Control [inbound traffic N/W ports](https://docs.microsoft.com/azure/app-service-web/app-service-app-service-environment-control-inbound-traffic)
- [Web Application Firewall – Restrict Data](https://docs.microsoft.com/azure/app-service-web/app-service-app-service-environment-web-application-firewall)
- Allow [Azure SQL Database traffic](https://docs.microsoft.com/azure/app-service-web/app-service-app-service-environment-network-architecture-overview)

The [Guidance and recommendations](#guidance-and-recommendations) section contains additional information about ASEs.

**Azure Web App**:
[Azure App Service](https://docs.microsoft.com/azure/app-service/) enables customers to build and host web applications in the programming language of their choice without managing infrastructure. It offers auto-scaling and high availability, supports both Windows and Linux, and enables automated deployments from GitHub, Azure DevOps, or any Git repo.

### Virtual Network
The architecture defines a private virtual network with an address space of 10.200.0.0/16.

**Network security groups**: [Network security groups (NSGs)](https://docs.microsoft.com/azure/virtual-network/virtual-networks-nsg) contain access control lists that allow or deny traffic within a virtual network. NSGs can be used to secure traffic at a subnet or individual VM level. The following NSGs exist:
- 1 NSG for Application Gateway
- 1 NSG for App Service Environment
- 1 NSG for Azure SQL Database

Each of the NSGs have specific ports and protocols open so that the solution can work securely and correctly. In addition, the following configurations are enabled for each NSG:
  -	[Diagnostic logs and events](https://docs.microsoft.com/azure/virtual-network/virtual-network-nsg-manage-log) are enabled and stored in a storage account
  -	Azure Monitor logs is connected to the [NSG's diagnostics](https://github.com/krnese/AzureDeploy/blob/master/AzureMgmt/AzureMonitor/nsgWithDiagnostics.json)

**Subnets**: Each subnet is associated with its corresponding NSG.

**Azure DNS**:
The Domain Name System, or DNS, is responsible for translating (or resolving) a website or service name to its IP address. [Azure DNS](https://docs.microsoft.com/azure/dns/dns-overview) is a hosting service for DNS domains that provides name resolution using Azure infrastructure. By hosting domains in Azure, users can manage DNS records using the same credentials, APIs, tools, and billing as other Azure services. Azure DNS also supports private DNS domains.

**Azure Load Balancer**:
[Azure Load Balancer](https://docs.microsoft.com/azure/load-balancer/load-balancer-overview) allows customers to scale their applications and create high availability for services. Load Balancer supports inbound as well as outbound scenarios, and provides low latency, high throughput, and scales up to millions of flows for all TCP and UDP applications.

### Data in transit
Azure encrypts all communications to and from Azure datacenters by default. All transactions to Azure Storage through the Azure portal occur via HTTPS.

### Data at rest
The architecture protects data at rest through encryption, database auditing, and other measures.

**Azure Storage**:
To meet encrypted data at rest requirements, all [Azure Storage](https://azure.microsoft.com/services/storage/) uses [Storage Service Encryption](https://docs.microsoft.com/azure/storage/storage-service-encryption).

**Azure Disk Encryption**
[Azure Disk Encryption](https://docs.microsoft.com/azure/security/azure-security-disk-encryption) leverages the BitLocker feature of Windows to provide volume encryption for data disks. The solution integrates with Azure Key Vault to help control and manage the disk-encryption keys.

**Azure SQL Database**:
The Azure SQL Database instance uses the following database security measures:
-	[AD authentication and authorization](https://docs.microsoft.com/azure/sql-database/sql-database-aad-authentication) enables identity management of database users and other Microsoft services in one central location.
-	[SQL database auditing](https://docs.microsoft.com/azure/sql-database/sql-database-auditing-get-started) tracks database events and writes them to an audit log in an Azure storage account.
-	Azure SQL Database is configured to use [Transparent Data Encryption (TDE)](https://docs.microsoft.com/sql/relational-databases/security/encryption/transparent-data-encryption-azure-sql), which performs real-time encryption and decryption of the database, associated backups, and transaction log files to protect information at rest.
-	[Firewall rules](https://docs.microsoft.com/azure/sql-database/sql-database-firewall-configure) prevent all access to database servers until proper permissions are granted. The firewall grants access to databases based on the originating IP address of each request.
-	[SQL Threat Detection](https://docs.microsoft.com/azure/sql-database/sql-database-threat-detection-get-started) enables the detection and response to potential threats as they occur by providing security alerts for suspicious database activities, potential vulnerabilities, SQL injection attacks, and anomalous database access patterns.
-	[Always Encrypted Columns](https://docs.microsoft.com/azure/sql-database/sql-database-always-encrypted-azure-key-vault) ensure that sensitive data never appears as plaintext inside the database system. After enabling data encryption, only client applications or application servers with access to the keys can access plaintext data.
- [Row-Level Security](https://docs.microsoft.com/sql/relational-databases/security/row-level-security) enables users to define policies to restrict access to data to discontinue processing.
- [SQL Database dynamic data masking](https://docs.microsoft.com/azure/sql-database/sql-database-dynamic-data-masking-get-started) can be done after the reference architecture deploys. Customers will need to adjust dynamic data masking settings to adhere to their database schema.

### Identity management
The following technologies provide identity management capabilities in the Azure environment:
-	[Azure Active Directory](https://azure.microsoft.com/services/active-directory/) is Microsoft's multi-tenant cloud-based directory and identity management service. All users for this solution are created in AAD, including users accessing the Azure SQL Database.
-	Authentication to the application is performed using AAD. For more information, see [Integrating applications with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/develop/active-directory-integrating-applications). Additionally, the database column encryption uses Azure Active Directory to authenticate the application to Azure SQL Database. For more information, see how to [protect sensitive data in Azure SQL Database](https://docs.microsoft.com/azure/sql-database/sql-database-always-encrypted-azure-key-vault).
-	[Azure role-based access control](https://docs.microsoft.com/azure/active-directory/role-based-access-control-configure) enables precisely focused access management for Azure. Subscription access is limited to the subscription administrator, and access to resources can be limited based on user role.
- [Azure Active Directory Privileged Identity Management](https://docs.microsoft.com/azure/active-directory/active-directory-privileged-identity-management-getting-started) enables customers to minimize the number of users who have access to certain information.  Administrators can use AAD Privileged Identity Management to discover, restrict, and monitor privileged identities and their access to resources. This functionality can also be used to enforce on-demand, just-in-time administrative access when needed.
- [Azure Active Directory Identity Protection](https://docs.microsoft.com/azure/active-directory/active-directory-identityprotection) detects potential vulnerabilities affecting an organization’s identities, configures automated responses to detected suspicious actions related to an organization’s identities, and investigates suspicious incidents to take appropriate action to resolve them.

### Security
**Secrets Management**
The solution uses [Azure Key Vault](https://azure.microsoft.com/services/key-vault/) for the management of keys and secrets. Azure Key Vault helps safeguard cryptographic keys and secrets used by cloud applications and services. The following Azure Key Vault capabilities help customers protect data and access to such data:
- Advanced access policies are configured on a need basis.
- Key Vault access policies are defined with minimum required permissions to keys and secrets.
- All keys and secrets in Key Vault have expiration dates.
- All keys in Key Vault are protected by specialized hardware security modules (HSMs). The key type is an HSM Protected 2048-bit RSA Key.
- All users and identities are granted minimum required permissions using role-based access control.
- Diagnostics logs for Key Vault are enabled with a retention period of at least 365 days.
- Permitted cryptographic operations for keys are restricted to the ones required.

**Application Gateway**
The architecture reduces the risk of security vulnerabilities using an Application Gateway with Web Application Firewall, and the OWASP ruleset enabled. Additional capabilities include:
- [End-to-End-SSL](https://docs.microsoft.com/azure/application-gateway/application-gateway-end-to-end-ssl-powershell)
- Enable [SSL Offload](https://docs.microsoft.com/azure/application-gateway/application-gateway-ssl-portal)
- Disable [TLS v1.0 and v1.1](https://docs.microsoft.com/azure/application-gateway/application-gateway-end-to-end-ssl-powershell)
- [Web Application Firewall](https://docs.microsoft.com/azure/application-gateway/application-gateway-web-application-firewall-overview)
- [Prevention mode](https://docs.microsoft.com/azure/application-gateway/application-gateway-web-application-firewall-portal) with OWASP 3.0 ruleset
- Enable [diagnostics logging](https://docs.microsoft.com/azure/application-gateway/application-gateway-diagnostics)
- [Custom health probes](https://docs.microsoft.com/azure/application-gateway/application-gateway-create-gateway-portal)
- [Azure Security Center](https://azure.microsoft.com/services/security-center) and [Azure Advisor](https://docs.microsoft.com/azure/advisor/advisor-security-recommendations) provide additional protection and notifications. Azure Security Center also provides a reputation system.

### Logging and auditing
Azure Monitor provides extensive logging of system and user activity, as well as system health. It collects and analyzes data generated by resources in Azure and on-premises environments.
- **Activity logs**: [Activity logs](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-activity-logs) provide insight into operations performed on resources in a subscription. Activity logs can help determine an operation's initiator, time of occurrence, and status.
- **Diagnostic logs**: [Diagnostic logs](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs) include all logs emitted by every resource. These logs include Windows event system logs, Azure Storage logs, Key Vault audit logs, and Application Gateway access and firewall logs.
- **Log archiving**: All diagnostic logs write to a centralized and encrypted Azure storage account for archival. The retention is user-configurable, up to 730 days, to meet organization-specific retention requirements. These logs connect to Azure Monitor logs for processing, storing, and dashboard reporting.

Additionally, the following monitoring solutions are included as a part of this architecture:
-	[Active directory Assessment](https://docs.microsoft.com/azure/log-analytics/log-analytics-ad-assessment): The Active Directory Health Check solution assesses the risk and health of server environments on a regular interval and provides a prioritized list of recommendations specific to the deployed server infrastructure.
-	[Antimalware Assessment](https://docs.microsoft.com/azure/log-analytics/log-analytics-malware): The Antimalware solution reports on malware, threats, and protection status.
-	[Azure Automation](https://docs.microsoft.com/azure/automation/automation-hybrid-runbook-worker): The Azure Automation solution stores, runs, and manages runbooks. In this solution, runbooks help collect logs from Application Insights and Azure SQL Database.
-	[Security and Audit](https://docs.microsoft.com/azure/operations-management-suite/oms-security-getting-started): The Security and Audit dashboard provides a high-level insight into the security state of resources by providing metrics on security domains, notable issues, detections, threat intelligence, and common security queries.
-	[SQL Assessment](https://docs.microsoft.com/azure/log-analytics/log-analytics-sql-assessment): The SQL Health Check solution assesses the risk and health of server environments on a regular interval and provides customers with a prioritized list of recommendations specific to the deployed server infrastructure.
-	[Update Management](https://docs.microsoft.com/azure/operations-management-suite/oms-solution-update-management): The Update Management solution allows customer management of operating system security updates, including a status of available updates and the process of installing required updates.
-	[Agent Health](https://docs.microsoft.com/azure/operations-management-suite/oms-solution-agenthealth): The Agent Health solution reports how many agents are deployed and their geographic distribution, as well as how many agents which are unresponsive and the number of agents which are submitting operational data.
-	[Azure Activity Logs](https://docs.microsoft.com/azure/log-analytics/log-analytics-activity): The Activity Log Analytics solution assists with analysis of the Azure activity logs across all Azure subscriptions for a customer.
-	[Change Tracking](https://docs.microsoft.com/azure/automation/automation-change-tracking): The Change Tracking solution allows customers to easily identify changes in the environment.

**Azure Monitor**
[Azure Monitor](https://docs.microsoft.com/azure/monitoring-and-diagnostics/) helps users track performance, maintain security, and identify trends by enabling organizations to audit, create alerts, and archive data, including tracking API calls in customers' Azure resources.

## Threat model

The data flow diagram for this reference architecture is available for [download](https://aka.ms/fedrampPaaSWebAppDFD) or can be found below. This model can help customers understand the points of potential risk in the system infrastructure when making modifications.

![PaaS Web Application for FedRAMP threat model](images/fedramp-paaswa-threat-model.png?raw=true "PaaS Web Application for FedRAMP threat model")

## Compliance documentation
The [Azure Security and Compliance Blueprint - FedRAMP High Customer Responsibility Matrix](https://aka.ms/blueprinthighcrm) lists all security controls required by the FedRAMP High baseline. The matrix denotes whether the implementation of each control is the responsibility of Microsoft, the customer, or shared between the two.

The [Azure Security and Compliance Blueprint - FedRAMP PaaS WebApp High Control Implementation Matrix](https://aka.ms/fedrampPaaSWebAppCIM) lists all security controls required by the FedRAMP High baseline. The matrix provides information on which controls are covered by the PaaS web application architecture, including detailed descriptions of how the implementation meets the requirements of each covered control.

## Guidance and recommendations
### VPN and ExpressRoute
A secure VPN tunnel or [ExpressRoute](https://docs.microsoft.com/azure/expressroute/expressroute-introduction) needs to be configured to securely establish a connection to the resources deployed as a part of this PaaS web application reference architecture. By appropriately setting up a VPN or ExpressRoute, customers can add a layer of protection for data in transit.

By implementing a secure VPN tunnel with Azure, a VPN connection between an on-premises network and an Azure Virtual Network can be created. This connection takes place over the Internet and allows customers to securely “tunnel” information inside an encrypted link between the customer's network and Azure. Site-to-Site VPN is a secure, mature technology that has been deployed by enterprises of all sizes for decades. The [IPsec tunnel mode](https://docs.microsoft.com/previous-versions/windows/it-pro/windows-server-2003/cc786385(v=ws.10)) is used in this option as an encryption mechanism.

Because traffic within the VPN tunnel does traverse the Internet with a site-to-site VPN, Microsoft offers another, even more secure connection option. Azure ExpressRoute is a dedicated WAN link between Azure and an on-premises location or an Exchange hosting provider. As ExpressRoute connections do not go over the Internet, these connections offer more reliability, faster speeds, lower latencies, and higher security than typical connections over the Internet. Furthermore, because this is a direct connection of customer's telecommunication provider, the data does not travel over the Internet and therefore is not exposed to it.

Best practices for implementing a secure hybrid network that extends an on-premises network to Azure are [available](https://docs.microsoft.com/azure/architecture/reference-architectures/dmz/secure-vnet-hybrid).

## Disclaimer

 - This document is for informational purposes only. MICROSOFT MAKES NO WARRANTIES, EXPRESS, IMPLIED, OR STATUTORY, AS TO THE INFORMATION IN THIS DOCUMENT. This document is provided "as-is." Information and views expressed in this document, including URL and other Internet website references, may change without notice. Customers reading this document bear the risk of using it.
 - This document does not provide customers with any legal rights to any intellectual property in any Microsoft product or solutions.
 - Customers may copy and use this document for internal reference purposes.
 - Certain recommendations in this document may result in increased data, network, or compute resource usage in Azure, and may increase a customer's Azure license or subscription costs.
 - This architecture is intended to serve as a foundation for customers to adjust to their specific requirements and should not be used as-is in a production environment.
 - This document is developed as a reference and should not be used to define all means by which a customer can meet specific compliance requirements and regulations. Customers should seek legal support from their organization on approved customer implementations.
