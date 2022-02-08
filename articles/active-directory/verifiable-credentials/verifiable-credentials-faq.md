---
title: Frequently asked questions - Azure Verifiable Credentials (preview)
description: Find answers to common questions about Verifiable Credentials
author: barclayn
manager: karenhoran
ms.service: active-directory
ms.subservice: verifiable-credentials
ms.topic: conceptual
ms.date: 02/08/2022
ms.author: barclayn
# Customer intent: As a developer I am looking for information on how to enable my users to control their own information 
---

# Frequently Asked Questions (FAQ) (preview)

This page contains commonly asked questions about Verifiable Credentials and Decentralized Identity. Questions are organized into the following sections.

- [Vocabulary and basics](#the-basics)
- [Conceptual questions about decentralized identity](#conceptual-questions)
- [Questions about using Verifiable Credentials preview](#using-the-preview)

> [!IMPORTANT]
> Azure Active Directory Verifiable Credentials is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## The basics

### What is a DID? 

Decentralized Identifers(DIDs) are identifiers that can be used to secure access to resources, sign and verify credentials, and facilitate application data exchange. Unlike traditional usernames and email addresses, DIDs are owned and controlled by the entity itself (be it a person, device, or company). DIDs exist independently of any external organization or trusted intermediary. [The W3C Decentralized Identifier spec](https://www.w3.org/TR/did-core/) explains this in further detail.

### Why do we need a DID?

Digital trust fundamentally requires participants to own and control their identities, and identity begins at the identifier.
In an age of daily, large-scale system breaches and attacks on centralized identifier honeypots, decentralizing identity is becoming a critical security need for consumers and businesses.
Individuals owning and controlling their identities are able to exchange verifiable data and proofs. A distributed credential environment allows for the automation of many business processes that are currently manual and labor intensive.

### What is a Verifiable Credential? 

Credentials are a part of our daily lives; driver's licenses are used to assert that we're capable of operating a motor vehicle, university degrees can be used to assert our level of education, and government-issued passports enable us to travel between countries. Verifiable Credentials provides a mechanism to express these sorts of credentials on the Web in a way that is cryptographically secure, privacy respecting, and machine-verifiable. [The W3C Verifiable Credentials spec](https://www.w3.org/TR/vc-data-model//) explains this in further detail.


## Conceptual questions

### What happens when a user loses their phone? Can they recover their identity?

There are multiple ways of offering a recovery mechanism to users, each with their own tradeoffs. We're currently evaluating options and designing approaches to recovery that offer convenience and security while respecting a user's privacy and self-sovereignty.

### How can a user trust a request from an issuer or verifier? How do they know a DID is the real DID for an organization?

We implement [the Decentralized Identity Foundation's Well Known DID Configuration spec](https://identity.foundation/.well-known/resources/did-configuration/) in order to connect a DID to a highly known existing system, domain names. Each DID created using the  Azure Active Directory Verifiable Credentials has the option of including a root domain name that will be encoded in the DID Document. Follow the article titled [Link your Domain to your Distributed Identifier](how-to-dnsbind.md) to learn more.  

### Why does the Verifiable Credential preview use ION as its DID method, and therefore Bitcoin to provide decentralized public key infrastructure?

ION is a decentralized, permissionless, scalable decentralized identifier Layer 2 network that runs atop Bitcoin. It achieves scalability without including a special crypto asset token, trusted validators, or centralized consensus mechanisms. We use Bitcoin for the base Layer 1 substrate because of the strength of the decentralized network to provide a high degree of immutability for a chronological event record system.

## Using the preview

### Is any of the code used in the preview open source?

Yes! The following repositories are the open-sourced components of our services.

1. [SideTree, on GitHub](https://github.com/decentralized-identity/sidetree)
1. An [Android SDK for building decentralized identity wallets, on GitHub](https://github.com/microsoft/VerifiableCredential-SDK-Android)
1. An [iOS SDK for building decentralized identity wallets, on GitHub](https://github.com/microsoft/VerifiableCredential-SDK-iOS)


### What are the licensing requirements?

An Azure AD P2 license is required to use the preview of Verifiable Credentials. This is a temporary requirement, as we expect pricing for this service to be billed based on usage. 

### How do I reconfigure the Azure AD Verifiable credentials service?

Reconfiguration requires that you opt out and opt back into the Azure Active Directory Verifiable Credentials service, your existing verifiable credentials configurations will reset and your tenant will obtain a new DID forAc use during issuance and presentation.

1. Follow the [opt-out](how-to-opt-out.md) instructions.
1. Go over the Azure Active Directory Verifiable credentials [deployment steps](verifiable-credentials-configure-tenant.md) to reconfigure the service.
    1. If you are in the European region, it's recommended that your Azure Key Vault and container are in the same European region otherwise you may experience some performance and latency issues. Create new instances of these services in the same EU region as needed.
1. Finish [setting up](verifiable-credentials-configure-tenant.md#set-up-verifiable-credentials) your verifiable credentials service. You need to recreate your credentials.
    1. If your tenant needs to be configured as an issuer, it's recommended that your storage account is in the European region as your Verifiable Credentials service.
    2. You also need to issue new credentials because your tenant now holds a new DID.

### How can I check my Azure AD Tenant's region?

1. In the [Azure portal](https://portal.azure.com), go to Azure Active Directory for the subscription you use for your Azure Active Directory Verifiable credentials deployment.
1. Under Manage, select Properties
    :::image type="content" source="media/verifiable-credentials-faq/region.png" alt-text="settings delete and opt out":::
1. See the value for Country or Region. If the value is a country or a region in Europe, your Azure AD Verifiable Credentials service will be set up in Europe.

### How can I check if my tenant has the new Hub endpoint?

1. In the Azure portal, go to the Verifiable Credentials service.
1. Navigate to the Organization Settings. 
1. Copy your organization’s Decentralized Identifier (DID). 
1. Go to the ION Explorer and paste the DID in the search box 
1. Inspect your DID document and search for the ` “#hub” ` node.

```json
 "service": [
      {
        "id": "#linkeddomains",
        "type": "LinkedDomains",
        "serviceEndpoint": {
          "origins": [
            "https://contoso.com/"
          ]
        }
      },
      {
        "id": "#hub",
        "type": "IdentityHub",
        "serviceEndpoint": {
          "instances": [
            "https://beta.hub.msidentity.com/v1.0/12345678-0000-0000-0000-000000000000"
          ],
          "origins": []
        }
      }
    ],
```

### If I reconfigure the Azure AD Verifiable Credentials service, do I need to re-link my DID to my domain?

Yes, after reconfiguring your service, your tenant has a new DID use to issue and verify verifiable credentials. You need to [associate your new DID](how-to-dnsbind.md) with your domain.

### Is it possible to request Microsoft to retrieve "old DIDs"?

No, at this point it is not possible to keep your tenant's DID after you have opt-out of the service.

## Next steps

- [How to customize your Azure Active Directory Verifiable Credentials](credential-design.md)
