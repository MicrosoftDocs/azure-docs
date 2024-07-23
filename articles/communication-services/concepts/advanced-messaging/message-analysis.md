---
title: Connect Azure Communication Services to Azure OpenAI services for Message Analysis 
titleSuffix: An Azure Communication Services concept document
description: Provides a conceptual doc for connecting Azure Communication Services to Azure AI services for Message Analysis.
author: bashan
ms.service: azure-communication-services
ms.subservice: advanced-messaging
ms.topic: conceptual
ms.date: 07/27/2024
ms.author: bashan
services: azure-communication-services
---

# Connect Azure Communication Services to Azure OpenAI services for Message Analysis

[!INCLUDE [Public Preview Notice](./includes/public-preview-include-document.md)]

Azure Communication Services Advanced Messaging empowers developers to create essential workflows for incoming messages within Azure Communication Services using event triggers. These triggers can initiate actions rooted in tailored business logic. With the integration of our AI-driven event trigger, developers are equipped to analyze and gain insights from inbound messages to enhance a customer self-service approach and utilize AI analysis to bolster customer support. Content analysis is streamlined using Azure OpenAI Services, which also supports a variety of AI model preferences.
In addition, there is no need for developers and businesses to handle credentials themselves. When linking your Azure AI services, managed identities are utilized to access resources owned by you. 

Developers can also leverage managed identities to authenticate with any service that accepts Microsoft Entra authentication.
Integrating Azure Open AI endpoints into your application's messaging framework can be accomplished effortlessly, enabling the Message Analysis functionality in Azure Portal. By enabling the feature, supplying Azure Open AI with the appropriate endpoint, and selecting the preferred model, we empower developers to meet their needs and scale effectively. This efficient method allows for meeting analytical objectives without the need to invest considerable time and effort into developing and maintaining a custom AI solution for interpreting message content.

> [!NOTE]
> This integration is supported in limited regions for Azure AI services, for more information about which regions are supported please view the limitations section at the bottom of this document. This integration only supports Multi-service Cognitive Service resource, we recommend if you're creating a new Azure AI Service resource you create a Multi-service Cognitive Service resource or when you're connecting an existing resource confirm that it is a Multi-service Cognitive Service resource.

## Common Scenarios for Message Analysis 
By integrating the Azure OpenAI you are delivering dfferentiated customer experiences and modernize the internal processes. Some of the key usecases that you can incorporate in your applications are

### Language Detection

Identifies the language of the message, provides confidence scores, and translate the message into English if the original message is not in English

### Intent Recognition
Analyzes the message to determine the customer’s purpose, such as seeking help or providing feedback.

### Key Phrase Extraction
Extracts important terms and names from the message, which can be crucial for context.

### Build Automation

As a business, I can build automation on top of incoming WhatsApp messages.


## Azure AI services regions supported

This integration between Azure Communication Services and Azure AI services is only supported in the following regions:
- centralus
- northcentralus
- southcentralus
- westcentralus
- eastus
- eastus2
- westus
- westus2
- westus3
- canadacentral
- northeurope
- westeurope
- uksouth
- southafricanorth
- centralindia
- eastasia
- southeastasia
- australiaeast
- brazilsouth
- uaenorth


## Next steps
- Learn about [Message Analysis](../quickstarts/advanced-messaging/whatsapp/message-analysis-with-azure-openai-quickstart)
- [Handle Advanced Messaging events](./handle-advanced-messaging-events.md)
- [Send WhatsApp template messages](./concepts/advanced-messaging/whatsapp/template-messages.md)
