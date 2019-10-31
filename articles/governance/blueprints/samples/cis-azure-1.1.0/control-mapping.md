---
title: CIS Microsoft Azure Foundations Benchmark blueprint sample - Recommendation mapping
description: Recommendation mapping of the CIS Microsoft Azure Foundations Benchmark blueprint sample to Azure Policy.
author: DCtheGeek
ms.author: dacoulte
ms.date: 10/01/2019
ms.topic: sample
ms.service: blueprints
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
> [GitHub Commit History](https://github.com/MicrosoftDocs/azure-docs/commits/master/articles/governance/blueprints/samples/cis-azure-1.1.0/control-mapping.md).

## 1.1 Ensure that multi-factor authentication is enabled for all privileged users

This blueprint assigns [Azure Policy](../../../policy/overview.md) definitions that help you monitor
when multi-factor authentication isn't enabled on privileged Azure Active Directory accounts.

- MFA should be enabled on accounts with owner permissions on your subscription
- MFA should be enabled on accounts with write permissions on your subscription

## 1.2 Ensure that multi-factor authentication is enabled for all non-privileged users

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that helps you
monitor when multi-factor authentication isn't enabled on non-privileged Azure Active Directory
accounts.

- MFA should be enabled on accounts with read permissions on your subscription

## 1.3 Ensure that there are no guest users

This blueprint assigns [Azure Policy](../../../policy/overview.md) definitions that help you monitor
for guest accounts that may need removed.

- External accounts with owner permissions should be removed from your subscription
- External accounts with read permissions should be removed from your subscription
- External accounts with write permissions should be removed from your subscription

## 2.1 Ensure that standard pricing tier is selected

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that helps you
monitor networks and virtual machines where the Security Center standard tier isn't enabled.

 - Security Center standard pricing tier should be selected

## 2.2 Ensure that 'Automatic provisioning of monitoring agent' is set to 'On'

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that helps you
ensure automatic provisioning of the Log Analytics agent is enabled.

- Automatic provisioning of the Log Analytics monitoring agent should be enabled on your subscription

## 2.3 Ensure ASC Default policy setting "Monitor System Updates" is not "Disabled"

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that helps you
ensure that system updates are installed on virtual machines.

- System updates should be installed on your machines

## 2.4 Ensure ASC Default policy setting "Monitor OS Vulnerabilities" is not "Disabled"

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that helps you
monitor for unremediated virtual machine vulnerabilities.

- Vulnerabilities in security configuration on your machines should be remediated

## 2.5 Ensure ASC Default policy setting "Monitor Endpoint Protection" is not "Disabled"

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that helps you
ensure endpoint protection is enabled on virtual machines.

- Monitor missing Endpoint Protection in Azure Security Center

## 2.6 Ensure ASC Default policy setting "Monitor Disk Encryption" is not "Disabled"

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that helps you
ensure virtual machine disks are encrypted.

- Disk encryption should be applied on virtual machines

## 2.7 Ensure ASC Default policy setting "Monitor Network Security Groups" is not "Disabled"

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that helps you
protect Internet-facing virtual machines.

- Network Security Group Rules for Internet facing virtual machines should be hardened

## 2.8 Ensure ASC Default policy setting "Monitor Web Application Firewall" is not "Disabled"

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that helps you
protect virtual machines running web applications.

- The NSGs rules for web applications on IaaS should be hardened

## 2.9 Ensure ASC Default policy setting "Enable Next Generation Firewall(NGFW) Monitoring" is not "Disabled"

This blueprint assigns [Azure Policy](../../../policy/overview.md) definitions that help protect
subnets and virtual machines from threats by restricting access. The Security Center policy
referenced by this CIS Microsoft Azure Foundations Benchmark recommendation has been replaced by two
new recommendations. The policies referenced below address the new recommendations.

- Subnets should be associated with a Network Security Group
- Virtual machines should be associated with a Network Security Group

## 2.10 Ensure ASC Default policy setting "Monitor Vulnerability Assessment" is not "Disabled"

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that helps you
ensure vulnerabilities are detected and remediated.

- Vulnerabilities should be remediated by a Vulnerability Assessment solution

## 2.11 Ensure ASC Default policy setting "Monitor Storage Blob Encryption" is not "Disabled"

Azure Storage encryption is enabled for all new and existing storage accounts and cannot be
disabled. (This is a default Azure capability; there is no policy assignment.)

## 2.12 Ensure ASC Default policy setting "Monitor JIT Network Access" is not "Disabled"

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that helps you
control access to virtual machines.

- Just-In-Time network access control should be applied on virtual machines

## 2.13 Ensure ASC Default policy setting "Monitor Adaptive Application Whitelisting" is not "Disabled"

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that helps you
ensure Adaptive Application Controls is enabled on virtual machines.

- Adaptive Application Controls should be enabled on virtual machines

## 2.14 Ensure ASC Default policy setting "Monitor SQL Auditing" is not "Disabled"

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that helps ensure
SQL server auditing is enabled.

- Auditing should be enabled on advanced data security settings on SQL Server

## 2.15 Ensure ASC Default policy setting "Monitor SQL Encryption" is not "Disabled"

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that helps you
ensure Transparent Data Encryption is enabled on SQL databases.

- Transparent Data Encryption on SQL databases should be enabled

## 2.16 Ensure that 'Security contact emails' is set

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that helps you
ensure security notifications are properly enabled

- A security contact email address should be provided for your subscription

## 2.17 Ensure that security contact 'Phone number' is set

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that helps you
ensure security notifications are properly enabled

- A security contact phone number should be provided for your subscription

## 2.18 Ensure that 'Send email notification for high severity alerts' is set to 'On'

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that helps you
ensure security notifications are properly enabled

- Email notification for high severity alerts should be enabled

## 2.19 Ensure that 'Send email also to subscription owners' is set to 'On'

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that helps you
ensure security notifications are properly enabled

- Email notification to subscription owner for high severity alerts should be enabled

## 3.1 Ensure that 'Secure transfer required' is set to 'Enabled'

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that helps you
monitor storage accounts that allow insecure connections.

- Secure transfer to storage accounts should be enabled

## 3.7 Ensure default network access rule for Storage Accounts is set to deny

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that helps you
monitor storage accounts that allow unrestricted access.

- Audit unrestricted network access to storage accounts

## 3.8 Ensure 'Trusted Microsoft Services' is enabled for Storage Account access

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that helps you
monitor storage accounts that don't allow access from trusted Microsoft services.

- Storage accounts should allow access from trusted Microsoft services

## 4.1 Ensure that 'Auditing' is set to 'On'

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that helps ensure
SQL server auditing is enabled. 

- Auditing should be enabled on advanced data security settings on SQL Server

## 4.2 Ensure that 'AuditActionGroups' in 'auditing' policy for a SQL server is set properly

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that helps you
ensure SQL server auditing is properly configured.

- SQL Auditing settings should have Action-Groups configured to capture critical activities

## 4.3 Ensure that 'Auditing' Retention is 'greater than 90 days'

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that helps you
ensure SQL server logs are retained for at least 90 days.

- SQL servers should be configured with auditing retention days greater than 90 days.

## 4.4 Ensure that 'Advanced Data Security' on a SQL server is set to 'On'

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that helps you
ensure advanced data security is enabled on SQL servers and SQL managed instances.

- Advanced data security should be enabled on your SQL managed instances
- Advanced data security should be enabled on your SQL servers

## 4.5 Ensure that 'Threat Detection types' is set to 'All'

This blueprint assigns [Azure Policy](../../../policy/overview.md) definitions that help you ensure
advanced threat protection is properly configured on SQL servers and SQL managed instances.

- Advanced Threat Protection types should be set to 'All' in SQL server Advanced Data Security
  settings
- Advanced Threat Protection types should be set to 'All' in SQL managed instance Advanced Data
  Security settings

## 4.6 Ensure that 'Send alerts to' is set

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that helps you
ensure advanced data security notifications are properly enabled.

- Advanced data security settings for SQL managed instance should contain an email address to
  receive security alerts
- Advanced data security settings for SQL server should contain an email address to receive security
  alerts

## 4.7 Ensure that 'Email service and co-administrators' is 'Enabled'

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that helps you
ensure advanced data security notifications are properly enabled.

- Email notifications to admins and subscription owners should be enabled in SQL managed instance
  advanced data security settings
- Email notifications to admins and subscription owners should be enabled in SQL server advanced
  data security settings

## 4.8 Ensure that Azure Active Directory Admin is configured

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that helps you
ensure an Azure Active Directory administrator is provisioned for SQL servers.

- An Azure Active Directory administrator should be provisioned for SQL servers

## 4.9 Ensure that 'Data encryption' is set to 'On' on a SQL Database

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that helps you
ensure Transparent Data Encryption is enabled on SQL databases.

- Transparent Data Encryption on SQL databases should be enabled

## 4.10 Ensure SQL server's TDE protector is encrypted with BYOK (Use your own key)

This blueprint assigns [Azure Policy](../../../policy/overview.md) definitions that help you ensure
the transparent data encrypted protector for SQL servers and SQL managed instances is encrypted with
your own key.

- SQL managed instance TDE protector should be encrypted with your own key
- SQL server TDE protector should be encrypted with your own key

## 4.11 Ensure 'Enforce SSL connection' is set to 'ENABLED' for MySQL Database Server

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that helps you
ensure MySQL database servers enforce SSL connections.

- Enforce SSL connection should be enabled for MySQL database servers

## 4.13 Ensure 'Enforce SSL connection' is set to 'ENABLED' for PostgreSQL Database Server

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that helps you
ensure PostgreSQL database servers enforce SSL connections.

- Enforce SSL connection should be enabled for PostgreSQL database servers

## 4.17 Ensure server parameter 'connection_throttling' is set to 'ON' for PostgreSQL Database Server

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that helps you
mitigate brute force attacks on PostgreSQL database servers.

- Connection throttling should be enabled for PostgreSQL database servers

## 4.19 Ensure that Azure Active Directory Admin is configured

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that helps you
ensure an Azure Active Directory administrator is provisioned for SQL servers. CIS Microsoft Azure
Foundations Benchmark includes this recommendation; however, it is a duplicate of [recommendation
4.8](#48-ensure-that-azure-active-directory-admin-is-configured).

- An Azure Active Directory administrator should be provisioned for SQL servers

## 5.1.1 Ensure that a Log Profile exists

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that helps you
ensure a log profile exists for all Azure subscriptions. 

- Azure subscriptions should have a log profile for Activity Log

## 5.1.2 Ensure that Activity Log Retention is set 365 days or greater

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that helps you
ensure that activity logs are retained for at least one year.

- Activity log should be retained for at least one year

## 5.1.3 Ensure audit profile captures all the activities

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that helps you
ensure that the log profile is properly configured.

- Azure Monitor log profile should collect logs for categories 'write,' 'delete,' and 'action'

## 5.1.4 Ensure the log profile captures activity logs for all regions including global

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that helps you
ensure that the log profile is properly configured.

- Azure Monitor should collect activity logs from all regions

## 5.1.7 Ensure that logging for Azure KeyVault is 'Enabled'

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that helps you
ensure diagnostic logs are enabled for key vaults.

- Diagnostic logs in Key Vault should be enabled

## 6.5 Ensure that Network Watcher is 'Enabled'

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that helps you
ensure Network Watcher is enabled for all regions where resources are deployed. This policy requires
a parameter array that specifies all applicable regions. The default value in this policy initiative
definition is 'eastus'.

- Network Watcher should be enabled

## 7.1 Ensure that 'OS disk' are encrypted

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that helps you
ensure disk encryption is enabled on virtual machines.

- Disk encryption should be applied on virtual machines

## 7.2 Ensure that 'Data disks' are encrypted

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that helps you
ensure disk encryption is enabled on virtual machines.

- Disk encryption should be applied on virtual machines

## 7.3 Ensure that 'Unattached disks' are encrypted

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that helps you
ensure unattached disks are encrypted.

- Unattached disks should be encrypted

## 7.4 Ensure that only approved extensions are installed

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that helps you
ensure that only approved virtual machine extensions are installed. This policy requires
a parameter array that specifies all approved virtual machine extensions. This policy initiative
definition contains suggested defaults that customers should validate. 

 - Only approved VM extensions should be installed

## 7.5 Ensure that the latest OS Patches for all Virtual Machines are applied

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that helps you
ensure that system updates are installed on virtual machines.

- System updates should be installed on your machines

## 7.6 Ensure that the endpoint protection for all Virtual Machines is installed

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that helps you
ensure endpoint protection is enabled on virtual machines.

- Monitor missing Endpoint Protection in Azure Security Center

## 8.4 Ensure the key vault is recoverable

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that helps you
ensure that key vault objects are recoverable in the case of accidental deletion.

- Key Vault objects should be recoverable

## 8.5 Enable role-based access control (RBAC) within Azure Kubernetes Services

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that helps you
ensure role-based access control is used to managed permissions in Kubernetes service clusters

- \[Preview\]: Role-Based Access Control (RBAC) should be used on Kubernetes Services

## 9.2 Ensure web app redirects all HTTP traffic to HTTPS in Azure App Service

This blueprint assigns an [Azure Policy](../../../policy/overview.md) definition that helps you
ensure web applications are accessible only over secure connections.

- Web Application should only be accessible over HTTPS

## Next steps

Now that you've reviewed the control mapping of the CIS Microsoft Azure Foundations Benchmark
blueprint, visit the following article to learn about the blueprint or visit Azure Policy in the
Azure portal to assign the initiative:

> [!div class="nextstepaction"]
> [CIS Microsoft Azure Foundations Benchmark blueprint - Overview](./index.md)
> [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyMenuBlade/Definitions)

Additional articles about blueprints and how to use them:

- Learn about the [blueprint lifecycle](../../concepts/lifecycle.md).
- Understand how to use [static and dynamic parameters](../../concepts/parameters.md).
- Learn to customize the [blueprint sequencing order](../../concepts/sequencing-order.md).
- Find out how to make use of [blueprint resource locking](../../concepts/resource-locking.md).
- Learn how to [update existing assignments](../../how-to/update-existing-assignments.md).