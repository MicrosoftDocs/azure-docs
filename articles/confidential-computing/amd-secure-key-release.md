---
title: Attestation policies for Azure confidential VMs with AMD processors
description: An explanation of how to author an attestation policy for Azure confidential VMs.
services: attestation
author: msmbaldwin
ms.service: attestation
ms.topic: overview
ms.date: 08/31/2020
ms.author: mbaldwin


---
# How to author an attestation policy

Attestation policy is a file uploaded to Microsoft Azure Attestation. Azure Attestation offers the flexibility to upload a policy in an attestation-specific policy format. Alternatively, an encoded version of the policy, in JSON Web Signature, can also be uploaded. The policy administrator is responsible for writing the attestation policy. In most attestation scenarios, the relying party acts as the policy administrator. The client making the attestation call sends attestation evidence, which the service parses and converts into incoming claims (set of properties, value). The service then processes the claims, based on what is defined in the policy, and returns the computed result.



|    <br>Claim                              |    <br>Description                                                                                                     |    <br>Type                                |
|-------------------------------------------|------------------------------------------------------------------------------------------------------------------------|--------------------------------------------|
|    <br>x-ms-attestation-type              |    <br>The type of attestation report.<br>   <br>For AMD SEV-SNP, this will be “sevsnpvm”.                             |    <br>String                              |
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

1. Create a new file.
1. Add version to the file.
1. Add sections for **authorizationrules** and **issuancerules**.

  ```
  version=1.0;
  authorizationrules
  {
  =>deny();
  };
  
  issuancerules
  {
  };
  ```

  The authorization rules contain the deny() action without any condition, to ensure no issuance rules are processed. Alternatively, the authorization rule can also contain permit() action, to allow processing of issuance rules.
  
4. Add claim rules to the authorization rules

  ```
  version=1.0;
  authorizationrules
  {
  [type=="secureBootEnabled", value==true, issuer=="AttestationService"]=>permit();
  };
  
  issuancerules
  {
  };
  ```

  If the incoming claim set contains a claim matching the type, value, and issuer, the permit() action will tell the policy engine to process the **issuancerules**.
  
5. Add claim rules to **issuancerules**.

  ```
  version=1.0;
  authorizationrules
  {
  [type=="secureBootEnabled", value==true, issuer=="AttestationService"]=>permit();
  };
  
  issuancerules
  {
  => issue(type="SecurityLevelValue", value=100);
  };
  ```
  
  The outgoing claim set will contain a claim with:

  ```
  [type="SecurityLevelValue", value=100, valueType="Integer", issuer="AttestationPolicy"]
  ```

  Complex policies can be crafted in a similar manner. For more information, see [attestation policy examples](policy-examples.md).
  
6. Save the file.

## Creating the policy file in JSON Web Signature format

After creating a policy file, to upload a policy in JWS format, follow the below steps.

1. Generate the JWS, RFC 7515 with policy (utf-8 encoded) as the payload
     - The payload identifier for the Base64Url encoded policy should be "AttestationPolicy".
     
     Sample JWT:
     ```
     Header: {"alg":"none"}
     Payload: {"AttestationPolicy":" Base64Url (policy)"}
     Signature: {}

     JWS format: eyJhbGciOiJub25lIn0.XXXXXXXXX.
     ```

2. (Optional) Sign the policy. Azure Attestation supports the following algorithms:
     - **None**: Don't sign the policy payload.
     - **RS256**: Supported algorithm to sign the policy payload

3. Upload the JWS and validate the policy.
     - If the policy file is free of syntax errors, the policy file is accepted by the service.
     - If the policy file contains syntax errors, the policy file is rejected by the service.
