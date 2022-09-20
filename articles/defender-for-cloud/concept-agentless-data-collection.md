---
title: Agentless scanning of cloud machines using Microsoft Defender for Cloud
description: Learn how Defender for Cloud can gather information about your multicloud compute resources without installing an agent on your machines.
author: bmansheim
ms.author: benmansheim
ms.service: defender-for-cloud
ms.topic: conceptual
ms.date: 09/15/2022
ms.custom: template-concept
---

# Agentless scanning for machines (Preview)

Microsoft Defender for Cloud maximizes coverage on OS posture issues and extends beyond the reach of agent-based assessments. With agentless scanning for VMs, you can get frictionless, wide, and instant visibility on actionable posture issues without installed agents, network connectivity, or machine performance impact.

Agentless scanning for VMs provides vulnerability assessment and software inventory, both powered by Defender vulnerability management, in Azure and Amazon AWS environments. Agentless scanning is available in both [Defender CSPM P1](concept-cloud-security-posture-management.md) and [Defender for Servers P2](defender-for-servers-introduction.md).

## Availability


| Aspect | Details |
|---------|---------|
|Release state:|Preview|
|Pricing:|Requires either [Defender CSPM P1](concept-cloud-security-posture-management.md) or [Microsoft Defender for Servers Plan 2](defender-for-servers-introduction.md#defender-for-servers-plans)|
| Supported use cases:| :::image type="icon" source="./media/icons/yes-icon.png"::: Vulnerability assessment (powered by Defender vulnerability management)<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Software inventory (powered by Defender vulnerability management) | 
| Clouds:    | :::image type="icon" source="./media/icons/yes-icon.png"::: Azure Commercial clouds<br> :::image type="icon" source="./media/icons/no-icon.png"::: Azure Government<br>:::image type="icon" source="./media/icons/no-icon.png"::: Azure China 21Vianet<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Connected AWS accounts<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Connected GCP accounts        |
| Operating systems:    | :::image type="icon" source="./media/icons/yes-icon.png"::: Windows<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Linux        |
| Instance types:    | **Azure**<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Standard VMs<br>:::image type="icon" source="./media/icons/yes-icon.png"::: VMSS Flex<br>:::image type="icon" source="./media/icons/no-icon.png"::: VMSS Uniform<br><br>**AWS**<br>:::image type="icon" source="./media/icons/yes-icon.png"::: EC2<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Auto Scale instances<br>:::image type="icon" source="./media/icons/no-icon.png"::: Instances without a ProductCode (Paid AMIs)        |
| Encryption:    | **Azure**<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Unencrypted<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Encrypted – PMK<br>:::image type="icon" source="./media/icons/no-icon.png"::: Encrypted – CMK<br><br>**AWS**<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Unencrypted<br>:::image type="icon" source="./media/icons/no-icon.png"::: Encrypted        |


## How agentless scanning for VMs works

While agent-based methods use OS APIs in runtime to continuously collect security related data, agentless scanning for VMs uses cloud APIs to collect data. Defender for Cloud takes snapshots of VM disks and does an out-of-band, deep analysis of the OS configuration and file system stored in the snapshot. The copied snapshot doesn't leave the original compute region of the VM, and the VM is never impacted by the scan.

After the necessary metadata is acquired from the disk, Defender for Cloud immediately deletes the copied snapshot of the disk and sends the metadata to Microsoft engines to analyze configuration gaps and potential threats. For vulnerability assessment, for example, Defender for Cloud sends the disk metadata to Defender vulnerability management in order to keep unified results across managed and unmanaged VMs.

The scanning environment where disks are analyzed is regional, volatile, isolated, and highly secure. Disk snapshots and data unrelated to the scan aren't stored longer than is necessary to collect the metadata.

:::image type="content" source="media/concept-agentless-data-collection/agentless-scanning-process.png" alt-text="Diagram of the process for collecting operating system data through agentless scanning.":::

## FAQ

### How scanning affects the instances?
Since the scanning process is an out-of-band analysis of snapshots, it does not impact the actual workloads and is not visible by the guest operating system.

### Does agentless scanning support encrypted disks?
Agentless scanning does not yet support encrypted disks, except for Azure Disk Encryption.

## Next steps

This article explains how agentless scanning works and how it helps you collect data from your machines.

Learn more about how to [enable vulnerability assessment with agentless scanning](deploy-vulnerability-assessment-agentless.md).