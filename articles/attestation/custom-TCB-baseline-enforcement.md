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

We recommend Azure Attestation users to use the feature as it can be used in the following scenarios:

**To perform SGX attestation against newer TCB offered by Intel** – Security conscious customers can perform timely roll out of platform software (PSW) updates as recommended by Intel and use the custom baseline enforcement feature to perform their SGX attestation against the newer TCB versions supported by Intel 

**To perform platform software (PSW) updates at your own cadence** – Customers who prefer to update PSW at their own cadence, can use custom baseline enforcement feature to perform SGX attestation against the older TCB baseline, until the PSW updates are rolled out

## Default TCB baseline used by Azure Attestation when no custom TCB baseline is configured by users

            TCB identifier: “azuredefault”
            TCB evaluation data number": "10"           
            Tcb release date: "2020-11-11T00:00:00"           
            Minimum PSW Linux version: "2.9",            
            Minimum PSW Windows version: "2.7.101.2"

## TCB baselines available in Azure which could be configured as custom TCB baseline

            TCB identifier: “11”
            TCB evaluation data number": "11"
            Tcb release date: "2021-06-09T00:00:00"
            Minimum PSW Linux version: "2.13.3",
            Minimum PSW Windows version: "2.13.100.2"

            TCB identifier: “10”
            TCB evaluation data number": "10"
            Tcb release date: "2020-11-11T00:00:00"
            Minimum PSW Linux version: "2.9",
            Minimum PSW Windows version: "2.7.101.2"
            
## How to configure an attestation policy with custom TCB baseline using Azure portal experience

### New users
1.	Create an attestation provider using Azure portal experience. [Details here]() 
2.	Go to overview page and view the current default policy of the attestation provider. [Details here]() 
3.	Click on View current and available TCB for attestation, view the available TCB, identify the desired TCB identifier and click Cancel 
4.	Click Configure, set x-ms-sgx-tcbidentifier claim value in the policy to the desired value and click Save

### Existing shared provider users 
Shared provider users need to migrate to custom providers to be able to perform attestation against custom TCB baseline
1.	Create an attestation provider using Azure portal experience. [Details here]() 
2.	Go to overview page and view the current default policy of the attestation provider. [Details here]() 
3.	Click on View available TCB for attestation, view the available TCB, identify the desired TCB identifier and click Cancel 
4.	Click Configure, set x-ms-sgx-tcbidentifier claim value in the policy to the desired value and click Save
5.	Needs code deployment to send attestation requests to the custom attestation provider

### Existing custom provider users with default/custom attestation policy
1.	Go to overview page and view the current default policy of the attestation provider. [Details here]() 
2.	Click on View available TCB for attestation, view the available TCB, identify the desired TCB identifier and click Cancel 
3.	Click Configure, and use the sample below for configuring an attestation policy with a custom TCB baseline. 

            version = 1.1; 
            configurationrules 
            { 
            => issueproperty ( 
            type = "x-ms-sgx-tcbidentifier", value = "11” 
            ); 
            }; 
            authorizationrules 
            { 
            => permit(); 
            }; 
            Issuancerules 
            { 
            c:[type=="x-ms-sgx-is-debuggable"] => issue(type="is-debuggable", value=c.value); 
            c:[type=="x-ms-sgx-mrsigner"] => issue(type="sgx-mrsigner", value=c.value); 
            c:[type=="x-ms-sgx-mrenclave"] => issue(type="sgx-mrenclave", value=c.value); 
            c:[type=="x-ms-sgx-product-id"] => issue(type="product-id", value=c.value); 
            c:[type=="x-ms-sgx-svn"] => issue(type="svn", value=c.value); 
            c:[type=="x-ms-attestation-type"] => issue(type="tee", value=c.value); 
            };  
            
## Key considerations:
- It is always recommended to install the latest PSW version supported by Intel and configure attestation policy with the latest TCB identifier available in Azure
- If the PSW version of ACC node is lower than the minimum PSW version of the TCB baseline configured in SGX attestation policy, attestation scenarios will fail
- If the PSW version of ACC node is greater than or equal to the minimum PSW version of the TCB baseline configured in SGX attestation policy, attestation scenarios will pass
- For customers who do not configure a custom TCB baseline in attestation policy, attestation will be performed against the Azure default TCB baseline
- For customers using an attestation policy without configurationrules section, attestation will be performed against the Azure default TCB baseline


