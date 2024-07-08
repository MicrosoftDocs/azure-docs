---
title: Reference table for all compute security recommendations in Microsoft Defender for Cloud
description: This article lists all Microsoft Defender for Cloud compute security recommendations that help you harden and protect your resources.
author: dcurwin
ms.service: defender-for-cloud
ms.topic: reference
ms.date: 03/13/2024
ms.author: dacurwin
ms.custom: generated
ai-usage: ai-assisted
---

# Compute security recommendations

This article lists all the multicloud compute security recommendations you might see in Microsoft Defender for Cloud. 

The recommendations that appear in your environment are based on the resources that you're protecting and on your customized configuration.

To learn about actions that you can take in response to these recommendations, see [Remediate recommendations in Defender for Cloud](implement-security-recommendations.md).



> [!TIP]
> If a recommendation description says *No related policy*, usually it's because that recommendation is dependent on a different recommendation.
>
> For example, the recommendation *Endpoint protection health failures should be remediated* relies on the recommendation that checks whether an endpoint protection solution is installed (*Endpoint protection solution should be installed*). The underlying recommendation *does* have a policy.
> Limiting policies to only foundational recommendations simplifies policy management.


## Azure compute recommendations

### [Adaptive application controls for defining safe applications should be enabled on your machines](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/35f45c95-27cf-4e52-891f-8390d1de5828)

**Description**: Enable application controls to define the list of known-safe applications running on your machines, and alert you when other applications run. This helps harden your machines against malware. To simplify the process of configuring and maintaining your rules, Defender for Cloud uses machine learning to analyze the applications running on each machine and suggest the list of known-safe applications.
(Related policy: [Adaptive application controls for defining safe applications should be enabled on your machines](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f47a6b606-51aa-4496-8bb7-64b11cf66adc)).

**Severity**: High

### [Allowlist rules in your adaptive application control policy should be updated](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/1234abcd-1b53-4fd4-9835-2c2fa3935313)

**Description**: Monitor for changes in behavior on groups of machines configured for auditing by Defender for Cloud's adaptive application controls. Defender for Cloud uses machine learning to analyze the running processes on your machines and suggest a list of known-safe applications. These are presented as recommended apps to allow in adaptive application control policies.
(Related policy: [Allowlist rules in your adaptive application control policy should be updated](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f123a3936-f020-408a-ba0c-47873faf1534)).

**Severity**: High

### [Authentication to Linux machines should require SSH keys](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/22441184-2f7b-d4a0-e00b-4c5eaef4afc9)

**Description**: Although SSH itself provides an encrypted connection, using passwords with SSH still leaves the VM vulnerable to brute-force attacks. The most secure option for authenticating to an Azure Linux virtual machine over SSH is with a public-private key pair, also known as SSH keys. Learn more in [Detailed steps: Create and manage SSH keys for authentication to a Linux VM in Azure](../virtual-machines/linux/create-ssh-keys-detailed.md).
(Related policy: [Audit Linux machines that are not using SSH key for authentication](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f630c64f9-8b6b-4c64-b511-6544ceff6fd6)).

**Severity**: Medium

### [Automation account variables should be encrypted](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/b12bc79e-4f12-44db-acda-571820191ddc)

**Description**: It is important to enable encryption of Automation account variable assets when storing sensitive data.
(Related policy: [Automation account variables should be encrypted](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fmicrosoft.authorization%2fpolicydefinitions%2f3657f5a0-770e-44a3-b44e-9431ba1e9735)).

**Severity**: High

### [Azure Backup should be enabled for virtual machines](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/f2f595ec-5dc6-68b4-82ef-b63563e9c610)

**Description**: Protect the data on your Azure virtual machines with Azure Backup.
Azure Backup is an Azure-native, cost-effective, data protection solution.
It creates recovery points that are stored in geo-redundant recovery vaults.
When you restore from a recovery point, you can restore the whole VM or specific files.
(Related policy: [Azure Backup should be enabled for Virtual Machines](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f013e242c-8828-4970-87b3-ab247555486d)).

**Severity**: Low

### [(Preview) Azure Stack HCI servers should meet Secured-core requirements](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f56c47221-b8b7-446e-9ab7-c7c9dc07f0ad)

**Description**: Ensure that all Azure Stack HCI servers meet the Secured-core requirements. (Related policy: [Guest Configuration extension should be installed on machines - Microsoft Azure](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/6c99f570-2ce7-46bc-8175-cde013df43bc)).

**Severity**: Low

### [(Preview) Azure Stack HCI servers should have consistently enforced application control policies](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f7384fde3-11b0-4047-acbd-b3cf3cc8ce07)

**Description**: At a minimum, apply the Microsoft WDAC base policy in enforced mode on all Azure Stack HCI servers. Applied Windows Defender Application Control (WDAC) policies must be consistent across servers in the same cluster. (Related policy: [Guest Configuration extension should be installed on machines - Microsoft Azure](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/6c99f570-2ce7-46bc-8175-cde013df43bc)).

**Severity**: High

### [(Preview) Azure Stack HCI systems should have encrypted volumes](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fae95f12a-b6fd-42e0-805c-6b94b86c9830)

**Description**: Use BitLocker to encrypt the OS and data volumes on Azure Stack HCI systems. (Related policy: [Guest Configuration extension should be installed on machines - Microsoft Azure](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/6c99f570-2ce7-46bc-8175-cde013df43bc)).

**Severity**: High

### [Container hosts should be configured securely](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/0677209d-e675-2c6f-e91a-54cef2878663)

**Description**: Remediate vulnerabilities in security configuration settings on machines with Docker installed to protect them from attacks.
(Related policy: [Vulnerabilities in container security configurations should be remediated](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fe8cbc669-f12d-49eb-93e7-9273119e9933)).

**Severity**: High

### [Diagnostic logs in Azure Stream Analytics should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/f11b27f2-8c49-5bb4-eff5-e1e5384bf95e)

**Description**: Enable logs and retain them for up to a year. This enables you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised.
(Related policy: [Diagnostic logs in Azure Stream Analytics should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2ff9be5368-9bf5-4b84-9e0a-7850da98bb46)).

**Severity**: Low

### [Diagnostic logs in Batch accounts should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/32771b45-220c-1a8b-584e-fdd5a2584a66)

**Description**: Enable logs and retain them for up to a year. This enables you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised.
(Related policy: [Diagnostic logs in Batch accounts should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f428256e6-1fac-4f48-a757-df34c2b3336d)).

**Severity**: Low

### [Diagnostic logs in Event Hubs should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/1597605a-0faf-5860-eb74-462ae2e9fc21)

**Description**: Enable logs and retain them for up to a year. This enables you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised.
(Related policy: [Diagnostic logs in Event Hubs should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f83a214f7-d01a-484b-91a9-ed54470c9a6a)).

**Severity**: Low

### [Diagnostic logs in Logic Apps should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/91387f44-7e43-4ecc-55f0-46f5adee3dd5)

**Description**: To ensure you can recreate activity trails for investigation purposes when a security incident occurs or your network is compromised, enable logging. If your diagnostic logs aren't being sent to a Log Analytics workspace, Azure Storage account, or Azure Event Hubs, ensure you've configured diagnostic settings to send platform metrics and platform logs to the relevant destinations. Learn more in Create diagnostic settings to send platform logs and metrics to different destinations.
(Related policy: [Diagnostic logs in Logic Apps should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f34f95f76-5386-4de7-b824-0d8478470c9d)).

**Severity**: Low

### [Diagnostic logs in Service Bus should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/f19ab7d9-5ff2-f8fd-ab3b-0bf95dcb6889)

**Description**: Enable logs and retain them for up to a year. This enables you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised.
(Related policy: [Diagnostic logs in Service Bus should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2ff8d36e2f-389b-4ee4-898d-21aeb69a0f45)).

**Severity**: Low

### [Diagnostic logs in Virtual Machine Scale Sets should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/961eb649-3ea9-f8c2-6595-88e9a3aeedeb)

**Description**: Enable logs and retain them for up to a year. This enables you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised.
(Related policy: [Diagnostic logs in Virtual Machine Scale Sets should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f7c1b1214-f927-48bf-8882-84f0af6588b1)).

**Severity**: High

### [EDR configuration issues should be resolved on virtual machines](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/dc5357d0-3858-4d17-a1a3-072840bff5be)

**Description**: To protect virtual machines from the latest threats and vulnerabilities, resolve all identified configuration issues with the installed Endpoint Detection and Response (EDR) solution. Currently, this recommendation only applies to resources with Microsoft Defender for Endpoint enabled.

This agentless endpoint recommendation is available if you have Defender for Servers Plan 2 or the Defender CSPM plan. [Learn more](endpoint-detection-response.md) about agentless endpoint protection recommendations. 

- These new agentless endpoint recommendations support Azure and multicloud machines. On-premises servers aren't supported.
- These new agentless endpoint recommendations replace existing recommendations [Endpoint protection should be installed on your machines (preview)](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/4fb67663-9ab9-475d-b026-8c544cced439) and [Endpoint protection health issues should be resolved on your machines (preview)](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/37a3689a-818e-4a0e-82ac-b1392b9bb000).
- These older recommendations use the MMA/AMA agent and will be replaced as the agents are [phased out in Defender for Servers](https://techcommunity.microsoft.com/t5/user/ssoregistrationpage?dest_url=https:%2F%2Ftechcommunity.microsoft.com%2Ft5%2Fblogs%2Fblogworkflowpage%2Fblog-id%2FMicrosoftDefenderCloudBlog%2Farticle-id%2F1269).

**Severity**: Low


### [EDR solution should be installed on Virtual Machines](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/06e3a6db-6c0c-4ad9-943f-31d9d73ecf6c) 

**Description**: Installing an Endpoint Detection and Response (EDR) solution on virtual machines is important for protection against advanced threats. EDRs aid in preventing, detecting, investigating, and responding to these threats. Microsoft Defender for Servers can be used to deploy Microsoft Defender for Endpoint.
- If a resource is classified as "Unhealthy", it indicates the absence of a supported EDR solution.
- If an EDR solution is installed but not discoverable by this recommendation, it can be exempted
- Without an EDR solution, the virtual machines are at risk of advanced threats.

This agentless endpoint recommendation is available if you have Defender for Servers Plan 2 or the Defender CSPM plan. [Learn more](endpoint-detection-response.md) about agentless endpoint protection recommendations.

- These new agentless endpoint recommendations support Azure and multicloud machines. On-premises servers aren't supported.
- These new agentless endpoint recommendations replace existing recommendations [Endpoint protection should be installed on your machines (preview)](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/4fb67663-9ab9-475d-b026-8c544cced439) and [Endpoint protection health issues should be resolved on your machines (preview)](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/37a3689a-818e-4a0e-82ac-b1392b9bb000).
- These older recommendations use the MMA/AMA agent and will be replaced as the agents are [phased out in Defender for Servers](https://techcommunity.microsoft.com/t5/user/ssoregistrationpage?dest_url=https:%2F%2Ftechcommunity.microsoft.com%2Ft5%2Fblogs%2Fblogworkflowpage%2Fblog-id%2FMicrosoftDefenderCloudBlog%2Farticle-id%2F1269).

**Severity**: High

### [Endpoint protection health issues on virtual machine scale sets should be resolved](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/e71020c2-860c-3235-cd39-04f3f8c936d2)

**Description**: On virtual machine scale sets, remediate endpoint protection health failures to protect them from threats and vulnerabilities.
(Related policy: [Endpoint protection solution should be installed on virtual machine scale sets](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f26a828e1-e88f-464e-bbb3-c134a282b9de)).

**Severity**: Low

### [Endpoint protection should be installed on virtual machine scale sets](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/21300918-b2e3-0346-785f-c77ff57d243b)

**Description**: Install an endpoint protection solution on your virtual machines scale sets, to protect them from threats and vulnerabilities.
(Related policy: [Endpoint protection solution should be installed on virtual machine scale sets](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f26a828e1-e88f-464e-bbb3-c134a282b9de)).

**Severity**: High

### [File integrity monitoring should be enabled on machines](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/9b7d740f-c271-4bfd-88fb-515680c33440)

**Description**: Defender for Cloud has identified machines that are missing a file integrity monitoring solution. To monitor changes to critical files, registry keys, and more on your servers, enable file integrity monitoring.
When the file integrity monitoring solution is enabled, create data collection rules to define the files to be monitored. To define rules, or see the files changed on machines with existing rules, go to the [file integrity monitoring management page](https://aka.ms/FimMMA).
(No related policy)

**Severity**: High

### [Guest Attestation extension should be installed on supported Linux virtual machine scale sets](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/a9a53f4f-26b6-3d68-33f3-2ec1f2452b5d)

**Description**: Install Guest Attestation extension on supported Linux virtual machine scale sets to allow Microsoft Defender for Cloud to proactively attest and monitor the boot integrity. Once installed, boot integrity will be attested via Remote Attestation. This assessment only applies to trusted launch enabled Linux virtual machine scale sets.

- Trusted launch requires the creation of new virtual machines.
- You can't enable trusted launch on existing virtual machines that were initially created without it.

Learn more about [Trusted launch for Azure virtual machines](../virtual-machines/trusted-launch.md).
(No related policy)

**Severity**: Low

### [Guest Attestation extension should be installed on supported Linux virtual machines](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/e94a7421-fc27-7a4d-e9ba-2ba01384cacd)

**Description**: Install Guest Attestation extension on supported Linux virtual machines to allow Microsoft Defender for Cloud to proactively attest and monitor the boot integrity. Once installed, boot integrity will be attested via Remote Attestation. This assessment only applies to trusted launch enabled Linux virtual machines.

- Trusted launch requires the creation of new virtual machines.
- You can't enable trusted launch on existing virtual machines that were initially created without it.

Learn more about [Trusted launch for Azure virtual machines](../virtual-machines/trusted-launch.md).
(No related policy)

**Severity**: Low

### [Guest Attestation extension should be installed on supported Windows virtual machine scale sets](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/02e8ca50-0e7e-cc34-0b91-215af2904248)

**Description**: Install Guest Attestation extension on supported virtual machine scale sets to allow Microsoft Defender for Cloud to proactively attest and monitor the boot integrity. Once installed, boot integrity will be attested via Remote Attestation. This assessment only applies to trusted launch enabled virtual machine scale sets.

- Trusted launch requires the creation of new virtual machines.
- You can't enable trusted launch on existing virtual machines that were initially created without it.

Learn more about [Trusted launch for Azure virtual machines](../virtual-machines/trusted-launch.md).
(No related policy)

**Severity**: Low

### [Guest Attestation extension should be installed on supported Windows virtual machines](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/874b14bd-b49e-495a-88c6-46acb89b0a33)

**Description**: Install Guest Attestation extension on supported virtual machines to allow Microsoft Defender for Cloud to proactively attest and monitor the boot integrity. Once installed, boot integrity will be attested via Remote Attestation. This assessment only applies to trusted launch enabled virtual machines.

- Trusted launch requires the creation of new virtual machines.
- You can't enable trusted launch on existing virtual machines that were initially created without it.

Learn more about [Trusted launch for Azure virtual machines](../virtual-machines/trusted-launch.md).
(No related policy)

**Severity**: Low

### [Guest Configuration extension should be installed on machines](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/6c99f570-2ce7-46bc-8175-cde013df43bc)

**Description**: To ensure secure configurations of in-guest settings of your machine, install the Guest Configuration extension. In-guest settings that the extension monitors include the configuration of the operating system, application configuration or presence, and environment settings. Once installed, in-guest policies will be available such as [Windows Exploit guard should be enabled](https://aka.ms/gcpol).
(Related policy: [Virtual machines should have the Guest Configuration extension](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fmicrosoft.authorization%2fpolicyDefinitions%2fae89ebca-1c92-4898-ac2c-9f63decb045c)).

**Severity**: Medium

### [(Preview) Host and VM networking should be protected on Azure Stack HCI systems](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2faee306e7-80b0-46f3-814c-d3d3083ed034)

**Description**: Protect data on the Azure Stack HCI host's network and on virtual machine network connections. (Related policy: [Guest Configuration extension should be installed on machines - Microsoft Azure](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/6c99f570-2ce7-46bc-8175-cde013df43bc)).

**Severity**: Low

### [Install endpoint protection solution on virtual machines](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/83f577bd-a1b6-b7e1-0891-12ca19d1e6df)

**Description**: Install an endpoint protection solution on your virtual machines, to protect them from threats and vulnerabilities.
(Related policy: [Monitor missing Endpoint Protection in Azure Security Center](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2faf6cd1bd-1635-48cb-bde7-5b15693900b9)).

**Severity**: High

### [Linux virtual machines should enable Azure Disk Encryption or EncryptionAtHost](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/a40cc620-e72c-fdf4-c554-c6ca2cd705c0)

**Description**: By default, a virtual machine's OS and data disks are encrypted-at-rest using platform-managed keys; temp disks and data caches aren't encrypted, and data isn't encrypted when flowing between compute and storage resources. Use Azure Disk Encryption or EncryptionAtHost to encrypt all this data. Visit [https://aka.ms/diskencryptioncomparison](https://aka.ms/diskencryptioncomparison) to compare encryption offerings. This policy requires two prerequisites to be deployed to the policy assignment scope. For details, visit [https://aka.ms/gcpol](https://aka.ms/gcpol).
(Related policy: [[Preview]: Linux virtual machines should enable Azure Disk Encryption or EncryptionAtHost](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fmicrosoft.authorization%2fpolicyDefinitions%2fca88aadc-6e2b-416c-9de2-5a0f01d1693f)).

Replaces the older recommendation *Virtual machines should encrypt temp disks, caches, and data flows between Compute and Storage resources*. The recommendation enables you to audit VM encryption compliance.

**Severity**: High

### [Linux virtual machines should enforce kernel module signature validation](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/e2f798b8-621a-4d46-99d7-1310e09eba26)

**Description**: To help mitigate against the execution of malicious or unauthorized code in kernel mode, enforce kernel module signature validation on supported Linux virtual machines. Kernel module signature validation ensures that only trusted kernel modules will be allowed to run. This assessment only applies to Linux virtual machines that have the Azure Monitor Agent installed.
(No related policy)

**Severity**: Low

### [Linux virtual machines should use only signed and trusted boot components](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/ad50b498-f90c-451f-886f-d0a169cc5002)

**Description**: With Secure Boot enabled, all OS boot components (boot loader, kernel, kernel drivers) must be signed by trusted publishers. Defender for Cloud has identified untrusted OS boot components on one or more of your Linux machines. To protect your machines from potentially malicious components, add them to your allowlist or remove the identified components.
(No related policy)

**Severity**: Low

### [Linux virtual machines should use Secure Boot](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/0396b18c-41aa-489c-affd-4ee5d1714a59)

**Description**: To protect against the installation of malware-based rootkits and boot kits, enable Secure Boot on supported Linux virtual machines. Secure Boot ensures that only signed operating systems and drivers will be allowed to run. This assessment only applies to Linux virtual machines that have the Azure Monitor Agent installed.
(No related policy)

**Severity**: Low



### [Log Analytics agent should be installed on Linux-based Azure Arc-enabled machines](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/720a3e77-0b9a-4fa9-98b6-ddf0fd7e32c1)

**Description**: Defender for Cloud uses the Log Analytics agent (also known as OMS) to collect security events from your Azure Arc machines. To deploy the agent on all your Azure Arc machines, follow the remediation steps.
(No related policy)

**Severity**: High

As use of the AMA and MMA is phased out in Defender for Servers, recommendations that rely on those agents, like this one, will be removed. Instead, Defender for Servers features will use the Microsoft Defender for Endpoint agent, or agentless scanning, with no reliance on the MMA or AMA. 

Estimated deprecation: July 2024


### [Log Analytics agent should be installed on virtual machine scale sets](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/45cfe080-ceb1-a91e-9743-71551ed24e94)

**Description**: Defender for Cloud collects data from your Azure virtual machines (VMs) to monitor for security vulnerabilities and threats. Data is collected using the [Log Analytics agent](../azure-monitor/platform/log-analytics-agent.md), formerly known as the Microsoft Monitoring Agent (MMA), which reads various security-related configurations and event logs from the machine and copies the data to your workspace for analysis. You'll also need to follow that procedure if your VMs are used by an Azure managed service such as Azure Kubernetes Service or Azure Service Fabric. You cannot configure auto-provisioning of the agent for Azure virtual machine scale sets. To deploy the agent on virtual machine scale sets (including those used by Azure managed services such as Azure Kubernetes Service and Azure Service Fabric), follow the procedure in the remediation steps.
(Related policy: [Log Analytics agent should be installed on your virtual machine scale sets for Azure Security Center monitoring](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fa3a6ea0c-e018-4933-9ef0-5aaa1501449b)).

As use of the AMA and MMA is phased out in Defender for Servers, recommendations that rely on those agents, like this one, will be removed. Instead, Defender for Servers features will use the Microsoft Defender for Endpoint agent, or agentless scanning, with no reliance on the MMA or AMA. 

Estimated deprecation: July 2024


**Severity**: High

### [Log Analytics agent should be installed on virtual machines](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/d1db3318-01ff-16de-29eb-28b344515626)

**Description**: Defender for Cloud collects data from your Azure virtual machines (VMs) to monitor for security vulnerabilities and threats. Data is collected using the [Log Analytics agent](../azure-monitor/platform/log-analytics-agent.md), formerly known as the Microsoft Monitoring Agent (MMA), which reads various security-related configurations and event logs from the machine and copies the data to your Log Analytics workspace for analysis. This agent is also required if your VMs are used by an Azure managed service such as Azure Kubernetes Service or Azure Service Fabric. We recommend configuring [auto-provisioning](enable-data-collection.md) to automatically deploy the agent. If you choose not to use auto-provisioning, manually deploy the agent to your VMs using the instructions in the remediation steps.
(Related policy: [Log Analytics agent should be installed on your virtual machine for Azure Security Center monitoring](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fa4fe33eb-e377-4efb-ab31-0784311bc499)).

As use of the AMA and MMA is phased out in Defender for Servers, recommendations that rely on those agents, like this one, will be removed. Instead, Defender for Servers features will use the Microsoft Defender for Endpoint agent, or agentless scanning, with no reliance on the MMA or AMA. 

Estimated deprecation: July 2024


**Severity**: High

### [Log Analytics agent should be installed on Windows-based Azure Arc-enabled machines](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/27ac71b1-75c5-41c2-adc2-858f5db45b08)

**Description**: Defender for Cloud uses the Log Analytics agent (also known as MMA) to collect security events from your Azure Arc machines. To deploy the agent on all your Azure Arc machines, follow the remediation steps.
(No related policy)

**Severity**: High

As use of the AMA and MMA is phased out in Defender for Servers, recommendations that rely on those agents, like this one, will be removed. Instead, Defender for Servers features will use the Microsoft Defender for Endpoint agent, or agentless scanning, with no reliance on the MMA or AMA. 

Estimated deprecation: July 2024

### [Machines should be configured securely](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/c476dc48-8110-4139-91af-c8d940896b98)

**Description**: Remediate vulnerabilities in security configuration on your machines to protect them from attacks.
(Related policy: [Vulnerabilities in security configuration on your machines should be remediated](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fe1e5fd5d-3e4c-4ce1-8661-7d1873ae6b15)).

This recommendation helps you to improve server security posture. Defender for Cloud enhances the Center for Internet Security (CIS) benchmarks by providing security baselines that are powered by Microsoft Defender Vulnerability Management. [Learn more](remediate-security-baseline.md).

**Severity**: Low

### [Machines should be restarted to apply security configuration updates](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/d79a60ef-d490-484e-91ed-f45ceb0e7cfb)

**Description**: To apply security configuration updates and protect against vulnerabilities, restart your machines. This assessment only applies to Linux virtual machines that have the Azure Monitor Agent installed.
(No related policy)

**Severity**: Low

### [Machines should have a vulnerability assessment solution](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/ffff0522-1e88-47fc-8382-2a80ba848f5d)

**Description**: Defender for Cloud regularly checks your connected machines to ensure they're running vulnerability assessment tools. Use this recommendation to deploy a vulnerability assessment solution.
(Related policy: [A vulnerability assessment solution should be enabled on your virtual machines](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f501541f7-f7e7-4cd6-868c-4190fdad3ac9)).

**Severity**: Medium

### [Machines should have vulnerability findings resolved](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/1195afff-c881-495e-9bc5-1486211ae03f)

**Description**: Resolve the findings from the vulnerability assessment solutions on your virtual machines.
(Related policy: [A vulnerability assessment solution should be enabled on your virtual machines](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f501541f7-f7e7-4cd6-868c-4190fdad3ac9)).

**Severity**: Low

### [Management ports of virtual machines should be protected with just-in-time network access control](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/805651bc-6ecd-4c73-9b55-97a19d0582d0)

**Description**: Defender for Cloud has identified some overly permissive inbound rules for management ports in your Network Security Group. Enable just-in-time access control to protect your VM from internet-based brute-force attacks. Learn more in [Understanding just-in-time (JIT) VM access](just-in-time-access-overview.md).
(Related policy: [Management ports of virtual machines should be protected with just-in-time network access control](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fb0f33259-77d7-4c9e-aac6-3aabcfae693c)).

**Severity**: High

### [Microsoft Defender for Servers should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/56a6e81f-7413-4f72-9a1b-aaeeaa87c872)

**Description**: Microsoft Defender for servers provides real-time threat protection for your server workloads and generates hardening recommendations as well as alerts about suspicious activities.
You can use this information to quickly remediate security issues and improve the security of your servers.

Remediating this recommendation will result in charges for protecting your servers. If you don't have any servers in this subscription, no charges will be incurred.
If you create any servers on this subscription in the future, they will automatically be protected and charges will begin at that time.
Learn more in [Introduction to Microsoft Defender for servers](defender-for-servers-introduction.md).
(Related policy: [Azure Defender for servers should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fmicrosoft.authorization%2fpolicyDefinitions%2f4da35fc9-c9e7-4960-aec9-797fe7d9051d)).

**Severity**: High

### [Microsoft Defender for Servers should be enabled on workspaces](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/1ce68079-b783-4404-b341-d2851d6f0fa2)

**Description**: Microsoft Defender for servers brings threat detection and advanced defenses for your Windows and Linux machines.
With this Defender plan enabled on your subscriptions but not on your workspaces, you're paying for the full capability of Microsoft Defender for servers but missing out on some of the benefits.
When you enable Microsoft Defender for servers on a workspace, all machines reporting to that workspace will be billed for Microsoft Defender for servers - even if they're in subscriptions without Defender plans enabled. Unless you also enable Microsoft Defender for servers on the subscription, those machines won't be able to take advantage of just-in-time VM access, adaptive application controls, and network detections for Azure resources.
Learn more in [Introduction to Microsoft Defender for servers](defender-for-servers-introduction.md).
(No related policy)

**Severity**: Medium

### [Secure Boot should be enabled on supported Windows virtual machines](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/69ad830b-d98c-b1cf-2158-9d69d38c7093)

**Description**: Enable Secure Boot on supported Windows virtual machines to mitigate against malicious and unauthorized changes to the boot chain. Once enabled, only trusted bootloaders, kernel, and kernel drivers will be allowed to run. This assessment only applies to trusted launch enabled Windows virtual machines.


- Trusted launch requires the creation of new virtual machines.
- You can't enable trusted launch on existing virtual machines that were initially created without it.

Learn more about [Trusted launch for Azure virtual machines](../virtual-machines/trusted-launch.md).
(No related policy)

**Severity**: Low

### [Service Fabric clusters should have the ClusterProtectionLevel property set to EncryptAndSign](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/7f04fc0c-4a3d-5c7e-ce19-666cb871b510)

**Description**: Service Fabric provides three levels of protection (None, Sign, and EncryptAndSign) for node-to-node communication using a primary cluster certificate. Set the protection level to ensure that all node-to-node messages are encrypted and digitally signed.
(Related policy: [Service Fabric clusters should have the ClusterProtectionLevel property set to EncryptAndSign](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f617c02be-7f02-4efd-8836-3180d47b6c68)).

**Severity**: High

### [Service Fabric clusters should only use Azure Active Directory for client authentication](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/03afeb6f-7634-adb3-0a01-803b0b9cb611)

**Description**: Perform Client authentication only via Azure Active Directory in Service Fabric
(Related policy: [Service Fabric clusters should only use Azure Active Directory for client authentication](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fb54ed75b-3e1a-44ac-a333-05ba39b99ff0)).

**Severity**: High


### [System updates on virtual machine scale sets should be installed](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/bd20bd91-aaf1-7f14-b6e4-866de2f43146)

**Description**: Install missing system security and critical updates to secure your Windows and Linux virtual machine scale sets.
(Related policy: [System updates on virtual machine scale sets should be installed](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fc3f317a7-a95c-4547-b7e7-11017ebdf2fe)).

As use of the Azure Monitor Agent (AMA) and the Log Analytics agent (also known as the Microsoft Monitoring Agent (MMA)) is phased out in Defender for Servers, recommendations that rely on those agents, like this one, will be removed. Instead, Defender for Servers features will use the Microsoft Defender for Endpoint agent, or agentless scanning, with no reliance on the MMA or AMA. 

Estimated deprecation: July 2024. These recommendations are [replaced by new ones](release-notes-archive.md#two-recommendations-related-to-missing-operating-system-os-updates-were-released-to-ga).


**Severity**: High

### [System updates should be installed on your machines](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/4ab6e3c5-74dd-8b35-9ab9-f61b30875b27)

**Description**: Install missing system security and critical updates to secure your Windows and Linux virtual machines and computers
(Related policy: [System updates should be installed on your machines](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fmicrosoft.authorization%2fpolicyDefinitions%2f86b3d65f-7626-441e-b690-81a8b71cff60)).

As use of the Azure Monitor Agent (AMA) and the Log Analytics agent (also known as the Microsoft Monitoring Agent (MMA)) is phased out in Defender for Servers, recommendations that rely on those agents, like this one, will be removed. Instead, Defender for Servers features will use the Microsoft Defender for Endpoint agent, or agentless scanning, with no reliance on the MMA or AMA. 

Estimated deprecation: July 2024. These recommendations are [replaced by new ones](release-notes-archive.md#two-recommendations-related-to-missing-operating-system-os-updates-were-released-to-ga).

**Severity**: High

### [System updates should be installed on your machines (powered by Update Center)](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/e1145ab1-eb4f-43d8-911b-36ddf771d13f)

**Description**: Your machines are missing system, security, and critical updates. Software updates often include critical patches to security holes. Such holes are frequently exploited in malware attacks so it's vital to keep your software updated. To install all outstanding patches and secure your machines, follow the remediation steps.
(No related policy)

**Severity**: High

### [Virtual machines and virtual machine scale sets should have encryption at host enabled](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/efbbd784-656d-473a-9863-ea7693bfcd2a)

**Description**: Use encryption at host to get end-to-end encryption for your virtual machine and virtual machine scale set data. Encryption at host enables encryption at rest for your temporary disk and OS/data disk caches. Temporary and ephemeral OS disks are encrypted with platform-managed keys when encryption at host is enabled. OS/data disk caches are encrypted at rest with either customer-managed or platform-managed key, depending on the encryption type selected on the disk. Learn more at [Use the Azure portal to enable end-to-end encryption using encryption at host](../virtual-machines/disks-enable-host-based-encryption-portal.md). (Related policy: [Virtual machines and virtual machine scale sets should have encryption at host enabled](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2ffc4d8e41-e223-45ea-9bf5-eada37891d87)).

**Severity**: Medium

### [Virtual machines should be migrated to new Azure Resource Manager resources](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/12018f4f-3d10-999b-e4c4-86ec25be08a1)

**Description**: Virtual machines (classic) are deprecated and these VMs should be migrated to Azure Resource Manager.
Because Azure Resource Manager now has full IaaS capabilities and other advancements, we deprecated the management of IaaS virtual machines (VMs) through Azure Service Manager (ASM) on February 28, 2020. This functionality will be fully retired on March 1, 2023.

To view all affected classic VMs make sure to select all your Azure subscriptions under 'directories + subscriptions' tab.

Available resources and information about this tool & migration:
[Overview of Virtual machines (classic) deprecation, step by step process for migration & available Microsoft resources.](../virtual-machines/classic-vm-deprecation.md?toc=/azure/virtual-machines/windows/toc.json&bc=/azure/virtual-machines/windows/breadcrumb/toc.json)
[Details about Migrate to Azure Resource Manager migration tool.](../virtual-machines/migration-classic-resource-manager-deep-dive.md?toc=/azure/virtual-machines/windows/toc.json&bc=/azure/virtual-machines/windows/breadcrumb/toc.json)
[Migrate to Azure Resource Manager migration tool using PowerShell.](../virtual-machines/windows/migration-classic-resource-manager-ps.md)
(Related policy: [Virtual machines should be migrated to new Azure Resource Manager resources](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f1d84d5fb-01f6-4d12-ba4f-4a26081d403d)).

**Severity**: High


### [Virtual machines guest attestation status should be healthy](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/b7604066-ed76-45f9-a5c1-c97e4812dc55)

**Description**: Guest attestation is performed by sending a trusted log (TCGLog) to an attestation server. The server uses these logs to determine whether boot components are trustworthy. This assessment is intended to detect compromises of the boot chain, which might be the result of a ```bootkit``` or ```rootkit``` infection.
This assessment only applies to Trusted Launch enabled virtual machines that have the Guest Attestation extension installed.
(No related policy)

**Severity**: Medium

### [Virtual machines' Guest Configuration extension should be deployed with system-assigned managed identity](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/69133b6b-695a-43eb-a763-221e19556755)

**Description**: The Guest Configuration extension requires a system assigned managed identity. Azure virtual machines in the scope of this policy will be non-compliant when they have the Guest Configuration extension installed but do not have a system assigned managed identity. [Learn more](https://aka.ms/gcpol)
(Related policy: [Guest Configuration extension should be deployed to Azure virtual machines with system assigned managed identity](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fd26f7642-7545-4e18-9b75-8c9bbdee3a9a)).

**Severity**: Medium


### [Virtual machine scale sets should be configured securely](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/8941d121-f740-35f6-952c-6561d2b38d36)

**Description**: On virtual machine scale sets, remediate vulnerabilities to protect them from attacks.
(Related policy: [Vulnerabilities in security configuration on your virtual machine scale sets should be remediated](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f3c735d8a-a4ba-4a3a-b7cf-db7754cf57f4)).

**Severity**: High


### [Virtual machines should encrypt temp disks, caches, and data flows between Compute and Storage resources](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/d57a4221-a804-52ca-3dea-768284f06bb7)

**Description**: By default, a virtual machine's OS and data disks are encrypted-at-rest using platform-managed keys;
temp disks and data caches aren't encrypted, and data isn't encrypted when flowing between compute and storage resources.
For a comparison of different disk encryption technologies in Azure, see <https://aka.ms/diskencryptioncomparison>.
Use Azure Disk Encryption to encrypt all this data.
Disregard this recommendation if:

You're using the encryption-at-host feature, or server-side encryption on Managed Disks meets your security requirements. Learn more in [server-side encryption of Azure Disk Storage](https://aka.ms/disksse).

(Related policy: [Disk encryption should be applied on virtual machines](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f0961003e-5a0a-4549-abde-af6a37f2724d))

**Severity**: High

### [vTPM should be enabled on supported virtual machines](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/861bbc73-0a55-8d1d-efc6-e92d9e1176e0)

**Description**: Enable virtual TPM device on supported virtual machines to facilitate Measured Boot and other OS security features that require a TPM. Once enabled, vTPM can be used to attest boot integrity. This assessment only applies to trusted launch enabled virtual machines.


- Trusted launch requires the creation of new virtual machines.
- You can't enable trusted launch on existing virtual machines that were initially created without it.

Learn more about [Trusted launch for Azure virtual machines](../virtual-machines/trusted-launch.md).
(No related policy)

**Severity**: Low

### [Vulnerabilities in security configuration on your Linux machines should be remediated (powered by Guest Configuration)](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/1f655fb7-63ca-4980-91a3-56dbc2b715c6)

**Description**: Remediate vulnerabilities in security configuration on your Linux machines to protect them from attacks.
(Related policy: [Linux machines should meet requirements for the Azure security baseline](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2ffc9b3da7-8347-4380-8e70-0a0361d8dedd)).

**Severity**: Low

### [Vulnerabilities in security configuration on your Windows machines should be remediated (powered by Guest Configuration)](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/8c3d9ad0-3639-4686-9cd2-2b2ab2609bda)

**Description**: Remediate vulnerabilities in security configuration on your Windows machines to protect them from attacks.
(No related policy)

**Severity**: Low

### [Windows Defender Exploit Guard should be enabled on machines](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/22489c48-27d1-4e40-9420-4303ad9cffef)

**Description**: Windows Defender Exploit Guard uses the Azure Policy Guest Configuration agent. Exploit Guard has four components that are designed to lock down devices against a wide variety of attack vectors and block behaviors commonly used in malware attacks while enabling enterprises to balance their security risk and productivity requirements (Windows only).
(Related policy: [Audit Windows machines on which Windows Defender Exploit Guard is not enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fmicrosoft.authorization%2fpolicyDefinitions%2fbed48b13-6647-468e-aa2f-1af1d3f4dd40)).

**Severity**: Medium

### [Windows virtual machines should enable Azure Disk Encryption or EncryptionAtHost](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/0cb5f317-a94b-6b80-7212-13a9cc8826af)

**Description**: By default, a virtual machine's OS and data disks are encrypted-at-rest using platform-managed keys; temp disks and data caches aren't encrypted, and data isn't encrypted when flowing between compute and storage resources. Use Azure Disk Encryption or EncryptionAtHost to encrypt all this data. Visit [https://aka.ms/diskencryptioncomparison](https://aka.ms/diskencryptioncomparison) to compare encryption offerings. This policy requires two prerequisites to be deployed to the policy assignment scope. For details, visit [https://aka.ms/gcpol](https://aka.ms/gcpol).
(Related policy: [[Preview]: Windows virtual machines should enable Azure Disk Encryption or EncryptionAtHost](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f3dc5edcd-002d-444c-b216-e123bbfa37c0)).

Replaces the older recommendation Virtual machines should encrypt temp disks, caches, and data flows between Compute and Storage resources. The recommendation enables you to audit VM encryption compliance.

**Severity**: High

### [Windows web servers should be configured to use secure communication protocols](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/87448ec1-55f6-3746-3f79-0f35beee76b4)

**Description**: To protect the privacy of information communicated over the Internet, your web servers should use the latest version of the industry-standard cryptographic protocol, Transport Layer Security (TLS). TLS secures communications over a network by using security certificates to encrypt a connection between machines.
(Related policy: [Audit Windows web servers that are not using secure communication protocols](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f5752e6d6-1206-46d8-8ab1-ecc2f71a8112)).

**Severity**: High



## AWS Compute recommendations

### [Amazon EC2 instances managed by Systems Manager should have a patch compliance status of COMPLIANT after a patch installation](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/5b3c2887-d7b7-4887-b074-4e6057027709)

**Description**: This control checks whether the compliance status of the Amazon EC2 Systems Manager patch compliance is COMPLIANT or NON_COMPLIANT after the patch installation on the instance.
It only checks instances managed by AWS Systems Manager Patch Manager.
It doesn't check whether the patch was applied within the 30-day limit prescribed by PCI DSS requirement '6.2'.
It also doesn't validate whether the patches applied were classified as security patches.
You should create patching groups with the appropriate baseline settings and ensure in-scope systems are managed by those patch groups in Systems Manager. For more information about patch groups, see [AWS Systems Manager User Guide](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-patch-group-tagging.html).

**Severity**: Medium

### [Amazon EFS should be configured to encrypt file data at rest using AWS KMS](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/4e482075-311f-401e-adc7-f8a8affc5635)

**Description**: This control checks whether Amazon Elastic File System is configured to encrypt the file data using AWS KMS. The check fails in the following cases:
*"[Encrypted](https://docs.aws.amazon.com/efs/latest/ug/API_DescribeFileSystems.html)" is set to "false" in the DescribeFileSystems response.
 The "[KmsKeyId](https://docs.aws.amazon.com/efs/latest/ug/API_DescribeFileSystems.html)" key in the [DescribeFileSystems](https://docs.aws.amazon.com/efs/latest/ug/API_DescribeFileSystems.html) response doesn't match the KmsKeyId parameter for [efs-encrypted-check](https://docs.aws.amazon.com/config/latest/developerguide/efs-encrypted-check.html).
 Note that this control doesn't use the "KmsKeyId" parameter for [efs-encrypted-check](https://docs.aws.amazon.com/config/latest/developerguide/efs-encrypted-check.html). It only checks the value of "Encrypted". For an added layer of security for your sensitive data in Amazon EFS, you should create encrypted file systems.
 Amazon EFS supports encryption for file systems at-rest. You can enable encryption of data at rest when you create an Amazon EFS file system.
To learn more about Amazon EFS encryption, see [Data encryption in Amazon EFS](https://docs.aws.amazon.com/efs/latest/ug/encryption.html) in the Amazon Elastic File System User Guide.

**Severity**: Medium

### [Amazon EFS volumes should be in backup plans](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/e864e460-158b-4a4a-beb9-16ebc25c1240)

**Description**: This control checks whether Amazon Elastic File System (Amazon EFS) file systems are added to the backup plans in AWS Backup. The control fails if Amazon EFS file systems aren't included in the backup plans.
 Including EFS file systems in the backup plans helps you to protect your data from deletion and data loss.

**Severity**: Medium

### [Application Load Balancer deletion protection should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/5c508bf1-26f9-4696-bb61-8341d395e3de)

**Description**: This control checks whether an Application Load Balancer has deletion protection enabled. The control fails if deletion protection isn't configured.
Enable deletion protection to protect your Application Load Balancer from deletion.

**Severity**: Medium

### [Auto Scaling groups associated with a load balancer should use health checks](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/837d6a45-503f-4c95-bf42-323763960b62)

**Description**: Auto Scaling groups that are associated with a load balancer are using Elastic Load Balancing health checks.
 PCI DSS doesn't require load balancing or highly available configurations. This is recommended by AWS best practices.

**Severity**: Low

### [AWS accounts should have Azure Arc auto provisioning enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/882a80f0-943f-473e-b6d7-40c7a625540e)

**Description**: For full visibility of the security content from Microsoft Defender for servers, EC2 instances should be connected to Azure Arc. To ensure that all eligible EC2 instances automatically receive Azure Arc, enable autoprovisioning from Defender for Cloud at the AWS account level. Learn more about [Azure Arc](../azure-arc/servers/overview.md), and [Microsoft Defender for Servers](plan-defender-for-servers.md).

**Severity**: High

### [CloudFront distributions should have origin failover configured](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/4779e962-2ea3-4126-aa76-379ea271887c)

**Description**: This control checks whether an Amazon CloudFront distribution is configured with an origin group that has two or more origins.
CloudFront origin failover can increase availability. Origin failover automatically redirects traffic to a secondary origin if the primary origin is unavailable or if it returns specific HTTP response status codes.

**Severity**: Medium

### [CodeBuild GitHub or Bitbucket source repository URLs should use OAuth](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/9694d4ef-f21a-40b7-b535-618ac5c5d21e)

**Description**: This control checks whether the GitHub or Bitbucket source repository URL contains either personal access tokens or a user name and password.
Authentication credentials should never be stored or transmitted in clear text or appear in the repository URL. Instead of personal access tokens or user name and password, you should use OAuth to grant authorization for accessing GitHub or Bitbucket repositories.
 Using personal access tokens or a user name and password could expose your credentials to unintended data exposure and unauthorized access.

**Severity**: High

### [CodeBuild project environment variables should not contain credentials](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/a88b4b72-b461-4b5e-b024-91da1cbe500f)

**Description**: This control checks whether the project contains the environment variables `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.
Authentication credentials `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` should never be stored in clear text, as this could lead to unintended data exposure and unauthorized access.

**Severity**: High

### [DynamoDB Accelerator (DAX) clusters should be encrypted at rest](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/58e67d3d-8b17-4c1c-9bc4-550b10f0328a)

**Description**: This control checks whether a DAX cluster is encrypted at rest.
 Encrypting data at rest reduces the risk of data stored on disk being accessed by a user not authenticated to AWS. The encryption adds another set of access controls to limit the ability of unauthorized users to access to the data.
 For example, API permissions are required to decrypt the data before it can be read.

**Severity**: Medium

### [DynamoDB tables should automatically scale capacity with demand](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/47476790-2527-4bdb-b839-3b48ed18dccf)

**Description**: This control checks whether an Amazon DynamoDB table can scale its read and write capacity as needed. This control passes if the table uses either on-demand capacity mode or provisioned mode with auto scaling configured.
 Scaling capacity with demand avoids throttling exceptions, which helps to maintain availability of your applications.

**Severity**: Medium

### [EC2 instances should be connected to Azure Arc](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/231dee23-84db-44d2-bd9d-c32fbcfb42a3)

**Description**: Connect your EC2 instances to Azure Arc in order to have full visibility to Microsoft Defender for Servers security content. Learn more about [Azure Arc](../azure-arc/servers/overview.md), and about [Microsoft Defender for Servers](plan-defender-for-servers.md) on hybrid-cloud environment.

**Severity**: High

### [EC2 instances should be managed by AWS Systems Manager](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/4be5393d-cc33-4ef7-acae-80295bc3ae35)

**Description**: Status of the Amazon EC2 Systems Manager patch compliance is 'COMPLIANT' or 'NON_COMPLIANT' after the patch installation on the instance.
 Only  instances managed by AWS Systems Manager Patch Manager are checked. Patches that were applied within the 30-day limit prescribed by PCI DSS requirement '6' aren't checked.

**Severity**: Medium

### [EDR configuration issues should be resolved on EC2s](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/695abd03-82bd-4d7f-a94c-140e8a17666c)

**Description**: To protect virtual machines from the latest threats and vulnerabilities, resolve all identified configuration issues with the installed Endpoint Detection and Response (EDR) solution. Currently, this recommendation only applies to resources with Microsoft Defender for Endpoint enabled.

This agentless endpoint recommendation is available if you have Defender for Servers Plan 2 or the Defender CSPM plan. [Learn more](endpoint-detection-response.md) about agentless endpoint protection recommendations.
- These new agentless endpoint recommendations support Azure and multicloud machines. On-premises servers aren't supported.
- These new agentless endpoint recommendations replace existing recommendations [Endpoint protection should be installed on your machines (preview)](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/4fb67663-9ab9-475d-b026-8c544cced439) and [Endpoint protection health issues should be resolved on your machines (preview)](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/37a3689a-818e-4a0e-82ac-b1392b9bb000).
- These older recommendations use the MMA/AMA agent and will be replaced as the agents are [phased out in Defender for Servers](https://techcommunity.microsoft.com/t5/user/ssoregistrationpage?dest_url=https:%2F%2Ftechcommunity.microsoft.com%2Ft5%2Fblogs%2Fblogworkflowpage%2Fblog-id%2FMicrosoftDefenderCloudBlog%2Farticle-id%2F1269).

**Severity**: High

### [EDR solution should be installed on EC2s](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/77d09952-2bc2-4495-8795-cc8391452f85)

**Description**: To protect EC2s, install an Endpoint Detection and Response (EDR) solution. EDRs help prevent, detect, investigate, and respond to advanced threats. Use Microsoft Defender for Servers to deploy Microsoft Defender for Endpoint. If resource is classified as "Unhealthy", it doesn't have a supported EDR solution installed. If you have an EDR solution installed which isn't discoverable by this recommendation, you can exempt it.

This agentless endpoint recommendation is available if you have Defender for Servers Plan 2 or the Defender CSPM plan. [Learn more](endpoint-detection-response.md) about agentless endpoint protection recommendations.

- These new agentless endpoint recommendations support Azure and multicloud machines. On-premises servers aren't supported.
- These new agentless endpoint recommendations replace existing recommendations [Endpoint protection should be installed on your machines (preview)](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/4fb67663-9ab9-475d-b026-8c544cced439) and [Endpoint protection health issues should be resolved on your machines (preview)](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/37a3689a-818e-4a0e-82ac-b1392b9bb000).
- These older recommendations use the MMA/AMA agent and will be replaced as the agents are [phased out in Defender for Servers](https://techcommunity.microsoft.com/t5/user/ssoregistrationpage?dest_url=https:%2F%2Ftechcommunity.microsoft.com%2Ft5%2Fblogs%2Fblogworkflowpage%2Fblog-id%2FMicrosoftDefenderCloudBlog%2Farticle-id%2F1269).

**Severity**: High

### [Instances managed by Systems Manager should have an association compliance status of COMPLIANT](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/67a90ae0-b3d1-44f0-9dcf-a03234ebeb65)

**Description**: This control checks whether the status of the AWS Systems Manager association compliance is COMPLIANT or NON_COMPLIANT after the association is run on an instance. The control passes if the association compliance status is COMPLIANT.
A State Manager association is a configuration that is assigned to your managed instances. The configuration defines the state that you want to maintain on your instances. For example, an association can specify that antivirus software must be installed and running on your instances, or that certain ports must be closed.
After you create one or more State Manager associations, compliance status information is immediately available to you in the console or in response to AWS CLI commands or corresponding Systems Manager API operations. For associations, "Configuration" Compliance shows statuses of Compliant or Non-compliant and the severity level assigned to the association, such as *Critical* or *Medium*. To learn more about State Manager association compliance, see [About State Manager association compliance](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-compliance-about.html#sysman-compliance-about-association) in the AWS Systems Manager User Guide.
You must configure your in-scope EC2 instances for Systems Manager association. You must also configure the patch baseline for the security rating of the vendor of patches, and set the autoapproval date to meet PCI DSS *3.2.1* requirement *6.2*. For more guidance on how to [Create an association](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-state-assoc.html), see Create an association in the AWS Systems Manager User Guide. For more information on working with patching in Systems Manager, see [AWS Systems Manager Patch Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-patch.html) in the AWS Systems Manager User Guide.

**Severity**: Low

### [Lambda functions should have a dead-letter queue configured](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/dcf10b98-798f-4734-9afd-800916bf1e65)

**Description**: This control checks whether a Lambda function is configured with a dead-letter queue. The control fails if the Lambda function isn't configured with a dead-letter queue.
As an alternative to an on-failure destination, you can configure your function with a dead-letter queue to save discarded events for further processing.
 A dead-letter queue acts the same as an on-failure destination. It's used when an event fails all processing attempts or expires without being processed.
A dead-letter queue allows you to look back at errors or failed requests to your Lambda function to debug or identify unusual behavior.
From a security perspective, it's important to understand why your function failed and to ensure that your function doesn't drop data or compromise data security as a result.
 For example, if your function can't communicate to an underlying resource, that could be a symptom of a denial of service (DoS) attack elsewhere in the network.

**Severity**: Medium

### [Lambda functions should use supported runtimes](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/e656e5b7-130c-4fb4-be90-9bdd4f82fdfb)

**Description**: This control checks that the Lambda function settings for runtimes match the expected values set for the supported runtimes for each language. This control checks for the following runtimes:
 **nodejs14.x**, **nodejs12.x**, **nodejs10.x**, **python3.8**, **python3.7**, **python3.6**, **ruby2.7**, **ruby2.5**, **java11**, **java8**, **java8.al2**, **go1.x**, **dotnetcore3.1**, **dotnetcore2.1**
[Lambda runtimes](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html) are built around a combination of operating system, programming language, and software libraries that are subject to maintenance and security updates. When a runtime component is no longer supported for security updates, Lambda deprecates the runtime. Even though you can't create functions that use the deprecated runtime, the function is still available to process invocation events. Make sure that your Lambda functions are current and don't use out-of-date runtime environments.
To learn more about the supported runtimes that this control checks for the supported languages, see [AWS Lambda runtimes](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html) in the AWS Lambda Developer Guide.

**Severity**: Medium

### [Management ports of EC2 instances should be protected with just-in-time network access control](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/9b26b102-ccde-4697-aa30-f0621f865f99)

**Description**: Microsoft Defender for Cloud identified some overly permissive inbound rules for management ports in your network. Enable just-in-time access control to protect your Instances from internet-based brute-force attacks. [Learn more](just-in-time-access-usage.yml).

**Severity**: High

### [Unused EC2 security groups should be removed](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/f065cc7b-f63b-4865-b8ff-4a1292e1a5cb)

**Description**: Security groups should be attached to Amazon EC2 instances or to an ENI.
 Healthy finding can indicate there are unused Amazon EC2 security groups.

**Severity**: Low

## GCP Compute recommendations

### [Compute Engine VMs should use the Container-Optimized OS](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/3e33004b-f0b8-488d-85ed-61336c7ad4ca)

**Description**: This recommendation evaluates the config property of a node pool for the key-value pair, 'imageType': 'COS.'

**Severity**: Low

### [EDR configuration issues should be resolved on GCP virtual machines](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/f36a15fb-61a6-428c-b719-6319538ecfbc)

**Description**: To protect virtual machines from the latest threats and vulnerabilities, resolve all identified configuration issues with the installed Endpoint Detection and Response (EDR) solution. Currently, this recommendation only applies to resources with Microsoft Defender for Endpoint  enabled.

This agentless endpoint recommendation is available if you have Defender for Servers Plan 2 or the Defender CSPM plan. [Learn more](endpoint-detection-response.md) about agentless endpoint protection recommendations.

- These new agentless endpoint recommendations support Azure and multicloud machines. On-premises servers aren't supported.
- These new agentless endpoint recommendations replace existing recommendations [Endpoint protection should be installed on your machines (preview)](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/4fb67663-9ab9-475d-b026-8c544cced439) and [Endpoint protection health issues should be resolved on your machines (preview)](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/37a3689a-818e-4a0e-82ac-b1392b9bb000).
- These older recommendations use the MMA/AMA agent and will be replaced as the agents are [phased out in Defender for Servers](https://techcommunity.microsoft.com/t5/user/ssoregistrationpage?dest_url=https:%2F%2Ftechcommunity.microsoft.com%2Ft5%2Fblogs%2Fblogworkflowpage%2Fblog-id%2FMicrosoftDefenderCloudBlog%2Farticle-id%2F1269).

**Severity**: High 

### [EDR solution should be installed on GCP Virtual Machines](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/68e595c1-a031-4354-b37c-4bdf679732f1)

**Description**: To protect virtual machines, install an Endpoint Detection and Response (EDR) solution. EDRs help prevent, detect, investigate, and respond to advanced threats. Use Microsoft Defender for Servers to deploy Microsoft Defender for Endpoint. If resource is classified as "Unhealthy", it doesn't have a supported EDR solution installed. If you have an EDR solution installed which isn't discoverable by this recommendation, you can exempt it.

This agentless endpoint recommendation is available if you have Defender for Servers Plan 2 or the Defender CSPM plan. [Learn more](endpoint-detection-response.md) about agentless endpoint protection recommendations.

- These new agentless endpoint recommendations support Azure and multicloud machines. On-premises servers aren't supported.
- These new agentless endpoint recommendations replace existing recommendations [Endpoint protection should be installed on your machines (preview)](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/4fb67663-9ab9-475d-b026-8c544cced439) and [Endpoint protection health issues should be resolved on your machines (preview)](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/37a3689a-818e-4a0e-82ac-b1392b9bb000).
- These older recommendations use the MMA/AMA agent and will be replaced as the agents are [phased out in Defender for Servers](https://techcommunity.microsoft.com/t5/user/ssoregistrationpage?dest_url=https:%2F%2Ftechcommunity.microsoft.com%2Ft5%2Fblogs%2Fblogworkflowpage%2Fblog-id%2FMicrosoftDefenderCloudBlog%2Farticle-id%2F1269).

**Severity**: High


### [Ensure 'Block Project-wide SSH keys' is enabled for VM instances](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/00f8a6a6-cf69-4c11-822e-3ebf4910e545)

**Description**: It's recommended to use Instance specific SSH key(s) instead of using common/shared project-wide SSH key(s) to access Instances.
Project-wide SSH keys are stored in Compute/Project-meta-data. Project wide SSH keys can be used to log in into all the instances within project. Using project-wide SSH keys eases the SSH key management but if compromised, poses the security risk that can affect all the instances within project.
 It's recommended to use Instance specific SSH keys that can limit the attack surface if the SSH keys are compromised.

**Severity**: Medium

### [Ensure Compute instances are launched with Shielded VM enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/1a4b3b3a-7de9-4aa4-a29b-580d59b43f79)

**Description**: To defend against advanced threats and ensure that the boot loader and firmware on your VMs are signed and untampered, it's recommended that Compute instances are launched with Shielded VM enabled.
Shielded VMs are VMs on Google Cloud Platform hardened by a set of security controls that help defend against ```rootkits``` and ```bootkits```.
Shielded VM offers verifiable integrity of your Compute Engine VM instances, so you can be confident your instances haven't been compromised by boot- or kernel-level malware or rootkits.
Shielded VM's verifiable integrity is achieved through the use of Secure Boot, virtual trusted platform module (vTPM)-enabled Measured Boot, and integrity monitoring.
Shielded VM instances run firmware that is signed and verified using Google's Certificate Authority, ensuring that the instance's firmware is unmodified and establishing the root of trust for Secure Boot.
Integrity monitoring helps you understand and make decisions about the state of your VM instances and the Shielded VM vTPM enables Measured Boot by performing the measurements needed to create a known good boot baseline, called the integrity policy baseline.
The integrity policy baseline is used for comparison with measurements from subsequent VM boots to determine if anything has changed.
Secure Boot helps ensure that the system only runs authentic software by verifying the digital signature of all boot components, and halting the boot process if signature verification fails.

**Severity**: High

### [Ensure 'Enable connecting to serial ports' is not enabled for VM Instance](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/7e060336-2c9e-4289-a2a6-8d301bad47bb)

**Description**: Interacting with a serial port is often referred to as the serial console, which is similar to using a terminal window, in that input and output is entirely in text mode and there's no graphical interface or mouse support.
If you enable the interactive serial console on an instance, clients can attempt to connect to that instance from any IP address. Therefore interactive serial console support should be disabled.
A virtual machine instance has four virtual serial ports. Interacting with a serial port is similar to using a terminal window, in that input and output is entirely in text mode and there's no graphical interface or mouse support.
The instance's operating system, BIOS, and other system-level entities often write output to the serial ports, and can accept input such as commands or answers to prompts.
Typically, these system-level entities use the first serial port (port 1) and serial port 1 is often referred to as the serial console.
The interactive serial console doesn't support IP-based access restrictions such as IP allowlists. If you enable the interactive serial console on an instance, clients can attempt to connect to that instance from any IP address.
This allows anybody to connect to that instance if they know the correct SSH key, username, project ID, zone, and instance name.
Therefore interactive serial console support should be disabled.

**Severity**: Medium

### [Ensure 'log_duration' database flag for Cloud SQL PostgreSQL instance is set to 'on'](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/272820a7-06ce-44b3-8318-4ec1f82237dc)

**Description**: Enabling the log_hostname setting causes the duration of each completed statement to be logged.
 This doesn't logs the text of the query and thus behaves different from the log_min_duration_statement flag.
 This parameter can't be changed after session start.
 Monitoring the time taken to execute the queries can be crucial in identifying any resource hogging queries and assessing the performance of the server.
 Further steps such as load balancing and use of optimized queries can be taken to ensure the performance and stability of the server.
 This recommendation is applicable to PostgreSQL database instances.

**Severity**: Low

### [Ensure 'log_executor_stats' database flag for Cloud SQL PostgreSQL instance is set to 'off'](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/19711549-76eb-4f1f-b43b-b1048e66c1f0)

**Description**: The PostgreSQL executor is responsible to execute the plan handed over by the PostgreSQL planner.
 The executor processes the plan recursively to extract the required set of rows.
 The "log_executor_stats" flag controls the inclusion of PostgreSQL executor performance statistics in the PostgreSQL logs for each query.
 The "log_executor_stats" flag enables a crude profiling method for logging PostgreSQL executor performance statistics, which even though can be useful for troubleshooting, it might increase the number of logs significantly and have performance overhead.
 This recommendation is applicable to PostgreSQL database instances.

**Severity**: Low

### [Ensure 'log_min_error_statement' database flag for Cloud SQL PostgreSQL instance is set to 'Error' or stricter](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/50a1058e-925b-4998-9d93-5eaa8f7021a3)

**Description**: The "log_min_error_statement" flag defines the minimum message severity level that is considered as an error statement.
 Messages for error statements are logged with the SQL statement.
 Valid values include "DEBUG5," "DEBUG4," "DEBUG3," "DEBUG2," "DEBUG1," "INFO," "NOTICE," "WARNING," "ERROR," "LOG," "FATAL," and "PANIC."
 Each severity level includes the subsequent levels mentioned above.
 Ensure a value of ERROR or stricter is set.
 Auditing helps in troubleshooting operational problems and also permits forensic analysis.
 If "log_min_error_statement" isn't set to the correct value, messages might not be classified as error messages appropriately.
 Considering general log messages as error messages would make is difficult to find actual errors and considering only stricter severity levels as error messages might skip actual errors to log their SQL statements.
 The "log_min_error_statement" flag should be set to "ERROR" or stricter.
 This recommendation is applicable to PostgreSQL database instances.

**Severity**: Low

### [Ensure 'log_parser_stats' database flag for Cloud SQL PostgreSQL instance is set to 'off'](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/a6efc275-b1c1-4003-8e85-2f30b2eb56e6)

**Description**: The PostgreSQL planner/optimizer is responsible to parse and verify the syntax of each query received by the server.
 If the syntax is correct a "parse tree" is built up else an error is generated.
 The "log_parser_stats" flag controls the inclusion of parser performance statistics in the PostgreSQL logs for each query.
 The "log_parser_stats" flag enables a crude profiling method for logging parser performance statistics, which even though can be useful for troubleshooting, it might increase the number of logs significantly and have performance overhead.
 This recommendation is applicable to PostgreSQL database instances.

**Severity**: Low

### [Ensure 'log_planner_stats' database flag for Cloud SQL PostgreSQL instance is set to 'off'](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/7d87879a-d498-4e61-b552-b34463f87f83)

**Description**: The same SQL query can be executed in multiple ways and still produce different results.
 The PostgreSQL planner/optimizer is responsible to create an optimal execution plan for each query.
 The "log_planner_stats" flag controls the inclusion of PostgreSQL planner performance statistics in the PostgreSQL logs for each query.
 The "log_planner_stats" flag enables a crude profiling method for logging PostgreSQL planner performance statistics, which even though can be useful for troubleshooting, it might increase the number of logs significantly and have performance overhead.
 This recommendation is applicable to PostgreSQL database instances.

**Severity**: Low

### [Ensure 'log_statement_stats' database flag for Cloud SQL PostgreSQL instance is set to 'off'](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/c36e73b7-ee30-4684-a1ad-2b878d2b10bf)

**Description**: The "log_statement_stats" flag controls the inclusion of end to end performance statistics of a SQL query in the PostgreSQL logs for each query.
 This can't be enabled with other module statistics (*log_parser_stats*, *log_planner_stats*, *log_executor_stats*).
 The "log_statement_stats" flag enables a crude profiling method for logging end to end performance statistics of a SQL query.
 This can be useful for troubleshooting but might increase the number of logs significantly and have performance overhead.
 This recommendation is applicable to PostgreSQL database instances.

**Severity**: Low

### [Ensure that Compute instances do not have public IP addresses](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/8bdd13ad-a9d2-4910-8b06-9c4cddb55abb)

**Description**: Compute instances shouldn't be configured to have external IP addresses.
To reduce your attack surface, Compute instances shouldn't have public IP addresses. Instead, instances should be configured behind load balancers, to minimize the instance's exposure to the internet.
Instances created by GKE should be excluded because some of them have external IP addresses and can't be changed by editing the instance settings.
These VMs have names that start with ```gke-``` and are labeled ```goog-gke-node```.

**Severity**: High

### [Ensure that instances are not configured to use the default service account](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/a107c44c-75e4-4607-b1b0-cd5cfcf249e0)

**Description**: It's recommended to configure your instance to not use the default Compute Engine service account because it has the Editor role on the project.
The default Compute Engine service account has the Editor role on the project, which allows read and write access to most Google Cloud Services.
To defend against privilege escalations if your VM is compromised, and to prevent an attacker from gaining access to all of your projects, it's recommended to not use the default Compute Engine service account.
Instead, you should create a new service account and assigning only the permissions needed by your instance.
The default Compute Engine service account is named `[PROJECT_NUMBER]- compute@developer.gserviceaccount.com`.
VMs created by GKE should be excluded. These VMs have names that start with ```gke-``` and are labeled ```goog-gke-node```.

**Severity**: High

### [Ensure that instances are not configured to use the default service account with full access to all Cloud APIs](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/a8c1fcf1-ca66-4fc1-b5e6-51d7f4f76782)

**Description**: To support principle of least privileges and prevent potential privilege escalation, it's recommended that instances aren't assigned to default service account "Compute Engine default service account" with Scope "Allow full access to all Cloud APIs."
Along with ability to optionally create, manage, and use user managed custom service accounts, Google Compute Engine provides default service account "Compute Engine default service account" for an instance to access necessary cloud services.

"Project Editor" role is assigned to "Compute Engine default service account" hence, This service account has almost all capabilities over all cloud services except billing.
However, when "Compute Engine default service account" assigned to an instance it can operate in three scopes.

- Allow default access: Allows only minimum access required to run an Instance (Least Privileges).
- Allow full access to all Cloud APIs: Allow full access to all the cloud APIs/Services (Too much access).
- Set access for each API: Allows Instance administrator to choose only those APIs that are needed to perform specific business functionality expected by instance.

When an instance is configured with "Compute Engine default service account" with Scope "Allow full access to all Cloud APIs," based on IAM roles assigned to the user(s) accessing Instance,
it might allow user to perform cloud operations/API calls that user isn't supposed to perform leading to successful privilege escalation.

VMs created by GKE should be excluded. These VMs have names that start with ```gke-``` and are labeled ```goog-gke-node```.

**Severity**: Medium

### [Ensure that IP forwarding is not enabled on Instances](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/0ba588a6-4539-4e67-bc62-d7b2b51300fb)

**Description**: Compute Engine instance can't forward a packet unless the source IP address of the packet matches the IP address of the instance. Similarly, GCP won't deliver a packet whose destination IP address is different than the IP address of the instance receiving the packet.
 However, both capabilities are required if you want to use instances to help route packets.
Forwarding of data packets should be disabled to prevent data loss or information disclosure.
Compute Engine instance can't forward a packet unless the source IP address of the packet matches the IP address of the instance. Similarly, GCP won't deliver a packet whose destination IP address is different than the IP address of the instance receiving the packet.
 However, both capabilities are required if you want to use instances to help route packets. To enable this source and destination IP check, disable the canIpForward field, which allows an instance to send and receive packets with nonmatching destination or source IPs.

**Severity**: Medium

### [Ensure that the 'log_checkpoints' database flag for Cloud SQL PostgreSQL instance is set to 'on'](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/a2404629-0132-4ab3-839e-8389dbe9fe98)

**Description**: Ensure that the log_checkpoints database flag for the Cloud SQL PostgreSQL instance is set to on.
Enabling log_checkpoints causes checkpoints and restart points to be logged in the server log. Some statistics are included in the log messages, including the number of buffers written and the time spent writing them.
 This parameter can only be set in the postgresql.conf file or on the server command line. This recommendation is applicable to PostgreSQL database instances.

**Severity**: Low

### [Ensure that the 'log_lock_waits' database flag for Cloud SQL PostgreSQL instance is set to 'on'](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/8191f530-fde7-4177-827a-43ce0f69ffe7)

**Description**: Enabling the "log_lock_waits" flag for a PostgreSQL instance creates a log for any session waits that take longer than the allotted "deadlock_timeout" time to acquire a lock.
 The deadlock timeout defines the time to wait on a lock before checking for any conditions. Frequent run overs on deadlock timeout can be an indication of an underlying issue.
 Logging such waits on locks by enabling the log_lock_waits flag can be used to identify poor performance due to locking delays or if a specially crafted SQL is attempting to starve resources through holding locks for excessive amounts of time.
 This recommendation is applicable to PostgreSQL database instances.

**Severity**: Low

### [Ensure that the 'log_min_duration_statement' database flag for Cloud SQL PostgreSQL instance is set to '-1'](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/1c9e237b-419f-4e73-b43a-94b5863dd73e)

**Description**: The "log_min_duration_statement" flag defines the minimum amount of execution time of a statement in milliseconds where the total duration of the statement is logged. Ensure that "log_min_duration_statement" is disabled, that is, a value of -1 is set.
 Logging SQL statements might include sensitive information that shouldn't be recorded in logs. This recommendation is applicable to PostgreSQL database instances.

**Severity**: Low

### [Ensure that the 'log_min_messages' database flag for Cloud SQL PostgreSQL instance is set appropriately](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/492fed4e-1871-4c12-948d-074ee0f07559)

**Description**: The "log_min_error_statement" flag defines the minimum message severity level that is considered as an error statement.
 Messages for error statements are logged with the SQL statement.
 Valid values include "DEBUG5," "DEBUG4," "DEBUG3," "DEBUG2," "DEBUG1," "INFO," "NOTICE," "WARNING," "ERROR," "LOG," "FATAL," and "PANIC."
 Each severity level includes the subsequent levels mentioned above.
 To effectively turn off logging failing statements, set this parameter to PANIC.
 ERROR is considered the best practice setting. Changes should only be made in accordance with the organization's logging policy.
Auditing helps in troubleshooting operational problems and also permits forensic analysis.
 If "log_min_error_statement" isn't set to the correct value, messages might not be classified as error messages appropriately.
 Considering general log messages as error messages would make it difficult to find actual errors, while considering only stricter severity levels as error messages might skip actual errors to log their SQL statements.
 The "log_min_error_statement" flag should be set in accordance with the organization's logging policy.
 This recommendation is applicable to PostgreSQL database instances.

**Severity**: Low

### [Ensure that the 'log_temp_files' database flag for Cloud SQL PostgreSQL instance is set to '0'](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/29622fc0-14dc-4d65-a5a8-e9a39ffc4b62)

**Description**: PostgreSQL can create a temporary file for actions such as sorting, hashing, and temporary query results when these operations exceed "work_mem."
 The "log_temp_files" flag controls logging names and the file size when it's deleted.
 Configuring "log_temp_files" to 0 causes all temporary file information to be logged, while positive values log only files whose size is greater than or equal to the specified number of kilobytes.
 A value of "-1" disables temporary file information logging.
 If all temporary files aren't logged, it might be more difficult to identify potential performance issues that might be due to either poor application coding or deliberate resource starvation attempts.

**Severity**: Low

### [Ensure VM disks for critical VMs are encrypted with Customer-Supplied Encryption Key](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/6ca40f30-2508-4c90-85b6-36564b909364)

**Description**: Customer-Supplied Encryption Keys (CSEK) are a feature in Google Cloud Storage and Google Compute Engine.
 If you supply your own encryption keys, Google uses your key to protect the Google-generated keys used to encrypt and decrypt your data.
 By default, Google Compute Engine encrypts all data at rest.
 Compute Engine handles and manages this encryption for you without any additional actions on your part.
 However, if you wanted to control and manage this encryption yourself, you can provide your own encryption keys.
By default, Google Compute Engine encrypts all data at rest. Compute Engine handles and manages this encryption for you without any additional actions on your part.
However, if you wanted to control and manage this encryption yourself, you can provide your own encryption keys.
If you provide your own encryption keys, Compute Engine uses your key to protect the Google-generated keys used to encrypt and decrypt your data.
Only users who can provide the correct key can use resources protected by a customer-supplied encryption key.
Google doesn't store your keys on its servers and can't access your protected data unless you provide the key.
This also means that if you forget or lose your key, there's no way for Google to recover the key or to recover any data encrypted with the lost key.
At least business critical VMs should have VM disks encrypted with CSEK.

**Severity**: Medium

### [GCP projects should have Azure Arc auto provisioning enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/1716d754-8d50-4b90-87b6-0404cad9b4e3)

**Description**: For full visibility of the security content from Microsoft Defender for servers, GCP VM instances should be connected to Azure Arc. To ensure that all eligible VM instances automatically receive Azure Arc, enable autoprovisioning from Defender for Cloud at the GCP project level. Learn more about [Azure Arc](../azure-arc/servers/overview.md), and [Microsoft Defender for Servers](plan-defender-for-servers.md).

**Severity**: High

### [GCP VM instances should be connected to Azure Arc](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/9bbe2f0f-d6c6-48e8-b4d0-cf25d2c50206)

**Description**: Connect your GCP Virtual Machines to Azure Arc in order to have full visibility to Microsoft Defender for Servers security content. Learn more about [Azure Arc](../azure-arc/index.yml), and about [Microsoft Defender for Servers](plan-defender-for-servers.md) on hybrid-cloud environment.

**Severity**: High

### [GCP VM instances should have OS config agent installed](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/20622d8c-2a4f-4a03-9896-a5f2f7ede717)

**Description**: To receive the full Defender for Servers capabilities using Azure Arc autoprovisioning, GCP VMs should have OS config agent enabled.

**Severity**: High

### [GKE cluster's auto repair feature should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/6aeb69dc-0d01-4228-88e9-7e610891d5dd)

**Description**: This recommendation evaluates the management property of a node pool for the key-value pair, 'key': 'autoRepair,' 'value': true.

**Severity**: Medium

### [GKE cluster's auto upgrade feature should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/1680e053-2e9b-4e77-a1c7-793ae286155e)

**Description**: This recommendation evaluates the management property of a node pool for the key-value pair, 'key': 'autoUpgrade,' 'value': true.

**Severity**: High

### [Monitoring on GKE clusters should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/6a7b7361-5100-4a8c-b23e-f712d7dad39b)

**Description**: This recommendation evaluates whether the monitoringService property of a cluster contains the location Cloud Monitoring should use to write metrics.

**Severity**: Medium


## Related content

- [learn about security recommendations](security-policy-concept.md)
- [Review security recommendations](review-security-recommendations.md)
