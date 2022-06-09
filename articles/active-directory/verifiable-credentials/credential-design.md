---
title: How to customize your Azure Active Directory Verifiable Credentials (preview)
description: This article shows you how to create your own custom verifiable credential
services: active-directory
author: barclayn
manager: rkarlin
ms.service: decentralized-identity
ms.subservice: verifiable-credentials
ms.topic: how-to
ms.date: 06/08/2022
ms.author: barclayn
# Customer intent: As a developer I am looking for information on how to enable my users to control their own information 
---

# How to customize your verifiable credentials (preview)

[!INCLUDE [Verifiable Credentials announcement](../../../includes/verifiable-credentials-brand.md)]

Verifiable credentials are made up of two components, the rules and display definitions. The rules definition determines what the user needs to provide before they receive a verifiable credential. The display definition controls the branding of the credential and styling of the claims. In this guide, we will explain how to modify both files to meet the requirements of your organization. 

> [!IMPORTANT]
> Azure Active Directory Verifiable Credentials is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Rules definition: Requirements from the user

The rules definition is a simple JSON document that describes important properties of verifiable credentials. In particular, it describes how claims are used to populate your verifiable credential.

There are currently three input types that are available to configure in the rules definition. These types are used by the verifiable credential issuing service to insert claims into a verifiable credential and attest to that information with your DID. The following are the four types with explanations.

- ID Token
- ID Token Hint
- Verifiable credentials via a verifiable presentation.
- Self-Attested Claims

**ID token:** When this option is configured, you will need to provide an Open ID Connect configuration URI and include the claims that should be included in the VC. The user will be prompted to 'Sign in' on the Authenticator app to meet this requirement and add the associated claims from their account. 

**ID token hint:** The sample App and Tutorial use the ID Token Hint. When this option is configured, the relying party app will need to provide claims that should be included in the VC in the Request Service API issuance request. Where the relying party app gets the claims from is up to the app, but it can come from the current login session, from backend CRM systems or even from self asserted user input. 

**Verifiable credentials:** The end result of an issuance flow is to produce a Verifiable Credential but you may also ask the user to Present a Verifiable Credential in order to issue one. The rules definition is able to take specific claims from the presented Verifiable Credential and include those claims in the newly issued Verifiable Credential from your organization. 

**Self attested claims:** When this option is selected, the user will be able to directly type information into Authenticator. At this time, strings are the only supported input for self attested claims. 

![detailed view of verifiable credential card](media/credential-design/issuance-doc.png) 

**Static claims:** Additionally we are able to declare a static claim in the rules definition, however this input doesn't come from the user. The Issuer defines a static claim in the rules definition and would look like any other claim in the Verifiable Credential. Add a credentialSubject after vc.type and declare the attribute and the claim. 

```json
"vc": {
    "type": [ "StaticClaimCredential" ],
    "credentialSubject": {
      "staticClaim": true,
      "anotherClaim": "Your Claim Here"
    },
  }
}
```

## Input type: ID token

To get ID Token as input, the rules definition needs to configure the well-known endpoint of the OIDC compatible Identity system. In that system you need to register an application with the correct information from [Issuer service communication examples](issuer-openid.md). Additionally, the client_id needs to be put in the rules definition, as well as a scope parameter needs to be filled in with the correct scopes. For example, Azure Active Directory needs the email scope if you want to return an email claim in the ID token.

```json
  {
      "attestations": {
        "idTokens": [
          {
            "mapping": [
              { 
                "outputClaim": "firstName", 
                "inputClaim": "given_name",
                "required": true,
                "indexed": false                 
              },
              { 
                "outputClaim": "lastName", 
                "inputClaim": "family_name",
                "required": true,
                "indexed": true                 
              }
            ],
            "configuration": "https://dIdPlayground.b2clogin.com/dIdPlayground.onmicrosoft.com/B2C_1_sisu/v2.0/.well-known/openid-configuration",
            "client_id": "8d5b446e-22b2-4e01-bb2e-9070f6b20c90",
            "redirect_uri": "vcclient://openid/",
            "scope": "openid profile"
          }
        ]
      },
      "validityInterval": 2592000,
      "vc": {
        "type": ["https://schema.org/EducationalCredential", "https://schemas.ed.gov/universityDiploma2020", "https://schemas.contoso.edu/diploma2020" ]
      }
    }
```

Please see [idToken attestation](rules-and-display-definitions-model.md#idTokenAttestation-type) for reference of properties.

## Input type: ID token hint

To get ID Token hint as input, the rules definition shouldn't contain configuration for and OIDC Identity system but instead have the special value `https://self-issued.me` for the configuration property. The claims mappings are the same as for the ID token type, but the difference is that the claim values need to be provided by the issuance relying party app in the Request Service API issuance request.

```json
  {
      "attestations": {
        "idTokenHints": [
          {
            "configuration": "https://self-issued.me",
            "mapping": [
              { 
                "outputClaim": "firstName", 
                "inputClaim": "given_name",
                "required": true,
                "indexed": false                 
              },
              { 
                "outputClaim": "lastName", 
                "inputClaim": "family_name",
                "required": true,
                "indexed": true                 
              }
            ]
          }
        ]        
      },
      "validityInterval": 2592000,
      "vc": {
        "type": ["VerifiedCredentialExpert" ]
      }
    }
```

See [idTokenHint attestation](rules-and-display-definitions-model.md#idTokenHintAttestation-type) for reference of properties.

### vc.type: Choose credential type(s) 

All verifiable credentials must declare their "type" in their rules definition. The type of a credential distinguishes your verifiable credentials from credentials issued by other organizations and ensures interoperability between issuers and verifiers. To indicate a credential type, you must provide one or more credential types that the credential satisfies. Each type is represented by a unique string - often a URI will be used to ensure global uniqueness. The URI doesn't need to be addressable; it is treated as a string. 

As an example, a diploma credential issued by Contoso University might declare the following types:

| Type | Purpose |
| ---- | ------- |
| `https://schema.org/EducationalCredential` | Declares that diplomas issued by Contoso University contain attributes defined by schema.org's `EducationaCredential` object. |
| `https://schemas.ed.gov/universityDiploma2020` | Declares that diplomas issued by Contoso University contain attributes defined by the United States department of education. |
| `https://schemas.contoso.edu/diploma2020` | Declares that diplomas issued by Contoso University contain attributes defined by Contoso University. |

By declaring all three types, Contoso University's diplomas can be used to satisfy different requests from verifiers. A bank can request a set of `EducationCredential`s from a user, and the diploma can be used to satisfy the request. But the Contoso University Alumni Association can request a credential of type `https://schemas.contoso.edu/diploma2020`, and the diploma will also satisfy the request.

To ensure interoperability of your credentials, it's recommended that you work closely with related organizations to define credential types, schemas, and URIs for use in your industry. Many industry bodies provide guidance on the structure of official documents that can be repurposed for defining the contents of verifiable credentials. You should also work closely with the verifiers of your credentials to understand how they intend to request and consume your verifiable credentials.

## Input type: Verifiable credential

>[!NOTE]
>rules definitions that ask for a verifiable credential do not use the presentation exchange format for requesting credentials. This will be updated when the Issuing Service supports the standard, Credential Manifest. 

```json
{
    "attestations": {
      "presentations": [
        {
            "mapping": [
              { 
                "outputClaim": "first_name", 
                "inputClaim": "$.vc.credentialSubject.firstName ",
                "required": true,
                "indexed": false                 
              },
              { 
                "outputClaim": "last_name", 
                "inputClaim": ""$.vc.credentialSubject.lastName ",
                "required": true,
                "indexed": true                 
              },
          "credentialType": "VerifiedCredentialNinja",
          "contracts": [
            "https://beta.did.msidentity.com/v1.0/3c32ed40-8a10-465b-8ba4-0b1e86882668/verifiableCredential/contracts/VerifiedCredentialNinja"
          ],
          "issuers": [
            {
              "iss": "did:ion:123"
            }
          ]
        }
      ]
    },
    "validityInterval": 25920000,
    "vc": {
      "type": [
        "ProofOfNinjaNinja"
      ]
    }
}
```

See [verifiablePresentation attestation](rules-and-display-definitions-model.md#verifiablePresentationAttestation-type) for reference of properties.

## Input type: Selfattested claims

During the issuance flow, the user can be asked to input some self-attested information. As of now, the only input type is a 'string'. 

```json
{
  "attestations": {
    "selfIssued" :
    {
            "mapping": [
              { 
                "outputClaim": "firstName", 
                "inputClaim": "firstName",
                "required": true,
                "indexed": false                 
              },
              { 
                "outputClaim": "lasttName", 
                "inputClaim": "lastName",
                "required": true,
                "indexed": true                 
              }


    }
  },
  "validityInterval": 2592001,
  "vc": {
    "type": [ "VerifiedCredentialExpert" ]
  }
}
```

See [selfIssued attestation](rules-and-display-definitions-model.md#selfIssuedAttestation-type) for reference of properties.

## Display definition: Verifiable credentials in Microsoft Authenticator

Verifiable credentials offer a limited set of options that can be used to reflect your brand. This article provides instructions how to customize your credentials, and best practices for designing credentials that look great once issued to users.

Verifiable credentials issued to users are displayed as cards in Microsoft Authenticator. As the administrator, you may choose card color, icon, and text strings to match your organization's brand.

![issuance documentation](media/credential-design/detailed-view.png) 

Cards also contain customizable fields that you can use to let users know the purpose of the card, the attributes it contains, and more.

## Create a credential display definition

Much like the rules definition, the display definition is a simple JSON document that describes how the contents of your verifiable credentials should be displayed in the Microsoft Authenticator app.

>[!NOTE]
> At this time, this display model is only used by Microsoft Authenticator.

The display definition has the following structure.

```json
{
    "default": {
      "locale": "en-US",
      "card": {
        "title": "University Graduate",
        "issuedBy": "Contoso University",
        "backgroundColor": "#212121",
        "textColor": "#FFFFFF",
        "logo": {
          "uri": "https://contoso.edu/images/logo.png",
          "description": "Contoso University Logo"
        },
        "description": "This digital diploma is issued to students and alumni of Contoso University."
      },
      "consent": {
        "title": "Do you want to get your digital diploma from Contoso U?",
        "instructions": "Please log in with your Contoso U account to receive your digital diploma."
      },
      "claims": [
        {
          "claim": "vc.credentialSubject.name",
          "type": "String",
          "label": "Name"
        }
      ]
    }
}
```

See [Display definition model](rules-and-display-definitions-model.md#displayModel-type) for reference of properties.

## Next steps

Now you have a better understanding of verifiable credential design and how you can create your own to meet your needs.

- [Issuer service communication examples](issuer-openid.md)
- Reference for [Rules and Display definitions](rules-and-display-definitions-model.md)
