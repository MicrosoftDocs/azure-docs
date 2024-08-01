---
title: Alerts for Resource Manager
description: This article lists the security alerts for Resource Manager visible in Microsoft Defender for Cloud.
ms.topic: reference
ms.custom: linux-related-content
ms.date: 06/03/2024
ai-usage: ai-assisted
---

# Alerts for Resource Manager

This article lists the security alerts you might get for Resource Manager from Microsoft Defender for Cloud and any Microsoft Defender plans you enabled. The alerts shown in your environment depend on the resources and services you're protecting, and your customized configuration.  

> [!NOTE]
> Some of the recently added alerts powered by Microsoft Defender Threat Intelligence and Microsoft Defender for Endpoint might be undocumented.

[Learn how to respond to these alerts](managing-and-responding-alerts.yml).

[Learn how to export alerts](continuous-export.md).

> [!NOTE]
> Alerts from different sources might take different amounts of time to appear. For example, alerts that require analysis of network traffic might take longer to appear than alerts related to suspicious processes running on virtual machines.

## Resource Manager alerts

> [!NOTE]
> Alerts with a **delegated access** indication are triggered due to activity of third-party service providers. learn more about [service providers activity indications](defender-for-resource-manager-usage.md).

[Further details and notes](defender-for-resource-manager-introduction.md)

### **Azure Resource Manager operation from suspicious IP address**

(ARM_OperationFromSuspiciousIP)

**Description**: Microsoft Defender for Resource Manager detected an operation from an IP address that has been marked as suspicious in threat intelligence feeds.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Execution

**Severity**: Medium

### **Azure Resource Manager operation from suspicious proxy IP address**

(ARM_OperationFromSuspiciousProxyIP)

**Description**: Microsoft Defender for Resource Manager detected a resource management operation from an IP address that is associated with proxy services, such as TOR. While this behavior can be legitimate, it's often seen in malicious activities, when threat actors try to hide their source IP.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Defense Evasion

**Severity**: Medium

### **MicroBurst exploitation toolkit used to enumerate resources in your subscriptions**

(ARM_MicroBurst.AzDomainInfo)

**Description**: A PowerShell script was run in your subscription and performed suspicious pattern of executing an information gathering operations to discover resources, permissions, and network structures. Threat actors use automated scripts, like MicroBurst, to gather information for malicious activities. This was detected by analyzing Azure Resource Manager operations in your subscription. This operation might indicate that an identity in your organization was breached, and that the threat actor is trying to compromise your environment for malicious intentions.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Low

### **MicroBurst exploitation toolkit used to enumerate resources in your subscriptions**

(ARM_MicroBurst.AzureDomainInfo)

**Description**: A PowerShell script was run in your subscription and performed suspicious pattern of executing an information gathering operations to discover resources, permissions, and network structures. Threat actors use automated scripts, like MicroBurst, to gather information for malicious activities. This was detected by analyzing Azure Resource Manager operations in your subscription.  This operation might indicate that an identity in your organization was breached, and that the threat actor is trying to compromise your environment for malicious intentions.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Low

### **MicroBurst exploitation toolkit used to execute code on your virtual machine**

(ARM_MicroBurst.AzVMBulkCMD)

**Description**: A PowerShell script was run in your subscription and performed a suspicious pattern of executing code on a VM or a list of VMs. Threat actors use automated scripts, like MicroBurst, to run a script on a VM for malicious activities. This was detected by analyzing Azure Resource Manager operations in your subscription. This operation might indicate that an identity in your organization was breached, and that the threat actor is trying to compromise your environment for malicious intentions.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Execution

**Severity**: High

### **MicroBurst exploitation toolkit used to execute code on your virtual machine**

(RM_MicroBurst.AzureRmVMBulkCMD)

**Description**: MicroBurst's exploitation toolkit was used to execute code on your virtual machines. This was detected by analyzing Azure Resource Manager operations in your subscription.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: High

### **MicroBurst exploitation toolkit used to extract keys from your Azure key vaults**

(ARM_MicroBurst.AzKeyVaultKeysREST)

**Description**: A PowerShell script was run in your subscription and performed a suspicious pattern of extracting keys from an Azure Key Vault(s). Threat actors use automated scripts, like MicroBurst, to list keys and use them to access sensitive data or perform lateral movement. This was detected by analyzing Azure Resource Manager operations in your subscription. This operation might indicate that an identity in your organization was breached, and that the threat actor is trying to compromise your environment for malicious intentions.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: High

### **MicroBurst exploitation toolkit used to extract keys to your storage accounts**

(ARM_MicroBurst.AZStorageKeysREST)

**Description**: A PowerShell script was run in your subscription and performed a suspicious pattern of extracting keys to Storage Account(s). Threat actors use automated scripts, like MicroBurst, to list keys and use them to access sensitive data in your Storage Account(s). This was detected by analyzing Azure Resource Manager operations in your subscription. This operation might indicate that an identity in your organization was breached, and that the threat actor is trying to compromise your environment for malicious intentions.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Collection

**Severity**: High

### **MicroBurst exploitation toolkit used to extract secrets from your Azure key vaults**

(ARM_MicroBurst.AzKeyVaultSecretsREST)

**Description**: A PowerShell script was run in your subscription and performed a suspicious pattern of extracting secrets from an Azure Key Vault(s). Threat actors use automated scripts, like MicroBurst, to list secrets and use them to access sensitive data or perform lateral movement. This was detected by analyzing Azure Resource Manager operations in your subscription. This operation might indicate that an identity in your organization was breached, and that the threat actor is trying to compromise your environment for malicious intentions.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: High

### **PowerZure exploitation toolkit used to elevate access from Azure AD to Azure**

(ARM_PowerZure.AzureElevatedPrivileges)

**Description**: PowerZure exploitation toolkit was used to elevate access from AzureAD to Azure. This was detected by analyzing Azure Resource Manager operations in your tenant.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: High

### **PowerZure exploitation toolkit used to enumerate resources**

(ARM_PowerZure.GetAzureTargets)

**Description**: PowerZure exploitation toolkit was used to enumerate resources on behalf of a legitimate user account in your organization. This was detected by analyzing Azure Resource Manager operations in your subscription.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Collection

**Severity**: High

### **PowerZure exploitation toolkit used to enumerate storage containers, shares, and tables**

(ARM_PowerZure.ShowStorageContent)

**Description**: PowerZure exploitation toolkit was used to enumerate storage shares, tables, and containers. This was detected by analyzing Azure Resource Manager operations in your subscription.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: High

### **PowerZure exploitation toolkit used to execute a Runbook in your subscription**

(ARM_PowerZure.StartRunbook)

**Description**: PowerZure exploitation toolkit was used to execute a Runbook. This was detected by analyzing Azure Resource Manager operations in your subscription.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: High

### **PowerZure exploitation toolkit used to extract Runbooks content**

(ARM_PowerZure.AzureRunbookContent)

**Description**: PowerZure exploitation toolkit was used to extract Runbook content. This was detected by analyzing Azure Resource Manager operations in your subscription.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Collection

**Severity**: High

### **PREVIEW - Azurite toolkit run detected**

(ARM_Azurite)

**Description**: A known cloud-environment reconnaissance toolkit run has been detected in your environment. The tool [Azurite](https://github.com/mwrlabs/Azurite) can be used by an attacker (or penetration tester) to map your subscriptions' resources and identify insecure configurations.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Collection

**Severity**: High

### **PREVIEW - Suspicious creation of compute resources detected**

(ARM_SuspiciousComputeCreation)

**Description**: Microsoft Defender for Resource Manager identified a suspicious creation of compute resources in your subscription utilizing Virtual Machines/Azure Scale Set. The identified operations are designed to allow administrators to efficiently manage their environments by deploying new resources when needed. While this activity might be legitimate, a threat actor might utilize such operations to conduct crypto mining.
 The activity is deemed suspicious as the compute resources scale is higher than previously observed in the subscription.
 This can indicate that the principal is compromised and is being used with malicious intent.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Impact

**Severity**: Medium

### **PREVIEW - Suspicious key vault recovery detected**

(Arm_Suspicious_Vault_Recovering)

**Description**: Microsoft Defender for Resource Manager detected a suspicious recovery operation for a soft-deleted key vault resource.
 The user recovering the resource is different from the user that deleted it. This is highly suspicious because the user rarely invokes such an operation. In addition, the user logged on without multifactor authentication (MFA).
 This might indicate that the user is compromised and is attempting to discover secrets and keys to gain access to sensitive resources, or to perform lateral movement across your network.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Lateral movement

**Severity**: Medium/high

### **PREVIEW - Suspicious management session using an inactive account detected**

(ARM_UnusedAccountPersistence)

**Description**: Subscription activity logs analysis has detected suspicious behavior. A principal not in use for a long period of time is now performing actions that can secure persistence for an attacker.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Persistence

**Severity**: Medium

### **PREVIEW - Suspicious invocation of a high-risk 'Credential Access' operation by a service principal detected**

(ARM_AnomalousServiceOperation.CredentialAccess)

**Description**: Microsoft Defender for Resource Manager identified a suspicious invocation of a high-risk operation in your subscription, which might indicate an attempt to access credentials. The identified operations are designed to allow administrators to efficiently manage their environments. While this activity might be legitimate, a threat actor might utilize such operations to access restricted credentials and compromise resources in your environment. This can indicate that the service principal is compromised and is being used with malicious intent.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Credential access

**Severity**: Medium

### **PREVIEW - Suspicious invocation of a high-risk 'Data Collection' operation by a service principal detected**

(ARM_AnomalousServiceOperation.Collection)

**Description**: Microsoft Defender for Resource Manager identified a suspicious invocation of a high-risk operation in your subscription, which might indicate an attempt to collect data. The identified operations are designed to allow administrators to efficiently manage their environments. While this activity might be legitimate, a threat actor might utilize such operations to collect sensitive data on resources in your environment. This can indicate that the service principal is compromised and is being used with malicious intent.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Collection

**Severity**: Medium

### **PREVIEW - Suspicious invocation of a high-risk 'Defense Evasion' operation by a service principal detected**

(ARM_AnomalousServiceOperation.DefenseEvasion)

**Description**: Microsoft Defender for Resource Manager identified a suspicious invocation of a high-risk operation in your subscription, which might indicate an attempt to evade defenses. The identified operations are designed to allow administrators to efficiently manage the security posture of their environments. While this activity might be legitimate, a threat actor might utilize such operations to avoid being detected while compromising resources in your environment. This can indicate that the service principal is compromised and is being used with malicious intent.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Defense Evasion

**Severity**: Medium

### **PREVIEW - Suspicious invocation of a high-risk 'Execution' operation by a service principal detected**

(ARM_AnomalousServiceOperation.Execution)

**Description**: Microsoft Defender for Resource Manager identified a suspicious invocation of a high-risk operation on a machine in your subscription, which might indicate an attempt to execute code. The identified operations are designed to allow administrators to efficiently manage their environments. While this activity might be legitimate, a threat actor might utilize such operations to access restricted credentials and compromise resources in your environment. This can indicate that the service principal is compromised and is being used with malicious intent.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Defense Execution

**Severity**: Medium

### **PREVIEW - Suspicious invocation of a high-risk 'Impact' operation by a service principal detected**

(ARM_AnomalousServiceOperation.Impact)

**Description**: Microsoft Defender for Resource Manager identified a suspicious invocation of a high-risk operation in your subscription, which might indicate an attempted configuration change. The identified operations are designed to allow administrators to efficiently manage their environments. While this activity might be legitimate, a threat actor might utilize such operations to access restricted credentials and compromise resources in your environment. This can indicate that the service principal is compromised and is being used with malicious intent.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Impact

**Severity**: Medium

### **PREVIEW - Suspicious invocation of a high-risk 'Initial Access' operation by a service principal detected**

(ARM_AnomalousServiceOperation.InitialAccess)

**Description**: Microsoft Defender for Resource Manager identified a suspicious invocation of a high-risk operation in your subscription, which might indicate an attempt to access restricted resources. The identified operations are designed to allow administrators to efficiently access their environments. While this activity might be legitimate, a threat actor might utilize such operations to gain initial access to restricted resources in your environment. This can indicate that the service principal is compromised and is being used with malicious intent.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Initial access

**Severity**: Medium

### **PREVIEW - Suspicious invocation of a high-risk 'Lateral Movement Access' operation by a service principal detected**

(ARM_AnomalousServiceOperation.LateralMovement)

**Description**: Microsoft Defender for Resource Manager identified a suspicious invocation of a high-risk operation in your subscription, which might indicate an attempt to perform lateral movement. The identified operations are designed to allow administrators to efficiently manage their environments. While this activity might be legitimate, a threat actor might utilize such operations to compromise more resources in your environment. This can indicate that the service principal is compromised and is being used with malicious intent.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Lateral movement

**Severity**: Medium

### **PREVIEW - Suspicious invocation of a high-risk 'persistence' operation by a service principal detected**

(ARM_AnomalousServiceOperation.Persistence)

**Description**: Microsoft Defender for Resource Manager identified a suspicious invocation of a high-risk operation in your subscription, which might indicate an attempt to establish persistence. The identified operations are designed to allow administrators to efficiently manage their environments. While this activity might be legitimate, a threat actor might utilize such operations to establish persistence in your environment. This can indicate that the service principal is compromised and is being used with malicious intent.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Persistence

**Severity**: Medium

### **PREVIEW - Suspicious invocation of a high-risk 'Privilege Escalation' operation by a service principal detected**

(ARM_AnomalousServiceOperation.PrivilegeEscalation)

**Description**: Microsoft Defender for Resource Manager identified a suspicious invocation of a high-risk operation in your subscription, which might indicate an attempt to escalate privileges. The identified operations are designed to allow administrators to efficiently manage their environments. While this activity might be legitimate, a threat actor might utilize such operations to escalate privileges while compromising resources in your environment. This can indicate that the service principal is compromised and is being used with malicious intent.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Privilege escalation

**Severity**: Medium

### **PREVIEW - Suspicious management session using an inactive account detected**

(ARM_UnusedAccountPersistence)

**Description**: Subscription activity logs analysis has detected suspicious behavior. A principal not in use for a long period of time is now performing actions that can secure persistence for an attacker.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Persistence

**Severity**: Medium

### **PREVIEW - Suspicious management session using PowerShell detected**

(ARM_UnusedAppPowershellPersistence)

**Description**: Subscription activity logs analysis has detected suspicious behavior. A principal that doesn't regularly use PowerShell to manage the subscription environment is now using PowerShell, and performing actions that can secure persistence for an attacker.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Persistence

**Severity**: Medium

### **PREVIEW â€“ Suspicious management session using Azure portal detected**

(ARM_UnusedAppIbizaPersistence)

**Description**: Analysis of your subscription activity logs has detected a suspicious behavior. A principal that doesn't regularly use the Azure portal (Ibiza) to manage the subscription environment (hasn't used Azure portal to manage for the last 45 days, or a subscription that it is actively managing), is now using the Azure portal and performing actions that can secure persistence for an attacker.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Persistence

**Severity**: Medium

### **Privileged custom role created for your subscription in a suspicious way (Preview)**

(ARM_PrivilegedRoleDefinitionCreation)

**Description**: Microsoft Defender for Resource Manager detected a suspicious creation of privileged custom role definition in your subscription. This operation might have been performed by a legitimate user in your organization. Alternatively, it might indicate that an account in your organization was breached, and that the threat actor is trying to create a privileged role to use in the future to evade detection.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Privilege Escalation, Defense Evasion

**Severity**: Informational

### **Suspicious Azure role assignment detected (Preview)**

(ARM_AnomalousRBACRoleAssignment)

**Description**: Microsoft Defender for Resource Manager identified a suspicious Azure role assignment / performed using PIM (Privileged Identity Management) in your tenant, which might indicate that an account in your organization was compromised. The identified operations are designed to allow administrators to grant principals access to Azure resources. While this activity might be legitimate, a threat actor might utilize role assignment to escalate their permissions allowing them to advance their attack.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Lateral Movement, Defense Evasion

**Severity**: Low (PIM) / High

### **Suspicious invocation of a high-risk 'Credential Access' operation detected (Preview)**

(ARM_AnomalousOperation.CredentialAccess)

**Description**: Microsoft Defender for Resource Manager identified a suspicious invocation of a high-risk operation in your subscription, which might indicate an attempt to access credentials. The identified operations are designed to allow administrators to efficiently access their environments. While this activity might be legitimate, a threat actor might utilize such operations to access restricted credentials and compromise resources in your environment. This can indicate that the account is compromised and is being used with malicious intent.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Credential Access

**Severity**: Medium

### **Suspicious invocation of a high-risk 'Data Collection' operation detected (Preview)**

(ARM_AnomalousOperation.Collection)

**Description**: Microsoft Defender for Resource Manager identified a suspicious invocation of a high-risk operation in your subscription, which might indicate an attempt to collect data. The identified operations are designed to allow administrators to efficiently manage their environments. While this activity might be legitimate, a threat actor might utilize such operations to collect sensitive data on resources in your environment. This can indicate that the account is compromised and is being used with malicious intent.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Collection

**Severity**: Medium

### **Suspicious invocation of a high-risk 'Defense Evasion' operation detected (Preview)**

(ARM_AnomalousOperation.DefenseEvasion)

**Description**: Microsoft Defender for Resource Manager identified a suspicious invocation of a high-risk operation in your subscription, which might indicate an attempt to evade defenses. The identified operations are designed to allow administrators to efficiently manage the security posture of their environments. While this activity might be legitimate, a threat actor might utilize such operations to avoid being detected while compromising resources in your environment. This can indicate that the account is compromised and is being used with malicious intent.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Defense Evasion

**Severity**: Medium

### **Suspicious invocation of a high-risk 'Execution' operation detected (Preview)**

(ARM_AnomalousOperation.Execution)

**Description**: Microsoft Defender for Resource Manager identified a suspicious invocation of a high-risk operation on a machine in your subscription, which might indicate an attempt to execute code. The identified operations are designed to allow administrators to efficiently manage their environments. While this activity might be legitimate, a threat actor might utilize such operations to access restricted credentials and compromise resources in your environment. This can indicate that the account is compromised and is being used with malicious intent.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Execution

**Severity**: Medium

### **Suspicious invocation of a high-risk 'Impact' operation detected (Preview)**

(ARM_AnomalousOperation.Impact)

**Description**: Microsoft Defender for Resource Manager identified a suspicious invocation of a high-risk operation in your subscription, which might indicate an attempted configuration change. The identified operations are designed to allow administrators to efficiently manage their environments. While this activity might be legitimate, a threat actor might utilize such operations to access restricted credentials and compromise resources in your environment. This can indicate that the account is compromised and is being used with malicious intent.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Impact

**Severity**: Medium

### **Suspicious invocation of a high-risk 'Initial Access' operation detected (Preview)**

(ARM_AnomalousOperation.InitialAccess)

**Description**: Microsoft Defender for Resource Manager identified a suspicious invocation of a high-risk operation in your subscription, which might indicate an attempt to access restricted resources. The identified operations are designed to allow administrators to efficiently access their environments. While this activity might be legitimate, a threat actor might utilize such operations to gain initial access to restricted resources in your environment. This can indicate that the account is compromised and is being used with malicious intent.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Initial Access

**Severity**: Medium

### **Suspicious invocation of a high-risk 'Lateral Movement' operation detected (Preview)**

(ARM_AnomalousOperation.LateralMovement)

**Description**: Microsoft Defender for Resource Manager identified a suspicious invocation of a high-risk operation in your subscription, which might indicate an attempt to perform lateral movement. The identified operations are designed to allow administrators to efficiently manage their environments. While this activity might be legitimate, a threat actor might utilize such operations to compromise more resources in your environment. This can indicate that the account is compromised and is being used with malicious intent.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Lateral Movement

**Severity**: Medium

### **Suspicious elevate access operation (Preview)**(ARM_AnomalousElevateAccess)

**Description**: Microsoft Defender for Resource Manager identified a suspicious "Elevate Access" operation. The activity is deemed suspicious, as this principal rarely invokes such operations. While this activity might be legitimate, a threat actor might utilize an "Elevate Access" operation to perform privilege escalation for a compromised user.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Privilege Escalation

**Severity**: Medium

### **Suspicious invocation of a high-risk 'Persistence' operation detected (Preview)**

(ARM_AnomalousOperation.Persistence)

**Description**: Microsoft Defender for Resource Manager identified a suspicious invocation of a high-risk operation in your subscription, which might indicate an attempt to establish persistence. The identified operations are designed to allow administrators to efficiently manage their environments. While this activity might be legitimate, a threat actor might utilize such operations to establish persistence in your environment. This can indicate that the account is compromised and is being used with malicious intent.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Persistence

**Severity**: Medium

### **Suspicious invocation of a high-risk 'Privilege Escalation' operation detected (Preview)**

(ARM_AnomalousOperation.PrivilegeEscalation)

**Description**: Microsoft Defender for Resource Manager identified a suspicious invocation of a high-risk operation in your subscription, which might indicate an attempt to escalate privileges. The identified operations are designed to allow administrators to efficiently manage their environments. While this activity might be legitimate, a threat actor might utilize such operations to escalate privileges while compromising resources in your environment. This can indicate that the account is compromised and is being used with malicious intent.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Privilege Escalation

**Severity**: Medium

### **Usage of MicroBurst exploitation toolkit to run an arbitrary code or exfiltrate Azure Automation account credentials**

(ARM_MicroBurst.RunCodeOnBehalf)

**Description**: A PowerShell script was run in your subscription and performed a suspicious pattern of executing an arbitrary code or exfiltrate Azure Automation account credentials. Threat actors use automated scripts, like MicroBurst, to run arbitrary code for malicious activities. This was detected by analyzing Azure Resource Manager operations in your subscription. This operation might indicate that an identity in your organization was breached, and that the threat actor is trying to compromise your environment for malicious intentions.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Persistence, Credential Access

**Severity**: High

### **Usage of NetSPI techniques to maintain persistence in your Azure environment**

(ARM_NetSPI.MaintainPersistence)

**Description**: Usage of NetSPI persistence technique to create a webhook backdoor and maintain persistence in your Azure environment. This was detected by analyzing Azure Resource Manager operations in your subscription.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: High

### **Usage of PowerZure exploitation toolkit to run an arbitrary code or exfiltrate Azure Automation account credentials**

(ARM_PowerZure.RunCodeOnBehalf)

**Description**: PowerZure exploitation toolkit detected attempting to run code or exfiltrate Azure Automation account credentials. This was detected by analyzing Azure Resource Manager operations in your subscription.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: High

### **Usage of PowerZure function to maintain persistence in your Azure environment**

(ARM_PowerZure.MaintainPersistence)

**Description**: PowerZure exploitation toolkit detected creating a webhook backdoor to maintain persistence in your Azure environment. This was detected by analyzing Azure Resource Manager operations in your subscription.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: High

### **Suspicious classic role assignment detected (Preview)**

(ARM_AnomalousClassicRoleAssignment)

**Description**: Microsoft Defender for Resource Manager identified a suspicious classic role assignment in your tenant, which might indicate that an account in your organization was compromised. The identified operations are designed to provide backward compatibility with classic roles that are no longer commonly used. While this activity might be legitimate, a threat actor might utilize such assignment to grant permissions to another user account under their control.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Lateral Movement, Defense Evasion

**Severity**: High

> [!NOTE]
> For alerts that are in preview: [!INCLUDE [Legalese](../../includes/defender-for-cloud-preview-legal-text.md)]

## Next steps

- [Security alerts in Microsoft Defender for Cloud](alerts-overview.md)
- [Manage and respond to security alerts in Microsoft Defender for Cloud](managing-and-responding-alerts.yml)
- [Continuously export Defender for Cloud data](continuous-export.md)
