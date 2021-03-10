---
title: How to DNS Bind- Azure AD (preview)
description: Learn how to DNS Bind?
documentationCenter: ''
author: barclayn
manager: daveba
ms.service: identity
ms.topic: how-to
ms.subservice: verifiable-credentials
ms.date: 03/04/2021
ms.author: barclayn

#Customer intent: Why are we doing this?
---

# Link your Domain to your DID

In this article:
- Why you want to link your domain
- How we use open standards 
- User Experience
- Next Steps 

## Prerequisites

To link your DID to your domain, you need to have completed the following.

- Complete the Getting Started and Tutorial. 

## Why should we link our domain to our DID?

A DID starts out as an identifier that is not anchored to existing systems. A DID is useful because a user or organization can own and control it but if a interacting entity does not know 'who' it belongs to, it is not as useful. 

Linking a DID to a domain solves the initial trust problem by allowing any entity to cryptographically verify the relationship between a DID and a Domain. 


## How we use open standards

To make a link between a domain and a DID possible, we use an open stanard called [Well Known DID Configuration](https://identity.foundation/.well-known/resources/did-configuration/) by the Decentralized Identity Foundation. The Verifiable Credentials Service in AAD helps your organization by doing the following: 

1. During the organization set up in AAD, we asked you for your domain. That domain is written to a Service Endpoint within the DID Document. Now all parties interacting with your DID can see what domain your DID is proclaiming to be associated with.  

```json
    "service": [
      {
        "id": "#linkeddomains",
        "type": "LinkedDomains",
        "serviceEndpoint": {
          "origins": [
            "https://www.vcsatoshi.com/"
          ]
        }
      }
```

2. The Verifiable Credential service in AAD will also generate a compliant Well Known Configuration Resource that you can host on your domain. The configuration file includes a self issued Verifiable Credential of credentialType 'DomainLinkageCredential' signed with your DID that has an origin of your domain. Here is an example of the config doc that will be stored at the root domain url.
```json
https://www.example.com/.well-known/did-configuration.json
```
```json
{
  "@context": "https://identity.foundation/.well-known/contexts/did-configuration-v0.0.jsonld",
  "linked_dids": [
    "jwt..."
  ]
}
```

3. The Well Known DID Configuration file needs to be hosted on the root domain, without redirects and https needs to be enabled. 

>[!NOTE]
>Microsoft Authenticator will not honor any redirect, that it has to be the final destination URL. 

## User Experience 

When a user is going through an Issuance flow or Presenting a Verifiable Credential, they should know something about the DID they are interacting with. If the domain Our Verifiable Credential Wallet, Microsoft Authenticator, will validate a DID's relationship with the domain in the DID document and present two different user experiences depending on the outcome. 

## Verified Domain

In order to receive a Verified icon in Microsoft Authenticator, a few things need to be true. 

- The DID signing the SIOP request must have a Service endpoint for Linked Domain. 
- The root domain does not have a redirect and uses https. 
- The domain listed in the DID Document has a resolvable Well Known Resource. 
- The Well Known Resource's Verifiable Credential is signed with the same DID that was used to sign the SIOP that Microsoft Authenticator used to kick start the flow. 

If all of the previously mentioned are true, then Microsoft Authenticator will display a Verified page and include the domain that was validated. 

![new permission request](media/tutorial-verifiable-credentials-issuer/e5EKExG.png) 

## Unverified Domain

If any of the above are not true, the Microsoft Authenticator will display a full page warning to the user that this is a risky transaction and they should proceed with caution. We have chosen to take this route because the DID is either not anchored to a domain, the configuration was not set up properly or the DID the user is interacting with is malicious and actually can't prove they own a domain (since they actually don't). Due to this last point, it is imperative that our customers properly set up linking their DID to the domain the user will be familiar with, to avoid propagating the warning message.

<todo: add image of unverified domain>

## Next Steps

1. Navigate to the Settings page in Verifiable Credentials and click 'Verify this domain'

![Verify this domain in settings](media/how-to-dnsbind/settings-verify.png) 

2. Download the Well Known Config Resource

![Download well known config](media/how-to-dnsbind/verify-download.png) 

3. Copy the JWT, open [jwt.ms](https://www.jwt.ms) and validate the domain is correct.

4. Copy your DID and open the [ION Network Explorer](https://identity.foundation/ion/explorer) to verify the same domain is included in the DID Document. 

5. Host the Well KNown Config Resource at the location specified. Example: https://www.example.com/.well-known/did-configuration.json

6. Test out issuing or presenting with Microsoft Authenticator to validate. Make sure the setting in Authenticator 'Warn about unsafe apps' is toggled on. 

>[!NOTE]
>By default, 'Warn about unsafe apps' is turned on. 

Congratualations, you now have bootstrapped the web of trust with your DID!

## Troubleshooting

If the domain that was entered during onboarding is incorrect or you want to change it, you will need to opt out at this time. We currently don't support updating your DID document. Opting out and opting back in will create a brand new DID. 