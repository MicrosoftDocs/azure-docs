---
title: Frequently asked questions - Azure Verifiable Credentials (preview)
description: Find answers to common questions about Verifiable Credentials
author: barclayn
manager: davba
ms.service: identity
ms.subservice: verifiable-credentials
ms.topic: conceptual
ms.date: 03/08/2021
ms.author: barclayn
# Customer intent: As a developer I am looking for information on how to enable my users to control their own information 
---

# Frequently Asked Questions (FAQ)

This page contains commonly asked questions about Verifiable Credentials and Decentralized Identity. Questions are organized into the following sections.

- [Vocabulary and basics](#the-basics)
- [Conceptual questions about decentralized identity](#conceptual-questions)
- [Questions about using Verifiable Credentials preview](#using-the-preview)

> [!IMPORTANT]
> Azure Verifiable Credentials is currently in public preview.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## The basics

### What is a DID? 

DIDs (Decentralized Identifers) are identifiers that can be used to secure access to resources, sign and verify credentials, and facilitate application data exchange. Unlike traditional usernames and email addresses, DIDs are owned and controlled by the entity itself (be it a person, device, or company), and exist independently of any external organization or trusted intermediary. [The W3C Decentralized Identifier spec](https://www.w3.org/TR/did-core/) explains this in further detail.

### Why do we need a DID?

Digital trust fundamentally requires participants to own and control their identities, and identity begins at the identifier.
In an age of daily, large scale system breaches and attacks on centralized identifier honeypots, decentralizing identity is becoming a critical security need for consumers and businesses.
Individuals owning and controlling their identities enables them to exchange verifiable data and proofs that can automate many business processes that are currently manual and labor intensive.

### What is a Verifiable Credential? 

Credentials are a part of our daily lives; driver's licenses are used to assert that we are capable of operating a motor vehicle, university degrees can be used to assert our level of education, and government-issued passports enable us to travel between countries. Verifiable Credentials provides a mechanism to express these sorts of credentials on the Web in a way that is cryptographically secure, privacy respecting, and machine-verifiable. [The W3C Verifiable Credentials spec](https://www.w3.org/TR/vc-data-model//) explains this in further detail.


## Conceptual questions

### What happens when a user loses their phone? Can they recover their identity?

There are multiple ways of offering a recovery mechanism to users, each with their own tradeoffs. We're currently evaluating options and designing approaches to recovery that offer convenience and security while respecting a user's privacy and self sovereignty.

### Why does validation of a verifiable credential require a query to a credential status endpoint? Is this not a privacy concern?

The `credentialStatus` property in a verifiable credential requires the verifier to query the credential's issuer during validation. This is a convenient and efficient way for the issuer to be able to revoke a credential that has been previously issued. This also means that the issuer can track which verifiers have accessed a user's credentials. In some use cases this is desirable, but in many, this would be considered a serious violation of user privacy. We are exploring alternative means of credential revocation that will allow an issuer to revoke a verifiable credential without being able to trace a credential's usage. 

<!-- Additionally, an issuer can issuer a Verifiable Credential without a 'credentialStatus' endpoint. Please follow the instructions in [How to customize your verifiable credentials article.](credential-design.md) -->

### How can a user trust a request from an issuer or verifier? How do they know a DID is the real DID for an organization?

We have implemented [the Decentralized Identity Foundation's Well Known DID Configuration spec](https://identity.foundation/.well-known/resources/did-configuration/) in order to connect a DID to a highly known existing system, domain names. Each DID created using the  Azure Active Directory Verifiable Credentials has the option of including a root domain name that will be encoded in the DID Document. Please follow the article titled [Link your Domain to your Distributed Identifier](how-to-dnsbind.md) to learn more.  

### Does a user need to periodically rotate their DID keys?

The DID methods used in verifiable credential exchanges support the ability for a user to update the keys associated with their DID. Currently, Microsoft Authenticator does not change the user's keys after a DID has been created.

### Why does the Verifiable Credential preview use ION as its DID method, and therefore Bitcoin to provide decentralized public key infrastructure?

ION is a decentralized, permissionless, scalable Decentralized Identifier Layer 2 network that runs atop Bitcoin. It achieves scalability without including a special cryptoasset token, trusted validators, or centralized consensus mechanisms. We leverage Bitcoin for the base Layer 1 substrate because of the strength of the decentralized network to provide a high degree of immutability for a chronological event record system. 


## Using the preview

### Why must I use NodeJS for the Verifiable Credentials preview? Any plans for other programming languages? 

We chose NodeJS because it is a very popular platform for application developers. We will be releasing a Rest API that will allow the developers to issue and verify credentials. 

### Is any of the code used in the preview open source?

Yes! The following repositories are the open-sourced components of our services.

1. [SideTree, on GitHub](https://github.com/decentralized-identity/sidetree)
2. The [VC SDK for Node, on GitHub](https://github.com/microsoft/VerifiableCredentials-Verification-SDK-Typescript)
3. An [Android SDK for building decentralized identity wallets, on GitHub](https://github.com/microsoft/VerifiableCredential-SDK-Android)
4. An [iOS SDK for building decentralized identity wallets, on GitHub](https://github.com/microsoft/VerifiableCredential-SDK-iOS)
