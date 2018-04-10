---

title: Azure Security and Compliance Blueprint - FFIEC Financial Services Regulated Workloads
description: Azure Security and Compliance Blueprint - FFIEC Financial Services Regulated Workloads
services: security
documentationcenter: na
author: simorjay
manager: mbaldwin
editor: tomsh

ms.assetid: 17794288-9074-44b5-acc8-1dacceb3f56c
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 02/09/2018
ms.author: frasim

---

# Azure Security and Compliance Blueprint - FFIEC Financial Services Regulated Workloads

## Overview

Azure Security and Compliance Blueprint - FFIEC Financial Services Regulated Workloads helps deploy a secure and compliant platform as a service (PaaS) web application designed to handle sensitive data in the cloud. The blueprint consists of automated scripts and guidance that showcase a simple reference architecture and a design that helps simplify the adoption of Microsoft Azure solutions. This blueprint illustrates an end-to-end solution to meet the needs of organizations seeking ways to reduce the burden and cost of deploying in the cloud.

This blueprint is designed to meet the requirements of stringent compliant standards set by the American Institute of Certified Public Accountants such as - SOC 1, SOC 2, the Payment Card Industry Data Security Standards council's DSS 3.2, and FFIEC for the collection, storage, and retrieval of sensitive financial data. It demonstrates the proper handling of such data by deploying a solution that manages financial data in a secure, compliant, multi-tier environment. The solution is deployed as an end-to-end Azure-based PaaS solution. 

The Blueprint is intended to serve as a foundation for customers to build on and understand the requirements of managing secure data in the cloud. The solution should not be used in a production deployment as-is, but to understand, design, and deploy Azure services; it's designed as a baseline to help customers use Microsoft Azure in a secure and compliant manner.

An accredited auditor must certify any production customer solution that is based on this blueprint. Solutions may vary based on the specifics of each customer's implementation and geography.

For a quick overview of how this solution works, watch this [video](https://aka.ms/fsiblueprintvideo) that explains and demonstrates its deployment.

## Solution components

The architecture is comprised of the following components and uses the deployment capabilities from the Azure PCI DSS compliance solution.

- **Architectural diagram**. The diagram shows the reference architecture used for the Contoso Webstore solution.
- **Deployment templates**. In this deployment, [Azure Resource Manager templates](/azure/azure-resource-manager/resource-group-overview#template-deployment) are used to automatically deploy the components of the architecture into Microsoft Azure by specifying configuration parameters during setup.
- **Automated deployment scripts**. These scripts help deploy the end-to-end solution. The scripts consist of:
    - A module installation and [global administrator](/azure/active-directory/active-directory-assign-admin-roles-azure-portal) setup script is used to install and verify that required PowerShell modules and global administrator roles are configured correctly. 
    - An installation PowerShell script is used to deploy the end-to-end solution, provided via a .zip file and a .bacpac file that contain a pre-built demo web application with [SQL database sample](https://github.com/Microsoft/azure-sql-security-sample). content. The source code for this solution is available for review [Payment Processing Blueprint code repository][code-repo]. 

## Architectural diagram

![](images/pci-architectural-diagram.png)

## User scenario

The blueprint addresses the following  the use case below.

> This scenario illustrates how a fictitious webstore moved sensitive data into a PaaS cloud Azure-based solution. The example solution illustrates the handling and collection of basic user information and selected sensitive data. This work borrows from the Azure Security and Compliance Blueprint - PCI DSS-compliant Payment Processing environments. For more information, on expanding on this work ["Review and Guidance for Implementation"](https://aka.ms/pciblueprintprocessingoverview) paper provides a review of the PCI DSS-compliant environments.

### Use case
A small webstore called *Contoso Webstore* is ready to move financial data that includes customer payment information to the cloud. 

The administrator of Contoso Webstore is looking for a solution that can be quickly deployed to achieve his goals. He will use this proof-of-concept (POC) to discuss with his stakeholders how Azure can be used to collect, store, and retrieve financial data in accordance with stringent compliance requirements.

> You will be responsible for conducting appropriate security and compliance reviews of any solution built with the architecture used by this POC, as requirements may vary based on the specifics of your implementation and geography. 

### Elements of the foundational architecture

The foundational architecture is designed with the following fictitious elements:

Domain site `contosowebstore.com`

User roles are employed to illustrate the use case and provide insight into the user interface.

#### Role: Site and subscription admin

|Item      |Example|
|----------|------|
|Username: |`adminXX@contosowebstore.com`|
| Name: |`Global Admin Azure PCI Samples`|
|User type:| `Subscription Administrator and Azure Active Directory Global Administrator`|

- The admin account cannot read the financial information unmasked. All actions are logged.
- The admin account cannot manage or log into SQL Database.
- The admin account can manage Active Directory and subscriptions.

#### Role: SQL administrator

|Item      |Example|
|----------|------|
|Username: |`sqlAdmin@contosowebstore.com`|
| Name: |`SQLADAdministrator PCI Samples`|
| First name: |`SQL AD Administrator`|
|Last name: |`PCI Samples`|
|User type:| `Administrator`|

- The sqladmin account cannot view unfiltered financial information. All actions are logged.
- The sqladmin account can manage SQL Database.

#### Role: Clerk

|Item      |Example|
|----------|------|
|Username:| `receptionist_EdnaB@contosowebstore.com`|
| Name: |`Edna Benson`|
| First name:| `Edna`|
|Last name:| `Benson`|
| User type: |`Member`|

Edna Benson is the receptionist and business manager. She is responsible for ensuring that customer information is accurate and billing is completed. Edna is the user logged in for all interactions with the Contoso Webstore demo website. Edna has the following rights: 

- Edna can create and read customer information.
- Edna can modify customer information.
- Edna can overwrite financial information.
- Edna account cannot view unfiltered financial information.



### Contoso Webstore - Estimated pricing

This foundational architecture and example web application have a monthly fee structure and a usage cost per hour which must be considered when sizing the solution. These costs can be estimated using the [Azure costing calculator](https://azure.microsoft.com/pricing/calculator/). As of September 2017, the estimated monthly cost for this solution is ~$2500 this includes a $1000/mo usage charge for ASE v2. These costs will vary based on the usage amount and are subject to change. It is incumbent on the customer to calculate their estimated monthly costs at the time of deployment for a more accurate estimate. 

This solution used the following Azure services. Details of the deployment architecture are located in the [Deployment Architecture](#deployment-architecture) section.

>- Application Gateway
>- Azure Active Directory
>- App Service Environment v2
>- OMS Log Analytics
>- Azure Key Vault
>- Network Security Groups
>- Azure SQL DB
>- Azure Load Balancer
>- Application Insights
>- Azure Security Center
>- Azure Web App
>- Azure Automation
>- Azure Automation Runbooks
>- Azure DNS
>- Azure Virtual Network
>- Azure Virtual Machine
>- Azure Resource Group and Policies
>- Azure Blob Storage
>- Azure Active Directory Role-Based Access Control (RBAC)

## Deployment architecture

The following section details the development and implementation elements.

### Network segmentation and security

![](images/pci-tiers-diagram.png)

#### Application Gateway

The foundational architecture reduces the risk of security vulnerabilities using an Application Gateway with a web application firewall (WAF), and the OWASP ruleset enabled. Additional capabilities include:

- [End-to-End-SSL](/azure/application-gateway/application-gateway-end-to-end-ssl-powershell)
- [SSL Offload](/azure/application-gateway/application-gateway-ssl-portal) enabled
- [TLS v1.0 and v1.1](/azure/application-gateway/application-gateway-end-to-end-ssl-powershell) disabled
- [Web application firewall](/azure/application-gateway/application-gateway-webapplicationfirewall-overview) (WAF mode)
- [Prevention mode](/azure/application-gateway/application-gateway-web-application-firewall-portal) with OWASP 3.0 ruleset
- [Diagnostics logging](/azure/application-gateway/application-gateway-diagnostics) enabled
- [Custom health probes](/azure/application-gateway/application-gateway-create-gateway-portal)
- [Azure Security Center](https://azure.microsoft.com/services/security-center) and [Azure Advisor](/azure/advisor/advisor-security-recommendations), which provide additional protection and notifications. Azure Security Center also provides a reputation system.

#### Virtual network

The foundational architecture defines a private virtual network with an address space of 10.0.0.0/16.

#### Network security groups

Each of the network tiers has a dedicated network security group (NSG):

- A DMZ network security group for firewall and Application Gateway WAF
- An NSG for management jumpbox (bastion host)
- An NSG for the app service environment

Each of the NSGs have specific ports and protocols opened for the secure and correct operation of the solution. 

In addition, the following configurations are enabled for each NSG:

- Enabled [diagnostic logs and events](/azure/virtual-network/virtual-network-nsg-manage-log) are stored in storage account 
- Connected OMS Log Analytics to the [NSG's diagnostics](https://github.com/krnese/AzureDeploy/blob/master/AzureMgmt/AzureMonitor/nsgWithDiagnostics.json)

 
#### Subnets
 Ensure each subnet is associated with its corresponding NSG.

#### Custom domain SSL certificates
 HTTPS traffic is enabled using a custom domain SSL certificate.

### Data at rest

The architecture protects data at rest by using encryption, database auditing, and other measures.

#### Azure Storage

To meet encrypted data-at-rest requirements, all [Azure Storage](https://azure.microsoft.com/services/storage/) uses [Storage Service Encryption](/azure/storage/storage-service-encryption).

#### Azure SQL Database

The Azure SQL Database instance uses the following database security measures:

- [AD Authentication and Authorization](/azure/sql-database/sql-database-aad-authentication)
- [SQL database auditing](/azure/sql-database/sql-database-auditing-get-started)
- [Transparent Data Encryption](/sql/relational-databases/security/encryption/transparent-data-encryption-azure-sql)
- [Firewall rules](/azure/sql-database/sql-database-firewall-configure),  allowing for ASE worker pools and client IP management
- [SQL Threat Detection](/azure/sql-database/sql-database-threat-detection-get-started)
- [Always Encrypted columns](/azure/sql-database/sql-database-always-encrypted-azure-key-vault)
- [SQL Database dynamic data masking](/azure/sql-database/sql-database-dynamic-data-masking-get-started), using the post-deployment PowerShell script

### Logging and auditing

[Operations Management Suite (OMS)](/azure/operations-management-suite/) can provide the Contoso Webstore with extensive logging of all system and user activity, include financial data logging. Changes can be reviewed and verified for accuracy. 

- **Activity logs.**  [Activity logs](/azure/monitoring-and-diagnostics/monitoring-overview-activity-logs) provide insight into the operations that were performed on resources in your subscription.
- **Diagnostic logs.**  [Diagnostic logs](/azure/monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs) are all logs emitted by every resource. These logs include Windows event system logs, Azure Blob storage logs, tables, and queue logs.
- **Firewall logs.**  The Application Gateway provides full diagnostic and access logs. Firewall logs are available for Application Gateway resources that have WAF enabled.
- **Log archiving.**  All diagnostic logs are configured to write to a centralized and encrypted Azure Storage account for archival with a defined retention period (2 days). Logs are then connected to Azure Log Analytics for processing, storing, and dashboarding. [Log Analytics](https://azure.microsoft.com/services/log-analytics) is an OMS service that helps collect and analyze data generated by resources in your cloud and on-premises environments.

### Encryption and secrets management

The Contoso Webstore encrypts all sensitive data, and uses Azure Key Vault to manage keys and prevent retrieval of CHD.

- [Azure Key Vault](https://azure.microsoft.com/services/key-vault/) helps safeguard cryptographic keys and secrets used by cloud applications and services. 
- [SQL TDE](/sql/relational-databases/security/encryption/transparent-data-encryption) is used to encrypt all customer financial data.
- Data is stored on disk using [Azure Disk Encryption](/azure/security/azure-security-disk-encryption) and BitLocker.

### Identity management

The following technologies provide identity management capabilities in the Azure environment.

- [Azure Active Directory (Azure AD)](https://azure.microsoft.com/services/active-directory/) is the Microsoft multi-tenant cloud-based directory and identity management service. All users for the solution were created in Azure Active Directory, including users accessing the SQL Database.
- Authentication to the application is performed using Azure AD. For more information, see [Integrating applications with Azure Active Directory](/azure/active-directory/develop/active-directory-integrating-applications). In addition, the database column encryption also uses Azure AD to authenticate the application to Azure SQL Database. For more information, see [Always Encrypted: Protect sensitive data in SQL Database](/azure/sql-database/sql-database-always-encrypted-azure-key-vault). 
- [Azure Active Directory Identity Protection](/azure/active-directory/active-directory-identityprotection) detects potential vulnerabilities that could affect your organization's identities, configures automated responses to detected suspicious actions related to your organization's identities, and investigates suspicious incidents and takes appropriate action to resolve them.
- [Azure Role-based Access Control (RBAC)](/azure/active-directory/role-based-access-control-configure) enables precisely focused access management for Azure. Subscription access is limited to the subscription administrator, and Azure Key Vault access is restricted to all users.

To learn more about using the security features of Azure SQL Database, see the [Contoso Clinic Demo Application](https://github.com/Microsoft/azure-sql-security-sample) sample.
   
### Web and compute resources

#### App Service Environment

[Azure App Service](/azure/app-service/) is a managed service for deploying web apps. The Contoso Webstore application is deployed as an [App Service Web App](/azure/app-service-web/app-service-web-overview).

[Azure App Service Environment (ASE v2)](/azure/app-service/app-service-environment/intro) is an App Service feature that provides a fully isolated and dedicated environment for securely running App Service apps at high scale. it is a Premium service plan used by this foundational architecture to enable PCI DSS compliance.

ASEs are isolated to running only a single customer's applications, and are always deployed into a virtual network. Customers have fine-grained control over both inbound and outbound application network traffic, and applications can establish high-speed secure connections over virtual networks to on-premises corporate resources.

Use of ASEs for this architecture allowed for the following controls/configurations:

- Host inside a secured virtual network and network security rules
- ASE configured with self-signed ILB certificate for HTTPS communication
- [Internal Load Balancing mode](/azure/app-service-web/app-service-environment-with-internal-load-balancer) (mode 3)
- [TLS 1.0](/azure/app-service-web/app-service-app-service-environment-custom-settings) disabled
- [TLS Cipher](/azure/app-service-web/app-service-app-service-environment-custom-settings) changed
- Control [inbound traffic N/W ports](/azure/app-service-web/app-service-app-service-environment-control-inbound-traffic) 
- [WAF - Restrict Data](/azure/app-service-web/app-service-app-service-environment-web-application-firewall)
- [SQL Database traffic](/azure/app-service-web/app-service-app-service-environment-network-architecture-overview) allowed


#### Jumpbox (bastion host)

Because the App Service Environment is secured and locked down, there needs to be a mechanism to allow for any DevOps releases or changes that might be necessary, such as the ability to monitor the web app using Kudu. A virtual machine is secured behind the NAT Load Balancer, which provides the ability to connect to the VM on a port other than TCP 3389. 

A virtual machine was created as a jumpbox (bastion host) with the following configurations:

-   [Antimalware extension](/azure/security/azure-security-antimalware)
-   [OMS extension](/azure/virtual-machines/virtual-machines-windows-extensions-oms)
-   [Azure Diagnostics extension](/azure/virtual-machines/virtual-machines-windows-extensions-diagnostics-template)
-   [Azure Disk Encryption](/azure/security/azure-security-disk-encryption) using Azure Key Vault 
-   An [auto-shutdown policy](https://azure.microsoft.com/blog/announcing-auto-shutdown-for-vms-using-azure-resource-manager/) to reduce consumption of virtual machine resources when not in use

### Security and malware protection

[Azure Security Center](https://azure.microsoft.com/services/security-center/) provides a centralized view of the security state of all Azure resources. At a glance, you can verify that the appropriate security controls are in place and configured correctly, and you can quickly identify any resources that require attention.  

[Azure Advisor](/azure/advisor/advisor-overview) is a personalized cloud consultant that helps you follow best practices to optimize your Azure deployments. It analyzes your resource configuration and usage telemetry and then recommends solutions that can help improve the cost effectiveness, performance, high availability, and security of your Azure resources.

[Microsoft Antimalware](/azure/security/azure-security-antimalware) 
for Azure cloud services and virtual machines is real-time protection capability that helps identify and remove viruses, spyware, and other malicious software, with configurable alerts when known malicious or unwanted software attempts to install itself or run on Azure systems.

### Operations management

#### Application Insights

Use [Application Insights](https://azure.microsoft.com/services/application-insights/) to gain actionable insights through application performance management and instant analytics.

#### Log analytics

[Log Analytics](https://azure.microsoft.com/services/log-analytics/) is a service in Operations Management Suite (OMS) that helps you collect and analyze data generated by resources in your cloud and on-premises environments.

#### OMS solutions

These additional OMS solutions should be considered and configured: 
- [Activity Log Analytics](/azure/monitoring-and-diagnostics/monitoring-overview-activity-logs)
- [Azure Networking Analytics](/azure/log-analytics/log-analytics-azure-networking-analytics?toc=%2fazure%2foperations-management-suite%2ftoc.json)
- [Azure SQL Analytics](/azure/log-analytics/log-analytics-azure-sql)
- [Change Tracking](/azure/log-analytics/log-analytics-change-tracking?toc=%2fazure%2foperations-management-suite%2ftoc.json)
- [Key Vault Analytics](/azure/log-analytics/log-analytics-azure-key-vault?toc=%2fazure%2foperations-management-suite%2ftoc.json)
- [Service Map](/azure/operations-management-suite/operations-management-suite-service-map)
- [Security and Audit](https://www.microsoft.com/cloud-platform/security-and-compliance)
- [Antimalware](/azure/log-analytics/log-analytics-malware?toc=%2fazure%2foperations-management-suite%2ftoc.json)
- [Update Management](/azure/operations-management-suite/oms-solution-update-management)

### Security Center integration

Default deployment is intended to provide a baseline of Security Center recommendations that indicate a healthy and secure configuration state. You can enable data collection from the Azure Security Center. For more information, see [Azure Security Center - Getting Started](/azure/security-center/security-center-get-started).

## Deploy the solution

The components for deploying this solution are available in the [Blueprint code repository][code-repo]. The deployment of the foundational architecture requires several steps executed via Microsoft PowerShell v5. To connect to the website, you must provide a custom domain name (such as contoso.com). This is specified using the `-customHostName` switch in step 2. For more information, see [Buy a custom domain name for Azure Web Apps](/azure/app-service-web/custom-dns-web-site-buydomains-web-app). A custom domain name is not required to successfully deploy and run the solution, but you will be unable to connect to the website for demonstration purposes.

The scripts add domain users to the Azure AD tenant that you specify. Microsoft recommends creating a new Azure AD tenant to use as a test.

If you encounter any issues during the deployment, see [FAQ and troubleshooting](https://github.com/Azure/pci-paas-webapp-ase-sqldb-appgateway-keyvault-oms/blob/master/pci-faq.md).

Microsoft highly recommends that a clean installation of PowerShell be used to deploy the solution. Alternatively, verify that you are using the latest modules required for proper execution of the installation scripts. This example logs in to the jumpbox (bastion host) and executes the following commands. Note that this enables the custom domain command.


1. Install required modules and set up the administrator roles correctly.
 
    ```powershell
     .\0-Setup-AdministrativeAccountAndPermission.ps1 
        -azureADDomainName contosowebstore.com
        -tenantId XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
        -subscriptionId XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
        -configureGlobalAdmin 
        -installModules
    ```
    For detailed usage instructions, see [Script Instructions - Setup Administrative Account and Permission](https://github.com/Azure/pci-paas-webapp-ase-sqldb-appgateway-keyvault-oms/blob/master/0-Setup-AdministrativeAccountAndPermission.md).
    
2. Install the solution-update-management. 
 
    ```powershell
    .\1-DeployAndConfigureAzureResources.ps1 
        -resourceGroupName contosowebstore
        -globalAdminUserName adminXX@contosowebstore.com 
        -globalAdminPassword **************
        -azureADDomainName contosowebstore.com 
        -subscriptionID XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX 
        -suffix PCIcontosowebstore
        -customHostName contosowebstore.com
        -sqlTDAlertEmailAddress edna@contosowebstore.com 
        -enableSSL
        -enableADDomainPasswordPolicy 
    ```
    
    For detailed usage instructions, see [Script Instructions - Deploy and Configure Azure Resources](https://github.com/Azure/pci-paas-webapp-ase-sqldb-appgateway-keyvault-oms/blob/master/1-DeployAndConfigureAzureResources.md).
    
3. OMS logging and monitoring. When the solution is deployed a [Microsoft Operations Management Suite (OMS)](/azure/operations-management-suite/operations-management-suite-overview) workspace can be opened, and the sample templates provided in the solution repository can be used to illustrate how a monitoring dashboard can be configured. For the sample OMS templates, refer to the [omsDashboards folder](https://github.com/Azure/pci-paas-webapp-ase-sqldb-appgateway-keyvault-oms/blob/master/1-DeployAndConfigureAzureResources.md). Note that data must be collected in OMS for templates to deploy correctly. This can take up to an hour or more depending on site activity.
 
    When setting up your OMS logging, consider including these resources:
 
    - Microsoft.Network/applicationGateways
    - Microsoft.Network/NetworkSecurityGroups
    - Microsoft.Web/serverFarms
    - Microsoft.Sql/servers/databases
    - Microsoft.Compute/virtualMachines
    - Microsoft.Web/sites
    - Microsoft.KeyVault/Vaults
    - Microsoft.Automation/automationAccounts
 

    
## Threat model

A data flow diagram (DFD) and sample threat model for the Contoso Webstore [Blueprint Threat Model](https://aka.ms/pciblueprintthreatmodel).

![](images/pci-threat-model.png)



## Customer responsibility matrix

Customers are responsible for retaining a copy of the [Responsibility Summary Matrix](https://aka.ms/fsiblueprintcrm), which outlines the FFIEC requirements that are the responsibility of the customer and those that are the responsibility of Microsoft Azure.



## Disclaimer and acknowledgments

*September 2017*

- This document is for informational purposes only. MICROSOFT AND AVYAN MAKE NO WARRANTIES, EXPRESS, IMPLIED, OR STATUTORY, AS TO THE INFORMATION IN THIS DOCUMENT. This document is provided "as-is." Information and views expressed in this document, including URL and other internet website references, may change without notice. Customers reading this document bear the risk of using it.  
- This document does not provide customers with any legal rights to any intellectual property in any Microsoft or Avyan product or solutions.  
- Customers may copy and use this document for internal reference purposes.  

  > [!NOTE]
  > Certain recommendations in this paper may result in increased data, network, or compute resource usage in Azure, and may increase a customer's Azure license or subscription costs.  

- The solution in this document is intended as a foundational architecture and must not be used as-is for production purposes. Achieving compliance requires that customers consult with their auditor to validate the final customer solution.  
- All customer names, transaction records, and any related data on this page are fictitious, created for the purpose of this foundational architecture and provided for illustration only. No real association or connection is intended, and none should be inferred.  
- This solution was developed jointly by Microsoft and Avyan Consulting, and is available under the [MIT License](https://opensource.org/licenses/MIT).

### Document authors

* *Frank Simorjay (Microsoft)*  

[code-repo]: https://github.com/Azure/pci-paas-webapp-ase-sqldb-appgateway-keyvault-oms "Code Repository"
