---
title: Regulatory Compliance details for CIS Microsoft Azure Foundations Benchmark 1.1.0 (Azure Government)
description: Details of the CIS Microsoft Azure Foundations Benchmark 1.1.0 (Azure Government) Regulatory Compliance built-in initiative. Each control is mapped to one or more Azure Policy definitions that assist with assessment.
ms.date: 11/06/2023
ms.topic: sample
ms.custom: generated
---
# Details of the CIS Microsoft Azure Foundations Benchmark 1.1.0 (Azure Government) Regulatory Compliance built-in initiative

The following article details how the Azure Policy Regulatory Compliance built-in initiative
definition maps to **compliance domains** and **controls** in CIS Microsoft Azure Foundations Benchmark 1.1.0 (Azure Government).
For more information about this compliance standard, see
[CIS Microsoft Azure Foundations Benchmark 1.1.0](https://www.cisecurity.org/benchmark/azure/). To understand
_Ownership_, see [Azure Policy policy definition](../concepts/definition-structure.md#type) and
[Shared responsibility in the cloud](../../../security/fundamentals/shared-responsibility.md).

The following mappings are to the **CIS Microsoft Azure Foundations Benchmark 1.1.0** controls. Many of the controls
are implemented with an [Azure Policy](../overview.md) initiative definition. To review the complete
initiative definition, open **Policy** in the Azure portal and select the **Definitions** page.
Then, find and select the **CIS Microsoft Azure Foundations Benchmark v1.1.0** Regulatory Compliance built-in
initiative definition.

This built-in initiative is deployed as part of the
[CIS Microsoft Azure Foundations Benchmark 1.1.0 blueprint sample](../../blueprints/samples/cis-azure-1-1-0.md).

> [!IMPORTANT]
> Each control below is associated with one or more [Azure Policy](../overview.md) definitions.
> These policies may help you [assess compliance](../how-to/get-compliance-data.md) with the
> control; however, there often is not a one-to-one or complete match between a control and one or
> more policies. As such, **Compliant** in Azure Policy refers only to the policy definitions
> themselves; this doesn't ensure you're fully compliant with all requirements of a control. In
> addition, the compliance standard includes controls that aren't addressed by any Azure Policy
> definitions at this time. Therefore, compliance in Azure Policy is only a partial view of your
> overall compliance status. The associations between compliance domains, controls, and Azure Policy
> definitions for this compliance standard may change over time. To view the change history, see the
> [GitHub Commit History](https://github.com/Azure/azure-policy/commits/master/built-in-policies/policySetDefinitions/Azure%20Government/Regulatory%20Compliance/CISv1_1_0.json).

## 1 Identity and Access Management

### Ensure that multi-factor authentication is enabled for all privileged users

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 1.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Accounts with owner permissions on Azure resources should be MFA enabled](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe3e008c3-56b9-4133-8fd7-d3347377402a) |Multi-Factor Authentication (MFA) should be enabled for all subscription accounts with owner permissions to prevent a breach of accounts or resources. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Government/Security%20Center/ASC_EnableMFAForAccountsWithOwnerPermissions_Audit.json) |
|[Accounts with write permissions on Azure resources should be MFA enabled](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F931e118d-50a1-4457-a5e4-78550e086c52) |Multi-Factor Authentication (MFA) should be enabled for all subscription accounts with write privileges to prevent a breach of accounts or resources. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Government/Security%20Center/ASC_EnableMFAForAccountsWithWritePermissions_Audit.json) |

### Ensure that multi-factor authentication is enabled for all non-privileged users

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 1.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Accounts with read permissions on Azure resources should be MFA enabled](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F81b3ccb4-e6e8-4e4a-8d05-5df25cd29fd4) |Multi-Factor Authentication (MFA) should be enabled for all subscription accounts with read privileges to prevent a breach of accounts or resources. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Government/Security%20Center/ASC_EnableMFAForAccountsWithReadPermissions_Audit.json) |

### Ensure that there are no guest users

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 1.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Guest accounts with owner permissions on Azure resources should be removed](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F339353f6-2387-4a45-abe4-7f529d121046) |External accounts with owner permissions should be removed from your subscription in order to prevent unmonitored access. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Government/Security%20Center/ASC_RemoveGuestAccountsWithOwnerPermissions_Audit.json) |
|[Guest accounts with read permissions on Azure resources should be removed](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe9ac8f8e-ce22-4355-8f04-99b911d6be52) |External accounts with read privileges should be removed from your subscription in order to prevent unmonitored access. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Government/Security%20Center/ASC_RemoveGuestAccountsWithReadPermissions_Audit.json) |
|[Guest accounts with write permissions on Azure resources should be removed](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F94e1c2ac-cbbe-4cac-a2b5-389c812dee87) |External accounts with write privileges should be removed from your subscription in order to prevent unmonitored access. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Government/Security%20Center/ASC_RemoveGuestAccountsWithWritePermissions_Audit.json) |

## 2 Security Center

### Ensure that standard pricing tier is selected

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 2.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Azure Defender for Azure SQL Database servers should be enabled](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7fe3b40f-802b-4cdd-8bd4-fd799c948cc2) |Azure Defender for SQL provides functionality for surfacing and mitigating potential database vulnerabilities, detecting anomalous activities that could indicate threats to SQL databases, and discovering and classifying sensitive data. |AuditIfNotExists, Disabled |[1.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Government/Security%20Center/ASC_EnableAdvancedDataSecurityOnSqlServers_Audit.json) |
|[Azure Defender for servers should be enabled](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4da35fc9-c9e7-4960-aec9-797fe7d9051d) |Azure Defender for servers provides real-time threat protection for server workloads and generates hardening recommendations as well as alerts about suspicious activities. |AuditIfNotExists, Disabled |[1.0.3](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Government/Security%20Center/ASC_EnableAdvancedThreatProtectionOnVM_Audit.json) |
|[Microsoft Defender for Containers should be enabled](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1c988dd6-ade4-430f-a608-2a3e5b0a6d38) |Microsoft Defender for Containers provides hardening, vulnerability assessment and run-time protections for your Azure, hybrid, and multi-cloud Kubernetes environments. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Government/Security%20Center/ASC_EnableAdvancedThreatProtectionOnContainers_Audit.json) |
|[Microsoft Defender for Storage (Classic) should be enabled](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F308fbb08-4ab8-4e67-9b29-592e93fb94fa) |Microsoft Defender for Storage (Classic) provides detections of unusual and potentially harmful attempts to access or exploit storage accounts. |AuditIfNotExists, Disabled |[1.0.4](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Government/Security%20Center/ASC_EnableAdvancedThreatProtectionOnStorageAccounts_Audit.json) |

### Ensure ASC Default policy setting "Monitor JIT Network Access" is not "Disabled"

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 2.12
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Management ports of virtual machines should be protected with just-in-time network access control](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb0f33259-77d7-4c9e-aac6-3aabcfae693c) |Possible network Just In Time (JIT) access will be monitored by Azure Security Center as recommendations |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Government/Security%20Center/ASC_JITNetworkAccess_Audit.json) |

### Ensure ASC Default policy setting "Monitor Adaptive Application Whitelisting" is not "Disabled"

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 2.13
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Adaptive application controls for defining safe applications should be enabled on your machines](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F47a6b606-51aa-4496-8bb7-64b11cf66adc) |Enable application controls to define the list of known-safe applications running on your machines, and alert you when other applications run. This helps harden your machines against malware. To simplify the process of configuring and maintaining your rules, Security Center uses machine learning to analyze the applications running on each machine and suggest the list of known-safe applications. |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Government/Security%20Center/ASC_AdaptiveApplicationControls_Audit.json) |

### Ensure ASC Default policy setting "Monitor SQL Auditing" is not "Disabled"

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 2.14
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Auditing on SQL server should be enabled](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa6fb4358-5bf4-4ad7-ba82-2cd2f41ce5e9) |Auditing on your SQL Server should be enabled to track database activities across all databases on the server and save them in an audit log. |AuditIfNotExists, Disabled |[2.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/SqlServerAuditing_Audit.json) |

### Ensure ASC Default policy setting "Monitor SQL Encryption" is not "Disabled"

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 2.15
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Transparent Data Encryption on SQL databases should be enabled](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F17k78e20-9358-41c9-923c-fb736d382a12) |Transparent data encryption should be enabled to protect data-at-rest and meet compliance requirements |AuditIfNotExists, Disabled |[2.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/SqlDBEncryption_Audit.json) |

### Ensure that 'Security contact emails' is set

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 2.16
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Subscriptions should have a contact email address for security issues](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4f4f78b8-e367-4b10-a341-d9a4ad5cf1c7) |To ensure the relevant people in your organization are notified when there is a potential security breach in one of your subscriptions, set a security contact to receive email notifications from Security Center. |AuditIfNotExists, Disabled |[1.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Government/Security%20Center/ASC_Security_contact_email.json) |

### Ensure that 'Send email notification for high severity alerts' is set to 'On'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 2.18
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Email notification for high severity alerts should be enabled](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6e2593d9-add6-4083-9c9b-4b7d2188c899) |To ensure the relevant people in your organization are notified when there is a potential security breach in one of your subscriptions, enable email notifications for high severity alerts in Security Center. |AuditIfNotExists, Disabled |[1.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Government/Security%20Center/ASC_Email_notification.json) |

### Ensure that 'Send email also to subscription owners' is set to 'On'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 2.19
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Email notification to subscription owner for high severity alerts should be enabled](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0b15565f-aa9e-48ba-8619-45960f2c314d) |To ensure your subscription owners are notified when there is a potential security breach in their subscription, set email notifications to subscription owners for high severity alerts in Security Center. |AuditIfNotExists, Disabled |[2.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Government/Security%20Center/ASC_Email_notification_to_subscription_owner.json) |

### Ensure that 'Automatic provisioning of monitoring agent' is set to 'On'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 2.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Auto provisioning of the Log Analytics agent should be enabled on your subscription](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F475aae12-b88a-4572-8b36-9b712b2b3a17) |To monitor for security vulnerabilities and threats, Azure Security Center collects data from your Azure virtual machines. Data is collected by the Log Analytics agent, formerly known as the Microsoft Monitoring Agent (MMA), which reads various security-related configurations and event logs from the machine and copies the data to your Log Analytics workspace for analysis. We recommend enabling auto provisioning to automatically deploy the agent to all supported Azure VMs and any new ones that are created. |AuditIfNotExists, Disabled |[1.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Government/Security%20Center/ASC_Automatic_provisioning_log_analytics_monitoring_agent.json) |

### Ensure ASC Default policy setting "Monitor System Updates" is not "Disabled"

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 2.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[System updates should be installed on your machines](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F86b3d65f-7626-441e-b690-81a8b71cff60) |Missing security system updates on your servers will be monitored by Azure Security Center as recommendations |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Government/Security%20Center/ASC_MissingSystemUpdates_Audit.json) |

### Ensure ASC Default policy setting "Monitor OS Vulnerabilities" is not "Disabled"

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 2.4
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Vulnerabilities in security configuration on your machines should be remediated](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe1e5fd5d-3e4c-4ce1-8661-7d1873ae6b15) |Servers which do not satisfy the configured baseline will be monitored by Azure Security Center as recommendations |AuditIfNotExists, Disabled |[3.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Government/Security%20Center/ASC_OSVulnerabilities_Audit.json) |

### Ensure ASC Default policy setting "Monitor Endpoint Protection" is not "Disabled"

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 2.5
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Monitor missing Endpoint Protection in Azure Security Center](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faf6cd1bd-1635-48cb-bde7-5b15693900b9) |Servers without an installed Endpoint Protection agent will be monitored by Azure Security Center as recommendations |AuditIfNotExists, Disabled |[3.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Government/Security%20Center/ASC_MissingEndpointProtection_Audit.json) |

### Ensure ASC Default policy setting "Monitor Disk Encryption" is not "Disabled"

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 2.6
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Virtual machines should encrypt temp disks, caches, and data flows between Compute and Storage resources](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0961003e-5a0a-4549-abde-af6a37f2724d) |By default, a virtual machine's OS and data disks are encrypted-at-rest using platform-managed keys. Temp disks, data caches and data flowing between compute and storage aren't encrypted. Disregard this recommendation if: 1. using encryption-at-host, or 2. server-side encryption on Managed Disks meets your security requirements. Learn more in: Server-side encryption of Azure Disk Storage: [https://aka.ms/disksse,](https://aka.ms/disksse,) Different disk encryption offerings: [https://aka.ms/diskencryptioncomparison](https://aka.ms/diskencryptioncomparison) |AuditIfNotExists, Disabled |[2.0.3](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_UnencryptedVMDisks_Audit.json) |

### Ensure ASC Default policy setting "Enable Next Generation Firewall(NGFW) Monitoring" is not "Disabled"

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 2.9
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Internet-facing virtual machines should be protected with network security groups](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff6de0be7-9a8a-4b8a-b349-43cf02d22f7c) |Protect your virtual machines from potential threats by restricting access to them with network security groups (NSG). Learn more about controlling traffic with NSGs at [https://aka.ms/nsg-doc](https://aka.ms/nsg-doc) |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Government/Security%20Center/ASC_NetworkSecurityGroupsOnInternetFacingVirtualMachines_Audit.json) |
|[Subnets should be associated with a Network Security Group](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe71308d3-144b-4262-b144-efdc3cc90517) |Protect your subnet from potential threats by restricting access to it with a Network Security Group (NSG). NSGs contain a list of Access Control List (ACL) rules that allow or deny network traffic to your subnet. |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Government/Security%20Center/ASC_NetworkSecurityGroupsOnSubnets_Audit.json) |

## 3 Storage Accounts

### Ensure that 'Secure transfer required' is set to 'Enabled'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 3.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Secure transfer to storage accounts should be enabled](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F404c3081-a854-4457-ae30-26a93ef643f9) |Audit requirement of Secure transfer in your storage account. Secure transfer is an option that forces your storage account to accept requests only from secure connections (HTTPS). Use of HTTPS ensures authentication between the server and the service and protects data in transit from network layer attacks such as man-in-the-middle, eavesdropping, and session-hijacking |Audit, Deny, Disabled |[2.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Storage/Storage_AuditForHTTPSEnabled_Audit.json) |

### Ensure default network access rule for Storage Accounts is set to deny

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 3.7
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Storage accounts should restrict network access](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F34c877ad-507e-4c82-993e-3452a6e0ad3c) |Network access to storage accounts should be restricted. Configure network rules so only applications from allowed networks can access the storage account. To allow connections from specific internet or on-premises clients, access can be granted to traffic from specific Azure virtual networks or to public internet IP address ranges |Audit, Deny, Disabled |[1.1.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Storage/Storage_NetworkAcls_Audit.json) |

### Ensure 'Trusted Microsoft Services' is enabled for Storage Account access

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 3.8
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Storage accounts should allow access from trusted Microsoft services](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc9d007d0-c057-4772-b18c-01e546713bcd) |Some Microsoft services that interact with storage accounts operate from networks that can't be granted access through network rules. To help this type of service work as intended, allow the set of trusted Microsoft services to bypass the network rules. These services will then use strong authentication to access the storage account. |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Storage/StorageAccess_TrustedMicrosoftServices_Audit.json) |

## 4 Database Services

### Ensure that 'Auditing' is set to 'On'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Auditing on SQL server should be enabled](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa6fb4358-5bf4-4ad7-ba82-2cd2f41ce5e9) |Auditing on your SQL Server should be enabled to track database activities across all databases on the server and save them in an audit log. |AuditIfNotExists, Disabled |[2.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/SqlServerAuditing_Audit.json) |

### Ensure SQL server's TDE protector is encrypted with BYOK (Use your own key)

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.10
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[SQL managed instances should use customer-managed keys to encrypt data at rest](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fac01ad65-10e5-46df-bdd9-6b0cad13e1d2) |Implementing Transparent Data Encryption (TDE) with your own key provides you with increased transparency and control over the TDE Protector, increased security with an HSM-backed external service, and promotion of separation of duties. This recommendation applies to organizations with a related compliance requirement. |Audit, Deny, Disabled |[2.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/SqlManagedInstance_EnsureServerTDEisEncrypted_Deny.json) |
|[SQL servers should use customer-managed keys to encrypt data at rest](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0a370ff3-6cab-4e85-8995-295fd854c5b8) |Implementing Transparent Data Encryption (TDE) with your own key provides increased transparency and control over the TDE Protector, increased security with an HSM-backed external service, and promotion of separation of duties. This recommendation applies to organizations with a related compliance requirement. |Audit, Deny, Disabled |[2.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/SqlServer_EnsureServerTDEisEncryptedWithYourOwnKey_Deny.json) |

### Ensure 'Enforce SSL connection' is set to 'ENABLED' for MySQL Database Server

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.11
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Enforce SSL connection should be enabled for MySQL database servers](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe802a67a-daf5-4436-9ea6-f6d821dd0c5d) |Azure Database for MySQL supports connecting your Azure Database for MySQL server to client applications using Secure Sockets Layer (SSL). Enforcing SSL connections between your database server and your client applications helps protect against 'man in the middle' attacks by encrypting the data stream between the server and your application. This configuration enforces that SSL is always enabled for accessing your database server. |Audit, Disabled |[1.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/MySQL_EnableSSL_Audit.json) |

### Ensure server parameter 'log_checkpoints' is set to 'ON' for PostgreSQL Database Server

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.12
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Log checkpoints should be enabled for PostgreSQL database servers](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Feb6f77b9-bd53-4e35-a23d-7f65d5f0e43d) |This policy helps audit any PostgreSQL databases in your environment without log_checkpoints setting enabled. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/PostgreSQL_EnableLogCheckpoint_Audit.json) |

### Ensure 'Enforce SSL connection' is set to 'ENABLED' for PostgreSQL Database Server

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.13
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Enforce SSL connection should be enabled for PostgreSQL database servers](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd158790f-bfb0-486c-8631-2dc6b4e8e6af) |Azure Database for PostgreSQL supports connecting your Azure Database for PostgreSQL server to client applications using Secure Sockets Layer (SSL). Enforcing SSL connections between your database server and your client applications helps protect against 'man in the middle' attacks by encrypting the data stream between the server and your application. This configuration enforces that SSL is always enabled for accessing your database server. |Audit, Disabled |[1.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/PostgreSQL_EnableSSL_Audit.json) |

### Ensure server parameter 'log_connections' is set to 'ON' for PostgreSQL Database Server

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.14
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Log connections should be enabled for PostgreSQL database servers](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Feb6f77b9-bd53-4e35-a23d-7f65d5f0e442) |This policy helps audit any PostgreSQL databases in your environment without log_connections setting enabled. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/PostgreSQL_EnableLogConnections_Audit.json) |

### Ensure server parameter 'log_disconnections' is set to 'ON' for PostgreSQL Database Server

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.15
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Disconnections should be logged for PostgreSQL database servers.](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Feb6f77b9-bd53-4e35-a23d-7f65d5f0e446) |This policy helps audit any PostgreSQL databases in your environment without log_disconnections enabled. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/PostgreSQL_EnableLogDisconnections_Audit.json) |

### Ensure server parameter 'connection_throttling' is set to 'ON' for PostgreSQL Database Server

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.17
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Connection throttling should be enabled for PostgreSQL database servers](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F5345bb39-67dc-4960-a1bf-427e16b9a0bd) |This policy helps audit any PostgreSQL databases in your environment without Connection throttling enabled. This setting enables temporary connection throttling per IP for too many invalid password login failures. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/PostgreSQL_ConnectionThrottling_Enabled_Audit.json) |

### Ensure that 'AuditActionGroups' in 'auditing' policy for a SQL server is set properly

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[SQL Auditing settings should have Action-Groups configured to capture critical activities](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7ff426e2-515f-405a-91c8-4f2333442eb5) |The AuditActionsAndGroups property should contain at least SUCCESSFUL_DATABASE_AUTHENTICATION_GROUP, FAILED_DATABASE_AUTHENTICATION_GROUP, BATCH_COMPLETED_GROUP to ensure a thorough audit logging |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/SqlServerAuditing_ActionsAndGroups_Audit.json) |

### Ensure that 'Auditing' Retention is 'greater than 90 days'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[SQL servers with auditing to storage account destination should be configured with 90 days retention or higher](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F89099bee-89e0-4b26-a5f4-165451757743) |For incident investigation purposes, we recommend setting the data retention for your SQL Server' auditing to storage account destination to at least 90 days. Confirm that you are meeting the necessary retention rules for the regions in which you are operating. This is sometimes required for compliance with regulatory standards. |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/SqlServerAuditingRetentionDays_Audit.json) |

### Ensure that 'Advanced Data Security' on a SQL server is set to 'On'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.4
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Azure Defender for SQL should be enabled for unprotected Azure SQL servers](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fabfb4388-5bf4-4ad7-ba82-2cd2f41ceae9) |Audit SQL servers without Advanced Data Security |AuditIfNotExists, Disabled |[2.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/SqlServer_AdvancedDataSecurity_Audit.json) |
|[Azure Defender for SQL should be enabled for unprotected SQL Managed Instances](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fabfb7388-5bf4-4ad7-ba99-2cd2f41cebb9) |Audit each SQL Managed Instance without advanced data security. |AuditIfNotExists, Disabled |[1.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/SqlManagedInstance_AdvancedDataSecurity_Audit.json) |

### Ensure that Azure Active Directory Admin is configured

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.8
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[An Azure Active Directory administrator should be provisioned for SQL servers](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1f314764-cb73-4fc9-b863-8eca98ac36e9) |Audit provisioning of an Azure Active Directory administrator for your SQL server to enable Azure AD authentication. Azure AD authentication enables simplified permission management and centralized identity management of database users and other Microsoft services |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/SQL_DB_AuditServerADAdmins_Audit.json) |

### Ensure that 'Data encryption' is set to 'On' on a SQL Database

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.9
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Transparent Data Encryption on SQL databases should be enabled](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F17k78e20-9358-41c9-923c-fb736d382a12) |Transparent data encryption should be enabled to protect data-at-rest and meet compliance requirements |AuditIfNotExists, Disabled |[2.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/SqlDBEncryption_Audit.json) |

## 5 Logging and Monitoring

### Ensure that a Log Profile exists

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 5.1.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Azure subscriptions should have a log profile for Activity Log](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7796937f-307b-4598-941c-67d3a05ebfe7) |This policy ensures if a log profile is enabled for exporting activity logs. It audits if there is no log profile created to export the logs either to a storage account or to an event hub. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/Logprofile_activityLogs_Audit.json) |

### Ensure that Activity Log Retention is set 365 days or greater

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 5.1.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Activity log should be retained for at least one year](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb02aacc0-b073-424e-8298-42b22829ee0a) |This policy audits the activity log if the retention is not set for 365 days or forever (retention days set to 0). |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/ActivityLogRetention_365orGreater.json) |

### Ensure audit profile captures all the activities

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 5.1.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Azure Monitor log profile should collect logs for categories 'write,' 'delete,' and 'action'](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1a4e592a-6a6e-44a5-9814-e36264ca96e7) |This policy ensures that a log profile collects logs for categories 'write,' 'delete,' and 'action' |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/ActivityLog_CaptureAllCategories.json) |

### Ensure the log profile captures activity logs for all regions including global

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 5.1.4
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Azure Monitor should collect activity logs from all regions](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F41388f1c-2db0-4c25-95b2-35d7f5ccbfa9) |This policy audits the Azure Monitor log profile which does not export activities from all Azure supported regions including global. |AuditIfNotExists, Disabled |[2.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Government/Monitoring/ActivityLog_CaptureAllRegions.json) |

### Ensure the storage account containing the container with activity logs is encrypted with BYOK (Use Your Own Key)

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 5.1.6
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Storage account containing the container with activity logs must be encrypted with BYOK](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ffbb99e8e-e444-4da0-9ff1-75c92f5a85b2) |This policy audits if the Storage account containing the container with activity logs is encrypted with BYOK. The policy works only if the storage account lies on the same subscription as activity logs by design. More information on Azure Storage encryption at rest can be found here [https://aka.ms/azurestoragebyok](https://aka.ms/azurestoragebyok).  |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/ActivityLog_StorageAccountBYOK_Audit.json) |

### Ensure that logging for Azure KeyVault is 'Enabled'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 5.1.7
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Resource logs in Key Vault should be enabled](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fcf820ca0-f99e-4f3e-84fb-66e913812d21) |Audit enabling of resource logs. This enables you to recreate activity trails to use for investigation purposes when a security incident occurs or when your network is compromised |AuditIfNotExists, Disabled |[5.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Key%20Vault/KeyVault_AuditDiagnosticLog_Audit.json) |

### Ensure that Activity Log Alert exists for Create Policy Assignment

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 5.2.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[An activity log alert should exist for specific Policy operations](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc5447c04-a4d7-4ba8-a263-c9ee321a6858) |This policy audits specific Policy operations with no activity log alerts configured. |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/ActivityLog_PolicyOperations_Audit.json) |

### Ensure that Activity Log Alert exists for Create or Update Network Security Group

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 5.2.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[An activity log alert should exist for specific Administrative operations](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb954148f-4c11-4c38-8221-be76711e194a) |This policy audits specific Administrative operations with no activity log alerts configured. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/ActivityLog_AdministrativeOperations_Audit.json) |

### Ensure that Activity Log Alert exists for Delete Network Security Group

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 5.2.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[An activity log alert should exist for specific Administrative operations](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb954148f-4c11-4c38-8221-be76711e194a) |This policy audits specific Administrative operations with no activity log alerts configured. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/ActivityLog_AdministrativeOperations_Audit.json) |

### Ensure that Activity Log Alert exists for Create or Update Network Security Group Rule

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 5.2.4
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[An activity log alert should exist for specific Administrative operations](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb954148f-4c11-4c38-8221-be76711e194a) |This policy audits specific Administrative operations with no activity log alerts configured. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/ActivityLog_AdministrativeOperations_Audit.json) |

### Ensure that activity log alert exists for the Delete Network Security Group Rule

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 5.2.5
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[An activity log alert should exist for specific Administrative operations](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb954148f-4c11-4c38-8221-be76711e194a) |This policy audits specific Administrative operations with no activity log alerts configured. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/ActivityLog_AdministrativeOperations_Audit.json) |

### Ensure that Activity Log Alert exists for Create or Update Security Solution

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 5.2.6
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[An activity log alert should exist for specific Security operations](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3b980d31-7904-4bb7-8575-5665739a8052) |This policy audits specific Security operations with no activity log alerts configured. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/ActivityLog_SecurityOperations_Audit.json) |

### Ensure that Activity Log Alert exists for Delete Security Solution

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 5.2.7
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[An activity log alert should exist for specific Security operations](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3b980d31-7904-4bb7-8575-5665739a8052) |This policy audits specific Security operations with no activity log alerts configured. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/ActivityLog_SecurityOperations_Audit.json) |

### Ensure that Activity Log Alert exists for Create or Update or Delete SQL Server Firewall Rule

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 5.2.8
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[An activity log alert should exist for specific Administrative operations](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb954148f-4c11-4c38-8221-be76711e194a) |This policy audits specific Administrative operations with no activity log alerts configured. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/ActivityLog_AdministrativeOperations_Audit.json) |

### Ensure that Activity Log Alert exists for Update Security Policy

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 5.2.9
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[An activity log alert should exist for specific Security operations](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3b980d31-7904-4bb7-8575-5665739a8052) |This policy audits specific Security operations with no activity log alerts configured. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/ActivityLog_SecurityOperations_Audit.json) |

## 6 Networking

### Ensure that Network Watcher is 'Enabled'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 6.5
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Network Watcher should be enabled](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb6e2945c-0b7b-40f5-9233-7a5323b5cdc6) |Network Watcher is a regional service that enables you to monitor and diagnose conditions at a network scenario level in, to, and from Azure. Scenario level monitoring enables you to diagnose problems at an end to end network level view. It is required to have a network watcher resource group to be created in every region where a virtual network is present. An alert is enabled if a network watcher resource group is not available in a particular region. |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Network/NetworkWatcher_Enabled_Audit.json) |

## 7 Virtual Machines

### Ensure that 'OS disk' are encrypted

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 7.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Virtual machines should encrypt temp disks, caches, and data flows between Compute and Storage resources](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0961003e-5a0a-4549-abde-af6a37f2724d) |By default, a virtual machine's OS and data disks are encrypted-at-rest using platform-managed keys. Temp disks, data caches and data flowing between compute and storage aren't encrypted. Disregard this recommendation if: 1. using encryption-at-host, or 2. server-side encryption on Managed Disks meets your security requirements. Learn more in: Server-side encryption of Azure Disk Storage: [https://aka.ms/disksse,](https://aka.ms/disksse,) Different disk encryption offerings: [https://aka.ms/diskencryptioncomparison](https://aka.ms/diskencryptioncomparison) |AuditIfNotExists, Disabled |[2.0.3](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_UnencryptedVMDisks_Audit.json) |

### Ensure that 'Data disks' are encrypted

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 7.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Virtual machines should encrypt temp disks, caches, and data flows between Compute and Storage resources](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0961003e-5a0a-4549-abde-af6a37f2724d) |By default, a virtual machine's OS and data disks are encrypted-at-rest using platform-managed keys. Temp disks, data caches and data flowing between compute and storage aren't encrypted. Disregard this recommendation if: 1. using encryption-at-host, or 2. server-side encryption on Managed Disks meets your security requirements. Learn more in: Server-side encryption of Azure Disk Storage: [https://aka.ms/disksse,](https://aka.ms/disksse,) Different disk encryption offerings: [https://aka.ms/diskencryptioncomparison](https://aka.ms/diskencryptioncomparison) |AuditIfNotExists, Disabled |[2.0.3](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_UnencryptedVMDisks_Audit.json) |

### Ensure that only approved extensions are installed

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 7.4
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Only approved VM extensions should be installed](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc0e996f8-39cf-4af9-9f45-83fbde810432) |This policy governs the virtual machine extensions that are not approved. |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Compute/VirtualMachines_ApprovedExtensions_Audit.json) |

### Ensure that the latest OS Patches for all Virtual Machines are applied

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 7.5
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[System updates should be installed on your machines](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F86b3d65f-7626-441e-b690-81a8b71cff60) |Missing security system updates on your servers will be monitored by Azure Security Center as recommendations |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Government/Security%20Center/ASC_MissingSystemUpdates_Audit.json) |

### Ensure that the endpoint protection for all Virtual Machines is installed

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 7.6
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Monitor missing Endpoint Protection in Azure Security Center](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faf6cd1bd-1635-48cb-bde7-5b15693900b9) |Servers without an installed Endpoint Protection agent will be monitored by Azure Security Center as recommendations |AuditIfNotExists, Disabled |[3.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Government/Security%20Center/ASC_MissingEndpointProtection_Audit.json) |

## 8 Other Security Considerations

### Ensure the key vault is recoverable

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 8.4
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Key vaults should have deletion protection enabled](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0b60c0b2-2dc2-4e1c-b5c9-abbed971de53) |Malicious deletion of a key vault can lead to permanent data loss. You can prevent permanent data loss by enabling purge protection and soft delete. Purge protection protects you from insider attacks by enforcing a mandatory retention period for soft deleted key vaults. No one inside your organization or Microsoft will be able to purge your key vaults during the soft delete retention period. Keep in mind that key vaults created after September 1st 2019 have soft-delete enabled by default. |Audit, Deny, Disabled |[2.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Key%20Vault/KeyVault_Recoverable_Audit.json) |

### Enable role-based access control (RBAC) within Azure Kubernetes Services

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 8.5
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Azure Role-Based Access Control (RBAC) should be used on Kubernetes Services](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fac4a19c2-fa67-49b4-8ae5-0b2e78c49457) |To provide granular filtering on the actions that users can perform, use Azure Role-Based Access Control (RBAC) to manage permissions in Kubernetes Service Clusters and configure relevant authorization policies. |Audit, Disabled |[1.0.3](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Government/Security%20Center/ASC_EnableRBAC_KubernetesService_Audit.json) |

## 9 AppService

### Ensure App Service Authentication is set on Azure App Service

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 9.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[App Service apps should have authentication enabled](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F95bccee9-a7f8-4bec-9ee9-62c3473701fc) |Azure App Service Authentication is a feature that can prevent anonymous HTTP requests from reaching the web app, or authenticate those that have tokens before they reach the web app. |AuditIfNotExists, Disabled |[2.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/App%20Service/AppService_Authentication_WebApp_Audit.json) |
|[Function apps should have authentication enabled](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc75248c1-ea1d-4a9c-8fc9-29a6aabd5da8) |Azure App Service Authentication is a feature that can prevent anonymous HTTP requests from reaching the Function app, or authenticate those that have tokens before they reach the Function app. |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/App%20Service/AppService_Authentication_functionapp_Audit.json) |

### Ensure that 'HTTP Version' is the latest, if used to run the web app

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 9.10
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[App Service apps should use latest 'HTTP Version'](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8c122334-9d20-4eb8-89ea-ac9a705b74ae) |Periodically, newer versions are released for HTTP either due to security flaws or to include additional functionality. Using the latest HTTP version for web apps to take advantage of security fixes, if any, and/or new functionalities of the newer version. |AuditIfNotExists, Disabled |[4.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/App%20Service/AppService_WebApp_Audit_HTTP_Latest.json) |
|[Function apps should use latest 'HTTP Version'](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe2c1c086-2d84-4019-bff3-c44ccd95113c) |Periodically, newer versions are released for HTTP either due to security flaws or to include additional functionality. Using the latest HTTP version for web apps to take advantage of security fixes, if any, and/or new functionalities of the newer version. |AuditIfNotExists, Disabled |[4.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/App%20Service/AppService_FunctionApp_Audit_HTTP_Latest.json) |

### Ensure web app redirects all HTTP traffic to HTTPS in Azure App Service

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 9.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[App Service apps should only be accessible over HTTPS](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa4af4a39-4135-47fb-b175-47fbdf85311d) |Use of HTTPS ensures server/service authentication and protects data in transit from network layer eavesdropping attacks. |Audit, Disabled, Deny |[4.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/App%20Service/AppServiceWebapp_AuditHTTP_Audit.json) |

### Ensure web app is using the latest version of TLS encryption

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 9.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[App Service apps should use the latest TLS version](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff0e6e85b-9b9f-4a4b-b67b-f730d42f1b0b) |Periodically, newer versions are released for TLS either due to security flaws, include additional functionality, and enhance speed. Upgrade to the latest TLS version for App Service apps to take advantage of security fixes, if any, and/or new functionalities of the latest version. |AuditIfNotExists, Disabled |[2.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/App%20Service/AppService_RequireLatestTls_WebApp_Audit.json) |
|[Function apps should use the latest TLS version](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff9d614c5-c173-4d56-95a7-b4437057d193) |Periodically, newer versions are released for TLS either due to security flaws, include additional functionality, and enhance speed. Upgrade to the latest TLS version for Function apps to take advantage of security fixes, if any, and/or new functionalities of the latest version. |AuditIfNotExists, Disabled |[2.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/App%20Service/AppService_RequireLatestTls_FunctionApp_Audit.json) |

### Ensure the web app has 'Client Certificates (Incoming client certificates)' set to 'On'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 9.4
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[App Service apps should have 'Client Certificates (Incoming client certificates)' enabled](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F5bb220d9-2698-4ee4-8404-b9c30c9df609) |Client certificates allow for the app to request a certificate for incoming requests. Only clients that have a valid certificate will be able to reach the app. |Audit, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/App%20Service/AppService_Webapp_Audit_ClientCert.json) |
|[Function apps should have 'Client Certificates (Incoming client certificates)' enabled](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Feaebaea7-8013-4ceb-9d14-7eb32271373c) |Client certificates allow for the app to request a certificate for incoming requests. Only clients with valid certificates will be able to reach the app. |Audit, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/App%20Service/AppService_FunctionApp_Audit_ClientCert.json) |

### Ensure that Register with Azure Active Directory is enabled on App Service

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 9.5
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[App Service apps should use managed identity](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2b9ad585-36bc-4615-b300-fd4435808332) |Use a managed identity for enhanced authentication security |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/App%20Service/AppService_UseManagedIdentity_WebApp_Audit.json) |
|[Function apps should use managed identity](https://portal.azure.us/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0da106f2-4ca3-48e8-bc85-c638fe6aea8f) |Use a managed identity for enhanced authentication security |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/App%20Service/AppService_UseManagedIdentity_FunctionApp_Audit.json) |

## Next steps

Additional articles about Azure Policy:

- [Regulatory Compliance](../concepts/regulatory-compliance.md) overview.
- See the [initiative definition structure](../concepts/initiative-definition-structure.md).
- Review other examples at [Azure Policy samples](./index.md).
- Review [Understanding policy effects](../concepts/effects.md).
- Learn how to [remediate non-compliant resources](../how-to/remediate-resources.md).
