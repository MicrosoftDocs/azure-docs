---
title: HIPAA HITRUST blueprint sample controls
description: Control mapping of the HIPAA HITRUST blueprint samples. Each control is mapped to one or more Azure Policies that assist with assessment.
ms.date: 11/26/2019
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

- Deploy default Microsoft IaaS Antimalware extension for windows server
- Diagnostic logs in Batch accounts should be enabled
- System updates should be installed on your machines


## Management of Removable Media

The organization, based on the data classification level, registers media (including laptops) prior to use, places reasonable restrictions on how such media be used, and provides an appropriate level of physical and logical protection (including encryption) for media containing covered information until properly destroyed or sanitized.

- Require encryption on Data Lake Store accounts
- SQL managed instance TDE protector should be encrypted with your own key
- Disk encryption should be applied on virtual machines
- Transparent Data Encryption on SQL databases should be enabled


## Information Exchange Policies and Procedures

Cloud service providers use an industry-recognized virtualization platform and standard virtualization formats (e.g., Open Virtualization Format, OVF) to help ensure interoperability, and has documented custom changes made to any hypervisor in use and all solution-specific virtualization hooks available for customer review.

- Deploy prerequisites to audit Windows VMs that do not have the specified applications installed

## Control of Operational Software 

The organization identifies unauthorized software on the information system, including servers, workstations and laptops, employs an allow-all, deny-by-exception policy to prohibit the execution of known unauthorized software on the information system, and reviews and updates the list of unauthorized software periodically but no less than annually.

- \[Preview\] Show audit results from Windows VMs configurations in "Security Options-Audit"
- \[Preview\] Show audit results from Windows VMs configurations in "System Audit Policies- Account Management"

## Change Control Procedures

The integrity of all virtual machine images is ensured at all times by logging and raising an alert for any changes made to virtual machine images, and making available to the business owner(s) and/or customer(s) through electronic methods (e.g., portals or alerts) the results of a change or move and the subsequent validation of the image's integrity.

- \[Preview\] Show audit results from windows VMs configuration in 'System Audit Policies -Detailed Tracking'

## Inventory of Assets 

An inventory of assets and services is maintained

- Diagnostic logs in search services should be enabled.
- \[Preview\] Deploy requirements to audit Windows VMs configurations in "Security Options- Microsoft Network Server"
- \[Preview\] Deploy requirements to audit Windows VMs configurations in "Administrative Templates- Network"

## Control of Technical Vulnerabilities 

A hardened configuration standard exists for all system and network components.

- Audit Virtual Machines without disaster recovery configured
- Vulnerability assessment should be enabled on your SQL managed instances
- Vulnerability should be remediated by a Vulnerability Assessment solution

## Segregation in Networks

The organization's security gateways (e.g. firewalls) enforce security policies and are configured to filter traffic between domains, block unauthorized access, and are used to maintain segregation between internal wired, internal wireless, and external network segments (e.g., the Internet) including DMZs and enforce access control policies for each of the domains.

- Automatic Provisioning of Security Monitoring agent
- Deploy network watcher when virtual networks are created

## Input Data Validation

For any public-facing Web applications, application-level firewalls are implemented to control traffic. For public-facing applications that are not Web-based, the organization has implemented a network-based firewall specific to the application type. If the traffic to the public-facing application is encrypted, the device either sits behind the encryption or is capable of decrypting the traffic prior to analysis.

- \[Preview\] Show audit results from Windows VMs configuration in "Windows Firewall Properties"


## Network Connection Control

Network traffic is controlled in accordance with the organization's access control policy through firewall and other network-related restrictions for each network access point or external telecommunication service's managed interface.

- Access through Internet facing endpoints should be restricted
- SQL managed instance TDE protector should be encrypted with your own key
- Remote debugging should be turned off for API apps

## Network Controls

The organization uses secured and encrypted communication channels when migrating physical servers, applications or data to virtualized servers.

- Disk encryption should be applied on VMs
- SQL server TDE protector should be encrypted with your own key
- \[Preview\] Show audits results from Windows VMs configurations in "Security Options- Network Access"
- Audit unrestricted network access to storage accounts
- \[Preview\] Show audits results from Windows VMs Configuration in "Windows Firewall Properties"
- Deploy Diagnostics settings from Network Security Groups
- Access through Internet facing endpoints should be restricted

## Sensitive System Isolation

Shared system resources (e.g., registers, main memory, secondary storage) are released back to the system, protected from disclosure to other systems/applications/users, and users cannot intentionally or unintentionally access information remnants.

- Virtual Machines should be migrated to new Azure Resource Manager resources

## Security of Network Services

Agreed services provided by a network service provider/manager are formally managed and monitored to ensure they are provided securely.

- Virtual Machines should be migrated to new Azure Resource Manager resources

## Network Routing Control

Routing controls are implemented through security gateways (e.g., firewalls) used between internal and external networks (e.g., the Internet and 3rd party networks).

- Adaptive Application Controls should be enabled on virtual Machines

## Information Exchange Policies and Procedures

The organization limits the use of organization-controlled portable storage media by authorized individuals on external information systems.

- Audit unrestricted network access to storage accounts
- Remote debugging should be turned off for Web applications
- APi App should only be accessible over HTTPS

## Electronic Messaging

Approvals are obtained prior to using external public services, including instant messaging or file sharing.

- \[Preview\] Show audit results from Linux VMs that do not have the password file permissions set to 0644

## On-Line Transactions

The organization requires the use of encryption between, and the use of electronic signatures by, each of the parties involved in the transaction.The organization ensures the storage of the transaction details are located outside of any publicly accessible environments (e.g., on a storage platform existing on the organization's intranet) and not retained and exposed on a storage medium directly accessible from the Internet.Where a trusted authority is used (e.g., for the purposes of issuing and maintaining digital signatures and/or digital certificates), security is integrated and embedded throughout the entire end-to-end certificate/signature management process.

- Disk encryption should be applied on VMs
- \[Preview\] Show audit results from Windows VMs that do not contain the specified certificates in trusted root

## Password Management

Passwords are encrypted during transmission and storage on all system components.

- \[Preview\] Show audit results from windows VMs that do not have the password complexity setting enabled

## User Authentication for External Connections

Strong authentication methods such as multi-factor, Radius or Kerberos (for privileged access) and CHAP (for encryption of credentials for dial-up methods) are implemented for all external connections to the organizations network.

- MFA should be enabled accounts with write permissions on your subscription
- Just In Time network access control should be applied on VMs

## User Identification and Authentication

Users who performed privileged functions (e.g., system administration) use separate accounts when performing those privileged functions.Multi-factor authentication methods are used in accordance with organizational policy, (e.g., for remote network access).

- MFA should be enabled accounts with write permissions on your subscription
- Just In Time network access control should be applied on VMs

## Privilege Management

Access to management functions or administrative consoles for systems hosting virtualized systems are restricted to personnel based upon the principle of least privilege and supported through technical controls.

- Just In Time network access control should be applied on VMs
- \[Preview\] Role Based Access Control (RBAC) should be used on Kubernetes services

## Review of User Access Rights

The organization maintains a documented list of authorized users of information assets.

- \[Preview\] Show audits results from Windows VMs configurations in "Security Options- Accounts"

## Remote Diagnostic and Configuration Port Protection

Ports, services, and similar applications installed on a computer or network systems, which are not specifically required for business functionality, are disabled or removed.

- Management ports should be closed on your virtual machines
- Vulnerabilities in security configuration on your virtual machines scale sets should be remediated

## Audit Logging

Logs of messages sent and received are maintained including the date, time, origin and destination of the message, but not its contents.Auditing is always available while the system is active and tracks key events, success/failed data access, system security configuration changes, privileged or utility use, any alarms raised, activation and de-activation of protection systems (e.g., A/V and IDS), activation and deactivation of identification and authentication mechanisms, and creation and deletion of system-level objects.

- Diagnostic logs in Event Hub should be enabled
- System updates on virtual machine scale sets should be installed

## Monitoring System Use

Automated systems deployed throughout the organization's environment are used to monitor key events and anomalous activity, and analyze system logs, the results of which are reviewed regularly.Monitoring includes privileged operations, authorized access or unauthorized access attempts, including attempts to access deactivated accounts, and system alerts or failures.

- Diagnostic logs in Virtual Machine scale sets should be enabled

## Segregation of Duties

Separation of duties is used to limit the risk of unauthorized or unintentional modification of information and systems. No single person is able to access, modify, or use information systems without authorization or detection. Access for individuals responsible for administering and access controls is limited to the minimum necessary based upon each user's role and responsibilities and these individuals cannot access audit functions related to these controls.

- MFA should be enabled accounts with write permissions on your subscription

## Administrator and Operator Logs

The organization ensures proper logging is enabled in order to audit administrator activities; and reviews system administrator and operator logs on a regular basis.

- MFA should be enabled accounts with write permissions on your subscription

## Identification of Risks Related to External Parties

Remote access connections between the organization and external parties are encrypted

- Disk encryption should be applied on Virtual machines

## Business Continuity and Risk Assessment

The organization identifies its critical business processes and integrates the information security management requirements of business continuity with other continuity requirements relating to such aspects as operations, staffing, materials, transport and facilities.

- \[Preview\] Show audit results from Windows VMs configuration in "Security Options- Recovery Console"

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
