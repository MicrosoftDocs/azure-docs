---
title: SWIFT CSP-CSCF v2020 blueprint sample controls
description: Control mapping of the SWIFT CSP-CSCF v2020 blueprint sample. Each control is mapped to one or more Azure Policy definitions that assist with assessment.
ms.date: 09/07/2023
ms.topic: sample
---
# Control mapping of the SWIFT CSP-CSCF v2020 blueprint sample

The following article details how the Azure Blueprints SWIFT CSP-CSCF v2020 blueprint sample maps to
the SWIFT CSP-CSCF v2020 controls. For more information about the controls, see
[SWIFT CSP-CSCF v2020](https://www.swift.com/myswift/customer-security-programme-csp).

The following mappings are to the **SWIFT CSP-CSCF v2020** controls. Use the navigation on the right
to jump directly to a specific control mapping. Many of the mapped controls are implemented with an
[Azure Policy](../../../policy/overview.md) initiative. To review the complete initiative, open
**Policy** in the Azure portal and select the **Definitions** page. Then, find and select the
**\[Preview\]: Audit SWIFT CSP-CSCF v2020 controls and deploy specific VM Extensions to support
audit requirements** built-in policy initiative.

> [!IMPORTANT]
> Each control below is associated with one or more [Azure Policy](../../../policy/overview.md)
> definitions. These policies may help you
> [assess compliance](../../../policy/how-to/get-compliance-data.md) with the control; however,
> there often is not a one-to-one or complete match between a control and one or more policies. As
> such, **Compliant** in Azure Policy refers only to the policies themselves; this doesn't ensure
> you're fully compliant with all requirements of a control. In addition, the compliance standard
> includes controls that aren't addressed by any Azure Policy definitions at this time. Therefore,
> compliance in Azure Policy is only a partial view of your overall compliance status. The
> associations between controls and Azure Policy definitions for this compliance blueprint sample
> may change over time. To view the change history, see the
> [GitHub Commit History](https://github.com/MicrosoftDocs/azure-docs/blob/main/articles/governance/blueprints/samples/swift-2020/control-mapping.md).

## 1.2 and 5.1 Account Management

This blueprint helps you review accounts that may not comply with your organization's account management requirements. This blueprint assigns [Azure Policy](../../../policy/overview.md) definitions that audit external accounts with read, write and owner permissions on a subscription and deprecated accounts. By reviewing the accounts audited by these policies, you can take appropriate action to ensure account management requirements are met.

- Deprecated accounts should be removed from your subscription
- Deprecated accounts with owner permissions should be removed from your subscription
- External accounts with owner permissions should be removed from your subscription
- External accounts with read permissions should be removed from your subscription
- External accounts with write permissions should be removed from your subscription

## 2.6, 5.1, 6.4, and 6.5A Account Management | Role-Based Schemes

[Azure role-based access control](../../../../role-based-access-control/overview.md) (Azure RBAC) to
help you manage who has access to resources in Azure. Using the Azure portal, you can review who has
access to Azure resources and their permissions. This blueprint also assigns
[Azure Policy](../../../policy/overview.md) definitions to audit use of Azure Active Directory
authentication for SQL Servers and Service Fabric. Using Azure Active Directory authentication
enables simplified permission management and centralized identity management of database users and
other Microsoft services. Additionally, this blueprint assigns an Azure Policy definition to audit
the use of custom Azure RBAC rules. Understanding where custom Azure RBAC rules are implement can
help you verify need and proper implementation, as custom Azure RBAC rules are error prone.

- An Azure Active Directory administrator should be provisioned for SQL servers
- Audit VMs that do not use managed disks
- Service Fabric clusters should only use Azure Active Directory for client authentication

## 2.9A Account Management | Account Monitoring / Atypical Usage

Just-in-time (JIT) virtual machine access locks down inbound traffic to Azure virtual machines,
reducing exposure to attacks while providing easy access to connect to VMs when needed. All JIT
requests to access virtual machines are logged in the Activity Log allowing you to monitor for
atypical usage. This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition
that helps you monitor virtual machines that can support just-in-time access but have not yet been
configured.

- Management ports of virtual machines should be protected with just-in-time network access control

## 1.3, 5.1, and 6.4 Separation of Duties

Having only one Azure subscription owner doesn't allow for administrative redundancy. Conversely,
having too many Azure subscription owners can increase the potential for a breach via a compromised
owner account. This blueprint helps you maintain an appropriate number of Azure subscription owners
by assigning [Azure Policy](../../../policy/overview.md) definitions that audit the number of
owners for Azure subscriptions. This blueprint also assigns Azure Policy definitions that help
you control membership of the Administrators group on Windows virtual machines. Managing
subscription owner and virtual machine administrator permissions can help you implement appropriate
separation of duties.

- A maximum of 3 owners should be designated for your subscription
- Show audit results from Windows VMs in which the Administrators group does not contain all of the
  specified members
- Deploy prerequisites to audit Windows VMs in which the Administrators group does not contain all
  of the specified members
- There should be more than one owner assigned to your subscription

## 1.3, 5.1, and 6.4 Least Privilege | Review of User Privileges

[Azure role-based access control (Azure RBAC)](../../../../role-based-access-control/overview.md) helps you manage who has access to resources in Azure. Using the Azure portal, you can review who has access to Azure resources and their permissions. This blueprint assigns [Azure Policy](../../../policy/overview.md) definitions to audit accounts that should be prioritized for review. Reviewing these account indicators can help you ensure least privilege controls are implemented.

- A maximum of 3 owners should be designated for your subscription
- Show audit results from Windows VMs that are not joined to the specified domain
- Deploy prerequisites to audit Windows VMs that are not joined to the specified domain
- There should be more than one owner assigned to your subscription

## 2.2 and 2.7 Security Attributes

The data discovery and classification capability of advanced data security for Azure SQL Database
provides capabilities for discovering, classifying, labeling, and protecting the sensitive data in
your databases. It can be used to provide visibility into your database classification state, and to
track the access to sensitive data within the database and beyond its borders. Advanced data
security can help you ensure information as associated with the appropriate security attributes for
your organization. This blueprint assigns [Azure Policy](../../../policy/overview.md) definitions to
monitor and enforce use of advanced data security on SQL server.

- Advanced data security should be enabled on your SQL servers
- Deploy Advanced Data Security on SQL servers

## 2.2, 2.7, 4.1, and 6.1 Remote Access | Automated Monitoring / Control

This blueprint helps you monitor and control remote access by assigning
[Azure Policy](../../../policy/overview.md) definitions to monitors that remote debugging for Azure
App Service application is turned off and policy definitions that audit Linux virtual machines that
allow remote connections from accounts without passwords. This blueprint also assigns an Azure
Policy definition that helps you monitor unrestricted access to storage accounts. Monitoring these
indicators can help you ensure remote access methods comply with your security policy.

- Show audit results from Linux VMs that allow remote connections from accounts without passwords
- Deploy prerequisites to audit Linux VMs that allow remote connections from accounts without
  passwords
- Storage accounts should restrict network access
- Remote debugging should be turned off for API App
- Remote debugging should be turned off for Function App
- Remote debugging should be turned off for Web Application

## 1.3 and 6.4 Content of Audit Records | Centralized Management of Planned Audit Record Content

Log data collected by Azure Monitor is stored in a Log Analytics workspace enabling centralized
configuration and management. This blueprint helps you ensure events are logged by assigning
[Azure Policy](../../../policy/overview.md) definitions that audit and enforce deployment of the Log
Analytics agent on Azure virtual machines.

- \[Preview\]: Audit Log Analytics Agent Deployment - VM Image (OS) unlisted
- Deploy Log Analytics Agent for Linux VMs
- Deploy Log Analytics Agent for Windows VMs

## 2.2, 2.7, and 6.4 Response to Audit Processing Failures

This blueprint assigns [Azure Policy](../../../policy/overview.md) definitions that monitor audit
and event logging configurations. Monitoring these configurations can provide an indicator of an
audit system failure or misconfiguration and help you take corrective action.

- Advanced data security should be enabled on your SQL servers
- Audit diagnostic setting
- Auditing on SQL server should be enabled

## 1.3 and 6.4 Audit Review, Analysis, and Reporting | Central Review and Analysis

Log data collected by Azure Monitor is stored in a Log Analytics workspace enabling centralized
reporting and analysis. This blueprint helps you ensure events are logged by assigning
[Azure Policy](../../../policy/overview.md) definitions that audit and enforce deployment of the Log
Analytics agent on Azure virtual machines.

- \[Preview\]: Audit Log Analytics Agent Deployment - VM Image (OS) unlisted
- Deploy Log Analytics Agent for Linux VMs
- Deploy Log Analytics Agent for Windows VMs

## 1.3, 2.2, 2.7, 6.4, and 6.5A Audit Generation

This blueprint helps you ensure system events are logged by assigning
[Azure Policy](../../../policy/overview.md) definitions that audit log settings on Azure resources.
These policy definitions audit and enforce deployment of the Log Analytics agent on Azure virtual
machines and configuration of audit settings for other Azure resource types. These policy
definitions also audit configuration of diagnostic logs to provide insight into operations that are
performed within Azure resources. Additionally, auditing and Advanced Data Security are configured
on SQL servers.

- Audit Log Analytics Agent Deployment - VM Image (OS) unlisted
- Deploy Log Analytics Agent for Linux VM Scale Sets (VMSS)
- Deploy Log Analytics Agent for Linux VMs
- Deploy Log Analytics Agent for Windows VM Scale Sets (VMSS)
- Deploy Log Analytics Agent for Windows VMs
- Audit diagnostic setting
- Audit SQL server level Auditing settings
- Advanced data security should be enabled on your SQL servers
- Deploy Advanced Data Security on SQL servers
- Auditing on SQL server should be enabled
- Deploy Diagnostic Settings for Network Security Groups

## 1.1 Least Functionality | Prevent Program Execution

Adaptive application control in Azure Security Center is an intelligent, automated end-to-end
application filtering solution that can block or prevent specific software from running on your
virtual machines. Application control can run in an enforcement mode that prohibits non-approved
application from running. This blueprint assigns an Azure Policy definition that helps you monitor
virtual machines where an application allowlist is recommended but has not yet been configured.

- Adaptive application controls for defining safe applications should be enabled on your machines

## 1.1 Least Functionality | Authorized Software / Allow Listing

Adaptive application control in Azure Security Center is an intelligent, automated end-to-end
application filtering solution that can block or prevent specific software from running on your
virtual machines. Application control helps you create approved application lists for your virtual
machines. This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that
helps you monitor virtual machines where an application allowlist is recommended but has not yet
been configured.

- Adaptive application controls for defining safe applications should be enabled on your machines

## 1.1 User-Installed Software

Adaptive application control in Azure Security Center is an intelligent, automated end-to-end application filtering solution that can block or prevent specific software from running on your virtual machines. Application control can help you enforce and monitor compliance with software restriction policies. This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that helps you monitor virtual machines where an application allowlist is recommended but has not yet been configured.

- Adaptive application controls for defining safe applications should be enabled on your machines
- Virtual machines should be migrated to new Azure Resource Manager resources

## 4.2 Identification and Authentication (Organizational Users) | Network Access to Privileged Accounts

This blueprint helps you restrict and control privileged access by assigning
[Azure Policy](../../../policy/overview.md) definitions to audit accounts with owner and/or write
permissions that don't have multi-factor authentication enabled. Multi-factor authentication helps
keep accounts secure even if one piece of authentication information is compromised. By monitoring
accounts without multi-factor authentication enabled, you can identify accounts that may be more
likely to be compromised.

- MFA should be enabled on accounts with owner permissions on your subscription
- MFA should be enabled on accounts with write permissions on your subscription

## 4.2 Identification and Authentication (Organizational Users) | Network Access to Non-Privileged Accounts

This blueprint helps you restrict and control access by assigning an
[Azure Policy](../../../policy/overview.md) definition to audit accounts with read permissions that
don't have multi-factor authentication enabled. Multi-factor authentication helps keep accounts
secure even if one piece of authentication information is compromised. By monitoring accounts
without multi-factor authentication enabled, you can identify accounts that may be more likely to be
compromised.

- MFA should be enabled on accounts with read permissions on your subscription

## 2.3 and 4.1 Authenticator Management

This blueprint assigns [Azure Policy](../../../policy/overview.md) definitions that audit Linux
virtual machines that allow remote connections from accounts without passwords and/or have incorrect
permissions set on the passwd file. This blueprint also assigns policy definitions that audit the
configuration of the password encryption type for Windows virtual machines. Monitoring these
indicators helps you ensure that system authenticators comply with your organization's
identification and authentication policy.

- Show audit results from Linux VMs that do not have the passwd file permissions set to 0644
- Deploy requirements to audit Linux VMs that do not have the passwd file permissions set to 0644
- Show audit results from Linux VMs that have accounts without passwords
- Deploy requirements to audit Linux VMs that have accounts without passwords
- Show audit results from Windows VMs that do not store passwords using reversible encryption
- Deploy requirements to audit Windows VMs that do not store passwords using reversible encryption

## 2.3 and 4.1 Authenticator Management | Password-Based Authentication

This blueprint helps you enforce strong passwords by assigning
[Azure Policy](../../../policy/overview.md) definitions that audit Windows virtual machines that
don't enforce minimum strength and other password requirements. Awareness of virtual machines in
violation of the password strength policy helps you take corrective actions to ensure passwords for
all virtual machine user accounts comply with your organization's password policy.

- Show audit results from Windows VMs that allow re-use of the previous 24 passwords
- Show audit results from Windows VMs that do not have a maximum password age of 70 days
- Show audit results from Windows VMs that do not have a minimum password age of 1 day
- Show audit results from Windows VMs that do not have the password complexity setting enabled
- Show audit results from Windows VMs that do not restrict the minimum password length to 14
  characters
- Show audit results from Windows VMs that do not store passwords using reversible encryption
- Deploy prerequisites to audit Windows VMs that allow re-use of the previous 24 passwords
- Deploy prerequisites to audit Windows VMs that do not have a maximum password age of 70 days
- Deploy prerequisites to audit Windows VMs that do not have a minimum password age of 1 day
- Deploy prerequisites to audit Windows VMs that do not have the password complexity setting enabled
- Deploy prerequisites to audit Windows VMs that do not restrict the minimum password length to 14
  characters
- Deploy prerequisites to audit Windows VMs that do not store passwords using reversible encryption

## 2.2 and 2.7 Vulnerability Scanning

This blueprint helps you manage information system vulnerabilities by assigning
[Azure Policy](../../../policy/overview.md) definitions that monitor operating system
vulnerabilities, SQL vulnerabilities, and virtual machine vulnerabilities in Azure Security Center.
Azure Security Center provides reporting capabilities that enable you to have real-time insight into
the security state of deployed Azure resources. This blueprint also assigns policy definitions that
audit and enforce Advanced Data Security on SQL servers. Advanced data security included
vulnerability assessment and advanced threat protection capabilities to help you understand
vulnerabilities in your deployed resources.

- Advanced data security should be enabled on your SQL servers
- Auditing on SQL server should be enabled
- Vulnerabilities in security configuration on your virtual machine scale sets should be remediated
- Vulnerabilities on your SQL databases should be remediated
- Vulnerabilities in security configuration on your machines should be remediated

## 1.3 Denial of Service Protection

Azure's distributed denial of service (DDoS) Standard tier provides additional features and
mitigation capabilities over the basic service tier. These additional features include Azure Monitor
integration and the ability to review post-attack mitigation reports. This blueprint assigns an
[Azure Policy](../../../policy/overview.md) definition that audits if the DDoS Standard tier is
enabled. Understanding the capability difference between the service tiers can help you select the
best solution to address denial of service protections for your Azure environment.

- Azure DDoS Protection should be enabled

## 1.1 and 6.1 Boundary Protection

This blueprint helps you manage and control the system boundary by assigning an
[Azure Policy](../../../policy/overview.md) definition that monitors for network security group
hardening recommendations in Azure Security Center. Azure Security Center analyzes traffic patterns
of Internet facing virtual machines and provides network security group rule recommendations to
reduce the potential attack surface. Additionally, this blueprint also assigns policy definitions
that monitor unprotected endpoints, applications, and storage accounts. Endpoints and applications
that aren't protected by a firewall, and storage accounts with unrestricted access can allow
unintended access to information contained within the information system.

- Adaptive Network Hardening recommendations should be applied on internet facing virtual machines
- Access through Internet facing endpoint should be restricted
- Audit unrestricted network access to storage accounts

## 2.9A Boundary Protection | Access Points

Just-in-time (JIT) virtual machine access locks down inbound traffic to Azure virtual machines,
reducing exposure to attacks while providing easy access to connect to VMs when needed. JIT virtual
machine access helps you limit the number of external connections to your resources in Azure. This
blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that helps you monitor
virtual machines that can support just-in-time access but have not yet been configured.

- Management ports of virtual machines should be protected with just-in-time network access control

## 2.9A Boundary Protection | External Telecommunications Services

Just-in-time (JIT) virtual machine access locks down inbound traffic to Azure virtual machines,
reducing exposure to attacks while providing easy access to connect to VMs when needed. JIT virtual
machine access helps you manage exceptions to your traffic flow policy by facilitating the access
request and approval processes. This blueprint assigns an
[Azure Policy](../../../policy/overview.md) definition that helps you monitor virtual machines that
can support just-in-time access but have not yet been configured.

- Management ports of virtual machines should be protected with just-in-time network access control

## 2.1, 2.4, 2.4A, 2.5A, and 2.6 Transmission Confidentiality and Integrity | Cryptographic or Alternate Physical Protection

This blueprint helps you protect the confidential and integrity of transmitted information by
assigning [Azure Policy](../../../policy/overview.md) definitions that help you monitor
cryptographic mechanism implemented for communications protocols. Ensuring communications are
properly encrypted can help you meet your organization's requirements or protecting information
from unauthorized disclosure and modification.

- API App should only be accessible over HTTPS
- Show audit results from Windows web servers that are not using secure communication protocols
- Deploy prerequisites to audit Windows web servers that are not using secure communication
  protocols
- Function App should only be accessible over HTTPS
- Only secure connections to your Redis Cache should be enabled
- Secure transfer to storage accounts should be enabled
- Web Application should only be accessible over HTTPS

## 2.2, 2.3, 2.5, 4.1, and 2.7 Protection of Information at Rest | Cryptographic Protection

This blueprint helps you enforce your policy on the use of cryptograph controls to protect
information at rest by assigning [Azure Policy](../../../policy/overview.md) definitions that
enforce specific cryptograph controls and audit use of weak cryptographic settings. Understanding
where your Azure resources may have non-optimal cryptographic configurations can help you take
corrective actions to ensure resources are configured in accordance with your information security
policy. Specifically, the policy definitions assigned by this blueprint require encryption for data
lake storage accounts; require transparent data encryption on SQL databases; and audit missing
encryption on SQL databases, virtual machine disks, and automation account variables.

- Advanced data security should be enabled on your SQL servers
- Deploy Advanced Data Security on SQL servers
- Deploy SQL DB transparent data encryption
- Transparent Data Encryption on SQL databases should be enabled

## 1.3, 2.2, and 2.7 Flaw Remediation

This blueprint helps you manage information system flaws by assigning
[Azure Policy](../../../policy/overview.md) definitions that monitor missing system updates,
operating system vulnerabilities, SQL vulnerabilities, and virtual machine vulnerabilities in Azure
Security Center. Azure Security Center provides reporting capabilities that enable you to have
real-time insight into the security state of deployed Azure resources. This blueprint also assigns a
policy definition that ensures patching of the operating system for virtual machine scale sets.

- Require automatic OS image patching on Virtual Machine Scale Sets
- System updates on virtual machine scale sets should be installed
- System updates should be installed on your virtual machines
- Audit Dependency agent deployment in virtual machine scale sets - VM Image (OS) unlisted
- Automation account variables should be encrypted
- Vulnerabilities in security configuration on your virtual machine scale sets should be remediated
- Vulnerabilities in security configuration on your virtual machines should be remediated
- Vulnerabilities on your SQL databases should be remediated

## 6.1 Malicious Code Protection

This blueprint helps you manage endpoint protection, including malicious code protection, by
assigning [Azure Policy](../../../policy/overview.md) definitions that monitor for missing endpoint
protection on virtual machines in Azure Security Center and enforce the Microsoft antimalware
solution on Windows virtual machines.

- Deploy default Microsoft IaaSAntimalware extension for Windows Server
- Endpoint protection solution should be installed on virtual machine scale sets
- Monitor missing Endpoint Protection in Azure Security Center
- Storage accounts should be migrated to new Azure Resource Manager resources

## 6.1 Malicious Code Protection | Central Management

This blueprint helps you manage endpoint protection, including malicious code protection, by
assigning [Azure Policy](../../../policy/overview.md) definitions that monitor for missing endpoint
protection on virtual machines in Azure Security Center. Azure Security Center provides centralized
management and reporting capabilities that enable you to have real-time insight into the security
state of deployed Azure resources.

- Endpoint protection solution should be installed on virtual machine scale sets
- Monitor missing Endpoint Protection in Azure Security Center

## 1.1, 1.3, 2.2, 2.7, 2.8, and 6.4 Information System Monitoring

This blueprint helps you monitor your system by auditing and enforcing logging and data security
across Azure resources. Specifically, the policies assigned audit and enforce deployment of the Log
Analytics agent, and enhanced security settings for SQL databases, storage accounts and network
resources. These capabilities can help you detect anomalous behavior and indicators of attacks so
you can take appropriate action.

- Show audit results from Windows VMs on which the Log Analytics agent is not connected as expected
- Deploy Log Analytics Agent for Linux VM Scale Sets (VMSS)
- Deploy Log Analytics Agent for Linux VMs
- Deploy Log Analytics Agent for Windows VM Scale Sets (VMSS)
- Deploy Log Analytics Agent for Windows VMs
- Advanced data security should be enabled on your SQL servers
- Advanced data security settings for SQL server should contain an email address to receive security
  alerts
- Diagnostic logs in Azure Stream Analytics should be enabled
- Deploy Advanced Data Security on SQL servers
- Deploy Auditing on SQL servers
- Deploy network watcher when virtual networks are created
- Deploy Threat Detection on SQL servers

## 2.2 and 2.8 Information System Monitoring | Analyze Traffic / Covert Exfiltration

Advanced Threat Protection for Azure Storage detects unusual and potentially harmful attempts to
access or exploit storage accounts. Protection alerts include anomalous access patterns, anomalous
extracts/uploads, and suspicious storage activity. These indicators can help you detect covert
exfiltration of information.

- Deploy Threat Detection on SQL servers

> [!NOTE]
> Availability of specific Azure Policy definitions may vary in Azure Government and other national
> clouds.

## Next steps

Now that you've reviewed the control mapping of the SWIFT CSP-CSCF v2020 blueprint, visit the
following articles to learn about the blueprint and how to deploy this sample:

> [!div class="nextstepaction"]
> [SWIFT CSP-CSCF v2020 blueprint - Overview](./index.md)
> [SWIFT CSP-CSCF v2020 blueprint - Deploy steps](./deploy.md)

Additional articles about blueprints and how to use them:

- Learn about the [blueprint lifecycle](../../concepts/lifecycle.md).
- Understand how to use [static and dynamic parameters](../../concepts/parameters.md).
- Learn to customize the [blueprint sequencing order](../../concepts/sequencing-order.md).
- Find out how to make use of [blueprint resource locking](../../concepts/resource-locking.md).
- Learn how to [update existing assignments](../../how-to/update-existing-assignments.md).
