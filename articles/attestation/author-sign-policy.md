---
title: How to author an Azure Attestation policy
description: An explanation of how to author an attestation policy.
services: attestation
author: msmbaldwin
ms.service: attestation
ms.topic: overview
ms.date: 11/14/2022
ms.author: mbaldwin


---

# How to author an attestation policy

Attestation policy is a file uploaded to Microsoft Azure Attestation. Azure Attestation offers the flexibility to upload a policy in an attestation-specific policy format. Alternatively, an encoded version of the policy, in JSON Web Signature, can also be uploaded. The policy administrator is responsible for writing the attestation policy. In most attestation scenarios, the relying party acts as the policy administrator. The client making the attestation call sends attestation evidence, which the service parses and converts into incoming claims (set of properties, value). The service then processes the claims, based on what is defined in the policy, and returns the computed result.

The policy contains rules that determine the authorization criteria, properties, and the contents of the attestation token. A sample policy file looks as below:

```
version=1.0;
authorizationrules
{
   c:[type="secureBootEnabled", issuer=="AttestationService"]=> permit()
};

issuancerules
{
  c:[type="secureBootEnabled", issuer=="AttestationService"]=> issue(claim=c)
  c:[type="notSafeMode", issuer=="AttestationService"]=> issue(claim=c)
};
```
 
A policy file has three segments, as seen above:

- **version**:  The version is the version number of the grammar that is followed. 

    ```
    version=MajorVersion.MinorVersion	
    ```

    Currently the only version supported is version 1.0.

- **authorizationrules**: A collection of claim rules that will be checked first, to determine if Azure Attestation should proceed to **issuancerules**. The claim rules apply in the order they are defined.

- **issuancerules**: A collection of claim rules that will be evaluated to add additional information to the attestation result as defined in the policy. The claim rules apply in the order they are defined and are also optional.

See [claim and claim rules](claim-rule-grammar.md) for more information.
   
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

## Next steps
- [Set up Azure Attestation using PowerShell](quickstart-powershell.md)
- [Attest an SGX enclave using code samples](/samples/browse/?expanded=azure&terms=attestation)
- [Learn more about policy versions](policy-version-1-0.md)
