---
title: ISO 27001 ASE/SQL workload blueprint sample controls
description: Control mapping of the ISO 27001 App Service Environment/SQL Database workload blueprint sample to Azure Policy and RBAC.
ms.date: 01/13/2020
ms.topic: sample
---
# Control mapping of the ISO 27001 ASE/SQL workload blueprint sample

The following article details how the Azure Blueprints ISO 27001 ASE/SQL Workload blueprint sample
maps to the ISO 27001 controls. For more information about the controls, see [ISO 27001](https://www.iso.org/isoiec-27001-information-security.html).

The following mappings are to the **ISO 27001:2013** controls. Use the navigation on the right to
jump directly to a specific control mapping. Many of the mapped controls are implemented with an [Azure Policy](../../../policy/overview.md)
initiative. To review the complete initiative, open **Policy** in the Azure portal and select the
**Definitions** page. Then, find and select the **\[Preview\] Audit ISO 27001:2013 controls and deploy
specific VM Extensions to support audit requirements** built-in policy initiative.

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
> [GitHub Commit History](https://github.com/MicrosoftDocs/azure-docs/commits/master/articles/governance/blueprints/samples/iso27001-ase-sql-workload/control-mapping.md).

## A.6.1.2 Segregation of duties

Having only one Azure subscription owner doesn't allow for administrative redundancy. Conversely,
having too many Azure subscription owners can increase the potential for a breach via a compromised
owner account. This blueprint helps you maintain an appropriate number of Azure subscription owners
by assigning two [Azure Policy](../../../policy/overview.md) definitions that audit the number of
owners for Azure subscriptions. Managing subscription owner permissions can help you implement
appropriate separation of duties.

- \[Preview\]: Audit minimum number of owners for subscription
- \[Preview\]: Audit maximum number of owners for a subscription

## A.8.2.1 Classification of information

Azure's [SQL Vulnerability Assessment service](https://docs.microsoft.com/azure/sql-database/sql-vulnerability-assessment)
can help you discover sensitive data stored in your databases and includes recommendations to
classify that data. This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition
to audit that vulnerabilities identified during SQL Vulnerability Assessment scan are remediated.

- \[Preview\]: Monitor SQL vulnerability assessment results in Azure Security Center

## A.9.1.2 Access to networks and network services

Azure implements [role-based access control](../../../../role-based-access-control/overview.md)
(RBAC) to manage who has access to Azure resources. This blueprint helps you control access to Azure
resources by assigning seven [Azure Policy](../../../policy/overview.md) definitions. These policies
audit use of resource types and configurations that may allow more permissive access to resources.
Understanding resources that are in violation of these policies can help you take corrective actions
to ensure access Azure resources is restricted to authorized users.

- \[Preview\]: Deploy VM extension to audit Linux VM accounts with no passwords
- \[Preview\]: Deploy VM extension to audit Linux VM allowing remote connections from accounts with no
  passwords
- \[Preview\]: Audit Linux VM accounts with no passwords
- \[Preview\]: Audit Linux VM allowing remote connections from accounts with no passwords
- Audit use of classic storage accounts
- Audit use of classic virtual machines
- Audit VMs that do not use managed disks

## A.9.2.3 Management of privileged access rights

This blueprint helps you restrict and control privileged access rights by assigning four [Azure
Policy](../../../policy/overview.md) definitions to audit external accounts with owner and/or write
permissions and accounts with owner and/or write permissions that don't have multi-factor
authentication enabled. Azure implements role-based access control (RBAC) to manage who has access
to Azure resources. This blueprint also assigns three Azure Policy definitions to audit use of Azure
Active Directory authentication for SQL Servers and Service Fabric. Using Azure Active Directory
authentication enables simplified permission management and centralized identity management of
database users and other Microsoft services. This blueprint also assigns an Azure Policy definition
to audit the use of custom RBAC rules. Understanding where custom RBAC rules are implement can help
you verify need and proper implementation, as custom RBAC rules are error prone.

- \[Preview\]: Audit accounts with owner permissions who are not MFA enabled on a subscription
- \[Preview\]: Audit accounts with write permissions who are not MFA enabled on a subscription
- \[Preview\]: Audit external accounts with owner permissions on a subscription
- \[Preview\]: Audit external accounts with write permissions on a subscription
- Audit provisioning of an Azure Active Directory administrator for SQL server
- Audit usage of Azure Active Directory for client authentication in Service Fabric
- Audit usage of custom RBAC rules

## A.9.2.4 Management of secret authentication information of users

This blueprint assigns three [Azure Policy](../../../policy/overview.md) definitions to audit
accounts that don't have multi-factor authentication enabled. Multi-factor authentication helps keep
accounts secure even if one piece of authentication information is compromised. By monitoring
accounts without multi-factor authentication enabled, you can identify accounts that may be more
likely to be compromised. This blueprint also assigns two Azure Policy definitions that audit Linux
VM password file permissions to alert if they're set incorrectly. This setup enables you to take
corrective action to ensure authenticators aren't compromised.

- \[Preview\]: Audit accounts with owner permissions who are not MFA enabled on a subscription
- \[Preview\]: Audit accounts with read permissions who are not MFA enabled on a subscription
- \[Preview\]: Audit accounts with write permissions who are not MFA enabled on a subscription
- \[Preview\]: Deploy VM extension to audit Linux VM passwd file permissions
- \[Preview\]: Audit Linux VM /etc/passwd file permissions are set to 0644

## A.9.2.5 Review of user access rights

Azure implements [role-based access control](../../../../role-based-access-control/overview.md)
(RBAC) to help you manage who has access to resources in Azure. Using the Azure portal, you can
review who has access to Azure resources and their permissions. This blueprint assigns four [Azure
Policy](../../../policy/overview.md) definitions to audit accounts that should be prioritized for
review, including depreciated accounts and external accounts with elevated permissions.

- \[Preview\]: Audit deprecated accounts on a subscription
- \[Preview\]: Audit deprecated accounts with owner permissions on a subscription
- \[Preview\]: Audit external accounts with owner permissions on a subscription
- \[Preview\]: Audit external accounts with write permissions on a subscription

## A.9.2.6 Removal or adjustment of access rights

Azure implements [role-based access control](../../../../role-based-access-control/overview.md)
(RBAC) to help you manage who has access to resources in Azure. Using [Azure Active
Directory](../../../../active-directory/fundamentals/active-directory-whatis.md) and RBAC, you can
update user roles to reflect organizational changes. When needed, accounts can be blocked from
signing in (or removed), which immediately removes access rights to Azure resources. This blueprint
assigns two [Azure Policy](../../../policy/overview.md) definitions to audit depreciated account
that should be considered for removal.

- \[Preview\]: Audit deprecated accounts on a subscription
- \[Preview\]: Audit deprecated accounts with owner permissions on a subscription

## A.9.4.2 Secure log-on procedures

This blueprint assigns three Azure Policy definitions to audit accounts that don't have
multi-factor authentication enabled. Azure Multi-Factor Authentication provides additional security
by requiring a second form of authentication and delivers strong authentication. By monitoring
accounts without multi-factor authentication enabled, you can identify accounts that may be more
likely to be compromised.

- \[Preview\]: Audit accounts with owner permissions who are not MFA enabled on a subscription
- \[Preview\]: Audit accounts with read permissions who are not MFA enabled on a subscription
- \[Preview\]: Audit accounts with write permissions who are not MFA enabled on a subscription

## A.9.4.3 Password management system

This blueprint helps you enforce strong passwords by assigning 10 [Azure
Policy](../../../policy/overview.md) definitions that audit Windows VMs that don't enforce minimum
strength and other password requirements. Awareness of VMs in violation of the password strength
policy helps you take corrective actions to ensure passwords for all VM user accounts are compliant
with policy.

- \[Preview\]: Deploy VM extension to audit Windows VM enforces password complexity requirements
- \[Preview\]: Deploy VM extension to audit Windows VM maximum password age 70 days
- \[Preview\]: Deploy VM extension to audit Windows VM minimum password age 1 day
- \[Preview\]: Deploy VM extension to audit Windows VM passwords must be at least 14 characters
- \[Preview\]: Deploy VM extension to audit Windows VM should not allow previous 24 passwords
- \[Preview\]: Audit Windows VM enforces password complexity requirements
- \[Preview\]: Audit Windows VM maximum password age 70 days
- \[Preview\]: Audit Windows VM minimum password age 1 day
- \[Preview\]: Audit Windows VM passwords must be at least 14 characters
- \[Preview\]: Audit Windows VM should not allow previous 24 passwords

## A.10.1.1 Policy on the use of cryptographic controls

This blueprint helps you enforce your policy on the use of cryptograph controls by assigning 13 [Azure Policy](../../../policy/overview.md)
definitions that enforce specific cryptograph controls and audit use of weak cryptographic settings.
Understanding where your Azure resources may have non-optimal cryptographic configurations can help
you take corrective actions to ensure resources are configured in accordance with your information
security policy. Specifically, the policies assigned by this blueprint require encryption for blob
storage accounts and data lake storage accounts; require transparent data encryption on SQL
databases; audit missing encryption on storage accounts, SQL databases, virtual machine disks, and
automation account variables; audit insecure connections to storage accounts, Function Apps, Web
App, API Apps, and Redis Cache; audit weak virtual machine password encryption; and audit
unencrypted Service Fabric communication.

- \[Preview\]: Audit HTTPS only access for a Function App
- \[Preview\]: Audit HTTPS only access for a Web Application
- \[Preview\]: Audit HTTPS only access for an API App
- \[Preview\]: Audit missing blob encryption for storage accounts
- \[Preview\]: Deploy VM extension to audit Windows VM should not store passwords using reversible
  encryption
- \[Preview\]: Audit Windows VM should not store passwords using reversible encryption
- \[Preview\]: Monitor unencrypted VM Disks in Azure Security Center
- Audit enablement of encryption of Automation account variables
- Audit enabling of only secure connections to your Redis Cache
- Audit secure transfer to storage accounts
- Audit the setting of ClusterProtectionLevel property to EncryptAndSign in Service Fabric
- Audit transparent data encryption status
- Transparent Data Encryption on SQL databases should be enabled

## A.12.4.1 Event logging

This blueprint helps you ensure system events are logged by assigning seven [Azure
Policy](../../../policy/overview.md) definitions that audit log settings on Azure resources.
Diagnostic logs provide insight into operations that were performed within Azure resources.

- \[Preview\]: Audit Dependency Agent Deployment - VM Image (OS) unlisted
- \[Preview\]: Audit Dependency Agent Deployment in VMSS - VM Image (OS) unlisted
- \[Preview\]: Audit Log Analytics Agent Deployment - VM Image (OS) unlisted
- \[Preview\]: Audit Log Analytics Agent Deployment in VMSS - VM Image (OS) unlisted
- Audit diagnostic setting
- Audit SQL server level Auditing settings
- Auditing should be enabled on advanced data security settings on SQL Server

## A.12.4.3 Administrator and operator logs

This blueprint helps you ensure system events are logged by assigning seven Azure Policy
definitions that audit log settings on Azure resources. Diagnostic logs provide insight into
operations that were performed within Azure resources.

- \[Preview\]: Audit Dependency Agent Deployment - VM Image (OS) unlisted
- \[Preview\]: Audit Dependency Agent Deployment in VMSS - VM Image (OS) unlisted
- \[Preview\]: Audit Log Analytics Agent Deployment - VM Image (OS) unlisted
- \[Preview\]: Audit Log Analytics Agent Deployment in VMSS - VM Image (OS) unlisted
- Audit diagnostic setting
- Audit SQL server level Auditing settings
- Auditing should be enabled on advanced data security settings on SQL Server

## A.12.4.4 Clock synchronization

This blueprint helps you ensure system events are logged by assigning seven Azure Policy
definitions that audit log settings on Azure resources. Azure logs rely on synchronized
internal clocks to create a time-correlated record of events across resources.

- \[Preview\]: Audit Dependency Agent Deployment - VM Image (OS) unlisted
- \[Preview\]: Audit Dependency Agent Deployment in VMSS - VM Image (OS) unlisted
- \[Preview\]: Audit Log Analytics Agent Deployment - VM Image (OS) unlisted
- \[Preview\]: Audit Log Analytics Agent Deployment in VMSS - VM Image (OS) unlisted
- Audit diagnostic setting
- Audit SQL server level Auditing settings
- Auditing should be enabled on advanced data security settings on SQL Server

## A.12.5.1 Installation of software on operational systems

Adaptive application control is solution from Azure Security Center that helps you control which
applications can run on your VMs located in Azure. This blueprint assigns an Azure Policy definition
that monitors changes to the set of allowed applications. This capability helps you control
installation of software and applications on Azure VMs.

- \[Preview\]: Monitor possible app Whitelisting in Azure Security Center

## A.12.6.1 Management of technical vulnerabilities

This blueprint helps you manage information system vulnerabilities by assigning five [Azure
Policy](../../../policy/overview.md) definitions that monitor missing system updates, operating
system vulnerabilities, SQL vulnerabilities, and virtual machine vulnerabilities in Azure Security
Center. Azure Security Center provides reporting capabilities that enable you to have real-time
insight into the security state of deployed Azure resources.

- \[Preview\]: Monitor missing Endpoint Protection in Azure Security Center
- \[Preview\]: Monitor missing system updates in Azure Security Center
- \[Preview\]: Monitor OS vulnerabilities in Azure Security Center
- \[Preview\]: Monitor SQL vulnerability assessment results in Azure Security Center
- \[Preview\]: Monitor VM Vulnerabilities in Azure Security Center

## A.12.6.2 Restrictions on software installation

Adaptive application control is solution from Azure Security Center that helps you control which
applications can run on your VMs located in Azure. This blueprint assigns an Azure Policy
definition that monitors changes to the set of allowed applications. Restrictions on software
installation can help you reduce the likelihood of introduction of software vulnerabilities.

- \[Preview\]: Monitor possible app Whitelisting in Azure Security Center

## A.13.1.1 Network controls

This blueprint helps you manage and control networks by assigning an [Azure
Policy](../../../policy/overview.md) definition that monitors network security groups with
permissive rules. Rules that are too permissive may allow unintended network access and should be
reviewed. This blueprint also assigns three Azure Policy definitions that monitor unprotected
endpoints, applications, and storage accounts. Endpoints and applications that aren't protected by
a firewall, and storage accounts with unrestricted access can allow unintended access to information
contained within the information system.

- \[Preview\]: Monitor permissive network access in Azure Security Center
- \[Preview\]: Monitor unprotected network endpoints in Azure Security Center
- \[Preview\]: Monitor unprotected web application in Azure Security Center
- Audit unrestricted network access to storage accounts

## A.13.2.1 Information transfer policies and procedures

The blueprint helps you ensure information transfer with Azure services is secure by assigning two
[Azure Policy](../../../policy/overview.md) definitions to audit insecure connections to storage
accounts and Redis Cache.

- Audit enabling of only secure connections to your Redis Cache
- Audit secure transfer to storage accounts

## Next steps

Now that you've reviewed the control mapping of the ISO 27001 App Service Environment/SQL Database
workload blueprint sample, visit the following articles to learn about the architecture and how to
deploy this sample:

> [!div class="nextstepaction"]
> [ISO 27001 App Service Environment/SQL Database workload blueprint - Overview](./index.md)
> [ISO 27001 App Service Environment/SQL Database workload blueprint - Deploy steps](./deploy.md)

Additional articles about blueprints and how to use them:

- Learn about the [blueprint lifecycle](../../concepts/lifecycle.md).
- Understand how to use [static and dynamic parameters](../../concepts/parameters.md).
- Learn to customize the [blueprint sequencing order](../../concepts/sequencing-order.md).
- Find out how to make use of [blueprint resource locking](../../concepts/resource-locking.md).
- Learn how to [update existing assignments](../../how-to/update-existing-assignments.md).