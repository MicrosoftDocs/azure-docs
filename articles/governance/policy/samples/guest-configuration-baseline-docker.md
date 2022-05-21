---
title: Reference - Azure Policy guest configuration baseline for Docker
description: Details of the Docker baseline on Azure implemented through Azure Policy guest configuration.
ms.date: 05/17/2022
ms.topic: reference
ms.custom: generated
---
# Docker security baseline

This article details the configuration settings for Docker hosts as applicable in the following
implementations:

- **\[Preview\]: Linux machines should meet requirements for the Azure security baseline for Docker hosts**
- **Vulnerabilities in security configuration on your machines should be remediated** in Azure
  Security Center

For more information, see [Understand the guest configuration feature of Azure Policy](../concepts/guest-configuration.md) and
[Overview of the Azure Security Benchmark (V2)](../../../security/benchmarks/overview.md).

## General security controls

|Name<br /><sub>(CCEID)</sub> |Details |Remediation check |
|---|---|---|
|Docker inventory Information<br /><sub>(0.0)</sub> |Description: None |None |
|Ensure a separate partition for containers has been created<br /><sub>(1.01)</sub> |Description: Docker depends on `/var/lib/docker` as the default directory where all Docker related files, including the images, are stored. This directory might fill up fast and soon Docker and the host could become unusable. So, it is advisable to create a separate partition (logical volume) for storing Docker files. |For new installations, create a separate partition for `/var/lib/docker` mount point. For systems that were previously installed, use the Logical Volume Manager (LVM) to create partitions. |
|Ensure docker version is up-to-date<br /><sub>(1.03)</sub> |Description: Using up-to-date docker version will keep your host secure |Follow the docker documentation in aim to upgrade your version |

> [!NOTE]
> Availability of specific Azure Policy guest configuration settings may vary in Azure Government
> and other national clouds.

## Next steps

Additional articles about Azure Policy and guest configuration:

- [Understand the guest configuration feature of Azure Policy]Understand the guest configuration feature of Azure Polic(../concepts/guest-configuration.md).
- [Regulatory Compliance](../concepts/regulatory-compliance.md) overview.
- Review other examples at [Azure Policy samples](./index.md).
- Review [Understanding policy effects](../concepts/effects.md).
- Learn how to [remediate non-compliant resources](../how-to/remediate-resources.md).
