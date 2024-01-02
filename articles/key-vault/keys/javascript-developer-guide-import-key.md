---
title: Import keys using Azure Key Vault keys with JavaScript
description: Import keys using Azure Key Vault keys with JavaScript. 
services: key-vault
author: msmbaldwin
ms.service: key-vault
ms.subservice: keys
ms.topic: how-to
ms.custom: devx-track-js
ms.date: 07/06/2023
ms.author: mbaldwin
#Customer intent: As a JavaScript developer who is new to Azure, I want to import a key to the Key Vault with the SDK.
---

# Import keys in Azure Key Vault with JavaScript

Create the [KeyClient](/javascript/api/@azure/keyvault-keys/keyclient) with the appropriate [programmatic authentication credentials](javascript-developer-guide-get-started.md#authorize-access-and-connect-to-key-vault).

## Import a key

A best practice is to allow Key Vault to generate your keys. If you need to migrate a key to Key Vault, the key needs to be in the JWK format with any Base64 values converted to UInt8Array values.

The JSON Web Key (JWK), represented in the SDK as a [JsonWebKey](/javascript/api/@azure/keyvault-keys/jsonwebkey) object, contains a well-known public key, which can be used to validate the signature of a signed JWT.

```javascript
// Azure client libraries
import { DefaultAzureCredential } from '@azure/identity';
import {
  KeyClient
} from '@azure/keyvault-keys';

// Authenticate to Azure Key Vault
const credential = new DefaultAzureCredential();
const client = new KeyClient(
    `https://${process.env.AZURE_KEYVAULT_NAME}.vault.azure.net`,
    credential
);

const keyName = `MyImportedKey`;

// Key must be in Jwk format
const keyInJWKFormat =
{
    "p": Buffer.from("21DSdJucATc4p6OyajUDAunbanGfY0TjeELnDUfCrqFElWOX0lSw4Hy52eJkkvahqk6sUrZUa82QhJn607RPQLLIU08OUhbgvLkvhLeQYT38Tzshoefn6IoQypOk0Gn0pQ00A-nVbb7kFLx8PgT-6QA46llOqF5FZ395NjzW3V8", "base64"),
    "kty": "RSA",
    "q": Buffer.from("z1VpOnSDbcQWjuLzjDEyLWKCxskd00r2bzvYtyS593c4qD1KrguiO-3HWLtMIz5vv3861892IT6XvLJYZLR5inoXfEIpKY-0DSLC5vXtbyvbJoHm72ONJpZRP-6iVHsyNrIm6ZjKi4xKip8fulGcwXwSHA4NgC5X9cwKcAmPxo0", "base64"),
    "d": Buffer.from("OcfB9Yv8qgB3p4LHK0pBYl1B3zhM80mq9_lk-6dewc9UZtNaWhc8j6H3IFFT2CdSFobywV87YUXcOpawEVcKCuXaXy5N2aO9qa-xz5yQYacV3T3DALgAyLPwW0AqN0l2neRPTmu38PqRl7_s1-7Y4XYmx8Cn1mELXNw_MURBRtA7DY-qLd_31OdxR37NUYfWmMWCC37DzMDXuoaWIOIPnZ0QUW2MTt4YXMOYD22dZWV5JFtrFPCb19E2FjlgT4oS4N0AUFldVq73fx8igXNAzq3dDSudg3q8eNWxsO9OCkw38rYgK2A5Fw4Km324JaPuZfuN8SlrMo5A_VXKRobp2Q", "base64"),
    "e": Buffer.from("AQAB", "base64"),
    "use": "enc",
    "qi": Buffer.from("HfdGlVI9nKucgkHj9qQJJpwQG8a0DWiZQ8BwnHjgUwQCN7d85Vzc7gr-bidpg3NRRo1yVeeS7NO0wFpYMVUCoeh8Q6UdhhFz_C8gzzWHETPeJ6vV-3oKMaVXweFU16hwCrUI-rOTuoYTkARnNr-ZNjsgTYMbLVtJOgO8wF402rI", "base64"),
    "dp": Buffer.from("yulVPjP2u5022st2uBMCDUEHE826VSMYfl0P3talBeMJTFpPznczCw_6998hhGORobuWbhRpuTAA5N5-Fj8-EDMZaxK6wjKOja2cjGM1vvKVrUydSmoAw8Jx1KuTkoxloAu-M1y2bgpuhcz5-nuuyS6-efxU7SwDdMWZBRh3B2s", "base64"),
    "alg": Buffer.from("RSA1_5", "base64"),
    "dq": Buffer.from("FqRYMocI11Ljt8T3Hec9eJFagMTz2eBE207o0s9S88B0UoMnBazFkc_cxkbmAK9P2tTVIz5Hw0enoHbFinHfGA1PRUWgYyaLXifeqwROYqaibykehCQWBRHDW7z-w0UU7b4026vQ6r5uYYcRGvLQsJyRCblLJiVpe7FFroiMx_0", "base64"),
    "n": Buffer.from("sZ-GKGT9icg6-74JLMuRoRiPMJ9r0MSG8T8XAg7ANx46EqhX3kzoUYqFrV2tSD4VqSVlgg8pyDm0bTZeT8t-ScCWsIz8snWAqNmIOSOOSURO33c0_1Pe0XQSGTL96oBv6E6kqdSVSuypcAqfTB2Ms8XukCl-taUGFkId918fV4cDvBWdekaf1DbmG3D05vjfqNG-ZXYnJlgRG4Soz5RrNEWkftcdWcj8Jg7kDCYKXCcYJbyaT13vdW7A10_gY6AgmZT0Y2DJeb8qyhMT_WPnXz8fURbE8U2-fLcKXD-RFUJcHOYftcKM9dF-8UUNI_64kegynTJNdjaLv89LsKBnUw", "base64"),
};

const key = await client.importKey(keyName, keyInJWKFormat);
console.log(key?.name);
```

Learn more about JWK

* [JWT](https://jwt.io/introduction/)
* [Create JWK](https://mkjwk.org/)


## Next steps

* [Backup, delete, and restore a key](javascript-developer-guide-backup-delete-restore-key.md)