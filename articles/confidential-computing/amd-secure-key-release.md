---
title: Secure Key Release policies for Azure Confidential VMs with AMD SEV-SNP
description: An explanation of how to author a Secure Key Release policy for Azure Confidential VMs.
services: attestation, secure key release
author: 
ms.service: attestation, secure key release
ms.topic: overview
ms.date: 11/01/2021
ms.author: 


---
# How to author a Secure Key Release policy

Azure Key Vault (AKV) and Azure Key Vault Managed HSM allow for a key to be released to a Trusted Execution Envioronment (TEE). The TEE must meet key policy requirements. This document details the schema available to use when configuring key release expressions for AMD SEV-SNP Confidential VM.

Azure Confidential VMs (CVM) require a managed key to be securely released to the Host Compatibility Layer (HCL). The HCL runs as part of the guest, but in a memory space that is protected from the guest operating system, so the guest OS does not have access to this key. This key is used to encrypt the Virtual Machine Guest State, a file which holds persistent Virtual Machine state, such as vTPM content. Microsoft Azure Attestation (MAA) will validate the AMD SEV-SNP attestation report signature and issue a token which has claims for various system and guest properties, such as firmware versioning information and guest launch measurements. This token is evaluated by AKV during the secure key release process, and the key is only released if the TEE properties meet policy requirements.

The HCL is delivered as part of the Azure Host Operating System and will change over time as fixes are made and new features are delivered. Each HCL version will have different launch measurements. As Host OS changes are deployed, and Azure updates system firmware, VMs will encounter different launch measurements, depending on which host they happen to launch on. Customers do not have visibility into the Azure Host OS details, nor do they desire to maintain existing working scenarios. To solve this problem, customers can use “x-ms-compliance-status" to rely on MAA to ensure measurements and settings are correct. MAA will verify the launch measurements are valid, that AMD firmware versions are up to date, and that debug is disabled.



|    <br>Claim                              |    <br>Description                                                                                                     |    <br>Type                                |
|-------------------------------------------|------------------------------------------------------------------------------------------------------------------------|--------------------------------------------|
|    <br>x-ms-attestation-type              |    <br>The type of attestation report.<br>   <br>For AMD SEV-SNP, this will be “sevsnpvm”.                             |    <br>String                              |
|    <br>x-ms-compliance-status             |    <br>MAA will determine if this CVM meets Azure policy.<br>   <br>This allows for simple evaluation of attestation token, without requiring detailed knowledge of different measurements and AMD firmware revisions.  MAA ensures that the launch measurement is valid, debug is disabled, and AMD FW is up to date.<br>  <br>For compliant CVM, this will be “azure-compliant-cvm"<br>                                                                                       |    <br>String                              |
|    <br>x-ms-policy-hash                   |    <br>MAA policy hash                                                                                                 |    <br>String (Base64-URL encoded data)    |
|    <br>x-ms-sevsnpvm-authorkeydigest      |    <br>Hash of author signing key                                                                                      |    <br>String                              |
|    <br>x-ms-sevsnpvm-bootloader-svn       |    <br>AMD Bootloader SVN                                                                                              |    <br>Integer                             |
|    <br>x-ms-sevsnpvm-familyId             |    <br>HCL family identification string                                                                                |    <br>String                              |
|    <br>x-ms-sevsnpvm-guestsvn             |    <br>HCL SVN                                                                                                         |    <br>Integer                             |
|    <br>x-ms-sevsnpvm-hostdata             |    <br>Data passed by host at VM launch                                                                                |    <br>String                              |
|    <br>x-ms-sevsnpvm-idkeydigest          |    <br>Hash of identification signing key                                                                              |    <br>String                              |
|    <br>x-ms-sevsnpvm-imageId              |    <br>HLC image identification string                                                                                 |    <br>String                              |
|    <br>x-ms-sevsnpvm-is-debuggable        |    <br>AMD SEV-SNP debug enablement                                                                                    |    <br>Boolean                             |
|    <br>x-ms-sevsnpvm-launchmeasurement    |    <br>Measurement of launched guest image                                                                             |    <br>String                              |
|    <br>x-ms-sevsnpvm-microcode-svn        |    <br>AMD Microcode SVN                                                                                               |    <br>Integer                             |
|    <br>x-ms-sevsnpvm-migration-allowed    |    <br>AMD SEV-SNP migration support enabled                                                                           |    <br>Boolean                             |
|    <br>x-ms-sevsnpvm-reportdata           |    <br>Data passed by HCL to include with report,   to verify that transfer key and VM configuration are correct       |    <br>String                              |
|    <br>x-ms-sevsnpvm-reportid             |    <br>Report ID of this guest                                                                                         |    <br>String                              |
|    <br>x-ms-sevsnpvm-smt-allowed          |    <br>Is SMT enabled on host                                                                                          |    <br>Boolean                             |
|    <br>x-ms-sevsnpvm-snpfw-svn            |    <br>AMD Firmware SVN                                                                                                |    <br>Integer                             |
|    <br>x-ms-sevsnpvm-tee-svn              |    <br>AMD Trusted Execution Environment SVN                                                                           |    <br>Integer                             |
|    <br>x-ms-sevsnpvm-vmpl                 |    <br>VMPL that generated this report, 0 for HCL                                                                      |    <br>Integer                             |
|    <br>x-ms-ver                           |    <br>MAA protocol version                                                                                            |    <br>String                              |
|    <br>x-ms-runtime                       |    <br>Runtime claims created by HCL                                                                                   |    <br>Object                              |
|    <br>keys                               |    <br>Ephemeral RSA key used for Secure Key   Release.  Used by M-HSM, can be ignored   in key release evaluation.    |    <br>JWK                                 |
|    <br>vm-configuration                   |    <br>Current VM configuration, provided by host                                                                      |    <br>Object                              |
|    <br>console-enabled                    |    <br>If console (com1, com2) is enabled                                                                              |    <br>Boolean                             |
|    <br>current-time                       |    <br>Current Epoch time                                                                                              |    <br>Integer                             |
|    <br>secure-boot                        |    <br>Is Secure Boot enabled                                                                                          |    <br>Boolean                             |
|    <br>tpm-enabled                        |    <br>Is vTPM enabled                                                                                                 |    <br>Boolean                             |
|    <br>vmUniqueId                         |    <br>The VM Unique ID                                                                                                |    <br>String                              |

   
## Drafting the policy file

Release policy is an **anyOf** condition containing an array of key authorities and conditions.

1. Create a new file
2. Add **version** and **anyOf** to the file
3. Add sections for **allOf** and **authority**

  ```

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
  
4. Add condition expressions to the authorization rules in **allOf**, to require a compliant SEV-SNP CVM with expected configuration, such as Secure Boot enabled

  ```
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
  
5. Customize **authority** for the correct MAA endpoint

  ```
"authority": "https://sharedeus.eus.attest.azure.net/"
  ```

6. Save the file
  ```
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


## Adding policy to Key

The policy can be specified via the Portal when creating a CVM, with the CLI, or on key Import.
