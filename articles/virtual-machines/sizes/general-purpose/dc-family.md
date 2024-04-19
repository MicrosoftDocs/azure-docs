---
title: DC sub-family VM size series 
description: Overview of the 'DC' sub-family of virtual machine sizes
author: mattmcinnes
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 04/16/2024
ms.author: mattmcinnes
---

# 'DC' sub-family general purpose VM size series

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

> [!NOTE]
> 'DC' family VMs are specialized for confidential computing scenarios. If your workload doesn't require confidential compute and you're looking for general purpose VMs with similar specs, consider the [the standard D-family size series](./d-family.md).

The 'DC' sub-family of VM size series are one of Azure's security focused general purpose VM instances. They're designed for [confidential computing](../../../confidential-computing/overview-azure-products.md) with enhanced data protection and code confidentiality, featuring hardware-based Trusted Execution Environments (TEEs) with Intel's Software Guard Extensions (SGX). These VMs are ideal for handling highly sensitive data that demands isolation from the host environment, such as in scenarios involving secure enclaves for processing private data, financial transactions, and personally identifiable information (PII), ensuring a higher level of security for critical applications.

## Workloads and use cases

- **Confidential Computing:** They support secure enclave technology using Intel SGX, which allows parts of the VM memory to be isolated from the main operating system. This enclave securely processes sensitive data, ensuring that it is protected even from privileged users and underlying system software.

- **Data Protection:** DC-series VMs are ideal for applications that manage, store, and process sensitive data, such as personal identifiable information (PII), financial data, health records, and other types of confidential information. The hardware-based encryption ensures that data is protected at rest and during processing.

- **Regulatory Compliance:** For businesses that need to comply with stringent regulatory requirements for data privacy and security (like GDPR, HIPAA, or financial industry regulations), DC-series VMs provide a hardware-assured environment that can help meet these compliance demands.

## Series in family

### DCsv2-series
[!INCLUDE [dcsv2-series-summary](./includes/dcsv2-series-summary.md)]

[View the full DCsv2-series page](../../dcv2-series.md).

[!INCLUDE [dcsv2-series-specs](./includes/dcsv2-series-specs.md)]


### DCsv3 and DCdsv3-series
[!INCLUDE [dcsv3-dcdsv3-series-summary](./includes/dcsv3-dcdsv3-series-summary.md)]

[View the full DCsv3 and DCdsv3-series page](../../dcv3-series.md).

[!INCLUDE [dcsv3-dcdsv3-series-specs](./includes/dcsv3-dcdsv3-series-specs.md)]


### DCasv5 and DCadsv5-series
[!INCLUDE [dcasv5-dcadsv5-series-summary](./includes/dcasv5-dcadsv5-series-summary.md)]

[View the full DCasv5 and DCadsv5-series page](../../dcasv5-dcadsv5-series.md).

[!INCLUDE [dcasv5-dcadsv5-series-specs](./includes/dcasv5-dcadsv5-series-specs.md)]


### DCas_cc_v5 and DCads_cc_v5-series
[!INCLUDE [dcasccv5-dcadsccv5-series-summary](./includes/dcasccv5-dcadsccv5-series-summary.md)]

[View the full DCas_cc_v5 and DCads_cc_v5-series page](../../dcasccv5-dcadsccv5-series.md).

[!INCLUDE [dcasccv5-dcadsccv5-series-specs](./includes/dcasccv5-dcadsccv5-series-specs.md)]


### DCesv5 and DCedsv5-series
[!INCLUDE [dcesv5-dcedsv5-series-summary](./includes/dcesv5-dcedsv5-series-summary.md)]

[View the full DCesv5 and DCedsv5-series page](../../dcesv5-dcedsv5-series.md).

[!INCLUDE [dcesv5-dcedsv5-series-specs](./includes/dcesv5-dcedsv5-series-specs.md)]


[!INCLUDE [sizes-footer](../includes/sizes-footer.md)]
