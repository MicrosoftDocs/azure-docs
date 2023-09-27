---
title: ISO 27001 Shared Services blueprint sample controls
description: Control mapping of the ISO 27001 Shared Services blueprint sample. Each control is mapped to one or more Azure Policy definitions that assist with assessment.
ms.date: 09/07/2023
ms.topic: sample
---
# Control mapping of the ISO 27001 Shared Services blueprint sample

[!INCLUDE [Blueprints deprecation note](../../../../../includes/blueprints-deprecation-note.md)]

The following article details how the Azure Blueprints ISO 27001 Shared Services blueprint sample
maps to the ISO 27001 controls. For more information about the controls, see
[ISO 27001](https://www.iso.org/isoiec-27001-information-security.html).

The following mappings are to the **ISO 27001:2013** controls. Use the navigation on the right to
jump directly to a specific control mapping. Many of the mapped controls are implemented with an
[Azure Policy](../../../policy/overview.md) initiative. To review the complete initiative, open
**Policy** in the Azure portal and select the **Definitions** page. Then, find and select the
**\[Preview\] Audit ISO 27001:2013 controls and deploy specific VM Extensions to support audit
requirements** built-in policy initiative.

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
> [GitHub Commit History](https://github.com/MicrosoftDocs/azure-docs/blob/main/articles/governance/blueprints/samples/iso27001-shared/control-mapping.md).

## A.6.1.2 Segregation of duties

Having only one Azure subscription owner doesn't allow for administrative redundancy. Conversely,
having too many Azure subscription owners can increase the potential for a breach via a compromised
owner account. This blueprint helps you maintain an appropriate number of Azure subscription owners
by assigning two [Azure Policy](../../../policy/overview.md) definitions that audit the number of
owners for Azure subscriptions. Managing subscription owner permissions can help you implement
appropriate separation of duties.

- A maximum of 3 owners should be designated for your subscription
- There should be more than one owner assigned to your subscription

## A.8.2.1 Classification of information

Azure's
[SQL Vulnerability Assessment service](../../../../defender-for-cloud/sql-azure-vulnerability-assessment-overview.md)
can help you discover sensitive data stored in your databases and includes recommendations to
classify that data. This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition
to audit that vulnerabilities identified during SQL Vulnerability Assessment scan are remediated.

- Vulnerabilities on your SQL databases should be remediated

## A.9.1.2 Access to networks and network services

[Azure role-based access control (Azure RBAC)](../../../../role-based-access-control/overview.md)
helps to manage who has access to Azure resources. This blueprint helps you control access to Azure
resources by assigning seven [Azure Policy](../../../policy/overview.md) definitions. These policies
audit use of resource types and configurations that may allow more permissive access to resources.
Understanding resources that are in violation of these policies can help you take corrective actions
to ensure access Azure resources is restricted to authorized users.

- Show audit results from Linux VMs that have accounts without passwords
- Show audit results from Linux VMs that allow remote connections from accounts without passwords
- Storage accounts should be migrated to new Azure Resource Manager resources
- Virtual machines should be migrated to new Azure Resource Manager resources
- Audit VMs that do not use managed disks

## A.9.2.3 Management of privileged access rights

This blueprint helps you restrict and control privileged access rights by assigning four [Azure
Policy](../../../policy/overview.md) definitions to audit external accounts with owner and/or write
permissions and accounts with owner and/or write permissions that don't have multi-factor
authentication enabled. Azure role-based access control (Azure RBAC) helps to manage who has access
to Azure resources. This blueprint also assigns three Azure Policy definitions to audit use of Azure
Active Directory authentication for SQL Servers and Service Fabric. Using Azure Active Directory
authentication enables simplified permission management and centralized identity management of
database users and other Microsoft services. This blueprint also assigns an Azure Policy definition
to audit the use of custom Azure RBAC rules. Understanding where custom Azure RBAC rules are
implement can help you verify need and proper implementation, as custom Azure RBAC rules are error
prone.

- MFA should be enabled on accounts with owner permissions on your subscription
- MFA should be enabled accounts with write permissions on your subscription
- External accounts with owner permissions should be removed from your subscription
- External accounts with write permissions should be removed from your subscription
- An Azure Active Directory administrator should be provisioned for SQL servers
- Service Fabric clusters should only use Azure Active Directory for client authentication
- Audit usage of custom RBAC rules

## A.9.2.4 Management of secret authentication information of users

This blueprint assigns three [Azure Policy](../../../policy/overview.md) definitions to audit
accounts that don't have multi-factor authentication enabled. Multi-factor authentication helps keep
accounts secure even if one piece of authentication information is compromised. By monitoring
accounts without multi-factor authentication enabled, you can identify accounts that may be more
likely to be compromised. This blueprint also assigns two Azure Policy definitions that audit Linux
VM password file permissions to alert if they're set incorrectly. This setup enables you to take
corrective action to ensure authenticators aren't compromised.

- MFA should be enabled on accounts with owner permissions on your subscription
- MFA should be enabled on accounts with read permissions on your subscription
- MFA should be enabled accounts with write permissions on your subscription
- Show audit results from Linux VMs that do not have the passwd file permissions set to 0644

## A.9.2.5 Review of user access rights

[Azure role-based access control (Azure RBAC)](../../../../role-based-access-control/overview.md)
helps you manage who has access to resources in Azure. Using the Azure portal, you can review who
has access to Azure resources and their permissions. This blueprint assigns four [Azure
Policy](../../../policy/overview.md) definitions to audit accounts that should be prioritized for
review, including depreciated accounts and external accounts with elevated permissions.

- Deprecated accounts should be removed from your subscription
- Deprecated accounts with owner permissions should be removed from your subscription
- External accounts with owner permissions should be removed from your subscription
- External accounts with write permissions should be removed from your subscription

## A.9.2.6 Removal or adjustment of access rights

[Azure role-based access control (Azure RBAC)](../../../../role-based-access-control/overview.md)
helps you manage who has access to resources in Azure. Using [Azure Active
Directory](../../../../active-directory/fundamentals/active-directory-whatis.md) and Azure RBAC, you
can update user roles to reflect organizational changes. When needed, accounts can be blocked from
signing in (or removed), which immediately removes access rights to Azure resources. This blueprint
assigns two [Azure Policy](../../../policy/overview.md) definitions to audit depreciated account
that should be considered for removal.

- Deprecated accounts should be removed from your subscription
- Deprecated accounts with owner permissions should be removed from your subscription

## A.9.4.2 Secure log-on procedures

This blueprint assigns three Azure Policy definitions to audit accounts that don't have multi-factor
authentication enabled. Azure AD Multi-Factor Authentication provides additional security by requiring
a second form of authentication and delivers strong authentication. By monitoring accounts without
multi-factor authentication enabled, you can identify accounts that may be more likely to be
compromised.

- MFA should be enabled on accounts with owner permissions on your subscription
- MFA should be enabled on accounts with read permissions on your subscription
- MFA should be enabled accounts with write permissions on your subscription

## A.9.4.3 Password management system

This blueprint helps you enforce strong passwords by assigning 10 [Azure
Policy](../../../policy/overview.md) definitions that audit Windows VMs that don't enforce minimum
strength and other password requirements. Awareness of VMs in violation of the password strength
policy helps you take corrective actions to ensure passwords for all VM user accounts are compliant
with policy.

- Show audit results from Windows VMs that do not have the password complexity setting enabled
- Show audit results from Windows VMs that do not have a maximum password age of 70 days
- Show audit results from Windows VMs that do not have a minimum password age of 1 day
- Show audit results from Windows VMs that do not restrict the minimum password length to 14
  characters
- Show audit results from Windows VMs that allow re-use of the previous 24 passwords

## A.10.1.1 Policy on the use of cryptographic controls

This blueprint helps you enforce your policy on the use of cryptograph controls by assigning 13
[Azure Policy](../../../policy/overview.md) definitions that enforce specific cryptograph controls
and audit use of weak cryptographic settings. Understanding where your Azure resources may have
non-optimal cryptographic configurations can help you take corrective actions to ensure resources
are configured in accordance with your information security policy. Specifically, the policies
assigned by this blueprint require encryption for blob storage accounts and Data Lake storage
accounts; require transparent data encryption on SQL databases; audit missing encryption on storage
accounts, SQL databases, virtual machine disks, and automation account variables; audit insecure
connections to storage accounts, Function Apps, Web App, API Apps, and Redis Cache; audit weak
virtual machine password encryption; and audit unencrypted Service Fabric communication.

- Function App should only be accessible over HTTPS
- Web Application should only be accessible over HTTPS
- API App should only be accessible over HTTPS
- Show audit results from Windows VMs that do not store passwords using reversible encryption
- Disk encryption should be applied on virtual machines
- Automation account variables should be encrypted
- Only secure connections to your Azure Cache for Redis should be enabled
- Secure transfer to storage accounts should be enabled
- Service Fabric clusters should have the ClusterProtectionLevel property set to EncryptAndSign
- Transparent Data Encryption on SQL databases should be enabled

## A.12.4.1 Event logging

This blueprint helps you ensure system events are logged by assigning seven [Azure
Policy](../../../policy/overview.md) definitions that audit log settings on Azure resources.
Diagnostic logs provide insight into operations that were performed within Azure resources.

- Audit Dependency agent deployment - VM Image (OS) unlisted
- Audit Dependency agent deployment in virtual machine scale sets - VM Image (OS) unlisted
- [Preview]: Audit Log Analytics Agent Deployment - VM Image (OS) unlisted
- Audit Log Analytics agent deployment in virtual machine scale sets - VM Image (OS) unlisted
- Audit diagnostic setting
- Auditing on SQL server should be enabled

## A.12.4.3 Administrator and operator logs

This blueprint helps you ensure system events are logged by assigning seven Azure Policy
definitions that audit log settings on Azure resources. Diagnostic logs provide insight into
operations that were performed within Azure resources.

- Audit Dependency agent deployment - VM Image (OS) unlisted
- Audit Dependency agent deployment in virtual machine scale sets - VM Image (OS) unlisted
- [Preview]: Audit Log Analytics Agent Deployment - VM Image (OS) unlisted
- Audit Log Analytics agent deployment in virtual machine scale sets - VM Image (OS) unlisted
- Audit diagnostic setting
- Auditing on SQL server should be enabled

## A.12.4.4 Clock synchronization

This blueprint helps you ensure system events are logged by assigning seven Azure Policy
definitions that audit log settings on Azure resources. Azure logs rely on synchronized
internal clocks to create a time-correlated record of events across resources.

- Audit Dependency agent deployment - VM Image (OS) unlisted
- Audit Dependency agent deployment in virtual machine scale sets - VM Image (OS) unlisted
- [Preview]: Audit Log Analytics Agent Deployment - VM Image (OS) unlisted
- Audit Log Analytics agent deployment in virtual machine scale sets - VM Image (OS) unlisted
- Audit diagnostic setting
- Auditing on SQL server should be enabled

## A.12.5.1 Installation of software on operational systems

Adaptive application control is solution from Azure Security Center that helps you control which
applications can run on your VMs located in Azure. This blueprint assigns an Azure Policy definition
that monitors changes to the set of allowed applications. This capability helps you control
installation of software and applications on Azure VMs.

- Adaptive application controls for defining safe applications should be enabled on your machines

## A.12.6.1 Management of technical vulnerabilities

This blueprint helps you manage information system vulnerabilities by assigning five [Azure
Policy](../../../policy/overview.md) definitions that monitor missing system updates, operating
system vulnerabilities, SQL vulnerabilities, and virtual machine vulnerabilities in Azure Security
Center. Azure Security Center provides reporting capabilities that enable you to have real-time
insight into the security state of deployed Azure resources.

- Monitor missing Endpoint Protection in Azure Security Center
- System updates should be installed on your machines
- Vulnerabilities in security configuration on your machines should be remediated
- Vulnerabilities on your SQL databases should be remediated
- Vulnerabilities should be remediated by a Vulnerability Assessment solution

## A.12.6.2 Restrictions on software installation

Adaptive application control is solution from Azure Security Center that helps you control which
applications can run on your VMs located in Azure. This blueprint assigns an Azure Policy
definition that monitors changes to the set of allowed applications. Restrictions on software
installation can help you reduce the likelihood of introduction of software vulnerabilities.

- Adaptive application controls for defining safe applications should be enabled on your machines

## A.13.1.1 Network controls

This blueprint helps you manage and control networks by assigning an [Azure
Policy](../../../policy/overview.md) definition that monitors network security groups with
permissive rules. Rules that are too permissive may allow unintended network access and should be
reviewed. This blueprint also assigns three Azure Policy definitions that monitor unprotected
endpoints, applications, and storage accounts. Endpoints and applications that aren't protected by a
firewall, and storage accounts with unrestricted access can allow unintended access to information
contained within the information system.

- Access through Internet facing endpoint should be restricted
- Storage accounts should restrict network access

## A.13.2.1 Information transfer policies and procedures

The blueprint helps you ensure information transfer with Azure services is secure by assigning two
[Azure Policy](../../../policy/overview.md) definitions to audit insecure connections to storage
accounts and Azure Cache for Redis.

- Only secure connections to your Azure Cache for Redis should be enabled
- Secure transfer to storage accounts should be enabled

## Next steps

Now that you've reviewed the control mapping of the ISO 27001 Shared Services blueprint, visit the
following articles to learn about the architecture and how to deploy this sample:

> [!div class="nextstepaction"]
> [ISO 27001 Shared Services blueprint - Overview](./index.md)
> [ISO 27001 Shared Services blueprint - Deploy steps](./deploy.md)

Additional articles about blueprints and how to use them:

- Learn about the [blueprint lifecycle](../../concepts/lifecycle.md).
- Understand how to use [static and dynamic parameters](../../concepts/parameters.md).
- Learn to customize the [blueprint sequencing order](../../concepts/sequencing-order.md).
- Find out how to make use of [blueprint resource locking](../../concepts/resource-locking.md).
- Learn how to [update existing assignments](../../how-to/update-existing-assignments.md).