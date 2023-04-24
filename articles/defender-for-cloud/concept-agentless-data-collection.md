---
title: Agentless scanning of cloud machines using Microsoft Defender for Cloud
description: Learn how Defender for Cloud can gather information about your multicloud compute resources without installing an agent on your machines.
author: bmansheim
ms.author: benmansheim
ms.service: defender-for-cloud
ms.topic: conceptual
ms.date: 09/28/2022
ms.custom: template-concept, ignite-2022
---

# Agentless scanning for machines

Microsoft Defender for Cloud maximizes coverage on OS posture issues and extends beyond the reach of agent-based assessments. With agentless scanning for VMs, you can get frictionless, wide, and instant visibility on actionable posture issues without installed agents, network connectivity requirements, or machine performance impact.

Agentless scanning for VMs provides vulnerability assessment and software inventory, both powered by Microsoft Defender Vulnerability Management, in Azure and Amazon AWS environments. Agentless scanning is available in both [Defender Cloud Security Posture Management (CSPM)](concept-cloud-security-posture-management.md) and [Defender for Servers P2](defender-for-servers-introduction.md).

## Availability

| Aspect | Details |
|---------|---------|
|Release state:| GA |
|Pricing:|Requires either [Defender Cloud Security Posture Management (CSPM)](concept-cloud-security-posture-management.md) or [Microsoft Defender for Servers Plan 2](plan-defender-for-servers-select-plan.md#plan-features)|
| Supported use cases:| :::image type="icon" source="./media/icons/yes-icon.png"::: Vulnerability assessment (powered by Defender Vulnerability Management)<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Software inventory (powered by Defender Vulnerability Management) | 
| Clouds:    | :::image type="icon" source="./media/icons/yes-icon.png"::: Azure Commercial clouds<br> :::image type="icon" source="./media/icons/no-icon.png"::: Azure Government<br>:::image type="icon" source="./media/icons/no-icon.png"::: Azure China 21Vianet<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Connected AWS accounts<br>:::image type="icon" source="./media/icons/no-icon.png"::: Connected GCP accounts        |
| Operating systems:    | :::image type="icon" source="./media/icons/yes-icon.png"::: Windows<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Linux        |
| Instance types:    | **Azure**<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Standard VMs<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Virtual machine scale set - Flex<br>:::image type="icon" source="./media/icons/no-icon.png"::: Virtual machine scale set - Uniform<br><br>**AWS**<br>:::image type="icon" source="./media/icons/yes-icon.png"::: EC2<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Auto Scale instances<br>:::image type="icon" source="./media/icons/no-icon.png"::: Instances with a ProductCode (Paid AMIs)        |
| Encryption: | **Azure**<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Unencrypted<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Encrypted – managed disks using [Azure Storage encryption](../virtual-machines/disk-encryption.md) with platform-managed keys (PMK)<br>:::image type="icon" source="./media/icons/no-icon.png"::: Encrypted – other scenarios using platform-managed keys (PMK)<br>:::image type="icon" source="./media/icons/no-icon.png"::: Encrypted – customer-managed keys (CMK)<br><br>**AWS**<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Unencrypted<br>:::image type="icon" source="./media/icons/no-icon.png"::: Encrypted |

## How agentless scanning for VMs works

While agent-based methods use OS APIs in runtime to continuously collect security related data, agentless scanning for VMs uses cloud APIs to collect data. Defender for Cloud takes snapshots of VM disks and does an out-of-band, deep analysis of the OS configuration and file system stored in the snapshot. The copied snapshot doesn't leave the original compute region of the VM, and the VM is never impacted by the scan.

After the necessary metadata is acquired from the disk, Defender for Cloud immediately deletes the copied snapshot of the disk and sends the metadata to Microsoft engines to analyze configuration gaps and potential threats. For example, in vulnerability assessment, the analysis is done by Defender Vulnerability Management. The results are displayed in Defender for Cloud, seamlessly consolidating agent-based and agentless results.

The scanning environment where disks are analyzed is regional, volatile, isolated, and highly secure. Disk snapshots and data unrelated to the scan aren't stored longer than is necessary to collect the metadata, typically a few minutes.

:::image type="content" source="media/concept-agentless-data-collection/agentless-scanning-process.png" alt-text="Diagram of the process for collecting operating system data through agentless scanning.":::

## FAQ

### How does scanning affect the instances?
Since the scanning process is an out-of-band analysis of snapshots, it doesn't impact the actual workloads and isn't visible by the guest operating system.

### How does scanning affect the account/subscription?

The scanning process has minimal footprint on your accounts and subscriptions.

| Cloud provider  | Changes  |
|---------|---------|
| Azure    | - Adds a “VM Scanner Operator” role assignment<br>- Adds a “vmScanners” resource with the relevant configurations used to manage the scanning process        |
| AWS     | - Adds role assignment<br>- Adds authorized audience to OpenIDConnect provider<br>- Snapshots are created next to the scanned volumes, in the same account, during the scan (typically for a few minutes)        |

### What is the scan freshness?

Each VM is scanned every 24 hours.

### Which permissions are used by agentless scanning?

The roles and permissions used by Defender for Cloud to perform agentless scanning on your Azure and AWS environments are listed here. In Azure, these permissions are automatically added to your subscriptions when you enable agentless scanning. In AWS, these permissions are [added to the CloudFormation stack in your AWS connector](enable-vulnerability-assessment-agentless.md#agentless-vulnerability-assessment-on-aws).

- Azure	permissions - The built-in role “VM scanner operator” has read-only permissions for VM disks which are required for the snapshot process. The detailed list of permissions is:

    - `Microsoft.Compute/disks/read`
    - `Microsoft.Compute/disks/beginGetAccess/action`
    - `Microsoft.Compute/virtualMachines/instanceView/read`
    - `Microsoft.Compute/virtualMachines/read`
    - `Microsoft.Compute/virtualMachineScaleSets/instanceView/read`
    - `Microsoft.Compute/virtualMachineScaleSets/read`
    - `Microsoft.Compute/virtualMachineScaleSets/virtualMachines/read`
    - `Microsoft.Compute/virtualMachineScaleSets/virtualMachines/instanceView/read`

- AWS permissions - The role “VmScanner” is assigned to the scanner when you enable agentless scanning. This role has the minimal permission set to create and clean up snapshots (scoped by tag) and to verify the current state of the VM. The detailed list of permissions is:

    - `ec2:DeleteSnapshot`
    - `ec2:ModifySnapshotAttribute`
    - `ec2:DeleteTags`
    - `ec2:CreateTags`
    - `ec2:CreateSnapshots`
    - `ec2:CreateSnapshot`
    - `ec2:DescribeSnapshots`
    - `ec2:DescribeInstanceStatus`

### Which data is collected from snapshots?

Agentless scanning collects data similar to the data an agent collects to perform the same analysis. Raw data, PIIs or sensitive business data isn't collected, and only metadata results are sent to Defender for Cloud.

### What are the costs related to agentless scanning?

Agentless scanning is included in Defender Cloud Security Posture Management (CSPM) and Defender for Servers P2 plans. No other costs will incur to Defender for Cloud when enabling it.

> [!NOTE]
> AWS charges for retention of disk snapshots. Defender for Cloud scanning process actively tries to minimize the period during which a snapshot is stored in your account (typically up to a few minutes), but you may be charged by AWS a minimal overhead cost for the disk snapshots storage.

### How are VM snapshots secured?

Agentless scanning protects disk snapshots according to Microsoft’s highest security standards. To ensure VM snapshots are private and secure during the analysis process, some of the measures taken are:

- Data is encrypted at rest and in-transit.
- Snapshots are immediately deleted when the analysis process is complete.
- Snapshots remain within their original AWS or Azure region. EC2 snapshots aren't copied to Azure.
- Isolation of environments per customer account/subscription.
- Only metadata containing scan results is sent outside the isolated scanning environment.
- All operations are audited.

### Does agentless scanning support encrypted disks?
Agentless scanning doesn't currently support encrypted disks, except for Azure managed disks using [Azure Storage encryption](../virtual-machines/disk-encryption.md) with platform-managed keys (PMK).

## Next steps

This article explains how agentless scanning works and how it helps you collect data from your machines.

Learn more about how to [enable vulnerability assessment with agentless scanning](enable-vulnerability-assessment-agentless.md).
