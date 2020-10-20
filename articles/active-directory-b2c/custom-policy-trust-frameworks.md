---
title: Reference - trust frameworks in Azure Active Directory B2C | Microsoft Docs
description: A topic about Azure Active Directory B2C custom policies and the Identity Experience Framework.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 08/04/2017
ms.author: mimart
ms.subservice: B2C
---

# Define Trust Frameworks with Azure AD B2C Identity Experience Framework

Azure Active Directory B2C (Azure AD B2C) custom policies that use the Identity Experience Framework provide your organization with a centralized service. This service reduces the complexity of identity federation in a large community of interest. The complexity is reduced to a single trust relationship and a single metadata exchange.

Azure AD B2C custom policies use the Identity Experience Framework to enable you to answer the following questions:

- What are the legal, security, privacy, and data protection policies that must be adhered to?
- Who are the contacts and what are the processes for becoming an accredited participant?
- Who are the accredited identity information providers (also known as "claims providers") and what do they offer?
- Who are the accredited relying parties (and optionally, what do they require)?
- What are the technical “on the wire” interoperability requirements for participants?
- What are the operational “runtime” rules that must be enforced for exchanging digital identity information?

To answer all these questions, Azure AD B2C custom policies that use the Identity Experience Framework use the Trust Framework (TF) construct. Let’s consider this construct and what it provides.

## Understand the Trust Framework and federation management foundation

The Trust Framework is a written specification of the identity, security, privacy, and data protection policies to which participants in a community of interest must conform.

Federated identity provides a basis for achieving end-user identity assurance at Internet scale. By delegating identity management to third parties, a single digital identity for an end user can be reused with multiple relying parties.

Identity assurance requires that identity providers (IdPs) and attribute providers (AtPs) adhere to specific security, privacy, and operational policies and practices.  If they can't perform direct inspections, relying parties (RPs) must develop trust relationships with the IdPs and AtPs they choose to work with.

As the number of consumers and providers of digital identity information grows, it's difficult to continue pairwise management of these trust relationships, or even the pairwise exchange of the technical metadata that's required for network connectivity.  Federation hubs have achieved only limited success at solving these problems.

### What a Trust Framework specification defines
TFs are the linchpins of the Open Identity Exchange (OIX) Trust Framework model, where each community of interest is governed by a particular TF specification. Such a TF specification defines:

- **The security and privacy metrics for the community of interest with the definition of:**
    - The levels of assurance (LOA) that are offered/required by participants; for example, an ordered set of confidence ratings for the authenticity of digital identity information.
    - The levels of protection (LOP) that are offered/required by participants; for example, an ordered set of confidence ratings for the protection of digital identity information that's handled by participants in the community of interest.

- **The description of the digital identity information that's offered/required by participants**.

- **The technical policies for production and consumption of digital identity information, and thus for measuring LOA and LOP. These written policies typically include the following categories of policies:**
    - Identity proofing policies, for example: *How strongly is a person’s identity information vetted?*
    - Security policies, for example: *How strongly are information integrity and confidentiality protected?*
    - Privacy policies, for example: *What control does a user have over personal identifiable information (PII)*?
    - Survivability policies, for example: *If a provider ceases operations, how does continuity and protection of PII function?*

- **The technical profiles for production and consumption of digital identity information. These profiles include:**
    - Scope interfaces for which digital identity information is available at a specified LOA.
    - Technical requirements for on-the-wire interoperability.

- **The descriptions of the various roles that participants in the community can perform and the qualifications that are required to fulfill these roles.**

Thus a TF specification governs how identity information is exchanged between the participants of the community of interest: relying parties, identity and attribute providers, and attribute verifiers.

A TF specification is one or multiple documents that serve as a reference for the governance of the community of interest that regulates the assertion and consumption of digital identity information within the community. It's a documented set of policies and procedures designed to establish trust in the digital identities that are used for online transactions between members of a community of interest.

In other words, a TF specification defines the rules for creating a viable federated identity ecosystem for a community.

Currently there's widespread agreement on the benefit of such an approach. There's no doubt that trust framework specifications facilitate the development of digital identity ecosystems with verifiable security, assurance and privacy characteristics, meaning that they can be reused across multiple communities of interest.

For that reason, Azure AD B2C custom policies that use the Identity Experience Framework uses the specification as the basis of its data representation for a TF to facilitate interoperability.

Azure AD B2C Custom policies that leverage the Identity Experience Framework represent a TF specification as a mixture of human and machine-readable data. Some sections of this model (typically sections that are more oriented toward governance) are represented as references to published security and privacy policy documentation along with the related procedures (if any). Other sections describe in detail the configuration metadata and runtime rules that facilitate operational automation.

## Understand Trust Framework policies

In terms of implementation, the TF specification consists of a set of policies that allow complete control over identity behaviors and experiences.  Azure AD B2C custom policies that leverage the Identity Experience Framework enable you to author and create your own TF through such declarative policies that can define and configure:

- The document reference or references that define the federated identity ecosystem of the community that relates to the TF. They are links to the TF documentation. The (predefined) operational “runtime” rules, or the user journeys that automate and/or control the exchange and usage of the claims. These user journeys are associated with a LOA (and a LOP). A policy can therefore have user journeys with varying LOAs (and LOPs).

- The identity and attribute providers, or the claims providers, in the community of interest and the technical profiles they support along with the (out-of-band) LOA/LOP accreditation that relates to them.

- The integration with attribute verifiers or  claims providers.

- The relying parties in the community (by inference).

- The metadata for establishing network communications between participants. This metadata, along with the technical profiles, are used during a transaction to plumb “on the wire” interoperability between the relying party and other community participants.

- The protocol conversion if any (for example, SAML 2.0, OAuth2, WS-Federation, and OpenID Connect).

- The authentication requirements.

- The multifactor orchestration if any.

- A shared schema for all the claims that are available and mappings to participants of a community of interest.

- All the claims transformations, along with the possible data minimization in this context, to sustain the exchange and usage of the claims.

- The binding and encryption.

- The claims storage.

### Understand claims

> [!NOTE]
> We collectively refer to all the possible types of identity information that might be exchanged as "claims": claims about an end user’s authentication credential, identity vetting, communication device, physical location, personally identifying attributes, and so on.
>
> We use the term "claims"--rather than "attributes"--because in online transactions, these data artifacts are not facts that can be directly verified by the relying party. Rather they're assertions, or claims, about facts for which the relying party must develop sufficient confidence to grant the end user’s requested transaction.
>
> We also use the term "claims" because Azure AD B2C custom policies that use the Identity Experience Framework are designed to simplify the exchange of all types of digital identity information in a consistent manner regardless of whether the underlying protocol is defined for user authentication or attribute retrieval.  Likewise, we use the term "claims providers" to collectively refer to identity providers, attribute providers, and attribute verifiers when we do not want to distinguish between their specific functions.

Thus they govern how identity information is exchanged between a relying party, identity and attribute providers, and attribute verifiers. They control which identity and attribute providers are required for a relying party’s authentication. They should be considered as a domain-specific language (DSL), that is, a computer language that's specialized for a particular application domain with inheritance, *if* statements, polymorphism.

These policies constitute the machine-readable portion of the TF construct in Azure AD B2C Custom policies leveraging the Identity Experience Framework. They include all the operational details, including claims providers’ metadata and technical profiles, claims schema definitions, claims transformation functions, and user journeys that are filled in to facilitate operational orchestration and automation.

They are assumed to be *living documents* because there is  a good chance that their contents will change over time concerning the active participants declared in the policies. There is also the potential that the terms and conditions for being a participant might change.

Federation setup and maintenance are vastly simplified by shielding relying parties from ongoing trust and connectivity reconfigurations as different claims providers/verifiers join or leave (the community represented by) the set of policies.

Interoperability is another significant challenge. Additional claims providers/verifiers must be integrated, because relying parties are unlikely to support all the necessary protocols. Azure AD B2C custom policies solve this problem by supporting industry-standard protocols and by applying specific user journeys to transpose requests when relying parties and attribute providers do not support the same protocol.

User journeys include protocol profiles and metadata that are used to plumb “on the wire” interoperability between the relying party and other participants. There are also operational runtime rules that are applied to identity information exchange request/response messages for enforcing compliance with published policies as part of the TF specification. The idea of user journeys is key to the customization of the customer experience. It also sheds light on how the system works at the protocol level.

On that basis, relying party applications and portals can, depending on their context, invoke Azure AD B2C custom policies that leverage the Identity Experience Framework passing the name of a specific policy and get precisely the behavior and information exchange they want without any muss, fuss, or risk.
