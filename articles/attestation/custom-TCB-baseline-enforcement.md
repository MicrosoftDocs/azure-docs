---
title: Custom TCB baseline enforcement for SGX attestation
description: Custom TCB baseline enforcement for SGX attestation
services: attestation
author: msmbaldwin
ms.service: attestation
ms.topic: overview
ms.date: 11/30/2022
ms.author: mbaldwin


---

# Custom TCB baseline enforcement for SGX attestation


Microsoft Azure Attestation is a unified solution for attesting different types of Trusted Execution Environments (TEEs) such as [Intel® Software Guard Extensions](https://www.intel.com/content/www/us/en/architecture-and-technology/software-guard-extensions.html) (SGX) enclaves. While attesting SGX enclaves, Azure Attestation validates the evidence against Azure default Trusted Computing Base (TCB) baseline. The default TCB baseline is provided by an Azure service named [Trusted Hardware Identity Management](https://learn.microsoft.com/en-us/azure/security/fundamentals/trusted-hardware-identity-management) (THIM) and includes collateral fetched from Intel like certificate revocation lists (CRLs), Intel certificates, Trusted Computing Base (TCB) information and Quoting Enclave identity (QEID).  The default TCB baseline from THIM lags the latest baseline offered by Intel and is expected to remain at tcbEvaluationDataNumber 10. 

The custom TCB baseline enforcement feature in Azure Attestation will enable you to perform SGX attestation against a desired TCB baseline, as opposed to the Azure default TCB baseline which is applied across [Azure Confidential Computing](https://azure.microsoft.com/en-us/solutions/confidential-compute/) (ACC) fleet today.

## Why use custom TCB baseline enforcement feature?

The feature can be used in the following scenarios:

•	**To perform SGX attestation against newer TCB offered by Intel** – Security conscious customers can perform timely roll out of platform software (PSW) updates as recommended by Intel and use the custom baseline enforcement feature to perform their SGX attestation against the newer TCB versions supported by Intel 

•	**To perform platform software (PSW) updates at your own cadence** – Customers who prefer to update PSW at their own cadence, can use custom baseline enforcement feature to perform SGX attestation against the older TCB baseline, until the PSW updates are rolled out
