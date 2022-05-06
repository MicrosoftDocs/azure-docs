---
title: Azure Attestation policy version 1.1
description: policy version 1.1.
services: attestation
author: prsriva
ms.service: attestation
ms.topic: overview
ms.date: 04/05/2022
ms.author: prsriva
ms.custom: policy version 1.1 
---

# Attestation Policy Version 1.1

Instance owners can use the Attestation policy to define what needs to be validated during the attestation flow.
This article introduces the workings of the attestation service and the policy engine. Each attestation type has its own attestation policy, however the supported grammar, and processing is broadly the same.

## Policy version 1.1

:::image type="content" source="./media/maa-policy-version-1-1-small.png" alt-text="A diagram showing Azure attestation using policy version 1.1" lightbox="./media/maa-policy-version-1-1.png":::

The attestation flow is as follows:
- The platform sends the attestation evidence in the attest call to the attestation service.
- The attestation service parses the evidence and creates a list of claims that is then used during rule evaluation. The claims are logically categorized as incoming claims sets.
- The attestation policy uploaded by the owner of the attestation service instance is then used to evaluate and issue claims to the response.
- During the evaluation, configuration rules can be used to indicate to the policy evaluation engine how to handle certain claims.

For Policy version 1.1:
The policy has four segments, as seen above:

- **version**: The version is the version number of the grammar that is followed.
- **configurationrules**: During policy evaluation, sometimes it may be required to control the behavior of the policy engine itself. This is where configuration rules can be used to indicate to the policy evaluation engine how to handle some claims in the evaluation.
- **authorizationrules**: A collection of claim rules that will be checked first, to determine if attestation should proceed to issuancerules. This section should be used to filter out calls that don’t require the issuancerules to be applied. No claims can be issued from this section to the response token. These rules can be used to fail attestation.
- **issuancerules**: A collection of claim rules that will be evaluated to add information to the attestation result as defined in the policy. The claim rules apply in the defined order and are also optional. These rules can also be used to add to the outgoing claim set and the response token, however these rules cannot be used to fail attestation.

The following **configurationrules** are available to the policy author.

| Attestation Type | ConfigurationRule Property Name | Type | Default Value | Description |
| ----------- | ----------- | ----------- | ----------- |----------- |
| TPM, VBS | require_valid_aik_cert | Bool | true | Indicates whether a valid AIK certificate is required. Only applied when TPM data is present.|
| TPM, VBS | required_pcr_mask | Int | 0xFFFFFF | The bitmask for PCR indices that must be included in the TPM quote. Bit 0 represents PCR 0, bit 1 represents PCR 1, and so on. |

List of claims supported as part of the incoming claims.

### TPM attestation

Claims to be used by policy authors to define authorization rules in a TPM attestation policy:

- **aikValidated**: Boolean value containing information if the Attestation Identity Key (AIK) cert has been validated or not
- **aikPubHash**:  String containing the base64(SHA256(AIK public key in DER format))
- **tpmVersion**:   Integer value containing the Trusted Platform Module (TPM) major version
- **secureBootEnabled**: Boolean value to indicate if secure boot is enabled
- **iommuEnabled**:  Boolean value to indicate if Input-output memory management unit (Iommu) is enabled
- **bootDebuggingDisabled**: Boolean value to indicate if boot debugging is disabled
- **notSafeMode**:  Boolean value to indicate if the Windows is not running on safe mode
- **notWinPE**:  Boolean value indicating if Windows is not running in WinPE mode
- **vbsEnabled**:  Boolean value indicating if VBS is enabled
- **vbsReportPresent**:  Boolean value indicating if VBS enclave report is available

### VBS attestation

In addition to the TPM attestation policy claims, below claims can be used by policy authors to define authorization rules in a VBS attestation policy.

- **enclaveAuthorId**:  String value containing the Base64Url encoded value of the enclave author id-The author identifier of the primary module for the enclave
- **enclaveImageId**:  String value containing the Base64Url encoded value of the enclave Image id-The image identifier of the primary module for the enclave
- **enclaveOwnerId**:  String value containing the Base64Url encoded value of the enclave Owner id-The identifier of the owner for the enclave
- **enclaveFamilyId**:  String value containing the Base64Url encoded value of the enclave Family ID. The family identifier of the primary module for the enclave
- **enclaveSvn**:  Integer value containing the security version number of the primary module for the enclave
- **enclavePlatformSvn**:  Integer value containing the security version number of the platform that hosts the enclave
- **enclaveFlags**:  The enclaveFlags claim is an Integer value containing Flags that describe the runtime policy for the enclave

## Sample policies for various attestation types

Sample policy for TPM:

```
version=1.1;

configurationrules{
=> issueproperty(type = "required_pcr_mask", value = 15);
=> issueproperty(type = "require_valid_aik_cert", value = false);
};

authorizationrules { 
    => permit();
};


issuancerules
{
[type=="aikValidated", value==true]&& 
[type=="secureBootEnabled", value==true] &&
[type=="bootDebuggingDisabled", value==true] && 
[type=="notSafeMode", value==true] => issue(type="PlatformAttested", value=true);

[type=="aikValidated", value==false]&& 
[type=="secureBootEnabled", value==true] &&
[type=="bootDebuggingDisabled", value==true] && 
[type=="notSafeMode", value==true] => issue(type="PlatformAttested", value=false);
};
```
The required_pcr_mask restricts the evaluation of PCR matches to only PCR 0,1,2,3.
The require_valid_aik_cert marked as false, indicates that the aik cert is not a requirement and is later verified in the issuancerules to determine the PlatformAttested state.
