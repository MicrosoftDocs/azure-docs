---
title: 'Azure Active Directory B2C: Reference - Trust Frameworks  | Microsoft Docs'
description: A topic on Azure Active Directory B2C custom policies
services: active-directory-b2c
documentationcenter: ''
author: rojasja
manager: krassk
editor: rojasja

ms.assetid:
ms.service: active-directory-b2c
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: article
ms.devlang: na
ms.date: 04/25/2017
ms.author: joroja

---

# Defining Trust Frameworks with Azure AD B2C Identity Experience Framework

Azure AD B2C Custom policies leveraging the Identity Experience Framework provides your organization with a centralized service that reduces the complexity of identity federation in a large community of interest to a single trust relationship and a single metadata exchange.

This requires Azure AD B2C Custom policies leveraging the Identity Experience Framework to allow you to answer the following questions.

- *What are the legal, security, privacy and data protection policies that must be adhered to?*
- *Who are the contacts and what are the processes for becoming an accredited participant?*
- *Who are the accredited identity information providers (a.k.a. claims providers) and what do they offer?*
- *Who are the accredited relying parties [and optionally what do they require]?*
- *What are the technical “on the wire” interoperability requirements for participants?*
- *What are the operational “runtime” rules that must be enforced for exchanging digital identity information?*

To answer all these questions, Azure AD B2C Custom policies leveraging the Identity Experience Framework leverages the Trust Framework (TF) construct. Let’s consider this construct and what it provides in this respect.

## Understanding the Trust Framework and federation management foundation

Such a construct should be understood as a written specification of the identity, security, privacy, and data protection policies to which participants in a community of interest must conform.

Federated identity provides a basis for achieving end user identity assurance at Internet scale.  By delegating identity management to 3rd parties, a single digital identity for an end user can be re-used with multiple relying parties.  

Identity assurance indeed requires that identity providers (IdPs) and attribute providers (AtPs) adhere to specific security, privacy and operational policies and practices.  Absent the ability to perform direct inspections, relying parties (RPs) must develop trust relationships with the IdPs and AtPs they choose to work with.  As the number of consumers and providers of digital identity information mushrooms, it becomes untenable to continue pairwise management of these trust relationships, or even the pairwise exchange of the technical metadata required for network connectivity.  Federation Hubs have achieved only limited success at solving these problems.

TFs are the linchpin of the Open Identity Exchange (OIX) Trust Framework model where each community of interest is governed by a particular TF specification. Such a TF specification defines:

- The security and privacy metrics for the community of interest with the definition of:
    - The levels of assurance (LOA) offered/required by participants, i.e. an ordered set of confidence ratings for the authenticity of digital identity information.
    - The levels of protection (LOP) offered/required by participants, i.e. an ordered set of confidence ratings for the protection of digital identity information handled by participants in the community of interest.
- The description of the digital identity information offered/required by participants.
- The technical policies for production and consumption of digital identity information, and thus for measuring LOA and LOP. These written policies typically include the following categories of policies:
    - Identity proofing policies: *how strongly is a person’s identity information vetted?*
    - Security policies: *how strongly are information integrity and confidentiality protected?*
    - Privacy policies: *what control does a user have over personal identifiable information (PII)*?
    - Survivability policies: continuity and protection of PII if a provider ceases operations.
- The technical profiles for production and consumption of digital identity information. These profiles:
    - Scope interfaces for which digital identity information is available at specified LOA.
    - Describe technical requirements for on-the-wire interoperability.
- The descriptions of the various roles that participants in the community may perform along with the qualifications required to fulfill these roles.

Thus a TF specification governs how identity information is exchanged between the participants of the community of interest: relying parties, identity and attribute providers, and attribute verifiers.

In the parlance of this OIX TF model, a TF specification is constituted as one or multiples documents that serve as a reference for the governance of the community of interest regulating the assertion and consumption of digital identity information within the community. This means a documented set of policies and procedures, designed to establish trust in the digital identities used for online transactions between members of a community of interest.  **A TF specification defines the rules for creating a viable federated identity ecosystem for some community.**

As of today, there is widespread agreement on the benefit of such an approach and there is no doubt that trust framework specifications will facilitate the development of digital identity ecosystems with verifiable security, assurance and privacy characteristics, such that they can be reused across multiple communities of interest.

For that reason, Azure AD B2C Custom policies leveraging the Identity Experience Framework leverages specification as its core as the basis of its data representation for a TF to facilitate interoperability.  

Azure AD B2C Custom policies leveraging the Identity Experience Framework represents a TF specification as a mixture of human and machine readable data: some sections of this model (typically those more oriented towards governance) are represented as references to published security and privacy policies documentation along with the related procedures if any, while other sections describe in detail the configuration metadata and runtime rules to facilitate operational automation.

## Understanding Trust Framework policies

In terms of implementation, the above TF specification consists in Azure AD B2C Custom policies leveraging the Identity Experience Framework in a set of policies that allow complete control over identity behaviors and experiences.  Azure AD B2C Custom policies leveraging the Identity Experience Framework indeed allows you to author and create your own TF through such declarative policies that can define and configure:

- The document reference(s) defining the federated identity ecosystem of the community that relates to the TF. They are links to the TF documentation. The (predefined) operational “runtime” rules, or the user journeys that automate and/or control the exchange and usage of the claims. These user journeys are associated with a LOA (and a LOP). A policy may therefore have user journeys with varying LOAs (and LOPs).
- The identity and attribute providers, or the claims providers, in the community of interest and the technical profiles they support along with the (out-of-band) LOA/LOP accreditation that relates to them.
- The integration with attribute verifiers, or the claims providers.
- The relying parties in the community (by inference).
- The metadata for establishing network communications between participants. These metadata along with the technical profiles will be used in the course of a transaction to plumb “on the wire” interoperability between the relying party and other community participants.
- The protocol conversion if any (SAML, OAuth2, WS-Federation and OpenID Connect).
- The authentication requirements.
- The multifactor orchestration if any.
- A shared schema for all the claims available and mappings to participants of a community of interest.
- All the claims transformations - along with the possible data minimization in this context - to sustain the exchange and usage of the claims.
- The binding and encryption.
- The claims storage

> [!NOTE]
> We collectively refer to all the possible types of identity information that may be exchanged as claims: claims about an end user’s authentication credential, identity vetting, communication device, physical location, personally identifying attributes, and so on.  
>
> We use the term *claims* – rather than attributes which is a subset – because in the case of online transactions these are not facts that can be directly verified by the relying party; rather they are assertions, or claims about facts for which the relying party must develop sufficient confidence to grant the end user’s requested transaction.  
>
> It’s also due to the fact that Azure AD B2C Custom policies leveraging the Identity Experience Framework is designed to simplify the exchange of all types of digital identity information in a consistent manner regardless of whether the underlying protocol is defined for user authentication or attribute retrieval.  Likewise, we will use the term claims providers to collectively refer to identity providers, attribute providers and attribute verifiers when we do not want to distinguish between their specific functions.   

Thus they govern how identity information is exchanged between a relying party, identity and attribute providers, and attribute verifiers. They control which identity and attribute providers are required for a relying party’s authentication. They should be considered as a domain-specific language (DSL), that is, a computer language specialized to a particular application domain  with inheritance, *if* statements, polymorphism.

These policies constitute the machine readable portion of the TF construct in Azure AD B2C Custom policies leveraging the Identity Experience Framework with all the operational details, including claims providers’ metadata and technical profiles claims schema definition, claims transformation functions, and user journeys filled in to facilitate operational orchestration and automation.  

They are assumed to be *living documents* in Azure AD B2C Custom policies leveraging the Identity Experience Framework since there is more than a chance that their contents will change over time with respect to the active participants declared in the policies, and also potentially in some situations to the terms and conditions for being a participant.  
Federation setup and maintenance are vastly simplified by shielding relying parties from ongoing trust and connectivity reconfigurations as different claims providers/verifiers join or leave (the community represented by) the set of policies.

Interoperability is another significant challenge as additional claims providers/verifiers have to be integrated, since relying parties are unlikely to support all of the necessary protocols. Azure AD B2C Custom policies leveraging the Identity Experience Framework solves this problem by supporting industry standard protocols and by applying specific user journeys to transpose requests when relying parties and attribute providers do not support the same protocol.  

Users journeys include protocol profiles and metadata that will be used to plumb “on the wire” interoperability between the relying party and other participants.  There are also operational runtime rules that will be applied to identity information exchange request/response messages for enforcing compliance with published policies as part of the TF specification. The idea of user journeys is key to the customization of customer experience and sheds light on how the system works at the protocol level.

On that basis, relying party applications and portals can, depending on their context, invoke Azure AD B2C Custom policies leveraging the Identity Experience Framework passing the name of a specific policy and get precisely the behavior and information exchange they want without any muss, fuss or risk.
