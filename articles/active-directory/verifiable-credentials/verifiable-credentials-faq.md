---
title: Frequently asked questions - Azure Verifiable Credentials (preview)
description: Find answers to common questions about Verifiable Credentials
author: barclayn
manager: karenhoran
ms.service: active-directory
ms.subservice: verifiable-credentials
ms.topic: conceptual
ms.date: 02/07/2022
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

### Why must I use NodeJS for the Verifiable Credentials preview? Any plans for other programming languages? 

We chose NodeJS because it's a popular platform for application developers. We'll be releasing a Rest API that will allow the developers to issue and verify credentials. 

### Is any of the code used in the preview open source?

Yes! The following repositories are the open-sourced components of our services.

1. [SideTree, on GitHub](https://github.com/decentralized-identity/sidetree)
2. The [VC SDK for Node, on GitHub](https://github.com/microsoft/VerifiableCredentials-Verification-SDK-Typescript)
3. An [Android SDK for building decentralized identity wallets, on GitHub](https://github.com/microsoft/VerifiableCredential-SDK-Android)
4. An [iOS SDK for building decentralized identity wallets, on GitHub](https://github.com/microsoft/VerifiableCredential-SDK-iOS)


## What are the licensing requirements?

An Azure AD P2 license is required to use the preview of Verifiable Credentials. This is a temporary requirement, as we expect pricing for this service to be billed based on usage. 

## European region

After the February 15, 2022 update, the Azure Active Directory Verifiable Credentials service can store and handle data operations for European instances of Azure Active Directory in the European region. If you configured your Azure AD Verifiable Credentials service before March 31, 2022, you may be required to take action.

Review the following information to avoid potential service interruptions.

### What is changing in the Azure AD Verifiable Credentials Service?

Since the Azure AD Verifiable Credentials service's Public Preview rollout, the service has been available in our Azure North America region. Now, the service is also available in our Azure European region. Customers with Azure AD tenants setup in Europe will have Verifiable Credentials data located and processed in our Azure Europe region.

Customers with Azure AD tenants setup in Europe who start using the Azure AD Verifiable Credentials service after February 15, 2022, will automatically have their data processed in Europe and don't need to take any further actions.  

Customers with Azure AD tenants setup in Europe that started using the Azure AD Verifiable Credentials service before February 15, 2022, are required to reconfigure the service on their tenants before March 31, 2022.  

>[!IMPORTANT]
> On March 31st, 2022, all Azure Active Directory Verifiable credentials deployments in subscriptions with Azure Active Directory instances in the European region will have their verifiable credential deployments opt-out and opt back in. All service configuration will get reset. You should schedule and manage your [opt-out](how-to-opt-out.md) and service reconfiguration to avoid unscheduled service disruptions.


### How can I check my Azure AD Tenant's region?

On March 31, 2022, we'll use your Azure Active Directory information to determine where your Azure AD tenant should have its Verifiable Credentials data processed.

1. In the [Azure portal](https://portal.azure.com), go to Azure Active Directory for the subscription you use for your Azure Active Directory Verifiable credentials deployment.
1. Under Manage, select Properties
    1. :::image type="content" source="media/verifiable-credentials-faq/region.png" alt-text="settings delete and opt out":::
1. See the value for Country or Region. If the value is a country or a region in Europe, your Azure AD Verifiable Credentials service will be set up in Europe.

### My tenant is in Europe, and I've been using the Azure AD Verifiable Credentials service before March 31, 2022. What should I do?

Customers with Azure AD tenants setup in Europe that started using the Azure AD Verifiable Credentials service before March 31, 2022, are encouraged to schedule and manage the reonboard process for each of  their tenants (see below to understand how to reonboard).  

### Are there any changes to the way that we use the Request API as a result of this move?

Applications that use the Azure Active Directory Verifiable Credentials service must use the Request API endpoint that corresponds to their Azure AD tenant's region.  

| Tenant region | Request API endpoint POST |
|------------|-------------------|
| Europe | https://beta.eu.did.msidentity.com/v1.0/{tenantID}/verifiablecredentials/request |
| Non-EU | https://beta.did.msidentity.com/v1.0/{tenantID}/verifiablecredentials/request  |

To confirm which endpoint you should use, we recommend checking your Azure AD tenant's region as described above. If the Azure AD tenant is in the EU, you should use the Europe endpoint.  

## Credential Revocation with Enhanced Privacy

### What are the changes to credential revocation?

With the implementation of the [W3C Status List 2021](https://w3c-ccg.github.io/vc-status-list-2021/) each Issuer tenant will have an [Identity Hub](https://identity.foundation/identity-hub/spec/) that may be used by verifiers to verify the status of a credential using a privacy-respecting endpoint. The identity hub endpoint for the tenant is published in the DID document. This feature replaces the current status endpoint.

Tenant Administrators have until March 31, 2022, to schedule and manage the reconfiguration of the verifiable credential service. On March 31, 2022 tenants that haven't completed the reconfiguration process will be automatically reset and will lose access to any previous configuration. Customers will be required to configure a new instance of the Azure AD Verifiable Credential service.

### How can I check if my tenant has the new Hub endpoint?

1. In the Azure portal, go to the Verifiable Credentials service.
1. Navigate to the Organization Settings. 
1. Copy your organization’s Decentralized Identifier (DID). 
1. Go to the ION Explorer and paste the DID in the search box 
1. Inspect your DID document and search for the “#hub” node.

:::image type="content" source="media/verifiable-credentials-faq/identity-hub.png" alt-text="Identity hubs":::

If you don’t see the “#hub” node in your DID document. You need to reonboard your tenant.

## How do I redeploy the Azure AD Verifiable credentials service?

Redeployment requires you to opt out and opt back into the Azure Active Directory Verifiable Credentials service.

1. Follow the [opt-out](how-to-opt-out.md) instructions.
1. Go over the Azure Active Directory Verifiable credentials [deployment steps](verifiable-credentials-configure-tenant.md) to reconfigure the service and get a new DID.
    1. If you are in the European region we suggest that you create a new Azure Key vault and a new container in a European region.
1. Finish [setting up](verifiable-credentials-configure-tenant.md#set-up-verifiable-credentials) your verifiable credentials service. You need to recreate your credentials. If your deployment issues credentials create a new storage account in the European region. You can reuse your configuration and rules files.
## Next steps

- [How to customize your Azure Active Directory Verifiable Credentials](credential-design.md)
