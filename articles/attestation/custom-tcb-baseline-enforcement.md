---
title: Custom TCB baseline enforcement for Azure Attestation users
description: Custom TCB baseline enforcement for Azure Attestation users
services: attestation
author: msmbaldwin
ms.service: attestation
ms.topic: overview
ms.date: 11/30/2022
ms.author: mbaldwin


---

# Custom TCB baseline enforcement for SGX attestation (preview)

Microsoft Azure Attestation is a unified solution for attesting different types of Trusted Execution Environments (TEEs) such as [Intel® Software Guard Extensions](https://www.intel.com/content/www/us/en/architecture-and-technology/software-guard-extensions.html) (SGX) enclaves. While attesting SGX enclaves, Azure Attestation validates the evidence against Azure default Trusted Computing Base (TCB) baseline. The default TCB baseline is provided by an Azure service named [Trusted Hardware Identity Management](../security/fundamentals/trusted-hardware-identity-management.md) (THIM) and includes collateral fetched from Intel like certificate revocation lists (CRLs), Intel certificates, Trusted Computing Base (TCB) information and Quoting Enclave identity (QEID). The default TCB baseline from THIM might lag the latest baseline offered by Intel. This is to prevent any attestation failure scenarios for ACC customers who require more time for patching platform software (PSW) updates.

Azure Attestation offers the custom TCB baseline enforcement feature (preview) which will empower you to perform SGX attestation against a desired TCB baseline. It is always recommended for [Azure Confidential Computing](../confidential-computing/overview.md) (ACC) SGX customers to install the latest PSW version supported by Intel and configure their SGX attestation policy with the latest TCB baseline supported by Azure.

## Why use custom TCB baseline enforcement feature?

We recommend Azure Attestation users to use the custom TCB baseline enforcement feature for performing SGX attestation. The feature will be helpful in the following scenarios:

**To perform SGX attestation against a newer TCB offered by Intel** – Customers can perform timely roll out of platform software (PSW) updates as recommended by Intel and use the custom baseline enforcement feature to perform their SGX attestation against the newer TCB versions supported by Intel 

**To perform platform software (PSW) updates at your own cadence** – Customers who prefer to update PSW at their own cadence, can use custom baseline enforcement feature to perform SGX attestation against the older TCB baseline, until the PSW updates are rolled out

## Default TCB baseline currently referred by Azure Attestation when no custom TCB baseline is configured by users

```
TCB identifier: “10”
TCB evaluation data number": "10"    
Tcb release date: "2020-11-11T00:00:00"  
Minimum PSW Linux version: "2.9"
Minimum PSW Windows version: "2.7.101.2"
```

## TCB baselines available in Azure which can be configured as custom TCB baseline
```
 15 (TCB release date: 2/14/2023)
 TCB identifier : 15
 TCB evaluation data number : 15
 Minimum PSW Linux version : 2.17
 Minimum PSW Windows version : 2.16

 14 (TCB release date: 11/8/2022)
 TCB identifier : 14
 TCB evaluation data number : 14
 Minimum PSW Linux version : 2.17
 Minimum PSW Windows version : 2.16

 TCB identifier : 13
 TCB release date: 8/9/2022
 TCB evaluation data number : 13
 Minimum PSW Linux version : 2.17
 Minimum PSW Windows version : 2.16
 
 TCB identifier : 12
 TCB release date: 11/10/2021
 TCB evaluation data number : 12
 Minimum PSW Linux version : 2.13.3
 Minimum PSW Windows version : 2.13.100.2
 
 TCB identifier : 11
 TCB release date: 6/8/2021
 TCB evaluation data number : 11
 Minimum PSW Linux version : 2.13.3
 Minimum PSW Windows version : 2.13.100.2
 
 TCB identifier : 10
 TCB release date: 11/10/2020
 TCB evaluation data number : 10
 Minimum PSW Linux version : 2.9
 Minimum PSW Windows version : 2.7.101.2
```         

## How to configure an attestation policy with custom TCB baseline using Azure portal experience

### New users

1. Create an attestation provider using Azure portal experience. [Details here](./quickstart-portal.md#create-and-configure-the-provider-with-unsigned-policies) 

2. Go to overview page and view the current default policy of the attestation provider. [Details here](./quickstart-portal.md#view-an-attestation-policy)

3. Click on **View current and available TCB baselines for attestation**, view **Available TCB baselines**, identify the desired TCB identifier and click Cancel  

4. Click Configure, set **x-ms-sgx-tcbidentifier** claim value in the policy to the desired value and click Save 

### Existing shared provider users  

Shared provider users need to migrate to custom providers to be able to perform attestation against custom TCB baseline 

1. Create an attestation provider using Azure portal experience. [Details here](./quickstart-portal.md#create-and-configure-the-provider-with-unsigned-policies) 

2. Go to overview page and view the current default policy of the attestation provider. [Details here](./quickstart-portal.md#view-an-attestation-policy)

3. Click on **View current and available TCB baselines for attestation**, view **Available TCB baselines**, identify the desired TCB identifier and click Cancel  

4. Click Configure, set **x-ms-sgx-tcbidentifier** claim value in the policy to the desired value and click Save 

5. Needs code deployment to send attestation requests to the custom attestation provider 

### Existing custom provider users  

1. Go to overview page and view the current default policy of the attestation provider. [Details here](./quickstart-portal.md#view-an-attestation-policy)

2. Click on **View current and available TCB baselines for attestation**, view **Available TCB baselines**, identify the desired TCB identifier and click Cancel  

3. Click Configure, and use the below **sample** for configuring an attestation policy with a custom TCB baseline.  

```
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
```

## Key considerations:
- If the PSW version of ACC node is lower than the minimum PSW version of the TCB baseline configured in SGX attestation policy, attestation scenarios will fail
- If the PSW version of ACC node is greater than or equal to the minimum PSW version of the TCB baseline configured in SGX attestation policy, attestation scenarios will pass
- For customers who do not configure a custom TCB baseline in attestation policy, attestation will be performed against the Azure default TCB baseline
- For customers using an attestation policy without configurationrules section, attestation will be performed against the Azure default TCB baseline
