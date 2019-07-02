---
title: Sample - PCI-DSS v3.2.1 blueprint - Control mapping
description: Control mapping of the Payment Card Industry Data Security Standard v3.2.1 blueprint sample to Azure Policy and RBAC.
services: blueprints
author: DCtheGeek
ms.author: dacoulte
ms.date: 06/24/2019
ms.topic: conceptual
ms.service: blueprints
manager: carmonm
---
# Control mapping of the PCI-DSS v3.2.1 blueprint sample

The following article details how the Azure Blueprints PCI-DSS v3.2.1 blueprint sample maps to the
PCI-DSS v3.2.1 controls. For more information about the controls, see [PCI-DSS v3.2.1](https://www.pcisecuritystandards.org/documents/PCI_DSS_v3-2-1.pdf).

The following mappings are to the **PCI-DSS v3.2.1:2018** controls. Use the navigation on the right
to jump directly to a specific control mapping. Many of the mapped controls are implemented with an [Azure Policy](../../../policy/overview.md)
initiative. To review the complete initiative, open **Policy** in the Azure portal and select the
**Definitions** page. Then, find and select the **[Preview] Audit PCI v3.2.1:2018 controls and
deploy specific VM Extensions to support audit requirements** built-in policy initiative.

## 1.3.2 and 1.3.4 Boundary Protection

This blueprint helps you manage and control networks by assigning [Azure
Policy](../../../policy/overview.md) definitions that monitors network security groups with
permissive rules. Rules that are too permissive may allow unintended network access and should be
reviewed. This blueprint assigns one Azure Policy definitions that monitor unprotected endpoints,
applications, and storage accounts. Endpoints and applications that aren't protected by a firewall,
and storage accounts with unrestricted access can allow unintended access to information contained
within the information system.

- Audit unrestricted network access to storage accounts
- Access through Internet facing endpoint should be restricted

## 3.4.a, 4.1, 4.1.g, 4.1.h and 6.5.3 Cryptographic Protection

This blueprint helps you enforce your policy with the use of cryptograph controls by assigning [Azure Policy](../../../policy/overview.md)
definitions which enforce specific cryptograph controls and audit use of weak cryptographic
settings. Understanding where your Azure resources may have non-optimal cryptographic configurations
can help you take corrective actions to ensure resources are configured in accordance with your
information security policy. Specifically, the policies assigned by this blueprint require
transparent data encryption on SQL databases; audit missing encryption on storage accounts, and
automation account variables. There are also policies which address audit insecure connections to
storage accounts, Function Apps, WebApp, API Apps, and Redis Cache, and audit unencrypted Service
Fabric communication.

- Function App should only be accessible over HTTPS
- Web Application should only be accessible over HTTPS
- API App should only be accessible over HTTPS
- Monitor unencrypted SQL database in Azure Security Center
- Disk encryption should be applied on virtual machines
- Automation account variables should be encrypted
- Only secure connections to your Redis Cache should be enabled
- Secure transfer to storage accounts should be enabled
- Service Fabric clusters should have the ClusterProtectionLevel property set to EncryptAndSign
- Transparent Data Encryption on SQL databases should be enabled
- Deploy SQL DB transparent data encryption

## 5.1, 6.2, 6.6 and 11.2.1 Vulnerability Scanning and System Updates

This blueprint helps you manage information system vulnerabilities by assigning [Azure
Policy](../../../policy/overview.md) definitions that monitor missing system updates, operating
system vulnerabilities, SQL vulnerabilities, and virtual machine vulnerabilities in Azure Security
Center. Azure Security Center provides reporting capabilities that enable you to have real-time
insight into the security state of deployed Azure resources.

- Monitor missing Endpoint Protection in Azure Security Center
- Deploy default Microsoft IaaSAntimalware extension for Windows Server
- Deploy Threat Detection on SQL Servers
- System updates should be installed on your machines
- Vulnerabilities in security configuration on your machines should be remediated
- Vulnerabilities on your SQL databases should be remediated
- Vulnerabilities should be remediated by a Vulnerability Assessment solution

## 7.1.1. 7.1.2 and 7.1.3 Separation of Duties

Having only one Azure subscription owner doesn't allow for administrative redundancy. Conversely,
having too many Azure subscription owners can increase the potential for a breach via a compromised
owner account. This blueprint helps you maintain an appropriate number of Azure subscription owners
by assigning [Azure Policy](../../../policy/overview.md) definitions which audit the number of
owners for Azure subscriptions. Managing subscription owner permissions can help you implement
appropriate separation of duties.

- There should be more than one owner assigned to your subscription
- A maximum of 3 owners should be designated for your subscription 

## 3.2, 7.2.1, 8.3.1.a and 8.3.1.b Management of Privileged Access Rights

This blueprint helps you restrict and control privileged access rights by assigning [Azure
Policy](../../../policy/overview.md) definitions to audit external accounts with owner, write and/or
read permissions and employee accounts with owner and/or write permissions that don't have
multi-factor authentication enabled. Azure implements role-based access control (RBAC) to manage who
has access to Azure resources. Understanding where custom RBAC rules are implement can help you
verify need and proper implementation, as custom RBAC rules are error prone. This blueprint also
assigns [Azure Policy](../../../policy/overview.md) definitions to audit use of Azure Active
Directory authentication for SQL Servers. Using Azure Active Directory authentication simplifies
permission management and centralizes identity management of database users and other Microsoft  
services.
 
- External accounts with owner permissions should be removed from your subscription
- External accounts with write permissions should be removed from your subscription
- External accounts with read permissions should be removed from your subscription
- MFA should be enabled on accounts with owner permissions on your subscription
- MFA should be enabled accounts with write permissions on your subscription
- MFA should be enabled on accounts with read permissions on your subscription
- An Azure Active Directory administrator should be provisioned for SQL servers
- Audit usage of custom RBAC rules

## 8.1.2 and 8.1.5 Least Privilege and Review of User Access Rights

Azure implements role-based access control (RBAC) to helps you manage who has access to resources in
Azure. Using the Azure portal, you can review who has access to Azure resources and their
permissions. This blueprint assigns [Azure Policy](../../../policy/overview.md) definitions to audit
accounts that should be prioritized for review, including depreciated accounts and external accounts
with elevated permissions.

- Deprecated accounts should be removed from your subscription
- Deprecated accounts with owner permissions should be removed from your subscription
- External accounts with owner permissions should be removed from your subscription
- External accounts with write permissions should be removed from your subscription
- External accounts with read permissions should be removed from your subscription

## 8.1.3 Removal or Adjustment of Access Rights

Azure implements role-based access control (RBAC) to help you manage who has access to resources in
Azure. Using Azure Active Directory and RBAC, you can update user roles to reflect organizational
changes. When needed, accounts can be blocked from signing in (or removed), which immediately
removes access rights to Azure resources. This blueprint assigns [Azure
Policy](../../../policy/overview.md) definitions to audit depreciated account that should be
considered for removal.

- Deprecated accounts should be removed from your subscription
- Deprecated accounts with owner permissions should be removed from your subscription

## 8.2.3.a,b, 8.2.4.a,b and 8.2.5 Password-based Authentication

This blueprint helps you enforce strong passwords by assigning [Azure
Policy](../../../policy/overview.md) definitions that audit Windows VMs that don't enforce minimum
strength and other password requirements. Awareness of VMs in violation of the password strength
policy helps you take corrective actions to ensure passwords for all VM user accounts are compliant
with policy.

- [Preview]: Audit Windows VMs that do not have a maximum password age of 70 days
- [Preview]: Deploy requirements to audit Windows VMs that do not have a maximum password age of 70 days
- [Preview]: Audit Windows VMs that do not restrict the minimum password length to 14 characters
- [Preview]: Deploy requirements to audit Windows VMs that do not restrict the minimum password length to 14 characters
- [Preview]: Audit Windows VMs that allow re-use of the previous 24 passwords
- [Preview]: Deploy requirements to audit Windows VMs that allow re-use of the previous 24 passwords

## 10.3 and 10.5.4 Audit Generation

This blueprint helps you ensure system events are logged by assigning [Azure
Policy](../../../policy/overview.md) definitions that audit log settings on Azure resources.
Diagnostic logs provide insight into operations that were performed within Azure resources. Azure
logs rely on synchronized internal clocks to create a time-correlated record of events across
resources.

- Monitor unaudited SQL servers in Azure Security Center
- Audit diagnostic setting
- Audit SQL server level Auditing settings
- Deploy Auditing on SQL servers
- Storage accounts should be migrated to new Azure Resource Manager resources
- Virtual machines should be migrated to new Azure Resource Manager resources

## 12.3.6 and 12.3.7 Information Security

This blueprint helps you manage and control your network by assigning [Azure
Policy](../../../policy/overview.md) definitions that audit the acceptable network locations and the
approved company products allowed for the environment. These are customizable by each company
through the policy parameters within each of these policies.

- Allowed locations
- Allowed locations for resource groups

## Next steps

Now that you've reviewed the control mapping of the PCI-DSS v3.2.1 blueprint, visit the following
articles to learn about the overview and how to deploy this sample:

> [!div class="nextstepaction"]
> [PCI-DSS v3.2.1 blueprint - Overview](./index.md)
> [PCI-DSS v3.2.1 blueprint - Deploy steps](./deploy.md)

## Addition articles about blueprints and how to use them:

- Learn about the [blueprint life-cycle](../../concepts/lifecycle.md).
- Understand how to use [static and dynamic parameters](../../concepts/parameters.md).
- Learn to customize the [blueprint sequencing order](../../concepts/sequencing-order.md).
- Find out how to make use of [blueprint resource locking](../../concepts/resource-locking.md).
- Learn how to [update existing assignments](../../how-to/update-existing-assignments.md).
