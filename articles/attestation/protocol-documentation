---
title: Azure Attestation Basic Concepts
description: Basic concepts of Azure Attestation.
services: attestation
author: msmbaldwin
ms.service: attestation
ms.topic: overview
ms.date: 08/31/2020
ms.author: mbaldwin


---
# Basic Concepts

Below are some basic concepts related to Microsoft Azure Attestation.

## JSON Web Token (JWT)

[JSON Web Token](https://jwt.io/) (JWT) is an open standard [RFC7519](https://tools.ietf.org/html/rfc7519) method for securely transmitting information between parties as a JavaScript Object Notation (JSON) object. This information can be verified and trusted because it is digitally signed. JWTs can be signed using a secret or a public/private key pair.

## JSON Web Key (JWK)

[JSON Web Key](https://tools.ietf.org/html/rfc7517) (JWK) is a JSON data structure that represents a cryptographic key. This specification also defines a JWK Set JSON data structure that represents a set of JWKs.

## Attestation provider

Attestation provider belongs to Azure resource provider named Microsoft.Attestation. The resource provider is a service endpoint that provides Azure Attestation REST contract and is deployed using [Azure Resource Manager](../azure-resource-manager/management/overview.md). Each attestation provider honors a specific, discoverable policy. 

Attestation providers get created with a default policy for each TEE type (note that VBS enclave has no default policy). See [examples of an attestation policy](policy-examples.md) for more details on the default policy for SGX.

### Regional default provider

Azure Attestation provides a default provider in each region. Customers can choose to use the default provider for attestation, or create their own providers with custom policies. The default providers are accessible by any Azure AD user and the policy associated with a default provider cannot be altered.

| Region | Attest Uri | 
|--|--|
| UK South | https://shareduks.uks.attest.azure.net | 
| US East 2 | https://sharedeus2.eus2.attest.azure.net | 
| Central US | https://sharedcus.cus.attest.azure.net | 
| East US| https://sharedeus.eus.attest.azure.net | 
| Canada Central | https://sharedcac.cac.attest.azure.net | 

## Attestation request

Attestation request is a serialized JSON object sent by client application to attestation provider. 
The request object for SGX enclave has two properties: 
- “Quote” – The value of the “Quote” property is a string containing a Base64URL encoded representation of the attestation quote
- “EnclaveHeldData” – The value of the “EnclaveHeldData” property is a string containing a Base64URL encoded representation of the Enclave Held Data.

Azure Attestation will validate the provided “Quote” from TEE, and will then ensure that the SHA256 hash of the provided Enclave Held Data is expressed in the first 32 bytes of the reportData field in the quote. 

## Attestation policy

Attestation policy is used to process the attestation evidence and is configurable by customers. At the core of Azure Attestation is a policy engine, which processes claims constituting the evidence. Policies are used to determine whether Azure Attestation shall issue an attestation token based on evidence (or not) , and thereby endorse the Attester (or not). Accordingly, failure to pass all the policies will result in no JWT token being issued.

If the default TEE policy in the attestation provider doesn’t meet the needs, customers will be able to create custom policies in any of the regions supported by Azure Attestation. Policy management is a key feature provided to customers by Azure Attestation. Policies will be TEE-specific and can be used to identify enclaves or add claims to the output token or modify claims in an output token. 

See [examples of an attestation policy](policy-examples.md) for default policy content and samples.

## Benefits of policy signing

An attestation policy is what ultimately determines if an attestation token will be issued by Azure Attestation. Policy also determines the claims to be generated in the attestation token. It is thus of utmost importance that the policy evaluated by the service is in fact the policy written by the administrator and it has not been tampered or modified by external entities. 

Trust model defines the authorization model of attestation provider to define and update policy.  Two models are supported – one based on Azure AD authorization and one based on possession of customer-managed cryptographic keys (referred as isolated model).  Isolated model will enable Azure Attestation to ensure that the customer-submitted policy is not tampered.

In isolated model, administrator creates an attestation provider specifying a set of trusted signing X.509 certificates in a file. The administrator can then add a signed policy to the attestation provider. While processing the attestation request, Azure Attestation will validate the signature of the policy using the public key represented by either the “jwk” or the “x5c” parameter in the header.  Azure Attestation will also verify if public key in the request header is in the list of trusted signing certificates associated with the attestation provider. In this way, the relying party (Azure Attestation) can trust a policy signed using the X.509 certificates it knows about. 

See [examples of policy signer certificate](policy-signer-examples.md) for samples.

## Attestation token

Azure Attestation response will be a JSON string whose value contains JWT. Azure Attestation will package the claims and generates a signed JWT. The signing operation is performed using a self-signed certificate with subject name matching the AttestUri element of the attestation provider.

The Get OpenID Metadata API returns an OpenID Configuration response as specified by the [OpenID Connect Discovery protocol](https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderConfig). The API retrieves metadata about the signing certificates in use by Azure Attestation.

Example of JWT generated for an SGX enclave:

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
See [claims issued by Azure Attestation](claim-sets.md) for more information.

## Next steps

- [How to author and sign an attestation policy](author-sign-policy.md)
- [Set up Azure Attestation using PowerShell](quickstart-powershell.md)
