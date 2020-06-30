---
title: Azure Attestation 
description: XXX
services: attestation
author: msmbaldwin
ms.service: attestation
ms.topic: overview
ms.date: 08/31/2020
ms.author: mbaldwin


---
# Basic Concepts

## JSON Web Token (JWT)

JSON Web Token (JWT) is an open standard that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. This information can be verified and trusted because it is digitally signed. JWTs can be signed using a secret or a public/private key pair.

## Attestation provider

Attestation provider is a service endpoint that provides MAA REST contract.  Each provider honors a specific, discoverable policy.  To configure MAA for attesting enclaves, customers first have to  create an attestation provider. The attestation provider is deployed using Azure Resource Manager (ARM) which supports Role-Based Access Control (RBAC).

Example of URI of an attestation provider:  https://tradewinds.us.attest.azure.net

## Attestation request

Attestation request is a serialized JSON object sent by client application to attestation provider. 
The request object for SGX enclave has two properties: 
- “Quote” – The value of the “Quote” property is a string containing a Base64Url encoded representation of the attestation quote
- “EnclaveHeldData” – The value of the “EnclaveHeldData” property is a string containing a Base64Url encoded representation of the Enclave Held Data.

MAA will validate the provided “Quote” from TEE, and will then ensure that the SHA256 hash of the provided Enclave Held Data is expressed in the first 32 bytes of the reportData field in the quote. 

## Attestation policy

Attestation policy is used to process the attestation evidence and is configurable by customers. At the core of MAA is a policy engine, which processes claims constituting the evidence. Policies are used to determine whether MAA shall issue an attestation token based on evidence (or not) , and thereby endorse the Attester (or not). Accordingly, failure to pass all the policies will result in no JWT token being issued.

Attestation providers get created with a default policy for each TEE type (note that VBS enclave has no default policy). If the default TEE policy in the attestation provider doesn’t meet their needs, customers will be able to create custom policies in any of the regions supported by MAA. Please refer to “Policy management” section of this document for more details.
Policy management is a key feature provided by MAA. MAA will provide customers with the ability to manage policies. These policies will be TEE-specific and can be used to identify enclaves or add claims to the output token or modify claims in an output token. 

## Default Policy for SGX enclave
The policy verifies if the SGX quote is valid. 

```json
Version= 1.0;
authorizationrules
{
	c:[type==”$is-debuggable”] => permit();
};
issuancerules
{
	c:[type==”$is-debuggable”] => issue(type=”is-debuggable”, value=c.value);
	c:[type==”$sgx-mrsigner”] => issue(type=”sgx-mrsigner”, value=c.value);
	c:[type==”$sgx-mrenclave”] => issue(type=”sgx-mrenclave”, value=c.value);
	c:[type==”$product-id”] => issue(type=”product-id”, value=c.value);
	c:[type==”$svn”] => issue(type=”svn”, value=c.value);
	c:[type==”$tee”] => issue(type=”tee”, value=c.value);
};
```

## Benefits of policy signing

An attestation policy is what ultimately determines if an attestation token will be issued by MAA. Policy also determines the claims to be generated in the attestation token. It is thus of utmost importance that the policy evaluated by the service is in fact the policy written by the administrator and it has not been tampered or modified by external entities. 
Trust model defines the authorization model of attestation provider to define and update policy.  Two models are supported – one based on Azure AD authorization and one based on possession of customer-managed cryptographic keys (referred as isolated model).  Isolated model will enable MAA to ensure that the customer-submitted policy is not tampered.
In isolated model, administrator creates an attestation provider specifying a set of trusted signing keys (public portion) in a single certificate file. The administrator can then add a signed policy to the attestation provider. While processing the attestation request, MAA will validate the signature of the policy using the public key represented by either the “jwk” or the “x5c” parameter in the header.  MAA will also verify that the public key in the request header is in list of trusted signing keys associated with the attestation provider. In this way, the relying party (MAA) can now trust any policy signed by the X.509 certificates it knows about. 

## Attestation token

MAA response will be a JSON string whose value contains  JSON Web Token. MAA will package the claims in the JWT token and will sign the token with the tenant signing key. 

Example of the JSON Web Token for a SGX enclave:

```json
{
  “alg”: “RS256”,
  “jku”: “https://tradewinds.us.attest.azure.net/certs”,
  “kid”: “f1lIjBlb6jUHEUp1/Nh6BNUHc6vwiUyMKKhReZeEpGc=”,
  “typ”: “JWT”
}.{
  “maa-ehd”: <input enclave held data>,
  “exp”: 1568187398,
  “iat”: 1568158598,
  “is-debuggable”: false,
  “iss”: “https://tradewinds.us.attest.azure.net”,
  “nbf”: 1568158598,
  “product-id”: 4639,
  “sgx-mrenclave”: “”,
  “sgx-mrsigner”: “”,
  “svn”: 0,
  “tee”: “sgx”
}.[Signature]
```
Claims like “exp”, “iat”, “iss”, “nbf” are defined by the JWT RFC and remaining are generated by MAA. Please refer to “Claim sets” section of this document for more information on the claims issued by MAA.

## Next steps

