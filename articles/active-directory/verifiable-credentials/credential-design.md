---
title: How to customize your Azure Active Directory Verifiable Credentials (preview)
description: This article shows you how to create your own custom verifiable credential
services: active-directory
author: barclayn
manager: rkarlin
ms.service: decentralized-identity
ms.subservice: verifiable-credentials
ms.topic: how-to
ms.date: 06/02/2022
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

There are currently three input types that are available to configure in the rules definition. These types are used by the verifiable credential issuing service to insert claims into a verifiable credential and attest to that information with your DID. The following are the three types with explanations.

- ID Token
- Verifiable credentials via a verifiable presentation.
- Self-Attested Claims

**ID token:** The sample App and Tutorial use the ID Token. When this option is configured, you will need to provide an Open ID Connect configuration URI and include the claims that should be included in the VC. The user will be prompted to 'Sign in' on the Authenticator app to meet this requirement and add the associated claims from their account. 

**Verifiable credentials:** The end result of an issuance flow is to produce a Verifiable Credential but you may also ask the user to Present a Verifiable Credential in order to issue one. The rules definition is able to take specific claims from the presented Verifiable Credential and include those claims in the newly issued Verifiable Credential from your organization. 

**Self attested claims:** When this option is selected, the user will be able to directly type information into Authenticator. At this time, strings are the only supported input for self attested claims. 

![detailed view of verifiable credential card](media/credential-design/issuance-doc.png) 

**Static claims:** Additionally we are able to declare a static claim in the rules definition, however this input does not come from the user. The Issuer defines a static claim in the rules definition and would look like any other claim in the Verifiable Credential. Simply add a credentialSubject after vc.type and declare the attribute and the claim. 

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
                "outputClaim": "lasttName", 
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
|Property | Description|
|---------|------------|
|`...mapping`| A collection that describes how claims in each ID token are mapped to attributes in the resulting verifiable credential. |
|`...mapping.{outputClaim}`| The attribute that should be populated in the resulting Verifiable Credential. |
|`...mapping.{inputClaim}`| The claim in ID tokens whose value should be used to populate the attribute.|
|`...mapping.{required}`| The claim in ID tokens is required to have a value.|
|`...mapping.{indexed}`| Only one can be enabled per Verifiable Credential to save for revoke. Please see the article on how to revoke a credential for more information|


| Property | Description |
| -------- | ----------- |
| `attestations.idTokens` | An array of OpenID Connect identity providers that are supported for sourcing user information. |
| `...mapping` | An object that describes how claims in each ID token are mapped to attributes in the resulting verifiable credential. |
| `...mapping.{attribute-name}` | The attribute that should be populated in the resulting Verifiable Credential. |
| `...mapping.{attribute-name}.claim` | The claim in ID tokens whose value should be used to populate the attribute. |
| `...configuration` | The location of your identity provider's configuration document. This URL must adhere to the [OpenID Connect standard for identity provider metadata](https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderMetadata). The configuration document must include the `issuer`, `authorization_endpoint`, `token_endpoint`, and `jwks_uri` fields. |
| `...client_id` | The client ID obtained during the client registration process. |
| `...scope` | A space-delimited list of scopes the IDP needs to be able to return the correct claims in the ID token. |
| `...redirect_uri` | Must always use the value `vcclient://openid/`. |
| `validityInterval` | A time duration, in seconds, representing the lifetime of your verifiable credentials. After this time period elapses, the verifiable credential will no longer be valid. Omitting this value means that each Verifiable Credential will remain valid until is it explicitly revoked. |
| `vc.type` | An array of strings indicating the schema(s) that your Verifiable Credential satisfies. See the section below for more detail. |

### vc.type: Choose credential type(s) 

All verifiable credentials must declare their "type" in their rules definition. The type of a credential distinguishes your verifiable credentials from credentials issued by other organizations and ensures interoperability between issuers and verifiers. To indicate a credential type, you must provide one or more credential types that the credential satisfies. Each type is represented by a unique string - often a URI will be used to ensure global uniqueness. The URI does not need to be addressable; it is treated as a string. 

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

| Property | Description |
| -------- | ----------- |
| `attestations.presentations` | An array of verifiable credentials being requested as inputs. |
| `...mapping` | An object that describes how claims in each presented Verifiable Credential are mapped to attributes in the resulting Verifiable Credential. |
| `...mapping.{attribute-name}` | The attribute that should be populated in the resulting verifiable credential. |
| `...mapping.{attribute-name}.claim` | The claim in the Verifiable Credential whose value should be used to populate the attribute. |
| `...mapping.{attribute-name}.indexed` | Only one can be enabled per Verifiable Credential to save for revoke. Please see the [article on how to revoke a credential](how-to-issuer-revoke.md) for more information. |
| `credentialType` | The credentialType of the Verifiable Credential you are asking the user to present. |
| `contracts` | The URI of the contract in the Verifiable Credential Service portal. |
| `issuers.iss` | The issuer DID for the Verifiable Credential being asked of the user. |
| `validityInterval` | A time duration, in seconds, representing the lifetime of your verifiable credentials. After this time period elapses, the Verifiable Credential will no longer be valid. Omitting this value means that each Verifiable Credential will remain valid until is it explicitly revoked. |
| `vc.type` | An array of strings indicating the schema(s) that your verifiable credential satisfies. |

| Property | Description |
| -------- | ----------- |
|`...mapping` |	A collection that describes how claims in each ID token are mapped to attributes in the resulting verifiable credential.|
|`...mapping.{outputClaim}`| The attribute that should be populated in the resulting Verifiable Credential.|
|`...mapping.{inputClaim}`| The claim in the Verifiable Credential whose value should be used to populate the attribute.|
|`...mapping.{required}`| The claim in the Verifiable Credential is required to have a value.|
|`...mapping.{indexed}`| Only one can be enabled per Verifiable Credential to save for revoke. Please see the article on how to revoke a credential for more information|

## Input type: Self-attested claims

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


| Property | Description |
| -------- | ----------- |
|`...mapping` |	A collection that describes how self-issued claims are mapped to attributes in the resulting Verifiable Credential.|
|`...mapping.{outputClaim}`| The attribute that should be populated in the resulting Verifiable Credential.|
|`...mapping.{inputClaim}`|	The claim in the Verifiable Credential whose value should be used to populate the attribute.|
|`...mapping.{required}`|	The claim in the Verifiable Credential is required to have a value.|
|`...mapping.{indexed}`| Only one can be enabled per Verifiable Credential to save for revoke. Please see the article on how to revoke a credential for more information|




| Property | Description |
| -------- | ----------- |
| `attestations.selfIssued` | An array of self-issued claims that require input from the user. |
| `...mapping` | An object that describes how self-issued claims are mapped to attributes in the resulting Verifiable Credential. |
| `...mapping.alias` | The attribute that should be populated in the resulting Verifiable Credential. |
| `...mapping.alias.claim` | The claim in the Verifiable Credential whose value should be used to populate the attribute. |
| `validityInterval` | A time duration, in seconds, representing the lifetime of your verifiable credentials. After this time period elapses, the Verifiable Credential will no longer be valid. Omitting this value means that each Verifiable Credential will remain valid until is it explicitly revoked. |
| `vc.type` | An array of strings indicating the schema(s) that your Verifiable Credential satisfies. |


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
| `claims.{attribute}.claim` | Indicates the attribute of the credential to which the label applies. |
| `claims.{attribute}.type` | Indicates the attribute type. Currently we only support 'String'. |
| `claims.{attribute}.label` | The value that should be used as a label for the attribute, which will show up in Authenticator. This maybe different than the label that was used in the rules definition. Recommended maximum length of 40 characters. |


## Next steps

Now you have a better understanding of verifiable credential design and how you can create your own to meet your needs.

- [Issuer service communication examples](issuer-openid.md)
