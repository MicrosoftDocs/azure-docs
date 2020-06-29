---
title: DoD Impact Level 4 blueprint sample controls
description: Control mapping of the DoD Impact Level 4 blueprint sample. Each control is mapped to one or more Azure Policies that assist with assessment.
ms.date: 05/12/2020
ms.topic: sample
---
# Control mapping of the DoD Impact Level 4 blueprint sample

The following article details how the Azure Blueprints Department of Defense Impact Level 4 (DoD IL4) blueprint sample maps to the
DoD Impact Level 4 controls. For more information about the controls, see
[DoD Cloud Computing Security Requirements Guide (SRG)](https://dl.dod.cyber.mil/wp-content/uploads/cloud/pdf/Cloud_Computing_SRG_v1r3.pdf). 
The Defense Information Systems Agency (DISA) is an agency of the US Department of Defense (DoD) that is responsible for developing and maintaining the DoD Cloud Computing Security Requirements Guide (SRG). The SRG defines the baseline security requirements for cloud service providers (CSPs) that host DoD information, systems, and applications, and for DoD's use of cloud services.  

The following mappings are to the **DoD Impact Level 4** controls. Use the navigation on the right to jump
directly to a specific control mapping. Many of the mapped controls are implemented with an
[Azure Policy](../../../policy/overview.md) initiative. To review the complete initiative, open
**Policy** in the Azure portal and select the **Definitions** page. Then, find and select the
**\[Preview\]: DoD Impact Level 4** built-in policy initiative.

> [!IMPORTANT]
> Each control below is associated with one or more [Azure Policy](../../../policy/overview.md)
> definitions. These policies may help you
> [assess compliance](../../../policy/how-to/get-compliance-data.md) with the control; however,
> there often is not a 1:1 or complete match between a control and one or more policies. As such,
> **Compliant** in Azure Policy refers only to the policies themselves; this doesn't ensure you're
> fully compliant with all requirements of a control. In addition, the compliance standard includes
> controls that aren't addressed by any Azure Policy definitions at this time. Therefore, compliance
> in Azure Policy is only a partial view of your overall compliance status. The associations between
> controls and Azure Policy definitions for this compliance blueprint sample may change over time.
> To view the change history, see the
> [GitHub Commit History](https://github.com/MicrosoftDocs/azure-docs/commits/master/articles/governance/blueprints/samples/dod-impact-level-4/control-mapping.md).

## AC-2 Account Management

This blueprint helps you review accounts that may not comply with your organization's account
management requirements. This blueprint assigns [Azure Policy](../../../policy/overview.md)
definitions that audit external accounts with read, write, and owner permissions on a subscription
and deprecated accounts. By reviewing the accounts audited by these policies, you can take
appropriate action to ensure account management requirements are met.

- Deprecated accounts should be removed from your subscription
- Deprecated accounts with owner permissions should be removed from your subscription
- External accounts with owner permissions should be removed from your subscription
- External accounts with read permissions should be removed from your subscription
- External accounts with write permissions should be removed from your subscription

## AC-2 (7) Account Management | Role-Based Schemes

Azure implements [role-based access control](../../../../role-based-access-control/overview.md)
(RBAC) to help you manage who has access to resources in Azure. Using the Azure portal, you can
review who has access to Azure resources and their permissions. This blueprint also assigns
[Azure Policy](../../../policy/overview.md) definitions to audit use of Azure Active Directory
authentication for SQL Servers and Service Fabric. Using Azure Active Directory authentication
enables simplified permission management and centralized identity management of database users and
other Microsoft services. Additionally, this blueprint assigns an Azure Policy definition to audit
the use of custom RBAC rules. Understanding where custom RBAC rules are implement can help you
verify need and proper implementation, as custom RBAC rules are error prone.

- An Azure Active Directory administrator should be provisioned for SQL servers
- Audit usage of custom RBAC rules
- Service Fabric clusters should only use Azure Active Directory for client authentication

## AC-2 (12) Account Management | Account Monitoring / Atypical Usage

Just-in-time (JIT) virtual machine access locks down inbound traffic to Azure virtual machines,
reducing exposure to attacks while providing easy access to connect to VMs when needed. All JIT
requests to access virtual machines are logged in the Activity Log allowing you to monitor for
atypical usage. This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition
that helps you monitor virtual machines that can support just-in-time access but haven't yet been
configured.

- Just-In-Time network access control should be applied on virtual machines

## AC-4 Information Flow Enforcement

Cross origin resource sharing (CORS) can allow App Services resources to be requested from an
outside domain. Microsoft recommends that you allow only required domains to interact with your API,
function, and web applications. This blueprint assigns an
[Azure Policy](../../../policy/overview.md) definition to help you monitor CORS resources access
restrictions in Azure Security Center. Understanding CORS implementations can help you verify that
information flow controls are implemented.

- CORS should not allow every resource to access your Web Application

## AC-5 Separation of Duties

Having only one Azure subscription owner doesn't allow for administrative redundancy. Conversely,
having too many Azure subscription owners can increase the potential for a breach via a compromised
owner account. This blueprint helps you maintain an appropriate number of Azure subscription owners
by assigning [Azure Policy](../../../policy/overview.md) definitions that audit the number of owners
for Azure subscriptions. This blueprint also assigns Azure Policy definitions that help you control
membership of the Administrators group on Windows virtual machines. Managing subscription owner and
virtual machine administrator permissions can help you implement appropriate separation of duties.

- A maximum of 3 owners should be designated for your subscription
- Audit Windows VMs in which the Administrators group contains any of the specified members
- Audit Windows VMs in which the Administrators group does not contain all of the specified members
- Deploy requirements to audit Windows VMs in which the Administrators group contains any of the specified members
- Deploy requirements to audit Windows VMs in which the Administrators group does not contain all of the specified members
- There should be more than one owner assigned to your subscription

## AC-6 (7) Least Privilege | Review of User Privileges

Azure implements [role-based access control](../../../../role-based-access-control/overview.md)
(RBAC) to help you manage who has access to resources in Azure. Using the Azure portal, you can
review who has access to Azure resources and their permissions. This blueprint assigns
[Azure Policy](../../../policy/overview.md) definitions to audit accounts that should be prioritized
for review. Reviewing these account indicators can help you ensure least privilege controls are
implemented.

- A maximum of 3 owners should be designated for your subscription
- Audit Windows VMs in which the Administrators group contains any of the specified members
- Audit Windows VMs in which the Administrators group does not contain all of the specified members
- Deploy requirements to audit Windows VMs in which the Administrators group contains any of the specified members
- Deploy requirements to audit Windows VMs in which the Administrators group does not contain all of the specified members
- There should be more than one owner assigned to your subscription

## AC-17 (1) Remote Access | Automated Monitoring / Control

This blueprint helps you monitor and control remote access by assigning
[Azure Policy](../../../policy/overview.md) definitions to monitors that remote debugging for Azure
App Service application is turned off and policy definitions that audit Linux virtual machines that
allow remote connections from accounts without passwords. This blueprint also assigns an Azure
Policy definition that helps you monitor unrestricted access to storage accounts. Monitoring these
indicators can help you ensure remote access methods comply with your security policy.

- \[Preview\]: Audit Linux VMs that allow remote connections from accounts without passwords
- \[Preview\]: Deploy requirements to audit Linux VMs that allow remote connections from accounts without passwords
- Audit unrestricted network access to storage accounts
- Remote debugging should be turned off for API App
- Remote debugging should be turned off for Function App
- Remote debugging should be turned off for Web Application

## AC-23 Data Mining

This blueprint provides policy definitions that help you ensure data security notifications are
properly enabled. In addition, this blueprint ensures that auditing and advanced data security are
configured on SQL Servers.

- Advanced data security should be enabled on your SQL servers
- Advanced data security should be enabled on your SQL managed instances
- Advanced Threat Protection types should be set to 'All' in SQL server Advanced Data Security settings
- Advanced Threat Protection types should be set to 'All' in SQL managed instance Advanced Data Security settings
- Auditing should be enabled on advanced data security settings on SQL Server
- Email notifications to admins and subscription owners should be enabled in SQL server advanced data security settings
- Email notifications to admins and subscription owners should be enabled in SQL managed instance advanced data security settings
- Advanced data security settings for SQL server should contain an email address to receive security alerts
- Advanced data security settings for SQL managed instance should contain an email address to receive security alerts

## AU-3 (2) Content of Audit Records | Centralized Management of Planned Audit Record Content

Log data collected by Azure Monitor is stored in a Log Analytics workspace enabling centralized
configuration and management. This blueprint helps you ensure events are logged by assigning
[Azure Policy](../../../policy/overview.md) definitions that audit and enforce deployment of the Log
Analytics agent on Azure virtual machines.

- \[Preview\]: Audit Log Analytics Agent Deployment - VM Image (OS) unlisted
- \[Preview\]: Audit Log Analytics Agent Deployment in VMSS - VM Image (OS) unlisted
- \[Preview\]: Audit Log Analytics Workspace for VM - Report Mismatch
- \[Preview\]: Deploy Log Analytics Agent for Linux VM Scale Sets (VMSS)
- \[Preview\]: Deploy Log Analytics Agent for Linux VMs
- \[Preview\]: Deploy Log Analytics Agent for Windows VM Scale Sets (VMSS)
- \[Preview\]: Deploy Log Analytics Agent for Windows VMs

## AU-5 Response to Audit Processing Failures

This blueprint assigns [Azure Policy](../../../policy/overview.md) definitions that monitor
audit and event logging configurations. Monitoring these configurations can provide an indicator of
an audit system failure or misconfiguration and help you take corrective action.

- Audit diagnostic setting
- Auditing should be enabled on advanced data security settings on SQL Server
- Advanced data security should be enabled on your managed instances
- Advanced data security should be enabled on your SQL servers

## AU-6 (4) Audit Review, Analysis, and Reporting | Central Review and Analysis

Log data collected by Azure Monitor is stored in a Log Analytics workspace enabling centralized
reporting and analysis. This blueprint helps you ensure events are logged by assigning
[Azure Policy](../../../policy/overview.md) definitions that audit and enforce deployment of the Log
Analytics agent on Azure virtual machines.

- \[Preview\]: Audit Log Analytics Agent Deployment - VM Image (OS) unlisted
- \[Preview\]: Audit Log Analytics Agent Deployment in VMSS - VM Image (OS) unlisted
- \[Preview\]: Audit Log Analytics Workspace for VM - Report Mismatch
- \[Preview\]: Deploy Log Analytics Agent for Linux VM Scale Sets (VMSS)
- \[Preview\]: Deploy Log Analytics Agent for Linux VMs
- \[Preview\]: Deploy Log Analytics Agent for Windows VM Scale Sets (VMSS)
- \[Preview\]: Deploy Log Analytics Agent for Windows VMs

## AU-6 (5) Audit Review, Analysis, and Reporting | Integration / Scanning and Monitoring Capabilities

This blueprint provides policy definitions that audit records with analysis of vulnerability
assessment on virtual machines, virtual machine scale sets, SQL Database servers, and SQL Managed
Instance servers. These policy definitions also audit configuration of diagnostic logs to provide
insight into operations that are performed within Azure resources. These insights provide real-time
information about the security state of your deployed resources and can help you prioritize
remediation actions. For detailed vulnerability scanning and monitoring, we recommend you leverage
Azure Sentinel and Azure Security Center as well.

- \[Preview\]: Vulnerability Assessment should be enabled on Virtual Machines
- Vulnerability assessment should be enabled on your SQL servers
- Audit diagnostic setting
- Vulnerability assessment should be enabled on your SQL managed instances
- Vulnerability assessment should be enabled on your SQL servers
- Vulnerabilities in security configuration on your machines should be remediated
- Vulnerabilities on your SQL databases should be remediated
- Vulnerabilities should be remediated by a Vulnerability Assessment solution
- Vulnerabilities in security configuration on your virtual machine scale sets should be remediated
- \[Preview\]: Audit Log Analytics Agent Deployment - VM Image (OS) unlisted
- \[Preview\]: Audit Log Analytics Agent Deployment in VMSS - VM Image (OS) unlisted

## AU-12 Audit Generation

This blueprint provides policy definitions that audit and enforce deployment of the Log Analytics
agent on Azure virtual machines and configuration of audit settings for other Azure resource types.
These policy definitions also audit configuration of diagnostic logs to provide insight into
operations that are performed within Azure resources. Additionally, auditing and Advanced Data
Security are configured on SQL servers.

- \[Preview\]: Audit Log Analytics Agent Deployment - VM Image (OS) unlisted
- \[Preview\]: Audit Log Analytics Agent Deployment in VMSS - VM Image (OS) unlisted
- \[Preview\]: Audit Log Analytics Workspace for VM - Report Mismatch
- \[Preview\]: Deploy Log Analytics Agent for Linux VM Scale Sets (VMSS)
- \[Preview\]: Deploy Log Analytics Agent for Linux VMs
- \[Preview\]: Deploy Log Analytics Agent for Windows VM Scale Sets (VMSS)
- \[Preview\]: Deploy Log Analytics Agent for Windows VMs
- Audit diagnostic setting
- Auditing should be enabled on advanced data security settings on SQL Server
- Advanced data security should be enabled on your managed instances
- Advanced data security should be enabled on your SQL servers
- Deploy Advanced Data Security on SQL servers
- Deploy Auditing on SQL servers
- Deploy Diagnostic Settings for Network Security Groups

## AU-12 (01) Audit Generation | System-Wide / Time-Correlated Audit Trail

This blueprint helps you ensure system events are logged by assigning
[Azure Policy](../../../policy/overview.md) definitions that audit log settings on Azure resources.
This built-in policy requires you to specify an array of resource types to check whether diagnostic
settings are enabled or not.

- Audit diagnostic setting

## CM-7 (2) Least Functionality | Prevent Program Execution

Adaptive application control in Azure Security Center is an intelligent, automated end-to-end
application whitelisting solution that can block or prevent specific software from running on your
virtual machines. Application control can run in an enforcement mode that prohibits non-approved
application from running. This blueprint assigns an Azure Policy definition that helps you monitor
virtual machines where an application whitelist is recommended but has not yet been configured.

- Adaptive Application Controls should be enabled on virtual machines

## CM-7 (5) Least Functionality | Authorized Software / Whitelisting

Adaptive application control in Azure Security Center is an intelligent, automated end-to-end
application whitelisting solution that can block or prevent specific software from running on your
virtual machines. Application control helps you create approved application lists for your virtual
machines. This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that
helps you monitor virtual machines where an application whitelist is recommended but has not yet
been configured.

- Adaptive Application Controls should be enabled on virtual machines

## CM-11 User-Installed Software

Adaptive application control in Azure Security Center is an intelligent, automated end-to-end
application whitelisting solution that can block or prevent specific software from running on your
virtual machines. Application control can help you enforce and monitor compliance with software
restriction policies. This blueprint assigns an [Azure Policy](../../../policy/overview.md)
definition that helps you monitor virtual machines where an application whitelist is recommended but
has not yet been configured.

- Adaptive Application Controls should be enabled on virtual machines

## CP-7 Alternate Processing Site

Azure Site Recovery replicates workloads running on virtual machines from a primary location to a
secondary location. If an outage occurs at the primary site, the workload fails over the secondary
location. This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that
audits virtual machines without disaster recovery configured. Monitoring this indicator can help you
ensure necessary contingency controls are in place.

- Audit virtual machines without disaster recovery configured

## CP-9 (05)  Information System Backup | Transfer to Alternate Storage Site

This blueprint assigns Azure Policy definitions that audit the organization's system backup
information to the alternate storage site electronically. For physical shipment of storage metadata,
consider using Azure Data Box.

- Geo-redundant storage should be enabled for Storage Accounts
- Geo-redundant backup should be enabled for Azure Database for PostgreSQL
- Geo-redundant backup should be enabled for Azure Database for MySQL
- Geo-redundant backup should be enabled for Azure Database for MariaDB
- Long-term geo-redundant backup should be enabled for Azure SQL Databases

## IA-2 (1) Identification and Authentication (Organizational Users) | Network Access to Privileged Accounts

This blueprint helps you restrict and control privileged access by assigning
[Azure Policy](../../../policy/overview.md) definitions to audit accounts with owner and/or write
permissions that don't have multi-factor authentication enabled. Multi-factor authentication helps
keep accounts secure even if one piece of authentication information is compromised. By monitoring
accounts without multi-factor authentication enabled, you can identify accounts that may be more
likely to be compromised.

- MFA should be enabled on accounts with owner permissions on your subscription
- MFA should be enabled on accounts with write permissions on your subscription

## IA-2 (2) Identification and Authentication (Organizational Users) | Network Access to Non-Privileged Accounts

This blueprint helps you restrict and control access by assigning an
[Azure Policy](../../../policy/overview.md) definition to audit accounts with read permissions that
don't have multi-factor authentication enabled. Multi-factor authentication helps keep accounts
secure even if one piece of authentication information is compromised. By monitoring accounts
without multi-factor authentication enabled, you can identify accounts that may be more likely to be
compromised.

- MFA should be enabled on accounts with read permissions on your subscription

## IA-5 Authenticator Management

This blueprint assigns [Azure Policy](../../../policy/overview.md) definitions that audit Linux
virtual machines that allow remote connections from accounts without passwords and/or have incorrect
permissions set on the passwd file. This blueprint also assigns policy definitions that audit the
configuration of the password encryption type for Windows virtual machines. Monitoring these
indicators helps you ensure that system authenticators comply with your organization's
identification and authentication policy.

- \[Preview\]: Audit Linux VMs that do not have the passwd file permissions set to 0644
- \[Preview\]: Audit Linux VMs that have accounts without passwords
- \[Preview\]: Audit Windows VMs that do not store passwords using reversible encryption
- \[Preview\]: Deploy requirements to audit Linux VMs that do not have the passwd file permissions set to 0644
- \[Preview\]: Deploy requirements to audit Linux VMs that have accounts without passwords
- \[Preview\]: Deploy requirements to audit Windows VMs that do not store passwords using reversible encryption

## IA-5 (1) Authenticator Management | Password-Based Authentication

This blueprint helps you enforce strong passwords by assigning [Azure Policy](../../../policy/overview.md)
definitions that audit Windows virtual machines that don't enforce minimum strength and other
password requirements. Awareness of virtual machines in violation of the password strength policy
helps you take corrective actions to ensure passwords for all virtual machine user accounts comply
with your organization's password policy.

- \[Preview\]: Audit Windows VMs that allow re-use of the previous 24 passwords
- \[Preview\]: Audit Windows VMs that do not have a maximum password age of 70 days
- \[Preview\]: Audit Windows VMs that do not have a minimum password age of 1 day
- \[Preview\]: Audit Windows VMs that do not have the password complexity setting enabled
- \[Preview\]: Audit Windows VMs that do not restrict the minimum password length to 14 characters
- \[Preview\]: Audit Windows VMs that do not store passwords using reversible encryption
- \[Preview\]: Deploy requirements to audit Windows VMs that allow re-use of the previous 24 passwords
- \[Preview\]: Deploy requirements to audit Windows VMs that do not have a maximum password age of 70 days
- \[Preview\]: Deploy requirements to audit Windows VMs that do not have a minimum password age of 1 day
- \[Preview\]: Deploy requirements to audit Windows VMs that do not have the password complexity setting enabled
- \[Preview\]: Deploy requirements to audit Windows VMs that do not restrict the minimum password length to 14 characters
- \[Preview\]: Deploy requirements to audit Windows VMs that do not store passwords using reversible encryption

## IR-6 (2) Incident Reporting | Vulnerabilities Related to Incidents

This blueprint provides policy definitions that audit records with analysis of vulnerability
assessment on virtual machines, virtual machine scale sets, and SQL servers. These insights provide
real-time information about the security state of your deployed resources and can help you prioritize
remediation actions.

- Vulnerabilities in security configuration on your virtual machine scale sets should be remediated
- Vulnerabilities should be remediated by a Vulnerability Assessment solution
- Vulnerabilities in security configuration on your machines should be remediated
- Vulnerabilities in container security configurations should be remediated
- Vulnerabilities on your SQL databases should be remediated

## RA-5 Vulnerability Scanning

This blueprint helps you manage information system vulnerabilities by assigning [Azure Policy](../../../policy/overview.md)
definitions that monitor operating system vulnerabilities, SQL vulnerabilities, and virtual machine
vulnerabilities in Azure Security Center. Azure Security Center provides reporting capabilities that
enable you to have real-time insight into the security state of deployed Azure resources. This
blueprint also assigns policy definitions that audit and enforce Advanced Data Security on SQL
servers. Advanced data security included vulnerability assessment and advanced threat protection
capabilities to help you understand vulnerabilities in your deployed resources.

- Advanced data security should be enabled on your managed instances
- Advanced data security should be enabled on your SQL servers
- Deploy Advanced Data Security on SQL servers
- Vulnerabilities in security configuration on your virtual machine scale sets should be remediated
- Vulnerabilities in security configuration on your virtual machines should be remediated
- Vulnerabilities on your SQL databases should be remediated
- Vulnerabilities should be remediated by a Vulnerability Assessment solution

## SC-5 Denial of Service Protection

Azure's distributed denial of service (DDoS) standard tier provides additional features and
mitigation capabilities over the basic service tier. These additional features include Azure Monitor
integration and the ability to review post-attack mitigation reports. This blueprint assigns an [Azure Policy](../../../policy/overview.md)
definition that audits if the DDoS standard tier is enabled. Understanding the capability difference
between the service tiers can help you select the best solution to address denial of service
protections for your Azure environment.

- DDoS Protection Standard should be enabled

## SC-7 Boundary Protection

This blueprint helps you manage and control the system boundary by assigning an [Azure Policy](../../../policy/overview.md)
definition that monitors for network security group hardening recommendations in Azure
Security Center. Azure Security Center analyzes traffic patterns of Internet facing virtual machines
and provides network security group rule recommendations to reduce the potential attack surface.
Additionally, this blueprint also assigns policy definitions that monitor unprotected
endpoints, applications, and storage accounts. Endpoints and applications that aren't protected by a
firewall, and storage accounts with unrestricted access can allow unintended access to information
contained within the information system.

- Network Security Group Rules for Internet facing virtual machines should be hardened
- Access through Internet facing endpoint should be restricted
- The NSGs rules for web applications on IaaS should be hardened
- Audit unrestricted network access to storage accounts

## SC-7 (3) Boundary Protection | Access Points

Just-in-time (JIT) virtual machine access locks down inbound traffic to Azure virtual machines,
reducing exposure to attacks while providing easy access to connect to VMs when needed. JIT virtual
machine access helps you limit the number of external connections to your resources in Azure. This
blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that helps you monitor
virtual machines that can support just-in-time access but haven't yet been configured.

- Just-In-Time network access control should be applied on virtual machines

## SC-7 (4) Boundary Protection | External Telecommunications Services

Just-in-time (JIT) virtual machine access locks down inbound traffic to Azure virtual machines,
reducing exposure to attacks while providing easy access to connect to VMs when needed. JIT virtual
machine access helps you manage exceptions to your traffic flow policy by facilitating the access
request and approval processes. This blueprint assigns an [Azure Policy](../../../policy/overview.md)
definition that helps you monitor virtual machines that can support just-in-time access but haven't
yet been configured.

- Just-In-Time network access control should be applied on virtual machines

## SC-8 (1) Transmission Confidentiality and Integrity | Cryptographic or Alternate Physical Protection

This blueprint helps you protect the confidential and integrity of transmitted information by 
assigning [Azure Policy](../../../policy/overview.md) definitions that help you monitor 
cryptographic mechanism implemented for communications protocols. Ensuring communications are 
properly encrypted can help you meet your organization's requirements or protecting information 
from unauthorized disclosure and modification.

- API App should only be accessible over HTTPS
- Audit Windows web servers that are not using secure communication protocols
- Deploy requirements to audit Windows web servers that are not using secure communication protocols
- Function App should only be accessible over HTTPS
- Only secure connections to your Redis Cache should be enabled
- Secure transfer to storage accounts should be enabled
- Web Application should only be accessible over HTTPS

## SC-28 (1) Protection of Information at Rest | Cryptographic Protection

This blueprint helps you enforce your policy on the use of cryptograph controls to protect
information at rest by assigning [Azure Policy](../../../policy/overview.md) definitions that
enforce specific cryptograph controls and audit use of weak cryptographic settings. Understanding
where your Azure resources may have non-optimal cryptographic configurations can help you take
corrective actions to ensure resources are configured in accordance with your information security
policy. Specifically, the policy definitions assigned by this blueprint require encryption for data
lake storage accounts; require transparent data encryption on SQL databases; and audit missing
encryption on SQL databases, virtual machine disks, and automation account variables.

- Advanced data security should be enabled on your managed instances
- Advanced data security should be enabled on your SQL servers
- Deploy Advanced Data Security on SQL servers
- Deploy SQL DB transparent data encryption
- Disk encryption should be applied on virtual machines
- Require encryption on Data Lake Store accounts
- Transparent Data Encryption on SQL databases should be enabled

## SI-2 Flaw Remediation

This blueprint helps you manage information system flaws by assigning [Azure Policy](../../../policy/overview.md)
definitions that monitor missing system updates, operating system vulnerabilities, SQL
vulnerabilities, and virtual machine vulnerabilities in Azure Security Center. Azure Security Center
provides reporting capabilities that enable you to have real-time insight into the security state of
deployed Azure resources. This blueprint also assigns a policy definition that ensures patching
of the operating system for virtual machine scale sets.

- Require automatic OS image patching on Virtual Machine Scale Sets
- System updates on virtual machine scale sets should be installed
- System updates should be installed on your virtual machines
- Vulnerabilities in security configuration on your virtual machine scale sets should be remediated
- Vulnerabilities in security configuration on your virtual machines should be remediated
- Vulnerabilities on your SQL databases should be remediated
- Vulnerabilities should be remediated by a Vulnerability Assessment solution

## SI-02 (06) Flaw Remediation | Removal of Previous Versions of Software / Firmware

This blueprint assigns policy definitions that help you ensure applications are using the latest
version of the .NET Framework, HTTP, Java, PHP, Python, and TLS. This blueprint also assigns
a policy definition that ensures that Kubernetes Services is upgraded to its non-vulnerable version.

- Ensure that '.Net Framework' version is the latest, if used as a part of the API app
- Ensure that '.Net Framework' version is the latest, if used as a part of the Function App
- Ensure that '.Net Framework' version is the latest, if used as a part of the Web app
- Ensure that 'HTTP Version' is the latest, if used to run the Api app
- Ensure that 'HTTP Version' is the latest, if used to run the Function app
- Ensure that 'HTTP Version' is the latest, if used to run the Web app
- Ensure that 'Java version' is the latest, if used as a part of the Api app
- Ensure that 'Java version' is the latest, if used as a part of the Function app
- Ensure that 'Java version' is the latest, if used as a part of the Web app
- Ensure that 'PHP version' is the latest, if used as a part of the Api app
- Ensure that 'PHP version' is the latest, if used as a part of the Function app
- Ensure that 'PHP version' is the latest, if used as a part of the WEB app
- Ensure that 'Python version' is the latest, if used as a part of the Api app
- Ensure that 'Python version' is the latest, if used as a part of the Function app
- Ensure that 'Python version' is the latest, if used as a part of the Web app
- Latest TLS version should be used in your API App
- Latest TLS version should be used in your Function App
- Latest TLS version should be used in your Web App
- \[Preview\]: Kubernetes Services should be upgraded to a non-vulnerable Kubernetes version

## SI-3 Malicious Code Protection

This blueprint helps you manage endpoint protection, including malicious code protection, by
assigning [Azure Policy](../../../policy/overview.md) definitions that monitor for missing
endpoint protection on virtual machines in Azure Security Center and enforce the Microsoft
antimalware solution on Windows virtual machines.

- Deploy default Microsoft IaaSAntimalware extension for Windows Server
- Endpoint protection solution should be installed on virtual machine scale sets
- Monitor missing Endpoint Protection in Azure Security Center

## SI-3 (1) Malicious Code Protection | Central Management

This blueprint helps you manage endpoint protection, including malicious code protection, by
assigning [Azure Policy](../../../policy/overview.md) definitions that monitor for missing
endpoint protection on virtual machines in Azure Security Center. Azure Security Center provides
centralized management and reporting capabilities that enable you to have real-time insight into the
security state of deployed Azure resources.

- Endpoint protection solution should be installed on virtual machine scale sets
- Monitor missing Endpoint Protection in Azure Security Center

## SI-4 Information System Monitoring

This blueprint helps you monitor your system by auditing and enforcing logging and data security
across Azure resources. Specifically, the policies assigned audit and enforce deployment of the Log
Analytics agent, and enhanced security settings for SQL databases, storage accounts and network
resources. These capabilities can help you detect anomalous behavior and indicators of attacks so
you can take appropriate action.

- \[Preview\]: Audit Log Analytics Agent Deployment - VM Image (OS) unlisted
- \[Preview\]: Audit Log Analytics Agent Deployment in VMSS - VM Image (OS) unlisted
- \[Preview\]: Audit Log Analytics Workspace for VM - Report Mismatch
- \[Preview\]: Deploy Log Analytics Agent for Linux VM Scale Sets (VMSS)
- \[Preview\]: Deploy Log Analytics Agent for Linux VMs
- \[Preview\]: Deploy Log Analytics Agent for Windows VM Scale Sets (VMSS)
- \[Preview\]: Deploy Log Analytics Agent for Windows VMs
- Advanced data security should be enabled on your managed instances
- Advanced data security should be enabled on your SQL servers
- Deploy Advanced Data Security on SQL servers
- Deploy Advanced Threat Protection on Storage Accounts
- Deploy Auditing on SQL servers
- Deploy network watcher when virtual networks are created
- Deploy Threat Detection on SQL servers
- Allowed locations
- Allowed locations for resource groups

## SI-4 (12) Information System Monitoring | Automated Alerts

This blueprint provides policy definitions that help you ensure data security notifications are
properly enabled. In addition, this blueprint ensures that the standard pricing tier is enabled
for Azure Security Center. Note that the standard pricing tier enables threat detection for networks
and virtual machines, providing threat intelligence, anomaly detection, and behavior analytics in
Azure Security Center.

- Email notification to subscription owner for high severity alerts should be enabled
- A security contact email address should be provided for your subscription 
- Email notifications to admins and subscription owners should be enabled in SQL managed instance advanced data security settings 
- Email notifications to admins and subscription owners should be enabled in SQL server advanced data security settings 
- A security contact phone number should be provided for your subscription
- Advanced data security settings for SQL server should contain an email address to receive security alerts
- Security Center standard pricing tier should be selected

## SI-4 (18) Information System Monitoring | Analyze Traffic / Covert Exfiltration

Advanced Threat Protection for Azure Storage detects unusual and potentially harmful attempts to
access or exploit storage accounts. Protection alerts include anomalous access patterns, anomalous
extracts/uploads, and suspicious storage activity. These indicators can help you detect covert
exfiltration of information.

- Deploy Advanced Threat Protection on Storage Accounts

> [!NOTE]
> Availability of specific Azure Policy definitions may vary in Azure Government and other national 
> clouds. 

## Next steps

Now that you've reviewed the control mapping of the DoD Impact Level 4 blueprint, visit the following
articles to learn about the blueprint and how to deploy this sample:

> [!div class="nextstepaction"]
> [DoD Impact Level 4 blueprint - Overview](./index.md)
> [DoD Impact Level 4 blueprint - Deploy steps](./deploy.md)

Additional articles about blueprints and how to use them:

- Learn about the [blueprint lifecycle](../../concepts/lifecycle.md).
- Understand how to use [static and dynamic parameters](../../concepts/parameters.md).
- Learn to customize the [blueprint sequencing order](../../concepts/sequencing-order.md).
- Find out how to make use of [blueprint resource locking](../../concepts/resource-locking.md).
- Learn how to [update existing assignments](../../how-to/update-existing-assignments.md).