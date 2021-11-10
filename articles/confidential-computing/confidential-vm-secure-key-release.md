---
title: Create secure key release policies for confidential VMs (preview)
description: How to create a secure key release policy for confidential virtual machines in Azure Confidential Computing.
services: attestation, secure key release
author: edendcohen
ms.service: attestation, secure key release
ms.topic: overview
ms.date: 11/15/2021
ms.author: edcohen


---
# Create secure key release policies for confidential VMs (preview)

> [!IMPORTANT]
> Confidential virtual machines (confidential VMs) in Azure Confidential Computing is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Confidential VMs need a managed key released for their host compatibility layer. This layer runs as part of the guest VM, in a memory space that the guest OS can't access. The managed key encrypts the Virtual Machine Guest State (VMGS). The VMGS is a file that holds the persistent VM state. For example, the VMGS can hold virtual Trusted Platform Module (vTPM) content. 

[Azure Attestation](/services/azure-attestation/) validates the AMD SEV-SNP attestation report signature. Then, Azure Attestation issues a token with claims for system and guest properties, such as firmware versioning and guest launch measurements. [Azure Key Vault](../key-vault/general/overview.md) and [Key Vault Managed HSM](../key-vault/managed-hsm/overview.md) manage the release of keys to a Trusted Execution Environment (TEE). During the secure key release process, Key Vault evaluates the token. Key Vault then releases the key only if the TEE properties meet your policy requirements.

## Claims

You can use the following claims when you create secure key release policies for confidential VMs.

> [!IMPORTANT]
> The host compatibility layer is part of the Azure host OS. The related launch measurements and settings change over time with updates to the host OS and system firmware. Use the claim `x-ms-compliance-status` to have Azure Attestation check your settings. Azure Attestation verifies the launch measurements are valid, makes sure the AMD firmware versions are up to date, and checks that debug is disabled.

| Claim                    | Description                   | Type   |
| ------------------------ | ----------------------------- | ------ |
| `x-ms-attestation-type` | The type of attestation report. For AMD SEV-SNP, the value is `sevsnpvm`. | String |
| `x-ms-compliance-status` | Azure Attestation determines if the confidential VM meets Azure policy. Allows simple evaluation of attestation token, without requiring detailed knowledge of different measurements and AMD firmware revisions. For compliant confidential VMs, the value is `azure-compliant-cvm`. | String |
| `x-ms-policy-hash` | The hash of the Base64-encoded URL of the Azure Attestation policy used to evaluate attestation request. Only use if you have a custom policy. | String |
| `x-ms-sevsnpvm-authorkeydigest` | Hash of author's signing key. | String |
| `x-ms-sevsnpvm-bootloader-svn` | AMD Bootloader Subversion (SVN). | Integer |
| `x-ms-sevsnpvm-familyId` | Host compatibility layer's family identification string. | String |
| `x-ms-sevsnpvm-guestsvn` | Host compatibility layer's SVN. | Integer |
| `x-ms-sevsnpvm-hostdata` | Data passed by host at VM launch. | String |
| `x-ms-sevsnpvm-idkeydigest` | Hash of identification signing key. | String |
| `x-ms-sevsnpvm-imageId` | Host compatibility layer's image identification string. | String |
| `x-ms-sevsnpvm-is-debuggable` | Enable AMD SEV-SNP debug.  | Boolean |
| `x-ms-sevsnpvm-launchmeasurement` | Measurement of launched guest image.  | String |
| `x-ms-sevsnpvm-microcode-svn` | AMD Microcode SVN. | Integer |
| `x-ms-sevsnpvm-migration-allowed` | Enable AMD SEV-SNP migration support. | Boolean |
|` x-ms-sevsnpvm-reportdata` | Data passed by ost compatibility layer to include with report. Verifies that transfer key and VM configuration are correct. | String |
| `x-ms-sevsnpvm-reportid `| Report identifier of the guest. | String |
| `x-ms-sevsnpvm-smt-allowed` | Check if SMT is enabled on the host. | Boolean |
| `x-ms-sevsnpvm-snpfw-svn` | AMD Firmware SVN. | Integer |
| `x-ms-sevsnpvm-tee-svn` | AMD Trusted Execution Environment SVN. | Integer |
| `x-ms-sevsnpvm-vmpl` | VMPL that generated the report. The value is `0` for the host compatibility layer. | Integer |
| `x-ms-ver` | Azure Attestation protocol version. | String |
| `x-ms-runtime` | Runtime claims created by the host compatibility layer. | Object |
| `keys` | Ephemeral RSA key used for the secure key release.  Used by Key Vault Managed HSM. Optional in key release evaluation. | JSON Web Key (JWK) |
| `vm-configuration` | Current VM configuration, provided by host. | Object |
| `console-enabled` | Checks if console (`com1`, `com2`) is enabled. | Boolean |
| `current-time` | Current epoch time. | Integer |
| `secure-boot` | Checks if Secure Boot is enabled | Boolean |
| `tpm-enabled` | Checks if vTPM is enabled. | Boolean |
| `vmUniqueId` | The VM's unique identifier. | String |

   
## Policy file

The key release policy is an `anyOf` condition that contains an array of key authorities and conditions. To draft a policy file:

1. Create a new file.
1. Add `version` and `anyOf` to the file.
1. Add sections for `allOf` and `authority`.

    ```json
    {
        "anyOf":
        [
            {
                "authority": "attestation.com",
                "allOf":
                [
                ]
            }
        ],
        "version": "1.0.0"
    }
    ```
  
1. Add condition expressions to the authorization rules in **allOf**, to require a compliant SEV-SNP CVM with the expected configuration, such as Secure Boot enabled

    ```json
    "allOf":
    [
        {
            "claim": "x-ms-compliance-status",
            "equals": "azure-compliant-cvm"
        },
        {
            "claim": "x-ms-attestation-type",
            "equals": "sevsnpvm"
        },
        { 
            "claim": "x-ms-runtime.vm-configuration.secure-boot", 
            "equals": true
        }
    ]
    ```
  
1. Customize **authority** for the correct MAA endpoint

    ```json
    "authority": "https://sharedeus.eus.attest.azure.net/"
    ```

1. Save the file.

### Example policy file

```json
{
    "anyOf":
    [
        {
            "authority": "https://sharedeus.eus.attest.azure.net/",
            "allOf":
            [
                {
                    "claim": "x-ms-compliance-status",
                    "equals": "azure-compliant-cvm"
                },
                {
                    "claim": "x-ms-attestation-type",
                    "equals": "sevsnpvm"
                },
                { 
                    "claim": "x-ms-runtime.vm-configuration.secure-boot", 
                    "equals": true 
                }
            ]
        }
    ],
    "version": "1.0.0"
}
```

## Add policy to key

You can specify the policy file through the key management CLI or the Azure portal. You can also include the policy in key import operations. 

## Next step

> [!div class="nextstepaction"]
> [FAQ for confidential VMs on AMD](confidential-vm-faq-amd.yml)