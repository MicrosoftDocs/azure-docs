---
title: Secure Key Release Policy with Azure Key Vault and Azure Confidential Computing
description: Examples of AKV SKR policies across offered Azure Confidential Computing Trusted Execution Environments
author: angarg05
ms.service: azure-confidential-computing
ms.topic: concept-article
ms.date: 09/09/2026
ms.author: ananyagarg
# Customer intent: As a security architect, I want to define secure key release policies for Azure Confidential Computing environments, so that I can ensure the integrity and compliance of encrypted data management across different trusted execution environments.
---

# Secure Key Release policy examples for Azure Confidential Computing

Secure Key Release (SKR) can only release exportable marked keys based on the Microsoft Azure Attestation (MAA) generated claims. There's a tight integration on the SKR policy definition to MAA claims. MAA claims by trusted execution environment (TEE) can be found [here.](/azure/attestation/attestation-token-examples)

Follow the policy [grammar](/azure/key-vault/keys/policy-grammar) for more examples on how you can customize the SKR policies. 

## Intel SGX Application Enclaves SKR policy examples

**Example 1:** Intel SGX based SKR policy validating the MR Signer (SGX enclave signer) details as part of the MAA claims

```json

{
  "anyOf": [
    {
      "authority": "https://sharedeus2.eus2.attest.azure.net",
      "allOf": [
        {
          "claim": "x-ms-sgx-mrsigner",
          "equals": "9fa48b1629bd246a1de3d38fb7df97f6554cd65d6b3b72e85b86848ae6b578ba"
        }
      ]
    }
  ],
  "version": "1.0.0"
}

```

**Example 2:** Intel SGX based SKR policy validating the MR Signer (SGX enclave signer) or MR Enclave details as part of the MAA claims

```json

{
  "anyOf": [
    {
      "authority": "https://sharedeus2.eus2.attest.azure.net",
      "allOf": [
        {
          "claim": "x-ms-sgx-mrsigner",
          "equals": "9fa48b1629bd246a1de3d38fb7df97f6554cd65d6b3b72e85b86848ae6b578ba"
        },
        {
          "claim": "x-ms-sgx-mrenclave",
          "equals": "9fa48b1629bg677jfsaawed7772e85b86848ae6b578ba"
        }
      ]
    }
  ],
  "version": "1.0.0"
}

```

**Example 3:** Intel SGX based SKR policy validating the MR Signer (SGX enclave signer) and MR Enclave with a min SVN number details as part of the MAA claims

```json
{
  "anyOf": [
    {
      "authority": "https://sharedeus2.eus2.attest.azure.net",
      "allOf": [
        {
          "claim": "x-ms-sgx-mrsigner",
          "equals": "9fa48b1629bd246a1de3d38fb7df97f6554cd65d6b3b72e85b86848ae6b578ba"
        },
        {
          "claim": "x-ms-sgx-mrenclave",
          "equals": "9fa48b1629bg677jfsaawed7772e85b86848ae6b578ba"
        },
        {
          "claim": "x-ms-sgx-svn",
          "greater": 1
        }
      ]
    }
  ],
  "version": "1.0.0"
}

```

## Confidential VM AMD SEV-SNP based VM TEE SKR policy examples

**Example 1:** A SKR policy that validates if this is Azure compliant CVM and is running on a genuine AMD SEV-SNP hardware and the MAA URL authority is spread across many regions.

```json
{
    "version": "1.0.0",
    "anyOf": [
        {
            "authority": "https://sharedweu.weu.attest.azure.net",
            "allOf": [
                {
                    "claim": "x-ms-attestation-type",
                    "equals": "sevsnpvm"
                },
                {
                    "claim": "x-ms-compliance-status",
                    "equals": "azure-compliant-cvm"
                }
            ]
        },
        {
            "authority": "https://sharedeus2.weu2.attest.azure.net",
            "allOf": [
                {
                    "claim": "x-ms-attestation-type",
                    "equals": "sevsnpvm"
                },
                {
                    "claim": "x-ms-compliance-status",
                    "equals": "azure-compliant-cvm"
                }
            ]
        }
    ]
}

```

**Example 2:** A SKR policy that validates if the CVM is an Azure compliant CVM and is running on a genuine AMD SEV-SNP hardware and is of a known Virtual Machine ID. (VMIDs are unique across Azure, edit the 'equals' part of the claim in the example below with the desired, unique VMID)

```json
{
  "version": "1.0.0",
  "allOf": [
    {
      "authority": "https://sharedweu.weu.attest.azure.net",
      "allOf": [
        {
          "claim": "x-ms-isolation-tee.x-ms-attestation-type",
          "equals": "sevsnpvm"
        },
        {
          "claim": "x-ms-isolation-tee.x-ms-compliance-status",
          "equals": "azure-compliant-cvm"
        },
        {
          "claim": "x-ms-azurevm-vmid",
          "equals": "<PLACE YOUR VMID here - for example - B958DC88-E41D-47F1-8D20-E57B6B7E9825>"
        }
      ]
    }
  ]
}

```

## Trusted Launch VM (vTPM) SKR policy examples

Secure Key Release isn't limited to confidential computing offerings. A [Trusted Launch VM](/azure/virtual-machines/trusted-launch) (Generation 2, Secure Boot + vTPM) also produces an MAA attestation token, and a release policy can gate on its vTPM measured-boot claims—`secureboot` and `x-ms-azurevm-attested-pcr-values.pcrN`. These claims don't require AMD SEV-SNP or Intel TDX hardware. Confidential computing additionally protects the released key material in memory from the host. Use it when that protection is required. For a full walkthrough, see [Protect intellectual property on Azure VMs with attestation-gated Secure Key Release](/azure/virtual-machines/secure-key-release-pattern-trusted-launch).

**Example 1:** A Trusted Launch SKR policy that validates the VM booted with Secure Boot enabled (proves a genuine Trusted Launch platform and a validated vTPM quote).

```json
{
  "version": "1.0.0",
  "anyOf": [
    {
      "authority": "https://sharedweu.weu.attest.azure.net",
      "allOf": [
        {
          "claim": "secureboot",
          "equals": true
        }
      ]
    }
  ]
}
```

**Example 2:** A Trusted Launch SKR policy that additionally pins the booted image by matching specific PCR values (commonly `pcr4` for the boot loader/kernel and `pcr7` for Secure Boot state). Read the expected values from a known-good attestation token, and then substitute them in the following code. A tampered, reimaged, or disk-swapped VM measures different PCRs and is denied.

```json
{
  "version": "1.0.0",
  "anyOf": [
    {
      "authority": "https://sharedweu.weu.attest.azure.net",
      "allOf": [
        {
          "claim": "secureboot",
          "equals": true
        },
        {
          "claim": "x-ms-azurevm-attested-pcr-values.pcr4",
          "equals": "<BASE64_PCR4>"
        },
        {
          "claim": "x-ms-azurevm-attested-pcr-values.pcr7",
          "equals": "<BASE64_PCR7>"
        }
      ]
    }
  ]
}
```

## Confidential containers on Azure Container Instances (ACI) SKR policy examples

**Example 1:** Confidential containers on ACI validating the containers initiated and container configuration metadata as part of container group launch with added validations that this is an AMD SEV-SNP hardware.

> [!NOTE]
> The containers metadata is a rego based policy hash reflected as in this [example.](https://github.com/microsoft/confidential-sidecar-containers/tree/main).

```json
{
    "version": "1.0.0",
    "anyOf": [
        {
            "authority": "https://fabrikam1.wus.attest.azure.net",
            "allOf": [
                {
                    "claim": "x-ms-attestation-type",
                    "equals": "sevsnpvm"
                },
                {
                    "claim": "x-ms-compliance-status",
                    "equals": "azure-compliant-uvm"
                },
                {
                    "claim": "x-ms-sevsnpvm-hostdata",
                    "equals": "532eaabd9574880dbf76b9b8cc00832c20a6ec113d682299550d7a6e0f345e25"
                }
            ]
        }
    ]
}

```

## References

[Microsoft Azure Attestation (MAA)](/azure/attestation/overview)

[Protect intellectual property on Azure VMs with attestation-gated Secure Key Release](/azure/virtual-machines/secure-key-release-pattern-trusted-launch)

[Secure Key Release Concept and Basic Steps](concept-skr-attestation.md)
