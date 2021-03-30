---
title: Introduction to Azure Active Directory Verifiable Credentials (preview)
description: An overview Azure Verifiable Credentials.
services: active-directory
author: barclayn
manager: daveba
editor:
ms.service: identity
ms.subservice: verifiable-credentials
ms.topic: overview
ms.date: 03/30/2021
ms.author: barclayn
ms.reviewer: 

# As a developer, I'd like to create a solution that allows customers to manage information about themselves
---

# What are Azure Verifiable Credentials?

> [!IMPORTANT]
> Azure Verifiable Credentials is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


Welcome to the developer documentation for Verifiable Credentials at Microsoft. Verifiable credentials are a new way to exchange verified information about people and organizations. Verifiable credentials put people in control of their personal information, enabling more trustworthy digital experiences while respecting people's privacy.  Verifiable credentials allow you to validate information about people, organizations, and things. 

>[!VIDEO https://www.youtube.com/embed/r20hCF9NbTo]

## Issuers, subjects, and verifiers

We will introduce Verifiable Credentials using an example where a student's digital diploma is used to apply for a job.

 ![jwt decoded for readability](media/verifiable-credentials-overview/issuer-verifier.png)

In our example, the University is the issuer who issues a credential to the student, the subject. Every verifiable credential is created by an issuer. An issuer is the organization or entity that asserts information about a subject to which a credential is issued. 


Verifiable Credentials contain attributes about the subjects to which they are issued. The student's field of study, year of graduation, and grade point average are examples of simple attributes that might be included. When a subject receives their Verifiable Credentials, they become the holder for that credential which they store in their wallet - a mobile application on the student's device.

When the student applies for a job, the employer requests access to view the student's digital diploma. The employer is the verifier who will verify the information contained in the diploma before offering the student a job.

## Verifiable credentials

Verifiable credentials are based on an open standard developed in the W3C known as [Verifiable Credentials](https://www.w3.org/TR/vc-data-model/). A Verifiable Credential that is represented as a JSON Web Token (JWT) has an expected structure:


 ![jwt decoded for readability](media/verifiable-credentials-overview/decoded-jwt.png)

This standard makes it easy for credentials to be "portable" across organizational boundaries. A credential issued by a university can be verified by any employer, bank, or any other organization that accepts the verifiable credential standard. Similarly, an employer can accept diplomas from any university that issues credentials according to the standard. The verifiable credential standard facilitates an open ecosystem of credentials that can be easily verified by any interested party.

## Digital signatures and decentralized identifiers


To protect their security and integrity, Verifiable Credentials are digitally signed by the issuer. When a verifier receives a Verifiable Credential, they are able to verify the signature of the credential to ensure it has been issued by the real issuer and that it hasn't been tampered with. The verifier therefore requires access to the issuer's public keys.

The public key infrastructure required to verify Verifiable Credentials is provided by another W3C standard known as [decentralized identifiers](https://w3c.github.io/did-core/).

 ![jwt decoded for readability](media/verifiable-credentials-overview/ecosystem-detailed.png)

Each issuer, subject, and verifier creates a unique identifier, and associates a set of public keys to their identifier. The issuer's public keys are made publicly available, so that any verifier can validate Verifiable Credentials produced by the issuer.









What are the components of a verifiable credentials?
- Verifiable Credential Issuer and verifier service
- 
- VC SDK
- Authenticator (iOS and Android)
- ION

What is a verifiable credential?
What is a DID?

"decentralized identifier = A portable URL-based identifier, also known as a DID, associated with an entity. These identifiers are most often used in a verifiable credential and are associated with subjects such that a verifiable credential itself can be easily ported from one repository to another without the need to reissue the credential. An example of a DID is did:example:123456abcdef." From https://www.w3.org/TR/vc-data-model/#:~:text=A%20portable%20URL%2Dbased%20identifier,need%20to%20reissue%20the%20credential. 

How do verifiable credentials work?
What makes up the overall ‘solution’? 
What are the use cases and requirements?
What is the problem that this is trying to solve?
How do you make PII available to entities when needed while remaining in control of it? (medical, educational, employment?)
What are the overall benefits? security benefits? Privacy benefits?
