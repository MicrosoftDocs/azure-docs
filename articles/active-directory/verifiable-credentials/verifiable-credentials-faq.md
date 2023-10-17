---
title: Frequently asked questions - Azure Verifiable Credentials
description: Find answers to common questions about Verifiable Credentials
author: barclayn
manager: amycolannino
ms.service: decentralized-identity
ms.subservice: verifiable-credentials
ms.topic: conceptual
ms.date: 08/11/2022
ms.author: barclayn
# Customer intent: As a developer I am looking for information on how to enable my users to control their own information 
---

# Frequently Asked Questions (FAQ)

[!INCLUDE [Verifiable Credentials announcement](../../../includes/verifiable-credentials-brand.md)]

This page contains commonly asked questions about Verifiable Credentials and Decentralized Identity. Questions are organized into the following sections.

- [Vocabulary and basics](#the-basics)
- [Conceptual questions about decentralized identity](#conceptual-questions)
- [Questions about using Verifiable Credentials preview](#using-the-preview)


## The basics

### What is a DID? 

Decentralized Identifiers (DIDs) are unique identifiers that can be used to secure access to resources, sign and verify credentials, and facilitate application data exchange. Unlike traditional usernames and email addresses, DIDs are owned and controlled by the entity itself (be it a person, device, or company). DIDs exist independently of any external organization or trusted intermediary. [The W3C Decentralized Identifier spec](https://www.w3.org/TR/did-core/) explains DIDs in further detail.

### Why do we need a DID?

Digital trust fundamentally requires participants to own and control their identities, and identity begins at the identifier.
In an age of daily, large-scale system breaches and attacks on centralized identifier honeypots, decentralizing identity is becoming a critical security need for consumers and businesses.
Individuals owning and controlling their identities are able to exchange verifiable data and proofs. A distributed credential environment allows for the automation of many business processes that are currently manual and labor intensive.

### What is a Verifiable Credential? 

Credentials are a part of our daily lives; driver's licenses are used to assert that we're capable of operating a motor vehicle, university degrees can be used to assert our level of education, and government-issued passports enable us to travel between countries/regions. Verifiable Credentials provides a mechanism to express these sorts of credentials on the Web in a way that is cryptographically secure, privacy respecting, and machine-verifiable. [The W3C Verifiable Credentials spec](https://www.w3.org/TR/vc-data-model/) explains verifiable credentials in further detail.


## Conceptual questions

### What happens when a user loses their phone? Can they recover their identity?

There are multiple ways of offering a recovery mechanism to users, each with their own tradeoffs. We're currently evaluating options and designing approaches to recovery that offer convenience and security while respecting a user's privacy and self-sovereignty.

### How can a user trust a request from an issuer or verifier? How do they know a DID is the real DID for an organization?

We implement [the Decentralized Identity Foundation's Well Known DID Configuration spec](https://identity.foundation/.well-known/resources/did-configuration/) in order to connect a DID to a highly known existing system, domain names. Each DID created using the  Microsoft Entra Verified ID has the option of including a root domain name that will be encoded in the DID Document. Follow the article titled [Link your Domain to your Distributed Identifier](how-to-dnsbind.md) to learn more.  

<a name='why-does-the-entra-verified-id-support-ion-as-its-did-method-and-therefore-bitcoin-to-provide-decentralized-public-key-infrastructure'></a>

### Why does the Microsoft Entra Verified ID support ION as its DID method, and therefore Bitcoin to provide decentralized public key infrastructure?

Microsoft now offers two different trust systems, Web and ION. You may choose to use either one of them during tenant onboarding. ION is a decentralized, permissionless, scalable decentralized identifier Layer 2 network that runs atop Bitcoin. It achieves scalability without including a special crypto asset token, trusted validators, or centralized consensus mechanisms. We use Bitcoin for the base Layer 1 substrate because of the strength of the decentralized network to provide a high degree of immutability for a chronological event record system.

## Using the preview

### Is any of the code used in the preview open source?

Yes! The following repositories are the open-sourced components of our services.

1. [SideTree, on GitHub](https://github.com/decentralized-identity/sidetree)
1. An [Android SDK for building decentralized identity wallets, on GitHub](https://github.com/microsoft/VerifiableCredential-SDK-Android)
1. An [iOS SDK for building decentralized identity wallets, on GitHub](https://github.com/microsoft/VerifiableCredential-SDK-iOS)


### What are the licensing requirements?

There are no special licensing requirements to issue Verifiable credentials. All you need is An Azure account that has an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).



<a name='how-do-i-reset-the-entra-verified-id-service'></a>

### How do I reset the Microsoft Entra Verified ID service?

Resetting requires that you opt out and opt back into the Microsoft Entra Verified ID service, your existing verifiable credentials configurations will reset and your tenant will obtain a new DID to use during issuance and presentation.

1. Follow the [opt-out](how-to-opt-out.md) instructions.
1. Go over the Microsoft Entra Verified ID [deployment steps](verifiable-credentials-configure-tenant.md) to reconfigure the service.
    1. If you are in the European region, it's recommended that your Azure Key Vault, and container are in the same European region otherwise you may experience some performance and latency issues. Create new instances of these services in the same EU region as needed.
1. Finish [setting up](verifiable-credentials-configure-tenant.md#set-up-verified-id) your verifiable credentials service. You need to recreate your credentials.
    1. If your tenant needs to be configured as an issuer, it's recommended that your storage account is in the European region as your Verifiable Credentials service.
    2. You also need to issue new credentials because your tenant now holds a new DID.

<a name='how-can-i-check-my-azure-ad-tenants-region'></a>

### How can I check my Microsoft Entra tenant's region?

1. In the [Azure portal](https://portal.azure.com), go to Microsoft Entra ID for the subscription you use for your Microsoft Entra Verified ID deployment.
1. Under Manage, select Properties
    :::image type="content" source="media/verifiable-credentials-faq/region.png" alt-text="settings delete and opt out":::
1. See the value for Country or Region. If the value is a country or a region in Europe, your Microsoft Entra Verified ID service will be set up in Europe.

### How can I check if my tenant has the new Hub endpoint?

1. Navigate to the Verified ID in the Azure portal.  
1. Navigate to the Organization Settings. 
1. Copy your organization’s Decentralized Identifier (DID). 
1. Go to the [ION Explorer](https://identity.foundation/ion/explorer) and paste the DID in the search box 
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
            "https://verifiedid.hub.msidentity.com/v1.0/12345678-0000-0000-0000-000000000000"
          ],
          "origins": []
        }
      }
    ],
```

<a name='if-i-reconfigure-the-entra-verified-id-service-do-i-need-to-relink-my-did-to-my-domain'></a>

### If I reconfigure the Microsoft Entra Verified ID service, do I need to relink my DID to my domain?

Yes, after reconfiguring your service, your tenant has a new DID use to issue and verify verifiable credentials. You need to [associate your new DID](how-to-dnsbind.md) with your domain.

### Is it possible to request Microsoft to retrieve "old DIDs"?

No, at this point it isn't possible to keep your tenant's DID after you have opt-out of the service.

### I cannot use ngrok, what do I do?

The tutorials for deploying and running the [samples](verifiable-credentials-configure-issuer.md#prerequisites) describes the use of the `ngrok` tool as an application proxy. This tool is sometimes blocked by IT admins from being used in corporate networks. An alternative is to deploy the sample to [Azure App Service](/azure/app-service/overview) and run it in the cloud. The following links help you deploy the respective sample to Azure App Service. The Free pricing tier will be sufficient for hosting the sample. For each tutorial, you need to start by first creating the Azure App Service instance, then skip creating the app since you already have an app and then continue the tutorial with deploying it.

- Dotnet - [Publish to App Service](/azure/app-service/quickstart-dotnetcore?tabs=net60&pivots=development-environment-vs#2-publish-your-web-app)
- Node - [Deploy to App Service](/azure/app-service/quickstart-nodejs?tabs=linux&pivots=development-environment-vscode#deploy-to-azure)
- Java - [Deploy to App Service](../../app-service/quickstart-java.md?tabs=javase&pivots=platform-linux-development-environment-maven#4---deploy-the-app). You need to add the maven plugin for Azure App Service to the sample.
- Python - [Deploy using Visual Studio Code](/azure/app-service/quickstart-python?tabs=flask%2Cwindows%2Cazure-cli%2Cvscode-deploy%2Cdeploy-instructions-azportal%2Cterminal-bash%2Cdeploy-instructions-zip-azcli#3---deploy-your-application-code-to-azure)

Regardless of which language of the sample you are using, they will pickup the Azure AppService hostname `https://something.azurewebsites.net` and use it as the public endpoint. You don't need to configure something extra to make it work. If you make changes to the code or configuration, you need to redeploy the sample to Azure AppServices. Troubleshooting/debugging will not be as easy as running the sample on your local machine, where traces to the console window shows you errors, but you can achieve almost the same by using the [Log Stream](/azure/app-service/troubleshoot-diagnostic-logs#stream-logs).
 
## Next steps

- [Customize your verifiable credentials](credential-design.md)
