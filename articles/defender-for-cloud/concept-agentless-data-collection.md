---
title: Agentless machine scanning
description: Learn how Defender for Cloud can gather information about your multicloud compute resources without installing an agent on your machines.
author: dcurwin
ms.author: dacurwin
ms.service: defender-for-cloud
ms.topic: conceptual
ms.date: 12/19/2023
ms.custom: template-concept
---

# Agentless machine scanning

Microsoft Defender for Cloud provides comprehensive coverage for operating system posture issues and goes beyond the limitations of agent-based assessments with the addition af an agentless scanner. Agentless scanning powered by Microsoft Defender Vulnerability Management for virtual machines (VMs) assists you in the identification process of actionable posture issues without the need for installed agents, network connectivity, or any impact on machine performance.

Agentless scanning for VMs provides vulnerability assessment and software inventory. Agentless scanning is available through both the [Defender Cloud Security Posture Management (CSPM)](concept-cloud-security-posture-management.md) plan and [Defender for Servers P2](plan-defender-for-servers-select-plan.md#plan-features) plan.

## Availability

| Aspect | Details |
|---------|---------|
|Release state:| GA |
|Pricing:|Requires either [Defender Cloud Security Posture Management (CSPM)](concept-cloud-security-posture-management.md) or [Microsoft Defender for Servers Plan 2](plan-defender-for-servers-select-plan.md#plan-features)|
| Supported use cases:| :::image type="icon" source="./media/icons/yes-icon.png"::: Vulnerability assessment (powered by Defender Vulnerability Management)<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Software inventory (powered by Defender Vulnerability Management)<br />:::image type="icon" source="./media/icons/yes-icon.png":::Secret scanning |
| Clouds:    | :::image type="icon" source="./media/icons/yes-icon.png"::: Azure Commercial clouds<br> :::image type="icon" source="./media/icons/no-icon.png"::: Azure Government<br>:::image type="icon" source="./media/icons/no-icon.png"::: Microsoft Azure operated by 21Vianet<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Connected AWS accounts<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Connected GCP projects        |
| Operating systems:    | :::image type="icon" source="./media/icons/yes-icon.png"::: Windows<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Linux        |
| Instance and disk types:    | **Azure**<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Standard VMs<br>:::image type="icon" source="./media/icons/no-icon.png"::: Unmanaged disks<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Virtual machine scale set - Flex<br>:::image type="icon" source="./media/icons/no-icon.png"::: Virtual machine scale set - Uniform<br><br>**AWS**<br>:::image type="icon" source="./media/icons/yes-icon.png"::: EC2<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Auto Scale instances<br>:::image type="icon" source="./media/icons/no-icon.png"::: Instances with a ProductCode (Paid AMIs)<br><br>**GCP**<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Compute instances<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Instance groups (managed and unmanaged)       |
| Encryption: | **Azure**<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Unencrypted<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Encrypted – managed disks using [Azure Storage encryption](../virtual-machines/disk-encryption.md) with platform-managed keys (PMK)<br>:::image type="icon" source="./media/icons/no-icon.png"::: Encrypted – other scenarios using platform-managed keys (PMK)<br>:::image type="icon" source="./media/icons/no-icon.png"::: Encrypted – customer-managed keys (CMK)<br><br>**AWS**<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Unencrypted<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Encrypted - PMK<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Encrypted - CMK<br><br>**GCP**<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Google-managed encryption key<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Customer-managed encryption key (CMEK)<br>:::image type="icon" source="./media/icons/no-icon.png"::: Customer-supplied encryption key (CSEK)  |

## How agentless scanning for VMs works

Agent-based methods use operating system APIs in runtime to continuously collect security related data. Agentless scanning for VMs uses cloud APIs to collect data. Defender for Cloud takes snapshots of VM disks and performs a deep analysis of the OS configuration and file system stored in the snapshot. The copied snapshot doesn't leave the original compute region of the VM, and the VM is never impacted by the scan.

Once the necessary metadata is acquired from the disk, Defender for Cloud immediately deletes the copied snapshot of the disk and sends the metadata to Microsoft engines to detect configuration gaps and potential threats. For example, in vulnerability assessment, the analysis is done by Defender Vulnerability Management. The results are displayed in Defender for Cloud which  consolidates both the agent-based and agentless results on the .

The scanning environment where disks are analyzed is regional, volatile, isolated, and highly secure. Disk snapshots and data unrelated to the scan aren't stored longer than is necessary to collect the metadata, typically a few minutes.

:::image type="content" source="media/concept-agentless-data-collection/agentless-scanning-process.png" alt-text="Diagram of the process for collecting operating system data through agentless scanning.":::

## Agentless malware scanning

Defender for Cloud's agentless malware scanning for VM, utilizes Defender for Endpoint anti-virus engine to scan and detect malware and various threats. The agentless malware scanner triggers security alerts that allow you to investigate any detected threats.

Agentless malware scanning afford many benefits that are often missed by using an agent based scanner alone. With an agentless scanner, you no longer need to worry about the gap in time that takes place between a device being deployed by a security agent to the time the workload owners onboards the agent to every device that is added to an environment. You no longer need to worry about vulnerabilities that may exist in files and folders that were exempted by resource owners due to the fear of performance impact on their machines. Agentless scanning doesn't have an effect on your machines performance because the scan takes place in the cloud.

By combining the benefits of both the agent-based scanner along with the agentless scanner you are afforded the benefits of both services and covering the gap that is often created when an agent-based system is used alone.

| Benefits of agent-based malware scanning | Benefits of agentless malware scanning |
|--|--|
| Real time protection | Frictionless onboarding |
| Behavioral analysis and response | Results within hours |
| Remediation and response capabilities | No effect on performance due to no presence on the machine |
| Threat detection | No dependency on workload owners|
|-| No limitation due to incompatible operating systems or machines |

Learn how to [enable agentless scanning for VMs](enable-agentless-scanning-vms.md).

Defender for Cloud's utilizes the same malware scanner as Microsoft Defender for Endpoint. The scanner performs daily quick scans, weekly full scans, heuristic and signature based threat detection, signature updates, cloud protection and more. once a scan completes, and detected threats are sent to the Security alerts page where they cam be [managed and remediated](managing-and-responding-alerts.md). You can also [export security alerts to Sentinel](export-to-siem.md).




## Next steps

This article explains how agentless scanning works and how it helps you collect data from your machines.

- Learn more about how to [enable agentless scanning for VMs](enable-vulnerability-assessment-agentless.md).

- Check out common questions about agentless scanning and [how it affects the subscription/account](faq-cspm.yml#how-does-scanning-affect-the-account-subscription-), [agentless data collection](faq-data-collection-agents.yml#agentless), and [permissions used by agentless scanning](faq-permissions.yml#which-permissions-are-used-by-agentless-scanning-).
