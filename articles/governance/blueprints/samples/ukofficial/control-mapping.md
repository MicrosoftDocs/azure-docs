---
title: UK OFFICIAL & UK NHS blueprint sample controls
description: Control mapping of the UK OFFICIAL and UK NHS blueprint samples. Each control is mapped to one or more Azure Policies that assist with assessment.
ms.date: 05/08/2020
ms.topic: sample
---
# Control mapping of the UK OFFICIAL and UK NHS blueprint samples

The following article details how the UK OFFICIAL and UK NHS blueprint samples map to the UK
OFFICIAL and UK NHS controls. For more information about the controls, see [UK OFFICIAL](https://www.gov.uk/government/publications/government-security-classifications).

The following mappings are to the **UK OFFICIAL** and **UK NHS** controls. Use the navigation on the
right to jump directly to a specific control mapping. Many of the mapped controls are implemented
with an [Azure Policy](../../../policy/overview.md) initiative. To review the complete initiative,
open **Policy** in the Azure portal and select the **Definitions** page. Then, find and select the **\[Preview\]
Audit UK OFFICIAL and UK NHS controls and deploy specific VM Extensions to support audit
requirements** built-in policy initiative.

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
> [GitHub Commit History](https://github.com/MicrosoftDocs/azure-docs/commits/master/articles/governance/blueprints/samples/ukofficial/control-mapping.md).

## 1 Data in transit protection

The blueprint helps you ensure information transfer with Azure services is secure by assigning [Azure Policy](../../../policy/overview.md)
definitions that audit insecure connections to storage accounts and Redis Cache.

- Only secure connections to your Redis Cache should be enabled
- Secure transfer to storage accounts should be enabled
- Show audit results from Windows web servers that are not using secure communication protocols
- Deploy prerequisites to audit Windows web servers that are not using secure communication protocols

## 2.3 Data at rest protection

This blueprint helps you enforce your policy on the use of cryptograph controls by assigning [Azure Policy](../../../policy/overview.md)
definitions that enforce specific cryptograph controls and audit use of weak cryptographic settings.
Understanding where your Azure resources may have non-optimal cryptographic configurations can help
you take corrective actions to ensure resources are configured in accordance with your information
security policy. Specifically, the policies assigned by this blueprint require encryption for data
lake storage accounts; require transparent data encryption on SQL databases; audit missing
encryption on storage accounts, SQL databases, virtual machine disks, and automation account
variables; audit insecure connections to storage accounts and Redis Cache; audit weak virtual
machine password encryption; and audit unencrypted Service Fabric communication.

- Disk encryption should be applied on virtual machines
- Automation account variables should be encrypted
- Service Fabric clusters should have the ClusterProtectionLevel property set to EncryptAndSign
- Transparent Data Encryption on SQL databases should be enabled
- Deploy SQL DB transparent data encryption
- Require encryption on Data Lake Store accounts
- Allowed locations (has been hard coded to "UK SOUTH" and "UK WEST")
- Allowed locations for resource groups (has been hard coded to "UK SOUTH" and "UK WEST")

## 5.2 Vulnerability Management

This blueprint helps you manage information system vulnerabilities by assigning [Azure Policy](../../../policy/overview.md)
definitions that monitor missing endpoint protection, missing system updates, operating system
vulnerabilities, SQL vulnerabilities, and virtual machine vulnerabilities. These insights provide
real-time information about the security state of your deployed resources and can help you
prioritize remediation actions.

- Monitor missing Endpoint Protection in Azure Security Center
- System updates should be installed on your machines
- System updates on virtual machine scale sets should be installed
- Vulnerabilities in security configuration on your machines should be remediated
- Vulnerabilities on your SQL databases should be remediated
- Vulnerabilities should be remediated by a Vulnerability Assessment solution
- Vulnerability assessment should be enabled on your SQL servers
- Vulnerability assessment should be enabled on your SQL managed instances
- Vulnerabilities in security configuration on your virtual machine scale sets should be remediated
- Advanced data security should be enabled on your SQL managed instances
- Advanced data security should be enabled on your SQL servers

## 5.3 Protective Monitoring

This blueprint helps you protect information system assets by assigning [Azure Policy](../../../policy/overview.md)
definitions that provide protective monitoring on unrestricted access, allow list activity, and threats.

- Audit unrestricted network access to storage accounts
- Adaptive Application Controls should be enabled on virtual machines
- Audit virtual machines without disaster recovery configured
- DDoS Protection Standard should be enabled
- Advanced Threat Protection types should be set to 'All' in SQL managed instance Advanced Data Security settings
- Advanced Threat Protection types should be set to 'All' in SQL server Advanced Data Security settings
- Deploy Threat Detection on SQL servers
- Deploy default Microsoft IaaSAntimalware extension for Windows Server

## 9 Secure User Management 

Azure implements role-based access control (RBAC) to helps you manage who has access to resources in
Azure. Using the Azure portal, you can review who has access to Azure resources and their
permissions. This blueprint helps you restrict and control access rights by assigning
[Azure Policy](../../../policy/overview.md) definitions to audit external accounts with owner
and/or read/write permissions and accounts with owner, read and/or write permissions that do not have
multi-factor authentication enabled.

- MFA should be enabled on accounts with owner permissions on your subscription
- MFA should be enabled accounts with write permissions on your subscription
- MFA should be enabled on accounts with read permissions on your subscription
- External accounts with owner permissions should be removed from your subscription
- External accounts with write permissions should be removed from your subscription
- External accounts with read permissions should be removed from your subscription

## 10 Identity and Authentication

This blueprint helps you restrict and control access rights by assigning
[Azure Policy](../../../policy/overview.md) definitions to audit external accounts with owner
and/or read/write permissions and accounts with owner, read and/or write permissions that do not have
multi-factor authentication enabled.

- MFA should be enabled on accounts with owner permissions on your subscription
- MFA should be enabled accounts with write permissions on your subscription
- MFA should be enabled on accounts with read permissions on your subscription
- External accounts with owner permissions should be removed from your subscription
- External accounts with write permissions should be removed from your subscription
- External accounts with read permissions should be removed from your subscription

This blueprint assigns Azure Policy definitions to audit use of Azure Active Directory
authentication for SQL servers and Service Fabric. Using Azure Active Directory authentication
enables simplified permission management and centralized identity management of database users and
other Microsoft services.

- An Azure Active Directory administrator should be provisioned for SQL servers
- Service Fabric clusters should only use Azure Active Directory for client authentication

This blueprint also assigns Azure Policy definitions to audit accounts that should be
prioritized for review, including depreciated accounts and external accounts. When needed, accounts can be blocked from signing in (or removed), which immediately removes access rights to Azure resources. This blueprint assigns two Azure Policy definitions to
audit depreciated account that should be considered for removal.

- Deprecated accounts should be removed from your subscription
- Deprecated accounts with owner permissions should be removed from your subscription
- External accounts with owner permissions should be removed from your subscription
- External accounts with write permissions should be removed from your subscription

This blueprint also assigns an Azure Policy definition that audits Linux VM password file
permissions to alert if they're set incorrectly. This design enables you to take corrective action
to ensure authenticators aren't compromised.

- \[Preview\]: Show audit results from Linux VMs that do not have the passwd file permissions set to 0644

This blueprint helps you enforce strong passwords by assigning Azure Policy definitions that
audit Windows VMs that don't enforce minimum strength and other password requirements. Awareness of
VMs in violation of the password strength policy helps you take corrective actions to ensure
passwords for all VM user accounts are compliant with policy.

- \[Preview\]: Deploy prerequisites to audit Windows VMs that do not have the password complexity setting enabled
- \[Preview\]: Deploy prerequisites to audit Windows VMs that do not have a maximum password age of 70 days
- \[Preview\]: Deploy prerequisites to audit Windows VMs that do not have a minimum password age of 1 day
- \[Preview\]: Deploy prerequisites to audit Windows VMs that do not restrict the minimum password length to 14 characters
- \[Preview\]: Deploy prerequisites to audit Windows VMs that allow re-use of the previous 24 passwords
- \[Preview\]: Show audit results from Windows VMs that do not have the password complexity setting enabled
- \[Preview\]: Show audit results from Windows VMs that do not have a maximum password age of 70 days
- \[Preview\]: Show audit results from Windows VMs that do not have a minimum password age of 1 day
- \[Preview\]: Show audit results from Windows VMs that do not restrict the minimum password length to 14 characters
- \[Preview\]: Show audit results from Windows VMs that allow re-use of the previous 24 passwords

This blueprint also helps you control access to Azure resources by assigning Azure Policy
definitions. These policies audit use of resource types and configurations that may allow more
permissive access to resources. Understanding resources that are in violation of these policies can
help you take corrective actions to ensure access Azure resources is restricted to authorized users.

- \[Preview\]: Deploy requirements to audit Linux VMs that have accounts without passwords
- \[Preview\]: Deploy requirements to audit Linux VMs that allow remote connections from accounts without passwords
- \[Preview\]: Show audit results from Linux VMs that have accounts without passwords
- \[Preview\]: Show audit results from Linux VMs that allow remote connections from accounts without passwords
- Storage accounts should be migrated to new Azure Resource Manager resources
- Virtual machines should be migrated to new Azure Resource Manager resources
- Audit VMs that do not use managed disks

## 11 External Interface Protection

Other than using more than 25 policies for appropriate secure user management, this blueprint helps
you protect service interfaces from unauthorized access by assigning an [Azure Policy](../../../policy/overview.md)
definition that monitors unrestricted storage accounts. Storage accounts with unrestricted access
can allow unintended access to information contained within the information system. This blueprint
also assigns a policy that enables adaptive application controls on virtual machines.

- Audit unrestricted network access to storage accounts
- Adaptive Application Controls should be enabled on virtual machines
- Access through Internet facing endpoint should be restricted
- Adaptive Network Hardening recommendations should be applied on internet facing virtual machines
- Endpoint protection solution should be installed on virtual machine scale sets
- Just-In-Time network access control should be applied on virtual machines
- Remote debugging should be turned off for Function App
- Remote debugging should be turned off for Web Application
- Remote debugging should be turned off for API App
- Web Application should only be accessible over HTTPS
- Function App should only be accessible over HTTPS
- API App should only be accessible over HTTPS

## 12 Secure Service Administration

Azure implements role-based access control (RBAC) to helps you manage who has access to resources in
Azure. Using the Azure portal, you can review who has access to Azure resources and their
permissions. This blueprint helps you restrict and control privileged access rights by assigning
five [Azure Policy](../../../policy/overview.md) definitions to audit external accounts with owner
and/or write permissions and accounts with owner, and/or write permissions that do not have
multi-factor authentication enabled.

Systems used for administration of a cloud service will have highly privileged access to that
service. Their compromise would have significant impact, including the means to bypass security
controls and steal or manipulate large volumes of data. The methods used by the service provider's
administrators to manage the operational service should be designed to mitigate any risk of
exploitation that could undermine the security of the service. If this principle isn't implemented,
an attacker may have the means to bypass security controls and steal or manipulate large volumes of
data.

- MFA should be enabled on accounts with owner permissions on your subscription
- MFA should be enabled accounts with write permissions on your subscription
- External accounts with owner permissions should be removed from your subscription
- External accounts with write permissions should be removed from your subscription

This blueprint assigns Azure Policy definitions to audit use of Azure Active Directory
authentication for SQL servers and Service Fabric. Using Azure Active Directory authentication
enables simplified permission management and centralized identity management of database users and
other Microsoft services.

- An Azure Active Directory administrator should be provisioned for SQL servers
- Service Fabric clusters should only use Azure Active Directory for client authentication

This blueprint also assigns Azure Policy definitions to audit accounts that should be
prioritized for review, including depreciated accounts and external accounts with elevated
permissions. When needed, accounts can be blocked from signing in (or removed), which immediately
removes access rights to Azure resources. This blueprint assigns two Azure Policy definitions to
audit depreciated account that should be considered for removal.

- Deprecated accounts should be removed from your subscription
- Deprecated accounts with owner permissions should be removed from your subscription
- External accounts with owner permissions should be removed from your subscription
- External accounts with write permissions should be removed from your subscription

This blueprint also assigns an Azure Policy definition that audits Linux VM password file
permissions to alert if they're set incorrectly. This design enables you to take corrective action
to ensure authenticators aren't compromised.

- \[Preview\]: Show audit results from Linux VMs that do not have the passwd file permissions set to 0644

## 13 Audit Information for Users

This blueprint helps you ensure system events are logged by assigning [Azure Policy](../../../policy/overview.md)
definitions that audit log settings on Azure resources. An assigned policy also audits if virtual
machines aren't sending logs to a specified log analytics workspace.

- Advanced data security should be enabled on your SQL servers
- Audit diagnostic setting
- \[Preview\]: Deploy Log Analytics Agent for Linux VMs
- \[Preview\]: Deploy Log Analytics Agent for Windows VMs
- Deploy network watcher when virtual networks are created

## Next steps

Now that you've reviewed the control mapping of the UK OFFICIAL and UK NHS blueprints, visit the
following articles to learn about the overview and how to deploy this sample:

> [!div class="nextstepaction"]
> [UK OFFICIAL and UK NHS blueprints - Overview](./index.md)
> [UK OFFICIAL and UK NHS blueprints - Deploy steps](./deploy.md)

Additional articles about blueprints and how to use them:

- Learn about the [blueprint lifecycle](../../concepts/lifecycle.md).
- Understand how to use [static and dynamic parameters](../../concepts/parameters.md).
- Learn to customize the [blueprint sequencing order](../../concepts/sequencing-order.md).
- Find out how to make use of [blueprint resource locking](../../concepts/resource-locking.md).
- Learn how to [update existing assignments](../../how-to/update-existing-assignments.md).
