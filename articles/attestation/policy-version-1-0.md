---
title: Azure Attestation policy version 1.0
description: Learn about Azure Attestation policy version 1.0 to define what must be validated during the attestation flow.
services: attestation
author: prsriva
ms.service: attestation
ms.topic: overview
ms.date: 04/05/2022
ms.author: prsriva
ms.custom: policy version 1.0 
---

# Attestation policy version 1.0

Instance owners can use the Azure Attestation policy to define what must be validated during the attestation flow. This article introduces the workings of the attestation service and the policy engine. Each attestation type has its own attestation policy. The supported grammar and processing are broadly the same.

## Policy version 1.0

The minimum version of the policy supported by the service is version 1.0.

:::image type="content" source="./media/maa-policy-version-1-0-small.png" alt-text="A diagram that shows Azure Attestation using policy version 1.0." lightbox="./media/maa-policy-version-1-0.png":::

The attestation service flow is as follows:

- The platform sends the attestation evidence in the attest call to the attestation service.
- The attestation service parses the evidence and creates a list of claims that's used in the attestation evaluation. These claims are logically categorized as incoming claim sets.
- The uploaded attestation policy is used to evaluate the evidence over the rules authored in the attestation policy.

Policy version 1.0 has three segments:

- **version**: The version is the version number of the grammar that's followed.
- **authorizationrules**: A collection of claim rules that are checked first to determine if attestation should proceed to issuancerules. Use this section to filter out calls that don't require the issuance rules to be applied. No claims can be issued from this section to the response token. These rules can be used to fail attestation.
- **issuancerules**: A collection of claim rules that are evaluated to add information to the attestation result as defined in the policy. The claim rules apply in the order in which they're defined. They're also optional. These rules can be used to add to the outgoing claim set and the response token. These rules can't be used to fail attestation.

The following claims are supported by policy version 1.0 as part of the incoming claims.

### TPM attestation

Use these claims to define authorization rules in a Trusted Platform Module (TPM) attestation policy:

- **aikValidated**: The Boolean value that contains information if the attestation identity key (AIK) certificate has been validated or not.
- **aikPubHash**: The string that contains the base64 (SHA256) AIK public key in DER format.
- **tpmVersion**: The integer value that contains the TPM major version.
- **secureBootEnabled**: The Boolean value that indicates if secure boot is enabled.
- **iommuEnabled**:The Boolean value that indicates if the input-output memory management unit is enabled.
- **bootDebuggingDisabled**: The Boolean value that indicates if boot debugging is disabled.
- **notSafeMode**: The Boolean value that indicates if Windows isn't running in safe mode.
- **notWinPE**: The Boolean value that indicates if Windows isn't running in WinPE mode.
- **vbsEnabled**: The Boolean value that indicates if virtualization-based security (VBS) is enabled.
- **vbsReportPresent**: The Boolean value that indicates if a VBS enclave report is available.

### VBS attestation

Use the following claims to define authorization rules in a VBS attestation policy:

- **enclaveAuthorId**: The string value that contains the Base64Url encoded value of the enclave author ID. It's the author identifier of the primary module for the enclave.
- **enclaveImageId**: The string value that contains the Base64Url encoded value of the enclave image ID. It's the image identifier of the primary module for the enclave.
- **enclaveOwnerId**: The string value that contains the Base64Url encoded value of the enclave owner ID. It's the identifier of the owner for the enclave.
- **enclaveFamilyId**: The string value that contains the Base64Url encoded value of the enclave family ID. It's the family identifier of the primary module for the enclave.
- **enclaveSvn**: The integer value that contains the security version number of the primary module for the enclave.
- **enclavePlatformSvn**: The integer value that contains the security version number of the platform that hosts the enclave.
- **enclaveFlags**: The enclaveFlags claim is an integer value that contains flags that describe the runtime policy for the enclave.

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
