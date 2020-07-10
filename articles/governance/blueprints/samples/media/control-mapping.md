---
title: Media blueprint sample controls
description: Control mapping of the Media blueprint samples. Each control is mapped to one or more Azure Policies that assist with assessment.
ms.date: 02/24/2020
ms.topic: sample
---
# Control mapping of the Media blueprint sample

The following article details how the Azure Blueprints Media blueprint sample maps to the Media controls. For more
information about the controls, see
[Media](https://www.hhs.gov/hipaa/for-professionals/security/laws-regulations/index.html).

The following mappings are to the **Media** controls. Use the navigation on the right
to jump directly to a specific control mapping. Many of the mapped controls are implemented with an [Azure Policy](../../../policy/overview.md)
initiative. To review the complete initiative, open **Policy** in the Azure portal and select the
**Definitions** page. Then, find and select the **\[Preview\]: Audit Media controls**
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
> [GitHub Commit History](https://github.com/MicrosoftDocs/azure-docs/commits/master/articles/governance/blueprints/samples/media/control-mapping.md).

## Access Control

### AC-1.1- Ensure no root access key exists

- \[Preview\]: Deploy prerequisites to audit Windows VMs that do not contain the specified certificates in Trusted Root

### AC-1.2 - Passwords, PINs, and Tokens must be protected

- \[Preview\]: Deploy prerequisites to audit Windows VMs that do not restrict the minimum password length to 14 characters

### AC-1.8 - Shared account access is prohibited

- All authorization rules except RootManageSharedAccessKey should be removed from Service Bus namespace

### AC-1.9 -System must restrict access to authorized users.

- Audit unrestricted network access to storage accounts

### AC- 1.14 -System must enforce access rights.

- \[Preview\]: Deploy prerequisites to audit Windows VMs configurations in 'User Rights Assignment'

### AC- 1.15 -Prevent unauthorized access to security relevant information or functions.

- \[Preview\]: Show audit results from Windows VMs configurations in 'Security Options - System settings'

### AC-1-21 - Separation of duties must be enforced through appropriate assignment of role.

- [Preview\]: Role-Based Access Control (RBAC) should be used on Kubernetes Services

### AC-1.40- Ensure that systems are not connecting trusted network and untrusted networks at the same time.

- \[Preview\]: Deploy prerequisites to audit Windows VMs configurations in 'Security Options - Network Access'

### AC-1.42 & AC- 1.43 - Remote access for non-employees must be restricted to allow access only to specifically approved information systems

- \[Preview\]: Show audit results from Linux VMs that allow remote connections from accounts without passwords

### AC-1.50- Log security related events for all information system components.

- Diagnostic logs in Logic Apps should be enabled

### AC-1.54- Ensure multi-factor authentication (MFA) is enabled for all cloud console users.

- MFA should be enabled accounts with write permissions on your subscription
- Multi-Factor Authentication (MFA) should be enabled for all subscription accounts with write privileges to prevent a breach of accounts or resources.

## Auditing & Logging

### AL-2.1- Successful and unsuccessful events must be logged.

- Diagnostic logs in Search services should be enabled

### AL -2.16 - Network devices/instances must log any event classified as a critical security event by that network device/instance (ELBs, web application firewalls, etc.)

- \[Preview\]: Show audit results from Windows VMs configurations in 'Security Options - Accounts'

### AL-2.17- Servers/instances must log any event classified as a critical security event by that server/instance

- \[Preview\]: Show audit results from Windows VMs configurations in 'Security Options - Accounts'

### AL-2.19 - Domain events must log any event classified as a critical or high security event by the domain management software

- \[Preview\]: Show audit results from Windows VMs configurations in 'Security Options - Accounts'
- \[Preview\]: Deploy prerequisites to audit Windows VMs configurations in 'Security Options - Microsoft Network Client'

### AL-2.20- Domain events must log any event classified as a critical security event by domain security controls

- \[Preview\]: Show audit results from Windows VMs configurations in 'Security Options - Accounts'

### AL-2.21- Domain events must log any access or changes to the domain log

- \[Preview\]: Show audit results from Windows VMs configurations in 'Security Options - Recovery console'

## Cryptographic Controls

### CC-4.2- Applications and systems must use current cryptographic solutions for protecting data.

- Transparent Data Encryption on SQL databases should be enabled
- Transparent data encryption should be enabled to protect data-at-rest and meet compliance requirements

### CC-4.5- Digital Certificates must be signed by an approved Certificate Authority.

- \[Preview\]: Show audit results from Windows VMs that contain certificates expiring within the specified number of days

### CC-4.6- Digital Certificates must be uniquely assigned to a user or device.

- \[Preview\]: Deploy prerequisites to audit Windows VMs that contain certificates expiring within the specified number of days

### CC-4.7- Cryptographic material must be stored to enable decryption of the records for the length of time the records are retained.

- Disk encryption should be applied on virtual machines
- VMs without an enabled disk encryption will be monitored by Azure Security Center as recommendations

### CC-4.8- Secret and private keys must be stored securely.

- Transparent Data Encryption on SQL databases should be enabled
- Transparent data encryption should be enabled to protect data-at-rest and meet compliance requirements

## Change & Config Management

### CM-5.2- Only authorized users may implement approved changes on the system.

- System updates should be installed on your machines
- Missing security system updates on your servers will be monitored by Azure Security Center as recommendations

### CM-5.12- Maintain an up-to-date, complete, accurate, and readily available baseline configuration of the information system.

- System updates should be installed on your machines
- Missing security system updates on your servers will be monitored by Azure Security Center as recommendations

### CM-5.13- Employ automated tools to maintain a baseline configuration of the information system.

- System updates should be installed on your machines
- Missing security system updates on your servers will be monitored by Azure Security Center as recommendations

### CM-5.14- Identify and disable unnecessary and/or non-secure functions, ports, protocols and services.

- Network interfaces should disable IP forwarding
- \[Preview\]: IP Forwarding on your virtual machine should be disabled

### CM-5.19- Monitor changes to the security configuration settings.

- Deploy Diagnostic Settings for Network Security Groups

### CM-5.22- Ensure that only authorized software and updates are installed on Company systems.

- System updates should be installed on your machines
- Missing security system updates on your servers will be monitored by Azure Security Center as recommendations

## Identity & Authentication

### IA-7.1- User accounts must be uniquely assigned to individuals for access to information that is not classified as Public. Account IDs must be constructed using a standardized logical format.

- External accounts with owner permissions should be removed from your subscription
- External accounts with owner permissions should be removed from your subscription in order to prevent unmonitored access.

## Network Security

### NS-9.2- Access to network device management functionality is restricted to authorized users.

- \[Preview\]: Deploy prerequisites to audit Windows VMs configurations in 'Security Options - Network Access'

### NS-9.3- All network devices must be configured using their most secure configurations.

- \[Preview\]: Deploy prerequisites to audit Windows VMs configurations in 'Security Options - Network Access'

### NS-9.5- All network connections to a system through a firewall must be approved and audited on a regular basis.

- \[Preview\]: Show audit results from Windows VMs configurations in 'Windows Firewall Properties'

### NS-9.7- Appropriate controls must be present at any boundary between a trusted network and any untrusted or public network.

- \[Preview\]: Deploy prerequisites to audit Windows VMs configurations in 'Windows Firewall Properties'

## Security Planning

### SP-11.3- Threats must be identified that could negatively impact the confidentiality, integrity, or availability of Company information and content along with the likelihood of their occurrence.

- Advanced Threat Protection types should be set to 'All' in SQL managed instance Advanced Data Security settings

### Security Continuity

## SC-12.5- Data in long-term storage must be accessible throughout the retention period and protected against media degradation and technology changes.

- SQL servers should be configured with auditing retention days greater than 90 days.
- Audit SQL servers configured with an auditing retention period of less than 90 days.

## System Integrity

### SI-14.3- Only authorized personnel may monitor network and user activities.

- Vulnerabilities on your SQL databases should be remediated
- Monitor Vulnerability Assessment scan results and recommendations for how to remediate database vulnerabilities.

### SI-14.4- Internet facing systems must have intrusion detection.

- Deploy Threat Detection on SQL servers

### SI-14.13- Standardized centrally managed anti-malware software should be implemented across the company.

- Deploy default Microsoft IaaSAntimalware extension for Windows Server

### SI-14.14- Anti-malware software must scan computers and media weekly at a minimum.

- Deploy default Microsoft IaaSAntimalware extension for Windows Server

## Vulnerability Management

### VM-15.4- Ensure that applications are scanned for vulnerabilities on a monthly basis.

- Vulnerabilities in security configuration on your virtual machine scale sets should be remediated
- Audit the OS vulnerabilities on your virtual machine scale sets to protect them from attacks.

### VM-15.5- Ensure that vulnerabilities are identified, paired to threats, and evaluated for risk.

- Vulnerabilities in security configuration on your virtual machine scale sets should be remediated
- Audit the OS vulnerabilities on your virtual machine scale sets to protect them from attacks.

### VM-15.6- Ensure that identified vulnerabilities have been remediated within a mutually agreed upon timeline.

- Vulnerabilities in security configuration on your virtual machine scale sets should be remediated
- Audit the OS vulnerabilities on your virtual machine scale sets to protect them from attacks.

### VM-15.7- Access to and use of vulnerability management systems must be restricted to authorized personnel.

- Vulnerabilities in security configuration on your virtual machine scale sets should be remediated
- Audit the OS vulnerabilities on your virtual machine scale sets to protect them from attacks.

> [!NOTE]
> Availability of specific Azure Policy definitions may vary in Azure Government and other national 
> clouds. 

## Next steps

You've reviewed the control mapping of the Media blueprint sample. Next, visit the
following articles to learn about the overview and how to deploy this sample:

> [!div class="next step action"]
> [Media blueprint - Overview](./control-mapping.md)
> [Media blueprint - Deploy steps](./deploy.md)

Additional articles about blueprints and how to use them:

- Learn about the [blueprint lifecycle](../../concepts/lifecycle.md).
- Understand how to use [static and dynamic parameters](../../concepts/parameters.md).
- Learn to customize the [blueprint sequencing order](../../concepts/sequencing-order.md).
- Find out how to make use of [blueprint resource locking](../../concepts/resource-locking.md).
- Learn how to [update existing assignments](../../how-to/update-existing-assignments.md).
