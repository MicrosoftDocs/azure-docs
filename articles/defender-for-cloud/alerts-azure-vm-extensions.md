---
title: Alerts for Azure VM extensions
description: This article lists the security alerts for Azure VM extensions visible in Microsoft Defender for Cloud.
ms.topic: reference
ms.custom: linux-related-content
ms.date: 06/03/2024
ai-usage: ai-assisted
---

# Alerts for Azure VM extensions

This article lists the security alerts you might get for Azure VM extensions from Microsoft Defender for Cloud and any Microsoft Defender plans you enabled. The alerts shown in your environment depend on the resources and services you're protecting, and your customized configuration.  

> [!NOTE]
> Some of the recently added alerts powered by Microsoft Defender Threat Intelligence and Microsoft Defender for Endpoint might be undocumented.

[Learn how to respond to these alerts](managing-and-responding-alerts.yml).

[Learn how to export alerts](continuous-export.md).

> [!NOTE]
> Alerts from different sources might take different amounts of time to appear. For example, alerts that require analysis of network traffic might take longer to appear than alerts related to suspicious processes running on virtual machines.

## Azure VM extensions alerts

These alerts focus on detecting suspicious activities of Azure virtual machine extensions and provides insights into attackers' attempts to compromise and perform malicious activities on your virtual machines.

Azure virtual machine extensions are small applications that run post-deployment on virtual machines and provide capabilities such as configuration, automation, monitoring, security, and more. While extensions are a powerful tool, they can be used by threat actors for various malicious intents, for example:

- Data collection and monitoring

- Code execution and configuration deployment with high privileges

- Resetting credentials and creating administrative users

- Encrypting disks

Learn more about [Defender for Cloud latest protections against the abuse of Azure VM extensions](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/microsoft-defender-for-cloud-latest-protection-against/ba-p/3970121).

### **Suspicious failure installing GPU extension in your subscription (Preview)**

(VM_GPUExtensionSuspiciousFailure)

**Description**: Suspicious intent of installing a GPU extension on unsupported VMs. This extension should be installed on virtual machines equipped with a graphic processor, and in this case the virtual machines are not equipped with such. These failures can be seen when malicious adversaries execute multiple installations of such extension for crypto-mining purposes.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Impact

**Severity**: Medium

### **Suspicious installation of a GPU extension was detected on your virtual machine (Preview)**

(VM_GPUDriverExtensionUnusualExecution)

**Description**: Suspicious installation of a GPU extension was detected on your virtual machine by analyzing the Azure Resource Manager operations in your subscription. Attackers might use the GPU driver extension to install GPU drivers on your virtual machine via the Azure Resource Manager to perform cryptojacking. This activity is deemed suspicious as the principal's behavior departs from its usual patterns.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Impact

**Severity**: Low

### **Run Command with a suspicious script was detected on your virtual machine (Preview)**

(VM_RunCommandSuspiciousScript)

**Description**: A Run Command with a suspicious script was detected on your virtual machine by analyzing the Azure Resource Manager operations in your subscription. Attackers might use Run Command to execute malicious code with high privileges on your virtual machine via the Azure Resource Manager. The script is deemed suspicious as certain parts were identified as being potentially malicious.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Execution

**Severity**: High

### **Suspicious unauthorized Run Command usage was detected on your virtual machine (Preview)**

(VM_RunCommandSuspiciousFailure)

**Description**: Suspicious unauthorized usage of Run Command has failed and was detected on your virtual machine by analyzing the Azure Resource Manager operations in your subscription. Attackers might attempt to use Run Command to execute malicious code with high privileges on your virtual machines via the Azure Resource Manager. This activity is deemed suspicious as it hasn't been commonly seen before.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Execution

**Severity**: Medium

### **Suspicious Run Command usage was detected on your virtual machine (Preview)**

(VM_RunCommandSuspiciousUsage)

**Description**: Suspicious usage of Run Command was detected on your virtual machine by analyzing the Azure Resource Manager operations in your subscription. Attackers might use Run Command to execute malicious code with high privileges on your virtual machines via the Azure Resource Manager. This activity is deemed suspicious as it hasn't been commonly seen before.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Execution

**Severity**: Low

### **Suspicious usage of multiple monitoring or data collection extensions was detected on your virtual machines (Preview)**

(VM_SuspiciousMultiExtensionUsage)

**Description**: Suspicious usage of multiple monitoring or data collection extensions was detected on your virtual machines by analyzing the Azure Resource Manager operations in your subscription. Attackers might abuse such extensions for data collection, network traffic monitoring, and more, in your subscription. This usage is deemed suspicious as it hasn't been commonly seen before.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Reconnaissance

**Severity**: Medium

### **Suspicious installation of disk encryption extensions was detected on your virtual machines (Preview)**

(VM_DiskEncryptionSuspiciousUsage)

**Description**: Suspicious installation of disk encryption extensions was detected on your virtual machines by analyzing the Azure Resource Manager operations in your subscription. Attackers might abuse the disk encryption extension to deploy full disk encryptions on your virtual machines via the Azure Resource Manager in an attempt to perform ransomware activity. This activity is deemed suspicious as it hasn't been commonly seen before and due to the high number of extension installations.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Impact

**Severity**: Medium

### **Suspicious usage of VMAccess extension was detected on your virtual machines (Preview)**

(VM_VMAccessSuspiciousUsage)

**Description**: Suspicious usage of VMAccess extension was detected on your virtual machines. Attackers might abuse the VMAccess extension to gain access and compromise your virtual machines with high privileges by resetting access or managing administrative users. This activity is deemed suspicious as the principal's behavior departs from its usual patterns, and due to the high number of the extension installations.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Persistence

**Severity**: Medium

### **Desired State Configuration (DSC) extension with a suspicious script was detected on your virtual machine (Preview)**

(VM_DSCExtensionSuspiciousScript)

**Description**: Desired State Configuration (DSC) extension with a suspicious script was detected on your virtual machine by analyzing the Azure Resource Manager operations in your subscription. Attackers might use the Desired State Configuration (DSC) extension to deploy malicious configurations, such as persistence mechanisms, malicious scripts, and more, with high privileges, on your virtual machines. The script is deemed suspicious as certain parts were identified as being potentially malicious.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Execution

**Severity**: High

### **Suspicious usage of a Desired State Configuration (DSC) extension was detected on your virtual machines (Preview)**

(VM_DSCExtensionSuspiciousUsage)

**Description**: Suspicious usage of a Desired State Configuration (DSC) extension was detected on your virtual machines by analyzing the Azure Resource Manager operations in your subscription. Attackers might use the Desired State Configuration (DSC) extension to deploy malicious configurations, such as persistence mechanisms, malicious scripts, and more, with high privileges, on your virtual machines. This activity is deemed suspicious as the principal's behavior departs from its usual patterns, and due to the high number of the extension installations.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Execution

**Severity**: Low

### **Custom script extension with a suspicious script was detected on your virtual machine (Preview)**

(VM_CustomScriptExtensionSuspiciousCmd)

**Description**: Custom script extension with a suspicious script was detected on your virtual machine by analyzing the Azure Resource Manager operations in your subscription. Attackers might use Custom script extension to execute malicious code with high privileges on your virtual machine via the Azure Resource Manager. The script is deemed suspicious as certain parts were identified as being potentially malicious.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Execution

**Severity**: High

### **Suspicious failed execution of custom script extension in your virtual machine**

(VM_CustomScriptExtensionSuspiciousFailure)

**Description**: Suspicious failure of a custom script extension was detected in your virtual machine by analyzing the Azure Resource Manager operations in your subscription. Such failures might be associated with malicious scripts run by this extension.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Execution

**Severity**: Medium

### **Unusual deletion of custom script extension in your virtual machine**

(VM_CustomScriptExtensionUnusualDeletion)

**Description**: Unusual deletion of a custom script extension was detected in your virtual machine by analyzing the Azure Resource Manager operations in your subscription. Attackers might use custom script extensions to execute malicious code on your virtual machines via the Azure Resource Manager.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Execution

**Severity**: Medium

### **Unusual execution of custom script extension in your virtual machine**

(VM_CustomScriptExtensionUnusualExecution)

**Description**: Unusual execution of a custom script extension was detected in your virtual machine by analyzing the Azure Resource Manager operations in your subscription. Attackers might use custom script extensions to execute malicious code on your virtual machines via the Azure Resource Manager.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Execution

**Severity**: Medium

### **Custom script extension with suspicious entry-point in your virtual machine**

(VM_CustomScriptExtensionSuspiciousEntryPoint)

**Description**: Custom script extension with a suspicious entry-point was detected in your virtual machine by analyzing the Azure Resource Manager operations in your subscription. The entry-point refers to a suspicious GitHub repository. Attackers might use custom script extensions to execute malicious code on your virtual machines via the Azure Resource Manager.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Execution

**Severity**: Medium

### **Custom script extension with suspicious payload in your virtual machine**

(VM_CustomScriptExtensionSuspiciousPayload)

**Description**: Custom script extension with a payload from a suspicious GitHub repository was detected in your virtual machine by analyzing the Azure Resource Manager operations in your subscription. Attackers might use custom script extensions to execute malicious code on your virtual machines via the Azure Resource Manager.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Execution

**Severity**: Medium

> [!NOTE]
> For alerts that are in preview: [!INCLUDE [Legalese](../../includes/defender-for-cloud-preview-legal-text.md)]

## Next steps

- [Security alerts in Microsoft Defender for Cloud](alerts-overview.md)
- [Manage and respond to security alerts in Microsoft Defender for Cloud](managing-and-responding-alerts.yml)
- [Continuously export Defender for Cloud data](continuous-export.md)
