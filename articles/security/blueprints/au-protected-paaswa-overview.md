---
title: Azure Security and Compliance Blueprint - PaaS Web Application for Australia PROTECTED
description: Azure Security and Compliance Blueprint - PaaS Web Application for Australia PROTECTED
services: security
author: meladie

ms.assetid: 708aa129-b226-4e02-85c6-1f86e54564e4
ms.service: security
ms.topic: article
ms.date: 08/23/2018
ms.author: meladie
---
# Azure Security and Compliance Blueprint - PaaS Web Application for Australia PROTECTED

## Overview

This Azure Security and Compliance Blueprint provides guidance for the deployment of a platform as a service (PaaS) environment suitable for the collection, storage, and retrieval of AU-PROTECTED government data that is compliant with the objectives of the Australian Government Information Security Manual (ISM) produced by the Australian Signals Directorate (ASD). This blueprint showcases a common reference architecture and helps demonstrate the proper handling of sensitive government data in a secure, compliant, multi-tier environment.

This reference architecture, implementation guide, and threat model provide a foundation for customers to undertake their own planning and system accreditation processes, helping customers deploy workloads to Azure in an ASD-compliant manner. Customers may choose to implement an Azure VPN Gateway or ExpressRoute to use federated services and to integrate on-premises resources with Azure resources. Customers must consider the security implications of using on-premises resources. Additional configuration is required to meet all the requirements, as they may vary based on the specifics of each customer's implementation.

Achieving ASD-compliance requires that an Information Security Registered Assessor audits the system. Customers are responsible for conducting appropriate security and compliance assessments of any solution built using this architecture, as requirements may vary based on the specifics of each customer's implementation.

## Architecture diagram and components
This solution provides a reference architecture for a PaaS web application with an Azure SQL Database backend. The web application is hosted in an isolated Azure App Service Environment, which is a private, dedicated environment in an Azure datacentre. The environment load balances traffic for the web application across virtual machines managed by Azure. All web application connections require TLS with a minimum version of 1.2. This architecture also includes network security groups, an Application Gateway, Azure DNS, and Load Balancer.

The architecture can deliver a secure hybrid environment that extends an on-premises network to Azure, allowing web-based workloads to be accessed securely by corporate users of an organization’s private local-area network or from the internet. For on-premises solutions, the customer is both accountable and responsible for all aspects of security, operations, and compliance.

The Azure resources included in this solution can connect to an on-premises network or datacentre colocation facility (e.g. CDC in Canberra) through an IPSec VPN using a VPN Gateway and through ExpressRoute. The decision to utilise a VPN should be done with the classification of the transmitted data and the network path in mind. Customers running large-scale, mission critical workloads with big data requirements should consider a hybrid network architecture using ExpressRoute for private network connectivity to Azure services. Refer to the [guidance and recommendations](#guidance-and-recommendations) section for further details on connection mechanisms to Azure.

Federation with Azure Active Directory should be used to enable users to authenticate using on-premises credentials and access all resources in the cloud by using an on-premises Active Directory Federation Services infrastructure. Active Directory Federation Services can provide simplified, secured identity federation and web single sign-on capabilities for this hybrid environment. Refer to the [guidance and recommendations](#guidance-and-recommendations) section for further details Azure Active Directory setup.

The solution uses Azure Storage accounts, which customers can configure to use Storage Service Encryption to maintain confidentiality of data at rest. Azure stores three copies of data within a customer's selected region for resiliency. Azure regions are deployed in resilient region pairs, and geographic redundant storage ensures that data will be replicated to the second region with three copies as well. This prevents an adverse event at the customer's primary data location resulting in a loss of data.

For enhanced security, all Azure resources in this solution are managed as a resource group through Azure Resource Manager. Azure Active Directory role-based access control is used for controlling access to deployed resources and keys in Azure Key Vault. System health is monitored through Azure Security Center and Azure Monitor. Customers configure both monitoring services to capture logs and display system health in a single, easily navigable dashboard. Azure Application Gateway is configured as a firewall in prevention mode and disallows traffic that is not TLS v1.2 or above. The solution utilizes Azure Application Service Environment v2 to isolate the web tier in a non-multi-tenant environment.

![PaaS Web Application for AU-PROTECTED Reference Architecture](images/au-protected-paaswa-architecture.png?raw=true "PaaS Web Application for AU-PROTECTED Reference Architecture Diagram")

This solution uses the following Azure services. Further details are in the [deployment architecture](#deployment-architecture) section.

- Application Gateway
	- Web application firewall
		- Firewall mode: prevention
		- Rule set: OWASP
		- Listener port: 443
- Application Insights
- Azure Active Directory
- Azure Application Service Environment v2
- Azure Automation
- Azure DNS
- Azure Key Vault
- Azure Load Balancer
- Azure Monitor
- Azure Resource Manager
- Azure Security Center
- Azure SQL Database
- Azure Storage
- Azure Log Analytics
- Azure Virtual Network
	- (1) /16 Network
	- (4) /24 Networks
	- Network security groups
- Network security groups
- Recovery Services Vault
- Azure Web App

This Blueprint contains Azure Services that have not been certified for use at the Protected classification by the Australian Cyber Security Centre (ACSC). Microsoft recommends that customers review the published security and audit reports related to these Azure Services and use their risk management framework to determine whether the Azure Service is suitable for their internal accreditation and use at the Protected classification.

## Deployment architecture
The following section details the deployment and implementation elements.

**Azure Resource Manager**:
[Azure Resource Manager](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview) enables customers to work with the resources in the solution as a group. Customers can deploy, update, or delete all the resources for the solution in a single, coordinated operation. Customers use a template for deployment and that template can work for different environments such as testing, staging, and production. Resource Manager provides security, auditing, and tagging features to help customers manage their resources after deployment.

**Bastion host**: The bastion host is the single point of entry that allows users to access the deployed resources in this environment. The bastion host provides a secure connection to deployed resources by only allowing remote traffic from public IP addresses on a safe list. To permit remote desktop (RDP) traffic, the source of the traffic needs to be defined in the network security group.

This solution creates a virtual machine as a domain-joined bastion host with the following configurations:
-	[Antimalware extension](https://docs.microsoft.com/azure/security/azure-security-antimalware)
-	[Azure Diagnostics extension](https://docs.microsoft.com/azure/virtual-machines/virtual-machines-windows-extensions-diagnostics-template)
-	[Azure Disk Encryption](https://docs.microsoft.com/azure/security/azure-security-disk-encryption) using Azure Key Vault
-	An [auto-shutdown policy](https://azure.microsoft.com/blog/announcing-auto-shutdown-for-vms-using-azure-resource-manager/) to reduce consumption of virtual machine resources when not in use

**App Service Environment v2**:
The [Azure App Service Environment](https://docs.microsoft.com/azure/app-service/environment/intro) is an App Service feature that provides a fully isolated and dedicated environment for securely running App Service applications at a high scale.

App Service Environments are isolated to only run a single customer's applications and are always deployed into a virtual network. Customers have fine-grained control over both inbound and outbound application network traffic, and applications can establish high-speed secure connections over virtual networks to on-premises corporate resources.

Use of App Service Environments for this architecture allow for the following controls/configurations:

- App Service Environments must be configured to use the isolated service plan
	- Configure different App Service Environments for applications at different classifications
- Host inside a secured Azure virtual network and network security rules
- App Service Environments configured with a self-signed internal load balancer certificate for HTTPS communication. As a best practice, Microsoft recommends the use of a trusted certificate authority for enhanced security.
- [Internal load balancing mode](https://docs.microsoft.com/azure/app-service-web/app-service-environment-with-internal-load-balancer) (mode 3)
- Disable [TLS v1.0 and v1.1](https://docs.microsoft.com/azure/app-service-web/app-service-app-service-environment-custom-settings)
- Change [TLS cipher](https://docs.microsoft.com/azure/app-service-web/app-service-app-service-environment-custom-settings)
- Control [inbound traffic N/W ports](https://docs.microsoft.com/azure/app-service-web/app-service-app-service-environment-control-inbound-traffic)
- [Web application firewall – restrict data](https://docs.microsoft.com/azure/app-service-web/app-service-app-service-environment-web-application-firewall)
- Allow [Azure SQL Database traffic](https://docs.microsoft.com/azure/app-service-web/app-service-app-service-environment-network-architecture-overview)

**Azure Web App**:
[Azure Web Apps](https://docs.microsoft.com/azure/app-service/) enables customers to build and host web applications in the programming language of their choice without managing infrastructure. It offers auto-scaling and high availability, supports both Windows and Linux, and enables automated deployments from GitHub, Azure DevOps Services, or any Git repo.

### Virtual Network
The architecture defines a private virtual network with an address space of 10.200.0.0/16.

**Network security groups**: [Network security groups](https://docs.microsoft.com/azure/virtual-network/virtual-networks-nsg) contain access control lists that allow or deny traffic within a virtual network. Network security groups can be used to secure traffic at a subnet or individual virtual machine level. The following network security groups exist:
- 1 network security group for Application Gateway
- 1 network security group for App Service Environment
- 1 network security group for Azure SQL Database
- 1 network security group for bastion host

Each of the network security groups have specific ports and protocols open so that the solution can work securely and correctly. In addition, the following configurations are enabled for each network security group:

  -	[Diagnostic logs and events](https://docs.microsoft.com/azure/virtual-network/virtual-network-nsg-manage-log) are enabled and stored in a storage account
  -	Azure Log Analytics is connected to the [network security group's diagnostics](https://github.com/krnese/AzureDeploy/blob/master/AzureMgmt/AzureMonitor/nsgWithDiagnostics.json)

**Subnets**: Each subnet is associated with its corresponding network security group.

**Azure DNS**:
The Domain Name System, or DNS, is responsible for translating (or resolving) a website or service name to its IP address. [Azure DNS](https://docs.microsoft.com/azure/dns/dns-overview) is a hosting service for DNS domains that provides name resolution using Azure infrastructure. By hosting domains in Azure, users can manage DNS records using the same credentials, APIs, tools, and billing as other Azure services. Azure DNS also supports private DNS domains.

**Azure Load Balancer**:
[Azure Load Balancer](https://docs.microsoft.com/azure/load-balancer/load-balancer-overview) allows customers to scale their applications and create high availability for services. Load Balancer supports inbound as well as outbound scenarios, and provides low latency, high throughput, and scales up to millions of flows for all TCP and UDP applications.

### Data in transit
Azure encrypts all communications to and from Azure datacentres by default. 

For Protected data in transit from customer owned networks, the Architecture uses Azure the Internet or ExpressRoute with a VPN Gateway configured with IPSEC.

Additionally, all transactions to Azure through the Azure management portal occur via HTTPS utilising TLS v1.2.

### Data at rest
The architecture protects data at rest through encryption, database auditing, and other measures.

**Azure Storage**:
To meet encrypted data at rest requirements, all [Azure Storage](https://azure.microsoft.com/services/storage/) uses [Storage Service Encryption](https://docs.microsoft.com/azure/storage/storage-service-encryption). This helps protect and safeguard data in support of organizational security commitments and compliance requirements defined by Australian Government ISM.

**Azure Disk Encryption**:
[Azure Disk Encryption](https://docs.microsoft.com/azure/security/azure-security-disk-encryption) leverages the BitLocker feature of Windows to provide volume encryption for data disks. The solution integrates with Azure Key Vault to help control and manage the disk-encryption keys.

**Azure SQL Database**:
The Azure SQL Database instance uses the following database security measures:
-	[Active Directory authentication and authorization](https://docs.microsoft.com/azure/sql-database/sql-database-AAD-authentication) enables identity management of database users and other Microsoft services in one central location.
-	[SQL database auditing](https://docs.microsoft.com/azure/sql-database/sql-database-auditing-get-started) tracks database events and writes them to an audit log in an Azure storage account.
-	Azure SQL Database is configured to use [transparent data encryption](https://docs.microsoft.com/sql/relational-databases/security/encryption/transparent-data-encryption-azure-sql), which performs real-time encryption and decryption of the database, associated backups, and transaction log files to protect information at rest. Transparent data encryption provides assurance that stored data has not been subject to unauthorized access.
-	[Firewall rules](https://docs.microsoft.com/azure/sql-database/sql-database-firewall-configure) prevent all access to database servers until proper permissions are granted. The firewall grants access to databases based on the originating IP address of each request.
-	[SQL Threat Detection](https://docs.microsoft.com/azure/sql-database/sql-database-threat-detection-get-started) enables the detection and response to potential threats as they occur by providing security alerts for suspicious database activities, potential vulnerabilities, SQL injection attacks, and anomalous database access patterns. SQL Threat Detection integrates alerts with [Azure Security Center](https://azure.microsoft.com/services/security-center/), which includes details of suspicious activity and recommended action on how to investigate and mitigate the threat.
-	[Always Encrypted Columns](https://docs.microsoft.com/azure/sql-database/sql-database-always-encrypted-azure-key-vault) ensure that sensitive data never appears as plaintext inside the database system. After enabling data encryption, only client applications or application servers with access to the keys can access plaintext data.
- [SQL Database dynamic data masking](https://docs.microsoft.com/azure/sql-database/sql-database-dynamic-data-masking-get-started) limits sensitive data exposure by masking the data to non-privileged users or applications. Dynamic data masking can automatically discover potentially sensitive data and suggest the appropriate masks to be applied. This helps with reducing access such that sensitive data does not exit the database via unauthorized access. Customers will need to adjust dynamic data masking settings to adhere to their database schema.

### Identity management
Customers may utilize on-premises Active Directory Federated Services to federate with [Azure Active Directory](https://azure.microsoft.com/services/active-directory/), which is Microsoft's multi-tenant cloud-based directory and identity management service. [Azure Active Directory Connect](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnect) integrates on-premises directories with Azure Active Directory. All users in this solution require Azure Active Directory accounts, including users accessing the Azure SQL Database. With federation sign-in, users can sign in to Azure Active Directory and authenticate to Azure resources using on-premises credentials.

Furthermore, the following Azure Active Directory capabilities help manage access to data in the Azure environment:
- Authentication to the application is performed using Azure Active Directory. For more information, see [integrating applications with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/develop/active-directory-integrating-applications). Additionally, the database column encryption uses Azure Active Directory to authenticate the application to Azure SQL Database. For more information, see how to [protect sensitive data in Azure SQL Database](https://docs.microsoft.com/azure/sql-database/sql-database-always-encrypted-azure-key-vault).
- [Azure role-based access control](https://docs.microsoft.com/azure/active-directory/role-based-access-control-configure) enables administrators to define fine-grained access permissions to grant only the amount of access that users need to perform their jobs. Instead of giving every user unrestricted permission for Azure resources, administrators can allow only certain actions for accessing data. Subscription access is limited to the subscription administrator.
- [Azure Active Directory Privileged Identity Management](https://docs.microsoft.com/azure/active-directory/active-directory-privileged-identity-management-getting-started) enables customers to minimize the number of users who have access to certain information. Administrators can use Azure Active Directory Privileged Identity Management to discover, restrict, and monitor privileged identities and their access to resources. This functionality can also be used to enforce on-demand, just-in-time administrative access when needed.
- [Azure Active Directory Identity Protection](https://docs.microsoft.com/azure/active-directory/active-directory-identityprotection) detects potential vulnerabilities affecting an organizations identities, configures automated responses to detected suspicious actions related to an organization's identities, and investigates suspicious incidents to take appropriate action to resolve them.

**Azure Multi-Factor Authentication**: To protect identities, multi-factor authentication should be implemented. [Azure Multi-Factor Authentication](https://azure.microsoft.com/services/multi-factor-authentication/) is an easy to use, scalable, and reliable solution that provides a second method of authentication to protect users. Azure Multi-Factor Authentication uses the power of the cloud and integrates with on-premises Active Directory and custom applications. This protection is extended to high-volume, mission-critical scenarios.

### Security
**Secrets management**:
The solution uses [Azure Key Vault](https://azure.microsoft.com/services/key-vault/) for the management of keys and secrets. Azure Key Vault helps safeguard cryptographic keys and secrets used by cloud applications and services. The following Azure Key Vault capabilities help customers protect data:
- Advanced access policies are configured on a need basis.
- Key Vault access policies are defined with minimum required permissions to keys and secrets.
- All keys and secrets in Key Vault have expiration dates.
- All keys in Key Vault are protected by specialized hardware security modules. The key type is a hardware security module protected 2048-bit RSA key.
- All users and identities are granted minimum required permissions using role-based access control.
- Diagnostics logs for Key Vault are enabled with a retention period of at least 365 days.
- Permitted cryptographic operations for keys are restricted to the ones required.

**Azure Security Center**: With [Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-intro), customers can centrally apply and manage security policies across workloads, limit exposure to threats, and detect and respond to attacks. Additionally, Azure Security Center accesses existing configurations of Azure services to provide configuration and service recommendations to help improve security posture and protect data.

Azure Security Center uses a variety of detection capabilities to alert customers of potential attacks targeting their environments. These alerts contain valuable information about what triggered the alert, the resources targeted, and the source of the attack. Azure Security Center has a set of [predefined security alerts](https://docs.microsoft.com/azure/security-center/security-center-alerts-type), which are triggered when a threat, or suspicious activity takes place. [Custom alert rules](https://docs.microsoft.com/azure/security-center/security-center-custom-alert) in Azure Security Center allow customers to define new security alerts based on data that is already collected from their environment.

Azure Security Center provides prioritized security alerts and incidents, making it simpler for customers to discover and address potential security issues. A [threat intelligence report](https://docs.microsoft.com/azure/security-center/security-center-threat-report) is generated for each detected threat to assist incident response teams in investigating and remediating threats.

**Application Gateway**:
The architecture reduces the risk of security vulnerabilities using an Application Gateway with a web application firewall, and the OWASP ruleset enabled. Additional capabilities include:

- [End-to-end-SSL](https://docs.microsoft.com/azure/application-gateway/application-gateway-end-to-end-ssl-powershell)
- Enable [SSL Offload](https://docs.microsoft.com/azure/application-gateway/application-gateway-ssl-portal)
- Disable [TLS v1.0 and v1.1](https://docs.microsoft.com/azure/application-gateway/application-gateway-end-to-end-ssl-powershell)
- [Web application firewall](https://docs.microsoft.com/azure/application-gateway/application-gateway-web-application-firewall-overview) (prevention mode)
- [Prevention mode](https://docs.microsoft.com/azure/application-gateway/application-gateway-web-application-firewall-portal) with OWASP 3.0 ruleset
- Enable [diagnostics logging](https://docs.microsoft.com/azure/application-gateway/application-gateway-diagnostics)
- [Custom health probes](https://docs.microsoft.com/azure/application-gateway/application-gateway-create-gateway-portal)
- [Azure Security Center](https://azure.microsoft.com/services/security-center) and [Azure Advisor](https://docs.microsoft.com/azure/advisor/advisor-security-recommendations) provide additional protection and notifications. Azure Security Center also provides a reputation system.

### Logging and auditing

Azure services extensively log system and user activity, as well as system health:
- **Activity logs**: [Activity logs](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-activity-logs) provide insight into operations performed on resources in a subscription. Activity logs can help determine an operation's initiator, time of occurrence, and status.
- **Diagnostic logs**: [Diagnostic logs](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs) include all logs emitted by every resource. These logs include Windows event system logs, Azure Storage logs, Key Vault audit logs, and Application Gateway access and firewall logs. All diagnostic logs write to a centralized and encrypted Azure storage account for archival. The retention is user-configurable, up to 730 days, to meet organization-specific retention requirements.

**Log Analytics**: These logs are consolidated in [Log Analytics](https://azure.microsoft.com/services/log-analytics/) for processing, storing, and dashboard reporting. Once collected, the data is organized into separate tables for each data type, which allows all data to be analysed together regardless of its original source. Furthermore, Azure Security Center integrates with Log Analytics allowing customers to use Log Analytics queries to access their security event data and combine it with data from other services.

The following Log Analytics [management solutions](https://docs.microsoft.com/azure/log-analytics/log-analytics-add-solutions) are included as a part of this architecture:
-	[Active Directory Assessment](https://docs.microsoft.com/azure/log-analytics/log-analytics-ad-assessment): The Active Directory Health Check solution assesses the risk and health of server environments on a regular interval and provides a prioritized list of recommendations specific to the deployed server infrastructure.
- [SQL Assessment](https://docs.microsoft.com/azure/log-analytics/log-analytics-sql-assessment): The SQL Health Check solution assesses the risk and health of server environments on a regular interval and provides customers with a prioritized list of recommendations specific to the deployed server infrastructure.
- [Agent Health](https://docs.microsoft.com/azure/operations-management-suite/oms-solution-agenthealth): The Agent Health solution reports how many agents are deployed and their geographic distribution, as well as how many agents which are unresponsive and the number of agents which are submitting operational data.
-	[Activity Log Analytics](https://docs.microsoft.com/azure/log-analytics/log-analytics-activity): The Activity Log Analytics solution assists with analysis of the Azure activity logs across all Azure subscriptions for a customer.

**Azure Automation**: [Azure Automation](https://docs.microsoft.com/azure/automation/automation-hybrid-runbook-worker) stores, runs, and manages runbooks. In this solution, runbooks help collect logs from Azure SQL Database. The Automation [Change Tracking](https://docs.microsoft.com/azure/automation/automation-change-tracking) solution enables customers to easily identify changes in the environment.

**Azure Monitor**:
[Azure Monitor](https://docs.microsoft.com/azure/monitoring-and-diagnostics/) helps users track performance, maintain security, and identify trends by enabling organizations to audit, create alerts, and archive data, including tracking API calls in their Azure resources.

Azure Network Watcher: [Azure Network Watcher]9https://docs.microsoft.com/en-us/azure/network-watcher/network-watcher-monitoring-overview) provides tools to monitor, diagnose, view metrics, and enable or disable logs for resources in an Azure virtual network.  Commonwealth entities should implement Network Watcher flow logs for NSGs and Virtual Machines. These logs should be stored in a dedicated storage account that only security logs are stored in and access to the storage account should be secured with Role Based Access Controls.

## Threat model

The data flow diagram for this reference architecture is available for [download](https://aka.ms/au-protected-paaswa-tm) or can be found below. This model can help customers understand the points of potential risk in the system infrastructure when making modifications.

![PaaS Web Application for AU-PROTECTED Threat Model](images/au-protected-paaswa-threat-model.png?raw=true "PaaS Web Application for AU-PROTECTED threat model diagram")

## Compliance documentation
This compliance documentation is produced by Microsoft based on platforms and services available from Microsoft. Due to the wide variety of customer deployments, this documentation provides a generalized approach for a solution only hosted in the Azure environment. Customers may identify and use alternative products and services based on their own operating environments and business outcomes. Customers choosing to use on-premises resources must address the security and operations for those on-premises resources. The documented solution can be customized by customers to address their specific on-premises and security requirements.

The [Azure Security and Compliance Blueprint - AU-PROTECTED Customer Responsibility Matrix](https://aka.ms/au-protected-crm) lists all security controls required by AU-Prot. This matrix details whether the implementation of each control is the responsibility of Microsoft, the customer, or shared between the two.

The [Azure Security and Compliance Blueprint - AU-PROTECTED PaaS Web Application Implementation Matrix](https://aka.ms/au-protected-paaswa-cim) provides information on which AU-PROTECTED controls are addressed by the PaaS web application architecture, including detailed descriptions of how the implementation meets the requirements of each covered control.

## Guidance and recommendations
### VPN and ExpressRoute

For classified information a secure IPSec VPN tunnel needs to be configured to securely establish a connection to the resources deployed as a part of this IaaS web application reference architecture. By appropriately setting up an IPSec VPN, customers can add a layer of protection for data in transit.

By implementing a secure IPSec VPN tunnel with Azure, a virtual private connection between an on-premises network and an Azure virtual network can be created. This connection can take place over the Internet and allows customers to securely "tunnel" information inside an encrypted link between the customer's network and Azure. Site-to-site VPN is a secure, mature technology that has been deployed by enterprises of all sizes for decades. 

Because traffic within the VPN tunnel does traverse the Internet with a site-to-site VPN, Microsoft offers a private connection option. Azure ExpressRoute is a dedicated link between Azure and an on-premises location or an Exchange hosting provider and is considered a private network. As ExpressRoute connections do not go over the Internet, these connections offer more reliability, faster speeds and lower latencies than typical connections over the Internet. Furthermore, because this is a direct connection of customer's telecommunication provider, the data does not travel over the Internet and therefore is not exposed to it.

Best practices for implementing a secure hybrid network that extends an on-premises network to Azure are [available](https://docs.microsoft.com/azure/architecture/reference-architectures/dmz/secure-vnet-hybrid). 

To help protect classified data, whether using the Internet or Azure ExpressRoute, customers must configure their IPSec VPN by applying the following settings:

•	The customer VPN initiator must be configured for a SA lifetime of no greater than 14400 seconds.
•	The customer VPN initiator must disable IKEv1 aggressive mode.
•	The customer VPN initiator must configure Perfect Forward Secrecy.
•	The customer VPN Initiator must configure the use of HMAC-SHA256 or greater.

Configuration options for VPN devices and IPSec/ IKE parameters is [available](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpn-devices) for review.

### Azure Active Directory setup
[Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-whatis) is essential to managing the deployment and provisioning access to personnel interacting with the environment. An existing Windows Server Active Directory can be integrated with Azure Active Directory in [four clicks](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnect-get-started-express).

Furthermore, [Azure Active Directory Connect](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnect) allows customers to configure federation with on-premises [Active Directory Federation Services]( https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnect-azure-adfs) and Azure Active Directory. With federation sign-in, customers can enable users to sign in to Azure Active Directory-based services with their on-premises passwords and without having to enter their passwords again while on the corporate network. By using the federation option with Active Directory Federation Services, you can deploy a new installation of Active Directory Federation Services, or you can specify an existing installation in a Windows Server 2012 R2 farm.

To prevent classified data from synchronizing to Azure Active Directory, customers can restrict the attributes that are replicated to Azure Active Directory by applying the following settings in Azure Active Directory Connect:

- [Enable filtering](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnectsync-configure-filtering)
- [Disable password hash synchronization](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnectsync-implement-password-hash-synchronization)
-	[Disable password writeback](https://docs.microsoft.com/azure/active-directory/authentication/quickstart-sspr)
-	[Disable device writeback](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnect-feature-device-writeback)
-	Leave the default settings for [prevent accidental deletes](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnectsync-feature-prevent-accidental-deletes) and [automatic upgrade](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnect-feature-automatic-upgrade)


## Disclaimer

 - This document is for informational purposes only. MICROSOFT MAKES NO WARRANTIES, EXPRESS, IMPLIED, OR STATUTORY, AS TO THE INFORMATION IN THIS DOCUMENT. This document is provided "as-is." Information and views expressed in this document, including URL and other Internet website references, may change without notice. Customers reading this document bear the risk of using it.
 - This document does not provide customers with any legal rights to any intellectual property in any Microsoft product or solutions.
 - Customers may copy and use this document for internal reference purposes.
 - Certain recommendations in this document may result in increased data, network, or compute resource usage in Azure, and may increase a customer's Azure license or subscription costs.
 - This architecture is intended to serve as a foundation for customers to adjust to their specific requirements and should not be used as-is in a production environment.
 - This document is developed as a reference and should not be used to define all means by which a customer can meet specific compliance requirements and regulations. Customers should seek legal support from their organization on approved customer implementations.
