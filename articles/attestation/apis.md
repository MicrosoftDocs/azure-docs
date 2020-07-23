---
title: Azure Attestation 
description: XXX
services: attestation
author: msmbaldwin
ms.service: attestation
ms.topic: overview
ms.date: 07/20/2020
ms.author: mbaldwin


---
# Attestation APIs

Azure Attestation supports the following operations (the path for the API is in parenthesis). Each of the APIs is a RESTful API and is accessed via HTTP URIs. The following are the currently supported attestation APIs

## Attest an SGX Enclave

Processes an SGX enclave quote, producing an artifact. The type of artifact produced is dependent upon attestation policy.

- **Schemes**: https
- **HTTP Verb**: POST
- **URL**: <attestUri>/attest/SgxEnclave

    (Note - For OpenEnclave generated quotes use the following URL: <attestUri>/attest/Tee/OpenEnclave)

- **Required Parameters**: api-version=2018-09-01-preview

    Example URL: https://tradewinds.us.attest.azure.net:443/attest/SgxEnclave?api-version=2018-09-01-preview
    
    Example URL to attest OpenEnclave generated quotes:  https://tradewinds.us.attest.azure.net:443/attest/Tee/OpenEnclave?api-version=2018-09-01-preview

- **Required Headers**: Authorization: Bearer <Azure AD Bearer token>
- **Required permissions**: "Read"
- **HTTP Body**: JSON Attestation request object 
- **Properties**:
    - **Quote**: Quote of the enclave to be attested, "type" :"string"
    - **EnclaveHeldData**: Enclave-held data corresponding to quote , type :string
    - **DraftPolicyForAttestation**: Attest against the provided draft policy. Note that the resulting token cannot be validated, type :string

HTTP Response: 
- **Status code "200"**: Success, type :string 
- **Status code "400"**: The input is not valid, type :string
- **Status code "401"**: Request is unauthorized, type: string

## Get OpenID Metadata

The Get OpenID Metadata API returns an OpenID Configuration response as specified by the OpenID Connect Discovery protocol. The API retrieves metadata about the attestation signing keys in use by MAA

- **HTTP Verb**: GET
- **URL**: <attestUri>/.well-known/openid-configuration
- **Required Parameters**: <None>
- **Example URL**: https://tradewinds.us.attest.azure.net:443/.well-known/openid-configuration
- **Required Headers**: <None>
- **Required permissions**: N/A
- **HTTP Body**: None
- **Response**: On a successful HTTP response (200), the body of the response to the well-known/openid-configuration API will be an OpenID Provider Configuration Response.

An example configuration response from Azure Attestation looks like:

```json
{
	"response_types_supported":[
		"token",
		"none"
	],
	"id_token_signing_alg_values_supported":["RS256"],
	"revocation_endpoint":"https://tradewinds.us.attest.azure.net/revoke",
	"jwks_uri":"https://tradewinds.us.attest.azure.net/certs",
	"claims_supported":[
		"is-debuggable",
		"sgx-mrsigner",
		"sgx-mrenclave",
		"product-id",
		"svn",
		"tee",
		"device_id",
		"component_0_id",
		"expected_components"
	]
}
```
Status code 400: This is a general validation error. The body in the response for a 400 status code will contain information about the cause of the failure formatted as a JSON document.

## Get Attestation Signing Keys

The Get Attestation Signing Keys API returns an RFC 7517 JSON Web Key Set that contains the signing keys used to sign the attestation response.

- **HTTP Verb**: GET
- **URL**: <attestUri>/certs
- **Required Parameters**: <None>
- **Example URL**: https://tradewinds.us.attest.azure.net:443/.certs
- **Required Headers**: <None>
- **Required permissions**: N/A
- **HTTP Body**: None
- **Response**: On a successful HTTP response (200), the body of the response to the /certs API will be an RFC 7517 JSON Web Key Set
An example key response from Azure Attestation looks like:

    ```json
    {
        "keys": [
            {
                "x5c": [
                    "MIIC6jCCAdKgAwIBAgIQFqNSMWGaf7RN4iOlBGU3bjANBgkqhkiG9w0BAQsFADAxMS8wLQYDVQQDEyZodHRwczovL3RyYWRld2luZHMudXMuYXR0ZXN0LmF6dXJlLm5ldDAeFw0xOTA5MTEwMDIwNDBaFw0yMDA5MTAwNjIwNDBaMDExLzAtBgNVBAMTJmh0dHBzOi8vdHJhZGV3aW5kcy51cy5hdHRlc3QuYXp1cmUubmV0MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0Y/cu5YHLGMPleFrlMs+Ji8D7nU7T9m7FBAHrRHukDGSq2IW0w63jF04WNljhf2N2kSBueGoD5jhbbNSWTHe0Hvyl90NC8pY6ESesBADV5NYwf6xg5eCHAOAzvKCxAfLbEvEoF2pOkUi8M6umiFxtS3ditAhtXlp8e2ZJOyMd7p/DiwD6Gfakg8mGVv3oNfM7/SdPk8P8w7b7tqj7SocUO/Sini4bCLKMkbpd0tZWTbmlLwn/9eeWrzrm7Zb4XC2zzbIpYLPNl9L7Ye9WYYu3k7SIzBDh+uPQc0n13G6/tp6WjVjNAPE4wW8Zj82iNfoQM872VCjbVuIrohYg7izzwIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQDHcDhtf5lxDLPA196Sj3Zodj5wrEJ8rOiXonaLCywAXuS2G8JaPQx2jHvpKwgVFm9G/ipk5qtkLmzEhA0Zud4VrLAUGKZY7tx/I2LYEQX7SmvYtZnuFRXrSMptaTrwx/lP/0jsLdmp2HjLAjE+N8MLqPpz5BIbl1tfhRT9jXNhHsARlwjBWxrcxjj10CsLQkhRjMnmnM5wJPeVJCuvc4bPlGnD0t0CICcZ7Ke5OeHcVeGyfRSvtN5XnpY1/kYHbAMPJMw7kQfiCF3eJK8zEKreAnwReZyAOrfLvLzpuZ++crzY5CsnzASdynaaVxZDGRO0lEUp29wJgM1sP79GB6tI"
                ],
                "kid": "f1lIjBlb6jUHEUp1/nH6BNUHc6vwiUyMKKhReZeEpGc=",
                "kty": "RSA"
            },
            {
                "x5c": [
                    "MIIF5jCCA86gAwIBAgITMwAAAAPtVjxBz8HHIwAAAAAAAzANBgkqhkiG9w0BAQsFADCBgzELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEtMCsGA1UEAxMkTWljcm9zb2Z0IEF6dXJlIEF0dGVzdGF0aW9uIFBDQSAyMDE5MB4XDTE5MDYwNTE3MjkwNVoXDTIwMDkwNTE3MjkwNVowfzELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEpMCcGA1UEAxMgTWljcm9zb2Z0IEF6dXJlIEF0dGVzdGF0aW9uIDIwMTkwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCa+24LKNyEoAULNoU3nmVw2/4Xs7NUK+70v85lJrMDceHodyaBWQLfVXhz7/PD1bUfzT9bg+uxTNJ9NhTQnDf8hpTiuiMB60nS2PvzuN29tXdHmmROz+Ccu7yn7NyWB1ETOPhWP9I8tzk3K7BuJBAA7qyMBKasllDyaaW8haNIW6qyLPQvoBuK1I3idmXPwxOnwlESoxnylU1asa5cdlPb/CkaD8gPJuih0FN9k5C6Shnk2ijsmIrUJEuSkp/lZ1pBK91V9AWpsFLUctxCTM8tMZnPx4jygs7xZEpr/HLQBExOnCLam3/7BEW0fbB+WbjQflUv14ZYEAJM8U0FUK03AgMBAAGjggFUMIIBUDAOBgNVHQ8BAf8EBAMCB4AwFQYDVR0lBA4wDAYKKwYBBAGCN0wyAzAMBgNVHRMBAf8EAjAAMB0GA1UdDgQWBBRbD0G9SBlcr5cNUnSZMdC7KCpAMjAfBgNVHSMEGDAWgBStR15sz6nVWnU1XfoooXV4KJ9xrTBlBgNVHR8EXjBcMFqgWKBWhlRodHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtpb3BzL2NybC9NaWNyb3NvZnQlMjBBenVyZSUyMEF0dGVzdGF0aW9uJTIwUENBJTIwMjAxOS5jcmwwcgYIKwYBBQUHAQEEZjBkMGIGCCsGAQUFBzAChlZodHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtpb3BzL2NlcnRzL01pY3Jvc29mdCUyMEF6dXJlJTIwQXR0ZXN0YXRpb24lMjBQQ0ElMjAyMDE5LmNydDANBgkqhkiG9w0BAQsFAAOCAgEAZXRiVZbZl/Wiw1n1J4HDz2zRHSCLbzrwUc04Xh4QRYjDKgdA9dcALpcNQjM1If+wXaXQzbmDsW+5SJDg/9IcagKTPrUK/2pQ+/+uu2b4FsEMbNdq4thUnbIv+JXCFcLB2xjfVaSLhOnwtsNHO/QdzF739jsNuJ/YVz1OCIhxmK8pZWr/MjH8Q7Z2/1VHv6D5Sz/QVX9TIPJIMmvH1RVeoVlMXnGFsw0rUBD41lP6HR/lNNDGWo2OFo6ogsKNmlrO4s+vs6WX3eJDgT9K4cdHrZsJyKiCbaxR2e4n/7L+umMYewX/h392pzKOoEo36+6o8uDy6s2Uv2pn5xzx1PhgbR6w4+xkUFyfAuy6CRpl604R0aec2VtRwJFcJUDhfUaxIWWHYE5hMngVdXDgIcqG/21+/wtnqd/nIZyx0tgKo4gdnhQ63qnq9wuG39XjwmY7OFcd/8cMziha/BWnyYXEtFtzSEL5MfFpGNJAHk8hHJVDQUTXL6Cji1f4ha4QvcNS1pnMu2TV5t9dIx/j2d1BJjoMVB+cLxTonfbshq0EgSi9H1A3S6j0AYcbFCkWyeyZEqXFkEfFxpC9CCTY1y3nWSpgVbQ2LyDuEMnC5eEMoqPj0fTCHaYNX2EBoucgwtdkgEvyvoCyGKSrtpNY6Np5XrYF5+eSz+njF2Ym/KY/Z64=",
                    "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",
                    "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"
            ],
                "kid": "ZQzLfoNwhBNCu9r8Fucjn6H4Cdw",
                "kty": "RSA"
            }
        ]
    }
    ```

- **Status code 400**: This is a general validation error. The body in the response for a 400 status code will contain information about the cause of the failure formatted as a JSON document.

    The error response is a JSON document with a single property named "error". The value of the "error" property is an object which in turn contains two properties: "code", which is a string representation of the error returned and "message" which contains additional information about the details of the error. eError.

## Next steps