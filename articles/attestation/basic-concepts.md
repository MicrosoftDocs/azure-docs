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

[JSON Web Token](https://jwt.io/) (JWT) is an open standard [RFC7519](https://tools.ietf.org/html/rfc7519) method for securely transmitting information between parties as a JavaScript Object Notation (JSON) object. This information can be verified and trusted because it is digitally signed. JWTs can be signed using a secret or a public/private key pair.

## JSON Web Key (JWK)

[JSON Web Key](https://tools.ietf.org/html/rfc7517) (JWK) is a JSON data structure that represents a cryptographic key. This specification also defines a JWK Set JSON data structure that represents a set of JWKs.

## Attestation provider

Attestation provider is an Azure ARM based resource that provides access to Microsoft Azure Attestation. Attestation provider is a resource type of Azure resource provider named Microsoft.Attestation. Each provider honors a specific, discoverable policy. The attestation provider is deployed using Azure Resource Manager (ARM) which supports Role-Based Access Control (RBAC).

Example of URI of an attestation provider: https://tradewinds.us.attest.azure.net

## Attestation request

Attestation request is a serialized JSON object sent by client application to attestation provider. 
The request object for SGX enclave has two properties: 
- “Quote” – The value of the “Quote” property is a string containing a Base64URL encoded representation of the attestation quote
- “EnclaveHeldData” – The value of the “EnclaveHeldData” property is a string containing a Base64URL encoded representation of the Enclave Held Data.

Azure Attestation will validate the provided “Quote” from TEE, and will then ensure that the SHA256 hash of the provided Enclave Held Data is expressed in the first 32 bytes of the reportData field in the quote. 

## Attestation policy

Attestation policy is used to process the attestation evidence and is configurable by customers. At the core of Azure Attestation is a policy engine, which processes claims constituting the evidence. Policies are used to determine whether Azure Attestation shall issue an attestation token based on evidence (or not) , and thereby endorse the Attester (or not). Accordingly, failure to pass all the policies will result in no JWT token being issued.

Attestation providers get created with a default policy for each TEE type (note that VBS enclave has no default policy). If the default TEE policy in the attestation provider doesn’t meet their needs, customers will be able to create custom policies in any of the regions supported by Azure Attestation.

Policy management is a key feature provided to customers by Azure Attestation. Policies will be TEE-specific and can be used to identify enclaves or add claims to the output token or modify claims in an output token. 

See [examples of attestation policy](policy-samples.md) for default policy content and samples.

## Benefits of policy signing

An attestation policy is what ultimately determines if an attestation token will be issued by Azure Attestation. Policy also determines the claims to be generated in the attestation token. It is thus of utmost importance that the policy evaluated by the service is in fact the policy written by the administrator and it has not been tampered or modified by external entities. 

Trust model defines the authorization model of attestation provider to define and update policy.  Two models are supported – one based on Azure AD authorization and one based on possession of customer-managed cryptographic keys (referred as isolated model).  Isolated model will enable Azure Attestation to ensure that the customer-submitted policy is not tampered.

In isolated model, administrator creates an attestation provider specifying a set of trusted signing keys (public portion) in a single certificate file. The administrator can then add a signed policy to the attestation provider. While processing the attestation request, Azure Attestation will validate the signature of the policy using the public key represented by either the “jwk” or the “x5c” parameter in the header.  Azure Attestation will also verify that the public key in the request header is in list of trusted signing keys associated with the attestation provider. In this way, the relying party (Azure Attestation) can now trust any policy signed by the X.509 certificates it knows about. 

See [examples of policy signer certificate](policysigner-samples.md) for samples.

## Attestation token

Azure Attestation response will be a JSON string whose value contains JWT. Azure Attestation will package the claims and generates a self signed JWT.

Example of Base64URL decoded version of JWT generated for an SGX enclave:

```
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
Claims like “exp”, “iat”, “iss”, “nbf” are defined by the [JWT RFC](https://tools.ietf.org/html/rfc7517) and remaining are generated by Azure Attestation. 
See [claims issued by Azure Attestation](claimsets.md) for more information.

## Next steps

- [Authoring and signing attestation policy](authoringandsigningpolicy.md)
- [Set up Azure Attestation using PowerShell](quickstart-powershell.md)
