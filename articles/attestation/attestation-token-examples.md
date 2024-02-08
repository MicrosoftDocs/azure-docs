---
title: Examples of an Azure Attestation token
description: Examples of Azure Attestation token
services: attestation
author: msmbaldwin
ms.service: attestation
ms.topic: overview
ms.date: 06/07/2022
ms.author: mbaldwin


---
# Examples of an attestation token

Attestation policy is used to process the attestation evidence and determines whether Azure Attestation issues an attestation token. Attestation token generation can be controlled with custom policies. Here are some examples of an attestation token. 

## Sample JWT generated for SGX attestation

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

Some of the claims used here are considered deprecated but are fully supported.  It is recommended that all future code and tooling use the non-deprecated claim names. For more information, see [claims issued by Azure Attestation](claim-sets.md).

The below claims appear only in the attestation token generated for Intel® Xeon® Scalable processor-based server platforms. The claims do not appear if the SGX enclave is not configured with [Key Separation and Sharing Support](https://github.com/openenclave/openenclave/issues/3054)

**x-ms-sgx-config-id**

**x-ms-sgx-config-svn**

**x-ms-sgx-isv-extended-product-id**

**x-ms-sgx-isv-family-id**

## Sample JWT generated for SEV-SNP attestation

```
{ 
  "exp": 1649970020, 
  "iat": 1649941220, 
  "iss": "https://maasandbox0001.wus.attest.azure.net", 
  "jti": "b65da1dcfbb4698b0bb2323cac664b745a2ff1cffbba55641fd65784aa9474d5", 
  "nbf": 1649941220, 
  "x-ms-attestation-type": "sevsnpvm", 
  "x-ms-compliance-status": "azure-compliant-cvm", 
  "x-ms-policy-hash": "LTPRQQju-FejAwdYihF8YV_c2XWebG9joKvrHKc3bxs", 
  "x-ms-runtime": { 
    "keys": [ 
      { 
        "e": "AQAB", 
        "key_ops": ["encrypt"], 
        "kid": "HCLTransferKey", 
        "kty": "RSA", 
        "n": "ur08DccjGGzRo3OIq445n00Q3OthMIbR3SWIzCcicIM_7nPiVF5NBIknk2zdHZN1iiNhIzJezrXSqVT7Ty1Dl4AB5xiAAqxo7xGjFqlL47NA8WbZRMxQtwlsOjZgFxosDNXIt6dMq7ODh4nj6nV2JMScNfRKyr1XFIUK0XkOWvVlSlNZjaAxj8H4pS0yNfNwr1Q94VdSn3LPRuZBHE7VrofHRGSHJraDllfKT0-8oKW8EjpMwv1ME_OgPqPwLyiRzr99moB7uxzjEVDe55D2i2mPrcmT7kSsHwp5O2xKhM68rda6F-IT21JgdhQ6n4HWCicslBmx4oqkI-x5lVsRkQ" 
      } 
    ], 
    "vm-configuration": { 
      "secure-boot": true, 
      "secure-boot-template-id": "1734c6e8-3154-4dda-ba5f-a874cc483422", 
      "tpm-enabled": true, 
      "vmUniqueId": "AE5CBB2A-DC95-4870-A74A-EE4FB33B1A9C" 
    } 
  }, 
  "x-ms-sevsnpvm-authorkeydigest": "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000", 
  "x-ms-sevsnpvm-bootloader-svn": 0, 
  "x-ms-sevsnpvm-familyId": "01000000000000000000000000000000", 
  "x-ms-sevsnpvm-guestsvn": 1, 
  "x-ms-sevsnpvm-hostdata": "0000000000000000000000000000000000000000000000000000000000000000", 
  "x-ms-sevsnpvm-idkeydigest": "38ed94f9aab20bc5eb40e89c7cbb03aa1b9efb435892656ade789ccaa0ded82ff18bae0e849c3166351ba1fa7ff620a2", 
  "x-ms-sevsnpvm-imageId": "02000000000000000000000000000000", 
  "x-ms-sevsnpvm-is-debuggable": false, 
  "x-ms-sevsnpvm-launchmeasurement": "04a170f39a3f702472ed0c7ecbda9babfc530e3caac475fdd607ff499177d14c278c5a15ad07ceacd5230ae63d507e9d", 
  "x-ms-sevsnpvm-microcode-svn": 40, 
  "x-ms-sevsnpvm-migration-allowed": false, 
  "x-ms-sevsnpvm-reportdata": "99dd4593a43f4b0f5f10f1856c7326eba309b943251fededc15592e3250ca9e90000000000000000000000000000000000000000000000000000000000000000", 
  "x-ms-sevsnpvm-reportid": "d1d5c2c71596fae601433ecdfb62799de2a785cc08be3b1c8a4e26a381494787", 
  "x-ms-sevsnpvm-smt-allowed": true, 
  "x-ms-sevsnpvm-snpfw-svn": 0, 
  "x-ms-sevsnpvm-tee-svn": 0, 
  "x-ms-sevsnpvm-vmpl": 0, 
  "x-ms-ver": "1.0" 
} 
```

## Sample JWT generated for TDX attestation

The definitions of below claims are available in [Azure Attestation TDX EAT profile](trust-domain-extensions-eat-profile.md)

```
{
   "attester_tcb_status": "UpToDate",
   "dbgstat": "disabled",
   "eat_profile": "https://aka.ms/maa-eat-profile-tdxvm",
   "exp": 1697706287,
   "iat": 1697677487,
   "intuse": "generic",
   "iss": "https://maasand001.eus.attest.azure.net",
   "jti": "5f65006d573bc1c04f67820348c20f5d8da72ddbbd4d6c03da8de9f11b5cf29b",
   "nbf": 1697677487,
   "tdx_mrconfigid": "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
   "tdx_mrowner": "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
   "tdx_mrownerconfig": "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
   "tdx_mrseam": "2fd279c16164a93dd5bf373d834328d46008c2b693af9ebb865b08b2ced320c9a89b4869a9fab60fbe9d0c5a5363c656",
   "tdx_mrsignerseam": "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
   "tdx_mrtd": "5be56d418d33661a6c21da77c9503a07e430b35eb92a0bd042a6b3c4e79b3c82bb1c594e770d0d129a0724669f1e953f",
   "tdx_report_data": "93c6db49f2318387bcebdad0275e206725d948f9000d900344aa44abaef145960000000000000000000000000000000000000000000000000000000000000000",
   "tdx_rtmr0": "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
   "tdx_rtmr1": "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
   "tdx_rtmr2": "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
   "tdx_rtmr3": "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
   "tdx_seam_attributes": "0000000000000000",
   "tdx_seamsvn": 3,
   "tdx_td_attributes": "0000000000000000",
   "tdx_td_attributes_debug": false,
   "tdx_td_attributes_key_locker": false,
   "tdx_td_attributes_perfmon": false,
   "tdx_td_attributes_protection_keys": false,
   "tdx_td_attributes_septve_disable": false,
   "tdx_tee_tcb_svn": "03000600000000000000000000000000",
   "tdx_xfam": "e718060000000000",
   "x-ms-attestation-type": "tdxvm",
   "x-ms-compliance-status": "azure-compliant-cvm",
   "x-ms-policy-hash": "B56nbp5slhw66peoRYkpdq1WykMkEworvdol08hnMXE",
   "x-ms-runtime": {
      "test-claim-name": "test-claim-value"
   },
   "x-ms-ver": "1.0"
} 
```

## Next steps

- [View examples of an attestation policy](policy-examples.md)
