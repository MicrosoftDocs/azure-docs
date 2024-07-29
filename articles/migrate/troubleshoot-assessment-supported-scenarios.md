---
title: Troubleshooting supported scenarios for Assessments
description: Get help for resolving issues with assessments in supported scenarios using Azure Migrate.
author: rashi-ms
ms.author: rajosh
ms.manager: abhemraj
ms.topic: troubleshooting
ms.service: azure-migrate
ms.date: 02/16/2024
ms.custom: engagement-fy24, linux-related-content
---

# Troubleshoot assessment - supported scenarios

This article provides supported scenarios for troubleshooting assessments. See articles [Troubleshoot](troubleshoot-assessment.md) issues with assessment and [FAQ](troubleshoot-assessment-faq.md) for commonly questions about troubleshoot issues with assessment.

## Scenario: Unknown migration tool for import-based Azure VMware Solution assessment

### Cause

For servers imported via a CSV file, the default migration tool in an Azure VMware Solution assessment is unknown.

### Resolution

For servers in a VMware environment, use the VMware Hybrid Cloud Extension (HCX) solution. [Learn more](../azure-vmware/configure-vmware-hcx.md).

## Scenario: Linux VMs are "conditionally ready" in an Azure VM assessment

### Cause

In the case of VMware and Hyper-V VMs, an Azure VM assessment marks Linux VM as **conditionally ready** because of a known gap. 

- The gap prevents it from detecting the minor version of the Linux OS installed on the on-premises VMs.
- For example, for RHEL 6.10, currently an Azure VM assessment detects only RHEL 6 as the OS version. This behavior occurs because the vCenter Server and the Hyper-V host don't provide the kernel version for Linux VM operating systems.
- Since Azure endorses only specific versions of Linux, the Linux VMs are currently marked as **conditionally ready** in an Azure VM assessment.
- You can determine whether the Linux OS running on the on-premises VM is endorsed in Azure by reviewing [Azure Linux support](../virtual-machines/linux/endorsed-distros.md).
- After you've verified the endorsed distribution, you can ignore this warning.

### Resolution

This gap can be addressed by enabling [application discovery](./how-to-discover-applications.md) on the VMware VMs. An Azure VM assessment uses the operating system detected from the VM by using the guest credentials provided. This Operating System data identifies the right OS information in the case of both Windows and Linux VMs.

## Scenario: Operating system version not available

### Cause

For physical servers, the operating system minor version information should be available. If it isn't available, contact Microsoft Support. For servers in a VMware environment, Azure Migrate uses the operating system information specified for the VM in the vCenter Server. But vCenter Server doesn't provide the minor version for operating systems.

### Resolution

To discover the minor version, set up [application discovery](./how-to-discover-applications.md). For Hyper-V VMs, operating system minor version discovery isn't supported. 

## Scenario: Azure SKUs bigger than on-premises in an Azure VM assessment

### Cause

An Azure VM assessment might recommend Azure VM SKUs with more cores and memory than the current on-premises allocation based on the type of assessment:

- The VM SKU recommendation depends on the assessment properties.
- The recommendation is affected by the type of assessment you perform in an Azure VM assessment. The two types are **Performance-based** or **As on-premises**.
- For performance-based assessments, the Azure VM assessment considers the utilization data of the on-premises VMs (CPU, memory, disk, and network utilization) to determine the right target VM SKU for your on-premises VMs. It also adds a comfort factor when determining effective utilization.
- For on-premises sizing, performance data isn't considered, and the target SKU is recommended based on on-premises allocation.

### Resolution

Let's look at an example recommendation:

We have an on-premises VM with 4 cores and 8 GB of memory, with 50% CPU utilization and 50% memory utilization, and a specified comfort factor of 1.3.

- If the assessment is **As on-premises**, an Azure VM SKU with 4 cores and 8 GB of memory is recommended.
- If the assessment is **Performance-based**, based on effective CPU and memory utilization (50% of 4 cores * 1.3 = 2.6 cores and 50% of 8 GB memory * 1.3 = 5.2 GB memory), the cheapest VM SKU of 4 cores (nearest supported core count) and 8 GB of memory (nearest supported memory size) is recommended.
- [Learn more](concepts-assessment-calculation.md#types-of-assessments) about assessment sizing.


## Next steps

[Create](how-to-create-assessment.md) or [customize](how-to-modify-assessment.md) an assessment.
