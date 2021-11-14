---
title: Attestation for SGX enclaves
description: Verify your confidential computing SGX enclave is secure with attestation.
services: virtual-machines
author: stempesta
ms.service: virtual-machines
ms.subservice: confidential-computing
ms.workload: infrastructure
ms.topic: conceptual
ms.date: 11/01/2020
ms.author: stempesta
ms.custom: ignite-fall-2021
---

# Attestation for SGX Enclaves

Confidential computing on Azure offers Intel SGX-based virtual machines that can isolate a portion of your code or data. When working with these [enclaves](confidential-computing-enclaves.md), you can verify and validate that your trusted environment is secure. This verification is the process of attestation. 

## Overview 

Attestation allows a relying party to have increased confidence that their software is:

1. Running in an enclave
1. Up to date
1. Secure

For example, an enclave can ask the underlying hardware to generate a credential. This credential includes proof that the enclave exists on the platform. A second enclave can receive and verify that the same platform generated the report.

![Diagram of attestation process, showing client's secure exchange with enclave that holds the data and application code.](media/attestation/attestation.png)

Implement attestation with a secure attestation service that is compatible with the system software and silicon. For example:

- [Microsoft Azure Attestation](../attestation/overview.md) 
- [Intel's attestation and provisioning services](https://software.intel.com/sgx/attestation-services)


Both services are compatible with Azure confidential computing Intel SGX DCsv2-series VMs. DCsv3-series and DCdsv3-series VMs aren't compatible with Intel attestation service. 

## Next step

> [!div class="nextstepaction"]
> [Microsoft Azure Attestation samples for enclave aware apps](/samples/azure-samples/microsoft-azure-attestation/sample-code-for-intel-sgx-attestation-using-microsoft-azure-attestation/)
