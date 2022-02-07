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

Starting February 15th 2022:
- The Azure Active Directory Verifiable Credentials service can store and handle data operations for European instances of Azure Active Directory in the European region. If you configured your Azure AD Verifiable Credentials service before March 31st, 2022, you may be [required to take action](verifiable-credentials-faq.md).
- Azure Active Directory Verifiable Credentials customers can take advantage of enhancements to credential revocation that add a higher degree of privacy through the implementation of the [W3C Status List 2021](https://w3c-ccg.github.io/vc-status-list-2021/) standard.  

Your Azure AD tenant must re-onboard the Azure AD Verifiable Credentials service and this will reset all configuration. 
## October 2021

You can now use [Request Service REST API](get-started-request-api.md) to build applications that can issue and verify credentials from any programming language you're using. This new REST API provides an improved abstraction layer and integration to the Azure AD Verifiable Credentials Service.

It's a good idea to start using the API soon, because the NodeJS SDK will be deprecated in the following months. Documentation and samples now use the Request Service REST API. For more information, see [Request Service REST API (preview)](get-started-request-api.md).

## April 2021

You can now issue [verifiable credentials](decentralized-identifier-overview.md) in Azure AD. This service is useful when you need to represent proof of employment, education, or any other claim, so that the holder of such a credential can decide when, and with whom, to share their credentials. Each credential is signed by using cryptographic keys associated with the decentralized identity that the user owns and controls.
