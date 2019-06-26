---
title: Sample - NIST SP 800-53 R4 blueprint - Control mapping
description: Control mapping of the NIST SP 800-53 R4 blueprint sample to Azure Policy and RBAC.
author: DCtheGeek
ms.author: dacoulte
ms.date: 06/24/2019
ms.topic: sample
ms.service: blueprints
manager: carmonm
---
# Control mapping of the NIST SP 800-53 R4 blueprint sample

The following article details how the Azure Blueprints NIST SP 800-53 R4 blueprint sample maps to
the NIST SP 800-53 R4 controls. For more information about the controls, see [NIST SP 800-53](https://nvd.nist.gov/800-53).

The following mappings are to the **NIST SP 800-53 (Rev. 4)** controls. Use the navigation on the
right to jump directly to a specific control mapping. Many of the mapped controls are implemented
with an [Azure Policy](../../../policy/overview.md) initiative. To review the complete initiative,
open **Policy** in the Azure portal and select the **Definitions** page. Then, find and select the **[Preview]:
Audit NIST SP 800-53 R4 controls and deploy specific VM Extensions to support audit requirements**
built-in policy initiative.

## AC-2 Account Management

This blueprint helps you review accounts that may not comply with your organization’s account
management requirements. This blueprint assigns five Azure Policy definitions that audit external
accounts with read, write and owner permissions on a subscription and deprecated accounts. By
reviewing the accounts audited by these policies, you can take appropriate action to ensure account
management requirements are met.

- [Preview]: Audit deprecated accounts on a subscription
- [Preview]: Audit deprecated accounts with owner permissions on a subscription
- [Preview]: Audit external accounts with owner permissions on a subscription
- [Preview]: Audit external accounts with read permissions on a subscription
- [Preview]: Audit external accounts with write permissions on a subscription

## AC-2 (7) Account Management | Role-Based Schemes

Azure implements [role-based access control](../../../../role-based-access-control/overview.md)
(RBAC) to help you manage who has access to resources in Azure. Using the Azure portal, you can
review who has access to Azure resources and their permissions. This blueprint also assigns two [Azure Policy](../../../policy/overview.md)
definitions to audit use of Azure Active Directory authentication for SQL Servers and Service
Fabric. Using Azure Active Directory authentication enables simplified permission management and
centralized identity management of database users and other Microsoft services.

- Audit provisioning of an Azure Active Directory administrator for SQL server
- Audit usage of Azure Active Directory for client authentication in Service Fabric

## AC-2 (12) Account Management | Account Monitoring / Atypical Usage

Just-in-time (JIT) virtual machine access locks down inbound traffic to Azure virtual machines,
reducing exposure to attacks while providing easy access to connect to VMs when needed. All JIT
requests to access virtual machines are logged in the Activity Log allowing you to monitor for
atypical usage. This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition
that helps you monitor virtual machines that can support just-in-time access but have not yet been
configured.

- [Preview]: Monitor possible network Just In Time (JIT) access in Azure Security Center

## AC-4 Information Flow Enforcement

Cross origin resource sharing (CORS) can allow App Services resources to be requested from an
outside domain. Microsoft recommends that you allow only required domains to interact with your API,
function, and web applications. This blueprint assigns an [Azure Policy](../../../policy/overview.md)
definition to help you monitor CORS resources access restrictions in Azure Security Center.
Understanding CORS implementations can help you verify that information flow controls are
implemented.

- [Preview]: Audit CORS resource access restrictions for a Web Application

## AC-5 Separation of Duties

Having only one Azure subscription owner doesn't allow for administrative redundancy. Conversely,
having too many Azure subscription owners can increase the potential for a breach via a compromised
owner account. This blueprint helps you maintain an appropriate number of Azure subscription owners
by assigning two [Azure Policy](../../../policy/overview.md) definitions that audit the number of
owners for Azure subscriptions. This blueprint also assigns four Azure Policy definitions that help
you control membership of the Administrators group on Windows virtual machines. Managing
subscription owner and virtual machine administrator permissions can help you implement appropriate
separation of duties.

- [Preview]: Audit maximum number of owners for a subscription
- [Preview]: Audit minimum number of owners for subscription
- Audit that the Administrators group inside Windows VMs excludes the specified members
- Audit that the Administrators group inside Windows VMs includes the specified members
- Deploy VM extension to audit that the Administrators group inside Windows VMs excludes the specified members
- Deploy VM extension to audit that the Administrators group inside Windows VMs includes the specified members

## AC-6 (7) Least Privilege | Review of User Privileges

Azure implements [role-based access control](../../../../role-based-access-control/overview.md)
(RBAC) to help you manage who has access to resources in Azure. Using the Azure portal, you can
review who has access to Azure resources and their permissions. This blueprint assigns six [Azure Policy](../../../policy/overview.md)
definitions to audit accounts that should be prioritized for review. Reviewing these account
indicators can help you ensure least privilege controls are implemented.

- [Preview]: Audit maximum number of owners for a subscription
- [Preview]: Audit minimum number of owners for subscription
- Audit that the Administrators group inside Windows VMs excludes the specified members
- Audit that the Administrators group inside Windows VMs includes the specified members
- Deploy VM extension to audit that the Administrators group inside Windows VMs excludes the specified members
- Deploy VM extension to audit that the Administrators group inside Windows VMs includes the specified members

## AC-17 (1) Remote Access | Automated Monitoring / Control

This blueprint helps you monitor and control remote access by assigning three [Azure Policy](../../../policy/overview.md)
definitions to monitors that remote debugging for Azure App Service application is turned off and
two policy definitions that audit Linux virtual machines that allow remote connections from accounts
without passwords. This blueprint also assigns an Azure Policy definition that helps you monitor
unrestricted access to storage accounts. Monitoring these indicators can help you ensure remote
access methods comply with your security policy.

- [Preview]: Audit remote debugging state for a Function App
- [Preview]: Audit remote debugging state for a Web Application
- [Preview]: Audit remote debugging state for an API App
- [Preview]: Audit that Linux VMs do not allow remote connections from accounts without passwords
- [Preview]: Deploy VM extension to audit that Linux VMs do not allow remote connections from accounts without passwords
- Audit unrestricted network access to storage accounts

## AU-3 (2) Content of Audit Records | Centralized Management of Planned Audit Record Content

Log data collected by Azure Monitor is stored in a Log Analytics workspace enabling centralized
configuration and management. This blueprint helps you ensure events are logged by assigning seven [Azure Policy](../../../policy/overview.md)
definitions that audit and enforce deployment of the Log Analytics agent on Azure virtual machines.

- [Preview]: Audit Log Analytics Agent Deployment - VM Image (OS) unlisted
- [Preview]: Audit Log Analytics Agent Deployment in VMSS - VM Image (OS) unlisted
- [Preview]: Audit Log Analytics Workspace for VM - Report Mismatch
- [Preview]: Deploy Log Analytics Agent for Linux VM Scale Sets (VMSS)
- [Preview]: Deploy Log Analytics Agent for Linux VMs
- [Preview]: Deploy Log Analytics Agent for Windows VM Scale Sets (VMSS)
- [Preview]: Deploy Log Analytics Agent for Windows VMs

## AU-5 Response to Audit Processing Failures

This blueprint assigns five [Azure Policy](../../../policy/overview.md) definitions that monitor
audit and event logging configurations. Monitoring these configurations can provide an indicator of
an audit system failure or misconfiguration and help you take corrective action.

- [Preview]: Monitor unaudited SQL servers in Azure Security Center
- Audit diagnostic setting
- Audit SQL managed instances without Advanced Data Security
- Audit SQL server level Auditing settings
- Audit SQL servers without Advanced Data Security

## AU-6 (4) Audit Review, Analysis, and Reporting | Central Review and Analysis

Log data collected by Azure Monitor is stored in a Log Analytics workspace enabling centralized
reporting and analysis. This blueprint helps you ensure events are logged by assigning seven [Azure Policy](../../../policy/overview.md)
definitions that audit and enforce deployment of the Log Analytics agent on Azure virtual machines.

- [Preview]: Audit Log Analytics Agent Deployment - VM Image (OS) unlisted
- [Preview]: Audit Log Analytics Agent Deployment in VMSS - VM Image (OS) unlisted
- [Preview]: Audit Log Analytics Workspace for VM - Report Mismatch
- [Preview]: Deploy Log Analytics Agent for Linux VM Scale Sets (VMSS)
- [Preview]: Deploy Log Analytics Agent for Linux VMs
- [Preview]: Deploy Log Analytics Agent for Windows VM Scale Sets (VMSS)
- [Preview]: Deploy Log Analytics Agent for Windows VMs

## AU-12 Audit Generation

This blueprint helps you ensure system events are logged by assigning 15 [Azure Policy](../../../policy/overview.md)
definitions that audit log settings on Azure resources. These policy definitions audit and enforce
deployment of the Log Analytics agent on Azure virtual machines and configuration of audit settings
for other Azure resource types. These policy definitions also audit configuration of diagnostic logs
to provide insight into operations that are performed within Azure resources. Additionally, auditing
and Advanced Data Security are configured on SQL servers.

- [Preview]: Audit Log Analytics Agent Deployment - VM Image (OS) unlisted
- [Preview]: Audit Log Analytics Agent Deployment in VMSS - VM Image (OS) unlisted
- [Preview]: Audit Log Analytics Workspace for VM - Report Mismatch
- [Preview]: Deploy Log Analytics Agent for Linux VM Scale Sets (VMSS)
- [Preview]: Deploy Log Analytics Agent for Linux VMs
- [Preview]: Deploy Log Analytics Agent for Windows VM Scale Sets (VMSS)
- [Preview]: Deploy Log Analytics Agent for Windows VMs
- [Preview]: Monitor unaudited SQL servers in Azure Security Center
- Apply Diagnostic Settings for Network Security Groups
- Audit diagnostic setting
- Audit SQL managed instances without Advanced Data Security
- Audit SQL server level Auditing settings
- Audit SQL servers without Advanced Data Security
- Deploy Advanced Data Security on SQL servers
- Deploy Auditing on SQL servers

## CM-7 (2) Least Functionality | Prevent Program Execution

Adaptive application control in Azure Security Center is an intelligent, automated end-to-end
application whitelisting solution that can block or prevent specific software from running on your
virtual machines. Application control can run in an enforcement mode that prohibits non-approved
application from running. This blueprint assigns an Azure Policy definition that helps you monitor
virtual machines where an application whitelist is recommended but has not yet been configured.

- [Preview]: Monitor possible app whitelisting in Azure Security Center

## CM-7 (5) Least Functionality | Authorized Software / Whitelisting

Adaptive application control in Azure Security Center is an intelligent, automated end-to-end
application whitelisting solution that can block or prevent specific software from running on your
virtual machines. Application control helps you create approved application lists for your virtual
machines. This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that
helps you monitor virtual machines where an application whitelist is recommended but has not yet
been configured.

- [Preview]: Monitor possible app whitelisting in Azure Security Center

## CM-11 User-Installed Software

Adaptive application control in Azure Security Center is an intelligent, automated end-to-end
application whitelisting solution that can block or prevent specific software from running on your
virtual machines. Application control can help you enforce and monitor compliance with software
restriction policies. This blueprint assigns an [Azure Policy](../../../policy/overview.md)
definition that helps you monitor virtual machines where an application whitelist is recommended but
has not yet been configured.

- [Preview]: Monitor possible app whitelisting in Azure Security Center

## CP-7 Alternate Processing Site

Azure Site Recovery replicates workloads running on virtual machines from a primary location to a
secondary location. If an outage occurs at the primary site, the workload fails over the secondary
location. This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that
audits virtual machines without disaster recovery configured. Monitoring this indicator can help you
ensure necessary contingency controls are in place.

- Audit virtual machines without disaster recovery configured

## IA-2 (1) Identification and Authentication (Organizational Users) | Network Access to Privileged Accounts

This blueprint helps you restrict and control privileged access by assigning two [Azure Policy](../../../policy/overview.md)
definitions to audit accounts with owner and/or write permissions that don't have multi-factor
authentication enabled. Multi-factor authentication helps keep accounts secure even if one piece of
authentication information is compromised. By monitoring accounts without multi-factor
authentication enabled, you can identify accounts that may be more likely to be compromised.

- [Preview]: Audit accounts with owner permissions who are not MFA enabled on a subscription
- [Preview]: Audit accounts with write permissions who are not MFA enabled on a subscription

## IA-2 (2) Identification and Authentication (Organizational Users) | Network Access to Non-Privileged Accounts

This blueprint helps you restrict and control access by assigning an [Azure Policy](../../../policy/overview.md)
definition to audit accounts with read permissions that don't have multi-factor authentication
enabled. Multi-factor authentication helps keep accounts secure even if one piece of authentication
information is compromised. By monitoring accounts without multi-factor authentication enabled, you
can identify accounts that may be more likely to be compromised.

- [Preview]: Audit accounts with read permissions who are not MFA enabled on a subscription

## IA-5 Authenticator Management

This blueprint assigns five [Azure Policy](../../../policy/overview.md) definitions that audit Linux
virtual machines that allow remote connections from accounts without passwords and/or have incorrect
permissions set on the passwd file. This blueprint also assigns a policy definition that audits the
conjugation of the password encryption type for Windows virtual machines. Monitoring these
indicators helps you ensure that system authenticators comply with your organization’s
identification and authentication policy.

- [Preview]: Audit that Linux VMs do not have accounts without passwords
- [Preview]: Deploy VM extension to audit that Linux VMs do not have accounts without passwords
- [Preview]: Audit that Linux VMs have the passwd file permissions set to 0644
- [Preview]: Audit that Windows VMs store passwords using reversible encryption
- [Preview]: Deploy VM extension to audit that Linux VMs have the passwd file permissions set to 0644

## IA-5 (1) Authenticator Management | Password-Based Authentication

This blueprint helps you enforce strong passwords by assigning 12 [Azure Policy](../../../policy/overview.md)
definitions that audit Windows virtual machines that don't enforce minimum strength and other
password requirements. Awareness of virtual machines in violation of the password strength policy
helps you take corrective actions to ensure passwords for all virtual machine user accounts comply
with your organization’s password policy.

- [Preview]: Audit that Windows VMs cannot re-use the previous 24 passwords
- [Preview]: Audit that Windows VMs have a maximum password age of 70 days
- [Preview]: Audit that Windows VMs have a minimum password age of 1 day
- [Preview]: Audit that Windows VMs have the password complexity setting enabled
- [Preview]: Audit that Windows VMs restrict the minimum password length to 14 characters
- [Preview]: Audit that Windows VMs store passwords using reversible encryption
- [Preview]: Deploy VM extension to audit that Windows VMs cannot re-use the previous 24 passwords
- [Preview]: Deploy VM extension to audit that Windows VMs have a maximum password age of 70 days
- [Preview]: Deploy VM extension to audit that Windows VMs have a minimum password age of 1 day
- [Preview]: Deploy VM extension to audit that Windows VMs have the password complexity setting enabled
- [Preview]: Deploy VM extension to audit that Windows VMs restrict the minimum password length to 14 characters
- [Preview]: Deploy VM extension to audit that Windows VMs store passwords using reversible encryption

## RA-5 Vulnerability Scanning

This blueprint helps you manage information system vulnerabilities by assigning four [Azure Policy](../../../policy/overview.md)
definitions that monitor operating system vulnerabilities, SQL vulnerabilities, and virtual machine
vulnerabilities in Azure Security Center. Azure Security Center provides reporting capabilities that
enable you to have real-time insight into the security state of deployed Azure resources. This
blueprint also assigns three policy definitions that audit and enforce Advanced Data Security on SQL
servers. Advanced data security included vulnerability assessment and advanced threat protection
capabilities to help you understand vulnerabilities in your deployed resources.

- Audit SQL managed instances without Advanced Data Security
- Audit SQL servers without Advanced Data Security
- Deploy Advanced Data Security on SQL servers
- [Preview]: Audit OS vulnerabilities on your virtual machine scale sets in Azure Security Center
- [Preview]: Monitor OS vulnerabilities in Azure Security Center
- [Preview]: Monitor SQL vulnerability assessment results in Azure Security Center
- [Preview]: Monitor VM Vulnerabilities in Azure Security Center

## SC-5 Denial of Service Protection

Azure’s distributed denial of service (DDoS) standard tier provides additional features and
mitigation capabilities over the basic service tier. These additional features include Azure Monitor
integration and the ability to review post-attack mitigation reports. This blueprint assigns an [Azure Policy](../../../policy/overview.md)
definition that audits if the DDoS standard tier is enabled. Understanding the capability difference
between the service tiers can help you select the best solution to address denial of service
protections for your Azure environment.

- [Preview]: Audit standard tier of DDoS protection is enabled for a virtual network

## SC-7 Boundary Protection

This blueprint helps you manage and control the system boundary by assigning an [Azure Policy](../../../policy/overview.md)
definition that monitors network security groups with permissive rules. Rules that are too
permissive may allow unintended network access and should be reviewed. This blueprint also assigns a
policy definition that monitors for network security group hardening recommendations in Azure
Security Center. Azure Security Center analyzes traffic patterns of Internet facing virtual machines
and provides network security group rule recommendations to reduce the potential attack surface.
Additionally, this blueprint also assigns three policy definitions that monitor unprotected
endpoints, applications, and storage accounts. Endpoints and applications that aren't protected by a
firewall, and storage accounts with unrestricted access can allow unintended access to information
contained within the information system.

- [Preview]: Monitor Internet-facing virtual machines for Network Security Group traffic hardening recommendations
- [Preview]: Monitor permissive network access in Azure Security Center
- [Preview]: Monitor unprotected network endpoints in Azure Security Center
- [Preview]: Monitor unprotected web application in Azure Security Center
- Audit unrestricted network access to storage accounts

## SC-7 (3) Boundary Protection | Access Points

Just-in-time (JIT) virtual machine access locks down inbound traffic to Azure virtual machines,
reducing exposure to attacks while providing easy access to connect to VMs when needed. JIT virtual
machine access helps you limit the number of external connections to your resources in Azure. This
blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that helps you monitor
virtual machines that can support just-in-time access but have not yet been configured.

- [Preview]: Monitor possible network Just In Time (JIT) access in Azure Security Center

## SC-7 (4) Boundary Protection | External Telecommunications Services

Just-in-time (JIT) virtual machine access locks down inbound traffic to Azure virtual machines,
reducing exposure to attacks while providing easy access to connect to VMs when needed. JIT virtual
machine access helps you manage exceptions to your traffic flow policy by facilitating the access
request and approval processes. This blueprint assigns an [Azure Policy](../../../policy/overview.md)
definition that helps you monitor virtual machines that can support just-in-time access but have not
yet been configured.

- [Preview]: Monitor possible network Just In Time (JIT) access in Azure Security Center

## SC-28 (1) Protection of Information at Rest | Cryptographic Protection

This blueprint helps you enforce your policy on the use of cryptograph controls to protect
information at rest by assigning 9 [Azure Policy](../../../policy/overview.md) definitions that
enforce specific cryptograph controls and audit use of weak cryptographic settings. Understanding
where your Azure resources may have non-optimal cryptographic configurations can help you take
corrective actions to ensure resources are configured in accordance with your information security
policy. Specifically, the policy definitions assigned by this blueprint require encryption for data
lake storage accounts; require transparent data encryption on SQL databases; and audit missing
encryption on SQL databases, virtual machine disks, and automation account variables.

- [Preview]: Monitor unencrypted SQL databases in Azure Security Center
- [Preview]: Monitor unencrypted VM Disks in Azure Security Center
- Audit secure transfer to storage accounts
- Audit SQL managed instances without Advanced Data Security
- Audit SQL servers without Advanced Data Security
- Audit transparent data encryption status
- Deploy Advanced Data Security on SQL servers
- Deploy SQL DB transparent data encryption
- Enforce encryption on Data Lake Store accounts

## SI-2 Flaw Remediation

This blueprint helps you manage information system flaws by assigning six [Azure Policy](../../../policy/overview.md)
definitions that monitor missing system updates, operating system vulnerabilities, SQL
vulnerabilities, and virtual machine vulnerabilities in Azure Security Center. Azure Security Center
provides reporting capabilities that enable you to have real-time insight into the security state of
deployed Azure resources. This blueprint also assigns a policy definition that ensures automatic
upgrade of the operating system for virtual machine scale sets.

- [Preview]: Audit any missing system updates on virtual machine scale sets in Azure Security Center
- [Preview]: Audit OS vulnerabilities on your virtual machine scale sets in Azure Security Center
- [Preview]: Monitor missing system updates in Azure Security Center
- [Preview]: Monitor OS vulnerabilities in Azure Security Center
- [Preview]: Monitor SQL vulnerability assessment results in Azure Security Center
- [Preview]: Monitor VM Vulnerabilities in Azure Security Center
- Enforce automatic OS upgrade with app health checks on VMSS

## SI-3 Malicious Code Protection

This blueprint helps you manage endpoint protection, including malicious code protection, by
assigning three [Azure Policy](../../../policy/overview.md) definitions that monitor for missing
endpoint protection on virtual machines in Azure Security Center and enforce the Microsoft
antimalware solution on Windows virtual machines.

- [Preview]: Audit the endpoint protection solution on virtual machine scale sets in Azure Security Center
- [Preview]: Monitor missing Endpoint Protection in Azure Security Center
- Deploy default Microsoft IaaSAntimalware extension for Windows Server

## SI-3 (1) Malicious Code Protection | Central Management

This blueprint helps you manage endpoint protection, including malicious code protection, by
assigning two [Azure Policy](../../../policy/overview.md) definitions that monitor for missing
endpoint protection on virtual machines in Azure Security Center. Azure Security Center provides
centralized management and reporting capabilities that enable you to have real-time insight into the
security state of deployed Azure resources.

- [Preview]: Audit the endpoint protection solution on virtual machine scale sets in Azure Security Center
- [Preview]: Monitor missing Endpoint Protection in Azure Security Center

## SI-4 Information System Monitoring

This blueprint helps you monitor your system by auditing and enforcing logging and data security
across Azure resources. Specifically, the policies assigned audit and enforce deployment of the Log
Analytics agent, and enhanced security settings for SQL databases, storage accounts and network
resources. These capabilities can help you detect anomalous behavior and indicators of attacks so
you can take appropriate action.

- [Preview]: Audit Log Analytics Agent Deployment - VM Image (OS) unlisted
- [Preview]: Audit Log Analytics Agent Deployment in VMSS - VM Image (OS) unlisted
- [Preview]: Audit Log Analytics Workspace for VM - Report Mismatch
- [Preview]: Deploy Log Analytics Agent for Linux VM Scale Sets (VMSS)
- [Preview]: Deploy Log Analytics Agent for Linux VMs
- [Preview]: Deploy Log Analytics Agent for Windows VM Scale Sets (VMSS)
- [Preview]: Deploy Log Analytics Agent for Windows VMs
- Audit SQL managed instances without Advanced Data Security
- Audit SQL servers without Advanced Data Security
- Deploy Advanced Data Security on SQL servers
- Deploy Advanced Threat Protection on Storage Accounts
- Deploy Auditing on SQL servers
- Deploy network watcher when virtual networks are created
- Deploy Threat Detection on SQL servers

## SI-4 (18) Information System Monitoring | Analyze Traffic / Covert Exfiltration

Advanced Threat Protection for Azure Storage detects unusual and potentially harmful attempts to
access or exploit storage accounts. Protection alerts include anomalous access patterns, anomalous
extracts/uploads, and suspicious storage activity. These indicators can help you detect covert
exfiltration of information.

- Deploy Advanced Threat Protection on Storage Accounts

## Next steps

Addition articles about blueprints and how to use them:

- Learn about the [blueprint life-cycle](../../concepts/lifecycle.md).
- Understand how to use [static and dynamic parameters](../../concepts/parameters.md).
- Learn to customize the [blueprint sequencing order](../../concepts/sequencing-order.md).
- Find out how to make use of [blueprint resource locking](../../concepts/resource-locking.md).
- Learn how to [update existing assignments](../../how-to/update-existing-assignments.md).