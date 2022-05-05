---
title: Azure Attestation policy version 1.0
description: policy version 1.0.
services: attestation
author: prsriva
ms.service: attestation
ms.topic: overview
ms.date: 04/05/2022
ms.author: prsriva
ms.custom: policy version 1.0 
---

# Attestation Policy Version 1.0

Instance owners can use the Attestation policy to define what needs to be validated during the attestation flow.
This article introduces the workings of the attestation service and the policy engine. Each attestation type has its own attestation policy, however the supported grammar, and processing is broadly the same.

## Policy version 1.0

The minimum version of the policy supported by the service is version 1.0.

:::image type="content" source="./media/maa-policy-version-1-0-small.png" alt-text="A diagram showing Azure attestation using policy version 1.0" lightbox="./media/maa-policy-version-1-0.png":::

The attestation service flow is as follows:
- The platform sends the attestation evidence in the attest call to the attestation service.
- The attestation service parses the evidence and creates a list of claims that is then used in the attestation evaluation. These claims are logically categorized as incoming claims sets.
- The uploaded attestation policy is used to evaluate the evidence over the rules authored in the attestation policy.

For Policy version 1.0:

The policy has three segments, as seen above:

- **version**: The version is the version number of the grammar that is followed.
- **authorizationrules**: A collection of claim rules that will be checked first, to determine if attestation should proceed to issuancerules. This section should be used to filter out calls that don’t require the issuancerules to be applied. No claims can be issued from this section to the response token. These rules can be used to fail  attestation.
- **issuancerules**: A collection of claim rules that will be evaluated to add information to the attestation result as defined in the policy. The claim rules apply in the order they are defined and are also optional. A collection of claim rules that will be evaluated to add information to the attestation result as defined in the policy. The claim rules apply in the order they are defined and are also optional. These rules can be used to add to the outgoing claim set and the response token, these rules cannot be used to fail attestation.

List of claims supported by policy version 1.0 as part of the incoming claims.

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
version=1.0;

authorizationrules { 
    => permit();
};


issuancerules
{
[type=="aikValidated", value==true]&& 
[type=="secureBootEnabled", value==true] &&
[type=="bootDebuggingDisabled", value==true] && 
[type=="notSafeMode", value==true] => issue(type="PlatformAttested", value=true);
};
```
