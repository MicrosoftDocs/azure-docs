---
title: What is guest attestation for confidential VMs?
description: Learn how you can use guest attestation for assurance that your software inside an Azure confidential virtual machine runs on the expected hardware platform. 
author: prasadmsft
ms.author: reprasa
ms.service: virtual-machines
ms.subservice: confidential-computing
ms.topic: conceptual
ms.date: 09/29/2022
ms.custom: template-concept, ignite-2022
---

# What is guest attestation for confidential VMs?

[Confidential virtual machines (confidential VMs)](confidential-vm-overview.md) are an offering within Azure Confidential Computing. You can use this offering when you have stringent security and confidentiality requirements for your VMs. 

The *guest attestation* feature helps you to confirm that a confidential VM runs on a hardware-based trusted execution environment (TEE) with security features enabled for isolation and integrity.

Guest attestation gives you and the relying party increased confidence that the workloads are running on a hardware-based TEE.

You can use guest attestation to:

- Make sure that the confidential VM runs on the expected confidential hardware platform (AMD SEV-SNP)
- Check that a confidential VM has secure boot enabled. This setting protects lower layers of the VM (firmware, boot loader, kernel) from malware (rootkits, bootkits).
- Get evidence for a relying party that the confidential VM runs on confidential hardware


## Scenarios

The major components and services involved in guest attestation are:

- The workload
- The guest attestation library
- Hardware (for reporting). For example, AMD-SEVSNP.
- The [Microsoft Azure Attestation service](../attestation/overview.md)
- JSON web token response

:::image type="complex" source="./media/guest-attestation-confidential-vms/attestation-workflow.png" lightbox="./media/guest-attestation-confidential-vms/attestation-workflow.png" alt-text="Diagram of guest attestation scenario for a confidential VM.":::
   This diagram shows an Azure confidential VM that contains a customer application and the C++ guest attestation library. First, the customer application requests the attestation from the library. Next, the library gets the AMD-SEVSNP report from the hardware. Then, the library attests the AMD-SEVSNP report to the Microsoft Azure Attestation service. Next, the attestation service returns a JSON web token response to the library. Last, the library returns the JSON web token response to the customer application. An extract of the JSON web token report shows the parameter "x-ms-attestation-type" value as "sevsnpvm".
:::image-end:::

Typical operational scenarios incorporate the client library to make attestation requests as follows.

### Scenario: request in separate workload

In this example scenario, attestation requests are made in a separate workload. The requests determine if the confidential VM runs on the correct hardware platform before a workload is launched.

A workload (**Platform checker client** in the diagram) must integrate with the attestation library and run inside the confidential VM to do the attestation. After the program makes a request to the attestation library, the workload parses the response to determine if the VM runs on the correct hardware platform and/or secure boot setting before launching the sensitive workload.

:::image type="complex" source="./media/guest-attestation-confidential-vms/request-client-program.png" lightbox="./media/guest-attestation-confidential-vms/request-client-program.png" alt-text="Diagram of an attestation request being made in a separate workload.":::
   This diagram shows a customer's confidential VM that contains a customer-provided workload, platform checker client, and Microsoft's guest attestation library. First, the platform checker client requests attestation from the library. The library gets a platform report from the hardware, then attests the report to the Microsoft Azure Attestation service. The attestation service returns the JSON web token response to the library, which returns the response to the platform checker client. Last, the platform checker client launches the customer workload. An extract of the JSON web token response shows the parameter "x-ms-attestation-type" value as "sevsnpvm", a virtual TPM claim parameter "kid" value of "TpmEphermeralEncryptionKey", and a secure boot claim with the parameter "secureboot" value of "true".
:::image-end:::

This scenario is similar to the [following scenario](#scenario-request-from-inside-workload). The main difference is how each scenario achieves the same goal based on the location of the request.

### Scenario: request from inside workload

In this example scenario, attestation requests are made inside the workload at the start of the program. The requests check if the confidential VM runs on the correct hardware platform before a workload is launched.

This scenario is similar to the [previous scenario](#scenario-request-in-separate-workload). The main difference is how each scenario achieves the same goal based on the location of the request.

The customer workload must integrate with the attestation library and run inside the confidential VM. After the customer workload makes a request to the attestation library, the customer workload parses the response to determine if the VM runs on the correct hardware platform and/or secure boot setting before fully setting up the sensitive workload.

:::image type="complex" source="./media/guest-attestation-confidential-vms/request-inside-workload.png" lightbox="./media/guest-attestation-confidential-vms/request-inside-workload.png" alt-text="Diagram of an attestation request being made from within a workload inside a confidential VM.":::
   This diagram shows a customer's confidential VM that contains a customer workload and Microsoft's guest attestation library. The workload makes an attestation request to the library. The library gets a platform report from the hardware, then attests that platform report to the Microsoft Azure Attestation service. The attestation service returns a JSON web token response to the library. The library then returns the JSON web token response to the customer workload. An extract of the JSON web token response shows the parameter "x-ms-attestation-type" value as "sevsnpvm", a virtual TPM claim parameter "kid" value of "TpmEphermeralEncryptionKey", and a secure boot claim with the parameter "secureboot" value of "true". 
:::image-end:::

### Scenario: relying party handshake

In this example scenario, the confidential VM must prove that it runs on a confidential platform before a relying party will engage. The confidential VM presents an attestation token to the relying party to start the engagement. 

Some examples of engagements are: 

- The confidential VM wants secrets from a secret management service.
- A client wants to make sure that the confidential VM runs on a confidential platform before revealing personal data to the confidential VM for processing.

The following diagram shows the handshake between a confidential VM and the relying party. 

:::image type="complex" source="./media/guest-attestation-confidential-vms/relying-party-scenario.png" lightbox="./media/guest-attestation-confidential-vms/relying-party-scenario.png" alt-text="Diagram of an attestation request being made in a relying party scenario.":::
   This diagram shows a customer's confidential VM that contains a customer workload and Microsoft's guest attestation library. There's also another confidential VM or regular VM that contains the relying party, such as a secrets manager. The customer or the customer's customer provides this VM. The customer's workload requests the attestation from the library. The library then gets the platform report from the hardware, and attests that report to the Microsoft Azure Attestation service. The attestation service returns a JSON web token response to the library, which returns the response to the customer's workload. The workload returns the response to the relying party, which then shares sensitive information with the customer's confidential VM that contains the workload.
:::image-end:::

The following sequence diagram further explains the relying party scenario. The request/response between the involved systems uses the guest attestation library APIs.  The confidential VM interacts with the secrets manager to bootstrap itself by using the received secrets.

:::image type="complex" source="./media/guest-attestation-confidential-vms/secrets-manager.png" lightbox="./media/guest-attestation-confidential-vms/secrets-manager.png" alt-text="Diagram of the relying party VM with a secrets manager service.":::
   This diagram shows the secrets manager part of the relying party scenario from the previous diagram. The confidential VM gets the nonce from the secrets manager service. The confidential VM attests the API. The secret manager service attests the artifacts and nonce to the Microsoft Azure Attestation service. The attestation service returns a JSON web token to the confidential VM. 
   
   The secrets manager service also validates the JSON web token and nonce. Then, the secrets manager creates PFX, creates an AES key, encrypts PFX using the AES key. The encryption API also extracts the RSA key from the JSON web token and encrypts the AES key using an RSA key.

   The secrets manager returns the encrypted PFX and AES keys to the confidential VM. The confidential VM decryption API then decrypts the AES key using a trusted platform module (TPM). Then, the confidential VM decrypts PFX using the AES key. 
:::image-end:::


## APIs

Microsoft provides the guest attestation library with APIs to [perform attestations](#attest-api), and both [encrypt](#encrypt-api) and [decrypt](#decrypt-api) data. There's also an API to [reclaim memory](#free-api).

You can use these APIs for the different [scenarios](#scenarios) described previously.

### Attest API

The **Attest** API takes the `ClientParameters` object as input and returns a decrypted attestation token. For example:

```rest
AttestationResult Attest([in] ClientParameters client_params,  

  				 [out] buffer jwt_token); 
```

| Parameter | Information |
| --------- | ----------- |
| `ClientParameters` (type: object) | Object that takes the version (type: `uint32_t`), attestation tenant URI (type: unsigned character), and client payload (type: unsigned character). The client payload is zero or more key-value pairs for any client or customer metadata that is returned in the response payload. The key-value pairs must be in JSON string format `"{\"key1\":\"value1\",\"key2\":\"value2\"}"`. For example, the attestation freshness key-value might look like `{\”Nonce\”:\”011510062022\”} `. |
| `buffer` | [JSON web token](#json-web-token) that contains attestation information. |

The **Attest** API returns an `AttestationResult` (type: structure). 

### Encrypt API

The **Encrypt** API takes data to be encrypted and a JSON web token as input. The API encrypts the data using the public ephemeral key that is present in the JSON web token. For example:

```rest
AttestationResult Encrypt(

  [enum] encryption_type, 

  [in] const unsigned char* jwt_token, 

  [in] const unsigned char* data, 

  [in] uint32_t data_size, 

  [out] unsigned char** encrypted_data, 

  [out] uint32_t* encrypted_data_size, 

  [out] unsigned char** encryption_metadata,  

  [out] uint32_t encryption_metadata_size); 
```

| Parameter | Explanation |
| --------- | ----------- |
| `encryption_type` | None. |
| `const unsigned char*  jwt_token` | [JSON web token](#json-web-token) that contains with attestation information.
| `const unsigned char* data` | Data to be encrypted | 
| `uint32_t data_size` | Size of data to be encrypted. |
| `unsigned char** encrypted_data` | Encrypted data. |
| `uint32_t* encrypted_data_size` | Size of encrypted data. |
| `unsigned char** encryption_metadata` | Encryption metadata. |
| `uint32_t encryption_metadata_size` | Size of encryption metadata. |

The **Encrypt** API returns an `AttestationResult` (type: structure).

### Decrypt API

The **Decrypt** API takes encrypted data as input and decrypts the data using the private ephemeral key that is sealed to the Trusted Platform Module (TPM). For example:

```rest
AttestationResult Decrypt([enum] encryption_type, 

  [in] const unsigned char* encrypted_data, 

  [in] uint32_t encrypted_data_size, 

  [in] const unsigned char* encryption_metadata, 

  [in] unit32_t encryption_metadata_size, 

  [out] unsigned char** decrypted_data,  

  [out] unit32_t decrypted_data_size); 
```

| Parameter | Explanation |
| --------- | ----------- |
| `encryption_type` | None. |
| `const unsigned char* encrypted_data` | Data to be decrypted. |
| `uint32_t encrypted_data_size` | Size of data to be decrypted. |
| `const unsigned char* encryption_metadata` | Encryption metadata. |
| `unit32_t encryption_metadata_size` | Size of encryption metadata. |
| `unsigned char** decrypted_data` | Decrypted data. |
| `unit32_t decrypted_data_size` | Size of decrypted data. |

The **Decrypt** API returns an `AttestationResult` (type: structure).

### Free API

The **Free** API reclaims memory that is held by data. For example:

```rest
Free([in] buffer data); 
```

| Parameter | Explanation |
| --------- | ----------- |
| `data` | Reclaim memory held by data. |

The **Free** API doesn't return anything.

## Error codes

The APIs can return the following error codes:

| Error code | Description |
| ---------- | ----------- |
| 1 | Error initializing failure. |
| 2 | Error parsing response. |
| 3 | [Managed identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md) token not found. |
| 4 | Request exceeded retries. |
| 5 | Request failed. |
| 6 | Attestation failed. |
| 7 | Send request failed. |
| 8 | Invalid input parameter. |
| 9 | Attestation parameters validation failed. |
| 10 | Memory allocation failed. |
| 11 | Failed to get operating system (OS) information. |
| 12 | TPM internal failure. |
| 13 | TPM operation failed. |
| 14 | JSON web token decryption failed. |
| 15 | JSON web token decryption TPM error. |
| 16 | Invalid JSON response. |
| 17 | Empty Versioned Chip Endorsement Key (VCEK) certificate. |
| 18 | Empty response. |
| 19 | Empty request body. |
| 20 | Report parsing failure. |
| 21 | Report empty. |
| 22 | Error extracting JSON web token information. |
| 23 | Error converting JSON web token to RSA public key. |
| 24 | **EVP_PKEY** encryption initialization failed. |
| 25 | **EVP_PKEY** encryption failed. |
| 26 | Data decryption TPM error. |
| 27 | Error parsing DNS info. |

## JSON web token

You can extract different parts of the JSON web token for the [different API scenarios](#apis) described previously. The following are important fields for the guest attestation feature:

| Claim | Attribute | Example value |
| ----- | --------- | ------------ |
| - | `x-ms-azurevm-vmid` | `2DEDC52A-6832-46CE-9910-E8C9980BF5A7 ` |
| AMD SEV-SNP hardware | `x-ms-isolation-tee`| `sevsnpvm` |
| AMD SEV-SNP hardware | `x-ms-compliance-status` (under `x-ms-isolation-tee`) | `azure-compliant-cvm` |
| Secure boot | `secure-boot` (under `x-ms-runtime` &gt; `vm-configuration`) | `true` |
| Virtual TPM | `tpm-enabled` (under `x-ms-runtime` &gt; `vm-configuration`) | `true` |
| Virtual TPM | `kid` (under `x-ms-runtime` &gt; `keys`) | `TpmEphemeralEncryptionKey` |

```json
{
  "exp": 1653021894,
  "iat": 1652993094,
  "iss": "https://sharedeus.eus.test.attest.azure.net",
  "jti": "<value>",
  "nbf": 1652993094,
  "secureboot": true,
  "x-ms-attestation-type": "azurevm",
  "x-ms-azurevm-attestation-protocol-ver": "2.0",
  "x-ms-azurevm-attested-pcrs": [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    11,
    12,
    13
  ],
  "x-ms-azurevm-bootdebug-enabled": false,
  "x-ms-azurevm-dbvalidated": true,
  "x-ms-azurevm-dbxvalidated": true,
  "x-ms-azurevm-debuggersdisabled": true,
  "x-ms-azurevm-default-securebootkeysvalidated": true,
  "x-ms-azurevm-elam-enabled": true,
  "x-ms-azurevm-flightsigning-enabled": false,
  "x-ms-azurevm-hvci-policy": 0,
  "x-ms-azurevm-hypervisordebug-enabled": false,
  "x-ms-azurevm-is-windows": true,
  "x-ms-azurevm-kerneldebug-enabled": false,
  "x-ms-azurevm-osbuild": "NotApplicable",
  "x-ms-azurevm-osdistro": "Microsoft",
  "x-ms-azurevm-ostype": "Windows",
  "x-ms-azurevm-osversion-major": 10,
  "x-ms-azurevm-osversion-minor": 0,
  "x-ms-azurevm-signingdisabled": true,
  "x-ms-azurevm-testsigning-enabled": false,
  "x-ms-azurevm-vmid": "<value>",
  "x-ms-isolation-tee": {
    "x-ms-attestation-type": "sevsnpvm",
    "x-ms-compliance-status": "azure-compliant-cvm",
    "x-ms-runtime": {
      "keys": [
        {
          "e": "AQAB",
          "key_ops": [
            "encrypt"
          ],
          "kid": "HCLAkPub",
          "kty": "RSA",
          "n": "<value>"
        }
      ],
      "vm-configuration": {
        "console-enabled": true,
        "current-time": 1652993091,
        "secure-boot": true,
        "tpm-enabled": true,
        "vmUniqueId": "<value>"
      }
    },
    "x-ms-sevsnpvm-authorkeydigest": "<value>",
    "x-ms-sevsnpvm-bootloader-svn": 2,
    "x-ms-sevsnpvm-familyId": "<value>",
    "x-ms-sevsnpvm-guestsvn": 1,
    "x-ms-sevsnpvm-hostdata": "<value>",
    "x-ms-sevsnpvm-idkeydigest": "<value>",
    "x-ms-sevsnpvm-imageId": "<value>",
    "x-ms-sevsnpvm-is-debuggable": false,
    "x-ms-sevsnpvm-launchmeasurement": "<value>",
    "x-ms-sevsnpvm-microcode-svn": 55,
    "x-ms-sevsnpvm-migration-allowed": false,
    "x-ms-sevsnpvm-reportdata": "<value>",
    "x-ms-sevsnpvm-reportid": "<value>",
    "x-ms-sevsnpvm-smt-allowed": true,
    "x-ms-sevsnpvm-snpfw-svn": 2,
    "x-ms-sevsnpvm-tee-svn": 0,
    "x-ms-sevsnpvm-vmpl": 0
  },
  "x-ms-policy-hash": "<value>",
  "x-ms-runtime": {
    "keys": [
      {
        "e": "AQAB",
        "key_ops": [
          "encrypt"
        ],
        "kid": "TpmEphemeralEncryptionKey",
        "kty": "RSA",
        "n": "<value>"
      }
    ]
  },
  "x-ms-ver": "1.0"
}
```

## Next steps

- [Learn to use a sample application with the guest attestation APIs](guest-attestation-example.md)
- [Learn how to use Microsoft Defender for Cloud integration with confidential VMs with guest attestation installed](guest-attestation-defender-for-cloud.md)
- [Learn about Azure confidential VMs](confidential-vm-overview.md)
