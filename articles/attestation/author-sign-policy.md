---
title: How to author and sign an Azure Attestation policy
description: An explanation of how to author and sign an attestation policy.
services: attestation
author: msmbaldwin
ms.service: attestation
ms.topic: overview
ms.date: 08/31/2020
ms.author: mbaldwin


---
# How to author and sign an attestation policy

Attestation policy is a file uploaded to Microsoft Azure Attestation. Azure Attestation offers the flexibility to upload a policy in an attestation-specific policy format. Alternatively, an encoded version of the policy, in JSON Web Signature, can also be uploaded. The policy administrator is responsible for writing the attestation policy. In most attestation scenarios, the relying party acts as the policy administrator. The client making the attestation call sends attestation evidence, which the service parses and converts into incoming claims (set of properties, value). The service then processes the claims, based on what is defined in the policy, and returns the computed result.

The policy contains rules that determine the authorization criteria, properties, and the contents of the attestation token. A sample policy file looks as below:

```
version=1.0;
authorizationrules
{
   c:[type="secureBootEnables", issuer=="AttestationService"]=> permit()
};

issuancerules
{
  c:[type="secureBootEnables", issuer=="AttestationService"]=> issue(claim=c)
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

## Signing the policy

Below is a sample Python script on how to perform policy signing operation

```python
from OpenSSL import crypto
import jwt
import getpass
       
def cert_to_b64(cert):
              cert_pem = crypto.dump_certificate(crypto.FILETYPE_PEM, cert)
              cert_pem_str = cert_pem.decode('utf-8')
              return ''.join(cert_pem_str.split('\n')[1:-2])
       
print("Provide the path to the PKCS12 file:")
pkcs12_path = str(input())
pkcs12_password = getpass.getpass("\nProvide the password for the PKCS12 file:\n")
pkcs12_bin = open(pkcs12_path, "rb").read()
pkcs12 = crypto.load_pkcs12(pkcs12_bin, pkcs12_password.encode('utf8'))
ca_chain = pkcs12.get_ca_certificates()
ca_chain_b64 = []
for chain_cert in ca_chain:
   ca_chain_b64.append(cert_to_b64(chain_cert))
   signing_cert_pkey = crypto.dump_privatekey(crypto.FILETYPE_PEM, pkcs12.get_privatekey())
signing_cert_b64 = cert_to_b64(pkcs12.get_certificate())
ca_chain_b64.insert(0, signing_cert_b64)

print("Provide the path to the policy text file:")
policy_path = str(input())
policy_text = open(policy_path, "r").read()
encoded = jwt.encode({'text': policy_text }, signing_cert_pkey, algorithm='RS256', headers={'x5c' : ca_chain_b64})
print("\nAttestation Policy JWS:")
print(encoded.decode('utf-8'))
```

## Next steps
- [Set up Azure Attestation using PowerShell](quickstart-powershell.md)
- [Attest an SGX enclave using code samples](/samples/browse/?expanded=azure&terms=attestation)