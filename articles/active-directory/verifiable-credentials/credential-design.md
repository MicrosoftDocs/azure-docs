---
title: How to customize your verifiable credentials (preview)
description: This article shows you how you can customize your credentials
services: active-directory
author: barclayn
manager: davba
ms.service: identity
ms.subservice: verifiable-credentials
ms.topic: how-to
ms.date: 03/14/2021
ms.author: barclayn
# Customer intent: As a developer I am looking for information on how to enable my users to control their own information 
---

# How to customize your verifiable credentials (preview)

> [!IMPORTANT]
> Azure Verifiable Credentials is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Verifiable Credentials are made up of two components, the rules and display files. The Rules file determines what the user needs to do in order to receive a Verifiable Credential and the Display File controls the branding of the credential and styling of the claims. In this guide, we will explain how to modify both files to meet the requirements of your organization. 

## Rules File: Requirements from the user

The rules file is a simple JSON file that describes important properties of verifiable credentials. In particular it describes how claims are used to populate your Verifiable Credentials. 

There are currently 3 input types that that are available to configure in the rules file. These types are used by the Verifiable Credential Issuing service to insert claims into a Verifiable Credential and attest to that information with your DID. The following are the 3 types with explanations. 

- ID Token
- Verifiable Credentials via a Verifiable Presentation 
- Self Issued Claims


**ID Token:** The Sample App and Tutorial use the ID Token. When this option is selected, you will need to provide an Open ID Connect configuration URI and include the claims that should be included in the VC. The user will be prompted to 'Sign In' on the Authenticator app in order to meet this requirement and add the associated claims from their account. 

  ![ID Token](media/credential-design/id_token.png)

**Verifiable Credentials:** The end result of an issuance flow is to produce a Verifiable Credential but you may also ask the user to Present a Verifiable Credential in order to issue one. The Rules File is able to take specific claims from the presented Verifiable Credential and include those claims in the newly issued Verifiable Credential from your organization. 

![ID Token](media/credential-design/vc_for_vc.png)

**Self Issued Claims:** When this option is selected, the user will be able to directly type information into Authenticator. At this time, strings are the only supported input for self issued claims. 

![ID Token](media/credential-design/self_issued.png)

**Static Claims:** Additionally we are able declare a static claim in the Rules file, however this input does not come from the user. The Issuer defines a static claim in the Rules file and would look like any other claim in the Verifiable Credential. Simply add a credentialSubject after vc.type and declare the attribute and the claim. 

```json
"vc": {
    "type": [ "StaticClaimCredential" ],
    "credentialSubject": {
      "staticClaim": true
    },
  }
}
```


## Input Type: ID Token

```json
    {
      "attestations": {
        "idTokens": [
          {
            "mapping": {
              "firstName": { "claim": "given_name" },
              "lastName": { "claim": "family_name" }
            },
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

| Property | Description |
| -------- | ----------- |
| `attestations.idTokens` | An array of OpenID Connect identity providers that are supported for sourcing user information. |
| `...mapping` | An object that describes how claims in each ID token are mapped to attributes in the resulting Verifiable Credential. |
| `...mapping.{attribute-name}` | The attribute that should be populated in the resulting Verifiable Credential. |
| `...mapping.{attribute-name}.claim` | The claim in ID tokens whose value should be used to populate the attribute. |
| `...configuration` | The location of your identity provider's configuration document. This URL must adhere to the [OpenID Connect standard for identity provider metadata](https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderMetadata). The configuration document must include the `issuer`, `authorization_endpoint`, `token_endpoint`, and `jwks_uri` fields. |
| `...client_id` | The client ID obtained during the client registration process. |
| `...scope` | A space delimited list of scopes the IDP needs to be able to return the correct claims in the ID token. |
| `...redirect_uri` | Must always use the value `vcclient://openid/`. |
| `validityInterval` | A time duration, in seconds, representing the lifetime of your Verifiable Credentials. After this time period elapses, the Verifiable Credential will no longer be valid. Omitting this value means that each Verifiable Credential will remain valid until is it explicitly revoked. |
| `vc.type` | An array of strings indicating the schema(s) that your Verifiable Credential satisfies. See the section below. |

## Choose credential type(s) 

All Verifiable Credentials must declare their "type" in their rules file. The type of a credential distinguishes your Verifiable Credentials from credentials issued by other organizations and ensures interoperability between issuers and verifiers. To indicate a credential type, you must provide one or more credential types that the credential satisfies. Each type is represented by a unique string - often a URI will be used to ensure global uniqueness. The URI does not need to be addressable; it is treated as a string. 

As an example, a diploma credential issued by Contoso University might declare the following types:

| Type | Purpose |
| ---- | ------- |
| `https://schema.org/EducationalCredential` | Declares that diplomas issued by Contoso University contain attributes defined by schema.org's `EducationaCredential` object. |
| `https://schemas.ed.gov/universityDiploma2020` | Declares that diplomas issued by Contoso University contain attributes defined by the United States department of education. |
| `https://schemas.contoso.edu/diploma2020` | Declares that diplomas issued by Contoso University contain attributes defined by Contoso University. |

By declaring all three types, Contoso University's diplomas can be used to satisfy different requests from verifiers. A bank can request a set of `EducationCredential`s from a user, and the diploma can be used to satisfy the request. But the Contoso University Alumni Association can request a credential of type `https://schemas.contoso.edu/diploma2020`, and the diploma will also satisfy the request.

To ensure interoperability of your credentials, it's recommended that you work closely with related organizations to define credential types, schemas, and URIs for use in your industry. Many industry bodies provide guidance on the structure of official documents that can be repurposed for defining the contents of Verifiable Credentials. You should also work closely with the verifiers of your credentials to understand how they intend to request and consume your Verifiable Credentials.

## Input Type: Verifiable Credential

>[!note]
  >Rules files that ask for a Verifiable Credential does not use the Presentation Exchange format for requesting credentials. This will be updated when the Issuing Service supports the standard, Credential Manifest. 

```json
{
    "attestations": {
      "presentations": [
        {
          "mapping": {
            "first_name": {
              "claim": "$.vc.credentialSubject.firstName",
            },
            "last_name": {
              "claim": "$.vc.credentialSubject.lastName",
              "indexed": true
            }
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
      ],
    }
  }
  ```

| Property | Description |
| -------- | ----------- |
| `attestations.presentations` | An array of OpenID Connect identity providers that are supported for sourcing user information. |
| `...mapping` | An object that describes how claims in each presented Verifiable Credential are mapped to attributes in the resulting Verifiable Credential. |
| `...mapping.{attribute-name}` | The attribute that should be populated in the resulting Verifiable Credential. |
| `...mapping.{attribute-name}.claim` | The claim in the Verifiable Credential whose value should be used to populate the attribute. |
| `...mapping.{attribute-name}.indexed` | Only one can be enabled per Verifiable Credential to save for revoke. |
| `credentialType` | The credentialType of the Verifiable Credential you are asking the user to present. |
| `contracts` | The URI of the contract in the Verifiable Credential Service portal. |
| `issuers.iss` | The issuer DID for the Verifiable Credential being asked of the user. |
| `validityInterval` | A time duration, in seconds, representing the lifetime of your Verifiable Credentials. After this time period elapses, the Verifiable Credential will no longer be valid. Omitting this value means that each Verifiable Credential will remain valid until is it explicitly revoked. |
| `vc.type` | An array of strings indicating the schema(s) that your Verifiable Credential satisfies. |


## Input Type: Self Attested Claims

```json
{
  "attestations": {
    "selfIssued": {
      "mapping": {
        "alias": {
          "claim": "name",
          "indexed": true
        }
      },
    },
    "validityInterval": 25920000,
    "vc": {
      "type": [
        "ProofOfNinjaNinja"
      ],
    }
  }



```
| Property | Description |
| -------- | ----------- |
| `attestations.selfIssued` | An array of self issued claims that require input from the user. |
| `...mapping` | An object that describes how self issued claims are mapped to attributes in the resulting Verifiable Credential. |
| `...mapping.alias` | The attribute that should be populated in the resulting Verifiable Credential. |
| `...mapping.alias.claim` | The claim in the Verifiable Credential whose value should be used to populate the attribute. |
| `...mapping.{attribute-name}.index` | Only one can be enabled per Verifiable Credential to save for revoke. |
| `validityInterval` | A time duration, in seconds, representing the lifetime of your Verifiable Credentials. After this time period elapses, the Verifiable Credential will no longer be valid. Omitting this value means that each Verifiable Credential will remain valid until is it explicitly revoked. |
| `vc.type` | An array of strings indicating the schema(s) that your Verifiable Credential satisfies. |




## Display File: Verifiable Credentials in Microsoft Authenticator

Verifiable Credentials offer a limited set of options that can be used to reflect your brand. This article provides instructions how to customize your credentials, and best practices for designing credentials that look great once issued to users.

Verifiable Credentials issued to users are displayed as cards in Microsoft Authenticator. As the administrator, you may choose card color, icon, and text strings to match your organization's brand.

![card example](media/credential-design/authenticator-card-display.png)

Cards also contain customizable fields that you can use to let users know the purpose of the card, the attributes it contains, and more.

## Create a credential display file

Much like the rules file, the display file is a simple JSON file that describes how the contents of your Verifiable Credentials should be displayed in the Microsoft Authenticator app. 

>[!NOTE]
> At this time, this display model is only used by Microsoft Authenticator.

The display file has the following structure.

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
      "claims": {
        "vc.credentialSubject.name": {
          "type": "String",
          "label": "Name"
        }
      }
    }
}
```

| Property | Description |
| -------- | ----------- |
| `locale` | The language of the Verifiable Credential. Reserved for future use. | 
| `card.title` | Displays the type of credential to the user. Recommended maximum length of 25 characters. | 
| `card.issuedBy` | Displays the name of the issuing organization to the user. Recommended maximum length of 40 characters. |
| `card.backgroundColor` | Determines the background color of the card, in hex format. A subtle gradient will be applied to all cards. |
| `card.textColor` | Determines the text color of the card, in hex format. Recommended to use black or white. |
| `card.logo` | A logo that is displayed on the card. The URL provided must be publicly addressable. Recommended maximum height of 36 px, and maximum width of 100 px regardless of phone size. Recommend PNG with transparent background. | 
| `card.description` | Supplemental text displayed alongside each card. Can be used for any purpose. Recommended maximum length of 100 characters. |
| `consent.title` | Supplemental text displayed when a card is being issued. Used to provide details about the issuance process. Recommended length of 100 characters. |
| `consent.instructions` | Supplemental text displayed when a card is being issued. Used to provide details about the issuance process. Recommended length of 100 characters. |
| `claims` | Allows you to provide labels for attributes included in each credential. |
| `claims.{attribute}` | Indicates the attribute of the credential to which the label applies. |
| `claims.{attribute}.label` | The value that should be used as a label for the attribute which will show up in Authenticator. Recommended maximum length of 40 characters. |


