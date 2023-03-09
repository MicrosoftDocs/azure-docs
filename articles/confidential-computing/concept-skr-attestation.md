---
title: Secure Key Release and Attestation with Confidential Computing
description: Concept guide on what SKR is and its usage with Azure Confidential Computing Offerings
author: agowdamsft
ms.service: virtual-machines
ms.subservice: confidential-computing
ms.workload: infrastructure
ms.topic: conceptual
ms.date: 2/2/2023
ms.author: amgowda
---

# Secure Key Release feature with AKV and Azure Confidential Computing (ACC)

Secure Key Release (SKR) is a functionality of Azure Key Vault (AKV) Managed HSM and Premium offering. Secure key release enables the release of an HSM protected key from AKV to an attested Trusted Execution Environment (TEE), such as a secure enclave, VM based TEE's etc. This added another layer of access protection to your data decryption/encryption keys where you can target an application + TEE runtime environment with known configuration get access to the key material. The SKR policies defined at the time of exportable key creation govern the access to these keys.

## SKR Support with AKV Offerings

Secure Key Release is supported by Azure Key Vault offerings with HSM keys:

1. [Azure Key Vault Premium](../security/fundamentals/key-management.md)
1. [Azure Key Vault Managed HSM](../key-vault/managed-hsm/overview.md)

## Overall Secure Key Release Flow with TEE

SKR can only release keys based on the Microsoft Azure Attestation (MAA) generated claims. There is a tight integration on the SKR policy definition to MAA claims.

![SKR E2E Flow](media/skr-flow-cvm-sevsnp-attestation/skr-e2e-flow.png)

The below steps are for AKV Premium. 

### Step 1: Create a Key Vault Premium HSM Backed

[Follow the details here for Az CLI based AKV creation](/cli/azure/keyvault?view=azure-cli-latest#az-keyvault-create)

Make sure to set the value of [--sku] to "premium".

### Step 2: Create a Secure Key Release Policy

A Secure Key Release Policy is a json format release policy as defined [here](/rest/api/keyvault/keys/create-key/create-key?tabs=HTTP#keyreleasepolicy) that specifies a set of claims required in addition to authorization to release the key. The claims here are MAA based claims as referenced [here for SGX](/azure/attestation/attestation-token-examples#sample-jwt-generated-for-sgx-attestation) and here for [AMD SEV-SNP CVM](/azure/attestation/attestation-token-examples#sample-jwt-generated-for-sev-snp-attestation).

Please visit the TEE specific [examples page for more details](/skr-flow-confidentialcontainers-aci.md)

Before you set a SKR policy make sure to run your TEE application through the remote attestation flow . Remote attestation is not covered as part of this tutorial.

Example

```json
{
    "version": "1.0.0",
    "anyOf": [ // Always starts with "anyOf", meaning you can multiple, even varying rules, per authority.
        {
            "authority": "https://sharedweu.weu.attest.azure.net",
            "allOf": [ // can be replaced by "anyOf", though you cannot nest or combine "anyOf" and "allOf" yet.
                {
                    "claim": "x-ms-isolation-tee.x-ms-attestation-type", // These are the MAA claims.
                    "equals": "sevsnpvm"
                },
                {
                    "claim": "x-ms-isolation-tee.x-ms-compliance-status",
                    "equals": "azure-compliant-cvm"
                }
            ]
        }
    ]
}


```

### Step 3: Create a exportable key in AKV with attached SKR policy

Exact details of the type of key and other attributes associated can be found [here](/cli/azure/keyvault/key?view=azure-cli-latest#az-keyvault-key-create).

```azurecli
az keyvault key create --exportable true --vault-name "vault name from step 1" --kty RSA-HSM --name "keyname" --policy "jsonpolicyfromstep3 -can be a path to JSON" --protection hsm --vault-name "name of vault created from step1"               
```

### Step 4: Application running within a TEE doing a remote attestation

This step can be specific to the the type of TEE you are running your application Intel SGX Enclaves or AMD SEV-SNP based Confidential Virtual Machines (CVM) or Confidential Containers running in CVM Enclaves with AMD SEV-SNP etc.

Follow these references examples for various TEE types offering with Azure:

1. [Application within AMD EV-SNP based CVM's performing Secure Key Release](./skr-flow-cvm-sevsnp-attestation.md)
1. [Confidential containers with Azure Container Instances (ACI) with SKR side-car containers](./skr-flow-confidentialcontainers-aci.md)
1. [Intel SGX based applications performing Secure Key Release - Open Source Solution Mystikos Implementation](https://github.com/deislabs/mystikos/tree/main/samples/confidential_ml#environment)

## Frequently Asked Questions (FAQ)

### Can I perform SKR with non confidential computing offerings?

No. The policy attached to SKR only understands MAA claims that are associated to hardware based TEEs.

### Can I bring my own attestation provider or service and use those claims for AKV to validate and release?

No. AKV only understands and integrates with MAA today.

### Can I use AKV SDK's to get perform key RELEASE?

Yes. Latest SDK integrated with 7.3 AKV API's support key RELEASE.

### Can you share some examples of the key release policies?

Yes, detailed examples by TEE type are listed [here.](./skr-policy-examples.md)

## Can I attach SKR type of policy with certificates and secrets?

No. Not at this time.

## References

[Secure Key Release with container side-car on Azure Container Instance with confidential containers support.](https://github.com/microsoft/confidential-sidecar-containers)

[CVM on AMD SEV-SNP Applications with Secure Key Release Example](/skr-flow-cvm-sevsnp-attestation.md)

[AKV REST API With SKR Details](.../rest/api/keyvault/keys/create-key/create-key?tabs=HTTP)
