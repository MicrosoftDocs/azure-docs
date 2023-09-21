---
title: Microsoft Entra Verified ID architecture overview
description: Learn foundational information to plan and design your solution
documentationCenter: ''
author: barclayn
manager: martinco
ms.service: decentralized-identity
ms.topic: how-to
ms.subservice: verifiable-credentials
ms.date: 07/19/2022
ms.author: barclayn
---

# Microsoft Entra Verified ID architecture overview

[!INCLUDE [Verifiable Credentials announcement](../../../includes/verifiable-credentials-brand.md)]


It’s important to plan your verifiable credential solution so that in addition to issuing and or validating credentials, you have a complete view of the architectural and business impacts of your solution. If you haven’t reviewed them already, we recommend you review  [Introduction to Microsoft Entra Verified ID](decentralized-identifier-overview.md) and the [FAQs](verifiable-credentials-faq.md), and then complete the [Getting Started](./verifiable-credentials-configure-tenant.md) tutorial. 

This architectural overview introduces the capabilities and components of the Microsoft Entra Verified ID service. For more detailed information on issuance and validation, see 

* [Plan your issuance solution](plan-issuance-solution.md)

* [Plan your verification solution](plan-verification-solution.md)

## Approaches to identity

Today most organizations use centralized identity systems to provide employees credentials. They also use various methods to bring customers, partners, vendors, and relying parties into the organization’s trust boundaries. These methods include federation, creating and managing guest accounts with systems like Microsoft Entra B2B, and creating explicit trusts with relying parties. Most business relationships have a digital component, so enabling some form of trust between organizations requires significant effort. 

### Centralized identity systems

Centralized approaches still work well in many cases, such as when applications, services, and devices rely on the trust mechanisms used within a domain or trust boundary. 

In centralized identity systems, the identity provider (IDP) controls the lifecycle and usage of credentials. 

![Example of a centralized identity system](./media/introduction-to-verifiable-credentials-architecture/centralized-identity-architecture.png)


However, there are scenarios where using a decentralized architecture with verifiable credentials can provide value by augmenting key scenarios such as

* secure onboarding of employees’ and others’ identities, including remote scenarios.

* access to resources inside the organizational trust boundary based on specific criteria.

* accessing resources outside the trust boundary, such as accessing partners’ resources, with a portable credential issued by the organization.



### Decentralized identity systems

In decentralized identity systems, control of the lifecycle and usage of the credentials is shared between the issuer, the holder, and relying party consuming the credential.

Consider the scenario in the diagram below where Proseware, an e-commerce website, wants to offer Woodgrove employees corporate discounts. 

 ![Example of a decentralized identity system](media/introduction-to-verifiable-credentials-architecture/decentralized-architecture.png)


Terminology for verifiable credentials (VCs) might be confusing if you're not familiar with VCs. The following definitions are from the [Verifiable Credentials Data Model 1.0](https://www.w3.org/TR/vc-data-model/) terminology section. After each, we relate them to entities in the preceding diagram.

 “An ***issuer*** is a role an entity can perform by asserting claims about one or more subjects, creating a verifiable credential from these claims, and transmitting the verifiable credential to a holder.”

* In the preceding diagram, Woodgrove is the issuer of verifiable credentials to its employees. 

 “A ***holder*** is a role an entity might perform by possessing one or more verifiable credentials and generating presentations from them. A holder is usually, but not always, a subject of the verifiable credentials they are holding. Holders store their credentials in credential repositories.” 

* In the preceding diagram, Alice is a Woodgrove employee. They obtained a verifiable credential from the Woodgrove issuer, and is the holder of that credential.

 “A ***verifier*** is a role an entity performs by receiving one or more verifiable credentials, optionally inside a verifiable presentation for processing. Other specifications might refer to this concept as a relying party.”

* In the preceding diagram, Proseware is a verifier of credentials issued by Woodgrove. 

“A ***credential*** is a set of one or more claims made by an issuer. A verifiable credential is a tamper-evident credential that has authorship that can be cryptographically verified. Verifiable credentials can be used to build verifiable presentations, which can also be cryptographically verified. The claims in a credential can be about different subjects.”

 “A ***decentralized identifier*** is a  portable URI-based identifier, also known as a DID, associated with an entity. These identifiers are often used in a verifiable credential and are associated with subjects, issuers, and verifiers.”.

* In the preceding diagram, the public keys of the actor’s DIDs are made available via trust system (Web or ION).

 “A ***decentralized identifier document***, also referred to as a ***DID document***, is a document that is accessible using a verifiable data registry and contains information related to a specific decentralized identifier, such as the associated repository and public key information.” 

* In the scenario above, both the issuer and verifier have a DID, and a DID document. The DID document contains the public key, and the list of DNS web domains associated with the DID (also known as linked domains).

* Woodgrove (issuer) signs their employees’ VCs with its private key; similarly, Proseware (verifier) signs requests to present a VC using its key, which is also associated with its DID.

A ***trust system*** is the foundation in establishing trust between decentralized systems. It can be a distributed ledger or it can be something centralized, such as [DID Web](https://w3c-ccg.github.io/did-method-web/). 

 “A ***distributed ledger*** is a non-centralized system for recording events. These systems establish sufficient confidence for participants to rely upon the data recorded by others to make operational decisions. They typically use distributed databases where different nodes use a consensus protocol to confirm the ordering of cryptographically signed transactions. The linking of digitally signed transactions over time often makes the history of the ledger effectively immutable.”

* The Microsoft solution uses the ***Identity Overlay Network (ION)*** to provide decentralized public key infrastructure (PKI) capability. As an alternative to ION, Microsoft also offers DID Web as the trust system.

### Combining centralized and decentralized identity architectures

When you examine a verifiable credential solution, it's helpful to understand how decentralized identity architectures can be combined with centralized identity architectures to provide a solution that reduces risk and offers significant operational benefits.

## The user journey

This architectural overview follows the journey of a job candidate and employee, who applies for and accepts employment with an organization. It then follows the employee and organization through changes where verifiable credentials can augment centralized processes.

 

### Actors in these use cases

* **Alice**, a person applying for and accepting employment with Woodgrove, Inc.

* **Woodgrove**, Inc, a fictitious company.

* **Adatum**, Woodgrove’s fictitious identity verification partner.

* **Proseware**, Woodgrove’s fictitious partner organization.

Woodgrove uses both centralized and decentralized identity architectures.

### Steps in the user journey

* Alice applying for, accepting, and onboarding to a position with Woodgrove, Inc.

* Accessing digital resources within Woodgrove’s trust boundary.

* Accessing digital resources outside of Woodgrove’s trust boundary without extending Woodgrove or partners’ trust boundaries.

As Woodgrove continues to operate its business, it must continually manage identities. The use cases in this guidance describe how Alice can use self-service functions to obtain and maintain their identifiers and how Woodgrove can add, modify, and end business-to-business relationships with varied trust requirements. 

These use cases demonstrate how centralized identities and decentralized identities can be combined to provide a more robust and efficient identity and trust strategy and lifecycle. 


## User journey: Onboarding to Woodgrove

![User's onboarding journey to Woodgrove](media/introduction-to-verifiable-credentials-architecture/onboarding-journey.png)

 **Awareness**: Alice is interested in working for Woodgrove, Inc. and visits Woodgrove’s career website. 

**Activation**: The Woodgrove site presents Alice with a method to prove their identity by prompting them with a QR code or a deep link to visit its trusted identity proofing partner, Adatum.

**Request and upload**: Adatum requests proof of identity from Alice. Alice takes a selfie and a driver’s license picture and uploads them to Adatum. 

**Issuance**: Once Adatum verifies Alice’s identity, Adatum issues Alice a verifiable credential (VC) attesting to their identity.

**Presentation**: Alice (the holder and subject of the credential) can then access the Woodgrove career portal to complete the application process. When Alice uses the VC to access the portal, Woodgrove takes the roles of verifier and the relying party, trusting the attestation from Adatum.


### Distributing initial credentials

Alice accepts employment with Woodgrove. As part of the onboarding process, a Microsoft Entra account is created for Alice to use inside of the Woodgrove trust boundary. Alice’s manager must figure out how to enable Alice, who works remotely, to receive initial sign-in information in a secure way. In the past, the IT department might have provided those credentials to their manager, who would print them and hand them to Alice. This doesn’t work with remote employees.

VCs can add value to centralized systems by augmenting the credential distribution process. Instead of needing the manager to provide credentials, Alice can use their VC as proof of identity to receive their initial username and credentials for centralized systems access. Alice presents the proof of identity they added to their wallet as part of the onboarding process. 

 

In the onboarding use case, the trust relationship roles are distributed between the issuer, the verifier, and the holder. 

* The issuer is responsible for validating the claims that are part of the VC they issue. Adatum validates Alice’s identity to issue the VC. In this case, VCs are issued without the consideration of a verifier or relying party.

* The holder possesses the VC and initiates the presentation of the VC for verification. Only Alice can present the VCs she holds.

* The verifier accepts the claims in the VC from issuers they trust and validate the VC using the decentralized ledger capability described in the verifiable credentials data model. Woodgrove trusts Adatum’s claims about Alice’s identity.

 

By combining centralized and decentralized identity architectures for onboarding, privileged information about Alice necessary for identity verification, such as a government ID number, need not be stored by Woodgrove, because they trust that Alice’s VC issued by the identity verification partner (Adatum) confirms their identity. Duplication of effort is minimized, and a programmatic and predictable approach to initial onboarding tasks can be implemented. 

 

## User journey: Accessing resources inside the trust boundary

![Accessing resources inside of the trust boundary](media/introduction-to-verifiable-credentials-architecture/inside-trust-boundary.png)

As an employee, Alice is operating inside of the trust boundary of Woodgrove. Woodgrove acts as the identity provider (IDP) and maintains complete control of the identity and the configuration of the apps Alice uses to interact within the Woodgrove trust boundary. To use resources in the Microsoft Entra ID trust boundary, Alice provides potentially multiple forms of proof of identification to sign in Woodgrove’s trust boundary and access the resources inside of Woodgrove’s technology environment. This is a typical scenario that is well served using a centralized identity architecture. 

* Woodgrove manages the trust boundary and using good security practices provides the least-privileged level of access to Alice based on the job performed. To maintain a strong security posture, and potentially for compliance reasons, Woodgrove must also be able to track employees’ permissions and access to resources and must be able to revoke permissions when the employment is terminated.

* Alice only uses the credential that Woodgrove maintains to access Woodgrove resources. Alice has no need to track when the credential is used since the credential is managed by Woodgrove and only used with Woodgrove resources. The identity is only valid inside of the Woodgrove trust boundary when access to Woodgrove resources is necessary, so Alice has no need to possess the credential. 

### Using VCs inside the trust boundary

Individual employees have changing identity needs, and VCs can augment centralized systems to manage those changes. 

* While employed by Woodgrove Alice might need gain access to resources based on meeting specific requirements. For example, when Alice completes privacy training, she can be issued a new employee VC with that claim, and that VC can be used to access restricted resources.

* VCs can be used inside of the trust boundary for account recovery. For example, if the employee has lost their phone and computer, they can regain access by getting a new VC from the identity verification service trusted by Woodgrove, and then use that VC to get new credentials. 

 ## User journey: Accessing external resources

Woodgrove negotiates a product purchase discount with Proseware. All Woodgrove employees are eligible for the discount. Woodgrove wants to provide Alice a way to access Proseware’s website and receive the discount on products purchased. If Woodgrove uses a centralized identity architecture, there are two approaches to providing Alice the discount: 

* Alice could provide personal information to create an account with Proseware, and then Proseware would have to verify Alice’s employment with Woodgrove.

* Woodgrove could expand their trust boundary to include Proseware as a relying party and Alice could use the extended trust boundary to receive the discount. 

With decentralized identifiers, Woodgrove can provide Alice with a verifiable credential (VC) that Alice can use to access Proseware’s website and other external resources. 

![Accessing resources outside of the trust boundary](media/introduction-to-verifiable-credentials-architecture/external-resources.png)

 

By providing Alice the VC, Woodgrove is attesting that Alice is an employee. Woodgrove is a trusted VC issuer in Proseware’s validation solution. This trust in Woodgrove’s issuance process allows Proseware to electronically accept the VC as proof that Alice is a Woodgrove employee and provide Alice the discount. As part of validation of the VC Alice presents, Proseware checks the validity of the VC by using the trust system. In this solution:

* Woodgrove enables Alice to provide Proseware proof of employment without Woodgrove having to extend its trust boundary. 

* Proseware doesn’t need to expand their trust boundary to validate Alice is an employee of Woodgrove. Proseware can use the VC that Woodgrove provides instead. Because the trust boundary isn’t expanded, managing the trust relationship is easier, and Proseware can easily end the relationship by not accepting the VCs anymore.

* Alice doesn’t need to provide Proseware personal information, such as an email. Alice maintains the VC in a wallet application on a personal device. The only person that can use the VC is Alice, and Alice must initiate usage of the credential. Each usage of the VC is recorded by the wallet application, so Alice has a record of when and where the VC is used. 

 

By combining centralized and decentralized identity architectures for operating inside and outside of trust boundaries, complexity and risk can be reduced and limited relationships become easier to manage. 

### Changes over time

Woodgrove will add and end business relationships with other organizations and will need to determine when centralized and decentralized identity architectures are used.

By combining centralized and decentralized identity architectures, the responsibility and effort associated with identity and proof of identity is distributed, risk is reduced, and the user doesn't risk releasing their private information as often or to as many unknown verifiers. Specifically:

* In centralized identity architectures, the IDP issues credentials and performs verification of those issued credentials. Information about all identities is processed by the IDP, either storing them in or retrieving them from a directory. IDPs may also dynamically accept security tokens from other IDP systems, such as social sign-ins or business partners. For a relying party to use identities in the IDP trust boundary, they must be configured to accept the tokens issued by the IDP.

## How decentralized identity systems work

In decentralized identity architectures, the issuer, user, and relying party (RP) each have a role in establishing and ensuring ongoing trusted exchange of each other’s credentials. The public keys of the actors’ DIDs are resolvable via the trust system, which allows signature validation and therefore trust of any artifact, including a verifiable credential. Relying parties can consume verifiable credentials without establishing trust relationships with the issuer. Instead, the issuer provides the subject a credential to present as proof to relying parties. All messages between actors are signed with the actor’s DID; DIDs from issuers and verifiers also need to own the DNS domains that generated the requests. 

For example: When VC holders need to access a resource, they must present the VC to that relying party. They do so by using a wallet application to read the RP’s request to present a VC. As a part of reading the request, the wallet application uses the RP’s DID to find the RPs public keys using the trust system, validating that the request to present the VC hasn't been tampered with. The wallet also checks that the DID is referenced in a metadata document hosted in the DNS domain of the RP, to prove domain ownership.


![How a decentralized identity system works](media/introduction-to-verifiable-credentials-architecture/how-decentralized-works.png)

### Flow 1: Verifiable credential issuance

In this flow, the credential holder interacts with the issuer to request a verifiable credential as illustrated in the following diagram

![Verifiable credential issuance](media/introduction-to-verifiable-credentials-architecture/issuance.png)

1. The holder starts the flow by using a browser or native application to access the issuer’s web frontend. There, the issuer website drives the user to collect data and executes issuer-specific logic to determine whether the credential can be issued, and its content.) 

1. The issuer web frontend calls the Microsoft Entra Verified ID service to generate a VC issuance request. 

1. The web frontend renders a link to the request as a QR code or a device-specific deep link (depending on the device).

1. The holder scans the QR code or deep link from step 3 using a Wallet app such as Microsoft Authenticator

1. The wallet downloads the request from the link. The request includes:

   * DID of the issuer. This is used by the wallet app to resolve via the trust system to find the public keys and linked domains.

   * URL with the VC manifest, which specifies the contract requirements to issue the VC. This can include id_token, self-attested attributes that must be provided, or the presentation of another VC. 

   * Look and feel of the VC (URL of the logo file, colors, etc.).

1. The wallet validates the issuance requests and processes the contract requirements:

   1. Validates that the issuance request message is signed by the issuer’ keys found in the DID document resolved via the trust system. This ensures that the message hasn't been tampered with.

   1. Validates that the DNS domain referenced in the issuer’s DID document is owned by the issuer. 

   1. Depending on the VC contract requirements, the wallet might require the holder to collect additional information, for example asking for self-issued attributes, or navigating through an OIDC flow to obtain an id_token.

1. Submits the artifacts required by the contract to the Microsoft Entra Verified ID service. The Microsoft Entra Verified ID service returns the VC, signed with the issuer’s DID key and the wallet securely stores the VC.

For detailed information on how to build an issuance solution and architectural considerations, see [Plan your Microsoft Entra Verified ID issuance solution](plan-issuance-solution.md).

### Flow 2: Verifiable credential presentation

![Verifiable credential presentation](media/introduction-to-verifiable-credentials-architecture/presentation.png)

In this flow, a holder interacts with a relying party (RP) to present a VC as part of its authorization requirements.

1. The holder starts the flow by using a browser or native application to access the relying party’s web frontend.

1. The web frontend calls the Microsoft Entra Verified ID service to generate a VC presentation request.

1. The web frontend renders a link to the request as a QR code or a device-specific deep link (depending on the device).

1. The holder scans the QR code or deep link from step 3 using a wallet app such as Microsoft Authenticator

1. The wallet downloads the request from the link. The request includes:

   * a [standards based request for credentials](https://identity.foundation/presentation-exchange/) of a schema or credential type. 

   * the DID of the RP, which the wallet looks up in the trust system.


1. The wallet validates that the presentation request and finds stored VC(s) that satisfy the request. Based on the required VCs, the wallet guides the subject to select and consent to use the VCs.

   * After the subject consents to use of the VC, the wallet generates a unique pairwise DID between the subject and the RP. 

   Then, the wallet sends a presentation response payload to the Microsoft Entra Verified ID service signed by the subject. It contains: 

   * The VC(s) the subject consented to.

   * The pairwise DID generated as the “subject” of the payload.

   * The RP DID as the “audience” of the payload.

1. The Microsoft Entra Verified ID service validates the response sent by the wallet. Depending on how the original presentation request was created in step 2, this validation can include checking the status of the presented VC with the VC issuer for cases such as revocation.

1. Upon validation, the Microsoft Entra Verified ID service calls back the RP with the result. 

For detailed information on how to build a validation solution and architectural considerations, see [Plan your Microsoft Entra Verified ID verification solution](plan-verification-solution.md).

## Key Takeaways

Decentralized architectures can be used to enhance existing solutions and provide new capabilities. 

To deliver on the aspirations of the [Decentralized Identity Foundation](https://identity.foundation/) (DIF) and W3C [Design goals](https://www.w3.org/TR/did-core/), the following should be considered when creating a verifiable credential solution:

* There are no central points of trust establishment between actors in the system. That is, trust boundaries aren't expanded through federation because actors trust specific VCs.

   * The trust system enables the discovery of any actor’s decentralized identifier (DID).

   * The solution enables verifiers to validate any verifiable credentials (VCs) from any issuer.

   * The solution doesn't enable the issuer to control authorization of the subject or the verifier (relying party).

* The actors operate in a decoupled manner, each capable of completing the tasks for their roles.

   * Issuers service every VC request and don't discriminate on the requests serviced.

   * Subjects own their VC once issued and can present their VC to any verifier.

   * Verifiers can validate any VC from any subject or issuer.

## Next steps

Learn more about architecture for verifiable credentials

* [Plan your issuance solution](plan-issuance-solution.md)

* [Plan your verification solution](plan-verification-solution.md)

* [Get started with Microsoft Entra Verified ID](verifiable-credentials-configure-tenant.md)
