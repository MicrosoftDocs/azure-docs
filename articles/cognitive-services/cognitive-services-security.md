---
title: Azure Cognitive Services security
titleSuffix: Azure Cognitive Services
description: Learn about the security considerations for Cognitive Services usage.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.topic: overview
ms.date: 08/09/2022
ms.author: pafarley
ms.custom: "devx-track-python, devx-track-js, devx-track-csharp"
---

# Azure Cognitive Services security

Security should be considered a top priority in the development of all applications. With the growth of artificial intelligence enabled applications, security is even more important. This article outlines various aspects of Azure Cognitive Services security, such as the use of transport layer security, authentication, securely configuring sensitive data, and more.

## Transport Layer Security (TLS)

All of the Cognitive Services endpoints exposed over HTTP enforce the TLS 1.2 protocol. With an enforced security protocol, consumers attempting to call a Cognitive Services endpoint should follow these guidelines:

* The client Operating System (OS) needs to support TLS 1.2.
* The language (and platform) used to make the HTTP call need to specify TLS 1.2 as part of the request.
  * Depending on the language and platform, specifying TLS is done either implicitly or explicitly.

For .NET users, consider the <a href="/dotnet/framework/network-programming/tls" target="_blank">Transport Layer Security best practices </a>.

## Authentication

Authentication is the act of verifying a user's identity. Authorization, by contrast, is the specification of access rights and privileges to resources for a given identity.

An identity is a collection of information about a <a href="https://en.wikipedia.org/wiki/Principal_(computer_security)" target="_blank">principal </a>. Identity providers (IdP) provide identities to authentication services.  Several of the Cognitive Services offerings, include Azure role-based access control (Azure RBAC), can be used to simplify some of the work of manually managing principals. For more information, see [Azure role-based access control for Azure resources](../role-based-access-control/overview.md).

For more information on authentication with subscription keys, access tokens and Azure Active Directory, see <a href="/azure/cognitive-services/authentication" target="_blank">Authenticate requests to Azure Cognitive Services</a>.

## Environment variables and application configuration

Environment variables are name-value pairs that are stored within a specific development environment. They're a more secure alternative to using hardcoded values for sensitive data.

> [!CAUTION]
> Do not use hardcoded values for sensitive data, doing so is a major security vulnerability.

> [!NOTE]
> While environment variables are stored in plain text, they are isolated to an environment. But if an environment is compromised, then the environment variables are as well.

For instructions on how to use environment variables in your code, see the [Environment variables guide](cognitive-services-environment-variables.md).


## Customer-managed keys (CMK)

## Virtual networks

## Data loss prevention

## Customer Lockbox

Customer Lockbox for Microsoft Azure provides an interface for customers to review and approve or reject customer data access requests. It's used in cases where a Microsoft engineer needs to access customer data during a support request. For information on how Customer Lockbox requests are initiated, tracked, and stored for later reviews and audits, see the [Customer Lockbox guide](../security/fundamentals/customer-lockbox-overview.md).

Customer Lockbox is available for the following services:

* Translator
* Conversational language understanding
* Custom text classification
* Custom named entity recognition
* Orchestration workflow

For the following services, Microsoft engineers will not access any customer data in the E0 tier:

* Language Understanding
* Face
* Content Moderator
* Personalizer

To request the ability to use the E0 SKU, fill out and submit the [Request form](https://aka.ms/cogsvc-cmk). In approximately 3-5 business days, you'll get an update on the status of your request. Depending on demand, you may be placed in a queue and approved as space becomes available. Once you're approved for using the E0 SKU, you'll need to create a new resource from the Azure portal and select E0 as the Pricing Tier. Users won't be able to upgrade from F0 to the new E0 SKU.

The Speech service doesn't currently support Customer Lockbox. However, customer data can be stored using bring-your-own-storage (BYOS), allowing you to achieve similar data controls to Customer Lockbox. Keep in mind that Speech service data stays and is processed in the region where the Speech resource was created. This applies to any data at rest and data in transit. For customization features like Custom Speech and Custom Voice, all customer data is transferred, stored, and processed in the same region where the BYOS resource (if used) and Speech service resource reside.

> [!IMPORTANT]
> Microsoft does not use customer data to improve its Speech models. Additionally, if endpoint logging is disabled and no customizations are used, then no customer data is stored.

## Next steps

* Explore [Cognitive Services](./what-are-cognitive-services.md)