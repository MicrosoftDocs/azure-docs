---

title: Azure Blueprint Automation: Web Applications for FedRAMP
description: Azure Blueprint Automation: Web Applications for FedRAMP
services: security
documentationcenter: na
author: jomolesk
manager: mbaldwin
editor: tomsh

ms.assetid: 8fe47cff-9c24-49e0-aa11-06ff9892a468
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/15/2017
ms.author: jomolesk

---

# Azure Blueprint Automation: Web Applications for FedRAMP

## Overview

The [Federal Risk and Authorization Management Program (FedRAMP)](https://www.fedramp.gov), is a U.S. government-wide program that provides a standardized approach to security assessment, authorization, and continuous monitoring for cloud products and services. This Azure Blueprint Automation: Web Applications for FedRAMP provides guidance for the deployment of a FedRAMP-compliant infrastructure as a Service (IaaS) environment suitable for a simple Internet-facing web application. This solution automates deployment and configuration of Azure resources for a common reference architecture, demonstrating ways in which customers can meet specific security and compliance requirements and serves as a foundation for customers to build and configure their own solutions on Azure. The solution implements a subset of controls from the FedRAMP High baseline, based on NIST SP 800-53. For more information about FedRAMP High requirements and this solution, see [FedRAMP High Requirements - High-Level Overview](fedramp-controls-overview.md). ***Note: This solution deploys to Azure Government.***

This architecture is intended to serve as a foundation for customers to adjust to their specific requirements and should not be used as-is in a production environment. Deploying an application into this environment without modification is not sufficient to completely meet the requirements of the FedRAMP High baseline. Please note the following:
- This architecture provides a baseline to help customers use Azure in a FedRAMP-compliant manner.
- Customers are responsible for conducting appropriate security and compliance assessment of any solution built using this architecture, as requirements may vary based on the specifics of each customer's implementation. 

For a quick overview of how this solution works, watch this [video](https://aka.ms/fedrampblueprintvideo) explaining and demonstrating its deployment.

Click [here](https://aka.ms/fedrampblueprintrepo) for deployment instructions.

## Solution components

This Azure Blueprint Automation automatically deploys an IaaS web application reference architecture with pre-configured security controls to help customers achieve compliance with FedRAMP requirements. The solution consists of Azure Resource Manager templates and PowerShell scripts that guide resource deployment and configuration. Accompanying Azure Blueprint [compliance documentation](#compliance-documentation) is provided, indicating security control inheritance from Azure and the deployed resources and configurations that align with NIST SP 800-53 security controls, thereby enabling organizations to fast-track compliance obligations.

## Architecture diagram

This solution deploys a reference architecture for an IaaS web application with a database backend. The architecture includes a web tier, data tier, Active Directory infrastructure, application gateway, and load balancer. Virtual machines deployed to the web and data tiers are configured in an availability set, and SQL Server instances are configured in an AlwaysOn availability group for high availability. Virtual machines are domain-joined, and Active Directory group policies are used to enforce security and compliance configurations at the operating system level. A management jumpbox (bastion host) provides a secure connection for administrators to access deployed resources.

![alt text](images/fedramp-architectural-diagram.png?raw=true "IaaS web application Blueprint automation for FedRAMP-compliant environments")

This solution uses the following Azure services. Details of the deployment architecture are located in the [deployment architecture](#deployment-architecture) section.

* **Azure Virtual Machines**
	- (1) Management/bastion (Windows Server 2016 Datacenter)
	- (2) Active Directory domain controller (Windows Server 2016 Datacenter)
	- (2) SQL Server cluster node (SQL Server 2016 on Windows Server 2012 R2)
	- (1) SQL Server witness (Windows Server 2016 Datacenter)
	- (2) Web/IIS (Windows Server 2016 Datacenter)
* **Availability Sets**
	- (1) Active Directory domain controllers
	- (1) SQL cluster nodes and witness
	- (1) Web/IIS
* **Azure Virtual Network**
	- (1) /16 virtual networks
	- (5) /24 subnets
	- DNS settings are set to both domain controllers
* **Azure Load Balancer**
	- (1) SQL load balancer
* **Azure Application Gateway**
	- (1) WAF Application Gateway enabled
 	  - Firewall Mode: Prevention
	  - Rule set: OWASP 3.0
 	  - Listener: Port 443
* **Azure Storage**
	- (7) Geo-redundant storage accounts
* **Azure Backup**
	- (1) Recovery Services vault
* **Azure Key Vault**
	- (1) Key Vault
* **Azure Active Directory**
* **Azure Resource Manager**
* **Azure Log Analytics**
* **Azure Automation**
	- (1) Automation account
* **Operations Management Suite**
	- (1) OMS workspace

## Deployment architecture

The following section details the development and implementation elements.

### Network segmentation and security

#### Application Gateway

The architecture reduces the risk of security vulnerabilities using an Application Gateway with web application firewall (WAF), and the OWASP ruleset enabled. Additional capabilities include:

- [End-to-End-SSL](https://docs.microsoft.com/azure/application-gateway/application-gateway-end-to-end-ssl-powershell)
- Enable [SSL Offload](https://docs.microsoft.com/azure/application-gateway/application-gateway-ssl-portal)
- Disable [TLS v1.0 and v1.1](https://docs.microsoft.com/azure/application-gateway/application-gateway-end-to-end-ssl-powershell)
- [Web application firewall](https://docs.microsoft.com/azure/application-gateway/application-gateway-web-application-firewall-overview) (WAF mode)
- [Prevention mode](https://docs.microsoft.com/azure/application-gateway/application-gateway-web-application-firewall-portal) with OWASP 3.0 ruleset

#### Virtual network

The architecture defines a private virtual network with an address space of 10.200.0.0/16.

#### Network security groups

This solution deploys resources in an architecture with a separate web subnet, database subnet, Active Directory subnet, and management subnet inside of a virtual network. Subnets are logically separated by network security group rules applied to the individual subnets to restrict traffic between subnets to only that necessary for system and management functionality.

See the configuration for [Network Security Groups](https://github.com/Azure/fedramp-iaas-webapp/blob/master/nestedtemplates/virtualNetworkNSG.json) deployed with this solution. Organizations can configure Network Security groups by editing the file above using [this documentation](https://docs.microsoft.com/azure/virtual-network/virtual-networks-nsg) as a guide.

Each of the subnets has a dedicated network security group (NSG):
- 1 NSG for Application Gateway (LBNSG)
- 1 NSG for Jumpbox (MGTNSG)
- 1 NSG for Primary and Backup Domain Controllers (ADNSG)
- 1 NSG for SQL Servers and File Share Witness (SQLNSG)
- 1 NSG for Web Tier (WEBNSG)

#### Subnets

Each subnet is associated with its corresponding NSG.

### Data at rest

The architecture protects data at rest by using several encryption measures.

#### Azure Storage

To meet data-at-rest encryption requirements, all storage accounts use [Storage Service Encryption](https://docs.microsoft.com/azure/storage/common/storage-service-encryption).

#### SQL Database

SQL Database is configured to use [Transparent Data Encryption (TDE)](https://docs.microsoft.com/sql/relational-databases/security/encryption/transparent-data-encryption), which performs real-time encryption and decryption of data and log files to protect information at rest. TDE provides assurance that stored data has not been subject to unauthorized access. 

#### Azure Disk Encryption

Azure Disk Encryption is used to encrypted Windows IaaS virtual machine disks. [Azure Disk Encryption](https://docs.microsoft.com/azure/security/azure-security-disk-encryption) leverages the BitLocker feature of Windows to provide volume encryption for OS and data disks. The solution is integrated with Azure Key Vault to help control and manage the disk-encryption keys.

### Logging and auditing

[Operations Management Suite (OMS)](https://docs.microsoft.com/azure/security/azure-security-disk-encryption) provides extensive logging of system and user activity as well as system health. 

- **Activity Logs:**  [Activity logs](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-activity-logs) provide insight into the operations that were performed on resources in your subscription.
- **Diagnostic Logs:**  [Diagnostic logs](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs) are all logs emitted by every resource. These logs include Windows event system logs, Azure storage logs, Key Vault audit logs, and Application Gateway access and firewall logs.
- **Log Archiving:**  Azure activity logs and diagnostic logs can be connected to Azure Log Analytics for processing, storing, and dashboarding. Retention is user-configurable up to 730 day to meet organization-specific retention requirements.

### Secrets management

The solution uses Azure Key Vault to manage keys and secrets.

- [Azure Key Vault](https://azure.microsoft.com/services/key-vault/) helps safeguard cryptographic keys and secrets used by cloud applications and services. 
- The solution is integrated with Azure Key Vault to manage IaaS virtual machine disk-encryption keys and secrets.

### Identity management

The following technologies provide identity management capabilities in the Azure environment.
- [Azure Active Directory (Azure AD)](https://azure.microsoft.com/services/active-directory/) is Microsoft's multi-tenant cloud-based directory and identity management service.
- Authentication to a customer-deployed web application can be performed using Azure AD. For more information, see [Integrating applications with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/develop/active-directory-integrating-applications).  
- [Azure Role-based Access Control (RBAC)](https://docs.microsoft.com/azure/active-directory/role-based-access-control-configure) enables precisely focused access management for Azure. Subscription access is limited to the subscription administrator, and access to resources can be limited based on user role.
- A deployed IaaS Active Directory instance provides identity management at the OS-level for deployed IaaS virtual machines.
   
### Compute resources

#### Web tier

The solution deploys web tier virtual machines in an [Availability Set](https://docs.microsoft.com/azure/virtual-machines/windows/tutorial-availability-sets). Availability sets ensure that the virtual machines are distributed across multiple isolated hardware clusters to improve availability.

#### Database tier

The solution deploys database tier virtual machines in an Availability Set as an [AlwaysOn availability group](https://docs.microsoft.com/azure/virtual-machines/windows/sql/virtual-machines-windows-portal-sql-availability-group-overview). The Always On availability group feature provides for high-availability and disaster-recovery capabilities. 

#### Active Directory

All virtual machines deployed by the solution are domain-joined, and Active Directory group policies are used to enforce security and compliance configurations at the operating system level. Active Directory virtual machines are deployed in an Availability Set.


#### Jumpbox (bastion host)

A management jumpbox (bastion host) provides a secure connection for administrators to access deployed resources. The NSG associated with the management subnet where the jumpbox virtual machine is located allows connections only on TCP port 3389 for RDP. 

### Malware protection

[Microsoft Antimalware](https://docs.microsoft.com/azure/security/azure-security-antimalware) for Virtual Machines provides real-time protection capability that helps identify and remove viruses, spyware, and other malicious software, with configurable alerts when known malicious or unwanted software attempts to install or run on protected virtual machines.

### Patch management

Windows virtual machines deployed by this Blueprint Automation are configured by default to receive automatic updates from Windows Update Service. This solution also deploys the OMS Azure Automation solution through which Update Deployments can be created to deploy patches to Windows servers when needed.

### Operations management

#### Log analytics

[Log Analytics](https://azure.microsoft.com/services/log-analytics/) is a service in Operations Management Suite (OMS) that enables collection and analysis of data generated by resources in Azure and on-premises environments.

#### OMS solutions

The following OMS solutions are pre-installed as part of this solution:
- [AD Assessment](https://docs.microsoft.com/azure/log-analytics/log-analytics-ad-assessment)
- [Antimalware Assessment](https://docs.microsoft.com/azure/log-analytics/log-analytics-malware)
- [Azure Automation](https://docs.microsoft.com/azure/automation/automation-hybrid-runbook-worker)
- [Security and Audit](https://docs.microsoft.com/azure/operations-management-suite/oms-security-getting-started)
- [SQL Assessment](https://docs.microsoft.com/azure/log-analytics/log-analytics-sql-assessment)
- [Update Management](https://docs.microsoft.com/azure/operations-management-suite/oms-solution-update-management)
- [Agent Health](https://docs.microsoft.com/azure/operations-management-suite/oms-solution-agenthealth)
- [Azure Activity Logs](https://docs.microsoft.com/azure/log-analytics/log-analytics-activity)
- [Change Tracking](https://docs.microsoft.com/azure/log-analytics/log-analytics-activity)

## Compliance documentation

### Customer responsibility matrix

The [customer responsibilities matrix](https://aka.ms/blueprinthighcrm) (Excel Workbook) lists all security controls required by the FedRAMP High baseline. The matrix denotes, for each control (or control subpart), whether implementation responsibly for the control is the responsibility of Microsoft, the customer, or shared between the two. 

### Control implementation matrix

The [control implementation matrix](https://aka.ms/blueprintwacim) (Excel Workbook) lists all security controls required by the FedRAMP High baseline. The matrix denotes, for each control (or control subpart) that is designated a customer-responsibly in the customer responsibilities matrix, 1) if the Blueprint Automation implements the control, and 2) a description of how the implementation aligns with the control requirement(s). This content is also available [here](./controls-overview.md).

## Deploy the solution

This Azure Blueprint solution is comprised of JSON configuration files and PowerShell scripts that are handled by Azure Resource Manager's API service to deploy resources within Azure. Detailed deployment instructions are available [here](https://aka.ms/fedrampblueprintrepo). ***Note: This solution deploys to Azure Government.***

#### Quickstart
1. Clone or download [this](https://aka.ms/fedrampblueprintrepo) GitHub repository to your local workstation.

2. Run the pre-deployment PowerShell script: azure-blueprint/predeploy/Orchestration_InitialSetup.ps1.

3. Click the button below, sign into the Azure portal, enter the required ARM template parameters, and click **Purchase**.

	[![Deploy to Azure](http://azuredeploy.net/AzureGov.png)](https://portal.azure.us/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Ffedramp-iaas-webapp%2Fmaster%2Fazuredeploy.json)

## Disclaimer

- This document is for informational purposes only. MICROSOFT MAKES NO WARRANTIES, EXPRESS, IMPLIED, OR STATUTORY, AS TO THE INFORMATION IN THIS DOCUMENT. This document is provided "as-is." Information and views expressed in this document, including URL and other Internet website references, may change without notice. Customers reading this document bear the risk of using it.  
- This document does not provide customers with any legal rights to any intellectual property in any Microsoft product or solutions.  
- Customers may copy and use this document for internal reference purposes.  
- Certain recommendations in this document may result in increased data, network, or compute resource usage in Azure, and may increase a customer's Azure license or subscription costs.  
- This architecture is intended to serve as a foundation for customers to adjust to their specific requirements and should not be used as-is in a production environment.
- This document is developed as a reference and should not be used to define all means by which a customer can meet specific compliance requirements and regulations. Customers should seek legal support from their organization on approved customer implementations.
