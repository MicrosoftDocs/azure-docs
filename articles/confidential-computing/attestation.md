---
title: Attestation for SGX enclaves
description: You can use attestation to verify that your Azure confidential computing SGX enclave is secure.
services: virtual-machines
author: mamccrea
ms.service: virtual-machines
ms.subservice: confidential-computing
ms.workload: infrastructure
ms.topic: conceptual
ms.date: 12/20/2021
ms.author: mamccrea
ms.custom: ignite-fall-2021
---

# Attestation for SGX Enclaves

Azure confidential computing offers Intel SGX-based virtual machines (VMs) for isolating a portion of your code or data. When you [build with SGX enclaves](confidential-computing-enclaves.md), you can verify and validate that your trusted environment is secure. This verification is the process of attestation. 

## Overview

With attestation, a relying party can have increased confidence that their software runs in an enclave, is up-to-date, and is secure.

For example, an enclave can ask the underlying hardware to generate a credential. This credential includes proof that the enclave exists on the platform. A second enclave can receive and verify that the same platform generated the report.

:::image type="content" source="./media/attestation/attestation.png" alt-text="Diagram of attestation process, showing client's secure exchange with enclave that holds the data and application code.":::

Implement attestation with a secure attestation service that is compatible with the system software and silicon. Two options are [Microsoft Azure Attestation](../attestation/overview.md), and [Intel's attestation and provisioning services](https://software.intel.com/sgx/attestation-services).Both services are compatible with Intel SGX **DCsv2-series** VMs in Azure confidential computing. However, **DCsv3-series** and **DCdsv3-series** VMs aren't compatible with Intel attestation service. 

## Next step

> [!div class="nextstepaction"]
> [Microsoft Azure Attestation samples for enclave aware apps](/samples/azure-samples/microsoft-azure-attestation/sample-code-for-intel-sgx-attestation-using-microsoft-azure-attestation/)
