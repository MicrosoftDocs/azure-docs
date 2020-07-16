---
title: Australian Government ISM PROTECTED blueprint sample overview
description: Overview of the Australian Government ISM PROTECTED blueprint sample. This blueprint sample helps customers assess specific ISM PROTECTED controls.
ms.date: 03/10/2020
ms.topic: sample
---
# Control mapping of the Australian Government ISM PROTECTED blueprint sample

The following article details how the Azure Blueprints Australian Government ISM PROTECTED blueprint sample maps to the
ISM PROTECTED controls. For more information about the controls, see
[ISM PROTECTED](https://www.cyber.gov.au/ism).

The following mappings are to the **ISM PROTECTED** controls. Use the navigation on the right to jump
directly to a specific control mapping. Many of the mapped controls are implemented with an
[Azure Policy](../../../policy/overview.md) initiative. To review the complete initiative, open
**Policy** in the Azure portal and select the **Definitions** page. Then, find and select the
**\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit
requirements** built-in policy initiative.

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
> [GitHub Commit History](https://github.com/MicrosoftDocs/azure-docs/commits/master/articles/governance/blueprints/samples/ism-protected/control-mapping.md).


## Location Constraints

This blueprint helps you restrict the location for the deployment of all resources and resource groups to "Australia Central", "Australia Central2", "Australia East" and "Australia Southeast" by assigning following Azure Policy definitions:

- Allowed locations (has been hard coded to "Australia Central", "Australia Central2", "Australia East" and "Australia Southeast")
- Allowed locations for resource groups (has been hard coded to "Australia Central", "Australia Central2", "Australia East" and "Australia Southeast")

## Guidelines for Personnel Security - Access to systems and their resources

### 0414 Personnel granted access to a system and its resources are uniquely identifiable

- MFA should be enabled on accounts with owner permissions on your subscription
- MFA should be enabled accounts with write permissions on your subscription
- MFA should be enabled on accounts with read permissions on your subscription

### 1503 Standard access to systems, applications and data repositories is limited to that required for personnel to undertake their duties

- A maximum of 3 owners should be designated for your subscription
- There should be more than one owner assigned to your subscription
- Show audit results from Windows VMs in which the Administrators group contains any of the specified members
- Deploy prerequisites to audit Windows VMs in which the Administrators group contains any of the specified members

### 1507 Privileged access to systems, applications and data repositories is validated when first requested and revalidated on an annual or more frequent basis

- Show audit results from Windows VMs in which the Administrators group contains any of the specified members
- Deploy prerequisites to audit Windows VMs in which the Administrators group contains any of the specified members

### 1508 Privileged access to systems, applications and data repositories is limited to that required for personnel to undertake their duties

- A maximum of 3 owners should be designated for your subscription
- There should be more than one owner assigned to your subscription
- Show audit results from Windows VMs in which the Administrators group contains any of the specified members
- Deploy prerequisites to audit Windows VMs in which the Administrators group contains any of the specified members
- Just-In-Time network access control should be applied on virtual machines

### 0415 The use of shared user accounts is strictly controlled, and personnel using such accounts are uniquely identifiable

- Show audit results from Windows VMs in which the Administrators group contains any of the specified members
- Deploy prerequisites to audit Windows VMs in which the Administrators group contains any of the specified members

### 0445 Privileged users are assigned a dedicated privileged account to be used solely for tasks requiring privileged access

- Show audit results from Windows VMs in which the Administrators group contains any of the specified members
- Deploy prerequisites to audit Windows VMs in which the Administrators group contains any of the specified members

### 0430 Access to systems, applications and data repositories is removed or suspended on the same day personnel no longer have a legitimate requirement for access

- Deprecated accounts should be removed from your subscription
- Deprecated accounts with owner permissions should be removed from your subscription

### 0441 When personnel are granted temporary access to a system, effective security controls are put in place to restrict their access to only information required for them to undertake their duties

- External accounts with owner permissions should be removed from your subscription
- External accounts with write permissions should be removed from your subscription
- Deprecated accounts should be removed from your subscription
- Deprecated accounts with owner permissions should be removed from your subscription

## Guidelines for System Hardening - Operating system hardening

### 1407 The latest version (N), or N-1 version, of an operating system is used for Standard Operating Environments (SOEs)

- System updates should be installed on your machines
- System updates on virtual machine scale sets should be installed

### 0380 Unneeded operating system accounts, software, components, services and functionality are removed or disabled

- Deprecated accounts should be removed from your subscription
- Deprecated accounts with owner permissions should be removed from your subscription

### 1490 An application whitelisting solution is implemented on all servers to restrict the execution of executables, software libraries, scripts and installers to an approved set

- Adaptive Application Controls should be enabled on virtual machines

### 1417 Antivirus software is implemented on workstations and servers and configured with: signature-based detection enabled and set to a high level, heuristic-based detection enabled and set to a high level, detection signatures checked for currency and updated on at least a daily basis, automatic and regular scanning configured for all fixed disks and removable media

- Microsoft IaaSAntimalware extension should be deployed on Windows servers
- Endpoint protection solution should be installed on virtual machine scale sets
- Monitor missing Endpoint Protection in Azure Security Center

## Guidelines for System Hardening - Authentication hardening

### 1546 Users are authenticated before they are granted access to a system and its resources

- Audit unrestricted network access to storage accounts
- Service Fabric clusters should only use Azure Active Directory for client authentication
- \[Preview\]: Show audit results from Linux VMs that allow remote connections from accounts without passwords
- \[Preview\]:  Deploy prerequisites to audit Linux VMs that allow remote connections from accounts without passwords
- \[Preview\]: Show audit results from Linux VMs that have accounts without passwords
- \[Preview\]: Deploy prerequisites to audit Linux VMs that have accounts without passwords

### 0974 Multi-factor authentication is used to authenticate standard users

- MFA should be enabled on accounts with read permissions on your subscription

### 1173 Multi-factor authentication is used to authenticate all privileged users and any other positions of trust

- MFA should be enabled on accounts with owner permissions on your subscription
- MFA should be enabled accounts with write permissions on your subscription

### 0421 Passphrases used for single-factor authentication are a minimum of 14 characters with complexity, ideally as 4 random words

- \[Preview\]: Show audit results from Windows VMs configurations in 'Security Settings - Account Policies'
- \[Preview\]: Deploy prerequisites to audit Windows VMs configurations in 'Security Settings - Account Policies'

## Guidelines for System Management - System administration

### 1384 Multi-factor authentication is used to authenticate users each time they perform privileged actions

- MFA should be enabled on accounts with owner permissions on your subscription
- MFA should be enabled accounts with write permissions on your subscription
- MFA should be enabled on accounts with read permissions on your subscription

### 1386 Management traffic is only allowed to originate from network zones that are used to administer systems and applications

- Just-In-Time network access control should be applied on virtual machines
- Remote debugging should be turned off for API Apps
- Remote debugging should be turned off for Function Apps
- Remote debugging should be turned off for Web Applications

## Guidelines for System Management - System patching

### 1144 Security vulnerabilities in applications and drivers assessed as extreme risk are patched, updated or mitigated within 48 hours of the security vulnerabilities being identified by vendors, independent third parties, system managers or users

- Vulnerabilities on your SQL databases should be remediated
- Vulnerability assessment should be enabled on your SQL servers
- Vulnerability assessment should be enabled on your SQL managed instances
- \[Preview\]: Vulnerability Assessment should be enabled on Virtual Machines
- Vulnerabilities in security configuration on your virtual machine scale sets should be remediated
- Vulnerabilities should be remediated by a Vulnerability Assessment solution
- Vulnerabilities in security configuration on your machines should be remediated
- Vulnerabilities in container security configurations should be remediated
- Vulnerability Assessment settings for SQL server should contain an email address to receive scan reports

### 0940 Security vulnerabilities in applications and drivers assessed as high risk are patched, updated or mitigated within two weeks of the security vulnerability being identified by vendors, independent third parties, system managers or users

- Vulnerabilities on your SQL databases should be remediated
- Vulnerability assessment should be enabled on your SQL servers
- Vulnerability assessment should be enabled on your SQL managed instances
- \[Preview\]: Vulnerability Assessment should be enabled on Virtual Machines
- Vulnerabilities in security configuration on your virtual machine scale sets should be remediated
- Vulnerabilities should be remediated by a Vulnerability Assessment solution
- Vulnerabilities in security configuration on your machines should be remediated
- Vulnerabilities in container security configurations should be remediated
- Vulnerability Assessment settings for SQL server should contain an email address to receive scan reports

### 1472 Security vulnerabilities in applications and drivers assessed as moderate or low risk are patched, updated or mitigated within one month of the security vulnerability being identified by vendors, independent third parties, system managers or users

- Vulnerabilities on your SQL databases should be remediated
- Vulnerability assessment should be enabled on your SQL servers
- Vulnerability assessment should be enabled on your SQL managed instances
- \[Preview\]: Vulnerability Assessment should be enabled on Virtual Machines
- Vulnerabilities in security configuration on your virtual machine scale sets should be remediated
- Vulnerabilities should be remediated by a Vulnerability Assessment solution
- Vulnerabilities in security configuration on your machines should be remediated
- Vulnerabilities in container security configurations should be remediated
- Vulnerability Assessment settings for SQL server should contain an email address to receive scan reports

### 1494 Security vulnerabilities in operating systems and firmware assessed as extreme risk are patched, updated or mitigated within 48 hours of the security vulnerabilities being identified by vendors, independent third parties, system managers or users

- Vulnerabilities on your SQL databases should be remediated
- Vulnerability assessment should be enabled on your SQL servers
- Vulnerability assessment should be enabled on your SQL managed instances
- \[Preview\]: Vulnerability Assessment should be enabled on Virtual Machines
- Vulnerabilities in security configuration on your virtual machine scale sets should be remediated
- Vulnerabilities should be remediated by a Vulnerability Assessment solution
- Vulnerabilities in security configuration on your machines should be remediated
- Vulnerabilities in container security configurations should be remediated
- Vulnerability Assessment settings for SQL server should contain an email address to receive scan reports

### 1495 Security vulnerabilities in operating systems and firmware assessed as high risk are patched, updated or mitigated within two weeks of the security vulnerability being identified by vendors, independent third parties, system managers or users

- Vulnerabilities on your SQL databases should be remediated
- Vulnerability assessment should be enabled on your SQL servers
- Vulnerability assessment should be enabled on your SQL managed instances
- \[Preview\]: Vulnerability Assessment should be enabled on Virtual Machines
- Vulnerabilities in security configuration on your virtual machine scale sets should be remediated
- Vulnerabilities should be remediated by a Vulnerability Assessment solution
- Vulnerabilities in security configuration on your machines should be remediated
- Vulnerabilities in container security configurations should be remediated
- Vulnerability Assessment settings for SQL server should contain an email address to receive scan reports

### 1496 Security vulnerabilities in operating systems and firmware assessed as moderate or low risk are patched, updated or mitigated within one month of the security vulnerability being identified by vendors, independent third parties, system managers or users

- Vulnerabilities on your SQL databases should be remediated
- Vulnerability assessment should be enabled on your SQL servers
- Vulnerability assessment should be enabled on your SQL managed instances
- \[Preview\]: Vulnerability Assessment should be enabled on Virtual Machines
- Vulnerabilities in security configuration on your virtual machine scale sets should be remediated
- Vulnerabilities should be remediated by a Vulnerability Assessment solution
- Vulnerabilities in security configuration on your machines should be remediated
- Vulnerabilities in container security configurations should be remediated
- Vulnerability Assessment settings for SQL server should contain an email address to receive scan reports

## Guidelines for System Management - Data backup and restoration

### 1511 Backups of important information, software and configuration settings are performed at least daily

- Audit virtual machines without disaster recovery configured

## Guidelines for System Monitoring - Event logging and auditing

### 1405 A centralised logging facility is implemented and systems are configured to save event logs to the centralised logging facility as soon as possible after each event occurs

- Azure subscriptions should have a log profile for Activity Log

### 0582 The following events are logged for operating systems: access to important data and processes, application crashes and any error messages, attempts to use special privileges, changes to accounts, changes to security policy, changes to system configurations, Domain Name System (DNS) and Hypertext Transfer Protocol (HTTP) requests, failed attempts to access data and system resources, service failures and restarts, system startup and shutdown, transfer of data to external media, user or group management, use of special privileges

- \[Preview\]: Audit Log Analytics Agent Deployment - VM Image (OS) unlisted
- \[Preview\]: Audit Log Analytics Agent Deployment in VMSS - VM Image (OS) unlisted
- \[Preview\]: Audit Log Analytics Workspace for VM - Report Mismatch
- Audit diagnostic setting

### 1537 The following events are logged for databases: access to particularly important information, addition of new users, especially privileged users, any query containing comments, any query containing multiple embedded queries, any query or database alerts or failures, attempts to elevate privileges, attempted access that is successful or unsuccessful, changes to the database structure, changes to user roles or database permissions, database administrator actions, database logons and logoffs, modifications to data, use of executable commands

- Advanced data security should be enabled on your SQL servers
- Audit diagnostic setting
- Advanced data security should be enabled on your SQL managed instances

## Guidelines for System Monitoring - Vulnerability management

### 0911 Vulnerability assessments and penetration tests are conducted by suitably skilled personnel before a system is deployed, after a significant change to a system, and at least annually or as specified by the system owner

- Vulnerabilities on your SQL databases should be remediated
- Vulnerability assessment should be enabled on your SQL servers
- Vulnerability assessment should be enabled on your SQL managed instances
- \[Preview\]: Vulnerability Assessment should be enabled on Virtual Machines
- Vulnerabilities in security configuration on your virtual machine scale sets should be remediated
- Vulnerabilities should be remediated by a Vulnerability Assessment solution
- Vulnerabilities in security configuration on your machines should be remediated
- Vulnerabilities in container security configurations should be remediated

## Guidelines for Database Systems Management - Database servers

### 1425 Hard disks of database servers are encrypted using full disk encryption

- Disk encryption should be applied on virtual machines
- Transparent Data Encryption on SQL databases should be enabled

### 1277 Information communicated between database servers and web applications is encrypted

- Only secure connections to your Redis Cache should be enabled
- Secure transfer to storage accounts should be enabled
- Show audit results from Windows web servers that are not using secure communication protocols
- Deploy prerequisites to audit Windows web servers that are not using secure communication protocols

## Guidelines for Database Systems Management - Database management system software

### 1260 Default database administrator accounts are disabled, renamed or have their passphrases changed

- An Azure Active Directory administrator should be provisioned for SQL servers

### 1262 Database administrators have unique and identifiable accounts

- An Azure Active Directory administrator should be provisioned for SQL servers

### 1261 Database administrator accounts are not shared across different databases

- An Azure Active Directory administrator should be provisioned for SQL servers

### 1263 Database administrator accounts are used exclusively for administrative tasks, with standard database accounts used for general purpose interactions with database

- An Azure Active Directory administrator should be provisioned for SQL servers

### 1264 Database administrator access is restricted to defined roles rather than accounts with default administrative permissions, or all permissions

- An Azure Active Directory administrator should be provisioned for SQL servers

## Guidelines for Using Cryptography - Cryptographic fundamentals

### 0459 Encryption software used for data at rest implements full disk encryption, or partial encryption where access controls will only allow writing to the encrypted partition

- Disk encryption should be applied on virtual machines

## Guidelines for Using Cryptography - Transport Layer Security

### 1139 Only the latest version of TLS is used

- Latest TLS version should be used in your API App
- Latest TLS version should be used in your Web App
- Latest TLS version should be used in your Function App
- Deploy prerequisites to audit Windows web servers that are not using secure communication protocols
- Show audit results from Windows web servers that are not using secure communication protocols

## Guidelines for Data Transfers and Content Filtering - Content filtering

### 1288 Antivirus scanning, using multiple different scanning engines, is performed on all content

- Microsoft IaaSAntimalware extension should be deployed on Windows servers
- Endpoint protection solution should be installed on virtual machine scale sets
- Monitor missing Endpoint Protection in Azure Security Center

## Guidelines for Data Transfers and Content Filtering - Web application development

### 1552 All web application content is offered exclusively using HTTPS

- Function App should only be accessible over HTTPS
- API App should only be accessible over HTTPS
- Web Application should only be accessible over HTTPS
- Only secure connections to your Redis Cache should be enabled

### 1424 Web browser-based security controls are implemented for web applications in order to help protect both web applications and their users

- CORS should not allow every resource to access your Web Applications

## Guidelines for Network Management - Network design and configuration

### 0520 Network access controls are implemented on networks to prevent the connection of unauthorised network devices

- Audit unrestricted network access to storage accounts

### 1182 Network access controls are implemented to limit traffic within and between network segments to only those that are required for business purposes

- Internet-facing virtual machines should be protected with Network Security Groups
- Audit unrestricted network access to storage accounts
- Adaptive Network Hardening recommendations should be applied on internet facing virtual machines

## Guidelines for Network Management - Service continuity for online services

### 1431 Denial-of-service attack prevention and mitigation strategies are discussed with service providers, specifically: their capacity to withstand denial-of-service attacks, any costs likely to be incurred by customers resulting from denial-of-service attacks, thresholds for notifying customers or turning off their online services during denial-of-service attacks, pre-approved actions that can be undertaken during denial-of-service attacks, denial-of-service attack prevention arrangements with upstream providers to block malicious traffic as far upstream as possible

- DDoS Protection Standard should be enabled


> [!NOTE]
> Availability of specific Azure Policy definitions may vary in Azure Government and other national 
> clouds. 

## Next steps

Additional articles about blueprints and how to use them:

- Learn about the [blueprint lifecycle](../../concepts/lifecycle.md).
- Understand how to use [static and dynamic parameters](../../concepts/parameters.md).
- Learn to customize the [blueprint sequencing order](../../concepts/sequencing-order.md).
- Find out how to make use of [blueprint resource locking](../../concepts/resource-locking.md).
- Learn how to [update existing assignments](../../how-to/update-existing-assignments.md).