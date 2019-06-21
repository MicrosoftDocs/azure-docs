---
title: Sample - PCI-DSS v3.2.1 blueprint - Control mapping
description: Control mapping of the Payment Card Industry Data Security Standard v3.2.1 blueprint sample to Azure Policy and RBAC.
services: blueprints
author: DCtheGeek
ms.author: dacoulte
ms.date: 05/16/2019
ms.topic: conceptual
ms.service: blueprints
manager: carmonm
---
# Control mapping of the PCI-DSS v3.2.1 blueprint sample

The following article details how the Azure Blueprints PCI-DSS v3.2.1 blueprint sample maps to the
PCI-DSS v3.2.1 controls. For more information about the controls, see [PCI-DSS v3.2.1](https://www.pcisecuritystandards.org/documents/PCI_DSS_v3-2-1.pdf).

The following mappings are to the **PCI-DSS v3.2.1** controls. Use the navigation on the right to
jump directly to a specific control mapping. Many of the mapped controls are implemented with an [Azure Policy](../../../policy/overview.md)
initiative. To review the complete initiative, open **Policy** in the Azure portal and select the
**Definitions** page. Then, find and select the **[Preview] Audit PCI-DSS v3.2.1 controls** built-in
policy initiative.

## 7.1 Segregation of Duties

Having only one Azure subscription owner doesn't allow for administrative redundancy. Conversely,
having too many Azure subscription owners can increase the potential for a breach via a compromised
owner account. This blueprint helps you maintain an appropriate number of Azure subscription owners
by assigning [Azure
Policy](../../../policy/overview.md) definitions which audit the number of owners for Azure subscriptions.
Managing subscription owner permissions can help you implement appropriate separation of duties.

- [Preview]: Audit minimum number of owners for subscription
- [Preview]: Audit maximum number of owners for a subscription

## 7.1 Access to networks and network services

Azure implements role-based access control (RBAC) to manage who has access to Azure resources. This
blueprint helps you control access to Azure resources by assigning [Azure
Policy](../../../policy/overview.md) definitions. These policies audit use of resource types and
configurations that may allow more permissive access to resources. Understanding resources that are
in violation of these policies can help you take corrective actions to ensure access Azure resources
is restricted to authorized users.

- Audit use of classic storage accounts
- Audit use of classic virtual machines
- Audit usage of custom RBAC rules

## 7.2.1, 8.3.1.a and 8.3.1.b Management of privileged access rights

This blueprint helps you restrict and control privileged access rights by assigning [Azure
Policy](../../../policy/overview.md) definitions to audit external accounts with owner, write 
and/or read permissions and accounts with owner and/or write permissions that don't have multi-factor 
authentication enabled. Azure implements role-based access control (RBAC) to manage who has access to
Azure resources. This blueprint also assigns [Azure Policy](../../../policy/overview.md) definitions to 
audit use of Azure Active Directory authentication for SQL Servers. Using Azure Active Directory 
authentication enables simplified permission management and centralized identity management of database 
users and other Microsoft services. This blueprint also assigns an Azure Policy definition to audit the 
use of custom RBAC rules. Understanding where custom RBAC rules are implement can help you verify need 
and proper implementation, as custom RBAC rules are error prone.

- [Preview]: Audit external accounts with owner permissions on a subscription
- [Preview]: Audit external accounts with write permissions on a subscription
- [Preview]: Audit external accounts with read permissions on a subscription
- [Preview]: Audit accounts with owner permissions who are not MFA enabled on a subscription
- [Preview]: Audit accounts with write permissions who are not MFA enabled on a subscription
- Audit provisioning of an Azure Active Directory administrator for SQL server
- Audit usage of custom RBAC rules

## 8.1.2 and 8.1.5 Review of user access rights

Azure implements role-based access control (RBAC) to helps you manage who has access to resources in
Azure. Using the Azure portal, you can review who has access to Azure resources and their
permissions. This blueprint assigns [Azure Policy](../../../policy/overview.md) definitions to
audit accounts that should be prioritized for review, including depreciated accounts and external
accounts with elevated permissions.

- [Preview]: Audit deprecated accounts on a subscription
- [Preview]: Audit deprecated accounts with owner permissions on a subscription
- [Preview]: Audit external accounts with owner permissions on a subscription
- [Preview]: Audit external accounts with write permissions on a subscription
- [Preview]: Audit external accounts with read permissions on a subscription


## 8.1.3 Removal or adjustment of access rights

Azure implements role-based access control (RBAC) to help you manage who has access to resources in
Azure. Using Azure Active Directory and RBAC, you can update user roles to reflect organizational
changes. When needed, accounts can be blocked from signing in (or removed), which immediately
removes access rights to Azure resources. This blueprint assigns [Azure
Policy](../../../policy/overview.md) definitions to audit depreciated account that should be
considered for removal.

- [Preview]: Audit deprecated accounts on a subscription
- [Preview]: Audit deprecated accounts with owner permissions on a subscription

## 8.3.1.a and 8.3.1.b Secure log-on procedures

This blueprint assigns two [Azure Policy](../../../policy/overview.md) definitions to audit accounts
that don't have multi-factor authentication enabled. Azure Multi-Factor Authentication provides
additional security by requiring a second form of authentication and delivers strong authentication.
By monitoring accounts without multi-factor authentication enabled, you can identify accounts that
may be more likely to be compromised.

- [Preview]: Audit accounts with owner permissions who are not MFA enabled on a subscription
- [Preview]: Audit accounts with write permissions who are not MFA enabled on a subscription
- [Preview]: Audit accounts with read permissions who are not MFA enabled on a subscription

## 8.2.3.a,b and 8.2.4.a,b Password management system

This blueprint helps you enforce strong passwords by assigning [Azure
Policy](../../../policy/overview.md) definitions that audit Windows VMs that don't enforce minimum
strength and other password requirements. Awareness of VMs in violation of the password strength
policy helps you take corrective actions to ensure passwords for all VM user accounts are compliant
with policy.

- [Preview]: Deploy VM extension to audit Windows VM maximum password age 70 days
- [Preview]: Deploy VM extension to audit Windows VM passwords must be at least 14 characters
- [Preview]: Deploy VM extension to audit Windows VM should not allow previous 24 passwords
- [Preview]: Audit Windows VM maximum password age 70 days
- [Preview]: Audit Windows VM passwords must be at least 14 characters
- [Preview]: Audit Windows VM should not allow previous 24 passwords

## 3.4.a, 4.1, 4.1.g, 4.1.h Policy on the use of cryptographic controls

This blueprint helps you enforce your policy on the use of cryptograph controls by assigning
[Azure Policy](../../../policy/overview.md) definitions which enforce specific cryptograph controls
and audit use of weak cryptographic settings. Understanding where your Azure resources may have
non-optimal cryptographic configurations can help you take corrective actions to ensure resources
are configured in accordance with your information security policy. Specifically, the policies
assigned by this blueprint require encryption for blob storage accounts and data lake storage
accounts; require transparent data encryption on SQL databases; audit missing encryption on storage
accounts, SQL databases, and automation account variables; audit insecure connections to storage
accounts, Function Apps, Web App, API Apps, and Redis Cache, and audit unencrypted Service Fabric
communication.

- [Preview]: Audit HTTPS only access for a Function App
- [Preview]: Audit HTTPS only access for a Web Application
- [Preview]: Audit HTTPS only access for an API App
- [Preview]: Monitor unencrypted SQL database in Azure Security Center
- [Preview]: Monitor unencrypted VM Disks in Azure Security Center
- Audit enablement of encryption of Automation account variables
- Audit enabling of only secure connections to your Redis Cache
- Audit secure transfer to storage accounts
- Audit the setting of Cluster Protection Level property to Encrypt and Sign in Service Fabric
- Audit transparent data encryption status

## 10.3 and 10.5.4 Event logging

This blueprint helps you ensure system events are logged by assigning [Azure
Policy](../../../policy/overview.md) definitions that audit log settings on Azure resources.
Diagnostic logs provide insight into operations that were performed within Azure resources. Azure
logs rely on synchronized internal clocks to create a time-correlated record of events across
resources.

- [Preview]: Monitor unaudited SQL database in Azure Security Center
- Audit diagnostic setting
- Audit SQL server level Auditing settings

## 6.2, 6.6 and 11.2.1 Management of technical vulnerabilities

This blueprint helps you manage information system vulnerabilities by assigning [Azure
Policy](../../../policy/overview.md) definitions that monitor missing system updates, operating
system vulnerabilities, SQL vulnerabilities, and virtual machine vulnerabilities in Azure Security
Center. Azure Security Center provides reporting capabilities that enable you to have real-time
insight into the security state of deployed Azure resources.

- [Preview]: Monitor missing system updates in Azure Security Center
- [Preview]: Monitor OS vulnerabilities in Azure Security Center
- [Preview]: Monitor SQL vulnerability assessment results in Azure Security Center
- [Preview]: Monitor VM Vulnerabilities in Azure Security Center

## 1.3.2 and 1.3.4 Network controls

This blueprint helps you manage and control networks by assigning [Azure
Policy](../../../policy/overview.md) definitions that monitors network security groups with
permissive rules. Rules that are too permissive may allow unintended network access and should be
reviewed. This blueprint assigns one Azure Policy definitions that monitor unprotected endpoints,
applications, and storage accounts. Endpoints and applications that aren't protected by a firewall,
and storage accounts with unrestricted access can allow unintended access to information contained
within the information system.

- [Preview]: Monitor unprotected network endpoints in Azure Security Center
- [Preview]: Monitor missing Endpoint Protection in Azure Security Center
- Audit unrestricted network access to storage accounts
- Access through Internet facing endpoint should be restricted

## 4.1 Information transfer policies and procedures

The blueprint helps you ensure information transfer with Azure services is secure by assigning
[Azure
Policy](../../../policy/overview.md) definitions to audit insecure connections to storage accounts and Redis Cache.

- Audit enabling of only secure connections to your Redis Cache
- Audit secure transfer to storage accounts

## Next steps

Now that you've reviewed the control mapping of the PCI-DSS v3.2.1 blueprint, visit the following
articles to learn about the overview and how to deploy this sample:

> [!div class="nextstepaction"]
> [PCI-DSS v3.2.1 blueprint - Overview](./index.md)
> [PCI-DSS v3.2.1 blueprint - Deploy steps](./deploy.md)

Addition articles about blueprints and how to use them:

- Learn about the [blueprint life-cycle](../../concepts/lifecycle.md).
- Understand how to use [static and dynamic parameters](../../concepts/parameters.md).
- Learn to customize the [blueprint sequencing order](../../concepts/sequencing-order.md).
- Find out how to make use of [blueprint resource locking](../../concepts/resource-locking.md).
- Learn how to [update existing assignments](../../how-to/update-existing-assignments.md).
