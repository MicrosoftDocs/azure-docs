---
title: Learn about agentless scanning for VMs
description: Learn how Defender for Cloud can gather information about your multicloud compute resources without installing an agent on your machines.
author: dcurwin
ms.author: dacurwin
ms.service: defender-for-cloud
ms.topic: conceptual
ms.date: 06/29/2023
ms.custom: template-concept, ignite-2022
---

# Learn about agentless scanning

Microsoft Defender for Cloud maximizes coverage on OS posture issues and extends beyond the reach of agent-based assessments. With agentless scanning for VMs, you can get frictionless, wide, and instant visibility on actionable posture issues without installed agents, network connectivity requirements, or machine performance impact.

Agentless scanning for VMs provides vulnerability assessment and software inventory, both powered by Microsoft Defender Vulnerability Management, in Azure and Amazon AWS environments. Agentless scanning is available in both [Defender Cloud Security Posture Management (CSPM)](concept-cloud-security-posture-management.md) and [Defender for Servers P2](defender-for-servers-introduction.md).

## Availability

| Aspect | Details |
|---------|---------|
|Release state:| GA |
|Pricing:|Requires either [Defender Cloud Security Posture Management (CSPM)](concept-cloud-security-posture-management.md) or [Microsoft Defender for Servers Plan 2](plan-defender-for-servers-select-plan.md#plan-features)|
| Supported use cases:| :::image type="icon" source="./media/icons/yes-icon.png"::: Vulnerability assessment (powered by Defender Vulnerability Management)<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Software inventory (powered by Defender Vulnerability Management)<br />:::image type="icon" source="./media/icons/yes-icon.png":::Secret scanning (Preview) |
| Clouds:    | :::image type="icon" source="./media/icons/yes-icon.png"::: Azure Commercial clouds<br> :::image type="icon" source="./media/icons/no-icon.png"::: Azure Government<br>:::image type="icon" source="./media/icons/no-icon.png"::: Microsoft Azure operated by 21Vianet<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Connected AWS accounts<br>:::image type="icon" source="./media/icons/no-icon.png"::: Connected GCP accounts        |
| Operating systems:    | :::image type="icon" source="./media/icons/yes-icon.png"::: Windows<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Linux        |
| Instance and disk types:    | **Azure**<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Standard VMs<br>:::image type="icon" source="./media/icons/no-icon.png"::: Unmanaged disks<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Virtual machine scale set - Flex<br>:::image type="icon" source="./media/icons/no-icon.png"::: Virtual machine scale set - Uniform<br><br>**AWS**<br>:::image type="icon" source="./media/icons/yes-icon.png"::: EC2<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Auto Scale instances<br>:::image type="icon" source="./media/icons/no-icon.png"::: Instances with a ProductCode (Paid AMIs)        |
| Encryption: | **Azure**<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Unencrypted<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Encrypted – managed disks using [Azure Storage encryption](../virtual-machines/disk-encryption.md) with platform-managed keys (PMK)<br>:::image type="icon" source="./media/icons/no-icon.png"::: Encrypted – other scenarios using platform-managed keys (PMK)<br>:::image type="icon" source="./media/icons/no-icon.png"::: Encrypted – customer-managed keys (CMK)<br><br>**AWS**<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Unencrypted<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Encrypted - PMK<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Encrypted - CMK |

## How agentless scanning for VMs works

While agent-based methods use OS APIs in runtime to continuously collect security related data, agentless scanning for VMs uses cloud APIs to collect data. Defender for Cloud takes snapshots of VM disks and does an out-of-band, deep analysis of the OS configuration and file system stored in the snapshot. The copied snapshot doesn't leave the original compute region of the VM, and the VM is never impacted by the scan.

After the necessary metadata is acquired from the disk, Defender for Cloud immediately deletes the copied snapshot of the disk and sends the metadata to Microsoft engines to analyze configuration gaps and potential threats. For example, in vulnerability assessment, the analysis is done by Defender Vulnerability Management. The results are displayed in Defender for Cloud, seamlessly consolidating agent-based and agentless results.

The scanning environment where disks are analyzed is regional, volatile, isolated, and highly secure. Disk snapshots and data unrelated to the scan aren't stored longer than is necessary to collect the metadata, typically a few minutes.

:::image type="content" source="media/concept-agentless-data-collection/agentless-scanning-process.png" alt-text="Diagram of the process for collecting operating system data through agentless scanning.":::

## Next steps

This article explains how agentless scanning works and how it helps you collect data from your machines.

- Learn more about how to [enable agentless scanning for VMs](enable-vulnerability-assessment-agentless.md).

- Check out Defender for Cloud's [common questions](faq-data-collection-agents.yml) for more information on agentless scanning for machines.
