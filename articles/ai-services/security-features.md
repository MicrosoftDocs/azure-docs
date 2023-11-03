---
title: Azure AI services security
titleSuffix: Azure AI services
description: Learn about the security considerations for Azure AI services usage.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-services
ms.topic: conceptual
ms.date: 12/02/2022
ms.author: pafarley
ms.custom: devx-track-csharp
---

# Azure AI services security

Security should be considered a top priority in the development of all applications, and with the growth of artificial intelligence enabled applications, security is even more important. This article outlines various security features available for Azure AI services. Each feature addresses a specific liability, so multiple features can be used in the same workflow.

For a comprehensive list of Azure service security recommendations see the [Azure AI services security baseline](/security/benchmark/azure/baselines/cognitive-services-security-baseline?toc=%2Fazure%2Fcognitive-services%2FTOC.json) article.

## Security features

|Feature | Description |
|:---|:---|
| [Transport Layer Security (TLS)](/dotnet/framework/network-programming/tls) | All of the Azure AI services endpoints exposed over HTTP enforce the TLS 1.2 protocol. With an enforced security protocol, consumers attempting to call an Azure AI services endpoint should follow these guidelines: </br>- The client operating system (OS) needs to support TLS 1.2.</br>- The language (and platform) used to make the HTTP call need to specify TLS 1.2 as part of the request. Depending on the language and platform, specifying TLS is done either implicitly or explicitly.</br>- For .NET users, consider the [Transport Layer Security best practices](/dotnet/framework/network-programming/tls). |
| [Authentication options](./authentication.md)| Authentication is the act of verifying a user's identity. Authorization, by contrast, is the specification of access rights and privileges to resources for a given identity. An identity is a collection of information about a <a href="https://en.wikipedia.org/wiki/Principal_(computer_security)" target="_blank">principal</a>, and a principal can be either an individual user or a service.</br></br>By default, you authenticate your own calls to Azure AI services using the subscription keys provided; this is the simplest method but not the most secure. The most secure authentication method is to use managed roles in Microsoft Entra ID. To learn about this and other authentication options, see [Authenticate requests to Azure AI services](./authentication.md). |
| [Key rotation](./authentication.md)| Each Azure AI services resource has two API keys to enable secret rotation. This is a security precaution that lets you regularly change the keys that can access your service, protecting the privacy of your service in the event that a key gets leaked. To learn about this and other authentication options, see [Rotate keys](./rotate-keys.md). |
| [Environment variables](cognitive-services-environment-variables.md) | Environment variables are name-value pairs that are stored within a specific development environment. You can store your credentials in this way as a more secure alternative to using hardcoded values in your code. However, if your environment is compromised, the environment variables are compromised as well, so this is not the most secure approach.</br></br> For instructions on how to use environment variables in your code, see the [Environment variables guide](cognitive-services-environment-variables.md). |
| [Customer-managed keys (CMK)](./encryption/cognitive-services-encryption-keys-portal.md) | This feature is for services that store customer data at rest (longer than 48 hours). While this data is already double-encrypted on Azure servers, users can get extra security by adding another layer of encryption, with keys they manage themselves. You can link your service to Azure Key Vault and manage your data encryption keys there. </br></br>Only some services can use CMK; look for your service on the [Customer-managed keys](./encryption/cognitive-services-encryption-keys-portal.md) page.|
| [Virtual networks](./cognitive-services-virtual-networks.md) | Virtual networks allow you to specify which endpoints can make API calls to your resource. The Azure service will reject API calls from devices outside of your network. You can set a formula-based definition of the allowed network, or you can define an exhaustive list of endpoints to allow. This is another layer of security that can be used in combination with others. |
| [Data loss prevention](./cognitive-services-data-loss-prevention.md) | The data loss prevention feature lets an administrator decide what types of URIs their Azure resource can take as inputs (for those API calls that take URIs as input). This can be done to prevent the possible exfiltration of sensitive company data: If a company stores sensitive information (such as a customer's private data) in URL parameters, a bad actor inside that company could submit the sensitive URLs to an Azure service, which surfaces that data outside the company. Data loss prevention lets you configure the service to reject certain URI forms on arrival.|
| [Customer Lockbox](../security/fundamentals/customer-lockbox-overview.md) |The Customer Lockbox feature provides an interface for customers to review and approve or reject data access requests. It's used in cases where a Microsoft engineer needs to access customer data during a support request. For information on how Customer Lockbox requests are initiated, tracked, and stored for later reviews and audits, see the [Customer Lockbox guide](../security/fundamentals/customer-lockbox-overview.md).</br></br>Customer Lockbox is available for the following services:</br>- Azure OpenAI</br>- Translator</br>- Conversational language understanding</br>- Custom text classification</br>- Custom named entity recognition</br>- Orchestration workflow.
| [Bring your own storage (BYOS)](./speech-service/speech-encryption-of-data-at-rest.md)| The Speech service doesn't currently support Customer Lockbox. However, you can arrange for your service-specific data to be stored in your own storage resource using bring-your-own-storage (BYOS). BYOS allows you to achieve similar data controls to Customer Lockbox. Keep in mind that Speech service data stays and is processed in the Azure region where the Speech resource was created. This applies to any data at rest and data in transit. For customization features like Custom Speech and Custom Voice, all customer data is transferred, stored, and processed in the same region where the Speech service resource and BYOS resource (if used) reside. </br></br>To use BYOS with Speech, follow the [Speech encryption of data at rest](./speech-service/speech-encryption-of-data-at-rest.md) guide.</br></br> Microsoft does not use customer data to improve its Speech models. Additionally, if endpoint logging is disabled and no customizations are used, then no customer data is stored by Speech. |

## Next steps

* Explore [Azure AI services](./what-are-ai-services.md) and choose a service to get started.
