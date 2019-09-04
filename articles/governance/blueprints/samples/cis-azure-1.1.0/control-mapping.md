---
title: Sample - CIS Microsoft Azure Foundations Benchmark blueprint - Recommendation mapping
description: Recommendation mapping of the CIS Microsoft Azure Foundations Benchmark blueprint sample to Azure Policy.
author: DCtheGeek
ms.author: dacoulte
ms.date: 08/09/2019
ms.topic: sample
ms.service: blueprints
manager: carmonm
---
# Recommendation mapping of the CIS Microsoft Azure Foundations Benchmark blueprint sample

The following article details how the Azure Blueprints CIS Microsoft Azure Foundations Benchmark
blueprint sample maps to the CIS Microsoft Azure Foundations Benchmark recommendations. For more
information about the recommendations, see [CIS Microsoft Azure Foundations Benchmark](https://www.cisecurity.org/benchmark/azure/).

The following mappings are to the **CIS Microsoft Azure Foundations Benchmark v1.1.0**
recommendations. Use the navigation on the right to jump directly to a specific recommendation mapping.
Many of the mapped recommendations are implemented with an [Azure Policy](../../../policy/overview.md)
initiative. To review the complete initiative, open **Policy** in the Azure portal and select the
**Definitions** page. Then, find and select the **\[Preview\] Audit CIS Microsoft Azure Foundations
Benchmark v1.1.0 recommendations and deploy specific VM Extensions to support audit requirements** 
built-in policy initiative.

> [!NOTE]
> The full blueprint sample is coming soon. The associated Azure Policy initiative is available now.

## 1.1 Ensure that multi-factor authentication is enabled for all privileged users

This blueprint assigns [Azure Policy](../../../policy/overview.md) definitions that align with
this CIS recommendation.

- MFA should be enabled on accounts with owner permissions on your subscription
- MFA should be enabled on accounts with write permissions on your subscription

## 1.2 Ensure that multi-factor authentication is enabled for all non-privileged users

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that aligns with
this CIS recommendation.

- MFA should be enabled on accounts with read permissions on your subscription

## 1.3 Ensure that there are no guest users

This blueprint assigns [Azure Policy](../../../policy/overview.md) definitions that align with
this CIS recommendation.

- External accounts with owner permissions should be removed from your subscription
- External accounts with read permissions should be removed from your subscription
- External accounts with write permissions should be removed from your subscription

## 2.3 Ensure ASC Default policy setting "Monitor System Updates" is not "Disabled"

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that aligns with
this CIS recommendation.

- System updates should be installed on your machines

## 2.4 Ensure ASC Default policy setting "Monitor OS Vulnerabilities" is not "Disabled"

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that aligns with
this CIS recommendation.

- Vulnerabilities in security configuration on your machines should be remediated

## 2.5 Ensure ASC Default policy setting "Monitor Endpoint Protection" is not "Disabled"

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that aligns with
this CIS recommendation.

- Monitor missing Endpoint Protection in Azure Security Center

## 2.6 Ensure ASC Default policy setting "Monitor Disk Encryption" is not "Disabled"

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that aligns with
this CIS recommendation.

- Disk encryption should be applied on virtual machines

## 2.8 Ensure ASC Default policy setting "Monitor Web Application Firewall" is not "Disabled"

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that aligns with
this CIS recommendation.

- The NSGs rules for web applications on IaaS should be hardened

## 2.10 Ensure ASC Default policy setting "Monitor Vulnerability Assessment" is not "Disabled"

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that aligns with
this CIS recommendation.

- Vulnerabilities should be remediated by a Vulnerability Assessment solution

## 2.12 Ensure ASC Default policy setting "Monitor JIT Network Access" is not "Disabled"

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that aligns with
this CIS recommendation.

- Just-In-Time network access control should be applied on virtual machines

## 2.15 Ensure ASC Default policy setting "Monitor SQL Encryption" is not "Disabled"

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that aligns with
this CIS recommendation.

- Transparent Data Encryption on SQL databases should be enabled

## 3.1 Ensure that 'Secure transfer required' is set to 'Enabled'

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that aligns with
this CIS recommendation.

- Secure transfer to storage accounts should be enabled

## 3.7 Ensure default network access rule for Storage Accounts is set to deny

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that aligns with
this CIS recommendation.

- Audit unrestricted network access to storage accounts

## 4.1 Ensure that 'Auditing' is set to 'On'

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that aligns with
this CIS recommendation.

- Auditing should be enabled on advanced data security settings on SQL Server

## 4.2 Ensure that 'AuditActionGroups' in 'auditing' policy for a SQL server is set properly

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that aligns with
this CIS recommendation.

- SQL Auditing settings should have Action-Groups configured to capture critical activities

## 4.3 Ensure that 'Auditing' Retention is 'greater than 90 days'

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that aligns with
this CIS recommendation.

- SQL servers should be configured with auditing retention days greater than 90 days.

## 4.4 Ensure that 'Advanced Data Security' on a SQL server is set to 'On'

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that aligns with
this CIS recommendation.

- Advanced data security should be enabled on your SQL servers

## 4.5 Ensure that 'Threat Detection types' is set to 'All'

This blueprint assigns [Azure Policy](../../../policy/overview.md) definitions that align with
this CIS recommendation.

- Advanced Threat Protection types should be set to 'All' in SQL server Advanced Data Security settings
- Advanced Threat Protection types should be set to 'All' in SQL managed instance Advanced Data Security settings

## 4.6 Ensure that 'Send alerts to' is set

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that aligns with
this CIS recommendation.

- Advanced data security settings for SQL server should contain an email address to receive security alerts

## 4.7 Ensure that 'Email service and co-administrators' is 'Enabled'

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that aligns with
this CIS recommendation.

- Advanced data security settings for SQL managed instance should contain an email address to receive security alerts

## 4.8 Ensure that Azure Active Directory Admin is configured

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that aligns with
this CIS recommendation.

- An Azure Active Directory administrator should be provisioned for SQL servers

## 4.9 Ensure that 'Data encryption' is set to 'On' on a SQL Database

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that aligns with
this CIS recommendation.

- Transparent Data Encryption on SQL databases should be enabled

## 4.10 Ensure SQL server's TDE protector is encrypted with BYOK (Use your own key)

This blueprint assigns [Azure Policy](../../../policy/overview.md) definitions that align with
this CIS recommendation.

- SQL server TDE protector should be encrypted with your own key
- SQL managed instance TDE protector should be encrypted with your own key

## 5.1.7 Ensure that logging for Azure KeyVault is 'Enabled'

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that aligns with
this CIS recommendation.

- Diagnostic logs in Key Vault should be enabled

## 7.1 Ensure that 'OS disk' are encrypted

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that aligns with
this CIS recommendation.

- Disk encryption should be applied on virtual machines

## 7.2 Ensure that 'Data disks' are encrypted

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that aligns with
this CIS recommendation.

- Disk encryption should be applied on virtual machines

## 7.5 Ensure that the latest OS Patches for all Virtual Machines are applied

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that aligns with
this CIS recommendation.

- System updates should be installed on your machines

## 7.6 Ensure that the endpoint protection for all Virtual Machines is installed

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that aligns with
this CIS recommendation.

- Monitor missing Endpoint Protection in Azure Security Center

## 8.5 Enable role-based access control (RBAC) within Azure Kubernetes Services

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that aligns with
this CIS recommendation.

- \[Preview\]: Role-Based Access Control (RBAC) should be used on Kubernetes Services

## 9.2 Ensure web app redirects all HTTP traffic to HTTPS in Azure App Service

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that aligns with
this CIS recommendation.

- Web Application should only be accessible over HTTPS

## Next steps

Now that you've reviewed the control mapping of the CIS Microsoft Azure Foundations Benchmark
blueprint, visit the following article to learn about the blueprint or visit Azure Policy in the
Azure portal to assign the initiative:

> [!div class="nextstepaction"]
> [CIS Microsoft Azure Foundations Benchmark blueprint - Overview](./index.md)
> [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyMenuBlade/Definitions)

Addition articles about blueprints and how to use them:

- Learn about the [blueprint lifecycle](../../concepts/lifecycle.md).
- Understand how to use [static and dynamic parameters](../../concepts/parameters.md).
- Learn to customize the [blueprint sequencing order](../../concepts/sequencing-order.md).
- Find out how to make use of [blueprint resource locking](../../concepts/resource-locking.md).
- Learn how to [update existing assignments](../../how-to/update-existing-assignments.md).