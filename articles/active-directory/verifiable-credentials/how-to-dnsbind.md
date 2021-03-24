---
title: Link your Domain to your Distributed Identifier (DID) (preview)
description: Learn how to DNS Bind?
documentationCenter: ''
author: barclayn
manager: daveba
ms.service: identity
ms.topic: how-to
ms.subservice: verifiable-credentials
ms.date: 03/24/2021
ms.author: barclayn

#Customer intent: Why are we doing this?
---

# Link your Domain to your Distributed Identifier (DID)

> [!IMPORTANT]
> Azure Active Directory verifiable credentials is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

> [!div class="checklist"]
> * Why you want to link your domain
> * How we use open standards 
> * User Experience
> * Next Steps.

## Prerequisites

To link your DID to your domain, you need to have completed the following.

- Complete the [Getting Started](get-started-verifiable-credentials.md) and subsequent [tutorial set](enable-your-tenant-verifiable-credentials.md).

## Why do we link our domain to our DID?

A DID starts out as an identifier that is not anchored to existing systems. A DID is useful because a user or organization can own it and control it. If an entity interacting with the organization does not know 'who' the DID belongs to, then the DID is not as useful.

Linking a DID to a domain solves the initial trust problem by allowing any entity to cryptographically verify the relationship between a DID and a Domain.

## How do we link DIDs and domains?

To make a link between a domain and a DID we follow an open standard written by the Decentralized Identity Foundation called [Well-Known DID configuration](https://identity.foundation/.well-known/resources/did-configuration/). The verifiable credentials service in Azure Active Directory (AAD) helps your organization make the link between the DID and domain by doing the following:

1. AAD uses the domain information you provide during organization setup to write a Service Endpoint within the DID Document. All parties who interact with your DID can see the domain your DID proclaims to be associated with.  

    ```json
        "service": [
          {
            "id": "#linkeddomains",
            "type": "LinkedDomains",
            "serviceEndpoint": {
              "origins": [
                "https://www.contoso.com/"
              ]
            }
          }
    ```

2. The verifiable credential service in AAD generates a compliant well-known configuration resource that you can host on your domain. The configuration file includes a self-issued verifiable credential of credentialType 'DomainLinkageCredential' signed with your DID that has an origin of your domain. Here is an example of the config doc that is stored at the root domain url.


    ```json
    {
      "@context": "https://identity.foundation/.well-known/contexts/did-configuration-v0.0.jsonld",
      "linked_dids": [
        "jwt..."
      ]
    }
    ```

3. You must host the well-known DID configuration file on the root domain, without redirects and https needs to be enabled.

>[!NOTE]
>Microsoft Authenticator will not honor redirects, the URL specified must be the final destination URL.

## User Experience 

When a user is going through an issuance flow or presenting a verifiable credential, they should know something about the DID they are interacting with. If the domain our verifiable credential wallet, Microsoft Authenticator, validates a DID's relationship with the domain in the DID document and present users with two different experiences depending on the outcome.

## Verified Domain

Before Microsoft Authenticator displays a 'Verified' icon, a few things need to be true:

* The DID signing the SIOP request must have a Service endpoint for Linked Domain. (WHAT IS THIS? WHAT IS A STOP REQUEST?)
* The root domain does not use a redirect and uses https.
* The domain listed in the DID Document has a resolvable well-known resource.
* The well-known resource's verifiable credential is signed with the same DID that was used to sign the SIOP that Microsoft Authenticator used to kick start the flow.

If all of the previously mentioned are true, then Microsoft Authenticator will display a Verified page and include the domain that was validated. 

   ![new permission request](media/how-to-dnsbind/new-permission-request.png) 

## Unverified Domain

If any of the above are not true, the Microsoft Authenticator will display a full page warning to the user that the domain is unverified, the user is in the middle of a risky transaction and they should proceed with caution. We have chosen to take this route because:

* The DID is either not anchored to a domain.
* The configuration was not set up properly.
* The DID the user is interacting with is malicious and actually can't prove they own a domain (since they actually don't). Due to this last point, it is imperative that you link your DID to the domain the user is familiar with, to avoid propagating the warning message.

<todo: add image of unverified domain>

## Next Steps

1. Navigate to the Settings page in Verifiable Credentials and click 'Verify this domain'

   ![Verify this domain in settings](media/how-to-dnsbind/settings-verify.png) 

2. Download the Well-Known Config Resource

   ![Download well known config](media/how-to-dnsbind/verify-download.png) 

3. Copy the JWT, open [jwt.ms](https://www.jwt.ms) and validate the domain is correct.

4. Copy your DID and open the [ION Network Explorer](https://identity.foundation/ion/explorer) to verify the same domain is included in the DID Document. 

5. Host the well-known config resource at the location specified. Example: https://www.example.com/.well-known/did-configuration.json

6. Test out issuing or presenting with Microsoft Authenticator to validate. Make sure the setting in Authenticator 'Warn about unsafe apps' is toggled on.

>[!NOTE]
>By default, 'Warn about unsafe apps' is turned on.

Congratulations, you now have bootstrapped the web of trust with your DID!

## Next steps

If the domain that was entered during onboarding is incorrect or you want to change it, you will need to [opt out](how-to-opt-out.md) at this time. We currently don't support updating your DID document. Opting out and opting back in will create a brand new DID.