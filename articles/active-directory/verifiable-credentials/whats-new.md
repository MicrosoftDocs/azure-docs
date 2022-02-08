---
title: What's new for Azure Active Directory Verifiable Credentials (preview)
description: Recent updates for Azure Active Directory Verifiable Credentials
author: barclayn
manager: karenhoran
ms.service: active-directory
ms.subservice: verifiable-credentials
ms.topic: reference
ms.date: 02/07/2022
ms.author: barclayn

#Customer intent: As an Azure AD Verifiable Credentials issuer, verifier or developer, I want to know what's new in the product so that I can make full use of the functionality as it becomes available.

---

# What's new in Azure Active Directory Verifiable Credentials (preview)

This article lists the latest features, improvements, and changes in the Azure Active Directory (Azure AD) Verifiable Credentials service.
## February 2022

We are rolling out a couple of important updates to our service that require Azure AD Verifiable Credentials service [reconfiguration](verifiable-credentials-faq.md?#how-do-i-redeploy-the-azure-ad-verifiable-credentials-service).

- The Azure AD Verifiable Credentials service can now store and handle data processing in the Azure European region. [More information](https://aka.ms/vc/EUannouncement)
- Azure Active Directory Verifiable Credentials customers can take advantage of enhancements to credential revocation that add a higher degree of privacy through the implementation of the [W3C Status List 2021](https://w3c-ccg.github.io/vc-status-list-2021/) standard. [Read more](https://aka.ms/vc/EUannouncement)

>[!IMPORTANT]
> All Azure Active Directory Verifiable Credential receiving a banner notice in the Azure portal need to go through a redeployment process before March 31st 2022. Any tenants that have not [redeployed](verifiable-credentials-faq.md?#how-do-i-redeploy-the-azure-ad-verifiable-credentials-service) by then will become inaccessible and administrators will have to configure a new service instance before they can continue using the features provided by Azure Active Directory Verifiable Credentials.

### European region support

Since the Azure AD Verifiable Credentials service's Public Preview rollout, the service has been available in our Azure North America region. Now, the service is also available in our Azure European region. Customers with Azure AD tenants setup in Europe will have Verifiable Credentials data located and processed in our Azure Europe region. Customers with Azure AD tenants setup in Europe who start using the Azure AD Verifiable Credentials service after February 15, 2022, will automatically have their data processed in Europe and don't need to take any further actions. Customers with Azure AD tenants setup in Europe that started using the Azure AD Verifiable Credentials service before February 15, 2022, are required to reconfigure the service on their tenants before March 31, 2022.  

>[!IMPORTANT]
> On March 31st, 2022, all Azure Active Directory Verifiable credentials deployments in subscriptions with Azure Active Directory instances in the European region will have their verifiable credential deployments opt-out and opt back in. All service configuration will get reset. You should schedule and manage your [redeployment](verifiable-credentials-faq.md?#how-do-i-redeploy-the-azure-ad-verifiable-credentials-service) avoid unscheduled disruptions.

#### How can I check my Azure AD Tenant's region?

On March 31, 2022, we'll use your Azure Active Directory information to determine where your Azure AD tenant should have its Verifiable Credentials data processed.

1. In the [Azure portal](https://portal.azure.com), go to Azure Active Directory for the subscription you use for your Azure Active Directory Verifiable credentials deployment.
1. Under Manage, select Properties
    1. :::image type="content" source="media/verifiable-credentials-faq/region.png" alt-text="settings delete and opt out":::
1. See the value for Country or Region. If the value is a country or a region in Europe, your Azure AD Verifiable Credentials service will be set up in Europe.

#### My tenant is in Europe, and I've been using the Azure AD Verifiable Credentials service before March 31, 2022. What should I do?

Customers with Azure AD tenants setup in Europe that started using the Azure AD Verifiable Credentials service before March 31, 2022, are encouraged to schedule and manage [redeployment]verifiable-credentials-faq.md?#how-do-i-redeploy-the-azure-ad-verifiable-credentials-service) for each of their tenants.  

#### Are there any changes to the way that we use the Request API as a result of this move?

Applications that use the Azure Active Directory Verifiable Credentials service must use the Request API endpoint that corresponds to their Azure AD tenant's region.  

| Tenant region | Request API endpoint POST |
|------------|-------------------|
| Europe | https://beta.eu.did.msidentity.com/v1.0/{tenantID}/verifiablecredentials/request |
| Non-EU | https://beta.did.msidentity.com/v1.0/{tenantID}/verifiablecredentials/request  |

To confirm which endpoint you should use, we recommend checking your Azure AD tenant's region as described above. If the Azure AD tenant is in the EU, you should use the Europe endpoint.  

### Credential Revocation with Enhanced Privacy

With the implementation of the [W3C Status List 2021](https://w3c-ccg.github.io/vc-status-list-2021/) each Issuer tenant will have an [Identity Hub](https://identity.foundation/identity-hub/spec/) that may be used by verifiers to verify the status of a credential using a privacy-respecting endpoint. The identity hub endpoint for the tenant is published in the DID document. This feature replaces the current status endpoint.

Tenant Administrators have until March 31, 2022, to schedule and manage the reconfiguration of the verifiable credential service. On March 31, 2022 tenants that haven't completed the reconfiguration process will be automatically reset and will lose access to any previous configuration. Customers will be required to configure a new instance of the Azure AD Verifiable Credential service.

#### How can I check if my tenant has the new Hub endpoint?

1. In the Azure portal, go to the Verifiable Credentials service.
1. Navigate to the Organization Settings. 
1. Copy your organization’s Decentralized Identifier (DID). 
1. Go to the ION Explorer and paste the DID in the search box 
1. Inspect your DID document and search for the “#hub” node.

:::image type="content" source="media/verifiable-credentials-faq/identity-hub.png" alt-text="Identity hubs":::

If you don’t see the “#hub” node in your DID document. You need to redeploy your tenant.


## December 2021

- We added [Postman collections](https://github.com/Azure-Samples/active-directory-verifiable-credentials/tree/main/Postman) to our samples as a quick start to start using the Request Service REST API.
- New sample added that demonstrates the integration of [Azure AD Verifiable Credentials with Azure AD B2C](https://github.com/Azure-Samples/active-directory-verifiable-credentials/tree/main/B2C).
- Fastrack setup sample for setting up the Azure AD Verifiable Credentials services using [powershell and an ARM template](https://github.com/Azure-Samples/active-directory-verifiable-credentials/tree/main/ARM).
- Sample Verifiable Credential configuration files to show sample cards for [IDToken](https://github.com/Azure-Samples/active-directory-verifiable-credentials/tree/main/CredentialFiles/IDToken), [IDTokenHit](https://github.com/Azure-Samples/active-directory-verifiable-credentials/tree/main/CredentialFiles/IDTokenHint) and [Self-attested](https://github.com/Azure-Samples/active-directory-verifiable-credentials/tree/main/CredentialFiles/IDTokenHint) claims.

## November 2021

- We made updates to the Request Service REST API for [issuance](issuance-request-api.md?#callback-type) and [presentation](presentation-request-api.md?#callback-type)
Callback types enforcing rules so that URL endpoints for callbacks are reachable.
- UX updates to the Microsoft Authenticator verifiable credentials experience: Animations on card selection from the wallet.

## October 2021

You can now use [Request Service REST API](get-started-request-api.md) to build applications that can issue and verify credentials from any programming language you're using. This new REST API provides an improved abstraction layer and integration to the Azure AD Verifiable Credentials Service.

It's a good idea to start using the API soon, because the NodeJS SDK will be deprecated in the following months. Documentation and samples now use the Request Service REST API. For more information, see [Request Service REST API (preview)](get-started-request-api.md).

## April 2021

You can now issue [verifiable credentials](decentralized-identifier-overview.md) in Azure AD. This service is useful when you need to represent proof of employment, education, or any other claim, so that the holder of such a credential can decide when, and with whom, to share their credentials. Each credential is signed by using cryptographic keys associated with the decentralized identity that the user owns and controls.
