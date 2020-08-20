---
title: How to author and sign an Azure Attestation policy
description: XXX
services: attestation
author: msmbaldwin
ms.service: attestation
ms.topic: overview
ms.date: 07/20/2020
ms.author: mbaldwin


---
# How to author and sign an attestation policy

The Attestation policy is a file which will be uploaded to Microsoft Azure Attestation. Azure Attestation offers the flexibility to upload a policy in an attestation specific policy format. Alternatively, an encoded version of the policy, in JSON Web Signature, can also be uploaded. The policy administrator is responsible for writing the attestation policy. In most attestation scenarios, the relying party acts as the policy administrator. The client making the attestation call sends attestation evidence which the service parses and converts into incoming claims (set of properties, value). The service then processes the claims, based on what is defined in the policy, and returns the computed result.

The policy contains rules that determine the authorization criteria, properties and the contents of the attestation token. A sample policy file looks as below:

```JSON
version=1.0;
authizationrules
{
   c:[type="secureBootEnables", issuer=="AttestationService"]=> permit()
};

issuancerules
{
  c:[type="secureBootEnables", issuer=="AttestationService"]=> issue(claim=c)
  c:[type="notSafeMode", issuer=="AttestationService"]=> issue(claim=c)
};
```
 
A policy file has 3 segments as seen above:
- Version
- Authorizationrules
- Issuancerules

Version: The version is the version number of the grammar that is followed.

```json
Version=MajorVersion.MinorVersion	
```

Currently the only version supported is version 1.0.

**Authorizationrules**: The authorization rules are a collection of claim rules that will be checked first, to determine if Azure Attestation should proceed to issuancerules. The claim rules apply in the order they are defined.

**Issuancerules**: The issuance rules are a collection of claim rules that will be evaluated to add additional information to the attestation result as defined in the policy. The claim rules apply in the order they are defined and are also optional.

## Claim Rule grammar
To understand the rule grammar, in context of Azure Attestation it is important to understand what a claim is.

### Claim

Claim is a set of properties grouped together to provide relevant information. In context of attestation a claim can be visualized as below.

A claim contains the following properties:

- **type**: A string value that represents type of the claim
- **value**: A Boolean, integer or string value that represents value of the claim
- **valueType**: The data type of information stored in the value property. Supported types are String, Integer, Boolean.

  Note: if not defined the default value will be “String”.

  - **issuer**: Information(string) regarding the issuer of the claim. The issuer will be one of the below.
  - **AttestationService**: Certain claims are made available to the policy author by Azure Attestation which can be used by the attestation policy author to craft the appropriate policy.
  - **AttestationPolicy**: The policy(as defined by the administrator) itself can add claims to the incoming evidence during processing. The issuer in this case is set as “AttestationPolicy”.
  - **CustomClaim**: The attestor(client) can also add additional claims to the attestation evidence. The issuer in this case is set as “CustomClaim”.

    Note: if not defined the default value will be “CustomClaim”.

### Claim Rule

The incoming claim set is used by the policy engine to compute the attestation result. A claim rule is nothing but a set of conditions that is used to validate the incoming claims and take the defined action.

```JSON
Conditions list => Action (Claim);	
```

Azure Attestation evaluation of a claim rule involves following steps:
- If conditions list is not present, execute the action with specified claim 
- Else, evaluate the conditions from the conditions list.
- If the conditions list evaluates to false, stop. Else proceed.


The conditions in a claim rule are used to determine whether the action needs to be executed. Conditions list is a sequence of conditions that are separated by “&&” operator.
The conditions list is structured as:

```JSON
Condition && Condition &&…
```

The condition is structured as:

```JSON
Identifier:[ClaimPropertyCondition, ClaimPropertyCondition,…]
```

The condition itself is composed of individual conditions on various properties of a claim. A condition can have an optional identifier which can be used to refer the claim/s that satisfy the condition. This reference can be used in the other conditions or the action of the same rule.
For ex.
```JSON
F1:[type==”OSName” , issuer==”CustomClaim”] && 
[type==”OSName” , issuer==”AttestationService”, value== F1.value ] 
=> issueproperty(type=”report_validity_in_minutes”, value=1440);

F1:[type==”OSName” , issuer==”CustomClaim”] && 
C2:[type==”OSName” , issuer==”AttestationService”, value== F1.value ] 
=> issue(claim = C2);
```

The following are the operators that can be used to check conditions:

| Valuetype | Operations Supported |
|--|--|
| Integer | == (equals), != (not equal), <= (less than or equal), < (less than), >= (greater than or equal), > (greater than) |
| String | == (equals), != (not equal) |
| Boolean | == (equals), != (not equal) |

Evaluation of conditions list
- The presence of “&&” operator implies that a conditions list is evaluated to true only if all the conditions from the list are evaluated to true. 
- A condition represents filtering criteria on the set of claims. The condition itself is said to evaluate to true if there is at least one claim is found that satisfies the condition.
- A claim is said to satisfy the filtering criterion represented by the condition if each of its properties satisfy the corresponding claim property conditions present in the condition.  

The set of actions that are allowed in a policy are described below.
| Action Verb | Description | Policy sections to which these apply |
|--|--|--|
| permit() | The incoming claim set can be used to compute the issuancerules. Does not take any claim as a parameter | Authorizationrules |
| deny() | The incoming claim set should not be used to compute the issuancerules Does not take any claim as a parameter | Authorizationrules |
| add(claim) | Adds the claim to the incoming claims set. Any claim added to the incoming claims set will be available for the subsequent claim rules. |Authorizationrules, issuancerules |
| issue(claim) | Adds the claim to the incoming and outgoing claims set | Issuancerules |
| issueproperty(claim) | Adds the claim to the incoming and property claims set | Issuancerules

### Claim sets

Incoming claims set is generated by Azure Attestation after parsing the attestation evidence.

Outgoing claims set is created as an output by Azure Attestation. It contains all the claims that should end up in the attestation token.

Property claims set is created as an output by Azure Attestation. It contains all the claims that represent properties of the attestation token, such as encoding of the report, validity duration of the report, and so on. 
Below claims that are defined by the JWT RFC and used by Azure Attestation in the response object:

- **"iss" (Issuer) Claim**: The "iss" (issuer) claim identifies the principal that issued the JWT. The processing of this claim is generally application specific. The "iss" value is a case-sensitive string containing a StringOrURI value.
- **"iat" (Issued At) Claim**: The "iat" (issued at) claim identifies the time at which the JWT was issued. This claim can be used to determine the age of the JWT. Its value MUST be a number containing a NumericDate value.
- **"exp" (Expiration Time) Claim**: The "exp" (expiration time) claim identifies the expiration time on or after which the JWT MUST NOT be accepted for processing. The processing of the "exp" claim requires that the current date/time MUST be before the expiration date/time listed in the "exp" claim.

  Note: A 5-minute leeway is added to the issue time(iat), to account for clock skew.
- **"nbf" (Not Before) Claim**: The "nbf" (not before) claim identifies the time before which the JWT WILL NOT be accepted for processing. The processing of the "nbf" claim requires that the current date/time MUST be after or equal to the not-before date/time listed in the "nbf" claim.
  Note: A 5-minute leeway is added to the issue time(iat), to account for clock skew.
- **"jti" (JWT ID) Claim**: The "jti" (JWT ID) claim provides a unique identifier for the JWT. The identifier value is assigned in a manner that ensures that there is a negligible probability that the same value will be accidentally assigned to a different data object.

  Note: Attestation clients provide(use) a unique identifier. 

#### Claims issued by Azure Attestation in SGX enclaves

##### Incoming claim types issued by Azure Attestation (can also be used as outgoing claims)

- **$is-debuggable**: Boolean which indicates whether or not the enclave has debugging enabled or not
- **sgx-mrsigner**: hex encoded value of the “mrsigner” field of the quote
- **sgx-mrenclave**: hex encoded value of the “mrenclave” field of the quote
- **product-id**
- **svn**: security version number encoded in the quote 
- **tee: type of enclave 

##### Outgoing claim types issued by Azure Attestation 

- **maa-ehd**:  Base64Url encoded version of the “Enclave Held Data” specified in the attestation request 
- **maa-policyhash**: SHA256 hash of the policy document
- **maa-attestationcollateral**: JSON object describing the collateral used to perform the attestation with the following properties:
- **maa-quotehash**: SHA256 hash of the quote
- **maa-qeidhash**: SHA256 hash of the QE ID
- **maa-qeidcertshash**: SHA256 hash of the QE certs
- **maa-qeidcrlhash**: SHA256 hash of the QE CRL
- **maa-tcbinfohash**: SHA256 hash of the tcbinfo structure
- **maa-tcbinfocertshash**: SHA256 hash of the tcbinfo certs
- **maa-tcbinfocrlhash**: SHA256 hash of the tcbinfo crl

#### Claims issued by Azure Attestation in VBS enclaves

##### Incoming claim types issued by Azure Attestation (can also be used as outgoing claims)

- **aikValidated**:  Boolean value containing information if the Attestation Identity Key (AIK) cert has been validated or not
- **aikPubHash**:  String containing the base64(SHA256(AIK public key in DER format))
- **tpmVersion**:   Integer value containing the Trusted Platform Module (TPM) major version         
- **secureBootEnabled**: Boolean value to indicate if secure boot is enabled 
- **iommuEnabled**:  Boolean value to indicate if Input-output memory management unit (Iommu) is enabled 
- **bootDebuggingDisabled**: Boolean value to indicate if boot debugging is disabled 
- **notSafeMode**:  Boolean value to indicate if the Windows is not running on safe mode.
- **notWinPE**:  Boolean value indicating if Windows is not running in WinPE mode.
- **vbsEnabled**:  Boolean value indicating if VBS is enabled.
- **vbsReportPresent**:  Boolean value indicating if VBS enclave report is available.
- **enclaveAuthorId**:  String value containing the Base64Url encoded value of the enclave author id-The author identifier of the primary module for the enclave.
- **enclaveImageId**:  String value containing the Base64Url encoded value of the enclave Image id-The image identifier of the primary module for the enclave.
- **enclaveOwnerId**:  String value containing the Base64Url encoded value of the enclave Owner id-The identifier of the owner for the enclave.
- **enclaveFamilyId**:  String value containing the Base64Url encoded value of the enclave Family id. The family identifier of the primary module for the enclave
- **enclaveSvn**:  Integer value containing the security version number of the primary module for the enclave.
- **enclavePlatformSvn**:  Integer value containing the security version number of the platform that hosts the enclave.
- **enclaveFlags**:  The enclaveFlags claim is an Integer value containing Flags that describe the runtime policy for the enclave.

##### Outgoing claim types issued by Azure Attestation

- **policy_hash**:  String value containing SHA256 hash of the policy text computed by BASE64URL(SHA256(BASE64URL(UTF8(Policy text)))).
- **policy_signer**:  String value containing a JWK with the public key or the certificate chain present in the signed policy header. If the policy is not signed, a Microsoft generated certificate is used to sign the policy to maintain authenticity.
- **ver (Version)**:  String value containing version of the report.
Currently 1.0.
- **cnf (Confirmation) Claim**:  The "cnf" claim is used to identify the proof-of-possession key. Confirmation claim as defined in RFC 7800, contains the public part of the attested enclave key represented as a JSON Web Key (JWK) object (RFC 7517).
- **rp_data (relying party data)**:  Relying party data, if any, specified in the request. This is normally used by the relying party as a nonce to guarantee freshness of the report.

##### property claim types supported by Azure Attestation

- **report_validity_in_minutes**: An integer claim signifying how long the token is valid for
  - **Default value(time)**: one day in minutes
  - **Maximum value(time)**: one year in minutes 
- **omit_x5c**: A Boolean claim indicating if Azure Attestation should omit the cert used to provide proof of service authenticity. If true, x5t will be added to the attestation token. If false(default), x5c will be added to the attestation token.

## Drafting the policy file
1. Create a new file.
1. Add version to the file.
1. Add sections for authorizationrules and issuancerules

  ```json
  TODO
  ```
 
  The authorization rules contains the deny() action without any condition, this is to make sure no issuance rules are processed. Alternatively, the authorization rule can also contain permit() action to allow processing of issuance rules.
1. Add claim rules to the authorization rules

  ```json
  TODO
  ```

  If the incoming claim set contains a claim which matches the type, value and issuer, the permit() action will indicate to the policy engine to process the issuancerules.
1. Add claim rules to issuancerules

  ```json
  TODO
  ```
  
  The outgoing claim set will contain a claim with:

  ```json
  TODO
  ```

  Complex policies can be crafted in a similar manner. For more examples see “Policy templates/samples” section of this document.
1. Save file.

## Policy templates/samples

No Security Policy for VBS enclaves:

```JSON
version=1.0;

authorizationrules
{
    => permit();
};

issuancerules
{
    c:[type == "aas-ehd", issuer == "CustomClaim"] => issue(claim = c);
    => issueproperty(type = "omit_x5c", value = true);
};
```

The policy doesn’t validate any information in the attestation evidence. This is the least secure policy to be used by SQL.


Optimum Security Policy for VBS enclaves:

```JSON
version=1.0;

authorizationrules
{
    [type == "aikValidated",              value == true, issuer=="AttestationService"] &&
    [type == "tpmVersion",                value >= 2,    issuer=="AttestationService"] &&
    [type == "secureBootEnabled",         value == true, issuer=="AttestationService"] &&
    [type == "iommuEnabled",              value == true, issuer=="AttestationService"] &&

    [type == "bootDebuggingDisabled",     value == true, issuer=="AttestationService"] &&
    [type == "notSafeMode",               value == true, issuer=="AttestationService"] &&
    [type == "notWinPE",                  value == true, issuer=="AttestationService"] &&

    [type == "vbsEnabled",                value == true, issuer=="AttestationService"] &&
[type == "vbsReportPresent",          value == true, issuer=="AttestationService"] &&
    [type == "enclaveAuthorId",           value == "BDfK4lN9i5sHdrYbEebO09Iy6TCPYOIa2rL9kePalZg", issuer == "AttestationService"] &&
    [type == "enclaveImageId",            value == "GRcSAAEFIBMABRQDEgEiBQ",                      issuer == "AttestationService"] &&
    [type == "enclaveOwnerId",            value == "ECAwQEExIREAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", issuer == "AttestationService"] &&
    [type == "enclaveFamilyId",           value == "_v4AAAAAAAAAAAAAAAAAAA",                      issuer == "AttestationService"] &&
    [type == "enclaveSvn",                value >= 0,    issuer == "AttestationService"] &&
    [type == "enclavePlatformSvn",        value >= 1,    issuer == "AttestationService"] &&
    [type == "enclaveFlags",              value == 0,    issuer == "AttestationService"]
    => permit();
};

issuancerules
{
    c:[type == "aas-ehd", issuer == "CustomClaim"] => issue(claim = c);
    => issueproperty(type = "omit_x5c", value = true);
};
```

The policy validates VBS enclave information in the attestation evidence to allow the issuance rules. This is the optimum security policy used by SQL.

Please refer to “Attestation policy” section of this document for SGX default policy template.

## Creating the policy file in JSON Web Signature format

After creating a policy file, to upload a policy in JWS format, follow the below steps.
1. Generate the JWS, RFC 7515 with policy (utf-8 encoded) as the payload
  - The payload identifier for the Base64Url encoded policy should be “AttestationPolicy”.
  
  Sample JWT:
  ``JSON
  Header: {"alg":"none"}
  Payload: {“AttestationPolicy”:” Base64Url (policy)”}
  Signature: {}

  JWS format: eyJhbGciOiJub25lIn0.XXXXXXXXX.
``

1. Optionally to sign the policy, currently Azure Attestation supports the following algorithms: 
  1. None – When you don’t want to sign the policy payload
  1. RS256 – Supported algorithm to sign the policy payload

1. Upload the JWS and validate the policy (See “Policy management” section of this document)
  1. If the policy file is free of syntax errors the policy file gets accepted by the service.
  1. If the policy file contains syntax errors the policy file will be rejected by the service.

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
- [Attest an SGX enclave using code samples](https://docs.microsoft.com/en-us/samples/browse/?expanded=azure&terms=attestation)
