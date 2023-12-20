---
title: Agentless machine scanning
description: Learn how Defender for Cloud can gather information about your multicloud compute resources without installing an agent on your machines.
author: dcurwin
ms.author: dacurwin
ms.service: defender-for-cloud
ms.topic: conceptual
ms.date: 12/20/2023
ms.custom: template-concept
---

# Agentless machine scanning

Microsoft Defender for Cloud provides comprehensive coverage for operating system posture issues and goes beyond the limitations of agent-based assessments with the addition of an agentless scanner. Agentless scanning is powered by Microsoft Defender Vulnerability Management for virtual machines (VMs). Agentless scanning assists you in the identification process of actionable posture issues without the need for installed agents, network connectivity, or any effect on machine performance.

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

Agent-based methods use operating system APIs in runtime to continuously collect security related data. Agentless scanning for VMs uses cloud APIs to collect data. Defender for Cloud takes snapshots of VM disks and performs a deep analysis of the OS configuration and file system stored in the snapshot. The copied snapshot doesn't leave the original compute region of the VM, and there isn't an effect on the VM by the scan.

Once the necessary metadata is acquired from the disk, Defender for Cloud immediately deletes the copied snapshot of the disk and sends the metadata to Microsoft engines to detect configuration gaps and potential threats. For example, in vulnerability assessment, the analysis is done by Defender Vulnerability Management. The results are displayed in Defender for Cloud, which consolidates both the agent-based and agentless results on the Security alerts page.

The scanning environment where disks are analyzed is regional, volatile, isolated, and highly secure. Disk snapshots and data unrelated to the scan aren't stored longer than is necessary to collect the metadata, typically a few minutes.

:::image type="content" source="media/concept-agentless-data-collection/agentless-scanning-process.png" alt-text="Diagram of the process for collecting operating system data through agentless scanning.":::

## Agentless malware scanning

Defender for Cloud's agentless malware scanning for VMs, uses [Microsoft Defender for Endpoint's](integration-defender-for-endpoint.md) engine to scan and detect malware and various threats. The agentless malware scanner triggers security alerts in Defender for Cloud that allow you to investigate any detected threats.

An agentless approach to malware scanning provides several advantages that are often overlooked when relying solely on an agent-based scanner. By using an agentless scanner, you can eliminate concerns about the time gap that occurs between a device being deployed and the workload owners onboarding the agent to every device added to the environment. If resource owners exempted certain files and folders due to performance concerns, the agentless scanner scans these files and folders regardless. Agentless scanning doesn't affect machine performance since the scan takes place in the cloud, which allows you to offload deep scan performances from the agent-based machines.

When you use both the agent-based scanner and the agentless scanner, you can enjoy the benefits of both services. This combination covers the gap that is often created when only an agent-based system is used.

| **Benefits of agent-based endpoint protection** | **Benefits of agentless malware scanning** |
|--|--|
| Real time monitoring and detection of attacks | Frictionless onboarding, minimal maintenance, lower provisioning costs |
| Behavioral analysis and response | Complete coverage |
| Remediation and response capabilities | No effect on performance due to no presence on the machine |
| Deep Os visibility and threat detection abilities, such as processes, communications and more | Deep and full scan to detect threats on all files and resources (including agent-based excluded files and resources)|
|Active ability to enforce policies, prevent, respond and remediate attacks| No limitation due to incompatible operating systems or machines |

Learn how to [enable agentless scanning for VMs](enable-agentless-scanning-vms.md).

Results for both the agent-based and agentless scanner appear on the Security alerts page.

:::image type="content" source="media/concept-agentless-data-collection/agent-and-agentless-results.png" alt-text="Screenshot of the security alerts page that shows the results of both the agent-based and agentless scan results. The alerts generated by the agentless scan include the word agentless in parenthesis." lightbox="media/concept-agentless-data-collection/agent-and-agentless-results.png":::

> [NOTE!]
> Remediating one of these alerts will not remediate the other alert until the next scan is completed.

From the Security alerts page you can [manage and respond to security alerts](managing-and-responding-alerts.md). Security alerts can also be [exported to Sentinel](export-to-siem.md).

## Next steps

This article explains how agentless scanning works and how it helps you collect data from your machines.

- Learn more about how to [enable agentless scanning for VMs](enable-vulnerability-assessment-agentless.md).

- Check out common questions about agentless scanning and [how it affects the subscription/account](faq-cspm.yml#how-does-scanning-affect-the-account-subscription-), [agentless data collection](faq-data-collection-agents.yml#agentless), and [permissions used by agentless scanning](faq-permissions.yml#which-permissions-are-used-by-agentless-scanning-).
