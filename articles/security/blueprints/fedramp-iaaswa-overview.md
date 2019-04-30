---

title: Azure Security and Compliance Blueprint - IaaS Web Application for FedRAMP
description: Azure Security and Compliance Blueprint - IaaS Web Application for FedRAMP
services: security
documentationcenter: na
author: jomolesk
manager: barbkess
editor: tomsh

ms.assetid: 8fe47cff-9c24-49e0-aa11-06ff9892a468
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/08/2018
ms.author: jomolesk

---

# Azure Security and Compliance Blueprint: IaaS Web Application for FedRAMP

## Overview

The [Federal Risk and Authorization Management Program (FedRAMP)](https://www.fedramp.gov) is a U.S. government-wide program that provides a standardized approach to security assessment, authorization, and continuous monitoring for cloud products and services. This Azure Security and Compliance Blueprint Automation provides guidance for the deployment of a FedRAMP-compliant infrastructure as a service (IaaS) environment suitable for a simple Internet-facing web application. This solution automates deployment and configuration of Azure resources for a common reference architecture, demonstrating ways in which customers can meet specific security and compliance requirements and serves as a foundation for customers to build and configure their own solutions on Azure. The solution implements a subset of controls from the FedRAMP High baseline, based on NIST SP 800-53. For more information about FedRAMP requirements and this solution, see the [compliance documentation](#compliance-documentation).
> [!NOTE]
> This solution deploys to Azure Government.

This Azure Security and Compliance Blueprint Automation automatically deploys an IaaS web application reference architecture with pre-configured security controls to help customers achieve compliance with FedRAMP requirements. The solution consists of Azure Resource Manager templates and PowerShell scripts that guide resource deployment and configuration.

This architecture is intended to serve as a foundation for customers to adjust to their specific requirements and should not be used as-is in a production environment. Deploying an application into this environment without modification is not sufficient to completely meet the requirements of the FedRAMP High baseline. Please note the following:
- This architecture provides a baseline to help customers use Azure in a FedRAMP-compliant manner.
- Customers are responsible for conducting appropriate security and compliance assessment of any solution built using this architecture, as requirements may vary based on the specifics of each customer's implementation.

For a quick overview of how this solution works, watch this [video](https://aka.ms/fedrampblueprintvideo) explaining and demonstrating its deployment.

Click [here](https://aka.ms/fedrampblueprintrepo) for deployment instructions.

## Architecture diagram and components
This solution deploys a reference architecture for an IaaS web application with a SQL Server backend. The architecture includes a web tier, data tier, Active Directory infrastructure, Application Gateway, and Load Balancer. Virtual machines deployed to the web and data tiers are configured in an Availability Set, and SQL Server instances are configured in an AlwaysOn availability group for high availability. Virtual machines are domain-joined, and Active Directory group policies are used to enforce security and compliance configurations at the operating system level. A bastion host provides a secure connection for administrators to access deployed resources. **Azure recommends configuring a VPN or Azure ExpressRoute connection for management and data import into the reference architecture subnet.**

![IaaS Web Application for FedRAMP reference architecture diagram](images/fedramp-iaaswa-architecture.png?raw=true "IaaS Web Application for FedRAMP reference architecture diagram")

This solution uses the following Azure services. Details of the deployment architecture are located in the [deployment architecture](#deployment-architecture) section.

- Azure Virtual Machines
	- (1) bastion host (Windows Server 2016 Datacenter)
	- (2) Active Directory domain controller (Windows Server 2016 Datacenter)
	- (2) SQL Server cluster node (SQL Server 2017 on Windows Server 2016)
	- (2) Web/IIS (Windows Server 2016 Datacenter)
- Availability Sets
	- (1) Active Directory domain controllers
	- (1) SQL cluster nodes
	- (1) Web/IIS
- Azure Virtual Network
	- (1) /16 virtual networks
	- (5) /24 subnets
	- DNS settings are set to both domain controllers
- Azure Load Balancer
- Azure Application Gateway
	- (1) WAF Application Gateway enabled
		- firewall mode: prevention
		- rule set: OWASP 3.0
		- listener: port 443
- Azure Storage
	- (7) Geo-redundant storage accounts
- Azure Cloud Witness
- Recovery Services vault
- Azure Key Vault
- Azure Active Directory (Azure AD)
- Azure Resource Manager
- Azure Monitor (logs)

## Deployment architecture

The following section details the development and implementation elements.

**Bastion host**: The bastion host is the single point of entry that provides a secure connection for administrators to access deployed resources. The bastion host's NSG allows connections only on TCP port 3389 for RDP. Customers can further configure the bastion host to meet organization system hardening requirements.

### Virtual network
The architecture defines a private virtual network with an address space of 10.200.0.0/16.

**Network security groups**: This solution deploys resources in an architecture with a separate web subnet, database subnet, Active Directory subnet, and management subnet inside of a virtual network. Subnets are logically separated by network security group rules applied to the individual subnets to restrict traffic between subnets to only that necessary for system and management functionality.

Please see the configuration for [network security groups](https://github.com/Azure/fedramp-iaas-webapp/blob/master/nestedtemplates/virtualNetworkNSG.json) deployed with this solution. Customers can configure network security groups by editing the file above using [this documentation](https://docs.microsoft.com/azure/virtual-network/virtual-networks-nsg) as a guide.

Each of the subnets has a dedicated network security group (NSG):
- 1 NSG for Application Gateway (LBNSG)
- 1 NSG for bastion host (MGTNSG)
- 1 NSG for Primary and Backup Domain Controllers (ADNSG)
- 1 NSG for SQL Servers (SQLNSG)
- 1 NSG for Web Tier (WEBNSG)

**Subnets**: Each subnet is associated with its corresponding NSG.

### Data at rest

The architecture protects data at rest by using several encryption measures.

**Azure Storage**: To meet data-at-rest encryption requirements, all storage accounts use [Storage Service Encryption](https://docs.microsoft.com/azure/storage/common/storage-service-encryption).

**SQL Server**: SQL Server is configured to use [Transparent Data Encryption (TDE)](https://docs.microsoft.com/sql/relational-databases/security/encryption/transparent-data-encryption), which performs real-time encryption and decryption of data and log files to protect information at rest. TDE provides assurance that stored data has not been subject to unauthorized access.

Customers may also configure the following SQL Server security measures:
-	[AD authentication and authorization](https://docs.microsoft.com/azure/sql-database/sql-database-aad-authentication) enables identity management of database users and other Microsoft services in one central location.
-	[SQL database auditing](https://docs.microsoft.com/azure/sql-database/sql-database-auditing-get-started) tracks database events and writes them to an audit log in an Azure storage account.
-	[Firewall rules](https://docs.microsoft.com/azure/sql-database/sql-database-firewall-configure) prevent all access to database servers until proper permissions are granted. The firewall grants access to databases based on the originating IP address of each request.
-	[SQL Threat Detection](https://docs.microsoft.com/azure/sql-database/sql-database-threat-detection-get-started) enables the detection and response to potential threats as they occur by providing security alerts for suspicious database activities, potential vulnerabilities, SQL injection attacks, and anomalous database access patterns.
-	[Always Encrypted columns](https://docs.microsoft.com/azure/sql-database/sql-database-always-encrypted-azure-key-vault) ensure that sensitive data never appears as plaintext inside the database system. After enabling data encryption, only client applications or app servers with access to the keys can access plaintext data.
-	[SQL Database dynamic data masking](https://docs.microsoft.com/azure/sql-database/sql-database-dynamic-data-masking-get-started) can be done after the reference architecture deploys. Customers will need to adjust dynamic data masking settings to adhere to their database schema.

**Azure Disk Encryption**: Azure Disk Encryption is used to encrypted Windows IaaS virtual machine disks. [Azure Disk Encryption](https://docs.microsoft.com/azure/security/azure-security-disk-encryption) leverages the BitLocker feature of Windows to provide volume encryption for OS and data disks. The solution is integrated with Azure Key Vault to help control and manage the disk-encryption keys.

### Identity management

The following technologies provide identity management capabilities in the Azure environment:
- [Azure Active Directory (Azure AD)](https://azure.microsoft.com/services/active-directory/) is Microsoft's multi-tenant cloud-based directory and identity management service.
- Authentication to a customer-deployed web application can be performed using Azure AD. For more information, see [Integrating applications with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/develop/active-directory-integrating-applications).  
- [Azure Role-based Access Control (RBAC)](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-portal) enables precisely focused access management for Azure. Subscription access is limited to the subscription administrator, and access to resources can be limited based on user role.
- A deployed IaaS Active Directory instance provides identity management at the OS-level for deployed IaaS virtual machines.

### Security
**Secrets management**: The solution uses [Azure Key Vault](https://azure.microsoft.com/services/key-vault/) for the management of keys and secrets. Azure Key Vault helps safeguard cryptographic keys and secrets used by cloud applications and services. Azure Key Vault helps manage IaaS virtual machine disk-encryption keys and secrets for this reference architecture.

**Patch management**: Windows virtual machines deployed by this Azure Security and Compliance Blueprint Automation are configured by default to receive automatic updates from Windows Update Service. This solution also deploys the Azure Automation solution through which Update Deployments can be created to deploy patches to Windows servers when needed.

**Malware protection**: [Microsoft Antimalware](https://docs.microsoft.com/azure/security/azure-security-antimalware) for Virtual Machines provides real-time protection capability that helps identify and remove viruses, spyware, and other malicious software, with configurable alerts when known malicious or unwanted software attempts to install or run on protected virtual machines.

**Application Gateway**:
The architecture reduces the risk of security vulnerabilities using an Application Gateway with web application firewall (WAF), and the OWASP ruleset enabled. Additional capabilities include:

- [End-to-End-SSL](https://docs.microsoft.com/azure/application-gateway/application-gateway-end-to-end-ssl-powershell)
- Enable [SSL Offload](https://docs.microsoft.com/azure/application-gateway/application-gateway-ssl-portal)
- Disable [TLS v1.0 and v1.1](https://docs.microsoft.com/azure/application-gateway/application-gateway-end-to-end-ssl-powershell)
- [Web application firewall](https://docs.microsoft.com/azure/application-gateway/application-gateway-web-application-firewall-overview) (WAF mode)
- [Prevention mode](https://docs.microsoft.com/azure/application-gateway/application-gateway-web-application-firewall-portal) with OWASP 3.0 ruleset

### Business continuity

**High availability**: At least one virtual machine is available during a planned or unplanned maintenance event, meeting the 99.95% Azure SLA. The solution deploys all web tier and data tier virtual machines in an [Availability Set](https://docs.microsoft.com/azure/virtual-machines/windows/tutorial-availability-sets). Availability sets ensure that the virtual machines are distributed across multiple isolated hardware clusters to improve availability. Furthermore, this solution deploys the SQL Server virtual machines in an Availability Set as an [AlwaysOn availability group](https://docs.microsoft.com/azure/virtual-machines/windows/sql/virtual-machines-windows-portal-sql-availability-group-overview). The Always On availability group feature provides for high-availability and disaster-recovery capabilities.

**Recovery Services Vault**: The [Recovery Services Vault](https://docs.microsoft.com/azure/backup/backup-azure-recovery-services-vault-overview) houses backup data and protects all configurations of Azure Virtual Machines in this architecture. With a Recovery Services Vault, customers can restore files and folders from an IaaS VM without restoring the entire VM, enabling faster restore times.

**Cloud Witness**: [Cloud Witness](https://docs.microsoft.com/windows-server/failover-clustering/whats-new-in-failover-clustering#BKMK_CloudWitness) is a type of Failover Cluster quorum witness in Windows Server 2016 that leverages Azure as the arbitration point. The Cloud Witness, like any other quorum witness, gets a vote and can participate in the quorum calculations, but it uses the standard publicly available Azure Blob Storage. This eliminates the extra maintenance overhead of VMs hosted in a public cloud.

### Logging and auditing

Azure Monitor logs provides extensive logging of system and user activity, as well as system health. The [Azure Monitor logs](https://docs.microsoft.com/azure/security/azure-security-disk-encryption) solution collects and analyzes data generated by resources in Azure and on-premises environments.

- **Activity logs:**  [Activity logs](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-activity-logs) provide insight into operations performed on resources in a subscription. Activity logs can help determine an operation's initiator, time of occurrence, and status.
- **Diagnostic logs:**  [Diagnostic logs](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs) are all logs emitted by every resource. These logs include Windows event system logs, Azure storage logs, Key Vault audit logs, and Application Gateway access and firewall logs.
- **Log archiving:**  All diagnostic logs write to a centralized and encrypted Azure storage account for archival. The retention is user-configurable, up to 730 days, to meet organization-specific retention requirements. These logs connect to Azure Monitor logs for processing, storing, and dashboard reporting.

Additionally, the following monitoring solutions are installed as a part of this architecture. Note that it's the customer's responsibility to configure these solutions to align with FedRAMP security controls:
-	[AD Assessment](https://docs.microsoft.com/azure/log-analytics/log-analytics-ad-assessment): The Active Directory Health Check solution assesses the risk and health of server environments on a regular interval and provides a prioritized list of recommendations specific to the deployed server infrastructure.
-	[Antimalware Assessment](https://docs.microsoft.com/azure/log-analytics/log-analytics-malware): The Antimalware solution reports on malware, threats, and protection status.
-	[Azure Automation](https://docs.microsoft.com/azure/automation/automation-hybrid-runbook-worker): The Azure Automation solution stores, runs, and manages runbooks.
-	[Security and Audit](https://docs.microsoft.com/azure/operations-management-suite/oms-security-getting-started): The Security and Audit dashboard provides a high-level insight into the security state of resources by providing metrics on security domains, notable issues, detections, threat intelligence, and common security queries.
-	[SQL Assessment](https://docs.microsoft.com/azure/log-analytics/log-analytics-sql-assessment): The SQL Health Check solution assesses the risk and health of server environments on a regular interval and provides customers with a prioritized list of recommendations specific to the deployed server infrastructure.
-	[Update Management](https://docs.microsoft.com/azure/operations-management-suite/oms-solution-update-management): The Update Management solution allows customer management of operating system security updates, including a status of available updates and the process of installing required updates.
-	[Agent Health](https://docs.microsoft.com/azure/operations-management-suite/oms-solution-agenthealth): The Agent Health solution reports how many agents are deployed and their geographic distribution, as well as how many agents which are unresponsive and the number of agents which are submitting operational data.
-	[Azure Activity Logs](https://docs.microsoft.com/azure/log-analytics/log-analytics-activity): The Activity Log Analytics solution assists with analysis of the Azure activity logs across all Azure subscriptions for a customer.
-	[Change Tracking](https://docs.microsoft.com/azure/log-analytics/log-analytics-activity): The Change Tracking solution allows customers to easily identify changes in the environment.

**Azure Monitor**
[Azure Monitor](https://docs.microsoft.com/azure/monitoring-and-diagnostics/) helps users track performance, maintain security, and identify trends by enabling organizations to audit, create alerts, and archive data, including tracking API calls in customers' Azure resources.

## Threat model
The data flow diagram for this reference architecture is available for [download](https://aka.ms/fedrampWAdfd) or can be found below. This model can help customers understand the points of potential risk in the system infrastructure when making modifications.

![IaaS Web Application for FedRAMP threat model](images/fedramp-iaaswa-threat-model.png?raw=true "IaaS Web Application for FedRAMP threat model")

## Compliance documentation

The [Azure Security and Compliance Blueprint - FedRAMP High Customer Responsibility Matrix](https://aka.ms/blueprinthighcrm) lists all security controls required by the FedRAMP High baseline. The matrix denotes whether the implementation of each control is the responsibility of Microsoft, the customer, or shared between the two.

The [Azure Security and Compliance Blueprint - FedRAMP IaaS Web Application High Control Implementation Matrix](https://aka.ms/blueprintwacim) lists all security controls required by the FedRAMP High baseline. The matrix provides information on which controls are covered by the IaaS web application architecture, including detailed descriptions of how the implementation meets the requirements of each covered control.

## Deploy the solution

This Azure Security and Compliance Blueprint Automation is comprised of JSON configuration files and PowerShell scripts that are handled by Azure Resource Manager's API service to deploy resources within Azure. Detailed deployment instructions are available [here](https://aka.ms/fedrampblueprintrepo).
> [!NOTE]
> This solution deploys to Azure Government.

#### Quickstart
1. Clone or download [this](https://aka.ms/fedrampblueprintrepo) GitHub repository to your local workstation.

2. Run the pre-deployment PowerShell script: azure-blueprint/predeploy/Orchestration_InitialSetup.ps1.

3. Click the button below, sign into the Azure portal, enter the required ARM template parameters, and click **Purchase**.

	[![Deploy to Azure](https://azuredeploy.net/AzureGov.png)](https://portal.azure.us/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Ffedramp-iaas-webapp%2Fmaster%2Fazuredeploy.json)

## Guidance and recommendations
### VPN and ExpressRoute
A secure VPN tunnel or [ExpressRoute](https://docs.microsoft.com/azure/expressroute/expressroute-introduction) needs to be configured to securely establish a connection to the resources deployed as a part of this IaaS Web Application reference architecture. By appropriately setting up a VPN or ExpressRoute, customers can add a layer of protection for data in transit.

By implementing a secure VPN tunnel with Azure, a virtual private connection between an on-premises network and an Azure Virtual Network can be created. This connection takes place over the Internet and allows customers to securely “tunnel” information inside an encrypted link between the customer's network and Azure. Site-to-Site VPN is a secure, mature technology that has been deployed by enterprises of all sizes for decades. The [IPsec tunnel mode](https://docs.microsoft.com/previous-versions/windows/it-pro/windows-server-2003/cc786385(v=ws.10)) is used in this option as an encryption mechanism.

Because traffic within the VPN tunnel does traverse the Internet with a site-to-site VPN, Microsoft offers another, even more secure connection option. Azure ExpressRoute is a dedicated WAN link between Azure and an on-premises location or an Exchange hosting provider. As ExpressRoute connections do not go over the Internet, these connections offer more reliability, faster speeds, lower latencies, and higher security than typical connections over the Internet. Furthermore, because this is a direct connection of customer's telecommunication provider, the data does not travel over the Internet and therefore is not exposed to it.

Best practices for implementing a secure hybrid network that extends an on-premises network to Azure are [available](https://docs.microsoft.com/azure/architecture/reference-architectures/dmz/secure-vnet-hybrid).

## Disclaimer

- This document is for informational purposes only. MICROSOFT MAKES NO WARRANTIES, EXPRESS, IMPLIED, OR STATUTORY, AS TO THE INFORMATION IN THIS DOCUMENT. This document is provided "as-is." Information and views expressed in this document, including URL and other Internet website references, may change without notice. Customers reading this document bear the risk of using it.  
- This document does not provide customers with any legal rights to any intellectual property in any Microsoft product or solutions.  
- Customers may copy and use this document for internal reference purposes.  
- Certain recommendations in this document may result in increased data, network, or compute resource usage in Azure, and may increase a customer's Azure license or subscription costs.  
- This architecture is intended to serve as a foundation for customers to adjust to their specific requirements and should not be used as-is in a production environment.
- This document is developed as a reference and should not be used to define all means by which a customer can meet specific compliance requirements and regulations. Customers should seek legal support from their organization on approved customer implementations.
