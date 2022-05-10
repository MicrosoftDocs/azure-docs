---
title: What's new for Azure Active Directory Verifiable Credentials (preview)
description: Recent updates for Azure Active Directory Verifiable Credentials
author: barclayn
manager: rkarlin
ms.service: active-directory
ms.subservice: verifiable-credentials
ms.topic: reference
ms.date: 05/10/2022
ms.custom: references_regions
ms.author: barclayn

#Customer intent: As an Azure AD Verifiable Credentials issuer, verifier or developer, I want to know what's new in the product so that I can make full use of the functionality as it becomes available.

---

# What's new in Azure Active Directory Verifiable Credentials (preview)

This article lists the latest features, improvements, and changes in the Azure Active Directory (Azure AD) Verifiable Credentials service.

## May 2022

We are expanding our service to all Azure AD customers! Verifiable credentials are now available to everyone with an Azure AD subscription (Free and Premium). Existing tenants that configured the Verifiable Credentials service prior to May 4, 2022 must make a [small change](verifiable-credentials-faq.md#updating-the-vc-service-configuration) to avoid service disruptions.

## April 2022

Starting next month, we are rolling out exciting changes to the subscription requirements for the Verifiable Credentials service. Administrators must perform a small configuration change before **May 4, 2022** to avoid service disruptions. Follow [these steps](verifiable-credentials-faq.md?#updating-the-vc-service-configuration) to apply the required configuration changes.
>[!IMPORTANT]
> If changes are not applied before **May 4, 2022**, you will experience errors on issuance and presentation for your application or service using the Azure AD Verifiable Credentials Service. [Update service configuration instructions](verifiable-credentials-faq.md?#updating-the-vc-service-configuration).

## March 2022

- Azure AD Verifiable Credentials customers can now change the [domain linked](how-to-dnsbind.md) to their DID easily from the Azure portal.
- We made updates to Microsoft Authenticator that change the interaction between the Issuer of a verifiable credential and the user presenting the verifiable credential. This update forces all Verifiable Credentials to be reissued in Microsoft Authenticator for iOS. [More information](whats-new.md?#microsoft-authenticator-did-generation-update)

## February 2022

We are rolling out some breaking changes to our service. These updates require Azure AD Verifiable Credentials service reconfiguration. End-users need to have their verifiable credentials reissued.

- The Azure AD Verifiable Credentials service can now store and handle data processing in the Azure European region. [More information](whats-new.md?#azure-ad-verifiable-credentials-available-in-europe)
- Azure AD Verifiable Credentials customers can take advantage of enhancements to credential revocation. These changes add a higher degree of privacy through the implementation of the [W3C Status List 2021](https://w3c-ccg.github.io/vc-status-list-2021/) standard. [More information](whats-new.md?#credential-revocation-with-enhanced-privacy)
- We made updates to Microsoft Authenticator that change the interaction between the Issuer of a verifiable credential and the user presenting the verifiable credential. This update forces all Verifiable Credentials to be reissued in Microsoft Authenticator for Android. [More information](whats-new.md?#microsoft-authenticator-did-generation-update)

>[!IMPORTANT]
> All Azure AD Verifiable Credential customers receiving a banner notice in the Azure portal need to go through a service reconfiguration before March 31st 2022. On March 31st 2022 tenants that have not been reconfigured will lose access to any previous configuration. Administrators will have to set up a new instance of the Azure AD Verifiable Credential service. Learn more about how to [reconfigure your tenant](verifiable-credentials-faq.md?#how-do-i-reset-the-azure-ad-verifiable-credentials-service).

### Azure AD Verifiable Credentials available in Europe

Since the beginning of the Azure AD Verifiable Credentials service public preview, the service has only been available in our Azure North America region. Now, the service is also available in our Azure Europe region.

- New customers with Azure AD European tenants now have their Verifiable Credentials data located and processed in our Azure Europe region.
- Customers with Azure AD tenants setup in Europe who start using the Azure AD Verifiable Credentials service after February 15, 2022, have their data automatically processed in Europe. There's no need to take any further actions.
- Customers with Azure AD tenants setup in Europe that started using the Azure AD Verifiable Credentials service before February 15, 2022, are required to reconfigure the service on their tenants before March 31, 2022.

Take the following steps to configure the Verifiable Credentials service in Europe:

1. [Check the location](verifiable-credentials-faq.md#how-can-i-check-my-azure-ad-tenants-region) of your Azure Active Directory to make sure is in Europe.
1. [Reconfigure the Verifiable Credentials service](verifiable-credentials-faq.md?#how-do-i-reset-the-azure-ad-verifiable-credentials-service) in your tenant. 

>[!IMPORTANT]
> On March 31st, 2022 European tenants that have not been [reconfigured](verifiable-credentials-faq.md?#how-do-i-reset-the-azure-ad-verifiable-credentials-service) in Europe will lose access to any previous configuration and will require to configure a new instance of the Azure AD Verifiable Credential service.

#### Are there any changes to the way that we use the Request API as a result of this move?

Applications that use the Azure Active Directory Verifiable Credentials service must use the Request API endpoint that corresponds to their Azure AD tenant's region.  

| Tenant region | Request API endpoint POST |
|------------|-------------------|
| Europe | `https://beta.eu.did.msidentity.com/v1.0/{tenantID}/verifiablecredentials/request` |
| Non-EU | `https://beta.did.msidentity.com/v1.0/{tenantID}/verifiablecredentials/request`  |

To confirm which endpoint you should use, we recommend checking your Azure AD tenant's region as described above. If the Azure AD tenant is in the EU, you should use the Europe endpoint.  

### Credential Revocation with Enhanced Privacy

The Azure AD Verifiable Credential service supports the [W3C Status List 2021](https://w3c-ccg.github.io/vc-status-list-2021/) standard. Each Issuer tenant now has an [Identity Hub](https://identity.foundation/identity-hub/spec/) endpoint used by verifiers to check on the status of a credential using a privacy-respecting mechanism. The identity hub endpoint for the tenant is also published in the DID document. This feature replaces the current status endpoint.

To uptake this feature follow the next steps:
1. [Check if your tenant has the Hub endpoint](verifiable-credentials-faq.md#how-can-i-check-if-my-tenant-has-the-new-hub-endpoint).
    1. If so, go to the next step.
    1. If not, [reconfigure the Verifiable Credentials service](verifiable-credentials-faq.md?#how-do-i-reset-the-azure-ad-verifiable-credentials-service) in your tenant and go to the next step.
1. Create new verifiable credentials contracts. In the rules file you must add the ` "credentialStatusConfiguration": "anonymous" ` property to start using the new feature in combination with the Hub endpoint for your credentials:

Sample contract file:

  ``` json 
  {
    "attestations": {
      "idTokens": [
        {
          "id": "https://self-issued.me",
          "mapping": {
            "firstName": { "claim": "$.given_name" },
            "lastName": { "claim": "$.family_name" }
          },
          "configuration": "https://self-issued.me",
          "client_id": "",
          "redirect_uri": ""
        }
      ]
    },
    "validityInterval": 2592001,
  "credentialStatusConfiguration": "anonymous",
    "vc": {
      "type": [ "VerifiedCredentialExpert" ]
    }
  } 
  ```

3. You have to issue new verifiable credentials using your new configuration. All verifiable credentials previously issued continue to exist. Your previous DID remains resolvable however, they use the previous status endpoint implementation.

>[!IMPORTANT]
> You have to reconfigure your Azure AD Verifiable Credential service instance to create your new Identity hub endpoint. You have until March 31st 2022, to schedule and manage the reconfiguration of your deployment. On March 31st, 2022 deployments that have not been reconfigured will lose access to any previous Azure AD Verifiable Credentials service configuration. Administrators will need to set up a new service instance.

### Microsoft Authenticator DID Generation Update

We are making protocol updates in Microsoft Authenticator to support Single Long Form DID, thus deprecating the use of pairwise. With this update, your DID in Microsoft Authenticator will be used of every issuer and relaying party exchange. Holders of verifiable credentials using Microsoft Authenticator must get their verifiable credentials reissued as any previous credentials aren't going to continue working.

## December 2021

- We added [Postman collections](https://github.com/Azure-Samples/active-directory-verifiable-credentials/tree/main/Postman) to our samples as a quick start to start using the Request Service REST API.
- New sample added that demonstrates the integration of [Azure AD Verifiable Credentials with Azure AD B2C](https://github.com/Azure-Samples/active-directory-verifiable-credentials/tree/main/B2C).
- Sample for setting up the Azure AD Verifiable Credentials services using [PowerShell and an ARM template](https://github.com/Azure-Samples/active-directory-verifiable-credentials/tree/main/ARM).
- Sample Verifiable Credential configuration files to show sample cards for [IDToken](https://github.com/Azure-Samples/active-directory-verifiable-credentials/tree/main/CredentialFiles/IDToken), [IDTokenHit](https://github.com/Azure-Samples/active-directory-verifiable-credentials/tree/main/CredentialFiles/IDTokenHint) and [Self-attested](https://github.com/Azure-Samples/active-directory-verifiable-credentials/tree/main/CredentialFiles/IDTokenHint) claims.

## November 2021

- We made updates to the Request Service REST API for [issuance](issuance-request-api.md?#callback-type) and [presentation](presentation-request-api.md?#callback-type)
Callback types enforcing rules so that URL endpoints for callbacks are reachable.
- UX updates to the Microsoft Authenticator verifiable credentials experience: Animations on card selection from the wallet.

## October 2021

You can now use [Request Service REST API](get-started-request-api.md) to build applications that can issue and verify credentials from any programming language. This new REST API provides an improved abstraction layer and integration to the Azure AD Verifiable Credentials Service.

It's a good idea to start using the API soon, because the NodeJS SDK will be deprecated in the following months. Documentation and samples now use the Request Service REST API. For more information, see [Request Service REST API (preview)](get-started-request-api.md).

## April 2021

You can now issue [verifiable credentials](decentralized-identifier-overview.md) in Azure AD. This service is useful when you need to present proof of employment, education, or any other claim. The holder of such a credential can decide when, and with whom, to share their credentials. Each credential is signed by using cryptographic keys associated with the decentralized identity that the user owns and controls.
