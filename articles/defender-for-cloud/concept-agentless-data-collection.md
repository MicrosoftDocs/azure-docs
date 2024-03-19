---
title: Agentless machine scanning
description: Learn how Defender for Cloud can gather information about your multicloud compute resources without installing an agent on your machines.
author: dcurwin
ms.author: dacurwin
ms.service: defender-for-cloud
ms.topic: conceptual
ms.date: 12/27/2023
ms.custom: template-concept
---

# Agentless machine scanning

Microsoft Defender for Cloud improves compute posture for Azure, AWS and GCP environments with machine scanning. For requirements and support, see the [compute support matrix in Defender for Cloud](support-matrix-defender-for-servers.md).

Agentless scanning for virtual machines (VM) provides:

- Broad, frictionless visibility into your software inventory using Microsoft Defender Vulnerability Management.
- Deep analysis of operating system configuration and other machine meta data.
- [Vulnerability assessment](enable-agentless-scanning-vms.md) using Defender Vulnerability Management.
- [Secret scanning](secret-scanning.md) to locate plain text secrets in your compute environment.
- Threat detection with [agentless malware scanning](agentless-malware-scanning.md), using [Microsoft Defender Antivirus](/microsoft-365/security/defender-endpoint/microsoft-defender-antivirus-windows).

Agentless scanning assists you in the identification process of actionable posture issues without the need for installed agents, network connectivity, or any effect on machine performance. Agentless scanning is available through both the [Defender Cloud Security Posture Management (CSPM)](concept-cloud-security-posture-management.md) plan and [Defender for Servers P2](plan-defender-for-servers-select-plan.md#plan-features) plan.

## Availability

| Aspect | Details |
|---------|---------|
|Release state:| GA |
|Pricing:|Requires either [Defender Cloud Security Posture Management (CSPM)](concept-cloud-security-posture-management.md) or [Microsoft Defender for Servers Plan 2](plan-defender-for-servers-select-plan.md#plan-features)|
| Supported use cases:| :::image type="icon" source="./media/icons/yes-icon.png"::: [Vulnerability assessment (powered by Defender Vulnerability Management)](deploy-vulnerability-assessment-defender-vulnerability-management.md)<br>:::image type="icon" source="./media/icons/yes-icon.png"::: [Vulnerability assessment (powered by Defender Vulnerability Management)](deploy-vulnerability-assessment-defender-vulnerability-management.md)<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Software inventory (powered by Defender Vulnerability Management)<br />:::image type="icon" source="./media/icons/yes-icon.png"::: [Vulnerability assessment (powered by Defender Vulnerability Management)](deploy-vulnerability-assessment-defender-vulnerability-management.md)<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Software inventory (powered by Defender Vulnerability Management)<br />:::image type="icon" source="./media/icons/yes-icon.png":::[Secret scanning](secret-scanning.md)  <br />:::image type="icon" source="./media/icons/yes-icon.png"::: [Vulnerability assessment (powered by Defender Vulnerability Management)](deploy-vulnerability-assessment-defender-vulnerability-management.md)<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Software inventory (powered by Defender Vulnerability Management)<br />:::image type="icon" source="./media/icons/yes-icon.png":::[Secret scanning](secret-scanning.md)  <br />:::image type="icon" source="./media/icons/yes-icon.png"::: [Malware scanning (Preview)](agentless-malware-scanning.md) **Only available with Defender for Servers plan 2**|
| Clouds:    | :::image type="icon" source="./media/icons/yes-icon.png"::: Azure Commercial clouds<br> :::image type="icon" source="./media/icons/yes-icon.png"::: Azure Commercial clouds<br> :::image type="icon" source="./media/icons/no-icon.png"::: Azure Government<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Azure Commercial clouds<br> :::image type="icon" source="./media/icons/no-icon.png"::: Azure Government<br>:::image type="icon" source="./media/icons/no-icon.png"::: Microsoft Azure operated by 21Vianet<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Azure Commercial clouds<br> :::image type="icon" source="./media/icons/no-icon.png"::: Azure Government<br>:::image type="icon" source="./media/icons/no-icon.png"::: Microsoft Azure operated by 21Vianet<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Connected AWS accounts<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Azure Commercial clouds<br> :::image type="icon" source="./media/icons/no-icon.png"::: Azure Government<br>:::image type="icon" source="./media/icons/no-icon.png"::: Microsoft Azure operated by 21Vianet<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Connected AWS accounts<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Connected GCP projects        |
| Operating systems:    | :::image type="icon" source="./media/icons/yes-icon.png"::: Windows<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Windows<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Linux        |
| Instance and disk types:    | **Azure**<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Standard VMs<br>:::image type="icon" source="./media/icons/no-icon.png"::: Unmanaged disks<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Virtual machine scale set - Flex<br>:::image type="icon" source="./media/icons/no-icon.png"::: Virtual machine scale set - Uniform<br><br>**AWS**<br>:::image type="icon" source="./media/icons/yes-icon.png"::: EC2<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Auto Scale instances<br>:::image type="icon" source="./media/icons/no-icon.png"::: Instances with a ProductCode (Paid AMIs)<br><br>**GCP**<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Compute instances<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Instance groups (managed and unmanaged)       |
| Encryption: | **Azure**<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Unencrypted<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Encrypted – managed disks using [Azure Storage encryption](../virtual-machines/disk-encryption.md) with platform-managed keys (PMK)<br>:::image type="icon" source="./media/icons/no-icon.png"::: Encrypted – other scenarios using platform-managed keys (PMK)<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Encrypted – customer-managed keys (CMK) (preview)<br><br>**AWS**<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Unencrypted<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Encrypted - PMK<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Encrypted - CMK<br><br>**GCP**<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Google-managed encryption key<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Customer-managed encryption key (CMEK)<br>:::image type="icon" source="./media/icons/no-icon.png"::: Customer-supplied encryption key (CSEK)  |

## How agentless scanning works

Agentless scanning for VMs uses cloud APIs to collect data. Whereas agent-based methods use operating system APIs in runtime to continuously collect security related data. Defender for Cloud takes snapshots of VM disks and performs an out-of-band, deep analysis of the operating system configuration and file system stored in the snapshot. The copied snapshot remains in the same region as the VM. The VM isn't affected by the scan.

After acquiring the necessary metadata is acquired from the copied disk, Defender for Cloud immediately deletes the copied snapshot of the disk and sends the metadata to Microsoft engines to detect configuration gaps and potential threats. For example, in vulnerability assessment, the analysis is done by Defender Vulnerability Management. The results are displayed in Defender for Cloud, which consolidates both the agent-based and agentless results on the Security alerts page.

The scanning environment where disks are analyzed is regional, volatile, isolated, and highly secure. Disk snapshots and data unrelated to the scan aren't stored longer than is necessary to collect the metadata, typically a few minutes.

:::image type="content" source="media/concept-agentless-data-collection/agentless-scanning-process.png" alt-text="Diagram of the process for collecting operating system data through agentless scanning.":::

## Next steps

This article explains how agentless scanning works and how it helps you collect data from your machines.

- Learn more about how to [enable agentless scanning for VMs](enable-vulnerability-assessment-agentless.md).

- Check out common questions about agentless scanning and [how it affects the subscription/account](faq-cspm.yml#how-does-scanning-affect-the-account-subscription-), [agentless data collection](faq-data-collection-agents.yml#agentless), and [permissions used by agentless scanning](faq-permissions.yml#which-permissions-are-used-by-agentless-scanning-).
