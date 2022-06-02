---
title: Examples of an Azure Attestation token
description: Examples of Azure Attestation token
services: attestation
author: msmbaldwin
ms.service: attestation
ms.topic: overview
ms.date: 08/31/2020
ms.author: mbaldwin


---
# Examples of an attestation token

Attestation policy is used to process the attestation evidence and determine whether Azure Attestation will issue an attestation token. Attestation token generation can be controlled with custom policies. Below are some examples of an attestation policy. 

## Sample JWT generated for an SGX enclave:

```
{
  "alg": "RS256",
  "jku": "https://tradewinds.us.attest.azure.net/certs",
  "kid": <self signed certificate reference to perform signature verification of attestation token,
  "typ": "JWT"
}.{
  "aas-ehd": <input enclave held data>,
  "exp": 1568187398,
  "iat": 1568158598,
  "is-debuggable": false,
  "iss": "https://tradewinds.us.attest.azure.net",
  "maa-attestationcollateral": 
    {
      "qeidcertshash": <SHA256 value of QE Identity issuing certs>,
      "qeidcrlhash": <SHA256 value of QE Identity issuing certs CRL list>,
      "qeidhash": <SHA256 value of the QE Identity collateral>,
      "quotehash": <SHA256 value of the evaluated quote>, 
      "tcbinfocertshash": <SHA256 value of the TCB Info issuing certs>, 
      "tcbinfocrlhash": <SHA256 value of the TCB Info issuing certs CRL list>, 
      "tcbinfohash": <SHA256 value of the TCB Info collateral>
     },
  "maa-ehd": <input enclave held data>,
  "nbf": 1568158598,
  "product-id": 4639,
  "sgx-mrenclave": <SGX enclave mrenclave value>,
  "sgx-mrsigner": <SGX enclave msrigner value>,
  "svn": 0,
  "tee": "sgx"
  "x-ms-attestation-type": "sgx", 
  "x-ms-policy-hash": <>,
  "x-ms-sgx-collateral": 
    {
      "qeidcertshash": <SHA256 value of QE Identity issuing certs>,
      "qeidcrlhash": <SHA256 value of QE Identity issuing certs CRL list>,
      "qeidhash": <SHA256 value of the QE Identity collateral>,
      "quotehash": <SHA256 value of the evaluated quote>, 
      "tcbinfocertshash": <SHA256 value of the TCB Info issuing certs>, 
      "tcbinfocrlhash": <SHA256 value of the TCB Info issuing certs CRL list>, 
      "tcbinfohash": <SHA256 value of the TCB Info collateral>
     },
  "x-ms-sgx-ehd": <>, 
  "x-ms-sgx-is-debuggable": true,
  "x-ms-sgx-mrenclave": <SGX enclave mrenclave value>,
  "x-ms-sgx-mrsigner": <SGX enclave msrigner value>, 
  "x-ms-sgx-product-id": 1, 
  "x-ms-sgx-svn": 1,
  "x-ms-ver": "1.0",
  "x-ms-sgx-config-id": "000102030405060708090a0b0c0d8f99000102030405060708090a0b0c860e9a000102030405060708090a0b7d0d0e9b000102030405060708090a740c0d0e9c",
  "x-ms-sgx-config-svn": 3451,
  "x-ms-sgx-isv-extended-product-id": "8765432143211234abcdabcdef123456",
  "x-ms-sgx-isv-family-id": "1234567812344321abcd1234567890ab"
}.[Signature]
```

Some of the claims used above are considered deprecated but are fully supported.  It is recommended that all future code and tooling use the non-deprecated claim names. See [claims issued by Azure Attestation](claim-sets.md) for more information.

The below claims will appear only in the attestation token generated for Intel® Xeon® Scalable processor-based server platforms. The claims will not appear if the SGX enclave is not configured with [Key Separation and Sharing Support](https://github.com/openenclave/openenclave/issues/3054)
