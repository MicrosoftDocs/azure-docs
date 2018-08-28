---
title: Azure Security and Compliance Blueprint - IaaS Web Application for NIST SP 800-171
description: Azure Security and Compliance Blueprint - IaaS Web Application NIST SP 800-171
services: security
author: jomolesk

ms.assetid: 1f1ad27f-32c3-4e76-abb9-ea768d01747f
ms.service: security
ms.topic: article
ms.date: 07/31/2018
ms.author: jomolesk
---
# Azure Security and Compliance Blueprint - IaaS Web Application for NIST SP 800-171

## Overview
[NIST Special Publication 800-171](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-171.pdf) provides guidelines for protecting the controlled unclassified information (CUI) that resides in nonfederal information systems and organizations. NIST SP 800-171 establishes 14 families of security requirements for protecting the confidentiality of CUI.

This Azure Security and Compliance Blueprint provides guidance to help customers deploy a web application architecture in Azure that implements a subset of NIST SP 800-171 controls. This solution demonstrates ways in which customers can meet specific security and compliance requirements and serves as a foundation for customers to build and configure their own web applications in Azure.

This reference architecture, associated implementation guide, and threat model are intended to serve as a foundation for customers to adapt to their specific requirements and shouldn't be used as-is in a production environment. Deploying this architecture without modification is insufficient to completely meet the requirements of NIST SP 800-171. Customers are responsible for conducting appropriate security and compliance assessments of any solution built using this architecture, as requirements may vary based on the specifics of each customer's implementation.

## Architecture diagram and components
This Azure Security and Compliance Blueprint deploys a reference architecture for an IaaS web application with a SQL Server backend. The architecture includes a web tier, data tier, Active Directory infrastructure, Application Gateway, and Load Balancer. Virtual machines deployed to the web and data tiers are configured in an availability set, and SQL Server instances are configured in an Always On availability group for high availability. Virtual machines are domain-joined, and Active Directory group policies are used to enforce security and compliance configurations at the operating system level.

The entire solution is built upon Azure Storage which customers configure from the Azure portal. Azure Storage encrypts all data with Storage Service Encryption to maintain confidentiality of data at rest. Geographic Redundant Storage ensures that an adverse event at the customer's primary data center will not result in a loss of data, as a second copy will be stored in a separate location hundreds of miles away.

For enhanced security, all resources in this solution are managed as a resource group through Azure Resource Manager. Azure Active Directory role-based access control is used for controlling access to deployed resources and keys in Azure Key Vault. System health is monitored through Azure Monitor. Customers configure both monitoring services to capture logs and display system health in a single, easily navigable dashboard.

A management bastion host provides a secure connection for administrators to access deployed resources. **Microsoft recommends configuring a VPN or ExpressRoute connection for management and data import into the reference architecture subnet.**


![IaaS Web Application for NIST SP 800-171 reference architecture diagram](images/nist171-iaaswa-architecture.png "IaaS Web Application for NIST SP 800-171 reference architecture diagram")

This solution uses the following Azure services. Further details are in the [deployment architecture](#deployment-architecture) section.

- Azure Virtual Machines
	- (1) management/bastion (Windows Server 2016 Datacenter)
	- (2) Active Directory domain controller (Windows Server 2016 Datacenter)
	- (2) SQL Server cluster node (SQL Server 2017 on Windows Server 2016)
	- (2) Web/IIS (Windows Server 2016 Datacenter)
- Azure Virtual Network
	- (1) /16 network
	- (5) /24 networks
	- (5) network security groups
- Availability Sets
	- (1) Active Directory domain controllers
	- (1) SQL cluster nodes
	- (1) Web/IIS
- Azure Application Gateway
	- (1) Web application firewall
		- Firewall mode: prevention
		- Rule set: OWASP 3.0
		- Listener port: 443
- Azure Active Directory
- Azure Key Vault
- Azure Load Balancer
- Azure Monitor
- Azure Resource Manager
- Azure Security Center
- Azure Storage
- Azure Log Analytics
- Azure Automation
- Cloud Witness
- Recovery Services Vault

## Deployment architecture
The following section details the deployment and implementation elements.

**Bastion host**: The bastion host is the single point of entry that allows users to access the deployed resources in this environment. The bastion host provides a secure connection to deployed resources by only allowing remote traffic from public IP addresses on a safe list. To permit remote desktop (RDP) traffic, the source of the traffic needs to be defined in the network security group.

This solution creates a virtual machine as a domain-joined bastion host with the following configurations:
-	[Antimalware extension](https://docs.microsoft.com/azure/security/azure-security-antimalware)
-	[Azure Diagnostics extension](https://docs.microsoft.com/azure/virtual-machines/virtual-machines-windows-extensions-diagnostics-template)
-	[Azure Disk Encryption](https://docs.microsoft.com/azure/security/azure-security-disk-encryption) using Azure Key Vault
-	An [auto-shutdown policy](https://azure.microsoft.com/blog/announcing-auto-shutdown-for-vms-using-azure-resource-manager/) to reduce consumption of virtual machine resources when not in use
-	[Windows Defender Credential Guard](https://docs.microsoft.com/windows/access-protection/credential-guard/credential-guard) enabled so that credentials and other secrets run in a protected environment that is isolated from the running operating system

### Virtual network
The architecture defines a private virtual network with an address space of 10.200.0.0/16.

**Network security groups**: This solution deploys resources in an architecture with a separate web subnet, database subnet, Active Directory subnet, and management subnet inside of a virtual network. Subnets are logically separated by network security group rules applied to the individual subnets to restrict traffic between subnets to only that necessary for system and management functionality.

See the configuration for [network security groups](https://github.com/Azure/fedramp-iaas-webapp/blob/master/nestedtemplates/virtualNetworkNSG.json) deployed with this solution. Organizations can configure Network Security groups by editing the file above using [this documentation](https://docs.microsoft.com/azure/virtual-network/virtual-networks-nsg) as a guide.

Each of the subnets has a dedicated network security group:
- 1 network security group for Application Gateway (LBNSG)
- 1 network security group for bastion host (MGTNSG)
- 1 network security group for primary and backup domain controllers (ADNSG)
- 1 network security group for SQL Servers and Cloud Witness (SQLNSG)
- 1 network security group for web tier (WEBNSG)

### Data in transit
Azure encrypts all communications to and from Azure datacenters by default. Additionally, all transactions to Azure Storage through the Azure portal occur via HTTPS.

### Data at rest
The architecture protects data at rest through multiple measures, including encryption and database auditing.

**Azure Storage**: To meet encrypted data at rest requirements, all [Azure Storage](https://azure.microsoft.com/services/storage/) uses [Storage Service Encryption](https://docs.microsoft.com/azure/storage/storage-service-encryption). This helps protect and safeguard data in support of organizational security commitments and compliance requirements defined by the NIST SP 800-171.

**Azure Disk Encryption**: Azure Disk Encryption is used to encrypted Windows IaaS virtual machine disks. [Azure Disk Encryption](https://docs.microsoft.com/azure/security/azure-security-disk-encryption) leverages the BitLocker feature of Windows to provide volume encryption for operating system and data disks. The solution is integrated with Azure Key Vault to help control and manage the disk-encryption keys.

**SQL Server**: The SQL Server instance uses the following database security measures:
-	[SQL Server auditing](https://docs.microsoft.com/sql/relational-databases/security/auditing/sql-server-audit-database-engine?view=sql-server-2017) tracks database events and writes them to audit logs.
-	[Transparent data encryption](https://docs.microsoft.com/sql/relational-databases/security/encryption/transparent-data-encryption?view=sql-server-2017) performs real-time encryption and decryption of the database, associated backups, and transaction log files to protect information at rest. Transparent data encryption provides assurance that stored data has not been subject to unauthorized access.
-	[Firewall rules](https://docs.microsoft.com/azure/sql-database/sql-database-firewall-configure) prevent all access to database servers until proper permissions are granted. The firewall grants access to databases based on the originating IP address of each request.
-	[Encrypted Columns](https://docs.microsoft.com/sql/relational-databases/security/encryption/always-encrypted-wizard?view=sql-server-2017) ensure that sensitive data never appears as plaintext inside the database system. After enabling data encryption, only client applications or application servers with access to the keys can access plaintext data.
- [Dynamic data masking](https://docs.microsoft.com/sql/relational-databases/security/dynamic-data-masking?view=sql-server-2017) limits sensitive data exposure by masking the data to non-privileged users or applications. Dynamic data masking can automatically discover potentially sensitive data and suggest the appropriate masks to be applied. This helps with reducing access such that sensitive data does not exit the database via unauthorized access. **Customers are responsible for adjusting dynamic data masking settings to adhere to their database schema.**

### Identity management
The following technologies provide capabilities to manage access to data in the Azure environment:
-	[Azure Active Directory](https://azure.microsoft.com/services/active-directory/) is Microsoft's multi-tenant cloud-based directory and identity management service. All users for this solution are created in Azure Active Directory, including users accessing the SQL Server.
-	Authentication to the application is performed using Azure Active Directory. For more information, see [Integrating applications with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/develop/active-directory-integrating-applications).
-	[Azure role-based access control](https://docs.microsoft.com/azure/active-directory/role-based-access-control-configure) enables administrators to define fine-grained access permissions to grant only the amount of access that users need to perform their jobs. Instead of giving every user unrestricted permissions for Azure resources, administrators can allow only certain actions for accessing data. Subscription access is limited to the subscription administrator.
- [Azure Active Directory Privileged Identity Management](https://docs.microsoft.com/azure/active-directory/active-directory-privileged-identity-management-getting-started) enables customers to minimize the number of users who have access to certain resources.  Administrators can use Azure Active Directory Privileged Identity Management to discover, restrict, and monitor privileged identities and their access to resources. This functionality can also be used to enforce on-demand, just-in-time administrative access when needed.
- [Azure Active Directory Identity Protection](https://docs.microsoft.com/azure/active-directory/active-directory-identityprotection) detects potential vulnerabilities affecting an organization’s identities, configures automated responses to detected suspicious actions related to an organization’s identities, and investigates suspicious incidents to take appropriate action to resolve them.

### Security
**Secrets management**:
The solution uses [Azure Key Vault](https://azure.microsoft.com/services/key-vault/) for the management of keys and secrets. Azure Key Vault helps safeguard cryptographic keys and secrets used by cloud applications and services. The following Azure Key Vault capabilities help customers protect data:
- Advanced access policies are configured on a need basis.
- Key Vault access policies are defined with minimum required permissions to keys and secrets.
- All keys and secrets in Key Vault have expiration dates.
- All keys in Key Vault are protected by specialized hardware security modules The key type is a hardware security module protected 2048-bit RSA key.
- All users and identities are granted minimum required permissions using role-based access control.
- Diagnostics logs for Key Vault are enabled with a retention period of at least 365 days.
- Permitted cryptographic operations for keys are restricted to the ones required.
- The solution is integrated with Azure Key Vault to manage IaaS virtual machine disk-encryption keys and secrets.

**Patch management**: Windows virtual machines deployed as part of this reference architecture are configured by default to receive automatic updates from Windows Update Service. This solution also includes the [Azure Automation](https://docs.microsoft.com/azure/automation/automation-intro) service through which updated deployments can be created to patch virtual machines when needed.

**Malware protection**: [Microsoft Antimalware](https://docs.microsoft.com/azure/security/azure-security-antimalware) for Virtual Machines provides real-time protection capability that helps identify and remove viruses, spyware, and other malicious software, with configurable alerts when known malicious or unwanted software attempts to install or run on protected virtual machines.

**Azure Security Center**: With [Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-intro), customers can centrally apply and manage security policies across workloads, limit exposure to threats, and detect and respond to attacks. Additionally, Azure Security Center accesses existing configurations of Azure services to provide configuration and service recommendations to help improve security posture and protect data.

Azure Security Center uses a variety of detection capabilities to alert customers of potential attacks targeting their environments. These alerts contain valuable information about what triggered the alert, the resources targeted, and the source of the attack. Azure Security Center has a set of [predefined security alerts](https://docs.microsoft.com/azure/security-center/security-center-alerts-type), which are triggered when a threat, or suspicious activity takes place. [Custom alert rules](https://docs.microsoft.com/azure/security-center/security-center-custom-alert) in Azure Security Center allow customers to define new security alerts based on data that is already collected from their environment.

Azure Security Center provides prioritized security alerts and incidents, making it simpler for customers to discover and address potential security issues. A [threat intelligence report](https://docs.microsoft.com/azure/security-center/security-center-threat-report) is generated for each detected threat to assist incident response teams in investigating and remediating threats.

Furthermore, this reference architecture utilizes the [vulnerability assessment](https://docs.microsoft.com/azure/security-center/security-center-vulnerability-assessment-recommendations) in Azure Security Center. Once configured, a partner agent (e.g. Qualys) reports vulnerability data to the partner’s management platform. In turn, the partner's management platform provides vulnerability and health monitoring data back to Azure Security Center, allowing customers to quickly identify vulnerable virtual machines.

**Application Gateway**:
The architecture reduces the risk of security vulnerabilities using an Application Gateway with a web application firewall configured and the OWASP ruleset enabled. Additional capabilities include:

- [End-to-end-SSL](https://docs.microsoft.com/azure/application-gateway/application-gateway-end-to-end-ssl-powershell)
- Enable [SSL Offload](https://docs.microsoft.com/azure/application-gateway/application-gateway-ssl-portal)
- Disable [TLS v1.0 and v1.1](https://docs.microsoft.com/azure/application-gateway/application-gateway-end-to-end-ssl-powershell)
- [Web application firewall](https://docs.microsoft.com/azure/application-gateway/application-gateway-web-application-firewall-overview) (prevention mode)
- [Prevention mode](https://docs.microsoft.com/azure/application-gateway/application-gateway-web-application-firewall-portal) with OWASP 3.0 ruleset
- Enable [diagnostics logging](https://docs.microsoft.com/azure/application-gateway/application-gateway-diagnostics)
- [Custom health probes](https://docs.microsoft.com/azure/application-gateway/application-gateway-create-gateway-portal)
- [Azure Security Center](https://azure.microsoft.com/services/security-center) and [Azure Advisor](https://docs.microsoft.com/azure/advisor/advisor-security-recommendations) provide additional protection and notifications. Azure Security Center also provides a reputation system.

### Business continuity

**High availability**: The solution deploys all virtual machines in an [Availability Set](https://docs.microsoft.com/azure/virtual-machines/windows/tutorial-availability-sets). Availability sets ensure that the virtual machines are distributed across multiple isolated hardware clusters to improve availability. At least one virtual machine is available during a planned or unplanned maintenance event, meeting the 99.95% Azure SLA.

**Recovery Services Vault**: The [Recovery Services Vault](https://docs.microsoft.com/azure/backup/backup-azure-recovery-services-vault-overview) houses backup data and protects all configurations of Azure Virtual Machines in this architecture. With a Recovery Services Vault, customers can restore files and folders from an IaaS VM without restoring the entire VM, enabling faster restore times.

**Cloud Witness**: [Cloud Witness](https://docs.microsoft.com/windows-server/failover-clustering/whats-new-in-failover-clustering#BKMK_CloudWitness) is a type of Failover Cluster quorum witness in Windows Server 2016 that leverages Azure as the arbitration point. The Cloud Witness, like any other quorum witness, gets a vote and can participate in the quorum calculations, but it uses the standard publicly available Azure Blob Storage. This eliminates the extra maintenance overhead of VMs hosted in a public cloud.

### Logging and auditing

Azure services extensively log system and user activity, as well as system health:
- **Activity logs**: [Activity logs](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-activity-logs) provide insight into operations performed on resources in a subscription. Activity logs can help determine an operation's initiator, time of occurrence, and status.
- **Diagnostic logs**: [Diagnostic logs](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs) include all logs emitted by every resource. These logs include Windows event system logs, Azure Storage logs, Key Vault audit logs, and Application Gateway access and firewall logs. All diagnostic logs write to a centralized and encrypted Azure storage account for archival. The retention is user-configurable, up to 730 days, to meet organization-specific retention requirements.

**Log Analytics**: These logs are consolidated in [Log Analytics](https://azure.microsoft.com/services/log-analytics/) for processing, storing, and dashboard reporting. Once collected, the data is organized into separate tables for each data type within Operations Management Suite workspaces, which allows all data to be analyzed together regardless of its original source. Furthermore, Azure Security Center integrates with Log Analytics allowing customers to use Log Analytics queries to access their security event data and combine it with data from other services.

The following Log Analytics [management solutions](https://docs.microsoft.com/azure/log-analytics/log-analytics-add-solutions) are included as a part of this architecture:
-	[Active Directory Assessment](https://docs.microsoft.com/azure/log-analytics/log-analytics-ad-assessment): The Active Directory Health Check solution assesses the risk and health of server environments on a regular interval and provides a prioritized list of recommendations specific to the deployed server infrastructure.
- [SQL Assessment](https://docs.microsoft.com/azure/log-analytics/log-analytics-sql-assessment): The SQL Health Check solution assesses the risk and health of server environments on a regular interval and provides customers with a prioritized list of recommendations specific to the deployed server infrastructure.
- [Agent Health](https://docs.microsoft.com/azure/operations-management-suite/oms-solution-agenthealth): The Agent Health solution reports how many agents are deployed and their geographic distribution, as well as how many agents which are unresponsive and the number of agents which are submitting operational data.
-	[Activity Log Analytics](https://docs.microsoft.com/azure/log-analytics/log-analytics-activity): The Activity Log Analytics solution assists with analysis of the Azure activity logs across all Azure subscriptions for a customer.

**Azure Automation**: [Azure Automation](https://docs.microsoft.com/azure/automation/automation-hybrid-runbook-worker) stores, runs, and manages runbooks. In this solution, runbooks help collect logs from Azure SQL Server. The Automation [Change Tracking](https://docs.microsoft.com/azure/automation/automation-change-tracking) solution enables customers to easily identify changes in the environment.

**Azure Monitor**:
[Azure Monitor](https://docs.microsoft.com/azure/monitoring-and-diagnostics/) helps users track performance, maintain security, and identify trends by enabling organizations to audit, create alerts, and archive data, including tracking API calls in their Azure resources.

## Threat model

The data flow diagram for this reference architecture is available for [download](https://aka.ms/nist171-iaaswa-tm) or can be found below. This model can help customers understand the points of potential risk in the system infrastructure when making modifications.

![IaaS Web Application for NIST SP 800-171 threat model](images/nist171-iaaswa-threat-model.png "IaaS Web Application for NIST SP 800-171 threat model")

## Compliance documentation

The [Azure Security and Compliance Blueprint - NIST SP 800-171 Customer Responsibility Matrix](https://aka.ms/nist171-crm) lists all security controls required by NIST SP 800-171. This matrix details whether the implementation of each control is the responsibility of Microsoft, the customer, or shared between the two.

The [Azure Security and Compliance Blueprint - NIST SP 800-171 IaaS Web Application Control Implementation Matrix](https://aka.ms/nist171-iaaswa-cim) provides information on which NIST SP 800-171 controls are addressed by the IaaS web application architecture, including detailed descriptions of how the implementation meets the requirements of each covered control.

## Guidance and recommendations
### VPN and ExpressRoute
A secure VPN tunnel or [ExpressRoute](https://docs.microsoft.com/azure/expressroute/expressroute-introduction) needs to be configured to securely establish a connection to the resources deployed as a part of this IaaS Web Application reference architecture. By appropriately setting up a VPN or ExpressRoute, customers can add a layer of protection for data in transit.

By implementing a secure VPN tunnel with Azure, a virtual private connection between an on-premises network and an Azure Virtual Network can be created. This connection takes place over the Internet and allows customers to securely “tunnel” information inside an encrypted link between the customer's network and Azure. Site-to-site VPN is a secure, mature technology that has been deployed by enterprises of all sizes for decades. The [IPsec tunnel mode](https://docs.microsoft.com/previous-versions/windows/it-pro/windows-server-2003/cc786385(v=ws.10)) is used in this option as an encryption mechanism.

Because traffic within the VPN tunnel does traverse the Internet with a site-to-site VPN, Microsoft offers another, even more secure connection option. Azure ExpressRoute is a dedicated WAN link between Azure and an on-premises location or an Exchange hosting provider. As ExpressRoute connections do not go over the Internet, these connections offer more reliability, faster speeds, lower latencies, and higher security than typical connections over the Internet. Furthermore, because this is a direct connection of customer's telecommunication provider, the data does not travel over the Internet and therefore is not exposed to it.

Best practices for implementing a secure hybrid network that extends an on-premises network to Azure are [available](https://docs.microsoft.com/azure/architecture/reference-architectures/dmz/secure-vnet-hybrid).

## Disclaimer

- This document is for informational purposes only. MICROSOFT MAKES NO WARRANTIES, EXPRESS, IMPLIED, OR STATUTORY, AS TO THE INFORMATION IN THIS DOCUMENT. This document is provided "as-is." Information and views expressed in this document, including URL and other Internet website references, may change without notice. Customers reading this document bear the risk of using it.  
- This document does not provide customers with any legal rights to any intellectual property in any Microsoft product or solutions.  
- Customers may copy and use this document for internal reference purposes.  
- Certain recommendations in this document may result in increased data, network, or compute resource usage in Azure, and may increase a customer's Azure license or subscription costs.  
- This architecture is intended to serve as a foundation for customers to adjust to their specific requirements and should not be used as-is in a production environment.
- This document is developed as a reference and should not be used to define all means by which a customer can meet specific compliance requirements and regulations. Customers should seek legal support from their organization on approved customer implementations.
