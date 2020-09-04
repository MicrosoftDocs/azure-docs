---
title: HIPAA HITRUST blueprint sample controls
description: Control mapping of the HIPAA HITRUST blueprint samples. Each control is mapped to one or more Azure Policies that assist with assessment.
ms.date: 08/03/2020
ms.topic: sample
---
# Control mapping of the HIPAA HITRUST blueprint sample

The following article details how the Azure Blueprints HIPAA HITRUST blueprint sample maps to the HIPAA HITRUST controls. For more
information about the controls, see
[HIPAA HITRUST](https://www.hhs.gov/hipaa/for-professionals/security/laws-regulations/index.html).

The following mappings are to the **HIPAA HITRUST** controls. Use the navigation on the right
to jump directly to a specific control mapping. Many of the mapped controls are implemented with an [Azure Policy](../../../policy/overview.md)
initiative. To review the complete initiative, open **Policy** in the Azure portal and select the
**Definitions** page. Then, find and select the **\[Preview\]: Audit HIPAA HITRUST controls**
built-in policy initiative.

> [!IMPORTANT]
> Each control below is associated with one or more [Azure Policy](../../../policy/overview.md)
> definitions. These policies may help you [assess compliance](../../../policy/how-to/get-compliance-data.md)
> with the control; however, there often is not a 1:1 or complete match between a control and one or
> more policies. As such, **Compliant** in Azure Policy refers only to the policies themselves; this
> doesn't ensure you're fully compliant with all requirements of a control. In addition, the
> compliance standard includes controls that aren't addressed by any Azure Policy definitions at
> this time. Therefore, compliance in Azure Policy is only a partial view of your overall compliance
> status. The associations between controls and Azure Policy definitions for this compliance
> blueprint sample may change over time. To view the change history, see the
> [GitHub Commit History](https://github.com/MicrosoftDocs/azure-docs/commits/master/articles/governance/blueprints/samples/HIPAA-HITRUST/control-mapping.md).

## Control Against Malicious Code

This blueprint helps you manage endpoint protection, including malicious code protection, by assigning [Azure Policy](../../../policy/overview.md) 
definitions that monitor for missing endpoint protection on virtual machines in Azure Security Center and enforce the Microsoft antimalware solution on Windows virtual machines.

- Microsoft Antimalware for Azure should be configured to automatically update protection signatures
- Monitor missing Endpoint Protection in Azure Security Center
- Endpoint protection solution should be installed on virtual machine scale sets
- Adaptive Application Controls should be enabled on virtual machines


## Management of Removable Media

The organization, based on the data classification level, registers media (including laptops) prior to use, places reasonable restrictions on how such media be used, and provides an appropriate level of physical and logical protection (including encryption) for media containing covered information until properly destroyed or sanitized.

- Transparent Data Encryption on SQL databases should be enabled
- Disk encryption should be applied on virtual machines
- Unattached disks should be encrypted
- Require encryption on Data Lake Store accounts
- SQL server TDE protector should be encrypted with your own key
- SQL managed instance TDE protector should be encrypted with your own key

## Control of Operational Software 

The organization identifies unauthorized software on the information system, including servers, workstations and laptops, employs an allow-all, deny-by-exception policy to prohibit the execution of known unauthorized software on the information system, and reviews and updates the list of unauthorized software periodically but no less than annually.

- Vulnerabilities in security configuration on your machines should be remediated
- Vulnerabilities in container security configurations should be remediated
- Vulnerabilities in security configuration on your virtual machine scale sets should be remediated
- Adaptive Application Controls should be enabled on virtual machines

## Change Control Procedures

The integrity of all virtual machine images is ensured at all times by logging and raising an alert for any changes made to virtual machine images, and making available to the business owner(s) and/or customer(s) through electronic methods (e.g., portals or alerts) the results of a change or move and the subsequent validation of the image's integrity.

- \[Preview\] Show audit results from windows VMs configuration in 'System Audit Policies -Detailed Tracking'
- \[Preview\]: Show audit results from Windows VMs configurations in 'System Audit Policies - Detailed Tracking'

## Control of Technical Vulnerabilities 

A hardened configuration standard exists for all system and network components.

- Vulnerability assessment should be enabled on your SQL servers
- Vulnerability assessment should be enabled on your SQL managed instances
- \[Preview\] Vulnerability Assessment should be enabled on Virtual Machines
- Vulnerabilities should be remediated by a Vulnerability Assessment solution
- Vulnerabilities in security configuration on your machines should be remediated
- Vulnerabilities in security configuration on your virtual machine scale sets should be remediated
- Vulnerabilities in container security configurations should be remediated
- Vulnerabilities on your SQL databases should be remediated
- \[Preview\]: Pod Security Policies should be defined on Kubernetes Services

## Segregation in Networks

The organization's security gateways (e.g. firewalls) enforce security policies and are configured to filter traffic between domains, block unauthorized access, and are used to maintain segregation between internal wired, internal wireless, and external network segments (e.g., the Internet) including DMZs and enforce access control policies for each of the domains.

- Subnets should be associated with a Network Security Group
- Virtual machines should be connected to an approved virtual network
- Virtual machines should be associated with a Network Security Group
- Service Bus should use a virtual network service endpoint
- App Service should use a virtual network service endpoint
- SQL Server should use a virtual network service endpoint
- Event Hub should use a virtual network service endpoint
- Cosmos DB should use a virtual network service endpoint
- Key Vault should use a virtual network service endpoint
- Gateway subnets should not be configured with a network security group
- Storage Accounts should use a virtual network service endpoint
- \[Preview\]: Container Registry should use a virtual network service endpoint
- Adaptive Network Hardening recommendations should be applied on internal facing virtual machines

## Network Connection Control

Network traffic is controlled in accordance with the organization's access control policy through firewall and other network-related restrictions for each network access point or external telecommunication service's managed interface.

- Secure transfer to storage accounts should be enabled
- Latest TLS version should be used in your API Ap
- Latest TLS version should be used in your Web App
- Latest TLS version should be used in your Function App
- Function App should only be accessible over HTTPS
- Web Application should only be accessible over HTTPS
- API App should only be accessible over HTTPS
- Enforce SSL connection should be enabled for MySQL database servers
- Enforce SSL connection should be enabled for PostgreSQL database servers
- Only secure connections to your Redis Cache should be enabled
- Subnets should be associated with a Network Security Group
- The NSGs rules for web applications on IaaS should be hardened
- Network Security Group Rules for Internet facing virtual machines should be hardened
- Virtual machines should be connected to an approved virtual network
- Virtual machines should be associated with a Network Security Group

## Network Controls

The organization uses secured and encrypted communication channels when migrating physical servers, applications or data to virtualized servers.

- Just-In-Time network access control should be applied on virtual machines
- Adaptive Network Hardening recommendations should be applied on internal facing virtual machines
- Service Bus should use a virtual network service endpoint
- App Service should use a virtual network service endpoint
- SQL Server should use a virtual network service endpoint
- Event Hub should use a virtual network service endpoint
- Cosmos DB should use a virtual network service endpoint
- Key Vault should use a virtual network service endpoint
- Audit unrestricted network access to storage accounts
- Storage Accounts should use a virtual network service endpoint
- \[Preview\]: Container Registry should use a virtual network service endpoint

## Security of Network Services

Agreed services provided by a network service provider/manager are formally managed and monitored to ensure they are provided securely.

- \[Preview\]: Network traffic data collection agent should be installed on Windows virtual machines
- \[Preview\]: Network traffic data collection agent should be installed on Linux virtual machines
Network Watcher should be enabled

## Information Exchange Policies and Procedures

The organization limits the use of organization-controlled portable storage media by authorized individuals on external information systems.

- Ensure WEB app has 'Client Certificates (Incoming client certificates)' set to 'On'
- CORS should not allow every resource to access your Web Applications
- CORS should not allow every resource to access your Function Apps
- CORS should not allow every resource to access your API App
- Remote debugging should be turned off for Web Applications
- Remote debugging should be turned off for Function Apps
- Remote debugging should be turned off for API Apps

## On-Line Transactions

The organization requires the use of encryption between, and the use of electronic signatures by, each of the parties involved in the transaction.The organization ensures the storage of the transaction details are located outside of any publicly accessible environments (e.g., on a storage platform existing on the organization's intranet) and not retained and exposed on a storage medium directly accessible from the Internet.Where a trusted authority is used (e.g., for the purposes of issuing and maintaining digital signatures and/or digital certificates), security is integrated and embedded throughout the entire end-to-end certificate/signature management process.

- Secure transfer to storage accounts should be enabled
- Latest TLS version should be used in your API Ap
- Latest TLS version should be used in your Web App
- Latest TLS version should be used in your Function App
- Function App should only be accessible over HTTPS
- Web Application should only be accessible over HTTPS
- API App should only be accessible over HTTPS
- Enforce SSL connection should be enabled for MySQL database servers
- Enforce SSL connection should be enabled for PostgreSQL database servers
- Only secure connections to your Redis Cache should be enabled
- \[Preview\]: Deploy prerequisites to audit Windows VMs that do not contain the specified certificates in Trusted Root
- \[Preview\]: Show audit results from Windows VMs that do not contain the specified certificates in Trusted Root

## User Password Management

Passwords are encrypted during transmission and storage on all system components.

- \[Preview\] Audit VMs with insecure password security settings

## User Authentication for External Connections

Strong authentication methods such as multi-factor, Radius or Kerberos (for privileged access) and CHAP (for encryption of credentials for dial-up methods) are implemented for all external connections to the organizations network.

- MFA should be enabled on accounts with owner permissions on your subscription
- MFA should be enabled on accounts with write permissions on your subscription
- MFA should be enabled on accounts with read permissions on your subscription
- Just-In-Time network access control should be applied on virtual machines

## User Identification and Authentication

Users who performed privileged functions (e.g., system administration) use separate accounts when performing those privileged functions.Multi-factor authentication methods are used in accordance with organizational policy, (e.g., for remote network access).

- MFA should be enabled on accounts with owner permissions on your subscription
- MFA should be enabled on accounts with write permissions on your subscription
- MFA should be enabled on accounts with read permissions on your subscription
- A maximum of 3 owners should be designated for your subscription
- There should be more than one owner assigned to your subscription
- Deploy prerequisites to audit Windows VMs in which the Administrators group contains any of the specified members
- Show audit results from Windows VMs in which the Administrators group contains any of the specified members
- Deploy prerequisites to audit Windows VMs in which the Administrators group does not contain all of the specified members
- Show audit results from Windows VMs in which the Administrators group does not contain all of the specified members
- Deploy prerequisites to audit Windows VMs in which the Administrators group does not contain only the specified members
- Show audit results from Windows VMs in which the Administrators group does not contain only the specified members

## Privilege Management

Access to management functions or administrative consoles for systems hosting virtualized systems are restricted to personnel based upon the principle of least privilege and supported through technical controls.

- Just-In-Time network access control should be applied on virtual machines
- Management ports should be closed on your virtual machines
- A maximum of 3 owners should be designated for your subscription
- There should be more than one owner assigned to your subscription
- External accounts with owner permissions should be removed from your subscription
- Deprecated accounts with owner permissions should be removed from your subscription
- Audit usage of custom RBAC rules
- Role-Based Access Control (RBAC) should be used on Kubernetes Services

## Review of User Access Rights

The organization maintains a documented list of authorized users of information assets.

- Audit usage of custom RBAC rules

## Remote Diagnostic and Configuration Port Protection

Ports, services, and similar applications installed on a computer or network systems, which are not specifically required for business functionality, are disabled or removed.

- Just-In-Time network access control should be applied on virtual machines
- Management ports should be closed on your virtual machines
- Remote debugging should be turned off for Web Applications
- Remote debugging should be turned off for Function Apps
- Remote debugging should be turned off for API Apps
- Adaptive Application Controls should be enabled on virtual machines

## Audit Logging

Logs of messages sent and received are maintained including the date, time, origin and destination of the message, but not its contents.Auditing is always available while the system is active and tracks key events, success/failed data access, system security configuration changes, privileged or utility use, any alarms raised, activation and de-activation of protection systems (e.g., A/V and IDS), activation and deactivation of identification and authentication mechanisms, and creation and deletion of system-level objects.

- Diagnostic logs in Azure Data Lake Store should be enabled
- Diagnostic logs in Logic Apps should be enabled 
- Diagnostic logs in IoT Hub should be enabled 
- Diagnostic logs in Batch accounts should be enabled 
- Diagnostic logs in Virtual Machine Scale Sets should be enabled 
- Diagnostic logs in Event Hub should be enabled 
- Diagnostic logs in Search services should be enabled 
- Diagnostic logs in App Services should be enabled 
- Diagnostic logs in Data Lake Analytics should be enabled 
- Diagnostic logs in Key Vault should be enabled 
- Diagnostic logs in Service Bus should be enabled
- Diagnostic logs in Azure Stream Analytics should be enabled
- Auditing on SQL server should be enabled
- Audit diagnostic setting
- Azure Monitor should collect activity logs from all regions

## Monitoring System Use

Automated systems deployed throughout the organization's environment are used to monitor key events and anomalous activity, and analyze system logs, the results of which are reviewed regularly.Monitoring includes privileged operations, authorized access or unauthorized access attempts, including attempts to access deactivated accounts, and system alerts or failures.

- Azure Monitor should collect activity logs from all regions
- The Log Analytics agent should be installed on virtual machines
- The Log Analytics agent should be installed on Virtual Machine Scale Sets
- \[Preview\]: Deploy prerequisites to audit Windows VMs on which the Log Analytics agent is not connected as expected
- \[Preview\]: Show audit results from Windows VMs on which the Log Analytics agent is not connected as expected
- Azure Monitor log profile should collect logs for categories 'write,' 'delete,' and 'action'
- Automatic provisioning of the Log Analytics monitoring agent should be enabled on your subscription

## Segregation of Duties

Separation of duties is used to limit the risk of unauthorized or unintentional modification of information and systems. No single person is able to access, modify, or use information systems without authorization or detection. Access for individuals responsible for administering and access controls is limited to the minimum necessary based upon each user's role and responsibilities and these individuals cannot access audit functions related to these controls.

- Role-Based Access Control (RBAC) should be used on Kubernetes Services
- Audit usage of custom RBAC rules
- \[Preview\]: Deploy prerequisites to audit Windows VMs configurations in 'User Rights Assignment'
- \[Preview\]: Show audit results from Windows VMs configurations in 'User Rights Assignment'
- \[Preview\]: Deploy prerequisites to audit Windows VMs configurations in 'Security Options - User Account Control'
- \[Preview\]: Show audit results from Windows VMs configurations in 'Security Options - User Account Control'
- Custom subscription owner roles should not exist

## Administrator and Operator Logs

The organization ensures proper logging is enabled in order to audit administrator activities; and reviews system administrator and operator logs on a regular basis.

- An activity log alert should exist for specific Administrative operations

## Identification of Risks Related to External Parties

Remote access connections between the organization and external parties are encrypted

- Secure transfer to storage accounts should be enabled
- Function App should only be accessible over HTTPS
- Web Application should only be accessible over HTTPS
- API App should only be accessible over HTTPS
- Enforce SSL connection should be enabled for MySQL database servers
- Enforce SSL connection should be enabled for PostgreSQL database servers
- Only secure connections to your Redis Cache should be enabled

## Business Continuity and Risk Assessment

The organization identifies its critical business processes and integrates the information security management requirements of business continuity with other continuity requirements relating to such aspects as operations, staffing, materials, transport and facilities.

- Audit virtual machines without disaster recovery configured
- Key Vault objects should be recoverable
- \[Preview\]: Deploy prerequisites to audit Windows VMs configurations in 'Security Options - Recovery console'
- \[Preview\] Show audit results from Windows VMs configuration in "Security Options- Recovery Console"

## Back Up

This blueprint assigns Azure Policy definitions that audit the organization's system backup information to the alternate storage site electronically. For physical shipment of storage metadata, consider using Azure Data Box.

- Long-term geo-redundant backup should be enabled for Azure SQL Databases
- Geo-redundant backup should be enabled for Azure Database for MySQL
- Geo-redundant backup should be enabled for Azure Database for PostgreSQL
- Geo-redundant backup should be enabled for Azure Database for MariaDB
- Azure Backup should be enabled for Virtual Machines

> [!NOTE]
> Availability of specific Azure Policy definitions may vary in Azure Government and other national 
> clouds. 

## Next steps

You've reviewed the control mapping of the HIPAA HITRUST blueprint sample. Next, visit the
following articles to learn about the overview and how to deploy this sample:

> [!div class="next step action"]
> [HIPAA HITRUST blueprint - Overview](./control-mapping.md)
> [HIPAA HITRUST blueprint - Deploy steps](./deploy.md)

Additional articles about blueprints and how to use them:

- Learn about the [blueprint lifecycle](../../concepts/lifecycle.md).
- Understand how to use [static and dynamic parameters](../../concepts/parameters.md).
- Learn to customize the [blueprint sequencing order](../../concepts/sequencing-order.md).
- Find out how to make use of [blueprint resource locking](../../concepts/resource-locking.md).
- Learn how to [update existing assignments](../../how-to/update-existing-assignments.md).
