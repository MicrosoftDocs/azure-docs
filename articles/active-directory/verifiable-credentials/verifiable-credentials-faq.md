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
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## The basics

### What is a DID? 

A DID is a decentralized identifier. They can be used to uniquely identify and authenticate people, organizations, and more. [This specification](https://www.w3.org/TR/did-core/) explains many details.

### What is a Verifiable Credential? 



## Conceptual questions

### What happens when a user loses their phone? Can they recover their identity?

There are multiple ways of offering a recovery mechanism to users, each with their own tradeoffs. We're currently evaluating options and designing approaches to recovery that offer convenience and security while respecting a user's privacy and autonomy.

### Why does validation of a verifiable credential require a query to a credential status endpoint? Is this not a privacy concern?

The `credentialStatus` property in a verifiable credential requires the verifier to query the credential's issuer during validation. This is a convenient and efficient way for the issuer to be able to revoke a credential that has been previously issued. This also means that the issuer can track which verifiers have accessed a user's credentials. In some use cases this is desirable, but in many, this would be considered a serious privacy concern. We are exploring alternative means of credential revocation that will allow an issuer to revoke a verifiable credential without being able to trace a credential's usage.

### How can a user trust a request from an issuer or verifier? How do they know a DID is the real DID for an organization?

There are many ways users and organizations can establish trust in a verifiable credentials exchange. In many cases, previous interactions with an organization's app or website will provide enough context to a user to build confidence that the request received in Authenticator is trustworthy. But, we intend to go much further than this and provide users with verifiable guarantees that a DID they interact with represents the intended party. One example would be allowing an organization to associate their DID to an internet domain that they own. [This specification from the Decentralized Identity Foundation](https://identity.foundation/.well-known/resources/did-configuration/) details a means by which such an association can be accomplished. Other options for establishing trust between users and organizations are being explored. 

### Does a user need to periodically rotate their DID keys?

The DID methods used in verifiable credential exchanges support the ability for a user to update the keys associated with their DID. Currently, Microsoft Authenticator does not change the user's keys after a DID has been created.

### Why does the Verifiable Credential preview use ION as its DID method, and therefore Bitcoin to provide decentralized public key infrastructure?

The verifiable credential preview has been purposefully designed to be agnostic to the DID method used. True, currently only ION DIDs are supported, which is a layer 2 network on top of Bitcoin. The [ION](https://github.com/decentralized-identity/ion) repository contains information about the choice of Bitcoin as a decentralized ledger. Over time, we intend to support more DID methods, so that customers may make informed decisions about which ledger technology is used for their DIDs.

## Using the preview

### Why must I use NodeJS for the Verifiable Credentials preview? Any plans for other programming languages? 

We chose Node JS because it is a very popular platform for application developers. At this time, we have no plans to support other programming languages.

### Is any of the code used in the preview open source?

Yes! There are three main repositories where we have open-sourced components of our services.

1. [SideTree, on GitHub](https://github.com/decentralized-identity/sidetree)
2. The [VC SDK for Node, on GitHub](https://github.com/microsoft/VerifiableCredentials-Verification-SDK-Typescript)
3. An [Android SDK for building decentralized identity wallets, on GitHub](https://github.com/microsoft/VerifiableCredential-SDK-Android)
