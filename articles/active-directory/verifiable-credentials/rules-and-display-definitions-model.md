---
title: Rules and Display Definition Reference
description: Rules and Display Definition Reference
documentationCenter: ''
author: barclayn
manager: rkarlin
ms.service: decentralized-identity
ms.topic: how-to
ms.subservice: verifiable-credentials
ms.date: 06/08/2022
ms.author: barclayn

#Customer intent: As an administrator, I am looking for information to help me disable 
---

# Rules and Display Definition Reference

[!INCLUDE [Verifiable Credentials announcement](../../../includes/verifiable-credentials-brand.md)]

Rules and Display definitions are used to define a credential. You can read more about it in [How to customize your credentials](credential-design.md).

## rulesModel type
| Property | Type | Description |
| -------- | -------- | -------- |
|`attestations`| [idTokenAttestation](#idtokenattestation-type) and/or [idTokenHintAttestation](#idtokenhintattestation-type) and/or [verifiablePresentationAttestation](#verifiablepresentationattestation-type) and/or [selfIssuedAttestation](#selfissuedattestation-type) |
|`validityInterval` | number | time span the represents the lifespan of the credential |
|`vc`| vcType array | types for this contract |


### idTokenAttestation type
When you sign-in the user from within Authenticator you can use the returned ID token from the OIDC compatible provider as input.

| Property | Type | Description |
| -------- | -------- | -------- |
| `mapping` | [claimMapping](#claimmapping-type) (optional) | rules to map input claims into output claims in the verifiable credential |
| `configuration` | string (url) | location of the identity provider's configuration document |
| `clientId` | string | client id to use when obtaining the id token |
| `redirectUri` | string | redirect uri to use when obtaining the id token MUST BE vcclient://openid/ |
| `scope` | string | space delimited list of scopes to use when obtaining the id token |
| `required` | boolean (default false) | indicating whether this attestation is required or not |
| `trustedIssuers` | optional string (array) | a list of DIDs allowed to issue the verifiable credential for this contract, this is only used for specific scenarios where the idtoken hint can come from another issuer |

### idTokenHintAttestation type
This flow uses the IDTokenHint which is provided as payload throught the Request REST API. The mapping is the same as for the ID Token attestation.

| Property | Type | Description |
| -------- | -------- | -------- |
| `mapping` | [claimMapping](#claimMapping-type) (optional) | rules to map input claims into output claims in the verifiable credential |
| `required` | boolean (default false) | indicating whether this attestation is required or not |
| `trustedIssuers` | optional string (array) | a list of DIDs allowed to issue the verifiable credential for this contract, this is only used for specific scenarios where the idtoken hint can come from another issuer |

### verifiablePresentationAttestation type
When you want the user to present another VC as input for a new issued VC. The wallet will allow the user to select the VC during issuance.

| Property | Type | Description |
| -------- | -------- | -------- |
| `mapping` | [claimMapping](#claimmapping-type) (optional) | rules to map input claims into output claims in the verifiable credential |
| `credentialType` | string (optional) | required credential type of the input |
| `required` | boolean (default false) | indicating whether this attestation is required or not |
| `trustedIssuers` | string (array) | a list of DIDs allowed to issue the verifiable credential for this contract, the service will default your issuer under the covers so no need to provide this yourself. |

### selfIssuedAttestation type
When you want the user to enter input themselves, also called self-attested input.
| Property | Type | Description |
| -------- | -------- | -------- |
| `mapping` | [claimMapping](#claimmapping-type) (optional) | rules to map input claims into output claims in the verifiable credential |
| `required` | boolean (default false) | indicating whether this attestation is required or not |


### claimMapping type
| Property | Type | Description |
| -------- | -------- | -------- |
| `inputClaim` | string | the name of the claim to use from the input |
| `outputClaim` | string | the name of the claim in the verifiable credential |
| `indexed` | boolean (default false) | indicating whether the value of this claim is used for searching; only one clientMapping object is allowed to be indexed for a given contract |
| `required` | boolean (default false) | indicating whether this mapping is required or not |
| `type` | string (optional) | type of claim |

## Example rules definition:
```
{
  "attestations": {
    "idTokenHints": [
      {
        "mapping": [
          {
            "outputClaim": "givenName",
            "required": false,
            "inputClaim": "given_name",
            "indexed": false
          },
          {
            "outputClaim": "familyName",
            "required": false,
            "inputClaim": "family_name",
            "indexed": false
          }
        ],
        "required": false
      }
    ]
  },
  "validityInterval": 2592000,
  "vc": {
    "type": [
      "VerifiedCredentialExpert"
    ]
  }
}

```

## displayModel type
| Property | Type | Description |
| -------- | -------- | -------- |
|`locale`| string | the locale of this display |
|`credential` | [displayCredential](#displaycredential-type) | the display properties of the verifiable credential |
|`consent` | [displayConsent](#displayconsent-type) | supplemental data when the verifiable credential is issued |
|`claims`| [displayClaims](#displayclaims-type) array | labels for the claims included in the verifiable credential |

### displayCrendential type
| Property | Type | Description |
| -------- | -------- | -------- |
|`title`| string | title of the credential |
|`issuedBy` | string | the name of the issuer of the credential |
|`backgroundColor` | number (hex)| background color of the credential in hex format e.g. #FFAABB |
|`textColor`| number (hex)| text color of the credential in hex format e.g. #FFAABB |
|`description`| string | supplemental text displayed alongside each credential |
|`logo`| [displayCredentialLogo](#displayCredentiallogo-type) | the logo to use for the credential |

### displayCredentialLogodisplayCredentialLogo type

| Property | Type | Description |
| -------- | -------- | -------- |
|`url`| string (url) | url of the logo (optional if image is specified) |
|`description` | string | the description of the logo |
|`image` | string | the base-64 encoded image (optional if url is specified) |

### displayConsent type

| Property | Type | Description |
| -------- | -------- | -------- |
|`title`| string | title of the consent |
|`instructions` | string | supplemental text to use when displaying consent |

### displayClaims type


| Property | Type | Description |
| -------- | -------- | -------- |
|`label`| string | the label of the claim in display |
|`claim`| string | the name of the claim to which the label applies |
|`type`| string | the type of the claim |
|`description` | string (optional) | the description of the claim |

## Example display definition:
```
{
  "locale": "en-US",
  "card": {
    "backgroundColor": "#FFA500",
    "description": "This is your Verifiable Credential",
    "issuedBy": "Contoso",
    "textColor": "#FFFF00",
    "title": "Verifiable Credential Expert",
    "logo": {
      "description": "Default VC logo",
      "uri": "https://didcustomerplayground.blob.core.windows.net/public/VerifiedCredentialExpert_icon.png"
    }
  },
  "consent": {
    "instructions": "Please click accept to add this credentials",
    "title": "Do you want to accept the verified credential expert dentity?"
  },
  "claims": [
    {
      "claim": "vc.credentialSubject.givenName",
      "label": "Name",
      "type": "String"
    },
    {
      "claim": "vc.credentialSubject.familyName",
      "label": "Surname",
      "type": "String"
    }
  ]
}
```
## Next steps

- Learn more on [how to customize your credentials](credential-design.md)